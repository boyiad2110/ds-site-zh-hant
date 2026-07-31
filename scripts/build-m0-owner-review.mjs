import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { p } from './lib/root.mjs'

// 通用產生器：一次只產一個 milestone 的 JSON 稽核版驗收表，milestone 由呼叫時指定。
// 範圍完整性（缺、多、未配對 id）已由 scripts/verify-milestones.mjs 把關，這裡不重複判斷。
// 省略參數時預設 m0，保留舊有「不帶參數」的呼叫方式仍然可用。
const milestone = process.argv[2] ?? 'm0'

const read = (path) => JSON.parse(readFileSync(path, 'utf8'))
const groups = [
  { key: 'abilities', title: '招式' },
  { key: 'conditions', title: '狀態' },
  { key: 'features', title: '職業特性' },
]
const fence = (value) => `\n\`\`\`json\n${JSON.stringify(value, null, 2)}\n\`\`\`\n`
const clean = (value) => JSON.parse(JSON.stringify(value, (key, item) =>
  ['$comment', 'normalizedHash'].includes(key) ? undefined : item))

// id → {group, canon, zh} 索引涵蓋全部 data/canon/；milestone 只決定這次收錄哪些 id。
const byId = new Map()
for (const group of groups) {
  const canonDir = p(`data/canon/${group.key}`)
  const zhDir = p(`data/zh-Hant/${group.key}`)
  for (const name of readdirSync(canonDir).filter((n) => n.endsWith('.json')).sort()) {
    const canon = read(resolve(canonDir, name))
    const zh = read(resolve(zhDir, name))
    byId.set(canon.id, { group, canon, zh })
  }
}

const manifest = read(p(`releases/milestones/${milestone}.json`))
const upper = milestone.toUpperCase()

const lines = [
  `# ${upper} · ${manifest.ids.length} 筆內容逐筆驗收表`,
  '',
  '> 這份文件是擁有者驗收閘門，不是核准紀錄。所有未勾選條目維持現有狀態；工具不得自行把 Canon 改為 `verified`，也不得把繁中草稿改為 `reviewed`。',
  '',
  '## 驗收方式',
  '',
  '逐筆核對來源頁碼、英文正典、繁中譯文、TI 決策與結構注意事項。每一筆請只勾選一個結果；需要修改時，直接在該條目的「擁有者備註」下補充。',
  '',
  `- [ ] 我已完成全部 ${manifest.ids.length} 筆驗收`,
  '- [ ] 可將核准條目的 Canon 升為 `verified`',
  '- [ ] 可將核准的繁中草稿升為 `reviewed`',
  '',
  '---',
]

let total = 0
for (const group of groups) {
  const entries = manifest.ids
    .map((id) => byId.get(id))
    .filter((entry) => entry?.group === group)
  if (entries.length === 0) continue
  total += entries.length
  lines.push('', `## ${group.title} · ${entries.length} 筆`, '')

  for (const [index, { canon, zh }] of entries.entries()) {
    const decisions = zh.meta?.decisions?.length ? zh.meta.decisions.join('、') : '無個別 TI；套用全域指南'
    const notes = zh.meta?.commonProcessing?.length ? zh.meta.commonProcessing.map((note) => `- ${note}`).join('\n') : '- 無'
    lines.push(
      `### ${index + 1}. ${zh.nameZhHant} · ${canon.name}`,
      '',
      `- ID：\`${canon.id}\``,
      `- 來源：Heroes v${canon.source.version}，印刷頁 ${canon.source.printedPage}（PDF 頁 ${canon.source.pdfPage}）`,
      `- Canon 狀態：\`${canon.canonReviewStatus}\`；繁中狀態：\`${zh.meta?.status ?? 'draft'}\``,
      `- TI／裁決：${decisions}`,
      '',
      '**英文正典**',
      fence(clean(canon)),
      '**繁中內容**',
      fence(clean(zh)),
      '**結構與翻譯注意事項**',
      '',
      notes,
      '',
      '**擁有者裁決**',
      '',
      `- [ ] 核准，內容與結構皆可進入正式 ${upper}`,
      '- [ ] 需要修改',
      '',
      '擁有者備註：',
      '',
      '> ',
      '',
      '---',
    )
  }
}

for (const id of manifest.ids) {
  if (!byId.has(id)) throw new Error(`milestone ${milestone} 宣告了 ${id}，但 data/canon/ 找不到對應檔案`)
}

const byGroupCount = groups.map((g) => `${manifest.ids.map((id) => byId.get(id)).filter((e) => e?.group === g).length} ${g.title}`).join('、')
lines.splice(7, 0, `本次清單共 ${total} 筆：${byGroupCount}。`)
mkdirSync(p('docs'), { recursive: true })
const outputName = `docs/${milestone}-owner-review.md`
writeFileSync(p(outputName), `${lines.join('\n')}\n`, 'utf8')
console.log(`${outputName}：${total} 筆待逐筆驗收`)

import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { p } from './lib/root.mjs'

const read = (path) => JSON.parse(readFileSync(path, 'utf8'))
const groups = [
  { key: 'abilities', title: '招式', expected: 16 },
  { key: 'conditions', title: '狀態', expected: 9 },
  { key: 'features', title: '職業特性', expected: 3 },
]
const fence = (value) => `\n\`\`\`json\n${JSON.stringify(value, null, 2)}\n\`\`\`\n`
const clean = (value) => JSON.parse(JSON.stringify(value, (key, item) =>
  ['$comment', 'normalizedHash'].includes(key) ? undefined : item))

const lines = [
  '# M0 · 28 筆內容逐筆驗收表',
  '',
  '> 這份文件是擁有者驗收閘門，不是核准紀錄。所有未勾選條目維持現有狀態；工具不得自行把 Canon 改為 `verified`，也不得把繁中草稿改為 `reviewed`。',
  '',
  '## 驗收方式',
  '',
  '逐筆核對來源頁碼、英文正典、繁中譯文、TI 決策與結構注意事項。每一筆請只勾選一個結果；需要修改時，直接在該條目的「擁有者備註」下補充。',
  '',
  '- [ ] 我已完成全部 28 筆驗收',
  '- [ ] 可將核准條目的 Canon 升為 `verified`',
  '- [ ] 可將核准的繁中草稿升為 `reviewed`',
  '',
  '---',
]

let total = 0
for (const group of groups) {
  const canonDir = p(`data/canon/${group.key}`)
  const zhDir = p(`data/zh-Hant/${group.key}`)
  const entries = readdirSync(canonDir).filter((name) => name.endsWith('.json')).sort().map((name) => ({
    canon: read(resolve(canonDir, name)),
    zh: read(resolve(zhDir, name)),
  }))
  if (entries.length !== group.expected) throw new Error(`${group.title}應有 ${group.expected} 筆，目前 ${entries.length} 筆`)
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
      '- [ ] 核准，內容與結構皆可進入正式 M0',
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

if (total !== 28) throw new Error(`M0 驗收表應有 28 筆，目前 ${total} 筆`)
lines.splice(7, 0, `本次清單共 ${total} 筆：16 招式、9 狀態、3 職業特性。`)
mkdirSync(p('docs'), { recursive: true })
writeFileSync(p('docs/m0-owner-review.md'), `${lines.join('\n')}\n`, 'utf8')
console.log(`docs/m0-owner-review.md：${total} 筆待逐筆驗收`)

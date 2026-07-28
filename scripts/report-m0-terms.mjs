/**
 * 把 M0 正典的術語用量掃描結果，輸出成人看的報告。
 *
 * ⚠️ 唯讀報告工具。不修改 data/ 任何檔案。
 *    掃描邏輯在 scripts/lib/m0-scan.mjs（與 build-m0-release.mjs 共用同一份）。
 *
 * 輸出：docs/m0-term-dependency.md
 */
import { writeFileSync } from 'node:fs'
import { p } from './lib/root.mjs'
import { scan, EXCLUSIONS, AMBIGUOUS } from './lib/m0-scan.mjs'

const { canon, controlled, prose, candidates, proseExcluded } = scan()

const byStatus = (t) => t?.status ?? '（不在術語表）'
const L = []
L.push('# M0 術語依賴清單 —— 掃描結果')
L.push('')
L.push('> 由 `node scripts/report-m0-terms.mjs` 產生。**唯讀報告，不改 data/。**')
L.push('> 掃描邏輯與 `releases/m0.json` 共用 `scripts/lib/m0-scan.mjs`，兩者不會各說各話。')
L.push('')
L.push(`掃描範圍：**${canon.length} 個正典條目**（` +
  Object.entries(canon.reduce((a, c) => (a[c.type] = (a[c.type] ?? 0) + 1, a), {}))
    .map(([k, v]) => `${k} ${v}`).join('／') + '）')
L.push('')
L.push('---')
L.push('')
L.push('## 通道 A · 受控值（確定性，無需人工複核）')
L.push('')
L.push('這些欄位存的就是受控值本身，直接查表命中，不經文字比對。')
L.push('')
L.push('| 詞彙表 | 值 | 中文 | 狀態 | 用於幾個條目 |')
L.push('|---|---|---|---|---|')
for (const [, v] of [...controlled.entries()].sort()) {
  L.push(`| ${v.vocabName} | \`${v.value}\` | ${v.entry?.zhHant ?? '**—**'} | ${byStatus(v.entry)} | ${v.from.size} |`)
}
L.push('')
const ctrlUnapproved = [...controlled.values()].filter((v) => v.entry?.status !== 'approved')
L.push(ctrlUnapproved.length
  ? `⚠️ 其中 **${ctrlUnapproved.length}** 項尚未 approved，不得進入 release manifest。`
  : '✅ 通道 A 全部 `approved`。')
L.push('')
L.push('---')
L.push('')
L.push('## 通道 B · 散文文字掃描（**每一筆都需人工複核**）')
L.push('')
L.push('以字界比對 glossary 與 vocabulary 的英文。**這個通道必然有假命中**——')
L.push('例如語氣詞 “might” 會對上屬性 Might。故每筆附上下文，由人眼判定是不是真的用到那個術語。')
L.push('')
const proseSorted = [...prose.values()].sort((a, b) => b.hits.length - a.hits.length)
L.push(`命中 **${proseSorted.length}** 個術語，共 **${proseSorted.reduce((n, x) => n + x.hits.length, 0)}** 處。`)
L.push('')
L.push('| # | 英文 | 中文 | 狀態 | 處數 | 備註 |')
L.push('|---|---|---|---|---|---|')
proseSorted.forEach((x, i) => {
  const ex = EXCLUSIONS.find((e) => e.termEn.toLowerCase() === (x.term.en ?? '').toLowerCase())
  const tag = ex ? '❌ 已判定為假命中' : AMBIGUOUS.has((x.term.en ?? '').toLowerCase()) ? '⚠️ 泛用詞' : ''
  L.push(`| ${i + 1} | ${x.term.en} | ${x.term.zhHant ?? '—'} | ${x.term.status} | ${x.hits.length} | ${tag} |`)
})
L.push('')
if (proseExcluded.length) {
  L.push('### ❌ 人工判定為假命中、**不計入依賴**的')
  L.push('')
  for (const e of EXCLUSIONS) {
    L.push(`- **${e.termEn}**（判定於 ${e.checkedAt}）`)
    L.push(`  > ${e.reason}`)
  }
  L.push('')
}
L.push('### 逐筆上下文')
L.push('')
for (const x of proseSorted) {
  const ex = EXCLUSIONS.find((e) => e.termEn.toLowerCase() === (x.term.en ?? '').toLowerCase())
  L.push(`#### ${x.term.en} → ${x.term.zhHant ?? '—'}　\`${x.term.status}\`` +
    (ex ? '　❌ **已判定為假命中**' : AMBIGUOUS.has((x.term.en ?? '').toLowerCase()) ? '　⚠️ **泛用詞，特別注意**' : ''))
  L.push('')
  for (const h of x.hits.slice(0, 12)) {
    L.push(`- \`${h.id}\` · ${h.field}　**${h.matched}**`)
    L.push(`  > ${h.context}`)
  }
  if (x.hits.length > 12) L.push(`- …另有 ${x.hits.length - 12} 處`)
  L.push('')
}
L.push('---')
L.push('')
L.push('## 通道 C · 疑似術語但表裡沒有（**需人工判斷**）')
L.push('')
L.push('作法：把所有術語命中的區間遮掉，看剩下什麼像規則用語。')
L.push('訊號有二：句中大寫字、位移／規則動詞白名單。**這裡同樣會有雜訊**（人名、地名、一般名詞）。')
L.push('')
const candSorted = [...candidates.entries()].sort((a, b) => b[1].length - a[1].length)
L.push(`共 **${candSorted.length}** 個候選。`)
L.push('')
for (const [, hits] of candSorted) {
  L.push(`- **${hits[0].phrase}**（${hits.length} 處）`)
  for (const h of hits.slice(0, 3)) L.push(`  - \`${h.id}\` · ${h.field}　> ${h.context}`)
  if (hits.length > 3) L.push(`  - …另有 ${hits.length - 3} 處`)
}
L.push('')
L.push('---')
L.push('')
L.push('## 尚未 approved 的命中（會擋住 release manifest）')
L.push('')
const blocked = [
  ...ctrlUnapproved.map((v) => ({ what: `${v.vocabName}:${v.value}`, status: v.entry?.status ?? '不在表中', ch: 'A' })),
  ...proseSorted.filter((x) => x.term.status !== 'approved'
      && !EXCLUSIONS.some((e) => e.termEn.toLowerCase() === (x.term.en ?? '').toLowerCase()))
    .map((x) => ({ what: x.term.en, status: x.term.status, ch: 'B', n: x.hits.length })),
]
if (!blocked.length) L.push('✅ 無。所有實際依賴的術語都已 approved。')
else {
  L.push('| 通道 | 詞 | 狀態 | 處數 |')
  L.push('|---|---|---|---|')
  for (const b of blocked) L.push(`| ${b.ch} | ${b.what} | ${b.status} | ${b.n ?? '—'} |`)
}
L.push('')

// 去掉尾端空行，避免生成檔每次都帶著 EOF 空白（git diff --check 會抓）
while (L.length && L[L.length - 1] === '') L.pop()
writeFileSync(p('docs/m0-term-dependency.md'), L.join('\n') + '\n', 'utf8')
console.log(`正典條目      ${canon.length}`)
console.log(`通道 A 受控值 ${controlled.size}（未 approved ${ctrlUnapproved.length}）`)
console.log(`通道 B 術語   ${proseSorted.length}（排除假命中 ${proseExcluded.length}）`)
console.log(`通道 C 候選   ${candidates.size}`)
console.log(`阻擋項        ${blocked.length}`)
console.log(`報告 → docs/m0-term-dependency.md`)

/**
 * 產出「按出現頻率排序的待裁決術語清單」，供專案擁有者批次審閱。
 *
 * ⚠️ 唯讀報告工具。不修改 data/ 任何檔案，不屬於已凍結的詞彙系統。
 *
 * 頻率來源：sources/notion-export 的舊譯語料（.md / .csv），
 * 計算每個候選中文譯名出現在幾個檔案中。
 *
 * 輸出：docs/term-review-queue.md
 */
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { resolve, extname } from 'node:path'
import { p } from './lib/root.mjs'

// ── 讀入舊譯語料
const corpus = []
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = resolve(dir, name)
    if (statSync(full).isDirectory()) { walk(full); continue }
    if (!['.md', '.csv'].includes(extname(name).toLowerCase())) continue
    corpus.push({ path: full, text: readFileSync(full, 'utf8') })
  }
}
walk(p('sources/notion-export'))

/** M0 範圍：懲戒者相關檔案 ＋ 狀態／戰鬥規則 */
const isM0 = (path) =>
  path.includes('censor') || path.includes('懲戒者') ||
  path.includes('狀態') || path.includes('戰鬥') || path.includes('基礎')

const m0Corpus = corpus.filter((f) => isM0(f.path))

// ── 待裁決候選
const glossary = JSON.parse(readFileSync(p('data/glossary.json'), 'utf8'))
const vocabDir = p('data/vocabulary')
const vocabularies = existsSync(vocabDir)
  ? readdirSync(vocabDir).filter((f) => f.endsWith('.json'))
      .map((f) => JSON.parse(readFileSync(resolve(vocabDir, f), 'utf8')))
  : []

const candidates = []
for (const t of glossary.terms) {
  if (t.status !== 'needs-review') continue
  if (t.entityRef) continue            // 狀態名稱由實體負責，另行處理
  if (!t.zhHant) continue
  candidates.push({
    kind: 'glossary', id: t.id, en: t.en, zhHant: t.zhHant,
    categories: t.categories ?? [], idStatus: t.idStatus,
  })
}
for (const v of vocabularies) {
  for (const val of v.values) {
    if (val.status !== 'needs-review' || !val.zhHant) continue
    candidates.push({
      kind: 'vocabulary', id: val.id, en: val.en, zhHant: val.zhHant,
      categories: [`vocabulary/${v.vocabulary}`], idStatus: 'stable',
    })
  }
}

// ── 計數
const countFiles = (files, s) => files.reduce((n, f) => n + (f.text.includes(s) ? 1 : 0), 0)
for (const c of candidates) {
  c.files = countFiles(corpus, c.zhHant)
  c.m0Files = countFiles(m0Corpus, c.zhHant)
  // 一至二字的中文詞容易誤中其他詞的一部分，計數僅供參考
  c.shortTerm = [...c.zhHant].length <= 2
}

candidates.sort((a, b) =>
  b.m0Files - a.m0Files || b.files - a.files || a.en.localeCompare(b.en))

// ── 輸出
const row = (c, i) =>
  `| ${i} | \`${c.en}\` | **${c.zhHant}** | ${c.m0Files || '–'} | ${c.files || '–'}${c.shortTerm ? ' ⚠️' : ''} | ${c.kind === 'vocabulary' ? '受控值' : (c.categories[0] ?? '')} |`

const withM0 = candidates.filter((c) => c.m0Files > 0)
const highFreq = candidates.filter((c) => c.m0Files === 0 && c.files >= 5)
const rest = candidates.filter((c) => c.m0Files === 0 && c.files < 5)

const md = `# 待裁決術語清單（按出現頻率排序）

> 由 \`scripts/report-term-frequency.mjs\` 生成，唯讀報告。
> 頻率＝該中文譯名出現在 \`sources/notion-export\` 幾個檔案中。

## 怎麼用

**建議譯名一律取自你的舊譯**，多數情況直接批准即可。你只需要：

- 整段沒問題 → 回覆「A 全部批准」
- 個別要改 → 回覆「A 全部批准，但 #12 改成 XXX、#37 改成 YYY」
- 不確定 → 回覆「#45 先跳過」，該詞維持 needs-review

批准後我會寫進 \`data/decisions.json\` 並重跑生成，**你不需要碰任何檔案**。

⚠️ 標記說明：**⚠️** 表示該詞只有 1–2 個字，計數可能誤中其他詞的一部分，數字僅供參考。

---

## A 段 · M0 直接會用到（${withM0.length} 條）

**這段最優先。** 不批准的話，M0 的招式與狀態會卡在待決狀態。

| # | 英文 | 建議譯名 | M0 檔數 | 全語料 | 分類 |
|---|---|---|---|---|---|
${withM0.map((c, i) => row(c, i + 1)).join('\n')}

---

## B 段 · 高頻但非 M0（${highFreq.length} 條，出現 ≥5 檔）

M1 以後會用到。有時間再看，不影響 M0。

| # | 英文 | 建議譯名 | M0 檔數 | 全語料 | 分類 |
|---|---|---|---|---|---|
${highFreq.map((c, i) => row(c, withM0.length + i + 1)).join('\n')}

---

## C 段 · 低頻（${rest.length} 條）

**建議暫不處理。** 多為地名、人名、單一冒險專用詞，等實際用到再裁決。

<details>
<summary>展開查看</summary>

| # | 英文 | 建議譯名 | 全語料 | 分類 |
|---|---|---|---|---|
${rest.map((c, i) => `| ${withM0.length + highFreq.length + i + 1} | \`${c.en}\` | ${c.zhHant} | ${c.files || '–'}${c.shortTerm ? ' ⚠️' : ''} | ${c.categories[0] ?? ''} |`).join('\n')}

</details>

---

## 統計

| | 數量 |
|---|---|
| 待裁決總數 | ${candidates.length} |
| A 段（M0 必要） | ${withM0.length} |
| B 段（高頻非 M0） | ${highFreq.length} |
| C 段（低頻） | ${rest.length} |
| 語料檔案數 | ${corpus.length}（其中 M0 相關 ${m0Corpus.length}） |

> 狀態（Bleeding 等 9 個）不在此清單——其中文名由實體負責（\`entityRef\`），於正典抽取時一併確認。
`

writeFileSync(p('docs/term-review-queue.md'), md, 'utf8')
console.log(`語料 ${corpus.length} 檔（M0 相關 ${m0Corpus.length}）`)
console.log(`待裁決 ${candidates.length} 條 → A ${withM0.length} / B ${highFreq.length} / C ${rest.length}`)
console.log(`寫入 docs/term-review-queue.md`)

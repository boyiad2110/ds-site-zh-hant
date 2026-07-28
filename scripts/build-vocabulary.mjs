/**
 * data/decisions.json → data/vocabulary/*.json
 *
 * vocabulary 是結構化欄位受控值的權威，供 schema 驗證、TS union、
 * 篩選選項與 renderer 使用（見 docs/translation-guide.md §9.1）。
 *
 * 分流判準：該詞是結構化欄位的受控值、會參與 schema／篩選／排序／算繪 → vocabulary
 *           其餘 → glossary
 *
 * ⚠️ 生成前**清空整個目錄再重建**，避免 decisions.json 移除某群組後
 *    舊 JSON 殘留成幽靈權威資料。此目錄專供本腳本生成，不放其他檔案。
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, rmSync } from 'node:fs'
import { resolve } from 'node:path'
import { p, sha256File } from './lib/root.mjs'

const DECISIONS = p('data/decisions.json')
const decisions = JSON.parse(readFileSync(DECISIONS, 'utf8'))
const outDir = p('data/vocabulary')

// ── 清除本腳本管理的舊生成檔（只刪 .json，不碰其他檔案）
let removed = []
if (existsSync(outDir)) {
  removed = readdirSync(outDir).filter((f) => f.endsWith('.json'))
  for (const f of removed) rmSync(resolve(outDir, f))
}
mkdirSync(outDir, { recursive: true })

const groups = new Map()
for (const d of decisions.vocabulary) {
  if (!groups.has(d.vocabulary)) groups.set(d.vocabulary, [])
  const { vocabulary, ...rest } = d
  groups.get(vocabulary).push({
    id: `${vocabulary.replace(/s$/, '')}.${rest.value}`,
    // vocabulary id 用於 schema、篩選、renderer 與未來引用 → 視為正式 stable id，
    // 與 glossary 同受 ledger 保護（改名或刪除需 tombstone）
    idStatus: 'stable',
    ...rest,
    aliasesZhHant: rest.aliasesZhHant ?? [],
  })
}

const decisionsHash = sha256File(DECISIONS)
let total = 0, approved = 0
const written = []
for (const [name, values] of [...groups].sort()) {
  values.sort((a, b) => a.value.localeCompare(b.value))
  writeFileSync(resolve(outDir, `${name}.json`), JSON.stringify({
    $comment: '由 scripts/build-vocabulary.mjs 從 data/decisions.json 生成，不可手改。',
    decisionsHash,
    vocabulary: name,
    values,
  }, null, 2) + '\n', 'utf8')
  written.push(`${name}.json`)
  const a = values.filter((v) => v.status === 'approved').length
  total += values.length
  approved += a
  console.log(`  ${name.padEnd(20)} ${String(values.length).padStart(2)} 值　approved ${a}`)
}

const stale = removed.filter((f) => !written.includes(f))
if (stale.length) console.log(`\n  🗑  清除過期生成檔：${stale.join(', ')}`)
console.log(`\n共 ${groups.size} 個詞彙表、${total} 個值，approved ${approved}、needs-review ${total - approved}`)

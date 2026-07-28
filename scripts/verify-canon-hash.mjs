/**
 * 重新比對每個正典條目的 normalizedHash 與其正規化來源檔（§5.5）。
 *
 * 前幾輪的教訓是「寫了 hash 卻從不比對」。本腳本存在的唯一目的就是**真的比對**，
 * 失敗即 exit 1，供 CI 使用。
 *
 *   node scripts/verify-canon-hash.mjs
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { p } from './lib/root.mjs'

const CANON = p('data/canon')
const NORM = p('data/canon/_normalized')

if (!existsSync(CANON)) { console.log('尚無 data/canon/，無可驗證項目'); process.exit(0) }

/** 換行一律正規化為 \n 後計算，避免 Windows 檢出改寫 CRLF 造成假失敗 */
const hashOf = (text) => createHash('sha256').update(text.replace(/\r\n/g, '\n'), 'utf8').digest('hex')

const files = []
const walk = (dir) => {
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    if (name.isDirectory()) { if (name.name !== '_normalized') walk(`${dir}/${name.name}`); continue }
    if (name.name.endsWith('.json')) files.push(`${dir}/${name.name}`)
  }
}
walk(CANON)

const errors = []
let ok = 0
for (const f of files) {
  const item = JSON.parse(readFileSync(f, 'utf8'))
  const declared = item.source?.normalizedHash
  const normPath = `${NORM}/${item.id}.txt`
  if (!declared) { errors.push(`${item.id}：source.normalizedHash 缺漏`); continue }
  if (!existsSync(normPath)) { errors.push(`${item.id}：找不到正規化來源檔 ${normPath}`); continue }
  const actual = hashOf(readFileSync(normPath, 'utf8'))
  if (actual !== declared) {
    errors.push(`${item.id}：hash 不符\n      條目宣告 ${declared}\n      實際計算 ${actual}`)
    continue
  }
  ok++
  console.log(`  ✅ ${item.id}  ${actual.slice(0, 16)}…`)
}

// 反向：正規化來源檔不得有孤兒（改名或刪除條目時會留下）
const ids = new Set(files.map((f) => JSON.parse(readFileSync(f, 'utf8')).id))
if (existsSync(NORM)) {
  for (const n of readdirSync(NORM).filter((x) => x.endsWith('.txt'))) {
    const id = n.replace(/\.txt$/, '')
    if (!ids.has(id)) errors.push(`孤兒正規化檔：_normalized/${n} 沒有對應的正典條目`)
  }
}

console.log('──────────────────────────────────────────')
if (errors.length) {
  for (const e of errors) console.log(`  ❌ ${e}`)
  console.log(`  ${errors.length} 項失敗（${ok} 項通過）`)
  process.exit(1)
}
console.log(`  ✅ ${ok} 個正典條目的 normalizedHash 全部相符`)
process.exit(0)

/**
 * 正典 round-trip 驗證（§5.5 的補件）。
 *
 * 既有的 verify-canon-hash 檢查「快照沒被改過」，verify-zh-structure 檢查
 * 「中文與正典逐段對應」——兩者驗的都是**內部一致**。都通過，卻仍然發生過
 * 結構化欄位比書上多寫字的情況（2026-07-31 的【惡徒止步！】【懺悔吧！】）。
 *
 * 本腳本驗的是**忠於原文**：把結構化欄位用 shared/canon-format.mjs 的
 * compose* 重新組回書上原文，與同一物件的 raw 比對。
 *
 * 不變式：**不存在未宣告的偏離。**
 * 合理的偏離（消歧義、結構化需要）允許存在，但必須寫進 canon-deviations.json
 * 並附理由，才不會靜默累積。
 *
 *   node scripts/verify-canon-roundtrip.mjs           驗證，失敗 exit 1
 *   node scripts/verify-canon-roundtrip.mjs --list    列出全部差異（用來起草宣告）
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { p } from './lib/root.mjs'
import {
  composeCharacteristic, composeDistance, composeExtraCost, composeTier, normalizeForCompare,
} from '../shared/canon-format.mjs'

const listMode = process.argv.includes('--list')
const CANON = p('data/canon')
const declared = existsSync(p('shared/canon-deviations.json'))
  ? JSON.parse(readFileSync(p('shared/canon-deviations.json'), 'utf8')).deviations
  : []

const declaredKey = new Set(declared.map((d) => `${d.entry}|${d.field}`))

/** 每個帶 raw 的欄位配一個組合函式；日後新增欄位只要在這裡登記就自動被守住。 */
function* checks(entry) {
  if (entry.distance?.raw) {
    yield { field: 'distance', raw: entry.distance.raw, composed: composeDistance(entry.distance) }
    const options = entry.distance.options ?? []
    for (let i = 0; i < options.length; i += 1) {
      if (options[i].raw) yield { field: `distance.options[${i}]`, raw: options[i].raw, composed: composeDistance(options[i]) }
    }
  }
  if (entry.powerRoll?.characteristic?.raw) {
    yield {
      field: 'powerRoll.characteristic',
      raw: entry.powerRoll.characteristic.raw,
      composed: composeCharacteristic(entry.powerRoll.characteristic),
    }
  }
  const tiers = entry.powerRoll?.tiers ?? []
  for (let i = 0; i < tiers.length; i += 1) {
    if (tiers[i].raw) yield { field: `powerRoll.tiers[${i}]`, raw: tiers[i].raw, composed: composeTier(tiers[i]) }
  }
  const extraCosts = entry.extraCosts ?? []
  for (let i = 0; i < extraCosts.length; i += 1) {
    if (extraCosts[i].raw) yield { field: `extraCosts[${i}]`, raw: extraCosts[i].raw, composed: composeExtraCost(extraCosts[i]) }
  }
}

const files = []
const walk = (dir) => {
  for (const item of readdirSync(dir, { withFileTypes: true })) {
    if (item.isDirectory()) { if (item.name !== '_normalized') walk(`${dir}/${item.name}`); continue }
    if (item.name.endsWith('.json')) files.push(`${dir}/${item.name}`)
  }
}
walk(CANON)

let compared = 0
const undeclaredList = []
const differences = []

for (const file of files.sort()) {
  const entry = JSON.parse(readFileSync(file, 'utf8'))
  for (const check of checks(entry)) {
    compared += 1
    if (normalizeForCompare(check.raw) === normalizeForCompare(check.composed)) continue
    const record = { entry: entry.id, ...check }
    differences.push(record)
    if (!declaredKey.has(`${entry.id}|${check.field}`)) undeclaredList.push(record)
  }
}

if (listMode) {
  console.log(`共比對 ${compared} 處，其中 ${differences.length} 處與 raw 不同：\n`)
  for (const d of differences) {
    console.log(`${d.entry}  ${d.field}${declaredKey.has(`${d.entry}|${d.field}`) ? '  （已宣告）' : '  ⚠️ 未宣告'}`)
    console.log(`  raw      ${d.raw}`)
    console.log(`  composed ${d.composed}\n`)
  }
  process.exit(0)
}

// 反向：宣告了卻已經不存在的偏離要清掉，否則清單會慢慢變成無人看管的忽略名單
const differenceKey = new Set(differences.map((d) => `${d.entry}|${d.field}`))
const stale = declared.filter((d) => !differenceKey.has(`${d.entry}|${d.field}`))

console.log(`  比對 ${compared} 處帶 raw 的欄位（${files.length} 個正典條目）`)
console.log(`  差異 ${differences.length} 處，其中已宣告 ${differences.length - undeclaredList.length} 處`)
console.log('──────────────────────────────────────────')

if (undeclaredList.length === 0 && stale.length === 0) {
  console.log('  ✅ 不存在未宣告的偏離')
  process.exit(0)
}
for (const d of undeclaredList) {
  console.log(`  ❌ ${d.entry} · ${d.field} 未宣告的偏離`)
  console.log(`       raw      ${d.raw}`)
  console.log(`       composed ${d.composed}`)
}
for (const d of stale) {
  console.log(`  ❌ ${d.entry} · ${d.field} 已宣告但實際已無差異 —— 請從 canon-deviations.json 移除`)
}
console.log(`  ${undeclaredList.length + stale.length} 項失敗`)
console.log('  逐項檢視：node scripts/verify-canon-roundtrip.mjs --list')
process.exit(1)

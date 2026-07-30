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
 * 三個不變式：
 *   1. 不存在未宣告的偏離
 *   2. 宣告是**裁決快照**——條目、欄位、raw、結構化內容都要相符，才算涵蓋；
 *      同一欄位換成另一個差異時不得沿用舊裁決
 *   3. 資料裡每個帶 raw 的路徑都必須有對應的組合規則，不得靜默落在檢查範圍外
 *
 *   node scripts/verify-canon-roundtrip.mjs           驗證，失敗 exit 1
 *   node scripts/verify-canon-roundtrip.mjs --list    列出全部差異（用來起草宣告）
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { p } from './lib/root.mjs'
import {
  composeCharacteristic, composeDistance, composeExtraCost, composeTier, normalizeForCompare,
} from '../shared/canon-format.mjs'

/**
 * 走訪整個條目，找出**所有**帶 raw 的路徑。
 * raw 是「這裡有一段書上原文」的標記，用途是守住 checks() 的覆蓋面：
 * 日後 M1 出現新的資料形狀而 checks() 沒跟上時，該欄位不會靜默落在驗證範圍外。
 * 路徑格式必須與 checks() 產生的一致（distance.options[0]、powerRoll.tiers[0] …）。
 */
export function* rawPaths(node, path = '') {
  if (Array.isArray(node)) {
    for (let i = 0; i < node.length; i += 1) yield* rawPaths(node[i], `${path}[${i}]`)
    return
  }
  if (node && typeof node === 'object') {
    if ('raw' in node) yield path
    for (const [key, value] of Object.entries(node)) yield* rawPaths(value, path ? `${path}.${key}` : key)
  }
}

/** 每個帶 raw 的欄位配一個組合規則；漏掉的會被 rawPaths 覆蓋面檢查抓出來。 */
export function* checks(entry) {
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

/**
 * 宣告是否涵蓋這筆差異。
 * 只比對「條目＋欄位」是不夠的：同一欄位日後若變成**另一個**錯誤，舊裁決會把它放行。
 * 宣告要當成裁決快照，所以 raw 與結構化內容也必須逐字相同——此處刻意用嚴格比對，
 * 不套 normalizeForCompare，因為擁有者裁決的是那兩段確切的文字。
 */
export function declarationMatches(declaration, difference) {
  return declaration.raw === difference.raw && declaration.structured === difference.composed
}

/** 掃描全部正典條目，回傳差異、覆蓋面缺口與比對次數。 */
export function scanCanon(canonDir) {
  const files = []
  const walk = (dir) => {
    for (const item of readdirSync(dir, { withFileTypes: true })) {
      if (item.isDirectory()) { if (item.name !== '_normalized') walk(`${dir}/${item.name}`); continue }
      if (item.name.endsWith('.json')) files.push(`${dir}/${item.name}`)
    }
  }
  walk(canonDir)

  const differences = []
  const uncovered = []
  let compared = 0

  for (const file of files.sort()) {
    const entry = JSON.parse(readFileSync(file, 'utf8'))
    const checked = new Set()
    for (const check of checks(entry)) {
      compared += 1
      checked.add(check.field)
      if (normalizeForCompare(check.raw) === normalizeForCompare(check.composed)) continue
      differences.push({ entry: entry.id, ...check })
    }
    for (const path of rawPaths(entry)) {
      if (!checked.has(path)) uncovered.push({ entry: entry.id, field: path })
    }
  }
  return { files, compared, differences, uncovered }
}

function main() {
  const listMode = process.argv.includes('--list')
  const declared = existsSync(p('shared/canon-deviations.json'))
    ? JSON.parse(readFileSync(p('shared/canon-deviations.json'), 'utf8')).deviations
    : []
  const { files, compared, differences, uncovered } = scanCanon(p('data/canon'))
  const declarationOf = (d) => declared.find((x) => x.entry === d.entry && x.field === d.field)

  if (listMode) {
    console.log(`共比對 ${compared} 處，其中 ${differences.length} 處與 raw 不同：\n`)
    for (const d of differences) {
      const declaration = declarationOf(d)
      const state = !declaration ? '⚠️ 未宣告' : declarationMatches(declaration, d) ? '（已宣告）' : '⚠️ 宣告內容不符'
      console.log(`${d.entry}  ${d.field}  ${state}`)
      console.log(`  raw      ${d.raw}`)
      console.log(`  composed ${d.composed}\n`)
    }
    for (const u of uncovered) console.log(`${u.entry}  ${u.field}  ⚠️ 尚未納入檢查`)
    process.exit(0)
  }

  const failures = []

  for (const u of uncovered) {
    failures.push(`${u.entry} · ${u.field} 帶有 raw 但尚未納入 round-trip 檢查`
      + '\n       請在 scripts/verify-canon-roundtrip.mjs 的 checks() 補上對應的組合規則')
  }

  // 宣告本身的健全性：不得重複、理由與裁決不得留白
  const seen = new Set()
  for (const declaration of declared) {
    const key = `${declaration.entry}|${declaration.field}`
    if (seen.has(key)) failures.push(`${declaration.entry} · ${declaration.field} 在 canon-deviations.json 重複宣告`)
    seen.add(key)
    if (!String(declaration.reason ?? '').trim()) failures.push(`${declaration.entry} · ${declaration.field} 的 reason 留白`)
    if (!String(declaration.ruling ?? '').trim()) failures.push(`${declaration.entry} · ${declaration.field} 的 ruling 留白`)
  }

  let covered = 0
  for (const d of differences) {
    const declaration = declarationOf(d)
    if (!declaration) {
      failures.push(`${d.entry} · ${d.field} 未宣告的偏離\n       raw      ${d.raw}\n       composed ${d.composed}`)
    } else if (!declarationMatches(declaration, d)) {
      failures.push([
        `${d.entry} · ${d.field} 的偏離內容與宣告不符 —— 這是另一個差異，不能沿用舊裁決`,
        `       宣告的 raw        ${declaration.raw}`,
        `       實際的 raw        ${d.raw}`,
        `       宣告的 structured ${declaration.structured}`,
        `       實際的 structured ${d.composed}`,
      ].join('\n'))
    } else {
      covered += 1
    }
  }

  // 反向：宣告了卻已經不存在的偏離要清掉，否則清單會慢慢變成無人看管的忽略名單
  for (const declaration of declared) {
    if (!differences.some((d) => d.entry === declaration.entry && d.field === declaration.field)) {
      failures.push(`${declaration.entry} · ${declaration.field} 已宣告但實際已無差異 —— 請從 canon-deviations.json 移除`)
    }
  }

  console.log(`  比對 ${compared} 處帶 raw 的欄位（${files.length} 個正典條目）`)
  console.log(`  差異 ${differences.length} 處，其中宣告相符 ${covered} 處`)
  console.log('──────────────────────────────────────────')

  if (failures.length === 0) {
    console.log('  ✅ 不存在未宣告的偏離，且所有帶 raw 的欄位都在檢查範圍內')
    process.exit(0)
  }
  for (const failure of failures) console.log(`  ❌ ${failure}`)
  console.log(`  ${failures.length} 項失敗`)
  console.log('  逐項檢視：node scripts/verify-canon-roundtrip.mjs --list')
  process.exit(1)
}

// 供測試 import 而不觸發執行
if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) main()

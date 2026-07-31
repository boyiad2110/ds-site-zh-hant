/**
 * Milestone 內容完整性驗證（與 releases/*.json 的術語依賴清單是兩件事，見下）。
 *
 * 背景：`releases/m0.json` 的 `scannedCanonEntries` 曾被 `web/scripts/build-catalog.mjs`
 * 拿來當「範圍是否完整」的判準（寫死 `!== 28`）。這是誤用——`releases/m0.json` 是
 * **術語依賴清單**，`scannedCanonEntries` 只是它算術語時順便留下的副產品數字，
 * 不是範圍完整性的正式來源，而且一旦 `data/canon/` 加入 M1 條目，這個數字必然變動，
 * 用它當 M0 的完整性判準會直接失真。
 *
 * 本腳本改用 `releases/milestones/<milestone>.json`——**人工維護的條目 id 清單**，
 * 不靠動態掃描出的數量，也不解析 `docs/scope.md`（範圍權威仍是那份文件，
 * 本檔只是範圍定案後、給程式用的機器可讀清單，兩者刻意分開維護）。
 *
 * 四項檢查：
 *   1. milestone 宣告的每個 id，`data/canon/` 裡是否真的存在對應檔案
 *   2. 存在的話，`data/zh-Hant/` 是否有配對的檔案
 *   3. `data/canon/` 裡的每個 id，是否被剛好一個 milestone 宣告過（抓未宣告的額外 id，
 *      也抓被兩個 milestone 重複宣告的 id）
 *   4. `status: "complete"` 的 milestone，其宣告的每個 id 是否都已
 *      `canonReviewStatus: "verified"` 且中文 `meta.status: "reviewed"`——
 *      這是「標記完成後有沒有還沒審完的條目」的判準
 *
 *   node scripts/verify-milestones.mjs           驗證，失敗 exit 1
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { p } from './lib/root.mjs'

const GROUPS = ['abilities', 'conditions', 'features']

function walkCanon() {
  /** @type {Map<string, {group: string, canon: any, zh: any | null}>} */
  const byId = new Map()
  for (const group of GROUPS) {
    const canonDir = p(`data/canon/${group}`)
    const zhDir = p(`data/zh-Hant/${group}`)
    if (!existsSync(canonDir)) continue
    for (const name of readdirSync(canonDir).filter((n) => n.endsWith('.json')).sort()) {
      const canon = JSON.parse(readFileSync(`${canonDir}/${name}`, 'utf8'))
      const zhPath = `${zhDir}/${name}`
      const zh = existsSync(zhPath) ? JSON.parse(readFileSync(zhPath, 'utf8')) : null
      byId.set(canon.id, { group, canon, zh })
    }
  }
  return byId
}

function loadMilestones() {
  const dir = p('releases/milestones')
  if (!existsSync(dir)) return []
  return readdirSync(dir).filter((n) => n.endsWith('.json')).sort()
    .map((name) => ({ file: `releases/milestones/${name}`, ...JSON.parse(readFileSync(`${dir}/${name}`, 'utf8')) }))
}

export function verify() {
  const canonById = walkCanon()
  const milestones = loadMilestones()
  const failures = []

  const declaredBy = new Map() // id -> [milestone, ...]
  for (const m of milestones) {
    if (!m.milestone || !Array.isArray(m.ids) || !['complete', 'in-progress'].includes(m.status)) {
      failures.push(`${m.file}：manifest 格式不完整（需要 milestone／status（complete｜in-progress）／ids[]）`)
      continue
    }
    for (const id of m.ids) {
      if (!declaredBy.has(id)) declaredBy.set(id, [])
      declaredBy.get(id).push(m.milestone)
    }
  }

  // 重複宣告：同一個 id 出現在一個以上的 milestone
  for (const [id, owners] of declaredBy) {
    if (owners.length > 1) failures.push(`${id}：同時被 ${owners.length} 個 milestone 宣告（${owners.join('、')}），一個條目只能屬於一個 milestone`)
  }

  // 檢查 1／2／4：逐 milestone 檢查宣告的每個 id
  for (const m of milestones) {
    if (!m.milestone || !Array.isArray(m.ids)) continue
    for (const id of m.ids) {
      const entry = canonById.get(id)
      if (!entry) { failures.push(`${m.file} · ${id}：宣告了但 data/canon/ 找不到對應檔案`); continue }
      if (!entry.zh) { failures.push(`${m.file} · ${id}：canon 存在但 data/zh-Hant/ 沒有配對的檔案`); continue }
      if (m.status === 'complete') {
        if (entry.canon.canonReviewStatus !== 'verified') {
          failures.push(`${m.file} · ${id}：milestone 已標記 complete，但 canonReviewStatus 是 「${entry.canon.canonReviewStatus}」，不是 verified`)
        }
        if (entry.zh.meta?.status !== 'reviewed') {
          failures.push(`${m.file} · ${id}：milestone 已標記 complete，但繁中 meta.status 是 「${entry.zh.meta?.status ?? '（無）'}」，不是 reviewed`)
        }
      }
    }
  }

  // 檢查 3：data/canon/ 裡有沒有任何 id 完全沒被宣告過
  for (const id of canonById.keys()) {
    if (!declaredBy.has(id)) failures.push(`${id}：存在於 data/canon/，但沒有被任何 releases/milestones/*.json 宣告——未宣告的額外 id`)
  }

  return { failures, canonCount: canonById.size, milestoneCount: milestones.length }
}

function main() {
  const { failures, canonCount, milestoneCount } = verify()
  console.log(`  掃描 ${canonCount} 個正典條目、${milestoneCount} 份 milestone 宣告`)
  console.log('──────────────────────────────────────────')
  if (failures.length === 0) {
    console.log('  ✅ 每個 milestone 宣告的 id 都存在且配對完整，data/canon/ 沒有未宣告的額外 id')
    process.exit(0)
  }
  for (const f of failures) console.log(`  ❌ ${f}`)
  console.log(`  ${failures.length} 項失敗`)
  process.exit(1)
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) main()

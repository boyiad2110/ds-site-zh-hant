/**
 * 驗證 `data/zh-Hant/` 與 `data/canon/` 的逐段對應。
 *
 * 「與 canon 同構逐段對應」是指南對翻譯層的要求。**光宣稱沒有用**——
 * 段落數量對不上時，網站就無法把中英文並列，也無法在正典更新時知道哪一段要改。
 * 本腳本真的去比對，失敗即 exit 1。
 *
 * 檢查項目：
 *   1. 每個中文檔都有對應的正典條目（反之不強制——中文可以還沒跟上）
 *   2. `canonRef.id` 與檔案 id 一致
 *   3. feature：sections 數量、每個 section 的 blocks 數量、heading 有無，全部一致
 *   4. ability：powerRoll.tiers 數量與 threshold 一致
 *   5. condition：text 段落數一致
 *   6. meta.status 為 reviewed 時必須有 reviewedBy
 *
 * ⚠️ `blocks[].kind` **刻意不比對**——中文可以把散文改成清單（TI-9 的全站風格），
 * 但數量與順序仍須一一對應。
 *
 *   node scripts/verify-zh-structure.mjs
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { p } from './lib/root.mjs'

const readAll = (dir) => {
  const out = new Map()
  const base = p(dir)
  if (!existsSync(base)) return out
  for (const sub of readdirSync(base, { withFileTypes: true })) {
    if (!sub.isDirectory()) continue
    if (sub.name === '_normalized') continue
    for (const f of readdirSync(`${base}/${sub.name}`).filter((x) => x.endsWith('.json'))) {
      const j = JSON.parse(readFileSync(`${base}/${sub.name}/${f}`, 'utf8'))
      out.set(j.id, { ...j, _file: `${dir}/${sub.name}/${f}` })
    }
  }
  return out
}

const canon = readAll('data/canon')
const zh = readAll('data/zh-Hant')

const errors = []
const fail = (id, msg) => errors.push(`${id}：${msg}`)

for (const [id, z] of zh) {
  const c = canon.get(id)
  if (!c) { fail(id, `中文檔 ${z._file} 沒有對應的正典條目`); continue }

  if (z.canonRef?.id && z.canonRef.id !== id) {
    fail(id, `canonRef.id=${z.canonRef.id} 與檔案 id 不一致`)
  }
  if (!z.nameZhHant) fail(id, '缺 nameZhHant')
  if (z.meta?.status === 'reviewed' && !z.meta?.reviewedBy) fail(id, 'status=reviewed 但缺 reviewedBy')

  if (c.type === 'feature') {
    const cs = c.sections ?? []
    const zs = z.sections ?? []
    if (cs.length !== zs.length) { fail(id, `sections 數量不符：正典 ${cs.length}、中文 ${zs.length}`); continue }
    for (const [i, cSec] of cs.entries()) {
      const zSec = zs[i]
      const cHasHeading = cSec.heading !== null && cSec.heading !== undefined
      const zHasHeading = zSec.heading !== null && zSec.heading !== undefined
      if (cHasHeading !== zHasHeading) {
        fail(id, `sections[${i}] 的小標題有無不符：正典 ${cHasHeading ? '有' : '無'}、中文 ${zHasHeading ? '有' : '無'}`)
      }
      const cb = cSec.blocks ?? []
      const zb = zSec.blocks ?? []
      if (cb.length !== zb.length) {
        fail(id, `sections[${i}].blocks 數量不符：正典 ${cb.length}、中文 ${zb.length}`)
      }
      // definitionList 的項目數必須一致——少一個教團就是漏譯
      for (const [j, b] of cb.entries()) {
        if (b.kind !== 'definitionList') continue
        const zItems = zb[j]?.items
        if (!Array.isArray(zItems)) { fail(id, `sections[${i}].blocks[${j}] 正典是 definitionList，中文缺 items`); continue }
        if (zItems.length !== b.items.length) {
          fail(id, `sections[${i}].blocks[${j}] 項目數不符：正典 ${b.items.length}、中文 ${zItems.length}`)
        }
      }
    }
  }

  if (c.type === 'ability') {
    const ct = c.powerRoll?.tiers ?? []
    const zt = z.powerRoll?.tiers ?? []
    if (ct.length && ct.length !== zt.length) {
      fail(id, `powerRoll.tiers 數量不符：正典 ${ct.length}、中文 ${zt.length}`)
    }
    for (const [i, t] of ct.entries()) {
      if (zt[i] && zt[i].threshold !== t.threshold) {
        fail(id, `tiers[${i}].threshold 不符：正典 ${t.threshold}、中文 ${zt[i].threshold}`)
      }
    }
    // ⚠️ 不可寫成 `ce.length && ze.length && ce.length !== ze.length`——
    // 中文**完全沒有** effect 時 ze.length 為 0，整個條件短路，
    // 「正典有 3 段效果、中文一段都沒翻」會靜默通過。直接比數量。
    const ce = c.effect ?? []
    const ze = z.effect ?? []
    if (ce.length !== ze.length) {
      fail(id, `effect 段落數不符：正典 ${ce.length}、中文 ${ze.length}`)
    }
  }

  if (c.type === 'condition') {
    const ct = c.text ?? []
    const zt = z.text ?? []
    if (ct.length !== zt.length) fail(id, `text 段落數不符：正典 ${ct.length}、中文 ${zt.length}`)
  }
}

console.log(`正典 ${canon.size} 條目，中文 ${zh.size} 條目（尚未翻譯 ${canon.size - zh.size}）`)
console.log('──────────────────────────────────────────')
if (errors.length) {
  for (const e of errors) console.log(`  ❌ ${e}`)
  console.log(`  ${errors.length} 項結構不符`)
  process.exit(1)
}
for (const id of [...zh.keys()].sort()) console.log(`  ✅ ${id}`)
console.log(`  ✅ ${zh.size} 個中文條目與正典逐段對應`)
process.exit(0)

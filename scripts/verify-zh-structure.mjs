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
 *   3. feature：sections 數量、每個 section 的 blocks 數量、heading 有無，全部一致；
 *      definitionList／bulletList 的 items 數量與每項非空（2026-07-31 補上 bulletList，
 *      先前只驗 definitionList，因為 M0 沒有任何條目用到 bulletList）
 *   4. ability：powerRoll.tiers 數量與 threshold 一致、effect 段落數一致、
 *      flavor 存在性（正典非空 → 中文必須非空；正典 null → 中文可省略）、
 *      potencyEffect 與 canon potency.effect 對齊、trigger 存在性、
 *      extraCosts／conditionalEffects 數量與可翻譯欄位非空、
 *      followUpActions 數量與各 options 數量、lead／constraint 存在性
 *   5. condition：text 段落數一致
 *   6. meta.status 為 reviewed 時必須有 reviewedBy
 *
 * ⚠️ **陣列欄位一律查三件事：型別是陣列、數量、每個元素非空。**
 *    這三層是分三次補齊的，每一層都擋掉前一層放行的東西：
 *      只查數量        → 「段落在、內容是空字串」靜默通過
 *      只查數量＋非空  → `effect: "x"` 靜默通過（字串也有 .length 與數字索引，
 *                        會冒充成「1 段、內容是 x」，前兩層全數通過）
 *    型別檢查走 zhArray()，見下。
 *
 * ⚠️ **`target` 刻意不檢查。** 依指南 §4.4，可組合的 target（`One creature`、
 * `One creature or object`、`Each enemy in the area` 等）**刻意不存**於中文層，
 * 由結構化資料交給 renderer 組合。程式目前無從分辨「該走組合」與「特殊、須存原文」，
 * 未來出現無法組合的 target 時再評估。
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

/**
 * 取中文層的陣列欄位，**型別必須真的是陣列**。
 *
 * ⚠️ 這一關不能省：字串同樣有 `.length` 與數字索引。
 *    `effect: "x"` 會冒充成「1 段、內容是 x」——長度對得上、每個元素也是非空字串，
 *    整套數量檢查與非空檢查**全部通過**，但那根本不是段落陣列。
 *    `options: "abc"` 同理，會冒充成 3 個選項。
 *
 * 回傳 null 代表型別已錯（並已記錄），呼叫端應跳過該欄位的後續檢查。
 */
const zhArray = (id, path, v) => {
  if (v === undefined || v === null) return []
  if (!Array.isArray(v)) {
    fail(id, `${path} 必須是陣列，實際是 ${typeof v}`)
    return null
  }
  return v
}

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
    const zs = zhArray(id, 'sections', z.sections)
    if (zs === null) continue
    if (cs.length !== zs.length) { fail(id, `sections 數量不符：正典 ${cs.length}、中文 ${zs.length}`); continue }
    for (const [i, cSec] of cs.entries()) {
      const zSec = zs[i]
      const cHasHeading = cSec.heading !== null && cSec.heading !== undefined
      const zHasHeading = zSec.heading !== null && zSec.heading !== undefined
      if (cHasHeading !== zHasHeading) {
        fail(id, `sections[${i}] 的小標題有無不符：正典 ${cHasHeading ? '有' : '無'}、中文 ${zHasHeading ? '有' : '無'}`)
      }
      const cb = cSec.blocks ?? []
      const zb = zhArray(id, `sections[${i}].blocks`, zSec.blocks)
      if (zb === null) continue
      if (cb.length !== zb.length) {
        fail(id, `sections[${i}].blocks 數量不符：正典 ${cb.length}、中文 ${zb.length}`)
      }
      // definitionList／bulletList 的項目數必須一致——少一個教團／少一個選項就是漏譯
      for (const [j, b] of cb.entries()) {
        if (b.kind === 'definitionList') {
          const zItems = zb[j]?.items
          if (!Array.isArray(zItems)) { fail(id, `sections[${i}].blocks[${j}] 正典是 definitionList，中文缺 items`); continue }
          if (zItems.length !== b.items.length) {
            fail(id, `sections[${i}].blocks[${j}] 項目數不符：正典 ${b.items.length}、中文 ${zItems.length}`)
          }
        }
        if (b.kind === 'bulletList') {
          // lead：正典有非空字串 → 中文必須也是非空字串（與 flavor／trigger 同一套最小存在性判準）
          const cLead = typeof b.lead === 'string' ? b.lead.trim() : ''
          const zLead = typeof zb[j]?.lead === 'string' ? zb[j].lead.trim() : ''
          if (cLead && !zLead) fail(id, `sections[${i}].blocks[${j}] 正典是 bulletList，中文缺 lead 或為空字串`)
          // items：先查型別（字串會冒充成陣列，見檔頭說明），再查數量，再查每個元素非空
          const cItems = b.items ?? []
          const zItems = zhArray(id, `sections[${i}].blocks[${j}].items`, zb[j]?.items)
          if (zItems === null) { /* 型別已錯 */ } else if (cItems.length !== zItems.length) {
            fail(id, `sections[${i}].blocks[${j}] 項目數不符：正典 ${cItems.length}、中文 ${zItems.length}`)
          } else {
            for (const [k] of cItems.entries()) {
              const s = zItems[k]
              if (typeof s !== 'string' || !s.trim()) fail(id, `sections[${i}].blocks[${j}].items[${k}] 缺漏或為空字串`)
            }
          }
        }
      }
    }
  }

  if (c.type === 'ability') {
    // flavor 的最小存在性檢查（2026-07-29 加入）：
    //   正典 flavor 是非空字串 → 中文必須也是非空字串
    //   正典 flavor 是 null    → 中文可省略
    // 只檢查「有沒有」，不檢查內容——內容對不對是人工對齊的事。
    // 沒有這一條的話，漏譯一整句 flavor 不會有任何徵兆（與先前的 effect 漏洞同類）。
    const cf = typeof c.flavor === 'string' ? c.flavor.trim() : ''
    if (cf) {
      const zf = typeof z.flavor === 'string' ? z.flavor.trim() : ''
      if (!zf) fail(id, `正典有 flavor，中文缺漏或為空字串`)
    }

    const ct = c.powerRoll?.tiers ?? []
    const zt = zhArray(id, 'powerRoll.tiers', z.powerRoll?.tiers) ?? []
    if (ct.length && ct.length !== zt.length) {
      fail(id, `powerRoll.tiers 數量不符：正典 ${ct.length}、中文 ${zt.length}`)
    }
    for (const [i, t] of ct.entries()) {
      if (zt[i] && zt[i].threshold !== t.threshold) {
        fail(id, `tiers[${i}].threshold 不符：正典 ${t.threshold}、中文 ${zt[i].threshold}`)
      }
      const potencyEffect = typeof t.potency?.effect === 'string' ? t.potency.effect.trim() : ''
      const zhPotencyEffect = typeof zt[i]?.potencyEffect === 'string' ? zt[i].potencyEffect.trim() : ''
      if (t.potency && !potencyEffect) {
        fail(id, `tiers[${i}].potency.effect 缺漏或為空字串`)
      }
      if (potencyEffect && !zhPotencyEffect) {
        fail(id, `tiers[${i}].potencyEffect 缺漏或為空字串`)
      }
      if (!t.potency && zhPotencyEffect) {
        fail(id, `tiers[${i}].potencyEffect 無對應正典 potency`)
      }
    }
    // ⚠️ 不可寫成 `ce.length && ze.length && ce.length !== ze.length`——
    // 中文**完全沒有** effect 時 ze.length 為 0，整個條件短路，
    // 「正典有 3 段效果、中文一段都沒翻」會靜默通過。直接比數量。
    const ce = c.effect ?? []
    const ze = zhArray(id, 'effect', z.effect)
    if (ze === null) { /* 型別已錯，跳過段落比對 */ } else if (ce.length !== ze.length) {
      fail(id, `effect 段落數不符：正典 ${ce.length}、中文 ${ze.length}`)
    } else {
      // 只比數量擋不住「段落在、內容是空字串」——那和漏譯一樣沒有徵兆。
      for (const [i] of ce.entries()) {
        const s = ze[i]
        if (typeof s !== 'string' || !s.trim()) fail(id, `effect[${i}] 缺漏或為空字串`)
      }
    }

    // ── 以下三組於 2026-07-29 加入（第三批對齊的 V-B3-1）。
    // 這是第三次出現同一類漏洞：正典有、中文整段缺漏，驗證靜默放行
    // （effect 於第一批補、flavor 於第二批補）。一律採**最小存在性／數量**檢查：
    // 只問「有沒有」「幾個」，不問內容——內容對不對是人工對齊的事。
    //
    // ⚠️ 全部直接比數量，不可寫成 `c.length && z.length && …`——
    // 中文完全沒有該欄位時 length 為 0，短路後整項檢查等於不存在。

    // (1) trigger：正典有非空字串 → 中文必須有非空字串
    const cTrig = typeof c.trigger === 'string' ? c.trigger.trim() : ''
    if (cTrig) {
      const zTrig = typeof z.trigger === 'string' ? z.trigger.trim() : ''
      if (!zTrig) fail(id, '正典有 trigger，中文缺漏或為空字串')
    }

    // (2) extraCosts：數量一致，且每個 effect 非空
    const cx = c.extraCosts ?? []
    const zx = zhArray(id, 'extraCosts', z.extraCosts)
    if (zx === null) { /* 型別已錯 */ } else if (cx.length !== zx.length) {
      fail(id, `extraCosts 數量不符：正典 ${cx.length}、中文 ${zx.length}`)
    } else {
      for (const [i] of cx.entries()) {
        const e = zx[i]?.effect
        if (typeof e !== 'string' || !e.trim()) {
          fail(id, `extraCosts[${i}].effect 缺漏或為空字串`)
        }
      }
    }

    // (3) conditionalEffects：數量一致；每組 trigger／effect 必須存在
    const cce = c.conditionalEffects ?? []
    const zce = zhArray(id, 'conditionalEffects', z.conditionalEffects)
    if (zce === null) { /* 型別已錯 */ } else if (cce.length !== zce.length) {
      fail(id, `conditionalEffects 數量不符：正典 ${cce.length}、中文 ${zce.length}`)
    } else {
      for (const [i, cEffect] of cce.entries()) {
        const zEffect = zce[i] ?? {}
        for (const key of ['trigger', 'effect']) {
          const cv = typeof cEffect[key] === 'string' ? cEffect[key].trim() : ''
          const zv = typeof zEffect[key] === 'string' ? zEffect[key].trim() : ''
          if (!cv) fail(id, `conditionalEffects[${i}].${key} 正典缺漏或為空字串`)
          if (cv && !zv) fail(id, `conditionalEffects[${i}].${key} 缺漏或為空字串`)
        }
      }
    }

    // (4) followUpActions：數量一致；每組 options 數量一致；lead／constraint 存在性
    //     審判有 4 個免費反應動作選項——少譯一個就是玩家少一種戰術，且原本毫無徵兆。
    const cfa = c.followUpActions ?? []
    const zfa = zhArray(id, 'followUpActions', z.followUpActions)
    if (zfa === null) { /* 型別已錯 */ } else if (cfa.length !== zfa.length) {
      fail(id, `followUpActions 數量不符：正典 ${cfa.length}、中文 ${zfa.length}`)
    } else {
      for (const [i, cAct] of cfa.entries()) {
        const zAct = zfa[i] ?? {}
        const cOpts = cAct.options ?? []
        const zOpts = zhArray(id, `followUpActions[${i}].options`, zAct.options)
        if (zOpts === null) { /* 型別已錯 */ } else if (cOpts.length !== zOpts.length) {
          fail(id, `followUpActions[${i}].options 數量不符：正典 ${cOpts.length}、中文 ${zOpts.length}`)
        } else {
          for (const [j] of cOpts.entries()) {
            const s = zOpts[j]
            if (typeof s !== 'string' || !s.trim()) {
              fail(id, `followUpActions[${i}].options[${j}] 缺漏或為空字串`)
            }
          }
        }
        for (const key of ['lead', 'constraint']) {
          const cv = typeof cAct[key] === 'string' ? cAct[key].trim() : ''
          if (!cv) continue
          const zv = typeof zAct[key] === 'string' ? zAct[key].trim() : ''
          if (!zv) fail(id, `followUpActions[${i}].${key} 缺漏或為空字串`)
        }
      }
    }
  }

  if (c.type === 'condition') {
    const ct = c.text ?? []
    const zt = zhArray(id, 'text', z.text)
    if (zt !== null && ct.length !== zt.length) {
      fail(id, `text 段落數不符：正典 ${ct.length}、中文 ${zt.length}`)
    }
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

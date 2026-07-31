/**
 * M0 正典的術語用量掃描。
 *
 * 這裡是**唯一**的掃描實作。`report-m0-terms.mjs`（人看的報告）與
 * `build-m0-release.mjs`（產生 releases/m0.json）都從這裡取結果——
 * 兩邊各寫一份必然會漂移，然後「報告說有、清單說沒有」。
 *
 * 三個通道，刻意分開：
 *
 *   A · 受控值（確定性，免人工複核）
 *     結構欄位存的就是受控值本身，直接查表。命中即為真。涵蓋 16 個欄位路徑
 *     （其中 15 個在目前 28 條正典裡實際出現；`distance.options[].area.shape`
 *     是防禦性的，尚無「二選一的選項之一是區域」這種形狀）：
 *
 *       關鍵詞    keywords[]
 *       動作類型  actionType、followUpActions[].actionType
 *       分類      abilityCategory
 *       屬性      powerRoll.characteristic（含二選一的 .options[]）
 *                 tiers[].potency.characteristic（效力測的是目標的哪個屬性，逐招式不同）
 *       效力      tiers[].potency.level
 *       費用      cost.resource、extraCosts[].resource、conditionalEffects[].cost.resource、
 *                 followUpActions[].cost.resource
 *       距離      distance.kind、distance.options[].kind
 *                 distance.area.shape、distance.options[].area.shape
 *
 *     查表來源分兩種：受控詞彙表以 value 查，術語表以英文查（見 useControlled）。
 *     ⚠️ 2026-07-29 外部 review 前這裡只掃前 4 個欄位，其餘全漏——漏掃不會報錯，
 *     只會讓 releases/m0.json 少一個詞。改動這段時務必同步更新本註解與
 *     scripts/m0-release.test.mjs 的真實資料斷言。
 *
 *   B · 散文文字掃描（需人工複核）
 *     自由文字以字界比對 glossary 與 vocabulary 的英文。**必然有假命中**
 *     （語氣詞 might 對上屬性 Might），故保留上下文供判讀，並由 EXCLUSIONS 排除已判定者。
 *     結構型詞彙表（效力等級／招式分類／招式關鍵詞）刻意不參與，見下。
 *
 *   C · 疑似術語但表裡沒有
 *     把命中區間遮掉，看剩下什麼像規則用語。
 *
 * 三個「掃到卻不算數」的出口，每筆都必須寫理由：
 *   EXCLUSIONS（整個詞全域）、ENTITY_EXCLUSIONS（逐條目）、
 *   SENSE_ASSIGNMENTS（詞義分裂逐筆指定；未指定會中止產生，不猜）。
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { p } from './root.mjs'

/**
 * 通道 B 的人工判定排除清單。
 * **每一筆都必須寫理由**——這是「明明掃到卻不算數」的唯一合法出口，
 * 沒有理由的排除等於偷偷放行。
 */
export const EXCLUSIONS = [
  {
    termEn: 'Line',
    reason: 'Line＝線形是 Area 的一種範圍形狀，**本身是有效術語**，只是 M0 的 28 個條目都還沒用到；' +
      '之後的招式會用到。目前掃到的 4 處全為假命中：3 處是 `line of effect`' +
      '（＝效果線，另有 approved 條目 term.line-of-effect），1 處是「in a straight line」的日常用法。',
    checkedAt: '2026-07-29',
  },
]

/**
 * 結構標記，**不是**術語，掃到要略過。
 *
 * `choice` 出現在 `distance.kind` 與 `powerRoll.characteristic.kind`，
 * 意思是「二選一」。中文呈現的「或」由 renderer 產生，不是查表得來的詞。
 */
export const STRUCTURAL_MARKERS = new Set(['choice'])

/**
 * 哪些詞彙表**只以結構欄位存在**，不參與散文比對。
 *
 * 這類受控值的英文是常見英文字，在散文裡出現時幾乎都是普通用法而非術語：
 *   - `a strong example`／`the weak will be corrupted` 不是效力等級 Strong／Weak
 *   - `You have the Magic skill` 的 Magic 是技能名，不是招式關鍵詞 magic
 *   - `holy magic`／`magic strike` 的 magic 是普通名詞
 *
 * 它們該由通道 A 從結構欄位確定性取得，拿去比對散文只會製造假命中。
 * 2026-07-29 外部 review 指出後新增。
 *
 * ⚠️ **附帶說明：距離種類目前借用招式關鍵詞表。**
 * `distance.kind` 的 melee／ranged／area 在 `data/` 裡只有一個來源——
 * `ability-keywords`，沒有獨立的「距離種類」表。這兩處確實是同一個詞、
 * 同一個中文（近戰／遠程／區域），與 Magic 那種「同字不同概念」不同，故照實對應。
 * 但**這是共用，不是專屬**：manifest 的 `viaFields` 標明每個依賴從哪個欄位來，
 * 日後若要拆出 distance-kinds 表，從 viaFields 就能找出受影響的條目。
 */
export const STRUCTURAL_ONLY_VOCABULARIES = new Set([
  'potency-levels',
  'ability-categories',
  'ability-keywords',
])

/**
 * **逐條目**排除：某個術語在某個正典條目裡的所有命中都不算數。
 *
 * ⚠️ **粒度是「條目」，不是「出現位置」。** 同一個條目內若同時有正確用法與
 * 普通英文字用法，這個機制**無法**分辨——它會把整個條目的命中一起排除。
 * 目前資料沒有這種混合情形；真的遇到時要擴充到欄位或位置粒度，
 * 不要硬套（2026-07-29 外部 review 指出命名誤導，已更正）。
 *
 * 與 EXCLUSIONS（整個詞全域排除）的差別在範圍：
 *   - `You have the Magic skill.`（feature.censor.censor-order）→ 技能名 ✅
 *   - `You infuse your weapon with holy magic`（ability.censor.halt-miscreant）→ 普通名詞 ❌
 *
 * 同樣**每筆都必須寫理由**。
 */
export const ENTITY_EXCLUSIONS = [
  {
    termId: 'term.magic.skill',
    entityIds: ['ability.censor.halt-miscreant', 'ability.censor.your-allies-cannot-save-you'],
    reason: '這兩處是 flavor 的「holy magic」與「your magic strike」，magic 作普通名詞用，'
      + '既不是技能名稱也不是招式關鍵詞。真正用到技能名的只有 feature.censor.censor-order 的'
      + '「You have the Magic skill.」。',
    checkedAt: '2026-07-29',
  },
]

/**
 * 同一個英文對應多個詞義（sense split）時，掃描器**無法**從字面判斷該用哪一個。
 * 這裡逐筆指定，每筆must附理由。沒有指定的歧義命中會讓 build-m0-release 中止，
 * 而不是隨便挑一個——猜錯會讓資料依賴清單指向錯誤的 id。
 *
 * 鍵：`<正典條目 id>|<英文字面>` → 該處實際使用的 term id
 */
export const SENSE_ASSIGNMENTS = [
  {
    entityId: 'ability.censor.purifying-fire',
    surface: 'Fire',
    termId: 'term.fire.damage-type',
    reason: '「淨化聖火」只出現 fire weakness／fire damage，講的是傷害類型，' +
      '與元素師精通「烈火」（term.fire.elementalist-mastery）無關。2026-07-29 外部 review 指出。',
    checkedAt: '2026-07-29',
  },
]

/** 常見英文虛詞／泛用詞，命中後標為「高度可疑」，不是自動採信 */
export const AMBIGUOUS = new Set(['might', 'will', 'reason', 'order', 'save', 'charge', 'fire', 'surge', 'aid', 'lead', 'hide'])

const RULE_VERBS = ['vertical pull', 'vertical push', 'vertical slide', 'slide', 'pull', 'push', 'shift', 'teleport', 'burrow', 'swim', 'climb', 'fly']
const SENTENCE_STARTERS = new Set(['the', 'a', 'an', 'you', 'if', 'when', 'while', 'this', 'that', 'each', 'whenever', 'until', 'at', 'as', 'additionally', 'unless', 'your', 'they', 'it', 'in', 'for', 'after', 'before', 'and', 'or', 'but', 'though', 'choose', 'make', 'these', 'their', 'no', 'on', 'one', 'both', 'some', 'to'])

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const surfaceRe = (s) => new RegExp(`(?<![\\w-])${esc(s).replace(/\s+/g, '\\s+')}(?![\\w-])`, 'gi')

/** 收集一個條目的所有自由文字，附欄位名供報告定位 */
export function proseOf(item) {
  const out = []
  const add = (field, text) => { if (typeof text === 'string' && text.trim()) out.push({ field, text }) }

  add('name', item.name)
  if (item.type === 'ability') {
    add('flavor', item.flavor)
    add('target', item.target)
    add('trigger', item.trigger)
    for (const [i, t] of (item.powerRoll?.tiers ?? []).entries()) {
      add(`tier[${i}]`, t.text)
      add(`tier[${i}].potency.effect`, t.potency?.effect)
    }
    for (const [i, e] of (item.effect ?? []).entries()) add(`effect[${i}]`, e)
    for (const [i, c] of (item.extraCosts ?? []).entries()) add(`extraCosts[${i}]`, c.effect)
    for (const [i, c] of (item.conditionalEffects ?? []).entries()) {
      add(`conditionalEffects[${i}].trigger`, c.trigger)
      add(`conditionalEffects[${i}].effect`, c.effect)
    }
    for (const [i, f] of (item.followUpActions ?? []).entries()) {
      add(`followUp[${i}].lead`, f.lead)
      for (const [j, o] of (f.options ?? []).entries()) add(`followUp[${i}].option[${j}]`, o)
      add(`followUp[${i}].constraint`, f.constraint)
    }
  }
  if (item.type === 'condition') {
    for (const [i, t] of (item.text ?? []).entries()) add(`text[${i}]`, t)
  }
  if (item.type === 'feature') {
    for (const [i, s] of (item.sections ?? []).entries()) {
      add(`section[${i}].heading`, s.heading)
      for (const [j, b] of (s.blocks ?? []).entries()) {
        if (b.kind === 'paragraph') add(`section[${i}].block[${j}]`, b.text)
        if (b.kind === 'definitionList') {
          for (const [k, it] of b.items.entries()) {
            add(`section[${i}].block[${j}].item[${k}].term`, it.term)
            add(`section[${i}].block[${j}].item[${k}]`, it.text)
          }
        }
        if (b.kind === 'bulletList') {
          add(`section[${i}].block[${j}].lead`, b.lead)
          for (const [k, txt] of (b.items ?? []).entries()) add(`section[${i}].block[${j}].item[${k}]`, txt)
        }
      }
    }
  }
  return out
}

/**
 * @param {Set<string> | string[] | null} [idFilter] 限定只掃這些 id（milestone 的
 *   release manifest 用來凍結掃描範圍，即使 data/canon/ 之後加入其他 milestone 的
 *   條目也不受影響）。省略時掃描 data/canon/ 全部檔案（既有呼叫端的行為不變）。
 */
export function scan(idFilter) {
  const allowlist = idFilter ? new Set(idFilter) : null

  // ── 讀入 ───────────────────────────────────────────────
  const canonFiles = []
  const walk = (dir) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      if (e.isDirectory()) { if (e.name !== '_normalized') walk(`${dir}/${e.name}`); continue }
      if (e.name.endsWith('.json')) canonFiles.push(`${dir}/${e.name}`)
    }
  }
  walk(p('data/canon'))
  const canon = canonFiles.map((f) => JSON.parse(readFileSync(f, 'utf8')))
    .filter((item) => !allowlist || allowlist.has(item.id))

  const glossary = JSON.parse(readFileSync(p('data/glossary.json'), 'utf8'))
  const vocabDir = p('data/vocabulary')
  const vocabularies = existsSync(vocabDir)
    ? readdirSync(vocabDir).filter((f) => f.endsWith('.json'))
        .map((f) => JSON.parse(readFileSync(resolve(vocabDir, f), 'utf8')))
    : []

  const vocabIndex = new Map()
  for (const v of vocabularies) vocabIndex.set(v.vocabulary, new Map(v.values.map((x) => [x.value, x])))

  /** glossary 以英文查（結構欄位存的是小寫 value，如 "might" → 詞條 "Might"） */
  const glossaryByEn = new Map()
  for (const t of glossary.terms) {
    const k = t.en.trim().toLowerCase()
    if (!glossaryByEn.has(k)) glossaryByEn.set(k, [])
    glossaryByEn.get(k).push(t)
  }

  // ── 通道 A ─────────────────────────────────────────────
  const controlled = new Map()
  /**
   * @param source `vocab:<表名>` 以 value 查詞彙表；`glossary` 以英文查術語表
   * @param field  這個依賴是**哪個結構欄位**帶出來的，寫進 manifest 供稽核
   */
  const useControlled = (source, value, fromId, field) => {
    if (value === null || value === undefined) return
    if (STRUCTURAL_MARKERS.has(value)) return    // choice 之類的結構標記不是術語

    let found = null
    let miss
    if (source.startsWith('vocab:')) {
      const tbl = source.slice(6)
      found = vocabIndex.get(tbl)?.get(value) ?? null
      miss = `${tbl}:${value}`
    } else {
      const hits = glossaryByEn.get(String(value).trim().toLowerCase()) ?? []
      // 同一英文多個詞義時不猜——與通道 B 同一原則
      found = hits.length === 1 ? hits[0] : null
      miss = hits.length > 1 ? `glossary:${value}（${hits.length} 個詞義，需指定）` : `glossary:${value}`
    }

    const key = found ? found.id : `⚠️ ${miss}（查不到）`
    if (!controlled.has(key)) {
      controlled.set(key, {
        entry: found, vocabName: source, value,
        from: new Set(), fields: new Set(),
        // ⚠️ `from` 與 `fields` 是**各自彙總**的集合，兩者相乘並不等於實際發生的組合。
        // 例如某術語被 A 條目從欄位 X、B 條目從欄位 Y 用到，彙總後看起來像四種組合。
        // `usages` 保留真正的 (條目, 欄位) 配對，才能證明「這個 usedBy 是這個欄位帶出來的」。
        // 2026-07-29 外部 review 指出彙總無法佐證，故新增。
        usages: new Set(),
      })
    }
    const c = controlled.get(key)
    c.from.add(fromId)
    c.fields.add(field)
    c.usages.add(`${fromId}|${field}`)
  }

  for (const item of canon) {
    if (item.type !== 'ability') continue

    for (const k of item.keywords ?? []) useControlled('vocab:ability-keywords', k, item.id, 'keywords[]')
    useControlled('vocab:action-types', item.actionType, item.id, 'actionType')
    useControlled('vocab:ability-categories', item.abilityCategory, item.id, 'abilityCategory')

    // 檢定屬性：單一存字串、二選一存物件（見指南 §4.7(1)）
    const ch = item.powerRoll?.characteristic
    if (typeof ch === 'string') useControlled('glossary', ch, item.id, 'powerRoll.characteristic')
    else if (ch && Array.isArray(ch.options)) {
      for (const o of ch.options) useControlled('glossary', o, item.id, 'powerRoll.characteristic.options[]')
    }

    for (const t of item.powerRoll?.tiers ?? []) {
      if (!t.potency) continue
      useControlled('vocab:potency-levels', t.potency.level, item.id, 'tiers[].potency.level')
      // 效力測的是**目標的哪個屬性**，逐招式不同（指南 §4.3.0）
      useControlled('glossary', t.potency.characteristic, item.id, 'tiers[].potency.characteristic')
    }

    // 英雄資源費用
    useControlled('glossary', item.cost?.resource, item.id, 'cost.resource')
    for (const e of item.extraCosts ?? []) {
      // 目前資料是 extraCosts[].resource；防禦性支援巢狀 cost.resource
      useControlled('glossary', e.resource ?? e.cost?.resource, item.id, 'extraCosts[].resource')
    }
    for (const e of item.conditionalEffects ?? []) {
      useControlled('glossary', e.cost?.resource, item.id, 'conditionalEffects[].cost.resource')
    }
    for (const f of item.followUpActions ?? []) {
      useControlled('vocab:action-types', f.actionType, item.id, 'followUpActions[].actionType')
      useControlled('glossary', f.cost?.resource, item.id, 'followUpActions[].cost.resource')
    }

    // 距離：kind／二選一的 options／區域形狀
    const d = item.distance
    if (d) {
      useControlled('vocab:ability-keywords', d.kind, item.id, 'distance.kind')
      for (const o of d.options ?? []) {
        useControlled('vocab:ability-keywords', o.kind, item.id, 'distance.options[].kind')
        if (o.area?.shape) useControlled('glossary', o.area.shape, item.id, 'distance.options[].area.shape')
      }
      if (d.area?.shape) useControlled('glossary', d.area.shape, item.id, 'distance.area.shape')
    }
  }

  // ── 比對面 ─────────────────────────────────────────────
  const surfaces = []
  for (const t of glossary.terms) {
    for (const s of [t.en, ...(t.aliasesEn ?? [])]) {
      if (typeof s === 'string' && s.trim()) surfaces.push({ term: t, surface: s })
    }
  }
  // vocabulary 的英文也要納入：散文會直接提到受控詞（「using the Knockback maneuver」），
  // 只比對 glossary 會把已定案的詞誤報成缺詞。
  // 但**結構型詞彙表除外**——它們的英文是常見英文字，比對散文只會製造假命中，
  // 且本來就由通道 A 從結構欄位確定性取得。
  for (const v of vocabularies) {
    if (STRUCTURAL_ONLY_VOCABULARIES.has(v.vocabulary)) continue
    for (const x of v.values) {
      for (const s of [x.en, x.value]) {
        if (typeof s === 'string' && s.trim()) {
          surfaces.push({ term: { ...x, source: `vocabulary:${v.vocabulary}` }, surface: s })
        }
      }
    }
  }
  // 單字詞補規則複數。術語表不該為每個詞形各開一條（Victories 就是 Victory）。
  for (const { term, surface } of [...surfaces]) {
    if (/\s/.test(surface)) continue
    const plural = /[^aeiou]y$/i.test(surface) ? surface.slice(0, -1) + 'ies'
      : /(s|x|z|ch|sh)$/i.test(surface) ? surface + 'es'
        : surface + 's'
    surfaces.push({ term, surface: plural, inflected: true })
  }
  surfaces.sort((a, b) => b.surface.length - a.surface.length)

  // 哪些字面對應到多個詞義（sense split）——字面比對無從分辨，必須人工指定
  const bySurface = new Map()
  for (const { term, surface } of surfaces) {
    const k = surface.toLowerCase()
    if (!bySurface.has(k)) bySurface.set(k, new Set())
    bySurface.get(k).add(term.id)
  }
  const ambiguousSurfaces = new Set([...bySurface.entries()].filter(([, ids]) => ids.size > 1).map(([k]) => k))
  const assignment = new Map(
    SENSE_ASSIGNMENTS.map((a) => [`${a.entityId}|${a.surface.toLowerCase()}`, a.termId]))

  // ── 通道 B ─────────────────────────────────────────────
  const prose = new Map()
  /** 歧義字面且無人工指定者，記在這裡讓 build 中止，而不是隨便挑一個 */
  const unresolvedSenses = new Map()
  for (const item of canon) {
    for (const { field, text } of proseOf(item)) {
      // 同一詞條可能有多個比對面指向同一段文字，不去重會讓處數灌水
      const seen = new Set()
      for (const { term, surface } of surfaces) {
        for (const m of text.matchAll(surfaceRe(surface))) {
          const sKey = surface.toLowerCase()
          if (ambiguousSurfaces.has(sKey)) {
            const chosen = assignment.get(`${item.id}|${sKey}`)
            if (!chosen) {
              const uk = `${item.id}|${sKey}`
              if (!unresolvedSenses.has(uk)) {
                unresolvedSenses.set(uk, {
                  entityId: item.id, surface, field,
                  candidates: [...bySurface.get(sKey)],
                  context: text.slice(Math.max(0, m.index - 40), m.index + 40).replace(/\s+/g, ' '),
                })
              }
              continue                       // 不猜
            }
            if (term.id !== chosen) continue  // 人工指定的是另一個詞義
          }
          // 逐處排除：這個術語在這個條目裡的命中已人工判定為不算數
          if (ENTITY_EXCLUSIONS.some((o) => o.termId === term.id && o.entityIds.includes(item.id))) continue
          const key = `${term.id}@${field}@${m.index}-${m[0].length}`
          if (seen.has(key)) continue
          seen.add(key)
          if (!prose.has(term.id)) prose.set(term.id, { term, hits: [] })
          const s = Math.max(0, m.index - 32)
          prose.get(term.id).hits.push({
            id: item.id, field, surface, matched: m[0],
            context: (s > 0 ? '…' : '') + text.slice(s, m.index + m[0].length + 32).replace(/\s+/g, ' ') + '…',
          })
        }
      }
    }
  }

  // ── 通道 C ─────────────────────────────────────────────
  const knownSurfaces = new Set(surfaces.map((s) => s.surface.toLowerCase()))
  const candidates = new Map()
  for (const item of canon) {
    for (const { field, text } of proseOf(item)) {
      // 名稱依指南 §2 屬條目專屬譯文，不是受控術語；掃它只會得到雜訊
      if (field === 'name') continue
      const masked = text.split('')
      for (const { surface } of surfaces) {
        for (const m of text.matchAll(surfaceRe(surface))) {
          for (let i = m.index; i < m.index + m[0].length; i++) masked[i] = ' '
        }
      }
      const rest = masked.join('')
      const note = (phrase, idx) => {
        const key = phrase.toLowerCase()
        if (!candidates.has(key)) candidates.set(key, [])
        const s = Math.max(0, idx - 32)
        candidates.get(key).push({
          id: item.id, field, phrase,
          context: (s > 0 ? '…' : '') + text.slice(s, idx + phrase.length + 32).replace(/\s+/g, ' ') + '…',
        })
      }
      for (const m of rest.matchAll(/(?<![.!?]\s|^)\b([A-Z][a-z]{2,})\b/gm)) {
        if (SENTENCE_STARTERS.has(m[1].toLowerCase())) continue
        note(m[1], m.index)
      }
      // ⚠️ 規則動詞比對**原文**而非遮罩後文字。`vertical pull` 的 pull 會先被
      // glossary 的 Pull 遮掉，整個詞就被靜默藏起來。
      for (const v of RULE_VERBS) {
        if (knownSurfaces.has(v)) continue
        for (const m of text.matchAll(new RegExp(`(?<![\\w-])${v.replace(/\s+/g, '\\s+')}(?![\\w-])`, 'gi'))) {
          note(v, m.index)
        }
      }
    }
  }

  // ── 實體名稱解析 ───────────────────────────────────────
  // 9 個狀態的中文名**刻意不存在 glossary**（名稱權威在狀態實體，兩處都放會變成雙重權威，
  // 見指南 §9.2）。所以那些詞條的 zhHant 是 undefined。
  // 若不在這裡解析，release manifest 就會出現「有 id、沒中文」的條目，無從追溯——
  // 2026-07-29 外部 review 指出。
  //
  // ⚠️ 只確認 `nameZhHant` 存在**不夠**——那只證明「有人打了字」，不證明「已批准」。
  // 必須同時滿足 `meta.status === 'reviewed'` 且有 `meta.reviewedBy`，
  // 否則等於讓未審核的譯名混進 release manifest（2026-07-29 外部 review 指出）。
  const ENTITY_REQUIRED_STATUS = 'reviewed'
  const entityNames = new Map()
  const zhDir = p('data/zh-Hant/conditions')
  if (existsSync(zhDir)) {
    for (const f of readdirSync(zhDir).filter((x) => x.endsWith('.json'))) {
      const e = JSON.parse(readFileSync(resolve(zhDir, f), 'utf8'))
      const status = e.meta?.status
      const reviewedBy = e.meta?.reviewedBy
      const problems = []
      if (!e.nameZhHant) problems.push('缺 nameZhHant')
      if (status !== ENTITY_REQUIRED_STATUS) problems.push(`meta.status=${status ?? '（無）'}，需為 ${ENTITY_REQUIRED_STATUS}`)
      if (!reviewedBy) problems.push('缺 meta.reviewedBy')
      entityNames.set(e.id, {
        nameZhHant: e.nameZhHant, status, reviewedBy,
        usable: problems.length === 0,
        problems,
      })
    }
  }

  const excluded = new Set(EXCLUSIONS.map((e) => e.termEn.toLowerCase()))
  return {
    canon,
    controlled,
    prose,
    candidates,
    entityNames,
    unresolvedSenses: [...unresolvedSenses.values()],
    /**
     * 通道 A 的 (術語 id, 正典條目 id, 結構欄位) 三元組。
     * manifest 只放彙總的 viaFields；要驗「某個 usedBy 確實由某個欄位帶出」得看這裡。
     */
    controlledUsages: [...controlled.entries()].flatMap(([id, v]) =>
      [...v.usages].map((u) => {
        const [entityId, field] = u.split('|')
        return { termId: v.entry?.id ?? id, entityId, field }
      })),
    /** 通道 B 扣掉人工判定的假命中後，真正算數的術語 */
    proseKept: [...prose.values()].filter((x) => !excluded.has((x.term.en ?? '').toLowerCase())),
    proseExcluded: [...prose.values()].filter((x) => excluded.has((x.term.en ?? '').toLowerCase())),
  }
}

/**
 * 正典內容的中立轉換層 —— 網站（web/src，TypeScript React）與驗收頁
 * （scripts/build-owner-review-html.mjs，Node）**共用同一份**。
 *
 * 存在的理由：這些規則先前被兩套程式各自解讀，同一條規則出現兩種答案。
 * 效力效果多寫的字在兩邊長得一模一樣；「力量或敏捷」的空格卻兩邊不同。
 *
 * 邊界（不要打破）：
 *   - 不 import React、DOM API、node:* —— 兩邊的執行環境不同
 *   - 只輸出資料、純文字與 token；**不吐 JSX，也不拼 HTML**
 *   - 呈現方式仍由各自的渲染層決定
 */

/** 官方符號字型的字元對應，出自官方字符表，非推測（見 docs/alignment/method-validation.md）。 */
export const GLYPH = { distance: 'o', target: 'x' }
export const TIER_GLYPHS = ['á', 'é', 'í']

export const CHARACTERISTICS = {
  might: { zh: '力量', en: 'Might', mark: 'M' },
  agility: { zh: '敏捷', en: 'Agility', mark: 'A' },
  reason: { zh: '理性', en: 'Reason', mark: 'R' },
  intuition: { zh: '直覺', en: 'Intuition', mark: 'I' },
  presence: { zh: '氣場', en: 'Presence', mark: 'P' },
  choice: { zh: '任選', en: 'Choice', mark: '' },
}

/** 傷害算式裡才做成徽章；內文提到力量、敏捷時是寫字不是畫框（原版規則書同此）。 */
export const ATTRIBUTE_NAMES_ZH = new Set(Object.values(CHARACTERISTICS).map((c) => c.zh))

/**
 * 英雄資源名稱。逐一新增即可，不需要改呼叫端——網站與驗收頁的「N 怒火」都曾寫死，
 * 一律改查這裡（2026-07-31 修正）。查不到時退回顯示原始 resource 字串，
 * 不讓畫面空白，但也不會偽裝成已核准的譯名。
 * Piety＝虔誠為 2026-07-31 擁有者裁定（approved glossary term.piety），非 AI 自行假定。
 */
export const RESOURCES = {
  wrath: { zh: '怒火', en: 'Wrath' },
  piety: { zh: '虔誠', en: 'Piety' },
}

export function resourceLabel(resource, lang = 'zh') {
  if (!resource) return ''
  const found = RESOURCES[resource]
  if (found) return found[lang] ?? resource
  return lang === 'zh' ? resource : resource[0].toUpperCase() + resource.slice(1)
}

/**
 * 「N 怒火」這類「數值＋資源名」的複合文字，成本徽章與 extraCosts 標題共用。
 * `cost.open`（2026-07-31 M1 治癒恩典新增，擁有者已核准）＝原文的「1+」，數值後補「+」。
 */
export function costLabel(cost, lang = 'zh') {
  if (!cost) return lang === 'zh' ? '無' : 'None'
  return `${cost.value}${cost.open ? '+' : ''} ${resourceLabel(cost.resource, lang)}`
}

const DISTANCE_KINDS = {
  melee: { zh: '近戰', en: 'Melee' },
  ranged: { zh: '遠程', en: 'Ranged' },
  self: { zh: '自身', en: 'Self' },
}
// burst 是 2026-07-31 M1 Batch 3 新增的區域形狀（天降光霖 2 爆發、恩典布道 4 爆發），擁有者已核准。
// 與 cube 不同：burst 沒有「within」（原文本身沒有這個限定詞，隱含以自身為中心），
// distanceLabel／composeDistance 需視 within 是否存在分開組字，見下。
const AREA_SHAPES = { cube: { zh: '立方', en: 'cube' }, burst: { zh: '爆發', en: 'burst' } }

const TARGETS_ZH = {
  'One creature': '1 個生物',
  'One creature or object': '1 個生物或物體',
  'One enemy': '1 個敵人',
  'Self or one ally': '自身或 1 個盟友',
  'Each enemy in the area': '區域內每個敵人',
  'One willing creature': '1 個自願的生物',
  // 2026-07-31 M1 樣本新增：純自身鎖定的招式（如忠誠好友）target 就是單獨的 "Self"，
  // 與 distance.kind:"self" 用同一個「自身」，不需要另外的中文譯文欄位。
  Self: '自身',
  // 2026-07-31 M1 Batch 3 新增：沿用「One enemy＝1 個敵人」「Each enemy in the area＝區域內每個敵人」
  // 已核准的組合公式（數量／each ＋ 對象 ＋ 範圍），僅代入神導士招式實際出現的對象與數量。
  // 「One dead creature」的 dead 是新出現的修飾語，套用 §4.4 willing 同款「修飾＋對象」公式，
  // 擁有者已核准套用方式。
  'One ally': '1 個盟友',
  'Each ally in the area': '區域內每個盟友',
  'Four allies': '4 個盟友',
  'One dead creature': '1 個已死亡的生物',
  Special: '特殊',
}

/**
 * `powerRoll.characteristic` 可能是字串，也可能是 { kind:'choice', options:[…] }
 * （兩個基礎打擊都是「力量或敏捷」）。曾因為把物件直接丟進 JSX 而讓整頁空白。
 */
export function characteristicLabel(value, lang = 'zh') {
  if (!value) return ''
  if (typeof value === 'string') return CHARACTERISTICS[value]?.[lang] ?? value
  if (value.kind === 'choice') {
    const parts = (value.options ?? []).map((o) => CHARACTERISTICS[o]?.[lang] ?? o)
    return parts.join(lang === 'zh' ? '或' : ' or ')
  }
  return value.raw ?? ''
}

export function distanceLabel(distance, lang = 'zh') {
  if (!distance) return lang === 'zh' ? '—' : '—'
  if (distance.kind === 'choice') {
    return (distance.options ?? []).map((o) => distanceLabel(o, lang)).join(lang === 'zh' ? ' 或 ' : ' or ')
  }
  if (distance.kind === 'area') {
    const shape = AREA_SHAPES[distance.area?.shape]?.[lang] ?? distance.area?.shape ?? ''
    const within = distance.area?.within
    if (within == null) return lang === 'zh' ? `${distance.area?.size ?? ''} ${shape}`.trim() : `${distance.area?.size ?? ''} ${shape}`.trim()
    return lang === 'zh'
      ? `${within} 格內 ${distance.area?.size ?? ''} ${shape}`.trim()
      : `${distance.area?.size ?? ''} ${shape} within ${within}`.trim()
  }
  const name = DISTANCE_KINDS[distance.kind]?.[lang] ?? distance.kind
  return distance.value != null ? `${name} ${distance.value}` : name
}

export function targetLabel(target, lang = 'zh') {
  if (!target) return '—'
  return lang === 'zh' ? TARGETS_ZH[target] ?? target : target
}

/** 「屬性 < 等級」的文字；徽章樣式由各自的渲染層決定。 */
export function potencyLabel(potency, potencyLevelLabels, lang = 'zh') {
  if (!potency) return ''
  const char = characteristicLabel(potency.characteristic, lang)
  const raw = potencyLevelLabels?.[potency.level]
  const level = lang === 'zh' ? raw?.zhHant ?? raw?.zh ?? potency.level : String(raw?.en ?? potency.level).toUpperCase()
  return `${char} < ${level}`
}

/**
 * 行內標記解析成中立 token；由呼叫端決定畫成什麼。
 * `詞` → term（isAttribute 標出屬性，供傷害算式做徽章）；[文字](id) → ref。
 */
export function parseRichText(text) {
  if (text == null) return []
  const pattern = /\[([^\]]+)\]\(([^)]+)\)|`([^`]+)`/g
  const tokens = []
  let cursor = 0
  let match
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > cursor) tokens.push({ kind: 'text', text: text.slice(cursor, match.index) })
    if (match[1] && match[2]) tokens.push({ kind: 'ref', text: match[1], id: match[2] })
    else tokens.push({ kind: 'term', text: match[3], isAttribute: ATTRIBUTE_NAMES_ZH.has(match[3]) })
    cursor = pattern.lastIndex
  }
  if (cursor < text.length) tokens.push({ kind: 'text', text: text.slice(cursor) })
  return tokens
}

/** 摘要等純文字場合：把行內標記還原成可讀文字。 */
export function plainText(text) {
  return parseRichText(text).map((t) => t.text).join('')
}

// ── round-trip：把結構化欄位重新組回書上原文 ─────────────────────────
// 這些 compose* 是「唯一的正典組合函式」。scripts/verify-canon-roundtrip.mjs
// 用它們比對 raw，抓出結構化過程中被增刪或改寫的內容。

export function composeDistance(distance) {
  if (!distance) return ''
  if (distance.kind === 'choice') return (distance.options ?? []).map(composeDistance).join(' or ')
  if (distance.kind === 'area') {
    const within = distance.area?.within
    return within == null ? `${distance.area?.size} ${distance.area?.shape}` : `${distance.area?.size} ${distance.area?.shape} within ${within}`
  }
  const name = DISTANCE_KINDS[distance.kind]?.en ?? distance.kind
  return distance.value != null ? `${name} ${distance.value}` : name
}

export function composeCharacteristic(value) {
  if (typeof value === 'string') return CHARACTERISTICS[value]?.en ?? value
  if (value?.kind === 'choice') return (value.options ?? []).map((o) => CHARACTERISTICS[o]?.en ?? o).join(' or ')
  return ''
}

/**
 * `options`／`lead`（無 `effect`）是 2026-07-31 M1 Batch 3 新增的形狀，擁有者已核准——治癒恩典的
 * 「Spend 1+ Piety: For each piety spent, choose one of the following enhancements: …」，
 * 花費是開放式（`open: true`＝原文的「1+」），且效果是條列選項而非單一句子，
 * 既有的「resource/value/effect」形狀裝不下，故新增此形狀。
 * 沿用既有 extraCosts 的扁平欄位風格（resource/value 在頂層，不是巢狀 cost）。
 */
export function composeExtraCost(extraCost) {
  const resource = extraCost.resource ? extraCost.resource[0].toUpperCase() + extraCost.resource.slice(1) : ''
  const value = `${extraCost.value}${extraCost.open ? '+' : ''}`
  if (extraCost.options) return `Spend ${value} ${resource}: ${extraCost.lead} ${extraCost.options.join(' ')}`
  return `Spend ${value} ${resource}: ${extraCost.effect}`
}

/** 效力記號，例如 P<WEAK —— 原版規則書的寫法。 */
export function composePotencyMark(potency) {
  const mark = CHARACTERISTICS[potency.characteristic]?.mark ?? potency.characteristic
  return `${mark}<${String(potency.level).toUpperCase()}`
}

/** 階層完整句：「2 + M holy damage; P<WEAK, slowed (save ends)」。 */
export function composeTier(tier) {
  if (!tier.potency) return tier.text
  return `${tier.text}; ${composePotencyMark(tier.potency)}, ${tier.potency.effect}`
}

/**
 * 比對用正規化 —— 刻意保持有限且明確，只吸收排版差異，不吸收語意差異：
 * 大小寫、前後空白與連續空白、標點前後的空白、句末句號。
 * 「them → the target」這種改寫**不會**被正規化掉，會被當成偏離報出來。
 */
export function normalizeForCompare(text) {
  return String(text ?? '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/\s*([,;:])\s*/g, '$1 ')
    .replace(/\s*\.\s*$/, '')
    .trim()
}

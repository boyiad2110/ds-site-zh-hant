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

const DISTANCE_KINDS = {
  melee: { zh: '近戰', en: 'Melee' },
  ranged: { zh: '遠程', en: 'Ranged' },
  self: { zh: '自身', en: 'Self' },
}
const AREA_SHAPES = { cube: { zh: '立方', en: 'cube' } }

const TARGETS_ZH = {
  'One creature': '1 個生物',
  'One creature or object': '1 個生物或物體',
  'One enemy': '1 個敵人',
  'Self or one ally': '自身或 1 個盟友',
  'Each enemy in the area': '區域內每個敵人',
  'One willing creature': '1 個自願的生物',
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
    return lang === 'zh'
      ? `${distance.area?.within ?? ''} 格內 ${distance.area?.size ?? ''} ${shape}`.trim()
      : `${distance.area?.size ?? ''} ${shape} within ${distance.area?.within ?? ''}`.trim()
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
  if (distance.kind === 'area') return `${distance.area?.size} ${distance.area?.shape} within ${distance.area?.within}`
  const name = DISTANCE_KINDS[distance.kind]?.en ?? distance.kind
  return distance.value != null ? `${name} ${distance.value}` : name
}

export function composeCharacteristic(value) {
  if (typeof value === 'string') return CHARACTERISTICS[value]?.en ?? value
  if (value?.kind === 'choice') return (value.options ?? []).map((o) => CHARACTERISTICS[o]?.en ?? o).join(' or ')
  return ''
}

export function composeExtraCost(extraCost) {
  const resource = extraCost.resource ? extraCost.resource[0].toUpperCase() + extraCost.resource.slice(1) : ''
  return `Spend ${extraCost.value} ${resource}: ${extraCost.effect}`
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

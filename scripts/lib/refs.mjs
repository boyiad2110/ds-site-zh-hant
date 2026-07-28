/**
 * 引用解析。集中於此以便測試，避免各處自行掃描。
 *
 * ⚠️ 目前 repository 中**唯一**指向 id 的正式欄位是 glossary 條目的 `entityRef`，
 * 而它指向的是**實體 id（condition.*）**，不是 glossary term id。
 * 因此「provisional glossary id 被正式引用」目前在真實資料中不可能發生。
 *
 * 本模組仍實作該檢查，理由是：
 *   1. 日後招式／狀態資料引用 term id 時立即生效
 *   2. 讓「不得引用 provisional」從註解裡的宣稱變成可執行的規則
 *
 * 文件不得宣稱超出本模組實際覆蓋範圍的保證。
 */

/**
 * 尚未建立實體的**明確** allowlist。
 *
 * ⚠️ 不使用前綴放行 —— `condition.sloewd` 這類拼錯必須失敗，
 *    而非因為開頭是 `condition.` 就被放過。
 *
 * 正式 condition 資料建立後，逐一移除對應項目，改由真實實體集合驗證。
 */
export const PENDING_ENTITY_ALLOWLIST = Object.freeze([
  'condition.bleeding',
  'condition.dazed',
  'condition.frightened',
  'condition.grabbed',
  'condition.prone',
  'condition.restrained',
  'condition.slowed',
  'condition.taunted',
  'condition.weakened',
])

/**
 * 從資料集合中蒐集所有 id 引用。
 * @returns {{from: string, field: string, id: string}[]}
 */
export function collectRefs(datasets) {
  const refs = []
  for (const { file, field, items } of datasets) {
    for (const item of items ?? []) {
      const v = item[field]
      if (!v) continue
      for (const id of Array.isArray(v) ? v : [v]) {
        refs.push({ from: `${file}#${item.id ?? item.en ?? '?'}`, field, id })
      }
    }
  }
  return refs
}

/**
 * 解析引用。
 * @param refs       collectRefs 的輸出
 * @param known      Map<id, {idStatus?}> 已知的正式 id
 * @param allowlist  尚未建立實體的明確 id 清單 → 只警告
 */
export function resolveRefs(refs, known, allowlist = PENDING_ENTITY_ALLOWLIST) {
  const allow = new Set(allowlist)
  const errors = []
  const warnings = []
  for (const r of refs) {
    if (known.has(r.id)) {
      if (known.get(r.id).idStatus === 'provisional') {
        errors.push({
          code: 'provisional-referenced',
          message: `${r.from} 的 ${r.field} 指向 provisional id：${r.id}`,
        })
      }
      continue
    }
    if (allow.has(r.id)) {
      warnings.push(`${r.from} 的 ${r.field} 指向尚未建立的實體：${r.id}（allowlist）`)
      continue
    }
    errors.push({
      code: 'unresolved-ref',
      message: `${r.from} 的 ${r.field} 指向不存在且不在 allowlist 的 id：${r.id}`,
    })
  }
  return { errors, warnings }
}

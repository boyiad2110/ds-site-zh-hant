/**
 * stable id 帳本的計算邏輯。抽出以便測試。
 *
 * candidate 的正確定義：
 *
 *     舊正式 ledger
 *   － 已通過驗證的 tombstone id
 *   ＋ 目前正式資料中的 stable id（glossary ∪ vocabulary）
 *
 * 直接沿用舊 ledger 而不扣除 tombstone，會讓合法移除的 id 留在 candidate，
 * 於 `--commit` 時被判為 ledger-candidate-extra-id。
 */

/** glossary 條目的 signature */
export const glossarySignature = (t) => `${t.en}|${t.sense ?? ''}`

/** vocabulary 值的 signature —— 需能區分詞彙表、value 與英文正式值 */
export const vocabularySignature = (group, v) => `vocabulary|${group}|${v.value}|${v.en}`

/**
 * 蒐集目前正式資料中的全部 stable id 及其 signature。
 * @param glossaryTerms glossary.json 的 terms
 * @param vocabularies  [{vocabulary, values}]
 * @returns Map<id, signature>
 */
export function collectStableIds(glossaryTerms, vocabularies) {
  const out = new Map()
  for (const t of glossaryTerms) {
    if (t.idStatus !== 'stable') continue
    out.set(t.id, glossarySignature(t))
  }
  for (const v of vocabularies) {
    for (const val of v.values) {
      if (val.idStatus && val.idStatus !== 'stable') continue
      out.set(val.id, vocabularySignature(v.vocabulary, val))
    }
  }
  return out
}

/**
 * 計算 candidate ledger。
 * @param ledgerIds    舊正式 ledger 的 ids 物件
 * @param tombstoneIds 已通過驗證的 tombstone id 集合
 * @param stableIds    collectStableIds 的輸出
 */
export function computeCandidate(ledgerIds, tombstoneIds, stableIds) {
  const ids = {}
  for (const [id, rec] of Object.entries(ledgerIds)) {
    if (tombstoneIds.has(id)) continue      // 合法移除者不進 candidate
    ids[id] = rec
  }
  for (const [id, signature] of stableIds) {
    if (!ids[id]) ids[id] = { signature }
  }
  return ids
}

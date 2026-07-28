/**
 * 詞彙匯入的純函式，抽出以便單元測試。
 * 見 docs/translation-guide.md §9.1–9.3
 */

/** 極簡 CSV 解析：支援雙引號欄位、欄內逗號與換行 */
export function parseCsv(text) {
  const rows = []
  let row = [], field = '', quoted = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++ } else quoted = false
      } else field += c
    } else if (c === '"') quoted = true
    else if (c === ',') { row.push(field); field = '' }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = '' }
    else if (c !== '\r') field += c
  }
  if (field || row.length) { row.push(field); rows.push(row) }
  return rows
}

/**
 * 別名拆分。
 * 只以全形／半形分號拆分——**不以逗號拆分**，因為名稱本身可能含逗號。
 * trim、去空值、同欄去重、保留原始順序。
 */
export function splitAliases(raw) {
  if (!raw) return { values: [], addedBySplit: 0 }
  const parts = String(raw).split(/[；;]/)
  const seen = new Set()
  const values = []
  for (const p of parts) {
    const v = p.trim()
    if (!v || seen.has(v)) continue
    seen.add(v)
    values.push(v)
  }
  // 實際「新增」的元素數：拆分前是 1 筆，拆分後是 n 筆 → 新增 n-1
  return { values, addedBySplit: values.length > 1 ? values.length - 1 : 0 }
}

const CJK = /[㐀-䶿一-鿿豈-﫿]/
const hasCjk = (s) => CJK.test(s)
const isAsciiish = (s) => /^[\x20-\x7E]+$/.test(s)

/**
 * 語言與重複異常偵測。**只回報，不自行修正**——搬移欄位屬於裁決，不屬於匯入。
 */
export function detectAnomalies({ en, zhHant, aliasesEn, aliasesZhHant }) {
  const out = []
  for (const a of aliasesEn) {
    if (hasCjk(a)) out.push({ issue: 'cjk-in-alias-en', en, value: a })
    if (a === en) out.push({ issue: 'alias-equals-name', en, field: 'aliasesEn', value: a })
  }
  for (const a of aliasesZhHant) {
    if (isAsciiish(a) && /[A-Za-z]/.test(a)) out.push({ issue: 'ascii-in-alias-zh', en, value: a })
    if (zhHant && a === zhHant) out.push({ issue: 'alias-equals-name', en, field: 'aliasesZhHant', value: a })
  }
  for (const a of aliasesEn) {
    if (aliasesZhHant.includes(a)) out.push({ issue: 'alias-in-both-fields', en, value: a })
  }
  return out
}

/** id 由英文生成。生成後其穩定性由 idStatus 表示，與 status（譯名是否批准）無關。 */
export function termId(en, sense) {
  const base = String(en).trim().toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  return sense ? `term.${base}.${sense}` : `term.${base}`
}

/** 「規則/狀態」的詞條對應到 condition 實體，名稱由實體負責（見指南 §9.1） */
export function conditionId(en) {
  return `condition.${String(en).trim().toLowerCase().replace(/\s+/g, '-')}`
}

/**
 * 同英文同譯名的多列合併。
 *
 * ⚠️ 英文與中文相同**不代表**整列可丟棄 —— category／subcategory／alt-en／alt-zh／note
 *    仍可能不同。先到先贏會靜默丟失資訊。
 *
 * 規則：
 *   - 所有有效欄位正規化後完全一致 → 安全去重（identical）
 *   - aliases 取聯集，保留首次出現順序
 *   - category／subcategory／note 有多種非空值 → 記錄全部變體並提報，不丟棄
 *
 * @returns {{ merged, identical: boolean, conflicts: {field: string, values: string[]}[] }}
 */
export function mergeDuplicateRows(fields) {
  const norm = (s) => String(s ?? '').trim().replace(/\s+/g, ' ')
  const catPath = (f) => (norm(f.subcategory) ? `${norm(f.category)}/${norm(f.subcategory)}` : norm(f.category))

  const sig = (f) => JSON.stringify([
    norm(f.zh), catPath(f), norm(f.note),
    f.aliasEn.values.join(' '), f.aliasZh.values.join(' '),
  ])
  const identical = new Set(fields.map(sig)).size === 1

  const uniqOrdered = (vals) => {
    const seen = new Set()
    const out = []
    for (const v of vals) {
      if (!v || seen.has(v)) continue
      seen.add(v); out.push(v)
    }
    return out
  }

  // category 是**可多值的分類標籤**，不是只能保留一個的權威譯名。
  // 同一術語同時用於不同內容領域是合法的（如 Clarity ∈ 規則/術語 ∧ 角色/英雄資源）。
  const categories = uniqOrdered(fields.map(catPath))
  const notes = uniqOrdered(fields.map((f) => norm(f.note)))
  const aliasEnValues = uniqOrdered(fields.flatMap((f) => f.aliasEn.values))
  const aliasZhValues = uniqOrdered(fields.flatMap((f) => f.aliasZh.values))

  // 真正互斥、無法同時成立者才提報。
  // 目前唯一一項：某列歸為狀態實體（subcategory === '狀態'）而另一列不是 ——
  // 該詞的中文名不可能同時「由實體負責」又「由 glossary 自己保存」。
  const conflicts = []
  const isEntity = fields.map((f) => norm(f.subcategory) === '狀態')
  if (new Set(isEntity).size > 1) {
    conflicts.push({
      field: 'entityClassification',
      values: fields.map((f, i) => `${catPath(f)}→${isEntity[i] ? 'entity' : 'glossary'}`),
    })
  }

  const merged = {
    ...fields[0],
    aliasEn: { values: aliasEnValues, addedBySplit: fields.reduce((n, f) => n + f.aliasEn.addedBySplit, 0) },
    aliasZh: { values: aliasZhValues, addedBySplit: fields.reduce((n, f) => n + f.aliasZh.addedBySplit, 0) },
  }
  return { merged, identical, conflicts, categories, notes }
}

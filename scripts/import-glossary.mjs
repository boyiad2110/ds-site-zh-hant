/**
 * 一次性匯入：sources/glossary_old.csv → data/glossary.json
 *
 * 規則（見 docs/translation-guide.md §附錄 A、§9.1–9.5）：
 *   - 全部匯入為 status: 'needs-review'；不因舊 CSV 有譯名就自動 approved
 *   - approved 只能來自 data/decisions.json 的明確裁決
 *   - 同英文不同譯名一律全部保留並提報，**不得靜默丟棄**
 *   - 同英文同譯名但 metadata 不同 → 合併 aliases、保留全部變體並提報，**不得先到先贏**
 *   - split／merge 裁決必須**完整覆蓋**該英文的全部 provisional id
 *   - 來源識別（sourceZhHant）與正式譯名（zhHant）分離，擁有者可修改譯名
 *   - 輸出必須決定性：不寫入執行日期，改用來源指紋
 *
 * ledger 寫入候選檔，通過 validate-terms.mjs --commit 後才提升為正式。
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import {
  parseCsv, splitAliases, detectAnomalies, termId, conditionId, mergeDuplicateRows,
} from './lib/glossary-lib.mjs'
import { collectStableIds, computeCandidate } from './lib/ledger.mjs'
import { p, sha256File } from './lib/root.mjs'
import { readdirSync } from 'node:fs'

const SRC = p('sources/glossary_old.csv')
const DECISIONS = p('data/decisions.json')
const OUT = p('data/glossary.json')
const PENDING = p('data/glossary-pending.json')
const LEDGER = p('data/id-ledger.json')
const LEDGER_CANDIDATE = p('data/id-ledger.candidate.json')

const raw = readFileSync(SRC, 'utf8').replace(/^﻿/, '')
const [header, ...rows] = parseCsv(raw)
const col = Object.fromEntries(header.map((h, i) => [h.trim(), i]))
const csvRowCount = rows.filter((r) => (r[col['en']] ?? '').trim()).length

const decisions = JSON.parse(readFileSync(DECISIONS, 'utf8'))

// glossary 裁決**不得以英文互相覆蓋** —— 同一英文的多個 sense 若擠進以 en 為 key 的 Map，
// 後者會靜默取代前者。改為 en → 裁決陣列，取用時若無法唯一對應則失敗。
const decidedByEn = new Map()
for (const d of decisions.glossary) {
  const k = d.en.trim().toLowerCase()
  if (!decidedByEn.has(k)) decidedByEn.set(k, [])
  decidedByEn.get(k).push(d)
}
const vocabularyOwned = new Set(decisions.vocabulary.map((d) => d.en.trim().toLowerCase()))

const multiDecisions = new Map(
  (decisions.multiTranslations ?? []).map((d) => [d.en.trim().toLowerCase(), d])
)

const fatal = []
const bail = (code, msg) => fatal.push(`[${code}] ${msg}`)

// notTerms：擁有者裁定某個 CSV 列**根本不是術語**（例如當初的註記列），應完全不生成條目。
// glossary_old.csv 匯入後凍結、不得手改，因此刪除只能走這條有紀錄的路徑。
// 欄位不齊即中止 —— 這個機制能讓資料靜默消失，不接受無理由的使用。
// 若該 en 先前已產生 stable id，移除後仍需 tombstone，由 validate 的 stable-id-missing 把關。
const notTerms = new Set()
for (const x of decisions.notTerms ?? []) {
  if (!x.en || !x.reason || !x.decidedAt || !x.decidedBy) {
    bail('not-term-invalid', `notTerms 條目缺 en／reason／decidedAt／decidedBy：${JSON.stringify(x)}`)
    continue
  }
  notTerms.add(x.en.trim().toLowerCase())
}

// ── 依英文分組
const groups = new Map()
let skippedVocab = 0, skippedNotTerm = 0
for (const r of rows) {
  const en = (r[col['en']] ?? '').trim()
  if (!en) continue
  const key = en.toLowerCase()
  if (notTerms.has(key)) { skippedNotTerm++; continue }
  if (vocabularyOwned.has(key)) { skippedVocab++; continue }
  if (!groups.has(key)) groups.set(key, [])
  groups.get(key).push(r)
}

// 同一個 en 不得既被裁定「不是術語」又被裁決為術語 —— 那是互相矛盾的兩筆裁決
for (const d of decisions.glossary) {
  if (notTerms.has(d.en.trim().toLowerCase())) {
    bail('not-term-conflict', `${d.en} 同時出現在 notTerms 與 glossary 裁決中`)
  }
}

const terms = []
const unresolvedMulti = []
const metadataConflicts = []
const anomalies = []
let conditions = 0, identicalDupes = 0, metadataMerged = 0, aliasAdded = 0, multiCategory = 0
let splitResolved = 0, mergeResolved = 0

const readRow = (r) => ({
  en: (r[col['en']] ?? '').trim(),
  zh: (r[col['zh-tw']] ?? '').trim(),
  category: (r[col['category']] ?? '').trim(),
  subcategory: (r[col['subcategory']] ?? '').trim(),
  note: (r[col['note']] ?? '').trim(),
  aliasEn: splitAliases(r[col['alt-en']]),
  aliasZh: splitAliases(r[col['alt-zh']]),
})

function baseEntry(f, id, idStatus, extra = {}) {
  const catPath = f.subcategory ? `${f.category}/${f.subcategory}` : f.category
  const e = {
    id, idStatus, en: f.en,
    // category 為可多值標籤（見 mergeDuplicateRows）
    categories: extra.categories ?? [catPath],
    status: 'needs-review',
    aliasesEn: f.aliasEn.values, aliasesZhHant: f.aliasZh.values,
  }
  if (f.subcategory === '狀態') { e.entityRef = conditionId(f.en); conditions++ }
  else e.zhHant = f.zh
  const notes = extra.notes ?? (f.note ? [f.note] : [])
  if (notes.length) e.sourceNotes = notes
  return e
}

/** 取用某英文的 glossary 裁決；多筆而無法唯一對應時失敗，不得靜默採用最後一筆 */
function resolveGlossaryDecision(key, en) {
  const list = decidedByEn.get(key) ?? []
  if (list.length === 0) return null
  if (list.length > 1) {
    bail('ambiguous-glossary-decision',
      `${en} 有 ${list.length} 筆 glossary 裁決（sense：${list.map((d) => d.sense ?? '（無）').join('、')}），` +
      '來源列無 sense 資訊，無法唯一對應。多義詞請改用 multiTranslations 裁決。')
    return null
  }
  return list[0]
}

function applyApproval(entry, d) {
  entry.status = 'approved'
  entry.idStatus = 'stable'
  if (d.zhHant) entry.zhHant = d.zhHant      // 正式譯名，可與舊譯不同
  entry.decidedAt = d.decidedAt
  entry.decidedBy = d.decidedBy
  if (d.note) entry.note = d.note
  if (d.sense) entry.sense = d.sense
  if (d.aliasesZhHant?.length) {
    entry.aliasesZhHant = [...new Set([...entry.aliasesZhHant, ...d.aliasesZhHant])]
  }
}

/**
 * 驗證 split／merge 是否**完整且唯一**覆蓋該英文的全部 provisional id。
 * @param claimed 裁決宣告的 provisionalId 清單
 */
function checkCoverage(en, provisionalIds, claimed, kind) {
  const before = fatal.length
  const own = new Set(provisionalIds)
  const seen = new Map()
  for (const pid of claimed) {
    if (!own.has(pid)) {
      // 屬於別的英文？形如 term.<other>.sN
      const m = /^term\.(.+)\.s\d+$/.exec(pid)
      const mine = /^term\.(.+)\.s\d+$/.exec(provisionalIds[0])
      if (m && mine && m[1] !== mine[1]) {
        bail('cross-term-provisional-id', `${en} 的 ${kind} 混入其他英文的 provisional id：${pid}`)
      } else {
        bail('unknown-provisional-id', `${en} 的 ${kind} 指向不存在的 provisional id：${pid}`)
      }
      continue
    }
    seen.set(pid, (seen.get(pid) ?? 0) + 1)
  }
  for (const [pid, n] of seen) {
    if (n > 1) bail('duplicate-provisional-mapping', `${en} 的 ${kind} 重複使用 provisional id：${pid}（${n} 次）`)
  }
  const missing = provisionalIds.filter((pid) => !seen.has(pid))
  if (missing.length) {
    bail('incomplete-multi-resolution',
      `${en} 的 ${kind} 未涵蓋全部來源，遺漏：${missing.join('、')}（共 ${provisionalIds.length} 個 provisional id）`)
  }
  // 任何一項覆蓋問題都必須阻止後續處理 —— 否則未知 id 會讓 idxOf 回傳 -1 而崩潰
  return fatal.length === before
}

const allStableIds = new Map()
const claimStableId = (id, en) => {
  if (allStableIds.has(id)) {
    bail('duplicate-stable-id', `stable id ${id} 被 ${allStableIds.get(id)} 與 ${en} 同時宣告`)
    return false
  }
  allStableIds.set(id, en)
  return true
}

for (const [key, groupRows] of groups) {
  const fields = groupRows.map(readRow)
  const zhSet = new Set(fields.map((f) => f.zh).filter(Boolean))
  const isMulti = zhSet.size > 1

  // ── 同英文同譯名：合併 metadata，不先到先贏
  if (!isMulti) {
    const { merged, identical, conflicts, categories, notes } = mergeDuplicateRows(fields)
    if (fields.length > 1) {
      if (identical) identicalDupes += fields.length - 1
      else metadataMerged += fields.length - 1
    }
    if (categories.length > 1) multiCategory++
    aliasAdded += merged.aliasEn.addedBySplit + merged.aliasZh.addedBySplit

    const d = resolveGlossaryDecision(key, merged.en)
    const entry = baseEntry(merged, d?.sense ? termId(merged.en, d.sense) : termId(merged.en),
      'stable', { categories, notes })
    claimStableId(entry.id, merged.en)

    // 只有真正互斥的 metadata 才提報（多重 category 是合法的，不再視為衝突）
    if (conflicts.length) {
      entry.metadataConflicts = Object.fromEntries(conflicts.map((c) => [c.field, c.values]))
      metadataConflicts.push({
        kind: 'glossary', en: merged.en, issue: 'metadata-conflict', conflicts,
        note: '同英文同譯名的多列在互斥欄位上不一致，無法同時成立，需擁有者裁定。',
      })
    }

    anomalies.push(...detectAnomalies({
      en: merged.en, zhHant: entry.zhHant,
      aliasesEn: entry.aliasesEn, aliasesZhHant: entry.aliasesZhHant,
    }))
    if (d && d.status === 'approved') applyApproval(entry, d)
    terms.push(entry)
    continue
  }

  // ── 同英文不同譯名
  const provisionalIds = fields.map((_, i) => `${termId(fields[0].en)}.s${i + 1}`)
  fields.forEach((f) => { aliasAdded += f.aliasEn.addedBySplit + f.aliasZh.addedBySplit })
  fields.forEach((f) => anomalies.push(...detectAnomalies({
    en: f.en, zhHant: f.zh, aliasesEn: f.aliasEn.values, aliasesZhHant: f.aliasZh.values,
  })))

  const decision = multiDecisions.get(key)
  if (!decision) {
    fields.forEach((f, i) => {
      const e = baseEntry(f, provisionalIds[i], 'provisional')
      e.provisionalSense = e.categories[0]
      terms.push(e)
    })
    unresolvedMulti.push({
      kind: 'glossary', en: fields[0].en, issue: 'multiple-translations',
      candidates: fields.map((f, i) => ({
        provisionalId: provisionalIds[i], sourceZhHant: f.zh,
        category: f.subcategory ? `${f.category}/${f.subcategory}` : f.category,
      })),
      note: '舊 CSV 同一英文對到不同中文。於 decisions.multiTranslations 以 resolution "split" 或 "merge" 裁決，' +
        '且必須完整涵蓋全部 provisionalId。裁決後本項自動離開 pending。',
    })
    continue
  }

  const idxOf = (pid) => provisionalIds.indexOf(pid)

  if (decision.resolution === 'split') {
    const entries = decision.entries ?? []
    const complete = checkCoverage(fields[0].en, provisionalIds, entries.map((e) => e.provisionalId), 'split')
    if (!complete) continue
    for (const spec of entries) {
      const i = idxOf(spec.provisionalId)
      // 來源識別漂移：只比對 sourceZhHant，**不要求正式譯名與舊譯相同**
      if (!spec.sourceZhHant) {
        bail('provisional-mapping-drift', `${spec.provisionalId} 缺 sourceZhHant，無法確認仍對應正確來源列`)
        continue
      }
      if (spec.sourceZhHant !== fields[i].zh) {
        bail('provisional-mapping-drift',
          `${spec.provisionalId} 的來源譯名已變動：裁決記錄「${spec.sourceZhHant}」→ 來源「${fields[i].zh}」`)
        continue
      }
      // 只有明確 status: approved 才能產生正式 stable 條目。程式不得自行升級。
      if (spec.status !== 'approved') {
        bail('multi-resolution-not-approved',
          `${spec.provisionalId} 的 split 裁決 status 為「${spec.status ?? '（缺）'}」，須明確為 approved 才能套用`)
        continue
      }
      const id = spec.stableId ?? termId(fields[i].en, spec.sense)
      if (!claimStableId(id, fields[i].en)) continue
      const e = baseEntry(fields[i], id, 'stable')
      applyApproval(e, spec)
      terms.push(e)
    }
    splitResolved++
  } else if (decision.resolution === 'merge') {
    const sourceIds = decision.sourceIds ?? []
    const complete = checkCoverage(fields[0].en, provisionalIds, sourceIds, 'merge')
    if (!complete) continue
    if (decision.status !== 'approved') {
      bail('multi-resolution-not-approved',
        `${fields[0].en} 的 merge 裁決 status 為「${decision.status ?? '（缺）'}」，須明確為 approved 才能套用`)
      continue
    }
    const idxs = sourceIds.map(idxOf)
    const primary = fields[idxs[0]]
    const id = decision.stableId ?? termId(primary.en)
    if (!claimStableId(id, primary.en)) continue
    const e = baseEntry(primary, id, 'stable')
    // 未採用的舊譯全部保留為 alias（除非裁決明確捨棄並於 note 記錄理由）
    const discarded = new Set(decision.discardedZhHant ?? [])
    const others = idxs.slice(1).map((i) => fields[i].zh).filter((z) => z && !discarded.has(z))
    if (discarded.size && !decision.note) {
      bail('incomplete-multi-resolution', `${primary.en} 的 merge 捨棄了舊譯卻未於 note 記錄理由`)
      continue
    }
    e.aliasesZhHant = [...new Set([...e.aliasesZhHant, ...others, ...(decision.aliasesZhHant ?? [])])]
    applyApproval(e, decision)
    e.aliasesZhHant = e.aliasesZhHant.filter((a) => a !== e.zhHant)
    terms.push(e)
    mergeResolved++
  } else {
    bail('unknown-resolution', `${fields[0].en}：resolution 必須是 split 或 merge`)
  }
}

// 舊 CSV 沒有、但已裁決的 glossary 項目
const seenDecisionKeys = new Set()
for (const d of decisions.glossary) {
  const dk = `${d.en.trim().toLowerCase()}|${d.sense ?? ''}`
  if (seenDecisionKeys.has(dk)) {
    bail('duplicate-glossary-decision', `glossary 裁決有重複的 (en, sense)：${d.en} / ${d.sense ?? '（無）'}`)
    continue
  }
  seenDecisionKeys.add(dk)
  if (groups.has(d.en.trim().toLowerCase())) continue
  if (d.status !== 'approved') continue
  const id = termId(d.en, d.sense)
  claimStableId(id, d.en)
  terms.push({
    id, idStatus: 'stable', en: d.en, zhHant: d.zhHant,
    ...(d.sense ? { sense: d.sense } : {}),
    // schema 統一：一律使用複數 categories，不再輸出單數 category
    categories: d.category ? [d.category] : [], status: 'approved',
    aliasesEn: [], aliasesZhHant: d.aliasesZhHant ?? [],
    decidedAt: d.decidedAt, decidedBy: d.decidedBy, note: d.note,
  })
}

if (fatal.length) {
  console.error('── 匯入中止 ──')
  for (const f of fatal) console.error(`  ❌ ${f}`)
  process.exit(1)
}

terms.sort((a, b) => a.en.localeCompare(b.en) || a.id.localeCompare(b.id))

writeFileSync(OUT, JSON.stringify({
  $comment: '由 scripts/import-glossary.mjs 從 sources/glossary_old.csv 生成，不可手改。' +
    'glossary_old.csv 匯入後凍結。狀態詞條以 entityRef 指向實體，名稱由實體負責——' +
    '此舉不保證規則散文不漂移，仍需一致性檢查（指南 §9.3）。',
  sourceHash: sha256File(SRC),
  decisionsHash: sha256File(DECISIONS),
  terms,
}, null, 2) + '\n', 'utf8')

// ── pending：**從零重建**，來源只有 decisions.pending 與自動偵測結果。
// 不讀取舊 glossary-pending.json —— 否則生成檔會變成自己的輸入，無法乾淨重建。
// pending 是否已解決**不能只比英文** —— 否則批准另一種 Order sense 會誤清
// Order / censor-subclass。glossary 用 kind+en+sense，vocabulary 用 kind+vocabulary+value。
const pendingKey = (x) => x.kind === 'vocabulary'
  ? `vocabulary|${x.vocabulary ?? ''}|${x.value ?? ''}`
  : `glossary|${(x.en ?? '').trim().toLowerCase()}|${x.sense ?? ''}`
const approvedKeys = new Set([
  ...decisions.glossary.filter((d) => d.status === 'approved')
    .map((d) => pendingKey({ kind: 'glossary', en: d.en, sense: d.sense })),
  ...decisions.vocabulary.filter((d) => d.status === 'approved')
    .map((d) => pendingKey({ kind: 'vocabulary', vocabulary: d.vocabulary, value: d.value })),
])
const manualPending = (decisions.pending ?? []).filter((m) => !approvedKeys.has(pendingKey(m)))
writeFileSync(PENDING, JSON.stringify({
  $comment: '由 scripts/import-glossary.mjs 生成，不可手改。手動項目請寫入 data/decisions.json 的 pending 陣列。',
  sourceHash: sha256File(SRC),
  decisionsHash: sha256File(DECISIONS),
  items: [...manualPending, ...unresolvedMulti, ...metadataConflicts],
}, null, 2) + '\n', 'utf8')
const pendingCount = manualPending.length + unresolvedMulti.length + metadataConflicts.length

// ── 候選 ledger：舊 ledger −（合法 tombstone）＋ 目前 stable id（glossary ∪ vocabulary）
let ledger = { $comment: 'stable id 的追加式帳本，用於偵測 id 被改指或消失。由 validate-terms.mjs --commit 提升，不可手改。', ids: {} }
if (existsSync(LEDGER)) ledger = JSON.parse(readFileSync(LEDGER, 'utf8'))

const vocabDir = p('data/vocabulary')
const vocabularies = existsSync(vocabDir)
  ? readdirSync(vocabDir).filter((f) => f.endsWith('.json'))
      .map((f) => JSON.parse(readFileSync(p(`data/vocabulary/${f}`), 'utf8')))
  : []

// tombstone 須欄位完整才算合法；不合法者不扣除，交由 validate 報 tombstone-invalid
const validTombstones = new Set(
  (decisions.tombstones ?? []).filter((x) => x.id && x.reason && x.decidedAt && x.decidedBy).map((x) => x.id)
)
const stableIds = collectStableIds(terms, vocabularies)
writeFileSync(LEDGER_CANDIDATE, JSON.stringify({
  ...ledger,
  ids: computeCandidate(ledger.ids, validTombstones, stableIds),
}, null, 2) + '\n', 'utf8')

// ── 匯入報告
const by = (k) => terms.filter((t) => t.status === k).length
const idBy = (k) => terms.filter((t) => t.idStatus === k).length
const anomalyBy = anomalies.reduce((a, x) => ((a[x.issue] = (a[x.issue] ?? 0) + 1), a), {})

console.log('── 匯入報告 ──────────────────────────────')
console.log(`原始 CSV 有效列數        ${csvRowCount}`)
console.log(`生成 glossary 條目       ${terms.length}`)
console.log(`  完全重複（安全去重）   ${identicalDupes}`)
console.log(`  多重 category（合法）  ${multiCategory}`)
console.log(`  同譯名但 metadata 不同 ${metadataMerged}（已合併，變體保留）`)
console.log(`  同英文不同譯名         已裁決 split ${splitResolved} / merge ${mergeResolved}，未裁決 ${unresolvedMulti.length}`)
console.log(`  移交 vocabulary        ${skippedVocab}`)
console.log(`  裁定非術語（notTerms） ${skippedNotTerm}`)
console.log(`  狀態（entityRef）      ${conditions}`)
console.log(`狀態  approved ${by('approved')} / needs-review ${by('needs-review')} / deprecated ${by('deprecated')}`)
console.log(`id    stable ${idBy('stable')} / provisional ${idBy('provisional')}`)
console.log(`別名拆分（實際新增元素） ${aliasAdded}`)
console.log(`語言／別名異常警告       ${anomalies.length}`)
for (const [k, v] of Object.entries(anomalyBy)) console.log(`    ⚠️ ${k}: ${v}`)
for (const a of anomalies) console.log(`       ${a.en} → ${JSON.stringify(a.value)}（${a.issue}）`)
console.log(`pending 項目             ${pendingCount}（手動 ${manualPending.length}、多譯名 ${unresolvedMulti.length}、互斥 metadata ${metadataConflicts.length}）`)
for (const q of unresolvedMulti) {
  console.log(`    ⚠️ ${q.en}: ${q.candidates.map((c) => `${c.sourceZhHant}（${c.category}）`).join(' | ')}`)
}
for (const q of metadataConflicts) {
  console.log(`    ⚠️ ${q.en} 互斥 metadata: ${q.conflicts.map((c) => `${c.field}=[${c.values.join('|')}]`).join(' ')}`)
}
console.log(`ledger 候選 stable id    ${Object.keys(JSON.parse(readFileSync(LEDGER_CANDIDATE, 'utf8')).ids).length}`)
console.log('──────────────────────────────────────────')
console.log('警告不阻斷匯入。硬性失敗見 validate-terms.mjs（ledger 候選待 --commit 提升）')

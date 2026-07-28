/**
 * 詞彙資料的硬性驗證。失敗即 exit 1（供 CI 使用）。
 *
 * 用法：
 *   node scripts/validate-terms.mjs            唯讀驗證（不要求 candidate ledger）
 *   node scripts/validate-terms.mjs --commit   驗證通過後原子提升 candidate ledger
 *
 * 硬性失敗代號見 docs/translation-guide.md §9.4。
 * 語言欄位可疑、舊資料異常 → 只警告，不失敗。
 */
import { readFileSync, existsSync, readdirSync, writeFileSync, renameSync, rmSync } from 'node:fs'
import { parseCsv } from './lib/glossary-lib.mjs'
import { collectRefs, resolveRefs, PENDING_ENTITY_ALLOWLIST } from './lib/refs.mjs'
import { collectStableIds, computeCandidate } from './lib/ledger.mjs'
import { p, sha256File } from './lib/root.mjs'

const read = (rel) => JSON.parse(readFileSync(p(rel), 'utf8'))
const commit = process.argv.includes('--commit')

const glossary = read('data/glossary.json')
const decisions = read('data/decisions.json')
const pending = read('data/glossary-pending.json')
const ledger = existsSync(p('data/id-ledger.json')) ? read('data/id-ledger.json') : { ids: {} }
const candidatePath = p('data/id-ledger.candidate.json')
const candidate = existsSync(candidatePath) ? read('data/id-ledger.candidate.json') : null

const vocabDir = p('data/vocabulary')
const vocabFiles = existsSync(vocabDir) ? readdirSync(vocabDir).filter((f) => f.endsWith('.json')) : []
const vocabularies = vocabFiles.map((f) => ({ file: f, ...read(`data/vocabulary/${f}`) }))
const vocabValues = vocabularies.flatMap((v) => v.values)

const errors = []
const warnings = []
const fail = (code, msg) => errors.push({ code, msg })

// ══ 生成物新鮮度：hash 必須真的比對，不能只是寫進檔案 ══
const csvHash = sha256File(p('sources/glossary_old.csv'))
const decHash = sha256File(p('data/decisions.json'))
if (glossary.sourceHash !== csvHash) {
  fail('stale-source-hash', `glossary.json.sourceHash=${glossary.sourceHash} ≠ 目前 CSV hash=${csvHash}，請重跑 import-glossary.mjs`)
}
if (glossary.decisionsHash !== decHash) {
  fail('stale-decisions-hash', `glossary.json.decisionsHash=${glossary.decisionsHash} ≠ 目前 decisions hash=${decHash}，請重跑 import-glossary.mjs`)
}
if (pending.sourceHash !== csvHash) {
  fail('stale-source-hash', `glossary-pending.json.sourceHash=${pending.sourceHash} ≠ 目前 CSV hash=${csvHash}，請重跑 import-glossary.mjs`)
}
if (pending.decisionsHash !== decHash) {
  fail('stale-decisions-hash', `glossary-pending.json.decisionsHash=${pending.decisionsHash} ≠ 目前 decisions hash=${decHash}，請重跑 import-glossary.mjs`)
}
for (const v of vocabularies) {
  if (v.decisionsHash !== decHash) {
    fail('stale-decisions-hash', `${v.file}.decisionsHash=${v.decisionsHash} ≠ 目前 decisions hash=${decHash}，請重跑 build-vocabulary.mjs`)
  }
}
// vocabulary 檔案集合須與 decisions 的群組完全一致
const expectedVocab = new Set(decisions.vocabulary.map((d) => `${d.vocabulary}.json`))
for (const f of vocabFiles) if (!expectedVocab.has(f)) fail('unexpected-generated-file', `data/vocabulary/${f} 不對應任何 decisions 群組`)
for (const f of expectedVocab) if (!vocabFiles.includes(f)) fail('missing-generated-file', `缺少 data/vocabulary/${f}`)

// ══ 最小 schema 驗證：categories 統一為字串陣列，不得再出現舊欄位 category ══
for (const t of glossary.terms) {
  if (!Array.isArray(t.categories)) {
    fail('schema-invalid', `glossary ${t.id}：categories 必須存在且為陣列`)
  } else if (t.categories.some((c) => typeof c !== 'string')) {
    fail('schema-invalid', `glossary ${t.id}：categories 必須是字串陣列`)
  }
  if ('category' in t) fail('schema-invalid', `glossary ${t.id}：不得再輸出舊欄位 category`)
}

// ══ duplicate-id ══
const known = new Map()
for (const t of glossary.terms) {
  if (known.has(t.id)) fail('duplicate-id', `glossary id 重複：${t.id}`)
  known.set(t.id, t)
}
for (const val of vocabValues) {
  if (known.has(val.id)) fail('duplicate-id', `id 跨表重複：${val.id}`)
  known.set(val.id, val)
}

// ══ id-reassigned ══
for (const t of glossary.terms) {
  if (t.idStatus !== 'stable') continue
  const rec = ledger.ids[t.id]
  if (!rec) continue
  const sig = `${t.en}|${t.sense ?? ''}`
  if (rec.signature !== sig) {
    fail('id-reassigned', `stable id ${t.id} 的詞義已變更：帳本「${rec.signature}」→ 現值「${sig}」`)
  }
}

// ══ stable-id-missing / tombstone ══
const tombstones = new Map((decisions.tombstones ?? []).map((t) => [t.id, t]))
const validTombstones = new Set(
  [...tombstones.values()].filter((x) => x.id && x.reason && x.decidedAt && x.decidedBy).map((x) => x.id)
)
for (const [id, rec] of Object.entries(ledger.ids)) {
  if (known.has(id)) continue
  const tomb = tombstones.get(id)
  if (!tomb) { fail('stable-id-missing', `stable id ${id}（${rec.signature}）已從正式資料消失，且無 tombstone 紀錄`); continue }
  if (!tomb.reason || !tomb.decidedAt || !tomb.decidedBy) {
    fail('tombstone-invalid', `${id} 的 tombstone 缺 reason／decidedAt／decidedBy`)
  }
}
for (const id of tombstones.keys()) {
  if (known.has(id)) fail('tombstone-invalid', `${id} 有 tombstone 卻仍存在於正式資料`)
}

// ══ 狀態欄位完整性 ══
for (const [where, items] of [['glossary', glossary.terms], ['vocabulary', vocabValues]]) {
  for (const x of items) {
    if (x.status === 'approved') {
      if (!x.zhHant && !x.entityRef) fail('approved-missing-info', `${where} ${x.id}：approved 但缺 zhHant`)
      if (!x.decidedAt) fail('approved-missing-info', `${where} ${x.id}：approved 但缺 decidedAt`)
      if (!x.decidedBy) fail('approved-missing-info', `${where} ${x.id}：approved 但缺 decidedBy`)
    }
    if (x.status === 'deprecated' && !x.note) fail('deprecated-missing-reason', `${x.id}：deprecated 但未說明理由`)
    if (x.status === 'needs-review' && (x.decidedAt || x.decidedBy)) fail('auto-promoted', `${x.id}：needs-review 卻帶有裁決欄位`)
  }
}

// ══ provisional-in-release ══
const provisional = new Set(glossary.terms.filter((t) => t.idStatus === 'provisional').map((t) => t.id))
const releasesDir = p('releases')
if (existsSync(releasesDir)) {
  for (const f of readdirSync(releasesDir).filter((f) => f.endsWith('.json'))) {
    for (const e of read(`releases/${f}`).entries ?? []) {
      if (provisional.has(e.id)) fail('provisional-in-release', `${f} 含 provisional id：${e.id}`)
    }
  }
} else warnings.push('尚無 releases/，provisional-in-release 檢查空過')

// ══ 引用解析（明確 allowlist，不用前綴放行）══
const { errors: refErrors, warnings: refWarnings } = resolveRefs(
  collectRefs([{ file: 'data/glossary.json', field: 'entityRef', items: glossary.terms }]),
  known, PENDING_ENTITY_ALLOWLIST
)
for (const e of refErrors) fail(e.code, e.message)
warnings.push(...refWarnings.slice(0, 2))
if (refWarnings.length > 2) warnings.push(`…另有 ${refWarnings.length - 2} 筆 allowlist 內的未建立實體`)

// ══ silent-drop ══
const raw = readFileSync(p('sources/glossary_old.csv'), 'utf8').replace(/^﻿/, '')
const [hdr, ...csvRows] = parseCsv(raw)
const c = Object.fromEntries(hdr.map((h, i) => [h.trim(), i]))
const vocabOwned = new Set(decisions.vocabulary.map((d) => d.en.trim().toLowerCase()))
// 經 notTerms 裁定「不是術語」的列本就不該生成條目，不算靜默丟棄（見 import-glossary）
const notTerms = new Set((decisions.notTerms ?? []).map((d) => (d.en ?? '').trim().toLowerCase()))
const resolvedMulti = new Set((decisions.multiTranslations ?? []).map((d) => d.en.trim().toLowerCase()))
const byEn = new Map()
for (const r of csvRows) {
  const en = (r[c['en']] ?? '').trim()
  if (!en || vocabOwned.has(en.toLowerCase()) || notTerms.has(en.toLowerCase())) continue
  const k = en.toLowerCase()
  if (!byEn.has(k)) byEn.set(k, new Set())
  const zh = (r[c['zh-tw']] ?? '').trim()
  if (zh) byEn.get(k).add(zh)
}
for (const [key, zhs] of [...byEn].filter(([, s]) => s.size > 1)) {
  const kept = glossary.terms.filter((t) => t.en.toLowerCase() === key)
  if (!resolvedMulti.has(key)) {
    if (kept.length < zhs.size) fail('silent-drop', `${key}：CSV 有 ${zhs.size} 種譯名，glossary 只保留 ${kept.length} 筆`)
    if (!pending.items.some((i) => i.issue === 'multiple-translations' && i.en.toLowerCase() === key)) {
      fail('silent-drop', `${key}：同英文不同譯名未提報 pending`)
    }
  } else {
    if (pending.items.some((i) => i.issue === 'multiple-translations' && i.en.toLowerCase() === key)) {
      fail('silent-drop', `${key}：已裁決卻仍留在 pending`)
    }
    if (kept.some((t) => t.idStatus === 'provisional')) fail('silent-drop', `${key}：已裁決卻仍有 provisional 條目`)
  }
}

// ══ dual-authority ══
const vocabEn = new Set(vocabValues.map((x) => x.en.trim().toLowerCase()))
for (const t of glossary.terms) {
  if (vocabEn.has(t.en.trim().toLowerCase()) && t.zhHant) {
    fail('dual-authority', `${t.en} 同時存在於 vocabulary 與 glossary 且皆有譯名`)
  }
}

// ══ candidate ledger 驗證（--commit 時必須存在且精確相符）══
if (commit) {
  if (!candidate) {
    fail('ledger-candidate-missing', '--commit 需要 data/id-ledger.candidate.json，請先執行 import-glossary.mjs')
  } else {
    const stableIds = collectStableIds(glossary.terms, vocabularies)
    const expected = computeCandidate(ledger.ids, validTombstones, stableIds)

    for (const [id, rec] of Object.entries(ledger.ids)) {
      if (validTombstones.has(id)) {
        if (candidate.ids[id]) fail('ledger-candidate-invalid', `candidate 仍含已 tombstone 的 id：${id}`)
        continue
      }
      const cand = candidate.ids[id]
      if (!cand) { fail('ledger-candidate-mismatch', `candidate 刪除了既有 stable id：${id}`); continue }
      if (cand.signature !== rec.signature) {
        fail('ledger-candidate-mismatch', `candidate 修改了既有記錄 ${id}：「${rec.signature}」→「${cand.signature}」`)
      }
    }
    for (const [id, cand] of Object.entries(candidate.ids)) {
      if (!expected[id]) {
        fail(known.has(id) ? 'ledger-candidate-invalid' : 'ledger-candidate-extra-id',
          `candidate 含不應存在的 id：${id}`)
        continue
      }
      const sig = stableIds.get(id) ?? ledger.ids[id]?.signature
      if (sig && cand.signature !== sig) {
        fail('ledger-candidate-invalid', `candidate 的 ${id} signature 與目前條目不符：「${cand.signature}」≠「${sig}」`)
      }
    }
    for (const id of Object.keys(expected)) {
      if (!candidate.ids[id]) fail('ledger-candidate-invalid', `candidate 缺少應有的 stable id：${id}`)
    }
  }
}

// ══ 輸出 ══
console.log('── 驗證結果 ──────────────────────────────')
for (const w of warnings) console.log(`  ⚠️  ${w}`)
if (errors.length) {
  for (const e of errors) console.log(`  ❌ [${e.code}] ${e.msg}`)
  console.log('──────────────────────────────────────────')
  console.log(`  ${errors.length} 項硬性失敗`)
  if (commit) console.log('  ledger 候選未提升（驗證未通過）')
  process.exit(1)
}
console.log(`  ✅ 通過（${glossary.terms.length} glossary 條目、${vocabValues.length} vocabulary 值）`)
if (commit) {
  // 原子提升：先寫暫存檔再 rename，避免中斷留下半完成檔案
  const tmp = p('data/id-ledger.json.tmp')
  writeFileSync(tmp, JSON.stringify(candidate, null, 2) + '\n', 'utf8')
  renameSync(tmp, p('data/id-ledger.json'))
  rmSync(candidatePath)
  console.log(`  ledger 已原子提升（${Object.keys(candidate.ids).length} 個 stable id）`)
}
console.log('──────────────────────────────────────────')
process.exit(0)

/**
 * 產生 releases/m0.json —— M0 的精確術語依賴清單。
 *
 * 規劃 §M0：「glossary 範圍不得用估算。開始寫 UI 前，先產出精確的術語依賴清單。」
 * 清單來源是 `data/canon/` 的全部條目，掃描邏輯與 report-m0-terms.mjs 共用
 * scripts/lib/m0-scan.mjs——兩邊各寫一份必然會漂移。
 *
 * 只收 `approved` 的詞。未裁決的詞出現即 **exit 1**，
 * 因為 `provisional`／`needs-review` 進 release manifest 是硬性失敗（見指南 §9.3）。
 *
 *   node scripts/build-m0-release.mjs           產生
 *   node scripts/build-m0-release.mjs --check   驗證已提交的檔案是否過期（CI 用）
 *
 * 失敗時輸出**穩定錯誤代號**供測試與 CI 斷言（只看 exit code 的話，
 * 任何無關的崩潰都會被當成「預期的失敗」）：
 *   [m0-release-missing]        releases/m0.json 不存在
 *   [m0-release-stale]          已提交的內容與重新產生的結果不符
 *   [unresolved-sense]          有歧義詞義未指定
 *   [term-not-releasable]       有詞不能進 manifest，逐筆再帶下列代號：
 *     term-not-approved           譯名未批准
 *     provisional-id              id 仍為 provisional
 *     entity-missing              entityRef 找不到中文實體
 *     entity-not-reviewed         實體未通過審核（status 非 reviewed 或缺審核者）
 *     no-chinese-name             既無 zhHant 也無 entityRef
 *     controlled-value-undefined  結構欄位用到詞彙表沒有的值
 */
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { p } from './lib/root.mjs'
import { scan, EXCLUSIONS, ENTITY_EXCLUSIONS, SENSE_ASSIGNMENTS } from './lib/m0-scan.mjs'

const { canon, controlled, proseKept, entityNames, unresolvedSenses } = scan()

// 歧義詞義未指定就中止。猜錯會讓依賴清單指向錯誤的 id，而且不會有任何錯誤訊息。
if (unresolvedSenses.length) {
  console.error('── 產生中止 [unresolved-sense]：有無法判斷詞義的命中 ──')
  for (const u of unresolvedSenses) {
    console.error(`  ❌ ${u.entityId} · ${u.field}　「${u.surface}」對應多個詞義：${u.candidates.join('／')}`)
    console.error(`     上下文：…${u.context}…`)
  }
  console.error('\n請在 scripts/lib/m0-scan.mjs 的 SENSE_ASSIGNMENTS 逐筆指定（附理由）。')
  process.exit(1)
}

// ── 收集依賴 ─────────────────────────────────────────────
/** @type {Map<string, object>} */
const entries = new Map()
const blocked = []

// status（譯名是否批准）與 idStatus（id 能否被引用）是兩個維度，見指南 §9.2。
// 兩者都要擋：只檢查 status 會讓「譯名已批准但 id 仍 provisional」的詞溜進來，
// 拖到 validate-terms 才失敗，錯誤訊息離成因也比較遠。
const take = (id, en, zhHant, status, idStatus, source, usedBy, entityRef, fields) => {
  if (status !== 'approved') { blocked.push({ code: 'term-not-approved', id, en, status, source, why: '譯名未批准' }); return }
  if (idStatus === 'provisional') { blocked.push({ code: 'provisional-id', id, en, status: idStatus, source, why: 'id 仍為 provisional，不得被引用' }); return }

  // 名稱權威在實體的詞條（9 個狀態），zhHant 是 undefined。
  // 解析到實體的中文名並保留 entityRef，否則清單會出現無從追溯的條目。
  let resolved = zhHant
  let via
  if (zhHant === undefined && entityRef) {
    const e = entityNames.get(entityRef)
    if (!e) {
      blocked.push({ code: 'entity-missing', id, en, status: '實體未建立', source, why: `entityRef ${entityRef} 找不到對應的中文實體` })
      return
    }
    // 只有中文名存在還不夠——必須是已審核且有審核者，否則等於放未批准的譯名進 manifest
    if (!e.usable) {
      blocked.push({ code: 'entity-not-reviewed', id, en, status: e.problems.join('；'), source, why: `entityRef ${entityRef} 尚未通過審核` })
      return
    }
    resolved = e.nameZhHant
    via = { entityRef, entityStatus: e.status, reviewedBy: e.reviewedBy }
  }
  if (resolved === undefined) {
    blocked.push({ code: 'no-chinese-name', id, en, status: '無 zhHant 也無 entityRef', source, why: '無從取得中文名' })
    return
  }

  if (!entries.has(id)) {
    entries.set(id, {
      id, en, zhHant: resolved, ...(via ? { nameFrom: via } : {}),
      source, usedBy: new Set(), viaFields: new Set(),
    })
  }
  for (const u of usedBy) entries.get(id).usedBy.add(u)
  for (const f of fields ?? []) entries.get(id).viaFields.add(f)
}

// 通道 A · 受控值
for (const [key, v] of controlled) {
  if (!v.entry) {
    blocked.push({ code: 'controlled-value-undefined', id: key, en: `${v.vocabName}:${v.value}`, status: '不在詞彙表', source: 'A', why: `結構欄位 ${[...v.fields].join('／')} 用到未定義的值` })
    continue
  }
  take(v.entry.id, v.entry.en, v.entry.zhHant, v.entry.status, v.entry.idStatus,
    v.vocabName.startsWith('vocab:') ? `vocabulary:${v.vocabName.slice(6)}` : 'glossary',
    v.from, v.entry.entityRef, v.fields)
}

// 通道 B · 散文命中（已扣除人工判定的假命中）
for (const x of proseKept) {
  take(x.term.id, x.term.en, x.term.zhHant, x.term.status, x.term.idStatus,
    x.term.source ?? 'glossary', x.hits.map((h) => h.id), x.term.entityRef, ['(散文)'])
}

if (blocked.length) {
  console.error('── 產生中止 [term-not-releasable]：有未裁決的詞 ──')
  for (const b of blocked) console.error(`  ❌ [${b.code ?? 'term-not-approved'}] ${b.en}　${b.why}（${b.status}）　來源：${b.source}`)
  console.error('\n未 approved 的詞不得進入 release manifest（指南 §9.3）。請先完成裁決。')
  process.exit(1)
}

// ── 內容指紋（取代 generatedAt，見指南 §9.2）─────────────
const fingerprint = createHash('sha256')
  .update(readFileSync(p('data/glossary.json')))
  .update(readFileSync(p('data/decisions.json')))
  .update(canon.map((c) => c.source?.normalizedHash ?? c.id).sort().join('\n'))
  .digest('hex').slice(0, 16)

const out = {
  $comment: '由 scripts/build-m0-release.mjs 從 data/canon/ 掃描產生，不可手改。'
    + ' 這是 M0 的精確術語依賴清單——網站發布 M0 內容時，這裡的每個詞都必須有已批准的譯名。',
  release: 'm0',
  sourceFingerprint: fingerprint,
  scannedCanonEntries: canon.length,
  $exclusionNote: '通道 B（散文文字掃描）必然有假命中。以下是人工判定為假命中、刻意不計入依賴的詞，'
    + '每筆都附理由——沒有理由的排除等於偷偷放行。',
  exclusions: EXCLUSIONS,
  entityExclusions: ENTITY_EXCLUSIONS,
  $senseNote: '同一英文對應多個詞義時，字面比對無從分辨。以下為逐筆人工指定；未指定的歧義命中會讓產生程序中止，不猜。',
  senseAssignments: SENSE_ASSIGNMENTS,
  entries: [...entries.values()]
    .map((e) => ({ ...e, usedBy: [...e.usedBy].sort(), viaFields: [...e.viaFields].sort() }))
    .sort((a, b) => a.id.localeCompare(b.id)),
}

const OUT_PATH = p('releases/m0.json')
const serialized = JSON.stringify(out, null, 2) + '\n'

// ── --check：新鮮度驗證 ──────────────────────────────────
// `sourceFingerprint` 只是寫進檔案的一個字串，**光有它證明不了任何事**——
// 它自己就是這次算出來的，跟已提交的內容對不對得上無關。
// 真正的驗證是：重新產生一份預期內容，與已提交的檔案**逐字比對**。
// 這樣狀態中文實體改了、掃描規則改了、正典改了，都會讓檢查失敗。
if (process.argv.includes('--check')) {
  if (!existsSync(OUT_PATH)) {
    console.error('❌ [m0-release-missing] releases/m0.json 不存在，請先執行 node scripts/build-m0-release.mjs')
    process.exit(1)
  }
  const committed = readFileSync(OUT_PATH, 'utf8')
  if (committed === serialized) {
    console.log(`✅ releases/m0.json 與目前資料一致（${out.entries.length} 個術語，指紋 ${fingerprint}）`)
    process.exit(0)
  }
  console.error('❌ [m0-release-stale] releases/m0.json 已過期 —— 與目前資料重新產生的結果不符')
  const a = JSON.parse(committed)
  const ids = (x) => new Set((x.entries ?? []).map((e) => e.id))
  const [oldIds, newIds] = [ids(a), ids(out)]
  const added = [...newIds].filter((x) => !oldIds.has(x))
  const removed = [...oldIds].filter((x) => !newIds.has(x))
  if (added.length) console.error(`   新增 ${added.length}：${added.slice(0, 10).join('、')}${added.length > 10 ? '…' : ''}`)
  if (removed.length) console.error(`   移除 ${removed.length}：${removed.slice(0, 10).join('、')}${removed.length > 10 ? '…' : ''}`)
  if (!added.length && !removed.length) {
    // id 集合相同 → 差在內容（usedBy／viaFields／中文名／排除理由…）
    const changed = out.entries.filter((e) => {
      const o = (a.entries ?? []).find((x) => x.id === e.id)
      return o && JSON.stringify(o) !== JSON.stringify(e)
    }).map((e) => e.id)
    console.error(changed.length
      ? `   條目內容變更 ${changed.length}：${changed.slice(0, 10).join('、')}${changed.length > 10 ? '…' : ''}`
      : '   條目相同，差異在 manifest 的其他欄位（排除清單／詞義指定／指紋等）')
  }
  console.error('\n請執行 node scripts/build-m0-release.mjs 重新產生後一併提交。')
  process.exit(1)
}

if (!existsSync(p('releases'))) mkdirSync(p('releases'), { recursive: true })
writeFileSync(OUT_PATH, serialized, 'utf8')

const bySource = out.entries.reduce((a, e) => (a[e.source] = (a[e.source] ?? 0) + 1, a), {})
console.log(`正典條目      ${canon.length}`)
console.log(`依賴術語      ${out.entries.length}（全部 approved）`)
for (const [s, n] of Object.entries(bySource).sort()) console.log(`  ${s.padEnd(28)} ${n}`)
console.log(`排除的假命中  ${EXCLUSIONS.length}`)
console.log(`來源指紋      ${fingerprint}`)
console.log(`→ releases/m0.json`)

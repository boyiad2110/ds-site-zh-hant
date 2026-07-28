/**
 * 生成器與驗證器的整合測試。
 *
 * 全部在 os.tmpdir() 的 fixture 上執行，**不觸碰正式 repository 資料**。
 * 驗證 exit code 與錯誤代號，每個案例自行清理。
 */
import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, existsSync, readFileSync, readdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const scriptsDir = dirname(fileURLToPath(import.meta.url))

const CSV_HEADER = 'category,subcategory,en,zh-tw,alt-en,alt-zh,note'
const D = { status: 'approved', decidedAt: '2026-07-28', decidedBy: 'owner' }
/** Fire 的完整 split 裁決（涵蓋全部 provisional id），多數測試以此為基準再破壞 */
const FIRE_SPLIT_OK = [
  { provisionalId: 'term.fire.s1', sourceZhHant: '火焰', stableId: 'term.fire.damage-type', sense: 'damage-type', zhHant: '火焰', ...D },
  { provisionalId: 'term.fire.s2', sourceZhHant: '烈火', stableId: 'term.fire.elementalist-mastery', sense: 'elementalist-mastery', zhHant: '烈火', ...D },
]
const BASE_ROWS = [
  '規則,術語,Alpha,甲,,,',
  '規則,狀態,Slowed,緩速,,,',
  '規則,傷害類型,Fire,火焰,,,',
  '角色,元素精通,Fire,烈火,,,',
]

function makeFixture(opts = {}) {
  const root = mkdtempSync(resolve(tmpdir(), 'ds-terms-'))
  mkdirSync(resolve(root, 'sources'), { recursive: true })
  mkdirSync(resolve(root, 'data'), { recursive: true })
  const rows = opts.rows ?? BASE_ROWS
  writeFileSync(resolve(root, 'sources/glossary_old.csv'), [CSV_HEADER, ...rows].join('\n') + '\n', 'utf8')
  writeFileSync(resolve(root, 'data/decisions.json'), JSON.stringify({
    vocabulary: opts.vocabulary ?? [],
    glossary: opts.glossary ?? [],
    multiTranslations: opts.multiTranslations ?? [],
    pending: opts.pending ?? [],
    tombstones: opts.tombstones ?? [],
  }, null, 2), 'utf8')
  writeFileSync(resolve(root, 'data/glossary-pending.json'), JSON.stringify({ items: [] }, null, 2), 'utf8')
  return root
}

const run = (root, script, ...args) =>
  spawnSync(process.execPath, [resolve(scriptsDir, script), ...args], {
    env: { ...process.env, DS_DATA_ROOT: root },
    encoding: 'utf8',
  })

/** 跑完整流程並 commit ledger */
function pipeline(root, { commit = true } = {}) {
  run(root, 'build-vocabulary.mjs')
  const imp = run(root, 'import-glossary.mjs')
  const val = run(root, 'validate-terms.mjs', ...(commit ? ['--commit'] : []))
  return { imp, val, out: val.stdout + val.stderr }
}

const readJson = (root, rel) => JSON.parse(readFileSync(resolve(root, rel), 'utf8'))
const cleanup = (root) => rmSync(root, { recursive: true, force: true })
const hasCode = (out, code) => out.includes(`[${code}]`)

describe('整合：生成器與驗證器', () => {

  test('1. duplicate-id：id 重複必失敗', () => {
    const root = makeFixture()
    try {
      pipeline(root)
      const g = readJson(root, 'data/glossary.json')
      g.terms.push({ ...g.terms[0] })
      writeFileSync(resolve(root, 'data/glossary.json'), JSON.stringify(g), 'utf8')
      const v = run(root, 'validate-terms.mjs')
      assert.equal(v.status, 1)
      assert.ok(hasCode(v.stdout, 'duplicate-id'), v.stdout)
    } finally { cleanup(root) }
  })

  test('2. id-reassigned：stable id 詞義改變必失敗', () => {
    const root = makeFixture()
    try {
      pipeline(root)
      const l = readJson(root, 'data/id-ledger.json')
      l.ids['term.alpha'].signature = 'Beta|'
      writeFileSync(resolve(root, 'data/id-ledger.json'), JSON.stringify(l), 'utf8')
      const v = run(root, 'validate-terms.mjs')
      assert.equal(v.status, 1)
      assert.ok(hasCode(v.stdout, 'id-reassigned'), v.stdout)
    } finally { cleanup(root) }
  })

  test('3. stable-id-missing：stable id 消失且無 tombstone 必失敗', () => {
    const root = makeFixture()
    try {
      pipeline(root)
      assert.ok(readJson(root, 'data/id-ledger.json').ids['term.alpha'])
      // 從來源移除 Alpha，重新匯入 → ledger 仍有該 id
      writeFileSync(resolve(root, 'sources/glossary_old.csv'),
        [CSV_HEADER, ...BASE_ROWS.filter((r) => !r.includes('Alpha'))].join('\n') + '\n', 'utf8')
      run(root, 'import-glossary.mjs')
      const v = run(root, 'validate-terms.mjs')
      assert.equal(v.status, 1)
      assert.ok(hasCode(v.stdout, 'stable-id-missing'), v.stdout)
    } finally { cleanup(root) }
  })

  test('3b. tombstone 讓 stable id 的移除合法', () => {
    const root = makeFixture()
    try {
      pipeline(root)
      writeFileSync(resolve(root, 'sources/glossary_old.csv'),
        [CSV_HEADER, ...BASE_ROWS.filter((r) => !r.includes('Alpha'))].join('\n') + '\n', 'utf8')
      const d = readJson(root, 'data/decisions.json')
      d.tombstones = [{ id: 'term.alpha', reason: '來源移除', decidedAt: '2026-07-28', decidedBy: 'owner' }]
      writeFileSync(resolve(root, 'data/decisions.json'), JSON.stringify(d), 'utf8')
      run(root, 'import-glossary.mjs')
      const v = run(root, 'validate-terms.mjs')
      assert.equal(v.status, 0, v.stdout)
    } finally { cleanup(root) }
  })

  test('4. approved-missing-info：缺 decidedBy 必失敗', () => {
    const root = makeFixture()
    try {
      pipeline(root)
      const g = readJson(root, 'data/glossary.json')
      g.terms[0].status = 'approved'
      g.terms[0].decidedAt = '2026-07-28'
      writeFileSync(resolve(root, 'data/glossary.json'), JSON.stringify(g), 'utf8')
      const v = run(root, 'validate-terms.mjs')
      assert.equal(v.status, 1)
      assert.ok(hasCode(v.stdout, 'approved-missing-info'), v.stdout)
    } finally { cleanup(root) }
  })

  test('5. silent-drop：同英文不同譯名少保留一筆必失敗', () => {
    const root = makeFixture()
    try {
      pipeline(root)
      const g = readJson(root, 'data/glossary.json')
      g.terms = g.terms.filter((t) => t.id !== 'term.fire.s2')
      writeFileSync(resolve(root, 'data/glossary.json'), JSON.stringify(g), 'utf8')
      const v = run(root, 'validate-terms.mjs')
      assert.equal(v.status, 1)
      assert.ok(hasCode(v.stdout, 'silent-drop'), v.stdout)
    } finally { cleanup(root) }
  })

  test('6. silent-drop：multiple-translations 未進 pending 必失敗', () => {
    const root = makeFixture()
    try {
      pipeline(root)
      writeFileSync(resolve(root, 'data/glossary-pending.json'), JSON.stringify({ items: [] }), 'utf8')
      const v = run(root, 'validate-terms.mjs')
      assert.equal(v.status, 1)
      assert.ok(hasCode(v.stdout, 'silent-drop'), v.stdout)
    } finally { cleanup(root) }
  })

  test('7. split 裁決：產生多個 stable sense 並離開 pending', () => {
    const root = makeFixture({
      multiTranslations: [{ en: 'Fire', resolution: 'split', entries: FIRE_SPLIT_OK }],
    })
    try {
      const { val } = pipeline(root)
      assert.equal(val.status, 0, val.stdout)
      const g = readJson(root, 'data/glossary.json')
      const fire = g.terms.filter((t) => t.en === 'Fire')
      assert.equal(fire.length, 2)
      assert.deepEqual(fire.map((t) => t.id).sort(),
        ['term.fire.damage-type', 'term.fire.elementalist-mastery'])
      assert.ok(fire.every((t) => t.idStatus === 'stable' && t.status === 'approved'))
      assert.deepEqual(fire.map((t) => t.sense).sort(), ['damage-type', 'elementalist-mastery'])
      assert.equal(g.terms.filter((t) => t.id.endsWith('.s1') || t.id.endsWith('.s2')).length, 0)
      const pend = readJson(root, 'data/glossary-pending.json')
      assert.equal(pend.items.filter((i) => i.en === 'Fire').length, 0)
      const l = readJson(root, 'data/id-ledger.json')
      assert.ok(l.ids['term.fire.damage-type'] && l.ids['term.fire.elementalist-mastery'])
    } finally { cleanup(root) }
  })

  test('8. merge 裁決：只產生一個 stable 條目，舊譯進 alias', () => {
    const root = makeFixture({
      rows: [...BASE_ROWS, '規則,族裔,Hakaan,哈肯族,,,', '角色,族裔,Hakaan,哈肯人,,,'],
      multiTranslations: [
        { en: 'Fire', resolution: 'split', entries: FIRE_SPLIT_OK },
        { en: 'Hakaan', resolution: 'merge', sourceIds: ['term.hakaan.s2', 'term.hakaan.s1'],
          stableId: 'term.hakaan', zhHant: '哈肯人', ...D },
      ],
    })
    try {
      const { val } = pipeline(root)
      assert.equal(val.status, 0, val.stdout)
      const g = readJson(root, 'data/glossary.json')
      const h = g.terms.filter((t) => t.en === 'Hakaan')
      assert.equal(h.length, 1)
      assert.equal(h[0].id, 'term.hakaan')
      assert.equal(h[0].idStatus, 'stable')
      assert.equal(h[0].zhHant, '哈肯人')
      assert.ok(h[0].aliasesZhHant.includes('哈肯族'), '未採用的舊譯應保留為 alias')
      assert.equal(readJson(root, 'data/glossary-pending.json').items.filter((i) => i.en === 'Hakaan').length, 0)
    } finally { cleanup(root) }
  })

  test('8b. provisional-mapping-drift：sourceZhHant 與來源不符時中止匯入', () => {
    const root = makeFixture({
      multiTranslations: [{ en: 'Fire', resolution: 'split', entries: [
        { ...FIRE_SPLIT_OK[0], sourceZhHant: '不存在的舊譯' }, FIRE_SPLIT_OK[1],
      ] }],
    })
    try {
      const imp = run(root, 'import-glossary.mjs')
      assert.equal(imp.status, 1)
      assert.ok(hasCode(imp.stderr, 'provisional-mapping-drift'), imp.stderr)
    } finally { cleanup(root) }
  })

  test('9. vocabulary 群組移除後舊生成檔被刪除', () => {
    const root = makeFixture({
      vocabulary: [
        { vocabulary: 'action-types', value: 'main', en: 'Main Action', zhHant: '主要動作', status: 'needs-review' },
        { vocabulary: 'doomed-group', value: 'x', en: 'X', zhHant: '甲', status: 'needs-review' },
      ],
    })
    try {
      run(root, 'build-vocabulary.mjs')
      assert.ok(existsSync(resolve(root, 'data/vocabulary/doomed-group.json')))
      const d = readJson(root, 'data/decisions.json')
      d.vocabulary = d.vocabulary.filter((v) => v.vocabulary !== 'doomed-group')
      writeFileSync(resolve(root, 'data/decisions.json'), JSON.stringify(d), 'utf8')
      run(root, 'build-vocabulary.mjs')
      assert.equal(existsSync(resolve(root, 'data/vocabulary/doomed-group.json')), false, '過期生成檔應被刪除')
      assert.ok(existsSync(resolve(root, 'data/vocabulary/action-types.json')))
    } finally { cleanup(root) }
  })

  test('10. provisional-in-release：provisional 進 manifest 必失敗', () => {
    const root = makeFixture()
    try {
      pipeline(root)
      mkdirSync(resolve(root, 'releases'), { recursive: true })
      writeFileSync(resolve(root, 'releases/m0.json'),
        JSON.stringify({ milestone: 'm0', entries: [{ kind: 'glossary', id: 'term.fire.s1' }] }), 'utf8')
      const v = run(root, 'validate-terms.mjs')
      assert.equal(v.status, 1)
      assert.ok(hasCode(v.stdout, 'provisional-in-release'), v.stdout)
    } finally { cleanup(root) }
  })

  test('11. provisional-referenced：provisional 被正式引用必失敗', () => {
    const root = makeFixture()
    try {
      pipeline(root)
      const g = readJson(root, 'data/glossary.json')
      g.terms.find((t) => t.id === 'term.alpha').entityRef = 'term.fire.s1'
      writeFileSync(resolve(root, 'data/glossary.json'), JSON.stringify(g), 'utf8')
      const v = run(root, 'validate-terms.mjs')
      assert.equal(v.status, 1)
      assert.ok(hasCode(v.stdout, 'provisional-referenced'), v.stdout)
    } finally { cleanup(root) }
  })

  test('11b. unresolved-ref：引用不存在的 id 必失敗', () => {
    const root = makeFixture()
    try {
      pipeline(root)
      const g = readJson(root, 'data/glossary.json')
      g.terms.find((t) => t.id === 'term.alpha').entityRef = 'term.does-not-exist'
      writeFileSync(resolve(root, 'data/glossary.json'), JSON.stringify(g), 'utf8')
      const v = run(root, 'validate-terms.mjs')
      assert.equal(v.status, 1)
      assert.ok(hasCode(v.stdout, 'unresolved-ref'), v.stdout)
    } finally { cleanup(root) }
  })

  test('12. dual-authority：vocabulary 與 glossary 同時保存權威譯名必失敗', () => {
    const root = makeFixture({
      vocabulary: [{ vocabulary: 'action-types', value: 'alpha', en: 'Alpha', zhHant: '甲', status: 'needs-review' }],
    })
    try {
      run(root, 'build-vocabulary.mjs')
      run(root, 'import-glossary.mjs')
      // 匯入器本應把 Alpha 移交 vocabulary；強行塞回 glossary 模擬雙重權威
      const g = readJson(root, 'data/glossary.json')
      g.terms.push({ id: 'term.alpha', idStatus: 'stable', en: 'Alpha', zhHant: '甲', category: '', status: 'needs-review', aliasesEn: [], aliasesZhHant: [] })
      writeFileSync(resolve(root, 'data/glossary.json'), JSON.stringify(g), 'utf8')
      const v = run(root, 'validate-terms.mjs')
      assert.equal(v.status, 1)
      assert.ok(hasCode(v.stdout, 'dual-authority'), v.stdout)
    } finally { cleanup(root) }
  })

  test('13. ledger 在驗證失敗時不得被提升', () => {
    const root = makeFixture()
    try {
      run(root, 'build-vocabulary.mjs')
      run(root, 'import-glossary.mjs')
      // 製造失敗：清空 pending 使 multiple-translations 未提報
      writeFileSync(resolve(root, 'data/glossary-pending.json'), JSON.stringify({ items: [] }), 'utf8')
      const v = run(root, 'validate-terms.mjs', '--commit')
      assert.equal(v.status, 1)
      assert.equal(existsSync(resolve(root, 'data/id-ledger.json')), false, '驗證失敗時 ledger 不得產生')
      assert.ok(existsSync(resolve(root, 'data/id-ledger.candidate.json')), '候選檔應保留')
    } finally { cleanup(root) }
  })

  test('14. 輸出具決定性：兩次執行內容相同（不含日期）', () => {
    const root = makeFixture()
    try {
      pipeline(root)
      const a = readFileSync(resolve(root, 'data/glossary.json'), 'utf8')
      run(root, 'import-glossary.mjs')
      const b = readFileSync(resolve(root, 'data/glossary.json'), 'utf8')
      assert.equal(a, b)
      assert.ok(!a.includes('generatedAt'), '生成檔不得含執行日期')
      assert.ok(a.includes('sourceHash'))
    } finally { cleanup(root) }
  })

  test('15. 正常 fixture 全流程通過', () => {
    const root = makeFixture()
    try {
      const { val } = pipeline(root)
      assert.equal(val.status, 0, val.stdout)
      assert.ok(val.stdout.includes('✅'))
    } finally { cleanup(root) }
  })

  // ───────── 多譯名裁決完整性 ─────────

  test('16. incomplete-multi-resolution：split 遺漏來源必失敗', () => {
    const root = makeFixture({ multiTranslations: [{ en: 'Fire', resolution: 'split', entries: [FIRE_SPLIT_OK[0]] }] })
    try {
      const imp = run(root, 'import-glossary.mjs')
      assert.equal(imp.status, 1)
      assert.ok(hasCode(imp.stderr, 'incomplete-multi-resolution'), imp.stderr)
    } finally { cleanup(root) }
  })

  test('17. duplicate-provisional-mapping：split 重複使用同一來源必失敗', () => {
    const root = makeFixture({ multiTranslations: [{ en: 'Fire', resolution: 'split', entries: [
      FIRE_SPLIT_OK[0], { ...FIRE_SPLIT_OK[0], stableId: 'term.fire.other', sense: 'other' },
    ] }] })
    try {
      const imp = run(root, 'import-glossary.mjs')
      assert.equal(imp.status, 1)
      assert.ok(hasCode(imp.stderr, 'duplicate-provisional-mapping'), imp.stderr)
    } finally { cleanup(root) }
  })

  test('18. unknown-provisional-id：split 指向不存在的來源必失敗', () => {
    const root = makeFixture({ multiTranslations: [{ en: 'Fire', resolution: 'split', entries: [
      ...FIRE_SPLIT_OK,
      { provisionalId: 'term.fire.s9', sourceZhHant: 'x', stableId: 'term.fire.z', sense: 'z', zhHant: 'x', ...D },
    ] }] })
    try {
      const imp = run(root, 'import-glossary.mjs')
      assert.equal(imp.status, 1)
      assert.ok(hasCode(imp.stderr, 'unknown-provisional-id'), imp.stderr)
    } finally { cleanup(root) }
  })

  test('19. cross-term-provisional-id：混入其他英文的來源必失敗', () => {
    const root = makeFixture({
      rows: [...BASE_ROWS, '規則,族裔,Hakaan,哈肯族,,,', '角色,族裔,Hakaan,哈肯人,,,'],
      multiTranslations: [{ en: 'Fire', resolution: 'split', entries: [
        ...FIRE_SPLIT_OK,
        { provisionalId: 'term.hakaan.s1', sourceZhHant: '哈肯族', stableId: 'term.x', sense: 'x', zhHant: 'y', ...D },
      ] }],
    })
    try {
      const imp = run(root, 'import-glossary.mjs')
      assert.equal(imp.status, 1)
      assert.ok(hasCode(imp.stderr, 'cross-term-provisional-id'), imp.stderr)
    } finally { cleanup(root) }
  })

  test('20. duplicate-stable-id：兩個來源指向同一 stable id 必失敗', () => {
    const root = makeFixture({ multiTranslations: [{ en: 'Fire', resolution: 'split', entries: [
      FIRE_SPLIT_OK[0], { ...FIRE_SPLIT_OK[1], stableId: 'term.fire.damage-type' },
    ] }] })
    try {
      const imp = run(root, 'import-glossary.mjs')
      assert.equal(imp.status, 1)
      assert.ok(hasCode(imp.stderr, 'duplicate-stable-id'), imp.stderr)
    } finally { cleanup(root) }
  })

  test('21. incomplete-multi-resolution：merge 只涵蓋部分來源必失敗', () => {
    const root = makeFixture({
      rows: [...BASE_ROWS, '規則,族裔,Hakaan,哈肯族,,,', '角色,族裔,Hakaan,哈肯人,,,'],
      multiTranslations: [
        { en: 'Fire', resolution: 'split', entries: FIRE_SPLIT_OK },
        { en: 'Hakaan', resolution: 'merge', sourceIds: ['term.hakaan.s1'], stableId: 'term.hakaan', zhHant: '哈肯人', ...D },
      ],
    })
    try {
      const imp = run(root, 'import-glossary.mjs')
      assert.equal(imp.status, 1)
      assert.ok(hasCode(imp.stderr, 'incomplete-multi-resolution'), imp.stderr)
    } finally { cleanup(root) }
  })

  test('22. split 可修改正式譯名，來源比對只看 sourceZhHant', () => {
    const root = makeFixture({ multiTranslations: [{ en: 'Fire', resolution: 'split', entries: [
      { ...FIRE_SPLIT_OK[0], zhHant: '焰火' }, FIRE_SPLIT_OK[1],
    ] }] })
    try {
      const { val } = pipeline(root)
      assert.equal(val.status, 0, val.stdout)
      const g = readJson(root, 'data/glossary.json')
      assert.equal(g.terms.find((t) => t.id === 'term.fire.damage-type').zhHant, '焰火')
    } finally { cleanup(root) }
  })

  test('23. provisional-mapping-drift：缺 sourceZhHant 必失敗', () => {
    const e0 = { ...FIRE_SPLIT_OK[0] }
    delete e0.sourceZhHant
    const root = makeFixture({ multiTranslations: [{ en: 'Fire', resolution: 'split', entries: [e0, FIRE_SPLIT_OK[1]] }] })
    try {
      const imp = run(root, 'import-glossary.mjs')
      assert.equal(imp.status, 1)
      assert.ok(hasCode(imp.stderr, 'provisional-mapping-drift'), imp.stderr)
    } finally { cleanup(root) }
  })

  // ───────── 重複列的資料保全 ─────────

  test('24. 同英文同譯名但 metadata 不同：alias／note／分類不得消失', () => {
    const root = makeFixture({ rows: [
      '規則,術語,Alpha,甲,First,別甲,note1',
      '角色,別類,Alpha,甲,Second,另甲,note2',
      '規則,狀態,Slowed,緩速,,,',
      '規則,傷害類型,Fire,火焰,,,',
      '角色,元素精通,Fire,烈火,,,',
    ] })
    try {
      pipeline(root)
      const a = readJson(root, 'data/glossary.json').terms.find((t) => t.en === 'Alpha')
      assert.deepEqual(a.aliasesEn, ['First', 'Second'], '兩列的 alt-en 都要保留')
      assert.deepEqual(a.aliasesZhHant, ['別甲', '另甲'], '兩列的 alt-zh 都要保留')
      assert.deepEqual(a.sourceNotes, ['note1', 'note2'], '兩列的 note 都要保留')
      assert.deepEqual(a.categories, ['規則/術語', '角色/別類'], 'category 為多值，全部保留')
      // 多重 category 是合法的分類標籤，不再視為需裁決的衝突
      assert.equal(readJson(root, 'data/glossary-pending.json').items
        .filter((i) => i.issue === 'metadata-conflict' && i.en === 'Alpha').length, 0)
    } finally { cleanup(root) }
  })

  test('25. 完全重複列才可安全去重', () => {
    const root = makeFixture({ rows: [
      '規則,術語,Alpha,甲,,,',
      '規則,術語,Alpha,甲,,,',
      '規則,狀態,Slowed,緩速,,,',
      '規則,傷害類型,Fire,火焰,,,',
      '角色,元素精通,Fire,烈火,,,',
    ] })
    try {
      const { imp } = pipeline(root)
      assert.match(imp.stdout, /完全重複（安全去重）\s+1/)
      assert.equal(readJson(root, 'data/glossary-pending.json').items
        .filter((i) => i.issue === 'metadata-conflict').length, 0)
    } finally { cleanup(root) }
  })

  // ───────── candidate ledger ─────────

  test('26. ledger-candidate-extra-id：candidate 含不存在的 id 必失敗且不動正式 ledger', () => {
    const root = makeFixture()
    try {
      pipeline(root)
      const before = readFileSync(resolve(root, 'data/id-ledger.json'), 'utf8')
      run(root, 'import-glossary.mjs')
      const cand = readJson(root, 'data/id-ledger.candidate.json')
      cand.ids['term.evil'] = { signature: 'Evil|' }
      writeFileSync(resolve(root, 'data/id-ledger.candidate.json'), JSON.stringify(cand), 'utf8')
      const v = run(root, 'validate-terms.mjs', '--commit')
      assert.equal(v.status, 1)
      assert.ok(hasCode(v.stdout, 'ledger-candidate-extra-id'), v.stdout)
      assert.equal(readFileSync(resolve(root, 'data/id-ledger.json'), 'utf8'), before, '正式 ledger 不得變動')
    } finally { cleanup(root) }
  })

  test('27. ledger-candidate-mismatch：candidate 竄改既有記錄必失敗', () => {
    const root = makeFixture()
    try {
      pipeline(root)
      run(root, 'import-glossary.mjs')
      const cand = readJson(root, 'data/id-ledger.candidate.json')
      cand.ids['term.alpha'].signature = 'Tampered|'
      writeFileSync(resolve(root, 'data/id-ledger.candidate.json'), JSON.stringify(cand), 'utf8')
      const v = run(root, 'validate-terms.mjs', '--commit')
      assert.equal(v.status, 1)
      assert.ok(hasCode(v.stdout, 'ledger-candidate-mismatch'), v.stdout)
    } finally { cleanup(root) }
  })

  test('28. ledger-candidate-missing：--commit 缺 candidate 必失敗', () => {
    const root = makeFixture()
    try {
      pipeline(root)
      assert.equal(existsSync(resolve(root, 'data/id-ledger.candidate.json')), false)
      const v = run(root, 'validate-terms.mjs', '--commit')
      assert.equal(v.status, 1)
      assert.ok(hasCode(v.stdout, 'ledger-candidate-missing'), v.stdout)
    } finally { cleanup(root) }
  })

  // ───────── hash 新鮮度 ─────────

  test('29. stale-decisions-hash：改 decisions 未重跑生成必失敗', () => {
    const root = makeFixture()
    try {
      pipeline(root)
      const d = readJson(root, 'data/decisions.json')
      d.$touched = 'x'
      writeFileSync(resolve(root, 'data/decisions.json'), JSON.stringify(d, null, 2), 'utf8')
      const v = run(root, 'validate-terms.mjs')
      assert.equal(v.status, 1)
      assert.ok(hasCode(v.stdout, 'stale-decisions-hash'), v.stdout)
    } finally { cleanup(root) }
  })

  test('30. stale-source-hash：改 CSV 未重跑匯入必失敗', () => {
    const root = makeFixture()
    try {
      pipeline(root)
      writeFileSync(resolve(root, 'sources/glossary_old.csv'),
        [CSV_HEADER, ...BASE_ROWS, '規則,術語,Beta,乙,,,'].join('\n') + '\n', 'utf8')
      const v = run(root, 'validate-terms.mjs')
      assert.equal(v.status, 1)
      assert.ok(hasCode(v.stdout, 'stale-source-hash'), v.stdout)
    } finally { cleanup(root) }
  })

  test('31. unexpected-generated-file：多出舊 vocabulary 檔必失敗', () => {
    const root = makeFixture()
    try {
      pipeline(root)
      mkdirSync(resolve(root, 'data/vocabulary'), { recursive: true })
      writeFileSync(resolve(root, 'data/vocabulary/ghost.json'),
        JSON.stringify({ decisionsHash: 'x', vocabulary: 'ghost', values: [] }), 'utf8')
      const v = run(root, 'validate-terms.mjs')
      assert.equal(v.status, 1)
      assert.ok(hasCode(v.stdout, 'unexpected-generated-file'), v.stdout)
    } finally { cleanup(root) }
  })

  // ───────── 引用 allowlist ─────────

  test('32. allowlist 內的未建立實體只警告', () => {
    const root = makeFixture()
    try {
      const { val } = pipeline(root)
      assert.equal(val.status, 0, val.stdout)
      assert.match(val.stdout, /condition\.slowed（allowlist）/)
    } finally { cleanup(root) }
  })

  test('33. unresolved-ref：拼錯的 condition id 必失敗（不再前綴放行）', () => {
    const root = makeFixture()
    try {
      pipeline(root)
      const g = readJson(root, 'data/glossary.json')
      g.terms.find((t) => t.id === 'term.slowed').entityRef = 'condition.sloewd'
      writeFileSync(resolve(root, 'data/glossary.json'), JSON.stringify(g), 'utf8')
      const v = run(root, 'validate-terms.mjs')
      assert.equal(v.status, 1)
      assert.ok(hasCode(v.stdout, 'unresolved-ref'), v.stdout)
    } finally { cleanup(root) }
  })

  // ───────── manifest 先前誤稱已測的兩項 ─────────

  test('34. deprecated-missing-reason：deprecated 缺理由必失敗', () => {
    const root = makeFixture()
    try {
      pipeline(root)
      const g = readJson(root, 'data/glossary.json')
      const t = g.terms.find((x) => x.id === 'term.alpha')
      t.status = 'deprecated'
      delete t.note
      writeFileSync(resolve(root, 'data/glossary.json'), JSON.stringify(g), 'utf8')
      const v = run(root, 'validate-terms.mjs')
      assert.equal(v.status, 1)
      assert.ok(hasCode(v.stdout, 'deprecated-missing-reason'), v.stdout)
    } finally { cleanup(root) }
  })

  test('35. auto-promoted：needs-review 帶裁決欄位必失敗', () => {
    const root = makeFixture()
    try {
      pipeline(root)
      const g = readJson(root, 'data/glossary.json')
      g.terms.find((x) => x.id === 'term.alpha').decidedBy = 'owner'
      writeFileSync(resolve(root, 'data/glossary.json'), JSON.stringify(g), 'utf8')
      const v = run(root, 'validate-terms.mjs')
      assert.equal(v.status, 1)
      assert.ok(hasCode(v.stdout, 'auto-promoted'), v.stdout)
    } finally { cleanup(root) }
  })

  // ───────── tombstone 的完整 --commit 流程 ─────────

  const removeAlpha = (root) => writeFileSync(resolve(root, 'sources/glossary_old.csv'),
    [CSV_HEADER, ...BASE_ROWS.filter((r) => !r.includes('Alpha'))].join('\n') + '\n', 'utf8')
  const setTombstones = (root, tombs) => {
    const d = readJson(root, 'data/decisions.json')
    d.tombstones = tombs
    writeFileSync(resolve(root, 'data/decisions.json'), JSON.stringify(d, null, 2), 'utf8')
  }

  test('36. 合法 tombstone 可完成真正的 --commit，被移除 id 從正式 ledger 消失', () => {
    const root = makeFixture()
    try {
      pipeline(root)
      assert.ok(readJson(root, 'data/id-ledger.json').ids['term.alpha'])
      removeAlpha(root)
      setTombstones(root, [{ id: 'term.alpha', reason: '來源移除', decidedAt: '2026-07-28', decidedBy: 'owner' }])
      run(root, 'build-vocabulary.mjs')
      run(root, 'import-glossary.mjs')
      const v = run(root, 'validate-terms.mjs', '--commit')
      assert.equal(v.status, 0, v.stdout)
      const l = readJson(root, 'data/id-ledger.json')
      assert.equal(l.ids['term.alpha'], undefined, '合法 tombstone 的 id 必須從正式 ledger 消失')
      assert.equal(existsSync(resolve(root, 'data/id-ledger.candidate.json')), false, 'candidate 提升後應刪除')
    } finally { cleanup(root) }
  })

  test('37. 無 tombstone 時 --commit 仍回報 stable-id-missing', () => {
    const root = makeFixture()
    try {
      pipeline(root)
      removeAlpha(root)
      run(root, 'build-vocabulary.mjs')
      run(root, 'import-glossary.mjs')
      const v = run(root, 'validate-terms.mjs', '--commit')
      assert.equal(v.status, 1)
      assert.ok(hasCode(v.stdout, 'stable-id-missing'), v.stdout)
      assert.ok(readJson(root, 'data/id-ledger.json').ids['term.alpha'], '失敗時正式 ledger 不得變動')
    } finally { cleanup(root) }
  })

  test('38. tombstone 欄位不完整時回報 tombstone-invalid', () => {
    const root = makeFixture()
    try {
      pipeline(root)
      removeAlpha(root)
      setTombstones(root, [{ id: 'term.alpha', reason: '', decidedAt: '2026-07-28', decidedBy: 'owner' }])
      run(root, 'build-vocabulary.mjs')
      run(root, 'import-glossary.mjs')
      const v = run(root, 'validate-terms.mjs', '--commit')
      assert.equal(v.status, 1)
      assert.ok(hasCode(v.stdout, 'tombstone-invalid'), v.stdout)
    } finally { cleanup(root) }
  })

  // ───────── pending 從零重建 ─────────

  const ORDER_PENDING = {
    kind: 'glossary', en: 'Order', sense: 'censor-subclass', issue: 'missing-term',
    candidates: ['教團'], context: ['class.censor'], note: '待裁決。',
  }

  test('39. 刪除 glossary-pending.json 後乾淨重建，手動 pending 不遺失', () => {
    const root = makeFixture({ pending: [ORDER_PENDING] })
    try {
      pipeline(root)
      assert.ok(readJson(root, 'data/glossary-pending.json').items.some((i) => i.en === 'Order'))
      rmSync(resolve(root, 'data/glossary-pending.json'))
      run(root, 'import-glossary.mjs')
      const pend = readJson(root, 'data/glossary-pending.json')
      assert.ok(pend.items.some((i) => i.en === 'Order'), '手動 pending 須來自 decisions.pending，不依賴舊生成檔')
      assert.equal(pend.items.filter((i) => i.issue === 'multiple-translations').length, 3 - 2, 'Fire 仍在')
    } finally { cleanup(root) }
  })

  test('40. pending 具決定性：兩次生成位元相同', () => {
    const root = makeFixture({ pending: [ORDER_PENDING] })
    try {
      pipeline(root)
      const a = readFileSync(resolve(root, 'data/glossary-pending.json'), 'utf8')
      rmSync(resolve(root, 'data/glossary-pending.json'))
      run(root, 'import-glossary.mjs')
      assert.equal(readFileSync(resolve(root, 'data/glossary-pending.json'), 'utf8'), a)
    } finally { cleanup(root) }
  })

  test('41. 已完成正式裁決的手動 pending 自動消失（kind+en+sense 完全相符）', () => {
    const root = makeFixture({
      // pending 與裁決的 sense 必須一致才算解決；此處兩者皆無 sense
      pending: [{ kind: 'glossary', en: 'Alpha', issue: 'missing-term', candidates: ['甲'] }],
      glossary: [{ en: 'Alpha', zhHant: '甲', ...D, note: '已裁決' }],
    })
    try {
      pipeline(root)
      assert.equal(readJson(root, 'data/glossary-pending.json').items.filter((i) => i.en === 'Alpha').length, 0)
    } finally { cleanup(root) }
  })

  test('42. pending hash 過期必失敗', () => {
    const root = makeFixture({ pending: [ORDER_PENDING] })
    try {
      pipeline(root)
      const pend = readJson(root, 'data/glossary-pending.json')
      pend.decisionsHash = 'deadbeef'
      writeFileSync(resolve(root, 'data/glossary-pending.json'), JSON.stringify(pend), 'utf8')
      const v = run(root, 'validate-terms.mjs')
      assert.equal(v.status, 1)
      assert.ok(hasCode(v.stdout, 'stale-decisions-hash'), v.stdout)
    } finally { cleanup(root) }
  })

  // ───────── category 多值模型 ─────────

  test('43. 同詞的多個 category 全部保留，且不產生 pending', () => {
    const root = makeFixture({ rows: [
      '規則,術語,Clarity,澄明,,,',
      '角色,英雄資源,Clarity,澄明,,,',
      '規則,狀態,Slowed,緩速,,,',
      '規則,傷害類型,Fire,火焰,,,',
      '角色,元素精通,Fire,烈火,,,',
    ] })
    try {
      const { val } = pipeline(root)
      assert.equal(val.status, 0, val.stdout)
      const t = readJson(root, 'data/glossary.json').terms.find((x) => x.en === 'Clarity')
      assert.deepEqual(t.categories, ['規則/術語', '角色/英雄資源'])
      assert.equal(readJson(root, 'data/glossary-pending.json').items
        .filter((i) => i.issue === 'metadata-conflict').length, 0, '多重 category 不是衝突')
    } finally { cleanup(root) }
  })

  test('44. 多個 alias 與 note 不遺失', () => {
    const root = makeFixture({ rows: [
      '規則,術語,Alpha,甲,First,別甲,note1',
      '角色,別類,Alpha,甲,Second,另甲,note2',
      '規則,狀態,Slowed,緩速,,,',
      '規則,傷害類型,Fire,火焰,,,',
      '角色,元素精通,Fire,烈火,,,',
    ] })
    try {
      pipeline(root)
      const a = readJson(root, 'data/glossary.json').terms.find((t) => t.en === 'Alpha')
      assert.deepEqual(a.aliasesEn, ['First', 'Second'])
      assert.deepEqual(a.aliasesZhHant, ['別甲', '另甲'])
      assert.deepEqual(a.sourceNotes, ['note1', 'note2'])
      assert.deepEqual(a.categories, ['規則/術語', '角色/別類'])
    } finally { cleanup(root) }
  })

  test('45. metadata-conflict：實體分類互斥時仍提報', () => {
    const root = makeFixture({ rows: [
      '規則,狀態,Alpha,甲,,,',
      '角色,術語,Alpha,甲,,,',
      '規則,狀態,Slowed,緩速,,,',
      '規則,傷害類型,Fire,火焰,,,',
      '角色,元素精通,Fire,烈火,,,',
    ] })
    try {
      run(root, 'build-vocabulary.mjs')
      run(root, 'import-glossary.mjs')
      const pend = readJson(root, 'data/glossary-pending.json')
      assert.ok(pend.items.some((i) => i.issue === 'metadata-conflict' && i.en === 'Alpha'),
        '一列是狀態實體、另一列不是 → 真正互斥，必須提報')
    } finally { cleanup(root) }
  })

  // ───────── vocabulary 納入 ledger ─────────

  const VOCAB = [
    { vocabulary: 'action-types', value: 'main', en: 'Main Action', zhHant: '主要動作', status: 'needs-review' },
  ]

  test('46. vocabulary stable id 首次進入 ledger', () => {
    const root = makeFixture({ vocabulary: VOCAB })
    try {
      const { val } = pipeline(root)
      assert.equal(val.status, 0, val.stdout)
      const l = readJson(root, 'data/id-ledger.json')
      assert.ok(l.ids['action-type.main'], 'vocabulary id 須進入 ledger')
      assert.equal(l.ids['action-type.main'].signature, 'vocabulary|action-types|main|Main Action')
    } finally { cleanup(root) }
  })

  test('47. 修改 vocabulary value 導致 id 改變，無 tombstone 時失敗', () => {
    const root = makeFixture({ vocabulary: VOCAB })
    try {
      pipeline(root)
      const d = readJson(root, 'data/decisions.json')
      d.vocabulary[0].value = 'primary'
      writeFileSync(resolve(root, 'data/decisions.json'), JSON.stringify(d, null, 2), 'utf8')
      run(root, 'build-vocabulary.mjs')
      run(root, 'import-glossary.mjs')
      const v = run(root, 'validate-terms.mjs', '--commit')
      assert.equal(v.status, 1)
      assert.ok(hasCode(v.stdout, 'stable-id-missing'), v.stdout)
    } finally { cleanup(root) }
  })

  test('48. 有合法 tombstone 時 vocabulary id 改名可完成', () => {
    const root = makeFixture({ vocabulary: VOCAB })
    try {
      pipeline(root)
      const d = readJson(root, 'data/decisions.json')
      d.vocabulary[0].value = 'primary'
      d.tombstones = [{ id: 'action-type.main', reason: '改名為 primary', decidedAt: '2026-07-28', decidedBy: 'owner' }]
      writeFileSync(resolve(root, 'data/decisions.json'), JSON.stringify(d, null, 2), 'utf8')
      run(root, 'build-vocabulary.mjs')
      run(root, 'import-glossary.mjs')
      const v = run(root, 'validate-terms.mjs', '--commit')
      assert.equal(v.status, 0, v.stdout)
      const l = readJson(root, 'data/id-ledger.json')
      assert.equal(l.ids['action-type.main'], undefined)
      assert.ok(l.ids['action-type.primary'])
    } finally { cleanup(root) }
  })

  test('49. vocabulary stable id 從 candidate 消失時失敗', () => {
    const root = makeFixture({ vocabulary: VOCAB })
    try {
      pipeline(root)
      run(root, 'import-glossary.mjs')
      const cand = readJson(root, 'data/id-ledger.candidate.json')
      delete cand.ids['action-type.main']
      writeFileSync(resolve(root, 'data/id-ledger.candidate.json'), JSON.stringify(cand), 'utf8')
      const v = run(root, 'validate-terms.mjs', '--commit')
      assert.equal(v.status, 1)
      assert.ok(hasCode(v.stdout, 'ledger-candidate-mismatch') || hasCode(v.stdout, 'ledger-candidate-invalid'), v.stdout)
    } finally { cleanup(root) }
  })

  test('50. glossary 與 vocabulary id 撞號必失敗', () => {
    const root = makeFixture({ vocabulary: VOCAB })
    try {
      pipeline(root)
      const g = readJson(root, 'data/glossary.json')
      g.terms.push({ id: 'action-type.main', idStatus: 'stable', en: 'Clash', zhHant: '撞號', categories: [], status: 'needs-review', aliasesEn: [], aliasesZhHant: [] })
      writeFileSync(resolve(root, 'data/glossary.json'), JSON.stringify(g), 'utf8')
      const v = run(root, 'validate-terms.mjs')
      assert.equal(v.status, 1)
      assert.ok(hasCode(v.stdout, 'duplicate-id'), v.stdout)
    } finally { cleanup(root) }
  })

  // ───────── missing-generated-file ─────────

  // ───────── 凍結前的最小收尾（Reviewer 指定四項）─────────

  test('52. 不同 sense 的 pending 不會互相清除', () => {
    const root = makeFixture({
      pending: [
        { kind: 'glossary', en: 'Order', sense: 'censor-subclass', issue: 'missing-term', candidates: ['教團'] },
        { kind: 'glossary', en: 'Order', sense: 'command', issue: 'missing-term', candidates: ['命令'] },
      ],
      // 只批准其中一個 sense
      glossary: [{ en: 'Order', sense: 'command', zhHant: '命令', ...D, note: '已裁決' }],
    })
    try {
      pipeline(root)
      const items = readJson(root, 'data/glossary-pending.json').items.filter((i) => i.en === 'Order')
      assert.equal(items.length, 1, '只應清除被批准的那個 sense')
      assert.equal(items[0].sense, 'censor-subclass', '未批准的 sense 必須留在 pending')
    } finally { cleanup(root) }
  })

  test('53. multi-resolution-not-approved：split 缺 status 不得套用', () => {
    const e0 = { ...FIRE_SPLIT_OK[0] }
    delete e0.status
    const root = makeFixture({ multiTranslations: [{ en: 'Fire', resolution: 'split', entries: [e0, FIRE_SPLIT_OK[1]] }] })
    try {
      const imp = run(root, 'import-glossary.mjs')
      assert.equal(imp.status, 1)
      assert.ok(hasCode(imp.stderr, 'multi-resolution-not-approved'), imp.stderr)
    } finally { cleanup(root) }
  })

  test('54. multi-resolution-not-approved：merge 為 needs-review 不得套用', () => {
    const root = makeFixture({
      rows: [...BASE_ROWS, '規則,族裔,Hakaan,哈肯族,,,', '角色,族裔,Hakaan,哈肯人,,,'],
      multiTranslations: [
        { en: 'Fire', resolution: 'split', entries: FIRE_SPLIT_OK },
        { en: 'Hakaan', resolution: 'merge', sourceIds: ['term.hakaan.s1', 'term.hakaan.s2'],
          stableId: 'term.hakaan', zhHant: '哈肯人', status: 'needs-review' },
      ],
    })
    try {
      const imp = run(root, 'import-glossary.mjs')
      assert.equal(imp.status, 1)
      assert.ok(hasCode(imp.stderr, 'multi-resolution-not-approved'), imp.stderr)
    } finally { cleanup(root) }
  })

  test('55. ambiguous-glossary-decision：相同英文的多個 sense 不得靜默覆蓋', () => {
    const root = makeFixture({
      glossary: [
        { en: 'Alpha', sense: 'a', zhHant: '甲一', ...D },
        { en: 'Alpha', sense: 'b', zhHant: '甲二', ...D },
      ],
    })
    try {
      const imp = run(root, 'import-glossary.mjs')
      assert.equal(imp.status, 1)
      assert.ok(hasCode(imp.stderr, 'ambiguous-glossary-decision'), imp.stderr)
    } finally { cleanup(root) }
  })

  test('56. categories schema 統一：所有條目皆為陣列，且無舊欄位 category', () => {
    const root = makeFixture({
      // 只存在於 decisions、不在舊 CSV 的項目也要統一
      glossary: [{ en: 'Effect', sense: 'rules-effect', zhHant: '效果', category: '規則/術語', ...D }],
    })
    try {
      const { val } = pipeline(root)
      assert.equal(val.status, 0, val.stdout)
      const terms = readJson(root, 'data/glossary.json').terms
      for (const t of terms) {
        assert.ok(Array.isArray(t.categories), `${t.id} 的 categories 必須是陣列`)
        assert.equal('category' in t, false, `${t.id} 不得含舊欄位 category`)
      }
      const eff = terms.find((t) => t.en === 'Effect')
      assert.deepEqual(eff.categories, ['規則/術語'], 'decisions-only 條目也要用 categories')
    } finally { cleanup(root) }
  })

  test('57. schema-invalid：出現舊欄位 category 必失敗', () => {
    const root = makeFixture()
    try {
      pipeline(root)
      const g = readJson(root, 'data/glossary.json')
      const t = g.terms.find((x) => x.id === 'term.alpha')
      t.category = '規則/術語'
      writeFileSync(resolve(root, 'data/glossary.json'), JSON.stringify(g), 'utf8')
      const v = run(root, 'validate-terms.mjs')
      assert.equal(v.status, 1)
      assert.ok(hasCode(v.stdout, 'schema-invalid'), v.stdout)
    } finally { cleanup(root) }
  })

  test('51. missing-generated-file：刪除應存在的 vocabulary JSON 必失敗', () => {
    const root = makeFixture({ vocabulary: [
      ...VOCAB,
      { vocabulary: 'ability-keywords', value: 'melee', en: 'Melee', zhHant: '近戰', status: 'needs-review' },
    ] })
    try {
      pipeline(root)
      assert.ok(existsSync(resolve(root, 'data/vocabulary/ability-keywords.json')))
      rmSync(resolve(root, 'data/vocabulary/ability-keywords.json'))
      const v = run(root, 'validate-terms.mjs')
      assert.equal(v.status, 1)
      assert.ok(hasCode(v.stdout, 'missing-generated-file'), v.stdout)
    } finally { cleanup(root) }
  })

  // ── notTerms：擁有者裁定某列不是術語（glossary_old.csv 凍結，刪除只能走裁決）
  test('58. notTerms：裁定非術語的列不生成條目，且移除需 tombstone', () => {
    const root = makeFixture()
    try {
      pipeline(root)
      // 先確認 Alpha 存在且已進 ledger
      assert.ok(readJson(root, 'data/glossary.json').terms.some((t) => t.id === 'term.alpha'))
      assert.ok(readJson(root, 'data/id-ledger.json').ids['term.alpha'])

      const d = readJson(root, 'data/decisions.json')
      d.notTerms = [{ en: 'Alpha', reason: '當初的註記列，非術語', decidedAt: '2026-07-28', decidedBy: 'owner' }]
      writeFileSync(resolve(root, 'data/decisions.json'), JSON.stringify(d), 'utf8')
      run(root, 'import-glossary.mjs')

      // 條目確實消失
      assert.ok(!readJson(root, 'data/glossary.json').terms.some((t) => t.id === 'term.alpha'))
      // 但 ledger 仍記得它 → 未給 tombstone 時必須失敗，不得靜默消失
      const v1 = run(root, 'validate-terms.mjs')
      assert.equal(v1.status, 1)
      assert.ok(hasCode(v1.stdout, 'stable-id-missing'), v1.stdout)

      // 補上 tombstone 後才合法
      d.tombstones = [{ id: 'term.alpha', reason: '經 notTerms 裁定非術語', decidedAt: '2026-07-28', decidedBy: 'owner' }]
      writeFileSync(resolve(root, 'data/decisions.json'), JSON.stringify(d), 'utf8')
      run(root, 'import-glossary.mjs')
      const v2 = run(root, 'validate-terms.mjs')
      assert.equal(v2.status, 0, v2.stdout)
    } finally { cleanup(root) }
  })

  test('59. not-term-invalid：notTerms 缺理由必中止匯入', () => {
    const root = makeFixture()
    try {
      const d = readJson(root, 'data/decisions.json')
      d.notTerms = [{ en: 'Alpha', decidedAt: '2026-07-28', decidedBy: 'owner' }]  // 缺 reason
      writeFileSync(resolve(root, 'data/decisions.json'), JSON.stringify(d), 'utf8')
      const imp = run(root, 'import-glossary.mjs')
      assert.equal(imp.status, 1)
      assert.ok(hasCode(imp.stderr, 'not-term-invalid'), imp.stderr)
    } finally { cleanup(root) }
  })

  test('60. not-term-conflict：同一 en 既非術語又有裁決必中止', () => {
    const root = makeFixture({
      glossary: [{ en: 'Alpha', zhHant: '甲', ...D }],
    })
    try {
      const d = readJson(root, 'data/decisions.json')
      d.notTerms = [{ en: 'Alpha', reason: '非術語', decidedAt: '2026-07-28', decidedBy: 'owner' }]
      writeFileSync(resolve(root, 'data/decisions.json'), JSON.stringify(d), 'utf8')
      const imp = run(root, 'import-glossary.mjs')
      assert.equal(imp.status, 1)
      assert.ok(hasCode(imp.stderr, 'not-term-conflict'), imp.stderr)
    } finally { cleanup(root) }
  })
})

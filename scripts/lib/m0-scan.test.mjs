/**
 * m0-scan 的迴歸測試。
 *
 * 這裡的每個案例都對應一個**實際發生過的 bug**（2026-07-29 開發當天踩到）。
 * 三者的共同點是：錯了不會報錯，只會讓 releases/m0.json 少一個或多一個詞——
 * 正是本專案最怕的靜默失敗。
 *
 * 全部在 os.tmpdir() 的 fixture 上執行，**不觸碰正式 repository 資料**。
 */
import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { resolve, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { spawnSync } from 'node:child_process'

const libDir = dirname(fileURLToPath(import.meta.url))

/** 建一個最小 fixture：一個正典條目 ＋ 指定的 glossary／vocabulary／中文實體 */
function makeFixture({ canon, glossaryTerms = [], vocabularies = {}, zhConditions = [] }) {
  const root = mkdtempSync(resolve(tmpdir(), 'ds-m0scan-'))
  mkdirSync(resolve(root, 'data/canon/abilities'), { recursive: true })
  mkdirSync(resolve(root, 'data/vocabulary'), { recursive: true })
  writeFileSync(resolve(root, 'data/canon/abilities/a.json'), JSON.stringify(canon), 'utf8')
  writeFileSync(resolve(root, 'data/glossary.json'),
    JSON.stringify({ terms: glossaryTerms }), 'utf8')
  for (const [name, values] of Object.entries(vocabularies)) {
    writeFileSync(resolve(root, `data/vocabulary/${name}.json`),
      JSON.stringify({ vocabulary: name, values }), 'utf8')
  }
  if (zhConditions.length) {
    mkdirSync(resolve(root, 'data/zh-Hant/conditions'), { recursive: true })
    for (const c of zhConditions) {
      writeFileSync(resolve(root, `data/zh-Hant/conditions/${c.id}.json`), JSON.stringify(c), 'utf8')
    }
  }
  return root
}

/** 在 fixture 上跑 scan()，回傳可斷言的摘要 */
function runScan(root) {
  const code = `
    import { scan } from ${JSON.stringify(pathToFileURL(resolve(libDir, 'm0-scan.mjs')).href)}
    const r = scan()
    console.log(JSON.stringify({
      prose: [...r.prose.values()].map((x) => ({ id: x.term.id, en: x.term.en, hits: x.hits.length })),
      candidates: [...r.candidates.keys()],
      controlled: [...r.controlled.values()].map((v) => ({ v: v.value, has: !!v.entry })),
      unresolvedSenses: r.unresolvedSenses,
      entityNames: [...r.entityNames.entries()],
    }))
  `
  const res = spawnSync(process.execPath, ['--input-type=module', '-e', code],
    { env: { ...process.env, DS_DATA_ROOT: root }, encoding: 'utf8' })
  assert.equal(res.status, 0, `scan 執行失敗：${res.stderr}`)
  return JSON.parse(res.stdout)
}

const ABILITY = (effect) => ({
  id: 'ability.test', type: 'ability', name: 'Test', keywords: [], effect: [effect],
})
const TERM = (id, en, extra = {}) =>
  ({ id, en, zhHant: 'X', status: 'approved', idStatus: 'stable', aliasesEn: [], ...extra })

describe('m0-scan 迴歸', () => {
  test('單字詞的規則複數要能命中（Victories → Victory）', () => {
    const root = makeFixture({
      canon: ABILITY('You gain wrath equal to your Victories.'),
      glossaryTerms: [TERM('term.victory', 'Victory')],
    })
    try {
      const r = runScan(root)
      const hit = r.prose.find((x) => x.id === 'term.victory')
      assert.ok(hit, 'Victories 應歸到 Victory —— 術語表不該為每個詞形各開一條')
      assert.equal(hit.hits, 1)
    } finally { rmSync(root, { recursive: true, force: true }) }
  })

  test('多字規則動詞不得被「頭字已是術語」的遮罩藏起來（vertical pull vs Pull）', () => {
    const root = makeFixture({
      canon: ABILITY('You can vertical pull the creature 2 squares.'),
      glossaryTerms: [TERM('term.pull', 'Pull')],
    })
    try {
      const r = runScan(root)
      assert.ok(r.candidates.includes('vertical pull'),
        'vertical pull 必須進通道 C；若比對遮罩後的文字，Pull 會先吃掉 pull，整個詞就消失了')
    } finally { rmSync(root, { recursive: true, force: true }) }
  })

  test('同一詞條的多個比對面指向同一段文字時，處數不得重複計算', () => {
    // vocabulary 值同時提供 en「Maneuver」與 value「maneuver」兩個比對面，
    // 對同一個字會各命中一次；不去重就會讓處數灌水一倍。
    // 用 action-types 而非 ability-keywords——後者是結構型，不參與散文比對。
    const root = makeFixture({
      canon: ABILITY('A creature can use the Knockback maneuver to push a foe.'),
      vocabularies: {
        'action-types': [{ id: 'action-type.maneuver', value: 'maneuver', en: 'Maneuver', zhHant: '機動動作', status: 'approved', idStatus: 'stable' }],
      },
    })
    try {
      const r = runScan(root)
      const hit = r.prose.find((x) => x.id === 'action-type.maneuver')
      assert.ok(hit, 'vocabulary 的英文也要納入散文比對（結構型詞彙表除外）')
      assert.equal(hit.hits, 1, '同一處只能算一次')
    } finally { rmSync(root, { recursive: true, force: true }) }
  })

  test('條目名稱不進通道 C（名稱是條目專屬譯文，不是受控術語）', () => {
    const root = makeFixture({
      canon: { id: 'ability.test', type: 'ability', name: 'Behold a Shield of Faith!', keywords: [], effect: [] },
    })
    try {
      const r = runScan(root)
      assert.deepEqual(r.candidates, [], '掃名稱只會得到 Shield／Faith 這種雜訊')
    } finally { rmSync(root, { recursive: true, force: true }) }
  })

  // ── 2026-07-29 外部 review 指出的三個語意假命中 ──────────

  test('詞義分裂（同一英文多個 sense）不得自動歸給任一個', () => {
    // Fire 拆成「火焰（傷害類型）」與「烈火（元素師精通）」，字面一模一樣。
    // 掃描器沒有任何依據能分辨，猜錯就會讓依賴清單指向錯的 id 且不會報錯。
    const root = makeFixture({
      canon: ABILITY('The target has fire weakness 3 and takes fire damage.'),
      glossaryTerms: [
        TERM('term.fire.damage-type', 'Fire', { sense: 'damage-type', zhHant: '火焰' }),
        TERM('term.fire.elementalist-mastery', 'Fire', { sense: 'elementalist-mastery', zhHant: '烈火' }),
      ],
    })
    try {
      const r = runScan(root)
      assert.equal(r.prose.filter((x) => x.id.startsWith('term.fire')).length, 0,
        '歧義字面不得自動歸屬——兩個 sense 都不該出現在命中裡')
      const u = r.unresolvedSenses.find((x) => x.surface.toLowerCase() === 'fire')
      assert.ok(u, '必須回報為待指定，讓 build 中止')
      assert.equal(u.candidates.length, 2)
    } finally { rmSync(root, { recursive: true, force: true }) }
  })

  test('結構型詞彙表的英文不參與散文比對（strong／weak 是形容詞）', () => {
    // 「a strong example」「the weak will be corrupted」是一般散文，
    // 不是效力等級 Strong／Weak。效力等級只該由 tiers[].potency.level 這個結構欄位取得。
    const root = makeFixture({
      canon: ABILITY('Without a strong example and a firm hand, the weak will be corrupted.'),
      vocabularies: {
        'potency-levels': [
          { id: 'potency-level.strong', value: 'strong', en: 'Strong', zhHant: '強', status: 'approved', idStatus: 'stable' },
          { id: 'potency-level.weak', value: 'weak', en: 'Weak', zhHant: '弱', status: 'approved', idStatus: 'stable' },
        ],
      },
    })
    try {
      const r = runScan(root)
      assert.deepEqual(r.prose.filter((x) => x.id.startsWith('potency-level')), [],
        '效力等級不得由散文比對取得')
    } finally { rmSync(root, { recursive: true, force: true }) }
  })

  test('招式關鍵詞不參與散文比對（Magic skill 不是 ability-keyword.magic）', () => {
    // 「You have the Magic skill」的 Magic 是技能名稱；
    // 中文即使同為「魔法」，id 意義不同，不能共用。
    const root = makeFixture({
      canon: ABILITY('You have the Magic skill.'),
      vocabularies: {
        'ability-keywords': [{ id: 'ability-keyword.magic', value: 'magic', en: 'Magic', zhHant: '魔法', status: 'approved', idStatus: 'stable' }],
      },
    })
    try {
      const r = runScan(root)
      assert.equal(r.prose.find((x) => x.id === 'ability-keyword.magic'), undefined,
        '關鍵詞是結構欄位，散文裡的同形字不得歸給它')
      assert.ok(r.candidates.includes('magic'), '應改為浮現成缺詞候選，而不是靜默吸收')
    } finally { rmSync(root, { recursive: true, force: true }) }
  })

  test('名稱權威在實體的詞條，要能解析出中文名（9 個狀態）', () => {
    const root = makeFixture({
      canon: ABILITY('The target is slowed (save ends).'),
      glossaryTerms: [
        // 刻意不存 zhHant——名稱權威在狀態實體，兩處都放會變成雙重權威
        { id: 'term.slowed', en: 'Slowed', status: 'approved', idStatus: 'stable', aliasesEn: [], entityRef: 'condition.slowed' },
      ],
      zhConditions: [{ id: 'condition.slowed', nameZhHant: '緩速', meta: { status: 'reviewed', reviewedBy: 'owner' } }],
    })
    try {
      const r = runScan(root)
      assert.ok(r.prose.find((x) => x.id === 'term.slowed'), 'Slowed 應命中')
      const e = Object.fromEntries(r.entityNames)
      assert.equal(e['condition.slowed'].nameZhHant, '緩速',
        'release manifest 必須能循 entityRef 追到已批准的中文狀態名')
      assert.equal(e['condition.slowed'].reviewedBy, 'owner')
    } finally { rmSync(root, { recursive: true, force: true }) }
  })

  test('逐處排除：同一個詞在某些條目是術語、在另一些是普通英文字', () => {
    // term.magic.skill 是技能名。但 flavor 的「holy magic」是普通名詞，
    // 全域排除會連真正的技能名一起殺掉，故排除必須能指定到條目層級。
    // 這裡直接用正式資料的 ENTITY_EXCLUSIONS 驗證機制本身有生效。
    const root = makeFixture({
      canon: { id: 'ability.censor.halt-miscreant', type: 'ability', name: 'T', keywords: [], effect: ['You infuse your weapon with holy magic.'] },
      glossaryTerms: [TERM('term.magic.skill', 'Magic', { sense: 'skill', zhHant: '魔法' })],
    })
    try {
      const r = runScan(root)
      assert.equal(r.prose.find((x) => x.id === 'term.magic.skill'), undefined,
        'halt-miscreant 的 flavor magic 已列入逐處排除，不得計為技能名')
    } finally { rmSync(root, { recursive: true, force: true }) }
  })

  test('逐處排除不得誤殺同一個詞的正確用法', () => {
    const root = makeFixture({
      canon: { id: 'feature.censor.censor-order', type: 'feature', name: 'T', sections: [{ heading: null, blocks: [{ kind: 'paragraph', text: 'You have the Magic skill.' }] }] },
      glossaryTerms: [TERM('term.magic.skill', 'Magic', { sense: 'skill', zhHant: '魔法' })],
    })
    try {
      const r = runScan(root)
      const hit = r.prose.find((x) => x.id === 'term.magic.skill')
      assert.ok(hit, 'censor-order 不在排除清單內，技能名必須算數')
      assert.equal(hit.hits, 1)
    } finally { rmSync(root, { recursive: true, force: true }) }
  })

  test('正典用了詞彙表沒有的受控值時，通道 A 要標記出來', () => {
    const root = makeFixture({
      canon: { id: 'ability.test', type: 'ability', name: 'T', keywords: ['charge'], effect: [] },
      vocabularies: { 'ability-keywords': [] },
    })
    try {
      const r = runScan(root)
      const miss = r.controlled.find((c) => c.v === 'charge')
      assert.ok(miss && miss.has === false, '缺值必須顯示出來，不能靜默略過')
    } finally { rmSync(root, { recursive: true, force: true }) }
  })

  test('feature 的 bulletList：lead 與 items 都要被通道 B 掃到（先前只掃 paragraph／definitionList）', () => {
    const root = mkdtempSync(resolve(tmpdir(), 'ds-m0scan-'))
    mkdirSync(resolve(root, 'data/canon/features'), { recursive: true })
    mkdirSync(resolve(root, 'data/vocabulary'), { recursive: true })
    const canon = {
      id: 'feature.test.resource',
      type: 'feature',
      name: 'Test Resource',
      sections: [{
        heading: null,
        blocks: [{
          kind: 'bulletList',
          lead: 'You gain 1 Victory.',
          items: ['You gain a Recovery.', 'Nothing happens.'],
        }],
      }],
    }
    writeFileSync(resolve(root, 'data/canon/features/f.json'), JSON.stringify(canon), 'utf8')
    writeFileSync(resolve(root, 'data/glossary.json'), JSON.stringify({
      terms: [TERM('term.victory', 'Victory'), TERM('term.recovery', 'Recovery')],
    }), 'utf8')
    try {
      const r = runScan(root)
      const hitIds = r.prose.map((p) => p.id)
      assert.ok(hitIds.includes('term.victory'), 'bulletList.lead 裡的 Victory 應該被掃到')
      assert.ok(hitIds.includes('term.recovery'), 'bulletList.items[] 裡的 Recovery 應該被掃到')
    } finally { rmSync(root, { recursive: true, force: true }) }
  })
})

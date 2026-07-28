/**
 * `releases/m0.json` 的迴歸測試 —— 讀真實 repository 資料，但**絕不修改它**。
 *
 * 與 `lib/m0-scan.test.mjs` 分工不同：那邊用最小 fixture 驗掃描器的行為規則，
 * 這邊驗「目前這 28 條正典實際掃出來的依賴對不對」。
 * 2026-07-29 外部 review 指出通道 A 漏掃多個結構欄位後新增——
 * 漏掃不會報錯，只會讓清單少一個詞，非得用真實資料的具體斷言才擋得住。
 *
 * ## 對正式檔案的存取方式
 *
 * - **斷言部分**：唯讀 `releases/m0.json` 與 `data/canon/`。
 * - **破壞性的 `--check` 測試**：先把 `data/` 與 `releases/` 複製到 `os.tmpdir()`，
 *   在副本上動手腳並以 `DS_DATA_ROOT` 指向副本執行。
 *   **正式工作目錄自始至終唯讀**，測試中斷也不會留下髒資料。
 *
 * ## 預期失敗一律同時斷言 exit code 與錯誤代號
 *
 * 只斷言 `exit 1` 的話，語法錯誤、路徑錯誤、任何無關的崩潰都會讓測試「通過」。
 * 代號清單見 `scripts/build-m0-release.mjs` 檔頭。
 */
import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, writeFileSync, mkdtempSync, rmSync, cpSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const R = (rel) => resolve(repoRoot, rel)

const manifest = JSON.parse(readFileSync(R('releases/m0.json'), 'utf8'))
const byId = new Map(manifest.entries.map((e) => [e.id, e]))
const usedBy = (id, entityId) => (byId.get(id)?.usedBy ?? []).includes(entityId)

const canon = []
for (const d of ['abilities', 'conditions', 'features']) {
  for (const f of readdirSync(R(`data/canon/${d}`))) {
    canon.push(JSON.parse(readFileSync(R(`data/canon/${d}/${f}`), 'utf8')))
  }
}

/** 掃描器層的 (術語, 條目, 欄位) 三元組——manifest 的 viaFields 是彙總，證明不了具體關係 */
const usages = (() => {
  const code = `
    import { scan } from ${JSON.stringify(new URL('./lib/m0-scan.mjs', import.meta.url).href)}
    console.log(JSON.stringify(scan().controlledUsages))
  `
  const r = spawnSync(process.execPath, ['--input-type=module', '-e', code],
    { cwd: repoRoot, encoding: 'utf8' })
  assert.equal(r.status, 0, `取得 controlledUsages 失敗：${r.stderr}`)
  return JSON.parse(r.stdout)
})()
const usedVia = (termId, entityId, field) =>
  usages.some((u) => u.termId === termId && u.entityId === entityId && u.field === field)

describe('releases/m0.json · 結構欄位依賴（真實資料，唯讀）', () => {
  test('基礎打擊必須依賴力量與敏捷，且確實由二選一欄位帶出', () => {
    for (const id of ['ability.basic.melee-weapon-free-strike', 'ability.basic.ranged-weapon-free-strike']) {
      assert.ok(usedBy('term.might', id), `${id} 應依賴 term.might`)
      assert.ok(usedBy('term.agility', id), `${id} 應依賴 term.agility`)
      // 關鍵：這兩個依賴必須來自 powerRoll.characteristic.options[]，
      // 不能只是散文裡湊巧出現 might／agility
      assert.ok(usedVia('term.might', id, 'powerRoll.characteristic.options[]'),
        `${id} 的力量必須由二選一的 options 帶出`)
      assert.ok(usedVia('term.agility', id, 'powerRoll.characteristic.options[]'),
        `${id} 的敏捷必須由二選一的 options 帶出`)
    }
  })

  test('「懺悔吧！」必須依賴直覺，且來自 tiers[].potency.characteristic', () => {
    assert.ok(usedBy('term.intuition', 'ability.censor.repent'))
    assert.ok(usedVia('term.intuition', 'ability.censor.repent', 'tiers[].potency.characteristic'),
      '效力抵抗屬性逐招式不同（指南 §4.3.0），必須由這個欄位帶出')
  })

  test('「瀆神者退散！」必須依賴立方，且來自 distance.area.shape', () => {
    assert.ok(usedBy('term.cube', 'ability.censor.back-blasphemer'))
    assert.ok(usedVia('term.cube', 'ability.censor.back-blasphemer', 'distance.area.shape'))
  })

  test('所有有怒火費用的招式都必須在 term.wrath.usedBy，且由對應的費用欄位帶出', () => {
    const wrathVia = (a) => [
      a.cost?.resource === 'wrath' ? 'cost.resource' : null,
      (a.extraCosts ?? []).some((e) => (e.resource ?? e.cost?.resource) === 'wrath') ? 'extraCosts[].resource' : null,
      (a.followUpActions ?? []).some((f) => f.cost?.resource === 'wrath') ? 'followUpActions[].cost.resource' : null,
    ].filter(Boolean)

    const expected = canon.filter((a) => wrathVia(a).length).map((a) => a.id).sort()
    assert.ok(expected.length >= 8, `預期至少 8 個怒火招式，實際 ${expected.length}`)

    const actual = byId.get('term.wrath')?.usedBy ?? []
    assert.deepEqual(expected.filter((id) => !actual.includes(id)), [], '有招式的怒火費用未進依賴清單')

    // 每個招式都要能指出「是哪個費用欄位」帶出怒火的
    for (const a of canon.filter((x) => wrathVia(x).length)) {
      for (const field of wrathVia(a)) {
        assert.ok(usedVia('term.wrath', a.id, field), `${a.id} 的怒火應由 ${field} 帶出`)
      }
    }
  })

  test('「審判」的後續動作類型與怒火費用必須被掃到', () => {
    assert.ok(usedVia('action-type.free-triggered', 'ability.censor.judgment', 'followUpActions[].actionType'))
    assert.ok(usedVia('term.wrath', 'ability.censor.judgment', 'followUpActions[].cost.resource'))
  })

  test('二選一射程的 options 也要掃（淨化聖火：近戰 1 或遠程 5）', () => {
    for (const kind of ['melee', 'ranged']) {
      assert.ok(usedVia(`ability-keyword.${kind}`, 'ability.censor.purifying-fire', 'distance.options[].kind'),
        `淨化聖火的 ${kind} 應由 distance.options[].kind 帶出`)
    }
  })

  test('9 個狀態的中文名可追溯到已審核的實體', () => {
    const conds = manifest.entries.filter((e) => e.nameFrom)
    assert.equal(conds.length, 9)
    for (const c of conds) {
      assert.ok(c.zhHant, `${c.id} 缺中文名`)
      assert.equal(c.nameFrom.entityStatus, 'reviewed', `${c.id} 的實體必須已審核`)
      assert.ok(c.nameFrom.reviewedBy, `${c.id} 的實體必須有審核者`)
    }
    assert.equal(manifest.entries.filter((e) => e.zhHant === undefined).length, 0)
  })
})

describe('releases/m0.json · 新鮮度驗證 --check（在暫存副本上操作）', () => {
  /**
   * 把 data/ 與 releases/ 複製到暫存目錄，在**副本**上破壞後執行 --check。
   * 正式工作目錄完全不動。
   */
  function checkOnCopy(mutate) {
    const root = mkdtempSync(resolve(tmpdir(), 'ds-m0rel-'))
    try {
      cpSync(R('data'), resolve(root, 'data'), { recursive: true })
      cpSync(R('releases'), resolve(root, 'releases'), { recursive: true })
      mutate({
        root,
        edit: (rel, fn) => {
          const full = resolve(root, rel)
          const before = readFileSync(full, 'utf8')
          const after = fn(before)
          assert.notEqual(after, before, `${rel}：錨點沒對到，這次測試無效`)
          writeFileSync(full, after, 'utf8')
        },
      })
      return spawnSync(process.execPath, [R('scripts/build-m0-release.mjs'), '--check'],
        { cwd: repoRoot, env: { ...process.env, DS_DATA_ROOT: root }, encoding: 'utf8' })
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  }

  const expectFailure = (r, code, label) => {
    const out = `${r.stdout}${r.stderr}`
    assert.equal(r.status, 1, `${label} 應 exit 1，實際 ${r.status}：${out}`)
    assert.ok(out.includes(`[${code}]`), `${label} 應輸出代號 [${code}]，實際：${out}`)
  }

  test('未破壞的副本 → --check 通過', () => {
    const r = checkOnCopy(() => {})
    assert.equal(r.status, 0, `乾淨副本應通過：${r.stdout}${r.stderr}`)
  })

  test('狀態中文實體改名 → [m0-release-stale]', () => {
    const r = checkOnCopy(({ edit }) => edit('data/zh-Hant/conditions/condition.slowed.json',
      (s) => s.replace('"nameZhHant": "緩速"', '"nameZhHant": "減速"')))
    expectFailure(r, 'm0-release-stale', '實體改名')
  })

  test('狀態中文實體審核狀態被降級 → [entity-not-reviewed]', () => {
    const r = checkOnCopy(({ edit }) => edit('data/zh-Hant/conditions/condition.slowed.json',
      (s) => s.replace('"status": "reviewed"', '"status": "draft"')))
    expectFailure(r, 'entity-not-reviewed', '審核降級')
  })

  test('正典內容變動 → [m0-release-stale]', () => {
    const r = checkOnCopy(({ edit }) => edit('data/canon/abilities/ability.censor.repent.json',
      (s) => s.replace(/"characteristic": "intuition"/g, '"characteristic": "might"')))
    expectFailure(r, 'm0-release-stale', '正典變動')
  })

  test('結構欄位用到詞彙表沒有的值 → [controlled-value-undefined]', () => {
    const r = checkOnCopy(({ edit }) => edit('data/canon/abilities/ability.censor.judgment.json',
      (s) => s.replace('"keywords": ["magic", "ranged"]', '"keywords": ["magic", "ranged", "nonexistent"]')))
    expectFailure(r, 'controlled-value-undefined', '未定義的受控值')
  })

  test('已提交的 m0.json 被刪除 → [m0-release-missing]', () => {
    const r = checkOnCopy(({ root }) => rmSync(resolve(root, 'releases/m0.json')))
    expectFailure(r, 'm0-release-missing', '清單不存在')
  })
})

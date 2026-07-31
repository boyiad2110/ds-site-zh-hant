/**
 * `verify-zh-structure.mjs` 的持久化測試。
 *
 * **為什麼要有這個檔**：第一批的 `effect` 漏洞與第二批的 `flavor` 漏洞，
 * 當時都只在 `os.tmpdir()` 的暫存副本上手動破壞驗過一次，沒有留下測試。
 * 結果第三批又發現同一類漏洞（trigger／extraCosts／followUpActions）。
 * 手動測試不會在下一輪自動再跑，等於沒有防線。**本檔把破壞情境固定下來。**
 *
 * 全部在 os.tmpdir() 的 fixture 上執行，**不觸碰正式 repository 資料**
 * （透過 DS_DATA_ROOT，見 scripts/lib/root.mjs）。
 *
 * 每個測試的形狀都一樣：先造一份「正典 ＋ 對得上的中文」，確認通過（exit 0），
 * 再破壞中文的某一處，確認被抓到（exit 1）。
 * **通過那一半不可省略**——否則無法分辨「抓到了」與「不管給什麼都失敗」。
 */
import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const scriptsDir = dirname(fileURLToPath(import.meta.url))

/** 正典：一個涵蓋 trigger／extraCosts／followUpActions 的招式（結構取自審判與捨己為人） */
const CANON = {
  id: 'ability.test.subject',
  type: 'ability',
  name: 'Test Subject',
  flavor: 'Flavor text.',
  keywords: ['magic', 'ranged'],
  actionType: 'triggered',
  distance: { kind: 'ranged', value: 10, raw: 'Ranged 10' },
  target: 'Self or one ally',
  trigger: 'The target starts their turn.',
  powerRoll: {
    characteristic: 'might',
    tiers: [
      {
        threshold: '≤11',
        text: '2 + M damage',
        potency: { characteristic: 'presence', level: 'weak', effect: 'The target is slowed (save ends).' },
      },
    ],
  },
  effect: ['Effect paragraph one.'],
  extraCosts: [
    { resource: 'wrath', value: 1, effect: 'Extra cost effect.', raw: 'Spend 1 Wrath: Extra cost effect.' },
  ],
  conditionalEffects: [
    {
      trigger: 'The target makes a strike.',
      optional: true,
      cost: { resource: 'wrath', value: 3 },
      effect: 'Change the target of the strike.',
    },
  ],
  followUpActions: [
    {
      actionType: 'free-triggered',
      lead: 'You can spend 1 wrath to take one of the following:',
      options: ['Option A.', 'Option B.', 'Option C.'],
      constraint: 'Only one at a time.',
    },
  ],
  abilityCategory: 'inherent',
  level: 1,
}

/** 中文：與上面逐段對得上 */
const ZH_OK = {
  id: 'ability.test.subject',
  nameZhHant: '測試招式',
  flavor: '敘述文字。',
  trigger: '當目標開始回合時。',
  powerRoll: {
    tiers: [{ threshold: '≤11', text: '2 + `力量`傷害', potencyEffect: '目標陷入緩速（豁免解除）。' }],
  },
  effect: ['效果第一段。'],
  extraCosts: [{ effect: '追加花費的效果。' }],
  conditionalEffects: [{ trigger: '目標發動打擊。', effect: '改變該次打擊的目標。' }],
  followUpActions: [
    {
      lead: '你可以花費 1 點`怒火`來執行以下 1 項：',
      options: ['選項甲。', '選項乙。', '選項丙。'],
      constraint: '每次只能選 1 項。',
    },
  ],
  meta: { status: 'draft' },
  canonRef: { id: 'ability.test.subject' },
}

const clone = (o) => JSON.parse(JSON.stringify(o))

/**
 * 造 fixture 並跑 verify-zh-structure。
 * @param mutate 對中文檔做破壞；回傳 false 代表整個中文檔不寫入
 * @param canonMutate 對正典做調整（測「正典沒有這些欄位時不誤報」用）
 */
function run(mutate = (z) => z, canonMutate = (c) => c) {
  const root = mkdtempSync(resolve(tmpdir(), 'ds-zh-'))
  try {
    mkdirSync(resolve(root, 'data/canon/abilities'), { recursive: true })
    mkdirSync(resolve(root, 'data/zh-Hant/abilities'), { recursive: true })
    const canon = canonMutate(clone(CANON))
    const zh = mutate(clone(ZH_OK))
    writeFileSync(resolve(root, 'data/canon/abilities/a.json'), JSON.stringify(canon), 'utf8')
    writeFileSync(resolve(root, 'data/zh-Hant/abilities/a.json'), JSON.stringify(zh), 'utf8')
    const r = spawnSync(process.execPath, [resolve(scriptsDir, 'verify-zh-structure.mjs')], {
      env: { ...process.env, DS_DATA_ROOT: root },
      encoding: 'utf8',
    })
    return { status: r.status, out: r.stdout + r.stderr }
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
}

describe('verify-zh-structure：trigger／extraCosts／followUpActions', () => {

  test('0. 基準：中文與正典對得上時通過（沒有這一項就分不出「抓到」與「一律失敗」）', () => {
    const r = run()
    assert.equal(r.status, 0, r.out)
  })

  test('1. 缺 trigger 必失敗', () => {
    const r = run((z) => { delete z.trigger; return z })
    assert.equal(r.status, 1, r.out)
    assert.ok(r.out.includes('trigger'), r.out)
  })

  test('2. trigger 是空字串必失敗', () => {
    const r = run((z) => { z.trigger = '   '; return z })
    assert.equal(r.status, 1, r.out)
    assert.ok(r.out.includes('trigger'), r.out)
  })

  test('3. 缺一個 extraCost 必失敗', () => {
    const r = run((z) => { z.extraCosts = []; return z })
    assert.equal(r.status, 1, r.out)
    assert.ok(r.out.includes('extraCosts 數量不符'), r.out)
  })

  test('4. 完全沒有 extraCosts 欄位必失敗（不可因 length 0 而短路）', () => {
    const r = run((z) => { delete z.extraCosts; return z })
    assert.equal(r.status, 1, r.out)
    assert.ok(r.out.includes('extraCosts 數量不符'), r.out)
  })

  test('5. extraCosts[].effect 是空字串必失敗', () => {
    const r = run((z) => { z.extraCosts[0].effect = ''; return z })
    assert.equal(r.status, 1, r.out)
    assert.ok(r.out.includes('extraCosts[0].effect'), r.out)
  })

  test('6. 缺一個 follow-up option 必失敗（審判有 4 個，少 1 個原本毫無徵兆）', () => {
    const r = run((z) => { z.followUpActions[0].options.pop(); return z })
    assert.equal(r.status, 1, r.out)
    assert.ok(r.out.includes('options 數量不符'), r.out)
  })

  test('7. 完全沒有 followUpActions 欄位必失敗', () => {
    const r = run((z) => { delete z.followUpActions; return z })
    assert.equal(r.status, 1, r.out)
    assert.ok(r.out.includes('followUpActions 數量不符'), r.out)
  })

  test('8. 缺 lead 必失敗', () => {
    const r = run((z) => { delete z.followUpActions[0].lead; return z })
    assert.equal(r.status, 1, r.out)
    assert.ok(r.out.includes('lead'), r.out)
  })

  test('9. 缺 constraint 必失敗', () => {
    const r = run((z) => { z.followUpActions[0].constraint = ''; return z })
    assert.equal(r.status, 1, r.out)
    assert.ok(r.out.includes('constraint'), r.out)
  })

  test('10. 正典沒有這些欄位時不誤報（大多數招式屬此類）', () => {
    const r = run(
      (z) => {
        delete z.trigger
        delete z.extraCosts
        delete z.followUpActions
        return z
      },
      (c) => {
        delete c.trigger
        c.extraCosts = []          // 正典的常見寫法：空陣列而非省略
        delete c.followUpActions
        return c
      },
    )
    assert.equal(r.status, 0, r.out)
  })

  test('11. 正典 extraCosts 為空陣列、中文卻多出一個 → 失敗（extra 也要抓）', () => {
    const r = run((z) => z, (c) => { c.extraCosts = []; return c })
    assert.equal(r.status, 1, r.out)
    assert.ok(r.out.includes('extraCosts 數量不符'), r.out)
  })
})

describe('verify-zh-structure：陣列元素的空字串（數量對、內容空）', () => {

  // 只比數量的檢查擋不住這一類：段落在、內容是空的。
  // 對讀者而言與整段漏譯完全一樣，而且同樣沒有任何徵兆。

  test('15. effect 段落數一致、但內容是空字串 → 失敗', () => {
    const r = run((z) => { z.effect[0] = ''; return z })
    assert.equal(r.status, 1, r.out)
    assert.ok(r.out.includes('effect[0]'), r.out)
  })

  test('16. effect 段落是空白字元 → 失敗（trim 後仍算空）', () => {
    const r = run((z) => { z.effect[0] = '   　'; return z })
    assert.equal(r.status, 1, r.out)
    assert.ok(r.out.includes('effect[0]'), r.out)
  })

  test('17. follow-up options 數量一致、但其中一個是空字串 → 失敗', () => {
    const r = run((z) => { z.followUpActions[0].options[1] = ''; return z })
    assert.equal(r.status, 1, r.out)
    assert.ok(r.out.includes('options[1]'), r.out)
  })

  test('18. follow-up options 其中一個不是字串（型別錯） → 失敗', () => {
    const r = run((z) => { z.followUpActions[0].options[2] = null; return z })
    assert.equal(r.status, 1, r.out)
    assert.ok(r.out.includes('options[2]'), r.out)
  })
})

describe('verify-zh-structure：陣列欄位的型別（字串冒充陣列）', () => {

  // 字串同樣有 .length 與數字索引。`effect: "x"` 會冒充成「1 段、內容是 x」——
  // 長度對得上、元素也是非空字串，數量檢查與非空檢查**全部通過**。
  // 沒有 Array.isArray 這一關，這類錯誤完全靜默。

  test('19. effect 是字串而非陣列 → 失敗', () => {
    const r = run((z) => { z.effect = 'Effect paragraph one.'; return z })
    assert.equal(r.status, 1, r.out)
    assert.ok(r.out.includes('effect 必須是陣列'), r.out)
  })

  test('20. followUpActions[0].options 是字串（長度剛好等於選項數）→ 失敗', () => {
    // 'abc'.length === 3，與正典的 3 個選項相同；每個字元也都是非空字串
    const r = run((z) => { z.followUpActions[0].options = 'abc'; return z })
    assert.equal(r.status, 1, r.out)
    assert.ok(r.out.includes('options 必須是陣列'), r.out)
  })

  test('21. extraCosts 是字串 → 失敗', () => {
    const r = run((z) => { z.extraCosts = 'x'; return z })
    assert.equal(r.status, 1, r.out)
    assert.ok(r.out.includes('extraCosts 必須是陣列'), r.out)
  })

  test('22. followUpActions 是物件（不是陣列）→ 失敗', () => {
    const r = run((z) => { z.followUpActions = { lead: 'x', options: [], constraint: 'y' }; return z })
    assert.equal(r.status, 1, r.out)
    assert.ok(r.out.includes('followUpActions 必須是陣列'), r.out)
  })

  test('23. powerRoll.tiers 是字串 → 失敗', () => {
    const r = run(
      (z) => { z.powerRoll = { tiers: 'abc' }; return z },
      (c) => {
        c.powerRoll = { characteristic: 'might', tiers: [
          { threshold: '≤11', text: 'a' }, { threshold: '12-16', text: 'b' }, { threshold: '17+', text: 'c' },
        ] }
        return c
      },
    )
    assert.equal(r.status, 1, r.out)
    assert.ok(r.out.includes('powerRoll.tiers 必須是陣列'), r.out)
  })
})

describe('verify-zh-structure：Potency 與 conditionalEffects', () => {
  test('Potency 基本結果與條件效果都有翻譯時通過', () => {
    const r = run()
    assert.equal(r.status, 0, r.out)
  })

  test('有 potency.effect 卻缺 potencyEffect 必失敗', () => {
    const r = run((z) => { delete z.powerRoll.tiers[0].potencyEffect; return z })
    assert.equal(r.status, 1, r.out)
    assert.ok(r.out.includes('potencyEffect'), r.out)
  })

  test('正典 potency 缺 effect 必失敗', () => {
    const r = run((z) => z, (c) => { delete c.powerRoll.tiers[0].potency.effect; return c })
    assert.equal(r.status, 1, r.out)
    assert.ok(r.out.includes('potency.effect'), r.out)
  })

  test('conditionalEffects 數量不符必失敗', () => {
    const r = run((z) => { z.conditionalEffects = []; return z })
    assert.equal(r.status, 1, r.out)
    assert.ok(r.out.includes('conditionalEffects 數量不符'), r.out)
  })

  test('conditionalEffects trigger 或 effect 為空必失敗', () => {
    for (const key of ['trigger', 'effect']) {
      const r = run((z) => { z.conditionalEffects[0][key] = ''; return z })
      assert.equal(r.status, 1, r.out)
      assert.ok(r.out.includes(`conditionalEffects[0].${key}`), r.out)
    }
  })

  test('conditionalEffects 不是陣列必失敗', () => {
    const r = run((z) => { z.conditionalEffects = 'x'; return z })
    assert.equal(r.status, 1, r.out)
    assert.ok(r.out.includes('conditionalEffects 必須是陣列'), r.out)
  })
})

describe('verify-zh-structure：先前兩輪修掉的漏洞（回歸測試）', () => {

  test('12. 正典有 effect、中文完全沒有 → 失敗（第一批修掉的漏洞）', () => {
    const r = run((z) => { delete z.effect; return z })
    assert.equal(r.status, 1, r.out)
    assert.ok(r.out.includes('effect 段落數不符'), r.out)
  })

  test('13. 正典有 flavor、中文完全沒有 → 失敗（第二批修掉的漏洞）', () => {
    const r = run((z) => { delete z.flavor; return z })
    assert.equal(r.status, 1, r.out)
    assert.ok(r.out.includes('flavor'), r.out)
  })

  test('14. 正典 flavor 為 null、中文省略 → 不誤報（基礎打擊屬此類）', () => {
    const r = run((z) => { delete z.flavor; return z }, (c) => { c.flavor = null; return c })
    assert.equal(r.status, 0, r.out)
  })
})

/** feature 型別的 bulletList 區塊：2026-07-31 補上，先前只驗過 definitionList，
 * 因為 M0 沒有任何條目用到 bulletList（見 docs/translation-guide.md §4.7(3)）。 */
describe('verify-zh-structure：feature 的 bulletList 區塊', () => {
  const FEATURE_CANON = {
    id: 'feature.test.resource',
    type: 'feature',
    name: 'Test Resource',
    sections: [{
      heading: 'Test in Combat',
      blocks: [{
        kind: 'bulletList',
        lead: 'If you pray, your roll gains the following additional effects:',
        items: ['If the roll is a 1, effect A.', 'If the roll is a 2, effect B.', 'If the roll is a 3, effect C.'],
      }],
    }],
    origin: { kind: 'class', id: 'class.test' },
    level: 1,
  }
  const FEATURE_ZH_OK = {
    id: 'feature.test.resource',
    nameZhHant: '測試資源',
    sections: [{
      heading: '測試·戰鬥中',
      blocks: [{
        kind: 'bulletList',
        lead: '若你祈禱，你的擲骰獲得下列額外效果：',
        items: ['若擲骰結果為 1，效果甲。', '若擲骰結果為 2，效果乙。', '若擲骰結果為 3，效果丙。'],
      }],
    }],
    meta: { status: 'draft' },
    canonRef: { id: 'feature.test.resource' },
  }

  function runFeature(mutate = (z) => z) {
    const root = mkdtempSync(resolve(tmpdir(), 'ds-zh-feature-'))
    try {
      mkdirSync(resolve(root, 'data/canon/features'), { recursive: true })
      mkdirSync(resolve(root, 'data/zh-Hant/features'), { recursive: true })
      const zh = mutate(clone(FEATURE_ZH_OK))
      writeFileSync(resolve(root, 'data/canon/features/f.json'), JSON.stringify(FEATURE_CANON), 'utf8')
      writeFileSync(resolve(root, 'data/zh-Hant/features/f.json'), JSON.stringify(zh), 'utf8')
      const r = spawnSync(process.execPath, [resolve(scriptsDir, 'verify-zh-structure.mjs')], {
        env: { ...process.env, DS_DATA_ROOT: root },
        encoding: 'utf8',
      })
      return { status: r.status, out: r.stdout + r.stderr }
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  }

  test('0. 基準：bulletList 對得上時通過', () => {
    const r = runFeature()
    assert.equal(r.status, 0, r.out)
  })

  test('1. bulletList 少一個 item → 失敗（原文 3 個祈禱結果，少譯一個原本毫無徵兆）', () => {
    const r = runFeature((z) => { z.sections[0].blocks[0].items = z.sections[0].blocks[0].items.slice(0, 2); return z })
    assert.equal(r.status, 1, r.out)
    assert.match(r.out, /項目數不符/)
  })

  test('2. bulletList 其中一個 item 是空字串 → 失敗', () => {
    const r = runFeature((z) => { z.sections[0].blocks[0].items[1] = ''; return z })
    assert.equal(r.status, 1, r.out)
    assert.match(r.out, /缺漏或為空字串/)
  })

  test('3. bulletList 缺 lead → 失敗', () => {
    const r = runFeature((z) => { z.sections[0].blocks[0].lead = ''; return z })
    assert.equal(r.status, 1, r.out)
    assert.match(r.out, /缺 lead/)
  })

  test('4. bulletList items 是字串而非陣列（長度剛好等於項目數）→ 失敗', () => {
    const r = runFeature((z) => { z.sections[0].blocks[0].items = 'abc'; return z })
    assert.equal(r.status, 1, r.out)
    assert.match(r.out, /必須是陣列/)
  })
})

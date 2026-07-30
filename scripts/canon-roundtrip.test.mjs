/**
 * round-trip 驗證與共用轉換層的測試。
 *
 * 重點不是「目前資料是乾淨的」（那由 verify-canon-roundtrip.mjs 在 CI 守著），
 * 而是「這個檢查真的會抓到它該抓的東西」——先前的教訓是驗證腳本寫了卻從不比對。
 */
import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import {
  characteristicLabel, composeCharacteristic, composeDistance, composeExtraCost, composePotencyMark,
  composeTier, distanceLabel, normalizeForCompare, parseRichText, plainText, targetLabel,
} from '../shared/canon-format.mjs'

test('characteristicLabel：字串與 choice 物件都要處理', () => {
  assert.equal(characteristicLabel('might'), '力量')
  assert.equal(characteristicLabel('might', 'en'), 'Might')
  // 兩個基礎打擊是這個形狀；曾因為直接丟進 JSX 而讓整頁空白
  const choice = { kind: 'choice', options: ['might', 'agility'], raw: 'Might or Agility' }
  assert.equal(characteristicLabel(choice), '力量或敏捷')
  assert.equal(characteristicLabel(choice, 'en'), 'Might or Agility')
  assert.equal(characteristicLabel(null), '')
})

test('distanceLabel：近戰／遠程／區域／二選一', () => {
  assert.equal(distanceLabel({ kind: 'melee', value: 1 }), '近戰 1')
  assert.equal(distanceLabel({ kind: 'area', area: { shape: 'cube', size: 2, within: 1 } }), '1 格內 2 立方')
  assert.equal(distanceLabel({
    kind: 'choice',
    options: [{ kind: 'melee', value: 1 }, { kind: 'ranged', value: 5 }],
  }), '近戰 1 或 遠程 5')
})

test('targetLabel：查得到用中文，查不到原樣輸出', () => {
  assert.equal(targetLabel('One enemy'), '1 個敵人')
  assert.equal(targetLabel('Something unmapped'), 'Something unmapped')
})

test('parseRichText：術語、屬性、實體連結', () => {
  const tokens = parseRichText('造成 `力量` 傷害，並參照 [審判](ability.censor.judgment) 與 `體力`')
  assert.deepEqual(tokens.filter((t) => t.kind === 'term').map((t) => [t.text, t.isAttribute]),
    [['力量', true], ['體力', false]])
  assert.deepEqual(tokens.filter((t) => t.kind === 'ref'), [
    { kind: 'ref', text: '審判', id: 'ability.censor.judgment' },
  ])
  assert.equal(plainText('造成 `力量` 傷害'), '造成 力量 傷害')
})

test('compose*：結構化欄位組回書上原文', () => {
  assert.equal(composeDistance({ kind: 'ranged', value: 10 }), 'Ranged 10')
  assert.equal(composeDistance({ kind: 'area', area: { shape: 'cube', size: 2, within: 1 } }), '2 cube within 1')
  assert.equal(composeCharacteristic({ kind: 'choice', options: ['might', 'agility'] }), 'Might or Agility')
  assert.equal(composePotencyMark({ characteristic: 'presence', level: 'weak' }), 'P<WEAK')
  assert.equal(
    composeExtraCost({ resource: 'wrath', value: 1, effect: 'You can end one effect.' }),
    'Spend 1 Wrath: You can end one effect.',
  )
})

test('composeTier：有無效力兩種形狀', () => {
  assert.equal(composeTier({ threshold: '≤11', text: '2 神聖傷害；推動 1' }), '2 神聖傷害；推動 1')
  assert.equal(
    composeTier({
      threshold: '≤11',
      text: '2 + M holy damage',
      potency: { characteristic: 'presence', level: 'weak', effect: 'slowed (save ends)' },
    }),
    '2 + M holy damage; P<WEAK, slowed (save ends)',
  )
})

test('normalizeForCompare 只吸收排版差異，不吸收語意差異', () => {
  const raw = '2 + M holy damage; P<WEAK , slowed (save ends)'
  assert.equal(normalizeForCompare(raw), normalizeForCompare('2 + M holy damage; p<weak, Slowed (save ends).'))
  // 這正是 2026-07-31 抓到的多寫，必須維持「不相等」
  assert.notEqual(normalizeForCompare(raw), normalizeForCompare('2 + M holy damage; P<WEAK, The target is slowed (save ends).'))
  // 改寫（them → the target）也不得被正規化掉
  assert.notEqual(normalizeForCompare('frightened of them'), normalizeForCompare('frightened of the target'))
})

test('round-trip 會抓到「效力效果被補述」這個實際發生過的缺陷', () => {
  const tier = {
    threshold: '≤11',
    text: '2 + M holy damage',
    potency: { characteristic: 'presence', level: 'weak', effect: 'The target is slowed (save ends).' },
    raw: '2 + M holy damage; P<WEAK, slowed (save ends)',
  }
  assert.notEqual(normalizeForCompare(composeTier(tier)), normalizeForCompare(tier.raw))

  tier.potency.effect = 'slowed (save ends)'
  assert.equal(normalizeForCompare(composeTier(tier)), normalizeForCompare(tier.raw))
})

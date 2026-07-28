import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseCsv, splitAliases, detectAnomalies, termId, conditionId } from './glossary-lib.mjs'

test('parseCsv 處理引號欄位與欄內逗號', () => {
  const rows = parseCsv('a,b\n"x,1",y\n')
  assert.deepEqual(rows, [['a', 'b'], ['x,1', 'y']])
})

test('parseCsv 處理跳脫雙引號', () => {
  assert.deepEqual(parseCsv('"he said ""hi""",z\n'), [['he said "hi"', 'z']])
})

test('splitAliases 以全形與半形分號拆分', () => {
  assert.deepEqual(
    splitAliases('Invincible；Iron Saint；Overlord；Sky Tyrant').values,
    ['Invincible', 'Iron Saint', 'Overlord', 'Sky Tyrant']
  )
  assert.deepEqual(splitAliases('a;b').values, ['a', 'b'])
})

test('splitAliases 不以逗號拆分（名稱本身可能含逗號）', () => {
  assert.deepEqual(splitAliases('Ajax, the Invincible').values, ['Ajax, the Invincible'])
})

test('splitAliases 去空值、去重、保留順序', () => {
  assert.deepEqual(splitAliases(' b ；； a ；b').values, ['b', 'a'])
})

test('splitAliases 空輸入回傳空陣列', () => {
  assert.deepEqual(splitAliases('').values, [])
  assert.deepEqual(splitAliases(undefined).values, [])
})

test('addedBySplit 計算「實際新增」元素數，非拆分後總數', () => {
  assert.equal(splitAliases('a；b；c').addedBySplit, 2)   // 1 筆 → 3 筆，新增 2
  assert.equal(splitAliases('only').addedBySplit, 0)      // 未拆分，新增 0
  assert.equal(splitAliases('').addedBySplit, 0)
  assert.equal(splitAliases('a；a').addedBySplit, 0)       // 去重後仍 1 筆
})

test('detectAnomalies 抓出中文落在 aliasesEn', () => {
  const a = detectAnomalies({ en: 'Aurumvas', zhHant: '奧倫瓦斯', aliasesEn: ['惡魔領主'], aliasesZhHant: [] })
  assert.equal(a.length, 1)
  assert.equal(a[0].issue, 'cjk-in-alias-en')
})

test('detectAnomalies 抓出英文落在 aliasesZhHant', () => {
  const a = detectAnomalies({ en: 'X', zhHant: '甲', aliasesEn: [], aliasesZhHant: ['Overlord'] })
  assert.equal(a[0].issue, 'ascii-in-alias-zh')
})

test('detectAnomalies 抓出 alias 與正式名相同', () => {
  const a = detectAnomalies({ en: 'Fire', zhHant: '火焰', aliasesEn: ['Fire'], aliasesZhHant: ['火焰'] })
  assert.equal(a.filter((x) => x.issue === 'alias-equals-name').length, 2)
})

test('detectAnomalies 抓出同一別名出現在中英兩欄', () => {
  const a = detectAnomalies({ en: 'X', zhHant: '甲', aliasesEn: ['Zed'], aliasesZhHant: ['Zed'] })
  assert.ok(a.some((x) => x.issue === 'alias-in-both-fields'))
})

test('detectAnomalies 正常資料不產生警告', () => {
  assert.deepEqual(
    detectAnomalies({ en: 'Slowed', zhHant: '緩速', aliasesEn: [], aliasesZhHant: ['減速'] }),
    []
  )
})

test('termId 生成與 sense 後綴', () => {
  assert.equal(termId('Save Ends'), 'term.save-ends')
  assert.equal(termId('Effect', 'rules-effect'), 'term.effect.rules-effect')
  assert.equal(termId('EoT'), 'term.eot')
})

test('conditionId 對應狀態實體', () => {
  assert.equal(conditionId('Slowed'), 'condition.slowed')
  assert.equal(conditionId('Save Ends'), 'condition.save-ends')
})

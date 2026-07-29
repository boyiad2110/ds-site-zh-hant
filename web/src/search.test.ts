import { describe, expect, test } from 'vitest'
import catalogData from '../public/data/catalog.m0.json'
import { applyFilters, normalizeSearch, searchTokens } from './search'
import type { Catalog, Filters } from './types'

const catalog = catalogData as unknown as Catalog
const empty = { type: '', category: '', action: '', cost: '', level: '', keyword: '' } satisfies Filters

describe('繁中搜尋與篩選', () => {
  test('NFKC 正規化並移除規則標點', () => {
    expect(normalizeSearch('【審判】 Judgment!')).toBe('審判 judgment')
  })

  test('中文字串建立單字與雙字詞索引', () => {
    const tokens = searchTokens('當場拘捕')
    expect(tokens).toEqual(expect.arrayContaining(['當', '拘', '當場', '拘捕']))
  })

  test('繁中名稱、英文名稱與兩字搜尋都能找到條目', () => {
    expect(applyFilters(catalog.entries, '當場拘捕', empty)[0].id).toBe('ability.censor.arrest')
    expect(applyFilters(catalog.entries, 'Arrest', empty)[0].id).toBe('ability.censor.arrest')
    expect(applyFilters(catalog.entries, '拘捕', empty)[0].id).toBe('ability.censor.arrest')
  })

  test('組合篩選只留下 5 怒火英雄招式', () => {
    const results = applyFilters(catalog.entries, '', { ...empty, type: 'ability', category: 'heroic', cost: '5' })
    expect(results).toHaveLength(4)
    expect(results.every((entry) => entry.tags.cost?.value === 5 && entry.tags.abilityCategory === 'heroic')).toBe(true)
  })

  test('無怒火成本使用 0 作為網址篩選值', () => {
    const results = applyFilters(catalog.entries, '', { ...empty, type: 'ability', cost: '0' })
    expect(results.length).toBeGreaterThan(0)
    expect(results.every((entry) => entry.tags.cost === null)).toBe(true)
  })
})

describe('M0 catalog', () => {
  test('正好包含 16 招式、9 狀態、3 特性', () => {
    expect(catalog.counts).toEqual({ total: 28, abilities: 16, conditions: 9, features: 3 })
  })

  test('路由與 id 唯一且所有條目都有繁中名稱', () => {
    expect(new Set(catalog.entries.map((entry) => entry.id)).size).toBe(28)
    expect(new Set(catalog.entries.map((entry) => `${entry.type}/${entry.slug}`)).size).toBe(28)
    expect(catalog.entries.every((entry) => entry.name.zhHant.length > 0)).toBe(true)
  })

  test('Arrest 與 Potency 使用新結構', () => {
    const arrest = catalog.entries.find((entry) => entry.id === 'ability.censor.arrest')!
    expect(arrest.content.canon.conditionalEffects).toHaveLength(1)
    expect(arrest.content.zhHant.conditionalEffects[0].trigger).toContain('擒制')
    const justice = catalog.entries.find((entry) => entry.id === 'ability.censor.behold-the-face-of-justice')!
    expect(justice.content.canon.powerRoll.tiers[0].text).not.toContain('if the target')
    expect(justice.content.canon.powerRoll.tiers[0].potency.effect).toBeTruthy()
    expect(justice.content.zhHant.powerRoll.tiers[0].potencyEffect).toBeTruthy()
  })
})

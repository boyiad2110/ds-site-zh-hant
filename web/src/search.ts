import type { CatalogEntry, Filters } from './types'

const isHan = (character: string) => /\p{Script=Han}/u.test(character)

export function normalizeSearch(value: string): string {
  return value
    .normalize('NFKC')
    .toLocaleLowerCase('zh-Hant')
    .replace(/[「」『』【】〈〉《》`'“”‘’]/g, '')
    .replace(/[^\p{Letter}\p{Number}]+/gu, ' ')
    .trim()
}

export function searchTokens(value: string): string[] {
  const normalized = normalizeSearch(value)
  const tokens = new Set(normalized.split(/\s+/).filter(Boolean))
  const hanRuns = normalized.match(/[\p{Script=Han}]+/gu) ?? []
  for (const run of hanRuns) {
    for (const character of run) tokens.add(character)
    for (let index = 0; index < run.length - 1; index += 1) tokens.add(run.slice(index, index + 2))
  }
  return [...tokens]
}

function queryMatches(entry: CatalogEntry, query: string): { matches: boolean; score: number } {
  const normalizedQuery = normalizeSearch(query)
  if (!normalizedQuery) return { matches: true, score: 0 }
  const nameZh = normalizeSearch(entry.name.zhHant)
  const nameEn = normalizeSearch(entry.name.en)
  const aliases = [...entry.aliases.zhHant, ...entry.aliases.en].map(normalizeSearch)
  const haystack = normalizeSearch(entry.searchText)
  const queryParts = normalizedQuery.split(/\s+/).filter(Boolean)
  const tokens = searchTokens(entry.searchText)

  const matches = queryParts.every((part) => {
    if (haystack.includes(part)) return true
    if ([...part].some(isHan)) return searchTokens(part).every((token) => tokens.includes(token))
    return false
  })
  if (!matches) return { matches: false, score: -1 }

  let score = 0
  if (nameZh === normalizedQuery || nameEn === normalizedQuery) score += 100
  if (nameZh.startsWith(normalizedQuery) || nameEn.startsWith(normalizedQuery)) score += 60
  if (aliases.some((alias) => alias === normalizedQuery)) score += 50
  if (nameZh.includes(normalizedQuery) || nameEn.includes(normalizedQuery)) score += 30
  score += queryParts.filter((part) => haystack.includes(part)).length * 3
  return { matches: true, score }
}

export function applyFilters(entries: CatalogEntry[], query: string, filters: Filters): CatalogEntry[] {
  return entries
    .map((entry) => ({ entry, result: queryMatches(entry, query) }))
    .filter(({ entry, result }) => result.matches
      && (!filters.type || entry.type === filters.type)
      && (!filters.category || entry.tags.abilityCategory === filters.category)
      && (!filters.action || entry.tags.actionType === filters.action)
      && (!filters.cost || String(entry.tags.cost?.value ?? 0) === filters.cost)
      && (!filters.level || String(entry.level ?? '') === filters.level)
      && (!filters.keyword || entry.tags.keywords.includes(filters.keyword)))
    .sort((a, b) => b.result.score - a.result.score || a.entry.name.zhHant.localeCompare(b.entry.name.zhHant, 'zh-Hant'))
    .map(({ entry }) => entry)
}

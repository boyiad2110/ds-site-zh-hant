import type { CatalogEntry } from './types'

export const COMPENDIUM_PATH = '/compendium'
export const COMPENDIUM_SEARCH_PATH = '/compendium/search'
export const CLASS_INDEX_PATH = '/compendium/classes'

export function isCompendiumSearchPage(pathname: string): boolean {
  return pathname === COMPENDIUM_PATH || pathname === COMPENDIUM_SEARCH_PATH
}

export function buildSearchRoute(params?: URLSearchParams | Record<string, string>): string {
  if (!params) return COMPENDIUM_SEARCH_PATH
  const search = params instanceof URLSearchParams ? new URLSearchParams(params) : new URLSearchParams(params)
  const query = search.toString()
  return query ? `${COMPENDIUM_SEARCH_PATH}?${query}` : COMPENDIUM_SEARCH_PATH
}

export function buildEntryRoute(entry: Pick<CatalogEntry, 'type' | 'slug'>): string {
  return `${COMPENDIUM_PATH}/${entry.type}/${entry.slug}`
}

export function buildClassRoute(classId: string): string {
  return `${CLASS_INDEX_PATH}/${encodeURIComponent(classId)}`
}

export function buildClassEntryRoute(classId: string, entry: Pick<CatalogEntry, 'type' | 'slug'>): string {
  return `${buildClassRoute(classId)}/${entry.type}/${entry.slug}`
}

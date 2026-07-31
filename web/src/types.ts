export type EntryType = 'ability' | 'condition' | 'feature'

export interface CatalogEntry {
  id: string
  type: EntryType
  slug: string
  name: { zhHant: string; en: string }
  aliases: { zhHant: string[]; en: string[] }
  summary: string
  origin: { kind: string; id: string } | null
  level: number | null
  tags: {
    keywords: string[]
    actionType: string | null
    abilityCategory: string | null
    cost: { resource: string; value: number } | null
  }
  reviewStatus: { canon: string; zhHant: string }
  source: { document: string; version: string; pdfPage: number; printedPage: number; checkedAt: string }
  relatedIds: string[]
  searchText: string
  content: { canon: Record<string, any>; zhHant: Record<string, any> }
}

export interface Catalog {
  milestones: string[]
  sourceFingerprints: Record<string, string>
  counts: { total: number; abilities: number; conditions: number; features: number }
  labels: Record<string, Record<string, { en: string; zhHant: string; aliasesZhHant?: string[] }>>
  terms: Record<string, { id: string; en: string; zhHant: string; aliasesEn: string[]; aliasesZhHant: string[] }>
  entries: CatalogEntry[]
}

export interface Filters {
  type: string
  category: string
  action: string
  cost: string
  level: string
  keyword: string
}

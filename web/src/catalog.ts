import type { Catalog } from './types'

let cache: Promise<Catalog> | null = null

export function loadCatalog(): Promise<Catalog> {
  if (!cache) {
    cache = fetch('/data/catalog.json').then(async (response) => {
      if (!response.ok) throw new Error(`規則資料載入失敗（${response.status}）`)
      return response.json() as Promise<Catalog>
    })
  }
  return cache
}

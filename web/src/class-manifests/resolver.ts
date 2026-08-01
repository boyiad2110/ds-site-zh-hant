import type { Catalog, CatalogEntry } from '../types'
import { buildClassEntryRoute, buildEntryRoute } from '../routes'
import type { ClassManifest, ClassManifestRegistry } from './types'

export function manifestEntryIds(manifest: ClassManifest): ReadonlySet<string> {
  return new Set(manifest.sections.flatMap((section) => section.entries.map((entry) => entry.id)))
}

export function manifestContainsEntry(manifest: ClassManifest, entryId: string): boolean {
  return manifest.sections.some((section) => section.entries.some((item) => item.id === entryId))
}

export function resolveEntryRoute({ currentManifest, entry }: {
  currentManifest?: ClassManifest
  entry: CatalogEntry
}): string {
  return currentManifest && manifestContainsEntry(currentManifest, entry.id)
    ? buildClassEntryRoute(currentManifest.classId, entry)
    : buildEntryRoute(entry)
}

export type ResolvedClassEntry = { manifest: ClassManifest; entry: CatalogEntry }

export function resolveClassEntry({ registry, catalog, classId, type, slug }: {
  registry: ClassManifestRegistry
  catalog: Catalog
  classId?: string
  type?: string
  slug?: string
}): ResolvedClassEntry | null {
  if (!classId || !type || !slug) return null
  const manifest = registry[classId]
  if (!manifest) return null
  const entry = catalog.entries.find((item) => item.type === type && item.slug === slug)
  if (!entry || !manifestContainsEntry(manifest, entry.id)) return null
  return { manifest, entry }
}

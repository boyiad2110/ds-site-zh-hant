export type EntryPresentation = 'summary' | 'expanded'

export type ManifestEntry = {
  id: string
  presentation?: EntryPresentation
}

export type EntrySection = {
  kind: 'entries'
  id: string
  heading: string
  entries: readonly ManifestEntry[]
}

// Phase 1A 只有 entries；日後新增變體時擴充此 union，renderer 以 exhaustiveness check 防漏。
export type ClassSection = EntrySection

export type ClassManifest = {
  classId: string
  name: {
    zhHant: string
    en: string
  }
  scopeNote: string
  sections: readonly ClassSection[]
}

export type ClassManifestRegistry = Readonly<Record<string, ClassManifest>>

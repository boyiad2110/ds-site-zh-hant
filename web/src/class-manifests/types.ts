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

// Sections currently contain entry groups; add new variants with an
// exhaustive renderer check when the presentation model needs to expand.
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

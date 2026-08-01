import type { ClassManifestRegistry } from './types'
import { conduitManifest } from './conduitManifest'

/**
 * Registry is the classId lookup table; classManifestOrder independently
 * controls the player-facing order of class cards and pages.
 */
export const classManifestRegistry: ClassManifestRegistry = Object.freeze({
  [conduitManifest.classId]: conduitManifest,
})
export const classManifestOrder: readonly string[] = Object.freeze([conduitManifest.classId])

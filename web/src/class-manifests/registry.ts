import type { ClassManifestRegistry } from './types'
import { censorManifest } from './censorManifest'
import { conduitManifest } from './conduitManifest'

/**
 * Registry is the classId lookup table; classManifestOrder independently
 * controls the player-facing order of class cards and pages.
 */
export const classManifestRegistry: ClassManifestRegistry = Object.freeze({
  [conduitManifest.classId]: conduitManifest,
  [censorManifest.classId]: censorManifest,
})
export const classManifestOrder: readonly string[] = Object.freeze([conduitManifest.classId, censorManifest.classId])

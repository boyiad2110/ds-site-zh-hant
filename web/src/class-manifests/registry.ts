import type { ClassManifestRegistry } from './types'

/**
 * Phase 1A 不包含正式範型內容，因此 registry 與顯示順序均為空。
 * registry 只負責依 classId 查找；玩家介面的排列順序由 classManifestOrder 明確控制，
 * 不依賴物件 key 的列舉順序。
 */
export const classManifestRegistry: ClassManifestRegistry = Object.freeze({})
export const classManifestOrder: readonly string[] = Object.freeze([])

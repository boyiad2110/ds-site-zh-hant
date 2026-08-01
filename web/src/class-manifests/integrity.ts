import type { Catalog } from '../types'
import type { ClassManifest, ClassManifestRegistry, ClassSection } from './types'

export type ManifestIntegrityIssue = {
  code: 'registry-key-mismatch' | 'empty-section-id' | 'empty-entry-id' | 'duplicate-section-id' | 'duplicate-entry-id' | 'missing-entry' | 'empty-order-id' | 'duplicate-order-id' | 'unknown-order-id' | 'unordered-registry-id'
  message: string
}

export function validateManifestIntegrity(manifest: ClassManifest, catalog: Catalog): ManifestIntegrityIssue[] {
  const issues: ManifestIntegrityIssue[] = []
  const sectionIds = new Set<string>()
  const entryIds = new Set<string>()
  const catalogIds = new Set(catalog.entries.map((entry) => entry.id))

  for (const section of manifest.sections) {
    if (!section.id.trim()) {
      issues.push({ code: 'empty-section-id', message: `${manifest.classId} 的 section id 不得為空` })
    } else if (sectionIds.has(section.id)) {
      issues.push({ code: 'duplicate-section-id', message: `${manifest.classId} 重複使用 section id：${section.id}` })
    }
    if (section.id.trim()) sectionIds.add(section.id)

    const validateSection = {
      entries: () => {
        for (const item of section.entries) {
          if (!item.id.trim()) {
            issues.push({ code: 'empty-entry-id', message: `${manifest.classId} 的條目 ID 不得為空` })
            continue
          }
          if (entryIds.has(item.id)) {
            issues.push({ code: 'duplicate-entry-id', message: `${manifest.classId} 重複收錄條目：${item.id}` })
          }
          entryIds.add(item.id)
          if (!catalogIds.has(item.id)) {
            issues.push({ code: 'missing-entry', message: `${manifest.classId} 收錄不存在的條目：${item.id}` })
          }
        }
      },
    } satisfies Record<ClassSection['kind'], () => void>
    validateSection[section.kind]()
  }
  return issues
}

export function validateRegistryIntegrity(registry: ClassManifestRegistry, order: readonly string[], catalog: Catalog): ManifestIntegrityIssue[] {
  const issues: ManifestIntegrityIssue[] = []
  for (const [key, manifest] of Object.entries(registry)) {
    if (key !== manifest.classId) {
      issues.push({ code: 'registry-key-mismatch', message: `registry key ${key} 與 manifest classId ${manifest.classId} 不一致` })
    }
    issues.push(...validateManifestIntegrity(manifest, catalog))
  }

  const seenOrderIds = new Set<string>()
  for (const classId of order) {
    if (!classId.trim()) {
      issues.push({ code: 'empty-order-id', message: '範型顯示順序中的 classId 不得為空' })
      continue
    }
    if (seenOrderIds.has(classId)) {
      issues.push({ code: 'duplicate-order-id', message: `範型顯示順序重複：${classId}` })
    }
    seenOrderIds.add(classId)
    if (!registry[classId]) {
      issues.push({ code: 'unknown-order-id', message: `範型顯示順序引用不存在的 manifest：${classId}` })
    }
  }
  for (const classId of Object.keys(registry)) {
    if (!seenOrderIds.has(classId)) {
      issues.push({ code: 'unordered-registry-id', message: `registry 中的 manifest 未列入顯示順序：${classId}` })
    }
  }
  return issues
}

export function assertRegistryIntegrity(registry: ClassManifestRegistry, order: readonly string[], catalog: Catalog): void {
  const issues = validateRegistryIntegrity(registry, order, catalog)
  if (issues.length > 0) throw new Error(issues.map((issue) => issue.message).join('\n'))
}

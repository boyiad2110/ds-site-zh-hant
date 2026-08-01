import type { ClassManifest, ClassManifestRegistry } from '../types'

export const fixtureClassManifest: ClassManifest = {
  classId: 'class.fixture',
  name: { zhHant: '測試範型', en: 'Fixture Class' },
  scopeNote: '僅供自動化測試，不屬於正式收錄內容。',
  sections: [
    {
      kind: 'entries',
      id: 'core-abilities',
      heading: '核心招式',
      entries: [
        { id: 'ability.censor.arrest' },
        { id: 'feature.censor.wrath', presentation: 'expanded' },
      ],
    },
    {
      kind: 'entries',
      id: 'conditions',
      heading: '狀態參照',
      entries: [{ id: 'condition.bleeding' }],
    },
  ],
}

export const fixtureAlternateManifest: ClassManifest = {
  classId: 'class.fixture-alternate',
  name: { zhHant: '另一測試範型', en: 'Alternate Fixture Class' },
  scopeNote: '測試範型切換順序。',
  sections: [{ kind: 'entries', id: 'features', heading: '特性', entries: [{ id: 'feature.censor.censor-order' }] }],
}

// 刻意讓 object key 插入順序與玩家顯示順序相反，防止 registry 被誤當排序權威。
export const fixtureRegistry: ClassManifestRegistry = {
  [fixtureClassManifest.classId]: fixtureClassManifest,
  [fixtureAlternateManifest.classId]: fixtureAlternateManifest,
}

export const fixtureOrder = [fixtureAlternateManifest.classId, fixtureClassManifest.classId] as const

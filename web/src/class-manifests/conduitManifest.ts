import type { ClassManifest } from './types'

export const conduitManifest = {
  classId: 'class.conduit',
  name: { zhHant: '神導士', en: 'Conduit' },
  scopeNote: '收錄神導士一級的招式、特性與領域選項，共 41 筆。',
  sections: [
    {
      kind: 'entries',
      id: 'core-resources',
      heading: '虔誠、神明與領域',
      entries: [
        { id: 'feature.conduit.piety', presentation: 'expanded' },
        { id: 'feature.conduit.deity-and-domains', presentation: 'expanded' },
      ],
    },
    {
      kind: 'entries',
      id: 'signature-abilities',
      heading: '招牌招式',
      entries: [
        { id: 'feature.conduit.conduit-abilities', presentation: 'expanded' },
        { id: 'ability.conduit.blessed-light' },
        { id: 'ability.conduit.drain' },
        { id: 'ability.conduit.holy-lash' },
        { id: 'ability.conduit.lightfall' },
        { id: 'ability.conduit.sacrificial-offer' },
        { id: 'ability.conduit.staggering-curse' },
        { id: 'ability.conduit.warriors-prayer' },
        { id: 'ability.conduit.wither' },
      ],
    },
    {
      kind: 'entries',
      id: 'inherent-abilities',
      heading: '固有招式',
      entries: [
        { id: 'ability.conduit.healing-grace' },
        { id: 'ability.conduit.ray-of-wrath' },
      ],
    },
    {
      kind: 'entries',
      id: 'triggered-actions',
      heading: '反應動作',
      entries: [
        { id: 'feature.conduit.triggered-action', presentation: 'expanded' },
        { id: 'ability.conduit.word-of-guidance' },
        { id: 'ability.conduit.word-of-judgment' },
      ],
    },
    {
      kind: 'entries',
      id: 'heroic-abilities',
      heading: '英雄招式',
      entries: [
        { id: 'feature.conduit.heroic-abilities', presentation: 'expanded' },
      ],
    },
    {
      kind: 'entries',
      id: 'three-piety-abilities',
      heading: '3 點虔誠招式',
      entries: [
        { id: 'ability.conduit.call-the-thunder-down' },
        { id: 'ability.conduit.font-of-wrath' },
        { id: 'ability.conduit.judgments-hammer' },
        { id: 'ability.conduit.violence-will-not-aid-thee' },
      ],
    },
    {
      kind: 'entries',
      id: 'five-piety-abilities',
      heading: '5 點虔誠招式',
      entries: [
        { id: 'ability.conduit.corruptions-curse' },
        { id: 'ability.conduit.curse-of-terror' },
        { id: 'ability.conduit.faith-is-our-armor' },
        { id: 'ability.conduit.sermon-of-grace' },
      ],
    },
    {
      kind: 'entries',
      id: 'prayer',
      heading: '禱詞',
      entries: [
        { id: 'feature.conduit.prayer', presentation: 'expanded' },
      ],
    },
    {
      kind: 'entries',
      id: 'conduit-ward',
      heading: '神導士護咒',
      entries: [
        { id: 'feature.conduit.conduit-ward', presentation: 'expanded' },
      ],
    },
    {
      kind: 'entries',
      id: 'domain-piety-and-effects',
      heading: '領域虔誠與效果',
      entries: [
        { id: 'feature.conduit.domain-piety-and-effects', presentation: 'expanded' },
      ],
    },
    {
      kind: 'entries',
      id: 'domain-feature-table',
      heading: '1 級領域特性對照',
      entries: [
        { id: 'feature.conduit.domain-feature-1st-level', presentation: 'expanded' },
      ],
    },
    {
      kind: 'entries',
      id: 'domain-features',
      heading: '具名領域特性',
      entries: [
        { id: 'feature.conduit.domain-feature.blessing-of-compassion' },
        { id: 'feature.conduit.domain-feature.blessing-of-comprehension' },
        { id: 'feature.conduit.domain-feature.sanctified-weapon' },
        { id: 'feature.conduit.domain-feature.blessing-of-fortunate-weather' },
        { id: 'feature.conduit.domain-feature.inner-light' },
        { id: 'feature.conduit.domain-feature.inspired-deception' },
        { id: 'feature.conduit.domain-feature.oracular-visions' },
        { id: 'feature.conduit.domain-feature.protective-circle' },
        { id: 'feature.conduit.domain-feature.revitalizing-ritual' },
      ],
    },
    {
      kind: 'entries',
      id: 'domain-abilities',
      heading: '領域內嵌招式',
      entries: [
        { id: 'ability.conduit.faithful-friend' },
        { id: 'ability.conduit.grave-speech' },
        { id: 'ability.conduit.hands-of-the-maker' },
      ],
    },
  ],
} as const satisfies ClassManifest

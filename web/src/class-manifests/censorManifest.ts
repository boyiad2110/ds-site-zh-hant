import type { ClassManifest } from './types'

export const censorManifest = {
  classId: 'class.censor',
  name: { zhHant: '懲戒者', en: 'Censor' },
  scopeNote: '收錄懲戒者一級的招式與特性，共 17 筆。',
  sections: [
    {
      kind: 'entries',
      id: 'wrath',
      heading: '怒火',
      entries: [
        { id: 'feature.censor.wrath', presentation: 'expanded' },
      ],
    },
    {
      kind: 'entries',
      id: 'censor-order',
      heading: '懲戒者教團',
      entries: [
        { id: 'feature.censor.censor-order', presentation: 'expanded' },
      ],
    },
    {
      kind: 'entries',
      id: 'inherent-abilities',
      heading: '固有招式',
      entries: [
        { id: 'ability.censor.judgment' },
        { id: 'ability.censor.my-life-for-yours' },
      ],
    },
    {
      kind: 'entries',
      id: 'signature-abilities',
      heading: '招牌招式',
      entries: [
        { id: 'ability.censor.back-blasphemer' },
        { id: 'ability.censor.every-step-death' },
        { id: 'ability.censor.halt-miscreant' },
        { id: 'ability.censor.your-allies-cannot-save-you' },
      ],
    },
    {
      kind: 'entries',
      id: 'three-wrath-abilities',
      heading: '3 點怒火招式',
      entries: [
        { id: 'ability.censor.behold-a-shield-of-faith' },
        { id: 'ability.censor.driving-assault' },
        { id: 'ability.censor.repent' },
        { id: 'ability.censor.the-gods-punish-and-defend' },
      ],
    },
    {
      kind: 'entries',
      id: 'five-wrath-abilities',
      heading: '5 點怒火招式',
      entries: [
        { id: 'ability.censor.arrest' },
        { id: 'ability.censor.behold-the-face-of-justice' },
        { id: 'ability.censor.censored' },
        { id: 'ability.censor.purifying-fire' },
      ],
    },
    {
      kind: 'entries',
      id: 'judgment-order-benefit',
      heading: '審判：教團益處',
      entries: [
        { id: 'feature.censor.judgment-order-benefit', presentation: 'expanded' },
      ],
    },
  ],
} as const satisfies ClassManifest

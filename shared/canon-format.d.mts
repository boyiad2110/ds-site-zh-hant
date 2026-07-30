/**
 * canon-format.mjs 的型別宣告。
 *
 * 檔名必須是 `.d.mts`（對應 `.mjs`）—— 叫 `.d.ts` 的話 TypeScript 找不到。
 *
 * 刻意保持精簡：共用層若長到讓這份難以維護，再考慮升級成正式的 TypeScript
 * 套件（2026-07-31 擁有者裁定：現階段不引入 workspace、獨立 package 或額外編譯流程）。
 */

export type Lang = 'zh' | 'en'

export interface Distance {
  kind: string
  value?: number | null
  raw?: string
  options?: Distance[]
  area?: { shape?: string; size?: number; within?: number }
}

export interface Potency {
  characteristic: string
  level: string
  effect?: string
}

export interface CanonTier {
  threshold: string
  text: string
  potency?: Potency | null
  raw?: string
}

export interface ExtraCost {
  resource: string
  value: number
  effect: string
  raw?: string
}

export type Characteristic = string | { kind: 'choice'; options: string[]; raw?: string }

export type RichTextToken =
  | { kind: 'text'; text: string }
  | { kind: 'term'; text: string; isAttribute: boolean }
  | { kind: 'ref'; text: string; id: string }

export declare const GLYPH: { distance: string; target: string }
export declare const TIER_GLYPHS: string[]
export declare const CHARACTERISTICS: Record<string, { zh: string; en: string; mark: string }>
export declare const ATTRIBUTE_NAMES_ZH: Set<string>

export declare function characteristicLabel(value: Characteristic | null | undefined, lang?: Lang): string
export declare function distanceLabel(distance: Distance | null | undefined, lang?: Lang): string
export declare function targetLabel(target: string | null | undefined, lang?: Lang): string
export declare function potencyLabel(
  potency: Potency | null | undefined,
  potencyLevelLabels: Record<string, { en?: string; zh?: string; zhHant?: string }> | undefined,
  lang?: Lang,
): string
export declare function parseRichText(text: string | null | undefined): RichTextToken[]
export declare function plainText(text: string | null | undefined): string

export declare function composeDistance(distance: Distance | null | undefined): string
export declare function composeCharacteristic(value: Characteristic): string
export declare function composeExtraCost(extraCost: ExtraCost): string
export declare function composePotencyMark(potency: Potency): string
export declare function composeTier(tier: CanonTier): string
export declare function normalizeForCompare(text: string | null | undefined): string

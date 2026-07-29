import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const webRoot = resolve(here, '..')
const repoRoot = resolve(webRoot, '..')
const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'))
const walkJson = (dir) => readdirSync(dir)
  .filter((name) => name.endsWith('.json'))
  .sort()
  .map((name) => readJson(resolve(dir, name)))

const groups = ['abilities', 'conditions', 'features']
const canon = groups.flatMap((group) => walkJson(resolve(repoRoot, 'data/canon', group)))
const zh = groups.flatMap((group) => walkJson(resolve(repoRoot, 'data/zh-Hant', group)))
const zhById = new Map(zh.map((entry) => [entry.id, entry]))
const ids = new Set(canon.map((entry) => entry.id))
const release = readJson(resolve(repoRoot, 'releases/m0.json'))

if (canon.length !== 28 || release.scannedCanonEntries !== 28) {
  throw new Error(`M0 必須正好有 28 筆正典資料；目前 canon=${canon.length}, release=${release.scannedCanonEntries}`)
}
if (new Set(canon.map((entry) => entry.id)).size !== canon.length) throw new Error('M0 出現重複 id')
for (const entry of canon) {
  if (!zhById.has(entry.id)) throw new Error(`缺少繁中條目：${entry.id}`)
  if (!entry.source?.normalizedHash) throw new Error(`缺少正典雜湊：${entry.id}`)
}

const vocabFiles = ['ability-keywords', 'action-types', 'ability-categories', 'potency-levels', 'target-components']
const labels = {}
for (const name of vocabFiles) {
  const vocabulary = readJson(resolve(repoRoot, `data/vocabulary/${name}.json`))
  labels[name] = Object.fromEntries(vocabulary.values.map((value) => [value.value, {
    en: value.en,
    zhHant: value.zhHant,
    aliasesZhHant: value.aliasesZhHant ?? [],
  }]))
}

const glossary = readJson(resolve(repoRoot, 'data/glossary.json'))
const terms = Object.fromEntries(glossary.terms
  .filter((term) => term.en && term.zhHant)
  .map((term) => [term.en.toLocaleLowerCase('en'), {
    id: term.id,
    en: term.en,
    zhHant: term.zhHant,
    aliasesEn: term.aliasesEn ?? [],
    aliasesZhHant: term.aliasesZhHant ?? [],
  }]))

const stringsOf = (value, out = []) => {
  if (typeof value === 'string') out.push(value)
  else if (Array.isArray(value)) value.forEach((item) => stringsOf(item, out))
  else if (value && typeof value === 'object') Object.entries(value)
    .filter(([key]) => !['$comment', 'normalizedHash'].includes(key))
    .forEach(([, item]) => stringsOf(item, out))
  return out
}

const typeSlug = (entry) => entry.id.replace(`${entry.type}.`, '').replaceAll('.', '-')
const explicitRefs = (value) => stringsOf(value)
  .flatMap((text) => [...text.matchAll(/\]\(([^)]+)\)/g)].map((match) => match[1]))
  .filter((id) => ids.has(id))

const entries = canon.map((entry) => {
  const localized = zhById.get(entry.id)
  const keywords = entry.keywords ?? []
  const aliasesZhHant = localized.aliasesZhHant ?? []
  const searchParts = [
    localized.nameZhHant,
    entry.name,
    ...(entry.aliasesEn ?? []),
    ...aliasesZhHant,
    ...keywords.flatMap((key) => [key, labels['ability-keywords'][key]?.zhHant]),
    entry.actionType,
    labels['action-types'][entry.actionType]?.zhHant,
    entry.abilityCategory,
    labels['ability-categories'][entry.abilityCategory]?.zhHant,
    ...stringsOf(localized),
    ...stringsOf(entry),
  ].filter(Boolean)
  const relatedIds = [...new Set([...explicitRefs(localized), ...explicitRefs(entry)])]

  return {
    id: entry.id,
    type: entry.type,
    slug: typeSlug(entry),
    name: { zhHant: localized.nameZhHant, en: entry.name },
    aliases: { zhHant: aliasesZhHant, en: entry.aliasesEn ?? [] },
    summary: localized.flavor ?? localized.text?.[0] ?? localized.sections?.[0]?.blocks?.[0]?.text ?? '',
    origin: entry.origin ?? null,
    level: entry.level ?? null,
    tags: {
      keywords,
      actionType: entry.actionType ?? null,
      abilityCategory: entry.abilityCategory ?? null,
      cost: entry.cost ?? null,
    },
    reviewStatus: {
      canon: entry.canonReviewStatus,
      zhHant: localized.meta?.status ?? 'draft',
    },
    source: entry.source,
    relatedIds,
    searchText: searchParts.join('\n'),
    content: { canon: entry, zhHant: localized },
  }
})

const routes = new Set()
for (const entry of entries) {
  const route = `${entry.type}/${entry.slug}`
  if (routes.has(route)) throw new Error(`重複路由：${route}`)
  routes.add(route)
}

const catalog = {
  release: 'm0',
  sourceFingerprint: release.sourceFingerprint,
  counts: {
    total: entries.length,
    abilities: entries.filter((entry) => entry.type === 'ability').length,
    conditions: entries.filter((entry) => entry.type === 'condition').length,
    features: entries.filter((entry) => entry.type === 'feature').length,
  },
  labels,
  terms,
  entries,
}

const outputDir = resolve(webRoot, 'public/data')
mkdirSync(outputDir, { recursive: true })
writeFileSync(resolve(outputDir, 'catalog.m0.json'), `${JSON.stringify(catalog, null, 2)}\n`, 'utf8')
console.log(`catalog.m0.json：${entries.length} 筆，${routes.size} 條唯一路由`)

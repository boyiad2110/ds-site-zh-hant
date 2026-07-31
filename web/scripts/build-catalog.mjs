import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { verify as verifyMilestones } from '../../scripts/verify-milestones.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const webRoot = resolve(here, '..')
const repoRoot = resolve(webRoot, '..')
const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'))
const walkJson = (dir) => readdirSync(dir)
  .filter((name) => name.endsWith('.json'))
  .sort()
  .map((name) => readJson(resolve(dir, name)))

// catalog 採累積式，筆數會隨 milestone 增加而變動，因此不在這裡檢查固定筆數。
// 「範圍是否完整」（有沒有缺條目、多條目、宣告與實際對不上）改由
// scripts/verify-milestones.mjs 把關——它比對的是逐筆 id 清單，不是動態算出的數量，
// 能指出「哪個 id」出問題，而不只是「數字不對」。
// ⚠️ 這道檢查**必須跑在這裡**、不能只留著讓人手動執行——`npm run dev`／`build`／`test`
// 都會先跑 `npm run catalog`（見 web/package.json 的 predev／prebuild／pretest），
// 這是目前唯一保證每次都會執行到的地方。
const milestoneCheck = verifyMilestones()
if (milestoneCheck.failures.length) {
  console.error(`── milestone 完整性檢查失敗（${milestoneCheck.failures.length} 項）──`)
  for (const f of milestoneCheck.failures) console.error(`  ❌ ${f}`)
  throw new Error('milestone 完整性檢查未通過，請見上方訊息；詳細規則見 scripts/verify-milestones.mjs')
}

const groups = ['abilities', 'conditions', 'features']
const canon = groups.flatMap((group) => walkJson(resolve(repoRoot, 'data/canon', group)))
const zh = groups.flatMap((group) => walkJson(resolve(repoRoot, 'data/zh-Hant', group)))
const zhById = new Map(zh.map((entry) => [entry.id, entry]))
const ids = new Set(canon.map((entry) => entry.id))

// build-catalog 自己職責內的資料完整性：id 不重複、每筆都有繁中配對與正典雜湊。
// 範圍完整性已由上面的 verifyMilestones() 把關，這裡不重複判斷。
if (new Set(canon.map((entry) => entry.id)).size !== canon.length) throw new Error('出現重複 id')
for (const entry of canon) {
  if (!zhById.has(entry.id)) throw new Error(`缺少繁中條目：${entry.id}`)
  if (!entry.source?.normalizedHash) throw new Error(`缺少正典雜湊：${entry.id}`)
}

// 目前只有 releases/m0.json（術語依賴清單）存在；milestones 清單另外從
// releases/milestones/*.json 讀，兩者刻意分開（見 build-m0-release.mjs 開頭註解）。
const milestoneFiles = readdirSync(resolve(repoRoot, 'releases/milestones')).filter((n) => n.endsWith('.json')).sort()
const milestoneManifests = milestoneFiles.map((name) => readJson(resolve(repoRoot, 'releases/milestones', name)))
const milestones = milestoneManifests.filter((m) => m.ids?.length > 0).map((m) => m.milestone)
const sourceFingerprints = Object.fromEntries(milestoneManifests
  .map((m) => m.milestone)
  .filter((milestone) => existsSync(resolve(repoRoot, `releases/${milestone}.json`)))
  .map((milestone) => [milestone, readJson(resolve(repoRoot, `releases/${milestone}.json`)).sourceFingerprint]))

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
  // 累積式 catalog：milestones 是「目前有內容存在」的 milestone 清單，
  // 不是單一 release 名稱。sourceFingerprints 逐 milestone 記錄各自的術語依賴清單指紋。
  milestones,
  sourceFingerprints,
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
writeFileSync(resolve(outputDir, 'catalog.json'), `${JSON.stringify(catalog, null, 2)}\n`, 'utf8')
console.log(`catalog.json：${entries.length} 筆，${routes.size} 條唯一路由，milestones=${milestones.join('、')}`)

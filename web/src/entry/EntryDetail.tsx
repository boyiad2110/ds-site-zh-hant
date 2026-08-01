import { Link } from 'react-router-dom'
import type { Catalog, CatalogEntry } from '../types'
import { buildEntryRoute, buildSearchRoute } from '../routes'
import { EntryCard, entryTypeLabels } from './EntryCard'

export { entryTypeLabels } from './EntryCard'

function label(catalog: Catalog, group: string, value?: string | null) {
  return value ? catalog.labels[group]?.[value]?.zhHant ?? value : '—'
}

export type BreadcrumbItem = { label: string; to?: string }

export function EntryDetail({ entry, catalog, byId, breadcrumbs, entryRoute = buildEntryRoute }: {
  entry: CatalogEntry
  catalog: Catalog
  byId: Map<string, CatalogEntry>
  breadcrumbs?: BreadcrumbItem[]
  entryRoute?: (entry: CatalogEntry) => string
}) {
  const c = entry.content.canon
  const isDraft = entry.reviewStatus.canon !== 'verified' || entry.reviewStatus.zhHant !== 'reviewed'
  const trail = breadcrumbs ?? [
    { label: '規則庫', to: buildSearchRoute() },
    { label: entryTypeLabels[entry.type], to: buildSearchRoute({ type: entry.type }) },
    { label: entry.name.zhHant },
  ]

  return <>
    <nav className="breadcrumb" aria-label="麵包屑">{trail.map((item, index) => <span className="breadcrumb-item" key={`${item.label}-${index}`}>
      {index > 0 && <span aria-hidden="true">/</span>}
      {item.to ? <Link to={item.to}>{item.label}</Link> : <span>{item.label}</span>}
    </span>)}</nav>
    {isDraft && <div className="notice"><strong>逐筆驗收中：</strong>這筆內容尚未獲得完整的擁有者核准；可先檢查呈現與資料結構。</div>}
    <p className="sheet-kind">
      <span className="sheet-kind-label">分類</span>
      {[entryTypeLabels[entry.type],
        entry.tags.abilityCategory && label(catalog, 'ability-categories', entry.tags.abilityCategory),
        entry.level && `等級 ${entry.level}`,
      ].filter(Boolean).join('・')}
    </p>
    <EntryCard entry={entry} catalog={catalog} byId={byId} entryRoute={entryRoute} />
    {entry.relatedIds.length > 0 && <section className="related">
      <h2>相關條目</h2>
      <ul>{entry.relatedIds.map((id) => { const related = byId.get(id)!; return <li key={id}><Link to={entryRoute(related)}><span className={`kind kind-${related.type}`}>{entryTypeLabels[related.type]}</span><strong>{related.name.zhHant}</strong><small>{related.name.en}</small></Link></li> })}</ul>
    </section>}
    <details className="canon-panel"><summary><span>核對英文正典</span><small>English canon</small></summary><div><h2>{c.name as string}</h2>{c.flavor && <blockquote>{c.flavor as string}</blockquote>}<pre>{JSON.stringify(c, (key, value) => ['$comment', 'normalizedHash'].includes(key) ? undefined : value, 2)}</pre></div></details>
    <p className="sheet-foot">Draw Steel Heroes v{entry.source.version} · 印刷頁 {entry.source.printedPage}</p>
  </>
}

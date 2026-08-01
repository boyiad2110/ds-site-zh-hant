import { useEffect, useId, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { EntryCard } from '../entry/EntryCard'
import { EntryDetail } from '../entry/EntryDetail'
import { buildClassEntryRoute, buildClassRoute, CLASS_INDEX_PATH } from '../routes'
import type { Catalog, CatalogEntry } from '../types'
import { manifestContainsEntry, resolveEntryRoute } from './resolver'
import type { ClassManifest, ClassManifestRegistry, ClassSection } from './types'

type PageState = 'overview' | 'detail'

function orderedManifests(registry: ClassManifestRegistry, order: readonly string[]): ClassManifest[] {
  return order.map((classId) => registry[classId]).filter((manifest): manifest is ClassManifest => Boolean(manifest))
}

function ClassSwitcher({ manifest, registry, order, mobile = false }: {
  manifest: ClassManifest
  registry: ClassManifestRegistry
  order: readonly string[]
  mobile?: boolean
}) {
  const navigate = useNavigate()
  const manifests = orderedManifests(registry, order)
  if (mobile) {
    return <nav className="class-switcher" aria-label="範型切換">
      <label htmlFor="class-selector">選擇範型</label>
      <select id="class-selector" value={manifest.classId} onChange={(event) => navigate(buildClassRoute(event.target.value))}>
        {manifests.map((item) => <option value={item.classId} key={item.classId}>{item.name.zhHant}</option>)}
      </select>
    </nav>
  }
  return <nav className="class-switcher" aria-label="範型切換">
    <p className="class-nav-title">範型</p>
    <ul>{manifests.map((item) => <li key={item.classId}>
      <Link to={buildClassRoute(item.classId)} aria-current={item.classId === manifest.classId ? 'page' : undefined}>{item.name.zhHant}</Link>
    </li>)}</ul>
  </nav>
}

function SectionNavigation({ manifest, activeEntry, controlsId, collapsible = false, open = true, onToggle, onNavigate }: {
  manifest: ClassManifest
  activeEntry?: CatalogEntry
  controlsId: string
  collapsible?: boolean
  open?: boolean
  onToggle?: () => void
  onNavigate?: () => void
}) {
  const navigation = <ul id={controlsId} hidden={collapsible && !open}>{manifest.sections.map((section) => {
    const active = activeEntry && section.entries.some((item) => item.id === activeEntry.id)
    return <li key={section.id}>
      <Link to={`${buildClassRoute(manifest.classId)}#${section.id}`} aria-current={active ? 'location' : undefined} onClick={onNavigate}>{section.heading}</Link>
    </li>
  })}</ul>
  return <nav className="class-section-nav" aria-label="目前範型章節">
    {collapsible
      ? <><button type="button" aria-expanded={open} aria-controls={controlsId} onClick={onToggle}>章節目錄<span aria-hidden="true">{open ? '−' : '+'}</span></button>{navigation}</>
      : <><p className="class-nav-title">章節目錄</p>{navigation}</>}
  </nav>
}

function ClassOverview({ catalog, manifest, byId }: {
  catalog: Catalog
  manifest: ClassManifest
  byId: Map<string, CatalogEntry>
}) {
  return <div className="class-content">
    <header className="class-page-head">
      <p>範型</p>
      <h1>{manifest.name.zhHant}</h1>
      <p className="class-name-en">{manifest.name.en}</p>
      <p className="class-scope-note">{manifest.scopeNote}</p>
    </header>
    {manifest.sections.map((section) => {
      const renderSection = {
        entries: () => <section className="class-section" id={section.id} key={section.id}>
            <h2>{section.heading}</h2>
            <div className="class-section-body">
              {section.entries.map((item) => {
                const entry = byId.get(item.id)
                if (!entry) return null
                const entryRoute = (target: CatalogEntry) => resolveEntryRoute({ currentManifest: manifest, entry: target })
                if ((item.presentation ?? 'summary') === 'expanded') {
                  return <div className="expanded-entry" key={item.id}>
                    <EntryCard entry={entry} catalog={catalog} byId={byId} presentation="expanded" entryRoute={entryRoute} />
                    <Link className="entry-permalink" to={buildClassEntryRoute(manifest.classId, entry)}>開啟「{entry.name.zhHant}」永久連結</Link>
                  </div>
                }
                return <ul className="entry-list" key={item.id}><EntryCard entry={entry} catalog={catalog} byId={byId} presentation="summary" entryRoute={entryRoute} /></ul>
              })}
            </div>
          </section>,
      } satisfies Record<ClassSection['kind'], () => ReactNode>
      return renderSection[section.kind]()
    })}
  </div>
}

export function ClassShell({ catalog, manifest, registry, order, pageState, activeEntry }: {
  catalog: Catalog
  manifest: ClassManifest
  registry: ClassManifestRegistry
  order: readonly string[]
  pageState: PageState
  activeEntry?: CatalogEntry
}) {
  const byId = useMemo(() => new Map(catalog.entries.map((entry) => [entry.id, entry])), [catalog])
  const [tocOpen, setTocOpen] = useState(false)
  const location = useLocation()
  const tocId = useId()

  useEffect(() => setTocOpen(false), [location.pathname, location.hash])

  if (pageState === 'detail' && (!activeEntry || !manifestContainsEntry(manifest, activeEntry.id))) {
    throw new Error('ClassShell detail 必須提供 manifest 已收錄的條目')
  }

  const entryRoute = (entry: CatalogEntry) => resolveEntryRoute({ currentManifest: manifest, entry })
  return <main className="class-shell">
    <aside className="class-sidebar">
      <div className="class-sidebar-desktop">
        <ClassSwitcher manifest={manifest} registry={registry} order={order} />
        <SectionNavigation manifest={manifest} activeEntry={activeEntry} controlsId={`${tocId}-desktop`} />
      </div>
      <div className="class-sidebar-mobile">
        <ClassSwitcher manifest={manifest} registry={registry} order={order} mobile />
        <SectionNavigation manifest={manifest} activeEntry={activeEntry} controlsId={`${tocId}-mobile`} collapsible open={tocOpen} onToggle={() => setTocOpen((value) => !value)} onNavigate={() => setTocOpen(false)} />
      </div>
    </aside>
    {pageState === 'overview'
      ? <ClassOverview catalog={catalog} manifest={manifest} byId={byId} />
      : <section className="detail class-detail"><EntryDetail
          entry={activeEntry!}
          catalog={catalog}
          byId={byId}
          entryRoute={entryRoute}
          breadcrumbs={[
            { label: '範型', to: CLASS_INDEX_PATH },
            { label: manifest.name.zhHant, to: buildClassRoute(manifest.classId) },
            { label: activeEntry!.name.zhHant },
          ]}
        /></section>}
  </main>
}

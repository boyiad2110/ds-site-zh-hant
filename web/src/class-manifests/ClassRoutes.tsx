import { Link, useParams } from 'react-router-dom'
import type { Catalog } from '../types'
import { NotFound } from '../NotFound'
import { buildClassRoute } from '../routes'
import { ClassShell } from './ClassShell'
import { manifestEntryIds, resolveClassEntry } from './resolver'
import { classManifestOrder, classManifestRegistry } from './registry'

export function ClassIndex() {
  const manifests = classManifestOrder.map((classId) => classManifestRegistry[classId]).filter(Boolean)
  return <main className="class-index">
    <header className="page-head">
      <h1>範型</h1>
      <p>依範型瀏覽已收錄的招式與特性。</p>
    </header>
    {manifests.length === 0
      ? <div className="empty-state"><h2>尚未收錄</h2><p>範型瀏覽架構已就緒，正式內容將在通過審核後加入。</p></div>
      : <ul className="class-index-list">{manifests.map((manifest) => <li key={manifest.classId}>
        <Link className="class-index-card" to={buildClassRoute(manifest.classId)}>
          <div className="class-index-card-head">
            <div className="class-index-card-title"><h2>{manifest.name.zhHant}</h2><small>{manifest.name.en}</small></div>
            <span className="class-index-card-arrow" aria-hidden="true">→</span>
          </div>
          <span className="class-index-card-note">{manifest.scopeNote}</span>
          <span className="class-index-card-meta">{manifestEntryIds(manifest).size} 筆條目</span>
        </Link>
      </li>)}</ul>}
  </main>
}

export function ClassOverviewRoute({ catalog }: { catalog: Catalog }) {
  const { classId } = useParams()
  const manifest = classId ? classManifestRegistry[classId] : undefined
  if (!manifest) return <NotFound />
  return <ClassShell catalog={catalog} manifest={manifest} registry={classManifestRegistry} order={classManifestOrder} pageState="overview" />
}

export function ClassEntryRoute({ catalog }: { catalog: Catalog }) {
  const { classId, type, slug } = useParams()
  const resolved = resolveClassEntry({ registry: classManifestRegistry, catalog, classId, type, slug })
  if (!resolved) return <NotFound />
  return <ClassShell catalog={catalog} manifest={resolved.manifest} registry={classManifestRegistry} order={classManifestOrder} pageState="detail" activeEntry={resolved.entry} />
}

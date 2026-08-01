import { Fragment, useEffect, useMemo, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { Link, NavLink, Route, Routes, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { loadCatalog } from './catalog'
import { applyFilters } from './search'
import type { Catalog, CatalogEntry, EntryType, Filters } from './types'
import { EntryDetail, entryTypeLabels } from './entry/EntryDetail'
import { buildEntryRoute, buildSearchRoute, isCompendiumSearchPage } from './routes'
import { NotFound } from './NotFound'
import { ClassEntryRoute, ClassIndex, ClassOverviewRoute } from './class-manifests/ClassRoutes'
import { validateRegistryIntegrity } from './class-manifests/integrity'
import { classManifestOrder, classManifestRegistry } from './class-manifests/registry'
// 與驗收頁共用同一份轉換規則（shared/canon-format.mjs）——先前兩邊各寫一份，
// 導致同一條規則出現兩種答案。這裡只取資料與 token，畫面仍由本檔負責。
import { costLabel, plainText } from '../../shared/canon-format.mjs'

const typeLabels = entryTypeLabels
const typeNames: Record<EntryType, { zhHant: string; en: string }> = {
  ability: { zhHant: '招式', en: 'Abilities' },
  condition: { zhHant: '狀態', en: 'Conditions' },
  feature: { zhHant: '範型特性', en: 'Features' },
}
const typeOrder: EntryType[] = ['ability', 'condition', 'feature']
const tocIndex = ['一', '二', '三']

function label(catalog: Catalog, group: string, value?: string | null) {
  return value ? catalog.labels[group]?.[value]?.zhHant ?? value : '—'
}

function SearchIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m15.5 15.5 4 4" strokeLinecap="round" />
    </svg>
  )
}

function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const [draft, setDraft] = useState('')
  const onCompendium = isCompendiumSearchPage(location.pathname)

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const value = draft.trim()
    navigate(buildSearchRoute(value ? { q: value } : undefined))
  }

  return (
    <header className="site-header">
      <div>
        <Link className="brand" to="/" aria-label="英雄爭鋒首頁">
          <strong>英雄爭鋒</strong>
          <small>Draw Steel 中文資料庫</small>
        </Link>
        <nav className="site-nav" aria-label="主要導覽">
          <NavLink to="/" end>總覽</NavLink>
          <NavLink to="/compendium">規則庫</NavLink>
        </nav>
        {!onCompendium && (
          <form className="header-search" role="search" onSubmit={submit}>
            <SearchIcon />
            <label className="sr-only" htmlFor="header-search">快速搜尋</label>
            <input id="header-search" type="search" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="搜尋條目…" autoComplete="off" />
          </form>
        )}
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <span>非官方中文資料庫</span>
        <span>資料來源：Draw Steel Heroes v1.01</span>
        <span>符號字型 Draw Steel Glyphs © 2025 MCDM Productions，採用 <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a> 授權</span>
      </div>
    </footer>
  )
}

function EntryRow({ entry, catalog, showKind }: { entry: CatalogEntry; catalog: Catalog; showKind: boolean }) {
  return (
    <li>
      <Link className="entry-row" to={buildEntryRoute(entry)}>
        <span>
          <span className="entry-name">{entry.name.zhHant}</span>
          <span className="entry-en">{entry.name.en}</span>
          <span className="entry-summary">{entry.summary ? plainText(entry.summary) : '查看完整規則內容與英文原文。'}</span>
        </span>
        <span className="entry-meta">
          {showKind && <span className={`kind kind-${entry.type}`}>{typeLabels[entry.type]}</span>}
          {entry.tags.abilityCategory && <span>{label(catalog, 'ability-categories', entry.tags.abilityCategory)}</span>}
          {entry.tags.actionType && <span>{label(catalog, 'action-types', entry.tags.actionType)}</span>}
          {entry.tags.cost && <span className="cost">{costLabel(entry.tags.cost)}</span>}
        </span>
      </Link>
    </li>
  )
}

function Home({ catalog }: { catalog: Catalog }) {
  const navigate = useNavigate()
  const [draft, setDraft] = useState('')
  const byType = (type: EntryType) => catalog.entries
    .filter((entry) => entry.type === type)
    .sort((a, b) => a.name.zhHant.localeCompare(b.name.zhHant, 'zh-Hant'))
  const counts = { ability: catalog.counts.abilities, condition: catalog.counts.conditions, feature: catalog.counts.features }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const value = draft.trim()
    navigate(buildSearchRoute(value ? { q: value } : undefined))
  }

  return (
    <main className="home">
      <section className="frontispiece">
        <h1>英雄爭鋒</h1>
        <p className="frontispiece-en">Draw Steel 中文資料庫</p>
        <p className="frontispiece-lede">Draw Steel 招式、狀態與範型特性中文對照，共 {catalog.counts.total} 筆。中文對照英文正典，跑團時直接查。</p>
        <form className="hero-search" role="search" onSubmit={submit}>
          <SearchIcon />
          <label className="sr-only" htmlFor="home-search">搜尋規則</label>
          <input id="home-search" type="search" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="搜尋招式、狀態、關鍵詞或英文名稱…" autoComplete="off" />
          <button type="submit">搜尋</button>
        </form>
      </section>

      <h2 className="section-title">目次</h2>
      <ul className="toc-list">
        {typeOrder.map((type, index) => (
          <li key={type}>
            <Link className="toc-row" to={buildSearchRoute({ type })}>
              <span className="toc-index">{tocIndex[index]}</span>
              <strong>{typeNames[type].zhHant}</strong>
              <small>{typeNames[type].en}</small>
              <span className="toc-dots" aria-hidden="true" />
              <b>{counts[type]}</b>
            </Link>
          </li>
        ))}
      </ul>

      <h2 className="section-title">快速查閱</h2>
      <div className="quick-group">
        <h3>狀態</h3>
        <ul className="link-list">
          {byType('condition').map((entry) => (
            <li key={entry.id}><Link to={buildEntryRoute(entry)}>{entry.name.zhHant}</Link></li>
          ))}
        </ul>
      </div>
      <div className="quick-group">
        <h3>範型特性</h3>
        <ul className="link-list">
          {byType('feature').map((entry) => (
            <li key={entry.id}><Link to={buildEntryRoute(entry)}>{entry.name.zhHant}<small>{entry.name.en}</small></Link></li>
          ))}
        </ul>
      </div>

      <p className="colophon">
        本站為非官方中文資料庫，目前收錄共 {catalog.counts.total} 筆，皆已逐筆核對英文正典。
        每筆條目頁底都能展開原文對照。資料來源：Draw Steel Heroes v1.01。
      </p>
    </main>
  )
}

function FilterSelect({ id, labelText, value, onChange, children }: { id: string; labelText: string; value: string; onChange: (value: string) => void; children: ReactNode }) {
  return <label className="filter-field" htmlFor={id}><span>{labelText}</span><select id={id} value={value} onChange={(event) => onChange(event.target.value)}>{children}</select></label>
}

function Compendium({ catalog }: { catalog: Catalog }) {
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const filters: Filters = {
    type: params.get('type') ?? '', category: params.get('category') ?? '', action: params.get('action') ?? '',
    cost: params.get('cost') ?? '', level: params.get('level') ?? '', keyword: params.get('keyword') ?? '',
  }
  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params)
    value ? next.set(key, value) : next.delete(key)
    setParams(next, { replace: true })
  }
  const results = useMemo(() => applyFilters(catalog.entries, query, filters), [catalog, query, params.toString()])
  const hasFilters = Boolean(query) || Object.values(filters).some(Boolean)
  const keywords = [...new Set(catalog.entries.flatMap((entry) => entry.tags.keywords))].sort()
  /** 等級篩選只有在資料真的有多個等級時才有意義；目前全是等級 1，就不顯示這個選項。 */
  const levels = [...new Set(catalog.entries.map((entry) => entry.level).filter((value): value is number => value != null))].sort((a, b) => a - b)
  /** 成本篩選值是 "資源:數值"（如 wrath:5）或 "none"（無英雄資源成本），
   * 不能只比數值——不同資源（如怒火／導靈的 Piety）的相同數值不該被同一個篩選值混在一起。
   * 選項由 catalog 實際資料動態算出，不寫死特定資源。 */
  const costOptions = useMemo(() => {
    const combos = new Map<string, { resource: string; value: number }>()
    let hasNone = false
    for (const entry of catalog.entries) {
      if (entry.tags.cost) combos.set(`${entry.tags.cost.resource}:${entry.tags.cost.value}`, entry.tags.cost)
      else hasNone = true
    }
    return {
      hasNone,
      combos: [...combos.entries()].sort(([, a], [, b]) => a.resource.localeCompare(b.resource) || a.value - b.value),
    }
  }, [catalog])
  const costFilterLabel = (value: string): string => {
    if (value === 'none') return '無成本'
    const [resource, amount] = value.split(':')
    return costLabel({ resource, value: Number(amount) })
  }
  const activeFilters = [
    query && { key: 'q', text: `搜尋：${query}` },
    filters.type && { key: 'type', text: typeLabels[filters.type as EntryType] ?? filters.type },
    filters.category && { key: 'category', text: label(catalog, 'ability-categories', filters.category) },
    filters.action && { key: 'action', text: label(catalog, 'action-types', filters.action) },
    filters.cost && { key: 'cost', text: costFilterLabel(filters.cost) },
    filters.level && { key: 'level', text: `等級 ${filters.level}` },
    filters.keyword && { key: 'keyword', text: label(catalog, 'ability-keywords', filters.keyword) },
  ].filter(Boolean) as { key: string; text: string }[]
  /** 有搜尋字串時照相關度排序，分組會打亂順序；純瀏覽時才依類型分組。 */
  const groups = query ? [] : typeOrder.map((type) => ({ type, items: results.filter((entry) => entry.type === type) })).filter((group) => group.items.length > 0)

  return (
    <main className="compendium">
      <header className="page-head">
        <h1>規則庫</h1>
        <p>搜尋中文、英文或別名，再用下方條件縮小結果。</p>
      </header>
      <div className="search-bar">
        <SearchIcon />
        <label className="sr-only" htmlFor="compendium-search">搜尋規則庫</label>
        <input id="compendium-search" type="search" value={query} onChange={(event) => update('q', event.target.value)} placeholder="搜尋招式、狀態、關鍵詞或英文名稱…" autoComplete="off" />
        {query && <button onClick={() => update('q', '')} aria-label="清除搜尋">×</button>}
      </div>
      <div className="filter-row">
        <FilterSelect id="filter-type" labelText="條目類型" value={filters.type} onChange={(v) => update('type', v)}>
          <option value="">全部類型</option><option value="ability">招式</option><option value="condition">狀態</option><option value="feature">特性</option>
        </FilterSelect>
        <FilterSelect id="filter-category" labelText="能力類別" value={filters.category} onChange={(v) => update('category', v)}>
          <option value="">全部類別</option>{Object.entries(catalog.labels['ability-categories']).map(([value, item]) => <option key={value} value={value}>{item.zhHant}</option>)}
        </FilterSelect>
        <FilterSelect id="filter-action" labelText="動作類型" value={filters.action} onChange={(v) => update('action', v)}>
          <option value="">全部動作</option>{Object.entries(catalog.labels['action-types']).map(([value, item]) => <option key={value} value={value}>{item.zhHant}</option>)}
        </FilterSelect>
        <FilterSelect id="filter-cost" labelText="英雄資源成本" value={filters.cost} onChange={(v) => update('cost', v)}>
          <option value="">全部成本</option>
          {costOptions.hasNone && <option value="none">無成本</option>}
          {costOptions.combos.map(([value, cost]) => <option key={value} value={value}>{costLabel(cost)}</option>)}
        </FilterSelect>
        <FilterSelect id="filter-keyword" labelText="關鍵詞" value={filters.keyword} onChange={(v) => update('keyword', v)}>
          <option value="">全部關鍵詞</option>{keywords.map((value) => <option key={value} value={value}>{label(catalog, 'ability-keywords', value)}</option>)}
        </FilterSelect>
        {levels.length > 1 && (
          <FilterSelect id="filter-level" labelText="等級" value={filters.level} onChange={(v) => update('level', v)}>
            <option value="">全部等級</option>{levels.map((value) => <option key={value} value={value}>等級 {value}</option>)}
          </FilterSelect>
        )}
      </div>
      {activeFilters.length > 0 && (
        <div className="active-filters">
          <span className="sr-only">目前套用的條件</span>
          {activeFilters.map((item) => (
            <button key={item.key} onClick={() => update(item.key, '')} aria-label={`移除條件：${item.text}`}>
              {item.text}<span aria-hidden="true">×</span>
            </button>
          ))}
        </div>
      )}
      <div className="results-head">
        <strong>{results.length} 筆結果</strong>
        {hasFilters && <button onClick={() => setParams({})}>全部清除</button>}
      </div>
      <section aria-live="polite">
        {results.length === 0 && (
          <div className="empty-state">
            <h2>沒有符合的條目</h2>
            <p>試著減少篩選條件，或改用英文名稱搜尋。</p>
            <button className="link-button" onClick={() => setParams({})}>清除所有條件</button>
          </div>
        )}
        {results.length > 0 && groups.length === 0 && (
          <ul className="entry-list">{results.map((entry) => <EntryRow key={entry.id} entry={entry} catalog={catalog} showKind />)}</ul>
        )}
        {groups.map((group) => (
          <Fragment key={group.type}>
            <h2 className="group-title">{typeNames[group.type].zhHant}</h2>
            <ul className="entry-list">{group.items.map((entry) => <EntryRow key={entry.id} entry={entry} catalog={catalog} showKind={false} />)}</ul>
          </Fragment>
        ))}
      </section>
    </main>
  )
}

function Detail({ catalog }: { catalog: Catalog }) {
  const { type, slug } = useParams()
  const entry = catalog.entries.find((item) => item.type === type && item.slug === slug)
  const byId = useMemo(() => new Map(catalog.entries.map((item) => [item.id, item])), [catalog])
  if (!entry) return <NotFound />
  return <main className="detail"><EntryDetail entry={entry} catalog={catalog} byId={byId} /></main>
}

export default function App() {
  const [catalog, setCatalog] = useState<Catalog | null>(null)
  const [error, setError] = useState('')
  useEffect(() => { loadCatalog().then(setCatalog).catch((reason) => setError(reason instanceof Error ? reason.message : String(reason))) }, [])
  if (error) return <main className="state-page"><h1>無法載入規則資料</h1><p>{error}</p></main>
  if (!catalog) return <main className="state-page" aria-live="polite"><p>載入中…</p></main>
  const registryIssues = validateRegistryIntegrity(classManifestRegistry, classManifestOrder, catalog)
  if (registryIssues.length > 0) return <main className="state-page"><h1>範型瀏覽設定無效</h1><p>{registryIssues[0].message}</p></main>
  return <div className="app-shell"><Header /><Routes>
    <Route path="/" element={<Home catalog={catalog} />} />
    <Route path="/compendium" element={<Compendium catalog={catalog} />} />
    <Route path="/compendium/search" element={<Compendium catalog={catalog} />} />
    <Route path="/compendium/classes" element={<ClassIndex />} />
    <Route path="/compendium/classes/:classId" element={<ClassOverviewRoute catalog={catalog} />} />
    <Route path="/compendium/classes/:classId/:type/:slug" element={<ClassEntryRoute catalog={catalog} />} />
    <Route path="/compendium/:type/:slug" element={<Detail catalog={catalog} />} />
    <Route path="*" element={<NotFound />} />
  </Routes><Footer /></div>
}

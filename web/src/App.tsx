import { Fragment, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { Link, NavLink, Route, Routes, useParams, useSearchParams } from 'react-router-dom'
import { loadCatalog } from './catalog'
import { applyFilters } from './search'
import type { Catalog, CatalogEntry, Filters } from './types'

const typeLabels = { ability: '招式', condition: '狀態', feature: '特性' }
const characteristicLabels: Record<string, string> = {
  might: '力量', agility: '敏捷', reason: '理性', intuition: '直覺', presence: '氣場', choice: '任選',
}
const defaultFilters: Filters = { type: '', category: '', action: '', cost: '', level: '', keyword: '' }

function routeOf(entry: CatalogEntry) {
  return `/compendium/${entry.type}/${entry.slug}`
}

function label(catalog: Catalog, group: string, value?: string | null) {
  return value ? catalog.labels[group]?.[value]?.zhHant ?? value : '—'
}

const targetLabels: Record<string, string> = {
  'One creature': '1 個生物',
  'One creature or object': '1 個生物或物體',
  'One enemy': '1 個敵人',
  'Self or one ally': '自身或 1 個盟友',
  'Each enemy in the area': '區域內每個敵人',
  'One willing creature': '1 個自願的生物',
}

function targetLabel(target?: string | null): string {
  if (!target) return '—'
  return targetLabels[target] ?? target
}

const areaShapeLabels: Record<string, string> = { cube: '立方' }

function distanceLabel(distance: any): string {
  if (!distance) return '—'
  if (distance.kind === 'choice') return (distance.options ?? []).map(distanceLabel).join(' 或 ')
  if (distance.kind === 'area') {
    const shape = areaShapeLabels[distance.area?.shape] ?? distance.area?.shape ?? ''
    return `${distance.area?.within ?? ''} 格內 ${distance.area?.size ?? ''} ${shape}`.trim()
  }
  const names: Record<string, string> = { melee: '近戰', ranged: '遠程', self: '自身' }
  return `${names[distance.kind] ?? distance.kind}${distance.value != null ? ` ${distance.value}` : ''}`
}

/** flavor 只有在原文本身是引言（book 用引號標出角色台詞）時才加中文引號；純敘述句不加。 */
function isQuotedFlavor(canonFlavor?: string | null): boolean {
  return !!canonFlavor && /^["“]/.test(canonFlavor.trim())
}

function RichText({ text, byId }: { text: string; byId: Map<string, CatalogEntry> }) {
  const pattern = /\[([^\]]+)\]\(([^)]+)\)|`([^`]+)`/g
  const nodes = []
  let cursor = 0
  let match: RegExpExecArray | null
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > cursor) nodes.push(text.slice(cursor, match.index))
    if (match[1] && match[2]) {
      const target = byId.get(match[2])
      nodes.push(target
        ? <Link key={match.index} className="entity-link" to={routeOf(target)}>{match[1]}</Link>
        : <span key={match.index}>{match[1]}</span>)
    } else {
      nodes.push(<strong key={match.index} className="term">{match[3]}</strong>)
    }
    cursor = pattern.lastIndex
  }
  if (cursor < text.length) nodes.push(text.slice(cursor))
  return <>{nodes}</>
}

function Header() {
  return (
    <header className="site-header">
      <Link className="brand" to="/" aria-label="鑄鋼典藏首頁">
        <span className="brand-mark" aria-hidden="true"><i>DS</i></span>
        <span><strong>鑄鋼典藏</strong><small>DRAW STEEL · 繁中規則庫</small></span>
      </Link>
      <nav aria-label="主要導覽">
        <NavLink to="/" end>總覽</NavLink>
        <NavLink to="/compendium">規則庫</NavLink>
      </nav>
    </header>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <span>非官方繁體中文規則工具 · M0 私密驗收版</span>
      <span>資料來源：Draw Steel Heroes v1.01</span>
    </footer>
  )
}

function EntryBadge({ entry }: { entry: CatalogEntry }) {
  return <span className={`type-badge type-${entry.type}`}>{typeLabels[entry.type]}</span>
}

function EntryCard({ entry, catalog }: { entry: CatalogEntry; catalog: Catalog }) {
  return (
    <Link className="entry-card" to={routeOf(entry)}>
      <div className="entry-card-top">
        <EntryBadge entry={entry} />
        {entry.tags.cost && <span className="cost-chip">{entry.tags.cost.value} 怒火</span>}
      </div>
      <h3>{entry.name.zhHant}</h3>
      <p className="english-name">{entry.name.en}</p>
      <p className="entry-summary">{entry.summary || '查看完整規則內容與英文原文。'}</p>
      <div className="tag-row">
        {entry.tags.abilityCategory && <span>{label(catalog, 'ability-categories', entry.tags.abilityCategory)}</span>}
        {entry.tags.actionType && <span>{label(catalog, 'action-types', entry.tags.actionType)}</span>}
        {entry.level && <span>等級 {entry.level}</span>}
      </div>
      <span className="card-arrow" aria-hidden="true">→</span>
    </Link>
  )
}

function Home({ catalog }: { catalog: Catalog }) {
  const featured = ['ability.censor.judgment', 'ability.censor.arrest', 'feature.censor.wrath']
    .map((id) => catalog.entries.find((entry) => entry.id === id))
    .filter(Boolean) as CatalogEntry[]
  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">M0 · CENSOR FIELD ARCHIVE</p>
          <h1>把規則帶上戰場，<br /><span>不要讓查書拖慢攻勢。</span></h1>
          <p className="hero-lede">以繁體中文快速搜尋招式、狀態與職業特性；需要核對時，一鍵展開英文正典。</p>
          <div className="hero-actions">
            <Link className="button primary" to="/compendium">進入規則庫 <span>→</span></Link>
            <Link className="button secondary" to="/compendium?type=ability&category=heroic">查看英雄招式</Link>
          </div>
          <p className="review-note"><span aria-hidden="true">◆</span> 目前為逐筆驗收版本；草稿狀態會在條目內清楚標示。</p>
        </div>
        <div className="hero-panel" aria-label="規則庫內容統計">
          <div className="sigil" aria-hidden="true"><span>Ⅰ</span></div>
          <p className="panel-kicker">THE CENSOR · LEVEL 1</p>
          <strong className="total-count">{catalog.counts.total}</strong>
          <span className="total-label">筆已結構化內容</span>
          <dl>
            <div><dt>招式</dt><dd>{catalog.counts.abilities}</dd></div>
            <div><dt>狀態</dt><dd>{catalog.counts.conditions}</dd></div>
            <div><dt>特性</dt><dd>{catalog.counts.features}</dd></div>
          </dl>
        </div>
      </section>

      <section className="home-section">
        <div className="section-heading">
          <div><p className="eyebrow">TACTICAL INDEX</p><h2>從你現在要做的事開始</h2></div>
          <Link to="/compendium">瀏覽全部 {catalog.counts.total} 筆 →</Link>
        </div>
        <div className="category-grid">
          <Link to="/compendium?type=ability"><span className="category-no">01</span><strong>招式</strong><small>攻擊、反應與戰術選項</small><b>{catalog.counts.abilities}</b></Link>
          <Link to="/compendium?type=condition"><span className="category-no">02</span><strong>狀態</strong><small>快速確認限制與解除方式</small><b>{catalog.counts.conditions}</b></Link>
          <Link to="/compendium?type=feature"><span className="category-no">03</span><strong>職業特性</strong><small>怒火、審判與教團規則</small><b>{catalog.counts.features}</b></Link>
        </div>
      </section>

      <section className="home-section featured-section">
        <div className="section-heading"><div><p className="eyebrow">FIELD PICKS</p><h2>先從核心規則開始</h2></div></div>
        <div className="entry-grid">{featured.map((entry) => <EntryCard key={entry.id} entry={entry} catalog={catalog} />)}</div>
      </section>
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
  const hasFilters = query || Object.values(filters).some(Boolean)
  const keywords = [...new Set(catalog.entries.flatMap((entry) => entry.tags.keywords))].sort()

  return (
    <main className="compendium-page">
      <header className="page-title">
        <p className="eyebrow">M0 COMPENDIUM</p>
        <h1>戰術規則庫</h1>
        <p>搜尋繁中、英文或別名，再用戰術條件縮小結果。</p>
      </header>
      <div className="search-bar">
        <span aria-hidden="true">⌕</span>
        <label className="sr-only" htmlFor="compendium-search">搜尋規則庫</label>
        <input id="compendium-search" type="search" value={query} onChange={(event) => update('q', event.target.value)} placeholder="搜尋招式、狀態、關鍵詞或英文名稱…" autoComplete="off" />
        {query && <button onClick={() => update('q', '')} aria-label="清除搜尋">×</button>}
      </div>
      <div className="compendium-layout">
        <aside className="filters" aria-label="篩選規則">
          <div className="filter-heading"><strong>縮小範圍</strong>{hasFilters && <button onClick={() => setParams({})}>全部清除</button>}</div>
          <FilterSelect id="filter-type" labelText="條目類型" value={filters.type} onChange={(v) => update('type', v)}>
            <option value="">全部類型</option><option value="ability">招式</option><option value="condition">狀態</option><option value="feature">特性</option>
          </FilterSelect>
          <FilterSelect id="filter-category" labelText="能力類別" value={filters.category} onChange={(v) => update('category', v)}>
            <option value="">全部類別</option>{Object.entries(catalog.labels['ability-categories']).map(([value, item]) => <option key={value} value={value}>{item.zhHant}</option>)}
          </FilterSelect>
          <FilterSelect id="filter-action" labelText="動作類型" value={filters.action} onChange={(v) => update('action', v)}>
            <option value="">全部動作</option>{Object.entries(catalog.labels['action-types']).map(([value, item]) => <option key={value} value={value}>{item.zhHant}</option>)}
          </FilterSelect>
          <FilterSelect id="filter-cost" labelText="怒火成本" value={filters.cost} onChange={(v) => update('cost', v)}>
            <option value="">全部成本</option><option value="0">無怒火成本</option><option value="3">3 怒火</option><option value="5">5 怒火</option>
          </FilterSelect>
          <FilterSelect id="filter-level" labelText="等級" value={filters.level} onChange={(v) => update('level', v)}>
            <option value="">全部等級</option><option value="1">等級 1</option>
          </FilterSelect>
          <FilterSelect id="filter-keyword" labelText="關鍵詞" value={filters.keyword} onChange={(v) => update('keyword', v)}>
            <option value="">全部關鍵詞</option>{keywords.map((value) => <option key={value} value={value}>{label(catalog, 'ability-keywords', value)}</option>)}
          </FilterSelect>
        </aside>
        <section className="results" aria-live="polite">
          <div className="results-heading"><strong>{results.length} 筆結果</strong><span>依名稱相關度排列</span></div>
          {results.length ? <div className="entry-grid">{results.map((entry) => <EntryCard key={entry.id} entry={entry} catalog={catalog} />)}</div> : (
            <div className="empty-state"><span>⌕</span><h2>沒有符合的條目</h2><p>試著減少篩選條件，或改用英文名稱搜尋。</p><button className="button primary" onClick={() => setParams({})}>清除所有條件</button></div>
          )}
        </section>
      </div>
    </main>
  )
}

function AbilityContent({ entry, catalog, byId }: { entry: CatalogEntry; catalog: Catalog; byId: Map<string, CatalogEntry> }) {
  const c = entry.content.canon
  const z = entry.content.zhHant
  const tiers = c.powerRoll?.tiers ?? []
  return <>
    <div className="ability-stats">
      <div><span>動作</span><strong>{label(catalog, 'action-types', c.actionType)}</strong></div>
      <div><span>費用</span><strong>{c.cost ? `${c.cost.value} 怒火` : '無'}</strong></div>
      <div><span>射程</span><strong>{distanceLabel(c.distance)}</strong></div>
      <div><span>目標</span><strong>{targetLabel(c.target)}</strong></div>
    </div>
    {c.trigger && <section className="rule-section"><div className="rule-heading"><h2>觸發</h2></div><p><RichText text={z.trigger} byId={byId} /></p></section>}
    {tiers.length > 0 && <section className="rule-section power-roll">
      <div className="rule-heading"><h2>檢定</h2><span>＋ {characteristicLabels[c.powerRoll.characteristic] ?? c.powerRoll.characteristic}</span></div>
      <div className="tier-list">{tiers.map((tier: any, index: number) => {
        const zTier = z.powerRoll.tiers[index]
        return <div className="tier" key={tier.threshold}>
          <b>{tier.threshold}</b>
          <div><p>
            <RichText text={zTier.text} byId={byId} />
            {tier.potency && <>；<span className="potency-tag">{characteristicLabels[tier.potency.characteristic] ?? tier.potency.characteristic} &lt; {label(catalog, 'potency-levels', tier.potency.level)}</span>，<RichText text={zTier.potencyEffect} byId={byId} /></>}
          </p></div>
        </div>
      })}</div>
    </section>}
    <EffectSection z={z} c={c} byId={byId} />
  </>
}

/** 招式的效果、追加花費、後續戰術，統一在同一個「效果」段落下方連續呈現——
 * 原版規則書把後續戰術寫在同一個 Effect: 段落裡，故不獨立成方框；
 * 但 extraCosts（花費 N 怒火）在書上是自己的引言＋句子，比照 Trigger／Effect 給獨立標題。 */
function EffectSection({ z, c, byId }: { z: any; c: any; byId: Map<string, CatalogEntry> }) {
  const effect: string[] = z.effect ?? []
  const followUpActions: any[] = z.followUpActions ?? []
  const extraCosts: any[] = z.extraCosts ?? []
  return <>
    {(effect.length > 0 || followUpActions.length > 0) && <section className="rule-section">
      <div className="rule-heading"><h2>效果</h2></div>
      {effect.map((text, index) => <p key={`e${index}`}><RichText text={text} byId={byId} /></p>)}
      {followUpActions.map((item, index) => <Fragment key={`f${index}`}>
        <p><RichText text={item.lead} byId={byId} /></p>
        <ol>{item.options.map((option: string, optionIndex: number) => <li key={optionIndex}><RichText text={option} byId={byId} /></li>)}</ol>
        <p><RichText text={item.constraint} byId={byId} /></p>
      </Fragment>)}
    </section>}
    {extraCosts.map((item, index) => <section className="rule-section" key={index}>
      <div className="rule-heading"><h2>花費 {c.extraCosts[index].value} 點怒火</h2></div>
      <p><RichText text={item.effect} byId={byId} /></p>
    </section>)}
  </>
}

function RuleSection({ title, items, byId }: { title: string; items: string[]; byId: Map<string, CatalogEntry> }) {
  return <section className="rule-section"><div className="rule-heading"><h2>{title}</h2></div>{items.map((text) => <p key={text}><RichText text={text} byId={byId} /></p>)}</section>
}

function FeatureContent({ entry, byId }: { entry: CatalogEntry; byId: Map<string, CatalogEntry> }) {
  const sections = entry.content.zhHant.sections ?? []
  return <>{sections.map((section: any, index: number) => <section className="rule-section" key={index}>
    {section.heading && <div className="rule-heading"><h2>{section.heading}</h2></div>}
    {section.blocks.map((block: any, blockIndex: number) => <Fragment key={blockIndex}>
      {block.kind === 'paragraph' && <p><RichText text={block.text} byId={byId} /></p>}
      {block.kind === 'bulletList' && <><p><RichText text={block.lead} byId={byId} /></p><ul>{block.items.map((item: string) => <li key={item}><RichText text={item} byId={byId} /></li>)}</ul></>}
      {block.kind === 'definitionList' && <dl className="definition-list">{block.items.map((item: any) => <div key={item.term}><dt>{item.term}</dt><dd><RichText text={item.text} byId={byId} /></dd></div>)}</dl>}
    </Fragment>)}
  </section>)}</>
}

function Detail({ catalog }: { catalog: Catalog }) {
  const { type, slug } = useParams()
  const entry = catalog.entries.find((item) => item.type === type && item.slug === slug)
  const byId = useMemo(() => new Map(catalog.entries.map((item) => [item.id, item])), [catalog])
  if (!entry) return <main className="not-found"><p className="eyebrow">404 · LOST REFERENCE</p><h1>找不到這筆規則</h1><p>它可能不在 M0 收錄範圍內，或網址已變更。</p><Link className="button primary" to="/compendium">回到規則庫</Link></main>
  const z = entry.content.zhHant
  const c = entry.content.canon
  const isDraft = entry.reviewStatus.canon !== 'verified' || entry.reviewStatus.zhHant !== 'reviewed'

  return <main className="detail-page">
    <nav className="breadcrumb" aria-label="麵包屑"><Link to="/compendium">規則庫</Link><span>/</span><Link to={`/compendium?type=${entry.type}`}>{typeLabels[entry.type]}</Link><span>/</span><span>{entry.name.zhHant}</span></nav>
    {isDraft && <div className="draft-banner"><strong>逐筆驗收中</strong><span>這筆內容尚未獲得完整的擁有者核准；可先檢查呈現與資料結構。</span></div>}
    <article className="detail-shell">
      <header className="detail-header">
        <div><div className="detail-badges"><EntryBadge entry={entry} />{entry.tags.abilityCategory && <span>{label(catalog, 'ability-categories', entry.tags.abilityCategory)}</span>}</div>
          <h1>{entry.name.zhHant}</h1><p className="english-name">{entry.name.en}</p>{z.flavor && <blockquote>{isQuotedFlavor(c.flavor) ? `「${z.flavor}」` : z.flavor}</blockquote>}
        </div>
        <div className="source-stamp"><span>HEROES</span><strong>V{entry.source.version}</strong><small>印刷頁 {entry.source.printedPage}</small></div>
      </header>
      <div className="keyword-strip">{entry.tags.keywords.map((keyword) => <span key={keyword}>{label(catalog, 'ability-keywords', keyword)}</span>)}</div>
      <div className="detail-content">
        {entry.type === 'ability' && <AbilityContent entry={entry} catalog={catalog} byId={byId} />}
        {entry.type === 'condition' && <RuleSection title="規則" items={z.text ?? []} byId={byId} />}
        {entry.type === 'feature' && <FeatureContent entry={entry} byId={byId} />}
        {entry.relatedIds.length > 0 && <section className="related"><h2>相關條目</h2><div>{entry.relatedIds.map((id) => { const related = byId.get(id)!; return <Link key={id} to={routeOf(related)}><EntryBadge entry={related} /><span><strong>{related.name.zhHant}</strong><small>{related.name.en}</small></span><b>→</b></Link> })}</div></section>}
        <details className="english-panel"><summary><span>核對英文正典</span><small>English canon</small></summary><div><h2>{c.name}</h2>{c.flavor && <blockquote>{c.flavor}</blockquote>}<pre>{JSON.stringify(c, (key, value) => ['$comment', 'normalizedHash'].includes(key) ? undefined : value, 2)}</pre></div></details>
      </div>
    </article>
  </main>
}

export default function App() {
  const [catalog, setCatalog] = useState<Catalog | null>(null)
  const [error, setError] = useState('')
  useEffect(() => { loadCatalog().then(setCatalog).catch((reason) => setError(reason instanceof Error ? reason.message : String(reason))) }, [])
  if (error) return <main className="load-state"><h1>無法載入規則資料</h1><p>{error}</p></main>
  if (!catalog) return <main className="load-state" aria-live="polite"><div className="loader" /><p>正在展開戰術檔案…</p></main>
  return <div className="app-shell"><Header /><Routes><Route path="/" element={<Home catalog={catalog} />} /><Route path="/compendium" element={<Compendium catalog={catalog} />} /><Route path="/compendium/:type/:slug" element={<Detail catalog={catalog} />} /><Route path="*" element={<Detail catalog={catalog} />} /></Routes><Footer /></div>
}

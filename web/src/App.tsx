import { Fragment, useEffect, useMemo, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { Link, NavLink, Route, Routes, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { loadCatalog } from './catalog'
import { applyFilters } from './search'
import type { Catalog, CatalogEntry, EntryType, Filters } from './types'

const typeLabels = { ability: '招式', condition: '狀態', feature: '特性' }
const typeNames: Record<EntryType, { zhHant: string; en: string }> = {
  ability: { zhHant: '招式', en: 'Abilities' },
  condition: { zhHant: '狀態', en: 'Conditions' },
  feature: { zhHant: '職業特性', en: 'Features' },
}
const typeOrder: EntryType[] = ['ability', 'condition', 'feature']
const tocIndex = ['一', '二', '三']
const characteristicLabels: Record<string, string> = {
  might: '力量', agility: '敏捷', reason: '理性', intuition: '直覺', presence: '氣場', choice: '任選',
}

/** powerRoll.characteristic 可能是字串，也可能是 { kind:'choice', options:[…] }（兩個基礎打擊都是
 * 「力量或敏捷」）。直接把物件丟進 JSX 會讓整頁崩成空白，所以一律走這個函式。 */
function characteristicLabel(value: any): string {
  if (!value) return ''
  if (typeof value === 'string') return characteristicLabels[value] ?? value
  if (value.kind === 'choice') return (value.options ?? []).map((option: string) => characteristicLabels[option] ?? option).join('或')
  return value.raw ?? ''
}

/** 官方符號字型的字元對應，出自官方字符表 sources/drawsteelglyphs/Draw Steel Glyphs Chart.pdf，非推測。
 * 圓角屬性框（AIMPR）用在傷害算式；階層徽章 á/é/í 對應 ≤11／12-16／17+；o 是距離、x 是目標。 */
const glyphChars = { distance: 'o', target: 'x' }
const tierGlyphs = ['á', 'é', 'í']
const attributeNames = new Set(['力量', '敏捷', '理性', '直覺', '氣場'])

/** 符號本身對輔助技術沒有意義（字型把 o、á 這些拉丁字元畫成圖示），一律隱藏並補等值文字。 */
function Glyph({ char, label }: { char: string; label: string }) {
  return <span className="glyph-wrap"><span className="glyph" aria-hidden="true">{char}</span><span className="sr-only">{label}</span></span>
}

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

/** 摘要是純文字顯示，把資料層的行內標記（`術語` 與 [標籤](實體 id)）還原成可讀文字。 */
function plainText(text: string): string {
  return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1').replace(/`([^`]+)`/g, '$1')
}

function SearchIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m15.5 15.5 4 4" strokeLinecap="round" />
    </svg>
  )
}

/** attributeBadges 只在傷害算式（powerRoll 階層文字）開啟——原版規則書也只有那裡把屬性做成方框，
 * 內文提到力量、敏捷時是寫字不是畫框。徽章用中文加黑底白字，與效力記號同一套視覺。 */
function RichText({ text, byId, attributeBadges = false }: { text: string; byId: Map<string, CatalogEntry>; attributeBadges?: boolean }) {
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
    } else if (attributeBadges && attributeNames.has(match[3])) {
      nodes.push(<span key={match.index} className="attr-tag">{match[3]}</span>)
    } else {
      nodes.push(<strong key={match.index} className="term">{match[3]}</strong>)
    }
    cursor = pattern.lastIndex
  }
  if (cursor < text.length) nodes.push(text.slice(cursor))
  return <>{nodes}</>
}

function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const [draft, setDraft] = useState('')
  const onCompendium = location.pathname === '/compendium'

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const value = draft.trim()
    navigate(value ? `/compendium?q=${encodeURIComponent(value)}` : '/compendium')
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
        <span>非官方中文資料庫 · M0 驗收版</span>
        <span>資料來源：Draw Steel Heroes v1.01</span>
        <span>符號字型 Draw Steel Glyphs © 2025 MCDM Productions，採用 <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a> 授權</span>
      </div>
    </footer>
  )
}

function EntryRow({ entry, catalog, showKind }: { entry: CatalogEntry; catalog: Catalog; showKind: boolean }) {
  return (
    <li>
      <Link className="entry-row" to={routeOf(entry)}>
        <span>
          <span className="entry-name">{entry.name.zhHant}</span>
          <span className="entry-en">{entry.name.en}</span>
          <span className="entry-summary">{entry.summary ? plainText(entry.summary) : '查看完整規則內容與英文原文。'}</span>
        </span>
        <span className="entry-meta">
          {showKind && <span className={`kind kind-${entry.type}`}>{typeLabels[entry.type]}</span>}
          {entry.tags.abilityCategory && <span>{label(catalog, 'ability-categories', entry.tags.abilityCategory)}</span>}
          {entry.tags.actionType && <span>{label(catalog, 'action-types', entry.tags.actionType)}</span>}
          {entry.tags.cost && <span className="cost">{entry.tags.cost.value} 怒火</span>}
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
    navigate(value ? `/compendium?q=${encodeURIComponent(value)}` : '/compendium')
  }

  return (
    <main className="home">
      <section className="frontispiece">
        <h1>英雄爭鋒</h1>
        <p className="frontispiece-en">Draw Steel 中文資料庫</p>
        <p className="frontispiece-lede">懲戒者第 1 等級的招式、狀態與職業特性，共 {catalog.counts.total} 筆。中文對照英文正典，跑團時直接查。</p>
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
            <Link className="toc-row" to={`/compendium?type=${type}`}>
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
            <li key={entry.id}><Link to={routeOf(entry)}>{entry.name.zhHant}</Link></li>
          ))}
        </ul>
      </div>
      <div className="quick-group">
        <h3>職業特性</h3>
        <ul className="link-list">
          {byType('feature').map((entry) => (
            <li key={entry.id}><Link to={routeOf(entry)}>{entry.name.zhHant}<small>{entry.name.en}</small></Link></li>
          ))}
        </ul>
      </div>

      <p className="colophon">
        本站為非官方中文資料庫，目前收錄 M0 範圍共 {catalog.counts.total} 筆，皆已逐筆核對英文正典。
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
  /** 等級篩選只有在資料真的有多個等級時才有意義；M0 全是等級 1，就不顯示這個選項。 */
  const levels = [...new Set(catalog.entries.map((entry) => entry.level).filter((value): value is number => value != null))].sort((a, b) => a - b)
  const costLabels: Record<string, string> = { '0': '無怒火成本', '3': '3 怒火', '5': '5 怒火' }
  const activeFilters = [
    query && { key: 'q', text: `搜尋：${query}` },
    filters.type && { key: 'type', text: typeLabels[filters.type as EntryType] ?? filters.type },
    filters.category && { key: 'category', text: label(catalog, 'ability-categories', filters.category) },
    filters.action && { key: 'action', text: label(catalog, 'action-types', filters.action) },
    filters.cost && { key: 'cost', text: costLabels[filters.cost] ?? `${filters.cost} 怒火` },
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
        <FilterSelect id="filter-cost" labelText="怒火成本" value={filters.cost} onChange={(v) => update('cost', v)}>
          <option value="">全部成本</option><option value="0">無怒火成本</option><option value="3">3 怒火</option><option value="5">5 怒火</option>
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

/** 招式排版仿原版規則書的卡片：名稱＋費用同行、引言在關鍵詞上方、射程與目標用官方符號、
 * 段落標題內嵌成粗體引導詞，全卡只有兩條分隔線。 */
function AbilityContent({ entry, catalog, byId }: { entry: CatalogEntry; catalog: Catalog; byId: Map<string, CatalogEntry> }) {
  const c = entry.content.canon
  const z = entry.content.zhHant
  const tiers = c.powerRoll?.tiers ?? []
  return <>
    <div className="card-bar">
      <div className="bar-row">
        {entry.tags.keywords.length > 0 && <ul className="sheet-keywords">
          {entry.tags.keywords.map((keyword) => <li key={keyword}>{label(catalog, 'ability-keywords', keyword)}</li>)}
        </ul>}
        <span>{label(catalog, 'action-types', c.actionType)}</span>
      </div>
      <div className="bar-row">
        <span><Glyph char={glyphChars.distance} label="射程" />{distanceLabel(c.distance)}</span>
        <span><Glyph char={glyphChars.target} label="目標" />{targetLabel(c.target)}</span>
      </div>
    </div>
    <div className="card-body">
      {c.trigger && <p><b className="card-label">觸發</b><RichText text={z.trigger} byId={byId} /></p>}
      {tiers.length > 0 && <>
        <p className="power-roll-label">檢定 ＋ {characteristicLabel(c.powerRoll.characteristic)}</p>
        <div className="tier-list">{tiers.map((tier: any, index: number) => {
          const zTier = z.powerRoll.tiers[index]
          return <p className="tier" key={tier.threshold}>
            <Glyph char={tierGlyphs[index] ?? ''} label={tier.threshold} />
            <span>
              <RichText text={zTier.text} byId={byId} attributeBadges />
              {tier.potency && <>；<span className="potency-tag">{characteristicLabel(tier.potency.characteristic)} &lt; {label(catalog, 'potency-levels', tier.potency.level)}</span>，<RichText text={zTier.potencyEffect} byId={byId} /></>}
            </span>
          </p>
        })}</div>
      </>}
      <EffectSection z={z} c={c} byId={byId} />
    </div>
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
    {(effect.length > 0 || followUpActions.length > 0) && <>
      {effect.map((text, index) => <p key={`e${index}`}>
        {index === 0 && <b className="card-label">效果</b>}
        <RichText text={text} byId={byId} />
      </p>)}
      {followUpActions.map((item, index) => <Fragment key={`f${index}`}>
        <p>{effect.length === 0 && index === 0 && <b className="card-label">效果</b>}<RichText text={item.lead} byId={byId} /></p>
        <ol>{item.options.map((option: string, optionIndex: number) => <li key={optionIndex}><RichText text={option} byId={byId} /></li>)}</ol>
        <p><RichText text={item.constraint} byId={byId} /></p>
      </Fragment>)}
    </>}
    {extraCosts.map((item, index) => <p key={index}>
      <b className="card-label">花費 {c.extraCosts[index].value} 怒火</b><RichText text={item.effect} byId={byId} />
    </p>)}
  </>
}

/** 狀態沒有標題——條目名稱本身就是標題，再加一個「規則」小標只是多一條分隔線。 */
function ConditionContent({ items, byId }: { items: string[]; byId: Map<string, CatalogEntry> }) {
  return <div className="card-body">{items.map((text) => <p key={text}><RichText text={text} byId={byId} /></p>)}</div>
}

function FeatureContent({ entry, byId }: { entry: CatalogEntry; byId: Map<string, CatalogEntry> }) {
  const sections = entry.content.zhHant.sections ?? []
  return <div className="card-body">{sections.map((section: any, index: number) => <section className="rule-section" key={index}>
    {section.heading && <h2>{section.heading}</h2>}
    {section.blocks.map((block: any, blockIndex: number) => <Fragment key={blockIndex}>
      {block.kind === 'paragraph' && <p><RichText text={block.text} byId={byId} /></p>}
      {block.kind === 'bulletList' && <><p><RichText text={block.lead} byId={byId} /></p><ul>{block.items.map((item: string) => <li key={item}><RichText text={item} byId={byId} /></li>)}</ul></>}
      {block.kind === 'definitionList' && <dl className="definition-list">{block.items.map((item: any) => <div key={item.term}><dt>{item.term}</dt><dd><RichText text={item.text} byId={byId} /></dd></div>)}</dl>}
    </Fragment>)}
  </section>)}</div>
}

function Detail({ catalog }: { catalog: Catalog }) {
  const { type, slug } = useParams()
  const entry = catalog.entries.find((item) => item.type === type && item.slug === slug)
  const byId = useMemo(() => new Map(catalog.entries.map((item) => [item.id, item])), [catalog])
  if (!entry) return <main className="state-page"><h1>找不到這筆規則</h1><p>它可能不在 M0 收錄範圍內，或網址已變更。</p><Link className="link-button" to="/compendium">回到規則庫</Link></main>
  const z = entry.content.zhHant
  const c = entry.content.canon
  const isDraft = entry.reviewStatus.canon !== 'verified' || entry.reviewStatus.zhHant !== 'reviewed'

  return <main className="detail">
    <nav className="breadcrumb" aria-label="麵包屑"><Link to="/compendium">規則庫</Link><span>/</span><Link to={`/compendium?type=${entry.type}`}>{typeLabels[entry.type]}</Link><span>/</span><span>{entry.name.zhHant}</span></nav>
    {isDraft && <div className="notice"><strong>逐筆驗收中：</strong>這筆內容尚未獲得完整的擁有者核准；可先檢查呈現與資料結構。</div>}
    {/* 不用斜線也不用紅色——那兩者在本站都是「可點擊的麵包屑」的視覺語彙。 */}
    <p className="sheet-kind">
      <span className="sheet-kind-label">分類</span>
      {[typeLabels[entry.type],
        entry.tags.abilityCategory && label(catalog, 'ability-categories', entry.tags.abilityCategory),
        entry.level && `等級 ${entry.level}`,
      ].filter(Boolean).join('・')}
    </p>
    <article className="rule-card">
      <header className="card-head">
        <div className="card-title-row">
          <div>
            <h1>{entry.name.zhHant}</h1>
            <p className="sheet-en">{entry.name.en}</p>
          </div>
          {entry.tags.cost && <span className="card-cost">{entry.tags.cost.value} 怒火</span>}
        </div>
        {z.flavor && <p className="card-flavor">{isQuotedFlavor(c.flavor) ? `「${z.flavor}」` : z.flavor}</p>}
      </header>
      {entry.type === 'ability' && <AbilityContent entry={entry} catalog={catalog} byId={byId} />}
      {entry.type === 'condition' && <ConditionContent items={z.text ?? []} byId={byId} />}
      {entry.type === 'feature' && <FeatureContent entry={entry} byId={byId} />}
    </article>
    {entry.relatedIds.length > 0 && <section className="related">
      <h2>相關條目</h2>
      <ul>{entry.relatedIds.map((id) => { const related = byId.get(id)!; return <li key={id}><Link to={routeOf(related)}><span className={`kind kind-${related.type}`}>{typeLabels[related.type]}</span><strong>{related.name.zhHant}</strong><small>{related.name.en}</small></Link></li> })}</ul>
    </section>}
    <details className="canon-panel"><summary><span>核對英文正典</span><small>English canon</small></summary><div><h2>{c.name}</h2>{c.flavor && <blockquote>{c.flavor}</blockquote>}<pre>{JSON.stringify(c, (key, value) => ['$comment', 'normalizedHash'].includes(key) ? undefined : value, 2)}</pre></div></details>
    <p className="sheet-foot">Draw Steel Heroes v{entry.source.version} · 印刷頁 {entry.source.printedPage}</p>
  </main>
}

export default function App() {
  const [catalog, setCatalog] = useState<Catalog | null>(null)
  const [error, setError] = useState('')
  useEffect(() => { loadCatalog().then(setCatalog).catch((reason) => setError(reason instanceof Error ? reason.message : String(reason))) }, [])
  if (error) return <main className="state-page"><h1>無法載入規則資料</h1><p>{error}</p></main>
  if (!catalog) return <main className="state-page" aria-live="polite"><p>載入中…</p></main>
  return <div className="app-shell"><Header /><Routes><Route path="/" element={<Home catalog={catalog} />} /><Route path="/compendium" element={<Compendium catalog={catalog} />} /><Route path="/compendium/:type/:slug" element={<Detail catalog={catalog} />} /><Route path="*" element={<Detail catalog={catalog} />} /></Routes><Footer /></div>
}

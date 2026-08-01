import { Fragment } from 'react'
import type { ElementType } from 'react'
import { Link } from 'react-router-dom'
import type { Catalog, CatalogEntry } from '../types'
import { buildEntryRoute } from '../routes'
import {
  GLYPH, TIER_GLYPHS,
  characteristicLabel, costLabel, distanceLabel, parseRichText, plainText, potencyLabel, targetLabel,
} from '../../../shared/canon-format.mjs'

export const entryTypeLabels = { ability: '招式', condition: '狀態', feature: '範型特性' }

export type EntryCardPresentation = 'summary' | 'expanded' | 'detail'

function label(catalog: Catalog, group: string, value?: string | null) {
  return value ? catalog.labels[group]?.[value]?.zhHant ?? value : '—'
}

function Glyph({ char, label: glyphLabel }: { char: string; label: string }) {
  return <span className="glyph-wrap"><span className="glyph" aria-hidden="true">{char}</span><span className="sr-only">{glyphLabel}</span></span>
}

function RichText({ text, byId, attributeBadges = false, entryRoute = buildEntryRoute }: {
  text: string
  byId: Map<string, CatalogEntry>
  attributeBadges?: boolean
  entryRoute?: (entry: CatalogEntry) => string
}) {
  return <>{parseRichText(text).map((token, index) => {
    if (token.kind === 'ref') {
      const target = byId.get(token.id)
      return target
        ? <Link key={index} className="entity-link" to={entryRoute(target)}>{token.text}</Link>
        : <span key={index}>{token.text}</span>
    }
    if (token.kind === 'term') {
      return attributeBadges && token.isAttribute
        ? <span key={index} className="attr-tag">{token.text}</span>
        : <strong key={index} className="term">{token.text}</strong>
    }
    return <Fragment key={index}>{token.text}</Fragment>
  })}</>
}

function AbilityContent({ entry, catalog, byId, entryRoute }: {
  entry: CatalogEntry
  catalog: Catalog
  byId: Map<string, CatalogEntry>
  entryRoute: (entry: CatalogEntry) => string
}) {
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
        <span><Glyph char={GLYPH.distance} label="射程" />{distanceLabel(c.distance)}</span>
        <span><Glyph char={GLYPH.target} label="目標" />{targetLabel(c.target)}</span>
      </div>
    </div>
    <div className="card-body">
      {c.trigger && <p><b className="card-label">觸發</b><RichText text={z.trigger} byId={byId} entryRoute={entryRoute} /></p>}
      {tiers.length > 0 && <>
        <p className="power-roll-label">檢定 ＋ {characteristicLabel(c.powerRoll.characteristic)}</p>
        <div className="tier-list">{tiers.map((tier: any, index: number) => {
          const zTier = z.powerRoll.tiers[index]
          return <p className="tier" key={tier.threshold}>
            <Glyph char={TIER_GLYPHS[index] ?? ''} label={tier.threshold} />
            <span>
              <RichText text={zTier.text} byId={byId} attributeBadges entryRoute={entryRoute} />
              {tier.potency && <>；<span className="potency-tag">{potencyLabel(tier.potency, catalog.labels['potency-levels'])}</span>，<RichText text={zTier.potencyEffect} byId={byId} entryRoute={entryRoute} /></>}
            </span>
          </p>
        })}</div>
      </>}
      <EffectSection z={z} c={c} byId={byId} entryRoute={entryRoute} />
    </div>
  </>
}

function EffectSection({ z, c, byId, entryRoute }: {
  z: any
  c: any
  byId: Map<string, CatalogEntry>
  entryRoute: (entry: CatalogEntry) => string
}) {
  const effect: string[] = z.effect ?? []
  const followUpActions: any[] = z.followUpActions ?? []
  const extraCosts: any[] = z.extraCosts ?? []
  return <>
    {(effect.length > 0 || followUpActions.length > 0) && <>
      {effect.map((text, index) => <p key={`e${index}`}>
        {index === 0 && <b className="card-label">效果</b>}
        <RichText text={text} byId={byId} entryRoute={entryRoute} />
      </p>)}
      {followUpActions.map((item, index) => <Fragment key={`f${index}`}>
        <p>{effect.length === 0 && index === 0 && <b className="card-label">效果</b>}<RichText text={item.lead} byId={byId} entryRoute={entryRoute} /></p>
        <ol>{item.options.map((option: string, optionIndex: number) => <li key={optionIndex}><RichText text={option} byId={byId} entryRoute={entryRoute} /></li>)}</ol>
        <p><RichText text={item.constraint} byId={byId} entryRoute={entryRoute} /></p>
      </Fragment>)}
    </>}
    {extraCosts.map((item, index) => <Fragment key={index}>
      <p>
        <b className="card-label">花費 {costLabel(c.extraCosts[index])}</b>
        <RichText text={item.effect ?? item.lead} byId={byId} entryRoute={entryRoute} />
      </p>
      {item.options && <ul>{item.options.map((option: string, optionIndex: number) => <li key={optionIndex}><RichText text={option} byId={byId} entryRoute={entryRoute} /></li>)}</ul>}
    </Fragment>)}
  </>
}

function ConditionContent({ items, byId, entryRoute }: {
  items: string[]
  byId: Map<string, CatalogEntry>
  entryRoute: (entry: CatalogEntry) => string
}) {
  return <div className="card-body">{items.map((text) => <p key={text}><RichText text={text} byId={byId} entryRoute={entryRoute} /></p>)}</div>
}

function FeatureContent({ entry, byId, entryRoute }: {
  entry: CatalogEntry
  byId: Map<string, CatalogEntry>
  entryRoute: (entry: CatalogEntry) => string
}) {
  const sections = entry.content.zhHant.sections ?? []
  return <div className="card-body">{sections.map((section: any, index: number) => <section className="rule-section" key={index}>
    {section.heading && <h2>{section.heading}</h2>}
    {section.blocks.map((block: any, blockIndex: number) => <Fragment key={blockIndex}>
      {block.kind === 'paragraph' && <p><RichText text={block.text} byId={byId} entryRoute={entryRoute} /></p>}
      {block.kind === 'bulletList' && <><p><RichText text={block.lead} byId={byId} entryRoute={entryRoute} /></p><ul>{block.items.map((item: string) => <li key={item}><RichText text={item} byId={byId} entryRoute={entryRoute} /></li>)}</ul></>}
      {block.kind === 'definitionList' && <dl className="definition-list">{block.items.map((item: any) => <div key={item.term}><dt>{item.term}</dt><dd><RichText text={item.text} byId={byId} entryRoute={entryRoute} /></dd></div>)}</dl>}
    </Fragment>)}
  </section>)}</div>
}

function isQuotedFlavor(canonFlavor?: string | null): boolean {
  return !!canonFlavor && /^["“]/.test(canonFlavor.trim())
}

export function EntryCard({ entry, catalog, byId, presentation = 'detail', entryRoute = buildEntryRoute }: {
  entry: CatalogEntry
  catalog: Catalog
  byId: Map<string, CatalogEntry>
  presentation?: EntryCardPresentation
  entryRoute?: (entry: CatalogEntry) => string
}) {
  if (presentation === 'summary') {
    return <li data-entry-presentation="summary">
      <Link className="entry-row" to={entryRoute(entry)}>
        <span>
          <span className="entry-name">{entry.name.zhHant}</span>
          <span className="entry-en">{entry.name.en}</span>
          <span className="entry-summary">{entry.summary ? plainText(entry.summary) : '查看完整規則內容與英文原文。'}</span>
        </span>
        <span className="entry-meta"><span className={`kind kind-${entry.type}`}>{entryTypeLabels[entry.type]}</span></span>
      </Link>
    </li>
  }

  const z = entry.content.zhHant
  const c = entry.content.canon
  const headingLevel = presentation === 'expanded' ? 2 : 1
  const Heading = `h${headingLevel}` as ElementType
  return <article className="rule-card" data-entry-presentation={presentation}>
    <header className="card-head">
      <div className="card-title-row">
        <div>
          <Heading>{entry.name.zhHant}</Heading>
          <p className="sheet-en">{entry.name.en}</p>
        </div>
        {entry.tags.cost && <span className="card-cost">{costLabel(entry.tags.cost)}</span>}
      </div>
      {z.flavor && <p className="card-flavor">{isQuotedFlavor(c.flavor as string | undefined) ? `「${z.flavor}」` : z.flavor}</p>}
      {z.usageNote && <p className="card-usage-note"><RichText text={z.usageNote} byId={byId} entryRoute={entryRoute} /></p>}
    </header>
    {entry.type === 'ability' && <AbilityContent entry={entry} catalog={catalog} byId={byId} entryRoute={entryRoute} />}
    {entry.type === 'condition' && <ConditionContent items={z.text ?? []} byId={byId} entryRoute={entryRoute} />}
    {entry.type === 'feature' && <FeatureContent entry={entry} byId={byId} entryRoute={entryRoute} />}
  </article>
}

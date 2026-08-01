import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, test } from 'vitest'
import catalogData from '../../public/data/catalog.json'
import milestoneData from '../../../releases/milestones/m1.json'
import type { Catalog, CatalogEntry } from '../types'
import { ClassShell } from './ClassShell'
import { validateManifestIntegrity, validateRegistryIntegrity } from './integrity'
import { manifestEntryIds, resolveClassEntry, resolveEntryRoute } from './resolver'
import { classManifestOrder, classManifestRegistry } from './registry'
import { conduitManifest } from './conduitManifest'
import type { ClassManifest, ManifestEntry } from './types'
import { fixtureClassManifest, fixtureOrder, fixtureRegistry } from './__fixtures__/classManifest'

const catalog = catalogData as unknown as Catalog
const byId = new Map(catalog.entries.map((entry) => [entry.id, entry]))

describe('Manifest integrity validation', () => {
  test('空 registry 與 fixture registry 都能通過 generic validator', () => {
    expect(validateRegistryIntegrity({}, [], catalog)).toEqual([])
    expect(validateRegistryIntegrity(fixtureRegistry, fixtureOrder, catalog)).toEqual([])
  })

  test('production registry 只包含神導士，且通過完整性驗證', () => {
    expect(classManifestOrder).toEqual(['class.conduit'])
    expect(classManifestRegistry).toEqual({ 'class.conduit': conduitManifest })
    expect(validateRegistryIntegrity(classManifestRegistry, classManifestOrder, catalog)).toEqual([])
  })

  test('manifest scope 與正式 M1 milestone ids 完全相等', () => {
    const manifestIds = manifestEntryIds(conduitManifest)
    const milestoneIds = new Set(milestoneData.ids)
    expect(milestoneIds.size).toBe(milestoneData.ids.length)
    expect(manifestIds).toEqual(milestoneIds)
    expect(manifestIds.size).toBe(41)
  })

  test('section 順序與 presentation 是獨立契約', () => {
    expect(conduitManifest.sections.map((section) => section.id)).toEqual([
      'core-resources', 'signature-abilities', 'inherent-abilities', 'triggered-actions',
      'heroic-abilities', 'three-piety-abilities', 'five-piety-abilities', 'prayer',
      'conduit-ward', 'domain-piety-and-effects', 'domain-feature-table', 'domain-features',
      'domain-abilities',
    ])
    const manifestEntries = conduitManifest.sections.reduce<ManifestEntry[]>((all, section) => [...all, ...section.entries], [])
    const expandedIds = manifestEntries
      .filter((entry) => entry.presentation === 'expanded').map((entry) => entry.id)
    expect(expandedIds).toEqual([
      'feature.conduit.piety', 'feature.conduit.deity-and-domains', 'feature.conduit.conduit-abilities',
      'feature.conduit.triggered-action', 'feature.conduit.heroic-abilities', 'feature.conduit.prayer',
      'feature.conduit.conduit-ward', 'feature.conduit.domain-piety-and-effects',
      'feature.conduit.domain-feature-1st-level',
    ])
  })

  test('generic validator rejects empty and duplicate IDs', () => {
    const invalid: ClassManifest = {
      ...fixtureClassManifest,
      sections: [
        { kind: 'entries', id: '', heading: '空白', entries: [{ id: '' }, { id: 'ability.censor.arrest' }] },
        { kind: 'entries', id: 'same', heading: '重複', entries: [{ id: 'ability.censor.arrest' }] },
        { kind: 'entries', id: 'same', heading: '重複', entries: [] },
      ],
    }
    expect(validateManifestIntegrity(invalid, catalog).map((issue) => issue.code)).toEqual(expect.arrayContaining([
      'empty-section-id', 'empty-entry-id', 'duplicate-entry-id', 'duplicate-section-id',
    ]))
  })

  test('registry key、order 與 object key 順序分離', () => {
    const issues = validateRegistryIntegrity({ wrong: fixtureClassManifest }, ['missing', 'missing'], catalog)
    expect(issues.map((issue) => issue.code)).toEqual(expect.arrayContaining([
      'registry-key-mismatch', 'unknown-order-id', 'duplicate-order-id', 'unordered-registry-id',
    ]))
    expect(fixtureOrder).toEqual(['class.fixture-alternate', 'class.fixture'])
    expect(Object.keys(fixtureRegistry)).toEqual(['class.fixture', 'class.fixture-alternate'])
  })
})

describe('範型 route resolver', () => {
  const arrest = byId.get('ability.censor.arrest')!
  const unrelated = byId.get('ability.censor.back-blasphemer')!
  const domainAbility = byId.get('ability.conduit.faithful-friend')!

  test('manifest 內條目使用 class-scoped URL，外部條目使用 standalone URL', () => {
    expect(resolveEntryRoute({ currentManifest: fixtureClassManifest, entry: arrest })).toBe('/compendium/classes/class.fixture/ability/censor-arrest')
    expect(resolveEntryRoute({ currentManifest: fixtureClassManifest, entry: unrelated })).toBe('/compendium/ability/censor-back-blasphemer')
    expect(resolveEntryRoute({ currentManifest: conduitManifest, entry: domainAbility })).toBe('/compendium/classes/class.conduit/ability/conduit-faithful-friend')
  })

  test('domain-origin 條目由 manifest 明確收錄並可解析', () => {
    const resolved = resolveClassEntry({
      registry: classManifestRegistry,
      catalog,
      classId: 'class.conduit',
      type: domainAbility.type,
      slug: domainAbility.slug,
    })
    expect(resolved?.entry.id).toBe(domainAbility.id)
    expect(domainAbility.origin).toEqual({ kind: 'domain', id: 'domain.nature' })
  })

  test('未知 class、未知條目與未列入 manifest 的條目都被拒絕', () => {
    expect(resolveClassEntry({ registry: fixtureRegistry, catalog, classId: 'unknown', type: arrest.type, slug: arrest.slug })).toBeNull()
    expect(resolveClassEntry({ registry: fixtureRegistry, catalog, classId: fixtureClassManifest.classId, type: 'ability', slug: 'missing' })).toBeNull()
    expect(resolveClassEntry({ registry: fixtureRegistry, catalog, classId: fixtureClassManifest.classId, type: unrelated.type, slug: unrelated.slug })).toBeNull()
    expect(resolveClassEntry({ registry: classManifestRegistry, catalog, classId: 'class.conduit', type: unrelated.type, slug: unrelated.slug })).toBeNull()
  })
})

describe('ClassIndex', () => {
  test('從 registry/order 產生神導士入口，而非硬寫專用頁面', async () => {
    const { ClassIndex } = await import('./ClassRoutes')
    render(<MemoryRouter><ClassIndex /></MemoryRouter>)
    expect(screen.getByRole('heading', { level: 1, name: '範型' })).toBeInTheDocument()
    const link = screen.getByRole('link', { name: /神導士.*Conduit/ })
    expect(link).toHaveAttribute('href', '/compendium/classes/class.conduit')
    expect(link).toHaveTextContent('41 筆條目')
    expect(screen.queryByText('尚未收錄')).not.toBeInTheDocument()
  })
})

describe('ClassShell', () => {
  function renderShell(pageState: 'overview' | 'detail' = 'overview', activeEntry?: CatalogEntry) {
    return render(<MemoryRouter initialEntries={['/compendium/classes/class.fixture']}>
      <ClassShell catalog={catalog} manifest={fixtureClassManifest} registry={fixtureRegistry} order={fixtureOrder} pageState={pageState} activeEntry={activeEntry} />
    </MemoryRouter>)
  }

  test('overview 共用 summary／expanded EntryCard 並使用正確 heading level', () => {
    renderShell()
    expect(screen.getByRole('heading', { level: 1, name: '測試範型' })).toBeInTheDocument()
    const summaryLink = screen.getByRole('link', { name: /當場拘捕/ })
    expect(summaryLink).toHaveAttribute('href', '/compendium/classes/class.fixture/ability/censor-arrest')
    expect(summaryLink.closest('[data-entry-presentation="summary"]')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: '怒火' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: '怒火' }).closest('[data-entry-presentation="expanded"]')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /開啟「怒火」永久連結/ })).toHaveAttribute('href', '/compendium/classes/class.fixture/feature/censor-wrath')
    expect(screen.queryByText('English canon')).not.toBeInTheDocument()
  })

  test('detail 經由 EntryCard 顯示完整條目與麵包屑', () => {
    renderShell('detail', byId.get('ability.censor.arrest'))
    expect(screen.getByRole('heading', { level: 1, name: '當場拘捕' })).toBeInTheDocument()
    expect(screen.getByText('English canon')).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: '麵包屑' })).toHaveTextContent('測試範型')
  })

  test('手機章節目錄可用鍵盤開啟，點擊同頁 section 後收合', async () => {
    const user = userEvent.setup()
    renderShell()
    const selector = screen.getByLabelText('選擇範型')
    expect(within(selector).getAllByRole('option').map((option) => option.textContent)).toEqual(['另一測試範型', '測試範型'])
    const toggle = screen.getByRole('button', { name: /章節目錄/ })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    const mobileMenu = document.getElementById(toggle.getAttribute('aria-controls')!)!
    expect(mobileMenu).not.toHaveAttribute('hidden')
    await user.click(within(mobileMenu).getByRole('link', { name: '核心招式' }))
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
  })
})

import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, test } from 'vitest'
import catalogData from '../../public/data/catalog.json'
import type { Catalog, CatalogEntry } from '../types'
import { ClassShell } from './ClassShell'
import { validateManifestIntegrity, validateRegistryIntegrity } from './integrity'
import { resolveClassEntry, resolveEntryRoute } from './resolver'
import { classManifestOrder, classManifestRegistry } from './registry'
import type { ClassManifest } from './types'
import { fixtureClassManifest, fixtureOrder, fixtureRegistry } from './__fixtures__/classManifest'

const catalog = catalogData as unknown as Catalog
const byId = new Map(catalog.entries.map((entry) => [entry.id, entry]))

describe('Manifest integrity validation', () => {
  test('空 registry 與合法 fixture 通過', () => {
    expect(validateRegistryIntegrity({}, [], catalog)).toEqual([])
    expect(validateRegistryIntegrity(fixtureRegistry, fixtureOrder, catalog)).toEqual([])
  })

  test('Phase 1A 正式 registry 與顯示順序直接通過驗證', () => {
    expect(classManifestRegistry).toEqual({})
    expect(classManifestOrder).toEqual([])
    expect(validateRegistryIntegrity(classManifestRegistry, classManifestOrder, catalog)).toEqual([])
  })

  test('不存在 ID、重複 ID 與重複 section 都會回報', () => {
    const invalid: ClassManifest = {
      ...fixtureClassManifest,
      sections: [
        { kind: 'entries', id: 'same', heading: '一', entries: [{ id: 'missing.entry' }, { id: 'ability.censor.arrest' }] },
        { kind: 'entries', id: 'same', heading: '二', entries: [{ id: 'ability.censor.arrest' }] },
      ],
    }
    expect(validateManifestIntegrity(invalid, catalog).map((issue) => issue.code)).toEqual(expect.arrayContaining([
      'missing-entry', 'duplicate-entry-id', 'duplicate-section-id',
    ]))
  })

  test('registry key、顯示順序錯誤會回報，顯示順序不採 object key 順序', () => {
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

  test('manifest 內條目使用 class-scoped URL，其餘回退獨立條目頁', () => {
    expect(resolveEntryRoute({ currentManifest: fixtureClassManifest, entry: arrest })).toBe('/compendium/classes/class.fixture/ability/censor-arrest')
    expect(resolveEntryRoute({ currentManifest: fixtureClassManifest, entry: unrelated })).toBe('/compendium/ability/censor-back-blasphemer')
  })

  test('拒絕未知 classId、不存在條目與未列入 manifest 的條目', () => {
    expect(resolveClassEntry({ registry: fixtureRegistry, catalog, classId: 'unknown', type: arrest.type, slug: arrest.slug })).toBeNull()
    expect(resolveClassEntry({ registry: fixtureRegistry, catalog, classId: fixtureClassManifest.classId, type: 'ability', slug: 'missing' })).toBeNull()
    expect(resolveClassEntry({ registry: fixtureRegistry, catalog, classId: fixtureClassManifest.classId, type: unrelated.type, slug: unrelated.slug })).toBeNull()
    expect(resolveClassEntry({ registry: fixtureRegistry, catalog, classId: fixtureClassManifest.classId, type: arrest.type, slug: arrest.slug })?.entry.id).toBe(arrest.id)
  })
})

describe('ClassShell', () => {
  function renderShell(pageState: 'overview' | 'detail' = 'overview', activeEntry?: CatalogEntry) {
    return render(<MemoryRouter initialEntries={['/compendium/classes/class.fixture']}>
      <ClassShell catalog={catalog} manifest={fixtureClassManifest} registry={fixtureRegistry} order={fixtureOrder} pageState={pageState} activeEntry={activeEntry} />
    </MemoryRouter>)
  }

  test('overview 同時支援 summary、expanded 與正確 heading level', () => {
    renderShell()
    expect(screen.getByRole('heading', { level: 1, name: '測試範型' })).toBeInTheDocument()
    const summaryLink = screen.getByRole('link', { name: /當場拘捕/ })
    expect(summaryLink).toHaveAttribute('href', '/compendium/classes/class.fixture/ability/censor-arrest')
    expect(summaryLink.closest('[data-entry-presentation="summary"]')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: '怒火' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: '怒火' }).closest('[data-entry-presentation="expanded"]')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '開啟「怒火」永久連結' })).toHaveAttribute('href', '/compendium/classes/class.fixture/feature/censor-wrath')
    expect(screen.queryByText('核對英文正典')).not.toBeInTheDocument()
  })

  test('detail 重用 EntryCard 並包含頁面周邊資訊', () => {
    renderShell('detail', byId.get('ability.censor.arrest'))
    expect(screen.getByRole('heading', { level: 1, name: '當場拘捕' })).toBeInTheDocument()
    expect(screen.getByText('核對英文正典')).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: '麵包屑' })).toHaveTextContent('測試範型')
  })

  test('手機目錄可由鍵盤等價按鈕展開，選單順序由 order 控制', async () => {
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

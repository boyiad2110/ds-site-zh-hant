import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const classPageBaselines = [
  {
    label: 'class index desktop',
    project: 'chromium',
    path: '/compendium/classes',
    viewport: { width: 1280, height: 900 },
    snapshot: 'class-index-desktop.png',
  },
  {
    label: 'class index mobile',
    project: 'mobile',
    path: '/compendium/classes',
    viewport: { width: 320, height: 760 },
    snapshot: 'class-index-mobile.png',
  },
  {
    label: 'Conduit overview desktop',
    project: 'chromium',
    path: '/compendium/classes/class.conduit',
    viewport: { width: 1280, height: 900 },
    snapshot: 'class-overview-desktop.png',
  },
  {
    label: 'Conduit overview mobile',
    project: 'mobile',
    path: '/compendium/classes/class.conduit',
    viewport: { width: 320, height: 760 },
    snapshot: 'class-overview-mobile.png',
  },
] as const

for (const baseline of classPageBaselines) {
  test(`class browsing visual baseline: ${baseline.label}`, async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== baseline.project, `baseline belongs to ${baseline.project}`)
    await page.setViewportSize(baseline.viewport)
    await page.goto(baseline.path)
    await page.evaluate(() => document.fonts.ready)
    await expect(page).toHaveScreenshot(baseline.snapshot, { animations: 'disabled', fullPage: false })
  })
}

test('Phase 1B top-level navigation has one active page', async ({ page }) => {
  const cases = [
    { path: '/compendium', label: '規則庫' },
    { path: '/compendium/search', label: '規則庫' },
    { path: '/compendium/classes', label: '範型' },
    { path: '/compendium/classes/class.conduit', label: '範型' },
    { path: '/compendium/classes/class.censor', label: '範型' },
  ]

  for (const current of cases) {
    await page.goto(current.path)
    const activeLinks = page.locator('.site-nav [aria-current="page"]')
    await expect(activeLinks).toHaveCount(1)
    await expect(activeLinks).toHaveText(current.label)
  }
})

test('Phase 1B class index has valid headings, no console errors, and no overflow', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 760 })
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(String(error)))
  page.on('console', (message) => {
    if (message.type() === 'error' || /validateDOMNesting/i.test(message.text())) errors.push(message.text())
  })

  await page.goto('/compendium/classes')
  await expect(page.getByRole('heading', { name: '範型', level: 1 })).toBeVisible()
  await expect(page.locator('main.class-index > header > h1')).toHaveCount(1)
  await expect(page.locator('main.class-index > ul > li > a h2')).toHaveCount(2)
  await expect(page.locator('main.class-index > ul > li > a').nth(0)).toHaveAttribute('href', '/compendium/classes/class.conduit')
  await expect(page.locator('main.class-index > ul > li > a').nth(1)).toHaveAttribute('href', '/compendium/classes/class.censor')
  const widths = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }))
  expect(widths.scroll).toBeLessThanOrEqual(widths.client)

  const report = await new AxeBuilder({ page }).analyze()
  const severe = report.violations.filter((item) => ['critical', 'serious'].includes(item.impact ?? ''))
  expect(severe, severe.map((item) => `${item.id}: ${item.help}`).join('\n')).toEqual([])
  expect(errors).toEqual([])
})

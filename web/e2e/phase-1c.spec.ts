import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Phase 1C 懲戒者範型', () => {
  test('懲戒者總覽 desktop 視覺基線', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'baseline belongs to chromium')
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto('/compendium/classes/class.censor')
    await page.evaluate(() => document.fonts.ready)
    await expect(page).toHaveScreenshot('class-overview-desktop.png', { animations: 'disabled', fullPage: false })
  })

  test('懲戒者總覽 mobile 視覺基線', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'baseline belongs to mobile')
    await page.setViewportSize({ width: 320, height: 760 })
    await page.goto('/compendium/classes/class.censor')
    await page.evaluate(() => document.fonts.ready)
    await expect(page).toHaveScreenshot('class-overview-mobile.png', { animations: 'disabled', fullPage: false })
  })

  test('桌面側欄只標示目前懲戒者，且章節完整', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto('/compendium/classes/class.censor')
    await expect(page.getByRole('heading', { name: '懲戒者', level: 1 })).toBeVisible()
    const classNav = page.getByRole('navigation', { name: '範型切換' }).first()
    await expect(classNav.getByRole('link')).toHaveCount(2)
    await expect(classNav.locator('[aria-current="page"]')).toHaveCount(1)
    await expect(classNav.locator('[aria-current="page"]')).toHaveText('懲戒者')
    await expect(page.getByRole('navigation', { name: '目前範型章節' }).first().getByRole('link')).toHaveCount(7)
    await expect(page.locator('section#wrath > h2')).toHaveText('怒火')
    await expect(page.locator('section#censor-order > h2')).toHaveText('懲戒者教團')
    await expect(page.locator('section#judgment-order-benefit > h2')).toHaveText('審判：教團益處')

    const widths = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }))
    expect(widths.scroll).toBeLessThanOrEqual(widths.client)
  })

  test('手機切換懲戒者後更新網址、標題與章節目錄', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 760 })
    await page.goto('/compendium/classes/class.conduit')
    const selector = page.getByLabel('選擇範型')
    await expect(selector.locator('option')).toHaveText(['神導士', '懲戒者'])
    await selector.selectOption('class.censor')
    await expect(page).toHaveURL('/compendium/classes/class.censor')
    await expect(page).toHaveTitle(/懲戒者/)
    await expect(page.getByRole('heading', { name: '懲戒者', level: 1 })).toBeVisible()
    await expect(page.getByRole('link', { name: '怒火' }).last()).toBeVisible()

    const toggle = page.getByRole('button', { name: /章節目錄/ })
    await toggle.click()
    await expect(toggle).toHaveAttribute('aria-expanded', 'true')
    await expect(page.locator('.class-sidebar-mobile .class-section-nav').getByRole('link', { name: '審判：教團益處' })).toBeVisible()
    await page.locator('.class-sidebar-mobile .class-section-nav').getByRole('link', { name: '審判：教團益處' }).click()
    await expect(page).toHaveURL('/compendium/classes/class.censor#judgment-order-benefit')
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')

    const widths = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }))
    expect(widths.scroll).toBeLessThanOrEqual(widths.client)
    const report = await new AxeBuilder({ page }).analyze()
    const severe = report.violations.filter((item) => ['critical', 'serious'].includes(item.impact ?? ''))
    expect(severe, severe.map((item) => `${item.id}: ${item.help}`).join('\n')).toEqual([])
  })

  test('分類首頁依 registry order 顯示神導士、懲戒者', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 760 })
    await page.goto('/compendium/classes')
    const cards = page.locator('main.class-index > ul > li > a')
    await expect(cards).toHaveCount(2)
    await expect(cards.nth(0)).toHaveAttribute('href', '/compendium/classes/class.conduit')
    await expect(cards.nth(1)).toHaveAttribute('href', '/compendium/classes/class.censor')
    await expect(cards.nth(0)).toContainText('41 筆條目')
    await expect(cards.nth(1)).toContainText('17 筆條目')
    const widths = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }))
    expect(widths.scroll).toBeLessThanOrEqual(widths.client)
  })

  test('懲戒者 class-scoped route 不收錄共享基礎打擊與狀態', async ({ page }) => {
    for (const path of [
      '/compendium/classes/class.censor/ability/basic-melee-weapon-free-strike',
      '/compendium/classes/class.censor/condition/bleeding',
      '/compendium/classes/class.censor/ability/missing',
    ]) {
      await page.goto(path)
      await expect(page.getByRole('heading', { name: '找不到這個頁面' })).toBeVisible()
    }
  })
})

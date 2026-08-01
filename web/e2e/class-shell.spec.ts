import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('test-only ClassShell 桌面版使用單一 sidebar rail 且沒有水平溢位', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto('/e2e/harness/')
  await expect(page.locator('.class-sidebar-desktop')).toBeVisible()
  await expect(page.locator('.class-sidebar-mobile')).toBeHidden()
  await expect(page.getByRole('navigation', { name: '範型切換' }).first()).toBeVisible()
  await expect(page.getByRole('navigation', { name: '目前範型章節' }).first()).toBeVisible()
  const widths = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }))
  expect(widths.scroll).toBeLessThanOrEqual(widths.client)
})

test('test-only ClassShell 手機版支援鍵盤展開、無溢位且通過 axe', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 760 })
  await page.goto('/e2e/harness/')
  await expect(page.locator('.class-sidebar-desktop')).toBeHidden()
  await expect(page.locator('.class-sidebar-mobile')).toBeVisible()

  const selector = page.getByLabel('選擇範型')
  await selector.focus()
  await page.keyboard.press('Tab')
  const toggle = page.getByRole('button', { name: /章節目錄/ })
  await expect(toggle).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(toggle).toHaveAttribute('aria-expanded', 'true')
  await expect(page.getByRole('link', { name: '核心招式' }).last()).toBeVisible()

  const widths = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }))
  expect(widths.scroll).toBeLessThanOrEqual(widths.client)
  const report = await new AxeBuilder({ page }).analyze()
  const severe = report.violations.filter((item) => ['critical', 'serious'].includes(item.impact ?? ''))
  expect(severe, severe.map((item) => `${item.id}: ${item.help}`).join('\n')).toEqual([])
})

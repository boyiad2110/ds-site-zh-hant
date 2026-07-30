import { readFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const catalog = JSON.parse(readFileSync(new URL('../public/data/catalog.m0.json', import.meta.url), 'utf8'))

test('搜尋、篩選與網址狀態', async ({ page }) => {
  await page.goto('/compendium')
  await page.getByLabel('搜尋規則庫').fill('當場拘捕')
  await expect(page.getByRole('link', { name: /當場拘捕/ })).toBeVisible()
  await expect(page).toHaveURL(/q=/)
  await page.getByRole('button', { name: '清除搜尋' }).click()
  await expect(page.getByLabel('搜尋規則庫')).toHaveValue('')
  await page.getByLabel('條目類型').selectOption('ability')
  await page.getByLabel('能力類別').selectOption('heroic')
  await page.getByLabel('怒火成本').selectOption('5')
  await expect(page.getByText('4 筆結果')).toBeVisible()
  await page.reload()
  await expect(page.getByLabel('怒火成本')).toHaveValue('5')
})

test('深層連結、Potency 條件與英文正典', async ({ page }) => {
  await page.goto('/compendium/ability/censor-behold-the-face-of-justice')
  await expect(page.getByRole('heading', { name: '直視正義威儀！' })).toBeVisible()
  await expect(page.getByText(/氣場 < 弱/)).toBeVisible()
  await expect(page.getByText(/目標 2 格內的每個敵人/).first()).toBeVisible()
  await page.getByText('核對英文正典').click()
  await expect(page.getByRole('heading', { name: 'Behold the Face of Justice!', level: 2 })).toBeVisible()
})

test('交叉連結可以前往審判', async ({ page }) => {
  await page.goto('/compendium/feature/censor-wrath')
  await page.getByRole('link', { name: '審判' }).first().click()
  await expect(page).toHaveURL(/\/compendium\/ability\/censor-judgment/)
  await expect(page.getByRole('heading', { name: '審判' })).toBeVisible()
})

test('手機版沒有水平溢位且主要流程可操作', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 760 })
  await page.goto('/compendium')
  const widths = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }))
  expect(widths.scroll).toBeLessThanOrEqual(widths.client)
  await page.getByLabel('搜尋規則庫').fill('Judgment')
  await expect(page.getByRole('link', { name: /審判/ }).first()).toBeVisible()
})

/** 每一筆條目都要真的畫得出來。資料層的驗證只保證欄位齊全，不保證渲染路徑走得通——
 * 基礎打擊的 powerRoll.characteristic 是物件而非字串，就曾讓那兩頁整頁空白。 */
test('28 筆條目頁全部渲染得出來，且沒有 runtime 錯誤', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(String(error)))
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()) })

  for (const entry of catalog.entries) {
    errors.length = 0
    await page.goto(`/compendium/${entry.type}/${entry.slug}`)
    await expect(page.getByRole('heading', { level: 1, name: entry.name.zhHant })).toBeVisible()
    expect(errors, `${entry.id}：${errors[0] ?? ''}`).toEqual([])
  }
})

test('首頁與條目頁沒有嚴重無障礙問題', async ({ page }) => {
  for (const path of ['/', '/compendium/ability/censor-arrest']) {
    await page.goto(path)
    const report = await new AxeBuilder({ page }).analyze()
    const severe = report.violations.filter((item) => ['critical', 'serious'].includes(item.impact ?? ''))
    expect(severe, severe.map((item) => `${item.id}: ${item.help}`).join('\n')).toEqual([])
  }
})

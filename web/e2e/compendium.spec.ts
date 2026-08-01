import { readFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const catalog = JSON.parse(readFileSync(new URL('../public/data/catalog.json', import.meta.url), 'utf8'))

const visualBaselines = [
  { name: 'ability-card', path: '/compendium/ability/censor-arrest' },
  { name: 'feature-card', path: '/compendium/feature/censor-wrath' },
  { name: 'condition-card', path: '/compendium/condition/bleeding' },
]

for (const baseline of visualBaselines) {
  test(`${baseline.name} 視覺基線`, async ({ page }) => {
    await page.goto(baseline.path)
    await page.evaluate(() => document.fonts.ready)
    await page.addStyleTag({ content: '.site-header { display: none !important; }' })
    await expect(page.locator('.rule-card')).toHaveScreenshot(`${baseline.name}.png`, { animations: 'disabled' })
  })
}

test('搜尋、篩選與網址狀態', async ({ page }) => {
  await page.goto('/compendium')
  await page.getByLabel('搜尋規則庫').fill('當場拘捕')
  await expect(page.getByRole('link', { name: /當場拘捕/ })).toBeVisible()
  await expect(page).toHaveURL(/q=/)
  await page.getByRole('button', { name: '清除搜尋' }).click()
  await expect(page.getByLabel('搜尋規則庫')).toHaveValue('')
  await page.getByLabel('條目類型').selectOption('ability')
  await page.getByLabel('能力類別').selectOption('heroic')
  await page.getByLabel('英雄資源成本').selectOption('wrath:5')
  await expect(page.getByText('4 筆結果')).toBeVisible()
  await page.reload()
  await expect(page.getByLabel('英雄資源成本')).toHaveValue('wrath:5')
})

test('搜尋別名路由與正式 NotFound', async ({ page }) => {
  await page.goto('/compendium/search?q=審判')
  await expect(page.getByLabel('搜尋規則庫')).toHaveValue('審判')
  await expect(page.getByLabel('快速搜尋')).toHaveCount(0)
  await expect(page.getByRole('link', { name: /審判/ }).first()).toBeVisible()

  await page.goto('/compendium/classes')
  await expect(page.getByRole('heading', { name: '尚未收錄' })).toBeVisible()

  for (const path of ['/compendium/classes/unknown', '/compendium/classes/unknown/ability/missing', '/不存在的頁面']) {
    await page.goto(path)
    await expect(page.getByRole('heading', { name: '找不到這個頁面' })).toBeVisible()
  }
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
test('全部條目頁都渲染得出來，且沒有 runtime 錯誤（累積式 catalog，數量隨 milestone 增加）', async ({ page }) => {
  // 單一測試逐筆開啟 catalog 全部條目頁，總時間隨 milestone 增加而增加——
  // 2026-07-31 M1 Batch 3 補齊神導士一級後（67 筆），mobile 專案的預設 30s
  // 逾時已不夠用（desktop 約 22s，mobile 模擬較慢會超時）。改用隨筆數估算的
  // 逾時（每筆 1s，至少 60s），避免下一個 milestone 加入條目後又重演同樣的逾時。
  test.setTimeout(Math.max(60000, catalog.entries.length * 1000))
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

test('首頁、搜尋、條目與 NotFound 沒有嚴重無障礙問題', async ({ page }) => {
  for (const path of ['/', '/compendium/search', '/compendium/ability/censor-arrest', '/不存在的頁面']) {
    await page.goto(path)
    const report = await new AxeBuilder({ page }).analyze()
    const severe = report.violations.filter((item) => ['critical', 'serious'].includes(item.impact ?? ''))
    expect(severe, severe.map((item) => `${item.id}: ${item.help}`).join('\n')).toEqual([])
  }
})

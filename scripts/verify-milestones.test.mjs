/**
 * `verify-milestones.mjs` 的持久化測試。
 *
 * 全部在 os.tmpdir() 的 fixture 上執行，**不觸碰正式 repository 資料**
 * （透過 DS_DATA_ROOT，見 scripts/lib/root.mjs）。
 *
 * 每個失敗情境除了斷言 exit code，也斷言輸出裡有具體的錯誤訊息片段——
 * 只看 exit code 的話，任何無關的崩潰（例如路徑打錯）都會被誤判成「測試通過」。
 */
import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const scriptsDir = dirname(fileURLToPath(import.meta.url))

const CANON_A = {
  id: 'ability.test.a',
  type: 'ability',
  name: 'A',
  keywords: [],
  effect: [],
  canonReviewStatus: 'verified',
  source: { document: 'x', version: '1', pdfPage: 1, printedPage: 1, normalizedHash: 'x' },
}
const ZH_A = {
  id: 'ability.test.a',
  nameZhHant: '甲',
  effect: [],
  meta: { status: 'reviewed', reviewedBy: 'owner' },
}

const clone = (o) => JSON.parse(JSON.stringify(o))

/** 只建立 fixture 用得到的目錄；verify-milestones.mjs 對缺的分組目錄一律略過（existsSync 判斷）。 */
function makeFixture({ canonFiles = [], zhFiles = [], milestones = [] }) {
  const root = mkdtempSync(resolve(tmpdir(), 'ds-milestones-'))
  mkdirSync(resolve(root, 'data/canon/abilities'), { recursive: true })
  mkdirSync(resolve(root, 'data/zh-Hant/abilities'), { recursive: true })
  mkdirSync(resolve(root, 'releases/milestones'), { recursive: true })
  for (const f of canonFiles) writeFileSync(resolve(root, `data/canon/abilities/${f.id}.json`), JSON.stringify(f), 'utf8')
  for (const f of zhFiles) writeFileSync(resolve(root, `data/zh-Hant/abilities/${f.id}.json`), JSON.stringify(f), 'utf8')
  for (const m of milestones) writeFileSync(resolve(root, `releases/milestones/${m.milestone}.json`), JSON.stringify(m), 'utf8')
  return root
}

function run(root) {
  const r = spawnSync(process.execPath, [resolve(scriptsDir, 'verify-milestones.mjs')], {
    env: { ...process.env, DS_DATA_ROOT: root },
    encoding: 'utf8',
  })
  return { status: r.status, out: r.stdout + r.stderr }
}

describe('verify-milestones', () => {
  test('0. 基準：乾淨資料通過（沒有這一項就分不出「抓到」與「一律失敗」）', () => {
    const root = makeFixture({
      canonFiles: [CANON_A],
      zhFiles: [ZH_A],
      milestones: [{ milestone: 'm0', status: 'complete', ids: ['ability.test.a'] }],
    })
    try {
      const r = run(root)
      assert.equal(r.status, 0, r.out)
    } finally { rmSync(root, { recursive: true, force: true }) }
  })

  test('1. manifest 宣告的 canon 不存在時失敗', () => {
    const root = makeFixture({
      canonFiles: [],
      zhFiles: [],
      milestones: [{ milestone: 'm0', status: 'in-progress', ids: ['ability.test.missing'] }],
    })
    try {
      const r = run(root)
      assert.equal(r.status, 1, r.out)
      assert.match(r.out, /ability\.test\.missing.*找不到對應檔案/)
    } finally { rmSync(root, { recursive: true, force: true }) }
  })

  test('2. canon 存在但缺繁中時失敗', () => {
    const root = makeFixture({
      canonFiles: [CANON_A],
      zhFiles: [],
      milestones: [{ milestone: 'm0', status: 'in-progress', ids: ['ability.test.a'] }],
    })
    try {
      const r = run(root)
      assert.equal(r.status, 1, r.out)
      assert.match(r.out, /ability\.test\.a.*沒有配對的檔案/)
    } finally { rmSync(root, { recursive: true, force: true }) }
  })

  test('3. canon 有未被任何 milestone 宣告的額外 id 時失敗', () => {
    const root = makeFixture({
      canonFiles: [CANON_A],
      zhFiles: [ZH_A],
      milestones: [{ milestone: 'm0', status: 'in-progress', ids: [] }],
    })
    try {
      const r = run(root)
      assert.equal(r.status, 1, r.out)
      assert.match(r.out, /ability\.test\.a.*未宣告的額外 id/)
    } finally { rmSync(root, { recursive: true, force: true }) }
  })

  test('4. 同一 id 被兩個 milestone 宣告時失敗', () => {
    const root = makeFixture({
      canonFiles: [CANON_A],
      zhFiles: [ZH_A],
      milestones: [
        { milestone: 'm0', status: 'in-progress', ids: ['ability.test.a'] },
        { milestone: 'm1', status: 'in-progress', ids: ['ability.test.a'] },
      ],
    })
    try {
      const r = run(root)
      assert.equal(r.status, 1, r.out)
      assert.match(r.out, /ability\.test\.a.*同時被 2 個 milestone 宣告/)
    } finally { rmSync(root, { recursive: true, force: true }) }
  })

  test('5. complete milestone 仍有 canonReviewStatus 未 verified 的條目時失敗', () => {
    const root = makeFixture({
      canonFiles: [{ ...clone(CANON_A), canonReviewStatus: 'draft' }],
      zhFiles: [ZH_A],
      milestones: [{ milestone: 'm0', status: 'complete', ids: ['ability.test.a'] }],
    })
    try {
      const r = run(root)
      assert.equal(r.status, 1, r.out)
      assert.match(r.out, /已標記 complete.*canonReviewStatus.*「draft」，不是 verified/)
    } finally { rmSync(root, { recursive: true, force: true }) }
  })

  test('6. complete milestone 仍有繁中 meta.status 未 reviewed 的條目時失敗', () => {
    const root = makeFixture({
      canonFiles: [CANON_A],
      zhFiles: [{ ...clone(ZH_A), meta: { status: 'draft' } }],
      milestones: [{ milestone: 'm0', status: 'complete', ids: ['ability.test.a'] }],
    })
    try {
      const r = run(root)
      assert.equal(r.status, 1, r.out)
      assert.match(r.out, /已標記 complete.*繁中 meta\.status.*「draft」，不是 reviewed/)
    } finally { rmSync(root, { recursive: true, force: true }) }
  })

  test('7. in-progress milestone 允許條目尚未 verified／reviewed（建設中不強求）', () => {
    const root = makeFixture({
      canonFiles: [{ ...clone(CANON_A), canonReviewStatus: 'draft' }],
      zhFiles: [{ ...clone(ZH_A), meta: { status: 'draft' } }],
      milestones: [{ milestone: 'm0', status: 'in-progress', ids: ['ability.test.a'] }],
    })
    try {
      const r = run(root)
      assert.equal(r.status, 0, r.out)
    } finally { rmSync(root, { recursive: true, force: true }) }
  })

  test('8. manifest 格式不完整（缺 status）時失敗', () => {
    const root = makeFixture({
      canonFiles: [CANON_A],
      zhFiles: [ZH_A],
      milestones: [{ milestone: 'm0', ids: ['ability.test.a'] }],
    })
    try {
      const r = run(root)
      assert.equal(r.status, 1, r.out)
      assert.match(r.out, /manifest 格式不完整/)
    } finally { rmSync(root, { recursive: true, force: true }) }
  })
})

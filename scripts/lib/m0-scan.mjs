/**
 * M0 正典的術語用量掃描。
 *
 * 這裡是**唯一**的掃描實作。`report-m0-terms.mjs`（人看的報告）與
 * `build-m0-release.mjs`（產生 releases/m0.json）都從這裡取結果——
 * 兩邊各寫一份必然會漂移，然後「報告說有、清單說沒有」。
 *
 * 三個通道，刻意分開：
 *
 *   A · 受控值（確定性）
 *     keywords / actionType / abilityCategory / potency.level 存的就是受控值本身，
 *     直接查 vocabulary。命中即為真。
 *
 *   B · 散文文字掃描（需人工複核）
 *     自由文字以字界比對 glossary 與 vocabulary 的英文。**必然有假命中**
 *     （語氣詞 might 對上屬性 Might），故保留上下文供判讀，並由 EXCLUSIONS 排除已判定者。
 *
 *   C · 疑似術語但表裡沒有
 *     把命中區間遮掉，看剩下什麼像規則用語。
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { p } from './root.mjs'

/**
 * 通道 B 的人工判定排除清單。
 * **每一筆都必須寫理由**——這是「明明掃到卻不算數」的唯一合法出口，
 * 沒有理由的排除等於偷偷放行。
 */
export const EXCLUSIONS = [
  {
    termEn: 'Line',
    reason: 'Line＝線形是 Area 的一種範圍形狀，**本身是有效術語**，只是 M0 的 28 個條目都還沒用到；' +
      '之後的招式會用到。目前掃到的 4 處全為假命中：3 處是 `line of effect`' +
      '（＝效果線，另有 approved 條目 term.line-of-effect），1 處是「in a straight line」的日常用法。',
    checkedAt: '2026-07-29',
  },
]

/**
 * 哪些詞彙表**只以結構欄位存在**，不參與散文比對。
 *
 * 這類受控值的英文是常見英文字，在散文裡出現時幾乎都是普通用法而非術語：
 *   - `a strong example`／`the weak will be corrupted` 不是效力等級 Strong／Weak
 *   - `You have the Magic skill` 的 Magic 是技能名，不是招式關鍵詞 magic
 *   - `holy magic`／`magic strike` 的 magic 是普通名詞
 *
 * 它們該由通道 A 從 `keywords`／`abilityCategory`／`potency.level` 等結構欄位確定性取得，
 * 拿去比對散文只會製造假命中。2026-07-29 外部 review 指出後新增。
 */
export const STRUCTURAL_ONLY_VOCABULARIES = new Set([
  'potency-levels',
  'ability-categories',
  'ability-keywords',
])

/**
 * **逐處**排除：某個術語在某個條目裡的命中不算數。
 *
 * 與 EXCLUSIONS（整個詞全域排除）的差別在粒度。有些字在同一批資料裡既是術語、
 * 又是普通英文字，只能逐處判斷：
 *   - `You have the Magic skill.`      → 是技能名 term.magic.skill ✅
 *   - `You infuse your weapon with holy magic` → 普通名詞，不是任何術語 ❌
 *
 * 同樣**每筆都必須寫理由**。
 */
export const OCCURRENCE_EXCLUSIONS = [
  {
    termId: 'term.magic.skill',
    entityIds: ['ability.censor.halt-miscreant', 'ability.censor.your-allies-cannot-save-you'],
    reason: '這兩處是 flavor 的「holy magic」與「your magic strike」，magic 作普通名詞用，'
      + '既不是技能名稱也不是招式關鍵詞。真正用到技能名的只有 feature.censor.censor-order 的'
      + '「You have the Magic skill.」。',
    checkedAt: '2026-07-29',
  },
]

/**
 * 同一個英文對應多個詞義（sense split）時，掃描器**無法**從字面判斷該用哪一個。
 * 這裡逐筆指定，每筆must附理由。沒有指定的歧義命中會讓 build-m0-release 中止，
 * 而不是隨便挑一個——猜錯會讓資料依賴清單指向錯誤的 id。
 *
 * 鍵：`<正典條目 id>|<英文字面>` → 該處實際使用的 term id
 */
export const SENSE_ASSIGNMENTS = [
  {
    entityId: 'ability.censor.purifying-fire',
    surface: 'Fire',
    termId: 'term.fire.damage-type',
    reason: '「淨化聖火」只出現 fire weakness／fire damage，講的是傷害類型，' +
      '與元素師精通「烈火」（term.fire.elementalist-mastery）無關。2026-07-29 外部 review 指出。',
    checkedAt: '2026-07-29',
  },
]

/** 常見英文虛詞／泛用詞，命中後標為「高度可疑」，不是自動採信 */
export const AMBIGUOUS = new Set(['might', 'will', 'reason', 'order', 'save', 'charge', 'fire', 'surge', 'aid', 'lead', 'hide'])

const RULE_VERBS = ['vertical pull', 'vertical push', 'vertical slide', 'slide', 'pull', 'push', 'shift', 'teleport', 'burrow', 'swim', 'climb', 'fly']
const SENTENCE_STARTERS = new Set(['the', 'a', 'an', 'you', 'if', 'when', 'while', 'this', 'that', 'each', 'whenever', 'until', 'at', 'as', 'additionally', 'unless', 'your', 'they', 'it', 'in', 'for', 'after', 'before', 'and', 'or', 'but', 'though', 'choose', 'make', 'these', 'their', 'no', 'on', 'one', 'both', 'some', 'to'])

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const surfaceRe = (s) => new RegExp(`(?<![\\w-])${esc(s).replace(/\s+/g, '\\s+')}(?![\\w-])`, 'gi')

/** 收集一個條目的所有自由文字，附欄位名供報告定位 */
export function proseOf(item) {
  const out = []
  const add = (field, text) => { if (typeof text === 'string' && text.trim()) out.push({ field, text }) }

  add('name', item.name)
  if (item.type === 'ability') {
    add('flavor', item.flavor)
    add('target', item.target)
    add('trigger', item.trigger)
    for (const [i, t] of (item.powerRoll?.tiers ?? []).entries()) add(`tier[${i}]`, t.text)
    for (const [i, e] of (item.effect ?? []).entries()) add(`effect[${i}]`, e)
    for (const [i, c] of (item.extraCosts ?? []).entries()) add(`extraCosts[${i}]`, c.effect)
    for (const [i, f] of (item.followUpActions ?? []).entries()) {
      add(`followUp[${i}].lead`, f.lead)
      for (const [j, o] of (f.options ?? []).entries()) add(`followUp[${i}].option[${j}]`, o)
      add(`followUp[${i}].constraint`, f.constraint)
    }
  }
  if (item.type === 'condition') {
    for (const [i, t] of (item.text ?? []).entries()) add(`text[${i}]`, t)
  }
  if (item.type === 'feature') {
    for (const [i, s] of (item.sections ?? []).entries()) {
      add(`section[${i}].heading`, s.heading)
      for (const [j, b] of (s.blocks ?? []).entries()) {
        if (b.kind === 'paragraph') add(`section[${i}].block[${j}]`, b.text)
        if (b.kind === 'definitionList') {
          for (const [k, it] of b.items.entries()) {
            add(`section[${i}].block[${j}].item[${k}].term`, it.term)
            add(`section[${i}].block[${j}].item[${k}]`, it.text)
          }
        }
      }
    }
  }
  return out
}

export function scan() {
  // ── 讀入 ───────────────────────────────────────────────
  const canonFiles = []
  const walk = (dir) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      if (e.isDirectory()) { if (e.name !== '_normalized') walk(`${dir}/${e.name}`); continue }
      if (e.name.endsWith('.json')) canonFiles.push(`${dir}/${e.name}`)
    }
  }
  walk(p('data/canon'))
  const canon = canonFiles.map((f) => JSON.parse(readFileSync(f, 'utf8')))

  const glossary = JSON.parse(readFileSync(p('data/glossary.json'), 'utf8'))
  const vocabDir = p('data/vocabulary')
  const vocabularies = existsSync(vocabDir)
    ? readdirSync(vocabDir).filter((f) => f.endsWith('.json'))
        .map((f) => JSON.parse(readFileSync(resolve(vocabDir, f), 'utf8')))
    : []

  const vocabIndex = new Map()
  for (const v of vocabularies) vocabIndex.set(v.vocabulary, new Map(v.values.map((x) => [x.value, x])))

  // ── 通道 A ─────────────────────────────────────────────
  const controlled = new Map()
  const useControlled = (vocabName, value, fromId) => {
    if (value === null || value === undefined) return
    const found = vocabIndex.get(vocabName)?.get(value)
    const key = found ? found.id : `⚠️ ${vocabName}:${value}（詞彙表沒有這個值）`
    if (!controlled.has(key)) controlled.set(key, { entry: found ?? null, vocabName, value, from: new Set() })
    controlled.get(key).from.add(fromId)
  }
  for (const item of canon) {
    if (item.type !== 'ability') continue
    for (const k of item.keywords ?? []) useControlled('ability-keywords', k, item.id)
    useControlled('action-types', item.actionType, item.id)
    useControlled('ability-categories', item.abilityCategory, item.id)
    for (const t of item.powerRoll?.tiers ?? []) {
      if (t.potency?.level) useControlled('potency-levels', t.potency.level, item.id)
    }
  }

  // ── 比對面 ─────────────────────────────────────────────
  const surfaces = []
  for (const t of glossary.terms) {
    for (const s of [t.en, ...(t.aliasesEn ?? [])]) {
      if (typeof s === 'string' && s.trim()) surfaces.push({ term: t, surface: s })
    }
  }
  // vocabulary 的英文也要納入：散文會直接提到受控詞（「using the Knockback maneuver」），
  // 只比對 glossary 會把已定案的詞誤報成缺詞。
  // 但**結構型詞彙表除外**——它們的英文是常見英文字，比對散文只會製造假命中，
  // 且本來就由通道 A 從結構欄位確定性取得。
  for (const v of vocabularies) {
    if (STRUCTURAL_ONLY_VOCABULARIES.has(v.vocabulary)) continue
    for (const x of v.values) {
      for (const s of [x.en, x.value]) {
        if (typeof s === 'string' && s.trim()) {
          surfaces.push({ term: { ...x, source: `vocabulary:${v.vocabulary}` }, surface: s })
        }
      }
    }
  }
  // 單字詞補規則複數。術語表不該為每個詞形各開一條（Victories 就是 Victory）。
  for (const { term, surface } of [...surfaces]) {
    if (/\s/.test(surface)) continue
    const plural = /[^aeiou]y$/i.test(surface) ? surface.slice(0, -1) + 'ies'
      : /(s|x|z|ch|sh)$/i.test(surface) ? surface + 'es'
        : surface + 's'
    surfaces.push({ term, surface: plural, inflected: true })
  }
  surfaces.sort((a, b) => b.surface.length - a.surface.length)

  // 哪些字面對應到多個詞義（sense split）——字面比對無從分辨，必須人工指定
  const bySurface = new Map()
  for (const { term, surface } of surfaces) {
    const k = surface.toLowerCase()
    if (!bySurface.has(k)) bySurface.set(k, new Set())
    bySurface.get(k).add(term.id)
  }
  const ambiguousSurfaces = new Set([...bySurface.entries()].filter(([, ids]) => ids.size > 1).map(([k]) => k))
  const assignment = new Map(
    SENSE_ASSIGNMENTS.map((a) => [`${a.entityId}|${a.surface.toLowerCase()}`, a.termId]))

  // ── 通道 B ─────────────────────────────────────────────
  const prose = new Map()
  /** 歧義字面且無人工指定者，記在這裡讓 build 中止，而不是隨便挑一個 */
  const unresolvedSenses = new Map()
  for (const item of canon) {
    for (const { field, text } of proseOf(item)) {
      // 同一詞條可能有多個比對面指向同一段文字，不去重會讓處數灌水
      const seen = new Set()
      for (const { term, surface } of surfaces) {
        for (const m of text.matchAll(surfaceRe(surface))) {
          const sKey = surface.toLowerCase()
          if (ambiguousSurfaces.has(sKey)) {
            const chosen = assignment.get(`${item.id}|${sKey}`)
            if (!chosen) {
              const uk = `${item.id}|${sKey}`
              if (!unresolvedSenses.has(uk)) {
                unresolvedSenses.set(uk, {
                  entityId: item.id, surface, field,
                  candidates: [...bySurface.get(sKey)],
                  context: text.slice(Math.max(0, m.index - 40), m.index + 40).replace(/\s+/g, ' '),
                })
              }
              continue                       // 不猜
            }
            if (term.id !== chosen) continue  // 人工指定的是另一個詞義
          }
          // 逐處排除：這個術語在這個條目裡的命中已人工判定為不算數
          if (OCCURRENCE_EXCLUSIONS.some((o) => o.termId === term.id && o.entityIds.includes(item.id))) continue
          const key = `${term.id}@${field}@${m.index}-${m[0].length}`
          if (seen.has(key)) continue
          seen.add(key)
          if (!prose.has(term.id)) prose.set(term.id, { term, hits: [] })
          const s = Math.max(0, m.index - 32)
          prose.get(term.id).hits.push({
            id: item.id, field, surface, matched: m[0],
            context: (s > 0 ? '…' : '') + text.slice(s, m.index + m[0].length + 32).replace(/\s+/g, ' ') + '…',
          })
        }
      }
    }
  }

  // ── 通道 C ─────────────────────────────────────────────
  const knownSurfaces = new Set(surfaces.map((s) => s.surface.toLowerCase()))
  const candidates = new Map()
  for (const item of canon) {
    for (const { field, text } of proseOf(item)) {
      // 名稱依指南 §2 屬條目專屬譯文，不是受控術語；掃它只會得到雜訊
      if (field === 'name') continue
      const masked = text.split('')
      for (const { surface } of surfaces) {
        for (const m of text.matchAll(surfaceRe(surface))) {
          for (let i = m.index; i < m.index + m[0].length; i++) masked[i] = ' '
        }
      }
      const rest = masked.join('')
      const note = (phrase, idx) => {
        const key = phrase.toLowerCase()
        if (!candidates.has(key)) candidates.set(key, [])
        const s = Math.max(0, idx - 32)
        candidates.get(key).push({
          id: item.id, field, phrase,
          context: (s > 0 ? '…' : '') + text.slice(s, idx + phrase.length + 32).replace(/\s+/g, ' ') + '…',
        })
      }
      for (const m of rest.matchAll(/(?<![.!?]\s|^)\b([A-Z][a-z]{2,})\b/gm)) {
        if (SENTENCE_STARTERS.has(m[1].toLowerCase())) continue
        note(m[1], m.index)
      }
      // ⚠️ 規則動詞比對**原文**而非遮罩後文字。`vertical pull` 的 pull 會先被
      // glossary 的 Pull 遮掉，整個詞就被靜默藏起來。
      for (const v of RULE_VERBS) {
        if (knownSurfaces.has(v)) continue
        for (const m of text.matchAll(new RegExp(`(?<![\\w-])${v.replace(/\s+/g, '\\s+')}(?![\\w-])`, 'gi'))) {
          note(v, m.index)
        }
      }
    }
  }

  // ── 實體名稱解析 ───────────────────────────────────────
  // 9 個狀態的中文名**刻意不存在 glossary**（名稱權威在狀態實體，兩處都放會變成雙重權威，
  // 見指南 §9.2）。所以那些詞條的 zhHant 是 undefined。
  // 若不在這裡解析，release manifest 就會出現「有 id、沒中文」的條目，無從追溯——
  // 2026-07-29 外部 review 指出。
  const entityNames = new Map()
  const zhDir = p('data/zh-Hant/conditions')
  if (existsSync(zhDir)) {
    for (const f of readdirSync(zhDir).filter((x) => x.endsWith('.json'))) {
      const e = JSON.parse(readFileSync(resolve(zhDir, f), 'utf8'))
      entityNames.set(e.id, { nameZhHant: e.nameZhHant, status: e.meta?.status, reviewedBy: e.meta?.reviewedBy })
    }
  }

  const excluded = new Set(EXCLUSIONS.map((e) => e.termEn.toLowerCase()))
  return {
    canon,
    controlled,
    prose,
    candidates,
    entityNames,
    unresolvedSenses: [...unresolvedSenses.values()],
    /** 通道 B 扣掉人工判定的假命中後，真正算數的術語 */
    proseKept: [...prose.values()].filter((x) => !excluded.has((x.term.en ?? '').toLowerCase())),
    proseExcluded: [...prose.values()].filter((x) => excluded.has((x.term.en ?? '').toLowerCase())),
  }
}

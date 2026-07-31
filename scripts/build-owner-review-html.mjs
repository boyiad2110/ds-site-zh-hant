/**
 * 產出給擁有者看的驗收頁面（純白話，無 JSON）。
 * 讀 data/canon + data/zh-Hant，逐條組成中英對照卡片，輸出單一自足 HTML 檔。
 * 每張卡片附「核准／需要修改」按鈕與備註欄，決定存在瀏覽器 localStorage，
 * 並可一鍵「匯出驗收結果」成純文字，貼回聊天視窗給 AI 套用。
 *
 * 這份 HTML 本身不是核准紀錄——真正把 canonReviewStatus／meta.status 升級，
 * 仍須依 docs/translation-guide.md §3 走 AI 標註、擁有者裁決的流程。
 */
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { p } from './lib/root.mjs'
import {
  ATTRIBUTE_NAMES_ZH, GLYPH, TIER_GLYPHS,
  characteristicLabel, costLabel, distanceLabel, parseRichText, potencyLabel, targetLabel,
} from '../shared/canon-format.mjs'

// 通用產生器：一次只產一個 milestone 的驗收頁，用哪個 milestone 由呼叫時指定，
// 不再假設「data/canon/ 全部內容＝要驗收的範圍」。已結案的 milestone（如 M0）
// 的驗收頁不會因為別的 milestone 開始建置而被重新列出或覆寫成別的內容。
// 省略參數時預設 m0，保留舊有「不帶參數」的呼叫方式仍然可用。
const milestone = process.argv[2] ?? 'm0'

const read = (path) => JSON.parse(readFileSync(path, 'utf8'))

/** 官方符號字型（CC BY-SA 4.0）以 base64 內嵌，維持「單一自足 HTML」的特性——
 * 這份檔案會被單獨開啟或轉寄，不能依賴相對路徑的字型檔。 */
const GLYPH_FONT_BASE64 = readFileSync(p('web/public/fonts/DrawSteelGlyphs-Regular.otf')).toString('base64')

const glyph = (char, label) => `<span class="glyph-wrap"><span class="glyph" aria-hidden="true">${esc(char)}</span><span class="sr-only">${esc(label)}</span></span>`

const vocabFiles = ['ability-keywords', 'action-types', 'ability-categories', 'potency-levels', 'target-components']
const labels = {}
for (const name of vocabFiles) {
  const v = read(p(`data/vocabulary/${name}.json`))
  labels[name] = Object.fromEntries(v.values.map((x) => [x.value, { en: x.en, zh: x.zhHant }]))
}

// ---- 純文字轉換 ----

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** 標記解析由 shared 的 parseRichText 負責，這裡只把中立 token 畫成 HTML。
 * attributeBadges 只在傷害算式開啟，屬性改成黑底白字徽章——與網站一致。 */
function richText(str, idSet, attributeBadges = false) {
  if (str == null) return ''
  let out = ''
  for (const token of parseRichText(str)) {
    if (token.kind === 'ref') {
      out += idSet.has(token.id) ? `<a class="ref" href="#entry-${token.id}">${esc(token.text)}</a>` : esc(token.text)
    } else if (token.kind === 'term') {
      out += attributeBadges && token.isAttribute
        ? `<span class="attr-tag">${esc(token.text)}</span>`
        : `<b class="term">${esc(token.text)}</b>`
    } else {
      out += esc(token.text)
    }
  }
  return out
}

/** 段落字串（可能含 \n\n 分段）→ 一或多個 <p> */
function paragraphs(str, idSet) {
  if (str == null) return ''
  return String(str).split(/\n\n+/).map((part) => `<p>${richText(part, idSet)}</p>`).join('')
}
function paragraphsEn(str) {
  if (str == null) return ''
  return String(str).split(/\n\n+/).map((part) => `<p>${esc(part)}</p>`).join('')
}

// ---- 受控欄位：中英對照 ----
// 格式化一律走 shared/canon-format.mjs，與網站同一份來源；這裡只做語言的薄包裝。

const distanceZh = (d) => distanceLabel(d, 'zh')
const distanceEn = (d) => (d ? d.raw ?? distanceLabel(d, 'en') : '—')
const targetZh = (t) => targetLabel(t, 'zh')
const targetEn = (t) => targetLabel(t, 'en')

/** flavor 只有在原文本身是引言（book 用引號標出角色台詞）才加中文引號；純敘述句不加。 */
const isQuotedFlavor = (canonFlavor) => !!canonFlavor && /^["“]/.test(canonFlavor.trim())

function actionTypeZh(v) { return v ? labels['action-types'][v]?.zh ?? v : '—' }
function actionTypeEn(v) { return v ? labels['action-types'][v]?.en ?? v : '—' }

// ---- 逐條組卡 ----

const groups = [
  { key: 'abilities', type: 'ability', badge: '招式', title: '招式' },
  { key: 'conditions', type: 'condition', badge: '狀態', title: '狀態' },
  { key: 'features', type: 'feature', badge: '特性', title: '職業特性' },
]

// id → {group, canon, zh} 索引涵蓋全部 data/canon/，milestone 只決定「這次收錄哪些 id」，
// 範圍完整性（有沒有缺、多、未配對）已由 scripts/verify-milestones.mjs 把關，這裡不重複判斷，
// 只在 milestone 宣告的 id 對不到實際檔案時失敗——那是本腳本自己跑不下去的必要條件。
const byId = new Map()
for (const g of groups) {
  for (const name of readdirSync(p(`data/canon/${g.key}`)).filter((n) => n.endsWith('.json')).sort()) {
    const canon = read(p(`data/canon/${g.key}/${name}`))
    const zh = read(p(`data/zh-Hant/${g.key}/${name}`))
    byId.set(canon.id, { group: g, canon, zh })
  }
}

const manifest = read(p(`releases/milestones/${milestone}.json`))
const rawEntries = manifest.ids.map((id) => {
  const found = byId.get(id)
  if (!found) throw new Error(`milestone ${milestone} 宣告了 ${id}，但 data/canon/ 找不到對應檔案`)
  return found
})
const idSet = new Set(rawEntries.map((e) => e.canon.id))

/** 基本結果與效力結果合併成一行呈現（指南 §6.1b），標點仿照原文的 "text; P<LEVEL, effect" 寫法；
 * 「屬性 < 等級」用徽章樣式呈現（黑底白字，仿原版規則書的效力記號），2026-07-30 第二輪裁決。 */
function tierBlock(canonTier, zhTier) {
  if (!canonTier.potency) {
    return { threshold: canonTier.threshold, zh: richText(zhTier.text, idSet, true), en: esc(canonTier.text) }
  }
  const potencyZh = potencyLabel(canonTier.potency, labels['potency-levels'], 'zh')
  const potencyEn = potencyLabel(canonTier.potency, labels['potency-levels'], 'en')
  const zhMerged = `${richText(zhTier.text, idSet, true)}；<span class="potency-tag">${esc(potencyZh)}</span>，${richText(zhTier.potencyEffect, idSet)}`
  const enMerged = `${esc(canonTier.text)}; <span class="potency-tag">${esc(potencyEn)}</span>, ${esc(canonTier.potency.effect)}`
  return { threshold: canonTier.threshold, zh: zhMerged, en: enMerged }
}

/** 階層列：官方階層徽章 ＋ 內容，與網站 .tier 同構。 */
const tierRows = (tiers, lang) => `<div class="tier-list">${tiers.map((t, i) =>
  `<p class="tier">${glyph(TIER_GLYPHS[i] ?? '', t.threshold)}<span>${t[lang]}</span></p>`).join('')}</div>`

/** followUpActions 接在「效果」段落下方連續呈現（原版規則書寫在同一個 Effect: 段落裡）；
 * extraCosts 比照 Trigger／Effect 給獨立標題「花費 N 點怒火」，2026-07-30 第二輪裁決改回獨立段落。
 * conditionalEffects 已撤銷（TI-28），不再呈現。 */
function abilityBody(canon, zh) {
  const keywordsZh = (canon.keywords ?? []).map((k) => `<li>${esc(labels['ability-keywords'][k]?.zh ?? k)}</li>`).join('')
  const keywordsEn = (canon.keywords ?? []).map((k) => `<li>${esc(labels['ability-keywords'][k]?.en ?? k)}</li>`).join('')

  // 關鍵詞／動作類型／射程／目標同一個區塊，左右對齊——與網站的 .card-bar 同構。
  let zhHtml = `<div class="card-bar">
    <div class="bar-row"><ul class="keywords">${keywordsZh}</ul><span>${actionTypeZh(canon.actionType)}</span></div>
    <div class="bar-row"><span>${glyph(GLYPH.distance, '射程')}${distanceZh(canon.distance)}</span><span>${glyph(GLYPH.target, '目標')}${targetZh(canon.target)}</span></div>
  </div><div class="card-body">`
  let enHtml = `<div class="card-bar">
    <div class="bar-row"><ul class="keywords">${keywordsEn}</ul><span>${actionTypeEn(canon.actionType)}</span></div>
    <div class="bar-row"><span>${glyph(GLYPH.distance, 'Distance')}${esc(distanceEn(canon.distance))}</span><span>${glyph(GLYPH.target, 'Target')}${esc(targetEn(canon.target))}</span></div>
  </div><div class="card-body">`

  if (canon.powerRoll?.tiers?.length) {
    const charZh = characteristicLabel(canon.powerRoll.characteristic, 'zh')
    const charEn = characteristicLabel(canon.powerRoll.characteristic, 'en')
    const tiers = canon.powerRoll.tiers.map((t, i) => tierBlock(t, zh.powerRoll.tiers[i]))
    zhHtml += `<p class="power-roll-label">檢定 ＋ ${esc(charZh)}</p>${tierRows(tiers, 'zh')}`
    enHtml += `<p class="power-roll-label">Power Roll + ${esc(charEn)}</p>${tierRows(tiers, 'en')}`
  }

  if (canon.trigger) {
    zhHtml += `<p><b class="card-label">觸發</b>${richText(zh.trigger, idSet)}</p>`
    enHtml += `<p><b class="card-label">Trigger</b>${esc(canon.trigger)}</p>`
  }

  const effectZh = zh.effect ?? []
  const effectEn = canon.effect ?? []
  if (effectZh.length || canon.followUpActions?.length) {
    effectZh.forEach((t, i) => { zhHtml += `<p>${i === 0 ? '<b class="card-label">效果</b>' : ''}${richText(t, idSet)}</p>` })
    effectEn.forEach((t, i) => { enHtml += `<p>${i === 0 ? '<b class="card-label">Effect</b>' : ''}${esc(t)}</p>` })
    ;(canon.followUpActions ?? []).forEach((fa, i) => {
      const zfa = zh.followUpActions[i]
      const zLead = effectZh.length === 0 && i === 0 ? '<b class="card-label">效果</b>' : ''
      const eLead = effectEn.length === 0 && i === 0 ? '<b class="card-label">Effect</b>' : ''
      zhHtml += `<p>${zLead}${richText(zfa.lead, idSet)}</p><ol>${zfa.options.map((o) => `<li>${richText(o, idSet)}</li>`).join('')}</ol><p>${richText(zfa.constraint, idSet)}</p>`
      enHtml += `<p>${eLead}${esc(fa.lead)}</p><ol>${fa.options.map((o) => `<li>${esc(o)}</li>`).join('')}</ol><p>${esc(fa.constraint)}</p>`
    })
  }

  ;(canon.extraCosts ?? []).forEach((ec, i) => {
    const zec = zh.extraCosts[i]
    if (ec.options) {
      // options/lead 形狀（治癒恩典「花費 1+ 虔誠，逐點選 1 項」）——2026-07-31 擁有者實際
      // 驗收時發現這裡曾經完全沒有輸出（舊版只讀 .effect，這個形狀沒有 .effect），
      // 比照 web/src/App.tsx 已修正的呈現方式：無序清單，不用 <ol>。
      zhHtml += `<p><b class="card-label">花費 ${esc(costLabel(ec))}</b>${richText(zec.lead, idSet)}</p><ul>${zec.options.map((o) => `<li>${richText(o, idSet)}</li>`).join('')}</ul>`
      enHtml += `<p><b class="card-label">Spend ${esc(costLabel(ec, 'en'))}</b>${esc(ec.lead)}</p><ul>${ec.options.map((o) => `<li>${esc(o)}</li>`).join('')}</ul>`
    } else {
      zhHtml += `<p><b class="card-label">花費 ${esc(costLabel(ec))}</b>${richText(zec.effect, idSet)}</p>`
      enHtml += `<p><b class="card-label">Spend ${esc(costLabel(ec, 'en'))}</b>${esc(ec.raw ?? ec.effect)}</p>`
    }
  })

  return { zhHtml: `${zhHtml}</div>`, enHtml: `${enHtml}</div>` }
}

function conditionBody(canon, zh) {
  const zhHtml = `<div class="card-body">${zh.text.map((t) => `<p>${richText(t, idSet)}</p>`).join('')}</div>`
  const enHtml = `<div class="card-body">${canon.text.map((t) => `<p>${esc(t)}</p>`).join('')}</div>`
  return { zhHtml, enHtml }
}

function blockHtml(block, zhBlock, idSet, isEn) {
  if (block.kind === 'paragraph') return isEn ? paragraphsEn(block.text) : paragraphs(zhBlock.text, idSet)
  if (block.kind === 'bulletList') {
    const lead = isEn ? `<p>${esc(block.lead)}</p>` : `<p>${richText(zhBlock.lead, idSet)}</p>`
    const items = isEn ? block.items.map((i) => `<li>${esc(i)}</li>`) : zhBlock.items.map((i) => `<li>${richText(i, idSet)}</li>`)
    return `${lead}<ul>${items.join('')}</ul>`
  }
  if (block.kind === 'definitionList') {
    const items = isEn
      ? block.items.map((i) => `<div><dt>${esc(i.term)}</dt><dd>${esc(i.text)}</dd></div>`)
      : zhBlock.items.map((i) => `<div><dt>${esc(i.term)}</dt><dd>${richText(i.text, idSet)}</dd></div>`)
    return `<dl class="definition-list">${items.join('')}</dl>`
  }
  return ''
}

function featureBody(canon, zh) {
  let zhHtml = ''
  let enHtml = ''
  canon.sections.forEach((section, si) => {
    const zSection = zh.sections[si]
    zhHtml += `<section class="block">${section.heading ? `<h3>${esc(zSection.heading)}</h3>` : ''}${section.blocks.map((b, bi) => blockHtml(b, zSection.blocks[bi], idSet, false)).join('')}</section>`
    enHtml += `<section class="block">${section.heading ? `<h3>${esc(section.heading)}</h3>` : ''}${section.blocks.map((b) => blockHtml(b, null, idSet, true)).join('')}</section>`
  })
  return { zhHtml: `<div class="card-body">${zhHtml}</div>`, enHtml: `<div class="card-body">${enHtml}</div>` }
}

const CATEGORY_ZH = (v) => (v ? labels['ability-categories'][v]?.zh ?? v : null)

function card(entry) {
  const { canon, zh, group } = entry
  const body = group.type === 'ability' ? abilityBody(canon, zh) : group.type === 'condition' ? conditionBody(canon, zh) : featureBody(canon, zh)
  const category = CATEGORY_ZH(canon.abilityCategory)
  const level = canon.level != null ? `等級 ${canon.level}` : null
  const kinds = [group.badge, category, level].filter(Boolean).join('・')
  const cost = canon.cost ? `<span class="card-cost">${esc(costLabel(canon.cost))}</span>` : ''
  const quoted = isQuotedFlavor(canon.flavor)
  const flavorZh = zh.flavor ? `<p class="card-flavor">${quoted ? `「${richText(zh.flavor, idSet)}」` : richText(zh.flavor, idSet)}</p>` : ''
  const flavorEn = canon.flavor ? `<p class="card-flavor">${esc(canon.flavor)}</p>` : ''

  return `
<section class="entry" id="entry-${canon.id}" data-id="${canon.id}">
<p class="kind-line"><span class="kind-label">分類</span>${esc(kinds)}</p>
<article class="card">
  <header class="card-head">
    <div class="card-title-row">
      <div><h2>${esc(zh.nameZhHant)}</h2><p class="en-name">${esc(canon.name)}</p></div>
      ${cost}
    </div>
    ${flavorZh}
  </header>
  ${body.zhHtml}
  <div class="source-line">來源：Heroes 規則書 v${canon.source.version}，第 ${canon.source.printedPage} 頁</div>
  <button type="button" class="toggle-en" aria-expanded="false">查看英文原文 ▾</button>
  <div class="en-panel" hidden>
    <header class="card-head">
      <div class="card-title-row">
        <div><h3>${esc(canon.name)}</h3></div>
        ${canon.cost ? `<span class="card-cost">${esc(costLabel(canon.cost, 'en'))}</span>` : ''}
      </div>
      ${flavorEn}
    </header>
    ${body.enHtml}
  </div>
  <div class="decision" data-id="${canon.id}">
    <div class="decision-buttons">
      <button type="button" class="dec-btn approve" data-decision="approve">✅ 核准</button>
      <button type="button" class="dec-btn revise" data-decision="revise">✏️ 需要修改</button>
    </div>
    <textarea class="note" placeholder="備註（選填）——需要修改時，請盡量寫清楚要改成什麼"></textarea>
  </div>
</article>
</section>`
}

function navItem(entry) {
  const { canon, zh } = entry
  return `<a class="nav-item" href="#entry-${canon.id}" data-id="${canon.id}"><span class="dot"></span>${esc(zh.nameZhHant)}</a>`
}

const sections = groups.map((g) => {
  const entries = rawEntries.filter((e) => e.group === g)
  return {
    group: g,
    entries,
    cardsHtml: entries.map(card).join(''),
    navHtml: entries.map(navItem).join(''),
  }
})

const total = rawEntries.length

/* 樣式與 web/src/styles.css 同一套 token 與卡片結構——驗收頁看到的必須就是網站的樣子。 */
const CSS = `
@font-face {
  font-family: "Draw Steel Glyphs";
  src: url(data:font/otf;base64,${GLYPH_FONT_BASE64}) format("opentype");
  font-weight: 400;
}
:root {
  --paper: #f7f3ea; --paper-2: #fffcf6; --paper-3: #efe9dc;
  --ink: #2a2724; --ink-2: #57524b; --ink-3: #6e675c;
  --rule: #dcd4c4; --rule-2: #bfb5a1;
  --accent: #8c2f2c; --accent-2: #6f2422; --gold-ink: #7a5a1e; --term: #5e3330;
  --approve: #3b6d11; --revise: #7a5a1e;
  --serif: "Noto Serif TC","Source Han Serif TC",Georgia,"PMingLiU",serif;
  --sans: "Noto Sans TC","Microsoft JhengHei",system-ui,sans-serif;
}
* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { margin: 0; font-family: var(--sans); font-synthesis: none; background: var(--paper); color: var(--ink); line-height: 1.9; }
a { color: inherit; }
button { font: inherit; color: inherit; }
h1, h2, h3 { font-family: var(--serif); font-weight: 700; letter-spacing: 0; line-height: 1.4; }
:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
.glyph-wrap { display: inline-flex; align-items: baseline; }
.glyph { font-family: "Draw Steel Glyphs"; font-style: normal; line-height: 1; letter-spacing: 0; }

.shell { display: grid; grid-template-columns: 290px minmax(0,1fr); min-height: 100vh; }

.sidebar { position: sticky; top: 0; align-self: start; height: 100vh; overflow-y: auto; background: var(--paper-2); border-right: 1px solid var(--rule); padding: 26px 20px; display: flex; flex-direction: column; gap: 22px; }
.sidebar h1 { font-size: 20px; margin: 0; }
.sidebar .eyebrow { font-size: 12px; letter-spacing: .1em; color: var(--ink-3); margin: 0 0 6px; }
.progress { display: grid; gap: 8px; font-size: 13px; }
.progress-bar { height: 8px; background: var(--paper-3); display: flex; overflow: hidden; }
.progress-bar span { display: block; height: 100%; }
.progress-bar .p-approve { background: var(--approve); }
.progress-bar .p-revise { background: var(--revise); }
.progress-legend { display: flex; gap: 14px; flex-wrap: wrap; color: var(--ink-3); font-size: 12px; }
.progress-legend b { color: var(--ink); font-variant-numeric: tabular-nums; }
.legend-dot { display: inline-block; width: 8px; height: 8px; margin-right: 5px; }
.legend-dot.approve { background: var(--approve); }
.legend-dot.revise { background: var(--revise); }
.legend-dot.pending { background: var(--rule-2); }

.export-btn { min-height: 44px; border: 1px solid var(--accent); background: var(--paper); color: var(--accent); font-weight: 500; cursor: pointer; }
.export-btn:hover { background: var(--paper-3); }
.reset-btn { border: 0; background: none; color: var(--ink-3); font-size: 12px; text-decoration: underline; cursor: pointer; padding: 0; text-align: left; }

.nav { display: grid; gap: 18px; overflow-y: auto; }
.nav-group { font-size: 12px; letter-spacing: .14em; color: var(--ink-3); border-top: 1px solid var(--rule); padding-top: 10px; margin-top: 4px; }
.nav-group:first-child { border-top: 0; margin-top: 0; }
.nav-item { display: flex; align-items: center; gap: 9px; padding: 6px 4px; font-size: 13px; color: var(--ink-2); border-left: 2px solid transparent; text-decoration: none; }
.nav-item:hover { color: var(--accent); }
.nav-item .dot { width: 7px; height: 7px; border-radius: 50%; background: var(--rule-2); flex: 0 0 auto; }
.nav-item.is-approve .dot { background: var(--approve); }
.nav-item.is-revise .dot { background: var(--revise); }
.nav-item.is-approve { border-left-color: var(--approve); }
.nav-item.is-revise { border-left-color: var(--revise); }

main { padding: 40px clamp(20px,4vw,56px) 120px; max-width: 820px; }
.intro { border-left: 3px solid var(--accent); background: var(--paper-3); padding: 18px 22px; margin-bottom: 40px; font-size: 14px; line-height: 1.85; color: var(--ink-2); }
.intro h2 { margin: 0 0 8px; font-size: 17px; color: var(--ink); }
.intro ol { margin: 10px 0 0; padding-left: 20px; }
.intro li { margin: 6px 0; }

.group-heading { font-family: var(--sans); font-size: 13px; font-weight: 500; letter-spacing: .18em; color: var(--ink-3); margin: 44px 0 4px; }
.group-heading:first-of-type { margin-top: 0; }

.entry { scroll-margin-top: 16px; }
.kind-line { font-size: 12px; color: var(--ink-3); margin: 26px 0 10px; }
.kind-label { display: inline-block; margin-right: 9px; padding: 1px 6px; background: var(--paper-3); color: var(--ink-2); letter-spacing: .05em; }

.card { border: 1px solid var(--rule-2); background: var(--paper-2); }
.card-head { padding: 20px clamp(18px,3vw,26px) 16px; }
.card-title-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
.card-head h2 { font-size: clamp(23px,3.2vw,28px); margin: 0; }
.card-head h3 { font-size: 20px; margin: 0; }
.en-name { color: var(--ink-3); font-size: 13px; letter-spacing: .06em; margin: 5px 0 0; }
.card-cost { flex: 0 0 auto; font-family: var(--serif); font-weight: 700; font-size: 17px; color: var(--accent); white-space: nowrap; padding-top: 4px; }
.card-flavor { font-family: var(--serif); font-style: italic; font-synthesis: style; color: var(--ink-2); font-size: 15px; line-height: 1.8; margin: 12px 0 0; }

.card-bar { padding: 9px clamp(18px,3vw,26px) 10px; border-top: 1px solid var(--rule); font-size: 14px; }
.bar-row { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 6px 16px; }
.bar-row + .bar-row { margin-top: 7px; }
.bar-row > span { display: inline-flex; align-items: center; gap: 8px; }
.bar-row .glyph { font-size: 17px; }
.keywords { display: flex; flex-wrap: wrap; gap: 6px; margin: 0; padding: 0; list-style: none; }
.keywords li { border: 1px solid var(--rule-2); padding: 0 7px; color: var(--ink-2); }

.card-body { padding: 15px clamp(18px,3vw,26px) 19px; }
.card-body p, .card-body li { font-size: 15px; line-height: 1.9; }
.card-body > p { margin: 0 0 .7em; }
.card-body > p:last-child { margin-bottom: 0; }
.card-label { font-family: var(--serif); font-weight: 700; }
.card-label::after { content: "："; }
.power-roll-label { font-family: var(--serif); font-weight: 700; margin: 0 0 6px; }
.power-roll-label::after { content: "："; }
.term { color: var(--term); font-weight: 700; }
.ref { color: var(--accent); text-decoration: underline; text-underline-offset: 4px; }
.potency-tag, .attr-tag { display: inline-block; background: var(--ink); color: #f7f3ea; font-size: 13px; font-weight: 500; padding: 1px 7px; margin: 0 2px; white-space: nowrap; }

.tier-list { margin: 0 0 14px; }
.tier { display: flex; align-items: baseline; gap: 12px; margin: 0 0 9px; }
.tier > .glyph-wrap { flex: 0 0 auto; min-width: 46px; }
.tier .glyph { font-size: 22px; }

.block { margin-bottom: 18px; }
.block:last-child { margin-bottom: 0; }
.block h3 { font-size: 17px; margin: 0 0 6px; }
.block ol, .block ul, .card-body ol, .card-body ul { margin: 0 0 .7em; padding-left: 1.4em; }
.block li { margin: 5px 0; }
.definition-list { margin: 0; }
.definition-list div { padding: 9px 0; }
.definition-list div:first-child { padding-top: 0; }
.definition-list dt { font-family: var(--serif); font-weight: 700; color: var(--accent); }
.definition-list dd { margin: 2px 0 0; }

.source-line { padding: 10px clamp(18px,3vw,26px); font-size: 12px; color: var(--ink-3); border-top: 1px solid var(--rule); }
.toggle-en { width: 100%; text-align: left; padding: 11px clamp(18px,3vw,26px); background: var(--paper-3); border: 0; border-top: 1px solid var(--rule); color: var(--ink-2); cursor: pointer; font-size: 13px; }
.toggle-en:hover { color: var(--accent); }
.en-panel { border-top: 1px solid var(--rule-2); background: var(--paper); }

.decision { border-top: 1px solid var(--rule-2); background: var(--paper-3); padding: 16px clamp(18px,3vw,26px) 18px; display: grid; gap: 10px; }
.decision-buttons { display: flex; gap: 10px; flex-wrap: wrap; }
.dec-btn { min-height: 42px; padding: 0 18px; border: 1px solid var(--rule-2); background: var(--paper-2); color: var(--ink-2); cursor: pointer; font-weight: 500; }
.dec-btn.approve:hover { border-color: var(--approve); color: var(--approve); }
.dec-btn.revise:hover { border-color: var(--revise); color: var(--revise); }
.dec-btn.approve.active { background: var(--approve); border-color: var(--approve); color: #fff; }
.dec-btn.revise.active { background: var(--revise); border-color: var(--revise); color: #fff; }
.note { min-height: 50px; background: var(--paper-2); border: 1px solid var(--rule-2); color: var(--ink); padding: 9px 11px; font: inherit; font-size: 13px; resize: vertical; }
.note::placeholder { color: var(--ink-3); }

.modal-backdrop { position: fixed; inset: 0; background: rgba(42,39,36,.55); display: none; align-items: center; justify-content: center; padding: 24px; z-index: 50; }
.modal-backdrop.open { display: flex; }
.modal { background: var(--paper-2); border: 1px solid var(--rule-2); max-width: 640px; width: 100%; max-height: 82vh; display: flex; flex-direction: column; }
.modal-head { padding: 16px 20px; border-bottom: 1px solid var(--rule); display: flex; justify-content: space-between; align-items: center; }
.modal-head h2 { margin: 0; font-size: 17px; }
.modal-head button { border: 0; background: none; color: var(--ink-2); font-size: 20px; cursor: pointer; }
.modal-body { padding: 16px 20px; overflow-y: auto; display: grid; gap: 12px; }
.modal-body p { margin: 0; font-size: 13px; color: var(--ink-2); }
.modal textarea { width: 100%; min-height: 260px; background: var(--paper); border: 1px solid var(--rule-2); color: var(--ink); padding: 12px; font: 12px/1.7 ui-monospace,Consolas,monospace; }
.copy-btn { min-height: 42px; border: 1px solid var(--accent); background: var(--paper); color: var(--accent); font-weight: 500; cursor: pointer; }
.copy-btn:hover { background: var(--paper-3); }
.copy-status { font-size: 12px; color: var(--approve); min-height: 16px; }

@media (max-width: 880px) {
  .shell { grid-template-columns: 1fr; }
  .sidebar { position: static; height: auto; border-right: 0; border-bottom: 1px solid var(--rule); }
}
@media (prefers-reduced-motion: reduce) { * { scroll-behavior: auto !important; } }
`

const introHtml = `
<div class="intro">
  <h2>怎麼用這份清單</h2>
  <ol>
    <li>每一張卡片是一筆內容：上半部是繁體中文最終版本（跟正式網站呈現的一樣），下半部可以展開對照英文原文。</li>
    <li>左邊「查看英文原文」是純文字對照，不是程式碼，可以直接讀。</li>
    <li>讀完一筆，在卡片最下面按「核准」或「需要修改」；選需要修改的話，麻煩在備註欄寫下想改成什麼樣子。</li>
    <li>你按的每個決定會留在這個瀏覽器分頁裡，重新整理不會不見。全部看完後按左上角「匯出驗收結果」，複製整段文字貼回聊天視窗給我，我會照著把資料更新。</li>
  </ol>
</div>`

const html = `<!doctype html>
<html lang="zh-Hant">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(milestone.toUpperCase())} 驗收清單（白話版）</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&family=Noto+Serif+TC:wght@500;700&display=swap">
<style>${CSS}</style>
</head>
<body>
<div class="shell">
  <aside class="sidebar">
    <div>
      <p class="eyebrow">DRAW STEEL · ${esc(milestone.toUpperCase())}</p>
      <h1>擁有者驗收清單</h1>
    </div>
    <div class="progress">
      <div class="progress-bar"><span class="p-approve" id="bar-approve" style="width:0%"></span><span class="p-revise" id="bar-revise" style="width:0%"></span></div>
      <div class="progress-legend">
        <span><span class="legend-dot approve"></span>核准 <b id="count-approve">0</b></span>
        <span><span class="legend-dot revise"></span>需修改 <b id="count-revise">0</b></span>
        <span><span class="legend-dot pending"></span>尚未看 <b id="count-pending">${total}</b></span>
      </div>
    </div>
    <button type="button" class="export-btn" id="export-btn">匯出驗收結果</button>
    <button type="button" class="reset-btn" id="reset-btn">清除全部決定，重新開始</button>
    <nav class="nav">
      ${sections.map((s) => `<div><div class="nav-group">${s.group.title} · ${s.entries.length}</div>${s.navHtml}</div>`).join('')}
    </nav>
  </aside>
  <main>
    ${introHtml}
    ${sections.map((s) => `<h2 class="group-heading">${s.group.title} · ${s.entries.length} 筆</h2>${s.cardsHtml}`).join('')}
  </main>
</div>

<div class="modal-backdrop" id="modal-backdrop">
  <div class="modal">
    <div class="modal-head"><h2>驗收結果</h2><button type="button" id="modal-close" aria-label="關閉">×</button></div>
    <div class="modal-body">
      <p>複製下面整段文字，貼回聊天視窗給 AI，它會照結果更新資料狀態。</p>
      <textarea id="export-text" readonly></textarea>
      <button type="button" class="copy-btn" id="copy-btn">複製到剪貼簿</button>
      <div class="copy-status" id="copy-status"></div>
    </div>
  </div>
</div>

<script>
(function () {
  var STORE_KEY = 'ds-${milestone}-owner-review-v1';
  var entries = ${JSON.stringify(rawEntries.map((e) => ({ id: e.canon.id, nameZh: e.zh.nameZhHant, nameEn: e.canon.name, type: e.group.title })))};
  var state = {};
  try { state = JSON.parse(localStorage.getItem(STORE_KEY) || '{}'); } catch (e) { state = {}; }

  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {}
  }

  function counts() {
    var a = 0, r = 0;
    entries.forEach(function (en) {
      var d = state[en.id];
      if (d && d.decision === 'approve') a++;
      else if (d && d.decision === 'revise') r++;
    });
    return { approve: a, revise: r, pending: entries.length - a - r };
  }

  function refreshSummary() {
    var c = counts();
    document.getElementById('count-approve').textContent = c.approve;
    document.getElementById('count-revise').textContent = c.revise;
    document.getElementById('count-pending').textContent = c.pending;
    document.getElementById('bar-approve').style.width = (c.approve / entries.length * 100) + '%';
    document.getElementById('bar-revise').style.width = (c.revise / entries.length * 100) + '%';
  }

  function applyCardState(id) {
    var d = state[id] || {};
    var cardEl = document.querySelector('.decision[data-id="' + id + '"]');
    if (!cardEl) return;
    cardEl.querySelectorAll('.dec-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.decision === d.decision);
    });
    var note = cardEl.querySelector('.note');
    if (note && d.note) note.value = d.note;
    var navItem = document.querySelector('.nav-item[data-id="' + id + '"]');
    if (navItem) {
      navItem.classList.toggle('is-approve', d.decision === 'approve');
      navItem.classList.toggle('is-revise', d.decision === 'revise');
    }
  }

  entries.forEach(function (en) { applyCardState(en.id); });
  refreshSummary();

  document.querySelectorAll('.decision').forEach(function (block) {
    var id = block.dataset.id;
    block.querySelectorAll('.dec-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var current = state[id] || {};
        var next = current.decision === btn.dataset.decision ? null : btn.dataset.decision;
        state[id] = { decision: next, note: current.note || '' };
        save();
        applyCardState(id);
        refreshSummary();
      });
    });
    var note = block.querySelector('.note');
    note.addEventListener('input', function () {
      var current = state[id] || {};
      state[id] = { decision: current.decision || null, note: note.value };
      save();
    });
  });

  document.querySelectorAll('.toggle-en').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var panel = btn.nextElementSibling;
      var open = panel.hasAttribute('hidden');
      if (open) panel.removeAttribute('hidden'); else panel.setAttribute('hidden', '');
      btn.setAttribute('aria-expanded', String(open));
      btn.textContent = open ? '收起英文原文 ▴' : '查看英文原文 ▾';
    });
  });

  document.getElementById('reset-btn').addEventListener('click', function () {
    if (!confirm('確定要清除全部已標記的決定嗎？這個動作無法復原。')) return;
    state = {};
    save();
    entries.forEach(function (en) { applyCardState(en.id); });
    document.querySelectorAll('.note').forEach(function (n) { n.value = ''; });
    refreshSummary();
  });

  function buildExportText() {
    var lines = [];
    lines.push('${esc(milestone.toUpperCase())} 驗收結果 — ' + new Date().toLocaleDateString('zh-TW'));
    lines.push('');
    var byType = {};
    entries.forEach(function (en) {
      byType[en.type] = byType[en.type] || [];
      byType[en.type].push(en);
    });
    Object.keys(byType).forEach(function (type) {
      lines.push('【' + type + '】');
      byType[type].forEach(function (en) {
        var d = state[en.id] || {};
        var mark = d.decision === 'approve' ? '核准' : d.decision === 'revise' ? '需要修改' : '（尚未標記）';
        lines.push('- ' + en.nameZh + '（' + en.nameEn + '） id=' + en.id + '：' + mark);
        if (d.note) lines.push('    備註：' + d.note.replace(/\\n/g, ' / '));
      });
      lines.push('');
    });
    var c = counts();
    lines.push('合計：核准 ' + c.approve + '、需要修改 ' + c.revise + '、尚未標記 ' + c.pending + '（共 ' + entries.length + ' 筆）');
    return lines.join('\\n');
  }

  var backdrop = document.getElementById('modal-backdrop');
  document.getElementById('export-btn').addEventListener('click', function () {
    document.getElementById('export-text').value = buildExportText();
    document.getElementById('copy-status').textContent = '';
    backdrop.classList.add('open');
  });
  document.getElementById('modal-close').addEventListener('click', function () { backdrop.classList.remove('open'); });
  backdrop.addEventListener('click', function (e) { if (e.target === backdrop) backdrop.classList.remove('open'); });

  document.getElementById('copy-btn').addEventListener('click', function () {
    var ta = document.getElementById('export-text');
    ta.select();
    var status = document.getElementById('copy-status');
    var done = function (ok) { status.textContent = ok ? '已複製，可以貼回聊天視窗了。' : '自動複製失敗，文字已幫你選起來，用 Ctrl+C／Cmd+C 手動複製即可。'; };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(ta.value).then(function () { done(true); }).catch(function () {
        try { done(document.execCommand('copy')); } catch (e) { done(false); }
      });
    } else {
      try { done(document.execCommand('copy')); } catch (e) { done(false); }
    }
  });
})();
</script>
</body>
</html>
`

mkdirSync(p('docs'), { recursive: true })
const outputName = `docs/${milestone}-owner-review.html`
// 模板裡不少 ${可能為空字串的片段} 各自佔一行，值為空時該行只剩模板本身的縮排空白，
// 逐次重新產出都會讓這些行在 git diff 裡顯示成「新增一行純空白」，git diff --check 會擋下來。
// 逐行去除行尾空白（不影響 HTML／CSS／JS 語意，也不影響 <pre> 內容的視覺呈現——
// 換行前的空白本來就不影響顯示）。
writeFileSync(p(outputName), html.replace(/[ \t]+$/gm, ''), 'utf8')
console.log(`${outputName}：${total} 筆，白話對照版已產出`)

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

const read = (path) => JSON.parse(readFileSync(path, 'utf8'))

const vocabFiles = ['ability-keywords', 'action-types', 'ability-categories', 'potency-levels', 'target-components']
const labels = {}
for (const name of vocabFiles) {
  const v = read(p(`data/vocabulary/${name}.json`))
  labels[name] = Object.fromEntries(v.values.map((x) => [x.value, { en: x.en, zh: x.zhHant }]))
}

// ---- 純文字轉換 ----

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** `詞` → 標色術語；[文字](id) → 站內錨點（中文層專用，英文正典本身無此標記） */
function richText(str, idSet) {
  if (str == null) return ''
  const pattern = /\[([^\]]+)\]\(([^)]+)\)|`([^`]+)`/g
  let out = ''
  let cursor = 0
  let m
  while ((m = pattern.exec(str)) !== null) {
    out += esc(str.slice(cursor, m.index))
    if (m[1] && m[2]) {
      out += idSet.has(m[2]) ? `<a class="ref" href="#entry-${m[2]}">${esc(m[1])}</a>` : esc(m[1])
    } else {
      out += `<b class="term">${esc(m[3])}</b>`
    }
    cursor = pattern.lastIndex
  }
  out += esc(str.slice(cursor))
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

const CHAR_ZH = { might: '力量', agility: '敏捷', reason: '理性', intuition: '直覺', presence: '氣場' }
const CHAR_EN = { might: 'Might', agility: 'Agility', reason: 'Reason', intuition: 'Intuition', presence: 'Presence' }
// 6 個句型取自 docs/translation-guide.md §4.4「M0 只驗證下列常見句型」＋ willing 條款；不在表中的字串照原文顯示。
const TARGET_ZH = {
  'One creature': '1 個生物',
  'One creature or object': '1 個生物或物體',
  'One enemy': '1 個敵人',
  'Self or one ally': '自身或 1 個盟友',
  'Each enemy in the area': '區域內每個敵人',
  'One willing creature': '1 個自願的生物',
}

function characteristic(value, dict) {
  if (!value) return null
  if (typeof value === 'string') return dict[value] ?? value
  if (value.kind === 'choice') return value.options.map((o) => dict[o] ?? o).join(dict === CHAR_ZH ? ' 或 ' : ' or ')
  return value.raw ?? String(value)
}

const AREA_SHAPE_ZH = { cube: '立方' }

function distanceZh(d) {
  if (!d) return '—'
  if (d.kind === 'choice') return d.options.map(distanceZh).join(' 或 ')
  if (d.kind === 'area') return `${d.area?.within ?? ''} 格內 ${d.area?.size ?? ''} ${AREA_SHAPE_ZH[d.area?.shape] ?? d.area?.shape ?? ''}`.trim()
  const names = { melee: '近戰', ranged: '遠程', self: '自身' }
  return `${names[d.kind] ?? d.kind}${d.value != null ? ` ${d.value}` : ''}`
}
const distanceEn = (d) => (d ? d.raw ?? d.kind : '—')

const targetZh = (t) => (t ? TARGET_ZH[t] ?? t : '—')
const targetEn = (t) => t ?? '—'

const costZh = (c) => (c ? `${c.value} 點怒火` : '無')
const costEn = (c) => (c ? `${c.value} Wrath` : 'None')

/** flavor 只有在原文本身是引言（book 用引號標出角色台詞）才加中文引號；純敘述句不加。 */
const isQuotedFlavor = (canonFlavor) => !!canonFlavor && /^["“]/.test(canonFlavor.trim())

function actionTypeZh(v) { return v ? labels['action-types'][v]?.zh ?? v : '—' }
function actionTypeEn(v) { return v ? labels['action-types'][v]?.en ?? v : '—' }

// ---- 逐條組卡 ----

const groups = [
  { key: 'abilities', type: 'ability', badge: '招式', title: '招式', expected: 16 },
  { key: 'conditions', type: 'condition', badge: '狀態', title: '狀態', expected: 9 },
  { key: 'features', type: 'feature', badge: '特性', title: '職業特性', expected: 3 },
]

const rawEntries = groups.flatMap((g) => readdirSync(p(`data/canon/${g.key}`)).filter((n) => n.endsWith('.json')).sort().map((name) => {
  const canon = read(p(`data/canon/${g.key}/${name}`))
  const zh = read(p(`data/zh-Hant/${g.key}/${name}`))
  return { group: g, canon, zh }
}))

for (const g of groups) {
  const count = rawEntries.filter((e) => e.group === g).length
  if (count !== g.expected) throw new Error(`${g.title}應有 ${g.expected} 筆，目前 ${count} 筆`)
}
const idSet = new Set(rawEntries.map((e) => e.canon.id))

/** 基本結果與效力結果合併成一行呈現（指南 §6.1b），標點仿照原文的 "text; P<LEVEL, effect" 寫法；
 * 「屬性 < 等級」用徽章樣式呈現（黑底白字，仿原版規則書的效力記號），2026-07-30 第二輪裁決。 */
function tierBlock(canonTier, zhTier) {
  if (!canonTier.potency) {
    return { threshold: canonTier.threshold, zh: `<p>${richText(zhTier.text, idSet)}</p>`, en: `<p>${esc(canonTier.text)}</p>` }
  }
  const potencyZh = `${CHAR_ZH[canonTier.potency.characteristic] ?? canonTier.potency.characteristic} < ${labels['potency-levels'][canonTier.potency.level]?.zh ?? canonTier.potency.level}`
  const potencyEn = `${CHAR_EN[canonTier.potency.characteristic] ?? canonTier.potency.characteristic} < ${(labels['potency-levels'][canonTier.potency.level]?.en ?? canonTier.potency.level).toUpperCase()}`
  const zhMerged = `<p>${richText(zhTier.text, idSet)}；<span class="potency-tag">${esc(potencyZh)}</span>，${richText(zhTier.potencyEffect, idSet)}</p>`
  const enMerged = `<p>${esc(canonTier.text)}; <span class="potency-tag">${esc(potencyEn)}</span>, ${esc(canonTier.potency.effect)}</p>`
  return { threshold: canonTier.threshold, zh: zhMerged, en: enMerged }
}

/** followUpActions 接在「效果」段落下方連續呈現（原版規則書寫在同一個 Effect: 段落裡）；
 * extraCosts 比照 Trigger／Effect 給獨立標題「花費 N 點怒火」，2026-07-30 第二輪裁決改回獨立段落。
 * conditionalEffects 已撤銷（TI-28），不再呈現。 */
function abilityBody(canon, zh) {
  let zhHtml = ''
  let enHtml = ''

  zhHtml += `<div class="stats-row">
    <div><span>動作</span><strong>${actionTypeZh(canon.actionType)}</strong></div>
    <div><span>費用</span><strong>${costZh(canon.cost)}</strong></div>
    <div><span>射程</span><strong>${distanceZh(canon.distance)}</strong></div>
    <div><span>目標</span><strong>${targetZh(canon.target)}</strong></div>
  </div>`
  enHtml += `<div class="stats-row">
    <div><span>Action</span><strong>${actionTypeEn(canon.actionType)}</strong></div>
    <div><span>Cost</span><strong>${costEn(canon.cost)}</strong></div>
    <div><span>Distance</span><strong>${esc(distanceEn(canon.distance))}</strong></div>
    <div><span>Target</span><strong>${esc(targetEn(canon.target))}</strong></div>
  </div>`

  if (canon.powerRoll?.tiers?.length) {
    const charZh = characteristic(canon.powerRoll.characteristic, CHAR_ZH)
    const charEn = characteristic(canon.powerRoll.characteristic, CHAR_EN)
    const tiers = canon.powerRoll.tiers.map((t, i) => tierBlock(t, zh.powerRoll.tiers[i]))
    zhHtml += `<section class="block"><h3>檢定 <span class="chip">＋ ${esc(charZh)}</span></h3><div class="tier-list">${tiers.map((t) => `<div class="tier"><b>${esc(t.threshold)}</b><div>${t.zh}</div></div>`).join('')}</div></section>`
    enHtml += `<section class="block"><h3>Power Roll <span class="chip">+ ${esc(charEn)}</span></h3><div class="tier-list">${tiers.map((t) => `<div class="tier"><b>${esc(t.threshold)}</b><div>${t.en}</div></div>`).join('')}</div></section>`
  }

  if (canon.trigger) {
    zhHtml += `<section class="block"><h3>觸發</h3><p>${richText(zh.trigger, idSet)}</p></section>`
    enHtml += `<section class="block"><h3>Trigger</h3><p>${esc(canon.trigger)}</p></section>`
  }

  const hasEffectSection = canon.effect?.length || canon.followUpActions?.length
  if (hasEffectSection) {
    zhHtml += '<section class="block"><h3>效果</h3>'
    enHtml += '<section class="block"><h3>Effect</h3>'
    for (const t of zh.effect ?? []) zhHtml += `<p>${richText(t, idSet)}</p>`
    for (const t of canon.effect ?? []) enHtml += `<p>${esc(t)}</p>`
    ;(canon.followUpActions ?? []).forEach((fa, i) => {
      const zfa = zh.followUpActions[i]
      zhHtml += `<p>${richText(zfa.lead, idSet)}</p><ol>${zfa.options.map((o) => `<li>${richText(o, idSet)}</li>`).join('')}</ol><p>${richText(zfa.constraint, idSet)}</p>`
      enHtml += `<p>${esc(fa.lead)}</p><ol>${fa.options.map((o) => `<li>${esc(o)}</li>`).join('')}</ol><p>${esc(fa.constraint)}</p>`
    })
    zhHtml += '</section>'
    enHtml += '</section>'
  }

  ;(canon.extraCosts ?? []).forEach((ec, i) => {
    zhHtml += `<section class="block"><h3>花費 ${ec.value} 點怒火</h3><p>${richText(zh.extraCosts[i].effect, idSet)}</p></section>`
    enHtml += `<section class="block"><h3>Spend ${ec.value} Wrath</h3><p>${esc(ec.raw ?? ec.effect)}</p></section>`
  })

  return { zhHtml, enHtml }
}

function conditionBody(canon, zh) {
  const zhHtml = `<section class="block">${zh.text.map((t) => `<p>${richText(t, idSet)}</p>`).join('')}</section>`
  const enHtml = `<section class="block">${canon.text.map((t) => `<p>${esc(t)}</p>`).join('')}</section>`
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
  return { zhHtml, enHtml }
}

const CATEGORY_ZH = (v) => (v ? labels['ability-categories'][v]?.zh ?? v : null)

function card(entry) {
  const { canon, zh, group } = entry
  const body = group.type === 'ability' ? abilityBody(canon, zh) : group.type === 'condition' ? conditionBody(canon, zh) : featureBody(canon, zh)
  const category = CATEGORY_ZH(canon.abilityCategory)
  const level = canon.level != null ? `等級 ${canon.level}` : null
  const badges = [group.badge, category, level].filter(Boolean).map((b) => `<span>${esc(b)}</span>`).join('')
  const quoted = isQuotedFlavor(canon.flavor)
  const flavorZh = zh.flavor ? `<blockquote>${quoted ? `「${richText(zh.flavor, idSet)}」` : richText(zh.flavor, idSet)}</blockquote>` : ''
  const flavorEn = canon.flavor ? `<blockquote>${esc(canon.flavor)}</blockquote>` : ''

  return `
<article class="card" id="entry-${canon.id}" data-id="${canon.id}">
  <header class="card-head">
    <div class="badges">${badges}</div>
    <h2>${esc(zh.nameZhHant)} <span class="en-name">${esc(canon.name)}</span></h2>
    ${flavorZh}
  </header>
  <div class="card-body zh">${body.zhHtml}</div>
  <div class="source-line">來源：Heroes 規則書 v${canon.source.version}，第 ${canon.source.printedPage} 頁</div>
  <button type="button" class="toggle-en" aria-expanded="false">查看英文原文 ▾</button>
  <div class="card-body en" hidden>
    <div class="en-name-line">${esc(canon.name)}</div>
    ${flavorEn}
    ${body.enHtml}
  </div>
  <div class="decision" data-id="${canon.id}">
    <div class="decision-buttons">
      <button type="button" class="dec-btn approve" data-decision="approve">✅ 核准</button>
      <button type="button" class="dec-btn revise" data-decision="revise">✏️ 需要修改</button>
    </div>
    <textarea class="note" placeholder="備註（選填）——需要修改時，請盡量寫清楚要改成什麼"></textarea>
  </div>
</article>`
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
if (total !== 28) throw new Error(`應有 28 筆，目前 ${total} 筆`)

const CSS = `
:root {
  --ink: #111416; --ink-soft: #181c1f; --steel: #20262a; --line: #3b4144;
  --paper: #e5dfd2; --paper-line: #b5afa2; --ink-on-paper: #24211c;
  --muted: #a9aaa4; --red: #b63a36; --red-bright: #e05a4d; --gold: #c9a65b;
  --approve: #6f9366; --approve-bright: #86ac7c; --revise: #c9a65b;
}
* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { margin: 0; font-family: "Noto Sans TC","Microsoft JhengHei",system-ui,sans-serif; background: var(--ink); color: #ece7dc; }
a { color: inherit; }
button { font: inherit; }
:focus-visible { outline: 3px solid var(--gold); outline-offset: 2px; }

.shell { display: grid; grid-template-columns: 300px minmax(0,1fr); min-height: 100vh; }

.sidebar { position: sticky; top: 0; align-self: start; height: 100vh; overflow-y: auto; background: var(--ink-soft); border-right: 1px solid var(--line); padding: 26px 20px; display: flex; flex-direction: column; gap: 22px; }
.sidebar h1 { font: 700 20px/1.3 Georgia,"Noto Serif TC",serif; margin: 0; }
.sidebar .eyebrow { font: 11px ui-monospace,Consolas,monospace; letter-spacing: .16em; color: var(--red-bright); margin: 0 0 6px; }
.progress { display: grid; gap: 8px; font-size: 13px; }
.progress-bar { height: 8px; background: #2a2f32; display: flex; overflow: hidden; }
.progress-bar span { display: block; height: 100%; }
.progress-bar .p-approve { background: var(--approve-bright); }
.progress-bar .p-revise { background: var(--revise); }
.progress-legend { display: flex; gap: 14px; flex-wrap: wrap; color: var(--muted); font-size: 12px; }
.progress-legend b { color: #ece7dc; font-variant-numeric: tabular-nums; }
.legend-dot { display: inline-block; width: 8px; height: 8px; margin-right: 5px; }
.legend-dot.approve { background: var(--approve-bright); }
.legend-dot.revise { background: var(--revise); }
.legend-dot.pending { background: #4a5054; }

.export-btn { min-height: 44px; border: 1px solid var(--gold); background: rgba(201,166,91,.12); color: var(--gold); font-weight: 700; letter-spacing: .03em; cursor: pointer; }
.export-btn:hover { background: rgba(201,166,91,.22); }
.reset-btn { border: 0; background: none; color: #8b8e8a; font-size: 12px; text-decoration: underline; cursor: pointer; padding: 0; text-align: left; }

.nav { display: grid; gap: 18px; overflow-y: auto; }
.nav-group { font: 11px ui-monospace,monospace; letter-spacing: .14em; color: var(--muted); border-top: 1px solid var(--line); padding-top: 10px; margin-top: 4px; }
.nav-group:first-child { border-top: 0; margin-top: 0; }
.nav-item { display: flex; align-items: center; gap: 9px; padding: 7px 4px; font-size: 13px; color: #cfcbc0; border-left: 2px solid transparent; }
.nav-item:hover { color: #fff; }
.nav-item .dot { width: 7px; height: 7px; border-radius: 50%; background: #4a5054; flex: 0 0 auto; }
.nav-item.is-approve .dot { background: var(--approve-bright); }
.nav-item.is-revise .dot { background: var(--revise); }
.nav-item.is-approve { border-left-color: var(--approve-bright); }
.nav-item.is-revise { border-left-color: var(--revise); }

main { padding: 46px clamp(20px,4vw,64px) 120px; max-width: 900px; }
.intro { border: 1px solid var(--line); background: var(--ink-soft); padding: 22px 26px; margin-bottom: 44px; font-size: 14px; line-height: 1.85; color: #cfcbc0; }
.intro h2 { margin: 0 0 10px; font: 700 17px Georgia,"Noto Serif TC",serif; color: #fff; }
.intro ol { margin: 10px 0 0; padding-left: 20px; }
.intro li { margin: 6px 0; }

.group-heading { font: 700 30px Georgia,"Noto Serif TC",serif; margin: 0 0 26px; padding-top: 10px; border-top: 1px solid var(--line); }
.group-heading:first-of-type { border-top: 0; padding-top: 0; }

.card { background: var(--paper); color: var(--ink-on-paper); margin-bottom: 34px; box-shadow: 10px 10px 0 rgba(0,0,0,.28); scroll-margin-top: 24px; }
.card-head { background: #1b2023; color: #f2ede3; padding: 26px clamp(20px,3vw,36px); }
.badges { display: flex; gap: 7px; flex-wrap: wrap; margin-bottom: 14px; }
.badges span { font: 10px ui-monospace,monospace; letter-spacing: .12em; border: 1px solid #585d5f; color: #cfcbc0; padding: 4px 8px; text-transform: uppercase; }
.card-head h2 { font: 700 30px/1.2 Georgia,"Noto Serif TC",serif; margin: 0; }
.en-name { display: block; font: 13px ui-monospace,monospace; color: #9a9d99; letter-spacing: .03em; margin-top: 5px; }
.card-head blockquote { margin: 18px 0 0; font-family: Georgia,"Noto Serif TC",serif; font-style: italic; color: #babbb6; }

.card-body { padding: 26px clamp(20px,3vw,36px); }
.card-body.en { background: #ded6c4; border-top: 1px dashed var(--paper-line); }
.en-name-line { font: 700 15px ui-monospace,monospace; margin-bottom: 6px; color: #55524a; }

.stats-row { display: grid; grid-template-columns: repeat(4,1fr); border: 1px solid var(--paper-line); margin-bottom: 22px; }
.stats-row div { padding: 12px 14px; border-right: 1px solid var(--paper-line); min-width: 0; }
.stats-row div:last-child { border-right: 0; }
.stats-row span { display: block; font: 10px ui-monospace,monospace; letter-spacing: .1em; color: #6b6a62; margin-bottom: 5px; }
.stats-row strong { font-size: 13px; overflow-wrap: anywhere; }

.block { padding: 18px 0; border-top: 1px solid var(--paper-line); }
.block:first-child { border-top: 0; padding-top: 0; }
.block h3 { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin: 0 0 12px; font: 700 18px Georgia,"Noto Serif TC",serif; }
.block p { margin: 8px 0; line-height: 1.8; }
.chip { font: 10px ui-monospace,monospace; border: 1px solid #a89e8f; color: #5c3a34; padding: 4px 8px; white-space: nowrap; }
.term { color: #743732; font-weight: 800; }
.ref { color: #8c2f2c; text-decoration: underline; text-underline-offset: 3px; }

.tier-list { border: 1px solid var(--paper-line); }
.tier { display: grid; grid-template-columns: 78px minmax(0,1fr); border-bottom: 1px solid var(--paper-line); }
.tier:last-child { border-bottom: 0; }
.tier > b { display: grid; place-items: center; background: #292d2f; color: #f1e8d8; font: 17px Georgia,serif; }
.tier > div { padding: 12px 15px; }
.tier p { margin: 0; }
.potency-tag { display: inline-block; background: #292d2f; color: #f1e8d8; font: 700 11px ui-monospace,Consolas,monospace; padding: 3px 7px; margin: 0 2px; }

.block ol, .block ul { margin: 8px 0; padding-left: 20px; }
.block li { margin: 6px 0; line-height: 1.7; }
.definition-list { display: grid; gap: 0; }
.definition-list div { display: grid; grid-template-columns: 110px 1fr; gap: 16px; padding: 11px 0; border-bottom: 1px solid #c4bdb1; }
.definition-list dt { font-weight: 800; color: #783a35; }
.definition-list dd { margin: 0; line-height: 1.7; }

.source-line { padding: 12px clamp(20px,3vw,36px); font: 11px ui-monospace,monospace; color: #726d61; border-top: 1px solid var(--paper-line); }
.toggle-en { width: 100%; text-align: left; padding: 13px clamp(20px,3vw,36px); background: #d8cfba; border: 0; border-top: 1px solid var(--paper-line); color: #5c5748; cursor: pointer; font-size: 12px; letter-spacing: .04em; }
.toggle-en:hover { background: #cfc4aa; }

.decision { background: #1b2023; padding: 20px clamp(20px,3vw,36px) 24px; display: grid; gap: 12px; }
.decision-buttons { display: flex; gap: 10px; flex-wrap: wrap; }
.dec-btn { min-height: 44px; padding: 0 18px; border: 1px solid #4c5255; background: transparent; color: #d8d5cb; cursor: pointer; font-weight: 700; }
.dec-btn.approve:hover { border-color: var(--approve-bright); color: var(--approve-bright); }
.dec-btn.revise:hover { border-color: var(--revise); color: var(--revise); }
.dec-btn.approve.active { background: var(--approve); border-color: var(--approve); color: #0e1710; }
.dec-btn.revise.active { background: var(--revise); border-color: var(--revise); color: #241a04; }
.note { min-height: 52px; background: #22282b; border: 1px solid #3c4245; color: #ece7dc; padding: 10px 12px; font: inherit; font-size: 13px; resize: vertical; }
.note::placeholder { color: #71756f; }

.modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,.6); display: none; align-items: center; justify-content: center; padding: 24px; z-index: 50; }
.modal-backdrop.open { display: flex; }
.modal { background: var(--ink-soft); border: 1px solid var(--line); max-width: 640px; width: 100%; max-height: 82vh; display: flex; flex-direction: column; box-shadow: 12px 12px 0 rgba(0,0,0,.35); }
.modal-head { padding: 18px 22px; border-bottom: 1px solid var(--line); display: flex; justify-content: space-between; align-items: center; }
.modal-head h2 { margin: 0; font: 700 17px Georgia,"Noto Serif TC",serif; }
.modal-head button { border: 0; background: none; color: #cfcbc0; font-size: 20px; cursor: pointer; }
.modal-body { padding: 18px 22px; overflow-y: auto; display: grid; gap: 12px; }
.modal-body p { margin: 0; font-size: 13px; color: #b6b3a9; }
.modal textarea { width: 100%; min-height: 260px; background: #14171a; border: 1px solid #3c4245; color: #ece7dc; padding: 12px; font: 12px/1.7 ui-monospace,Consolas,monospace; }
.copy-btn { min-height: 42px; border: 1px solid var(--gold); background: rgba(201,166,91,.12); color: var(--gold); font-weight: 700; cursor: pointer; }
.copy-btn:hover { background: rgba(201,166,91,.22); }
.copy-status { font-size: 12px; color: var(--approve-bright); min-height: 16px; }

@media (max-width: 880px) {
  .shell { grid-template-columns: 1fr; }
  .sidebar { position: static; height: auto; border-right: 0; border-bottom: 1px solid var(--line); }
  .stats-row { grid-template-columns: repeat(2,1fr); }
  .stats-row div:nth-child(-n+2) { border-bottom: 1px solid var(--paper-line); }
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
<title>M0 驗收清單（白話版）</title>
<style>${CSS}</style>
</head>
<body>
<div class="shell">
  <aside class="sidebar">
    <div>
      <p class="eyebrow">DRAW STEEL · M0</p>
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
  var STORE_KEY = 'ds-m0-owner-review-v1';
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
    lines.push('M0 驗收結果 — ' + new Date().toLocaleDateString('zh-TW'));
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
writeFileSync(p('docs/m0-owner-review.html'), html, 'utf8')
console.log(`docs/m0-owner-review.html：${total} 筆，白話對照版已產出`)

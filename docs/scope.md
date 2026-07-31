# 範圍與範圍裁決

> **這份文件是各 milestone 資料範圍的唯一正式權威。**
> 建立於 2026-07-29，取代原本存放在 repository 外部的規劃檔。
>
> 之所以搬進 repository：舊的權威檔在 `~/.claude/plans/`，
> GitHub、其他 Agent、新 clone 都拿不到，範圍會各說各話。
> 2026-07-31 擴充為同時記錄 M1（見 §2）。

**這份文件只放兩件事：各 milestone 的資料範圍，以及逐筆有日期的範圍裁決。**

schema、抽取方式、欄位語意 → `docs/translation-guide.md`
各批次的抽取結果與規則事實發現 → `docs/alignment/`

**不要**把距離結構、效力屬性、費用、`followUpActions` 這類技術事實寫進本檔，
否則範圍文件會慢慢混成第二份實作指南，失去單一職責。

---

## 1. M0 資料範圍（明確列舉，不得自行擴張）

| 項目 | 確切內容 | 狀態 |
|---|---|---|
| 招式 | 懲戒者一級 14 個 —— 招牌 4（瀆神者退散！／踏向死亡！／惡徒止步！／你的同夥救不了你！）、英雄 8（3 費：聖盾在此！／衝刺追擊／神之懲護／懺悔吧！；5 費：當場拘捕／直視正義威儀！／斷罪／淨化聖火）、固有 2（審判／捨己為人） | ✅ 已完成 |
| 基礎打擊 | 近戰武器基礎打擊、遠程武器基礎打擊 | ✅ 已完成 |
| 狀況 | 9 個：出血 Bleeding、暈眩 Dazed、畏縮 Frightened、擒制 Grabbed、伏地 Prone、束縛 Restrained、緩速 Slowed、嘲諷 Taunted、虛弱 Weakened | ✅ 已完成 |
| 英雄資源說明 | 一段最小必要說明（懲戒者的「怒火 Wrath」如何取得與花費），僅供理解招式費用。**不是範型頁** | ✅ 已完成 |
| 教團（Subclass） | 3 個：驅邪 Exorcist、神諭 Oracle、典範 Paragon —— 各含說明與授予技能。**僅一級內容** | ✅ 已完成 |
| 審判：教團益處 | 獨立的特性條目（`feature.censor.judgment-order-benefit`），列出三支教團各自的加成。中文名依 2026-07-29 裁決（`data/translation-issues.json` TI-14） | ✅ 已完成 |
| ~~速查~~ | — | ⏸ **不屬 M0**，延後至上線前（見裁決 #1） |

**M0 明確不包含**：懲戒者 2–3 級招式、2 級以上的教團特性與教團招式、升級表、
領域（Domain）與領域特性、範型特性詳述、套裝、範型頁面、「前往所屬範型」連結、**速查**。

### glossary 範圍不得用估算

開始寫 UI 前，先產出**精確的術語依賴清單**寫入 `releases/m0.json`。
**清單來源必須涵蓋 M0 的全部發布文字**，即上表每一列已完成的部分——
目前是 `data/canon/` 的 28 個條目（16 招式 ＋ 9 狀況 ＋ 3 特性）。

**未列入清單的詞條，不得為了「順便整理」而納入 M0。**

---

## 2. M1 資料範圍

**收錄職業：神導士（Conduit），僅一級內容**（比照 M0：單一職業、單一等級）。裁決依據見 §3 裁決 #2。

| 項目 | 確切內容 | 狀態 |
|---|---|---|
| 招式 | 神導士一級共 23 個，分 6 組：招牌招式 8 個（角色建立時選擇其中 2 個使用：Blessed Light、Drain、Holy Lash、Lightfall、Sacrificial Offer、Staggering Curse、Warrior's Prayer、Wither）、固有招式 2 個（角色建立時自動取得、非選擇項：Healing Grace、Ray of Wrath）、反應動作 2 個（角色建立時選擇其中 1 個：Word of Guidance、Word of Judgment）、3 虔誠招式 4 個（角色建立時選擇其中 1 個：Call the Thunder Down、Font of Wrath、Judgment's Hammer、Violence Will Not Aid Thee）、5 虔誠招式 4 個（角色建立時選擇其中 1 個：Corruption's Curse、Curse of Terror、Faith Is Our Armor、Sermon of Grace）、領域內嵌招式 3 個（各自對應其領域，非角色建立時的選擇項：Faithful Friend〔自然領域〕、Grave Speech〔死亡領域〕、Hands of the Maker〔創造領域〕）。合計 8+2+2+4+4+3＝23。各組「選幾項」的規則句本身另收錄於 3 個條目：`feature.conduit.conduit-abilities`（神導士招式，職業總說明＋8 個招牌招式）、`feature.conduit.triggered-action`（反應動作，2 個反應動作）、`feature.conduit.heroic-abilities`（英雄招式，3/5 虔誠招式各 4 個），依實際印刷頁分段、各自列出並連結全部選項 | ✅ 已完成（reviewed） |
| 虔誠（英雄資源）說明 | 一段最小必要說明，含戰鬥中／戰鬥外規則，僅供理解招式費用（比照 M0 的怒火說明） | ✅ 已完成（reviewed） |
| 神明與領域（副職業機制） | 神導士的副職業選擇機制本身：如何選擇神明與領域 | ✅ 已完成（reviewed） |
| 領域一級利益對照 | 全部 12 個領域（創造、死亡、命運、知識、生命、慈愛、自然、守護、風暴、太陽、詭術、戰爭）的一級利益對照，包括各領域授予的特性或招式、以及相關技能組。**技能組是角色建立所需的規則內容，不只是呈現用索引** | ✅ 已完成（reviewed） |
| 領域虔誠與效果 | 全部 12 個領域的虔誠取得方式與領域效果 | ✅ 已完成（reviewed） |
| 具名領域特性 | 全部 9 個具名一級領域特性：Blessing of Compassion（慈愛領域）、Blessing of Comprehension（知識領域）、Sanctified Weapon（戰爭領域）、Blessing of Fortunate Weather（風暴領域）、Inner Light（太陽領域）、Inspired Deception（詭術領域）、Oracular Visions（命運領域）、Protective Circle（守護領域）、Revitalizing Ritual（生命領域） | ✅ 已完成（reviewed） |
| 禱詞 Prayer | 收錄全部 5 個選項，角色建立時選擇其中 1 個：Prayer of Destruction、Prayer of Distance、Prayer of Soldier's Skill、Prayer of Speed、Prayer of Steel | ✅ 已完成（reviewed） |
| 神導士護咒 Conduit Ward | 收錄全部 4 個選項，角色建立時選擇其中 1 個：Bastion Ward、Quickness Ward、Sanctuary Ward、Spirit Ward | ✅ 已完成（reviewed） |
| 基礎打擊 | 沿用 M0 既有的近戰／遠程武器基礎打擊，**不重複建立** | ➖ 沿用 M0，不重做 |
| 狀況 | 沿用 M0 既有的 9 個狀況，**不重複建立**（神導士一級內容未出現新的狀況種類） | ➖ 沿用 M0，不重做 |
| ~~速查~~ | — | ⏸ **不屬 M1**（沿用裁決 #1） |

**M1 明確不包含**：神導士 2 級以上內容、2 級以上領域特性與招式、完整職業升級表（僅收錄一級對應內容）、
不影響一級角色使用的高等級說明、其他職業的招式或特性、**速查**、背景介紹與世界觀散文、
Quick Build（除已批准的禱詞與一級領域特性 Quick Build 外，其餘一律不納入，見裁決 #3）、
M0 已完成的基礎打擊與狀況（不重複建立新條目）。

> ✅ **M1（神導士一級）已於 2026-07-31 完成擁有者最終驗收。** 全部 41 個條目的
> `canonReviewStatus: verified`、`meta.status: reviewed`、`reviewedBy: owner`、
> `reviewedAt: 2026-07-31`，`releases/milestones/m1.json` 的 `status` 已改為 `complete`。

> **實際頂層條目數待建模階段確認，不作為範圍的硬性限制。**
> 條目如何拆分為 JSON（例如領域內容合併或獨立成幾筆）屬建模層決定，記於翻譯指南或對齊報告，
> 不在本檔範圍內。

---

## 3. 範圍裁決紀錄

逐筆記錄，有日期。**AI 不得代為裁決。**

### #1 · 2026-07-29 · 速查延後；本階段排除 Rules Reference

**裁決**：

1. **速查現階段不做。** 它是比較特殊的工作，優先級沒那麼高，
   可能到網站上線前一刻才需要。**不屬於 M0。**
2. **本階段所有角色資料只使用 `Draw Steel: Heroes v1.01`，
   完全不使用 `DrawSteelRulesReferenceV1.pdf`。**
3. 為避免混淆，該 PDF 已從本機 `sources/official/` 移除。

**理由**：產品優先級與避免來源混淆。**不是新的授權判斷。**

**已執行**：2026-07-29 抽取的七個速查條目與其正規化檔已刪除，
只為它們新增的資料型別、欄位與區塊種類一併從 schema 與指南移除。
正典由 35 條回到 28 條。

> 曾誤用 Rules Reference 判斷狀態文字的事故紀錄，見 `docs/alignment/conditions.md`。
> 其他文件不重複那些細節。

### #2 · 2026-07-31 · M1 範圍：神導士一級，混合式領域內容粒度

**裁決**：

1. **M1 收錄神導士（Conduit）職業，僅一級內容**，比照 M0 的做法（單一職業、單一等級）。
2. 領域相關內容採**混合式粒度**：
   - 12 個領域的虔誠取得方式與領域效果，保留為一份比較型總覽內容。
   - 9 個具名一級領域特性，各自可獨立搜尋、分享與交叉連結。
   - 3 個本身是完整招式卡的領域特性，維持為獨立招式。
3. 領域一級利益對照（領域、授予特性或招式、技能組）明確納入範圍——**技能組是角色建立所需的規則內容，不只是呈現用索引**。
4. 段落層級的網站錨點（讓玩家從總覽直接跳到自己的領域）屬於**日後的網站可用性改善**，不是本次範圍批准的阻擋項。
5. **實際頂層條目數待建模階段確認，不作為範圍的硬性限制。**

**理由**：兩組領域內容在原版規則書裡的呈現方式不同——12 個領域效果無專有名稱、書本連續排版、主要查詢情境是比較；9 個具名特性各有專有名稱、書本各自成段、主要查詢情境是查詢單一規則詞。混合式粒度對應這個差異，而非為了條目數接近 M0 而強行合併或拆分。條目如何拆分為 JSON（`origin.kind`、section 數等）屬建模層決定，不記於本檔，待範圍批准後記於翻譯指南或對齊報告。

### #3 · 2026-07-31 · M1 Batch 3：Healing Grace／Ray of Wrath 納入範圍；招式分組訂正；統一「導靈／虔信」為「神導士／虔誠」

**裁決**：

1. **Healing Grace（治癒恩典）與 Ray of Wrath（神怒光束）納入 M1。** 兩者是神導士的**固有招式**（角色建立時自動取得，非「選擇 2 項招牌招式」的可選項），與審判／捨己為人在懲戒者職業中的地位相同。裁決 #2 當時的範圍表遺漏了這兩個固有招式，本次補上。
2. **神導士一級招式總數由 21 改為 23，正確分組為：招牌 8＋固有 2＋反應 2＋3 虔誠 4＋5 虔誠 4＋領域內嵌 3＝23。** 招牌招式維持原本的 8 個（Blessed Light、Drain、Holy Lash、Lightfall、Sacrificial Offer、Staggering Curse、Warrior's Prayer、Wither），**Healing Grace／Ray of Wrath 不計入招牌，獨立列為固有招式**（2026-07-31 Reviewer 複核訂正：草稿初版曾誤把這兩個固有招式併入招牌招式數，寫成「10 個招牌」，導致總數公式失真，已訂正）。
3. **反應動作的 `abilityCategory` 採 `inherent`，不新增 `reaction` 分類值。** 反應動作是 `actionType`（觸發式）而非招式分類，Word of Guidance／Word of Judgment 的 `abilityCategory` 與治癒恩典／神怒光束同為 `inherent`（2026-07-31 Reviewer 複核訂正：草稿初版曾新增 `abilityCategory: "reaction"`，已撤銷）。
4. **全文統一用詞**：既有文件中殘留的「導靈」「虔信」一律改為「神導士」「虔誠」，與 M0 起即採用的正式譯名一致（見 `NEXT-SESSION.md`）。
5. **領域名稱訂正**：慈愛（Love，非「愛」）、詭術（Trickery，非「詭計」）——沿用舊譯 `sources/notion-export/class-notion/conduit/` 一貫用法，裁決 #2 表格中的簡稱屬草擬時的簡寫，非正式譯名裁決；2026-07-31 Reviewer 複核確認定案。
6. **技能組譯名定案**：Crafting＝工藝類、Lore＝學識類、Exploration＝探索類、Interpersonal＝交涉類、Intrigue＝隱密類（2026-07-31 Reviewer 複核，擁有者確認）。
7. **角色建立的選擇規則補建為正典資料**：招牌選 2、反應選 1、3 虔誠選 1、5 虔誠選 1，這幾句規則文字先前只寫在本檔的敘述文字裡，未進入 `data/canon/`。已新增 3 個條目收錄這些規則句，並各自列出、連結全部選項（不只重述規則句），依實際印刷頁分段：`feature.conduit.conduit-abilities`（神導士招式，pdfPage 6／printedPage 99）、`feature.conduit.triggered-action`（反應動作，pdfPage 5／printedPage 98）、`feature.conduit.heroic-abilities`（英雄招式，pdfPage 8／printedPage 101）（2026-07-31 Reviewer 第一、二輪複核要求）。

**理由**：Batch 3 完整抽取神導士一級正典時，逐頁核對 `05-conduit.pdf` p.2（1st-Level Features 清單同時列出 Healing Grace、Ray of Wrath 與招牌招式選擇機制，兩者明顯屬固有），發現裁決 #2 的範圍表統計有誤。用詞不統一則是先前撰寫範圍表時的疏漏，非刻意裁決，一併訂正以免新 Agent 誤讀為兩個不同職業。第 2、3 項是 Batch 3 初版草稿本身的計數與建模錯誤，經 Reviewer 第二層複核抓出後訂正，非裁決 #2 的問題。

**已執行**：Batch 3 完整抽取上表全部項目，中英文條目已建立。抽取當下 `canonReviewStatus`／`meta.status` 一律 `draft`，待擁有者逐筆核准；對齊與翻譯差異報告見 `docs/alignment/zh-batch3-conduit-alignment.md`。**2026-07-31 同日稍後完成擁有者最終驗收，全部 41 筆已升級為 `verified`／`reviewed`，M1（神導士一級）內容正式完成。**

---

## 4. 範圍出問題時的處理

**範圍的權威是本文件與專案擁有者，不是來源 PDF 的頁面內容。**

2026-07-29 曾發生一次誤判：把「某某頁涵蓋範圍」理解成去讀那頁 PDF 上有什麼，
於是把主要動作、機動動作與擒抱三張卡也做成了正典條目，事後全數移除。

遇到範圍不明時：**先問擁有者，不要自行擴大解釋。**

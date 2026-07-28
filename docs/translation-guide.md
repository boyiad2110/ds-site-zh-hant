# Draw Steel 正體中文翻譯指南

> **狀態：已批准**（2026-07-28 通過「捨己為人」樣張驗收）。
> 建立日期 2026-07-28。內容**歸納自 `sources/notion-export/` 的既有譯文**，非憑空規定。
> **M0 範圍與範圍裁決見 `docs/scope.md`**（唯一正式權威）。本檔只管 schema、抽取方式與翻譯規則。

---

## 1. 權威順序

翻譯工作的性質是**對齊**，不是從零重譯。專案已有完整舊譯與既有術語表，工作是核對新版正典、找出差異、補上缺漏。

> 術語表與詞彙表的**最新條目數與 approved 筆數見 `NEXT-SESSION.md` 的「目前基線」**。
> 本檔不重複統計數字——那些數字每輪都在動，寫死在指南裡必然過期。

衝突時依下列順序裁決：

| 順位 | 來源 | 決定什麼 |
|---|---|---|
| 1 | **英文正典 —— Heroes 原版規則書內文**（`sources/official/Draw_Steel_Heroes_v1.01/*.pdf`） | 規則含義 |
| 2 | **`approved` glossary** | 固定術語 |
| 3 | **本指南（經批准後）** | 語氣、句法、格式 |
| 4 | **舊譯**（`sources/notion-export/`） | 既有風格與譯法**證據**，遷移來源 |
| 5 | **AI** | 草稿與建議 |

⚠️ **規則文本一律以 Heroes 原版規則書的內文為準，其他一切只是參考**（擁有者 2026-07-28 重申）。

「其他」包括但不限於：

| 來源 | 為何只是參考 |
|---|---|
| `DrawSteelRulesReferenceV1.pdf` | ❌ **本階段完全不使用**（擁有者 2026-07-29 裁定，見 `docs/scope.md` 裁決 #1）。曾誤用的事故紀錄見 `docs/alignment/conditions.md` |
| Heroes `00-the-basic` 的詞彙表 | 索引式一句話摘要，連觸發條件都與正文不同。**不是規則正文** |
| 舊譯 `sources/notion-export/` | 見下 |
| Foundry VTT／Forge Steel／Steel Compendium | 授權因素排除，且不得進入 `data/canon/`（清單見 `NEXT-SESSION.md`） |

**抽任何條目前，先確認來源分冊是 Heroes 的規則正文。**

⚠️ **舊譯不是權威。** 它可能與尚未審核的舊術語表衝突（如 `Triggered Action`：舊譯 135 檔一致用「觸發式動作」，舊術語表寫「反應動作」），也存在格式不一致與可能來自舊版規則的內容。它是本指南規則的**來源**，但不能直接當標準。

> 註：上述並非舊譯的**內部**不一致——舊譯在該詞上完全一致（觸發式動作 135 檔、反應動作 0 檔）。衝突發生在舊譯與舊術語表之間，由裁決解決（§附錄 A）。

### 1.1 正典必須以頁面圖像閱讀

純文字抽取（pypdf 等）會**靜默**打亂雙欄順序、使符號字元失去語意、把表格與側欄插入正文。實測：Heroes p.16 抽出的順序是 4→5→6→7→1→2→3。

**危險的不是亂碼**（看得見），**是靜默的順序錯亂與遺漏**（讀起來通順）。

**規則：正典核對一律以 poppler 算繪的頁面圖像進行。** 純文字抽取僅作定位與檢索，不得作為內容來源。

---

## 2. 內容分類

AI 產出中文的方式是生成，內部沒有可稽核的步驟鏈。紀律必須建立在 AI 之外：**每個欄位先分類，再處理。**

| 類別 | 涵蓋 | 處理方式 |
|---|---|---|
| **語言無關資料** | 數值、ID、門檻、骰型、參照 | 原樣搬移，不經判斷 |
| **受控本地化** | 關鍵詞、動作類型、屬性、狀態、距離類型 | 查受控詞彙表決定譯名。仍屬本地化，只是**決定一次、套用多次** |
| **條目專屬譯文** | 名稱、敘述、Trigger、Effect、階層效果文字 | 真正的翻譯判斷，**風險集中於此** |

以「惡徒止步！」Halt Miscreant! 為例，全卡約 70% 屬前兩類，只有名稱與一句敘述是條目專屬譯文。**審核力氣應集中在第三類。**

### 2.1 對資料分層的結論

**受控本地化的欄位不進翻譯層**，於算繪時從 vocabulary 解析。

**翻譯層（`data/zh-Hant/`）保存各型別的條目專屬文字**，招式的情形包括但不限於：

```
name、flavor、trigger、effect、extraCosts[].effect、
powerRoll.tiers[].text、
以及無法可靠結構化的 target 或其他規則文字
```

⚠️ **`powerRoll.tiers[].text` 必須進翻譯層。** 階層結果除傷害數值外常附帶推動、狀態、移動或特殊效果，不可能全靠 vocabulary 組合產生。

此清單**不是固定欄位表**——其他型別（族裔特性、專長、糾葛、狀態）各有自己的條目專屬文字欄位，於各型別建模時個別決定。

---

## 3. 工作流程

### 第一層 · 對齊（AI 執行，輸出報告）

透過舊譯的「原文」欄位把每一筆對回英文正典，逐欄比對，輸出差異報告。標記見 §8。

### 第二層 · 補缺草稿（AI 執行，範圍受限）

僅在 `missing` 時產生中文，且：

- 一律標 `TranslationMeta.status = 'draft'`，**AI 不得自行標為 `approved`**
- **必然附上對應英文原文與來源定位**
- 用詞一律取自 `approved` glossary；不在表中時**不得自行造詞**（見 §9）

### 第三層 · 裁決（專案擁有者，唯一權威）

**AI 一律標註，不自行改寫舊譯**，包含客觀欄位不符的情形——AI 提出修正建議，但不直接套用。

例外：已裁決的術語（§附錄）由工具批次套用，標記為 `term-applied` 僅供知悉。

### 3.1 未決項的處理 —— 停止批准，不是停止工作

⚠️ 「查不到就停」容易被誤解成整個條目或批次停擺。正確規則：

1. 該欄位標為 `unresolved`，**不猜、不填**
2. **繼續處理同一條目的其他欄位**——數值、距離、階層、其他已確認的文字照常核對
3. 該條目的 `TranslationMeta.status` 不得升至 `approved`
4. 該條目不得進入 release manifest

**阻擋的是批准，不是處理。**

---

## 4. 受控詞彙表

### 4.1 關鍵詞

以「、」分隔，**順序沿用英文原文順序**。

| EN | 中文 | | EN | 中文 |
|---|---|---|---|---|
| Melee | 近戰 | | Ranged | 遠程 |
| Area | 區域 | | Magic | 魔法 |
| Strike | 打擊 | | Weapon | 武器 |

### 4.2 動作類型

| EN | 中文 |
|---|---|
| Main action | 主要動作 |
| Maneuver | 機動動作 |
| Triggered action | 反應動作 |
| Free triggered action | 免費反應動作 |

### 4.3 距離

| EN | 中文 | 備註 |
|---|---|---|
| `Melee 1` | 近戰 1 | |
| `Ranged 10` | 遠程 10 | |
| `2 cube within 1` | 1 格內 2 立方 | **語序反轉**：英文「範圍 within 距離」→ 中文「距離內 範圍」 |
| `3 burst` | 3 爆發 | |

**正典的距離存成結構，並保留原文字串**（2026-07-28 擁有者裁定）：

| 原文 | 結構 |
|---|---|
| `Melee 1` | `{ kind:"melee", value:1, raw:"Melee 1" }` |
| `Ranged 10` | `{ kind:"ranged", value:10, raw:"Ranged 10" }` |
| `2 cube within 1` | `{ kind:"area", area:{ shape:"cube", size:2, within:1 }, raw:"2 cube within 1" }` |
| `Melee 1 or ranged 5` | `{ kind:"choice", options:[近戰結構, 遠程結構], raw:"Melee 1 or ranged 5" }` |

> `choice` 是 2026-07-28 抽取 p.6 時新發現的形狀（直視正義威儀！、淨化聖火）。
> 原本掃 p.3／p.5 時只有三種，故先前報告寫「14 個招式只出現三種形狀」是**以偏概全**——
> 那時只掃了兩頁。實際四種。

`raw` 永遠保留未加工的原文，供稽核時直接比對 PDF，不必反推。

### 4.3.0 效力記號：字母是**目標被測的屬性**，逐招式不同

`P<WEAK`、`I<WEAK`、`M<WEAK` 的第一個字母**不是**使用者的屬性，也不是範型固定值，
而是**目標用來抵抗的屬性**，每個招式各自指定。懲戒者一級三個招式就用了三種：

| 招式 | 檢定加的屬性 | 效力測的屬性 |
|---|---|---|
| 惡徒止步！ | 力量 Might | **氣場 Presence** |
| 懺悔吧！ | 氣場 Presence | **直覺 Intuition** |
| 淨化聖火 | 力量 Might | **力量 Might** |

**另一件事不可與此混為一談：WEAK／AVERAGE／STRONG 的「數值」是範型層級的定義，不是招式層級。**
Heroes 印刷頁 79 的懲戒者基礎資料直接寫出三個門檻：

```
Weak Potency:    Presence − 2
Average Potency: Presence − 1
Strong Potency:  Presence
```

招式卡上的 `P<WEAK` 只是**引用**這個門檻。因此 `potency` 只存 `level`（weak／average／strong），
實際數值要由範型資料解析——範型層需要 `potency: { weak, average, strong }` 一欄。

**一句話分辨：字母＝測目標的什麼屬性（逐招式不同），範型定義＝門檻是多少（逐範型不同）。**

存法：`text` 不含效力記號、`potency` 存 `{ characteristic, level }`、`raw` 存完整原文。

### 4.3.1 費用：沒有費用一律存 `null`

> 2026-07-28 外部 review 指出，未定義會導致篩選時出現兩套表示法。

| 情形 | 正典存法 |
|---|---|
| 標題無括號（招牌招式、固有招式） | `cost: null` |
| 標題有 `(3 Wrath)` | `cost: { resource:"wrath", value:3 }` |

**舊 CSV 的「費用 0」一律正規化為 `null`**，不存 `value: 0`。
`null` 的意思是**「這個招式沒有英雄資源費用」**，不是「來源沒提供資料」——
正典一律逐張卡人工核對，不存在「沒讀到」的狀態；讀不到就是抽取失敗，該條目不會建立。

對齊報告中，舊 CSV `0` 對正典 `null` 標為 `acceptable`（正規化），並附本節連結，不標 `exact`。

### 4.3.2 「花費 X，從以下選一個」不是額外花費

「審判」的四選一是**招式效果持續期間可用的後續動作群組**，不是使用招式時的費用。
兩者混存會讓網站把它讀成基本費用。故另立欄位：

```json
"followUpActions": [{
  "availability": "while-effect-active",
  "actionType": "free-triggered",
  "cost": { "resource": "wrath", "value": 1 },
  "choose": "one",
  "lead": "…原文引言…",
  "options": [ "…", "…", "…", "…" ],
  "constraint": "…原文限制句…"
}]
```

`extraCosts` 只保留**真正的追加花費**——例如「捨己為人」效果段內獨立的 `Spend 1 Wrath:` 子句，
那是在使用招式時額外支付以獲得額外效果，與上者性質不同。

### 4.4 目標 —— 不建整句翻譯表

全書會出現大量排列（`Up to two creatures`、`One willing creature`、`Each target in the burst`…），逐句登錄會變成無限增長的片語表。

**原則：**

- **能穩定拆解的，存為結構化資料由 renderer 組合**
  數量（`one`→「1 個」、`up to two`→「最多 2 個」）
  ＋ 修飾（`willing`→「自願的」）
  ＋ 對象（`creature`→「生物」、`enemy`→「敵人」、`ally`→「盟友」、`object`→「物體」、`self`→「自身」）
  ＋ 範圍（`in the area`→「區域內」，**中文置於前方**）
- **特殊或複雜句型保留為條目專屬譯文**，不強求全部結構化

M0 只驗證下列常見句型可否由組合規則產生：

| EN | 中文 |
|---|---|
| One creature | 1 個生物 |
| One creature or object | 1 個生物或物體 |
| One enemy | 1 個敵人 |
| Self or one ally | 自身或 1 個盟友 |
| Each enemy in the area | 區域內每個敵人 |

共通規則：`One` 一律譯為阿拉伯數字「1 個」。

### 4.5 檢定與效力

| EN | 中文 |
|---|---|
| Power Roll | 檢定 |
| Test | 考驗 |
| Ability Roll | 招式檢定 |
| `Power Roll + Might` | **檢定** + `` `力量` `` |
| `P<WEAK` | `` `氣場 < 弱` `` |
| `M<AVERAGE` | `` `力量 < 中` `` |
| `I<STRONG` | `` `直覺 < 強` `` |

⚠️ Power Roll／Test／Ability Roll **三者不可混用**。

⚠️ 效力記號中的 `P`／`M`／`I` 是**目標要對抗的屬性**，中文直接展開成屬性名。效力數值由**範型**定義（懲戒者：弱＝氣場−2、中＝氣場−1、強＝氣場）。

### 4.6 其他

| EN | 中文 |
|---|---|
| holy damage | 神聖傷害 |
| psychic damage | 心靈傷害 |
| (save ends) | （豁免解除） |
| Saving Throw | 豁免 |
| push N | 推動 N |
| shift | 遁移 |
| Recovery | 復元力 |
| Recovery Value | 復元值 |
| Stamina | 體力 |
| **EoT / EoE** | **保留英文縮寫，不翻譯** |

### 4.7 M0 第二批抽取新增的結構（2026-07-29）

抽取基礎打擊、教團與怒火時遇到既有 schema 裝不下的東西，新增下列欄位與型別。
**都是既有結構的自然延伸，沒有改寫任何既有的 23 個條目。**

> 本節只描述**目前真的有正典條目在用**的結構。
> 沒有使用者的欄位不留在這裡——未來實際遇到時再重新建模。

#### (1) `powerRoll.characteristic` 可以是二選一

兩個基礎打擊的檢定是 `Power Roll + Might or Agility`。
既有 14 個招式都是單一屬性（存字串 `"might"`），故沿用 §4.3 `distance` 的做法，
**單一時存字串、二選一時存物件**：

| 原文 | 結構 |
|---|---|
| `Power Roll + Might` | `"characteristic": "might"` |
| `Power Roll + Might or Agility` | `"characteristic": { kind:"choice", options:["might","agility"], raw:"Might or Agility" }` |

⚠️ 這代表網站讀這個欄位時**必須判斷型別**，不能一律當字串。已列入驗證邊界二的待驗清單。

#### (2) `abilityCategory` 新增 `basic`、`origin.kind` 新增 `core`

基礎打擊**不屬於任何範型**，是全遊戲通用招式。

```json
"origin": { "kind": "core", "id": null },
"abilityCategory": "basic",
"level": null
```

`level: null` 的意思是「這個招式沒有等級」，不是「不知道等級」。
（舊 CSV 把基礎打擊記為「招牌／1 級」，那是舊資料的分類方式，**正典不跟隨**。）

#### (3) 新資料類型 `feature` —— 散文式職業特性

教團、怒火、審判教團利益都不是招式卡，是**有標題階層的散文**，招式 schema 完全裝不下。
放在 `data/canon/features/`，結構是「章節 → 區塊」兩層：

```json
{
  "type": "feature",
  "sections": [
    { "heading": null | "小標題原文", "blocks": [ …區塊… ] }
  ],
  "origin": { "kind": "class", "id": "class.censor" },
  "relatedTo": ["ability.censor.judgment"],
  "level": 1
}
```

區塊目前只有兩種，**遇到新版式再加，不預先發明**：

| `kind` | 用途 | 欄位 | 出現在 |
|---|---|---|---|
| `paragraph` | 一般段落 | `text` | 全部 |
| `definitionList` | 「**粗體詞**：說明」的清單 | `marker`（`"none"` 無項目符號／`"bullet"` 有）、`items[{term,text}]` | 教團、審判教團利益 |

`marker` 存在的理由：教團三支是無項目符號的懸掛縮排，審判教團利益是 ¥ 項目符號清單，
**版面不同但語意相同**，合併成同一種區塊會丟掉排版資訊。

正規化檔（`_normalized/*.txt`）的行前綴：
`name:` / `section:` / `p:` / `def: 詞 :: 說明`。

#### (4) ⚠️ 既有 `_normalized/*.txt` 有兩套大小寫慣例（尚未處理）

`verify-canon-hash.mjs` 是逐檔比對，所以**功能上沒有壞**，但同一批正典裡並存兩種寫法：

| 慣例 | 條目數 | 例 |
|---|---|---|
| 照 PDF 原樣 | 4 | `actionType: Main action`、`keywords: Melee, Strike, Weapon`、`tier<=11:` |
| 全小寫 | 10 | `actionType: main`、`keywords: melee, strike, weapon`、`tier≤11:` |

本輪新增的 5 個條目一律採**照 PDF 原樣**（正規化檔的用途是逐字比對原文，愈接近原文愈好）。
統一舊的 10 個會使那 10 個 hash 全部改變，**屬於要不要做的取捨，留給擁有者裁決**，本輪不動。

---

## 5. 階層呈現

**採官方門檻徽章：`≤11` / `12-16` / `17+`。**

舊譯使用 `1️⃣ 2️⃣ 3️⃣`，與官方書不一致。改採門檻的理由：跑團時玩家擲出點數後可直接對應，不需再記「二階是幾到幾」；且與符號字型的實際渲染一致。

**這是對舊譯的全域格式變更，屬排版級，自動歸一。**

---

## 6. 排版規範

| 規則 | 範例 |
|---|---|
| 屬性、資源、遊戲數值一律 inline code | `` `力量` `` `` `氣場` `` `` `怒火` `` `` `體力` `` `` `復元力` `` `` `復元值` `` `` `速度` `` |
| 數字與中文之間半形空格 | 「推動 1」「花費 1 點」「10 格內」 |
| 數量詞用阿拉伯數字 | 「1 個生物」，不寫「一個生物」 |
| 乘號緊貼阿拉伯數字 | `` `氣場` `` ×2 —— `×` 與數字間**不加空格**；`×` 與中文／inline code 間加半形空格 |
| 全形標點 | ：、（）。「」 |
| 中英並列以全形空格（U+3000）分隔 | 惡徒止步！　Halt Miscreant! |
| 敘述文字：斜體引用 | `> *你為武器注入神聖魔法，使敵人難以逃離。*` |
| 段落標記 | `**效果**：` `**觸發**：` `**花費 N 怒火**：` |

> Notion 舊譯的 🔍📐⏩🎯 欄位圖示是 Notion 的呈現手段。新站這些是結構化欄位，改由 `<Glyph>` 元件渲染，**不進資料**。

---

## 7. 條目專屬譯文的規則

**條目專屬譯文分兩種，規則不同，不可混用同一套標準。**

共通：**規則文本一律用第二人稱「你」，即使原文是第三人稱**；
**保留原文的句子邊界**，讓對齊可逐句核對。

> **2026-07-28 擁有者裁決。** 原文寫法並不一致——招式用第二人稱（“You channel power…”），
> 狀態用第三人稱（“A creature who is dazed…”）。中文一律採第二人稱，理由是**讓玩家更好理解**。
> 這是既有舊譯的一致做法，此處正式確立為通則，**不再逐條提報**。
>
> 影響範圍：9 個狀態全部（「若你處於暈眩狀態…」）、以及日後任何第三人稱原文。
> 此項不列為 `prose-issue`，不進對齊報告。

### 7.1 規則文字 —— 嚴格

適用：`trigger`、`effect`、`extraCosts[].effect`、`powerRoll.tiers[].text`、以及任何影響機制的敘述。

用祈使／陳述語氣，不加語助詞。**四項禁令：**

1. **不得為求文句變化而替換同義詞。** 英文規則文字刻意扁平重複，重複是特性不是缺點。
2. **不得補上原文沒有的連接詞**（「因此」「並且」「若…則」）。
3. **不得統一原文刻意不統一的用語。** creature／target／enemy 的差別可能是機制性的。
4. **不得把模糊處寫得比原文確定** —— 也**不得把確定處說成模糊**。前者讀起來最像「翻得好」；後者會製造假問題浪費裁決時間。

**額外必檢項 —— 限定語。** `on the target`、`adjacent`、`within N`、`willing`、`that you can see` 這類限定若遺漏，會擴大規則的適用範圍。這是 🔴 high 級問題（§8.2）。

### 7.2 敘述文字（flavor）—— 寬鬆，允許改寫

適用：`flavor`（招式標題下的斜體句）、純氣氛描述。

**專案既定做法：flavor 允許適度改寫，以求通順與風格，不採逐字直譯。**（2026-07-28 專案擁有者確認，見樣張 PN-1 裁決）

因此下列**不算問題**：

- 省略程度限定（`some of your vitality` →「生命能量」）
- 增添不改變意象的具體化（「注入自己或盟友**體內**」）
- 調整句式使中文更順

仍**不允許**：

- 改變意象本身（火焰寫成閃電）
- 暗示原文沒有的機制（flavor 裡寫出實際數值或條件）

flavor 的差異一律列為 ⚪ low，**不阻擋批准**。

### 7.3 已知失效模式與防護

| 失效模式 | 為何危險 | 防護 |
|---|---|---|
| **流暢但錯誤** —— 門檻數字錯、動作類型標錯、漏一個「不」、「或」寫成「和」 | 讀起來毫無異狀，直到有人在牌桌上用錯 | 報告強制並列英文原文；release manifest 內 100% 人工核對 |
| **靜默順序錯亂** | 抽取結果自身不會報錯 | §1.1 圖像閱讀 |
| **自行造詞** | 術語漂移 | §9 待決清單 |
| **過度自信的判斷理由** | 使裁決者降低警覺 | 判斷欄須標明依據原文哪一段；無法定位時標 `uncertain` |
| **省略限定語** | 「目標身上的效果」寫成「效果」會擴大適用範圍 | 逐句邊界對齊；限定語列為必檢項 |

---

## 8. 對齊報告

### 8.1 三個維度，不是一套標記

同一欄位可以**同時**「結構與原文一致」且「術語尚未批准」。把兩者混成一套標記會產生「明明 unresolved 卻算 match」的理解障礙。

> **2026-07-28 修訂（外部 review 指出）**：原本只有兩個維度，`match` 同時涵蓋
> 「原文與舊譯逐字相同」「中文必要語序調整」「允許的 flavor 改寫」「`0`→`null` 正規化」四種。
> 這把**「抽取是否正確」**與**「翻譯是否完全相同」**混成同一個數字。
> 現拆為三個維度，統計不再互相污染。

**維度一 · 來源抽取**（每個**條目**一個，非每欄位）

回答的是「我們讀出來的英文正典對不對」，與翻譯無關。

| 值 | 意義 |
|---|---|
| `verified` | 三來源（`-layout` 文字／150dpi 圖像／舊 CSV）逐欄比對相符 |
| `failed` | 任一欄不符 → 該頁改用算繪判讀，並於報告記錄不符的欄位 |

**維度二 · 翻譯對齊**（互斥，每欄位恰好一個）

回答的是「舊譯與正典的關係」。

| 值 | 意義 |
|---|---|
| `exact` | 逐字對應，無增刪 |
| `acceptable` | 內容等價但字面不同：中文必要語序調整、§7.2 允許的 flavor 改寫、`0`→`null` 之類的正規化。**必須逐筆寫出理由**，不得只標 `acceptable` |
| `mismatch` | **客觀欄位**不符（數值、距離、門檻、動作類型、關鍵詞） |
| `missing` | 正典有、舊譯無 |
| `extra` | 舊譯有、正典無 |

> `exact` 與 `acceptable` 都不阻擋批准；差別在於 `acceptable` 必須附理由，讓裁決者能否決。
> 統計摘要**必須分開列出兩者的筆數**，不得合併成一個「相符」數字。

**維度三 · 問題**（可多個，可為 none）

回答的是「這個欄位有沒有卡住批准的問題」。

| 值 | 意義 | 阻擋批准 |
|---|---|---|
| `unresolved-term` | 用到的詞不在 `approved` 詞彙／術語表 | ✅ |
| `term-conflict` | 用詞與表衝突且**尚未裁決** | ✅ |
| `prose-issue` | 條目專屬譯文的語意問題（見 §8.2 分級） | 依嚴重度 |
| `term-applied` | 術語**已裁決**、自動套用 | ❌ 僅供知悉 |
| `none` | 無 | ❌ |

報告標頭同時顯示維度二與維度三；維度一寫在條目資訊區：

```
抽取  verified

[exact] distance
[exact · unresolved-term] target
[acceptable] flavor          理由：§7.2 允許的改寫，見 PN-1
[mismatch] effect
```

### 8.2 `prose-issue` 的嚴重度與阻擋規則

散文不存在「客觀不符」，但可能有省略、增添、限定語漂移。**分級必須連動阻擋規則，否則只是視覺標籤。**

| 嚴重度 | 判準 | 未裁決時 |
|---|---|---|
| 🔴 **high** | 可能改變**對象、範圍、條件、時機、數值、義務或禁止事項** | **阻擋批准** |
| 🟡 **medium** | 增減原文語意、改用縮寫或加入解釋，但暫無明確機制影響 | **阻擋批准** |
| ⚪ **low** | 純 flavor、語氣或修辭差異 | **不阻擋**，列入報告供知悉 |

> ⚠️ `low` 不阻擋是刻意的。敘述文字本就允許改寫（§7.2），若每個 flavor 的細微差異都變成發布阻擋，人工負擔會迅速膨脹。

### 8.3 單筆格式

```
[<對齊狀態> · <問題>] <條目 id> / <欄位路徑>
  舊譯    …
  原文    …
  套用    …（僅 term-applied）
  判斷    …（須標明依據原文哪一段；無法定位時標 uncertain）
  建議    …（僅在有具體替代文字時填寫）
  證據    …（🔴 high 必附算繪裁切圖路徑）
  來源    <document>  pdfPage N / printedPage N
```

- **`建議` 欄**：裁決者要的是可直接採用的替代文字，不是問題描述。無具體方案時留空。
- **`證據` 欄**：🔴 high 項目必附 300dpi 裁切圖的檔案路徑（不嵌圖，避免報告膨脹）。

### 8.4 批次報告格式

單一條目可逐欄展開；**14 個招式的批次報告不行，會長到無法使用。**

**只展開需要裁決的項目：**

```
mismatch · missing · extra · unresolved-term · term-conflict · prose-issue
```

**`match` 且無問題者收成表格：**

| 條目 | 欄位 | 狀態 |
|---|---|---|
| 惡徒止步！ | name, distance, target, trigger, tiers[0-2] | ✅ match |
| 斷罪 | name, keywords, distance | ✅ match |

**`term-applied` 收進頂端摘要，不逐欄展開：**

```
本批已自動套用：
  反應動作      6 筆
  免費反應動作   1 筆
  武器          8 筆
```

例外：某次套用導致句子需要人工重組時，該筆單獨展開。

**統計摘要置頂：** 各對齊狀態筆數、各問題筆數、🔴/🟡 未裁決數（＝阻擋批准的項目數）。

### 8.5 常見誤報

⚠️ **「檢定屬性與效力屬性不同」是常態，不是錯誤。**
「惡徒止步！」檢定用力量、效力用氣場；「懺悔吧！」檢定用氣場、效力用直覺。
**對齊工具不得把兩者不一致判為 `mismatch`。**

---

## 9. 問題的登記去向

| 情形 | 去向 |
|---|---|
| 需要的詞不在術語／詞彙表 | `data/glossary-pending.json` |
| 該詞為 `needs-review` 或 `deprecated` | `data/glossary-pending.json` |
| 舊譯用法與表衝突且尚未晉升 `approved` | `data/glossary-pending.json`（附使用統計） |
| 原文語意有兩種合理讀法 | `data/translation-issues.json` |
| 舊譯與新版正典的規則差異 | `data/translation-issues.json` |
| 用詞級格式不一致 | `data/translation-issues.json` |

分開的理由：混在一起會讓 glossary 檔逐漸塞滿與詞彙無關的問題，失去作為術語權威的清晰度。

### 9.1 待決詞必須標示最終資料歸屬

**不是所有缺詞都該變成 glossary 條目。** 專案的資料設計把 vocabulary（受控值）與 glossary（一般術語）分離，pending 項目必須標明歸屬，否則所有缺詞最後都被塞進 glossary。

**受控詞彙**（關鍵詞、動作類型、目標結構、距離類型…）：

```json
{
  "kind": "vocabulary",
  "vocabulary": "ability-keyword",
  "en": "Magic",
  "candidates": ["魔法"],
  "context": ["ability.censor.my-life-for-yours"],
  "sourceRef": { "document": "heroes-v1.01-04-censor", "pdfPage": 3 }
}
```

**一般術語**（規則名詞、專有名稱…）：

```json
{
  "kind": "glossary",
  "en": "Effect",
  "sense": "rules-effect",
  "candidates": ["效果"],
  "note": "須與標題標記 `Effect:` 區分——後者是版式標籤，非規則名詞"
}
```

> `sense` 欄用於一詞多義。`Effect` 作為規則名詞（持續效果）與作為招式版式的段落標題是兩件事，不可共用一個條目。

**AI 在任何情況下都不得自行造詞或自行挑選。**

### 9.2 資料檔佈局（2026-07-28 建立）

```
sources/glossary_old.csv        來源，已匯入後凍結 —— 不再編輯、不作為執行期權威
data/decisions.json             擁有者的裁決紀錄（唯一手動編輯的檔案）
data/glossary.json              ← scripts/import-glossary.mjs 生成
data/vocabulary/*.json          ← scripts/build-vocabulary.mjs 生成
data/glossary-pending.json      ← 未裁決項，部分自動提報
data/id-ledger.json             ← stable id 的追加式帳本，用於偵測 id 被改指
scripts/lib/glossary-lib.mjs    純函式（CSV 解析、別名拆分、異常偵測）
scripts/validate-terms.mjs      硬性驗證，失敗 exit 1
```

**裁決只改 `data/decisions.json`，再重跑腳本。** 不直接編輯生成物，避免雙寫。

```bash
node --test "scripts/**/*.test.mjs" && node scripts/build-vocabulary.mjs && node scripts/import-glossary.mjs && node scripts/validate-terms.mjs
```

**條目數與各狀態筆數見 `NEXT-SESSION.md` 的「目前基線」**，本檔不重複統計。

> **`needs-review` 佔多數是刻意的。** 舊 CSV 的譯名不因存在就具權威（§附錄 A）。M0 的精確術語依賴清單產出後，將該批一次提交裁決，而非預先全數批准。

#### `idStatus` 與 `status` 是兩個維度

| 欄位 | 表示 | 取值 |
|---|---|---|
| `status` | **譯名**是否批准 | `approved` / `needs-review` / `deprecated` |
| `idStatus` | **id** 能否被引用 | `stable` / `provisional` |

**兩者無直接關係。** 一個詞可以 id 已 stable 但譯名仍 needs-review（絕大多數條目正是如此）。

`provisional` 用於 sense 尚未釐清、暫以 `.s1`／`.s2` 序號區分的條目：

- **不得進 release manifest**（CI 硬性失敗）
- **不得被正式 `entityRef` 引用**
- 裁決後改為具語意的穩定 id，例如 `term.fire.damage-type`、`term.fire.elementalist-mastery`
- 一旦 `stable` 且開始被引用，**id 永久不變**（由 `data/id-ledger.json` 把關）

### 9.3 硬性失敗 vs 只警告

**失敗（CI exit 1）：** id 重複；stable id 被重新指派給不同詞義；`approved` 缺 `zhHant`／`decidedAt`／`decidedBy`；`provisional` 進入 release manifest；同英文不同譯名被靜默丟棄或未提報；vocabulary 與 glossary 同時保存同一受控值的權威譯名；`deprecated` 缺理由；`needs-review` 帶有裁決欄位。

**只警告：** 語言欄位可疑（中文落在 `aliasesEn` 等）、別名與正式名相同、舊資料異常。**匯入器不自行修正這些**——搬移欄位屬於裁決。

### 9.4 已記錄的後續工作

| 項目 | 狀態 |
|---|---|
| 附錄 A 改由 JSON 生成（目前手動維護，會漂移） | ⏳ 未做，不阻擋詞彙基線 |
| 規則散文引用狀態名稱的一致性檢查 | ⏳ 待正典抽取後建立 |

> 一致性檢查的範圍限定：**比對規則文字中出現的狀態名稱與對應實體的 approved 中文名，不一致則產生報告。** 本階段不引入 AST、富文字 token 或引用系統。
>
> ⚠️ `entityRef` 只讓實體名稱單一化，**不會自動消除全站漂移**——規則散文仍可能直接寫入「緩速」等字樣，需靠上述檢查攔截。

---

## 10. 歸一 vs 標註的界線

| 層級 | 範例 | 處理 |
|---|---|---|
| **排版級 → 自動歸一** | `× 2` → `×2`；半形全形空格；數字格式；階層符號改門檻 | 依 §6 自動修正，不逐筆問 |
| **用詞級 → 標註待裁** | 驅邪教團／驅邪；同一概念兩種譯法 | 進報告，由專案擁有者裁決 |

判準：**改動是否可能抹掉刻意做的區別。** 空白與標點不會；用詞會。

---

## 附錄 A：術語裁決紀錄

**`approved` 是裁決的結果，不是裁決的理由。**

`sources/glossary_old.csv` 的譯名匯入後一律為 `needs-review`，**不因舊 CSV 有值就自動具權威**。裁決流程：

```
舊 CSV 值（needs-review）  +  舊譯實際使用統計
        ↓  一併提交專案擁有者
      裁決
        ↓
    status: approved   ← 此後才是權威，舊譯與之衝突時一律改舊譯
```

⚠️ 因此裁決紀錄**不得**寫成「因 approved 術語表是權威，所以原術語表值勝出」——那是循環論證。應記錄實際發生的事：專案擁有者檢視了哪些證據、批准了什麼。

> ⚠️ **本節為 `data/glossary.json` 與 `data/vocabulary/*.json` 的可讀檢視。**
> 目前手動維護；待生成器完成後改為自動產出，屆時本節不可手改。
> 權威狀態一律以 JSON 為準。

| 日期 | 英文 | 歸屬 | approved 譯名 | 舊譯別名 | 裁決依據 |
|---|---|---|---|---|---|
| 2026-07-28 | Triggered Action | vocab `action-type` | **反應動作** | 觸發式動作 | 擁有者檢視舊 CSV 值與舊譯 135:0 使用統計後批准 |
| 2026-07-28 | Free Triggered Action | vocab `action-type` | **免費反應動作** | 免費觸發式動作 | 隨上條連動 |
| 2026-07-28 | Maneuver | vocab `action-type` | **機動動作** | — | 舊 CSV 與舊譯 202 檔一致，擁有者確認 |
| 2026-07-28 | Magic | vocab `ability-keyword` | **魔法** | — | 舊 CSV 無此條，擁有者採舊譯 |
| 2026-07-28 | Weapon | vocab `ability-keyword` | **武器** | — | 舊 CSV 無此條，擁有者採舊譯 |
| 2026-07-28 | Self | vocab `target-component` | **自身** | — | 舊 CSV 無此條，擁有者採舊譯 |
| 2026-07-28 | Average（效力） | vocab `potency-level` | **中** | 平均 | 舊 CSV 與舊譯一致（「平均」僅 2 檔） |
| 2026-07-28 | Effect | glossary `rules-effect` | **效果** | — | 舊 CSV 無此條，擁有者採舊譯 |
| 2026-07-28 | Save Ends | glossary | **豁免解除** | — | 舊 CSV 值，擁有者確認為規則術語 |
| 2026-07-28 | EoT / EoE | glossary | **保留英文縮寫** | — | 擁有者裁決：便於玩家閱讀；原文寫全文時亦採縮寫 |

**未晉升 `approved` 的詞不得作為 CI 規則，也不得用於自動改寫舊譯。**

---

## 附錄 B：待決術語

| 英文 | 歸屬 | 出現於 | 狀態 |
|---|---|---|---|
| Order | glossary | 懲戒者教團 | ⏳ 未裁決 |

> Magic／Self／Effect 已於 2026-07-28 裁決（附錄 A），自本表移出。

# 對齊報告 — 審判 Judgment

> 依 `docs/translation-guide.md` 產出。日期 2026-07-28。
> **狀態：已裁決完畢（2026-07-28）。** 這是報告格式的**壓力測試**——「瀆神者退散！」四種複雜情形一個都沒碰到，本招式碰到三種。

抽取法：`pdftotext -layout` 為主，**150dpi 全頁算繪驗結構**（不再用 300dpi），舊 Notion MD／CSV 交叉驗證。

---

## 統計摘要

**抽取狀態：`verified`** —— 三來源逐欄比對 14 欄全數相符。

| 翻譯對齊 | 筆數 |
|---|---|
| `exact` | 12 |
| `acceptable` | 2（`cost` 的 `0`→`null` 正規化；範型特性引言的 flavor 改寫，見 PN-1） |
| `mismatch` / `missing` / `extra` | 0 |

| 問題 | 筆數 | 阻擋批准 |
|---|---|---|
| `unresolved-term` | ~~6~~ → **0**（全部已裁決） | — |
| `prose-issue` ⚪ low | 1 → **已裁決（維持舊譯）** | ❌ |
| `schema-question` | ~~2~~ → **0** | — |
| **規劃勘誤** | 1 | — |

**條目狀態：** `canonReviewStatus: draft`

```
id        ability.censor.judgment
來源      heroes-v1.01-04-censor  pdfPage 3 / printedPage 80
正典檔    data/canon/abilities/ability.censor.judgment.json
hash      6ae447a7aaefc862daf6308c1aed781e09dd26985d1a0790564398ea15685d7f
          （scripts/verify-canon-hash.mjs 實跑通過）
證據      docs/alignment/evidence/censor-p3-150dpi.png（150dpi 全頁）
```

---

## 三來源逐欄比對

| 欄位 | 文字抽取 | 150dpi 圖像 | 舊譯 | 結果 |
|---|---|---|---|---|
| `name` | Judgment | 同左 | 審判 | ✅ |
| `flavor` | You utter a prayer that outlines your foe in holy energy. | 同左 | 你吟誦禱文，用神聖能量籠罩你的敵人。 | ✅ |
| `keywords` | Magic, Ranged | 同左 | 魔法、遠程 | ✅ |
| `actionType` | Maneuver | 同左 | 機動動作 | ✅ |
| `distance` | Ranged 10 | 同左 | 遠程 10 | ✅ |
| `target` | One enemy | 同左 | 1 個敵人 | ✅ |
| `powerRoll` | 無 | 無 | 無 | ✅ 三者皆無 |
| `effect` 段 1 | until the end of the encounter… | 同左 | 持續到遭遇結束… | ✅ |
| `effect` 段 2 | twice your Presence score | 同左 | 氣場 × 2 | ✅ |
| `effect` 段 3 | reduced to 0 Stamina | 同左 | 體力歸 0 | ✅ |
| `followUpActions` 引言 | spend 1 wrath… | 同左 | 花費 1 點怒火… | ✅ |
| 選項 1–4 | 4 項 | 4 項 | 4 項，逐項相符 | ✅ |
| 選項限制句 | only one … at a time | 同左 | 每次也只能選擇 1 項 | ✅ |
| 類別／等級 | 範型特性授予 | 同左 | 固有 / 1 級 | ✅ |

**14 欄逐欄相符，零不符。** `-layout` 文字抽取在這個長效果、含四個巢狀選項的招式上仍然完整正確。

---

## 🔧 規劃勘誤 · 「審判」的教團分支**不在招式裡**

規劃 §14.1.1(4) 寫：

> 「審判」的效果內建三個教團分支。`Judgment Order Benefit` 依 Exorcist／Oracle／Paragon 給出不同利益，**寫在招式本體內**。

**逐字核對後這是錯的。** `-layout` 的縮排欄位顯示得很清楚：

```
                  Judgment                          ← 範型特性標題（欄位 19）
                     Judgment                       ← 招式卡（欄位 22，內縮）
                     Effect: The target is judged…
                     ¥ When an adjacent creature…
                     You can choose only one…       ← 招式卡到此結束
                  Judgment Order Benefit            ← 回到欄位 19，是**平行的另一個特性**
                  ¥ Exorcist: You can teleport…
```

150dpi 圖像與**你自己的舊譯**都印證這點——舊譯把「審判教團益處」放在 `</aside>` 之外，用 `##` 標題，正是同一個判斷。

**影響**：`Judgment Order Benefit` 應建成獨立的範型特性條目（`feature.censor.judgment-order-benefit`），不是 `ability.censor.judgment` 的欄位。教團納入 M0 的理由（§14.1.2）不受影響，仍然成立。

---

## 需要裁決的項目

### 🚫 UR-1～3 · 三教團的名字都不在術語表

| 英文 | 舊譯 | 狀態 |
|---|---|---|
| `Exorcist` | 驅邪 | 不在 `glossary_old.csv` |
| `Oracle` | 神諭 | 不在 `glossary_old.csv` |
| `Paragon` | 典範 | 不在 `glossary_old.csv` |

**✅ 裁決**：三個皆沿用舊譯 —— `Exorcist`＝驅邪、`Oracle`＝神諭、`Paragon`＝典範。
擁有者已知悉「典範」與 Class 的「範型」字面相近，仍採此譯。

### 🚫 UR-4 · `Order`

**✅ 裁決**：`Order`＝教團（sense：`censor-subclass`）。NEXT-SESSION 的四項待裁至此剩三項（Fire／Hakaan／Memonek）。

### 🚫 UR-5 · `Encounter`

**✅ 裁決**：`Encounter`＝遭遇，沿用舊譯。

### 🚫 UR-6 · `Vertical Pull`

**✅ 裁決**：沿用舊譯「垂直拉動」，且**視為 Vertical＋Pull 的組合，不另立獨立條目**。

---

### ⚪ PN-1 · 範型特性引言 — 「精準」為原文所無

```
[acceptable · prose-issue:low]
  原文    You pick out the enemies most worthy of your wrath and place a
          divine judgment upon them…
  舊譯    你精準挑選出最值得承受你怒火的敵人，並對他施加神聖的審判…
  判斷    pick out 未含「精準」之意，屬語氣增添。此段是範型特性的引言散文，
          非規則文字，依 §7.2 定為 ⚪ low，不阻擋批准。
```

**✅ 裁決**：維持舊譯。

---

### ❓ SQ-1 · `abilityCategory` 需要**第三個值**

你在 #4 說招式分兩大類：`Signature Ability`＝招牌、`Heroic Ability`＝英雄招式。

但 M0 的範圍是 **招牌 4／英雄 8／固有 2**（NEXT-SESSION），而「審判」與「捨己為人」的舊 CSV 類別欄寫的是 **`固有`** —— 它們由範型特性授予,既不是招牌也不是英雄。

**✅ 裁決**：`inherent`＝固有。短標籤定為 **招牌／英雄／固有**，術語表的全稱「招牌招式／英雄招式」維持不動，兩者並存。

已建立受控值 `data/vocabulary/ability-categories.json`（3 值，全部 approved）。
刻意用 `Signature`／`Heroic`／`Inherent` 作為英文鍵，而非 `Signature Ability`，
以免與術語表既有的「招牌招式」互搶權威（系統禁止同一個英文在兩處都有正式譯名）。

### ✅ SQ-2 · 「四選一」已改存 `followUpActions`（2026-07-28 外部 review 後修訂）

**修訂原因**：放在 `extraCosts` 雖然存得下資料，但語意是錯的。
`extraCosts` 的意思是「用招式時額外付費換額外效果」（例如「捨己為人」的 `Spend 1 Wrath:`），
而「審判」的四選一是**招式效果持續期間**可用的後續動作群組。
兩者混存，網站將來會把它讀成使用招式的基本費用。

現存於 `followUpActions`，`extraCosts` 留空陣列。欄位定義見指南 §4.3.2。

<details>
<summary>修訂前的說明（保留供追溯）</summary>


規劃 §5.3 的形狀是 `extraCosts?: { resource, value, effect }[]`——一個扁平陣列。

但「審判」是**花 1 怒火,從四個選項中選一個**。照原形狀寫成四筆,會讀成「四個都能拿」,規則就錯了。

我暫時擴成：

```json
"extraCosts": [{
  "resource": "wrath", "value": 1, "choose": "one",
  "lead": "Additionally, you can spend 1 wrath to take one of the following free triggered actions:",
  "options": [ "…", "…", "…", "…" ],
  "constraint": "You can choose only one free triggered action option at a time, …"
}]
```

**已自行決定（實作細節，不需擁有者裁決）**：採用上述欄位。

理由用白話說：規則寫的是「花 1 怒火，從四個裡挑一個」。原本的存法只能一組一組存「花費→效果」，
照那樣寫成四組，網站讀出來會變成「四個都能用」，牌桌上就會用錯。
所以多存一個標記，記下「這四個是選項，只能挑一個」。

</details>

---

## 已套用的 schema 決定（你 #3 #5 已裁）

- **距離已拆成結構**（你 #5）。三種形狀都已涵蓋,並保留 `raw` 原文供稽核：

  | 原文 | 結構 |
  |---|---|
  | `Ranged 10` | `{ kind:"ranged", value:10, raw:"Ranged 10" }` |
  | `Melee 1` | `{ kind:"melee", value:1, raw:"Melee 1" }` |
  | `2 cube within 1` | `{ kind:"area", area:{shape:"cube",size:2,within:1}, raw:"2 cube within 1" }` |

  ⚠️ 此處原寫「只出現這三種形狀」——當時只掃 p.3／p.5。p.6 另有第四種 `choice`（`Melee 1 or ranged 5`）。

- **階層用 `≤11`／`12-16`／`17+` 並使用官方符號**（你 #3）。
  官方字型 `DrawSteelGlyphs-Regular.otf` 已在 `sources/drawsteelglyphs/`,字元對應由官方字符表確認：
  `á`→`≤11`、`é`→`12-16`、`í`→`17+`;距離圖示 `o`、目標圖示 `x`。

  > **✅ 已確認**：整張卡的符號都使用官方字型，取代舊譯的 🔍📐⏩🎯。

---

## 本報告未涵蓋的範圍

- 「審判」**沒有** Power Roll，效力記號未在本例出現。已另以「惡徒止步！」驗證完畢，見 [method-validation.md](method-validation.md)。
- `Judgment Order Benefit` 與範型特性引言兩段散文**未建成條目**,只在報告中標出。它們屬於 `class.censor` 的範圍,待範型條目抽取時處理。
- `Taunted`（嘲諷）是 9 個狀態之一,由實體負責,目前 `needs-review`,隨狀態一併處理。

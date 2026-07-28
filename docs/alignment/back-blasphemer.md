# 對齊報告 — 瀆神者退散！ Back Blasphemer!

> 依 `docs/translation-guide.md` 產出。日期 2026-07-28。
> **狀態：已裁決完畢（2026-07-28）。** 本檔同時是 M0 第 5 步的方法驗證樣本。
>
> 抽取法：**文字為主（`pdftotext -layout`）＋ 300dpi 算繪驗結構＋舊 CSV 交叉驗證**，三者逐欄比對。

---

## 統計摘要

**抽取狀態：`verified`** —— 三來源逐欄比對 14 欄全數相符。

| 翻譯對齊 | 筆數 |
|---|---|
| `exact` | 13 |
| `acceptable` | 1（`cost`：舊 CSV `0` → 正典 `null`，依 §4.3.1 正規化） |
| `mismatch` / `missing` / `extra` | 0 |

> 先前此處寫 `match: 10`、後文卻寫「14 欄逐欄相符」，數字不一致（外部 review 指出）。
> 原因是舊格式把「抽取是否正確」與「翻譯是否逐字相同」混成同一個數字。
> 現依 §8.1 修訂為三維度：**抽取 14 欄全對；翻譯 13 欄逐字相同、1 欄屬正規化**。

| 問題 | 筆數 | 阻擋批准 |
|---|---|---|
| `unresolved-term` | ~~2~~ → **0**（`Square`＝格、`Distance`＝射程，已裁決） | — |
| `prose-issue` ⚪ low | 1（flavor）→ **已裁決** | ❌ 不阻擋 |
| `schema-question` | ~~3~~ → **0**（SQ-1／2／3 已裁決） | — |

**阻擋批准的未裁決項：0**
**條目狀態：** `canonReviewStatus: draft` — 未達 `verified`，不得進入 `releases/m0.json`

---

## 條目資訊

```
id        ability.censor.back-blasphemer
type      ability
origin    { kind: 'class', id: 'class.censor' }
來源      heroes-v1.01-04-censor  pdfPage 5 / printedPage 82
正典檔    data/canon/abilities/ability.censor.back-blasphemer.json
正規化源  data/canon/_normalized/ability.censor.back-blasphemer.txt
hash      973b5666fc99441444156a7759532204d19197cd3fd4511b3487153556e3a6f7
          （以 node scripts/verify-canon-hash.mjs 實際比對通過，非僅寫入）
證據      docs/alignment/evidence/back-blasphemer-300dpi.png（300dpi 裁切）
          docs/alignment/evidence/censor-p5-150dpi.png（150dpi 全頁，驗版面結構）
```

---

## 三來源逐欄比對（方法驗證的核心）

三個獨立來源：**A** = `pdftotext -layout` 文字抽取；**B** = 300dpi 算繪圖像人工判讀；**C** = 舊 Notion CSV／MD。

| 欄位 | A 文字抽取 | B 300dpi 圖像 | C 舊資料 | 結果 |
|---|---|---|---|---|
| `name` | `Back Blasphemer!` | `Back Blasphemer!` | `Back Blasphemer!` | ✅ 三者相符 |
| `flavor` | `You channel power through your weapon to repel foes.` | 同左 | 你使用武器引導神聖力量來擊退敵人。 | ✅ 結構相符（用字見 PN-1） |
| `keywords` | `Area, Magic, Melee, Weapon` | 同左 | 區域、魔法、近戰、武器 | ✅ 四項同序 |
| `actionType` | `Main action` | 同左 | 主要動作 | ✅ |
| `distance` | `o 2 cube within 1` | 尺規圖示＋`2 cube within 1` | 1 格內 2 立方 | ✅ |
| `target` | `x Each enemy in the area` | 標靶圖示＋`Each enemy in the area` | 區域內每個敵人 | ✅ |
| `powerRoll.characteristic` | `Power Roll + Presence:` | 同左 | 檢定 + `氣場` | ✅ |
| tier 1 | `á 2 holy damage; push 1` | 徽章 `≤11`＋`2 holy damage; push 1` | 1️⃣ 2 神聖傷害 / 推動 1 | ✅ 數值全同 |
| tier 2 | `é 4 holy damage; push 2` | 徽章 `12-16`＋同左 | 2️⃣ 4 神聖傷害 / 推動 2 | ✅ |
| tier 3 | `í 6 holy damage; push 3` | 徽章 `17+`＋同左 | 3️⃣ 6 神聖傷害 / 推動 3 | ✅ |
| `effect` | 無 | 無（卡片止於 tier 3，下一區塊為 Every Step … Death!） | 無 | ✅ 三者皆無 |
| `cost` | 標題無括號 → `null` | 同左 | 費用 `0` | ✅ |
| 類別／等級 | 位於 `Signature Ability` 標題下 | 同左 | 招牌 / 1 級 | ✅ |

**結論：14 欄逐欄相符，無任何一欄不符。** 混合抽取法在本招式上成立，不需退回全算繪。

### 但方法必須加一條硬性限制

**`pdftotext` 不加 `-layout` 會靜默毀掉這張卡。** 實測輸出（`04-censor.pdf` p.5，無 `-layout`）：

```
Back Blasphemer!
You channel power through your weapon to repel foes.
Area, Magic, Melee, Weapon
Main action
o 2 cube within 1
x Each enemy in the area

á
é
í                    ← 三個階層徽章被抽離，與數值失聯

Main action          ← 別張卡的欄位插進來
x One creature
...
Power Roll + Presence:
2 holy damage; push 1   ← 數值漂到 40 行外，且未標明屬於哪張卡
```

三個階層符號與其數值被拆開、跨卡片內容互相插入。若照 NEXT-SESSION §「具體做法」直接用 `pdftotext` 而未指定 `-layout`，這張卡會被抽成錯的。

`-layout` 保留雙欄幾何，同一張卡的所有欄位維持在一起且順序正確。

> ⚠️ 這也修正了 NEXT-SESSION 的一句過度樂觀的敘述：「單一招式區塊內的完整性 ✅ 逐字正確」。
> 正確說法是：**加 `-layout` 才逐字正確**。先前以「惡徒止步！」（右欄）測試恰好未觸發此失效模式。

**建議寫入指南**：抽取指令固定為
```bash
pdftotext -f <page> -l <page> -layout <pdf> <out>
```
且每個招式仍須與舊 CSV 交叉驗證、與**150dpi** 全頁圖像抽驗（擁有者已定 150dpi 為預設，300dpi 僅用於 🔴 high 疑點裁切）。

---

## match 且無問題（收合）

| 欄位 | 舊譯 | 原文 |
|---|---|---|
| `name` | 瀆神者退散！ | Back Blasphemer! |
| `keywords` | 區域、魔法、近戰、武器 | Area, Magic, Melee, Weapon |
| `actionType` | 主要動作 | Main action |
| `distance` | 1 格內 2 立方 | 2 cube within 1 |
| `target` | 區域內每個敵人 | Each enemy in the area |
| `powerRoll` | 檢定 + \`氣場\` | Power Roll + Presence |
| tier 1–3 | 2／4／6 神聖傷害；推動 1／2／3 | 2/4/6 holy damage; push 1/2/3 |

> `distance` 的中英語序相反（英「2 cube within 1」／中「1 格內 2 立方」），這是中文語序的必要調整，非語意改動。
> 舊譯用語全部命中已批准術語：區域、魔法、近戰、武器、主要動作、檢定、氣場、神聖、傷害、推動、立方、敵人（已逐條查表確認，見下）。

---

## 需要裁決的項目

### 🚫 UR-1 · `Square` 未裁決，卻是每張招式卡都要用的詞

```
[unresolved-term] Square
  舊 CSV    方格/格          ← 一欄內塞了兩個候選，用斜線分隔
  glossary  term.square      status: needs-review
  用到之處  distance「1 格內 2 立方」的「格」；全部 14 個招式都會用到
  判斷      uncertain —— 舊 CSV 未給單一譯名，AI 不得代選
```

**✅ 裁決**：正式譯名「格」，「方格」保留為搜尋別名。
附帶說明（擁有者原話）：「實際上需要看上下文，無法統一概括」——招式卡距離欄一律用「格」，其他語境出現時仍須個別確認。

---

### 🚫 UR-2 · `Distance` 同樣情形

```
[unresolved-term] Distance
  舊 CSV    射程/距離
  glossary  term.distance    status: needs-review
  用到之處  招式卡的距離欄位標籤本身
```

**✅ 裁決**：招式的 Distance 欄譯「射程」；其他語境須看上下文，故「距離」保留為搜尋別名。

> **這兩條暴露了術語清單分段邏輯的一個漏洞。**
> `docs/term-review-queue.md` 依「該中文譯名在舊語料出現幾個檔案」排序。
> `方格/格` 這個字串**從未原樣出現在語料中**（語料寫的是「格」），所以計數 0，
> 被丟到「建議暫不處理」的 C 段（`Square` #578、`Distance` #521）。
> 實際上兩者都是 M0 每張卡必用。
> 同樣受影響的還有 `Natural 19 or 20`（天然 19/20，#558）。
> **A 段清單並不等於「M0 需要的全部術語」。**
> 三條均已補裁決：`Square`＝格、`Distance`＝射程、`Natural 19 or 20`＝天然 19/20。

---

### ⚪ PN-1 · `flavor` — 原文只說 “power”，舊譯寫「神聖力量」

```
[match · prose-issue:low] ability.censor.back-blasphemer / flavor
  原文    You channel power through your weapon to repel foes.
  舊譯    你使用武器引導神聖力量來擊退敵人。
  判斷    原文的 power 未限定屬性；舊譯補上「神聖」。
          「神聖」在本系統是傷害類型（Holy，已批准），
          在 flavor 中出現可能被讀成規則資訊。
          惟本招式三個階層確實都造成 holy damage，補字與規則不衝突。
          依指南 §7.2「flavor 允許適度改寫」定為 ⚪ low，不阻擋批准。
  證據    docs/alignment/evidence/back-blasphemer-300dpi.png
```

**✅ 裁決（2026-07-28）**：維持舊譯。

---

### ❓ SQ-1 · 階層呈現：舊譯用 1️⃣2️⃣3️⃣，正典存門檻徽章

規劃 §14.1.1(1) 已裁定改用官方門檻 `≤11`／`12-16`／`17+`。正典檔已照此存。
但**全部舊譯的招式表格都是 1️⃣2️⃣3️⃣**，14 個招式都會遇到。

**✅ 裁決**：使用 `≤11`／`12-16`／`17+`，並使用官方符號（`DrawSteelGlyphs-Regular.otf`）。

---

### ❓ SQ-2 · 正典 schema 缺「招牌／英雄」與「等級」欄位

規劃 §5.3 的 `Ability` 介面沒有這兩個欄位，但：
- 舊 CSV 有「類別＝招牌」「等級＝1 級」
- §14.1.3(8) 的配額（招牌 4 選 1、3 費 4 選 1、5 費 4 選 1）需要它才能表達

我在正典檔中暫加了 `abilityCategory: "signature"` 與 `level: 1`。

**✅ 裁決（部分）**：欄位保留。但招式分類需要**第三個值** `inherent`（固有）——「審判」「捨己為人」兩者皆是。
細節與未定的中文標籤見 [judgment.md](judgment.md) 的 SQ-1。

---

### ❓ SQ-3 · `distance` 目前存原始字串

規劃 §5.3 寫 `distance: DistanceSpec`，但註解舉的例子是三個字串
（`'Melee 1'`／`'Ranged 10'`／`'2 cube within 1'`）——型別名像結構、範例像字串。

我暫時存原始字串 `"2 cube within 1"`，未拆成 `{ shape, size, within }`。

**✅ 裁決**：拆成結構。本條目已改為：

```json
"distance": { "kind": "area", "area": { "shape": "cube", "size": 2, "within": 1 }, "raw": "2 cube within 1" }
```

保留 `raw` 供稽核。

> 🔧 **此處原寫「14 個招式只出現三種形狀」，是以偏概全，已更正。**
> 當時只掃了 p.3／p.5。抽完 p.6 後出現第四種：`Melee 1 or ranged 5`（二選一），
> 見 [censor-level1-results.md](censor-level1-results.md)。

---

## 定稿譯文（草稿，待上列裁決後定案）

```markdown
### 瀆神者退散！　Back Blasphemer!

> *你使用武器引導神聖力量來擊退敵人。*

區域、魔法、近戰、武器　　　　　　　　　　　　主要動作
1 格內 2 立方　　　　　　　　　　　　區域內每個敵人

**檢定** + `氣場`：

| ≤11 | 2 神聖傷害；推動 1 |
| 12-16 | 4 神聖傷害；推動 2 |
| 17+ | 6 神聖傷害；推動 3 |
```

相對舊譯的變更：僅階層首欄 1️⃣2️⃣3️⃣ → 官方門檻徽章。**文字零變更。**

---

## 本報告未涵蓋的範圍（誠實聲明）

- 只驗證了 1 個招式。**不能由此推論其餘 13 個招式的文字抽取都正確**——每一個仍須逐個交叉驗證。
- 300dpi 圖像的判讀是 AI 單方判讀，未經第二人核對。舊 CSV 交叉驗證是第二個獨立來源，但舊 CSV 本身可能對到舊版本規則。
- 本招式恰好**沒有** `Effect:` 段、沒有第二段花費、沒有效力記號、沒有教團分支。
  規劃 §14.1.1 指出的 (2) 效力、(3) 第二段花費、(4) 教團分支三種複雜情形**本樣本一個都沒測到**。
  「惡徒止步！」有效力、「捨己為人」有第二段花費、「審判」有教團分支——這三個是真正的壓力測試。
- `printedPage 82` 取自 150dpi 全頁圖像左下角頁碼，未與書本目錄交叉驗證。

# 對齊報告樣張 — 捨己為人 My Life for Yours

> 依 `docs/translation-guide.md` 產出。日期 2026-07-28。
> **狀態：已裁決完畢。** 本檔同時作為報告格式的參考範例。
>
> 正典以 poppler 300dpi 算繪圖像逐字核對，非文字抽取。

---

## 統計摘要

**已自動套用：** 反應動作 1 筆

| 對齊狀態 | 筆數 |
|---|---|
| `match` | 8 |
| `mismatch` / `missing` / `extra` | 0 |

| 問題 | 筆數 | 阻擋批准 |
|---|---|---|
| `unresolved-term` | ~~3~~ → **0**（已裁決） | — |
| `prose-issue` 🔴 high | 1 → **已裁決** | — |
| `prose-issue` 🟡 medium | 2 → **已裁決** | — |
| `prose-issue` ⚪ low | 1（維持舊譯） | ❌ 不阻擋 |
| `term-applied` | 1 | ❌ |

**阻擋批准的未裁決項：0**
**條目狀態：** `canonReviewStatus: verified` / `TranslationMeta.status: approved` ✅ 可進入 `releases/m0.json`

---

## 條目資訊

```
id        ability.censor.my-life-for-yours
type      ability
origin    { kind: 'class', id: 'class.censor' }
來源      heroes-v1.01-04-censor  pdfPage 3 / printedPage 80
```

---

## match 且無問題（收合）

| 欄位 | 舊譯 | 原文 |
|---|---|---|
| `name` | 捨己為人 | My Life for Yours |
| `keywords` | 魔法、遠程 | Magic, Ranged |
| `distance` | 遠程 10 | Ranged 10 |
| `target` | 自身或 1 個盟友 | Self or one ally |
| `trigger` | 當目標開始回合或受到傷害時。 | The target starts their turn or takes damage. |
| `effect` | 你花費 1 點\`復元力\`，並讓目標恢復等於你\`復元值\`的\`體力\`。 | You spend a Recovery and the target regains Stamina equal to your recovery value. |

> `trigger` 的「當…時」為中文條件句的必要語法框架，非增添語意，舊譯全書一致採此形式。
> `target` 可由組合規則產生：Self→自身、or→或、one→1 個、ally→盟友。

---

## 需要裁決的項目（已完成）

### 🔴 PN-2 · `extraCosts[0].effect` — 限定語「on the target」未譯出

```
[match · prose-issue:high] ability.censor.my-life-for-yours / extraCosts[0].effect
  舊譯    你可以解除 1 個能夠透過豁免解除或 EoT 的狀態或效果，
          或是讓伏地的目標起身。
  原文    Spend 1 Wrath: You can end one effect on the target that is ended by
          a saving throw or that ends at the end of their turn, or a prone
          target can stand up.
  判斷    原文限定效果須在「目標身上」，舊譯無此限定。此招式目標為
          「自身或 1 個盟友」，未限定時可讀成能解除任何符合條件的效果，
          擴大了適用範圍（printedPage 80，Spend 1 Wrath 段第 1 行）
  證據    docs/samples/evidence/mlfy-spend1wrath-03.png（300dpi 裁切）
  來源    heroes-v1.01-04-censor  pdfPage 3 / printedPage 80
```

**✅ 裁決（另訂）**：補入「目標身上」，並依 PN-3 刪除「狀態或」

```
你可以解除目標身上 1 個能夠透過豁免解除或 EoT 的效果，或是讓伏地的目標起身。
```

> ⚠️ **合併說明**：PN-2 的另訂文字含「狀態或效果」，PN-3 裁定刪除「狀態或」，兩者同時套用得上式。另原裁決僅涵蓋第一子句（因建議欄只引前半），後段「或是讓伏地的目標起身」原文未變動，一併接回。
> **若原意為保留「狀態或」，請告知。**

---

### 🟡 PN-3 · `extraCosts[0].effect` — 「狀態或效果」較原文多出「狀態」

```
  原文    one effect
  舊譯    1 個…的狀態或效果
  判斷    原文僅寫 effect。Draw Steel 中狀態本身即是一種效果，舊譯可能是
          有意釐清，但屬詮釋而非翻譯，違反 §7.1(2)
```

**✅ 裁決**：刪除「狀態或」

---

### 🟡 PN-4 · `extraCosts[0].effect` — 原文寫全文，舊譯用縮寫 EoT

```
  原文    that ends at the end of their turn
  舊譯    EoT
  判斷    EoT/EoE 保留英文縮寫已於 2026-07-28 裁決，但該裁決處理的是
          「原文出現縮寫時不譯」；此處原文寫全文，是舊譯自行縮寫
```

**✅ 裁決**：維持 EoT。**理由：讓玩家更方便閱讀。**

> 通則：`end of their turn` 等時機描述，中文一律採 EoT／EoE 縮寫，不論原文寫全文或縮寫。

---

### ⚪ PN-1 · `flavor` — “some of” 未譯出、另增「體內」

```
  原文    You channel some of your vitality into more resilience for you or an ally.
  舊譯    你將生命能量注入自己或盟友體內來增強韌性。
  判斷    程度限定 some of 未譯出；另增「體內」，原文無
```

**✅ 裁決**：維持舊譯。

> **這項裁決確立了一條專案通則**：flavor 敘述允許適度改寫以求通順與風格，不採逐字直譯。已寫入指南 §7.2，並定為 ⚪ low **不阻擋批准**。

---

### 未決術語（已裁決，三項皆以舊譯為定稿）

| 代號 | 英文 | 歸屬 | 定稿 |
|---|---|---|---|
| UR-1 | Magic（關鍵詞） | vocabulary `ability-keyword` | **魔法** |
| UR-2 | Self（目標） | vocabulary `target-component` | **自身** |
| UR-3 | Effect（規則名詞） | glossary `sense: rules-effect` | **效果** |

> 另確認 **Save Ends ＝ 豁免解除** 為規則術語（原建議誤用「豁免」，已更正）。

---

## 定稿譯文

```markdown
### 捨己為人　My Life for Yours

> *你將生命能量注入自己或盟友體內來增強韌性。*

魔法、遠程　　　　　　　　　　　　　　　　　　反應動作
遠程 10　　　　　　　　　　　　　　　自身或 1 個盟友

**觸發**：當目標開始回合或受到傷害時。

**效果**：你花費 1 點`復元力`，並讓目標恢復等於你`復元值`的`體力`。

**花費 1 怒火**：你可以解除目標身上 1 個能夠透過豁免解除或 EoT 的效果，
或是讓伏地的目標起身。
```

變更三處：`觸發式動作` → `反應動作`（術語裁決）；補入「目標身上」；刪除「狀態或」。

---

## 本樣張促成的指南修訂

| 問題 | 修訂 |
|---|---|
| `match` 與 `unresolved` 非互斥，卻混在同一套標記 | §8.1 改為兩個維度：對齊狀態 × 問題 |
| `prose-note` 無分級，flavor 小差異與規則性遺漏同等對待 | §8.2 加 🔴/🟡/⚪ 三級，並明訂 high/medium 阻擋批准、low 不阻擋 |
| 報告缺可直接採用的替代文字 | §8.3 加「建議」欄；🔴 high 加「證據」欄（附裁切圖路徑，不嵌圖） |
| 14 個招式的報告會過長 | §8.4 批次格式：match 收表格、`term-applied` 收頂端摘要、只展開需裁決項 |
| 所有缺詞都被塞進 glossary | §9.1 pending 項目加 `kind`，區分 vocabulary 與 glossary，並加 `sense` 處理一詞多義 |
| flavor 的處理標準未定義 | §7.2 明訂 flavor 允許改寫，並與規則文字的四項禁令分開 |
| 我把確定處說成模糊（見下） | §7.1(4) 補上「也不得把確定處說成模糊」 |

### 一項自我更正

規劃 §14.4 的 `translation-issues.json` 範例原寫：

> 原文 `or that ends at the end of their turn` 的修飾範圍有兩種讀法

**逐字核對後此歧義不存在。** 兩個 `that` 子句都明確修飾 `one effect`，舊譯的理解正確。該範例是未核對原文時的推測，已從指南移除。

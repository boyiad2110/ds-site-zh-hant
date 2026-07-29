# 提案：【當場拘捕】的追加段落應改為條件式後續效果

> 2026-07-29。因第三批對齊的 PR-B3-1 而起。
> **狀態：已採用並實作。** 擁有者於 2026-07-29 後續接手計畫中批准本提案，採最小 `conditionalEffects` 結構。
> 這是**正典資料建模的阻擋項**——結構定案前不產出【當場拘捕】的中文檔，
> 也不動任何 `normalizedHash`。

---

## 1. 現況

`data/canon/abilities/ability.censor.arrest.json` 目前這樣存：

```json
"extraCosts": [
  {
    "resource": "wrath",
    "value": 3,
    "effect": "If the target makes a strike against a creature while grabbed this way, you can spend 3 wrath to deal holy damage to them equal to your Presence score, then change the target of the strike to another target within the strike’s distance.",
    "raw": "Effect: If the target makes a strike against a creature while grabbed this way, you can spend 3 wrath to …"
  }
]
```

對照組——`ability.censor.my-life-for-yours.json`：

```json
"extraCosts": [
  {
    "resource": "wrath",
    "value": 1,
    "effect": "You can end one effect on the target that is ended by a saving throw or …",
    "raw": "Spend 1 Wrath: You can end one effect on the target that is …"
  }
]
```

**兩者在資料上長得一樣，在規則上完全不同。**

---

## 2. 為什麼這是錯的（不只是標籤問題）

原文的實際時序是四段：

1. 【當場拘捕】命中，目標被**擒制**；
2. **之後某個時點**，目標對某個生物發動打擊；
3. **此時**你才可以選擇支付 3 點`怒火`；
4. 支付後：對目標造成等於`氣場`的神聖傷害，並把該次打擊改指向打擊射程內的另一個合法目標。

而 `extraCosts` 這個欄位名在本專案既有的用法是「**發動這個招式時**可以額外付的費用」
（捨己為人就是這樣：你用招式的當下決定要不要多付 1 點`怒火`）。

所以目前的建模至少有三個問題：

| # | 問題 | 後果 |
|---|---|---|
| 1 | **時序錯誤** | 系統／renderer 會把 3 怒火理解成發動招式時付。實際上是命中後、目標動作時才有機會付 |
| 2 | **觸發條件消失** | 「目標在被擒制期間對生物發動打擊」是硬性前提，目前只存在散文字串裡，機器讀不到 |
| 3 | **可選性不明** | `extraCosts` 讀起來像招式的一部分；實際上這是一個**可以不用**的選項 |

> 第 1 點是會實際害到牌桌的：讀成「先付 3 怒火」的玩家，會在還沒滿足條件時就把資源花掉。

**因此「加一個 `label: "effect"` 欄」不足以解決。** 標籤只修呈現，
資料本身的時序語意仍然是錯的。第三批報告原先把這項列為 `presentation`（不阻擋批准），
**這個歸類經擁有者裁定為過輕，已升為正典資料建模阻擋項。**

---

## 3. 提案的結構

> **2026-07-29 修訂**：依擁有者 review 縮小範圍——
> `condition` 改名為 `trigger`、移除 `availability`、移除 `sourceLabel`。三項理由見 §3.1。

```json
"conditionalEffects": [
  {
    "trigger": "The target makes a strike against a creature while grabbed this way.",
    "optional": true,
    "cost": { "resource": "wrath", "value": 3 },
    "effect": "You deal holy damage to them equal to your Presence score, then change the target of the strike to another target within the strike’s distance.",
    "raw": "Effect: If the target makes a strike against a creature while grabbed this way, you can spend 3 wrath to deal holy damage to them equal to your Presence score, then change the target of the strike to another target within the strike’s distance."
  }
]
```

| 欄位 | 承載的規則事實 | 對應原文 |
|---|---|---|
| `trigger` | **觸發事件**（散文，見下方警告） | If the target makes a strike … while grabbed this way |
| `optional` | 可以不用 | you **can** spend |
| `cost` | 可選支付的代價 | 3 wrath |
| `effect` | 支付後發生的事（兩段：傷害 ＋ 改目標） | deal holy damage … then change the target … |
| `raw` | 逐字原文，供 hash 與稽核 | 整段 |

### 3.1 三項縮小的理由

| 縮小 | 理由 |
|---|---|
| `condition` → **`trigger`** | 這描述的是**之後發生的事件**，不是狀態條件。招式已有 `trigger` 概念（捨己為人的反應動作），用同一個名字保持一致 |
| 移除 `availability: "while-effect-active"` | 「while grabbed this way」已經在 `trigger` 裡了，重複。而且目前**沒有可引用的父 effect id**，這個值指不到任何東西 |
| 移除 `sourceLabel` | `conditionalEffects` 這個**型別本身**就足以讓 renderer 顯示「效果」；原文的 `Effect:` 仍完整保留在 `raw`。<br>另外**先前的說法不成立**：說它能一併解決捨己為人的 `Spend` 標籤——但本提案並沒有在 `extraCosts` 加這個欄位，實際上解決不了。日後真的出現「同一型別需要不同來源標籤」時再統一擴充，不預先加欄位 |

### ⚠️ `trigger` 仍然是不可解析的散文

**這個結構讓程式知道「這裡有一個觸發段」，不代表機器看得懂它。**

`The target makes a strike against a creature while grabbed this way.` 是一個英文句子。
程式無法從中理解「擒制期間」「發動打擊」是什麼規則事件，也**無法自動判斷條件是否成立**。

本提案解決的是**第 2 節列的三個問題**——時序被誤讀成「發動時付費」、觸發條件沒有自己的欄位、
可選性不明。它**沒有**解決「規則語意機器可執行」，那是另一個層級的工作，不在本提案範圍。

### 中文層對應

```json
"conditionalEffects": [
  { "trigger": "…", "effect": "…" }
]
```

只存需要翻譯的兩個字串；`cost`／`optional` 是受控資料，不進中文層。

---

## 4. 這個改動會波及什麼（誠實列出）

| 影響 | 說明 |
|---|---|
| **`normalizedHash` 會變** | `data/canon/_normalized/ability.censor.arrest.txt` 的內容取決於欄位寫法。改結構就要重算這一個 hash，並在 `source.checkedAt` 註記 |
| **schema 新增一個 type** | `conditionalEffects` 是第三種「招式後續東西」（已有 `extraCosts`、`followUpActions`）。三個並存需要在指南 §4.3 寫清楚各自的判準，否則下一輪會亂放 |
| **m0-scan 的通道 A** | `conditionalEffects[].cost.resource` 必須加進結構欄位掃描清單，否則 `wrath` 這個依賴會從 manifest 消失（這正是 2026-07-29 外部 review 抓到「只掃 4 個欄位」的同類問題） |
| **驗證** | `verify-zh-structure.mjs` 要比照本輪新增的三組檢查，加上 `conditionalEffects` 的數量與非空檢查＋持久化測試 |
| **只有 1 個條目受影響** | 目前 M0 的 16 個招式裡只有【當場拘捕】屬這一型。捨己為人維持 `extraCosts` 不動 |

---

## 5. 替代方案（供比較，不建議）

| 方案 | 做法 | 為什麼不建議 |
|---|---|---|
| A | 只加 `label` 欄 | 只修呈現，時序語意仍錯。**擁有者已裁定不足** |
| B | 塞進 `followUpActions` | 那個欄位目前承載的是「持續期間可做的四選一動作」（審判），語意是「動作」不是「條件式效果」。硬塞會讓 renderer 兩種都要猜 |
| C | 維持現狀、在中文層用文字講清楚 | 把規則事實藏進譯文，機器仍讀不到；且違反「同一份資訊不存兩處」 |

---

## 6. 要裁決的兩件事

> 原本的第 2 問（`sourceLabel` 要不要保留）已於 2026-07-29 由擁有者裁定**不加**，見 §3.1。

1. **採不採用 §3 修訂後的 `conditionalEffects` 結構？**（欄位為
   `trigger`／`optional`／`cost`／`effect`／`raw`，不含 `availability` 與 `sourceLabel`）
2. **要不要現在做？** 現在做會動到 1 個正典檔與 1 個 hash；
   往後拖則第三批的【當場拘捕】中文檔一直不能產出（其餘 9 條不受影響）。

裁決前不動任何正典檔案。

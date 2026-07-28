# M0 第二批抽取結果 — 基礎打擊、教團、怒火

> 2026-07-29。承接 `censor-level1-results.md`（招式）與 `conditions.md`（狀態）。
> 本批新增 **5 個正典條目**，正典總數由 23 → 28。**M0 的英文正典抽取至此全部完成。**

**方法**：`pdftotext -layout` 逐字抽取 ＋ 150dpi 圖像驗版面 ＋ 舊 Notion 語料交叉驗證
（與前兩批相同，見 `method-validation.md`）

---

## 結果

| # | id | 英文 | 類型 | 來源 | 印刷頁 | 抽取 |
|---|---|---|---|---|---|---|
| 1 | `ability.basic.melee-weapon-free-strike` | Melee Weapon Free Strike | ability | `00-the-basic…` p.32 | 17 | ✅ verified |
| 2 | `ability.basic.ranged-weapon-free-strike` | Ranged Weapon Free Strike | ability | `00-the-basic…` p.32 | 17 | ✅ verified |
| 3 | `feature.censor.censor-order` | Censor Order | **feature 🆕** | `04-censor.pdf` p.2 | 79 | ✅ verified |
| 4 | `feature.censor.wrath` | Wrath | **feature 🆕** | `04-censor.pdf` p.2 | 79 | ✅ verified |
| 5 | `feature.censor.judgment-order-benefit` | Judgment Order Benefit | **feature 🆕** | `04-censor.pdf` p.3 | 80 | ✅ verified |

### 內容指紋

```
✅ 28 個正典條目的 normalizedHash 全部相符
```

以 `node scripts/verify-canon-hash.mjs` 實際執行。

### 版面驗證（實際算繪的頁面）

| 頁面 | 用途 | 結果 |
|---|---|---|
| `00-the-basic…` p.32 全頁 150dpi | 基礎打擊卡片 | 與文字抽取逐字相符 |
| `04-censor.pdf` p.2 全頁 150dpi | 新資料類型（散文特性）驗版面 | 與文字抽取逐字相符 |
| `04-censor.pdf` p.3 裁切 150dpi | 審判教團利益的項目符號與粗體 | 相符（¥ 項目符號＋粗體教團名） |

---

## 遇到的新結構（已於指南 §4.7 登錄）

1. **檢定屬性二選一** `Power Roll + Might or Agility` — 基礎打擊 ×2
2. **不屬任何範型的招式** — 新增 `origin.kind:"core"`、`abilityCategory:"basic"`、`level:null`
3. **新資料類型 `feature`** — 散文式職業特性，用「章節 → 區塊」結構，招式 schema 完全裝不下

第 3 點是本輪最大的結構變動。做法依驗證邊界一：**用代表樣本（教團＋怒火）確認即可**，
未擴張到其他八個範型的特性。

---

## 算繪 `04-censor.pdf` p.2（印刷頁 79）確認的四項範型建模事實

這些是**規則事實**，不是範圍決策。算繪整頁時一併看到，記錄於此供日後範型建模參考。
（原本只存在於 repository 外部的規劃檔，2026-07-29 依職責分流移入本檔。）

**(1) 官方原文直接使用 “subclass” 一詞。**
原文：`Your censor order is your subclass, and your choice of order determines many of the
features you'll gain as you gain new levels.` —— `Subclass` 的命名與建模方向獲正典確認。

**(2) 懲戒者在一級有兩條平行選擇軸，不是一條。**

```
軸一  Censor Order（教團）    → 驅邪 / 神諭 / 典範，各授予一項技能
軸二  Deity → Domain（領域）  → 12 個領域，各對應一個一級領域特性（印刷頁 80 表）
```

**兩者不是同一種東西**——官方只把 Order 稱為 subclass，Domain 只是另一條選擇軸。
正確的抽象是「選擇群組 + 選項種類」，不是把 `Subclass` 擴大解釋。

⚠️ **領域不在 M0**（見 `docs/scope.md`），因此完整的 Subclass 建模驗證仍待補上領域軸；
M0 的驗證結果不可視為最終確認。

**(3) 效力是範型層級的定義，不是招式層級。** 印刷頁 79：

```
Weak Potency:    Presence − 2
Average Potency: Presence − 1
Strong Potency:  Presence
```

招式裡的 `P<WEAK` 只是引用。故 `TierResult.potency` 只存 `level`，
實際數值由**範型**的效力定義解析——範型資料需要 `potency: { weak, average, strong }` 一層。
（與指南 §4.3.0 互為表裡：**字母＝測誰的什麼屬性，範型定義＝門檻是多少。**）

**(4) 一級招式配額確認。** Censor Advancement 表：1 級為 `Signature, 3, 5`，
Order Abilities 欄為 `—`。即**招牌 4 選 1、3 費 4 選 1、5 費 4 選 1，一級無教團招式。**

---

## ⚠️ 一次範圍誤判（已修正，記錄以免重演）

抽取時我照**來源 PDF 的頁面內容**決定範圍，做出了不屬於 M0 的條目
（主要動作、機動動作相關的三張招式卡，以及後續的速查條目）。全部已刪除。

**教訓：範圍的權威是 `docs/scope.md` 與專案擁有者，不是來源 PDF 上有什麼。**
遇到「某某涵蓋範圍」這種寫法時，先回 `docs/scope.md` 確認有沒有展開的列舉；
沒有就問，不要自行解釋。

速查依 **2026-07-29 裁決**延後至上線前、不屬 M0（`docs/scope.md` 裁決 #1），
本輪為它產出的七個條目與只為它新增的 schema 支援已一併移除。

---

## 舊語料交叉驗證

| 條目 | 舊語料 | 結果 |
|---|---|---|
| 近戰武器基礎打擊 | `old-ability-list/…/近戰武器基礎打擊 *.md` | 關鍵詞／距離／動作／目標／三階層 **全部相符** |
| 遠程武器基礎打擊 | 同上 | **全部相符** |
| 怒火 | `class-notion/censor/怒火 *.md` | 章節結構相符，**譯文層有結構差異，見下** |
| 懲戒者教團 | `class-notion/censor/懲戒者教團 *.md` | 三支教團內容相符，**舊譯漏「Quick Build: Paragon」** |

### ⚠️ 留給第 7 步（中文逐句對齊）的觀察，**不是指控**

以下只是記下位置，**未經裁決，不得逕行改寫舊譯**：

1. **怒火** — 英文原文把「回合開始獲得 2 點怒火」寫在「戰鬥開始獲得等於勝利值的怒火」**同一段**，
   舊譯把它移進了下方「額外獲得怒火」的項目清單，並加上「每輪 1 次」的限定。
   原文該句是「At the start of each of your turns during combat」，沒有「每輪 1 次」字樣。
2. **怒火** — 原文有 `(see Judgment below)` 的交叉參照，舊譯未保留。
3. **懲戒者教團** — 原文段末 `(Quick Build: Paragon.)`，舊譯未譯出。
4. **基礎打擊** — 舊 CSV 記為「類別：招牌／等級：1 級」。正典依指南 §4.7(2) 記為
   `abilityCategory:"basic"` / `level:null`。這是**分類法差異**，不是內容差異。

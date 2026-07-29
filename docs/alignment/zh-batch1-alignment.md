# 中文對齊報告 · 第一批（5 個條目）

> 2026-07-29。第 7 步第一批。依 `docs/translation-guide.md` §8 產出，格式參照
> `docs/samples/alignment-my-life-for-yours.md`。
>
> **AI 只提報差異，不自行改寫舊譯。** 所有 🔴🟡 項目未經裁決前，該條目不得升為 `approved`、
> 不得進入 release manifest。

---

## ✅ 狀態：已完成（2026-07-29）

**擁有者已完成裁決，原 9 個阻擋項全部結案。**

| | |
|---|---|
| 裁決紀錄 | `data/translation-issues.json` **TI-8 ～ TI-18**，全部 `resolved` |
| 中文條目 | **5 個已產生**，`meta.status: reviewed` |
| 結構驗證 | `node scripts/verify-zh-structure.mjs` —— 與正典逐段對應 |

```
data/zh-Hant/abilities/ability.basic.melee-weapon-free-strike.json
data/zh-Hant/abilities/ability.basic.ranged-weapon-free-strike.json
data/zh-Hant/features/feature.censor.censor-order.json
data/zh-Hant/features/feature.censor.wrath.json
data/zh-Hant/features/feature.censor.judgment-order-benefit.json
```

**裁決摘要**（逐筆理由見對應 TI）

| 原編號 | 事項 | 裁決 | TI |
|---|---|---|---|
| PN-B1 🔴 | 「同一個招式」限定漏譯 | **補上「同個」** | TI-8 |
| PN-B2 🟡 | 「每輪 1 次」與清單重組 | 沿用舊譯——**全站風格，其餘 8 個範型比照** | TI-9 |
| PN-B3 🟡 | 「由 GM 決定」未譯出 | 沿用舊譯 | TI-10 |
| PN-A1 🟡 | Quick Build 未譯出 | **補上「（推薦選項：典範）」** | TI-11 |
| PN-A2 🟡 | 第一段人稱 | 沿用舊譯 | TI-12 |
| PN-A3 🟡 | hidden 譯為「躲避」 | **改為「尚未被教團發現的潛藏敵人」** | TI-13 |
| PN-C1 🟡 | 益處 vs 利益 | **「審判：教團益處」** | TI-14 |
| PN-A4 ⚪ | 「必定」語氣 | 沿用舊譯 | TI-15 |
| PN-B4 ⚪ | see Judgment below | **做成站內連結** | TI-16 |
| TC-1 | 教團名稱 | **正式用短式；行文可組合為「驅邪教團」** | TI-17 |
| TC-2 | Respite | **維持「休整」**（依據缺陷另記於 TI-18） | TI-18 |

> 以下差異分析保留原始樣貌（裁決前的判斷與證據），供日後回溯「當初為什麼這樣決定」。
> **各節的「阻擋批准」字樣描述的是裁決前的狀態，現已全部結案。**

**本批條目**

| # | id | 中文 | 英文正典來源 |
|---|---|---|---|
| 1 | `ability.basic.melee-weapon-free-strike` | 近戰武器基礎打擊 | `00-the-basic…` p.32／印刷頁 17 |
| 2 | `ability.basic.ranged-weapon-free-strike` | 遠程武器基礎打擊 | 同上 |
| 3 | `feature.censor.censor-order` | 懲戒者教團 | `04-censor.pdf` p.2／印刷頁 79 |
| 4 | `feature.censor.wrath` | 怒火 | 同上 |
| 5 | `feature.censor.judgment-order-benefit` | 審判：教團益處 | `04-censor.pdf` p.3／印刷頁 80 |

**舊譯來源**：`sources/notion-export/old-ability-list/招式列表 🛠️/`（基礎打擊）、
`sources/notion-export/class-notion/censor/`（教團、怒火、審判）

---

## 統計摘要

| 維度一 · 來源抽取 | 筆數 |
|---|---|
| `verified` | 5（本批全部；抽取階段紀錄見 `m0-batch2-results.md`） |

| 維度二 · 對齊狀態 | 筆數 |
|---|---|
| `exact` | 24 |
| `acceptable` | 6 |
| `mismatch` | 0 |
| `missing` | 2 |
| `extra` | 1 |

| 維度三 · 問題 | 筆數 | 阻擋批准 |
|---|---|---|
| `prose-issue` 🔴 high | **1** | ✅ |
| `prose-issue` 🟡 medium | **6** | ✅ |
| `prose-issue` ⚪ low | 2 | ❌ |
| `term-conflict` | **2** | ✅ |
| `term-applied` | 1 | ❌ |
| `unresolved-term` | 0 | ❌ |

**🚫 阻擋批准的未裁決項：9**（🔴 1 ＋ 🟡 6 ＋ term-conflict 2）　→ **2026-07-29 全部結案**

**已自動套用（`term-applied`）**

```
休整（Respite）  1 筆   舊譯作「長休」
```

> ⚠️ 這筆自動套用當時**有疑慮**（見下方 TC-2）。擁有者在知悉實際用量 63 vs 10 後重新確認維持「休整」，已套用（TI-18）。

---

## ✅ 完全相符、無問題（收合）

### 條目 1–2 · 基礎打擊 ×2

兩張卡逐欄比對，**全部 `exact`**：

| 欄位 | 近戰武器基礎打擊 | 遠程武器基礎打擊 |
|---|---|---|
| `name` | 近戰武器基礎打擊 / Melee Weapon Free Strike | 遠程武器基礎打擊 / Ranged Weapon Free Strike |
| `keywords` | 衝鋒、近戰、打擊、武器 | 遠程、打擊、武器 |
| `actionType` | 主要動作 | 主要動作 |
| `distance` | 近戰 1 | 遠程 5 |
| `target` | 1 個生物或物體 | 1 個生物或物體 |
| `tiers[0-2]` | 2／5／7 ＋`力量`或`敏捷`傷害 | 2／4／6 ＋`力量`或`敏捷`傷害 |

**沒有任何需要裁決的項目。** 這兩條已隨本批一併產出 `data/zh-Hant/`。

> 舊 CSV 記為「類別：招牌／等級：1 級」，正典記為 `abilityCategory: basic` / `level: null`。
> 這是**分類法差異**，不是譯文差異，已於指南 §4.7(2) 記錄，不列為待裁項。

### 條目 5 · 審判：教團益處（除下列待裁項外全部相符）

| 欄位 | 狀態 |
|---|---|
| 引導句、三個教團加成的規則內容與數值 | ✅ `exact` |
| 「你與終點之間不需要有效果線」／`You do not need line of effect to your destination.` | ✅ `acceptable`（語序調整） |

---

## 🔴 阻擋批准 · 高嚴重度（1 項）

### 🔴 PN-B1 · `feature.censor.wrath` / 戰鬥外的怒火 · 第 1 段

```
[acceptable · prose-issue:high] feature.censor.wrath / sections[2].blocks[0]

  舊譯    雖然你無法在戰鬥外獲得`怒火`，但你可以在不花費`怒火`的情況下發動 1 次
          英雄招式或需要`怒火`的效果。若你這麼做，你必須獲得至少 1 點`勝利值`
          或完成 1 次長休，才能在戰鬥外再次發動需要`怒火`的招式或效果。

  原文    Though you can’t gain wrath outside of combat, you can use your heroic
          abilities and effects that cost wrath without spending it. Whenever you
          use an ability or effect outside of combat that costs wrath, you can’t
          use **that same** ability or effect outside of combat again until you
          earn 1 or more Victories or finish a respite.

  判斷    原文限制的是「**同一個**招式或效果」（that same ability or effect）——
          用過「惡徒止步！」之後，戰鬥外不能再用「惡徒止步！」，但仍可用別的怒火招式。
          舊譯作「再次發動需要`怒火`的招式或效果」，**未譯出「同一個」**，
          讀起來是「用過任何一個之後，所有怒火招式都鎖住」。
          這改變了限制的**範圍**，不是語氣問題。
          （印刷頁 79，Wrath Outside of Combat 第 1 段第 2 句）

  建議    …完成 1 次休整，才能在戰鬥外再次發動**同一個**招式或效果。
          （「同一個」的確切措辭由裁決者定；此處僅示意補回限定範圍）

  來源    heroes-v1.01-04-censor  pdfPage 2 / printedPage 79
```

> 依 §8.3，🔴 high 須附 300dpi 裁切證據。本項的原文已在抽取階段以 150dpi 全頁算繪核對
> （見 `m0-batch2-results.md` 版面驗證表），**若裁決者要求，我再補該段的 300dpi 裁切。**

---

## 🟡 阻擋批准 · 中嚴重度（6 項）

### 🟡 PN-B2 · `feature.censor.wrath` / 戰鬥中的怒火 —— 整段被重組，並加上原文沒有的「每輪 1 次」

```
[extra · prose-issue:medium] feature.censor.wrath / sections[1]

  舊譯    在戰鬥或其他需要以戰鬥輪計算的緊張情境開始時，你會獲得等於`勝利值`的`怒火`。

          此外，當以下條件觸發時，你會再額外獲得`怒火`。
          - 每輪 1 次，當你的回合開始時，你獲得 2 點`怒火`。
          - 每輪 1 次，當 1 個被你審判的生物首次對你造成傷害時，你獲得 1 點`怒火`。
          - 每輪 1 次，當你首次對 1 個被你審判的生物造成傷害時，你獲得 1 點`怒火`。

  原文    At the start of a combat encounter or some other stressful situation
          tracked in combat rounds (as determined by the Director), you gain wrath
          equal to your Victories. **At the start of each of your turns during
          combat, you gain 2 wrath.**

          Additionally, the first time each combat round that a creature judged by
          you (see Judgment below) deals damage to you, you gain 1 wrath. The first
          time each combat round that you deal damage to a creature judged by you,
          you gain 1 wrath.

  判斷    三處差異：
          (1) 「回合開始獲得 2 點怒火」原文在**第一段句尾**，舊譯把它搬進項目清單，
              與後兩項並列。原文的兩段是不同性質：第一段講「固定取得」，
              第二段（Additionally）講「條件觸發」。
          (2) 該項被加上「**每輪 1 次**」。原文是 “at the start of each of your
              turns”（每個你的回合開始時），是**回合**制不是**輪**制。
              一般情況下每輪一個回合，兩者等價；但若有額外回合的效果，判定會不同。
          (3) 舊譯增加了原文沒有的引導句「此外，當以下條件觸發時，你會再額外獲得`怒火`。」
              原文的 “Additionally,” 只是連接詞，未另立一句。
          （印刷頁 79，Wrath in Combat 第 1–2 段）

  建議    無單一替代文字。此項需要裁決者決定：
          (a) 照原文結構還原成兩段散文，或
          (b) 維持舊譯的清單排版但刪除「每輪 1 次」，改為「當你的回合開始時」

  來源    heroes-v1.01-04-censor  pdfPage 2 / printedPage 79
```

### 🟡 PN-B3 · `feature.censor.wrath` / 「由 GM 決定」未譯出

```
[missing · prose-issue:medium] feature.censor.wrath / sections[1].blocks[0]

  舊譯    在戰鬥或其他需要以戰鬥輪計算的緊張情境開始時，…
  原文    …or some other stressful situation tracked in combat rounds
          **(as determined by the Director)**, …

  判斷    原文明確指出「哪些情境算數」由 GM 判定，舊譯未譯出。
          這關係到**誰有裁量權**，不只是語氣。
          （印刷頁 79，Wrath in Combat 第 1 段）

  建議    …或其他由 GM 認定、需要以戰鬥輪計算的緊張情境開始時，…
          （`Director` ＝ GM 已於 2026-07-29 裁定）

  來源    heroes-v1.01-04-censor  pdfPage 2 / printedPage 79
```

### 🟡 PN-A1 · `feature.censor.censor-order` / 「Quick Build」未譯出

```
[missing · prose-issue:medium] feature.censor.censor-order / sections[0].blocks[0]

  舊譯    當你承擔這個責任時，從以下選項中選擇 1 支教團。每支教團都會賦予你 1 項技能。
  原文    …you choose a censor order from the following options, each of which
          grants you a skill. **(Quick Build: Paragon.)**

  判斷    給新手的快速建角建議整句未譯出。屬於官方提供的遊戲資訊，非裝飾。
          （印刷頁 79，Censor Order 第 1 段句尾）

  建議    …每支教團都會賦予你 1 項技能。（推薦選項：典範）
          （`Quick Build` ＝推薦選項已於 2026-07-29 裁定；
           括號內句尾不加句號見指南 §6）

  來源    heroes-v1.01-04-censor  pdfPage 2 / printedPage 79
```

### 🟡 PN-A2 · `feature.censor.censor-order` / 第一段人稱與句構

```
[acceptable · prose-issue:medium] feature.censor.censor-order / sections[0].blocks[0]

  舊譯    懲戒者作為其神明意志的實體化身，是神明在世界上的代行者。
  原文    Censors are the will of their god made physically manifest, and
          **you act as** your god’s agent in the world.

  判斷    原文前半句講「懲戒者（泛稱）」，後半句轉為第二人稱「**你**擔任神明的代行者」。
          舊譯把兩句合併成單一的第三人稱陳述，「你」消失了。
          依 TI-4，規則文本一律用第二人稱；此處原文本來就是第二人稱，
          舊譯反而改成第三人稱，方向與既定原則相反。
          （印刷頁 79，Censor Order 第 1 段第 1 句）

  建議    懲戒者是其神明意志的實體化身，而**你**是神明在世界上的代行者。

  來源    heroes-v1.01-04-censor  pdfPage 2 / printedPage 79
```

### 🟡 PN-A3 · `feature.censor.censor-order` / 驅邪：「hidden」譯為「躲避」

```
[acceptable · prose-issue:medium] feature.censor.censor-order /
                                  sections[0].blocks[1].items[0]

  舊譯    你擅長獵捕**躲避**你教團的敵人，深知敞開的心靈就如同毫無防備的堡壘。
  原文    You specialize in hunting your order’s **hidden** enemies, knowing that
          an open mind is an unguarded fortress.

  判斷    原文是「你教團的**隱藏**敵人」（潛伏、未被發現），舊譯作「**躲避**你教團的敵人」
          （主動逃避）。兩者指涉的對象不同：前者強調未被察覺，後者強調正在逃跑。
          這段雖偏敘述，但描述的是教團的職能範圍。
          （印刷頁 79，Exorcist 條）

  建議    你擅長獵捕潛藏在你教團中的敵人，…

  來源    heroes-v1.01-04-censor  pdfPage 2 / printedPage 79
```

### 🟡 PN-C1 · `feature.censor.judgment-order-benefit` / 條目名稱

```
[acceptable · prose-issue:medium] feature.censor.judgment-order-benefit / name

  舊譯    審判教團益處
  原文    Judgment Order Benefit
  規劃    docs/scope.md 的 M0 範圍表寫「審判教團**利益**」

  判斷    同一個條目在舊譯與範圍文件用了兩個詞（益處／利益）。
          `Benefit` 目前不在術語表，兩者都說得通，但**必須擇一**，
          否則資料層與文件層會長期不一致。
          舊語料「教團益處」2 檔、「教團利益」0 檔。

  建議    無傾向。請裁決者指定其一，我一併更新 `docs/scope.md`。

  來源    heroes-v1.01-04-censor  pdfPage 3 / printedPage 80
```

---

## ⚪ 不阻擋批准 · 低嚴重度（2 項，僅供知悉）

### ⚪ PN-A4 · 典範教團說明加強語氣

```
[acceptable · prose-issue:low] feature.censor.censor-order /
                               sections[0].blocks[1].items[2]
  舊譯    若沒有堅強的典範與嚴格的管束，弱者**必定**墮落腐化。
  原文    Without a strong example and a firm hand, the weak **will be** corrupted.
  判斷    「必定」比 “will be” 語氣更強，但屬純敘述，無機制影響（§7.2 允許改寫）。
  來源    heroes-v1.01-04-censor  pdfPage 2 / printedPage 79
```

### ⚪ PN-B4 · 「(see Judgment below)」交叉參照未保留

```
[missing · prose-issue:low] feature.censor.wrath / sections[1].blocks[1]
  舊譯    當 1 個被你審判的生物首次對你造成傷害時，…
  原文    …that a creature judged by you **(see Judgment below)** deals damage…
  判斷    指向同頁下方【審判】的參照。網站沒有「下方」，處理方式比照 TI-5～7
          （紙本參照在 M0 只譯內容、不保留位置指示）。
          與 TI-5～7 不同處：此處的目標【審判】**在 M0 範圍內**，
          M1 可直接做成站內連結。
  來源    heroes-v1.01-04-censor  pdfPage 2 / printedPage 79
```

---

## ⚠️ 術語衝突（2 項，阻擋批准）

### TC-1 · 三個教團的名稱：舊譯自身不一致

```
[term-conflict] feature.censor.censor-order + feature.censor.judgment-order-benefit

  已批准術語   Exorcist ＝ 驅邪   Oracle ＝ 神諭   Paragon ＝ 典範
              Order ＝ 教團（sense: censor-subclass）

  舊譯用法     懲戒者教團一節      → 驅邪**教團**、神諭**教團**、典範**教團**（6 個檔案）
              審判教團益處一節    → 驅邪、神諭、典範（無「教團」）

  原文         兩處都是 `Exorcist:` / `Oracle:` / `Paragon:`，**都沒有 Order 字樣**

  判斷    舊譯在兩個相鄰段落用了兩種寫法。加「教團」二字讀起來較清楚
          （知道這是三選一的子範型），但原文沒有，且與已批准的術語不一致。
          這會直接影響網站上教團選擇介面的標籤。

  建議    無傾向。三種可能：
          (a) 一律用「驅邪／神諭／典範」——貼合原文與已批准術語
          (b) 一律用「驅邪教團／神諭教團／典範教團」——較好讀，但屬增添
          (c) 標題用長式、內文用短式——需明訂規則，否則又會漂移
```

### TC-2 · `Respite`：已批准「休整」，但舊譯 63 個檔案用「長休」

```
[term-conflict] feature.censor.wrath / sections[2].blocks[0]

  已批准術語   Respite ＝ 休整（approved 2026-07-28）
  裁決依據     「擁有者批次審閱 A 段 #152（M0 1 檔／全語料 10 檔），
               建議譯名取自舊譯，一次批准。」

  實際用量     休整  10 個檔案
              長休  **63 個檔案**   ← 舊譯實際的主要用法

  舊譯此處     …或完成 1 次**長休**，才能在戰鬥外再次發動…

  判斷    ⚠️ **這不只是本條目的問題，是裁決依據本身可能有偏差。**
          `docs/term-review-queue.md` 的頻率統計是「數**它自己提議的那個譯名**
          在舊語料出現幾個檔案」，**不會去數競爭譯名**。
          所以 #152 顯示「10 檔」，但那 10 檔是「休整」的數量；
          真正的主流譯法「長休」有 63 檔，從未進入你的視野。

          這與已記錄的「方格/格」分段漏洞是**同一家族**：
          清單呈現的資訊不足以支持裁決。

  影響範圍   本批 1 筆。但同樣的偏差可能影響 A、B 段其他已批准的詞——
          **尚未逐一複查**，這是本報告的已知未覆蓋範圍。

  建議    請先裁決 Respite 要用「休整」還是「長休」。
          若改為「長休」，我會走正式路徑：改 decisions.json → 重跑生成
          → validate-terms --commit → 重建 releases/m0.json。
```

---

## 本批的已知限制（誠實列出）

1. **只對了 5 個條目。** 其餘 14 個招式未動，中文進度 14／28。
2. **TC-2 揭露的裁決依據偏差未擴大複查。** Respite 的裁決已確認維持「休整」，
   但 `term-review-queue` 的統計方式問題**依然存在**——它只數自己提議的譯名，不數競爭譯名。
   其他已批准術語是否受同樣影響，**本輪未查**。要查的話是一支獨立的比對工具
   （對每個已批准譯名，找出舊語料中同一英文的其他譯法並比較檔案數）。
   這是目前最大的一塊未覆蓋範圍。
3. **🔴 PN-B1 未附 300dpi 裁切。** 原文已於抽取階段以 150dpi 全頁算繪核對過；
   若日後需要更高解析度的證據，可再補。
4. **`data/zh-Hant/` 的 5 個檔案已產生**（裁決完成後）。結構以
   `scripts/verify-zh-structure.mjs` 驗過與正典逐段對應。

---

## 待裁決項目一覽（給裁決者的清單）

| # | 條目 | 事項 | 嚴重度 |
|---|---|---|---|
| 1 | 怒火 | 「同一個招式」的限定漏譯，規則範圍被擴大 | 🔴 |
| 2 | 怒火 | 「回合開始獲得 2 點怒火」被搬位置並加上「每輪 1 次」 | 🟡 |
| 3 | 怒火 | 「由 GM 決定」未譯出 | 🟡 |
| 4 | 懲戒者教團 | 「（推薦選項：典範）」未譯出 | 🟡 |
| 5 | 懲戒者教團 | 第一段的「你」消失，改成第三人稱 | 🟡 |
| 6 | 懲戒者教團 | 驅邪：hidden（隱藏）譯為「躲避」 | 🟡 |
| 7 | 審判：教團益處 | 條目名稱：益處 vs 利益，需擇一 | 🟡 |
| 8 | 教團名稱 | 驅邪 vs 驅邪教團，舊譯自身不一致 | term-conflict |
| 9 | Respite | 休整 vs 長休，**且裁決依據可能有偏差** | term-conflict |

**以上 9 項已於 2026-07-29 全部裁決完畢**，對應 TI-8 ～ TI-18，見本檔開頭的裁決摘要。

**基礎打擊兩條原本就無待裁項**，與其餘三條一併產出了中文。

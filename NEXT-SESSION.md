# 下一個對話的啟動說明

> 建立於 2026-07-28，**同日更新兩次**（術語批次裁決完成、懲戒者 14 個招式正典抽取完成）。
> **新對話請先讀本檔，再讀下列文件。**

---

## 現在在哪裡

規劃 §14.5 的執行順序，**第 1–4 步已完成，下一步是第 5 步**：

```
1. ✅ poppler 安裝與算繪驗證
2. ✅ 翻譯指南搬入 docs/translation-guide.md
3. ✅ 「捨己為人」對齊報告樣張
4. ✅ 閘門通過，指南已批准
5. 🔄 抽取 M0 英文正典
     ✅ 懲戒者一級 14 個招式（全部 verified）
     ✅ 9 個狀態（正典＋中文實體皆已建立，術語表 approved）
     ⏳ 基礎打擊、速查、三教團、怒火說明
6. ⏳ 產出術語依賴清單 → releases/m0.json
7. ⏳ 中文逐句對齊，產出差異報告 + 兩份問題檔
8. ⏳ 專案擁有者逐筆裁決
9. ⏳ 此時才開始寫 UI
```

### 招式部分已完成，**下一個動作有兩個選項**

**(a) 繼續抽 M0 剩下的英文正典**（基礎打擊／狀態／速查／三教團／怒火）——
分冊不同，版式可能不一樣，抽之前先算繪 1 張 150dpi 驗版面。

**(b) 先做 14 個招式的中文逐句對齊** —— 英文正典已備妥，可直接開工。
會卡在 9 個狀態的中文名（緩速、暈眩、擒制、畏縮、伏地、嘲諷…目前 `needs-review`）。

**擁有者尚未指定先做哪個，請先問。**

**詞彙系統已凍結**，不再加固。
唯一例外：2026-07-28 新增 `decisions.notTerms` 機制（擁有者裁定某 CSV 列不是術語時的移除路徑），
附 3 個測試。這是補功能，不是加固。

---

## 必讀文件（依序）

| 檔案 | 為什麼要讀 |
|---|---|
| `~/.claude/plans/draw-steel-ux-velvety-frog.md` | 完整規劃。**特別是 §14.1.1／§14.1.3 的規則事實發現**——那些是算繪後才發現、改寫過資料結構的 |
| `docs/translation-guide.md` | 翻譯規則、報告格式、術語裁決紀錄（附錄 A） |
| `docs/samples/alignment-my-life-for-yours.md` | 報告格式的實際範例，照這個格式產出 |
| `review-2026-07-28-manifest.md` | 詞彙系統的最終狀態與刻意不做的事 |

---

## 工作方式（重要，不在文件裡）

1. **專案擁有者是唯一裁決者。** AI 不得自行批准術語、不得自行改寫舊譯。所有差異一律標註待裁。
2. **擁有者無程式背景**，說明時避免術語，用實際資料舉例。
3. **擁有者採用高強度外部 AI Review。** 交付時附 manifest，誠實列出限制與未覆蓋範圍——不要宣稱超出實際驗證的保證。
4. **不要假裝驗證過。** 前幾輪的真實教訓：寫了 hash 卻從不比對、宣稱有測試但沒有、測試走錯路徑遮住 bug。說「驗過了」之前先實際跑。
5. **共同原則**：先問「這一步是否必要？投入是否與目前風險相稱？」而非「還能不能再加一層保護」。

---

## 第 5 步該怎麼做

### 採混合抽取法：文字為主，圖像驗結構

> ⚠️ **2026-07-28 更新，推翻先前「必須全部算繪」的結論。**

先前的判斷「文字抽取不可信」是**過度概括**。實測後區分出兩件事：

| | 文字抽取 |
|---|---|
| **跨欄位的頁面閱讀順序** | ❌ 會靜默錯亂（Heroes p.16 抽出 4→5→6→7→1→2→3，導致「Think 思考」被誤讀為「概念發想」） |
| **單一招式區塊內的完整性** | ⚠️ **必須加 `-layout`**，否則階層符號與數值失聯、跨卡片內容互插（見下） |

以「惡徒止步！」實測，文字抽取給出：

```
Halt Miscreant!
You infuse your weapon with holy magic that makes it difficult for your foe to get away.
Melee, Strike, Weapon        Main action
o Melee 1  x One creature or object
Power Roll + Might:
á  2 + M holy damage; p<w , slowed (save ends)
é  5 + M holy damage; p<v , slowed (save ends)
í  7 + M holy damage; p<s , slowed (save ends)
```

與 300dpi 圖像讀到的**逐字相符**。而且**符號字元是資產不是雜訊**——`o` 是距離標記、`x` 是目標標記、`á é í` 是三個門檻、`p<w` 就是「氣場 < 弱」，全是確定性的分隔符。

**成本差距**：300dpi 全頁約 11,000 tokens、150dpi 約 2,800、文字抽取單一招式約 150。文字比 150dpi 便宜約 70 倍。以 M1（約 60 頁）估算：全算繪 660k vs 混合約 52k。

### 具體做法

1. **每個 PDF 章節算繪 1–2 頁 150dpi**，確認版面結構：哪些招式在哪個標題下、有沒有側欄穿插、表格在哪
2. 結構確認後，**用文字抽取逐個招式取內容**
3. **用舊 CSV 交叉驗證**——`sources/notion-export/.../招式列表*.csv` 已有每個招式的等級、費用、類別。文字抽取結果必須與它一致，**不一致就算繪那一頁**
4. 只有 🔴 high 級疑點才用 300dpi 裁切

第 3 點是關鍵：**兩個獨立來源互相檢核**，比單靠算繪更可靠（算繪只有 AI 一雙眼睛）。

### ⚠️ 2026-07-28 實測後的兩條硬性修正

**(1) `pdftotext` 一定要加 `-layout`。** 不加會靜默毀掉左欄的卡片：三個階層符號 `á é í`
被抽離、與數值失聯，數值漂到 40 行外，還混進隔壁卡片的欄位。以「瀆神者退散！」重現。
上面那句「單一招式區塊內完整性逐字正確」是**過度概括**——先前測試用的「惡徒止步！」在右欄，
恰好沒觸發。

**(2) 算繪預設 150dpi**（擁有者要求，300dpi 太耗 token）。150dpi 下符號與小字皆清晰，已實測。
只有 🔴 high 級疑點才用 300dpi 裁切。

**方法驗證已完成**（見 `docs/alignment/method-validation.md`）：基本卡片、長效果＋巢狀選項、
效力記號、真正的第二段花費四種結構全部驗過。其中「捨己為人」與上一輪 300dpi 人工判讀的結果
逐欄比對 **8/8 一致**——這是最有力的一項，因為對照組來自不同時間、不同方法。

```bash
# poppler 已安裝但可能不在執行中行程的 PATH，直接用絕對路徑
BIN="C:/Users/boyia/AppData/Local/Microsoft/WinGet/Packages/oschwartz10612.Poppler_Microsoft.Winget.Source_8wekyb3d8bbwe/poppler-25.07.0/Library/bin/pdftoppm.exe"

# 文字抽取（主要來源）—— -layout 不可省略
"C:/.../poppler-25.07.0/Library/bin/pdftotext.exe" -f 5 -l 5 -layout   "sources/official/Draw_Steel_Heroes_v1.01/04-censor.pdf" out/p5.txt

# 整頁算繪（驗版面，預設 150dpi）
"$BIN" -f 5 -l 5 -r 150 -png "sources/official/Draw_Steel_Heroes_v1.01/04-censor.pdf" out/page

# 局部放大（-x -y -W -H，300dpi 下座標為 150dpi 的兩倍）
"$BIN" -f 3 -l 3 -r 300 -x 240 -y 3020 -W 1060 -H 230 -png "…04-censor.pdf" out/crop
```

再用 Read 工具讀 PNG。

### M0 的確切範圍（不得擴張）

| 項目 | 內容 | 已知位置 |
|---|---|---|
| 招式 | ✅ **已完成** 懲戒者一級 14 個（招牌 4／英雄 8／固有 2） | `04-censor.pdf` p.3、p.5、**p.6** |
| 基礎打擊 | 近戰、遠程 | `00-the-basic…pdf` p.32 |
| 狀態 | ✅ **已完成** 9 個（出血／暈眩／畏縮／擒制／伏地／束縛／緩速／嘲諷／虛弱） | `03-class-and-abilities.pdf` p.9（印刷頁 77） |
| 速查 | Rules Reference 第 1 頁涵蓋範圍，**文字回溯 Heroes** | 待定位 |
| 教團 | 驅邪／神諭／典範，**僅一級內容** | `04-censor.pdf` p.2、p.3 |
| 怒火 | 最小必要說明 | `04-censor.pdf` p.2 |

**明確不含**：2 級以上任何內容、領域（Domain）與領域特性、套裝、範型頁面。

### 產出

1. 英文正典 → `data/canon/*.json`（schema 見規劃 §5.3，注意 `TierResult.threshold` 是門檻不是階層編號、`extraCosts` 存第二段花費）
2. 精確術語依賴清單 → `releases/m0.json`（**須涵蓋全部 M0 發布文字**，含三教團與怒火說明）
3. 對齊報告 → 照 `docs/samples/` 的格式
4. 未決術語 → `data/decisions.json` 的 `pending`（**不要直接改生成檔**）

---

## 術語批次裁決（進行中）

`docs/term-review-queue.md` 已產出，擁有者**已審完 A 段**，裁決結果會在新對話開頭提供。

**A、B 段已於 2026-07-28 裁決完畢並套用。** C 段（346 條低頻）仍未審，依原判斷暫不處理。

⚠️ **一個已知的分段漏洞**：清單依「該中文譯名在舊語料出現幾個檔案」排序。舊 CSV 的 zh-tw 欄
若寫成「方格/格」這種一欄兩候選，該字串從未原樣出現，計數 0，會被丟到「建議暫不處理」的 C 段——
但它可能是 M0 每張卡都要用的詞。已補裁決的三條：`Square`＝格、`Distance`＝射程、
`Natural 19 or 20`＝天然 19/20。**C 段不等於「不重要」，抽取時發現缺詞要隨時回頭補裁。**

重新產生清單：`node scripts/report-term-frequency.mjs`（唯讀，不動 data/）

---

## ⚠️ 驗證邊界（2026-07-28 外部 review，**開工前必讀**）

### 邊界一：懲戒者的成功不等於全遊戲適用

**已驗證**：懲戒者一級 14 招式、9 個狀態、目前遇到的招式結構與版式。
**未驗證**：其他職業、其他資料類型是否會出現沒看過的欄位、規則組合或版面。

**真正的風險不是抽取失敗，而是過早認定 schema 已完整**——
之後為了把新規則塞進舊結構，反而改變原文語意。

剩下的基礎打擊、速查、三教團、怒火說明**本身就是不同的資料類型**。

**做法**：不必擴張驗證規模。**第一次遇到新資料類型或明顯不同的版式時，
先用一個代表樣本確認即可**，不必重做整套方法驗證。若該樣本出現 schema 裝不下的東西，
**先問擁有者，不要自行擴大解釋既有欄位**。

> 本輪已實際發生兩次過度概括：
> (1) 只掃 p.3／p.5 就寫「14 個招式只有三種距離形狀」——p.6 出現第四種。
> (2) 用 Rules Reference 當正典來源——內容與 Heroes 不同，產生假指控。

### 邊界二：資料驗證通過 ≠ 網站能正確使用

**目前證明的只有資料層**：JSON 結構有效、內容指紋相符、術語與受控值通過、中英實體正確配對。

**尚未證明**畫面能正確呈現與操作這些結構。至少這六項沒有端到端驗過：

| 結構 | 出現在 |
|---|---|
| `Melee 1 or ranged 5` 二選一射程 | 直視正義威儀！、淨化聖火 |
| 檢定屬性與效力抵抗屬性不同 | 惡徒止步！（力量／氣場）、懺悔吧！（氣場／直覺） |
| `extraCosts` 追加花費 | 捨己為人、當場拘捕 |
| `followUpActions` 持續期間四選一 | 審判 |
| 招式連到狀態實體 | 全部含狀態的招式 |
| 中英文資料切換 | 全站 |

**做法**：不阻擋目前的 M0 資料整理。但**在大量擴張資料之前，保留一個小型網站驗證點**——
實際讀取一個懲戒者招式頁面，確認上述結構能被正確顯示與操作。
建議樣本：**審判**（四選一）＋**淨化聖火**（二選一射程＋效力＋狀態連結），兩個涵蓋五項。

---

## 資料來源的排除清單（不得重新開啟）

| 來源 | 狀態 | 依據 |
|---|---|---|
| Foundry VTT `draw-steel` 系統 | ❌ **不採用** | 其 `LICENSE.md` 明文：內容為 MCDM 單獨授權，**Creator License 不適用**；GitHub 標示 `NOASSERTION`。規劃 §9.4.1 |
| Forge Steel | ❌ 不採用 | GPL-3.0，避免授權混合。規劃 §9.4 |
| Steel Compendium | ❌ 不採用 | `NOASSERTION`。規劃 §9.5 |

**唯一內容來源：`sources/official/Draw_Steel_Heroes_v1.01/` 的官方 PDF。**

> ⚠️ **`DrawSteelRulesReferenceV1.pdf` 不是正典來源。** 2026-07-28 實測：同一批狀態，
> 它與 Heroes v1.01 至少 8 處文字不同，其中「出血」少了整句 `and only happens once per action.`，
> 「擒制」的掙脫時機是不同的規則。**舊譯全部依 Heroes 翻譯。**
> 曾因用錯來源而產生一次假的「舊譯多加規則」指控，見 `docs/alignment/conditions.md`。

> Foundry 系統本機已安裝於 `C:/TRPG/FVTT V14/Data/systems/draw-steel`，GitHub 上有完整 JSON（`src/packs/**/*.json`），技術上完全可讀——**但不得使用**。允許的用法只有：研究其欄位切法作為 schema 參考、擁有者個人開著比對。其內容不得進入 `data/canon/`。

---

## 目前待擁有者裁決的四項

| 英文 | 情形 |
|---|---|
| ~~`Fire`~~ | ✅ 已 split：火焰（傷害類型）／烈火（元素師精通），兩個獨立詞條 |
| ~~`Order`~~ | ✅ ＝教團（sense `censor-subclass`） |
| `Hakaan` | 哈肯族 · 哈肯人 —— 疑為譯名不一致，需 merge。**M0 用不到** |
| `Memonek` | 梅莫族 · 梅莫人 —— 同上。**M0 用不到** |

在裁決前，相關條目不得進入 release manifest。**AI 不得代為裁決。**

### ✅ 9 個狀態已完成（2026-07-28）

出血／暈眩／畏縮／擒制／伏地／束縛／緩速／嘲諷／虛弱，全部 `approved`。

架構：**名稱的權威在狀態實體，不在術語表。**

```
data/canon/conditions/condition.*.json     英文正典（Heroes v1.01 印刷頁 77）
data/zh-Hant/conditions/condition.*.json   中文實體：nameZhHant ＋ 逐段譯文
data/glossary.json                         entityRef 指向實體，**刻意不存 zhHant**
```

`decisions.json` 的這 9 筆裁決刻意不含 `zhHant`——兩處都放譯名會變成雙重權威。

譯文層裁決記於 `data/translation-issues.json`（TI-1～TI-4，全部 resolved）。

---

## 驗證指令

```bash
node --test "scripts/**/*.test.mjs"      # 74 tests
node scripts/build-vocabulary.mjs
node scripts/import-glossary.mjs
node scripts/validate-terms.mjs --commit
```

目前基線（2026-07-28 收盤）：
glossary **600**（approved **253**）、vocabulary **21** 值（5 個詞彙表，全部 approved）、
ledger **617**、pending **2**（Hakaan／Memonek）、測試 **77/77**、
正典 **23** 條目＝14 招式 ＋ 9 狀態（`node scripts/verify-canon-hash.mjs` 全部相符）、
中文實體 **9** 個狀態、translation-issues **4** 項全 resolved。

```bash
node scripts/verify-canon-hash.mjs   # 正典內容指紋（新增）
```

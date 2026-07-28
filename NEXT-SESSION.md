# 下一個對話的啟動說明

> 建立於 2026-07-28，最後更新 **2026-07-29**（第 6 步完成：術語依賴清單 releases/m0.json）。
> **新對話請先讀本檔，再讀下列文件。**

---

## 現在在哪裡

M0 的執行順序，**第 1–6 步已完成，下一步是第 7 步**：

```
1. ✅ poppler 安裝與算繪驗證
2. ✅ 翻譯指南搬入 docs/translation-guide.md
3. ✅ 「捨己為人」對齊報告樣張
4. ✅ 閘門通過，指南已批准
5. ✅ 抽取 M0 英文正典 —— 28 個條目，全部 verified
     ✅ 懲戒者一級 14 個招式
     ✅ 9 個狀態（正典＋中文實體皆已建立，術語表 approved）
     ✅ 2 個基礎打擊
     ✅ 3 個教團／怒火特性（新 type `feature`）
     ⏸ 速查不屬 M0（2026-07-29 裁決，見 docs/scope.md）
6. ✅ 產出術語依賴清單 → `releases/m0.json`（111 個術語，全部 approved）
7. 🔄 中文逐句對齊，產出差異報告 + 兩份問題檔  ← **下一步**
8. ⏳ 專案擁有者逐筆裁決
9. ⏳ 此時才開始寫 UI
```

### 第 7 步該做什麼

28 條正典裡，**中文只做了 9 個狀態**，其餘 19 條（16 招式 ＋ 3 特性）尚未產出 `data/zh-Hant/`。
逐句對齊舊譯與英文正典，照 `docs/samples/alignment-my-life-for-yours.md` 的格式產報告，
差異一律標註待裁，**AI 不得逕行改寫舊譯**。

⚠️ **產生中文前先讀 `data/translation-issues.json`**（TI-1～TI-7，全部 resolved）。
那是待辦清單，不是靠記憶——例如 TI-5～7 規定章節交叉參照在 M0 只譯動作名、不加連結。

⚠️ **已知的三筆待對齊觀察**記在 `docs/alignment/m0-batch2-results.md` 末尾
（怒火的段落搬移與「每輪 1 次」、遺漏的 `(see Judgment below)`、教團的 Quick Build）。

> 第 6 步的兩個把關機制**已實測有效**，不必重驗：
> `provisional-in-release`（塞假 id 進清單確認 exit 1）、
> build 階段的 `idStatus` 守衛（approved 但 id 仍 provisional 也會擋）。

**詞彙系統已凍結**，不再加固。
唯一例外：2026-07-28 新增 `decisions.notTerms` 機制（擁有者裁定某 CSV 列不是術語時的移除路徑），
附 3 個測試。這是補功能，不是加固。

---

## 必讀文件（依序）

| 檔案 | 為什麼要讀 |
|---|---|
| `docs/scope.md` | **M0 範圍的唯一正式權威**，含逐筆有日期的範圍裁決。動手前先確認要做的東西在不在範圍內 |
| `docs/translation-guide.md` | 翻譯規則、schema、抽取方式、報告格式、術語裁決紀錄（附錄 A） |
| `docs/samples/alignment-my-life-for-yours.md` | 報告格式的實際範例，照這個格式產出 |
| `review-2026-07-28-manifest.md` | 詞彙系統的最終狀態與刻意不做的事 |
| `docs/alignment/method-validation.md` | 抽取方法的驗證結果**與其適用邊界**——結論只對懲戒者招式與狀態成立 |
| `docs/alignment/censor-level1-results.md` | 14 個招式的結果表；新結構（距離二選一、效力屬性逐招式不同）記在這裡 |
| `docs/alignment/conditions.md` | 9 個狀態；**含一次「用錯來源產生假指控」的完整紀錄**，值得先看以免重演 |
| `docs/alignment/m0-batch2-results.md` | 2026-07-29 第二批（基礎打擊／教團／怒火）；含**範型建模的四項規則事實**與一次範圍誤判的紀錄 |
| `data/translation-issues.json` | 譯文層的裁決（TI-1～TI-7）。**產生中文時是待辦清單，不是靠記憶** |
| `docs/m0-term-decisions-needed.md` | 第 6 步的術語裁決紀錄（已全數結案）——當初為什麼這樣決定 |
| `releases/m0.json` | M0 的精確術語依賴清單。111 個術語，含排除理由與詞義指定 |

> **不需要讀** `~/.claude/plans/draw-steel-ux-velvety-frog.md`。
> 那個檔在 repository 之外（GitHub、新 clone、其他 Agent 都拿不到），
> 2026-07-29 起只是擁有者的本機工作筆記。
> 它原本承載的範圍權威已移入 `docs/scope.md`，規則事實已移入指南與對齊報告。

---

## 工作方式（重要，不在文件裡）

1. **專案擁有者是唯一裁決者。** AI 不得自行批准術語、不得自行改寫舊譯。所有差異一律標註待裁。
2. **擁有者無程式背景**，說明時避免術語，用實際資料舉例。
3. **擁有者採用高強度外部 AI Review。** 交付時附 manifest，誠實列出限制與未覆蓋範圍——不要宣稱超出實際驗證的保證。
4. **不要假裝驗證過。** 前幾輪的真實教訓：寫了 hash 卻從不比對、宣稱有測試但沒有、測試走錯路徑遮住 bug。說「驗過了」之前先實際跑。
5. **共同原則**：先問「這一步是否必要？投入是否與目前風險相稱？」而非「還能不能再加一層保護」。

---

## 正典抽取方法（第 5 步建立，M1 仍適用）

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

### M0 的確切範圍

**權威在 [`docs/scope.md`](docs/scope.md)**，本檔不再另存一份（同一份範圍放兩處必然各自漂移）。

已抽取的正典來源頁：招式 `04-censor.pdf` p.3／p.5／p.6、基礎打擊 `00-the-basic…pdf` p.32、
狀態 `03-class-and-abilities.pdf` p.9、教團與怒火 `04-censor.pdf` p.2／p.3。

### 產出

1. 英文正典 → `data/canon/`（三類：abilities/ conditions/ features/，另有 _normalized/ 存雜湊計算對象）
   實際採用的 schema 以**現有 28 個條目為準**，差異見指南 §4.3–4.3.2 與 **§4.7**：
   `distance` 已結構化且含 `choice`（二選一）；`potency.characteristic` 逐招式不同；
   `followUpActions` 與 `extraCosts` 是兩種不同東西；`cost` 沒有費用一律 `null`；
   **`powerRoll.characteristic` 可能是字串也可能是二選一物件**（基礎打擊）；
   **`feature` 這個新 type 用「章節 → 區塊」結構**，與招式完全不同
2. 中文譯文 → `data/zh-Hant/`（與 canon 同構逐段對應；名稱權威在此，glossary 只放 entityRef）
3. 精確術語依賴清單 → `releases/m0.json`（**須涵蓋全部 M0 發布文字**，含三教團與怒火說明）
4. 對齊報告 → 照 `docs/alignment/` 的格式（三維度標記見指南 §8.1）
5. 未決術語 → `data/decisions.json` 的 `pending`（**不要直接改生成檔**）

---

## 術語批次裁決

`docs/term-review-queue.md` 已產出。
**A、B 段已於 2026-07-28 裁決完畢並套用。** C 段（346 條低頻）仍未審，依原判斷暫不處理。

⚠️ **一個已知的分段漏洞**：清單依「該中文譯名在舊語料出現幾個檔案」排序。舊 CSV 的 zh-tw 欄
若寫成「方格/格」這種一欄兩候選，該字串從未原樣出現，計數 0，會被丟到「建議暫不處理」的 C 段——
但它可能是 M0 每張卡都要用的詞。已補裁決的三條：`Square`＝格、`Distance`＝射程、
`Natural 19 or 20`＝天然 19/20。**C 段不等於「不重要」，抽取時發現缺詞要隨時回頭補裁。**

重新產生清單：`node scripts/report-term-frequency.mjs`（唯讀，不動 data/）

---

## Git 現況（2026-07-29 建立）

```
remote    https://github.com/boyiad2110/ds-site-zh-hant.git （private）
branch    main（已追蹤 origin/main）
baseline  a86aba9  chore: establish M0 data and localization baseline
```

**專案已納入版本控制。** 之後修改資料時：

1. 照常改 `data/decisions.json` → 重跑生成 → `validate-terms --commit`
2. **commit 前必須跑完整驗證**：`node --test`、`validate-terms`、`verify-canon-hash`
3. `data/id-ledger.candidate.json` 已被忽略（執行中途的暫存檔，提升後即刪）

### 🔒 這個 repository 必須維持 private

`data/canon/` 含約 **2,200 字官方英文逐字規則原文**，`docs/alignment/` 另引用多處作三欄對照。
**「已排除 PDF」不等於「不含官方內容」。** 日後若考慮公開，須先另做授權與內容範圍審查。

刻意不納入版控（理由寫在 `.gitignore` 各段註解）：
官方 PDF、官方字型、由 PDF 算繪的頁面圖像、原始 Notion 匯出、review 用的 `*.patch`、`.claude/settings.local.json`。

> `.gitattributes` 鎖定 LF：`normalizedHash` 是偵測正典漂移的核心機制，
> 換行符隨作業系統飄動會讓同一份內容算出不同雜湊。**不要移除。**

---

## ⚠️ 驗證邊界（2026-07-28 外部 review，**開工前必讀**）

### 邊界一：懲戒者的成功不等於全遊戲適用

**已驗證**：懲戒者一級 14 招式、9 個狀態、目前遇到的招式結構與版式。
**未驗證**：其他職業、其他資料類型是否會出現沒看過的欄位、規則組合或版面。

**真正的風險不是抽取失敗，而是過早認定 schema 已完整**——
之後為了把新規則塞進舊結構，反而改變原文語意。

2026-07-29 抽的基礎打擊、三教團、怒火說明**本身就是不同的資料類型**，
教團與怒火還需要一個全新的 `feature` 型別。這條邊界已被實際踩到一次。

**做法**：不必擴張驗證規模。**第一次遇到新資料類型或明顯不同的版式時，
先用一個代表樣本確認即可**，不必重做整套方法驗證。若該樣本出現 schema 裝不下的東西，
**先問擁有者，不要自行擴大解釋既有欄位**。

> 已實際發生三次過度概括：
> (1) 只掃 p.3／p.5 就寫「14 個招式只有三種距離形狀」——p.6 出現第四種。
> (2) 用錯來源判斷狀態文字，產生假指控（紀錄見 `docs/alignment/conditions.md`）。
> (3) 2026-07-29 照來源 PDF 的頁面內容決定範圍，多做了不屬 M0 的條目
>     （紀錄見 `docs/alignment/m0-batch2-results.md`）。

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
| **`powerRoll.characteristic` 可能是字串或物件** | 近戰／遠程武器基礎打擊（2026-07-29 新增） |
| **`feature` 的「章節 → 區塊」結構** | 教團、怒火、審判教團利益（2026-07-29 新增） |
| **`definitionList` 的 `marker` 兩種版式** | 教團（無符號懸掛縮排）對 審判教團利益（項目符號） |

**做法**：不阻擋目前的 M0 資料整理。但**在大量擴張資料之前，保留一個小型網站驗證點**——
實際讀取一個懲戒者招式頁面，確認上述結構能被正確顯示與操作。
建議樣本：**審判**（四選一）＋**淨化聖火**（二選一射程＋效力＋狀態連結），兩個涵蓋五項。

---

## 資料來源的排除清單（不得重新開啟）

| 來源 | 狀態 | 依據 |
|---|---|---|
| Foundry VTT `draw-steel` 系統 | ❌ **不採用** | 其 `LICENSE.md` 明文：內容為 MCDM 單獨授權，**Creator License 不適用**；GitHub 標示 `NOASSERTION` |
| Forge Steel | ❌ 不採用 | GPL-3.0，避免授權混合 |
| Steel Compendium | ❌ 不採用 | `NOASSERTION` |
| `DrawSteelRulesReferenceV1.pdf` | ❌ **本階段完全不使用** | 擁有者 2026-07-29 裁定（見 `docs/scope.md` 裁決 #1）。PDF 已從本機移除。曾誤用的事故紀錄見 `docs/alignment/conditions.md` |

**唯一內容來源：`sources/official/Draw_Steel_Heroes_v1.01/` 的官方 PDF。**

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

### 2026-07-29 新增的兩項待裁

| # | 事項 | 情形 | 工作量 |
|---|---|---|---|
| 1 | **要不要統一 `_normalized/*.txt` 的大小寫慣例** | 同一批正典並存兩種寫法：4 個照 PDF 原樣（`actionType: Main action`）、10 個全小寫（`actionType: main`）。**功能沒壞**（hash 逐檔比對），但同一份資料兩套寫法。統一會讓那 10 個 hash 全部改變 | 改 10 個檔＋10 個 hash |
| 2 | **`validate-terms` 的實體存在性檢查沒有真的看 `data/canon/`** | 它每次都警告「`condition.bleeding` 指向尚未建立的實體」，但那 9 個狀態實體**早就建立了**。原因是它的 `known` 只裝 glossary／vocabulary 的 id，從不掃 `data/canon/`，靠 allowlist 讓它降級成警告。**這正是本專案最怕的「檢查走錯路徑」**——只是這次方向相反，是誤報不是漏報 | 詞彙系統已凍結，故未動；要不要修由擁有者決定 |

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

改完 `data/decisions.json` 後**四個都要跑**，順序不可顛倒：

```bash
node scripts/build-vocabulary.mjs        # 先重建詞彙表
node scripts/import-glossary.mjs         # 再重建術語表
node scripts/validate-terms.mjs --commit # 驗證並提升 ledger
node scripts/build-m0-release.mjs        # 重建 releases/m0.json
```

> ⚠️ 只跑其中一部分會被 `stale-decisions-hash` 擋下（實際發生過：只重跑 glossary 沒重跑
> vocabulary，5 項硬性失敗）。**那是機制正常運作，不是壞掉。**

驗證：

```bash
node --test "scripts/**/*.test.mjs"   # 89 tests
node scripts/verify-canon-hash.mjs    # 正典內容指紋
node scripts/report-m0-terms.mjs      # 唯讀：術語用量掃描報告
```

目前基線（**2026-07-29 第 6 步收盤**）：
glossary **606**（approved **259**）、vocabulary **23** 值（5 個詞彙表，全部 approved）、
ledger **625**、pending **2**（Hakaan／Memonek）、測試 **89/89**、
正典 **28** 條目＝**16 招式 ＋ 9 狀態 ＋ 3 特性**（指紋全部相符）、
中文實體 **9** 個狀態（**中文側尚未跟上其餘 19 條**）、
translation-issues **7** 項全 resolved、
`releases/m0.json` **111** 個依賴術語（全部 approved，來源指紋 `777dee09e302be26`）。

### 術語掃描的三個通道（`scripts/lib/m0-scan.mjs`）

`report-m0-terms.mjs` 與 `build-m0-release.mjs` **共用同一份掃描**，不會各說各話。

| 通道 | 來源 | 可信度 |
|---|---|---|
| A · 受控值 | `keywords`／`actionType`／`abilityCategory`／`potency.level` 等結構欄位 | 確定性，免複核 |
| B · 散文文字比對 | 招式敘述、狀態說明、特性段落 | **必然有假命中**，每筆留上下文 |
| C · 疑似缺詞 | 把命中遮掉後剩下的規則用語 | 需人工判斷 |

**結構型詞彙表**（效力等級、招式分類、招式關鍵詞）的英文是常見英文字，
刻意**不參與**散文比對——它們本來就由通道 A 確定性取得。

三個「不算數」的出口，**每筆都必須寫理由**：

| 機制 | 用途 |
|---|---|
| `EXCLUSIONS` | 整個詞全域排除（目前只有 `Line`） |
| `OCCURRENCE_EXCLUSIONS` | 逐處排除——同一個詞在某些條目是術語、在另一些是普通英文字 |
| `SENSE_ASSIGNMENTS` | 詞義分裂（同一英文多個 sense）時逐筆指定；**未指定會中止產生，掃描器不猜** |

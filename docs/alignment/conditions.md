# 對齊報告 — 9 個狀態 Conditions

> 2026-07-28。**狀態：已裁決完畢。**
>
> **來源**：`sources/official/Draw_Steel_Heroes_v1.01/03-class-and-abilities.pdf` **p.9（印刷頁 77）**
> **方法**：`pdftotext -layout` 分欄裁切抽取 ＋ 同頁 150dpi 裁切算繪核對 ＋ 舊 Notion 狀態列表交叉驗證

```
抽取   verified   9 個狀態逐段比對，文字與圖像完全一致
正典   data/canon/conditions/condition.*.json（9 檔）
證據   docs/alignment/evidence/conditions-heroes-p9-150dpi.png
hash   ✅ 23 個正典條目全部相符（14 招式 + 9 狀態）
```

---

## 🔧 首先：我抽錯來源了，一個指控要撤回

**本報告的第一版用了 `DrawSteelRulesReferenceV1.pdf` p.4 作為正典來源。那是錯的。**

擁有者指出：舊譯全部依 **Heroes v1.01** 翻譯，不是 Rules Reference。
指南 §1 的權威順序第一位本來就寫 `sources/official/Draw_Steel_Heroes_v1.01/*.pdf`，
Rules Reference 從來不是正典來源——**是我沒照自己文件裡的規則挑來源。**

### 被撤回的指控：出血 Bleeding

第一版把出血標為 `mismatch` 🔴，說舊譯多了一句原文沒有的規則：

```
舊譯   （無法透過任何方式避免，而且每個動作只會失去 1 次體力）
```

**Heroes v1.01 印刷頁 77 的原文：**

```
This Stamina loss can’t be prevented in any way, and only happens once per action.
                                                  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
```

**舊譯是正確的。** 那句話在 Heroes 裡確實存在，只是 Rules Reference V1 沒有。
150dpi 圖像已核對（見證據圖左欄 Bleeding 段末）。

**指控撤回。出血改判 `exact`。** 已重新以 Heroes 為來源產生全部 9 個正典條目。

> 這個錯誤本來會讓你去刪掉一句正確的譯文。記錄在此以免重演：
> **抽任何條目前，先確認來源分冊是 Heroes，不是 Rules Reference。**

---

## 📌 連帶發現：Heroes v1.01 與 Rules Reference V1 的內容**確實不同**

不是排版差異，是文字差異。同一批狀態，兩份官方文件至少 8 處不一樣：

| # | 狀態 | Heroes v1.01（正典） | Rules Reference V1 |
|---|---|---|---|
| 1 | 出血 | `…in any way, **and only happens once per action.**` | 沒有這個子句 |
| 2 | 出血 | `test or ability **roll**` | `test or ability **power roll**` |
| 3 | 出血 | `a signature **ability** used as…` | `a signature **attack** used as…` |
| 4 | 出血 | `when you use a main action **off your turn**` | `…a main action **you use** off your turn` |
| 5 | 擒制 | **`A grabbed creature` can attempt to escape** | **`A creature targeted by an effect that would grab them`** can attempt to escape |
| 6 | 擒制 | `both creatures are **not** adjacent` | `both creatures are **no longer** adjacent` |
| 7 | 擒制／伏地 | 有章節交叉參照 `(see Maneuvers in Chapter 10: Combat)` | 沒有 |
| 8 | 引言 | `…character sheet **when they affect your hero**.` | `…character sheet.` |

**第 5 項是真正的規則差異**，不是文字潤飾：Heroes 說「已經被擒制的生物」可以嘗試掙脫，
Rules Reference 說「被將要擒制自己的效果指定為目標的生物」可以嘗試掙脫。時機不同。

**處置**：正典一律以 Heroes v1.01 為準（指南 §1 權威順序）。Rules Reference 不進 `data/canon/`。
此差異僅記錄於此，供日後官方勘誤時參考。

---

## 抽取上的一件事

Heroes 這頁是**雙欄**（不像 Rules Reference 是三欄橫式）。
`-layout` 直接抽會把右欄的行首字元截掉，需用 `-x 300 -W 303` 裁切右欄才完整。

九個狀態的實際排列：

```
左欄  Bleeding  Dazed  Frightened  Grabbed
右欄  Prone  Restrained  Slowed  Taunted  Weakened
```

150dpi 圖像已核對這個順序與每一段文字。

---

## 逐條對齊

| 狀態 | 英文 | 對齊 | 說明 |
|---|---|---|---|
| 出血 | Bleeding | `exact` | **原判 mismatch，已撤回**（見上） |
| 暈眩 | Dazed | `exact` | |
| 畏縮 | Frightened | `exact` | |
| 伏地 | Prone | `exact` | |
| 束縛 | Restrained | `exact` | |
| 緩速 | Slowed | `exact` | 「除非你的速度已經 < 2」＝ “unless their speed is already lower” |
| 嘲諷 | Taunted | `exact` | |
| 虛弱 | Weakened | `acceptable` | 見 PN-2 |
| 擒制 | Grabbed | `acceptable` | 見 PN-1 |

**沒有任何 `mismatch`。** 九個中文名（出血／暈眩／畏縮／擒制／伏地／束縛／緩速／嘲諷／虛弱）
與英文完全對得上，**一個都不用改**。

---

## 🟡 PN-1 · 擒制 Grabbed — 兩處小差異

**(a) 舊譯多了「在自己回合」**

```
  原文    A grabbed creature can attempt to escape being grabbed using the
          Escape Grab maneuver (see Chapter 10: Combat).
  舊譯    你可以在自己回合使用掙脫機動動作來嘗試脫離。
                 ~~~~~~~~~
  判斷    原文未限定回合。機動動作本來就在自己回合用，舊譯可能是為讀者好懂而補，
          但屬補充而非翻譯。
```

**✅ 裁決**：刪掉「在自己回合」。定稿：「你可以使用掙脫機動動作來嘗試脫離。」（`data/translation-issues.json` TI-1）

**(b) 「abilities」對「招式檢定」**

```
  原文    takes a bane on abilities that don’t target the creature, object,
          or effect that has them grabbed
  舊譯    對擒抱者以外的目標進行的任何招式檢定都會承受 1 個劣勢
  判斷    原文寫 abilities（招式），舊譯寫「招式檢定」（ability rolls）。
          官方在「束縛」條寫的確實是 ability rolls，兩處用詞不同——
          可能是官方自己的不一致，也可能是刻意區分。標 uncertain，不自行歸一。
```

**✅ 裁決**：維持舊譯「招式檢定」，疑點記錄於 `data/translation-issues.json` TI-2，待官方勘誤釐清。AI 不得自行歸一官方兩處不同的用詞。

---

## ⚪ PN-2 · 虛弱 Weakened — 「任何」為原文所無

```
  原文    A creature who is weakened takes a bane on power rolls.
  舊譯    你進行的任何檢定都會承受 1 個劣勢。
                  ~~
  判斷    原文只說 power rolls，舊譯加「任何」。語意未擴大（power rolls 本就泛指），
          屬語氣補強。⚪ low，不阻擋。
```

**✅ 裁決**：維持舊譯（TI-3）。

---

## ✅ 已裁決 · 人稱（全域通則）

**九個狀態的原文全部是第三人稱**（“A creature who is dazed…”），
**舊譯全部是第二人稱**（「若你處於暈眩狀態…」）。

指南 §7 目前寫「第二人稱『你』與原文一致」——那條是針對招式寫的（招式原文確實用 you）。
狀態的原文不是。

這不是九個各別的問題，是**一個全域風格決定**：

| 選項 | 結果 |
|---|---|
| **A. 維持舊譯的第二人稱** | 九條都不用改。與招式語氣一致，讀起來像對玩家說話 |
| **B. 改成第三人稱** | 貼近原文。但九條全要重寫，且與招式的「你」形成語氣落差 |

**✅ 裁決：A —— 規則文本一律用第二人稱「你」，即使原文為第三人稱。**
擁有者理由：**讓玩家更好理解。**

已寫入指南 §7 並記為 `data/translation-issues.json` TI-4。
**此後不再逐條提報人稱差異**，也不列為 `prose-issue`。

---

## 條目狀態

9 個全部 `canonReviewStatus: draft`。

- **規則正文的三項裁決全部完成**（TI-1／TI-2／TI-3／TI-4），記於 `data/translation-issues.json`。
- **中文名九個全部可批准** —— 但這是「狀態實體名稱」的裁決，尚未寫入 `data/decisions.json`；
  待狀態實體正式建立時一併處理，屆時 14 個招式卡著的 `needs-review` 會一起解掉。

---

## 沒有覆蓋的（誠實聲明）

- Heroes `00-the-basic` 的詞彙表另有一句話的索引式摘要（例如出血寫成
  “take 1d6 + level damage whenever they use a maneuver or triggered actions…”，
  **連觸發條件都與印刷頁 77 的正文不同**）。那是索引不是規則，**我未逐字比對**，也未納入正典。
  若日後要做全書一致性檢查，這是一個已知的差異點。
- 舊譯的內部連結（起身、擊退、掙脫、擒抱…）指向舊 Notion 頁面，
  **未驗證這些連結目標的譯名是否與已批准術語一致**。
- 9 個狀態的 `entityRef` 仍在 `validate-terms` 的 allowlist 警告清單中——
  驗證器比對的是術語表 id，不會去讀 `data/canon/`。要讓它真的解析到這些實體需要改驗證器，
  **詞彙系統已凍結，我沒有動它**。

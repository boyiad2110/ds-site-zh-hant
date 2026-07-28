# Review 交付說明 — 詞彙系統最小收尾與凍結

> 2026-07-28。依 Reviewer 指定的四項收尾完成，**詞彙系統至此凍結**，下一步進入 M0 正典抽取。
> patch 為 new-file diff（專案尚未納入版本控制），已通過 `git apply --check`。

---

## 本輪四項修正

### 1. Pending 必須辨識 sense

```js
glossary   → `glossary|${en.toLowerCase()}|${sense ?? ''}`
vocabulary → `vocabulary|${vocabulary}|${value}`
```

批准某個 sense 不再誤清其他 sense 的 pending。

> **副作用**：測試 41 原本以「無 sense 的裁決」清除「有 sense 的 pending」，在新規則下不再成立。
> 這是舊規則寫的測試，已修正測試而非放寬行為。

### 2. Split／merge 必須明確 approved

`applyApproval()` 先前**無條件**把條目設為 approved —— 等於程式自行批准。
現在 split 的每個 entry 與 merge 的 decision 都必須 `status === 'approved'`，否則：

```
[multi-resolution-not-approved]
```

缺 status 或 `needs-review` 皆不套用、不移除 pending。

### 3. Glossary decisions 不得以英文互相覆蓋

原本 `new Map(decisions.glossary.map(d => [d.en.toLowerCase(), d]))` 會讓同英文的後者靜默取代前者。

改為 `en → 裁決陣列`，取用時：

- 0 筆 → 無裁決
- 1 筆 → 套用
- **多筆 → `[ambiguous-glossary-decision]` 失敗**（來源列無 sense 資訊，無法唯一對應；多義詞應改用 `multiTranslations`）

另偵測 `(en, sense)` 重複 → `[duplicate-glossary-decision]`。

### 4. 統一 `categories` schema

所有 glossary 條目一律使用 `categories: string[]`，包含**只存在於 decisions、不在舊 CSV 的項目**（先前輸出單數 `category`）。

驗證器新增 `[schema-invalid]`：`categories` 必須存在且為字串陣列；不得再出現舊欄位 `category`。

---

## 驗收

| Reviewer 驗收項 | 測試 | 結果 |
|---|---|---|
| 1. 不同 sense 的 pending 不互相清除 | 52 | ✅ |
| 2. `needs-review`／缺 status 的 split／merge 不被升為 approved | 53、54 | ✅ |
| 3. 相同英文的多個 sense 不再靜默覆蓋 | 55 | ✅ |
| 4. 所有 glossary 條目統一使用 `categories` | 56、57 | ✅ |
| 5. 現有正式裁決完全未變 | — | ✅ 11 項 approved 未改動 |
| 6. Fire／Hakaan／Memonek／Order 仍未裁決 | — | ✅ `multiTranslations` 與 `tombstones` 皆為 0 |
| 7. 既有與新增測試通過 | — | ✅ **74 / 74** |

新增代號僅三個（沿用最少必要原則）：`multi-resolution-not-approved`、`ambiguous-glossary-decision`、`duplicate-glossary-decision`、`schema-invalid`。

---

## 最終狀態

```
glossary   595 條（approved 4 / needs-review 591）
           id: stable 589 / provisional 6，全部使用 categories 陣列
vocabulary 4 表 18 值（approved 7 / needs-review 11），idStatus 全為 stable
ledger     607 = 589 glossary + 18 vocabulary
pending    4：Order（missing-term）、Fire／Hakaan／Memonek（multiple-translations）
測試       74（單元 14 + 整合 60），全數通過
```

重現：

```bash
node --test "scripts/**/*.test.mjs"
node scripts/build-vocabulary.mjs
node scripts/import-glossary.mjs
node scripts/validate-terms.mjs --commit
```

已驗證：刪除 `data/id-ledger.json`、`data/glossary-pending.json` 後可完整從零重建，輸出位元相同。

---

## 本輪刻意不做（依 Reviewer 指示記錄為未來風險）

以下問題確實存在，但目前 tombstone 尚未實際使用、無外部系統引用 id、repository 私有、維護者僅一人，因此**不再加固**：

- tombstone 指向從未存在 id 的完整歷史驗證
- retired id 永久保留與防止未來重用
- migration 歷史系統
- 更複雜的 ledger state
- `ledger-candidate-invalid` 各分支的獨立測試（目前由測試 49 連帶觸發）

---

## 詞彙系統凍結

此後不再進行逐輪資料安全加固。下一步：**M0 正典抽取**（規劃 §14.5 第 5 步）。

後續三個里程碑閘門的檢查重點依 Reviewer 所訂：

| 閘門 | 重點 |
|---|---|
| M0 正典抽取 | 頁面正確性、算繪證據充分性、欄位是否漏抽、結構化是否忠於原文、待裁決術語清單 |
| M0 schema | 是否足以表達實際招式、有無單案例硬編碼、能否支援搜尋／篩選／卡片、有無不必要抽象 |
| M0 UI | Draw Steel 產品個性、是否像工具而非文件站、中文搜尋實際可用性、真人任務式測試 |

共同原則：**先問「這一步是否必要？投入是否與目前風險相稱？」**

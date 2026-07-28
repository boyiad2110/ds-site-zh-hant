# M0 術語裁決紀錄（已全數結案）

> 2026-07-29。來源：`node scripts/report-m0-terms.mjs` 掃描 `data/canon/` 28 個條目的結果。
> **本檔已全部裁決完畢**，保留作為「當初為什麼這樣決定」的紀錄。
>
> - 目前的依賴清單：`releases/m0.json`
> - 目前的掃描結果：`docs/m0-term-dependency.md`（每次重跑都會覆蓋）
> - 正式的裁決資料：`data/decisions.json`（每筆的 `note` 寫著理由）

---

## 一、照舊譯批准（6 項）

擁有者 2026-07-29 一次批准，理由是舊語料用法一致且數量充足。

| 英文 | 中文 | 出現在 | 舊譯強度 |
|---|---|---|---|
| `Charge`（招式關鍵詞） | 衝鋒 | 近戰武器基礎打擊 | 16 個檔案 |
| `Vertical Pull` | 垂直拉動 | 典範教團的審判利益 | 15 個檔案 |
| `Read Person`（技能名） | 觀色 | 驅邪教團授予的技能 | 14 個檔案，舊技能表有正式條目 |
| `Lead`（技能名） | 領導 | 典範教團授予的技能 | 29 個檔案 |
| `Victories` | 勝利值 | 怒火說明 3 處 | 30 個檔案 |
| `Strike Now` | 快出手 | 出血狀態引用的戰術家招式 | 21 個檔案 |

**`Victories` 最後沒有動資料**——它只是 `Victory` 的複數，中文本來就是「勝利值」。
真正該修的是掃描器不認規則複數，已修正並加迴歸測試。

**`Strike Now` 去掉了驚嘆號。** 擁有者查對原版規則書後確認原文多數不帶驚嘆號。
⚠️ 這只針對舊譯自行添加的驚嘆號；原文本身就有的（`Halt Miscreant!` 等）照原文保留，見指南 §6.1。

**`Charge` 換了所屬的表。** 它原本是 glossary 的「主要動作」條目，但基礎打擊卡上它是招式關鍵詞，
系統禁止同一英文在兩表都有權威譯名。擁有者裁定歸到 `ability-keywords`，
與近戰／遠程／打擊／武器一致；譯名「衝鋒」未變，舊 id 以 tombstone 留存。

## 二、沒有現成答案，擁有者決定（4 項）

| 英文 | 中文 | 說明 |
|---|---|---|
| `basic`（招式分類） | **通用** | 基礎打擊不屬任何範型，需與招牌／英雄／固有並列的第四種分類 |
| `Director` | **GM** | 舊語料 241 個檔案一律直接寫 GM，從未翻譯 |
| `Quick Build` | **推薦選項** | 舊語料無固定譯法 |
| 章節交叉參照 | **M0 純文字、M1 換連結** | 見下 |

**章節交叉參照**：原文有「see Maneuvers in Chapter 10: Combat」這類指向紙本的參照，共 3 句。
擁有者原本選「改成網站內連結」，但三個連結目標（擊退、掙脫擒抱、起身）都不在 M0，
連結一上線就是斷的。改為 **M0 只譯出動作名稱、不加連結也不留「見第 10 章」字樣，M1 收入那三張卡後再改**。
記於 `data/translation-issues.json` 的 TI-5／TI-6／TI-7。

## 三、外部 review 指出的三個語意假命中（已修正）

2026-07-29 外部 review 在 `releases/m0.json` 發現：

| # | 問題 | 修法 |
|---|---|---|
| 1 | `term.fire.elementalist-mastery`（烈火）被誤用於「淨化聖火」——該招式只有 fire weakness／fire damage，屬傷害類型 | 掃描器遇到**詞義分裂**不再自動歸屬，改為中止並要求逐筆指定（`SENSE_ASSIGNMENTS`） |
| 2 | 教團說明裡的 `Magic` 是技能名，卻共用了 `ability-keyword.magic` 的 id | 標記結構型詞彙表退出散文比對；另新增獨立詞條 `term.magic.skill`（見下） |
| 3 | 「a strong example」「the weak will be corrupted」被當成效力等級 Strong／Weak | 同上——效力等級只由 `tiers[].potency.level` 這個結構欄位取得 |

**每一項都補了迴歸測試，並以突變測試確認測試真的抓得到。**

### `Magic` 拆出獨立詞義（擁有者 2026-07-29 批准）

```
ability-keyword.magic   魔法   招式關鍵詞（標示這是魔法招式）
term.magic.skill        魔法   技能名稱（神諭教團授予）
```

中文相同，概念不同，**id 不得共用**。

這撞到 `dual-authority` 硬性失敗——該規則只比對英文字面、忽略 `sense`，
寫不出「同一個字、不同概念」。已放寬為「明確帶 `sense` 才放行」，
**沒有 `sense` 的同名條目照樣硬性失敗**，範圍刻意很窄。上下界各有一個測試守住。

加入後又發現它的 `usedBy` 是錯的：flavor 裡的「holy magic」「magic strike」是普通名詞，
不是技能名。原本的排除機制只能整個詞全域排除，會連真正的技能名一起殺掉，
故新增**逐處排除**（`OCCURRENCE_EXCLUSIONS`，指定「哪個詞在哪個條目不算數」）。

## 四、判定為假命中、不計入依賴的

| 詞 | 理由 |
|---|---|
| `Line`（線形） | Line 是 Area 的一種有效範圍形狀，**本身是有效術語**，只是 M0 這 28 條還沒用到；之後的招式會用到。目前掃到的 4 處全是假命中：3 處是 `line of effect`（＝效果線，另有條目），1 處是「in a straight line」的日常用法 |

理由同時寫在 `releases/m0.json` 的 `exclusions` 欄位，隨清單一起版控。

## 五、狀態詞的可追溯性（review 要求確認）

9 個狀態的中文名**刻意不存在 glossary**——名稱權威在狀態實體，兩處都放會變成雙重權威。
先前這造成 `releases/m0.json` 裡那 9 筆「有 id、沒中文」，無從追溯。

現在循 `entityRef` 解析到 `data/zh-Hant/conditions/`，每筆帶 `nameFrom`：

```json
{ "id": "term.slowed", "zhHant": "緩速",
  "nameFrom": { "entityRef": "condition.slowed", "entityStatus": "reviewed", "reviewedBy": "owner" } }
```

清單中 `zhHant` 為 undefined 的條目：**0**。解不出中文名會中止產生，不會靜默略過。

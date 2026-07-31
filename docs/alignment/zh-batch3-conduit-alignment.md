# M1 Batch 3 對齊報告——神導士一級（舊譯／新譯實質差異對照）

> 建立於 2026-07-31，回應 Reviewer 第二層複核要求。
> 格式：以條目為單位；完全沿用舊譯者標記「無實質改動」；有修改者列出舊文、新文與理由。
> **不列**純標點、反引號、全形／半形空格、階層符號等格式差異——那些一律視為排版級自動歸一（指南 §10），不進本表。
> 舊譯來源一律在 `sources/notion-export/class-notion/conduit/`，各條目的確切檔名見對應資料檔 `meta.translationSource`。

---

## 0. 範圍與統計（可從 `releases/milestones/m1.json` 重新數出來，不是憑印象寫的）

M1 milestone 共 **41** 個條目。其中 **4 個屬 M1 Batch 2、本輪完全未觸碰**（虔誠、禱詞、審判之鎚、忠誠好友，`canonReviewStatus`／`meta.status` 早已 `verified`／`reviewed`），不列入本表比對範圍。

本表涵蓋 **Batch 3 本輪處理的 37 個條目**（2026-07-31 Reviewer 第二輪複核後：治癒恩典由「無實質改動」改列「有實質修改」；原單一條目 `feature.conduit.conduit-abilities` 拆成 3 個依實際印刷頁分段的條目）：

| 分類 | 筆數 |
|---|---|
| 無實質改動（僅格式歸一、術語套用或段落結構調整，見 §1） | 22 |
| 局部混合（同一條目內部分領域無改動、部分有修改，見 §2.0） | 1（`feature.conduit.domain-piety-and-effects`） |
| 有實質修改（整條目層級，見 §2.1–2.3） | 11 |
| 新增條目（無單一對應舊譯來源，見 §3） | 3（`feature.conduit.conduit-abilities`／`triggered-action`／`heroic-abilities`） |
| **合計** | **37** |

`22 + 1 + 11 + 3 = 37`，`37 + 4（Batch 2，未列入）= 41`（M1 milestone 總數）。

---

## 1. 無實質改動（22 筆）

以下條目的規則文字（`effect`／`trigger`／`extraCosts`／`powerRoll.tiers[].text`）與舊譯逐句相符，僅套用既有格式規則（inline code、N-1/N-2 分號合併、階層徽章）與**既有已核准術語套用**（下方另行說明，不算討論中的「修改」）：

| 條目 | 英文 |
|---|---|
| 賜福聖光 | Blessed Light |
| 奪元術 | Drain |
| 天降光霖 | Lightfall |
| 犧牲奉獻 | Sacrificial Offer |
| 恍惚詛咒 | Staggering Curse |
| 勇士禱詞 | Warrior's Prayer |
| 凋零箭 | Wither |
| 引導之聲 | Word of Guidance（僅 `abilityCategory` 由草稿初版的 `reaction` 訂正為 `inherent`，屬受控欄位、非翻譯文字） |
| 審判之聲 | Word of Judgment（同上） |
| 喚雷降世 | Call the Thunder Down |
| 暴力無濟於事 | Violence Will Not Aid Thee |
| 腐化詛咒 | Corruption's Curse |
| 恐懼詛咒 | Curse of Terror |
| 神恩護體 | Faith Is Our Armor |
| 神怒光束 | Ray of Wrath |
| 墳墓低語 | Grave Speech |
| 通曉祝福 | Blessing of Comprehension |
| 溫慈祝福 | Blessing of Compassion（草稿曾一度改譯「慈愛祝福」，Reviewer 複核後已改回舊譯原名，最終與舊譯完全一致） |
| 聖化武器 | Sanctified Weapon（僅「長休」→「休整」術語套用） |
| 晨光庇護 | Inner Light（同上） |
| 晦澀異象 | Oracular Visions（僅段落拆分＋休整術語套用，文字未改） |
| 1 級領域特性 | 1st-Level Domain Feature（僅表格從 1 列擴充為 12 列，導言與自然列沿用 Batch 2 已核准文字未動；新增 11 列為「[特性或招式](id)（技能組）」formulaic 格式，非需比對的散文翻譯） |

> **休整術語套用說明**：`Respite＝休整` 是既有 approved 術語（`data/translation-issues.json` TI-18），舊譯一律寫「長休」。本批凡出現 Respite 的條目（神導士護咒、聖化武器、晨光庇護、晦澀異象、天氣祝福、活力儀式）都做了這個套用。這是套用既定裁決，不是本批新裁決，為避免重複，僅在此統一說明一次。

---

## 2.0 局部混合：領域虔誠與禱詞效果（Domain Piety and Effects）

本條目由 1 段導言 + 12 個領域構成。**8 個領域與舊譯逐句相符**（創造、死亡、命運、知識、慈愛、自然〔沿用 Batch 2〕、詭術、以及導言兩段），**4 個領域有實質修改**：

| 領域 | 欄位 | 舊譯 | 新譯 | 理由 |
|---|---|---|---|---|
| 生命 Life | 禱詞效果 | …或可以從伏地狀態起身。**此外**，你自己或 10 格內的 1 個盟友會獲得等於你`直覺` ×2 的`臨時體力`。 | …或可以從伏地狀態起身。**或者**，你自己或 10 格內的 1 個盟友會獲得等於你`直覺` ×2 的`臨時體力`。 | 正典為「Alternatively」（二選一），舊譯誤譯為「此外」（疊加語意），Reviewer 複核指出 |
| 守護 Protection | 虔誠 | …或讓敵人的檢定承受**劣勢**時 | …或讓敵人的檢定承受**劣勢或雙劣勢**時 | 正典「to impose a bane or double bane on an enemy's power roll」，舊譯漏譯「or double bane」 |
| 風暴 Storm | 禱詞效果 | 每個敵人都會受到你`直覺` ×2 的閃電傷害 | 每個敵人都會受到**等於**你`直覺` ×2 的閃電傷害 | 補回舊譯省略的「等於」，與其他領域「等於你`直覺` ×N」的既定行文一致，不改變倍率數值 |
| 戰爭 War | 虔誠 | …在單一回合內受到 10 + 你等級的傷害時 | …在單一回合內受到**超過** 10 + 你等級的傷害時 | 正典「damage greater than 10 + your level」，舊譯漏譯「greater than」 |

另有 1 處**術語套用**（非討論中的修改）：守護領域「uses a triggered action」舊譯誤寫「觸發式動作」，已依附錄 A 既有裁決訂正為「反應動作」。

---

## 2.1 客觀數值／屬性訂正（5 筆，Reviewer 複核、擁有者已確認）

| 條目 | 欄位 | 舊譯 | 新譯 | 理由 |
|---|---|---|---|---|
| 神聖鞭笞 Holy Lash | 第 3 階效果 | 垂直拉動 3 | 垂直拉動 4 | 正典（pdfPage 6／printedPage 99）為「vertical pull 4」，-layout 文字抽取與 150dpi 圖像 `out/conduit/page-06.png` 雙重核對，舊譯數值錯誤 |
| 造物之手 Hands of the Maker | 效果 | 數量等於你的`氣場` | 數量等於你的`直覺` | 正典（pdfPage 4／printedPage 97）為「equal to your Intuition score」，`out/conduit/page-04.png` 核對，舊譯屬性錯誤 |
| 神導士護咒·靈敏護咒 Quickness Ward | 效果 | 遁移最多等於你`直覺` ×2 的格數 | 遁移最多等於你`直覺`的格數（無倍率） | 正典（pdfPage 6／printedPage 99）為「shift up to a number of squares equal to your Intuition score」，無 ×2，`out/conduit/page-06.png` 核對，舊譯多寫倍率 |
| 靈光詐現 Inspired Deception | 效果 | 用`氣場`取代 | 用`直覺`取代 | 正典（pdfPage 5／printedPage 98）為「you can use Intuition」，`out/conduit/page-05.png` 核對，舊譯屬性錯誤 |
| 活力儀式 Revitalizing Ritual | 效果 | `復元值`會獲得 +1 加值（固定值） | `復元值`會獲得等於你等級的加值 | 正典（pdfPage 5／printedPage 98）為「a bonus...equal to your level」，會隨等級成長；1 級時數值恰好相同（+1），但規則本身不同，`out/conduit/page-05.png` 核對 |

## 2.2 舊譯遺漏或誤譯的補正（4 筆，本輪逐字複核另外抓到，供擁有者知悉）

| 條目 | 欄位 | 舊譯 | 新譯 | 理由 |
|---|---|---|---|---|
| 神明與領域 Deity and Domains | 第 1 段 | 請參考「諸神 & 宗教」，選擇 1 位你信奉的神明或聖者。（僅 1 句） | 從《諸神與宗教》的內容中，選擇 1 位你的角色信奉的神明或聖者，或向你的`GM`詢問你的戰役世界中有哪些神祇。經`GM`許可，你也可以自創屬於自己的神明，並選擇 4 個領域作為祂的神職範疇。 | 舊譯漏譯「或向 GM 詢問戰役世界神祇」「經 GM 許可可自創神明並選 4 個領域」整段規則（正典 pdfPage 2／printedPage 95），本批依正典全新起草補齊 |
| 守護結界 Protective Circle | 效果 | 你必須指定 1 個生物。只有該生物可以進出結界；…或是**直接**解消它（無需動作）。 | 你在繪製結界時指定的生物可以進出此區域（不限定僅 1 個）；…或是**直到**你解消它（無需動作）。 | (1) 正典「Only creatures you designate（複數）」未明文限定僅 1 個，`out/conduit/page-05.png` 核對；(2) 正典「until you dismiss it」與另兩個 until 子句並列，判斷舊譯「直接」為「直到」之誤植 |
| 天氣祝福 Blessing of Fortunate Weather | 晴朗／多霧／陰天／降水（4 項） | 若使用 [技能] 進行考驗，檢定會獲得 1 個優勢。 | 若使用 [技能] 進行考驗，**你和你的盟友的**檢定會獲得 1 個優勢。 | 正典「You and your allies gain an edge」，舊譯 4 項皆省略「You and your allies」 |
| 治癒恩典 Healing Grace | extraCosts 第 1 個加值選項 | 你可以指定射程內的另一個盟友作為目標。 | 你可以**額外**指定射程內的 **1 個**盟友作為目標。 | 正典「You can target one additional ally within distance」，舊譯「另一個」未明確表達「additional」（額外新增，而非取代原目標）的語意，2026-07-31 Reviewer 第二輪複核指出，已訂正並補上數量「1 個」 |

## 2.3 精確度調整與術語套用（2 筆）

| 條目 | 欄位 | 舊譯 | 新譯 | 理由 |
|---|---|---|---|---|
| 神怒之泉 Font of Wrath | 效果 | 每輪 1 次，當任何敵人首次移動至靈體 2 格內，或在該處開始回合時，他會受到等於你`直覺`的神聖傷害。 | 每個敵人在每個戰鬥輪中首次移動至靈體 2 格內，或在該處開始其回合時，會各自受到等於你`直覺`的神聖傷害。 | 正典「for the first time in a combat round」的限定對象是**每個敵人各自**（同一輪可有多個不同敵人各自觸發），舊句式「每輪 1 次，當任何敵人…」易誤讀成「整個效果每輪只觸發 1 次」。Reviewer 複核指出，重寫消除歧義，語意不變 |
| 恩典布道 Sermon of Grace | 效果／動作類型 | 免費**觸發式動作**；動作類型「**主動動作**」 | 免費**反應動作**；動作類型「**主要動作**」 | 「觸發式動作」為已廢棄舊術語，依附錄 A 既有裁決訂正為「反應動作」（term-applied）；「主動動作」查無此動作類型，判斷為「主要動作」（Main action）之誤植 |

---

## 3. 新增條目（3 筆，無單一對應舊譯）

正典 p.5、p.6、p.8 的「選幾項」規則框架句（Signature Abilities／Triggered Action／Heroic Abilities／3-Piety Ability／5-Piety Ability 的導言），先前只被拆進 `docs/scope.md` 的敘述文字，從未進入 `data/canon`，且第一版草稿把三段內容硬併進同一個條目、來源頁碼只標單一頁。2026-07-31 Reviewer 第二輪複核要求依實際印刷頁拆分為 3 個條目，並用既有 `bulletList`（`lead` + `items[]`，每項為 `[中文名](id)` 站內連結）列出並連結全部選項，不再只是重述「從以下選項中選擇」卻不給出選項本身：

| 條目 | 涵蓋範圍 | 正典來源 |
|---|---|---|
| `feature.conduit.conduit-abilities`（神導士招式） | 職業招式總說明 + 8 個招牌招式（選 2） | pdfPage 6／printedPage 99 |
| `feature.conduit.triggered-action`（反應動作） | 2 個反應動作（選 1） | pdfPage 5／printedPage 98 |
| `feature.conduit.heroic-abilities`（英雄招式） | 英雄招式總說明 + 4 個 3 虔誠招式（選 1）+ 4 個 5 虔誠招式（選 1） | pdfPage 8／printedPage 101 |

逐句取自舊譯（`神導士招式.md`、`觸發式動作.md`）的段落標題與導言，僅 3 處補回舊譯省略的「從以下選項中」（from the following options），並訂正舊譯「5 虔誠招式」段落誤植的「3 點虔誠」為「5 點虔誠」（複製貼上錯誤）。逐句對照見各資料檔 `meta.commonProcessing`。

---

## 4. 術語與建模裁決（本輪已由 Reviewer 複核、擁有者確認定案，不再列為待裁）

| 項目 | 定案 |
|---|---|
| Love 領域中文名 | 慈愛 |
| Trickery 領域中文名 | 詭術 |
| Crafting 技能組 | 工藝類 |
| Lore 技能組 | 學識類 |
| Exploration 技能組 | 探索類 |
| Interpersonal 技能組 | 交涉類 |
| Intrigue 技能組 | 隱密類 |
| Blessing of Compassion 條目名 | 溫慈祝福（沿用舊譯短式） |
| Chapter 14: Gods and Religion | 諸神與宗教 |
| 反應動作的 `abilityCategory` | `inherent`（不新增 `reaction` 分類值） |
| `extraCosts` 的 `options`／`lead`／`open` 新結構 | 接受，M1 沿用 |
| `usageNote` 新欄位 | 接受，M1 沿用 |
| `burst` 區域形狀 | 接受，M1 沿用 |

---

## 5. 複核過但確認無額外問題的項目

以下條目本輪逐句重新核對舊譯與正典，**確認沒有額外的未申報文風改寫**：`Grave Speech`（僅原有的子句順序調整，非本批改動——舊譯本身就是這個排列順序）、`Corruption's Curse`、`Curse of Terror`、`Faith Is Our Armor`（三者數值與效果逐字比對正典與舊譯，完全一致）、`Call the Thunder Down`（數值、效果、距離語序皆與舊譯逐字相符）。

---

## 6. 擁有者複驗追加修正（第三、四輪，格式層級，未列入 §1–§3 統計）

以下為擁有者實際驗收時追加的修正，性質是 inline code／醒目標示格式或數量詞寫法，依 §0 開頭訂立的排除規則（不列純標點、反引號、格式差異）不計入上方筆數統計，僅在此存檔：

- 禱詞 Prayer：戰技禱詞內「套裝」「寶物」由 inline code 改為一般文字。
- 領域虔誠與禱詞效果：知識領域「GM」改一般文字並補半形空格；慈愛／詭術領域「助攻」「躲藏」改一般文字。
- 晨光庇護、活力儀式：「另一個」統一改為「另 1 個」（數量詞阿拉伯數字化，指南 §6）。
- `feature.conduit.conduit-abilities` 中文名稱由「神導士招式總覽」改為「神導士招式」。
- 治癒恩典驗收頁空白問題：根因是 `scripts/build-owner-review-html.mjs` 的 extraCosts 渲染邏輯未支援 `options` 形狀（獨立於 `web/src/App.tsx` 的另一份程式碼），已修正，資料本身未變動。

**2026-07-31 擁有者完成最終驗收：M1（神導士一級）全部 41 個條目 `canonReviewStatus: verified`、`meta.status: reviewed`，`releases/milestones/m1.json` 的 `status` 為 `complete`。**

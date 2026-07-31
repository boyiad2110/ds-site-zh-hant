# M1 · 6 筆內容逐筆驗收表

> 這份文件是擁有者驗收閘門，不是核准紀錄。所有未勾選條目維持現有狀態；工具不得自行把 Canon 改為 `verified`，也不得把繁中草稿改為 `reviewed`。

## 驗收方式

逐筆核對來源頁碼、英文正典、繁中譯文、TI 決策與結構注意事項。每一筆請只勾選一個結果；需要修改時，直接在該條目的「擁有者備註」下補充。
本次清單共 6 筆：2 招式、0 狀態、4 職業特性。

- [ ] 我已完成全部 6 筆驗收
- [ ] 可將核准條目的 Canon 升為 `verified`
- [ ] 可將核准的繁中草稿升為 `reviewed`

---

## 招式 · 2 筆

### 1. 審判之鎚 · Judgment's Hammer

- ID：`ability.conduit.judgments-hammer`
- 來源：Heroes v1.01，印刷頁 101（PDF 頁 8）
- Canon 狀態：`verified`；繁中狀態：`reviewed`
- TI／裁決：無個別 TI；套用全域指南

**英文正典**

```json
{
  "id": "ability.conduit.judgments-hammer",
  "type": "ability",
  "name": "Judgment's Hammer",
  "aliasesEn": [],
  "flavor": "Your divine fury is a hammer that crashes down upon the unrighteous.",
  "keywords": [
    "magic",
    "ranged",
    "strike"
  ],
  "actionType": "main",
  "cost": {
    "resource": "piety",
    "value": 3
  },
  "distance": {
    "kind": "ranged",
    "value": 10,
    "raw": "Ranged 10"
  },
  "target": "One creature or object",
  "powerRoll": {
    "characteristic": "intuition",
    "tiers": [
      {
        "threshold": "≤11",
        "text": "3 + I holy damage",
        "potency": {
          "characteristic": "agility",
          "level": "weak",
          "effect": "prone"
        },
        "raw": "3 + I holy damage; A<WEAK, prone"
      },
      {
        "threshold": "12-16",
        "text": "6 + I holy damage",
        "potency": {
          "characteristic": "agility",
          "level": "average",
          "effect": "prone"
        },
        "raw": "6 + I holy damage; A<AVERAGE, prone"
      },
      {
        "threshold": "17+",
        "text": "9 + I holy damage",
        "potency": {
          "characteristic": "agility",
          "level": "strong",
          "effect": "prone and can't stand (save ends)"
        },
        "raw": "9 + I holy damage; A<STRONG, prone and can't stand (save ends)"
      }
    ]
  },
  "origin": {
    "kind": "class",
    "id": "class.conduit"
  },
  "abilityCategory": "heroic",
  "level": 1,
  "canonReviewStatus": "verified",
  "source": {
    "document": "heroes-v1.01-05-conduit",
    "version": "1.01",
    "pdfPage": 8,
    "printedPage": 101,
    "checkedAt": "2026-07-31"
  }
}
```

**繁中內容**

```json
{
  "id": "ability.conduit.judgments-hammer",
  "nameZhHant": "審判之鎚",
  "aliasesZhHant": [],
  "flavor": "你的神聖怒意化為巨鎚，粉碎邪惡之徒。",
  "powerRoll": {
    "tiers": [
      {
        "threshold": "≤11",
        "text": "3 + `直覺`神聖傷害",
        "potencyEffect": "伏地"
      },
      {
        "threshold": "12-16",
        "text": "6 + `直覺`神聖傷害",
        "potencyEffect": "伏地"
      },
      {
        "threshold": "17+",
        "text": "9 + `直覺`神聖傷害",
        "potencyEffect": "伏地且無法起身（豁免解除）"
      }
    ]
  },
  "meta": {
    "status": "reviewed",
    "reviewedBy": "owner",
    "reviewedAt": "2026-07-31",
    "translationSource": "舊 Notion 神導士招式 · 審判之鎚（sources/notion-export/class-notion/conduit/神導士招式 239f74afd25b80eb8f74ce7e7a785c42.md）",
    "commonProcessing": [
      "N-1：效力記號不存於 text，由 renderer 從 tiers[].potency 組出",
      "N-2：階層文字若有多子句以全形分號合併——本招式各階層只有單一子句，不涉及此規則",
      "potencyEffect 存純文字「伏地」／「伏地且無法起身（豁免解除）」，不補「目標陷入」前綴——套用 2026-07-31 對惡徒止步！／懺悔吧！的裁決（效力記號本身已含「若通過則生效」之意，效果文字逐字呈現，不重複語意），舊譯本身也是這個寫法，兩者剛好一致",
      "target「1 個生物或物體」、distance「遠程 10」皆為既有組合規則／受控欄位，不存於本層"
    ],
    "decisions": [],
    "pendingOwnerDecisions": []
  },
  "canonRef": {
    "id": "ability.conduit.judgments-hammer",
    "document": "heroes-v1.01-05-conduit",
    "printedPage": 101
  }
}
```

**結構與翻譯注意事項**

- N-1：效力記號不存於 text，由 renderer 從 tiers[].potency 組出
- N-2：階層文字若有多子句以全形分號合併——本招式各階層只有單一子句，不涉及此規則
- potencyEffect 存純文字「伏地」／「伏地且無法起身（豁免解除）」，不補「目標陷入」前綴——套用 2026-07-31 對惡徒止步！／懺悔吧！的裁決（效力記號本身已含「若通過則生效」之意，效果文字逐字呈現，不重複語意），舊譯本身也是這個寫法，兩者剛好一致
- target「1 個生物或物體」、distance「遠程 10」皆為既有組合規則／受控欄位，不存於本層

**擁有者裁決**

- [ ] 核准，內容與結構皆可進入正式 M1
- [ ] 需要修改

擁有者備註：

> 

---
### 2. 忠誠好友 · Faithful Friend

- ID：`ability.conduit.faithful-friend`
- 來源：Heroes v1.01，印刷頁 97（PDF 頁 4）
- Canon 狀態：`verified`；繁中狀態：`reviewed`
- TI／裁決：無個別 TI；套用全域指南

**英文正典**

```json
{
  "id": "ability.conduit.faithful-friend",
  "type": "ability",
  "name": "Faithful Friend",
  "aliasesEn": [],
  "flavor": "An animal spirit is drawn to you, sharing their senses with you and serving you faithfully.",
  "keywords": [
    "magic"
  ],
  "actionType": "main",
  "cost": null,
  "distance": {
    "kind": "self",
    "raw": "Self"
  },
  "target": "Self",
  "effect": [
    "You conjure a spirit that takes the form of any animal you have seen. The incorporeal animal has speed 5 and can fly, but can't physically interact with the world. While you are within 10 squares of the spirit, you automatically sense everything that type of animal would sense, in addition to sensing your own surroundings. You can dismiss the spirit at any time (no action required). If the spirit takes any damage, they are dismissed and you take 1d10 psychic damage that can't be reduced in any way."
  ],
  "origin": {
    "kind": "domain",
    "id": "domain.nature"
  },
  "abilityCategory": "inherent",
  "level": 1,
  "canonReviewStatus": "verified",
  "source": {
    "document": "heroes-v1.01-05-conduit",
    "version": "1.01",
    "pdfPage": 4,
    "printedPage": 97,
    "checkedAt": "2026-07-31"
  }
}
```

**繁中內容**

```json
{
  "id": "ability.conduit.faithful-friend",
  "nameZhHant": "忠誠好友",
  "aliasesZhHant": [],
  "flavor": "一個動物靈魂被你吸引，與你分享牠的感官並忠實地為你服務。",
  "effect": [
    "你召喚 1 個精魂，以你曾見過的任何動物形態出現。這個虛體動物的`速度`為 5，可以飛行，但無法與世界進行物理互動。當你在靈魂 10 格範圍內時，你除了感知自己周圍的環境外，還能自動感知該動物所能感知的一切。你可以隨時解消靈魂（無需動作）。若精魂受到任何傷害，它會立刻消失，且你會受到 1D10 心靈傷害（無法以任何方式減免）。"
  ],
  "meta": {
    "status": "reviewed",
    "reviewedBy": "owner",
    "reviewedAt": "2026-07-31",
    "translationSource": "舊 Notion 領域特性 · 自然：忠誠好友（sources/notion-export/class-notion/conduit/領域特性 239f74afd25b80ecb057dab212ed9548.md）",
    "commonProcessing": [
      "target／distance 皆為「Self」，套用本批新增的組合規則（shared/canon-format.mjs 的 TARGETS_ZH.Self=自身），不存於本層",
      "`速度`依指南 §6 屬性／遊戲數值一律 inline code 規則加上反引號，舊譯原文沒有加"
    ],
    "decisions": [],
    "pendingOwnerDecisions": []
  },
  "canonRef": {
    "id": "ability.conduit.faithful-friend",
    "document": "heroes-v1.01-05-conduit",
    "printedPage": 97
  }
}
```

**結構與翻譯注意事項**

- target／distance 皆為「Self」，套用本批新增的組合規則（shared/canon-format.mjs 的 TARGETS_ZH.Self=自身），不存於本層
- `速度`依指南 §6 屬性／遊戲數值一律 inline code 規則加上反引號，舊譯原文沒有加

**擁有者裁決**

- [ ] 核准，內容與結構皆可進入正式 M1
- [ ] 需要修改

擁有者備註：

> 

---

## 職業特性 · 4 筆

### 1. 虔誠 · Piety

- ID：`feature.conduit.piety`
- 來源：Heroes v1.01，印刷頁 95（PDF 頁 2）
- Canon 狀態：`verified`；繁中狀態：`reviewed`
- TI／裁決：TI-8、TI-9、TI-10、TI-18

**英文正典**

```json
{
  "id": "feature.conduit.piety",
  "type": "feature",
  "name": "Piety",
  "aliasesEn": [],
  "sections": [
    {
      "heading": null,
      "blocks": [
        {
          "kind": "paragraph",
          "text": "Your deity grants you a Heroic Resource called piety, letting you heal and empower your allies, and unleash holy power upon your foes."
        }
      ]
    },
    {
      "heading": "Piety in Combat",
      "blocks": [
        {
          "kind": "paragraph",
          "text": "At the start of a combat encounter or some other stressful situation tracked in combat rounds (as determined by the Director), you gain piety equal to your Victories. At the start of each of your turns during combat, you gain 1d3 piety."
        },
        {
          "kind": "paragraph",
          "text": "Additionally, you can gain more piety by praying to the gods—but beware! Doing so can easily draw their ire, as the gods hate to be annoyed. Before you roll to gain piety at the start of your turn, you can pray (no action required)."
        },
        {
          "kind": "bulletList",
          "lead": "If you do, your roll gains the following additional effects:",
          "items": [
            "If the roll is a 1, you gain 1 additional piety but anger the gods! You take psychic damage equal to 1d6 + your level, which can't be reduced in any way.",
            "If the roll is a 2, you gain 1 additional piety.",
            "If the roll is a 3, you gain 2 additional piety and can activate a domain effect of your choice (see below)."
          ]
        },
        {
          "kind": "paragraph",
          "text": "You lose any remaining piety at the end of the encounter."
        }
      ]
    },
    {
      "heading": "Piety Outside of Combat",
      "blocks": [
        {
          "kind": "paragraph",
          "text": "Though you can't gain piety outside of combat, you can use your heroic abilities and effects that cost piety without spending it. Whenever you use an ability or effect outside of combat that costs piety, you can't use that same ability or effect outside of combat again until you earn 1 or more Victories or finish a respite."
        },
        {
          "kind": "paragraph",
          "text": "When you use an ability outside of combat that lets you spend unlimited piety on its effect, such as Healing Grace, you can use it as if you had spent an amount of piety equal to your Victories."
        }
      ]
    }
  ],
  "origin": {
    "kind": "class",
    "id": "class.conduit"
  },
  "level": 1,
  "canonReviewStatus": "verified",
  "source": {
    "document": "heroes-v1.01-05-conduit",
    "version": "1.01",
    "pdfPage": 2,
    "printedPage": 95,
    "checkedAt": "2026-07-31"
  }
}
```

**繁中內容**

```json
{
  "id": "feature.conduit.piety",
  "nameZhHant": "虔誠",
  "aliasesZhHant": [],
  "sections": [
    {
      "heading": null,
      "blocks": [
        {
          "kind": "paragraph",
          "text": "你的神明賦予你名為「`虔誠`」的`英雄資源`，讓你可以治療並強化盟友，同時向敵人釋放神聖力量。"
        }
      ]
    },
    {
      "heading": "戰鬥中的虔誠",
      "blocks": [
        {
          "kind": "paragraph",
          "text": "在戰鬥或其他需要以戰鬥輪計算的緊張情境開始時，你會獲得等於`勝利值`的`虔誠`。每輪 1 次，當你的回合開始時，你獲得 1D3 點`虔誠`。"
        },
        {
          "kind": "paragraph",
          "text": "此外，你可以向神明祈禱來獲得更多`虔誠`，但要注意！神明討厭被打擾，這麼做很容易觸怒祂們。在你回合開始擲骰獲得`虔誠`之前，你可以進行祈禱（無需動作）。"
        },
        {
          "kind": "bulletList",
          "lead": "若你這麼做，你的擲骰會額外獲得以下效果：",
          "items": [
            "若擲出 1，你額外獲得 1 點`虔誠`（共獲得 2 點），但也激怒了神明！你受到 1D6 + 你等級的心靈傷害（無法以任何方式減免）。",
            "若擲出 2，你額外獲得 1 點`虔誠`（共獲得 3 點）。",
            "若擲出 3，你額外獲得 2 點`虔誠`（共獲得 5 點），而且可以啟動 1 個領域禱詞效果。"
          ]
        },
        {
          "kind": "paragraph",
          "text": "遭遇結束時，你失去所有剩餘的`虔誠`。"
        }
      ]
    },
    {
      "heading": "戰鬥外的虔誠",
      "blocks": [
        {
          "kind": "paragraph",
          "text": "雖然你無法在戰鬥外獲得`虔誠`，但你可以在不花費`虔誠`的情況下發動 1 次英雄招式或需要`虔誠`的效果。若你這麼做，你必須獲得至少 1 點`勝利值`或完成 1 次休整，才能在戰鬥外再次發動同個招式或效果。"
        },
        {
          "kind": "paragraph",
          "text": "若你在戰鬥外發動 1 個允許你花費無限`虔誠`的招式（例如【治癒恩典】），你可以將其視為花費等於你`勝利值`的`虔誠`。"
        }
      ]
    }
  ],
  "meta": {
    "status": "reviewed",
    "reviewedBy": "owner",
    "reviewedAt": "2026-07-31",
    "translationSource": "舊 Notion 神導士 · 虔誠（sources/notion-export/class-notion/conduit/虔誠 239f74afd25b807281dccc99701737d8.md）",
    "commonProcessing": [
      "套用既有 TI-10（懲戒者怒火已裁決）：正典的 “(as determined by the Director)” 不補譯，舊譯本來就沒有，兩處是同一子句",
      "套用既有 TI-9（全域通則，適用全部範型的英雄資源說明）：正典「At the start of each of your turns…you gain 1d3 piety」補「每輪 1 次」提示語",
      "套用既有 TI-8 的修法：舊譯原寫「才能在戰鬥外再次發動需要虔誠的招式或效果」，未譯出正典 “that same ability or effect” 的限定，比照 TI-8 對怒火的裁決改為「同個招式或效果」",
      "套用既有 TI-18：舊譯「長休」全部改為已批准譯名「休整」",
      "「治癒恩典」（Healing Grace）不在本批樣本範圍內，故不做成站內連結，改用【】標記招式名稱（指南 §6「內文提及招式名時加【】」），待該招式建檔後再視需要改為連結",
      "戰鬥中虔誠段落，正典本身在書上就是條列式（非 TI-9 那種散文改條列），故 canon／zh 兩側都用 bulletList，逐項對應",
      "2026-07-31 第一輪驗收裁決：「（共獲得 N 點）」合計提示保留；「Before you roll」的時機語意原譯法不夠清楚，改為「在你回合開始擲骰獲得虔誠之前，你可以進行祈禱」"
    ],
    "decisions": [
      "TI-8",
      "TI-9",
      "TI-10",
      "TI-18"
    ],
    "pendingOwnerDecisions": []
  },
  "canonRef": {
    "id": "feature.conduit.piety",
    "document": "heroes-v1.01-05-conduit",
    "printedPage": 95
  }
}
```

**結構與翻譯注意事項**

- 套用既有 TI-10（懲戒者怒火已裁決）：正典的 “(as determined by the Director)” 不補譯，舊譯本來就沒有，兩處是同一子句
- 套用既有 TI-9（全域通則，適用全部範型的英雄資源說明）：正典「At the start of each of your turns…you gain 1d3 piety」補「每輪 1 次」提示語
- 套用既有 TI-8 的修法：舊譯原寫「才能在戰鬥外再次發動需要虔誠的招式或效果」，未譯出正典 “that same ability or effect” 的限定，比照 TI-8 對怒火的裁決改為「同個招式或效果」
- 套用既有 TI-18：舊譯「長休」全部改為已批准譯名「休整」
- 「治癒恩典」（Healing Grace）不在本批樣本範圍內，故不做成站內連結，改用【】標記招式名稱（指南 §6「內文提及招式名時加【】」），待該招式建檔後再視需要改為連結
- 戰鬥中虔誠段落，正典本身在書上就是條列式（非 TI-9 那種散文改條列），故 canon／zh 兩側都用 bulletList，逐項對應
- 2026-07-31 第一輪驗收裁決：「（共獲得 N 點）」合計提示保留；「Before you roll」的時機語意原譯法不夠清楚，改為「在你回合開始擲骰獲得虔誠之前，你可以進行祈禱」

**擁有者裁決**

- [ ] 核准，內容與結構皆可進入正式 M1
- [ ] 需要修改

擁有者備註：

> 

---
### 2. 禱詞 · Prayer

- ID：`feature.conduit.prayer`
- 來源：Heroes v1.01，印刷頁 99（PDF 頁 6）
- Canon 狀態：`verified`；繁中狀態：`reviewed`
- TI／裁決：無個別 TI；套用全域指南

**英文正典**

```json
{
  "id": "feature.conduit.prayer",
  "type": "feature",
  "name": "Prayer",
  "aliasesEn": [],
  "sections": [
    {
      "heading": null,
      "blocks": [
        {
          "kind": "paragraph",
          "text": "Your god answers a prayer with enhancements to your body and mind. Choose one of the following prayers. You can change your prayer along with your ward (see Conduit Ward below) by praying to your god as a respite activity. (Quick Build: Prayer of Distance.)"
        },
        {
          "kind": "definitionList",
          "marker": "none",
          "items": [
            {
              "term": "Prayer of Destruction",
              "text": "Your god infuses wrath within your being. You gain a +1 bonus to rolled damage with magic abilities."
            },
            {
              "term": "Prayer of Distance",
              "text": "Your god blesses you with the ability to stretch your divine magic farther. You have a +2 bonus to the distance of your ranged magic abilities."
            },
            {
              "term": "Prayer of Soldier's Skill",
              "text": "Your god gives your mind the training of a soldier. You can wear light armor and wield light weapons effectively, even though you don't have a kit. While you wear light armor, you gain a +3 bonus to Stamina, and that bonus increases by 3 at 4th, 7th, and 10th levels. While you wield a light weapon, you gain a +1 damage bonus with weapon abilities, including free strikes. You can use light armor treasures and light weapon treasures. If you have a kit, you can't take this blessing."
            },
            {
              "term": "Prayer of Speed",
              "text": "Your god blesses your flesh and infuses it with divine quickness. You gain a +1 bonus to speed and to the distance you can shift when you take the Disengage move action."
            },
            {
              "term": "Prayer of Steel",
              "text": "Your god fills your body with the light of creation, making you harder to hurt and move. You gain a +6 bonus to Stamina, and this bonus increases by 6 at 4th, 7th, and 10th levels. Additionally, you gain a +1 bonus to stability."
            }
          ]
        }
      ]
    }
  ],
  "origin": {
    "kind": "class",
    "id": "class.conduit"
  },
  "level": 1,
  "canonReviewStatus": "verified",
  "source": {
    "document": "heroes-v1.01-05-conduit",
    "version": "1.01",
    "pdfPage": 6,
    "printedPage": 99,
    "checkedAt": "2026-07-31"
  }
}
```

**繁中內容**

```json
{
  "id": "feature.conduit.prayer",
  "nameZhHant": "禱詞",
  "aliasesZhHant": [],
  "sections": [
    {
      "heading": null,
      "blocks": [
        {
          "kind": "paragraph",
          "text": "你的神明回應了祈禱，賜予你身心的強化。從以下選項中選擇 1 種禱詞。作為 1 次休整活動，你可以向神明祈禱來更換你的禱詞和護咒。"
        },
        {
          "kind": "definitionList",
          "marker": "none",
          "items": [
            {
              "term": "毀滅禱詞",
              "text": "你的神明在你體內灌注憤怒之力。你魔法招式的檢定傷害會獲得 +1 加值。"
            },
            {
              "term": "遠距禱詞",
              "text": "神明賜福你，讓你的神聖魔法可以延伸得更遠。你遠程魔法招式的射程會獲得 +2 加值。"
            },
            {
              "term": "戰技禱詞",
              "text": "你的神明賦予你戰士般的心智。即使你沒有`套裝`，你也能有效地穿戴輕甲和持用輕型武器。當你穿戴輕甲時，你的`體力`會獲得 +3 加值，這個加值在 4 級、7 級和 10 級時會再各增加 3 點。當你持用輕型武器時，你武器招式的傷害會獲得 +1 加值（包括基礎打擊）。你可以使用輕甲`寶物`和輕型武器`寶物`。若你擁有`套裝`，你不能選擇此禱詞。"
            },
            {
              "term": "速度禱詞",
              "text": "你的神明祝福你的身體，灌注了神聖的迅捷之力。你的`速度`，以及當你使用撤離移動動作時的`遁移`距離，都會獲得 +1 加值。"
            },
            {
              "term": "鋼鐵禱詞",
              "text": "你的神明將創生之光注入你的身軀，讓你更加強健與穩固。你的`體力`獲得 +6 加值，這個加值在 4 級、7 級和 10 級時會再各增加 6 點。此外，你的`穩度`獲得 +1 加值。"
            }
          ]
        }
      ]
    }
  ],
  "meta": {
    "status": "reviewed",
    "reviewedBy": "owner",
    "reviewedAt": "2026-07-31",
    "translationSource": "舊 Notion 神導士 · 禱詞（sources/notion-export/class-notion/conduit/禱詞 239f74afd25b8019b486e7b46bd59335.md）",
    "commonProcessing": [
      "definitionList.term 沿用舊譯的中文短名（毀滅禱詞／遠距禱詞／戰技禱詞／速度禱詞／鋼鐵禱詞），與正典英文 term 逐項對應",
      "戰技禱詞原文分兩段（主敘述＋「若你擁有套裝…」限定句），因 definitionList 的 renderer 目前不支援段內分段，比照舊譯合併為一段連續文字",
      "「(see Conduit Ward below)」與「Conduit Ward」不在本批樣本範圍內，故不做站內連結，intro 段落沿用舊譯省略此頁內指示的做法（比照 TI-5～7 對頁面位置參照的處理）",
      "`套裝`／`寶物`／`體力`／`穩度`／`遁移` 皆為既有 approved 詞彙表用詞，直接套用",
      "2026-07-31 擁有者裁決：「禱詞」不加反引號，維持特性名稱的一般文字樣式"
    ],
    "decisions": [],
    "pendingOwnerDecisions": []
  },
  "canonRef": {
    "id": "feature.conduit.prayer",
    "document": "heroes-v1.01-05-conduit",
    "printedPage": 99
  }
}
```

**結構與翻譯注意事項**

- definitionList.term 沿用舊譯的中文短名（毀滅禱詞／遠距禱詞／戰技禱詞／速度禱詞／鋼鐵禱詞），與正典英文 term 逐項對應
- 戰技禱詞原文分兩段（主敘述＋「若你擁有套裝…」限定句），因 definitionList 的 renderer 目前不支援段內分段，比照舊譯合併為一段連續文字
- 「(see Conduit Ward below)」與「Conduit Ward」不在本批樣本範圍內，故不做站內連結，intro 段落沿用舊譯省略此頁內指示的做法（比照 TI-5～7 對頁面位置參照的處理）
- `套裝`／`寶物`／`體力`／`穩度`／`遁移` 皆為既有 approved 詞彙表用詞，直接套用
- 2026-07-31 擁有者裁決：「禱詞」不加反引號，維持特性名稱的一般文字樣式

**擁有者裁決**

- [ ] 核准，內容與結構皆可進入正式 M1
- [ ] 需要修改

擁有者備註：

> 

---
### 3. 領域虔誠與禱詞效果 · Domain Piety and Effects

- ID：`feature.conduit.domain-piety-and-effects`
- 來源：Heroes v1.01，印刷頁 96（PDF 頁 3）
- Canon 狀態：`draft`；繁中狀態：`draft`
- TI／裁決：無個別 TI；套用全域指南

**英文正典**

```json
{
  "id": "feature.conduit.domain-piety-and-effects",
  "type": "feature",
  "name": "Domain Piety and Effects",
  "aliasesEn": [],
  "sections": [
    {
      "heading": null,
      "blocks": [
        {
          "kind": "paragraph",
          "text": "Your choice of domains provides you with two additional ways to earn piety during combat, as triggered by specific events. You might even have a single event trigger both your piety effects. For example, the Sun domain grants piety when a nearby creature takes fire or holy damage, while the War domain grants piety when a nearby creature takes damage of 10 + your level or higher. If you have both those domains and a nearby creature takes an appropriate amount of fire damage, you gain piety from both your domains."
        },
        {
          "kind": "paragraph",
          "text": "Additionally, whenever you activate a domain effect by praying for piety, you can choose one of your domains and have that domain's prayer effect take effect immediately."
        }
      ]
    },
    {
      "heading": "Nature Domain Piety and Effect",
      "blocks": [
        {
          "kind": "definitionList",
          "marker": "none",
          "items": [
            {
              "term": "Piety",
              "text": "You gain 2 piety the first time in an encounter that you or a creature within 10 squares takes acid, cold, fire, lightning, poison, or sonic damage."
            },
            {
              "term": "Prayer Effect",
              "text": "Vines whip up from the floor or ground within 10 squares, wrapping around a number of creatures equal to your Intuition score. You can slide each creature up to a number of squares equal to your Intuition score. The vines then fade away."
            }
          ]
        }
      ]
    }
  ],
  "origin": {
    "kind": "class",
    "id": "class.conduit"
  },
  "level": 1,
  "canonReviewStatus": "draft",
  "source": {
    "document": "heroes-v1.01-05-conduit",
    "version": "1.01",
    "pdfPage": 3,
    "printedPage": 96,
    "checkedAt": "2026-07-31"
  }
}
```

**繁中內容**

```json
{
  "id": "feature.conduit.domain-piety-and-effects",
  "nameZhHant": "領域虔誠與禱詞效果",
  "aliasesZhHant": [],
  "sections": [
    {
      "heading": null,
      "blocks": [
        {
          "kind": "paragraph",
          "text": "你選擇的領域提供了兩種在戰鬥中額外獲得`虔誠`的方式，由特定條件觸發。甚至單一事件可能會同時觸發兩種虔誠效果。例如，太陽領域會在附近生物受到火焰或神聖傷害時賦予`虔誠`，而戰爭領域則會在附近生物受到至少 10 + 你等級的傷害時賦予`虔誠`。若你同時擁有這 2 個領域，而且附近生物受到超過一定數量的火焰傷害，你會從 2 個領域中同時獲得`虔誠`。"
        },
        {
          "kind": "paragraph",
          "text": "此外，若你在回合開始時進行祈禱來獲得`虔誠`，而且能夠啟動領域禱詞效果，你可以選擇其中 1 個領域，並立刻讓該領域的禱詞效果生效。"
        }
      ]
    },
    {
      "heading": "自然",
      "blocks": [
        {
          "kind": "definitionList",
          "marker": "none",
          "items": [
            {
              "term": "虔誠",
              "text": "每場遭遇 1 次，當你自己或 10 格內的 1 個生物首次受到強酸、寒冷、火焰、閃電、劇毒或音波傷害時，你獲得 2 點`虔誠`。"
            },
            {
              "term": "禱詞效果",
              "text": "藤蔓從 10 格內的地面竄出，纏繞住數量等於你`直覺`的生物。你可以將每個生物滑動最多等於你`直覺`的格數。然後藤蔓就會消失。"
            }
          ]
        }
      ]
    }
  ],
  "meta": {
    "status": "draft",
    "translationSource": "舊 Notion 神導士 · 虔誠（「領域的虔誠與禱詞效果」段落，同一份檔案）",
    "commonProcessing": [
      "2026-07-31 擁有者裁決：sections[1].heading 使用簡短領域名稱「自然」，不重複「領域虔誠與禱詞效果」字樣",
      "本條目目前只有「自然」1 個領域的內容；其餘 11 個領域的虔誠／禱詞效果舊譯（虔誠.md）已全部翻好，留待 M1 正式全量抽取時比照套用，不在本批樣本範圍內",
      "2026-07-31 第二輪裁決：撤回第一輪加入的過渡句「以下是各領域的虔誠與禱詞效果。」——不新增站方說明句，不調整 schema，intro 段落回復為逐字對應正典的兩段"
    ],
    "decisions": [],
    "pendingOwnerDecisions": []
  },
  "canonRef": {
    "id": "feature.conduit.domain-piety-and-effects",
    "document": "heroes-v1.01-05-conduit",
    "printedPage": 96
  }
}
```

**結構與翻譯注意事項**

- 2026-07-31 擁有者裁決：sections[1].heading 使用簡短領域名稱「自然」，不重複「領域虔誠與禱詞效果」字樣
- 本條目目前只有「自然」1 個領域的內容；其餘 11 個領域的虔誠／禱詞效果舊譯（虔誠.md）已全部翻好，留待 M1 正式全量抽取時比照套用，不在本批樣本範圍內
- 2026-07-31 第二輪裁決：撤回第一輪加入的過渡句「以下是各領域的虔誠與禱詞效果。」——不新增站方說明句，不調整 schema，intro 段落回復為逐字對應正典的兩段

**擁有者裁決**

- [ ] 核准，內容與結構皆可進入正式 M1
- [ ] 需要修改

擁有者備註：

> 

---
### 4. 1 級領域特性 · 1st-Level Domain Feature

- ID：`feature.conduit.domain-feature-1st-level`
- 來源：Heroes v1.01，印刷頁 97（PDF 頁 4）
- Canon 狀態：`draft`；繁中狀態：`draft`
- TI／裁決：無個別 TI；套用全域指南

**英文正典**

```json
{
  "id": "feature.conduit.domain-feature-1st-level",
  "type": "feature",
  "name": "1st-Level Domain Feature",
  "aliasesEn": [],
  "sections": [
    {
      "heading": null,
      "blocks": [
        {
          "kind": "paragraph",
          "text": "Choose one of your domains. You gain a domain feature for that domain, as shown on the 1st-Level Conduit Domain Features table. Additionally, you gain a skill from the chosen domain, selected from the skill group indicated on the table. (Quick Build: Revitalizing Ritual and the Heal skill from the Life domain.)"
        },
        {
          "kind": "definitionList",
          "marker": "none",
          "items": [
            {
              "term": "Nature",
              "text": "Faithful Friend (Exploration)"
            }
          ]
        }
      ]
    }
  ],
  "origin": {
    "kind": "class",
    "id": "class.conduit"
  },
  "level": 1,
  "canonReviewStatus": "draft",
  "source": {
    "document": "heroes-v1.01-05-conduit",
    "version": "1.01",
    "pdfPage": 4,
    "printedPage": 97,
    "checkedAt": "2026-07-31"
  }
}
```

**繁中內容**

```json
{
  "id": "feature.conduit.domain-feature-1st-level",
  "nameZhHant": "1 級領域特性",
  "aliasesZhHant": [],
  "sections": [
    {
      "heading": null,
      "blocks": [
        {
          "kind": "paragraph",
          "text": "1 級時，從你的 2 個領域中選擇其中 1 個領域，並獲得該領域的領域特性（如下所示）。此外，你從該領域提供的技能類別中獲得 1 項技能。（推薦選項：生命領域的活力儀式與醫療技能）"
        },
        {
          "kind": "definitionList",
          "marker": "none",
          "items": [
            {
              "term": "自然",
              "text": "[忠誠好友](ability.conduit.faithful-friend)（探索類技能）"
            }
          ]
        }
      ]
    }
  ],
  "meta": {
    "status": "draft",
    "translationSource": "舊 Notion 神導士 · 領域特性（sources/notion-export/class-notion/conduit/領域特性 239f74afd25b80ecb057dab212ed9548.md）",
    "commonProcessing": [
      "2026-07-31 擁有者裁決：句尾「(Quick Build: Revitalizing Ritual and the Heal skill from the Life domain.)」補譯，Quick Build 統一用已批准譯名「推薦選項」（TI-11）",
      "「Revitalizing Ritual」譯「活力儀式」，取自舊譯 sources/notion-export/class-notion/conduit/領域特性…md 的生命領域列（非本批樣本範圍，僅取其譯名）",
      "「Heal」（技能名）2026-07-31 擁有者正式裁決定稿為「醫療」，與 glossary 既有的 term.heal（zhHant「治療」，approved，類別「規則/主要動作」，指戰鬥中的治療主要動作）是不同詞義，不得混用。此裁決尚未寫入 data/decisions.json——原因與待辦見本檔外的對話紀錄，需要另外處理正典術語流程與 releases/m0.json 指紋的連動",
      "definitionList 項目格式為「[具名特性或招式](id)（技能組）」，比照舊譯「造物之手（工藝類技能）」這類既有寫法，技能組維持「OO類技能」的既定格式",
      "「忠誠好友」已建為獨立招式條目（ability.conduit.faithful-friend），故用行內連結；其餘 11 個領域授予的特性／招式尚未建檔，留待 M1 正式抽取時比照建立並補上連結"
    ],
    "decisions": [],
    "pendingOwnerDecisions": []
  },
  "canonRef": {
    "id": "feature.conduit.domain-feature-1st-level",
    "document": "heroes-v1.01-05-conduit",
    "printedPage": 97
  }
}
```

**結構與翻譯注意事項**

- 2026-07-31 擁有者裁決：句尾「(Quick Build: Revitalizing Ritual and the Heal skill from the Life domain.)」補譯，Quick Build 統一用已批准譯名「推薦選項」（TI-11）
- 「Revitalizing Ritual」譯「活力儀式」，取自舊譯 sources/notion-export/class-notion/conduit/領域特性…md 的生命領域列（非本批樣本範圍，僅取其譯名）
- 「Heal」（技能名）2026-07-31 擁有者正式裁決定稿為「醫療」，與 glossary 既有的 term.heal（zhHant「治療」，approved，類別「規則/主要動作」，指戰鬥中的治療主要動作）是不同詞義，不得混用。此裁決尚未寫入 data/decisions.json——原因與待辦見本檔外的對話紀錄，需要另外處理正典術語流程與 releases/m0.json 指紋的連動
- definitionList 項目格式為「[具名特性或招式](id)（技能組）」，比照舊譯「造物之手（工藝類技能）」這類既有寫法，技能組維持「OO類技能」的既定格式
- 「忠誠好友」已建為獨立招式條目（ability.conduit.faithful-friend），故用行內連結；其餘 11 個領域授予的特性／招式尚未建檔，留待 M1 正式抽取時比照建立並補上連結

**擁有者裁決**

- [ ] 核准，內容與結構皆可進入正式 M1
- [ ] 需要修改

擁有者備註：

> 

---

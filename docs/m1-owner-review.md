# M1 · 41 筆內容逐筆驗收表

> 這份文件是擁有者驗收閘門，不是核准紀錄。所有未勾選條目維持現有狀態；工具不得自行把 Canon 改為 `verified`，也不得把繁中草稿改為 `reviewed`。

## 驗收方式

逐筆核對來源頁碼、英文正典、繁中譯文、TI 決策與結構注意事項。每一筆請只勾選一個結果；需要修改時，直接在該條目的「擁有者備註」下補充。
本次清單共 41 筆：23 招式、0 狀態、18 職業特性。

- [ ] 我已完成全部 41 筆驗收
- [ ] 可將核准條目的 Canon 升為 `verified`
- [ ] 可將核准的繁中草稿升為 `reviewed`

---

## 招式 · 23 筆

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
### 3. 賜福聖光 · Blessed Light

- ID：`ability.conduit.blessed-light`
- 來源：Heroes v1.01，印刷頁 99（PDF 頁 6）
- Canon 狀態：`verified`；繁中狀態：`reviewed`
- TI／裁決：無個別 TI；套用全域指南

**英文正典**

```json
{
  "id": "ability.conduit.blessed-light",
  "type": "ability",
  "name": "Blessed Light",
  "aliasesEn": [],
  "flavor": "Burning radiance falls upon your foe, transferring some of their energy to a nearby ally.",
  "keywords": [
    "magic",
    "ranged",
    "strike"
  ],
  "actionType": "main",
  "cost": null,
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
        "raw": "3 + I holy damage"
      },
      {
        "threshold": "12-16",
        "text": "5 + I holy damage",
        "raw": "5 + I holy damage"
      },
      {
        "threshold": "17+",
        "text": "8 + I holy damage",
        "raw": "8 + I holy damage"
      }
    ]
  },
  "effect": [
    "One ally within distance gains a number of surges equal to the tier outcome of your power roll."
  ],
  "origin": {
    "kind": "class",
    "id": "class.conduit"
  },
  "abilityCategory": "signature",
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
  "id": "ability.conduit.blessed-light",
  "nameZhHant": "賜福聖光",
  "aliasesZhHant": [],
  "flavor": "熾熱的聖光落在敵人身上，並將部分能量轉移至附近的盟友。",
  "powerRoll": {
    "tiers": [
      {
        "threshold": "≤11",
        "text": "3 + `直覺`神聖傷害"
      },
      {
        "threshold": "12-16",
        "text": "5 + `直覺`神聖傷害"
      },
      {
        "threshold": "17+",
        "text": "8 + `直覺`神聖傷害"
      }
    ]
  },
  "effect": [
    "射程內的 1 個盟友獲得等於你檢定階級結果的`鬥志`。"
  ],
  "meta": {
    "status": "reviewed",
    "translationSource": "舊 Notion 神導士招式 · 賜福聖光（sources/notion-export/class-notion/conduit/神導士招式 239f74afd25b80eb8f74ce7e7a785c42.md）",
    "commonProcessing": [
      "數值與效果與舊譯逐字相符，僅套用 N-1／N-2 與 inline code 格式規則"
    ],
    "decisions": [],
    "pendingOwnerDecisions": [],
    "reviewedBy": "owner",
    "reviewedAt": "2026-07-31"
  },
  "canonRef": {
    "id": "ability.conduit.blessed-light",
    "document": "heroes-v1.01-05-conduit",
    "printedPage": 99
  }
}
```

**結構與翻譯注意事項**

- 數值與效果與舊譯逐字相符，僅套用 N-1／N-2 與 inline code 格式規則

**擁有者裁決**

- [ ] 核准，內容與結構皆可進入正式 M1
- [ ] 需要修改

擁有者備註：

>

---
### 4. 奪元術 · Drain

- ID：`ability.conduit.drain`
- 來源：Heroes v1.01，印刷頁 99（PDF 頁 6）
- Canon 狀態：`verified`；繁中狀態：`reviewed`
- TI／裁決：無個別 TI；套用全域指南

**英文正典**

```json
{
  "id": "ability.conduit.drain",
  "type": "ability",
  "name": "Drain",
  "aliasesEn": [],
  "flavor": "You drain the energy from your target to revitalize yourself or an ally.",
  "keywords": [
    "magic",
    "melee",
    "strike"
  ],
  "actionType": "main",
  "cost": null,
  "distance": {
    "kind": "melee",
    "value": 1,
    "raw": "Melee 1"
  },
  "target": "One creature",
  "powerRoll": {
    "characteristic": "intuition",
    "tiers": [
      {
        "threshold": "≤11",
        "text": "2 + I corruption damage",
        "raw": "2 + I corruption damage"
      },
      {
        "threshold": "12-16",
        "text": "5 + I corruption damage",
        "raw": "5 + I corruption damage"
      },
      {
        "threshold": "17+",
        "text": "7 + I corruption damage",
        "raw": "7 + I corruption damage"
      }
    ]
  },
  "effect": [
    "You or one ally within distance can spend a Recovery."
  ],
  "origin": {
    "kind": "class",
    "id": "class.conduit"
  },
  "abilityCategory": "signature",
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
  "id": "ability.conduit.drain",
  "nameZhHant": "奪元術",
  "aliasesZhHant": [],
  "flavor": "你汲取目標的能量來恢復自己或盟友的體力。",
  "powerRoll": {
    "tiers": [
      {
        "threshold": "≤11",
        "text": "2 + `直覺`腐朽傷害"
      },
      {
        "threshold": "12-16",
        "text": "5 + `直覺`腐朽傷害"
      },
      {
        "threshold": "17+",
        "text": "7 + `直覺`腐朽傷害"
      }
    ]
  },
  "effect": [
    "你自己或射程內的 1 個盟友可以花費 1 點`復元力`。"
  ],
  "meta": {
    "status": "reviewed",
    "translationSource": "舊 Notion 神導士招式 · 奪元術（同上檔）",
    "commonProcessing": [
      "數值與效果與舊譯逐字相符，僅套用格式規則"
    ],
    "decisions": [],
    "pendingOwnerDecisions": [],
    "reviewedBy": "owner",
    "reviewedAt": "2026-07-31"
  },
  "canonRef": {
    "id": "ability.conduit.drain",
    "document": "heroes-v1.01-05-conduit",
    "printedPage": 99
  }
}
```

**結構與翻譯注意事項**

- 數值與效果與舊譯逐字相符，僅套用格式規則

**擁有者裁決**

- [ ] 核准，內容與結構皆可進入正式 M1
- [ ] 需要修改

擁有者備註：

>

---
### 5. 神聖鞭笞 · Holy Lash

- ID：`ability.conduit.holy-lash`
- 來源：Heroes v1.01，印刷頁 99（PDF 頁 6）
- Canon 狀態：`verified`；繁中狀態：`reviewed`
- TI／裁決：無個別 TI；套用全域指南

**英文正典**

```json
{
  "id": "ability.conduit.holy-lash",
  "type": "ability",
  "name": "Holy Lash",
  "aliasesEn": [],
  "flavor": "A tendril of divine energy shoots forth to draw in your foe.",
  "keywords": [
    "magic",
    "ranged",
    "strike"
  ],
  "actionType": "main",
  "cost": null,
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
        "text": "3 + I holy damage; vertical pull 2",
        "raw": "3 + I holy damage; vertical pull 2"
      },
      {
        "threshold": "12-16",
        "text": "5 + I holy damage; vertical pull 3",
        "raw": "5 + I holy damage; vertical pull 3"
      },
      {
        "threshold": "17+",
        "text": "8 + I holy damage; vertical pull 4",
        "raw": "8 + I holy damage; vertical pull 4"
      }
    ]
  },
  "origin": {
    "kind": "class",
    "id": "class.conduit"
  },
  "abilityCategory": "signature",
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
  "id": "ability.conduit.holy-lash",
  "nameZhHant": "神聖鞭笞",
  "aliasesZhHant": [],
  "flavor": "一道神聖能量的捲鬚迸射而出，將敵人拉向你。",
  "powerRoll": {
    "tiers": [
      {
        "threshold": "≤11",
        "text": "3 + `直覺`神聖傷害；垂直拉動 2"
      },
      {
        "threshold": "12-16",
        "text": "5 + `直覺`神聖傷害；垂直拉動 3"
      },
      {
        "threshold": "17+",
        "text": "8 + `直覺`神聖傷害；垂直拉動 4"
      }
    ]
  },
  "meta": {
    "status": "reviewed",
    "translationSource": "舊 Notion 神導士招式 · 神聖鞭笞（同上檔）",
    "commonProcessing": [
      "N-2：階層內「傷害；垂直拉動 N」原文以分號連接兩子句，中文比照合併",
      "2026-07-31 Reviewer 複核，擁有者確認：舊譯第 3 階「垂直拉動 3」為錯誤，正典（pdfPage 6／printedPage 99，已用 -layout 文字抽取與 150dpi 圖像 out/conduit/page-06.png 雙重核對）為「vertical pull 4」，訂正為「垂直拉動 4」定案，不再列為待裁"
    ],
    "decisions": [],
    "pendingOwnerDecisions": [],
    "reviewedBy": "owner",
    "reviewedAt": "2026-07-31"
  },
  "canonRef": {
    "id": "ability.conduit.holy-lash",
    "document": "heroes-v1.01-05-conduit",
    "printedPage": 99
  }
}
```

**結構與翻譯注意事項**

- N-2：階層內「傷害；垂直拉動 N」原文以分號連接兩子句，中文比照合併
- 2026-07-31 Reviewer 複核，擁有者確認：舊譯第 3 階「垂直拉動 3」為錯誤，正典（pdfPage 6／printedPage 99，已用 -layout 文字抽取與 150dpi 圖像 out/conduit/page-06.png 雙重核對）為「vertical pull 4」，訂正為「垂直拉動 4」定案，不再列為待裁

**擁有者裁決**

- [ ] 核准，內容與結構皆可進入正式 M1
- [ ] 需要修改

擁有者備註：

>

---
### 6. 天降光霖 · Lightfall

- ID：`ability.conduit.lightfall`
- 來源：Heroes v1.01，印刷頁 99（PDF 頁 6）
- Canon 狀態：`verified`；繁中狀態：`reviewed`
- TI／裁決：無個別 TI；套用全域指南

**英文正典**

```json
{
  "id": "ability.conduit.lightfall",
  "type": "ability",
  "name": "Lightfall",
  "aliasesEn": [],
  "flavor": "A rain of holy light scours your enemies and repositions your allies.",
  "keywords": [
    "area",
    "magic"
  ],
  "actionType": "main",
  "cost": null,
  "distance": {
    "kind": "area",
    "area": {
      "shape": "burst",
      "size": 2
    },
    "raw": "2 burst"
  },
  "target": "Each enemy in the area",
  "powerRoll": {
    "characteristic": "intuition",
    "tiers": [
      {
        "threshold": "≤11",
        "text": "2 holy damage",
        "raw": "2 holy damage"
      },
      {
        "threshold": "12-16",
        "text": "3 holy damage",
        "raw": "3 holy damage"
      },
      {
        "threshold": "17+",
        "text": "5 holy damage",
        "raw": "5 holy damage"
      }
    ]
  },
  "effect": [
    "You can teleport yourself and each ally in the area to unoccupied spaces in the area."
  ],
  "origin": {
    "kind": "class",
    "id": "class.conduit"
  },
  "abilityCategory": "signature",
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
  "id": "ability.conduit.lightfall",
  "nameZhHant": "天降光霖",
  "aliasesZhHant": [],
  "flavor": "神聖之光如雨傾瀉而下，淨化敵人並重新部署盟友。",
  "powerRoll": {
    "tiers": [
      {
        "threshold": "≤11",
        "text": "2 神聖傷害"
      },
      {
        "threshold": "12-16",
        "text": "3 神聖傷害"
      },
      {
        "threshold": "17+",
        "text": "5 神聖傷害"
      }
    ]
  },
  "effect": [
    "你可以將自己和區域內的每個盟友傳送至區域內的未占據的空間。"
  ],
  "meta": {
    "status": "reviewed",
    "translationSource": "舊 Notion 神導士招式 · 天降光霖（同上檔）",
    "commonProcessing": [
      "數值與效果與舊譯逐字相符，僅套用格式規則"
    ],
    "decisions": [],
    "pendingOwnerDecisions": [],
    "reviewedBy": "owner",
    "reviewedAt": "2026-07-31"
  },
  "canonRef": {
    "id": "ability.conduit.lightfall",
    "document": "heroes-v1.01-05-conduit",
    "printedPage": 99
  }
}
```

**結構與翻譯注意事項**

- 數值與效果與舊譯逐字相符，僅套用格式規則

**擁有者裁決**

- [ ] 核准，內容與結構皆可進入正式 M1
- [ ] 需要修改

擁有者備註：

>

---
### 7. 犧牲奉獻 · Sacrificial Offer

- ID：`ability.conduit.sacrificial-offer`
- 來源：Heroes v1.01，印刷頁 100（PDF 頁 7）
- Canon 狀態：`verified`；繁中狀態：`reviewed`
- TI／裁決：無個別 TI；套用全域指南

**英文正典**

```json
{
  "id": "ability.conduit.sacrificial-offer",
  "type": "ability",
  "name": "Sacrificial Offer",
  "aliasesEn": [],
  "flavor": "Divine magic tears at your foe and defends a nearby friend.",
  "keywords": [
    "magic",
    "ranged",
    "strike"
  ],
  "actionType": "main",
  "cost": null,
  "distance": {
    "kind": "ranged",
    "value": 10,
    "raw": "Ranged 10"
  },
  "target": "One creature",
  "powerRoll": {
    "characteristic": "intuition",
    "tiers": [
      {
        "threshold": "≤11",
        "text": "2 + I corruption damage",
        "raw": "2 + I corruption damage"
      },
      {
        "threshold": "12-16",
        "text": "4 + I corruption damage",
        "raw": "4 + I corruption damage"
      },
      {
        "threshold": "17+",
        "text": "6 + I corruption damage",
        "raw": "6 + I corruption damage"
      }
    ]
  },
  "effect": [
    "Choose yourself or one ally within distance. That character can impose a bane on one power roll made against them before the end of their next turn."
  ],
  "origin": {
    "kind": "class",
    "id": "class.conduit"
  },
  "abilityCategory": "signature",
  "level": 1,
  "canonReviewStatus": "verified",
  "source": {
    "document": "heroes-v1.01-05-conduit",
    "version": "1.01",
    "pdfPage": 7,
    "printedPage": 100,
    "checkedAt": "2026-07-31"
  }
}
```

**繁中內容**

```json
{
  "id": "ability.conduit.sacrificial-offer",
  "nameZhHant": "犧牲奉獻",
  "aliasesZhHant": [],
  "flavor": "神聖魔法撕裂你的敵人並守護附近的盟友。",
  "powerRoll": {
    "tiers": [
      {
        "threshold": "≤11",
        "text": "2 + `直覺`腐朽傷害"
      },
      {
        "threshold": "12-16",
        "text": "4 + `直覺`腐朽傷害"
      },
      {
        "threshold": "17+",
        "text": "6 + `直覺`腐朽傷害"
      }
    ]
  },
  "effect": [
    "選擇你自己或射程內的 1 個盟友。在該角色的下個回合結束前，他可以讓針對他的 1 次檢定承受 1 個劣勢。"
  ],
  "meta": {
    "status": "reviewed",
    "translationSource": "舊 Notion 神導士招式 · 犧牲奉獻（同上檔）",
    "commonProcessing": [
      "數值與效果與舊譯逐字相符，僅套用格式規則"
    ],
    "decisions": [],
    "pendingOwnerDecisions": [],
    "reviewedBy": "owner",
    "reviewedAt": "2026-07-31"
  },
  "canonRef": {
    "id": "ability.conduit.sacrificial-offer",
    "document": "heroes-v1.01-05-conduit",
    "printedPage": 100
  }
}
```

**結構與翻譯注意事項**

- 數值與效果與舊譯逐字相符，僅套用格式規則

**擁有者裁決**

- [ ] 核准，內容與結構皆可進入正式 M1
- [ ] 需要修改

擁有者備註：

>

---
### 8. 恍惚詛咒 · Staggering Curse

- ID：`ability.conduit.staggering-curse`
- 來源：Heroes v1.01，印刷頁 100（PDF 頁 7）
- Canon 狀態：`verified`；繁中狀態：`reviewed`
- TI／裁決：無個別 TI；套用全域指南

**英文正典**

```json
{
  "id": "ability.conduit.staggering-curse",
  "type": "ability",
  "name": "Staggering Curse",
  "aliasesEn": [],
  "flavor": "A blast of judgment disorients your foe.",
  "keywords": [
    "magic",
    "melee",
    "strike"
  ],
  "actionType": "main",
  "cost": null,
  "distance": {
    "kind": "melee",
    "value": 1,
    "raw": "Melee 1"
  },
  "target": "One creature or object",
  "powerRoll": {
    "characteristic": "intuition",
    "tiers": [
      {
        "threshold": "≤11",
        "text": "3 + I holy damage; slide 1",
        "raw": "3 + I holy damage; slide 1"
      },
      {
        "threshold": "12-16",
        "text": "5 + I holy damage; slide 2",
        "raw": "5 + I holy damage; slide 2"
      },
      {
        "threshold": "17+",
        "text": "8 + I holy damage; slide 3",
        "raw": "8 + I holy damage; slide 3"
      }
    ]
  },
  "origin": {
    "kind": "class",
    "id": "class.conduit"
  },
  "abilityCategory": "signature",
  "level": 1,
  "canonReviewStatus": "verified",
  "source": {
    "document": "heroes-v1.01-05-conduit",
    "version": "1.01",
    "pdfPage": 7,
    "printedPage": 100,
    "checkedAt": "2026-07-31"
  }
}
```

**繁中內容**

```json
{
  "id": "ability.conduit.staggering-curse",
  "nameZhHant": "恍惚詛咒",
  "aliasesZhHant": [],
  "flavor": "一道審判之光讓你的敵人迷失方向。",
  "powerRoll": {
    "tiers": [
      {
        "threshold": "≤11",
        "text": "3 + `直覺`神聖傷害；滑動 1"
      },
      {
        "threshold": "12-16",
        "text": "5 + `直覺`神聖傷害；滑動 2"
      },
      {
        "threshold": "17+",
        "text": "8 + `直覺`神聖傷害；滑動 3"
      }
    ]
  },
  "meta": {
    "status": "reviewed",
    "translationSource": "舊 Notion 神導士招式 · 恍惚詛咒（同上檔）",
    "commonProcessing": [
      "數值與效果與舊譯逐字相符，僅套用格式規則"
    ],
    "decisions": [],
    "pendingOwnerDecisions": [],
    "reviewedBy": "owner",
    "reviewedAt": "2026-07-31"
  },
  "canonRef": {
    "id": "ability.conduit.staggering-curse",
    "document": "heroes-v1.01-05-conduit",
    "printedPage": 100
  }
}
```

**結構與翻譯注意事項**

- 數值與效果與舊譯逐字相符，僅套用格式規則

**擁有者裁決**

- [ ] 核准，內容與結構皆可進入正式 M1
- [ ] 需要修改

擁有者備註：

>

---
### 9. 勇士禱詞 · Warrior's Prayer

- ID：`ability.conduit.warriors-prayer`
- 來源：Heroes v1.01，印刷頁 100（PDF 頁 7）
- Canon 狀態：`verified`；繁中狀態：`reviewed`
- TI／裁決：無個別 TI；套用全域指南

**英文正典**

```json
{
  "id": "ability.conduit.warriors-prayer",
  "type": "ability",
  "name": "Warrior's Prayer",
  "aliasesEn": [],
  "flavor": "Your quickly uttered prayer lends aggressive divine energy to a friend engaged in melee.",
  "keywords": [
    "magic",
    "ranged",
    "strike"
  ],
  "actionType": "main",
  "cost": null,
  "distance": {
    "kind": "ranged",
    "value": 10,
    "raw": "Ranged 10"
  },
  "target": "One creature",
  "powerRoll": {
    "characteristic": "intuition",
    "tiers": [
      {
        "threshold": "≤11",
        "text": "3 + I holy damage",
        "raw": "3 + I holy damage"
      },
      {
        "threshold": "12-16",
        "text": "6 + I holy damage",
        "raw": "6 + I holy damage"
      },
      {
        "threshold": "17+",
        "text": "9 + I holy damage",
        "raw": "9 + I holy damage"
      }
    ]
  },
  "effect": [
    "You or one ally within distance gains temporary Stamina equal to your Intuition score."
  ],
  "origin": {
    "kind": "class",
    "id": "class.conduit"
  },
  "abilityCategory": "signature",
  "level": 1,
  "canonReviewStatus": "verified",
  "source": {
    "document": "heroes-v1.01-05-conduit",
    "version": "1.01",
    "pdfPage": 7,
    "printedPage": 100,
    "checkedAt": "2026-07-31"
  }
}
```

**繁中內容**

```json
{
  "id": "ability.conduit.warriors-prayer",
  "nameZhHant": "勇士禱詞",
  "aliasesZhHant": [],
  "flavor": "你迅速低聲祈禱，為陷入混戰的盟友灌注猛烈的神聖能量。",
  "powerRoll": {
    "tiers": [
      {
        "threshold": "≤11",
        "text": "3 + `直覺`神聖傷害"
      },
      {
        "threshold": "12-16",
        "text": "6 + `直覺`神聖傷害"
      },
      {
        "threshold": "17+",
        "text": "9 + `直覺`神聖傷害"
      }
    ]
  },
  "effect": [
    "你或射程內的 1 個盟友獲得等於你`直覺`的`臨時體力`。"
  ],
  "meta": {
    "status": "reviewed",
    "translationSource": "舊 Notion 神導士招式 · 勇士禱詞（同上檔）",
    "commonProcessing": [
      "數值與效果與舊譯逐字相符，僅套用格式規則"
    ],
    "decisions": [],
    "pendingOwnerDecisions": [],
    "reviewedBy": "owner",
    "reviewedAt": "2026-07-31"
  },
  "canonRef": {
    "id": "ability.conduit.warriors-prayer",
    "document": "heroes-v1.01-05-conduit",
    "printedPage": 100
  }
}
```

**結構與翻譯注意事項**

- 數值與效果與舊譯逐字相符，僅套用格式規則

**擁有者裁決**

- [ ] 核准，內容與結構皆可進入正式 M1
- [ ] 需要修改

擁有者備註：

>

---
### 10. 凋零箭 · Wither

- ID：`ability.conduit.wither`
- 來源：Heroes v1.01，印刷頁 100（PDF 頁 7）
- Canon 狀態：`verified`；繁中狀態：`reviewed`
- TI／裁決：無個別 TI；套用全域指南

**英文正典**

```json
{
  "id": "ability.conduit.wither",
  "type": "ability",
  "name": "Wither",
  "aliasesEn": [],
  "flavor": "A bolt of holy energy saps the life from a foe.",
  "keywords": [
    "magic",
    "ranged",
    "strike"
  ],
  "actionType": "main",
  "cost": null,
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
        "text": "3 + I corruption damage",
        "potency": {
          "characteristic": "presence",
          "level": "weak",
          "effect": "the target takes a bane on their next power roll"
        },
        "raw": "3 + I corruption damage; P<WEAK, the target takes a bane on their next power roll"
      },
      {
        "threshold": "12-16",
        "text": "5 + I corruption damage",
        "potency": {
          "characteristic": "presence",
          "level": "average",
          "effect": "the target takes a bane on their next power roll"
        },
        "raw": "5 + I corruption damage; P<AVERAGE, the target takes a bane on their next power roll"
      },
      {
        "threshold": "17+",
        "text": "8 + I corruption damage",
        "potency": {
          "characteristic": "presence",
          "level": "strong",
          "effect": "the target takes a bane on their next power roll"
        },
        "raw": "8 + I corruption damage; P<STRONG, the target takes a bane on their next power roll"
      }
    ]
  },
  "origin": {
    "kind": "class",
    "id": "class.conduit"
  },
  "abilityCategory": "signature",
  "level": 1,
  "canonReviewStatus": "verified",
  "source": {
    "document": "heroes-v1.01-05-conduit",
    "version": "1.01",
    "pdfPage": 7,
    "printedPage": 100,
    "checkedAt": "2026-07-31"
  }
}
```

**繁中內容**

```json
{
  "id": "ability.conduit.wither",
  "nameZhHant": "凋零箭",
  "aliasesZhHant": [],
  "flavor": "你射出一道汲取敵人生命力的神聖能量箭矢。",
  "powerRoll": {
    "tiers": [
      {
        "threshold": "≤11",
        "text": "3 + `直覺`腐朽傷害",
        "potencyEffect": "目標的下次檢定承受 1 個劣勢"
      },
      {
        "threshold": "12-16",
        "text": "5 + `直覺`腐朽傷害",
        "potencyEffect": "目標的下次檢定承受 1 個劣勢"
      },
      {
        "threshold": "17+",
        "text": "8 + `直覺`腐朽傷害",
        "potencyEffect": "目標的下次檢定承受 1 個劣勢"
      }
    ]
  },
  "meta": {
    "status": "reviewed",
    "translationSource": "舊 Notion 神導士招式 · 凋零箭（同上檔）",
    "commonProcessing": [
      "數值與效果與舊譯逐字相符，僅套用 N-1（potencyEffect 不重複效力記號）與格式規則"
    ],
    "decisions": [],
    "pendingOwnerDecisions": [],
    "reviewedBy": "owner",
    "reviewedAt": "2026-07-31"
  },
  "canonRef": {
    "id": "ability.conduit.wither",
    "document": "heroes-v1.01-05-conduit",
    "printedPage": 100
  }
}
```

**結構與翻譯注意事項**

- 數值與效果與舊譯逐字相符，僅套用 N-1（potencyEffect 不重複效力記號）與格式規則

**擁有者裁決**

- [ ] 核准，內容與結構皆可進入正式 M1
- [ ] 需要修改

擁有者備註：

>

---
### 11. 引導之聲 · Word of Guidance

- ID：`ability.conduit.word-of-guidance`
- 來源：Heroes v1.01，印刷頁 98（PDF 頁 5）
- Canon 狀態：`verified`；繁中狀態：`reviewed`
- TI／裁決：無個別 TI；套用全域指南

**英文正典**

```json
{
  "id": "ability.conduit.word-of-guidance",
  "type": "ability",
  "name": "Word of Guidance",
  "aliasesEn": [],
  "flavor": "You invigorate an attacking ally with divine energy.",
  "keywords": [
    "magic",
    "ranged"
  ],
  "actionType": "triggered",
  "cost": null,
  "distance": {
    "kind": "ranged",
    "value": 10,
    "raw": "Ranged 10"
  },
  "target": "One ally",
  "trigger": "The target makes an ability roll for a damage-dealing ability.",
  "effect": [
    "The power roll gains an edge."
  ],
  "extraCosts": [
    {
      "resource": "piety",
      "value": 1,
      "effect": "The power roll has a double edge.",
      "raw": "Spend 1 Piety: The power roll has a double edge."
    }
  ],
  "origin": {
    "kind": "class",
    "id": "class.conduit"
  },
  "abilityCategory": "inherent",
  "level": 1,
  "canonReviewStatus": "verified",
  "source": {
    "document": "heroes-v1.01-05-conduit",
    "version": "1.01",
    "pdfPage": 5,
    "printedPage": 98,
    "checkedAt": "2026-07-31"
  }
}
```

**繁中內容**

```json
{
  "id": "ability.conduit.word-of-guidance",
  "nameZhHant": "引導之聲",
  "aliasesZhHant": [],
  "flavor": "你運用神聖能量激勵正在發動攻擊的盟友。",
  "trigger": "當目標進行會造成傷害的招式檢定時。",
  "effect": [
    "該次檢定獲得 1 個優勢。"
  ],
  "extraCosts": [
    {
      "effect": "該次檢定獲得雙優勢。"
    }
  ],
  "meta": {
    "status": "reviewed",
    "translationSource": "舊 Notion 觸發式動作 · 引導之聲（sources/notion-export/class-notion/conduit/觸發式動作 239f74afd25b80b68c83c8c2b4c904da.md）",
    "commonProcessing": [
      "trigger／effect／extraCosts 與舊譯逐句相符，僅套用格式規則"
    ],
    "decisions": [],
    "pendingOwnerDecisions": [],
    "reviewedBy": "owner",
    "reviewedAt": "2026-07-31"
  },
  "canonRef": {
    "id": "ability.conduit.word-of-guidance",
    "document": "heroes-v1.01-05-conduit",
    "printedPage": 98
  }
}
```

**結構與翻譯注意事項**

- trigger／effect／extraCosts 與舊譯逐句相符，僅套用格式規則

**擁有者裁決**

- [ ] 核准，內容與結構皆可進入正式 M1
- [ ] 需要修改

擁有者備註：

>

---
### 12. 審判之聲 · Word of Judgment

- ID：`ability.conduit.word-of-judgment`
- 來源：Heroes v1.01，印刷頁 98（PDF 頁 5）
- Canon 狀態：`verified`；繁中狀態：`reviewed`
- TI／裁決：無個別 TI；套用全域指南

**英文正典**

```json
{
  "id": "ability.conduit.word-of-judgment",
  "type": "ability",
  "name": "Word of Judgment",
  "aliasesEn": [],
  "flavor": "Your holy word saps an attacking enemy's strength.",
  "keywords": [
    "magic",
    "ranged"
  ],
  "actionType": "triggered",
  "cost": null,
  "distance": {
    "kind": "ranged",
    "value": 10,
    "raw": "Ranged 10"
  },
  "target": "One ally",
  "trigger": "The target would take damage from an ability that uses a power roll.",
  "effect": [
    "The power roll takes a bane against the target."
  ],
  "extraCosts": [
    {
      "resource": "piety",
      "value": 1,
      "effect": "The power roll has a double bane against the target.",
      "raw": "Spend 1 Piety: The power roll has a double bane against the target."
    }
  ],
  "origin": {
    "kind": "class",
    "id": "class.conduit"
  },
  "abilityCategory": "inherent",
  "level": 1,
  "canonReviewStatus": "verified",
  "source": {
    "document": "heroes-v1.01-05-conduit",
    "version": "1.01",
    "pdfPage": 5,
    "printedPage": 98,
    "checkedAt": "2026-07-31"
  }
}
```

**繁中內容**

```json
{
  "id": "ability.conduit.word-of-judgment",
  "nameZhHant": "審判之聲",
  "aliasesZhHant": [],
  "flavor": "你的神聖言語削弱了敵人的攻勢。",
  "trigger": "當目標即將受到招式檢定的傷害時。",
  "effect": [
    "針對目標的該次檢定承受 1 個劣勢。"
  ],
  "extraCosts": [
    {
      "effect": "針對目標的該次檢定承受雙劣勢。"
    }
  ],
  "meta": {
    "status": "reviewed",
    "translationSource": "舊 Notion 觸發式動作 · 審判之聲（同上檔）",
    "commonProcessing": [
      "trigger／effect／extraCosts 與舊譯逐句相符，僅套用格式規則"
    ],
    "decisions": [],
    "pendingOwnerDecisions": [],
    "reviewedBy": "owner",
    "reviewedAt": "2026-07-31"
  },
  "canonRef": {
    "id": "ability.conduit.word-of-judgment",
    "document": "heroes-v1.01-05-conduit",
    "printedPage": 98
  }
}
```

**結構與翻譯注意事項**

- trigger／effect／extraCosts 與舊譯逐句相符，僅套用格式規則

**擁有者裁決**

- [ ] 核准，內容與結構皆可進入正式 M1
- [ ] 需要修改

擁有者備註：

>

---
### 13. 治癒恩典 · Healing Grace

- ID：`ability.conduit.healing-grace`
- 來源：Heroes v1.01，印刷頁 98（PDF 頁 5）
- Canon 狀態：`verified`；繁中狀態：`reviewed`
- TI／裁決：無個別 TI；套用全域指南

**英文正典**

```json
{
  "id": "ability.conduit.healing-grace",
  "type": "ability",
  "name": "Healing Grace",
  "aliasesEn": [],
  "usageNote": "You have the following ability, which you can use once on your turn.",
  "flavor": "Your divine energy restores the righteous.",
  "keywords": [
    "magic",
    "ranged"
  ],
  "actionType": "maneuver",
  "cost": null,
  "distance": {
    "kind": "ranged",
    "value": 10,
    "raw": "Ranged 10"
  },
  "target": "Self or one ally",
  "effect": [
    "The target can spend a Recovery."
  ],
  "extraCosts": [
    {
      "resource": "piety",
      "value": 1,
      "open": true,
      "lead": "For each piety spent, choose one of the following enhancements:",
      "options": [
        "You can target one additional ally within distance.",
        "You can end one effect on a target that is ended by a saving throw or that ends at the end of their turn.",
        "A prone target can stand up.",
        "A target can spend 1 additional Recovery."
      ],
      "raw": "Spend 1+ Piety: For each piety spent, choose one of the following enhancements: You can target one additional ally within distance. You can end one effect on a target that is ended by a saving throw or that ends at the end of their turn. A prone target can stand up. A target can spend 1 additional Recovery."
    }
  ],
  "origin": {
    "kind": "class",
    "id": "class.conduit"
  },
  "abilityCategory": "inherent",
  "level": 1,
  "canonReviewStatus": "verified",
  "source": {
    "document": "heroes-v1.01-05-conduit",
    "version": "1.01",
    "pdfPage": 5,
    "printedPage": 98,
    "checkedAt": "2026-07-31"
  }
}
```

**繁中內容**

```json
{
  "id": "ability.conduit.healing-grace",
  "nameZhHant": "治癒恩典",
  "aliasesZhHant": [],
  "usageNote": "你擁有以下招式，你的每回合可以使用 1 次。",
  "flavor": "你的神聖能量可以治療正義之士。",
  "effect": [
    "目標可以花費 1 點`復元力`。"
  ],
  "extraCosts": [
    {
      "lead": "每花費 1 點`虔誠`，選擇以下 1 種效果：",
      "options": [
        "你可以額外指定射程內的 1 個盟友作為目標。",
        "你可以為目標解除 1 個能夠透過豁免解除或 EoT 的狀態或效果。",
        "目標可以從伏地狀態起身。",
        "目標可以額外花費 1 點`復元力`。"
      ]
    }
  ],
  "meta": {
    "status": "reviewed",
    "translationSource": "舊 Notion 治癒恩典（sources/notion-export/class-notion/conduit/治癒恩典 239f74afd25b80b4a56ce0b58082eecc.md）",
    "commonProcessing": [
      "舊譯將 4 個加值選項合併寫成一段連續文字（用「-」條列），本批依正典的條列結構拆成 options[]，逐句取自舊譯原句",
      "\"prone\" 狀態連結：舊譯原句含 Notion 內部連結，本批僅取純文字「伏地」，不建立站內連結（比照 TI-16 以外的既有作法，未連結的狀態名稱維持純文字）",
      "2026-07-31 Reviewer 複核，擁有者確認接受 extraCosts 的 options/lead/open 新結構與 usageNote 新欄位，不再列為待裁",
      "2026-07-31 Reviewer 複核：第 1 項加值選項舊譯「你可以指定射程內的另一個盟友作為目標」未明確表達正典「one additional ally」的「額外」語意，已訂正為「你可以額外指定射程內的 1 個盟友作為目標」"
    ],
    "decisions": [],
    "pendingOwnerDecisions": [],
    "reviewedBy": "owner",
    "reviewedAt": "2026-07-31"
  },
  "canonRef": {
    "id": "ability.conduit.healing-grace",
    "document": "heroes-v1.01-05-conduit",
    "printedPage": 98
  }
}
```

**結構與翻譯注意事項**

- 舊譯將 4 個加值選項合併寫成一段連續文字（用「-」條列），本批依正典的條列結構拆成 options[]，逐句取自舊譯原句
- "prone" 狀態連結：舊譯原句含 Notion 內部連結，本批僅取純文字「伏地」，不建立站內連結（比照 TI-16 以外的既有作法，未連結的狀態名稱維持純文字）
- 2026-07-31 Reviewer 複核，擁有者確認接受 extraCosts 的 options/lead/open 新結構與 usageNote 新欄位，不再列為待裁
- 2026-07-31 Reviewer 複核：第 1 項加值選項舊譯「你可以指定射程內的另一個盟友作為目標」未明確表達正典「one additional ally」的「額外」語意，已訂正為「你可以額外指定射程內的 1 個盟友作為目標」

**擁有者裁決**

- [ ] 核准，內容與結構皆可進入正式 M1
- [ ] 需要修改

擁有者備註：

>

---
### 14. 神怒光束 · Ray of Wrath

- ID：`ability.conduit.ray-of-wrath`
- 來源：Heroes v1.01，印刷頁 98（PDF 頁 5）
- Canon 狀態：`verified`；繁中狀態：`reviewed`
- TI／裁決：無個別 TI；套用全域指南

**英文正典**

```json
{
  "id": "ability.conduit.ray-of-wrath",
  "type": "ability",
  "name": "Ray of Wrath",
  "aliasesEn": [],
  "usageNote": "You have the following ability, which can be used as a ranged free strike.",
  "flavor": "You unleash a blast of holy light upon your foe.",
  "keywords": [
    "magic",
    "ranged",
    "strike"
  ],
  "actionType": "main",
  "cost": null,
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
        "text": "2 + I damage",
        "raw": "2 + I damage"
      },
      {
        "threshold": "12-16",
        "text": "4 + I damage",
        "raw": "4 + I damage"
      },
      {
        "threshold": "17+",
        "text": "6 + I damage",
        "raw": "6 + I damage"
      }
    ]
  },
  "effect": [
    "You can have this ability deal holy damage."
  ],
  "origin": {
    "kind": "class",
    "id": "class.conduit"
  },
  "abilityCategory": "inherent",
  "level": 1,
  "canonReviewStatus": "verified",
  "source": {
    "document": "heroes-v1.01-05-conduit",
    "version": "1.01",
    "pdfPage": 5,
    "printedPage": 98,
    "checkedAt": "2026-07-31"
  }
}
```

**繁中內容**

```json
{
  "id": "ability.conduit.ray-of-wrath",
  "nameZhHant": "神怒光束",
  "aliasesZhHant": [],
  "usageNote": "你擁有以下招式，可作為遠程基礎打擊使用。",
  "flavor": "你對敵人釋放一道聖光衝擊。",
  "powerRoll": {
    "tiers": [
      {
        "threshold": "≤11",
        "text": "2 + `直覺`傷害"
      },
      {
        "threshold": "12-16",
        "text": "4 + `直覺`傷害"
      },
      {
        "threshold": "17+",
        "text": "6 + `直覺`傷害"
      }
    ]
  },
  "effect": [
    "你可以讓此招式改為造成神聖傷害。"
  ],
  "meta": {
    "status": "reviewed",
    "translationSource": "舊 Notion 神怒光束（sources/notion-export/class-notion/conduit/神怒光束 239f74afd25b80609caef15cbd403994.md）",
    "commonProcessing": [
      "數值與效果與舊譯逐字相符，僅套用格式規則",
      "2026-07-31 Reviewer 複核，擁有者確認接受 usageNote 新欄位，不再列為待裁"
    ],
    "decisions": [],
    "pendingOwnerDecisions": [],
    "reviewedBy": "owner",
    "reviewedAt": "2026-07-31"
  },
  "canonRef": {
    "id": "ability.conduit.ray-of-wrath",
    "document": "heroes-v1.01-05-conduit",
    "printedPage": 98
  }
}
```

**結構與翻譯注意事項**

- 數值與效果與舊譯逐字相符，僅套用格式規則
- 2026-07-31 Reviewer 複核，擁有者確認接受 usageNote 新欄位，不再列為待裁

**擁有者裁決**

- [ ] 核准，內容與結構皆可進入正式 M1
- [ ] 需要修改

擁有者備註：

>

---
### 15. 喚雷降世 · Call the Thunder Down

- ID：`ability.conduit.call-the-thunder-down`
- 來源：Heroes v1.01，印刷頁 101（PDF 頁 8）
- Canon 狀態：`verified`；繁中狀態：`reviewed`
- TI／裁決：無個別 TI；套用全域指南

**英文正典**

```json
{
  "id": "ability.conduit.call-the-thunder-down",
  "type": "ability",
  "name": "Call the Thunder Down",
  "aliasesEn": [],
  "flavor": "You ask your saint for thunder and your prayer is answered.",
  "keywords": [
    "area",
    "magic",
    "ranged"
  ],
  "actionType": "main",
  "cost": {
    "resource": "piety",
    "value": 3
  },
  "distance": {
    "kind": "area",
    "area": {
      "shape": "cube",
      "size": 3,
      "within": 10
    },
    "raw": "3 cube within 10"
  },
  "target": "Each enemy in the area",
  "powerRoll": {
    "characteristic": "intuition",
    "tiers": [
      {
        "threshold": "≤11",
        "text": "2 sonic damage; push 1",
        "raw": "2 sonic damage; push 1"
      },
      {
        "threshold": "12-16",
        "text": "3 sonic damage; push 2",
        "raw": "3 sonic damage; push 2"
      },
      {
        "threshold": "17+",
        "text": "5 sonic damage; push 3",
        "raw": "5 sonic damage; push 3"
      }
    ]
  },
  "effect": [
    "You can push each willing ally in the area the same distance, ignoring stability."
  ],
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
  "id": "ability.conduit.call-the-thunder-down",
  "nameZhHant": "喚雷降世",
  "aliasesZhHant": [],
  "flavor": "你向聖者祈求雷霆，而你的祈禱得到了回應。",
  "powerRoll": {
    "tiers": [
      {
        "threshold": "≤11",
        "text": "2 音波傷害；推動 1"
      },
      {
        "threshold": "12-16",
        "text": "3 音波傷害；推動 2"
      },
      {
        "threshold": "17+",
        "text": "5 音波傷害；推動 3"
      }
    ]
  },
  "effect": [
    "你可以將區域內的每個自願盟友推動等量距離，無視`穩度`。"
  ],
  "meta": {
    "status": "reviewed",
    "translationSource": "舊 Notion 神導士招式 · 喚雷降世（sources/notion-export/class-notion/conduit/神導士招式 239f74afd25b80eb8f74ce7e7a785c42.md）",
    "commonProcessing": [
      "數值與效果與舊譯逐字相符，僅套用 N-2 與格式規則"
    ],
    "decisions": [],
    "pendingOwnerDecisions": [],
    "reviewedBy": "owner",
    "reviewedAt": "2026-07-31"
  },
  "canonRef": {
    "id": "ability.conduit.call-the-thunder-down",
    "document": "heroes-v1.01-05-conduit",
    "printedPage": 101
  }
}
```

**結構與翻譯注意事項**

- 數值與效果與舊譯逐字相符，僅套用 N-2 與格式規則

**擁有者裁決**

- [ ] 核准，內容與結構皆可進入正式 M1
- [ ] 需要修改

擁有者備註：

>

---
### 16. 神怒之泉 · Font of Wrath

- ID：`ability.conduit.font-of-wrath`
- 來源：Heroes v1.01，印刷頁 101（PDF 頁 8）
- Canon 狀態：`verified`；繁中狀態：`reviewed`
- TI／裁決：無個別 TI；套用全域指南

**英文正典**

```json
{
  "id": "ability.conduit.font-of-wrath",
  "type": "ability",
  "name": "Font of Wrath",
  "aliasesEn": [],
  "flavor": "A brilliant column of holy light appears on the battlefield, striking out at nearby enemies.",
  "keywords": [
    "magic",
    "ranged"
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
  "target": "Special",
  "effect": [
    "You summon a spirit of size 2 who can't be harmed, and who appears in an unoccupied space within distance. The spirit lasts until the end of your next turn. You and your allies can move through the spirit's space, but enemies can't. Any enemy who moves within 2 squares of the spirit for the first time in a combat round or starts their turn there takes holy damage equal to your Intuition score."
  ],
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
  "id": "ability.conduit.font-of-wrath",
  "nameZhHant": "神怒之泉",
  "aliasesZhHant": [],
  "flavor": "戰場上湧現一道璀璨的神聖光柱，攻擊周圍的敵人。",
  "effect": [
    "你召喚 1 個`體型`為 2 且不會受傷的靈體，出現在射程內的未占據空間。靈體會持續到你下個回合結束。你和你的盟友可以穿越靈體的空間，但敵人無法。每個敵人在每個戰鬥輪中首次移動至靈體 2 格內，或在該處開始其回合時，會各自受到等於你`直覺`的神聖傷害。"
  ],
  "meta": {
    "status": "reviewed",
    "translationSource": "舊 Notion 神導士招式 · 神怒之泉（同上檔）",
    "commonProcessing": [
      "2026-07-31 Reviewer 複核指出：舊譯「每輪 1 次，當任何敵人首次…時」的句式會讓人誤讀成「整個效果每輪只觸發 1 次（只影響 1 個敵人）」，但正典「for the first time in a combat round」的限定對象是**每個敵人各自**（同一輪內可以有多個不同敵人各自觸發 1 次）。已改為「每個敵人在每個戰鬥輪中首次…時，會各自受到…」，把「每輪限定」明確綁定在「每個敵人」身上，消除歧義"
    ],
    "decisions": [],
    "pendingOwnerDecisions": [],
    "reviewedBy": "owner",
    "reviewedAt": "2026-07-31"
  },
  "canonRef": {
    "id": "ability.conduit.font-of-wrath",
    "document": "heroes-v1.01-05-conduit",
    "printedPage": 101
  }
}
```

**結構與翻譯注意事項**

- 2026-07-31 Reviewer 複核指出：舊譯「每輪 1 次，當任何敵人首次…時」的句式會讓人誤讀成「整個效果每輪只觸發 1 次（只影響 1 個敵人）」，但正典「for the first time in a combat round」的限定對象是**每個敵人各自**（同一輪內可以有多個不同敵人各自觸發 1 次）。已改為「每個敵人在每個戰鬥輪中首次…時，會各自受到…」，把「每輪限定」明確綁定在「每個敵人」身上，消除歧義

**擁有者裁決**

- [ ] 核准，內容與結構皆可進入正式 M1
- [ ] 需要修改

擁有者備註：

>

---
### 17. 暴力無濟於事 · Violence Will Not Aid Thee

- ID：`ability.conduit.violence-will-not-aid-thee`
- 來源：Heroes v1.01，印刷頁 101（PDF 頁 8）
- Canon 狀態：`verified`；繁中狀態：`reviewed`
- TI／裁決：無個別 TI；套用全域指南

**英文正典**

```json
{
  "id": "ability.conduit.violence-will-not-aid-thee",
  "type": "ability",
  "name": "Violence Will Not Aid Thee",
  "aliasesEn": [],
  "flavor": "After some holy lightning, your enemy will think twice about their next attack.",
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
  "target": "One creature",
  "powerRoll": {
    "characteristic": "intuition",
    "tiers": [
      {
        "threshold": "≤11",
        "text": "3 + I lightning damage",
        "raw": "3 + I lightning damage"
      },
      {
        "threshold": "12-16",
        "text": "6 + I lightning damage",
        "raw": "6 + I lightning damage"
      },
      {
        "threshold": "17+",
        "text": "9 + I lightning damage",
        "raw": "9 + I lightning damage"
      }
    ]
  },
  "effect": [
    "The first time on a turn that the target deals damage to another creature, the target of this ability takes 1d10 lightning damage (save ends)."
  ],
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
  "id": "ability.conduit.violence-will-not-aid-thee",
  "nameZhHant": "暴力無濟於事",
  "aliasesZhHant": [],
  "flavor": "在幾道神聖閃電之後，你的敵人會懂得三思而後行。",
  "powerRoll": {
    "tiers": [
      {
        "threshold": "≤11",
        "text": "3 + `直覺`閃電傷害"
      },
      {
        "threshold": "12-16",
        "text": "6 + `直覺`閃電傷害"
      },
      {
        "threshold": "17+",
        "text": "9 + `直覺`閃電傷害"
      }
    ]
  },
  "effect": [
    "當目標在 1 個回合中首次對其他生物造成傷害時，目標會受到 1D10 閃電傷害（豁免解除）。"
  ],
  "meta": {
    "status": "reviewed",
    "translationSource": "舊 Notion 神導士招式 · 暴力無濟於事（同上檔）",
    "commonProcessing": [
      "數值與效果與舊譯逐字相符，僅套用格式規則"
    ],
    "decisions": [],
    "pendingOwnerDecisions": [],
    "reviewedBy": "owner",
    "reviewedAt": "2026-07-31"
  },
  "canonRef": {
    "id": "ability.conduit.violence-will-not-aid-thee",
    "document": "heroes-v1.01-05-conduit",
    "printedPage": 101
  }
}
```

**結構與翻譯注意事項**

- 數值與效果與舊譯逐字相符，僅套用格式規則

**擁有者裁決**

- [ ] 核准，內容與結構皆可進入正式 M1
- [ ] 需要修改

擁有者備註：

>

---
### 18. 腐化詛咒 · Corruption's Curse

- ID：`ability.conduit.corruptions-curse`
- 來源：Heroes v1.01，印刷頁 101（PDF 頁 8）
- Canon 狀態：`verified`；繁中狀態：`reviewed`
- TI／裁決：無個別 TI；套用全域指南

**英文正典**

```json
{
  "id": "ability.conduit.corruptions-curse",
  "type": "ability",
  "name": "Corruption's Curse",
  "aliasesEn": [],
  "flavor": "Cursed by you, your enemy takes more damage from your allies.",
  "keywords": [
    "magic",
    "ranged",
    "strike"
  ],
  "actionType": "main",
  "cost": {
    "resource": "piety",
    "value": 5
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
        "text": "3 + I corruption damage",
        "potency": {
          "characteristic": "might",
          "level": "weak",
          "effect": "damage weakness 5 (save ends)"
        },
        "raw": "3 + I corruption damage; M<WEAK, damage weakness 5 (save ends)"
      },
      {
        "threshold": "12-16",
        "text": "6 + I corruption damage",
        "potency": {
          "characteristic": "might",
          "level": "average",
          "effect": "damage weakness 5 (save ends)"
        },
        "raw": "6 + I corruption damage; M<AVERAGE, damage weakness 5 (save ends)"
      },
      {
        "threshold": "17+",
        "text": "9 + I corruption damage",
        "potency": {
          "characteristic": "might",
          "level": "strong",
          "effect": "damage weakness 5 (save ends)"
        },
        "raw": "9 + I corruption damage; M<STRONG, damage weakness 5 (save ends)"
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
  "id": "ability.conduit.corruptions-curse",
  "nameZhHant": "腐化詛咒",
  "aliasesZhHant": [],
  "flavor": "你的詛咒讓敵人被盟友攻擊時會承受更多傷害。",
  "powerRoll": {
    "tiers": [
      {
        "threshold": "≤11",
        "text": "3 + `直覺`腐朽傷害",
        "potencyEffect": "傷害弱點 5（豁免解除）"
      },
      {
        "threshold": "12-16",
        "text": "6 + `直覺`腐朽傷害",
        "potencyEffect": "傷害弱點 5（豁免解除）"
      },
      {
        "threshold": "17+",
        "text": "9 + `直覺`腐朽傷害",
        "potencyEffect": "傷害弱點 5（豁免解除）"
      }
    ]
  },
  "meta": {
    "status": "reviewed",
    "translationSource": "舊 Notion 神導士招式 · 腐化詛咒（同上檔）",
    "commonProcessing": [
      "數值與效果與舊譯逐字相符，僅套用 N-1 與格式規則"
    ],
    "decisions": [],
    "pendingOwnerDecisions": [],
    "reviewedBy": "owner",
    "reviewedAt": "2026-07-31"
  },
  "canonRef": {
    "id": "ability.conduit.corruptions-curse",
    "document": "heroes-v1.01-05-conduit",
    "printedPage": 101
  }
}
```

**結構與翻譯注意事項**

- 數值與效果與舊譯逐字相符，僅套用 N-1 與格式規則

**擁有者裁決**

- [ ] 核准，內容與結構皆可進入正式 M1
- [ ] 需要修改

擁有者備註：

>

---
### 19. 恐懼詛咒 · Curse of Terror

- ID：`ability.conduit.curse-of-terror`
- 來源：Heroes v1.01，印刷頁 101（PDF 頁 8）
- Canon 狀態：`verified`；繁中狀態：`reviewed`
- TI／裁決：無個別 TI；套用全域指南

**英文正典**

```json
{
  "id": "ability.conduit.curse-of-terror",
  "type": "ability",
  "name": "Curse of Terror",
  "aliasesEn": [],
  "flavor": "Fear of divine judgment overwhelms your foe.",
  "keywords": [
    "magic",
    "ranged",
    "strike"
  ],
  "actionType": "main",
  "cost": {
    "resource": "piety",
    "value": 5
  },
  "distance": {
    "kind": "ranged",
    "value": 10,
    "raw": "Ranged 10"
  },
  "target": "One creature",
  "powerRoll": {
    "characteristic": "intuition",
    "tiers": [
      {
        "threshold": "≤11",
        "text": "6 + I holy damage",
        "potency": {
          "characteristic": "intuition",
          "level": "weak",
          "effect": "frightened (save ends)"
        },
        "raw": "6 + I holy damage; I<WEAK, frightened (save ends)"
      },
      {
        "threshold": "12-16",
        "text": "9 + I holy damage",
        "potency": {
          "characteristic": "intuition",
          "level": "average",
          "effect": "frightened (save ends)"
        },
        "raw": "9 + I holy damage; I<AVERAGE, frightened (save ends)"
      },
      {
        "threshold": "17+",
        "text": "13 + I holy damage",
        "potency": {
          "characteristic": "intuition",
          "level": "strong",
          "effect": "frightened (save ends)"
        },
        "raw": "13 + I holy damage; I<STRONG, frightened (save ends)"
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
  "id": "ability.conduit.curse-of-terror",
  "nameZhHant": "恐懼詛咒",
  "aliasesZhHant": [],
  "flavor": "神聖制裁的恐懼籠罩你的敵人。",
  "powerRoll": {
    "tiers": [
      {
        "threshold": "≤11",
        "text": "6 + `直覺`神聖傷害",
        "potencyEffect": "畏縮（豁免解除）"
      },
      {
        "threshold": "12-16",
        "text": "9 + `直覺`神聖傷害",
        "potencyEffect": "畏縮（豁免解除）"
      },
      {
        "threshold": "17+",
        "text": "13 + `直覺`神聖傷害",
        "potencyEffect": "畏縮（豁免解除）"
      }
    ]
  },
  "meta": {
    "status": "reviewed",
    "translationSource": "舊 Notion 神導士招式 · 恐懼詛咒（同上檔）",
    "commonProcessing": [
      "數值與效果與舊譯逐字相符，僅套用 N-1 與格式規則"
    ],
    "decisions": [],
    "pendingOwnerDecisions": [],
    "reviewedBy": "owner",
    "reviewedAt": "2026-07-31"
  },
  "canonRef": {
    "id": "ability.conduit.curse-of-terror",
    "document": "heroes-v1.01-05-conduit",
    "printedPage": 101
  }
}
```

**結構與翻譯注意事項**

- 數值與效果與舊譯逐字相符，僅套用 N-1 與格式規則

**擁有者裁決**

- [ ] 核准，內容與結構皆可進入正式 M1
- [ ] 需要修改

擁有者備註：

>

---
### 20. 神恩護體 · Faith Is Our Armor

- ID：`ability.conduit.faith-is-our-armor`
- 來源：Heroes v1.01，印刷頁 101（PDF 頁 8）
- Canon 狀態：`verified`；繁中狀態：`reviewed`
- TI／裁決：無個別 TI；套用全域指南

**英文正典**

```json
{
  "id": "ability.conduit.faith-is-our-armor",
  "type": "ability",
  "name": "Faith Is Our Armor",
  "aliasesEn": [],
  "flavor": "The heroes' armor glows with golden light, granting divine protection.",
  "keywords": [
    "magic",
    "ranged"
  ],
  "actionType": "maneuver",
  "cost": {
    "resource": "piety",
    "value": 5
  },
  "distance": {
    "kind": "ranged",
    "value": 10,
    "raw": "Ranged 10"
  },
  "target": "Four allies",
  "powerRoll": {
    "characteristic": "intuition",
    "tiers": [
      {
        "threshold": "≤11",
        "text": "The target gains 5 temporary Stamina.",
        "raw": "The target gains 5 temporary Stamina."
      },
      {
        "threshold": "12-16",
        "text": "The target gains 10 temporary Stamina.",
        "raw": "The target gains 10 temporary Stamina."
      },
      {
        "threshold": "17+",
        "text": "The target gains 15 temporary Stamina.",
        "raw": "The target gains 15 temporary Stamina."
      }
    ]
  },
  "effect": [
    "You can target yourself instead of one ally with this ability."
  ],
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
  "id": "ability.conduit.faith-is-our-armor",
  "nameZhHant": "神恩護體",
  "aliasesZhHant": [],
  "flavor": "英雄的護甲閃耀著金色光芒，賜予神聖的防護。",
  "powerRoll": {
    "tiers": [
      {
        "threshold": "≤11",
        "text": "目標獲得 5 點`臨時體力`"
      },
      {
        "threshold": "12-16",
        "text": "目標獲得 10 點`臨時體力`"
      },
      {
        "threshold": "17+",
        "text": "目標獲得 15 點`臨時體力`"
      }
    ]
  },
  "effect": [
    "你可以將其中 1 個目標改為指定自己。"
  ],
  "meta": {
    "status": "reviewed",
    "translationSource": "舊 Notion 神導士招式 · 神恩護體（同上檔）",
    "commonProcessing": [
      "本招式無威力擲骰的判定屬性標記（三階直接寫結果句，不是「N + 屬性傷害」型），tiers[].text 逐字沿用舊譯"
    ],
    "decisions": [],
    "pendingOwnerDecisions": [],
    "reviewedBy": "owner",
    "reviewedAt": "2026-07-31"
  },
  "canonRef": {
    "id": "ability.conduit.faith-is-our-armor",
    "document": "heroes-v1.01-05-conduit",
    "printedPage": 101
  }
}
```

**結構與翻譯注意事項**

- 本招式無威力擲骰的判定屬性標記（三階直接寫結果句，不是「N + 屬性傷害」型），tiers[].text 逐字沿用舊譯

**擁有者裁決**

- [ ] 核准，內容與結構皆可進入正式 M1
- [ ] 需要修改

擁有者備註：

>

---
### 21. 恩典布道 · Sermon of Grace

- ID：`ability.conduit.sermon-of-grace`
- 來源：Heroes v1.01，印刷頁 101（PDF 頁 8）
- Canon 狀態：`verified`；繁中狀態：`reviewed`
- TI／裁決：無個別 TI；套用全域指南

**英文正典**

```json
{
  "id": "ability.conduit.sermon-of-grace",
  "type": "ability",
  "name": "Sermon of Grace",
  "aliasesEn": [],
  "flavor": "You inspire your allies with tales of your saint's great deeds.",
  "keywords": [
    "area",
    "magic"
  ],
  "actionType": "main",
  "cost": {
    "resource": "piety",
    "value": 5
  },
  "distance": {
    "kind": "area",
    "area": {
      "shape": "burst",
      "size": 4
    },
    "raw": "4 burst"
  },
  "target": "Each ally in the area",
  "effect": [
    "Each target can spend a Recovery. Additionally, each target can use a free triggered action to end one effect on them that is ended by a saving throw or that ends at the end of their turn, or to stand up if prone."
  ],
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
  "id": "ability.conduit.sermon-of-grace",
  "nameZhHant": "恩典布道",
  "aliasesZhHant": [],
  "flavor": "你以聖者的偉大事蹟來鼓舞你的盟友。",
  "effect": [
    "每個目標都可以花費 1 點`復元力`。此外，每個目標也可以使用免費反應動作來解除 1 個能夠透過豁免解除或 EoT 的狀態或效果，或從伏地狀態起身。"
  ],
  "meta": {
    "status": "reviewed",
    "translationSource": "舊 Notion 神導士招式 · 恩典布道（同上檔）",
    "commonProcessing": [
      "「免費觸發式動作」→「免費反應動作」：套用附錄 A 已裁決的 Free Triggered Action＝免費反應動作（term-applied，非本輪新裁決）",
      "動作類型：舊譯標「主動動作」為誤植（無此動作類型），正典為 Main action，訂正為主要動作"
    ],
    "decisions": [],
    "pendingOwnerDecisions": [],
    "reviewedBy": "owner",
    "reviewedAt": "2026-07-31"
  },
  "canonRef": {
    "id": "ability.conduit.sermon-of-grace",
    "document": "heroes-v1.01-05-conduit",
    "printedPage": 101
  }
}
```

**結構與翻譯注意事項**

- 「免費觸發式動作」→「免費反應動作」：套用附錄 A 已裁決的 Free Triggered Action＝免費反應動作（term-applied，非本輪新裁決）
- 動作類型：舊譯標「主動動作」為誤植（無此動作類型），正典為 Main action，訂正為主要動作

**擁有者裁決**

- [ ] 核准，內容與結構皆可進入正式 M1
- [ ] 需要修改

擁有者備註：

>

---
### 22. 墳墓低語 · Grave Speech

- ID：`ability.conduit.grave-speech`
- 來源：Heroes v1.01，印刷頁 97（PDF 頁 4）
- Canon 狀態：`verified`；繁中狀態：`reviewed`
- TI／裁決：無個別 TI；套用全域指南

**英文正典**

```json
{
  "id": "ability.conduit.grave-speech",
  "type": "ability",
  "name": "Grave Speech",
  "aliasesEn": [],
  "flavor": "You commune with the lingering soul of the recently dead.",
  "keywords": [
    "magic"
  ],
  "actionType": "maneuver",
  "cost": null,
  "distance": {
    "kind": "melee",
    "value": 1,
    "raw": "Melee 1"
  },
  "target": "One dead creature",
  "effect": [
    "You can speak to the target if they are a creature who has died within the last 24 hours and who can speak a language you know, even if they are just a head. The target regards you as they would have in life, and you might need to make tests to influence them and convince them to speak with you. The trauma of dying can make a creature's memory of that event hazy, but the target otherwise knows all they knew in life. After 1 minute, the effect ends. You can't use this ability on the same creature twice."
  ],
  "origin": {
    "kind": "domain",
    "id": "domain.death"
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
  "id": "ability.conduit.grave-speech",
  "nameZhHant": "墳墓低語",
  "aliasesZhHant": [],
  "flavor": "你能與剛死不久的殘存靈魂交談。",
  "effect": [
    "你可以與 1 個在過去 24 小時內死亡的生物對話（即使只剩下頭顱也可以），前提是該生物會說你所知的語言。目標會以生前的態度看待你，所以你可能需要進行考驗來說服他們與你交談。由於死亡的創傷，生物對死亡事件的記憶可能會很模糊，但他仍保有生前的所有知識。此招式的效果會在 1 分鐘後結束。你無法重複對同一個生物使用此招式。"
  ],
  "meta": {
    "status": "reviewed",
    "translationSource": "舊 Notion 領域特性 · 死亡：墳墓低語（sources/notion-export/class-notion/conduit/領域特性 239f74afd25b80ecb057dab212ed9548.md）",
    "commonProcessing": [
      "數值與效果與舊譯逐字相符，僅套用格式規則；target「1 個已死亡的生物」為本批新增的組合規則（見對齊報告）"
    ],
    "decisions": [],
    "pendingOwnerDecisions": [],
    "reviewedBy": "owner",
    "reviewedAt": "2026-07-31"
  },
  "canonRef": {
    "id": "ability.conduit.grave-speech",
    "document": "heroes-v1.01-05-conduit",
    "printedPage": 97
  }
}
```

**結構與翻譯注意事項**

- 數值與效果與舊譯逐字相符，僅套用格式規則；target「1 個已死亡的生物」為本批新增的組合規則（見對齊報告）

**擁有者裁決**

- [ ] 核准，內容與結構皆可進入正式 M1
- [ ] 需要修改

擁有者備註：

>

---
### 23. 造物之手 · Hands of the Maker

- ID：`ability.conduit.hands-of-the-maker`
- 來源：Heroes v1.01，印刷頁 97（PDF 頁 4）
- Canon 狀態：`verified`；繁中狀態：`reviewed`
- TI／裁決：無個別 TI；套用全域指南

**英文正典**

```json
{
  "id": "ability.conduit.hands-of-the-maker",
  "type": "ability",
  "name": "Hands of the Maker",
  "aliasesEn": [],
  "flavor": "You craft objects with the power of your mind.",
  "keywords": [
    "magic"
  ],
  "actionType": "maneuver",
  "cost": null,
  "distance": {
    "kind": "self",
    "raw": "Self"
  },
  "target": "Self",
  "effect": [
    "You create a mundane object of size 1S or smaller. You can maintain a number of objects created this way equal to your Intuition score. You can destroy an object created this way with a thought, no matter how far you are from it (no action required)."
  ],
  "origin": {
    "kind": "domain",
    "id": "domain.creation"
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
  "id": "ability.conduit.hands-of-the-maker",
  "nameZhHant": "造物之手",
  "aliasesZhHant": [],
  "flavor": "你僅靠心智的力量就能製作物品。",
  "effect": [
    "你可以創造 1 個`體型` 1S 以下的尋常物體。你可以同時維持的自創物體數量等於你的`直覺`。無論距離多遠，你只需要一個念頭就能摧毀你所創造的物體（無需動作）。"
  ],
  "meta": {
    "status": "reviewed",
    "translationSource": "舊 Notion 領域特性 · 創造：造物之手（同上檔）",
    "commonProcessing": [
      "flavor 逐字取自舊譯，與正典「craft objects with the power of your mind」意象一致，非本批改寫",
      "2026-07-31 Reviewer 複核，擁有者確認：舊譯「數量等於你的`氣場`」為錯誤，正典（pdfPage 4／printedPage 97，已用 -layout 文字抽取與 150dpi 圖像 out/conduit/page-04.png 雙重核對）為「equal to your Intuition score」，訂正為`直覺`定案，不再列為待裁"
    ],
    "decisions": [],
    "pendingOwnerDecisions": [],
    "reviewedBy": "owner",
    "reviewedAt": "2026-07-31"
  },
  "canonRef": {
    "id": "ability.conduit.hands-of-the-maker",
    "document": "heroes-v1.01-05-conduit",
    "printedPage": 97
  }
}
```

**結構與翻譯注意事項**

- flavor 逐字取自舊譯，與正典「craft objects with the power of your mind」意象一致，非本批改寫
- 2026-07-31 Reviewer 複核，擁有者確認：舊譯「數量等於你的`氣場`」為錯誤，正典（pdfPage 4／printedPage 97，已用 -layout 文字抽取與 150dpi 圖像 out/conduit/page-04.png 雙重核對）為「equal to your Intuition score」，訂正為`直覺`定案，不再列為待裁

**擁有者裁決**

- [ ] 核准，內容與結構皆可進入正式 M1
- [ ] 需要修改

擁有者備註：

>

---

## 職業特性 · 18 筆

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
      "2026-07-31 更新：「治癒恩典」（Healing Grace）已於 M1 Batch 3 建檔（ability.conduit.healing-grace）。本欄位翻譯正文維持 Batch 2 已核准版本不動（仍用【】標記招式名稱，未改為站內連結）——是否改為連結屬呈現層決定，非本次更新範圍，僅更正此則備註原先「尚未建檔」的過時說法",
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
- 2026-07-31 更新：「治癒恩典」（Healing Grace）已於 M1 Batch 3 建檔（ability.conduit.healing-grace）。本欄位翻譯正文維持 Batch 2 已核准版本不動（仍用【】標記招式名稱，未改為站內連結）——是否改為連結屬呈現層決定，非本次更新範圍，僅更正此則備註原先「尚未建檔」的過時說法
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
              "text": "你的神明賦予你戰士般的心智。即使你沒有套裝，你也能有效地穿戴輕甲和持用輕型武器。當你穿戴輕甲時，你的`體力`會獲得 +3 加值，這個加值在 4 級、7 級和 10 級時會再各增加 3 點。當你持用輕型武器時，你武器招式的傷害會獲得 +1 加值（包括基礎打擊）。你可以使用輕甲寶物和輕型武器寶物。若你擁有套裝，你不能選擇此禱詞。"
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
      "2026-07-31 更新：「Conduit Ward」（神導士護咒）已於 M1 Batch 3 建檔（feature.conduit.conduit-ward）。「(see Conduit Ward below)」比照 TI-5～7 對頁面位置參照的處理，intro 段落仍不還原這句頁內指示",
      "`體力`／`穩度`／`遁移` 為既有 approved 詞彙表用詞，直接套用",
      "2026-07-31 擁有者裁決：「禱詞」不加反引號，維持特性名稱的一般文字樣式",
      "2026-07-31 擁有者第三輪驗收裁決：戰技禱詞內「套裝」「寶物」改為一般文字，不使用 inline code——與其餘屬性／遊戲數值不同，這兩者是裝備類別名詞而非數值型術語，不需醒目標示。本則裁決前，status 由 reviewed 退回 draft，待擁有者重新核准"
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
- 2026-07-31 更新：「Conduit Ward」（神導士護咒）已於 M1 Batch 3 建檔（feature.conduit.conduit-ward）。「(see Conduit Ward below)」比照 TI-5～7 對頁面位置參照的處理，intro 段落仍不還原這句頁內指示
- `體力`／`穩度`／`遁移` 為既有 approved 詞彙表用詞，直接套用
- 2026-07-31 擁有者裁決：「禱詞」不加反引號，維持特性名稱的一般文字樣式
- 2026-07-31 擁有者第三輪驗收裁決：戰技禱詞內「套裝」「寶物」改為一般文字，不使用 inline code——與其餘屬性／遊戲數值不同，這兩者是裝備類別名詞而非數值型術語，不需醒目標示。本則裁決前，status 由 reviewed 退回 draft，待擁有者重新核准

**擁有者裁決**

- [ ] 核准，內容與結構皆可進入正式 M1
- [ ] 需要修改

擁有者備註：

>

---
### 3. 領域虔誠與禱詞效果 · Domain Piety and Effects

- ID：`feature.conduit.domain-piety-and-effects`
- 來源：Heroes v1.01，印刷頁 96（PDF 頁 3）
- Canon 狀態：`verified`；繁中狀態：`reviewed`
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
      "heading": "Creation Domain Piety and Effect",
      "blocks": [
        {
          "kind": "definitionList",
          "marker": "none",
          "items": [
            {
              "term": "Piety",
              "text": "You gain 2 piety the first time in an encounter that a creature within 10 squares uses an area ability."
            },
            {
              "term": "Prayer Effect",
              "text": "You summon the forces of creation and create a wall of stone within 10 squares whose size is 5 + your Intuition score. The wall lasts until the end of the encounter."
            }
          ]
        }
      ]
    },
    {
      "heading": "Death Domain Piety and Effect",
      "blocks": [
        {
          "kind": "definitionList",
          "marker": "none",
          "items": [
            {
              "term": "Piety",
              "text": "You gain 2 piety the first time in an encounter that a creature within 10 squares who isn't a minion is reduced to 0 Stamina, or the first time in an encounter that a solo creature within 10 squares becomes winded."
            },
            {
              "term": "Prayer Effect",
              "text": "You inflict a deadly curse on up to two enemies within 10 squares of you. Each target takes corruption damage equal to twice your Intuition score."
            }
          ]
        }
      ]
    },
    {
      "heading": "Fate Domain Piety and Effect",
      "blocks": [
        {
          "kind": "definitionList",
          "marker": "none",
          "items": [
            {
              "term": "Piety",
              "text": "You gain 2 piety the first time in an encounter that an ally within 10 squares obtains a tier 3 outcome on a power roll, or an enemy within 10 squares obtains a tier 1 outcome on a power roll."
            },
            {
              "term": "Prayer Effect",
              "text": "You call on the forces of fate to create a reliable future. Choose a creature within 10 squares. That creature automatically obtains a tier 1 or tier 3 outcome (your choice) on their next power roll made before the end of the encounter."
            }
          ]
        }
      ]
    },
    {
      "heading": "Knowledge Domain Piety and Effect",
      "blocks": [
        {
          "kind": "definitionList",
          "marker": "none",
          "items": [
            {
              "term": "Piety",
              "text": "You gain 2 piety the first time in an encounter that the Director spends Malice (see Draw Steel: Monsters)."
            },
            {
              "term": "Prayer Effect",
              "text": "Choose up to five allies within 10 squares of you, or choose yourself instead of one ally. Each target gains 1 surge."
            }
          ]
        }
      ]
    },
    {
      "heading": "Life Domain Piety and Effect",
      "blocks": [
        {
          "kind": "definitionList",
          "marker": "none",
          "items": [
            {
              "term": "Piety",
              "text": "You gain 2 piety the first time in an encounter that a creature within 10 squares regains Stamina."
            },
            {
              "term": "Prayer Effect",
              "text": "Choose yourself or one ally within 10 squares. That character can spend a Recovery, can end one effect on them that is ended by a saving throw or that ends at the end of their turn, or can stand up if they are prone. Alternatively, you or one ally within 10 squares gains temporary Stamina equal to two times your Intuition score."
            }
          ]
        }
      ]
    },
    {
      "heading": "Love Domain Piety and Effect",
      "blocks": [
        {
          "kind": "definitionList",
          "marker": "none",
          "items": [
            {
              "term": "Piety",
              "text": "You gain 2 piety the first time in an encounter that you or any ally within 10 squares uses the Aid Attack maneuver or an ability that targets an ally."
            },
            {
              "term": "Prayer Effect",
              "text": "Each ally within 10 squares of you gains temporary Stamina equal to two times your Intuition score."
            }
          ]
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
    },
    {
      "heading": "Protection Domain Piety and Effect",
      "blocks": [
        {
          "kind": "definitionList",
          "marker": "none",
          "items": [
            {
              "term": "Piety",
              "text": "You gain 2 piety the first time in an encounter that you or any ally within 10 squares gains temporary Stamina, or uses a triggered action to reduce incoming damage or to impose a bane or double bane on an enemy's power roll."
            },
            {
              "term": "Prayer Effect",
              "text": "One ally within 10 squares gains temporary Stamina equal to four times your Intuition score."
            }
          ]
        }
      ]
    },
    {
      "heading": "Storm Domain Piety and Effect",
      "blocks": [
        {
          "kind": "definitionList",
          "marker": "none",
          "items": [
            {
              "term": "Piety",
              "text": "You gain 2 piety the first time in an encounter that an enemy within 10 squares is force moved."
            },
            {
              "term": "Prayer Effect",
              "text": "Each enemy in a 3 cube within 10 squares takes lightning damage equal to twice your Intuition score."
            }
          ]
        }
      ]
    },
    {
      "heading": "Sun Domain Piety and Effect",
      "blocks": [
        {
          "kind": "definitionList",
          "marker": "none",
          "items": [
            {
              "term": "Piety",
              "text": "You gain 2 piety the first time in an encounter that an enemy within 10 squares takes fire or holy damage."
            },
            {
              "term": "Prayer Effect",
              "text": "One enemy within 10 squares takes fire damage equal to three times your Intuition score."
            }
          ]
        }
      ]
    },
    {
      "heading": "Trickery Domain Piety and Effect",
      "blocks": [
        {
          "kind": "definitionList",
          "marker": "none",
          "items": [
            {
              "term": "Piety",
              "text": "You gain 2 piety the first time in an encounter that you or a creature within 10 squares takes the Aid Attack or Hide maneuver."
            },
            {
              "term": "Prayer Effect",
              "text": "You slide one creature within 10 squares of you up to a number of squares equal to 5 + your conduit level."
            }
          ]
        }
      ]
    },
    {
      "heading": "War Domain Piety and Effect",
      "blocks": [
        {
          "kind": "definitionList",
          "marker": "none",
          "items": [
            {
              "term": "Piety",
              "text": "You gain 2 piety the first time in an encounter that you or a creature within 10 squares takes damage greater than 10 + your level in a single turn."
            },
            {
              "term": "Prayer Effect",
              "text": "Choose up to three allies within 10 squares of you, or choose yourself instead of one ally. Each target gains 2 surges."
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
      "heading": "創造",
      "blocks": [
        {
          "kind": "definitionList",
          "marker": "none",
          "items": [
            {
              "term": "虔誠",
              "text": "每場遭遇 1 次，當 10 格內的 1 個生物首次發動區域招式時，你獲得 2 點`虔誠`。"
            },
            {
              "term": "禱詞效果",
              "text": "你引導創造之力，在 10 格內創造 1 道石造的障壁，其大小為 5 + 你的`直覺`。此障壁會持續到遭遇結束。"
            }
          ]
        }
      ]
    },
    {
      "heading": "死亡",
      "blocks": [
        {
          "kind": "definitionList",
          "marker": "none",
          "items": [
            {
              "term": "虔誠",
              "text": "每場遭遇 1 次，當 10 格內的 1 個非雜魚生物`體力`首次歸 0 時，或 10 格內的 1 個獨霸生物首次陷入疲態時，你獲得 2 點`虔誠`。"
            },
            {
              "term": "禱詞效果",
              "text": "你對 10 格內最多 2 個敵人降下致命詛咒。每個目標都會受到等於你`直覺` ×2 的腐朽傷害。"
            }
          ]
        }
      ]
    },
    {
      "heading": "命運",
      "blocks": [
        {
          "kind": "definitionList",
          "marker": "none",
          "items": [
            {
              "term": "虔誠",
              "text": "每場遭遇 1 次，當 10 格內 1 個盟友的檢定首次獲得 T3 結果時，或 10 格內 1 個敵人的檢定首次獲得 T1 結果時，你獲得 2 點`虔誠`。"
            },
            {
              "term": "禱詞效果",
              "text": "你引導命運之力來創造可靠的未來。選擇 10 格內的 1 個生物。在遭遇結束前，該生物進行的下次檢定會自動獲得 T1 或 T3 結果（由你選擇）。"
            }
          ]
        }
      ]
    },
    {
      "heading": "知識",
      "blocks": [
        {
          "kind": "definitionList",
          "marker": "none",
          "items": [
            {
              "term": "虔誠",
              "text": "每場遭遇 1 次，當 GM 首次花費`惡意`時，你獲得 2 點`虔誠`。"
            },
            {
              "term": "禱詞效果",
              "text": "選擇 10 格內最多 5 個盟友（可以選擇自己來取代其中 1 個盟友）。每個目標獲得 1 點`鬥志`。"
            }
          ]
        }
      ]
    },
    {
      "heading": "生命",
      "blocks": [
        {
          "kind": "definitionList",
          "marker": "none",
          "items": [
            {
              "term": "虔誠",
              "text": "每場遭遇 1 次，當 10 格內的 1 個生物首次恢復`體力`時，你獲得 2 點`虔誠`。"
            },
            {
              "term": "禱詞效果",
              "text": "選擇你自己或 10 格內的 1 個盟友。該角色可以花費 1 點`復元力`、可以解除 1 個能夠透過豁免解除或 EoT 的狀態或效果，或可以從伏地狀態起身。或者，你自己或 10 格內的 1 個盟友會獲得等於你`直覺` ×2 的`臨時體力`。"
            }
          ]
        }
      ]
    },
    {
      "heading": "慈愛",
      "blocks": [
        {
          "kind": "definitionList",
          "marker": "none",
          "items": [
            {
              "term": "虔誠",
              "text": "每場遭遇 1 次，當你自己或 10 格內的 1 個盟友首次使用助攻機動動作或指定盟友的招式時，你獲得 2 點`虔誠`。"
            },
            {
              "term": "禱詞效果",
              "text": "10 格內的每個盟友都會獲得等於你`直覺` ×2 的`臨時體力`。"
            }
          ]
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
    },
    {
      "heading": "守護",
      "blocks": [
        {
          "kind": "definitionList",
          "marker": "none",
          "items": [
            {
              "term": "虔誠",
              "text": "每場遭遇 1 次，當你自己或 10 格內的 1 個盟友獲得`臨時體力`、使用反應動作來減少受到的傷害，或讓敵人的檢定承受劣勢或雙劣勢時，你獲得 2 點`虔誠`。"
            },
            {
              "term": "禱詞效果",
              "text": "10 格內的 1 個盟友獲得等於你`直覺` ×4 的`臨時體力`。"
            }
          ]
        }
      ]
    },
    {
      "heading": "風暴",
      "blocks": [
        {
          "kind": "definitionList",
          "marker": "none",
          "items": [
            {
              "term": "虔誠",
              "text": "每場遭遇 1 次，當 10 格內的 1 個敵人首次被強制移動時，你獲得 2 點`虔誠`。"
            },
            {
              "term": "禱詞效果",
              "text": "10 格內 3 立方區域中的每個敵人都會受到等於你`直覺` ×2 的閃電傷害。"
            }
          ]
        }
      ]
    },
    {
      "heading": "太陽",
      "blocks": [
        {
          "kind": "definitionList",
          "marker": "none",
          "items": [
            {
              "term": "虔誠",
              "text": "每場遭遇 1 次，當 10 格內的 1 個敵人首次受到火焰或神聖傷害時，你獲得 2 點`虔誠`。"
            },
            {
              "term": "禱詞效果",
              "text": "10 格內的 1 個敵人受到等於你`直覺` ×3 的火焰傷害。"
            }
          ]
        }
      ]
    },
    {
      "heading": "詭術",
      "blocks": [
        {
          "kind": "definitionList",
          "marker": "none",
          "items": [
            {
              "term": "虔誠",
              "text": "每場遭遇 1 次，當你自己或 10 格內的 1 個生物首次使用助攻或躲藏機動動作時，你獲得 2 點`虔誠`。"
            },
            {
              "term": "禱詞效果",
              "text": "你將 10 格內的 1 個生物滑動最多等於 5 + 你神導士等級的格數。"
            }
          ]
        }
      ]
    },
    {
      "heading": "戰爭",
      "blocks": [
        {
          "kind": "definitionList",
          "marker": "none",
          "items": [
            {
              "term": "虔誠",
              "text": "每場遭遇 1 次，當你自己或 10 格內的 1 個生物在單一回合內受到超過 10 + 你等級的傷害時，你獲得 2 點`虔誠`。"
            },
            {
              "term": "禱詞效果",
              "text": "選擇 10 格內最多 3 個盟友（可以選擇自己來取代其中 1 個盟友）。每個目標獲得 2 點`鬥志`。"
            }
          ]
        }
      ]
    }
  ],
  "meta": {
    "status": "reviewed",
    "translationSource": "舊 Notion 神導士 · 虔誠（「領域的虔誠與禱詞效果」段落，同一份檔案）",
    "commonProcessing": [
      "2026-07-31 擁有者裁決：sections[1].heading 使用簡短領域名稱「自然」，不重複「領域虔誠與禱詞效果」字樣",
      "2026-07-31 第二輪裁決：撤回第一輪加入的過渡句「以下是各領域的虔誠與禱詞效果。」——不新增站方說明句，不調整 schema，intro 段落回復為逐字對應正典的兩段",
      "2026-07-31 Batch 3：其餘 11 個領域已補上。倍率數值（×2／×3／×4 等）已用 150dpi 圖像 out/conduit/page-03.png、page-04.png 逐條核對，多數與舊譯相符，例外見下三則",
      "Protection 領域「uses a triggered action」譯為`反應動作`（既有 approved 詞彙），舊譯原句誤寫「觸發式動作」，已訂正（term-applied，套用既有附錄 A 裁決）",
      "Protection 領域舊譯漏譯「or double bane」，只譯出「劣勢」未譯「或雙劣勢」；正典「to impose a bane or double bane on an enemy's power roll」明確包含雙劣勢，已補譯為「劣勢或雙劣勢」",
      "Storm 領域舊譯「受到你`直覺` ×2 的閃電傷害」省略「等於」；為與其他領域「等於你`直覺` ×N」的既定行文一致，已補上「等於」，不改變倍率數值",
      "War 領域舊譯「受到 10 + 你等級的傷害」漏譯「greater than」（超過）；正典為「damage greater than 10 + your level」，已補譯「超過」",
      "生命領域禱詞效果：正典「Alternatively」（或者，表示兩種效果二選一）舊譯誤譯為「此外」（表示兩者疊加），已訂正為「或者」——2026-07-31 Reviewer 複核指出",
      "各領域 section heading 中文比照既有「自然」的短式命名慣例，只存領域短名，不重複「領域虔誠與禱詞效果」字樣",
      "2026-07-31 擁有者第三輪驗收裁決：知識領域的「GM」、慈愛與詭術領域的「助攻」「躲藏」改為一般文字，不使用 inline code——這些是機動動作名稱與角色代稱，不屬於本站「屬性、資源、遊戲數值」的醒目標示範圍；「GM」與中文字之間補上半形空格"
    ],
    "decisions": [],
    "pendingOwnerDecisions": [],
    "reviewedBy": "owner",
    "reviewedAt": "2026-07-31"
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
- 2026-07-31 第二輪裁決：撤回第一輪加入的過渡句「以下是各領域的虔誠與禱詞效果。」——不新增站方說明句，不調整 schema，intro 段落回復為逐字對應正典的兩段
- 2026-07-31 Batch 3：其餘 11 個領域已補上。倍率數值（×2／×3／×4 等）已用 150dpi 圖像 out/conduit/page-03.png、page-04.png 逐條核對，多數與舊譯相符，例外見下三則
- Protection 領域「uses a triggered action」譯為`反應動作`（既有 approved 詞彙），舊譯原句誤寫「觸發式動作」，已訂正（term-applied，套用既有附錄 A 裁決）
- Protection 領域舊譯漏譯「or double bane」，只譯出「劣勢」未譯「或雙劣勢」；正典「to impose a bane or double bane on an enemy's power roll」明確包含雙劣勢，已補譯為「劣勢或雙劣勢」
- Storm 領域舊譯「受到你`直覺` ×2 的閃電傷害」省略「等於」；為與其他領域「等於你`直覺` ×N」的既定行文一致，已補上「等於」，不改變倍率數值
- War 領域舊譯「受到 10 + 你等級的傷害」漏譯「greater than」（超過）；正典為「damage greater than 10 + your level」，已補譯「超過」
- 生命領域禱詞效果：正典「Alternatively」（或者，表示兩種效果二選一）舊譯誤譯為「此外」（表示兩者疊加），已訂正為「或者」——2026-07-31 Reviewer 複核指出
- 各領域 section heading 中文比照既有「自然」的短式命名慣例，只存領域短名，不重複「領域虔誠與禱詞效果」字樣
- 2026-07-31 擁有者第三輪驗收裁決：知識領域的「GM」、慈愛與詭術領域的「助攻」「躲藏」改為一般文字，不使用 inline code——這些是機動動作名稱與角色代稱，不屬於本站「屬性、資源、遊戲數值」的醒目標示範圍；「GM」與中文字之間補上半形空格

**擁有者裁決**

- [ ] 核准，內容與結構皆可進入正式 M1
- [ ] 需要修改

擁有者備註：

>

---
### 4. 1 級領域特性 · 1st-Level Domain Feature

- ID：`feature.conduit.domain-feature-1st-level`
- 來源：Heroes v1.01，印刷頁 97（PDF 頁 4）
- Canon 狀態：`verified`；繁中狀態：`reviewed`
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
              "term": "Creation",
              "text": "Hands of the Maker (Crafting)"
            },
            {
              "term": "Death",
              "text": "Grave Speech (Lore)"
            },
            {
              "term": "Fate",
              "text": "Oracular Visions (Lore)"
            },
            {
              "term": "Knowledge",
              "text": "Blessing of Comprehension (Lore)"
            },
            {
              "term": "Life",
              "text": "Revitalizing Ritual (Exploration)"
            },
            {
              "term": "Love",
              "text": "Blessing of Compassion (Interpersonal)"
            },
            {
              "term": "Nature",
              "text": "Faithful Friend (Exploration)"
            },
            {
              "term": "Protection",
              "text": "Protective Circle (Exploration)"
            },
            {
              "term": "Storm",
              "text": "Blessing of Fortunate Weather (Exploration)"
            },
            {
              "term": "Sun",
              "text": "Inner Light (Lore)"
            },
            {
              "term": "Trickery",
              "text": "Inspired Deception (Intrigue)"
            },
            {
              "term": "War",
              "text": "Sanctified Weapon (Exploration)"
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
              "term": "創造",
              "text": "[造物之手](ability.conduit.hands-of-the-maker)（工藝類技能）"
            },
            {
              "term": "死亡",
              "text": "[墳墓低語](ability.conduit.grave-speech)（學識類技能）"
            },
            {
              "term": "命運",
              "text": "[晦澀異象](feature.conduit.domain-feature.oracular-visions)（學識類技能）"
            },
            {
              "term": "知識",
              "text": "[通曉祝福](feature.conduit.domain-feature.blessing-of-comprehension)（學識類技能）"
            },
            {
              "term": "生命",
              "text": "[活力儀式](feature.conduit.domain-feature.revitalizing-ritual)（探索類技能）"
            },
            {
              "term": "慈愛",
              "text": "[溫慈祝福](feature.conduit.domain-feature.blessing-of-compassion)（交涉類技能）"
            },
            {
              "term": "自然",
              "text": "[忠誠好友](ability.conduit.faithful-friend)（探索類技能）"
            },
            {
              "term": "守護",
              "text": "[守護結界](feature.conduit.domain-feature.protective-circle)（探索類技能）"
            },
            {
              "term": "風暴",
              "text": "[天氣祝福](feature.conduit.domain-feature.blessing-of-fortunate-weather)（探索類技能）"
            },
            {
              "term": "太陽",
              "text": "[晨光庇護](feature.conduit.domain-feature.inner-light)（學識類技能）"
            },
            {
              "term": "詭術",
              "text": "[靈光詐現](feature.conduit.domain-feature.inspired-deception)（隱密類技能）"
            },
            {
              "term": "戰爭",
              "text": "[聖化武器](feature.conduit.domain-feature.sanctified-weapon)（探索類技能）"
            }
          ]
        }
      ]
    }
  ],
  "meta": {
    "status": "reviewed",
    "translationSource": "舊 Notion 神導士 · 領域特性（sources/notion-export/class-notion/conduit/領域特性 239f74afd25b80ecb057dab212ed9548.md）",
    "commonProcessing": [
      "2026-07-31 擁有者裁決：句尾「(Quick Build: Revitalizing Ritual and the Heal skill from the Life domain.)」補譯，Quick Build 統一用已批准譯名「推薦選項」（TI-11）",
      "「Revitalizing Ritual」譯「活力儀式」，取自舊譯 sources/notion-export/class-notion/conduit/領域特性…md 的生命領域列",
      "「Heal」（技能名）2026-07-31 擁有者正式裁決定稿為「醫療」，與 glossary 既有的 term.heal（zhHant「治療」，approved，類別「規則/主要動作」，指戰鬥中的治療主要動作）是不同詞義，不得混用。此裁決尚未寫入 data/decisions.json——原因與待辦見對話紀錄，需要另外處理正典術語流程與 releases/m0.json 指紋的連動",
      "definitionList 項目格式為「[具名特性或招式](id)（技能組）」，比照舊譯「造物之手（工藝類技能）」這類既有寫法",
      "2026-07-31 Batch 3：其餘 11 列已補上。創造／死亡兩列授予的是完整招式卡（造物之手／墳墓低語），連結指向 ability.* id；其餘 9 列授予純散文特性，連結指向本批新建的 feature.conduit.domain-feature.* id",
      "技能組 Crafting＝工藝類、Lore＝學識類、Exploration＝探索類、Interpersonal＝交涉類、Intrigue＝隱密類（2026-07-31 Reviewer 複核，擁有者確認定案，不再列為待裁）",
      "慈愛領域列連結文字採「溫慈祝福」（Reviewer 複核後擁有者確認條目名稱定案，見 feature.conduit.domain-feature.blessing-of-compassion 對齊備註）"
    ],
    "decisions": [],
    "pendingOwnerDecisions": [],
    "reviewedBy": "owner",
    "reviewedAt": "2026-07-31"
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
- 「Revitalizing Ritual」譯「活力儀式」，取自舊譯 sources/notion-export/class-notion/conduit/領域特性…md 的生命領域列
- 「Heal」（技能名）2026-07-31 擁有者正式裁決定稿為「醫療」，與 glossary 既有的 term.heal（zhHant「治療」，approved，類別「規則/主要動作」，指戰鬥中的治療主要動作）是不同詞義，不得混用。此裁決尚未寫入 data/decisions.json——原因與待辦見對話紀錄，需要另外處理正典術語流程與 releases/m0.json 指紋的連動
- definitionList 項目格式為「[具名特性或招式](id)（技能組）」，比照舊譯「造物之手（工藝類技能）」這類既有寫法
- 2026-07-31 Batch 3：其餘 11 列已補上。創造／死亡兩列授予的是完整招式卡（造物之手／墳墓低語），連結指向 ability.* id；其餘 9 列授予純散文特性，連結指向本批新建的 feature.conduit.domain-feature.* id
- 技能組 Crafting＝工藝類、Lore＝學識類、Exploration＝探索類、Interpersonal＝交涉類、Intrigue＝隱密類（2026-07-31 Reviewer 複核，擁有者確認定案，不再列為待裁）
- 慈愛領域列連結文字採「溫慈祝福」（Reviewer 複核後擁有者確認條目名稱定案，見 feature.conduit.domain-feature.blessing-of-compassion 對齊備註）

**擁有者裁決**

- [ ] 核准，內容與結構皆可進入正式 M1
- [ ] 需要修改

擁有者備註：

>

---
### 5. 神明與領域 · Deity and Domains

- ID：`feature.conduit.deity-and-domains`
- 來源：Heroes v1.01，印刷頁 95（PDF 頁 2）
- Canon 狀態：`verified`；繁中狀態：`reviewed`
- TI／裁決：無個別 TI；套用全域指南

**英文正典**

```json
{
  "id": "feature.conduit.deity-and-domains",
  "type": "feature",
  "name": "Deity and Domains",
  "aliasesEn": [],
  "sections": [
    {
      "heading": null,
      "blocks": [
        {
          "kind": "paragraph",
          "text": "Choose a god or saint who your character reveres from Chapter 14: Gods and Religion, or ask your Director about the deities in your campaign world. With the Director's permission, you can also create your own deity and choose four domains to be part of their portfolio."
        },
        {
          "kind": "paragraph",
          "text": "After choosing your deity, pick two domains from their portfolio. The two domains you pick make up your subclass, and your choice of domains determines many of the features you’ll gain as you gain new levels."
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
  "id": "feature.conduit.deity-and-domains",
  "nameZhHant": "神明與領域",
  "aliasesZhHant": [],
  "sections": [
    {
      "heading": null,
      "blocks": [
        {
          "kind": "paragraph",
          "text": "從《諸神與宗教》的內容中，選擇 1 位你的角色信奉的神明或聖者，或向你的`GM`詢問你的戰役世界中有哪些神祇。經`GM`許可，你也可以自創屬於自己的神明，並選擇 4 個領域作為祂的神職範疇。"
        },
        {
          "kind": "paragraph",
          "text": "選擇後，從祂的神職範疇中選擇 2 個領域。你選擇的這 2 個領域會組成你的子範型，你的選擇將決定你在升級時獲得的許多特性。"
        }
      ]
    }
  ],
  "meta": {
    "status": "reviewed",
    "reviewedBy": "owner",
    "reviewedAt": "2026-07-31",
    "translationSource": "舊 Notion 神明與領域（sources/notion-export/class-notion/conduit/神明與領域 239f74afd25b80388175fb94debf34c9.md）",
    "commonProcessing": [
      "第 2 段（選擇領域）與舊譯逐句相符，僅套用格式規則",
      "第 1 段舊譯明顯簡化（只有「請參考『諸神 & 宗教』，選擇 1 位你信奉的神明或聖者」1 句），漏譯「或向 GM 詢問戰役世界神祇」「經 GM 許可可自創神明並選 4 個領域」整段規則。本批依正典 pdfPage 2／printedPage 95 全新起草補齊，非改寫已核准譯文",
      "章節名「Chapter 14: Gods and Religion」比照 TI-5～7 既有裁決（見 data/translation-issues.json），省略章節編號與「見第…章」字樣，僅譯出章節主題，2026-07-31 Reviewer 複核擁有者確認譯名定為「諸神與宗教」，不再列為待裁；不建立站內連結（本站無該章節內容）",
      "Director＝GM 為既有 approved 術語（term.director），Malice 未出現於本條目",
      "本批依 M1 指示排除本條目自身的 Quick Build（「Adûn for deity, and Life and Protection as domains.」）——僅 Prayer 與 1st-Level Domain Feature 的 Quick Build 經批准納入，此為既定範圍執行，非待裁事項"
    ],
    "decisions": [],
    "pendingOwnerDecisions": []
  },
  "canonRef": {
    "id": "feature.conduit.deity-and-domains",
    "document": "heroes-v1.01-05-conduit",
    "printedPage": 95
  }
}
```

**結構與翻譯注意事項**

- 第 2 段（選擇領域）與舊譯逐句相符，僅套用格式規則
- 第 1 段舊譯明顯簡化（只有「請參考『諸神 & 宗教』，選擇 1 位你信奉的神明或聖者」1 句），漏譯「或向 GM 詢問戰役世界神祇」「經 GM 許可可自創神明並選 4 個領域」整段規則。本批依正典 pdfPage 2／printedPage 95 全新起草補齊，非改寫已核准譯文
- 章節名「Chapter 14: Gods and Religion」比照 TI-5～7 既有裁決（見 data/translation-issues.json），省略章節編號與「見第…章」字樣，僅譯出章節主題，2026-07-31 Reviewer 複核擁有者確認譯名定為「諸神與宗教」，不再列為待裁；不建立站內連結（本站無該章節內容）
- Director＝GM 為既有 approved 術語（term.director），Malice 未出現於本條目
- 本批依 M1 指示排除本條目自身的 Quick Build（「Adûn for deity, and Life and Protection as domains.」）——僅 Prayer 與 1st-Level Domain Feature 的 Quick Build 經批准納入，此為既定範圍執行，非待裁事項

**擁有者裁決**

- [ ] 核准，內容與結構皆可進入正式 M1
- [ ] 需要修改

擁有者備註：

>

---
### 6. 神導士招式 · Conduit Abilities

- ID：`feature.conduit.conduit-abilities`
- 來源：Heroes v1.01，印刷頁 99（PDF 頁 6）
- Canon 狀態：`verified`；繁中狀態：`reviewed`
- TI／裁決：無個別 TI；套用全域指南

**英文正典**

```json
{
  "id": "feature.conduit.conduit-abilities",
  "type": "feature",
  "name": "Conduit Abilities",
  "aliasesEn": [],
  "sections": [
    {
      "heading": null,
      "blocks": [
        {
          "kind": "paragraph",
          "text": "Your training and faith let you specialize in magic that buffs your allies, debuffs your foes, and allows you to hold your own in combat alongside your friends."
        }
      ]
    },
    {
      "heading": "Signature Abilities",
      "blocks": [
        {
          "kind": "bulletList",
          "lead": "Choose two signature abilities from the following options. Signature abilities can be used at will.",
          "items": [
            "Blessed Light",
            "Drain",
            "Holy Lash",
            "Lightfall",
            "Sacrificial Offer",
            "Staggering Curse",
            "Warrior's Prayer",
            "Wither"
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
  "id": "feature.conduit.conduit-abilities",
  "nameZhHant": "神導士招式",
  "aliasesZhHant": [],
  "sections": [
    {
      "heading": null,
      "blocks": [
        {
          "kind": "paragraph",
          "text": "你的訓練與信仰讓你專精於強化盟友與削弱敵人的魔法，同時能在戰鬥中與夥伴並肩作戰，維持自身的戰鬥力。"
        }
      ]
    },
    {
      "heading": "招牌招式",
      "blocks": [
        {
          "kind": "bulletList",
          "lead": "從以下選項中選擇 2 項招牌招式。招牌招式可以任意使用。",
          "items": [
            "[賜福聖光](ability.conduit.blessed-light)",
            "[奪元術](ability.conduit.drain)",
            "[神聖鞭笞](ability.conduit.holy-lash)",
            "[天降光霖](ability.conduit.lightfall)",
            "[犧牲奉獻](ability.conduit.sacrificial-offer)",
            "[恍惚詛咒](ability.conduit.staggering-curse)",
            "[勇士禱詞](ability.conduit.warriors-prayer)",
            "[凋零箭](ability.conduit.wither)"
          ]
        }
      ]
    }
  ],
  "meta": {
    "status": "reviewed",
    "reviewedBy": "owner",
    "reviewedAt": "2026-07-31",
    "translationSource": "舊 Notion 神導士招式（sources/notion-export/class-notion/conduit/神導士招式 239f74afd25b80eb8f74ce7e7a785c42.md）段落標題與導言",
    "commonProcessing": [
      "2026-07-31 Reviewer 第二輪複核：原條目只有導言句、未列出或連結任何選項，已改用 bulletList 列出全部 8 個招牌招式，每項為 [中文名](id) 站內連結，逐一對應已建檔的 ability 條目",
      "「招牌招式」導言：舊譯（神導士招式.md）「選擇 2 項招牌招式。招牌招式可以任意使用。」逐句相符，僅補回舊譯省略的「從以下選項中」（from the following options）",
      "本批依 M1 指示排除 Quick Build（「Blessed Light, Staggering Curse.」）",
      "正典來源修正：本條目原本涵蓋跨 pdfPage 5/6/8 的內容但只標示單一頁碼，已拆分為 3 個條目（本條目、feature.conduit.triggered-action、feature.conduit.heroic-abilities），各自 source 對應實際印刷頁，見對齊報告",
      "2026-07-31 擁有者第三輪驗收裁決：條目中文名稱由「神導士招式總覽」改為「神導士招式」"
    ],
    "decisions": [],
    "pendingOwnerDecisions": []
  },
  "canonRef": {
    "id": "feature.conduit.conduit-abilities",
    "document": "heroes-v1.01-05-conduit",
    "printedPage": 99
  }
}
```

**結構與翻譯注意事項**

- 2026-07-31 Reviewer 第二輪複核：原條目只有導言句、未列出或連結任何選項，已改用 bulletList 列出全部 8 個招牌招式，每項為 [中文名](id) 站內連結，逐一對應已建檔的 ability 條目
- 「招牌招式」導言：舊譯（神導士招式.md）「選擇 2 項招牌招式。招牌招式可以任意使用。」逐句相符，僅補回舊譯省略的「從以下選項中」（from the following options）
- 本批依 M1 指示排除 Quick Build（「Blessed Light, Staggering Curse.」）
- 正典來源修正：本條目原本涵蓋跨 pdfPage 5/6/8 的內容但只標示單一頁碼，已拆分為 3 個條目（本條目、feature.conduit.triggered-action、feature.conduit.heroic-abilities），各自 source 對應實際印刷頁，見對齊報告
- 2026-07-31 擁有者第三輪驗收裁決：條目中文名稱由「神導士招式總覽」改為「神導士招式」

**擁有者裁決**

- [ ] 核准，內容與結構皆可進入正式 M1
- [ ] 需要修改

擁有者備註：

>

---
### 7. 反應動作 · Triggered Action

- ID：`feature.conduit.triggered-action`
- 來源：Heroes v1.01，印刷頁 98（PDF 頁 5）
- Canon 狀態：`verified`；繁中狀態：`reviewed`
- TI／裁決：無個別 TI；套用全域指南

**英文正典**

```json
{
  "id": "feature.conduit.triggered-action",
  "type": "feature",
  "name": "Triggered Action",
  "aliasesEn": [],
  "sections": [
    {
      "heading": null,
      "blocks": [
        {
          "kind": "bulletList",
          "lead": "Choose one of the following triggered actions.",
          "items": [
            "Word of Guidance",
            "Word of Judgment"
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
    "pdfPage": 5,
    "printedPage": 98,
    "checkedAt": "2026-07-31"
  }
}
```

**繁中內容**

```json
{
  "id": "feature.conduit.triggered-action",
  "nameZhHant": "反應動作",
  "aliasesZhHant": [],
  "sections": [
    {
      "heading": null,
      "blocks": [
        {
          "kind": "bulletList",
          "lead": "從以下選項中選擇 1 個反應動作。",
          "items": [
            "[引導之聲](ability.conduit.word-of-guidance)",
            "[審判之聲](ability.conduit.word-of-judgment)"
          ]
        }
      ]
    }
  ],
  "meta": {
    "status": "reviewed",
    "reviewedBy": "owner",
    "reviewedAt": "2026-07-31",
    "translationSource": "舊 Notion 觸發式動作（sources/notion-export/class-notion/conduit/觸發式動作 239f74afd25b80b68c83c8c2b4c904da.md）段落標題",
    "commonProcessing": [
      "2026-07-31 Reviewer 第二輪複核：從合併條目拆出為獨立條目，來源頁碼改為精確的 pdfPage 5／printedPage 98（原合併條目誤標為 99）",
      "導言「Triggered Action」：舊譯原文用已廢棄的舊術語「觸發式動作」作段落標題，已依附錄 A 既有裁決訂正為「反應動作」（term-applied，非新裁決）；內文「從以下選項中選擇 1 個觸發式動作」同步訂正並補回舊譯省略的「從以下選項中」",
      "已改用 bulletList 列出全部 2 個反應動作，每項為 [中文名](id) 站內連結",
      "本批依 M1 指示排除 Quick Build（「Word of Guidance.」）"
    ],
    "decisions": [],
    "pendingOwnerDecisions": []
  },
  "canonRef": {
    "id": "feature.conduit.triggered-action",
    "document": "heroes-v1.01-05-conduit",
    "printedPage": 98
  }
}
```

**結構與翻譯注意事項**

- 2026-07-31 Reviewer 第二輪複核：從合併條目拆出為獨立條目，來源頁碼改為精確的 pdfPage 5／printedPage 98（原合併條目誤標為 99）
- 導言「Triggered Action」：舊譯原文用已廢棄的舊術語「觸發式動作」作段落標題，已依附錄 A 既有裁決訂正為「反應動作」（term-applied，非新裁決）；內文「從以下選項中選擇 1 個觸發式動作」同步訂正並補回舊譯省略的「從以下選項中」
- 已改用 bulletList 列出全部 2 個反應動作，每項為 [中文名](id) 站內連結
- 本批依 M1 指示排除 Quick Build（「Word of Guidance.」）

**擁有者裁決**

- [ ] 核准，內容與結構皆可進入正式 M1
- [ ] 需要修改

擁有者備註：

>

---
### 8. 英雄招式 · Heroic Abilities

- ID：`feature.conduit.heroic-abilities`
- 來源：Heroes v1.01，印刷頁 101（PDF 頁 8）
- Canon 狀態：`verified`；繁中狀態：`reviewed`
- TI／裁決：無個別 TI；套用全域指南

**英文正典**

```json
{
  "id": "feature.conduit.heroic-abilities",
  "type": "feature",
  "name": "Heroic Abilities",
  "aliasesEn": [],
  "sections": [
    {
      "heading": null,
      "blocks": [
        {
          "kind": "paragraph",
          "text": "You make use of a number of heroic abilities, all of which channel piety to empower them."
        }
      ]
    },
    {
      "heading": "3-Piety Ability",
      "blocks": [
        {
          "kind": "bulletList",
          "lead": "Choose one heroic ability from the following options, each of which costs 3 piety to use.",
          "items": [
            "Call the Thunder Down",
            "Font of Wrath",
            "Judgment's Hammer",
            "Violence Will Not Aid Thee"
          ]
        }
      ]
    },
    {
      "heading": "5-Piety Ability",
      "blocks": [
        {
          "kind": "bulletList",
          "lead": "Choose one heroic ability from the following options, each of which costs 5 piety to use.",
          "items": [
            "Corruption's Curse",
            "Curse of Terror",
            "Faith Is Our Armor",
            "Sermon of Grace"
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
    "pdfPage": 8,
    "printedPage": 101,
    "checkedAt": "2026-07-31"
  }
}
```

**繁中內容**

```json
{
  "id": "feature.conduit.heroic-abilities",
  "nameZhHant": "英雄招式",
  "aliasesZhHant": [],
  "sections": [
    {
      "heading": null,
      "blocks": [
        {
          "kind": "paragraph",
          "text": "你可以運用`虔誠`使出多種英雄招式。"
        }
      ]
    },
    {
      "heading": "3 虔誠招式",
      "blocks": [
        {
          "kind": "bulletList",
          "lead": "從以下選項中選擇 1 項費用為 3 點`虔誠`的英雄招式。",
          "items": [
            "[喚雷降世](ability.conduit.call-the-thunder-down)",
            "[神怒之泉](ability.conduit.font-of-wrath)",
            "[審判之鎚](ability.conduit.judgments-hammer)",
            "[暴力無濟於事](ability.conduit.violence-will-not-aid-thee)"
          ]
        }
      ]
    },
    {
      "heading": "5 虔誠招式",
      "blocks": [
        {
          "kind": "bulletList",
          "lead": "從以下選項中選擇 1 項費用為 5 點`虔誠`的英雄招式。",
          "items": [
            "[腐化詛咒](ability.conduit.corruptions-curse)",
            "[恐懼詛咒](ability.conduit.curse-of-terror)",
            "[神恩護體](ability.conduit.faith-is-our-armor)",
            "[恩典布道](ability.conduit.sermon-of-grace)"
          ]
        }
      ]
    }
  ],
  "meta": {
    "status": "reviewed",
    "reviewedBy": "owner",
    "reviewedAt": "2026-07-31",
    "translationSource": "舊 Notion 神導士招式（同上檔）「英雄招式」「3 費虔誠招式」「5 費虔誠招式」段落標題與導言",
    "commonProcessing": [
      "2026-07-31 Reviewer 第二輪複核：從合併條目拆出為獨立條目，來源頁碼改為精確的 pdfPage 8／printedPage 101（原合併條目誤標為 99）",
      "「英雄招式」導言：舊譯「你可以運用`虔誠`使出多種英雄招式」逐句相符",
      "「3 虔誠招式」導言：舊譯「選擇 1 項費用為 3 點`虔誠`的英雄招式」逐句相符，僅補回「從以下選項中」",
      "「5 虔誠招式」導言：舊譯原文誤植為「選擇 1 項費用為 3 點虔誠的英雄招式」（複製 3 費招式段落時忘記把 3 改成 5），已依正典訂正為「5 點」，並補回「從以下選項中」",
      "已改用 bulletList 分別列出全部 4 個 3 虔誠招式與 4 個 5 虔誠招式，每項為 [中文名](id) 站內連結",
      "本批依 M1 指示排除 Quick Build（「Violence Will Not Aid Thee.」3 費／「Curse of Terror.」5 費）"
    ],
    "decisions": [],
    "pendingOwnerDecisions": []
  },
  "canonRef": {
    "id": "feature.conduit.heroic-abilities",
    "document": "heroes-v1.01-05-conduit",
    "printedPage": 101
  }
}
```

**結構與翻譯注意事項**

- 2026-07-31 Reviewer 第二輪複核：從合併條目拆出為獨立條目，來源頁碼改為精確的 pdfPage 8／printedPage 101（原合併條目誤標為 99）
- 「英雄招式」導言：舊譯「你可以運用`虔誠`使出多種英雄招式」逐句相符
- 「3 虔誠招式」導言：舊譯「選擇 1 項費用為 3 點`虔誠`的英雄招式」逐句相符，僅補回「從以下選項中」
- 「5 虔誠招式」導言：舊譯原文誤植為「選擇 1 項費用為 3 點虔誠的英雄招式」（複製 3 費招式段落時忘記把 3 改成 5），已依正典訂正為「5 點」，並補回「從以下選項中」
- 已改用 bulletList 分別列出全部 4 個 3 虔誠招式與 4 個 5 虔誠招式，每項為 [中文名](id) 站內連結
- 本批依 M1 指示排除 Quick Build（「Violence Will Not Aid Thee.」3 費／「Curse of Terror.」5 費）

**擁有者裁決**

- [ ] 核准，內容與結構皆可進入正式 M1
- [ ] 需要修改

擁有者備註：

>

---
### 9. 神導士護咒 · Conduit Ward

- ID：`feature.conduit.conduit-ward`
- 來源：Heroes v1.01，印刷頁 99（PDF 頁 6）
- Canon 狀態：`verified`；繁中狀態：`reviewed`
- TI／裁決：無個別 TI；套用全域指南

**英文正典**

```json
{
  "id": "feature.conduit.conduit-ward",
  "type": "feature",
  "name": "Conduit Ward",
  "aliasesEn": [],
  "sections": [
    {
      "heading": null,
      "blocks": [
        {
          "kind": "paragraph",
          "text": "Your god grants you a ward that protects you from the faithless. Choose one of the following wards. You can change your ward along with your prayer (see Prayer above) by praying to your god as a respite activity."
        },
        {
          "kind": "definitionList",
          "marker": "none",
          "items": [
            {
              "term": "Bastion Ward",
              "text": "Your god grants you a holy countenance that protects you at all times. You gain a +1 bonus to saving throws."
            },
            {
              "term": "Quickness Ward",
              "text": "The gods imbue a divine swiftness within you. Whenever an adjacent creature deals damage to you, you can shift up to a number of squares equal to your Intuition score after the damage is dealt."
            },
            {
              "term": "Sanctuary Ward",
              "text": "In response to a foe's aggression, your god protects you. Whenever another creature damages you, that creature can't target you with a strike until you harm them or one of their allies, or until the end of their next turn."
            },
            {
              "term": "Spirit Ward",
              "text": "Invisible spirits surround you if you are harmed. Whenever an adjacent creature deals damage to you, they take corruption damage equal to your Intuition score."
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
  "id": "feature.conduit.conduit-ward",
  "nameZhHant": "神導士護咒",
  "aliasesZhHant": [],
  "sections": [
    {
      "heading": null,
      "blocks": [
        {
          "kind": "paragraph",
          "text": "神明賜予你一道護咒，保護你免受無信者的侵擾。從以下選項中選擇 1 種護咒。作為休整活動，你可以向神明祈禱來更換你的護咒和禱詞。"
        },
        {
          "kind": "definitionList",
          "marker": "none",
          "items": [
            {
              "term": "堡壘護咒",
              "text": "神明賜予你神聖的氣息，時刻保護著你。你的豁免獲得 +1 加值。"
            },
            {
              "term": "靈敏護咒",
              "text": "神明在你體內灌注神聖的迅捷之力。每當 1 個相鄰的生物對你造成傷害時，你可以在傷害結算後遁移最多等於你`直覺`的格數。"
            },
            {
              "term": "聖域護咒",
              "text": "當敵人來犯時，你的神明會庇護你。在 1 個生物對你造成傷害後，該生物無法再對你發動打擊，直到你傷害他或他的 1 個盟友，或直到他下個回合結束。"
            },
            {
              "term": "靈體護咒",
              "text": "無形的靈體會在你陷入危險時環繞在你身邊。每當 1 個相鄰的生物對你造成傷害時，他會受到等於你`直覺`的腐朽傷害。"
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
    "translationSource": "舊 Notion 神導士護咒（sources/notion-export/class-notion/conduit/神導士護咒 239f74afd25b80b6a111dd0be2bbdd43.md）",
    "commonProcessing": [
      "「(see Prayer above)」比照 TI-5～7 既有裁決省略頁面內參照，舊譯本身已省略，做法一致",
      "本批依指示排除本條目 Quick Build（「Bastion Ward.」）",
      "堡壘護咒／聖域護咒／靈體護咒與舊譯逐句相符，僅套用格式規則",
      "舊譯原將導言拆成 2 段（「…選擇 1 種護咒。」／「作為長休活動，你可以…」），正典為單一連續段落，草稿依正典合併為 1 段，文字仍逐句取自舊譯，僅段落邊界調整",
      "Respite＝休整（既有 approved 術語，TI-18）：舊譯「長休」已訂正為「休整」",
      "2026-07-31 Reviewer 複核，擁有者確認：靈敏護咒舊譯「遁移最多等於你`直覺` ×2 的格數」為錯誤，正典（pdfPage 6／printedPage 99，已用 -layout 文字抽取與 150dpi 圖像 out/conduit/page-06.png 雙重核對）為「shift up to a number of squares equal to your Intuition score」，並無 ×2，訂正為「等於你`直覺`的格數」定案，不再列為待裁"
    ],
    "decisions": [],
    "pendingOwnerDecisions": []
  },
  "canonRef": {
    "id": "feature.conduit.conduit-ward",
    "document": "heroes-v1.01-05-conduit",
    "printedPage": 99
  }
}
```

**結構與翻譯注意事項**

- 「(see Prayer above)」比照 TI-5～7 既有裁決省略頁面內參照，舊譯本身已省略，做法一致
- 本批依指示排除本條目 Quick Build（「Bastion Ward.」）
- 堡壘護咒／聖域護咒／靈體護咒與舊譯逐句相符，僅套用格式規則
- 舊譯原將導言拆成 2 段（「…選擇 1 種護咒。」／「作為長休活動，你可以…」），正典為單一連續段落，草稿依正典合併為 1 段，文字仍逐句取自舊譯，僅段落邊界調整
- Respite＝休整（既有 approved 術語，TI-18）：舊譯「長休」已訂正為「休整」
- 2026-07-31 Reviewer 複核，擁有者確認：靈敏護咒舊譯「遁移最多等於你`直覺` ×2 的格數」為錯誤，正典（pdfPage 6／printedPage 99，已用 -layout 文字抽取與 150dpi 圖像 out/conduit/page-06.png 雙重核對）為「shift up to a number of squares equal to your Intuition score」，並無 ×2，訂正為「等於你`直覺`的格數」定案，不再列為待裁

**擁有者裁決**

- [ ] 核准，內容與結構皆可進入正式 M1
- [ ] 需要修改

擁有者備註：

>

---
### 10. 溫慈祝福 · Blessing of Compassion

- ID：`feature.conduit.domain-feature.blessing-of-compassion`
- 來源：Heroes v1.01，印刷頁 97（PDF 頁 4）
- Canon 狀態：`verified`；繁中狀態：`reviewed`
- TI／裁決：無個別 TI；套用全域指南

**英文正典**

```json
{
  "id": "feature.conduit.domain-feature.blessing-of-compassion",
  "type": "feature",
  "name": "Blessing of Compassion",
  "aliasesEn": [],
  "sections": [
    {
      "heading": null,
      "blocks": [
        {
          "kind": "paragraph",
          "text": "You exude a magic presence that can soothe those willing to socially engage with you. You gain an edge on any test made to assist another creature with a test."
        },
        {
          "kind": "paragraph",
          "text": "Additionally, when you are present at the start of a negotiation, one NPC of your choice has their patience increased by 1 (to a maximum of 5), and the first test made to influence them gains an edge."
        }
      ]
    }
  ],
  "origin": {
    "kind": "domain",
    "id": "domain.love"
  },
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
  "id": "feature.conduit.domain-feature.blessing-of-compassion",
  "nameZhHant": "溫慈祝福",
  "aliasesZhHant": [],
  "sections": [
    {
      "heading": null,
      "blocks": [
        {
          "kind": "paragraph",
          "text": "你散發著一種魔法氣息，能安撫願意與你進行社交互動的人。當你協助其他生物進行考驗時，你會獲得 1 個優勢。"
        },
        {
          "kind": "paragraph",
          "text": "此外，當談判開始時，若你在場，你可以讓 1 個 NPC 的`耐心`增加 1 點（最多 5 點），且首次影響該 NPC 的考驗會獲得 1 個優勢。"
        }
      ]
    }
  ],
  "meta": {
    "status": "reviewed",
    "reviewedBy": "owner",
    "reviewedAt": "2026-07-31",
    "translationSource": "舊 Notion 領域特性 · 慈愛：溫慈祝福",
    "commonProcessing": [
      "與舊譯逐句相符，僅套用格式規則",
      "2026-07-31 Reviewer 複核，擁有者確認條目名稱採舊譯短式「溫慈祝福」（草稿曾一度改譯為「慈愛祝福」，已改回，不再列為待裁）"
    ],
    "decisions": [],
    "pendingOwnerDecisions": []
  },
  "canonRef": {
    "id": "feature.conduit.domain-feature.blessing-of-compassion",
    "document": "heroes-v1.01-05-conduit",
    "printedPage": 97
  }
}
```

**結構與翻譯注意事項**

- 與舊譯逐句相符，僅套用格式規則
- 2026-07-31 Reviewer 複核，擁有者確認條目名稱採舊譯短式「溫慈祝福」（草稿曾一度改譯為「慈愛祝福」，已改回，不再列為待裁）

**擁有者裁決**

- [ ] 核准，內容與結構皆可進入正式 M1
- [ ] 需要修改

擁有者備註：

>

---
### 11. 通曉祝福 · Blessing of Comprehension

- ID：`feature.conduit.domain-feature.blessing-of-comprehension`
- 來源：Heroes v1.01，印刷頁 97（PDF 頁 4）
- Canon 狀態：`verified`；繁中狀態：`reviewed`
- TI／裁決：無個別 TI；套用全域指南

**英文正典**

```json
{
  "id": "feature.conduit.domain-feature.blessing-of-comprehension",
  "type": "feature",
  "name": "Blessing of Comprehension",
  "aliasesEn": [],
  "sections": [
    {
      "heading": null,
      "blocks": [
        {
          "kind": "paragraph",
          "text": "You can interpret diagrams and charts even if you don't understand the language associated with them. You are considered fluent in all languages for the purpose of understanding the project source for any research or crafting project (see Chapter 12: Downtime Projects)."
        }
      ]
    }
  ],
  "origin": {
    "kind": "domain",
    "id": "domain.knowledge"
  },
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
  "id": "feature.conduit.domain-feature.blessing-of-comprehension",
  "nameZhHant": "通曉祝福",
  "aliasesZhHant": [],
  "sections": [
    {
      "heading": null,
      "blocks": [
        {
          "kind": "paragraph",
          "text": "即使你不懂圖表和圖解所使用的語言，你也能解讀它們。當你試圖理解任何製造類或研究類專案的來源資料時，你視為精通所有語言。"
        }
      ]
    }
  ],
  "meta": {
    "status": "reviewed",
    "reviewedBy": "owner",
    "reviewedAt": "2026-07-31",
    "translationSource": "舊 Notion 領域特性 · 知識：通曉祝福",
    "commonProcessing": [
      "「(see Chapter 12: Downtime Projects)」比照 TI-5～7 省略頁面內章節參照，舊譯已省略，做法一致",
      "其餘與舊譯逐句相符"
    ],
    "decisions": [],
    "pendingOwnerDecisions": []
  },
  "canonRef": {
    "id": "feature.conduit.domain-feature.blessing-of-comprehension",
    "document": "heroes-v1.01-05-conduit",
    "printedPage": 97
  }
}
```

**結構與翻譯注意事項**

- 「(see Chapter 12: Downtime Projects)」比照 TI-5～7 省略頁面內章節參照，舊譯已省略，做法一致
- 其餘與舊譯逐句相符

**擁有者裁決**

- [ ] 核准，內容與結構皆可進入正式 M1
- [ ] 需要修改

擁有者備註：

>

---
### 12. 聖化武器 · Sanctified Weapon

- ID：`feature.conduit.domain-feature.sanctified-weapon`
- 來源：Heroes v1.01，印刷頁 98（PDF 頁 5）
- Canon 狀態：`verified`；繁中狀態：`reviewed`
- TI／裁決：無個別 TI；套用全域指南

**英文正典**

```json
{
  "id": "feature.conduit.domain-feature.sanctified-weapon",
  "type": "feature",
  "name": "Sanctified Weapon",
  "aliasesEn": [],
  "sections": [
    {
      "heading": null,
      "blocks": [
        {
          "kind": "paragraph",
          "text": "As a respite activity, you can bless a weapon. Any creature who wields the weapon gains a +1 bonus to rolled damage with abilities that use the weapon. This benefit lasts until you finish another respite."
        }
      ]
    }
  ],
  "origin": {
    "kind": "domain",
    "id": "domain.war"
  },
  "level": 1,
  "canonReviewStatus": "verified",
  "source": {
    "document": "heroes-v1.01-05-conduit",
    "version": "1.01",
    "pdfPage": 5,
    "printedPage": 98,
    "checkedAt": "2026-07-31"
  }
}
```

**繁中內容**

```json
{
  "id": "feature.conduit.domain-feature.sanctified-weapon",
  "nameZhHant": "聖化武器",
  "aliasesZhHant": [],
  "sections": [
    {
      "heading": null,
      "blocks": [
        {
          "kind": "paragraph",
          "text": "作為 1 個休整活動，你可以祝福 1 件武器。任何生物若使用聖化武器發動招式並造成檢定傷害，該傷害會獲得 +1 加值。此效果會持續到你完成下次休整為止。"
        }
      ]
    }
  ],
  "meta": {
    "status": "reviewed",
    "reviewedBy": "owner",
    "reviewedAt": "2026-07-31",
    "translationSource": "舊 Notion 領域特性 · 戰爭：聖化武器",
    "commonProcessing": [
      "與舊譯逐句相符，僅套用格式規則",
      "Respite＝休整（既有 approved 術語，TI-18）：舊譯「長休」已訂正為「休整」"
    ],
    "decisions": [],
    "pendingOwnerDecisions": []
  },
  "canonRef": {
    "id": "feature.conduit.domain-feature.sanctified-weapon",
    "document": "heroes-v1.01-05-conduit",
    "printedPage": 98
  }
}
```

**結構與翻譯注意事項**

- 與舊譯逐句相符，僅套用格式規則
- Respite＝休整（既有 approved 術語，TI-18）：舊譯「長休」已訂正為「休整」

**擁有者裁決**

- [ ] 核准，內容與結構皆可進入正式 M1
- [ ] 需要修改

擁有者備註：

>

---
### 13. 天氣祝福 · Blessing of Fortunate Weather

- ID：`feature.conduit.domain-feature.blessing-of-fortunate-weather`
- 來源：Heroes v1.01，印刷頁 97（PDF 頁 4）
- Canon 狀態：`verified`；繁中狀態：`reviewed`
- TI／裁決：無個別 TI；套用全域指南

**英文正典**

```json
{
  "id": "feature.conduit.domain-feature.blessing-of-fortunate-weather",
  "type": "feature",
  "name": "Blessing of Fortunate Weather",
  "aliasesEn": [],
  "sections": [
    {
      "heading": null,
      "blocks": [
        {
          "kind": "paragraph",
          "text": "Each time you finish a respite, you can decide the weather conditions within 100 squares. Until you finish another respite, the weather conditions you establish follow you through any mundane outdoor locations. Choose one of the following types of weather, each of which grants a benefit to you and your allies:"
        },
        {
          "kind": "definitionList",
          "marker": "none",
          "items": [
            {
              "term": "Clear",
              "text": "You and your allies gain an edge on tests that use the Search or Navigate skills."
            },
            {
              "term": "Foggy",
              "text": "You and your allies gain an edge on tests that use the Hide skill."
            },
            {
              "term": "Overcast",
              "text": "You and your allies gain an edge on tests that use the Endurance skill."
            },
            {
              "term": "Precipitation",
              "text": "When the ground is muddy or snowy, you and your allies gain an edge on tests that use the Track skill."
            }
          ]
        },
        {
          "kind": "paragraph",
          "text": "If you are in the same area as a creature using this or a similar feature who has chosen a different weather effect, the features negate each other where their areas overlap."
        }
      ]
    }
  ],
  "origin": {
    "kind": "domain",
    "id": "domain.storm"
  },
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
  "id": "feature.conduit.domain-feature.blessing-of-fortunate-weather",
  "nameZhHant": "天氣祝福",
  "aliasesZhHant": [],
  "sections": [
    {
      "heading": null,
      "blocks": [
        {
          "kind": "paragraph",
          "text": "每當你完成休整時，你可以決定 100 格範圍內的天氣狀況。你所設定的天氣會跟隨你穿過任何尋常的戶外地點，直到你完成另一次休整為止。從以下天氣類型中選擇 1 種，每種都會為你和你的盟友提供 1 項好處："
        },
        {
          "kind": "definitionList",
          "marker": "none",
          "items": [
            {
              "term": "晴朗",
              "text": "若使用`搜索`或`導航`技能進行考驗，你和你的盟友的檢定會獲得 1 個優勢。"
            },
            {
              "term": "多霧",
              "text": "若使用`躲藏`技能進行考驗，你和你的盟友的檢定會獲得 1 個優勢。"
            },
            {
              "term": "陰天",
              "text": "若使用`耐力`技能進行考驗，你和你的盟友的檢定會獲得 1 個優勢。"
            },
            {
              "term": "降水",
              "text": "當地面泥濘或積雪時，若使用`追蹤`技能進行考驗，你和你的盟友的檢定會獲得 1 個優勢。"
            }
          ]
        },
        {
          "kind": "paragraph",
          "text": "若你與另一個使用此特性或類似特性的生物處於相同區域，但對方選擇了不同的天氣效果，這些效果會在重疊區域互相抵消。"
        }
      ]
    }
  ],
  "meta": {
    "status": "reviewed",
    "reviewedBy": "owner",
    "reviewedAt": "2026-07-31",
    "translationSource": "舊 Notion 領域特性 · 風暴：天氣祝福",
    "commonProcessing": [
      "正典為 definitionList（Clear/Foggy/Overcast/Precipitation 各自帶專有名詞），比照 150dpi 圖像 out/conduit/page-04.png 核對版式為懸掛縮排、無項目符號，marker 定為 none",
      "4 個天氣選項的規則本體（技能與優勢）與舊譯相符，但舊譯 4 項皆省略「You and your allies」（你和你的盟友的），只寫「檢定會獲得 1 個優勢」；正典明確限定是「你和你的盟友的」檢定，草稿依正典逐項補回，非改寫語意",
      "降水一項舊譯把「when the ground is muddy or snowy」放在句尾，正典在句首，草稿依正典語序調整（保留子句邊界，非改寫語意）",
      "Respite＝休整（既有 approved 術語，TI-18）：舊譯「長休」已訂正為「休整」"
    ],
    "decisions": [],
    "pendingOwnerDecisions": []
  },
  "canonRef": {
    "id": "feature.conduit.domain-feature.blessing-of-fortunate-weather",
    "document": "heroes-v1.01-05-conduit",
    "printedPage": 97
  }
}
```

**結構與翻譯注意事項**

- 正典為 definitionList（Clear/Foggy/Overcast/Precipitation 各自帶專有名詞），比照 150dpi 圖像 out/conduit/page-04.png 核對版式為懸掛縮排、無項目符號，marker 定為 none
- 4 個天氣選項的規則本體（技能與優勢）與舊譯相符，但舊譯 4 項皆省略「You and your allies」（你和你的盟友的），只寫「檢定會獲得 1 個優勢」；正典明確限定是「你和你的盟友的」檢定，草稿依正典逐項補回，非改寫語意
- 降水一項舊譯把「when the ground is muddy or snowy」放在句尾，正典在句首，草稿依正典語序調整（保留子句邊界，非改寫語意）
- Respite＝休整（既有 approved 術語，TI-18）：舊譯「長休」已訂正為「休整」

**擁有者裁決**

- [ ] 核准，內容與結構皆可進入正式 M1
- [ ] 需要修改

擁有者備註：

>

---
### 14. 晨光庇護 · Inner Light

- ID：`feature.conduit.domain-feature.inner-light`
- 來源：Heroes v1.01，印刷頁 98（PDF 頁 5）
- Canon 狀態：`verified`；繁中狀態：`reviewed`
- TI／裁決：無個別 TI；套用全域指南

**英文正典**

```json
{
  "id": "feature.conduit.domain-feature.inner-light",
  "type": "feature",
  "name": "Inner Light",
  "aliasesEn": [],
  "sections": [
    {
      "heading": null,
      "blocks": [
        {
          "kind": "paragraph",
          "text": "Each time you finish a respite, you can choose yourself or one ally who is also finishing a respite to gain the benefit of a divine ritual. You place a ray of morning light into the chosen character's soul, granting them a +1 bonus to saving throws that lasts until you finish another respite."
        }
      ]
    }
  ],
  "origin": {
    "kind": "domain",
    "id": "domain.sun"
  },
  "level": 1,
  "canonReviewStatus": "verified",
  "source": {
    "document": "heroes-v1.01-05-conduit",
    "version": "1.01",
    "pdfPage": 5,
    "printedPage": 98,
    "checkedAt": "2026-07-31"
  }
}
```

**繁中內容**

```json
{
  "id": "feature.conduit.domain-feature.inner-light",
  "nameZhHant": "晨光庇護",
  "aliasesZhHant": [],
  "sections": [
    {
      "heading": null,
      "blocks": [
        {
          "kind": "paragraph",
          "text": "每當你完成休整時，你可以選擇自己或另 1 個同樣完成休整的盟友，獲得神聖儀式的好處。你將一道晨光注入所選角色的靈魂中，讓他的豁免獲得 +1 加值，持續到你完成下次休整為止。"
        }
      ]
    }
  ],
  "meta": {
    "status": "reviewed",
    "reviewedBy": "owner",
    "reviewedAt": "2026-07-31",
    "translationSource": "舊 Notion 領域特性 · 太陽：晨光庇護",
    "commonProcessing": [
      "與舊譯逐句相符，僅套用格式規則",
      "Respite＝休整（既有 approved 術語，TI-18）：舊譯「長休」已訂正為「休整」",
      "2026-07-31 擁有者第三輪驗收裁決：「另一個」改為「另 1 個」，數量詞統一用阿拉伯數字（指南 §6）"
    ],
    "decisions": [],
    "pendingOwnerDecisions": []
  },
  "canonRef": {
    "id": "feature.conduit.domain-feature.inner-light",
    "document": "heroes-v1.01-05-conduit",
    "printedPage": 98
  }
}
```

**結構與翻譯注意事項**

- 與舊譯逐句相符，僅套用格式規則
- Respite＝休整（既有 approved 術語，TI-18）：舊譯「長休」已訂正為「休整」
- 2026-07-31 擁有者第三輪驗收裁決：「另一個」改為「另 1 個」，數量詞統一用阿拉伯數字（指南 §6）

**擁有者裁決**

- [ ] 核准，內容與結構皆可進入正式 M1
- [ ] 需要修改

擁有者備註：

>

---
### 15. 靈光詐現 · Inspired Deception

- ID：`feature.conduit.domain-feature.inspired-deception`
- 來源：Heroes v1.01，印刷頁 98（PDF 頁 5）
- Canon 狀態：`verified`；繁中狀態：`reviewed`
- TI／裁決：無個別 TI；套用全域指南

**英文正典**

```json
{
  "id": "feature.conduit.domain-feature.inspired-deception",
  "type": "feature",
  "name": "Inspired Deception",
  "aliasesEn": [],
  "sections": [
    {
      "heading": null,
      "blocks": [
        {
          "kind": "paragraph",
          "text": "The gods favor your thievery with magic. Whenever you make a test that uses a skill you have from the intrigue skill group, you can use Intuition on the test instead of another characteristic."
        }
      ]
    }
  ],
  "origin": {
    "kind": "domain",
    "id": "domain.trickery"
  },
  "level": 1,
  "canonReviewStatus": "verified",
  "source": {
    "document": "heroes-v1.01-05-conduit",
    "version": "1.01",
    "pdfPage": 5,
    "printedPage": 98,
    "checkedAt": "2026-07-31"
  }
}
```

**繁中內容**

```json
{
  "id": "feature.conduit.domain-feature.inspired-deception",
  "nameZhHant": "靈光詐現",
  "aliasesZhHant": [],
  "sections": [
    {
      "heading": null,
      "blocks": [
        {
          "kind": "paragraph",
          "text": "神明以魔法眷顧你的詭詐行為。每當你使用你擁有的`隱密類`技能進行考驗時，你可以用`直覺`取代原本需要的屬性進行檢定。"
        }
      ]
    }
  ],
  "meta": {
    "status": "reviewed",
    "reviewedBy": "owner",
    "reviewedAt": "2026-07-31",
    "translationSource": "舊 Notion 領域特性 · 詭術：靈光詐現",
    "commonProcessing": [
      "技能組 Intrigue＝隱密類（2026-07-31 Reviewer 複核，擁有者確認 5 個技能組譯名定案：Crafting＝工藝類、Lore＝學識類、Exploration＝探索類、Interpersonal＝交涉類、Intrigue＝隱密類，適用全部 M1 條目，不再列為待裁）",
      "2026-07-31 Reviewer 複核，擁有者確認：舊譯「你可以用`氣場`取代原本需要的屬性」為錯誤，正典（pdfPage 5／printedPage 98，已用 -layout 文字抽取與 150dpi 圖像 out/conduit/page-05.png 雙重核對）為「you can use Intuition」，訂正為`直覺`定案，不再列為待裁"
    ],
    "decisions": [],
    "pendingOwnerDecisions": []
  },
  "canonRef": {
    "id": "feature.conduit.domain-feature.inspired-deception",
    "document": "heroes-v1.01-05-conduit",
    "printedPage": 98
  }
}
```

**結構與翻譯注意事項**

- 技能組 Intrigue＝隱密類（2026-07-31 Reviewer 複核，擁有者確認 5 個技能組譯名定案：Crafting＝工藝類、Lore＝學識類、Exploration＝探索類、Interpersonal＝交涉類、Intrigue＝隱密類，適用全部 M1 條目，不再列為待裁）
- 2026-07-31 Reviewer 複核，擁有者確認：舊譯「你可以用`氣場`取代原本需要的屬性」為錯誤，正典（pdfPage 5／printedPage 98，已用 -layout 文字抽取與 150dpi 圖像 out/conduit/page-05.png 雙重核對）為「you can use Intuition」，訂正為`直覺`定案，不再列為待裁

**擁有者裁決**

- [ ] 核准，內容與結構皆可進入正式 M1
- [ ] 需要修改

擁有者備註：

>

---
### 16. 晦澀異象 · Oracular Visions

- ID：`feature.conduit.domain-feature.oracular-visions`
- 來源：Heroes v1.01，印刷頁 98（PDF 頁 5）
- Canon 狀態：`verified`；繁中狀態：`reviewed`
- TI／裁決：無個別 TI；套用全域指南

**英文正典**

```json
{
  "id": "feature.conduit.domain-feature.oracular-visions",
  "type": "feature",
  "name": "Oracular Visions",
  "aliasesEn": [],
  "sections": [
    {
      "heading": null,
      "blocks": [
        {
          "kind": "paragraph",
          "text": "Your deity rewards you with hazy visions of things to come. Each time you earn 1 or more Victories, you earn an equal number of fate points."
        },
        {
          "kind": "paragraph",
          "text": "Whenever you or a creature within 10 squares makes a test, you can spend 1 fate point to tap into a vision of the outcome, granting that creature an edge on the test. You lose any remaining fate points when you finish a respite."
        }
      ]
    }
  ],
  "origin": {
    "kind": "domain",
    "id": "domain.fate"
  },
  "level": 1,
  "canonReviewStatus": "verified",
  "source": {
    "document": "heroes-v1.01-05-conduit",
    "version": "1.01",
    "pdfPage": 5,
    "printedPage": 98,
    "checkedAt": "2026-07-31"
  }
}
```

**繁中內容**

```json
{
  "id": "feature.conduit.domain-feature.oracular-visions",
  "nameZhHant": "晦澀異象",
  "aliasesZhHant": [],
  "sections": [
    {
      "heading": null,
      "blocks": [
        {
          "kind": "paragraph",
          "text": "你的神明賜予你朦朧的未來景象。每當你獲得 1 點以上的`勝利值`時，你會獲得等量的命運點。"
        },
        {
          "kind": "paragraph",
          "text": "每當你自己或 10 格內的 1 個生物進行考驗時，你可以花費 1 點命運點來洞察結果，讓該生物的考驗獲得 1 個優勢。當你完成休整時，你會失去所有剩餘的命運點。"
        }
      ]
    }
  ],
  "meta": {
    "status": "reviewed",
    "reviewedBy": "owner",
    "reviewedAt": "2026-07-31",
    "translationSource": "舊 Notion 領域特性 · 命運：晦澀異象",
    "commonProcessing": [
      "舊譯原為單一段落，正典版式為兩段，草稿依正典段落邊界拆分，文字仍逐句取自舊譯",
      "Respite＝休整（既有 approved 術語，TI-18）：舊譯「長休」已訂正為「休整」"
    ],
    "decisions": [],
    "pendingOwnerDecisions": []
  },
  "canonRef": {
    "id": "feature.conduit.domain-feature.oracular-visions",
    "document": "heroes-v1.01-05-conduit",
    "printedPage": 98
  }
}
```

**結構與翻譯注意事項**

- 舊譯原為單一段落，正典版式為兩段，草稿依正典段落邊界拆分，文字仍逐句取自舊譯
- Respite＝休整（既有 approved 術語，TI-18）：舊譯「長休」已訂正為「休整」

**擁有者裁決**

- [ ] 核准，內容與結構皆可進入正式 M1
- [ ] 需要修改

擁有者備註：

>

---
### 17. 守護結界 · Protective Circle

- ID：`feature.conduit.domain-feature.protective-circle`
- 來源：Heroes v1.01，印刷頁 98（PDF 頁 5）
- Canon 狀態：`verified`；繁中狀態：`reviewed`
- TI／裁決：無個別 TI；套用全域指南

**英文正典**

```json
{
  "id": "feature.conduit.domain-feature.protective-circle",
  "type": "feature",
  "name": "Protective Circle",
  "aliasesEn": [],
  "sections": [
    {
      "heading": null,
      "blocks": [
        {
          "kind": "paragraph",
          "text": "You can spend 10 uninterrupted minutes to create a protective circle on the ground large enough to hold one size 1 creature. The circle lasts for 24 hours, until you create another, or until you dismiss it (no action required). Only creatures you designate at the time of drawing the circle can enter and exit the area. While in the protective circle, a creature can't be targeted by strikes."
        }
      ]
    }
  ],
  "origin": {
    "kind": "domain",
    "id": "domain.protection"
  },
  "level": 1,
  "canonReviewStatus": "verified",
  "source": {
    "document": "heroes-v1.01-05-conduit",
    "version": "1.01",
    "pdfPage": 5,
    "printedPage": 98,
    "checkedAt": "2026-07-31"
  }
}
```

**繁中內容**

```json
{
  "id": "feature.conduit.domain-feature.protective-circle",
  "nameZhHant": "守護結界",
  "aliasesZhHant": [],
  "sections": [
    {
      "heading": null,
      "blocks": [
        {
          "kind": "paragraph",
          "text": "你可以花費 10 分鐘不間斷地在地面上創造 1 道守護結界，大小足以容納 1 個`體型` 1 的生物。此結界持續 24 小時、直到你創造另一個守護結界，或是直到你解消它（無需動作）。只有你在繪製結界時指定的生物可以進出此區域。若生物處於守護結界內，他無法成為打擊的目標。"
        }
      ]
    }
  ],
  "meta": {
    "status": "reviewed",
    "reviewedBy": "owner",
    "reviewedAt": "2026-07-31",
    "translationSource": "舊 Notion 領域特性 · 守護：守護結界",
    "commonProcessing": [
      "段落順序依正典重排（結界持續時間提前、可進出對象在後），內容仍逐句取自舊譯或正典直譯，非改寫語意",
      "「或是直到你解消它」：舊譯原句為「或是直接解消它」，經與正典「until you dismiss it」核對，正典是「持續24小時、直到你創造另一個、或直到你解消它」三個並列的 until 子句，判斷舊譯「直接」為誤植（形近「直到」），已訂正為「直到」",
      "2026-07-31 Reviewer 複核，擁有者確認：舊譯「你必須指定 1 個生物。只有該生物可以進出結界」將可指定對象限定為恰好 1 個，但正典（pdfPage 5／printedPage 98，已用 150dpi 圖像 out/conduit/page-05.png 核對）為「Only creatures you designate（複數）at the time of drawing the circle can enter and exit the area」，未明文限定僅 1 個，訂正為「你在繪製結界時指定的生物可以進出」定案，不再列為待裁"
    ],
    "decisions": [],
    "pendingOwnerDecisions": []
  },
  "canonRef": {
    "id": "feature.conduit.domain-feature.protective-circle",
    "document": "heroes-v1.01-05-conduit",
    "printedPage": 98
  }
}
```

**結構與翻譯注意事項**

- 段落順序依正典重排（結界持續時間提前、可進出對象在後），內容仍逐句取自舊譯或正典直譯，非改寫語意
- 「或是直到你解消它」：舊譯原句為「或是直接解消它」，經與正典「until you dismiss it」核對，正典是「持續24小時、直到你創造另一個、或直到你解消它」三個並列的 until 子句，判斷舊譯「直接」為誤植（形近「直到」），已訂正為「直到」
- 2026-07-31 Reviewer 複核，擁有者確認：舊譯「你必須指定 1 個生物。只有該生物可以進出結界」將可指定對象限定為恰好 1 個，但正典（pdfPage 5／printedPage 98，已用 150dpi 圖像 out/conduit/page-05.png 核對）為「Only creatures you designate（複數）at the time of drawing the circle can enter and exit the area」，未明文限定僅 1 個，訂正為「你在繪製結界時指定的生物可以進出」定案，不再列為待裁

**擁有者裁決**

- [ ] 核准，內容與結構皆可進入正式 M1
- [ ] 需要修改

擁有者備註：

>

---
### 18. 活力儀式 · Revitalizing Ritual

- ID：`feature.conduit.domain-feature.revitalizing-ritual`
- 來源：Heroes v1.01，印刷頁 98（PDF 頁 5）
- Canon 狀態：`verified`；繁中狀態：`reviewed`
- TI／裁決：無個別 TI；套用全域指南

**英文正典**

```json
{
  "id": "feature.conduit.domain-feature.revitalizing-ritual",
  "type": "feature",
  "name": "Revitalizing Ritual",
  "aliasesEn": [],
  "sections": [
    {
      "heading": null,
      "blocks": [
        {
          "kind": "paragraph",
          "text": "Each time you finish a respite, you can choose yourself or one ally who is also finishing a respite to gain the benefit of a divine ritual. The chosen character gains a bonus to their recovery value equal to your level that lasts until you finish another respite."
        }
      ]
    }
  ],
  "origin": {
    "kind": "domain",
    "id": "domain.life"
  },
  "level": 1,
  "canonReviewStatus": "verified",
  "source": {
    "document": "heroes-v1.01-05-conduit",
    "version": "1.01",
    "pdfPage": 5,
    "printedPage": 98,
    "checkedAt": "2026-07-31"
  }
}
```

**繁中內容**

```json
{
  "id": "feature.conduit.domain-feature.revitalizing-ritual",
  "nameZhHant": "活力儀式",
  "aliasesZhHant": [],
  "sections": [
    {
      "heading": null,
      "blocks": [
        {
          "kind": "paragraph",
          "text": "每當你完成休整時，你可以選擇自己或另 1 個同樣完成休整的盟友，獲得神聖儀式的好處。目標的`復元值`會獲得等於你等級的加值，持續到你完成下次休整為止。"
        }
      ]
    }
  ],
  "meta": {
    "status": "reviewed",
    "reviewedBy": "owner",
    "reviewedAt": "2026-07-31",
    "translationSource": "舊 Notion 領域特性 · 生命：活力儀式",
    "commonProcessing": [
      "第 1 句與舊譯逐句相符",
      "Respite＝休整（既有 approved 術語，TI-18）：舊譯「長休」已訂正為「休整」",
      "2026-07-31 Reviewer 複核，擁有者確認：舊譯「`復元值`會獲得 +1 加值」（固定值）為錯誤，正典（pdfPage 5／printedPage 98，已用 150dpi 圖像 out/conduit/page-05.png 核對）為「a bonus...equal to your level」（等於等級，會隨等級成長；1 級時數值恰好相同，但規則本身不同），訂正為「等於你等級的加值」定案",
      "2026-07-31 擁有者最終驗收裁決：「另一個」改為「另 1 個」，與已核准的晨光庇護（feature.conduit.domain-feature.inner-light）用字一致"
    ],
    "decisions": [],
    "pendingOwnerDecisions": []
  },
  "canonRef": {
    "id": "feature.conduit.domain-feature.revitalizing-ritual",
    "document": "heroes-v1.01-05-conduit",
    "printedPage": 98
  }
}
```

**結構與翻譯注意事項**

- 第 1 句與舊譯逐句相符
- Respite＝休整（既有 approved 術語，TI-18）：舊譯「長休」已訂正為「休整」
- 2026-07-31 Reviewer 複核，擁有者確認：舊譯「`復元值`會獲得 +1 加值」（固定值）為錯誤，正典（pdfPage 5／printedPage 98，已用 150dpi 圖像 out/conduit/page-05.png 核對）為「a bonus...equal to your level」（等於等級，會隨等級成長；1 級時數值恰好相同，但規則本身不同），訂正為「等於你等級的加值」定案
- 2026-07-31 擁有者最終驗收裁決：「另一個」改為「另 1 個」，與已核准的晨光庇護（feature.conduit.domain-feature.inner-light）用字一致

**擁有者裁決**

- [ ] 核准，內容與結構皆可進入正式 M1
- [ ] 需要修改

擁有者備註：

>

---

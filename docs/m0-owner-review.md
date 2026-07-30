# M0 · 28 筆內容逐筆驗收表

> 這份文件是擁有者驗收閘門，不是核准紀錄。所有未勾選條目維持現有狀態；工具不得自行把 Canon 改為 `verified`，也不得把繁中草稿改為 `reviewed`。

## 驗收方式

逐筆核對來源頁碼、英文正典、繁中譯文、TI 決策與結構注意事項。每一筆請只勾選一個結果；需要修改時，直接在該條目的「擁有者備註」下補充。
本次清單共 28 筆：16 招式、9 狀態、3 職業特性。

- [ ] 我已完成全部 28 筆驗收
- [ ] 可將核准條目的 Canon 升為 `verified`
- [ ] 可將核准的繁中草稿升為 `reviewed`

---

## 招式 · 16 筆

### 1. 近戰武器基礎打擊 · Melee Weapon Free Strike

- ID：`ability.basic.melee-weapon-free-strike`
- 來源：Heroes v1.01，印刷頁 17（PDF 頁 32）
- Canon 狀態：`verified`；繁中狀態：`reviewed`
- TI／裁決：無個別 TI；套用全域指南

**英文正典**

```json
{
  "id": "ability.basic.melee-weapon-free-strike",
  "type": "ability",
  "name": "Melee Weapon Free Strike",
  "aliasesEn": [],
  "flavor": null,
  "keywords": [
    "charge",
    "melee",
    "strike",
    "weapon"
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
    "characteristic": {
      "kind": "choice",
      "options": [
        "might",
        "agility"
      ],
      "raw": "Might or Agility"
    },
    "tiers": [
      {
        "threshold": "≤11",
        "text": "2 + M or A damage",
        "potency": null,
        "raw": "2 + M or A damage"
      },
      {
        "threshold": "12-16",
        "text": "5 + M or A damage",
        "potency": null,
        "raw": "5 + M or A damage"
      },
      {
        "threshold": "17+",
        "text": "7 + M or A damage",
        "potency": null,
        "raw": "7 + M or A damage"
      }
    ]
  },
  "extraCosts": [],
  "origin": {
    "kind": "core",
    "id": null
  },
  "abilityCategory": "basic",
  "level": null,
  "canonReviewStatus": "verified",
  "source": {
    "document": "heroes-v1.01-00-the-basic-and-making-a-hero",
    "version": "1.01",
    "pdfPage": 32,
    "printedPage": 17,
    "checkedAt": "2026-07-29"
  }
}
```

**繁中內容**

```json
{
  "id": "ability.basic.melee-weapon-free-strike",
  "nameZhHant": "近戰武器基礎打擊",
  "aliasesZhHant": [],
  "powerRoll": {
    "tiers": [
      {
        "threshold": "≤11",
        "text": "2 + `力量`或`敏捷`傷害"
      },
      {
        "threshold": "12-16",
        "text": "5 + `力量`或`敏捷`傷害"
      },
      {
        "threshold": "17+",
        "text": "7 + `力量`或`敏捷`傷害"
      }
    ]
  },
  "meta": {
    "status": "reviewed",
    "reviewedBy": "owner",
    "reviewedAt": "2026-07-29",
    "nameApproval": "名稱與三階層逐欄比對，全部 exact，對齊報告見 docs/alignment/zh-batch1-alignment.md。",
    "translationSource": "舊 Notion 招式列表 · 近戰武器基礎打擊",
    "commonProcessing": [
      "target「1 個生物或物體」可由 §4.4 的組合規則產生，不存於本層",
      "flavor 為 null——原文卡片無敘述文字"
    ],
    "decisions": [],
    "conventions": "全域通則見 docs/translation-guide.md §6（排版）與 §7（規則文本一律第二人稱）。"
  },
  "canonRef": {
    "id": "ability.basic.melee-weapon-free-strike",
    "document": "heroes-v1.01-00-the-basic-and-making-a-hero",
    "printedPage": 17
  }
}
```

**結構與翻譯注意事項**

- target「1 個生物或物體」可由 §4.4 的組合規則產生，不存於本層
- flavor 為 null——原文卡片無敘述文字

**擁有者裁決**

- [ ] 核准，內容與結構皆可進入正式 M0
- [ ] 需要修改

擁有者備註：

> 

---
### 2. 遠程武器基礎打擊 · Ranged Weapon Free Strike

- ID：`ability.basic.ranged-weapon-free-strike`
- 來源：Heroes v1.01，印刷頁 17（PDF 頁 32）
- Canon 狀態：`verified`；繁中狀態：`reviewed`
- TI／裁決：無個別 TI；套用全域指南

**英文正典**

```json
{
  "id": "ability.basic.ranged-weapon-free-strike",
  "type": "ability",
  "name": "Ranged Weapon Free Strike",
  "aliasesEn": [],
  "flavor": null,
  "keywords": [
    "ranged",
    "strike",
    "weapon"
  ],
  "actionType": "main",
  "cost": null,
  "distance": {
    "kind": "ranged",
    "value": 5,
    "raw": "Ranged 5"
  },
  "target": "One creature or object",
  "powerRoll": {
    "characteristic": {
      "kind": "choice",
      "options": [
        "might",
        "agility"
      ],
      "raw": "Might or Agility"
    },
    "tiers": [
      {
        "threshold": "≤11",
        "text": "2 + M or A damage",
        "potency": null,
        "raw": "2 + M or A damage"
      },
      {
        "threshold": "12-16",
        "text": "4 + M or A damage",
        "potency": null,
        "raw": "4 + M or A damage"
      },
      {
        "threshold": "17+",
        "text": "6 + M or A damage",
        "potency": null,
        "raw": "6 + M or A damage"
      }
    ]
  },
  "extraCosts": [],
  "origin": {
    "kind": "core",
    "id": null
  },
  "abilityCategory": "basic",
  "level": null,
  "canonReviewStatus": "verified",
  "source": {
    "document": "heroes-v1.01-00-the-basic-and-making-a-hero",
    "version": "1.01",
    "pdfPage": 32,
    "printedPage": 17,
    "checkedAt": "2026-07-29"
  }
}
```

**繁中內容**

```json
{
  "id": "ability.basic.ranged-weapon-free-strike",
  "nameZhHant": "遠程武器基礎打擊",
  "aliasesZhHant": [],
  "powerRoll": {
    "tiers": [
      {
        "threshold": "≤11",
        "text": "2 + `力量`或`敏捷`傷害"
      },
      {
        "threshold": "12-16",
        "text": "4 + `力量`或`敏捷`傷害"
      },
      {
        "threshold": "17+",
        "text": "6 + `力量`或`敏捷`傷害"
      }
    ]
  },
  "meta": {
    "status": "reviewed",
    "reviewedBy": "owner",
    "reviewedAt": "2026-07-29",
    "nameApproval": "名稱與三階層逐欄比對，全部 exact，對齊報告見 docs/alignment/zh-batch1-alignment.md。",
    "translationSource": "舊 Notion 招式列表 · 遠程武器基礎打擊",
    "commonProcessing": [
      "target「1 個生物或物體」可由 §4.4 的組合規則產生，不存於本層",
      "flavor 為 null——原文卡片無敘述文字"
    ],
    "decisions": [],
    "conventions": "全域通則見 docs/translation-guide.md §6（排版）與 §7（規則文本一律第二人稱）。"
  },
  "canonRef": {
    "id": "ability.basic.ranged-weapon-free-strike",
    "document": "heroes-v1.01-00-the-basic-and-making-a-hero",
    "printedPage": 17
  }
}
```

**結構與翻譯注意事項**

- target「1 個生物或物體」可由 §4.4 的組合規則產生，不存於本層
- flavor 為 null——原文卡片無敘述文字

**擁有者裁決**

- [ ] 核准，內容與結構皆可進入正式 M0
- [ ] 需要修改

擁有者備註：

> 

---
### 3. 當場拘捕 · Arrest

- ID：`ability.censor.arrest`
- 來源：Heroes v1.01，印刷頁 83（PDF 頁 6）
- Canon 狀態：`verified`；繁中狀態：`reviewed`
- TI／裁決：TI-28、TI-29

**英文正典**

```json
{
  "id": "ability.censor.arrest",
  "type": "ability",
  "name": "Arrest",
  "aliasesEn": [],
  "flavor": "“I got you, you son of a bitch.”",
  "keywords": [
    "magic",
    "melee",
    "strike",
    "weapon"
  ],
  "actionType": "main",
  "cost": {
    "resource": "wrath",
    "value": 5
  },
  "distance": {
    "kind": "melee",
    "value": 1,
    "raw": "Melee 1"
  },
  "target": "One creature",
  "powerRoll": {
    "characteristic": "might",
    "tiers": [
      {
        "threshold": "≤11",
        "text": "6 + M holy damage; grabbed"
      },
      {
        "threshold": "12-16",
        "text": "9 + M holy damage; grabbed"
      },
      {
        "threshold": "17+",
        "text": "13 + M holy damage; grabbed"
      }
    ]
  },
  "extraCosts": [],
  "effect": [
    "If the target makes a strike against a creature while grabbed this way, you can spend 3 wrath to deal holy damage to them equal to your Presence score, then change the target of the strike to another target within the strike’s distance."
  ],
  "origin": {
    "kind": "class",
    "id": "class.censor"
  },
  "abilityCategory": "heroic",
  "level": 1,
  "canonReviewStatus": "verified",
  "source": {
    "document": "heroes-v1.01-04-censor",
    "version": "1.01",
    "pdfPage": 6,
    "printedPage": 83,
    "checkedAt": "2026-07-30"
  }
}
```

**繁中內容**

```json
{
  "id": "ability.censor.arrest",
  "nameZhHant": "當場拘捕",
  "aliasesZhHant": [],
  "flavor": "終於被我逮到了，你這混帳。",
  "powerRoll": {
    "tiers": [
      {
        "threshold": "≤11",
        "text": "6 + `力量`神聖傷害；擒制"
      },
      {
        "threshold": "12-16",
        "text": "9 + `力量`神聖傷害；擒制"
      },
      {
        "threshold": "17+",
        "text": "13 + `力量`神聖傷害；擒制"
      }
    ]
  },
  "effect": [
    "若被此招式擒制的目標對 1 個生物發動打擊，你可以花費 3 點怒火對他造成等於你`氣場`的神聖傷害，並將該次打擊的目標改為打擊射程內的另 1 個目標。"
  ],
  "meta": {
    "status": "reviewed",
    "nameApproval": "既有名稱；2026-07-30 擁有者核准（M0 驗收清單第二輪）。",
    "translationSource": "舊 Notion 招式列表 · 當場拘捕",
    "commonProcessing": [
      "2026-07-30 擁有者裁決：撤銷 docs/proposal-arrest-data-model.md 的 conditionalEffects 結構，改回單一 effect 段落——原版規則書本就把這句寫在 Effect: 之下，不是獨立的方框內容。舊裁決 ARREST-CONDITIONAL-EFFECT 已由本次裁決取代，紀錄保留於 docs/proposal-arrest-data-model.md 與 data/translation-issues.json TI-28。",
      "tiers[].text 依全域裁決（TI-29）改用「；」分隔同一階層內的多個子句，不再用「，」。",
      "受控欄位與效力標記不重複存入中文層。"
    ],
    "decisions": [
      "TI-28",
      "TI-29"
    ],
    "conventions": "全域通則見 docs/translation-guide.md。",
    "reviewedBy": "owner",
    "reviewedAt": "2026-07-30"
  },
  "canonRef": {
    "id": "ability.censor.arrest",
    "document": "heroes-v1.01-04-censor",
    "printedPage": 83
  }
}
```

**結構與翻譯注意事項**

- 2026-07-30 擁有者裁決：撤銷 docs/proposal-arrest-data-model.md 的 conditionalEffects 結構，改回單一 effect 段落——原版規則書本就把這句寫在 Effect: 之下，不是獨立的方框內容。舊裁決 ARREST-CONDITIONAL-EFFECT 已由本次裁決取代，紀錄保留於 docs/proposal-arrest-data-model.md 與 data/translation-issues.json TI-28。
- tiers[].text 依全域裁決（TI-29）改用「；」分隔同一階層內的多個子句，不再用「，」。
- 受控欄位與效力標記不重複存入中文層。

**擁有者裁決**

- [ ] 核准，內容與結構皆可進入正式 M0
- [ ] 需要修改

擁有者備註：

> 

---
### 4. 瀆神者退散！ · Back Blasphemer!

- ID：`ability.censor.back-blasphemer`
- 來源：Heroes v1.01，印刷頁 82（PDF 頁 5）
- Canon 狀態：`verified`；繁中狀態：`reviewed`
- TI／裁決：TI-25、TI-29

**英文正典**

```json
{
  "id": "ability.censor.back-blasphemer",
  "type": "ability",
  "name": "Back Blasphemer!",
  "aliasesEn": [],
  "flavor": "You channel power through your weapon to repel foes.",
  "keywords": [
    "area",
    "magic",
    "melee",
    "weapon"
  ],
  "actionType": "main",
  "cost": null,
  "distance": {
    "kind": "area",
    "area": {
      "shape": "cube",
      "size": 2,
      "within": 1
    },
    "raw": "2 cube within 1"
  },
  "target": "Each enemy in the area",
  "powerRoll": {
    "characteristic": "presence",
    "tiers": [
      {
        "threshold": "≤11",
        "text": "2 holy damage; push 1"
      },
      {
        "threshold": "12-16",
        "text": "4 holy damage; push 2"
      },
      {
        "threshold": "17+",
        "text": "6 holy damage; push 3"
      }
    ]
  },
  "origin": {
    "kind": "class",
    "id": "class.censor"
  },
  "abilityCategory": "signature",
  "level": 1,
  "canonReviewStatus": "verified",
  "source": {
    "document": "heroes-v1.01-04-censor",
    "version": "1.01",
    "pdfPage": 5,
    "printedPage": 82,
    "checkedAt": "2026-07-28"
  }
}
```

**繁中內容**

```json
{
  "id": "ability.censor.back-blasphemer",
  "nameZhHant": "瀆神者退散！",
  "aliasesZhHant": [],
  "flavor": "你使用武器引導神聖力量來擊退敵人。",
  "powerRoll": {
    "tiers": [
      {
        "threshold": "≤11",
        "text": "2 神聖傷害；推動 1"
      },
      {
        "threshold": "12-16",
        "text": "4 神聖傷害；推動 2"
      },
      {
        "threshold": "17+",
        "text": "6 神聖傷害；推動 3"
      }
    ]
  },
  "meta": {
    "status": "reviewed",
    "nameApproval": "逐欄對齊報告見 docs/alignment/zh-batch2-alignment.md（本條零待裁項）；flavor 的「神聖」補字已於 2026-07-28 裁決維持舊譯，正式紀錄為 TI-25。",
    "translationSource": "舊 Notion 招式列表 · 瀆神者退散！",
    "commonProcessing": [
      "N-2（2026-07-30 修訂為 TI-29）：舊譯的階層表格分成「傷害／推動」兩欄，正典是單一字串（2 holy damage; push 1），本層合併為一個 text；分隔符原採全形逗號「，」，2026-07-30 擁有者改裁為分號「；」以貼近原文標點（指南 §6 已同步修訂）",
      "target「區域內每個敵人」可由 §4.4 的組合規則產生，不存於本層",
      "distance「1 格內 2 立方」為受控欄位，由 vocabulary 解析，不存於本層（cube＝立方，2026-07-30 補上 renderer 遺漏的形狀翻譯）",
      "階層改用官方門檻徽章 ≤11／12-16／17+（指南 §5，排版級自動歸一）"
    ],
    "decisions": [
      "TI-25",
      "TI-29"
    ],
    "conventions": "全域通則見 docs/translation-guide.md §6（排版）與 §7（規則文本一律第二人稱）。",
    "reviewedBy": "owner",
    "reviewedAt": "2026-07-30"
  },
  "canonRef": {
    "id": "ability.censor.back-blasphemer",
    "document": "heroes-v1.01-04-censor",
    "printedPage": 82
  }
}
```

**結構與翻譯注意事項**

- N-2（2026-07-30 修訂為 TI-29）：舊譯的階層表格分成「傷害／推動」兩欄，正典是單一字串（2 holy damage; push 1），本層合併為一個 text；分隔符原採全形逗號「，」，2026-07-30 擁有者改裁為分號「；」以貼近原文標點（指南 §6 已同步修訂）
- target「區域內每個敵人」可由 §4.4 的組合規則產生，不存於本層
- distance「1 格內 2 立方」為受控欄位，由 vocabulary 解析，不存於本層（cube＝立方，2026-07-30 補上 renderer 遺漏的形狀翻譯）
- 階層改用官方門檻徽章 ≤11／12-16／17+（指南 §5，排版級自動歸一）

**擁有者裁決**

- [ ] 核准，內容與結構皆可進入正式 M0
- [ ] 需要修改

擁有者備註：

> 

---
### 5. 聖盾在此！ · Behold a Shield of Faith!

- ID：`ability.censor.behold-a-shield-of-faith`
- 來源：Heroes v1.01，印刷頁 82（PDF 頁 5）
- Canon 狀態：`verified`；繁中狀態：`reviewed`
- TI／裁決：無個別 TI；套用全域指南

**英文正典**

```json
{
  "id": "ability.censor.behold-a-shield-of-faith",
  "type": "ability",
  "name": "Behold a Shield of Faith!",
  "aliasesEn": [],
  "flavor": "A mighty blow turns your foe’s vitality into a holy light that envelops you and an ally, discouraging enemies who might attack you.",
  "keywords": [
    "melee",
    "strike",
    "weapon"
  ],
  "actionType": "main",
  "cost": {
    "resource": "wrath",
    "value": 3
  },
  "distance": {
    "kind": "melee",
    "value": 1,
    "raw": "Melee 1"
  },
  "target": "One creature or object",
  "powerRoll": {
    "characteristic": "might",
    "tiers": [
      {
        "threshold": "≤11",
        "text": "3 + M holy damage"
      },
      {
        "threshold": "12-16",
        "text": "6 + M holy damage"
      },
      {
        "threshold": "17+",
        "text": "9 + M holy damage"
      }
    ]
  },
  "effect": [
    "Until the start of your next turn, enemies take a bane on ability rolls made against you or any ally adjacent to you."
  ],
  "extraCosts": [],
  "origin": {
    "kind": "class",
    "id": "class.censor"
  },
  "abilityCategory": "heroic",
  "level": 1,
  "canonReviewStatus": "verified",
  "source": {
    "document": "heroes-v1.01-04-censor",
    "version": "1.01",
    "pdfPage": 5,
    "printedPage": 82,
    "checkedAt": "2026-07-28"
  }
}
```

**繁中內容**

```json
{
  "id": "ability.censor.behold-a-shield-of-faith",
  "nameZhHant": "聖盾在此！",
  "aliasesZhHant": [],
  "flavor": "強力一擊將敵人的生命力轉化為神聖之光，環繞著你和盟友，使敵人不敢輕舉妄動。",
  "powerRoll": {
    "tiers": [
      {
        "threshold": "≤11",
        "text": "3 + `力量`神聖傷害"
      },
      {
        "threshold": "12-16",
        "text": "6 + `力量`神聖傷害"
      },
      {
        "threshold": "17+",
        "text": "9 + `力量`神聖傷害"
      }
    ]
  },
  "effect": [
    "若敵人針對你或任何與你相鄰的盟友進行招式檢定，他會承受 1 個劣勢，直到你下個回合開始。"
  ],
  "meta": {
    "status": "reviewed",
    "nameApproval": "逐句對齊報告見 docs/alignment/zh-batch3-alignment.md（2026-07-29 擁有者逐項裁決）。 本條零待裁項。",
    "translationSource": "舊 Notion 招式列表 · 聖盾在此！",
    "commonProcessing": [
      "target「1 個生物或物體」可由 §4.4 的組合規則產生，不存於本層",
      "distance「近戰 1」為受控欄位，由 vocabulary 解析，不存於本層",
      "階層改用官方門檻徽章 ≤11／12-16／17+（指南 §5，排版級自動歸一）",
      "effect 的時間限定「直到你下個回合開始」由句首移到句尾，語意一致（報告 ⚪ 第 6 項）"
    ],
    "decisions": [],
    "conventions": "全域通則見 docs/translation-guide.md §6（排版）與 §7（規則文本一律第二人稱）。",
    "reviewedBy": "owner",
    "reviewedAt": "2026-07-30"
  },
  "canonRef": {
    "id": "ability.censor.behold-a-shield-of-faith",
    "document": "heroes-v1.01-04-censor",
    "printedPage": 82
  }
}
```

**結構與翻譯注意事項**

- target「1 個生物或物體」可由 §4.4 的組合規則產生，不存於本層
- distance「近戰 1」為受控欄位，由 vocabulary 解析，不存於本層
- 階層改用官方門檻徽章 ≤11／12-16／17+（指南 §5，排版級自動歸一）
- effect 的時間限定「直到你下個回合開始」由句首移到句尾，語意一致（報告 ⚪ 第 6 項）

**擁有者裁決**

- [ ] 核准，內容與結構皆可進入正式 M0
- [ ] 需要修改

擁有者備註：

> 

---
### 6. 直視正義威儀！ · Behold the Face of Justice!

- ID：`ability.censor.behold-the-face-of-justice`
- 來源：Heroes v1.01，印刷頁 83（PDF 頁 6）
- Canon 狀態：`verified`；繁中狀態：`reviewed`
- TI／裁決：TI-27

**英文正典**

```json
{
  "id": "ability.censor.behold-the-face-of-justice",
  "type": "ability",
  "name": "Behold the Face of Justice!",
  "aliasesEn": [],
  "flavor": "You attack a foe and your enemies behold a vision of the true nature of your resolve.",
  "keywords": [
    "magic",
    "melee",
    "ranged",
    "strike",
    "weapon"
  ],
  "actionType": "main",
  "cost": {
    "resource": "wrath",
    "value": 5
  },
  "distance": {
    "kind": "choice",
    "options": [
      {
        "kind": "melee",
        "value": 1,
        "raw": "Melee 1"
      },
      {
        "kind": "ranged",
        "value": 5,
        "raw": "Ranged 5"
      }
    ],
    "raw": "Melee 1 or ranged 5"
  },
  "target": "One creature",
  "powerRoll": {
    "characteristic": "might",
    "tiers": [
      {
        "threshold": "≤11",
        "text": "3 + M holy damage",
        "potency": {
          "characteristic": "presence",
          "level": "weak",
          "effect": "Each enemy within 2 squares of the target is frightened of you (save ends)."
        },
        "raw": "3 + M holy damage; if the target has P<WEAK, each enemy within 2 squares of them is frightened of you (save ends)"
      },
      {
        "threshold": "12-16",
        "text": "5 + M holy damage",
        "potency": {
          "characteristic": "presence",
          "level": "average",
          "effect": "Each enemy within 2 squares of the target is frightened of you (save ends)."
        },
        "raw": "5 + M holy damage; if the target has P<AVERAGE, each enemy within 2 squares of them is frightened of you (save ends)"
      },
      {
        "threshold": "17+",
        "text": "8 + M holy damage",
        "potency": {
          "characteristic": "presence",
          "level": "strong",
          "effect": "Each enemy within 2 squares of the target is frightened of you (save ends)."
        },
        "raw": "8 + M holy damage; if the target has P<STRONG, each enemy within 2 squares of them is frightened of you (save ends)"
      }
    ]
  },
  "effect": [
    "Each enemy frightened this way is pushed up to 2 squares away from the target and takes psychic damage equal to your Presence score."
  ],
  "extraCosts": [],
  "origin": {
    "kind": "class",
    "id": "class.censor"
  },
  "abilityCategory": "heroic",
  "level": 1,
  "canonReviewStatus": "verified",
  "source": {
    "document": "heroes-v1.01-04-censor",
    "version": "1.01",
    "pdfPage": 6,
    "printedPage": 83,
    "checkedAt": "2026-07-29"
  }
}
```

**繁中內容**

```json
{
  "id": "ability.censor.behold-the-face-of-justice",
  "nameZhHant": "直視正義威儀！",
  "aliasesZhHant": [],
  "flavor": "你攻擊一名敵人，讓他看清楚你堅定的決心。",
  "powerRoll": {
    "tiers": [
      {
        "threshold": "≤11",
        "text": "3 + `力量`神聖傷害",
        "potencyEffect": "目標 2 格內的每個敵人都會對你陷入畏縮（豁免解除）"
      },
      {
        "threshold": "12-16",
        "text": "5 + `力量`神聖傷害",
        "potencyEffect": "目標 2 格內的每個敵人都會對你陷入畏縮（豁免解除）"
      },
      {
        "threshold": "17+",
        "text": "8 + `力量`神聖傷害",
        "potencyEffect": "目標 2 格內的每個敵人都會對你陷入畏縮（豁免解除）"
      }
    ]
  },
  "effect": [
    "因此招式陷入畏縮的每個敵人都會朝遠離目標的方向推動最多 2 格，並受到等於你`氣場`的心靈傷害。"
  ],
  "meta": {
    "status": "reviewed",
    "nameApproval": "逐句對齊報告見 docs/alignment/zh-batch3-alignment.md（2026-07-29 擁有者逐項裁決）。",
    "translationSource": "舊 Notion 招式列表 · 直視正義威儀！",
    "commonProcessing": [
      "TI-27：正典 tiers[].text 含條件從句 “if the target has this potency,”，中文**刻意不譯**——效力記號本身即表示「若目標未通過該效力」，屬擁有者批准的結構化省略",
      "⚠️ TI-27 的前提是 renderer **必須**把結構化的 potency 與該階層後續效果一起呈現；做不到就要回頭重議",
      "N-1：效力記號「`氣場 < 弱`」已剝除，效力存於正典 tiers[].potency",
      "N-2：舊譯的階層表格分成「傷害／效力」兩欄，本層合併為一個 text，欄內以全形逗號「，」分隔（指南 §6）",
      "target「1 個生物」可由 §4.4 的組合規則產生，不存於本層",
      "distance「近戰 1 或遠程 5（二選一）」為受控欄位，由 vocabulary 解析，不存於本層",
      "階層改用官方門檻徽章 ≤11／12-16／17+（指南 §5，排版級自動歸一）"
    ],
    "decisions": [
      "TI-27"
    ],
    "conventions": "全域通則見 docs/translation-guide.md §6（排版）與 §7（規則文本一律第二人稱）。",
    "reviewedBy": "owner",
    "reviewedAt": "2026-07-30"
  },
  "canonRef": {
    "id": "ability.censor.behold-the-face-of-justice",
    "document": "heroes-v1.01-04-censor",
    "printedPage": 83
  }
}
```

**結構與翻譯注意事項**

- TI-27：正典 tiers[].text 含條件從句 “if the target has this potency,”，中文**刻意不譯**——效力記號本身即表示「若目標未通過該效力」，屬擁有者批准的結構化省略
- ⚠️ TI-27 的前提是 renderer **必須**把結構化的 potency 與該階層後續效果一起呈現；做不到就要回頭重議
- N-1：效力記號「`氣場 < 弱`」已剝除，效力存於正典 tiers[].potency
- N-2：舊譯的階層表格分成「傷害／效力」兩欄，本層合併為一個 text，欄內以全形逗號「，」分隔（指南 §6）
- target「1 個生物」可由 §4.4 的組合規則產生，不存於本層
- distance「近戰 1 或遠程 5（二選一）」為受控欄位，由 vocabulary 解析，不存於本層
- 階層改用官方門檻徽章 ≤11／12-16／17+（指南 §5，排版級自動歸一）

**擁有者裁決**

- [ ] 核准，內容與結構皆可進入正式 M0
- [ ] 需要修改

擁有者備註：

> 

---
### 7. 斷罪 · Censored

- ID：`ability.censor.censored`
- 來源：Heroes v1.01，印刷頁 83（PDF 頁 6）
- Canon 狀態：`verified`；繁中狀態：`reviewed`
- TI／裁決：無個別 TI；套用全域指南

**英文正典**

```json
{
  "id": "ability.censor.censored",
  "type": "ability",
  "name": "Censored",
  "aliasesEn": [],
  "flavor": "Judged and sentenced.",
  "keywords": [
    "melee",
    "strike",
    "weapon"
  ],
  "actionType": "main",
  "cost": {
    "resource": "wrath",
    "value": 5
  },
  "distance": {
    "kind": "melee",
    "value": 1,
    "raw": "Melee 1"
  },
  "target": "One creature",
  "powerRoll": {
    "characteristic": "might",
    "tiers": [
      {
        "threshold": "≤11",
        "text": "2 + M holy damage"
      },
      {
        "threshold": "12-16",
        "text": "3 + M holy damage"
      },
      {
        "threshold": "17+",
        "text": "5 + M holy damage"
      }
    ]
  },
  "effect": [
    "When a target who is not a leader or solo creature is made winded by this ability, they are reduced to 0 Stamina."
  ],
  "extraCosts": [],
  "origin": {
    "kind": "class",
    "id": "class.censor"
  },
  "abilityCategory": "heroic",
  "level": 1,
  "canonReviewStatus": "verified",
  "source": {
    "document": "heroes-v1.01-04-censor",
    "version": "1.01",
    "pdfPage": 6,
    "printedPage": 83,
    "checkedAt": "2026-07-28"
  }
}
```

**繁中內容**

```json
{
  "id": "ability.censor.censored",
  "nameZhHant": "斷罪",
  "aliasesZhHant": [],
  "flavor": "審判、定罪。",
  "powerRoll": {
    "tiers": [
      {
        "threshold": "≤11",
        "text": "2 + `力量`神聖傷害"
      },
      {
        "threshold": "12-16",
        "text": "3 + `力量`神聖傷害"
      },
      {
        "threshold": "17+",
        "text": "5 + `力量`神聖傷害"
      }
    ]
  },
  "effect": [
    "若目標因此招式而陷入`疲態`，只要他不是首領或獨霸生物，他的`體力`會直接歸 0。"
  ],
  "meta": {
    "status": "reviewed",
    "nameApproval": "逐句對齊報告見 docs/alignment/zh-batch3-alignment.md（2026-07-29 擁有者逐項裁決）。 本條零待裁項。",
    "translationSource": "舊 Notion 招式列表 · 斷罪",
    "commonProcessing": [
      "target「1 個生物」可由 §4.4 的組合規則產生，不存於本層",
      "distance「近戰 1」為受控欄位，由 vocabulary 解析，不存於本層",
      "階層改用官方門檻徽章 ≤11／12-16／17+（指南 §5，排版級自動歸一）",
      "effect 的關係子句「who is not a leader or solo creature」由主語內移到後半句，限定條件完整保留（報告 ⚪ 第 7 項）",
      "flavor「審判、定罪」與招式【審判】同字，但 flavor 不加【】標記（指南 §6）"
    ],
    "decisions": [],
    "conventions": "全域通則見 docs/translation-guide.md §6（排版）與 §7（規則文本一律第二人稱）。",
    "reviewedBy": "owner",
    "reviewedAt": "2026-07-30"
  },
  "canonRef": {
    "id": "ability.censor.censored",
    "document": "heroes-v1.01-04-censor",
    "printedPage": 83
  }
}
```

**結構與翻譯注意事項**

- target「1 個生物」可由 §4.4 的組合規則產生，不存於本層
- distance「近戰 1」為受控欄位，由 vocabulary 解析，不存於本層
- 階層改用官方門檻徽章 ≤11／12-16／17+（指南 §5，排版級自動歸一）
- effect 的關係子句「who is not a leader or solo creature」由主語內移到後半句，限定條件完整保留（報告 ⚪ 第 7 項）
- flavor「審判、定罪」與招式【審判】同字，但 flavor 不加【】標記（指南 §6）

**擁有者裁決**

- [ ] 核准，內容與結構皆可進入正式 M0
- [ ] 需要修改

擁有者備註：

> 

---
### 8. 衝刺追擊 · Driving Assault

- ID：`ability.censor.driving-assault`
- 來源：Heroes v1.01，印刷頁 82（PDF 頁 5）
- Canon 狀態：`verified`；繁中狀態：`reviewed`
- TI／裁決：TI-29

**英文正典**

```json
{
  "id": "ability.censor.driving-assault",
  "type": "ability",
  "name": "Driving Assault",
  "aliasesEn": [],
  "flavor": "As you force your enemy back with your weapon, you use your faith to stay close.",
  "keywords": [
    "melee",
    "strike",
    "weapon"
  ],
  "actionType": "main",
  "cost": {
    "resource": "wrath",
    "value": 3
  },
  "distance": {
    "kind": "melee",
    "value": 1,
    "raw": "Melee 1"
  },
  "target": "One creature or object",
  "powerRoll": {
    "characteristic": "might",
    "tiers": [
      {
        "threshold": "≤11",
        "text": "3 + M damage; push 1"
      },
      {
        "threshold": "12-16",
        "text": "6 + M damage; push 3"
      },
      {
        "threshold": "17+",
        "text": "9 + M damage; push 5"
      }
    ]
  },
  "effect": [
    "You can shift up to your speed in a straight line toward the target after pushing them."
  ],
  "extraCosts": [],
  "origin": {
    "kind": "class",
    "id": "class.censor"
  },
  "abilityCategory": "heroic",
  "level": 1,
  "canonReviewStatus": "verified",
  "source": {
    "document": "heroes-v1.01-04-censor",
    "version": "1.01",
    "pdfPage": 5,
    "printedPage": 82,
    "checkedAt": "2026-07-28"
  }
}
```

**繁中內容**

```json
{
  "id": "ability.censor.driving-assault",
  "nameZhHant": "衝刺追擊",
  "aliasesZhHant": [],
  "flavor": "你逼退敵人，並運用信仰的力量緊隨其後。",
  "powerRoll": {
    "tiers": [
      {
        "threshold": "≤11",
        "text": "3 + `力量`傷害；推動 1"
      },
      {
        "threshold": "12-16",
        "text": "6 + `力量`傷害；推動 3"
      },
      {
        "threshold": "17+",
        "text": "9 + `力量`傷害；推動 5"
      }
    ]
  },
  "effect": [
    "在推動目標後，你可以朝目標直線遁移最多等於你`速度`的距離。"
  ],
  "meta": {
    "status": "reviewed",
    "nameApproval": "逐句對齊報告見 docs/alignment/zh-batch3-alignment.md（2026-07-29 擁有者逐項裁決）。 本條零待裁項。",
    "translationSource": "舊 Notion 招式列表 · 衝刺追擊",
    "commonProcessing": [
      "**本條沒有神聖傷害**——正典是 `3 + M damage`，非 holy。本批唯一如此的招式，已特別核對",
      "N-2（2026-07-30 修訂為 TI-29）：舊譯的階層表格分成「傷害／推動」兩欄，本層合併；分隔符原採全形逗號「，」，2026-07-30 擁有者改裁為分號「；」以貼近原文標點（指南 §6 已同步修訂）",
      "target「1 個生物或物體」可由 §4.4 的組合規則產生，不存於本層",
      "distance「近戰 1」為受控欄位，由 vocabulary 解析，不存於本層",
      "階層改用官方門檻徽章 ≤11／12-16／17+（指南 §5，排版級自動歸一）"
    ],
    "decisions": [
      "TI-29"
    ],
    "conventions": "全域通則見 docs/translation-guide.md §6（排版）與 §7（規則文本一律第二人稱）。",
    "reviewedBy": "owner",
    "reviewedAt": "2026-07-30"
  },
  "canonRef": {
    "id": "ability.censor.driving-assault",
    "document": "heroes-v1.01-04-censor",
    "printedPage": 82
  }
}
```

**結構與翻譯注意事項**

- **本條沒有神聖傷害**——正典是 `3 + M damage`，非 holy。本批唯一如此的招式，已特別核對
- N-2（2026-07-30 修訂為 TI-29）：舊譯的階層表格分成「傷害／推動」兩欄，本層合併；分隔符原採全形逗號「，」，2026-07-30 擁有者改裁為分號「；」以貼近原文標點（指南 §6 已同步修訂）
- target「1 個生物或物體」可由 §4.4 的組合規則產生，不存於本層
- distance「近戰 1」為受控欄位，由 vocabulary 解析，不存於本層
- 階層改用官方門檻徽章 ≤11／12-16／17+（指南 §5，排版級自動歸一）

**擁有者裁決**

- [ ] 核准，內容與結構皆可進入正式 M0
- [ ] 需要修改

擁有者備註：

> 

---
### 9. 踏向死亡！ · Every Step … Death!

- ID：`ability.censor.every-step-death`
- 來源：Heroes v1.01，印刷頁 82（PDF 頁 5）
- Canon 狀態：`verified`；繁中狀態：`reviewed`
- TI／裁決：TI-20

**英文正典**

```json
{
  "id": "ability.censor.every-step-death",
  "type": "ability",
  "name": "Every Step … Death!",
  "aliasesEn": [],
  "flavor": "You show your foe a glimpse of their fate after death.",
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
    "characteristic": "presence",
    "tiers": [
      {
        "threshold": "≤11",
        "text": "5 + P psychic damage"
      },
      {
        "threshold": "12-16",
        "text": "7 + P psychic damage"
      },
      {
        "threshold": "17+",
        "text": "10 + P psychic damage"
      }
    ]
  },
  "effect": [
    "Each time the target willingly moves before the end of your next turn, they take 1 psychic damage for each square they move."
  ],
  "extraCosts": [],
  "origin": {
    "kind": "class",
    "id": "class.censor"
  },
  "abilityCategory": "signature",
  "level": 1,
  "canonReviewStatus": "verified",
  "source": {
    "document": "heroes-v1.01-04-censor",
    "version": "1.01",
    "pdfPage": 5,
    "printedPage": 82,
    "checkedAt": "2026-07-28"
  }
}
```

**繁中內容**

```json
{
  "id": "ability.censor.every-step-death",
  "nameZhHant": "踏向死亡！",
  "aliasesZhHant": [],
  "flavor": "你讓敵人窺見他們死後的命運。",
  "powerRoll": {
    "tiers": [
      {
        "threshold": "≤11",
        "text": "5 + `氣場`心靈傷害"
      },
      {
        "threshold": "12-16",
        "text": "7 + `氣場`心靈傷害"
      },
      {
        "threshold": "17+",
        "text": "10 + `氣場`心靈傷害"
      }
    ]
  },
  "effect": [
    "在你下個回合結束前，目標每主動移動 1 格都會受到 1 點心靈傷害。"
  ],
  "meta": {
    "status": "reviewed",
    "nameApproval": "逐欄對齊報告見 docs/alignment/zh-batch2-alignment.md；唯一待裁項（willingly 譯名）已裁為 TI-20。",
    "translationSource": "舊 Notion 招式列表 · 踏向死亡！",
    "commonProcessing": [
      "target「1 個生物」可由 §4.4 的組合規則產生，不存於本層",
      "distance「遠程 10」為受控欄位，由 vocabulary 解析，不存於本層",
      "階層改用官方門檻徽章 ≤11／12-16／17+（指南 §5，排版級自動歸一）"
    ],
    "decisions": [
      "TI-20"
    ],
    "conventions": "全域通則見 docs/translation-guide.md §6（排版）與 §7（規則文本一律第二人稱）。",
    "reviewedBy": "owner",
    "reviewedAt": "2026-07-30"
  },
  "canonRef": {
    "id": "ability.censor.every-step-death",
    "document": "heroes-v1.01-04-censor",
    "printedPage": 82
  }
}
```

**結構與翻譯注意事項**

- target「1 個生物」可由 §4.4 的組合規則產生，不存於本層
- distance「遠程 10」為受控欄位，由 vocabulary 解析，不存於本層
- 階層改用官方門檻徽章 ≤11／12-16／17+（指南 §5，排版級自動歸一）

**擁有者裁決**

- [ ] 核准，內容與結構皆可進入正式 M0
- [ ] 需要修改

擁有者備註：

> 

---
### 10. 惡徒止步！ · Halt Miscreant!

- ID：`ability.censor.halt-miscreant`
- 來源：Heroes v1.01，印刷頁 82（PDF 頁 5）
- Canon 狀態：`verified`；繁中狀態：`reviewed`
- TI／裁決：無個別 TI；套用全域指南

**英文正典**

```json
{
  "id": "ability.censor.halt-miscreant",
  "type": "ability",
  "name": "Halt Miscreant!",
  "aliasesEn": [],
  "flavor": "You infuse your weapon with holy magic that makes it difficult for your foe to get away.",
  "keywords": [
    "melee",
    "strike",
    "weapon"
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
    "characteristic": "might",
    "tiers": [
      {
        "threshold": "≤11",
        "text": "2 + M holy damage",
        "potency": {
          "characteristic": "presence",
          "level": "weak",
          "effect": "slowed (save ends)"
        },
        "raw": "2 + M holy damage; P<WEAK, slowed (save ends)"
      },
      {
        "threshold": "12-16",
        "text": "5 + M holy damage",
        "potency": {
          "characteristic": "presence",
          "level": "average",
          "effect": "slowed (save ends)"
        },
        "raw": "5 + M holy damage; P<AVERAGE, slowed (save ends)"
      },
      {
        "threshold": "17+",
        "text": "7 + M holy damage",
        "potency": {
          "characteristic": "presence",
          "level": "strong",
          "effect": "slowed (save ends)"
        },
        "raw": "7 + M holy damage; P<STRONG, slowed (save ends)"
      }
    ]
  },
  "extraCosts": [],
  "origin": {
    "kind": "class",
    "id": "class.censor"
  },
  "abilityCategory": "signature",
  "level": 1,
  "canonReviewStatus": "verified",
  "source": {
    "document": "heroes-v1.01-04-censor",
    "version": "1.01",
    "pdfPage": 5,
    "printedPage": 82,
    "checkedAt": "2026-07-29"
  }
}
```

**繁中內容**

```json
{
  "id": "ability.censor.halt-miscreant",
  "nameZhHant": "惡徒止步！",
  "aliasesZhHant": [],
  "flavor": "你為武器注入神聖魔法，使敵人難以逃離。",
  "powerRoll": {
    "tiers": [
      {
        "threshold": "≤11",
        "text": "2 + `力量`神聖傷害",
        "potencyEffect": "緩速（豁免解除）"
      },
      {
        "threshold": "12-16",
        "text": "5 + `力量`神聖傷害",
        "potencyEffect": "緩速（豁免解除）"
      },
      {
        "threshold": "17+",
        "text": "7 + `力量`神聖傷害",
        "potencyEffect": "緩速（豁免解除）"
      }
    ]
  },
  "meta": {
    "status": "reviewed",
    "nameApproval": "逐欄對齊報告見 docs/alignment/zh-batch2-alignment.md（本條逐欄全部 exact，零待裁項）。",
    "translationSource": "舊 Notion 招式列表 · 惡徒止步！",
    "commonProcessing": [
      "N-1：舊譯的階層儲存格含效力記號「`氣場 < 弱`」，本層一律剝除——效力已在正典結構化為 tiers[].potency，由 renderer 從 potency ＋ 詞彙表組出，不得在此存第二份",
      "N-2：舊譯的階層表格分成「傷害／效力」兩欄，正典是單一字串，本層合併為一個 text，欄內以全形逗號「，」分隔（指南 §6）",
      "target「1 個生物或物體」可由 §4.4 的組合規則產生，不存於本層",
      "distance「近戰 1」為受控欄位，由 vocabulary 解析，不存於本層",
      "階層改用官方門檻徽章 ≤11／12-16／17+（指南 §5，排版級自動歸一）",
      "「緩速」存為純文字。TI-16 處理的是原文明確要求參照【審判】的情形，與舊 Notion 替狀態文字加連結不是同一件事；狀態的實體引用日後由統一的 renderer 機制處理（2026-07-29 擁有者裁定）",
      "2026-07-31 擁有者裁決：效力效果照原版規則書逐字呈現。書上此招寫的是「；P<LEVEL, <效果>」的簡寫形式，本身即含「若效力通過則目標受此效果」之意，不補「目標陷入…」。"
    ],
    "decisions": [],
    "conventions": "全域通則見 docs/translation-guide.md §6（排版）與 §7（規則文本一律第二人稱）。",
    "reviewedBy": "owner",
    "reviewedAt": "2026-07-31"
  },
  "canonRef": {
    "id": "ability.censor.halt-miscreant",
    "document": "heroes-v1.01-04-censor",
    "printedPage": 82
  }
}
```

**結構與翻譯注意事項**

- N-1：舊譯的階層儲存格含效力記號「`氣場 < 弱`」，本層一律剝除——效力已在正典結構化為 tiers[].potency，由 renderer 從 potency ＋ 詞彙表組出，不得在此存第二份
- N-2：舊譯的階層表格分成「傷害／效力」兩欄，正典是單一字串，本層合併為一個 text，欄內以全形逗號「，」分隔（指南 §6）
- target「1 個生物或物體」可由 §4.4 的組合規則產生，不存於本層
- distance「近戰 1」為受控欄位，由 vocabulary 解析，不存於本層
- 階層改用官方門檻徽章 ≤11／12-16／17+（指南 §5，排版級自動歸一）
- 「緩速」存為純文字。TI-16 處理的是原文明確要求參照【審判】的情形，與舊 Notion 替狀態文字加連結不是同一件事；狀態的實體引用日後由統一的 renderer 機制處理（2026-07-29 擁有者裁定）
- 2026-07-31 擁有者裁決：效力效果照原版規則書逐字呈現。書上此招寫的是「；P<LEVEL, <效果>」的簡寫形式，本身即含「若效力通過則目標受此效果」之意，不補「目標陷入…」。

**擁有者裁決**

- [ ] 核准，內容與結構皆可進入正式 M0
- [ ] 需要修改

擁有者備註：

> 

---
### 11. 審判 · Judgment

- ID：`ability.censor.judgment`
- 來源：Heroes v1.01，印刷頁 80（PDF 頁 3）
- Canon 狀態：`verified`；繁中狀態：`reviewed`
- TI／裁決：TI-26

**英文正典**

```json
{
  "id": "ability.censor.judgment",
  "type": "ability",
  "name": "Judgment",
  "aliasesEn": [],
  "flavor": "You utter a prayer that outlines your foe in holy energy.",
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
  "target": "One enemy",
  "effect": [
    "The target is judged by you until the end of the encounter, you use this ability again, you willingly end this effect (no action required), or another censor judges the target.",
    "Whenever a creature judged by you uses a main action and is within your line of effect, you can use a free triggered action to deal holy damage equal to twice your Presence score to them.",
    "When a creature judged by you is reduced to 0 Stamina, you can use a free triggered action to use this ability against a new target."
  ],
  "extraCosts": [],
  "followUpActions": [
    {
      "availability": "while-effect-active",
      "actionType": "free-triggered",
      "cost": {
        "resource": "wrath",
        "value": 1
      },
      "choose": "one",
      "lead": "Additionally, you can spend 1 wrath to take one of the following free triggered actions:",
      "options": [
        "When an adjacent creature judged by you starts to shift, you make a melee free strike against them and their speed becomes 0 until the end of the current turn, preventing them from shifting.",
        "When a creature judged by you within 10 squares makes a power roll, you cause them to take a bane on the roll.",
        "When a creature judged by you within 10 squares uses an ability with a potency that targets only one creature, the potency is reduced by 1 for that creature.",
        "If you damage a creature judged by you with a melee ability, the creature is taunted by you until the end of their next turn."
      ],
      "constraint": "You can choose only one free triggered action option at a time, even if multiple options are triggered by the same effect."
    }
  ],
  "origin": {
    "kind": "class",
    "id": "class.censor"
  },
  "abilityCategory": "inherent",
  "level": 1,
  "canonReviewStatus": "verified",
  "source": {
    "document": "heroes-v1.01-04-censor",
    "version": "1.01",
    "pdfPage": 3,
    "printedPage": 80,
    "checkedAt": "2026-07-28"
  }
}
```

**繁中內容**

```json
{
  "id": "ability.censor.judgment",
  "nameZhHant": "審判",
  "aliasesZhHant": [],
  "flavor": "你吟誦禱文，用神聖能量籠罩你的敵人。",
  "effect": [
    "目標被你審判，持續到`遭遇`結束、你再次發動此招式、你主動解除此效果（無需動作），或其他懲戒者審判相同的目標。",
    "每當 1 個被你審判的生物使用主要動作時，只要他在你的效果線內，你可以使用免費反應動作對他造成等於你`氣場` ×2 的神聖傷害。",
    "當 1 個被你審判的生物`體力`歸 0 時，你可以使用免費反應動作對 1 個新目標發動此招式。"
  ],
  "followUpActions": [
    {
      "lead": "此外，你可以花費 1 點`怒火`來執行以下 1 項免費反應動作：",
      "options": [
        "當 1 個與你相鄰且被你審判的生物開始遁移時，你對他發動 1 次近戰基礎打擊，並讓他的`速度`歸 0 而無法遁移，直到他當前回合結束。",
        "當 1 個被你審判且位於你 10 格內的生物進行檢定時，你讓他的檢定承受 1 個劣勢。",
        "當 1 個被你審判且位於你 10 格內的生物發動具有效力的招式時，若該招式只指定 1 個生物，該招式的效力對該生物減少 1 點。",
        "若你使用近戰招式對 1 個被你審判的生物造成傷害，該生物會被你嘲諷，直到他下個回合結束。"
      ],
      "constraint": "即使有多個選項由相同的效果觸發，你每次也只能選擇 1 項免費反應動作。"
    }
  ],
  "meta": {
    "status": "reviewed",
    "nameApproval": "逐句對齊報告見 docs/alignment/zh-batch3-alignment.md（2026-07-29 擁有者逐項裁決）。",
    "translationSource": "舊 Notion 招式列表 · 審判",
    "commonProcessing": [
      "TI-26：options[2] 補回限定語「對該生物」。原文 “that targets only one creature” 的修飾對象有歧義，擁有者裁定維持舊譯的讀法（修飾 ability），歧義就此定案",
      "TA-B3-1：舊譯的「免費觸發式動作」（3 處）改為已批准術語「**免費反應動作**」（action-type.free-triggered）",
      "「`氣場` × 2」依指南 §6 歸一為「`氣場` ×2」（乘號緊貼數字）",
      "effect[0] 的「相同的目標」為補字，原文 the target 已回指同一目標（報告 ⚪ 第 8 項）",
      "options[0] 的「他當前回合」較原文 the current turn 多了「他」；因觸發條件是該生物開始遁移，必為他的回合（報告 ⚪ 第 11 項）",
      "「嘲諷」存為純文字，與「緩速」同一處理（狀態的實體引用日後由統一的 renderer 機制處理）",
      "⚠️ 排版未定：`遭遇` 加了 inline code（沿用 feature.censor.wrath 的既有寫法），但「效果線」維持純文字（沿用舊譯）。兩者都不屬指南 §6 明列的「屬性／資源／遊戲數值」，慣例尚未統一",
      "target「1 個敵人」可由 §4.4 的組合規則產生，不存於本層",
      "distance「遠程 10」為受控欄位，由 vocabulary 解析，不存於本層",
      "本條無檢定，故無 powerRoll"
    ],
    "decisions": [
      "TI-26"
    ],
    "conventions": "全域通則見 docs/translation-guide.md §6（排版）與 §7（規則文本一律第二人稱）。",
    "reviewedBy": "owner",
    "reviewedAt": "2026-07-30"
  },
  "canonRef": {
    "id": "ability.censor.judgment",
    "document": "heroes-v1.01-04-censor",
    "printedPage": 80
  }
}
```

**結構與翻譯注意事項**

- TI-26：options[2] 補回限定語「對該生物」。原文 “that targets only one creature” 的修飾對象有歧義，擁有者裁定維持舊譯的讀法（修飾 ability），歧義就此定案
- TA-B3-1：舊譯的「免費觸發式動作」（3 處）改為已批准術語「**免費反應動作**」（action-type.free-triggered）
- 「`氣場` × 2」依指南 §6 歸一為「`氣場` ×2」（乘號緊貼數字）
- effect[0] 的「相同的目標」為補字，原文 the target 已回指同一目標（報告 ⚪ 第 8 項）
- options[0] 的「他當前回合」較原文 the current turn 多了「他」；因觸發條件是該生物開始遁移，必為他的回合（報告 ⚪ 第 11 項）
- 「嘲諷」存為純文字，與「緩速」同一處理（狀態的實體引用日後由統一的 renderer 機制處理）
- ⚠️ 排版未定：`遭遇` 加了 inline code（沿用 feature.censor.wrath 的既有寫法），但「效果線」維持純文字（沿用舊譯）。兩者都不屬指南 §6 明列的「屬性／資源／遊戲數值」，慣例尚未統一
- target「1 個敵人」可由 §4.4 的組合規則產生，不存於本層
- distance「遠程 10」為受控欄位，由 vocabulary 解析，不存於本層
- 本條無檢定，故無 powerRoll

**擁有者裁決**

- [ ] 核准，內容與結構皆可進入正式 M0
- [ ] 需要修改

擁有者備註：

> 

---
### 12. 捨己為人 · My Life for Yours

- ID：`ability.censor.my-life-for-yours`
- 來源：Heroes v1.01，印刷頁 80（PDF 頁 3）
- Canon 狀態：`verified`；繁中狀態：`reviewed`
- TI／裁決：TI-21、TI-22、TI-23、TI-24

**英文正典**

```json
{
  "id": "ability.censor.my-life-for-yours",
  "type": "ability",
  "name": "My Life for Yours",
  "aliasesEn": [],
  "flavor": "You channel some of your vitality into more resilience for you or an ally.",
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
  "target": "Self or one ally",
  "trigger": "The target starts their turn or takes damage.",
  "effect": [
    "You spend a Recovery and the target regains Stamina equal to your recovery value."
  ],
  "extraCosts": [
    {
      "resource": "wrath",
      "value": 1,
      "effect": "You can end one effect on the target that is ended by a saving throw or that ends at the end of their turn, or a prone target can stand up.",
      "raw": "Spend 1 Wrath: You can end one effect on the target that is ended by a saving throw or that ends at the end of their turn, or a prone target can stand up."
    }
  ],
  "origin": {
    "kind": "class",
    "id": "class.censor"
  },
  "abilityCategory": "inherent",
  "level": 1,
  "canonReviewStatus": "verified",
  "source": {
    "document": "heroes-v1.01-04-censor",
    "version": "1.01",
    "pdfPage": 3,
    "printedPage": 80,
    "checkedAt": "2026-07-28"
  }
}
```

**繁中內容**

```json
{
  "id": "ability.censor.my-life-for-yours",
  "nameZhHant": "捨己為人",
  "aliasesZhHant": [],
  "flavor": "你將生命能量注入自己或盟友體內來增強韌性。",
  "trigger": "當目標開始回合或受到傷害時。",
  "effect": [
    "你花費 1 點`復元力`，並讓目標恢復等於你`復元值`的`體力`。"
  ],
  "extraCosts": [
    {
      "effect": "你可以解除目標身上 1 個能夠透過豁免解除或 EoT 的效果，或是讓伏地的目標起身。"
    }
  ],
  "meta": {
    "status": "reviewed",
    "nameApproval": "逐句對齊樣張見 docs/samples/alignment-my-life-for-yours.md（2026-07-28 裁決），裁決紀錄已於 2026-07-29 補登為 TI-21～TI-24。",
    "translationSource": "舊 Notion 招式列表 · 捨己為人",
    "commonProcessing": [
      "TI-21：flavor 維持舊譯（“some of” 未譯出、另增「體內」）。此項確立了 flavor 允許改寫的通則，正式落點在指南 §7.2",
      "TI-22：extraCosts 補入限定語「目標身上」",
      "TI-23：extraCosts 刪除原文沒有的「狀態或」",
      "TI-24：`end of their turn` 採 EoT 縮寫（全域通則，不論原文寫全文或縮寫）",
      "trigger 的「當…時」為中文條件句的必要語法框架，非增添語意",
      "extraCosts 的費用（1 點`怒火`）是受控欄位，不存於本層；段落標記由 renderer 依 cost 產生",
      "target「自身或 1 個盟友」可由 §4.4 的組合規則產生，不存於本層",
      "distance「遠程 10」為受控欄位，由 vocabulary 解析，不存於本層",
      "本條無檢定，故無 powerRoll"
    ],
    "decisions": [
      "TI-21",
      "TI-22",
      "TI-23",
      "TI-24"
    ],
    "conventions": "全域通則見 docs/translation-guide.md §6（排版）與 §7（規則文本一律第二人稱）。",
    "reviewedBy": "owner",
    "reviewedAt": "2026-07-30"
  },
  "canonRef": {
    "id": "ability.censor.my-life-for-yours",
    "document": "heroes-v1.01-04-censor",
    "printedPage": 80
  }
}
```

**結構與翻譯注意事項**

- TI-21：flavor 維持舊譯（“some of” 未譯出、另增「體內」）。此項確立了 flavor 允許改寫的通則，正式落點在指南 §7.2
- TI-22：extraCosts 補入限定語「目標身上」
- TI-23：extraCosts 刪除原文沒有的「狀態或」
- TI-24：`end of their turn` 採 EoT 縮寫（全域通則，不論原文寫全文或縮寫）
- trigger 的「當…時」為中文條件句的必要語法框架，非增添語意
- extraCosts 的費用（1 點`怒火`）是受控欄位，不存於本層；段落標記由 renderer 依 cost 產生
- target「自身或 1 個盟友」可由 §4.4 的組合規則產生，不存於本層
- distance「遠程 10」為受控欄位，由 vocabulary 解析，不存於本層
- 本條無檢定，故無 powerRoll

**擁有者裁決**

- [ ] 核准，內容與結構皆可進入正式 M0
- [ ] 需要修改

擁有者備註：

> 

---
### 13. 淨化聖火 · Purifying Fire

- ID：`ability.censor.purifying-fire`
- 來源：Heroes v1.01，印刷頁 83（PDF 頁 6）
- Canon 狀態：`verified`；繁中狀態：`reviewed`
- TI／裁決：無個別 TI；套用全域指南

**英文正典**

```json
{
  "id": "ability.censor.purifying-fire",
  "type": "ability",
  "name": "Purifying Fire",
  "aliasesEn": [],
  "flavor": "The gods judge, fire cleanses.",
  "keywords": [
    "magic",
    "melee",
    "ranged",
    "strike",
    "weapon"
  ],
  "actionType": "main",
  "cost": {
    "resource": "wrath",
    "value": 5
  },
  "distance": {
    "kind": "choice",
    "options": [
      {
        "kind": "melee",
        "value": 1,
        "raw": "Melee 1"
      },
      {
        "kind": "ranged",
        "value": 5,
        "raw": "Ranged 5"
      }
    ],
    "raw": "Melee 1 or ranged 5"
  },
  "target": "One creature",
  "powerRoll": {
    "characteristic": "might",
    "tiers": [
      {
        "threshold": "≤11",
        "text": "5 + M holy damage",
        "potency": {
          "characteristic": "might",
          "level": "weak",
          "effect": "The target has fire weakness 3 (save ends)."
        },
        "raw": "5 + M holy damage; M<WEAK, the target has fire weakness 3 (save ends)"
      },
      {
        "threshold": "12-16",
        "text": "9 + M holy damage",
        "potency": {
          "characteristic": "might",
          "level": "average",
          "effect": "The target has fire weakness 5 (save ends)."
        },
        "raw": "9 + M holy damage; M<AVERAGE, the target has fire weakness 5 (save ends)"
      },
      {
        "threshold": "17+",
        "text": "12 + M holy damage",
        "potency": {
          "characteristic": "might",
          "level": "strong",
          "effect": "The target has fire weakness 7 (save ends)."
        },
        "raw": "12 + M holy damage; M<STRONG, the target has fire weakness 7 (save ends)"
      }
    ]
  },
  "effect": [
    "While the target has fire weakness from this ability, you can choose to have your abilities deal fire damage to the target instead of holy damage."
  ],
  "extraCosts": [],
  "origin": {
    "kind": "class",
    "id": "class.censor"
  },
  "abilityCategory": "heroic",
  "level": 1,
  "canonReviewStatus": "verified",
  "source": {
    "document": "heroes-v1.01-04-censor",
    "version": "1.01",
    "pdfPage": 6,
    "printedPage": 83,
    "checkedAt": "2026-07-29"
  }
}
```

**繁中內容**

```json
{
  "id": "ability.censor.purifying-fire",
  "nameZhHant": "淨化聖火",
  "aliasesZhHant": [],
  "flavor": "神明審判、火焰淨化。",
  "powerRoll": {
    "tiers": [
      {
        "threshold": "≤11",
        "text": "5 + `力量`神聖傷害",
        "potencyEffect": "目標獲得火焰弱點 3（豁免解除）"
      },
      {
        "threshold": "12-16",
        "text": "9 + `力量`神聖傷害",
        "potencyEffect": "目標獲得火焰弱點 5（豁免解除）"
      },
      {
        "threshold": "17+",
        "text": "12 + `力量`神聖傷害",
        "potencyEffect": "目標獲得火焰弱點 7（豁免解除）"
      }
    ]
  },
  "effect": [
    "若目標因此招式而擁有火焰弱點，你可以選擇讓你的招式對目標造成火焰傷害，而非神聖傷害。"
  ],
  "meta": {
    "status": "reviewed",
    "nameApproval": "逐句對齊報告見 docs/alignment/zh-batch3-alignment.md（2026-07-29 擁有者逐項裁決）。",
    "translationSource": "舊 Notion 招式列表 · 淨化聖火",
    "commonProcessing": [
      "「火焰弱點」依 2026-07-29 裁決的構詞規則 `<傷害類型> Weakness ＝ <傷害類型>弱點`（glossary term.fire-weakness，指南附錄 A.1）",
      "N-1：效力記號「`力量 < 弱`」已剝除；**本條的效力屬性是力量，與檢定屬性相同**",
      "N-2：多欄合併，欄內以全形逗號「，」分隔（指南 §6）",
      "tiers 省略正典的主詞「the target has」，沿用舊譯的階層儲存格慣例（報告 ⚪ 第 9 項）",
      "effect 的 While（持續期間）舊譯作「若」（條件）；因火焰弱點帶豁免解除，兩者外延相同（報告 ⚪ 第 10 項）",
      "target「1 個生物」可由 §4.4 的組合規則產生，不存於本層",
      "distance「近戰 1 或遠程 5（二選一）」為受控欄位，由 vocabulary 解析，不存於本層",
      "階層改用官方門檻徽章 ≤11／12-16／17+（指南 §5，排版級自動歸一）"
    ],
    "decisions": [],
    "conventions": "全域通則見 docs/translation-guide.md §6（排版）與 §7（規則文本一律第二人稱）。",
    "reviewedBy": "owner",
    "reviewedAt": "2026-07-30"
  },
  "canonRef": {
    "id": "ability.censor.purifying-fire",
    "document": "heroes-v1.01-04-censor",
    "printedPage": 83
  }
}
```

**結構與翻譯注意事項**

- 「火焰弱點」依 2026-07-29 裁決的構詞規則 `<傷害類型> Weakness ＝ <傷害類型>弱點`（glossary term.fire-weakness，指南附錄 A.1）
- N-1：效力記號「`力量 < 弱`」已剝除；**本條的效力屬性是力量，與檢定屬性相同**
- N-2：多欄合併，欄內以全形逗號「，」分隔（指南 §6）
- tiers 省略正典的主詞「the target has」，沿用舊譯的階層儲存格慣例（報告 ⚪ 第 9 項）
- effect 的 While（持續期間）舊譯作「若」（條件）；因火焰弱點帶豁免解除，兩者外延相同（報告 ⚪ 第 10 項）
- target「1 個生物」可由 §4.4 的組合規則產生，不存於本層
- distance「近戰 1 或遠程 5（二選一）」為受控欄位，由 vocabulary 解析，不存於本層
- 階層改用官方門檻徽章 ≤11／12-16／17+（指南 §5，排版級自動歸一）

**擁有者裁決**

- [ ] 核准，內容與結構皆可進入正式 M0
- [ ] 需要修改

擁有者備註：

> 

---
### 14. 懺悔吧！ · Repent!

- ID：`ability.censor.repent`
- 來源：Heroes v1.01，印刷頁 83（PDF 頁 6）
- Canon 狀態：`verified`；繁中狀態：`reviewed`
- TI／裁決：無個別 TI；套用全域指南

**英文正典**

```json
{
  "id": "ability.censor.repent",
  "type": "ability",
  "name": "Repent!",
  "aliasesEn": [],
  "flavor": "You conjure memories of their sins to harry your foes.",
  "keywords": [
    "magic",
    "ranged",
    "strike"
  ],
  "actionType": "main",
  "cost": {
    "resource": "wrath",
    "value": 3
  },
  "distance": {
    "kind": "ranged",
    "value": 10,
    "raw": "Ranged 10"
  },
  "target": "One creature",
  "powerRoll": {
    "characteristic": "presence",
    "tiers": [
      {
        "threshold": "≤11",
        "text": "5 + P holy damage",
        "potency": {
          "characteristic": "intuition",
          "level": "weak",
          "effect": "dazed (save ends)"
        },
        "raw": "5 + P holy damage; I<WEAK, dazed (save ends)"
      },
      {
        "threshold": "12-16",
        "text": "8 + P holy damage",
        "potency": {
          "characteristic": "intuition",
          "level": "average",
          "effect": "dazed (save ends)"
        },
        "raw": "8 + P holy damage; I<AVERAGE, dazed (save ends)"
      },
      {
        "threshold": "17+",
        "text": "11 + P holy damage",
        "potency": {
          "characteristic": "intuition",
          "level": "strong",
          "effect": "dazed (save ends)"
        },
        "raw": "11 + P holy damage; I<STRONG, dazed (save ends)"
      }
    ]
  },
  "extraCosts": [],
  "origin": {
    "kind": "class",
    "id": "class.censor"
  },
  "abilityCategory": "heroic",
  "level": 1,
  "canonReviewStatus": "verified",
  "source": {
    "document": "heroes-v1.01-04-censor",
    "version": "1.01",
    "pdfPage": 6,
    "printedPage": 83,
    "checkedAt": "2026-07-29"
  }
}
```

**繁中內容**

```json
{
  "id": "ability.censor.repent",
  "nameZhHant": "懺悔吧！",
  "aliasesZhHant": [],
  "flavor": "你喚起敵人的罪惡記憶，使他心神不寧。",
  "powerRoll": {
    "tiers": [
      {
        "threshold": "≤11",
        "text": "5 + `氣場`神聖傷害",
        "potencyEffect": "暈眩（豁免解除）"
      },
      {
        "threshold": "12-16",
        "text": "8 + `氣場`神聖傷害",
        "potencyEffect": "暈眩（豁免解除）"
      },
      {
        "threshold": "17+",
        "text": "11 + `氣場`神聖傷害",
        "potencyEffect": "暈眩（豁免解除）"
      }
    ]
  },
  "meta": {
    "status": "reviewed",
    "nameApproval": "逐句對齊報告見 docs/alignment/zh-batch3-alignment.md（2026-07-29 擁有者逐項裁決）。 本條零待裁項。",
    "translationSource": "舊 Notion 招式列表 · 懺悔吧！",
    "commonProcessing": [
      "**檢定屬性與效力屬性不同**：檢定用`氣場`、效力抵抗用`直覺`。兩者皆為受控欄位，不存於本層",
      "N-1：效力記號「`直覺 < 弱`」已剝除",
      "N-2：多欄合併，欄內以全形逗號「，」分隔（指南 §6）",
      "本條正典沒有 effect 段落",
      "target「1 個生物」可由 §4.4 的組合規則產生，不存於本層",
      "distance「遠程 10」為受控欄位，由 vocabulary 解析，不存於本層",
      "階層改用官方門檻徽章 ≤11／12-16／17+（指南 §5，排版級自動歸一）",
      "2026-07-31 擁有者裁決：效力效果照原版規則書逐字呈現。書上此招寫的是「；P<LEVEL, <效果>」的簡寫形式，本身即含「若效力通過則目標受此效果」之意，不補「目標陷入…」。"
    ],
    "decisions": [],
    "conventions": "全域通則見 docs/translation-guide.md §6（排版）與 §7（規則文本一律第二人稱）。",
    "reviewedBy": "owner",
    "reviewedAt": "2026-07-31"
  },
  "canonRef": {
    "id": "ability.censor.repent",
    "document": "heroes-v1.01-04-censor",
    "printedPage": 83
  }
}
```

**結構與翻譯注意事項**

- **檢定屬性與效力屬性不同**：檢定用`氣場`、效力抵抗用`直覺`。兩者皆為受控欄位，不存於本層
- N-1：效力記號「`直覺 < 弱`」已剝除
- N-2：多欄合併，欄內以全形逗號「，」分隔（指南 §6）
- 本條正典沒有 effect 段落
- target「1 個生物」可由 §4.4 的組合規則產生，不存於本層
- distance「遠程 10」為受控欄位，由 vocabulary 解析，不存於本層
- 階層改用官方門檻徽章 ≤11／12-16／17+（指南 §5，排版級自動歸一）
- 2026-07-31 擁有者裁決：效力效果照原版規則書逐字呈現。書上此招寫的是「；P<LEVEL, <效果>」的簡寫形式，本身即含「若效力通過則目標受此效果」之意，不補「目標陷入…」。

**擁有者裁決**

- [ ] 核准，內容與結構皆可進入正式 M0
- [ ] 需要修改

擁有者備註：

> 

---
### 15. 神之懲護 · The Gods Punish and Defend

- ID：`ability.censor.the-gods-punish-and-defend`
- 來源：Heroes v1.01，印刷頁 83（PDF 頁 6）
- Canon 狀態：`verified`；繁中狀態：`reviewed`
- TI／裁決：無個別 TI；套用全域指南

**英文正典**

```json
{
  "id": "ability.censor.the-gods-punish-and-defend",
  "type": "ability",
  "name": "The Gods Punish and Defend",
  "aliasesEn": [],
  "flavor": "You channel holy energy to smite a foe and heal an ally.",
  "keywords": [
    "magic",
    "melee",
    "strike",
    "weapon"
  ],
  "actionType": "main",
  "cost": {
    "resource": "wrath",
    "value": 3
  },
  "distance": {
    "kind": "melee",
    "value": 1,
    "raw": "Melee 1"
  },
  "target": "One creature or object",
  "powerRoll": {
    "characteristic": "might",
    "tiers": [
      {
        "threshold": "≤11",
        "text": "5 + M holy damage"
      },
      {
        "threshold": "12-16",
        "text": "8 + M holy damage"
      },
      {
        "threshold": "17+",
        "text": "11 + M holy damage"
      }
    ]
  },
  "effect": [
    "You can spend a Recovery to allow yourself or one ally within 10 squares to regain Stamina equal to your recovery value."
  ],
  "extraCosts": [],
  "origin": {
    "kind": "class",
    "id": "class.censor"
  },
  "abilityCategory": "heroic",
  "level": 1,
  "canonReviewStatus": "verified",
  "source": {
    "document": "heroes-v1.01-04-censor",
    "version": "1.01",
    "pdfPage": 6,
    "printedPage": 83,
    "checkedAt": "2026-07-28"
  }
}
```

**繁中內容**

```json
{
  "id": "ability.censor.the-gods-punish-and-defend",
  "nameZhHant": "神之懲護",
  "aliasesZhHant": [],
  "flavor": "你引導神聖能量來懲戒敵人並守護盟友。",
  "powerRoll": {
    "tiers": [
      {
        "threshold": "≤11",
        "text": "5 + `力量`神聖傷害"
      },
      {
        "threshold": "12-16",
        "text": "8 + `力量`神聖傷害"
      },
      {
        "threshold": "17+",
        "text": "11 + `力量`神聖傷害"
      }
    ]
  },
  "effect": [
    "你可以花費 1 點`復元力`，讓自己或 10 格內的 1 個盟友恢復等於你`復元值`的`體力`。"
  ],
  "meta": {
    "status": "reviewed",
    "nameApproval": "逐句對齊報告見 docs/alignment/zh-batch3-alignment.md（2026-07-29 擁有者逐項裁決）。 本條逐欄全部 exact，零待裁項。",
    "translationSource": "舊 Notion 招式列表 · 神之懲護",
    "commonProcessing": [
      "target「1 個生物或物體」可由 §4.4 的組合規則產生，不存於本層",
      "distance「近戰 1」為受控欄位，由 vocabulary 解析，不存於本層",
      "階層改用官方門檻徽章 ≤11／12-16／17+（指南 §5，排版級自動歸一）"
    ],
    "decisions": [],
    "conventions": "全域通則見 docs/translation-guide.md §6（排版）與 §7（規則文本一律第二人稱）。",
    "reviewedBy": "owner",
    "reviewedAt": "2026-07-30"
  },
  "canonRef": {
    "id": "ability.censor.the-gods-punish-and-defend",
    "document": "heroes-v1.01-04-censor",
    "printedPage": 83
  }
}
```

**結構與翻譯注意事項**

- target「1 個生物或物體」可由 §4.4 的組合規則產生，不存於本層
- distance「近戰 1」為受控欄位，由 vocabulary 解析，不存於本層
- 階層改用官方門檻徽章 ≤11／12-16／17+（指南 §5，排版級自動歸一）

**擁有者裁決**

- [ ] 核准，內容與結構皆可進入正式 M0
- [ ] 需要修改

擁有者備註：

> 

---
### 16. 你的同夥救不了你！ · Your Allies Cannot Save You!

- ID：`ability.censor.your-allies-cannot-save-you`
- 來源：Heroes v1.01，印刷頁 82（PDF 頁 5）
- Canon 狀態：`verified`；繁中狀態：`reviewed`
- TI／裁決：TI-19

**英文正典**

```json
{
  "id": "ability.censor.your-allies-cannot-save-you",
  "type": "ability",
  "name": "Your Allies Cannot Save You!",
  "aliasesEn": [],
  "flavor": "Your magic strike turns your foe’s guilt into a burst of holy power.",
  "keywords": [
    "melee",
    "strike",
    "weapon"
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
    "characteristic": "might",
    "tiers": [
      {
        "threshold": "≤11",
        "text": "3 + M holy damage"
      },
      {
        "threshold": "12-16",
        "text": "5 + M holy damage"
      },
      {
        "threshold": "17+",
        "text": "8 + M holy damage"
      }
    ]
  },
  "effect": [
    "Each enemy adjacent to the target is pushed away from the target up to a number of squares equal to your Presence score."
  ],
  "extraCosts": [],
  "origin": {
    "kind": "class",
    "id": "class.censor"
  },
  "abilityCategory": "signature",
  "level": 1,
  "canonReviewStatus": "verified",
  "source": {
    "document": "heroes-v1.01-04-censor",
    "version": "1.01",
    "pdfPage": 5,
    "printedPage": 82,
    "checkedAt": "2026-07-28"
  }
}
```

**繁中內容**

```json
{
  "id": "ability.censor.your-allies-cannot-save-you",
  "nameZhHant": "你的同夥救不了你！",
  "aliasesZhHant": [],
  "flavor": "你的魔法打擊將敵人的罪惡感轉化為神聖的衝擊力。",
  "powerRoll": {
    "tiers": [
      {
        "threshold": "≤11",
        "text": "3 + `力量`神聖傷害"
      },
      {
        "threshold": "12-16",
        "text": "5 + `力量`神聖傷害"
      },
      {
        "threshold": "17+",
        "text": "8 + `力量`神聖傷害"
      }
    ]
  },
  "effect": [
    "與目標相鄰的每個敵人都會朝遠離目標的方向推動最多等於你`氣場`的格數。"
  ],
  "meta": {
    "status": "reviewed",
    "nameApproval": "逐欄對齊報告見 docs/alignment/zh-batch2-alignment.md；唯一 🔴 待裁項（漏譯 up to）已裁為 TI-19 並套用。",
    "translationSource": "舊 Notion 招式列表 · 你的同夥救不了你！",
    "commonProcessing": [
      "target「1 個生物或物體」可由 §4.4 的組合規則產生，不存於本層",
      "distance「近戰 1」為受控欄位，由 vocabulary 解析，不存於本層",
      "階層改用官方門檻徽章 ≤11／12-16／17+（指南 §5，排版級自動歸一）",
      "PN-D2：flavor 的 burst 譯為「衝擊力」而非術語表的區域形狀「爆發」，屬 §7.2 允許的改寫，已列入報告供知悉"
    ],
    "decisions": [
      "TI-19"
    ],
    "conventions": "全域通則見 docs/translation-guide.md §6（排版）與 §7（規則文本一律第二人稱）。",
    "reviewedBy": "owner",
    "reviewedAt": "2026-07-30"
  },
  "canonRef": {
    "id": "ability.censor.your-allies-cannot-save-you",
    "document": "heroes-v1.01-04-censor",
    "printedPage": 82
  }
}
```

**結構與翻譯注意事項**

- target「1 個生物或物體」可由 §4.4 的組合規則產生，不存於本層
- distance「近戰 1」為受控欄位，由 vocabulary 解析，不存於本層
- 階層改用官方門檻徽章 ≤11／12-16／17+（指南 §5，排版級自動歸一）
- PN-D2：flavor 的 burst 譯為「衝擊力」而非術語表的區域形狀「爆發」，屬 §7.2 允許的改寫，已列入報告供知悉

**擁有者裁決**

- [ ] 核准，內容與結構皆可進入正式 M0
- [ ] 需要修改

擁有者備註：

> 

---

## 狀態 · 9 筆

### 1. 出血 · Bleeding

- ID：`condition.bleeding`
- 來源：Heroes v1.01，印刷頁 77（PDF 頁 9）
- Canon 狀態：`verified`；繁中狀態：`reviewed`
- TI／裁決：無個別 TI；套用全域指南

**英文正典**

```json
{
  "id": "condition.bleeding",
  "type": "condition",
  "name": "Bleeding",
  "aliasesEn": [],
  "text": [
    "While a creature is bleeding, whenever they use a main action, use a triggered action, or make a test or ability roll using Might or Agility, they lose Stamina equal to 1d6 + their level after the main action, triggered action, or power roll is resolved. This Stamina loss can’t be prevented in any way, and only happens once per action.",
    "You take damage from this condition when you use a main action off your turn. For example, a signature ability used as a free triggered action with the assistance of the tactician’s Strike Now ability triggers the damage from the bleeding condition."
  ],
  "canonReviewStatus": "verified",
  "source": {
    "document": "heroes-v1.01-03-class-and-abilities",
    "version": "1.01",
    "pdfPage": 9,
    "printedPage": 77,
    "checkedAt": "2026-07-28"
  }
}
```

**繁中內容**

```json
{
  "id": "condition.bleeding",
  "nameZhHant": "出血",
  "aliasesZhHant": [],
  "text": [
    "若你處於出血狀態，每當你使用主要動作或反應動作，或使用`力量`或`敏捷`進行考驗或招式檢定時，在動作或檢定結算後，你會失去 1D6 + 等級的`體力`（無法透過任何方式避免，而且每個動作只會失去 1 次`體力`）。",
    "若你在自己的回合外使用主要動作，你也會受到此狀態的傷害。例如，若你在戰術家的「快出手！」招式協助下使用免費反應動作發動招牌招式，你也會觸發出血狀態的傷害。"
  ],
  "meta": {
    "status": "reviewed",
    "reviewedBy": "owner",
    "reviewedAt": "2026-07-28",
    "nameApproval": "名稱經擁有者於 docs/alignment/conditions.md 逐條確認與 Heroes v1.01 原文相符後批准。",
    "translationSource": "舊 Notion 狀態列表 · 出血",
    "commonProcessing": [
      "已批准術語批次改寫：觸發式動作→反應動作、免費觸發式動作→免費反應動作",
      "Notion 內部連結拆為純文字：快出手！"
    ],
    "decisions": [],
    "conventions": "全域通則見 docs/translation-guide.md §7（規則文本一律第二人稱，即使原文為第三人稱）。"
  },
  "canonRef": {
    "id": "condition.bleeding",
    "document": "heroes-v1.01-03-class-and-abilities",
    "printedPage": 77
  }
}
```

**結構與翻譯注意事項**

- 已批准術語批次改寫：觸發式動作→反應動作、免費觸發式動作→免費反應動作
- Notion 內部連結拆為純文字：快出手！

**擁有者裁決**

- [ ] 核准，內容與結構皆可進入正式 M0
- [ ] 需要修改

擁有者備註：

> 

---
### 2. 暈眩 · Dazed

- ID：`condition.dazed`
- 來源：Heroes v1.01，印刷頁 77（PDF 頁 9）
- Canon 狀態：`verified`；繁中狀態：`reviewed`
- TI／裁決：無個別 TI；套用全域指南

**英文正典**

```json
{
  "id": "condition.dazed",
  "type": "condition",
  "name": "Dazed",
  "aliasesEn": [],
  "text": [
    "A creature who is dazed can do only one thing on their turn: use a main action, use a maneuver, or use a move action. A dazed creature also can’t use triggered actions, free triggered actions, or free maneuvers."
  ],
  "canonReviewStatus": "verified",
  "source": {
    "document": "heroes-v1.01-03-class-and-abilities",
    "version": "1.01",
    "pdfPage": 9,
    "printedPage": 77,
    "checkedAt": "2026-07-28"
  }
}
```

**繁中內容**

```json
{
  "id": "condition.dazed",
  "nameZhHant": "暈眩",
  "aliasesZhHant": [],
  "text": [
    "若你處於暈眩狀態，你在自己回合中只能執行其中 1 種動作：主要動作、機動動作，或移動動作。你也無法使用反應動作、免費反應動作，以及免費機動動作。"
  ],
  "meta": {
    "status": "reviewed",
    "reviewedBy": "owner",
    "reviewedAt": "2026-07-28",
    "nameApproval": "名稱經擁有者於 docs/alignment/conditions.md 逐條確認與 Heroes v1.01 原文相符後批准。",
    "translationSource": "舊 Notion 狀態列表 · 暈眩",
    "commonProcessing": [
      "已批准術語批次改寫：觸發式動作→反應動作、免費觸發式動作→免費反應動作"
    ],
    "decisions": [],
    "conventions": "全域通則見 docs/translation-guide.md §7（規則文本一律第二人稱，即使原文為第三人稱）。"
  },
  "canonRef": {
    "id": "condition.dazed",
    "document": "heroes-v1.01-03-class-and-abilities",
    "printedPage": 77
  }
}
```

**結構與翻譯注意事項**

- 已批准術語批次改寫：觸發式動作→反應動作、免費觸發式動作→免費反應動作

**擁有者裁決**

- [ ] 核准，內容與結構皆可進入正式 M0
- [ ] 需要修改

擁有者備註：

> 

---
### 3. 畏縮 · Frightened

- ID：`condition.frightened`
- 來源：Heroes v1.01，印刷頁 77（PDF 頁 9）
- Canon 狀態：`verified`；繁中狀態：`reviewed`
- TI／裁決：無個別 TI；套用全域指南

**英文正典**

```json
{
  "id": "condition.frightened",
  "type": "condition",
  "name": "Frightened",
  "aliasesEn": [],
  "text": [
    "When a creature is frightened, any ability roll they make against the source of their fear takes a bane. If that source is a creature, their ability rolls made against the frightened creature gain an edge. A frightened creature can’t willingly move closer to the source of their fear if they know the location of that source. If a creature gains the frightened condition from one source while already frightened by a different source, the new condition replaces the old one."
  ],
  "canonReviewStatus": "verified",
  "source": {
    "document": "heroes-v1.01-03-class-and-abilities",
    "version": "1.01",
    "pdfPage": 9,
    "printedPage": 77,
    "checkedAt": "2026-07-28"
  }
}
```

**繁中內容**

```json
{
  "id": "condition.frightened",
  "nameZhHant": "畏縮",
  "aliasesZhHant": [],
  "text": [
    "若你處於畏縮狀態，你對恐懼來源進行的任何招式檢定都會承受 1 個劣勢。若恐懼來源為生物，該來源對你進行的招式檢定會獲得 1 個優勢。你若知道恐懼來源的位置，你就無法主動接近該來源。若你已經因為某個來源而陷入畏縮，然後又從其他來源陷入畏縮，則新的畏縮狀態會取代舊的狀態。"
  ],
  "meta": {
    "status": "reviewed",
    "reviewedBy": "owner",
    "reviewedAt": "2026-07-28",
    "nameApproval": "名稱經擁有者於 docs/alignment/conditions.md 逐條確認與 Heroes v1.01 原文相符後批准。",
    "translationSource": "舊 Notion 狀態列表 · 畏縮",
    "commonProcessing": [],
    "decisions": [],
    "conventions": "全域通則見 docs/translation-guide.md §7（規則文本一律第二人稱，即使原文為第三人稱）。"
  },
  "canonRef": {
    "id": "condition.frightened",
    "document": "heroes-v1.01-03-class-and-abilities",
    "printedPage": 77
  }
}
```

**結構與翻譯注意事項**

- 無

**擁有者裁決**

- [ ] 核准，內容與結構皆可進入正式 M0
- [ ] 需要修改

擁有者備註：

> 

---
### 4. 擒制 · Grabbed

- ID：`condition.grabbed`
- 來源：Heroes v1.01，印刷頁 77（PDF 頁 9）
- Canon 狀態：`verified`；繁中狀態：`reviewed`
- TI／裁決：[object Object]、[object Object]

**英文正典**

```json
{
  "id": "condition.grabbed",
  "type": "condition",
  "name": "Grabbed",
  "aliasesEn": [],
  "text": [
    "A creature who is grabbed has speed 0, can’t be force moved except by a creature, object, or effect that has them grabbed, can’t use the Knockback maneuver (see Maneuvers in Chapter 10: Combat), and takes a bane on abilities that don’t target the creature, object, or effect that has them grabbed. If a creature is grabbed by another creature and that creature moves, they bring the grabbed creature with them. If a creature’s size is equal to or less than the size of a creature they have grabbed, their speed is halved while they have that creature grabbed.",
    "A creature who has another creature grabbed can use a maneuver to move the grabbed creature into an unoccupied space adjacent to them.",
    "A creature can release a creature they have grabbed at any time to end that condition (no action required). A grabbed creature can attempt to escape being grabbed using the Escape Grab maneuver (see Chapter 10: Combat). If a grabbed creature teleports, or if either the grabbed creature or the creature grabbing them is force moved so that both creatures are not adjacent to each other, that creature is no longer grabbed.",
    "A creature can grab only creatures of their size or smaller. If a creature’s Might score is 2 or higher, they can grab any creature larger than them with a size equal to or less than their Might score.",
    "Unless otherwise indicated, a creature can grab only one creature at a time."
  ],
  "canonReviewStatus": "verified",
  "source": {
    "document": "heroes-v1.01-03-class-and-abilities",
    "version": "1.01",
    "pdfPage": 9,
    "printedPage": 77,
    "checkedAt": "2026-07-28"
  }
}
```

**繁中內容**

```json
{
  "id": "condition.grabbed",
  "nameZhHant": "擒制",
  "aliasesZhHant": [],
  "text": [
    "若你被擒制，你的`速度`歸 0，而且只能被擒抱者（生物、物體或效果）強制移動。你無法使用擊退機動動作，而且對擒抱者以外的目標進行的任何招式檢定都會承受 1 個劣勢。當擒抱者移動時，你會一起移動。若擒抱者的`體型` ≦ 你，則擒抱者在擒抱期間的`速度`會減半。",
    "擒抱者可以使用機動動作將你移動至相鄰的未占據空間。",
    "擒抱者可以隨時釋放你來解除該狀態（無需動作）。你可以使用掙脫機動動作來嘗試脫離。若你進行傳送，或你與擒抱者任一方被強制移動到雙方不相鄰的位置，擒制狀態就會立刻解除。",
    "生物只能擒抱`體型` ≦ 自己的生物。若生物的`力量`為 2 以上，則可以擒抱`體型` ≦ 其`力量`的生物。",
    "除非另有說明，生物同時只能擒抱 1 個生物。"
  ],
  "meta": {
    "status": "reviewed",
    "reviewedBy": "owner",
    "reviewedAt": "2026-07-28",
    "nameApproval": "名稱經擁有者於 docs/alignment/conditions.md 逐條確認與 Heroes v1.01 原文相符後批准。",
    "translationSource": "舊 Notion 狀態列表 · 擒制",
    "commonProcessing": [
      "Notion 內部連結拆為純文字：擊退、掙脫、擒抱"
    ],
    "decisions": [
      {
        "id": "TI-1",
        "effect": "已套用，文字已變更：刪除「在自己回合」"
      },
      {
        "id": "TI-2",
        "effect": "裁決維持舊譯「招式檢定」，文字未變更；疑點待官方勘誤釐清"
      }
    ],
    "conventions": "全域通則見 docs/translation-guide.md §7（規則文本一律第二人稱，即使原文為第三人稱）。"
  },
  "canonRef": {
    "id": "condition.grabbed",
    "document": "heroes-v1.01-03-class-and-abilities",
    "printedPage": 77
  }
}
```

**結構與翻譯注意事項**

- Notion 內部連結拆為純文字：擊退、掙脫、擒抱

**擁有者裁決**

- [ ] 核准，內容與結構皆可進入正式 M0
- [ ] 需要修改

擁有者備註：

> 

---
### 5. 伏地 · Prone

- ID：`condition.prone`
- 來源：Heroes v1.01，印刷頁 77（PDF 頁 9）
- Canon 狀態：`verified`；繁中狀態：`reviewed`
- TI／裁決：無個別 TI；套用全域指南

**英文正典**

```json
{
  "id": "condition.prone",
  "type": "condition",
  "name": "Prone",
  "aliasesEn": [],
  "text": [
    "While a creature is prone, they are flat on the ground, any strike they make takes a bane, and melee abilities used against them gain an edge. A prone creature must crawl to move along the ground, which costs 1 additional square of movement for every square crawled. A creature can’t climb, jump, swim, or fly while prone. If they are climbing, flying, or jumping when knocked prone, they fall.",
    "Unless the ability or effect that imposed the prone condition says otherwise, a prone creature can stand up using the Stand Up maneuver (see Maneuvers in Chapter 10: Combat). A creature adjacent to a willing prone creature can likewise use the Stand Up maneuver to make that creature stand up."
  ],
  "canonReviewStatus": "verified",
  "source": {
    "document": "heroes-v1.01-03-class-and-abilities",
    "version": "1.01",
    "pdfPage": 9,
    "printedPage": 77,
    "checkedAt": "2026-07-28"
  }
}
```

**繁中內容**

```json
{
  "id": "condition.prone",
  "nameZhHant": "伏地",
  "aliasesZhHant": [],
  "text": [
    "若你處於伏地狀態，你的身體會平貼地面。在此狀態下，你發動的任何打擊都會承受 1 個劣勢，而其他生物對你發動的近戰招式則會獲得 1 個優勢。你只能用爬行的方式移動，每移動 1 格都需要額外消耗 1 格移動力。你在伏地時無法進行攀爬、跳躍、游泳或飛行。若你在攀爬、飛行或跳躍時被擊倒伏地，則會立刻墜落。",
    "除非造成伏地狀態的招式或效果另有說明，否則你可以使用起身機動動作來解除伏地。此外，若你願意，相鄰的生物也可以對你使用起身機動動作來將你拉起來。"
  ],
  "meta": {
    "status": "reviewed",
    "reviewedBy": "owner",
    "reviewedAt": "2026-07-28",
    "nameApproval": "名稱經擁有者於 docs/alignment/conditions.md 逐條確認與 Heroes v1.01 原文相符後批准。",
    "translationSource": "舊 Notion 狀態列表 · 伏地",
    "commonProcessing": [
      "Notion 內部連結拆為純文字：起身"
    ],
    "decisions": [],
    "conventions": "全域通則見 docs/translation-guide.md §7（規則文本一律第二人稱，即使原文為第三人稱）。"
  },
  "canonRef": {
    "id": "condition.prone",
    "document": "heroes-v1.01-03-class-and-abilities",
    "printedPage": 77
  }
}
```

**結構與翻譯注意事項**

- Notion 內部連結拆為純文字：起身

**擁有者裁決**

- [ ] 核准，內容與結構皆可進入正式 M0
- [ ] 需要修改

擁有者備註：

> 

---
### 6. 束縛 · Restrained

- ID：`condition.restrained`
- 來源：Heroes v1.01，印刷頁 77（PDF 頁 9）
- Canon 狀態：`verified`；繁中狀態：`reviewed`
- TI／裁決：無個別 TI；套用全域指南

**英文正典**

```json
{
  "id": "condition.restrained",
  "type": "condition",
  "name": "Restrained",
  "aliasesEn": [],
  "text": [
    "A creature who is restrained has speed 0, can’t use the Stand Up maneuver, and can’t be force moved. A restrained creature takes a bane on ability rolls and on Might and Agility tests, and abilities used against them gain an edge.",
    "If a creature teleports while restrained, that condition ends."
  ],
  "canonReviewStatus": "verified",
  "source": {
    "document": "heroes-v1.01-03-class-and-abilities",
    "version": "1.01",
    "pdfPage": 9,
    "printedPage": 77,
    "checkedAt": "2026-07-28"
  }
}
```

**繁中內容**

```json
{
  "id": "condition.restrained",
  "nameZhHant": "束縛",
  "aliasesZhHant": [],
  "text": [
    "若你被束縛，你的`速度`歸 0，無法使用起身機動動作，也無法被強制移動。你在進行招式檢定以及`力量`與`敏捷`考驗時會承受 1 個劣勢，而其他生物對你進行的招式檢定則會獲得 1 個優勢。",
    "若你進行傳送，束縛狀態就會立刻解除。"
  ],
  "meta": {
    "status": "reviewed",
    "reviewedBy": "owner",
    "reviewedAt": "2026-07-28",
    "nameApproval": "名稱經擁有者於 docs/alignment/conditions.md 逐條確認與 Heroes v1.01 原文相符後批准。",
    "translationSource": "舊 Notion 狀態列表 · 束縛",
    "commonProcessing": [
      "Notion 內部連結拆為純文字：起身"
    ],
    "decisions": [],
    "conventions": "全域通則見 docs/translation-guide.md §7（規則文本一律第二人稱，即使原文為第三人稱）。"
  },
  "canonRef": {
    "id": "condition.restrained",
    "document": "heroes-v1.01-03-class-and-abilities",
    "printedPage": 77
  }
}
```

**結構與翻譯注意事項**

- Notion 內部連結拆為純文字：起身

**擁有者裁決**

- [ ] 核准，內容與結構皆可進入正式 M0
- [ ] 需要修改

擁有者備註：

> 

---
### 7. 緩速 · Slowed

- ID：`condition.slowed`
- 來源：Heroes v1.01，印刷頁 77（PDF 頁 9）
- Canon 狀態：`verified`；繁中狀態：`reviewed`
- TI／裁決：無個別 TI；套用全域指南

**英文正典**

```json
{
  "id": "condition.slowed",
  "type": "condition",
  "name": "Slowed",
  "aliasesEn": [],
  "text": [
    "A creature who is slowed has speed 2 unless their speed is already lower, and they can’t shift."
  ],
  "canonReviewStatus": "verified",
  "source": {
    "document": "heroes-v1.01-03-class-and-abilities",
    "version": "1.01",
    "pdfPage": 9,
    "printedPage": 77,
    "checkedAt": "2026-07-28"
  }
}
```

**繁中內容**

```json
{
  "id": "condition.slowed",
  "nameZhHant": "緩速",
  "aliasesZhHant": [],
  "text": [
    "若你被緩速，你的`速度`為 2（除非你的`速度`已經 < 2），而且無法進行遁移。"
  ],
  "meta": {
    "status": "reviewed",
    "reviewedBy": "owner",
    "reviewedAt": "2026-07-28",
    "nameApproval": "名稱經擁有者於 docs/alignment/conditions.md 逐條確認與 Heroes v1.01 原文相符後批准。",
    "translationSource": "舊 Notion 狀態列表 · 緩速",
    "commonProcessing": [],
    "decisions": [],
    "conventions": "全域通則見 docs/translation-guide.md §7（規則文本一律第二人稱，即使原文為第三人稱）。"
  },
  "canonRef": {
    "id": "condition.slowed",
    "document": "heroes-v1.01-03-class-and-abilities",
    "printedPage": 77
  }
}
```

**結構與翻譯注意事項**

- 無

**擁有者裁決**

- [ ] 核准，內容與結構皆可進入正式 M0
- [ ] 需要修改

擁有者備註：

> 

---
### 8. 嘲諷 · Taunted

- ID：`condition.taunted`
- 來源：Heroes v1.01，印刷頁 77（PDF 頁 9）
- Canon 狀態：`verified`；繁中狀態：`reviewed`
- TI／裁決：無個別 TI；套用全域指南

**英文正典**

```json
{
  "id": "condition.taunted",
  "type": "condition",
  "name": "Taunted",
  "aliasesEn": [],
  "text": [
    "A creature who is taunted has a double bane on ability rolls for any ability that doesn’t target the creature who taunted them, as long as they have line of effect to that creature. If a creature gains the taunted condition from one source while already taunted by a different source, the new condition replaces the old one."
  ],
  "canonReviewStatus": "verified",
  "source": {
    "document": "heroes-v1.01-03-class-and-abilities",
    "version": "1.01",
    "pdfPage": 9,
    "printedPage": 77,
    "checkedAt": "2026-07-28"
  }
}
```

**繁中內容**

```json
{
  "id": "condition.taunted",
  "nameZhHant": "嘲諷",
  "aliasesZhHant": [],
  "text": [
    "若你被嘲諷，只要你與嘲諷者之間保持效果線，你對嘲諷者以外的目標進行的任何招式檢定都會承受雙劣勢。若你已經被嘲諷，然後又受到其他來源的嘲諷，則新的嘲諷狀態會取代舊的狀態。"
  ],
  "meta": {
    "status": "reviewed",
    "reviewedBy": "owner",
    "reviewedAt": "2026-07-28",
    "nameApproval": "名稱經擁有者於 docs/alignment/conditions.md 逐條確認與 Heroes v1.01 原文相符後批准。",
    "translationSource": "舊 Notion 狀態列表 · 嘲諷",
    "commonProcessing": [],
    "decisions": [],
    "conventions": "全域通則見 docs/translation-guide.md §7（規則文本一律第二人稱，即使原文為第三人稱）。"
  },
  "canonRef": {
    "id": "condition.taunted",
    "document": "heroes-v1.01-03-class-and-abilities",
    "printedPage": 77
  }
}
```

**結構與翻譯注意事項**

- 無

**擁有者裁決**

- [ ] 核准，內容與結構皆可進入正式 M0
- [ ] 需要修改

擁有者備註：

> 

---
### 9. 虛弱 · Weakened

- ID：`condition.weakened`
- 來源：Heroes v1.01，印刷頁 77（PDF 頁 9）
- Canon 狀態：`verified`；繁中狀態：`reviewed`
- TI／裁決：[object Object]

**英文正典**

```json
{
  "id": "condition.weakened",
  "type": "condition",
  "name": "Weakened",
  "aliasesEn": [],
  "text": [
    "A creature who is weakened takes a bane on power rolls."
  ],
  "canonReviewStatus": "verified",
  "source": {
    "document": "heroes-v1.01-03-class-and-abilities",
    "version": "1.01",
    "pdfPage": 9,
    "printedPage": 77,
    "checkedAt": "2026-07-28"
  }
}
```

**繁中內容**

```json
{
  "id": "condition.weakened",
  "nameZhHant": "虛弱",
  "aliasesZhHant": [],
  "text": [
    "若你陷入虛弱狀態，你進行的任何檢定都會承受 1 個劣勢。"
  ],
  "meta": {
    "status": "reviewed",
    "reviewedBy": "owner",
    "reviewedAt": "2026-07-28",
    "nameApproval": "名稱經擁有者於 docs/alignment/conditions.md 逐條確認與 Heroes v1.01 原文相符後批准。",
    "translationSource": "舊 Notion 狀態列表 · 虛弱",
    "commonProcessing": [],
    "decisions": [
      {
        "id": "TI-3",
        "effect": "裁決維持舊譯（保留「任何」），文字未變更"
      }
    ],
    "conventions": "全域通則見 docs/translation-guide.md §7（規則文本一律第二人稱，即使原文為第三人稱）。"
  },
  "canonRef": {
    "id": "condition.weakened",
    "document": "heroes-v1.01-03-class-and-abilities",
    "printedPage": 77
  }
}
```

**結構與翻譯注意事項**

- 無

**擁有者裁決**

- [ ] 核准，內容與結構皆可進入正式 M0
- [ ] 需要修改

擁有者備註：

> 

---

## 職業特性 · 3 筆

### 1. 懲戒者教團 · Censor Order

- ID：`feature.censor.censor-order`
- 來源：Heroes v1.01，印刷頁 79（PDF 頁 2）
- Canon 狀態：`verified`；繁中狀態：`reviewed`
- TI／裁決：TI-11、TI-12、TI-13、TI-15、TI-17

**英文正典**

```json
{
  "id": "feature.censor.censor-order",
  "type": "feature",
  "name": "Censor Order",
  "aliasesEn": [],
  "sections": [
    {
      "heading": null,
      "blocks": [
        {
          "kind": "paragraph",
          "text": "Censors are the will of their god made physically manifest, and you act as your god’s agent in the world. As you shoulder that responsibility, you choose a censor order from the following options, each of which grants you a skill. (Quick Build: Paragon.)"
        },
        {
          "kind": "definitionList",
          "marker": "none",
          "items": [
            {
              "term": "Exorcist",
              "text": "You specialize in hunting your order’s hidden enemies, knowing that an open mind is an unguarded fortress. You have the Read Person skill."
            },
            {
              "term": "Oracle",
              "text": "Corruption has deep tendrils that can be missed, leading you to specialize in uncovering clandestine threats to your order. You have the Magic skill."
            },
            {
              "term": "Paragon",
              "text": "Without a strong example and a firm hand, the weak will be corrupted. You specialize in setting an example for your order. You have the Lead skill."
            }
          ]
        },
        {
          "kind": "paragraph",
          "text": "Your censor order is your subclass, and your choice of order determines many of the features you’ll gain as you gain new levels."
        }
      ]
    }
  ],
  "origin": {
    "kind": "class",
    "id": "class.censor"
  },
  "level": 1,
  "canonReviewStatus": "verified",
  "source": {
    "document": "heroes-v1.01-04-censor",
    "version": "1.01",
    "pdfPage": 2,
    "printedPage": 79,
    "checkedAt": "2026-07-29"
  }
}
```

**繁中內容**

```json
{
  "id": "feature.censor.censor-order",
  "nameZhHant": "懲戒者教團",
  "aliasesZhHant": [],
  "sections": [
    {
      "heading": null,
      "blocks": [
        {
          "kind": "paragraph",
          "text": "懲戒者作為其神明意志的實體化身，是神明在世界上的代行者。\n\n當你承擔這個責任時，從以下選項中選擇 1 支教團。每支教團都會賦予你 1 項技能。（推薦選項：典範）"
        },
        {
          "kind": "definitionList",
          "marker": "none",
          "items": [
            {
              "term": "驅邪",
              "text": "你擅長獵捕尚未被教團發現的潛藏敵人，深知敞開的心靈就如同毫無防備的堡壘。你擁有`觀色`技能。"
            },
            {
              "term": "神諭",
              "text": "腐敗如同深入骨髓的觸鬚，容易被忽視，因此你擅長揭露威脅教團的隱藏威脅。你擁有`魔法`技能。"
            },
            {
              "term": "典範",
              "text": "若沒有堅強的典範與嚴格的管束，弱者必定墮落腐化。你擅長為教團樹立榜樣。你擁有`領導`技能。"
            }
          ]
        },
        {
          "kind": "paragraph",
          "text": "你的懲戒者教團代表你的`子範型`，你選擇的教團將決定你在升級時獲得的許多特性。"
        }
      ]
    }
  ],
  "meta": {
    "status": "reviewed",
    "reviewedBy": "owner",
    "reviewedAt": "2026-07-29",
    "nameApproval": "逐句對齊報告見 docs/alignment/zh-batch1-alignment.md，7 項差異已於 2026-07-29 逐筆裁決。",
    "translationSource": "舊 Notion 懲戒者 · 懲戒者教團",
    "commonProcessing": [
      "教團名稱依 TI-17 採正式短式「驅邪／神諭／典範」；行文中需要時可組合為「驅邪教團」",
      "舊譯把原文第 1 段拆成兩段，維持舊譯的分段（TI-12），以段內換行保留"
    ],
    "decisions": [
      "TI-11",
      "TI-12",
      "TI-13",
      "TI-15",
      "TI-17"
    ],
    "conventions": "全域通則見 docs/translation-guide.md §6（排版）與 §7（規則文本一律第二人稱）。"
  },
  "canonRef": {
    "id": "feature.censor.censor-order",
    "document": "heroes-v1.01-04-censor",
    "printedPage": 79
  }
}
```

**結構與翻譯注意事項**

- 教團名稱依 TI-17 採正式短式「驅邪／神諭／典範」；行文中需要時可組合為「驅邪教團」
- 舊譯把原文第 1 段拆成兩段，維持舊譯的分段（TI-12），以段內換行保留

**擁有者裁決**

- [ ] 核准，內容與結構皆可進入正式 M0
- [ ] 需要修改

擁有者備註：

> 

---
### 2. 審判：教團益處 · Judgment Order Benefit

- ID：`feature.censor.judgment-order-benefit`
- 來源：Heroes v1.01，印刷頁 80（PDF 頁 3）
- Canon 狀態：`verified`；繁中狀態：`reviewed`
- TI／裁決：TI-14、TI-17、TI-30

**英文正典**

```json
{
  "id": "feature.censor.judgment-order-benefit",
  "type": "feature",
  "name": "Judgment Order Benefit",
  "aliasesEn": [],
  "sections": [
    {
      "heading": null,
      "blocks": [
        {
          "kind": "paragraph",
          "text": "The first time on a turn that you use your Judgment ability to judge a creature, you gain the following benefit based on your order:"
        },
        {
          "kind": "definitionList",
          "marker": "bullet",
          "items": [
            {
              "term": "Exorcist",
              "text": "You can teleport up to a number of squares equal to twice your Presence score. This movement must take you closer to the judged creature. You do not need line of effect to your destination."
            },
            {
              "term": "Oracle",
              "text": "You can deal holy damage equal to twice your Presence score to the judged creature."
            },
            {
              "term": "Paragon",
              "text": "You can vertical pull the judged creature up to a number of squares equal to twice your Presence score."
            }
          ]
        }
      ]
    }
  ],
  "origin": {
    "kind": "class",
    "id": "class.censor"
  },
  "relatedTo": [
    "ability.censor.judgment"
  ],
  "level": 1,
  "canonReviewStatus": "verified",
  "source": {
    "document": "heroes-v1.01-04-censor",
    "version": "1.01",
    "pdfPage": 3,
    "printedPage": 80,
    "checkedAt": "2026-07-29"
  }
}
```

**繁中內容**

```json
{
  "id": "feature.censor.judgment-order-benefit",
  "nameZhHant": "審判：教團益處",
  "aliasesZhHant": [],
  "sections": [
    {
      "heading": null,
      "blocks": [
        {
          "kind": "paragraph",
          "text": "當你在 1 個回合中首次發動[審判](ability.censor.judgment)招式審判 1 個生物時，你會根據所屬教團獲得以下益處："
        },
        {
          "kind": "definitionList",
          "marker": "bullet",
          "items": [
            {
              "term": "驅邪",
              "text": "你可以傳送最多等於你`氣場` ×2 的格數。此移動必須讓你更接近被審判的生物。你與終點之間不需要有效果線。"
            },
            {
              "term": "神諭",
              "text": "你可以對被審判的生物造成等於你`氣場` ×2 的神聖傷害。"
            },
            {
              "term": "典範",
              "text": "你可以將被審判的生物垂直拉動最多等於你`氣場` ×2 的格數。"
            }
          ]
        }
      ]
    }
  ],
  "meta": {
    "status": "reviewed",
    "reviewedBy": "owner",
    "reviewedAt": "2026-07-30",
    "nameApproval": "名稱依 TI-14 裁定為「審判：教團益處」（舊譯作「審判教團益處」）。逐句對齊報告見 docs/alignment/zh-batch1-alignment.md。",
    "translationSource": "舊 Notion 懲戒者 · 審判 · 審判教團益處",
    "commonProcessing": [
      "排版級自動歸一：舊譯驅邪條作「`氣場` × 2」，依指南 §6「乘號緊貼阿拉伯數字」統一為「×2」，與神諭／典範兩條一致",
      "教團名稱依 TI-17 採正式短式「驅邪／神諭／典範」（此處舊譯本就是短式）",
      "TI-16 的連結慣例：招式名以 [文字](實體 id) 標記；依指南 §6，內文提及招式名時前後加【】由 renderer 處理",
      "2026-07-30 擁有者裁決：移除「傳送、格、效果線、神聖、垂直拉動」的醒目標示，只保留真正的遊戲數值／屬性用語（`氣場`）加註記；一般規則名詞不需要每個都標成術語"
    ],
    "decisions": [
      "TI-14",
      "TI-17",
      "TI-30"
    ],
    "conventions": "全域通則見 docs/translation-guide.md §6（排版）與 §7（規則文本一律第二人稱）。"
  },
  "canonRef": {
    "id": "feature.censor.judgment-order-benefit",
    "document": "heroes-v1.01-04-censor",
    "printedPage": 80
  }
}
```

**結構與翻譯注意事項**

- 排版級自動歸一：舊譯驅邪條作「`氣場` × 2」，依指南 §6「乘號緊貼阿拉伯數字」統一為「×2」，與神諭／典範兩條一致
- 教團名稱依 TI-17 採正式短式「驅邪／神諭／典範」（此處舊譯本就是短式）
- TI-16 的連結慣例：招式名以 [文字](實體 id) 標記；依指南 §6，內文提及招式名時前後加【】由 renderer 處理
- 2026-07-30 擁有者裁決：移除「傳送、格、效果線、神聖、垂直拉動」的醒目標示，只保留真正的遊戲數值／屬性用語（`氣場`）加註記；一般規則名詞不需要每個都標成術語

**擁有者裁決**

- [ ] 核准，內容與結構皆可進入正式 M0
- [ ] 需要修改

擁有者備註：

> 

---
### 3. 怒火 · Wrath

- ID：`feature.censor.wrath`
- 來源：Heroes v1.01，印刷頁 79（PDF 頁 2）
- Canon 狀態：`verified`；繁中狀態：`reviewed`
- TI／裁決：TI-8、TI-9、TI-10、TI-16、TI-18、TI-30

**英文正典**

```json
{
  "id": "feature.censor.wrath",
  "type": "feature",
  "name": "Wrath",
  "aliasesEn": [],
  "sections": [
    {
      "heading": null,
      "blocks": [
        {
          "kind": "paragraph",
          "text": "The power you serve grants you a Heroic Resource called wrath, fueling your abilities as you censor those your church deems to be heretics."
        }
      ]
    },
    {
      "heading": "Wrath in Combat",
      "blocks": [
        {
          "kind": "paragraph",
          "text": "At the start of a combat encounter or some other stressful situation tracked in combat rounds (as determined by the Director), you gain wrath equal to your Victories. At the start of each of your turns during combat, you gain 2 wrath."
        },
        {
          "kind": "paragraph",
          "text": "Additionally, the first time each combat round that a creature judged by you (see Judgment below) deals damage to you, you gain 1 wrath. The first time each combat round that you deal damage to a creature judged by you, you gain 1 wrath."
        },
        {
          "kind": "paragraph",
          "text": "You lose any remaining wrath at the end of the encounter."
        }
      ]
    },
    {
      "heading": "Wrath Outside of Combat",
      "blocks": [
        {
          "kind": "paragraph",
          "text": "Though you can’t gain wrath outside of combat, you can use your heroic abilities and effects that cost wrath without spending it. Whenever you use an ability or effect outside of combat that costs wrath, you can’t use that same ability or effect outside of combat again until you earn 1 or more Victories or finish a respite."
        },
        {
          "kind": "paragraph",
          "text": "When you use an ability outside of combat that lets you spend unlimited wrath on its effect, you can use it as if you had spent an amount of wrath equal to your Victories. (Such abilities aren’t part of the core rules for the censor, but they might appear in future products.)"
        }
      ]
    }
  ],
  "origin": {
    "kind": "class",
    "id": "class.censor"
  },
  "level": 1,
  "canonReviewStatus": "verified",
  "source": {
    "document": "heroes-v1.01-04-censor",
    "version": "1.01",
    "pdfPage": 2,
    "printedPage": 79,
    "checkedAt": "2026-07-29"
  }
}
```

**繁中內容**

```json
{
  "id": "feature.censor.wrath",
  "nameZhHant": "怒火",
  "aliasesZhHant": [],
  "sections": [
    {
      "heading": null,
      "blocks": [
        {
          "kind": "paragraph",
          "text": "你侍奉的神明賜予你名為「`怒火`」的`英雄資源`，這股力量會在你懲戒教會認定的異端時，驅動你的各種招式。"
        }
      ]
    },
    {
      "heading": "戰鬥中的怒火",
      "blocks": [
        {
          "kind": "paragraph",
          "text": "在戰鬥或其他需要以戰鬥輪計算的緊張情境開始時，你會獲得等於`勝利值`的`怒火`。"
        },
        {
          "kind": "bulletList",
          "lead": "此外，當以下條件觸發時，你會再額外獲得`怒火`。",
          "items": [
            "每輪 1 次，當你的回合開始時，你獲得 2 點`怒火`。",
            "每輪 1 次，當 1 個被你[審判](ability.censor.judgment)的生物首次對你造成傷害時，你獲得 1 點`怒火`。",
            "每輪 1 次，當你首次對 1 個被你[審判](ability.censor.judgment)的生物造成傷害時，你獲得 1 點`怒火`。"
          ]
        },
        {
          "kind": "paragraph",
          "text": "遭遇結束時，你失去所有剩餘的`怒火`。"
        }
      ]
    },
    {
      "heading": "戰鬥外的怒火",
      "blocks": [
        {
          "kind": "paragraph",
          "text": "雖然你無法在戰鬥外獲得`怒火`，但你可以在不花費`怒火`的情況下發動 1 次英雄招式或需要`怒火`的效果。若你這麼做，你必須獲得至少 1 點`勝利值`或完成 1 次休整，才能在戰鬥外再次發動同個招式或效果。"
        },
        {
          "kind": "paragraph",
          "text": "若你在戰鬥外發動 1 個允許你花費無限`怒火`的招式，你可以將其視為花費等於你`勝利值`的`怒火`（懲戒者的核心規則目前不包括這類招式，但可能會在未來的產品中出現）。"
        }
      ]
    }
  ],
  "meta": {
    "status": "reviewed",
    "reviewedBy": "owner",
    "reviewedAt": "2026-07-30",
    "nameApproval": "逐句對齊報告見 docs/alignment/zh-batch1-alignment.md，6 項差異已於 2026-07-29 逐筆裁決。",
    "translationSource": "舊 Notion 懲戒者 · 怒火",
    "commonProcessing": [
      "sections[1].blocks[1] 的正典是散文段落，中文改為「引導句＋項目清單」。這是擁有者裁定的全站風格（TI-9），其他 8 個範型的英雄資源說明比照辦理",
      "因此 blocks[].kind 允許與正典不同；但 sections 與 blocks 的數量與順序仍須一一對應，否則無法逐段比對",
      "「回合開始獲得 2 點怒火」在正典屬 blocks[0] 句尾，中文移入 blocks[1] 的清單首項——同屬 TI-9 的風格裁定",
      "TI-18：Respite 的舊譯「長休」批次套用為已批准譯名「休整」",
      "TI-16：【審判】做成站內連結，以 [文字](實體 id) 標記，renderer 解析",
      "2026-07-30 擁有者裁決：移除「戰鬥輪、遭遇、休整」的醒目標示，只保留真正的遊戲數值／屬性用語（`怒火`、`勝利值`）加註記"
    ],
    "decisions": [
      "TI-8",
      "TI-9",
      "TI-10",
      "TI-16",
      "TI-18",
      "TI-30"
    ],
    "conventions": "全域通則見 docs/translation-guide.md §6（排版）與 §7（規則文本一律第二人稱）。"
  },
  "canonRef": {
    "id": "feature.censor.wrath",
    "document": "heroes-v1.01-04-censor",
    "printedPage": 79
  }
}
```

**結構與翻譯注意事項**

- sections[1].blocks[1] 的正典是散文段落，中文改為「引導句＋項目清單」。這是擁有者裁定的全站風格（TI-9），其他 8 個範型的英雄資源說明比照辦理
- 因此 blocks[].kind 允許與正典不同；但 sections 與 blocks 的數量與順序仍須一一對應，否則無法逐段比對
- 「回合開始獲得 2 點怒火」在正典屬 blocks[0] 句尾，中文移入 blocks[1] 的清單首項——同屬 TI-9 的風格裁定
- TI-18：Respite 的舊譯「長休」批次套用為已批准譯名「休整」
- TI-16：【審判】做成站內連結，以 [文字](實體 id) 標記，renderer 解析
- 2026-07-30 擁有者裁決：移除「戰鬥輪、遭遇、休整」的醒目標示，只保留真正的遊戲數值／屬性用語（`怒火`、`勝利值`）加註記

**擁有者裁決**

- [ ] 核准，內容與結構皆可進入正式 M0
- [ ] 需要修改

擁有者備註：

> 

---

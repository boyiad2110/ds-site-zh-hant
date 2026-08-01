# Project-local Agent Skills

此目錄保存私人 repository 內共用的專案 Skills，讓不同 Agent session、重新 clone 與更換電腦後能使用相同的工作指引。第三方內容仍受各自原始授權約束。

## Included Skills

| Skill | 用途 | 原始來源 | 本機版本 | 授權 |
| --- | --- | --- | --- | --- |
| `frontend-design` | 視覺方向探索與具辨識度的前端設計指引 | [anthropics/skills](https://github.com/anthropics/skills/tree/main/skills/frontend-design) | `SKILL.md` 對應 commit `2235be7c60b551f5de82ade908fd3816455afcda`；安裝方式與安裝日期未記錄 | Apache-2.0；見 `skills/frontend-design/LICENSE.txt` |
| `ui-ux-pro-max` | 以本機資料庫查詢 UX、字體、色彩、響應式與技術棧建議 | [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | 精確版本與 commit 未記錄；本機內容包含多個上游修訂，不能視為單一 release；安裝方式與安裝日期未記錄 | MIT；見 `skills/ui-ux-pro-max/LICENSE` |

## Updating

更新前先核對上游來源、版本與授權；在暫存位置取得候選版本，檢查功能差異、敏感資料與生成物後，再有意識地替換此目錄。不要由 Agent 自動更新或把 cache、bytecode、log、mockup、visualization 與本機路徑一併提交。

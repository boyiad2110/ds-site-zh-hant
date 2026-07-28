# 待裁決術語清單（按出現頻率排序）

> 由 `scripts/report-term-frequency.mjs` 生成，唯讀報告。
> 頻率＝該中文譯名出現在 `sources/notion-export` 幾個檔案中。

## 怎麼用

**建議譯名一律取自你的舊譯**，多數情況直接批准即可。你只需要：

- 整段沒問題 → 回覆「A 全部批准」
- 個別要改 → 回覆「A 全部批准，但 #12 改成 XXX、#37 改成 YYY」
- 不確定 → 回覆「#45 先跳過」，該詞維持 needs-review

批准後我會寫進 `data/decisions.json` 並重跑生成，**你不需要碰任何檔案**。

⚠️ 標記說明：**⚠️** 表示該詞只有 1–2 個字，計數可能誤中其他詞的一部分，數字僅供參考。

---

## A 段 · M0 直接會用到（2 條）

**這段最優先。** 不批准的話，M0 的招式與狀態會卡在待決狀態。

| # | 英文 | 建議譯名 | M0 檔數 | 全語料 | 分類 |
|---|---|---|---|---|---|
| 1 | `Crafting` | **製造** | 1 | 34 ⚠️ | 規則/休整專案 |
| 2 | `Enhancement` | **強化** | 1 | 30 ⚠️ | 規則/術語 |

---

## B 段 · 高頻但非 M0（2 條，出現 ≥5 檔）

M1 以後會用到。有時間再看，不影響 M0。

| # | 英文 | 建議譯名 | M0 檔數 | 全語料 | 分類 |
|---|---|---|---|---|---|
| 3 | `Hakaan` | **哈肯人** | – | 20 | 角色/族裔 |
| 4 | `Memonek` | **梅莫人** | – | 16 | 角色/族裔 |

---

## C 段 · 低頻（343 條）

**建議暫不處理。** 多為地名、人名、單一冒險專用詞，等實際用到再裁決。

<details>
<summary>展開查看</summary>

| # | 英文 | 建議譯名 | 全語料 | 分類 |
|---|---|---|---|---|
| 5 | `A Sea of Suns` | 陽光之海 | 4 | 神明 |
| 6 | `Artifact` | 神器 | 4 ⚠️ | 規則/術語 |
| 7 | `Chronokinetic` | 掌宙流 | 4 | 角色/無念者流派 |
| 8 | `Corwell` | 克威爾 | 4 | 地名 |
| 9 | `Cryokinetic` | 冽脈流 | 4 | 角色/無念者流派 |
| 10 | `Dazar` | 達札爾 | 4 | 人名 |
| 11 | `Dragon Phalanx` | 龍衛方陣 | 4 | 組織 |
| 12 | `Leveled Treasure` | 共鳴寶物 | 4 | 規則/術語 |
| 13 | `Line` | 線形 | 4 ⚠️ | 規則/術語 |
| 14 | `Low Rhyvian` | 低瑞維亞語 | 4 | 世界觀 |
| 15 | `Metakinetic` | 化勁流 | 4 | 角色/無念者流派 |
| 16 | `Montage Test` | 蒙太奇考驗 | 4 | 規則/術語 |
| 17 | `Primordial Chaos` | 原初混沌 | 4 | 世界觀 |
| 18 | `Rhöl` | 羅爾 | 4 ⚠️ | 地名 |
| 19 | `Seven Cities of Hell` | 地獄七城 | 4 | 地名 |
| 20 | `Vanigar` | 華尼伽 | 4 | 地名 |
| 21 | `Variac` | 華里亞語 | 4 | 世界觀 |
| 22 | `Wall` | 障壁 | 4 ⚠️ | 規則/術語 |
| 23 | `Abyssal Waste` | 深淵荒境 | 3 | 地名 |
| 24 | `Aendrim` | 安德領 | 3 | 地名 |
| 25 | `Anjali` | 安賈利語 | 3 | 世界觀 |
| 26 | `Arcadia` | 阿卡迪亞 | 3 | 地名 |
| 27 | `Bedegar` | 貝德伽 | 3 | 地名 |
| 28 | `Buzz Balm` | 嗡嗡藥膏 | 3 | 冒險/德利安古墓 |
| 29 | `Great Wode` | 大幻林 | 3 | 地名 |
| 30 | `Grole the One-Handed` | 獨臂葛羅爾 | 3 | 神明 |
| 31 | `Hawklord` | 鷹王 | 3 ⚠️ | 世界觀 |
| 32 | `Heliopolis` | 太陽城 | 3 | 地名 |
| 33 | `Hyrallic` | 赫拉語 | 3 | 世界觀 |
| 34 | `Iridoss` | 虹石 | 3 ⚠️ | 物品 |
| 35 | `Kal Kalavar` | 卡爾·卡拉瓦 | 3 | 地名 |
| 36 | `Khelt` | 克特語 | 3 | 世界觀 |
| 37 | `Koursir` | 科爾瑟 | 3 | 地名 |
| 38 | `Mindspeech` | 心靈語 | 3 | 世界觀 |
| 39 | `Orchid Court` | 蘭花王庭 | 3 | 地名 |
| 40 | `Saint Llewellyn the Valiant` | 「英勇聖者」盧威凜 | 3 | 神明 |
| 41 | `Saxton` | 薩斯頓 | 3 | 人名 |
| 42 | `Shadow Elf` | 暗影精靈 | 3 | 生物 |
| 43 | `Snapdragon` | 金魚草 | 3 | 冒險/德利安古墓 |
| 44 | `Star Elf` | 星辰精靈 | 3 | 生物 |
| 45 | `Szetch` | 澤奇語 | 3 | 世界觀 |
| 46 | `The First Language` | 太古語 | 3 | 世界觀 |
| 47 | `Tor` | 托爾 | 3 ⚠️ | 地名 |
| 48 | `Troll` | 醜魔 | 3 ⚠️ | 生物 |
| 49 | `Vaslorian` | 華斯洛里亞語 | 3 | 世界觀 |
| 50 | `World Below` | 玄冥界 | 3 | 地名 |
| 51 | `Aan` | 安恩 | 2 ⚠️ | 神明 |
| 52 | `Alloy` | 合金城 | 2 | 地名 |
| 53 | `Alvaro` | 奧瓦羅 | 2 | 人名 |
| 54 | `Angulotl` | 昂蛙人 | 2 | 生物 |
| 55 | `Ardashir` | 亞達希爾 | 2 | 人名 |
| 56 | `Argument` | 論據 | 2 ⚠️ | 規則/術語 |
| 57 | `Axiomatic` | 公理語 | 2 | 世界觀 |
| 58 | `Body bank` | 軀體庫 | 2 | 世界觀 |
| 59 | `Caelian Empire` | 凱利安帝國 | 2 | 世界觀 |
| 60 | `Cyrvis the Lich` | 「巫妖之神」塞維斯 | 2 | 神明 |
| 61 | `Derwic` | 樹人 | 2 ⚠️ | 生物 |
| 62 | `Dryad` | 樹精 | 2 ⚠️ | 人名 |
| 63 | `Elder God` | 上古諸神 | 2 | 神明 |
| 64 | `Eseld of the Eye` | 「獨眼聖女」埃絲德 | 2 | 神明 |
| 65 | `Eth` | 伊斯 | 2 ⚠️ | 神明 |
| 66 | `Gryffyn the Stout` | 「剛毅聖者」格萊芬 | 2 | 神明 |
| 67 | `Gwenllian the Fell-Handed` | 「獵魔聖女」關莉安 | 2 | 神明 |
| 68 | `Higara` | 希伽拉 | 2 | 地名 |
| 69 | `Holkatya` | 霍卡提雅 | 2 | 神明 |
| 70 | `Irranys` | 伊蘭尼斯 | 2 | 地名 |
| 71 | `Jackson Bootblack` | 傑克森·黑靴 | 2 | 人名 |
| 72 | `Kalas Valiar` | 華黎城 | 2 | 地名 |
| 73 | `Khamish` | 卡米希語 | 2 | 世界觀 |
| 74 | `Khorsekef` | 科塞克夫 | 2 | 神明 |
| 75 | `Khoursirian` | 科爾瑟語 | 2 | 世界觀 |
| 76 | `Khravila Who Ran Forty Leagues` | 「百哩跑者」卡拉維拉 | 2 | 神明 |
| 77 | `Kuran’zoi` | 庫蘭佐伊 | 2 | 生物 |
| 78 | `Manticore` | 蠍獅 | 2 ⚠️ | 生物 |
| 79 | `Necropolitan Ruin` | 亡都遺跡 | 2 | 地名 |
| 80 | `Omund’s Land` | 歐蒙大陸 | 2 | 地名 |
| 81 | `Pentalion the Paladin` | 「威武聖者」潘塔利昂 | 2 | 神明 |
| 82 | `Phaedros` | 斐德羅 | 2 | 地名 |
| 83 | `Pitfall` | 地雷 | 2 ⚠️ | 規則/術語 |
| 84 | `Proto-Ctholl` | 原墮語 | 2 | 世界觀 |
| 85 | `Queen Imyrr` | 伊米爾女王 | 2 | 人名 |
| 86 | `Retainer` | 隨從 | 2 ⚠️ | 規則/追隨者 |
| 87 | `Sky Elf` | 天空精靈 | 2 | 生物 |
| 88 | `Substance of Creation` | 創生源質 | 2 | 世界觀 |
| 89 | `The Gol` | 戈爾 | 2 ⚠️ | 地名 |
| 90 | `Tholl` | 墮語 | 2 ⚠️ | 世界觀 |
| 91 | `Throne of Hell` | 地獄王座 | 2 | 世界觀 |
| 92 | `Trinket` | 飾品 | 2 ⚠️ | 規則/術語 |
| 93 | `Ullorvic` | 烏洛維克語 | 2 | 世界觀 |
| 94 | `Vaantikalisax` | 華恩提卡利薩斯 | 2 | 人名 |
| 95 | `Valak-koth the Seeker` | 「追尋者」華拉寇絲 | 2 | 神明 |
| 96 | `Valiar` | 華黎金 | 2 | 物品 |
| 97 | `Vastariax` | 華斯塔里亞語 | 2 | 世界觀 |
| 98 | `Velloparatha` | 維洛帕拉症 | 2 | 世界觀 |
| 99 | `Viras` | 薇拉斯 | 2 | 神明 |
| 100 | `Vitae` | 維泰 | 2 ⚠️ | 人名 |
| 101 | `Zarok the Law-Giver` | 「賜法者」札羅克 | 2 | 神明 |
| 102 | `A Lie Cloaked In Star’s Silver` | 披星戴銀的謊言 | 1 | 神明 |
| 103 | `Actian School` | 艾克提安學院 | 1 | 組織 |
| 104 | `Aerithyst` | 日光石 | 1 | 物品 |
| 105 | `Age of Chaos` | 混沌時代 | 1 | 世界觀 |
| 106 | `Ananjali` | 阿納賈利語 | 1 | 世界觀 |
| 107 | `Arbitros Fiat` | 財政仲裁所 | 1 | 組織 |
| 108 | `Archduke Dispater` | 狄斯帕特大公 | 1 | 人名 |
| 109 | `Area of Effect` | 效果區域 | 1 | 規則/術語 |
| 110 | `Army of Night` | 黑夜軍團 | 1 | 世界觀 |
| 111 | `Astragalus Court` | 星骨王庭 | 1 | 地名 |
| 112 | `Bale Sea` | 貝爾海 | 1 | 地名 |
| 113 | `Battle of Dur Mothe` | 杜爾·莫特 | 1 | 世界觀 |
| 114 | `Blackbottom` | 黑淵城 | 1 | 地名 |
| 115 | `Blade of Quintessence` | 極粹之刃 | 1 | 物品 |
| 116 | `Caswyn the Pestilent` | 「疫病聖者」卡斯溫 | 1 | 神明 |
| 117 | `Ceiling` | 天花板 | 1 | 規則/術語 |
| 118 | `Changeship` | 變形船 | 1 | 生物 |
| 119 | `Chimeron` | 嵌合魔 | 1 | 生物 |
| 120 | `Chrysopolis` | 金輝城 | 1 | 地名 |
| 121 | `Church of Saint Ysabella the Pitiless` | 無情聖女伊薩貝拉教會 | 1 | 組織 |
| 122 | `Cinis` | 辛尼絲 | 1 | 人名 |
| 123 | `Clock` | 命刻幫 | 1 | 組織 |
| 124 | `Codex Mortis` | 死亡法典 | 1 | 物品 |
| 125 | `Codex Pax` | 太平法典 | 1 | 世界觀 |
| 126 | `Costmary Leaf` | 香菊葉 | 1 | 物品 |
| 127 | `Cthrion Uroniziir` | 克斯里昂·烏洛尼齊爾 | 1 | 人名 |
| 128 | `Cult of Undoing` | 解構教 | 1 | 組織 |
| 129 | `Dalrath` | 道拉斯 | 1 | 冒險/德利安古墓 |
| 130 | `Dis` | 狄斯 | 1 ⚠️ | 地名 |
| 131 | `Duke Melianus` | 梅利亞努斯 | 1 | 人名 |
| 132 | `Eleven Who Shall Not Be Named` | 禁名十一者 | 1 | 世界觀 |
| 133 | `Equinox` | 幽暮界 | 1 | 地名 |
| 134 | `Every Strike of Lightning a Lover Betrayed` | 每道閃電皆是背叛之戀 | 1 | 神明 |
| 135 | `Far Mariners` | 遠航水手 | 1 | 組織 |
| 136 | `Farrier’s Guild` | 鐵匠公會 | 1 | 組織 |
| 137 | `Filliaric` | 菲利亞語 | 1 | 世界觀 |
| 138 | `First Psychic War` | 第一次靈能大戰 | 1 | 世界觀 |
| 139 | `Font` | 智泉社 | 1 | 組織 |
| 140 | `Fulcrum` | 樞衡會 | 1 | 組織 |
| 141 | `Gant` | 甘特 | 1 ⚠️ | 地名 |
| 142 | `Glauer` | 格勞爾 | 1 | 地名 |
| 143 | `Graid` | 格萊德 | 1 | 地名 |
| 144 | `Great Fire` | 大火災 | 1 | 世界觀 |
| 145 | `Great Tet` | 大帳塔 | 1 | 地名 |
| 146 | `Group Test` | 團隊考驗 | 1 | 規則/術語 |
| 147 | `Gruul` | 格魯 | 1 ⚠️ | 冒險/德利安古墓 |
| 148 | `Guide` | 指南 | 1 ⚠️ | 規則/術語 |
| 149 | `Halcyon the Moonmaiden` | 「月光少女」哈希恩 | 1 | 神明 |
| 150 | `Hanging City` | 懸吊城 | 1 | 地名 |
| 151 | `Helriath Harriers` | 赫里亞斯獵兵團 | 1 | 世界觀 |
| 152 | `Hexer` | 減益 | 1 ⚠️ | 規則/生物定位 |
| 153 | `Higaran` | 希伽拉語 | 1 | 世界觀 |
| 154 | `High Aerie` | 翔巢 | 1 ⚠️ | 地名 |
| 155 | `High City of Dalrath` | 道拉斯至高城 | 1 | 地名 |
| 156 | `High Kuric` | 高庫里語 | 1 | 世界觀 |
| 157 | `High Rhyvian` | 高瑞維亞語 | 1 | 世界觀 |
| 158 | `Imperial Navy` | 帝國海軍 | 1 | 組織 |
| 159 | `Imperial University` | 帝國大學 | 1 | 組織 |
| 160 | `Imperial War College` | 帝國戰爭學院 | 1 | 組織 |
| 161 | `Inān al-Adwiyya` | 伊南·艾維亞 | 1 | 人名 |
| 162 | `Ix` | 伊蘇島 | 1 | 地名 |
| 163 | `K.R.A.D.1 Fearless` | K.R.A.D.1 無畏號 | 1 | 世界觀 |
| 164 | `Kalas Mithral` | 祕銀城 | 1 | 地名 |
| 165 | `Kas Koriar` | 卡斯·科里亞 | 1 | 地名 |
| 166 | `Kashimir` | 卡希米爾 | 1 | 人名 |
| 167 | `Kethaic` | 克薩語 | 1 | 世界觀 |
| 168 | `Kheltivari` | 克提華里語 | 1 | 世界觀 |
| 169 | `Khorva` | 科瓦 | 1 ⚠️ | 人名 |
| 170 | `Kites` | 風箏使者 | 1 | 組織 |
| 171 | `Lady Filliamo` | 菲莉亞莫 | 1 | 人名 |
| 172 | `Law of Time` | 時間法則 | 1 | 世界觀 |
| 173 | `Lenore` | 蕾諾爾 | 1 | 人名 |
| 174 | `Lightbender` | 幻光獸 | 1 | 生物 |
| 175 | `Lilac Night` | 丁香之夜 | 1 | 世界觀 |
| 176 | `Lord of Swords` | 萬劍之王 | 1 | 世界觀 |
| 177 | `Low Kuric` | 低庫里語 | 1 | 世界觀 |
| 178 | `Lumbering Egress` | 裂界門獸 | 1 | 生物 |
| 179 | `Mandrake` | 曼德雷克 | 1 | 人名 |
| 180 | `Marco Vorona` | 馬可·沃羅納 | 1 | 人名 |
| 181 | `Maximo` | 麥希莫 | 1 | 人名 |
| 182 | `Mindkiller` | 弒腦者 | 1 | 生物 |
| 183 | `Morath of Many Tendrils` | 「萬鬚聖者」莫拉斯 | 1 | 神明 |
| 184 | `Morning Dew on a Single Leaf Like a Tear from the Sun` | 如陽淚般落在單葉上的晨露 | 1 | 人名 |
| 185 | `Mortum` | 莫圖姆 | 1 | 人名 |
| 186 | `Mynoth the Way` | 「道路之神」邁諾斯 | 1 | 神明 |
| 187 | `Myr` | 米爾山 | 1 | 地名 |
| 188 | `Navarr` | 納瓦爾 | 1 | 人名 |
| 189 | `Nebular the Star Mother` | 星母涅布拉 | 1 | 神明 |
| 190 | `Nikros the Tyrant` | 「暴政之神」尼克羅斯 | 1 | 神明 |
| 191 | `Nymph` | 水妖 | 1 ⚠️ | 生物 |
| 192 | `Oaxuatl` | 瓦蘇奧語 | 1 | 世界觀 |
| 193 | `Old Class Ring` | 老同學會 | 1 | 組織 |
| 194 | `Old Variac` | 古華里亞語 | 1 | 世界觀 |
| 195 | `Olothec` | 遠古蠕獸 | 1 | 生物 |
| 196 | `Olvaria` | 奧瓦里亞 | 1 | 地名 |
| 197 | `Omnivok` | 寰洛克 | 1 | 生物 |
| 198 | `Operator` | 機甲師 | 1 | 角色/範型 |
| 199 | `Opposed Power Roll` | 對抗檢定 | 1 | 規則/術語 |
| 200 | `Or-Mazaar City of the Black Star` | 奧瑪薩玄星城 | 1 | 地名 |
| 201 | `Order of Desolation` | 荒滅教團 | 1 | 組織 |
| 202 | `Order of Fabrication` | 機造教團 | 1 | 世界觀 |
| 203 | `Orsino` | 歐希諾 | 1 | 人名 |
| 204 | `Oxor-myr` | 歐索米爾火山 | 1 | 地名 |
| 205 | `Paperfeathers` | 紙羽者 | 1 | 組織 |
| 206 | `Phaedran` | 斐德羅語 | 1 | 世界觀 |
| 207 | `Phorialtic` | 佛里奧語 | 1 | 世界觀 |
| 208 | `Prospero` | 普羅斯佩羅 | 1 | 人名 |
| 209 | `Protean` | 萬化者 | 1 | 生物 |
| 210 | `Proteus` | 無常界 | 1 | 地名 |
| 211 | `Quasax the Ultra Nova` | 「究極新星」夸薩克斯 | 1 | 神明 |
| 212 | `Quercus Court` | 橡樹王庭 | 1 | 地名 |
| 213 | `Radenwight` | 齧裔 | 1 ⚠️ | 生物 |
| 214 | `Rallarian` | 拉拉里安語 | 1 | 世界觀 |
| 215 | `Reactive Test` | 被動考驗 | 1 | 規則/術語 |
| 216 | `Rioja` | 里歐哈 | 1 | 地名 |
| 217 | `Riojan` | 里歐哈語 | 1 | 世界觀 |
| 218 | `Saint Elspeth the Blithe` | 「歡喜聖女」埃思佩斯 | 1 | 神明 |
| 219 | `Salorna the Summer Storm` | 「夏日風暴」莎洛娜 | 1 | 神明 |
| 220 | `Sarah` | 莎拉 | 1 ⚠️ | 冒險/德利安古墓 |
| 221 | `Sărda` | 沙爾達 | 1 | 地名 |
| 222 | `Sea of Stars` | 浩瀚星海 | 1 | 地名 |
| 223 | `Sednia` | 塞德尼亞 | 1 | 地名 |
| 224 | `Sektahre the Boatman` | 「船夫」瑟克塔赫 | 1 | 神明 |
| 225 | `Shirome` | 希羅梅 | 1 | 人名 |
| 226 | `Soulraker` | 奪魂蜂 | 1 | 生物 |
| 227 | `Starmetal` | 星鐵 | 1 ⚠️ | 物品 |
| 228 | `Starskimmer` | 星梭 | 1 ⚠️ | 世界觀 |
| 229 | `Starslayers` | 屠星者 | 1 | 組織 |
| 230 | `Stone of Hyllc` | 赫利石 | 1 | 物品 |
| 231 | `Styrich` | 棘髮魔 | 1 | 生物 |
| 232 | `Taxiarch Lycaon` | 萊卡翁准將 | 1 | 人名 |
| 233 | `The Conversations` | 對話錄 | 1 | 世界觀 |
| 234 | `Thrazz` | 拉茲犬 | 1 | 生物 |
| 235 | `Three Sisters Below` | 玄冥三姊妹 | 1 | 神明 |
| 236 | `Trade Integrity Board` | 貿易誠信委員會 | 1 | 組織 |
| 237 | `Tull` | 圖爾 | 1 ⚠️ | 地名 |
| 238 | `Universal Solar League` | 同星聯盟 | 1 | 組織 |
| 239 | `Urollialic` | 巫羅語 | 1 | 世界觀 |
| 240 | `Uvalic` | 烏華利語 | 1 | 世界觀 |
| 241 | `Valetta` | 華勒塔 | 1 | 人名 |
| 242 | `Vaniric` | 華尼伽語 | 1 | 世界觀 |
| 243 | `Vhoric` | 沃里克語 | 1 | 世界觀 |
| 244 | `Vigbordh` | 威格博德 | 1 | 世界觀 |
| 245 | `Vithyaranu` | 維提亞拉努 | 1 | 人名 |
| 246 | `Vordokov` | 沃多科夫 | 1 | 人名 |
| 247 | `Vorona` | 沃羅納 | 1 | 人名 |
| 248 | `White Ravine` | 蒼白峽谷 | 1 | 地名 |
| 249 | `Za’hariax` | 札哈里亞語 | 1 | 世界觀 |
| 250 | `A Mist Curls Around Dying Embers` | 薄霧繚繞餘燼 | – | 人名 |
| 251 | `Abbott Loric` | 洛里克院長 | – | 冒險/德利安古墓 |
| 252 | `Aldiva` | 奧狄華 | – | 冒險/德利安古墓 |
| 253 | `Ambusher` | 伏兵 | – ⚠️ | 規則/生物定位 |
| 254 | `Amulet of the Delian Order` | 德利安教團護符 | – | 冒險/德利安古墓 |
| 255 | `Animapathy` | 御魂流 | – | 角色/異能者流派 |
| 256 | `Arixx` | 惡銳螯 | – | 生物 |
| 257 | `Arixx Nest` | 銳螯蟲巢穴 | – | 冒險/德利安古墓 |
| 258 | `Artillery` | 砲兵 | – ⚠️ | 規則/生物定位 |
| 259 | `Ashleigh` | 艾希莉 | – | 冒險/德利安古墓 |
| 260 | `Aurumvas` | 奧倫華斯 | – | 神明 |
| 261 | `Beastheart` | 獸魂師 | – | 角色/範型 |
| 262 | `Berrick` | 貝瑞克 | – | 冒險/德利安古墓 |
| 263 | `Blade of the Luxurious Fop` | 窮奢極侈之刃 | – | 冒險/德利安古墓 |
| 264 | `Bloodbound Band` | 血契戒指 | – | 冒險/德利安古墓 |
| 265 | `Boddorff Buckfeather` | 博多夫·鹿翎 | – | 冒險/德利安古墓 |
| 266 | `Broadhurst` | 寬林村 | – | 冒險/德利安古墓 |
| 267 | `Brune` | 布魯恩 | – | 冒險/德利安古墓 |
| 268 | `Castle Andreas` | 安德烈斯堡 | – | 冒險/德利安古墓 |
| 269 | `Ceredyn` | 樹靈 | – ⚠️ | 生物 |
| 270 | `Controller` | 控場 | – ⚠️ | 規則/生物定位 |
| 271 | `Coursers` | 奔行者 | – | 冒險/德利安古墓 |
| 272 | `Cressan Tomb` | 克雷桑古墓 | – | 冒險/德利安古墓 |
| 273 | `Cryokinesis` | 御霜流 | – | 角色/異能者流派 |
| 274 | `Cup of Iulius` | 尤利烏斯聖杯 | – | 冒險/德利安古墓 |
| 275 | `Defender` | 肉盾 | – ⚠️ | 規則/生物定位 |
| 276 | `Delian Knight Commander’s Ring` | 德利安騎將戒指 | – | 冒險/德利安古墓 |
| 277 | `Delian Tomb` | 德利安古墓 | – | 冒險/德利安古墓 |
| 278 | `Dreamleaf` | 夢葉 | – ⚠️ | 世界觀 |
| 279 | `Dunquat` | 鄧卡特 | – | 冒險/德利安古墓 |
| 280 | `Ellery` | 埃樂莉 | – | 冒險/德利安古墓 |
| 281 | `Farrow` | 法羅 | – ⚠️ | 地名 |
| 282 | `Foesense Lenses` | 通敵眼鏡 | – | 冒險/德利安古墓 |
| 283 | `Forbin` | 佛賓 | – ⚠️ | 冒險/德利安古墓 |
| 284 | `Forg` | 佛格 | – ⚠️ | 冒險/德利安古墓 |
| 285 | `Forsaken Wraiths` | 遺世怨靈 | – | 冒險/德利安古墓 |
| 286 | `Fort Forsaken` | 遺世堡壘 | – | 冒險/德利安古墓 |
| 287 | `Gilded Hand` | 鍍金之手 | – | 冒險/德利安古墓 |
| 288 | `Gorek` | 葛雷克 | – | 冒險/德利安古墓 |
| 289 | `Granite Mountains` | 花崗山脈 | – | 冒險/德利安古墓 |
| 290 | `Grivllyfyr` | 古黎菲爾 | – | 世界觀 |
| 291 | `Gweldyr` | 桂迪爾 | – | 冒險/德利安古墓 |
| 292 | `Hakaan` | 哈肯族 | – | 規則/族裔 |
| 293 | `Harim` | 哈里姆 | – | 冒險/德利安古墓 |
| 294 | `Harrier` | 騷擾 | – ⚠️ | 規則/生物定位 |
| 295 | `Horde` | 散兵 | – ⚠️ | 規則/生物組織 |
| 296 | `Illwyth` | 伊薇絲 | – | 冒險/德利安古墓 |
| 297 | `Illyvric` | 伊利瑞語 | – | 世界觀 |
| 298 | `Jagged Edge` | 鋸刃族 | – | 冒險/德利安古墓 |
| 299 | `Khemhara` | 克姆哈拉 | – | 地名 |
| 300 | `Khemharic` | 克姆哈拉語 | – | 世界觀 |
| 301 | `Khorvath Who Slew A Thousand` | 「屠千者」科沃絲 | – | 神明 |
| 302 | `Kora` | 柯菈 | – ⚠️ | 冒險/德利安古墓 |
| 303 | `Laesi` | 蕾希 | – ⚠️ | 冒險/德利安古墓 |
| 304 | `Lord Kenway` | 肯威領主 | – | 冒險/德利安古墓 |
| 305 | `Mage Tower` | 魔導師塔 | – | 冒險/德利安古墓 |
| 306 | `Mara` | 瑪拉 | – ⚠️ | 冒險/德利安古墓 |
| 307 | `Memonek` | 梅莫族 | – | 規則/族裔 |
| 308 | `Metamorphosis` | 蛻形流 | – | 角色/異能者流派 |
| 309 | `Mikael` | 米凱爾 | – | 冒險/德利安古墓 |
| 310 | `Mohler` | 魔獠豬 | – | 生物 |
| 311 | `Moon Elf` | 月精靈 | – | 生物 |
| 312 | `Multivok` | 多洛克 | – | 生物 |
| 313 | `Murkik` | 莫奇克 | – | 冒險/德利安古墓 |
| 314 | `Oleq` | 歐列 | – ⚠️ | 冒險/德利安古墓 |
| 315 | `Orson` | 歐森 | – ⚠️ | 冒險/德利安古墓 |
| 316 | `Percival` | 波希瓦爾 | – | 冒險/德利安古墓 |
| 317 | `Platoon` | 正兵 | – ⚠️ | 規則/生物組織 |
| 318 | `Project Event` | 專案事件 | – | 規則/術語 |
| 319 | `Pyrokinesis` | 御焰流 | – | 角色/異能者流派 |
| 320 | `Quantum Satchel` | 量子背包 | – | 冒險/德利安古墓 |
| 321 | `Queen Bargnot` | 巴格諾女王 | – | 冒險/德利安古墓 |
| 322 | `Raider's Awe` | 氣勢突擊 | – | 規則/招式 |
| 323 | `Reeve Rosamund` | 蘿莎蒙村長 | – | 冒險/德利安古墓 |
| 324 | `Resopathy` | 御質流 | – | 角色/異能者流派 |
| 325 | `Robin` | 羅賓 | – ⚠️ | 冒險/德利安古墓 |
| 326 | `Saberna` | 莎柏娜 | – | 冒險/德利安古墓 |
| 327 | `Saera` | 薩伊菈 | – | 冒險/德利安古墓 |
| 328 | `Saint Gwiddon the Vigilant` | 「警戒聖者」格威頓 | – | 神明 |
| 329 | `Servok` | 勞洛克 | – | 生物 |
| 330 | `Silver Wood` | 白銀森林 | – | 冒險/德利安古墓 |
| 331 | `Skewra` | 斯凱菈 | – | 冒險/德利安古墓 |
| 332 | `Solta` | 索塔村 | – | 冒險 |
| 333 | `Sun Elf` | 日精靈 | – | 生物 |
| 334 | `Tansy` | 譚希 | – ⚠️ | 冒險/德利安古墓 |
| 335 | `Targon` | 塔岡 | – ⚠️ | 冒險/德利安古墓 |
| 336 | `Thurston` | 瑟斯頓 | – | 冒險/德利安古墓 |
| 337 | `Tower of Translation` | 翻譯塔 | – | 地名 |
| 338 | `Tubert` | 圖貝特 | – | 冒險/德利安古墓 |
| 339 | `Unbinder Boots` | 無縛之靴 | – | 冒險/德利安古墓 |
| 340 | `Untyped Damage` | 無類傷害 | – | 規則/術語 |
| 341 | `Vaughn` | 范恩 | – ⚠️ | 冒險/德利安古墓 |
| 342 | `Violet` | 薇歐蕾 | – | 冒險/德利安古墓 |
| 343 | `Vorgosh` | 沃格許 | – | 冒險/德利安古墓 |
| 344 | `Vurkor` | 弗科爾 | – | 冒險/德利安古墓 |
| 345 | `Wend` | 溫德鎮 | – | 冒險/德利安古墓 |
| 346 | `Wof Den` | 狼穴 | – ⚠️ | 冒險/德利安古墓 |
| 347 | `Yerris` | 葉里斯 | – | 冒險/德利安古墓 |

</details>

---

## 統計

| | 數量 |
|---|---|
| 待裁決總數 | 347 |
| A 段（M0 必要） | 2 |
| B 段（高頻非 M0） | 2 |
| C 段（低頻） | 343 |
| 語料檔案數 | 932（其中 M0 相關 64） |

> 狀態（Bleeding 等 9 個）不在此清單——其中文名由實體負責（`entityRef`），於正典抽取時一併確認。

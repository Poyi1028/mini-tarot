# HomeScreen 設計 QA

- source visual truth path: `C:\Users\jason\.codex\generated_images\019f238b-c8d1-7bf0-89f8-e150ee74a560\call_jGjI9qh9rOuvG9KzlVLbzyEc.png`
- implementation screenshot path: `C:\Users\jason\.codex\generated_images\019f238b-c8d1-7bf0-89f8-e150ee74a560\mini-tarot-home-implementation-390x844.png`
- viewport: `390 × 844`
- state: 首頁、每日牌尚未翻開

## Full-view comparison evidence

設計稿與實作已在同一比較輸入中檢視。兩者皆以每日牌作為中央主視覺，依序呈現標題／日期、牌面、翻牌提示、次要引言與底部導覽。實作刻意保留現有 PWA 較克制的留白、既有 `NightSky` 星座層、真實 `card-back.png` 與既有導覽元件，不複製設計稿中額外生成的裝飾資產。

## Focused region comparison evidence

未另外裁切局部圖：390 × 844 全畫面已可清楚判讀標題、日期、牌面邊緣、翻牌提示、引言與兩個底部入口；牌背與牌庫圖示直接使用專案原始資產，沒有替代圖或重製造成的細節差異。

## Findings

- 無 P0／P1／P2 問題。
- 字體與排版：沿用 Cormorant Garamond／Noto Serif TC；標題、日期、指示文字與頁尾導覽形成清楚的五層階序。
- 間距與節奏：184 × 323 的每日牌在 390 × 844 與 375 × 667 均完整顯示；小螢幕沒有捲動或底部裁切。
- 色彩與 token：只使用既有 ink、gold、parchment、muted、lilac token，對比與品牌一致。
- 圖像品質：牌背、牌面與牌庫圖示均使用專案既有高品質資產，比例正確，無裁切、替代圖或壓縮失真。
- 文案：每日牌提示、持久化說明、牌名／逆位狀態與入口名稱均為繁體中文，互動狀態一致。
- 互動：已驗證首次翻牌、翻牌後牌名／逆位顯示，以及開啟沉浸式牌義詳情。

## Patches made since previous QA pass

- 每日牌由 168 × 295 再放大為 184 × 323，強化第一眼主視覺。
- 修正無障礙標題原本可能可見的問題，避免畫面重複出現「今日運勢」。
- 將頂部間距改為穩定的 24px inline 值，確保不同 viewport 一致套用。

## Follow-up polish

- P3：若要更接近概念稿，可再增加中央牌面的柔和光暈；目前版本選擇保留既有、較安靜的 PWA 視覺語言。

final result: passed

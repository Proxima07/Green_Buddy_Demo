# 套件、字型與來源

本版沒有使用 npm／Node 建置流程；套件為固定版本的瀏覽器版本。執行只需靜態檔案伺服器。

| 套件 | 固定版本 | 用途 | 官方文件 |
|---|---|---|---|
| Chart.js | 4.4.8 | 植物／環境曲線、理想範圍帶 | [Integration](https://www.chartjs.org/docs/latest/getting-started/integration.html) |
| Swiper | 11.2.6 | 歡迎頁與推薦卡片輪播 | [Getting started](https://swiperjs.com/get-started) |
| SweetAlert2 | 11.17.2 | 確認、邀請、建立花圃、錯誤與提示 | [官方網站](https://sweetalert2.github.io/) |
| canvas-confetti | 1.9.3 | 完成照護、綁定、建檔與造型的彩帶 | [官方原始碼與文件](https://github.com/catdad/canvas-confetti) |
| Phosphor Icons web | 2.1.2 | 全站 duotone 圖示 | [官方原始碼與文件](https://github.com/phosphor-icons/web) |

CDN URLs 位於 `js/vendor-loader.js`，全部指定完整版本。圖示與 Swiper CSS 採本機載入，避免缺字或空白排版；JS 先試 CDN，失敗改用 `assets/vendor/` 的對應版本。`assets=local` 可直接走本機備份。套件授權保留在同資料夾。

## 字型

- [jf open 粉圓](https://github.com/justfont/open-huninn-font)：使用 2.0 版，SIL OFL 1.1；TTF 由 npm `@fontpkg/jf-openhuninn-2-0@2.0.0` 中的字型取得，轉封裝為 WOFF2，沒有修改字形。字型來源、名稱與版權可從檔案 name table 對照。OFL 文字隨附於 `assets/fonts/Huninn-OFL.txt`。
- [Noto Sans TC](https://github.com/notofonts/noto-cjk)：使用 `@fontsource/noto-sans-tc@5.2.5` 的 400 權重 WOFF2 分段，做簡潔模式與缺字備援。授權在 `assets/fonts/NotoTC-OFL.txt`。字型 CSS 只調整家族別名及相對載入路徑。
- 不依賴 Google Fonts 即時連線。600／700 字重由瀏覽器合成，未再增加大型字型檔案。

## 插圖與動畫

植物角色依使用者指定，以原創 SVG 產生器建立，可控制品種、表情與配件。沒有使用來源不明的 Lottie 或付費圖庫素材。CSS 處理待機、眨眼、掃描與跳舞動畫；遵守瀏覽器的 `prefers-reduced-motion` 設定。

## 植物示範資料

感測器數值、理想範圍與角色情境依原始規劃建立；推薦適合度是展示用規則，並非模型驗證結果。

寵物友善示範組選用圓葉椒草（Peperomia obtusifolia）與袖珍椰子（Chamaedorea elegans），其 ASPCA 條目列為對貓狗無毒：

- [American Rubber Plant — ASPCA](https://www.aspca.org/pet-care/aspca-poison-control/toxic-and-non-toxic-plants/american-rubber-plant)
- [Parlor Palm — ASPCA](https://www.aspca.org/pet-care/aspca-poison-control/toxic-and-non-toxic-plants/parlor-palm)

介面仍提醒避免寵物啃食；「多肉」不預設為寵物友善，因為需要依具體品種確認。

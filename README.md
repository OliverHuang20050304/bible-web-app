# 純淨聖經閱讀器 · Pure Bible Reader

繁體中文／英文聖經網頁閱讀器：支援完整 66 卷、章節切換、字體縮放、日夜模式、多種配色、關鍵字搜尋，以及記住上次閱讀位置（手機友善）。

A clean, mobile-friendly Bible reader supporting Traditional Chinese (CUV) and English (KJV). Features full 66-book navigation, font scaling, dark/light mode, colour themes, keyword search, and reading progress memory.

---

## 立即使用 · Live Demo

🔗 <https://oliverhuang20050304.github.io/bible-web-app/>

---

## 支援 PWA · PWA Support

在 iPhone 或 Android 瀏覽器中點「加入主畫面」→「安裝成應用程式」，即可當一般 App 使用。

On iPhone or Android, tap **Add to Home Screen → Install** in your browser to use it as a native-like app.

---

## 功能 · Features

| 功能 | Feature |
|------|---------|
| 完整聖經 66 卷，章節下拉切換 | Full 66-book navigation with chapter selector |
| 上一章 / 下一章快速翻頁 | Prev / Next chapter buttons |
| 中文（和合本）/ 英文（KJV）譯本切換 | Switch between Chinese (CUV) and English (KJV) |
| A+ / A- 字體大小調整 | Font size scaling |
| 日 / 夜模式切換 | Light / Dark mode |
| 6 種配色主題 | 6 colour palettes |
| 關鍵字搜尋，可一鍵跳到該章 | Keyword search with jump-to-chapter |
| 自動記住閱讀位置，「回到上次」一鍵還原 | Auto-saves reading position with one-tap resume |

---

## 本機預覽 · Local Preview

```bash
cd bible-app
python3 -m http.server 8080
# open http://127.0.0.1:8080/
```

---

## 專案結構 · Project Structure

| 檔案 | 說明 |
|------|------|
| `index.html` | 頁面結構 · Page structure |
| `style.css` | 樣式、主題 · Styles & themes |
| `app.js` | 邏輯、API、設定 · Logic, API calls, settings |
| `data.js` | 66 卷 metadata（書名、章數、縮寫）· Book metadata |

---

## 注意事項 · Notes

- 經文內容需 **網路連線**，透過 [信望愛聖經 API](https://bible.fhl.net/api/) 載入，請遵守其版權說明。
- Scripture content is loaded online via the [FHL Bible API](https://bible.fhl.net/api/). Please respect their copyright terms.
- 閱讀進度存於瀏覽器 **localStorage**，換裝置或清除網站資料後需重新累積。
- Reading progress is stored in browser **localStorage** and will reset if site data is cleared.

---

## 授權 · License

程式碼部分依本 repo 授權條款使用；聖經經文內容之著作權歸原譯本與提供單位所有。

Code is available under this repo's licence. Bible text copyright belongs to the respective translators and publishers.

# 純淨聖經閱讀器

繁體中文聖經網頁閱讀器：支援完整 66 卷、章節切換、字體縮放、日夜模式、關鍵字搜尋，以及記住上次閱讀位置（手機友善）。

## 功能

- **完整聖經**：66 卷書卷與各卷章數；經文透過 [信望愛聖經 JSON API](https://bible.fhl.net/api/) 線上載入（和合本 `unv`）。
- **章節導覽**：書卷／章節下拉選單、上一章／下一章。
- **字體與主題**：`A+`／`A-` 調整字體、`日／夜` 切換。
- **快速搜尋**：輸入關鍵字搜尋經文，結果可一鍵跳到該章。
- **閱讀進度**：自動儲存書卷、章節與捲動位置；`回到上次` 可立即還原。

## 本機預覽

在專案目錄用任一靜態伺服器即可（避免 `file://` 直接開檔，部分瀏覽器對 `fetch` 較嚴格）：

```bash
cd bible-app
python3 -m http.server 8080
```

瀏覽器開啟：<http://127.0.0.1:8080/>

## 專案結構

| 檔案 | 說明 |
|------|------|
| `index.html` | 頁面結構 |
| `style.css` | 樣式（含手機版） |
| `app.js` | 載入經文、搜尋、儲存設定 |
| `data.js` | 66 卷 metadata 與 API 基底網址 |

## 部署到 GitHub Pages

1. 將此 repo 推送到 GitHub（見下方）。
2. 在 GitHub 上：**Settings → Pages**。
3. **Build and deployment**：Source 選 **Deploy from a branch**，Branch 選 **`main`**，資料夾選 **`/ (root)`**。
4. 儲存後約 1～3 分鐘，網址通常為：  
   `https://<你的使用者名稱>.github.io/<repo 名稱>/`

### 更新會自動套用到 GitHub Pages 嗎？

**會。** 只要 Pages 是「從 `main` 分支的根目錄部署」，你每次 `git push` 到 `main` 後，GitHub 會自動重新建置並發布；一般 **1～10 分鐘** 內網站會更新。若沒變，可強制重新整理（Ctrl+F5）或等一會再試。

## 部署到 Vercel（選用）

1. 用 GitHub 登入 [Vercel](https://vercel.com/)，**Import** 此 repo。
2. Framework 選 **Other** 即可（純靜態）。
3. Deploy 完成後會得到 `*.vercel.app` 網址；之後每次 push 到預設分支也會自動部署。

## 注意事項

- 經文與搜尋需 **網路連線**；API 與版權請遵守 [信望愛站說明](https://bible.fhl.net/api/)。
- 閱讀進度存在瀏覽器 **localStorage**，換裝置或清除網站資料後需重新累積。

## 授權

本專案程式碼可依你 repo 設定的授權條款使用；聖經經文內容之權利歸原譯本與提供單位所有。

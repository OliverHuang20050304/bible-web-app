// 新增一個簡單的聖經閱讀應用程式
// 包含字體大小調整、白天/黑暗模式切換、記憶功能

// HTML 結構
const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>聖經閱讀</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="app">
        <header>
            <h1>聖經閱讀</h1>
            <button id="toggle-theme">切換模式</button>
        </header>
        <main>
            <textarea id="bible-text" rows="10">這裡是聖經內容...</textarea>
        </main>
        <footer>
            <label for="font-size">字體大小：</label>
            <input type="range" id="font-size" min="16" max="48" value="16">
        </footer>
    </div>
    <script src="script.js"></script>
</body>
</html>
`;

// CSS 樣式
const cssContent = `
body {
    margin: 0;
    font-family: Arial, sans-serif;
    transition: background-color 0.3s, color 0.3s;
}

body.light {
    background-color: #ffffff;
    color: #000000;
}

body.dark {
    background-color: #000000;
    color: #ffffff;
}

.app {
    display: flex;
    flex-direction: column;
    height: 100vh;
}

header, footer {
    padding: 1rem;
    background-color: #f0f0f0;
}

main {
    flex: 1;
    padding: 1rem;
}

textarea {
    width: 100%;
    height: 100%;
    font-size: 16px;
}
`;

// JavaScript 功能
const jsContent = `
// 切換白天/黑暗模式
const toggleThemeButton = document.getElementById('toggle-theme');
const fontSizeInput = document.getElementById('font-size');
const bibleText = document.getElementById('bible-text');

// 初始化
function init() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedFontSize = localStorage.getItem('fontSize') || '16';
    const savedText = localStorage.getItem('bibleText') || '';

    document.body.className = savedTheme;
    fontSizeInput.value = savedFontSize;
    bibleText.style.fontSize = `${savedFontSize}px`;
    bibleText.value = savedText;
}

// 切換模式
function toggleTheme() {
    const currentTheme = document.body.className;
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.body.className = newTheme;
    localStorage.setItem('theme', newTheme);
}

// 調整字體大小
function adjustFontSize() {
    const newSize = fontSizeInput.value;
    bibleText.style.fontSize = `${newSize}px`;
    localStorage.setItem('fontSize', newSize);
}

// 保存內容
function saveText() {
    localStorage.setItem('bibleText', bibleText.value);
}

// 事件監聽
fontSizeInput.addEventListener('input', adjustFontSize);
bibleText.addEventListener('input', saveText);
toggleThemeButton.addEventListener('click', toggleTheme);

// 初始化應用
init();
`;

// 將內容寫入檔案
const fs = require('fs');
const path = require('path');

const testFolder = path.join(__dirname, 'test');
if (!fs.existsSync(testFolder)) {
    fs.mkdirSync(testFolder);
}

fs.writeFileSync(path.join(testFolder, 'index.html'), htmlContent);
fs.writeFileSync(path.join(testFolder, 'style.css'), cssContent);
fs.writeFileSync(path.join(testFolder, 'script.js'), jsContent);

const VALID_PALETTES = ["default", "wine", "teal", "amber", "violet", "forest"];
const VALID_VERSIONS = ["unv", "kjv"];
const DEFAULT_VERSION = "unv";

const BibleApp = {
    storageKey: "bibleAppState_v7",
    state: {
        theme: "light",
        palette: "default",
        version: DEFAULT_VERSION,
        fontSize: 18,
        lastRead: {
            bid: 1,
            chapter: 1,
            scrollPosition: 0
        },
        resumePoint: {
            bid: 1,
            chapter: 1,
            scrollPosition: 0
        }
    },
    activeRequestId: 0,

    init() {
        this.loadSettings();
        this.ensureValidState();
        this.renderSelectors();
        this.bindEvents();
        this.applySettings();
        this.loadChapter();
    },

    loadSettings() {
        try {
            let savedData = localStorage.getItem(this.storageKey);
            if (!savedData) {
                const legacyKeys = ["bibleAppState_v5", "bibleAppState_v4"];
                for (const legacyKey of legacyKeys) {
                    const legacyData = localStorage.getItem(legacyKey);
                    if (!legacyData) continue;
                    savedData = legacyData;
                    try {
                        localStorage.setItem(this.storageKey, legacyData);
                    } catch {
                        /* ignore quota */
                    }
                    break;
                }
            }
            if (!savedData) return;
            const parsed = JSON.parse(savedData);
            this.state = {
                ...this.state,
                ...parsed,
                lastRead: { ...this.state.lastRead, ...parsed.lastRead },
                resumePoint: { ...this.state.resumePoint, ...parsed.resumePoint }
            };
            if (!VALID_PALETTES.includes(this.state.palette)) {
                this.state.palette = "default";
            }
            if (!VALID_VERSIONS.includes(this.state.version)) {
                this.state.version = DEFAULT_VERSION;
            }
        } catch (error) {
            console.error("讀取設定失敗:", error);
        }
    },

    saveSettings() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    },

    bindEvents() {
        const bookSelect = document.getElementById("book-select");
        const chapterSelect = document.getElementById("chapter-select");
        const versionSelect = document.getElementById("version-select");
        const btnSearch = document.getElementById("btn-search");
        const searchInput = document.getElementById("search-input");

        document.getElementById("btn-theme")?.addEventListener("click", () => this.toggleTheme());
        document.getElementById("btn-font-plus")?.addEventListener("click", () => this.changeFontSize(2));
        document.getElementById("btn-font-minus")?.addEventListener("click", () => this.changeFontSize(-2));
        document.getElementById("btn-prev-chapter")?.addEventListener("click", () => this.goChapter(-1));
        document.getElementById("btn-next-chapter")?.addEventListener("click", () => this.goChapter(1));
        document.getElementById("btn-resume")?.addEventListener("click", () => this.resumeReading());

        document.getElementById("palette-select")?.addEventListener("change", (event) => {
            this.setPalette(event.target.value);
        });
        versionSelect?.addEventListener("change", (event) => {
            this.setVersion(event.target.value);
        });

        bookSelect?.addEventListener("change", (event) => {
            this.selectBook(Number(event.target.value));
        });
        chapterSelect?.addEventListener("change", (event) => {
            this.selectChapter(Number(event.target.value));
        });

        btnSearch?.addEventListener("click", () => this.searchVerses());
        searchInput?.addEventListener("keydown", (event) => {
            if (event.key === "Enter") this.searchVerses();
        });

        let scrollTimeout;
        window.addEventListener("scroll", () => {
            if (scrollTimeout) window.cancelAnimationFrame(scrollTimeout);
            scrollTimeout = window.requestAnimationFrame(() => {
                this.state.lastRead.scrollPosition = window.scrollY;
                this.state.resumePoint = { ...this.state.lastRead };
                this.saveSettings();
            });
        });
    },

    ensureValidState() {
        const validBids = new Set(bibleMeta.map((book) => book.bid));
        if (!validBids.has(Number(this.state.lastRead.bid))) this.state.lastRead.bid = 1;

        const selectedBook = this.getBookByBid(this.state.lastRead.bid);
        if (!selectedBook) this.state.lastRead.bid = 1;
        const maxChapter = this.getBookByBid(this.state.lastRead.bid)?.chapters ?? 1;
        this.state.lastRead.chapter = Math.min(maxChapter, Math.max(1, Number(this.state.lastRead.chapter) || 1));
        this.state.lastRead.scrollPosition = Number(this.state.lastRead.scrollPosition) || 0;

        if (!validBids.has(Number(this.state.resumePoint.bid))) {
            this.state.resumePoint = { ...this.state.lastRead };
        }

        if (!VALID_PALETTES.includes(this.state.palette)) {
            this.state.palette = "default";
        }
        if (!VALID_VERSIONS.includes(this.state.version)) {
            this.state.version = DEFAULT_VERSION;
        }
    },

    renderSelectors() {
        const bookSelect = document.getElementById("book-select");
        if (!bookSelect) return;
        bookSelect.innerHTML = "";
        bibleMeta.forEach((book) => {
            const option = document.createElement("option");
            option.value = String(book.bid);
            option.textContent = book.name;
            option.selected = book.bid === this.state.lastRead.bid;
            bookSelect.appendChild(option);
        });
        this.updateChapterSelector();
    },

    updateChapterSelector() {
        const chapterSelect = document.getElementById("chapter-select");
        if (!chapterSelect) return;
        const selectedBook = this.getBookByBid(this.state.lastRead.bid);
        if (!selectedBook) return;

        chapterSelect.innerHTML = "";
        for (let chapter = 1; chapter <= selectedBook.chapters; chapter += 1) {
            const option = document.createElement("option");
            option.value = String(chapter);
            option.textContent = `第 ${chapter} 章`;
            option.selected = chapter === this.state.lastRead.chapter;
            chapterSelect.appendChild(option);
        }
    },

    applySettings() {
        document.documentElement.setAttribute("data-theme", this.state.theme);
        document.documentElement.setAttribute("data-palette", this.state.palette || "default");
        document.documentElement.style.setProperty("--base-font-size", `${this.state.fontSize}px`);
        const paletteSelect = document.getElementById("palette-select");
        if (paletteSelect) paletteSelect.value = this.state.palette || "default";
        const versionSelect = document.getElementById("version-select");
        if (versionSelect) versionSelect.value = this.state.version || DEFAULT_VERSION;
    },

    setPalette(palette) {
        if (!VALID_PALETTES.includes(palette)) return;
        this.state.palette = palette;
        this.applySettings();
        this.saveSettings();
    },

    setVersion(version) {
        if (!VALID_VERSIONS.includes(version)) return;
        this.state.version = version;
        this.applySettings();
        this.saveSettings();
        this.loadChapter(false);
    },

    toggleTheme() {
        this.state.theme = this.state.theme === "light" ? "dark" : "light";
        this.applySettings();
        this.saveSettings();
    },

    changeFontSize(step) {
        this.state.fontSize = Math.min(36, Math.max(14, this.state.fontSize + step));
        this.applySettings();
        this.saveSettings();
    },

    async loadChapter(restoreScroll = true) {
        const requestId = ++this.activeRequestId;
        const selectedBook = this.getBookByBid(this.state.lastRead.bid);
        const chapter = this.state.lastRead.chapter;
        const chapterTitle = document.getElementById("chapter-title");
        const versesContainer = document.getElementById("verses");

        if (!selectedBook || !chapterTitle || !versesContainer) return;
        const isEnglish = (this.state.version || DEFAULT_VERSION) === "kjv";
        const titleText = isEnglish
            ? `${selectedBook.engName} Chapter ${chapter}`
            : `${selectedBook.name} 第 ${chapter} 章`;
        chapterTitle.textContent = titleText;
        versesContainer.innerHTML = "<p>載入中...</p>";

        try {
            const version = this.state.version || DEFAULT_VERSION;
            const url = `${BIBLE_API_BASE}/qb.php?chineses=${encodeURIComponent(selectedBook.abbr)}&chap=${encodeURIComponent(chapter)}&gb=0&version=${encodeURIComponent(version)}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            if (requestId !== this.activeRequestId) return;
            const records = Array.isArray(data.record) ? data.record : [];
            if (records.length === 0) throw new Error("查無章節內容");
            this.renderVerses(records);
            if (restoreScroll) {
                this.restoreScrollPosition();
            } else {
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        } catch (error) {
            versesContainer.innerHTML = "<p style=\"color:red;\">載入失敗，請檢查網路或稍後再試。</p>";
            console.error("章節載入失敗:", error);
        }
    },

    renderVerses(records) {
        const versesContainer = document.getElementById("verses");
        if (!versesContainer) return;
        versesContainer.innerHTML = "";
        const fragment = document.createDocumentFragment();
        records.forEach((verse) => {
            const paragraph = document.createElement("p");
            const verseNum = document.createElement("span");
            verseNum.className = "verse-num";
            verseNum.textContent = verse.sec;
            paragraph.appendChild(verseNum);
            paragraph.appendChild(document.createTextNode(` ${verse.bible_text}`));
            fragment.appendChild(paragraph);
        });
        versesContainer.appendChild(fragment);
    },

    async searchVerses() {
        const input = document.getElementById("search-input");
        const keyword = input?.value.trim();
        const resultBox = document.getElementById("search-results");
        if (!resultBox) return;

        if (!keyword) {
            resultBox.classList.remove("hidden");
            resultBox.innerHTML = "<p>請先輸入搜尋關鍵字。</p>";
            return;
        }

        resultBox.classList.remove("hidden");
        resultBox.innerHTML = "<p>搜尋中...</p>";

        try {
            const version = this.state.version || DEFAULT_VERSION;
            const url = `${BIBLE_API_BASE}/se.php?VERSION=${encodeURIComponent(version)}&orig=0&q=${encodeURIComponent(keyword)}&RANGE=0&limit=30&offset=0&gb=0`;
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            const records = Array.isArray(data.record) ? data.record : [];
            this.renderSearchResults(records, keyword);
        } catch (error) {
            resultBox.innerHTML = "<p style=\"color:red;\">搜尋失敗，請稍後再試。</p>";
            console.error("搜尋失敗:", error);
        }
    },

    renderSearchResults(records, keyword) {
        const resultBox = document.getElementById("search-results");
        if (!resultBox) return;

        if (records.length === 0) {
            resultBox.innerHTML = `<p>找不到「${keyword}」相關經文。</p>`;
            return;
        }

        resultBox.innerHTML = `<p>找到 ${records.length} 筆結果：</p>`;
        const fragment = document.createDocumentFragment();
        records.forEach((item) => {
            const row = document.createElement("div");
            row.className = "search-item";
            const bookByBid = this.getBookByBid(item.bid);
            const fullBookName = bookByBid?.name ?? this.getBookNameByAbbr(item.chineses);
            row.innerHTML = `
                <span class="search-ref">${fullBookName} ${item.chap}:${item.sec}</span>
                <span>${item.bible_text}</span>
                <div class="search-jump">
                    <button data-bid="${item.bid}" data-chapter="${item.chap}">跳到這章</button>
                </div>
            `;
            fragment.appendChild(row);
        });
        resultBox.appendChild(fragment);

        resultBox.querySelectorAll("button[data-bid]").forEach((button) => {
            button.addEventListener("click", () => {
                const bid = Number(button.getAttribute("data-bid"));
                const chapter = Number(button.getAttribute("data-chapter"));
                const book = this.getBookByBid(bid);
                if (!book) return;
                this.state.lastRead.bid = book.bid;
                this.state.lastRead.chapter = chapter;
                this.state.lastRead.scrollPosition = 0;
                this.state.resumePoint = { ...this.state.lastRead };
                this.updateSelectorsValue();
                this.saveSettings();
                this.loadChapter(false);
            });
        });
    },

    selectBook(bid) {
        const book = this.getBookByBid(bid);
        if (!book) return;
        this.state.lastRead.bid = bid;
        this.state.lastRead.chapter = 1;
        this.state.lastRead.scrollPosition = 0;
        this.state.resumePoint = { ...this.state.lastRead };
        this.updateChapterSelector();
        this.saveSettings();
        this.loadChapter(false);
    },

    selectChapter(chapter) {
        const book = this.getBookByBid(this.state.lastRead.bid);
        if (!book) return;
        const validChapter = Math.min(book.chapters, Math.max(1, chapter));
        this.state.lastRead.chapter = validChapter;
        this.state.lastRead.scrollPosition = 0;
        this.state.resumePoint = { ...this.state.lastRead };
        this.saveSettings();
        this.loadChapter(false);
    },

    goChapter(step) {
        const book = this.getBookByBid(this.state.lastRead.bid);
        if (!book) return;
        const nextChapter = this.state.lastRead.chapter + step;
        if (nextChapter < 1 || nextChapter > book.chapters) return;
        this.selectChapter(nextChapter);
    },

    resumeReading() {
        this.state.lastRead = { ...this.state.resumePoint };
        this.ensureValidState();
        this.updateSelectorsValue();
        this.saveSettings();
        this.loadChapter(true);
    },

    restoreScrollPosition() {
        window.scrollTo({ top: this.state.lastRead.scrollPosition || 0, behavior: "auto" });
    },

    updateSelectorsValue() {
        const bookSelect = document.getElementById("book-select");
        const chapterSelect = document.getElementById("chapter-select");
        if (bookSelect) bookSelect.value = String(this.state.lastRead.bid);
        this.updateChapterSelector();
        if (chapterSelect) chapterSelect.value = String(this.state.lastRead.chapter);
    },

    getBookByBid(bid) {
        return bibleMeta.find((book) => book.bid === Number(bid));
    },

    getBookByAbbr(abbr) {
        return bibleMeta.find((book) => book.abbr === abbr);
    },

    getBookNameByAbbr(abbr) {
        return this.getBookByAbbr(abbr)?.name ?? abbr;
    }
};

document.addEventListener("DOMContentLoaded", () => {
    BibleApp.init();
});
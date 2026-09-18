const tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
}

const API_BASE = "/api";

// ---------------------------------------------------------------------------
// Локализация (должна совпадать с языком, выбранным пользователем в обычном боте)
// ---------------------------------------------------------------------------
const I18N = {
  ru: {
    moduleLabel: "Модуль:",
    lessonLabel: "Урок:",
    moduleWord: "Модуль",
    lessonWord: "Урок",
    searchPlaceholder: "Поиск урока по теме или слову...",
    loading: "Загрузка...",
    selectLessonPrompt: "Выберите урок для просмотра",
    connectError: "Не удалось подключиться к серверу",
    noVideo: "Нет видео",
    videoCount: (i, n) => `Видео: ${i}/${n}`,
    videoPart: (i) => `${i}-я часть`,
    tabHw: "Домашка",
    tabPdf: "Конспекты PDF",
    tabZip: "Исходный код",
    fileCount: (i, n) => `Файл ${i}/${n}`,
    attachedFile: (title) => `📎 Прикрепленный файл: ${title}`,
    noHomeworkText: "Письменное задание отсутствует.",
    openPdfBtn: "Открыть PDF",
    openPptBtn: "Смотреть презентацию",
    openDocBtn: "Открыть документ",
    openSheetBtn: "Открыть таблицу",
    readMarkdownBtn: "Читать задание",
    readTextBtn: "Читать текст",
    viewImageBtn: "Просмотр фото",
    playAudioBtn: "Слушать аудио",
    watchVideoBtn: "Смотреть видео",
    downloadZipBtn: "Скачать ZIP",
    downloadFile: "Скачать файл",
    openFileBtn: "Открыть файл",
    openBtn: "Открыть",
    sendToChatBtn: "Отправить в чат",
    sendingBtn: "Отправка в чат...",
    sentOk: "✅ Файл отправлен в ваш диалог с ботом!",
    sendErr: "Ошибка при отправке файла.",
    netErr: "Сетевой сбой при отправке.",
    openInTelegram: "Откройте приложение внутри Telegram.",
    hwVideoLoaded: "Видео из ДЗ загружено в плеер выше ⬆️",
    nothingFound: "Ничего не найдено",
    fileNotReadyYet: "Файл ещё загружается на сервер, попробуйте чуть позже.",
    rotateVideo: "Повернуть видео",
    close: "Закрыть",
    docLoading: "Загрузка документа...",
    docLoadError: "Не удалось открыть документ.",
    slideCount: (i, n) => `Слайд ${i}/${n}`,
    allSlidesBadge: (total) => `Все слайды (${total})`,
    slideBadge: (i, total) => `Слайд ${i} из ${total}`,
    prevSlideBtn: "◀ Предыдущий слайд",
    nextSlideBtn: "Следующий слайд ▶",
    copyCode: "Скопировать",
    copied: "✅ Скопировано!",
    allSlides: "Все слайды",
    singleSlide: "По слайдам",
    pptFormatNotice: "Презентация Microsoft PowerPoint (.ppt). Вы можете отправить её в диалог с ботом или скачать:",
  },
  uz: {
    moduleLabel: "Modul:",
    lessonLabel: "Dars:",
    moduleWord: "Modul",
    lessonWord: "Dars",
    searchPlaceholder: "Mavzu yoki so'z bo'yicha darsni qidiring...",
    loading: "Yuklanmoqda...",
    selectLessonPrompt: "Ko'rish uchun darsni tanlang",
    connectError: "Serverga ulanib bo'lmadi",
    noVideo: "Video yo'q",
    videoCount: (i, n) => `Video: ${i}/${n}`,
    videoPart: (i) => `${i}-qism`,
    tabHw: "Uyga vazifa",
    tabPdf: "Taqdimotlar PDF",
    tabZip: "Dars fayllari",
    fileCount: (i, n) => `Fayl ${i}/${n}`,
    attachedFile: (title) => `📎 Ilova qilingan fayl: ${title}`,
    noHomeworkText: "Yozma topshiriq mavjud emas.",
    openPdfBtn: "PDF ochish",
    openPptBtn: "Taqdimotni ochish",
    openDocBtn: "Hujjatni ochish",
    openSheetBtn: "Jadvalni ochish",
    readMarkdownBtn: "Topshiriqni o'qish",
    readTextBtn: "Matnni o'qish",
    viewImageBtn: "Rasmni ko'rish",
    playAudioBtn: "Audioni tinglash",
    watchVideoBtn: "Videoni ko'rish",
    downloadZipBtn: "ZIP yuklab olish",
    downloadFile: "Faylni yuklab olish",
    openFileBtn: "Faylni ochish",
    openBtn: "Ochish",
    sendToChatBtn: "Chatga yuborish",
    sendingBtn: "Yuborilmoqda...",
    sentOk: "✅ Fayl botga yuborildi!",
    sendErr: "Faylni yuborishda xatolik.",
    netErr: "Yuborishda tarmoq xatosi.",
    openInTelegram: "Ilovani Telegram ichida oching.",
    hwVideoLoaded: "Uyga vazifadagi video yuqoridagi pleyerga yuklandi ⬆️",
    nothingFound: "Hech narsa topilmadi",
    fileNotReadyYet: "Fayl hali serverga yuklanmoqda, birozdan keyin urinib ko'ring.",
    rotateVideo: "Videoni burish",
    close: "Yopish",
    docLoading: "Hujjat yuklanmoqda...",
    docLoadError: "Hujjatni ochib bo'lmadi.",
    slideCount: (i, n) => `Slayd ${i}/${n}`,
    allSlidesBadge: (total) => `Barcha slaydlar (${total})`,
    slideBadge: (i, total) => `Slayd ${i} / ${total}`,
    prevSlideBtn: "◀ Oldingi slayd",
    nextSlideBtn: "Keyingi slayd ▶",
    copyCode: "Nusxalash",
    copied: "✅ Nusxalandi!",
    allSlides: "Barcha slaydlar",
    singleSlide: "Slaydma-slayd",
    pptFormatNotice: "Microsoft PowerPoint (.ppt) taqdimoti. Uni bot chatiga yuborishingiz yoki yuklab olishingiz mumkin:",
  },
  en: {
    moduleLabel: "Module:",
    lessonLabel: "Lesson:",
    moduleWord: "Module",
    lessonWord: "Lesson",
    searchPlaceholder: "Search lesson by topic or word...",
    loading: "Loading...",
    selectLessonPrompt: "Select a lesson to view",
    connectError: "Could not connect to the server",
    noVideo: "No video",
    videoCount: (i, n) => `Video: ${i}/${n}`,
    videoPart: (i) => `Part ${i}`,
    tabHw: "Homework",
    tabPdf: "Slides PDF",
    tabZip: "Source Code",
    fileCount: (i, n) => `File ${i}/${n}`,
    attachedFile: (title) => `📎 Attached file: ${title}`,
    noHomeworkText: "No written assignment.",
    openPdfBtn: "Open PDF",
    openPptBtn: "View presentation",
    openDocBtn: "Open document",
    openSheetBtn: "Open spreadsheet",
    readMarkdownBtn: "Read assignment",
    readTextBtn: "Read text",
    viewImageBtn: "View image",
    playAudioBtn: "Play audio",
    watchVideoBtn: "Watch video",
    downloadZipBtn: "Download ZIP",
    downloadFile: "Download file",
    openFileBtn: "Open file",
    openBtn: "Open",
    sendToChatBtn: "Send to chat",
    sendingBtn: "Sending...",
    sentOk: "✅ File sent to your chat with the bot!",
    sendErr: "Error sending the file.",
    netErr: "Network error while sending.",
    openInTelegram: "Please open this app inside Telegram.",
    hwVideoLoaded: "Homework video loaded into the player above ⬆️",
    nothingFound: "Nothing found",
    fileNotReadyYet: "The file is still being uploaded to the server, please try again shortly.",
    rotateVideo: "Rotate video",
    close: "Close",
    docLoading: "Loading document...",
    docLoadError: "Failed to open document.",
    slideCount: (i, n) => `Slide ${i}/${n}`,
    allSlidesBadge: (total) => `All slides (${total})`,
    slideBadge: (i, total) => `Slide ${i} / ${total}`,
    prevSlideBtn: "◀ Previous slide",
    nextSlideBtn: "Next slide ▶",
    copyCode: "Copy",
    copied: "✅ Copied!",
    allSlides: "All slides",
    singleSlide: "By slide",
    pptFormatNotice: "Microsoft PowerPoint (.ppt) presentation. You can send it to the bot chat or download it:",
  },
};

function getInitialLang() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const paramLang = urlParams.get("lang");
    if (paramLang && I18N[paramLang.toLowerCase()]) {
      return paramLang.toLowerCase();
    }
    const tgLang = tg?.initDataUnsafe?.user?.language_code;
    if (tgLang) {
      const code = tgLang.toLowerCase();
      if (code.startsWith("uz")) return "uz";
      if (code.startsWith("en")) return "en";
      if (code.startsWith("ru")) return "ru";
    }
    const navLang = (navigator.language || navigator.userLanguage || "").toLowerCase();
    if (navLang.startsWith("uz")) return "uz";
    if (navLang.startsWith("en")) return "en";
  } catch (e) {}
  return "ru";
}

let currentLang = getInitialLang();
function t(key, ...args) {
  const dict = I18N[currentLang] || I18N.ru;
  const val = dict[key] ?? I18N.ru[key];
  return typeof val === "function" ? val(...args) : val;
}

let allLessons = [];
let monthsMap = new Map();
let currentMonth = null;
let currentSelectedLesson = null;

let currentVideoIdx = 0;
let currentPdfIdx = 0;
let currentZipIdx = 0;
let currentHwFileIdx = 0;
let activeTab = "hw";

// DOM
const monthDropdownBtn = document.getElementById("monthDropdownBtn");
const selectedMonthText = document.getElementById("selectedMonthText");
const monthDropdownMenu = document.getElementById("monthDropdownMenu");

const lessonDropdownBtn = document.getElementById("lessonDropdownBtn");
const selectedLessonText = document.getElementById("selectedLessonText");
const lessonDropdownMenu = document.getElementById("lessonDropdownMenu");

const liveSearchInput = document.getElementById("liveSearchInput");
const clearSearchBtn = document.getElementById("clearSearchBtn");
const searchResults = document.getElementById("searchResults");

const videoPlayer = document.getElementById("videoPlayer");
const videoPartTitle = document.getElementById("videoPartTitle");
const prevVideoBtn = document.getElementById("prevVideoBtn");
const nextVideoBtn = document.getElementById("nextVideoBtn");

const lessonBadge = document.getElementById("lessonBadge");
const lessonHeading = document.getElementById("lessonHeading");

const subPartsBar = document.getElementById("subPartsBar");
const prevSubPartBtn = document.getElementById("prevSubPartBtn");
const nextSubPartBtn = document.getElementById("nextSubPartBtn");
const subPartTitle = document.getElementById("subPartTitle");

const fileTitleHeader = document.getElementById("fileTitleHeader");
const mainContentBox = document.getElementById("mainContentBox");
const sendActionBtn = document.getElementById("sendActionBtn");
const openDirectBtn = document.getElementById("openDirectBtn");

const tabItems = document.querySelectorAll(".tab-item");

const fileViewerModal = document.getElementById("fileViewerModal");
const fileViewerTitle = document.getElementById("fileViewerTitle");
const fileViewerFrame = document.getElementById("fileViewerFrame");
const fileViewerCloseBtn = document.getElementById("fileViewerCloseBtn");

function notify(msg) {
  if (tg && tg.showAlert) {
    tg.showAlert(msg);
  } else {
    alert(msg);
  }
}

function getTelegramUserId() {
  return tg?.initDataUnsafe?.user?.id || null;
}

// ---------------------------------------------------------------------------
// Применение перевода к статичным элементам интерфейса
// ---------------------------------------------------------------------------
function applyStaticTranslations() {
  document.querySelectorAll(".month-box label").forEach(el => el.textContent = t("moduleLabel"));
  document.querySelectorAll(".lesson-box label").forEach(el => el.textContent = t("lessonLabel"));
  liveSearchInput.placeholder = t("searchPlaceholder");

  const tabHwTitle = document.getElementById("tabHwTitle");
  const tabPdfTitle = document.getElementById("tabPdfTitle");
  const tabZipTitle = document.getElementById("tabZipTitle");
  if (tabHwTitle) tabHwTitle.textContent = t("tabHw");
  if (tabPdfTitle) tabPdfTitle.textContent = t("tabPdf");
  if (tabZipTitle) tabZipTitle.textContent = t("tabZip");

  if (!currentSelectedLesson) {
    lessonHeading.textContent = t("selectLessonPrompt");
    selectedLessonText.textContent = t("selectLessonPrompt");
  }

  // Point 3: Translate action buttons dynamically
  sendActionBtn.textContent = t("sendToChatBtn");
  openDirectBtn.textContent = t("openFileBtn");
  const rotateBtn = document.getElementById("rotateVideoBtn");
  if (rotateBtn) {
    const text = t("rotateVideo");
    rotateBtn.title = text;
    rotateBtn.setAttribute("aria-label", text);
    rotateBtn.setAttribute("data-tooltip", text);
  }
  const exitBtn = document.getElementById("exitLandscapeBtn");
  if (exitBtn) {
    exitBtn.title = t("close") || "✕";
  }
  const loadingText = document.getElementById("viewerLoadingText");
  if (loadingText) loadingText.textContent = t("docLoading");
}

// Initial call to translate UI immediately
applyStaticTranslations();

async function fetchUserLang() {
  const uid = getTelegramUserId();
  if (!uid) return "ru";
  try {
    const res = await fetch(`${API_BASE}/user-lang?userId=${uid}`);
    if (!res.ok) return "ru";
    const data = await res.json();
    return I18N[data.lang] ? data.lang : "ru";
  } catch (e) {
    return "ru";
  }
}

function showAccessDenied() {
  const deniedScreen = document.getElementById("accessDeniedScreen");
  const appContainer = document.querySelector(".app-container");
  if (deniedScreen) deniedScreen.style.display = "flex";
  if (appContainer) {
    appContainer.classList.remove("ready");
    appContainer.style.display = "none";
  }
}

function showAppContent() {
  const deniedScreen = document.getElementById("accessDeniedScreen");
  const appContainer = document.querySelector(".app-container");
  if (deniedScreen) deniedScreen.style.display = "none";
  if (appContainer) {
    appContainer.classList.add("ready");
    appContainer.style.display = "";
  }
}

async function init() {
  const uid = getTelegramUserId();
  // Если открыт прямой сайт (вне Telegram) — сразу показываем большой Х без слов
  if (!uid) {
    showAccessDenied();
    return;
  }

  try {
    const url = `${API_BASE}/lessons?userId=${uid}`;
    const res = await fetch(url);
    if (res.status === 403) {
      // Пользователь не в вайтлисте
      showAccessDenied();
      return;
    }
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    if (data.allowed === false) {
      showAccessDenied();
      return;
    }

    // Пользователь в вайтлисте: показываем платформу
    showAppContent();

    currentLang = await fetchUserLang();
    applyStaticTranslations();

    // Бэкенд может вернуть либо {lang, lessons}, либо (в старых версиях) просто массив
    if (Array.isArray(data)) {
      allLessons = data;
    } else {
      allLessons = data.lessons || [];
      if (data.lang && I18N[data.lang]) {
        currentLang = data.lang;
        applyStaticTranslations();
      }
    }

    allLessons.sort((a, b) => {
      if (a.monthNumber !== b.monthNumber) return a.monthNumber - b.monthNumber;
      return a.lessonNumber - b.lessonNumber;
    });

    monthsMap.clear();
    allLessons.forEach(l => {
      const m = l.monthNumber || 1;
      if (!monthsMap.has(m)) monthsMap.set(m, []);
      monthsMap.get(m).push(l);
    });

    renderMonthDropdown();

    if (monthsMap.size > 0) {
      const firstMonth = Array.from(monthsMap.keys()).sort((a, b) => a - b)[0];
      selectMonth(firstMonth);
      const list = monthsMap.get(firstMonth);
      if (list && list.length > 0) {
        selectLesson(list[0]);
      }
    }
  } catch (err) {
    console.error("Ошибка загрузки:", err);
    showAccessDenied();
  }
}

function renderMonthDropdown() {
  monthDropdownMenu.innerHTML = "";
  Array.from(monthsMap.keys()).sort((a, b) => a - b).forEach(m => {
    const item = document.createElement("div");
    item.className = "dropdown-item";
    item.textContent = `${t("moduleWord")} ${m}`;
    item.onclick = (e) => {
      e.stopPropagation();
      selectMonth(m);
      monthDropdownMenu.classList.remove("open");
      const list = monthsMap.get(m) || [];
      if (list.length > 0) selectLesson(list[0]);
    };
    monthDropdownMenu.appendChild(item);
  });
}

function selectMonth(m) {
  currentMonth = m;
  selectedMonthText.textContent = `${t("moduleWord")} ${m}`;
  renderLessonDropdown(m);
}

function renderLessonDropdown(m) {
  lessonDropdownMenu.innerHTML = "";
  const lessons = monthsMap.get(m) || [];

  lessons.forEach(l => {
    const item = document.createElement("div");
    item.className = "dropdown-item";
    item.textContent = `${t("lessonWord")} ${l.lessonNumber}: ${l.title}`;
    item.onclick = (e) => {
      e.stopPropagation();
      selectLesson(l);
      lessonDropdownMenu.classList.remove("open");
    };
    lessonDropdownMenu.appendChild(item);
  });
}

function selectLesson(lesson) {
  currentSelectedLesson = lesson;
  currentVideoIdx = 0;
  currentPdfIdx = 0;
  currentZipIdx = 0;
  currentHwFileIdx = 0;

  if (currentMonth !== lesson.monthNumber) {
    selectMonth(lesson.monthNumber);
  }

  selectedLessonText.textContent = `${t("lessonWord")} ${lesson.lessonNumber}: ${lesson.title}`;
  lessonBadge.textContent = `${t("moduleWord")} ${lesson.monthNumber} • ${t("lessonWord")} ${lesson.lessonNumber}`;
  lessonHeading.textContent = lesson.title;

  updateVideoControls();
  updateTabsVisibility();
  updateTabContent();
}

// Скрываем вкладки, для которых у урока вообще нет материалов — вместо того,
// чтобы показывать текст "не прикреплено". Если активная вкладка скрылась,
// переключаемся на первую доступную.
function updateTabsVisibility() {
  const l = currentSelectedLesson;
  if (!l) return;

  const visibility = {
    hw: l.hasHomework !== false, // домашка почти всегда есть хотя бы текстом; по умолчанию показываем
    pdf: !!l.hasPdf,
    zip: !!l.hasZip,
  };

  tabItems.forEach(item => {
    const tab = item.dataset.tab;
    const visible = visibility[tab] !== false;
    item.classList.toggle("tab-hidden", !visible);
  });

  if (visibility[activeTab] === false) {
    const fallback = ["hw", "pdf", "zip"].find(tab => visibility[tab] !== false);
    if (fallback) {
      activeTab = fallback;
      tabItems.forEach(t2 => t2.classList.toggle("active", t2.dataset.tab === fallback));
    }
  }
}

function updateVideoControls() {
  const videos = currentSelectedLesson?.videos || [];
  const chipsContainer = document.getElementById("videoChipsContainer");
  const fallbackNav = document.querySelector(".video-nav-fallback");

  if (videos.length === 0) {
    videoPlayer.removeAttribute("src");
    videoPlayer.load();
    if (chipsContainer) chipsContainer.innerHTML = "";
    if (fallbackNav) fallbackNav.style.display = "none";
    videoPartTitle.textContent = t("noVideo");
    prevVideoBtn.disabled = true;
    nextVideoBtn.disabled = true;
    return;
  }

  // Segmented video chips
  if (chipsContainer) {
    chipsContainer.innerHTML = "";
    if (videos.length > 1) {
      videos.forEach((v, idx) => {
        const chip = document.createElement("button");
        chip.className = `video-chip ${idx === currentVideoIdx ? "active" : ""}`;
        chip.innerHTML = `
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
          <span>${t("videoPart", idx + 1)}</span>
        `;
        chip.onclick = () => {
          if (currentVideoIdx !== idx) {
            currentVideoIdx = idx;
            updateVideoControls();
            videoPlayer.play().catch(() => {});
          }
        };
        chipsContainer.appendChild(chip);
      });
      chipsContainer.style.display = "flex";
      if (fallbackNav) fallbackNav.style.display = "none";
    } else {
      chipsContainer.style.display = "none";
    }
  }

  prevVideoBtn.disabled = (currentVideoIdx === 0);
  nextVideoBtn.disabled = (currentVideoIdx === videos.length - 1);
  videoPartTitle.textContent = t("videoCount", currentVideoIdx + 1, videos.length);

  const v = videos[currentVideoIdx];
  videoPlayer.src = `${API_BASE}/video/stream/${v.id}`;
  videoPlayer.load();
}

prevVideoBtn.onclick = () => {
  if (currentVideoIdx > 0) {
    currentVideoIdx--;
    updateVideoControls();
  }
};

nextVideoBtn.onclick = () => {
  const vids = currentSelectedLesson?.videos || [];
  if (currentVideoIdx < vids.length - 1) {
    currentVideoIdx++;
    updateVideoControls();
  }
};

function switchTab(name) {
  activeTab = name;
  tabItems.forEach(t2 => t2.classList.toggle("active", t2.dataset.tab === name));
  updateTabContent();
}

tabItems.forEach(item => {
  item.onclick = () => {
    if (item.classList.contains("tab-hidden")) return;
    switchTab(item.dataset.tab);
  };
});

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getFileMeta(fileName) {
  const fname = (fileName || "").toLowerCase().trim();
  const parts = fname.split('.');
  const rawExt = parts.length > 1 ? parts.pop().toUpperCase() : "FILE";

  if (fname.endsWith(".md")) {
    return { type: "markdown", label: "MD", btnKey: "readMarkdownBtn", ext: "MD", badgeClass: "type-markdown" };
  }
  if (fname.endsWith(".pptx") || fname.endsWith(".ppt") || fname.endsWith(".odp") || fname.endsWith(".pps") || fname.endsWith(".ppsx")) {
    return { type: "pptx", label: "PPT", btnKey: "openPptBtn", ext: "PPTX", badgeClass: "type-pptx" };
  }
  if (fname.endsWith(".pdf")) {
    return { type: "pdf", label: "PDF", btnKey: "openPdfBtn", ext: "PDF", badgeClass: "type-pdf" };
  }
  if (fname.endsWith(".docx") || fname.endsWith(".doc") || fname.endsWith(".odt") || fname.endsWith(".rtf")) {
    return { type: "docx", label: "DOC", btnKey: "openDocBtn", ext: "DOCX", badgeClass: "type-docx" };
  }
  if (fname.endsWith(".xlsx") || fname.endsWith(".xls") || fname.endsWith(".csv") || fname.endsWith(".ods")) {
    return { type: "xlsx", label: rawExt === "CSV" ? "CSV" : "XLS", btnKey: "openSheetBtn", ext: rawExt, badgeClass: "type-sheet" };
  }
  if (fname.endsWith(".mp3") || fname.endsWith(".wav") || fname.endsWith(".ogg") || fname.endsWith(".m4a") || fname.endsWith(".flac") || fname.endsWith(".aac")) {
    return { type: "audio", label: rawExt.slice(0, 4), btnKey: "playAudioBtn", ext: "AUDIO", badgeClass: "type-audio" };
  }
  if (fname.endsWith(".mp4") || fname.endsWith(".mov") || fname.endsWith(".webm") || fname.endsWith(".mkv") || fname.endsWith(".avi")) {
    return { type: "video", label: rawExt.slice(0, 4), btnKey: "watchVideoBtn", ext: "VIDEO", badgeClass: "type-video" };
  }
  if (fname.endsWith(".zip") || fname.endsWith(".rar") || fname.endsWith(".7z") || fname.endsWith(".tar.gz") || fname.endsWith(".gz") || fname.endsWith(".tar")) {
    const lbl = fname.endsWith(".tar.gz") ? "TAR" : rawExt.slice(0, 4);
    return { type: "zip", label: lbl, btnKey: "downloadZipBtn", ext: "ZIP", badgeClass: "type-zip" };
  }
  if (fname.endsWith(".png") || fname.endsWith(".jpg") || fname.endsWith(".jpeg") || fname.endsWith(".webp") ||
      fname.endsWith(".gif") || fname.endsWith(".svg") || fname.endsWith(".bmp")) {
    return { type: "image", label: rawExt.slice(0, 4), btnKey: "viewImageBtn", ext: "IMG", badgeClass: "type-image" };
  }
  if (fname.endsWith(".java") || fname.endsWith(".py") || fname.endsWith(".js") || fname.endsWith(".ts") ||
      fname.endsWith(".html") || fname.endsWith(".css") || fname.endsWith(".sql") || fname.endsWith(".json") ||
      fname.endsWith(".xml") || fname.endsWith(".c") || fname.endsWith(".cpp") || fname.endsWith(".h") ||
      fname.endsWith(".cs") || fname.endsWith(".sh") || fname.endsWith(".bat") || fname.endsWith(".yml") || fname.endsWith(".yaml")) {
    return { type: "text", label: rawExt.slice(0, 4), btnKey: "readTextBtn", ext: rawExt, badgeClass: "type-code" };
  }
  if (fname.endsWith(".txt") || fname.endsWith(".log")) {
    return { type: "text", label: "TXT", btnKey: "readTextBtn", ext: "TXT", badgeClass: "type-text" };
  }
  return { type: "generic", label: rawExt.slice(0, 4) || "FILE", btnKey: "openFileBtn", ext: rawExt || "FILE", badgeClass: "type-generic" };
}

window.handleOpenFile = async function(fileId) {
  const l = currentSelectedLesson;
  if (!l) return;
  const allCurrentFiles = [
    ...(l.hwFiles || []),
    ...(l.pdfs || []),
    ...(l.zips || [])
  ];
  const fileObj = allCurrentFiles.find(f => String(f.id) === String(fileId));
  if (!fileObj) return;

  const fname = (fileObj.title || "").toLowerCase();
  const meta = getFileMeta(fname);

  if (meta.type === "video" || fileObj.isVideo || fname.endsWith(".mp4") || fname.endsWith(".mov")) {
    videoPlayer.src = `${API_BASE}/video/stream/${fileObj.id}`;
    videoPlayer.load();
    videoPlayer.play().catch(() => {});
    videoPartTitle.textContent = fileObj.title;
    notify(t("hwVideoLoaded"));
    return;
  }

  const url = `${API_BASE}/file/view/${fileObj.id}`;
  const ready = await fileExistsOnServer(url);
  if (!ready) {
    notify(t("fileNotReadyYet"));
    return;
  }
  openUniversalViewer(fileObj);
};

window.handleSendFileToChat = async function(fileId, btnEl) {
  const uid = getTelegramUserId();
  if (!uid) {
    notify(t("openInTelegram"));
    return;
  }

  let originalHtml = "";
  if (btnEl) {
    btnEl.disabled = true;
    originalHtml = btnEl.innerHTML;
    btnEl.classList.add("sending");
    btnEl.innerHTML = `
      <svg class="spin-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round">
        <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
      </svg>
    `;
  }

  try {
    const res = await fetch(`${API_BASE}/send-to-chat?userId=${uid}&fileId=${fileId}`, { method: "POST" });
    if (res.ok) {
      notify(t("sentOk"));
      if (btnEl) {
        btnEl.classList.remove("sending");
        btnEl.classList.add("sent");
        btnEl.innerHTML = `
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#2ea043" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        `;
        setTimeout(() => {
          if (btnEl) {
            btnEl.classList.remove("sent");
            btnEl.disabled = false;
            btnEl.innerHTML = originalHtml;
          }
        }, 1800);
        return;
      }
    } else {
      notify(t("sendErr"));
    }
  } catch (e) {
    notify(t("netErr"));
  } finally {
    if (btnEl && !btnEl.classList.contains("sent")) {
      btnEl.classList.remove("sending");
      btnEl.disabled = false;
      btnEl.innerHTML = originalHtml;
    }
  }
};

function updateTabContent() {
  if (!currentSelectedLesson) return;
  const l = currentSelectedLesson;
  const filesListContainer = document.getElementById("filesListContainer");

  let files = [];
  if (activeTab === "hw") files = l.hwFiles || [];
  else if (activeTab === "pdf") files = l.pdfs || [];
  else if (activeTab === "zip") files = l.zips || [];

  // Hide old single-file fallback bar & buttons
  if (subPartsBar) subPartsBar.style.display = "none";
  if (fileTitleHeader) fileTitleHeader.style.display = "none";
  const oldActionRow = document.querySelector(".action-buttons-row");
  if (oldActionRow) oldActionRow.style.display = "none";

  // Render cards in filesListContainer
  if (filesListContainer) {
    filesListContainer.innerHTML = "";
    if (files.length > 0) {
      files.forEach((f) => {
        const meta = getFileMeta(f.title);
        const card = document.createElement("div");
        card.className = "file-item-card";
        card.innerHTML = `
          <div class="file-item-left">
            <div class="file-icon-badge ${meta.badgeClass}">${meta.label}</div>
            <div class="file-item-info">
              <span class="file-item-name" title="${escapeHtml(f.title)}">${escapeHtml(f.title)}</span>
              <span class="file-item-ext">${meta.ext}</span>
            </div>
          </div>
          <div class="file-item-actions">
            <button class="file-action-btn btn-open-primary" onclick="handleOpenFile(${f.id})">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <span>${t(meta.btnKey) || t("openBtn")}</span>
            </button>
            <button class="file-action-btn btn-chat-icon" onclick="handleSendFileToChat(${f.id}, this)" title="${t("sendToChatBtn") || "Chatga yuborish"}" aria-label="Chatga yuborish">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
            </button>
          </div>
        `;
        filesListContainer.appendChild(card);
      });
      filesListContainer.style.display = "flex";
    } else {
      filesListContainer.style.display = "none";
    }
  }

  // Homework text handling
  if (activeTab === "hw") {
    if (l.homeworkText && l.homeworkText.trim()) {
      mainContentBox.classList.remove("hidden");
      mainContentBox.style.display = "block";
      mainContentBox.textContent = l.homeworkText;
    } else {
      if (files.length === 0) {
        mainContentBox.classList.remove("hidden");
        mainContentBox.style.display = "block";
        mainContentBox.textContent = t("noHomeworkText");
      } else {
        mainContentBox.classList.add("hidden");
        mainContentBox.style.display = "none";
      }
    }
  } else {
    mainContentBox.classList.add("hidden");
    mainContentBox.style.display = "none";
  }
}

// Перелистывание файлов текущей вкладки (1/N)
prevSubPartBtn.onclick = () => {
  if (activeTab === "hw" && currentHwFileIdx > 0) currentHwFileIdx--;
  if (activeTab === "pdf" && currentPdfIdx > 0) currentPdfIdx--;
  if (activeTab === "zip" && currentZipIdx > 0) currentZipIdx--;
  updateTabContent();
};

nextSubPartBtn.onclick = () => {
  const l = currentSelectedLesson;
  if (!l) return;
  if (activeTab === "hw" && currentHwFileIdx < (l.hwFiles?.length || 0) - 1) currentHwFileIdx++;
  if (activeTab === "pdf" && currentPdfIdx < (l.pdfs?.length || 0) - 1) currentPdfIdx++;
  if (activeTab === "zip" && currentZipIdx < (l.zips?.length || 0) - 1) currentZipIdx++;
  updateTabContent();
};

// ---------------------------------------------------------------------------
// Просмотр файлов ПРЯМО ВНУТРИ Mini App (PDF, Word DOCX, Картинки, Код)
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// Просмотр файлов ПРЯМО ВНУТРИ Mini App (PPTX, PDF, Word DOCX, Excel, Картинки, Код, Аудио)
// ---------------------------------------------------------------------------
if (window.pdfjsLib) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = "lib/pdf.worker.min.js";
}

let activePdfDoc = null;
let activePdfArrayBuffer = null;
let activePdfScale = 1.0;
let isPdfRendering = false;

let activePptxSlides = [];
let currentPptxSlideIdx = 0;
let isPptxAllMode = false;
let pptxImageBlobUrls = [];

let currentViewerFileObj = null;
let currentCodeText = "";

// DOM элементы просмотрщика
const fileViewerBody = document.getElementById("fileViewerBody");
const viewerLoading = document.getElementById("viewerLoading");
const viewerLoadingText = document.getElementById("viewerLoadingText");

const pdfViewerContainer = document.getElementById("pdfViewerContainer");
const pdfControls = document.getElementById("pdfControls");
const pdfPageInfo = document.getElementById("pdfPageInfo");
const pdfZoomIn = document.getElementById("pdfZoomIn");
const pdfZoomOut = document.getElementById("pdfZoomOut");
const pdfFitWidth = document.getElementById("pdfFitWidth");

const pptxViewerContainer = document.getElementById("pptxViewerContainer");
const pptxControls = document.getElementById("pptxControls");
const pptxSlideInfo = document.getElementById("pptxSlideInfo");
const pptxPrevSlide = document.getElementById("pptxPrevSlide");
const pptxNextSlide = document.getElementById("pptxNextSlide");
const pptxToggleMode = document.getElementById("pptxToggleMode");

const docViewerContainer = document.getElementById("docViewerContainer");
const sheetViewerContainer = document.getElementById("sheetViewerContainer");

const audioViewerContainer = document.getElementById("audioViewerContainer");
const viewerAudio = document.getElementById("viewerAudio");
const audioTrackTitle = document.getElementById("audioTrackTitle");

const imageViewerContainer = document.getElementById("imageViewerContainer");
const viewerImage = document.getElementById("viewerImage");

const codeViewerContainer = document.getElementById("codeViewerContainer");
const viewerCode = document.getElementById("viewerCode");
const codeCopyBtn = document.getElementById("codeCopyBtn");

const cardViewerContainer = document.getElementById("cardViewerContainer");
const fileCardIcon = document.getElementById("fileCardIcon");
const fileCardName = document.getElementById("fileCardName");
const fileCardNotice = document.getElementById("fileCardNotice");
const cardSendChatBtn = document.getElementById("cardSendChatBtn");
const cardDownloadBtn = document.getElementById("cardDownloadBtn");

function resetViewerContainers() {
  if (viewerLoading) viewerLoading.style.display = "none";
  if (pdfViewerContainer) {
    pdfViewerContainer.style.display = "none";
    pdfViewerContainer.innerHTML = "";
  }
  if (pptxViewerContainer) {
    pptxViewerContainer.style.display = "none";
    pptxViewerContainer.innerHTML = "";
  }
  if (docViewerContainer) {
    docViewerContainer.style.display = "none";
    docViewerContainer.innerHTML = "";
  }
  const mdContainer = document.getElementById("markdownViewerContainer");
  if (mdContainer) {
    mdContainer.style.display = "none";
    mdContainer.innerHTML = "";
  }
  if (sheetViewerContainer) {
    sheetViewerContainer.style.display = "none";
    sheetViewerContainer.innerHTML = "";
  }
  if (audioViewerContainer) {
    audioViewerContainer.style.display = "none";
  }
  if (viewerAudio) {
    try { viewerAudio.pause(); } catch(e){}
    viewerAudio.removeAttribute("src");
  }
  if (imageViewerContainer) {
    imageViewerContainer.style.display = "none";
  }
  if (viewerImage) viewerImage.removeAttribute("src");
  if (codeViewerContainer) {
    codeViewerContainer.style.display = "none";
  }
  if (viewerCode) viewerCode.textContent = "";
  if (codeCopyBtn) codeCopyBtn.style.display = "none";
  if (cardViewerContainer) {
    cardViewerContainer.style.display = "none";
  }
  if (fileViewerFrame) {
    fileViewerFrame.style.display = "none";
    fileViewerFrame.src = "about:blank";
  }
  if (pdfControls) pdfControls.style.display = "none";
  if (pptxControls) pptxControls.style.display = "none";

  activePdfDoc = null;
  activePdfArrayBuffer = null;
  activePptxSlides = [];
  currentPptxSlideIdx = 0;
  isPptxAllMode = true;
  currentCodeText = "";
  currentViewerFileObj = null;

  // Revoke previous slide image blob URLs to save memory
  if (pptxImageBlobUrls && pptxImageBlobUrls.length > 0) {
    pptxImageBlobUrls.forEach(url => {
      try { URL.revokeObjectURL(url); } catch(e){}
    });
    pptxImageBlobUrls = [];
  }
}

function closeFileViewer() {
  fileViewerModal.style.display = "none";
  resetViewerContainers();
}

if (fileViewerCloseBtn) {
  fileViewerCloseBtn.onclick = closeFileViewer;
}

// ---------------------------------------------------------------------------
// 1. PDF Просмотрщик (PDF.js)
// ---------------------------------------------------------------------------
async function renderPdfDocument(arrayBuffer, zoomFactor = 1.0) {
  if (isPdfRendering) return;
  isPdfRendering = true;
  pdfViewerContainer.innerHTML = "";
  pdfViewerContainer.style.display = "flex";
  pdfControls.style.display = "flex";

  try {
    if (!activePdfDoc) {
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      activePdfDoc = await loadingTask.promise;
    }
    const numPages = activePdfDoc.numPages;
    pdfPageInfo.textContent = `1 / ${numPages}`;

    const containerWidth = Math.max(fileViewerBody.clientWidth || window.innerWidth, 300);

    for (let i = 1; i <= numPages; i++) {
      const page = await activePdfDoc.getPage(i);
      const unscaledViewport = page.getViewport({ scale: 1.0 });
      let scale = (containerWidth / unscaledViewport.width) * zoomFactor;
      const viewport = page.getViewport({ scale: scale });

      const canvas = document.createElement("canvas");
      canvas.className = "pdf-page-canvas";
      canvas.dataset.pageNum = i;
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext("2d");

      pdfViewerContainer.appendChild(canvas);

      await page.render({ canvasContext: ctx, viewport: viewport }).promise;
    }

    fileViewerBody.onscroll = () => {
      const canvases = pdfViewerContainer.querySelectorAll(".pdf-page-canvas");
      const currentScroll = fileViewerBody.scrollTop + 120;
      let visiblePage = 1;
      canvases.forEach(c => {
        if (c.offsetTop <= currentScroll) {
          visiblePage = c.dataset.pageNum;
        }
      });
      pdfPageInfo.textContent = `${visiblePage} / ${numPages}`;
    };

  } catch (err) {
    console.error("PDF.js render error:", err);
    showFileCard(currentViewerFileObj, "📄", t("docLoadError"));
  } finally {
    isPdfRendering = false;
    if (viewerLoading) viewerLoading.style.display = "none";
  }
}

if (pdfZoomIn) {
  pdfZoomIn.onclick = () => {
    if (!activePdfArrayBuffer) return;
    activePdfScale = Math.min(activePdfScale * 1.25, 3.0);
    renderPdfDocument(activePdfArrayBuffer, activePdfScale);
  };
}

if (pdfZoomOut) {
  pdfZoomOut.onclick = () => {
    if (!activePdfArrayBuffer) return;
    activePdfScale = Math.max(activePdfScale * 0.8, 0.5);
    renderPdfDocument(activePdfArrayBuffer, activePdfScale);
  };
}

if (pdfFitWidth) {
  pdfFitWidth.onclick = () => {
    if (!activePdfArrayBuffer) return;
    activePdfScale = 1.0;
    renderPdfDocument(activePdfArrayBuffer, 1.0);
  };
}

let resizePdfTimeout = null;
window.addEventListener("resize", () => {
  if (fileViewerModal.style.display === "flex" && activePdfArrayBuffer) {
    clearTimeout(resizePdfTimeout);
    resizePdfTimeout = setTimeout(() => {
      renderPdfDocument(activePdfArrayBuffer, activePdfScale);
    }, 250);
  }
});

// ---------------------------------------------------------------------------
// 2. PowerPoint Презентации (.pptx) - Парсинг и интерактивный просмотр
// ---------------------------------------------------------------------------
async function parsePptxSlides(arrayBuffer) {
  if (!window.JSZip) {
    throw new Error("JSZip is not available");
  }
  const zip = await JSZip.loadAsync(arrayBuffer);

  // 1. Определение размеров слайда и порядка слайдов из presentation.xml
  let slideW = 9144000;
  let slideH = 5143500;
  let slidePaths = [];

  try {
    const presFile = zip.file("ppt/presentation.xml");
    const relsFile = zip.file("ppt/_rels/presentation.xml.rels");
    if (presFile && relsFile) {
      const presXml = await presFile.async("string");
      const relsXml = await relsFile.async("string");
      const parser = new DOMParser();
      const presDoc = parser.parseFromString(presXml, "application/xml");
      const relsDoc = parser.parseFromString(relsXml, "application/xml");

      const sldSz = Array.from(presDoc.querySelectorAll("*")).find(n => n.localName === "sldSz");
      if (sldSz) {
        const cx = parseInt(sldSz.getAttribute("cx") || "0", 10);
        const cy = parseInt(sldSz.getAttribute("cy") || "0", 10);
        if (cx > 0 && cy > 0) {
          slideW = cx;
          slideH = cy;
        }
      }

      const relMap = {};
      const relNodes = Array.from(relsDoc.querySelectorAll("*")).filter(n => n.localName === "Relationship");
      relNodes.forEach(r => {
        const id = r.getAttribute("Id");
        const target = r.getAttribute("Target");
        if (id && target) relMap[id] = target.replace(/^\/?/, "");
      });

      const sldIds = Array.from(presDoc.querySelectorAll("*")).filter(n => n.localName === "sldId");
      sldIds.forEach(s => {
        const rId = s.getAttribute("r:id") || s.getAttribute("id");
        if (rId && relMap[rId]) {
          let tPath = relMap[rId];
          if (!tPath.startsWith("ppt/")) tPath = "ppt/" + tPath;
          slidePaths.push(tPath);
        }
      });
    }
  } catch (e) {
    console.warn("Could not determine slide order from presentation.xml:", e);
  }

  // Fallback: сбор всех файлов слайдов ppt/slides/slide*.xml
  if (slidePaths.length === 0) {
    const allFiles = Object.keys(zip.files);
    slidePaths = allFiles.filter(name => /^ppt\/slides\/slide\d+\.xml$/i.test(name));
    slidePaths.sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)?.[0] || "0", 10);
      const numB = parseInt(b.match(/\d+/)?.[0] || "0", 10);
      return numA - numB;
    });
  }

  if (slidePaths.length === 0) {
    throw new Error("No slides found in PPTX");
  }

  const slides = [];
  const parser = new DOMParser();

  const SCHEME_COLORS = {
    lt1: "#ffffff",
    lt2: "#f8f9fa",
    dk1: "#111827",
    dk2: "#1f242e",
    accent1: "#3c78d8",
    accent2: "#6aa84f",
    accent3: "#674ea7",
    accent4: "#e69138",
    accent5: "#cc0000",
    accent6: "#45818e"
  };

  function resolveColor(parentElem, subPath) {
    if (!parentElem) return null;
    let target = parentElem;
    if (subPath) {
      const parts = subPath.split(">");
      for (const p of parts) {
        const name = p.trim();
        const found = Array.from(target.children || []).find(c => c.localName === name);
        if (!found) return null;
        target = found;
      }
    }
    const srgb = Array.from(target.querySelectorAll("*")).find(n => n.localName === "srgbClr");
    if (srgb) {
      const val = srgb.getAttribute("val");
      if (val) return "#" + val;
    }
    const sch = Array.from(target.querySelectorAll("*")).find(n => n.localName === "schemeClr");
    if (sch) {
      const val = sch.getAttribute("val");
      if (val && SCHEME_COLORS[val]) return SCHEME_COLORS[val];
    }
    return null;
  }

  function getXfrm(elem) {
    const xfrm = Array.from(elem.querySelectorAll("*")).find(n =>
      (n.localName === "xfrm" && (n.parentElement?.localName === "spPr" || n.parentElement?.localName === "grpSpPr" || n.parentElement?.localName === "picPr"))
    );
    if (!xfrm) return null;
    const off = Array.from(xfrm.children || []).find(n => n.localName === "off");
    const ext = Array.from(xfrm.children || []).find(n => n.localName === "ext");
    const chOff = Array.from(xfrm.children || []).find(n => n.localName === "chOff");
    const chExt = Array.from(xfrm.children || []).find(n => n.localName === "chExt");

    return {
      x: off ? parseFloat(off.getAttribute("x") || "0") : 0,
      y: off ? parseFloat(off.getAttribute("y") || "0") : 0,
      w: ext ? parseFloat(ext.getAttribute("cx") || "0") : 0,
      h: ext ? parseFloat(ext.getAttribute("cy") || "0") : 0,
      chX: chOff ? parseFloat(chOff.getAttribute("x") || "0") : undefined,
      chY: chOff ? parseFloat(chOff.getAttribute("y") || "0") : undefined,
      chW: chExt ? parseFloat(chExt.getAttribute("cx") || "0") : undefined,
      chH: chExt ? parseFloat(chExt.getAttribute("cy") || "0") : undefined,
      flipH: xfrm.getAttribute("flipH") === "1",
      flipV: xfrm.getAttribute("flipV") === "1"
    };
  }

  function transformBox(box, grpCtx) {
    if (!grpCtx) return { x: box.x, y: box.y, w: box.w, h: box.h };
    const scaleX = (grpCtx.chW && grpCtx.chW > 0) ? (grpCtx.w / grpCtx.chW) : 1;
    const scaleY = (grpCtx.chH && grpCtx.chH > 0) ? (grpCtx.h / grpCtx.chH) : 1;
    return {
      x: grpCtx.x + (box.x - (grpCtx.chX !== undefined ? grpCtx.chX : grpCtx.x)) * scaleX,
      y: grpCtx.y + (box.y - (grpCtx.chY !== undefined ? grpCtx.chY : grpCtx.y)) * scaleY,
      w: box.w * scaleX,
      h: box.h * scaleY
    };
  }

  for (let idx = 0; idx < slidePaths.length; idx++) {
    const slidePath = slidePaths[idx];
    const slideFile = zip.file(slidePath);
    if (!slideFile) continue;
    const slideXmlStr = await slideFile.async("string");

    // Загрузка картинок слайда через slideX.xml.rels
    const slideDir = slidePath.substring(0, slidePath.lastIndexOf("/"));
    const slideFileName = slidePath.substring(slidePath.lastIndexOf("/") + 1);
    const relsPath = `${slideDir}/_rels/${slideFileName}.rels`;
    const relsFile = zip.file(relsPath);
    const imageMap = {};

    if (relsFile) {
      try {
        const relsStr = await relsFile.async("string");
        const relsDoc = parser.parseFromString(relsStr, "application/xml");
        const relNodes = Array.from(relsDoc.querySelectorAll("*")).filter(n => n.localName === "Relationship");
        for (const r of relNodes) {
          const type = r.getAttribute("Type") || "";
          const target = r.getAttribute("Target") || "";
          const id = r.getAttribute("Id") || "";
          if (type.includes("image") && id && target) {
            let targetPath = target;
            if (targetPath.startsWith("../")) {
              targetPath = "ppt/" + targetPath.replace("../", "");
            } else if (!targetPath.startsWith("ppt/")) {
              targetPath = "ppt/" + targetPath;
            }
            const imgFile = zip.file(targetPath);
            if (imgFile) {
              const blob = await imgFile.async("blob");
              const blobUrl = URL.createObjectURL(blob);
              pptxImageBlobUrls.push(blobUrl);
              imageMap[id] = blobUrl;
            }
          }
        }
      } catch (err) {
        console.warn("Error loading slide images:", err);
      }
    }

    const slideDoc = parser.parseFromString(slideXmlStr, "application/xml");
    const slideData = {
      index: idx + 1,
      title: "",
      width: slideW,
      height: slideH,
      elements: [],
      connectors: []
    };

    function processContainer(container, grpCtx) {
      const children = Array.from(container.children || []);
      for (const child of children) {
        const tag = child.localName;

        if (tag === "grpSp") {
          const xfrm = getXfrm(child);
          if (!xfrm) continue;
          const world = transformBox(xfrm, grpCtx);
          const nextGrpCtx = {
            x: world.x,
            y: world.y,
            w: world.w,
            h: world.h,
            chX: (xfrm.chX !== undefined) ? xfrm.chX : xfrm.x,
            chY: (xfrm.chY !== undefined) ? xfrm.chY : xfrm.y,
            chW: (xfrm.chW !== undefined) ? xfrm.chW : xfrm.w,
            chH: (xfrm.chH !== undefined) ? xfrm.chH : xfrm.h
          };
          processContainer(child, nextGrpCtx);

        } else if (tag === "sp") {
          const xfrm = getXfrm(child);
          const world = xfrm ? transformBox(xfrm, grpCtx) : null;

          const prstNode = Array.from(child.querySelectorAll("*")).find(n => n.localName === "prstGeom");
          const geom = prstNode?.getAttribute("prst") || "rect";

          const spPr = Array.from(child.children || []).find(n => n.localName === "spPr");
          const fill = spPr ? resolveColor(spPr, "solidFill") : null;
          const ln = spPr ? Array.from(spPr.children || []).find(n => n.localName === "ln") : null;
          const border = ln ? resolveColor(ln, "solidFill") : null;

          const pNodes = Array.from(child.querySelectorAll("*")).filter(n => n.localName === "p");
          const paragraphs = [];

          pNodes.forEach(p => {
            const rNodes = Array.from(p.querySelectorAll("*")).filter(n => n.localName === "r");
            let pText = "";
            let isBold = false;
            let fontColor = null;
            let fontSizePt = null;

            rNodes.forEach(r => {
              const t = Array.from(r.querySelectorAll("*")).find(n => n.localName === "t");
              if (t && t.textContent) pText += t.textContent;
              const rPr = Array.from(r.querySelectorAll("*")).find(n => n.localName === "rPr");
              if (rPr) {
                if (rPr.getAttribute("b") === "1") isBold = true;
                const sz = parseInt(rPr.getAttribute("sz") || "0", 10);
                if (sz > 0) fontSizePt = sz / 100;
                const col = resolveColor(rPr, "solidFill");
                if (col) fontColor = col;
              }
            });

            const cleanText = pText.trim();
            if (cleanText) {
              const pPr = Array.from(p.children || []).find(n => n.localName === "pPr");
              const algn = pPr?.getAttribute("algn") || "l";
              paragraphs.push({
                text: cleanText,
                bold: isBold,
                color: fontColor,
                sizePt: fontSizePt,
                algn: algn === "ctr" ? "center" : (algn === "r" ? "right" : "left")
              });
            }
          });

          if (world && (paragraphs.length > 0 || fill || geom === "diamond")) {
            const leftPct = 1.0 + (world.x / slideW) * 98.0;
            const topPct = 1.0 + (world.y / slideH) * 98.0;
            const widthPct = (world.w / slideW) * 98.0;
            const heightPct = (world.h / slideH) * 98.0;

            slideData.elements.push({
              type: "shape",
              geom: geom,
              left: leftPct,
              top: topPct,
              width: widthPct,
              height: heightPct,
              fill: fill,
              border: border,
              paragraphs: paragraphs
            });

            if (!slideData.title && paragraphs.length > 0 && topPct < 22 && widthPct > 45) {
              slideData.title = paragraphs[0].text;
            }
          }

        } else if (tag === "pic") {
          const xfrm = getXfrm(child);
          const world = xfrm ? transformBox(xfrm, grpCtx) : null;
          const blip = Array.from(child.querySelectorAll("*")).find(n => n.localName === "blip");
          const embedId = blip?.getAttribute("r:embed") || blip?.getAttribute("embed");
          if (world && embedId && imageMap[embedId]) {
            const leftPct = 1.0 + (world.x / slideW) * 98.0;
            const topPct = 1.0 + (world.y / slideH) * 98.0;
            const widthPct = (world.w / slideW) * 98.0;
            const heightPct = (world.h / slideH) * 98.0;
            slideData.elements.push({
              type: "image",
              src: imageMap[embedId],
              left: leftPct,
              top: topPct,
              width: widthPct,
              height: heightPct
            });
          }

        } else if (tag === "cxnSp") {
          const xfrm = getXfrm(child);
          if (!xfrm) continue;
          const world = transformBox(xfrm, grpCtx);
          const prstNode = Array.from(child.querySelectorAll("*")).find(n => n.localName === "prstGeom");
          const geom = prstNode?.getAttribute("prst") || "straightConnector1";
          const spPr = Array.from(child.children || []).find(n => n.localName === "spPr");
          const ln = spPr ? Array.from(spPr.children || []).find(n => n.localName === "ln") : null;
          const stroke = ln ? (resolveColor(ln, "solidFill") || "#000000") : "#000000";

          const tail = Array.from(child.querySelectorAll("*")).find(n => n.localName === "tailEnd");
          const head = Array.from(child.querySelectorAll("*")).find(n => n.localName === "headEnd");
          const hasArrow = (tail?.getAttribute("type") === "triangle" || head?.getAttribute("type") === "triangle");

          const x1 = 10 + (xfrm.flipH ? (world.x + world.w) : world.x) / slideW * 980;
          const y1 = 5.625 + (xfrm.flipV ? (world.y + world.h) : world.y) / slideH * 551.25;
          const x2 = 10 + (xfrm.flipH ? world.x : (world.x + world.w)) / slideW * 980;
          const y2 = 5.625 + (xfrm.flipV ? world.y : (world.y + world.h)) / slideH * 551.25;

          slideData.connectors.push({
            geom: geom,
            stroke: stroke,
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2,
            hasArrow: hasArrow
          });

        } else if (tag === "graphicFrame") {
          const xfrm = getXfrm(child);
          const world = xfrm ? transformBox(xfrm, grpCtx) : null;
          const tbl = Array.from(child.querySelectorAll("*")).find(n => n.localName === "tbl");
          if (tbl && world) {
            const rows = Array.from(tbl.querySelectorAll("*")).filter(n => n.localName === "tr");
            const tableRows = [];
            rows.forEach(row => {
              const cells = Array.from(row.querySelectorAll("*")).filter(n => n.localName === "tc");
              const rCells = [];
              cells.forEach(c => {
                const texts = Array.from(c.querySelectorAll("*"))
                  .filter(n => n.localName === "t")
                  .map(n => n.textContent)
                  .join(" ")
                  .trim();
                rCells.push(texts);
              });
              if (rCells.length > 0) tableRows.push(rCells);
            });
            if (tableRows.length > 0) {
              const leftPct = 1.0 + (world.x / slideW) * 98.0;
              const topPct = 1.0 + (world.y / slideH) * 98.0;
              const widthPct = (world.w / slideW) * 98.0;
              const heightPct = (world.h / slideH) * 98.0;
              slideData.elements.push({
                type: "table",
                rows: tableRows,
                left: leftPct,
                top: topPct,
                width: widthPct,
                height: heightPct
              });
            }
          }
        }
      }
    }

    const spTree = Array.from(slideDoc.querySelectorAll("*")).find(n => n.localName === "spTree");
    if (spTree) {
      processContainer(spTree, null);
    }

    slides.push(slideData);
  }

  return slides;
}

function buildSlideCardHtml(slide, totalSlides) {
  const slideW = slide.width || 9144000;
  const slideH = slide.height || 5143500;
  const aspectRatio = (slideW / slideH).toFixed(4);

  let connectorsSvg = "";
  if (slide.connectors && slide.connectors.length > 0) {
    const linesHtml = slide.connectors.map((c) => {
      const stroke = c.stroke || "#000000";
      const markerAttr = c.hasArrow ? `marker-end="url(#arrow-${slide.index})"` : "";
      if (c.geom === "bentConnector2") {
        return `<polyline points="${c.x1},${c.y1} ${c.x1},${c.y2} ${c.x2},${c.y2}" stroke="${stroke}" stroke-width="2" fill="none" ${markerAttr}/>`;
      } else if (c.geom === "bentConnector3") {
        const midX = (c.x1 + c.x2) / 2;
        return `<polyline points="${c.x1},${c.y1} ${midX},${c.y1} ${midX},${c.y2} ${c.x2},${c.y2}" stroke="${stroke}" stroke-width="2" fill="none" ${markerAttr}/>`;
      } else {
        return `<line x1="${c.x1}" y1="${c.y1}" x2="${c.x2}" y2="${c.y2}" stroke="${stroke}" stroke-width="2" ${markerAttr}/>`;
      }
    }).join("");

    connectorsSvg = `
      <svg class="pptx-connectors-layer" viewBox="0 0 1000 562.5" preserveAspectRatio="none">
        <defs>
          <marker id="arrow-${slide.index}" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#000000" />
          </marker>
        </defs>
        ${linesHtml}
      </svg>
    `;
  }

  let elementsHtml = "";
  if (slide.elements && slide.elements.length > 0) {
    elementsHtml = slide.elements.map(el => {
      if (el.type === "image") {
        return `
          <div class="pptx-canvas-elem pptx-picture" style="left:${el.left}%;top:${el.top}%;width:${el.width}%;height:${el.height}%;">
            <img src="${el.src}" alt="Slide image" style="width:100%;height:100%;object-fit:contain;display:block;" />
          </div>
        `;
      }

      if (el.type === "table") {
        let tableHtml = `<div class="pptx-canvas-elem pptx-table-box" style="left:${el.left}%;top:${el.top}%;width:${el.width}%;height:${el.height}%;"><table class="pptx-slide-table">`;
        el.rows.forEach((r, ri) => {
          tableHtml += `<tr>`;
          r.forEach(c => {
            const tag = ri === 0 ? "th" : "td";
            tableHtml += `<${tag}>${escapeHtml(c)}</${tag}>`;
          });
          tableHtml += `</tr>`;
        });
        tableHtml += `</table></div>`;
        return tableHtml;
      }

      if (el.type === "shape") {
        const isDiamond = el.geom === "diamond";
        const borderColor = el.border || "#000000";
        const bgFill = el.fill || "transparent";

        const isDarkBg = bgFill && bgFill !== "transparent" && !bgFill.startsWith("#CF") && !bgFill.startsWith("#cf") && !bgFill.startsWith("#f") && !bgFill.startsWith("#F") && !bgFill.startsWith("#fff") && !bgFill.startsWith("#FFF");

        let diamondSvg = "";
        if (isDiamond) {
          diamondSvg = `
            <svg class="pptx-diamond-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polygon points="50,2 98,50 50,98 2,50" fill="${bgFill !== 'transparent' ? bgFill : '#cfe2f3'}" stroke="${borderColor}" stroke-width="2"/>
            </svg>
          `;
        }

        const paragraphsHtml = el.paragraphs.map(p => {
          let style = `text-align:${p.algn || 'left'};`;
          if (p.color) {
            style += `color:${p.color};`;
          } else if (isDarkBg) {
            style += `color:#ffffff;`;
          } else {
            style += `color:#111827;`;
          }
          if (p.sizePt) {
            style += `font-size:clamp(7px, ${(p.sizePt * 0.12).toFixed(2)}cqw, ${(p.sizePt * 1.15).toFixed(1)}px);`;
          }
          const isShort = p.text.length <= 22 || !p.text.includes(" ");
          if (isShort) {
            style += `white-space:nowrap;`;
          }
          const content = p.bold ? `<strong>${escapeHtml(p.text)}</strong>` : escapeHtml(p.text);
          return `<div class="pptx-text-p" style="${style}">${content}</div>`;
        }).join("");

        let shapeStyle = `left:${el.left}%;top:${el.top}%;width:${el.width}%;height:${el.height}%;`;
        if (!isDiamond) {
          if (el.fill) shapeStyle += `background-color:${el.fill};`;
          if (el.border) shapeStyle += `border:1.5px solid ${el.border};`;
          if (el.geom === "roundRect") shapeStyle += `border-radius:6px;`;
        }

        return `
          <div class="pptx-canvas-elem pptx-shape ${el.geom}" style="${shapeStyle}">
            ${diamondSvg}
            <div class="pptx-text-wrap" style="${isDiamond ? 'z-index:2;position:relative;' : ''}">
              ${paragraphsHtml}
            </div>
          </div>
        `;
      }
      return "";
    }).join("");
  }

  // Full-width borderless sheet like PDF, with discreet floating badge:
  return `
    <div class="pptx-slide-canvas" data-slide-num="${slide.index}" style="aspect-ratio:${aspectRatio};">
      <div class="pptx-slide-floating-badge">${slide.index} / ${totalSlides}</div>
      ${connectorsSvg}
      ${elementsHtml}
    </div>
  `;
}

function updatePptxView() {
  if (!pptxViewerContainer || activePptxSlides.length === 0) return;
  const total = activePptxSlides.length;

  if (isPptxAllMode) {
    // Режим "Все слайды" - полноэкранный список как в PDF
    pptxViewerContainer.innerHTML = activePptxSlides.map(s => buildSlideCardHtml(s, total)).join("");
    pptxSlideInfo.textContent = `1 / ${total}`;
    pptxPrevSlide.disabled = true;
    pptxNextSlide.disabled = true;
    pptxToggleMode.textContent = "📑";
    pptxToggleMode.title = t("singleSlide");

    fileViewerBody.onscroll = () => {
      if (isPptxAllMode && activePptxSlides.length > 0) {
        const canvases = pptxViewerContainer.querySelectorAll(".pptx-slide-canvas");
        const currentScroll = fileViewerBody.scrollTop + 140;
        let visibleSlide = 1;
        canvases.forEach(c => {
          if (c.offsetTop <= currentScroll) {
            visibleSlide = c.dataset.slideNum || 1;
          }
        });
        pptxSlideInfo.textContent = `${visibleSlide} / ${total}`;
      }
    };
  } else {
    // Режим "По слайдам"
    fileViewerBody.onscroll = null;
    const curSlide = activePptxSlides[currentPptxSlideIdx] || activePptxSlides[0];
    pptxViewerContainer.innerHTML = buildSlideCardHtml(curSlide, total);
    pptxSlideInfo.textContent = `${currentPptxSlideIdx + 1} / ${total}`;
    pptxPrevSlide.disabled = (currentPptxSlideIdx === 0);
    pptxNextSlide.disabled = (currentPptxSlideIdx === total - 1);
    pptxToggleMode.textContent = "📜";
    pptxToggleMode.title = t("allSlides");
    fileViewerBody.scrollTop = 0;
  }
  if (pptxPrevSlide) pptxPrevSlide.title = t("prevSlideBtn");
  if (pptxNextSlide) pptxNextSlide.title = t("nextSlideBtn");
}

if (pptxPrevSlide) {
  pptxPrevSlide.onclick = () => {
    if (!isPptxAllMode && currentPptxSlideIdx > 0) {
      currentPptxSlideIdx--;
      updatePptxView();
    }
  };
}

if (pptxNextSlide) {
  pptxNextSlide.onclick = () => {
    if (!isPptxAllMode && currentPptxSlideIdx < activePptxSlides.length - 1) {
      currentPptxSlideIdx++;
      updatePptxView();
    }
  };
}

if (pptxToggleMode) {
  pptxToggleMode.onclick = () => {
    isPptxAllMode = !isPptxAllMode;
    updatePptxView();
  };
}

// Навигация клавишами влево/вправо для слайдов
window.addEventListener("keydown", (e) => {
  if (fileViewerModal.style.display !== "flex") return;
  if (activePptxSlides.length > 0 && !isPptxAllMode) {
    if (e.key === "ArrowLeft" && currentPptxSlideIdx > 0) {
      currentPptxSlideIdx--;
      updatePptxView();
    } else if (e.key === "ArrowRight" && currentPptxSlideIdx < activePptxSlides.length - 1) {
      currentPptxSlideIdx++;
      updatePptxView();
    }
  }
});

// Сенсорный свайп слайдов на телефонах
let touchStartX = 0;
if (pptxViewerContainer) {
  pptxViewerContainer.addEventListener("touchstart", (e) => {
    if (e.touches && e.touches[0]) {
      touchStartX = e.touches[0].clientX;
    }
  }, { passive: true });

  pptxViewerContainer.addEventListener("touchend", (e) => {
    if (!e.changedTouches || !e.changedTouches[0] || isPptxAllMode) return;
    const diff = e.changedTouches[0].clientX - touchStartX;
    if (diff < -50 && currentPptxSlideIdx < activePptxSlides.length - 1) {
      currentPptxSlideIdx++;
      updatePptxView();
    } else if (diff > 50 && currentPptxSlideIdx > 0) {
      currentPptxSlideIdx--;
      updatePptxView();
    }
  }, { passive: true });
}

// ---------------------------------------------------------------------------
// 3. Таблицы (Excel .xlsx / .csv)
// ---------------------------------------------------------------------------
async function renderSpreadsheet(arrayBuffer, isCsv = false) {
  sheetViewerContainer.innerHTML = "";
  sheetViewerContainer.style.display = "block";

  if (isCsv) {
    const decoder = new TextDecoder("utf-8");
    const text = decoder.decode(arrayBuffer);
    const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
    if (lines.length === 0) {
      sheetViewerContainer.innerHTML = "<p style='color:#8b949e;text-align:center;'>Таблица пуста</p>";
      return;
    }
    const delimiter = text.includes("\t") ? "\t" : (text.includes(";") ? ";" : ",");
    let html = `<table class="sheet-table">`;
    lines.forEach((line, li) => {
      const cols = line.split(delimiter);
      html += `<tr>`;
      cols.forEach(c => {
        const tag = li === 0 ? "th" : "td";
        html += `<${tag}>${escapeHtml(c.trim())}</${tag}>`;
      });
      html += `</tr>`;
    });
    html += `</table>`;
    sheetViewerContainer.innerHTML = html;
    return;
  }

  // Парсинг .xlsx через JSZip
  try {
    const zip = await JSZip.loadAsync(arrayBuffer);

    // 1. Shared Strings
    const sstFile = zip.file("xl/sharedStrings.xml");
    const sharedStrings = [];
    if (sstFile) {
      const sstXml = await sstFile.async("string");
      const parser = new DOMParser();
      const sstDoc = parser.parseFromString(sstXml, "application/xml");
      const siNodes = Array.from(sstDoc.querySelectorAll("*")).filter(n => n.localName === "si");
      siNodes.forEach(si => {
        const tNodes = Array.from(si.querySelectorAll("*")).filter(n => n.localName === "t");
        sharedStrings.push(tNodes.map(t => t.textContent).join(""));
      });
    }

    // 2. Первый лист
    const sheetFile = zip.file("xl/worksheets/sheet1.xml");
    if (!sheetFile) throw new Error("sheet1.xml not found");
    const sheetXml = await sheetFile.async("string");
    const parser = new DOMParser();
    const sheetDoc = parser.parseFromString(sheetXml, "application/xml");
    const rows = Array.from(sheetDoc.querySelectorAll("*")).filter(n => n.localName === "row");

    if (rows.length === 0) {
      sheetViewerContainer.innerHTML = "<p style='color:#8b949e;text-align:center;'>Таблица пуста</p>";
      return;
    }

    let html = `<table class="sheet-table">`;
    rows.forEach((row, ri) => {
      const cells = Array.from(row.querySelectorAll("*")).filter(n => n.localName === "c");
      html += `<tr>`;
      cells.forEach(cell => {
        const tAttr = cell.getAttribute("t");
        const vNode = Array.from(cell.querySelectorAll("*")).find(n => n.localName === "v");
        let val = vNode ? vNode.textContent : "";
        if (tAttr === "s" && sharedStrings[parseInt(val, 10)] !== undefined) {
          val = sharedStrings[parseInt(val, 10)];
        }
        const tag = ri === 0 ? "th" : "td";
        html += `<${tag}>${escapeHtml(val)}</${tag}>`;
      });
      html += `</tr>`;
    });
    html += `</table>`;
    sheetViewerContainer.innerHTML = html;

  } catch (err) {
    console.error("Spreadsheet parse error:", err);
    showFileCard(currentViewerFileObj, "📈", t("docLoadError"));
  }
}

// ---------------------------------------------------------------------------
// 4. Карточка-заглушка с кнопками действия (для .ppt, архивов и сбоев)
// ---------------------------------------------------------------------------
function showFileCard(fileObj, icon = "📁", noticeText = "") {
  resetViewerContainers();
  cardViewerContainer.style.display = "flex";
  fileCardIcon.textContent = icon;
  fileCardName.textContent = fileObj.title || "";
  fileCardNotice.textContent = noticeText || t("pptFormatNotice");

  const url = `${API_BASE}/file/view/${fileObj.id}`;

  if (cardDownloadBtn) {
    cardDownloadBtn.textContent = t("downloadFile");
    cardDownloadBtn.onclick = () => {
      if (tg && tg.openLink) {
        tg.openLink(url);
      } else {
        window.open(url, "_blank");
      }
    };
  }

  if (cardSendChatBtn) {
    cardSendChatBtn.textContent = t("sendToChatBtn");
    cardSendChatBtn.onclick = async () => {
      cardSendChatBtn.disabled = true;
      cardSendChatBtn.textContent = t("sendingBtn");
      try {
        const uid = currentUserId || (tg?.initDataUnsafe?.user?.id);
        const res = await fetch(`${API_BASE}/send-to-chat?userId=${uid}&fileId=${fileObj.id}`, { method: "POST" });
        if (res.ok) {
          notify(t("sentOk"));
        } else {
          notify(t("sendErr"));
        }
      } catch (e) {
        notify(t("netErr"));
      } finally {
        cardSendChatBtn.disabled = false;
        cardSendChatBtn.textContent = t("sendToChatBtn");
      }
    };
  }
}

// Копирование кода / текста
if (codeCopyBtn) {
  codeCopyBtn.onclick = async () => {
    if (!currentCodeText) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(currentCodeText);
      } else {
        const ta = document.createElement("textarea");
        ta.value = currentCodeText;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      notify(t("copied"));
    } catch (e) {
      notify(t("copied"));
    }
  };
}

// ---------------------------------------------------------------------------
// 5. Парсер и просмотрщик Markdown (.md) с таблицами, кодом и копированием
// ---------------------------------------------------------------------------
function renderMarkdown(md) {
  if (!md) return "";
  let text = md.replace(/\r\n/g, "\n");

  // Code blocks: ```lang ... ```
  const codeBlocks = [];
  text = text.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (match, lang, code) => {
    const idx = codeBlocks.length;
    const escaped = escapeHtml(code.trimEnd());
    const langLabel = lang ? escapeHtml(lang) : "code";
    codeBlocks.push(`
      <div class="md-code-block">
        <div class="md-code-header">
          <span class="md-code-lang">${langLabel}</span>
          <button class="md-copy-btn" onclick="copyBlockCode(this)">${t("copyCode") || "Nusxalash"}</button>
        </div>
        <pre><code class="language-${langLabel}">${escaped}</code></pre>
      </div>
    `);
    return `@@CODE_BLOCK_${idx}@@`;
  });

  // Inline code: `code`
  const inlineCodes = [];
  text = text.replace(/`([^`\n]+)`/g, (match, code) => {
    const idx = inlineCodes.length;
    inlineCodes.push(`<code>${escapeHtml(code)}</code>`);
    return `@@INLINE_CODE_${idx}@@`;
  });

  function formatInline(str) {
    let s = str;
    s = s.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>');
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    s = s.replace(/~~([^~]+)~~/g, '<del>$1</del>');
    s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    return s;
  }

  const lines = text.split("\n");
  const processedLines = [];
  let inTable = false;
  let tableRows = [];

  function flushTable() {
    if (tableRows.length === 0) return;
    let html = `<div class="md-table-wrap"><table>`;
    let isHeader = true;
    for (let r = 0; r < tableRows.length; r++) {
      const row = tableRows[r].trim();
      if (/^\|?(\s*:?-+:?\s*\|?)+$/.test(row)) {
        isHeader = false;
        continue;
      }
      const cols = row.split("|").slice(1, -1);
      if (cols.length === 0) continue;
      const tag = isHeader ? "th" : "td";
      html += `<tr>`;
      cols.forEach(c => {
        html += `<${tag}>${formatInline(c.trim())}</${tag}>`;
      });
      html += `</tr>`;
      if (r === 0) isHeader = false;
    }
    html += `</table></div>`;
    processedLines.push(html);
    tableRows = [];
    inTable = false;
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
      inTable = true;
      tableRows.push(line);
      continue;
    } else if (inTable) {
      flushTable();
    }

    if (/^#### (.*)$/.test(line)) {
      processedLines.push(`<h4>${formatInline(line.replace(/^#### /, ""))}</h4>`);
    } else if (/^### (.*)$/.test(line)) {
      processedLines.push(`<h3>${formatInline(line.replace(/^### /, ""))}</h3>`);
    } else if (/^## (.*)$/.test(line)) {
      processedLines.push(`<h2>${formatInline(line.replace(/^## /, ""))}</h2>`);
    } else if (/^# (.*)$/.test(line)) {
      processedLines.push(`<h1>${formatInline(line.replace(/^# /, ""))}</h1>`);
    } else if (/^---$/.test(line.trim()) || /^___$/.test(line.trim())) {
      processedLines.push(`<hr>`);
    } else if (/^>\s?(.*)$/.test(line)) {
      processedLines.push(`<blockquote>${formatInline(line.replace(/^>\s?/, ""))}</blockquote>`);
    } else if (/^[-*]\s+(.*)$/.test(line)) {
      processedLines.push(`<li>${formatInline(line.replace(/^[-*]\s+/, ""))}</li>`);
    } else if (/^\d+\.\s+(.*)$/.test(line)) {
      processedLines.push(`<li>${formatInline(line.replace(/^\d+\.\s+/, ""))}</li>`);
    } else if (line.trim() === "") {
      processedLines.push(``);
    } else {
      processedLines.push(`<p>${formatInline(line)}</p>`);
    }
  }
  if (inTable) {
    flushTable();
  }

  let finalHtml = processedLines.join("\n");
  finalHtml = finalHtml.replace(/(<li>[\s\S]*?<\/li>\s*)+/g, (m) => `<ul>${m}</ul>`);
  finalHtml = finalHtml.replace(/@@INLINE_CODE_(\d+)@@/g, (m, idx) => inlineCodes[idx] || "");
  finalHtml = finalHtml.replace(/@@CODE_BLOCK_(\d+)@@/g, (m, idx) => codeBlocks[idx] || "");

  return finalHtml;
}

window.copyBlockCode = async function(btn) {
  try {
    const block = btn.closest(".md-code-block");
    const codeEl = block?.querySelector("code");
    if (!codeEl) return;
    const text = codeEl.textContent || "";
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    const orig = btn.textContent;
    btn.textContent = t("copied") || "✅ Nusxalandi!";
    setTimeout(() => { btn.textContent = orig; }, 1800);
  } catch (e) {
    notify(t("copied"));
  }
};

async function fetchFileWithRetry(url, maxRetries = 5, delayMs = 1200) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const res = await fetch(url);
    if (res.status === 202) {
      if (attempt < maxRetries) {
        if (viewerLoadingText) {
          viewerLoadingText.textContent = t("fileNotReadyYet") || t("docLoading");
        }
        await new Promise(r => setTimeout(r, delayMs));
        continue;
      }
    }
    return res;
  }
  return await fetch(url);
}

// ---------------------------------------------------------------------------
// 6. Главный универсальный просмотрщик (openUniversalViewer)
// ---------------------------------------------------------------------------
async function openUniversalViewer(fileObj) {
  resetViewerContainers();
  currentViewerFileObj = fileObj;
  fileViewerTitle.textContent = fileObj.title || "";
  fileViewerModal.dataset.fileId = fileObj.id;
  fileViewerModal.style.display = "flex";

  if (viewerLoading) {
    viewerLoading.style.display = "flex";
    viewerLoadingText.textContent = t("docLoading");
  }

  const url = `${API_BASE}/file/view/${fileObj.id}`;
  const meta = getFileMeta(fileObj.title);

  try {
    // 0. Markdown (.md)
    if (meta.type === "markdown") {
      const res = await fetchFileWithRetry(url);
      if (!res.ok) throw new Error("HTTP " + res.status);
      const mdText = await res.text();
      if (!mdText || mdText.trim().length === 0) {
        throw new Error("Empty markdown file");
      }
      const html = renderMarkdown(mdText);
      const mdContainer = document.getElementById("markdownViewerContainer");
      if (mdContainer) {
        mdContainer.innerHTML = html;
        mdContainer.style.display = "block";
      }
      if (viewerLoading) viewerLoading.style.display = "none";
      return;
    }

    // 1. Презентация PowerPoint (.pptx) или PDF (.pdf)
    if (meta.type === "pptx" || meta.type === "pdf") {
      const fname = (fileObj.title || "").toLowerCase();
      if (fname.endsWith(".ppt") && !fname.endsWith(".pptx")) {
        // Старый бинарный формат PowerPoint 97-2003 (.ppt)
        if (viewerLoading) viewerLoading.style.display = "none";
        showFileCard(fileObj, "📊", t("pptFormatNotice"));
        return;
      }
      const res = await fetchFileWithRetry(url);
      if (!res.ok) throw new Error("HTTP " + res.status);
      const ab = await res.arrayBuffer();

      // Векторный ли это PDF (включая сконвертированные на сервере презентации для 100% точности)
      const u8 = new Uint8Array(ab.slice(0, 5));
      const isPdfBytes = (u8[0] === 0x25 && u8[1] === 0x50 && u8[2] === 0x44 && u8[3] === 0x46); // %PDF-
      const isPdfContentType = res.headers?.get("content-type")?.includes("application/pdf");

      if (isPdfBytes || isPdfContentType || meta.type === "pdf") {
        activePdfArrayBuffer = ab;
        activePdfScale = 1.0;
        await renderPdfDocument(activePdfArrayBuffer, 1.0);
        return;
      }

      // Если не PDF, парсим PPTX через DrawingML
      activePptxSlides = await parsePptxSlides(ab);
      currentPptxSlideIdx = 0;
      isPptxAllMode = true;
      pptxViewerContainer.style.display = "flex";
      pptxControls.style.display = "flex";
      updatePptxView();
      if (viewerLoading) viewerLoading.style.display = "none";
      return;
    }

    // 2. Word Документ (.docx)
    if (meta.type === "docx") {
      const fname = (fileObj.title || "").toLowerCase();
      if (fname.endsWith(".doc") && !fname.endsWith(".docx")) {
        if (viewerLoading) viewerLoading.style.display = "none";
        showFileCard(fileObj, "📝", t("pptFormatNotice").replace(".ppt", ".doc"));
        return;
      }
      const res = await fetchFileWithRetry(url);
      if (!res.ok) throw new Error("HTTP " + res.status);
      const ab = await res.arrayBuffer();
      docViewerContainer.style.display = "block";
      if (viewerLoading) viewerLoading.style.display = "none";
      if (window.mammoth) {
        const converted = await mammoth.convertToHtml({ arrayBuffer: ab });
        docViewerContainer.innerHTML = converted.value || "<p>Документ пуст</p>";
      } else {
        docViewerContainer.innerHTML = `<p>${t("docLoadError")}</p>`;
      }
      return;
    }

    // 3. Таблицы (.xlsx, .xls, .csv)
    if (meta.type === "xlsx") {
      const fname = (fileObj.title || "").toLowerCase();
      const res = await fetchFileWithRetry(url);
      if (!res.ok) throw new Error("HTTP " + res.status);
      const ab = await res.arrayBuffer();
      if (viewerLoading) viewerLoading.style.display = "none";
      await renderSpreadsheet(ab, fname.endsWith(".csv"));
      return;
    }

    // 4. Изображение
    if (meta.type === "image") {
      viewerImage.src = url;
      imageViewerContainer.style.display = "flex";
      if (viewerLoading) viewerLoading.style.display = "none";
      return;
    }

    // 5. Аудио (.mp3, .wav, .ogg, .m4a)
    if (meta.type === "audio") {
      audioTrackTitle.textContent = fileObj.title || "Аудиозапись";
      viewerAudio.src = url;
      audioViewerContainer.style.display = "flex";
      viewerAudio.load();
      if (viewerLoading) viewerLoading.style.display = "none";
      return;
    }

    // 6. Текст или исходный код
    if (meta.type === "text") {
      const res = await fetchFileWithRetry(url);
      if (!res.ok) throw new Error("HTTP " + res.status);
      currentCodeText = await res.text();
      viewerCode.textContent = currentCodeText;
      codeViewerContainer.style.display = "block";
      if (codeCopyBtn) codeCopyBtn.style.display = "flex";
      if (viewerLoading) viewerLoading.style.display = "none";
      return;
    }

    // 7. Архивы или прочие форматы
    if (meta.type === "zip") {
      if (viewerLoading) viewerLoading.style.display = "none";
      showFileCard(fileObj, "📦", "Файловый архив");
      return;
    }

    // Fallback: пробуем iframe или карточку
    fileViewerFrame.src = url;
    fileViewerFrame.style.display = "block";
    if (viewerLoading) viewerLoading.style.display = "none";

  } catch (err) {
    console.error("Ошибка открытия файла:", err);
    if (viewerLoading) viewerLoading.style.display = "none";
    showFileCard(fileObj, meta.icon || "📁", t("docLoadError"));
  }
}

async function fileExistsOnServer(url) {
  try {
    const res = await fetch(url, { method: "HEAD" });
    return res.ok;
  } catch (e) {
    return false;
  }
}

// Открытие любого файла (Презентации, PDF, Word, Картинки, Видео, Архивы)
openDirectBtn.onclick = async () => {
  const l = currentSelectedLesson;
  if (!l) return;
  let fileObj = null;

  if (activeTab === "hw") fileObj = l.hwFiles?.[currentHwFileIdx];
  if (activeTab === "pdf") fileObj = l.pdfs?.[currentPdfIdx];
  if (activeTab === "zip") fileObj = l.zips?.[currentZipIdx];

  if (!fileObj) return;

  const fname = (fileObj.title || "").toLowerCase();
  const meta = getFileMeta(fname);

  // Видео - загружаем в плеер
  if (meta.type === "video" || fileObj.isVideo || fname.endsWith(".mp4") || fname.endsWith(".mov")) {
    videoPlayer.src = `${API_BASE}/video/stream/${fileObj.id}`;
    videoPlayer.load();
    videoPlayer.play().catch(() => {});
    videoPartTitle.textContent = fileObj.title;
    notify(t("hwVideoLoaded"));
    return;
  }

  const url = `${API_BASE}/file/view/${fileObj.id}`;
  const ready = await fileExistsOnServer(url);
  if (!ready) {
    notify(t("fileNotReadyYet"));
    return;
  }

  // Все файлы (PPTX, PDF, DOCX, XLSX, TXT, картинки, аудио, архивы) открываются прямо в Mini App
  openUniversalViewer(fileObj);
};

// Point 7: Поворот видео и полноэкранный режим
const videoContainer = document.getElementById("videoContainer");
const rotateVideoBtn = document.getElementById("rotateVideoBtn");
const exitLandscapeBtn = document.getElementById("exitLandscapeBtn");
let isRotatedLandscape = false;

function isMobilePhone() {
  const ua = (navigator.userAgent || "").toLowerCase();
  const isMobileOS = /android|iphone|ipod/i.test(ua);
  return isMobileOS && (window.innerWidth < window.innerHeight);
}

function getRotateButtonTitle() {
  if (!isMobilePhone()) {
    const dict = {
      ru: "Во весь экран",
      uz: "To'liq ekran",
      en: "Fullscreen",
    };
    return dict[currentLang] || dict.ru;
  } else {
    return t("rotateVideo");
  }
}

function toggleVideoRotation() {
  if (isMobilePhone()) {
    // На смартфонах в вертикальном положении: поворот в альбомный режим (CSS landscape)
    isRotatedLandscape = !isRotatedLandscape;
    if (isRotatedLandscape) {
      applyCssLandscape();
      if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock('landscape').catch(() => {});
      }
    } else {
      exitCssLandscape();
      if (screen.orientation && screen.orientation.unlock) {
        screen.orientation.unlock();
      }
    }
  } else {
    // На ПК (десктоп, ноутбук): НИКАКОГО поворота на 90 градусов!
    // Обычный горизонтальный полноэкранный режим (как на втором скриншоте)!
    exitCssLandscape();
    const isFs = !!(document.fullscreenElement || document.webkitFullscreenElement);
    if (!isFs) {
      if (videoPlayer.requestFullscreen) {
        videoPlayer.requestFullscreen().catch(() => {});
      } else if (videoPlayer.webkitRequestFullscreen) {
        videoPlayer.webkitRequestFullscreen();
      } else if (videoContainer && videoContainer.requestFullscreen) {
        videoContainer.requestFullscreen().catch(() => {});
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  }
}

function updateRotateBtnTooltip() {
  if (!rotateVideoBtn) return;
  const text = getRotateButtonTitle();
  rotateVideoBtn.title = text;
  rotateVideoBtn.setAttribute("aria-label", text);
  rotateVideoBtn.setAttribute("data-tooltip", text);
}

let rotateBtnHideTimer = null;

function showRotateBtn() {
  if (isRotatedLandscape || !rotateVideoBtn) return;
  rotateVideoBtn.classList.remove("hidden");
  updateRotateBtnTooltip();
  clearTimeout(rotateBtnHideTimer);
  if (!videoPlayer.paused && !videoPlayer.ended) {
    rotateBtnHideTimer = setTimeout(() => {
      rotateVideoBtn.classList.add("hidden");
    }, 2500);
  }
}

function applyCssLandscape() {
  videoContainer.classList.add("in-landscape-mode");
  exitLandscapeBtn.style.display = "flex";
  rotateVideoBtn.style.display = "none";
}

function exitCssLandscape() {
  videoContainer.classList.remove("in-landscape-mode");
  exitLandscapeBtn.style.display = "none";
  rotateVideoBtn.style.display = "flex";
  isRotatedLandscape = false;
  showRotateBtn();
}

if (rotateVideoBtn) {
  rotateVideoBtn.onclick = (e) => {
    e.stopPropagation();
    toggleVideoRotation();
  };
  rotateVideoBtn.addEventListener("mouseenter", () => {
    updateRotateBtnTooltip();
  });
}

if (exitLandscapeBtn) {
  exitLandscapeBtn.onclick = (e) => {
    e.stopPropagation();
    exitCssLandscape();
  };
}

if (videoPlayer) {
  videoPlayer.addEventListener("play", () => {
    showRotateBtn();
  });
  videoPlayer.addEventListener("pause", () => {
    clearTimeout(rotateBtnHideTimer);
    if (rotateVideoBtn) rotateVideoBtn.classList.remove("hidden");
  });
  videoPlayer.addEventListener("ended", () => {
    clearTimeout(rotateBtnHideTimer);
    if (rotateVideoBtn) rotateVideoBtn.classList.remove("hidden");
  });
}

if (videoContainer) {
  videoContainer.addEventListener("mousemove", showRotateBtn);
  videoContainer.addEventListener("touchstart", showRotateBtn, { passive: true });
}

// YouTube-style Quick Seek (+5, +10, +15...) & Center Orientation Flip
const videoGestureLayer = document.getElementById("videoGestureLayer");
const seekOverlayLeft = document.getElementById("seekOverlayLeft");
const seekOverlayRight = document.getElementById("seekOverlayRight");
const seekSecondsLeft = document.getElementById("seekSecondsLeft");
const seekSecondsRight = document.getElementById("seekSecondsRight");
const tapFeedbackCenter = document.getElementById("tapFeedbackCenter");

let quickSeekAccumulator = 0;
let quickSeekSide = null; // 'left' | 'right' | null
let quickSeekHideTimer = null;
let centerFeedbackTimer = null;

function triggerCenterFeedback() {
  if (!tapFeedbackCenter) return;
  hideSeekFeedback();
  clearTimeout(centerFeedbackTimer);
  tapFeedbackCenter.style.display = "flex";
  tapFeedbackCenter.classList.remove("show");
  tapFeedbackCenter.classList.add("show");
  centerFeedbackTimer = setTimeout(() => {
    tapFeedbackCenter.classList.remove("show");
    setTimeout(() => {
      if (!tapFeedbackCenter.classList.contains("show")) {
        tapFeedbackCenter.style.display = "none";
      }
    }, 220);
  }, 650);
}

function hideSeekFeedback() {
  if (seekOverlayLeft) {
    seekOverlayLeft.classList.remove("active");
    seekOverlayLeft.style.display = "none";
  }
  if (seekOverlayRight) {
    seekOverlayRight.classList.remove("active");
    seekOverlayRight.style.display = "none";
  }
  clearTimeout(quickSeekHideTimer);
}

function showSeekFeedback(side, seconds) {
  if (tapFeedbackCenter) {
    tapFeedbackCenter.classList.remove("show");
    tapFeedbackCenter.style.display = "none";
  }
  const overlay = side === "right" ? seekOverlayRight : seekOverlayLeft;
  const otherOverlay = side === "right" ? seekOverlayLeft : seekOverlayRight;
  const label = side === "right" ? seekSecondsRight : seekSecondsLeft;

  if (otherOverlay) {
    otherOverlay.classList.remove("active");
    otherOverlay.style.display = "none";
  }
  if (!overlay || !label) return;

  label.textContent = side === "right" ? `+${seconds}` : `${seconds}`;

  overlay.style.display = "flex";
  overlay.classList.add("active");

  clearTimeout(quickSeekHideTimer);
  quickSeekHideTimer = setTimeout(() => {
    overlay.classList.remove("active");
    setTimeout(() => {
      if (!overlay.classList.contains("active")) {
        overlay.style.display = "none";
      }
    }, 220);
    quickSeekAccumulator = 0;
    quickSeekSide = null;
  }, 850);
}

function performQuickSeek(side) {
  if (!videoPlayer) return;

  if (quickSeekSide !== side) {
    quickSeekAccumulator = 0;
    quickSeekSide = side;
  }

  quickSeekAccumulator += 5;
  const dur = Number.isFinite(videoPlayer.duration) ? videoPlayer.duration : Infinity;

  if (side === "right") {
    videoPlayer.currentTime = Math.min(dur, videoPlayer.currentTime + 5);
  } else {
    videoPlayer.currentTime = Math.max(0, videoPlayer.currentTime - 5);
  }

  showSeekFeedback(side, quickSeekAccumulator);
}

let lastTapTime = 0;
let clickTimer = null;
let clickCount = 0;

let lastTouchTimestamp = 0;

function handleGesturePointer(clientX, clientY) {
  if (!videoPlayer) return;
  const isFs = !!(document.fullscreenElement || document.webkitFullscreenElement);
  const targetEl = isFs ? videoContainer : (videoPlayer || videoContainer);
  const rect = targetEl ? targetEl.getBoundingClientRect() : { width: 0, height: 0, left: 0, top: 0 };
  if (rect.width <= 0 || rect.height <= 0) return;

  let relX;
  if (videoContainer && videoContainer.classList.contains("in-landscape-mode")) {
    relX = (clientY - rect.top) / rect.height;
  } else {
    relX = (clientX - rect.left) / rect.width;
  }

  // СТРОГО 50 НА 50 ДЛЯ ВСЕХ УСТРОЙСТВ И РЕЖИМОВ (ПК, смартфоны, обычный и фуллскрин):
  // Левые 50% (< 0.5) — ВСЕГДА перемотка назад (-5, -10, -15...)
  // Правые 50% (>= 0.5) — ВСЕГДА перемотка вперед (+5, +10, +15...)
  const side = relX < 0.5 ? "left" : "right";

  const now = Date.now();
  const timeDiff = now - lastTapTime;

  // Если уже идёт активная серия быстрых перемоток на этой стороне (3-е, 4-е нажатие и т.д.):
  if (quickSeekSide && quickSeekSide === side && timeDiff < 850) {
    clearTimeout(clickTimer);
    clickCount = 0;
    lastTapTime = now;
    performQuickSeek(side);
    return;
  }

  clickCount++;
  if (clickCount === 1) {
    lastTapTime = now;
    clickTimer = setTimeout(() => {
      // Одиночный клик: переключение пауза/воспроизведение
      clickCount = 0;
      if (videoPlayer.paused) {
        videoPlayer.play().catch(() => {});
      } else {
        videoPlayer.pause();
      }
      showRotateBtn();
    }, 240);
  } else if (clickCount >= 2) {
    // Двойной клик / тап: мгновенная перемотка 50/50 (никогда не закрывает полноэкранный режим!)
    clearTimeout(clickTimer);
    clickCount = 0;
    lastTapTime = now;
    performQuickSeek(side);
  }
}

// Привязка к слою жестов поверх видео
if (videoGestureLayer) {
  videoGestureLayer.addEventListener("touchstart", (e) => {
    if (e.touches && e.touches.length === 1) {
      lastTouchTimestamp = Date.now();
      const t = e.touches[0];
      handleGesturePointer(t.clientX, t.clientY);
    }
  }, { passive: true });

  videoGestureLayer.addEventListener("click", (e) => {
    // Защита от дублирования событий на сенсорных экранах (touch + synthetic click)
    if (Date.now() - lastTouchTimestamp < 600) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    handleGesturePointer(e.clientX, e.clientY);
  });

  videoGestureLayer.addEventListener("dblclick", (e) => {
    e.preventDefault();
    e.stopPropagation();
  });

  videoGestureLayer.addEventListener("mousedown", (e) => {
    if (e.detail > 1) {
      e.preventDefault();
    }
  });

  videoGestureLayer.addEventListener("mousemove", showRotateBtn);
}

// Защитные перехватчики на самом элементе видео
videoPlayer.addEventListener("dblclick", (e) => {
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
  handleGesturePointer(e.clientX, e.clientY);
  return false;
}, { capture: true });

videoPlayer.addEventListener("mousedown", (e) => {
  if (e.detail > 1) {
    e.preventDefault();
    e.stopPropagation();
  }
}, { capture: true });

if (videoContainer) {
  videoContainer.addEventListener("dblclick", (e) => {
    if (e.target !== exitLandscapeBtn && e.target !== rotateVideoBtn) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, { capture: true });
}

// Горячие клавиши на ПК (пробел: пауза/плей, стрелки: +/-5 сек, F: весь экран)
window.addEventListener("keydown", (e) => {
  if (document.activeElement === liveSearchInput) return;

  if (e.key === "f" || e.key === "F" || e.key === "а" || e.key === "А") {
    e.preventDefault();
    toggleVideoRotation();
  } else if (e.key === "ArrowRight") {
    e.preventDefault();
    performQuickSeek("right");
  } else if (e.key === "ArrowLeft") {
    e.preventDefault();
    performQuickSeek("left");
  } else if (e.key === " " && document.activeElement.tagName !== "BUTTON") {
    e.preventDefault();
    if (videoPlayer.paused) {
      videoPlayer.play().catch(() => {});
    } else {
      videoPlayer.pause();
    }
  }
});

// Отправка файла в Telegram-чат (Point 3 & Point 8)
sendActionBtn.onclick = async () => {
  const l = currentSelectedLesson;
  if (!l) return;
  let fileId = null;

  if (activeTab === "hw") fileId = l.hwFiles?.[currentHwFileIdx]?.id;
  if (activeTab === "pdf") fileId = l.pdfs?.[currentPdfIdx]?.id;
  if (activeTab === "zip") fileId = l.zips?.[currentZipIdx]?.id;

  if (!fileId) return;

  const uid = getTelegramUserId();
  if (!uid) {
    notify(t("openInTelegram"));
    return;
  }

  sendActionBtn.disabled = true;
  sendActionBtn.textContent = t("sendingBtn");

  try {
    const res = await fetch(`${API_BASE}/send-to-chat?userId=${uid}&fileId=${fileId}`, { method: "POST" });
    if (res.ok) {
      notify(t("sentOk"));
    } else {
      notify(t("sendErr"));
    }
  } catch (e) {
    notify(t("netErr"));
  } finally {
    sendActionBtn.disabled = false;
    sendActionBtn.textContent = t("sendToChatBtn");
  }
};

// Меню селекторов
monthDropdownBtn.onclick = (e) => {
  e.stopPropagation();
  lessonDropdownMenu.classList.remove("open");
  monthDropdownMenu.classList.toggle("open");
};

lessonDropdownBtn.onclick = (e) => {
  e.stopPropagation();
  monthDropdownMenu.classList.remove("open");
  lessonDropdownMenu.classList.toggle("open");
};

document.addEventListener("click", () => {
  monthDropdownMenu.classList.remove("open");
  lessonDropdownMenu.classList.remove("open");
  searchResults.style.display = "none";
});

// Живой поиск
function fuzzyMatch(pattern, str) {
  pattern = pattern.toLowerCase().trim();
  str = str.toLowerCase();
  if (!pattern) return 1.0;
  if (str.includes(pattern)) return 0.95;

  let pIdx = 0;
  let score = 0;
  for (let i = 0; i < str.length; i++) {
    if (str[i] === pattern[pIdx]) {
      score++;
      pIdx++;
      if (pIdx === pattern.length) break;
    }
  }
  return score / pattern.length;
}

liveSearchInput.oninput = (e) => {
  const query = e.target.value;
  clearSearchBtn.style.display = query ? "block" : "none";

  if (!query || query.trim().length < 2) {
    searchResults.style.display = "none";
    searchResults.innerHTML = "";
    return;
  }

  const results = allLessons
    .map(l => ({ lesson: l, score: fuzzyMatch(query, `${l.title} ${t("lessonWord")} ${l.lessonNumber} ${t("moduleWord")} ${l.monthNumber}`) }))
    .filter(item => item.score >= 0.45)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  if (results.length === 0) {
    searchResults.innerHTML = `<div class="search-item"><span class="search-item-title">${t("nothingFound")}</span></div>`;
    searchResults.style.display = "block";
    return;
  }

  searchResults.innerHTML = "";
  results.forEach(({ lesson }) => {
    const div = document.createElement("div");
    div.className = "search-item";
    div.innerHTML = `
      <span class="search-item-title">${t("lessonWord")} ${lesson.lessonNumber}: ${lesson.title}</span>
      <span class="search-item-sub">${t("moduleWord")} ${lesson.monthNumber}</span>
    `;
    div.onclick = (ev) => {
      ev.stopPropagation();
      selectLesson(lesson);
      searchResults.style.display = "none";
      liveSearchInput.value = "";
      clearSearchBtn.style.display = "none";
    };
    searchResults.appendChild(div);
  });
  searchResults.style.display = "block";
};

clearSearchBtn.onclick = () => {
  liveSearchInput.value = "";
  clearSearchBtn.style.display = "none";
  searchResults.style.display = "none";
};

init();

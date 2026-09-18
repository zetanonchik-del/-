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
    tabHw: "📝 Домашка",
    tabPdf: "📄 Конспекты PDF",
    tabZip: "📦 Исходный код",
    fileCount: (i, n) => `Файл ${i}/${n}`,
    attachedFile: (title) => `📎 Прикрепленный файл: ${title}`,
    noHomeworkText: "Письменное задание отсутствует.",
    openPdfBtn: "👁 Открыть PDF",
    openPptBtn: "👁 Смотреть презентацию",
    openDocBtn: "👁 Открыть документ",
    openSheetBtn: "👁 Открыть таблицу",
    readTextBtn: "👁 Читать текст",
    viewImageBtn: "👁 Просмотр фото",
    playAudioBtn: "🎵 Слушать аудио",
    watchVideoBtn: "▶️ Смотреть видео",
    downloadZipBtn: "📥 Скачать ZIP",
    downloadFile: "📥 Скачать файл",
    openFileBtn: "👁 Открыть файл",
    sendToChatBtn: "💬 Отправить в чат",
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
    copyCode: "📋 Скопировать",
    copied: "✅ Скопировано!",
    allSlides: "📜 Все слайды",
    singleSlide: "📑 По слайдам",
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
    tabHw: "📝 Uyga vazifa",
    tabPdf: "📄 Taqdimotlar PDF",
    tabZip: "📦 Dars fayllari",
    fileCount: (i, n) => `Fayl ${i}/${n}`,
    attachedFile: (title) => `📎 Ilova qilingan fayl: ${title}`,
    noHomeworkText: "Yozma topshiriq mavjud emas.",
    openPdfBtn: "👁 PDF ochish",
    openPptBtn: "👁 Taqdimotni ochish",
    openDocBtn: "👁 Hujjatni ochish",
    openSheetBtn: "👁 Jadvalni ochish",
    readTextBtn: "👁 Matnni o'qish",
    viewImageBtn: "👁 Rasmni ko'rish",
    playAudioBtn: "🎵 Audioni tinglash",
    watchVideoBtn: "▶️ Videoni ko'rish",
    downloadZipBtn: "📥 ZIP yuklab olish",
    downloadFile: "📥 Faylni yuklab olish",
    openFileBtn: "👁 Faylni ochish",
    sendToChatBtn: "💬 Chatga yuborish",
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
    copyCode: "📋 Nusxalash",
    copied: "✅ Nusxalandi!",
    allSlides: "📜 Barcha slaydlar",
    singleSlide: "📑 Slaydma-slayd",
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
    tabHw: "📝 Homework",
    tabPdf: "📄 Slides PDF",
    tabZip: "📦 Source Code",
    fileCount: (i, n) => `File ${i}/${n}`,
    attachedFile: (title) => `📎 Attached file: ${title}`,
    noHomeworkText: "No written assignment.",
    openPdfBtn: "👁 Open PDF",
    openPptBtn: "👁 View presentation",
    openDocBtn: "👁 Open document",
    openSheetBtn: "👁 Open spreadsheet",
    readTextBtn: "👁 Read text",
    viewImageBtn: "👁 View image",
    playAudioBtn: "🎵 Play audio",
    watchVideoBtn: "▶️ Watch video",
    downloadZipBtn: "📥 Download ZIP",
    downloadFile: "📥 Download file",
    openFileBtn: "👁 Open file",
    sendToChatBtn: "💬 Send to chat",
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
    copyCode: "📋 Copy",
    copied: "✅ Copied!",
    allSlides: "📜 All slides",
    singleSlide: "📑 By slide",
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

  const tabHw = document.querySelector('.tab-item[data-tab="hw"]');
  const tabPdf = document.querySelector('.tab-item[data-tab="pdf"]');
  const tabZip = document.querySelector('.tab-item[data-tab="zip"]');
  if (tabHw) tabHw.textContent = t("tabHw");
  if (tabPdf) tabPdf.textContent = t("tabPdf");
  if (tabZip) tabZip.textContent = t("tabZip");

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
  if (videos.length === 0) {
    videoPlayer.removeAttribute("src");
    videoPlayer.load();
    videoPartTitle.textContent = t("noVideo");
    prevVideoBtn.disabled = true;
    nextVideoBtn.disabled = true;
    return;
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
  if (fname.endsWith(".pptx") || fname.endsWith(".ppt") || fname.endsWith(".odp") || fname.endsWith(".pps") || fname.endsWith(".ppsx")) {
    return { type: "pptx", icon: "📊", btnKey: "openPptBtn" };
  }
  if (fname.endsWith(".pdf")) {
    return { type: "pdf", icon: "📄", btnKey: "openPdfBtn" };
  }
  if (fname.endsWith(".docx") || fname.endsWith(".doc") || fname.endsWith(".odt") || fname.endsWith(".rtf")) {
    return { type: "docx", icon: "📝", btnKey: "openDocBtn" };
  }
  if (fname.endsWith(".xlsx") || fname.endsWith(".xls") || fname.endsWith(".csv") || fname.endsWith(".ods")) {
    return { type: "xlsx", icon: "📈", btnKey: "openSheetBtn" };
  }
  if (fname.endsWith(".txt") || fname.endsWith(".log") || fname.endsWith(".md") || fname.endsWith(".json") ||
      fname.endsWith(".xml") || fname.endsWith(".java") || fname.endsWith(".py") || fname.endsWith(".js") ||
      fname.endsWith(".ts") || fname.endsWith(".html") || fname.endsWith(".css") || fname.endsWith(".sql") ||
      fname.endsWith(".c") || fname.endsWith(".cpp") || fname.endsWith(".h") || fname.endsWith(".cs") ||
      fname.endsWith(".sh") || fname.endsWith(".bat") || fname.endsWith(".yml") || fname.endsWith(".yaml")) {
    return { type: "text", icon: "📋", btnKey: "readTextBtn" };
  }
  if (fname.endsWith(".png") || fname.endsWith(".jpg") || fname.endsWith(".jpeg") || fname.endsWith(".webp") ||
      fname.endsWith(".gif") || fname.endsWith(".svg") || fname.endsWith(".bmp")) {
    return { type: "image", icon: "🖼️", btnKey: "viewImageBtn" };
  }
  if (fname.endsWith(".mp4") || fname.endsWith(".mov") || fname.endsWith(".webm") || fname.endsWith(".mkv") || fname.endsWith(".avi")) {
    return { type: "video", icon: "🎬", btnKey: "watchVideoBtn" };
  }
  if (fname.endsWith(".mp3") || fname.endsWith(".wav") || fname.endsWith(".ogg") || fname.endsWith(".m4a") || fname.endsWith(".flac")) {
    return { type: "audio", icon: "🎵", btnKey: "playAudioBtn" };
  }
  if (fname.endsWith(".zip") || fname.endsWith(".rar") || fname.endsWith(".7z") || fname.endsWith(".tar.gz") || fname.endsWith(".gz")) {
    return { type: "zip", icon: "📦", btnKey: "downloadZipBtn" };
  }
  return { type: "generic", icon: "📎", btnKey: "openFileBtn" };
}

function updateTabContent() {
  if (!currentSelectedLesson) return;
  const l = currentSelectedLesson;

  if (activeTab === "hw") {
    const hwList = l.hwFiles || [];
    const hasMultiple = hwList.length > 1;
    subPartsBar.style.display = hasMultiple ? "flex" : "none";

    if (hwList.length > 0) {
      const curHw = hwList[currentHwFileIdx] || hwList[0];
      const meta = getFileMeta(curHw.title);
      fileTitleHeader.textContent = `${meta.icon} ${curHw.title}`;
      subPartTitle.textContent = t("fileCount", currentHwFileIdx + 1, hwList.length);
      prevSubPartBtn.disabled = (currentHwFileIdx === 0);
      nextSubPartBtn.disabled = (currentHwFileIdx === hwList.length - 1);
      openDirectBtn.style.display = "block";
      openDirectBtn.textContent = t(meta.btnKey);

      sendActionBtn.style.display = "block";
      sendActionBtn.textContent = t("sendToChatBtn");
    } else {
      fileTitleHeader.textContent = "";
      openDirectBtn.style.display = "none";
      sendActionBtn.style.display = "none";
    }

    if (l.homeworkText && l.homeworkText.trim()) {
      mainContentBox.classList.remove("hidden");
      mainContentBox.textContent = l.homeworkText;
    } else {
      mainContentBox.classList.add("hidden");
      mainContentBox.textContent = "";
    }
  }
  else if (activeTab === "pdf") {
    const pdfs = l.pdfs || [];
    subPartsBar.style.display = (pdfs.length > 1) ? "flex" : "none";

    mainContentBox.classList.add("hidden");
    mainContentBox.textContent = "";

    if (pdfs.length > 0) {
      const curPdf = pdfs[currentPdfIdx] || pdfs[0];
      const meta = getFileMeta(curPdf.title);
      fileTitleHeader.textContent = `${meta.icon} ${curPdf.title}`;
      subPartTitle.textContent = t("fileCount", currentPdfIdx + 1, pdfs.length);
      prevSubPartBtn.disabled = (currentPdfIdx === 0);
      nextSubPartBtn.disabled = (currentPdfIdx === pdfs.length - 1);
      openDirectBtn.style.display = "block";
      openDirectBtn.textContent = t(meta.btnKey);
      sendActionBtn.style.display = "block";
      sendActionBtn.textContent = t("sendToChatBtn");
    }
  }
  else if (activeTab === "zip") {
    const zips = l.zips || [];
    subPartsBar.style.display = (zips.length > 1) ? "flex" : "none";

    mainContentBox.classList.add("hidden");
    mainContentBox.textContent = "";

    if (zips.length > 0) {
      const curZip = zips[currentZipIdx] || zips[0];
      const meta = getFileMeta(curZip.title);
      fileTitleHeader.textContent = `${meta.icon} ${curZip.title}`;
      subPartTitle.textContent = t("fileCount", currentZipIdx + 1, zips.length);
      prevSubPartBtn.disabled = (currentZipIdx === 0);
      nextSubPartBtn.disabled = (currentZipIdx === zips.length - 1);
      openDirectBtn.style.display = "block";
      openDirectBtn.textContent = t(meta.btnKey);
      sendActionBtn.style.display = "block";
      sendActionBtn.textContent = t("sendToChatBtn");
    }
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
  isPptxAllMode = false;
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

  // 1. Поиск порядка слайдов в presentation.xml
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
      items: []
    };

    const allShapes = Array.from(slideDoc.querySelectorAll("*")).filter(n =>
      n.localName === "sp" || n.localName === "pic" || n.localName === "graphicFrame"
    );

    for (const shape of allShapes) {
      // 1. Изображение
      if (shape.localName === "pic") {
        const blip = Array.from(shape.querySelectorAll("*")).find(n => n.localName === "blip");
        const embedId = blip?.getAttribute("r:embed") || blip?.getAttribute("embed");
        if (embedId && imageMap[embedId]) {
          slideData.items.push({
            type: "image",
            src: imageMap[embedId]
          });
        }
        continue;
      }

      // 2. Таблица
      const tbl = Array.from(shape.querySelectorAll("*")).find(n => n.localName === "tbl");
      if (tbl) {
        const rows = Array.from(tbl.querySelectorAll("*")).filter(n => n.localName === "tr");
        const tableRows = [];
        for (const row of rows) {
          const cells = Array.from(row.querySelectorAll("*")).filter(n => n.localName === "tc");
          const rowCells = [];
          for (const cell of cells) {
            const texts = Array.from(cell.querySelectorAll("*"))
              .filter(n => n.localName === "t")
              .map(n => n.textContent)
              .join(" ");
            rowCells.push(texts.trim());
          }
          if (rowCells.length > 0) tableRows.push(rowCells);
        }
        if (tableRows.length > 0) {
          slideData.items.push({
            type: "table",
            rows: tableRows
          });
        }
        continue;
      }

      // 3. Блок с текстом
      const isTitleShape = !!Array.from(shape.querySelectorAll("*")).find(n => {
        if (n.localName !== "ph") return false;
        const type = n.getAttribute("type");
        return type === "title" || type === "ctrTitle";
      });

      const paragraphs = Array.from(shape.querySelectorAll("*")).filter(n => n.localName === "p");
      for (const p of paragraphs) {
        const runs = Array.from(p.querySelectorAll("*")).filter(n => n.localName === "r");
        let pText = "";
        let isBold = false;

        runs.forEach(r => {
          const rPr = Array.from(r.querySelectorAll("*")).find(n => n.localName === "rPr");
          if (rPr && rPr.getAttribute("b") === "1") isBold = true;
          const t = Array.from(r.querySelectorAll("*")).find(n => n.localName === "t");
          if (t && t.textContent) {
            pText += t.textContent;
          }
        });

        const cleanText = pText.trim();
        if (!cleanText) continue;

        if (isTitleShape && !slideData.title) {
          slideData.title = cleanText;
          slideData.items.push({ type: "title", text: cleanText });
        } else if (!slideData.title && cleanText.length < 90 && slideData.items.length === 0) {
          slideData.title = cleanText;
          slideData.items.push({ type: "title", text: cleanText });
        } else {
          const pPr = Array.from(p.querySelectorAll("*")).find(n => n.localName === "pPr");
          const lvl = parseInt(pPr?.getAttribute("lvl") || "0", 10);
          const hasBullet = !!Array.from(p.querySelectorAll("*")).find(n => n.localName === "buChar" || n.localName === "buAutoNum") || lvl > 0;

          slideData.items.push({
            type: hasBullet ? "bullet" : "p",
            lvl: lvl,
            bold: isBold,
            text: cleanText
          });
        }
      }
    }

    // Дополнительные изображения внутри слайда
    const extraBlips = Array.from(slideDoc.querySelectorAll("*")).filter(n => n.localName === "blip");
    extraBlips.forEach(b => {
      const emb = b.getAttribute("r:embed") || b.getAttribute("embed");
      if (emb && imageMap[emb]) {
        if (!slideData.items.find(it => it.type === "image" && it.src === imageMap[emb])) {
          slideData.items.push({ type: "image", src: imageMap[emb] });
        }
      }
    });

    slides.push(slideData);
  }

  return slides;
}

function buildSlideCardHtml(slide, totalSlides) {
  let html = `
    <div class="pptx-slide-card" data-slide-num="${slide.index}">
      <div class="pptx-slide-header-bar">
        <span class="pptx-slide-badge">${t("slideCount", slide.index, totalSlides)}</span>
        ${slide.title ? `<span class="pptx-slide-title-preview">${escapeHtml(slide.title)}</span>` : ""}
      </div>
      <div class="pptx-slide-body">
  `;

  let inBulletList = false;

  slide.items.forEach(item => {
    if (item.type === "bullet") {
      if (!inBulletList) {
        html += `<ul class="pptx-bullet-list">`;
        inBulletList = true;
      }
      html += `<li class="pptx-bullet-item lvl-${item.lvl}">${item.bold ? `<strong>${escapeHtml(item.text)}</strong>` : escapeHtml(item.text)}</li>`;
    } else {
      if (inBulletList) {
        html += `</ul>`;
        inBulletList = false;
      }

      if (item.type === "title") {
        html += `<h2 class="pptx-slide-heading">${escapeHtml(item.text)}</h2>`;
      } else if (item.type === "p") {
        html += `<p class="pptx-paragraph">${item.bold ? `<strong>${escapeHtml(item.text)}</strong>` : escapeHtml(item.text)}</p>`;
      } else if (item.type === "image") {
        html += `<div class="pptx-image-wrapper"><img src="${item.src}" class="pptx-slide-image" alt="Slide image"></div>`;
      } else if (item.type === "table") {
        html += `<div class="pptx-table-wrapper"><table class="pptx-slide-table">`;
        item.rows.forEach((r, ri) => {
          html += `<tr>`;
          r.forEach(c => {
            const tag = ri === 0 ? "th" : "td";
            html += `<${tag}>${escapeHtml(c)}</${tag}>`;
          });
          html += `</tr>`;
        });
        html += `</table></div>`;
      }
    }
  });

  if (inBulletList) {
    html += `</ul>`;
  }

  html += `</div></div>`;
  return html;
}

function updatePptxView() {
  if (!pptxViewerContainer || activePptxSlides.length === 0) return;
  const total = activePptxSlides.length;

  if (isPptxAllMode) {
    // Режим "Все слайды"
    pptxViewerContainer.innerHTML = activePptxSlides.map(s => buildSlideCardHtml(s, total)).join("");
    pptxSlideInfo.textContent = `${total} / ${total}`;
    pptxPrevSlide.disabled = true;
    pptxNextSlide.disabled = true;
    pptxToggleMode.textContent = "📑";
    pptxToggleMode.title = t("singleSlide");
  } else {
    // Режим "По слайдам"
    const curSlide = activePptxSlides[currentPptxSlideIdx] || activePptxSlides[0];
    pptxViewerContainer.innerHTML = buildSlideCardHtml(curSlide, total);
    pptxSlideInfo.textContent = `${currentPptxSlideIdx + 1} / ${total}`;
    pptxPrevSlide.disabled = (currentPptxSlideIdx === 0);
    pptxNextSlide.disabled = (currentPptxSlideIdx === total - 1);
    pptxToggleMode.textContent = "📜";
    pptxToggleMode.title = t("allSlides");
    fileViewerBody.scrollTop = 0;
  }
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
// 5. Главный универсальный просмотрщик (openUniversalViewer)
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
    // 1. Презентация PowerPoint (.pptx)
    if (meta.type === "pptx") {
      const fname = (fileObj.title || "").toLowerCase();
      if (fname.endsWith(".ppt") && !fname.endsWith(".pptx")) {
        // Старый бинарный формат PowerPoint 97-2003 (.ppt)
        if (viewerLoading) viewerLoading.style.display = "none";
        showFileCard(fileObj, "📊", t("pptFormatNotice"));
        return;
      }
      const res = await fetch(url);
      if (!res.ok) throw new Error("HTTP " + res.status);
      const ab = await res.arrayBuffer();
      activePptxSlides = await parsePptxSlides(ab);
      currentPptxSlideIdx = 0;
      isPptxAllMode = false;
      pptxViewerContainer.style.display = "flex";
      pptxControls.style.display = "flex";
      updatePptxView();
      if (viewerLoading) viewerLoading.style.display = "none";
      return;
    }

    // 2. PDF Документ (.pdf)
    if (meta.type === "pdf") {
      const res = await fetch(url);
      if (!res.ok) throw new Error("HTTP " + res.status);
      activePdfArrayBuffer = await res.arrayBuffer();
      activePdfScale = 1.0;
      await renderPdfDocument(activePdfArrayBuffer, 1.0);
      return;
    }

    // 3. Word Документ (.docx)
    if (meta.type === "docx") {
      const fname = (fileObj.title || "").toLowerCase();
      if (fname.endsWith(".doc") && !fname.endsWith(".docx")) {
        // Старый формат Word 97-2003 (.doc)
        if (viewerLoading) viewerLoading.style.display = "none";
        showFileCard(fileObj, "📝", t("pptFormatNotice").replace(".ppt", ".doc"));
        return;
      }
      const res = await fetch(url);
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

    // 4. Таблицы (.xlsx, .xls, .csv)
    if (meta.type === "xlsx") {
      const fname = (fileObj.title || "").toLowerCase();
      const res = await fetch(url);
      if (!res.ok) throw new Error("HTTP " + res.status);
      const ab = await res.arrayBuffer();
      if (viewerLoading) viewerLoading.style.display = "none";
      await renderSpreadsheet(ab, fname.endsWith(".csv"));
      return;
    }

    // 5. Изображение
    if (meta.type === "image") {
      viewerImage.src = url;
      imageViewerContainer.style.display = "flex";
      if (viewerLoading) viewerLoading.style.display = "none";
      return;
    }

    // 6. Аудио (.mp3, .wav, .ogg, .m4a)
    if (meta.type === "audio") {
      audioTrackTitle.textContent = fileObj.title || "Аудиозапись";
      viewerAudio.src = url;
      audioViewerContainer.style.display = "flex";
      viewerAudio.load();
      if (viewerLoading) viewerLoading.style.display = "none";
      return;
    }

    // 7. Текст или исходный код
    if (meta.type === "text") {
      const res = await fetch(url);
      if (!res.ok) throw new Error("HTTP " + res.status);
      currentCodeText = await res.text();
      viewerCode.textContent = currentCodeText;
      codeViewerContainer.style.display = "block";
      if (codeCopyBtn) codeCopyBtn.style.display = "flex";
      if (viewerLoading) viewerLoading.style.display = "none";
      return;
    }

    // 8. Архивы или прочие форматы
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

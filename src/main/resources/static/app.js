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
    openDocBtn: "👁 Открыть документ",
    watchVideoBtn: "▶️ Смотреть видео",
    downloadZipBtn: "📥 Скачать ZIP",
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
    docLoading: "Загрузка документа...",
    docLoadError: "Не удалось открыть документ.",
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
    openDocBtn: "👁 Hujjatni ochish",
    watchVideoBtn: "▶️ Videoni ko'rish",
    downloadZipBtn: "📥 ZIP yuklab olish",
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
    docLoading: "Hujjat yuklanmoqda...",
    docLoadError: "Hujjatni ochib bo'lmadi.",
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
    openDocBtn: "👁 Open document",
    watchVideoBtn: "▶️ Watch video",
    downloadZipBtn: "📥 Download ZIP",
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
    docLoading: "Loading document...",
    docLoadError: "Failed to open document.",
  },
};

let currentLang = "ru";
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
  if (rotateBtn) rotateBtn.title = t("rotateVideo");
  const loadingText = document.getElementById("viewerLoadingText");
  if (loadingText) loadingText.textContent = t("docLoading");
}

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

function updateTabContent() {
  if (!currentSelectedLesson) return;
  const l = currentSelectedLesson;

  if (activeTab === "hw") {
    const hwList = l.hwFiles || [];
    const hasMultiple = hwList.length > 1;
    subPartsBar.style.display = hasMultiple ? "flex" : "none";

    if (hwList.length > 0) {
      const curHw = hwList[currentHwFileIdx] || hwList[0];
      fileTitleHeader.textContent = t("attachedFile", curHw.title);
      subPartTitle.textContent = t("fileCount", currentHwFileIdx + 1, hwList.length);
      prevSubPartBtn.disabled = (currentHwFileIdx === 0);
      nextSubPartBtn.disabled = (currentHwFileIdx === hwList.length - 1);
      openDirectBtn.style.display = "block";

      const fname = (curHw.title || "").toLowerCase();
      if (fname.endsWith(".pdf")) {
        openDirectBtn.textContent = t("openPdfBtn");
      } else if (fname.endsWith(".docx") || fname.endsWith(".doc")) {
        openDirectBtn.textContent = t("openDocBtn");
      } else if (curHw.isVideo || fname.endsWith(".mp4") || fname.endsWith(".mov")) {
        openDirectBtn.textContent = t("watchVideoBtn");
      } else {
        openDirectBtn.textContent = t("openFileBtn");
      }

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

    // Point 4: Убираем лишнюю информацию, оставляем только кнопки и название файла
    mainContentBox.classList.add("hidden");
    mainContentBox.textContent = "";

    if (pdfs.length > 0) {
      const curPdf = pdfs[currentPdfIdx] || pdfs[0];
      fileTitleHeader.textContent = `📄 ${curPdf.title}`;
      subPartTitle.textContent = t("fileCount", currentPdfIdx + 1, pdfs.length);
      prevSubPartBtn.disabled = (currentPdfIdx === 0);
      nextSubPartBtn.disabled = (currentPdfIdx === pdfs.length - 1);
      openDirectBtn.style.display = "block";
      openDirectBtn.textContent = t("openPdfBtn");
      sendActionBtn.style.display = "block";
      sendActionBtn.textContent = t("sendToChatBtn");
    }
  }
  else if (activeTab === "zip") {
    const zips = l.zips || [];
    subPartsBar.style.display = (zips.length > 1) ? "flex" : "none";

    // Убираем лишнюю информацию
    mainContentBox.classList.add("hidden");
    mainContentBox.textContent = "";

    if (zips.length > 0) {
      const curZip = zips[currentZipIdx] || zips[0];
      fileTitleHeader.textContent = `📦 ${curZip.title}`;
      subPartTitle.textContent = t("fileCount", currentZipIdx + 1, zips.length);
      prevSubPartBtn.disabled = (currentZipIdx === 0);
      nextSubPartBtn.disabled = (currentZipIdx === zips.length - 1);
      openDirectBtn.style.display = "block";
      openDirectBtn.textContent = t("downloadZipBtn");
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
if (window.pdfjsLib) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = "lib/pdf.worker.min.js";
}

let activePdfDoc = null;
let activePdfArrayBuffer = null;
let activePdfScale = 1.0;
let isPdfRendering = false;

// DOM элементы просмотрщика
const fileViewerBody = document.getElementById("fileViewerBody");
const viewerLoading = document.getElementById("viewerLoading");
const viewerLoadingText = document.getElementById("viewerLoadingText");
const pdfViewerContainer = document.getElementById("pdfViewerContainer");
const docViewerContainer = document.getElementById("docViewerContainer");
const imageViewerContainer = document.getElementById("imageViewerContainer");
const viewerImage = document.getElementById("viewerImage");
const codeViewerContainer = document.getElementById("codeViewerContainer");
const viewerCode = document.getElementById("viewerCode");
const pdfControls = document.getElementById("pdfControls");
const pdfPageInfo = document.getElementById("pdfPageInfo");
const pdfZoomIn = document.getElementById("pdfZoomIn");
const pdfZoomOut = document.getElementById("pdfZoomOut");
const pdfFitWidth = document.getElementById("pdfFitWidth");

function resetViewerContainers() {
  if (viewerLoading) viewerLoading.style.display = "none";
  if (pdfViewerContainer) {
    pdfViewerContainer.style.display = "none";
    pdfViewerContainer.innerHTML = "";
  }
  if (docViewerContainer) {
    docViewerContainer.style.display = "none";
    docViewerContainer.innerHTML = "";
  }
  if (imageViewerContainer) {
    imageViewerContainer.style.display = "none";
  }
  if (viewerImage) viewerImage.removeAttribute("src");
  if (codeViewerContainer) {
    codeViewerContainer.style.display = "none";
  }
  if (viewerCode) viewerCode.textContent = "";
  if (fileViewerFrame) {
    fileViewerFrame.style.display = "none";
    fileViewerFrame.src = "about:blank";
  }
  if (pdfControls) pdfControls.style.display = "none";
  activePdfDoc = null;
  activePdfArrayBuffer = null;
}

function closeFileViewer() {
  fileViewerModal.style.display = "none";
  resetViewerContainers();
}

fileViewerCloseBtn.onclick = closeFileViewer;

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

    // Point 1 & Point 2: Динамический масштаб по ширине экрана/окна (100% width)
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

    // Обновление номера текущей страницы при скролле
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
    // Резервный показ
    fileViewerFrame.src = `${API_BASE}/file/view/${fileViewerModal.dataset.fileId}`;
    fileViewerFrame.style.display = "block";
    pdfControls.style.display = "none";
  } finally {
    isPdfRendering = false;
    if (viewerLoading) viewerLoading.style.display = "none";
  }
}

// Управление масштабом PDF
pdfZoomIn.onclick = () => {
  if (!activePdfArrayBuffer) return;
  activePdfScale = Math.min(activePdfScale * 1.25, 3.0);
  renderPdfDocument(activePdfArrayBuffer, activePdfScale);
};

pdfZoomOut.onclick = () => {
  if (!activePdfArrayBuffer) return;
  activePdfScale = Math.max(activePdfScale * 0.8, 0.5);
  renderPdfDocument(activePdfArrayBuffer, activePdfScale);
};

pdfFitWidth.onclick = () => {
  if (!activePdfArrayBuffer) return;
  activePdfScale = 1.0;
  renderPdfDocument(activePdfArrayBuffer, 1.0);
};

// Point 1: При растягивании окна браузера на ПК — автоматическая подгонка по ширине!
let resizePdfTimeout = null;
window.addEventListener("resize", () => {
  if (fileViewerModal.style.display === "flex" && activePdfArrayBuffer) {
    clearTimeout(resizePdfTimeout);
    resizePdfTimeout = setTimeout(() => {
      renderPdfDocument(activePdfArrayBuffer, activePdfScale);
    }, 250);
  }
});

// Открытие универсального просмотрщика
async function openUniversalViewer(fileObj) {
  resetViewerContainers();
  fileViewerTitle.textContent = fileObj.title || "";
  fileViewerModal.dataset.fileId = fileObj.id;
  fileViewerModal.style.display = "flex";
  if (viewerLoading) {
    viewerLoading.style.display = "flex";
    viewerLoadingText.textContent = t("docLoading");
  }

  const fname = (fileObj.title || "").toLowerCase();
  const url = `${API_BASE}/file/view/${fileObj.id}`;

  try {
    if (fname.endsWith(".pdf") || activeTab === "pdf") {
      // PDF документ через PDF.js
      const res = await fetch(url);
      if (!res.ok) throw new Error("HTTP " + res.status);
      activePdfArrayBuffer = await res.arrayBuffer();
      activePdfScale = 1.0;
      await renderPdfDocument(activePdfArrayBuffer, 1.0);
    } else if (fname.endsWith(".docx") || fname.endsWith(".doc")) {
      // Word (.docx) через mammoth.js
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
    } else if (fname.endsWith(".png") || fname.endsWith(".jpg") || fname.endsWith(".jpeg") || fname.endsWith(".webp") || fname.endsWith(".gif") || fname.endsWith(".svg")) {
      // Картинка
      viewerImage.src = url;
      imageViewerContainer.style.display = "flex";
      if (viewerLoading) viewerLoading.style.display = "none";
    } else if (fname.endsWith(".txt") || fname.endsWith(".java") || fname.endsWith(".py") || fname.endsWith(".sql") || fname.endsWith(".json") || fname.endsWith(".md") || fname.endsWith(".xml") || fname.endsWith(".html")) {
      // Текст или исходный код
      const res = await fetch(url);
      const text = await res.text();
      viewerCode.textContent = text;
      codeViewerContainer.style.display = "block";
      if (viewerLoading) viewerLoading.style.display = "none";
    } else {
      // Прочие файлы через iframe
      fileViewerFrame.src = url;
      fileViewerFrame.style.display = "block";
      if (viewerLoading) viewerLoading.style.display = "none";
    }
  } catch (err) {
    console.error("Ошибка открытия файла:", err);
    if (viewerLoading) viewerLoading.style.display = "none";
    notify(t("docLoadError"));
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

// Point 5: Открытие любого файла (PDF, Word, картинки, видео, ZIP)
openDirectBtn.onclick = async () => {
  const l = currentSelectedLesson;
  if (!l) return;
  let fileObj = null;

  if (activeTab === "hw") fileObj = l.hwFiles?.[currentHwFileIdx];
  if (activeTab === "pdf") fileObj = l.pdfs?.[currentPdfIdx];
  if (activeTab === "zip") fileObj = l.zips?.[currentZipIdx];

  if (!fileObj) return;

  // Видео из домашки - загружаем в плеер
  if (fileObj.isVideo || (fileObj.title || "").toLowerCase().endsWith(".mp4")) {
    videoPlayer.src = `${API_BASE}/video/stream/${fileObj.id}`;
    videoPlayer.load();
    videoPlayer.play();
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

  const fname = (fileObj.title || "").toLowerCase();
  // Архивы скачиваем
  if (fname.endsWith(".zip") || fname.endsWith(".rar") || fname.endsWith(".tar.gz") || activeTab === "zip") {
    if (tg && tg.openLink) {
      tg.openLink(url);
    } else {
      window.open(url, "_blank");
    }
    return;
  }

  // Все остальные документы и файлы открываем прямо в Mini App
  openUniversalViewer(fileObj);
};

// Point 7: Поворот видео в Mini App для смартфонов (fullscreen + landscape + CSS fallback)
const videoContainer = document.getElementById("videoContainer");
const rotateVideoBtn = document.getElementById("rotateVideoBtn");
const exitLandscapeBtn = document.getElementById("exitLandscapeBtn");
let isRotatedLandscape = false;

function toggleVideoRotation() {
  isRotatedLandscape = !isRotatedLandscape;
  if (isRotatedLandscape) {
    let handled = false;
    if (videoPlayer.requestFullscreen) {
      videoPlayer.requestFullscreen().then(() => {
        if (screen.orientation && screen.orientation.lock) {
          screen.orientation.lock('landscape').catch(() => {});
        }
      }).catch(() => {
        applyCssLandscape();
      });
      handled = true;
    } else if (videoPlayer.webkitEnterFullscreen) {
      videoPlayer.webkitEnterFullscreen();
      handled = true;
    }

    if (!handled || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      applyCssLandscape();
    }
  } else {
    exitCssLandscape();
    if (document.exitFullscreen && document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    if (screen.orientation && screen.orientation.unlock) {
      screen.orientation.unlock();
    }
  }
}

let rotateBtnHideTimer = null;

function showRotateBtn() {
  if (isRotatedLandscape || !rotateVideoBtn) return;
  rotateVideoBtn.classList.remove("hidden");
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
  tapFeedbackCenter.classList.remove("show");
  void tapFeedbackCenter.offsetWidth;
  tapFeedbackCenter.classList.add("show");
  centerFeedbackTimer = setTimeout(() => {
    tapFeedbackCenter.classList.remove("show");
  }, 650);
}

function hideSeekFeedback() {
  if (seekOverlayLeft) seekOverlayLeft.classList.remove("active");
  if (seekOverlayRight) seekOverlayRight.classList.remove("active");
  clearTimeout(quickSeekHideTimer);
}

function showSeekFeedback(side, seconds) {
  if (tapFeedbackCenter) tapFeedbackCenter.classList.remove("show");
  const overlay = side === "right" ? seekOverlayRight : seekOverlayLeft;
  const otherOverlay = side === "right" ? seekOverlayLeft : seekOverlayRight;
  const label = side === "right" ? seekSecondsRight : seekSecondsLeft;

  if (otherOverlay) otherOverlay.classList.remove("active");
  if (!overlay || !label) return;

  label.textContent = side === "right" ? `+${seconds}` : `${seconds}`;

  // Restart animation
  overlay.classList.remove("active");
  void overlay.offsetWidth;
  overlay.classList.add("active");

  clearTimeout(quickSeekHideTimer);
  quickSeekHideTimer = setTimeout(() => {
    overlay.classList.remove("active");
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
let lastTapCoordX = 0;
let lastTapCoordY = 0;

function handleVideoTapGesture(clientX, clientY, isMouseDblClick = false) {
  if (!videoPlayer) return;
  const rect = videoPlayer.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return;

  let relX, relY;
  if (videoContainer && videoContainer.classList.contains("in-landscape-mode")) {
    relX = (clientY - rect.top) / rect.height;
    relY = 1.0 - ((clientX - rect.left) / rect.width);
  } else {
    relX = (clientX - rect.left) / rect.width;
    relY = (clientY - rect.top) / rect.height;
  }

  // Игнорируем нажатия на нижнюю полосу контролов плеера
  if (relY > 0.82) return;

  let side = "center";
  if (relX < 0.38) {
    side = "left";
  } else if (relX > 0.62) {
    side = "right";
  }

  const now = Date.now();
  const timeSinceLastTap = now - lastTapTime;
  const dist = Math.hypot(clientX - lastTapCoordX, clientY - lastTapCoordY);

  if (isMouseDblClick) {
    // Двойной клик мыши на ПК
    if (side === "center") {
      toggleVideoRotation();
      triggerCenterFeedback();
    } else {
      performQuickSeek(side);
    }
    lastTapTime = now;
    lastTapCoordX = clientX;
    lastTapCoordY = clientY;
    return;
  }

  // Если уже идёт активная серия быстрых перемоток на этой же стороне (3-е, 4-е нажатие и т.д.):
  if (quickSeekSide && quickSeekSide === side && timeSinceLastTap < 850) {
    performQuickSeek(side);
    lastTapTime = now;
    lastTapCoordX = clientX;
    lastTapCoordY = clientY;
    return;
  }

  // Обнаружение двойного тапа (Double Tap)
  if (timeSinceLastTap < 330 && dist < 60) {
    if (side === "center") {
      toggleVideoRotation();
      triggerCenterFeedback();
      quickSeekAccumulator = 0;
      quickSeekSide = null;
    } else {
      performQuickSeek(side);
    }
  }

  lastTapTime = now;
  lastTapCoordX = clientX;
  lastTapCoordY = clientY;
}

// 1. Тач-события на смартфонах и планшетах (Touch)
videoPlayer.addEventListener("touchstart", (e) => {
  if (e.touches && e.touches.length === 1) {
    const t = e.touches[0];
    handleVideoTapGesture(t.clientX, t.clientY, false);
  }
}, { passive: true });

// 2. Двойной клик на ПК (Mouse Double Click)
videoPlayer.addEventListener("dblclick", (e) => {
  handleVideoTapGesture(e.clientX, e.clientY, true);
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

console.log("page loaded");

if (window.idb && typeof window.idb.openDB === "function") {
  console.log("idb loaded successfully");
} else {
  console.error("idb failed to load – auto‑save will not work");
}
let db;
let currentDocumentId = "draft";


async function initDB() {
  db = await idb .openDB("textEditorDB", 1, {
    upgrade(db) {
   if (!db.objectStoreNames.contains("docs")) {
    db.createObjectStore("docs", { keyPath: "id" });
  }
}
  });
  console.log("Database initialized");
}


async function saveCurrentDocument(html) {
  if (!db) return;
  await db.put("docs", {
    id: currentDocumentId,
    html: html,
    lastModified: Date.now()
  });
  console.log(`"${currentDocumentId}" saved at`, new Date().toLocaleTimeString());
  const indicator = document.getElementById("saveIndicator");
  if (indicator) {
    indicator.style.visibility = "visible";
    clearTimeout(saveCurrentDocument._indicatorTimer);
    saveCurrentDocument._indicatorTimer = setTimeout(() => {
      indicator.style.visibility = "hidden";
    }, 1500);
  }
}
  async function loadDocument(id) {
  if (!db) return null;
  const doc =await db.get("docs", id);
  return doc ? doc.html : null;
 
}

async function listDocuments() {
  if (!db) return [];
  const docs = await db.getAll("docs");
  return docs.sort((a, b) => b.lastModified - a.lastModified);
}

async function deleteDocument(id) {
  if (!db) return;
  await db.delete("docs", id);
  console.log(`Document "${id}" deleted.`);
}

async function renameDocument(oldId, newId) {
  if (!db || oldId === newId) return;
  const doc = await db.get("docs", oldId);
  if (!doc) return;
  await db.put("docs", { ...doc, id: newId, lastModified: Date.now() });
  await db.delete("docs", oldId);
  console.log(`Renamed "${oldId}" to "${newId}".`);
}

async function getMostRecentDocumentId() {
  const docs = await listDocuments();
  return docs.length > 0 ? docs[0].id : null;
}




const savebtn = document.getElementById("savebtn");
const pagesContainer = document.getElementById("pagesContainer");
const fontSelect = document.getElementById("fontSelect");
const counter = document.getElementById("counter");
const clearbtn = document.getElementById("clearbtn");
const fontSizeSelect = document.getElementById("fontSizeSelect");
const boldBtn = document.getElementById("boldBtn");
const italicBtn = document.getElementById("italicBtn");
const underlineBtn = document.getElementById("underlineBtn");
const fileMenuBtn = document.getElementById("fileMenuBtn");
const fileDropdown = document.getElementById("fileDropdown");
const themeToggle = document.getElementById("themeToggle");
const body = document.body;
const imageBtn = document.getElementById("imageBtn");
const imageInput = document.getElementById("imageInput");
const alignLeftBtn = document.getElementById("alignLeftBtn");
const alignCenterBtn = document.getElementById("alignCenterBtn");
const alignRightBtn = document.getElementById("alignRightBtn");
const richpdfbtn = document.getElementById("richpdfbtn");
const undoBtn = document.getElementById("undoBtn");
const redoBtn = document.getElementById("redoBtn");
const pageNumToggle = document.getElementById("pageNumToggle");
const strikeBtn = document.getElementById("strikeBtn");
const savehtmlbtn = document.getElementById("savehtmlbtn");
const saveAsBtn = document.getElementById("saveAsBtn");
const loadDocSelect = document.getElementById("loadDocSelect");
const openFileManagerBtn = document.getElementById("openFileManagerBtn");
const fileManagerModal = document.getElementById("fileManagerModal");
const fileList = document.getElementById("fileList");
const newDocFromModalBtn = document.getElementById("newDocFromModalBtn"); 
const closeModalBtn = document.getElementById("closeModalBtn");
const exportWordBtn = document.getElementById("exportWordBtn");
const importWordBtn = document.getElementById("importWordBtn");
const wordFileInput = document.getElementById("wordFileInput");
const deleteCurrentDocBtn = document.getElementById("deleteCurrentDocBtn");
const openFileManagerFromMenuBtn = document.getElementById("openFileManagerFromMenuBtn");
const deleteAllDocsBtn = document.getElementById("deleteAllDocsBtn");
const downloadAllBtn = document.getElementById("downloadAllBtn");
const alignJustifyBtn = document.getElementById("alignJustifyBtn");
const findReplaceModal = document.getElementById("findReplaceModal");
const searchInput = document.getElementById("searchInput");
const replaceInput = document.getElementById("replaceInput");
const caseSensitive = document.getElementById("caseSensitive");
const searchStatus = document.getElementById("searchStatus");
const findNextBtn = document.getElementById("findNextBtn");
const replaceBtn = document.getElementById("replaceBtn");
const replaceAllBtn = document.getElementById("replaceAllBtn");
const closeFindBtn = document.getElementById("closeFindBtn");
const highlightBtn = document.getElementById("highlightBtn");
const highlightColor = document.getElementById("highlightColor");
const fontColorBtn = document.getElementById("fontColorBtn");
const clearFormatBtn = document.getElementById("clearFormatBtn");
const printBtn = document.getElementById("printBtn");
const bulletListBtn = document.getElementById("bulletListBtn");
const numberListBtn = document.getElementById("numberListBtn");
const headingSelect = document.getElementById("headingSelect");
const mainToolbar = document.getElementById("mainToolbar");
const focusBtn = document.getElementById("focusModeBtn");
const sidebar = document.getElementById("pageSidebar");
const toggleSidebarBtn = document.getElementById("toggleSidebarBtn");
const closeSidebarBtn = document.getElementById("closeSidebarBtn");
const pageList = document.getElementById("pageList");
const tableToolbar = document.getElementById("tableToolbar");
const columnRuler = document.getElementById('columnRuler');
const rulerMarkers = document.getElementById('rulerMarkers');
const rowRuler = document.getElementById('rowRuler');
const rowMarkers = document.getElementById('rowMarkers');
const tableResizeHandle = document.getElementById('tableResizeHandle');
const tableMoveHandle = document.getElementById('tableMoveHandle');
const lineHeightSelect = document.getElementById("lineHeightSelect");
const IMAGE_DRAG_THRESHOLD = 3;
const imageLeftInput = document.getElementById("imageLeft");
const imageTopInput = document.getElementById("imageTop");
const imagePosLabel = document.getElementById("imagePosLabel");
const openFindReplaceBtn = document.getElementById("openFindReplaceBtn");
const fontColorInput = document.getElementById("fontColorInput");


let jsPDF;
let currentPage= document.querySelector(".page");
let isHandlingOverflow = false;
let overflowTimer = null;
let lastEditedPage = null;
let autoSaveTimer = null;
let selectedImage = null;
let isExportingPDF = false;
let showPageNumbers = false;
let currentSort = "date-desc";
let ignoreNextSelectionChange = false;
let matches = [];
let currentMatchIndex = -1;
let currentHighlightSpan = null;
let highlightSpans = [];
let isDraggingFind = false;
let dragStartX = 0, dragStartY = 0;
let initialLeft = 0, initialTop = 0;
let focusMode = false;
let sidebarOpen = false; 
let currentTable = null; 
let tableAnchorCell = null;         
let tableAnchorTable = null;
let rulerTable = null;
let resizeColStartLeft = 0;
let resizeColStartRight = 0;
let rulerColumnPcts = [];
let rowRulerTable = null;
let isResizingRow = false;
let resizeRowIdx = -1;      
let resizeRowStartY = 0;
let resizeRowStartHeight = 0;
let isResizingColEdge = false;
let isResizingTable = false;
let resizeTableStartWidth = 0;
let resizeTableStartX = 0;
let resizeTableTarget = null;
let isMovingTable = false;
let moveStartX = 0, moveStartY = 0;
let moveStartLeft = 0, moveStartTop = 0;
let tableMoveTarget = null;
let isResizingRuler = false;
let resizeColIdx = -1;
let resizeStartPx = 0;
let undoStack = [];          
let undoIndex = -1;           
let isUndoRedo = false; 
let isDraggingImage = false;
let imageDragTarget = null;
let dragStartMouseX = 0, dragStartMouseY = 0;
let dragStartLeft = 0, dragStartTop = 0;
let hasMoved = false;
let dragOffsetX = 0, dragOffsetY = 0;




(async function startup() {
  await initDB();
  const recentId = await getMostRecentDocumentId();
  if (recentId) {
    currentDocumentId = recentId;
    const savedHTML = await loadDocument(currentDocumentId);
    if (savedHTML) {
      pagesContainer.innerHTML = savedHTML;
      removeAllDynamicTableElements(pagesContainer);  
      removeLegacyResizeHandles(pagesContainer);
pagesContainer.querySelectorAll('table').forEach(table => {
  
  if (!table.style.width) {
    table.style.width = '100%';
  }
});
     
      pagesContainer.querySelectorAll(".find-match, .find-match-current").forEach(span => {
        span.replaceWith(span.textContent);
      });
      pagesContainer.querySelectorAll(".page").forEach(page => page.normalize());

      const firstPage = pagesContainer.querySelector(".page");
      if (firstPage) handleOverflow(firstPage);
    }
  }
  updateDocumentUI();
  updateCounter();
  updatePageCounter();
  hideRuler();
  hideRowRuler();
  hideTableResizeHandle();
  hideTableMoveHandle();

    const firstPage = pagesContainer.querySelector(".page");
  if (firstPage) firstPage.focus();

})();

function cssColorToHex(color) {
  if (!color || color === "transparent" || color === "rgba(0, 0, 0, 0)") return null;
  
  const ctx = document.createElement("canvas").getContext("2d");
  ctx.fillStyle = color;
  const normalised = ctx.fillStyle;  
  const hex = normalised.startsWith("#") ? normalised : null;
  return hex ? hex.toLowerCase() : null;
}


function getActivePage() {
  const sel = window.getSelection();
  if (sel.rangeCount && sel.focusNode) {
    const el =sel.focusNode.nodeType ===3 ? sel.focusNode.parentElement : sel.focusNode;
    const page = el.closest(".page");
    if (page) return page;
  }
  return currentPage;
}

let mytexteditor = document.querySelector(".page");
function isNoHighlightColor(color) {
  if (!color || color === "transparent") return true;

  const c = color.toLowerCase().replace(/\s/g, "");

  return (
    c === "rgba(0,0,0,0)" ||
    c === "rgb(255,255,255)" ||
    c === "#ffffff" ||
    c === "#fff" ||
    c === "white"
  );
}


function isDefaultFontColor(color) {
  if (!color || color === "transparent") return true;
  const c = color.toLowerCase().replace(/\s/g, "");
  return c === "rgb(0,0,0)" || c === "#000000" || c === "#000" || c === "black";
}

function updateFormattingState() {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;

  const range = selection.getRangeAt(0);
  const inEditor = mytexteditor.contains(range.commonAncestorContainer);

  if (!inEditor) {
    boldBtn.classList.remove("active");
    italicBtn.classList.remove("active");
    underlineBtn.classList.remove("active");
    return;
  }

  const foreColor = document.queryCommandValue("foreColor");
  const hasFontColor = !isDefaultFontColor(foreColor);
  fontColorBtn.classList.toggle("active", hasFontColor);

  if (hasFontColor) {
    const hex = foreColor.toLowerCase().replace(/\s/g, "");
    fontColorBtn.style.setProperty("--current-color", hex);

    if (highlightColor.querySelector(`option[value="${hex}"]`)) {
      highlightColor.value = hex;
    }
  } else {
  
}

const backColor = document.queryCommandValue("backColor");

const hasHighlight = !isNoHighlightColor(backColor);
highlightBtn.classList.toggle("active", hasHighlight);

if (hasHighlight) {

  const hex = backColor.toLowerCase().replace(/\s/g, "");
  if (highlightColor.querySelector(`option[value="${hex}"]`)) {
    highlightColor.value = hex;
  } else {
    
  }
} else {
  highlightColor.value = "#ffff00"; 
}

const sel = window.getSelection();
if (sel.rangeCount > 0) {
  const node = sel.anchorNode;
  const el = node.nodeType === 3 ? node.parentElement : node;
  const computed = window.getComputedStyle(el);
  const lh = parseFloat(computed.lineHeight) / parseFloat(computed.fontSize);
  if (lh >= 2.8) lineHeightSelect.value = "3";
  else if (lh >= 2.3) lineHeightSelect.value = "2.5";
  else if (lh >= 1.8) lineHeightSelect.value = "2";
  else if (lh >= 1.4) lineHeightSelect.value = "1.5";
  else if (lh >= 1.1) lineHeightSelect.value = "1.15";
  else lineHeightSelect.value = "1";
}

  boldBtn.classList.toggle("active", document.queryCommandState("bold"));
  italicBtn.classList.toggle("active",document.queryCommandState("italic"));
  underlineBtn.classList.toggle("active", document.queryCommandState("underline"));
  strikeBtn.classList.toggle("active", document.queryCommandState("strikeThrough"));
  bulletListBtn.classList.toggle("active", document.queryCommandState("insertUnorderedList"));
  numberListBtn.classList.toggle("active", document.queryCommandState("insertOrderedList"));

  updateHeadingState();
}



updateFormattingState();  
const fontCSS = {
  "Times": "'Times New Roman', Times, serif",
  "Helvetica": "Inter, 'Helvetica Neue', Helvetica, sans-serif",
  "Courier": "'Courier New', Courier, monospace"
}

function updateAlignmentButtonState(wrapper) {
  alignLeftBtn.classList.remove("active");
  alignCenterBtn.classList.remove("active");
  alignRightBtn.classList.remove("active");
  alignJustifyBtn.classList.remove("active");

  if (selectedImage) {
    if (selectedImage.classList.contains("align-left")) alignLeftBtn.classList.add("active");
    else if (selectedImage.classList.contains("align-center")) alignCenterBtn.classList.add("active");
    else if (selectedImage.classList.contains("align-right")) alignRightBtn.classList.add("active");
  } else {
    const isLeft = document.queryCommandState("justifyLeft");
    const isCenter = document.queryCommandState("justifyCenter");
    const isRight = document.queryCommandState("justifyRight");
    const isJustify = document.queryCommandState("justifyFull");

    if (isLeft) alignLeftBtn.classList.add("active");
    if (isCenter) alignCenterBtn.classList.add("active");
    if (isRight) alignRightBtn.classList.add("active");
    if (isJustify) alignJustifyBtn.classList.add("active");
  }
}


function applyFontSizeToSelection(ptSize) {
  const selection = window.getSelection();

if (!selection.rangeCount || selection.isCollapsed) {
  const activePage = getActivePage();
  activePage.style.fontSize = ptSize + "pt";
  return;
}

const range = selection.getRangeAt(0);

if (!mytexteditor.contains(range.commonAncestorContainer)) {
  return;
}

const fragment = range.extractContents();

const span = document.createElement("span");
span.style.fontSize = ptSize + "pt";
span.appendChild(fragment);


range.insertNode(span);

selection.removeAllRanges();
const newRange = document.createRange();
newRange.setStartAfter(span);
newRange.collapse(true);
selection.addRange(newRange);


    
 

  updateCounter();
}

if (window.jspdf && typeof window.jspdf.jsPDF === "function") {
  
  jsPDF = window.jspdf.jsPDF;
  console.log("jsPDF loaded successfully");
} else {
  console.error("jsPDF failed to load")
}


const firstPage = document.querySelector(".page");
if (firstPage) {
  firstPage.style.fontFamily = fontCSS[fontSelect.value];
  firstPage.style.fontSize = fontSizeSelect.value + "pt";
}

fontSelect.addEventListener("change", () => {
  const activePage = getActivePage();
  activePage.style.fontFamily = fontCSS[fontSelect.value];
  handleOverflow(activePage);
});

undoBtn.addEventListener("click", () => {
  if (undoIndex > 0) {
    undoTableOperation();
  } else {
    document.execCommand("undo", false, null);
    mytexteditor.focus();
  }
});

redoBtn.addEventListener("click", () => {
  if (undoIndex < undoStack.length - 1) {
    redoTableOperation();
  }
});



clearbtn.addEventListener("click", () => {
  if (confirm("Start a new blank document? Your current document will remain saved.")) {
    currentDocumentId = "doc-" + Date.now();
    pagesContainer.innerHTML = '<div class="page" contenteditable="true" data-placeholder="Here you can write"></div>';
    const firstPage = pagesContainer.querySelector(".page");
    firstPage.focus();
    updateCounter();
    updatePageCounter();
    removeEmptyPages();
    saveCurrentDocument(getCleanHTML());   
    updateDocumentUI();
  }
});




function saveText() {
  const text = getAllText();
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  const date = new Date().toISOString().slice(0, 10);
  link.download = `note-${date}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

savebtn.addEventListener("click", saveText);


function updateCounter() {
  const text = getAllText();  
  const charCount = text.length;
  const charCountNoSpaces = text.replace(/\s/g, "").length;
  const words = text.trim().split(/\s+/);
  const wordCount = text.trim() === "" ? 0 : words.length;
  counter.textContent = `Words: ${wordCount} | Characters: ${charCount} (${charCountNoSpaces} no spaces)`;
}

function updatePageCounter() {
  const pages = pagesContainer.querySelectorAll(".page");
  const total = pages.length;
  const active = getActivePage();
  const currentIndex = Array.from(pages).indexOf(active);
  const current = currentIndex >= 0 ? currentIndex + 1 : 1;
  
  const pageCounter = document.getElementById("pageCounter");
  if (pageCounter) {
    pageCounter.textContent = `Page ${current} of ${total}`;
  }
}


document.addEventListener("keydown", (event) => {


  if (event.key === "Escape" && focusMode) {
  event.preventDefault();
  focusMode = false;
  document.body.classList.remove("focus-mode");
  focusBtn.textContent = "🧘 Focus";
}



  if ((event.ctrlKey || event.metaKey) && event.key === "f") {
  event.preventDefault();
  openFindReplace();
  return;
  }

  if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.code === "KeyE") {
    event.preventDefault();
    exportWord();
     return;
  } 

  if ((event.ctrlKey ||event.metaKey) && event.key=== "s") {
    event.preventDefault();
    saveText();
    return;
  }
  if ((event.ctrlKey || event.metaKey) && event.key === "b") {
    event.preventDefault();
    const page = getActivePage();
    page.focus();
    document.execCommand("bold", false, null);
    updateFormattingState();
    return;
  }

  if((event.ctrlKey || event.metaKey) && event.key ==="i") {
    event.preventDefault();
    const page = getActivePage();
    page.focus();
    document.execCommand("italic", false, null);
    updateFormattingState();
    return;
  }

  if ((event.ctrlKey || event.metaKey) && event.key === "u") {
    event.preventDefault();
    const page = getActivePage();
    page.focus();
    document.execCommand("underline", false, null);
    updateFormattingState();
    return;
  }
if ((event.ctrlKey || event.metaKey) && event.key === "z") {
  event.preventDefault();
  if (undoIndex > 0) {
    undoTableOperation();
  } else {
    document.execCommand("undo", false, null);
    mytexteditor.focus();
  }
  return;
}
if ((event.ctrlKey || event.metaKey) && event.key === "y") {
  event.preventDefault();
  if (undoIndex < undoStack.length - 1) {
    redoTableOperation();
  }
  return;
}

});

function updateDocumentUI() {
  const nameSpan = document.getElementById("currentDocName");
  if (nameSpan) {
    nameSpan.textContent = currentDocumentId.length > 25
      ? currentDocumentId.slice(0, 25) + "…"
      : currentDocumentId;

  }
  refreshLoadDropdown();
}


function closeFileManager() {
  fileManagerModal.style.display = "none";
}
document.getElementById("findDragHandle").addEventListener("mousedown", startDragFind);


async function renderFileList(filter = "") {
  const docs = await listDocuments();
  fileList.innerHTML = "";

  const filtered = filter.trim() === ""
    ? docs
    : docs.filter(doc => doc.id.toLowerCase().includes(filter.toLowerCase()));

   const sorted = [...filtered].sort((a, b) => {
    switch (currentSort) {
      case "date-asc":  return a.lastModified - b.lastModified;
      case "date-desc": return b.lastModified - a.lastModified;
      case "name-asc":  return a.id.localeCompare(b.id);
      case "name-desc": return b.id.localeCompare(a.id);
      default:          return b.lastModified - a.lastModified;
    }
  });

  if (sorted.length ===0) {
    fileList.innerHTML = '<li style="padding:8px; color:#999;">No documents found.</li>';
    return;
  }

 sorted.forEach(doc => {
   const li = document.createElement("li");
    li.style.cssText = "display:flex; align-items:center; justify-content:space-between; padding:8px 4px; border-bottom:1px solid #ddd;";
   const isCurrent = doc.id === currentDocumentId;

    const left = document.createElement("div");
    const nameSpan = document.createElement("span");
    nameSpan.textContent = doc.id;
    nameSpan.style.fontWeight = isCurrent ? "bold" : "normal";
    const dateSpan = document.createElement("small");
    dateSpan.textContent = formatRelativeTime(doc.lastModified);
    dateSpan.style.display = "block";
    dateSpan.style.color = "#888";
    left.appendChild(nameSpan);
    left.appendChild(dateSpan);

    const right = document.createElement("div");
    right.style.display = "flex";
    right.style.gap = "5px";

    const openBtn = document.createElement("button");
    openBtn.textContent = "Open";
    openBtn.addEventListener("click", async () => {
      await loadDocumentAndUpdate(doc.id);
      closeFileManager();
    });
    right.appendChild(openBtn);

    const renameBtn = document.createElement("button");
    renameBtn.textContent = "✏️";
    renameBtn.title = "Rename";
    renameBtn.addEventListener("click", async () => {
      const newName = prompt("Rename to:", doc.id);
      if (newName && newName.trim() !== doc.id) {
        await renameDocument(doc.id, newName.trim());
      renderFileList(getSearchFilter());
        if (currentDocumentId === doc.id) {
          currentDocumentId = newName.trim();
          updateDocumentUI();
        }
      }
    });
    right.appendChild(renameBtn);

const duplicateBtn = document.createElement("button");
  duplicateBtn.textContent = "📋";
  duplicateBtn.title = "Duplicate";
  duplicateBtn.addEventListener("click", async () => {
  await duplicateDocument(doc.id);
  renderFileList(getSearchFilter());
});
right.appendChild(duplicateBtn);
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑️";
    deleteBtn.title = "Delete";
    deleteBtn.addEventListener("click", async () => {
      if (confirm(`Permanently delete "${doc.id}"?`)) {
        await deleteDocument(doc.id);
        if (currentDocumentId === doc.id) {
          currentDocumentId = "doc-" + Date.now();
          pagesContainer.innerHTML = '<div class="page" contenteditable="true" data-placeholder="Here you can write"></div>';
         saveCurrentDocument(getCleanHTML()); 
          updateDocumentUI();
        }
        renderFileList(getSearchFilter());
      }
    });
    right.appendChild(deleteBtn);

    li.appendChild(left);
    li.appendChild(right);
    fileList.appendChild(li);
  });

  
  
}

async function loadDocumentAndUpdate(id) {
  const html = await loadDocument(id);
  if (html !== null) {
    currentDocumentId = id;
    pagesContainer.innerHTML = html;
    const firstPage = pagesContainer.querySelector(".page");
    pagesContainer.querySelectorAll('.image-wrapper').forEach(ensureImageHasMoveHandle);
    if (firstPage) handleOverflow(firstPage);
    updateCounter();
    updatePageCounter();
    updateDocumentUI();
    setTimeout(observeAllImageWrappers, 0);
  }
}





async function refreshLoadDropdown() {
  const select = document.getElementById("loadDocSelect");
  if (!select) return;
  const docs = await listDocuments();
  select.innerHTML = '<option value="">-- Load --</option>';
  docs.forEach(doc => {
    const option = document.createElement("option");
    option.value = doc.id;
    option.textContent = `${doc.id} (${formatRelativeTime(doc.lastModified)})`;
    select.appendChild(option);
  });
}



fontSizeSelect.addEventListener("change", () => {
 const ptSize = parseInt(fontSizeSelect.value, 10);
 applyFontSizeToSelection(ptSize);
 const activePage = getActivePage();
 handleOverflow(activePage);
});

boldBtn.addEventListener("click", () => {
  const page = getActivePage();
  page.focus();
  document.execCommand("bold", false, null);
  updateFormattingState();  
});

italicBtn.addEventListener("click", ()=> {
  const page = getActivePage();
  page.focus();
  document.execCommand("italic", false, null);
  updateFormattingState();  
});

underlineBtn.addEventListener("click", () => {
  const page = getActivePage();
  page.focus();
  document.execCommand("underline", false, null);
  updateFormattingState();  
});

fileMenuBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  fileDropdown.classList.toggle("open")
});

document.addEventListener("click", () => {
  fileDropdown.classList.remove("open");
});

function startDragFind(e) {
  if (e.target !== document.getElementById("findDragHandle")) return; 
  e.preventDefault();
  const inner = document.getElementById("findReplaceInner");
  isDraggingFind = true;
  dragStartX = e.clientX;
  dragStartY = e.clientY;
  initialLeft = inner.offsetLeft;
  initialTop = inner.offsetTop;
  document.addEventListener("mousemove", onDragFind);
  document.addEventListener("mouseup", stopDragFind);
}

function onDragFind(e) {
  if (!isDraggingFind) return;
  const dx = e.clientX - dragStartX;
  const dy = e.clientY - dragStartY;
  const inner = document.getElementById("findReplaceInner");
  inner.style.left = (initialLeft + dx) + "px";
  inner.style.top = (initialTop + dy) + "px";
}

function stopDragFind() {
  isDraggingFind = false;
  document.removeEventListener("mousemove", onDragFind);
  document.removeEventListener("mouseup", stopDragFind);
}

if (localStorage.getItem("theme") === "dark") {
  body.classList.add("dark");
  themeToggle.textContent ="☀️"
}

themeToggle.addEventListener("click", () => {
  body.classList.toggle("dark");

  if(body.classList.contains("dark")) {
    themeToggle.textContent = "☀️";
    localStorage.setItem("theme", "dark");

  } else {
    themeToggle.textContent = "🌙";
    localStorage.setItem("theme", "light");
  }
});

function getAllText() {
  const pages = pagesContainer.querySelectorAll(".page");
  let text = "";
  pages.forEach(page => {
    text += page.textContent + "\n";
  });
  return text.trim();
}

function formatRelativeTime(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 10) return "just now";
  if (seconds < 60) return `${seconds} seconds ago`;
  if (minutes < 2) return "1 minute ago";
  if (minutes <60) return `${minutes} minutes ago`;
  if (hours < 2) return "1 hour ago";
  if (hours < 24) return `${hours} hours ago`;
   if (days === 1) return "Yesterday at " + new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (days < 7) return `${days} days ago`;
  return new Date(timestamp).toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
}


function handleOverflow(page) {


  if (isDraggingImage) return; 
  if (isExportingPDF || isResizingRuler || isResizingRow) return;
  if (!page || !page.classList.contains("page")) return;
  if (isHandlingOverflow) return;
  isHandlingOverflow = true;

  const MAX_PAGES = 50;
  let pagesCreated = 0;

  while (page.scrollHeight > page.clientHeight && pagesCreated < MAX_PAGES) {
  
    const newPage = document.createElement("div");
    newPage.className = "page";
    newPage.contentEditable = "true";
    newPage.setAttribute("data-placeholder", "Here you can write");

  
    while (page.scrollHeight > page.clientHeight && page.childNodes.length > 0) {
      const lastChild = page.lastChild;

if (lastChild.nodeType === 1) {
  const table = lastChild.closest('table');         
  if (table) {
    newPage.prepend(table);
    continue;   
  }
}
   
      if (lastChild.nodeType === Node.TEXT_NODE && lastChild.textContent.length > 0) {
        const text = lastChild.textContent;
     
        const splitIndex = findSplitIndex(page, lastChild);
        if (splitIndex > 0) {
          
          const rightPart = lastChild.splitText(splitIndex);
          newPage.prepend(rightPart);
        } else {

          newPage.prepend(lastChild);
        }
      } else {

        newPage.prepend(lastChild);
      }
    }

  
    if (newPage.childNodes.length === 0) break;


    page.parentNode.insertBefore(newPage, page.nextSibling);

  
    page = newPage;
    pagesCreated++;
  }
       if (page && page.isConnected) {   
    const sel = window.getSelection();
    
    if (!sel.rangeCount || !page.contains(sel.anchorNode)) {
      const walker = document.createTreeWalker(page, NodeFilter.SHOW_TEXT, null, false);
      const firstText = walker.nextNode();
      if (firstText && firstText.isConnected) {  
        try {
          const range = document.createRange();
          range.setStart(firstText, 0);
          range.collapse(true);
          sel.removeAllRanges();
          sel.addRange(range);
        } catch (e) { /* range not valid, just focus */ page.focus(); }
      } else {
        page.focus();
      }
    }
  }
  isHandlingOverflow = false;
  updatePageCounter();
}


function findSplitIndex(page, textNode) {
  const fullText = textNode.textContent;
  let low = 1;
  let high = fullText.length;
  let best = 0;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    
   
    const rightPart = textNode.splitText(mid);
    const fits = page.scrollHeight <= page.clientHeight;
    
   
    rightPart.textContent = "";   
    textNode.textContent = fullText; 
    
    if (fits) {
      best = mid;
      low = mid + 1;   
    } else {
      high = mid - 1;
    }
  }
  
  
  return best;
}
pagesContainer.addEventListener("input", (e) => {
  if (isExportingPDF) return;
  updateCounter();


  clearTimeout(autoSaveTimer);
  autoSaveTimer = setTimeout(() => {
    if (!isExportingPDF) {
       hideTableToolbar();
       hideRuler();
       saveCurrentDocument(getCleanHTML()); 
    }
  }, 500);

  const targetPage = e.target.closest(".page");
  if (targetPage) {
    lastEditedPage = targetPage;
  }
  clearTimeout(overflowTimer);
  overflowTimer = setTimeout(() => {
    if (lastEditedPage) {
      handleOverflow(lastEditedPage);
       removeEmptyPages();
       removeEmptyWrappers();
      lastEditedPage = null;
    }
  }, 150);
});
document.addEventListener("selectionchange", () => {
  mytexteditor = getActivePage();
  updateFormattingState();
  updatePageCounter();

  if (ignoreNextSelectionChange) {
    ignoreNextSelectionChange = false;   
    return;
  }
  if (sidebarOpen) {
  buildPageList(); 
}
const sel = window.getSelection();
if (sel.rangeCount > 0) {
  const range = sel.getRangeAt(0);
  const node = range.commonAncestorContainer;
  const table = node.nodeType === 1 ? node.closest('table') : node.parentElement?.closest('table');
  
  if (table) {
    
    showTableToolbar(table);
   
  } else {
    hideTableToolbar();
    clearAllCellHighlights(); 
  }
} else {
  hideTableToolbar();
}
  updateAlignmentButtonState(null);
});

function moveCursorToPageEnd(page) {
  page.focus();
  const sel = window.getSelection();
  if(page.childNodes.length > 0) {
    const range = document.createRange();
    range.selectNodeContents(page);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
  }

}

function moveCursorToPageStart(page) {
  page.focus();
  const sel = window.getSelection();
  if (page.childNodes.length > 0) {
    const range = document.createRange();
    range.selectNodeContents(page);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
  }
}

function removeEmptyPages() {
  if (isExportingPDF) return;
  const pages = pagesContainer.querySelectorAll(".page");
  if(pages.length <= 1) return;

  const activePage = getActivePage();

  for (const page of pages) {
if(page.textContent === "" && page.children.length === 0 && page !== activePage && page !== pagesContainer.firstElementChild) {
  page.remove();
}

  }


  if(pagesContainer.querySelectorAll(".page").length ===0) {
    const newPage = document.createElement("div");
    newPage.className = "page";
    newPage.contentEditable = "true";
    newPage.setAttribute("data-placeholder", "Here you can write");
    pagesContainer.appendChild(newPage);
    newPage.focus();
  }
  updatePageCounter();
}

document.addEventListener("keydown", (event) => {
    if(event.ctrlKey || event.metaKey || event.altKey) return;
  const sel = window.getSelection();
  if (!sel.rangeCount) return;
  const range = sel.getRangeAt(0);
  if (!range.collapsed) return;

  const page  = getActivePage();
  if (!page) return;

  if (event.key === "ArrowUp" || event.key === "ArrowDown") {
    const rect = range.getBoundingClientRect();
    const pageRect = page.getBoundingClientRect();
    const style = window.getComputedStyle(page);
    const padTop = parseFloat(style.paddingTop);
    const padBottom = parseFloat(style.paddingBottom);
    const lineHeight = parseFloat(style.lineHeight) * parseFloat(style.fontSize);
    const threshold = lineHeight * 0.5;

    if (event.key === "ArrowUp") {
      if (rect.top <= pageRect.top + padTop + threshold) {
        const prevPage = page.previousElementSibling;
        if (prevPage && prevPage.classList.contains("page")) {
          event.preventDefault();
          moveCursorToPageEnd(prevPage);
          updatePageCounter();
          updateFormattingState();
        }
      }
    } else if (event.key === "ArrowDown") {
      if (rect.bottom >= pageRect.bottom - padBottom - threshold) {
        const nextPage = page.nextElementSibling;
        if (nextPage && nextPage.classList.contains("page")) {
          event.preventDefault();
          moveCursorToPageStart(nextPage);
          updatePageCounter();
          updateFormattingState();
        }
      }
    }
  }
});



imageBtn.addEventListener("click", () => {
  imageInput.click();
});


imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const wrapper = document.createElement("div");
    wrapper.className = "image-wrapper";
    wrapper.setAttribute("draggable", "false"); 

    const img = document.createElement("img");
    img.src = e.target.result;
    img.setAttribute("draggable", "false");
    wrapper.appendChild(img);
    const moveHandle = document.createElement('div');
    moveHandle.className = 'image-move-handle';
    moveHandle.innerHTML = '⤡';   
    moveHandle.title = 'Drag to move image';
    wrapper.appendChild(moveHandle);


    const page = getActivePage();
    if (!page) return;



    const sel = window.getSelection();
    if (sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      if (page.contains(range.commonAncestorContainer)) {
        range.insertNode(wrapper);
        range.setStartAfter(wrapper);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      } else {
        page.appendChild(wrapper);
      }
    } else {
      page.appendChild(wrapper);
    }
    page.focus();
fitImageToPage(wrapper);
observeAllImageWrappers();


if (page) setTimeout(() => handleOverflow(page), 0);
   
    imageInput.value = "";
    observeAllImageWrappers();
  };
  reader.readAsDataURL(file);
});

pagesContainer.addEventListener("click", (e) => {
 
  let target = e.target;
  if (target.nodeType === Node.TEXT_NODE) {
    target = target.parentElement;
  }
 

  const img = target.closest("img");
  
  pagesContainer.querySelectorAll(".image-wrapper").forEach(el => el.classList.remove("image-selected"));

  if (img) {
    if (isDraggingImage) return;

    const wrapper = img.closest(".image-wrapper");
    if (!wrapper) return;
    const sel = window.getSelection();
    const range = document.createRange();
    range.selectNode(wrapper);
    sel.removeAllRanges();
    sel.addRange(range);
    wrapper.classList.add("image-selected");
    selectedImage = wrapper;
    updateImageWrapDropdown(wrapper);
    updateAlignmentButtonState(wrapper);
    e.preventDefault();
  } else {
    selectedImage = null;
  }
});

function clearImageAligment(img) {
  img.classList.remove("align-left","align-center","align-right");
}

function setImageAligment(aligmentClass) {
  let wrapper = null;

 
  const sel = window.getSelection();
  if (sel.rangeCount > 0) {
    const range = sel.getRangeAt(0);
    const node = range.commonAncestorContainer;
    const element = node.nodeType === 1 ? node : node.parentElement;
    const img = element?.closest("img");
    if (img) {
      wrapper = img.closest(".image-wrapper");
    }
  }

 
  if (!wrapper && selectedImage) {
    wrapper = selectedImage;
  }

  if (!wrapper) return;

  wrapper.classList.remove("align-left", "align-center", "align-right");
  wrapper.classList.add(aligmentClass);
  updateAlignmentButtonState(wrapper);

  const range = document.createRange();
  range.selectNode(wrapper);
  const newSel = window.getSelection();
  newSel.removeAllRanges();
  newSel.addRange(range);
}

alignLeftBtn.addEventListener("click", () => {
  if (selectedImage) {
    setImageAligment("align-left");
  } else {
    const page = getActivePage();
    page.focus();
    document.execCommand("justifyLeft", false, null);
    selectedImage = null;  
    updateAlignmentButtonState(null);
    ignoreNextSelectionChange = true;
  }
});

alignCenterBtn.addEventListener("click", () => {
  if (selectedImage) {
    setImageAligment("align-center");
  } else {
    const page = getActivePage();
    page.focus();
    document.execCommand("justifyCenter", false, null);
    selectedImage = null;
    updateAlignmentButtonState(null);
    ignoreNextSelectionChange = true;
  }
});

alignRightBtn.addEventListener("click", () => {
  if (selectedImage) {
    setImageAligment("align-right");
  } else {
    const page = getActivePage();
    page.focus();
    document.execCommand("justifyRight", false, null);
    selectedImage = null;
    updateAlignmentButtonState(null);
    ignoreNextSelectionChange = true;
  }
});

alignJustifyBtn.addEventListener("click", () => {
  if (selectedImage) return;
  const page = getActivePage();
  page.focus();
  document.execCommand("justifyFull", false, null);
  updateAlignmentButtonState(null);
  ignoreNextSelectionChange = true;
});

pagesContainer.addEventListener("paste", (e) => {
  const items = e.clipboardData?.items;
  if (!items) return;

  for (const item of items) {
    if (item.type.startsWith("image/")) {
      e.preventDefault();

      const file = item.getAsFile();
      if (!file) continue;

      const reader = new FileReader();
      reader.onload = (event) => {
        const wrapper = document.createElement("div");
        wrapper.className = "image-wrapper";
        wrapper.setAttribute("draggable", "false");
        const img = document.createElement("img");
        img.src = event.target.result;
        img.setAttribute("draggable", "false"); 
        wrapper.appendChild(img);

        const moveHandle = document.createElement('div');
        moveHandle.className = 'image-move-handle';
        moveHandle.innerHTML = '⤡';   
        moveHandle.title = 'Drag to move image';
        wrapper.appendChild(moveHandle);
        const page = getActivePage();
        if (!page) return;

        const sel = window.getSelection();
        if (sel.rangeCount > 0) {
          const range = sel.getRangeAt(0);
          if (page.contains(range.commonAncestorContainer)) {
            range.insertNode(wrapper);
            range.setStartAfter(wrapper);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
          } else {
            page.appendChild(wrapper);
          }
        } else {
          page.appendChild(wrapper);
        }
        page.focus();
        fitImageToPage(wrapper);
        observeAllImageWrappers();
        
        if (page) setTimeout(() => handleOverflow(page), 0);
      };
      reader.readAsDataURL(file);
      break;
    }
  }
});

function removeEmptyWrappers() {
  if (isExportingPDF) return;
  pagesContainer.querySelectorAll(".image-wrapper").forEach(wrapper => {
    if (!wrapper.querySelector("img")) {
      wrapper.remove();
    }
  });
  if (selectedImage && !document.body.contains(selectedImage)) {
    selectedImage = null;
    alignLeftBtn.classList.remove("active");
    alignCenterBtn.classList.remove("active");
    alignRightBtn.classList.remove("active");
  }

}


async function exportRichPDF() {
  if (!jsPDF) {
    alert("PDF library not loaded.");
    return;
  }

  const indicator = document.getElementById("exportIndicator");
  indicator.style.display = "block";

  isExportingPDF = true;

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pages = pagesContainer.querySelectorAll(".page");
  const state = { y: 20, x: 20 };
  const maxWidth = 170;

  for (let i = 0; i < pages.length; i++) {
    indicator.textContent = `Exporting PDF… page ${i + 1} of ${pages.length}`;
    await new Promise(resolve => setTimeout(resolve, 0));

    if (i > 0) {
      doc.addPage();
      state.y = 20;
    }
    await processNode(pages[i], doc, state, maxWidth);
  }

 
  if (showPageNumbers) {
    const totalPages = doc.internal.getNumberOfPages();   
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.text(`Page ${i}`, 105, 285, { align: "center" });
    }
  }


  isExportingPDF = false;
  indicator.style.display = "none";
  doc.save(`rich-document-${new Date().toISOString().slice(0,10)}.pdf`);
}


async function exportWord() {
const { Document, Packer, Paragraph, TextRun, ImageRun, PageBreak, AlignmentType,
        Table, TableRow, TableCell, WidthType, ShadingType } = docx;



    function getParagraphAlignment(element) {
    const textAlign = window.getComputedStyle(element).textAlign;
    switch (textAlign) {
      case "center":  return AlignmentType.CENTER;
      case "right":   return AlignmentType.RIGHT;
      case "justify": return AlignmentType.JUSTIFIED;
      default:        return AlignmentType.LEFT;
    }
   }



  function createTextRun(text, node) {



    const el = node.nodeType === 1 ? node : node.parentElement;
    const style = window.getComputedStyle(el);
    
const textColor = style.color;
const fontHex = cssColorToHex(textColor);
    const fontWeight = style.fontWeight;
    const fontStyle = style.fontStyle;               
    const textDecoration = style.textDecorationLine; 
    const fontSize = parseFloat(style.fontSize);
    const fontFamily = style.fontFamily;

const backgroundColor = style.backgroundColor;
const hexColor = cssColorToHex(backgroundColor);

const highlightMap = {
  "#ffff00": "yellow",
  "#ff9900": "yellow",  
  "#ff0000": "red",
  "#00ff00": "green",
  "#00ccff": "cyan"
};
const highlightValue = highlightMap[hexColor] || undefined;

    const run = new TextRun({
      text: text,
      bold: fontWeight >= 600,
      italics: fontStyle === "italic",
      underline: textDecoration.includes("underline") ? { type: "single" } : undefined,
      strike: textDecoration.includes("line-through"),
      size: Math.round(fontSize * 0.75 * 2),
      font: {
        name: fontFamily.includes("Times") ? "Times New Roman" :
              fontFamily.includes("Courier") ? "Courier New" : "Helvetica",
     
      },
       highlight: highlightValue,
       color: fontHex || undefined,
    });
    return run;
  }

  function collectParagraphs(container) {
    const paragraphs = [];
    let currentParagraph = [];

    function walk(node) {
      if (node.nodeType === 3) {
        const text = node.textContent;
        if (text.trim() === "") return;
        currentParagraph.push(createTextRun(text, node));
      } else if (node.nodeType === 1) {
        const tag = node.tagName.toLowerCase();


if (tag === "ul" || tag === "ol") {

  if (currentParagraph.length > 0) {
    const alignment = getParagraphAlignment(node.parentElement);
    paragraphs.push(new Paragraph({ children: currentParagraph, alignment }));
    currentParagraph = [];
  }

  const isOrdered = tag === "ol";
  let counter = 0;

  for (const li of node.children) {
    if (li.tagName && li.tagName.toLowerCase() === "li") {
      counter++;
      const prefix = isOrdered ? `${counter}. ` : "• ";
      const liChildren = [];

      function walkLI(n) {
        if (n.nodeType === 3) {
          const text = n.textContent;
          if (text.trim() === "") return;
          liChildren.push(createTextRun(text, n));
        } else if (n.nodeType === 1) {
          const ntag = n.tagName.toLowerCase();
          if (ntag === "br") {
            liChildren.push(new TextRun({ break: 1 }));
          } else if (ntag === "ul" || ntag === "ol") {
            
          } else {
            for (const child of n.childNodes) walkLI(child);
          }
        }
      }

      for (const child of li.childNodes) walkLI(child);

      if (liChildren.length > 0) {
        
        liChildren.unshift(new TextRun({
          text: prefix,
          bold: isOrdered,  
        }));
        const alignment = getParagraphAlignment(li);
        paragraphs.push(new Paragraph({ children: liChildren, alignment }));
      }
    }
  }

  
  return;
}
else if (tag === "table") {
  if (currentParagraph.length > 0) {
    paragraphs.push(new Paragraph({ children: currentParagraph, alignment: getParagraphAlignment(node.parentElement) }));
    currentParagraph = [];
  }

  const tableRows = [];
  const rows = node.querySelectorAll("tr");
  rows.forEach(row => {
    const cells = [];
    row.querySelectorAll("td, th").forEach(cell => {
      const cellRuns = [];
      function collectRuns(n) {
        if (n.nodeType === 3) {
          const text = n.textContent;
          if (text.trim() === "") return;
          cellRuns.push(createTextRun(text, n));
        } else if (n.nodeType === 1) {
          for (const child of n.childNodes) collectRuns(child);
        }
      }
      for (const child of cell.childNodes) collectRuns(child);
      
      const cellParagraph = new Paragraph({
        children: cellRuns.length ? cellRuns : [new TextRun(" ")]
      });
const cellStyle = window.getComputedStyle(cell);
const bgColor = cellStyle.backgroundColor;
const bgHex = cssColorToHex(bgColor);  
const cellOptions = {
  children: [cellParagraph],
  margins: { top: 120, bottom: 120, left: 120, right: 120 }
};
if (bgHex && bgHex !== '#ffffff') {
  cellOptions.shading = {
    type: ShadingType.SOLID,
    color: bgHex.substring(1)   
  };
}
cells.push(new TableCell(cellOptions));

    });
    tableRows.push(new TableRow({ children: cells }));
  });


  const columnsCount = rows[0]?.querySelectorAll("td, th").length || 1;
  const table = new Table({
    rows: tableRows,
    width: { size: 100, type: WidthType.PERCENTAGE },
    columnWidths: Array(columnsCount).fill(Math.floor(100 / columnsCount))
  });
  paragraphs.push(table);
  return;
}

else if (tag === "br" || tag === "p" || tag === "div" || tag === "h1" || tag === "h2" || tag === "h3") {

  if (currentParagraph.length > 0) {
    const parentBlock = node.nodeType === 1 ? node : node.parentElement;
    const alignment = getParagraphAlignment(parentBlock);
    paragraphs.push(new Paragraph({ children: currentParagraph, alignment }));
    currentParagraph = [];
  }

  if (tag === "br") {
    const alignment = getParagraphAlignment(node.parentElement);
    paragraphs.push(new Paragraph({ children: [], alignment }));
  } else {
    for (const child of node.childNodes) walk(child);
    if (currentParagraph.length > 0) {
      const alignment = getParagraphAlignment(node);
      paragraphs.push(new Paragraph({ children: currentParagraph, alignment }));
      currentParagraph = [];
    }
  }
} else if (tag === "img" || node.classList?.contains("image-wrapper")) {
          if (currentParagraph.length > 0) {
            paragraphs.push(new Paragraph({ children: currentParagraph }));
            currentParagraph = [];
          }
          let wrapper = node;
          if (wrapper.tagName === "IMG") wrapper = wrapper.closest(".image-wrapper");
          if (wrapper) {
            const img = wrapper.querySelector("img");
            if (img && img.src.startsWith("data:image")) {
              const base64 = img.src.split(",")[1];
              const byteString = atob(base64);
              const bytes = new Uint8Array(byteString.length);
              for (let i = 0; i < byteString.length; i++) {
                bytes[i] = byteString.charCodeAt(i);
              }
              const imageRun = new ImageRun({
                data: bytes,
                transformation: {
                  width: wrapper.offsetWidth * 0.75,
                  height: wrapper.offsetHeight * 0.75
                },
                type: img.src.startsWith("data:image/png") ? "png" : "jpeg"
              });
              paragraphs.push(new Paragraph({ children: [imageRun] }));
            }
          }
        } else {
          for (const child of node.childNodes) walk(child);
        }
      }
    }

    walk(container);
    if (currentParagraph.length > 0) {
    
       const alignment = getParagraphAlignment(container);
      paragraphs.push(new Paragraph({ children: currentParagraph, alignment }));
    }
   
    return paragraphs; 
   
  }

  const pages = pagesContainer.querySelectorAll(".page");
  const allParagraphs = [];
  for (const page of pages) {
  const children = collectParagraphs(page);
  allParagraphs.push(...children);
  }

  const doc = new Document({
    sections: [{
      properties: {},
      children: allParagraphs
    }]
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `document-${new Date().toISOString().slice(0,10)}.docx`;
  link.click();
  URL.revokeObjectURL(url);
}





function getFontInfo(node) {
  const el = node.nodeType === 1 ? node : node.parentElement;
  const style = window.getComputedStyle(el);
  const fontWeight = style.fontWeight;
  const fontStyle = style.fontStyle;
  const textDecoration = style.textDecorationLine;
  const fontSize = parseFloat(style.fontSize);
  const fontFamily = style.fontFamily;

  let pdfFont = "Helvetica";
  if (fontFamily.includes("Times")) pdfFont = "Times";
  else if (fontFamily.includes("Courier")) pdfFont = "Courier";

  let pdfStyle = "normal";
  if (fontWeight >= 600 && fontStyle === "italic") pdfStyle = "bolditalic";
  else if (fontWeight >= 600) pdfStyle = "bold";
  else if (fontStyle === "italic") pdfStyle = "italic";

  const underline = textDecoration.includes("underline");

  return {
    fontFamily: pdfFont,
    style: pdfStyle,
    fontSizePt: fontSize * 0.75,
    underline
  };
}

async function processNode(node, doc, state, maxWidth) {
  if (node.nodeType === 3) {                        
    if (node.textContent.trim() === "") return;

    const info = getFontInfo(node);                  
    doc.setFont(info.fontFamily, info.style);
    doc.setFontSize(info.fontSizePt);

  
    const el = node.parentElement;
    const style = window.getComputedStyle(el);
    const bgColor = style.backgroundColor;
    let fillColor = null;
    if (bgColor && bgColor !== "transparent" && bgColor !== "rgba(0, 0, 0, 0)") {
      fillColor = bgColor;   
    }

    const text = node.textContent;
    const lines = doc.splitTextToSize(text, maxWidth);

    for (const line of lines) {
      if (state.y > 270) {
        doc.addPage();
        state.y = 20;
      }

    
      if (fillColor) {
        const textWidth = doc.getTextWidth(line);
        const lineHeight = info.fontSizePt * 0.3528;  
        doc.setFillColor(fillColor);
        doc.rect(state.x, state.y - lineHeight * 0.8, textWidth, lineHeight, "F");
      }
      const textColor = style.color;
  if (textColor && textColor !== "transparent" && textColor !== "rgb(0, 0, 0)") {
  doc.setTextColor(textColor);
} else {
  doc.setTextColor("#000000");   
}

      doc.text(line, state.x, state.y);

      if (info.underline) {
        const textWidth = doc.getTextWidth(line);
        const underlineY = state.y + 0.5;
        doc.setLineWidth(0.1);
        doc.line(state.x, underlineY, state.x + textWidth, underlineY);
      }
      state.y += info.fontSizePt * 0.3528;
    }

   } else if (node.nodeType === 1) {                  
    const tag = node.tagName.toLowerCase();

    if (tag === "ul" || tag === "ol") {
      const isOrdered = tag === "ol";
      let itemIndex = 0;
      const indent = 10;

      for (const li of node.children) {
        if (li.tagName && li.tagName.toLowerCase() === "li") {
          itemIndex++;
          const prefix = isOrdered ? `${itemIndex}. ` : "• ";
          const liInfo = getFontInfo(li);
          doc.setFont(liInfo.fontFamily, liInfo.style);
          doc.setFontSize(liInfo.fontSizePt);

          const oldX = state.x;
          const oldY = state.y;
          state.x += indent;

          doc.text(prefix, state.x, state.y);
          const prefixWidth = doc.getTextWidth(prefix);
          state.x += prefixWidth + 2;
          state.y = oldY;

          for (const child of li.childNodes) {
            await processNode(child, doc, state, maxWidth);
          }

          state.x = oldX;
          state.y += 2;
        }
      }
      return;
    }
    else if (tag === "table") {
      const rows = node.querySelectorAll("tr");
      const cellPadding = 2;
      const startX = state.x;
      let currentY = state.y;

      for (const row of rows) {
        const cells = row.querySelectorAll("td, th");
        let maxCellHeight = 0;
        for (const cell of cells) {
          const cellText = cell.textContent.trim() || " ";
          const lines = doc.splitTextToSize(cellText, maxWidth / cells.length - cellPadding * 2);
          const lineHeight = 5;
          const cellHeight = lines.length * lineHeight + cellPadding * 2;
          if (cellHeight > maxCellHeight) maxCellHeight = cellHeight;
        }

        if (currentY + maxCellHeight > 270) {
          doc.addPage();
          currentY = 20;
        }

        let cellX = startX;
        for (const cell of cells) {
          const cellWidth = maxWidth / cells.length;
          const cellText = cell.textContent.trim() || " ";
          const style = window.getComputedStyle(cell);
      const bgColor = style.backgroundColor;
      const bgHex = cssColorToHex(bgColor);
      if (bgHex) {
      doc.setFillColor(bgHex);
      doc.rect(cellX, currentY, cellWidth, maxCellHeight, "F");
}

          doc.setDrawColor("#000");
          doc.setLineWidth(0.1);
          doc.rect(cellX, currentY, cellWidth, maxCellHeight, "S");

          doc.setFontSize(10);
          doc.setTextColor("#000");
          const lines = doc.splitTextToSize(cellText, cellWidth - cellPadding * 2);
          doc.text(lines, cellX + cellPadding, currentY + cellPadding + 3);

          cellX += cellWidth;
        }
        currentY += maxCellHeight;
      }

      state.y = currentY + 5;
      return;
    }
    else if (tag === "img" || node.classList?.contains("image-wrapper")) {
      await processImage(node, doc, state, maxWidth);
    } else if (tag === "div" || tag === "p" || tag === "h1" || tag === "h2" || tag === "h3") {
      for (const child of node.childNodes) {
        await processNode(child, doc, state, maxWidth);
      }
      const style = window.getComputedStyle(node);
      const marginBottom = parseFloat(style.marginBottom) || 0;
      state.y += marginBottom * 0.3528 + 2;
    } else {
      for (const child of node.childNodes) {
        await processNode(child, doc, state, maxWidth);
      }
    }
  }
}

async function processImage(wrapperOrImg, doc, state, maxWidth) {
  let wrapper = wrapperOrImg;
  if (wrapper.tagName === "IMG") {
    wrapper = wrapper.closest(".image-wrapper");
    if (!wrapper) return;
  }
  const img = wrapper.querySelector("img");
  if (!img) return;

  const src = img.src;
  if (!src || !src.startsWith("data:image")) return;

  const widthPx = wrapper.offsetWidth;
  const heightPx = wrapper.offsetHeight;
  const widthMm = widthPx * 0.264583;
  const heightMm = heightPx * 0.264583;

  let finalWidth = widthMm;
  let finalHeight = heightMm;
  if (finalWidth > maxWidth) {
    const ratio = maxWidth / finalWidth;
    finalWidth = maxWidth;
    finalHeight *= ratio;
  }

  let xPos = state.x;
  if (wrapper.classList.contains("align-center")) {
    xPos = state.x + (maxWidth - finalWidth) / 2;
  } else if (wrapper.classList.contains("align-right")) {
    xPos = state.x + maxWidth - finalWidth;
  }

  if (state.y + finalHeight > 270) {
    doc.addPage();
    state.y = 20;
  }

  const format = src.startsWith("data:image/png") ? "PNG" :
                 src.startsWith("data:image/jpeg") ? "JPEG" : "PNG";

  doc.addImage(src, format, xPos, state.y, finalWidth, finalHeight);
  state.y += finalHeight + 5;
}

richpdfbtn.addEventListener("click", () => {
  exportRichPDF().catch(err => {
    console.error("Error exporting rich PDF:", err);
    alert("An error occurred while exporting the rich PDF. Please check the console for details.");
    isExportingPDF = false;
    document.getElementById("exportIndicator").style.display = "none";
  });
});
pageNumToggle.addEventListener("click", () => {
  showPageNumbers = !showPageNumbers;
 
  if (showPageNumbers) {
    pageNumToggle.classList.add("active");
    pageNumToggle.textContent = "📄 Page Numbers ✓";
  } else {
    pageNumToggle.classList.remove("active");
    pageNumToggle.textContent = "📄 Page Numbers";
  }
});

strikeBtn.addEventListener("click", () => {
  const page = getActivePage();
  page.focus();
  document.execCommand("strikeThrough", false, null);
  updateFormattingState();
});

savehtmlbtn.addEventListener("click", () => {
  const html = pagesContainer.innerHTML;
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `document-${new Date().toISOString().slice(0,10)}.html`;
  link.click();
  URL.revokeObjectURL(url);
});

saveAsBtn.addEventListener("click", async () => {
  const name = prompt("Save as:", currentDocumentId);
  if (!name) return;
  currentDocumentId = name.trim() || "untitled";
  await saveCurrentDocument(getCleanHTML()); 
  updateDocumentUI();
  alert(`Document saved as "${currentDocumentId}"`);
});


loadDocSelect.addEventListener("change", async () => {
  const id = loadDocSelect.value;
  if (!id) return;
  const html = await loadDocument(id);
  if (html !== null) {
    currentDocumentId = id;
    pagesContainer.innerHTML = html;
    const firstPage = pagesContainer.querySelector(".page");
    if (firstPage) handleOverflow(firstPage);
    updateCounter();
    updatePageCounter();
    updateDocumentUI();
  }
  else {
    alert("document not found");
  }
});

openFileManagerBtn.addEventListener("click", openFileManager);
closeModalBtn.addEventListener("click", closeFileManager);

newDocFromModalBtn.addEventListener("click", () => {
currentDocumentId = "doc-" +Date.now();
pagesContainer.innerHTML = '<div class="page" contenteditable="true" data-placeholder="Here you can write"></div>';
const firstPage = pagesContainer.querySelector(".page");
firstPage.focus();
updateCounter();
updatePageCounter();
removeEmptyPages();
saveCurrentDocument(getCleanHTML()); 
updateDocumentUI();
renderFileList(getSearchFilter());
});

fileManagerModal.addEventListener("click", (e) => {
  if(e.target === fileManagerModal) {
    closeFileManager();
  }
});

async function importWord(file) {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.convertToHtml({ arrayBuffer});
  const html = result.value;

  pagesContainer.innerHTML = '<div class="page" contenteditable="true" data-placeholder="Here you can write"></div>';
  const firstPage = pagesContainer.querySelector(".page");
  if (firstPage) {
    firstPage.innerHTML = html;
  }
  handleOverflow(firstPage);
  updateCounter();
  updatePageCounter();
  currentDocumentId = "imported-" + Date.now();
  saveCurrentDocument(getCleanHTML()); 
  updateDocumentUI();
}

exportWordBtn.addEventListener("click", exportWord);

importWordBtn.addEventListener("click", () => {
  wordFileInput.click();
});

wordFileInput.addEventListener("change", async () => {
  const file = wordFileInput.files[0];
  if (!file) return;
  await importWord(file);
  wordFileInput.value = "";
});

deleteCurrentDocBtn.addEventListener("click", async () => {
  if (!currentDocumentId) return;
  if (!confirm(`Permanently delete "${currentDocumentId}"?`)) return;

  await deleteDocument(currentDocumentId);


  currentDocumentId = "doc-" + Date.now();
  pagesContainer.innerHTML = '<div class="page" contenteditable="true" data-placeholder="Here you can write"></div>';
  const firstPage = pagesContainer.querySelector(".page");
  if (firstPage) firstPage.focus();
  updateCounter();
  updatePageCounter();
  saveCurrentDocument(getCleanHTML()); 
  updateDocumentUI();
 renderFileList(getSearchFilter()); 
});

openFileManagerFromMenuBtn.addEventListener("click", () => {
  openFileManager();
  fileDropdown.classList.remove("open");  
});
function getSearchFilter() {
  const input = document.getElementById("fileSearch");
  return input ? input.value : "";
}
document.getElementById("fileSearch").addEventListener("input", () => {
  renderFileList(getSearchFilter());
});
function openFileManager() {
  const searchInput = document.getElementById("fileSearch");
  if (searchInput) searchInput.value = "";
  const sortSelect = document.getElementById("sortSelect");
  if (sortSelect) sortSelect.value = "date-desc";
  currentSort = "date-desc";
  fileManagerModal.style.display = "flex";
  renderFileList(""); 
}
document.getElementById("sortSelect").addEventListener("change", (e) => {
  currentSort = e.target.value;
  renderFileList(getSearchFilter());
});

async function duplicateDocument(oldId) {
  if (!db) return;
  const oldDoc = await db.get("docs", oldId);
  if (!oldDoc) return;
  const newId = prompt("Duplicate as:", oldId + " (copy)");
  if (!newId ||newId.trim() ==="") return;
  await db.put("docs", {
    id: newId.trim(),
    html: oldDoc.html,
    lastModified: Date.now()
  });
  console.log(`Duplicated "${oldId}" → "${newId.trim()}"`);
}
deleteAllDocsBtn.addEventListener("click", async () => {
  if (!confirm("⚠️ Are you sure you want to PERMANENTLY DELETE ALL documents?\n\nThis cannot be undone.")) return;
  if (!confirm("Final confirmation: This will wipe everything from your local storage.\nProceed?")) return;

  if (!db) return;
  await db.clear("docs");  


  currentDocumentId = "doc-" + Date.now();
  pagesContainer.innerHTML = '<div class="page" contenteditable="true" data-placeholder="Here you can write"></div>';
  const firstPage = pagesContainer.querySelector(".page");
  if (firstPage) firstPage.focus();
  updateCounter();
  updatePageCounter();
  saveCurrentDocument(getCleanHTML()); 
  updateDocumentUI();
  renderFileList(getSearchFilter());
  closeFileManager();
});

async function downloadAllDocuments() {
  if (!db) return;

  const docs = await listDocuments();
  if (docs.length === 0) {
    alert("No documents to download.");
    return;
  }

  const zip = new JSZip();
  docs.forEach(doc => {

    zip.file(doc.id + ".html", doc.html);
  });

  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `documents-backup-${new Date().toISOString().slice(0, 10)}.zip`;
  link.click();
  URL.revokeObjectURL(url);
}

downloadAllBtn.addEventListener("click", downloadAllDocuments);



function openFindReplace() {
  findReplaceModal.style.display = "block";  
  searchInput.value = "";
  replaceInput.value = "";
  searchStatus.textContent = "";
  matches = [];
  currentMatchIndex = -1;

  
  const inner = document.getElementById("findReplaceInner");
  if (inner) {
    inner.style.left = Math.max(0, (window.innerWidth - inner.offsetWidth) / 2) + "px";
    inner.style.top = "120px";
  }
}


function closeFindReplace() {
  removeAllHighlights();
  findReplaceModal.style.display = "none";
  window.getSelection().removeAllRanges();
  highlightSpans = [];
  currentHighlightSpan = null;
}


function collectMatches(searchTerm, caseSensitiveFlag) {
  matches = [];
  if (!searchTerm) return;
  const pages = pagesContainer.querySelectorAll(".page");
  const flags = caseSensitiveFlag ? "g" : "gi";
  const regex = new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags);

  pages.forEach(page => {
    const walker = document.createTreeWalker(page, NodeFilter.SHOW_TEXT, null, false);
    let node;
    while ((node = walker.nextNode())) {
      const text = node.textContent;
      let match;
      while ((match = regex.exec(text)) !== null) {
        matches.push({
          node: node,
          start: match.index,
          length: match[0].length
        });

        if (match.index === regex.lastIndex) {
          regex.lastIndex++;
        }
      }
    }
  });
}


function highlightMatch(index) {
  if (index < 0 || index >= highlightSpans.length) return;

  
  if (currentHighlightSpan) {
    currentHighlightSpan.classList.remove("find-match-current");
  }

  const span = highlightSpans[index];
  span.classList.add("find-match-current");
  currentHighlightSpan = span;

  
  const range = document.createRange();
  range.selectNodeContents(span);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);

  currentMatchIndex = index;
  searchStatus.textContent = `Match ${index + 1} of ${highlightSpans.length}`;
  searchInput.focus();
}

function findNext() {
  const term = searchInput.value;
  if (!term) return;
  removeAllHighlights();          
  collectMatches(term, caseSensitive.checked);
  if (matches.length === 0) {
    searchStatus.textContent = "No matches";
    currentMatchIndex = -1;
    return;
  }
  highlightAllMatches();          
  const nextIndex = (currentMatchIndex + 1) % highlightSpans.length;
  highlightMatch(nextIndex);
}


function replaceCurrent() {
  if (currentMatchIndex < 0 || currentMatchIndex >= matches.length) return;
  const match = matches[currentMatchIndex];
  const replaceText = replaceInput.value;

 
  removeAllHighlights();

 
  match.node.textContent =
    match.node.textContent.substring(0, match.start) +
    replaceText +
    match.node.textContent.substring(match.start + match.length);

 
  collectMatches(searchInput.value, caseSensitive.checked);
  if (matches.length > 0) {
    highlightAllMatches();
    const newIndex = Math.min(currentMatchIndex, matches.length - 1);
    highlightMatch(newIndex);
  } else {
    currentMatchIndex = -1;
    searchStatus.textContent = "No matches";
  }
  saveCurrentDocument(getCleanHTML()); 
}


function replaceAllMatches() {
  const term = searchInput.value;
  if (!term) return;
  const replaceText = replaceInput.value;
  removeAllHighlights();         
  collectMatches(term, caseSensitive.checked);
  if (matches.length === 0) return;
 
  for (let i = matches.length - 1; i >= 0; i--) {
    const m = matches[i];
    m.node.textContent =
      m.node.textContent.substring(0, m.start) +
      replaceText +
      m.node.textContent.substring(m.start + m.length);
  }
  searchStatus.textContent = `${matches.length} replacement(s) made.`;
  matches = [];
  currentMatchIndex = -1;
  window.getSelection().removeAllRanges();
  saveCurrentDocument(getCleanHTML()); 
}




closeFindBtn.addEventListener("click", closeFindReplace);

findNextBtn.addEventListener("click", findNext);
replaceBtn.addEventListener("click", replaceCurrent);
replaceAllBtn.addEventListener("click", replaceAllMatches);


let searchDebounce;

let highlightDebounce;
searchInput.addEventListener("input", () => {
  
  removeAllHighlights();

  clearTimeout(searchDebounce);
  clearTimeout(highlightDebounce);

  
  currentMatchIndex = -1;
  matches = [];

  
  const term = searchInput.value;
  if (!term) {
    searchStatus.textContent = "";
    return;
  }

  highlightDebounce = setTimeout(() => {
    collectMatches(term, caseSensitive.checked);
    if (matches.length > 0) {
      highlightAllMatches();
      highlightMatch(0);        
    } else {
      searchStatus.textContent = "No matches";
    }
  }, 300);  
});


document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && findReplaceModal.style.display !== "none") {
    closeFindReplace();
  }
});


function highlightAllMatches() {



  for (let i = matches.length - 1; i >= 0; i--) {
    const m = matches[i];
    try {
      const range = document.createRange();
      range.setStart(m.node, m.start);
      range.setEnd(m.node, m.start + m.length);
      const span = document.createElement("span");
      span.className = "find-match";
      range.surroundContents(span);
      highlightSpans.unshift(span);   
    } catch (e) {
    
    }
  }
}


function removeAllHighlights() {
  pagesContainer.querySelectorAll(".find-match").forEach(span => {
 
    span.replaceWith(span.textContent);
  });
 
  pagesContainer.querySelectorAll(".page").forEach(page => page.normalize());
  highlightSpans = [];
  currentHighlightSpan = null;

 
}
function getCleanHTML() {
  const clone = pagesContainer.cloneNode(true);

  clone.querySelectorAll(".find-match, .find-match-current").forEach(span => {
    span.replaceWith(span.textContent);
  });
  removeAllDynamicTableElements(clone);

  clone.querySelectorAll('.col-resize-handle').forEach(handle => handle.remove());

  const dynamicIds = ['columnRuler', 'rowRuler', 'tableResizeHandle', 'tableMoveHandle'];
  dynamicIds.forEach(id => {
    clone.querySelectorAll(`#${id}`).forEach(el => el.remove());
  });

  clone.querySelectorAll('td, th').forEach(cell => {
    if (cell.style.width && cell.style.width.endsWith('px')) {
      cell.style.width = '';
    }
  });

  clone.querySelectorAll('tr').forEach(row => {
    if (row.style.height && row.style.height.endsWith('px')) {
      row.style.height = '';
    }
  });

  return clone.innerHTML;
}
highlightBtn.addEventListener("click", () => {
  const color = highlightColor.value;

  
  if (currentTable) {
    const selectedCells = currentTable.querySelectorAll('.cell-selected');
    if (selectedCells.length > 0) {
      selectedCells.forEach(cell => {
        if (color === "#ffffff") {
          cell.style.backgroundColor = '';
        } else {
          cell.style.backgroundColor = color;
        }
      });
      saveCurrentDocument(getCleanHTML());
      return;   
    }
  }

 
  const page = getActivePage();
  page.focus();
  document.execCommand("styleWithCSS", false, true);
  if (color === "#ffffff") {
    document.execCommand("backColor", false, "transparent");
  } else {
    document.execCommand("backColor", false, color);
  }
  updateFormattingState();
});
clearFormatBtn.addEventListener("click", () => {
  const page = getActivePage();
  page.focus();
  document.execCommand("removeFormat", false, null);
  const activePage = getActivePage();
activePage.style.fontFamily = fontCSS[fontSelect.value];  
activePage.style.fontSize = fontSizeSelect.value + "pt";
  updateFormattingState(); 
});


printBtn.addEventListener("click", () => {
  window.print();
});

bulletListBtn.addEventListener("click", () => {
  const page = getActivePage();
  page.focus();
  document.execCommand("insertUnorderedList", false, null);
  updateFormattingState();
});

numberListBtn.addEventListener("click", () => {
  const page = getActivePage();
  page.focus();
  document.execCommand("insertOrderedList", false, null);
  updateFormattingState();
});

headingSelect.addEventListener("change", () => {
  const page = getActivePage();
  page.focus();
  document.execCommand("formatBlock", false, headingSelect.value);
  updateFormattingState();
});


function updateHeadingState() {
  
  const sel = window.getSelection();
  if (!sel.rangeCount) return;
  const node = sel.anchorNode;
  const block = node.nodeType === 1 ? node : node.parentElement;
  const tag = block.tagName ? block.tagName.toLowerCase() : "";
  if (["h1","h2","h3"].includes(tag)) {
    headingSelect.value = tag;
  } else {
    headingSelect.value = "p";
  }
}
document.getElementById("linkBtn").addEventListener("click", () => {
  const page = getActivePage();
  page.focus();
  const selection = window.getSelection();
  if (selection.isCollapsed) {
    alert("Please select some text first.");
    return;
  }
  const url = prompt("Enter URL:", "https://");
  if (url) {
    document.execCommand("createLink", false, url);
  }
});

document.getElementById("hrBtn").addEventListener("click", () => {
  const page = getActivePage();
  page.focus();
  document.execCommand("insertHorizontalRule", false, null);
});

focusBtn.addEventListener("click", () => {
  focusMode = !focusMode;
  
 
  document.body.classList.toggle("focus-mode", focusMode);
  
  
  focusBtn.textContent = focusMode ? "✏️ Edit" : "🧘 Focus"; 
});

function openSidebar() {
  sidebar.classList.remove("sidebar-closed");
  document.body.classList.add("sidebar-open");
  sidebarOpen = true;
  buildPageList();
  if (currentTable && currentTable.isConnected) {
  showTableToolbar(currentTable);
}

}
function closeSidebar() {
  sidebar.classList.add("sidebar-closed");
  document.body.classList.remove("sidebar-open");
  sidebarOpen = false;
}

toggleSidebarBtn.addEventListener("click", () => {
  if (sidebarOpen) {
    closeSidebar();
  } else {
    openSidebar();
  }
});
closeSidebarBtn.addEventListener("click", closeSidebar);

function buildPageList() {
  const pages = pagesContainer.querySelectorAll(".page");
  pageList.innerHTML = "";

  pages.forEach((page, index) => {
    const li = document.createElement("li");
    li.setAttribute("draggable", "true");
    li.dataset.index = index;
    const activePage = getActivePage();
    if (page === activePage) {
    li.classList.add("active-page");
}
  
    const thumbDiv = document.createElement("div");
    thumbDiv.className = "page-thumb";

    const contentClone = document.createElement("div");
    contentClone.className = "thumb-content";
    contentClone.innerHTML = page.innerHTML; 

    thumbDiv.appendChild(contentClone);

    const pageNum = document.createElement("div");
    pageNum.className = "page-number";
    pageNum.textContent = `Page ${index + 1}`;

    li.appendChild(thumbDiv);
li.appendChild(pageNum);


const btnRow = document.createElement("div");
btnRow.className = "page-actions";

const delBtn = document.createElement("button");
delBtn.innerHTML = "🗑️";
delBtn.title = "Delete page";
delBtn.addEventListener("click", (e) => {
  e.stopPropagation();  
  deletePage(index);
});

const dupBtn = document.createElement("button");
dupBtn.innerHTML = "📋";
dupBtn.title = "Duplicate page";
dupBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  duplicatePage(index);
});

const addBtn = document.createElement("button");
addBtn.innerHTML = "➕";
addBtn.title = "Insert new page after";
addBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  insertNewPageAfter(index);
});

btnRow.appendChild(delBtn);
btnRow.appendChild(dupBtn);
btnRow.appendChild(addBtn);
li.appendChild(btnRow);



    li.addEventListener("dragstart", handleDragStart);
    li.addEventListener("dragover", handleDragOver);
    li.addEventListener("dragleave", handleDragLeave);
    li.addEventListener("drop", handleDrop);
    li.addEventListener("dragend", handleDragEnd);

    pageList.appendChild(li);
  });
}



function handleDragStart(e) {
  draggedIndex = parseInt(e.currentTarget.dataset.index, 10);
  e.dataTransfer.setData("text/plain", draggedIndex);
  e.currentTarget.style.opacity = "0.4";   
}

function handleDragOver(e) {
  e.preventDefault();   
  e.currentTarget.classList.add("drag-over");
}

function handleDragLeave(e) {
  e.currentTarget.classList.remove("drag-over");
}

function handleDrop(e) {
  e.preventDefault();
  e.currentTarget.classList.remove("drag-over");

  const targetIndex = parseInt(e.currentTarget.dataset.index, 10);
  if (draggedIndex === targetIndex) return;

  
  const items = [...pageList.children];
  const draggedItem = items[draggedIndex];
  const targetItem = items[targetIndex];


  if (draggedIndex < targetIndex) {
    targetItem.after(draggedItem);
  } else {
    targetItem.before(draggedItem);
  }


  reorderEditorPages(draggedIndex, targetIndex);


  draggedIndex = null;
  buildPageList();   
  updatePageCounter();
}

function handleDragEnd(e) {
  e.currentTarget.style.opacity = "1";
 
  document.querySelectorAll("#pageList li").forEach(li => li.classList.remove("drag-over"));
}


function reorderEditorPages(fromIndex, toIndex) {
  const pages = [...pagesContainer.querySelectorAll(".page")];
  if (fromIndex < 0 || fromIndex >= pages.length || toIndex < 0 || toIndex >= pages.length) return;

  const movedPage = pages[fromIndex];
  const referencePage = pages[toIndex];

  if (fromIndex < toIndex) {
    
    referencePage.after(movedPage);
  } else {
   
    referencePage.before(movedPage);
  }


  movedPage.focus();
  saveCurrentDocument(getCleanHTML());   
}


const originalUpdatePageCounter = updatePageCounter;
updatePageCounter = function() {
  originalUpdatePageCounter();
  if (sidebarOpen) {
    buildPageList();
  }
};



function deletePage(index) {
  const pages = pagesContainer.querySelectorAll(".page");
  if (pages.length <= 1) {
    alert("Cannot delete the only page.");
    return;
  }
  const pageToDelete = pages[index];
  if (!pageToDelete) return;

  
  const activePage = getActivePage();
  if (pageToDelete === activePage || pageToDelete.contains(activePage)) {
    const nextPage = pageToDelete.nextElementSibling || pageToDelete.previousElementSibling;
    if (nextPage) nextPage.focus();
  }

  pageToDelete.remove();
  updatePageCounter();
  saveCurrentDocument(getCleanHTML());
  if (sidebarOpen) buildPageList();
}

function duplicatePage(index) {
  const pages = pagesContainer.querySelectorAll(".page");
  const original = pages[index];
  if (!original) return;

  const clone = original.cloneNode(true);
  clone.classList.add("page");
  clone.contentEditable = "true";
  clone.setAttribute("data-placeholder", "Here you can write");

  
  const dynamicIds = ['columnRuler', 'rowRuler', 'tableResizeHandle', 'tableMoveHandle'];
  dynamicIds.forEach(id => {
    clone.querySelectorAll(`#${id}`).forEach(el => el.remove());
  });

  original.after(clone);
  clone.focus();
  updatePageCounter();
  saveCurrentDocument(getCleanHTML());
  if (sidebarOpen) buildPageList();
}

function insertNewPageAfter(index) {
  const pages = pagesContainer.querySelectorAll(".page");
  const reference = pages[index];
  if (!reference) return;

  const newPage = document.createElement("div");
  newPage.className = "page";
  newPage.contentEditable = "true";
  newPage.setAttribute("data-placeholder", "Here you can write");

  reference.after(newPage);
  newPage.focus();
  updatePageCounter();
  saveCurrentDocument(getCleanHTML());
  if (sidebarOpen) buildPageList();
}

document.getElementById("insertTableBtn").addEventListener("click", () => {
  const rows = prompt("Number of rows:", 3);
  if (!rows) return;
  const cols = prompt("Number of columns:", 3);
  if (!cols) return;

  const r = parseInt(rows, 10);
  const c = parseInt(cols, 10);
  if (isNaN(r) || isNaN(c) || r < 1 || c < 1) return;

  const page = getActivePage();
  page.focus();


  let html = '<table><tbody>';
  for (let i = 0; i < r; i++) {
    html += '<tr>';
    for (let j = 0; j < c; j++) {
      html += '<td><br></td>';   
    }
    html += '</tr>';
  }
  html += '</tbody></table>';


  document.execCommand("insertHTML", false, html);


  updateCounter();
  saveCurrentDocument(getCleanHTML());
});

function hideTableToolbar() {
  tableToolbar.style.display = 'none';
  hideRuler();
  hideRowRuler();
  hideTableResizeHandle();
  hideTableMoveHandle();
  currentTable = null;
}



tableToolbar.addEventListener('click', (e) => {
 
  let target = e.target;
  if (target.nodeType === Node.TEXT_NODE) {
    target = target.parentElement;
  }

  const btn = target.closest('.table-action-btn');
  if (!btn) return;
  
  const action = btn.dataset.action;
  const sel = window.getSelection();
  if (!sel.rangeCount) return;
  
  const cell = sel.anchorNode?.nodeType === 3 
    ? sel.anchorNode.parentElement?.closest('td, th')
    : sel.anchorNode?.closest('td, th');
  if (!cell) return;
  
  const row = cell.closest('tr');
  const table = cell.closest('table');
  
  if (!row || !table) return;
  
  const rowIndex = Array.from(table.rows).indexOf(row);
  const colIndex = Array.from(row.cells).indexOf(cell);
  
  switch (action) {
    case 'insertRowAbove':
      insertTableRow(table, rowIndex);
      break;
    case 'insertRowBelow':
      insertTableRow(table, rowIndex + 1);
      break;
    case 'insertColLeft':
      insertTableColumn(table, colIndex);
      break;
    case 'insertColRight':
      insertTableColumn(table, colIndex + 1);
      break;
    case 'deleteRow':
      deleteTableRow(table, rowIndex);
      break;
    case 'deleteCol':
      deleteTableColumn(table, colIndex);
      break;
    case 'deleteTable':
      saveTableState();
      table.remove();
      hideTableToolbar();
      break;
    case 'mergeCells':
      mergeSelectedCells(table);
      break;
    case 'splitCell':
      splitCell(cell);
      break;
    case 'deleteCells':
      deleteSelectedCells(table);
      break;
  }
  if (action === 'deleteCells') {
  clearAllCellHighlights();
  clearTableSelection();
}
  
  updateCounter();
  saveCurrentDocument(getCleanHTML());
  
  if (table.isConnected) {
    showTableToolbar(table);
     highlightSelectedCells(table); 
  } else {
    hideTableToolbar();
  }
});


function insertTableRow(table, index) {
  saveTableState();
  if (!table || table.rows.length === 0) return;
  const columnCount = table.rows[0].cells.length;
  const newRow = table.insertRow(index);
  for (let i = 0; i < columnCount; i++) {
    const cell = newRow.insertCell();
    cell.innerHTML = '<br>';  
  }

}


function deleteTableRow(table, index) {
  saveTableState();
  if (table.rows.length <= 1) {
    alert("Cannot delete the only row.");
    return;
  }
  table.deleteRow(index);

}

function insertTableColumn(table, colIndex) {
  saveTableState();
  if (tableHasMergedCells(table)) {
    alert("Cannot insert column when cells are merged. Unmerge cells first.");
    return;
  }
  for (let i = 0; i < table.rows.length; i++) {
    const row = table.rows[i];
    
    if (colIndex <= row.cells.length) {
      const newCell = row.insertCell(colIndex);
      newCell.innerHTML = '<br>';
    }
  }

}

function deleteTableColumn(table, colIndex) {
  saveTableState();
  if (tableHasMergedCells(table)) {
    alert("Cannot delete column when cells are merged. Unmerge cells first.");
    return;
  }
  if (table.rows[0] && table.rows[0].cells.length <= 1) {
    alert("Cannot delete the only column.");
    return;
  }
  for (let i = 0; i < table.rows.length; i++) {
    const row = table.rows[i];
    if (colIndex < row.cells.length) {
      row.deleteCell(colIndex);
    }
  }
 
  
}



function tableHasMergedCells(table) {
  const cells = table.querySelectorAll('td, th');
  for (const cell of cells) {
    if (cell.getAttribute('colspan') && cell.getAttribute('colspan') !== '1') return true;
    if (cell.getAttribute('rowspan') && cell.getAttribute('rowspan') !== '1') return true;
  }
  return false;
}

function getSelectedCells(table) {
  return Array.from(table.querySelectorAll('.cell-selected'));
}
function mergeSelectedCells(table) {
  saveTableState();
  const cells = getSelectedCells(table);
  if (cells.length < 2) {
    alert("Please select at least two adjacent cells.");
    return;
  }

 
  const firstCell = cells[0];
  const lastCell = cells[cells.length - 1];
  const firstRow = firstCell.closest('tr');
  const lastRow = lastCell.closest('tr');
  const firstColIdx = Array.from(firstRow.cells).indexOf(firstCell);
  const lastColIdx = Array.from(lastRow.cells).indexOf(lastCell);

  const colspan = lastColIdx - firstColIdx + 1;
  const rowspan = Array.from(table.rows).indexOf(lastRow) - Array.from(table.rows).indexOf(firstRow) + 1;

 
  const mergedCell = firstCell;
  mergedCell.setAttribute('colspan', colspan);
  mergedCell.setAttribute('rowspan', rowspan);
  mergedCell.innerHTML = mergedCell.innerHTML.trim() || '<br>'; 

 
  for (let i = 1; i < cells.length; i++) {
    cells[i].remove();
  }

 
}

function splitCell(cell) {
  saveTableState();
  const colspan = parseInt(cell.getAttribute('colspan') || 1, 10);
  const rowspan = parseInt(cell.getAttribute('rowspan') || 1, 10);
  if (colspan === 1 && rowspan === 1) {
    alert("This cell is not merged.");
    return;
  }

  const row = cell.closest('tr');
  const table = cell.closest('table');
  const cellIndex = Array.from(row.cells).indexOf(cell);
  const rowIndex = Array.from(table.rows).indexOf(row);


  for (let c = 1; c < colspan; c++) {
    const newCell = row.insertCell(cellIndex + 1);
    newCell.innerHTML = '<br>';
  }
 
  for (let r = 1; r < rowspan; r++) {
    const newRow = table.rows[rowIndex + r];
    if (!newRow) {
    
      const extraRow = table.insertRow(rowIndex + r);
      for (let c = 0; c < colspan; c++) {
        const newCell = extraRow.insertCell();
        newCell.innerHTML = '<br>';
      }
    } else {
     
      for (let c = 0; c < colspan; c++) {
        const newCell = newRow.insertCell(cellIndex + c);
        newCell.innerHTML = '<br>';
      }
    }
  }

  
  cell.removeAttribute('colspan');
  cell.removeAttribute('rowspan');

}

function clearAllCellHighlights() {
  document.querySelectorAll('.cell-selected').forEach(cell => cell.classList.remove('cell-selected'));
}


function highlightSelectedCells(table) {
  
  table.querySelectorAll('.cell-selected').forEach(cell => cell.classList.remove('cell-selected'));

  const cells = getSelectedCells(table);
  if (cells.length >= 2) {
    cells.forEach(cell => cell.classList.add('cell-selected'));
  }
}
function clearTableSelection() {
  clearAllCellHighlights();
  tableAnchorCell = null;
  tableAnchorTable = null;
}

pagesContainer.addEventListener('click', (e) => {
 
  let target = e.target;
  if (target.nodeType === Node.TEXT_NODE) {
    target = target.parentElement;
  }

  const cell = target.closest('td, th');    
  if (!cell) {
    clearTableSelection();
    hideTableToolbar();
    return;
  }

  const table = cell.closest('table');
  if (!table) return;

  showTableToolbar(table);

  if (e.shiftKey && tableAnchorCell && tableAnchorTable === table) {
    e.preventDefault();
    const anchorRow = tableAnchorCell.closest('tr');
    const anchorCol = Array.from(anchorRow.cells).indexOf(tableAnchorCell);
    const currentRow = cell.closest('tr');
    const currentCol = Array.from(currentRow.cells).indexOf(cell);

    const rows = Array.from(table.rows);
    const anchorRowIdx = rows.indexOf(anchorRow);
    const currentRowIdx = rows.indexOf(currentRow);

    const minRow = Math.min(anchorRowIdx, currentRowIdx);
    const maxRow = Math.max(anchorRowIdx, currentRowIdx);
    const minCol = Math.min(anchorCol, currentCol);
    const maxCol = Math.max(anchorCol, currentCol);

   
    table.querySelectorAll('.cell-selected').forEach(c => c.classList.remove('cell-selected'));
    for (let r = minRow; r <= maxRow; r++) {
      const row = rows[r];
      for (let c = minCol; c <= maxCol; c++) {
        if (c < row.cells.length) {
          row.cells[c].classList.add('cell-selected');
        }
      }
    }
  } else {
    clearAllCellHighlights();
    tableAnchorCell = cell;
    tableAnchorTable = table;
    cell.classList.add('cell-selected');
  }
});

pagesContainer.addEventListener('mousedown', (e) => {
  
  let target = e.target;
  if (target.nodeType === Node.TEXT_NODE) {
    target = target.parentElement;
  }

  const wrapper = target.closest('.image-wrapper');
  if (!wrapper) return;


  const rect = wrapper.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const clickY = e.clientY - rect.top;
  const resizeZone = 25;
  if (wrapper.classList.contains('wrap-front') &&
      clickX > rect.width - resizeZone && clickY > rect.height - resizeZone) {
    return;   
  }

  e.preventDefault();
  wrapper.style.userSelect = 'none';

  isDraggingImage = true;
  document.body.style.cursor = 'move';
  imageDragTarget = wrapper;
  hasMoved = false;
  wrapper.classList.add('dragging');

  dragStartMouseX = e.clientX;
  dragStartMouseY = e.clientY;

 
  const style = window.getComputedStyle(wrapper);
  if (!wrapper.classList.contains('wrap-front')) {
    
    wrapper.dataset.origPosition = style.position;
    wrapper.dataset.origLeft = style.left;
    wrapper.dataset.origTop = style.top;
    wrapper.dataset.origDisplay = style.display;
    wrapper.dataset.origFloat = style.float;

    
    const pageEl = wrapper.closest('.page');
    if (!pageEl) return;   
    const pageRect = pageEl.getBoundingClientRect();
    wrapper.style.position = 'absolute';
    wrapper.style.left = (rect.left - pageRect.left) + 'px';
    wrapper.style.top = (rect.top - pageRect.top) + 'px';
    wrapper.style.display = 'block';   
    wrapper.style.float = 'none';
  }

  dragStartLeft = parseInt(wrapper.style.left, 10) || 0;
  dragStartTop = parseInt(wrapper.style.top, 10) || 0;

  const currentPage = wrapper.closest('.page');
  if (currentPage) {
    const pageRect = currentPage.getBoundingClientRect();
    dragOffsetX = dragStartMouseX - pageRect.left - dragStartLeft;
    dragOffsetY = dragStartMouseY - pageRect.top - dragStartTop;
  }

  saveTableState();
  e.stopPropagation();
});

document.addEventListener('mousemove', (e) => {
  if (!isDraggingImage || !imageDragTarget) return;

  const dx = e.clientX - dragStartMouseX;
  const dy = e.clientY - dragStartMouseY;

  if (!hasMoved && (Math.abs(dx) > IMAGE_DRAG_THRESHOLD || Math.abs(dy) > IMAGE_DRAG_THRESHOLD)) {
    hasMoved = true;
  }

  if (!hasMoved) return;


  imageDragTarget.style.left = (dragStartLeft + dx) + 'px';
  imageDragTarget.style.top = (dragStartTop + dy) + 'px';


  const elemUnder = document.elementFromPoint(e.clientX, e.clientY);
  if (elemUnder) {
    const targetPage = elemUnder.closest('.page');
    const currentPage = imageDragTarget.closest('.page');
    if (targetPage && targetPage !== currentPage) {
  
      const newPageRect = targetPage.getBoundingClientRect();
      const newLeft = e.clientX - newPageRect.left - dragOffsetX;
      const newTop = e.clientY - newPageRect.top - dragOffsetY;

      imageDragTarget.remove();                 
      targetPage.appendChild(imageDragTarget);  

      imageDragTarget.style.left = newLeft + 'px';
      imageDragTarget.style.top = newTop + 'px';
    }
  }


   if (imageDragTarget.style.position === 'absolute') {
    const page = imageDragTarget.closest('.page');
    if (page) {
      const pageRect = page.getBoundingClientRect();
      const wrapperRect = imageDragTarget.getBoundingClientRect();
      let curLeft = parseFloat(imageDragTarget.style.left) || 0;
      let curTop = parseFloat(imageDragTarget.style.top) || 0;

      const handleGap = 20;  
      const maxLeft = Math.max(0, pageRect.width - wrapperRect.width - handleGap);
      const maxTop = Math.max(0, pageRect.height - wrapperRect.height - handleGap);

      let clamped = false;
      if (curLeft < 0) { curLeft = 0; clamped = true; }
      else if (curLeft > maxLeft) { curLeft = maxLeft; clamped = true; }

      if (curTop < 0) { curTop = 0; clamped = true; }
      else if (curTop > maxTop) { curTop = maxTop; clamped = true; }

      if (clamped) {
        
        imageDragTarget.style.left = curLeft + 'px';
        imageDragTarget.style.top = curTop + 'px';

       
        dragStartLeft = curLeft;
        dragStartTop = curTop;
        dragStartMouseX = e.clientX;
        dragStartMouseY = e.clientY;
      }
    }
  }


  imageDragTarget.classList.remove('align-left', 'align-center', 'align-right');
  updateAlignmentButtonState(imageDragTarget);
});

document.addEventListener('mouseup', (e) => {
  if (!isDraggingImage) return;

  if (hasMoved) {
    
    const page = imageDragTarget.closest('.page');
    if (page && imageDragTarget.style.position === 'absolute') {
      const pageRect = page.getBoundingClientRect();
      const wrapperRect = imageDragTarget.getBoundingClientRect();
      let left = parseFloat(imageDragTarget.style.left) || 0;
      let top = parseFloat(imageDragTarget.style.top) || 0;

      const maxLeft = Math.max(0, pageRect.width - wrapperRect.width);
      const maxTop = Math.max(0, pageRect.height - wrapperRect.height);

      if (left < 0) left = 0;
      else if (left > maxLeft) left = maxLeft;

      if (top < 0) top = 0;
      else if (top > maxTop) top = maxTop;

      imageDragTarget.style.left = left + 'px';
      imageDragTarget.style.top = top + 'px';
    }

    if (imageDragTarget.dataset.origPosition) {

      const origDisplay = imageDragTarget.style.display;
      imageDragTarget.style.display = 'none';

      
      let range = document.caretRangeFromPoint(e.clientX, e.clientY);

     
      if (!range) {
        const sel = window.getSelection();
        if (sel.rangeCount && sel.getRangeAt(0).collapsed) {
          range = sel.getRangeAt(0);
        }
      }

      
      imageDragTarget.style.display = origDisplay;

      let placed = false;
      if (range) {
       
        let container = range.startContainer;
        if (container.nodeType === Node.TEXT_NODE) {
          container = container.parentElement;
        }
        if (!container.closest('.image-wrapper')) {
          range.insertNode(imageDragTarget);
          placed = true;
        }
      }


      if (!placed) {
        const page = imageDragTarget.closest('.page');
        if (page) {
          page.appendChild(imageDragTarget);
        }
      }

     
      imageDragTarget.style.position = imageDragTarget.dataset.origPosition || '';
      imageDragTarget.style.left = imageDragTarget.dataset.origLeft || '';
      imageDragTarget.style.top = imageDragTarget.dataset.origTop || '';
      imageDragTarget.style.display = imageDragTarget.dataset.origDisplay || '';
      imageDragTarget.style.float = imageDragTarget.dataset.origFloat || '';
      delete imageDragTarget.dataset.origPosition;
      delete imageDragTarget.dataset.origLeft;
      delete imageDragTarget.dataset.origTop;
      delete imageDragTarget.dataset.origDisplay;
      delete imageDragTarget.dataset.origFloat;
    }

    updateCounter();
    saveCurrentDocument(getCleanHTML());
    setTimeout(() => compactPages(), 50);
    updateImagePositionInputs();
  }


  if (imageDragTarget) {
    imageDragTarget.classList.remove('dragging');
    imageDragTarget.style.userSelect = '';
  }
  document.body.style.cursor = '';
  isDraggingImage = false;
  imageDragTarget = null;
  hasMoved = false;
});


function buildRuler(table) {
  if (!table || !table.isConnected) return;
  if (tableHasMergedCells(table)) {
    hideRuler();
    return;
  }

  const cols = table.rows[0].cells.length;
  if (cols < 2) {
    hideRuler();
    return;
  }

  const page = table.closest('.page');
  if (!page) {
    hideRuler();
    return;
  }


  if (columnRuler.parentNode !== page) {
    page.appendChild(columnRuler);
  }

  const pageRect = page.getBoundingClientRect();
  const tableRect = table.getBoundingClientRect();


  columnRuler.style.position = 'absolute';
  columnRuler.style.left = (tableRect.left - pageRect.left) + 'px';
  columnRuler.style.top = (tableRect.bottom - pageRect.top + 3) + 'px';
  columnRuler.style.width = tableRect.width + 'px';
  columnRuler.style.display = 'block';
  rulerTable = table;

  const totalWidth = tableRect.width;
  const firstRowCells = table.rows[0].cells;

 
  rulerColumnPcts = [];
  for (let i = 0; i < firstRowCells.length; i++) {
    const colWidth = firstRowCells[i].getBoundingClientRect().width;
    const pct = (colWidth / totalWidth) * 100;
    rulerColumnPcts.push(pct);
  }


  rulerMarkers.innerHTML = '';

  
  let accumulatedWidth = 0;
  for (let i = 0; i < firstRowCells.length - 1; i++) {
    accumulatedWidth += firstRowCells[i].getBoundingClientRect().width;
    const leftPct = (accumulatedWidth / totalWidth) * 100;

    const divider = document.createElement('div');
    divider.className = 'ruler-divider';
    divider.style.left = leftPct + '%';
    divider.dataset.colIndex = i;
    divider.addEventListener('mousedown', rulerDragStart);
    rulerMarkers.appendChild(divider);
  }

}


function hideRuler() {
  columnRuler.style.display = 'none';
  rulerTable = null;

 
  if (columnRuler.parentNode && columnRuler.parentNode !== document.body) {
    document.body.appendChild(columnRuler);
  }
}

function rulerDragStart(e) {
  saveTableState();
  if (!rulerTable) return;
  e.preventDefault();
  const colIndex = parseInt(e.currentTarget.dataset.colIndex, 10);
  const totalWidth = rulerTable.getBoundingClientRect().width;
  const leftPct = parseFloat(e.currentTarget.style.left);

  isResizingRuler = true;
  resizeColIdx = colIndex;
  resizeStartPx = e.clientX;
  resizeColStartLeft = leftPct;
  
  const nextDivider = rulerMarkers.children[colIndex + 1];
  resizeColStartRight = nextDivider ? parseFloat(nextDivider.style.left) : 100;

  document.body.style.userSelect = 'none';
  document.body.style.cursor = 'col-resize';

  document.addEventListener('mousemove', rulerDragMove);
  document.addEventListener('mouseup', rulerDragEnd);
}

function rulerDragMove(e) {
  if (!isResizingRuler) return;

  const dx = e.clientX - resizeStartPx;
  const totalWidth = rulerTable.getBoundingClientRect().width;
  const deltaPct = (dx / totalWidth) * 100;

  let newLeft = resizeColStartLeft + deltaPct;
  const minPct = 5;

  
  if (newLeft < minPct) newLeft = minPct;
  const maxLeft = resizeColStartRight - minPct;
  if (newLeft > maxLeft) newLeft = maxLeft;

  
  const divider = rulerMarkers.children[resizeColIdx];
  divider.style.left = newLeft + '%';

  
  const colA = resizeColIdx;
  const colB = resizeColIdx + 1;
  const oldTotal = rulerColumnPcts[colA] + rulerColumnPcts[colB];

  let newPctA = newLeft;
  if (colA > 0) {
    
    newPctA = newLeft - rulerColumnPcts.slice(0, colA).reduce((a, b) => a + b, 0);
  }
  let newPctB = oldTotal - newPctA;


  if (newPctA < minPct) { newPctA = minPct; newPctB = oldTotal - minPct; }
  if (newPctB < minPct) { newPctB = minPct; newPctA = oldTotal - minPct; }

  rulerColumnPcts[colA] = newPctA;
  rulerColumnPcts[colB] = newPctB;


  const allRows = rulerTable.rows;
  for (let r = 0; r < allRows.length; r++) {
    const rowCells = allRows[r].cells;
    for (let c = 0; c < rowCells.length; c++) {
      if (c < rulerColumnPcts.length) {
        rowCells[c].style.width = rulerColumnPcts[c] + '%';
      }
    }
  }


  let accum = 0;
  for (let i = 0; i < rulerColumnPcts.length - 1; i++) {
    accum += rulerColumnPcts[i];
    const laterDivider = rulerMarkers.children[i];
    if (laterDivider) laterDivider.style.left = accum + '%';
  }
}

function rulerDragEnd() {
  isResizingRuler = false;
  document.body.style.userSelect = '';
  document.body.style.cursor = '';
  document.removeEventListener('mousemove', rulerDragMove);
  document.removeEventListener('mouseup', rulerDragEnd);

  if (rulerTable && rulerTable.isConnected) {
    saveCurrentDocument(getCleanHTML());
    setTimeout(() => {
      if (rulerTable && rulerTable.isConnected) {
        buildRuler(rulerTable);
        buildRowRuler(rulerTable);   
      }
    }, 50);
  }
}

function showTableToolbar(table) {
  if (table === currentTable) return;
  currentTable = table;
  buildRuler(table);   
  buildRowRuler(table);
  showTableResizeHandle(table);
  showTableMoveHandle(table);


  const rect = table.getBoundingClientRect();
  tableToolbar.style.left = rect.left + 'px';
  tableToolbar.style.top = (rect.top - 45) + 'px';
  tableToolbar.style.display = 'block';
}


window.addEventListener('resize', () => {
    if (rulerTable && rulerTable.isConnected) {
    buildRuler(rulerTable);
    buildRowRuler(rulerTable);
  }
});

function removeLegacyResizeHandles(container) {
  container.querySelectorAll('.col-resize-handle').forEach(handle => handle.remove());
}


function buildRowRuler(table) {
  if (!table || !table.isConnected) return;
  if (!table || tableHasMergedCells(table)) {
    hideRowRuler();
    return;
  }

  const rows = table.rows;
  if (rows.length < 2) {
    hideRowRuler();
    return;
  }

  const page = table.closest('.page');
  if (!page) {
    hideRowRuler();
    return;
  }

  if (rowRuler.parentNode !== page) {
    page.appendChild(rowRuler);
  }

  const pageRect = page.getBoundingClientRect();
  const tableRect = table.getBoundingClientRect();

  rowRuler.style.position = 'absolute';
  rowRuler.style.top = (tableRect.top - pageRect.top) + 'px';
  rowRuler.style.left = (tableRect.left - pageRect.left - 23) + 'px';  
  rowRuler.style.height = tableRect.height + 'px';
  rowRuler.style.display = 'block';
  rowRulerTable = table;

  rowMarkers.innerHTML = '';

  for (let i = 0; i < rows.length - 1; i++) {
    const row = rows[i];
    const rowBottom = row.getBoundingClientRect().bottom - tableRect.top;  

    const divider = document.createElement('div');
    divider.className = 'row-divider';
    divider.style.top = rowBottom + 'px';
    divider.dataset.rowIndex = i;   
    divider.addEventListener('mousedown', rowDragStart);
    rowMarkers.appendChild(divider);
  }
if (rows.length > 0) {
  const lastRow = rows[rows.length - 1];
  const lastRowBottom = lastRow.getBoundingClientRect().bottom - tableRect.top;

  const bottomDivider = document.createElement('div');
  bottomDivider.className = 'row-divider';
  bottomDivider.style.top = lastRowBottom + 'px';
  bottomDivider.dataset.rowIndex = rows.length - 1;  
  bottomDivider.addEventListener('mousedown', rowDragStart);
  rowMarkers.appendChild(bottomDivider);
}

}

function saveTableState() {
  if (isUndoRedo) return;

  const currentHTML = pagesContainer.innerHTML;

  if (undoStack.length > 0 && undoStack[undoIndex] === currentHTML) {
    return;
  }

 
  undoStack = undoStack.slice(0, undoIndex + 1);

  undoStack.push(currentHTML);
  undoIndex = undoStack.length - 1;

 
  if (undoStack.length > 50) {
    undoStack.shift();
    undoIndex--;
  }
}

function restoreState(index) {
  if (index < 0 || index >= undoStack.length) return;

  isUndoRedo = true;

 
  hideTableToolbar();

  pagesContainer.innerHTML = undoStack[index];


  removeAllDynamicTableElements(pagesContainer);
  removeLegacyResizeHandles(pagesContainer);

 
  pagesContainer.querySelectorAll('table').forEach(table => {
    if (!table.style.width) table.style.width = '100%';
  });

  const sel = window.getSelection();
  if (sel.rangeCount > 0) {
    const node = sel.anchorNode;
    const table = node?.nodeType === 3
      ? node.parentElement?.closest('table')
      : node?.closest('table');
    if (table) {
      showTableToolbar(table);
    }
  }

  updateCounter();
  updatePageCounter();
  if (sidebarOpen) buildPageList();

  isUndoRedo = false;
}

function undoTableOperation() {
  if (undoIndex > 0) {
    undoIndex--;
    restoreState(undoIndex);
  }
}

function redoTableOperation() {
  
  if (undoIndex < undoStack.length - 1) {
    undoIndex++;
   
    restoreState(undoIndex);
  }
}

function hideRowRuler() {
  rowRuler.style.display = 'none';
  rowRulerTable = null;
  if (rowRuler.parentNode && rowRuler.parentNode !== document.body) {
    document.body.appendChild(rowRuler);
  }
}
function rowDragStart(e) {
  saveTableState();
  if (!rowRulerTable) return;
  e.preventDefault();
  const rowIndex = parseInt(e.currentTarget.dataset.rowIndex, 10);
  const row = rowRulerTable.rows[rowIndex];
  if (!row) return;

  isResizingRow = true;
  resizeRowIdx = rowIndex;
  resizeRowStartY = e.clientY;
  resizeRowStartHeight = row.getBoundingClientRect().height;

  document.body.style.userSelect = 'none';
  document.body.style.cursor = 'row-resize';

  hideRuler();

  document.addEventListener('mousemove', rowDragMove);
  document.addEventListener('mouseup', rowDragEnd);
}

function rowDragMove(e) {
  if (!isResizingRow) return;
  const dy = e.clientY - resizeRowStartY;
  let newHeight = resizeRowStartHeight + dy;
  const minHeight = 20;   
  if (newHeight < minHeight) newHeight = minHeight;

  const row = rowRulerTable.rows[resizeRowIdx];
  row.style.height = newHeight + 'px';


}

function rowDragEnd() {
  isResizingRow = false;
  document.body.style.userSelect = '';
  document.body.style.cursor = '';
  document.removeEventListener('mousemove', rowDragMove);
  document.removeEventListener('mouseup', rowDragEnd);

  if (rowRulerTable) {
    saveCurrentDocument(getCleanHTML());
    
    setTimeout(() => {
      buildRowRuler(rowRulerTable);
      buildRuler(rowRulerTable);
      
    }, 50);
  }
}









function showTableResizeHandle(table) {
  if (!table || !table.isConnected) return;
  const page = table.closest('.page');
  if (!page) return;
  if (tableResizeHandle.parentNode !== page) {
    page.appendChild(tableResizeHandle);
  }
  const pageRect = page.getBoundingClientRect();
  const tableRect = table.getBoundingClientRect();
  tableResizeHandle.style.position = 'absolute';
  tableResizeHandle.style.left = (tableRect.right - pageRect.left - 6) + 'px';
  tableResizeHandle.style.top = (tableRect.bottom - pageRect.top - 6) + 'px';
  tableResizeHandle.style.display = 'block';
}

function hideTableResizeHandle() {
  tableResizeHandle.style.display = 'none';
  if (tableResizeHandle.parentNode && tableResizeHandle.parentNode !== document.body) {
    document.body.appendChild(tableResizeHandle);
  }
}

tableResizeHandle.addEventListener('mousedown', (e) => {
  saveTableState();
  if (!currentTable) return;
  e.preventDefault();
  e.stopPropagation();  
  isResizingTable = true;
  resizeTableTarget = currentTable;
  resizeTableStartWidth = resizeTableTarget.getBoundingClientRect().width;
  resizeTableStartX = e.clientX;
  document.body.style.userSelect = 'none';
  document.body.style.cursor = 'nwse-resize';
  document.addEventListener('mousemove', tableResizeMove);
  document.addEventListener('mouseup', tableResizeEnd);
});

function tableResizeMove(e) {
  if (!isResizingTable) return;
  const dx = e.clientX - resizeTableStartX;
  const page = resizeTableTarget.closest('.page');
  if (!page) return;
  const pageWidth = page.getBoundingClientRect().width;
  let newWidth = resizeTableStartWidth + dx;
  
  const minWidth = 100;
  const maxWidth = pageWidth - 40;  
  if (newWidth < minWidth) newWidth = minWidth;
  if (newWidth > maxWidth) newWidth = maxWidth;
  resizeTableTarget.style.width = newWidth + 'px';
}

function tableResizeEnd() {
  isResizingTable = false;
  document.body.style.userSelect = '';
  document.body.style.cursor = '';
  document.removeEventListener('mousemove', tableResizeMove);
  document.removeEventListener('mouseup', tableResizeEnd);
  if (resizeTableTarget) {
    saveCurrentDocument(getCleanHTML());
    
    if (resizeTableTarget.isConnected) {
      buildRuler(resizeTableTarget);
      buildRowRuler(resizeTableTarget);
      showTableResizeHandle(resizeTableTarget);
    }
    resizeTableTarget = null;
  }
}
function showTableMoveHandle(table) {
  if (!table || !table.isConnected) return;
  const page = table.closest('.page');
  if (!page) return;
  if (tableMoveHandle.parentNode !== page) {
    page.appendChild(tableMoveHandle);
  }
  const pageRect = page.getBoundingClientRect();
  const tableRect = table.getBoundingClientRect();
  tableMoveHandle.style.position = 'absolute';
  
  tableMoveHandle.style.left = (tableRect.left - pageRect.left - 8) + 'px';
  tableMoveHandle.style.top = (tableRect.top - pageRect.top - 8) + 'px';
  tableMoveHandle.style.display = 'flex';
}

function hideTableMoveHandle() {
  tableMoveHandle.style.display = 'none';
  if (tableMoveHandle.parentNode && tableMoveHandle.parentNode !== document.body) {
    document.body.appendChild(tableMoveHandle);
  }
}


tableMoveHandle.addEventListener('mousedown', (e) => {
  if (!currentTable) return;
  e.preventDefault();
  e.stopPropagation();
  isMovingTable = true;
  tableMoveTarget = currentTable;


  tableMoveTarget.style.position = 'relative';

  const computedStyle = window.getComputedStyle(tableMoveTarget);
  moveStartLeft = parseInt(computedStyle.left, 10) || 0;
  moveStartTop = parseInt(computedStyle.top, 10) || 0;
  moveStartX = e.clientX;
  moveStartY = e.clientY;

  document.body.style.userSelect = 'none';
  document.body.style.cursor = 'move';
  document.addEventListener('mousemove', tableMoveMove);
  document.addEventListener('mouseup', tableMoveEnd);
});

function tableMoveMove(e) {
  if (!isMovingTable) return;
  const dx = e.clientX - moveStartX;
  const dy = e.clientY - moveStartY;
  tableMoveTarget.style.left = (moveStartLeft + dx) + 'px';
  tableMoveTarget.style.top = (moveStartTop + dy) + 'px';


  if (tableMoveTarget.isConnected) {
    buildRuler(tableMoveTarget);
    buildRowRuler(tableMoveTarget);
    showTableResizeHandle(tableMoveTarget);
    showTableMoveHandle(tableMoveTarget);
  }
}

function tableMoveEnd() {
  isMovingTable = false;
  document.body.style.userSelect = '';
  document.body.style.cursor = '';
  document.removeEventListener('mousemove', tableMoveMove);
  document.removeEventListener('mouseup', tableMoveEnd);
  if (tableMoveTarget) {
    saveCurrentDocument(getCleanHTML());
   
    if (tableMoveTarget.isConnected) {
      buildRuler(tableMoveTarget);
      buildRowRuler(tableMoveTarget);
      showTableResizeHandle(tableMoveTarget);
      showTableMoveHandle(tableMoveTarget);
    }
    tableMoveTarget = null;
  }
}

function removeAllDynamicTableElements(container) {
  const ids = ['columnRuler', 'rowRuler', 'tableResizeHandle', 'tableMoveHandle'];
  ids.forEach(id => {
    container.querySelectorAll(`#${id}`).forEach(el => el.remove());
  });
}

tableToolbar.addEventListener('click', (e) => {
  
  let target = e.target;
  if (target.nodeType === Node.TEXT_NODE) {
    target = target.parentElement;
  }

  const bgBtn = target.closest('.cell-bg-btn');
  if (!bgBtn) return;

  const color = bgBtn.dataset.color;   
  const table = currentTable;
  if (!table) return;

  
  let cellsToColour = [];
  const selectedCells = table.querySelectorAll('.cell-selected');
  if (selectedCells.length > 0) {
    cellsToColour = Array.from(selectedCells);
  } else {
    const sel = window.getSelection();
    if (sel.rangeCount) {
      const cell = sel.anchorNode?.nodeType === 3
        ? sel.anchorNode.parentElement?.closest('td, th')
        : sel.anchorNode?.closest('td, th');
      if (cell && cell.closest('table') === table) {
        cellsToColour.push(cell);
      }
    }
  }

  cellsToColour.forEach(cell => {
    if (color === '#ffffff') {
      cell.style.backgroundColor = '';  
    } else {
      cell.style.backgroundColor = color;
    }
  });

  saveCurrentDocument(getCleanHTML());
});

function deleteSelectedCells(table) {
  saveTableState();
  if (tableHasMergedCells(table)) {
    alert("Cannot delete cells when they are merged. Unmerge cells first.");
    return;
  }

  const selected = table.querySelectorAll('.cell-selected');
  if (selected.length === 0) {
    alert("No cells selected.");
    return;
  }

  selected.forEach(cell => cell.remove());

  const rows = table.rows;
  for (let i = rows.length - 1; i >= 0; i--) {
    if (rows[i].cells.length === 0) {
      rows[i].remove();
    }
  }

  if (table.rows.length === 0) {
    table.remove();
    hideTableToolbar();
  }
}
function cleanDocument() {
  const pages = pagesContainer.querySelectorAll('.page');
  if (pages.length === 0) return;

  let removedCount = 0;

  pages.forEach(page => {
    function cleanNode(node) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const voidTags = ['BR', 'HR', 'IMG', 'INPUT', 'META', 'LINK', 'SOURCE', 'TRACK', 'WBR'];
        if (voidTags.includes(node.tagName)) {
          return;   
        }

        
        const children = Array.from(node.childNodes);
        children.forEach(child => cleanNode(child));

        const hasContent = Array.from(node.childNodes).some(child => {
          if (child.nodeType === Node.TEXT_NODE) {
            return child.textContent.trim().length > 0;
          }
          if (child.nodeType === Node.ELEMENT_NODE) {
           
            return true;
          }
          return false;
        });

        if (!hasContent && node.textContent.trim() === '') {
         
          const removableTags = ['SPAN', 'DIV', 'P', 'FONT', 'B', 'I', 'U', 'S', 'STRONG', 'EM', 'SUB', 'SUP'];
          if (removableTags.includes(node.tagName) || node.classList.length === 0 && node.id === '') {
            node.remove();
            removedCount++;
          }
        }
      } else if (node.nodeType === Node.TEXT_NODE) {

      }
    }

 
    const startChildren = Array.from(page.childNodes);
    startChildren.forEach(child => cleanNode(child));
  });

  if (pagesContainer.querySelectorAll('.page').length === 0) {
    const newPage = document.createElement('div');
    newPage.className = 'page';
    newPage.contentEditable = 'true';
    newPage.setAttribute('data-placeholder', 'Here you can write');
    pagesContainer.appendChild(newPage);
  }

  removeEmptyWrappers();

  updateCounter();
  saveCurrentDocument(getCleanHTML());

  alert(`Document cleaned. ${removedCount} empty elements removed.`);
}

document.getElementById("cleanDocBtn").addEventListener("click", () => {
  if (confirm("This will remove empty tags and clean up the document. Continue?")) {
    cleanDocument();
    fileDropdown.classList.remove("open");
  }
});
function applyLineHeightToSelection(value) {
  const selection = window.getSelection();

 
  if (!selection.rangeCount || selection.isCollapsed) {
    const activePage = getActivePage();
    activePage.style.lineHeight = value;
    activePage.querySelectorAll('p, div, h1, h2, h3, h4, h5, h6, li, td, th').forEach(el => {
      el.style.lineHeight = value;
    });
    return;
  }

  const range = selection.getRangeAt(0);
  if (!mytexteditor || !mytexteditor.contains(range.commonAncestorContainer)) return;

 
  let startNode = range.startContainer;
  if (startNode.nodeType === Node.TEXT_NODE) {
    startNode = startNode.parentElement;
  }

  const blockTags = ['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'TD', 'TH'];
  let block = startNode.closest(blockTags.join(','));

  
  if (!block) {
    block = startNode.closest('.page');
  }

  if (!block) return;

 
  block.style.lineHeight = value;


  block.querySelectorAll('span, b, i, u, s, strong, em, sub, sup, a').forEach(el => {
    if (el.style.lineHeight) {
      el.style.lineHeight = '';
    }
  });

  updateCounter();
}



lineHeightSelect.addEventListener("change", () => {
  console.log("line-height change fired, value:", lineHeightSelect.value);
  const value = lineHeightSelect.value;
  const selection = window.getSelection();

 
  if (selection.rangeCount && !selection.isCollapsed) {
    applyLineHeightToSelection(value);
  } else {
    applyLineHeightToWholeDocument(value);
  }
});
function applyLineHeightToWholeDocument(value) {
  const pages = pagesContainer.querySelectorAll('.page');
  pages.forEach(page => {
    page.style.lineHeight = value;
    page.querySelectorAll('p, div, h1, h2, h3, h4, h5, h6, td, th, li, span').forEach(el => {
      el.style.lineHeight = value;
    });
  });

  
  pages.forEach(page => setTimeout(() => handleOverflow(page), 0));

  
  setTimeout(() => {
    compactPages();
  }, 100); 

  updateCounter();
  saveCurrentDocument(getCleanHTML());
}
document.getElementById("applyLineHeightAllBtn").addEventListener("click", () => {
  const value = lineHeightSelect.value;
  if (value) {
    applyLineHeightToWholeDocument(value);
  }
});

function compactPages() {
  const pages = Array.from(pagesContainer.querySelectorAll('.page'));
  if (pages.length <= 1) return;

  let idx = 0;
  while (idx < pages.length - 1) {
    const currentPage = pages[idx];
    let nextPage = pages[idx + 1];

    while (nextPage && nextPage.childNodes.length > 0) {
      const firstChild = nextPage.firstChild;

      if (firstChild.nodeType === 1 && firstChild.closest('table')) {
        const table = firstChild.closest('table');
        currentPage.appendChild(table);
      } else {
        currentPage.appendChild(firstChild);
      }

      if (currentPage.scrollHeight > currentPage.clientHeight) {
        if (firstChild.nodeType === 1 && firstChild.closest('table')) {
          const table = firstChild.closest('table');
          nextPage.insertBefore(table, nextPage.firstChild);
        } else {
          nextPage.insertBefore(firstChild, nextPage.firstChild);
        }
        break; 
      }

     
      if (nextPage.childNodes.length === 0) {
        nextPage.remove();
        const updatedPages = pagesContainer.querySelectorAll('.page');
        const nextIdx = idx + 1;
        nextPage = updatedPages[nextIdx] || null;
      }
    }

    idx++; 
  }

  removeEmptyPages();
  updatePageCounter();
  saveCurrentDocument(getCleanHTML());
}
document.getElementById("resetImagePosBtn").addEventListener("click", () => {
  if (!selectedImage) return;
  selectedImage.style.left = '';
  selectedImage.style.top = '';
  selectedImage.style.position = '';
  selectedImage.classList.add('align-left');
  ensureImageHasMoveHandle(selectedImage);       
  updateAlignmentButtonState(selectedImage);
  saveCurrentDocument(getCleanHTML());
   observeAllImageWrappers(); 
});
pagesContainer.addEventListener('dragstart', (e) => {
  let target = e.target;
  if (target.nodeType === Node.TEXT_NODE) {
    target = target.parentElement;
  }
  if (target.closest('.image-wrapper')) {
    e.preventDefault();
  }
});

const imageWrapSelect = document.getElementById("imageWrapSelect");

imageWrapSelect.addEventListener("change", () => {
  if (!selectedImage) return;

  const wrapClass = imageWrapSelect.value;
  if (!wrapClass) return;

 
  selectedImage.classList.remove("wrap-inline", "wrap-square", "wrap-front");
  selectedImage.classList.add(wrapClass);

  
  if (wrapClass === "wrap-inline" || wrapClass === "wrap-square") {
    selectedImage.style.left = '';
    selectedImage.style.top = '';
    selectedImage.style.position = '';

   
    const sel = window.getSelection();
    let placed = false;
    const page = selectedImage.closest('.page');   

    if (sel.rangeCount) {
      const range = sel.getRangeAt(0);

      
      if (!sel.isCollapsed) {
        range.collapse(true);
      }

      if (page && page.contains(range.commonAncestorContainer) &&
          !range.commonAncestorContainer.closest('.image-wrapper')) {
        range.insertNode(selectedImage);
        placed = true;
      }
    }

    if (!placed && page) {
      page.appendChild(selectedImage);
    }
  }

  else if (wrapClass === "wrap-front") {
    ensureImageHasMoveHandle(selectedImage);
    selectedImage.style.position = 'absolute';

    if (!selectedImage.style.left && !selectedImage.style.top) {
      const rect = selectedImage.getBoundingClientRect();
      const page = selectedImage.closest('.page');
      if (page) {
        const pageRect = page.getBoundingClientRect();
        selectedImage.style.left = (rect.left - pageRect.left) + 'px';
        selectedImage.style.top = (rect.top - pageRect.top) + 'px';
      }
    }

    const wrapperRect = selectedImage.getBoundingClientRect();
    const page = selectedImage.closest('.page');
    if (page) {
      const pageRect = page.getBoundingClientRect();
      const handleGap = 20;
      let left = parseFloat(selectedImage.style.left) || 0;
      let top = parseFloat(selectedImage.style.top) || 0;
      const maxLeft = Math.max(0, pageRect.width - wrapperRect.width - handleGap);
      const maxTop = Math.max(0, pageRect.height - wrapperRect.height - handleGap);
      if (left < 0) left = 0;
      else if (left > maxLeft) left = maxLeft;
      if (top < 0) top = 0;
      else if (top > maxTop) top = maxTop;
      selectedImage.style.left = left + 'px';
      selectedImage.style.top = top + 'px';
    }
  }


  updateAlignmentButtonState(selectedImage);
  updateImagePositionInputs();
  saveCurrentDocument(getCleanHTML());
  updateFormattingState();
});





function updateImageWrapDropdown(wrapper) {
  if (!wrapper || !wrapper.classList.contains('image-wrapper')) {
    imageWrapSelect.value = "";
    return;
  }
  if (wrapper.classList.contains('wrap-inline')) imageWrapSelect.value = "wrap-inline";
  else if (wrapper.classList.contains('wrap-square')) imageWrapSelect.value = "wrap-square";
  else if (wrapper.classList.contains('wrap-front')) imageWrapSelect.value = "wrap-front";
  else imageWrapSelect.value = "";
}function ensureImageHasMoveHandle(wrapper) {
  if (!wrapper || !wrapper.classList.contains('image-wrapper')) return;
  if (!wrapper.querySelector('.image-move-handle')) {
    const handle = document.createElement('div');
    handle.className = 'image-move-handle';
    handle.innerHTML = '⤡';
    handle.setAttribute('draggable', 'false');
    handle.title = 'Drag to move image';
    wrapper.appendChild(handle);
  }
}


const overflowTimeouts = new Map();

const imageResizeObserver = new ResizeObserver(entries => {
  const pagesToRefresh = new Set();
  for (const entry of entries) {
    const wrapper = entry.target;
    const page = wrapper.closest('.page');
    if (page) pagesToRefresh.add(page);
  }

  for (const page of pagesToRefresh) {
    if (!page.isConnected) continue;

  
    if (overflowTimeouts.has(page)) {
      clearTimeout(overflowTimeouts.get(page));
    }

   
    const timeoutId = setTimeout(() => {
      overflowTimeouts.delete(page);
      if (page.isConnected) {
        handleOverflow(page);
      }
    }, 150);
    overflowTimeouts.set(page, timeoutId);
  }

  
  clearTimeout(imageResizeObserver._compactTimeout);
  imageResizeObserver._compactTimeout = setTimeout(() => {
    compactPages();
  }, 200);
});
fontColorBtn.addEventListener("click", () => {
  const page = getActivePage();
  page.focus();
  fontColorInput.click();
});

fontColorInput.addEventListener("input", () => {
  const color = fontColorInput.value;


  if (currentTable) {
    const selectedCells = currentTable.querySelectorAll(".cell-selected");
    if (selectedCells.length > 0) {
      selectedCells.forEach(cell => {
        cell.style.color = color;
      });
      saveCurrentDocument(getCleanHTML());
      return;
    }
  }

  
  const page = getActivePage();
  page.focus();
  document.execCommand("styleWithCSS", false, true);
  document.execCommand("foreColor", false, color);
  updateFormattingState();
  saveCurrentDocument(getCleanHTML());
});
function observeAllImageWrappers() {
  pagesContainer.querySelectorAll('.image-wrapper').forEach(wrapper => {
   
    if (!wrapper.dataset.observed) {
      imageResizeObserver.observe(wrapper);
      wrapper.dataset.observed = 'true';
    }
  });
}
function cancelAllOverflows() {
  for (const timeout of overflowTimeouts.values()) {
    clearTimeout(timeout);
  }
  overflowTimeouts.clear();
}

openFindReplaceBtn.addEventListener("click", openFindReplace);

function fitImageToPage(wrapper) {
  const page = wrapper.closest('.page');
  if (!page) return;

  const pageWidth = page.clientWidth;
  const pageHeight = page.clientHeight;

  const maxW = pageWidth * 0.9;
  const maxH = pageHeight * 0.9;

  const img = wrapper.querySelector('img');
  if (!img) return;

  
  const doFit = () => {
    const naturalW = img.naturalWidth;
    const naturalH = img.naturalHeight;
    if (!naturalW || !naturalH) return;   

    let targetW = naturalW;
    let targetH = naturalH;

   
    if (targetW > maxW) {
      const ratio = maxW / targetW;
      targetW = maxW;
      targetH = targetH * ratio;
    }
    if (targetH > maxH) {
      const ratio = maxH / targetH;
      targetH = maxH;
      targetW = targetW * ratio;
    }

   
    if (targetW < naturalW || targetH < naturalH) {
      wrapper.style.width = targetW + 'px';
      img.style.height = 'auto';   
    }
  };

  
  if (img.complete) {
    doFit();
  } else {
    img.addEventListener('load', doFit, { once: true });
  }
}
function updateImagePositionInputs() {
  if (!selectedImage || !selectedImage.classList.contains('wrap-front')) {
    imagePosLabel.style.display = 'none';
    return;
  }
  imagePosLabel.style.display = 'inline';
  const left = parseFloat(selectedImage.style.left) || 0;
  const top = parseFloat(selectedImage.style.top) || 0;
  imageLeftInput.value = Math.round(left);
  imageTopInput.value = Math.round(top);
}
imageLeftInput.addEventListener('input', () => {
  if (!selectedImage || !selectedImage.classList.contains('wrap-front')) return;
  selectedImage.style.left = imageLeftInput.value + 'px';
  saveCurrentDocument(getCleanHTML());
});

imageTopInput.addEventListener('input', () => {
  if (!selectedImage || !selectedImage.classList.contains('wrap-front')) return;
  selectedImage.style.top = imageTopInput.value + 'px';
  saveCurrentDocument(getCleanHTML());
});


imageLeftInput.addEventListener('mousedown', (e) => e.stopPropagation());
imageTopInput.addEventListener('mousedown', (e) => e.stopPropagation());
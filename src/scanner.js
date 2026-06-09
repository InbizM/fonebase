import { createWorker } from 'tesseract.js';

let _isRunning = false;
let _onScanCallback = null;
let _facingMode = "environment";
let _torchOn = false;
let _videoStream = null;
let _animFrameId = null;
let _decoding = false;          // anti-stack flag
let _lastFrameTime = 0;         // throttle
let _scanFilter = null;         // regex para filtrar resultados (ej: IMEI)
let _scanFilterLabel = null;    // etiqueta para mostrar al usuario
let _scannerMode = "barcode";   // "barcode" o "ocr"
let _ocrWorker = null;
let _ocrCandidates = [];        // nombres de productos para emparejar en OCR
let _lastMatchedProduct = null;

// Empareja texto del OCR con la lista de productos por palabras clave
function matchProduct(ocrText, candidates) {
  if (!candidates || candidates.length === 0) return null;
  const normalizedOcr = ocrText.toLowerCase();
  
  let bestMatch = null;
  let bestScore = 0;
  
  for (const product of candidates) {
    if (!product) continue;
    const normProduct = product.toLowerCase();
    
    // Separar en palabras clave de longitud > 2
    const words = normProduct.split(/\s+/).filter(w => w.length > 2);
    if (words.length === 0) continue;
    
    let matchesCount = 0;
    for (const word of words) {
      if (normalizedOcr.includes(word)) {
        matchesCount++;
      }
    }
    
    let score = matchesCount / words.length;
    if (normalizedOcr.includes(normProduct)) {
      score += 0.5; // bonus por coincidencia exacta de subcadena
    }
    
    if (score > bestScore && score >= 0.4) {
      bestScore = score;
      bestMatch = product;
    }
  }
  return bestMatch;
}

// Algoritmo de Luhn para validar que un número de 15 dígitos sea un IMEI válido
function validateLuhn(imei) {
  if (!/^\d{15}$/.test(imei)) return false;
  let sum = 0;
  for (let i = 0; i < 15; i++) {
    let d = parseInt(imei.charAt(i), 10);
    if (i % 2 === 1) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  return sum % 10 === 0;
}

// Extrae todos los IMEIs válidos de un texto reconociendo dígitos espaciados o separados
function extractIMEIs(text) {
  const cleanedText = text.replace(/[^0-9\s\-\.]/g, ""); // conservar solo dígitos y separadores
  const candidates = [];
  const regex = /[\d\s\-\.]{15,30}/g;
  let match;
  while ((match = regex.exec(cleanedText)) !== null) {
    const digitsOnly = match[0].replace(/\D/g, "");
    for (let i = 0; i <= digitsOnly.length - 15; i++) {
      const candidate = digitsOnly.substring(i, i + 15);
      if (validateLuhn(candidate)) {
        candidates.push(candidate);
      }
    }
  }
  return [...new Set(candidates)];
}

async function getOCRWorker() {
  if (!_ocrWorker) {
    _ocrWorker = await createWorker('eng');
  }
  // Configurar whitelist dinámica según busquemos productos o solo números de IMEI
  if (_ocrCandidates && _ocrCandidates.length > 0) {
    await _ocrWorker.setParameters({
      tessedit_char_whitelist: '', // permitir todo para leer nombres de marca/modelo
    });
  } else {
    await _ocrWorker.setParameters({
      tessedit_char_whitelist: '0123456789', // restringir a números para IMEIs puros (mayor rapidez)
    });
  }
  return _ocrWorker;
}

let _decoder = null;
let _decoderType = null;

// DOM refs
let modal, backdrop, closeBtn, readerContainer, videoEl, statusEl, titleEl,
    manualInput, manualBtn, torchBtn, switchBtn, guideBox, pickList;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isIOS() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

// ─── Decoders ────────────────────────────────────────────────────────────────

async function initDecoders() {
  if (typeof BarcodeDetector !== "undefined") {
    try {
      const supported = await BarcodeDetector.getSupportedFormats();
      const want = ["qr_code","code_128","code_39","ean_13","ean_8","upc_a","upc_e","pdf417","data_matrix"];
      const formats = want.filter(f => supported.includes(f));
      _decoder = new BarcodeDetector({ formats: formats.length ? formats : ["qr_code","code_128","ean_13"] });
      _decoderType = "native";
      console.log("[Scanner] Motor: BarcodeDetector nativo");
      return;
    } catch { /* fallthrough */ }
  }

  const { readBarcodesFromImageData } = await import("zxing-wasm/reader");
  _decoder = readBarcodesFromImageData;
  _decoderType = "zxing-wasm";
  console.log("[Scanner] Motor: zxing-wasm (C++ WASM)");
}

// ─── Camera selection (fast: label-only, no per-camera open) ─────────────────

async function getBestCameraId() {
  if (isIOS()) return null; // iOS Safari maneja bien facingMode directamente

  try {
    // Unlock labels con una probe mínima
    const probe = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
    probe.getTracks().forEach(t => t.stop());

    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter(d => d.kind === "videoinput");
    if (cameras.length <= 1) return cameras[0]?.deviceId ?? null;

    // Puntuar solo por label (rápido, sin abrir cada cámara)
    const scored = cameras.map(cam => {
      const label = cam.label.toLowerCase();
      let score = 0;

      // Preferir traseras
      if (/back|rear|environment|posterior|trasera/i.test(label)) score += 30;
      // Preferir cámara principal/wide (no ultra-wide ni macro)
      if (/\bmain\b|wide(?! angle)|principal/i.test(label)) score += 20;
      if (/ultra|macro|depth|tof|\btele\b|periscope|\bir\b/i.test(label)) score -= 30;
      // En etiquetas genéricas con número: "Camera 0" suele ser la principal
      const numMatch = label.match(/camera\s*(\d)/i);
      if (numMatch) {
        const n = parseInt(numMatch[1]);
        score += n === 0 ? 10 : n === 1 ? 5 : 0;
      }

      console.log(`[Scanner] ${cam.label} → score: ${score}`);
      return { cam, score };
    });

    scored.sort((a, b) => b.score - a.score);
    const best = scored[0].cam.deviceId;
    console.log(`[Scanner] Elegida: ${scored[0].cam.label}`);
    return best;
  } catch {
    return null;
  }
}

// ─── Audio feedback ───────────────────────────────────────────────────────────

function playBeep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(1050, ctx.currentTime);
    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.18);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.18);
  } catch {}
}

// ─── DOM ──────────────────────────────────────────────────────────────────────

function ensureDOM() {
  const oldModal = document.getElementById("scanner-modal");
  if (oldModal) {
    if (document.getElementById("scanner-video")) return;
    oldModal.remove();
  }

  const html = `
    <style>
      @keyframes scanLine {
        0%   { top: 6px; }
        50%  { top: calc(100% - 8px); }
        100% { top: 6px; }
      }
      @keyframes focusFade {
        0%   { opacity: 1; transform: scale(1); }
        100% { opacity: 0; transform: scale(1.6); }
      }
      #scanner-scan-line {
        position: absolute;
        left: 4px; right: 4px; height: 2px;
        background: linear-gradient(90deg, transparent, #38bdf8, #38bdf8, transparent);
        animation: scanLine 1.8s ease-in-out infinite;
        border-radius: 2px;
        box-shadow: 0 0 8px #38bdf8;
        pointer-events: none;
      }
    </style>
    <div id="scanner-modal" class="hidden fixed inset-0 z-[60] items-center justify-center p-4">
      <div id="scanner-backdrop" class="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
      <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden z-10 flex flex-col max-h-[95vh]">
        
        <div class="flex items-center justify-between px-5 py-4 border-b border-surface-variant flex-shrink-0">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-primary text-[20px]" style="font-variation-settings:'FILL' 1">qr_code_scanner</span>
            <h3 id="scanner-title" class="font-bold text-on-surface text-sm">Escanear Código</h3>
          </div>
          <button id="scanner-close" class="p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg transition-colors">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <!-- Mode Tabs -->
        <div class="flex border-b border-surface-variant bg-surface-container-low flex-shrink-0">
          <button id="scanner-tab-barcode" class="flex-1 py-3 text-xs font-bold border-b-2 border-primary text-primary transition-colors flex items-center justify-center gap-1.5">
            <span class="material-symbols-outlined text-[16px]">barcode</span> Código
          </button>
          <button id="scanner-tab-ocr" class="flex-1 py-3 text-xs font-bold border-b-2 border-transparent text-on-surface-variant hover:text-on-surface transition-colors flex items-center justify-center gap-1.5">
            <span class="material-symbols-outlined text-[16px]">document_scanner</span> Lector IMEI (OCR)
          </button>
        </div>
        
        <div id="scanner-reader-container" class="bg-black relative touch-none flex-1 min-h-[300px] overflow-hidden flex items-center justify-center">
          <video id="scanner-video" class="absolute inset-0 w-full h-full object-cover" playsinline muted autoplay></video>
          
          <div class="absolute inset-0 z-10 flex items-center justify-center overflow-hidden pointer-events-none">
            <div id="scanner-guide-box" class="relative flex-shrink-0 transition-none" style="width:260px;height:140px;border:2px solid rgba(255,255,255,0.6);box-shadow:0 0 0 4000px rgba(0,0,0,0.65);">
              <!-- esquinas animadas -->
              <div data-dir="tl" class="resize-handle absolute -top-1.5 -left-1.5 w-8 h-8 border-t-4 border-l-4 border-white pointer-events-auto cursor-nwse-resize"></div>
              <div data-dir="tr" class="resize-handle absolute -top-1.5 -right-1.5 w-8 h-8 border-t-4 border-r-4 border-white pointer-events-auto cursor-nesw-resize"></div>
              <div data-dir="bl" class="resize-handle absolute -bottom-1.5 -left-1.5 w-8 h-8 border-b-4 border-l-4 border-white pointer-events-auto cursor-nesw-resize"></div>
              <div data-dir="br" class="resize-handle absolute -bottom-1.5 -right-1.5 w-8 h-8 border-b-4 border-r-4 border-white pointer-events-auto cursor-nwse-resize"></div>
              <!-- línea de escaneo -->
              <div id="scanner-scan-line"></div>
            </div>
          </div>

          <div class="absolute bottom-4 right-4 flex gap-2 z-20 pointer-events-auto">
            <button id="scanner-torch-btn" class="w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 active:scale-95 transition-transform" title="Linterna">
              <span class="material-symbols-outlined text-[20px]">flashlight_on</span>
            </button>
            <button id="scanner-switch-btn" class="w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 active:scale-95 transition-transform" title="Cambiar cámara">
              <span class="material-symbols-outlined text-[20px]">cameraswitch</span>
            </button>
          </div>
        </div>

        <div id="scanner-status" class="px-5 py-3 text-center text-sm text-on-surface-variant bg-surface-container-low flex-shrink-0">
          Iniciando cámara...
        </div>

        <!-- Lista de selección cuando hay múltiples resultados -->
        <div id="scanner-pick-list" class="hidden px-5 pb-3 flex-shrink-0 overflow-y-auto max-h-[180px]">
          <p class="text-[11px] text-on-surface-variant font-medium uppercase tracking-wider mb-2">Selecciona el código correcto</p>
          <div id="scanner-pick-items" class="flex flex-col gap-1.5"></div>
        </div>
        
        <div class="px-5 py-4 border-t border-surface-variant flex-shrink-0">
          <p class="text-[11px] text-on-surface-variant font-medium uppercase tracking-wider mb-2">O ingresa manualmente</p>
          <div class="flex gap-2">
            <input id="scanner-manual-input" type="text" placeholder="Escribe el código..." class="flex-1 bg-surface-container border border-surface-variant rounded-lg px-3 py-2.5 text-sm text-on-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
            <button id="scanner-manual-btn" class="px-4 py-2.5 bg-primary text-on-primary text-sm font-bold rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-1">
              <span class="material-symbols-outlined text-[16px]">check</span> OK
            </button>
          </div>
        </div>
      </div>
    </div>`;

  document.body.insertAdjacentHTML("beforeend", html);

  modal           = document.getElementById("scanner-modal");
  backdrop        = document.getElementById("scanner-backdrop");
  closeBtn        = document.getElementById("scanner-close");
  readerContainer = document.getElementById("scanner-reader-container");
  videoEl         = document.getElementById("scanner-video");
  statusEl        = document.getElementById("scanner-status");
  titleEl         = document.getElementById("scanner-title");
  manualInput     = document.getElementById("scanner-manual-input");
  manualBtn       = document.getElementById("scanner-manual-btn");
  torchBtn        = document.getElementById("scanner-torch-btn");
  switchBtn       = document.getElementById("scanner-switch-btn");
  guideBox        = document.getElementById("scanner-guide-box");
  pickList        = document.getElementById("scanner-pick-list");

  closeBtn.addEventListener("click", closeScanner);
  backdrop.addEventListener("click", closeScanner);
  manualBtn.addEventListener("click", handleManualInput);
  manualInput.addEventListener("keydown", (e) => { if (e.key === "Enter") handleManualInput(); });
  torchBtn.addEventListener("click", toggleTorch);
  switchBtn.addEventListener("click", switchCamera);

  // Tabs event listeners
  document.getElementById("scanner-tab-barcode").addEventListener("click", () => setScannerMode("barcode"));
  document.getElementById("scanner-tab-ocr").addEventListener("click", () => setScannerMode("ocr"));

  initResizeHandles();
}

function setScannerMode(mode) {
  _scannerMode = mode;
  const tabBarcode = document.getElementById("scanner-tab-barcode");
  const tabOcr = document.getElementById("scanner-tab-ocr");
  const scanLine = document.getElementById("scanner-scan-line");

  if (!tabBarcode || !tabOcr) return;

  if (mode === "ocr") {
    tabBarcode.classList.remove("border-primary", "text-primary");
    tabBarcode.classList.add("border-transparent", "text-on-surface-variant");
    
    tabOcr.classList.remove("border-transparent", "text-on-surface-variant");
    tabOcr.classList.add("border-primary", "text-primary");
    
    if (scanLine) {
      scanLine.style.background = "linear-gradient(90deg, transparent, #a855f7, #a855f7, transparent)";
      scanLine.style.boxShadow = "0 0 8px #a855f7";
    }

    if (guideBox) {
      if (_ocrCandidates && _ocrCandidates.length > 0) {
        guideBox.style.width  = "320px";
        guideBox.style.height = "180px";
        statusEl.textContent = `📷 Encuadra la etiqueta completa con modelo e IMEIs`;
      } else {
        guideBox.style.width  = "300px";
        guideBox.style.height = "100px";
        const hint = _scanFilterLabel ? ` — buscando ${_scanFilterLabel}` : "";
        statusEl.textContent = `📷 Encuadra el IMEI en la caja o pantalla${hint}`;
      }
    }
    statusEl.className = "px-5 py-3 text-center text-sm text-purple-800 bg-purple-50 font-medium";
  } else {
    tabOcr.classList.remove("border-primary", "text-primary");
    tabOcr.classList.add("border-transparent", "text-on-surface-variant");
    
    tabBarcode.classList.remove("border-transparent", "text-on-surface-variant");
    tabBarcode.classList.add("border-primary", "text-primary");
    
    if (scanLine) {
      scanLine.style.background = "linear-gradient(90deg, transparent, #38bdf8, #38bdf8, transparent)";
      scanLine.style.boxShadow = "0 0 8px #38bdf8";
    }

    const hint = _scanFilterLabel ? ` — buscando ${_scanFilterLabel}` : "";
    statusEl.textContent = `📷 Apunta al código de barras o QR${hint}`;
    statusEl.className = "px-5 py-3 text-center text-sm text-blue-800 bg-blue-50 font-medium";
    
    if (guideBox) {
      guideBox.style.width  = "280px";
      guideBox.style.height = "120px";
    }
  }
  
  hidePickList();
}

// ─── Pick list (múltiples barcodes detectados) ────────────────────────────────

function showPickList(codes) {
  const itemsEl = document.getElementById("scanner-pick-items");
  if (!itemsEl) return;

  itemsEl.innerHTML = "";
  codes.forEach(code => {
    const btn = document.createElement("button");
    btn.className = "w-full text-left px-3 py-2.5 rounded-xl bg-surface-container hover:bg-primary/10 border border-surface-variant text-sm font-mono text-on-surface transition-colors flex items-center gap-2 active:scale-[0.98]";
    btn.innerHTML = `<span class="material-symbols-outlined text-primary text-[16px]">barcode</span><span class="truncate">${code}</span>`;
    btn.addEventListener("click", () => {
      playBeep();
      if (_onScanCallback) _onScanCallback(code);
      setTimeout(() => closeScanner(), 300);
    });
    itemsEl.appendChild(btn);
  });

  pickList.classList.remove("hidden");
}

function hidePickList() {
  if (pickList) pickList.classList.add("hidden");
  const itemsEl = document.getElementById("scanner-pick-items");
  if (itemsEl) itemsEl.innerHTML = "";
}

// ─── Resize handles ───────────────────────────────────────────────────────────

function initResizeHandles() {
  const handles = document.querySelectorAll(".resize-handle");
  let activeHandle = null, startX, startY, startW, startH;

  handles.forEach(h => {
    h.addEventListener("touchstart", (e) => {
      activeHandle = h; startX = e.touches[0].clientX; startY = e.touches[0].clientY;
      startW = guideBox.offsetWidth; startH = guideBox.offsetHeight; e.preventDefault();
    }, { passive: false });
    h.addEventListener("mousedown", (e) => {
      activeHandle = h; startX = e.clientX; startY = e.clientY;
      startW = guideBox.offsetWidth; startH = guideBox.offsetHeight; e.preventDefault();
    });
  });

  const onMove = (clientX, clientY, e) => {
    if (!activeHandle) return;
    const dx = clientX - startX, dy = clientY - startY;
    let newW = startW, newH = startH;
    const dir = activeHandle.dataset.dir;
    if (dir === "br") { newW = startW + dx * 2; newH = startH + dy * 2; }
    else if (dir === "bl") { newW = startW - dx * 2; newH = startH + dy * 2; }
    else if (dir === "tr") { newW = startW + dx * 2; newH = startH - dy * 2; }
    else if (dir === "tl") { newW = startW - dx * 2; newH = startH - dy * 2; }
    newW = Math.max(60, Math.min(newW, window.innerWidth - 30));
    newH = Math.max(40, Math.min(newH, 420));
    guideBox.style.width = newW + "px";
    guideBox.style.height = newH + "px";
    if (e) e.preventDefault();
  };

  document.addEventListener("touchmove", (e) => {
    if (activeHandle) onMove(e.touches[0].clientX, e.touches[0].clientY, e);
  }, { passive: false });
  document.addEventListener("mousemove", (e) => { if (activeHandle) onMove(e.clientX, e.clientY, e); });

  const onEnd = () => { if (activeHandle) activeHandle = null; };
  document.addEventListener("touchend", onEnd);
  document.addEventListener("mouseup", onEnd);

  // Tap-to-focus
  readerContainer.addEventListener("click", async (e) => {
    if (!_videoStream) return;
    const track = _videoStream.getVideoTracks()[0];
    if (!track?.applyConstraints) return;

    const rect = readerContainer.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top)  / rect.height;

    const dot = document.createElement("div");
    dot.style.cssText = `position:absolute;width:44px;height:44px;border:2px solid white;border-radius:50%;
      left:${e.clientX - rect.left - 22}px;top:${e.clientY - rect.top - 22}px;
      z-index:30;pointer-events:none;animation:focusFade 0.8s ease forwards;`;
    readerContainer.appendChild(dot);
    setTimeout(() => dot.remove(), 800);

    try {
      await track.applyConstraints({ advanced: [{ focusMode: "manual" }] });
      await track.applyConstraints({ advanced: [{ pointOfInterest: { x, y } }] });
      await new Promise(r => setTimeout(r, 400));
      await track.applyConstraints({ advanced: [{ focusMode: "continuous" }] });
    } catch {
      try {
        await track.applyConstraints({ advanced: [{ focusMode: "manual" }] });
        await new Promise(r => setTimeout(r, 200));
        await track.applyConstraints({ advanced: [{ focusMode: "continuous" }] });
      } catch {}
    }
  });
}

// ─── Manual input ─────────────────────────────────────────────────────────────

function handleManualInput() {
  const code = manualInput.value.trim();
  if (!code) return;
  if (_onScanCallback) _onScanCallback(code);
  closeScanner();
}

// ─── Torch / Camera switch ────────────────────────────────────────────────────

async function toggleTorch() {
  if (!_videoStream) return;
  const track = _videoStream.getVideoTracks()[0];
  if (!track) return;
  _torchOn = !_torchOn;
  try {
    await track.applyConstraints({ advanced: [{ torch: _torchOn }] });
    torchBtn.innerHTML = `<span class="material-symbols-outlined text-[20px]">${_torchOn ? "flashlight_off" : "flashlight_on"}</span>`;
    _torchOn ? torchBtn.classList.replace("bg-black/50", "bg-primary")
             : torchBtn.classList.replace("bg-primary", "bg-black/50");
  } catch {
    _torchOn = false;
  }
}

async function switchCamera() {
  if (!_isRunning) return;
  _facingMode = _facingMode === "environment" ? "user" : "environment";
  statusEl.textContent = "Cambiando cámara...";
  stopStream();
  _torchOn = false;
  torchBtn.innerHTML = `<span class="material-symbols-outlined text-[20px]">flashlight_on</span>`;
  torchBtn.classList.remove("bg-primary");
  torchBtn.classList.add("bg-black/50");
  await startScannerFeed();
}

// ─── Stream ───────────────────────────────────────────────────────────────────

function stopStream() {
  _isRunning = false;
  _decoding  = false;
  if (_videoStream) { _videoStream.getTracks().forEach(t => t.stop()); _videoStream = null; }
  if (videoEl)  videoEl.srcObject = null;
  if (_animFrameId) { cancelAnimationFrame(_animFrameId); _animFrameId = null; }
}

async function startScannerFeed() {
  try {
    let constraints;

    if (isIOS()) {
      // iOS Safari: no usar deviceId, facingMode exact funciona mejor
      constraints = {
        video: {
          facingMode: { exact: "environment" },
          width:  { ideal: 1920 },
          height: { ideal: 1080 }
        }
      };
    } else if (_facingMode === "environment") {
      const bestId = await getBestCameraId();
      constraints = bestId
        ? { video: { deviceId: { exact: bestId }, width: { ideal: 1920 }, height: { ideal: 1080 } } }
        : { video: { facingMode: "environment",   width: { ideal: 1920 }, height: { ideal: 1080 } } };
    } else {
      constraints = { video: { facingMode: "user" } };
    }

    _videoStream = await navigator.mediaDevices.getUserMedia(constraints);
    videoEl.srcObject = _videoStream;

    const track = _videoStream.getVideoTracks()[0];
    if (track?.applyConstraints) {
      try { await track.applyConstraints({ advanced: [{ focusMode: "continuous" }] }); } catch {}
      try { await track.applyConstraints({ zoom: 1.0 }); } catch {}
    }

    await new Promise(resolve => { videoEl.onloadedmetadata = () => { videoEl.play(); resolve(); }; });

    _isRunning = true;
    const hint = _scanFilterLabel ? ` — buscando ${_scanFilterLabel}` : "";
    statusEl.textContent = `📷 Apunta al código de barras o QR${hint}`;
    statusEl.className = "px-5 py-3 text-center text-sm text-blue-800 bg-blue-50 font-medium";

    scanLoop();
  } catch (err) {
    console.error("Scanner error:", err);
    statusEl.textContent = "⚠️ No se pudo acceder a la cámara. Usa la entrada manual.";
    statusEl.className = "px-5 py-3 text-center text-sm text-amber-800 bg-amber-50";
  }
}

// ─── Scan loop (~15 fps, anti-stack) ─────────────────────────────────────────

function scanLoop() {
  if (!_isRunning) return;
  _animFrameId = requestAnimationFrame(async () => {
    if (!_isRunning) return;

    const now = performance.now();
    // En modo OCR, procesamos una vez cada 600ms para no sobrecargar la CPU, de lo contrario a ~15fps
    const minDelay = _scannerMode === "ocr" ? 600 : 65;
    if (_decoding || now - _lastFrameTime < minDelay) {
      scanLoop();
      return;
    }

    if (videoEl.readyState < 2 || videoEl.paused) { scanLoop(); return; }

    _decoding = true;
    _lastFrameTime = now;

    try {
      let codes = [];
      if (_scannerMode === "ocr") {
        codes = await decodeOCRInFrame();
      } else {
        codes = await decodeAllInFrame();
      }

      if (codes.length > 0) {
        handleDetectedCodes(codes);
      } else {
        // Restaurar estado base si no detectamos nada para evitar parpadeos
        if (_scannerMode === "ocr") {
          const hint = _scanFilterLabel ? ` — buscando ${_scanFilterLabel}` : "";
          statusEl.textContent = `📷 Encuadra el IMEI en la caja o pantalla${hint}`;
          statusEl.className = "px-5 py-3 text-center text-sm text-purple-800 bg-purple-50 font-medium";
        }
        scanLoop();
      }
    } catch {
      scanLoop();
    } finally {
      _decoding = false;
    }
  });
}

// ─── Decode: guide box first, then full frame ─────────────────────────────────

async function decodeAllInFrame() {
  // Pasada 1: sólo el área del guide box (rápida)
  const boxCodes = await decodeRegion(true);
  if (boxCodes.length > 0) return boxCodes;

  // Pasada 2: frame completo (encuentra códigos fuera o muy pequeños)
  const fullCodes = await decodeRegion(false);
  return fullCodes;
}

function getRegionCanvas(guideBoxOnly) {
  const videoRect = videoEl.getBoundingClientRect();
  if (videoRect.width === 0 || videoRect.height === 0) return null;

  const scaleX = videoRect.width  / videoEl.videoWidth;
  const scaleY = videoRect.height / videoEl.videoHeight;
  const scale  = Math.max(scaleX, scaleY);

  const displayW = videoEl.videoWidth  * scale;
  const displayH = videoEl.videoHeight * scale;
  const offsetX  = (displayW - videoRect.width)  / 2;
  const offsetY  = (displayH - videoRect.height) / 2;

  let srcX, srcY, srcW, srcH;

  if (guideBoxOnly) {
    const guideRect = guideBox.getBoundingClientRect();
    srcX = (guideRect.left - videoRect.left + offsetX) / scale;
    srcY = (guideRect.top  - videoRect.top  + offsetY) / scale;
    srcW = guideRect.width  / scale;
    srcH = guideRect.height / scale;
  } else {
    srcX = 0; srcY = 0;
    srcW = videoEl.videoWidth;
    srcH = videoEl.videoHeight;
  }

  if (srcW <= 0 || srcH <= 0) return null;

  const MIN_SIZE = 600;
  const scaleUp = guideBoxOnly && srcW < MIN_SIZE ? MIN_SIZE / srcW : 1;

  const canvas = document.createElement("canvas");
  canvas.width  = Math.round(srcW * scaleUp);
  canvas.height = Math.round(srcH * scaleUp);
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  
  if (_scannerMode === "ocr") {
    // Optimización de contraste nativa del canvas para aumentar la tasa de acierto del OCR
    ctx.filter = "grayscale(1) contrast(2) brightness(1.1)";
  } else {
    ctx.imageSmoothingEnabled = false;
  }
  
  ctx.drawImage(videoEl, srcX, srcY, srcW, srcH, 0, 0, canvas.width, canvas.height);
  return canvas;
}

async function decodeRegion(guideBoxOnly) {
  const canvas = getRegionCanvas(guideBoxOnly);
  if (!canvas) return [];
  const ctx = canvas.getContext("2d");
  return await runDecoder(canvas, ctx);
}

async function decodeOCRInFrame() {
  const canvas = getRegionCanvas(true); // OCR enfocado solo en el área de la guía
  if (!canvas) return [];

  try {
    const worker = await getOCRWorker();
    const { data: { text } } = await worker.recognize(canvas);
    console.log("[Scanner OCR Raw]:", text);
    return extractIMEIs(text);
  } catch (err) {
    console.error("[Scanner OCR Error]:", err);
    return [];
  }
}

async function runDecoder(canvas, ctx) {
  const MAX_CODES = 10; // detectar hasta 10 barcodes por frame

  if (_decoderType === "native" && _decoder) {
    try {
      const barcodes = await _decoder.detect(canvas);
      return barcodes.map(b => b.rawValue).filter(Boolean);
    } catch {}
  } else if (_decoderType === "zxing-wasm" && _decoder) {
    try {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const results = await _decoder(imageData, {
        tryHarder: true,
        formats: ["QRCode","Code128","Code39","EAN13","EAN8","UPCA","UPCE","PDF417","DataMatrix"],
        maxNumberOfSymbols: MAX_CODES
      });
      return results.map(r => r.text).filter(Boolean);
    } catch {}
  }
  return [];
}

// ─── Handle detected codes ────────────────────────────────────────────────────

function handleDetectedCodes(codes) {
  // Deduplicar
  const unique = [...new Set(codes.map(c => c.trim()).filter(Boolean))];

  // Si hay filtro (ej: IMEI), priorizar los que coinciden
  let filtered = unique;
  if (_scanFilter) {
    const matches = unique.filter(c => _scanFilter.test(c));
    if (matches.length > 0) filtered = matches;
  }

  if (filtered.length === 1) {
    // Un solo resultado: auto-seleccionar
    playBeep();
    statusEl.textContent = `✅ Detectado: ${filtered[0]}`;
    statusEl.className = "px-5 py-3 text-center text-sm text-green-800 bg-green-50 font-bold";
    if (_onScanCallback) _onScanCallback(filtered[0], filtered, _lastMatchedProduct);
    setTimeout(() => closeScanner(), 600);
  } else if (filtered.length > 1) {
    // En modo OCR, si detectamos 2 o más IMEIs válidos, auto-seleccionar de inmediato y enviar la lista entera + el producto emparejado
    if (_scannerMode === "ocr") {
      playBeep();
      statusEl.textContent = `✅ Detectados ${filtered.length} IMEIs`;
      statusEl.className = "px-5 py-3 text-center text-sm text-green-800 bg-green-50 font-bold";
      if (_onScanCallback) _onScanCallback(filtered[0], filtered, _lastMatchedProduct);
      setTimeout(() => closeScanner(), 600);
    } else {
      // Múltiples códigos: mostrar lista para que el usuario elija
      playBeep();
      statusEl.textContent = `🔍 ${filtered.length} códigos detectados — elige el correcto:`;
      statusEl.className = "px-5 py-3 text-center text-sm text-indigo-800 bg-indigo-50 font-medium";
      showPickList(filtered);
      // Seguir escaneando por si el usuario reposiciona
      scanLoop();
    }
  } else {
    // No hubo resultados que pasen el filtro, mostrar todos como opción
    if (unique.length > 0) {
      playBeep();
      statusEl.textContent = `🔍 Códigos detectados — elige el correcto:`;
      statusEl.className = "px-5 py-3 text-center text-sm text-indigo-800 bg-indigo-50 font-medium";
      showPickList(unique);
      scanLoop();
    } else {
      scanLoop();
    }
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * @param {object} opts
 * @param {string}  [opts.title]       - Título del modal
 * @param {Function} [opts.onScan]     - Callback cuando se detecta un código
 * @param {RegExp}  [opts.filter]      - Regex para filtrar/priorizar resultados (ej: /^\d{15}$/ para IMEI)
 * @param {string}  [opts.filterLabel] - Etiqueta descriptiva del filtro (ej: "IMEI")
 */
export async function openScanner({ title = "Escanear Código", onScan, filter = null, filterLabel = null, candidates = [] } = {}) {
  await initDecoders();
  ensureDOM();

  _onScanCallback  = onScan;
  _facingMode      = "environment";
  _torchOn         = false;
  _isRunning       = false;
  _decoding        = false;
  _scanFilter      = filter;
  _scanFilterLabel = filterLabel;
  _ocrCandidates   = candidates;
  _lastMatchedProduct = null;

  titleEl.textContent = title;
  manualInput.value   = "";
  statusEl.textContent = "Iniciando cámara...";
  statusEl.className   = "px-5 py-3 text-center text-sm text-on-surface-variant bg-surface-container-low";

  hidePickList();

  if (torchBtn) {
    torchBtn.innerHTML = `<span class="material-symbols-outlined text-[20px]">flashlight_on</span>`;
    torchBtn.classList.remove("bg-primary");
    torchBtn.classList.add("bg-black/50");
  }

  // Si el filtro indica que es para IMEI o si hay candidatos de producto, abrir en modo OCR por defecto
  const isImeiFilter = filterLabel?.toUpperCase() === "IMEI" || (filter && filter.toString().includes("15")) || (candidates && candidates.length > 0);
  setScannerMode(isImeiFilter ? "ocr" : "barcode");

  modal.classList.remove("hidden");
  modal.classList.add("flex");

  await startScannerFeed();
}

export async function closeScanner() {
  stopStream();
  hidePickList();

  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }

  _onScanCallback  = null;
  _scanFilter      = null;
  _scanFilterLabel = null;
  _ocrCandidates   = [];
  _lastMatchedProduct = null;
}

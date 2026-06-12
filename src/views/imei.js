import { getEquipos, crearEquipo, actualizarEquipo, eliminarEquipo, getInventario, crearProducto, analyzeImeiLabel, analyzeBulkImeis, crearEquiposLote } from "../api.js";
import { showToast, showConfirm } from "../toast.js";
import { openScanner } from "../scanner.js";
import { createWorker } from "tesseract.js";

let _imeiOcrWorker = null;

async function getImeiOcrWorker() {
  if (!_imeiOcrWorker) {
    _imeiOcrWorker = await createWorker('eng');
  }
  return _imeiOcrWorker;
}

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

function extractIMEIs(text) {
  const cleanedText = text.replace(/[^0-9\s\-\.]/g, "");
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

function matchProduct(ocrText, candidates) {
  if (!candidates || candidates.length === 0) return null;
  const normalizedOcr = ocrText.toLowerCase();
  
  let bestMatch = null;
  let bestScore = 0;
  
  for (const product of candidates) {
    if (!product) continue;
    const normProduct = product.toLowerCase();
    
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
      score += 0.5;
    }
    
    if (score > bestScore && score >= 0.4) {
      bestScore = score;
      bestMatch = product;
    }
  }
  return bestMatch;
}

let _equipos = [];
let _isLoaded = false;
let _isProcessing = false;

// Elements
let elTable, elSearch, elFilter, elBtnNew;
let elModal, elModalClose, elModalBackdrop, elForm, elBtnSave;
let elImei1, elImei2, elNombre, elMarca, elProv, elCosto, elVenta, elEstado, elOriginal;
let elDropdownTrigger, elDropdownMenu, elDropdownSearch, elDropdownOptions, elDropdownSelectedText;

// Bulk Elements
let elBulkBtn, elBulkModal, elBulkModalClose, elBulkModalBackdrop, elBulkCancelBtn, elBulkSaveBtn;
let elBulkFile, elBulkCardContent, elBulkResultsContainer, elBulkList, elBulkCount, elBulkAddRowBtn;
let elBulkDropdownTrigger, elBulkDropdownMenu, elBulkDropdownSearch, elBulkDropdownOptions, elBulkDropdownSelectedText;
let elBulkNombre, elBulkProveedor;

let _scannedImeis = [];

let _inventory = [];

export function initIMEI() {
  return async () => {
    bindElements();
    
    if (!_isLoaded) {
      await loadData();
      setupEvents();
      _isLoaded = true;
    }
    
    renderTable(_equipos);
  };
}

function bindElements() {
  elTable = document.getElementById("imei-table-body");
  elSearch = document.getElementById("imei-search");
  elFilter = document.getElementById("imei-filter-status");
  elBtnNew = document.getElementById("imei-new-btn");

  elModal = document.getElementById("imei-modal");
  elModalClose = document.getElementById("imei-modal-close");
  elModalBackdrop = document.getElementById("imei-modal-backdrop");
  elForm = document.getElementById("imei-form");
  elBtnSave = document.getElementById("imei-save-btn");

  elImei1 = document.getElementById("imei-1");
  elImei2 = document.getElementById("imei-2");
  elNombre = document.getElementById("imei-nombre");
  elMarca = document.getElementById("imei-marca");
  elProv = document.getElementById("imei-proveedor");
  elCosto = document.getElementById("imei-costo");
  elVenta = document.getElementById("imei-venta");
  elEstado = document.getElementById("imei-estado");
  elOriginal = document.getElementById("imei-original");
  
  elDropdownTrigger = document.getElementById("imei-dropdown-trigger");
  elDropdownMenu = document.getElementById("imei-dropdown-menu");
  elDropdownSearch = document.getElementById("imei-dropdown-search");
  elDropdownOptions = document.getElementById("imei-dropdown-options");
  elDropdownSelectedText = document.getElementById("imei-dropdown-selected-text");

  elBulkBtn = document.getElementById("imei-bulk-btn");
  elBulkModal = document.getElementById("imei-bulk-modal");
  elBulkModalClose = document.getElementById("imei-bulk-modal-close");
  elBulkModalBackdrop = document.getElementById("imei-bulk-modal-backdrop");
  elBulkCancelBtn = document.getElementById("imei-bulk-cancel-btn");
  elBulkSaveBtn = document.getElementById("imei-bulk-save-btn");
  elBulkFile = document.getElementById("imei-bulk-file");
  elBulkCardContent = document.getElementById("imei-bulk-card-content");
  elBulkResultsContainer = document.getElementById("imei-bulk-results-container");
  elBulkList = document.getElementById("imei-bulk-list");
  elBulkCount = document.getElementById("imei-bulk-count");
  elBulkAddRowBtn = document.getElementById("imei-bulk-add-row-btn");
  elBulkDropdownTrigger = document.getElementById("imei-bulk-dropdown-trigger");
  elBulkDropdownMenu = document.getElementById("imei-bulk-dropdown-menu");
  elBulkDropdownSearch = document.getElementById("imei-bulk-dropdown-search");
  elBulkDropdownOptions = document.getElementById("imei-bulk-dropdown-options");
  elBulkDropdownSelectedText = document.getElementById("imei-bulk-dropdown-selected-text");
  elBulkNombre = document.getElementById("imei-bulk-nombre");
  elBulkProveedor = document.getElementById("imei-bulk-proveedor");
}

async function loadData() {
  try {
    elTable.innerHTML = `<tr><td colspan="6" class="p-4 text-center text-on-surface-variant">Cargando equipos...</td></tr>`;
    _equipos = await getEquipos();
    
    // Load ALL inventory products for selection
    _inventory = await getInventario();
    
    renderDropdownOptions();
    renderBulkDropdownOptions();

  } catch (err) {
    showToast("Error cargando equipos: " + err.message, "error");
    _equipos = [];
  }
}

function renderDropdownOptions(filterText = "") {
  const query = filterText.toLowerCase().trim();
  
  // Filter inventory products
  const filtered = _inventory.filter(p => 
    !query || 
    p.nombre.toLowerCase().includes(query) || 
    (p.marca && p.marca.toLowerCase().includes(query))
  );

  let html = `
    <div onclick="window.imeiSelectProduct('__NEW_PRODUCT__')" class="flex items-center gap-3 px-4 py-3 hover:bg-primary/5 text-primary font-black text-xs cursor-pointer border-b border-slate-100 transition-colors">
      <div class="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
        <span class="material-symbols-outlined text-[18px]">add</span>
      </div>
      <span>+ Registrar Nuevo Producto...</span>
    </div>
  `;

  if (filtered.length === 0) {
    html += `
      <div class="px-4 py-6 text-center text-xs text-slate-400">
        No se encontraron productos
      </div>
    `;
  } else {
    html += filtered.map(p => {
      const priceFmt = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(p.precioVenta || 0);
      const imgHtml = p.imagen 
        ? `<img src="${p.imagen}" class="w-8 h-8 rounded-lg object-cover bg-slate-50" referrerpolicy="no-referrer">`
        : `<div class="w-8 h-8 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center"><span class="material-symbols-outlined text-[18px]">phone_android</span></div>`;
      
      return `
        <div onclick="window.imeiSelectProduct('${p.id}')" class="flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-50/50">
          <div class="flex items-center gap-3 min-w-0">
            ${imgHtml}
            <div class="min-w-0">
              <p class="text-xs font-black text-slate-800 truncate">${p.nombre}</p>
              <p class="text-[10px] text-slate-400 uppercase font-bold">${p.marca || 'Genérico'}</p>
            </div>
          </div>
          <div class="text-right flex-shrink-0 ml-2">
            <span class="text-xs font-black text-primary">${priceFmt}</span>
          </div>
        </div>
      `;
    }).join("");
  }

  elDropdownOptions.innerHTML = html;
}

window.imeiSelectProduct = (productId) => {
  if (productId === "__NEW_PRODUCT__") {
    elDropdownMenu.classList.add("hidden");
    // Open inventory modal to create new product catalog item
    if (window.inventoryView && window.inventoryView.openNuevo) {
      window.inventoryView.openNuevo(false, "Celulares");
    }
    return;
  }

  const p = _inventory.find(x => x.id === productId);
  if (!p) return;

  elNombre.value = p.nombre;
  elNombre.dataset.id = p.id;

  const imgHtml = p.imagen 
    ? `<img src="${p.imagen}" class="w-6 h-6 rounded-md object-cover bg-slate-50" referrerpolicy="no-referrer">`
    : `<span class="material-symbols-outlined text-[16px] text-slate-400">phone_android</span>`;

  elDropdownSelectedText.innerHTML = `
    <div class="flex items-center gap-2">
      ${imgHtml}
      <span class="font-black text-slate-800 text-xs">${p.nombre}</span>
      <span class="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold uppercase">${p.marca || 'Genérico'}</span>
    </div>
  `;
  elDropdownSelectedText.classList.remove("text-slate-500");

  elMarca.value = p.marca || "";
  elCosto.value = new Intl.NumberFormat("es-CO").format(p.costo || 0);
  elVenta.value = new Intl.NumberFormat("es-CO").format(p.precioVenta || 0);

  elDropdownMenu.classList.add("hidden");
};

function renderBulkDropdownOptions(filterText = "") {
  const query = filterText.toLowerCase().trim();
  const filtered = _inventory.filter(p => 
    !query || 
    p.nombre.toLowerCase().includes(query) || 
    (p.marca && p.marca.toLowerCase().includes(query))
  );

  let html = "";
  if (filtered.length === 0) {
    html = `<div class="px-4 py-4 text-center text-xs text-slate-400">No se encontraron productos</div>`;
  } else {
    html = filtered.map(p => {
      const priceFmt = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(p.precioVenta || 0);
      const imgHtml = p.imagen 
        ? `<img src="${p.imagen}" class="w-8 h-8 rounded-lg object-cover bg-slate-50" referrerpolicy="no-referrer">`
        : `<div class="w-8 h-8 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center"><span class="material-symbols-outlined text-[18px]">phone_android</span></div>`;
      
      return `
        <div onclick="window.imeiSelectBulkProduct('${p.id}')" class="flex items-center justify-between px-4 py-2 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-50/50">
          <div class="flex items-center gap-3 min-w-0">
            ${imgHtml}
            <div class="min-w-0">
              <p class="text-xs font-black text-slate-800 truncate">${p.nombre}</p>
              <p class="text-[9px] text-slate-400 uppercase font-bold">${p.marca || 'Genérico'}</p>
            </div>
          </div>
          <div class="text-right flex-shrink-0 ml-2">
            <span class="text-xs font-black text-primary">${priceFmt}</span>
          </div>
        </div>
      `;
    }).join("");
  }
  elBulkDropdownOptions.innerHTML = html;
}

window.imeiSelectBulkProduct = (productId) => {
  const p = _inventory.find(x => x.id === productId);
  if (!p) return;

  elBulkNombre.value = p.nombre;
  elBulkNombre.dataset.id = p.id;
  elBulkNombre.dataset.marca = p.marca || "";
  elBulkNombre.dataset.costo = p.costo || 0;
  elBulkNombre.dataset.venta = p.precioVenta || 0;

  const imgHtml = p.imagen 
    ? `<img src="${p.imagen}" class="w-6 h-6 rounded-md object-cover bg-slate-50" referrerpolicy="no-referrer">`
    : `<span class="material-symbols-outlined text-[16px] text-slate-400">phone_android</span>`;

  elBulkDropdownSelectedText.innerHTML = `
    <div class="flex items-center gap-2">
      ${imgHtml}
      <span class="font-black text-slate-800 text-xs">${p.nombre}</span>
      <span class="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold uppercase">${p.marca || 'Genérico'}</span>
    </div>
  `;
  elBulkDropdownSelectedText.classList.remove("text-slate-500");
  elBulkDropdownMenu.classList.add("hidden");
  
  validateBulkFormReady();
};

function renderBulkImeisList() {
  if (_scannedImeis.length === 0) {
    elBulkList.innerHTML = `<p class="p-4 text-center text-xs opacity-50 italic">No hay IMEIs en la lista. Carga una foto o agrégalos manualmente.</p>`;
    elBulkCount.textContent = "0";
    validateBulkFormReady();
    return;
  }
  
  elBulkCount.textContent = _scannedImeis.length;
  
  elBulkList.innerHTML = _scannedImeis.map((item, idx) => `
    <div class="imei-bulk-row bg-white p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shadow-sm transition-all hover:border-slate-300" data-index="${idx}">
      <div class="flex items-center gap-2 shrink-0">
        <input type="checkbox" ${item.selected ? 'checked' : ''} class="imei-bulk-checkbox w-4.5 h-4.5 accent-primary cursor-pointer" onchange="window.imeiToggleBulkSelect(${idx}, this.checked)" />
        <span class="text-[10px] font-bold text-slate-400 font-mono">#${idx + 1}</span>
      </div>
      <div class="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div class="flex items-center gap-1.5">
          <span class="text-[10px] font-black text-slate-400 uppercase shrink-0 w-10">IMEI 1</span>
          <input type="text" maxlength="15" placeholder="IMEI Principal" value="${item.imei1 || ''}" 
            class="imei-bulk-input-1 w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-mono outline-none focus:border-primary" 
            oninput="window.imeiUpdateBulkVal(${idx}, 'imei1', this.value)" />
        </div>
        <div class="flex items-center gap-1.5">
          <span class="text-[10px] font-black text-slate-400 uppercase shrink-0 w-10">IMEI 2</span>
          <input type="text" maxlength="15" placeholder="IMEI 2 (Opcional)" value="${item.imei2 || ''}" 
            class="imei-bulk-input-2 w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-mono outline-none focus:border-primary" 
            oninput="window.imeiUpdateBulkVal(${idx}, 'imei2', this.value)" />
        </div>
      </div>
      <button type="button" onclick="window.imeiDeleteBulkRow(${idx})" 
        class="p-1.5 text-slate-400 hover:text-error hover:bg-error/10 rounded-lg transition-colors shrink-0 flex items-center justify-center" title="Eliminar fila">
        <span class="material-symbols-outlined text-[18px]">delete</span>
      </button>
    </div>
  `).join("");
  
  validateBulkFormReady();
}

window.imeiToggleBulkSelect = (idx, checked) => {
  if (_scannedImeis[idx]) _scannedImeis[idx].selected = checked;
  validateBulkFormReady();
};

window.imeiUpdateBulkVal = (idx, field, val) => {
  const digits = val.replace(/\D/g, "");
  if (_scannedImeis[idx]) _scannedImeis[idx][field] = digits;
  validateBulkFormReady();
};

window.imeiDeleteBulkRow = (idx) => {
  _scannedImeis.splice(idx, 1);
  renderBulkImeisList();
};

function validateBulkFormReady() {
  const selectedProdId = elBulkNombre.dataset.id;
  const hasSelectedImeis = _scannedImeis.some(item => item.selected && item.imei1.length === 15);
  elBulkSaveBtn.disabled = !selectedProdId || !hasSelectedImeis;
}

// Global hook for product creation
window.__onProductCreated = async (product) => {
  // Reload inventory products
  const inv = await getInventario();
  _inventory = inv;
  
  // Select the newly created product
  window.imeiSelectProduct(product.id);
};

function renderTable(lista) {
  if (lista.length === 0) {
    elTable.innerHTML = `<tr><td colspan="6" class="p-4 text-center text-on-surface-variant">No se encontraron equipos</td></tr>`;
    return;
  }

  const user = JSON.parse(localStorage.getItem("adminpro_user") || "{}");
  const isAdmin = user.rol === "Administrador";

  elTable.innerHTML = lista.map(e => {
    const isVendido = e.estado === "Vendido";
    const statusColor = e.estado === "Disponible" ? "bg-green-50 text-green-700 border border-green-100" 
                      : e.estado === "Vendido" ? "bg-slate-50 text-slate-500 border border-slate-100" 
                      : "bg-amber-50 text-amber-700 border border-amber-100";
    
    return `
      <tr class="hover:bg-surface-container-low transition-colors">
        <td class="px-4 py-3">
          <div class="font-mono text-xs font-bold text-on-surface">${e.imei1 || '-'}</div>
          ${e.imei2 ? `<div class="font-mono text-[10px] text-on-surface-variant">${e.imei2}</div>` : ''}
        </td>
        <td class="px-4 py-3">
          <p class="font-black text-sm text-on-surface">${e.nombre || '-'}</p>
          <p class="text-[11px] text-on-surface-variant font-medium">${e.marca || 'N/A'}</p>
        </td>
        <td class="px-4 py-3">
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase ${statusColor}">
            ${e.estado || 'Desconocido'}
          </span>
        </td>
        <td class="px-4 py-3 text-sm text-on-surface-variant hidden md:table-cell">${e.proveedor || '-'}</td>
        <td class="px-4 py-3">
          <p class="text-[11px] text-on-surface-variant line-through hidden md:block">$${new Intl.NumberFormat("es-CO").format(parseInt(String(e.costo || 0).replace(/\D/g, "")) || 0)}</p>
          <p class="text-sm font-black text-primary">$${new Intl.NumberFormat("es-CO").format(parseInt(String(e.venta || 0).replace(/\D/g, "")) || 0)}</p>
        </td>
        <td class="px-4 py-3 text-right">
          <div class="flex items-center justify-end gap-1">
            ${isAdmin ? `<button onclick="window.imeiEdit('${e.imei1}')" class="p-1.5 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-full transition-colors" title="Editar">
              <span class="material-symbols-outlined text-[18px]">edit</span>
            </button>` : ''}
            ${isAdmin ? `<button onclick="window.imeiDelete('${e.imei1}')" class="p-1.5 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-full transition-colors" title="Eliminar">
              <span class="material-symbols-outlined text-[18px]">delete</span>
            </button>` : ''}
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

function setupEvents() {
  const filterData = () => {
    const q = elSearch.value.toLowerCase().trim();
    const st = elFilter.value;
    
    const filtered = _equipos.filter(e => {
      const matchQ = (e.imei1 || "").toLowerCase().includes(q) ||
                     (e.imei2 || "").toLowerCase().includes(q) ||
                     (e.nombre || "").toLowerCase().includes(q);
      const matchS = st ? e.estado === st : true;
      return matchQ && matchS;
    });
    renderTable(filtered);
  };

  // Helper to format numbers
  const formatNumberInput = (e) => {
    let val = e.target.value.replace(/\D/g, "");
    if (!val) {
      e.target.value = "";
      return;
    }
    e.target.value = new Intl.NumberFormat("es-CO").format(parseInt(val, 10));
  };

  elCosto.addEventListener("input", formatNumberInput);
  elVenta.addEventListener("input", formatNumberInput);

  // Toggle dropdown menu
  elDropdownTrigger.addEventListener("click", () => {
    elDropdownMenu.classList.toggle("hidden");
    if (!elDropdownMenu.classList.contains("hidden")) {
      elDropdownSearch.value = "";
      elDropdownSearch.focus();
      renderDropdownOptions();
    }
  });

  // Search filter inside dropdown
  elDropdownSearch.addEventListener("input", (e) => {
    renderDropdownOptions(e.target.value);
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (!elDropdownTrigger.contains(e.target) && !elDropdownMenu.contains(e.target)) {
      elDropdownMenu.classList.add("hidden");
    }
  });

  elSearch.addEventListener("input", filterData);
  if (window.setupCustomSelect) {
    window.setupCustomSelect("imei-filter-status-container", "imei-filter-status", filterData);
    window.setupCustomSelect("imei-estado-container", "imei-estado");
  }

  // Scanner for search
  document.getElementById("imei-scan-btn")?.addEventListener("click", () => {
    openScanner({
      title: "Escanear IMEI",
      filter: /^\d{14,16}$/,
      filterLabel: "IMEI",
      onScan: (code) => {
        elSearch.value = code;
        filterData();
        showToast(`IMEI: ${code}`, "info");
      }
    });
  });

  // Lector de foto de etiqueta con IA (OpenRouter Gemma/Nemotron)
  document.getElementById("imei-label-file")?.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const cardContent = document.getElementById("imei-label-card-content");
    if (!cardContent) return;
    const originalHtml = cardContent.innerHTML;

    // Cambiar UI a estado de carga
    cardContent.innerHTML = `
      <div class="flex flex-col items-center justify-center py-2 text-primary">
        <span class="material-symbols-outlined animate-spin text-[28px] mb-2">progress_activity</span>
        <p class="text-xs font-black text-slate-800">Procesando etiqueta con IA...</p>
        <p class="text-[10px] text-slate-400 mt-0.5">Analizando la imagen en alta resolución</p>
      </div>
    `;

    try {
      // Leer archivo
      const reader = new FileReader();
      const imageSrc = await new Promise((resolve, reject) => {
        reader.onload = (ev) => resolve(ev.target.result);
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
      });

      // Ejecutar análisis con IA
      const result = await analyzeImeiLabel(imageSrc, file.type);
      console.log("[AI IMEI Label Analysis Result]:", result);

      if (!result.success) {
        throw new Error(result.mensaje || "No se pudo analizar la etiqueta");
      }

      const parsed = result.data;
      console.log("[Parsed AI IMEI Data]:", JSON.stringify(parsed, null, 2));

      // Rellenar IMEIs
      if (parsed.imei1) {
        elImei1.value = parsed.imei1;
      }
      if (parsed.imei2) {
        elImei2.value = parsed.imei2;
      }

      // Mensaje de éxito de IMEIs
      if (parsed.imei1 && parsed.imei2) {
        showToast("Se detectaron y cargaron 2 IMEIs con IA ✨", "success");
      } else if (parsed.imei1) {
        showToast("Se detectó y cargó 1 IMEI con IA ✨", "success");
      } else {
        showToast("No se detectaron IMEIs válidos en la foto", "warning");
      }

      // Tratar de emparejar el producto en el inventario local
      let productFound = false;
      if (parsed.name) {
        const normName = parsed.name.toLowerCase().trim();
        // Intentar encontrar el producto más parecido en _inventory
        const bestMatch = _inventory.find(p => {
          const pName = p.nombre.toLowerCase();
          return pName.includes(normName) || normName.includes(pName);
        });

        if (bestMatch) {
          window.imeiSelectProduct(bestMatch.id);
          showToast(`Producto emparejado: ${bestMatch.nombre}`, "success");
          productFound = true;
        }
      }

      if (!productFound && parsed.name) {
        // Si no se encuentra, rellenar campos libres
        if (parsed.brand) elMarca.value = parsed.brand;
        showToast(`Producto no registrado: "${parsed.brand || ''} ${parsed.name}". Regístralo o selecciónalo manualmente.`, "info");
      }

      if (parsed.cost) {
        const costNum = parseInt(String(parsed.cost).replace(/\D/g, ""), 10);
        if (costNum) elCosto.value = new Intl.NumberFormat("es-CO").format(costNum);
      }
      if (parsed.price) {
        const priceNum = parseInt(String(parsed.price).replace(/\D/g, ""), 10);
        if (priceNum) elVenta.value = new Intl.NumberFormat("es-CO").format(priceNum);
      }

    } catch (err) {
      console.error("AI IMEI Label Error:", err);
      showToast("Error al procesar la foto: " + err.message, "error");
    } finally {
      // Restaurar UI del card
      cardContent.innerHTML = originalHtml;
      // Limpiar input file
      e.target.value = "";
    }
  });

  // Scanner for IMEI 1 field inside modal
  document.getElementById("imei-scan-1")?.addEventListener("click", () => {
    openScanner({
      title: "Escanear IMEI 1",
      filter: /^\d{14,16}$/,
      filterLabel: "IMEI",
      onScan: (code, allCodes) => {
        if (allCodes && allCodes.length >= 2) {
          elImei1.value = allCodes[0];
          elImei2.value = allCodes[1];
          showToast(`IMEI 1 y 2 cargados con éxito`, "success");
        } else {
          elImei1.value = code;
          showToast(`IMEI 1: ${code}`, "success");
        }
      }
    });
  });

  // Scanner for IMEI 2 field inside modal
  document.getElementById("imei-scan-2")?.addEventListener("click", () => {
    openScanner({
      title: "Escanear IMEI 2",
      filter: /^\d{14,16}$/,
      filterLabel: "IMEI",
      onScan: (code, allCodes) => {
        if (allCodes && allCodes.length >= 2) {
          elImei1.value = allCodes[0];
          elImei2.value = allCodes[1];
          showToast(`IMEI 1 y 2 cargados con éxito`, "success");
        } else {
          elImei2.value = code;
          showToast(`IMEI 2: ${code}`, "success");
        }
      }
    });
  });

  elBtnNew.addEventListener("click", () => openModal(null));
  elModalClose.addEventListener("click", closeModal);
  elModalBackdrop.addEventListener("click", closeModal);
  
  elBtnSave.addEventListener("click", saveEquipo);

  window.imeiEdit = (imei) => {
    const eq = _equipos.find(e => e.imei1 == imei);
    if (eq) openModal(eq);
  };

  window.imeiDelete = async (imei) => {
    const ok = await showConfirm("Confirmación", `¿Eliminar el equipo con IMEI ${imei}?`);
    if (!ok) return;
    try {
      showToast("Eliminando...", "info");
      const res = await eliminarEquipo(imei);
      if (res && res.success) {
        showToast("Equipo eliminado", "success");
        await loadData();
        filterData();
      } else {
        showToast(res.mensaje || "Error al eliminar", "error");
      }
    } catch (err) {
      showToast("Error: " + err.message, "error");
    }
  };

  // ── EVENTOS CARGA MASIVA ──
  const openBulkModal = () => {
    _scannedImeis = [];
    elBulkNombre.value = "";
    elBulkNombre.removeAttribute("data-id");
    elBulkProveedor.value = "";
    elBulkDropdownSelectedText.innerHTML = "Seleccione el equipo en común...";
    elBulkDropdownSelectedText.classList.add("text-slate-500");
    elBulkResultsContainer.classList.add("hidden");
    elBulkList.innerHTML = "";
    
    elBulkModal.classList.remove("hidden");
    elBulkModal.classList.add("flex");
    validateBulkFormReady();
  };

  const closeBulkModal = () => {
    elBulkModal.classList.add("hidden");
    elBulkModal.classList.remove("flex");
  };

  elBulkBtn?.addEventListener("click", openBulkModal);
  elBulkModalClose?.addEventListener("click", closeBulkModal);
  elBulkCancelBtn?.addEventListener("click", closeBulkModal);
  elBulkModalBackdrop?.addEventListener("click", closeBulkModal);

  elBulkDropdownTrigger?.addEventListener("click", () => {
    elBulkDropdownMenu.classList.toggle("hidden");
    if (!elBulkDropdownMenu.classList.contains("hidden")) {
      elBulkDropdownSearch.value = "";
      elBulkDropdownSearch.focus();
      renderBulkDropdownOptions();
    }
  });

  elBulkDropdownSearch?.addEventListener("input", (e) => {
    renderBulkDropdownOptions(e.target.value);
  });

  elBulkAddRowBtn?.addEventListener("click", () => {
    _scannedImeis.push({ imei1: "", imei2: "", selected: true });
    elBulkResultsContainer.classList.remove("hidden");
    renderBulkImeisList();
  });

  // Evento Carga Foto Lote
  elBulkFile?.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const originalHtml = elBulkCardContent.innerHTML;

    // Loader
    elBulkCardContent.innerHTML = `
      <div class="flex flex-col items-center justify-center py-4 text-primary">
        <span class="material-symbols-outlined animate-spin text-[32px] mb-2">progress_activity</span>
        <p class="text-xs font-black text-slate-800">Procesando lote de IMEIs con IA...</p>
        <p class="text-[10px] text-slate-400 mt-0.5">Analizando imagen y extrayendo números de serie</p>
      </div>
    `;

    try {
      const reader = new FileReader();
      const imageSrc = await new Promise((resolve, reject) => {
        reader.onload = (ev) => resolve(ev.target.result);
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
      });

      const result = await analyzeBulkImeis(imageSrc, file.type);
      console.log("[AI Bulk IMEIs Analysis Result]:", result);

      if (!result.success) {
        throw new Error(result.mensaje || "No se pudieron analizar los IMEIs");
      }

      const rawImeis = result.data.imeis || [];
      const validImeis = rawImeis.map(val => val.replace(/\D/g, "")).filter(val => val.length >= 14 && val.length <= 16);

      if (validImeis.length === 0) {
        showToast("No se encontraron IMEIs de 15 dígitos en la imagen", "warning");
      } else {
        showToast(`La IA detectó ${validImeis.length} IMEIs con éxito ✨`, "success");
        validImeis.forEach(imei => {
          if (!_scannedImeis.some(item => item.imei1 === imei)) {
            _scannedImeis.push({ imei1: imei.substring(0, 15), imei2: "", selected: true });
          }
        });
        
        elBulkResultsContainer.classList.remove("hidden");
        renderBulkImeisList();
      }
    } catch (err) {
      console.error("AI Bulk IMEIs Error:", err);
      showToast("Error al procesar: " + err.message, "error");
    } finally {
      elBulkCardContent.innerHTML = originalHtml;
      e.target.value = "";
    }
  });

  // Guardar Lote
  elBulkSaveBtn?.addEventListener("click", async () => {
    const selectedProdId = elBulkNombre.dataset.id;
    const productNombre = elBulkNombre.value;
    const productMarca = elBulkNombre.dataset.marca || "";
    const costoVal = parseInt(elBulkNombre.dataset.costo) || 0;
    const ventaVal = parseInt(elBulkNombre.dataset.venta) || 0;
    const proveedor = elBulkProveedor.value.trim();

    const selectedImeis = _scannedImeis.filter(item => item.selected && item.imei1.length === 15);
    
    if (selectedImeis.length === 0) {
      showToast("No hay IMEIs válidos de 15 dígitos seleccionados", "warning");
      return;
    }

    if (_isProcessing) return;
    _isProcessing = true;
    elBulkSaveBtn.textContent = "Registrando lote...";
    elBulkSaveBtn.disabled = true;

    try {
      const lote = selectedImeis.map(item => ({
        imei1: item.imei1,
        imei2: item.imei2,
        id_producto: selectedProdId,
        nombre: productNombre,
        marca: productMarca,
        proveedor: proveedor,
        costo: costoVal,
        venta: ventaVal,
        estado: "Disponible"
      }));

      const res = await crearEquiposLote(lote);
      if (res && res.success) {
        showToast(`✅ Se registraron ${lote.length} equipos con éxito`, "success");
        closeBulkModal();
        await loadData();
        renderTable(_equipos);
      } else {
        showToast(res?.mensaje || "Error al registrar lote", "error");
      }
    } catch (err) {
      showToast("Error de conexión: " + err.message, "error");
    } finally {
      _isProcessing = false;
      elBulkSaveBtn.innerHTML = `<span class="material-symbols-outlined text-[18px]">check_circle</span> Registrar Lote`;
      validateBulkFormReady();
    }
  });

  // Click fuera para cerrar dropdowns
  document.addEventListener("click", (e) => {
    if (elDropdownTrigger && !elDropdownTrigger.contains(e.target) && elDropdownMenu && !elDropdownMenu.contains(e.target)) {
      elDropdownMenu.classList.add("hidden");
    }
    if (elBulkDropdownTrigger && !elBulkDropdownTrigger.contains(e.target) && elBulkDropdownMenu && !elBulkDropdownMenu.contains(e.target)) {
      elBulkDropdownMenu.classList.add("hidden");
    }
  });
}

function openModal(obj) {
  elForm.reset();
  if (obj) {
    elOriginal.value = obj.imei1;
    elImei1.value = obj.imei1;
    elImei2.value = obj.imei2 || "";
    elNombre.value = obj.nombre || "";
    elNombre.dataset.id = obj.id_producto || "";
    elMarca.value = obj.marca || "";
    elProv.value = obj.proveedor || "";
    elCosto.value = obj.costo ? new Intl.NumberFormat("es-CO").format(parseInt(String(obj.costo).replace(/\D/g, "")) || 0) : "";
    elVenta.value = obj.venta ? new Intl.NumberFormat("es-CO").format(parseInt(String(obj.venta).replace(/\D/g, "")) || 0) : "";
    elEstado.value = obj.estado || "Disponible";

    // Set dropdown selected label
    const p = _inventory.find(x => x.id === obj.id_producto);
    const imgHtml = p && p.imagen 
      ? `<img src="${p.imagen}" class="w-6 h-6 rounded-md object-cover bg-slate-50" referrerpolicy="no-referrer">`
      : `<span class="material-symbols-outlined text-[16px] text-slate-400">phone_android</span>`;

    elDropdownSelectedText.innerHTML = `
      <div class="flex items-center gap-2">
        ${imgHtml}
        <span class="font-black text-slate-800 text-xs">${obj.nombre || '—'}</span>
        <span class="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold uppercase">${obj.marca || 'Genérico'}</span>
      </div>
    `;
    elDropdownSelectedText.classList.remove("text-slate-500");
    
    document.getElementById("imei-modal-title").textContent = "Editar Equipo";
  } else {
    elOriginal.value = "";
    elImei1.value = "";
    elImei2.value = "";
    elNombre.value = "";
    elNombre.removeAttribute("data-id");
    elMarca.value = "";
    elProv.value = "";
    elCosto.value = "";
    elVenta.value = "";
    elEstado.value = "Disponible";
    
    elDropdownSelectedText.innerHTML = "Seleccione un equipo...";
    elDropdownSelectedText.classList.add("text-slate-500");
    
    document.getElementById("imei-modal-title").textContent = "Registrar Equipo";
  }
  
  if (window.syncCustomSelectUI) {
    window.syncCustomSelectUI("imei-estado-container", elEstado.value);
  }
  
  elModal.classList.remove("hidden");
  elModal.classList.add("flex");
}

function closeModal() {
  elModal.classList.add("hidden");
  elModal.classList.remove("flex");
}

async function saveEquipo() {
  // Custom validation (readonly fields can't use checkValidity with required)
  if (!elImei1.value.trim()) {
    showToast("El IMEI Principal es obligatorio", "warning");
    elImei1.focus();
    return;
  }
  if (!elNombre.value) {
    showToast("Debe seleccionar un equipo del inventario", "warning");
    return;
  }
  
  if (_isProcessing) return;
  _isProcessing = true;
  elBtnSave.textContent = "Guardando...";
  elBtnSave.disabled = true;

  try {
    const idOrig = elOriginal.value;
    const productId = elNombre.dataset.id || "";
    const productNombre = elNombre.value.trim();

    const existingEq = idOrig ? _equipos.find(e => e.imei1 == idOrig) : null;

    const datos = {
      imei1: elImei1.value.trim(),
      imei2: elImei2.value.trim(),
      id_producto: productId,
      nombre: productNombre,
      marca: elMarca.value.trim(),
      proveedor: elProv.value.trim(),
      costo: parseInt(elCosto.value.replace(/\D/g, "")) || 0,
      venta: parseInt(elVenta.value.replace(/\D/g, "")) || 0,
      estado: elEstado.value,
      fecha_ingreso: existingEq ? existingEq.fecha_ingreso : new Date().toISOString()
    };

    let res;
    if (idOrig) {
      res = await actualizarEquipo(idOrig, datos);
    } else {
      res = await crearEquipo(datos);
    }

    if (res && res.success) {
      showToast("Equipo guardado", "success");
      closeModal();
      await loadData();
      renderTable(_equipos);
    } else {
      showToast(res?.mensaje || "Error al guardar", "error");
    }
  } catch (err) {
    showToast("Error de conexión: " + err.message, "error");
  } finally {
    _isProcessing = false;
    elBtnSave.innerHTML = `<span class="material-symbols-outlined text-[18px]">save</span> Guardar`;
    elBtnSave.disabled = false;
  }
}

/**
 * customer-selector.js — Universal Customer Selector Modal
 * Reusable across POS, Credits, Technical Service, etc.
 */
import { getClientes, crearCliente } from "./api.js";
import { showToast } from "./toast.js";

let _clientes = [];
let _isLoaded = false;
let _onSelectCallback = null;
let _currentFilter = "Todos";

// DOM refs
let modal, backdrop, closeBtn, searchInput, scanBtn, newBtn, resultsList, newFormContainer;

export async function initCustomerSelector() {
  ensureDOM();
  if (!_isLoaded) {
    try {
      _clientes = await getClientes();
      _isLoaded = true;
    } catch (e) {
      console.error("Error loading clients for selector", e);
    }
  }
}

function ensureDOM() {
  if (document.getElementById("customer-selector-modal")) return;

  const html = `
    <div id="customer-selector-modal" class="hidden fixed inset-0 z-[70] items-center justify-center p-4">
      <div id="cs-backdrop" class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] flex flex-col overflow-hidden z-10">
        <!-- Header -->
        <div class="flex items-center justify-between px-5 py-4 bg-surface-container-lowest border-b border-surface-variant shrink-0">
          <h3 class="font-bold text-lg text-on-surface">Seleccionar Cliente</h3>
          <button id="cs-close" class="p-1.5 text-on-surface-variant hover:bg-surface-container rounded-lg">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <!-- Search & Filter Area -->
        <div id="cs-search-area" class="p-4 border-b border-surface-variant shrink-0 flex flex-col gap-3">
          <div class="flex gap-2">
            <div class="relative flex-1">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
              <input id="cs-search" type="text" placeholder="Buscar documento, nombre..." autocomplete="off"
                class="w-full bg-surface-container-low border border-surface-variant rounded-xl pl-10 pr-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm" />
            </div>
            <button id="cs-new-btn" title="Nuevo Cliente" class="px-3 bg-primary text-on-primary rounded-xl hover:bg-primary-container transition-colors shadow-sm flex items-center justify-center">
              <span class="material-symbols-outlined text-[20px]">person_add</span>
            </button>
          </div>
          
          <!-- Scrollable M3 Filter Chips -->
          <div class="flex gap-1.5 overflow-x-auto pb-0.5 no-scrollbar scroll-smooth" style="scrollbar-width: none; -ms-overflow-style: none;">
            <button type="button" data-filter="Todos" class="cs-filter-chip shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border border-primary bg-primary text-on-primary shadow-sm flex items-center gap-1">
              <span class="material-symbols-outlined text-[14px]">checklist</span>
              <span>Todos</span>
            </button>
            <button type="button" data-filter="General" class="cs-filter-chip shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border border-surface-variant bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface flex items-center gap-1">
              <span class="material-symbols-outlined text-[14px]">person</span>
              <span>General</span>
            </button>
            <button type="button" data-filter="VIP" class="cs-filter-chip shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border border-surface-variant bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface flex items-center gap-1">
              <span class="material-symbols-outlined text-[14px]">star</span>
              <span>VIP</span>
            </button>
            <button type="button" data-filter="Empresa" class="cs-filter-chip shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border border-surface-variant bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface flex items-center gap-1">
              <span class="material-symbols-outlined text-[14px]">domain</span>
              <span>Empresa</span>
            </button>
            <button type="button" data-filter="Mayorista" class="cs-filter-chip shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border border-surface-variant bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface flex items-center gap-1">
              <span class="material-symbols-outlined text-[14px]">storefront</span>
              <span>Mayorista</span>
            </button>
          </div>
        </div>

        <!-- New Client Form (Hidden by default) -->
        <div id="cs-new-form-area" class="hidden p-4 border-b border-surface-variant bg-surface-container-lowest shrink-0">
          <p class="text-xs font-bold text-primary mb-3 uppercase tracking-wider">Crear Cliente Rápido</p>
          <div class="space-y-3">
             <div>
                <input id="cs-new-doc" type="text" placeholder="Documento *" class="w-full bg-surface-container-low border border-surface-variant rounded-lg px-3 py-2 text-sm text-on-surface focus:border-primary outline-none" />
             </div>
             <div>
                <input id="cs-new-nom" type="text" placeholder="Nombre completo *" class="w-full bg-surface-container-low border border-surface-variant rounded-lg px-3 py-2 text-sm text-on-surface focus:border-primary outline-none" />
             </div>
             <div class="grid grid-cols-2 gap-2">
                <input id="cs-new-tel" type="text" placeholder="Teléfono" class="w-full bg-surface-container-low border border-surface-variant rounded-lg px-3 py-2 text-sm text-on-surface focus:border-primary outline-none" />
                <input id="cs-new-email" type="email" placeholder="Email" class="w-full bg-surface-container-low border border-surface-variant rounded-lg px-3 py-2 text-sm text-on-surface focus:border-primary outline-none" />
             </div>
             <div>
                <input id="cs-new-dir" type="text" placeholder="Dirección" class="w-full bg-surface-container-low border border-surface-variant rounded-lg px-3 py-2 text-sm text-on-surface focus:border-primary outline-none" />
             </div>
             <div class="flex gap-2 items-center">
                <div id="cs-new-tipo-container" class="custom-select-container relative flex-1">
                  <input type="hidden" id="cs-new-tipo" value="General" />
                  <button type="button" class="custom-select-trigger w-full bg-surface-container border border-surface-variant rounded-lg px-3 py-2 text-sm font-semibold text-on-surface focus:outline-none focus:border-primary flex items-center justify-between shadow-sm active:scale-[0.99] transition-all">
                    <div class="flex items-center gap-2">
                      <span class="material-symbols-outlined text-[18px] text-slate-500">person</span>
                      <span class="selected-label">General</span>
                    </div>
                    <span class="material-symbols-outlined text-[18px] text-slate-400">keyboard_arrow_down</span>
                  </button>
                  <div class="custom-select-options hidden absolute left-0 right-0 bottom-full mb-1 bg-surface-container-high border border-surface-variant rounded-xl shadow-2xl z-50 overflow-hidden py-1">
                    <div data-value="General" class="custom-option px-4 py-2.5 text-sm font-semibold text-on-surface hover:bg-surface-variant/20 flex items-center gap-3 cursor-pointer transition-colors">
                      <span class="material-symbols-outlined text-[18px] text-slate-400">person</span>
                      <span class="flex-1">General</span>
                      <span class="material-symbols-outlined text-[16px] text-primary check-icon">check_circle</span>
                    </div>
                    <div data-value="VIP" class="custom-option px-4 py-2.5 text-sm font-semibold text-on-surface hover:bg-surface-variant/20 flex items-center gap-3 cursor-pointer transition-colors">
                      <span class="material-symbols-outlined text-[18px] text-slate-400">star</span>
                      <span class="flex-1">VIP</span>
                      <span class="material-symbols-outlined text-[16px] text-primary check-icon hidden">check_circle</span>
                    </div>
                    <div data-value="Empresa" class="custom-option px-4 py-2.5 text-sm font-semibold text-on-surface hover:bg-surface-variant/20 flex items-center gap-3 cursor-pointer transition-colors">
                      <span class="material-symbols-outlined text-[18px] text-slate-400">business</span>
                      <span class="flex-1">Empresa</span>
                      <span class="material-symbols-outlined text-[16px] text-primary check-icon hidden">check_circle</span>
                    </div>
                    <div data-value="Mayorista" class="custom-option px-4 py-2.5 text-sm font-semibold text-on-surface hover:bg-surface-variant/20 flex items-center gap-3 cursor-pointer transition-colors">
                      <span class="material-symbols-outlined text-[18px] text-slate-400">store</span>
                      <span class="flex-1">Mayorista</span>
                      <span class="material-symbols-outlined text-[16px] text-primary check-icon hidden">check_circle</span>
                    </div>
                  </div>
                </div>
                <button id="cs-save-new" class="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-container whitespace-nowrap self-stretch">Guardar</button>
                <button id="cs-cancel-new" class="px-3 bg-surface-variant text-on-surface text-sm rounded-lg hover:bg-surface-container-high self-stretch">x</button>
             </div>
          </div>
        </div>

        <!-- Results List -->
        <div class="flex-1 overflow-y-auto p-2 bg-surface-container-lowest">
          <ul id="cs-results" class="divide-y divide-surface-variant/40">
            <li class="p-4 text-center text-sm text-on-surface-variant">Escribe para buscar o crea uno nuevo</li>
          </ul>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", html);

  modal = document.getElementById("customer-selector-modal");
  backdrop = document.getElementById("cs-backdrop");
  closeBtn = document.getElementById("cs-close");
  searchInput = document.getElementById("cs-search");
  newBtn = document.getElementById("cs-new-btn");
  resultsList = document.getElementById("cs-results");
  newFormContainer = document.getElementById("cs-new-form-area");

  // Events
  closeBtn.addEventListener("click", closeSelector);
  backdrop.addEventListener("click", closeSelector);
  
  searchInput.addEventListener("input", handleSearch);

  newBtn.addEventListener("click", () => {
    newFormContainer.classList.toggle("hidden");
    document.getElementById("cs-new-doc").focus();
  });

  document.getElementById("cs-cancel-new").addEventListener("click", () => {
    newFormContainer.classList.add("hidden");
  });

  // Filter Chip Events
  document.querySelectorAll(".cs-filter-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      const filter = chip.dataset.filter;
      _currentFilter = filter;
      
      // Update UI active chip
      document.querySelectorAll(".cs-filter-chip").forEach(c => {
        if (c.dataset.filter === filter) {
          c.classList.remove("bg-surface-container-low", "text-on-surface-variant", "hover:bg-surface-container-high", "hover:text-on-surface");
          c.classList.add("bg-primary", "text-on-primary", "border-primary");
        } else {
          c.classList.add("bg-surface-container-low", "text-on-surface-variant", "hover:bg-surface-container-high", "hover:text-on-surface");
          c.classList.remove("bg-primary", "text-on-primary", "border-primary");
        }
      });
      
      filterAndRenderClients();
    });
  });

  document.getElementById("cs-save-new").addEventListener("click", async () => {
    const doc = document.getElementById("cs-new-doc").value.trim();
    const nom = document.getElementById("cs-new-nom").value.trim();
    const tel = document.getElementById("cs-new-tel").value.trim();
    const email = document.getElementById("cs-new-email").value.trim();
    const dir = document.getElementById("cs-new-dir").value.trim();
    const tipo = document.getElementById("cs-new-tipo").value;
    
    if (!doc || !nom) {
      showToast("Documento y Nombre son obligatorios", "warning");
      return;
    }

    const btn = document.getElementById("cs-save-new");
    btn.disabled = true;
    btn.textContent = "...";

    try {
      const res = await crearCliente({ documento: doc, cedula: doc, nombre: nom, telefono: tel, direccion: dir, email: email, tipo: tipo });
      if (res && res.success) {
        showToast("Cliente creado", "success");
        // Update local list
        const newClient = { cedula: doc, documento: doc, nombre: nom, telefono: tel, direccion: dir, email: email, tipo: tipo, id: doc };
        _clientes.push(newClient);
        
        // Hide form and select it
        newFormContainer.classList.add("hidden");
        document.getElementById("cs-new-doc").value = "";
        document.getElementById("cs-new-nom").value = "";
        document.getElementById("cs-new-tel").value = "";
        document.getElementById("cs-new-email").value = "";
        document.getElementById("cs-new-dir").value = "";
        document.getElementById("cs-new-tipo").value = "General";
        window.syncCustomSelectUI("cs-new-tipo-container", "General");
        
        selectClient(newClient);
      } else {
        showToast(res.mensaje || "Error al crear", "error");
      }
    } catch (err) {
      showToast("Error de conexión", "error");
    } finally {
      btn.disabled = false;
      btn.textContent = "Guardar";
    }
  });

  // Inicializar selector personalizado
  window.setupCustomSelect("cs-new-tipo-container", "cs-new-tipo");
}

function handleSearch() {
  filterAndRenderClients();
}

function filterAndRenderClients() {
  const term = searchInput.value.toLowerCase().trim();
  
  let filtered = _clientes;
  
  // Filter by type
  if (_currentFilter !== "Todos") {
    filtered = filtered.filter(c => (c.tipo || "General") === _currentFilter);
  }
  
  // Filter by search text
  if (term) {
    filtered = filtered.filter(c => {
      const doc = c.cedula || c.documento || "";
      return doc.toLowerCase().includes(term) ||
             (c.nombre && c.nombre.toLowerCase().includes(term)) ||
             (c.telefono && c.telefono.toLowerCase().includes(term));
    });
  }
  
  // Render results
  if (filtered.length === 0) {
    resultsList.innerHTML = `<li class="p-4 text-center text-sm text-on-surface-variant">No se encontraron clientes.</li>`;
    return;
  }
  
  // If no search term and no type filter, show recent (last 20)
  if (!term && _currentFilter === "Todos") {
    const recent = [...filtered].reverse().slice(0, 20);
    renderResults(recent);
  } else {
    // Show first 20 matching
    renderResults(filtered.slice(0, 20));
  }
}

function renderResults(list) {
  resultsList.innerHTML = list.map(c => {
    const doc = c.cedula || c.documento || "";
    const tipo = c.tipo || "General";
    
    // Choose icon, badge style and colors based on client type
    let avatarIcon = "person";
    let avatarBg = "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";
    let badgeClass = "bg-slate-100 text-slate-700 border-slate-200";
    
    if (tipo === "VIP") {
      avatarIcon = "star";
      avatarBg = "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300";
      badgeClass = "bg-purple-50 text-purple-700 border-purple-200";
    } else if (tipo === "Empresa") {
      avatarIcon = "domain";
      avatarBg = "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300";
      badgeClass = "bg-indigo-50 text-indigo-700 border-indigo-200";
    } else if (tipo === "Mayorista") {
      avatarIcon = "storefront";
      avatarBg = "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
      badgeClass = "bg-green-50 text-green-700 border-green-200";
    }

    return `
    <li>
      <button type="button" class="cs-item-btn w-full text-left px-4 py-3 hover:bg-surface-container-low transition-colors flex items-center gap-3 focus:bg-surface-container-low outline-none" data-doc="${doc}">
        <!-- Avatar/Icon -->
        <div class="w-9 h-9 rounded-full ${avatarBg} flex items-center justify-center shrink-0">
          <span class="material-symbols-outlined text-[20px]">${avatarIcon}</span>
        </div>
        
        <!-- Info -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between gap-2">
            <span class="font-bold text-sm text-on-surface truncate">${c.nombre}</span>
            <!-- Badge -->
            <span class="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${badgeClass} shrink-0">${tipo}</span>
          </div>
          <span class="text-[11px] text-on-surface-variant mt-0.5 block truncate">C.C: ${doc} ${c.telefono ? '• Tel: ' + c.telefono : ''}</span>
        </div>
      </button>
    </li>
  `;
  }).join("");

  document.querySelectorAll(".cs-item-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const doc = btn.dataset.doc;
      const client = _clientes.find(c => (c.cedula || c.documento || "") === doc);
      if (client) {
        client.documento = doc;
        selectClient(client);
      }
    });
  });
}

function selectClient(client) {
  if (_onSelectCallback) {
    _onSelectCallback(client);
  }
  closeSelector();
}

export async function openCustomerSelector(onSelect) {
  await initCustomerSelector(); // ensure data is loaded
  _onSelectCallback = onSelect;
  searchInput.value = "";
  
  // Reset filter to Todos on open
  _currentFilter = "Todos";
  
  // Reset UI filter chips active state
  document.querySelectorAll(".cs-filter-chip").forEach(c => {
    if (c.dataset.filter === "Todos") {
      c.classList.remove("bg-surface-container-low", "text-on-surface-variant", "hover:bg-surface-container-high", "hover:text-on-surface");
      c.classList.add("bg-primary", "text-on-primary", "border-primary");
    } else {
      c.classList.add("bg-surface-container-low", "text-on-surface-variant", "hover:bg-surface-container-high", "hover:text-on-surface");
      c.classList.remove("bg-primary", "text-on-primary", "border-primary");
    }
  });

  filterAndRenderClients();
  
  newFormContainer.classList.add("hidden");
  
  modal.classList.remove("hidden");
  modal.classList.add("flex");
  
  setTimeout(() => searchInput.focus(), 100);
}

function closeSelector() {
  modal.classList.add("hidden");
  modal.classList.remove("flex");
  _onSelectCallback = null;
}

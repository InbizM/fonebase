import { getValesFisicos, crearValeFisico, cambiarEstadoVale, eliminarValeFisico, procesarValeOcrConQwen, compressImage } from "../api.js";
import { showToast, showConfirm } from "../toast.js";

let _vales = [];
let _filtros = { busqueda: "", estado: "Todos" };

export async function initValesFisicos() {
  const container = document.querySelector('[data-view="vales_fisicos"]');
  if (!container) return;

  container.innerHTML = `
    <div class="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <!-- HEADER & ACCIONES -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            📸 Vales / Memos Físicos
          </h1>
          <p class="text-sm text-gray-500 dark:text-gray-400">Escanea vales impresos o manuscritos con IA Qwen para digitalizarlos automáticamente</p>
        </div>
        <button id="btn-nuevo-vale" class="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          Nuevo Vale Físico
        </button>
      </div>

      <!-- DASHBOARD RESUMEN -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 rounded-xl p-4 flex items-center gap-4">
          <div class="p-3 bg-amber-500/10 text-amber-600 rounded-lg">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <div>
            <p class="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider">Total Pendiente (Por Cobrar)</p>
            <h3 id="vales-stat-monto-pendiente" class="text-2xl font-bold text-amber-900 dark:text-amber-300">$0</h3>
          </div>
        </div>

        <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/40 rounded-xl p-4 flex items-center gap-4">
          <div class="p-3 bg-blue-500/10 text-blue-600 rounded-lg">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          </div>
          <div>
            <p class="text-xs font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wider">Vales Pendientes</p>
            <h3 id="vales-stat-count-pendiente" class="text-2xl font-bold text-blue-900 dark:text-blue-300">0</h3>
          </div>
        </div>

        <div class="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/40 rounded-xl p-4 flex items-center gap-4">
          <div class="p-3 bg-emerald-500/10 text-emerald-600 rounded-lg">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <div>
            <p class="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Total Cobrado</p>
            <h3 id="vales-stat-cobrado" class="text-2xl font-bold text-emerald-900 dark:text-emerald-300">$0</h3>
          </div>
        </div>
      </div>

      <!-- FILTROS Y BÚSQUEDA -->
      <div class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4 justify-between">
        <div class="relative flex-1">
          <input type="text" id="vales-search" placeholder="Buscar por cliente o producto..." class="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white">
          <svg class="w-4 h-4 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        </div>
        <div class="flex gap-2">
          <button data-filter-estado="Todos" class="vale-filter-btn px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white">Todos</button>
          <button data-filter-estado="Pendiente" class="vale-filter-btn px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">Pendientes</button>
          <button data-filter-estado="Pagado" class="vale-filter-btn px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">Pagados</button>
        </div>
      </div>

      <!-- LISTA DE VALES -->
      <div id="vales-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <!-- Render dinámico -->
      </div>
    </div>

    <!-- MODAL NUEVO VALE CON IA QWEN -->
    <div id="modal-vale" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 hidden">
      <div class="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full p-6 shadow-xl border border-gray-100 dark:border-gray-700 space-y-4 max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-3">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            📸 Digitalizar Vale con IA Qwen 3.7
          </h3>
          <button id="close-modal-vale" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <form id="form-vale" class="space-y-4">
          <!-- AREA FOTO / OCR -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Foto del Vale Físico</label>
            <div id="vale-photo-dropzone" class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4 text-center cursor-pointer hover:border-indigo-500 transition-colors bg-gray-50 dark:bg-gray-700/50">
              <input type="file" id="vale-file-input" accept="image/*" capture="environment" class="hidden">
              <div id="vale-photo-placeholder" class="space-y-2">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                <p class="text-sm font-medium text-indigo-600 dark:text-indigo-400">Haz clic aquí para tomar foto del vale</p>
                <p class="text-xs text-gray-400">O selecciona una imagen de la galería</p>
              </div>
              <img id="vale-photo-preview" class="hidden max-h-48 mx-auto rounded-lg shadow-sm object-contain">
            </div>
            
            <button type="button" id="btn-scan-qwen" class="hidden w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg text-sm flex items-center justify-center gap-2 transition-all">
              <span>✨ Escanear y Extraer Datos con Qwen AI</span>
            </button>
          </div>

          <!-- DATOS FORMULARIO -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Cliente / Persona</label>
              <input type="text" id="vale-cliente" required class="w-full mt-1 p-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white" placeholder="Ej. Pedro Gómez">
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Fecha</label>
              <input type="date" id="vale-fecha" required class="w-full mt-1 p-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white">
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Producto / Detalle de lo que se llevó</label>
            <input type="text" id="vale-producto" required class="w-full mt-1 p-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white" placeholder="Ej. Pantalla iPhone 11 + Templado">
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Cantidad</label>
              <input type="number" id="vale-cantidad" value="1" min="1" required class="w-full mt-1 p-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white">
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Monto Total ($)</label>
              <input type="number" id="vale-monto" value="0" min="0" required class="w-full mt-1 p-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white" placeholder="50000">
            </div>
          </div>

          <div class="pt-2 flex gap-3">
            <button type="button" id="btn-cancelar-vale" class="w-1/2 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700">Cancelar</button>
            <button type="submit" id="btn-guardar-vale" class="w-1/2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium shadow-sm flex items-center justify-center gap-2">Guardar Vale</button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL FOTO GRANDE -->
    <div id="modal-foto-vale" class="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 hidden">
      <div class="relative max-w-3xl w-full">
        <button id="close-modal-foto" class="absolute -top-10 right-0 text-white hover:text-gray-300">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
        <img id="img-vale-full" class="w-full max-h-[85vh] object-contain rounded-lg">
      </div>
    </div>
  `;

  await cargarVales();
  setupEventListeners();
}

async function cargarVales() {
  try {
    _vales = await getValesFisicos();
    renderStats();
    renderVales();
  } catch (err) {
    showToast("Error al cargar los vales físicos", "error");
    console.error(err);
  }
}

function renderStats() {
  const pendientes = _vales.filter(v => v.estado === 'Pendiente');
  const pagados = _vales.filter(v => v.estado === 'Pagado');

  const totalPendiente = pendientes.reduce((acc, v) => acc + (Number(v.monto) || 0), 0);
  const totalCobrado = pagados.reduce((acc, v) => acc + (Number(v.monto) || 0), 0);

  document.getElementById("vales-stat-monto-pendiente").innerText = `$${totalPendiente.toLocaleString("es-CO")}`;
  document.getElementById("vales-stat-count-pendiente").innerText = pendientes.length;
  document.getElementById("vales-stat-cobrado").innerText = `$${totalCobrado.toLocaleString("es-CO")}`;
}

function renderVales() {
  const container = document.getElementById("vales-container");
  if (!container) return;

  const q = _filtros.busqueda.toLowerCase();
  const valesFiltrados = _vales.filter(v => {
    const matchSearch = (v.cliente || "").toLowerCase().includes(q) || (v.producto || "").toLowerCase().includes(q);
    const matchEstado = _filtros.estado === "Todos" || v.estado === _filtros.estado;
    return matchSearch && matchEstado;
  });

  if (valesFiltrados.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-12 text-center text-gray-400 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
        <svg class="mx-auto h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
        <p class="mt-2 text-sm">No se encontraron vales físicos</p>
      </div>
    `;
    return;
  }

  container.innerHTML = valesFiltrados.map(v => {
    const esPendiente = v.estado === 'Pendiente';
    const badgeColor = esPendiente ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
    
    return `
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
        <div>
          <!-- IMAGEN HEADER -->
          ${v.foto_base64 ? `
            <div class="relative h-40 bg-gray-100 dark:bg-gray-700 cursor-pointer overflow-hidden group btn-ver-foto" data-img="${v.foto_base64}">
              <img src="${v.foto_base64}" class="w-full h-full object-cover group-hover:scale-105 transition-transform">
              <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-semibold transition-opacity">
                🔍 Ver Foto Completa
              </div>
            </div>
          ` : `
            <div class="h-20 bg-gray-50 dark:bg-gray-700/50 flex items-center justify-center text-gray-400 text-xs italic border-b border-gray-100 dark:border-gray-700">
              Sin foto adjunta
            </div>
          `}

          <div class="p-4 space-y-3">
            <div class="flex justify-between items-start">
              <div>
                <h4 class="font-bold text-gray-900 dark:text-white text-base">${v.cliente}</h4>
                <p class="text-xs text-gray-500 dark:text-gray-400">📅 ${v.fecha || 'Sin fecha'}</p>
              </div>
              <span class="px-2.5 py-1 text-xs font-semibold rounded-full ${badgeColor}">
                ${v.estado}
              </span>
            </div>

            <div class="bg-gray-50 dark:bg-gray-700/50 p-2.5 rounded-lg border border-gray-100 dark:border-gray-600/50">
              <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">Producto / Detalle:</p>
              <p class="text-sm font-semibold text-gray-800 dark:text-gray-200 mt-0.5">${v.cantidad > 1 ? `(${v.cantidad}x) ` : ''}${v.producto}</p>
            </div>
          </div>
        </div>

        <div class="p-4 pt-0 space-y-3">
          <div class="flex justify-between items-baseline pt-2 border-t border-gray-100 dark:border-gray-700">
            <span class="text-xs font-semibold text-gray-500 dark:text-gray-400">Monto Total:</span>
            <span class="text-lg font-extrabold text-indigo-600 dark:text-indigo-400">$${(Number(v.monto) || 0).toLocaleString("es-CO")}</span>
          </div>

          <div class="flex gap-2">
            ${esPendiente ? `
              <button class="btn-cambiar-estado flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors" data-id="${v.id}" data-estado="Pagado">
                ✓ Marcar Pagado
              </button>
            ` : `
              <button class="btn-cambiar-estado flex-1 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold transition-colors" data-id="${v.id}" data-estado="Pendiente">
                ↩ Reabrir Vale
              </button>
            `}
            <button class="btn-eliminar-vale p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" data-id="${v.id}">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join("");

  // Attach dynamic handlers
  document.querySelectorAll(".btn-ver-foto").forEach(el => {
    el.addEventListener("click", () => {
      document.getElementById("img-vale-full").src = el.dataset.img;
      document.getElementById("modal-foto-vale").classList.remove("hidden");
    });
  });

  document.querySelectorAll(".btn-cambiar-estado").forEach(el => {
    el.addEventListener("click", async () => {
      await cambiarEstadoVale(el.dataset.id, el.dataset.estado);
      showToast(`Vale actualizado a ${el.dataset.estado}`, "success");
      await cargarVales();
    });
  });

  document.querySelectorAll(".btn-eliminar-vale").forEach(el => {
    el.addEventListener("click", async () => {
      if (await showConfirm("¿Estás seguro de eliminar este vale físico?")) {
        await eliminarValeFisico(el.dataset.id);
        showToast("Vale eliminado correctamente", "info");
        await cargarVales();
      }
    });
  });
}

function setupEventListeners() {
  const modalVale = document.getElementById("modal-vale");
  const modalFoto = document.getElementById("modal-foto-vale");
  const fileInput = document.getElementById("vale-file-input");
  const dropzone = document.getElementById("vale-photo-dropzone");
  const preview = document.getElementById("vale-photo-preview");
  const placeholder = document.getElementById("vale-photo-placeholder");
  const btnScanQwen = document.getElementById("btn-scan-qwen");

  let currentPhotoBase64 = "";

  document.getElementById("btn-nuevo-vale").addEventListener("click", () => {
    document.getElementById("form-vale").reset();
    document.getElementById("vale-fecha").value = new Date().toISOString().split('T')[0];
    currentPhotoBase64 = "";
    preview.src = "";
    preview.classList.add("hidden");
    placeholder.classList.remove("hidden");
    btnScanQwen.classList.add("hidden");
    modalVale.classList.remove("hidden");
  });

  document.getElementById("close-modal-vale").addEventListener("click", () => modalVale.classList.add("hidden"));
  document.getElementById("btn-cancelar-vale").addEventListener("click", () => modalVale.classList.add("hidden"));
  document.getElementById("close-modal-foto").addEventListener("click", () => modalFoto.classList.add("hidden"));

  // Dropzone / Photo Upload
  dropzone.addEventListener("click", () => fileInput.click());

  fileInput.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const rawBase64 = evt.target.result;
      currentPhotoBase64 = await compressImage(rawBase64, 1024, 1024, 0.8);
      preview.src = currentPhotoBase64;
      preview.classList.remove("hidden");
      placeholder.classList.add("hidden");
      btnScanQwen.classList.remove("hidden");
    };
    reader.readAsDataURL(file);
  });

  // IA Qwen Scan Button
  btnScanQwen.addEventListener("click", async () => {
    if (!currentPhotoBase64) return;

    btnScanQwen.disabled = true;
    btnScanQwen.innerHTML = `<span>⏳ Procesando con IA Qwen...</span>`;

    try {
      const data = await procesarValeOcrConQwen(currentPhotoBase64);
      if (data.cliente) document.getElementById("vale-cliente").value = data.cliente;
      if (data.producto) document.getElementById("vale-producto").value = data.producto;
      if (data.cantidad) document.getElementById("vale-cantidad").value = data.cantidad;
      if (data.monto) document.getElementById("vale-monto").value = data.monto;
      if (data.fecha) document.getElementById("vale-fecha").value = data.fecha;

      showToast("¡Datos extraídos con éxito por Qwen AI!", "success");
    } catch (err) {
      console.error(err);
      showToast("Error procesando vale con Qwen AI", "error");
    } finally {
      btnScanQwen.disabled = false;
      btnScanQwen.innerHTML = `<span>✨ Escanear y Extraer Datos con Qwen AI</span>`;
    }
  });

  // Guardar Vale
  document.getElementById("form-vale").addEventListener("submit", async (e) => {
    e.preventDefault();

    const v = {
      cliente: document.getElementById("vale-cliente").value,
      fecha: document.getElementById("vale-fecha").value,
      producto: document.getElementById("vale-producto").value,
      cantidad: Number(document.getElementById("vale-cantidad").value) || 1,
      monto: Number(document.getElementById("vale-monto").value) || 0,
      estado: "Pendiente",
      foto_base64: currentPhotoBase64
    };

    try {
      await crearValeFisico(v);
      showToast("Vale físico registrado correctamente", "success");
      modalVale.classList.add("hidden");
      await cargarVales();
    } catch (err) {
      console.error(err);
      showToast("Error al guardar el vale físico", "error");
    }
  });

  // Search & Filter Listeners
  document.getElementById("vales-search").addEventListener("input", (e) => {
    _filtros.busqueda = e.target.value;
    renderVales();
  });

  document.querySelectorAll(".vale-filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".vale-filter-btn").forEach(b => {
        b.classList.remove("bg-indigo-600", "text-white");
        b.classList.add("bg-gray-100", "dark:bg-gray-700", "text-gray-700", "dark:text-gray-300");
      });
      btn.classList.remove("bg-gray-100", "dark:bg-gray-700", "text-gray-700", "dark:text-gray-300");
      btn.classList.add("bg-indigo-600", "text-white");

      _filtros.estado = btn.dataset.filterEstado;
      renderVales();
    });
  });
}

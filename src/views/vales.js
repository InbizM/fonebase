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
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-surface-variant">
        <div>
          <h1 class="text-2xl font-bold text-on-surface flex items-center gap-2">
            <span class="material-symbols-outlined text-primary text-3xl">photo_camera</span> Vales / Memos Físicos
          </h1>
          <p class="text-sm text-on-surface-variant mt-1">Digitaliza e identifica vales de papel o notas manuscritas con extracción inteligente por IA</p>
        </div>
        <button id="btn-nuevo-vale" class="w-full sm:w-auto px-5 py-2.5 bg-primary text-on-primary font-semibold rounded-xl shadow-md hover:bg-primary/90 flex items-center justify-center gap-2 transition-all">
          <span class="material-symbols-outlined text-[20px]">add_a_photo</span>
          Nuevo Vale Físico
        </button>
      </div>

      <!-- DASHBOARD RESUMEN -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 flex items-center gap-4">
          <div class="p-3 bg-amber-500/20 text-amber-600 rounded-xl">
            <span class="material-symbols-outlined text-3xl">payments</span>
          </div>
          <div>
            <p class="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Total Pendiente (Por Cobrar)</p>
            <h3 id="vales-stat-monto-pendiente" class="text-2xl font-black text-amber-700 dark:text-amber-300">$0</h3>
          </div>
        </div>

        <div class="bg-sky-500/10 border border-sky-500/30 rounded-2xl p-5 flex items-center gap-4">
          <div class="p-3 bg-sky-500/20 text-sky-600 rounded-xl">
            <span class="material-symbols-outlined text-3xl">description</span>
          </div>
          <div>
            <p class="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">Vales Pendientes</p>
            <h3 id="vales-stat-count-pendiente" class="text-2xl font-black text-sky-700 dark:text-sky-300">0</h3>
          </div>
        </div>

        <div class="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5 flex items-center gap-4">
          <div class="p-3 bg-emerald-500/20 text-emerald-600 rounded-xl">
            <span class="material-symbols-outlined text-3xl">check_circle</span>
          </div>
          <div>
            <p class="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Total Cobrado</p>
            <h3 id="vales-stat-cobrado" class="text-2xl font-black text-emerald-700 dark:text-emerald-300">$0</h3>
          </div>
        </div>
      </div>

      <!-- FILTROS Y BÚSQUEDA -->
      <div class="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-surface-variant flex flex-col md:flex-row gap-4 justify-between">
        <div class="relative flex-1">
          <input type="text" id="vales-search" placeholder="Buscar por cliente o producto..." class="w-full pl-10 pr-4 py-2.5 bg-surface-container border border-surface-variant rounded-xl text-sm focus:ring-2 focus:ring-primary focus:outline-none text-on-surface">
          <span class="material-symbols-outlined text-on-surface-variant text-[20px] absolute left-3 top-3">search</span>
        </div>
        <div class="flex gap-2">
          <button data-filter-estado="Todos" class="vale-filter-btn px-4 py-2 text-sm font-semibold rounded-xl bg-primary text-on-primary">Todos</button>
          <button data-filter-estado="Pendiente" class="vale-filter-btn px-4 py-2 text-sm font-semibold rounded-xl bg-surface-container text-on-surface-variant hover:text-on-surface">Pendientes</button>
          <button data-filter-estado="Pagado" class="vale-filter-btn px-4 py-2 text-sm font-semibold rounded-xl bg-surface-container text-on-surface-variant hover:text-on-surface">Pagados</button>
        </div>
      </div>

      <!-- LISTA DE VALES -->
      <div id="vales-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <!-- Render dinámico -->
      </div>
    </div>

    <!-- MODAL NUEVO VALE -->
    <div id="modal-vale" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 hidden">
      <div class="bg-surface-container-lowest rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-surface-variant space-y-4 max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center border-b border-surface-variant pb-3">
          <h3 class="text-lg font-bold text-on-surface flex items-center gap-2">
            <span class="material-symbols-outlined text-primary">auto_awesome</span> Digitalizar Vale Físico
          </h3>
          <button id="close-modal-vale" class="text-on-surface-variant hover:text-on-surface">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <form id="form-vale" class="space-y-4">
          <!-- AREA FOTO / OCR -->
          <div class="space-y-2">
            <label class="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">Foto del Vale Físico</label>
            <div id="vale-photo-dropzone" class="border-2 border-dashed border-surface-variant rounded-2xl p-5 text-center cursor-pointer hover:border-primary transition-colors bg-surface-container/40">
              <input type="file" id="vale-file-input" accept="image/*" class="hidden">
              <div id="vale-photo-placeholder" class="space-y-2">
                <span class="material-symbols-outlined text-4xl text-on-surface-variant">add_a_photo</span>
                <p class="text-sm font-semibold text-primary">Haz clic para tomar foto o seleccionar imagen</p>
                <p class="text-xs text-on-surface-variant/70">Asegúrate de que el texto sea legible</p>
              </div>
              <img id="vale-photo-preview" class="hidden max-h-48 mx-auto rounded-xl shadow-md object-contain">
            </div>
            
            <button type="button" id="btn-scan-qwen" class="hidden w-full py-2.5 bg-primary text-on-primary font-semibold rounded-xl text-sm flex items-center justify-center gap-2 shadow-md transition-all">
              <span class="material-symbols-outlined text-[20px]">auto_awesome</span>
              <span>Extraer Datos con IA</span>
            </button>
          </div>

          <!-- DATOS FORMULARIO -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">Cliente / Persona</label>
              <input type="text" id="vale-cliente" required class="w-full mt-1 p-3 bg-surface-container border border-surface-variant rounded-xl text-sm focus:ring-2 focus:ring-primary text-on-surface" placeholder="Ej. Pedro Gómez">
            </div>

            <div>
              <label class="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">Fecha</label>
              <input type="date" id="vale-fecha" required class="w-full mt-1 p-3 bg-surface-container border border-surface-variant rounded-xl text-sm focus:ring-2 focus:ring-primary text-on-surface">
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">Producto / Detalle de lo que se llevó</label>
            <input type="text" id="vale-producto" required class="w-full mt-1 p-3 bg-surface-container border border-surface-variant rounded-xl text-sm focus:ring-2 focus:ring-primary text-on-surface" placeholder="Ej. Pantalla iPhone 11 + Templado">
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">Cantidad</label>
              <input type="number" id="vale-cantidad" value="1" min="1" required class="w-full mt-1 p-3 bg-surface-container border border-surface-variant rounded-xl text-sm focus:ring-2 focus:ring-primary text-on-surface">
            </div>

            <div>
              <label class="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">Monto Total ($)</label>
              <input type="number" id="vale-monto" value="0" min="0" required class="w-full mt-1 p-3 bg-surface-container border border-surface-variant rounded-xl text-sm focus:ring-2 focus:ring-primary text-on-surface" placeholder="50000">
            </div>
          </div>

          <div class="pt-2 flex gap-3">
            <button type="button" id="btn-cancelar-vale" class="w-1/2 py-3 border border-surface-variant text-on-surface rounded-xl text-sm font-semibold hover:bg-surface-variant/20 transition-colors">Cancelar</button>
            <button type="submit" id="btn-guardar-vale" class="w-1/2 py-3 bg-primary text-on-primary rounded-xl text-sm font-semibold shadow-md flex items-center justify-center gap-2">Guardar Vale</button>
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
      <div class="col-span-full py-16 text-center text-on-surface-variant bg-surface-container-lowest rounded-2xl border border-surface-variant">
        <span class="material-symbols-outlined text-5xl text-on-surface-variant/40">description</span>
        <p class="mt-2 text-sm font-semibold">No se encontraron vales físicos registrados</p>
      </div>
    `;
    return;
  }

  container.innerHTML = valesFiltrados.map(v => {
    const esPendiente = v.estado === 'Pendiente';
    const badgeColor = esPendiente ? 'bg-amber-500/20 text-amber-600 dark:text-amber-300' : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300';
    
    return `
      <div class="bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-variant overflow-hidden flex flex-col justify-between hover:shadow-md transition-all">
        <div>
          <!-- IMAGEN HEADER -->
          ${v.foto_base64 ? `
            <div class="relative h-44 bg-surface-container cursor-pointer overflow-hidden group btn-ver-foto" data-img="${v.foto_base64}">
              <img src="${v.foto_base64}" class="w-full h-full object-cover group-hover:scale-105 transition-transform">
              <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-semibold transition-opacity gap-1">
                <span class="material-symbols-outlined text-sm">visibility</span> Ver Foto Completa
              </div>
            </div>
          ` : `
            <div class="h-20 bg-surface-container/50 flex items-center justify-center text-on-surface-variant/60 text-xs italic border-b border-surface-variant">
              Sin foto adjunta
            </div>
          `}

          <div class="p-5 space-y-3">
            <div class="flex justify-between items-start">
              <div>
                <h4 class="font-bold text-on-surface text-base">${v.cliente}</h4>
                <p class="text-xs text-on-surface-variant flex items-center gap-1 mt-0.5"><span class="material-symbols-outlined text-[14px]">calendar_today</span> ${v.fecha || 'Sin fecha'}</p>
              </div>
              <span class="px-3 py-1 text-xs font-bold rounded-full ${badgeColor}">
                ${v.estado}
              </span>
            </div>

            <div class="bg-surface-container/60 p-3 rounded-xl border border-surface-variant/50">
              <p class="text-xs text-on-surface-variant font-bold uppercase tracking-wider">Producto / Detalle:</p>
              <p class="text-sm font-semibold text-on-surface mt-0.5">${v.cantidad > 1 ? `(${v.cantidad}x) ` : ''}${v.producto}</p>
            </div>
          </div>
        </div>

        <div class="p-5 pt-0 space-y-3">
          <div class="flex justify-between items-baseline pt-3 border-t border-surface-variant">
            <span class="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Monto Total:</span>
            <span class="text-xl font-black text-primary">$${(Number(v.monto) || 0).toLocaleString("es-CO")}</span>
          </div>

          <div class="flex gap-2">
            ${esPendiente ? `
              <button class="btn-cambiar-estado flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center justify-center gap-1" data-id="${v.id}" data-estado="Pagado">
                <span class="material-symbols-outlined text-[16px]">check</span> Marcar Pagado
              </button>
            ` : `
              <button class="btn-cambiar-estado flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center justify-center gap-1" data-id="${v.id}" data-estado="Pendiente">
                <span class="material-symbols-outlined text-[16px]">undo</span> Reabrir Vale
              </button>
            `}
            <button class="btn-eliminar-vale p-2.5 text-error hover:bg-error/10 rounded-xl transition-colors" data-id="${v.id}" title="Eliminar">
              <span class="material-symbols-outlined text-[20px]">delete</span>
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

  // IA Scan Button
  btnScanQwen.addEventListener("click", async () => {
    if (!currentPhotoBase64) return;

    btnScanQwen.disabled = true;
    btnScanQwen.innerHTML = `<span class="material-symbols-outlined animate-spin text-[18px]">sync</span><span>Analizando imagen con IA...</span>`;

    try {
      const data = await procesarValeOcrConQwen(currentPhotoBase64);
      if (data.cliente) document.getElementById("vale-cliente").value = data.cliente;
      if (data.producto) document.getElementById("vale-producto").value = data.producto;
      if (data.cantidad) document.getElementById("vale-cantidad").value = data.cantidad;
      if (data.monto) document.getElementById("vale-monto").value = data.monto;
      if (data.fecha) document.getElementById("vale-fecha").value = data.fecha;

      showToast("¡Información del vale extraída con éxito!", "success");
    } catch (err) {
      console.error(err);
      showToast(`Error de escaneo: ${err.message || 'No se pudo leer la imagen'}`, "error");
    } finally {
      btnScanQwen.disabled = false;
      btnScanQwen.innerHTML = `<span class="material-symbols-outlined text-[20px]">auto_awesome</span><span>Extraer Datos con IA</span>`;
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

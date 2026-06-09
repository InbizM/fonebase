import { getTechnical, crearServicioTecnico, actualizarServicioTecnico, eliminarServicioTecnico, uploadEvidencia } from "../api.js";
import { showToast } from "../toast.js";

let _servicios = [];
let _isLoaded = false;
let _isProcessing = false;
let _editingId = null;
let _evidencias = {}; // To track new image uploads

export function initTechnical() {
  return async () => {
    if (!_isLoaded) {
      await loadData();
      setupEvents();
      _isLoaded = true;
    }
    renderGrid(_servicios);
  };
}

async function loadData() {
  const container = document.getElementById("tech-grid");
  try {
    if (container) container.innerHTML = `<p class="col-span-full text-center p-10 opacity-50 italic">Cargando servicios...</p>`;
    _servicios = await getTechnical();
  } catch (err) {
    showToast("Error al cargar datos", "error");
    _servicios = [];
  }
}

function renderGrid(lista) {
  const container = document.getElementById("tech-grid");
  if (!container) return;

  if (lista.length === 0) {
    container.innerHTML = `<p class="col-span-full text-center p-20 opacity-30 italic text-sm">No hay órdenes de servicio activas</p>`;
    return;
  }

  const fmt = n => new Intl.NumberFormat("es-CO").format(n || 0);

  container.innerHTML = lista.map(s => {
    const saldo = (s.precio_final || 0) - (s.abono || 0);
    return `
      <div class="bg-surface-container-lowest border border-surface-variant rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group relative">
        <div class="flex justify-between items-start mb-3">
          <span class="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/5 px-2 py-1 rounded-md">${s.id_orden}</span>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusCls(s.estado)}">${s.estado}</span>
        </div>
        
        <h3 class="font-black text-on-surface text-base mb-1 truncate">${s.equipo}</h3>
        <p class="text-xs font-bold text-on-surface-variant mb-3 flex items-center gap-1">
          <span class="material-symbols-outlined text-[14px]">person</span> ${s.cliente}
        </p>

        <div class="bg-surface-container-low rounded-xl p-3 mb-4">
          <p class="text-[10px] uppercase font-bold text-on-surface-variant/60 mb-1">Falla Reportada</p>
          <p class="text-xs text-on-surface italic line-clamp-2">${s.falla}</p>
        </div>
        
        ${s.evidencias && s.evidencias !== "{}" && s.evidencias.length > 5 ? `<div class="flex items-center gap-1.5 mb-3 text-[10px] font-bold text-primary bg-primary/5 px-2 py-1 w-fit rounded-md"><span class="material-symbols-outlined text-[14px]">photo_camera</span> Evidencias Adjuntas</div>` : ''}

        <div class="grid grid-cols-2 gap-2 mb-4 border-t border-surface-variant/30 pt-3">
          <div>
            <p class="text-[9px] uppercase font-bold text-on-surface-variant/50">Total</p>
            <p class="text-sm font-black text-on-surface">$${fmt(s.precio_final)}</p>
          </div>
          <div class="text-right">
            <p class="text-[9px] uppercase font-bold text-on-surface-variant/50">Saldo</p>
            <p class="text-sm font-black ${saldo > 0 ? 'text-error' : 'text-green-600'}">$${fmt(saldo)}</p>
          </div>
        </div>

        <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onclick="window.techPrint('${s.id_orden}')" title="Imprimir Ticket" class="p-2 bg-surface border border-surface-variant rounded-xl text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-colors">
            <span class="material-symbols-outlined text-[18px]">print</span>
          </button>
          <button onclick="window.techEdit('${s.id_orden}')" class="flex-1 py-2 bg-surface border border-surface-variant rounded-xl text-xs font-bold text-primary hover:bg-primary/5 transition-colors flex items-center justify-center gap-1">
            <span class="material-symbols-outlined text-[16px]">edit</span> Editar
          </button>
          <button onclick="window.techDelete('${s.id_orden}')" class="p-2 bg-surface border border-surface-variant rounded-xl text-error hover:bg-error/5 transition-colors">
            <span class="material-symbols-outlined text-[18px]">delete</span>
          </button>
        </div>
      </div>
    `;
  }).join("");
}

function getStatusCls(st) {
  const map = { 
    'Ingresado': 'bg-slate-100 text-slate-700', 
    'En Revisión': 'bg-blue-100 text-blue-700', 
    'En Taller': 'bg-blue-100 text-blue-700',
    'Reparado': 'bg-green-100 text-green-700', 
    'Entregado': 'bg-emerald-600 text-white',
    'Sin Arreglo': 'bg-red-100 text-red-700'
  };
  return map[st] || 'bg-slate-100 text-slate-600';
}

function setupEvents() {
  document.getElementById("tech-search")?.addEventListener("input", (e) => {
    const q = e.target.value.toLowerCase().trim();
    renderGrid(_servicios.filter(s => 
      s.cliente.toLowerCase().includes(q) || 
      s.id_orden.toLowerCase().includes(q) || 
      s.equipo.toLowerCase().includes(q)
    ));
  });

  document.getElementById("tech-new-btn")?.addEventListener("click", () => openModal());
  document.getElementById("tech-modal-close")?.addEventListener("click", closeModal);
  document.getElementById("tech-modal-backdrop")?.addEventListener("click", closeModal);
  document.getElementById("tech-form")?.addEventListener("submit", saveService);

  // Setup Image Previews
  ['recepcion', 'resultado'].forEach(tipo => {
    const btn = document.getElementById(`tech-preview-${tipo}-btn`);
    const input = document.getElementById(`tech-img-${tipo}`);
    const wrap = document.getElementById(`tech-preview-${tipo}-wrap`);
    const img = document.getElementById(`tech-preview-${tipo}`);
    const removeBtn = document.getElementById(`tech-remove-${tipo}`);

    btn?.addEventListener("click", () => input?.click());
    
    input?.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        _evidencias[tipo] = { file, base64: ev.target.result.split(",")[1], mime: file.type };
        img.src = ev.target.result;
        btn.classList.add("hidden");
        wrap.classList.remove("hidden");
      };
      reader.readAsDataURL(file);
    });

    removeBtn?.addEventListener("click", () => {
      input.value = "";
      delete _evidencias[tipo];
      img.src = "";
      wrap.classList.add("hidden");
      btn.classList.remove("hidden");
    });
  });

  window.techEdit = (id) => {
    const s = _servicios.find(x => x.id_orden === id);
    if (s) openModal(s);
  };

  window.techPrint = (id) => {
    const s = _servicios.find(x => x.id_orden === id);
    if (!s) return;

    const fmt = n => new Intl.NumberFormat("es-CO").format(n || 0);
    const saldo = (s.precio_final || 0) - (s.abono || 0);
    const hoy = new Date().toLocaleDateString('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });

    const ticketHTML = `
      <html>
      <head>
        <title>Ticket de Servicio - ${s.id_orden}</title>
        <style>
          body { font-family: monospace; font-size: 12px; margin: 0; padding: 10px; width: 300px; color: #000; }
          .center { text-align: center; }
          .bold { font-weight: bold; }
          .line { border-top: 1px dashed #000; margin: 10px 0; }
          .row { display: flex; justify-content: space-between; margin-bottom: 3px; }
          .mb-2 { margin-bottom: 10px; }
          .text-lg { font-size: 16px; }
        </style>
      </head>
      <body>
        <div class="center mb-2">
          <h2 style="margin:0;">ADMINPRO</h2>
          <p style="margin:3px 0;">Servicio Técnico</p>
        </div>
        
        <div class="row bold"><span>ORDEN:</span><span>${s.id_orden}</span></div>
        <div class="row"><span>Fecha:</span><span>${hoy}</span></div>
        <div class="row"><span>Estado:</span><span>${s.estado}</span></div>
        <div class="line"></div>
        
        <div class="mb-2">
          <div class="bold">Cliente:</div>
          <div>${s.cliente}</div>
        </div>
        
        <div class="mb-2">
          <div class="bold">Equipo:</div>
          <div>${s.equipo}</div>
        </div>
        
        <div class="mb-2">
          <div class="bold">Falla Reportada:</div>
          <div>${s.falla}</div>
        </div>
        
        <div class="line"></div>
        
        <div class="row"><span>Costo Total:</span><span>$${fmt(s.precio_final)}</span></div>
        <div class="row"><span>Abono:</span><span>$${fmt(s.abono)}</span></div>
        <div class="row bold text-lg" style="margin-top: 5px;"><span>SALDO:</span><span>$${fmt(saldo)}</span></div>
        
        <div class="line"></div>
        <div class="center" style="margin-top: 20px; font-size: 10px;">
          <p>Conserve este ticket para retirar su equipo.</p>
          <p>¡Gracias por preferirnos!</p>
        </div>
      </body>
      </html>
    `;

    const printWin = window.open('', '', 'width=400,height=600');
    if (printWin) {
      printWin.document.open();
      printWin.document.write(ticketHTML);
      printWin.document.close();
      printWin.focus();
      // Pequeño timeout para dar tiempo a que renderice antes de abrir el cuadro de impresión
      setTimeout(() => {
        printWin.print();
        printWin.close();
      }, 250);
    } else {
      showToast("Por favor permite las ventanas emergentes para imprimir", "warning");
    }
  };

  window.techDelete = async (id) => {
    if (!confirm(`¿Eliminar orden ${id}?`)) return;
    try {
      const res = await eliminarServicioTecnico(id);
      if (res.success) { 
        showToast("Orden eliminada", "success"); 
        await loadData(); 
        renderGrid(_servicios); 
      }
    } catch (err) { showToast(err.message, "error"); }
  };
}

function openModal(s = null) {
  _editingId = s ? s.id_orden : null;
  const form = document.getElementById("tech-form");
  form.reset();
  document.getElementById("tech-modal-title").textContent = s ? "Editar Orden" : "Ingreso a Servicio Técnico";
  
  _evidencias = {}; // Reset pending uploads
  ['recepcion', 'resultado'].forEach(tipo => {
    document.getElementById(`tech-preview-${tipo}-btn`)?.classList.remove("hidden");
    document.getElementById(`tech-preview-${tipo}-wrap`)?.classList.add("hidden");
    document.getElementById(`tech-preview-${tipo}`).src = "";
  });
  
  if (s) {
    document.getElementById("tech-cliente").value = s.cliente;
    document.getElementById("tech-equipo").value = s.equipo;
    document.getElementById("tech-falla").value = s.falla;
    document.getElementById("tech-costo").value = new Intl.NumberFormat("es-CO").format(s.precio_final || 0);
    document.getElementById("tech-estado").value = s.estado;

    if (s.evidencias) {
      try {
        const evs = JSON.parse(s.evidencias);
        ['recepcion', 'resultado'].forEach(tipo => {
          if (evs[tipo]) {
            document.getElementById(`tech-preview-${tipo}`).src = evs[tipo];
            document.getElementById(`tech-preview-${tipo}-btn`).classList.add("hidden");
            document.getElementById(`tech-preview-${tipo}-wrap`).classList.remove("hidden");
            // Also store existing url to not lose it if we don't upload a new one
            _evidencias[tipo] = { url: evs[tipo] };
          }
        });
      } catch(e) {}
    }
  }
  
  const modal = document.getElementById("tech-modal");
  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function closeModal() {
  const modal = document.getElementById("tech-modal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

async function saveService(e) {
  e.preventDefault();
  if (_isProcessing) return;
  _isProcessing = true;
  const btn = document.getElementById("tech-save-btn");
  btn.disabled = true;

  const idOrden = _editingId || `ST-${Date.now().toString().slice(-6)}`;
  
  // Procesar evidencias pendientes
  btn.innerHTML = `<span class="material-symbols-outlined animate-spin">progress_activity</span> Subiendo...`;
  
  let finalEvidencias = {};
  for (const tipo of ['recepcion', 'resultado']) {
    if (_evidencias[tipo]) {
      if (_evidencias[tipo].base64) {
        try {
          const url = await uploadEvidencia(_evidencias[tipo].base64, `${idOrden}_${tipo}`, _evidencias[tipo].mime);
          if (url) finalEvidencias[tipo] = url;
        } catch(e) { console.error("Error upload evidencia", e); }
      } else if (_evidencias[tipo].url) {
        finalEvidencias[tipo] = _evidencias[tipo].url;
      }
    }
  }

  // Mapeamos a los 13 campos que pide la tabla en Turso
  const datos = [
    idOrden,
    document.getElementById("tech-cliente").value.trim(),
    "310", // telefono placeholder
    document.getElementById("tech-equipo").value.trim(),
    "S/N", // imei placeholder
    document.getElementById("tech-falla").value.trim(),
    "0000", // clave placeholder
    "", // repuestos
    0, // costo taller
    0, // abono
    parseInt(document.getElementById("tech-costo").value.replace(/\D/g, "")) || 0,
    document.getElementById("tech-estado").value,
    JSON.stringify(finalEvidencias) // evidencias
  ];

  try {
    const res = _editingId 
      ? await actualizarServicioTecnico(_editingId, datos)
      : await crearServicioTecnico(datos);
      
    if (res.success) {
      showToast(_editingId ? "Actualizado" : "Ingresado", "success");
      closeModal();
      await loadData();
      renderGrid(_servicios);
    }
  } catch (err) {
    showToast(err.message, "error");
  } finally {
    _isProcessing = false;
    btn.disabled = false;
    btn.innerHTML = `<span class="material-symbols-outlined text-[18px]">save</span> Guardar`;
  }
}

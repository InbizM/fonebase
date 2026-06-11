import { getTechnical, crearServicioTecnico, actualizarServicioTecnico, eliminarServicioTecnico, uploadEvidencia, getAjustesEmpresa } from "../api.js";
import { showToast } from "../toast.js";

let _servicios = [];
let _isLoaded = false;
let _isProcessing = false;
let _editingId = null;
let _evidencias = {}; // To track new image uploads
let _ajustesEmpresa = null;

export function initTechnical() {
  return async () => {
    try {
      _ajustesEmpresa = await getAjustesEmpresa();
    } catch(e) {
      console.error("Error al cargar ajustes de empresa en servicio técnico:", e);
    }
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

        <div class="flex gap-2">
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

    const emisor = {
      nombre: _ajustesEmpresa?.nombre || "CLAROCELL.COM",
      propietario: _ajustesEmpresa?.propietario || "Yeison Rangel Rangel",
      nit: _ajustesEmpresa?.nit || "1193400777-2",
      direccion: (_ajustesEmpresa?.direccion || "Calle 12 No. 10 - 108") + ", " + (_ajustesEmpresa?.ciudad || "Maicao - La Guajira"),
      contacto: _ajustesEmpresa?.contacto || "3016807310",
      correo: _ajustesEmpresa?.correo || "yeison0021@hotmail.com",
      condiciones: _ajustesEmpresa?.condiciones || "GARANTIA: Equipos probados y encendidos. Sin garantía en displays/táctiles o equipos apagados. Doc. asimilado a letra de cambio (Art. 774 C.Comercio).",
      logo: _ajustesEmpresa?.logo || ""
    };

    let badgeClass = "badge-ingresado";
    const st = (s.estado || "").trim();
    if (st === "En Revisión") badgeClass = "badge-revision";
    else if (st === "En Taller") badgeClass = "badge-taller";
    else if (st === "Reparado") badgeClass = "badge-reparado";
    else if (st === "Entregado") badgeClass = "badge-entregado";
    else if (st === "Sin Arreglo") badgeClass = "badge-sinarreglo";

    const ticketHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            @page { size: 48mm auto; margin: 0; }
            html, body { 
              width: 48mm; 
              margin: 0; 
              padding: 0; 
              background: #fff;
              -webkit-print-color-adjust: exact;
              color-adjust: exact;
            }
            body { 
              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; 
              padding: 2mm; 
              font-size: 10px; 
              color: #1e293b; 
              line-height: 1.3;
            }
            .bold { font-weight: 900; }
            .text-xs { font-size: 8px; }
            .text-sm { font-size: 11px; }
            .text-lg { font-size: 14px; }
            .text-xl { font-size: 18px; }
            .text-slate-500 { color: #64748b; }
            .text-slate-400 { color: #94a3b8; }
            .text-primary { color: #020617; }
            
            .card { 
              border: 1px solid #e2e8f0; 
              border-radius: 6px; 
              padding: 4px; 
              margin-bottom: 6px; 
              background: #f8fafc;
            }
            .flex-between { display: flex; justify-content: space-between; align-items: flex-start; }
            .badge { 
              padding: 2px 4px; border-radius: 8px; 
              font-size: 8px; font-weight: 900; text-transform: uppercase;
            }
            .badge-ingresado { background: #f1f5f9; color: #334155; }
            .badge-revision { background: #dbeafe; color: #1e40af; }
            .badge-taller { background: #dbeafe; color: #1e40af; }
            .badge-reparado { background: #dcfce7; color: #166534; }
            .badge-entregado { background: #059669; color: #ffffff; }
            .badge-sinarreglo { background: #fee2e2; color: #991b1b; }
            
            .section-title {
              font-size: 7px;
              font-weight: 900;
              color: #94a3b8;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 2px;
              margin-top: 4px;
            }

            .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; }
            
            .product-card {
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 4px;
              padding: 4px;
              margin-bottom: 4px;
            }
            
            .summary-card {
              background: #0f172a;
              color: white;
              border-radius: 6px;
              padding: 6px;
              margin-top: 6px;
            }
            
            .legal { font-size: 7px; text-align: justify; margin-top: 8px; color: #64748b; }
            .center { text-align: center; }
          </style>
        </head>
        <body>
          <!-- Logo de la Empresa -->
          ${emisor.logo ? `
          <div style="text-align: center; margin-bottom: 4px;">
            <img src="${emisor.logo}" style="max-height: 40px; max-width: 100%; object-fit: contain;">
          </div>
          ` : ''}
          <div class="center" style="margin-bottom: 6px; font-size: 8px; line-height: 1.2; border: 1px solid #e2e8f0; border-radius: 6px; padding: 4px; background: #f8fafc;">
            <div class="bold text-sm" style="text-transform: uppercase; color: #000;">${emisor.nombre}</div>
            <div>NIT: ${emisor.nit}</div>
            <div>${emisor.direccion}</div>
            <div>Tel: ${emisor.contacto}</div>
          </div>

          <!-- Header / Comprobante -->
          <div class="card">
            <div class="text-xs text-primary bold" style="color: #dc2626; text-transform: uppercase;">SERVICIO TÉCNICO</div>
            <div class="flex-between" style="margin-top: 2px;">
              <div class="text-lg bold" style="line-height: 1;">${s.id_orden}</div>
              <div class="badge ${badgeClass}">${s.estado}</div>
            </div>
            <div class="flex-between" style="margin-top: 2px;">
              <div class="text-xs text-slate-500">${hoy}</div>
              <div class="text-xs bold" style="color: #dc2626;">SOPORTE</div>
            </div>
          </div>
          
          <!-- Info Cliente -->
          <div class="grid-2">
            <div>
              <div class="section-title">INFORMACIÓN DEL CLIENTE</div>
              <div class="bold text-sm">${s.cliente}</div>
              <div class="text-xs text-slate-500"><span class="text-slate-400 bold">Tel:</span> ${s.telefono || 'N/A'}</div>
            </div>
            <div>
              <div class="section-title">DISPOSITIVO</div>
              <div class="bold text-sm">${s.equipo}</div>
              <div class="text-xs text-slate-500"><span class="text-slate-400 bold">IMEI/S:</span> ${s.imei_serie || 'N/A'}</div>
              ${s.clave_patron ? `<div class="text-xs text-slate-500"><span class="text-slate-400 bold">Clave:</span> ${s.clave_patron}</div>` : ''}
            </div>
          </div>
          
          <div style="border-top: 1px solid #f1f5f9; margin: 6px 0;"></div>
          
          <!-- Detalle Soporte -->
          <div class="section-title">DETALLES DEL TRABAJO</div>
          <div class="product-card">
            <div class="bold text-[8px] text-slate-400">FALLA REPORTADA:</div>
            <div class="text-xs text-slate-800" style="margin-bottom: 4px;">${s.falla}</div>
            ${s.repuestos ? `
              <div class="bold text-[8px] text-slate-400" style="margin-top: 4px; border-top: 1px dashed #e2e8f0; padding-top: 2px;">REPUESTOS UTILIZADOS:</div>
              <div class="text-xs text-slate-800">${s.repuestos}</div>
            ` : ''}
          </div>

          <!-- Resumen Financiero -->
          <div class="summary-card">
            <div class="flex-between" style="align-items: flex-end;">
              <div>
                <div class="section-title" style="color: #94a3b8; margin-top: 0;">RESUMEN DE PAGO</div>
                <div class="text-xs" style="color: #cbd5e1;">Costo Total: $${fmt(s.precio_final)}</div>
                <div class="text-xs text-green-400 font-bold">Abonado: -$${fmt(s.abono)}</div>
              </div>
              <div style="text-align: right;">
                <div class="section-title" style="color: #94a3b8; margin-top: 0; margin-bottom: 0;">SALDO PENDIENTE</div>
                <div class="text-xl bold text-white" style="line-height: 1; color: ${saldo > 0 ? '#f87171' : '#4ade80'};">$${fmt(saldo)}</div>
              </div>
            </div>
          </div>

          <!-- Firmas -->
          <div class="grid-2" style="margin-top: 8px;">
             <div class="center">
               <div class="text-xs bold text-slate-400">FIRMA TÉCNICO</div>
               <div style="border: 1px solid #e2e8f0; border-radius: 4px; background: #f8fafc; height: 30px; margin-top: 2px;"></div>
             </div>
             <div class="center">
               <div class="text-xs bold text-slate-400">FIRMA CLIENTE</div>
               <div style="border: 1px solid #e2e8f0; border-radius: 4px; background: #f8fafc; height: 30px; margin-top: 2px;"></div>
             </div>
          </div>
          
          <!-- Footer Legal -->
          <div class="legal">
            ${emisor.condiciones}
            <p style="margin-top: 4px; font-style: italic; text-align: center;">Conserve este ticket para reclamar su equipo.</p>
          </div>
          <div class="center bold" style="margin-top: 8px; font-size: 11px;">¡GRACIAS POR SU CONFIANZA!</div>
        </body>
      </html>
    `;

    const printWin = window.open('', '_blank', 'width=300,height=600');
    if (printWin) {
      printWin.document.open();
      printWin.document.write(ticketHTML);
      printWin.document.close();
      printWin.focus();
      setTimeout(() => {
        printWin.print();
        printWin.close();
      }, 500);
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

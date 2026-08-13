import { getCreditos, actualizarCredito, crearCredito, getAjustesEmpresa, compressImage } from "../api.js";
import { showToast } from "../toast.js";
import { openCustomerSelector } from "../customer-selector.js";
import { printBluetoothAbonoTicket } from "../bluetooth-printer.js";

let _creditos = [];
let _isLoaded = false;
let _isProcessing = false;

export function initCredits() {
  return async () => {
    if (!_isLoaded) {
      await loadData();
      setupEvents();
      _isLoaded = true;
    }
    renderTable(_creditos);
  };
}

async function loadData() {
  const tbody = document.getElementById("cred-table-body");
  if (tbody) tbody.innerHTML = `<tr><td colspan="9" class="p-6 text-center text-on-surface-variant">Cargando créditos...</td></tr>`;
  try {
    _creditos = await getCreditos();
  } catch (err) {
    showToast("Error cargando créditos: " + err.message, "error");
    _creditos = [];
  }
}

// ---- Helpers ----
const fmt = (n) => "$" + new Intl.NumberFormat("es-CO").format(Math.round(n || 0));

function diasTranscurridos(fechaStr, fechaFin) {
  if (!fechaStr) return 0;
  // Parse dd/mm/yyyy or ISO
  const parse = (s) => {
    if (!s) return null;
    const parts = String(s).split("/");
    if (parts.length === 3) return new Date(parts[2], parts[1] - 1, parts[0]);
    return new Date(s);
  };
  const desde = parse(fechaStr);
  const hasta = fechaFin ? parse(fechaFin) : new Date();
  if (!desde || isNaN(desde)) return 0;
  return Math.max(0, Math.floor((hasta - desde) / 86400000));
}

function parseHistorial(raw) {
  if (!raw) return [];
  return raw.split(";").filter(Boolean).map(e => {
    const parts = e.split("|");
    return { 
      fecha: parts[0] || "", 
      monto: parseFloat(parts[1]) || 0, 
      nota: parts[2] || "", 
      metodo: parts[3] || "Efectivo",
      evidencia: parts[4] || ""
    };
  });
}

function serializeHistorial(list) {
  return list.map(a => `${a.fecha}|${a.monto}|${a.nota}|${a.metodo || 'Efectivo'}|${a.evidencia || ''}`).join(";");
}

// ---- Stats ----
function updateStats(lista) {
  let totalDeuda = 0, totalRecaudado = 0;
  lista.forEach(c => {
    if (c.estado !== "Cancelado") totalDeuda += (c.saldo || 0);
    totalRecaudado += (c.abonado || 0);
  });
  const elT = document.getElementById("cred-stat-total");
  const elR = document.getElementById("cred-stat-recaudo");
  if (elT) elT.textContent = fmt(totalDeuda);
  if (elR) elR.textContent = fmt(totalRecaudado);
}

// ---- Render ----
function renderTable(lista) {
  updateStats(_creditos);
  const tbody = document.getElementById("cred-table-body");
  if (!tbody) return;

  if (lista.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" class="p-6 text-center text-on-surface-variant">No se encontraron créditos</td></tr>`;
    return;
  }

  tbody.innerHTML = lista.map(c => {
    const cancelado = c.estado === "Cancelado" || c.estado === "Entregado";
    const dias = diasTranscurridos(c.fecha, cancelado ? c.fechaCancelacion : null);
    const statusCls = cancelado ? "bg-green-100 text-green-800"
                    : c.estado === "En Mora" ? "bg-red-100 text-red-800"
                    : "bg-orange-100 text-orange-800";
    const tipoCls = c.tipo === "Plan Separe" ? "bg-emerald-100 text-emerald-800 border-emerald-200" : "bg-blue-100 text-blue-800 border-blue-200";
    const diasLabel = cancelado
      ? `<span class="text-[10px] text-on-surface-variant">Pagó en ${dias}d</span>`
      : `<span class="text-[10px] font-bold ${dias > 30 ? 'text-red-500' : 'text-orange-500'}">${dias} días</span>`;

    // WhatsApp: clean phone
    const phone = String(c.telefono || "").replace(/\D/g, "");
    const waMsg = encodeURIComponent(`Hola ${c.cliente}, le recordamos que tiene un saldo pendiente de ${fmt(c.saldo)} con nosotros. Gracias.`);
    const waUrl = `https://wa.me/57${phone}?text=${waMsg}`;

    return `
      <tr class="hover:bg-surface-container-low transition-colors ${cancelado ? 'opacity-60' : ''}">
        <td class="px-4 py-3">
          <p class="font-bold text-sm text-on-surface">${c.cliente || '-'}</p>
          <p class="text-[11px] text-on-surface-variant">${c.telefono || ''}</p>
          <div class="md:hidden mt-1 text-[11px] text-on-surface-variant flex flex-col gap-0.5 border-t border-surface-variant/30 pt-1">
            <div><span class="font-semibold text-slate-500">Deuda:</span> ${c.fecha || '-'}</div>
            <div><span class="font-semibold text-slate-500">Total:</span> ${fmt(c.total)} | <span class="font-semibold text-green-600">Abonado:</span> ${fmt(c.abonado)}</div>
            ${c.idFactura ? `<div><span class="font-semibold text-slate-500">Ref:</span> <span class="font-mono">${c.idFactura}</span></div>` : ''}
          </div>
        </td>
        <td class="px-4 py-3 font-mono text-xs text-on-surface-variant hidden md:table-cell">${c.idFactura || '-'}</td>
        <td class="px-4 py-3 text-sm text-on-surface-variant hidden md:table-cell">${c.fecha || '-'}</td>
        <td class="px-4 py-3">
          <span class="px-2 py-0.5 border rounded-full text-[10px] font-bold uppercase tracking-wider ${tipoCls}">${c.tipo || 'Crédito'}</span>
        </td>
        <td class="px-4 py-3 text-sm font-medium hidden md:table-cell">${fmt(c.total)}</td>
        <td class="px-4 py-3 text-sm font-medium text-green-600 hidden md:table-cell">${fmt(c.abonado)}</td>
        <td class="px-4 py-3 text-sm font-black text-error">${fmt(c.saldo)}</td>
        <td class="px-4 py-3 text-center">${diasLabel}</td>
        <td class="px-4 py-3">
          <span class="px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase ${statusCls}">${c.estado || 'Activo'}</span>
        </td>
        <td class="px-4 py-3">
          <div class="flex items-center gap-1.5 justify-end">
            ${phone ? `<a href="${waUrl}" target="_blank"
                class="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors flex items-center justify-center" title="Enviar WhatsApp">
                <span class="material-symbols-outlined text-[20px]">chat</span>
              </a>` : ''}
            <button onclick="window.credImprimirTicket('${c.id}')"
                class="p-2 text-primary hover:bg-surface-container rounded-full transition-colors flex items-center justify-center" title="Imprimir Comprobante/Historial">
                <span class="material-symbols-outlined text-[20px]">print</span>
            </button>
            ${!cancelado ? `<button onclick="window.credAddAbono('${c.id}')"
                class="px-3.5 py-1.5 bg-primary text-on-primary hover:bg-primary/95 rounded-xl text-xs font-bold transition-all shadow-sm">
                Abonar
              </button>` : `<span class="text-xs text-green-600 font-semibold flex items-center gap-0.5"><span class="material-symbols-outlined text-[16px]">check_circle</span> Pagado</span>`}
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

// ---- Events ----
function setupEvents() {
  const elSearch = document.getElementById("cred-search");
  const elFilter = document.getElementById("cred-filter-status");
  const elFilterTipo = document.getElementById("cred-filter-tipo");

  const filterData = () => {
    const q = (elSearch?.value || "").toLowerCase().trim();
    const st = elFilter?.value || "";
    const tp = elFilterTipo?.value || "";
    const filtered = _creditos.filter(c => {
      const matchQ = ((c.cliente || "").toLowerCase().includes(q) || (c.idFactura || "").toLowerCase().includes(q));
      const matchSt = st ? c.estado === st : true;
      const matchTp = tp ? (c.tipo || "Crédito") === tp : true;
      return matchQ && matchSt && matchTp;
    });
    renderTable(filtered);
  };

  elSearch?.addEventListener("input", filterData);
  if (window.setupCustomSelect) {
    window.setupCustomSelect("cred-filter-tipo-container", "cred-filter-tipo", filterData);
    window.setupCustomSelect("cred-filter-status-container", "cred-filter-status", filterData);
    window.setupCustomSelect("cred-metodo-abono-container", "cred-metodo-abono");
  }

  // Format number inputs
  const fmtInput = (e) => {
    const v = e.target.value.replace(/\D/g, "");
    e.target.value = v ? new Intl.NumberFormat("es-CO").format(parseInt(v)) : "";
  };
  document.getElementById("cred-new-total")?.addEventListener("input", fmtInput);
  document.getElementById("cred-new-abono")?.addEventListener("input", fmtInput);
  document.getElementById("cred-monto-abono")?.addEventListener("input", fmtInput);

  // ----- Abono modal -----
  const elModal = document.getElementById("cred-modal");
  const elModalClose = document.getElementById("cred-modal-close");
  const elModalBackdrop = document.getElementById("cred-modal-backdrop");
  const elBtnSave = document.getElementById("cred-save-btn");

  const closeModal = () => { elModal?.classList.add("hidden"); elModal?.classList.remove("flex"); };
  elModalClose?.addEventListener("click", closeModal);
  elModalBackdrop?.addEventListener("click", closeModal);

  window.credAddAbono = (id) => {
    const cred = _creditos.find(c => c.id == id);
    if (!cred) return;
    // Fill modal
    document.getElementById("cred-id").value = cred.id;
    document.getElementById("cred-cliente-name").textContent = cred.cliente;
    document.getElementById("cred-saldo-actual").textContent = fmt(cred.saldo);
    // Show abono history
    const hist = parseHistorial(cred.historialAbonos);
    const elHist = document.getElementById("cred-historial");
    if (elHist) {
      elHist.innerHTML = hist.length === 0
        ? `<p class="text-xs text-on-surface-variant">Sin abonos anteriores</p>`
        : hist.map(a => `
            <div class="flex justify-between items-start py-2 border-b border-surface-variant/40 last:border-0 text-xs">
              <div class="flex flex-col">
                <span class="font-bold text-on-surface">${a.fecha}</span>
                <span class="text-[10px] text-on-surface-variant mt-0.5">
                  <span class="bg-primary/10 text-primary px-1.5 py-0.5 rounded font-black uppercase text-[8px]">${a.metodo || 'Efectivo'}</span>
                  ${a.nota ? '• ' + a.nota : ''}
                </span>
              </div>
              <div class="flex items-center gap-2">
                ${a.evidencia ? `
                  <button onclick="window.credVerEvidencia('${a.evidencia.replace(/'/g, "\\'")}')" class="p-1 hover:bg-surface-container rounded-full text-primary flex items-center justify-center" title="Ver Evidencia">
                    <span class="material-symbols-outlined text-[16px]">visibility</span>
                  </button>
                ` : ''}
                <span class="font-bold text-green-600">${fmt(a.monto)}</span>
              </div>
            </div>`).join("");
    }
    document.getElementById("cred-monto-abono").value = "";
    document.getElementById("cred-nota-abono").value = "";
    // Reset file input, hidden evidence and preview
    const fileInput = document.getElementById("cred-abono-img-file");
    if (fileInput) fileInput.value = "";
    const hiddenEvidencia = document.getElementById("cred-abono-evidencia");
    if (hiddenEvidencia) hiddenEvidencia.value = "";
    const previewContainer = document.getElementById("cred-abono-img-preview");
    if (previewContainer) {
      previewContainer.innerHTML = `<span class="material-symbols-outlined text-xl text-slate-400">add_a_photo</span>`;
    }

    const elMetodoSelect = document.getElementById("cred-metodo-abono");
    if (elMetodoSelect) {
      elMetodoSelect.value = "Efectivo";
      if (window.syncCustomSelectUI) {
        window.syncCustomSelectUI("cred-metodo-abono-container", "Efectivo");
      }
    }
    elModal?.classList.remove("hidden"); elModal?.classList.add("flex");
    document.getElementById("cred-monto-abono")?.focus();
  };

  // Evidencia de pago file change handler
  const elFileInput = document.getElementById("cred-abono-img-file");
  const elImgPreview = document.getElementById("cred-abono-img-preview");
  const elHiddenEvidencia = document.getElementById("cred-abono-evidencia");

  elFileInput?.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (elImgPreview) {
      elImgPreview.innerHTML = `<span class="animate-spin material-symbols-outlined text-xl text-primary">sync</span>`;
    }

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const rawBase64 = evt.target.result;
        // Compress image to max 800px width/height and 0.7 quality to keep SQLite size low (~20KB)
        const compressedBase64 = await compressImage(rawBase64, 800, 800, 0.7);
        if (elHiddenEvidencia) elHiddenEvidencia.value = compressedBase64;
        if (elImgPreview) {
          elImgPreview.innerHTML = `<img src="${compressedBase64}" class="w-full h-full object-cover" />`;
        }
      } catch (err) {
        showToast("Error al procesar la imagen: " + err.message, "error");
        if (elImgPreview) {
          elImgPreview.innerHTML = `<span class="material-symbols-outlined text-xl text-red-500">error</span>`;
        }
      }
    };
    reader.onerror = () => {
      showToast("Error al leer el archivo", "error");
      if (elImgPreview) {
        elImgPreview.innerHTML = `<span class="material-symbols-outlined text-xl text-red-500">error</span>`;
      }
    };
    reader.readAsDataURL(file);
  });

  // Lightbox Modal Evidencia Event Listeners
  const elEvidenciaModal = document.getElementById("cred-evidencia-modal");
  const elEvidenciaClose = document.getElementById("cred-evidencia-close");
  const elEvidenciaBtnClose = document.getElementById("cred-evidencia-btn-close");
  const elEvidenciaBackdrop = document.getElementById("cred-evidencia-backdrop");
  const elEvidenciaImg = document.getElementById("cred-evidencia-img");

  const closeEvidenciaModal = () => {
    elEvidenciaModal?.classList.add("hidden");
    elEvidenciaModal?.classList.remove("flex");
  };

  elEvidenciaClose?.addEventListener("click", closeEvidenciaModal);
  elEvidenciaBtnClose?.addEventListener("click", closeEvidenciaModal);
  elEvidenciaBackdrop?.addEventListener("click", closeEvidenciaModal);

  window.credVerEvidencia = (base64) => {
    if (!base64) return;
    if (elEvidenciaImg) elEvidenciaImg.src = base64;
    elEvidenciaModal?.classList.remove("hidden");
    elEvidenciaModal?.classList.add("flex");
  };

  elBtnSave?.addEventListener("click", async () => {
    const id = document.getElementById("cred-id").value;
    const monto = parseInt((document.getElementById("cred-monto-abono").value || "").replace(/\D/g, "")) || 0;
    const nota  = (document.getElementById("cred-nota-abono")?.value || "").trim();
    const metodo = document.getElementById("cred-metodo-abono")?.value || "Efectivo";
    const evidencia = document.getElementById("cred-abono-evidencia")?.value || "";

    if (!monto || monto <= 0) { showToast("Ingresa un monto válido", "warning"); return; }
    if (!evidencia) { showToast("La foto de la evidencia de pago es obligatoria", "warning"); return; }
    
    if (_isProcessing) return;
    _isProcessing = true;
    elBtnSave.textContent = "Aplicando...";
    elBtnSave.disabled = true;

    try {
      const cred = _creditos.find(c => c.id == id);
      const nuevoAbonado = Number(cred.abonado || 0) + monto;
      const nuevoSaldo   = Math.max(0, Number(cred.total || 0) - nuevoAbonado);
      const cancelado    = nuevoSaldo <= 0;

      // Append to historial
      const hist = parseHistorial(cred.historialAbonos);
      const now = new Date();
      const datePart = now.toLocaleDateString("es-CO");
      const timePart = now.toLocaleTimeString("es-CO", { hour: '2-digit', minute: '2-digit', hour12: true });
      const fechaStr = `${datePart} ${timePart}`;
      
      hist.push({ fecha: fechaStr, monto, nota, metodo, evidencia });

      const isSepare = cred.tipo === "Plan Separe";
      const estadoActivo = isSepare ? "Separado" : "Activo";
      const estadoFinal = isSepare ? "Entregado" : "Cancelado";
      
      const d = {
        ...cred,
        abonado: nuevoAbonado,
        saldo: nuevoSaldo,
        estado: cancelado ? estadoFinal : (cred.estado === "Cancelado" || cred.estado === "Entregado" ? estadoFinal : estadoActivo),
        fechaCancelacion: cancelado ? fechaStr : (cred.fechaCancelacion || ""),
        historialAbonos: serializeHistorial(hist)
      };

      const res = await actualizarCredito(id, d);
      if (res?.success) {
        showToast(cancelado ? "✅ ¡Crédito cancelado!" : "Abono registrado", "success");
        closeModal();
        imprimirTicketAbono(d, monto, nota);
        _isLoaded = false;
        await loadData();
        renderTable(_creditos);
      } else {
        showToast(res?.mensaje || "Error al guardar", "error");
      }
    } catch (err) {
      showToast("Error: " + err.message, "error");
    } finally {
      _isProcessing = false;
      elBtnSave.innerHTML = `<span class="material-symbols-outlined text-[18px]">save</span> Aplicar Abono`;
      elBtnSave.disabled = false;
    }
  });

  // ----- Nuevo Crédito -----
  const elNewModal = document.getElementById("cred-new-modal");
  const closeNew = () => { elNewModal?.classList.add("hidden"); elNewModal?.classList.remove("flex"); };

  document.getElementById("cred-new-btn")?.addEventListener("click", () => {
    document.getElementById("cred-new-form")?.reset();
    document.getElementById("cred-new-cliente").value = "";
    document.getElementById("cred-new-cliente-doc").value = "";
    elNewModal?.classList.remove("hidden"); elNewModal?.classList.add("flex");
  });
  document.getElementById("cred-new-close")?.addEventListener("click", closeNew);
  document.getElementById("cred-new-backdrop")?.addEventListener("click", closeNew);

  document.getElementById("cred-select-client-btn")?.addEventListener("click", () => {
    openCustomerSelector(client => {
      document.getElementById("cred-new-cliente").value = client.nombre;
      document.getElementById("cred-new-cliente-doc").value = client.cedula || client.documento || client.telefono || "";
    });
  });

  document.getElementById("cred-save-new-btn")?.addEventListener("click", async () => {
    const nombre = document.getElementById("cred-new-cliente").value.trim();
    const doc    = document.getElementById("cred-new-cliente-doc").value.trim();
    const total  = parseInt((document.getElementById("cred-new-total").value || "").replace(/\D/g, "")) || 0;
    const abono  = parseInt((document.getElementById("cred-new-abono")?.value || "").replace(/\D/g, "")) || 0;
    const detalle = document.getElementById("cred-new-detalle").value.trim();

    if (!nombre || !total) { showToast("Cliente y monto son requeridos", "warning"); return; }

    const btnSave = document.getElementById("cred-save-new-btn");
    btnSave.disabled = true; btnSave.textContent = "Guardando...";

    try {
      const now = new Date();
      const datePart = now.toLocaleDateString("es-CO");
      const timePart = now.toLocaleTimeString("es-CO", { hour: '2-digit', minute: '2-digit', hour12: true });
      const fechaStr = `${datePart} ${timePart}`;

      const histInicial = abono > 0
        ? serializeHistorial([{ fecha: fechaStr, monto: abono, nota: "Abono inicial", metodo: "Efectivo" }])
        : "";
      const res = await crearCredito({
        cliente: nombre, telefono: doc, total, detalle,
        historialAbonos: histInicial
      });
      if (res?.success) {
        showToast("Crédito creado", "success");
        closeNew();
        _isLoaded = false;
        await loadData();
        renderTable(_creditos);
      } else {
        showToast(res?.mensaje || "Error al crear crédito", "error");
      }
    } catch (err) {
      showToast("Error: " + err.message, "error");
    } finally {
      btnSave.disabled = false;
      btnSave.innerHTML = `<span class="material-symbols-outlined text-[18px]">save</span> Guardar`;
    }
  });

  window.credImprimirTicket = (id) => {
    const cred = _creditos.find(c => c.id == id);
    if (!cred) return;
    imprimirTicketAbono(cred, 0, "");
  };
}

async function imprimirTicketAbono(cred, monto, nota) {
  let ajustes = null;
  try {
    ajustes = await getAjustesEmpresa();
  } catch (e) {
    console.error("Error al cargar ajustes de empresa:", e);
  }

  // Intenta imprimir por Bluetooth primero
  try {
    console.log("[Credits] Intentando impresión por Bluetooth...");
    await printBluetoothAbonoTicket(cred, monto, nota, ajustes);
    showToast("Impresión Bluetooth enviada", "success");
    return; // Si tiene éxito, finaliza aquí
  } catch (err) {
    console.warn("[Credits] Impresión Bluetooth falló o cancelada. Usando fallback de navegador.", err);
  }

  const printWindow = window.open('', '_blank', 'width=300,height=600');
  const now = new Date();
  const fechaStr = `${now.getDate()}/${now.getMonth()+1}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}`;
  
  const hist = parseHistorial(cred.historialAbonos);

  let histHtml = hist.map((a, idx) => `
    <tr>
      <td style="padding: 4px 0; border-bottom: 1px solid #eee; text-align: left; vertical-align: top;">
        <div style="font-weight: 800;">#${idx + 1} - ${a.fecha}</div>
        <div style="color: #555; font-size: 8.5px; margin-top: 1px;">
          <span style="background: #f1f5f9; padding: 1px 4px; border-radius: 3px; font-weight: 900; font-size: 7.5px; text-transform: uppercase;">${a.metodo || 'Efectivo'}</span>
          ${a.nota ? '• ' + a.nota : ''}
        </div>
      </td>
      <td style="text-align: right; padding: 4px 0; border-bottom: 1px solid #eee; font-weight: 800; vertical-align: bottom;">
        $${new Intl.NumberFormat('es-CO').format(a.monto)}
      </td>
    </tr>
  `).join("");

  const emisor = {
    nombre: ajustes?.nombre || "MI NEGOCIO",
    propietario: ajustes?.propietario || "Juan Pérez",
    nit: ajustes?.nit || "900.123.456-1",
    direccion: (ajustes?.direccion || "Calle 123 No. 45 - 67") + ", " + (ajustes?.ciudad || "Bogotá - Cundinamarca"),
    contacto: ajustes?.contacto || "3001234567",
    correo: ajustes?.correo || "contacto@miempresa.com",
    condiciones: ajustes?.condiciones || "GARANTIA: Equipos probados y encendidos. Sin garantía en displays/táctiles o equipos apagados.",
    logo: ajustes?.logo || "",
    logo_size: ajustes?.logo_size || 40,
    mostrar_nombre: ajustes?.mostrar_nombre !== 0
  };

  printWindow.document.write(`
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
          
          .card { 
            border: 1px solid #e2e8f0; 
            border-radius: 6px; 
            padding: 4px; 
            margin-bottom: 6px; 
            background: #f8fafc;
          }
          .flex-between { display: flex; justify-content: space-between; align-items: flex-start; }
          .badge { 
            background: #dcfce7; color: #166534; 
            padding: 2px 4px; border-radius: 8px; 
            font-size: 8px; font-weight: 900; text-transform: uppercase;
          }
          .badge-error {
            background: #fee2e2; color: #991b1b;
            padding: 2px 4px; border-radius: 8px;
            font-size: 8px; font-weight: 900; text-transform: uppercase;
          }
          
          .section-title {
            font-size: 7px;
            font-weight: 900;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 2px;
            margin-top: 4px;
          }
          
          .summary-card {
            background: #0f172a;
            color: white;
            border-radius: 6px;
            padding: 6px;
            margin-top: 6px;
          }
          .center { text-align: center; }
        </style>
      </head>
      <body>
        <!-- Logo -->
        ${emisor.logo ? `
        <div style="text-align: center; margin-bottom: 4px;">
          <img src="${emisor.logo}" style="max-height: ${emisor.logo_size || 40}px; max-width: 100%; object-fit: contain;">
        </div>
        ` : ''}
        <div class="center" style="margin-bottom: 6px; font-size: 8px; line-height: 1.2; border: 1px solid #e2e8f0; border-radius: 6px; padding: 4px; background: #f8fafc;">
          ${emisor.mostrar_nombre ? `<div class="bold text-sm" style="text-transform: uppercase; color: #000;">${emisor.nombre}</div>` : ''}
          <div>NIT: ${emisor.nit}</div>
          <div>${emisor.direccion}</div>
          <div>Tel: ${emisor.contacto}</div>
        </div>

        <!-- Header / Comprobante -->
        <div class="card">
          <div class="text-xs text-primary bold" style="color: #dc2626; text-transform: uppercase;">RECIBO DE ABONO</div>
          <div class="flex-between" style="margin-top: 2px;">
            <div class="text-xs bold">${cred.tipo === 'Plan Separe' ? 'PLAN SEPARE' : 'CRÉDITO'}</div>
            <div class="${cred.saldo <= 0 ? 'badge' : 'badge-error'}">${cred.saldo <= 0 ? (cred.tipo === 'Plan Separe' ? 'ENTREGADO' : 'PAGADO') : 'PENDIENTE'}</div>
          </div>
          <div class="flex-between" style="margin-top: 2px;">
            <div class="text-xs text-slate-500">${fechaStr}</div>
            <div class="text-xs text-slate-500">Factura Ref: ${cred.idFactura || 'S/N'}</div>
          </div>
        </div>

        <!-- Info Cliente -->
        <div>
          <div class="section-title">INFORMACIÓN DEL CLIENTE</div>
          <div class="bold text-sm">${cred.cliente}</div>
          <div class="text-xs text-slate-500">ID: ${cred.telefono || ''}</div>
        </div>
        
        <div style="border-top: 1px solid #f1f5f9; margin: 6px 0;"></div>
        
        <!-- Detalle Producto -->
        <div>
          <div class="section-title">DETALLE PRODUCTO</div>
          <div class="bold text-sm" style="margin-bottom: 4px;">${cred.detalle || 'Pago de deuda'}</div>
        </div>

        <div style="border-top: 1px solid #f1f5f9; margin: 6px 0;"></div>

        <!-- Historial de Abonos -->
        <div class="section-title">HISTORIAL DE PAGOS</div>
        <table style="width: 100%; border-collapse: collapse; font-size: 8px;">
          ${histHtml}
        </table>

        <!-- Resumen Financiero -->
        <div class="summary-card">
          <div class="flex-between">
            <span class="text-xs">Valor Total:</span>
            <span class="text-xs font-bold">$${new Intl.NumberFormat('es-CO').format(cred.total)}</span>
          </div>
          <div class="flex-between" style="color: #4ade80;">
            <span class="text-xs">Abonado:</span>
            <span class="text-xs font-bold">$${new Intl.NumberFormat('es-CO').format(cred.abonado)}</span>
          </div>
          <div class="flex-between" style="border-top: 1px solid #334155; margin-top: 4px; pt-2; color: #f87171;">
            <span class="text-xs bold">Saldo Pendiente:</span>
            <span class="text-sm font-black">$${new Intl.NumberFormat('es-CO').format(cred.saldo)}</span>
          </div>
        </div>

        <div class="center bold text-xs text-slate-500" style="margin-top: 10px; font-style: italic;">
          ${cred.tipo === 'Plan Separe' ? 'El producto se entregará al completar el pago total.' : 'Conserve este recibo como soporte de pago.'}
        </div>
        <div class="center bold" style="margin-top: 8px; font-size: 9px;">¡GRACIAS POR SU PAGO!</div>
      </body>
    </html>
  `);
  printWindow.document.close();
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 500);
}

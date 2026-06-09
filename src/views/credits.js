import { getCreditos, actualizarCredito, crearCredito } from "../api.js";
import { showToast } from "../toast.js";
import { openCustomerSelector } from "../customer-selector.js";

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
    return { fecha: parts[0] || "", monto: parseFloat(parts[1]) || 0, nota: parts[2] || "" };
  });
}

function serializeHistorial(list) {
  return list.map(a => `${a.fecha}|${a.monto}|${a.nota}`).join(";");
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
  elFilter?.addEventListener("change", filterData);
  elFilterTipo?.addEventListener("change", filterData);

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
            <div class="flex justify-between items-center py-1 border-b border-surface-variant text-xs">
              <span class="text-on-surface-variant">${a.fecha}</span>
              <span class="font-bold text-green-600">${fmt(a.monto)}</span>
              <span class="text-on-surface-variant">${a.nota || ''}</span>
            </div>`).join("");
    }
    document.getElementById("cred-monto-abono").value = "";
    document.getElementById("cred-nota-abono").value = "";
    elModal?.classList.remove("hidden"); elModal?.classList.add("flex");
    document.getElementById("cred-monto-abono")?.focus();
  };

  elBtnSave?.addEventListener("click", async () => {
    const id = document.getElementById("cred-id").value;
    const monto = parseInt((document.getElementById("cred-monto-abono").value || "").replace(/\D/g, "")) || 0;
    const nota  = (document.getElementById("cred-nota-abono")?.value || "").trim();

    if (!monto || monto <= 0) { showToast("Ingresa un monto válido", "warning"); return; }
    if (_isProcessing) return;
    _isProcessing = true;
    elBtnSave.textContent = "Aplicando...";
    elBtnSave.disabled = true;

    try {
      const cred = _creditos.find(c => c.id == id);
      const nuevoAbonado = (cred.abonado || 0) + monto;
      const nuevoSaldo   = Math.max(0, (cred.total || 0) - nuevoAbonado);
      const cancelado    = nuevoSaldo <= 0;

      // Append to historial
      const hist = parseHistorial(cred.historialAbonos);
      hist.push({ fecha: new Date().toLocaleDateString("es-CO"), monto, nota });

      const isSepare = cred.tipo === "Plan Separe";
      const estadoActivo = isSepare ? "Separado" : "Activo";
      const estadoFinal = isSepare ? "Entregado" : "Cancelado";
      
      const d = {
        ...cred,
        abonado: nuevoAbonado,
        saldo: nuevoSaldo,
        estado: cancelado ? estadoFinal : (cred.estado === "Cancelado" || cred.estado === "Entregado" ? estadoFinal : estadoActivo),
        fechaCancelacion: cancelado ? new Date().toLocaleDateString("es-CO") : (cred.fechaCancelacion || ""),
        historialAbonos: serializeHistorial(hist)
      };

      const res = await actualizarCredito(id, d);
      if (res?.success) {
        showToast(cancelado ? "✅ ¡Crédito cancelado!" : "Abono registrado", "success");
        closeModal();
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
      const histInicial = abono > 0
        ? serializeHistorial([{ fecha: new Date().toLocaleDateString("es-CO"), monto: abono, nota: "Abono inicial" }])
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
}

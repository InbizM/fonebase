import { getEgresos, registrarEgreso } from "../api.js";
import { showToast } from "../toast.js";

let _egresos = [];
let _isLoaded = false;
let _isProcessing = false;

// Elements
let elTable, elSearch, elFilter, elBtnNew;
let elModal, elModalClose, elModalBackdrop, elForm, elBtnSave;
let elMonto, elCategoria, elConcepto, elResponsable;

export function initExpenses() {
  return async () => {
    bindElements();
    
    if (!_isLoaded) {
      await loadData();
      setupEvents();
      _isLoaded = true;
    }
    
    renderTable(_egresos);
  };
}

function bindElements() {
  elTable = document.getElementById("exp-table-body");
  elSearch = document.getElementById("exp-search");
  elFilter = document.getElementById("exp-filter-cat");
  elBtnNew = document.getElementById("exp-new-btn");

  elModal = document.getElementById("exp-modal");
  elModalClose = document.getElementById("exp-modal-close");
  elModalBackdrop = document.getElementById("exp-modal-backdrop");
  elForm = document.getElementById("exp-form");
  elBtnSave = document.getElementById("exp-save-btn");

  elMonto = document.getElementById("exp-monto");
  elCategoria = document.getElementById("exp-categoria");
  elConcepto = document.getElementById("exp-concepto");
  elResponsable = document.getElementById("exp-responsable");
}

async function loadData() {
  try {
    elTable.innerHTML = `<tr><td colspan="6" class="p-4 text-center text-on-surface-variant">Cargando egresos...</td></tr>`;
    _egresos = await getEgresos();
  } catch (err) {
    showToast("Error cargando egresos: " + err.message, "error");
    _egresos = [];
  }
}

function renderTable(lista) {
  if (lista.length === 0) {
    elTable.innerHTML = `<tr><td colspan="6" class="p-4 text-center text-on-surface-variant">No se encontraron egresos</td></tr>`;
    return;
  }

  const getCatCls = (cat) => {
    const c = String(cat || "").toLowerCase();
    if (c.includes("servicio")) return "bg-blue-50 text-blue-700 border border-blue-100";
    if (c.includes("nomina") || c.includes("nómina")) return "bg-purple-50 text-purple-700 border border-purple-100";
    if (c.includes("compra")) return "bg-emerald-50 text-emerald-700 border border-emerald-100";
    if (c.includes("arriendo")) return "bg-amber-50 text-amber-700 border border-amber-100";
    return "bg-slate-50 text-slate-700 border border-slate-100";
  };

  elTable.innerHTML = lista.map(e => {
    const catCls = getCatCls(e.categoria);
    return `
      <tr class="hover:bg-surface-container-low transition-colors">
        <td class="px-4 py-3">
          <div class="font-mono text-[10px] font-medium text-on-surface-variant hidden md:block">${e.id || '-'}</div>
          <div class="text-xs font-bold text-on-surface">${e.fecha || ''}</div>
        </td>
        <td class="px-4 py-3">
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${catCls}">
            ${e.categoria || 'Otro'}
          </span>
        </td>
        <td class="px-4 py-3 text-sm font-semibold text-on-surface max-w-[200px] truncate" title="${e.concepto}">
          ${e.concepto || '-'}
        </td>
        <td class="px-4 py-3 text-sm text-on-surface-variant hidden md:table-cell">${e.responsable || '-'}</td>
        <td class="px-4 py-3 text-sm font-black text-red-600">-$${new Intl.NumberFormat("es-CO").format(e.monto || 0)}</td>
        <td class="px-4 py-3 text-right hidden md:table-cell">
          <button class="p-1.5 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-lg transition-colors opacity-50 cursor-not-allowed" title="No se pueden editar egresos por seguridad">
            <span class="material-symbols-outlined text-[18px]">lock</span>
          </button>
        </td>
      </tr>
    `;
  }).join("");
}

function setupEvents() {
  const filterData = () => {
    const q = elSearch.value.toLowerCase().trim();
    const cat = elFilter.value;
    
    const filtered = _egresos.filter(e => {
      const matchQ = (e.concepto || "").toLowerCase().includes(q) ||
                     (e.responsable || "").toLowerCase().includes(q) ||
                     (e.id || "").toLowerCase().includes(q);
      const matchC = cat ? e.categoria === cat : true;
      return matchQ && matchC;
    });
    renderTable(filtered);
  };

  elSearch.addEventListener("input", filterData);
  if (window.setupCustomSelect) {
    window.setupCustomSelect("exp-filter-cat-container", "exp-filter-cat", filterData);
    window.setupCustomSelect("exp-categoria-container", "exp-categoria");
  }

  // Helper to format numbers
  const formatNumberInput = (e) => {
    let val = e.target.value.replace(/\D/g, "");
    if (!val) {
      e.target.value = "";
      return;
    }
    e.target.value = new Intl.NumberFormat("es-CO").format(parseInt(val, 10));
  };

  elMonto.addEventListener("input", formatNumberInput);

  elBtnNew.addEventListener("click", () => openModal());
  elModalClose.addEventListener("click", closeModal);
  elModalBackdrop.addEventListener("click", closeModal);
  elBtnSave.addEventListener("click", saveEgreso);
}

function openModal() {
  elForm.reset();
  if (window.syncCustomSelectUI) {
    window.syncCustomSelectUI("exp-categoria-container", elCategoria.value || "Compra Inventario");
  }
  
  // Set default responsible from cache
  try {
    const userJson = localStorage.getItem("adminpro_user");
    if (userJson) {
      const user = JSON.parse(userJson);
      elResponsable.value = user.nombre || user.email;
    }
  } catch (e) {
    elResponsable.value = "Sistema";
  }

  elModal.classList.remove("hidden");
  elModal.classList.add("flex");
  elMonto.focus();
}

function closeModal() {
  elModal.classList.add("hidden");
  elModal.classList.remove("flex");
}

async function saveEgreso() {
  if (!elForm.checkValidity()) {
    elForm.reportValidity();
    return;
  }
  
  if (_isProcessing) return;
  _isProcessing = true;
  elBtnSave.textContent = "Registrando...";
  elBtnSave.disabled = true;

  try {
    const datos = {
      monto: parseInt(elMonto.value.replace(/\D/g, "")) || 0,
      categoria: elCategoria.value,
      concepto: elConcepto.value.trim(),
      responsable: elResponsable.value
    };

    const res = await registrarEgreso(datos);

    if (res && res.success) {
      showToast("Egreso registrado", "success");
      closeModal();
      await loadData();
      renderTable(_egresos);
    } else {
      showToast(res?.mensaje || "Error al registrar", "error");
    }
  } catch (err) {
    showToast("Error de conexión: " + err.message, "error");
  } finally {
    _isProcessing = false;
    elBtnSave.innerHTML = `<span class="material-symbols-outlined text-[18px]">save</span> Guardar`;
    elBtnSave.disabled = false;
  }
}

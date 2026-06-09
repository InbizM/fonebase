import { getReventas, crearReventa, actualizarReventa, eliminarReventa } from "../api.js";
import { showToast } from "../toast.js";

let _pedidos = [];
let _isLoaded = false;
let _isProcessing = false;

// Elements
let elTable, elSearch, elFilter, elBtnNew;
let elModal, elModalClose, elModalBackdrop, elForm, elBtnSave;
let elId, elProducto, elCategoria, elProveedor, elCosto, elPrecio;

export function initReventas() {
  return async () => {
    bindElements();
    
    if (!_isLoaded) {
      await loadData();
      setupEvents();
      _isLoaded = true;
    }
    
    renderTable(_pedidos);
  };
}

function bindElements() {
  elTable = document.getElementById("ped-table-body");
  elSearch = document.getElementById("ped-search");
  elFilter = document.getElementById("ped-filter-status");
  elBtnNew = document.getElementById("ped-new-btn");

  elModal = document.getElementById("ped-modal");
  elModalClose = document.getElementById("ped-modal-close");
  elModalBackdrop = document.getElementById("ped-modal-backdrop");
  elForm = document.getElementById("ped-form");
  elBtnSave = document.getElementById("ped-save-btn");

  elId = document.getElementById("ped-id");
  elProducto = document.getElementById("ped-producto");
  elCategoria = document.getElementById("ped-categoria");
  elProveedor = document.getElementById("ped-proveedor");
  elCosto = document.getElementById("ped-costo");
  elPrecio = document.getElementById("ped-precio");
}

async function loadData() {
  try {
    if (elTable) elTable.innerHTML = `<tr><td colspan="6" class="p-4 text-center text-on-surface-variant">Cargando reventas...</td></tr>`;
    _pedidos = await getReventas();
  } catch (err) {
    showToast("Error cargando reventas: " + err.message, "error");
    _pedidos = [];
  }
}

function renderTable(lista) {
  if (!elTable) return;
  if (lista.length === 0) {
    elTable.innerHTML = `<tr><td colspan="6" class="p-4 text-center text-on-surface-variant">No se encontraron reventas</td></tr>`;
    return;
  }

  const user = JSON.parse(localStorage.getItem("adminpro_user") || "{}");
  const isAdmin = user.rol === "Administrador";

  elTable.innerHTML = lista.map(p => {
    const costo = Number(p.costo || 0);
    const precio = Number(p.precio || 0);
    const utilidad = Number(p.utilidad || (precio - costo));
    
    const fmt = n => new Intl.NumberFormat("es-CO").format(n);
    
    const getCatCls = (cat) => {
      const c = String(cat || "").toLowerCase();
      if (c.includes("celular") || c.includes("teléfono")) return "bg-blue-50 text-blue-700 border border-blue-100";
      if (c.includes("accesorio")) return "bg-purple-50 text-purple-700 border border-purple-100";
      if (c.includes("repuesto")) return "bg-orange-50 text-orange-700 border border-orange-100";
      return "bg-slate-50 text-slate-600 border border-slate-100";
    };

    const catCls = getCatCls(p.categoria);

    return `
      <tr class="hover:bg-surface-container-low transition-colors text-sm">
        <td class="px-4 py-3 font-mono font-bold hidden md:table-cell">${p.id || '-'}</td>
        <td class="px-4 py-3 font-black text-on-surface">${p.producto || '-'}</td>
        <td class="px-4 py-3">
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${catCls}">
            ${p.categoria || 'Otros'}
          </span>
        </td>
        <td class="px-4 py-3">
          <p class="text-[10px] text-on-surface-variant line-through hidden md:block">C: $${fmt(costo)}</p>
          <p class="font-bold text-primary">V: $${fmt(precio)}</p>
        </td>
        <td class="px-4 py-3 font-black ${utilidad >= 0 ? 'text-green-600' : 'text-red-600'}">$${fmt(utilidad)}</td>
        <td class="px-4 py-3 text-right">
          ${isAdmin ? `<button onclick="window.pedDelete('${p.id}')" class="p-1.5 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-full transition-colors" title="Eliminar">
            <span class="material-symbols-outlined text-[18px]">delete</span>
          </button>` : ''}
        </td>
      </tr>
    `;
  }).join("");
}

function setupEvents() {
  const filterData = () => {
    if (!elSearch) return;
    const q = elSearch.value.toLowerCase().trim();
    const st = elFilter ? elFilter.value : "";
    const filtered = _pedidos.filter(p => {
      const matchQ = (p.producto || "").toLowerCase().includes(q) || (p.id || "").toLowerCase().includes(q);
      const matchS = st ? p.categoria === st : true;
      return matchQ && matchS;
    });
    renderTable(filtered);
  };

  elSearch?.addEventListener("input", filterData);
  elFilter?.addEventListener("change", filterData);

  const formatNumberInput = (e) => {
    let val = e.target.value.replace(/\D/g, "");
    if (!val) { e.target.value = ""; return; }
    e.target.value = new Intl.NumberFormat("es-CO").format(parseInt(val, 10));
  };

  elCosto?.addEventListener("input", formatNumberInput);
  elPrecio?.addEventListener("input", formatNumberInput);

  elBtnNew?.addEventListener("click", () => openModal(null));
  elModalClose?.addEventListener("click", closeModal);
  elModalBackdrop?.addEventListener("click", closeModal);
  elBtnSave?.addEventListener("click", savePedido);

  window.pedDelete = async (id) => {
    if (!confirm(`¿Eliminar la reventa ${id}?`)) return;
    try {
      const res = await eliminarReventa(id);
      if (res && res.success) {
        showToast("Eliminada", "success");
        await loadData();
        renderTable(_pedidos);
      }
    } catch (err) { showToast(err.message, "error"); }
  };
}

function openModal(ped) {
  if (!elModal) return;
  elForm?.reset();
  if (ped) {
    if (elId) elId.value = ped.id;
    if (elProducto) elProducto.value = ped.producto || "";
    if (elCosto) elCosto.value = ped.costo || 0;
    if (elPrecio) elPrecio.value = ped.precio || 0;
  }
  elModal.classList.remove("hidden");
  elModal.classList.add("flex");
}

function closeModal() {
  elModal?.classList.add("hidden");
  elModal?.classList.remove("flex");
}

async function savePedido() {
  if (_isProcessing) return;
  _isProcessing = true;
  try {
    const datos = {
      producto: elProducto?.value.trim(),
      categoria: elCategoria?.value,
      proveedor: elProveedor?.value.trim(),
      costo: parseInt(elCosto?.value.replace(/\D/g, "")) || 0,
      precio: parseInt(elPrecio?.value.replace(/\D/g, "")) || 0
    };
    const res = await crearReventa(datos);
    if (res.success) {
      showToast("Guardado", "success");
      closeModal();
      await loadData();
      renderTable(_pedidos);
    }
  } catch (err) { showToast(err.message, "error"); }
  finally { _isProcessing = false; }
}

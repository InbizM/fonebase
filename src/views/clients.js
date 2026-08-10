import { getClientes, crearCliente, actualizarCliente, eliminarCliente } from "../api.js";
import { showToast, showConfirm } from "../toast.js";

let _clientes = [];
let _isLoaded = false;
let _isProcessing = false;

// Elements
let elTable, elSearch, elBtnNew;
let elModal, elModalClose, elModalBackdrop, elForm, elBtnSave;
let elDoc, elNombre, elTel, elEmail, elDir, elTipo, elOriginal;

export function initClients() {
  return async () => {
    bindElements();
    
    if (!_isLoaded) {
      await loadData();
      setupEvents();
      _isLoaded = true;
    }
    
    const pendingQuery = localStorage.getItem("clients_search_query");
    if (pendingQuery !== null) {
      localStorage.removeItem("clients_search_query");
      if (elSearch) {
        elSearch.value = pendingQuery;
        const q = pendingQuery.toLowerCase().trim();
        const filtered = _clientes.filter(c => 
          (c.cedula || "").toLowerCase().includes(q) ||
          (c.nombre || "").toLowerCase().includes(q) ||
          (c.telefono || "").toLowerCase().includes(q)
        );
        renderTable(filtered);
        return;
      }
    }
    
    renderTable(_clientes);
  };
}

function bindElements() {
  elTable = document.getElementById("cli-table-body");
  elSearch = document.getElementById("cli-search");
  elBtnNew = document.getElementById("cli-new-btn");

  elModal = document.getElementById("cli-modal");
  elModalClose = document.getElementById("cli-modal-close");
  elModalBackdrop = document.getElementById("cli-modal-backdrop");
  elForm = document.getElementById("cli-form");
  elBtnSave = document.getElementById("cli-save-btn");

  elDoc = document.getElementById("cli-doc");
  elNombre = document.getElementById("cli-nombre");
  elTel = document.getElementById("cli-tel");
  elEmail = document.getElementById("cli-email");
  elDir = document.getElementById("cli-dir");
  elTipo = document.getElementById("cli-tipo");
  elOriginal = document.getElementById("cli-original");
}

async function loadData() {
  try {
    elTable.innerHTML = `<tr><td colspan="6" class="p-4 text-center text-on-surface-variant">Cargando clientes...</td></tr>`;
    _clientes = await getClientes();
  } catch (err) {
    showToast("Error cargando clientes: " + err.message, "error");
    _clientes = [];
  }
}

function renderTable(lista) {
  if (lista.length === 0) {
    elTable.innerHTML = `<tr><td colspan="6" class="p-4 text-center text-on-surface-variant">No se encontraron clientes</td></tr>`;
    return;
  }

  const user = JSON.parse(localStorage.getItem("adminpro_user") || "{}");
  const isAdmin = user.rol === "Administrador";

  elTable.innerHTML = lista.map(c => {
    const tipoColor = c.tipo === "VIP" ? "bg-amber-50 text-amber-700 border border-amber-100" 
                    : c.tipo === "Empresa" ? "bg-blue-50 text-blue-700 border border-blue-100"
                    : c.tipo === "Mayorista" ? "bg-purple-50 text-purple-700 border border-purple-100"
                    : "bg-slate-50 text-slate-500 border border-slate-100";
    
    const initials = (c.nombre || "C").split(" ").filter(Boolean).map(n => n[0]).join("").substring(0, 2).toUpperCase();

    return `
      <tr class="hover:bg-surface-container-low transition-colors">
        <td class="px-4 py-3 font-mono text-xs font-bold text-on-surface hidden md:table-cell">${c.cedula || '-'}</td>
        <td class="px-4 py-3">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-primary/5 text-primary flex items-center justify-center font-black text-xs shrink-0 border border-primary/10">
              ${initials}
            </div>
            <div>
              <p class="font-black text-sm text-on-surface">${c.nombre || '-'}</p>
              <p class="text-[10px] text-on-surface-variant font-mono md:hidden">Doc: ${c.cedula || '-'}</p>
            </div>
          </div>
        </td>
        <td class="px-4 py-3">
          <div class="flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant mb-0.5">
            <span class="material-symbols-outlined text-[15px] text-primary/65">call</span> ${c.telefono || '-'}
          </div>
          ${c.email ? `<div class="flex items-center gap-1.5 text-[11px] text-on-surface-variant"><span class="material-symbols-outlined text-[15px] text-primary/45">mail</span> ${c.email}</div>` : ''}
        </td>
        <td class="px-4 py-3 text-sm text-on-surface-variant hidden md:table-cell">${c.direccion || '-'}</td>
        <td class="px-4 py-3">
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase ${tipoColor}">
            ${c.tipo || 'Normal'}
          </span>
        </td>
        <td class="px-4 py-3 text-right">
          <div class="flex items-center justify-end gap-1">
            ${isAdmin ? `<button onclick="window.cliEdit('${c.cedula}')" class="p-1.5 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-full transition-colors" title="Editar">
              <span class="material-symbols-outlined text-[18px]">edit</span>
            </button>` : ''}
            ${isAdmin ? `<button onclick="window.cliDelete('${c.cedula}')" class="p-1.5 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-full transition-colors" title="Eliminar">
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
    const filtered = _clientes.filter(c => 
      (c.cedula || "").toLowerCase().includes(q) ||
      (c.nombre || "").toLowerCase().includes(q) ||
      (c.telefono || "").toLowerCase().includes(q)
    );
    renderTable(filtered);
  };

  elSearch.addEventListener("input", filterData);
  if (window.setupCustomSelect) {
    window.setupCustomSelect("cli-tipo-container", "cli-tipo");
  }

  elBtnNew.addEventListener("click", () => openModal(null));
  elModalClose.addEventListener("click", closeModal);
  elModalBackdrop.addEventListener("click", closeModal);
  
  elBtnSave.addEventListener("click", saveCliente);

  window.cliEdit = (cedula) => {
    const cli = _clientes.find(c => c.cedula == cedula);
    if (cli) openModal(cli);
  };

  window.cliDelete = async (cedula) => {
    const ok = await showConfirm("Confirmación", `¿Eliminar al cliente con documento ${cedula}?`);
    if (!ok) return;
    try {
      showToast("Eliminando...", "info");
      const res = await eliminarCliente(cedula);
      if (res && res.success) {
        showToast("Cliente eliminado", "success");
        await loadData();
        filterData();
      } else {
        showToast(res.mensaje || "Error al eliminar", "error");
      }
    } catch (err) {
      showToast("Error: " + err.message, "error");
    }
  };
}

function openModal(cli) {
  elForm.reset();
  if (cli) {
    elOriginal.value = cli.cedula;
    elDoc.value = cli.cedula;
    elNombre.value = cli.nombre || "";
    elTel.value = cli.telefono || "";
    elEmail.value = cli.email || "";
    elDir.value = cli.direccion || "";
    elTipo.value = cli.tipo || "Normal";
    document.getElementById("cli-modal-title").textContent = "Editar Cliente";
  } else {
    elOriginal.value = "";
    elTipo.value = "Normal";
    document.getElementById("cli-modal-title").textContent = "Nuevo Cliente";
  }
  
  if (window.syncCustomSelectUI) {
    window.syncCustomSelectUI("cli-tipo-container", elTipo.value);
  }
  
  elModal.classList.remove("hidden");
  elModal.classList.add("flex");
}

function closeModal() {
  elModal.classList.add("hidden");
  elModal.classList.remove("flex");
}

async function saveCliente() {
  if (!elForm.checkValidity()) {
    elForm.reportValidity();
    return;
  }
  
  if (_isProcessing) return;
  _isProcessing = true;
  elBtnSave.textContent = "Guardando...";
  elBtnSave.disabled = true;

  try {
    const idOrig = elOriginal.value;
    const datos = {
      cedula: elDoc.value.trim(),
      nombre: elNombre.value.trim(),
      telefono: elTel.value.trim(),
      email: elEmail.value.trim(),
      direccion: elDir.value.trim(),
      tipo: elTipo.value
    };

    let res;
    if (idOrig) {
      res = await actualizarCliente(idOrig, datos);
    } else {
      res = await crearCliente(datos);
    }

    if (res && res.success) {
      showToast("Cliente guardado", "success");
      closeModal();
      await loadData();
      renderTable(_clientes);
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

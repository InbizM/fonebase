import { getUsers, crearUsuario, actualizarUsuario, eliminarUsuario, reset2fa, getLocalesConfigurados } from "../api.js";
import { showToast, showConfirm } from "../toast.js";

let _usuarios = [];
let _locales = [];
let _isLoaded = false;
let _isProcessing = false;
let _editingEmail = null;

export function initUsers() {
  return async () => {
    if (!_isLoaded) {
      await loadUsers();
      setupEvents();
      _isLoaded = true;
    }
    renderTable(_usuarios);
  };
}

async function loadUsers() {
  const table = document.getElementById("user-table-body");
  try {
    if (table) table.innerHTML = `<tr><td colspan="6" class="p-8 text-center opacity-50">Cargando equipo...</td></tr>`;
    const [usersRes, localesRes] = await Promise.all([
      getUsers(),
      getLocalesConfigurados()
    ]);
    _usuarios = usersRes || [];
    _locales = localesRes || [];
  } catch (err) {
    showToast("Error al cargar usuarios", "error");
    _usuarios = [];
  }
}

function renderTable(lista) {
  const container = document.getElementById("user-table-body");
  if (!container) return;

  if (lista.length === 0) {
    container.innerHTML = `<tr><td colspan="6" class="p-10 text-center opacity-40 italic">No hay usuarios registrados</td></tr>`;
    return;
  }

  container.innerHTML = lista.map(u => {
    const initials = (u.nombre || "U").split(" ").filter(Boolean).map(n => n[0]).join("").substring(0, 2).toUpperCase();
    const rolColor = u.rol === 'Administrador' ? 'bg-purple-50 text-purple-700 border border-purple-100'
                   : u.rol === 'Vendedor' ? 'bg-blue-50 text-blue-700 border border-blue-100'
                   : 'bg-orange-50 text-orange-700 border border-orange-100';

    const sucursalId = String(u.sucursal_id || "1").trim();
    let sucursalNombre = "Principal";
    if (sucursalId === "0" || sucursalId === "all") {
      sucursalNombre = "Todas las Sucursales";
    } else {
      const matchLocal = _locales.find(l => String(l.id).trim() === sucursalId);
      if (matchLocal) sucursalNombre = matchLocal.nombre;
    }

    return `
      <tr class="hover:bg-surface-container-low transition-colors text-sm">
        <td class="px-4 py-4">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-primary/5 text-primary flex items-center justify-center font-black text-xs shrink-0 border border-primary/10">
              ${initials}
            </div>
            <div>
              <p class="font-black text-sm text-on-surface">${u.nombre}</p>
              <p class="text-[10px] text-on-surface-variant font-medium md:hidden">${u.email}</p>
            </div>
          </div>
        </td>
        <td class="px-4 py-4 text-on-surface-variant hidden md:table-cell">${u.email}</td>
        <td class="px-4 py-4 text-center">
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${rolColor}">${u.rol}</span>
        </td>
        <td class="px-4 py-4 text-center">
          <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <span class="material-symbols-outlined text-[14px] text-slate-500">storefront</span>
            ${sucursalNombre}
          </span>
        </td>
        <td class="px-4 py-4 text-center">
          <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${u.estado === 'Activo' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-slate-50 text-slate-500 border border-slate-100'}">
            <span class="w-1.5 h-1.5 rounded-full ${u.estado === 'Activo' ? 'bg-green-600' : 'bg-slate-400'}"></span>
            ${u.estado}
          </span>
        </td>
        <td class="px-4 py-4 text-right">
          <div class="flex items-center justify-end gap-1">
            <button onclick="window.userReset2FA('${u.email}')" class="p-1.5 text-amber-600 hover:bg-amber-50 rounded-full transition-colors" title="Restablecer 2FA"><span class="material-symbols-outlined text-[18px]">lock_reset</span></button>
            <button onclick="window.userEdit('${u.email}')" class="p-1.5 text-primary hover:bg-primary/10 rounded-full transition-colors" title="Editar"><span class="material-symbols-outlined text-[18px]">edit</span></button>
            <button onclick="window.userDelete('${u.email}')" class="p-1.5 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-full transition-colors" title="Eliminar"><span class="material-symbols-outlined text-[18px]">delete</span></button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

function setupEvents() {
  window.setupCustomSelect("user-input-rol-container", "user-input-rol");
  window.setupCustomSelect("user-input-estado-container", "user-input-estado");
  window.setupCustomSelect("user-input-sucursal-container", "user-input-sucursal");

  document.getElementById("user-search")?.addEventListener("input", (e) => {
    const q = e.target.value.toLowerCase().trim();
    renderTable(_usuarios.filter(u => u.nombre.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)));
  });

  document.getElementById("user-new-btn")?.addEventListener("click", () => openModal());
  document.getElementById("user-modal-close")?.addEventListener("click", closeModal);
  document.getElementById("user-modal-backdrop")?.addEventListener("click", closeModal);
  document.getElementById("user-form")?.addEventListener("submit", saveUser);

  window.userEdit = (email) => {
    const u = _usuarios.find(x => x.email === email);
    if (u) openModal(u);
  };

  window.userDelete = async (email) => {
    const me = JSON.parse(localStorage.getItem("adminpro_user") || "{}");
    if (email === me.email) return showToast("No puedes eliminarte a ti mismo", "warning");
    
    const ok = await showConfirm("Confirmación", `¿Eliminar al usuario ${email}?`);
    if (!ok) return;
    try {
      await eliminarUsuario(email);
      showToast("Usuario eliminado", "success");
      await loadUsers();
      renderTable(_usuarios);
    } catch (err) { showToast(err.message, "error"); }
  };

  window.userReset2FA = async (email) => {
    const ok = await showConfirm("Confirmación", `¿Restablecer el 2FA de ${email}? El usuario deberá escanear un nuevo código QR en su móvil en su próximo inicio de sesión.`);
    if (!ok) return;
    try {
      await reset2fa(email);
      showToast("2FA restablecido con éxito", "success");
      await loadUsers();
      renderTable(_usuarios);
    } catch (err) {
      showToast(err.message, "error");
    }
  };
}

function openModal(u = null) {
  _editingEmail = u ? u.email : null;
  const form = document.getElementById("user-form");
  form.reset();
  document.getElementById("user-modal-title").textContent = u ? "Editar Usuario" : "Nuevo Usuario";

  // Poblar opciones del custom select de sucursales
  const sucursalContainer = document.getElementById("user-input-sucursal-container");
  const sucursalInput = document.getElementById("user-input-sucursal");
  if (sucursalContainer && sucursalInput) {
    const optionsMenu = sucursalContainer.querySelector(".custom-select-options");
    let optionsHtml = `
      <div data-value="0" class="custom-option px-4 py-2.5 text-sm font-semibold text-on-surface hover:bg-surface-variant/20 flex items-center gap-3 cursor-pointer transition-colors">
        <span class="material-symbols-outlined text-[18px] text-slate-400">public</span>
        <span class="flex-1">Todas las Sucursales (Acceso Global)</span>
        <span class="material-symbols-outlined text-[16px] text-primary check-icon hidden">check_circle</span>
      </div>
    `;
    if (_locales.length > 0) {
      optionsHtml += _locales.map(l => `
        <div data-value="${l.id}" class="custom-option px-4 py-2.5 text-sm font-semibold text-on-surface hover:bg-surface-variant/20 flex items-center gap-3 cursor-pointer transition-colors">
          <span class="material-symbols-outlined text-[18px] text-slate-400">storefront</span>
          <span class="flex-1">${l.nombre}</span>
          <span class="material-symbols-outlined text-[16px] text-primary check-icon hidden">check_circle</span>
        </div>
      `).join("");
    } else {
      optionsHtml += `
        <div data-value="1" class="custom-option px-4 py-2.5 text-sm font-semibold text-on-surface hover:bg-surface-variant/20 flex items-center gap-3 cursor-pointer transition-colors">
          <span class="material-symbols-outlined text-[18px] text-slate-400">storefront</span>
          <span class="flex-1">Principal</span>
          <span class="material-symbols-outlined text-[16px] text-primary check-icon hidden">check_circle</span>
        </div>
      `;
    }
    if (optionsMenu) optionsMenu.innerHTML = optionsHtml;

    const targetVal = u ? String(u.sucursal_id || "1").trim() : "1";
    sucursalInput.value = targetVal;
    window.syncCustomSelectUI("user-input-sucursal-container", targetVal);
  }

  if (u) {
    document.getElementById("user-input-name").value = u.nombre;
    document.getElementById("user-input-email").value = u.email;
    document.getElementById("user-input-password").value = u.password;
    document.getElementById("user-input-rol").value = u.rol;
    document.getElementById("user-input-estado").value = u.estado;
  }

  window.syncCustomSelectUI("user-input-rol-container", document.getElementById("user-input-rol").value || "Vendedor");
  window.syncCustomSelectUI("user-input-estado-container", document.getElementById("user-input-estado").value || "Activo");
  
  const modal = document.getElementById("user-modal");
  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function closeModal() {
  const modal = document.getElementById("user-modal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

async function saveUser(e) {
  e.preventDefault();
  if (_isProcessing) return;
  _isProcessing = true;
  const btn = document.getElementById("user-save-btn");
  btn.disabled = true;
  btn.innerHTML = "Guardando...";

  const getVal = id => document.getElementById(id).value.trim();

  const email = getVal("user-input-email").toLowerCase();
  const sucursalId = getVal("user-input-sucursal") || "1";
  const datos = [
    email,
    getVal("user-input-password"),
    getVal("user-input-name"),
    getVal("user-input-rol"),
    getVal("user-input-estado"),
    sucursalId
  ];

  try {
    if (_editingEmail) {
      await actualizarUsuario(_editingEmail, email, [datos[1], datos[2], datos[3], datos[4], datos[5]]);
    } else {
      await crearUsuario(datos);
    }
      
    showToast(_editingEmail ? "Actualizado" : "Creado", "success");
    closeModal();
    await loadUsers();
    renderTable(_usuarios);
  } catch (err) {
    showToast(err.message, "error");
  } finally {
    _isProcessing = false;
    btn.disabled = false;
    btn.innerHTML = "Guardar Usuario";
  }
}

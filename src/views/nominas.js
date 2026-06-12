import { getNominas, crearNomina, eliminarNomina, getUsers } from "../api.js";
import { showToast, showConfirm } from "../toast.js";

let _nominas = [];
let _usuarios = [];

export function initNominas() {
  return async () => {
    await loadData();
    setupEvents();
  };
}

async function loadData() {
  try {
    const listEl = document.getElementById("nom-list");
    if (listEl) listEl.innerHTML = `<tr><td colspan="6" class="p-4 text-center text-sm text-on-surface-variant">Cargando nóminas...</td></tr>`;

    [_nominas, _usuarios] = await Promise.all([
      getNominas(),
      getUsers()
    ]);
    renderList(_nominas);
    updateStats(_nominas);
  } catch (err) {
    showToast("Error al cargar nóminas", "error");
  }
}

function renderList(data) {
  const listEl = document.getElementById("nom-list");
  if (!listEl) return;

  if (!data || data.length === 0) {
    listEl.innerHTML = `
      <tr>
        <td colspan="6" class="p-8 text-center text-on-surface-variant">
          <span class="material-symbols-outlined text-4xl mb-2 opacity-50" style="font-variation-settings:'FILL' 1">request_quote</span>
          <p class="text-sm font-medium">No hay nóminas registradas</p>
        </td>
      </tr>
    `;
    return;
  }

  listEl.innerHTML = data.map(n => {
    const d = new Date(n.fecha).toLocaleDateString("es-CO", { year: "numeric", month: "short", day: "numeric" });
    const total = parseFloat(n.total_pagar) || 0;
    
    let estadoClass = "bg-amber-50 text-amber-700 border border-amber-100";
    if (n.estado === "Pagado") estadoClass = "bg-green-50 text-green-700 border border-green-100";
    else if (n.estado === "Anulado") estadoClass = "bg-red-50 text-red-700 border border-red-100";

    return `
      <tr class="hover:bg-surface-container-low transition-colors group">
        <td class="px-4 py-3 whitespace-nowrap">
          <p class="text-sm font-semibold text-on-surface">${d}</p>
          <p class="text-[10px] text-on-surface-variant font-mono mt-0.5 hidden md:block">${n.id_nomina}</p>
        </td>
        <td class="px-4 py-3">
          <p class="text-sm font-black text-on-surface">${n.empleado}</p>
          <p class="text-xs text-on-surface-variant">${n.periodo}</p>
        </td>
        <td class="px-4 py-3 text-right hidden md:table-cell">
          <p class="text-sm font-medium text-on-surface">$${parseFloat(n.salario_base).toLocaleString("es-CO")}</p>
          ${parseFloat(n.bonificaciones) > 0 ? `<p class="text-[11px] text-green-600">+ $${parseFloat(n.bonificaciones).toLocaleString()}</p>` : ""}
          ${parseFloat(n.deducciones) > 0 ? `<p class="text-[11px] text-red-600">- $${parseFloat(n.deducciones).toLocaleString()}</p>` : ""}
        </td>
        <td class="px-4 py-3 text-right">
          <span class="text-sm font-black text-primary">$${total.toLocaleString("es-CO")}</span>
        </td>
        <td class="px-4 py-3 text-center">
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${estadoClass}">${n.estado}</span>
        </td>
        <td class="px-4 py-3 text-right">
          <button class="nom-del-btn p-1.5 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-full transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100" data-id="${n.id_nomina}" title="Eliminar">
            <span class="material-symbols-outlined text-[18px]">delete</span>
          </button>
        </td>
      </tr>
    `;
  }).join("");

  document.querySelectorAll(".nom-del-btn").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      const id = e.currentTarget.dataset.id;
      const ok = await showConfirm("Confirmación", "¿Estás seguro de eliminar este registro de nómina?");
      if (ok) {
        try {
          await eliminarNomina(id);
          showToast("Nómina eliminada", "success");
          loadData();
        } catch (err) {
          showToast("Error al eliminar", "error");
        }
      }
    });
  });
}

function updateStats(data) {
  const d = new Date();
  const currentMonth = d.getMonth();
  const currentYear = d.getFullYear();

  let totalMes = 0;
  let totalPendiente = 0;

  data.forEach(n => {
    const nd = new Date(n.fecha);
    if (nd.getMonth() === currentMonth && nd.getFullYear() === currentYear) {
      if (n.estado !== "Anulado") {
        totalMes += parseFloat(n.total_pagar) || 0;
      }
    }
    if (n.estado === "Pendiente") {
      totalPendiente += parseFloat(n.total_pagar) || 0;
    }
  });

  const elMes = document.getElementById("nom-stat-mes");
  const elPendiente = document.getElementById("nom-stat-pendiente");

  if (elMes) elMes.textContent = "$" + totalMes.toLocaleString("es-CO");
  if (elPendiente) elPendiente.textContent = "$" + totalPendiente.toLocaleString("es-CO");
}

function updateFormTotals() {
  const base = parseFloat(document.getElementById("nom-base").value) || 0;
  const bonos = parseFloat(document.getElementById("nom-bonos").value) || 0;
  const deduc = parseFloat(document.getElementById("nom-deduc").value) || 0;
  const total = base + bonos - deduc;
  
  document.getElementById("nom-total-calc").textContent = "$" + total.toLocaleString("es-CO");
}

let _eventsBound = false;
function setupEvents() {
  if (_eventsBound) return;
  _eventsBound = true;

  // Inicializar selectores personalizados
  window.setupCustomSelect("nom-estado-container", "nom-estado");
  window.setupCustomSelect("nom-empleado-container", "nom-empleado");

  const modal = document.getElementById("nom-modal");
  const form = document.getElementById("nom-form");

  document.getElementById("nom-new-btn")?.addEventListener("click", () => {
    form.reset();
    
    // Poblar dropdown de empleados de forma dinámica
    const items = _usuarios.map(u => {
      let icon = "person";
      if (u.rol === "Administrador") icon = "shield_person";
      else if (u.rol === "Técnico de reparación") icon = "build";
      else if (u.rol === "Vendedor") icon = "badge";
      return {
        value: u.nombre,
        label: `${u.nombre} (${u.rol})`,
        icon: icon
      };
    });
    window.buildCustomSelectOptions("nom-empleado-container", "nom-empleado", items, "Seleccione empleado...");
    
    // Sincronizar selectores
    window.syncCustomSelectUI("nom-estado-container", "Pendiente");
    window.syncCustomSelectUI("nom-empleado-container", "");
    
    updateFormTotals();
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  });

  document.getElementById("nom-modal-close")?.addEventListener("click", () => {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  });

  document.getElementById("nom-modal-cancel")?.addEventListener("click", () => {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  });

  // Eventos para recalcular el total al escribir
  document.getElementById("nom-base")?.addEventListener("input", updateFormTotals);
  document.getElementById("nom-bonos")?.addEventListener("input", updateFormTotals);
  document.getElementById("nom-deduc")?.addEventListener("input", updateFormTotals);

  document.getElementById("nom-save-btn")?.addEventListener("click", async () => {
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const base = parseFloat(document.getElementById("nom-base").value) || 0;
    const bonos = parseFloat(document.getElementById("nom-bonos").value) || 0;
    const deduc = parseFloat(document.getElementById("nom-deduc").value) || 0;
    const total = base + bonos - deduc;

    const data = {
      empleado: document.getElementById("nom-empleado").value,
      periodo: document.getElementById("nom-periodo").value,
      salario_base: base,
      bonificaciones: bonos,
      deducciones: deduc,
      total_pagar: total,
      estado: document.getElementById("nom-estado").value,
      notas: document.getElementById("nom-notas").value
    };

    const btn = document.getElementById("nom-save-btn");
    btn.disabled = true;
    btn.innerHTML = `<span class="material-symbols-outlined text-[18px] animate-spin">refresh</span> Guardando...`;

    try {
      await crearNomina(data);
      showToast("Nómina registrada exitosamente", "success");
      modal.classList.add("hidden");
      modal.classList.remove("flex");
      loadData();
    } catch (err) {
      showToast("Error al guardar: " + err.message, "error");
    } finally {
      btn.disabled = false;
      btn.innerHTML = `<span class="material-symbols-outlined text-[18px]">save</span> Guardar`;
    }
  });
}

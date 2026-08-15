import { getNominas, crearNomina, eliminarNomina, getUsers, getPrestamos, crearPrestamo, actualizarPrestamoEstado, eliminarPrestamo, getInventario, actualizarProducto } from "../api.js";
import { showToast, showConfirm } from "../toast.js";

let _nominas = [];
let _usuarios = [];
let _prestamos = [];
let _productosInventario = [];
let _activeTab = 'nominas';

export function initNominas() {
  return async () => {
    _activeTab = 'nominas';
    switchTab('nominas');
    
    window.viewReloaders = window.viewReloaders || {};
    window.viewReloaders.nominas = async () => {
      await loadData();
      await loadPrestamosData();
    };

    await loadData();
    await loadPrestamosData();
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

async function loadPrestamosData() {
  try {
    const listEl = document.getElementById("nom-prestamos-list");
    if (listEl) listEl.innerHTML = `<tr><td colspan="6" class="p-4 text-center text-sm text-on-surface-variant">Cargando préstamos...</td></tr>`;

    _prestamos = await getPrestamos();
    _productosInventario = await getInventario();
    renderPrestamosList(_prestamos);
    updatePrestamosStats(_prestamos);
  } catch (err) {
    showToast("Error al cargar préstamos", "error");
  }
}

function renderPrestamosList(data) {
  const listEl = document.getElementById("nom-prestamos-list");
  if (!listEl) return;

  if (!data || data.length === 0) {
    listEl.innerHTML = `
      <tr>
        <td colspan="6" class="p-8 text-center text-on-surface-variant">
          <span class="material-symbols-outlined text-4xl mb-2 opacity-50" style="font-variation-settings:'FILL' 1">payments</span>
          <p class="text-sm font-medium">No hay préstamos registrados</p>
        </td>
      </tr>
    `;
    return;
  }

  listEl.innerHTML = data.map(p => {
    const d = new Date(p.fecha).toLocaleDateString("es-CO", { year: "numeric", month: "short", day: "numeric" });
    
    let detalle = "";
    if (p.tipo === "Dinero") {
      detalle = `<span class="font-bold text-slate-800">$${parseFloat(p.monto || 0).toLocaleString("es-CO")}</span>`;
    } else {
      detalle = `
        <span class="font-bold text-slate-800">${p.cantidad}x ${p.producto_nombre}</span>
        <span class="text-xs text-slate-500 block">Valor: $${parseFloat(p.monto || 0).toLocaleString("es-CO")}</span>
      `;
    }

    let estadoClass = "bg-amber-50 text-amber-700 border border-amber-100";
    if (p.estado === "Devuelto") estadoClass = "bg-green-50 text-green-700 border border-green-100";
    else if (p.estado === "Deducido") estadoClass = "bg-slate-100 text-slate-600 border border-slate-200";

    // Actions
    let actionButtons = "";
    if (p.estado === "Pendiente") {
      actionButtons = `
        <button class="prest-action-btn px-2.5 py-1 text-[11px] font-bold bg-green-50 text-green-700 border border-green-200 rounded-md hover:bg-green-100 transition-colors" data-id="${p.id_prestamo}" data-action="Devuelto">Devolver</button>
        <button class="prest-action-btn px-2.5 py-1 text-[11px] font-bold bg-slate-50 text-slate-700 border border-slate-200 rounded-md hover:bg-slate-100 transition-colors" data-id="${p.id_prestamo}" data-action="Deducido">Deducir</button>
      `;
    } else {
      actionButtons = `
        <button class="prest-action-btn px-2.5 py-1 text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 rounded-md hover:bg-amber-100 transition-colors" data-id="${p.id_prestamo}" data-action="Pendiente">Reabrir</button>
      `;
    }

    return `
      <tr class="hover:bg-surface-container-low transition-colors group">
        <td class="px-4 py-3 text-sm font-semibold text-on-surface whitespace-nowrap">${d}</td>
        <td class="px-4 py-3 text-sm font-black text-on-surface">${p.empleado}</td>
        <td class="px-4 py-3">
          <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${p.tipo === 'Dinero' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-indigo-50 text-indigo-700 border-indigo-100'}">${p.tipo}</span>
        </td>
        <td class="px-4 py-3 text-sm">${detalle}</td>
        <td class="px-4 py-3 text-center">
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${estadoClass}">${p.estado}</span>
        </td>
        <td class="px-4 py-3">
          <div class="flex items-center gap-2">
            ${actionButtons}
            <button class="prest-del-btn p-1 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-full transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100" data-id="${p.id_prestamo}" title="Eliminar">
              <span class="material-symbols-outlined text-[16px]">delete</span>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join("");

  // Action listeners
  document.querySelectorAll(".prest-action-btn").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      const id = e.currentTarget.dataset.id;
      const newEstado = e.currentTarget.dataset.action;
      
      try {
        const prest = _prestamos.find(x => x.id_prestamo === id);
        if (!prest) return;
        
        // Stock management (Rule 3)
        if (prest.tipo === "Producto") {
          if (newEstado === "Devuelto" && prest.estado === "Pendiente") {
            await updateProductStock(prest.producto_id, prest.cantidad);
            showToast("Stock devuelto a inventario", "info");
          } else if (newEstado === "Pendiente" && prest.estado === "Devuelto") {
            const list = await getInventario();
            const prod = list.find(x => x.id === prest.producto_id);
            if (!prod || (prod.stockActual || 0) < prest.cantidad) {
              return showToast("Stock insuficiente en inventario para reabrir el préstamo", "warning");
            }
            await updateProductStock(prest.producto_id, -prest.cantidad);
            showToast("Stock descontado de inventario", "info");
          }
        }

        await actualizarPrestamoEstado(id, newEstado);
        showToast(`Préstamo marcado como ${newEstado}`, "success");
        await loadPrestamosData();
      } catch (err) {
        showToast("Error al cambiar estado: " + err.message, "error");
      }
    });
  });

  document.querySelectorAll(".prest-del-btn").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      const id = e.currentTarget.dataset.id;
      const ok = await showConfirm("Confirmación", "¿Estás seguro de eliminar este préstamo?");
      if (ok) {
        try {
          const prest = _prestamos.find(x => x.id_prestamo === id);
          if (prest && prest.tipo === "Producto" && prest.estado === "Pendiente") {
            await updateProductStock(prest.producto_id, prest.cantidad);
            showToast("Stock devuelto a inventario", "info");
          }

          await eliminarPrestamo(id);
          showToast("Préstamo eliminado", "success");
          await loadPrestamosData();
        } catch (err) {
          showToast("Error al eliminar", "error");
        }
      }
    });
  });
}

function updatePrestamosStats(data) {
  let totalActivo = 0;
  let totalCobrado = 0;

  data.forEach(p => {
    const val = parseFloat(p.monto) || 0;
    if (p.estado === "Pendiente") {
      totalActivo += val;
    } else {
      totalCobrado += val;
    }
  });

  const elActivo = document.getElementById("nom-prest-stat-activo");
  const elCobrado = document.getElementById("nom-prest-stat-cobrado");

  if (elActivo) elActivo.textContent = "$" + totalActivo.toLocaleString("es-CO");
  if (elCobrado) elCobrado.textContent = "$" + totalCobrado.toLocaleString("es-CO");
}

async function updateProductStock(productId, qtyDelta) {
  try {
    const list = await getInventario();
    const p = list.find(x => x.id === productId);
    if (!p) return;
    const newStock = Math.max(0, (p.stockActual || 0) + qtyDelta);
    
    const datos = [
      p.id,
      p.nombre,
      p.marca || '',
      p.categoria || '',
      p.tipo || 'Físico',
      p.costo || 0,
      p.precioVenta || 0,
      p.stockMinimo || 0,
      newStock,
      p.ubicacion || '',
      p.sku || '',
      p.imagen || ''
    ];
    await actualizarProducto(p.id, datos);
  } catch (err) {
    console.error("Error al actualizar stock del producto:", err);
  }
}

function switchTab(tabId) {
  _activeTab = tabId;
  const tabNom = document.getElementById("nom-tab-nominas");
  const tabPrest = document.getElementById("nom-tab-prestamos");
  const contentNom = document.getElementById("nom-nominas-tab-content");
  const contentPrest = document.getElementById("nom-prestamos-tab-content");
  const fabNom = document.getElementById("nom-new-btn");
  const fabPrest = document.getElementById("nom-prestamos-new-btn");

  if (tabId === "nominas") {
    tabNom?.classList.add("border-primary", "text-primary", "font-black");
    tabNom?.classList.remove("border-transparent", "text-on-surface-variant", "font-bold");
    tabPrest?.classList.remove("border-primary", "text-primary", "font-black");
    tabPrest?.classList.add("border-transparent", "text-on-surface-variant", "font-bold");
    
    contentNom?.classList.remove("hidden");
    contentPrest?.classList.add("hidden");
    
    fabNom?.classList.remove("hidden");
    fabPrest?.classList.add("hidden");
  } else {
    tabPrest?.classList.add("border-primary", "text-primary", "font-black");
    tabPrest?.classList.remove("border-transparent", "text-on-surface-variant", "font-bold");
    tabNom?.classList.remove("border-primary", "text-primary", "font-black");
    tabNom?.classList.add("border-transparent", "text-on-surface-variant", "font-bold");
    
    contentPrest?.classList.remove("hidden");
    contentNom?.classList.add("hidden");
    
    fabPrest?.classList.remove("hidden");
    fabNom?.classList.add("hidden");
  }
}

function handleLoanTypeChange(val) {
  const dineroFields = document.getElementById("nom-prestamo-dinero-fields");
  const productoFields = document.getElementById("nom-prestamo-producto-fields");
  if (val === "Producto") {
    dineroFields?.classList.add("hidden");
    productoFields?.classList.remove("hidden");
  } else {
    dineroFields?.classList.remove("hidden");
    productoFields?.classList.add("hidden");
  }
}

async function handlePaycheckEmployeeChange(empName) {
  const suggestedCont = document.getElementById("nom-prestamos-sugeridos-cont");
  const suggestedDesglose = document.getElementById("nom-prestamos-sugeridos-desglose");
  const inputDeduc = document.getElementById("nom-deduc");

  if (!empName) {
    suggestedCont?.classList.add("hidden");
    if (inputDeduc) inputDeduc.value = 0;
    updateFormTotals();
    return;
  }

  try {
    const loans = await getPrestamos();
    const pendingLoans = loans.filter(p => p.empleado === empName && p.estado === "Pendiente");

    if (pendingLoans.length > 0) {
      const sum = pendingLoans.reduce((s, p) => s + (parseFloat(p.monto) || 0), 0);
      
      const itemsText = pendingLoans.map(p => {
        if (p.tipo === "Dinero") {
          return `Préstamo Dinero: $${parseFloat(p.monto).toLocaleString("es-CO")}`;
        } else {
          return `${p.cantidad}x ${p.producto_nombre}: $${parseFloat(p.monto).toLocaleString("es-CO")}`;
        }
      }).join(", ");

      if (suggestedDesglose) {
        suggestedDesglose.innerHTML = `Sugerido deducir: <strong>$${sum.toLocaleString("es-CO")}</strong><br/>(${itemsText})`;
      }
      suggestedCont?.classList.remove("hidden");
      
      if (inputDeduc) inputDeduc.value = sum;
    } else {
      suggestedCont?.classList.add("hidden");
      if (inputDeduc) inputDeduc.value = 0;
    }
    updateFormTotals();
  } catch (err) {
    console.error("Error al consultar préstamos para deducción:", err);
  }
}

let _eventsBound = false;
function setupEvents() {
  if (_eventsBound) return;
  _eventsBound = true;

  // Tabs navigation
  document.getElementById("nom-tab-nominas")?.addEventListener("click", () => switchTab("nominas"));
  document.getElementById("nom-tab-prestamos")?.addEventListener("click", () => switchTab("prestamos"));

  // Inicializar selectores personalizados
  window.setupCustomSelect("nom-estado-container", "nom-estado");
  window.setupCustomSelect("nom-empleado-container", "nom-empleado", handlePaycheckEmployeeChange);

  window.setupCustomSelect("nom-prestamo-empleado-container", "nom-prestamo-empleado");
  window.setupCustomSelect("nom-prestamo-tipo-container", "nom-prestamo-tipo", handleLoanTypeChange);
  window.setupCustomSelect("nom-prestamo-producto-container", "nom-prestamo-producto", (prodId) => {
    const prod = _productosInventario.find(x => x.id === prodId);
    if (prod) {
      const qty = parseInt(document.getElementById("nom-prestamo-cantidad").value) || 1;
      document.getElementById("nom-prestamo-monto").value = (prod.precioVenta || 0) * qty;
    }
  });

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
    window.buildCustomSelectOptions("nom-empleado-container", "nom-empleado", items, "Seleccione empleado...", handlePaycheckEmployeeChange);
    
    // Sincronizar selectores
    window.syncCustomSelectUI("nom-estado-container", "Pendiente");
    window.syncCustomSelectUI("nom-empleado-container", "");
    
    document.getElementById("nom-prestamos-sugeridos-cont")?.classList.add("hidden");
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

    const selectedEmp = document.getElementById("nom-empleado").value;
    if (!selectedEmp) {
      return showToast("Debe seleccionar un empleado", "warning");
    }

    const base = parseFloat(document.getElementById("nom-base").value) || 0;
    const bonos = parseFloat(document.getElementById("nom-bonos").value) || 0;
    const deduc = parseFloat(document.getElementById("nom-deduc").value) || 0;
    const total = base + bonos - deduc;

    const data = {
      empleado: selectedEmp,
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
      
      // Update pending loans to "Deducido" if payroll registered successfully (Rule 4)
      try {
        const loans = await getPrestamos();
        const pendingLoans = loans.filter(p => p.empleado === selectedEmp && p.estado === "Pendiente");
        for (const loan of pendingLoans) {
          await actualizarPrestamoEstado(loan.id_prestamo, "Deducido");
        }
      } catch (errLoans) {
        console.error("Error al actualizar estado de préstamos a deducidos:", errLoans);
      }

      showToast("Nómina registrada exitosamente", "success");
      modal.classList.add("hidden");
      modal.classList.remove("flex");
      await loadData();
      await loadPrestamosData();
    } catch (err) {
      showToast("Error al guardar: " + err.message, "error");
    } finally {
      btn.disabled = false;
      btn.innerHTML = `<span class="material-symbols-outlined text-[18px]">save</span> Guardar`;
    }
  });

  // PRESTAMOS EVENTS AND TRIGGERS
  document.getElementById("nom-prestamos-new-btn")?.addEventListener("click", () => {
    const pForm = document.getElementById("nom-prestamo-form");
    pForm.reset();
    
    // Poblar empleados (rol !== Cliente)
    const employees = _usuarios.filter(u => u.rol !== "Cliente");
    const items = employees.map(u => {
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
    window.buildCustomSelectOptions("nom-prestamo-empleado-container", "nom-prestamo-empleado", items, "Seleccione empleado...");
    
    // Poblar productos
    const productItems = _productosInventario.map(p => ({
      value: p.id,
      label: `${p.nombre} (Stock: ${p.stockActual || 0})`,
      icon: "smartphone"
    }));
    window.buildCustomSelectOptions("nom-prestamo-producto-container", "nom-prestamo-producto", productItems, "Seleccione producto...", (prodId) => {
      const prod = _productosInventario.find(x => x.id === prodId);
      if (prod) {
        const qty = parseInt(document.getElementById("nom-prestamo-cantidad").value) || 1;
        document.getElementById("nom-prestamo-monto").value = (prod.precioVenta || 0) * qty;
      }
    });

    window.syncCustomSelectUI("nom-prestamo-empleado-container", "");
    window.syncCustomSelectUI("nom-prestamo-tipo-container", "Dinero");
    window.syncCustomSelectUI("nom-prestamo-producto-container", "");
    
    handleLoanTypeChange("Dinero");

    const pModal = document.getElementById("nom-prestamo-modal");
    pModal?.classList.remove("hidden");
    pModal?.classList.add("flex");
  });

  const closeLoanModal = () => {
    const pModal = document.getElementById("nom-prestamo-modal");
    pModal?.classList.add("hidden");
    pModal?.classList.remove("flex");
  };

  document.getElementById("nom-prestamo-modal-close")?.addEventListener("click", closeLoanModal);
  document.getElementById("nom-prestamo-modal-cancel")?.addEventListener("click", closeLoanModal);

  document.getElementById("nom-prestamo-cantidad")?.addEventListener("input", () => {
    const prodId = document.getElementById("nom-prestamo-producto").value;
    const prod = _productosInventario.find(x => x.id === prodId);
    if (prod) {
      const qty = parseInt(document.getElementById("nom-prestamo-cantidad").value) || 1;
      document.getElementById("nom-prestamo-monto").value = (prod.precioVenta || 0) * qty;
    }
  });

  document.getElementById("nom-prestamo-save-btn")?.addEventListener("click", async () => {
    const pForm = document.getElementById("nom-prestamo-form");
    if (!pForm.checkValidity()) {
      pForm.reportValidity();
      return;
    }

    const employee = document.getElementById("nom-prestamo-empleado").value;
    const tipo = document.getElementById("nom-prestamo-tipo").value;
    const notes = document.getElementById("nom-prestamo-notas").value;
    
    if (!employee) {
      return showToast("Debe seleccionar un empleado", "warning");
    }

    let prodId = "";
    let prodName = "";
    let cantidad = 0;
    let monto = 0;

    if (tipo === "Producto") {
      prodId = document.getElementById("nom-prestamo-producto").value;
      if (!prodId) {
        return showToast("Debe seleccionar un producto", "warning");
      }
      const prod = _productosInventario.find(x => x.id === prodId);
      if (!prod) return;
      prodName = prod.nombre;
      cantidad = parseInt(document.getElementById("nom-prestamo-cantidad").value) || 1;
      
      // Check stock
      if ((prod.stockActual || 0) < cantidad) {
        return showToast(`Stock insuficiente. Disponible: ${prod.stockActual || 0}`, "warning");
      }

      monto = (prod.precioVenta || 0) * cantidad;
    } else {
      monto = parseFloat(document.getElementById("nom-prestamo-monto").value) || 0;
      if (monto <= 0) {
        return showToast("Debe ingresar un monto válido", "warning");
      }
    }

    const btn = document.getElementById("nom-prestamo-save-btn");
    btn.disabled = true;
    btn.innerHTML = `<span class="material-symbols-outlined text-[18px] animate-spin">refresh</span> Guardando...`;

    try {
      // Subtract stock if type is Producto (Rule 3)
      if (tipo === "Producto") {
        await updateProductStock(prodId, -cantidad);
      }

      await crearPrestamo({
        empleado: employee,
        tipo: tipo,
        monto: monto,
        producto_id: prodId,
        producto_nombre: prodName,
        cantidad: cantidad,
        estado: "Pendiente",
        notas: notes
      });

      showToast("Préstamo registrado exitosamente", "success");
      closeLoanModal();
      await loadPrestamosData();
    } catch (err) {
      showToast("Error al guardar préstamo: " + err.message, "error");
    } finally {
      btn.disabled = false;
      btn.innerHTML = `<span class="material-symbols-outlined text-[18px]">save</span> Guardar`;
    }
  });
}

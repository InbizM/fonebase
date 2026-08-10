import { getDashboard, getTareas } from "../api.js";
import { navigate } from "../router.js";

let _isLoaded = false;
let _eventsReady = false;

function applyRoleLayout() {
  const user = JSON.parse(localStorage.getItem("adminpro_user") || "{}");
  const rol = user.rol || "Vendedor";

  const elEgresos = document.getElementById("dash-card-egresos");
  const elUtilidad = document.getElementById("dash-card-utilidad");
  const elKpiRow = document.getElementById("dash-kpi-row");
  const qaTecnico = document.getElementById("dash-qa-tecnico");
  const qaEgresos = document.getElementById("dash-qa-egresos");
  const qaVender = document.getElementById("dash-qa-vender");
  const qaCreditos = document.getElementById("dash-qa-creditos");
  const sectionVentas = document.getElementById("dash-ventas-section");
  const chartCard = document.getElementById("dash-chart-card");
  const tecQueue = document.getElementById("dash-tec-queue-card");
  const bottomRow = document.getElementById("dash-bottom-row");
  const businessMetrics = document.getElementById("dash-business-metrics");

  // Reset
  [elEgresos, elUtilidad, elKpiRow, qaTecnico, qaEgresos, qaVender, qaCreditos, sectionVentas, chartCard, tecQueue, bottomRow, businessMetrics].forEach(el => {
    if(el) el.style.display = ""; 
  });
  if(bottomRow) bottomRow.className = "grid grid-cols-1 lg:grid-cols-2 gap-5";

  if (rol === "Vendedor") {
    if (elEgresos) elEgresos.style.display = "none";
    if (elUtilidad) elUtilidad.style.display = "none";
    if (qaTecnico) qaTecnico.style.display = "none";
    if (qaEgresos) qaEgresos.style.display = "none";
    if (tecQueue) tecQueue.style.display = "none";
    if (bottomRow) bottomRow.className = "grid grid-cols-1 gap-5";
  } else if (rol === "Técnico de reparación") {
    if (elKpiRow) elKpiRow.style.display = "none";
    if (qaVender) qaVender.style.display = "none";
    if (qaEgresos) qaEgresos.style.display = "none";
    if (qaCreditos) qaCreditos.style.display = "none";
    if (sectionVentas) sectionVentas.style.display = "none";
    if (chartCard) chartCard.style.display = "none";
    if (bottomRow) bottomRow.className = "grid grid-cols-1 gap-5";
    if (businessMetrics) businessMetrics.style.display = "none";
  }
}

export function initDashboard() {
  return async () => {
    setGreeting();
    applyRoleLayout();
    if (!_eventsReady) {
      document.getElementById("dash-refresh-btn")?.addEventListener("click", loadDashboard);
      document.querySelectorAll("[data-goto]").forEach(btn => {
        btn.addEventListener("click", () => {
          const dest = btn.dataset.goto;
          if (dest) navigate(dest);
        });
      });
      _eventsReady = true;
    }
    await loadDashboard();
  };
}

function setGreeting() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "¡Buenos días! 👋" : hour < 18 ? "¡Buenas tardes! ☕" : "¡Buenas noches! 🌙";
  const el = document.getElementById("dash-greeting");
  if (el) el.textContent = greeting;
}

async function loadDashboard() {
  try {
    const [data, tareas] = await Promise.all([getDashboard(), getTareas()]);
    
    updateStat("dash-ventas-hoy", data.ingresosHoy, true);
    updateStat("dash-egresos-hoy", data.egresosHoy, true);
    updateStat("dash-utilidad", data.utilidad, true);
    updateStat("dash-stock-critico", data.stockCritico);

    updateStat("dash-total-productos", data.totalProductos);
    updateStat("dash-total-stock", data.totalStock);
    updateStat("dash-total-equipos", data.totalEquipos);
    updateStat("dash-total-clientes", data.totalClientes);
    updateStat("dash-creditos-activos", data.creditosActivos);
    updateStat("dash-total-reventas", data.totalReventas);

    renderVentasRecientes(data.ventasRecientes);
    renderTopProductos(data.topProductos);
    renderStockBajo(data.productosBajoStock);
    renderTecRecientes(data.tecRecientes);
    renderChart(data.labels7d, data.ventas7d);

    // Renderizado de Tareas Pendientes
    renderMiniTasks(tareas);

    _isLoaded = true;
  } catch (err) {
    console.error("Dashboard error:", err);
  }
}

function updateStat(id, val, isMoney = false) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = isMoney ? "$" + new Intl.NumberFormat("es-CO").format(val || 0) : (val || 0).toLocaleString();
}

function renderVentasRecientes(ventas) {
  const container = document.getElementById("dash-ventas-list");
  if (!container) return;
  if (!ventas || ventas.length === 0) {
    container.innerHTML = `<p class="p-5 text-sm text-on-surface-variant text-center">No hay ventas hoy</p>`;
    return;
  }
  container.innerHTML = ventas.map(v => `
    <div class="flex items-center gap-3 px-5 py-3 hover:bg-surface-container-low transition-colors">
      <div class="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
        <span class="material-symbols-outlined text-[18px]">receipt</span>
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-semibold text-on-surface truncate">${v.cliente || "Consumidor Final"}</p>
        <p class="text-[11px] text-on-surface-variant">${v.id_factura} · ${new Date(v.fecha).toLocaleDateString()}</p>
      </div>
      <div class="text-right font-bold text-on-surface text-sm">$${new Intl.NumberFormat("es-CO").format(v.total)}</div>
    </div>
  `).join("");
}

function renderTopProductos(productos) {
  const container = document.getElementById("dash-top-productos");
  if (!container) return;
  if (!productos || productos.length === 0) {
    container.innerHTML = `<p class="p-4 text-center text-xs text-on-surface-variant italic">Sin ventas aún</p>`;
    return;
  }
  container.innerHTML = productos.map((p, i) => `
    <div class="flex items-center gap-3">
      <span class="text-lg font-black text-outline-variant/20 w-5">0${i+1}</span>
      <div class="flex-1 min-w-0">
        <p class="text-xs font-bold text-on-surface truncate">${p.nombre}</p>
        <div class="flex items-center gap-2 mt-0.5">
          <div class="flex-1 h-1 bg-surface-container rounded-full overflow-hidden">
            <div class="h-full bg-primary" style="width: ${Math.min(p.cantidad * 10, 100)}%"></div>
          </div>
          <span class="text-[10px] font-black text-primary">${p.cantidad}</span>
        </div>
      </div>
    </div>
  `).join("");
}

function renderStockBajo(productos) {
  const container = document.getElementById("dash-stock-alertas");
  if (!container) return;
  if (!productos || productos.length === 0) {
    container.innerHTML = `<p class="p-4 text-center text-xs text-on-surface-variant italic">Stock ok</p>`;
    return;
  }
  container.innerHTML = productos.map(p => `
    <div class="flex items-center justify-between p-2.5 bg-error/5 border border-error/10 rounded-lg">
      <div class="min-w-0">
        <p class="text-xs font-bold text-on-surface truncate">${p.nombre}</p>
        <p class="text-[10px] text-error">Quedan: ${p.stock_actual}</p>
      </div>
      <span class="material-symbols-outlined text-error text-[18px] ${Number(p.stock_actual) === 0 ? 'animate-bounce' : 'animate-pulse'}">warning</span>
    </div>
  `).join("");
}

function renderTecRecientes(servicios) {
  const container = document.getElementById("dash-tec-list");
  if (!container) return;
  if (!servicios || servicios.length === 0) {
    container.innerHTML = `<p class="p-5 text-sm text-on-surface-variant text-center">Sin servicios</p>`;
    return;
  }
  container.innerHTML = servicios.map(s => `
    <li class="flex items-center justify-between p-3 hover:bg-surface-container-low transition-colors">
      <div class="min-w-0">
        <p class="text-xs font-bold text-on-surface truncate">${s.equipo}</p>
        <p class="text-[10px] text-on-surface-variant">${s.cliente}</p>
      </div>
      <span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant">${s.estado}</span>
    </li>
  `).join("");
}

function renderMiniTasks(tareas) {
  const container = document.getElementById("dash-tasks-list");
  if (!container) return;
  const pend = (tareas || []).filter(t => t.estado !== 'Completada').slice(0, 5);
  if (pend.length === 0) {
    container.innerHTML = `<p class="p-8 text-center text-xs text-on-surface-variant italic">No hay pendientes</p>`;
    return;
  }
  container.innerHTML = pend.map(t => `
    <li class="flex items-center gap-3 px-5 py-3 hover:bg-surface-container-low transition-colors">
      <span class="w-1.5 h-1.5 rounded-full" style="background-color: ${t.color || '#4f46e5'}"></span>
      <div class="flex-1 min-w-0">
        <p class="text-xs font-bold text-on-surface truncate">${t.tarea}</p>
        <p class="text-[9px] text-on-surface-variant uppercase tracking-tight">${new Date(t.fecha_vencimiento).toLocaleDateString('es-CO', { day:'numeric', month:'short' })}</p>
      </div>
    </li>
  `).join("");
}

function renderChart(labels, values) {
  const container = document.getElementById("dash-chart");
  if (!container) return;
  if (!values || values.length === 0 || values.every(v => v === 0)) {
    container.innerHTML = `<div class="flex-1 flex items-center justify-center text-on-surface-variant text-xs italic opacity-50">Sin ventas</div>`;
    return;
  }
  const max = Math.max(...values, 1);
  container.innerHTML = values.map((v, i) => {
    const h = Math.max((v / max) * 100, 5);
    return `
      <div class="flex-1 flex flex-col items-center group h-full">
        <div class="flex-1 w-full flex items-end justify-center">
          <div class="w-full max-w-[28px] rounded-t-md transition-all duration-500 relative ${v === 0 ? 'bg-surface-container/30' : 'bg-primary'}"
               style="height: ${h}%;"></div>
        </div>
        <span class="text-[9px] text-on-surface-variant font-bold mt-2 uppercase tracking-tighter">${labels[i] || ""}</span>
      </div>
    `;
  }).join("");
}




import { getTareas, getVentas, getEgresos, getNominas, getReventas } from "../api.js";
import { showToast } from "../toast.js";

let _events = [];
let _isLoaded = false;

export function initCalendar() {
  return async () => {
    if (!_isLoaded) {
      await loadGlobalActivity();
      _isLoaded = true;
    }
    renderTimeline();
  };
}

async function loadGlobalActivity() {
  const container = document.getElementById("calendar-container");
  if (container) container.innerHTML = `<div class="p-10 text-center text-on-surface-variant italic animate-pulse">Recopilando actividad global...</div>`;

  try {
    const user = JSON.parse(localStorage.getItem("adminpro_user") || "{}");
    const isAdmin = user.rol === "Administrador";

    // Fetch all allowed data
    const promises = [
      getVentas().catch(() => []),
      getTareas().catch(() => []),
      getReventas().catch(() => [])
    ];
    
    if (isAdmin) {
      promises.push(getEgresos().catch(() => []));
      promises.push(getNominas().catch(() => []));
    }

    const results = await Promise.all(promises);
    
    const [ventas, tareas, reventas, egresos = [], nominas = []] = results;

    _events = [];

    // Map Ventas
    ventas.forEach(v => {
      if (!v.fecha) return;
      _events.push({
        fecha: new Date(v.fecha),
        tipo: "Venta",
        icono: "point_of_sale",
        color: "text-green-600",
        bg: "bg-green-100",
        border: "border-green-200",
        titulo: `Factura: ${v.id_factura || 'N/A'}`,
        subtitulo: `Cliente: ${v.cliente || 'Consumidor Final'}`,
        monto: v.total,
        signo: "+",
        usuario: v.vendedor || "Admin"
      });
    });

    // Map Tareas
    tareas.forEach(t => {
      if (!t.fecha_vencimiento) return;
      _events.push({
        fecha: new Date(t.fecha_vencimiento),
        tipo: "Tarea",
        icono: "task_alt",
        color: "text-indigo-600",
        bg: "bg-indigo-100",
        border: "border-indigo-200",
        titulo: t.tarea,
        subtitulo: `Resp: ${t.responsable || 'Sin asignar'}`,
        monto: null,
        usuario: t.responsable || "Admin"
      });
    });

    // Map Reventas
    reventas.forEach(r => {
      if (!r.fecha) return;
      _events.push({
        fecha: new Date(r.fecha),
        tipo: "Reventa",
        icono: "storefront",
        color: "text-purple-600",
        bg: "bg-purple-100",
        border: "border-purple-200",
        titulo: `Reventa: ${r.producto}`,
        subtitulo: `Proveedor: ${r.proveedor || 'N/A'}`,
        monto: r.utilidad,
        signo: "+",
        usuario: r.vendedor || "Admin"
      });
    });

    // Map Egresos
    egresos.forEach(e => {
      if (!e.fecha) return;
      _events.push({
        fecha: new Date(e.fecha),
        tipo: "Egreso",
        icono: "payments",
        color: "text-red-600",
        bg: "bg-red-100",
        border: "border-red-200",
        titulo: `Gasto: ${e.concepto}`,
        subtitulo: `Cat: ${e.categoria}`,
        monto: e.monto,
        signo: "-"
      });
    });

    // Map Nóminas
    nominas.forEach(n => {
      if (!n.fecha) return;
      _events.push({
        fecha: new Date(n.fecha),
        tipo: "Nómina",
        icono: "request_quote",
        color: "text-orange-600",
        bg: "bg-orange-100",
        border: "border-orange-200",
        titulo: `Pago: ${n.empleado}`,
        subtitulo: `Período: ${n.periodo}`,
        monto: n.total_pagar,
        signo: "-"
      });
    });

    // Sort descending by date
    _events.sort((a, b) => b.fecha - a.fecha);

    // Filter by user if not admin
    if (!isAdmin) {
      _events = _events.filter(e => e.usuario === user.nombre);
    }

  } catch (err) {
    console.error(err);
    if (container) container.innerHTML = `<div class="p-10 text-center text-error font-bold">Error cargando actividad: ${err.message}</div>`;
  }
}

function renderTimeline() {
  const container = document.getElementById("calendar-container");
  if (!container) return;

  if (_events.length === 0) {
    container.innerHTML = `
      <div class="flex-1 flex flex-col items-center justify-center p-10 opacity-50">
        <span class="material-symbols-outlined text-[64px] mb-4">history_toggle_off</span>
        <p class="text-lg font-bold">Sin actividad</p>
        <p class="text-sm">No hay registros de operaciones en el sistema.</p>
      </div>`;
    return;
  }

  // Group by Date string (YYYY-MM-DD)
  const grouped = {};
  _events.forEach(e => {
    const iso = e.fecha.toISOString().split('T')[0];
    if (!grouped[iso]) grouped[iso] = [];
    grouped[iso].push(e);
  });

  const fmtCurrency = n => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(n);

  let html = "";
  const todayIso = new Date().toISOString().split('T')[0];
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayIso = yesterday.toISOString().split('T')[0];

  Object.keys(grouped).forEach(dateStr => {
    const dayEvents = grouped[dateStr];
    
    // Format Header
    let dateLabel = dateStr;
    let headerColor = "text-on-surface-variant";
    let bulletColor = "bg-surface-variant";
    
    if (dateStr === todayIso) {
      dateLabel = "Hoy";
      headerColor = "text-primary";
      bulletColor = "bg-primary";
    } else if (dateStr === yesterdayIso) {
      dateLabel = "Ayer";
    } else {
      const d = new Date(dateStr + "T12:00:00");
      dateLabel = d.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' });
      dateLabel = dateLabel.charAt(0).toUpperCase() + dateLabel.slice(1);
    }

    html += `
      <!-- Day Group -->
      <div class="relative">
        <!-- Date Header -->
        <div class="absolute -left-[33px] md:-left-[41px] top-1 w-4 h-4 rounded-full border-4 border-surface ${bulletColor} z-10"></div>
        <h3 class="text-sm font-black uppercase tracking-widest ${headerColor} mb-4">${dateLabel}</h3>
        
        <div class="flex flex-col gap-3 mb-8">
    `;

    dayEvents.forEach(e => {
      const timeStr = e.fecha.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
      
      let amountHtml = "";
      if (e.monto !== null && e.monto !== undefined) {
        const signCls = e.signo === '+' ? 'text-green-600' : 'text-red-600';
        amountHtml = `<div class="font-black ${signCls} whitespace-nowrap">${e.signo} ${fmtCurrency(e.monto)}</div>`;
      }

      html += `
        <div class="bg-surface-container-lowest border border-surface-variant hover:border-primary/30 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center gap-4 group">
          
          <!-- Icon -->
          <div class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${e.bg} ${e.border} border">
            <span class="material-symbols-outlined ${e.color} text-[24px]" style="font-variation-settings:'FILL' 1">${e.icono}</span>
          </div>
          
          <!-- Content -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-0.5">
              <span class="text-[10px] font-black uppercase tracking-widest ${e.color}">${e.tipo}</span>
              <span class="text-[10px] text-on-surface-variant flex items-center gap-0.5"><span class="material-symbols-outlined text-[12px]">schedule</span> ${timeStr}</span>
            </div>
            <h4 class="text-sm font-bold text-on-surface truncate">${e.titulo}</h4>
            <p class="text-xs text-on-surface-variant truncate">${e.subtitulo}</p>
          </div>
          
          <!-- Amount -->
          ${amountHtml}
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

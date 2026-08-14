import { getVentas, getAjustesEmpresa } from "../api.js";
import { showToast } from "../toast.js";
import { printBluetoothTicket, imageToCanvas } from "../bluetooth-printer.js";

let _ventas = [];
let _filteredVentas = [];
let _ajustesEmpresa = null;

export function initSalesHistory() {
  return async () => {
    try {
      _ajustesEmpresa = await getAjustesEmpresa();
    } catch(e) {
      console.error("Error al cargar ajustes de empresa en historial:", e);
    }
    // Configurar búsqueda
    const searchInput = document.getElementById("sales-search");
    searchInput?.addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase().trim();
      _filteredVentas = _ventas.filter(v => 
        (v.id_factura || "").toLowerCase().includes(q) ||
        (v.cliente || "").toLowerCase().includes(q) ||
        (v.cedula || "").toLowerCase().includes(q)
      );
      renderTable();
    });

    // Configurar cierre de modal
    const closeModal = () => {
      const modal = document.getElementById("sale-detail-modal");
      modal.classList.add("hidden");
      modal.classList.remove("flex");
    };
    document.getElementById("sale-detail-close")?.addEventListener("click", closeModal);
    document.getElementById("sale-detail-backdrop")?.addEventListener("click", closeModal);

    const printBtn = document.getElementById("sale-detail-print-btn");
    printBtn?.addEventListener("click", () => {
      const id = document.querySelector("#sale-detail-content p.text-2xl")?.textContent;
      const v = _ventas.find(x => x.id_factura === id);
      if (v) imprimirTicketHistory(v);
    });

    const printBtBtn = document.getElementById("sale-detail-print-bt");
    printBtBtn?.addEventListener("click", async () => {
      const id = document.querySelector("#sale-detail-content p.text-2xl")?.textContent;
      const v = _ventas.find(x => x.id_factura === id);
      if (v) {
        showToast("Preparando impresión...", "info");
        await printBluetoothTicket(v, null, null, _ajustesEmpresa);
      }
    });

    await loadSalesHistory();
  };
}

function imprimirTicketHistory(v) {
  const printWindow = window.open('', '_blank', 'width=300,height=600');
  const now = new Date(v.fecha);
  const fechaStr = `${now.getDate()}/${now.getMonth()+1}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}`;
  
  let imeiText = "N/A";
  try {
    const imeiObj = JSON.parse(v.imeis || "{}");
    const flatImeis = Object.values(imeiObj).flat().filter(x => x && x.trim());
    if (flatImeis.length > 0) imeiText = flatImeis.join(", ");
  } catch(e) {
    if (v.imeis && v.imeis !== "{}" && v.imeis !== "N/A") imeiText = v.imeis;
  }
  
  const emisor = {
    nombre: _ajustesEmpresa?.nombre || "MI NEGOCIO",
    propietario: _ajustesEmpresa?.propietario || "Juan Pérez",
    nit: _ajustesEmpresa?.nit || "900.123.456-1",
    direccion: (_ajustesEmpresa?.direccion || "Calle 123 No. 45 - 67") + ", " + (_ajustesEmpresa?.ciudad || "Bogotá - Cundinamarca"),
    contacto: _ajustesEmpresa?.contacto || "3001234567",
    correo: _ajustesEmpresa?.correo || "contacto@miempresa.com",
    condiciones: _ajustesEmpresa?.condiciones || "GARANTIA: Equipos probados y encendidos. Sin garantía en displays/táctiles o equipos apagados. Doc. asimilado a letra de cambio (Art. 774 C.Comercio).",
    logo: _ajustesEmpresa?.logo || "",
    logo_size: _ajustesEmpresa?.logo_size || 40,
    mostrar_nombre: _ajustesEmpresa?.mostrar_nombre !== 0
  };

  const paperFormat = localStorage.getItem("fonebase_paper_format") || "80mm";
  const paperWidth = paperFormat === "58mm" ? "48mm" : "80mm";

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          @page { size: ${paperWidth} auto; margin: 0; }
          html, body { 
            width: ${paperWidth}; 
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
            color: #1e293b; /* slate-800 */
            line-height: 1.3;
          }
          .bold { font-weight: 900; }
          .text-xs { font-size: 8px; }
          .text-sm { font-size: 11px; }
          .text-lg { font-size: 14px; }
          .text-xl { font-size: 18px; }
          .text-slate-500 { color: #64748b; }
          .text-slate-400 { color: #94a3b8; }
          .text-primary { color: #020617; } /* using dark slate for primary on print */
          
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
          
          .section-title {
            font-size: 7px;
            font-weight: 900;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 2px;
            margin-top: 4px;
          }

          .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; }
          
          .product-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 4px;
            padding: 4px;
            margin-bottom: 4px;
          }
          
          .summary-card {
            background: #0f172a;
            color: white;
            border-radius: 6px;
            padding: 6px;
            margin-top: 6px;
          }
          
          .legal { font-size: 7px; text-align: justify; margin-top: 8px; color: #64748b; }
          .center { text-align: center; }
        </style>
      </head>
      <body>
        <!-- Logo de la Empresa -->
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
          <div class="text-xs text-primary bold" style="color: #dc2626; text-transform: uppercase;">COMPROBANTE DE VENTA</div>
          <div class="flex-between" style="margin-top: 2px;">
            <div class="text-lg bold" style="line-height: 1;">${v.id_factura}</div>
            <div class="badge">PAGADO</div>
          </div>
          <div class="flex-between" style="margin-top: 2px;">
            <div class="text-xs text-slate-500">${fechaStr}</div>
            <div class="text-xs bold">${v.metodo || 'Efectivo'}</div>
          </div>
        </div>
        
        <!-- Info Cliente & Vendedor -->
        <div class="grid-2">
          <div>
            <div class="section-title">INFORMACIÓN DEL CLIENTE</div>
            <div class="bold text-sm">${v.cliente}</div>
            <div class="text-xs text-slate-500">ID: ${v.cedula}</div>
            <div class="text-xs text-slate-500"><span class="text-slate-400 bold">Tel:</span> ${v.telefono_cliente || 'N/A'}</div>
            <div class="text-xs text-slate-500"><span class="text-slate-400 bold">Ubicación:</span> ${v.direccion || '—'}, ${v.ciudad || '—'}</div>
          </div>
          <div>
            <div class="section-title">ATENDIDO POR</div>
            <div class="bold text-sm">${v.vendedor || 'Vendedor'}</div>
            <div class="text-xs text-slate-400" style="font-style: italic;">Vendedor Autorizado</div>
            <div class="text-xs bold" style="color: #dc2626; background: #fef2f2; display: inline-block; padding: 1px 4px; border-radius: 4px; margin-top: 2px;">DIGITAL</div>
          </div>
        </div>
        
        <div style="border-top: 1px solid #f1f5f9; margin: 6px 0;"></div>
        
        <!-- Detalle Productos -->
        <div class="section-title">DETALLE DE PRODUCTOS</div>
        <div class="product-card">
          <div class="flex-between">
            <div class="bold text-sm" style="width: 80%;">${v.productos}</div>
            <div class="bold text-sm">x${v.cantidad || 1}</div>
          </div>
        </div>
        ${imeiText && imeiText !== 'N/A' ? `<div class="text-xs bold" style="color:#dc2626; margin-top: -2px; margin-bottom: 4px; margin-left: 4px;">IMEI/SERIE: ${imeiText}</div>` : ''}

        <!-- Resumen Financiero -->
        <div class="summary-card">
          <div class="flex-between" style="align-items: flex-end;">
            <div>
              <div class="section-title" style="color: #94a3b8; margin-top: 0;">RESUMEN FINANCIERO</div>
              <div class="text-xs" style="color: #cbd5e1;">Subtotal: $${new Intl.NumberFormat('es-CO').format(v.subtotal || v.total)}</div>
              <div class="text-xs bold" style="color: #f87171;">Descuento: -$${new Intl.NumberFormat('es-CO').format(v.descuento || 0)}</div>
            </div>
            <div style="text-align: right;">
              <div class="section-title" style="color: #94a3b8; margin-top: 0; margin-bottom: 0;">TOTAL COBRADO</div>
              <div class="text-xl bold text-white" style="line-height: 1;">$${new Intl.NumberFormat('es-CO').format(v.total)}</div>
            </div>
          </div>
        </div>

        <!-- Firmas -->
        <div style="margin-top: 8px; display: flex; flex-direction: column; gap: 6px;">
           <div class="center">
             <div class="text-xs bold text-slate-400">FIRMA COMPRADOR</div>
             <div style="border: 1px solid #e2e8f0; border-radius: 4px; background: #f8fafc; height: 45px; margin-top: 2px; display: flex; justify-content: center; align-items: center; width: 100%;">
               ${v.id_firma_comprador ? `<img src="${v.id_firma_comprador}" style="height: 40px; max-width: 100%; object-fit: contain;">` : ''}
             </div>
           </div>
           <div class="center">
             <div class="text-xs bold text-slate-400">FIRMA VENDEDOR</div>
             <div style="border: 1px solid #e2e8f0; border-radius: 4px; background: #f8fafc; height: 45px; margin-top: 2px; display: flex; justify-content: center; align-items: center; width: 100%;">
               ${v.id_firma_vendedor ? `<img src="${v.id_firma_vendedor}" style="height: 40px; max-width: 100%; object-fit: contain;">` : ''}
             </div>
           </div>
        </div>
        
        <!-- Footer Legal -->
        <div class="legal">
          ${emisor.condiciones}
        </div>
        <div class="center bold" style="margin-top: 8px; font-size: 11px;">¡GRACIAS POR SU COMPRA!</div>
      </body>
    </html>
  `);
  printWindow.document.close();
  setTimeout(() => { printWindow.print(); printWindow.close(); }, 500);
}

async function loadSalesHistory() {
  const container = document.getElementById("sales-history-list");
  if (!container) return;

  try {
    container.innerHTML = `<tr><td colspan="7" class="p-8 text-center text-on-surface-variant italic text-sm">Cargando todas las ventas...</td></tr>`;
    _ventas = await getVentas();

    // Filtrar ventas si el usuario no es Administrador
    try {
      const user = JSON.parse(localStorage.getItem("adminpro_user") || "{}");
      if (user.rol && user.rol !== "Administrador") {
        const loggedInUser = (user.nombre || "").toLowerCase().trim();
        _ventas = _ventas.filter(v => (v.vendedor || "").toLowerCase().trim() === loggedInUser);
      }
    } catch (e) {
      console.error("Error al filtrar ventas en historial:", e);
    }

    _filteredVentas = [..._ventas];
    renderTable();
  } catch (err) {
    container.innerHTML = `<tr><td colspan="7" class="p-8 text-center text-error italic text-sm">Error: ${err.message}</td></tr>`;
  }
}

function renderTable() {
  const container = document.getElementById("sales-history-list");
  if (!container) return;

  // Actualizar estadísticas
  const totalFacturas = _filteredVentas.length;
  const totalFacturado = _filteredVentas.reduce((sum, v) => sum + (v.total || 0), 0);
  const elCount = document.getElementById("sales-stat-count");
  const elAmount = document.getElementById("sales-stat-amount");
  if (elCount) elCount.textContent = totalFacturas.toLocaleString();
  if (elAmount) elAmount.textContent = "$" + new Intl.NumberFormat("es-CO").format(totalFacturado);

  if (_filteredVentas.length === 0) {
    container.innerHTML = `<tr><td colspan="7" class="p-8 text-center text-on-surface-variant italic text-sm">No se encontraron ventas</td></tr>`;
    return;
  }

  container.innerHTML = _filteredVentas.map((v, i) => {
    const fecha = new Date(v.fecha).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' });
    const total = new Intl.NumberFormat("es-CO").format(v.total || 0);

    let cleanImeis = "N/A";
    try {
      const imeiObj = JSON.parse(v.imeis || "{}");
      const flatImeis = Object.values(imeiObj).flat().filter(x => x && x.trim());
      if (flatImeis.length > 0) cleanImeis = flatImeis.join(", ");
    } catch(e) {
      if (v.imeis && v.imeis !== "{}" && v.imeis !== "N/A") cleanImeis = v.imeis;
    }

    return `
      <tr class="hover:bg-surface-container-low transition-colors text-[13px]">
        <td class="px-4 py-4 text-center text-on-surface-variant font-medium hidden md:table-cell">${i + 1}</td>
        <td class="px-4 py-4">
          <div class="font-bold text-on-surface text-sm">${v.id_factura}</div>
          <div class="text-[10px] text-on-surface-variant uppercase">${fecha}</div>
        </td>
        <td class="px-4 py-4">
          <div class="font-bold text-on-surface">${v.cliente || "Consumidor Final"}</div>
          <div class="text-[10px] text-on-surface-variant">CC: ${v.cedula || "N/A"}</div>
        </td>
        <td class="px-4 py-4 font-medium text-on-surface-variant hidden md:table-cell">${v.vendedor || "—"}</td>
        <td class="px-4 py-4">
          <div class="text-xs text-on-surface font-semibold truncate max-w-[150px]">${v.productos}</div>
          <div class="text-[10px] text-primary font-bold">IMEI: ${cleanImeis}</div>
        </td>
        <td class="px-4 py-4 text-right font-black text-on-surface text-sm">
          $${total}
        </td>
        <td class="px-4 py-4 text-center">
           <button onclick="window.viewSaleDetail('${v.id_factura}')" class="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors">
              <span class="material-symbols-outlined text-[20px]">visibility</span>
           </button>
        </td>
      </tr>
    `;
  }).join("");
}

window.viewSaleDetail = (id) => {
  const v = _ventas.find(x => x.id_factura === id);
  if (!v) return;

  const modal = document.getElementById("sale-detail-modal");
  const content = document.getElementById("sale-detail-content");
  const fmt = n => new Intl.NumberFormat("es-CO").format(n || 0);

  let cleanImeis = "N/A";
  try {
    const imeiObj = JSON.parse(v.imeis || "{}");
    const flatImeis = Object.values(imeiObj).flat().filter(x => x && x.trim());
    if (flatImeis.length > 0) cleanImeis = flatImeis.join(", ");
  } catch(e) {
    if (v.imeis && v.imeis !== "{}" && v.imeis !== "N/A") cleanImeis = v.imeis;
  }

  content.innerHTML = `
    <div class="space-y-6">
      <div class="flex justify-between items-start bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div>
          <p class="text-[10px] uppercase font-black text-primary tracking-widest mb-1">Comprobante de Venta</p>
          <p class="text-2xl font-black text-slate-900">${v.id_factura}</p>
          <p class="text-xs text-slate-500 font-medium">${new Date(v.fecha).toLocaleString('es-CO')}</p>
        </div>
        <div class="text-right">
          <span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-black uppercase">Pagado</span>
          <p class="text-[11px] text-slate-500 mt-2 font-bold">${v.metodo}</p>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-6">
        <div>
          <p class="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">Información del Cliente</p>
          <p class="text-sm font-black text-slate-900">${v.cliente}</p>
          <p class="text-xs text-slate-600">ID/Cédula: ${v.cedula || 'N/A'}</p>
          <p class="text-xs text-slate-600 mt-1"><span class="font-bold text-slate-400">Tel:</span> ${v.telefono_cliente || 'N/A'}</p>
          <p class="text-xs text-slate-600 mt-0.5"><span class="font-bold text-slate-400">Ubicación:</span> ${v.direccion || '—'}, ${v.ciudad || '—'}</p>
        </div>
        <div>
          <p class="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">Atendido por</p>
          <p class="text-sm font-black text-slate-900">${v.vendedor}</p>
          <p class="text-xs text-slate-500 italic">Vendedor Autorizado</p>
          <p class="text-[10px] mt-2 font-bold text-primary uppercase bg-primary/5 inline-block px-2 py-0.5 rounded-full">${v.tipo_factura || 'física'}</p>
        </div>
      </div>

      <div class="border-t border-slate-100 pt-4">
        <p class="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-3">Detalle de Productos</p>
        <div class="bg-slate-50 rounded-xl p-4 border border-slate-100">
           <div class="flex justify-between text-sm font-bold text-slate-800 mb-1">
              <span>${v.productos}</span>
              <span>x${v.cantidad || 1}</span>
           </div>
           <p class="text-[11px] text-primary font-mono font-bold uppercase tracking-tighter">IMEI/SERIE: ${cleanImeis}</p>
        </div>
      </div>

      <div class="bg-slate-900 text-white p-5 rounded-2xl shadow-xl relative overflow-hidden">
        <div class="relative z-10 flex justify-between items-end">
          <div class="space-y-1">
            <p class="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Resumen Financiero</p>
            <p class="text-xs opacity-80">Subtotal: $${fmt(v.subtotal)}</p>
            <p class="text-xs text-red-400 font-bold">Descuento: -$${fmt(v.descuento)}</p>
          </div>
          <div class="text-right">
            <p class="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Total Cobrado</p>
            <p class="text-3xl font-black text-white leading-none mt-1">$${fmt(v.total)}</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-3 border-t border-slate-100 pt-4">
        <div class="flex flex-col gap-2 text-center">
           <p class="text-[9px] uppercase font-bold text-slate-400">Firma Vend.</p>
           ${v.id_firma_vendedor ? `<a href="${v.id_firma_vendedor}" target="_blank" class="h-12 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200"><span class="material-symbols-outlined text-slate-400 text-sm">signature</span></a>` : `<div class="h-12 bg-slate-50 rounded-lg border border-slate-100"></div>`}
        </div>
        <div class="flex flex-col gap-2 text-center">
           <p class="text-[9px] uppercase font-bold text-slate-400">Firma Cli.</p>
           ${v.id_firma_comprador ? `<a href="${v.id_firma_comprador}" target="_blank" class="h-12 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200"><span class="material-symbols-outlined text-slate-400 text-sm">person_check</span></a>` : `<div class="h-12 bg-slate-50 rounded-lg border border-slate-100"></div>`}
        </div>
        <div class="flex flex-col gap-2 text-center">
           <p class="text-[9px] uppercase font-bold text-slate-400">Evidencia</p>
           ${v.evidencia ? `<a href="${v.evidencia}" target="_blank" class="h-12 bg-primary/5 rounded-lg flex items-center justify-center border border-primary/20"><span class="material-symbols-outlined text-primary/40 text-sm">image</span></a>` : `<div class="h-12 bg-slate-50 rounded-lg border border-slate-100"></div>`}
        </div>
      </div>
    </div>
  `;

  modal.classList.remove("hidden");
  modal.classList.add("flex");
};

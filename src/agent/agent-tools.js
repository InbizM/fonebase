import { 
  registrarEgreso, 
  crearTarea, 
  getClientes, 
  crearCliente,
  crearProducto,
  actualizarProducto,
  crearEquipo,
  crearServicioTecnico,
  crearCredito,
  crearValeFisico,
  crearReventa,
  getInventario,
  crearMeta,
  crearPrestamo
} from "../api.js";
import { navigate } from "../router.js";
import { showToast } from "../toast.js";

// ── WIZARD MULTI-PRODUCTO Y FORMULARIOS INTERACTIVOS ──
window.wizardStateStore = window.wizardStateStore || {};

export function matchExistingInventoryProduct(inv, item) {
  if (!inv || !Array.isArray(inv) || inv.length === 0) return null;
  const targetId = (item.id_producto || item.id || "").trim();
  const targetSku = (item.sku || "").toLowerCase().trim();
  const rawName = (item.nombre || item.name || "").toLowerCase().trim();
  const targetBrand = (item.marca || item.brand || "").toLowerCase().trim();

  // 1. Direct match by ID
  if (targetId) {
    const byId = inv.find(p => p.id === targetId);
    if (byId) return byId;
  }

  // 2. Direct match by SKU / Reference code (e.g. "KN3", "KL7", "15C")
  if (targetSku) {
    const bySku = inv.find(p => (p.sku || "").toLowerCase().trim() === targetSku);
    if (bySku) return bySku;
  }

  // 3. Exact full name match
  const byName = inv.find(p => (p.nombre || "").toLowerCase().trim() === rawName);
  if (byName) return byName;

  // 4. Check if known reference code in item is in existing product name or SKU
  const extractRef = (str) => {
    const match = str.match(/\b(kn\d+|kl\d+|bg\d+|a\d+e?|c\d+|\d+c|sm-[a-z\d]+|\d{4}[a-z\d]+)\b/i);
    return match ? match[1].toLowerCase() : null;
  };
  const itemRef = targetSku || extractRef(rawName);
  if (itemRef) {
    const byRef = inv.find(p => {
      const pSku = (p.sku || "").toLowerCase().trim();
      const pRef = pSku || extractRef(p.nombre || "");
      if (pRef && pRef === itemRef) return true;
      const pName = (p.nombre || "").toLowerCase();
      return pName.includes(itemRef);
    });
    if (byRef) return byRef;
  }

  // 5. Check if names overlap substantially
  const cleanTokens = rawName.replace(/[\(\)\/\,\.\-\_]/g, " ").split(/\s+/).filter(t => t.length >= 3 && !['tecno', 'xiaomi', 'samsung', 'celular', 'nuevo'].includes(t));
  if (cleanTokens.length > 0) {
    const byTokens = inv.find(p => {
      const pName = (p.nombre || "").toLowerCase();
      const pBrand = (p.marca || "").toLowerCase();
      const brandMatch = !targetBrand || pBrand.includes(targetBrand) || targetBrand.includes(pBrand);
      if (!brandMatch) return false;
      return cleanTokens.every(token => pName.includes(token));
    });
    if (byTokens) return byTokens;
  }

  return null;
}

window.wizardFormatCurrency = (input) => {
  let val = input.value.replace(/\D/g, "");
  if (!val) {
    input.value = "";
    return;
  }
  input.value = Number(val).toLocaleString('es-CO');
};

window.wizardOnCostoInput = (input, wizardId) => {
  let val = input.value.replace(/\D/g, "");
  if (!val) {
    input.value = "";
    val = "0";
  }
  const numCosto = Number(val);
  if (numCosto > 0) input.value = numCosto.toLocaleString('es-CO');

  const container = document.getElementById(wizardId);
  if (!container) return;

  const precioInput = container.querySelector('[data-field="precio"]');
  const revendedorInput = container.querySelector('[data-field="precioRevendedor"]');

  // 1. Calificación Revendedor (+5% o +$20.000 redondeado a $1.000)
  const revPrice = numCosto > 0 ? Math.ceil(Math.max(numCosto * 1.05, numCosto + 20000) / 1000) * 1000 : 0;
  // 2. Calificación Cliente Final (+20% redondeado a $1.000)
  const finalPrice = numCosto > 0 ? Math.ceil((numCosto * 1.20) / 1000) * 1000 : 0;

  if (precioInput) precioInput.value = finalPrice > 0 ? finalPrice.toLocaleString('es-CO') : '';
  if (revendedorInput) revendedorInput.value = revPrice > 0 ? revPrice.toLocaleString('es-CO') : '';

  // Actualizar desglose visual en vivo
  const revPreview = container.querySelector('[data-preview="rev-price"]');
  const revProfit = container.querySelector('[data-preview="rev-profit"]');
  const finalPreview = container.querySelector('[data-preview="final-price"]');
  const finalProfit = container.querySelector('[data-preview="final-profit"]');
  const esc15 = container.querySelector('[data-preview="esc-15"]');
  const esc25 = container.querySelector('[data-preview="esc-25"]');
  const esc30 = container.querySelector('[data-preview="esc-30"]');

  const fmt = n => `$${Number(n).toLocaleString('es-CO')}`;

  if (revPreview) revPreview.textContent = numCosto > 0 ? fmt(revPrice) : '$—';
  if (revProfit) revProfit.textContent = numCosto > 0 ? `Ganancia: +${fmt(revPrice - numCosto)}` : '+ $0';
  if (finalPreview) finalPreview.textContent = numCosto > 0 ? fmt(finalPrice) : '$—';
  if (finalProfit) finalProfit.textContent = numCosto > 0 ? `Ganancia: +${fmt(finalPrice - numCosto)}` : '+ $0';

  if (esc15) esc15.textContent = numCosto > 0 ? fmt(Math.ceil((numCosto * 1.15) / 1000) * 1000) : '$—';
  if (esc25) esc25.textContent = numCosto > 0 ? fmt(Math.ceil((numCosto * 1.25) / 1000) * 1000) : '$—';
  if (esc30) esc30.textContent = numCosto > 0 ? fmt(Math.ceil((numCosto * 1.30) / 1000) * 1000) : '$—';
};

window.wizardApplyToAll = (wizardId) => {
  const state = window.wizardStateStore[wizardId];
  const container = document.getElementById(wizardId);
  if (!state || !container) return;

  const costoInput = container.querySelector('[data-field="costo"]');
  const precioInput = container.querySelector('[data-field="precio"]');
  const revendedorInput = container.querySelector('[data-field="precioRevendedor"]');

  const costoVal = Number(costoInput?.value.replace(/\D/g, "")) || 0;
  const precioVal = Number(precioInput?.value.replace(/\D/g, "")) || 0;
  const revVal = Number(revendedorInput?.value.replace(/\D/g, "")) || 0;

  if (costoVal === 0) {
    if (window.showToast) window.showToast("Ingresa el costo primero", "warning");
    return;
  }

  state.items.forEach(it => {
    it.costo = costoVal;
    it.precioVenta = precioVal;
    it.venta = precioVal;
    it.precioRevendedor = revVal;
  });

  if (window.showToast) window.showToast(`⚡ Costo y precios aplicados a los ${state.items.length} productos del lote`, "success");
};

function buildWizardStepHtml(wizardId, stepIndex) {
  const state = window.wizardStateStore[wizardId];
  if (!state || !state.items || state.items.length === 0) return "";
  
  const total = state.items.length;
  const item = state.items[stepIndex] || state.items[0];
  const msgId = state.msgId || "";

  // Step Tabs / Pills
  const tabsHtml = state.items.map((it, idx) => {
    const isCurrent = idx === stepIndex;
    const isSaved = it.saved;
    const cleanName = (it.nombre || `Prod #${idx + 1}`).slice(0, 14);
    
    let pillClass = "bg-slate-800/80 text-slate-400 border-slate-700/80 hover:bg-slate-700 hover:text-white";
    if (isCurrent) {
      pillClass = "bg-primary text-on-primary border-primary font-bold shadow-sm";
    } else if (isSaved) {
      pillClass = "bg-emerald-950/60 text-emerald-300 border-emerald-800/80 font-bold";
    }

    return `
      <button type="button" onclick="window.wizardGoToStep('${wizardId}', ${idx})" 
        class="px-2.5 py-1 rounded-lg text-[10px] border shrink-0 flex items-center gap-1 transition-all ${pillClass}">
        ${isSaved ? '<span class="material-symbols-outlined text-[12px] text-emerald-400">check_circle</span>' : ''}
        <span>#${idx + 1} ${cleanName}</span>
      </button>
    `;
  }).join("");

  // Product Image
  let imgHtml = "";
  if (item.imagen || item.foto_base64) {
    const src = (item.imagen || item.foto_base64).startsWith("data:") ? (item.imagen || item.foto_base64) : `data:image/jpeg;base64,${item.imagen || item.foto_base64}`;
    imgHtml = `<img src="${src}" class="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl border border-slate-700 bg-slate-900 shrink-0 shadow-sm" />`;
  } else {
    imgHtml = `
      <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-slate-800 border border-slate-700 flex flex-col items-center justify-center text-slate-400 shrink-0">
        <span class="material-symbols-outlined text-[24px]">smartphone</span>
      </div>
    `;
  }

  // Specs badges
  const badges = [];
  if (item.ram) badges.push(`<span class="px-2 py-0.5 rounded bg-violet-950/60 text-violet-300 border border-violet-800/50 font-bold">RAM: ${item.ram}</span>`);
  if (item.memoria) badges.push(`<span class="px-2 py-0.5 rounded bg-blue-950/60 text-blue-300 border border-blue-800/50 font-bold">ROM: ${item.memoria}</span>`);
  if (item.color) badges.push(`<span class="px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/50 font-bold">Color: ${item.color}</span>`);
  if (item.imei1) badges.push(`<span class="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/50 font-mono font-bold">IMEI: ${item.imei1}</span>`);

  const numCosto = Number(item.costo) || 0;
  const costoVal = numCosto > 0 ? numCosto.toLocaleString('es-CO') : '';
  
  // Calcular en automático
  const autoFinal = numCosto > 0 ? Math.ceil((numCosto * 1.20) / 1000) * 1000 : (Number(item.precioVenta || item.venta) || 0);
  const autoRev = numCosto > 0 ? Math.ceil(Math.max(numCosto * 1.05, numCosto + 20000) / 1000) * 1000 : (Number(item.precioRevendedor) || 0);

  const precioVal = autoFinal > 0 ? autoFinal.toLocaleString('es-CO') : '';
  const revVal = autoRev > 0 ? autoRev.toLocaleString('es-CO') : '';

  const fmt = n => `$${Number(n).toLocaleString('es-CO')}`;

  const isLast = stepIndex === total - 1;
  const isSingle = total === 1;

  return `
    <div id="${wizardId}" class="wizard-container space-y-3 bg-slate-900/95 text-white p-4 sm:p-5 rounded-2xl border border-slate-700/80 shadow-2xl" data-wizard-id="${wizardId}" data-msg-id="${msgId}">
      <!-- Wizard Header -->
      <div class="flex items-center justify-between border-b border-slate-800 pb-3 gap-2">
        <div class="flex items-center gap-2 min-w-0">
          <div class="w-7 h-7 rounded-lg bg-primary/20 text-primary flex items-center justify-center font-bold text-xs shrink-0">
            <span class="material-symbols-outlined text-[16px]">smartphone</span>
          </div>
          <div class="min-w-0">
            <h4 class="text-xs font-black text-white tracking-tight truncate">${isSingle ? (item.type === 'crear_equipo' ? 'Registro de Celular con IMEI' : 'Registro de Producto') : `Registro de Productos (${total})`}</h4>
            <p class="text-[10px] text-slate-400">${isSingle ? 'Ingresa costo para calcular precio de venta en automático' : `Completando producto <span class="text-primary font-bold">${stepIndex + 1}</span> de <span class="font-bold">${total}</span>`}</p>
          </div>
        </div>
        ${!isSingle ? `
        <!-- Tabs -->
        <div class="flex items-center gap-1 overflow-x-auto max-w-[50%] sm:max-w-[60%] py-0.5">
          ${tabsHtml}
        </div>
        ` : ''}
      </div>

      <!-- Current Step Product Card -->
      <div class="flex gap-3 bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 items-center">
        ${imgHtml}
        <div class="flex-1 min-w-0 space-y-1">
          <div class="flex items-center gap-2">
            <span class="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-primary/20 text-primary border border-primary/30 shrink-0">${item.marca || 'Universal'}</span>
            <span class="text-[9px] font-bold uppercase tracking-wider text-slate-400">${item.type === 'crear_equipo' ? 'Equipo IMEI' : 'Inventario General'}</span>
          </div>
          <h5 class="text-xs sm:text-sm font-bold text-white leading-snug">${item.nombre || 'Producto sin nombre'}</h5>
          <div class="flex flex-wrap gap-1 text-[9px] pt-0.5">
            ${badges.join("")}
          </div>
        </div>
      </div>

      <!-- Missing Inputs Grid -->
      <div class="space-y-3 pt-1">
        <!-- Input Costo -->
        <div>
          <div class="flex items-center justify-between mb-1">
            <label class="block text-[10px] font-black uppercase tracking-wider text-slate-400">1. Ingresa el Costo de Compra *</label>
            ${total > 1 ? `
              <button type="button" onclick="window.wizardApplyToAll('${wizardId}')" class="text-[9px] font-bold text-primary hover:underline flex items-center gap-0.5">
                <span class="material-symbols-outlined text-[11px]">bolt</span> Aplicar a los ${total}
              </button>
            ` : ''}
          </div>
          <div class="flex items-center bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 focus-within:border-primary">
            <span class="text-slate-400 font-bold text-sm mr-2">$</span>
            <input type="text" data-field="costo" placeholder="Escribe el costo (Ej: 450.000)" value="${costoVal}" oninput="window.wizardOnCostoInput(this, '${wizardId}')" class="w-full bg-transparent text-sm sm:text-base text-white font-mono font-bold outline-none" required autofocus />
          </div>
        </div>

        <!-- Matriz de Calificación Automática de Precios -->
        <div class="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-2.5">
          <div class="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-slate-400">
            <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[14px] text-primary">auto_graph</span> Precios Calculados en Automático:</span>
            <span class="text-emerald-400 font-bold">✓ Listo para guardar</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <!-- Calificación Revendedor -->
            <div class="bg-amber-950/20 border border-amber-800/40 p-2.5 rounded-xl space-y-1">
              <div class="flex items-center justify-between">
                <span class="text-[11px] font-bold text-amber-400 flex items-center gap-1">💼 Para Revendedor</span>
                <span class="text-[9px] px-1.5 py-0.5 rounded bg-amber-900/50 text-amber-300 font-bold">+5% / +$20k</span>
              </div>
              <div class="flex items-baseline justify-between">
                <span class="text-sm sm:text-base font-black text-white font-mono" data-preview="rev-price">${autoRev > 0 ? fmt(autoRev) : '$—'}</span>
                <span class="text-[10px] text-amber-300/80 font-mono" data-preview="rev-profit">${numCosto > 0 ? `Ganancia: +${fmt(autoRev - numCosto)}` : '+ $0'}</span>
              </div>
              <input type="hidden" data-field="precioRevendedor" value="${revVal}" />
            </div>

            <!-- Calificación Cliente Final -->
            <div class="bg-emerald-950/20 border border-emerald-800/40 p-2.5 rounded-xl space-y-1">
              <div class="flex items-center justify-between">
                <span class="text-[11px] font-bold text-emerald-400 flex items-center gap-1">🛍️ Para Cliente Final</span>
                <span class="text-[9px] px-1.5 py-0.5 rounded bg-emerald-900/50 text-emerald-300 font-bold">+20%</span>
              </div>
              <div class="flex items-baseline justify-between">
                <span class="text-sm sm:text-base font-black text-white font-mono" data-preview="final-price">${autoFinal > 0 ? fmt(autoFinal) : '$—'}</span>
                <span class="text-[10px] text-emerald-300/80 font-mono" data-preview="final-profit">${numCosto > 0 ? `Ganancia: +${fmt(autoFinal - numCosto)}` : '+ $0'}</span>
              </div>
              <input type="hidden" data-field="precio" value="${precioVal}" />
            </div>
          </div>

          <!-- Escalas de referencia rápida -->
          <div class="flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-900 font-mono flex-wrap gap-1">
            <span>Escala 15%: <b class="text-slate-200" data-preview="esc-15">${numCosto > 0 ? fmt(Math.ceil((numCosto * 1.15) / 1000) * 1000) : '$—'}</b></span>
            <span>Escala 25%: <b class="text-slate-200" data-preview="esc-25">${numCosto > 0 ? fmt(Math.ceil((numCosto * 1.25) / 1000) * 1000) : '$—'}</b></span>
            <span>Escala 30%: <b class="text-slate-200" data-preview="esc-30">${numCosto > 0 ? fmt(Math.ceil((numCosto * 1.30) / 1000) * 1000) : '$—'}</b></span>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          ${item.type === 'crear_equipo' ? `
          <div>
            <label class="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">IMEI Principal (15 dígitos)</label>
            <input type="text" data-field="imei1" placeholder="Ej: 356251200774692" value="${item.imei1 || ''}" maxlength="15" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs sm:text-sm text-white font-mono outline-none focus:border-primary" />
          </div>
          <div>
            <label class="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Color</label>
            <input type="text" data-field="color" placeholder="Ej: Azul, Negro" value="${item.color || ''}" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs sm:text-sm text-white outline-none focus:border-primary" />
          </div>
          ` : `
          <div>
            <label class="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Stock Inicial</label>
            <input type="number" data-field="stockActual" placeholder="1" value="${item.stockActual || 1}" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs sm:text-sm text-white font-mono outline-none focus:border-primary" />
          </div>
          <div>
            <label class="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Color / Versión</label>
            <input type="text" data-field="color" placeholder="Ej: Azul, 128GB" value="${item.color || ''}" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs sm:text-sm text-white outline-none focus:border-primary" />
          </div>
          `}
        </div>
      </div>
          ${item.type === 'crear_equipo' ? `
          <div>
            <label class="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">IMEI Principal (15 dígitos)</label>
            <input type="text" data-field="imei1" placeholder="Ej: 356251200774692" value="${item.imei1 || ''}" maxlength="15" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs sm:text-sm text-white font-mono outline-none focus:border-primary" />
          </div>
          <div>
            <label class="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Color</label>
            <input type="text" data-field="color" placeholder="Ej: Azul, Negro" value="${item.color || ''}" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs sm:text-sm text-white outline-none focus:border-primary" />
          </div>
          ` : `
          <div>
            <label class="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Stock Inicial</label>
            <input type="number" data-field="stockActual" placeholder="1" value="${item.stockActual || 1}" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs sm:text-sm text-white font-mono outline-none focus:border-primary" />
          </div>
          <div>
            <label class="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Color / Versión</label>
            <input type="text" data-field="color" placeholder="Ej: Azul, 128GB" value="${item.color || ''}" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs sm:text-sm text-white outline-none focus:border-primary" />
          </div>
          `}
        </div>
      </div>

      <!-- Navigation & Action Buttons -->
      <div class="flex items-center ${isSingle ? 'justify-end' : 'justify-between'} pt-2 border-t border-slate-800 gap-2">
        ${!isSingle ? `
        <button type="button" onclick="window.wizardGoToPrev('${wizardId}')" ${stepIndex === 0 ? 'disabled' : ''} class="px-3 py-2 text-xs font-bold text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none rounded-xl hover:bg-slate-800 transition-all flex items-center gap-1">
          <span class="material-symbols-outlined text-[16px]">arrow_back</span> Anterior
        </button>
        ` : ''}

        <div class="flex items-center gap-2">
          <button type="button" onclick="window.wizardSaveAndNext('${wizardId}')" class="px-4 py-2 bg-primary text-on-primary text-xs font-bold rounded-xl hover:bg-primary/90 active:scale-95 transition-all shadow-md flex items-center gap-1.5">
            <span>${isSingle ? 'Guardar Producto ✓' : (isLast ? 'Guardar y Finalizar ✓' : 'Guardar y Siguiente')}</span>
            <span class="material-symbols-outlined text-[16px]">${(isSingle || isLast) ? 'check' : 'arrow_forward'}</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderMultiProductWizard(itemsList, appendChatMessage) {
  const wizardId = `wizard-${Date.now()}`;
  window.wizardStateStore[wizardId] = {
    step: 0,
    items: itemsList.map(a => ({
      ...a,
      costo: a.costo || "",
      precioVenta: a.precioVenta || a.venta || a.precio || "",
      venta: a.venta || a.precioVenta || a.precio || "",
      stockActual: a.stockActual !== undefined ? a.stockActual : (a.stock || 1),
      saved: false
    }))
  };

  const html = buildWizardStepHtml(wizardId, 0);
  const msgId = appendChatMessage("ai", null, html, null, true);
  if (window.wizardStateStore[wizardId]) {
    window.wizardStateStore[wizardId].msgId = msgId;
  }
}

window.wizardGoToStep = (wizardId, targetStep) => {
  const state = window.wizardStateStore[wizardId];
  if (!state || targetStep < 0 || targetStep >= state.items.length) return;

  const container = document.getElementById(wizardId);
  if (!container) return;

  // Save current step fields
  const stepIndex = state.step;
  const item = state.items[stepIndex];
  const costoInput = container.querySelector('[data-field="costo"]');
  const precioInput = container.querySelector('[data-field="precio"]');
  const revInput = container.querySelector('[data-field="precioRevendedor"]');
  const imeiInput = container.querySelector('[data-field="imei1"]');
  const stockInput = container.querySelector('[data-field="stockActual"]');
  const colorInput = container.querySelector('[data-field="color"]');

  if (costoInput) item.costo = Number(costoInput.value.replace(/\D/g, "")) || item.costo;
  if (precioInput) {
    const val = Number(precioInput.value.replace(/\D/g, "")) || item.precioVenta;
    item.precioVenta = val;
    item.venta = val;
  }
  if (revInput) {
    item.precioRevendedor = Number(revInput.value.replace(/\D/g, "")) || item.precioRevendedor;
  }
  if (imeiInput && imeiInput.value.trim()) item.imei1 = imeiInput.value.trim();
  if (stockInput) item.stockActual = Number(stockInput.value) || 1;
  if (colorInput) item.color = colorInput.value.trim();

  state.step = targetStep;
  container.outerHTML = buildWizardStepHtml(wizardId, state.step);
};

window.wizardGoToPrev = (wizardId) => {
  const state = window.wizardStateStore[wizardId];
  if (!state || state.step <= 0) return;
  window.wizardGoToStep(wizardId, state.step - 1);
};

window.wizardSaveAndNext = async (wizardId) => {
  const state = window.wizardStateStore[wizardId];
  if (!state) return;

  const container = document.getElementById(wizardId);
  if (!container) return;

  const stepIndex = state.step;
  const item = state.items[stepIndex];

  // Read inputs
  const costoInput = container.querySelector('[data-field="costo"]');
  const precioInput = container.querySelector('[data-field="precio"]');
  const revInput = container.querySelector('[data-field="precioRevendedor"]');
  const imeiInput = container.querySelector('[data-field="imei1"]');
  const stockInput = container.querySelector('[data-field="stockActual"]');
  const colorInput = container.querySelector('[data-field="color"]');

  const costoVal = costoInput ? Number(costoInput.value.replace(/\D/g, "")) : 0;
  const precioVal = precioInput ? Number(precioInput.value.replace(/\D/g, "")) : 0;
  const revVal = revInput ? Number(revInput.value.replace(/\D/g, "")) : 0;

  if (costoVal <= 0 || precioVal <= 0) {
    if (costoInput && costoVal <= 0) costoInput.parentElement.classList.add('border-red-500');
    if (precioInput && precioVal <= 0) precioInput.parentElement.classList.add('border-red-500');
    if (window.showToast) window.showToast("Por favor ingresa el Costo y Precio de venta.", "warning");
    return;
  }

  item.costo = costoVal;
  item.precioVenta = precioVal;
  item.venta = precioVal;
  item.precioRevendedor = revVal;
  if (imeiInput && imeiInput.value.trim()) item.imei1 = imeiInput.value.trim();
  if (stockInput) item.stockActual = Number(stockInput.value) || 1;
  if (colorInput) item.color = colorInput.value.trim();

  const btn = container.querySelector('button.bg-primary');
  if (btn) {
    btn.disabled = true;
    btn.textContent = "Guardando...";
  }

  try {
    // Buscar si ya existe el producto base en inventario
    const currentInv = await getInventario().catch(() => []);
    const existingProd = matchExistingInventoryProduct(currentInv, item);
    
    let productId = existingProd ? existingProd.id : `PROD-${Date.now()}-${Math.floor(Math.random()*1000)}`;

    if (!existingProd) {
      // Crear producto base en inventario
      await crearProducto([
        productId,
        item.nombre,
        item.marca || "Universal",
        "Celulares",
        "Físico",
        item.costo,
        item.precioVenta,
        1,
        item.stockActual || 1,
        item.ubicacion || "Vitrina",
        item.sku || "",
        item.imagen || item.foto_base64 || "",
        0
      ]);
    } else {
      // Incrementar stock del producto existente
      const updatedStock = (existingProd.stockActual || 0) + (Number(item.stockActual) || 1);
      const updatedSku = existingProd.sku || item.sku || "";
      const updatedImg = existingProd.imagen || item.imagen || item.foto_base64 || "";
      await actualizarProducto(existingProd.id, [
        existingProd.nombre,
        existingProd.marca || item.marca || "Universal",
        existingProd.categoria || "Celulares",
        existingProd.tipo || "Físico",
        item.costo > 0 ? item.costo : existingProd.costo,
        item.precioVenta > 0 ? item.precioVenta : existingProd.precioVenta,
        existingProd.stockMinimo || 1,
        updatedStock,
        existingProd.ubicacion || "Vitrina",
        updatedSku,
        updatedImg,
        existingProd.fijado || 0
      ]);
    }

    // Si tiene IMEI o es crear_equipo, guardarlo en la tabla equipos con sus variantes completas
    if (item.type === 'crear_equipo' || item.imei1) {
      const notasArr = [];
      if (item.precioRevendedor && item.precioRevendedor > 0) {
        notasArr.push(`Mayorista: $${Number(item.precioRevendedor).toLocaleString('es-CO')}`);
      }
      if (item.notas) notasArr.push(item.notas);

      await crearEquipo({
        imei1: item.imei1 || `SN-${Date.now()}`,
        imei2: item.imei2 || "",
        id_producto: productId,
        marca: item.marca || "",
        nombre: item.nombre,
        proveedor: item.proveedor || "",
        costo: item.costo,
        venta: item.venta || item.precioVenta,
        precio_revendedor: Number(item.precioRevendedor || item.precio_revendedor || (item.costo ? Math.ceil(Math.max(item.costo * 1.05, item.costo + 20000) / 1000) * 1000 : 0)),
        estado: "Disponible",
        color: item.color || "",
        ram: item.ram || "",
        memoria: item.memoria || "",
        condicion: item.condicion || "Nuevo",
        notas: notasArr.join(" • ")
      });
    }

    item.saved = true;
    if (window.showToast) window.showToast(`✅ Guardado: ${item.nombre}`, "success");

    // Check if more steps
    if (stepIndex < state.items.length - 1) {
      state.step = stepIndex + 1;
      container.outerHTML = buildWizardStepHtml(wizardId, state.step);
    } else {
      // Completed all products!
      const total = state.items.length;
      const completedSummaryHtml = `
        <div class="bg-slate-900/95 text-white p-4 sm:p-5 rounded-2xl border border-emerald-500/50 shadow-2xl space-y-3">
          <div class="flex items-center gap-2.5 text-emerald-400">
            <span class="material-symbols-outlined text-[24px]">check_circle</span>
            <div>
              <h4 class="text-sm font-black text-white">¡Todos los productos (${total}) fueron registrados con éxito!</h4>
              <p class="text-[11px] text-emerald-300/80 font-medium">Fotos, especificaciones y precios guardados en el inventario</p>
            </div>
          </div>
          <div class="space-y-2 max-h-[300px] overflow-y-auto pr-1 divide-y divide-slate-800">
            ${state.items.map(it => `
              <div class="flex items-center gap-3 pt-2">
                ${it.imagen || it.foto_base64 ? `<img src="${(it.imagen||it.foto_base64).startsWith('data:')?(it.imagen||it.foto_base64):'data:image/jpeg;base64,'+(it.imagen||it.foto_base64)}" class="w-10 h-10 object-cover rounded-lg border border-slate-700 bg-slate-950 shrink-0" />` : '<div class="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 shrink-0"><span class="material-symbols-outlined text-[18px]">smartphone</span></div>'}
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-bold text-white truncate">${it.nombre}</p>
                  <p class="text-[10px] text-slate-400">${it.marca || ''} ${it.ram ? '• ' + it.ram : ''} ${it.memoria ? '• ' + it.memoria : ''} ${it.color ? '• ' + it.color : ''}</p>
                </div>
                <div class="text-right shrink-0">
                  <p class="text-xs font-black text-emerald-400">$${Number(it.precioVenta || it.venta || 0).toLocaleString('es-CO')}</p>
                  <p class="text-[10px] text-slate-400">Costo: $${Number(it.costo || 0).toLocaleString('es-CO')}</p>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      `;

      const bubble = container.closest('[data-chat-bubble]') || container.parentElement;
      if (bubble) {
        bubble.innerHTML = completedSummaryHtml;
      } else {
        container.outerHTML = completedSummaryHtml;
      }

      // Persist completed state to localStorage!
      const targetMsgId = state.msgId || container.dataset?.msgId || container.closest('[data-msg-id]')?.dataset?.msgId;
      if (targetMsgId && window.updateStoredChatMessage) {
        window.updateStoredChatMessage(targetMsgId, completedSummaryHtml);
      }

      // Reload active views
      if (window.viewReloaders) {
        Object.keys(window.viewReloaders).forEach(key => {
          const reloadFn = window.viewReloaders[key];
          if (typeof reloadFn === 'function') {
            try { reloadFn(); } catch (e) { console.error(e); }
          }
        });
      }
    }
  } catch (err) {
    showToast("Error al guardar: " + err.message, "error");
    if (btn) {
      btn.disabled = false;
      btn.textContent = stepIndex === state.items.length - 1 ? 'Guardar y Finalizar ✓' : 'Guardar y Siguiente';
    }
  }
};

// Función helper para pintar un formulario interactivo dentro de la burbuja del chat
// cuando faltan campos obligatorios en una sola acción.
function renderInteractiveFormIfMissing(action, requiredFields, appendChatMessage, titleText, actionType) {
  const missing = [];
  requiredFields.forEach(f => {
    const val = action[f.name];
    if (val === undefined || val === null || String(val).trim() === "" || (f.type === 'number' && Number(val) === 0)) {
      missing.push(f);
    }
  });

  if (missing.length > 0) {
    const formId = `form-missing-${Date.now()}`;
    const encodedAction = encodeURIComponent(JSON.stringify(action));
    
    let fieldsHtml = `
      <div class="space-y-3">
        <p class="font-bold text-sm text-yellow-600 dark:text-yellow-400">
          ⚠️ Faltan datos obligatorios para ${titleText}:
        </p>
        <div id="${formId}" class="space-y-2 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
    `;

    if (action.imagen || action.foto_base64) {
      const src = (action.imagen || action.foto_base64).startsWith("data:") ? (action.imagen || action.foto_base64) : `data:image/jpeg;base64,${action.imagen || action.foto_base64}`;
      fieldsHtml += `
        <div class="flex items-center gap-3 bg-white dark:bg-slate-950 p-2 rounded-xl border border-slate-200 dark:border-slate-800 mb-2">
          <img src="${src}" class="w-12 h-12 object-cover rounded-lg border border-slate-200 dark:border-slate-700 shrink-0" />
          <div class="min-w-0">
            <p class="text-xs font-bold text-slate-900 dark:text-white truncate">${action.nombre || 'Producto'}</p>
            <p class="text-[10px] text-slate-500 dark:text-slate-400">${action.marca || ''} ${action.ram ? '• ' + action.ram : ''} ${action.memoria ? '• ' + action.memoria : ''} ${action.color ? '• ' + action.color : ''}</p>
          </div>
        </div>
      `;
    }

    requiredFields.forEach(f => {
      const isMissing = missing.includes(f);
      const val = action[f.name] !== undefined && action[f.name] !== null ? action[f.name] : "";
      
      if (isMissing) {
        fieldsHtml += `
          <div>
            <label class="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">${f.label} *</label>
            <input type="${f.type === 'number' ? 'text' : 'text'}" data-field="${f.name}" placeholder="${f.placeholder}" ${f.type === 'number' ? 'oninput="window.wizardFormatCurrency(this)"' : ''} class="w-full px-3 py-1.5 text-sm bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg focus:outline-none focus:border-primary text-slate-900 dark:text-white font-mono" required />
          </div>
        `;
      } else {
        fieldsHtml += `<input type="hidden" data-field="${f.name}" value="${val}" />`;
      }
    });

    fieldsHtml += `
          <div class="flex gap-2 justify-end mt-3">
            <button type="button" onclick="window.submitMissingActionData('${formId}', '${actionType}', '${encodedAction}')" class="px-4 py-2 bg-primary text-on-primary text-xs font-bold rounded-lg hover:bg-primary/90 active:scale-95 transition-all shadow-md">
              Completar Registro
            </button>
          </div>
        </div>
      </div>
    `;

    // saveToStorage = true para persistir el mensaje, el cual luego se actualizará a solo lectura al completar
    appendChatMessage("ai", null, fieldsHtml, null, true);
    return true; // Indica que se pintó el formulario
  }
  return false;
}

// ── EJECUTOR DE ACCIONES Y HERRAMIENTAS PARA EL AGENTE DE IA ──
export async function ejecutarAccionIA(actionOrActions, base64Image = null, appendChatMessage, parentMsgId = null) {
  if (!actionOrActions) return;

  const actionsList = Array.isArray(actionOrActions) ? actionOrActions : [actionOrActions];
  if (actionsList.length === 0) return;

  const imgArray = base64Image ? (Array.isArray(base64Image) ? base64Image : [base64Image]) : [];

  // Asignar imagen adecuada a cada acción según su imagen_index
  actionsList.forEach(act => {
    if (imgArray.length > 0) {
      const idx = (act.imagen_index !== undefined && act.imagen_index !== null)
        ? Number(act.imagen_index)
        : 0;
      const singleImg = imgArray[idx] || imgArray[0] || "";
      if (singleImg) {
        act.imagen = singleImg;
        act.foto_base64 = singleImg;
      }
    }
  });

  // Interceptar appendChatMessage para que los logs del sistema ("system") se muestren como Toasts
  const originalAppend = appendChatMessage;
  appendChatMessage = (role, text, html, ...rest) => {
    if (role === "system" && text) {
      if (text.startsWith("[OK]")) {
        showToast(text.replace("[OK]", "").trim(), "success");
      } else if (text.startsWith("[Error]")) {
        showToast(text.replace("[Error]", "").trim(), "error");
      } else {
        console.log("[IA System Log]:", text);
      }
      return;
    }
    return originalAppend(role, text, html, ...rest);
  };

  // Normalizar precios y costos si vienen definidos en el mensaje o en la acción
  actionsList.forEach(act => {
    if (act.type === 'crear_producto' || act.type === 'crear_equipo') {
      const c = Number(act.costo) || 0;
      const v = Number(act.venta || act.precioVenta || act.precio) || 0;

      if (c > 0 && v === 0) {
        act.costo = c;
        act.venta = Math.ceil((c * 1.20) / 1000) * 1000;
        act.precioVenta = act.venta;
        act.precioRevendedor = Math.ceil(Math.max(c * 1.05, c + 20000) / 1000) * 1000;
      } else if (v > 0 && c === 0) {
        // Si el usuario envió un precio en el texto (ej: "precio de 330000"), ese es el costo de compra:
        act.costo = v;
        act.venta = Math.ceil((v * 1.20) / 1000) * 1000;
        act.precioVenta = act.venta;
        act.precioRevendedor = Math.ceil(Math.max(v * 1.05, v + 20000) / 1000) * 1000;
      } else if (c > 0 && v > 0) {
        act.costo = c;
        act.venta = v;
        act.precioVenta = v;
        if (!act.precioRevendedor) {
          act.precioRevendedor = Math.ceil(Math.max(c * 1.05, c + 20000) / 1000) * 1000;
        }
      }
    }
  });

  // Si hay productos o celulares detectados que NO tienen costo (costo === 0), abrir Wizard
  const productActions = actionsList.filter(a => a.type === 'crear_producto' || a.type === 'crear_equipo');
  const needsPricing = productActions.some(a => !a.costo || Number(a.costo) === 0);

  if (productActions.length > 0 && needsPricing) {
    renderMultiProductWizard(actionsList, appendChatMessage);
    return;
  }

  // Si ya tienen costo y son múltiples productos, ejecutarlos directamente y mostrar tarjeta verde de éxito
  if (actionsList.length > 1 && productActions.length > 1) {
    let savedCount = 0;
    for (const act of actionsList) {
      await ejecutarAccionIndividual(act, appendChatMessage);
      savedCount++;
    }
    const costSample = productActions[0]?.costo ? Number(productActions[0].costo).toLocaleString('es-CO') : '';
    const saleSample = productActions[0]?.venta ? Number(productActions[0].venta).toLocaleString('es-CO') : '';
    appendChatMessage("ai", null, `
      <div class="bg-slate-900/95 text-white p-4 rounded-2xl border border-emerald-500/50 shadow-2xl space-y-2">
        <div class="flex items-center gap-2.5 text-emerald-400">
          <span class="material-symbols-outlined text-[26px]">check_circle</span>
          <div>
            <h4 class="text-sm font-black text-white">¡${savedCount} equipos guardados con éxito en la base de datos!</h4>
            <p class="text-[11px] text-emerald-300/80 font-medium">Costo unitario: $${costSample} | Precio venta calculado (+20%): $${saleSample}</p>
          </div>
        </div>
      </div>
    `, null, true);
    return;
  }

  // Ejecución individual
  for (const action of actionsList) {
    await ejecutarAccionIndividual(action, appendChatMessage);
  }
}

async function ejecutarAccionIndividual(action, appendChatMessage) {
  if (!action || !action.type) return;

  if (action.type === 'registrar_egreso') {
    const fields = [
      { name: 'monto', label: 'Monto del Egreso', type: 'number', placeholder: 'Ej: 15000' },
      { name: 'concepto', label: 'Concepto o Detalle', type: 'text', placeholder: 'Ej: Almuerzo de trabajo' },
      { name: 'categoria', label: 'Categoría', type: 'text', placeholder: 'Ej: Suministros' },
      { name: 'responsable', label: 'Responsable', type: 'text', placeholder: 'Ej: Juan' }
    ];
    if (renderInteractiveFormIfMissing(action, fields, appendChatMessage, "registrar el egreso", "registrar_egreso")) return;

    appendChatMessage("system", `Ejecutando acción: Registrar egreso por $${action.monto}...`);
    try {
      const cleanMonto = typeof action.monto === 'string' ? Number(action.monto.replace(/\D/g, "")) : Number(action.monto);
      const res = await registrarEgreso({
        categoria: action.categoria || "Otros",
        concepto: action.concepto || "Egreso vía IA",
        responsable: action.responsable || "Asistente IA",
        monto: isNaN(cleanMonto) ? 0 : cleanMonto
      });
      if (res && res.success) {
        showToast("Egreso registrado con éxito", "success");
        appendChatMessage("system", `[OK] Egreso registrado: ${action.concepto} ($${action.monto})`);
      } else {
        appendChatMessage("system", `[Error] Error al registrar egreso: ${res.mensaje || 'Error desconocido'}`);
      }
    } catch (e) {
      appendChatMessage("system", `[Error] Excepción al registrar egreso: ${e.message}`);
    }
  }
  else if (action.type === 'crear_tarea') {
    const fields = [
      { name: 'tarea', label: 'Título de la Tarea', type: 'text', placeholder: 'Ej: Contabilizar todos los forros' },
      { name: 'fecha_vencimiento', label: 'Fecha de Vencimiento', type: 'text', placeholder: 'Ej: YYYY-MM-DD' }
    ];
    if (renderInteractiveFormIfMissing(action, fields, appendChatMessage, "crear la tarea", "crear_tarea")) return;

    appendChatMessage("system", `Ejecutando acción: Crear tarea "${action.tarea}"...`);
    try {
      const res = await crearTarea({
        tarea: action.tarea,
        fecha_inicio: action.fecha_inicio || new Date().toISOString().split('T')[0],
        fecha_vencimiento: action.fecha_vencimiento || new Date().toISOString().split('T')[0],
        prioridad: action.prioridad || "Media",
        estado: "Pendiente",
        responsable: action.responsable || "",
        notas: action.notas || "Creada por Asistente de Voz",
        color: action.color || "#eab308"
      });
      if (res && res.success) {
        showToast("Tarea creada con éxito", "success");
        appendChatMessage("system", `[OK] Tarea creada: "${action.tarea}"`);
      } else {
        appendChatMessage("system", `[Error] Error al crear tarea: ${res.mensaje || 'Error desconocido'}`);
      }
    } catch (e) {
      appendChatMessage("system", `[Error] Excepción al crear tarea: ${e.message}`);
    }
  }
  else if (action.type === 'buscar_cliente') {
    appendChatMessage("system", `Ejecutando acción: Buscar cliente "${action.query}"...`);
    try {
      const clientes = await getClientes();
      const query = (action.query || "").toLowerCase().trim();
      const matches = clientes.filter(c => 
        String(c.cedula || "").toLowerCase().includes(query) ||
        String(c.nombre || "").toLowerCase().includes(query) ||
        String(c.telefono || "").toLowerCase().includes(query)
      );

      if (matches.length === 0) {
        appendChatMessage("ai", "", `
          <p>No encontré clientes que coincidan con <strong>"${action.query}"</strong>.</p>
          <button class="mt-2 px-3 py-1.5 bg-primary text-on-primary text-[11px] font-bold rounded-lg hover:bg-primary/90 transition-all flex items-center gap-1 active:scale-95" onclick="window.assistantNavigateTo('clients')">
            <span class="material-symbols-outlined text-[14px]">person_add</span> Ver Clientes
          </button>
        `);
      } else {
        const matchesHtml = matches.slice(0, 3).map(c => `
          <div class="p-2 bg-slate-50 border border-slate-100 rounded-lg flex flex-col gap-0.5 mt-1">
            <span class="font-bold text-slate-800">${c.nombre}</span>
            <span class="text-[10px] text-slate-500 font-mono">Doc: ${c.cedula} | Tel: ${c.telefono}</span>
            ${c.email ? `<span class="text-[10px] text-slate-500 font-mono">Email: ${c.email}</span>` : ''}
          </div>
        `).join("");
        
        const buttonId = `btn-go-cli-${Date.now()}`;
        appendChatMessage("ai", "", `
          <p>He encontrado ${matches.length} coincidencia${matches.length > 1 ? 's' : ''} para <strong>"${action.query}"</strong>:</p>
          <div class="space-y-1 my-2">
            ${matchesHtml}
            ${matches.length > 3 ? `<p class="text-[10px] text-slate-400 font-medium italic">Y ${matches.length - 3} más...</p>` : ''}
          </div>
          <button id="${buttonId}" class="px-3 py-1.5 bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold rounded-lg hover:bg-primary/20 transition-all flex items-center gap-1 active:scale-95 mt-2">
            <span class="material-symbols-outlined text-[14px]">open_in_new</span> Ver todos en Clientes
          </button>
        `);

        setTimeout(() => {
          const btn = document.getElementById(buttonId);
          if (btn) {
            btn.addEventListener("click", () => {
              localStorage.setItem("clients_search_query", action.query);
              navigate("clients");
            });
          }
        }, 55);
      }
    } catch (e) {
      appendChatMessage("system", `[Error] Error al consultar clientes: ${e.message}`);
    }
  }
  else if (action.type === 'ir_a') {
    appendChatMessage("system", `Redirigiendo a: ${action.destino}...`);
    setTimeout(() => {
      navigate(action.destino);
    }, 1000);
  }
  else if (action.type === 'crear_cliente') {
    const fields = [
      { name: 'nombre', label: 'Nombre del Cliente', type: 'text', placeholder: 'Ej: Juan Pérez' },
      { name: 'cedula', label: 'Cédula o NIT', type: 'text', placeholder: 'Ej: 1023456789' },
      { name: 'direccion', label: 'Dirección', type: 'text', placeholder: 'Ej: Calle 10 #5-20' },
      { name: 'telefono', label: 'Teléfono', type: 'text', placeholder: 'Ej: 3001234567' }
    ];
    if (renderInteractiveFormIfMissing(action, fields, appendChatMessage, "registrar el cliente", "crear_cliente")) return;

    appendChatMessage("system", `Creando cliente: ${action.nombre}...`);
    try {
      const res = await crearCliente({
        cedula: action.cedula,
        nombre: action.nombre,
        telefono: action.telefono || "",
        direccion: action.direccion || "",
        email: action.email || "",
        tipo: action.tipo || "Natural"
      });
      if (res && res.success) {
        showToast("Cliente creado con éxito", "success");
        appendChatMessage("system", `[OK] Cliente creado: ${action.nombre} (Cédula: ${action.cedula})`);
      } else {
        appendChatMessage("system", `[Error] Error al crear cliente: ${res.mensaje || 'Error desconocido'}`);
      }
    } catch (e) {
      appendChatMessage("system", `[Error] Excepción al crear cliente: ${e.message}`);
    }
  }
  else if (action.type === 'crear_producto') {
    const fields = [
      { name: 'nombre', label: 'Nombre del Producto', type: 'text', placeholder: 'Ej: Cargador Tipo C 20W' },
      { name: 'costo', label: 'Costo del Producto', type: 'number', placeholder: 'Ej: 15000' },
      { name: 'precioVenta', label: 'Precio de Venta', type: 'number', placeholder: 'Ej: 35000' },
      { name: 'stockActual', label: 'Stock Inicial', type: 'number', placeholder: 'Ej: 5' }
    ];
    if (renderInteractiveFormIfMissing(action, fields, appendChatMessage, `crear el producto "${action.nombre || 'nuevo'}"`, "crear_producto")) return;

    appendChatMessage("system", `Agregando producto: ${action.nombre}...`);
    try {
      const id = action.id || `PROD-${Date.now()}`;
      let finalName = action.nombre;
      const catLower = (action.categoria || "").toLowerCase();
      if ((catLower === "celular" || catLower === "celulares") && (action.ram || action.memoria || action.color)) {
        const specs = [];
        if (action.ram) {
          specs.push(action.ram.toUpperCase().includes("RAM") ? action.ram : `${action.ram} RAM`);
        }
        if (action.memoria) {
          specs.push(action.memoria);
        }
        if (action.color) {
          specs.push(action.color);
        }
        if (specs.length > 0) {
          finalName = `${action.nombre} (${specs.join(" / ")})`;
        }
      }

      const res = await crearProducto([
        id,
        finalName,
        action.marca || "Universal",
        action.categoria || "Accesorios",
        action.tipo || "Accesorio",
        Number(action.costo || 0),
        Number(action.precioVenta || 0),
        Number(action.stockMinimo || 2),
        Number(action.stockActual || 0),
        action.ubicacion || "",
        action.sku || "",
        base64Image || action.imagen || "",
        0
      ]);
      if (res && res.success) {
        showToast("Producto agregado con éxito", "success");
        appendChatMessage("system", `[OK] Producto agregado: ${finalName} ($${action.precioVenta})`);
      } else {
        appendChatMessage("system", `[Error] Error al crear producto: ${res.mensaje || 'Error desconocido'}`);
      }
    } catch (e) {
      appendChatMessage("system", `[Error] Excepción al crear producto: ${e.message}`);
    }
  }
  else if (action.type === 'crear_equipo') {
    const fields = [
      { name: 'nombre', label: 'Nombre/Modelo del Celular', type: 'text', placeholder: 'Ej: Samsung A15 128GB' },
      { name: 'imei1', label: 'IMEI 1 (15 dígitos)', type: 'text', placeholder: 'Ej: 356251...' },
      { name: 'costo', label: 'Costo de compra', type: 'number', placeholder: 'Ej: 450000' },
      { name: 'venta', label: 'Precio de venta', type: 'number', placeholder: 'Ej: 650000' }
    ];
    if (renderInteractiveFormIfMissing(action, fields, appendChatMessage, `registrar el celular "${action.nombre || 'nuevo'}" con IMEI`, "crear_equipo")) return;

    appendChatMessage("system", `Registrando equipo IMEI: ${action.nombre}...`);
    try {
      let productId = action.id_producto || "";
      let finalProdName = action.nombre;
      const specs = [];
      if (action.ram) {
        specs.push(action.ram.toUpperCase().includes("RAM") ? action.ram : `${action.ram} RAM`);
      }
      if (action.memoria) {
        specs.push(action.memoria);
      }
      if (action.color) {
        specs.push(action.color);
      }
      if (specs.length > 0) {
        finalProdName = `${action.nombre} (${specs.join(" / ")})`;
      }

      if (!productId) {
        appendChatMessage("system", `Buscando o creando plantilla de producto para guardar la foto...`);
        const inv = await getInventario();
        const existingProd = matchExistingInventoryProduct(inv, {
          id_producto: action.id_producto || action.id,
          sku: action.sku,
          nombre: finalProdName || action.nombre,
          marca: action.marca || action.brand
        });
        
        if (existingProd) {
          productId = existingProd.id;
          appendChatMessage("system", `Plantilla existente vinculada: "${existingProd.nombre}" (Ref: ${existingProd.sku || 'N/A'})`);
          
          // Si la plantilla existente no tiene imagen o sku y se cargó uno nuevo, actualizarlo
          const imgToSave = (Array.isArray(base64Image) ? base64Image[0] : base64Image) || action.imagen || "";
          const shouldUpdateImg = imgToSave && (!existingProd.imagen || existingProd.imagen === "");
          const shouldUpdateSku = action.sku && (!existingProd.sku || existingProd.sku === "");

          if (shouldUpdateImg || shouldUpdateSku) {
            appendChatMessage("system", `Actualizando imagen y referencia en la plantilla existente...`);
            await actualizarProducto(existingProd.id, [
              existingProd.nombre,
              existingProd.marca || "Universal",
              existingProd.categoria || "Celulares",
              existingProd.tipo || "Físico",
              existingProd.costo || 0,
              existingProd.precio_venta || 0,
              existingProd.stock_minimo || 1,
              existingProd.stock_actual || 1,
              existingProd.ubicacion || "Vitrina",
              existingProd.sku || action.sku || "",
              imgToSave || existingProd.imagen || "",
              existingProd.fijado || 0
            ]);
            if (imgToSave) existingProd.imagen = imgToSave;
            if (action.sku) existingProd.sku = action.sku;
          }
        } else {
          productId = `PROD-${Date.now()}`;
          const imgToSave = (Array.isArray(base64Image) ? base64Image[0] : base64Image) || action.imagen || "";
          await crearProducto([
            productId,
            finalProdName,
            action.marca || action.brand || "Universal",
            "Celulares",
            "Físico",
            Number(action.costo || 0),
            Number(action.venta || action.precioVenta || 0),
            1,
            1,
            "Vitrina",
            action.sku || "",
            imgToSave,
            0
          ]);
          appendChatMessage("system", `[OK] Nueva plantilla de producto creada: "${finalProdName}".`);
        }
      }

      const res = await crearEquipo({
        imei1: action.imei1,
        imei2: action.imei2 || "",
        id_producto: productId,
        marca: action.marca || action.brand || "",
        nombre: finalProdName,
        proveedor: action.proveedor || "",
        costo: Number(action.costo || 0),
        venta: Number(action.venta || 0),
        precio_revendedor: Number(action.precioRevendedor || action.precio_revendedor || (action.costo ? Math.ceil(Math.max(Number(action.costo) * 1.05, Number(action.costo) + 20000) / 1000) * 1000 : 0)),
        estado: action.estado || "Disponible",
        color: action.color || "",
        ram: action.ram || "",
        memoria: action.memoria || "",
        condicion: action.condicion || "Nuevo",
        notas: action.notas || ""
      });
      if (res && res.success) {
        showToast("Equipo IMEI registrado con éxito", "success");
        appendChatMessage("system", `[OK] Equipo registrado: ${finalProdName} (IMEI: ${action.imei1})`);
      } else {
        appendChatMessage("system", `[Error] Error al registrar equipo: ${res.mensaje || 'Error desconocido'}`);
      }
    } catch (e) {
      appendChatMessage("system", `[Error] Excepción al registrar equipo: ${e.message}`);
    }
  }
  else if (action.type === 'crear_servicio_tecnico') {
    const fields = [
      { name: 'cliente', label: 'Nombre del Cliente', type: 'text', placeholder: 'Ej: Pedro Pérez' },
      { name: 'equipo', label: 'Modelo del Equipo', type: 'text', placeholder: 'Ej: iPhone 13' },
      { name: 'falla', label: 'Falla o Problema', type: 'text', placeholder: 'Ej: Pantalla rota' },
      { name: 'precio_final', label: 'Precio de la reparación', type: 'number', placeholder: 'Ej: 120000' }
    ];
    if (renderInteractiveFormIfMissing(action, fields, appendChatMessage, "crear la orden de servicio técnico", "crear_servicio_tecnico")) return;

    appendChatMessage("system", `Creando orden de servicio técnico para: ${action.cliente}...`);
    try {
      const id_orden = action.id_orden || `ST-${Date.now()}`;
      const res = await crearServicioTecnico([
        id_orden,
        action.cliente,
        action.telefono || "",
        action.equipo,
        action.imei_serie || "",
        action.falla,
        action.clave_patron || "",
        action.repuestos || "",
        Number(action.costo_taller || 0),
        Number(action.abono || 0),
        Number(action.precio_final || 0),
        action.estado || "Recibido",
        action.evidencias || ""
      ]);
      if (res && res.success) {
        showToast("Servicio técnico registrado con éxito", "success");
        appendChatMessage("system", `[OK] Orden ${id_orden} creada para ${action.cliente} (${action.equipo})`);
      } else {
        appendChatMessage("system", `[Error] Error al crear servicio técnico: ${res.mensaje || 'Error desconocido'}`);
      }
    } catch (e) {
      appendChatMessage("system", `[Error] Excepción al crear servicio técnico: ${e.message}`);
    }
  }
  else if (action.type === 'crear_credito') {
    const fields = [
      { name: 'cliente', label: 'Nombre del Cliente', type: 'text', placeholder: 'Ej: María López' },
      { name: 'total', label: 'Monto del Crédito', type: 'number', placeholder: 'Ej: 120000' },
      { name: 'detalle', label: 'Detalle o Concepto', type: 'text', placeholder: 'Ej: Cuotas protector' }
    ];
    if (renderInteractiveFormIfMissing(action, fields, appendChatMessage, "registrar el crédito", "crear_credito")) return;

    appendChatMessage("system", `Registrando crédito para: ${action.cliente}...`);
    try {
      const res = await crearCredito({
        cliente: action.cliente,
        telefono: action.telefono || "",
        idFactura: action.idFactura || "",
        total: Number(action.total || 0),
        detalle: action.detalle || "Crédito vía Asistente IA"
      });
      if (res && res.success) {
        showToast("Crédito registrado con éxito", "success");
        appendChatMessage("system", `[OK] Crédito registrado para ${action.cliente} por $${action.total}`);
      } else {
        appendChatMessage("system", `[Error] Error al registrar crédito: ${res.mensaje || 'Error desconocido'}`);
      }
    } catch (e) {
      appendChatMessage("system", `[Error] Excepción al registrar crédito: ${e.message}`);
    }
  }
  else if (action.type === 'crear_vale_fisico') {
    appendChatMessage("system", `Creando vale físico para: ${action.cliente}...`);
    try {
      const res = await crearValeFisico({
        cliente: action.cliente,
        producto: action.producto || "Accesorio",
        cantidad: Number(action.cantidad || 1),
        monto: Number(action.monto || 0),
        estado: action.estado || "Pendiente",
        foto_base64: base64Image || action.foto_base64 || ""
      });
      if (res && res.success) {
        showToast("Vale físico registrado con éxito", "success");
        appendChatMessage("system", `[OK] Vale físico creado para ${action.cliente}: ${action.producto} ($${action.monto})`);
      } else {
        appendChatMessage("system", `[Error] Error al registrar vale físico: ${res.mensaje || 'Error desconocido'}`);
      }
    } catch (e) {
      appendChatMessage("system", `[Error] Excepción al registrar vale físico: ${e.message}`);
    }
  }
  else if (action.type === 'crear_reventa') {
    const fields = [
      { name: 'producto', label: 'Nombre del Producto', type: 'text', placeholder: 'Ej: Parlante Bluetooth' },
      { name: 'costo', label: 'Costo del Proveedor', type: 'number', placeholder: 'Ej: 35000' },
      { name: 'precio', label: 'Precio de Venta', type: 'number', placeholder: 'Ej: 60000' }
    ];
    if (renderInteractiveFormIfMissing(action, fields, appendChatMessage, "registrar la reventa", "crear_reventa")) return;

    appendChatMessage("system", `Creando reventa de: ${action.producto}...`);
    try {
      const res = await crearReventa({
        producto: action.producto,
        categoria: action.categoria || "Reventa",
        costo: Number(action.costo || 0),
        precio: Number(action.precio || 0),
        proveedor: action.proveedor || ""
      });
      if (res && res.success) {
        showToast("Reventa registrada con éxito", "success");
        appendChatMessage("system", `[OK] Reventa creada: ${action.producto} (Venta: $${action.precio})`);
      } else {
        appendChatMessage("system", `[Error] Error al crear reventa: ${res.mensaje || 'Error desconocido'}`);
      }
    } catch (e) {
      appendChatMessage("system", `[Error] Excepción al crear reventa: ${e.message}`);
    }
  }
  else if (action.type === 'actualizar_producto') {
    appendChatMessage("system", `Buscando producto a actualizar: "${action.nombre_actual}"...`);
    try {
      const inv = await getInventario();
      const cleanSearch = (action.nombre_actual || "").toLowerCase().trim();
      const p = inv.find(prod => (prod.nombre || "").toLowerCase().trim() === cleanSearch);

      if (!p) {
        appendChatMessage("system", `[Error] No se encontró el producto "${action.nombre_actual}" en el inventario.`);
        showToast(`Producto "${action.nombre_actual}" no encontrado`, "error");
        return;
      }

      let finalName = action.nuevo_nombre || p.nombre;
      const catLower = (p.categoria || "").toLowerCase();
      if ((catLower === "celular" || catLower === "celulares") && (action.ram || action.memoria || action.color)) {
        let baseName = action.nuevo_nombre || p.nombre.split(" (")[0];
        const specs = [];
        const finalRam = action.ram || "";
        const finalMemoria = action.memoria || "";
        const finalColor = action.color || "";
        if (finalRam) {
          specs.push(finalRam.toUpperCase().includes("RAM") ? finalRam : `${finalRam} RAM`);
        }
        if (finalMemoria) {
          specs.push(finalMemoria);
        }
        if (finalColor) {
          specs.push(finalColor);
        }
        if (specs.length > 0) {
          finalName = `${baseName} (${specs.join(" / ")})`;
        } else {
          finalName = baseName;
        }
      }

      const costo = action.costo !== undefined ? Number(action.costo) : p.costo;
      const precioVenta = action.precioVenta !== undefined ? Number(action.precioVenta) : p.precio_venta;
      const stockMinimo = action.stockMinimo !== undefined ? Number(action.stockMinimo) : p.stock_minimo;
      const stockActual = action.stockActual !== undefined ? Number(action.stockActual) : p.stock_actual;
      const sku = action.sku !== undefined ? action.sku : p.sku;
      const imagen = base64Image || p.imagen || "";

      const datos = [
        p.id,
        finalName,
        p.marca || "Universal",
        p.categoria || "Accesorios",
        p.tipo || "Accesorio",
        costo,
        precioVenta,
        stockMinimo,
        stockActual,
        p.ubicacion || "",
        sku,
        imagen,
        p.fijado || 0
      ];

      const res = await actualizarProducto(p.id, datos);
      if (res && res.success) {
        showToast("Producto actualizado con éxito", "success");
        appendChatMessage("system", `[OK] Producto "${p.nombre}" actualizado a "${finalName}".`);
      } else {
        appendChatMessage("system", `[Error] Error al actualizar producto: ${res.mensaje || 'Error desconocido'}`);
      }
    } catch (e) {
      appendChatMessage("system", `[Error] Excepción al actualizar producto: ${e.message}`);
    }
  }
  else if (action.type === 'crear_meta') {
    const fields = [
      { name: 'titulo', label: 'Título de la Meta', type: 'text', placeholder: 'Ej: Ventas del día' },
      { name: 'monto_objetivo', label: 'Monto Objetivo', type: 'number', placeholder: 'Ej: 100000' }
    ];
    if (renderInteractiveFormIfMissing(action, fields, appendChatMessage, "crear la meta financiera", "crear_meta")) return;

    appendChatMessage("system", `Ejecutando acción: Crear meta "${action.titulo}" por $${action.monto_objetivo}...`);
    try {
      const cleanMonto = typeof action.monto_objetivo === 'string' ? Number(action.monto_objetivo.replace(/\D/g, "")) : Number(action.monto_objetivo);
      const res = await crearMeta({
        titulo: action.titulo || "Meta financiera",
        monto_objetivo: isNaN(cleanMonto) ? 0 : cleanMonto,
        tipo_calculo: action.tipo_calculo || "Ventas",
        fecha_inicio: action.fecha_inicio || new Date().toISOString().split('T')[0],
        fecha_limite: action.fecha_limite || new Date().toISOString().split('T')[0],
        notas: action.notas || "Creada por Asistente de Voz",
        estado: "Activa"
      });
      if (res && res.success) {
        showToast("Meta financiera creada con éxito", "success");
        appendChatMessage("system", `[OK] Meta creada: "${action.titulo}" por $${action.monto_objetivo}`);
      } else {
        appendChatMessage("system", `[Error] Error al crear meta: ${res.mensaje || 'Error desconocido'}`);
      }
    } catch (e) {
      appendChatMessage("system", `[Error] Excepción al crear meta: ${e.message}`);
    }
  }
  else if (action.type === 'crear_prestamo') {
    const fields = [
      { name: 'empleado', label: 'Nombre del Empleado', type: 'text', placeholder: 'Ej: Johan' },
      { name: 'monto', label: 'Monto del Préstamo', type: 'number', placeholder: 'Ej: 100000' }
    ];
    if (renderInteractiveFormIfMissing(action, fields, appendChatMessage, "registrar el préstamo de nómina", "crear_prestamo")) return;

    appendChatMessage("system", `Ejecutando acción: Registrar préstamo a ${action.empleado} por $${action.monto}...`);
    try {
      const cleanMonto = typeof action.monto === 'string' ? Number(action.monto.replace(/\D/g, "")) : Number(action.monto);
      const res = await crearPrestamo({
        fecha: action.fecha || new Date().toISOString(),
        empleado: action.empleado,
        tipo: action.tipo_prestamo || 'Dinero',
        monto: isNaN(cleanMonto) ? 0 : cleanMonto,
        producto_id: action.producto_id || '',
        producto_nombre: action.producto_nombre || '',
        cantidad: action.cantidad ? Number(action.cantidad) : 0,
        estado: 'Pendiente',
        notas: action.notas || 'Préstamo vía Asistente de Voz'
      });
      if (res && res.success) {
        showToast("Préstamo registrado con éxito", "success");
        appendChatMessage("system", `[OK] Préstamo registrado a ${action.empleado} por $${action.monto}`);
      } else {
        appendChatMessage("system", `[Error] Error al registrar préstamo: ${res.mensaje || 'Error desconocido'}`);
      }
    } catch (e) {
      appendChatMessage("system", `[Error] Excepción al registrar préstamo: ${e.message}`);
    }
  }

  // Recargar cualquier vista activa en pantalla para reflejar los cambios en tiempo real
  if (window.viewReloaders) {
    Object.keys(window.viewReloaders).forEach(key => {
      const reloadFn = window.viewReloaders[key];
      if (typeof reloadFn === 'function') {
        try {
          reloadFn();
        } catch (e) {
          console.error(`Error recargando vista ${key}:`, e);
        }
      }
    });
  }
}

// Handler global para procesar los datos de cualquier acción a la que le falten datos y que el usuario
// haya rellenado a través de los inputs en la burbuja de chat.
window.submitMissingActionData = async (formId, actionType, originalActionJsonStr) => {
  const container = document.getElementById(formId);
  if (!container) return;

  const originalAction = JSON.parse(decodeURIComponent(originalActionJsonStr));
  const inputs = container.querySelectorAll('input[data-field], select[data-field], textarea[data-field]');
  
  const updatedData = { ...originalAction };
  let hasEmptyRequired = false;
  
  inputs.forEach(input => {
    const field = input.dataset.field;
    let val = input.value.trim();
    
    if (input.hasAttribute('required') && !val) {
      hasEmptyRequired = true;
      input.classList.add('border-red-500');
    } else {
      input.classList.remove('border-red-500');
    }
    
    if (input.type === 'number' || input.dataset.type === 'number' || field === 'costo' || field === 'precio' || field === 'precioVenta' || field === 'venta' || field === 'monto') {
      const cleanDigits = val.replace(/\D/g, "");
      val = cleanDigits ? Number(cleanDigits) : 0;
    }
    
    updatedData[field] = val;
  });

  if (hasEmptyRequired) {
    showToast("Por favor, completa todos los campos obligatorios.", "error");
    return;
  }

  const btn = container.querySelector('button');
  if (btn) {
    btn.disabled = true;
    btn.textContent = "Procesando...";
  }

  try {
    let res;
    let successMessageHtml = "";
    
    if (actionType === 'registrar_egreso') {
      res = await registrarEgreso({
        categoria: updatedData.categoria || "Otros",
        concepto: updatedData.concepto || "Egreso vía IA",
        responsable: updatedData.responsable || "Asistente IA",
        monto: Number(updatedData.monto || 0)
      });
      successMessageHtml = `
        <div class="mt-2 bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-xl border border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
          ✅ Egreso registrado exitosamente por $${Number(updatedData.monto).toLocaleString('es-CO')}.<br/>
          • Concepto: ${updatedData.concepto}<br/>
          • Categoría: ${updatedData.categoria || "Otros"}
        </div>
      `;
    }
    else if (actionType === 'crear_tarea') {
      res = await crearTarea({
        tarea: updatedData.tarea,
        fecha_inicio: updatedData.fecha_inicio || new Date().toISOString().split('T')[0],
        fecha_vencimiento: updatedData.fecha_vencimiento || new Date().toISOString().split('T')[0],
        prioridad: updatedData.prioridad || "Media",
        estado: "Pendiente",
        responsable: updatedData.responsable || "",
        notas: updatedData.notas || "Creada por Asistente de Voz",
        color: updatedData.color || "#eab308"
      });
      successMessageHtml = `
        <div class="mt-2 bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-xl border border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
          📌 Tarea "${updatedData.tarea}" creada exitosamente.<br/>
          • Prioridad: ${updatedData.prioridad || "Media"}<br/>
          • Vence: ${updatedData.fecha_vencimiento || "Hoy"}
        </div>
      `;
    }
    else if (actionType === 'crear_cliente') {
      res = await crearCliente({
        cedula: updatedData.cedula,
        nombre: updatedData.nombre,
        telefono: updatedData.telefono || "",
        direccion: updatedData.direccion || "",
        email: updatedData.email || "",
        tipo: updatedData.tipo || "Natural"
      });
      successMessageHtml = `
        <div class="mt-2 bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-xl border border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
          ✅ Cliente <strong>${updatedData.nombre}</strong> registrado exitosamente.<br/>
          • Cédula/NIT: ${updatedData.cedula}<br/>
          • Dirección: ${updatedData.direccion}
        </div>
      `;
    }
    else if (actionType === 'crear_producto') {
      const id = updatedData.id || `PROD-${Date.now()}`;
      res = await crearProducto([
        id,
        updatedData.nombre,
        updatedData.marca || "Universal",
        updatedData.categoria || "Accesorios",
        updatedData.tipo || "Accesorio",
        Number(updatedData.costo || 0),
        Number(updatedData.precioVenta || 0),
        Number(updatedData.stockMinimo || 2),
        Number(updatedData.stockActual || 0),
        updatedData.ubicacion || "",
        updatedData.sku || "",
        updatedData.imagen || "",
        0
      ]);
      successMessageHtml = `
        <div class="mt-2 bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-xl border border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
          📦 Producto "${updatedData.nombre}" agregado al inventario.<br/>
          • Venta: $${Number(updatedData.precioVenta).toLocaleString('es-CO')} | Costo: $${Number(updatedData.costo).toLocaleString('es-CO')}<br/>
          • Stock inicial: ${updatedData.stockActual} unidades
        </div>
      `;
    }
    else if (actionType === 'crear_equipo') {
      // Intentar crear plantilla si no hay id_producto
      let productId = updatedData.id_producto || "";
      if (!productId) {
        productId = `PROD-${Date.now()}`;
        await crearProducto([
          productId,
          updatedData.nombre,
          updatedData.marca || "Universal",
          "Celulares",
          "Físico",
          Number(updatedData.costo || 0),
          Number(updatedData.venta || 0),
          1,
          1,
          "Vitrina",
          updatedData.sku || "",
          updatedData.imagen || "",
          0
        ]);
      } else {
        // Si la plantilla ya existe pero no tiene imagen, la actualizamos
        try {
          const inv = await getInventario();
          const existingProd = inv.find(p => p.id === productId);
          if (existingProd && (!existingProd.imagen || existingProd.imagen === "") && updatedData.imagen) {
            await actualizarProducto(existingProd.id, [
              existingProd.nombre,
              existingProd.marca || "Universal",
              existingProd.categoria || "Celulares",
              existingProd.tipo || "Físico",
              existingProd.costo || 0,
              existingProd.precio_venta || 0,
              existingProd.stock_minimo || 1,
              existingProd.stock_actual || 1,
              existingProd.ubicacion || "Vitrina",
              existingProd.sku || "",
              updatedData.imagen,
              existingProd.fijado || 0
            ]);
          }
        } catch (e) {
          console.error("Error al actualizar foto en plantilla existente (form):", e);
        }
      }
      res = await crearEquipo({
        imei1: updatedData.imei1,
        imei2: updatedData.imei2 || "",
        id_producto: productId,
        marca: updatedData.marca || "",
        nombre: updatedData.nombre,
        proveedor: updatedData.proveedor || "",
        costo: Number(updatedData.costo || 0),
        venta: Number(updatedData.venta || 0),
        estado: updatedData.estado || "Disponible",
        color: updatedData.color || "",
        ram: updatedData.ram || "",
        memoria: updatedData.memoria || "",
        condicion: updatedData.condicion || "Nuevo",
        notas: updatedData.notas || ""
      });
      successMessageHtml = `
        <div class="mt-2 bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-xl border border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
          📱 Celular "${updatedData.nombre}" registrado con éxito.<br/>
          • IMEI1: ${updatedData.imei1}<br/>
          • Precio: $${Number(updatedData.venta).toLocaleString('es-CO')}
        </div>
      `;
    }
    else if (actionType === 'crear_servicio_tecnico') {
      const orderId = `ST-${Date.now()}`;
      res = await crearServicioTecnico([
        orderId,
        updatedData.cliente,
        updatedData.telefono || "",
        updatedData.equipo,
        updatedData.imei_serie || "",
        updatedData.falla,
        updatedData.clave_patron || "",
        updatedData.repuestos || "",
        Number(updatedData.costo_taller || 0),
        Number(updatedData.abono || 0),
        Number(updatedData.precio_final || 0),
        updatedData.estado || "Recibido",
        ""
      ]);
      successMessageHtml = `
        <div class="mt-2 bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-xl border border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
          🛠️ Orden de servicio ${orderId} creada para ${updatedData.cliente}.<br/>
          • Equipo: ${updatedData.equipo}<br/>
          • Falla: ${updatedData.falla}
        </div>
      `;
    }
    else if (actionType === 'crear_credito') {
      res = await crearCredito({
        cliente: updatedData.cliente,
        telefono: updatedData.telefono || "",
        idFactura: "",
        total: Number(updatedData.total || 0),
        detalle: updatedData.detalle || "Crédito vía Asistente IA"
      });
      successMessageHtml = `
        <div class="mt-2 bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-xl border border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
          💳 Crédito de $${Number(updatedData.total).toLocaleString('es-CO')} registrado para ${updatedData.cliente}.<br/>
          • Detalle: ${updatedData.detalle}
        </div>
      `;
    }
    else if (actionType === 'crear_reventa') {
      res = await crearReventa({
        producto: updatedData.producto,
        categoria: updatedData.categoria || "Reventa",
        costo: Number(updatedData.costo || 0),
        precio: Number(updatedData.precio || 0),
        proveedor: updatedData.proveedor || ""
      });
      successMessageHtml = `
        <div class="mt-2 bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-xl border border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
          📈 Reventa registrada: ${updatedData.producto}.<br/>
          • Venta: $${Number(updatedData.precio).toLocaleString('es-CO')} | Costo: $${Number(updatedData.costo).toLocaleString('es-CO')}
        </div>
      `;
    }
    else if (actionType === 'crear_meta') {
      res = await crearMeta({
        titulo: updatedData.titulo,
        monto_objetivo: Number(updatedData.monto_objetivo || 0),
        tipo_calculo: updatedData.tipo_calculo || "Ventas",
        fecha_inicio: updatedData.fecha_inicio || new Date().toISOString().split('T')[0],
        fecha_limite: updatedData.fecha_limite || new Date().toISOString().split('T')[0],
        notas: updatedData.notas || "Creada por Asistente de Voz",
        estado: "Activa"
      });
      successMessageHtml = `
        <div class="mt-2 bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-xl border border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
          🎯 Meta "${updatedData.titulo}" creada exitosamente.
        </div>
      `;
    }
    else if (actionType === 'crear_prestamo') {
      res = await crearPrestamo({
        fecha: updatedData.fecha || new Date().toISOString(),
        empleado: updatedData.empleado,
        tipo: updatedData.tipo_prestamo || 'Dinero',
        monto: Number(updatedData.monto || 0),
        producto_id: updatedData.producto_id || '',
        producto_nombre: updatedData.producto_nombre || '',
        cantidad: updatedData.cantidad ? Number(updatedData.cantidad) : 0,
        estado: 'Pendiente',
        notas: updatedData.notas || 'Préstamo vía Asistente de Voz'
      });
      successMessageHtml = `
        <div class="mt-2 bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-xl border border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
          💵 Préstamo de $${Number(updatedData.monto).toLocaleString('es-CO')} registrado para ${updatedData.empleado}.
        </div>
      `;
    }

    if (res && res.success) {
      showToast("Registro completado con éxito", "success");

      const finalHtml = successMessageHtml || `
        <div class="mt-1 bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-xl border border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
          ✅ Registro completado exitosamente.
        </div>
      `;

      // Reemplazar toda la burbuja del chat (el padre del container) con el mensaje de éxito
      // para que desaparezca tanto el formulario como el título de advertencia.
      const bubble = container.closest('[data-chat-bubble]') || container.parentElement;
      if (bubble) {
        bubble.innerHTML = finalHtml;
      } else {
        container.outerHTML = finalHtml;
      }

      // Persistir el estado completado en localStorage
      const targetMsgId = container.dataset?.msgId || container.closest('[data-msg-id]')?.dataset?.msgId;
      if (targetMsgId && window.updateStoredChatMessage) {
        window.updateStoredChatMessage(targetMsgId, finalHtml);
      }
      
      if (window.viewReloaders) {
        Object.keys(window.viewReloaders).forEach(key => {
          const reloadFn = window.viewReloaders[key];
          if (typeof reloadFn === 'function') {
            try { reloadFn(); } catch (e) { console.error(e); }
          }
        });
      }
    } else {
      showToast(res.mensaje || "Error al completar registro", "error");
      if (btn) {
        btn.disabled = false;
        btn.textContent = "Completar Registro";
      }
    }
  } catch (err) {
    showToast("Error de conexión: " + err.message, "error");
    if (btn) {
      btn.disabled = false;
      btn.textContent = "Completar Registro";
    }
  }
};

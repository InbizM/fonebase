import { getInventario, getEquipos, registrarVenta, crearCredito, uploadFoto, uploadSignature, uploadEvidencia, getAjustesEmpresa } from "../api.js";
import { showToast } from "../toast.js";
import { openScanner } from "../scanner.js";
import { openCustomerSelector } from "../customer-selector.js";
import { navigate } from "../router.js";
import { printBluetoothTicket } from "../bluetooth-printer.js";

let _productos = [];
let _equipos = [];
let _carrito = [];
let _isLoaded = false;
let _isProcessing = false;
let _tipoVenta = null;
let _ajustesEmpresa = null;

let elSearch, elGrid, elCartItems, elSubtotal, elDescuento, elTotal, elBtnPay, elClienteDoc, elClienteNombre;
let elModal, elModalClose, elModalCancel, elModalConfirm, elCanvasCliente, elCanvasVendedor, ctxCliente, ctxVendedor;
let elDireccion, elCiudad, elTelefono, elDigitalFields, elSignaturesCont, elImeiContainer, elImeiList;
let elSigModal, elSigModalClose, elSigModalClear, elSigModalSave, elCanvasFull, ctxFull, activeSigCanvas;
let elFileCamera, elFileGallery, elEvidenciaStatus, elEvidenciaFilename;
let _evidenciaFile = null;

// Mobile bottom sheet refs
let elCartFab, elCartSheet, elSheetOverlay, elSheetClose;
let elCartItemsMobile, elSubtotalMobile, elDescuentoMobile, elTotalMobile;
let elClienteNombreMobile, elSelectClientMobile;
let elMetodoPagoMobile;

function isMobile() { return window.innerWidth < 1024; }

function openSheet() {
  elCartSheet?.classList.add("open");
  elSheetOverlay?.classList.add("open");
  elCartFab?.classList.add("hidden");
  document.body.style.overflow = "hidden";
}

function closeSheet() {
  elCartSheet?.classList.remove("open");
  elSheetOverlay?.classList.remove("open");
  elCartFab?.classList.remove("hidden");
  document.body.style.overflow = "";
}

export function initPOS() {
  return async () => {
    bindUIElements();
    try {
      _ajustesEmpresa = await getAjustesEmpresa();
    } catch (e) {
      console.error("Error al cargar ajustes de empresa:", e);
    }
    if (!_isLoaded) {
      await loadProductos();
      setupEvents();
      setupFlashWizardEvents();
      ctxCliente = elCanvasCliente.getContext("2d");
      ctxVendedor = elCanvasVendedor.getContext("2d");
      setupCanvas(elCanvasFull, (c) => ctxFull = c);
      _isLoaded = true;
    }
    renderProductos(_productos);
    renderCarrito();
  };
}

function bindUIElements() {
  elSearch = document.getElementById("pos-search");
  elGrid = document.getElementById("pos-products-grid");
  elCartItems = document.getElementById("pos-cart-items");
  elSubtotal = document.getElementById("pos-subtotal");
  elDescuento = document.getElementById("pos-descuento");
  elTotal = document.getElementById("pos-total");
  elBtnPay = document.getElementById("pos-pay-btn");
  elClienteDoc = document.getElementById("pos-cliente-doc");
  elClienteNombre = document.getElementById("pos-cliente-nombre");
  elModal = document.getElementById("pos-checkout-modal");
  elModalClose = document.getElementById("pos-checkout-close");
  elModalCancel = document.getElementById("pos-checkout-cancel");
  elModalConfirm = document.getElementById("pos-checkout-confirm");
  elFileCamera = document.getElementById("pos-evidencia-file-camera");
  elFileGallery = document.getElementById("pos-evidencia-file-gallery");
  elEvidenciaStatus = document.getElementById("pos-evidencia-status");
  elEvidenciaFilename = document.getElementById("pos-evidencia-filename");
  elCanvasCliente = document.getElementById("pos-canvas-cliente");
  elCanvasVendedor = document.getElementById("pos-canvas-vendedor");

  elDireccion = document.getElementById("pos-cliente-direccion");
  elCiudad = document.getElementById("pos-cliente-ciudad");
  elTelefono = document.getElementById("pos-cliente-tel");
  elDigitalFields = document.getElementById("pos-digital-fields");
  elSignaturesCont = document.getElementById("pos-signatures-container");
  elImeiContainer = document.getElementById("pos-imei-container");
  elImeiList = document.getElementById("pos-imei-list");

  elSigModal = document.getElementById("pos-signature-modal");
  elSigModalClose = document.getElementById("pos-sig-modal-close");
  elSigModalClear = document.getElementById("pos-sig-modal-clear");
  elSigModalSave = document.getElementById("pos-sig-modal-save");
  elCanvasFull = document.getElementById("pos-canvas-fullscreen");

  // Mobile sheet refs
  elCartFab      = document.getElementById("pos-cart-fab");
  elCartSheet    = document.getElementById("pos-cart-sheet");
  elSheetOverlay = document.getElementById("pos-sheet-overlay");
  elSheetClose   = document.getElementById("pos-sheet-close");
  elCartItemsMobile   = document.getElementById("pos-cart-items-mobile");
  elSubtotalMobile    = document.getElementById("pos-subtotal-mobile");
  elDescuentoMobile   = document.getElementById("pos-descuento-mobile");
  elTotalMobile       = document.getElementById("pos-total-mobile");
  elClienteNombreMobile = document.getElementById("pos-cliente-nombre-mobile");
  elSelectClientMobile  = document.getElementById("pos-select-client-btn-mobile");
  elMetodoPagoMobile    = document.getElementById("pos-metodo-pago-mobile");
}

async function loadProductos() {
  try {
    const [data, eqData] = await Promise.all([
      getInventario(),
      getEquipos().catch(() => [])
    ]);
    _productos = (data || []).filter(p => p.stockActual > 0);
    _equipos = (eqData || []).filter(e => (e.estado || "").toLowerCase() === "disponible");
  } catch (err) {
    _productos = [];
    _equipos = [];
  }
}

function renderProductos(lista) {
  if (lista.length === 0) { elGrid.innerHTML = `<p class="p-4 col-span-full text-center opacity-50 italic text-sm">Sin stock disponible</p>`; return; }
  elGrid.innerHTML = lista.map(p => `
    <div onclick="window.posAddToCart('${p.id}')" 
      class="bg-white border border-slate-200 rounded-3xl overflow-hidden flex flex-col cursor-pointer hover:border-primary hover:shadow-xl transition-all active:scale-95 shadow-sm group h-[240px]">
      <div class="h-36 w-full bg-slate-50 flex-shrink-0 flex items-center justify-center overflow-hidden border-b border-slate-100">
        ${p.imagen ? 
          `<img src="${p.imagen}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />` : 
          `<span class="material-symbols-outlined text-slate-300 text-[40px]">image</span>`}
      </div>
      <div class="p-4 flex flex-col justify-between flex-1 min-w-0 bg-white">
        <h3 class="text-xs font-black text-slate-800 leading-tight line-clamp-2 uppercase group-hover:text-primary transition-colors">${p.nombre}</h3>
        <div class="flex justify-between items-center mt-auto">
          <span class="text-[10px] font-black text-primary px-2.5 py-1 bg-primary/10 rounded-full truncate max-w-[65%]">${p.marca || 'GENERICO'}</span>
          <div class="flex flex-col items-end">
            <span class="text-[9px] font-bold text-slate-400 uppercase leading-none mb-0.5">Stock</span>
            <span class="text-xs font-black text-slate-900">${p.stockActual}</span>
          </div>
        </div>
      </div>
    </div>
  `).join("");
}

function setupEvents() {
  elSearch.addEventListener("input", (e) => {
    const q = e.target.value.toLowerCase().trim();
    renderProductos(q ? _productos.filter(p => p.nombre.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)) : _productos);
  });

  document.addEventListener("barcodeScanned", (e) => {
    const posView = document.querySelector('[data-view="pos"]');
    if (!posView || posView.classList.contains('hidden')) return;
    const code = e.detail;
    const prod = _productos.find(p => p.sku === code || p.id === code);
    if (prod) { window.posAddToCart(prod.id); showToast(`✅ ${prod.nombre} agregado`, "success"); if (document.activeElement === elSearch) { elSearch.value = ""; renderProductos(_productos); elSearch.blur(); } }
    else { showToast(`Código ${code} no encontrado`, "warning"); }
  });

  document.getElementById("pos-scan-btn")?.addEventListener("click", () => {
    openScanner({ title: "Escanear", onScan: (code) => {
      elSearch.value = code; elSearch.dispatchEvent(new Event("input"));
      const prod = _productos.find(p => p.sku === code || p.id === code);
      if (prod) { window.posAddToCart(prod.id); showToast(`✅ ${prod.nombre} agregado`, "success"); setTimeout(() => { if (elSearch.value === code) { elSearch.value = ""; elSearch.dispatchEvent(new Event("input")); } }, 1500); }
      else { showToast(`Código ${code} no encontrado en inventario`, "warning"); }
    }});
  });

  const handleReventa = () => {
    window.__posReventaMode = true;
    if (isMobile()) {
      closeSheet();
    }
    navigate("inventory");
    setTimeout(() => { if (window.inventoryView && window.inventoryView.openNuevo) { window.inventoryView.openNuevo(true); } }, 150);
  };
  document.getElementById("pos-reventa-btn")?.addEventListener("click", handleReventa);
  document.getElementById("pos-reventa-btn-mobile")?.addEventListener("click", handleReventa);

  document.getElementById("pos-select-client-btn")?.addEventListener("click", () => {
    openCustomerSelector((client) => {
      elClienteNombre.value = client.nombre;
      elClienteDoc.value = client.documento;
    });
  });

  document.querySelectorAll('input[name="pos-billing-type"]').forEach(radio => {
    radio.addEventListener("change", (e) => {
      const isDigital = e.target.value === "digital";
      const evCont = document.getElementById("pos-evidencia-container");
      if (isDigital) {
        evCont.classList.add("hidden");
        elDigitalFields.classList.remove("hidden");
        elSignaturesCont.classList.remove("hidden");
        updateImeiList();
        setTimeout(resizePosCanvases, 50);
      } else {
        evCont.classList.remove("hidden");
        elDigitalFields.classList.add("hidden");
        elSignaturesCont.classList.add("hidden");
        elImeiContainer.classList.add("hidden");
      }
    });
  });

  elSigModalClose.addEventListener("click", () => elSigModal.classList.add("hidden"));
  document.getElementById("pos-sig-modal-cancel")?.addEventListener("click", () => elSigModal.classList.add("hidden"));
  elSigModalClear.addEventListener("click", () => ctxFull.clearRect(0, 0, elCanvasFull.width, elCanvasFull.height));
  elSigModalSave.addEventListener("click", () => {
    if (activeSigCanvas) {
      const targetCtx = activeSigCanvas.getContext("2d");
      targetCtx.clearRect(0, 0, activeSigCanvas.width, activeSigCanvas.height);
      targetCtx.drawImage(elCanvasFull, 0, 0, activeSigCanvas.width, activeSigCanvas.height);
      
      const isClient = activeSigCanvas.id === "pos-canvas-cliente";
      const helper = document.getElementById(isClient ? "pos-sig-helper-cliente" : "pos-sig-helper-vendedor");
      if (helper) helper.classList.add("hidden");
      const cleanBtn = activeSigCanvas.parentElement.querySelector("button");
      if (cleanBtn) cleanBtn.classList.remove("hidden");

      // Check if the other signature is still pending (meaning its helper is still visible)
      const otherHelperId = isClient ? "pos-sig-helper-vendedor" : "pos-sig-helper-cliente";
      const otherHelper = document.getElementById(otherHelperId);
      const otherPending = otherHelper && !otherHelper.classList.contains("hidden");

      if (otherPending) {
        if (isClient) {
          openSigFull(elCanvasVendedor, "Firma del Vendedor");
        } else {
          openSigFull(elCanvasCliente, "Firma del Comprador");
        }
        return;
      }
    }
    elSigModal.classList.add("hidden");
  });

  const openSigFull = (target, title) => {
    activeSigCanvas = target;
    document.getElementById("pos-sig-modal-title").textContent = title;
    elSigModal.classList.remove("hidden");
    elCanvasFull.width = elCanvasFull.offsetWidth;
    elCanvasFull.height = elCanvasFull.offsetHeight;
    ctxFull.lineWidth = 8; ctxFull.lineCap = "round"; ctxFull.strokeStyle = "#000";
    ctxFull.clearRect(0, 0, elCanvasFull.width, elCanvasFull.height);

    // Check if the other signature is still pending
    const isClient = activeSigCanvas.id === "pos-canvas-cliente";
    const otherHelperId = isClient ? "pos-sig-helper-vendedor" : "pos-sig-helper-cliente";
    const otherHelper = document.getElementById(otherHelperId);
    const otherPending = otherHelper && !otherHelper.classList.contains("hidden");

    if (otherPending) {
      elSigModalSave.innerHTML = `<span class="material-symbols-outlined text-[18px]">arrow_forward</span> Siguiente`;
    } else {
      elSigModalSave.innerHTML = `<span class="material-symbols-outlined text-[18px]">check_circle</span> Guardar Firma`;
    }
  };

  elCanvasCliente.parentElement.addEventListener("click", () => openSigFull(elCanvasCliente, "Firma del Comprador"));
  elCanvasVendedor.parentElement.addEventListener("click", () => openSigFull(elCanvasVendedor, "Firma del Vendedor"));

  // Click-to-clear for small preview cards
  [elCanvasCliente, elCanvasVendedor].forEach(canvas => {
    const cleanBtn = canvas.parentElement.querySelector("button");
    if (cleanBtn) {
      cleanBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const isClient = canvas.id === "pos-canvas-cliente";
        const helper = document.getElementById(isClient ? "pos-sig-helper-cliente" : "pos-sig-helper-vendedor");
        if (helper) helper.classList.remove("hidden");
        cleanBtn.classList.add("hidden");
      });
    }
  });

  // IMEI select and scanner event delegation
  elImeiList?.addEventListener("change", (e) => {
    const select = e.target.closest(".pos-imei-select");
    if (!select) return;
    const card = select.closest("[data-imei-card]");
    if (!card) return;
    const manualCont = card.querySelector(".pos-imei-manual-container");
    const manualInput = card.querySelector(".pos-imei-input");

    if (select.value === "__manual__") {
      if (manualCont) manualCont.classList.remove("hidden");
      if (manualInput) {
        manualInput.value = "";
        manualInput.focus();
      }
    } else {
      if (manualCont) manualCont.classList.add("hidden");
      if (manualInput) manualInput.value = select.value;
    }
  });

  elImeiList?.addEventListener("click", (e) => {
    const btn = e.target.closest(".pos-imei-scan-btn");
    if (!btn) return;
    e.preventDefault();
    openScanner({
      title: "Escanear IMEI de Equipo",
      filter: /^\d{14,16}$/,
      filterLabel: "IMEI",
      onScan: (code) => {
        const card = btn.closest("[data-imei-card]");
        if (!card) return;
        const input = card.querySelector(".pos-imei-input");
        const select = card.querySelector(".pos-imei-select");
        if (input) {
          input.value = code;
          input.dispatchEvent(new Event("input", { bubbles: true }));
        }
        if (select) {
          const opt = Array.from(select.options).find(o => o.value === code);
          if (opt) {
            select.value = code;
            const manualCont = card.querySelector(".pos-imei-manual-container");
            if (manualCont) manualCont.classList.add("hidden");
          } else {
            select.value = "__manual__";
            const manualCont = card.querySelector(".pos-imei-manual-container");
            if (manualCont) manualCont.classList.remove("hidden");
          }
        }
        showToast(`IMEI asignado: ${code}`, "success");
      }
    });
  });

  window.posAddToCart = (id) => {
    const p = _productos.find(x => x.id === id);
    if (!p) return;
    const exist = _carrito.find(i => i.id === id);
    if (exist) { if (exist.qty >= p.stockActual) return showToast("Sin stock", "warning"); exist.qty++; }
    else { _carrito.push({ ...p, qty: 1, precioManual: 0 }); }
    renderCarrito();
    setTimeout(() => { const inputs = elCartItems.querySelectorAll('input[oninput*="posUpdatePrice"]'); if (inputs.length > 0) inputs[inputs.length - 1].focus(); }, 100);
  };

  window.posRemoveItem = (id) => { _carrito = _carrito.filter(i => i.id !== id); renderCarrito(); };
  window.posUpdateQty = (id, delta) => {
    const i = _carrito.find(x => x.id === id);
    const p = _productos.find(x => x.id === id);
    if (i) { i.qty += delta; if (i.qty <= 0) window.posRemoveItem(id); else if (i.qty > p.stockActual) i.qty = p.stockActual; renderCarrito(); }
  };
  window.posUpdatePrice = (id, el) => {
    const i = _carrito.find(x => x.id === id);
    const num = Number(el.value.replace(/\D/g, ""));
    if (i) { i.precioManual = num; el.value = new Intl.NumberFormat('es-CO').format(num); updateTotalsOnly(); }
  };

  elDescuento?.addEventListener("input", renderCarrito);

  // Desktop pay buttons (hidden on mobile, but wired for desktop)
  const openCheckoutDesktop = (t) => {
    if (_carrito.length === 0) return;
    if (!elClienteNombre.value) return showToast("Nombre cliente ok?", "warning");
    _tipoVenta = t;
    openCheckoutModal();
  };
  document.getElementById("pos-pay-btn-venta")?.addEventListener("click", () => openCheckoutDesktop("venta"));
  document.getElementById("pos-pay-btn-credito")?.addEventListener("click", () => openCheckoutDesktop("credito"));
  document.getElementById("pos-pay-btn-separe")?.addEventListener("click", () => openCheckoutDesktop("separe"));

  elModalClose.addEventListener("click", closeCheckoutModal);
  elModalCancel.addEventListener("click", closeCheckoutModal);
  elModalConfirm.addEventListener("click", procesarVenta);

  // Mobile sheet controls
  elCartFab?.addEventListener("click", openSheet);
  elSheetClose?.addEventListener("click", closeSheet);
  elSheetOverlay?.addEventListener("click", closeSheet);

  // Mobile client selector → sync to hidden desktop input
  elSelectClientMobile?.addEventListener("click", () => {
    openCustomerSelector((client) => {
      elClienteNombre.value = client.nombre;
      elClienteDoc.value = client.documento;
      if (elClienteNombreMobile) elClienteNombreMobile.value = client.nombre;
    });
  });

  // Mobile descuento → sync to hidden desktop input
  elDescuentoMobile?.addEventListener("input", (e) => {
    elDescuento.value = e.target.value;
    renderCarrito();
  });

  // Mobile payment buttons → proxy to main checkout logic
  const openCheckout = (t) => {
    if (_carrito.length === 0) return;
    const nombre = isMobile() ? elClienteNombreMobile?.value : elClienteNombre.value;
    if (!nombre) return showToast("Nombre cliente ok?", "warning");
    _tipoVenta = t;
    if (isMobile()) {
      // Sync mobile client/metodo to hidden desktop inputs before checkout
      elClienteNombre.value = elClienteNombreMobile?.value || "";
      if (elMetodoPagoMobile) document.getElementById("pos-metodo-pago").value = elMetodoPagoMobile.value;
      closeSheet();
    }
    openCheckoutModal();
  };
  document.getElementById("pos-pay-btn-venta-mobile")?.addEventListener("click", () => openCheckout("venta"));
  document.getElementById("pos-pay-btn-credito-mobile")?.addEventListener("click", () => openCheckout("credito"));
  document.getElementById("pos-pay-btn-separe-mobile")?.addEventListener("click", () => openCheckout("separe"));

  // Evidence upload event listeners
  document.getElementById("pos-evidencia-btn-camera")?.addEventListener("click", () => elFileCamera?.click());
  document.getElementById("pos-evidencia-btn-gallery")?.addEventListener("click", () => elFileGallery?.click());

  const handleEvidenceFileChange = (inputEl, otherInputEl) => {
    if (inputEl.files && inputEl.files[0]) {
      _evidenciaFile = inputEl.files[0];
      otherInputEl.value = ""; // Clear other selection
      if (elEvidenciaFilename && elEvidenciaStatus) {
        elEvidenciaFilename.textContent = _evidenciaFile.name;
        elEvidenciaStatus.classList.remove("hidden");
      }
    }
  };

  elFileCamera?.addEventListener("change", () => handleEvidenceFileChange(elFileCamera, elFileGallery));
  elFileGallery?.addEventListener("change", () => handleEvidenceFileChange(elFileGallery, elFileCamera));
  initCustomSelects();
}

function renderCarrito() {
  const emptyHtml = `<div class="flex flex-col items-center justify-center h-full text-on-surface-variant/50"><span class="material-symbols-outlined text-5xl mb-2" style="font-variation-settings:'FILL' 1">shopping_cart</span><p class="text-sm font-medium">El carrito está vacío</p></div>`;
  const emptyMobileHtml = `<div class="flex flex-col items-center justify-center h-full py-8 text-on-surface-variant/50"><span class="material-symbols-outlined text-5xl mb-2" style="font-variation-settings:'FILL' 1">shopping_cart</span><p class="text-sm font-medium">El carrito está vacío</p><p class="text-xs mt-1 opacity-70">Agrega productos desde la pantalla</p></div>`;

  if (_carrito.length === 0) {
    if (elCartItems) elCartItems.innerHTML = emptyHtml;
    if (elCartItemsMobile) elCartItemsMobile.innerHTML = emptyMobileHtml;
    updateTotals(0);
    updateFab(0, 0);
    return;
  }

  let sub = 0;
  const itemsHtml = _carrito.map(i => {
    const p = i.precioManual || 0;
    sub += p * i.qty;
    return `
    <div class="bg-white border-2 ${p === 0 ? 'border-orange-400 animate-pulse' : 'border-slate-100'} p-3 rounded-2xl flex gap-3 shadow-sm transition-all items-center">
      <button onclick="window.posRemoveItem('${i.id}')" class="text-slate-300 hover:text-red-500 transition-colors shrink-0 flex items-center justify-center">
        <span class="material-symbols-outlined text-[20px]">delete</span>
      </button>
      <div class="flex-1 min-w-0">
        <p class="text-[11px] font-black text-slate-800 truncate mb-1 uppercase">${i.nombre}</p>
        <div class="flex items-center bg-slate-50 rounded-lg px-2 border border-slate-200 focus-within:border-primary transition-colors">
          <span class="text-xs font-bold text-slate-400">$</span>
          <input type="text" value="${p === 0 ? '' : new Intl.NumberFormat('es-CO').format(p)}" placeholder="0" oninput="window.posUpdatePrice('${i.id}', this)" class="w-full py-1.5 px-1 text-sm font-black text-primary bg-transparent outline-none placeholder:text-slate-300" />
        </div>
      </div>
      <div class="flex flex-col justify-between items-end self-stretch">
        <div></div>
        <div class="flex items-center gap-2 bg-slate-100 rounded-xl p-1 border border-slate-200 mt-auto">
          <button onclick="window.posUpdateQty('${i.id}', -1)" class="w-7 h-7 bg-white shadow-sm rounded-lg flex items-center justify-center hover:bg-slate-50 active:scale-90 transition-all text-slate-600 font-bold">-</button>
          <span class="text-xs font-black w-5 text-center text-slate-700">${i.qty}</span>
          <button onclick="window.posUpdateQty('${i.id}', 1)" class="w-7 h-7 bg-white shadow-sm rounded-lg flex items-center justify-center hover:bg-slate-50 active:scale-90 transition-all text-slate-600 font-bold">+</button>
        </div>
      </div>
    </div>`;
  }).join("");

  if (elCartItems) elCartItems.innerHTML = itemsHtml;
  if (elCartItemsMobile) elCartItemsMobile.innerHTML = itemsHtml;

  // Update sheet subtitle
  const sheetSubtitle = document.getElementById("pos-sheet-subtitle");
  const totalItems = _carrito.reduce((s, i) => s + i.qty, 0);
  if (sheetSubtitle) sheetSubtitle.textContent = `${totalItems} producto${totalItems !== 1 ? 's' : ''}`;

  updateTotals(sub);
  updateFab(totalItems, sub);
}

function updateTotalsOnly() {
  let s = 0;
  _carrito.forEach(i => s += (i.precioManual || i.precioVenta || 0) * i.qty);
  updateTotals(s);
  updateFab(_carrito.reduce((t, i) => t + i.qty, 0), s);
}

function updateTotals(s) {
  const d = parseFloat(elDescuento?.value) || 0;
  const total = Math.max(0, s - d);
  const fmt = v => `$${new Intl.NumberFormat('es-CO').format(v)}`;
  if (elSubtotal) elSubtotal.textContent = fmt(s);
  if (elTotal) elTotal.textContent = fmt(total);
  if (elSubtotalMobile) elSubtotalMobile.textContent = fmt(s);
  if (elTotalMobile) elTotalMobile.textContent = fmt(total);
}

function updateFab(itemCount, sub) {
  const badge = document.getElementById("pos-fab-badge");
  const fabTotal = document.getElementById("pos-fab-total");
  const fabLabel = document.getElementById("pos-fab-label");
  if (!badge) return;
  if (itemCount > 0) {
    badge.classList.remove("hidden");
    badge.textContent = itemCount;
    badge.classList.remove("cart-badge-bounce");
    void badge.offsetWidth; // reflow
    badge.classList.add("cart-badge-bounce");
  } else {
    badge.classList.add("hidden");
  }
  const d = parseFloat(elDescuento?.value) || 0;
  if (fabTotal) fabTotal.textContent = `$${new Intl.NumberFormat('es-CO').format(Math.max(0, sub - d))}`;
  if (fabLabel) fabLabel.textContent = itemCount > 0 ? `${itemCount} producto${itemCount !== 1 ? 's' : ''}` : 'Ver carrito';
}

function isPhoneProduct(prod) {
  if (!prod) return false;
  const cat = (prod.categoria || "").toLowerCase();
  const name = (prod.nombre || "").toLowerCase();
  const tipo = (prod.tipo || "").toLowerCase();
  if (cat.includes("celular") || cat.includes("telefono") || cat.includes("teléfono") || tipo.includes("celular")) return true;
  if (name.includes("celular") || name.includes("telefono") || name.includes("teléfono") || name.includes("smartphone")) return true;
  if (_equipos.some(e => e.id_producto === prod.id || (e.nombre && prod.nombre && e.nombre.toLowerCase().trim() === prod.nombre.toLowerCase().trim()))) return true;
  return false;
}

function updateImeiList() {
  const phoneItems = _carrito.filter(i => {
    const prod = _productos.find(p => p.id === i.id) || i;
    return isPhoneProduct(prod);
  });

  if (!elImeiContainer || !elImeiList) return;

  if (phoneItems.length === 0) {
    elImeiContainer.classList.add("hidden");
    elImeiList.innerHTML = "";
    return;
  }

  elImeiContainer.classList.remove("hidden");

  let html = "";
  phoneItems.forEach(item => {
    const prod = _productos.find(p => p.id === item.id) || item;
    const qty = Number(item.qty) || 1;

    // Buscar IMEIs disponibles en _equipos para este producto
    const matchingEqs = _equipos.filter(e => {
      const isMatch = (e.id_producto && e.id_producto === prod.id) ||
                      (e.nombre && prod.nombre && e.nombre.toLowerCase().trim() === prod.nombre.toLowerCase().trim()) ||
                      (prod.nombre && e.nombre && prod.nombre.toLowerCase().includes(e.nombre.toLowerCase().trim()));
      return isMatch && (e.estado || "").toLowerCase() === "disponible";
    });

    for (let u = 1; u <= qty; u++) {
      const unitKey = `${prod.id}_u${u}`;
      const unitTitle = qty > 1 ? `${prod.nombre} (Unidad #${u})` : prod.nombre;

      if (matchingEqs.length > 0) {
        html += `
          <div class="bg-white dark:bg-slate-900 p-3 rounded-xl border border-amber-200 dark:border-amber-900/60 shadow-xs space-y-1.5" data-imei-card="${unitKey}">
            <div class="flex items-center justify-between">
              <p class="text-[10px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-tight truncate">${unitTitle}</p>
              <span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center gap-0.5">
                <span class="material-symbols-outlined text-[11px]">inventory_2</span> ${matchingEqs.length} en stock
              </span>
            </div>
            <div>
              <select data-id="${prod.id}" data-unit="${u}" class="pos-imei-select w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-2 text-xs text-slate-800 dark:text-slate-100 font-mono outline-none focus:border-primary">
                <option value="">-- Seleccionar IMEI en Stock --</option>
                ${matchingEqs.map((eq, idx) => {
                  const specs = [];
                  if (eq.color) specs.push(eq.color);
                  if (eq.ram) specs.push(eq.ram);
                  if (eq.memoria) specs.push(eq.memoria);
                  if (eq.condicion && eq.condicion !== 'Nuevo') specs.push(eq.condicion);
                  const specsStr = specs.length > 0 ? ` • ${specs.join(' / ')}` : '';
                  return `<option value="${eq.imei1}">IMEI: ${eq.imei1}${specsStr}</option>`;
                }).join("")}
                <option value="__manual__">✏️ Ingresar o escanear otro IMEI...</option>
              </select>
              <div class="pos-imei-manual-container hidden mt-1.5 flex gap-1.5">
                <input type="text" placeholder="Escribir IMEI (15 dígitos)" data-id="${prod.id}" data-unit="${u}" class="pos-imei-input w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-800 dark:text-slate-100 outline-none focus:border-primary">
                <button type="button" class="pos-imei-scan-btn px-2.5 py-1.5 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 rounded-lg border border-amber-300 dark:border-amber-700 hover:bg-amber-200 transition-all flex items-center justify-center shrink-0 active:scale-95" title="Escanear IMEI">
                  <span class="material-symbols-outlined text-[16px]">qr_code_scanner</span>
                </button>
              </div>
            </div>
          </div>
        `;
      } else {
        html += `
          <div class="bg-white dark:bg-slate-900 p-3 rounded-xl border border-amber-200 dark:border-amber-900/60 shadow-xs space-y-1.5" data-imei-card="${unitKey}">
            <div class="flex items-center justify-between">
              <p class="text-[10px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-tight truncate">${unitTitle}</p>
              <span class="text-[9px] text-amber-700 dark:text-amber-400 font-medium">Ingreso manual</span>
            </div>
            <div class="flex gap-1.5">
              <input type="text" placeholder="Ingresar IMEI (15 dígitos)" data-id="${prod.id}" data-unit="${u}" class="pos-imei-input w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-800 dark:text-slate-100 outline-none focus:border-primary">
              <button type="button" class="pos-imei-scan-btn px-2.5 py-1.5 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 rounded-lg border border-amber-300 dark:border-amber-700 hover:bg-amber-200 transition-all flex items-center justify-center shrink-0 active:scale-95" title="Escanear IMEI">
                <span class="material-symbols-outlined text-[16px]">qr_code_scanner</span>
              </button>
            </div>
          </div>
        `;
      }
    }
  });

  elImeiList.innerHTML = html;
}

function resizePosCanvases() {
  [elCanvasCliente, elCanvasVendedor].forEach(c => {
    if (c && c.offsetWidth > 0) {
      c.width = c.offsetWidth; c.height = c.offsetHeight;
      const ctx = c.getContext("2d"); ctx.lineWidth = 4; ctx.lineCap = 'round';
    }
  });
}

function setupCanvas(canvas, setCtx) {
  const c = canvas.getContext("2d");
  setCtx(c);
  const getPos = (e) => {
    const r = canvas.getBoundingClientRect();
    const touch = e.touches && e.touches.length > 0 ? e.touches[0] : e;
    const clientX = touch.clientX;
    const clientY = touch.clientY;
    
    if (canvas.id === "pos-canvas-fullscreen" && window.innerHeight > window.innerWidth && window.innerWidth < 1024) {
      // Rotación de 90 grados para encajar en visualización horizontal 16:9
      const x = clientY - r.top;
      const y = r.right - clientX;
      return {
        x: x * (canvas.width / r.height),
        y: y * (canvas.height / r.width)
      };
    } else {
      const x = clientX - r.left;
      const y = clientY - r.top;
      return {
        x: x * (canvas.width / r.width),
        y: y * (canvas.height / r.height)
      };
    }
  };
  let drawing = false;
  const start = (e) => { drawing = true; c.beginPath(); const {x,y} = getPos(e); c.moveTo(x,y); e.preventDefault(); };
  const move = (e) => { if(!drawing) return; const {x,y} = getPos(e); c.lineTo(x,y); c.stroke(); e.preventDefault(); };
  canvas.addEventListener("mousedown", start); canvas.addEventListener("mousemove", move);
  canvas.addEventListener("mouseup", () => drawing = false);
  canvas.addEventListener("touchstart", start, {passive:false}); canvas.addEventListener("touchmove", move, {passive:false});
  canvas.addEventListener("touchend", () => drawing = false);
}

function openCheckoutModal() { 
  elModal.classList.remove("hidden"); elModal.classList.add("flex"); 
  [elCanvasCliente, elCanvasVendedor].forEach(c => { 
    c.width = c.offsetWidth; c.height = c.offsetHeight; 
    const ctx = c.getContext("2d"); ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.clearRect(0,0,c.width,c.height); 
    
    // Reset visual helpers and hide clear buttons on start
    const isClient = c.id === "pos-canvas-cliente";
    const helper = document.getElementById(isClient ? "pos-sig-helper-cliente" : "pos-sig-helper-vendedor");
    if (helper) helper.classList.remove("hidden");
    const cleanBtn = c.parentElement.querySelector("button");
    if (cleanBtn) cleanBtn.classList.add("hidden");
  });
  elDireccion.value = ""; elCiudad.value = ""; elTelefono.value = "";
  document.querySelector('input[name="pos-billing-type"][value="fisica"]').checked = true;
  document.getElementById("pos-evidencia-container").classList.remove("hidden");
  elDigitalFields.classList.add("hidden"); elSignaturesCont.classList.add("hidden");

  _evidenciaFile = null;
  if (elFileCamera) elFileCamera.value = "";
  if (elFileGallery) elFileGallery.value = "";
  if (elEvidenciaStatus) elEvidenciaStatus.classList.add("hidden");

  // Mostrar selector de IMEIs si hay celulares en el carrito
  updateImeiList();
}

function closeCheckoutModal() { elModal.classList.add("hidden"); elModal.classList.remove("flex"); }

async function procesarVenta() {
  if (_isProcessing) return;
  _isProcessing = true;
  const billingType = document.querySelector('input[name="pos-billing-type"]:checked').value;
  elModalConfirm.textContent = "Procesando...";
  elModalConfirm.disabled = true;

  try {
    let firmaUrl = ""; let firmaVendedorUrl = ""; let evidenciaUrl = "";

    if (billingType === "digital") {
      const blank = document.createElement("canvas"); blank.width = elCanvasCliente.width; blank.height = elCanvasCliente.height;
      if (elCanvasCliente.toDataURL() !== blank.toDataURL()) { const resSig = await uploadSignature(elCanvasCliente.toDataURL("image/png"), `FirmaCliente_${Date.now()}.png`); firmaUrl = typeof resSig === 'string' ? resSig : (resSig?.url || ""); }
      if (elCanvasVendedor.toDataURL() !== blank.toDataURL()) { const resSigV = await uploadSignature(elCanvasVendedor.toDataURL("image/png"), `FirmaVendedor_${Date.now()}.png`); firmaVendedorUrl = typeof resSigV === 'string' ? resSigV : (resSigV?.url || ""); }
    }

    if (billingType === "fisica") {
      if (_evidenciaFile) {
        elModalConfirm.textContent = "Subiendo evidencia...";
        const file = _evidenciaFile;
        const base64 = await new Promise(r => { const rd = new FileReader(); rd.onload = e => r(e.target.result); rd.readAsDataURL(file); });
        const resImg = await uploadEvidencia(base64, file.name, file.type);
        evidenciaUrl = typeof resImg === 'string' ? resImg : (resImg?.url || "");
      } else { showToast("Por favor sube la foto de la factura física", "warning"); _isProcessing = false; elModalConfirm.textContent = "Confirmar y Facturar"; elModalConfirm.disabled = false; return; }
    }

    const imeis = {};
    const imeiCards = elImeiList.querySelectorAll('[data-imei-card]');
    imeiCards.forEach(card => {
      const select = card.querySelector('.pos-imei-select');
      const input = card.querySelector('.pos-imei-input');
      let val = "";
      let prodId = "";
      if (select && select.value && select.value !== "__manual__") {
        val = select.value.trim();
        prodId = select.dataset.id;
      } else if (input && input.value.trim()) {
        val = input.value.trim();
        prodId = input.dataset.id;
      }
      if (val && prodId) {
        if (!imeis[prodId]) imeis[prodId] = [];
        if (!imeis[prodId].includes(val)) imeis[prodId].push(val);
      }
    });

    elModalConfirm.textContent = "Registrando venta...";
    const sub = Number(elSubtotal.textContent.replace(/\D/g, ""));
    const tot = Number(elTotal.textContent.replace(/\D/g, ""));
    const user = JSON.parse(localStorage.getItem("adminpro_user") || "{}");

    const ventaData = {
      cedula: elClienteDoc.value.trim(),
      cliente: elClienteNombre.value.trim(),
      direccion: elDireccion.value.trim(),
      ciudad: elCiudad.value.trim(),
      telefono: elTelefono.value.trim(),
      productoNombre: _carrito.map(i => `${i.nombre} (x${i.qty})`).join(", "),
      productoId: _carrito[0]?.id,
      items: _carrito.map(i => ({ id: i.id, qty: i.qty })),
      subtotal: sub,
      descuento: Number(elDescuento.value) || 0,
      total: tot,
      metodo: document.getElementById("pos-metodo-pago").value,
      vendedor: user.nombre || "Vendedor",
      firmaComprador: firmaUrl,
      firmaVendedor: firmaVendedorUrl,
      evidencia: evidenciaUrl,
      tipoFactura: billingType,
      tipoVenta: _tipoVenta,
      imeis: JSON.stringify(imeis),
      emisor: {
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
      }
    };

    const res = await registrarVenta(ventaData);
    if (res.success) {
      if (_tipoVenta !== "venta") { await crearCredito({ cliente: ventaData.cliente, telefono: ventaData.cedula, idFactura: res.idFactura, total: tot, detalle: ventaData.productoNombre, tipo: _tipoVenta === "separe" ? "Plan Separe" : "Crédito" }); }
      
      showToast("Venta Exitosa", "success");

      // Imprimir ticket de 48mm para todas las ventas
      const sigC = billingType === "digital" ? elCanvasCliente.toDataURL() : "";
      const sigV = billingType === "digital" ? elCanvasVendedor.toDataURL() : "";
      imprimirTicket({ ...ventaData, idFactura: res.idFactura }, sigC, sigV);

      _carrito = []; renderCarrito(); elClienteDoc.value=""; elClienteNombre.value=""; 
      const desktopSelect = document.getElementById("pos-metodo-pago");
      if (desktopSelect) {
        desktopSelect.value = "Efectivo";
        syncCustomSelectUI("pos-metodo-pago-container", "Efectivo");
      }
      const mobileSelect = document.getElementById("pos-metodo-pago-mobile");
      if (mobileSelect) {
        mobileSelect.value = "Efectivo";
        syncCustomSelectUI("pos-metodo-pago-container-mobile", "Efectivo");
      }
      closeCheckoutModal();
      await loadProductos();
      renderProductos(_productos);
      if (window.viewReloaders) {
        Object.keys(window.viewReloaders).forEach(k => {
          try { window.viewReloaders[k](); } catch (_) {}
        });
      }
    } else { showToast("Error al guardar", "error"); }
  } catch (err) { showToast(err.message, "error"); }
  finally { _isProcessing = false; elModalConfirm.textContent = "Confirmar y Facturar"; elModalConfirm.disabled = false; }
}

let _flashCurrentStep = 1;
let _flashSelectedProduct = null;
let _flashNegotiatedPrice = 0;

function setupFlashWizardEvents() {
  const openModalHandler = () => {
    if (getAccesoriosList().length === 0) {
      showToast("No hay accesorios disponibles en el inventario para realizar una Venta Flash", "warning");
      return;
    }
    if (isMobile()) {
      closeSheet();
    }
    openFlashWizardModal();
  };

  document.getElementById("pos-btn-venta-flash")?.addEventListener("click", openModalHandler);
  document.getElementById("pos-btn-venta-flash-mobile")?.addEventListener("click", openModalHandler);
  document.getElementById("pos-header-venta-flash")?.addEventListener("click", openModalHandler);
  document.getElementById("pos-pay-btn-flash")?.addEventListener("click", openModalHandler);
  document.getElementById("pos-pay-btn-flash-mobile")?.addEventListener("click", openModalHandler);
  document.getElementById("pos-flash-fab")?.addEventListener("click", openModalHandler);

  document.getElementById("pos-flash-close-btn")?.addEventListener("click", closeFlashWizardModal);
  document.getElementById("pos-flash-modal-overlay")?.addEventListener("click", closeFlashWizardModal);

  const searchInput = document.getElementById("pos-flash-search");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      renderFlashAccessoriesList(e.target.value);
    });
  }

  const priceInput = document.getElementById("pos-flash-price-input");
  if (priceInput) {
    priceInput.addEventListener("input", (e) => {
      const val = parseFloat(e.target.value);
      _flashNegotiatedPrice = isNaN(val) ? 0 : val;
    });
  }

  document.getElementById("pos-flash-back-btn")?.addEventListener("click", () => {
    if (_flashCurrentStep > 1) {
      _flashCurrentStep--;
      renderFlashStep();
    }
  });

  document.getElementById("pos-flash-next-btn")?.addEventListener("click", () => {
    if (_flashCurrentStep === 1) {
      if (!_flashSelectedProduct) {
        return showToast("Selecciona un accesorio para continuar", "warning");
      }
      _flashCurrentStep = 2;
      renderFlashStep();
    } else if (_flashCurrentStep === 2) {
      const pInput = document.getElementById("pos-flash-price-input");
      const val = parseFloat(pInput?.value);
      if (isNaN(val) || val < 0) {
        return showToast("Ingresa un precio de venta válido", "warning");
      }
      _flashNegotiatedPrice = val;
      _flashCurrentStep = 3;
      renderFlashStep();
    }
  });

  document.getElementById("pos-flash-confirm-btn")?.addEventListener("click", confirmarVentaFlashWizard);
}

function openFlashWizardModal() {
  _flashCurrentStep = 1;
  _flashSelectedProduct = null;
  _flashNegotiatedPrice = 0;

  const searchInput = document.getElementById("pos-flash-search");
  if (searchInput) searchInput.value = "";

  renderFlashStep();
  renderFlashAccessoriesList();

  const modal = document.getElementById("pos-flash-wizard-modal");
  if (modal) {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  }
}

function closeFlashWizardModal() {
  const modal = document.getElementById("pos-flash-wizard-modal");
  if (modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
  _flashCurrentStep = 1;
  _flashSelectedProduct = null;
  _flashNegotiatedPrice = 0;
}

function getAccesoriosList() {
  return _productos.filter(p => {
    if (!p) return false;
    const cat = (p.categoria || "").toLowerCase();
    const nombre = (p.nombre || "").toLowerCase();
    if (p.stockActual <= 0) return false;
    if (p.tipo === "equipo" || cat.includes("celular") || nombre.includes("celular") || nombre.includes("teléfono")) {
      return false;
    }
    return true;
  });
}

function renderFlashAccessoriesList(filterQuery = "") {
  const container = document.getElementById("pos-flash-products-list");
  if (!container) return;

  const q = filterQuery.toLowerCase().trim();
  let items = getAccesoriosList();

  if (q) {
    items = items.filter(p => (p.nombre && p.nombre.toLowerCase().includes(q)) || (p.sku && p.sku.toLowerCase().includes(q)) || (p.marca && p.marca.toLowerCase().includes(q)));
  }

  if (items.length === 0) {
    container.innerHTML = `
      <div class="p-6 text-center text-slate-400 italic text-xs bg-slate-50 rounded-2xl border border-slate-100">
        <span class="material-symbols-outlined text-3xl mb-1 text-slate-300 block">search_off</span>
        No se encontraron accesorios disponibles en inventario
      </div>
    `;
    return;
  }

  container.innerHTML = items.map(p => `
    <div onclick="window.posSelectFlashProduct('${p.id}')"
      class="p-3 bg-slate-50 hover:bg-amber-50/80 border border-slate-200 hover:border-amber-400 rounded-2xl cursor-pointer flex items-center justify-between gap-3 transition-all active:scale-[0.99] group">
      <div class="flex items-center gap-3 min-w-0 flex-1">
        <div class="w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
          ${p.imagen ? `<img src="${p.imagen}" class="w-full h-full object-cover group-hover:scale-110 transition-transform" />` : `<span class="material-symbols-outlined text-slate-400 text-xl">widgets</span>`}
        </div>
        <div class="min-w-0 flex-1">
          <h4 class="font-black text-xs text-slate-900 truncate uppercase group-hover:text-amber-900 transition-colors">${p.nombre}</h4>
          <div class="flex items-center gap-2 mt-0.5">
            <span class="text-[9px] font-bold px-1.5 py-0.5 bg-slate-200 text-slate-700 rounded">${p.marca || 'GENÉRICO'}</span>
            <span class="text-[10px] text-slate-500 font-medium">Stock: ${p.stockActual}</span>
          </div>
        </div>
      </div>
      <div class="text-right flex-shrink-0">
        <div class="font-black text-sm text-slate-900">$${new Intl.NumberFormat('es-CO').format(p.precioVenta || 0)}</div>
        <span class="text-[10px] font-bold text-amber-600 group-hover:underline">Elegir →</span>
      </div>
    </div>
  `).join("");
}

window.posSelectFlashProduct = function(productId) {
  const prod = _productos.find(p => p.id === productId);
  if (!prod) return;
  _flashSelectedProduct = prod;
  _flashNegotiatedPrice = prod.precioVenta || 0;
  
  const nameEl = document.getElementById("pos-flash-item-name");
  const brandEl = document.getElementById("pos-flash-item-brand");
  const stockEl = document.getElementById("pos-flash-item-stock");
  const imgCont = document.getElementById("pos-flash-item-img-container");
  const priceDisplay = document.getElementById("pos-flash-normal-price-display");
  const priceInput = document.getElementById("pos-flash-price-input");

  if (nameEl) nameEl.textContent = prod.nombre;
  if (brandEl) brandEl.textContent = prod.marca || "GENÉRICO";
  if (stockEl) stockEl.textContent = `Stock: ${prod.stockActual}`;
  if (priceDisplay) priceDisplay.textContent = `$${new Intl.NumberFormat('es-CO').format(prod.precioVenta || 0)}`;
  if (priceInput) priceInput.value = _flashNegotiatedPrice;
  if (imgCont) {
    imgCont.innerHTML = prod.imagen ? `<img src="${prod.imagen}" class="w-full h-full object-cover" />` : `<span class="material-symbols-outlined text-slate-400 text-3xl">widgets</span>`;
  }

  _flashCurrentStep = 2;
  renderFlashStep();
};

function renderFlashStep() {
  const s1 = document.getElementById("pos-flash-step-1-content");
  const s2 = document.getElementById("pos-flash-step-2-content");
  const s3 = document.getElementById("pos-flash-step-3-content");

  const ind1 = document.getElementById("pos-flash-step-indicator-1");
  const ind2 = document.getElementById("pos-flash-step-indicator-2");
  const ind3 = document.getElementById("pos-flash-step-indicator-3");
  const line1 = document.getElementById("pos-flash-line-1");
  const line2 = document.getElementById("pos-flash-line-2");

  const backBtn = document.getElementById("pos-flash-back-btn");
  const nextBtn = document.getElementById("pos-flash-next-btn");
  const confirmBtn = document.getElementById("pos-flash-confirm-btn");

  s1?.classList.add("hidden");
  s2?.classList.add("hidden");
  s3?.classList.add("hidden");

  const setIndicatorState = (el, active) => {
    const span = el?.querySelector("span");
    if (active) {
      el?.classList.remove("text-slate-400");
      el?.classList.add("text-amber-600");
      span?.classList.remove("bg-slate-200", "text-slate-600");
      span?.classList.add("bg-amber-500", "text-white");
    } else {
      el?.classList.remove("text-amber-600");
      el?.classList.add("text-slate-400");
      span?.classList.remove("bg-amber-500", "text-white");
      span?.classList.add("bg-slate-200", "text-slate-600");
    }
  };

  setIndicatorState(ind1, _flashCurrentStep >= 1);
  setIndicatorState(ind2, _flashCurrentStep >= 2);
  setIndicatorState(ind3, _flashCurrentStep >= 3);

  if (line1) {
    if (_flashCurrentStep >= 2) {
      line1.classList.remove("bg-slate-200");
      line1.classList.add("bg-amber-500");
    } else {
      line1.classList.remove("bg-amber-500");
      line1.classList.add("bg-slate-200");
    }
  }

  if (line2) {
    if (_flashCurrentStep >= 3) {
      line2.classList.remove("bg-slate-200");
      line2.classList.add("bg-amber-500");
    } else {
      line2.classList.remove("bg-amber-500");
      line2.classList.add("bg-slate-200");
    }
  }

  if (_flashCurrentStep === 1) {
    s1?.classList.remove("hidden");
    backBtn?.classList.add("hidden");
    nextBtn?.classList.add("hidden");
    confirmBtn?.classList.add("hidden");
  } else if (_flashCurrentStep === 2) {
    s2?.classList.remove("hidden");
    backBtn?.classList.remove("hidden");
    nextBtn?.classList.remove("hidden");
    confirmBtn?.classList.add("hidden");
  } else if (_flashCurrentStep === 3) {
    s3?.classList.remove("hidden");
    
    const prodSum = document.getElementById("pos-flash-summary-product");
    const normSum = document.getElementById("pos-flash-summary-normal-price");
    const finSum = document.getElementById("pos-flash-summary-final-price");

    if (prodSum) prodSum.textContent = _flashSelectedProduct?.nombre || "Accesorio";
    if (normSum) normSum.textContent = `$${new Intl.NumberFormat('es-CO').format(_flashSelectedProduct?.precioVenta || 0)}`;
    if (finSum) finSum.textContent = `$${new Intl.NumberFormat('es-CO').format(_flashNegotiatedPrice || 0)}`;

    backBtn?.classList.remove("hidden");
    nextBtn?.classList.add("hidden");
    confirmBtn?.classList.remove("hidden");
  }
}

async function confirmarVentaFlashWizard() {
  if (_isProcessing) return;
  if (!_flashSelectedProduct) {
    return showToast("No se seleccionó ningún accesorio", "warning");
  }

  _isProcessing = true;
  const confirmBtn = document.getElementById("pos-flash-confirm-btn");
  if (confirmBtn) {
    confirmBtn.disabled = true;
    confirmBtn.innerHTML = `<span class="material-symbols-outlined text-[18px] animate-spin">sync</span> Procesando...`;
  }

  showToast("Procesando Venta Flash...", "info");

  try {
    const user = JSON.parse(localStorage.getItem("adminpro_user") || "{}");
    const precioOriginal = Number(_flashSelectedProduct.precioVenta || 0);
    const precioFinal = Number(_flashNegotiatedPrice || 0);
    const descuento = precioOriginal > precioFinal ? precioOriginal - precioFinal : 0;

    const ventaData = {
      cedula: "9999999999",
      cliente: "Cliente Flash",
      direccion: "N/A",
      ciudad: "N/A",
      telefono: "N/A",
      productoNombre: _flashSelectedProduct.nombre,
      productoId: _flashSelectedProduct.id,
      items: [{
        id: _flashSelectedProduct.id,
        nombre: _flashSelectedProduct.nombre,
        qty: 1,
        precioManual: precioFinal,
        precioVenta: precioFinal
      }],
      subtotal: precioOriginal > 0 ? precioOriginal : precioFinal,
      descuento: descuento,
      total: precioFinal,
      metodo: "Efectivo",
      vendedor: user.nombre || "Vendedor",
      firmaComprador: "",
      firmaVendedor: "",
      evidencia: "",
      tipoFactura: "flash",
      tipoVenta: "venta",
      imeis: "N/A",
      emisor: {
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
      }
    };

    const res = await registrarVenta(ventaData);
    if (res.success) {
      showToast("⚡ Venta Flash registrada con éxito", "success");

      // Imprimir ticket directamente
      imprimirTicket({ ...ventaData, idFactura: res.idFactura }, "", "");

      closeFlashWizardModal();
      await loadProductos();
      renderProductos(_productos);
    } else {
      showToast("Error al guardar venta flash", "error");
    }
  } catch (err) {
    showToast(err.message || "Error al procesar la venta flash", "error");
  } finally {
    _isProcessing = false;
    if (confirmBtn) {
      confirmBtn.disabled = false;
      confirmBtn.innerHTML = `<span class="material-symbols-outlined text-[20px]" style="font-variation-settings:'FILL' 1">bolt</span><span>Confirmar y Finalizar Venta ⚡</span>`;
    }
  }
}

function imprimirTicket(v, firmaC, firmaV) {
  let title = "COMPROBANTE DE VENTA";
  let badgeText = "PAGADO";
  let badgeStyle = "background: #dcfce7; color: #166534;"; // green
  if (v.tipoFactura === "flash") {
    title = "COMPROBANTE VENTA FLASH";
    badgeText = "FLASH";
    badgeStyle = "background: #f3e8ff; color: #6b21a8;"; // purple
  } else if (v.tipoVenta === "credito") {
    title = "COMPROBANTE DE CRÉDITO";
    badgeText = "CRÉDITO";
    badgeStyle = "background: #fee2e2; color: #991b1b;"; // red
  } else if (v.tipoVenta === "separe") {
    title = "COMPROBANTE PLAN SEPARE";
    badgeText = "SEPARADO";
    badgeStyle = "background: #fef3c7; color: #92400e;"; // amber/orange
  }

  const now = new Date();
  const fechaStr = `${now.getDate()}/${now.getMonth()+1}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}`;
  
  let imeiText = "";
  try {
    const imeiObj = JSON.parse(v.imeis || "{}");
    imeiText = Object.values(imeiObj).flat().join(", ");
  } catch (e) {
    if (v.imeis && v.imeis !== "N/A" && v.imeis !== "{}") {
      imeiText = v.imeis;
    }
  }

  const listaItems = (v.items && v.items.length > 0) ? v.items : _carrito;
  let itemsHtml = listaItems.map(i => `
    <tr>
      <td style="padding: 3px 0; border-bottom: 1px solid #eee;">
        <div style="font-weight: 800;">${(i.nombre || v.productoNombre || "Producto").substring(0,25)}</div>
        <div style="color: #555;">${i.qty || 1} x $${new Intl.NumberFormat('es-CO').format(i.precioManual !== undefined && i.precioManual !== null ? i.precioManual : (i.precioVenta || v.total || 0))}</div>
      </td>
      <td style="text-align: right; vertical-align: bottom; padding: 3px 0; border-bottom: 1px solid #eee; font-weight: 800;">
        $${new Intl.NumberFormat('es-CO').format((i.precioManual !== undefined && i.precioManual !== null ? i.precioManual : (i.precioVenta || v.total || 0)) * (i.qty || 1))}
      </td>
    </tr>
  `).join("");

  const paperFormat = localStorage.getItem("fonebase_paper_format") || "80mm";
  const paperWidth = paperFormat === "58mm" ? "48mm" : "80mm";

  const htmlContent = `
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
            color: #1e293b;
            line-height: 1.3;
          }
          .bold { font-weight: 900; }
          .text-xs { font-size: 8px; }
          .text-sm { font-size: 11px; }
          .text-lg { font-size: 14px; }
          .text-xl { font-size: 18px; }
          .text-slate-500 { color: #64748b; }
          .text-slate-400 { color: #94a3b8; }
          
          .card { 
            border: 1px solid #e2e8f0; 
            border-radius: 6px; 
            padding: 4px; 
            margin-bottom: 6px; 
            background: #f8fafc;
          }
          .flex-between { display: flex; justify-content: space-between; align-items: flex-start; }
          
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
        ${v.emisor.logo ? `<div style="text-align: center; margin-bottom: 4px;"><img src="${v.emisor.logo}" style="max-height: ${v.emisor.logo_size || 40}px; max-width: 100%; object-fit: contain;"></div>` : ''}
        <div class="center" style="margin-bottom: 6px; font-size: 8px; line-height: 1.2; border: 1px solid #e2e8f0; border-radius: 6px; padding: 4px; background: #f8fafc;">
          ${v.emisor.mostrar_nombre ? `<div class="bold text-sm" style="text-transform: uppercase; color: #000;">${v.emisor.nombre}</div>` : ''}
          <div>NIT: ${v.emisor.nit}</div>
          <div>${v.emisor.direccion}</div>
          <div>Tel: ${v.emisor.contacto}</div>
        </div>
        <div class="card">
          <div class="text-xs text-primary bold" style="color: #dc2626; text-transform: uppercase;">${title}</div>
          <div class="flex-between" style="margin-top: 2px;">
            <div class="text-lg bold" style="line-height: 1;">${v.idFactura || v.id_factura}</div>
            <div style="padding: 2px 4px; border-radius: 8px; font-size: 8px; font-weight: 900; text-transform: uppercase; ${badgeStyle}">${badgeText}</div>
          </div>
          <div class="flex-between" style="margin-top: 2px;">
            <div class="text-xs text-slate-500">${fechaStr}</div>
            <div class="text-xs bold">${v.metodo || 'Efectivo'}</div>
          </div>
        </div>
        <div class="grid-2">
          <div>
            <div class="section-title">INFORMACIÓN DEL CLIENTE</div>
            <div class="bold text-sm">${v.cliente}</div>
            <div class="text-xs text-slate-500">ID: ${v.cedula}</div>
            <div class="text-xs text-slate-500"><span class="text-slate-400 bold">Tel:</span> ${v.telefono}</div>
            <div class="text-xs text-slate-500"><span class="text-slate-400 bold">Ubicación:</span> ${v.direccion}, ${v.ciudad}</div>
          </div>
          <div>
            <div class="section-title">ATENDIDO POR</div>
            <div class="bold text-sm">${v.vendedor || 'Vendedor'}</div>
            <div class="text-xs text-slate-400" style="font-style: italic;">Vendedor Autorizado</div>
            <div class="text-xs bold" style="color: #dc2626; background: #fef2f2; display: inline-block; padding: 1px 4px; border-radius: 4px; margin-top: 2px; text-transform: uppercase;">${v.tipoFactura || 'DIGITAL'}</div>
          </div>
        </div>
        <div style="border-top: 1px solid #f1f5f9; margin: 6px 0;"></div>
        <div class="section-title">DETALLE DE PRODUCTOS</div>
        <table style="width: 100%; border-collapse: collapse;">${itemsHtml}</table>
        ${imeiText && imeiText !== '{}' ? `<div class="text-xs bold" style="color:#dc2626; margin-top: 4px; margin-bottom: 4px;">IMEI/SERIE: ${imeiText}</div>` : ''}
        <div class="summary-card">
          <div class="flex-between" style="align-items: flex-end;">
            <div>
              <div class="section-title" style="color: #94a3b8; margin-top: 0;">RESUMEN FINANCIERO</div>
              <div class="text-xs" style="color: #cbd5e1;">Subtotal: $${new Intl.NumberFormat('es-CO').format(v.subtotal)}</div>
              <div class="text-xs bold" style="color: #f87171;">Descuento: -$${new Intl.NumberFormat('es-CO').format(v.descuento)}</div>
            </div>
            <div style="text-align: right;">
              <div class="section-title" style="color: #94a3b8; margin-top: 0; margin-bottom: 0;">TOTAL COBRADO</div>
              <div class="text-xl bold text-white" style="line-height: 1;">$${new Intl.NumberFormat('es-CO').format(v.total)}</div>
            </div>
          </div>
        </div>
        <div style="margin-top: 8px; display: flex; flex-direction: column; gap: 6px;">
           <div class="center">
             <div class="text-xs bold text-slate-400">FIRMA COMPRADOR</div>
             <div style="border: 1px solid #e2e8f0; border-radius: 4px; background: #f8fafc; height: 45px; margin-top: 2px; display: flex; justify-content: center; align-items: center; width: 100%;">
               ${firmaC ? `<img src="${firmaC}" style="height: 40px; max-width: 100%; object-fit: contain;">` : ''}
             </div>
           </div>
           <div class="center">
             <div class="text-xs bold text-slate-400">FIRMA VENDEDOR</div>
             <div style="border: 1px solid #e2e8f0; border-radius: 4px; background: #f8fafc; height: 45px; margin-top: 2px; display: flex; justify-content: center; align-items: center; width: 100%;">
               ${firmaV ? `<img src="${firmaV}" style="height: 40px; max-width: 100%; object-fit: contain;">` : ''}
             </div>
           </div>
        </div>
        <div class="legal">
          ${v.emisor.condiciones || 'GARANTIA: Equipos probados y encendidos. Sin garantía en displays/táctiles o equipos apagados. Doc. asimilado a letra de cambio (Art. 774 C.Comercio).'}
        </div>
        <div class="center bold" style="margin-top: 8px; font-size: 11px;">¡GRACIAS POR SU COMPRA!</div>
      </body>
    </html>
  `;

  // Print using hidden iframe (bypasses browser pop-up blockers)
  let iframe = document.getElementById("print-iframe");
  if (iframe) iframe.remove();
  iframe = document.createElement("iframe");
  iframe.id = "print-iframe";
  iframe.style.position = "absolute";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "none";
  iframe.style.visibility = "hidden";
  document.body.appendChild(iframe);
  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(htmlContent);
  doc.close();
  setTimeout(() => {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
  }, 250);
}

function initCustomSelects() {
  const setupCustomSelect = (containerId, hiddenInputId, onSelectChange) => {
    const container = document.getElementById(containerId);
    if (!container) return;
    const trigger = container.querySelector(".custom-select-trigger");
    const optionsMenu = container.querySelector(".custom-select-options");
    const hiddenInput = document.getElementById(hiddenInputId);
    const options = container.querySelectorAll(".custom-option");
    
    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      document.querySelectorAll(".custom-select-options").forEach(menu => {
        if (menu !== optionsMenu) menu.classList.add("hidden");
      });
      optionsMenu.classList.toggle("hidden");
    });
    
    options.forEach(opt => {
      opt.addEventListener("click", () => {
        const val = opt.dataset.value;
        const iconName = opt.querySelector(".material-symbols-outlined").textContent;
        const labelText = opt.querySelector(".flex-1").textContent;
        
        trigger.querySelector(".selected-label").textContent = labelText;
        trigger.querySelector(".material-symbols-outlined").textContent = iconName;
        
        options.forEach(o => {
          const check = o.querySelector(".check-icon");
          if (o === opt) check.classList.remove("hidden");
          else check.classList.add("hidden");
        });
        
        if (hiddenInput) {
          hiddenInput.value = val;
          hiddenInput.dispatchEvent(new Event("change", { bubbles: true }));
        }
        
        optionsMenu.classList.add("hidden");
        if (onSelectChange) onSelectChange(val);
      });
    });
  };

  setupCustomSelect("pos-metodo-pago-container", "pos-metodo-pago", (val) => {
    syncCustomSelectUI("pos-metodo-pago-container-mobile", val);
  });

  setupCustomSelect("pos-metodo-pago-container-mobile", "pos-metodo-pago-mobile", (val) => {
    syncCustomSelectUI("pos-metodo-pago-container", val);
    const dest = document.getElementById("pos-metodo-pago");
    if (dest) dest.value = val;
  });

  document.addEventListener("click", () => {
    document.querySelectorAll(".custom-select-options").forEach(menu => {
      menu.classList.add("hidden");
    });
  });
}

function syncCustomSelectUI(containerId, value) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const trigger = container.querySelector(".custom-select-trigger");
  const options = container.querySelectorAll(".custom-option");
  const targetOption = Array.from(options).find(o => o.dataset.value === value);
  if (targetOption) {
    const iconName = targetOption.querySelector(".material-symbols-outlined").textContent;
    const labelText = targetOption.querySelector(".flex-1").textContent;
    trigger.querySelector(".selected-label").textContent = labelText;
    trigger.querySelector(".material-symbols-outlined").textContent = iconName;
    options.forEach(o => {
      const check = o.querySelector(".check-icon");
      if (o === targetOption) check.classList.remove("hidden");
      else check.classList.add("hidden");
    });
  }
}

window.__posAddReventaToCart = (p) => {
  const existProd = _productos.find(x => x.id === p.id);
  if (!existProd) {
    _productos.unshift({
      id: p.id,
      nombre: p.nombre,
      sku: p.id,
      marca: p.marca || "GENERICO",
      categoria: p.categoria || "Celulares",
      precioVenta: p.precioVenta || 0,
      costo: p.costo || 0,
      stockActual: 999
    });
  } else {
    existProd.stockActual = Math.max(existProd.stockActual, 999);
  }
  
  const existCart = _carrito.find(i => i.id === p.id);
  if (existCart) {
    existCart.qty++;
  } else {
    _carrito.push({
      id: p.id,
      nombre: p.nombre,
      qty: 1,
      precioManual: p.precioVenta || 0
    });
  }
  renderProductos(_productos);
  renderCarrito();
  navigate("pos");
  showToast(`Reventa de ${p.nombre} agregada al carrito`, "success");
};

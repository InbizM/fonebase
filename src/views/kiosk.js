import { getInventario, getEquipos, logout } from "../api.js";
import { showConfirm } from "../toast.js";

let _kioskTimer = null;
let _kioskProducts = [];
let _currentIndex = 0;
let _isPaused = false;
let _userRole = "";

export async function initKiosk() {
  const container = document.querySelector('[data-view="kiosk"]');
  if (!container) return;

  try {
    const user = JSON.parse(localStorage.getItem("adminpro_user") || "{}");
    _userRole = user.rol || "";
    
    const [inv, eq] = await Promise.all([getInventario(), getEquipos()]);
    
    const productosInv = (inv || []).filter(p => p.imagen && p.precioVenta > 0).map(p => {
      let ramVal = "";
      let memoriaVal = "";
      let colorVal = "";
      let nombreBase = p.nombre || "";
      const catLower = (p.categoria || "").trim().toLowerCase();
      if (catLower === "celular" || catLower === "celulares") {
        const specRegex = /\(([^/)]+)(?:\s*\/\s*([^/)]+))?(?:\s*\/\s*([^/)]+))?\)$/;
        const match = nombreBase.match(specRegex);
        if (match) {
          nombreBase = nombreBase.replace(specRegex, "").trim();
          const parts = [match[1], match[2], match[3]].filter(Boolean).map(x => x.trim());
          if (parts.length === 3) {
            ramVal = parts[0];
            memoriaVal = parts[1];
            colorVal = parts[2];
          } else if (parts.length === 2) {
            if (parts[0].toLowerCase().includes("ram")) {
              ramVal = parts[0];
              memoriaVal = parts[1];
            } else if (parts[1].toLowerCase().includes("ram")) {
              ramVal = parts[1];
              memoriaVal = parts[0];
            } else {
              memoriaVal = parts[0];
              colorVal = parts[1];
            }
          } else if (parts.length === 1) {
            if (parts[0].toLowerCase().includes("ram")) {
              ramVal = parts[0];
            } else if (/\b\d+\s*(?:GB|TB)\b/i.test(parts[0])) {
              memoriaVal = parts[0];
            } else {
              colorVal = parts[0];
            }
          }
        }
      }
      if (ramVal) ramVal = ramVal.replace(/\s*RAM\b/gi, "").trim();

      return {
        id: p.id,
        nombre: nombreBase,
        marca: p.marca || "Editorial",
        categoria: p.categoria || "Accesorio",
        precio: p.precioVenta,
        imagen: p.imagen,
        destacado: p.categoria === "Celulares" ? "LA COLECCIÓN EXCLUSIVA" : "EL DETALLE PERFECTO",
        subtitulo: "Diseño de vanguardia y rendimiento excepcional en cada línea.",
        specs: [
          colorVal ? `Acabado ${colorVal}` : null,
          ramVal ? `Rendimiento de ${ramVal} RAM` : null,
          memoriaVal ? `Espacio: ${memoriaVal}` : null
        ].filter(Boolean)
      };
    });

    const productosEq = (eq || []).filter(e => e.venta > 0 && e.estado === "Disponible").map(e => ({
      id: e.imei1,
      nombre: e.nombre,
      marca: e.marca || "Signature",
      categoria: "Celular IMEI",
      precio: e.venta,
      imagen: e.imagen || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop",
      destacado: "EDICIÓN DE COLECCIONISTA",
      subtitulo: "La obra maestra de la tecnología móvil ya está disponible en tienda.",
      specs: [`Garantía Certificada`, `Disponibilidad Inmediata`, `IMEI Registrado`]
    }));

    _kioskProducts = [...productosInv, ...productosEq];
    if (_kioskProducts.length === 0) {
      _kioskProducts = [
        {
          id: "demo-1",
          nombre: "iPhone 15 Pro Max 256GB",
          marca: "Apple Edition",
          categoria: "Smartphone",
          precio: 4890000,
          imagen: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800&auto=format&fit=crop",
          destacado: "LA CÚSPIDE DE LA ELEGANCIA",
          subtitulo: "Un marco de titanio cepillado que redefine la sofisticación moderna y la potencia.",
          specs: ["Pantalla 6.7'' Super Retina XDR", "Estructura de Titanio Grado 5", "Cámara Teleobjetivo de 120mm"]
        },
        {
          id: "demo-2",
          nombre: "Galaxy S24 Ultra Titanium",
          marca: "Samsung Lux",
          categoria: "Smartphone",
          precio: 4590000,
          imagen: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=800&auto=format&fit=crop",
          destacado: "EL FUTURO ES INTELIGENCIA",
          subtitulo: "Inteligencia artificial que optimiza cada momento de tu rutina diaria.",
          specs: ["Galaxy AI Integrada", "Lápiz Óptico Integrado", "Estructura de Titanio Puro"]
        }
      ];
    }
  } catch (err) {
    console.error("Error al cargar productos en Kiosco:", err);
  }

  _currentIndex = 0;
  renderKioskUI(container);
  startKioskTimer();

  // Enlazar evento de cerrar sesión para Kiosco
  container.addEventListener("click", async (e) => {
    if (e.target.closest("#kiosk-top-logout-btn")) {
      const ok = await showConfirm("Confirmación", "¿Estás seguro de que deseas cerrar sesión?");
      if (ok) {
        logout();
        window.location.reload();
      }
    }
  });
}

function renderKioskUI(container) {
  const current = _kioskProducts[_currentIndex] || _kioskProducts[0];
  const formattedPrice = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(current.precio);

  // Paleta exacta del proyecto
  const COLORS = {
    bg: "#D6D2C9",
    black: "#111111",
    blackDeep: "#080808",
    cream: "#E8E4DC",
    green: "#34D399",
    red: "#E6171A",
    line: "#3A3A3A",
  };

  const benefits = current.specs && current.specs.length > 0
    ? current.specs.slice(0, 4).map((spec, i) => {
        const icons = [
          `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="${COLORS.black}" stroke-width="1.5"><path d="M12 2l8 3v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V5l8-3z"/></svg>`,
          `<svg width="22" height="26" viewBox="0 0 20 28" fill="none" stroke="${COLORS.black}" stroke-width="1.5"><rect x="1" y="1" width="18" height="26"/><path d="M7 21l6-14"/></svg>`,
          `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="${COLORS.black}" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/></svg>`,
          `<svg width="24" height="26" viewBox="0 0 24 28" fill="none" stroke="${COLORS.black}" stroke-width="1.5"><rect x="6" y="8" width="12" height="16"/><path d="M9 8V4M15 8V4"/></svg>`,
        ];
        return `<div style="display:flex;align-items:center;gap:clamp(10px,3cqw,16px);padding:clamp(12px,4.5cqw,22px) clamp(12px,5cqw,28px);border-top:1px solid ${COLORS.line};${i % 2 === 0 ? `border-right:1px solid ${COLORS.line};` : ''}">
          ${icons[i] || icons[0]}
          <span style="font-family:'IBM Plex Mono',monospace;font-size:clamp(9px,2.2cqw,13px);font-weight:700;letter-spacing:clamp(0.3px,0.3cqw,1.5px);text-transform:uppercase;line-height:1.3;color:${COLORS.black};">${spec.replace(/ /g, "<br>")}</span>
        </div>`;
      })
    : [
        { label: "1 AÑO<br>GARANTÍA",   icon: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="${COLORS.black}" stroke-width="1.5"><path d="M12 2l8 3v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V5l8-3z"/></svg>` },
        { label: "CARGADOR<br>INCLUIDO",  icon: `<svg width="22" height="26" viewBox="0 0 20 28" fill="none" stroke="${COLORS.black}" stroke-width="1.5"><rect x="1" y="1" width="18" height="26"/><path d="M7 21l6-14"/></svg>` },
        { label: "VIDRIO<br>BLINDADO",    icon: `<svg width="24" height="26" viewBox="0 0 24 24" fill="none" stroke="${COLORS.black}" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/></svg>` },
        { label: "TODOS LOS<br>OPERADORES", icon: `<svg width="24" height="26" viewBox="0 0 24 28" fill="none" stroke="${COLORS.black}" stroke-width="1.5"><rect x="6" y="8" width="12" height="16"/><path d="M9 8V4M15 8V4"/></svg>` },
      ].map((b, i) => `<div style="display:flex;align-items:center;gap:clamp(10px,3cqw,16px);padding:clamp(12px,4.5cqw,22px) clamp(12px,5cqw,28px);border-top:1px solid ${COLORS.line};${i % 2 === 0 ? `border-right:1px solid ${COLORS.line};` : ''}">
        ${b.icon}
        <span style="font-family:'IBM Plex Mono',monospace;font-size:clamp(9px,2.2cqw,13px);font-weight:700;letter-spacing:clamp(0.3px,0.3cqw,1.5px);text-transform:uppercase;line-height:1.3;color:${COLORS.black};">${b.label}</span>
      </div>`);

  // Dots paginación
  const dots = _kioskProducts.map((_, idx) =>
    `<button data-kiosk-index="${idx}" style="width:${idx === _currentIndex ? '28px' : '8px'};height:8px;border-radius:4px;background:${idx === _currentIndex ? COLORS.cream : 'rgba(232,228,220,0.35)'};border:none;cursor:pointer;transition:all .35s;flex-shrink:0;"></button>`
  ).join("");

  container.innerHTML = `
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet">
  
  <style id="kiosk-print-rules">
    @media print {
      @page {
        size: A4 portrait;
        margin: 8mm;
      }
      
      html, body {
        background: #ffffff !important;
        margin: 0 !important;
        padding: 0 !important;
        width: 100% !important;
        height: auto !important;
      }

      /* Ocultar elementos generales fuera del póster */
      body > *:not(#app-shell),
      #app-shell > header,
      #app-shell > aside,
      #desktop-nav,
      .kiosk-no-print {
        display: none !important;
      }

      [data-view="kiosk"] {
        display: block !important;
        position: static !important;
        width: 100% !important;
        height: auto !important;
        background: transparent !important;
        padding: 0 !important;
        margin: 0 !important;
      }

      .kiosk-outer-wrapper {
        position: static !important;
        inset: auto !important;
        background: transparent !important;
        padding: 0 !important;
        margin: 0 !important;
        display: block !important;
        width: 100% !important;
        overflow: visible !important;
      }

      .kiosk-poster-card {
        width: 100% !important;
        max-width: 190mm !important;
        margin: 0 auto !important;
        border: 1px solid #111111 !important;
        box-shadow: none !important;
        overflow: visible !important;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
    }

    /* Screen-only responsive layouts & transitions */
    .kiosk-poster-card {
      animation: fadeInKiosk 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes fadeInKiosk {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .kiosk-benefits-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      border: 1px solid ${COLORS.line};
      margin: 0 clamp(18px, 7cqw, 44px);
      border-top: none;
    }
    
    .kiosk-footer {
      background: ${COLORS.black};
      color: ${COLORS.cream};
      padding: clamp(14px, 5cqw, 26px) clamp(18px, 7cqw, 44px);
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      margin-top: clamp(18px, 5cqw, 36px);
      font-size: clamp(9px, 1.9cqw, 11px);
      font-family: 'IBM Plex Mono', monospace;
      letter-spacing: .4px;
      line-height: 1.6;
    }

    @media (max-width: 639px) {
      .kiosk-benefits-grid {
        grid-template-columns: 1fr !important;
        margin: 0 clamp(10px, 4cqw, 18px) !important;
      }
      .kiosk-benefits-grid > div {
        border-right: none !important;
        border-bottom: 1px solid ${COLORS.line} !important;
      }
      .kiosk-benefits-grid > div:last-child {
        border-bottom: none !important;
      }
      .kiosk-footer {
        flex-direction: column !important;
        align-items: stretch !important;
        gap: 16px !important;
        padding: 16px !important;
        margin-top: 18px !important;
      }
      .kiosk-footer-dots {
        order: 1 !important;
        justify-content: center !important;
      }
      .kiosk-footer-nav {
        order: 2 !important;
        display: flex !important;
        justify-content: space-between !important;
        width: 100% !important;
      }
      .kiosk-footer-controls {
        order: 3 !important;
        display: flex !important;
        flex-direction: column !important;
        gap: 8px !important;
        width: 100% !important;
      }
      .kiosk-footer-controls button {
        width: 100% !important;
        justify-content: center !important;
      }
    }
  </style>

  <div class="kiosk-outer-wrapper" style="
    position:fixed;inset:0;z-index:50;
    background:#9a968d;
    display:flex;justify-content:center;align-items:flex-start;
    padding:clamp(8px,2vh,24px) clamp(6px,2vw,16px);
    font-family:'IBM Plex Mono',monospace;
    overflow-y:auto;
    container-type:inline-size;container-name:kiosk-outer;
  ">
    <!-- Poster -->
    <div class="kiosk-poster-card" style="
      width:min(96vw,640px);
      background:${COLORS.bg};
      position:relative;overflow:hidden;
      container-type:inline-size;container-name:poster;
    ">

      <!-- HEADER -->
      <div style="padding:clamp(20px,8cqw,52px) clamp(18px,7cqw,44px) clamp(14px,5cqw,36px);position:relative;">
        <div class="kiosk-no-print" style="position:absolute;top:clamp(16px,4cqw,32px);right:clamp(18px,7cqw,44px);z-index:10;display:inline-flex;gap:8px;">
          ${_userRole === "Kiosco" ? `
          <button id="kiosk-top-logout-btn" title="Cerrar Sesión" style="background:${COLORS.black};border:1px solid ${COLORS.red};color:${COLORS.cream};padding:6px 12px;font-family:'IBM Plex Mono',monospace;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;cursor:pointer;display:inline-flex;align-items:center;gap:6px;border-radius:4px;transition:all .2s;box-shadow:0 2px 8px rgba(0,0,0,0.2);">
            <span class="material-symbols-outlined" style="font-size:16px;line-height:1;color:${COLORS.red};">logout</span>
            <span>Salir</span>
          </button>
          ` : ''}
          <button id="kiosk-top-print-btn" title="Imprimir Póster PDF" style="background:${COLORS.black};border:1px solid ${COLORS.line};color:${COLORS.cream};padding:6px 12px;font-family:'IBM Plex Mono',monospace;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;cursor:pointer;display:inline-flex;align-items:center;gap:6px;border-radius:4px;transition:all .2s;box-shadow:0 2px 8px rgba(0,0,0,0.2);">
            <span class="material-symbols-outlined" style="font-size:16px;line-height:1;color:${COLORS.green};">picture_as_pdf</span>
            <span>Imprimir PDF</span>
          </button>
        </div>
        <h1 style="
          font-family:'Bebas Neue',sans-serif;
          font-size:clamp(2.2rem,17cqw,7rem);
          line-height:0.88;color:${COLORS.black};margin:0;
          text-transform:uppercase;letter-spacing:1px;
        ">${current.nombre.replace(/\s(.)/g, m => '<br>' + m.trim())}</h1>
        <div style="margin-top:clamp(12px,4cqw,28px);display:flex;align-items:center;gap:16px;flex-wrap:wrap;">
          <span style="color:${COLORS.black};font-size:clamp(10px,2.2cqw,14px);font-weight:700;letter-spacing:clamp(2px,0.9cqw,5px);text-transform:uppercase;">${current.destacado || "DISPONIBLE"}</span>
          <span style="color:${COLORS.black};opacity:.55;font-size:clamp(9px,1.9cqw,12px);letter-spacing:clamp(1px,0.5cqw,2.5px);text-transform:uppercase;">${current.categoria}</span>
        </div>
        <div style="width:clamp(32px,8cqw,52px);height:4px;background:${COLORS.red};margin-top:clamp(10px,2.5cqw,18px);"></div>
      </div>

      <!-- PRODUCT BLOCK -->
      <div style="
        position:relative;
        margin:0 clamp(18px,7cqw,44px);
        background:${COLORS.black};
        min-height:clamp(300px,82cqw,560px);
        display:flex;align-items:flex-end;justify-content:flex-end;
        overflow:hidden;
      ">
        <!-- Grid overlay -->
        <div style="position:absolute;inset:0;background-image:linear-gradient(90deg,${COLORS.line} 1px,transparent 1px);background-size:40px 100%;opacity:.1;pointer-events:none;"></div>

        <!-- Imagen del producto o teléfono CSS -->
        ${current.imagen
          ? `<img src="${current.imagen}" alt="${current.nombre}"
               style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain;padding:clamp(12px,5cqw,32px);z-index:2;">`
          : `<!-- CSS Phone -->
             <div style="position:relative;z-index:2;width:44cqw;max-width:420px;height:0;padding-bottom:56cqw;max-height:540px;margin:6cqw 4cqw 0 0;flex-shrink:0;">
               <!-- Back phone -->
               <div style="position:absolute;width:52%;height:84%;left:0;top:11%;background:#1c1c1c;border:1px solid #333;">
                 <div style="position:absolute;top:9%;left:9%;width:47%;height:23%;background:${COLORS.blackDeep};border:1px solid #2a2a2a;">
                   <div style="position:absolute;width:36%;height:36%;border-radius:50%;background:#0a0a0a;border:2px solid #303030;top:5%;left:5%;"></div>
                   <div style="position:absolute;width:36%;height:36%;border-radius:50%;background:#0a0a0a;border:2px solid #303030;top:5%;left:52%;"></div>
                   <div style="position:absolute;width:36%;height:36%;border-radius:50%;background:#0a0a0a;border:2px solid #303030;top:52%;left:5%;"></div>
                   <div style="position:absolute;top:55%;left:55%;width:19%;height:19%;border-radius:50%;background:#4a4a44;"></div>
                 </div>
               </div>
               <!-- Front phone -->
               <div style="position:absolute;width:52%;height:88%;right:0;top:0;background:${COLORS.blackDeep};border:1px solid #2a2a2a;">
                 <div style="position:absolute;inset:2.5%;background:linear-gradient(160deg,#141414,#000 70%);"></div>
                 <div style="position:absolute;top:2.5%;left:50%;transform:translateX(-50%);width:39%;height:4%;background:#000;"></div>
                 <div style="position:absolute;background:#222;width:2px;height:6.5%;left:-2px;top:22%;"></div>
                 <div style="position:absolute;background:#222;width:2px;height:10%;left:-2px;top:32%;"></div>
                 <div style="position:absolute;background:#222;width:2px;height:10%;left:-2px;top:43%;"></div>
               </div>
             </div>`
        }

        <!-- Price Tag -->
        <div style="
          position:absolute;z-index:5;left:0;bottom:0;
          background:${COLORS.blackDeep};
          border-top:1px solid ${COLORS.line};border-right:1px solid ${COLORS.line};
          padding:clamp(14px,5cqw,26px) clamp(18px,7cqw,38px) clamp(18px,6cqw,30px);
          max-width:78%;
        ">
          <div style="color:${COLORS.cream};font-size:clamp(9px,2cqw,13px);font-weight:700;letter-spacing:clamp(2px,0.9cqw,5px);text-transform:uppercase;opacity:.75;">Precio</div>
          <div style="font-family:'Bebas Neue',sans-serif;color:${COLORS.green};font-size:clamp(1.8rem,11cqw,4.2rem);line-height:1;margin-top:8px;letter-spacing:1px;white-space:nowrap;">${formattedPrice}</div>
        </div>
      </div>

      <!-- BENEFITS GRID -->
      <div class="kiosk-benefits-grid">
        ${benefits.join("")}
      </div>

      <!-- FOOTER -->
      <div class="kiosk-footer">
        <!-- Nav Buttons -->
        <div class="kiosk-no-print kiosk-footer-nav" style="display:flex;align-items:center;gap:10px;">
          <button id="kiosk-prev-btn" style="background:transparent;border:1px solid ${COLORS.cream};color:${COLORS.cream};padding:6px 12px;font-family:'IBM Plex Mono',monospace;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;cursor:pointer;transition:all .2s;">← PREV</button>
          <button id="kiosk-next-btn" style="background:${COLORS.red};border:1px solid ${COLORS.red};color:${COLORS.cream};padding:6px 12px;font-family:'IBM Plex Mono',monospace;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;cursor:pointer;transition:all .2s;">NEXT →</button>
        </div>
        <!-- Dots -->
        <div class="kiosk-no-print kiosk-footer-dots" style="display:flex;align-items:center;gap:6px;flex:1;justify-content:center;min-width:120px;">${dots}</div>
        <!-- Controls -->
        <div class="kiosk-no-print kiosk-footer-controls" style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
          <button id="kiosk-print-btn" title="Imprimir Póster PDF" style="background:${COLORS.green};border:1px solid ${COLORS.green};color:${COLORS.black};padding:6px 12px;font-family:'IBM Plex Mono',monospace;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;cursor:pointer;display:inline-flex;align-items:center;gap:6px;border-radius:4px;transition:all .2s;">
            <span class="material-symbols-outlined" style="font-size:16px;line-height:1;">picture_as_pdf</span>
            <span>Imprimir Póster PDF</span>
          </button>
          <button id="kiosk-pause-btn" style="background:transparent;border:1px solid rgba(232,228,220,.3);color:${COLORS.cream};padding:6px 10px;font-family:'IBM Plex Mono',monospace;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;cursor:pointer;">
            ${_isPaused ? '▶ PLAY' : '⏸ PAUSA'}
          </button>
          <button id="kiosk-exit-btn" style="background:transparent;border:none;color:rgba(232,228,220,.45);padding:6px 8px;font-family:'IBM Plex Mono',monospace;font-size:10px;font-weight:700;cursor:pointer;letter-spacing:1px;text-transform:uppercase;">SALIR ✕</button>
        </div>
      </div>

    </div><!-- /poster -->
  </div><!-- /outer -->
  `;

  // Listeners de impresión y navegación
  const handlePrint = () => {
    const wasPaused = _isPaused;
    stopKioskTimer();
    window.print();
    if (!wasPaused && window.location.hash === "#kiosk") {
      startKioskTimer();
    }
  };

  document.getElementById("kiosk-print-btn")?.addEventListener("click", handlePrint);
  document.getElementById("kiosk-top-print-btn")?.addEventListener("click", handlePrint);

  // Listeners de navegación
  document.getElementById("kiosk-prev-btn")?.addEventListener("click", () => {
    _currentIndex = (_currentIndex - 1 + _kioskProducts.length) % _kioskProducts.length;
    renderKioskUI(container);
  });

  document.getElementById("kiosk-next-btn")?.addEventListener("click", () => {
    _currentIndex = (_currentIndex + 1) % _kioskProducts.length;
    renderKioskUI(container);
  });

  document.getElementById("kiosk-pause-btn")?.addEventListener("click", () => {
    _isPaused = !_isPaused;
    if (_isPaused) stopKioskTimer();
    else startKioskTimer();
    renderKioskUI(container);
  });

  document.getElementById("kiosk-exit-btn")?.addEventListener("click", () => {
    stopKioskTimer();
    window.location.hash = "#dashboard";
  });

  container.querySelectorAll('[data-kiosk-index]').forEach(dot => {
    dot.addEventListener("click", (e) => {
      _currentIndex = parseInt(e.currentTarget.getAttribute("data-kiosk-index"), 10);
      renderKioskUI(container);
    });
  });
}

function startKioskTimer() {
  stopKioskTimer();
  if (_isPaused) return;
  _kioskTimer = setInterval(() => {
    if (window.location.hash !== "#kiosk") {
      stopKioskTimer();
      return;
    }
    if (_kioskProducts.length > 0) {
      _currentIndex = (_currentIndex + 1) % _kioskProducts.length;
      const container = document.querySelector('[data-view="kiosk"]');
      if (container) {
        renderKioskUI(container);
      }
    }
  }, 7000);
}

function stopKioskTimer() {
  if (_kioskTimer) {
    clearInterval(_kioskTimer);
    _kioskTimer = null;
  }
}


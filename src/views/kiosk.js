import { getInventario, getEquipos } from "../api.js";

let _kioskTimer = null;
let _kioskProducts = [];
let _currentIndex = 0;
let _isPaused = false;

export async function initKiosk() {
  const container = document.querySelector('[data-view="kiosk"]');
  if (!container) return;

  try {
    const [inv, eq] = await Promise.all([getInventario(), getEquipos()]);
    
    const productosInv = (inv || []).filter(p => p.imagen && p.precioVenta > 0).map(p => ({
      id: p.id,
      nombre: p.nombre,
      marca: p.marca || "Premium",
      categoria: p.categoria || "Accesorio",
      precio: p.precioVenta,
      imagen: p.imagen,
      destacado: p.categoria === "Celulares" ? "OFERTA RECOMENDADA" : "OFERTA FLASH",
      specs: [p.color ? `Color: ${p.color}` : null, p.ram ? `RAM: ${p.ram}` : null, p.memoria ? `Almacenamiento: ${p.memoria}` : null].filter(Boolean)
    }));

    const productosEq = (eq || []).filter(e => e.venta > 0 && e.estado === "Disponible").map(e => ({
      id: e.imei1,
      nombre: e.nombre,
      marca: e.marca || "Smartphone",
      categoria: "Celular IMEI",
      precio: e.venta,
      imagen: e.imagen || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop",
      destacado: "EQUIPO DISPONIBLE",
      specs: [`IMEI: ${e.imei1}`, `Garantía Oficial`, `Entrega Inmediata`]
    }));

    _kioskProducts = [...productosInv, ...productosEq];
    if (_kioskProducts.length === 0) {
      _kioskProducts = [
        {
          id: "demo-1",
          nombre: "iPhone 15 Pro Max 256GB",
          marca: "Apple",
          categoria: "Smartphone",
          precio: 4890000,
          imagen: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800&auto=format&fit=crop",
          destacado: "🔥 SUPER OFERTA DEL DÍA",
          specs: ["Pantalla 6.7'' Super Retina XDR", "Chip A17 Pro Titanium", "Cámara 48MP Zoom 5x"]
        },
        {
          id: "demo-2",
          nombre: "Samsung Galaxy S24 Ultra 512GB",
          marca: "Samsung",
          categoria: "Smartphone",
          precio: 4590000,
          imagen: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=800&auto=format&fit=crop",
          destacado: "⚡ INVENTARIO DESTACADO",
          specs: ["Galaxy AI Integrado", "S-Pen Incluido", "Titanium Black"]
        }
      ];
    }
  } catch (err) {
    console.error("Error al cargar productos en Kiosco:", err);
  }

  _currentIndex = 0;
  renderKioskUI(container);
  startKioskTimer();
}

function renderKioskUI(container) {
  const current = _kioskProducts[_currentIndex] || _kioskProducts[0];
  const formattedPrice = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(current.precio);

  container.innerHTML = `
    <div class="fixed inset-0 z-50 bg-[#09090b] text-white flex flex-col justify-between p-6 md:p-12 overflow-hidden select-none">
      
      <!-- Top Banner -->
      <div class="flex items-center justify-between border-b border-white/10 pb-6">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-400 flex items-center justify-center shadow-lg shadow-red-500/30 animate-pulse">
            <span class="material-symbols-outlined text-white text-[28px]">stars</span>
          </div>
          <div>
            <h2 class="text-2xl font-extrabold tracking-tight" style="font-family: 'Outfit', sans-serif;">
              <span class="text-red-500">Fone</span>Base <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 uppercase tracking-widest ml-2">Exhibición Tienda</span>
            </h2>
            <p class="text-slate-400 text-xs">Catálogo de Productos y Ofertas Exclusivas</p>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <button id="kiosk-pause-btn" class="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-sm font-semibold transition-all backdrop-blur-md border border-white/10">
            <span class="material-symbols-outlined text-[18px]">${_isPaused ? 'play_arrow' : 'pause'}</span>
            <span>${_isPaused ? 'Reanudar' : 'Pausar'}</span>
          </button>
          
          <button id="kiosk-exit-btn" class="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600/30 hover:bg-red-600 text-red-300 hover:text-white text-sm font-semibold transition-all border border-red-500/40 shadow-lg shadow-red-900/20">
            <span class="material-symbols-outlined text-[18px]">logout</span>
            <span>Salir de Kiosco</span>
          </button>
        </div>
      </div>

      <!-- Main Showcase Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 my-auto items-center max-w-7xl mx-auto w-full">
        
        <!-- Left: Image Display -->
        <div class="lg:col-span-6 flex justify-center items-center relative group">
          <div class="absolute inset-0 bg-gradient-to-tr from-red-600/20 to-purple-600/20 rounded-3xl blur-3xl opacity-60"></div>
          
          <div class="relative w-full max-w-[480px] h-[380px] md:h-[460px] rounded-3xl overflow-hidden border border-white/15 bg-black/40 backdrop-blur-2xl shadow-2xl flex items-center justify-center p-6">
            <img src="${current.imagen}" alt="${current.nombre}" class="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(230,23,26,0.3)] transition-transform duration-700 ease-out hover:scale-105" />
            
            <div class="absolute top-4 left-4 bg-red-600 text-white text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-xl shadow-lg">
              ${current.destacado}
            </div>
          </div>
        </div>

        <!-- Right: Product Info & Price -->
        <div class="lg:col-span-6 flex flex-col justify-center space-y-6">
          <div>
            <span class="text-xs font-bold text-red-400 tracking-widest uppercase bg-red-500/10 px-3 py-1 rounded-lg border border-red-500/20">${current.marca}</span>
            <h1 class="text-4xl md:text-5xl font-black tracking-tight text-white mt-3 leading-tight" style="font-family: 'Outfit', sans-serif;">
              ${current.nombre}
            </h1>
          </div>

          <!-- Price Tag -->
          <div class="p-6 rounded-2xl bg-gradient-to-r from-red-950/40 via-red-900/20 to-transparent border border-red-500/30 backdrop-blur-xl">
            <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Precio Especial de Contado</span>
            <span class="text-4xl md:text-6xl font-black text-emerald-400 tracking-tight" style="font-family: 'Space Grotesk', sans-serif;">
              ${formattedPrice}
            </span>
          </div>

          <!-- Specs List -->
          ${current.specs && current.specs.length > 0 ? `
            <div class="space-y-2">
              <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider">Características Principales:</h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                ${current.specs.map(spec => `
                  <div class="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-slate-200">
                    <span class="material-symbols-outlined text-red-500 text-[18px]">check_circle</span>
                    <span>${spec}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Indicator Dots -->
          <div class="flex items-center gap-2 pt-4">
            ${_kioskProducts.map((_, idx) => `
              <button data-kiosk-index="${idx}" class="h-2.5 rounded-full transition-all duration-300 ${idx === _currentIndex ? 'w-8 bg-red-500 shadow-md shadow-red-500/50' : 'w-2.5 bg-white/20 hover:bg-white/40'}"></button>
            `).join('')}
          </div>
        </div>

      </div>

      <!-- Bottom Controls -->
      <div class="flex items-center justify-between border-t border-white/10 pt-6">
        <button id="kiosk-prev-btn" class="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all border border-white/10 active:scale-95">
          <span class="material-symbols-outlined">arrow_back</span>
          <span>Anterior</span>
        </button>

        <span class="text-xs text-slate-400 font-semibold tracking-wider">
          Producto ${_currentIndex + 1} de ${_kioskProducts.length}
        </span>

        <button id="kiosk-next-btn" class="flex items-center gap-2 px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold transition-all shadow-lg shadow-red-600/30 active:scale-95">
          <span>Siguiente</span>
          <span class="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>

    </div>
  `;

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
    if (_kioskProducts.length > 0) {
      _currentIndex = (_currentIndex + 1) % _kioskProducts.length;
      const container = document.querySelector('[data-view="kiosk"]');
      if (container && window.location.hash === "#kiosk") {
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

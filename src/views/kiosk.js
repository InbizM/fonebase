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
      marca: p.marca || "Editorial",
      categoria: p.categoria || "Accesorio",
      precio: p.precioVenta,
      imagen: p.imagen,
      destacado: p.categoria === "Celulares" ? "LA COLECCIÓN EXCLUSIVA" : "EL DETALLE PERFECTO",
      subtitulo: "Diseño de vanguardia y rendimiento excepcional en cada línea.",
      specs: [p.color ? `Acabado ${p.color}` : null, p.ram ? `Rendimiento de ${p.ram} RAM` : null, p.memoria ? `Espacio: ${p.memoria}` : null].filter(Boolean)
    }));

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
}

function renderKioskUI(container) {
  const current = _kioskProducts[_currentIndex] || _kioskProducts[0];
  const formattedPrice = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(current.precio);

  // Layout inspirado en revistas de moda clásicas (Vogue / Harper's Bazaar) y editoriales de periódicos finos
  container.innerHTML = `
    <div class="fixed inset-0 z-50 bg-[#fbfbf9] text-[#1a1a1a] flex flex-col justify-between p-6 md:p-12 overflow-hidden select-none font-serif">
      
      <!-- Top Newspaper-Style Header Banner -->
      <div class="flex flex-col md:flex-row items-center justify-between border-b-2 border-[#1a1a1a] pb-6">
        <div class="text-center md:text-left">
          <p class="text-[10px] uppercase tracking-[0.3em] font-sans font-bold text-slate-500">Vol. III — Edición Especial de Tienda</p>
          <h2 class="text-4xl md:text-5xl tracking-normal font-black uppercase text-[#1a1a1a] mt-1" style="font-family: 'Cinzel', serif;">
            THE FONEBASE JOURNAL
          </h2>
        </div>

        <div class="flex items-center gap-4 mt-4 md:mt-0 font-sans">
          <button id="kiosk-pause-btn" class="flex items-center gap-2 px-5 py-2.5 rounded-none bg-transparent hover:bg-[#1a1a1a]/5 text-[#1a1a1a] text-xs font-black uppercase tracking-widest transition-all border border-[#1a1a1a]">
            <span class="material-symbols-outlined text-[16px]">${_isPaused ? 'play_arrow' : 'pause'}</span>
            <span>${_isPaused ? 'Reanudar' : 'Pausar'}</span>
          </button>
          
          <button id="kiosk-exit-btn" class="flex items-center gap-2 px-5 py-2.5 rounded-none bg-[#1a1a1a] hover:bg-red-800 text-white text-xs font-black uppercase tracking-widest transition-all border border-transparent shadow-md">
            <span class="material-symbols-outlined text-[16px]">logout</span>
            <span>Salir</span>
          </button>
        </div>
      </div>

      <!-- Main Newspaper Grid Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 my-auto items-center max-w-7xl mx-auto w-full">
        
        <!-- Left Section: Editorial Product Story & Specs -->
        <div class="lg:col-span-4 flex flex-col justify-center space-y-6 text-left border-r-0 lg:border-r border-[#1a1a1a]/20 lg:pr-8">
          <div>
            <span class="text-xs font-bold text-red-700 tracking-[0.2em] uppercase font-sans border-b-2 border-red-700 pb-1">${current.marca}</span>
            <p class="text-[11px] font-sans font-semibold tracking-wider text-slate-500 uppercase mt-4">${current.destacado}</p>
            <h1 class="text-3xl md:text-5xl font-normal text-[#1a1a1a] mt-2 tracking-tight leading-none" style="font-family: 'Playfair Display', serif;">
              ${current.nombre}
            </h1>
          </div>

          <p class="text-sm md:text-base text-slate-700 leading-relaxed italic" style="font-family: 'Playfair Display', serif;">
            "${current.subtitulo || 'La esencia de la tecnología y estética se fusionan para entregar una experiencia visual superior.'}"
          </p>

          <!-- Specifications Editorial Style -->
          ${current.specs && current.specs.length > 0 ? `
            <div class="space-y-3 pt-2">
              <h4 class="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] font-sans">Notas de la Colección</h4>
              <div class="space-y-2">
                ${current.specs.map(spec => `
                  <div class="flex items-center gap-2 text-xs text-[#1a1a1a] font-sans">
                    <span class="w-1.5 h-1.5 bg-[#1a1a1a] rounded-full"></span>
                    <span>${spec}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>

        <!-- Center Section: Elegant Image Canvas -->
        <div class="lg:col-span-5 flex justify-center items-center relative py-6">
          <div class="relative w-full max-w-[380px] h-[340px] md:h-[420px] rounded-none overflow-hidden bg-transparent border-t border-b border-[#1a1a1a] flex items-center justify-center p-4">
            <!-- Vintage Paper texture layer -->
            <div class="absolute inset-0 bg-[#f6f6f2] mix-blend-multiply opacity-80 pointer-events-none"></div>
            
            <img src="${current.imagen}" alt="${current.nombre}" class="w-full h-full object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.15)] transition-transform duration-700 ease-out hover:scale-105" />
          </div>
        </div>

        <!-- Right Section: Pricing and Editorial Ad Copy -->
        <div class="lg:col-span-3 flex flex-col justify-center space-y-6 lg:pl-4 text-center lg:text-left">
          <div class="border-t-2 border-b-2 border-[#1a1a1a] py-6">
            <span class="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] font-sans block mb-1">Precio Sugerido</span>
            <span class="text-4xl md:text-5xl font-black text-[#1a1a1a] tracking-tighter" style="font-family: 'Space Grotesk', sans-serif;">
              ${formattedPrice}
            </span>
          </div>

          <div class="space-y-2">
            <p class="text-[10px] font-sans font-bold uppercase tracking-widest text-slate-400">Certificación</p>
            <p class="text-xs text-slate-600 leading-normal" style="font-family: 'Playfair Display', serif;">
              Garantía extendida provista por el fabricante oficial. Soporte especializado directamente en tienda física.
            </p>
          </div>

          <!-- Indicator Dots -->
          <div class="flex items-center justify-center lg:justify-start gap-2 pt-4">
            ${_kioskProducts.map((_, idx) => `
              <button data-kiosk-index="${idx}" class="h-2 rounded-full transition-all duration-300 ${idx === _currentIndex ? 'w-8 bg-[#1a1a1a]' : 'w-2 bg-[#1a1a1a]/20 hover:bg-[#1a1a1a]/40'}"></button>
            `).join('')}
          </div>
        </div>

      </div>

      <!-- Bottom Newspaper Footer Info -->
      <div class="flex flex-col sm:flex-row items-center justify-between border-t border-[#1a1a1a]/20 pt-6">
        <button id="kiosk-prev-btn" class="flex items-center gap-2 px-5 py-2.5 rounded-none bg-transparent hover:bg-[#1a1a1a]/5 text-[#1a1a1a] text-xs font-black uppercase tracking-widest transition-all border border-[#1a1a1a] active:scale-95 font-sans">
          <span class="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Anterior</span>
        </button>

        <span class="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] font-sans mt-3 sm:mt-0">
          Exposición N° ${_currentIndex + 1} de ${_kioskProducts.length}
        </span>

        <button id="kiosk-next-btn" class="flex items-center gap-2 px-5 py-2.5 rounded-none bg-[#1a1a1a] hover:bg-[#1a1a1a]/90 text-white text-xs font-black uppercase tracking-widest transition-all shadow-md active:scale-95 font-sans">
          <span>Siguiente</span>
          <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      </div>

    </div>
  `;

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

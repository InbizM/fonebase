import "./style.css";

// Initialize theme from local storage
if (localStorage.getItem("adminpro_theme") === "dark") {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}


// Register Service Worker for PWA with auto-update detection
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/adminpro/sw.js', { scope: '/adminpro/' })
      .then(reg => {
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              showToast("Nueva versión disponible. Actualizando aplicación... 🔄", "success");
              setTimeout(() => {
                window.location.reload();
              }, 1500);
            }
          });
        });
      })
      .catch(err => {
        console.log('ServiceWorker registration failed: ', err);
      });
  });
}

import { navigate, registerView, onRouteChange, onBeforeRoute } from "./router.js";
import { initInventory } from "./views/inventory.js";
import { initDashboard } from "./views/dashboard.js";
import { initPOS } from "./views/pos.js";
import { initIMEI } from "./views/imei.js";
import { initClients } from "./views/clients.js";
import { initCredits } from "./views/credits.js";
import { initSalesHistory } from "./views/sales-history.js";
import { initTasks } from "./views/tasks.js";
import { initCalendar } from "./views/calendar.js";
import { initUsers } from "./views/users.js";
import { initReventas } from "./views/reventas.js";
import { initTechnical } from "./views/technical.js";
import { initExpenses } from "./views/expenses.js";
import { initNominas } from "./views/nominas.js";
import { initSettings } from "./views/settings.js";
import { showToast } from "./toast.js";
import { login, verifyPin, logout, setToken, getToken, getAjustesEmpresa } from "./api.js";

let _pendingEmail = "";
let _companySettings = null;

// ============================================================
// Physical Barcode Scanner Support
// ============================================================
let _barcodeBuffer = "";
let _barcodeTimer = null;

document.addEventListener("keydown", (e) => {
  // Ignorar atajos de teclado
  if (e.ctrlKey || e.altKey || e.metaKey) return;

  if (e.key === "Enter") {
    if (_barcodeBuffer.length >= 3) {
      const code = _barcodeBuffer;
      _barcodeBuffer = "";
      clearTimeout(_barcodeTimer);
      
      // Emitir evento global que las vistas pueden atrapar
      document.dispatchEvent(new CustomEvent('barcodeScanned', { detail: code }));
      
      // Evitar que el 'Enter' dispare envíos de formularios no deseados
      const activeTag = document.activeElement ? document.activeElement.tagName : "";
      if (activeTag !== "TEXTAREA") {
        e.preventDefault();
      }
      return;
    }
    _barcodeBuffer = ""; // Resetear en un Enter normal
  } else if (e.key && e.key.length === 1) {
    _barcodeBuffer += e.key;
    clearTimeout(_barcodeTimer);
    // Un lector físico lee muy rápido (ej. 10-30ms por carácter). 
    // Si pasan más de 50ms, asumimos que es una persona tipeando y reseteamos el buffer.
    _barcodeTimer = setTimeout(() => {
      _barcodeBuffer = "";
    }, 50);
  }
});

// ============================================================
// Session helpers
// ============================================================
function getSession() {
  try {
    const s = JSON.parse(localStorage.getItem("adminproSession") || "null");
    return s && Date.now() < s.expiresAt ? s : null;
  } catch { return null; }
}

function saveSession(data, token) {
  setToken(token);
  localStorage.setItem("adminproSession", JSON.stringify({
    ...data,
    token,
    expiresAt: Date.now() + 8 * 60 * 60 * 1000, // 8h
  }));
}

function clearSession() {
  setToken(null);
  localStorage.removeItem("adminproSession");
  localStorage.removeItem("adminpro_user");
}

// ============================================================
// Navigation Groups
// ============================================================
const NAV_GROUPS = [
  { label: "Inicio", items: [{ id: "dashboard", label: "Dashboard", icon: "dashboard", roles: ["Administrador", "Vendedor", "Técnico de reparación"] }] },
  {
    label: "Operaciones",
    items: [
      { id: "pos",           label: "Ventas (POS)",        icon: "point_of_sale", roles: ["Administrador", "Vendedor"] },
      { id: "sales-history", label: "Historial de Ventas", icon: "history",       roles: ["Administrador", "Vendedor"] },
      { id: "credits",       label: "Créditos",            icon: "credit_score",  roles: ["Administrador", "Vendedor"] },
      { id: "expenses",      label: "Egresos",             icon: "payments",      roles: ["Administrador"] },
      { id: "nominas",       label: "Nóminas",             icon: "request_quote", roles: ["Administrador"] }
    ]
  },
  {
    label: "Inventario",
    items: [
      { id: "inventory",     label: "Catálogo General",    icon: "inventory_2",   roles: ["Administrador", "Vendedor", "Técnico de reparación"] },
      { id: "imei",          label: "Equipos IMEI",        icon: "phone_android", roles: ["Administrador", "Vendedor"] },
      { id: "reventas",      label: "Reventas",            icon: "storefront",    roles: ["Administrador", "Vendedor"] }
    ]
  },
  { label: "Servicios", items: [{ id: "technical", label: "Servicio Técnico", icon: "build", roles: ["Administrador", "Técnico de reparación"] }] },
  {
    label: "Organización",
    items: [
      { id: "tasks",         label: "Lista de Tareas",     icon: "check_circle",   roles: ["Administrador", "Vendedor", "Técnico de reparación"] },
      { id: "calendar",      label: "Actividad",           icon: "history_toggle_off", roles: ["Administrador", "Vendedor", "Técnico de reparación"] }
    ]
  },
  {
    label: "Personas",
    items: [
      { id: "clients",       label: "Clientes",            icon: "people",          roles: ["Administrador", "Vendedor", "Técnico de reparación"] },
      { id: "users",         label: "Equipo / Usuarios",   icon: "manage_accounts", roles: ["Administrador"] }
    ]
  },
  { label: "Otros", items: [{ id: "settings", label: "Ajustes", icon: "settings", roles: ["Administrador", "Vendedor", "Técnico de reparación"] }] }
];

// ============================================================
// Mobile Menu Logic
// ============================================================
function toggleMobileMenu(open) {
  const drawer = document.getElementById("mobile-drawer");
  const backdrop = document.getElementById("mobile-drawer-backdrop");
  const content = document.getElementById("mobile-drawer-content");

  if (open) {
    drawer.classList.remove("hidden");
    setTimeout(() => {
      backdrop.classList.replace("opacity-0", "opacity-100");
      content.classList.replace("translate-y-full", "translate-y-0");
    }, 10);
  } else {
    backdrop.classList.replace("opacity-100", "opacity-0");
    content.classList.replace("translate-y-0", "translate-y-full");
    setTimeout(() => drawer.classList.add("hidden"), 300);
  }
}

function buildNavLinks(containerId, rol, mobile = false) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const userRol = rol || 'Vendedor';
  let html = "";

  if (mobile) {
    // Barra Inferior (Solo 5 iconos: 4 fijos + 1 de Menú)
    let primaryItems = [];
    if (userRol === 'Técnico de reparación') {
      primaryItems = [
        { id: "dashboard", label: "Home",     icon: "dashboard" },
        { id: "technical", label: "Reparar",  icon: "build" },
        { id: "inventory", label: "Stock",    icon: "inventory_2" },
        { id: "tasks",     label: "Tareas",   icon: "check_circle" }
      ];
    } else {
      primaryItems = [
        { id: "dashboard", label: "Home",     icon: "dashboard" },
        { id: "pos",       label: "Venta",    icon: "point_of_sale" },
        { id: "inventory", label: "Stock",    icon: "inventory_2" },
        { id: "tasks",     label: "Tareas",   icon: "check_circle" }
      ];
    }

    html = primaryItems.map(item => `
      <button data-nav="${item.id}" class="nav-btn flex flex-col items-center justify-center gap-0.5 py-2 w-full text-on-surface-variant hover:text-primary transition-colors">
        <span class="material-symbols-outlined text-[24px]">${item.icon}</span>
        <span class="text-[10px] font-bold tracking-tight">${item.label}</span>
      </button>
    `).join("");

    // Botón "MÁS" para abrir el Drawer
    html += `
      <button id="mobile-more-btn" class="flex flex-col items-center justify-center gap-0.5 py-2 w-full text-on-surface-variant hover:text-primary transition-colors">
        <span class="material-symbols-outlined text-[24px]">apps</span>
        <span class="text-[10px] font-bold tracking-tight">Más</span>
      </button>
    `;

    // Llenar el Drawer Grid con elementos agrupados por categoría (Rediseño con 3 grupos balanceados y color-code)
    const drawerGrid = document.getElementById("mobile-drawer-grid");
    if (drawerGrid) {
      const MOBILE_GROUPS = [
        {
          label: "Operaciones y Negocio",
          colorClass: "bg-red-50/70 text-primary",
          iconColor: "text-primary",
          items: [
            { id: "dashboard", label: "Dashboard", icon: "dashboard", roles: ["Administrador", "Vendedor", "Técnico de reparación"] },
            { id: "pos",           label: "Ventas (POS)",        icon: "point_of_sale", roles: ["Administrador", "Vendedor"] },
            { id: "sales-history", label: "Historial Ventas",   icon: "history",       roles: ["Administrador", "Vendedor"] },
            { id: "credits",       label: "Créditos",            icon: "credit_score",  roles: ["Administrador", "Vendedor"] },
            { id: "expenses",      label: "Egresos",             icon: "payments",      roles: ["Administrador"] },
            { id: "nominas",       label: "Nóminas",             icon: "request_quote", roles: ["Administrador"] }
          ]
        },
        {
          label: "Inventario y Soporte",
          colorClass: "bg-blue-50/70 text-blue-600",
          iconColor: "text-blue-600",
          items: [
            { id: "inventory",     label: "Catálogo General",    icon: "inventory_2",   roles: ["Administrador", "Vendedor", "Técnico de reparación"] },
            { id: "imei",          label: "Equipos IMEI",        icon: "phone_android", roles: ["Administrador", "Vendedor"] },
            { id: "reventas",      label: "Reventas",            icon: "storefront",    roles: ["Administrador", "Vendedor"] },
            { id: "technical",     label: "Servicio Técnico",    icon: "build",         roles: ["Administrador", "Técnico de reparación"] }
          ]
        },
        {
          label: "Equipo y Configuración",
          colorClass: "bg-purple-50/70 text-purple-600",
          iconColor: "text-purple-600",
          items: [
            { id: "tasks",         label: "Lista de Tareas",     icon: "check_circle",   roles: ["Administrador", "Vendedor", "Técnico de reparación"] },
            { id: "calendar",      label: "Actividad",           icon: "history_toggle_off", roles: ["Administrador", "Vendedor", "Técnico de reparación"] },
            { id: "clients",       label: "Clientes",            icon: "people",          roles: ["Administrador", "Vendedor", "Técnico de reparación"] },
            { id: "users",         label: "Equipo / Usuarios",   icon: "manage_accounts", roles: ["Administrador"] },
            { id: "settings",      label: "Ajustes",             icon: "settings",        roles: ["Administrador", "Vendedor", "Técnico de reparación"] }
          ]
        }
      ];

      drawerGrid.innerHTML = MOBILE_GROUPS.map(group => {
        const visibleItems = group.items.filter(item => !item.roles || item.roles.includes(userRol));
        if (visibleItems.length === 0) return "";
        
        return `
          <div class="mt-4 first:mt-0">
            <h4 class="text-[10px] font-black uppercase tracking-[0.2em] px-1 flex items-center gap-1.5 opacity-80 mb-2.5 ${group.iconColor}">
              <span class="w-1.5 h-1.5 rounded-full shrink-0 bg-current opacity-50"></span>
              ${group.label}
            </h4>
            <div class="grid grid-cols-3 gap-2.5">
              ${visibleItems.map(item => `
                <button data-nav="${item.id}"
                  class="bg-white rounded-2xl p-2.5 flex flex-col items-center gap-2
                         active:scale-95 transition-all duration-150 shadow-sm
                         border border-slate-100 hover:border-primary/20 hover:shadow-md group">
                  <div class="w-[50px] h-[50px] rounded-2xl ${group.colorClass} flex items-center justify-center
                              group-active:scale-90 transition-transform">
                    <span class="material-symbols-outlined text-[24px]"
                          style="font-variation-settings:'FILL' 1">${item.icon}</span>
                  </div>
                  <span class="text-[9px] font-extrabold text-slate-700 text-center leading-tight line-clamp-1 w-full">${item.label}</span>
                </button>
              `).join("")}
            </div>
          </div>
        `;
      }).join("");
    }
  } else {
    // Menú Desktop Grouped
    NAV_GROUPS.forEach(group => {
      const visibleItems = group.items.filter(item => !item.roles || item.roles.includes(userRol));
      if (visibleItems.length === 0) return;
      html += `<p class="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 mt-6 mb-2 px-4 italic">${group.label}</p>`;
      visibleItems.forEach(item => {
        html += `
          <button data-nav="${item.id}" class="nav-btn flex items-center gap-3 px-4 py-2.5 rounded-xl w-full text-left text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all duration-150 text-sm font-medium mb-0.5 group">
            <span class="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">${item.icon}</span>
            <span>${item.label}</span>
          </button>
        `;
      });
    });
  }

  container.innerHTML = html;

  // Event Listeners
  if (mobile) {
    document.getElementById("mobile-more-btn")?.addEventListener("click", () => toggleMobileMenu(true));
    document.getElementById("mobile-drawer-close")?.addEventListener("click", () => toggleMobileMenu(false));
    document.getElementById("mobile-drawer-backdrop")?.addEventListener("click", () => toggleMobileMenu(false));
    
    // Al elegir una opción del drawer, cerrar menú
    document.querySelectorAll("#mobile-drawer-grid [data-nav]").forEach(btn => {
      btn.addEventListener("click", () => {
        toggleMobileMenu(false);
        navigate(btn.dataset.nav);
      });
    });
  }

  container.querySelectorAll("[data-nav]").forEach(btn => {
    btn.addEventListener("click", () => navigate(btn.dataset.nav));
  });
}

function setActiveNav(viewId) {
  // Desktop highligh
  document.querySelectorAll("#desktop-nav [data-nav]").forEach(btn => {
    const active = btn.dataset.nav === viewId;
    btn.classList.toggle("bg-primary", active);
    btn.classList.toggle("text-white", active);
    btn.classList.toggle("shadow-lg", active);
    btn.classList.toggle("text-slate-400", !active);
  });
  
  // Mobile bar highlight
  document.querySelectorAll("#mobile-nav [data-nav]").forEach(btn => {
    const active = btn.dataset.nav === viewId;
    btn.classList.toggle("text-primary", active);
    btn.classList.toggle("text-on-surface-variant", !active);
  });
  
  // Header title update
  let label = "FoneBase";
  NAV_GROUPS.forEach(g => {
    const it = g.items.find(i => i.id === viewId);
    if (it) label = it.label;
  });
  const t = document.getElementById("header-title");
  if (t) t.textContent = label;
}

// ============================================================
// App Lifecycle
// ============================================================
function showApp(nombre, rol) {
  document.getElementById("login-screen").classList.add("hidden");
  document.getElementById("app-shell").classList.remove("hidden");
  const userEl = document.getElementById("user-name");
  if (userEl) userEl.textContent = nombre || "Usuario";

  buildNavLinks("desktop-nav", rol, false);
  buildNavLinks("mobile-nav",  rol, true);
  initNotifications();
  
  const userRol = rol || 'Vendedor';
  
  onBeforeRoute((viewId) => {
    let allowed = false;
    let found = false;
    NAV_GROUPS.forEach(g => {
      const it = g.items.find(i => i.id === viewId);
      if (it) {
        found = true;
        if (!it.roles || it.roles.includes(userRol)) allowed = true;
      }
    });
    // If it's a known restricted route and not allowed, block it.
    if (found && !allowed) {
      showToast("No tienes permiso para acceder a este módulo", "warning");
      return "dashboard"; // Redirect
    }
  });

  // Hide unauthorized dashboard shortcuts
  document.querySelectorAll("[data-goto]").forEach(btn => {
    const targetView = btn.dataset.goto;
    let allowed = false;
    NAV_GROUPS.forEach(g => {
      const it = g.items.find(i => i.id === targetView);
      if (it && (!it.roles || it.roles.includes(userRol))) allowed = true;
    });
    if (!allowed) {
      btn.classList.add("hidden");
      // Si es un div padre contenedor flex, también lo ocultamos si queremos, pero con hidden basta para el shortcut.
    } else {
      btn.classList.remove("hidden");
    }
  });

  onRouteChange(setActiveNav);

  registerView("inventory", initInventory());
  registerView("dashboard", initDashboard());
  registerView("pos", initPOS());
  registerView("imei", initIMEI());
  registerView("clients", initClients());
  registerView("credits", initCredits());
  registerView("sales-history", initSalesHistory());
  registerView("tasks", initTasks());
  registerView("calendar", initCalendar());
  registerView("users", initUsers());
  registerView("reventas", initReventas());
  registerView("technical", initTechnical());
  registerView("expenses", initExpenses());
  registerView("nominas", initNominas());
  registerView("settings", initSettings());

  const initialHash = window.location.hash.replace('#', '');
  navigate(initialHash || "dashboard");
}

function showStep(step) {
  const stepCredentials = document.getElementById("step-credentials");
  const stepPin = document.getElementById("step-pin");
  if (stepCredentials) stepCredentials.classList.toggle("hidden", step !== "credentials");
  if (stepPin) stepPin.classList.toggle("hidden", step !== "pin");
}

function showLoginScreen() {
  document.getElementById("app-shell").classList.add("hidden");
  document.getElementById("login-screen").classList.remove("hidden");
  showStep("credentials");
  resetLoginAvatar();
  
  // Cargar ajustes de la empresa al mostrar el login
  if (!_companySettings) {
    getAjustesEmpresa()
      .then(config => { _companySettings = config; })
      .catch(err => console.error("Error al pre-cargar ajustes:", err));
  }
}

function resetLoginAvatar() {
  const elAvatar = document.getElementById("login-user-avatar");
  const elName = document.getElementById("login-user-name");
  if (elAvatar) {
    elAvatar.innerHTML = `<span class="material-symbols-outlined text-red-600 text-4xl" style="font-variation-settings:'FILL' 1">shield_lock</span>`;
    elAvatar.className = "w-24 h-24 rounded-2xl bg-white border border-[#2c2c2e] flex items-center justify-center p-3.5 shadow-lg transition-all duration-300";
  }
  if (elName) {
    elName.textContent = "";
  }
}

async function handleLogout() {
  await logout();
  clearSession();
  showLoginScreen();
}

// ============================================================
// Events & Bootstrap
// ============================================================
window.addEventListener("session-expired", () => {
  clearSession();
  showLoginScreen();
});

document.getElementById("login-form")?.addEventListener("submit", handleLoginStep1);
document.getElementById("pin-form")?.addEventListener("submit", handlePinStep);
document.getElementById("back-to-login")?.addEventListener("click", () => {
  showStep("credentials");
  resetLoginAvatar();
});
document.getElementById("logout-btn")?.addEventListener("click", handleLogout);

async function handleLoginStep1(e) {
  e.preventDefault();
  const btn = document.getElementById("login-btn");
  const email = document.getElementById("login-email").value.trim();
  const pwd = document.getElementById("login-pwd").value.trim();
  btn.disabled = true; btn.textContent = "Verificando...";
  try {
    const res = await login(email, pwd);
    if (res.success) {
      _pendingEmail = email;
      
      const setupContainer = document.getElementById("totp-setup-container");
      const pinHint = document.getElementById("pin-hint");
      
      if (res.step === "setup-totp") {
        document.getElementById("totp-qr").src = res.qrCodeUrl;
        document.getElementById("totp-secret-text").textContent = res.secret;
        setupContainer.classList.remove("hidden");
        pinHint.textContent = "Escanea el código QR en tu app autenticadora e ingresa el código de 6 dígitos.";
      } else {
        setupContainer.classList.add("hidden");
        pinHint.textContent = "Ingresa el código de 6 dígitos de tu aplicación autenticadora.";
      }
      
      // Mostrar iniciales o logo de la empresa, y nombre del usuario
      const nombre = res.nombre || "Usuario";
      const initials = nombre.split(" ").filter(Boolean).map(n => n[0]).join("").substring(0, 2).toUpperCase();
      
      const elAvatar = document.getElementById("login-user-avatar");
      const elName = document.getElementById("login-user-name");
      
      if (elAvatar) {
        // Asegurar que estén cargados los ajustes
        if (!_companySettings) {
          try {
            _companySettings = await getAjustesEmpresa();
          } catch (err) {}
        }

        if (_companySettings?.logo) {
          elAvatar.innerHTML = `<img src="${_companySettings.logo}" class="max-h-full max-w-full object-contain" />`;
          elAvatar.className = "w-24 h-24 rounded-2xl bg-white border border-[#2c2c2e] flex items-center justify-center p-3.5 shadow-lg transition-all duration-300";
        } else {
          elAvatar.innerHTML = initials;
          const colors = [
            'bg-red-600/15 text-red-400 border-red-600/30',
            'bg-indigo-600/15 text-indigo-400 border-indigo-600/30',
            'bg-emerald-600/15 text-emerald-400 border-emerald-600/30',
            'bg-amber-600/15 text-amber-400 border-amber-600/30',
            'bg-purple-600/15 text-purple-400 border-purple-600/30',
            'bg-pink-600/15 text-pink-400 border-pink-600/30',
            'bg-sky-600/15 text-sky-400 border-sky-600/30'
          ];
          const colorIdx = (initials.charCodeAt(0) || 0) % colors.length;
          elAvatar.className = `w-24 h-24 rounded-2xl flex items-center justify-center font-black text-2xl select-none uppercase tracking-wider shadow-inner transition-all duration-300 ${colors[colorIdx]}`;
        }
      }
      
      if (elName) {
        elName.textContent = nombre;
      }
      
      showStep("pin");
      document.getElementById("login-pin").value = "";
      document.getElementById("login-pin").focus();
    } else { 
      showToast(res.mensaje || "Credenciales incorrectas", "error"); 
    }
  } catch (err) { 
    showToast("Error de conexión: " + err.message, "error"); 
  }
  finally { btn.disabled = false; btn.textContent = "Ingresar"; }
}

async function handlePinStep(e) {
  e.preventDefault();
  const btn = document.getElementById("pin-btn");
  const pin = document.getElementById("login-pin").value.trim();
  btn.disabled = true; btn.textContent = "Verificando...";
  try {
    const res = await verifyPin(_pendingEmail, pin);
    if (res.success && res.token) {
      saveSession({ email: res.email, nombre: res.nombre, rol: res.rol }, res.token);
      showApp(res.nombre, res.rol);
    } else { 
      showToast(res.mensaje || "Código de verificación incorrecto", "error"); 
    }
  } catch (err) { 
    showToast("Error de conexión: " + err.message, "error"); 
  }
  finally { btn.disabled = false; btn.textContent = "Verificar"; }
}

const session = getSession();
if (session && session.token && getToken()) {
  setToken(session.token);
  showApp(session.nombre, session.rol);
} else {
  clearSession();
  showLoginScreen();
}

// ============================================================
// Notifications / Alertas Logic
// ============================================================
async function initNotifications() {
  const btn = document.getElementById("header-notification-btn");
  const dropdown = document.getElementById("notifications-dropdown");

  if (!btn || !dropdown) return;

  // Toggle Dropdown
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdown.classList.toggle("hidden");
    loadNotificationsList();
  });

  document.addEventListener("click", () => {
    dropdown.classList.add("hidden");
  });

  dropdown.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  // Periodically check for alerts
  checkAlerts();
  setInterval(checkAlerts, 60000); // Check every minute
}

async function checkAlerts() {
  try {
    const { getDashboard } = await import("./api.js");
    const data = await getDashboard();
    
    const alerts = [];
    
    // 1. Stock critico
    if (data.productosBajoStock && data.productosBajoStock.length > 0) {
      data.productosBajoStock.forEach(p => {
        alerts.push({
          type: "stock",
          icon: "warning",
          color: "text-red-600 bg-red-50 border-red-100",
          title: `Stock bajo: ${p.nombre}`,
          desc: `Quedan ${p.stockActual} unidades (Mínimo: ${p.stock_minimo || 1})`
        });
      });
    }

    // 2. Ordenes en Mora/Vencidas
    const { getCreditos } = await import("./api.js");
    const creditos = await getCreditos();
    const creditosMora = creditos.filter(c => c.estado === "En Mora");
    creditosMora.forEach(c => {
      alerts.push({
        type: "credit",
        icon: "credit_card",
        color: "text-amber-600 bg-amber-50 border-amber-100",
        title: `Crédito vencido: ${c.cliente}`,
        desc: `Saldo pendiente: $${new Intl.NumberFormat("es-CO").format(c.saldo)}`
      });
    });

    // 3. Tareas pendientes para hoy o vencidas
    const { getTareas } = await import("./api.js");
    const tareas = await getTareas();
    const pendingTareas = tareas.filter(t => t.estado !== "Completada" && new Date(t.fecha_vencimiento) <= new Date());
    pendingTareas.forEach(t => {
      alerts.push({
        type: "task",
        icon: "check_circle",
        color: "text-blue-600 bg-blue-50 border-blue-100",
        title: `Tarea pendiente: ${t.tarea}`,
        desc: `Vence el ${new Date(t.fecha_vencimiento).toLocaleDateString()}`
      });
    });

    window._activeAlerts = alerts;

    const badge = document.getElementById("header-notification-badge");
    const countBadge = document.getElementById("notifications-count-badge");

    if (alerts.length > 0) {
      badge?.classList.remove("hidden");
      if (countBadge) countBadge.textContent = alerts.length;
    } else {
      badge?.classList.add("hidden");
      if (countBadge) countBadge.textContent = "0";
    }
  } catch (err) {
    console.error("Error loading alerts", err);
  }
}

function loadNotificationsList() {
  const list = document.getElementById("notifications-list");
  if (!list) return;

  const alerts = window._activeAlerts || [];
  if (alerts.length === 0) {
    list.innerHTML = `
      <div class="p-6 text-center text-xs text-slate-400 italic flex flex-col items-center gap-2">
        <span class="material-symbols-outlined text-2xl opacity-40">notifications_active</span>
        Sin notificaciones pendientes
      </div>
    `;
    return;
  }

  list.innerHTML = alerts.map(a => `
    <div class="p-3.5 flex gap-3 hover:bg-slate-50 transition-colors">
      <div class="w-8 h-8 rounded-xl flex items-center justify-center border shrink-0 ${a.color}">
        <span class="material-symbols-outlined text-[18px]">${a.icon}</span>
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-xs font-black text-slate-800 leading-snug truncate">${a.title}</p>
        <p class="text-[10px] text-slate-500 font-medium leading-normal mt-0.5">${a.desc}</p>
      </div>
    </div>
  `).join("");
}

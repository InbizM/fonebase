// toast.js — Beautiful in-app notification toasts

export function showToast(message, type = "success") {
  const borderColors = {
    success: "border-l-4 border-l-emerald-500",
    error: "border-l-4 border-l-rose-500",
    info: "border-l-4 border-l-sky-500",
    warning: "border-l-4 border-l-amber-500",
  };
  const iconColors = {
    success: "text-emerald-500",
    error: "text-rose-500",
    info: "text-sky-500",
    warning: "text-amber-500",
  };
  const icons = {
    success: "check_circle",
    error: "error",
    info: "info",
    warning: "warning",
  };

  const div = document.createElement("div");
  // En móviles: fijo arriba (top-4), centrado horizontal. En PC: abajo a la derecha (sm:bottom-4 sm:right-4).
  div.className = "fixed top-4 left-4 right-4 sm:top-auto sm:bottom-4 sm:left-auto sm:right-4 z-[9999] toast-animate flex justify-center sm:justify-end pointer-events-none";
  div.innerHTML = `
    <div class="flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-md text-white shadow-[0_12px_32px_rgba(0,0,0,0.15)] ${borderColors[type] || borderColors.success} w-full max-w-[340px] pointer-events-auto border border-white/5">
      <span class="material-symbols-outlined text-[20px] shrink-0 ${iconColors[type] || iconColors.success}" style="font-variation-settings:'FILL' 1">${icons[type] || icons.success}</span>
      <span class="flex-1 text-xs font-bold leading-normal text-slate-100">${message}</span>
      <button onclick="this.parentElement.parentElement.remove()" class="text-slate-400 hover:text-white transition-colors ml-1.5 shrink-0 flex items-center justify-center">
        <span class="material-symbols-outlined text-[16px]">close</span>
      </button>
    </div>
  `;
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 4000);
}

export function showConfirm(title, message, options = {}) {
  return new Promise((resolve) => {
    const modalId = `confirm-modal-${Date.now()}`;
    
    const overlay = document.createElement("div");
    overlay.id = modalId;
    overlay.className = "fixed inset-0 z-[99999] flex items-center justify-center p-4 transition-opacity duration-200 ease-out";
    
    overlay.innerHTML = `
      <!-- Backdrop -->
      <div id="${modalId}-backdrop" class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm opacity-0 transition-opacity duration-200 ease-out"></div>
      
      <!-- Modal Container -->
      <div id="${modalId}-container" class="relative bg-white dark:bg-slate-900 rounded-3xl w-full max-w-[320px] p-5 shadow-2xl z-10 transform scale-95 opacity-0 transition-all duration-200 ease-out flex flex-col border border-slate-100 dark:border-slate-800">
        <!-- Title -->
        <h3 class="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider mb-2">${title}</h3>
        <!-- Message -->
        <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed mb-6">${message}</p>
        
        <!-- Action Buttons -->
        <div class="flex gap-3 mt-auto">
          <button id="${modalId}-cancel" class="flex-1 py-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs rounded-xl border border-slate-200 dark:border-slate-700 transition-all active:scale-[0.98]">
            ${options.cancelText || "Cancelar"}
          </button>
          <button id="${modalId}-confirm" class="flex-1 py-3 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/50 text-primary dark:text-red-400 border border-red-200 dark:border-red-900/50 font-black text-xs rounded-xl transition-all active:scale-[0.98]">
            ${options.confirmText || "Aceptar"}
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(overlay);
    
    const backdrop = document.getElementById(`${modalId}-backdrop`);
    const container = document.getElementById(`${modalId}-container`);
    
    setTimeout(() => {
      if (backdrop) backdrop.classList.replace("opacity-0", "opacity-100");
      if (container) {
        container.classList.remove("scale-95", "opacity-0");
        container.classList.add("scale-100", "opacity-100");
      }
    }, 10);
    
    const cleanup = (result) => {
      if (backdrop) backdrop.classList.replace("opacity-100", "opacity-0");
      if (container) {
        container.classList.remove("scale-100", "opacity-100");
        container.classList.add("scale-95", "opacity-0");
      }
      overlay.classList.add("pointer-events-none");
      
      setTimeout(() => {
        document.body.removeChild(overlay);
        resolve(result);
      }, 200);
    };
    
    document.getElementById(`${modalId}-cancel`).addEventListener("click", () => cleanup(false));
    document.getElementById(`${modalId}-confirm`).addEventListener("click", () => cleanup(true));
  });
}

export function showPrompt(title, message, options = {}) {
  return new Promise((resolve) => {
    const modalId = `prompt-modal-${Date.now()}`;
    
    const overlay = document.createElement("div");
    overlay.id = modalId;
    overlay.className = "fixed inset-0 z-[99999] flex items-center justify-center p-4 transition-opacity duration-200 ease-out";
    
    overlay.innerHTML = `
      <!-- Backdrop -->
      <div id="${modalId}-backdrop" class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm opacity-0 transition-opacity duration-200 ease-out"></div>
      
      <!-- Modal Container -->
      <div id="${modalId}-container" class="relative bg-white dark:bg-slate-900 rounded-3xl w-full max-w-[320px] p-5 shadow-2xl z-10 transform scale-95 opacity-0 transition-all duration-200 ease-out flex flex-col border border-slate-100 dark:border-slate-800">
        <!-- Title -->
        <h3 class="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider mb-2">${title}</h3>
        <!-- Message -->
        <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed mb-4">${message}</p>
        
        <!-- Input field -->
        <input type="text" id="${modalId}-input" value="${options.defaultValue || ''}" placeholder="${options.placeholder || ''}"
          class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 mb-6" />
        
        <!-- Action Buttons -->
        <div class="flex gap-3 mt-auto">
          <button id="${modalId}-cancel" class="flex-1 py-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs rounded-xl border border-slate-200 dark:border-slate-700 transition-all active:scale-[0.98]">
            ${options.cancelText || "Cancelar"}
          </button>
          <button id="${modalId}-confirm" class="flex-1 py-3 bg-primary text-on-primary font-black text-xs rounded-xl transition-all active:scale-[0.98]">
            ${options.confirmText || "Aceptar"}
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(overlay);
    
    const backdrop = document.getElementById(`${modalId}-backdrop`);
    const container = document.getElementById(`${modalId}-container`);
    const input = document.getElementById(`${modalId}-input`);
    
    setTimeout(() => {
      if (backdrop) backdrop.classList.replace("opacity-0", "opacity-100");
      if (container) {
        container.classList.remove("scale-95", "opacity-0");
        container.classList.add("scale-100", "opacity-100");
        input?.focus();
      }
    }, 10);
    
    const cleanup = (resultValue) => {
      if (backdrop) backdrop.classList.replace("opacity-100", "opacity-0");
      if (container) {
        container.classList.remove("scale-100", "opacity-100");
        container.classList.add("scale-95", "opacity-0");
      }
      overlay.classList.add("pointer-events-none");
      
      setTimeout(() => {
        document.body.removeChild(overlay);
        resolve(resultValue);
      }, 200);
    };
    
    document.getElementById(`${modalId}-cancel`).addEventListener("click", () => cleanup(null));
    document.getElementById(`${modalId}-confirm`).addEventListener("click", () => {
      cleanup(input ? input.value : "");
    });
    
    input?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        cleanup(input.value);
      }
    });
  });
}

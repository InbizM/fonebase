// toast.js — Beautiful in-app notification toasts

export function showToast(message, type = "success") {
  const colors = {
    success: "bg-green-600",
    error: "bg-error",
    info: "bg-tertiary",
    warning: "bg-amber-500",
  };
  const icons = {
    success: "check_circle",
    error: "error",
    info: "info",
    warning: "warning",
  };

  const div = document.createElement("div");
  div.className = "fixed bottom-4 right-4 z-[9999] toast-animate";
  div.innerHTML = `
    <div class="flex items-center gap-3 px-5 py-3.5 rounded-xl text-white shadow-2xl ${colors[type] || colors.success} min-w-[280px] max-w-sm">
      <span class="material-symbols-outlined text-[20px]" style="font-variation-settings:'FILL' 1">${icons[type] || icons.success}</span>
      <span class="flex-1 text-sm font-semibold leading-tight">${message}</span>
      <button onclick="this.parentElement.parentElement.remove()" class="opacity-60 hover:opacity-100 transition-opacity ml-2">
        <span class="material-symbols-outlined text-[18px]">close</span>
      </button>
    </div>
  `;
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 4500);
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
      <div id="${modalId}-container" class="relative bg-white rounded-3xl w-full max-w-[320px] p-5 shadow-2xl z-10 transform scale-95 opacity-0 transition-all duration-200 ease-out flex flex-col border border-slate-100">
        <!-- Title -->
        <h3 class="text-sm font-black text-slate-800 uppercase tracking-wider mb-2">${title}</h3>
        <!-- Message -->
        <p class="text-xs font-semibold text-slate-500 leading-relaxed mb-6">${message}</p>
        
        <!-- Action Buttons -->
        <div class="flex gap-3 mt-auto">
          <button id="${modalId}-cancel" class="flex-1 py-3 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-xs rounded-xl border border-slate-200 transition-all active:scale-[0.98]">
            ${options.cancelText || "Cancelar"}
          </button>
          <button id="${modalId}-confirm" class="flex-1 py-3 bg-red-50 hover:bg-red-100 text-primary border border-red-200 font-black text-xs rounded-xl transition-all active:scale-[0.98]">
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

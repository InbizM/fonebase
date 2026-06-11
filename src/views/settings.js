import { logout, getAjustesEmpresa, saveAjustesEmpresa } from "../api.js";
import { showToast } from "../toast.js";

let _logoBase64 = "";

export function initSettings() {
  return () => {
    loadProfile();
    loadCompanySettings();
    setupEvents();
  };
}

function loadProfile() {
  const elAvatar = document.getElementById("set-avatar");
  const elName = document.getElementById("set-name");
  const elRole = document.getElementById("set-role");
  const elEmail = document.getElementById("set-email");

  try {
    const sessionJson = localStorage.getItem("adminproSession");
    const userJson = localStorage.getItem("adminpro_user");
    const user = sessionJson ? JSON.parse(sessionJson) : (userJson ? JSON.parse(userJson) : null);

    if (user) {
      if (elName) elName.textContent = user.nombre || "Usuario";
      if (elRole) elRole.textContent = user.rol || "Administrador";
      if (elEmail) elEmail.textContent = user.email || "No disponible";
      if (elAvatar) elAvatar.textContent = (user.nombre ? user.nombre.charAt(0) : "U").toUpperCase();
    }
  } catch (e) {
    console.error("Error loading profile", e);
  }

  const toggle = document.getElementById("set-theme-toggle");
  if (toggle) {
    toggle.checked = document.documentElement.classList.contains("dark");
  }
}

async function loadCompanySettings() {
  try {
    const config = await getAjustesEmpresa();
    if (config) {
      document.getElementById("set-store-nombre").value = config.nombre || "";
      document.getElementById("set-store-nit").value = config.nit || "";
      document.getElementById("set-store-propietario").value = config.propietario || "";
      document.getElementById("set-store-telefono").value = config.telefono || "";
      document.getElementById("set-store-direccion").value = config.direccion || "";
      document.getElementById("set-store-ciudad").value = config.ciudad || "";
      document.getElementById("set-store-correo").value = config.correo || "";
      document.getElementById("set-store-contacto").value = config.contacto || "";
      document.getElementById("set-store-condiciones").value = config.condiciones || "";
      
      const elImg = document.getElementById("set-store-logo-img");
      const elPlc = document.getElementById("set-store-logo-placeholder");
      if (config.logo) {
        _logoBase64 = config.logo;
        elImg.src = config.logo;
        elImg.classList.remove("hidden");
        elPlc.classList.add("hidden");
      } else {
        _logoBase64 = "";
        elImg.src = "";
        elImg.classList.add("hidden");
        elPlc.classList.remove("hidden");
      }
    }
  } catch (err) {
    console.error("Error al cargar datos del almacén:", err);
  }
}

function setupEvents() {
  const btnLogout = document.getElementById("set-logout-btn");
  if (btnLogout) {
    btnLogout.replaceWith(btnLogout.cloneNode(true));
  }
  document.getElementById("set-logout-btn")?.addEventListener("click", () => {
    if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
      logout();
    }
  });

  const toggle = document.getElementById("set-theme-toggle");
  if (toggle) {
    toggle.replaceWith(toggle.cloneNode(true));
  }
  document.getElementById("set-theme-toggle")?.addEventListener("change", (e) => {
    if (e.target.checked) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("adminpro_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("adminpro_theme", "light");
    }
  });

  // Evento del botón de subir logo
  const logoBtn = document.getElementById("set-store-logo-btn");
  const logoInput = document.getElementById("set-store-logo-file");
  const logoError = document.getElementById("set-store-logo-error");
  
  if (logoBtn) logoBtn.replaceWith(logoBtn.cloneNode(true));
  if (logoInput) logoInput.replaceWith(logoInput.cloneNode(true));
  
  const actualLogoBtn = document.getElementById("set-store-logo-btn");
  const actualLogoInput = document.getElementById("set-store-logo-file");
  const actualLogoError = document.getElementById("set-store-logo-error");

  actualLogoBtn?.addEventListener("click", () => actualLogoInput?.click());
  
  actualLogoInput?.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validar tipo de archivo (solo PNG)
    if (file.type !== "image/png") {
      actualLogoError.textContent = "Error: El archivo debe ser un formato PNG válido.";
      actualLogoError.classList.remove("hidden");
      actualLogoInput.value = "";
      return;
    }
    
    actualLogoError.classList.add("hidden");
    const reader = new FileReader();
    reader.onload = function(evt) {
      const dataUrl = evt.target.result;
      
      const img = new Image();
      img.src = dataUrl;
      img.onload = function() {
        const canvas = document.createElement("canvas");
        canvas.width = Math.min(img.width, 50);
        canvas.height = Math.min(img.height, 50);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let hasTransparency = false;
        for (let i = 3; i < imgData.length; i += 4) {
          if (imgData[i] < 255) {
            hasTransparency = true;
            break;
          }
        }
        
        if (!hasTransparency) {
          actualLogoError.textContent = "Error: La imagen debe tener fondo transparente (no se aceptan imágenes completamente opacas).";
          actualLogoError.classList.remove("hidden");
          actualLogoInput.value = "";
          return;
        }
        
        actualLogoError.classList.add("hidden");
        _logoBase64 = dataUrl;
        const elImg = document.getElementById("set-store-logo-img");
        const elPlc = document.getElementById("set-store-logo-placeholder");
        elImg.src = dataUrl;
        elImg.classList.remove("hidden");
        elPlc.classList.add("hidden");
      };
      img.onerror = function() {
        actualLogoError.textContent = "Error al procesar la imagen PNG.";
        actualLogoError.classList.remove("hidden");
        actualLogoInput.value = "";
      };
    };
    reader.readAsDataURL(file);
  });
  
  // Evento de guardado
  const form = document.getElementById("store-settings-form");
  if (form) form.replaceWith(form.cloneNode(true));
  const actualForm = document.getElementById("store-settings-form");
  
  actualForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const saveBtn = document.getElementById("set-store-save-btn");
    saveBtn.disabled = true;
    saveBtn.textContent = "Guardando...";
    
    const c = {
      nombre: document.getElementById("set-store-nombre").value.trim(),
      nit: document.getElementById("set-store-nit").value.trim(),
      propietario: document.getElementById("set-store-propietario").value.trim(),
      telefono: document.getElementById("set-store-telefono").value.trim(),
      direccion: document.getElementById("set-store-direccion").value.trim(),
      ciudad: document.getElementById("set-store-ciudad").value.trim(),
      contacto: document.getElementById("set-store-contacto").value.trim(),
      correo: document.getElementById("set-store-correo").value.trim(),
      condiciones: document.getElementById("set-store-condiciones").value.trim(),
      logo: _logoBase64
    };
    
    try {
      const res = await saveAjustesEmpresa(c);
      if (res && res[0] && res[0].type === "ok") {
        showToast("Datos de almacén guardados correctamente", "success");
      } else {
        showToast("Error al guardar en base de datos", "error");
      }
    } catch (err) {
      showToast("Error: " + err.message, "error");
    } finally {
      saveBtn.disabled = false;
      saveBtn.innerHTML = `<span class="material-symbols-outlined text-[18px]">save</span> Guardar Datos`;
    }
  });
  
  // Evento de previsualización
  const previewBtn = document.getElementById("set-store-preview-btn");
  if (previewBtn) previewBtn.replaceWith(previewBtn.cloneNode(true));
  const actualPreviewBtn = document.getElementById("set-store-preview-btn");
  
  const previewModal = document.getElementById("set-store-preview-modal");
  const previewClose = document.getElementById("set-store-preview-close");
  const previewCloseBg = document.getElementById("set-store-preview-close-bg");
  
  actualPreviewBtn?.addEventListener("click", () => {
    document.getElementById("preview-ticket-name").textContent = document.getElementById("set-store-nombre").value.trim() || "MI ALMACÉN";
    document.getElementById("preview-ticket-nit").textContent = document.getElementById("set-store-nit").value.trim() || "00000000";
    document.getElementById("preview-ticket-address").textContent = document.getElementById("set-store-direccion").value.trim() || "Calle ...";
    document.getElementById("preview-ticket-city").textContent = document.getElementById("set-store-ciudad").value.trim() || "Ciudad";
    document.getElementById("preview-ticket-tel").textContent = document.getElementById("set-store-telefono").value.trim() || "000";
    document.getElementById("preview-ticket-conditions").textContent = document.getElementById("set-store-condiciones").value.trim() || "Garantía...";
    
    const logoBox = document.getElementById("preview-ticket-logo-box");
    const logoImgBox = document.getElementById("preview-ticket-logo-img-box");
    const logoImg = document.getElementById("preview-ticket-logo-img");
    
    if (_logoBase64) {
      logoImg.src = _logoBase64;
      logoBox.classList.add("hidden");
      logoImgBox.classList.remove("hidden");
    } else {
      logoBox.classList.remove("hidden");
      logoImgBox.classList.add("hidden");
    }
    
    previewModal.classList.remove("hidden");
  });
  
  const closeModal = () => previewModal.classList.add("hidden");
  previewClose?.addEventListener("click", closeModal);
  previewCloseBg?.addEventListener("click", closeModal);
}

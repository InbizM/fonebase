import { logout, getAjustesEmpresa, saveAjustesEmpresa, queryTurso, mapArgs, crearNuevoLocal, getLocalesConfigurados } from "../api.js";
import { showToast, showConfirm, showPrompt } from "../toast.js";
import { printBluetoothTicket } from "../bluetooth-printer.js";

let _logoBase64 = "";

export function initSettings() {
  return () => {
    loadProfile();
    loadCompanySettings();
    loadAPISettings();
    setupEvents();
  };
}

function loadAPISettings() {
  const urlInput = document.getElementById("set-api-turso-url");
  const tokenInput = document.getElementById("set-api-turso-token");
  const orInput = document.getElementById("set-api-openrouter-key");

  if (urlInput) urlInput.value = localStorage.getItem("fonebase_custom_turso_url") || "";
  if (tokenInput) tokenInput.value = localStorage.getItem("fonebase_custom_turso_token") || "";
  if (orInput) orInput.value = localStorage.getItem("fonebase_custom_openrouter_key") || "";
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

      // RBAC en Ajustes
      const leftCol = document.getElementById("settings-left-col");
      const rightCol = document.getElementById("settings-right-col");
      if (user.rol !== "Administrador") {
        if (rightCol) rightCol.classList.add("hidden");
        if (leftCol) leftCol.className = "lg:col-span-12 space-y-6";
      } else {
        if (rightCol) rightCol.classList.remove("hidden");
        if (leftCol) leftCol.className = "lg:col-span-5 space-y-6";
      }
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
      
      const logoSize = config.logo_size || 40;
      const elSizeSlider = document.getElementById("set-store-logo-size");
      const elSizeVal = document.getElementById("set-store-logo-size-val");
      if (elSizeSlider) elSizeSlider.value = logoSize;
      if (elSizeVal) elSizeVal.textContent = logoSize + "px";
      
      const mostrarNombre = config.mostrar_nombre !== 0;
      const elMostrarNombre = document.getElementById("set-store-mostrar-nombre");
      if (elMostrarNombre) elMostrarNombre.checked = mostrarNombre;

      const elPaperFormat = document.getElementById("set-store-paper-format");
      if (elPaperFormat) elPaperFormat.value = localStorage.getItem("fonebase_paper_format") || "80mm";
      
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
  const addLocalBtn = document.getElementById("settings-add-local-btn");
  if (addLocalBtn) {
    addLocalBtn.replaceWith(addLocalBtn.cloneNode(true));
  }
  document.getElementById("settings-add-local-btn")?.addEventListener("click", async () => {
    const nombre = await showPrompt("Nueva Sucursal", "Ingrese el nombre de la nueva sucursal / local:");
    if (!nombre || !nombre.trim()) return;

    try {
      showToast("Creando sucursal...", "info");
      const newId = await crearNuevoLocal(nombre.trim());
      localStorage.setItem("fonebase_active_local_id", String(newId));
      showToast("Sucursal creada con éxito. Cargando datos...", "success");
      setTimeout(() => {
        location.reload();
      }, 1500);
    } catch (err) {
      showToast("Error al crear sucursal: " + err.message, "error");
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

  // Eventos de configuración del almacén (clonamos el formulario primero para limpiar listeners antiguos)
  const form = document.getElementById("store-settings-form");
  if (form) form.replaceWith(form.cloneNode(true));
  
  const actualForm = document.getElementById("store-settings-form");
  const actualLogoInput = document.getElementById("set-store-logo-file");
  const actualLogoError = document.getElementById("set-store-logo-error");
  
  const actualSizeSlider = document.getElementById("set-store-logo-size");
  const elSizeVal = document.getElementById("set-store-logo-size-val");
  actualSizeSlider?.addEventListener("input", (e) => {
    const val = e.target.value;
    if (elSizeVal) elSizeVal.textContent = val + "px";
  });

  // El click del botón se maneja de forma nativa mediante el atributo for del <label>
  
  actualLogoInput?.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validar tipo de archivo (cualquier imagen)
    if (!file.type.startsWith("image/")) {
      actualLogoError.textContent = "Error: El archivo seleccionado no es una imagen válida.";
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
        // Redimensionar el logotipo a un tamaño razonable (ej. máx 300px)
        // para evitar guardar un archivo base64 gigante en la base de datos
        const maxDim = 300;
        let width = img.width;
        let height = img.height;
        
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convertir a PNG para mantener la transparencia si existe
        const compressedDataUrl = canvas.toDataURL("image/png");
        
        _logoBase64 = compressedDataUrl;
        const elImg = document.getElementById("set-store-logo-img");
        const elPlc = document.getElementById("set-store-logo-placeholder");
        if (elImg) {
          elImg.src = compressedDataUrl;
          elImg.classList.remove("hidden");
        }
        if (elPlc) {
          elPlc.classList.add("hidden");
        }
        actualLogoError.classList.add("hidden");
      };
      img.onerror = function() {
        actualLogoError.textContent = "Error al procesar la imagen.";
        actualLogoError.classList.remove("hidden");
        actualLogoInput.value = "";
      };
    };
    reader.readAsDataURL(file);
  });
  
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
      logo: _logoBase64,
      logo_size: parseInt(document.getElementById("set-store-logo-size")?.value || "40", 10),
      mostrar_nombre: document.getElementById("set-store-mostrar-nombre")?.checked ? 1 : 0
    };
    
    try {
      const paperFormat = document.getElementById("set-store-paper-format")?.value || "80mm";
      localStorage.setItem("fonebase_paper_format", paperFormat);

      const res = await saveAjustesEmpresa(c);
      if (res && res.success) {
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
  
  // Evento de previsualización de factura
  const previewModal = document.getElementById("set-store-preview-modal");
  const previewClose = document.getElementById("set-store-preview-close");
  const previewCloseBg = document.getElementById("set-store-preview-close-bg");

  const openInvoicePreview = () => {
    try {
      const mostrarNombre = document.getElementById("set-store-mostrar-nombre")?.checked;
      const nameEl = document.getElementById("preview-ticket-name");
      if (nameEl) {
        if (mostrarNombre) {
          nameEl.textContent = document.getElementById("set-store-nombre")?.value.trim() || "MI ALMACÉN";
          nameEl.classList.remove("hidden");
        } else {
          nameEl.classList.add("hidden");
        }
      }

      const nitEl = document.getElementById("preview-ticket-nit");
      if (nitEl) nitEl.textContent = document.getElementById("set-store-nit")?.value.trim() || "900.123.456-1";

      const addrEl = document.getElementById("preview-ticket-address");
      if (addrEl) addrEl.textContent = document.getElementById("set-store-direccion")?.value.trim() || "Calle ...";

      const cityEl = document.getElementById("preview-ticket-city");
      if (cityEl) cityEl.textContent = document.getElementById("set-store-ciudad")?.value.trim() || "Ciudad";

      const telEl = document.getElementById("preview-ticket-tel");
      if (telEl) telEl.textContent = document.getElementById("set-store-telefono")?.value.trim() || "000";

      const condEl = document.getElementById("preview-ticket-conditions");
      if (condEl) condEl.textContent = document.getElementById("set-store-condiciones")?.value.trim() || "GARANTIA: Equipos probados y encendidos...";

      const logoBox = document.getElementById("preview-ticket-logo-box");
      const logoImgBox = document.getElementById("preview-ticket-logo-img-box");
      const logoImg = document.getElementById("preview-ticket-logo-img");

      if (_logoBase64 && logoImg) {
        logoImg.src = _logoBase64;
        const chosenHeight = parseInt(document.getElementById("set-store-logo-size")?.value || "40", 10);
        logoImg.style.width = "auto";
        logoImg.style.height = "auto";
        logoImg.style.maxHeight = chosenHeight + "px";
        logoImg.style.maxWidth = "100%";
        if (logoBox) logoBox.classList.add("hidden");
        if (logoImgBox) logoImgBox.classList.remove("hidden");
      } else {
        if (logoBox) logoBox.classList.remove("hidden");
        if (logoImgBox) logoImgBox.classList.add("hidden");
      }

      if (previewModal) {
        previewModal.classList.remove("hidden");
        previewModal.classList.add("flex");
      }
    } catch (err) {
      console.error("Error al previsualizar factura:", err);
    }
  };

  const previewBtn = document.getElementById("set-store-preview-btn");
  if (previewBtn) {
    previewBtn.replaceWith(previewBtn.cloneNode(true));
    document.getElementById("set-store-preview-btn")?.addEventListener("click", openInvoicePreview);
  }

  const topPreviewBtn = document.getElementById("set-store-top-preview-btn");
  if (topPreviewBtn) {
    topPreviewBtn.replaceWith(topPreviewBtn.cloneNode(true));
    document.getElementById("set-store-top-preview-btn")?.addEventListener("click", openInvoicePreview);
  }

  const closePreviewModal = () => {
    if (previewModal) {
      previewModal.classList.add("hidden");
      previewModal.classList.remove("flex");
    }
  };
  previewClose?.addEventListener("click", closePreviewModal);
  previewCloseBg?.addEventListener("click", closePreviewModal);

  const getSampleVentaData = () => {
    const nombre = document.getElementById("set-store-nombre")?.value.trim() || "MI NEGOCIO";
    const nit = document.getElementById("set-store-nit")?.value.trim() || "900.123.456-1";
    const direccion = document.getElementById("set-store-direccion")?.value.trim() || "Calle 123 No. 45 - 67";
    const ciudad = document.getElementById("set-store-ciudad")?.value.trim() || "Bogotá - Cundinamarca";
    const contacto = document.getElementById("set-store-telefono")?.value.trim() || "3001234567";
    const condiciones = document.getElementById("set-store-condiciones")?.value.trim() || "GARANTIA: Equipos probados y encendidos. Sin garantía en displays/táctiles o equipos apagados.";
    const mostrarNombre = document.getElementById("set-store-mostrar-nombre")?.checked !== false ? 1 : 0;
    const logoSize = parseInt(document.getElementById("set-store-logo-size")?.value || "40", 10);

    return {
      idFactura: "FAC-DEMO-001",
      fecha: new Date().toISOString(),
      cliente: "Juan Pérez (Cliente Prueba)",
      cedula: "1012345678",
      telefono: "3123456789",
      direccion: "Carrera 15 # 28 - 10",
      ciudad: ciudad,
      productoNombre: "1x Audífonos Inalámbricos Pro, 1x Cargador 20W",
      items: [
        { nombre: "Audífonos Inalámbricos Pro", qty: 1, precioVenta: 80000 },
        { nombre: "Cargador Carga Rápida 20W", qty: 1, precioVenta: 45000 }
      ],
      subtotal: 125000,
      descuento: 5000,
      total: 120000,
      metodo: "Efectivo",
      vendedor: "Administrador",
      tipoFactura: "digital",
      imeis: "N/A",
      emisor: {
        nombre,
        nit,
        direccion: `${direccion}, ${ciudad}`,
        contacto,
        condiciones,
        logo: _logoBase64,
        logo_size: logoSize,
        mostrar_nombre: mostrarNombre
      }
    };
  };

  const printBtBtn = document.getElementById("set-store-preview-print-bt");
  if (printBtBtn) {
    printBtBtn.replaceWith(printBtBtn.cloneNode(true));
    document.getElementById("set-store-preview-print-bt")?.addEventListener("click", async () => {
      try {
        showToast("Conectando a impresora Bluetooth...", "info");
        const sampleVenta = getSampleVentaData();
        await printBluetoothTicket(sampleVenta, null, null, sampleVenta.emisor);
        showToast("Impresión Bluetooth realizada", "success");
      } catch (err) {
        console.error("Error en impresión Bluetooth:", err);
        showToast("Error Bluetooth: " + err.message, "error");
      }
    });
  }

  const printLocalBtn = document.getElementById("set-store-preview-print-local");
  if (printLocalBtn) {
    printLocalBtn.replaceWith(printLocalBtn.cloneNode(true));
    document.getElementById("set-store-preview-print-local")?.addEventListener("click", () => {
      try {
        const sampleVenta = getSampleVentaData();
        const paperFormat = localStorage.getItem("fonebase_paper_format") || "80mm";
        const paperWidth = paperFormat === "58mm" ? "48mm" : "80mm";
        const em = sampleVenta.emisor;
        const now = new Date();
        const fechaStr = `${now.getDate()}/${now.getMonth()+1}/${now.getFullYear()} ${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')}`;

        const htmlContent = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <style>
                @page { size: ${paperWidth} auto; margin: 0; }
                html, body { width: ${paperWidth}; margin: 0; padding: 0; background: #fff; -webkit-print-color-adjust: exact; color-adjust: exact; }
                body { font-family: Arial, sans-serif; padding: 2mm; font-size: 10px; color: #000; line-height: 1.3; }
                .bold { font-weight: 900; }
                .center { text-align: center; }
                .flex-between { display: flex; justify-content: space-between; }
                .summary { background: #000; color: #fff; padding: 4px; border-radius: 4px; margin-top: 4px; }
              </style>
            </head>
            <body>
              ${em.logo ? `<div class="center" style="margin-bottom: 4px;"><img src="${em.logo}" style="max-height: ${em.logo_size || 40}px; max-width: 100%; object-fit: contain;"></div>` : ''}
              <div class="center" style="border: 1px solid #ccc; padding: 4px; margin-bottom: 4px; border-radius: 4px;">
                ${em.mostrar_nombre ? `<div class="bold" style="font-size: 12px; text-transform: uppercase;">${em.nombre}</div>` : ''}
                <div>NIT: ${em.nit}</div>
                <div>${em.direccion}</div>
                <div>Tel: ${em.contacto}</div>
              </div>
              <div style="border: 1px solid #ccc; padding: 4px; margin-bottom: 4px; border-radius: 4px;">
                <div class="bold" style="color: #dc2626; font-size: 11px;">COMPROBANTE PRUEBA</div>
                <div class="flex-between"><span class="bold">${sampleVenta.idFactura}</span><span class="bold" style="color: green;">PAGADO</span></div>
                <div class="flex-between"><span>${fechaStr}</span><span>Efectivo</span></div>
              </div>
              <div style="font-size: 9px; margin-bottom: 4px;">
                <div class="bold">CLIENTE: ${sampleVenta.cliente}</div>
                <div>ID: ${sampleVenta.cedula} | Tel: ${sampleVenta.telefono}</div>
              </div>
              <div class="bold" style="font-size: 9px; border-bottom: 1px solid #000; padding-bottom: 2px;">DETALLE DE PRODUCTOS</div>
              <table style="width: 100%; font-size: 9px; margin-top: 2px;">
                ${sampleVenta.items.map(i => `<tr><td>${i.qty}x ${i.nombre}</td><td style="text-align: right;" class="bold">$${new Intl.NumberFormat('es-CO').format(i.precioVenta)}</td></tr>`).join('')}
              </table>
              <div class="summary">
                <div class="flex-between"><span>Subtotal: $125.000</span><span>Descuento: -$5.000</span></div>
                <div class="flex-between bold" style="font-size: 12px; border-top: 1px solid #fff; pt-1; margin-top: 2px;"><span>TOTAL:</span><span>$120.000</span></div>
              </div>
              <div style="font-size: 7px; text-align: justify; margin-top: 6px; color: #444;">${em.condiciones}</div>
              <div class="center bold" style="margin-top: 6px; font-size: 10px;">¡GRACIAS POR SU COMPRA!</div>
            </body>
          </html>
        `;

        let iframe = document.getElementById("print-iframe");
        if (iframe) iframe.remove();
        iframe = document.createElement("iframe");
        iframe.id = "print-iframe";
        iframe.style.position = "absolute";
        iframe.style.width = "0px";
        iframe.style.height = "0px";
        iframe.style.border = "none";
        document.body.appendChild(iframe);

        const doc = iframe.contentWindow.document;
        doc.open();
        doc.write(htmlContent);
        doc.close();

        setTimeout(() => {
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
        }, 250);
      } catch (err) {
        console.error("Error al imprimir:", err);
        showToast("Error al imprimir: " + err.message, "error");
      }
    });
  }

  // ── AJUSTES DE CONECTIVIDAD Y APIS ──
  const apiForm = document.getElementById("api-settings-form");
  if (apiForm) apiForm.replaceWith(apiForm.cloneNode(true));
  const actualApiForm = document.getElementById("api-settings-form");

  actualApiForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const saveBtn = document.getElementById("set-api-save-btn");
    saveBtn.disabled = true;
    saveBtn.textContent = "Guardando...";

    const customUrl = document.getElementById("set-api-turso-url").value.trim();
    const customToken = document.getElementById("set-api-turso-token").value.trim();
    const customOrKey = document.getElementById("set-api-openrouter-key").value.trim();

    if (customUrl) {
      localStorage.setItem("fonebase_custom_turso_url", customUrl);
    } else {
      localStorage.removeItem("fonebase_custom_turso_url");
    }

    if (customToken) {
      localStorage.setItem("fonebase_custom_turso_token", customToken);
    } else {
      localStorage.removeItem("fonebase_custom_turso_token");
    }

    if (customOrKey) {
      localStorage.setItem("fonebase_custom_openrouter_key", customOrKey);
    } else {
      localStorage.removeItem("fonebase_custom_openrouter_key");
    }

    showToast("Ajustes de conexión guardados. Recargando aplicación...", "success");
    setTimeout(() => {
      location.reload();
    }, 1500);
  });

  // ── EXPORTACIÓN DE COPIA DE SEGURIDAD (JSON) ──
  const exportBtn = document.getElementById("set-backup-export-btn");
  if (exportBtn) exportBtn.replaceWith(exportBtn.cloneNode(true));
  const actualExportBtn = document.getElementById("set-backup-export-btn");

  actualExportBtn?.addEventListener("click", async () => {
    actualExportBtn.disabled = true;
    actualExportBtn.textContent = "Exportando...";
    try {
      const tables = [
        "usuarios", "clientes", "inventario", "equipos", "ventas",
        "egresos", "servicio_tecnico", "creditos", "reventas",
        "proveedores", "marcas_categorias", "vales_fisicos", "tareas",
        "nominas", "prestamos_empleados", "metas_financieras", "ajustes_empresa"
      ];
      const batchQueries = tables.map(name => `SELECT * FROM ${name}`);
      const results = await queryTurso(batchQueries);
      
      const dataToExport = {
        metadata: {
          fecha: new Date().toISOString(),
          origen: "FoneBase SQLite Cloud Backup",
          total_tablas: tables.length
        },
        tablas: {}
      };
      
      tables.forEach((name, idx) => {
        dataToExport.tablas[name] = results[idx] || [];
      });

      const fileName = `backup_fonebase_${new Date().toISOString().split('T')[0]}.json`;
      const fileContent = JSON.stringify(dataToExport, null, 2);

      if (navigator.share) {
        try {
          const file = new File([fileContent], fileName, { type: "application/json" });
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: "Copia de Seguridad FoneBase",
              text: "Respaldo completo de base de datos FoneBase en formato JSON."
            });
            showToast("Copia de seguridad compartida correctamente", "success");
            return;
          }
        } catch (shareErr) {
          console.warn("No se pudo compartir como archivo, intentando descarga estándar...", shareErr);
        }
      }

      const blob = new Blob([fileContent], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
      
      showToast("Copia de seguridad descargada correctamente", "success");
    } catch (err) {
      showToast("Error al exportar copia: " + err.message, "error");
    } finally {
      actualExportBtn.disabled = false;
      actualExportBtn.innerHTML = `<span class="material-symbols-outlined text-[18px] text-primary">download</span> Exportar JSON`;
    }
  });

  // ── RESTAURACIÓN DE COPIA DE SEGURIDAD (JSON) ──
  const importBtn = document.getElementById("set-backup-import-btn");
  const fileInput = document.getElementById("set-backup-file-input");

  if (importBtn) importBtn.replaceWith(importBtn.cloneNode(true));
  if (fileInput) fileInput.replaceWith(fileInput.cloneNode(true));

  const actualImportBtn = document.getElementById("set-backup-import-btn");
  const actualFileInput = document.getElementById("set-backup-file-input");

  actualImportBtn?.addEventListener("click", () => {
    actualFileInput?.click();
  });

  actualFileInput?.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const backupData = JSON.parse(evt.target.result);
        if (!backupData || !backupData.tablas) {
          throw new Error("El archivo de copia de seguridad no es válido o está corrupto.");
        }

        const confirm = await showConfirm(
          "Confirmación de Restauración",
          "Esta acción borrará TODOS los datos actuales del servidor y restaurará los del archivo seleccionado. ¿Estás seguro de que deseas proceder?"
        );

        if (!confirm) {
          actualFileInput.value = "";
          return;
        }

        actualImportBtn.disabled = true;
        actualImportBtn.textContent = "Restaurando...";

        const tables = Object.keys(backupData.tablas);
        showToast("Iniciando restauración de datos...", "info");

        // 1. Eliminar datos existentes en cada tabla
        const deleteQueries = tables.map(name => `DELETE FROM ${name}`);
        await queryTurso(deleteQueries, true);

        // 2. Insertar registros restaurados en lotes
        let totalInserted = 0;
        let insertQueriesBatch = [];

        for (const tableName of tables) {
          const rows = backupData.tablas[tableName];
          if (!Array.isArray(rows) || rows.length === 0) continue;

          const keys = Object.keys(rows[0]);
          const sql = `INSERT INTO ${tableName} (${keys.join(", ")}) VALUES (${keys.map(() => "?").join(", ")})`;

          for (const row of rows) {
            const values = keys.map(k => row[k]);
            insertQueriesBatch.push({
              sql,
              args: mapArgs(values)
            });

            if (insertQueriesBatch.length >= 150) {
              await queryTurso(insertQueriesBatch, true);
              totalInserted += insertQueriesBatch.length;
              insertQueriesBatch = [];
            }
          }
        }

        if (insertQueriesBatch.length > 0) {
          await queryTurso(insertQueriesBatch, true);
          totalInserted += insertQueriesBatch.length;
        }

        showToast(`Restauración exitosa: ${totalInserted} registros restaurados. Recargando...`, "success");
        setTimeout(() => {
          location.reload();
        }, 2000);

      } catch (err) {
        showToast("Error al restaurar copia: " + err.message, "error");
      } finally {
        actualImportBtn.disabled = false;
        actualImportBtn.innerHTML = `<span class="material-symbols-outlined text-[18px] text-primary">upload_file</span> Restaurar JSON`;
        actualFileInput.value = "";
      }
    };
    reader.readAsText(file);
  });
}

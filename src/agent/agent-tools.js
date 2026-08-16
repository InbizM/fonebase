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

// Función helper para pintar un formulario interactivo dentro de la burbuja del chat
// cuando faltan campos obligatorios.
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

    requiredFields.forEach(f => {
      const isMissing = missing.includes(f);
      const val = action[f.name] !== undefined && action[f.name] !== null ? action[f.name] : "";
      
      if (isMissing) {
        fieldsHtml += `
          <div>
            <label class="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">${f.label} *</label>
            <input type="${f.type === 'number' ? 'number' : 'text'}" data-field="${f.name}" placeholder="${f.placeholder}" class="w-full px-3 py-1.5 text-sm bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg focus:outline-none focus:border-primary text-slate-900 dark:text-white" required />
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

    // saveToStorage = false para que el formulario no persista en localStorage al recargar
    appendChatMessage("ai", null, fieldsHtml, null, false);
    return true; // Indica que se pintó el formulario
  }
  return false;
}

// ── EJECUTOR DE ACCIONES Y HERRAMIENTAS PARA EL AGENTE DE IA ──
export async function ejecutarAccionIA(action, base64Image = null, appendChatMessage) {
  if (!action || !action.type) return;

  // Preservar la imagen correcta en action según imagen_index (para múltiples fotos adjuntas)
  if (base64Image) {
    const imgArray = Array.isArray(base64Image) ? base64Image : [base64Image];
    const idx = (action.imagen_index !== undefined && action.imagen_index !== null)
      ? Number(action.imagen_index)
      : 0;
    const singleImg = imgArray[idx] || imgArray[0] || "";
    if (singleImg) {
      action.imagen = singleImg;
      action.foto_base64 = singleImg;
    }
  }

  // Interceptar appendChatMessage para que los logs del sistema ("system") se muestren como Toasts (notificaciones flotantes)
  // en lugar de contaminar el chat del usuario.
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
    originalAppend(role, text, html, ...rest);
  };

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
        const cleanName = finalProdName.toLowerCase().trim();
        const existingProd = inv.find(p => (p.nombre || "").toLowerCase().trim() === cleanName);
        
        if (existingProd) {
          productId = existingProd.id;
          appendChatMessage("system", `Plantilla existente encontrada: "${existingProd.nombre}"`);
          
          // Si la plantilla existente no tiene imagen y se cargó una nueva, guardarla
          const imgToSave = (Array.isArray(base64Image) ? base64Image[0] : base64Image) || action.imagen || "";
          if (imgToSave && (!existingProd.imagen || existingProd.imagen === "")) {
            appendChatMessage("system", `Guardando la imagen en la plantilla existente...`);
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
              imgToSave,
              existingProd.fijado || 0
            ]);
            existingProd.imagen = imgToSave;
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
        estado: action.estado || "Disponible"
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
    
    if (input.type === 'number' || input.dataset.type === 'number') {
      val = Number(val) || 0;
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
        estado: updatedData.estado || "Disponible"
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

      // Reemplazar toda la burbuja del chat (el padre del container) con el mensaje de éxito
      // para que desaparezca tanto el formulario como el título de advertencia.
      const bubble = container.closest('[data-chat-bubble]') || container.parentElement;
      if (bubble) {
        bubble.innerHTML = successMessageHtml || `
          <div class="mt-1 bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-xl border border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
            ✅ Registro completado exitosamente.
          </div>
        `;
      } else {
        container.outerHTML = successMessageHtml;
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

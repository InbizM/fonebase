import { getOpenRouterApiKey, getDashboard, getVendedores, getInventario, getEquipos, getClientes, getTareas } from "../api.js";

// ── AGENTE INTELIGENTE POR VOZ Y TEXTO (QWEN 3.7 FLASH VIA OPENROUTER) ──
export async function enviarComandoVozIA(instruccion, base64Image = null, historial = []) {
  const openRouterApiKey = getOpenRouterApiKey();
  const openRouterUrl = "https://openrouter.ai/api/v1/chat/completions";

  // ── Cargar datos del negocio en paralelo ──
  let ingresosHoy = 0, egresosHoy = 0, utilidad = 0, stockCritico = 0;
  let vendedores = [], inventario = [], equipos = [], clientes = [], tareas = [];

  await Promise.allSettled([
    getDashboard().then(d => {
      ingresosHoy = d.ingresosHoy || 0;
      egresosHoy = d.egresosHoy || 0;
      utilidad = d.utilidad || 0;
      stockCritico = d.stockCritico || 0;
    }),
    getVendedores().then(v => { vendedores = v || []; }),
    getInventario().then(i => { inventario = (i || []).slice(0, 30); }),
    getEquipos().then(e => { equipos = (e || []).slice(0, 20); }),
    getClientes().then(c => { clientes = (c || []).slice(0, 20); }),
    getTareas().then(t => { tareas = (t || []).slice(0, 10); }),
  ]);

  // Resumen legible del inventario para el prompt
  const inventarioResumen = inventario.map(p =>
    `• ID: ${p.id} | ${p.nombre} | Marca: ${p.marca || "Universal"} | Ref/SKU: ${p.sku || "N/A"} | Costo: $${p.costo || 0} | Venta: $${p.precio_venta ?? p.precioVenta ?? 0} | Stock: ${p.stock_actual ?? p.stockActual ?? 0}`
  ).join("\n") || "Sin datos de inventario";

  const equiposResumen = equipos.map(e =>
    `• ${e.nombre} ${e.marca || ""} | IMEI: ${e.imei1 || "N/A"} | Estado: ${e.estado || "?"} | Precio: $${e.venta ?? "?"}`
  ).join("\n") || "Sin equipos registrados";

  const clientesResumen = clientes.map(c =>
    `• ${c.nombre} | Tel: ${c.telefono || "N/A"} | Doc: ${c.cedula || "N/A"}`
  ).join("\n") || "Sin clientes";

  const tareasResumen = tareas.map(t =>
    `• [${t.prioridad || "Media"}] ${t.tarea} — Vence: ${t.fecha_vencimiento || "?"} — ${t.estado || "Pendiente"}`
  ).join("\n") || "Sin tareas pendientes";

  const systemPrompt = `
Eres FoneBase IA, el asistente inteligente de gestión de negocio para una tienda de celulares y tecnología.
Tienes acceso completo a los datos del negocio en tiempo real. Eres detallado, preciso y útil.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ REGLA ABSOLUTA — NUNCA INCUMPLIR:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROHIBIDO responder con frases genéricas vacías como:
- "He interpretado la instrucción del dispositivo exitosamente."
- "Listo." / "Entendido." / "Hecho."
- Cualquier respuesta que no detalle QUÉ se hizo o QUÉ se encontró.

OBLIGATORIO: Cuando ejecutes una acción, el campo "response" DEBE mencionar:
- Nombre exacto del item registrado/modificado
- Valores clave (precio, costo, IMEI, cantidad, nombre del cliente, etc.)
- Confirmación de lo que el sistema va a registrar

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 DATOS DEL NEGOCIO EN TIEMPO REAL:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Fecha/hora: ${new Date().toLocaleString('es-CO')}
Ventas hoy: $${ingresosHoy.toLocaleString('es-CO')}
Egresos hoy: $${egresosHoy.toLocaleString('es-CO')}
Utilidad hoy: $${utilidad.toLocaleString('es-CO')}
Stock crítico (productos bajo mínimo): ${stockCritico}
Equipo/Vendedores: ${vendedores.map(v => v.nombre).join(', ') || "Ninguno"}

📦 INVENTARIO ACTUAL (top 30):
${inventarioResumen}

📱 EQUIPOS CON IMEI (top 20):
${equiposResumen}

👥 CLIENTES (top 20):
${clientesResumen}

✅ TAREAS PENDIENTES:
${tareasResumen}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 INSTRUCCIONES DE RECONOCIMIENTO Y ASOCIACIÓN:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IMEI: Siempre 15 dígitos numéricos. IMEI1 = principal, IMEI2 = secundario.
No confundir con S/N (contiene letras) ni FCC ID.

MEMORIA: Formato "128+4GB" o "4GB RAM / 128GB ROM":
- Número menor = RAM (ej: "4GB")  
- Número mayor = almacenamiento/ROM (ej: "128GB")

COLOR: Identifica colores en español e inglés en etiquetas.

REFERENCIAS TÉCNICAS Y NOMBRES DE CELULARES:
- En cajas y etiquetas de celulares, identifica SIEMPRE el **Nombre Comercial** y el **Código de Modelo / Referencia** (ej: "KN3" es "Tecno Spark Go 3 (KN3)", "KL7" es "Tecno Spark 30 Pro (KL7)", "A35e" es "ZTE Blade A35e", "A175F" o "A17" es "Samsung Galaxy A17", "A075M" o "A07" es "Samsung Galaxy A07", etc.).
- Incluye SIEMPRE el código de referencia en el campo "sku" (ej: "sku": "KN3", "sku": "A175F").
- Nombra el producto/equipo incluyendo su referencia técnica entre paréntesis (ej: "nombre": "Samsung Galaxy A17 (A175F)").

VINCULACIÓN OBLIGATORIA CON PRECIOS DE INVENTARIO EXISTENTE:
- Cuando el usuario solicite registrar equipos, celulares o IMEIs (por foto o texto), revisa SIEMPRE si el producto o modelo ya existe en la lista de "📦 INVENTARIO ACTUAL".
- SI EL PRODUCTO YA EXISTE EN EL INVENTARIO:
  * HEREDA AUTOMÁTICAMENTE el "costo" y el "precio_venta" registrados en el inventario.
  * ASIGNA "id_producto" con el ID del producto (ej: "PROD-...").
  * NUNCA asignes "costo": 0 ni "venta": 0 cuando el producto ya existe en inventario con precios definidos.
  * En "response", confirma con claridad que los equipos fueron asociados al producto del inventario con sus precios ya establecidos.
- SI EL PRODUCTO ES NUEVO (NO está en el inventario):
  * Si el usuario indicó un precio en su mensaje, tómalo como el costo de compra y calcula venta (+20%).
  * Si no indicó ningún precio y el producto no existe en inventario, deja costo: 0 para que el asistente solicite el costo de compra.

REGISTRO POR IMAGEN Y DATOS FALTANTES:
- Si hay IMEI visible en imagen → acción "crear_equipo"
- Si hay modelo/specs pero sin IMEI → acción "crear_producto"
- MÚLTIPLES PRODUCTOS EN IMÁGENES: Si detectas varios productos en las imágenes (o varias imágenes de diferentes celulares/productos), DEBES retornar en el JSON el campo "actions": [ { ...acción 1... }, { ...acción 2... }, ... ] con una acción para CADA producto. Cada acción debe incluir su campo "imagen_index" (0 para la 1ra foto, 1 para la 2da, 2 para la 3ra, etc.), nombre exacto con referencia, marca, sku, ram, memoria, color e IMEI si está visible. Si conoces el costo (por el inventario o mensaje), asígnalo a todos.
- CAMPO imagen_index: Cuando el usuario envía varias imágenes, DEBES incluir en cada acción el campo "imagen_index" con el número (0-based) de la imagen que corresponde al producto que estás registrando. Ejemplo: si el producto está en la 2ª imagen enviada, usa "imagen_index": 1. Esto permite al sistema guardar la foto correcta para cada producto.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 ACCIONES DISPONIBLES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Registrar egreso:
{"response":"✅ Registré un egreso de $15.000 por concepto de 'Papelería' en categoría Suministros.","action":{"type":"registrar_egreso","categoria":"Suministros","concepto":"Papelería","responsable":"Juan","monto":15000}}

2. Crear tarea:
{"response":"📌 Creé la tarea 'Revisar inventario' con prioridad Alta, vence el 2026-08-20, asignada a Carlos.","action":{"type":"crear_tarea","tarea":"Revisar inventario","fecha_inicio":"2026-08-14","fecha_vencimiento":"2026-08-20","prioridad":"Alta","responsable":"Carlos","notes":"","color":"#ef4444"}}

3. Buscar cliente:
{"response":"Buscando cliente con nombre o documento 'García'...","action":{"type":"buscar_cliente","query":"García"}}

4. Navegar a sección:
{"response":"Voy a llevarte a Inventario ahora mismo.","action":{"type":"ir_a","destino":"inventory"}}

5. Crear cliente (Cédula y Dirección son OBLIGATORIOS. Si el usuario no los indica, deja "cedula" y/or "direccion" vacíos o null; NO los inventes):
{"response":"✅ Registré al cliente Juan García, cédula 123456, teléfono 3001234567.","action":{"type":"crear_cliente","cedula":"123456","nombre":"Juan García","telefono":"3001234567","direccion":"Calle 5 #10","email":"","tipo":"Natural"}}

6. Crear producto en inventario (incluye imagen_index: índice 0-based de qué imagen adjunta corresponde a este producto):
{"response":"✅ Agregué al inventario: Samsung A15 128GB/4GB RAM, color Negro. Precio venta: $650.000, costo: $480.000, stock inicial: 3 unidades.","action":{"type":"crear_producto","imagen_index":0,"nombre":"Samsung A15","marca":"Samsung","categoria":"Celulares","tipo":"Físico","costo":480000,"precioVenta":650000,"stockMinimo":2,"stockActual":3,"ubicacion":"Vitrina A","sku":"","ram":"4GB","memoria":"128GB","color":"Negro"}}

7. Registrar equipo con IMEI (incluye imagen_index: índice 0-based de qué imagen adjunta corresponde a este equipo):
{"response":"✅ Registré el equipo Samsung A15 128GB/4GB RAM color Negro. IMEI1: 356251200774692, IMEI2: 356251200774700. Costo: $480.000, precio venta: $650.000.","action":{"type":"crear_equipo","imagen_index":0,"imei1":"356251200774692","imei2":"356251200774700","marca":"Samsung","nombre":"Samsung A15","proveedor":"Proveedor X","costo":480000,"venta":650000,"estado":"Disponible","color":"Negro","ram":"4GB","memoria":"128GB","condicion":"Nuevo","notas":""}}

8. Servicio técnico:
{"response":"✅ Abrí orden de servicio técnico para Pedro Pérez. Equipo: iPhone 13 (IMEI: 123456789012345), falla: 'Pantalla rota'. Abono: $30.000, precio final: $150.000.","action":{"type":"crear_servicio_tecnico","cliente":"Pedro Pérez","telefono":"3109876543","equipo":"iPhone 13","imei_serie":"123456789012345","falla":"Pantalla rota","clave_patron":"","repuestos":"Display iPhone 13","costo_taller":80000,"abono":30000,"precio_final":150000,"estado":"Recibido"}}

9. Registrar crédito:
{"response":"✅ Registré un crédito de $120.000 a nombre de María López por 'compra de cargador inalámbrico a cuotas'.","action":{"type":"crear_credito","cliente":"María López","telefono":"3201234567","total":120000,"detalle":"Compra de cargador inalámbrico a cuotas"}}

10. Vale físico:
{"response":"✅ Creé un vale físico por 1 unidad de 'Cargador 65W' por $45.000 a nombre de Carlos (vendedor).","action":{"type":"crear_vale_fisico","cliente":"Carlos","producto":"Cargador 65W","cantidad":1,"monto":45000,"estado":"Pendiente"}}

11. Reventa:
{"response":"✅ Registré reventa rápida: Auriculares Bluetooth, costo $35.000, precio venta $60.000, proveedor: Distribuidora Norte.","action":{"type":"crear_reventa","producto":"Auriculares Bluetooth","categoria":"Accesorios","costo":35000,"precio":60000,"proveedor":"Distribuidora Norte"}}

12. Crear préstamo o adelanto a empleado (nómina):
{"response":"✅ Registré un préstamo de $100.000 para el empleado Johan.","action":{"type":"crear_prestamo","empleado":"Johan","monto":100000,"tipo_prestamo":"Dinero","notas":"Préstamo solicitado por el empleado"}}

13. Registrar múltiples celulares / IMEIs con precio indicado por el usuario (ej: "registra estos imei todo tiene un precio de 330000"):
{"response":"✅ Registré con éxito los 2 equipos Tecno KN3 a costo $330.000 y venta $396.000.","actions":[{"type":"crear_equipo","imagen_index":0,"nombre":"Tecno KN3","marca":"Tecno","imei1":"356251200774692","imei2":"356251207450635","color":"In Black","ram":"4GB","memoria":"128GB","costo":330000,"venta":396000,"estado":"Disponible"},{"type":"crear_equipo","imagen_index":1,"nombre":"Tecno KN3","marca":"Tecno","imei1":"356251200227980","imei2":"356251209337434","color":"Titanium Grey","ram":"4GB","memoria":"128GB","costo":330000,"venta":396000,"estado":"Disponible"}]}

14. Registrar múltiples productos de imágenes sin precio (para que el usuario complete en el asistente):
{"response":"Identifiqué 2 celulares en las imágenes:\n- **Redmi 15C** (128GB ROM / 8GB RAM, Azul)\n- **Tecno Pova Curve 2** (128GB ROM / 8GB RAM, Negro)\n\nPor favor completa los costos en el asistente:","actions":[{"type":"crear_equipo","imagen_index":0,"nombre":"Redmi 15C","marca":"Xiaomi","ram":"8GB","memoria":"128GB","color":"Azul","costo":0,"venta":0},{"type":"crear_equipo","imagen_index":1,"nombre":"Tecno Pova Curve 2","marca":"Tecno","ram":"8GB","memoria":"128GB","color":"Negro","costo":0,"venta":0}]}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 RESPUESTAS DE CONSULTA (action = null):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Cuando el usuario pregunta sobre datos del negocio, usa los datos reales del contexto.
Ejemplo: {"response":"Hoy llevas $320.000 en ventas, $45.000 en egresos, dejando una utilidad de $275.000. Tienes 3 productos con stock crítico.","action":null}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ FORMATO DE SALIDA:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Responde ÚNICAMENTE con JSON válido parseable con JSON.parse().
- NO uses bloques markdown (\`\`\`json).
- El campo "response" es OBLIGATORIO y debe ser ESPECÍFICO con los datos registrados.
- SIEMPRE incluye el array "actions" con CADA uno de los celulares/productos a registrar. Sin "actions", los productos NO se guardan en la base de datos.
- El sistema SÍ soporta y asocia automáticamente las fotos/imágenes que adjunte el usuario. NO le digas al usuario que el sistema no soporta imágenes.
- Organiza la respuesta del campo "response" usando Markdown legible (usa listas con viñetas "- ", negritas "**", títulos, etc.).
- Si no entiendes la petición, responde: {"response":"No entendí tu instrucción. Puedo registrar equipos, productos, clientes, gastos, servicios técnicos, tareas, metas, créditos, reventas y préstamos a empleados. ¿Qué necesitas?","action":null}
`;

  let instruccionFinal = instruccion || "¿Cuál es el estado del negocio hoy?";
  let userContent = instruccionFinal;
  if (base64Image) {
    const imagesArray = Array.isArray(base64Image) ? base64Image : [base64Image];
    const instruccionLower = (instruccion || "").toLowerCase();
    const msgLen = (instruccion || "").trim().length;

    // REGLA: Si hay imágenes y el texto es corto O menciona imei/agrega/registra/equipo → modo registro IMEI
    const isImeiIntent = (
      msgLen < 120 &&
      (
        instruccionLower.includes("imei") ||
        instruccionLower.includes("agrega") ||
        instruccionLower.includes("registra") ||
        instruccionLower.includes("añade") ||
        instruccionLower.includes("estos") ||
        instruccionLower.includes("esto") ||
        instruccionLower.includes("equipo") ||
        instruccionLower.includes("celular") ||
        instruccionLower.includes("etiqueta") ||
        instruccionLower.includes("los") ||
        instruccionLower.includes("foto")
      )
    ) || msgLen < 30; // Cualquier mensaje muy corto con imágenes → IMEI intent

    instruccionFinal = isImeiIntent
      ? `${instruccion || ""}. INSTRUCCIÓN PRINCIPAL: Analiza TODAS las imágenes adjuntas. En cada imagen busca y lee los códigos IMEI (números de 15 dígitos). Para cada equipo detectado, genera una acción crear_equipo con: imei1 (IMEI principal), nombre del modelo (ej: Samsung Galaxy A17), marca, ram, memoria, color. Si el modelo ya existe en el inventario con su ID y precio, usa esos datos. Si no hay precio, deja costo: 0.`
      : instruccion || "Analiza esta imagen y registra lo que encuentres.";

    userContent = [
      { type: "text", text: instruccionFinal }
    ];
    imagesArray.forEach(img => {
      if (img) {
        userContent.push({
          type: "image_url",
          image_url: { url: img.startsWith("data:") ? img : `data:image/jpeg;base64,${img}` }
        });
      }
    });
  }

  const historyMessages = [];
  if (historial && historial.length > 0) {
    historial.slice(-8).forEach(msg => {
      if (msg.sender === "user") {
        let content = msg.text || "Procesa la imagen.";
        if (msg.base64Image) {
          const imgs = Array.isArray(msg.base64Image) ? msg.base64Image : [msg.base64Image];
          content = [{ type: "text", text: msg.text || "Analiza estas imágenes." }];
          imgs.forEach(img => {
            if (img) content.push({ type: "image_url", image_url: { url: img.startsWith("data:") ? img : `data:image/jpeg;base64,${img}` } });
          });
        }
        historyMessages.push({ role: "user", content });
      } else if (msg.sender === "ai") {
        historyMessages.push({ role: "assistant", content: msg.text || "" });
      }
    });
  }

  try {
    const keyPreview = openRouterApiKey ? openRouterApiKey.slice(0, 12) + "..." : "(vacía)";
    console.log(`[IA] → OpenRouter | Modelo: google/gemini-2.5-flash-lite | Key: ${keyPreview}`);
    console.log(`[IA] → Instrucción: "${instruccion?.slice(0, 100)}"`);

    const response = await fetch(openRouterUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openRouterApiKey}`,
        "HTTP-Referer": "https://inbizm.github.io/fonebase/",
        "X-Title": "FoneBase IA"
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          { role: "system", content: systemPrompt },
          ...historyMessages,
          { role: "user", content: userContent }
        ],
        temperature: 0.2,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      let errorBody = "";
      try { errorBody = await response.text(); } catch (_) {}
      console.error(`[IA] Error HTTP ${response.status}:`, errorBody);
      throw new Error(`Error del servidor IA (${response.status}): ${errorBody.slice(0, 200)}`);
    }

    const data = await response.json();
    const messageObj = data.choices?.[0]?.message || {};
    let text = (messageObj.content || messageObj.reasoning || "").trim();
    console.log("[IA] ← Respuesta cruda:", text.slice(0, 500));

    // ── PARSEO Y REPARACIÓN ROBUSTA DE JSON EN 3 NIVELES ──
    const parsedResult = cleanAndParseAgentJSON(text);
    if (parsedResult) {
      return parsedResult;
    }

    // Si la respuesta es texto plano conversacional normal sin formato JSON
    if (text && text.trim().length > 0 && !text.trim().startsWith("{")) {
      // Si el usuario envió imágenes con intent de IMEI y el modelo no devolvió JSON, devolver fallback útil
      if (base64Image && instruccionFinal && instruccionFinal.includes("IMEI")) {
        return {
          response: "📷 Vi las imágenes pero el modelo no pudo extraer los IMEIs automáticamente.\n\nPor favor escribe los IMEIs manualmente, por ejemplo:\n**\"registra IMEI 356482402015899, Samsung Galaxy A17, 4GB RAM, 64GB, Negro\"**",
          action: null
        };
      }
      return {
        response: text,
        action: null
      };
    }

    // Fallback de error
    return {
      response: base64Image
        ? "📷 Vi tus imágenes pero no pude leer los IMEIs automáticamente. Escribe los datos del equipo o el IMEI directamente en el chat."
        : "⚠️ No se pudo procesar tu instrucción. Asegúrate de indicar la acción de forma clara (ej: 'registra un egreso de...', 'agrega estos equipos con IMEI').",
      action: null
    };
  } catch (e) {
    console.error("[IA] Error al procesar:", e);
    return {
      response: `⚠️ No pude procesar tu solicitud. Error: ${e.message}`,
      action: null
    };
  }
}

function extractEquiposFromTextFallback(text) {
  if (!text || typeof text !== "string") return [];
  const lines = text.split("\n");
  const extracted = [];

  let globalCosto = 0;
  let globalVenta = 0;
  const costoMatch = text.match(/costo\s*(?:de)?\s*\$?([\d.,]+)/i);
  if (costoMatch) globalCosto = Number(costoMatch[1].replace(/\D/g, "")) || 0;

  const ventaMatch = text.match(/venta\s*(?:sugerido|de)?\s*\$?([\d.,]+)/i);
  if (ventaMatch) globalVenta = Number(ventaMatch[1].replace(/\D/g, "")) || 0;

  if (globalCosto > 0 && globalVenta === 0) {
    globalVenta = Math.ceil((globalCosto * 1.20) / 1000) * 1000;
  }

  const modelMatch = text.match(/equipos?\s+([A-Za-z0-9\s]+?)(?:\s*\(|\s*con|\s*,|\s*\.|\s*a\s+costo)/i);
  const globalModel = modelMatch ? modelMatch[1].trim() : "Celular";

  const romMatch = text.match(/(\d+\s*GB|\d+\s*TB)\s*(?:ROM|almacenamiento)?/i);
  const ramMatch = text.match(/(\d+\s*GB)\s*RAM/i);

  lines.forEach((line, idx) => {
    const imei1Match = line.match(/IMEI(?:1)?:\s*(\d{14,16})/i);
    if (imei1Match) {
      const imei1 = imei1Match[1];
      const imei2Match = line.match(/IMEI2:\s*(\d{14,16})/i);
      const imei2 = imei2Match ? imei2Match[1] : "";

      const colorMatch = line.match(/color\s+([A-Za-z0-9\s]+?)(?:,|\s*IMEI|\s*$)/i);
      const color = colorMatch ? colorMatch[1].trim() : "";

      const specificModelMatch = line.match(/(?:Equipo\s*\d+.*?:|Imagen\s*\d+.*?:)\s*([A-Za-z0-9\s]+?)(?:,|\s*color|\s*IMEI)/i);
      const nombre = specificModelMatch ? specificModelMatch[1].trim() : globalModel;
      const marca = nombre.split(" ")[0] || "Universal";

      extracted.push({
        type: "crear_equipo",
        imagen_index: extracted.length,
        nombre: nombre || "Celular",
        marca: marca,
        imei1: imei1,
        imei2: imei2,
        color: color,
        ram: ramMatch ? ramMatch[1] : "",
        memoria: romMatch ? romMatch[1] : "",
        costo: globalCosto,
        venta: globalVenta,
        estado: "Disponible",
        condicion: "Nuevo"
      });
    }
  });

  return extracted;
}

// ── REPARADOR Y EXTRACTOR ROBUSTO DE JSON ──
function cleanAndParseAgentJSON(raw) {
  if (!raw) return null;
  let text = raw.replace(/```json\n?/gi, "").replace(/```\n?/g, "").trim();

  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    text = text.substring(firstBrace, lastBrace + 1);
  }

  // Nivel 1: Parseo directo
  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === "object") {
      if (!parsed.response || parsed.response.trim() === "") {
        parsed.response = (parsed.actions || parsed.action)
          ? "✅ Procesé las acciones solicitadas."
          : "⚠️ Respuesta vacía del modelo de IA.";
      }
      // Si no trajo actions pero el texto tiene IMEIs listados, extraerlos
      if ((!parsed.actions || parsed.actions.length === 0) && !parsed.action) {
        const extracted = extractEquiposFromTextFallback(parsed.response);
        if (extracted.length > 0) {
          parsed.actions = extracted;
        }
      }
      return parsed;
    }
  } catch (_) {}

  // Nivel 2: Reparación de saltos de línea sin escapar dentro de strings y trailing commas
  try {
    let inString = false;
    let escaped = false;
    let fixed = "";
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char === '"' && !escaped) {
        inString = !inString;
        fixed += char;
      } else if (inString && (char === '\n' || char === '\r')) {
        fixed += '\\n';
      } else if (inString && char === '\t') {
        fixed += '\\t';
      } else {
        fixed += char;
      }
      escaped = (char === '\\' && !escaped);
    }
    // Eliminar comas finales antes de } o ]
    fixed = fixed.replace(/,\s*([}\]])/g, "$1");
    const parsed = JSON.parse(fixed);
    if (parsed && typeof parsed === "object") {
      if (!parsed.response || parsed.response.trim() === "") {
        parsed.response = (parsed.actions || parsed.action)
          ? "✅ Procesé las acciones solicitadas."
          : "⚠️ Respuesta vacía del modelo de IA.";
      }
      // Si no trajo actions pero el texto tiene IMEIs listados, extraerlos
      if ((!parsed.actions || parsed.actions.length === 0) && !parsed.action) {
        const extracted = extractEquiposFromTextFallback(parsed.response);
        if (extracted.length > 0) {
          parsed.actions = extracted;
        }
      }
      return parsed;
    }
  } catch (_) {}

  // Nivel 3: Extracción por Regex de response y bloques de acciones
  let responseText = "";
  const responseMatch = text.match(/"response"\s*:\s*"([\s\S]*?)"\s*,\s*"(action|actions)"/i) 
                     || text.match(/"response"\s*:\s*"([\s\S]*?)"\s*}/i);
  if (responseMatch) {
    responseText = responseMatch[1].replace(/\\n/g, "\n").replace(/\\"/g, '"');
  }

  const actionsList = [];
  const actionRegex = /\{\s*"type"\s*:\s*"([^"]+)"([\s\S]*?)\}/g;
  let m;
  while ((m = actionRegex.exec(text)) !== null) {
    const fullBlock = m[0];
    const type = m[1];
    const obj = { type };

    const kvRegex = /"([a-zA-Z0-9_]+)"\s*:\s*("(?:\\.|[^"\\])*"|[0-9.]+|true|false|null)/g;
    let kv;
    while ((kv = kvRegex.exec(fullBlock)) !== null) {
      const k = kv[1];
      let v = kv[2];
      if (v.startsWith('"') && v.endsWith('"')) {
        obj[k] = v.slice(1, -1).replace(/\\"/g, '"').replace(/\\n/g, '\n');
      } else if (v === "true") obj[k] = true;
      else if (v === "false") obj[k] = false;
      else if (v === "null") obj[k] = null;
      else obj[k] = Number(v);
    }
    actionsList.push(obj);
  }

  // Si no se extrajeron acciones, intentar desde el texto
  if (actionsList.length === 0 && responseText) {
    const extracted = extractEquiposFromTextFallback(responseText);
    if (extracted.length > 0) {
      actionsList.push(...extracted);
    }
  }

  if (actionsList.length > 0 || responseText) {
    return {
      response: responseText || "✅ Procesé los productos detectados en las imágenes.",
      actions: actionsList.length > 1 ? actionsList : undefined,
      action: actionsList.length === 1 ? actionsList[0] : (actionsList.length > 1 ? actionsList : null)
    };
  }

  return null;
}



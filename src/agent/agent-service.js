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
    `• ${p.nombre} (${p.marca || ""}): stock=${p.stock_actual ?? p.stockActual ?? "?"}, precio=$${p.precio_venta ?? p.precioVenta ?? "?"}, costo=$${p.costo ?? "?"}`
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
🎯 INSTRUCCIONES DE RECONOCIMIENTO:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IMEI: Siempre 15 dígitos numéricos. IMEI1 = principal, IMEI2 = secundario.
No confundir con S/N (contiene letras) ni FCC ID.

MEMORIA: Formato "128+4GB" o "4GB RAM / 128GB ROM":
- Número menor = RAM (ej: "4GB")  
- Número mayor = almacenamiento/ROM (ej: "128GB")

COLOR: Identifica colores en español e inglés en etiquetas.

REGISTRO POR IMAGEN:
- Si hay IMEI visible en imagen → acción "crear_equipo"
- Si hay modelo/specs pero sin IMEI → acción "crear_producto"
- Si faltan datos esenciales (precio/costo) → pide los datos faltantes, NO registres con 0

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

5. Crear cliente:
{"response":"✅ Registré al cliente Juan García, cédula 123456, teléfono 3001234567.","action":{"type":"crear_cliente","cedula":"123456","nombre":"Juan García","telefono":"3001234567","direccion":"Calle 5 #10","email":"","tipo":"Natural"}}

6. Crear producto en inventario:
{"response":"✅ Agregué al inventario: Samsung A15 128GB/4GB RAM, color Negro. Precio venta: $650.000, costo: $480.000, stock inicial: 3 unidades.","action":{"type":"crear_producto","nombre":"Samsung A15","marca":"Samsung","categoria":"Celulares","tipo":"Físico","costo":480000,"precioVenta":650000,"stockMinimo":2,"stockActual":3,"ubicacion":"Vitrina A","sku":"","ram":"4GB","memoria":"128GB","color":"Negro"}}

7. Registrar equipo con IMEI:
{"response":"✅ Registré el equipo Samsung A15 128GB/4GB RAM color Negro. IMEI1: 356251200774692, IMEI2: 356251200774700. Costo: $480.000, precio venta: $650.000.","action":{"type":"crear_equipo","imei1":"356251200774692","imei2":"356251200774700","marca":"Samsung","nombre":"Samsung A15","proveedor":"Proveedor X","costo":480000,"venta":650000,"estado":"Disponible","ram":"4GB","memoria":"128GB","color":"Negro"}}

8. Servicio técnico:
{"response":"✅ Abrí orden de servicio técnico para Pedro Pérez. Equipo: iPhone 13 (IMEI: 123456789012345), falla: 'Pantalla rota'. Abono: $30.000, precio final: $150.000.","action":{"type":"crear_servicio_tecnico","cliente":"Pedro Pérez","telefono":"3109876543","equipo":"iPhone 13","imei_serie":"123456789012345","falla":"Pantalla rota","clave_patron":"","repuestos":"Display iPhone 13","costo_taller":80000,"abono":30000,"precio_final":150000,"estado":"Recibido"}}

9. Registrar crédito:
{"response":"✅ Registré un crédito de $120.000 a nombre de María López por 'compra de cargador inalámbrico a cuotas'.","action":{"type":"crear_credito","cliente":"María López","telefono":"3201234567","total":120000,"detalle":"Compra de cargador inalámbrico a cuotas"}}

10. Vale físico:
{"response":"✅ Creé un vale físico por 1 unidad de 'Cargador 65W' por $45.000 a nombre de Carlos (vendedor).","action":{"type":"crear_vale_fisico","cliente":"Carlos","producto":"Cargador 65W","cantidad":1,"monto":45000,"estado":"Pendiente"}}

11. Reventa:
{"response":"✅ Registré reventa rápida: Auriculares Bluetooth, costo $35.000, precio venta $60.000, proveedor: Distribuidora Norte.","action":{"type":"crear_reventa","producto":"Auriculares Bluetooth","categoria":"Accesorios","costo":35000,"precio":60000,"proveedor":"Distribuidora Norte"}}

12. Actualizar producto:
{"response":"✅ Actualicé el producto 'Tecno KN3' → nuevo nombre 'Tecno Spark Go 2024', 8GB RAM, 128GB ROM, precio venta: $580.000.","action":{"type":"actualizar_producto","nombre_actual":"Tecno KN3","nuevo_nombre":"Tecno Spark Go 2024","ram":"8GB","memoria":"128GB","color":"","costo":380000,"precioVenta":580000,"stockMinimo":2,"stockActual":10,"sku":""}}

13. Crear meta financiera:
{"response":"✅ Creé la meta financiera 'Ventas de hoy' con objetivo de $100.000 y cálculo tipo Ventas.","action":{"type":"crear_meta","titulo":"Ventas de hoy","monto_objetivo":100000,"tipo_calculo":"Ventas","fecha_inicio":"2026-08-15","fecha_limite":"2026-08-15","notas":"Creada por Asistente de Voz"}}

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
- Si no entiendes la petición, responde: {"response":"No entendí tu instrucción. Puedo registrar equipos, productos, clientes, gastos, servicios técnicos, tareas y créditos. ¿Qué necesitas?","action":null}
`;

  let userContent = instruccion || "¿Cuál es el estado del negocio hoy?";
  if (base64Image) {
    const imagesArray = Array.isArray(base64Image) ? base64Image : [base64Image];
    userContent = [
      { type: "text", text: instruccion || "Analiza esta imagen y registra lo que encuentres." }
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
    console.log(`[IA] → OpenRouter | Modelo: qwen/qwen3.7-flash | Key: ${keyPreview}`);
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
        model: "qwen/qwen3.7-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...historyMessages,
          { role: "user", content: userContent }
        ],
        temperature: 0.3,
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
    let text = data.choices?.[0]?.message?.content || "";
    console.log("[IA] ← Respuesta cruda:", text.slice(0, 500));

    // Limpiar markdown si el modelo lo añade
    text = text.replace(/```json\n?/gi, "").replace(/```\n?/g, "").trim();

    // Extraer solo el JSON si hay texto extra
    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      text = text.substring(firstBrace, lastBrace + 1);
    }

    // Intentar parsear JSON
    try {
      const parsed = JSON.parse(text);
      if (parsed && typeof parsed === "object") {
        if (!parsed.response || parsed.response.trim() === "") {
          parsed.response = parsed.action
            ? "⚠️ El modelo de IA ejecutó la acción pero no proporcionó un mensaje explicativo."
            : "⚠️ Respuesta vacía del modelo de IA.";
        }
        return parsed;
      }
    } catch (parseErr) {
      console.warn("[IA] JSON.parse falló, intentando regex fallback:", parseErr.message);

      // Intentar regex fallback para extraer campos
      const responseMatch = text.match(/"response"\s*:\s*"([\s\S]*?)"\s*[,}]/);
      let responseText = responseMatch
        ? responseMatch[1].replace(/\\"/g, '"').trim()
        : "";

      let actionObj = null;
      const typeMatch = text.match(/"type"\s*:\s*"([^"]+)"/);
      if (typeMatch) {
        actionObj = { type: typeMatch[1] };
        const fields = ["cedula","nombre","telefono","direccion","email","tipo","marca","categoria","costo","precioVenta","stockMinimo","stockActual","ubicacion","sku","imei1","imei2","proveedor","venta","estado","cliente","equipo","imei_serie","falla","clave_patron","repuestos","costo_taller","abono","precio_final","total","detalle","producto","cantidad","monto","nombre_actual","nuevo_nombre","ram","memoria","color","tarea","prioridad","notas","color","concepto","responsable","query","destino","precio"];
        fields.forEach(f => {
          const strMatch = text.match(new RegExp(`"${f}"\\s*:\\s*"([\\s\\S]*?)"\\s*[,}]`));
          if (strMatch) {
            actionObj[f] = strMatch[1].replace(/\\"/g, '"').trim();
          } else {
            const numMatch = text.match(new RegExp(`"${f}"\\s*:\\s*([0-9.]+)\\s*[,}]`));
            if (numMatch) actionObj[f] = Number(numMatch[1]);
          }
        });
      }

      if (responseText || actionObj) {
        if (!responseText) {
          responseText = "⚠️ Acción interpretada, pero la IA no especificó una explicación textual.";
        }
        return { response: responseText, action: actionObj };
      }
    }

    // Si la respuesta es texto plano conversacional normal sin formato JSON
    if (text && text.trim().length > 0 && !text.trim().startsWith("{")) {
      return {
        response: text,
        action: null
      };
    }

    // Fallback de error
    return {
      response: "⚠️ No se pudo procesar tu instrucción. Asegúrate de indicar la acción de forma clara (ej: 'crea una tarea para...', 'registra un egreso de...', 'crea una meta de...') y que los datos sean correctos.",
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



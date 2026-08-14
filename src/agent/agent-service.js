import { getOpenRouterApiKey, getDashboard, getVendedores } from "../api.js";

// ── AGENTE INTELIGENTE POR VOZ Y TEXTO (QWEN 3.7 FLASH VIA OPENROUTER) ──
export async function enviarComandoVozIA(instruccion, base64Image = null, historial = []) {
  const openRouterApiKey = getOpenRouterApiKey();
  const openRouterUrl = "https://openrouter.ai/api/v1/chat/completions";

  let ingresosHoy = 0, egresosHoy = 0, utilidad = 0, stockCritico = 0;
  let vendedores = [];
  try {
    const dash = await getDashboard();
    ingresosHoy = dash.ingresosHoy || 0;
    egresosHoy = dash.egresosHoy || 0;
    utilidad = dash.utilidad || 0;
    stockCritico = dash.stockCritico || 0;
  } catch (e) {
    console.error("No se pudo obtener datos del dashboard para la IA:", e);
  }

  try {
    vendedores = await getVendedores();
  } catch (e) {
    console.error("No se pudo obtener vendedores para la IA:", e);
  }

  const systemPrompt = `
Eres el Asistente de Voz Inteligente de FoneBase, potenciado por Qwen 3.7 Flash.
Tu objetivo es ayudar al usuario a gestionar su negocio. Puedes responder preguntas sobre el estado actual o estructurar órdenes de acción.

INSTRUCCIONES CRÍTICAS PARA RECONOCIMIENTO DE DISPOSITIVOS MÓVILES (IMEI, RAM, ALMACENAMIENTO/ROM, COLOR):
1. RECONOCIMIENTO DE IMEI:
   - Un IMEI de teléfono celular consta SIEMPRE de exactamente 15 dígitos numéricos (ej: 356251200774692).
   - En las etiquetas o stickers de las cajas, los IMEIs suelen estar etiquetados como "IMEI1", "IMEI 1", "IMEI2", "IMEI 2" o arriba/abajo de códigos de barras.
   - Extrae siempre el IMEI Principal de 15 dígitos como "imei1" y el Secundario de 15 dígitos como "imei2".
   - NO confundas los IMEIs con números de serie (S/N) que contienen letras, ni con IDs FCC de menor longitud.

2. RECONOCIMIENTO DE MEMORIA Y RAM:
   - Las especificaciones de memoria/almacenamiento y RAM suelen expresarse juntas en las cajas en formatos como "128+4 GB", "256+8 GB", "64/3 GB" o "4GB RAM / 128GB ROM".
   - El número de menor capacidad (ej: 3, 4, 6, 8) representa la memoria RAM. Extráelo en el campo "ram" (ej: "4GB").
   - El número de mayor capacidad (ej: 64, 128, 256, 512) representa la memoria de almacenamiento/ROM. Extráelo en el campo "memoria" (ej: "128GB").

3. RECONOCIMIENTO DE COLOR:
   - Identifica palabras que designen colores en español o inglés en las etiquetas (ej: "INK BLACK", "Negro", "Blue", "Azul", "Verde", "Verdoso") y colócalas en el campo "color".

4. INTENCIÓN DE REGISTRO POR IMAGEN (DIFERENCIA ENTRE PRODUCTO E IMEI):
   - Si detectas números IMEI de 15 dígitos legibles en la imagen (por ejemplo, en una etiqueta de código de barras), debes generar una acción de tipo "crear_equipo" para registrar la unidad IMEI específica en la tabla de equipos.
   - Si NO encuentras ningún número IMEI de 15 dígitos legible en la imagen, pero sí identificas el modelo de un teléfono celular y especificaciones técnicas (como Tecno Spark, 128GB ROM, 8GB RAM), o si el usuario pide registrarlo en inventario sin aportar IMEI, debes generar una acción de tipo "crear_producto" en lugar de "crear_equipo". Esto creará la plantilla del producto celular en el inventario general (Categoría: "Celulares", Tipo: "Físico") de manera que quede registrado en inventario de inmediato, tal como lo haría con un accesorio o cualquier otro producto del almacén.
   - Si el usuario solicita registrar o agregar un producto/equipo PERO NO indica datos esenciales (como precio de venta, costo o cantidad de stock), y estos no se leen claramente en la imagen adjunta, NO ejecutes la acción con valores en 0 de manera a ciegas. En su lugar, responde de forma amable pidiendo los datos faltantes necesarios (ej: "¿A qué precio de venta y costo deseas registrar el producto y cuál es la cantidad inicial de stock?"). Si la orden contiene los datos necesarios o una foto clara, genera la acción inmediatamente.

DATOS DE CONTEXTO ACTUALES DEL SISTEMA:
- Fecha y hora actual: ${new Date().toLocaleString('es-CO')}
- Estadísticas de hoy: Ventas/Ingresos: $${ingresosHoy}, Egresos: $${egresosHoy}, Utilidad: $${utilidad}, Stock crítico: ${stockCritico}
- Vendedores/Equipo: ${vendedores.map(v => v.nombre).join(', ')}

Si el usuario solicita una acción, responde con un JSON válido estructurando la acción para que el sistema la ejecute automáticamente.
Las acciones válidas que el sistema puede ejecutar son:

1. Registrar un egreso/gasto:
   {
     "response": "Explicación amigable de lo que se va a hacer",
     "action": {
       "type": "registrar_egreso",
       "categoria": "Categoría (ej: Servicios, Arriendo, Suministros, Salarios, Repuestos, Publicidad, Otros)",
       "concepto": "Concepto o descripción detallada del gasto",
       "responsable": "Nombre del responsable (selecciona uno de la lista si coincide o el indicado por el usuario)",
       "monto": 15000
     }
   }

2. Crear una tarea pendiente:
   {
     "response": "Explicación amigable de la tarea creada",
     "action": {
       "type": "crear_tarea",
       "tarea": "Título o descripción de la tarea",
       "fecha_inicio": "YYYY-MM-DD (hoy)",
       "fecha_vencimiento": "YYYY-MM-DD (fecha límite sugerida o indicada)",
       "prioridad": "Prioridad ('Baja', 'Media', 'Alta')",
       "responsable": "Nombre del responsable",
       "notes": "Notas adicionales",
       "color": "Hex de color sugerido según prioridad (ej. #ef4444 para Alta, #f59e0b para Media, #3b82f6 para Baja)"
     }
   }

3. Buscar o filtrar clientes:
   {
     "response": "Mensaje de búsqueda",
     "action": {
       "type": "buscar_cliente",
       "query": "Nombre, teléfono o documento a buscar"
     }
   }

4. Navegar a una sección:
   {
     "response": "Te estoy llevando a la sección...",
     "action": {
       "type": "ir_a",
       "destino": "nombre de la vista (dashboard, pos, inventory, clients, credits, technical, expenses, nominas, tasks, settings, kiosk)"
     }
   }

5. Registrar/Crear un nuevo cliente (escribir información de clientes):
   {
     "response": "Explicación amigable",
     "action": {
       "type": "crear_cliente",
       "cedula": "Cédula o documento",
       "nombre": "Nombre completo",
       "telefono": "Teléfono",
       "direccion": "Dirección",
       "email": "Correo electrónico",
       "tipo": "Tipo de cliente ('Natural' o 'Jurídico')"
     }
   }

6. Crear/Agregar un producto al inventario (escribir información de inventario):
   {
     "response": "Explicación amigable",
     "action": {
       "type": "crear_producto",
       "nombre": "Nombre del producto",
       "marca": "Marca",
       "categoria": "Categoría (ej: Celulares, Accesorios, Repuestos)",
       "tipo": "Tipo ('Accesorio', 'Repuesto', 'Físico', 'Reventa')",
       "costo": 5000,
       "precioVenta": 15000,
       "stockMinimo": 2,
       "stockActual": 10,
       "ubicacion": "Ubicación en tienda (ej: Vitrina A)",
       "sku": "SKU o código opcional",
       "ram": "Memoria RAM del celular si aplica (ej: 4GB)",
       "memoria": "Capacidad de almacenamiento del celular si aplica (ej: 128GB)",
       "color": "Color del celular si aplica (ej: Azul)"
     }
   }

7. Registrar un equipo IMEI (escribir información de equipos):
   {
     "response": "Explicación amigable",
     "action": {
       "type": "crear_equipo",
       "imei1": "IMEI 1 de 15 dígitos",
       "imei2": "IMEI 2 de 15 dígitos (opcional)",
       "marca": "Marca del equipo",
       "nombre": "Nombre/Modelo del equipo",
       "proveedor": "Nombre del proveedor",
       "costo": 500000,
       "venta": 850000,
       "estado": "Disponible",
       "ram": "Memoria RAM del celular (ej: 4GB)",
       "memoria": "Capacidad de almacenamiento del celular (ej: 128GB)",
       "color": "Color del celular (ej: Azul)"
     }
   }

8. Registrar orden de Servicio Técnico (escribir información de órdenes de reparación):
   {
     "response": "Explicación amigable",
     "action": {
       "type": "crear_servicio_tecnico",
       "cliente": "Nombre del cliente",
       "telefono": "Teléfono del cliente",
       "equipo": "Modelo/Marca del celular a reparar",
       "imei_serie": "IMEI o número de serie del equipo",
       "falla": "Descripción del daño/falla reportado",
       "clave_patron": "Clave, PIN o patrón de bloqueo (si lo indica)",
       "repuestos": "Repuestos requeridos",
       "costo_taller": 20000,
       "abono": 10000,
       "precio_final": 50000,
       "estado": "Recibido"
     }
   }

9. Registrar/Crear un Crédito de deuda (escribir información de créditos):
   {
     "response": "Explicación amigable",
     "action": {
       "type": "crear_credito",
       "cliente": "Nombre del cliente deudor",
       "telefono": "Teléfono del cliente",
       "total": 50000,
       "detalle": "Detalle del crédito (ej: saldo por compra de cargador)"
     }
   }

10. Registrar/Crear un Vale Físico de mercancía (escribir información de vales):
    {
      "response": "Explicación amigable",
      "action": {
        "type": "crear_vale_fisico",
        "cliente": "Nombre del cliente/vendedor",
        "producto": "Nombre del producto retirado",
        "cantidad": 1,
        "monto": 15000,
        "estado": "Pendiente"
      }
    }

11. Registrar/Crear una Reventa rápida (escribir información de reventas):
    {
      "response": "Explicación amigable",
      "action": {
        "type": "crear_reventa",
        "producto": "Nombre del producto",
        "categoria": "Categoría (ej: Celulares, Accesorios)",
        "costo": 10000,
        "precio": 20000,
        "proveedor": "Nombre del proveedor"
      }
    }

12. Actualizar/Editar/Modificar un producto del inventario:
    {
      "response": "Explicación amigable del producto que se va a actualizar",
      "action": {
        "type": "actualizar_producto",
        "nombre_actual": "Nombre actual del producto a buscar (ej: Tecno KN3)",
        "nuevo_nombre": "Nuevo nombre a asignar (ej: Tecno Spark Go 2024)",
        "ram": "Memoria RAM si aplica (ej: 8GB)",
        "memoria": "Almacenamiento/ROM si aplica (ej: 128GB)",
        "color": "Color si aplica",
        "costo": 5000,
        "precioVenta": 15000,
        "stockMinimo": 2,
        "stockActual": 10,
        "sku": "SKU"
      }
    }

Si el usuario hace una pregunta sobre el negocio (por ejemplo, "¿cuánto hemos vendido hoy?" o "¿cuál es la utilidad hoy?"), responde usando los datos del CONTEXTO ACTUAL. En ese caso, la acción ('action') debe ser null (o no incluirse).
Ejemplo de respuesta de consulta:
{
  "response": "Hoy hemos vendido $150.000 COP y tenemos unos egresos de $20.000 COP, dejando una utilidad neta de $130.000 COP.",
  "action": null
}

REGLAS DE RESPUESTA:
- Responde ÚNICAMENTE con un JSON válido. No rodees tu respuesta con bloques de código markdown (\`\`\`json ... \`\`\`), ni agregues texto antes o después.
- Asegúrate de que el JSON sea perfectamente parseable con JSON.parse.
- Si no entiendes la petición o no coincide con ninguna acción, responde con un mensaje cordial aclarando tus capacidades en el campo 'response', con 'action' en null.
`;

  let userContent = instruccion || "Procesa la instrucción.";
  if (base64Image) {
    const imagesArray = Array.isArray(base64Image) ? base64Image : [base64Image];
    userContent = [
      { type: "text", text: instruccion || "Analiza estas imágenes y responde a la petición." }
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
    const recentHistory = historial.slice(-10);
    recentHistory.forEach(msg => {
      if (msg.sender === "user") {
        let content = msg.text || "Procesa la imagen.";
        if (msg.base64Image) {
          const imgs = Array.isArray(msg.base64Image) ? msg.base64Image : [msg.base64Image];
          content = [{ type: "text", text: msg.text || "Analiza estas imágenes." }];
          imgs.forEach(img => {
            if (img) {
              content.push({
                type: "image_url",
                image_url: { url: img.startsWith("data:") ? img : `data:image/jpeg;base64,${img}` }
              });
            }
          });
        }
        historyMessages.push({ role: "user", content });
      } else if (msg.sender === "ai") {
        historyMessages.push({ role: "assistant", content: msg.text || "" });
      }
    });
  }

  try {
    const response = await fetch(openRouterUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openRouterApiKey}`,
        "HTTP-Referer": "https://adminpro.local",
        "X-Title": "FoneBase Voice Commander"
      },
      body: JSON.stringify({
        model: "qwen/qwen3.7-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...historyMessages,
          { role: "user", content: userContent }
        ],
        temperature: 0.2,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter error: ${response.status}`);
    }

    const data = await response.json();
    let text = data.choices[0]?.message?.content || "";
    
    text = text.replace(/```json\n?/gi, "").replace(/```\n?/g, "").trim();
    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      text = text.substring(firstBrace, lastBrace + 1);
    }
    
    try {
      const parsed = JSON.parse(text);
      if (parsed && typeof parsed === "object") {
        if (!parsed.response && parsed.action) {
          parsed.response = "He interpretado la instrucción del dispositivo exitosamente.";
        }
        return parsed;
      }
      return { response: text, action: null };
    } catch (parseErr) {
      console.warn("JSON.parse falló en enviarComandoVozIA, intentando fallback por Regex...", parseErr, "Raw text:", text);
      
      const responseMatch = text.match(/"response"\s*:\s*"([\s\S]*?)"\s*[,}]/);
      let responseText = "";
      
      if (responseMatch) {
        responseText = responseMatch[1].replace(/\\"/g, '"').trim();
      } else {
        if (text.includes("{")) {
          const cleanText = text.replace(/\{[\s\S]*?\}/g, "").trim();
          responseText = cleanText || "He interpretado la instrucción del dispositivo exitosamente.";
        } else {
          responseText = text.trim() || "He interpretado la instrucción del dispositivo exitosamente.";
        }
      }
      
      let actionObj = null;
      const typeMatch = text.match(/"type"\s*:\s*"([^"]+)"/);
      if (typeMatch) {
        const actionType = typeMatch[1];
        actionObj = { type: actionType };
        
        const fields = ["cedula", "nombre", "telefono", "direccion", "email", "tipo", "marca", "categoria", "costo", "precioVenta", "stockMinimo", "stockActual", "ubicacion", "sku", "imei1", "imei2", "proveedor", "venta", "estado", "cliente", "equipo", "imei_serie", "falla", "clave_patron", "repuestos", "costo_taller", "abono", "precio_final", "total", "detalle", "producto", "cantidad", "monto", "nombre_actual", "nuevo_nombre", "ram", "memoria", "color"];
        
        fields.forEach(f => {
          const strMatch = text.match(new RegExp(`"${f}"\\s*:\\s*"([\\s\\S]*?)"\\s*[,}]`));
          if (strMatch) {
            actionObj[f] = strMatch[1].replace(/\\"/g, '"').trim();
          } else {
            const numMatch = text.match(new RegExp(`"${f}"\\s*:\\s*([0-9.]+)\\s*[,}]`));
            if (numMatch) {
              actionObj[f] = Number(numMatch[1]);
            }
          }
        });
      }
      
      return {
        response: responseText,
        action: actionObj
      };
    }
  } catch (e) {
    console.error("Error al procesar comando de voz con Qwen:", e);
    return {
      response: `No he podido procesar tu solicitud. Error: ${e.message}`,
      action: null
    };
  }
}

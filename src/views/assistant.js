import { enviarComandoVozIA, registrarEgreso, crearTarea, getClientes } from "../api.js";
import { navigate } from "../router.js";
import { showToast } from "../toast.js";

let recognition = null;
let isListening = false;
let _eventsReady = false;

window.assistantPreFill = (text) => {
  const textInput = document.getElementById("voice-input");
  if (textInput) {
    textInput.value = text;
    textInput.focus();
  }
};

window.assistantNavigateTo = (dest, query = null) => {
  if (query) {
    localStorage.setItem("clients_search_query", query);
  }
  navigate(dest);
};
window.dashNavigateTo = window.assistantNavigateTo;

export function initAssistant() {
  return async () => {
    setupAssistantEvents();
  };
}

function setupAssistantEvents() {
  if (_eventsReady) return;
  _eventsReady = true;

  const micBtn = document.getElementById("voice-mic-btn");
  const pulseEl = document.getElementById("voice-pulse");
  const statusEl = document.getElementById("voice-status");
  const textInput = document.getElementById("voice-input");
  const sendBtn = document.getElementById("voice-send-btn");

  if (!micBtn || !textInput || !sendBtn) return;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "es-ES";

    recognition.onstart = () => {
      isListening = true;
      pulseEl?.classList.remove("hidden");
      micBtn.classList.add("bg-red-500/20", "border-red-500/40", "text-red-600");
      micBtn.classList.remove("bg-primary/10", "border-primary/20", "text-primary");
      if (statusEl) statusEl.textContent = "Escuchando...";
    };

    recognition.onresult = async (event) => {
      const text = event.results[0][0].transcript;
      textInput.value = text;
      appendChatMessage("user", text);
      await procesarTextoConIA(text);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      showToast("Error de reconocimiento de voz: " + event.error, "error");
      resetMicUI();
    };

    recognition.onend = () => {
      resetMicUI();
    };
  } else {
    if (statusEl) statusEl.textContent = "Voz no compatible";
    micBtn.disabled = true;
    micBtn.title = "Tu navegador no soporta Web Speech API";
  }

  window.addEventListener("hashchange", () => {
    if (window.location.hash !== "#assistant" && isListening && recognition) {
      recognition.stop();
    }
  });

  function resetMicUI() {
    isListening = false;
    pulseEl?.classList.add("hidden");
    micBtn.classList.remove("bg-red-500/20", "border-red-500/40", "text-red-600");
    micBtn.classList.add("bg-primary/10", "border-primary/20", "text-primary");
    if (statusEl) statusEl.textContent = "Listo para asistirte";
  }

  micBtn.addEventListener("click", () => {
    if (!recognition) return;
    if (isListening) {
      recognition.stop();
    } else {
      try {
        recognition.start();
      } catch (err) {
        console.error("Failed to start recognition:", err);
      }
    }
  });

  const handleSend = async () => {
    const text = textInput.value.trim();
    if (!text) return;
    textInput.value = "";
    appendChatMessage("user", text);
    await procesarTextoConIA(text);
  };

  sendBtn.addEventListener("click", handleSend);
  textInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  });
}

function appendChatMessage(sender, text, htmlContent = null) {
  const chatHistory = document.getElementById("voice-chat-history");
  if (!chatHistory) return;

  const initialHelper = chatHistory.querySelector(".italic");
  if (initialHelper) {
    initialHelper.remove();
  }

  const msgDiv = document.createElement("div");
  if (sender === "user") {
    msgDiv.className = "self-end bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 px-4.5 py-3 rounded-2xl max-w-[85%] sm:max-w-[70%] font-semibold text-left break-words animate-chat-bubble shadow-sm border border-slate-200/40 dark:border-slate-700/40";
    msgDiv.textContent = text;
  } else if (sender === "ai") {
    msgDiv.className = "self-start w-full flex items-start gap-3.5 py-5 px-1 border-b border-slate-100/60 dark:border-slate-800/40 animate-chat-bubble";
    msgDiv.innerHTML = `
      <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-amber-500 flex items-center justify-center text-white shrink-0 shadow-md">
        <span class="material-symbols-outlined text-[18px]" style="font-variation-settings:'FILL' 1">smart_toy</span>
      </div>
      <div class="flex-1 space-y-2 text-slate-800 dark:text-slate-200 text-sm leading-relaxed font-medium">
        ${htmlContent || text}
      </div>
    `;
  } else if (sender === "system") {
    msgDiv.className = "self-center text-[10px] text-slate-400 dark:text-slate-500 font-mono italic text-center py-1.5 bg-slate-50 dark:bg-slate-800/30 px-4 rounded-full border border-slate-100 dark:border-slate-800/50 animate-chat-bubble";
    msgDiv.textContent = text;
  } else if (sender === "loading") {
    msgDiv.className = "self-start w-full flex items-center gap-3.5 py-4 px-1 animate-chat-bubble";
    msgDiv.id = "voice-loading-bubble";
    msgDiv.innerHTML = `
      <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-amber-500 flex items-center justify-center text-white shrink-0 shadow-md">
        <span class="material-symbols-outlined text-[18px]" style="font-variation-settings:'FILL' 1">smart_toy</span>
      </div>
      <div class="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/50 px-4 py-2.5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <span class="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce"></span>
        <span class="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce [animation-delay:0.2s]"></span>
        <span class="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce [animation-delay:0.4s]"></span>
      </div>
    `;
  }

  chatHistory.appendChild(msgDiv);
  chatHistory.scrollTop = chatHistory.scrollHeight;
}

async function procesarTextoConIA(text) {
  appendChatMessage("loading");
  
  try {
    const result = await enviarComandoVozIA(text);
    
    const loadingBubble = document.getElementById("voice-loading-bubble");
    if (loadingBubble) loadingBubble.remove();

    if (!result || !result.response) {
      appendChatMessage("ai", "Lo siento, recibí una respuesta inválida del servidor de inteligencia artificial.");
      return;
    }

    appendChatMessage("ai", result.response);

    if (result.action) {
      await ejecutarAccionIA(result.action);
    }
  } catch (err) {
    console.error("Error processing AI command:", err);
    const loadingBubble = document.getElementById("voice-loading-bubble");
    if (loadingBubble) loadingBubble.remove();
    appendChatMessage("ai", `Error al comunicar con la IA: ${err.message}`);
  }
}

async function ejecutarAccionIA(action) {
  if (action.type === 'registrar_egreso') {
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
        appendChatMessage("system", `✅ Egreso registrado: ${action.concepto} ($${action.monto})`);
      } else {
        appendChatMessage("system", `❌ Error al registrar egreso: ${res.mensaje || 'Error desconocido'}`);
      }
    } catch (e) {
      appendChatMessage("system", `❌ Excepción al registrar egreso: ${e.message}`);
    }
  }
  else if (action.type === 'crear_tarea') {
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
        appendChatMessage("system", `✅ Tarea creada: "${action.tarea}"`);
      } else {
        appendChatMessage("system", `❌ Error al crear tarea: ${res.mensaje || 'Error desconocido'}`);
      }
    } catch (e) {
      appendChatMessage("system", `❌ Excepción al crear tarea: ${e.message}`);
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
      appendChatMessage("system", `❌ Error al consultar clientes: ${e.message}`);
    }
  }
  else if (action.type === 'ir_a') {
    appendChatMessage("system", `Redirigiendo a: ${action.destino}...`);
    setTimeout(() => {
      navigate(action.destino);
    }, 1000);
  }
}

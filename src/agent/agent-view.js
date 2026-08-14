import { compressImage } from "../api.js";
import { showToast, showConfirm } from "../toast.js";
import { enviarComandoVozIA } from "./agent-service.js";
import { ejecutarAccionIA } from "./agent-tools.js";

let recognition = null;
let isListening = false;
let _eventsReady = false;
let _assistantPendingImages = [];
let _lastUserRequest = { text: "", images: null, replyContext: null };
let _replyingToMessage = null;

// LocalStorage helpers for multiple chats
export function getChatsList() {
  try {
    return JSON.parse(localStorage.getItem("adminpro_chats_list") || "[]");
  } catch (e) {
    return [];
  }
}

export function saveChatsList(chats) {
  try {
    localStorage.setItem("adminpro_chats_list", JSON.stringify(chats));
  } catch (e) {
    console.error("Error saving chats list:", e);
  }
}

export function getChatMessages(chatId) {
  try {
    return JSON.parse(localStorage.getItem("adminpro_chat_messages_" + chatId) || "[]");
  } catch (e) {
    return [];
  }
}

export function saveChatMessages(chatId, messages) {
  try {
    localStorage.setItem("adminpro_chat_messages_" + chatId, JSON.stringify(messages));
  } catch (e) {
    console.error("Error saving chat messages:", e);
  }
}

// Automatic legacy migration
export function migrateLegacyChat() {
  const chats = getChatsList();
  if (chats.length === 0) {
    const legacyHistory = localStorage.getItem("adminpro_chat_history");
    if (legacyHistory) {
      try {
        const messages = JSON.parse(legacyHistory);
        if (Array.isArray(messages) && messages.length > 0) {
          const chatId = "chat_legacy";
          const legacyChat = {
            id: chatId,
            title: "Conversación anterior",
            updatedAt: Date.now()
          };
          chats.push(legacyChat);
          saveChatsList(chats);
          saveChatMessages(chatId, messages);
          localStorage.setItem("adminpro_active_chat_id", chatId);
        }
      } catch (e) {
        console.error("Error migrating legacy chat:", e);
      }
    }
  }
}

export function getActiveChatId() {
  migrateLegacyChat();
  let activeId = localStorage.getItem("adminpro_active_chat_id");
  if (!activeId) {
    const chats = getChatsList();
    if (chats.length > 0) {
      activeId = chats[0].id;
      localStorage.setItem("adminpro_active_chat_id", activeId);
    } else {
      const timestamp = Date.now();
      activeId = "chat_" + timestamp;
      const defaultChat = {
        id: activeId,
        title: "Nuevo Chat",
        updatedAt: timestamp
      };
      saveChatsList([defaultChat]);
      saveChatMessages(activeId, []);
      localStorage.setItem("adminpro_active_chat_id", activeId);
    }
  }
  return activeId;
}

export function renderChatsList() {
  const container = document.getElementById("chats-list-container");
  if (!container) return;
  
  const chats = getChatsList();
  const activeId = localStorage.getItem("adminpro_active_chat_id");
  
  chats.sort((a, b) => b.updatedAt - a.updatedAt);
  
  if (chats.length === 0) {
    container.innerHTML = `
      <div class="text-center py-6 text-sm text-slate-400 dark:text-slate-500 italic">
        No hay chats guardados
      </div>
    `;
    return;
  }
  
  container.innerHTML = chats.map(chat => {
    const isActive = chat.id === activeId;
    const dateStr = new Date(chat.updatedAt).toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
    
    const activeClass = isActive 
      ? "bg-indigo-50 dark:bg-indigo-950/40 border-l-4 border-primary text-slate-800 dark:text-slate-200" 
      : "hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300";
      
    return `
      <div class="flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer ${activeClass}" onclick="window.switchChatSession('${chat.id}')">
        <div class="flex-1 min-w-0 pr-2">
          <p class="text-sm font-bold truncate">${chat.title}</p>
          <p class="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">${dateStr}</p>
        </div>
        <button type="button" onclick="event.stopPropagation(); window.deleteChatSession('${chat.id}')" 
          class="p-1.5 text-slate-400 hover:text-red-500 rounded-lg transition-colors flex items-center justify-center focus:outline-none" title="Eliminar chat">
          <span class="material-symbols-outlined text-[18px]">delete</span>
        </button>
    `;
  }).join("");
}

export function startNewChatSession() {
  const timestamp = Date.now();
  const chatId = "chat_" + timestamp;
  const newChat = {
    id: chatId,
    title: "Nuevo Chat",
    updatedAt: timestamp
  };
  
  const chats = getChatsList();
  chats.push(newChat);
  saveChatsList(chats);
  
  saveChatMessages(chatId, []);
  localStorage.setItem("adminpro_active_chat_id", chatId);
  
  clearReplyState();
  renderChatHistoryFromStorage();
  
  showToast("Nueva conversación iniciada", "success");
  
  const modal = document.getElementById("chats-history-modal");
  if (modal) {
    modal.classList.add("hidden");
  }
}

export function switchChatSession(chatId) {
  localStorage.setItem("adminpro_active_chat_id", chatId);
  clearReplyState();
  renderChatHistoryFromStorage();
  
  const modal = document.getElementById("chats-history-modal");
  if (modal) {
    modal.classList.add("hidden");
  }
}

export async function deleteChatSession(chatId) {
  const ok = await showConfirm("Confirmación", "¿Estás seguro de que deseas eliminar este chat?");
  if (!ok) return;
  
  let chats = getChatsList();
  chats = chats.filter(c => c.id !== chatId);
  saveChatsList(chats);
  
  localStorage.removeItem("adminpro_chat_messages_" + chatId);
  
  const activeId = localStorage.getItem("adminpro_active_chat_id");
  if (activeId === chatId) {
    if (chats.length > 0) {
      localStorage.setItem("adminpro_active_chat_id", chats[0].id);
      clearReplyState();
      renderChatHistoryFromStorage();
    } else {
      const timestamp = Date.now();
      const newActiveId = "chat_" + timestamp;
      const defaultChat = {
        id: newActiveId,
        title: "Nuevo Chat",
        updatedAt: timestamp
      };
      saveChatsList([defaultChat]);
      saveChatMessages(newActiveId, []);
      localStorage.setItem("adminpro_active_chat_id", newActiveId);
      
      clearReplyState();
      renderChatHistoryFromStorage();
    }
  }
  
  renderChatsList();
}

export function getChatHistory() {
  const activeId = getActiveChatId();
  return getChatMessages(activeId);
}

export function saveChatMessageToStorage(msgObj) {
  const activeId = getActiveChatId();
  const history = getChatMessages(activeId);
  history.push(msgObj);
  saveChatMessages(activeId, history);
  
  const chats = getChatsList();
  const chatIndex = chats.findIndex(c => c.id === activeId);
  if (chatIndex !== -1) {
    chats[chatIndex].updatedAt = Date.now();
    if (msgObj.sender === "user" && (chats[chatIndex].title === "Nuevo Chat" || chats[chatIndex].title === "Conversación anterior")) {
      const cleanTitle = (msgObj.text || "Consulta con imágenes").trim();
      chats[chatIndex].title = cleanTitle.length > 25 ? cleanTitle.slice(0, 25) + "..." : cleanTitle;
    }
    saveChatsList(chats);
  }
}

export function clearReplyState() {
  _replyingToMessage = null;
  const replyContainer = document.getElementById("assistant-reply-container");
  const replyTextEl = document.getElementById("assistant-reply-text");
  if (replyContainer) {
    replyContainer.classList.add("hidden");
  }
  if (replyTextEl) {
    replyTextEl.textContent = "";
  }
}

export function renderChatHistoryFromStorage() {
  const chatContainer = document.getElementById("voice-chat-history");
  if (!chatContainer) return;
  chatContainer.innerHTML = "";
  
  const history = getChatHistory();
  if (history.length === 0) {
    return;
  }
  
  history.forEach(msg => {
    appendChatMessage(msg.sender, msg.text, msg.htmlContent, msg.base64Image, false, msg.replyContext, msg.timestamp);
  });
  
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

export function appendChatMessage(sender, text, htmlContent = null, base64Image = null, saveToStorage = true, replyContext = null, existingTimestamp = null) {
  const chatContainer = document.getElementById("voice-chat-history");
  if (!chatContainer) return;

  const timestamp = existingTimestamp || Date.now();
  const timeStr = new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  if (saveToStorage) {
    saveChatMessageToStorage({ sender, text, htmlContent, base64Image, replyContext, timestamp });
  }

  const msgDiv = document.createElement("div");
  const isUser = sender === "user";
  const isSystem = sender === "system";

  msgDiv.className = isUser
    ? "flex gap-3 max-w-[85%] sm:max-w-[75%] font-medium animate-in fade-in slide-in-from-bottom-2 duration-300 self-end flex-row-reverse"
    : "flex gap-3 max-w-[85%] sm:max-w-[75%] font-medium animate-in fade-in slide-in-from-bottom-2 duration-300 self-start";

  const avatarBg = isUser
    ? "bg-slate-800 text-white" 
    : isSystem 
      ? "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200" 
      : "bg-primary text-on-primary shadow-md shadow-primary/20";

  const avatarIcon = isUser ? "person" : isSystem ? "terminal" : "smart_toy";

  let imagesHtml = "";
  if (base64Image) {
    const imgs = Array.isArray(base64Image) ? base64Image : [base64Image];
    let imgsList = "";
    for (let i = 0; i < imgs.length; i++) {
      const img = imgs[i];
      const src = img.startsWith("data:") ? img : "data:image/jpeg;base64," + img;
      imgsList += '<img src="' + src + '" class="img-preview-clickable max-w-[200px] max-h-[150px] object-cover rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm cursor-pointer hover:opacity-90 transition-opacity" />';
    }
    imagesHtml = '<div class="flex flex-wrap gap-2 mb-2">' + imgsList + '</div>';
  }

  let replyContextHtml = "";
  if (replyContext) {
    const truncatedReply = replyContext.length > 70 ? replyContext.slice(0, 70) + "..." : replyContext;
    replyContextHtml = '<div class="border-l-2 border-indigo-400/70 bg-indigo-100/30 dark:bg-indigo-900/20 px-2.5 py-1.5 rounded-lg text-xs text-indigo-900/80 dark:text-indigo-300/80 mb-1 max-w-full font-normal italic select-none">Respondiendo a: "' + truncatedReply + '"</div>';
  }

  const bodyContent = htmlContent || (text ? '<p class="whitespace-pre-wrap leading-relaxed">' + text + '</p>' : '');

  const bubbleBg = isUser
    ? "bg-primary text-on-primary rounded-2xl rounded-tr-xs shadow-md"
    : isSystem
      ? "bg-surface-container border border-surface-variant text-on-surface-variant rounded-xl font-mono text-xs"
      : "bg-surface-container-high border border-surface-variant text-on-surface rounded-2xl rounded-tl-xs shadow-sm";

  let userButtonsHtml = "";
  if (isUser) {
    userButtonsHtml = '<div class="flex items-center gap-1 mt-1 justify-end opacity-70 hover:opacity-100 transition-opacity">' +
      '<button type="button" class="btn-reply p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded text-[11px] flex items-center gap-1 focus:outline-none" title="Responder a este mensaje"><span class="material-symbols-outlined text-[13px]">reply</span></button>' +
      '<button type="button" class="btn-resend p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded text-[11px] flex items-center gap-1 focus:outline-none" title="Reenviar mensaje"><span class="material-symbols-outlined text-[13px]">send</span></button>' +
      '<button type="button" class="btn-rollback p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded text-[11px] flex items-center gap-1 focus:outline-none" title="Editar y reescribir desde aquí"><span class="material-symbols-outlined text-[13px]">edit</span></button>' +
      '</div>';
  }

  const userAlignClass = isUser ? "items-end" : "items-start";

  msgDiv.innerHTML =
    '<div class="w-8 h-8 rounded-full ' + avatarBg + ' flex items-center justify-center shrink-0 text-sm font-bold shadow-sm">' +
      '<span class="material-symbols-outlined text-[18px]">' + avatarIcon + '</span>' +
    '</div>' +
    '<div class="flex flex-col ' + userAlignClass + ' min-w-0 flex-1">' +
      '<div class="px-4 py-3 ' + bubbleBg + ' max-w-full overflow-hidden">' +
        replyContextHtml +
        imagesHtml +
        bodyContent +
      '</div>' +
      '<div class="flex items-center gap-2">' +
        '<span class="text-[10px] text-slate-400 mt-1 font-sans px-1">' + timeStr + '</span>' +
        userButtonsHtml +
      '</div>' +
    '</div>';

  if (isUser) {
    const btnReply = msgDiv.querySelector(".btn-reply");
    const btnResend = msgDiv.querySelector(".btn-resend");
    const btnRollback = msgDiv.querySelector(".btn-rollback");
    if (btnReply) btnReply.addEventListener("click", () => window.activateReplyState(text || ""));
    if (btnResend) btnResend.addEventListener("click", () => window.resendUserMessage(text || "", base64Image));
    if (btnRollback) btnRollback.addEventListener("click", () => window.rollbackChatTo(timestamp, text || ""));
  }

  chatContainer.appendChild(msgDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

export async function procesarTextoConIA(promptText, base64Image = null, replyContext = null) {
  _lastUserRequest = { text: promptText, images: base64Image, replyContext };
  const loadingBubble = document.createElement("div");
  loadingBubble.id = "voice-loading-bubble";
  loadingBubble.className = "flex gap-3 max-w-[85%] self-start animate-in fade-in duration-300";
  loadingBubble.innerHTML =
    '<div class="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-md">' +
      '<span class="material-symbols-outlined text-[18px] animate-spin">sync</span>' +
    '</div>' +
    '<div class="px-4 py-3 bg-surface-container-high border border-surface-variant text-on-surface rounded-2xl rounded-tl-xs shadow-sm flex items-center gap-2">' +
      '<span class="text-xs font-semibold text-slate-600 dark:text-slate-300">Procesando con IA...</span>' +
    '</div>';

  const chatContainer = document.getElementById("voice-chat-history");
  if (chatContainer) {
    chatContainer.appendChild(loadingBubble);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  try {
    let fullPrompt = promptText;
    if (replyContext) {
      fullPrompt = '[Contexto de respuesta a un mensaje anterior del usuario: "' + replyContext + '"]\n' + promptText;
    }

    const history = getChatHistory();
    const result = await enviarComandoVozIA(fullPrompt, base64Image, history);

    if (loadingBubble) loadingBubble.remove();

    if (!result || typeof result !== "object") {
      const errHtml =
        '<div>' +
          '<p class="text-red-600 dark:text-red-400">Lo siento, recibí una respuesta inválida del servidor de inteligencia artificial.</p>' +
          '<div class="flex flex-wrap gap-2 mt-3">' +
            '<button onclick="window.retryLastAIRequest(this)" class="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 bg-red-100/50 dark:bg-red-950/30 px-3 py-1.5 rounded-lg active:scale-95 transition-all focus:outline-none">Reintentar</button>' +
            '<button onclick="window.editLastAIRequest(this)" class="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 bg-red-100/50 dark:bg-red-950/30 px-3 py-1.5 rounded-lg active:scale-95 transition-all focus:outline-none">Editar mensaje</button>' +
          '</div>' +
        '</div>';
      appendChatMessage("ai", null, errHtml);
      return;
    }

    appendChatMessage("ai", result.response);

    if (result.action) {
      await ejecutarAccionIA(result.action, base64Image, appendChatMessage);
    }
  } catch (err) {
    console.error("Error processing AI command:", err);
    if (loadingBubble) loadingBubble.remove();
    const errHtml =
      '<div>' +
        '<p class="text-red-600 dark:text-red-400">Error al comunicar con la IA: ' + err.message + '</p>' +
        '<div class="flex flex-wrap gap-2 mt-3">' +
          '<button onclick="window.retryLastAIRequest(this)" class="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 bg-red-100/50 dark:bg-red-950/30 px-3 py-1.5 rounded-lg active:scale-95 transition-all focus:outline-none">Reintentar</button>' +
          '<button onclick="window.editLastAIRequest(this)" class="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 bg-red-100/50 dark:bg-red-950/30 px-3 py-1.5 rounded-lg active:scale-95 transition-all focus:outline-none">Editar mensaje</button>' +
        '</div>' +
      '</div>';
    appendChatMessage("ai", null, errHtml);
  }
}

export function setupAssistantEvents() {
  if (_eventsReady) return;
  _eventsReady = true;

  const micBtn = document.getElementById("voice-mic-btn");
  const pulseEl = document.getElementById("voice-pulse");
  const statusEl = document.getElementById("voice-status");
  const textInput = document.getElementById("voice-input");
  const sendBtn = document.getElementById("voice-send-btn");

  if (!micBtn || !textInput || !sendBtn) return;

  // ── MICRÓFONO: MediaRecorder → OpenRouter Whisper ──
  // Modelo: openai/whisper-large-v3-turbo (~$0.00018/min, soporte español excelente)

  // ── MICRÓFONO: MediaRecorder → OpenRouter Whisper ──
  // Modelo: openai/whisper-large-v3-turbo (~$0.00018/min, soporte español excelente)

  let mediaRecorder = null;
  let audioChunks = [];
  let timerInterval = null;

  // Inyectar estilos para la animación de la onda si no existen
  if (!document.getElementById("voice-wave-styles")) {
    const style = document.createElement("style");
    style.id = "voice-wave-styles";
    style.textContent = `
      @keyframes voice-wave-bar {
        0%, 100% { transform: scaleY(0.3); }
        50% { transform: scaleY(1); }
      }
      .animate-voice-wave {
        animation: voice-wave-bar 1.2s ease-in-out infinite;
        transform-origin: bottom;
      }
    `;
    document.head.appendChild(style);
  }

  function setMicRecording(active) {
    isListening = active;
    if (active) {
      micBtn.classList.remove("bg-slate-100", "dark:bg-slate-800", "text-slate-700", "dark:text-slate-200");
      micBtn.classList.add("bg-red-600", "text-white", "animate-pulse");
      pulseEl?.classList.remove("hidden");
      showRecordingUI();
    } else {
      micBtn.classList.remove("bg-red-600", "text-white", "animate-pulse");
      micBtn.classList.add("bg-slate-100", "dark:bg-slate-800", "text-slate-700", "dark:text-slate-200");
      pulseEl?.classList.add("hidden");
      hideRecordingUI();
    }
    micBtn.style.transform = "";
  }

  function showRecordingUI() {
    document.getElementById("voice-recording-card")?.remove();

    const inputCard = textInput.closest(".max-w-4xl");
    if (!inputCard) return;

    const card = document.createElement("div");
    card.id = "voice-recording-card";
    card.className = "max-w-4xl mx-auto bg-slate-900 dark:bg-slate-950 text-white rounded-2xl p-4 flex items-center justify-between shadow-2xl animate-in slide-in-from-bottom duration-300 gap-4 mb-3 border border-red-500/20";
    card.innerHTML = `
      <div class="flex items-center gap-3">
        <div class="relative flex items-center justify-center">
          <span class="w-3.5 h-3.5 rounded-full bg-red-500 animate-ping absolute"></span>
          <span class="w-3.5 h-3.5 rounded-full bg-red-600 relative"></span>
        </div>
        <div class="flex flex-col">
          <span class="text-[10px] font-black uppercase tracking-wider text-red-400">Grabando Audio</span>
          <span id="recording-timer" class="text-base font-mono font-bold">00:00</span>
        </div>
      </div>
      
      <!-- Ecualizador de onda animado -->
      <div class="flex items-end gap-1.5 h-7 px-4">
        <div class="w-1 bg-red-500 rounded-full animate-voice-wave" style="animation-delay: 0.1s; height: 100%;"></div>
        <div class="w-1 bg-red-500 rounded-full animate-voice-wave" style="animation-delay: 0.3s; height: 100%;"></div>
        <div class="w-1 bg-red-500 rounded-full animate-voice-wave" style="animation-delay: 0.2s; height: 100%;"></div>
        <div class="w-1 bg-red-500 rounded-full animate-voice-wave" style="animation-delay: 0.4s; height: 100%;"></div>
        <div class="w-1 bg-red-500 rounded-full animate-voice-wave" style="animation-delay: 0.15s; height: 100%;"></div>
      </div>
      
      <div class="flex items-center gap-2">
        <button id="cancel-record-btn" type="button" class="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all border border-slate-700 text-slate-300">
          Cancelar
        </button>
        <button id="stop-record-btn" type="button" class="px-4 py-2 bg-red-600 hover:bg-red-500 active:scale-95 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all text-white font-bold flex items-center gap-1.5 shadow-lg shadow-red-600/30">
          <span class="material-symbols-outlined text-[14px]">stop</span>
          <span>Detener</span>
        </button>
      </div>
    `;

    inputCard.parentNode.insertBefore(card, inputCard);

    document.getElementById("cancel-record-btn").addEventListener("click", cancelRecording);
    document.getElementById("stop-record-btn").addEventListener("click", stopRecordingAndTranscribe);

    let startTime = Date.now();
    timerInterval = setInterval(() => {
      let elapsed = Math.floor((Date.now() - startTime) / 1000);
      let mins = String(Math.floor(elapsed / 60)).padStart(2, "0");
      let secs = String(elapsed % 60).padStart(2, "0");
      let timerEl = document.getElementById("recording-timer");
      if (timerEl) timerEl.textContent = `${mins}:${secs}`;
    }, 1000);
  }

  function hideRecordingUI() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    document.getElementById("voice-recording-card")?.remove();
  }

  async function cancelRecording() {
    if (mediaRecorder) {
      try {
        mediaRecorder.onstop = null;
        mediaRecorder.stop();
        mediaRecorder.stream?.getTracks().forEach(t => t.stop());
      } catch (_) {}
      mediaRecorder = null;
    }
    audioChunks = [];
    setMicRecording(false);
    showToast("Grabación cancelada", "info");
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunks = [];

      let mimeType = "";
      const preferredTypes = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/ogg;codecs=opus",
        "audio/ogg",
        "audio/mp4",
        "audio/aac",
        "audio/wav"
      ];
      for (const type of preferredTypes) {
        if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(type)) {
          mimeType = type;
          break;
        }
      }

      const options = mimeType ? { mimeType } : {};
      mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunks.push(e.data);
      };
      mediaRecorder.start(250);
      setMicRecording(true);
    } catch (err) {
      console.error("[Mic] Error al iniciar grabación:", err);
      showToast("No se pudo iniciar el micrófono. Revisa los permisos.", "error");
    }
  }

  async function stopRecordingAndTranscribe() {
    if (!mediaRecorder) return;

    const stopBtn = document.getElementById("stop-record-btn");
    const cancelBtn = document.getElementById("cancel-record-btn");
    if (stopBtn) stopBtn.disabled = true;
    if (cancelBtn) cancelBtn.disabled = true;

    const timerEl = document.getElementById("recording-timer");
    if (timerEl) timerEl.textContent = "Procesando...";

    await new Promise(resolve => {
      mediaRecorder.onstop = resolve;
      mediaRecorder.stop();
      mediaRecorder.stream?.getTracks().forEach(t => t.stop());
    });

    const mimeType = mediaRecorder.mimeType || "audio/webm";
    const audioBlob = new Blob(audioChunks, { type: mimeType });
    audioChunks = [];
    mediaRecorder = null;

    hideRecordingUI();
    setMicRecording(false);

    if (audioBlob.size < 500) {
      showToast("Grabación muy corta, intenta de nuevo.", "warning");
      return;
    }

    const transcribingBubble = document.createElement("div");
    transcribingBubble.id = "voice-transcribing-bubble";
    transcribingBubble.className = "flex gap-3 max-w-[85%] self-start animate-in fade-in duration-300";
    transcribingBubble.innerHTML = `
      <div class="w-8 h-8 rounded-full bg-slate-600 text-white flex items-center justify-center shrink-0 shadow-md">
        <span class="material-symbols-outlined text-[18px] animate-spin">sync</span>
      </div>
      <div class="px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-2xl rounded-tl-xs shadow-sm flex items-center gap-2">
        <span class="text-xs font-semibold">Transcribiendo tu voz con Whisper...</span>
      </div>
    `;
    const chatContainer = document.getElementById("voice-chat-history");
    if (chatContainer) {
      chatContainer.appendChild(transcribingBubble);
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    try {
      const base64Audio = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(audioBlob);
      });

      const { getOpenRouterApiKey } = await import("../api.js");
      const apiKey = getOpenRouterApiKey();

      let ext = "webm";
      if (mimeType.includes("mp4") || mimeType.includes("m4a")) ext = "mp4";
      else if (mimeType.includes("ogg")) ext = "ogg";
      else if (mimeType.includes("wav")) ext = "wav";
      else if (mimeType.includes("aac")) ext = "aac";

      const resp = await fetch("https://openrouter.ai/api/v1/audio/transcriptions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "openai/whisper-large-v3-turbo",
          input_audio: {
            data: base64Audio,
            format: ext
          }
        })
      });

      transcribingBubble.remove();

      if (!resp.ok) {
        const errText = await resp.text();
        console.error("[Whisper] Error:", resp.status, errText);
        showToast(`Error al transcribir (${resp.status})`, "error");
        return;
      }

      const result = await resp.json();
      const transcribedText = result.text?.trim() || "";

      if (!transcribedText) {
        showToast("No se detectó ninguna palabra en tu audio.", "warning");
        return;
      }

      textInput.value = transcribedText;
      textInput.focus();
      showToast("Audio transcribido con éxito.", "success");
      console.log("[Whisper] Transcripción exitosa:", transcribedText);
    } catch (err) {
      transcribingBubble.remove();
      console.error("[Whisper] Error:", err);
      showToast("Error de conexión al transcribir: " + err.message, "error");
    }
  }

  micBtn.addEventListener("pointerup", (e) => {
    e.preventDefault();
    if (isListening) {
      stopRecordingAndTranscribe();
    } else {
      startRecording();
    }
  });

  micBtn.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    micBtn.style.transform = "scale(0.92)";
  });
  micBtn.addEventListener("pointerleave", () => { micBtn.style.transform = ""; });

  window.addEventListener("hashchange", () => {
    if (window.location.hash !== "#assistant" && isListening) {
      stopRecordingAndTranscribe();
    }
  });

  const fileCamera = document.getElementById("assistant-file-camera");
  const fileGallery = document.getElementById("assistant-file-gallery");
  const previewContainer = document.getElementById("assistant-image-preview-container");
  const previewList = document.getElementById("assistant-image-preview-list");
  const clearAllBtn = document.getElementById("assistant-image-clear-all-btn");

  const renderAssistantImagePreviews = () => {
    if (!previewContainer || !previewList) return;
    if (_assistantPendingImages.length === 0) {
      previewContainer.classList.add("hidden");
      previewList.innerHTML = "";
      return;
    }

    let previewsHtml = "";
    for (let index = 0; index < _assistantPendingImages.length; index++) {
      const img = _assistantPendingImages[index];
      previewsHtml += '<div class="relative group shrink-0">' +
        '<img src="' + img + '" class="w-14 h-14 object-cover rounded-lg border border-surface-variant shadow-sm" />' +
        '<button type="button" data-index="' + index + '" class="remove-img-btn absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center shadow-md text-xs hover:bg-red-700 transition-colors">' +
          '<span class="material-symbols-outlined text-[14px]">close</span>' +
        '</button>' +
      '</div>';
    }
    previewList.innerHTML = previewsHtml;
    
    previewContainer.classList.remove("hidden");

    previewList.querySelectorAll(".remove-img-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const index = parseInt(e.currentTarget.dataset.index, 10);
        _assistantPendingImages.splice(index, 1);
        renderAssistantImagePreviews();
      });
    });
  };

  if (clearAllBtn) {
    clearAllBtn.addEventListener("click", () => {
      _assistantPendingImages = [];
      renderAssistantImagePreviews();
    });
  }

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    showToast("Procesando " + files.length + " imagen(es)...", "info");
    for (const file of files) {
      try {
        const compressed = await compressImage(file, 800, 800, 0.7);
        _assistantPendingImages.push(compressed);
      } catch (err) {
        console.error("Error comprimiendo imagen:", err);
        showToast("Error procesando imagen: " + file.name, "error");
      }
    }
    renderAssistantImagePreviews();
    e.target.value = "";
  };

  if (fileCamera) fileCamera.addEventListener("change", handleFileSelect);
  if (fileGallery) fileGallery.addEventListener("change", handleFileSelect);

  const processTextAndImages = async () => {
    const text = textInput.value.trim();
    if (!text && _assistantPendingImages.length === 0) return;

    const imgsToSend = [..._assistantPendingImages];
    const replyContext = _replyingToMessage;
    
    textInput.value = "";
    _assistantPendingImages = [];
    renderAssistantImagePreviews();
    clearReplyState();

    appendChatMessage("user", text, null, imgsToSend.length > 0 ? imgsToSend : null, true, replyContext);
    await procesarTextoConIA(text, imgsToSend.length > 0 ? imgsToSend : null, replyContext);
  };

  sendBtn.addEventListener("click", processTextAndImages);

  textInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      processTextAndImages();
    }
  });

  const replyCloseBtn = document.getElementById("assistant-reply-close-btn");
  if (replyCloseBtn) {
    replyCloseBtn.addEventListener("click", clearReplyState);
  }

  const showChatsListBtn = document.getElementById("show-chats-list-btn");
  const clearChatHistoryBtn = document.getElementById("clear-chat-history-btn");
  const chatsModal = document.getElementById("chats-history-modal");
  const chatsModalCloseBtn = document.getElementById("chats-history-modal-close-btn");

  if (showChatsListBtn && chatsModal) {
    showChatsListBtn.addEventListener("click", () => {
      renderChatsList();
      chatsModal.classList.remove("hidden");
      chatsModal.classList.add("flex");
    });
  }

  if (clearChatHistoryBtn) {
    clearChatHistoryBtn.addEventListener("click", () => {
      startNewChatSession();
    });
  }

  if (chatsModalCloseBtn && chatsModal) {
    chatsModalCloseBtn.addEventListener("click", () => {
      chatsModal.classList.add("hidden");
      chatsModal.classList.remove("flex");
    });
  }
}

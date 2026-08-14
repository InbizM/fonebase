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

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let lastTranscript = "";
  let hasSubmitted = false;

  const createSpeechRecognition = () => {
    if (!SpeechRecognition) return null;

    const instance = new SpeechRecognition();
    instance.continuous = false;
    instance.interimResults = true;
    instance.lang = "es-ES";

    instance.onstart = () => {
      isListening = true;
      lastTranscript = "";
      hasSubmitted = false;
      pulseEl?.classList.remove("hidden");
      micBtn.classList.remove("bg-slate-100", "dark:bg-slate-800", "text-slate-700", "dark:text-slate-200");
      micBtn.classList.add("bg-red-600", "text-white", "animate-pulse");
      if (statusEl) statusEl.textContent = "Escuchando... Habla tu comando";
    };

    instance.onresult = (event) => {
      let currentText = "";
      for (let i = 0; i < event.results.length; i++) {
        currentText += event.results[i][0].transcript;
      }

      if (currentText) {
        textInput.value = currentText;
        lastTranscript = currentText;
      }
    };

    instance.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      let errorMsg = "Error de micrófono: " + event.error;
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        errorMsg = "Permiso de micrófono denegado o requiere conexión segura (HTTPS / localhost)";
      } else if (event.error === "no-speech") {
        errorMsg = "No se detectó voz. Presiona e intenta hablar más fuerte.";
      } else if (event.error === "network") {
        errorMsg = "Error de red al conectar con el servicio de voz de Google/Navegador.";
      }
      if (event.error !== "aborted") {
        showToast(errorMsg, "warning");
      }
      resetMicUI();
    };

    instance.onend = async () => {
      resetMicUI();
      if (!hasSubmitted && lastTranscript.trim()) {
        hasSubmitted = true;
        const finalQuery = lastTranscript.trim();
        textInput.value = "";
        const replyContext = _replyingToMessage;
        clearReplyState();
        appendChatMessage("user", finalQuery, null, null, true, replyContext);
        await procesarTextoConIA(finalQuery, null, replyContext);
      }
    };

    return instance;
  };

  if (!SpeechRecognition) {
    if (statusEl) statusEl.textContent = "Voz no compatible";
    micBtn.disabled = true;
    micBtn.title = "Tu navegador no soporta Web Speech API";
  }

  window.addEventListener("hashchange", () => {
    if (window.location.hash !== "#assistant" && isListening && recognition) {
      try { recognition.stop(); } catch (e) {}
    }
  });

  function resetMicUI() {
    isListening = false;
    pulseEl?.classList.add("hidden");
    micBtn.classList.remove("bg-red-600", "text-white", "animate-pulse", "bg-red-500/20", "border-red-500/40", "text-red-600");
    micBtn.classList.add("bg-slate-100", "dark:bg-slate-800", "text-slate-700", "dark:text-slate-200");
    if (statusEl) statusEl.textContent = "Listo para asistirte";
  }

  const toggleVoiceRecording = async () => {
    if (!SpeechRecognition) {
      showToast("Tu navegador no soporta reconocimiento de voz", "error");
      return;
    }

    if (location.protocol === "http:" && location.hostname !== "localhost" && location.hostname !== "127.0.0.1") {
      showToast("Chrome bloquea la voz en IP local HTTP (ej: 192.168...). Usa localhost o HTTPS.", "warning");
    }

    if (isListening && recognition) {
      try {
        recognition.stop();
      } catch (e) {}
    } else {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          try {
            await navigator.mediaDevices.getUserMedia({ audio: true });
          } catch (micErr) {
            console.warn("getUserMedia mic permission warning:", micErr);
            showToast("Permiso de micrófono no otorgado", "error");
            return;
          }
        }
        textInput.value = "";
        lastTranscript = "";
        hasSubmitted = false;
        recognition = createSpeechRecognition();
        if (recognition) {
          recognition.start();
        }
      } catch (err) {
        console.error("Failed to start recognition:", err);
        showToast("No se pudo iniciar el micrófono: " + err.message, "error");
      }
    }
  };

  micBtn.addEventListener("click", (e) => {
    e.preventDefault();
    toggleVoiceRecording();
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

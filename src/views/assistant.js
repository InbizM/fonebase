import { 
  enviarComandoVozIA, 
  registrarEgreso, 
  crearTarea, 
  getClientes, 
  compressImage,
  crearCliente,
  crearProducto,
  actualizarProducto,
  crearEquipo,
  crearServicioTecnico,
  crearCredito,
  crearValeFisico,
  crearReventa,
  getInventario
} from "../api.js";
import { navigate } from "../router.js";
import { showToast, showConfirm } from "../toast.js";

let recognition = null;
let isListening = false;
let _eventsReady = false;
let _assistantPendingImages = [];
let _lastUserRequest = { text: "", images: null, replyContext: null };
let _replyingToMessage = null;

window.assistantPreFill = (text) => {
  const textInput = document.getElementById("voice-input");
  if (textInput) {
    textInput.value = text;
    textInput.focus();
  }
};

window.useQuickPrompt = (text) => {
  const textInput = document.getElementById("voice-input");
  if (textInput) {
    textInput.value = text;
    textInput.focus();
    const colonIndex = text.indexOf(":");
    if (colonIndex !== -1) {
      const targetPos = text.charAt(colonIndex + 1) === " " ? colonIndex + 2 : colonIndex + 1;
      textInput.setSelectionRange(targetPos, targetPos);
    } else {
      textInput.setSelectionRange(text.length, text.length);
    }
  }
};

window.assistantNavigateTo = (dest, query = null) => {
  if (query) {
    localStorage.setItem("clients_search_query", query);
  }
  navigate(dest);
};
window.dashNavigateTo = window.assistantNavigateTo;

window.retryLastAIRequest = async (btn) => {
  if (!_lastUserRequest || (!_lastUserRequest.text && (!_lastUserRequest.images || _lastUserRequest.images.length === 0))) {
    showToast("No hay ninguna petición anterior para reintentar", "error");
    if (btn) btn.remove();
    return;
  }
  const textToRetry = _lastUserRequest.text;
  const imagesToRetry = _lastUserRequest.images;
  const replyContextToRetry = _lastUserRequest.replyContext;
  if (btn) {
    btn.remove();
  }
  await procesarTextoConIA(textToRetry, imagesToRetry, replyContextToRetry);
};

window.editLastAIRequest = (btn) => {
  if (!_lastUserRequest || !_lastUserRequest.text) {
    showToast("No hay ninguna petición anterior para editar", "error");
    return;
  }
  const textInput = document.getElementById("voice-input");
  if (textInput) {
    textInput.value = _lastUserRequest.text;
    textInput.focus();
  }
};

window.resendUserMessage = async (text, base64Image) => {
  appendChatMessage("user", text, null, base64Image, true, null);
  await procesarTextoConIA(text, base64Image, null);
};

window.activateReplyState = (text) => {
  _replyingToMessage = text;
  
  const replyContainer = document.getElementById("assistant-reply-container");
  const replyTextEl = document.getElementById("assistant-reply-text");
  
  if (replyContainer && replyTextEl) {
    const truncated = text.length > 80 ? text.slice(0, 80) + "..." : text;
    replyTextEl.textContent = truncated;
    replyContainer.classList.remove("hidden");
  }
  
  const textInput = document.getElementById("voice-input");
  if (textInput) {
    textInput.focus();
  }
};

window.clearReplyState = () => {
  _replyingToMessage = null;
  const replyContainer = document.getElementById("assistant-reply-container");
  const replyTextEl = document.getElementById("assistant-reply-text");
  if (replyContainer) {
    replyContainer.classList.add("hidden");
  }
  if (replyTextEl) {
    replyTextEl.textContent = "";
  }
};


// LocalStorage helpers for multiple chats
function getChatsList() {
  try {
    return JSON.parse(localStorage.getItem("adminpro_chats_list") || "[]");
  } catch (e) {
    return [];
  }
}

function saveChatsList(chats) {
  try {
    localStorage.setItem("adminpro_chats_list", JSON.stringify(chats));
  } catch (e) {
    console.error("Error saving chats list:", e);
  }
}

function getChatMessages(chatId) {
  try {
    return JSON.parse(localStorage.getItem("adminpro_chat_messages_" + chatId) || "[]");
  } catch (e) {
    return [];
  }
}

function saveChatMessages(chatId, messages) {
  try {
    localStorage.setItem("adminpro_chat_messages_" + chatId, JSON.stringify(messages));
  } catch (e) {
    console.error("Error saving chat messages:", e);
  }
}

// Automatic legacy migration
function migrateLegacyChat() {
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

// Active Chat ID manager
function getActiveChatId() {
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

// Render dynamic chat list
function renderChatsList() {
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
      </div>
    `;
  }).join("");
}

window.startNewChatSession = () => {
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
  
  window.clearReplyState();
  renderChatHistoryFromStorage();
  
  showToast("Nueva conversación iniciada", "success");
  
  const modal = document.getElementById("chats-history-modal");
  if (modal) {
    modal.classList.add("hidden");
  }
};

window.switchChatSession = (chatId) => {
  localStorage.setItem("adminpro_active_chat_id", chatId);
  window.clearReplyState();
  renderChatHistoryFromStorage();
  
  const modal = document.getElementById("chats-history-modal");
  if (modal) {
    modal.classList.add("hidden");
  }
};

window.deleteChatSession = async (chatId) => {
  const ok = await showConfirm("Confirmación", "¿Estás seguro de que deseas eliminar este chat?");
  if (!ok) {
    return;
  }
  
  let chats = getChatsList();
  chats = chats.filter(c => c.id !== chatId);
  saveChatsList(chats);
  
  localStorage.removeItem("adminpro_chat_messages_" + chatId);
  
  const activeId = localStorage.getItem("adminpro_active_chat_id");
  if (activeId === chatId) {
    if (chats.length > 0) {
      localStorage.setItem("adminpro_active_chat_id", chats[0].id);
      window.clearReplyState();
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
      
      window.clearReplyState();
      renderChatHistoryFromStorage();
    }
  }
  
  renderChatsList();
};

window.rollbackChatTo = (msgTimestamp, text) => {
  try {
    const history = getChatHistory();
    const index = history.findIndex(msg => Number(msg.timestamp) === Number(msgTimestamp));
    if (index !== -1) {
      history.splice(index);
      const chatId = getActiveChatId();
      saveChatMessages(chatId, history);
    }
    
    const textInput = document.getElementById("voice-input");
    if (textInput) {
      textInput.value = text || "";
      textInput.focus();
    }
    
    window.clearReplyState();
    renderChatHistoryFromStorage();
  } catch (e) {
    console.error("Error en rollbackChatTo:", e);
  }
};

export function initAssistant() {
  return async () => {
    setupAssistantEvents();
    renderChatHistoryFromStorage();
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
      const replyContext = _replyingToMessage;
      window.clearReplyState();
      appendChatMessage("user", text, null, null, true, replyContext);
      await procesarTextoConIA(text, null, replyContext);
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
    previewContainer.classList.remove("hidden");
    previewList.innerHTML = _assistantPendingImages.map((img, index) => `
      <div class="relative w-14 h-14 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 flex-shrink-0 group">
        <img src="${img}" class="w-full h-full object-cover" />
        <button type="button" onclick="window.removeAssistantImage(${index})" 
          class="absolute top-1 right-1 w-4.5 h-4.5 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-all">
          <span class="material-symbols-outlined text-[10px]">close</span>
        </button>
      </div>
    `).join("");
  };

  window.removeAssistantImage = (index) => {
    _assistantPendingImages.splice(index, 1);
    renderAssistantImagePreviews();
  };

  clearAllBtn?.addEventListener("click", () => {
    _assistantPendingImages = [];
    renderAssistantImagePreviews();
    if (fileCamera) fileCamera.value = "";
    if (fileGallery) fileGallery.value = "";
  });

  const handleImagesSelect = async (files) => {
    if (!files || files.length === 0) return;
    showToast(`Procesando ${files.length} imagen(es)...`, "info");
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = async (ev) => {
          try {
            const compressed = await compressImage(ev.target.result, 1024, 1024, 0.8);
            _assistantPendingImages.push(compressed);
          } catch (err) {
            console.error("Error al comprimir imagen:", err);
          }
          resolve();
        };
        reader.readAsDataURL(file);
      });
    }
    renderAssistantImagePreviews();
    showToast("Imágenes listas para enviar", "success");
  };

  fileCamera?.addEventListener("change", (e) => {
    handleImagesSelect(e.target.files);
  });

  fileGallery?.addEventListener("change", (e) => {
    handleImagesSelect(e.target.files);
  });

  const handleSend = async () => {
    const text = textInput.value.trim();
    if (!text && _assistantPendingImages.length === 0) return;
    
    const imgsToSend = [..._assistantPendingImages];
    
    // Limpiar input y previsualización inmediatamente
    textInput.value = "";
    _assistantPendingImages = [];
    renderAssistantImagePreviews();
    if (fileCamera) fileCamera.value = "";
    if (fileGallery) fileGallery.value = "";

    const replyContext = _replyingToMessage;
    window.clearReplyState();

    appendChatMessage("user", text, null, imgsToSend, true, replyContext);
    await procesarTextoConIA(text, imgsToSend, replyContext);
  };

  sendBtn.addEventListener("click", handleSend);
  textInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  });

  window.addEventListener("resize", () => {
    const assistantSec = document.querySelector('[data-view="assistant"]');
    if (assistantSec && !assistantSec.classList.contains("hidden")) {
      const chatHistory = document.getElementById("voice-chat-history");
      if (chatHistory) {
        chatHistory.scrollTop = chatHistory.scrollHeight;
      }
    }
  });

  const clearChatBtn = document.getElementById("clear-chat-history-btn");
  clearChatBtn?.addEventListener("click", () => {
    window.startNewChatSession();
  });

  const replyCloseBtn = document.getElementById("assistant-reply-close-btn");
  replyCloseBtn?.addEventListener("click", () => {
    window.clearReplyState();
  });

  const showChatsListBtn = document.getElementById("show-chats-list-btn");
  const chatsHistoryModal = document.getElementById("chats-history-modal");
  const closeChatsListBtn = document.getElementById("chats-history-modal-close-btn");

  if (showChatsListBtn && chatsHistoryModal) {
    showChatsListBtn.addEventListener("click", () => {
      renderChatsList();
      chatsHistoryModal.classList.remove("hidden");
      chatsHistoryModal.classList.add("flex");
    });
  }

  if (closeChatsListBtn && chatsHistoryModal) {
    closeChatsListBtn.addEventListener("click", () => {
      chatsHistoryModal.classList.add("hidden");
      chatsHistoryModal.classList.remove("flex");
    });
  }

  if (chatsHistoryModal) {
    const backdrop = chatsHistoryModal.querySelector(".absolute.inset-0");
    if (backdrop) {
      backdrop.addEventListener("click", () => {
        chatsHistoryModal.classList.add("hidden");
        chatsHistoryModal.classList.remove("flex");
      });
    }
  }
}

function getChatHistory() {
  const chatId = getActiveChatId();
  return getChatMessages(chatId);
}

function saveChatMessage(sender, text, htmlContent, base64Image, replyContext = null, timestamp = null) {
  try {
    const chatId = getActiveChatId();
    const history = getChatMessages(chatId);
    const finalTimestamp = timestamp || Date.now();
    history.push({ sender, text, htmlContent, base64Image, replyContext, timestamp: finalTimestamp });
    if (history.length > 50) {
      history.shift();
    }
    saveChatMessages(chatId, history);

    const chats = getChatsList();
    const chatIndex = chats.findIndex(c => c.id === chatId);
    if (chatIndex !== -1) {
      if (sender === "user" && text && chats[chatIndex].title === "Nuevo Chat") {
        chats[chatIndex].title = text.slice(0, 25).trim() || "Nuevo Chat";
      }
      chats[chatIndex].updatedAt = Date.now();
      saveChatsList(chats);
    }
  } catch (e) {
    console.error("Error al guardar historial de chat:", e);
  }
}

function renderChatHistoryFromStorage() {
  const chatHistory = document.getElementById("voice-chat-history");
  if (!chatHistory) return;

  chatHistory.innerHTML = ""; // Limpiar antes de renderizar

  const history = getChatHistory();
  if (history.length === 0) {
    appendChatMessage("ai", "¡Hola! Soy tu asistente de Inteligencia Artificial para FoneBase.<br><br>Puedo ayudarte a gestionar la tienda rápidamente. Háblame o escríbeme para realizar consultas o registrar información en tiempo real.", null, null, false);
  } else {
    history.forEach(msg => {
      appendChatMessage(msg.sender, msg.text, msg.htmlContent, msg.base64Image, false, msg.replyContext, msg.timestamp);
    });
  }
}

function appendChatMessage(sender, text, htmlContent = null, base64Image = null, shouldSave = true, replyContext = null, timestamp = null) {
  const chatHistory = document.getElementById("voice-chat-history");
  if (!chatHistory) return;

  const initialHelper = chatHistory.querySelector(".italic");
  if (initialHelper) {
    initialHelper.remove();
  }

  let msgTimestamp = timestamp;
  if (shouldSave && sender !== "loading") {
    if (!msgTimestamp) {
      msgTimestamp = Date.now();
    }
    saveChatMessage(sender, text, htmlContent, base64Image, replyContext, msgTimestamp);
  } else if (!msgTimestamp) {
    msgTimestamp = Date.now();
  }

  const msgDiv = document.createElement("div");
  if (sender === "user") {
    // Burbuja de usuario estilo premium: tail superior derecho, colores lavanda/indigo, sin gradientes
    msgDiv.className = "self-end bg-indigo-50 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200 border border-indigo-100/50 dark:border-indigo-900/30 px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-[85%] sm:max-w-[70%] font-semibold text-sm text-left break-words animate-chat-bubble flex flex-col gap-2 shadow-sm";
    
    let replyHtml = "";
    if (replyContext) {
      const truncatedReply = replyContext.length > 120 ? replyContext.slice(0, 120) + "..." : replyContext;
      replyHtml = `
        <div class="border-l-2 border-indigo-400/70 bg-indigo-100/30 dark:bg-indigo-900/20 px-2.5 py-1.5 rounded-lg text-xs text-indigo-900/80 dark:text-indigo-300/80 mb-1 max-w-full font-normal italic select-none">
          ${truncatedReply}
        </div>
      `;
    }

    if (base64Image) {
      const imagesArray = Array.isArray(base64Image) ? base64Image : [base64Image];
      const imgsHtml = imagesArray.map(img => `
        <img src="${img}" class="rounded-xl max-w-full max-h-48 object-cover border border-slate-100 dark:border-slate-800/40" />
      `).join("");
      
      msgDiv.innerHTML = replyHtml;
      const imgsContainer = document.createElement("div");
      imgsContainer.className = "flex flex-col gap-1.5";
      imgsContainer.innerHTML = imgsHtml;
      msgDiv.appendChild(imgsContainer);
      if (text) {
        const textSpan = document.createElement("span");
        textSpan.className = "mt-1 block";
        textSpan.textContent = text;
        msgDiv.appendChild(textSpan);
      }
    } else {
      msgDiv.innerHTML = replyHtml;
      if (text) {
        const textSpan = document.createElement("span");
        textSpan.textContent = text;
        msgDiv.appendChild(textSpan);
      }
    }

    // Contenedor para acciones de la burbuja
    const actionsDiv = document.createElement("div");
    actionsDiv.className = "flex items-center gap-3 mt-1.5 self-start";

    // Botón Reescribir (sin emojis, icono history de Material Symbols)
    const rewriteBtn = document.createElement("button");
    rewriteBtn.type = "button";
    rewriteBtn.className = "text-[10px] font-bold uppercase tracking-wider text-indigo-600/70 dark:text-indigo-400/70 hover:text-indigo-900 dark:hover:text-indigo-200 transition-colors flex items-center gap-1 active:scale-95 focus:outline-none";
    rewriteBtn.innerHTML = `<span class="material-symbols-outlined text-[13px]">history</span><span>Reescribir</span>`;
    
    rewriteBtn.addEventListener("click", () => {
      window.rollbackChatTo(msgTimestamp, text);
    });
    actionsDiv.appendChild(rewriteBtn);

    // Botón Reenviar (sin emojis, icono send de Material Symbols)
    const resendBtn = document.createElement("button");
    resendBtn.type = "button";
    resendBtn.className = "text-[10px] font-bold uppercase tracking-wider text-indigo-600/70 dark:text-indigo-400/70 hover:text-indigo-900 dark:hover:text-indigo-200 transition-colors flex items-center gap-1 active:scale-95 focus:outline-none";
    resendBtn.innerHTML = `<span class="material-symbols-outlined text-[13px]">send</span><span>Reenviar</span>`;
    
    resendBtn.addEventListener("click", () => {
      if (typeof window.resendUserMessage === "function") {
        window.resendUserMessage(text, base64Image);
      }
    });
    actionsDiv.appendChild(resendBtn);

    msgDiv.appendChild(actionsDiv);
  } else if (sender === "ai") {
    // Burbuja de la IA estilo premium: barra acentuada en el borde izquierdo e indicador de respuesta
    msgDiv.className = "self-start w-full py-4 px-3.5 border-l-2 border-primary/80 bg-slate-50/50 dark:bg-slate-900/20 rounded-r-2xl animate-chat-bubble text-slate-800 dark:text-slate-200 text-sm leading-relaxed font-medium flex flex-col gap-2 relative group";
    
    const contentDiv = document.createElement("div");
    contentDiv.innerHTML = htmlContent || text;
    msgDiv.appendChild(contentDiv);
    
    const isError = htmlContent && htmlContent.includes("retryLastAIRequest");
    if (!isError) {
      const replyBtn = document.createElement("button");
      replyBtn.type = "button";
      replyBtn.className = "self-start mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-primary transition-colors flex items-center gap-1 active:scale-95 focus:outline-none";
      replyBtn.innerHTML = `<span class="material-symbols-outlined text-[13px]">reply</span><span>Responder</span>`;
      
      replyBtn.addEventListener("click", () => {
        const plainText = contentDiv.textContent.trim();
        window.activateReplyState(plainText);
      });
      msgDiv.appendChild(replyBtn);
    }
  } else if (sender === "system") {
    // Banners de comandos de sistema ejecutados
    msgDiv.className = "self-center text-[10px] text-slate-400 dark:text-slate-500 font-mono italic text-center py-1.5 bg-slate-50 dark:bg-slate-800/30 px-4 rounded-full animate-chat-bubble border border-slate-200/20 dark:border-slate-800/20 my-1";
    msgDiv.textContent = text;
  } else if (sender === "loading") {
    msgDiv.className = "self-start w-full py-4 px-1 animate-chat-bubble";
    msgDiv.id = "voice-loading-bubble";
    msgDiv.innerHTML = `
      <div class="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/50 px-4 py-2.5 rounded-2xl w-fit border border-slate-100 dark:border-slate-800/50">
        <span class="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce"></span>
        <span class="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce [animation-delay:0.2s]"></span>
        <span class="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce [animation-delay:0.4s]"></span>
      </div>
    `;
  }

  chatHistory.appendChild(msgDiv);
  setTimeout(() => {
    chatHistory.scrollTop = chatHistory.scrollHeight;
  }, 100);
}

async function procesarTextoConIA(text, base64Image = null, replyContext = null) {
  appendChatMessage("loading");
  
  // Save user request for retry
  _lastUserRequest = { text, images: base64Image, replyContext };
  
  try {
    const history = getChatHistory();
    let promptText = text;
    if (replyContext) {
      promptText = `[Respondiendo al mensaje: "${replyContext}"] ${text}`;
    }
    const result = await enviarComandoVozIA(promptText, base64Image, history);
    
    const loadingBubble = document.getElementById("voice-loading-bubble");
    if (loadingBubble) loadingBubble.remove();

    if (!result || !result.response) {
      appendChatMessage("ai", null, `
        <div>
          <p class="text-red-600 dark:text-red-400">Lo siento, recibí una respuesta inválida del servidor de inteligencia artificial.</p>
          <div class="flex flex-wrap gap-2 mt-3">
            <button onclick="window.retryLastAIRequest(this)" class="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 bg-red-100/50 dark:bg-red-950/30 px-3 py-1.5 rounded-lg active:scale-95 transition-all focus:outline-none">Reintentar</button>
            <button onclick="window.editLastAIRequest(this)" class="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 bg-red-100/50 dark:bg-red-950/30 px-3 py-1.5 rounded-lg active:scale-95 transition-all focus:outline-none">Editar mensaje</button>
          </div>
        </div>
      `);
      return;
    }

    appendChatMessage("ai", result.response);

    if (result.action) {
      await ejecutarAccionIA(result.action, base64Image);
    }
  } catch (err) {
    console.error("Error processing AI command:", err);
    const loadingBubble = document.getElementById("voice-loading-bubble");
    if (loadingBubble) loadingBubble.remove();
    appendChatMessage("ai", null, `
      <div>
        <p class="text-red-600 dark:text-red-400">Error al comunicar con la IA: ${err.message}</p>
        <div class="flex flex-wrap gap-2 mt-3">
          <button onclick="window.retryLastAIRequest(this)" class="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 bg-red-100/50 dark:bg-red-950/30 px-3 py-1.5 rounded-lg active:scale-95 transition-all focus:outline-none">Reintentar</button>
          <button onclick="window.editLastAIRequest(this)" class="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 bg-red-100/50 dark:bg-red-950/30 px-3 py-1.5 rounded-lg active:scale-95 transition-all focus:outline-none">Editar mensaje</button>
        </div>
      </div>
    `);
  }
}

async function ejecutarAccionIA(action, base64Image = null) {
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
        appendChatMessage("system", `[OK] Egreso registrado: ${action.concepto} ($${action.monto})`);
      } else {
        appendChatMessage("system", `[Error] Error al registrar egreso: ${res.mensaje || 'Error desconocido'}`);
      }
    } catch (e) {
      appendChatMessage("system", `[Error] Excepción al registrar egreso: ${e.message}`);
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
    appendChatMessage("system", `Registrando equipo IMEI: ${action.nombre}...`);
    try {
      let productId = action.id_producto || "";
      
      // Formatear el nombre con specs para el producto celular
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

      // Si el Asistente recibió una foto (o si no tiene id_producto y queremos enlazarlo), buscaremos o crearemos una plantilla de producto
      if (!productId) {
        appendChatMessage("system", `Buscando o creando plantilla de producto para guardar la foto...`);
        const inv = await getInventario();
        const cleanName = finalProdName.toLowerCase().trim();
        const existingProd = inv.find(p => (p.nombre || "").toLowerCase().trim() === cleanName);
        
        if (existingProd) {
          productId = existingProd.id;
          appendChatMessage("system", `Plantilla existente encontrada: "${existingProd.nombre}"`);
        } else {
          productId = `PROD-${Date.now()}`;
          await crearProducto([
            productId,
            finalProdName,
            action.marca || action.brand || "Universal",
            "Celulares",
            "Físico",
            Number(action.costo || 0),
            Number(action.venta || action.precioVenta || 0),
            1,
            1, // Stock inicial
            "Vitrina",
            action.sku || "",
            base64Image || "", // Guardar el Base64 recibido de la foto aquí
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

      // Determinar nombre base y formatear con especificaciones si aplica
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

      // Mantener los valores anteriores si no se proveen en la acción
      const costo = action.costo !== undefined ? Number(action.costo) : p.costo;
      const precioVenta = action.precioVenta !== undefined ? Number(action.precioVenta) : p.precio_venta;
      const stockMinimo = action.stockMinimo !== undefined ? Number(action.stockMinimo) : p.stock_minimo;
      const stockActual = action.stockActual !== undefined ? Number(action.stockActual) : p.stock_actual;
      const sku = action.sku !== undefined ? action.sku : p.sku;
      const imagen = base64Image || p.imagen || "";

      // Estructura esperada por actualizarProducto: [id, nombre, marca, categoria, tipo, costo, precio_venta, stock_minimo, stock_actual, ubicacion, sku, imagen, fijado]
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
}

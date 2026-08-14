import { 
  setupAssistantEvents, 
  renderChatHistoryFromStorage, 
  appendChatMessage, 
  procesarTextoConIA, 
  clearReplyState, 
  startNewChatSession, 
  switchChatSession, 
  deleteChatSession, 
  getChatHistory, 
  getActiveChatId, 
  saveChatMessages 
} from "./agent-view.js";
import { showToast } from "../toast.js";
import { navigate } from "../router.js";

let _lastUserRequest = { text: "", images: null, replyContext: null };

// Bindings globales para el agente de IA
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
  if (btn) btn.remove();
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

window.clearReplyState = clearReplyState;
window.startNewChatSession = startNewChatSession;
window.switchChatSession = switchChatSession;
window.deleteChatSession = deleteChatSession;

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
    
    clearReplyState();
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

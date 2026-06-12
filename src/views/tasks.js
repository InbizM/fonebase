import { getTareas, crearTarea, updateTareaEstado, eliminarTarea } from "../api.js";
import { showToast, showConfirm } from "../toast.js";

let _tareas = [];
let _isLoaded = false;

export function initTasks() {
  return async () => {
    bindEvents();
    if (!_isLoaded) {
      await loadTasks();
      _isLoaded = true;
    }
  };
}

function bindEvents() {
  const btnNew = document.getElementById("task-new-btn");
  const btnClose = document.getElementById("task-modal-close");
  const btnBackdrop = document.getElementById("task-modal-backdrop");
  const form = document.getElementById("task-form");

  // Limpiar eventos anteriores para evitar duplicados
  btnNew?.replaceWith(btnNew.cloneNode(true));
  btnClose?.replaceWith(btnClose.cloneNode(true));
  btnBackdrop?.replaceWith(btnBackdrop.cloneNode(true));
  form?.replaceWith(form.cloneNode(true));

  document.getElementById("task-new-btn")?.addEventListener("click", openModal);
  document.getElementById("task-modal-close")?.addEventListener("click", closeModal);
  document.getElementById("task-modal-backdrop")?.addEventListener("click", closeModal);
  document.getElementById("task-form")?.addEventListener("submit", saveTask);

  // Inicializar selectores personalizados (después de clonar el formulario)
  window.setupCustomSelect("task-input-priority-container", "task-input-priority");
}

async function loadTasks() {
  const container = document.getElementById("task-list");
  try {
    let allTareas = await getTareas();
    const user = JSON.parse(localStorage.getItem("adminpro_user") || "{}");
    if (user.rol === "Técnico de reparación" || user.rol === "Vendedor") {
      _tareas = allTareas.filter(t => t.responsable === user.nombre);
    } else {
      _tareas = allTareas;
    }
    renderTasks();
  } catch (err) {
    container.innerHTML = `<li class="p-8 text-center text-error">Error: ${err.message}</li>`;
  }
}

function renderTasks() {
  const container = document.getElementById("task-list");
  if (!_tareas || _tareas.length === 0) {
    container.innerHTML = `<li class="p-12 text-center text-on-surface-variant italic text-sm">No hay tareas. ¡Buen trabajo!</li>`;
    return;
  }

  container.innerHTML = _tareas.map(t => {
    const isComp = t.estado === 'Completada';
    return `
      <li class="flex items-center gap-4 p-4 hover:bg-surface-container-low transition-colors group">
        <button onclick="window.toggleTaskStatus('${t.id}', '${t.estado}')" 
          class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all 
          ${isComp ? 'bg-green-500 border-green-500' : 'border-surface-variant hover:border-primary'}">
          ${isComp ? '<span class="material-symbols-outlined text-white text-[16px]">done</span>' : ''}
        </button>
        <div class="flex-1 min-w-0">
          <h4 class="font-bold text-sm ${isComp ? 'text-on-surface-variant line-through opacity-50' : 'text-on-surface'}">${t.tarea}</h4>
          <p class="text-[11px] text-on-surface-variant truncate">${t.notas || 'Sin notas'}</p>
        </div>
        <div class="text-right">
          <span class="text-[9px] font-black px-2 py-0.5 rounded-full ${getPriorityCls(t.prioridad)}">${t.prioridad}</span>
          <p class="text-[10px] text-on-surface-variant mt-1">${formatDate(t.fecha_vencimiento)}</p>
        </div>
        <button onclick="window.deleteTask('${t.id}')" class="p-2 text-on-surface-variant hover:text-error opacity-0 group-hover:opacity-100 transition-opacity">
          <span class="material-symbols-outlined text-[18px]">delete</span>
        </button>
      </li>
    `;
  }).join("");
}

function getPriorityCls(p) {
  if (p === 'Alta') return 'bg-red-100 text-red-700';
  if (p === 'Media') return 'bg-blue-100 text-blue-700';
  return 'bg-slate-100 text-slate-700';
}

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso + "T12:00:00").toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
}

function openModal() {
  const modal = document.getElementById("task-modal");
  document.getElementById("task-form").reset();
  
  // Sincronizar selector de prioridad
  window.syncCustomSelectUI("task-input-priority-container", "Media");

  // Poner fecha de hoy por defecto
  document.getElementById("task-input-date").value = new Date().toISOString().slice(0, 10);
  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function closeModal() {
  document.getElementById("task-modal").classList.add("hidden");
  document.getElementById("task-modal").classList.remove("flex");
}

async function saveTask(e) {
  e.preventDefault();
  const btn = document.getElementById("task-save-btn");
  btn.disabled = true;
  btn.innerHTML = "Guardando...";

  const t = {
    tarea: document.getElementById("task-input-title").value.trim(),
    fecha_inicio: new Date().toISOString().slice(0, 10),
    fecha_vencimiento: document.getElementById("task-input-date").value,
    prioridad: document.getElementById("task-input-priority").value,
    responsable: JSON.parse(localStorage.getItem("adminpro_user") || "{}").nombre || "Admin",
    notas: document.getElementById("task-input-notes").value.trim(),
    estado: 'Pendiente',
    color: getPriorityColor(document.getElementById("task-input-priority").value)
  };

  try {
    const res = await crearTarea(t);
    if (res) {
      showToast("Tarea creada", "success");
      closeModal();
      await loadTasks();
    }
  } catch (err) {
    showToast("Error al guardar", "error");
  } finally {
    btn.disabled = false;
    btn.innerHTML = `<span class="material-symbols-outlined text-[20px]">save</span> Guardar Tarea`;
  }
}

function getPriorityColor(p) {
  if (p === 'Alta') return '#ef4444';
  if (p === 'Media') return '#3b82f6';
  return '#64748b';
}

window.toggleTaskStatus = async (id, current) => {
  const nuevo = current === 'Completada' ? 'Pendiente' : 'Completada';
  try {
    await updateTareaEstado(id, nuevo);
    await loadTasks();
  } catch (err) { console.error(err); }
};

window.deleteTask = async (id) => {
  const ok = await showConfirm("Confirmación", "¿Eliminar tarea?");
  if (!ok) return;
  try {
    await eliminarTarea(id);
    await loadTasks();
  } catch (err) { console.error(err); }
};

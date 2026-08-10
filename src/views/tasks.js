import { getTareas, crearTarea, updateTareaEstado, eliminarTarea, getMetasProgreso, crearMeta, eliminarMeta } from "../api.js";
import { showToast, showConfirm } from "../toast.js";

let _tareas = [];
let _metas = [];
let _triggeredMetasThisSession = [];
let _isLoaded = false;

export function initTasks() {
  return async () => {
    bindEvents();
    await Promise.all([
      loadTasks(),
      loadMetas()
    ]);
  };
}

function bindEvents() {
  // Tasks bindings
  const btnNew = document.getElementById("task-new-btn");
  const btnClose = document.getElementById("task-modal-close");
  const btnBackdrop = document.getElementById("task-modal-backdrop");
  const form = document.getElementById("task-form");

  btnNew?.replaceWith(btnNew.cloneNode(true));
  btnClose?.replaceWith(btnClose.cloneNode(true));
  btnBackdrop?.replaceWith(btnBackdrop.cloneNode(true));
  form?.replaceWith(form.cloneNode(true));

  document.getElementById("task-new-btn")?.addEventListener("click", openModal);
  document.getElementById("task-modal-close")?.addEventListener("click", closeModal);
  document.getElementById("task-modal-backdrop")?.addEventListener("click", closeModal);
  document.getElementById("task-form")?.addEventListener("submit", saveTask);

  // Metas bindings
  const btnNewMeta = document.getElementById("meta-new-btn");
  const btnCloseMeta = document.getElementById("meta-modal-close");
  const btnBackdropMeta = document.getElementById("meta-modal-backdrop");
  const formMeta = document.getElementById("meta-form");

  btnNewMeta?.replaceWith(btnNewMeta.cloneNode(true));
  btnCloseMeta?.replaceWith(btnCloseMeta.cloneNode(true));
  btnBackdropMeta?.replaceWith(btnBackdropMeta.cloneNode(true));
  formMeta?.replaceWith(formMeta.cloneNode(true));

  document.getElementById("meta-new-btn")?.addEventListener("click", openMetaModal);
  document.getElementById("meta-modal-close")?.addEventListener("click", closeMetaModal);
  document.getElementById("meta-modal-backdrop")?.addEventListener("click", closeMetaModal);
  document.getElementById("meta-form")?.addEventListener("submit", saveMeta);

  // Custom Selects
  window.setupCustomSelect("task-input-priority-container", "task-input-priority");
  window.setupCustomSelect("meta-input-type-container", "meta-input-type");
}

async function loadTasks() {
  const container = document.getElementById("task-list");
  if (!container) return;
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
  if (!container) return;

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

async function loadMetas() {
  const container = document.getElementById("meta-list");
  if (!container) return;
  try {
    _metas = await getMetasProgreso();
    renderMetas();
    checkConfettiOnLoad();
  } catch (err) {
    container.innerHTML = `
      <div class="p-8 text-center text-error border border-error/20 bg-error/5 rounded-2xl text-sm">
        Error al cargar metas: ${err.message}
      </div>
    `;
  }
}

function renderMetas() {
  const container = document.getElementById("meta-list");
  if (!container) return;

  if (!_metas || _metas.length === 0) {
    container.innerHTML = `
      <div class="p-12 text-center text-on-surface-variant italic text-sm bg-surface-container-lowest border border-surface-variant rounded-2xl shadow-sm">
        <span class="material-symbols-outlined text-4xl mb-2 opacity-50" style="font-variation-settings:'FILL' 1">emoji_events</span>
        <p class="font-medium">No hay metas financieras configuradas</p>
      </div>
    `;
    return;
  }

  container.innerHTML = _metas.map(m => {
    const percent = Math.min(100, Math.max(0, m.porcentaje || 0));
    const isCompleted = percent >= 100;
    const formattedAcum = parseFloat(m.acumulado || 0).toLocaleString("es-CO");
    const formattedObj = parseFloat(m.monto_objetivo || 0).toLocaleString("es-CO");
    const startStr = formatDate(m.fecha_inicio);
    const limitStr = formatDate(m.fecha_limite);
    const percentDisplay = (m.porcentaje || 0).toFixed(1);

    let barColor = "from-amber-400 to-amber-500";
    if (percent >= 50 && percent < 100) {
      barColor = "from-blue-500 to-indigo-600";
    } else if (isCompleted) {
      barColor = "from-emerald-400 to-green-600 animate-pulse";
    }

    return `
      <div class="meta-card bg-surface-container-lowest border border-surface-variant rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer relative group flex flex-col gap-3" 
           data-id="${m.id_meta}" data-completed="${isCompleted}">
        
        <div class="flex justify-between items-start gap-4">
          <div class="min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <h4 class="font-black text-sm text-on-surface truncate">${m.titulo}</h4>
              <span class="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                m.tipo_calculo === 'Ventas' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
              }">${m.tipo_calculo === 'Ventas' ? 'Ventas' : 'Utilidad Neta'}</span>
            </div>
            <p class="text-[11px] text-on-surface-variant mt-1">${m.notas || 'Sin notas'}</p>
          </div>
          <button class="meta-del-btn p-1.5 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-full transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100 flex-shrink-0" 
                  data-id="${m.id_meta}" title="Eliminar Meta">
            <span class="material-symbols-outlined text-[18px]">delete</span>
          </button>
        </div>

        <div class="flex justify-between items-end text-xs font-semibold text-on-surface">
          <div>
            <span class="text-[10px] text-on-surface-variant block uppercase tracking-wider">Acumulado / Objetivo</span>
            <span class="text-sm font-black">$${formattedAcum}</span>
            <span class="text-on-surface-variant text-[11px] font-medium">/ $${formattedObj}</span>
          </div>
          <div class="text-right">
            <span class="text-sm font-black ${isCompleted ? 'text-green-600' : 'text-primary'}">${percentDisplay}%</span>
          </div>
        </div>

        <div class="w-full h-2 bg-surface-variant/30 rounded-full overflow-hidden">
          <div class="h-full bg-gradient-to-r ${barColor} rounded-full transition-all duration-1000 ease-out" 
               style="width: 0%;" data-target-width="${percent}%"></div>
        </div>

        <div class="flex justify-between items-center text-[10px] text-on-surface-variant font-mono border-t border-surface-variant/50 pt-2.5">
          <span>Inicio: ${startStr}</span>
          <span>Límite: ${limitStr}</span>
        </div>
      </div>
    `;
  }).join("");

  // Animate progress bars
  setTimeout(() => {
    document.querySelectorAll("#meta-list .meta-card .h-full").forEach(bar => {
      const targetWidth = bar.dataset.targetWidth;
      if (targetWidth) bar.style.width = targetWidth;
    });
  }, 100);

  // Click card event
  document.querySelectorAll("#meta-list .meta-card").forEach(card => {
    card.addEventListener("click", (e) => {
      if (e.target.closest(".meta-del-btn")) return;
      const isCompleted = card.dataset.completed === "true";
      if (isCompleted) {
        runConfetti();
        showToast("¡Meta completada! 🎯🏆 Gran esfuerzo.", "success");
      }
    });
  });

  // Delete event
  document.querySelectorAll("#meta-list .meta-del-btn").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      const id = btn.dataset.id;
      const ok = await showConfirm("Confirmación", "¿Estás seguro de eliminar esta meta financiera?");
      if (ok) {
        try {
          await eliminarMeta(id);
          showToast("Meta eliminada", "success");
          await loadMetas();
        } catch (err) {
          showToast("Error al eliminar meta", "error");
        }
      }
    });
  });
}

function checkConfettiOnLoad() {
  let triggerConfetti = false;
  _metas.forEach(m => {
    if (m.porcentaje >= 100) {
      if (!_triggeredMetasThisSession.includes(m.id_meta)) {
        _triggeredMetasThisSession.push(m.id_meta);
        triggerConfetti = true;
      }
    }
  });

  if (triggerConfetti) {
    setTimeout(() => {
      runConfetti();
      showToast("¡Felicitaciones! Has alcanzado una de tus metas financieras 🎯🏆", "success");
    }, 500);
  }
}

function runConfetti() {
  const canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "99999";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const resizeHandler = () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  };
  window.addEventListener("resize", resizeHandler);

  const colors = ["#f43f5e", "#3b82f6", "#eab308", "#10b981", "#8b5cf6", "#ff7849"];
  const particles = [];

  for (let i = 0; i < 120; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height - height,
      r: Math.random() * 6 + 4,
      d: Math.random() * height,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: Math.random() * 10 - 5,
      tiltAngleIncremental: Math.random() * 0.07 + 0.02,
      tiltAngle: 0
    });
  }

  let animationFrameId;
  const startTime = Date.now();

  function draw() {
    ctx.clearRect(0, 0, width, height);

    let active = false;
    particles.forEach((p) => {
      p.tiltAngle += p.tiltAngleIncremental;
      p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
      p.x += Math.sin(p.tiltAngle);
      p.tilt = Math.sin(p.tiltAngle - p.r / 2) * 5;

      if (p.y < height) {
        active = true;
      } else if (Date.now() - startTime < 3000) {
        p.y = -20;
        p.x = Math.random() * width;
        active = true;
      }

      ctx.beginPath();
      ctx.lineWidth = p.r;
      ctx.strokeStyle = p.color;
      ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
      ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
      ctx.stroke();
    });

    if (active) {
      animationFrameId = requestAnimationFrame(draw);
    } else {
      window.removeEventListener("resize", resizeHandler);
      canvas.remove();
    }
  }

  draw();

  setTimeout(() => {
    cancelAnimationFrame(animationFrameId);
    window.removeEventListener("resize", resizeHandler);
    canvas.remove();
  }, 5000);
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
  window.syncCustomSelectUI("task-input-priority-container", "Media");
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

function openMetaModal() {
  const modal = document.getElementById("meta-modal");
  document.getElementById("meta-form").reset();
  window.syncCustomSelectUI("meta-input-type-container", "Ventas");

  const today = new Date().toISOString().slice(0, 10);
  const end = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  document.getElementById("meta-input-start-date").value = today;
  document.getElementById("meta-input-end-date").value = end;

  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function closeMetaModal() {
  document.getElementById("meta-modal").classList.add("hidden");
  document.getElementById("meta-modal").classList.remove("flex");
}

async function saveMeta(e) {
  e.preventDefault();
  const btn = document.getElementById("meta-save-btn");
  btn.disabled = true;
  btn.innerHTML = "Guardando...";

  const target = parseFloat(document.getElementById("meta-input-target").value) || 0;
  if (target <= 0) {
    showToast("El monto objetivo debe ser mayor a 0", "warning");
    btn.disabled = false;
    btn.innerHTML = `<span class="material-symbols-outlined text-[20px]">save</span> Guardar Meta`;
    return;
  }

  const startDate = document.getElementById("meta-input-start-date").value;
  const endDate = document.getElementById("meta-input-end-date").value;

  if (new Date(startDate) > new Date(endDate)) {
    showToast("La fecha de inicio no puede ser posterior a la fecha límite", "warning");
    btn.disabled = false;
    btn.innerHTML = `<span class="material-symbols-outlined text-[20px]">save</span> Guardar Meta`;
    return;
  }

  const m = {
    titulo: document.getElementById("meta-input-title").value.trim(),
    monto_objetivo: target,
    tipo_calculo: document.getElementById("meta-input-type").value,
    fecha_inicio: startDate,
    fecha_limite: endDate,
    notas: document.getElementById("meta-input-notes").value.trim(),
    estado: 'Activa'
  };

  try {
    const res = await crearMeta(m);
    if (res) {
      showToast("Meta financiera creada exitosamente", "success");
      closeMetaModal();
      await loadMetas();
    }
  } catch (err) {
    showToast("Error al guardar meta", "error");
  } finally {
    btn.disabled = false;
    btn.innerHTML = `<span class="material-symbols-outlined text-[20px]">save</span> Guardar Meta`;
  }
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

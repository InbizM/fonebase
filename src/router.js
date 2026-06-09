// router.js — SPA router that shows/hides view containers
// Each view is a <section id="view-xxx"> in index.html

const views = {};
let activeViewId = null;
let onChangeCallback = null;
let beforeNavigateCallback = null;

export function registerView(id, loadFn) {
  views[id] = loadFn;
}

export function onRouteChange(cb) {
  onChangeCallback = cb;
}

export function onBeforeRoute(cb) {
  beforeNavigateCallback = cb;
}

export async function navigate(viewId) {
  if (beforeNavigateCallback) {
    const overrideView = beforeNavigateCallback(viewId);
    if (overrideView === false) return; // cancelled
    if (typeof overrideView === 'string') viewId = overrideView; // redirect
  }
  
  // Hide all views
  document.querySelectorAll("[data-view]").forEach((el) => {
    el.classList.add("hidden");
  });

  const target = document.querySelector(`[data-view="${viewId}"]`);
  if (!target) {
    console.warn("View not found:", viewId);
    if (viewId !== 'dashboard') return navigate('dashboard');
    return;
  }

  target.classList.remove("hidden");
  activeViewId = viewId;

  // Sync URL hash without triggering popstate
  if (window.location.hash !== `#${viewId}`) {
    window.history.pushState(null, '', `#${viewId}`);
  }

  if (onChangeCallback) onChangeCallback(viewId);

  // Call the view's load function if registered
  if (views[viewId]) {
    await views[viewId]();
  }
}

export function getActiveView() {
  return activeViewId;
}

// Handle browser back/forward buttons and manual hash changes
window.addEventListener('popstate', () => {
  const hash = window.location.hash.replace('#', '');
  if (hash && hash !== activeViewId) {
    navigate(hash);
  }
});

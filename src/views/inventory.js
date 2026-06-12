import { getInventario, crearProducto, actualizarProducto, eliminarProducto, uploadFoto, analyzeLabelImage, analyzeImeiLabel } from "../api.js";

async function compressImage(base64Str, maxWidth = 1024, maxHeight = 1024, quality = 0.75) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = (err) => reject(err);
    img.src = base64Str;
  });
}
import { showToast, showConfirm } from "../toast.js";
import { openScanner } from "../scanner.js";

function parseInventoryOCR(text) {
  const lines = text.split("\n").map(l => l.trim()).filter(l => l.length > 2);
  let name = "";
  let brand = "";
  let sku = "";
  let cost = "";
  let price = "";
  let ram = "";
  let memoria = "";
  let color = "";

  // 1. Detect Brand (Marca)
  const brandKeywords = {
    "Samsung": ["Samsung"],
    "Apple": ["Apple", "iPhone", "iPad", "MacBook"],
    "Xiaomi": ["Xiaomi", "Redmi", "Poco"],
    "Motorola": ["Motorola", "Moto"],
    "Huawei": ["Huawei"],
    "Oppo": ["Oppo"],
    "Vivo": ["Vivo"],
    "Realme": ["Realme"],
    "Infinix": ["Infinix"],
    "Tecno": ["Tecno"],
    "Nokia": ["Nokia"],
    "OnePlus": ["OnePlus"],
    "Google": ["Google", "Pixel"],
    "Sony": ["Sony"],
    "LG": ["LG"]
  };

  for (const [b, keywords] of Object.entries(brandKeywords)) {
    if (keywords.some(kw => new RegExp(`\\b${kw}\\b`, "i").test(text))) {
      brand = b;
      break;
    }
  }

  // 2. Detect Prices
  const priceRegex = /(?:\$\s*)?(\b\d{1,3}(?:[.,]\d{3})+(?:\b|\s)|(?:\b\d{5,8}\b))/g;
  let match;
  const foundNumbers = [];
  while ((match = priceRegex.exec(text)) !== null) {
    const numStr = match[1].replace(/\D/g, "");
    const num = parseInt(numStr, 10);
    if (num >= 5000 && num <= 10000000) {
      foundNumbers.push(num);
    }
  }
  const uniqueNumbers = [...new Set(foundNumbers)].sort((a, b) => a - b);
  if (uniqueNumbers.length >= 2) {
    cost = uniqueNumbers[0];
    price = uniqueNumbers[uniqueNumbers.length - 1];
  } else if (uniqueNumbers.length === 1) {
    price = uniqueNumbers[0];
  }

  // 3. Detect SKU / Model number
  const skuRegex = /\b(?:SM-[A-Z0-9]+|[A-Z0-9]{2,12}-[A-Z0-9]{1,5}|(?!\b\d+\b)(?!\b[A-Z]+\b)(?!\b\d+(?:GB|TB|G|T)\b)[A-Z0-9]{5,12})\b/i;
  const skuMatch = skuRegex.exec(text);
  if (skuMatch) {
    sku = skuMatch[0];
  }

  // 4. Detect RAM and Storage (Memory)
  const gbRegex = /\b(\d+)\s*(?:GB|TB|G|T)\b/gi;
  const sizes = [];
  while ((match = gbRegex.exec(text)) !== null) {
    const matchIndex = match.index;
    if (matchIndex > 0 && (text[matchIndex - 1] === '.' || text[matchIndex - 1] === ',')) {
      continue;
    }

    const rawVal = match[0].trim().toUpperCase();
    const value = parseInt(match[1], 10);
    
    // Ignore network indicators: 2G, 3G, 4G, 5G
    if (/^[2-5]\s*G$/i.test(rawVal)) {
      continue;
    }

    const unit = match[0].toUpperCase();
    const multiplier = unit.includes("T") ? 1024 : 1;
    sizes.push({ raw: match[0].trim(), value: value * multiplier, originalNumber: value, unit: unit.includes("T") ? "TB" : "GB" });
  }
  
  const uniqueSizes = [];
  const seenValues = new Set();
  for (const s of sizes) {
    if (!seenValues.has(s.value)) {
      seenValues.add(s.value);
      uniqueSizes.push(s);
    }
  }
  uniqueSizes.sort((a, b) => a.value - b.value);

  if (uniqueSizes.length >= 2) {
    ram = `${uniqueSizes[0].originalNumber}${uniqueSizes[0].unit}`;
    memoria = `${uniqueSizes[1].originalNumber}${uniqueSizes[1].unit}`;
  } else if (uniqueSizes.length === 1) {
    if (uniqueSizes[0].value >= 32) {
      memoria = `${uniqueSizes[0].originalNumber}${uniqueSizes[0].unit}`;
    } else {
      ram = `${uniqueSizes[0].originalNumber}${uniqueSizes[0].unit}`;
    }
  }

  // 5. Detect Color
  const colorMap = {
    "titanio natural": "Titanio Natural", "natural titanium": "Titanio Natural",
    "titanio azul": "Titanio Azul", "blue titanium": "Titanio Azul", "titanium blue": "Titanio Azul",
    "titanio gris": "Titanio Gris", "gray titanium": "Titanio Gris", "grey titanium": "Titanio Gris", "titanium gray": "Titanio Gris", "titanium grey": "Titanio Gris",
    "titanio negro": "Titanio Negro", "black titanium": "Titanio Negro", "titanium black": "Titanio Negro",
    "negro espacial": "Negro Espacial", "space black": "Negro Espacial", "space gray": "Gris Espacial", "space grey": "Gris Espacial",
    
    "negro": "Negro", "black": "Negro", "dark": "Negro", "space": "Negro Espacial",
    "azul": "Azul", "blue": "Azul",
    "gris": "Gris", "gray": "Gris", "grey": "Gris", "silver": "Plata", "plata": "Plata",
    "blanco": "Blanco", "white": "Blanco",
    "verde": "Verde", "green": "Verde",
    "rojo": "Rojo", "red": "Rojo",
    "oro": "Oro", "gold": "Oro",
    "morado": "Morado", "purple": "Morado",
    "titanio": "Titanio", "titanium": "Titanio", "natural": "Titanio Natural",
    "rosa": "Rosa", "rose": "Rosa", "pink": "Rosa",
    "amarillo": "Amarillo", "yellow": "Amarillo",
    "bronce": "Bronce", "bronze": "Bronce"
  };
  const textLower = text.toLowerCase();
  for (const [key, value] of Object.entries(colorMap)) {
    if (textLower.includes(key)) {
      color = value;
      break;
    }
  }

  // 6. Detect Product Name
  const noiseWords = ["imei", "s/n", "serial", "made in", "fcc", "fccid", "model", "sku", "ic:", "label", "ic-", "designed", "china", "vietnam", "cost", "price", "venta", "costo", "ram", "rom", "color"];
  const candidates = lines.filter(line => {
    const lower = line.toLowerCase();
    if (noiseWords.some(w => lower.includes(w))) return false;
    if (!/[a-zA-Z]/.test(line)) return false;
    return true;
  });

  if (candidates.length > 0) {
    name = candidates[0];
    if (brand) {
      name = name.replace(new RegExp(`^${brand}\\s*`, "i"), "");
    }
    name = name.replace(/\b\d+\s*(?:GB|TB|G|T)\b/gi, "");
    for (const c of Object.keys(colorMap)) {
      name = name.replace(new RegExp(`\\b${c}\\b`, "gi"), "");
    }
    name = name.replace(/[\s,\-\(\)]+$/, "").replace(/^[\s,\-\(\)]+/, "").trim();
  }

  return { name, brand, sku, cost, price, ram, memoria, color };
}

let productos = [];
let filteredProductos = [];
let editingId = null;
let _viewMode = 'grid';
let _selectedScanImages = [];

const CATEGORIA_COLORS = {
  Celular: "text-tertiary bg-tertiary-fixed/60",
  Accesorio: "text-secondary bg-surface-variant",
  Audio: "text-purple-700 bg-purple-100",
  Tablet: "text-indigo-700 bg-indigo-100",
};

function stockBadge(actual, minimo) {
  const n = Number(actual);
  const m = Number(minimo);
  if (n === 0) return { label: "Sin Stock", cls: "bg-red-100 text-red-800 border-red-200", icon: "block" };
  if (n <= m)  return { label: `Bajo: ${n}`, cls: "bg-amber-100 text-amber-800 border-amber-200", icon: "warning" };
  return       { label: `OK: ${n}`,    cls: "bg-emerald-100 text-emerald-800 border-emerald-200", icon: "check_circle" };
}

function cardHtml(p) {
  const badge = stockBadge(p.stock_actual, p.stock_minimo);
  const catCls = CATEGORIA_COLORS[p.categoria] || "text-secondary bg-surface-variant";
  const isOut  = Number(p.stock_actual) === 0;
  const isReventa = (p.tipo || '').toLowerCase() === 'reventa';
  const precio = Number(String(p.precio_venta || 0).replace(/\D/g, "")).toLocaleString("es-CO");
  const costo  = Number(String(p.costo || 0).replace(/\D/g, "")).toLocaleString("es-CO");

  return `
    <div data-id="${p.id}" onclick="inventoryView.openDetail('${p.id}')" class="bg-surface-container-lowest border ${isReventa ? 'border-indigo-200' : 'border-surface-variant'} rounded-xl overflow-hidden
         group hover:shadow-[0_12px_24px_rgba(189,0,48,0.08)] hover:border-outline-variant
         transition-all duration-300 flex flex-col relative cursor-pointer ${isOut ? "opacity-75" : ""}"
    >
      <!-- Status badge -->
      <div class="absolute top-3 right-3 z-10 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider
           border backdrop-blur-sm ${badge.cls}">${badge.label}</div>
      ${isReventa ? `<div class="absolute top-3 left-3 z-10 px-2 py-1 bg-indigo-600 text-white rounded text-[10px] font-bold uppercase tracking-wider">🔄 Reventa</div>` : ''}
      <!-- Image -->
      <div class="h-36 bg-surface-container flex items-center justify-center p-4 relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-tr from-surface-container-high to-surface-container-lowest opacity-50"></div>
        ${p.imagen
          ? `<img src="${p.imagen}" alt="${p.nombre}" referrerpolicy="no-referrer" class="h-full w-full object-contain relative z-10 drop-shadow-md">`
          : `<span class="material-symbols-outlined text-5xl text-on-surface-variant/30 relative z-10">inventory_2</span>`}
      </div>
      <!-- Content -->
      <div class="p-3 flex flex-col flex-1">
        <div class="flex justify-between items-start mb-1">
          <span class="text-[10px] font-medium tracking-widest text-secondary">${p.sku || p.id}</span>
          <span class="text-[10px] font-semibold px-1.5 py-0.5 rounded-sm ${catCls}">${p.categoria}</span>
        </div>
        <h3 class="font-semibold text-sm text-on-surface leading-tight mt-1 mb-0.5">${p.nombre}</h3>
        <span class="text-[11px] text-on-surface-variant mb-2">${p.marca || '—'}</span>
        <div class="mt-auto grid grid-cols-3 gap-1 border-t border-surface-variant pt-2 mb-2">
          <div>
            <p class="text-[9px] text-on-surface-variant mb-0">Costo</p>
            <p class="font-medium text-xs text-on-surface-variant">$${costo}</p>
          </div>
          <div>
            <p class="text-[9px] text-on-surface-variant mb-0">Venta</p>
            <p class="font-semibold text-xs text-on-surface">$${precio}</p>
          </div>
          <div>
            <p class="text-[9px] text-on-surface-variant mb-0">Stock</p>
            <p class="font-bold text-xs text-on-surface">${p.stock_actual ?? '—'}</p>
          </div>
        </div>
        ${p.ubicacion ? `<p class="text-[10px] text-on-surface-variant truncate"><span class="material-symbols-outlined text-[11px] align-middle">location_on</span> ${p.ubicacion}</p>` : ''}
        <!-- Actions -->
        <div class="flex gap-1.5 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button onclick="event.stopPropagation(); inventoryView.openEdit('${p.id}')"
            class="flex-1 px-2 py-1.5 bg-surface text-primary border border-surface-variant rounded-md
                   hover:bg-primary/10 transition-colors flex items-center justify-center gap-1 text-xs font-medium">
            <span class="material-symbols-outlined text-[14px]">edit</span> Editar
          </button>
          <button onclick="event.stopPropagation(); inventoryView.deleteProduct('${p.id}')"
            class="px-2 py-1.5 bg-surface text-on-surface-variant border border-surface-variant rounded-md
                   hover:bg-error-container hover:text-error hover:border-error-container
                   transition-colors flex items-center justify-center">
            <span class="material-symbols-outlined text-[14px]">delete</span>
          </button>
        </div>
      </div>
    </div>`;
}

function renderGrid() {
  const grid = document.getElementById("inv-grid");
  const tableWrap = document.getElementById("inv-table-wrapper");
  const tableBody = document.getElementById("inv-table-body");
  if (!grid) return;

  const user = JSON.parse(localStorage.getItem("adminpro_user") || "{}");
  const isAdmin = user.rol === "Administrador";
  const isTecnico = user.rol === "Técnico de reparación";

  if (_viewMode === 'grid') {
    tableWrap.classList.add('hidden');
    grid.classList.remove('hidden');
    grid.innerHTML = filteredProductos.length
      ? filteredProductos.map(p => {
          const badge = stockBadge(p.stockActual, p.stockMinimo);
          const isOut = Number(p.stockActual) === 0;
          const precio = Number(String(p.precioVenta).replace(/\D/g, "")).toLocaleString("es-CO");
          return `
            <div onclick="inventoryView.openDetail('${p.id}')" class="bg-surface-container-lowest border border-surface-variant rounded-2xl p-4 shadow-sm hover:shadow-md transition-all group flex flex-col cursor-pointer ${isOut ? 'opacity-70 grayscale-[0.5]' : ''}">
              <div class="flex items-start gap-4 mb-4">
                <div class="w-16 h-16 rounded-xl bg-surface-container flex items-center justify-center overflow-hidden flex-shrink-0">
                  ${p.imagen ? `<img src="${p.imagen}" class="w-full h-full object-cover">` : `<span class="material-symbols-outlined text-3xl text-on-surface-variant/40">image</span>`}
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex justify-between items-start gap-2 mb-1">
                    <h3 class="font-bold text-on-surface text-sm truncate" title="${p.nombre}">${p.nombre}</h3>
                    <span class="px-2 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase border whitespace-nowrap ${badge.cls}">${badge.label}</span>
                  </div>
                  <p class="text-[10px] uppercase font-bold text-on-surface-variant mb-1">${p.marca || '-'}</p>
                  <p class="font-mono text-xs font-bold text-on-surface-variant/70 mb-2 truncate" title="${p.sku || p.id}">${p.sku || p.id}</p>
                </div>
              </div>
              <div class="flex items-end justify-between mt-auto pt-3 border-t border-surface-variant/50">
                ${isTecnico ? '<div></div>' : `<div>
                  <p class="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/60 mb-0.5">Precio Venta</p>
                  <p class="font-black text-primary text-lg leading-none">$${precio}</p>
                </div>`}
                <div class="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  ${isAdmin ? `<button onclick="event.stopPropagation(); inventoryView.openEdit('${p.id}')" class="p-2 bg-surface border border-surface-variant rounded-xl text-primary hover:bg-primary/10 transition-colors" title="Editar">
                    <span class="material-symbols-outlined text-[18px]">edit</span>
                  </button>` : ''}
                  ${isAdmin ? `<button onclick="event.stopPropagation(); inventoryView.deleteProduct('${p.id}')" class="p-2 bg-surface border border-surface-variant rounded-xl text-error hover:bg-error/10 transition-colors" title="Eliminar">
                    <span class="material-symbols-outlined text-[18px]">delete</span>
                  </button>` : ''}
                </div>
              </div>
            </div>
          `;
        }).join("")
      : `<div class="col-span-full text-center py-20 text-on-surface-variant">
           <span class="material-symbols-outlined text-5xl">search_off</span>
           <p class="mt-2 font-semibold">No hay productos que coincidan.</p>
         </div>`;
  } else {
    grid.classList.add('hidden');
    tableWrap.classList.remove('hidden');
    tableBody.innerHTML = filteredProductos.length
      ? filteredProductos.map(p => {
          const badge = stockBadge(p.stockActual, p.stockMinimo);
          const isOut = Number(p.stockActual) === 0;
          const precio = Number(String(p.precioVenta).replace(/\D/g, "")).toLocaleString("es-CO");
          const costo  = Number(String(p.costo || 0).replace(/\D/g, "")).toLocaleString("es-CO");
          return `
            <tr onclick="inventoryView.openDetail('${p.id}')" class="hover:bg-surface-container-low transition-colors cursor-pointer ${isOut ? 'opacity-70' : ''}">
              <td class="px-4 py-3">
                ${p.imagen ? `<img src="${p.imagen}" class="w-8 h-8 rounded object-cover">` : `<div class="w-8 h-8 rounded bg-surface-container flex items-center justify-center"><span class="material-symbols-outlined text-[16px] text-on-surface-variant/50">inventory_2</span></div>`}
              </td>
              <td class="px-4 py-3">
                <p class="font-bold text-sm text-on-surface">${p.nombre}</p>
                <p class="text-[10px] text-on-surface-variant">${p.marca || '-'}</p>
              </td>
              <td class="px-4 py-3 font-mono text-xs font-bold text-on-surface-variant">${p.sku || p.id}</td>
              <td class="px-4 py-3 text-xs text-on-surface-variant">${p.categoria}</td>
              <td class="px-4 py-3">
                <span class="px-2 py-1 rounded text-[10px] font-bold tracking-wider uppercase border ${badge.cls}">${badge.label}</span>
              </td>
              <td class="px-4 py-3 text-xs text-on-surface-variant">${isTecnico ? 'N/A' : `$${costo}`}</td>
              <td class="px-4 py-3 font-bold text-primary">${isTecnico ? 'N/A' : `$${precio}`}</td>
              <td class="px-4 py-3 text-xs text-on-surface-variant">${p.ubicacion || '—'}</td>
              <td class="px-4 py-3 text-right">
                ${isAdmin ? `<button onclick="event.stopPropagation(); inventoryView.openEdit('${p.id}')" class="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Editar">
                  <span class="material-symbols-outlined text-[18px]">edit</span>
                </button>` : ''}
                ${isAdmin ? `<button onclick="event.stopPropagation(); inventoryView.deleteProduct('${p.id}')" class="p-1.5 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-lg transition-colors" title="Eliminar">
                  <span class="material-symbols-outlined text-[18px]">delete</span>
                </button>` : ''}
              </td>
            </tr>
          `;
        }).join("")
      : `<tr><td colspan="6" class="text-center py-10 text-on-surface-variant">No hay productos</td></tr>`;
  }

  // Update stats
  const totalEl = document.getElementById("inv-stat-total");
  const alertEl = document.getElementById("inv-stat-alert");
  if (totalEl) totalEl.textContent = productos.length.toLocaleString();
  if (alertEl) alertEl.textContent = productos.filter(p => Number(p.stockActual) <= Number(p.stockMinimo)).length;
}

function applyFilter() {
  const q = (document.getElementById("inv-search")?.value || "").toLowerCase();
  const cat = document.getElementById("inv-filter-cat")?.value || "";
  const tipo = document.getElementById("inv-filter-tipo")?.value || "";
  filteredProductos = productos.filter(p =>
    (!q || [p.nombre, p.marca, p.sku, p.id].some(v => String(v).toLowerCase().includes(q))) &&
    (!cat || p.categoria === cat) &&
    (!tipo || (p.tipo || '') === tipo)
  );
  renderGrid();
}

// ---- Modal ----
function openModal(title) {
  document.getElementById("inv-modal-title").textContent = title;
  document.getElementById("inv-modal").classList.remove("hidden");
  document.getElementById("inv-modal").classList.add("flex");
}

function toggleSpecsContainer() {
  const catInput = document.getElementById("inv-categoria");
  const specsContainer = document.getElementById("inv-specs-container");
  if (!catInput || !specsContainer) return;
  const val = (catInput.value || "").trim().toLowerCase();
  
  const isPhone = val === "celular" || val === "celulares" || val === "telefono" || val === "teléfono" || val === "telefonos" || val === "teléfonos" || val === "movil" || val === "móvil" || val === "moviles" || val === "móviles";
  
  if (val === "" || isPhone) {
    specsContainer.classList.remove("hidden");
  } else {
    specsContainer.classList.add("hidden");
  }
}

function closeModal() {
  document.getElementById("inv-modal").classList.add("hidden");
  document.getElementById("inv-modal").classList.remove("flex");
  editingId = null;
  window.__posReventaMode = false;
  document.getElementById("inv-form").reset();
  document.getElementById("inv-img-preview").innerHTML =
    `<span class="material-symbols-outlined text-3xl text-on-surface-variant/40">add_photo_alternate</span>`;
  
  const aiSection = document.getElementById("inv-ai-copy-section");
  if (aiSection) {
    aiSection.classList.add("hidden");
    document.getElementById("inv-ai-desc").value = "";
    document.getElementById("inv-ai-ad").value = "";
  }
  
  _selectedScanImages = [];
  renderScanThumbnails();
  
  toggleSpecsContainer();
}

function previewImg(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    document.getElementById("inv-img-preview").innerHTML =
      `<img src="${ev.target.result}" class="w-full h-full object-cover">`;
  };
  reader.readAsDataURL(file);
}

async function saveProduct() {
  const btn = document.getElementById("inv-save-btn");
  btn.disabled = true;
  btn.innerHTML = `<span class="material-symbols-outlined animate-spin text-[18px]">progress_activity</span> Guardando...`;

  try {
    let imagenUrl = document.getElementById("inv-existing-img").value;
    const fileInput = document.getElementById("inv-img-file");

    if (fileInput.files[0]) {
      const file = fileInput.files[0];
      btn.innerHTML = `<span class="material-symbols-outlined animate-spin text-[18px]">progress_activity</span> Subiendo foto...`;
      const reader = new FileReader();
      imagenUrl = await new Promise((resolve, reject) => {
        reader.onload = async (ev) => {
          try {
            const res = await uploadFoto(ev.target.result, file.name, file.type);
            resolve(res.url || res);
          } catch (err) { reject(err); }
        };
        reader.readAsDataURL(file);
      });
    }

    const nombreBase = document.getElementById("inv-nombre").value.trim();
    const categoria = document.getElementById("inv-categoria").value.trim();
    const ram = document.getElementById("inv-ram") ? document.getElementById("inv-ram").value.trim() : "";
    const memoria = document.getElementById("inv-memoria") ? document.getElementById("inv-memoria").value.trim() : "";
    const color = document.getElementById("inv-color") ? document.getElementById("inv-color").value.trim() : "";

    let nombreFinal = nombreBase;
    const catLower = categoria.toLowerCase();
    if ((catLower === "celular" || catLower === "celulares") && (ram || memoria || color)) {
      const specs = [];
      if (ram) {
        specs.push(ram.toUpperCase().includes("RAM") ? ram : `${ram} RAM`);
      }
      if (memoria) specs.push(memoria);
      if (color) specs.push(color);
      
      if (specs.length > 0) {
        nombreFinal = `${nombreBase} (${specs.join(" / ")})`;
      }
    }

    const datos = [
      document.getElementById("inv-id").value,
      nombreFinal,
      document.getElementById("inv-marca").value,
      categoria,
      document.getElementById("inv-tipo").value,
      document.getElementById("inv-costo").value.replace(/\D/g, ""),
      document.getElementById("inv-venta").value.replace(/\D/g, ""),
      document.getElementById("inv-stock-min").value,
      document.getElementById("inv-stock-act").value,
      document.getElementById("inv-ubicacion").value,
      document.getElementById("inv-sku").value,
      imagenUrl,
    ];

    let res;
    if (editingId) {
      res = await actualizarProducto(editingId, datos);
    } else {
      res = await crearProducto(datos);
    }

    showToast(res.mensaje || "Guardado correctamente", res.success ? "success" : "error");
    if (res.success) {
      // If this was opened from POS as a Reventa, add product to the cart
      if (window.__posReventaMode && !editingId) {
        const product = {
          id: datos[0],
          nombre: datos[1],
          marca: datos[2],
          categoria: datos[3],
          costo: datos[5],
          precioVenta: datos[6],
        };
        if (typeof window.__posAddReventaToCart === "function") {
          window.__posAddReventaToCart(product);
        }
        window.__posReventaMode = false;
      }
      closeModal();
      if (typeof window.__onProductCreated === "function" && !editingId) {
        window.__onProductCreated({
          id: datos[0],
          nombre: datos[1],
          marca: datos[2],
          categoria: datos[3],
          costo: datos[5],
          precioVenta: datos[6]
        });
      }
      await loadInventario();
    }
  } catch (err) {
    showToast("Error: " + err.message, "error");
  } finally {
    btn.disabled = false;
    btn.innerHTML = `<span class="material-symbols-outlined text-[18px]">save</span> Guardar`;
  }
}

// ---- Public interface (called from HTML onclick) ----
let _detailId = null;

window.inventoryView = {
  openDetail(id) {
    const p = productos.find(x => x.id === id);
    if (!p) return;
    _detailId = id;
    const fmt = v => Number(String(v || 0).replace(/\D/g, "")||0).toLocaleString("es-CO");
    const user = JSON.parse(localStorage.getItem("adminpro_user") || "{}");
    const isTecnico = user.rol === "Técnico de reparación";

    // Populate detail modal
    document.getElementById("inv-d-nombre").textContent    = p.nombre || '—';
    document.getElementById("inv-d-marca").textContent     = p.marca || '—';
    document.getElementById("inv-d-cat").textContent       = p.categoria || '—';
    document.getElementById("inv-d-costo").textContent     = isTecnico ? "N/A" : `$${fmt(p.costo)}`;
    document.getElementById("inv-d-venta").textContent     = isTecnico ? "N/A" : `$${fmt(p.precioVenta)}`;
    document.getElementById("inv-d-stock").textContent     = p.stockActual ?? '—';
    document.getElementById("inv-d-stockmin").textContent  = p.stockMinimo ?? '—';
    document.getElementById("inv-d-tipo").textContent      = p.tipo || '—';
    document.getElementById("inv-d-ubicacion").textContent = p.ubicacion || '—';
    document.getElementById("inv-d-sku").textContent       = p.sku || p.id || '—';
    const imgWrap = document.getElementById("inv-detail-img-wrap");
    const img = document.getElementById("inv-detail-img");
    if (p.imagen) { img.src = p.imagen; imgWrap.classList.remove("hidden"); }
    else { imgWrap.classList.add("hidden"); }
    
    const isAdmin = user.rol === "Administrador";
    const editBtn = document.getElementById("inv-detail-edit-btn");
    if (editBtn) {
      if (isAdmin) editBtn.classList.remove("hidden");
      else editBtn.classList.add("hidden");
    }

    const dm = document.getElementById("inv-detail-modal");
    dm.classList.remove("hidden"); dm.classList.add("flex");
  },
  openEdit(id) {
    const p = productos.find(x => x.id === id);
    if (!p) return;
    editingId = id;
    
    _selectedScanImages = [];
    renderScanThumbnails();
    
    // Close detail modal if open
    const dm = document.getElementById("inv-detail-modal");
    dm.classList.add("hidden"); dm.classList.remove("flex");

    let nombreBase = p.nombre || "";
    let ramVal = "";
    let memoriaVal = "";
    let colorVal = "";

    const catLower = (p.categoria || "").trim().toLowerCase();
    if (catLower === "celular" || catLower === "celulares") {
      const specRegex = /\(([^/)]+)(?:\s*\/\s*([^/)]+))?(?:\s*\/\s*([^/)]+))?\)$/;
      const match = nombreBase.match(specRegex);
      if (match) {
        nombreBase = nombreBase.replace(specRegex, "").trim();
        const parts = [match[1], match[2], match[3]].filter(Boolean).map(x => x.trim());
        if (parts.length === 3) {
          ramVal = parts[0];
          memoriaVal = parts[1];
          colorVal = parts[2];
        } else if (parts.length === 2) {
          if (parts[0].toLowerCase().includes("ram")) {
            ramVal = parts[0];
            memoriaVal = parts[1];
          } else if (parts[1].toLowerCase().includes("ram")) {
            ramVal = parts[1];
            memoriaVal = parts[0];
          } else {
            if (/\b\d+\s*(?:GB|TB)\b/i.test(parts[0])) {
              memoriaVal = parts[0];
              colorVal = parts[1];
            } else {
              memoriaVal = parts[0];
              colorVal = parts[1];
            }
          }
        } else if (parts.length === 1) {
          if (parts[0].toLowerCase().includes("ram")) {
            ramVal = parts[0];
          } else if (/\b\d+\s*(?:GB|TB)\b/i.test(parts[0])) {
            memoriaVal = parts[0];
          } else {
            colorVal = parts[0];
          }
        }
      }
    }

    if (ramVal) {
      ramVal = ramVal.replace(/\s*RAM\b/gi, "").trim();
    }

    document.getElementById("inv-id").value = p.id;
    document.getElementById("inv-nombre").value = nombreBase;
    document.getElementById("inv-ram").value = ramVal;
    document.getElementById("inv-memoria").value = memoriaVal;
    document.getElementById("inv-color").value = colorVal;
    document.getElementById("inv-marca").value = p.marca || "";
    document.getElementById("inv-categoria").value = p.categoria || "";
    document.getElementById("inv-tipo").value = p.tipo || "Físico";
    document.getElementById("inv-costo").value = p.costo ? new Intl.NumberFormat("es-CO").format(p.costo) : "";
    document.getElementById("inv-venta").value = p.precioVenta ? new Intl.NumberFormat("es-CO").format(p.precioVenta) : "";
    document.getElementById("inv-stock-min").value = p.stockMinimo ?? "";
    document.getElementById("inv-stock-act").value = p.stockActual ?? "";
    document.getElementById("inv-ubicacion").value = p.ubicacion || "";
    document.getElementById("inv-sku").value = p.sku || "";
    document.getElementById("inv-existing-img").value = p.imagen || "";
    if (p.imagen) {
      document.getElementById("inv-img-preview").innerHTML =
        `<img src="${p.imagen}" class="w-full h-full object-cover">`;
    }
    openModal("Editar Producto");
    toggleSpecsContainer();
  },
  async deleteProduct(id) {
    const ok = await showConfirm("Confirmación", "¿Eliminar este producto?");
    if (!ok) return;
    try {
      const res = await eliminarProducto(id);
      showToast(res.mensaje || "Eliminado", res.success ? "success" : "error");
      if (res.success) await loadInventario();
    } catch (err) { showToast("Error: " + err.message, "error"); }
  },
  openNuevo(isReventa = false, defaultCategory = "") {
    editingId = null;
    
    _selectedScanImages = [];
    renderScanThumbnails();
    
    document.getElementById("inv-form")?.reset();
    document.getElementById("inv-tipo").value = isReventa ? "Reventa" : "Físico";
    document.getElementById("inv-existing-img").value = "";
    document.getElementById("inv-img-preview").innerHTML =
      `<span class="material-symbols-outlined text-3xl text-on-surface-variant/40">add_photo_alternate</span>`;
    
    if (defaultCategory) {
      document.getElementById("inv-categoria").value = defaultCategory;
    }
    
    if (isReventa) {
      document.getElementById("inv-id").value = "REV-" + Date.now().toString().slice(-6);
    }
    
    openModal(isReventa ? "Nueva Reventa" : "Nuevo Producto");
    toggleSpecsContainer();
  }
};

async function loadInventario() {
  const grid = document.getElementById("inv-grid");
  if (grid) grid.innerHTML = `<div class="col-span-full flex justify-center py-20">
    <span class="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span></div>`;
  try {
    const user = JSON.parse(localStorage.getItem("adminpro_user") || "{}");
    const isTecnico = user.rol === "Técnico de reparación";
    
    let allProducts = await getInventario();
    if (isTecnico) {
      productos = allProducts.filter(p => p.categoria && p.categoria.toLowerCase().includes("repuesto"));
    } else {
      productos = allProducts;
    }
    filteredProductos = [...productos];
    renderGrid();
    populateCategoryFilter();
  } catch (err) {
    if (grid) grid.innerHTML = `<div class="col-span-full text-center py-20 text-error font-semibold">
      <span class="material-symbols-outlined text-4xl">wifi_off</span>
      <p class="mt-2">Error al cargar: ${err.message}</p></div>`;
  }
}

function populateCategoryFilter() {
  const sel = document.getElementById("inv-filter-cat");
  const cats = [...new Set(productos.map(p => p.categoria).filter(Boolean))];
  if (sel) {
    sel.innerHTML = `<option value="">Todas las categorías</option>` +
      cats.map(c => `<option value="${c}">${c}</option>`).join("");
  }
  
  // Populate datalists
  const datalistCats = document.getElementById("datalist-categorias");
  if (datalistCats) {
    datalistCats.innerHTML = cats.map(c => `<option value="${c}">`).join("");
  }
  
  const datalistMarcas = document.getElementById("datalist-marcas");
  if (datalistMarcas) {
    const marcas = [...new Set(productos.map(p => p.marca).filter(Boolean))];
    datalistMarcas.innerHTML = marcas.map(m => `<option value="${m}">`).join("");
  }
}

function formatNumberInput(e) {
  let val = e.target.value.replace(/\D/g, "");
  if (!val) {
    e.target.value = "";
    return;
  }
  e.target.value = new Intl.NumberFormat("es-CO").format(parseInt(val, 10));
}

function renderScanThumbnails() {
  const container = document.getElementById("inv-label-thumbnails");
  const processBtn = document.getElementById("inv-ai-process-btn");
  if (!container || !processBtn) return;

  if (_selectedScanImages.length === 0) {
    container.innerHTML = "";
    container.classList.add("hidden");
    processBtn.disabled = true;
    processBtn.classList.add("bg-slate-100", "text-slate-400", "cursor-not-allowed");
    processBtn.classList.remove("bg-primary", "text-white", "hover:bg-primary/95", "shadow-lg", "shadow-primary/25", "cursor-pointer");
    processBtn.innerHTML = `<span class="material-symbols-outlined text-[16px]">psychology</span> Procesar IA`;
    return;
  }

  container.innerHTML = _selectedScanImages.map((img, index) => `
    <div class="relative w-full aspect-square rounded-xl overflow-hidden border border-slate-200 group bg-slate-50 flex items-center justify-center">
      <img src="${img.base64}" class="w-full h-full object-cover">
      <button type="button" onclick="window.inventoryRemoveScanImage(${index})" 
        class="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md hover:bg-red-600 transition-colors z-20" title="Eliminar">
        <span class="material-symbols-outlined text-[12px] font-bold">close</span>
      </button>
      <button type="button" onclick="window.inventorySetAsProductPhoto(${index})" 
        class="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-primary text-white flex items-center gap-0.5 shadow-md hover:bg-primary/90 transition-colors text-[9px] font-black z-20" title="Usar como foto oficial del producto">
        <span class="material-symbols-outlined text-[10px]">photo_camera</span> Usar
      </button>
    </div>
  `).join("");

  container.classList.remove("hidden");
  processBtn.disabled = false;
  processBtn.classList.remove("bg-slate-100", "text-slate-400", "cursor-not-allowed");
  processBtn.classList.add("bg-primary", "text-white", "hover:bg-primary/95", "shadow-lg", "shadow-primary/25", "cursor-pointer");
  processBtn.innerHTML = `<span class="material-symbols-outlined text-[16px]">psychology</span> Analizar (${_selectedScanImages.length} fotos)`;
}

window.inventoryRemoveScanImage = (index) => {
  _selectedScanImages.splice(index, 1);
  renderScanThumbnails();
};

window.inventorySetAsProductPhoto = async (index) => {
  console.log("[inventorySetAsProductPhoto] Invocado con index:", index);
  const img = _selectedScanImages[index];
  if (!img) {
    console.warn("[inventorySetAsProductPhoto] No se encontró la imagen en index:", index);
    showToast("No se pudo encontrar la imagen seleccionada", "warning");
    return;
  }

  try {
    showToast("Subiendo foto seleccionada a Google Drive...", "info");
    console.log("[inventorySetAsProductPhoto] Subiendo a Drive:", img.name, "tipo:", img.type, "tamaño base64:", img.base64 ? img.base64.length : 0);
    const uploadedUrl = await uploadFoto(img.base64, img.name, img.type);
    console.log("[inventorySetAsProductPhoto] Respuesta URL recibida:", uploadedUrl);
    if (uploadedUrl) {
      document.getElementById("inv-existing-img").value = uploadedUrl;
      document.getElementById("inv-img-preview").innerHTML =
        `<img src="${uploadedUrl}" class="w-full h-full object-cover">`;
      showToast("Foto asignada correctamente como imagen del producto 📸", "success");
    } else {
      console.error("[inventorySetAsProductPhoto] URL de imagen vacía");
      showToast("No se pudo obtener la URL de la imagen subida", "error");
    }
  } catch (err) {
    console.error("[inventorySetAsProductPhoto] Error al asignar foto:", err);
    showToast("Error al subir imagen a Google Drive: " + err.message, "error");
  }
};

export function initInventory() {
  // Physical Barcode Scanner Integration
  document.addEventListener("barcodeScanned", (e) => {
    // Verificar si estamos en la vista de inventario
    const invView = document.querySelector('[data-view="inventory"]');
    if (!invView || invView.classList.contains('hidden')) return;

    const code = e.detail;

    // Si el modal de Nuevo/Editar Producto está abierto, pon el código en el campo SKU
    const modal = document.getElementById("inv-modal");
    if (modal && !modal.classList.contains('hidden')) {
      const skuInput = document.getElementById("inv-sku");
      if (skuInput) {
        skuInput.value = code;
        showToast(`SKU ingresado: ${code}`, "success");
      }
      return;
    }

    // De lo contrario, buscar en el inventario general
    const searchInput = document.getElementById("inv-search");
    if (searchInput) {
      searchInput.value = code;
      applyFilter();
      
      // Si hay exactamente un resultado, abrir su detalle automáticamente
      if (filteredProductos.length === 1) {
        inventoryView.openDetail(filteredProductos[0].id);
        showToast("Producto encontrado", "success");
      } else if (filteredProductos.length === 0) {
        showToast("No se encontró el producto", "warning");
      }
    }
  });

  // Search
  document.getElementById("inv-search")?.addEventListener("input", applyFilter);
  document.getElementById("inv-filter-cat")?.addEventListener("change", applyFilter);
  document.getElementById("inv-filter-tipo")?.addEventListener("change", applyFilter);

  // Categoria change to toggle specs fields
  const catInput = document.getElementById("inv-categoria");
  catInput?.addEventListener("input", toggleSpecsContainer);
  catInput?.addEventListener("change", toggleSpecsContainer);

  // View Toggle
  document.getElementById("inv-view-toggle")?.addEventListener("click", () => {
    _viewMode = _viewMode === 'grid' ? 'table' : 'grid';
    const icon = document.getElementById("inv-view-toggle").querySelector("span");
    icon.textContent = _viewMode === 'grid' ? "view_list" : "grid_view";
    renderGrid();
  });

  // Auto-ID
  document.getElementById("inv-auto-id-btn")?.addEventListener("click", () => {
    document.getElementById("inv-id").value = "PROD-" + Date.now().toString().slice(-6);
  });

  // FAB and open new modal
  document.getElementById("inv-new-btn")?.addEventListener("click", () => {
    if (window.inventoryView && window.inventoryView.openNuevo) {
      window.inventoryView.openNuevo(false);
    }
  });

  // Number formatters
  document.getElementById("inv-costo")?.addEventListener("input", formatNumberInput);
  document.getElementById("inv-venta")?.addEventListener("input", formatNumberInput);

  // Close modal
  document.getElementById("inv-modal-close")?.addEventListener("click", closeModal);
  document.getElementById("inv-modal-backdrop")?.addEventListener("click", closeModal);

  // Image preview
  document.getElementById("inv-img-file")?.addEventListener("change", previewImg);

  // Lector de foto de etiqueta/caja con IA (Agregar fotos a la cola y comprimir en caliente)
  document.getElementById("inv-label-file")?.addEventListener("change", async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    showToast(`Cargando y comprimiendo ${files.length} foto(s)...`, "info");

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const reader = new FileReader();
        const rawBase64 = await new Promise((resolve, reject) => {
          reader.onload = (ev) => resolve(ev.target.result);
          reader.onerror = (err) => reject(err);
          reader.readAsDataURL(file);
        });

        // Redimensionar y comprimir a JPEG ligero
        const compressedBase64 = await compressImage(rawBase64, 1024, 1024, 0.75);

        _selectedScanImages.push({
          name: file.name,
          type: "image/jpeg",
          base64: compressedBase64
        });
      } catch (err) {
        console.error("Error al comprimir/leer archivo:", err);
      }
    }

    renderScanThumbnails();
    e.target.value = ""; // Limpiar input file
  });

  // Botón para procesar todas las fotos añadidas con IA
  document.getElementById("inv-ai-process-btn")?.addEventListener("click", async () => {
    if (_selectedScanImages.length === 0) return;

    const processBtn = document.getElementById("inv-ai-process-btn");
    const originalText = processBtn.innerHTML;
    processBtn.disabled = true;
    processBtn.innerHTML = `<span class="material-symbols-outlined animate-spin text-[16px]">progress_activity</span> Analizando...`;
    
    // Deshabilitar botón de agregar temporalmente
    document.getElementById("inv-label-card").classList.add("pointer-events-none", "opacity-50");

    try {
      // 1. Ejecutar análisis con IA
      try {
        showToast("Procesando imágenes con IA...", "info");
        const result = await analyzeLabelImage(_selectedScanImages);
        console.log("[AI Multi-Label Analysis Result]:", result);

        if (!result.success) {
          throw new Error(result.mensaje || "Error en OpenRouter");
        }

        const parsed = result.data;

        // Rellenar campos en el formulario
        if (parsed.name) {
          document.getElementById("inv-nombre").value = parsed.name;
        }
        if (parsed.brand) {
          document.getElementById("inv-marca").value = parsed.brand;
        }
        if (parsed.sku) {
          document.getElementById("inv-sku").value = parsed.sku;
        }
        if (parsed.cost) {
          const costNum = parseInt(String(parsed.cost).replace(/\D/g, ""), 10);
          if (costNum) document.getElementById("inv-costo").value = new Intl.NumberFormat("es-CO").format(costNum);
        }
        if (parsed.price) {
          const priceNum = parseInt(String(parsed.price).replace(/\D/g, ""), 10);
          if (priceNum) document.getElementById("inv-venta").value = new Intl.NumberFormat("es-CO").format(priceNum);
        }
        if (parsed.ram) {
          document.getElementById("inv-ram").value = parsed.ram.replace(/\s*RAM\b/gi, "").trim();
        }
        if (parsed.memoria) {
          document.getElementById("inv-memoria").value = parsed.memoria;
        }
        if (parsed.color) {
          document.getElementById("inv-color").value = parsed.color;
        }

        // Establecer categoria y tipo por defecto
        if (parsed.category) {
          document.getElementById("inv-categoria").value = parsed.category;
        } else if (parsed.ram || parsed.memoria) {
          document.getElementById("inv-categoria").value = "Celulares";
        }
        document.getElementById("inv-tipo").value = "Físico";

        // Auto-asignar la mejor foto recomendada por la IA para perfil
        if (_selectedScanImages.length > 0) {
          try {
            console.log("[AI Auto-Photo] parsed.bestPhotoIndex devuelto por Gemini:", parsed.bestPhotoIndex);
            let bestIndex = 0;
            if (parsed.bestPhotoIndex !== undefined && parsed.bestPhotoIndex !== null) {
              const idx = parseInt(parsed.bestPhotoIndex, 10);
              if (!isNaN(idx) && idx >= 0 && idx < _selectedScanImages.length) {
                bestIndex = idx;
              } else {
                console.log("[AI Auto-Photo] Índice inválido o fuera de rango, se usará el por defecto 0");
              }
            }
            console.log("[AI Auto-Photo] Seleccionando foto en índice:", bestIndex);
            showToast("Auto-asignando la mejor foto del producto...", "info");
            await window.inventorySetAsProductPhoto(bestIndex);
          } catch (uploadErr) {
            console.error("[AI Auto-Photo] Error al asignar foto automáticamente:", uploadErr);
            showToast("Error al asignar foto automáticamente: " + uploadErr.message, "error");
          }
        }

        // Rellenar Marketing IA (Ficha y Copia Publicitaria)
        const aiSection = document.getElementById("inv-ai-copy-section");
        if (aiSection) {
          document.getElementById("inv-ai-desc").value = parsed.description || "No se generó ficha técnica.";
          document.getElementById("inv-ai-ad").value = parsed.adCopy || "No se generó copia publicitaria.";
          aiSection.classList.remove("hidden");
        }

        toggleSpecsContainer();

        // Generar ID automáticamente si está vacío
        if (!document.getElementById("inv-id").value) {
          document.getElementById("inv-id").value = "PROD-" + Date.now().toString().slice(-6);
        }

        showToast("Análisis multifoto completado con éxito ✨", "success");
      } catch (aiErr) {
        console.error("AI Analysis Error:", aiErr);
        showToast("La IA no pudo procesar los datos: " + aiErr.message, "warning");
      }
    } catch (err) {
      console.error("Multi-Scan Error:", err);
      showToast("Error general: " + err.message, "error");
    } finally {
      processBtn.disabled = false;
      processBtn.innerHTML = originalText;
      document.getElementById("inv-label-card").classList.remove("pointer-events-none", "opacity-50");
    }
  });

  // Save
  document.getElementById("inv-save-btn")?.addEventListener("click", saveProduct);

  // Scanner
  document.getElementById("inv-scan-sku")?.addEventListener("click", () => {
    openScanner({
      title: "Escanear SKU / Barcode",
      onScan: (code) => {
        document.getElementById("inv-sku").value = code;
        showToast(`SKU Detectado: ${code}`, "success");
      }
    });
  });

  // Add Brand / Category via inline mini-modal
  let _qiTarget = null; // 'marca' or 'cat'
  const qiModal  = document.getElementById("inv-quick-input-modal");
  const qiTitle  = document.getElementById("inv-qi-title");
  const qiInput  = document.getElementById("inv-qi-input");
  const qiSave   = document.getElementById("inv-qi-save");
  const qiCancel = document.getElementById("inv-qi-cancel");
  const qiBackdrop = document.getElementById("inv-qi-backdrop");

  function openQI(type) {
    _qiTarget = type;
    qiTitle.textContent = type === 'marca' ? 'Nueva Marca' : 'Nueva Categoría';
    qiInput.value = "";
    qiModal.classList.remove("hidden"); qiModal.classList.add("flex");
    setTimeout(() => qiInput.focus(), 50);
  }
  function closeQI() { qiModal.classList.add("hidden"); qiModal.classList.remove("flex"); }

  qiCancel.addEventListener("click", closeQI);
  qiBackdrop.addEventListener("click", closeQI);
  qiInput.addEventListener("keydown", e => { if (e.key === "Enter") qiSave.click(); });

  qiSave.addEventListener("click", () => {
    const val = qiInput.value.trim();
    if (!val) return;
    if (_qiTarget === 'marca') {
      const dl = document.getElementById("datalist-marcas");
      if (![...dl.options].some(o => o.value.toLowerCase() === val.toLowerCase())) {
        const opt = document.createElement("option"); opt.value = val; dl.appendChild(opt);
      }
      document.getElementById("inv-marca").value = val;
      showToast(`Marca "${val}" agregada`, "success");
    } else {
      const dl = document.getElementById("datalist-categorias");
      const sel = document.getElementById("inv-filter-cat");
      if (![...dl.options].some(o => o.value.toLowerCase() === val.toLowerCase())) {
        const opt = document.createElement("option"); opt.value = val; dl.appendChild(opt);
        if (sel) { const so = document.createElement("option"); so.value = val; so.textContent = val; sel.appendChild(so); }
      }
      document.getElementById("inv-categoria").value = val;
      showToast(`Categoría "${val}" agregada`, "success");
    }
    closeQI();
  });

  document.getElementById("inv-add-marca-btn")?.addEventListener("click", () => openQI('marca'));
  document.getElementById("inv-add-cat-btn")?.addEventListener("click", () => openQI('cat'));

  // Detail modal close + Edit button
  const closeDetail = () => {
    const dm = document.getElementById("inv-detail-modal");
    dm.classList.add("hidden"); dm.classList.remove("flex");
  };
  document.getElementById("inv-detail-close")?.addEventListener("click", closeDetail);
  document.getElementById("inv-detail-close2")?.addEventListener("click", closeDetail);
  document.getElementById("inv-detail-backdrop")?.addEventListener("click", closeDetail);
  document.getElementById("inv-detail-edit-btn")?.addEventListener("click", () => {
    if (_detailId) inventoryView.openEdit(_detailId);
  });

  // Botones de copia para el Marketing IA
  document.getElementById("inv-btn-copy-desc")?.addEventListener("click", () => {
    const descText = document.getElementById("inv-ai-desc").value;
    if (descText) {
      navigator.clipboard.writeText(descText);
      showToast("Ficha técnica copiada al portapapeles 📋", "success");
    }
  });

  document.getElementById("inv-btn-copy-ad")?.addEventListener("click", () => {
    const adText = document.getElementById("inv-ai-ad").value;
    if (adText) {
      navigator.clipboard.writeText(adText);
      showToast("Copia publicitaria copiada al portapapeles 📋", "success");
    }
  });

  return loadInventario;
}

const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./vendor-heavy-CU7AIUfe.js","./rolldown-runtime-BM3Ffeng.js","./vendor-CARX_iIw.js"])))=>i.map(i=>d[i]);
import{o as e,r as t}from"./rolldown-runtime-BM3Ffeng.js";import{i as n,n as r,r as i}from"./vendor-heavy-CU7AIUfe.js";(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var a={},o=null,s=null,c=null;function l(e,t){a[e]=t}function u(e){s=e}function d(e){c=e}async function f(e){if(c){let t=c(e);if(t===!1)return;typeof t==`string`&&(e=t)}document.querySelectorAll(`[data-view]`).forEach(e=>{e.classList.add(`hidden`)});let t=document.querySelector(`[data-view="${e}"]`);if(!t)return console.warn(`View not found:`,e),e===`dashboard`?void 0:f(`dashboard`);t.classList.remove(`hidden`),o=e,window.location.hash!==`#${e}`&&window.history.pushState(null,``,`#${e}`),s&&s(e),a[e]&&await a[e]()}window.addEventListener(`popstate`,()=>{let e=window.location.hash.replace(`#`,``);e&&e!==o&&f(e)});var p=n(),m=`modulepreload`,h=function(e,t){return new URL(e,t).href},g={},_=function(e,t,n){let r=Promise.resolve();if(t&&t.length>0){let e=document.getElementsByTagName(`link`),i=document.querySelector(`meta[property=csp-nonce]`),a=i?.nonce||i?.getAttribute(`nonce`);function o(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}r=o(t.map(t=>{if(t=h(t,n),t in g)return;g[t]=!0;let r=t.endsWith(`.css`),i=r?`[rel="stylesheet"]`:``;if(n)for(let n=e.length-1;n>=0;n--){let i=e[n];if(i.href===t&&(!r||i.rel===`stylesheet`))return}else if(document.querySelector(`link[href="${t}"]${i}`))return;let o=document.createElement(`link`);if(o.rel=r?`stylesheet`:m,r||(o.as=`script`),o.crossOrigin=``,o.href=t,a&&o.setAttribute(`nonce`,a),document.head.appendChild(o),r)return new Promise((e,n)=>{o.addEventListener(`load`,e),o.addEventListener(`error`,()=>n(Error(`Unable to preload CSS for ${t}`)))})}))}function i(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return r.then(t=>{for(let e of t||[])e.status===`rejected`&&i(e.reason);return e().catch(i)})},v=!1,y=!1,b=null,x=`environment`,S=!1,C=null,ee=null,w=!1,te=0,ne=null,T=null,re=`barcode`,ie=null,ae=[],oe=null;function se(e){if(!/^\d{15}$/.test(e))return!1;let t=0;for(let n=0;n<15;n++){let r=parseInt(e.charAt(n),10);n%2==1&&(r*=2,r>9&&(r-=9)),t+=r}return t%10==0}function ce(e){let t=e.replace(/[^0-9\s\-\.]/g,``),n=[],r=/[\d\s\-\.]{15,30}/g,i;for(;(i=r.exec(t))!==null;){let e=i[0].replace(/\D/g,``);for(let t=0;t<=e.length-15;t++){let r=e.substring(t,t+15);se(r)&&n.push(r)}}return[...new Set(n)]}async function le(){return ie||=await(0,p.createWorker)(`eng`),ae&&ae.length>0?await ie.setParameters({tessedit_char_whitelist:``}):await ie.setParameters({tessedit_char_whitelist:`0123456789`}),ie}var ue=null,de=null,fe,pe,me,he,E,D,ge,_e,ve,O,ye,k,be;function xe(){return/iphone|ipad|ipod/i.test(navigator.userAgent)||navigator.platform===`MacIntel`&&navigator.maxTouchPoints>1}async function Se(){if(typeof BarcodeDetector<`u`)try{let e=await BarcodeDetector.getSupportedFormats(),t=[`qr_code`,`code_128`,`code_39`,`ean_13`,`ean_8`,`upc_a`,`upc_e`,`pdf417`,`data_matrix`].filter(t=>e.includes(t));ue=new BarcodeDetector({formats:t.length?t:[`qr_code`,`code_128`,`ean_13`]}),de=`native`,console.log(`[Scanner] Motor: BarcodeDetector nativo`);return}catch{}let{readBarcodesFromImageData:e}=await _(async()=>{let{readBarcodesFromImageData:e}=await import(`./vendor-heavy-CU7AIUfe.js`).then(e=>e.t);return{readBarcodesFromImageData:e}},__vite__mapDeps([0,1,2]),import.meta.url);ue=e,de=`zxing-wasm`,console.log(`[Scanner] Motor: zxing-wasm (C++ WASM)`)}async function Ce(){if(xe())return null;try{(await navigator.mediaDevices.getUserMedia({video:{facingMode:`environment`}})).getTracks().forEach(e=>e.stop());let e=(await navigator.mediaDevices.enumerateDevices()).filter(e=>e.kind===`videoinput`);if(e.length<=1)return e[0]?.deviceId??null;let t=e.map(e=>{let t=e.label.toLowerCase(),n=0;/back|rear|environment|posterior|trasera/i.test(t)&&(n+=30),/\bmain\b|wide(?! angle)|principal/i.test(t)&&(n+=20),/ultra|macro|depth|tof|\btele\b|periscope|\bir\b/i.test(t)&&(n-=30);let r=t.match(/camera\s*(\d)/i);if(r){let e=parseInt(r[1]);n+=e===0?10:e===1?5:0}return console.log(`[Scanner] ${e.label} → score: ${n}`),{cam:e,score:n}});t.sort((e,t)=>t.score-e.score);let n=t[0].cam.deviceId;return console.log(`[Scanner] Elegida: ${t[0].cam.label}`),n}catch{return null}}function we(){try{let e=new(window.AudioContext||window.webkitAudioContext),t=e.createOscillator(),n=e.createGain();t.connect(n),n.connect(e.destination),t.type=`sine`,t.frequency.setValueAtTime(1050,e.currentTime),n.gain.setValueAtTime(.4,e.currentTime),n.gain.exponentialRampToValueAtTime(1e-5,e.currentTime+.18),t.start(e.currentTime),t.stop(e.currentTime+.18)}catch{}}function Te(){let e=document.getElementById(`scanner-modal`);if(e){if(document.getElementById(`scanner-video`))return;e.remove()}document.body.insertAdjacentHTML(`beforeend`,`
    <style>
      @keyframes scanLine {
        0%   { top: 6px; }
        50%  { top: calc(100% - 8px); }
        100% { top: 6px; }
      }
      @keyframes focusFade {
        0%   { opacity: 1; transform: scale(1); }
        100% { opacity: 0; transform: scale(1.6); }
      }
      #scanner-scan-line {
        position: absolute;
        left: 4px; right: 4px; height: 2px;
        background: linear-gradient(90deg, transparent, #38bdf8, #38bdf8, transparent);
        animation: scanLine 1.8s ease-in-out infinite;
        border-radius: 2px;
        box-shadow: 0 0 8px #38bdf8;
        pointer-events: none;
      }
    </style>
    <div id="scanner-modal" class="hidden fixed inset-0 z-[60] items-center justify-center p-4">
      <div id="scanner-backdrop" class="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
      <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden z-10 flex flex-col max-h-[95vh]">
        
        <div class="flex items-center justify-between px-5 py-4 border-b border-surface-variant flex-shrink-0">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-primary text-[20px]" style="font-variation-settings:'FILL' 1">qr_code_scanner</span>
            <h3 id="scanner-title" class="font-bold text-on-surface text-sm">Escanear Código</h3>
          </div>
          <button id="scanner-close" class="p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg transition-colors">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <!-- Mode Tabs -->
        <div class="flex border-b border-surface-variant bg-surface-container-low flex-shrink-0">
          <button id="scanner-tab-barcode" class="flex-1 py-3 text-xs font-bold border-b-2 border-primary text-primary transition-colors flex items-center justify-center gap-1.5">
            <span class="material-symbols-outlined text-[16px]">barcode</span> Código
          </button>
          <button id="scanner-tab-ocr" class="flex-1 py-3 text-xs font-bold border-b-2 border-transparent text-on-surface-variant hover:text-on-surface transition-colors flex items-center justify-center gap-1.5">
            <span class="material-symbols-outlined text-[16px]">document_scanner</span> Lector IMEI (OCR)
          </button>
        </div>
        
        <div id="scanner-reader-container" class="bg-black relative touch-none flex-1 min-h-[300px] overflow-hidden flex items-center justify-center">
          <video id="scanner-video" class="absolute inset-0 w-full h-full object-cover" playsinline muted autoplay></video>
          
          <div class="absolute inset-0 z-10 flex items-center justify-center overflow-hidden pointer-events-none">
            <div id="scanner-guide-box" class="relative flex-shrink-0 transition-none" style="width:260px;height:140px;border:2px solid rgba(255,255,255,0.6);box-shadow:0 0 0 4000px rgba(0,0,0,0.65);">
              <!-- esquinas animadas -->
              <div data-dir="tl" class="resize-handle absolute -top-1.5 -left-1.5 w-8 h-8 border-t-4 border-l-4 border-white pointer-events-auto cursor-nwse-resize"></div>
              <div data-dir="tr" class="resize-handle absolute -top-1.5 -right-1.5 w-8 h-8 border-t-4 border-r-4 border-white pointer-events-auto cursor-nesw-resize"></div>
              <div data-dir="bl" class="resize-handle absolute -bottom-1.5 -left-1.5 w-8 h-8 border-b-4 border-l-4 border-white pointer-events-auto cursor-nesw-resize"></div>
              <div data-dir="br" class="resize-handle absolute -bottom-1.5 -right-1.5 w-8 h-8 border-b-4 border-r-4 border-white pointer-events-auto cursor-nwse-resize"></div>
              <!-- línea de escaneo -->
              <div id="scanner-scan-line"></div>
            </div>
          </div>

          <div class="absolute bottom-4 right-4 flex gap-2 z-20 pointer-events-auto">
            <button id="scanner-torch-btn" class="w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 active:scale-95 transition-transform" title="Linterna">
              <span class="material-symbols-outlined text-[20px]">flashlight_on</span>
            </button>
            <button id="scanner-switch-btn" class="w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 active:scale-95 transition-transform" title="Cambiar cámara">
              <span class="material-symbols-outlined text-[20px]">cameraswitch</span>
            </button>
          </div>
        </div>

        <div id="scanner-status" class="px-5 py-3 text-center text-sm text-on-surface-variant bg-surface-container-low flex-shrink-0">
          Iniciando cámara...
        </div>

        <!-- Lista de selección cuando hay múltiples resultados -->
        <div id="scanner-pick-list" class="hidden px-5 pb-3 flex-shrink-0 overflow-y-auto max-h-[180px]">
          <p class="text-[11px] text-on-surface-variant font-medium uppercase tracking-wider mb-2">Selecciona el código correcto</p>
          <div id="scanner-pick-items" class="flex flex-col gap-1.5"></div>
        </div>

        <!-- Tomar Foto / Subir Foto -->
        <div class="px-5 py-3 border-t border-surface-variant bg-surface-container-lowest flex-shrink-0 flex items-center justify-between gap-3">
          <div class="flex flex-col">
            <span class="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">¿No lee en vivo?</span>
            <span class="text-[9px] text-slate-400">Toma una foto de la etiqueta</span>
          </div>
          <button id="scanner-photo-btn" type="button" class="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5 active:scale-95">
            <span class="material-symbols-outlined text-[16px]">photo_camera</span>
            <span>Tomar Foto / Subir</span>
          </button>
          <input id="scanner-file-input" type="file" accept="image/*" class="hidden" />
        </div>
        
        <div class="px-5 py-4 border-t border-surface-variant flex-shrink-0">
          <p class="text-[11px] text-on-surface-variant font-medium uppercase tracking-wider mb-2">O ingresa manualmente</p>
          <div class="flex gap-2">
            <input id="scanner-manual-input" type="text" placeholder="Escribe el código..." class="flex-1 bg-surface-container border border-surface-variant rounded-lg px-3 py-2.5 text-sm text-on-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
            <button id="scanner-manual-btn" class="px-4 py-2.5 bg-primary text-on-primary text-sm font-bold rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-1">
              <span class="material-symbols-outlined text-[16px]">check</span> OK
            </button>
          </div>
        </div>
      </div>
    </div>`),fe=document.getElementById(`scanner-modal`),pe=document.getElementById(`scanner-backdrop`),me=document.getElementById(`scanner-close`),he=document.getElementById(`scanner-reader-container`),E=document.getElementById(`scanner-video`),D=document.getElementById(`scanner-status`),ge=document.getElementById(`scanner-title`),_e=document.getElementById(`scanner-manual-input`),ve=document.getElementById(`scanner-manual-btn`),O=document.getElementById(`scanner-torch-btn`),ye=document.getElementById(`scanner-switch-btn`),k=document.getElementById(`scanner-guide-box`),be=document.getElementById(`scanner-pick-list`),me.addEventListener(`click`,We),pe.addEventListener(`click`,We),ve.addEventListener(`click`,je),_e.addEventListener(`keydown`,e=>{e.key===`Enter`&&je()}),O.addEventListener(`click`,Me),ye.addEventListener(`click`,Ne);let t=document.getElementById(`scanner-photo-btn`),n=document.getElementById(`scanner-file-input`);t.addEventListener(`click`,()=>n.click()),n.addEventListener(`change`,Ae),document.getElementById(`scanner-tab-barcode`).addEventListener(`click`,()=>Ee(`barcode`)),document.getElementById(`scanner-tab-ocr`).addEventListener(`click`,()=>Ee(`ocr`)),ke()}function Ee(e){re=e;let t=document.getElementById(`scanner-tab-barcode`),n=document.getElementById(`scanner-tab-ocr`),r=document.getElementById(`scanner-scan-line`);if(!(!t||!n)){if(e===`ocr`){if(t.classList.remove(`border-primary`,`text-primary`),t.classList.add(`border-transparent`,`text-on-surface-variant`),n.classList.remove(`border-transparent`,`text-on-surface-variant`),n.classList.add(`border-primary`,`text-primary`),r&&(r.style.background=`linear-gradient(90deg, transparent, #a855f7, #a855f7, transparent)`,r.style.boxShadow=`0 0 8px #a855f7`),k)if(ae&&ae.length>0)k.style.width=`320px`,k.style.height=`180px`,D.textContent=`📷 Encuadra la etiqueta completa con modelo e IMEIs`;else{k.style.width=`300px`,k.style.height=`100px`;let e=T?` — buscando ${T}`:``;D.textContent=`📷 Encuadra el IMEI en la caja o pantalla${e}`}D.className=`px-5 py-3 text-center text-sm text-purple-800 bg-purple-50 font-medium`}else{n.classList.remove(`border-primary`,`text-primary`),n.classList.add(`border-transparent`,`text-on-surface-variant`),t.classList.remove(`border-transparent`,`text-on-surface-variant`),t.classList.add(`border-primary`,`text-primary`),r&&(r.style.background=`linear-gradient(90deg, transparent, #38bdf8, #38bdf8, transparent)`,r.style.boxShadow=`0 0 8px #38bdf8`);let e=T?` — buscando ${T}`:``;D.textContent=`📷 Apunta al código de barras o QR${e}`,D.className=`px-5 py-3 text-center text-sm text-blue-800 bg-blue-50 font-medium`,k&&(k.style.width=`280px`,k.style.height=`120px`)}Oe()}}function De(e){let t=document.getElementById(`scanner-pick-items`);t&&(t.innerHTML=``,e.forEach(e=>{let n=document.createElement(`button`);n.className=`w-full text-left px-3 py-2.5 rounded-xl bg-surface-container hover:bg-primary/10 border border-surface-variant text-sm font-mono text-on-surface transition-colors flex items-center gap-2 active:scale-[0.98]`,n.innerHTML=`<span class="material-symbols-outlined text-primary text-[16px]">barcode</span><span class="truncate">${e}</span>`,n.addEventListener(`click`,()=>{we(),b&&b(e),setTimeout(()=>We(),300)}),t.appendChild(n)}),be.classList.remove(`hidden`))}function Oe(){be&&be.classList.add(`hidden`);let e=document.getElementById(`scanner-pick-items`);e&&(e.innerHTML=``)}function ke(){let e=document.querySelectorAll(`.resize-handle`),t=null,n,r,i,a;e.forEach(e=>{e.addEventListener(`touchstart`,o=>{t=e,n=o.touches[0].clientX,r=o.touches[0].clientY,i=k.offsetWidth,a=k.offsetHeight,o.preventDefault()},{passive:!1}),e.addEventListener(`mousedown`,o=>{t=e,n=o.clientX,r=o.clientY,i=k.offsetWidth,a=k.offsetHeight,o.preventDefault()})});let o=(e,o,s)=>{if(!t)return;let c=e-n,l=o-r,u=i,d=a,f=t.dataset.dir;f===`br`?(u=i+c*2,d=a+l*2):f===`bl`?(u=i-c*2,d=a+l*2):f===`tr`?(u=i+c*2,d=a-l*2):f===`tl`&&(u=i-c*2,d=a-l*2),u=Math.max(60,Math.min(u,window.innerWidth-30)),d=Math.max(40,Math.min(d,420)),k.style.width=u+`px`,k.style.height=d+`px`,s&&s.preventDefault()};document.addEventListener(`touchmove`,e=>{t&&o(e.touches[0].clientX,e.touches[0].clientY,e)},{passive:!1}),document.addEventListener(`mousemove`,e=>{t&&o(e.clientX,e.clientY,e)});let s=()=>{t&&=null};document.addEventListener(`touchend`,s),document.addEventListener(`mouseup`,s),he.addEventListener(`click`,async e=>{if(!C)return;let t=C.getVideoTracks()[0];if(!t?.applyConstraints)return;let n=he.getBoundingClientRect(),r=(e.clientX-n.left)/n.width,i=(e.clientY-n.top)/n.height,a=document.createElement(`div`);a.style.cssText=`position:absolute;width:44px;height:44px;border:2px solid white;border-radius:50%;
      left:${e.clientX-n.left-22}px;top:${e.clientY-n.top-22}px;
      z-index:30;pointer-events:none;animation:focusFade 0.8s ease forwards;`,he.appendChild(a),setTimeout(()=>a.remove(),800);try{await t.applyConstraints({advanced:[{focusMode:`manual`}]}),await t.applyConstraints({advanced:[{pointOfInterest:{x:r,y:i}}]}),await new Promise(e=>setTimeout(e,400)),await t.applyConstraints({advanced:[{focusMode:`continuous`}]})}catch{try{await t.applyConstraints({advanced:[{focusMode:`manual`}]}),await new Promise(e=>setTimeout(e,200)),await t.applyConstraints({advanced:[{focusMode:`continuous`}]})}catch{}}})}async function Ae(e){let t=e.target.files[0];if(t){D.textContent=`Procesando foto...`,D.className=`px-5 py-3 text-center text-sm text-indigo-800 bg-indigo-50 font-medium animate-pulse`,Pe();try{let e=new Image,n=URL.createObjectURL(t);await new Promise((t,r)=>{e.onload=t,e.onerror=r,e.src=n}),URL.revokeObjectURL(n);let r=document.createElement(`canvas`),i=e.width,a=e.height,o=1200;(i>o||a>o)&&(i>a?(a=Math.round(a*o/i),i=o):(i=Math.round(i*o/a),a=o)),r.width=i,r.height=a;let s=r.getContext(`2d`);re===`ocr`&&(s.filter=`grayscale(1) contrast(2) brightness(1.1)`),s.drawImage(e,0,0,i,a);let c=[];if(re===`ocr`){let{data:{text:e}}=await(await le()).recognize(r);console.log(`[Scanner Photo OCR Raw]:`,e),c=ce(e)}else c=await Ve(r,s);c&&c.length>0?He(c):(D.textContent=`⚠️ No se detectaron códigos válidos en la foto.`,D.className=`px-5 py-3 text-center text-sm text-amber-800 bg-amber-50 font-semibold`,await Fe())}catch(e){console.error(`Error al procesar la foto:`,e),D.textContent=`⚠️ Error al analizar la imagen.`,D.className=`px-5 py-3 text-center text-sm text-red-800 bg-red-50 font-semibold`,await Fe()}finally{document.getElementById(`scanner-file-input`).value=``}}}function je(){let e=_e.value.trim();e&&(b&&b(e),We())}async function Me(){if(!C)return;let e=C.getVideoTracks()[0];if(e){S=!S;try{await e.applyConstraints({advanced:[{torch:S}]}),O.innerHTML=`<span class="material-symbols-outlined text-[20px]">${S?`flashlight_off`:`flashlight_on`}</span>`,S?O.classList.replace(`bg-black/50`,`bg-primary`):O.classList.replace(`bg-primary`,`bg-black/50`)}catch{S=!1}}}async function Ne(){v&&(x=x===`environment`?`user`:`environment`,D.textContent=`Cambiando cámara...`,Pe(),S=!1,O.innerHTML=`<span class="material-symbols-outlined text-[20px]">flashlight_on</span>`,O.classList.remove(`bg-primary`),O.classList.add(`bg-black/50`),await Fe())}function Pe(){if(v=!1,w=!1,y=!1,C){try{C.getTracks().forEach(e=>e.stop())}catch(e){console.warn(`[Scanner] Error al detener pista del stream:`,e)}C=null}if(E)try{E.pause(),E.srcObject=null,E.removeAttribute(`src`),E.load()}catch(e){console.warn(`[Scanner] Error al apagar elemento video:`,e)}ee&&=(cancelAnimationFrame(ee),null)}async function Fe(){y=!0;try{let e;if(xe())e={video:{facingMode:{exact:`environment`},width:{ideal:1920},height:{ideal:1080}}};else if(x===`environment`){let t=await Ce();e=t?{video:{deviceId:{exact:t},width:{ideal:1920},height:{ideal:1080}}}:{video:{facingMode:`environment`,width:{ideal:1920},height:{ideal:1080}}}}else e={video:{facingMode:`user`}};let t=await navigator.mediaDevices.getUserMedia(e);if(!y){console.log(`[Scanner] El stream se obtuvo pero el escáner ya no debe ejecutarse. Deteniendo.`),t.getTracks().forEach(e=>e.stop());return}C=t,E.srcObject=C;let n=C.getVideoTracks()[0];if(n?.applyConstraints){try{await n.applyConstraints({advanced:[{focusMode:`continuous`}]})}catch{}try{await n.applyConstraints({zoom:1})}catch{}}await new Promise(e=>{E.onloadedmetadata=()=>{E.play(),e()}}),v=!0;let r=T?` — buscando ${T}`:``;D.textContent=`📷 Apunta al código de barras o QR${r}`,D.className=`px-5 py-3 text-center text-sm text-blue-800 bg-blue-50 font-medium`,Ie()}catch(e){console.error(`Scanner error:`,e),D.textContent=`⚠️ No se pudo acceder a la cámara. Usa la entrada manual.`,D.className=`px-5 py-3 text-center text-sm text-amber-800 bg-amber-50`}}function Ie(){v&&(ee=requestAnimationFrame(async()=>{if(!v)return;let e=performance.now(),t=re===`ocr`?600:65;if(w||e-te<t){Ie();return}if(E.readyState<2||E.paused){Ie();return}w=!0,te=e;try{let e=[];if(e=re===`ocr`?await Be():await Le(),e.length>0)He(e);else{if(re===`ocr`){let e=T?` — buscando ${T}`:``;D.textContent=`📷 Encuadra el IMEI en la caja o pantalla${e}`,D.className=`px-5 py-3 text-center text-sm text-purple-800 bg-purple-50 font-medium`}Ie()}}catch{Ie()}finally{w=!1}}))}async function Le(){let e=await ze(!0);return e.length>0?e:await ze(!1)}function Re(e){let t=E.getBoundingClientRect();if(t.width===0||t.height===0)return null;let n=t.width/E.videoWidth,r=t.height/E.videoHeight,i=Math.max(n,r),a=E.videoWidth*i,o=E.videoHeight*i,s=(a-t.width)/2,c=(o-t.height)/2,l,u,d,f;if(e){let e=k.getBoundingClientRect();l=(e.left-t.left+s)/i,u=(e.top-t.top+c)/i,d=e.width/i,f=e.height/i}else l=0,u=0,d=E.videoWidth,f=E.videoHeight;if(d<=0||f<=0)return null;let p=e&&d<600?600/d:1,m=document.createElement(`canvas`);m.width=Math.round(d*p),m.height=Math.round(f*p);let h=m.getContext(`2d`,{willReadFrequently:!0});return re===`ocr`?h.filter=`grayscale(1) contrast(2) brightness(1.1)`:h.imageSmoothingEnabled=!1,h.drawImage(E,l,u,d,f,0,0,m.width,m.height),m}async function ze(e){let t=Re(e);return t?await Ve(t,t.getContext(`2d`)):[]}async function Be(){let e=Re(!0);if(!e)return[];try{let{data:{text:t}}=await(await le()).recognize(e);return console.log(`[Scanner OCR Raw]:`,t),ce(t)}catch(e){return console.error(`[Scanner OCR Error]:`,e),[]}}async function Ve(e,t){if(de===`native`&&ue)try{return(await ue.detect(e)).map(e=>e.rawValue).filter(Boolean)}catch{}else if(de===`zxing-wasm`&&ue)try{let n=t.getImageData(0,0,e.width,e.height);return(await ue(n,{tryHarder:!0,formats:[`QRCode`,`Code128`,`Code39`,`EAN13`,`EAN8`,`UPCA`,`UPCE`,`PDF417`,`DataMatrix`],maxNumberOfSymbols:10})).map(e=>e.text).filter(Boolean)}catch{}return[]}function He(e){let t=[...new Set(e.map(e=>e.trim()).filter(Boolean))],n=t;if(ne){let e=t.filter(e=>ne.test(e));e.length>0&&(n=e)}n.length===1?(we(),D.textContent=`✅ Detectado: ${n[0]}`,D.className=`px-5 py-3 text-center text-sm text-green-800 bg-green-50 font-bold`,b&&b(n[0],n,oe),setTimeout(()=>We(),600)):n.length>1?re===`ocr`?(we(),D.textContent=`✅ Detectados ${n.length} IMEIs`,D.className=`px-5 py-3 text-center text-sm text-green-800 bg-green-50 font-bold`,b&&b(n[0],n,oe),setTimeout(()=>We(),600)):(we(),D.textContent=`🔍 ${n.length} códigos detectados — elige el correcto:`,D.className=`px-5 py-3 text-center text-sm text-indigo-800 bg-indigo-50 font-medium`,De(n),Ie()):t.length>0?(we(),D.textContent=`🔍 Códigos detectados — elige el correcto:`,D.className=`px-5 py-3 text-center text-sm text-indigo-800 bg-indigo-50 font-medium`,De(t),Ie()):Ie()}async function Ue({title:e=`Escanear Código`,onScan:t,filter:n=null,filterLabel:r=null,candidates:i=[]}={}){await Se(),Te(),y=!0,b=t,x=`environment`,S=!1,v=!1,w=!1,ne=n,T=r,ae=i,oe=null,ge.textContent=e,_e.value=``,D.textContent=`Iniciando cámara...`,D.className=`px-5 py-3 text-center text-sm text-on-surface-variant bg-surface-container-low`,Oe(),O&&(O.innerHTML=`<span class="material-symbols-outlined text-[20px]">flashlight_on</span>`,O.classList.remove(`bg-primary`),O.classList.add(`bg-black/50`)),Ee(r?.toUpperCase()===`IMEI`||n&&n.toString().includes(`15`)||i&&i.length>0?`ocr`:`barcode`),fe.classList.remove(`hidden`),fe.classList.add(`flex`),await Fe()}async function We(){Pe(),Oe(),fe&&(fe.classList.add(`hidden`),fe.classList.remove(`flex`)),b=null,ne=null,T=null,ae=[],oe=null}function A(e,t=`success`){let n={success:`border-l-4 border-l-emerald-500`,error:`border-l-4 border-l-rose-500`,info:`border-l-4 border-l-sky-500`,warning:`border-l-4 border-l-amber-500`},r={success:`text-emerald-500`,error:`text-rose-500`,info:`text-sky-500`,warning:`text-amber-500`},i={success:`check_circle`,error:`error`,info:`info`,warning:`warning`},a=document.createElement(`div`);a.className=`fixed top-4 left-4 right-4 sm:top-auto sm:bottom-4 sm:left-auto sm:right-4 z-[9999] toast-animate flex justify-center sm:justify-end pointer-events-none`,a.innerHTML=`
    <div class="flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-md text-white shadow-[0_12px_32px_rgba(0,0,0,0.15)] ${n[t]||n.success} w-full max-w-[340px] pointer-events-auto border border-white/5">
      <span class="material-symbols-outlined text-[20px] shrink-0 ${r[t]||r.success}" style="font-variation-settings:'FILL' 1">${i[t]||i.success}</span>
      <span class="flex-1 text-xs font-bold leading-normal text-slate-100">${e}</span>
      <button onclick="this.parentElement.parentElement.remove()" class="text-slate-400 hover:text-white transition-colors ml-1.5 shrink-0 flex items-center justify-center">
        <span class="material-symbols-outlined text-[16px]">close</span>
      </button>
    </div>
  `,document.body.appendChild(a),setTimeout(()=>a.remove(),4e3)}function j(e,t,n={}){return new Promise(r=>{let i=`confirm-modal-${Date.now()}`,a=document.createElement(`div`);a.id=i,a.className=`fixed inset-0 z-[99999] flex items-center justify-center p-4 transition-opacity duration-200 ease-out`,a.innerHTML=`
      <!-- Backdrop -->
      <div id="${i}-backdrop" class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm opacity-0 transition-opacity duration-200 ease-out"></div>
      
      <!-- Modal Container -->
      <div id="${i}-container" class="relative bg-white dark:bg-slate-900 rounded-3xl w-full max-w-[320px] p-5 shadow-2xl z-10 transform scale-95 opacity-0 transition-all duration-200 ease-out flex flex-col border border-slate-100 dark:border-slate-800">
        <!-- Title -->
        <h3 class="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider mb-2">${e}</h3>
        <!-- Message -->
        <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed mb-6">${t}</p>
        
        <!-- Action Buttons -->
        <div class="flex gap-3 mt-auto">
          <button id="${i}-cancel" class="flex-1 py-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs rounded-xl border border-slate-200 dark:border-slate-700 transition-all active:scale-[0.98]">
            ${n.cancelText||`Cancelar`}
          </button>
          <button id="${i}-confirm" class="flex-1 py-3 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/50 text-primary dark:text-red-400 border border-red-200 dark:border-red-900/50 font-black text-xs rounded-xl transition-all active:scale-[0.98]">
            ${n.confirmText||`Aceptar`}
          </button>
        </div>
      </div>
    `,document.body.appendChild(a);let o=document.getElementById(`${i}-backdrop`),s=document.getElementById(`${i}-container`);setTimeout(()=>{o&&o.classList.replace(`opacity-0`,`opacity-100`),s&&(s.classList.remove(`scale-95`,`opacity-0`),s.classList.add(`scale-100`,`opacity-100`))},10);let c=e=>{o&&o.classList.replace(`opacity-100`,`opacity-0`),s&&(s.classList.remove(`scale-100`,`opacity-100`),s.classList.add(`scale-95`,`opacity-0`)),a.classList.add(`pointer-events-none`),setTimeout(()=>{document.body.removeChild(a),r(e)},200)};document.getElementById(`${i}-cancel`).addEventListener(`click`,()=>c(!1)),document.getElementById(`${i}-confirm`).addEventListener(`click`,()=>c(!0))})}function Ge(e,t,n={}){return new Promise(r=>{let i=`prompt-modal-${Date.now()}`,a=document.createElement(`div`);a.id=i,a.className=`fixed inset-0 z-[99999] flex items-center justify-center p-4 transition-opacity duration-200 ease-out`,a.innerHTML=`
      <!-- Backdrop -->
      <div id="${i}-backdrop" class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm opacity-0 transition-opacity duration-200 ease-out"></div>
      
      <!-- Modal Container -->
      <div id="${i}-container" class="relative bg-white dark:bg-slate-900 rounded-3xl w-full max-w-[320px] p-5 shadow-2xl z-10 transform scale-95 opacity-0 transition-all duration-200 ease-out flex flex-col border border-slate-100 dark:border-slate-800">
        <!-- Title -->
        <h3 class="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider mb-2">${e}</h3>
        <!-- Message -->
        <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed mb-4">${t}</p>
        
        <!-- Input field -->
        <input type="text" id="${i}-input" value="${n.defaultValue||``}" placeholder="${n.placeholder||``}"
          class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 mb-6" />
        
        <!-- Action Buttons -->
        <div class="flex gap-3 mt-auto">
          <button id="${i}-cancel" class="flex-1 py-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs rounded-xl border border-slate-200 dark:border-slate-700 transition-all active:scale-[0.98]">
            ${n.cancelText||`Cancelar`}
          </button>
          <button id="${i}-confirm" class="flex-1 py-3 bg-primary text-on-primary font-black text-xs rounded-xl transition-all active:scale-[0.98]">
            ${n.confirmText||`Aceptar`}
          </button>
        </div>
      </div>
    `,document.body.appendChild(a);let o=document.getElementById(`${i}-backdrop`),s=document.getElementById(`${i}-container`),c=document.getElementById(`${i}-input`);setTimeout(()=>{o&&o.classList.replace(`opacity-0`,`opacity-100`),s&&(s.classList.remove(`scale-95`,`opacity-0`),s.classList.add(`scale-100`,`opacity-100`),c?.focus())},10);let l=e=>{o&&o.classList.replace(`opacity-100`,`opacity-0`),s&&(s.classList.remove(`scale-100`,`opacity-100`),s.classList.add(`scale-95`,`opacity-0`)),a.classList.add(`pointer-events-none`),setTimeout(()=>{document.body.removeChild(a),r(e)},200)};document.getElementById(`${i}-cancel`).addEventListener(`click`,()=>l(null)),document.getElementById(`${i}-confirm`).addEventListener(`click`,()=>{l(c?c.value:``)}),c?.addEventListener(`keydown`,e=>{e.key===`Enter`&&l(c.value)})})}var Ke=t({actualizarCliente:()=>Ot,actualizarCredito:()=>Ut,actualizarEquipo:()=>It,actualizarPrestamoEstado:()=>_n,actualizarProducto:()=>jt,actualizarReventa:()=>Kt,actualizarServicioTecnico:()=>Xt,actualizarUsuario:()=>wt,analyzeBulkImeis:()=>vt,analyzeImeiLabel:()=>_t,analyzeLabelImage:()=>gt,applyLocalContextToSql:()=>it,compressImage:()=>ot,crearCliente:()=>Dt,crearCredito:()=>Ht,crearEquipo:()=>Ft,crearEquiposLote:()=>Rt,crearMeta:()=>yn,crearNomina:()=>rn,crearNuevoLocal:()=>pn,crearPrestamo:()=>gn,crearProducto:()=>At,crearReventa:()=>Gt,crearServicioTecnico:()=>Yt,crearTarea:()=>sn,crearUsuario:()=>Ct,crearValeFisico:()=>mn,eliminarCliente:()=>kt,eliminarEquipo:()=>Lt,eliminarMeta:()=>bn,eliminarNomina:()=>an,eliminarPrestamo:()=>vn,eliminarProducto:()=>Nt,eliminarReventa:()=>qt,eliminarServicioTecnico:()=>Zt,eliminarTarea:()=>ln,eliminarUsuario:()=>Tt,getAjustesEmpresa:()=>un,getClientes:()=>Et,getCreditos:()=>Vt,getDashboard:()=>Qt,getEgresos:()=>$t,getEquipos:()=>Pt,getInventario:()=>P,getLocalesConfigurados:()=>fn,getMetasProgreso:()=>xn,getNominas:()=>nn,getOpenRouterApiKey:()=>Je,getPrestamos:()=>hn,getReventas:()=>Wt,getTareas:()=>on,getTechnical:()=>Jt,getToken:()=>Ze,getTursoConfig:()=>qe,getUsers:()=>St,getVendedores:()=>tn,getVentas:()=>zt,inicializarEsquemaBaseDeDatos:()=>at,login:()=>yt,logout:()=>Qe,mapArgs:()=>N,pinProducto:()=>Mt,queryTurso:()=>M,registrarEgreso:()=>en,registrarVenta:()=>Bt,reset2fa:()=>xt,saveAjustesEmpresa:()=>dn,setToken:()=>Xe,syncOfflineQueue:()=>rt,updateTareaEstado:()=>cn,uploadEvidencia:()=>mt,uploadFoto:()=>ft,uploadSignature:()=>pt,verifyPin:()=>bt});function qe(){let e=localStorage.getItem(`fonebase_custom_turso_url`),t=localStorage.getItem(`fonebase_custom_turso_token`);return{url:e||`https://adminpro-adminpro.aws-us-west-2.turso.io/v2/pipeline`,token:t||`eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzcyOTIwOTMsImlkIjoiMDE5ZGNlZGItOTIwMS03NGVkLWIwZGYtZjg4MTQ3NjlhODcxIiwicmlkIjoiNWIwMWViNTctYTgxYS00OTI0LWIzMDUtZjk1Y2EwMjUzNmRkIn0.oruUZmv_ZLWlKA2ctQnghAD5PIiJSIeR4nzbZia-q-f1r12IHhLv1hDw9CsReABIceaVRHPS52JMZ4j3lcZ1Bw`}}function Je(){return localStorage.getItem(`fonebase_custom_openrouter_key`)||atob(`c2stb3ItdjEtYTIyYjlmMmQ5ODI4NDhhMGYyMjg4OWJhMDc0MTg0NWFlMWEzMzcyNjg5NDViODQ5MDkwNjZkNzNhZjRlYTllZg==`)}var Ye=localStorage.getItem(`adminpro_gas_token`)||``,Xe=e=>{Ye=e,localStorage.setItem(`adminpro_gas_token`,e)},Ze=()=>Ye,Qe=()=>{localStorage.removeItem(`adminpro_gas_token`),localStorage.removeItem(`adminproSession`),localStorage.removeItem(`adminpro_user`),location.reload()};function $e(e){let t=e=>typeof e==`string`?/\b(INSERT|UPDATE|DELETE|CREATE|ALTER|DROP)\b/i.test(e):!1,n=e=>{if(!e)return``;if(typeof e==`string`)return e;if(e.sql)return e.sql;if(e.stmt){if(typeof e.stmt==`string`)return e.stmt;if(e.stmt.sql)return e.stmt.sql}return``};return Array.isArray(e)?e.some(e=>t(n(e))):t(n(e))}function et(e){let t=e=>typeof e==`string`?/\b(CREATE\s+TABLE|ALTER\s+TABLE)\b/i.test(e):!1,n=e=>{if(!e)return``;if(typeof e==`string`)return e;if(e.sql)return e.sql;if(e.stmt){if(typeof e.stmt==`string`)return e.stmt;if(e.stmt.sql)return e.stmt.sql}return``};return Array.isArray(e)?e.some(e=>t(n(e))):t(n(e))}function tt(e){let t=[];try{t=JSON.parse(localStorage.getItem(`adminpro_offline_queue`)||`[]`)}catch{t=[]}t.push(e),localStorage.setItem(`adminpro_offline_queue`,JSON.stringify(t)),A(`⚠️ Sin conexión. Operación guardada en el teléfono para sincronizar.`,`warning`)}var nt=!1;async function rt(){if(nt||!navigator.onLine)return;let e=[];try{e=JSON.parse(localStorage.getItem(`adminpro_offline_queue`)||`[]`)}catch{e=[]}if(e.length===0)return;nt=!0;try{let e=qe();if(!(await fetch(e.url,{method:`POST`,headers:{Authorization:`Bearer ${e.token}`,"Content-Type":`application/json`},body:JSON.stringify({requests:[{type:`execute`,stmt:{sql:`SELECT 1`}}]})})).ok)throw Error(`Ping failed`)}catch{console.warn(`Ping a Turso fallido en syncOfflineQueue, abortando.`),nt=!1;return}let t=0;for(;e.length>0;){let n=e[0];try{await M(n,!0),e.shift(),localStorage.setItem(`adminpro_offline_queue`,JSON.stringify(e)),t++}catch(e){console.error(`Error procesando consulta en cola de sincronización:`,e);break}}nt=!1,t>0&&e.length===0&&(A(`🔄 ¡Conexión restablecida! Todos los datos locales se sincronizaron con la nube.`,`success`),setTimeout(()=>{location.reload()},1500))}function it(e){if(typeof e!=`string`)return e;let t=`local${localStorage.getItem(`fonebase_active_local_id`)||`1`}_`,n=[`inventario`,`equipos`,`ventas`,`egresos`,`servicio_tecnico`,`creditos`,`reventas`,`vales_fisicos`,`tareas`,`nominas`,`prestamos_empleados`],r=e;return n.forEach(e=>{let n=RegExp(`\\b${e}\\b`,`g`);r=r.replace(n,`${t}${e}`)}),r}async function M(e,t=!1){let n;if(Array.isArray(e)?n=e.map(e=>{if(typeof e==`string`)return it(e);if(e&&typeof e==`object`){let t={...e};return t.sql&&=it(t.sql),t}return e}):typeof e==`string`?n=it(e):e&&typeof e==`object`?(n={...e},n.sql&&=it(n.sql)):n=e,!t&&$e(n)&&!navigator.onLine&&!et(n)){tt(n);let e=[];return e.success=!0,e.offline=!0,e.message=`Operación guardada localmente por estar offline`,e}try{let e=Array.isArray(n)?n.map(e=>typeof e==`string`?{type:`execute`,stmt:{sql:e}}:e.type?e:{type:`execute`,stmt:e}):[{type:`execute`,stmt:typeof n==`string`?{sql:n}:n}],t=qe(),r=await(await fetch(t.url,{method:`POST`,headers:{Authorization:`Bearer ${t.token}`,"Content-Type":`application/json`},body:JSON.stringify({requests:e})})).json();if(r.error)throw Error(r.error.message||String(r.error));for(let e of r.results||[])if(e.type===`error`)throw Error(e.error&&e.error.message||`Error en la base de datos`);let i=(r.results||[]).map(e=>{if(!e.response||!e.response.result)return[];let{cols:t,rows:n}=e.response.result;return n.map(e=>{let n={};return t.forEach((t,r)=>{n[t.name]=e[r].value}),n})});return i.success=!0,$e(n)?setTimeout(rt,100):localStorage.setItem(`turso_read_cache_`+JSON.stringify(n),JSON.stringify(i)),i}catch(e){if(!t&&$e(n)){if(!et(n)){tt(n);let e=[];return e.success=!0,e.offline=!0,e.message=`Operación guardada localmente por fallo de red`,e}throw e}else if($e(n))throw e;else{let t=`turso_read_cache_`+JSON.stringify(n),r=localStorage.getItem(t);if(r){console.warn(`Recuperando datos desde caché local debido a error en la consulta:`,e);try{let e=JSON.parse(r);return e.success=!0,e.fromCache=!0,e}catch(e){console.error(`Error al deserializar caché:`,e)}}throw e}}}var N=e=>e.map(e=>typeof e==`number`?{type:`float`,value:e}:{type:`text`,value:String(e??``)});async function at(){for(let e of[`CREATE TABLE IF NOT EXISTS usuarios (email TEXT PRIMARY KEY, password TEXT, nombre TEXT, rol TEXT, estado TEXT)`,`CREATE TABLE IF NOT EXISTS clientes (id TEXT PRIMARY KEY, nombre TEXT, telefono TEXT, direccion TEXT, email TEXT, tipo TEXT, fecha_registro TEXT)`,`CREATE TABLE IF NOT EXISTS inventario (id TEXT PRIMARY KEY, nombre TEXT, marca TEXT, categoria TEXT, tipo TEXT, costo REAL, precio_venta REAL, stock_minimo INTEGER, stock_actual INTEGER, ubicacion TEXT, sku TEXT, imagen TEXT, fijado INTEGER DEFAULT 0)`,`CREATE TABLE IF NOT EXISTS equipos (imei1 TEXT PRIMARY KEY, imei2 TEXT, id_producto TEXT, marca TEXT, nombre TEXT, proveedor TEXT, costo REAL, venta REAL, estado TEXT, fecha_ingreso TEXT, color TEXT DEFAULT '', ram TEXT DEFAULT '', memoria TEXT DEFAULT '', condicion TEXT DEFAULT 'Nuevo', notas TEXT DEFAULT '')`,`CREATE TABLE IF NOT EXISTS ventas (id_factura TEXT PRIMARY KEY, fecha TEXT, cedula TEXT, cliente TEXT, direccion TEXT, producto_nombre TEXT, cantidad TEXT, cantidad_items TEXT, imeis TEXT, subtotal REAL, descuento REAL, total REAL, metodo TEXT, vendedor TEXT, firma_vendedor TEXT, firma_comprador TEXT, evidencia TEXT, ciudad TEXT, telefono TEXT, tipo_factura TEXT)`,`CREATE TABLE IF NOT EXISTS egresos (id_gasto TEXT PRIMARY KEY, fecha TEXT, categoria TEXT, concepto TEXT, responsable TEXT, monto REAL, nota TEXT)`,`CREATE TABLE IF NOT EXISTS servicio_tecnico (id_orden TEXT PRIMARY KEY, cliente TEXT, telefono TEXT, equipo TEXT, imei_serie TEXT, falla TEXT, clave_patron TEXT, repuestos TEXT, costo_taller REAL, abono REAL, precio_final REAL, estado TEXT, evidencias TEXT)`,`CREATE TABLE IF NOT EXISTS creditos (id_credito TEXT PRIMARY KEY, cliente TEXT, telefono TEXT, id_factura_ref TEXT, fecha_deuda TEXT, tipo TEXT, valor_total REAL, total_abonado REAL, saldo_pendiente REAL, estado TEXT, detalle TEXT, historial_abonos TEXT)`,`CREATE TABLE IF NOT EXISTS reventas (id_reventa TEXT PRIMARY KEY, fecha TEXT, producto TEXT, categoria TEXT, costo_proveedor REAL, precio_venta REAL, proveedor TEXT, utilidad REAL)`,`CREATE TABLE IF NOT EXISTS proveedores (id_prov TEXT PRIMARY KEY, nombre TEXT, nit TEXT, telefono TEXT, direccion TEXT, ciudad TEXT, contacto TEXT, correo TEXT, estado TEXT DEFAULT 'Activo')`,`CREATE TABLE IF NOT EXISTS marcas_categorias (nombre TEXT PRIMARY KEY, tipo TEXT)`,`CREATE TABLE IF NOT EXISTS vales_fisicos (id INTEGER PRIMARY KEY AUTOINCREMENT, cliente TEXT, producto TEXT, cantidad INTEGER, monto REAL, estado TEXT, fecha TEXT, foto_base64 TEXT)`,`CREATE TABLE IF NOT EXISTS tareas (id TEXT PRIMARY KEY, tarea TEXT, fecha_inicio TEXT, fecha_vencimiento TEXT, prioridad TEXT, estado TEXT, responsable TEXT, notas TEXT, color TEXT)`,`CREATE TABLE IF NOT EXISTS nominas (id_nomina TEXT PRIMARY KEY, fecha TEXT, empleado TEXT, periodo TEXT, salario_base REAL, deducciones REAL, bonificaciones REAL, total_pagar REAL, estado TEXT, notas TEXT)`,`CREATE TABLE IF NOT EXISTS prestamos_empleados (id_prestamo TEXT PRIMARY KEY, fecha TEXT, empleado TEXT, tipo TEXT, monto REAL, producto_id TEXT, producto_nombre TEXT, cantidad INTEGER, estado TEXT, notas TEXT)`,`CREATE TABLE IF NOT EXISTS metas_financieras (id_meta TEXT PRIMARY KEY, titulo TEXT, monto_objetivo REAL, tipo_calculo TEXT, fecha_inicio TEXT, fecha_limite TEXT, estado TEXT, notas TEXT)`,`CREATE TABLE IF NOT EXISTS ajustes_empresa (id INTEGER PRIMARY KEY, nombre TEXT, nit TEXT, propietario TEXT, telefono TEXT, direccion TEXT, ciudad TEXT, contacto TEXT, correo TEXT, condiciones TEXT, logo TEXT, logo_size INTEGER, mostrar_nombre INTEGER)`])try{await M(e,!0)}catch(e){console.error(`Error al inicializar tabla:`,e)}try{let e=localStorage.getItem(`fonebase_active_local_id`)||`1`;await M(`INSERT OR IGNORE INTO ajustes_empresa (id, nombre, nit, propietario, telefono, direccion, ciudad, contacto, correo, condiciones, logo, logo_size, mostrar_nombre) VALUES (${e}, '${e===`1`?`MI NEGOCIO`:`Sucursal ${e}`}', '900.123.456-1', 'Juan Pérez', '3001234567', 'Calle 123 No. 45 - 67', 'Bogotá - Cundinamarca', '3001234567', 'contacto@miempresa.com', 'GARANTIA: Equipos probados y encendidos. Sin garantía en displays/táctiles o equipos apagados.', '', 40, 1)`,!0)}catch(e){console.error(`Error al insertar ajustes_empresa inicial:`,e)}try{await M(`ALTER TABLE usuarios ADD COLUMN sucursal_id TEXT DEFAULT '1'`,!0);try{await M(`ALTER TABLE equipos ADD COLUMN color TEXT DEFAULT ''`,!0)}catch{}try{await M(`ALTER TABLE equipos ADD COLUMN ram TEXT DEFAULT ''`,!0)}catch{}try{await M(`ALTER TABLE equipos ADD COLUMN memoria TEXT DEFAULT ''`,!0)}catch{}try{await M(`ALTER TABLE equipos ADD COLUMN condicion TEXT DEFAULT 'Nuevo'`,!0)}catch{}try{await M(`ALTER TABLE equipos ADD COLUMN notas TEXT DEFAULT ''`,!0)}catch{}}catch{}}at().catch(e=>console.error(`Error al arrancar base de datos:`,e));function ot(e,t=1024,n=1024,r=.8){return new Promise(i=>{if(!e||!e.startsWith(`data:`)){i(e||``);return}let a=new Image;a.src=e,a.onload=()=>{let e=a.width,o=a.height;e>o?e>t&&(o=Math.round(o*t/e),e=t):o>n&&(e=Math.round(e*n/o),o=n);let s=document.createElement(`canvas`);s.width=e,s.height=o,s.getContext(`2d`).drawImage(a,0,0,e,o),i(s.toDataURL(`image/webp`,r))},a.onerror=()=>{i(e)}})}function st(e){let t=e.replace(/=+$/,``).toUpperCase(),n=t.length,r=0,i=0,a=[];for(let e=0;e<n;e++){let n=`ABCDEFGHIJKLMNOPQRSTUVWXYZ234567`.indexOf(t[e]);if(n===-1)throw Error(`Invalid base32 character`);i=i<<5|n,r+=5,r>=8&&(a.push(i>>>r-8&255),r-=8)}return new Uint8Array(a)}function ct(e){let t=1732584193,n=4023233417,r=2562383102,i=271733878,a=3285377520,o=e.length,s=o*8,c=(o+8)%64<56?56-(o+8)%64:120-(o+8)%64,l=new Uint8Array(o+1+c+8);l.set(e),l[o]=128;let u=new DataView(l.buffer);u.setUint32(l.length-4,s,!1);let d=new Uint32Array(80);for(let e=0;e<l.length;e+=64){for(let t=0;t<16;t++)d[t]=u.getUint32(e+t*4,!1);for(let e=16;e<80;e++){let t=d[e-3]^d[e-8]^d[e-14]^d[e-16];d[e]=t<<1|t>>>31}let o=t,s=n,c=r,l=i,f=a;for(let e=0;e<80;e++){let t,n;e<20?(t=s&c|~s&l,n=1518500249):e<40?(t=s^c^l,n=1859775393):e<60?(t=s&c|s&l|c&l,n=2400959708):(t=s^c^l,n=3395469782);let r=(o<<5|o>>>27)+t+f+n+d[e]>>>0;f=l,l=c,c=s<<30|s>>>2,s=o,o=r}t=t+o>>>0,n=n+s>>>0,r=r+c>>>0,i=i+l>>>0,a=a+f>>>0}let f=new Uint8Array(20),p=new DataView(f.buffer);return p.setUint32(0,t,!1),p.setUint32(4,n,!1),p.setUint32(8,r,!1),p.setUint32(12,i,!1),p.setUint32(16,a,!1),f}function lt(e,t){let n=e;n.length>64&&(n=ct(n));let r=new Uint8Array(64),i=new Uint8Array(64);r.fill(54),i.fill(92);for(let e=0;e<n.length;e++)r[e]^=n[e],i[e]^=n[e];let a=new Uint8Array(64+t.length);a.set(r,0),a.set(t,64);let o=ct(a),s=new Uint8Array(84);return s.set(i,0),s.set(o,64),ct(s)}async function ut(e,t=0){try{let n=st(e),r=Math.round(new Date().getTime()/1e3),i=Math.floor(r/30)+t,a=new Uint8Array(8),o=i;for(let e=7;e>=0;e--)a[e]=o&255,o=Math.floor(o/256);let s;if(window.crypto&&window.crypto.subtle&&typeof window.crypto.subtle.importKey==`function`){let e=await window.crypto.subtle.importKey(`raw`,n,{name:`HMAC`,hash:{name:`SHA-1`}},!1,[`sign`]),t=await window.crypto.subtle.sign(`HMAC`,e,a);s=new Uint8Array(t)}else s=lt(n,a);let c=s[s.length-1]&15,l=((s[c]&127)<<24|(s[c+1]&255)<<16|(s[c+2]&255)<<8|s[c+3]&255)%1e6;return String(l).padStart(6,`0`)}catch(e){return console.error(`Error generating TOTP`,e),null}}async function dt(e,t){for(let n=-1;n<=1;n++){let r=await ut(e,n);if(r&&r===t)return!0}return!1}var ft=async(e,t,n)=>await ot(e,1024,1024,.8),pt=async(e,t)=>e,mt=async(e,t,n)=>await ot(e,1024,1024,.8);async function ht(e,t,n=`label`){n===!0&&(n=`imei`),n===!1&&(n=`label`);let r=`Eres un asistente experto en identificación de productos de tecnología, celulares y accesorios (como cargadores, audífonos, estuches, etc.). Mira esta imagen de un producto, caja, etiqueta o factura. Identifica la información y responde SOLO con un JSON válido, sin texto adicional, sin bloques de código, sin explicaciones:

{"name":"nombre del modelo sin la marca (ej: Cargador 20W USB-C, Galaxy A54, Audífonos Bluetooth Pro)","brand":"marca (ej: Samsung, Apple, Xiaomi, Genérico)","category":"Categoría sugerida (DEBE ser uno de estos valores exactos: Celulares, Accesorios, Audio, Tablets)","sku":"código de modelo o SKU del fabricante","ram":"RAM si aplica (ej: 8GB)","memoria":"almacenamiento si aplica (ej: 256GB)","color":"color en español (ej: Blanco, Negro, Azul)","cost":"","price":"","description":"Ficha técnica detallada del producto resumida con características clave de lo visible","adCopy":"Mensaje de venta/publicidad creativo y atractivo en español con emojis, ideal para estados de WhatsApp, Instagram o catálogo digital","bestPhotoIndex":"índice base 0 de la mejor foto para perfil"}

REGLAS:
- name: nombre descriptivo del modelo de celular o accesorio SIN incluir la marca. Ej: para "Apple USB-C Power Adapter 20W" -> "Adaptador de Corriente USB-C 20W" o "Cargador 20W USB-C".
- brand: la marca del fabricante. Si no es de marca conocida o no se visualiza, responder "Genérico".
- category: Clasifica el producto. Si es un cargador, cable, adaptador, protector, estuche, etc., usa "Accesorios". Si es un celular o smartphone, usa "Celulares". Si son audífonos, parlantes o altavoces, usa "Audio". Si es una tablet, usa "Tablets".
- ram y memoria: Solo si aplica (celulares/tablets) y es visible.
- color: traducir colores al español.
- cost y price: solo si hay precios o costos visibles en la imagen, como número sin símbolo de moneda.
- description: Generar una ficha técnica detallada basada únicamente en lo que muestra la imagen (especificaciones, compatibilidad, entradas, salidas, potencia, etc.).
- adCopy: Generar un texto publicitario muy atractivo y enganchador para vender este producto, destacando sus beneficios y agregando emojis llamativos.
- bestPhotoIndex: número entero (ej: 0, 1, 2) que representa el índice base 0 de la imagen que mejor muestre el producto completo o su caja limpia para perfil comercial. Si solo hay una imagen, responder 0.
- Si no encuentras un dato, deja el valor como cadena vacía "".
- NO inventes datos que no estén en la imagen.`;n===`imei`?r=`Eres un experto en identificación de teléfonos celulares. Mira esta imagen de la etiqueta trasera, caja o sticker de un teléfono celular. Extrae los números IMEI y la información del dispositivo. Responde SOLO con un JSON válido, sin texto adicional, sin bloques de código:

{"imei1":"primer número IMEI de 15 dígitos","imei2":"segundo número IMEI de 15 dígitos si existe","name":"nombre del modelo sin la marca (ej: Galaxy A54, iPhone 15 Pro)","brand":"marca (ej: Samsung, Apple, Xiaomi)","color":"color en español","ram":"RAM si aplica (ej: 8GB)","memoria":"almacenamiento si aplica (ej: 256GB)","sku":"código modelo fabricante","cost":"","price":"","bestPhotoIndex":"índice base 0 de la mejor foto para perfil"}

REGLAS:
- imei1: el primer IMEI visible, debe ser exactamente 15 dígitos numéricos
- imei2: el segundo IMEI si existe, 15 dígitos. Si solo hay uno, dejar vacío ""
- name: solo el nombre del modelo SIN la marca
- brand: la marca del fabricante
- color: traducir al español
- bestPhotoIndex: número entero (ej: 0, 1, 2) que representa el índice base 0 de la imagen que mejor muestre el producto completo o su caja limpia para perfil comercial. Si solo hay una imagen, responder 0.
- Si no encuentras un dato, deja el valor como cadena vacía ""
- NO inventes datos. Solo extrae lo que ves en la imagen`:n===`bulk`&&(r=`Eres un experto en digitalización de inventarios. Mira esta imagen que contiene un listado, etiquetas, códigos de barras o una caja con múltiples números IMEI de teléfonos celulares. Extrae todos los números IMEI de 15 dígitos numéricos que encuentres. Responde SOLO con un JSON válido, sin texto adicional, sin bloques de código ni explicaciones:

{"imeis":["IMEI_1_de_15_dígitos","IMEI_2_de_15_dígitos",...]}

REGLAS:
- Cada IMEI en el arreglo "imeis" debe ser una cadena de exactamente 15 caracteres numéricos.
- No incluyas espacios, guiones ni letras en los IMEIs.
- Si no detectas ningún IMEI válido, responde con un arreglo vacío {"imeis":[]}.
- NO inventes datos. Solo extrae lo que ves en la imagen.`);let i=[];if(i.push({text:r}),Array.isArray(e))e.forEach(e=>{let t=e.base64;t.includes(`base64,`)&&(t=t.split(`base64,`)[1]),i.push({inlineData:{mimeType:e.type||e.mimeType||`image/jpeg`,data:t}})});else{let n=e;n.includes(`base64,`)&&(n=n.split(`base64,`)[1]),i.push({inlineData:{mimeType:t||`image/jpeg`,data:n}})}let a=Je(),o=[{type:`text`,text:r}];if(Array.isArray(e))e.forEach(e=>{let t=e.base64;t.startsWith(`data:`)||(t=`data:${e.type||`image/jpeg`};base64,${t}`),o.push({type:`image_url`,image_url:{url:t}})});else{let n=e;n.startsWith(`data:`)||(n=`data:${t||`image/jpeg`};base64,${n}`),o.push({type:`image_url`,image_url:{url:n}})}try{console.log(`[Qwen 3.7 Flash] Analizando imagen de inventario...`);let e=await fetch(`https://openrouter.ai/api/v1/chat/completions`,{method:`POST`,headers:{"Content-Type":`application/json`,Authorization:`Bearer ${a}`,"HTTP-Referer":`https://adminpro.local`,"X-Title":`FoneBase Inventory AI`},body:JSON.stringify({model:`google/gemini-2.5-flash-lite`,messages:[{role:`user`,content:o}],temperature:.1,max_tokens:4e3})});if(!e.ok){let t=await e.text();throw Error(`Error de OpenRouter (${e.status}): ${t.substring(0,200)}`)}let t=await e.json();if(!t.choices||t.choices.length===0)throw Error(`Sin respuesta del modelo Gemini 2.5 Flash Lite`);let n=t.choices[0].message||{},r=(n.content||n.reasoning||``).trim(),i=r.match(/```(?:json)?\s*([\s\S]*?)```/);i&&(r=i[1].trim());let s=r.indexOf(`{`),c=r.lastIndexOf(`}`);s!==-1&&c>s&&(r=r.substring(s,c+1));let l=JSON.parse(r);return console.log(`[Gemini 2.5 Flash Lite] Éxito al analizar producto:`,l),{success:!0,data:l,model:`google/gemini-2.5-flash-lite`}}catch(e){return console.error(`[Gemini 2.5 Flash Lite] Excepción al analizar imagen:`,e),{success:!1,mensaje:`Error de análisis con Gemini 2.5 Flash Lite: ${e.message}`}}}var gt=async(e,t)=>await ht(e,t,`label`),_t=async(e,t)=>await ht(e,t,`imei`),vt=async(e,t)=>await ht(e,t,`bulk`),yt=async(e,t)=>{try{let n=(await M({sql:`SELECT email, nombre, rol, estado, totp_secret FROM usuarios WHERE email = ? AND password = ? AND estado = 'Activo'`,args:[{type:`text`,value:e.toLowerCase()},{type:`text`,value:t}]}))[0]?.[0];if(!n)return{success:!1,mensaje:`Credenciales incorrectas`};if(!n.totp_secret){let e=``;for(let t=0;t<16;t++)e+=`ABCDEFGHIJKLMNOPQRSTUVWXYZ234567`.charAt(Math.floor(Math.random()*32));await M({sql:`UPDATE usuarios SET totp_secret = ? WHERE email = ?`,args:[{type:`text`,value:e},{type:`text`,value:n.email.toLowerCase()}]});let t=`otpauth://totp/FoneBase:${n.email}?secret=${e}&issuer=FoneBase`,r=`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(t)}`;return{success:!0,step:`setup-totp`,secret:e,qrCodeUrl:r,nombre:n.nombre}}return{success:!0,step:`totp`,nombre:n.nombre}}catch(e){return{success:!1,mensaje:`Error en base de datos: `+e.message}}},bt=async(e,t)=>{try{let n=(await M({sql:`SELECT nombre, rol, email, totp_secret FROM usuarios WHERE email = ?`,args:[{type:`text`,value:e.toLowerCase()}]}))[0]?.[0];if(!n)return{success:!1,mensaje:`Usuario no encontrado`};if(!n.totp_secret)return{success:!1,mensaje:`2FA no configurado`};if(!await dt(n.totp_secret,t))return{success:!1,mensaje:`Código 2FA incorrecto`};let r=btoa(JSON.stringify({email:n.email,nombre:n.nombre,rol:n.rol,exp:Date.now()+1440*60*1e3}));Xe(r);let i={nombre:n.nombre,rol:n.rol,email:n.email,token:r};return localStorage.setItem(`adminpro_user`,JSON.stringify(i)),{success:!0,...i}}catch(e){return{success:!1,mensaje:`Error de autenticación: `+e.message}}},xt=async e=>{try{return await M({sql:`UPDATE usuarios SET totp_secret = NULL WHERE email = ?`,args:[{type:`text`,value:e.toLowerCase()}]}),{success:!0}}catch(e){throw Error(`Error al restablecer 2FA: `+e.message)}},St=async()=>{try{await M(`ALTER TABLE usuarios ADD COLUMN sucursal_id TEXT DEFAULT 'PRINCIPAL'`)}catch{}return(await M(`SELECT * FROM usuarios ORDER BY nombre ASC`))[0]||[]},Ct=e=>M({sql:`INSERT INTO usuarios (email, password, nombre, rol, estado, sucursal_id) VALUES (?,?,?,?,?,?)`,args:N(e)}),wt=(e,t,n)=>M({sql:`UPDATE usuarios SET email=?, password=?, nombre=?, rol=?, estado=?, sucursal_id=? WHERE email=?`,args:[{type:`text`,value:t},...N(n),{type:`text`,value:e}]}),Tt=e=>M({sql:`DELETE FROM usuarios WHERE email = ?`,args:[{type:`text`,value:e}]}),Et=async()=>((await M(`SELECT * FROM clientes ORDER BY nombre ASC`))[0]||[]).map(e=>({...e,cedula:e.id})),Dt=e=>M({sql:`INSERT INTO clientes VALUES (?,?,?,?,?,?,?)`,args:N([e.cedula,e.nombre,e.telefono,e.direccion,e.email,e.tipo,new Date().toISOString()])}),Ot=(e,t)=>M({sql:`UPDATE clientes SET id=?, nombre=?, telefono=?, direccion=?, email=?, tipo=? WHERE id=?`,args:[...N([t.cedula,t.nombre,t.telefono,t.direccion,t.email,t.tipo]),{type:`text`,value:e}]}),kt=e=>M({sql:`DELETE FROM clientes WHERE id = ?`,args:[{type:`text`,value:e}]}),P=async()=>{try{await M(`ALTER TABLE inventario ADD COLUMN fijado INTEGER DEFAULT 0`)}catch{}return((await M(`SELECT * FROM inventario ORDER BY fijado DESC, id DESC`))[0]||[]).map(e=>({...e,stockActual:e.stock_actual,stockMinimo:e.stock_minimo,precioVenta:e.precio_venta,costo:e.costo,fijado:e.fijado||0}))},At=e=>{let t=[...e];return t.length===12&&t.push(0),M({sql:`INSERT INTO inventario VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,args:N(t)})},jt=(e,t)=>M({sql:`UPDATE inventario SET nombre=?, marca=?, categoria=?, tipo=?, costo=?, precio_venta=?, stock_minimo=?, stock_actual=?, ubicacion=?, sku=?, imagen=?, fijado=? WHERE id=?`,args:[...N(Array.isArray(t)?t.length===13?t.slice(1):t:[]),{type:`text`,value:String(e||``)}]}),Mt=(e,t)=>M({sql:`UPDATE inventario SET fijado=? WHERE id=?`,args:[{type:`integer`,value:t},{type:`text`,value:e}]}),Nt=e=>M({sql:`DELETE FROM inventario WHERE id = ?`,args:[{type:`text`,value:e}]}),Pt=async()=>{let e=await M(`SELECT * FROM equipos ORDER BY fecha_ingreso DESC, imei1 DESC`);return e&&e[0]||[]},Ft=e=>{let t={sql:`INSERT INTO equipos (imei1, imei2, id_producto, marca, nombre, proveedor, costo, venta, precio_revendedor, estado, fecha_ingreso, color, ram, memoria, condicion, notas) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,args:N([e.imei1,e.imei2||``,e.id_producto||``,e.marca||``,e.nombre||``,e.proveedor||``,e.costo||0,e.venta||0,e.precio_revendedor||e.reventa||0,e.estado||`Disponible`,e.fecha_ingreso||new Date().toISOString(),e.color||``,e.ram||``,e.memoria||``,e.condicion||`Nuevo`,e.notas||``])},n=e.id_producto?{sql:`UPDATE inventario SET stock_actual = (SELECT COUNT(*) FROM equipos WHERE id_producto = ? AND estado = 'Disponible') WHERE id = ?`,args:[{type:`text`,value:e.id_producto},{type:`text`,value:e.id_producto}]}:null;return M(n?[t,n]:t)},It=(e,t)=>{let n={sql:`UPDATE equipos SET imei1=?, imei2=?, id_producto=?, marca=?, nombre=?, proveedor=?, costo=?, venta=?, precio_revendedor=?, estado=?, fecha_ingreso=?, color=?, ram=?, memoria=?, condicion=?, notas=? WHERE imei1=?`,args:[...N([t.imei1,t.imei2||``,t.id_producto||``,t.marca||``,t.nombre||``,t.proveedor||``,t.costo||0,t.venta||0,t.precio_revendedor||t.reventa||0,t.estado||`Disponible`,t.fecha_ingreso||new Date().toISOString(),t.color||``,t.ram||``,t.memoria||``,t.condicion||`Nuevo`,t.notas||``]),{type:`text`,value:e}]},r=t.id_producto?{sql:`UPDATE inventario SET stock_actual = (SELECT COUNT(*) FROM equipos WHERE id_producto = ? AND estado = 'Disponible') WHERE id = ?`,args:[{type:`text`,value:t.id_producto},{type:`text`,value:t.id_producto}]}:null;return M(r?[n,r]:n)},Lt=(e,t=null)=>M([{sql:`DELETE FROM equipos WHERE imei1 = ?`,args:[{type:`text`,value:e}]},{sql:`UPDATE inventario SET stock_actual = (SELECT COUNT(*) FROM equipos WHERE equipos.id_producto = inventario.id AND equipos.estado = 'Disponible') WHERE id IN (SELECT DISTINCT id_producto FROM equipos UNION SELECT ? WHERE ? IS NOT NULL AND ? != '')`,args:[{type:`text`,value:t||``},{type:`text`,value:t||``},{type:`text`,value:t||``}]}]),Rt=e=>{let t=e.map(e=>({sql:`INSERT INTO equipos (imei1, imei2, id_producto, marca, nombre, proveedor, costo, venta, precio_revendedor, estado, fecha_ingreso, color, ram, memoria, condicion, notas) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,args:N([e.imei1,e.imei2||``,e.id_producto||``,e.marca||``,e.nombre||``,e.proveedor||``,e.costo||0,e.venta||0,e.precio_revendedor||e.reventa||0,e.estado||`Disponible`,e.fecha_ingreso||new Date().toISOString(),e.color||``,e.ram||``,e.memoria||``,e.condicion||`Nuevo`,e.notas||``])}));return[...new Set(e.map(e=>e.id_producto).filter(Boolean))].forEach(e=>{t.push({sql:`UPDATE inventario SET stock_actual = (SELECT COUNT(*) FROM equipos WHERE id_producto = ? AND estado = 'Disponible') WHERE id = ?`,args:[{type:`text`,value:e},{type:`text`,value:e}]})}),M(t)},zt=async()=>(await M(`SELECT * FROM ventas ORDER BY fecha DESC`))[0]||[],Bt=async e=>{let t=`FAC-${Date.now()}`,n=new Date().toISOString(),r=[{sql:`INSERT INTO ventas VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,args:[{type:`text`,value:t},{type:`text`,value:n},{type:`text`,value:e.cedula||``},{type:`text`,value:e.cliente||``},{type:`text`,value:e.direccion||``},{type:`text`,value:e.productoNombre||``},{type:`text`,value:String(e.total||0)},{type:`text`,value:String(e.items?.length||1)},{type:`text`,value:e.imeis||`N/A`},{type:`float`,value:e.subtotal||0},{type:`float`,value:e.descuento||0},{type:`float`,value:e.total||0},{type:`text`,value:e.metodo||``},{type:`text`,value:e.vendedor||``},{type:`text`,value:e.firmaVendedor||``},{type:`text`,value:e.firmaComprador||``},{type:`text`,value:e.evidencia||``},{type:`text`,value:e.ciudad||``},{type:`text`,value:e.telefono||``},{type:`text`,value:e.tipoFactura||`fisica`}]}];if(e.items&&Array.isArray(e.items)?e.items.forEach(e=>{r.push({sql:`UPDATE inventario SET stock_actual = stock_actual - ? WHERE id = ?`,args:[{type:`float`,value:parseFloat(e.qty||1)},{type:`text`,value:e.id}]})}):r.push({sql:`UPDATE inventario SET stock_actual = stock_actual - 1 WHERE id = ?`,args:[{type:`text`,value:e.productoId||``}]}),e.imeis&&e.imeis!==`N/A`&&e.imeis!==`{}`&&e.imeis!==`[]`){let t=[];try{let n=typeof e.imeis==`string`?JSON.parse(e.imeis):e.imeis;Array.isArray(n)?t=n:typeof n==`object`&&(t=Object.values(n).flat())}catch{typeof e.imeis==`string`&&(t=e.imeis.split(/[\s,;]+/).filter(Boolean))}t.forEach(e=>{let t=String(e).trim();t&&t!==`N/A`&&t!==`{}`&&r.push({sql:`UPDATE equipos SET estado = 'Vendido' WHERE imei1 = ? OR imei2 = ?`,args:[{type:`text`,value:t},{type:`text`,value:t}]})})}return await M(r),{success:!0,idFactura:t}},Vt=async()=>(await M(`SELECT * FROM creditos`))[0].map(e=>({...e,id:e.id_credito,idFactura:e.id_factura_ref,fecha:e.fecha_deuda,abonado:e.total_abonado,saldo:e.saldo_pendiente,total:e.valor_total,fechaCancelacion:e.fecha_cancelacion,historialAbonos:e.historial_abonos})),Ht=e=>M({sql:`INSERT INTO creditos (id_credito, cliente, telefono, id_factura_ref, fecha_deuda, tipo, valor_total, total_abonado, saldo_pendiente, estado, detalle, historial_abonos) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,args:N([Date.now().toString(),e.cliente,e.telefono,e.idFactura||``,new Date().toISOString(),e.tipo||`Crédito`,Number(e.total||0),0,Number(e.total||0),`Activo`,e.detalle||``,e.historialAbonos||``])}),Ut=(e,t)=>M({sql:`UPDATE creditos SET id_credito=?, cliente=?, telefono=?, id_factura_ref=?, fecha_deuda=?, tipo=?, valor_total=?, total_abonado=?, saldo_pendiente=?, estado=?, fecha_cancelacion=?, detalle=?, historial_abonos=? WHERE id_credito=?`,args:[...N([t.id_credito||t.id,t.cliente,t.telefono,t.id_factura_ref||t.idFactura||``,t.fecha_deuda||t.fecha||``,t.tipo||`Crédito`,Number(t.total===void 0?t.valor_total===void 0?0:t.valor_total:t.total),Number(t.abonado===void 0?t.total_abonado===void 0?0:t.total_abonado:t.abonado),Number(t.saldo===void 0?t.saldo_pendiente===void 0?0:t.saldo_pendiente:t.saldo),t.estado,t.fechaCancelacion===void 0?t.fecha_cancelacion||``:t.fechaCancelacion,t.detalle||``,t.historialAbonos===void 0?t.historial_abonos||``:t.historialAbonos]),{type:`text`,value:e}]}),Wt=async()=>(await M(`SELECT * FROM reventas ORDER BY fecha DESC`))[0].map(e=>({...e,id:e.id_reventa,producto:e.producto,costo:e.costo_proveedor,precio:e.precio_venta,utilidad:e.utilidad})),Gt=e=>M({sql:`INSERT INTO reventas VALUES (?,?,?,?,?,?,?,?)`,args:N([`REV-${Date.now()}`,new Date().toISOString(),e.producto,e.categoria,e.costo,e.precio,e.proveedor,e.precio-e.costo])}),Kt=(e,t)=>M({sql:`UPDATE reventas SET id_reventa=?, fecha=?, producto=?, categoria=?, costo_proveedor=?, precio_venta=?, proveedor=?, utilidad=? WHERE id_reventa=?`,args:[...N(t),{type:`text`,value:e}]}),qt=e=>M({sql:`DELETE FROM reventas WHERE id_reventa = ?`,args:[{type:`text`,value:e}]}),Jt=async()=>(await M(`SELECT * FROM servicio_tecnico ORDER BY id_orden DESC`))[0]||[],Yt=e=>M({sql:`INSERT INTO servicio_tecnico VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,args:N(e)}),Xt=(e,t)=>M({sql:`UPDATE servicio_tecnico SET id_orden=?, cliente=?, telefono=?, equipo=?, imei_serie=?, falla=?, clave_patron=?, repuestos=?, costo_taller=?, abono=?, precio_final=?, estado=?, evidencias=? WHERE id_orden=?`,args:[...N(t),{type:`text`,value:e}]}),Zt=e=>M({sql:`DELETE FROM servicio_tecnico WHERE id_orden = ?`,args:[{type:`text`,value:e}]}),Qt=async()=>{let e=await M([`SELECT COUNT(*) as c FROM inventario`,`SELECT COUNT(*) as c FROM clientes`,`SELECT SUM(total) as s FROM ventas WHERE date(fecha) = date('now')`,`SELECT SUM(monto) as s FROM egresos WHERE date(fecha) = date('now')`,`SELECT SUM(stock_actual) as s FROM inventario`,`SELECT COUNT(*) as c FROM inventario WHERE stock_actual <= 1`,`SELECT * FROM ventas ORDER BY fecha DESC LIMIT 8`,`SELECT date(fecha) as d, SUM(total) as m FROM ventas WHERE date(fecha) >= date('now','-7 days') GROUP BY d`,`SELECT COUNT(*) as c FROM equipos`,`SELECT productos, COUNT(*) as qty FROM ventas GROUP BY productos ORDER BY qty DESC LIMIT 5`,`SELECT id, nombre, stock_actual, stock_minimo FROM inventario WHERE stock_actual <= 1 LIMIT 5`,`SELECT id_orden, cliente, equipo, estado FROM servicio_tecnico ORDER BY id_orden DESC LIMIT 5`,`SELECT COUNT(*) as c FROM creditos WHERE estado != 'Pagado' AND estado != 'Cancelado'`,`SELECT COUNT(*) as c FROM reventas`]),t=[],n=[];for(let r=6;r>=0;r--){let i=new Date;i.setDate(i.getDate()-r);let a=i.toISOString().slice(0,10);t.push(i.toLocaleDateString(`es-CO`,{weekday:`short`,day:`numeric`}));let o=(e[7]||[]).find(e=>e.d===a);n.push(o?o.m:0)}return{ingresosHoy:e[2]?.[0]?.s||0,egresosHoy:e[3]?.[0]?.s||0,utilidad:(e[2]?.[0]?.s||0)-(e[3]?.[0]?.s||0),totalProductos:e[0]?.[0]?.c||0,totalClientes:e[1]?.[0]?.c||0,totalStock:e[4]?.[0]?.s||0,stockCritico:e[5]?.[0]?.c||0,totalEquipos:e[8]?.[0]?.c||0,ventasRecientes:e[6]||[],topProductos:(e[9]||[]).map(e=>({nombre:e.productos,cantidad:e.qty})),productosBajoStock:(e[10]||[]).map(e=>({...e,stockActual:e.stock_actual})),tecRecientes:e[11]||[],creditosActivos:e[12]?.[0]?.c||0,totalReventas:e[13]?.[0]?.c||0,labels7d:t,ventas7d:n}},$t=async()=>((await M(`SELECT * FROM egresos ORDER BY fecha DESC`))[0]||[]).map(e=>({...e,id:e.id_gasto})),en=e=>M({sql:`INSERT INTO egresos VALUES (?,?,?,?,?,?,?)`,args:N([`EGR-${Date.now()}`,new Date().toISOString(),e.categoria,e.concepto,e.responsable,e.monto,``])}),tn=async()=>(await M(`SELECT nombre, email FROM usuarios WHERE rol != 'Cliente'`))[0]||[],nn=async()=>((await M(`SELECT * FROM nominas ORDER BY fecha DESC`))[0]||[]).map(e=>({...e,id:e.id_nomina})),rn=e=>M({sql:`INSERT INTO nominas VALUES (?,?,?,?,?,?,?,?,?,?)`,args:N([`NOM-${Date.now()}`,e.fecha||new Date().toISOString(),e.empleado,e.periodo,e.salario_base,e.deducciones,e.bonificaciones,e.total_pagar,e.estado||`Pendiente`,e.notas||``])}),an=e=>M({sql:`DELETE FROM nominas WHERE id_nomina = ?`,args:[{type:`text`,value:e}]}),on=async()=>(await M(`SELECT * FROM tareas ORDER BY date(fecha_vencimiento) ASC`))[0]||[],sn=e=>M({sql:`INSERT INTO tareas VALUES (?,?,?,?,?,?,?,?,?)`,args:N([`T-${Date.now()}`,e.tarea,e.fecha_inicio,e.fecha_vencimiento,e.prioridad,e.estado||`Pendiente`,e.responsable,e.notas||``,e.color||`#4f46e5`])}),cn=(e,t)=>M({sql:`UPDATE tareas SET estado = ? WHERE id = ?`,args:[{type:`text`,value:t},{type:`text`,value:e}]}),ln=e=>M({sql:`DELETE FROM tareas WHERE id = ?`,args:[{type:`text`,value:e}]}),un=async()=>(await M(`SELECT * FROM ajustes_empresa WHERE id = ${localStorage.getItem(`fonebase_active_local_id`)||`1`}`))[0]?.[0]||null,dn=e=>M({sql:`UPDATE ajustes_empresa SET nombre=?, nit=?, propietario=?, telefono=?, direccion=?, ciudad=?, contacto=?, correo=?, condiciones=?, logo=?, logo_size=?, mostrar_nombre=? WHERE id=${localStorage.getItem(`fonebase_active_local_id`)||`1`}`,args:N([e.nombre,e.nit,e.propietario,e.telefono,e.direccion,e.ciudad,e.contacto,e.correo,e.condiciones,e.logo||``,e.logo_size||40,e.mostrar_nombre===void 0?1:e.mostrar_nombre])}),fn=async()=>(await M(`SELECT id, nombre FROM ajustes_empresa`,!0))[0]||[],pn=async e=>{let t=await fn(),n=1;return t.forEach(e=>{let t=parseInt(e.id,10);t>=n&&(n=t+1)}),await M({sql:`INSERT INTO ajustes_empresa (id, nombre, nit, propietario, telefono, direccion, ciudad, contacto, correo, condiciones, logo, logo_size, mostrar_nombre) VALUES (?, ?, '900.123.456-1', 'Juan Pérez', '3001234567', 'Calle 123 No. 45 - 67', 'Bogotá - Cundinamarca', '3001234567', 'contacto@miempresa.com', 'GARANTIA: Equipos probados y encendidos. Sin garantía en displays/táctiles o equipos apagados.', '', 40, 1)`,args:N([n,e])},!0),n},mn=e=>M({sql:`INSERT INTO vales_fisicos (cliente, producto, cantidad, monto, estado, fecha, foto_base64) VALUES (?,?,?,?,?,?,?)`,args:N([e.cliente,e.producto,e.cantidad||1,e.monto||0,e.estado||`Pendiente`,e.fecha||new Date().toISOString().split(`T`)[0],e.foto_base64||``])}),hn=async()=>((await M(`SELECT * FROM prestamos_empleados ORDER BY fecha DESC`))[0]||[]).map(e=>({...e,id:e.id_prestamo})),gn=e=>M({sql:`INSERT INTO prestamos_empleados (id_prestamo, fecha, empleado, tipo, monto, producto_id, producto_nombre, cantidad, estado, notas) VALUES (?,?,?,?,?,?,?,?,?,?)`,args:N([`PR-${Date.now()}`,e.fecha||new Date().toISOString(),e.empleado,e.tipo||`Dinero`,Number(e.monto||0),e.producto_id||``,e.producto_nombre||``,Number(e.cantidad||0),e.estado||`Pendiente`,e.notas||``])}),_n=(e,t)=>M({sql:`UPDATE prestamos_empleados SET estado = ? WHERE id_prestamo = ?`,args:[{type:`text`,value:t},{type:`text`,value:e}]}),vn=e=>M({sql:`DELETE FROM prestamos_empleados WHERE id_prestamo = ?`,args:[{type:`text`,value:e}]}),yn=e=>M({sql:`INSERT INTO metas_financieras (id_meta, titulo, monto_objetivo, tipo_calculo, fecha_inicio, fecha_limite, estado, notas) VALUES (?,?,?,?,?,?,?,?)`,args:N([`META-${Date.now()}`,e.titulo||``,Number(e.monto_objetivo||0),e.tipo_calculo||`Ventas`,e.fecha_inicio||new Date().toISOString().split(`T`)[0],e.fecha_limite||new Date().toISOString().split(`T`)[0],e.estado||`Activa`,e.notas||``])}),bn=e=>M({sql:`DELETE FROM metas_financieras WHERE id_meta = ?`,args:[{type:`text`,value:e}]}),xn=async()=>{let e=(await M(`SELECT * FROM metas_financieras ORDER BY fecha_inicio DESC`))[0]||[];if(e.length===0)return[];let t=[];e.forEach(e=>{let n=(e.fecha_inicio||``).substring(0,10),r=(e.fecha_limite||``).substring(0,10);t.push({sql:`SELECT COALESCE(SUM(CAST(total AS REAL)), 0) as val FROM ventas WHERE date(fecha) >= date(?) AND date(fecha) <= date(?)`,args:[{type:`text`,value:n},{type:`text`,value:r}]}),t.push({sql:`SELECT COALESCE(SUM(CAST(monto AS REAL)), 0) as val FROM egresos WHERE date(fecha) >= date(?) AND date(fecha) <= date(?)`,args:[{type:`text`,value:n},{type:`text`,value:r}]})});let n=await M(t),r=0;return e.map(e=>{let t=n[r]?.[0]?.val||0;r++;let i=n[r]?.[0]?.val||0;r++;let a=0;e.tipo_calculo===`Ventas`?a=t:e.tipo_calculo===`Utilidad`&&(a=t-i);let o=e.monto_objetivo>0?a/e.monto_objetivo*100:0;return{...e,id:e.id_meta,acumulado:a,porcentaje:o}})};async function Sn(e,t=1024,n=1024,r=.75){return new Promise((i,a)=>{let o=new Image;o.onload=()=>{let e=o.width,a=o.height;e>a?e>t&&(a=Math.round(a*t/e),e=t):a>n&&(e=Math.round(e*n/a),a=n);let s=document.createElement(`canvas`);s.width=e,s.height=a,s.getContext(`2d`).drawImage(o,0,0,e,a),i(s.toDataURL(`image/jpeg`,r))},o.onerror=e=>a(e),o.src=e})}var F=[],I=[],Cn=null,wn=`grid`,L=[];function Tn(e,t){let n=Number(e),r=Number(t);return n===0?{label:`Sin Stock`,cls:`bg-red-100 text-red-800 border-red-200`,icon:`block`}:n<=r?{label:`Bajo: ${n}`,cls:`bg-amber-100 text-amber-800 border-amber-200`,icon:`warning`}:{label:`OK: ${n}`,cls:`bg-emerald-100 text-emerald-800 border-emerald-200`,icon:`check_circle`}}function En(){let e=document.getElementById(`inv-grid`),t=document.getElementById(`inv-table-wrapper`),n=document.getElementById(`inv-table-body`);if(!e)return;let r=JSON.parse(localStorage.getItem(`adminpro_user`)||`{}`),i=String(r.rol||``).trim().toLowerCase(),a=!i||i===`administrador`||i.includes(`admin`),o=i===`técnico de reparación`||i===`tecnico`;wn===`grid`?(t.classList.add(`hidden`),e.classList.remove(`hidden`),e.innerHTML=I.length?I.map(e=>{let t=Tn(e.stockActual,e.stockMinimo),n=Number(e.stockActual)===0,r=Number(String(e.precioVenta).replace(/\D/g,``)).toLocaleString(`es-CO`);return`
            <div onclick="inventoryView.openDetail('${e.id}')" class="bg-surface-container-lowest border border-surface-variant rounded-2xl p-4 shadow-sm hover:shadow-md transition-all group flex flex-col cursor-pointer ${n?`opacity-70 grayscale-[0.5]`:``}">
              <div class="flex items-start gap-4 mb-4">
                <div class="w-16 h-16 rounded-xl bg-surface-container flex items-center justify-center overflow-hidden flex-shrink-0">
                  ${e.imagen?`<img src="${e.imagen}" class="w-full h-full object-cover">`:`<span class="material-symbols-outlined text-3xl text-on-surface-variant/40">image</span>`}
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-1.5 mb-1">
                    <div class="flex items-center gap-1 min-w-0">
                      <h4 class="font-bold text-on-surface text-sm truncate flex-1" title="${e.nombre}">${e.nombre}</h4>
                      <span onclick="event.stopPropagation(); window.inventoryView.togglePin('${e.id}', ${+!e.fijado})" 
                            class="material-symbols-outlined text-[16px] cursor-pointer flex-shrink-0 transition-opacity ${e.fijado===1?`text-amber-500 opacity-100`:`text-slate-300 opacity-0 group-hover:opacity-100`}" 
                            title="${e.fijado===1?`Desfijar`:`Fijar`}">
                        push_pin
                      </span>
                    </div>
                    <span class="px-2 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase border whitespace-nowrap ${t.cls}">${t.label}</span>
                  </div>
                  <p class="text-[10px] uppercase font-bold text-on-surface-variant mb-1">${e.marca||`-`}</p>
                  <p class="font-mono text-xs font-bold mb-2 truncate ${e.sku?`text-primary`:`text-on-surface-variant/70`}" title="${e.sku||e.id}">${e.sku?`Ref: ${e.sku}`:e.id}</p>
                </div>
              </div>
              <div class="flex items-end justify-between mt-auto pt-3 border-t border-surface-variant/50">
                ${o?`<div></div>`:`<div>
                  <p class="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/60 mb-0.5">Precio Venta</p>
                  <p class="font-black text-primary text-lg leading-none">$${r}</p>
                </div>`}
                <div class="flex gap-1.5">
                  ${a?`<button onclick="event.stopPropagation(); inventoryView.openEdit('${e.id}')" class="p-2 bg-surface border border-surface-variant rounded-xl text-primary hover:bg-primary/10 transition-colors" title="Editar">
                    <span class="material-symbols-outlined text-[18px]">edit</span>
                  </button>`:``}
                  ${a?`<button onclick="event.stopPropagation(); inventoryView.deleteProduct('${e.id}')" class="p-2 bg-surface border border-surface-variant rounded-xl text-error hover:bg-error/10 transition-colors" title="Eliminar">
                    <span class="material-symbols-outlined text-[18px]">delete</span>
                  </button>`:``}
                </div>
              </div>
            </div>
          `}).join(``):`<div class="col-span-full text-center py-20 text-on-surface-variant">
           <span class="material-symbols-outlined text-5xl">search_off</span>
           <p class="mt-2 font-semibold">No hay productos que coincidan.</p>
         </div>`):(e.classList.add(`hidden`),t.classList.remove(`hidden`),n.innerHTML=I.length?I.map(e=>{let t=Tn(e.stockActual,e.stockMinimo),n=Number(e.stockActual)===0,r=Number(String(e.precioVenta).replace(/\D/g,``)).toLocaleString(`es-CO`),i=Number(String(e.costo||0).replace(/\D/g,``)).toLocaleString(`es-CO`);return`
            <tr onclick="inventoryView.openDetail('${e.id}')" class="hover:bg-surface-container-low transition-colors cursor-pointer group ${n?`opacity-70`:``}">
              <td class="px-4 py-3">
                ${e.imagen?`<img src="${e.imagen}" class="w-8 h-8 rounded object-cover">`:`<div class="w-8 h-8 rounded bg-surface-container flex items-center justify-center"><span class="material-symbols-outlined text-[16px] text-on-surface-variant/50">inventory_2</span></div>`}
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-1.5 min-w-0">
                  <span onclick="event.stopPropagation(); window.inventoryView.togglePin('${e.id}', ${+!e.fijado})" 
                        class="material-symbols-outlined text-[16px] cursor-pointer flex-shrink-0 transition-opacity ${e.fijado===1?`text-amber-500 opacity-100`:`text-slate-300 opacity-0 group-hover:opacity-100`}" 
                        title="${e.fijado===1?`Desfijar`:`Fijar`}">
                    push_pin
                  </span>
                  <div>
                    <p class="font-bold text-sm text-on-surface">${e.nombre}</p>
                    <p class="text-[10px] text-on-surface-variant">${e.marca||`-`}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 font-mono text-xs font-bold ${e.sku?`text-primary`:`text-on-surface-variant`}">${e.sku?`<span class="px-2 py-0.5 rounded bg-primary/10 border border-primary/20">Ref: ${e.sku}</span>`:e.id}</td>
              <td class="px-4 py-3 text-xs text-on-surface-variant">${e.categoria}</td>
              <td class="px-4 py-3">
                <span class="px-2 py-1 rounded text-[10px] font-bold tracking-wider uppercase border ${t.cls}">${t.label}</span>
              </td>
              <td class="px-4 py-3 text-xs text-on-surface-variant">${o?`N/A`:`$${i}`}</td>
              <td class="px-4 py-3 font-bold text-primary">${o?`N/A`:`$${r}`}</td>
              <td class="px-4 py-3 text-xs text-on-surface-variant">${e.ubicacion||`—`}</td>
              <td class="px-4 py-3 text-right">
                ${a?`<button onclick="event.stopPropagation(); inventoryView.openEdit('${e.id}')" class="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Editar">
                  <span class="material-symbols-outlined text-[18px]">edit</span>
                </button>`:``}
                ${a?`<button onclick="event.stopPropagation(); inventoryView.deleteProduct('${e.id}')" class="p-1.5 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-lg transition-colors" title="Eliminar">
                  <span class="material-symbols-outlined text-[18px]">delete</span>
                </button>`:``}
              </td>
            </tr>
          `}).join(``):`<tr><td colspan="6" class="text-center py-10 text-on-surface-variant">No hay productos</td></tr>`);let s=document.getElementById(`inv-stat-total`),c=document.getElementById(`inv-stat-alert`);s&&(s.textContent=F.length.toLocaleString()),c&&(c.textContent=F.filter(e=>Number(e.stockActual)<=Number(e.stockMinimo)).length)}function Dn(){let e=(document.getElementById(`inv-search`)?.value||``).toLowerCase(),t=document.getElementById(`inv-filter-cat`)?.value||``,n=document.getElementById(`inv-filter-tipo`)?.value||``;I=F.filter(r=>(!e||[r.nombre,r.marca,r.sku,r.id].some(t=>String(t).toLowerCase().includes(e)))&&(!t||r.categoria===t)&&(!n||(r.tipo||``)===n)),En()}function On(e){document.getElementById(`inv-modal-title`).textContent=e,document.getElementById(`inv-modal`).classList.remove(`hidden`),document.getElementById(`inv-modal`).classList.add(`flex`)}function kn(){let e=document.getElementById(`inv-categoria`),t=document.getElementById(`inv-specs-container`);if(!e||!t)return;let n=(e.value||``).trim().toLowerCase();n===``||n===`celular`||n===`celulares`||n===`telefono`||n===`teléfono`||n===`telefonos`||n===`teléfonos`||n===`movil`||n===`móvil`||n===`moviles`||n===`móviles`?t.classList.remove(`hidden`):t.classList.add(`hidden`)}function An(){document.getElementById(`inv-modal`).classList.add(`hidden`),document.getElementById(`inv-modal`).classList.remove(`flex`),Cn=null,window.__posReventaMode=!1,document.getElementById(`inv-form`).reset(),document.getElementById(`inv-img-preview`).innerHTML=`<span class="material-symbols-outlined text-3xl text-on-surface-variant/40">add_photo_alternate</span>`;let e=document.getElementById(`inv-ai-copy-section`);e&&(e.classList.add(`hidden`),document.getElementById(`inv-ai-desc`).value=``,document.getElementById(`inv-ai-ad`).value=``);let t=document.getElementById(`inv-remove-img-btn`);t&&t.classList.add(`hidden`),L=[],Ln(),kn()}window.inventoryRemovePhoto=()=>{let e=document.getElementById(`inv-existing-img`);e&&(e.value=``);let t=document.getElementById(`inv-img-file`);t&&(t.value=``);let n=document.getElementById(`inv-img-preview`);n&&(n.innerHTML=`<span class="material-symbols-outlined text-3xl text-on-surface-variant/40">add_photo_alternate</span>`);let r=document.getElementById(`inv-remove-img-btn`);r&&r.classList.add(`hidden`),A(`Foto removida. Presiona Guardar para aplicar el cambio.`,`info`)};async function jn(e){let t=e.target.files&&e.target.files[0];if(!t)return;let n=new FileReader;n.onload=async e=>{let t=e.target.result,n=await Sn(t,800,800,.8),r=document.getElementById(`inv-img-preview`);r&&(r.innerHTML=`<img src="${n}" class="w-full h-full object-cover">`);let i=document.getElementById(`inv-existing-img`);i&&(i.value=n);let a=document.getElementById(`inv-remove-img-btn`);a&&a.classList.remove(`hidden`)},n.readAsDataURL(t)}async function Mn(){let e=document.getElementById(`inv-save-btn`);e.disabled=!0,e.innerHTML=`<span class="material-symbols-outlined animate-spin text-[18px]">progress_activity</span> Guardando...`;try{let t=document.getElementById(`inv-existing-img`)?.value||``,n=(document.getElementById(`inv-img-file`)||document.getElementById(`inv-img-file-camera`)||document.getElementById(`inv-img-file-gallery`))?.files?.[0];if(n){e.innerHTML=`<span class="material-symbols-outlined animate-spin text-[18px]">progress_activity</span> Procesando foto...`;try{let e=new FileReader;t=await Sn(await new Promise((t,r)=>{e.onload=e=>t(e.target.result),e.onerror=()=>r(Error(`No se pudo leer el archivo de imagen`)),e.readAsDataURL(n)}),800,800,.8)}catch(e){console.warn(`Fallo al leer archivo de imagen:`,e),t||=document.getElementById(`inv-existing-img`)?.value||``}}let r=document.getElementById(`inv-nombre`).value.trim(),i=document.getElementById(`inv-categoria`).value.trim(),a=document.getElementById(`inv-ram`)?document.getElementById(`inv-ram`).value.trim():``,o=document.getElementById(`inv-memoria`)?document.getElementById(`inv-memoria`).value.trim():``,s=document.getElementById(`inv-color`)?document.getElementById(`inv-color`).value.trim():``,c=r,l=i.toLowerCase();if((l===`celular`||l===`celulares`)&&(a||o||s)){let e=[];a&&e.push(a.toUpperCase().includes(`RAM`)?a:`${a} RAM`),o&&e.push(o),s&&e.push(s),e.length>0&&(c=`${r} (${e.join(` / `)})`)}let u=[document.getElementById(`inv-id`).value,c,document.getElementById(`inv-marca`).value,i,document.getElementById(`inv-tipo`).value,Number(document.getElementById(`inv-costo`).value.replace(/\D/g,``))||0,Number(document.getElementById(`inv-venta`).value.replace(/\D/g,``))||0,Number(document.getElementById(`inv-stock-min`).value)||0,Number(document.getElementById(`inv-stock-act`).value)||0,document.getElementById(`inv-ubicacion`).value,document.getElementById(`inv-sku`).value,t,+!!document.getElementById(`inv-fijado`).checked],d;d=Cn?await jt(Cn,u):await At(u);let f=d&&d.success!==!1;if(A(d?.mensaje||(f?`Guardado correctamente`:`Error al guardar`),f?`success`:`error`),f){if(window.__posReventaMode&&!Cn){let e={id:u[0],nombre:u[1],marca:u[2],categoria:u[3],costo:u[5],precioVenta:u[6]};typeof window.__posAddReventaToCart==`function`&&window.__posAddReventaToCart(e),window.__posReventaMode=!1}An(),typeof window.__onProductCreated==`function`&&!Cn&&window.__onProductCreated({id:u[0],nombre:u[1],marca:u[2],categoria:u[3],costo:u[5],precioVenta:u[6]}),await Pn()}}catch(e){console.error(`Error en saveProduct:`,e),A(`Error: `+(e&&e.message?e.message:typeof e==`string`?e:`Ocurrió un error al guardar`),`error`)}finally{e.disabled=!1,e.innerHTML=`<span class="material-symbols-outlined text-[18px]">save</span> Guardar`}}var Nn=null;window.inventoryView={openDetail(e){let t=String(e||``).trim(),n=F.find(e=>String(e.id||``).trim()===t||String(e.sku||``).trim()===t);if(!n){A(`Producto no encontrado`,`error`);return}Nn=n.id;let r=e=>Number(String(e||0).replace(/\D/g,``)||0).toLocaleString(`es-CO`),i=JSON.parse(localStorage.getItem(`adminpro_user`)||`{}`),a=String(i.rol||``).trim().toLowerCase(),o=a===`técnico de reparación`||a===`tecnico`,s=!a||a===`administrador`||a.includes(`admin`);document.getElementById(`inv-d-nombre`).textContent=n.nombre||`—`,document.getElementById(`inv-d-marca`).textContent=n.marca||`—`,document.getElementById(`inv-d-cat`).textContent=n.categoria||`—`,document.getElementById(`inv-d-costo`).textContent=o?`N/A`:`$${r(n.costo)}`,document.getElementById(`inv-d-venta`).textContent=o?`N/A`:`$${r(n.precioVenta)}`,document.getElementById(`inv-d-stock`).textContent=n.stockActual??`—`,document.getElementById(`inv-d-stockmin`).textContent=n.stockMinimo??`—`,document.getElementById(`inv-d-tipo`).textContent=n.tipo||`—`,document.getElementById(`inv-d-ubicacion`).textContent=n.ubicacion||`—`,document.getElementById(`inv-d-sku`).textContent=n.sku||n.id||`—`;let c=document.getElementById(`inv-detail-img-wrap`),l=document.getElementById(`inv-detail-img`);n.imagen?(l.src=n.imagen,c.classList.remove(`hidden`)):c.classList.add(`hidden`);let u=document.getElementById(`inv-detail-edit-btn`);u&&(s?u.classList.remove(`hidden`):u.classList.add(`hidden`));let d=document.getElementById(`inv-detail-equipos-wrap`),f=document.getElementById(`inv-detail-equipos-list`),p=document.getElementById(`inv-detail-equipos-count`),m=document.getElementById(`inv-detail-add-imei-btn`);d&&f&&Pt().then(e=>{let t=(e||[]).filter(e=>e.id_producto&&e.id_producto===n.id||e.nombre&&n.nombre&&e.nombre.toLowerCase().trim()===n.nombre.toLowerCase().trim()||n.nombre&&e.nombre&&n.nombre.toLowerCase().includes(e.nombre.toLowerCase().trim())),i=(n.categoria||``).toLowerCase().includes(`celular`)||(n.nombre||``).toLowerCase().includes(`celular`);if(t.length>0||i){d.classList.remove(`hidden`);let e=t.filter(e=>(e.estado||``).toLowerCase()===`disponible`).length;p&&(p.textContent=`${e} disponible${e===1?``:`s`} / ${t.length} total`),t.length===0?f.innerHTML=`<p class="text-xs italic text-on-surface-variant/60 py-2 text-center bg-surface-container-low rounded-lg">No hay IMEIs registrados para este modelo todavía.</p>`:f.innerHTML=t.map(e=>{let t=(e.estado||``).toLowerCase()===`disponible`,i=[];e.memoria&&i.push(`<span class="px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 font-bold">${e.memoria}</span>`),e.ram&&i.push(`<span class="px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300">${e.ram} RAM</span>`),e.color&&i.push(`<span class="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">${e.color}</span>`),e.condicion&&e.condicion!==`Nuevo`&&i.push(`<span class="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">${e.condicion}</span>`);let a=e.venta?`$${r(e.venta)}`:`$${r(n.precioVenta)}`,s=e.costo?`$${r(e.costo)}`:`$${r(n.costo)}`;return`
                <div class="p-2.5 bg-surface-container-low border border-surface-variant rounded-xl flex items-center justify-between gap-2">
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-1.5 mb-1 flex-wrap">
                      <span class="font-mono text-xs font-bold text-on-surface">${e.imei1}</span>
                      ${i.join(` `)}
                    </div>
                    <div class="flex items-center gap-3 text-[10px] text-on-surface-variant flex-wrap">
                      <span>Público: <b class="text-primary">${a}</b></span>
                      ${e.precio_revendedor&&Number(e.precio_revendedor)>0?`<span class="text-amber-600 dark:text-amber-400 font-medium">Revendedor: <b class="font-black">$${r(e.precio_revendedor)}</b></span>`:``}
                      ${o?``:`<span>Costo: <b>${s}</b></span>`}
                      ${e.imei2?`<span class="font-mono text-[9px] opacity-75">SIM2: ${e.imei2}</span>`:``}
                    </div>
                  </div>
                  <span class="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold ${t?`bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300`:`bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400`}">
                    ${e.estado||`Disponible`}
                  </span>
                </div>
              `}).join(``)}else d.classList.add(`hidden`)}).catch(()=>{d.classList.add(`hidden`)}),m&&(m.onclick=()=>{let e=document.getElementById(`inv-detail-modal`);e&&(e.classList.add(`hidden`),e.classList.remove(`flex`)),window.navigate&&window.navigate(`imei`),setTimeout(()=>{let e=document.getElementById(`imei-add-btn`);e&&e.click();let t=document.getElementById(`imei-nombre`);t&&(t.value=n.nombre||``,t.setAttribute(`data-id`,n.id||``));let r=document.getElementById(`imei-marca`);r&&(r.value=n.marca||``)},150)});let h=document.getElementById(`inv-detail-modal`);h&&(h.classList.remove(`hidden`),h.classList.add(`flex`))},openEdit(e){try{let t=String(e||``).trim(),n=F.find(e=>String(e.id||``).trim()===t||String(e.sku||``).trim()===t);if(!n){A(`Producto no encontrado`,`error`);return}Cn=n.id,L=[],Ln();let r=document.getElementById(`inv-detail-modal`);r&&(r.classList.add(`hidden`),r.classList.remove(`flex`));let i=n.nombre||``,a=``,o=``,s=``,c=(n.categoria||``).trim().toLowerCase();if(c===`celular`||c===`celulares`){let e=/\(([^/)]+)(?:\s*\/\s*([^/)]+))?(?:\s*\/\s*([^/)]+))?\)$/,t=i.match(e);if(t){i=i.replace(e,``).trim();let n=[t[1],t[2],t[3]].filter(Boolean).map(e=>e.trim());n.length===3?(a=n[0],o=n[1],s=n[2]):n.length===2?n[0].toLowerCase().includes(`ram`)?(a=n[0],o=n[1]):n[1].toLowerCase().includes(`ram`)?(a=n[1],o=n[0]):(o=n[0],s=n[1]):n.length===1&&(n[0].toLowerCase().includes(`ram`)?a=n[0]:/\b\d+\s*(?:GB|TB)\b/i.test(n[0])?o=n[0]:s=n[0])}}a&&=a.replace(/\s*RAM\b/gi,``).trim();let l=document.getElementById(`inv-id`);l&&(l.value=n.id);let u=document.getElementById(`inv-nombre`);u&&(u.value=i);let d=document.getElementById(`inv-ram`);d&&(d.value=a);let f=document.getElementById(`inv-memoria`);f&&(f.value=o);let p=document.getElementById(`inv-color`);p&&(p.value=s);let m=document.getElementById(`inv-marca`);m&&(m.value=n.marca||``);let h=document.getElementById(`inv-categoria`);h&&(h.value=n.categoria||``);let g=document.getElementById(`inv-tipo`);g&&(g.value=n.tipo||`Físico`),window.syncCustomSelectUI&&window.syncCustomSelectUI(`inv-tipo-container`,n.tipo||`Físico`);let _=document.getElementById(`inv-costo`);_&&(_.value=n.costo||n.costo===0?new Intl.NumberFormat(`es-CO`).format(n.costo):``);let v=document.getElementById(`inv-venta`);v&&(v.value=n.precioVenta||n.precioVenta===0?new Intl.NumberFormat(`es-CO`).format(n.precioVenta):``);let y=document.getElementById(`inv-stock-min`);y&&(y.value=n.stockMinimo??``);let b=document.getElementById(`inv-stock-act`);b&&(b.value=n.stockActual??``);let x=document.getElementById(`inv-ubicacion`);x&&(x.value=n.ubicacion||``);let S=document.getElementById(`inv-sku`);S&&(S.value=n.sku||``);let C=document.getElementById(`inv-existing-img`);C&&(C.value=n.imagen||``);let ee=document.getElementById(`inv-img-preview`),w=document.getElementById(`inv-remove-img-btn`);ee&&(n.imagen?(ee.innerHTML=`<img src="${n.imagen}" class="w-full h-full object-cover">`,w&&w.classList.remove(`hidden`)):(ee.innerHTML=`<span class="material-symbols-outlined text-3xl text-on-surface-variant/40">add_photo_alternate</span>`,w&&w.classList.add(`hidden`)));let te=document.getElementById(`inv-fijado`);te&&(te.checked=n.fijado===1||n.fijado===!0);let ne=document.getElementById(`inv-img-file`);ne&&(ne.value=``);let T=document.getElementById(`inv-img-file-camera`),re=document.getElementById(`inv-img-file-gallery`);T&&(T.value=``),re&&(re.value=``);let ie=document.getElementById(`inv-label-file-camera`),ae=document.getElementById(`inv-label-file-gallery`);ie&&(ie.value=``),ae&&(ae.value=``),On(`Editar Producto`),kn()}catch(e){console.error(`Error en openEdit:`,e),A(`Error al abrir edición: `+e.message,`error`)}},async deleteProduct(e){if(await j(`Confirmación`,`¿Eliminar este producto?`))try{let t=await Nt(e);A(t.mensaje||`Eliminado`,t.success?`success`:`error`),t.success&&await Pn()}catch(e){A(`Error: `+e.message,`error`)}},openNuevo(e=!1,t=``){Cn=null,L=[],Ln(),document.getElementById(`inv-form`)?.reset(),document.getElementById(`inv-tipo`).value=e?`Reventa`:`Físico`,window.syncCustomSelectUI&&window.syncCustomSelectUI(`inv-tipo-container`,e?`Reventa`:`Físico`),document.getElementById(`inv-existing-img`).value=``,document.getElementById(`inv-img-preview`).innerHTML=`<span class="material-symbols-outlined text-3xl text-on-surface-variant/40">add_photo_alternate</span>`;let n=document.getElementById(`inv-remove-img-btn`);n&&n.classList.add(`hidden`),t&&(document.getElementById(`inv-categoria`).value=t),e&&(document.getElementById(`inv-id`).value=`REV-`+Date.now().toString().slice(-6)),document.getElementById(`inv-fijado`).checked=!1;let r=document.getElementById(`inv-img-file`);r&&(r.value=``);let i=document.getElementById(`inv-img-file-camera`),a=document.getElementById(`inv-img-file-gallery`);i&&(i.value=``),a&&(a.value=``);let o=document.getElementById(`inv-label-file-camera`),s=document.getElementById(`inv-label-file-gallery`);o&&(o.value=``),s&&(s.value=``),On(e?`Nueva Reventa`:`Nuevo Producto`),kn()},async togglePin(e,t){try{await Mt(e,t),A(t?`📍 Producto fijado al inicio`:`📍 Producto desfijado`,`success`),await Pn()}catch(e){A(`Error al fijar producto: `+e.message,`error`)}}};async function Pn(){let e=document.getElementById(`inv-grid`);e&&(e.innerHTML=`<div class="col-span-full flex justify-center py-20">
    <span class="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span></div>`);try{let e=JSON.parse(localStorage.getItem(`adminpro_user`)||`{}`),t=String(e.rol||``).trim().toLowerCase(),n=t===`técnico de reparación`||t===`tecnico`,r=await P();F=n?r.filter(e=>e.categoria&&e.categoria.toLowerCase().includes(`repuesto`)):r,I=[...F],En(),Fn()}catch(t){e&&(e.innerHTML=`<div class="col-span-full text-center py-20 text-error font-semibold">
      <span class="material-symbols-outlined text-4xl">wifi_off</span>
      <p class="mt-2">Error al cargar: ${t.message}</p></div>`)}}function Fn(){let e=[...new Set(F.map(e=>e.categoria).filter(Boolean))];if(window.buildCustomSelectOptions){let t=[{value:``,label:`Todas las categorías`,icon:`category`},...e.map(e=>({value:e,label:e,icon:`label`}))];window.buildCustomSelectOptions(`inv-filter-cat-container`,`inv-filter-cat`,t,`Todas las categorías`,Dn)}let t=document.getElementById(`datalist-categorias`);t&&(t.innerHTML=e.map(e=>`<option value="${e}">`).join(``));let n=document.getElementById(`datalist-marcas`);n&&(n.innerHTML=[...new Set(F.map(e=>e.marca).filter(Boolean))].map(e=>`<option value="${e}">`).join(``))}function In(e){let t=e.target.value.replace(/\D/g,``);if(!t){e.target.value=``;return}e.target.value=new Intl.NumberFormat(`es-CO`).format(parseInt(t,10))}function Ln(){let e=document.getElementById(`inv-label-thumbnails`),t=document.getElementById(`inv-ai-process-btn`);if(!(!e||!t)){if(L.length===0){e.innerHTML=``,e.classList.add(`hidden`),t.disabled=!0,t.classList.add(`bg-slate-100`,`text-slate-400`,`cursor-not-allowed`),t.classList.remove(`bg-primary`,`text-white`,`hover:bg-primary/95`,`shadow-lg`,`shadow-primary/25`,`cursor-pointer`),t.innerHTML=`<span class="material-symbols-outlined text-[16px]">psychology</span> Procesar IA`;return}e.innerHTML=L.map((e,t)=>`
    <div class="relative w-full aspect-square rounded-xl overflow-hidden border border-slate-200 group bg-slate-50 flex items-center justify-center">
      <img src="${e.base64}" class="w-full h-full object-cover">
      <button type="button" onclick="window.inventoryRemoveScanImage(${t})" 
        class="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md hover:bg-red-600 transition-colors z-20" title="Eliminar">
        <span class="material-symbols-outlined text-[12px] font-bold">close</span>
      </button>
      <button type="button" onclick="window.inventorySetAsProductPhoto(${t})" 
        class="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-primary text-white flex items-center gap-0.5 shadow-md hover:bg-primary/90 transition-colors text-[9px] font-black z-20" title="Usar como foto oficial del producto">
        <span class="material-symbols-outlined text-[10px]">photo_camera</span> Usar
      </button>
    </div>
  `).join(``),e.classList.remove(`hidden`),t.disabled=!1,t.classList.remove(`bg-slate-100`,`text-slate-400`,`cursor-not-allowed`),t.classList.add(`bg-primary`,`text-white`,`hover:bg-primary/95`,`shadow-lg`,`shadow-primary/25`,`cursor-pointer`),t.innerHTML=`<span class="material-symbols-outlined text-[16px]">psychology</span> Analizar (${L.length} fotos)`}}window.inventoryRemoveScanImage=e=>{L.splice(e,1),Ln()},window.inventorySetAsProductPhoto=async e=>{console.log(`[inventorySetAsProductPhoto] Invocado con index:`,e);let t=L[e];if(!t){console.warn(`[inventorySetAsProductPhoto] No se encontró la imagen en index:`,e),A(`No se pudo encontrar la imagen seleccionada`,`warning`);return}try{A(`Subiendo foto seleccionada a Google Drive...`,`info`),console.log(`[inventorySetAsProductPhoto] Subiendo a Drive:`,t.name,`tipo:`,t.type,`tamaño base64:`,t.base64?t.base64.length:0);let e=await ft(t.base64,t.name,t.type);console.log(`[inventorySetAsProductPhoto] Respuesta URL recibida:`,e),e?(document.getElementById(`inv-existing-img`).value=e,document.getElementById(`inv-img-preview`).innerHTML=`<img src="${e}" class="w-full h-full object-cover">`,A(`Foto asignada correctamente como imagen del producto 📸`,`success`)):(console.error(`[inventorySetAsProductPhoto] URL de imagen vacía`),A(`No se pudo obtener la URL de la imagen subida`,`error`))}catch(e){console.error(`[inventorySetAsProductPhoto] Error al asignar foto:`,e),A(`Error al subir imagen a Google Drive: `+e.message,`error`)}};function Rn(){window.viewReloaders=window.viewReloaders||{},window.viewReloaders.inventory=async()=>{await Pn()},document.addEventListener(`barcodeScanned`,e=>{let t=document.querySelector(`[data-view="inventory"]`);if(!t||t.classList.contains(`hidden`))return;let n=e.detail,r=document.getElementById(`inv-modal`);if(r&&!r.classList.contains(`hidden`)){let e=document.getElementById(`inv-sku`);e&&(e.value=n,A(`SKU ingresado: ${n}`,`success`));return}let i=document.getElementById(`inv-search`);i&&(i.value=n,Dn(),I.length===1?(inventoryView.openDetail(I[0].id),A(`Producto encontrado`,`success`)):I.length===0&&A(`No se encontró el producto`,`warning`))}),document.getElementById(`inv-search`)?.addEventListener(`input`,Dn),document.getElementById(`inv-search-scan-btn`)?.addEventListener(`click`,()=>{Ue({title:`Escanear Producto / SKU`,onScan:e=>{let t=document.getElementById(`inv-search`);t&&(t.value=e,Dn(),A(`Buscando SKU: ${e}`,`info`),I.length===1?(inventoryView.openDetail(I[0].id),A(`Producto encontrado`,`success`)):I.length===0&&A(`No se encontró el producto en inventario`,`warning`))}})}),window.setupCustomSelect&&(window.setupCustomSelect(`inv-filter-tipo-container`,`inv-filter-tipo`,Dn),window.setupCustomSelect(`inv-tipo-container`,`inv-tipo`));let e=document.getElementById(`inv-categoria`);e?.addEventListener(`input`,kn),e?.addEventListener(`change`,kn),document.getElementById(`inv-view-toggle`)?.addEventListener(`click`,()=>{wn=wn===`grid`?`table`:`grid`;let e=document.getElementById(`inv-view-toggle`).querySelector(`span`);e.textContent=wn===`grid`?`view_list`:`grid_view`,En()}),document.getElementById(`inv-auto-id-btn`)?.addEventListener(`click`,()=>{document.getElementById(`inv-id`).value=`PROD-`+Date.now().toString().slice(-6)}),document.getElementById(`inv-new-btn`)?.addEventListener(`click`,()=>{window.inventoryView&&window.inventoryView.openNuevo&&window.inventoryView.openNuevo(!1)});let t=()=>{zn()};document.getElementById(`inv-pdf-btn`)?.addEventListener(`click`,t),document.getElementById(`inv-pdf-btn-desktop`)?.addEventListener(`click`,t),document.getElementById(`inv-costo`)?.addEventListener(`input`,In),document.getElementById(`inv-venta`)?.addEventListener(`input`,In),document.getElementById(`inv-modal-close`)?.addEventListener(`click`,An),document.getElementById(`inv-modal-backdrop`)?.addEventListener(`click`,An),document.getElementById(`inv-img-file`)?.addEventListener(`change`,jn),document.getElementById(`inv-img-file-camera`)?.addEventListener(`change`,jn),document.getElementById(`inv-img-file-gallery`)?.addEventListener(`change`,jn);async function n(e){let t=e.target.files;if(!(!t||t.length===0)){A(`Cargando y comprimiendo ${t.length} foto(s)...`,`info`);for(let e=0;e<t.length;e++){let n=t[e];try{let e=new FileReader,t=await Sn(await new Promise((t,r)=>{e.onload=e=>t(e.target.result),e.onerror=e=>r(e),e.readAsDataURL(n)}),1024,1024,.75);L.push({name:n.name,type:`image/jpeg`,base64:t})}catch(e){console.error(`Error al comprimir/leer archivo:`,e)}}Ln(),e.target.value=``}}document.getElementById(`inv-label-file-camera`)?.addEventListener(`change`,n),document.getElementById(`inv-label-file-gallery`)?.addEventListener(`change`,n),document.getElementById(`inv-ai-process-btn`)?.addEventListener(`click`,async()=>{if(L.length===0)return;let e=document.getElementById(`inv-ai-process-btn`),t=e.innerHTML;e.disabled=!0,e.innerHTML=`<span class="material-symbols-outlined animate-spin text-[16px]">progress_activity</span> Analizando...`,document.getElementById(`inv-label-card`).classList.add(`pointer-events-none`,`opacity-50`);try{try{A(`Procesando imágenes con IA...`,`info`);let e=await gt(L);if(console.log(`[AI Multi-Label Analysis Result]:`,e),!e.success)throw Error(e.mensaje||`Error en OpenRouter`);let t=e.data;if(t.name&&(document.getElementById(`inv-nombre`).value=t.name),t.brand&&(document.getElementById(`inv-marca`).value=t.brand),t.sku&&(document.getElementById(`inv-sku`).value=t.sku),t.cost){let e=parseInt(String(t.cost).replace(/\D/g,``),10);e&&(document.getElementById(`inv-costo`).value=new Intl.NumberFormat(`es-CO`).format(e))}if(t.price){let e=parseInt(String(t.price).replace(/\D/g,``),10);e&&(document.getElementById(`inv-venta`).value=new Intl.NumberFormat(`es-CO`).format(e))}if(t.ram&&(document.getElementById(`inv-ram`).value=t.ram.replace(/\s*RAM\b/gi,``).trim()),t.memoria&&(document.getElementById(`inv-memoria`).value=t.memoria),t.color&&(document.getElementById(`inv-color`).value=t.color),t.category?document.getElementById(`inv-categoria`).value=t.category:(t.ram||t.memoria)&&(document.getElementById(`inv-categoria`).value=`Celulares`),document.getElementById(`inv-tipo`).value=`Físico`,window.syncCustomSelectUI&&window.syncCustomSelectUI(`inv-tipo-container`,`Físico`),L.length>0)try{console.log(`[AI Auto-Photo] parsed.bestPhotoIndex devuelto por Gemini:`,t.bestPhotoIndex);let e=0;if(t.bestPhotoIndex!==void 0&&t.bestPhotoIndex!==null){let n=parseInt(t.bestPhotoIndex,10);!isNaN(n)&&n>=0&&n<L.length?e=n:console.log(`[AI Auto-Photo] Índice inválido o fuera de rango, se usará el por defecto 0`)}console.log(`[AI Auto-Photo] Seleccionando foto en índice:`,e),A(`Auto-asignando la mejor foto del producto...`,`info`),await window.inventorySetAsProductPhoto(e)}catch(e){console.error(`[AI Auto-Photo] Error al asignar foto automáticamente:`,e),A(`Error al asignar foto automáticamente: `+e.message,`error`)}let n=document.getElementById(`inv-ai-copy-section`);n&&(document.getElementById(`inv-ai-desc`).value=t.description||`No se generó ficha técnica.`,document.getElementById(`inv-ai-ad`).value=t.adCopy||`No se generó copia publicitaria.`,n.classList.remove(`hidden`)),kn(),document.getElementById(`inv-id`).value||(document.getElementById(`inv-id`).value=`PROD-`+Date.now().toString().slice(-6)),A(`Análisis multifoto completado con éxito ✨`,`success`)}catch(e){console.error(`AI Analysis Error:`,e),A(`La IA no pudo procesar los datos: `+e.message,`warning`)}}catch(e){console.error(`Multi-Scan Error:`,e),A(`Error general: `+e.message,`error`)}finally{e.disabled=!1,e.innerHTML=t,document.getElementById(`inv-label-card`).classList.remove(`pointer-events-none`,`opacity-50`)}}),document.getElementById(`inv-save-btn`)?.addEventListener(`click`,Mn),document.getElementById(`inv-scan-sku`)?.addEventListener(`click`,()=>{Ue({title:`Escanear SKU / Barcode`,onScan:e=>{document.getElementById(`inv-sku`).value=e,A(`SKU Detectado: ${e}`,`success`)}})});let r=null,i=document.getElementById(`inv-quick-input-modal`),a=document.getElementById(`inv-qi-title`),o=document.getElementById(`inv-qi-input`),s=document.getElementById(`inv-qi-save`),c=document.getElementById(`inv-qi-cancel`),l=document.getElementById(`inv-qi-backdrop`);function u(e){r=e,a.textContent=e===`marca`?`Nueva Marca`:`Nueva Categoría`,o.value=``,i.classList.remove(`hidden`),i.classList.add(`flex`),setTimeout(()=>o.focus(),50)}function d(){i.classList.add(`hidden`),i.classList.remove(`flex`)}c.addEventListener(`click`,d),l.addEventListener(`click`,d),o.addEventListener(`keydown`,e=>{e.key===`Enter`&&s.click()}),s.addEventListener(`click`,()=>{let e=o.value.trim();if(e){if(r===`marca`){let t=document.getElementById(`datalist-marcas`);if(![...t.options].some(t=>t.value.toLowerCase()===e.toLowerCase())){let n=document.createElement(`option`);n.value=e,t.appendChild(n)}document.getElementById(`inv-marca`).value=e,A(`Marca "${e}" agregada`,`success`)}else{let t=document.getElementById(`datalist-categorias`),n=document.getElementById(`inv-filter-cat`);if(![...t.options].some(t=>t.value.toLowerCase()===e.toLowerCase())){let r=document.createElement(`option`);if(r.value=e,t.appendChild(r),n){let t=document.createElement(`option`);t.value=e,t.textContent=e,n.appendChild(t)}}document.getElementById(`inv-categoria`).value=e,A(`Categoría "${e}" agregada`,`success`)}d()}}),document.getElementById(`inv-add-marca-btn`)?.addEventListener(`click`,()=>u(`marca`)),document.getElementById(`inv-add-cat-btn`)?.addEventListener(`click`,()=>u(`cat`));let f=()=>{let e=document.getElementById(`inv-detail-modal`);e.classList.add(`hidden`),e.classList.remove(`flex`)};return document.getElementById(`inv-detail-close`)?.addEventListener(`click`,f),document.getElementById(`inv-detail-close2`)?.addEventListener(`click`,f),document.getElementById(`inv-detail-backdrop`)?.addEventListener(`click`,f),document.getElementById(`inv-detail-edit-btn`)?.addEventListener(`click`,()=>{Nn&&inventoryView.openEdit(Nn)}),document.getElementById(`inv-btn-copy-desc`)?.addEventListener(`click`,()=>{let e=document.getElementById(`inv-ai-desc`).value;e&&(navigator.clipboard.writeText(e),A(`Ficha técnica copiada al portapapeles 📋`,`success`))}),document.getElementById(`inv-btn-copy-ad`)?.addEventListener(`click`,()=>{let e=document.getElementById(`inv-ai-ad`).value;e&&(navigator.clipboard.writeText(e),A(`Copia publicitaria copiada al portapapeles 📋`,`success`))}),Pn}async function zn(){let e=document.getElementById(`inv-pdf-btn`),t=document.getElementById(`inv-pdf-btn-desktop`),n=n=>{e&&(e.disabled=n,e.innerHTML=n?`<span class="material-symbols-outlined animate-spin text-[16px]">progress_activity</span><span>PDF</span>`:`<span class="material-symbols-outlined text-[18px]">picture_as_pdf</span><span>PDF</span>`),t&&(t.disabled=n,t.innerHTML=n?`<span class="material-symbols-outlined animate-spin text-[18px]">progress_activity</span><span>Cargando...</span>`:`<span class="material-symbols-outlined text-[18px]">picture_as_pdf</span><span>Generar Catálogo PDF</span>`)};n(!0);try{let e=await un().catch(()=>null)||{},t=e.nombre||`ADMINPRO`,r=e.telefono||``,i=e.logo||``,a=e.direccion||``,o=e.ciudad||``,s={};F.forEach(e=>{if(Number(e.stockActual||0)>0&&Number(e.precioVenta||0)>0){let t=e.categoria||`Otros`;s[t]=(s[t]||0)+1}});let c=Object.keys(s).sort();if(c.length===0){A(`No hay productos con stock en el inventario para generar el catálogo`,`warning`),n(!1);return}let l=`inv-catalog-options-modal`,u=document.getElementById(l);u&&u.remove(),u=document.createElement(`div`),u.id=l,u.className=`fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm`,u.innerHTML=`
      <div class="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 flex flex-col max-h-[90vh]">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-indigo-600 text-[22px]">picture_as_pdf</span>
            <h3 class="text-base font-black text-slate-800 dark:text-slate-100">Opciones de Catálogo PDF</h3>
          </div>
          <button id="catalog-modal-close" class="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors">
            <span class="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <!-- Scrollable Form -->
        <div class="p-6 overflow-y-auto space-y-4 flex-1">
          <!-- Store Name -->
          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Nombre del Almacén</label>
            <input id="cat-opt-name" type="text" value="${t}" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-600 dark:text-slate-200" />
          </div>

          <!-- Store Phone -->
          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Contacto / WhatsApp</label>
            <input id="cat-opt-phone" type="text" value="${r}" placeholder="+57 300 000 0000" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-600 dark:text-slate-200" />
          </div>

          <!-- Tagline -->
          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Lema o Mensaje de Portada</label>
            <input id="cat-opt-tagline" type="text" value="Disponibilidad Inmediata & Garantía" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-600 dark:text-slate-200" />
          </div>

          <!-- Categories Checklist -->
          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Categorías a Incluir</label>
            <div class="space-y-2 max-h-[200px] overflow-y-auto p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
              ${c.map(e=>`
                <label class="flex items-center gap-3 p-1 hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-lg cursor-pointer transition-colors">
                  <input type="checkbox" data-category="${e}" checked class="rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 w-4 h-4" />
                  <span class="text-sm font-semibold text-slate-700 dark:text-slate-300 flex-1">${e}</span>
                  <span class="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">${s[e]} prod.</span>
                </label>
              `).join(``)}
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex gap-2 justify-end">
          <button id="catalog-modal-cancel" class="px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all">Cancelar</button>
          <button id="catalog-modal-generate" class="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-md shadow-indigo-600/25">Generar PDF</button>
        </div>
      </div>
    `,document.body.appendChild(u);let d=()=>{u.remove()};document.getElementById(`catalog-modal-close`).onclick=d,document.getElementById(`catalog-modal-cancel`).onclick=d,document.getElementById(`catalog-modal-generate`).onclick=async()=>{let e=document.getElementById(`cat-opt-name`).value.trim()||t,n=document.getElementById(`cat-opt-phone`).value.trim()||r,s=document.getElementById(`cat-opt-tagline`).value.trim()||`Catálogo de Productos`,c=Array.from(u.querySelectorAll(`input[data-category]:checked`)).map(e=>e.dataset.category);if(c.length===0){A(`Debes seleccionar al menos una categoría`,`warning`);return}d(),A(`Generando Catálogo PDF...`,`info`);let l=F.filter(e=>c.includes(e.categoria||`Otros`)&&Number(e.stockActual||0)>0&&Number(e.precioVenta||0)>0);if(l.length===0){A(`No hay productos con stock en las categorías seleccionadas`,`warning`);return}let f={};l.forEach(e=>{e.categoria,f[e.categoria||`Otros`]||(f[e.categoria||`Otros`]=[]),f[e.categoria||`Otros`].push(e)});let p=document.createElement(`div`);p.className=`print-catalog-container`;let m=`print-catalog-styles`,h=document.getElementById(m);h&&h.remove(),h=document.createElement(`style`),h.id=m,h.innerHTML=`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap');

        @page {
          size: A4 portrait;
          margin: 0;
        }

        @media print {
          /* Hide all existing page elements */
          body > *:not(.print-catalog-container) {
            display: none !important;
          }
          
          html, body {
            background: #D6D2C9 !important;
            color: #111111 !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: 100% !important;
            font-family: 'IBM Plex Mono', monospace !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          .print-catalog-container {
            display: block !important;
            width: 100% !important;
            background: #D6D2C9 !important;
          }
          
          /* Cover Page styling (Portada Negra, Letra Crema) */
          .catalog-cover {
            page-break-after: always;
            break-after: page;
            height: 100vh;
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 3.5rem 3rem;
            box-sizing: border-box;
            background: #111111 !important;
            color: #E8E4DC !important;
            position: relative;
            overflow: hidden;
          }

          .catalog-cover-grid {
            position: absolute;
            inset: 0;
            background-image: linear-gradient(90deg, #3A3A3A 1px, transparent 1px), linear-gradient(0deg, #3A3A3A 1px, transparent 1px);
            background-size: 40px 40px;
            opacity: 0.18;
            pointer-events: none;
          }

          .catalog-cover-header {
            position: relative;
            z-index: 2;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
          }

          .catalog-cover-logo-img {
            max-height: 80px;
            max-width: 220px;
            object-fit: contain;
            margin-bottom: 1rem;
            filter: drop-shadow(0 2px 8px rgba(255,255,255,0.1));
          }

          .catalog-cover-store {
            font-family: 'Bebas Neue', sans-serif;
            font-size: 3.8rem;
            line-height: 0.9;
            letter-spacing: 2px;
            color: #E8E4DC;
            text-transform: uppercase;
            margin: 0;
          }

          .catalog-cover-tagline {
            font-family: 'IBM Plex Mono', monospace;
            font-size: 0.8rem;
            font-weight: 700;
            color: #E8E4DC;
            opacity: 0.75;
            letter-spacing: 3px;
            text-transform: uppercase;
            margin-top: 0.6rem;
          }

          .catalog-cover-red-line {
            width: 60px;
            height: 4px;
            background-color: #E6171A;
            margin-top: 1rem;
          }

          .catalog-cover-middle {
            position: relative;
            z-index: 2;
            margin: 1.5rem 0;
            padding: 2.2rem;
            background: #111111 !important;
            border: 1px solid #3A3A3A;
          }

          .catalog-cover-title {
            font-family: 'Bebas Neue', sans-serif;
            font-size: 5rem;
            line-height: 0.88;
            color: #E8E4DC;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin: 0 0 1rem 0;
          }

          .catalog-cover-badge {
            display: inline-block;
            font-family: 'IBM Plex Mono', monospace;
            font-size: 0.75rem;
            font-weight: 700;
            color: #34D399;
            letter-spacing: 3px;
            text-transform: uppercase;
            border: 1px solid #34D399;
            padding: 0.35rem 0.75rem;
            margin-bottom: 1.5rem;
          }

          .catalog-cover-date {
            font-family: 'IBM Plex Mono', monospace;
            font-size: 0.78rem;
            color: #E8E4DC;
            opacity: 0.65;
            text-transform: uppercase;
            letter-spacing: 2px;
            border-top: 1px solid #3A3A3A;
            padding-top: 1rem;
            margin: 0;
          }

          .catalog-cover-footer {
            position: relative;
            z-index: 2;
            background: #111111 !important;
            border: 1px solid #3A3A3A;
            padding: 1.25rem 1.5rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 1rem;
          }

          .catalog-cover-contact {
            font-family: 'IBM Plex Mono', monospace;
            font-size: 0.9rem;
            font-weight: 700;
            color: #E8E4DC;
            letter-spacing: 1px;
          }

          .catalog-cover-contact-phone {
            font-family: 'Bebas Neue', sans-serif;
            font-size: 1.6rem;
            color: #34D399;
            letter-spacing: 1.5px;
            vertical-align: middle;
            margin-left: 0.5rem;
          }

          .catalog-cover-address {
            font-family: 'IBM Plex Mono', monospace;
            font-size: 0.7rem;
            color: #E8E4DC;
            opacity: 0.6;
            text-align: right;
            line-height: 1.4;
          }

          /* Catalog Pages (Páginas Internas Beige) */
          .catalog-page {
            page-break-after: always;
            break-after: page;
            height: 100vh;
            width: 100%;
            padding: 2.25rem 2rem 1.75rem 2rem;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            background: #D6D2C9 !important;
            color: #111111 !important;
            font-family: 'IBM Plex Mono', monospace;
            position: relative;
          }

          .catalog-page-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            border-bottom: 2px solid #111111;
            padding-bottom: 0.5rem;
            margin-bottom: 1.25rem;
          }

          .catalog-page-section-title {
            display: flex;
            align-items: center;
            gap: 0.6rem;
          }

          .catalog-page-section-bar {
            width: 8px;
            height: 2rem;
            background: #E6171A;
            display: inline-block;
          }

          .catalog-page-section-text {
            font-family: 'Bebas Neue', sans-serif;
            font-size: 2.4rem;
            line-height: 1;
            color: #111111;
            letter-spacing: 1.5px;
            text-transform: uppercase;
          }

          .catalog-page-store-name {
            font-family: 'IBM Plex Mono', monospace;
            font-size: 0.75rem;
            font-weight: 700;
            color: #3A3A3A;
            text-transform: uppercase;
            letter-spacing: 2px;
          }

          /* 2-Column Grid */
          .catalog-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.25rem;
            flex-grow: 1;
            align-content: start;
          }

          /* Catalog Card with Thin Line Border (#3A3A3A) */
          .catalog-card {
            display: flex;
            flex-direction: column;
            background: #E8E4DC !important;
            border: 1px solid #3A3A3A;
            padding: 1rem;
            box-sizing: border-box;
            height: calc((100vh - 10.5rem) / 2);
            justify-content: space-between;
            position: relative;
          }

          .catalog-card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.5rem;
          }

          .catalog-card-brand {
            font-family: 'IBM Plex Mono', monospace;
            font-size: 0.7rem;
            font-weight: 700;
            color: #3A3A3A;
            text-transform: uppercase;
            letter-spacing: 1.5px;
          }

          .catalog-card-stock-badge {
            font-family: 'IBM Plex Mono', monospace;
            font-size: 0.65rem;
            font-weight: 700;
            background: #111111 !important;
            color: #34D399 !important;
            border: 1px solid #34D399;
            padding: 0.15rem 0.4rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .catalog-card-image-box {
            height: 48%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #D6D2C9 !important;
            border: 1px solid #3A3A3A;
            padding: 0.5rem;
            margin-bottom: 0.6rem;
            overflow: hidden;
          }

          .catalog-card-image {
            max-height: 100%;
            max-width: 100%;
            object-fit: contain;
          }

          .catalog-card-no-image {
            display: flex;
            align-items: center;
            justify-content: center;
            color: #3A3A3A;
          }

          .catalog-card-body {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            flex-grow: 1;
          }

          .catalog-card-title {
            font-family: 'Bebas Neue', sans-serif;
            font-size: 1.5rem;
            line-height: 1.05;
            color: #111111;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin: 0 0 0.35rem 0;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .catalog-card-specs {
            display: flex;
            flex-wrap: wrap;
            gap: 0.35rem;
            margin-bottom: 0.5rem;
          }

          .catalog-card-spec-tag {
            font-family: 'IBM Plex Mono', monospace;
            font-size: 0.62rem;
            font-weight: 600;
            background: #D6D2C9;
            color: #111111;
            border: 1px solid #3A3A3A;
            padding: 0.1rem 0.35rem;
            text-transform: uppercase;
          }

          /* Poster Style Price Tag Box */
          .catalog-card-price-box {
            background: #111111 !important;
            border: 1px solid #3A3A3A;
            padding: 0.4rem 0.6rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: auto;
          }

          .catalog-card-price-label {
            font-family: 'IBM Plex Mono', monospace;
            font-size: 0.6rem;
            font-weight: 700;
            color: #E8E4DC;
            opacity: 0.75;
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          .catalog-card-price-value {
            font-family: 'Bebas Neue', sans-serif;
            font-size: 1.6rem;
            line-height: 1;
            color: #34D399 !important;
            letter-spacing: 1px;
            margin-top: 2px;
          }

          /* Internal Page Footer */
          .catalog-page-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 1px solid #3A3A3A;
            padding-top: 0.6rem;
            margin-top: auto;
            font-family: 'IBM Plex Mono', monospace;
            font-size: 0.72rem;
            color: #3A3A3A;
            font-weight: 600;
          }

          .catalog-footer-phone-val {
            font-family: 'Bebas Neue', sans-serif;
            font-size: 1.1rem;
            color: #E6171A;
            letter-spacing: 1px;
            margin-left: 0.3rem;
            vertical-align: middle;
          }
        }
      `;let g=0;for(let e of Object.values(f))g+=Math.ceil(e.length/4);let _=g+1,v=``;v+=`
        <div class="catalog-cover">
          <div class="catalog-cover-grid"></div>
          
          <div class="catalog-cover-header">
            ${i?`<img class="catalog-cover-logo-img" src="${i}">`:``}
            <h1 class="catalog-cover-store">${e}</h1>
            <p class="catalog-cover-tagline">${s}</p>
            <div class="catalog-cover-red-line"></div>
          </div>
          
          <div class="catalog-cover-middle">
            <h2 class="catalog-cover-title">Catálogo de Productos</h2>
            <div class="catalog-cover-badge">DISPONIBILIDAD INMEDIATA &bull; GARANTÍA REAL</div>
            <p class="catalog-cover-date">VIGENTE: ${new Date().toLocaleDateString(`es-CO`,{day:`numeric`,month:`long`,year:`numeric`})}</p>
          </div>
          
          <div class="catalog-cover-footer">
            <div class="catalog-cover-contact">
              CONTACTO / PEDIDOS: 
              ${n?`<span class="catalog-cover-contact-phone">${n}</span>`:``}
            </div>
            <div class="catalog-cover-address">
              ${a?`${a}`:``} ${o?` &bull; ${o}`:``}<br/>
              COMPRAS AL POR MAYOR Y ENVÍOS NACIONALES
            </div>
          </div>
        </div>
      `;let y=1;for(let[t,r]of Object.entries(f)){r.sort((e,t)=>{let n=(e.marca||``).toLowerCase(),r=(t.marca||``).toLowerCase();return n===r?(e.nombre||``).localeCompare(t.nombre||``):n.localeCompare(r)});for(let i=0;i<r.length;i+=4){let a=r.slice(i,i+4);y++,v+=`
            <div class="catalog-page">
              <div class="catalog-page-header">
                <div class="catalog-page-section-title">
                  <span class="catalog-page-section-bar"></span>
                  <span class="catalog-page-section-text">${t}</span>
                </div>
                <span class="catalog-page-store-name">${e}</span>
              </div>
              
              <div class="catalog-grid">
                ${a.map(e=>{let t=Number(String(e.precioVenta).replace(/\D/g,``)||0),n=new Intl.NumberFormat(`es-CO`,{style:`currency`,currency:`COP`,maximumFractionDigits:0}).format(t),r=[];e.ram&&r.push(`RAM: ${e.ram}`),(e.memoria||e.almacenamiento)&&r.push(`MEM: ${e.memoria||e.almacenamiento}`),e.color&&r.push(e.color);let i=r.map(e=>`<span class="catalog-card-spec-tag">${e}</span>`).join(``);return`
                    <div class="catalog-card">
                      <div class="catalog-card-header">
                        <span class="catalog-card-brand">${e.marca||`GENÉRICO`}</span>
                        <span class="catalog-card-stock-badge">STOCK: ${e.stockActual}</span>
                      </div>
                      
                      <div class="catalog-card-image-box">
                        ${e.imagen?`<img class="catalog-card-image" src="${e.imagen}" referrerpolicy="no-referrer">`:`<div class="catalog-card-no-image">
                               <span class="material-symbols-outlined" style="font-size: 3rem; color: #3A3A3A;">smartphone</span>
                             </div>`}
                      </div>
                      
                      <div class="catalog-card-body">
                        <h3 class="catalog-card-title">${e.nombre}</h3>
                        ${i?`<div class="catalog-card-specs">${i}</div>`:``}
                        
                        <div class="catalog-card-price-box">
                          <span class="catalog-card-price-label">PRECIO DE VENTA</span>
                          <span class="catalog-card-price-value">${n}</span>
                        </div>
                      </div>
                    </div>
                  `}).join(``)}
              </div>
              
              <div class="catalog-page-footer">
                <div>PEDIDOS: ${n?`<span class="catalog-footer-phone-val">${n}</span>`:`CONTACTAR ALMACÉN`}</div>
                <div>PÁGINA ${y} DE ${_}</div>
              </div>
            </div>
          `}}p.innerHTML=v;let b=()=>{p.remove(),h.remove(),window.removeEventListener(`afterprint`,b)};document.head.appendChild(h),document.body.appendChild(p),window.addEventListener(`afterprint`,b),setTimeout(()=>{window.print()},350)}}catch(e){console.error(`Error generating catalog options:`,e),A(`Error al abrir ajustes del catálogo: `+e.message,`error`)}finally{n(!1)}}var Bn=!1;function Vn(){let e=JSON.parse(localStorage.getItem(`adminpro_user`)||`{}`).rol||`Vendedor`,t=document.getElementById(`dash-card-egresos`),n=document.getElementById(`dash-card-utilidad`),r=document.getElementById(`dash-kpi-row`),i=document.getElementById(`dash-qa-tecnico`),a=document.getElementById(`dash-qa-egresos`),o=document.getElementById(`dash-qa-vender`),s=document.getElementById(`dash-qa-creditos`),c=document.getElementById(`dash-ventas-section`),l=document.getElementById(`dash-chart-card`),u=document.getElementById(`dash-tec-queue-card`),d=document.getElementById(`dash-bottom-row`),f=document.getElementById(`dash-business-metrics`);[t,n,r,i,a,o,s,c,l,u,d,f].forEach(e=>{e&&(e.style.display=``)}),d&&(d.className=`grid grid-cols-1 lg:grid-cols-2 gap-5`),e===`Vendedor`?(t&&(t.style.display=`none`),n&&(n.style.display=`none`),i&&(i.style.display=`none`),a&&(a.style.display=`none`),u&&(u.style.display=`none`),d&&(d.className=`grid grid-cols-1 gap-5`)):e===`Técnico de reparación`&&(r&&(r.style.display=`none`),o&&(o.style.display=`none`),a&&(a.style.display=`none`),s&&(s.style.display=`none`),c&&(c.style.display=`none`),l&&(l.style.display=`none`),d&&(d.className=`grid grid-cols-1 gap-5`),f&&(f.style.display=`none`))}function Hn(){return async()=>{Un(),Vn(),Bn||=(document.getElementById(`dash-refresh-btn`)?.addEventListener(`click`,Wn),document.querySelectorAll(`[data-goto]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.goto;t&&f(t)})}),!0),await Wn()}}function Un(){let e=new Date().getHours(),t=e<12?`¡Buenos días! 👋`:e<18?`¡Buenas tardes! ☕`:`¡Buenas noches! 🌙`,n=document.getElementById(`dash-greeting`);n&&(n.textContent=t)}async function Wn(){try{let[e,t]=await Promise.all([Qt(),on()]);Gn(`dash-ventas-hoy`,e.ingresosHoy,!0),Gn(`dash-egresos-hoy`,e.egresosHoy,!0),Gn(`dash-utilidad`,e.utilidad,!0),Gn(`dash-stock-critico`,e.stockCritico),Gn(`dash-total-productos`,e.totalProductos),Gn(`dash-total-stock`,e.totalStock),Gn(`dash-total-equipos`,e.totalEquipos),Gn(`dash-total-clientes`,e.totalClientes),Gn(`dash-creditos-activos`,e.creditosActivos),Gn(`dash-total-reventas`,e.totalReventas),Kn(e.ventasRecientes),qn(e.topProductos),Jn(e.productosBajoStock),Yn(e.tecRecientes),Zn(e.labels7d,e.ventas7d),Xn(t)}catch(e){console.error(`Dashboard error:`,e)}}function Gn(e,t,n=!1){let r=document.getElementById(e);r&&(r.textContent=n?`$`+new Intl.NumberFormat(`es-CO`).format(t||0):(t||0).toLocaleString())}function Kn(e){let t=document.getElementById(`dash-ventas-list`);if(t){if(!e||e.length===0){t.innerHTML=`<p class="p-5 text-sm text-on-surface-variant text-center">No hay ventas hoy</p>`;return}t.innerHTML=e.map(e=>`
    <div class="flex items-center gap-3 px-5 py-3 hover:bg-surface-container-low transition-colors">
      <div class="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
        <span class="material-symbols-outlined text-[18px]">receipt</span>
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-semibold text-on-surface truncate">${e.cliente||`Consumidor Final`}</p>
        <p class="text-[11px] text-on-surface-variant">${e.id_factura} · ${new Date(e.fecha).toLocaleDateString()}</p>
      </div>
      <div class="text-right font-bold text-on-surface text-sm">$${new Intl.NumberFormat(`es-CO`).format(e.total)}</div>
    </div>
  `).join(``)}}function qn(e){let t=document.getElementById(`dash-top-productos`);if(t){if(!e||e.length===0){t.innerHTML=`<p class="p-4 text-center text-xs text-on-surface-variant italic">Sin ventas aún</p>`;return}t.innerHTML=e.map((e,t)=>`
    <div class="flex items-center gap-3">
      <span class="text-lg font-black text-outline-variant/20 w-5">0${t+1}</span>
      <div class="flex-1 min-w-0">
        <p class="text-xs font-bold text-on-surface truncate">${e.nombre}</p>
        <div class="flex items-center gap-2 mt-0.5">
          <div class="flex-1 h-1 bg-surface-container rounded-full overflow-hidden">
            <div class="h-full bg-primary" style="width: ${Math.min(e.cantidad*10,100)}%"></div>
          </div>
          <span class="text-[10px] font-black text-primary">${e.cantidad}</span>
        </div>
      </div>
    </div>
  `).join(``)}}function Jn(e){let t=document.getElementById(`dash-stock-alertas`);if(t){if(!e||e.length===0){t.innerHTML=`<p class="p-4 text-center text-xs text-on-surface-variant italic">Stock ok</p>`;return}t.innerHTML=e.map(e=>`
    <div class="flex items-center justify-between p-2.5 bg-error/5 border border-error/10 rounded-lg">
      <div class="min-w-0">
        <p class="text-xs font-bold text-on-surface truncate">${e.nombre}</p>
        <p class="text-[10px] text-error">Quedan: ${e.stock_actual}</p>
      </div>
      <span class="material-symbols-outlined text-error text-[18px] ${Number(e.stock_actual)===0?`animate-bounce`:`animate-pulse`}">warning</span>
    </div>
  `).join(``)}}function Yn(e){let t=document.getElementById(`dash-tec-list`);if(t){if(!e||e.length===0){t.innerHTML=`<p class="p-5 text-sm text-on-surface-variant text-center">Sin servicios</p>`;return}t.innerHTML=e.map(e=>`
    <li class="flex items-center justify-between p-3 hover:bg-surface-container-low transition-colors">
      <div class="min-w-0">
        <p class="text-xs font-bold text-on-surface truncate">${e.equipo}</p>
        <p class="text-[10px] text-on-surface-variant">${e.cliente}</p>
      </div>
      <span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant">${e.estado}</span>
    </li>
  `).join(``)}}function Xn(e){let t=document.getElementById(`dash-tasks-list`);if(!t)return;let n=(e||[]).filter(e=>e.estado!==`Completada`).slice(0,5);if(n.length===0){t.innerHTML=`<p class="p-8 text-center text-xs text-on-surface-variant italic">No hay pendientes</p>`;return}t.innerHTML=n.map(e=>`
    <li class="flex items-center gap-3 px-5 py-3 hover:bg-surface-container-low transition-colors">
      <span class="w-1.5 h-1.5 rounded-full" style="background-color: ${e.color||`#4f46e5`}"></span>
      <div class="flex-1 min-w-0">
        <p class="text-xs font-bold text-on-surface truncate">${e.tarea}</p>
        <p class="text-[9px] text-on-surface-variant uppercase tracking-tight">${new Date(e.fecha_vencimiento).toLocaleDateString(`es-CO`,{day:`numeric`,month:`short`})}</p>
      </div>
    </li>
  `).join(``)}function Zn(e,t){let n=document.getElementById(`dash-chart`);if(!n)return;if(!t||t.length===0||t.every(e=>e===0)){n.innerHTML=`<div class="flex-1 flex items-center justify-center text-on-surface-variant text-xs italic opacity-50">Sin ventas</div>`;return}let r=Math.max(...t,1);n.innerHTML=t.map((t,n)=>{let i=Math.max(t/r*100,5);return`
      <div class="flex-1 flex flex-col items-center group h-full">
        <div class="flex-1 w-full flex items-end justify-center">
          <div class="w-full max-w-[28px] rounded-t-md transition-all duration-500 relative ${t===0?`bg-surface-container/30`:`bg-primary`}"
               style="height: ${i}%;"></div>
        </div>
        <span class="text-[9px] text-on-surface-variant font-bold mt-2 uppercase tracking-tighter">${e[n]||``}</span>
      </div>
    `}).join(``)}async function Qn(e,t=null,n=[]){let r=Je(),i=0,a=0,o=0,s=0,c=[],l=[],u=[],d=[],f=[];await Promise.allSettled([Qt().then(e=>{i=e.ingresosHoy||0,a=e.egresosHoy||0,o=e.utilidad||0,s=e.stockCritico||0}),tn().then(e=>{c=e||[]}),P().then(e=>{l=(e||[]).slice(0,30)}),Pt().then(e=>{u=(e||[]).slice(0,20)}),Et().then(e=>{d=(e||[]).slice(0,20)}),on().then(e=>{f=(e||[]).slice(0,10)})]);let p=l.map(e=>`• ID: ${e.id} | ${e.nombre} | Marca: ${e.marca||`Universal`} | Ref/SKU: ${e.sku||`N/A`} | Costo: $${e.costo||0} | Venta: $${e.precio_venta??e.precioVenta??0} | Stock: ${e.stock_actual??e.stockActual??0}`).join(`
`)||`Sin datos de inventario`,m=u.map(e=>`• ${e.nombre} ${e.marca||``} | IMEI: ${e.imei1||`N/A`} | Estado: ${e.estado||`?`} | Precio: $${e.venta??`?`}`).join(`
`)||`Sin equipos registrados`,h=d.map(e=>`• ${e.nombre} | Tel: ${e.telefono||`N/A`} | Doc: ${e.cedula||`N/A`}`).join(`
`)||`Sin clientes`,g=f.map(e=>`• [${e.prioridad||`Media`}] ${e.tarea} — Vence: ${e.fecha_vencimiento||`?`} — ${e.estado||`Pendiente`}`).join(`
`)||`Sin tareas pendientes`,_=`
Eres FoneBase IA, el asistente inteligente de gestión de negocio para una tienda de celulares y tecnología.
Tienes acceso completo a los datos del negocio en tiempo real. Eres detallado, preciso y útil.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ REGLA ABSOLUTA — NUNCA INCUMPLIR:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROHIBIDO responder con frases genéricas vacías como:
- "He interpretado la instrucción del dispositivo exitosamente."
- "Listo." / "Entendido." / "Hecho."
- Cualquier respuesta que no detalle QUÉ se hizo o QUÉ se encontró.

OBLIGATORIO: Cuando ejecutes una acción, el campo "response" DEBE mencionar:
- Nombre exacto del item registrado/modificado
- Valores clave (precio, costo, IMEI, cantidad, nombre del cliente, etc.)
- Confirmación de lo que el sistema va a registrar

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 DATOS DEL NEGOCIO EN TIEMPO REAL:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Fecha/hora: ${new Date().toLocaleString(`es-CO`)}
Ventas hoy: $${i.toLocaleString(`es-CO`)}
Egresos hoy: $${a.toLocaleString(`es-CO`)}
Utilidad hoy: $${o.toLocaleString(`es-CO`)}
Stock crítico (productos bajo mínimo): ${s}
Equipo/Vendedores: ${c.map(e=>e.nombre).join(`, `)||`Ninguno`}

📦 INVENTARIO ACTUAL (top 30):
${p}

📱 EQUIPOS CON IMEI (top 20):
${m}

👥 CLIENTES (top 20):
${h}

✅ TAREAS PENDIENTES:
${g}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 INSTRUCCIONES DE RECONOCIMIENTO Y ASOCIACIÓN:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IMEI: Siempre 15 dígitos numéricos. IMEI1 = principal, IMEI2 = secundario.
No confundir con S/N (contiene letras) ni FCC ID.

MEMORIA: Formato "128+4GB" o "4GB RAM / 128GB ROM":
- Número menor = RAM (ej: "4GB")  
- Número mayor = almacenamiento/ROM (ej: "128GB")

COLOR: Identifica colores en español e inglés en etiquetas.

REFERENCIAS TÉCNICAS Y NOMBRES DE CELULARES:
- En cajas y etiquetas de celulares, identifica SIEMPRE el **Nombre Comercial** y el **Código de Modelo / Referencia** (ej: "KN3" es "Tecno Spark Go 3 (KN3)", "KL7" es "Tecno Spark 30 Pro (KL7)", "A35e" es "ZTE Blade A35e", "A175F" o "A17" es "Samsung Galaxy A17", "A075M" o "A07" es "Samsung Galaxy A07", etc.).
- Incluye SIEMPRE el código de referencia en el campo "sku" (ej: "sku": "KN3", "sku": "A175F").
- Nombra el producto/equipo incluyendo su referencia técnica entre paréntesis (ej: "nombre": "Samsung Galaxy A17 (A175F)").

VINCULACIÓN OBLIGATORIA CON PRECIOS DE INVENTARIO EXISTENTE:
- Cuando el usuario solicite registrar equipos, celulares o IMEIs (por foto o texto), revisa SIEMPRE si el producto o modelo ya existe en la lista de "📦 INVENTARIO ACTUAL".
- SI EL PRODUCTO YA EXISTE EN EL INVENTARIO:
  * HEREDA AUTOMÁTICAMENTE el "costo" y el "precio_venta" registrados en el inventario.
  * ASIGNA "id_producto" con el ID del producto (ej: "PROD-...").
  * NUNCA asignes "costo": 0 ni "venta": 0 cuando el producto ya existe en inventario con precios definidos.
  * En "response", confirma con claridad que los equipos fueron asociados al producto del inventario con sus precios ya establecidos.
- SI EL PRODUCTO ES NUEVO (NO está en el inventario):
  * Si el usuario indicó un precio en su mensaje, tómalo como el costo de compra y calcula venta (+20%).
  * Si no indicó ningún precio y el producto no existe en inventario, deja costo: 0 para que el asistente solicite el costo de compra.

REGISTRO POR IMAGEN Y DATOS FALTANTES:
- Si hay IMEI visible en imagen → acción "crear_equipo"
- Si hay modelo/specs pero sin IMEI → acción "crear_producto"
- MÚLTIPLES PRODUCTOS EN IMÁGENES: Si detectas varios productos en las imágenes (o varias imágenes de diferentes celulares/productos), DEBES retornar en el JSON el campo "actions": [ { ...acción 1... }, { ...acción 2... }, ... ] con una acción para CADA producto. Cada acción debe incluir su campo "imagen_index" (0 para la 1ra foto, 1 para la 2da, 2 para la 3ra, etc.), nombre exacto con referencia, marca, sku, ram, memoria, color e IMEI si está visible. Si conoces el costo (por el inventario o mensaje), asígnalo a todos.
- CAMPO imagen_index: Cuando el usuario envía varias imágenes, DEBES incluir en cada acción el campo "imagen_index" con el número (0-based) de la imagen que corresponde al producto que estás registrando. Ejemplo: si el producto está en la 2ª imagen enviada, usa "imagen_index": 1. Esto permite al sistema guardar la foto correcta para cada producto.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 ACCIONES DISPONIBLES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Registrar egreso:
{"response":"✅ Registré un egreso de $15.000 por concepto de 'Papelería' en categoría Suministros.","action":{"type":"registrar_egreso","categoria":"Suministros","concepto":"Papelería","responsable":"Juan","monto":15000}}

2. Crear tarea:
{"response":"📌 Creé la tarea 'Revisar inventario' con prioridad Alta, vence el 2026-08-20, asignada a Carlos.","action":{"type":"crear_tarea","tarea":"Revisar inventario","fecha_inicio":"2026-08-14","fecha_vencimiento":"2026-08-20","prioridad":"Alta","responsable":"Carlos","notes":"","color":"#ef4444"}}

3. Buscar cliente:
{"response":"Buscando cliente con nombre o documento 'García'...","action":{"type":"buscar_cliente","query":"García"}}

4. Navegar a sección:
{"response":"Voy a llevarte a Inventario ahora mismo.","action":{"type":"ir_a","destino":"inventory"}}

5. Crear cliente (Cédula y Dirección son OBLIGATORIOS. Si el usuario no los indica, deja "cedula" y/or "direccion" vacíos o null; NO los inventes):
{"response":"✅ Registré al cliente Juan García, cédula 123456, teléfono 3001234567.","action":{"type":"crear_cliente","cedula":"123456","nombre":"Juan García","telefono":"3001234567","direccion":"Calle 5 #10","email":"","tipo":"Natural"}}

6. Crear producto en inventario (incluye imagen_index: índice 0-based de qué imagen adjunta corresponde a este producto):
{"response":"✅ Agregué al inventario: Samsung A15 128GB/4GB RAM, color Negro. Precio venta: $650.000, costo: $480.000, stock inicial: 3 unidades.","action":{"type":"crear_producto","imagen_index":0,"nombre":"Samsung A15","marca":"Samsung","categoria":"Celulares","tipo":"Físico","costo":480000,"precioVenta":650000,"stockMinimo":2,"stockActual":3,"ubicacion":"Vitrina A","sku":"","ram":"4GB","memoria":"128GB","color":"Negro"}}

7. Registrar equipo con IMEI (incluye imagen_index: índice 0-based de qué imagen adjunta corresponde a este equipo):
{"response":"✅ Registré el equipo Samsung A15 128GB/4GB RAM color Negro. IMEI1: 356251200774692, IMEI2: 356251200774700. Costo: $480.000, precio venta: $650.000.","action":{"type":"crear_equipo","imagen_index":0,"imei1":"356251200774692","imei2":"356251200774700","marca":"Samsung","nombre":"Samsung A15","proveedor":"Proveedor X","costo":480000,"venta":650000,"estado":"Disponible","color":"Negro","ram":"4GB","memoria":"128GB","condicion":"Nuevo","notas":""}}

8. Servicio técnico:
{"response":"✅ Abrí orden de servicio técnico para Pedro Pérez. Equipo: iPhone 13 (IMEI: 123456789012345), falla: 'Pantalla rota'. Abono: $30.000, precio final: $150.000.","action":{"type":"crear_servicio_tecnico","cliente":"Pedro Pérez","telefono":"3109876543","equipo":"iPhone 13","imei_serie":"123456789012345","falla":"Pantalla rota","clave_patron":"","repuestos":"Display iPhone 13","costo_taller":80000,"abono":30000,"precio_final":150000,"estado":"Recibido"}}

9. Registrar crédito:
{"response":"✅ Registré un crédito de $120.000 a nombre de María López por 'compra de cargador inalámbrico a cuotas'.","action":{"type":"crear_credito","cliente":"María López","telefono":"3201234567","total":120000,"detalle":"Compra de cargador inalámbrico a cuotas"}}

10. Vale físico:
{"response":"✅ Creé un vale físico por 1 unidad de 'Cargador 65W' por $45.000 a nombre de Carlos (vendedor).","action":{"type":"crear_vale_fisico","cliente":"Carlos","producto":"Cargador 65W","cantidad":1,"monto":45000,"estado":"Pendiente"}}

11. Reventa:
{"response":"✅ Registré reventa rápida: Auriculares Bluetooth, costo $35.000, precio venta $60.000, proveedor: Distribuidora Norte.","action":{"type":"crear_reventa","producto":"Auriculares Bluetooth","categoria":"Accesorios","costo":35000,"precio":60000,"proveedor":"Distribuidora Norte"}}

12. Crear préstamo o adelanto a empleado (nómina):
{"response":"✅ Registré un préstamo de $100.000 para el empleado Johan.","action":{"type":"crear_prestamo","empleado":"Johan","monto":100000,"tipo_prestamo":"Dinero","notas":"Préstamo solicitado por el empleado"}}

13. Registrar múltiples celulares / IMEIs con precio indicado por el usuario (ej: "registra estos imei todo tiene un precio de 330000"):
{"response":"✅ Registré con éxito los 2 equipos Tecno KN3 a costo $330.000 y venta $396.000.","actions":[{"type":"crear_equipo","imagen_index":0,"nombre":"Tecno KN3","marca":"Tecno","imei1":"356251200774692","imei2":"356251207450635","color":"In Black","ram":"4GB","memoria":"128GB","costo":330000,"venta":396000,"estado":"Disponible"},{"type":"crear_equipo","imagen_index":1,"nombre":"Tecno KN3","marca":"Tecno","imei1":"356251200227980","imei2":"356251209337434","color":"Titanium Grey","ram":"4GB","memoria":"128GB","costo":330000,"venta":396000,"estado":"Disponible"}]}

14. Registrar múltiples productos de imágenes sin precio (para que el usuario complete en el asistente):
{"response":"Identifiqué 2 celulares en las imágenes:\n- **Redmi 15C** (128GB ROM / 8GB RAM, Azul)\n- **Tecno Pova Curve 2** (128GB ROM / 8GB RAM, Negro)\n\nPor favor completa los costos en el asistente:","actions":[{"type":"crear_equipo","imagen_index":0,"nombre":"Redmi 15C","marca":"Xiaomi","ram":"8GB","memoria":"128GB","color":"Azul","costo":0,"venta":0},{"type":"crear_equipo","imagen_index":1,"nombre":"Tecno Pova Curve 2","marca":"Tecno","ram":"8GB","memoria":"128GB","color":"Negro","costo":0,"venta":0}]}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 RESPUESTAS DE CONSULTA (action = null):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Cuando el usuario pregunta sobre datos del negocio, usa los datos reales del contexto.
Ejemplo: {"response":"Hoy llevas $320.000 en ventas, $45.000 en egresos, dejando una utilidad de $275.000. Tienes 3 productos con stock crítico.","action":null}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ FORMATO DE SALIDA:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Responde ÚNICAMENTE con JSON válido parseable con JSON.parse().
- NO uses bloques markdown (\`\`\`json).
- El campo "response" es OBLIGATORIO y debe ser ESPECÍFICO con los datos registrados.
- SIEMPRE incluye el array "actions" con CADA uno de los celulares/productos a registrar. Sin "actions", los productos NO se guardan en la base de datos.
- El sistema SÍ soporta y asocia automáticamente las fotos/imágenes que adjunte el usuario. NO le digas al usuario que el sistema no soporta imágenes.
- Organiza la respuesta del campo "response" usando Markdown legible (usa listas con viñetas "- ", negritas "**", títulos, etc.).
- Si no entiendes la petición, responde: {"response":"No entendí tu instrucción. Puedo registrar equipos, productos, clientes, gastos, servicios técnicos, tareas, metas, créditos, reventas y préstamos a empleados. ¿Qué necesitas?","action":null}
`,v=e||`¿Cuál es el estado del negocio hoy?`,y=v;if(t){let n=Array.isArray(t)?t:[t],r=(e||``).toLowerCase(),i=(e||``).trim().length;v=i<120&&(r.includes(`imei`)||r.includes(`agrega`)||r.includes(`registra`)||r.includes(`añade`)||r.includes(`estos`)||r.includes(`esto`)||r.includes(`equipo`)||r.includes(`celular`)||r.includes(`etiqueta`)||r.includes(`los`)||r.includes(`foto`))||i<30?`${e||``}. INSTRUCCIÓN PRINCIPAL: Analiza TODAS las imágenes adjuntas. En cada imagen busca y lee los códigos IMEI (números de 15 dígitos). Para cada equipo detectado, genera una acción crear_equipo con: imei1 (IMEI principal), nombre del modelo (ej: Samsung Galaxy A17), marca, ram, memoria, color. Si el modelo ya existe en el inventario con su ID y precio, usa esos datos. Si no hay precio, deja costo: 0.`:e||`Analiza esta imagen y registra lo que encuentres.`,y=[{type:`text`,text:v}],n.forEach(e=>{e&&y.push({type:`image_url`,image_url:{url:e.startsWith(`data:`)?e:`data:image/jpeg;base64,${e}`}})})}let b=[];n&&n.length>0&&n.slice(-8).forEach(e=>{if(e.sender===`user`){let t=e.text||`Procesa la imagen.`;if(e.base64Image){let n=Array.isArray(e.base64Image)?e.base64Image:[e.base64Image];t=[{type:`text`,text:e.text||`Analiza estas imágenes.`}],n.forEach(e=>{e&&t.push({type:`image_url`,image_url:{url:e.startsWith(`data:`)?e:`data:image/jpeg;base64,${e}`}})})}b.push({role:`user`,content:t})}else e.sender===`ai`&&b.push({role:`assistant`,content:e.text||``})});try{let n=r?r.slice(0,12)+`...`:`(vacía)`;console.log(`[IA] → OpenRouter | Modelo: google/gemini-2.5-flash-lite | Key: ${n}`),console.log(`[IA] → Instrucción: "${e?.slice(0,100)}"`);let i=await fetch(`https://openrouter.ai/api/v1/chat/completions`,{method:`POST`,headers:{"Content-Type":`application/json`,Authorization:`Bearer ${r}`,"HTTP-Referer":`https://inbizm.github.io/fonebase/`,"X-Title":`FoneBase IA`},body:JSON.stringify({model:`google/gemini-2.5-flash-lite`,messages:[{role:`system`,content:_},...b,{role:`user`,content:y}],temperature:.2,max_tokens:4e3})});if(!i.ok){let e=``;try{e=await i.text()}catch{}throw console.error(`[IA] Error HTTP ${i.status}:`,e),Error(`Error del servidor IA (${i.status}): ${e.slice(0,200)}`)}let a=(await i.json()).choices?.[0]?.message||{},o=(a.content||a.reasoning||``).trim();return console.log(`[IA] ← Respuesta cruda:`,o.slice(0,500)),er(o)||(o&&o.trim().length>0&&!o.trim().startsWith(`{`)?t&&v&&v.includes(`IMEI`)?{response:`📷 Vi las imágenes pero el modelo no pudo extraer los IMEIs automáticamente.

Por favor escribe los IMEIs manualmente, por ejemplo:
**"registra IMEI 356482402015899, Samsung Galaxy A17, 4GB RAM, 64GB, Negro"**`,action:null}:{response:o,action:null}:{response:t?`📷 Vi tus imágenes pero no pude leer los IMEIs automáticamente. Escribe los datos del equipo o el IMEI directamente en el chat.`:`⚠️ No se pudo procesar tu instrucción. Asegúrate de indicar la acción de forma clara (ej: 'registra un egreso de...', 'agrega estos equipos con IMEI').`,action:null})}catch(e){return console.error(`[IA] Error al procesar:`,e),{response:`⚠️ No pude procesar tu solicitud. Error: ${e.message}`,action:null}}}function $n(e){if(!e||typeof e!=`string`)return[];let t=e.split(`
`),n=[],r=0,i=0,a=e.match(/costo\s*(?:de)?\s*\$?([\d.,]+)/i);a&&(r=Number(a[1].replace(/\D/g,``))||0);let o=e.match(/venta\s*(?:sugerido|de)?\s*\$?([\d.,]+)/i);o&&(i=Number(o[1].replace(/\D/g,``))||0),r>0&&i===0&&(i=Math.ceil(r*1.2/1e3)*1e3);let s=e.match(/equipos?\s+([A-Za-z0-9\s]+?)(?:\s*\(|\s*con|\s*,|\s*\.|\s*a\s+costo)/i),c=s?s[1].trim():`Celular`,l=e.match(/(\d+\s*GB|\d+\s*TB)\s*(?:ROM|almacenamiento)?/i),u=e.match(/(\d+\s*GB)\s*RAM/i);return t.forEach((e,t)=>{let a=e.match(/IMEI(?:1)?:\s*(\d{14,16})/i);if(a){let t=a[1],o=e.match(/IMEI2:\s*(\d{14,16})/i),s=o?o[1]:``,d=e.match(/color\s+([A-Za-z0-9\s]+?)(?:,|\s*IMEI|\s*$)/i),f=d?d[1].trim():``,p=e.match(/(?:Equipo\s*\d+.*?:|Imagen\s*\d+.*?:)\s*([A-Za-z0-9\s]+?)(?:,|\s*color|\s*IMEI)/i),m=p?p[1].trim():c,h=m.split(` `)[0]||`Universal`;n.push({type:`crear_equipo`,imagen_index:n.length,nombre:m||`Celular`,marca:h,imei1:t,imei2:s,color:f,ram:u?u[1]:``,memoria:l?l[1]:``,costo:r,venta:i,estado:`Disponible`,condicion:`Nuevo`})}}),n}function er(e){if(!e)return null;let t=e.replace(/```json\n?/gi,``).replace(/```\n?/g,``).trim(),n=t.indexOf(`{`),r=t.lastIndexOf(`}`);n!==-1&&r>n&&(t=t.substring(n,r+1));try{let e=JSON.parse(t);if(e&&typeof e==`object`){if((!e.response||e.response.trim()===``)&&(e.response=e.actions||e.action?`✅ Procesé las acciones solicitadas.`:`⚠️ Respuesta vacía del modelo de IA.`),(!e.actions||e.actions.length===0)&&!e.action){let t=$n(e.response);t.length>0&&(e.actions=t)}return e}}catch{}try{let e=!1,n=!1,r=``;for(let i=0;i<t.length;i++){let a=t[i];a===`"`&&!n?(e=!e,r+=a):e&&(a===`
`||a===`\r`)?r+=`\\n`:e&&a===`	`?r+=`\\t`:r+=a,n=a===`\\`&&!n}r=r.replace(/,\s*([}\]])/g,`$1`);let i=JSON.parse(r);if(i&&typeof i==`object`){if((!i.response||i.response.trim()===``)&&(i.response=i.actions||i.action?`✅ Procesé las acciones solicitadas.`:`⚠️ Respuesta vacía del modelo de IA.`),(!i.actions||i.actions.length===0)&&!i.action){let e=$n(i.response);e.length>0&&(i.actions=e)}return i}}catch{}let i=``,a=t.match(/"response"\s*:\s*"([\s\S]*?)"\s*,\s*"(action|actions)"/i)||t.match(/"response"\s*:\s*"([\s\S]*?)"\s*}/i);a&&(i=a[1].replace(/\\n/g,`
`).replace(/\\"/g,`"`));let o=[],s=/\{\s*"type"\s*:\s*"([^"]+)"([\s\S]*?)\}/g,c;for(;(c=s.exec(t))!==null;){let e=c[0],t={type:c[1]},n=/"([a-zA-Z0-9_]+)"\s*:\s*("(?:\\.|[^"\\])*"|[0-9.]+|true|false|null)/g,r;for(;(r=n.exec(e))!==null;){let e=r[1],n=r[2];n.startsWith(`"`)&&n.endsWith(`"`)?t[e]=n.slice(1,-1).replace(/\\"/g,`"`).replace(/\\n/g,`
`):n===`true`?t[e]=!0:n===`false`?t[e]=!1:n===`null`?t[e]=null:t[e]=Number(n)}o.push(t)}if(o.length===0&&i){let e=$n(i);e.length>0&&o.push(...e)}return o.length>0||i?{response:i||`✅ Procesé los productos detectados en las imágenes.`,actions:o.length>1?o:void 0,action:o.length===1?o[0]:o.length>1?o:null}:null}window.wizardStateStore=window.wizardStateStore||{};function tr(e,t){if(!e||!Array.isArray(e)||e.length===0)return null;let n=(t.id_producto||t.id||``).trim(),r=(t.sku||``).toLowerCase().trim(),i=(t.nombre||t.name||``).toLowerCase().trim(),a=(t.marca||t.brand||``).toLowerCase().trim();if(n){let t=e.find(e=>e.id===n);if(t)return t}if(r){let t=e.find(e=>{let t=(e.sku||``).toLowerCase().trim();return t&&(t===r||t.includes(r)||r.includes(t))});if(t)return t}let o=e.find(e=>(e.nombre||``).toLowerCase().trim()===i);if(o)return o;let s=e=>{let t=e.match(/\b(sm-[a-z\d]+|[a-z]\d{2,4}[a-z\d]*|\d{1,2}[a-z]|kn\d+|kl\d+|bg\d+|\d{4}[a-z\d]+)\b/i);return t?t[1].toLowerCase():null},c=r||s(i);if(c){let t=c.match(/([a-z]\d{2,3})/i),n=t?t[1].toLowerCase():null,r=e.find(e=>{let t=(e.sku||``).toLowerCase().trim(),r=t||s(e.nombre||``),i=(e.nombre||``).toLowerCase();return!!(r&&(r===c||r.includes(c)||c.includes(r))||i.includes(c)||n&&(t.includes(n)||i.includes(n)))});if(r)return r}let l=i.replace(/[\(\)\/\,\.\-\_]/g,` `).split(/\s+/).filter(e=>e.length>=2&&![`celular`,`nuevo`,`telefono`,`equipo`].includes(e));if(l.length>0){let t=e.find(e=>{let t=(e.nombre||``).toLowerCase(),n=(e.marca||``).toLowerCase();return!a||n.includes(a)||a.includes(n)||t.includes(a)?l.some(e=>e.length>=3&&t.includes(e)):!1});if(t)return t}return null}window.wizardFormatCurrency=e=>{let t=e.value.replace(/\D/g,``);if(!t){e.value=``;return}e.value=Number(t).toLocaleString(`es-CO`)},window.wizardOnCostoInput=(e,t)=>{let n=e.value.replace(/\D/g,``);n||=(e.value=``,`0`);let r=Number(n);r>0&&(e.value=r.toLocaleString(`es-CO`));let i=document.getElementById(t);if(!i)return;let a=i.querySelector(`[data-field="precio"]`),o=i.querySelector(`[data-field="precioRevendedor"]`),s=r>0?Math.ceil(Math.max(r*1.05,r+2e4)/1e3)*1e3:0,c=r>0?Math.ceil(r*1.2/1e3)*1e3:0;a&&(a.value=c>0?c.toLocaleString(`es-CO`):``),o&&(o.value=s>0?s.toLocaleString(`es-CO`):``);let l=i.querySelector(`[data-preview="rev-price"]`),u=i.querySelector(`[data-preview="rev-profit"]`),d=i.querySelector(`[data-preview="final-price"]`),f=i.querySelector(`[data-preview="final-profit"]`),p=i.querySelector(`[data-preview="esc-15"]`),m=i.querySelector(`[data-preview="esc-25"]`),h=i.querySelector(`[data-preview="esc-30"]`),g=e=>`$${Number(e).toLocaleString(`es-CO`)}`;l&&(l.textContent=r>0?g(s):`$—`),u&&(u.textContent=r>0?`Ganancia: +${g(s-r)}`:`+ $0`),d&&(d.textContent=r>0?g(c):`$—`),f&&(f.textContent=r>0?`Ganancia: +${g(c-r)}`:`+ $0`),p&&(p.textContent=r>0?g(Math.ceil(r*1.15/1e3)*1e3):`$—`),m&&(m.textContent=r>0?g(Math.ceil(r*1.25/1e3)*1e3):`$—`),h&&(h.textContent=r>0?g(Math.ceil(r*1.3/1e3)*1e3):`$—`)},window.wizardApplyToAll=e=>{let t=window.wizardStateStore[e],n=document.getElementById(e);if(!t||!n)return;let r=n.querySelector(`[data-field="costo"]`),i=n.querySelector(`[data-field="precio"]`),a=n.querySelector(`[data-field="precioRevendedor"]`),o=Number(r?.value.replace(/\D/g,``))||0,s=Number(i?.value.replace(/\D/g,``))||0,c=Number(a?.value.replace(/\D/g,``))||0;if(o===0){window.showToast&&window.showToast(`Ingresa el costo primero`,`warning`);return}t.items.forEach(e=>{e.costo=o,e.precioVenta=s,e.venta=s,e.precioRevendedor=c}),window.showToast&&window.showToast(`⚡ Costo y precios aplicados a los ${t.items.length} productos del lote`,`success`)};function nr(e,t){let n=window.wizardStateStore[e];if(!n||!n.items||n.items.length===0)return``;let r=n.items.length,i=n.items[t]||n.items[0],a=n.msgId||``,o=n.items.map((n,r)=>{let i=r===t,a=n.saved,o=(n.nombre||`Prod #${r+1}`).slice(0,14),s=`bg-slate-800/80 text-slate-400 border-slate-700/80 hover:bg-slate-700 hover:text-white`;return i?s=`bg-primary text-on-primary border-primary font-bold shadow-sm`:a&&(s=`bg-emerald-950/60 text-emerald-300 border-emerald-800/80 font-bold`),`
      <button type="button" onclick="window.wizardGoToStep('${e}', ${r})" 
        class="px-2.5 py-1 rounded-lg text-[10px] border shrink-0 flex items-center gap-1 transition-all ${s}">
        ${a?`<span class="material-symbols-outlined text-[12px] text-emerald-400">check_circle</span>`:``}
        <span>#${r+1} ${o}</span>
      </button>
    `}).join(``),s=``;s=i.imagen||i.foto_base64?`<img src="${(i.imagen||i.foto_base64).startsWith(`data:`)?i.imagen||i.foto_base64:`data:image/jpeg;base64,${i.imagen||i.foto_base64}`}" class="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl border border-slate-700 bg-slate-900 shrink-0 shadow-sm" />`:`
      <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-slate-800 border border-slate-700 flex flex-col items-center justify-center text-slate-400 shrink-0">
        <span class="material-symbols-outlined text-[24px]">smartphone</span>
      </div>
    `;let c=[];i.ram&&c.push(`<span class="px-2 py-0.5 rounded bg-violet-950/60 text-violet-300 border border-violet-800/50 font-bold">RAM: ${i.ram}</span>`),i.memoria&&c.push(`<span class="px-2 py-0.5 rounded bg-blue-950/60 text-blue-300 border border-blue-800/50 font-bold">ROM: ${i.memoria}</span>`),i.color&&c.push(`<span class="px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/50 font-bold">Color: ${i.color}</span>`),i.imei1&&c.push(`<span class="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/50 font-mono font-bold">IMEI: ${i.imei1}</span>`);let l=Number(i.costo)||0,u=l>0?l.toLocaleString(`es-CO`):``,d=l>0?Math.ceil(l*1.2/1e3)*1e3:Number(i.precioVenta||i.venta)||0,f=l>0?Math.ceil(Math.max(l*1.05,l+2e4)/1e3)*1e3:Number(i.precioRevendedor)||0,p=d>0?d.toLocaleString(`es-CO`):``,m=f>0?f.toLocaleString(`es-CO`):``,h=e=>`$${Number(e).toLocaleString(`es-CO`)}`,g=t===r-1,_=r===1;return`
    <div id="${e}" class="wizard-container space-y-3 bg-slate-900/95 text-white p-4 sm:p-5 rounded-2xl border border-slate-700/80 shadow-2xl" data-wizard-id="${e}" data-msg-id="${a}">
      <!-- Wizard Header -->
      <div class="flex items-center justify-between border-b border-slate-800 pb-3 gap-2">
        <div class="flex items-center gap-2 min-w-0">
          <div class="w-7 h-7 rounded-lg bg-primary/20 text-primary flex items-center justify-center font-bold text-xs shrink-0">
            <span class="material-symbols-outlined text-[16px]">smartphone</span>
          </div>
          <div class="min-w-0">
            <h4 class="text-xs font-black text-white tracking-tight truncate">${_?i.type===`crear_equipo`?`Registro de Celular con IMEI`:`Registro de Producto`:`Registro de Productos (${r})`}</h4>
            <p class="text-[10px] text-slate-400">${_?`Ingresa costo para calcular precio de venta en automático`:`Completando producto <span class="text-primary font-bold">${t+1}</span> de <span class="font-bold">${r}</span>`}</p>
          </div>
        </div>
        ${_?``:`
        <!-- Tabs -->
        <div class="flex items-center gap-1 overflow-x-auto max-w-[50%] sm:max-w-[60%] py-0.5">
          ${o}
        </div>
        `}
      </div>

      <!-- Current Step Product Card -->
      <div class="flex gap-3 bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 items-center">
        ${s}
        <div class="flex-1 min-w-0 space-y-1">
          <div class="flex items-center gap-2">
            <span class="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-primary/20 text-primary border border-primary/30 shrink-0">${i.marca||`Universal`}</span>
            <span class="text-[9px] font-bold uppercase tracking-wider text-slate-400">${i.type===`crear_equipo`?`Equipo IMEI`:`Inventario General`}</span>
          </div>
          <h5 class="text-xs sm:text-sm font-bold text-white leading-snug">${i.nombre||`Producto sin nombre`}</h5>
          <div class="flex flex-wrap gap-1 text-[9px] pt-0.5">
            ${c.join(``)}
          </div>
        </div>
      </div>

      <!-- Missing Inputs Grid -->
      <div class="space-y-3 pt-1">
        <!-- Input Costo -->
        <div>
          <div class="flex items-center justify-between mb-1">
            <label class="block text-[10px] font-black uppercase tracking-wider text-slate-400">1. Ingresa el Costo de Compra *</label>
            ${r>1?`
              <button type="button" onclick="window.wizardApplyToAll('${e}')" class="text-[9px] font-bold text-primary hover:underline flex items-center gap-0.5">
                <span class="material-symbols-outlined text-[11px]">bolt</span> Aplicar a los ${r}
              </button>
            `:``}
          </div>
          <div class="flex items-center bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 focus-within:border-primary">
            <span class="text-slate-400 font-bold text-sm mr-2">$</span>
            <input type="text" data-field="costo" placeholder="Escribe el costo (Ej: 450.000)" value="${u}" oninput="window.wizardOnCostoInput(this, '${e}')" class="w-full bg-transparent text-sm sm:text-base text-white font-mono font-bold outline-none" required autofocus />
          </div>
        </div>

        <!-- Matriz de Calificación Automática de Precios -->
        <div class="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-2.5">
          <div class="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-slate-400">
            <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[14px] text-primary">auto_graph</span> Precios Calculados en Automático:</span>
            <span class="text-emerald-400 font-bold">✓ Listo para guardar</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <!-- Calificación Revendedor -->
            <div class="bg-amber-950/20 border border-amber-800/40 p-2.5 rounded-xl space-y-1">
              <div class="flex items-center justify-between">
                <span class="text-[11px] font-bold text-amber-400 flex items-center gap-1">💼 Para Revendedor</span>
                <span class="text-[9px] px-1.5 py-0.5 rounded bg-amber-900/50 text-amber-300 font-bold">+5% / +$20k</span>
              </div>
              <div class="flex items-baseline justify-between">
                <span class="text-sm sm:text-base font-black text-white font-mono" data-preview="rev-price">${f>0?h(f):`$—`}</span>
                <span class="text-[10px] text-amber-300/80 font-mono" data-preview="rev-profit">${l>0?`Ganancia: +${h(f-l)}`:`+ $0`}</span>
              </div>
              <input type="hidden" data-field="precioRevendedor" value="${m}" />
            </div>

            <!-- Calificación Cliente Final -->
            <div class="bg-emerald-950/20 border border-emerald-800/40 p-2.5 rounded-xl space-y-1">
              <div class="flex items-center justify-between">
                <span class="text-[11px] font-bold text-emerald-400 flex items-center gap-1">🛍️ Para Cliente Final</span>
                <span class="text-[9px] px-1.5 py-0.5 rounded bg-emerald-900/50 text-emerald-300 font-bold">+20%</span>
              </div>
              <div class="flex items-baseline justify-between">
                <span class="text-sm sm:text-base font-black text-white font-mono" data-preview="final-price">${d>0?h(d):`$—`}</span>
                <span class="text-[10px] text-emerald-300/80 font-mono" data-preview="final-profit">${l>0?`Ganancia: +${h(d-l)}`:`+ $0`}</span>
              </div>
              <input type="hidden" data-field="precio" value="${p}" />
            </div>
          </div>

          <!-- Escalas de referencia rápida -->
          <div class="flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-900 font-mono flex-wrap gap-1">
            <span>Escala 15%: <b class="text-slate-200" data-preview="esc-15">${l>0?h(Math.ceil(l*1.15/1e3)*1e3):`$—`}</b></span>
            <span>Escala 25%: <b class="text-slate-200" data-preview="esc-25">${l>0?h(Math.ceil(l*1.25/1e3)*1e3):`$—`}</b></span>
            <span>Escala 30%: <b class="text-slate-200" data-preview="esc-30">${l>0?h(Math.ceil(l*1.3/1e3)*1e3):`$—`}</b></span>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          ${i.type===`crear_equipo`?`
          <div>
            <label class="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">IMEI Principal (15 dígitos)</label>
            <input type="text" data-field="imei1" placeholder="Ej: 356251200774692" value="${i.imei1||``}" maxlength="15" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs sm:text-sm text-white font-mono outline-none focus:border-primary" />
          </div>
          <div>
            <label class="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Color</label>
            <input type="text" data-field="color" placeholder="Ej: Azul, Negro" value="${i.color||``}" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs sm:text-sm text-white outline-none focus:border-primary" />
          </div>
          `:`
          <div>
            <label class="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Stock Inicial</label>
            <input type="number" data-field="stockActual" placeholder="1" value="${i.stockActual||1}" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs sm:text-sm text-white font-mono outline-none focus:border-primary" />
          </div>
          <div>
            <label class="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Color / Versión</label>
            <input type="text" data-field="color" placeholder="Ej: Azul, 128GB" value="${i.color||``}" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs sm:text-sm text-white outline-none focus:border-primary" />
          </div>
          `}
        </div>
      </div>

      <!-- Navigation & Action Buttons -->
      <div class="flex items-center ${_?`justify-end`:`justify-between`} pt-2 border-t border-slate-800 gap-2">
        ${_?``:`
        <button type="button" onclick="window.wizardGoToPrev('${e}')" ${t===0?`disabled`:``} class="px-3 py-2 text-xs font-bold text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none rounded-xl hover:bg-slate-800 transition-all flex items-center gap-1">
          <span class="material-symbols-outlined text-[16px]">arrow_back</span> Anterior
        </button>
        `}

        <div class="flex items-center gap-2">
          <button type="button" onclick="window.wizardSaveAndNext('${e}')" class="px-4 py-2 bg-primary text-on-primary text-xs font-bold rounded-xl hover:bg-primary/90 active:scale-95 transition-all shadow-md flex items-center gap-1.5">
            <span>${_?`Guardar Producto ✓`:g?`Guardar y Finalizar ✓`:`Guardar y Siguiente`}</span>
            <span class="material-symbols-outlined text-[16px]">${_||g?`check`:`arrow_forward`}</span>
          </button>
        </div>
      </div>
    </div>
  `}function rr(e,t){let n=`wizard-${Date.now()}`;window.wizardStateStore[n]={step:0,items:e.map(e=>({...e,costo:e.costo||``,precioVenta:e.precioVenta||e.venta||e.precio||``,venta:e.venta||e.precioVenta||e.precio||``,stockActual:e.stockActual===void 0?e.stock||1:e.stockActual,saved:!1}))};let r=t(`ai`,null,nr(n,0),null,!0);window.wizardStateStore[n]&&(window.wizardStateStore[n].msgId=r)}window.wizardGoToStep=(e,t)=>{let n=window.wizardStateStore[e];if(!n||t<0||t>=n.items.length)return;let r=document.getElementById(e);if(!r)return;let i=n.step,a=n.items[i],o=r.querySelector(`[data-field="costo"]`),s=r.querySelector(`[data-field="precio"]`),c=r.querySelector(`[data-field="precioRevendedor"]`),l=r.querySelector(`[data-field="imei1"]`),u=r.querySelector(`[data-field="stockActual"]`),d=r.querySelector(`[data-field="color"]`);if(o&&(a.costo=Number(o.value.replace(/\D/g,``))||a.costo),s){let e=Number(s.value.replace(/\D/g,``))||a.precioVenta;a.precioVenta=e,a.venta=e}c&&(a.precioRevendedor=Number(c.value.replace(/\D/g,``))||a.precioRevendedor),l&&l.value.trim()&&(a.imei1=l.value.trim()),u&&(a.stockActual=Number(u.value)||1),d&&(a.color=d.value.trim()),n.step=t,r.outerHTML=nr(e,n.step)},window.wizardGoToPrev=e=>{let t=window.wizardStateStore[e];!t||t.step<=0||window.wizardGoToStep(e,t.step-1)},window.wizardSaveAndNext=async e=>{let t=window.wizardStateStore[e];if(!t)return;let n=document.getElementById(e);if(!n)return;let r=t.step,i=t.items[r],a=n.querySelector(`[data-field="costo"]`),o=n.querySelector(`[data-field="precio"]`),s=n.querySelector(`[data-field="precioRevendedor"]`),c=n.querySelector(`[data-field="imei1"]`),l=n.querySelector(`[data-field="stockActual"]`),u=n.querySelector(`[data-field="color"]`),d=a?Number(a.value.replace(/\D/g,``)):0,f=o?Number(o.value.replace(/\D/g,``)):0,p=s?Number(s.value.replace(/\D/g,``)):0;if(d<=0||f<=0){a&&d<=0&&a.parentElement.classList.add(`border-red-500`),o&&f<=0&&o.parentElement.classList.add(`border-red-500`),window.showToast&&window.showToast(`Por favor ingresa el Costo y Precio de venta.`,`warning`);return}i.costo=d,i.precioVenta=f,i.venta=f,i.precioRevendedor=p,c&&c.value.trim()&&(i.imei1=c.value.trim()),l&&(i.stockActual=Number(l.value)||1),u&&(i.color=u.value.trim());let m=n.querySelector(`button.bg-primary`);m&&(m.disabled=!0,m.textContent=`Guardando...`);try{let a=tr(await P().catch(()=>[]),i),o=a?a.id:`PROD-${Date.now()}-${Math.floor(Math.random()*1e3)}`;if(!a)await At([o,i.nombre,i.marca||`Universal`,`Celulares`,`Físico`,i.costo,i.precioVenta,1,i.stockActual||1,i.ubicacion||`Vitrina`,i.sku||``,i.imagen||i.foto_base64||``,0]);else{let e=(a.stockActual||0)+(Number(i.stockActual)||1),t=a.sku||i.sku||``,n=a.imagen||i.imagen||i.foto_base64||``;await jt(a.id,[a.nombre,a.marca||i.marca||`Universal`,a.categoria||`Celulares`,a.tipo||`Físico`,i.costo>0?i.costo:a.costo,i.precioVenta>0?i.precioVenta:a.precioVenta,a.stockMinimo||1,e,a.ubicacion||`Vitrina`,t,n,a.fijado||0])}if(i.type===`crear_equipo`||i.imei1){let e=[];i.precioRevendedor&&i.precioRevendedor>0&&e.push(`Mayorista: $${Number(i.precioRevendedor).toLocaleString(`es-CO`)}`),i.notas&&e.push(i.notas),await Ft({imei1:i.imei1||`SN-${Date.now()}`,imei2:i.imei2||``,id_producto:o,marca:i.marca||``,nombre:i.nombre,proveedor:i.proveedor||``,costo:i.costo,venta:i.venta||i.precioVenta,precio_revendedor:Number(i.precioRevendedor||i.precio_revendedor||(i.costo?Math.ceil(Math.max(i.costo*1.05,i.costo+2e4)/1e3)*1e3:0)),estado:`Disponible`,color:i.color||``,ram:i.ram||``,memoria:i.memoria||``,condicion:i.condicion||`Nuevo`,notas:e.join(` • `)})}if(i.saved=!0,window.showToast&&window.showToast(`✅ Guardado: ${i.nombre}`,`success`),r<t.items.length-1)t.step=r+1,n.outerHTML=nr(e,t.step);else{let e=`
        <div class="bg-slate-900/95 text-white p-4 sm:p-5 rounded-2xl border border-emerald-500/50 shadow-2xl space-y-3">
          <div class="flex items-center gap-2.5 text-emerald-400">
            <span class="material-symbols-outlined text-[24px]">check_circle</span>
            <div>
              <h4 class="text-sm font-black text-white">¡Todos los productos (${t.items.length}) fueron registrados con éxito!</h4>
              <p class="text-[11px] text-emerald-300/80 font-medium">Fotos, especificaciones y precios guardados en el inventario</p>
            </div>
          </div>
          <div class="space-y-2 max-h-[300px] overflow-y-auto pr-1 divide-y divide-slate-800">
            ${t.items.map(e=>`
              <div class="flex items-center gap-3 pt-2">
                ${e.imagen||e.foto_base64?`<img src="${(e.imagen||e.foto_base64).startsWith(`data:`)?e.imagen||e.foto_base64:`data:image/jpeg;base64,`+(e.imagen||e.foto_base64)}" class="w-10 h-10 object-cover rounded-lg border border-slate-700 bg-slate-950 shrink-0" />`:`<div class="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 shrink-0"><span class="material-symbols-outlined text-[18px]">smartphone</span></div>`}
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-bold text-white truncate">${e.nombre}</p>
                  <p class="text-[10px] text-slate-400">${e.marca||``} ${e.ram?`• `+e.ram:``} ${e.memoria?`• `+e.memoria:``} ${e.color?`• `+e.color:``}</p>
                </div>
                <div class="text-right shrink-0">
                  <p class="text-xs font-black text-emerald-400">$${Number(e.precioVenta||e.venta||0).toLocaleString(`es-CO`)}</p>
                  <p class="text-[10px] text-slate-400">Costo: $${Number(e.costo||0).toLocaleString(`es-CO`)}</p>
                </div>
              </div>
            `).join(``)}
          </div>
        </div>
      `,r=n.closest(`[data-chat-bubble]`)||n.parentElement;r?r.innerHTML=e:n.outerHTML=e;let i=t.msgId||n.dataset?.msgId||n.closest(`[data-msg-id]`)?.dataset?.msgId;i&&window.updateStoredChatMessage&&window.updateStoredChatMessage(i,e),window.viewReloaders&&Object.keys(window.viewReloaders).forEach(e=>{let t=window.viewReloaders[e];if(typeof t==`function`)try{t()}catch(e){console.error(e)}})}}catch(e){A(`Error al guardar: `+e.message,`error`),m&&(m.disabled=!1,m.textContent=r===t.items.length-1?`Guardar y Finalizar ✓`:`Guardar y Siguiente`)}};function ir(e,t,n,r,i){let a=[];if(t.forEach(t=>{let n=e[t.name];(n==null||String(n).trim()===``||t.type===`number`&&Number(n)===0)&&a.push(t)}),a.length>0){let o=`form-missing-${Date.now()}`,s=encodeURIComponent(JSON.stringify(e)),c=`
      <div class="space-y-3">
        <p class="font-bold text-sm text-yellow-600 dark:text-yellow-400">
          ⚠️ Faltan datos obligatorios para ${r}:
        </p>
        <div id="${o}" class="space-y-2 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
    `;if(e.imagen||e.foto_base64){let t=(e.imagen||e.foto_base64).startsWith(`data:`)?e.imagen||e.foto_base64:`data:image/jpeg;base64,${e.imagen||e.foto_base64}`;c+=`
        <div class="flex items-center gap-3 bg-white dark:bg-slate-950 p-2 rounded-xl border border-slate-200 dark:border-slate-800 mb-2">
          <img src="${t}" class="w-12 h-12 object-cover rounded-lg border border-slate-200 dark:border-slate-700 shrink-0" />
          <div class="min-w-0">
            <p class="text-xs font-bold text-slate-900 dark:text-white truncate">${e.nombre||`Producto`}</p>
            <p class="text-[10px] text-slate-500 dark:text-slate-400">${e.marca||``} ${e.ram?`• `+e.ram:``} ${e.memoria?`• `+e.memoria:``} ${e.color?`• `+e.color:``}</p>
          </div>
        </div>
      `}return t.forEach(t=>{let n=a.includes(t),r=e[t.name]!==void 0&&e[t.name]!==null?e[t.name]:``;n?c+=`
          <div>
            <label class="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">${t.label} *</label>
            <input type="${t.type,`text`}" data-field="${t.name}" placeholder="${t.placeholder}" ${t.type===`number`?`oninput="window.wizardFormatCurrency(this)"`:``} class="w-full px-3 py-1.5 text-sm bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg focus:outline-none focus:border-primary text-slate-900 dark:text-white font-mono" required />
          </div>
        `:c+=`<input type="hidden" data-field="${t.name}" value="${r}" />`}),c+=`
          <div class="flex gap-2 justify-end mt-3">
            <button type="button" onclick="window.submitMissingActionData('${o}', '${i}', '${s}')" class="px-4 py-2 bg-primary text-on-primary text-xs font-bold rounded-lg hover:bg-primary/90 active:scale-95 transition-all shadow-md">
              Completar Registro
            </button>
          </div>
        </div>
      </div>
    `,n(`ai`,null,c,null,!0),!0}return!1}async function ar(e,t=null,n,r=null){if(!e)return;let i=Array.isArray(e)?e:[e];if(i.length===0)return;let a=t?Array.isArray(t)?t:[t]:[];i.forEach(e=>{if(a.length>0){let t=a[e.imagen_index!==void 0&&e.imagen_index!==null?Number(e.imagen_index):0]||a[0]||``;t&&(e.imagen=t,e.foto_base64=t)}});let o=n;n=(e,t,n,...r)=>{if(e===`system`&&t){t.startsWith(`[OK]`)?A(t.replace(`[OK]`,``).trim(),`success`):t.startsWith(`[Error]`)?A(t.replace(`[Error]`,``).trim(),`error`):console.log(`[IA System Log]:`,t);return}return o(e,t,n,...r)};let s=await P().catch(()=>[]);i.forEach(e=>{if(e.type===`crear_producto`||e.type===`crear_equipo`){let t=tr(s,e);if(t){let n=Number(t.costo)||0,r=Number(t.precioVenta||t.precio_venta)||0;(!e.costo||Number(e.costo)===0)&&n>0&&(e.costo=n),(!e.venta||Number(e.venta)===0)&&r>0&&(e.venta=r,e.precioVenta=r),e.id_producto||=t.id,!e.imagen&&t.imagen&&(e.imagen=t.imagen),!e.marca&&t.marca&&(e.marca=t.marca),!e.sku&&t.sku&&(e.sku=t.sku)}let n=Number(e.costo)||0,r=Number(e.venta||e.precioVenta||e.precio)||0;n>0&&r===0?(e.costo=n,e.venta=Math.ceil(n*1.2/1e3)*1e3,e.precioVenta=e.venta,e.precioRevendedor=Math.ceil(Math.max(n*1.05,n+2e4)/1e3)*1e3):r>0&&n===0?(e.costo=r,e.venta=Math.ceil(r*1.2/1e3)*1e3,e.precioVenta=e.venta,e.precioRevendedor=Math.ceil(Math.max(r*1.05,r+2e4)/1e3)*1e3):n>0&&r>0&&(e.costo=n,e.venta=r,e.precioVenta=r,e.precioRevendedor||=Math.ceil(Math.max(n*1.05,n+2e4)/1e3)*1e3)}});let c=i.filter(e=>e.type===`crear_producto`||e.type===`crear_equipo`),l=c.some(e=>!e.costo||Number(e.costo)===0);if(c.length>0&&l){rr(i,n);return}if(i.length>1&&c.length>1){let e=0;for(let t of i)await or(t,n),e++;let t=c[0]?.costo?Number(c[0].costo).toLocaleString(`es-CO`):``,r=c[0]?.venta?Number(c[0].venta).toLocaleString(`es-CO`):``;n(`ai`,null,`
      <div class="bg-slate-900/95 text-white p-4 rounded-2xl border border-emerald-500/50 shadow-2xl space-y-2">
        <div class="flex items-center gap-2.5 text-emerald-400">
          <span class="material-symbols-outlined text-[26px]">check_circle</span>
          <div>
            <h4 class="text-sm font-black text-white">¡${e} equipos guardados con éxito en la base de datos!</h4>
            <p class="text-[11px] text-emerald-300/80 font-medium">Costo unitario: $${t} | Precio venta calculado (+20%): $${r}</p>
          </div>
        </div>
      </div>
    `,null,!0);return}for(let e of i)await or(e,n)}async function or(e,t){if(!(!e||!e.type)){if(e.type===`registrar_egreso`){if(ir(e,[{name:`monto`,label:`Monto del Egreso`,type:`number`,placeholder:`Ej: 15000`},{name:`concepto`,label:`Concepto o Detalle`,type:`text`,placeholder:`Ej: Almuerzo de trabajo`},{name:`categoria`,label:`Categoría`,type:`text`,placeholder:`Ej: Suministros`},{name:`responsable`,label:`Responsable`,type:`text`,placeholder:`Ej: Juan`}],t,`registrar el egreso`,`registrar_egreso`))return;t(`system`,`Ejecutando acción: Registrar egreso por $${e.monto}...`);try{let n=typeof e.monto==`string`?Number(e.monto.replace(/\D/g,``)):Number(e.monto),r=await en({categoria:e.categoria||`Otros`,concepto:e.concepto||`Egreso vía IA`,responsable:e.responsable||`Asistente IA`,monto:isNaN(n)?0:n});r&&r.success?(A(`Egreso registrado con éxito`,`success`),t(`system`,`[OK] Egreso registrado: ${e.concepto} ($${e.monto})`)):t(`system`,`[Error] Error al registrar egreso: ${r.mensaje||`Error desconocido`}`)}catch(e){t(`system`,`[Error] Excepción al registrar egreso: ${e.message}`)}}else if(e.type===`crear_tarea`){if(ir(e,[{name:`tarea`,label:`Título de la Tarea`,type:`text`,placeholder:`Ej: Contabilizar todos los forros`},{name:`fecha_vencimiento`,label:`Fecha de Vencimiento`,type:`text`,placeholder:`Ej: YYYY-MM-DD`}],t,`crear la tarea`,`crear_tarea`))return;t(`system`,`Ejecutando acción: Crear tarea "${e.tarea}"...`);try{let n=await sn({tarea:e.tarea,fecha_inicio:e.fecha_inicio||new Date().toISOString().split(`T`)[0],fecha_vencimiento:e.fecha_vencimiento||new Date().toISOString().split(`T`)[0],prioridad:e.prioridad||`Media`,estado:`Pendiente`,responsable:e.responsable||``,notas:e.notas||`Creada por Asistente de Voz`,color:e.color||`#eab308`});n&&n.success?(A(`Tarea creada con éxito`,`success`),t(`system`,`[OK] Tarea creada: "${e.tarea}"`)):t(`system`,`[Error] Error al crear tarea: ${n.mensaje||`Error desconocido`}`)}catch(e){t(`system`,`[Error] Excepción al crear tarea: ${e.message}`)}}else if(e.type===`buscar_cliente`){t(`system`,`Ejecutando acción: Buscar cliente "${e.query}"...`);try{let n=await Et(),r=(e.query||``).toLowerCase().trim(),i=n.filter(e=>String(e.cedula||``).toLowerCase().includes(r)||String(e.nombre||``).toLowerCase().includes(r)||String(e.telefono||``).toLowerCase().includes(r));if(i.length===0)t(`ai`,``,`
          <p>No encontré clientes que coincidan con <strong>"${e.query}"</strong>.</p>
          <button class="mt-2 px-3 py-1.5 bg-primary text-on-primary text-[11px] font-bold rounded-lg hover:bg-primary/90 transition-all flex items-center gap-1 active:scale-95" onclick="window.assistantNavigateTo('clients')">
            <span class="material-symbols-outlined text-[14px]">person_add</span> Ver Clientes
          </button>
        `);else{let n=i.slice(0,3).map(e=>`
          <div class="p-2 bg-slate-50 border border-slate-100 rounded-lg flex flex-col gap-0.5 mt-1">
            <span class="font-bold text-slate-800">${e.nombre}</span>
            <span class="text-[10px] text-slate-500 font-mono">Doc: ${e.cedula} | Tel: ${e.telefono}</span>
            ${e.email?`<span class="text-[10px] text-slate-500 font-mono">Email: ${e.email}</span>`:``}
          </div>
        `).join(``),r=`btn-go-cli-${Date.now()}`;t(`ai`,``,`
          <p>He encontrado ${i.length} coincidencia${i.length>1?`s`:``} para <strong>"${e.query}"</strong>:</p>
          <div class="space-y-1 my-2">
            ${n}
            ${i.length>3?`<p class="text-[10px] text-slate-400 font-medium italic">Y ${i.length-3} más...</p>`:``}
          </div>
          <button id="${r}" class="px-3 py-1.5 bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold rounded-lg hover:bg-primary/20 transition-all flex items-center gap-1 active:scale-95 mt-2">
            <span class="material-symbols-outlined text-[14px]">open_in_new</span> Ver todos en Clientes
          </button>
        `),setTimeout(()=>{let t=document.getElementById(r);t&&t.addEventListener(`click`,()=>{localStorage.setItem(`clients_search_query`,e.query),f(`clients`)})},55)}}catch(e){t(`system`,`[Error] Error al consultar clientes: ${e.message}`)}}else if(e.type===`ir_a`)t(`system`,`Redirigiendo a: ${e.destino}...`),setTimeout(()=>{f(e.destino)},1e3);else if(e.type===`crear_cliente`){if(ir(e,[{name:`nombre`,label:`Nombre del Cliente`,type:`text`,placeholder:`Ej: Juan Pérez`},{name:`cedula`,label:`Cédula o NIT`,type:`text`,placeholder:`Ej: 1023456789`},{name:`direccion`,label:`Dirección`,type:`text`,placeholder:`Ej: Calle 10 #5-20`},{name:`telefono`,label:`Teléfono`,type:`text`,placeholder:`Ej: 3001234567`}],t,`registrar el cliente`,`crear_cliente`))return;t(`system`,`Creando cliente: ${e.nombre}...`);try{let n=await Dt({cedula:e.cedula,nombre:e.nombre,telefono:e.telefono||``,direccion:e.direccion||``,email:e.email||``,tipo:e.tipo||`Natural`});n&&n.success?(A(`Cliente creado con éxito`,`success`),t(`system`,`[OK] Cliente creado: ${e.nombre} (Cédula: ${e.cedula})`)):t(`system`,`[Error] Error al crear cliente: ${n.mensaje||`Error desconocido`}`)}catch(e){t(`system`,`[Error] Excepción al crear cliente: ${e.message}`)}}else if(e.type===`crear_producto`){if(ir(e,[{name:`nombre`,label:`Nombre del Producto`,type:`text`,placeholder:`Ej: Cargador Tipo C 20W`},{name:`costo`,label:`Costo del Producto`,type:`number`,placeholder:`Ej: 15000`},{name:`precioVenta`,label:`Precio de Venta`,type:`number`,placeholder:`Ej: 35000`},{name:`stockActual`,label:`Stock Inicial`,type:`number`,placeholder:`Ej: 5`}],t,`crear el producto "${e.nombre||`nuevo`}"`,`crear_producto`))return;t(`system`,`Agregando producto: ${e.nombre}...`);try{let n=e.id||`PROD-${Date.now()}`,r=e.nombre,i=(e.categoria||``).toLowerCase();if((i===`celular`||i===`celulares`)&&(e.ram||e.memoria||e.color)){let t=[];e.ram&&t.push(e.ram.toUpperCase().includes(`RAM`)?e.ram:`${e.ram} RAM`),e.memoria&&t.push(e.memoria),e.color&&t.push(e.color),t.length>0&&(r=`${e.nombre} (${t.join(` / `)})`)}let a=await At([n,r,e.marca||`Universal`,e.categoria||`Accesorios`,e.tipo||`Accesorio`,Number(e.costo||0),Number(e.precioVenta||0),Number(e.stockMinimo||2),Number(e.stockActual||0),e.ubicacion||``,e.sku||``,base64Image||e.imagen||``,0]);a&&a.success?(A(`Producto agregado con éxito`,`success`),t(`system`,`[OK] Producto agregado: ${r} ($${e.precioVenta})`)):t(`system`,`[Error] Error al crear producto: ${a.mensaje||`Error desconocido`}`)}catch(e){t(`system`,`[Error] Excepción al crear producto: ${e.message}`)}}else if(e.type===`crear_equipo`){if(ir(e,[{name:`nombre`,label:`Nombre/Modelo del Celular`,type:`text`,placeholder:`Ej: Samsung A15 128GB`},{name:`imei1`,label:`IMEI 1 (15 dígitos)`,type:`text`,placeholder:`Ej: 356251...`},{name:`costo`,label:`Costo de compra`,type:`number`,placeholder:`Ej: 450000`},{name:`venta`,label:`Precio de venta`,type:`number`,placeholder:`Ej: 650000`}],t,`registrar el celular "${e.nombre||`nuevo`}" con IMEI`,`crear_equipo`))return;t(`system`,`Registrando equipo IMEI: ${e.nombre}...`);try{let n=e.id_producto||``,r=e.nombre,i=[];if(e.ram&&i.push(e.ram.toUpperCase().includes(`RAM`)?e.ram:`${e.ram} RAM`),e.memoria&&i.push(e.memoria),e.color&&i.push(e.color),i.length>0&&(r=`${e.nombre} (${i.join(` / `)})`),!n){t(`system`,`Buscando o creando plantilla de producto para guardar la foto...`);let i=tr(await P(),{id_producto:e.id_producto||e.id,sku:e.sku,nombre:r||e.nombre,marca:e.marca||e.brand});if(i){n=i.id,t(`system`,`Plantilla existente vinculada: "${i.nombre}" (Ref: ${i.sku||`N/A`})`);let r=(Array.isArray(base64Image)?base64Image[0]:base64Image)||e.imagen||``,a=r&&(!i.imagen||i.imagen===``),o=e.sku&&(!i.sku||i.sku===``);(a||o)&&(t(`system`,`Actualizando imagen y referencia en la plantilla existente...`),await jt(i.id,[i.nombre,i.marca||`Universal`,i.categoria||`Celulares`,i.tipo||`Físico`,i.costo||0,i.precio_venta||0,i.stock_minimo||1,i.stock_actual||1,i.ubicacion||`Vitrina`,i.sku||e.sku||``,r||i.imagen||``,i.fijado||0]),r&&(i.imagen=r),e.sku&&(i.sku=e.sku))}else{n=`PROD-${Date.now()}`;let i=(Array.isArray(base64Image)?base64Image[0]:base64Image)||e.imagen||``;await At([n,r,e.marca||e.brand||`Universal`,`Celulares`,`Físico`,Number(e.costo||0),Number(e.venta||e.precioVenta||0),1,1,`Vitrina`,e.sku||``,i,0]),t(`system`,`[OK] Nueva plantilla de producto creada: "${r}".`)}}let a=await Ft({imei1:e.imei1,imei2:e.imei2||``,id_producto:n,marca:e.marca||e.brand||``,nombre:r,proveedor:e.proveedor||``,costo:Number(e.costo||0),venta:Number(e.venta||0),precio_revendedor:Number(e.precioRevendedor||e.precio_revendedor||(e.costo?Math.ceil(Math.max(Number(e.costo)*1.05,Number(e.costo)+2e4)/1e3)*1e3:0)),estado:e.estado||`Disponible`,color:e.color||``,ram:e.ram||``,memoria:e.memoria||``,condicion:e.condicion||`Nuevo`,notas:e.notas||``});a&&a.success?(A(`Equipo IMEI registrado con éxito`,`success`),t(`system`,`[OK] Equipo registrado: ${r} (IMEI: ${e.imei1})`)):t(`system`,`[Error] Error al registrar equipo: ${a.mensaje||`Error desconocido`}`)}catch(e){t(`system`,`[Error] Excepción al registrar equipo: ${e.message}`)}}else if(e.type===`crear_servicio_tecnico`){if(ir(e,[{name:`cliente`,label:`Nombre del Cliente`,type:`text`,placeholder:`Ej: Pedro Pérez`},{name:`equipo`,label:`Modelo del Equipo`,type:`text`,placeholder:`Ej: iPhone 13`},{name:`falla`,label:`Falla o Problema`,type:`text`,placeholder:`Ej: Pantalla rota`},{name:`precio_final`,label:`Precio de la reparación`,type:`number`,placeholder:`Ej: 120000`}],t,`crear la orden de servicio técnico`,`crear_servicio_tecnico`))return;t(`system`,`Creando orden de servicio técnico para: ${e.cliente}...`);try{let n=e.id_orden||`ST-${Date.now()}`,r=await Yt([n,e.cliente,e.telefono||``,e.equipo,e.imei_serie||``,e.falla,e.clave_patron||``,e.repuestos||``,Number(e.costo_taller||0),Number(e.abono||0),Number(e.precio_final||0),e.estado||`Recibido`,e.evidencias||``]);r&&r.success?(A(`Servicio técnico registrado con éxito`,`success`),t(`system`,`[OK] Orden ${n} creada para ${e.cliente} (${e.equipo})`)):t(`system`,`[Error] Error al crear servicio técnico: ${r.mensaje||`Error desconocido`}`)}catch(e){t(`system`,`[Error] Excepción al crear servicio técnico: ${e.message}`)}}else if(e.type===`crear_credito`){if(ir(e,[{name:`cliente`,label:`Nombre del Cliente`,type:`text`,placeholder:`Ej: María López`},{name:`total`,label:`Monto del Crédito`,type:`number`,placeholder:`Ej: 120000`},{name:`detalle`,label:`Detalle o Concepto`,type:`text`,placeholder:`Ej: Cuotas protector`}],t,`registrar el crédito`,`crear_credito`))return;t(`system`,`Registrando crédito para: ${e.cliente}...`);try{let n=await Ht({cliente:e.cliente,telefono:e.telefono||``,idFactura:e.idFactura||``,total:Number(e.total||0),detalle:e.detalle||`Crédito vía Asistente IA`});n&&n.success?(A(`Crédito registrado con éxito`,`success`),t(`system`,`[OK] Crédito registrado para ${e.cliente} por $${e.total}`)):t(`system`,`[Error] Error al registrar crédito: ${n.mensaje||`Error desconocido`}`)}catch(e){t(`system`,`[Error] Excepción al registrar crédito: ${e.message}`)}}else if(e.type===`crear_vale_fisico`){t(`system`,`Creando vale físico para: ${e.cliente}...`);try{let n=await mn({cliente:e.cliente,producto:e.producto||`Accesorio`,cantidad:Number(e.cantidad||1),monto:Number(e.monto||0),estado:e.estado||`Pendiente`,foto_base64:base64Image||e.foto_base64||``});n&&n.success?(A(`Vale físico registrado con éxito`,`success`),t(`system`,`[OK] Vale físico creado para ${e.cliente}: ${e.producto} ($${e.monto})`)):t(`system`,`[Error] Error al registrar vale físico: ${n.mensaje||`Error desconocido`}`)}catch(e){t(`system`,`[Error] Excepción al registrar vale físico: ${e.message}`)}}else if(e.type===`crear_reventa`){if(ir(e,[{name:`producto`,label:`Nombre del Producto`,type:`text`,placeholder:`Ej: Parlante Bluetooth`},{name:`costo`,label:`Costo del Proveedor`,type:`number`,placeholder:`Ej: 35000`},{name:`precio`,label:`Precio de Venta`,type:`number`,placeholder:`Ej: 60000`}],t,`registrar la reventa`,`crear_reventa`))return;t(`system`,`Creando reventa de: ${e.producto}...`);try{let n=await Gt({producto:e.producto,categoria:e.categoria||`Reventa`,costo:Number(e.costo||0),precio:Number(e.precio||0),proveedor:e.proveedor||``});n&&n.success?(A(`Reventa registrada con éxito`,`success`),t(`system`,`[OK] Reventa creada: ${e.producto} (Venta: $${e.precio})`)):t(`system`,`[Error] Error al crear reventa: ${n.mensaje||`Error desconocido`}`)}catch(e){t(`system`,`[Error] Excepción al crear reventa: ${e.message}`)}}else if(e.type===`actualizar_producto`){t(`system`,`Buscando producto a actualizar: "${e.nombre_actual}"...`);try{let n=await P(),r=(e.nombre_actual||``).toLowerCase().trim(),i=n.find(e=>(e.nombre||``).toLowerCase().trim()===r);if(!i){t(`system`,`[Error] No se encontró el producto "${e.nombre_actual}" en el inventario.`),A(`Producto "${e.nombre_actual}" no encontrado`,`error`);return}let a=e.nuevo_nombre||i.nombre,o=(i.categoria||``).toLowerCase();if((o===`celular`||o===`celulares`)&&(e.ram||e.memoria||e.color)){let t=e.nuevo_nombre||i.nombre.split(` (`)[0],n=[],r=e.ram||``,o=e.memoria||``,s=e.color||``;r&&n.push(r.toUpperCase().includes(`RAM`)?r:`${r} RAM`),o&&n.push(o),s&&n.push(s),a=n.length>0?`${t} (${n.join(` / `)})`:t}let s=e.costo===void 0?i.costo:Number(e.costo),c=e.precioVenta===void 0?i.precio_venta:Number(e.precioVenta),l=e.stockMinimo===void 0?i.stock_minimo:Number(e.stockMinimo),u=e.stockActual===void 0?i.stock_actual:Number(e.stockActual),d=e.sku===void 0?i.sku:e.sku,f=base64Image||i.imagen||``,p=[i.id,a,i.marca||`Universal`,i.categoria||`Accesorios`,i.tipo||`Accesorio`,s,c,l,u,i.ubicacion||``,d,f,i.fijado||0],m=await jt(i.id,p);m&&m.success?(A(`Producto actualizado con éxito`,`success`),t(`system`,`[OK] Producto "${i.nombre}" actualizado a "${a}".`)):t(`system`,`[Error] Error al actualizar producto: ${m.mensaje||`Error desconocido`}`)}catch(e){t(`system`,`[Error] Excepción al actualizar producto: ${e.message}`)}}else if(e.type===`crear_meta`){if(ir(e,[{name:`titulo`,label:`Título de la Meta`,type:`text`,placeholder:`Ej: Ventas del día`},{name:`monto_objetivo`,label:`Monto Objetivo`,type:`number`,placeholder:`Ej: 100000`}],t,`crear la meta financiera`,`crear_meta`))return;t(`system`,`Ejecutando acción: Crear meta "${e.titulo}" por $${e.monto_objetivo}...`);try{let n=typeof e.monto_objetivo==`string`?Number(e.monto_objetivo.replace(/\D/g,``)):Number(e.monto_objetivo),r=await yn({titulo:e.titulo||`Meta financiera`,monto_objetivo:isNaN(n)?0:n,tipo_calculo:e.tipo_calculo||`Ventas`,fecha_inicio:e.fecha_inicio||new Date().toISOString().split(`T`)[0],fecha_limite:e.fecha_limite||new Date().toISOString().split(`T`)[0],notas:e.notas||`Creada por Asistente de Voz`,estado:`Activa`});r&&r.success?(A(`Meta financiera creada con éxito`,`success`),t(`system`,`[OK] Meta creada: "${e.titulo}" por $${e.monto_objetivo}`)):t(`system`,`[Error] Error al crear meta: ${r.mensaje||`Error desconocido`}`)}catch(e){t(`system`,`[Error] Excepción al crear meta: ${e.message}`)}}else if(e.type===`crear_prestamo`){if(ir(e,[{name:`empleado`,label:`Nombre del Empleado`,type:`text`,placeholder:`Ej: Johan`},{name:`monto`,label:`Monto del Préstamo`,type:`number`,placeholder:`Ej: 100000`}],t,`registrar el préstamo de nómina`,`crear_prestamo`))return;t(`system`,`Ejecutando acción: Registrar préstamo a ${e.empleado} por $${e.monto}...`);try{let n=typeof e.monto==`string`?Number(e.monto.replace(/\D/g,``)):Number(e.monto),r=await gn({fecha:e.fecha||new Date().toISOString(),empleado:e.empleado,tipo:e.tipo_prestamo||`Dinero`,monto:isNaN(n)?0:n,producto_id:e.producto_id||``,producto_nombre:e.producto_nombre||``,cantidad:e.cantidad?Number(e.cantidad):0,estado:`Pendiente`,notas:e.notas||`Préstamo vía Asistente de Voz`});r&&r.success?(A(`Préstamo registrado con éxito`,`success`),t(`system`,`[OK] Préstamo registrado a ${e.empleado} por $${e.monto}`)):t(`system`,`[Error] Error al registrar préstamo: ${r.mensaje||`Error desconocido`}`)}catch(e){t(`system`,`[Error] Excepción al registrar préstamo: ${e.message}`)}}window.viewReloaders&&Object.keys(window.viewReloaders).forEach(e=>{let t=window.viewReloaders[e];if(typeof t==`function`)try{t()}catch(t){console.error(`Error recargando vista ${e}:`,t)}})}}window.submitMissingActionData=async(e,t,n)=>{let r=document.getElementById(e);if(!r)return;let i=JSON.parse(decodeURIComponent(n)),a=r.querySelectorAll(`input[data-field], select[data-field], textarea[data-field]`),o={...i},s=!1;if(a.forEach(e=>{let t=e.dataset.field,n=e.value.trim();if(e.hasAttribute(`required`)&&!n?(s=!0,e.classList.add(`border-red-500`)):e.classList.remove(`border-red-500`),e.type===`number`||e.dataset.type===`number`||t===`costo`||t===`precio`||t===`precioVenta`||t===`venta`||t===`monto`){let e=n.replace(/\D/g,``);n=e?Number(e):0}o[t]=n}),s){A(`Por favor, completa todos los campos obligatorios.`,`error`);return}let c=r.querySelector(`button`);c&&(c.disabled=!0,c.textContent=`Procesando...`);try{let e,n=``;if(t===`registrar_egreso`)e=await en({categoria:o.categoria||`Otros`,concepto:o.concepto||`Egreso vía IA`,responsable:o.responsable||`Asistente IA`,monto:Number(o.monto||0)}),n=`
        <div class="mt-2 bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-xl border border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
          ✅ Egreso registrado exitosamente por $${Number(o.monto).toLocaleString(`es-CO`)}.<br/>
          • Concepto: ${o.concepto}<br/>
          • Categoría: ${o.categoria||`Otros`}
        </div>
      `;else if(t===`crear_tarea`)e=await sn({tarea:o.tarea,fecha_inicio:o.fecha_inicio||new Date().toISOString().split(`T`)[0],fecha_vencimiento:o.fecha_vencimiento||new Date().toISOString().split(`T`)[0],prioridad:o.prioridad||`Media`,estado:`Pendiente`,responsable:o.responsable||``,notas:o.notas||`Creada por Asistente de Voz`,color:o.color||`#eab308`}),n=`
        <div class="mt-2 bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-xl border border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
          📌 Tarea "${o.tarea}" creada exitosamente.<br/>
          • Prioridad: ${o.prioridad||`Media`}<br/>
          • Vence: ${o.fecha_vencimiento||`Hoy`}
        </div>
      `;else if(t===`crear_cliente`)e=await Dt({cedula:o.cedula,nombre:o.nombre,telefono:o.telefono||``,direccion:o.direccion||``,email:o.email||``,tipo:o.tipo||`Natural`}),n=`
        <div class="mt-2 bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-xl border border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
          ✅ Cliente <strong>${o.nombre}</strong> registrado exitosamente.<br/>
          • Cédula/NIT: ${o.cedula}<br/>
          • Dirección: ${o.direccion}
        </div>
      `;else if(t===`crear_producto`)e=await At([o.id||`PROD-${Date.now()}`,o.nombre,o.marca||`Universal`,o.categoria||`Accesorios`,o.tipo||`Accesorio`,Number(o.costo||0),Number(o.precioVenta||0),Number(o.stockMinimo||2),Number(o.stockActual||0),o.ubicacion||``,o.sku||``,o.imagen||``,0]),n=`
        <div class="mt-2 bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-xl border border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
          📦 Producto "${o.nombre}" agregado al inventario.<br/>
          • Venta: $${Number(o.precioVenta).toLocaleString(`es-CO`)} | Costo: $${Number(o.costo).toLocaleString(`es-CO`)}<br/>
          • Stock inicial: ${o.stockActual} unidades
        </div>
      `;else if(t===`crear_equipo`){let t=o.id_producto||``;if(!t)t=`PROD-${Date.now()}`,await At([t,o.nombre,o.marca||`Universal`,`Celulares`,`Físico`,Number(o.costo||0),Number(o.venta||0),1,1,`Vitrina`,o.sku||``,o.imagen||``,0]);else try{let e=(await P()).find(e=>e.id===t);e&&(!e.imagen||e.imagen===``)&&o.imagen&&await jt(e.id,[e.nombre,e.marca||`Universal`,e.categoria||`Celulares`,e.tipo||`Físico`,e.costo||0,e.precio_venta||0,e.stock_minimo||1,e.stock_actual||1,e.ubicacion||`Vitrina`,e.sku||``,o.imagen,e.fijado||0])}catch(e){console.error(`Error al actualizar foto en plantilla existente (form):`,e)}e=await Ft({imei1:o.imei1,imei2:o.imei2||``,id_producto:t,marca:o.marca||``,nombre:o.nombre,proveedor:o.proveedor||``,costo:Number(o.costo||0),venta:Number(o.venta||0),estado:o.estado||`Disponible`,color:o.color||``,ram:o.ram||``,memoria:o.memoria||``,condicion:o.condicion||`Nuevo`,notas:o.notas||``}),n=`
        <div class="mt-2 bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-xl border border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
          📱 Celular "${o.nombre}" registrado con éxito.<br/>
          • IMEI1: ${o.imei1}<br/>
          • Precio: $${Number(o.venta).toLocaleString(`es-CO`)}
        </div>
      `}else if(t===`crear_servicio_tecnico`){let t=`ST-${Date.now()}`;e=await Yt([t,o.cliente,o.telefono||``,o.equipo,o.imei_serie||``,o.falla,o.clave_patron||``,o.repuestos||``,Number(o.costo_taller||0),Number(o.abono||0),Number(o.precio_final||0),o.estado||`Recibido`,``]),n=`
        <div class="mt-2 bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-xl border border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
          🛠️ Orden de servicio ${t} creada para ${o.cliente}.<br/>
          • Equipo: ${o.equipo}<br/>
          • Falla: ${o.falla}
        </div>
      `}else t===`crear_credito`?(e=await Ht({cliente:o.cliente,telefono:o.telefono||``,idFactura:``,total:Number(o.total||0),detalle:o.detalle||`Crédito vía Asistente IA`}),n=`
        <div class="mt-2 bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-xl border border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
          💳 Crédito de $${Number(o.total).toLocaleString(`es-CO`)} registrado para ${o.cliente}.<br/>
          • Detalle: ${o.detalle}
        </div>
      `):t===`crear_reventa`?(e=await Gt({producto:o.producto,categoria:o.categoria||`Reventa`,costo:Number(o.costo||0),precio:Number(o.precio||0),proveedor:o.proveedor||``}),n=`
        <div class="mt-2 bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-xl border border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
          📈 Reventa registrada: ${o.producto}.<br/>
          • Venta: $${Number(o.precio).toLocaleString(`es-CO`)} | Costo: $${Number(o.costo).toLocaleString(`es-CO`)}
        </div>
      `):t===`crear_meta`?(e=await yn({titulo:o.titulo,monto_objetivo:Number(o.monto_objetivo||0),tipo_calculo:o.tipo_calculo||`Ventas`,fecha_inicio:o.fecha_inicio||new Date().toISOString().split(`T`)[0],fecha_limite:o.fecha_limite||new Date().toISOString().split(`T`)[0],notas:o.notas||`Creada por Asistente de Voz`,estado:`Activa`}),n=`
        <div class="mt-2 bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-xl border border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
          🎯 Meta "${o.titulo}" creada exitosamente.
        </div>
      `):t===`crear_prestamo`&&(e=await gn({fecha:o.fecha||new Date().toISOString(),empleado:o.empleado,tipo:o.tipo_prestamo||`Dinero`,monto:Number(o.monto||0),producto_id:o.producto_id||``,producto_nombre:o.producto_nombre||``,cantidad:o.cantidad?Number(o.cantidad):0,estado:`Pendiente`,notas:o.notas||`Préstamo vía Asistente de Voz`}),n=`
        <div class="mt-2 bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-xl border border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
          💵 Préstamo de $${Number(o.monto).toLocaleString(`es-CO`)} registrado para ${o.empleado}.
        </div>
      `);if(e&&e.success){A(`Registro completado con éxito`,`success`);let e=n||`
        <div class="mt-1 bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-xl border border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
          ✅ Registro completado exitosamente.
        </div>
      `,t=r.closest(`[data-chat-bubble]`)||r.parentElement;t?t.innerHTML=e:r.outerHTML=e;let i=r.dataset?.msgId||r.closest(`[data-msg-id]`)?.dataset?.msgId;i&&window.updateStoredChatMessage&&window.updateStoredChatMessage(i,e),window.viewReloaders&&Object.keys(window.viewReloaders).forEach(e=>{let t=window.viewReloaders[e];if(typeof t==`function`)try{t()}catch(e){console.error(e)}})}else A(e.mensaje||`Error al completar registro`,`error`),c&&(c.disabled=!1,c.textContent=`Completar Registro`)}catch(e){A(`Error de conexión: `+e.message,`error`),c&&(c.disabled=!1,c.textContent=`Completar Registro`)}};var sr=!1,cr=!1,lr=[],ur=null;function dr(){try{return JSON.parse(localStorage.getItem(`adminpro_chats_list`)||`[]`)}catch{return[]}}function fr(e){try{localStorage.setItem(`adminpro_chats_list`,JSON.stringify(e))}catch(e){console.error(`Error saving chats list:`,e)}}function pr(e){try{return JSON.parse(localStorage.getItem(`adminpro_chat_messages_`+e)||`[]`)}catch{return[]}}function mr(e,t){try{localStorage.setItem(`adminpro_chat_messages_`+e,JSON.stringify(t))}catch(e){console.error(`Error saving chat messages:`,e)}}function hr(){let e=dr();if(e.length===0){let t=localStorage.getItem(`adminpro_chat_history`);if(t)try{let n=JSON.parse(t);if(Array.isArray(n)&&n.length>0){let t=`chat_legacy`,r={id:t,title:`Conversación anterior`,updatedAt:Date.now()};e.push(r),fr(e),mr(t,n),localStorage.setItem(`adminpro_active_chat_id`,t)}}catch(e){console.error(`Error migrating legacy chat:`,e)}}}function gr(){hr();let e=localStorage.getItem(`adminpro_active_chat_id`);if(!e){let t=dr();if(t.length>0)e=t[0].id,localStorage.setItem(`adminpro_active_chat_id`,e);else{let t=Date.now();e=`chat_`+t,fr([{id:e,title:`Nuevo Chat`,updatedAt:t}]),mr(e,[]),localStorage.setItem(`adminpro_active_chat_id`,e)}}return e}function _r(){let e=document.getElementById(`chats-list-container`);if(!e)return;let t=dr(),n=localStorage.getItem(`adminpro_active_chat_id`);if(t.sort((e,t)=>t.updatedAt-e.updatedAt),t.length===0){e.innerHTML=`
      <div class="flex flex-col items-center justify-center py-10 text-center text-slate-400 dark:text-slate-500">
        <span class="material-symbols-outlined text-[36px] text-slate-300 dark:text-slate-600 mb-2">forum</span>
        <p class="text-xs font-bold text-slate-600 dark:text-slate-400">No hay chats guardados</p>
        <p class="text-[10px] text-slate-400 mt-0.5">Tus conversaciones con IA aparecerán aquí</p>
      </div>
    `;return}e.innerHTML=t.map(e=>{let t=e.id===n,r=new Date(e.updatedAt).toLocaleString(`es-ES`,{day:`2-digit`,month:`2-digit`,year:`numeric`,hour:`2-digit`,minute:`2-digit`});return`
      <div class="group flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${t?`bg-primary/10 border-primary/40 shadow-xs ring-1 ring-primary/20`:`bg-white dark:bg-slate-950/60 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/40`}" onclick="window.switchChatSession('${e.id}')">
        <div class="flex items-center gap-3 min-w-0 flex-1 pr-2">
          <div class="w-8 h-8 rounded-lg ${t?`bg-primary text-on-primary`:`bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400`} flex items-center justify-center shrink-0 shadow-xs">
            <span class="material-symbols-outlined text-[18px]">${t?`forum`:`chat_bubble_outline`}</span>
          </div>
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2">
              <p class="text-xs font-bold truncate ${t?`text-primary dark:text-primary-300`:`text-slate-800 dark:text-slate-100`}">${e.title}</p>
              ${t?`<span class="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-primary text-on-primary shrink-0">Activo</span>`:``}
            </div>
            <p class="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 font-medium flex items-center gap-1">
              <span class="material-symbols-outlined text-[11px]">schedule</span> ${r}
            </p>
          </div>
        </div>
        <button type="button" onclick="event.stopPropagation(); window.deleteChatSession('${e.id}')" 
          class="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-all flex items-center justify-center shrink-0 focus:outline-none opacity-70 group-hover:opacity-100" title="Eliminar conversación">
          <span class="material-symbols-outlined text-[18px]">delete</span>
        </button>
      </div>
    `}).join(``)}function vr(){let e=Date.now(),t=`chat_`+e,n={id:t,title:`Nuevo Chat`,updatedAt:e},r=dr();r.push(n),fr(r),mr(t,[]),localStorage.setItem(`adminpro_active_chat_id`,t),wr(),Tr(),A(`Nueva conversación iniciada`,`success`);let i=document.getElementById(`chats-history-modal`);i&&i.classList.add(`hidden`)}function yr(e){localStorage.setItem(`adminpro_active_chat_id`,e),wr(),Tr();let t=document.getElementById(`chats-history-modal`);t&&t.classList.add(`hidden`)}async function br(e){if(!await j(`Confirmación`,`¿Estás seguro de que deseas eliminar este chat?`))return;let t=dr();if(t=t.filter(t=>t.id!==e),fr(t),localStorage.removeItem(`adminpro_chat_messages_`+e),localStorage.getItem(`adminpro_active_chat_id`)===e)if(t.length>0)localStorage.setItem(`adminpro_active_chat_id`,t[0].id),wr(),Tr();else{let e=Date.now(),t=`chat_`+e;fr([{id:t,title:`Nuevo Chat`,updatedAt:e}]),mr(t,[]),localStorage.setItem(`adminpro_active_chat_id`,t),wr(),Tr()}_r()}function xr(){return pr(gr())}function Sr(e){let t=gr(),n=pr(t);n.push(e),mr(t,n);let r=dr(),i=r.findIndex(e=>e.id===t);if(i!==-1){if(r[i].updatedAt=Date.now(),e.sender===`user`&&(r[i].title===`Nuevo Chat`||r[i].title===`Conversación anterior`)){let t=(e.text||`Consulta con imágenes`).trim();r[i].title=t.length>25?t.slice(0,25)+`...`:t}fr(r)}}function Cr(e,t,n=null){try{let r=gr(),i=pr(r),a=i.find(t=>t.id===e||String(t.timestamp)===String(e));a&&(t!=null&&(a.htmlContent=t),n!=null&&(a.text=n),mr(r,i))}catch(e){console.error(`Error updating stored chat message:`,e)}}window.updateStoredChatMessage=Cr;function wr(){ur=null;let e=document.getElementById(`assistant-reply-container`),t=document.getElementById(`assistant-reply-text`);e&&e.classList.add(`hidden`),t&&(t.textContent=``)}function Tr(){let e=document.getElementById(`voice-chat-history`);if(!e)return;e.innerHTML=``;let t=xr();t.length!==0&&(t.forEach(e=>{Dr(e.sender,e.text,e.htmlContent,e.base64Image,!1,e.replyContext,e.timestamp,e.id)}),e.scrollTop=e.scrollHeight)}function Er(e){if(!e)return``;let t=e.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`);t=t.replace(/```([\s\S]*?)```/g,(e,t)=>`<pre class="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-lg overflow-x-auto font-mono text-xs my-2 text-slate-800 dark:text-slate-200">${t.trim()}</pre>`),t=t.replace(/`([^`]+)`/g,`<code class="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono text-xs text-pink-600 dark:text-pink-400">$1</code>`),t=t.replace(/\*\*([^*]+)\*\*/g,`<strong>$1</strong>`),t=t.replace(/__([^_]+)__/g,`<strong>$1</strong>`),t=t.replace(/\*([^*]+)\*/g,`<em>$1</em>`),t=t.replace(/_([^_]+)_/g,`<em>$1</em>`),t=t.replace(/^### (.*$)/gim,`<h4 class="font-bold text-sm mt-3 mb-1 text-slate-800 dark:text-slate-100">$1</h4>`),t=t.replace(/^## (.*$)/gim,`<h3 class="font-bold text-base mt-4 mb-1.5 text-slate-800 dark:text-slate-100">$1</h3>`),t=t.replace(/^# (.*$)/gim,`<h2 class="font-bold text-lg mt-4 mb-2 text-slate-800 dark:text-slate-100">$1</h2>`);let n=t.split(`
`),r=!1,i=[];for(let e=0;e<n.length;e++){let t=n[e],a=t.match(/^(\s*)[-*]\s+(.*)$/),o=t.match(/^(\s*)\d+\.\s+(.*)$/);a?(r||=(i.push(`<ul class="list-disc pl-5 space-y-1 my-2">`),`unordered`),i.push(`<li>${a[2]}</li>`)):o?(r||=(i.push(`<ol class="list-decimal pl-5 space-y-1 my-2">`),`ordered`),i.push(`<li>${o[2]}</li>`)):(r&&=(i.push(r===`unordered`?`</ul>`:`</ol>`),!1),i.push(t))}r&&i.push(r===`unordered`?`</ul>`:`</ol>`),t=i.join(`
`);let a=t.split(/(<\/pre>|<\/ul>|<\/ol>)/g);for(let e=0;e<a.length;e++)!a[e].includes(`<pre`)&&!a[e].includes(`<ul`)&&!a[e].includes(`<ol`)&&!a[e].includes(`<li>`)&&(a[e]=a[e].replace(/\n/g,`<br>`));return t=a.join(``),t}function Dr(e,t,n=null,r=null,i=!0,a=null,o=null,s=null){let c=document.getElementById(`voice-chat-history`);if(!c)return null;let l=o||Date.now(),u=s||`msg_${l}_${Math.random().toString(36).substr(2,6)}`,d=new Date(l).toLocaleTimeString([],{hour:`2-digit`,minute:`2-digit`});i&&Sr({id:u,sender:e,text:t,htmlContent:n,base64Image:r,replyContext:a,timestamp:l});let f=document.createElement(`div`);f.id=u,f.dataset.msgId=u;let p=e===`user`,m=e===`system`;f.className=p?`flex gap-3 max-w-[85%] sm:max-w-[75%] font-medium animate-in fade-in slide-in-from-bottom-2 duration-300 self-end flex-row-reverse`:`flex gap-3 max-w-[85%] sm:max-w-[75%] font-medium animate-in fade-in slide-in-from-bottom-2 duration-300 self-start`;let h=p?`bg-slate-800 text-white`:m?`bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200`:`bg-primary text-on-primary shadow-md shadow-primary/20`,g=p?`person`:m?`terminal`:`smart_toy`,_=``;if(r){let e=Array.isArray(r)?r:[r],t=``;for(let n=0;n<e.length;n++){let r=e[n],i=r.startsWith(`data:`)?r:`data:image/jpeg;base64,`+r;t+=`<img src="`+i+`" class="img-preview-clickable max-w-[200px] max-h-[150px] object-cover rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm cursor-pointer hover:opacity-90 transition-opacity" />`}_=`<div class="flex flex-wrap gap-2 mb-2">`+t+`</div>`}let v=``;a&&(v=`<div class="border-l-2 border-indigo-400/70 bg-indigo-100/30 dark:bg-indigo-900/20 px-2.5 py-1.5 rounded-lg text-xs text-indigo-900/80 dark:text-indigo-300/80 mb-1 max-w-full font-normal italic select-none">Respondiendo a: "`+(a.length>70?a.slice(0,70)+`...`:a)+`"</div>`);let y=n||(t?`<div class="leading-relaxed font-sans text-sm break-words space-y-1.5">`+Er(t)+`</div>`:``),b=p?`bg-primary text-on-primary rounded-2xl rounded-tr-xs shadow-md`:m?`bg-surface-container border border-surface-variant text-on-surface-variant rounded-xl font-mono text-xs`:`bg-surface-container-high border border-surface-variant text-on-surface rounded-2xl rounded-tl-xs shadow-sm`,x=``;p&&(x=`<div class="flex items-center gap-1 mt-1 justify-end opacity-70 hover:opacity-100 transition-opacity"><button type="button" class="btn-reply p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded text-[11px] flex items-center gap-1 focus:outline-none" title="Responder a este mensaje"><span class="material-symbols-outlined text-[13px]">reply</span></button><button type="button" class="btn-resend p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded text-[11px] flex items-center gap-1 focus:outline-none" title="Reenviar mensaje"><span class="material-symbols-outlined text-[13px]">send</span></button><button type="button" class="btn-rollback p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded text-[11px] flex items-center gap-1 focus:outline-none" title="Editar y reescribir desde aquí"><span class="material-symbols-outlined text-[13px]">edit</span></button></div>`);let S=p?`items-end`:`items-start`;if(f.innerHTML=`<div class="w-8 h-8 rounded-full `+h+` flex items-center justify-center shrink-0 text-sm font-bold shadow-sm"><span class="material-symbols-outlined text-[18px]">`+g+`</span></div><div class="flex flex-col `+S+` min-w-0 flex-1"><div data-chat-bubble data-msg-id="`+u+`" class="px-4 py-3 `+b+` max-w-full overflow-hidden">`+v+_+y+`</div><div class="flex items-center gap-2"><span class="text-[10px] text-slate-400 mt-1 font-sans px-1">`+d+`</span>`+x+`</div></div>`,p){let e=f.querySelector(`.btn-reply`),n=f.querySelector(`.btn-resend`),i=f.querySelector(`.btn-rollback`);e&&e.addEventListener(`click`,()=>window.activateReplyState(t||``)),n&&n.addEventListener(`click`,()=>window.resendUserMessage(t||``,r)),i&&i.addEventListener(`click`,()=>window.rollbackChatTo(l,t||``))}return c.appendChild(f),c.scrollTop=c.scrollHeight,u}async function Or(e,t=null,n=null){let r=document.createElement(`div`);r.id=`voice-loading-bubble`,r.className=`flex gap-3 max-w-[85%] self-start animate-in fade-in duration-300`,r.innerHTML=`<div class="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-md"><span class="material-symbols-outlined text-[18px] animate-spin">sync</span></div><div class="px-4 py-3 bg-surface-container-high border border-surface-variant text-on-surface rounded-2xl rounded-tl-xs shadow-sm flex items-center gap-2"><span class="text-xs font-semibold text-slate-600 dark:text-slate-300">Procesando con IA...</span></div>`;let i=document.getElementById(`voice-chat-history`);i&&(i.appendChild(r),i.scrollTop=i.scrollHeight);try{let i=e;n&&(i=`[Contexto de respuesta a un mensaje anterior del usuario: "`+n+`"]
`+e);let a=xr(),o=await Qn(i,t,a);if(r&&r.remove(),!o||typeof o!=`object`){Dr(`ai`,null,`<div><p class="text-red-600 dark:text-red-400">Lo siento, recibí una respuesta inválida del servidor de inteligencia artificial.</p><div class="flex flex-wrap gap-2 mt-3"><button onclick="window.retryLastAIRequest(this)" class="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 bg-red-100/50 dark:bg-red-950/30 px-3 py-1.5 rounded-lg active:scale-95 transition-all focus:outline-none">Reintentar</button><button onclick="window.editLastAIRequest(this)" class="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 bg-red-100/50 dark:bg-red-950/30 px-3 py-1.5 rounded-lg active:scale-95 transition-all focus:outline-none">Editar mensaje</button></div></div>`);return}let s=Dr(`ai`,o.response),c=o.actions||o.action;c&&await ar(c,t,Dr,s)}catch(e){console.error(`Error processing AI command:`,e),r&&r.remove(),Dr(`ai`,null,`<div><p class="text-red-600 dark:text-red-400">Error al comunicar con la IA: `+e.message+`</p><div class="flex flex-wrap gap-2 mt-3"><button onclick="window.retryLastAIRequest(this)" class="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 bg-red-100/50 dark:bg-red-950/30 px-3 py-1.5 rounded-lg active:scale-95 transition-all focus:outline-none">Reintentar</button><button onclick="window.editLastAIRequest(this)" class="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 bg-red-100/50 dark:bg-red-950/30 px-3 py-1.5 rounded-lg active:scale-95 transition-all focus:outline-none">Editar mensaje</button></div></div>`)}}function kr(){if(cr)return;cr=!0;let e=document.getElementById(`voice-mic-btn`),t=document.getElementById(`voice-pulse`);document.getElementById(`voice-status`);let n=document.getElementById(`voice-input`),r=document.getElementById(`voice-send-btn`);if(!e||!n||!r)return;let i=null,a=[],o=null;if(!document.getElementById(`voice-wave-styles`)){let e=document.createElement(`style`);e.id=`voice-wave-styles`,e.textContent=`
      @keyframes voice-wave-bar {
        0%, 100% { transform: scaleY(0.3); }
        50% { transform: scaleY(1); }
      }
      .animate-voice-wave {
        animation: voice-wave-bar 1.2s ease-in-out infinite;
        transform-origin: bottom;
      }
    `,document.head.appendChild(e)}function s(n){sr=n,n?(e.classList.remove(`bg-slate-100`,`dark:bg-slate-800`,`text-slate-700`,`dark:text-slate-200`),e.classList.add(`bg-red-600`,`text-white`,`animate-pulse`),t?.classList.remove(`hidden`),c()):(e.classList.remove(`bg-red-600`,`text-white`,`animate-pulse`),e.classList.add(`bg-slate-100`,`dark:bg-slate-800`,`text-slate-700`,`dark:text-slate-200`),t?.classList.add(`hidden`),l()),e.style.transform=``}function c(){document.getElementById(`voice-recording-card`)?.remove();let e=n.closest(`.max-w-4xl`);if(!e)return;let t=document.createElement(`div`);t.id=`voice-recording-card`,t.className=`max-w-4xl mx-auto bg-slate-900 dark:bg-slate-950 text-white rounded-2xl p-4 flex items-center justify-between shadow-2xl animate-in slide-in-from-bottom duration-300 gap-4 mb-3 border border-red-500/20`,t.innerHTML=`
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
    `,e.parentNode.insertBefore(t,e),document.getElementById(`cancel-record-btn`).addEventListener(`click`,u),document.getElementById(`stop-record-btn`).addEventListener(`click`,f);let r=Date.now();o=setInterval(()=>{let e=Math.floor((Date.now()-r)/1e3),t=String(Math.floor(e/60)).padStart(2,`0`),n=String(e%60).padStart(2,`0`),i=document.getElementById(`recording-timer`);i&&(i.textContent=`${t}:${n}`)},1e3)}function l(){o&&=(clearInterval(o),null),document.getElementById(`voice-recording-card`)?.remove()}async function u(){if(i){try{i.onstop=null,i.stop(),i.stream?.getTracks().forEach(e=>e.stop())}catch{}i=null}a=[],s(!1),A(`Grabación cancelada`,`info`)}async function d(){try{let e=await navigator.mediaDevices.getUserMedia({audio:!0});a=[];let t=``;for(let e of[`audio/webm;codecs=opus`,`audio/webm`,`audio/ogg;codecs=opus`,`audio/ogg`,`audio/mp4`,`audio/aac`,`audio/wav`])if(typeof MediaRecorder<`u`&&MediaRecorder.isTypeSupported&&MediaRecorder.isTypeSupported(e)){t=e;break}i=new MediaRecorder(e,t?{mimeType:t}:{}),i.ondataavailable=e=>{e.data.size>0&&a.push(e.data)},i.start(250),s(!0)}catch(e){console.error(`[Mic] Error al iniciar grabación:`,e),A(`No se pudo iniciar el micrófono. Revisa los permisos.`,`error`)}}async function f(){if(!i)return;let e=document.getElementById(`stop-record-btn`),t=document.getElementById(`cancel-record-btn`);e&&(e.disabled=!0),t&&(t.disabled=!0);let r=document.getElementById(`recording-timer`);r&&(r.textContent=`Procesando...`),await new Promise(e=>{i.onstop=e,i.stop(),i.stream?.getTracks().forEach(e=>e.stop())});let o=i.mimeType||`audio/webm`,c=new Blob(a,{type:o});if(a=[],i=null,l(),s(!1),c.size<500){A(`Grabación muy corta, intenta de nuevo.`,`warning`);return}let u=document.createElement(`div`);u.id=`voice-transcribing-bubble`,u.className=`flex gap-3 max-w-[85%] self-start animate-in fade-in duration-300`,u.innerHTML=`
      <div class="w-8 h-8 rounded-full bg-slate-600 text-white flex items-center justify-center shrink-0 shadow-md">
        <span class="material-symbols-outlined text-[18px] animate-spin">sync</span>
      </div>
      <div class="px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-2xl rounded-tl-xs shadow-sm flex items-center gap-2">
        <span class="text-xs font-semibold">Transcribiendo tu voz con Whisper...</span>
      </div>
    `;let d=document.getElementById(`voice-chat-history`);d&&(d.appendChild(u),d.scrollTop=d.scrollHeight);try{let e=await new Promise((e,t)=>{let n=new FileReader;n.onloadend=()=>e(n.result.split(`,`)[1]),n.onerror=t,n.readAsDataURL(c)}),{getOpenRouterApiKey:t}=await _(async()=>{let{getOpenRouterApiKey:e}=await Promise.resolve().then(()=>Ke);return{getOpenRouterApiKey:e}},void 0,import.meta.url),r=t(),i=`webm`;o.includes(`mp4`)||o.includes(`m4a`)?i=`mp4`:o.includes(`ogg`)?i=`ogg`:o.includes(`wav`)?i=`wav`:o.includes(`aac`)&&(i=`aac`);let a=await fetch(`https://openrouter.ai/api/v1/audio/transcriptions`,{method:`POST`,headers:{Authorization:`Bearer ${r}`,"Content-Type":`application/json`},body:JSON.stringify({model:`openai/whisper-large-v3-turbo`,input_audio:{data:e,format:i}})});if(u.remove(),!a.ok){let e=await a.text();console.error(`[Whisper] Error:`,a.status,e),A(`Error al transcribir (${a.status})`,`error`);return}let s=(await a.json()).text?.trim()||``;if(!s){A(`No se detectó ninguna palabra en tu audio.`,`warning`);return}n.value=s,n.focus(),A(`Audio transcribido con éxito.`,`success`),console.log(`[Whisper] Transcripción exitosa:`,s)}catch(e){u.remove(),console.error(`[Whisper] Error:`,e),A(`Error de conexión al transcribir: `+e.message,`error`)}}e.addEventListener(`pointerup`,e=>{e.preventDefault(),sr?f():d()}),e.addEventListener(`pointerdown`,t=>{t.preventDefault(),e.style.transform=`scale(0.92)`}),e.addEventListener(`pointerleave`,()=>{e.style.transform=``}),window.addEventListener(`hashchange`,()=>{window.location.hash!==`#assistant`&&sr&&f()});let p=document.getElementById(`assistant-file-camera`),m=document.getElementById(`assistant-file-gallery`),h=document.getElementById(`assistant-image-preview-container`),g=document.getElementById(`assistant-image-preview-list`),v=document.getElementById(`assistant-image-clear-all-btn`),y=()=>{if(!h||!g)return;if(lr.length===0){h.classList.add(`hidden`),g.innerHTML=``;return}let e=``;for(let t=0;t<lr.length;t++){let n=lr[t];e+=`<div class="relative group shrink-0"><img src="`+n+`" class="w-14 h-14 object-cover rounded-lg border border-surface-variant shadow-sm" /><button type="button" data-index="`+t+`" class="remove-img-btn absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center shadow-md text-xs hover:bg-red-700 transition-colors"><span class="material-symbols-outlined text-[14px]">close</span></button></div>`}g.innerHTML=e,h.classList.remove(`hidden`),g.querySelectorAll(`.remove-img-btn`).forEach(e=>{e.addEventListener(`click`,e=>{let t=parseInt(e.currentTarget.dataset.index,10);lr.splice(t,1),y()})})};v&&v.addEventListener(`click`,()=>{lr=[],y()});let b=async e=>{let t=Array.from(e.target.files||[]);if(t.length!==0){A(`Procesando `+t.length+` imagen(es)...`,`info`);for(let e of t)try{let t=await ot(await new Promise((t,n)=>{let r=new FileReader;r.onload=e=>t(e.target.result),r.onerror=e=>n(Error(`Error leyendo el archivo`)),r.readAsDataURL(e)}),800,800,.7);lr.push(t)}catch(t){console.error(`Error comprimiendo imagen:`,t),A(`Error procesando imagen: `+e.name,`error`)}y(),e.target.value=``}};p&&p.addEventListener(`change`,b),m&&m.addEventListener(`change`,b);let x=async()=>{let e=n.value.trim();if(!e&&lr.length===0)return;let t=[...lr],r=ur;n.value=``,lr=[],y(),wr(),Dr(`user`,e,null,t.length>0?t:null,!0,r),await Or(e,t.length>0?t:null,r)};r.addEventListener(`click`,x),n.addEventListener(`keydown`,e=>{e.key===`Enter`&&!e.shiftKey&&(e.preventDefault(),x())});let S=document.getElementById(`assistant-reply-close-btn`);S&&S.addEventListener(`click`,wr);let C=document.getElementById(`show-chats-list-btn`),ee=document.getElementById(`clear-chat-history-btn`),w=document.getElementById(`chats-history-modal`),te=document.getElementById(`chats-history-modal-close-btn`);C&&w&&C.addEventListener(`click`,()=>{_r(),w.classList.remove(`hidden`),w.classList.add(`flex`)}),ee&&ee.addEventListener(`click`,()=>{vr()}),te&&w&&te.addEventListener(`click`,()=>{w.classList.add(`hidden`),w.classList.remove(`flex`)})}var Ar={text:``,images:null,replyContext:null};window.assistantPreFill=e=>{let t=document.getElementById(`voice-input`);t&&(t.value=e,t.focus())},window.useQuickPrompt=e=>{let t=document.getElementById(`voice-input`);if(t){t.value=e,t.focus();let n=e.indexOf(`:`);if(n!==-1){let r=e.charAt(n+1)===` `?n+2:n+1;t.setSelectionRange(r,r)}else t.setSelectionRange(e.length,e.length)}},window.assistantNavigateTo=(e,t=null)=>{t&&localStorage.setItem(`clients_search_query`,t),f(e)},window.dashNavigateTo=window.assistantNavigateTo,window.retryLastAIRequest=async e=>{if(!Ar||!Ar.text&&(!Ar.images||Ar.images.length===0)){A(`No hay ninguna petición anterior para reintentar`,`error`),e&&e.remove();return}let t=Ar.text,n=Ar.images,r=Ar.replyContext;e&&e.remove(),await Or(t,n,r)},window.editLastAIRequest=e=>{if(!Ar||!Ar.text){A(`No hay ninguna petición anterior para editar`,`error`);return}let t=document.getElementById(`voice-input`);t&&(t.value=Ar.text,t.focus())},window.resendUserMessage=async(e,t)=>{Dr(`user`,e,null,t,!0,null),await Or(e,t,null)},window.activateReplyState=e=>{let t=document.getElementById(`assistant-reply-container`),n=document.getElementById(`assistant-reply-text`);t&&n&&(n.textContent=e.length>80?e.slice(0,80)+`...`:e,t.classList.remove(`hidden`));let r=document.getElementById(`voice-input`);r&&r.focus()},window.clearReplyState=wr,window.startNewChatSession=vr,window.switchChatSession=yr,window.deleteChatSession=br,window.rollbackChatTo=(e,t)=>{try{let n=xr(),r=n.findIndex(t=>Number(t.timestamp)===Number(e));r!==-1&&(n.splice(r),mr(gr(),n));let i=document.getElementById(`voice-input`);i&&(i.value=t||``,i.focus()),wr(),Tr()}catch(e){console.error(`Error en rollbackChatTo:`,e)}};function jr(){return async()=>{kr(),Tr()}}var Mr=[],Nr=!1,Pr=null,Fr=`Todos`,Ir,Lr,Rr,zr,Br,Vr,Hr;async function Ur(){if(Wr(),!Nr)try{Mr=await Et(),Nr=!0}catch(e){console.error(`Error loading clients for selector`,e)}}function Wr(){document.getElementById(`customer-selector-modal`)||(document.body.insertAdjacentHTML(`beforeend`,`
    <div id="customer-selector-modal" class="hidden fixed inset-0 z-[70] items-center justify-center p-4">
      <div id="cs-backdrop" class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] flex flex-col overflow-hidden z-10">
        <!-- Header -->
        <div class="flex items-center justify-between px-5 py-4 bg-surface-container-lowest border-b border-surface-variant shrink-0">
          <h3 class="font-bold text-lg text-on-surface">Seleccionar Cliente</h3>
          <button id="cs-close" class="p-1.5 text-on-surface-variant hover:bg-surface-container rounded-lg">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <!-- Search & Filter Area -->
        <div id="cs-search-area" class="p-4 border-b border-surface-variant shrink-0 flex flex-col gap-3">
          <div class="flex gap-2">
            <div class="relative flex-1">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
              <input id="cs-search" type="text" placeholder="Buscar documento, nombre..." autocomplete="off"
                class="w-full bg-surface-container-low border border-surface-variant rounded-xl pl-10 pr-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm" />
            </div>
            <button id="cs-new-btn" title="Nuevo Cliente" class="px-3 bg-primary text-on-primary rounded-xl hover:bg-primary-container transition-colors shadow-sm flex items-center justify-center">
              <span class="material-symbols-outlined text-[20px]">person_add</span>
            </button>
          </div>
          
          <!-- Scrollable M3 Filter Chips -->
          <div class="flex gap-1.5 overflow-x-auto pb-0.5 no-scrollbar scroll-smooth" style="scrollbar-width: none; -ms-overflow-style: none;">
            <button type="button" data-filter="Todos" class="cs-filter-chip shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border border-primary bg-primary text-on-primary shadow-sm flex items-center gap-1">
              <span class="material-symbols-outlined text-[14px]">checklist</span>
              <span>Todos</span>
            </button>
            <button type="button" data-filter="General" class="cs-filter-chip shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border border-surface-variant bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface flex items-center gap-1">
              <span class="material-symbols-outlined text-[14px]">person</span>
              <span>General</span>
            </button>
            <button type="button" data-filter="VIP" class="cs-filter-chip shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border border-surface-variant bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface flex items-center gap-1">
              <span class="material-symbols-outlined text-[14px]">star</span>
              <span>VIP</span>
            </button>
            <button type="button" data-filter="Empresa" class="cs-filter-chip shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border border-surface-variant bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface flex items-center gap-1">
              <span class="material-symbols-outlined text-[14px]">domain</span>
              <span>Empresa</span>
            </button>
            <button type="button" data-filter="Mayorista" class="cs-filter-chip shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border border-surface-variant bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface flex items-center gap-1">
              <span class="material-symbols-outlined text-[14px]">storefront</span>
              <span>Mayorista</span>
            </button>
          </div>
        </div>

        <!-- New Client Form (Hidden by default) -->
        <div id="cs-new-form-area" class="hidden p-4 border-b border-surface-variant bg-surface-container-lowest shrink-0">
          <p class="text-xs font-bold text-primary mb-3 uppercase tracking-wider">Crear Cliente Rápido</p>
          <div class="space-y-3">
             <div>
                <input id="cs-new-doc" type="text" placeholder="Documento *" class="w-full bg-surface-container-low border border-surface-variant rounded-lg px-3 py-2 text-sm text-on-surface focus:border-primary outline-none" />
             </div>
             <div>
                <input id="cs-new-nom" type="text" placeholder="Nombre completo *" class="w-full bg-surface-container-low border border-surface-variant rounded-lg px-3 py-2 text-sm text-on-surface focus:border-primary outline-none" />
             </div>
             <div class="grid grid-cols-2 gap-2">
                <input id="cs-new-tel" type="text" placeholder="Teléfono" class="w-full bg-surface-container-low border border-surface-variant rounded-lg px-3 py-2 text-sm text-on-surface focus:border-primary outline-none" />
                <input id="cs-new-email" type="email" placeholder="Email" class="w-full bg-surface-container-low border border-surface-variant rounded-lg px-3 py-2 text-sm text-on-surface focus:border-primary outline-none" />
             </div>
             <div>
                <input id="cs-new-dir" type="text" placeholder="Dirección" class="w-full bg-surface-container-low border border-surface-variant rounded-lg px-3 py-2 text-sm text-on-surface focus:border-primary outline-none" />
             </div>
             <div class="flex gap-2 items-center">
                <div id="cs-new-tipo-container" class="custom-select-container relative flex-1">
                  <input type="hidden" id="cs-new-tipo" value="General" />
                  <button type="button" class="custom-select-trigger w-full bg-surface-container border border-surface-variant rounded-lg px-3 py-2 text-sm font-semibold text-on-surface focus:outline-none focus:border-primary flex items-center justify-between shadow-sm active:scale-[0.99] transition-all">
                    <div class="flex items-center gap-2">
                      <span class="material-symbols-outlined text-[18px] text-slate-500">person</span>
                      <span class="selected-label">General</span>
                    </div>
                    <span class="material-symbols-outlined text-[18px] text-slate-400">keyboard_arrow_down</span>
                  </button>
                  <div class="custom-select-options hidden absolute left-0 right-0 bottom-full mb-1 bg-surface-container-high border border-surface-variant rounded-xl shadow-2xl z-50 overflow-hidden py-1">
                    <div data-value="General" class="custom-option px-4 py-2.5 text-sm font-semibold text-on-surface hover:bg-surface-variant/20 flex items-center gap-3 cursor-pointer transition-colors">
                      <span class="material-symbols-outlined text-[18px] text-slate-400">person</span>
                      <span class="flex-1">General</span>
                      <span class="material-symbols-outlined text-[16px] text-primary check-icon">check_circle</span>
                    </div>
                    <div data-value="VIP" class="custom-option px-4 py-2.5 text-sm font-semibold text-on-surface hover:bg-surface-variant/20 flex items-center gap-3 cursor-pointer transition-colors">
                      <span class="material-symbols-outlined text-[18px] text-slate-400">star</span>
                      <span class="flex-1">VIP</span>
                      <span class="material-symbols-outlined text-[16px] text-primary check-icon hidden">check_circle</span>
                    </div>
                    <div data-value="Empresa" class="custom-option px-4 py-2.5 text-sm font-semibold text-on-surface hover:bg-surface-variant/20 flex items-center gap-3 cursor-pointer transition-colors">
                      <span class="material-symbols-outlined text-[18px] text-slate-400">business</span>
                      <span class="flex-1">Empresa</span>
                      <span class="material-symbols-outlined text-[16px] text-primary check-icon hidden">check_circle</span>
                    </div>
                    <div data-value="Mayorista" class="custom-option px-4 py-2.5 text-sm font-semibold text-on-surface hover:bg-surface-variant/20 flex items-center gap-3 cursor-pointer transition-colors">
                      <span class="material-symbols-outlined text-[18px] text-slate-400">store</span>
                      <span class="flex-1">Mayorista</span>
                      <span class="material-symbols-outlined text-[16px] text-primary check-icon hidden">check_circle</span>
                    </div>
                  </div>
                </div>
                <button id="cs-save-new" class="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-container whitespace-nowrap self-stretch">Guardar</button>
                <button id="cs-cancel-new" class="px-3 bg-surface-variant text-on-surface text-sm rounded-lg hover:bg-surface-container-high self-stretch">x</button>
             </div>
          </div>
        </div>

        <!-- Results List -->
        <div class="flex-1 overflow-y-auto p-2 bg-surface-container-lowest">
          <ul id="cs-results" class="divide-y divide-surface-variant/40">
            <li class="p-4 text-center text-sm text-on-surface-variant">Escribe para buscar o crea uno nuevo</li>
          </ul>
        </div>
      </div>
    </div>
  `),Ir=document.getElementById(`customer-selector-modal`),Lr=document.getElementById(`cs-backdrop`),Rr=document.getElementById(`cs-close`),zr=document.getElementById(`cs-search`),Br=document.getElementById(`cs-new-btn`),Vr=document.getElementById(`cs-results`),Hr=document.getElementById(`cs-new-form-area`),Rr.addEventListener(`click`,Xr),Lr.addEventListener(`click`,Xr),zr.addEventListener(`input`,Gr),Br.addEventListener(`click`,()=>{Hr.classList.toggle(`hidden`),document.getElementById(`cs-new-doc`).focus()}),document.getElementById(`cs-cancel-new`).addEventListener(`click`,()=>{Hr.classList.add(`hidden`)}),document.querySelectorAll(`.cs-filter-chip`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.filter;Fr=t,document.querySelectorAll(`.cs-filter-chip`).forEach(e=>{e.dataset.filter===t?(e.classList.remove(`bg-surface-container-low`,`text-on-surface-variant`,`hover:bg-surface-container-high`,`hover:text-on-surface`),e.classList.add(`bg-primary`,`text-on-primary`,`border-primary`)):(e.classList.add(`bg-surface-container-low`,`text-on-surface-variant`,`hover:bg-surface-container-high`,`hover:text-on-surface`),e.classList.remove(`bg-primary`,`text-on-primary`,`border-primary`))}),Kr()})}),document.getElementById(`cs-save-new`).addEventListener(`click`,async()=>{let e=document.getElementById(`cs-new-doc`).value.trim(),t=document.getElementById(`cs-new-nom`).value.trim(),n=document.getElementById(`cs-new-tel`).value.trim(),r=document.getElementById(`cs-new-email`).value.trim(),i=document.getElementById(`cs-new-dir`).value.trim(),a=document.getElementById(`cs-new-tipo`).value;if(!e||!t){A(`Documento y Nombre son obligatorios`,`warning`);return}let o=document.getElementById(`cs-save-new`);o.disabled=!0,o.textContent=`...`;try{let o=await Dt({documento:e,cedula:e,nombre:t,telefono:n,direccion:i,email:r,tipo:a});if(o&&o.success){A(`Cliente creado`,`success`);let o={cedula:e,documento:e,nombre:t,telefono:n,direccion:i,email:r,tipo:a,id:e};Mr.push(o),Hr.classList.add(`hidden`),document.getElementById(`cs-new-doc`).value=``,document.getElementById(`cs-new-nom`).value=``,document.getElementById(`cs-new-tel`).value=``,document.getElementById(`cs-new-email`).value=``,document.getElementById(`cs-new-dir`).value=``,document.getElementById(`cs-new-tipo`).value=`General`,window.syncCustomSelectUI(`cs-new-tipo-container`,`General`),Jr(o)}else A(o.mensaje||`Error al crear`,`error`)}catch{A(`Error de conexión`,`error`)}finally{o.disabled=!1,o.textContent=`Guardar`}}),window.setupCustomSelect(`cs-new-tipo-container`,`cs-new-tipo`))}function Gr(){Kr()}function Kr(){let e=zr.value.toLowerCase().trim(),t=Mr;if(Fr!==`Todos`&&(t=t.filter(e=>(e.tipo||`General`)===Fr)),e&&(t=t.filter(t=>(t.cedula||t.documento||``).toLowerCase().includes(e)||t.nombre&&t.nombre.toLowerCase().includes(e)||t.telefono&&t.telefono.toLowerCase().includes(e))),t.length===0){Vr.innerHTML=`<li class="p-4 text-center text-sm text-on-surface-variant">No se encontraron clientes.</li>`;return}qr(!e&&Fr===`Todos`?[...t].reverse().slice(0,20):t.slice(0,20))}function qr(e){Vr.innerHTML=e.map(e=>{let t=e.cedula||e.documento||``,n=e.tipo||`General`,r=`person`,i=`bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400`,a=`bg-slate-100 text-slate-700 border-slate-200`;return n===`VIP`?(r=`star`,i=`bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300`,a=`bg-purple-50 text-purple-700 border-purple-200`):n===`Empresa`?(r=`domain`,i=`bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300`,a=`bg-indigo-50 text-indigo-700 border-indigo-200`):n===`Mayorista`&&(r=`storefront`,i=`bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300`,a=`bg-green-50 text-green-700 border-green-200`),`
    <li>
      <button type="button" class="cs-item-btn w-full text-left px-4 py-3 hover:bg-surface-container-low transition-colors flex items-center gap-3 focus:bg-surface-container-low outline-none" data-doc="${t}">
        <!-- Avatar/Icon -->
        <div class="w-9 h-9 rounded-full ${i} flex items-center justify-center shrink-0">
          <span class="material-symbols-outlined text-[20px]">${r}</span>
        </div>
        
        <!-- Info -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between gap-2">
            <span class="font-bold text-sm text-on-surface truncate">${e.nombre}</span>
            <!-- Badge -->
            <span class="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${a} shrink-0">${n}</span>
          </div>
          <span class="text-[11px] text-on-surface-variant mt-0.5 block truncate">C.C: ${t} ${e.telefono?`• Tel: `+e.telefono:``}</span>
        </div>
      </button>
    </li>
  `}).join(``),document.querySelectorAll(`.cs-item-btn`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.doc,n=Mr.find(e=>(e.cedula||e.documento||``)===t);n&&(n.documento=t,Jr(n))})})}function Jr(e){Pr&&Pr(e),Xr()}async function Yr(e){await Ur(),Pr=e,zr.value=``,Fr=`Todos`,document.querySelectorAll(`.cs-filter-chip`).forEach(e=>{e.dataset.filter===`Todos`?(e.classList.remove(`bg-surface-container-low`,`text-on-surface-variant`,`hover:bg-surface-container-high`,`hover:text-on-surface`),e.classList.add(`bg-primary`,`text-on-primary`,`border-primary`)):(e.classList.add(`bg-surface-container-low`,`text-on-surface-variant`,`hover:bg-surface-container-high`,`hover:text-on-surface`),e.classList.remove(`bg-primary`,`text-on-primary`,`border-primary`))}),Kr(),Hr.classList.add(`hidden`),Ir.classList.remove(`hidden`),Ir.classList.add(`flex`),setTimeout(()=>zr.focus(),100)}function Xr(){Ir.classList.add(`hidden`),Ir.classList.remove(`flex`),Pr=null}var Zr=e(r(),1),Qr=null,$r=null,ei=!1;function ti(){return localStorage.getItem(`fonebase_paper_format`)||`48mm`}function ni(){return ti()===`80mm`?576:384}var ri=[6384,`e7810a71-73ae-499d-8c15-faa9aef0c3f2`,`000018f0-0000-1000-8000-00805f9b34fb`,`0000ffe0-0000-1000-8000-00805f9b34fb`,`0000fee7-0000-1000-8000-00805f9b34fb`,`0000ff00-0000-1000-8000-00805f9b34fb`,`00004953-5443-4e45-5246-454c42494c49`];async function ii(){if(Qr&&Qr.gatt.connected)return!0;if(!navigator.bluetooth)throw Error(`Tu navegador no soporta Web Bluetooth. Usa Chrome/Edge.`);Qr=await navigator.bluetooth.requestDevice({acceptAllDevices:!0,optionalServices:ri});let e=await Qr.gatt.connect();for(let t of ri)try{let n=await(await e.getPrimaryService(t)).getCharacteristics();for(let e of n)if(e.properties.write||e.properties.writeWithoutResponse)return $r=e,console.log(`[BT-Printer] ✅ Canal encontrado: ${e.uuid}`),!0}catch{}throw Qr=null,Error(`No se encontró canal de escritura en la impresora.`)}async function ai(e){if(!$r)throw Error(`Impresora no conectada.`);for(let t=0;t<e.length;t+=100)await $r.writeValue(e.slice(t,t+100)),await new Promise(e=>setTimeout(e,20))}function oi(e,t=null){let n=`N/A`;try{let t=JSON.parse(e.imeis||`{}`),r=Object.values(t).flat().filter(e=>e&&e.trim());r.length>0&&(n=r.join(`, `))}catch{e.imeis&&e.imeis!==`{}`&&e.imeis!==`N/A`&&(n=e.imeis)}let r=new Date(e.fecha||Date.now()),i=`${r.getDate()}/${r.getMonth()+1}/${r.getFullYear()} ${r.getHours()}:${String(r.getMinutes()).padStart(2,`0`)}`,a=[t?.direccion,t?.ciudad].filter(e=>e&&e.trim()).join(`, `),o={nombre:t?.nombre||``,nit:t?.nit||``,direccion:a,contacto:t?.contacto||``,condiciones:t?.condiciones||``,logo:t?.logo||``,logo_size:t?.logo_size||60,mostrar_nombre:t?.mostrar_nombre!==0},s=e=>`$`+new Intl.NumberFormat(`es-CO`).format(e||0),c=e.cliente||`Sin nombre`,l=e.cedula||`N/A`,u=e.telefono_cliente||e.telefono||`N/A`,d=e.direccion||`—`,f=e.ciudad||`—`,p=e.vendedor||`Vendedor`,m=e.productos||`Producto`,h=e.cantidad||1,g=e.id_factura||e.idFactura||`S/N`,_=e.metodo||`Efectivo`;return`
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      .ticket-container {
        font-family: Arial, Helvetica, sans-serif;
        width: ${ni()}px;
        background: #fff;
        padding: 8px;
        font-size: 24px;
        font-weight: 900;
        color: #000;
        line-height: 1.35;
        -webkit-text-stroke: 0.8px #000;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .bold { font-weight: 900; }
      .center { text-align: center; }

      /* ---- Header empresa ---- */
      .header-box {
        border: 3px solid #000;
        border-radius: 8px;
        padding: 10px;
        margin-bottom: 12px;
        text-align: center;
        line-height: 1.3;
      }
      .header-box .name {
        font-size: 32px;
        font-weight: 900;
        text-transform: uppercase;
      }
      .header-box .info {
        font-size: 22px;
        font-weight: 900;
        color: #000;
        margin-top: 2px;
      }

      /* ---- Card genérica ---- */
      .card {
        border: 3px solid #000;
        border-radius: 8px;
        padding: 10px;
        margin-bottom: 12px;
      }

      .flex-between {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .badge {
        background: #000;
        color: #fff;
        padding: 4px 12px;
        border-radius: 6px;
        font-size: 20px;
        font-weight: 900;
        text-transform: uppercase;
      }

      .section-label {
        font-size: 20px;
        font-weight: 900;
        color: #000;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 4px;
        margin-top: 12px;
        border-bottom: 2px solid #000;
        padding-bottom: 3px;
      }

      .divider {
        border: none;
        border-top: 3px dashed #000;
        margin: 12px 0;
      }

      .data-row {
        font-size: 22px;
        font-weight: 900;
        color: #000;
        margin-bottom: 3px;
      }
      .data-label {
        font-weight: 900;
        font-size: 22px;
        color: #000;
      }

      /* ---- Productos ---- */
      .product-card {
        border: 3px solid #000;
        border-radius: 6px;
        padding: 10px;
        margin-bottom: 10px;
      }
      .product-name {
        font-size: 24px;
        font-weight: 900;
        color: #000;
      }
      .product-qty {
        font-size: 24px;
        font-weight: 900;
        color: #000;
      }

      /* ---- Resumen (fondo negro) ---- */
      .summary-card {
        background: #000;
        color: #fff;
        border-radius: 8px;
        padding: 14px;
        margin-bottom: 12px;
      }
      .summary-label {
        font-size: 20px;
        font-weight: 900;
        color: #fff;
        text-transform: uppercase;
      }
      .summary-line {
        font-size: 22px;
        font-weight: 900;
        color: #fff;
      }
      .summary-discount {
        font-size: 22px;
        font-weight: 900;
        color: #fff;
      }
      .total-label {
        font-size: 20px;
        font-weight: 900;
        color: #fff;
        text-transform: uppercase;
      }
      .total-amount {
        font-size: 44px;
        font-weight: 900;
        color: #fff;
        line-height: 1;
      }

      /* ---- Firmas GRANDES ---- */
      .firma-grid {
        display: flex;
        gap: 10px;
        margin-bottom: 12px;
      }
      .firma-col {
        flex: 1;
        text-align: center;
      }
      .firma-label {
        font-size: 20px;
        font-weight: 900;
        color: #000;
      }
      .firma-box {
        border: 3px solid #000;
        border-radius: 6px;
        height: 170px;
        margin-top: 6px;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
      }
      .firma-box img {
        height: 160px;
        max-width: 100%;
        object-fit: contain;
      }

      /* ---- Legal / Footer ---- */
      .legal {
        font-size: 22px;
        font-weight: 900;
        color: #000;
        text-align: left;
        white-space: pre-wrap;
        word-break: break-word;
        margin-top: 14px;
        line-height: 1.35;
      }
      .footer {
        text-align: center;
        font-size: 28px;
        font-weight: 900;
        color: #000;
        margin-top: 14px;
        padding-bottom: 20px;
      }

      .imei-text {
        font-size: 20px;
        font-weight: 900;
        color: #000;
        margin-bottom: 10px;
        padding-left: 4px;
      }

      .comprobante-title {
        font-size: 24px;
        font-weight: 900;
        text-transform: uppercase;
        color: #000;
      }
      .invoice-number {
        font-size: 32px;
        font-weight: 900;
        line-height: 1.1;
        color: #000;
      }
      .invoice-meta {
        font-size: 22px;
        color: #000;
      }
    </style>

    ${o.logo?`
    <div style="text-align:center; margin-bottom:12px;">
      <img src="${o.logo}" style="max-height:${Math.max(o.logo_size,160)}px; max-width:80%; object-fit:contain; display:inline-block;" crossorigin="anonymous">
    </div>`:``}

    <div class="header-box">
      ${o.mostrar_nombre?`<div class="name">${o.nombre}</div>`:``}
      <div class="info">NIT: ${o.nit}</div>
      <div class="info">${o.direccion}</div>
      <div class="info">Tel: ${o.contacto}</div>
    </div>

    <div class="card">
      <div class="comprobante-title">COMPROBANTE DE VENTA</div>
      <div class="flex-between" style="margin-top:6px;">
        <div class="invoice-number">${g}</div>
        <div class="badge">PAGADO</div>
      </div>
      <div class="flex-between" style="margin-top:6px;">
        <div class="invoice-meta">${i}</div>
        <div class="invoice-meta bold">${_}</div>
      </div>
    </div>

    <div class="section-label">CLIENTE</div>
    <div class="data-row bold" style="font-size:24px;">${c}</div>
    <div class="data-row"><span class="data-label">ID:</span> ${l}</div>
    <div class="data-row"><span class="data-label">Tel:</span> ${u}</div>
    <div class="data-row"><span class="data-label">Ubic:</span> ${d}, ${f}</div>

    <div class="section-label">VENDEDOR</div>
    <div class="data-row bold" style="font-size:24px;">${p}</div>
    <div class="data-row" style="font-size:20px; font-style:italic;">Vendedor Autorizado</div>

    <hr class="divider">

    <div class="section-label">DETALLE DE PRODUCTOS</div>
    <div class="product-card">
      <div class="flex-between">
        <div class="product-name" style="width:78%;">${m}</div>
        <div class="product-qty">x${h}</div>
      </div>
    </div>

    ${n&&n!==`N/A`?`
    <div class="imei-text">IMEI: ${n}</div>`:``}

    <div class="summary-card">
      <div class="flex-between" style="align-items:flex-end;">
        <div>
          <div class="summary-label">RESUMEN</div>
          <div class="summary-line">Subtotal: ${s(e.subtotal||e.total)}</div>
          <div class="summary-discount">Desc: -${s(e.descuento||0)}</div>
        </div>
        <div style="text-align:right;">
          <div class="total-label">TOTAL</div>
          <div class="total-amount">${s(e.total)}</div>
        </div>
      </div>
    </div>

    <div class="firma-grid">
      <div class="firma-col">
        <div class="firma-label">FIRMA VENDEDOR</div>
        <div class="firma-box">
          ${e.id_firma_vendedor?`<img src="${e.id_firma_vendedor}" crossorigin="anonymous">`:``}
        </div>
      </div>
      <div class="firma-col">
        <div class="firma-label">FIRMA CLIENTE</div>
        <div class="firma-box">
          ${e.id_firma_comprador?`<img src="${e.id_firma_comprador}" crossorigin="anonymous">`:``}
        </div>
      </div>
    </div>

    <div class="legal">${o.condiciones}</div>
    <div class="footer">¡GRACIAS POR SU COMPRA!</div>
  `}async function si(e,t){let n=ni(),r=document.createElement(`div`);r.className=`ticket-container`,r.style.cssText=`
    position: fixed;
    left: -9999px;
    top: 0;
    width: ${n}px;
    background: white;
    z-index: -1;
  `,r.innerHTML=oi(e,t),document.body.appendChild(r);let i=r.querySelectorAll(`img`);await Promise.all([...i].map(e=>e.complete?Promise.resolve():new Promise(t=>{e.onload=t,e.onerror=t})));let a=await(0,Zr.default)(r,{width:n,windowWidth:n,backgroundColor:`#ffffff`,scale:1,useCORS:!0,logging:!1,allowTaint:!1});return document.body.removeChild(r),a}function ci(e){let t=Math.ceil(e.height/8)*8;if(t===e.height)return e;let n=document.createElement(`canvas`);n.width=e.width,n.height=t;let r=n.getContext(`2d`);return r.fillStyle=`white`,r.fillRect(0,0,n.width,n.height),r.drawImage(e,0,0),n}async function li(e,t=null,n=null,r=null){if(ei){console.warn(`[BT-Printer] Impresión en progreso.`);return}try{ei=!0,await ii();let t=ci(await si(e,r));console.log(`[BT-Printer] Canvas: ${t.width}x${t.height}px`);let n=ni(),a=new i({language:`esc-pos`,width:n===576?48:32});a.initialize().align(`center`).image(t,n,t.height,`threshold`).newline().newline().newline().cut(),await ai(a.encode()),console.log(`[BT-Printer] ✅ Impresión enviada.`)}catch(e){console.error(`[BT-Printer] Error:`,e),A(`Error Bluetooth: ${e.message||e}`,`error`)}finally{ei=!1}}function ui(e,t=null){let n=new Date,r=`${n.getDate()}/${n.getMonth()+1}/${n.getFullYear()} ${n.getHours()}:${String(n.getMinutes()).padStart(2,`0`)}`,i={nombre:t?.nombre||`MI NEGOCIO`,nit:t?.nit||`900.123.456-1`,direccion:(t?.direccion||`Calle 123 No. 45 - 67`)+`, `+(t?.ciudad||`Bogotá - Cundinamarca`),contacto:t?.contacto||`3001234567`,condiciones:t?.condiciones||`GARANTIA: Equipos probados y encendidos. Sin garantía en displays/táctiles o equipos apagados. Doc. asimilado a letra de cambio (Art. 774 C.Comercio).`,logo:t?.logo||``,logo_size:t?.logo_size||60,mostrar_nombre:t?.mostrar_nombre!==0},a=e=>`$`+new Intl.NumberFormat(`es-CO`).format(e||0),o=(e.precio_final||0)-(e.abono||0),s=(e.estado||``).trim();return`
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      .ticket-container {
        font-family: Arial, Helvetica, sans-serif;
        width: ${ni()}px;
        background: #fff;
        padding: 8px;
        font-size: 24px;
        font-weight: 900;
        color: #000;
        line-height: 1.35;
        -webkit-text-stroke: 0.8px #000;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .bold { font-weight: 900; }
      .center { text-align: center; }

      /* ---- Header empresa ---- */
      .header-box {
        border: 3px solid #000;
        border-radius: 8px;
        padding: 10px;
        margin-bottom: 12px;
        text-align: center;
        line-height: 1.3;
      }
      .header-box .name {
        font-size: 32px;
        font-weight: 900;
        text-transform: uppercase;
      }
      .header-box .info {
        font-size: 22px;
        font-weight: 900;
        color: #000;
        margin-top: 2px;
      }

      /* ---- Card genérica ---- */
      .card {
        border: 3px solid #000;
        border-radius: 8px;
        padding: 10px;
        margin-bottom: 12px;
      }

      .flex-between {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .badge {
        background: #000;
        color: #fff;
        padding: 4px 12px;
        border-radius: 6px;
        font-size: 20px;
        font-weight: 900;
        text-transform: uppercase;
      }

      .section-label {
        font-size: 20px;
        font-weight: 900;
        color: #000;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 4px;
        margin-top: 12px;
        border-bottom: 2px solid #000;
        padding-bottom: 3px;
      }

      .divider {
        border: none;
        border-top: 3px dashed #000;
        margin: 12px 0;
      }

      .data-row {
        margin-bottom: 4px;
        font-size: 22px;
        font-weight: 900;
      }
      .data-label {
        font-weight: 900;
        text-transform: uppercase;
        font-size: 18px;
        margin-right: 4px;
      }

      /* ---- Totales ---- */
      .summary-card {
        border: 3px solid #000;
        border-radius: 8px;
        padding: 10px;
        margin-top: 12px;
      }

      /* ---- Firmas GRANDES ---- */
      .firma-grid {
        display: flex;
        gap: 10px;
        margin-bottom: 12px;
      }
      .firma-col {
        flex: 1;
        text-align: center;
      }
      .firma-label {
        font-size: 20px;
        font-weight: 900;
        color: #000;
      }
      .firma-box {
        border: 3px solid #000;
        border-radius: 6px;
        height: 170px;
        margin-top: 6px;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
      }

      /* ---- Legal / Footer ---- */
      .legal {
        font-size: 22px;
        font-weight: 900;
        color: #000;
        text-align: justify;
        margin-top: 14px;
        line-height: 1.35;
      }
      .footer {
        text-align: center;
        font-size: 28px;
        font-weight: 900;
        color: #000;
        margin-top: 14px;
        padding-bottom: 20px;
      }
    </style>

    ${i.logo?`
    <div style="text-align:center; margin-bottom:12px;">
      <img src="${i.logo}" style="max-height:${Math.max(i.logo_size,160)}px; max-width:80%; object-fit:contain; display:inline-block;" crossorigin="anonymous">
    </div>`:``}

    <div class="header-box">
      ${i.mostrar_nombre?`<div class="name">${i.nombre}</div>`:``}
      <div class="info">NIT: ${i.nit}</div>
      <div class="info">${i.direccion}</div>
      <div class="info">Tel: ${i.contacto}</div>
    </div>

    <div class="card">
      <div class="bold text-xl uppercase">SERVICIO TÉCNICO</div>
      <div class="flex-between" style="margin-top:6px;">
        <div class="bold text-2xl">${e.id_orden}</div>
        <div class="badge">${s}</div>
      </div>
      <div class="flex-between" style="margin-top:6px;">
        <div class="text-sm font-bold">${r}</div>
        <div class="text-sm font-bold">SOPORTE</div>
      </div>
    </div>

    <div class="section-label">CLIENTE</div>
    <div class="data-row bold" style="font-size:24px;">${e.cliente}</div>
    <div class="data-row"><span class="data-label">Tel:</span> ${e.telefono||`N/A`}</div>

    <div class="section-label">DISPOSITIVO</div>
    <div class="data-row bold" style="font-size:24px;">${e.equipo}</div>
    <div class="data-row"><span class="data-label">IMEI/S:</span> ${e.imei_serie||`N/A`}</div>
    ${e.clave_patron?`<div class="data-row"><span class="data-label">CLAVE:</span> ${e.clave_patron}</div>`:``}

    <hr class="divider">

    <div class="section-label">DETALLES DEL TRABAJO</div>
    <div class="card" style="font-size:22px; line-height:1.4;">
      <div class="bold" style="font-size:18px; text-transform:uppercase;">Falla Reportada:</div>
      <div>${e.falla}</div>
      ${e.repuestos?`
        <div class="bold" style="font-size:18px; text-transform:uppercase; margin-top:8px; border-top:2px dashed #000; padding-top:4px;">Repuestos Utilizados:</div>
        <div>${e.repuestos}</div>
      `:``}
    </div>

    <div class="summary-card">
      <div class="flex-between">
        <div>
          <div class="bold text-sm uppercase">Resumen de Pago</div>
          <div style="font-size:20px; margin-top:4px;">Costo Total: ${a(e.precio_final)}</div>
          <div style="font-size:20px; font-weight:900;">Abonado: -${a(e.abono)}</div>
        </div>
        <div style="text-align: right;">
          <div class="bold text-sm uppercase">Saldo Pendiente</div>
          <div class="text-2xl bold">${a(o)}</div>
        </div>
      </div>
    </div>

    <div class="firma-grid" style="margin-top:16px;">
      <div class="firma-col">
        <div class="firma-label">FIRMA TÉCNICO</div>
        <div class="firma-box"></div>
      </div>
      <div class="firma-col">
        <div class="firma-label">FIRMA CLIENTE</div>
        <div class="firma-box"></div>
      </div>
    </div>

    <div class="legal">
      ${i.condiciones}
      <p style="margin-top:6px; font-style:italic; text-align:center;">Conserve este ticket para reclamar su equipo.</p>
    </div>
    <div class="footer">¡GRACIAS POR SU CONFIANZA!</div>
  `}async function di(e,t=null){if(ei){console.warn(`[BT-Printer] Impresión en progreso.`);return}try{ei=!0,await ii();let n=ni(),r=document.createElement(`div`);r.className=`ticket-container`,r.style.cssText=`
      position: fixed;
      left: -9999px;
      top: 0;
      width: ${n}px;
      background: white;
      z-index: -1;
    `,r.innerHTML=ui(e,t),document.body.appendChild(r);let a=r.querySelectorAll(`img`);await Promise.all([...a].map(e=>e.complete?Promise.resolve():new Promise(t=>{e.onload=t,e.onerror=t})));let o=await(0,Zr.default)(r,{width:n,windowWidth:n,backgroundColor:`#ffffff`,scale:1,useCORS:!0,logging:!1,allowTaint:!1});document.body.removeChild(r);let s=ci(o);console.log(`[BT-Printer] Technical Canvas: ${s.width}x${s.height}px`);let c=new i({language:`esc-pos`,width:n===576?48:32});c.initialize().align(`center`).image(s,n,s.height,`threshold`).newline().newline().newline().cut(),await ai(c.encode()),console.log(`[BT-Printer] ✅ Impresión de Servicio Técnico enviada.`)}catch(e){console.error(`[BT-Printer] Error en ticket técnico:`,e),A(`Error Bluetooth: ${e.message||e}`,`error`)}finally{ei=!1}}async function fi(e,t,n,r=null){if(ei){console.warn(`[BT-Printer] Impresión en progreso.`);return}try{ei=!0,await ii();let a=ni(),o=document.createElement(`div`);o.className=`ticket-container`,o.style.cssText=`
      position: fixed;
      left: -9999px;
      top: 0;
      width: ${a}px;
      background: white;
      z-index: -1;
    `,o.innerHTML=mi(e,t,n,r),document.body.appendChild(o);let s=o.querySelectorAll(`img`);await Promise.all([...s].map(e=>e.complete?Promise.resolve():new Promise(t=>{e.onload=t,e.onerror=t})));let c=await(0,Zr.default)(o,{width:a,windowWidth:a,backgroundColor:`#ffffff`,scale:1,useCORS:!0,logging:!1,allowTaint:!1});document.body.removeChild(o);let l=ci(c);console.log(`[BT-Printer] Abono Canvas: ${l.width}x${l.height}px`);let u=new i({language:`esc-pos`,width:a===576?48:32});u.initialize().align(`center`).image(l,a,l.height,`threshold`).newline().newline().newline().cut(),await ai(u.encode()),console.log(`[BT-Printer] ✅ Impresión de abono enviada.`)}catch(e){throw console.error(`[BT-Printer] Error en ticket abono:`,e),A(`Error Bluetooth: ${e.message||e}`,`error`),e}finally{ei=!1}}function pi(e){return e?e.split(`;`).filter(Boolean).map(e=>{let t=e.split(`|`);return{fecha:t[0]||``,monto:parseFloat(t[1])||0,nota:t[2]||``,metodo:t[3]||`Efectivo`,evidencia:t[4]||``}}):[]}function mi(e,t,n,r=null){let i=new Date,a=`${i.getDate()}/${i.getMonth()+1}/${i.getFullYear()} ${i.getHours()}:${String(i.getMinutes()).padStart(2,`0`)}`,o={nombre:r?.nombre||`MI NEGOCIO`,nit:r?.nit||`900.123.456-1`,direccion:(r?.direccion||`Calle 123 No. 45 - 67`)+`, `+(r?.ciudad||`Bogotá - Cundinamarca`),contacto:r?.contacto||`3001234567`,logo:r?.logo||``,logo_size:r?.logo_size||60,mostrar_nombre:r?.mostrar_nombre!==0},s=e=>`$`+new Intl.NumberFormat(`es-CO`).format(e||0),c=pi(e.historialAbonos).map((e,t)=>`
    <tr style="border-bottom: 2px solid #000;">
      <td style="padding: 6px 0; text-align: left; vertical-align: top; font-size: 20px;">
        <div class="bold">#${t+1} - ${e.fecha}</div>
        <div style="font-size: 18px; margin-top: 2px;">
          <span style="background: #000; color: #fff; padding: 2px 6px; border-radius: 4px; font-weight: 900; font-size: 16px; text-transform: uppercase;">${e.metodo||`Efectivo`}</span>
          ${e.nota?`• `+e.nota:``}
        </div>
      </td>
      <td style="text-align: right; padding: 6px 0; font-weight: 900; font-size: 22px; vertical-align: bottom;">
        ${s(e.monto)}
      </td>
    </tr>
  `).join(``);return`
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      .ticket-container {
        font-family: Arial, Helvetica, sans-serif;
        width: ${ni()}px;
        background: #fff;
        padding: 8px;
        font-size: 24px;
        font-weight: 900;
        color: #000;
        line-height: 1.35;
        -webkit-text-stroke: 0.8px #000;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .bold { font-weight: 900; }
      .center { text-align: center; }

      .header-box {
        border: 3px solid #000;
        border-radius: 8px;
        padding: 10px;
        margin-bottom: 12px;
        text-align: center;
        line-height: 1.3;
      }
      .header-box .name {
        font-size: 32px;
        font-weight: 900;
        text-transform: uppercase;
      }
      .header-box .info {
        font-size: 22px;
        font-weight: 900;
        color: #000;
        margin-top: 2px;
      }

      .card {
        border: 3px solid #000;
        border-radius: 8px;
        padding: 10px;
        margin-bottom: 12px;
      }
      .flex-between {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .badge {
        background: #000;
        color: #fff;
        padding: 4px 12px;
        border-radius: 6px;
        font-size: 20px;
        font-weight: 900;
        text-transform: uppercase;
      }
      .badge-error {
        border: 3px solid #000;
        color: #000;
        padding: 4px 12px;
        border-radius: 6px;
        font-size: 20px;
        font-weight: 900;
        text-transform: uppercase;
      }

      .section-title {
        font-size: 18px;
        font-weight: 900;
        text-transform: uppercase;
        margin-bottom: 4px;
        margin-top: 8px;
        border-bottom: 2px solid #000;
        padding-bottom: 2px;
      }

      .summary-card {
        background: #000;
        color: #fff;
        border-radius: 8px;
        padding: 10px;
        margin-top: 12px;
      }
    </style>
    <div class="ticket-container">
      <!-- Logo -->
      ${o.logo?`
      <div style="text-align: center; margin-bottom: 6px;">
        <img src="${o.logo}" style="max-height: ${o.logo_size||60}px; max-width: 100%; object-fit: contain;">
      </div>
      `:``}
      <div class="header-box">
        ${o.mostrar_nombre?`<div class="name">${o.nombre}</div>`:``}
        <div class="info">
          <div>NIT: ${o.nit}</div>
          <div>${o.direccion}</div>
          <div>Tel: ${o.contacto}</div>
        </div>
      </div>

      <!-- Header / Comprobante -->
      <div class="card">
        <div class="bold" style="font-size: 26px; color: #000; text-transform: uppercase; text-align: center; margin-bottom: 4px;">RECIBO DE ABONO</div>
        <div class="flex-between">
          <div class="bold" style="font-size: 22px;">${e.tipo===`Plan Separe`?`PLAN SEPARE`:`CRÉDITO`}</div>
          <div class="${e.saldo<=0?`badge`:`badge-error`}">${e.saldo<=0?e.tipo===`Plan Separe`?`ENTREGADO`:`PAGADO`:`PENDIENTE`}</div>
        </div>
        <div class="flex-between" style="margin-top: 6px; font-size: 18px;">
          <div>Fecha: ${a}</div>
          <div>Ref: ${e.idFactura||`S/N`}</div>
        </div>
      </div>

      <!-- Info Cliente -->
      <div style="font-size: 20px; margin-bottom: 8px;">
        <div class="section-title">CLIENTE</div>
        <div class="bold">${e.cliente}</div>
        <div>ID: ${e.telefono||``}</div>
      </div>
      
      <!-- Detalle Producto -->
      <div style="font-size: 20px; margin-bottom: 8px;">
        <div class="section-title">PRODUCTO / DETALLE</div>
        <div class="bold">${e.detalle||`Pago de deuda`}</div>
      </div>

      <!-- Historial de Abonos -->
      <div class="section-title">HISTORIAL DE PAGOS</div>
      <table style="width: 100%; border-collapse: collapse;">
        ${c}
      </table>

      <!-- Resumen Financiero -->
      <div class="summary-card" style="font-size: 22px;">
        <div class="flex-between">
          <span>Valor Total:</span>
          <span class="bold">${s(e.total)}</span>
        </div>
        <div class="flex-between" style="margin-top: 4px;">
          <span>Total Abonado:</span>
          <span class="bold">${s(e.abonado)}</span>
        </div>
        <div class="flex-between" style="border-top: 2px dashed #fff; margin-top: 6px; padding-top: 6px; font-size: 24px;">
          <span class="bold">SALDO PENDIENTE:</span>
          <span class="bold" style="font-size: 28px;">${s(e.saldo)}</span>
        </div>
      </div>

      <div class="center bold" style="margin-top: 20px; font-size: 18px; font-style: italic;">
        ${e.tipo===`Plan Separe`?`El producto se entregará al completar el pago total.`:`Conserve este recibo como soporte de pago.`}
      </div>
      <div class="center bold" style="margin-top: 15px; font-size: 22px; border: 2px solid #000; padding: 4px; border-radius: 4px;">¡GRACIAS POR SU PAGO!</div>
    </div>
  `}var R=[],hi=[],z=[],gi=!1,_i=!1,vi=null,B=null,yi,bi,xi,Si,Ci,wi,Ti,Ei,Di,Oi,ki,Ai,V,H,ji,Mi,Ni,Pi,Fi,Ii,Li,Ri,zi,Bi,Vi,U,Hi,Ui,Wi,Gi,Ki,qi,Ji=null,Yi,Xi,Zi,Qi,$i,ea,ta,na,ra,ia,aa;function oa(){return window.innerWidth<1024}function sa(){Xi?.classList.add(`open`),Zi?.classList.add(`open`),Yi?.classList.add(`hidden`),document.body.style.overflow=`hidden`}function ca(){Xi?.classList.remove(`open`),Zi?.classList.remove(`open`),Yi?.classList.remove(`hidden`),document.body.style.overflow=``}function la(){return async()=>{ua();try{B=await un()}catch(e){console.error(`Error al cargar ajustes de empresa:`,e)}gi||=(await da(),pa(),Ea(),V.getContext(`2d`),H.getContext(`2d`),xa(U,e=>Hi=e),!0),fa(R),ma()}}function ua(){yi=document.getElementById(`pos-search`),bi=document.getElementById(`pos-products-grid`),xi=document.getElementById(`pos-cart-items`),Si=document.getElementById(`pos-subtotal`),Ci=document.getElementById(`pos-descuento`),wi=document.getElementById(`pos-total`),document.getElementById(`pos-pay-btn`),Ti=document.getElementById(`pos-cliente-doc`),Ei=document.getElementById(`pos-cliente-nombre`),Di=document.getElementById(`pos-checkout-modal`),Oi=document.getElementById(`pos-checkout-close`),ki=document.getElementById(`pos-checkout-cancel`),Ai=document.getElementById(`pos-checkout-confirm`),Wi=document.getElementById(`pos-evidencia-file-camera`),Gi=document.getElementById(`pos-evidencia-file-gallery`),Ki=document.getElementById(`pos-evidencia-status`),qi=document.getElementById(`pos-evidencia-filename`),V=document.getElementById(`pos-canvas-cliente`),H=document.getElementById(`pos-canvas-vendedor`),ji=document.getElementById(`pos-cliente-direccion`),Mi=document.getElementById(`pos-cliente-ciudad`),Ni=document.getElementById(`pos-cliente-tel`),Pi=document.getElementById(`pos-digital-fields`),Fi=document.getElementById(`pos-signatures-container`),Ii=document.getElementById(`pos-imei-container`),Li=document.getElementById(`pos-imei-list`),Ri=document.getElementById(`pos-signature-modal`),zi=document.getElementById(`pos-sig-modal-close`),Bi=document.getElementById(`pos-sig-modal-clear`),Vi=document.getElementById(`pos-sig-modal-save`),U=document.getElementById(`pos-canvas-fullscreen`),Yi=document.getElementById(`pos-cart-fab`),Xi=document.getElementById(`pos-cart-sheet`),Zi=document.getElementById(`pos-sheet-overlay`),Qi=document.getElementById(`pos-sheet-close`),$i=document.getElementById(`pos-cart-items-mobile`),ea=document.getElementById(`pos-subtotal-mobile`),ta=document.getElementById(`pos-descuento-mobile`),na=document.getElementById(`pos-total-mobile`),ra=document.getElementById(`pos-cliente-nombre-mobile`),ia=document.getElementById(`pos-select-client-btn-mobile`),aa=document.getElementById(`pos-metodo-pago-mobile`)}async function da(){try{let[e,t]=await Promise.all([P(),Pt().catch(()=>[])]);R=(e||[]).filter(e=>e.stockActual>0),hi=(t||[]).filter(e=>(e.estado||``).toLowerCase()===`disponible`)}catch{R=[],hi=[]}}function fa(e){if(e.length===0){bi.innerHTML=`<p class="p-4 col-span-full text-center opacity-50 italic text-sm">Sin stock disponible</p>`;return}bi.innerHTML=e.map(e=>`
    <div onclick="window.posAddToCart('${e.id}')" 
      class="bg-white border border-slate-200 rounded-3xl overflow-hidden flex flex-col cursor-pointer hover:border-primary hover:shadow-xl transition-all active:scale-95 shadow-sm group h-[240px]">
      <div class="h-36 w-full bg-slate-50 flex-shrink-0 flex items-center justify-center overflow-hidden border-b border-slate-100">
        ${e.imagen?`<img src="${e.imagen}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />`:`<span class="material-symbols-outlined text-slate-300 text-[40px]">image</span>`}
      </div>
      <div class="p-4 flex flex-col justify-between flex-1 min-w-0 bg-white">
        <h3 class="text-xs font-black text-slate-800 leading-tight line-clamp-2 uppercase group-hover:text-primary transition-colors">${e.nombre}</h3>
        <div class="flex justify-between items-center mt-auto">
          <span class="text-[10px] font-black text-primary px-2.5 py-1 bg-primary/10 rounded-full truncate max-w-[65%]">${e.marca||`GENERICO`}</span>
          <div class="flex flex-col items-end">
            <span class="text-[9px] font-bold text-slate-400 uppercase leading-none mb-0.5">Stock</span>
            <span class="text-xs font-black text-slate-900">${e.stockActual}</span>
          </div>
        </div>
      </div>
    </div>
  `).join(``)}function pa(){yi.addEventListener(`input`,e=>{let t=e.target.value.toLowerCase().trim();fa(t?R.filter(e=>e.nombre.toLowerCase().includes(t)||e.sku.toLowerCase().includes(t)):R)}),document.addEventListener(`barcodeScanned`,e=>{let t=document.querySelector(`[data-view="pos"]`);if(!t||t.classList.contains(`hidden`))return;let n=e.detail,r=R.find(e=>e.sku===n||e.id===n);r?(window.posAddToCart(r.id),A(`✅ ${r.nombre} agregado`,`success`),document.activeElement===yi&&(yi.value=``,fa(R),yi.blur())):A(`Código ${n} no encontrado`,`warning`)}),document.getElementById(`pos-scan-btn`)?.addEventListener(`click`,()=>{Ue({title:`Escanear`,onScan:e=>{yi.value=e,yi.dispatchEvent(new Event(`input`));let t=R.find(t=>t.sku===e||t.id===e);t?(window.posAddToCart(t.id),A(`✅ ${t.nombre} agregado`,`success`),setTimeout(()=>{yi.value===e&&(yi.value=``,yi.dispatchEvent(new Event(`input`)))},1500)):A(`Código ${e} no encontrado en inventario`,`warning`)}})});let e=()=>{window.__posReventaMode=!0,oa()&&ca(),f(`inventory`),setTimeout(()=>{window.inventoryView&&window.inventoryView.openNuevo&&window.inventoryView.openNuevo(!0)},150)};document.getElementById(`pos-reventa-btn`)?.addEventListener(`click`,e),document.getElementById(`pos-reventa-btn-mobile`)?.addEventListener(`click`,e),document.getElementById(`pos-select-client-btn`)?.addEventListener(`click`,()=>{Yr(e=>{Ei.value=e.nombre,Ti.value=e.documento})}),document.querySelectorAll(`input[name="pos-billing-type"]`).forEach(e=>{e.addEventListener(`change`,e=>{let t=e.target.value===`digital`,n=document.getElementById(`pos-evidencia-container`);t?(n.classList.add(`hidden`),Pi.classList.remove(`hidden`),Fi.classList.remove(`hidden`),ya(),setTimeout(ba,50)):(n.classList.remove(`hidden`),Pi.classList.add(`hidden`),Fi.classList.add(`hidden`),Ii.classList.add(`hidden`))})}),zi.addEventListener(`click`,()=>Ri.classList.add(`hidden`)),document.getElementById(`pos-sig-modal-cancel`)?.addEventListener(`click`,()=>Ri.classList.add(`hidden`)),Bi.addEventListener(`click`,()=>Hi.clearRect(0,0,U.width,U.height)),Vi.addEventListener(`click`,()=>{if(Ui){let e=Ui.getContext(`2d`);e.clearRect(0,0,Ui.width,Ui.height),e.drawImage(U,0,0,Ui.width,Ui.height);let n=Ui.id===`pos-canvas-cliente`,r=document.getElementById(n?`pos-sig-helper-cliente`:`pos-sig-helper-vendedor`);r&&r.classList.add(`hidden`);let i=Ui.parentElement.querySelector(`button`);i&&i.classList.remove(`hidden`);let a=n?`pos-sig-helper-vendedor`:`pos-sig-helper-cliente`,o=document.getElementById(a);if(o&&!o.classList.contains(`hidden`)){n?t(H,`Firma del Vendedor`):t(V,`Firma del Comprador`);return}}Ri.classList.add(`hidden`)});let t=(e,t)=>{Ui=e,document.getElementById(`pos-sig-modal-title`).textContent=t,Ri.classList.remove(`hidden`),U.width=U.offsetWidth,U.height=U.offsetHeight,Hi.lineWidth=8,Hi.lineCap=`round`,Hi.strokeStyle=`#000`,Hi.clearRect(0,0,U.width,U.height);let n=Ui.id===`pos-canvas-cliente`?`pos-sig-helper-vendedor`:`pos-sig-helper-cliente`,r=document.getElementById(n);r&&!r.classList.contains(`hidden`)?Vi.innerHTML=`<span class="material-symbols-outlined text-[18px]">arrow_forward</span> Siguiente`:Vi.innerHTML=`<span class="material-symbols-outlined text-[18px]">check_circle</span> Guardar Firma`};V.parentElement.addEventListener(`click`,()=>t(V,`Firma del Comprador`)),H.parentElement.addEventListener(`click`,()=>t(H,`Firma del Vendedor`)),[V,H].forEach(e=>{let t=e.parentElement.querySelector(`button`);t&&t.addEventListener(`click`,n=>{n.stopPropagation(),e.getContext(`2d`).clearRect(0,0,e.width,e.height);let r=e.id===`pos-canvas-cliente`,i=document.getElementById(r?`pos-sig-helper-cliente`:`pos-sig-helper-vendedor`);i&&i.classList.remove(`hidden`),t.classList.add(`hidden`)})}),Li?.addEventListener(`change`,e=>{let t=e.target.closest(`.pos-imei-select`);if(!t)return;let n=t.closest(`[data-imei-card]`);if(!n)return;let r=n.querySelector(`.pos-imei-manual-container`),i=n.querySelector(`.pos-imei-input`),a=t.dataset.id;if(t.value===`__manual__`)r&&r.classList.remove(`hidden`),i&&(i.value=``,i.focus());else{r&&r.classList.add(`hidden`),i&&(i.value=t.value);let e=hi.find(e=>e.imei1===t.value||e.imei2===t.value);if(e&&e.venta&&Number(e.venta)>0){let t=z.find(e=>e.id===a);t&&(t.precioManual=Number(e.venta),ha(),A(`Precio ajustado a $${new Intl.NumberFormat(`es-CO`).format(Number(e.venta))} (${e.memoria?e.memoria+` • `:``}${e.color||`Equipo seleccionado`})`,`info`))}}}),Li?.addEventListener(`click`,e=>{let t=e.target.closest(`.pos-imei-scan-btn`);t&&(e.preventDefault(),Ue({title:`Escanear IMEI de Equipo`,filter:/^\d{14,16}$/,filterLabel:`IMEI`,onScan:e=>{let n=t.closest(`[data-imei-card]`);if(!n)return;let r=n.querySelector(`.pos-imei-input`),i=n.querySelector(`.pos-imei-select`),a=r?r.dataset.id:i?i.dataset.id:``;if(r&&(r.value=e,r.dispatchEvent(new Event(`input`,{bubbles:!0}))),i)if(Array.from(i.options).find(t=>t.value===e)){i.value=e;let t=n.querySelector(`.pos-imei-manual-container`);t&&t.classList.add(`hidden`)}else{i.value=`__manual__`;let e=n.querySelector(`.pos-imei-manual-container`);e&&e.classList.remove(`hidden`)}let o=hi.find(t=>t.imei1===e||t.imei2===e);if(o&&o.venta&&Number(o.venta)>0&&a){let e=z.find(e=>e.id===a);e&&(e.precioManual=Number(o.venta),ha())}A(`IMEI asignado: ${e}`,`success`)}}))}),window.posAddToCart=e=>{let t=R.find(t=>t.id===e);if(!t)return;let n=z.find(t=>t.id===e);if(n){if(n.qty>=t.stockActual)return A(`Sin stock`,`warning`);n.qty++}else z.push({...t,qty:1,precioManual:0});ma(),setTimeout(()=>{let e=xi.querySelectorAll(`input[oninput*="posUpdatePrice"]`);e.length>0&&e[e.length-1].focus()},100)},window.posRemoveItem=e=>{z=z.filter(t=>t.id!==e),ma()},window.posUpdateQty=(e,t)=>{let n=z.find(t=>t.id===e),r=R.find(t=>t.id===e);n&&(n.qty+=t,n.qty<=0?window.posRemoveItem(e):n.qty>r.stockActual&&(n.qty=r.stockActual),ma())},window.posUpdatePrice=(e,t)=>{let n=z.find(t=>t.id===e),r=Number(t.value.replace(/\D/g,``));n&&(n.precioManual=r,t.value=new Intl.NumberFormat(`es-CO`).format(r),ha())},Ci?.addEventListener(`input`,ma);let n=e=>{if(z.length!==0){if(!Ei.value)return A(`Nombre cliente ok?`,`warning`);vi=e,Sa()}};document.getElementById(`pos-pay-btn-venta`)?.addEventListener(`click`,()=>n(`venta`)),document.getElementById(`pos-pay-btn-credito`)?.addEventListener(`click`,()=>n(`credito`)),document.getElementById(`pos-pay-btn-separe`)?.addEventListener(`click`,()=>n(`separe`)),Oi.addEventListener(`click`,Ca),ki.addEventListener(`click`,Ca),Ai.addEventListener(`click`,wa),Yi?.addEventListener(`click`,sa),Qi?.addEventListener(`click`,ca),Zi?.addEventListener(`click`,ca),ia?.addEventListener(`click`,()=>{Yr(e=>{Ei.value=e.nombre,Ti.value=e.documento,ra&&(ra.value=e.nombre)})}),ta?.addEventListener(`input`,e=>{Ci.value=e.target.value,ma()});let r=e=>{if(z.length!==0){if(!(oa()?ra?.value:Ei.value))return A(`Nombre cliente ok?`,`warning`);vi=e,oa()&&(Ei.value=ra?.value||``,aa&&(document.getElementById(`pos-metodo-pago`).value=aa.value),ca()),Sa()}};document.getElementById(`pos-pay-btn-venta-mobile`)?.addEventListener(`click`,()=>r(`venta`)),document.getElementById(`pos-pay-btn-credito-mobile`)?.addEventListener(`click`,()=>r(`credito`)),document.getElementById(`pos-pay-btn-separe-mobile`)?.addEventListener(`click`,()=>r(`separe`)),document.getElementById(`pos-evidencia-btn-camera`)?.addEventListener(`click`,()=>Wi?.click()),document.getElementById(`pos-evidencia-btn-gallery`)?.addEventListener(`click`,()=>Gi?.click());let i=(e,t)=>{e.files&&e.files[0]&&(Ji=e.files[0],t.value=``,qi&&Ki&&(qi.textContent=Ji.name,Ki.classList.remove(`hidden`)))};Wi?.addEventListener(`change`,()=>i(Wi,Gi)),Gi?.addEventListener(`change`,()=>i(Gi,Wi)),Pa()}function ma(){if(z.length===0){xi&&(xi.innerHTML=`<div class="flex flex-col items-center justify-center h-full text-on-surface-variant/50"><span class="material-symbols-outlined text-5xl mb-2" style="font-variation-settings:'FILL' 1">shopping_cart</span><p class="text-sm font-medium">El carrito está vacío</p></div>`),$i&&($i.innerHTML=`<div class="flex flex-col items-center justify-center h-full py-8 text-on-surface-variant/50"><span class="material-symbols-outlined text-5xl mb-2" style="font-variation-settings:'FILL' 1">shopping_cart</span><p class="text-sm font-medium">El carrito está vacío</p><p class="text-xs mt-1 opacity-70">Agrega productos desde la pantalla</p></div>`),ga(0),_a(0,0);return}let e=0,t=z.map(t=>{let n=t.precioManual||0;return e+=n*t.qty,`
    <div class="bg-white border-2 ${n===0?`border-orange-400 animate-pulse`:`border-slate-100`} p-3 rounded-2xl flex gap-3 shadow-sm transition-all items-center">
      <button onclick="window.posRemoveItem('${t.id}')" class="text-slate-300 hover:text-red-500 transition-colors shrink-0 flex items-center justify-center">
        <span class="material-symbols-outlined text-[20px]">delete</span>
      </button>
      <div class="flex-1 min-w-0">
        <p class="text-[11px] font-black text-slate-800 truncate mb-1 uppercase">${t.nombre}</p>
        <div class="flex items-center bg-slate-50 rounded-lg px-2 border border-slate-200 focus-within:border-primary transition-colors">
          <span class="text-xs font-bold text-slate-400">$</span>
          <input type="text" value="${n===0?``:new Intl.NumberFormat(`es-CO`).format(n)}" placeholder="0" oninput="window.posUpdatePrice('${t.id}', this)" class="w-full py-1.5 px-1 text-sm font-black text-primary bg-transparent outline-none placeholder:text-slate-300" />
        </div>
      </div>
      <div class="flex flex-col justify-between items-end self-stretch">
        <div></div>
        <div class="flex items-center gap-2 bg-slate-100 rounded-xl p-1 border border-slate-200 mt-auto">
          <button onclick="window.posUpdateQty('${t.id}', -1)" class="w-7 h-7 bg-white shadow-sm rounded-lg flex items-center justify-center hover:bg-slate-50 active:scale-90 transition-all text-slate-600 font-bold">-</button>
          <span class="text-xs font-black w-5 text-center text-slate-700">${t.qty}</span>
          <button onclick="window.posUpdateQty('${t.id}', 1)" class="w-7 h-7 bg-white shadow-sm rounded-lg flex items-center justify-center hover:bg-slate-50 active:scale-90 transition-all text-slate-600 font-bold">+</button>
        </div>
      </div>
    </div>`}).join(``);xi&&(xi.innerHTML=t),$i&&($i.innerHTML=t);let n=document.getElementById(`pos-sheet-subtitle`),r=z.reduce((e,t)=>e+t.qty,0);n&&(n.textContent=`${r} producto${r===1?``:`s`}`),ga(e),_a(r,e)}function ha(){let e=0;z.forEach(t=>e+=(t.precioManual||t.precioVenta||0)*t.qty),ga(e),_a(z.reduce((e,t)=>e+t.qty,0),e)}function ga(e){let t=parseFloat(Ci?.value)||0,n=Math.max(0,e-t),r=e=>`$${new Intl.NumberFormat(`es-CO`).format(e)}`;Si&&(Si.textContent=r(e)),wi&&(wi.textContent=r(n)),ea&&(ea.textContent=r(e)),na&&(na.textContent=r(n))}function _a(e,t){let n=document.getElementById(`pos-fab-badge`),r=document.getElementById(`pos-fab-total`),i=document.getElementById(`pos-fab-label`);if(!n)return;e>0?(n.classList.remove(`hidden`),n.textContent=e,n.classList.remove(`cart-badge-bounce`),n.offsetWidth,n.classList.add(`cart-badge-bounce`)):n.classList.add(`hidden`);let a=parseFloat(Ci?.value)||0;r&&(r.textContent=`$${new Intl.NumberFormat(`es-CO`).format(Math.max(0,t-a))}`),i&&(i.textContent=e>0?`${e} producto${e===1?``:`s`}`:`Ver carrito`)}function va(e){if(!e)return!1;let t=(e.categoria||``).toLowerCase(),n=(e.nombre||``).toLowerCase(),r=(e.tipo||``).toLowerCase();return!!(t.includes(`celular`)||t.includes(`telefono`)||t.includes(`teléfono`)||r.includes(`celular`)||n.includes(`celular`)||n.includes(`telefono`)||n.includes(`teléfono`)||n.includes(`smartphone`)||hi.some(t=>t.id_producto===e.id||t.nombre&&e.nombre&&t.nombre.toLowerCase().trim()===e.nombre.toLowerCase().trim()))}function ya(){let e=z.filter(e=>va(R.find(t=>t.id===e.id)||e));if(!Ii||!Li)return;if(e.length===0){Ii.classList.add(`hidden`),Li.innerHTML=``;return}Ii.classList.remove(`hidden`);let t=``;e.forEach(e=>{let n=R.find(t=>t.id===e.id)||e,r=Number(e.qty)||1,i=hi.filter(e=>(e.id_producto&&e.id_producto===n.id||e.nombre&&n.nombre&&e.nombre.toLowerCase().trim()===n.nombre.toLowerCase().trim()||n.nombre&&e.nombre&&n.nombre.toLowerCase().includes(e.nombre.toLowerCase().trim()))&&(e.estado||``).toLowerCase()===`disponible`);for(let e=1;e<=r;e++){let a=`${n.id}_u${e}`,o=r>1?`${n.nombre} (Unidad #${e})`:n.nombre;i.length>0?t+=`
          <div class="bg-white dark:bg-slate-900 p-3 rounded-xl border border-amber-200 dark:border-amber-900/60 shadow-xs space-y-1.5" data-imei-card="${a}">
            <div class="flex items-center justify-between">
              <p class="text-[10px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-tight truncate">${o}</p>
              <span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center gap-0.5">
                <span class="material-symbols-outlined text-[11px]">inventory_2</span> ${i.length} en stock
              </span>
            </div>
            <div>
              <select data-id="${n.id}" data-unit="${e}" class="pos-imei-select w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-2 text-xs text-slate-800 dark:text-slate-100 font-mono outline-none focus:border-primary">
                <option value="">-- Seleccionar IMEI en Stock --</option>
                ${i.map((e,t)=>{let n=[];e.color&&n.push(e.color),e.ram&&n.push(e.ram),e.memoria&&n.push(e.memoria),e.condicion&&e.condicion!==`Nuevo`&&n.push(e.condicion);let r=n.length>0?` • ${n.join(` / `)}`:``;return`<option value="${e.imei1}">IMEI: ${e.imei1}${r}</option>`}).join(``)}
                <option value="__manual__">✏️ Ingresar o escanear otro IMEI...</option>
              </select>
              <div class="pos-imei-manual-container hidden mt-1.5 flex gap-1.5">
                <input type="text" placeholder="Escribir IMEI (15 dígitos)" data-id="${n.id}" data-unit="${e}" class="pos-imei-input w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-800 dark:text-slate-100 outline-none focus:border-primary">
                <button type="button" class="pos-imei-scan-btn px-2.5 py-1.5 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 rounded-lg border border-amber-300 dark:border-amber-700 hover:bg-amber-200 transition-all flex items-center justify-center shrink-0 active:scale-95" title="Escanear IMEI">
                  <span class="material-symbols-outlined text-[16px]">qr_code_scanner</span>
                </button>
              </div>
            </div>
          </div>
        `:t+=`
          <div class="bg-white dark:bg-slate-900 p-3 rounded-xl border border-amber-200 dark:border-amber-900/60 shadow-xs space-y-1.5" data-imei-card="${a}">
            <div class="flex items-center justify-between">
              <p class="text-[10px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-tight truncate">${o}</p>
              <span class="text-[9px] text-amber-700 dark:text-amber-400 font-medium">Ingreso manual</span>
            </div>
            <div class="flex gap-1.5">
              <input type="text" placeholder="Ingresar IMEI (15 dígitos)" data-id="${n.id}" data-unit="${e}" class="pos-imei-input w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-800 dark:text-slate-100 outline-none focus:border-primary">
              <button type="button" class="pos-imei-scan-btn px-2.5 py-1.5 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 rounded-lg border border-amber-300 dark:border-amber-700 hover:bg-amber-200 transition-all flex items-center justify-center shrink-0 active:scale-95" title="Escanear IMEI">
                <span class="material-symbols-outlined text-[16px]">qr_code_scanner</span>
              </button>
            </div>
          </div>
        `}}),Li.innerHTML=t}function ba(){[V,H].forEach(e=>{if(e&&e.offsetWidth>0){e.width=e.offsetWidth,e.height=e.offsetHeight;let t=e.getContext(`2d`);t.lineWidth=4,t.lineCap=`round`}})}function xa(e,t){let n=e.getContext(`2d`);t(n);let r=t=>{let n=e.getBoundingClientRect(),r=t.touches&&t.touches.length>0?t.touches[0]:t,i=r.clientX,a=r.clientY;if(e.id===`pos-canvas-fullscreen`&&window.innerHeight>window.innerWidth&&window.innerWidth<1024){let t=a-n.top,r=n.right-i;return{x:t*(e.width/n.height),y:r*(e.height/n.width)}}else{let t=i-n.left,r=a-n.top;return{x:t*(e.width/n.width),y:r*(e.height/n.height)}}},i=!1,a=e=>{i=!0,n.beginPath();let{x:t,y:a}=r(e);n.moveTo(t,a),e.preventDefault()},o=e=>{if(!i)return;let{x:t,y:a}=r(e);n.lineTo(t,a),n.stroke(),e.preventDefault()};e.addEventListener(`mousedown`,a),e.addEventListener(`mousemove`,o),e.addEventListener(`mouseup`,()=>i=!1),e.addEventListener(`touchstart`,a,{passive:!1}),e.addEventListener(`touchmove`,o,{passive:!1}),e.addEventListener(`touchend`,()=>i=!1)}function Sa(){Di.classList.remove(`hidden`),Di.classList.add(`flex`),[V,H].forEach(e=>{e.width=e.offsetWidth,e.height=e.offsetHeight;let t=e.getContext(`2d`);t.lineWidth=4,t.lineCap=`round`,t.clearRect(0,0,e.width,e.height);let n=e.id===`pos-canvas-cliente`,r=document.getElementById(n?`pos-sig-helper-cliente`:`pos-sig-helper-vendedor`);r&&r.classList.remove(`hidden`);let i=e.parentElement.querySelector(`button`);i&&i.classList.add(`hidden`)}),ji.value=``,Mi.value=``,Ni.value=``,document.querySelector(`input[name="pos-billing-type"][value="fisica"]`).checked=!0,document.getElementById(`pos-evidencia-container`).classList.remove(`hidden`),Pi.classList.add(`hidden`),Fi.classList.add(`hidden`),Ji=null,Wi&&(Wi.value=``),Gi&&(Gi.value=``),Ki&&Ki.classList.add(`hidden`),ya()}function Ca(){Di.classList.add(`hidden`),Di.classList.remove(`flex`)}async function wa(){if(_i)return;_i=!0;let e=document.querySelector(`input[name="pos-billing-type"]:checked`).value;Ai.textContent=`Procesando...`,Ai.disabled=!0;try{let t=``,n=``,r=``;if(e===`digital`){let e=document.createElement(`canvas`);if(e.width=V.width,e.height=V.height,V.toDataURL()!==e.toDataURL()){let e=await pt(V.toDataURL(`image/png`),`FirmaCliente_${Date.now()}.png`);t=typeof e==`string`?e:e?.url||``}if(H.toDataURL()!==e.toDataURL()){let e=await pt(H.toDataURL(`image/png`),`FirmaVendedor_${Date.now()}.png`);n=typeof e==`string`?e:e?.url||``}}if(e===`fisica`)if(Ji){Ai.textContent=`Subiendo evidencia...`;let e=Ji,t=await mt(await new Promise(t=>{let n=new FileReader;n.onload=e=>t(e.target.result),n.readAsDataURL(e)}),e.name,e.type);r=typeof t==`string`?t:t?.url||``}else{A(`Por favor sube la foto de la factura física`,`warning`),_i=!1,Ai.textContent=`Confirmar y Facturar`,Ai.disabled=!1;return}let i={};Li.querySelectorAll(`[data-imei-card]`).forEach(e=>{let t=e.querySelector(`.pos-imei-select`),n=e.querySelector(`.pos-imei-input`),r=``,a=``;t&&t.value&&t.value!==`__manual__`?(r=t.value.trim(),a=t.dataset.id):n&&n.value.trim()&&(r=n.value.trim(),a=n.dataset.id),r&&a&&(i[a]||(i[a]=[]),i[a].includes(r)||i[a].push(r))}),Ai.textContent=`Registrando venta...`;let a=Number(Si.textContent.replace(/\D/g,``)),o=Number(wi.textContent.replace(/\D/g,``)),s=JSON.parse(localStorage.getItem(`adminpro_user`)||`{}`),c={cedula:Ti.value.trim(),cliente:Ei.value.trim(),direccion:ji.value.trim(),ciudad:Mi.value.trim(),telefono:Ni.value.trim(),productoNombre:z.map(e=>`${e.nombre} (x${e.qty})`).join(`, `),productoId:z[0]?.id,items:z.map(e=>({id:e.id,qty:e.qty})),subtotal:a,descuento:Number(Ci.value)||0,total:o,metodo:document.getElementById(`pos-metodo-pago`).value,vendedor:s.nombre||`Vendedor`,firmaComprador:t,firmaVendedor:n,evidencia:r,tipoFactura:e,tipoVenta:vi,imeis:JSON.stringify(i),emisor:{nombre:B?.nombre||`MI NEGOCIO`,propietario:B?.propietario||`Juan Pérez`,nit:B?.nit||`900.123.456-1`,direccion:(B?.direccion||`Calle 123 No. 45 - 67`)+`, `+(B?.ciudad||`Bogotá - Cundinamarca`),contacto:B?.contacto||`3001234567`,correo:B?.correo||`contacto@miempresa.com`,condiciones:B?.condiciones||`GARANTIA: Equipos probados y encendidos. Sin garantía en displays/táctiles o equipos apagados. Doc. asimilado a letra de cambio (Art. 774 C.Comercio).`,logo:B?.logo||``,logo_size:B?.logo_size||40,mostrar_nombre:B?.mostrar_nombre!==0}},l=await Bt(c);if(l.success){vi!==`venta`&&await Ht({cliente:c.cliente,telefono:c.cedula,idFactura:l.idFactura,total:o,detalle:c.productoNombre,tipo:vi===`separe`?`Plan Separe`:`Crédito`}),A(`Venta Exitosa`,`success`);let t=e===`digital`?V.toDataURL():``,n=e===`digital`?H.toDataURL():``;Na({...c,idFactura:l.idFactura},t,n),z=[],ma(),Ti.value=``,Ei.value=``;let r=document.getElementById(`pos-metodo-pago`);r&&(r.value=`Efectivo`,Fa(`pos-metodo-pago-container`,`Efectivo`));let i=document.getElementById(`pos-metodo-pago-mobile`);i&&(i.value=`Efectivo`,Fa(`pos-metodo-pago-container-mobile`,`Efectivo`)),Ca(),await da(),fa(R),window.viewReloaders&&Object.keys(window.viewReloaders).forEach(e=>{try{window.viewReloaders[e]()}catch{}})}else A(`Error al guardar`,`error`)}catch(e){A(e.message,`error`)}finally{_i=!1,Ai.textContent=`Confirmar y Facturar`,Ai.disabled=!1}}var W=1,G=null,Ta=0;function Ea(){let e=()=>{if(ka().length===0){A(`No hay accesorios disponibles en el inventario para realizar una Venta Flash`,`warning`);return}oa()&&ca(),Da()};document.getElementById(`pos-btn-venta-flash`)?.addEventListener(`click`,e),document.getElementById(`pos-btn-venta-flash-mobile`)?.addEventListener(`click`,e),document.getElementById(`pos-header-venta-flash`)?.addEventListener(`click`,e),document.getElementById(`pos-pay-btn-flash`)?.addEventListener(`click`,e),document.getElementById(`pos-pay-btn-flash-mobile`)?.addEventListener(`click`,e),document.getElementById(`pos-flash-fab`)?.addEventListener(`click`,e),document.getElementById(`pos-flash-close-btn`)?.addEventListener(`click`,Oa),document.getElementById(`pos-flash-modal-overlay`)?.addEventListener(`click`,Oa);let t=document.getElementById(`pos-flash-search`);t&&t.addEventListener(`input`,e=>{Aa(e.target.value)});let n=document.getElementById(`pos-flash-price-input`);n&&n.addEventListener(`input`,e=>{let t=parseFloat(e.target.value);Ta=isNaN(t)?0:t}),document.getElementById(`pos-flash-back-btn`)?.addEventListener(`click`,()=>{W>1&&(W--,ja())}),document.getElementById(`pos-flash-next-btn`)?.addEventListener(`click`,()=>{if(W===1){if(!G)return A(`Selecciona un accesorio para continuar`,`warning`);W=2,ja()}else if(W===2){let e=document.getElementById(`pos-flash-price-input`),t=parseFloat(e?.value);if(isNaN(t)||t<0)return A(`Ingresa un precio de venta válido`,`warning`);Ta=t,W=3,ja()}}),document.getElementById(`pos-flash-confirm-btn`)?.addEventListener(`click`,Ma)}function Da(){W=1,G=null,Ta=0;let e=document.getElementById(`pos-flash-search`);e&&(e.value=``),ja(),Aa();let t=document.getElementById(`pos-flash-wizard-modal`);t&&(t.classList.remove(`hidden`),t.classList.add(`flex`))}function Oa(){let e=document.getElementById(`pos-flash-wizard-modal`);e&&(e.classList.add(`hidden`),e.classList.remove(`flex`)),W=1,G=null,Ta=0}function ka(){return R.filter(e=>{if(!e)return!1;let t=(e.categoria||``).toLowerCase(),n=(e.nombre||``).toLowerCase();return!(e.stockActual<=0||e.tipo===`equipo`||t.includes(`celular`)||n.includes(`celular`)||n.includes(`teléfono`))})}function Aa(e=``){let t=document.getElementById(`pos-flash-products-list`);if(!t)return;let n=e.toLowerCase().trim(),r=ka();if(n&&(r=r.filter(e=>e.nombre&&e.nombre.toLowerCase().includes(n)||e.sku&&e.sku.toLowerCase().includes(n)||e.marca&&e.marca.toLowerCase().includes(n))),r.length===0){t.innerHTML=`
      <div class="p-6 text-center text-slate-400 italic text-xs bg-slate-50 rounded-2xl border border-slate-100">
        <span class="material-symbols-outlined text-3xl mb-1 text-slate-300 block">search_off</span>
        No se encontraron accesorios disponibles en inventario
      </div>
    `;return}t.innerHTML=r.map(e=>`
    <div onclick="window.posSelectFlashProduct('${e.id}')"
      class="p-3 bg-slate-50 hover:bg-amber-50/80 border border-slate-200 hover:border-amber-400 rounded-2xl cursor-pointer flex items-center justify-between gap-3 transition-all active:scale-[0.99] group">
      <div class="flex items-center gap-3 min-w-0 flex-1">
        <div class="w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
          ${e.imagen?`<img src="${e.imagen}" class="w-full h-full object-cover group-hover:scale-110 transition-transform" />`:`<span class="material-symbols-outlined text-slate-400 text-xl">widgets</span>`}
        </div>
        <div class="min-w-0 flex-1">
          <h4 class="font-black text-xs text-slate-900 truncate uppercase group-hover:text-amber-900 transition-colors">${e.nombre}</h4>
          <div class="flex items-center gap-2 mt-0.5">
            <span class="text-[9px] font-bold px-1.5 py-0.5 bg-slate-200 text-slate-700 rounded">${e.marca||`GENÉRICO`}</span>
            <span class="text-[10px] text-slate-500 font-medium">Stock: ${e.stockActual}</span>
          </div>
        </div>
      </div>
      <div class="text-right flex-shrink-0">
        <div class="font-black text-sm text-slate-900">$${new Intl.NumberFormat(`es-CO`).format(e.precioVenta||0)}</div>
        <span class="text-[10px] font-bold text-amber-600 group-hover:underline">Elegir →</span>
      </div>
    </div>
  `).join(``)}window.posSelectFlashProduct=function(e){let t=R.find(t=>t.id===e);if(!t)return;G=t,Ta=t.precioVenta||0;let n=document.getElementById(`pos-flash-item-name`),r=document.getElementById(`pos-flash-item-brand`),i=document.getElementById(`pos-flash-item-stock`),a=document.getElementById(`pos-flash-item-img-container`),o=document.getElementById(`pos-flash-normal-price-display`),s=document.getElementById(`pos-flash-price-input`);n&&(n.textContent=t.nombre),r&&(r.textContent=t.marca||`GENÉRICO`),i&&(i.textContent=`Stock: ${t.stockActual}`),o&&(o.textContent=`$${new Intl.NumberFormat(`es-CO`).format(t.precioVenta||0)}`),s&&(s.value=Ta),a&&(a.innerHTML=t.imagen?`<img src="${t.imagen}" class="w-full h-full object-cover" />`:`<span class="material-symbols-outlined text-slate-400 text-3xl">widgets</span>`),W=2,ja()};function ja(){let e=document.getElementById(`pos-flash-step-1-content`),t=document.getElementById(`pos-flash-step-2-content`),n=document.getElementById(`pos-flash-step-3-content`),r=document.getElementById(`pos-flash-step-indicator-1`),i=document.getElementById(`pos-flash-step-indicator-2`),a=document.getElementById(`pos-flash-step-indicator-3`),o=document.getElementById(`pos-flash-line-1`),s=document.getElementById(`pos-flash-line-2`),c=document.getElementById(`pos-flash-back-btn`),l=document.getElementById(`pos-flash-next-btn`),u=document.getElementById(`pos-flash-confirm-btn`);e?.classList.add(`hidden`),t?.classList.add(`hidden`),n?.classList.add(`hidden`);let d=(e,t)=>{let n=e?.querySelector(`span`);t?(e?.classList.remove(`text-slate-400`),e?.classList.add(`text-amber-600`),n?.classList.remove(`bg-slate-200`,`text-slate-600`),n?.classList.add(`bg-amber-500`,`text-white`)):(e?.classList.remove(`text-amber-600`),e?.classList.add(`text-slate-400`),n?.classList.remove(`bg-amber-500`,`text-white`),n?.classList.add(`bg-slate-200`,`text-slate-600`))};if(d(r,W>=1),d(i,W>=2),d(a,W>=3),o&&(W>=2?(o.classList.remove(`bg-slate-200`),o.classList.add(`bg-amber-500`)):(o.classList.remove(`bg-amber-500`),o.classList.add(`bg-slate-200`))),s&&(W>=3?(s.classList.remove(`bg-slate-200`),s.classList.add(`bg-amber-500`)):(s.classList.remove(`bg-amber-500`),s.classList.add(`bg-slate-200`))),W===1)e?.classList.remove(`hidden`),c?.classList.add(`hidden`),l?.classList.add(`hidden`),u?.classList.add(`hidden`);else if(W===2)t?.classList.remove(`hidden`),c?.classList.remove(`hidden`),l?.classList.remove(`hidden`),u?.classList.add(`hidden`);else if(W===3){n?.classList.remove(`hidden`);let e=document.getElementById(`pos-flash-summary-product`),t=document.getElementById(`pos-flash-summary-normal-price`),r=document.getElementById(`pos-flash-summary-final-price`);e&&(e.textContent=G?.nombre||`Accesorio`),t&&(t.textContent=`$${new Intl.NumberFormat(`es-CO`).format(G?.precioVenta||0)}`),r&&(r.textContent=`$${new Intl.NumberFormat(`es-CO`).format(Ta||0)}`),c?.classList.remove(`hidden`),l?.classList.add(`hidden`),u?.classList.remove(`hidden`)}}async function Ma(){if(_i)return;if(!G)return A(`No se seleccionó ningún accesorio`,`warning`);_i=!0;let e=document.getElementById(`pos-flash-confirm-btn`);e&&(e.disabled=!0,e.innerHTML=`<span class="material-symbols-outlined text-[18px] animate-spin">sync</span> Procesando...`),A(`Procesando Venta Flash...`,`info`);try{let e=JSON.parse(localStorage.getItem(`adminpro_user`)||`{}`),t=Number(G.precioVenta||0),n=Number(Ta||0),r=t>n?t-n:0,i={cedula:`9999999999`,cliente:`Cliente Flash`,direccion:`N/A`,ciudad:`N/A`,telefono:`N/A`,productoNombre:G.nombre,productoId:G.id,items:[{id:G.id,nombre:G.nombre,qty:1,precioManual:n,precioVenta:n}],subtotal:t>0?t:n,descuento:r,total:n,metodo:`Efectivo`,vendedor:e.nombre||`Vendedor`,firmaComprador:``,firmaVendedor:``,evidencia:``,tipoFactura:`flash`,tipoVenta:`venta`,imeis:`N/A`,emisor:{nombre:B?.nombre||`MI NEGOCIO`,propietario:B?.propietario||`Juan Pérez`,nit:B?.nit||`900.123.456-1`,direccion:(B?.direccion||`Calle 123 No. 45 - 67`)+`, `+(B?.ciudad||`Bogotá - Cundinamarca`),contacto:B?.contacto||`3001234567`,correo:B?.correo||`contacto@miempresa.com`,condiciones:B?.condiciones||`GARANTIA: Equipos probados y encendidos. Sin garantía en displays/táctiles o equipos apagados. Doc. asimilado a letra de cambio (Art. 774 C.Comercio).`,logo:B?.logo||``,logo_size:B?.logo_size||40,mostrar_nombre:B?.mostrar_nombre!==0}},a=await Bt(i);a.success?(A(`⚡ Venta Flash registrada con éxito`,`success`),Na({...i,idFactura:a.idFactura},``,``),Oa(),await da(),fa(R)):A(`Error al guardar venta flash`,`error`)}catch(e){A(e.message||`Error al procesar la venta flash`,`error`)}finally{_i=!1,e&&(e.disabled=!1,e.innerHTML=`<span class="material-symbols-outlined text-[20px]" style="font-variation-settings:'FILL' 1">bolt</span><span>Confirmar y Finalizar Venta ⚡</span>`)}}function Na(e,t,n){let r=`COMPROBANTE DE VENTA`,i=`PAGADO`,a=`background: #dcfce7; color: #166534;`;e.tipoFactura===`flash`?(r=`COMPROBANTE VENTA FLASH`,i=`FLASH`,a=`background: #f3e8ff; color: #6b21a8;`):e.tipoVenta===`credito`?(r=`COMPROBANTE DE CRÉDITO`,i=`CRÉDITO`,a=`background: #fee2e2; color: #991b1b;`):e.tipoVenta===`separe`&&(r=`COMPROBANTE PLAN SEPARE`,i=`SEPARADO`,a=`background: #fef3c7; color: #92400e;`);let o=new Date,s=`${o.getDate()}/${o.getMonth()+1}/${o.getFullYear()} ${o.getHours()}:${o.getMinutes()}`,c=``;try{let t=JSON.parse(e.imeis||`{}`);c=Object.values(t).flat().join(`, `)}catch{e.imeis&&e.imeis!==`N/A`&&e.imeis!==`{}`&&(c=e.imeis)}let l=(e.items&&e.items.length>0?e.items:z).map(t=>`
    <tr>
      <td style="padding: 3px 0; border-bottom: 1px solid #eee;">
        <div style="font-weight: 800;">${(t.nombre||e.productoNombre||`Producto`).substring(0,25)}</div>
        <div style="color: #555;">${t.qty||1} x $${new Intl.NumberFormat(`es-CO`).format(t.precioManual!==void 0&&t.precioManual!==null?t.precioManual:t.precioVenta||e.total||0)}</div>
      </td>
      <td style="text-align: right; vertical-align: bottom; padding: 3px 0; border-bottom: 1px solid #eee; font-weight: 800;">
        $${new Intl.NumberFormat(`es-CO`).format((t.precioManual!==void 0&&t.precioManual!==null?t.precioManual:t.precioVenta||e.total||0)*(t.qty||1))}
      </td>
    </tr>
  `).join(``),u=(localStorage.getItem(`fonebase_paper_format`)||`80mm`)===`58mm`?`48mm`:`80mm`,d=`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          @page { size: ${u} auto; margin: 0; }
          html, body { 
            width: ${u}; 
            margin: 0; 
            padding: 0; 
            background: #fff;
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }
          body { 
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; 
            padding: 2mm; 
            font-size: 10px; 
            color: #1e293b;
            line-height: 1.3;
          }
          .bold { font-weight: 900; }
          .text-xs { font-size: 8px; }
          .text-sm { font-size: 11px; }
          .text-lg { font-size: 14px; }
          .text-xl { font-size: 18px; }
          .text-slate-500 { color: #64748b; }
          .text-slate-400 { color: #94a3b8; }
          
          .card { 
            border: 1px solid #e2e8f0; 
            border-radius: 6px; 
            padding: 4px; 
            margin-bottom: 6px; 
            background: #f8fafc;
          }
          .flex-between { display: flex; justify-content: space-between; align-items: flex-start; }
          
          .section-title {
            font-size: 7px;
            font-weight: 900;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 2px;
            margin-top: 4px;
          }
          .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; }
          .product-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 4px;
            padding: 4px;
            margin-bottom: 4px;
          }
          .summary-card {
            background: #0f172a;
            color: white;
            border-radius: 6px;
            padding: 6px;
            margin-top: 6px;
          }
          .legal { font-size: 7px; text-align: justify; margin-top: 8px; color: #64748b; }
          .center { text-align: center; }
        </style>
      </head>
      <body>
        ${e.emisor.logo?`<div style="text-align: center; margin-bottom: 4px;"><img src="${e.emisor.logo}" style="max-height: ${e.emisor.logo_size||40}px; max-width: 100%; object-fit: contain;"></div>`:``}
        <div class="center" style="margin-bottom: 6px; font-size: 8px; line-height: 1.2; border: 1px solid #e2e8f0; border-radius: 6px; padding: 4px; background: #f8fafc;">
          ${e.emisor.mostrar_nombre?`<div class="bold text-sm" style="text-transform: uppercase; color: #000;">${e.emisor.nombre}</div>`:``}
          <div>NIT: ${e.emisor.nit}</div>
          <div>${e.emisor.direccion}</div>
          <div>Tel: ${e.emisor.contacto}</div>
        </div>
        <div class="card">
          <div class="text-xs text-primary bold" style="color: #dc2626; text-transform: uppercase;">${r}</div>
          <div class="flex-between" style="margin-top: 2px;">
            <div class="text-lg bold" style="line-height: 1;">${e.idFactura||e.id_factura}</div>
            <div style="padding: 2px 4px; border-radius: 8px; font-size: 8px; font-weight: 900; text-transform: uppercase; ${a}">${i}</div>
          </div>
          <div class="flex-between" style="margin-top: 2px;">
            <div class="text-xs text-slate-500">${s}</div>
            <div class="text-xs bold">${e.metodo||`Efectivo`}</div>
          </div>
        </div>
        <div class="grid-2">
          <div>
            <div class="section-title">INFORMACIÓN DEL CLIENTE</div>
            <div class="bold text-sm">${e.cliente}</div>
            <div class="text-xs text-slate-500">ID: ${e.cedula}</div>
            <div class="text-xs text-slate-500"><span class="text-slate-400 bold">Tel:</span> ${e.telefono}</div>
            <div class="text-xs text-slate-500"><span class="text-slate-400 bold">Ubicación:</span> ${e.direccion}, ${e.ciudad}</div>
          </div>
          <div>
            <div class="section-title">ATENDIDO POR</div>
            <div class="bold text-sm">${e.vendedor||`Vendedor`}</div>
            <div class="text-xs text-slate-400" style="font-style: italic;">Vendedor Autorizado</div>
            <div class="text-xs bold" style="color: #dc2626; background: #fef2f2; display: inline-block; padding: 1px 4px; border-radius: 4px; margin-top: 2px; text-transform: uppercase;">${e.tipoFactura||`DIGITAL`}</div>
          </div>
        </div>
        <div style="border-top: 1px solid #f1f5f9; margin: 6px 0;"></div>
        <div class="section-title">DETALLE DE PRODUCTOS</div>
        <table style="width: 100%; border-collapse: collapse;">${l}</table>
        ${c&&c!==`{}`?`<div class="text-xs bold" style="color:#dc2626; margin-top: 4px; margin-bottom: 4px;">IMEI/SERIE: ${c}</div>`:``}
        <div class="summary-card">
          <div class="flex-between" style="align-items: flex-end;">
            <div>
              <div class="section-title" style="color: #94a3b8; margin-top: 0;">RESUMEN FINANCIERO</div>
              <div class="text-xs" style="color: #cbd5e1;">Subtotal: $${new Intl.NumberFormat(`es-CO`).format(e.subtotal)}</div>
              <div class="text-xs bold" style="color: #f87171;">Descuento: -$${new Intl.NumberFormat(`es-CO`).format(e.descuento)}</div>
            </div>
            <div style="text-align: right;">
              <div class="section-title" style="color: #94a3b8; margin-top: 0; margin-bottom: 0;">TOTAL COBRADO</div>
              <div class="text-xl bold text-white" style="line-height: 1;">$${new Intl.NumberFormat(`es-CO`).format(e.total)}</div>
            </div>
          </div>
        </div>
        <div style="margin-top: 8px; display: flex; flex-direction: column; gap: 6px;">
           <div class="center">
             <div class="text-xs bold text-slate-400">FIRMA COMPRADOR</div>
             <div style="border: 1px solid #e2e8f0; border-radius: 4px; background: #f8fafc; height: 45px; margin-top: 2px; display: flex; justify-content: center; align-items: center; width: 100%;">
               ${t?`<img src="${t}" style="height: 40px; max-width: 100%; object-fit: contain;">`:``}
             </div>
           </div>
           <div class="center">
             <div class="text-xs bold text-slate-400">FIRMA VENDEDOR</div>
             <div style="border: 1px solid #e2e8f0; border-radius: 4px; background: #f8fafc; height: 45px; margin-top: 2px; display: flex; justify-content: center; align-items: center; width: 100%;">
               ${n?`<img src="${n}" style="height: 40px; max-width: 100%; object-fit: contain;">`:``}
             </div>
           </div>
        </div>
        <div class="legal">
          ${e.emisor.condiciones||`GARANTIA: Equipos probados y encendidos. Sin garantía en displays/táctiles o equipos apagados. Doc. asimilado a letra de cambio (Art. 774 C.Comercio).`}
        </div>
        <div class="center bold" style="margin-top: 8px; font-size: 11px;">¡GRACIAS POR SU COMPRA!</div>
      </body>
    </html>
  `,f=document.getElementById(`print-iframe`);f&&f.remove(),f=document.createElement(`iframe`),f.id=`print-iframe`,f.style.position=`absolute`,f.style.width=`0`,f.style.height=`0`,f.style.border=`none`,f.style.visibility=`hidden`,document.body.appendChild(f);let p=f.contentWindow.document;p.open(),p.write(d),p.close(),setTimeout(()=>{f.contentWindow.focus(),f.contentWindow.print()},250)}function Pa(){let e=(e,t,n)=>{let r=document.getElementById(e);if(!r)return;let i=r.querySelector(`.custom-select-trigger`),a=r.querySelector(`.custom-select-options`),o=document.getElementById(t),s=r.querySelectorAll(`.custom-option`);i.addEventListener(`click`,e=>{e.stopPropagation(),document.querySelectorAll(`.custom-select-options`).forEach(e=>{e!==a&&e.classList.add(`hidden`)}),a.classList.toggle(`hidden`)}),s.forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.value,r=e.querySelector(`.material-symbols-outlined`).textContent,c=e.querySelector(`.flex-1`).textContent;i.querySelector(`.selected-label`).textContent=c,i.querySelector(`.material-symbols-outlined`).textContent=r,s.forEach(t=>{let n=t.querySelector(`.check-icon`);t===e?n.classList.remove(`hidden`):n.classList.add(`hidden`)}),o&&(o.value=t,o.dispatchEvent(new Event(`change`,{bubbles:!0}))),a.classList.add(`hidden`),n&&n(t)})})};e(`pos-metodo-pago-container`,`pos-metodo-pago`,e=>{Fa(`pos-metodo-pago-container-mobile`,e)}),e(`pos-metodo-pago-container-mobile`,`pos-metodo-pago-mobile`,e=>{Fa(`pos-metodo-pago-container`,e);let t=document.getElementById(`pos-metodo-pago`);t&&(t.value=e)}),document.addEventListener(`click`,()=>{document.querySelectorAll(`.custom-select-options`).forEach(e=>{e.classList.add(`hidden`)})})}function Fa(e,t){let n=document.getElementById(e);if(!n)return;let r=n.querySelector(`.custom-select-trigger`),i=n.querySelectorAll(`.custom-option`),a=Array.from(i).find(e=>e.dataset.value===t);if(a){let e=a.querySelector(`.material-symbols-outlined`).textContent,t=a.querySelector(`.flex-1`).textContent;r.querySelector(`.selected-label`).textContent=t,r.querySelector(`.material-symbols-outlined`).textContent=e,i.forEach(e=>{let t=e.querySelector(`.check-icon`);e===a?t.classList.remove(`hidden`):t.classList.add(`hidden`)})}}window.__posAddReventaToCart=e=>{let t=R.find(t=>t.id===e.id);t?t.stockActual=Math.max(t.stockActual,999):R.unshift({id:e.id,nombre:e.nombre,sku:e.id,marca:e.marca||`GENERICO`,categoria:e.categoria||`Celulares`,precioVenta:e.precioVenta||0,costo:e.costo||0,stockActual:999});let n=z.find(t=>t.id===e.id);n?n.qty++:z.push({id:e.id,nombre:e.nombre,qty:1,precioManual:e.precioVenta||0}),fa(R),ma(),f(`pos`),A(`Reventa de ${e.nombre} agregada al carrito`,`success`)};var Ia=[],La=!1,Ra=!1,za,Ba,Va,Ha,Ua,Wa,Ga,Ka,qa,Ja,Ya,K,Xa,Za,Qa,$a,q,eo,to,no,ro,io,ao,oo,so,J,co,lo,uo,fo,po,mo,ho,go,_o,vo,yo,bo,xo,So,Co,wo,To,Eo,Do,Oo,Y,ko,X=[],Ao=[];function jo(){return async()=>{Mo(),window.viewReloaders=window.viewReloaders||{},window.viewReloaders.imei=async()=>{await No()},La||=(Bo(),!0),await No()}}function Mo(){za=document.getElementById(`imei-table-body`),Ba=document.getElementById(`imei-search`),Va=document.getElementById(`imei-filter-status`),Ha=document.getElementById(`imei-new-btn`),Ua=document.getElementById(`imei-modal`),Wa=document.getElementById(`imei-modal-close`),Ga=document.getElementById(`imei-modal-backdrop`),Ka=document.getElementById(`imei-form`),qa=document.getElementById(`imei-save-btn`),Ja=document.getElementById(`imei-1`),Ya=document.getElementById(`imei-2`),K=document.getElementById(`imei-nombre`),Xa=document.getElementById(`imei-marca`),Za=document.getElementById(`imei-proveedor`),Qa=document.getElementById(`imei-costo`),$a=document.getElementById(`imei-venta`),q=document.getElementById(`imei-precio-revendedor`),eo=document.getElementById(`imei-estado`),to=document.getElementById(`imei-original`),no=document.getElementById(`imei-color`),ro=document.getElementById(`imei-ram`),io=document.getElementById(`imei-memoria`),ao=document.getElementById(`imei-condicion`),oo=document.getElementById(`imei-notas`),so=document.getElementById(`imei-dropdown-trigger`),J=document.getElementById(`imei-dropdown-menu`),co=document.getElementById(`imei-dropdown-search`),lo=document.getElementById(`imei-dropdown-options`),uo=document.getElementById(`imei-dropdown-selected-text`),po=document.getElementById(`imei-bulk-modal`),mo=document.getElementById(`imei-bulk-modal-close`),ho=document.getElementById(`imei-bulk-modal-backdrop`),_o=document.getElementById(`imei-bulk-save-btn`),vo=document.getElementById(`imei-bulk-file`),yo=document.getElementById(`imei-bulk-card-content`),bo=document.getElementById(`imei-bulk-results-container`),xo=document.getElementById(`imei-bulk-list`),So=document.getElementById(`imei-bulk-count`),Co=document.getElementById(`imei-bulk-add-row-btn`),wo=document.getElementById(`imei-bulk-dropdown-trigger`),To=document.getElementById(`imei-bulk-dropdown-menu`),Eo=document.getElementById(`imei-bulk-dropdown-search`),Do=document.getElementById(`imei-bulk-dropdown-options`),Oo=document.getElementById(`imei-bulk-dropdown-selected-text`),Y=document.getElementById(`imei-bulk-nombre`),ko=document.getElementById(`imei-bulk-proveedor`)}async function No(){try{Mo(),za&&(za.innerHTML=`<tr><td colspan="6" class="p-4 text-center text-on-surface-variant">Cargando equipos...</td></tr>`),Ia=await Pt(),Ao=await P(),Po(),Fo(),zo()}catch(e){A(`Error cargando equipos: `+e.message,`error`),Ia=[],za&&Ro([])}}function Po(e=``){let t=e.toLowerCase().trim(),n=Ao.filter(e=>!t||e.nombre.toLowerCase().includes(t)||e.marca&&e.marca.toLowerCase().includes(t)),r=`
    <div onclick="window.imeiSelectProduct('__NEW_PRODUCT__')" class="flex items-center gap-3 px-4 py-3 hover:bg-primary/5 text-primary font-black text-xs cursor-pointer border-b border-slate-100 transition-colors">
      <div class="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
        <span class="material-symbols-outlined text-[18px]">add</span>
      </div>
      <span>+ Registrar Nuevo Producto...</span>
    </div>
  `;n.length===0?r+=`
      <div class="px-4 py-6 text-center text-xs text-slate-400">
        No se encontraron productos
      </div>
    `:r+=n.map(e=>{let t=new Intl.NumberFormat(`es-CO`,{style:`currency`,currency:`COP`,maximumFractionDigits:0}).format(e.precioVenta||0),n=e.imagen?`<img src="${e.imagen}" class="w-8 h-8 rounded-lg object-cover bg-slate-50" referrerpolicy="no-referrer">`:`<div class="w-8 h-8 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center"><span class="material-symbols-outlined text-[18px]">phone_android</span></div>`;return`
        <div onclick="window.imeiSelectProduct('${e.id}')" class="flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-50/50">
          <div class="flex items-center gap-3 min-w-0">
            ${n}
            <div class="min-w-0">
              <p class="text-xs font-black text-slate-800 truncate">${e.nombre}</p>
              <p class="text-[10px] text-slate-400 uppercase font-bold">${e.marca||`Genérico`}</p>
            </div>
          </div>
          <div class="text-right flex-shrink-0 ml-2">
            <span class="text-xs font-black text-primary">${t}</span>
          </div>
        </div>
      `}).join(``),lo&&(lo.innerHTML=r)}window.imeiSelectProduct=e=>{if(e===`__NEW_PRODUCT__`){J&&J.classList.add(`hidden`),window.inventoryView&&window.inventoryView.openNuevo&&window.inventoryView.openNuevo(!1,`Celulares`);return}let t=Ao.find(t=>t.id===e);if(!t)return;K&&(K.value=t.nombre,K.dataset.id=t.id);let n=t.imagen?`<img src="${t.imagen}" class="w-6 h-6 rounded-md object-cover bg-slate-50" referrerpolicy="no-referrer">`:`<span class="material-symbols-outlined text-[16px] text-slate-400">phone_android</span>`;if(uo&&(uo.innerHTML=`
      <div class="flex items-center gap-2">
        ${n}
        <span class="font-black text-slate-800 text-xs">${t.nombre}</span>
        <span class="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold uppercase">${t.marca||`Genérico`}</span>
      </div>
    `,uo.classList.remove(`text-slate-500`)),Xa&&(Xa.value=t.marca||``),Qa&&(Qa.value=new Intl.NumberFormat(`es-CO`).format(t.costo||0)),$a&&($a.value=new Intl.NumberFormat(`es-CO`).format(t.precioVenta||0)),q&&t.costo){let e=Math.ceil(Math.max(Number(t.costo)*1.05,Number(t.costo)+2e4)/1e3)*1e3;q.value=new Intl.NumberFormat(`es-CO`).format(e)}J&&J.classList.add(`hidden`)};function Fo(e=``){let t=e.toLowerCase().trim(),n=Ao.filter(e=>!t||e.nombre.toLowerCase().includes(t)||e.marca&&e.marca.toLowerCase().includes(t)),r=``;r=n.length===0?`<div class="px-4 py-4 text-center text-xs text-slate-400">No se encontraron productos</div>`:n.map(e=>{let t=new Intl.NumberFormat(`es-CO`,{style:`currency`,currency:`COP`,maximumFractionDigits:0}).format(e.precioVenta||0),n=e.imagen?`<img src="${e.imagen}" class="w-8 h-8 rounded-lg object-cover bg-slate-50" referrerpolicy="no-referrer">`:`<div class="w-8 h-8 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center"><span class="material-symbols-outlined text-[18px]">phone_android</span></div>`;return`
        <div onclick="window.imeiSelectBulkProduct('${e.id}')" class="flex items-center justify-between px-4 py-2 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-50/50">
          <div class="flex items-center gap-3 min-w-0">
            ${n}
            <div class="min-w-0">
              <p class="text-xs font-black text-slate-800 truncate">${e.nombre}</p>
              <p class="text-[9px] text-slate-400 uppercase font-bold">${e.marca||`Genérico`}</p>
            </div>
          </div>
          <div class="text-right flex-shrink-0 ml-2">
            <span class="text-xs font-black text-primary">${t}</span>
          </div>
        </div>
      `}).join(``),Do&&(Do.innerHTML=r)}window.imeiSelectBulkProduct=e=>{let t=Ao.find(t=>t.id===e);if(!t)return;Y&&(Y.value=t.nombre,Y.dataset.id=t.id,Y.dataset.marca=t.marca||``,Y.dataset.costo=t.costo||0,Y.dataset.venta=t.precioVenta||0);let n=t.imagen?`<img src="${t.imagen}" class="w-6 h-6 rounded-md object-cover bg-slate-50" referrerpolicy="no-referrer">`:`<span class="material-symbols-outlined text-[16px] text-slate-400">phone_android</span>`;Oo&&(Oo.innerHTML=`
      <div class="flex items-center gap-2">
        ${n}
        <span class="font-black text-slate-800 text-xs">${t.nombre}</span>
        <span class="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold uppercase">${t.marca||`Genérico`}</span>
      </div>
    `,Oo.classList.remove(`text-slate-500`)),To&&To.classList.add(`hidden`),Lo()};function Io(){if(xo){if(X.length===0){xo.innerHTML=`<p class="p-4 text-center text-xs opacity-50 italic">No hay IMEIs en la lista. Carga una foto o agrégalos manualmente.</p>`,So&&(So.textContent=`0`),Lo();return}So&&(So.textContent=X.length),xo.innerHTML=X.map((e,t)=>`
    <div class="imei-bulk-row bg-white p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shadow-sm transition-all hover:border-slate-300" data-index="${t}">
      <div class="flex items-center gap-2 shrink-0">
        <input type="checkbox" ${e.selected?`checked`:``} class="imei-bulk-checkbox w-4.5 h-4.5 accent-primary cursor-pointer" onchange="window.imeiToggleBulkSelect(${t}, this.checked)" />
        <span class="text-[10px] font-bold text-slate-400 font-mono">#${t+1}</span>
      </div>
      <div class="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div class="flex items-center gap-1.5">
          <span class="text-[10px] font-black text-slate-400 uppercase shrink-0 w-10">IMEI 1</span>
          <input type="text" maxlength="15" placeholder="IMEI Principal" value="${e.imei1||``}" 
            class="imei-bulk-input-1 w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-mono outline-none focus:border-primary" 
            oninput="window.imeiUpdateBulkVal(${t}, 'imei1', this.value)" />
        </div>
        <div class="flex items-center gap-1.5">
          <span class="text-[10px] font-black text-slate-400 uppercase shrink-0 w-10">IMEI 2</span>
          <input type="text" maxlength="15" placeholder="IMEI 2 (Opcional)" value="${e.imei2||``}" 
            class="imei-bulk-input-2 w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-mono outline-none focus:border-primary" 
            oninput="window.imeiUpdateBulkVal(${t}, 'imei2', this.value)" />
        </div>
      </div>
      <button type="button" onclick="window.imeiDeleteBulkRow(${t})" 
        class="p-1.5 text-slate-400 hover:text-error hover:bg-error/10 rounded-lg transition-colors shrink-0 flex items-center justify-center" title="Eliminar fila">
        <span class="material-symbols-outlined text-[18px]">delete</span>
      </button>
    </div>
  `).join(``),Lo()}}window.imeiToggleBulkSelect=(e,t)=>{X[e]&&(X[e].selected=t),Lo()},window.imeiUpdateBulkVal=(e,t,n)=>{let r=n.replace(/\D/g,``);X[e]&&(X[e][t]=r),Lo()},window.imeiDeleteBulkRow=e=>{X.splice(e,1),Io()};function Lo(){let e=Y.dataset.id,t=X.some(e=>e.selected&&e.imei1.length===15);_o.disabled=!e||!t}window.__onProductCreated=async e=>{Ao=await P(),window.imeiSelectProduct(e.id)};function Ro(e){let t=za||document.getElementById(`imei-table-body`);if(!t)return;if(!Array.isArray(e)||e.length===0){t.innerHTML=`<tr><td colspan="6" class="p-4 text-center text-on-surface-variant">No se encontraron equipos</td></tr>`;return}let n=JSON.parse(localStorage.getItem(`adminpro_user`)||`{}`).rol===`Administrador`;t.innerHTML=e.map(e=>{e.estado;let t=e.estado===`Disponible`?`bg-green-50 text-green-700 border border-green-100`:e.estado===`Vendido`?`bg-slate-50 text-slate-500 border border-slate-100`:`bg-amber-50 text-amber-700 border border-amber-100`;return`
      <tr class="hover:bg-surface-container-low transition-colors">
        <td class="px-4 py-3">
          <div class="font-mono text-xs font-bold text-on-surface">${e.imei1||`-`}</div>
          ${e.imei2?`<div class="font-mono text-[10px] text-on-surface-variant">${e.imei2}</div>`:``}
        </td>
        <td class="px-4 py-3">
          <p class="font-black text-sm text-on-surface">${e.nombre||`-`}</p>
          <p class="text-[11px] text-on-surface-variant font-medium">${e.marca||`N/A`}</p>
          ${e.color||e.ram||e.memoria?`
          <div class="flex flex-wrap gap-1 mt-1">
            ${e.color?`<span class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-50 text-blue-600 border border-blue-100">${e.color}</span>`:``}
            ${e.ram?`<span class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-violet-50 text-violet-600 border border-violet-100">${e.ram}</span>`:``}
            ${e.memoria?`<span class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-600 border border-slate-200">${e.memoria}</span>`:``}
          </div>`:``}
        </td>
        <td class="px-4 py-3">
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase ${t}">
            ${e.estado||`Desconocido`}
          </span>
        </td>
        <td class="px-4 py-3">
          <div class="flex flex-col gap-1">
            <div class="flex items-center gap-1.5">
              <span class="text-sm font-black text-primary" title="Precio Cliente Final">$${new Intl.NumberFormat(`es-CO`).format(parseInt(String(e.venta||0).replace(/\D/g,``))||0)}</span>
              <span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary uppercase">Público</span>
            </div>
            ${e.precio_revendedor&&Number(e.precio_revendedor)>0?`
            <div class="flex items-center gap-1.5">
              <span class="text-xs font-black text-amber-600 dark:text-amber-400" title="Precio Especial Revendedor">$${new Intl.NumberFormat(`es-CO`).format(parseInt(String(e.precio_revendedor).replace(/\D/g,``))||0)}</span>
              <span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 uppercase">Revendedor</span>
            </div>`:``}
            <p class="text-[10px] text-on-surface-variant line-through hidden md:block">Costo: $${new Intl.NumberFormat(`es-CO`).format(parseInt(String(e.costo||0).replace(/\D/g,``))||0)}</p>
          </div>
        </td>
        <td class="px-4 py-3 text-right">
          <div class="flex items-center justify-end gap-1">
            ${n?`<button onclick="window.imeiEdit('${e.imei1}')" class="p-1.5 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-full transition-colors" title="Editar">
              <span class="material-symbols-outlined text-[18px]">edit</span>
            </button>`:``}
            ${n?`<button onclick="window.imeiDelete('${e.imei1}')" class="p-1.5 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-full transition-colors" title="Eliminar">
              <span class="material-symbols-outlined text-[18px]">delete</span>
            </button>`:``}
          </div>
        </td>
      </tr>
    `}).join(``)}function zo(){let e=Ba?Ba.value.toLowerCase().trim():``,t=Va?Va.value:``;Ro(Ia.filter(n=>{let r=(n.imei1||``).toLowerCase().includes(e)||(n.imei2||``).toLowerCase().includes(e)||(n.nombre||``).toLowerCase().includes(e),i=t?n.estado===t:!0;return r&&i}))}function Bo(){let e=e=>{let t=e.target.value.replace(/\D/g,``);if(!t){e.target.value=``;return}e.target.value=new Intl.NumberFormat(`es-CO`).format(parseInt(t,10))};Qa&&Qa.addEventListener(`input`,e),$a&&$a.addEventListener(`input`,e),q&&q.addEventListener(`input`,e),so&&J&&so.addEventListener(`click`,()=>{J.classList.toggle(`hidden`),J.classList.contains(`hidden`)||(co&&(co.value=``,co.focus()),Po())}),co&&co.addEventListener(`input`,e=>{Po(e.target.value)}),document.addEventListener(`click`,e=>{so&&J&&!so.contains(e.target)&&!J.contains(e.target)&&J.classList.add(`hidden`)}),Ba&&Ba.addEventListener(`input`,zo),window.setupCustomSelect&&(window.setupCustomSelect(`imei-filter-status-container`,`imei-filter-status`,zo),window.setupCustomSelect(`imei-estado-container`,`imei-estado`)),document.getElementById(`imei-scan-btn`)?.addEventListener(`click`,()=>{Ue({title:`Escanear IMEI`,filter:/^\d{14,16}$/,filterLabel:`IMEI`,onScan:e=>{Ba.value=e,zo(),A(`IMEI: ${e}`,`info`)}})}),document.getElementById(`imei-label-file`)?.addEventListener(`change`,async e=>{let t=e.target.files[0];if(!t)return;let n=document.getElementById(`imei-label-card-content`);if(!n)return;let r=n.innerHTML;n.innerHTML=`
      <div class="flex flex-col items-center justify-center py-2 text-primary">
        <span class="material-symbols-outlined animate-spin text-[28px] mb-2">progress_activity</span>
        <p class="text-xs font-black text-slate-800">Procesando etiqueta con IA...</p>
        <p class="text-[10px] text-slate-400 mt-0.5">Analizando la imagen en alta resolución</p>
      </div>
    `;try{let e=new FileReader,n=await _t(await new Promise((n,r)=>{e.onload=e=>n(e.target.result),e.onerror=e=>r(e),e.readAsDataURL(t)}),t.type);if(console.log(`[AI IMEI Label Analysis Result]:`,n),!n.success)throw Error(n.mensaje||`No se pudo analizar la etiqueta`);let r=n.data;console.log(`[Parsed AI IMEI Data]:`,JSON.stringify(r,null,2)),r.imei1&&(Ja.value=r.imei1),r.imei2&&(Ya.value=r.imei2),r.imei1&&r.imei2?A(`Se detectaron y cargaron 2 IMEIs con IA ✨`,`success`):r.imei1?A(`Se detectó y cargó 1 IMEI con IA ✨`,`success`):A(`No se detectaron IMEIs válidos en la foto`,`warning`);let i=!1;if(r.name){let e=r.name.toLowerCase().trim(),t=Ao.find(t=>{let n=t.nombre.toLowerCase();return n.includes(e)||e.includes(n)});t&&(window.imeiSelectProduct(t.id),A(`Producto emparejado: ${t.nombre}`,`success`),i=!0)}if(!i&&r.name&&(r.brand&&(Xa.value=r.brand),A(`Producto no registrado: "${r.brand||``} ${r.name}". Regístralo o selecciónalo manualmente.`,`info`)),r.cost){let e=parseInt(String(r.cost).replace(/\D/g,``),10);e&&(Qa.value=new Intl.NumberFormat(`es-CO`).format(e))}if(r.price){let e=parseInt(String(r.price).replace(/\D/g,``),10);e&&($a.value=new Intl.NumberFormat(`es-CO`).format(e))}}catch(e){console.error(`AI IMEI Label Error:`,e),A(`Error al procesar la foto: `+e.message,`error`)}finally{n.innerHTML=r,e.target.value=``}}),document.getElementById(`imei-scan-1`)?.addEventListener(`click`,()=>{Ue({title:`Escanear IMEI 1`,filter:/^\d{14,16}$/,filterLabel:`IMEI`,onScan:(e,t)=>{t&&t.length>=2?(Ja.value=t[0],Ya.value=t[1],A(`IMEI 1 y 2 cargados con éxito`,`success`)):(Ja.value=e,A(`IMEI 1: ${e}`,`success`))}})}),document.getElementById(`imei-scan-2`)?.addEventListener(`click`,()=>{Ue({title:`Escanear IMEI 2`,filter:/^\d{14,16}$/,filterLabel:`IMEI`,onScan:(e,t)=>{t&&t.length>=2?(Ja.value=t[0],Ya.value=t[1],A(`IMEI 1 y 2 cargados con éxito`,`success`)):(Ya.value=e,A(`IMEI 2: ${e}`,`success`))}})}),Ha.addEventListener(`click`,()=>Vo(null)),Wa.addEventListener(`click`,Ho),Ga.addEventListener(`click`,Ho),qa.addEventListener(`click`,Uo),window.imeiEdit=e=>{let t=Ia.find(t=>t.imei1==e);t&&Vo(t)},window.imeiDelete=async e=>{if(await j(`Confirmación`,`¿Eliminar el equipo con IMEI ${e}?`))try{A(`Eliminando...`,`info`);let t=await Lt(e);t&&t.success?(A(`Equipo eliminado`,`success`),await No(),zo()):A(t.mensaje||`Error al eliminar`,`error`)}catch(e){A(`Error: `+e.message,`error`)}};let t=()=>{X=[],Y.value=``,Y.removeAttribute(`data-id`),ko.value=``,Oo.innerHTML=`Seleccione el equipo en común...`,Oo.classList.add(`text-slate-500`),bo.classList.add(`hidden`),xo.innerHTML=``,po.classList.remove(`hidden`),po.classList.add(`flex`),Lo()},n=()=>{po.classList.add(`hidden`),po.classList.remove(`flex`)};fo?.addEventListener(`click`,t),mo?.addEventListener(`click`,n),go?.addEventListener(`click`,n),ho?.addEventListener(`click`,n),wo?.addEventListener(`click`,()=>{To.classList.toggle(`hidden`),To.classList.contains(`hidden`)||(Eo.value=``,Eo.focus(),Fo())}),Eo?.addEventListener(`input`,e=>{Fo(e.target.value)}),Co?.addEventListener(`click`,()=>{X.push({imei1:``,imei2:``,selected:!0}),bo.classList.remove(`hidden`),Io()}),vo?.addEventListener(`change`,async e=>{let t=e.target.files[0];if(!t)return;let n=yo.innerHTML;yo.innerHTML=`
      <div class="flex flex-col items-center justify-center py-4 text-primary">
        <span class="material-symbols-outlined animate-spin text-[32px] mb-2">progress_activity</span>
        <p class="text-xs font-black text-slate-800">Procesando lote de IMEIs con IA...</p>
        <p class="text-[10px] text-slate-400 mt-0.5">Analizando imagen y extrayendo números de serie</p>
      </div>
    `;try{let e=new FileReader,n=await vt(await new Promise((n,r)=>{e.onload=e=>n(e.target.result),e.onerror=e=>r(e),e.readAsDataURL(t)}),t.type);if(console.log(`[AI Bulk IMEIs Analysis Result]:`,n),!n.success)throw Error(n.mensaje||`No se pudieron analizar los IMEIs`);let r=(n.data.imeis||[]).map(e=>e.replace(/\D/g,``)).filter(e=>e.length>=14&&e.length<=16);r.length===0?A(`No se encontraron IMEIs de 15 dígitos en la imagen`,`warning`):(A(`La IA detectó ${r.length} IMEIs con éxito ✨`,`success`),r.forEach(e=>{X.some(t=>t.imei1===e)||X.push({imei1:e.substring(0,15),imei2:``,selected:!0})}),bo.classList.remove(`hidden`),Io())}catch(e){console.error(`AI Bulk IMEIs Error:`,e),A(`Error al procesar: `+e.message,`error`)}finally{yo.innerHTML=n,e.target.value=``}}),_o?.addEventListener(`click`,async()=>{let e=Y.dataset.id,t=Y.value,r=Y.dataset.marca||``,i=parseInt(Y.dataset.costo)||0,a=parseInt(Y.dataset.venta)||0,o=ko.value.trim(),s=X.filter(e=>e.selected&&e.imei1.length===15);if(s.length===0){A(`No hay IMEIs válidos de 15 dígitos seleccionados`,`warning`);return}if(!Ra){Ra=!0,_o.textContent=`Registrando lote...`,_o.disabled=!0;try{let c=s.map(n=>({imei1:n.imei1,imei2:n.imei2,id_producto:e,nombre:t,marca:r,proveedor:o,costo:i,venta:a,estado:`Disponible`})),l=await Rt(c);l&&l.success?(A(`✅ Se registraron ${c.length} equipos con éxito`,`success`),n(),await No(),Ro(Ia)):A(l?.mensaje||`Error al registrar lote`,`error`)}catch(e){A(`Error de conexión: `+e.message,`error`)}finally{Ra=!1,_o.innerHTML=`<span class="material-symbols-outlined text-[18px]">check_circle</span> Registrar Lote`,Lo()}}}),document.addEventListener(`click`,e=>{so&&!so.contains(e.target)&&J&&!J.contains(e.target)&&J.classList.add(`hidden`),wo&&!wo.contains(e.target)&&To&&!To.contains(e.target)&&To.classList.add(`hidden`)})}function Vo(e){if(Ka.reset(),e){to.value=e.imei1,Ja.value=e.imei1,Ya.value=e.imei2||``,K.value=e.nombre||``,K.dataset.id=e.id_producto||``,Xa.value=e.marca||``,Za.value=e.proveedor||``,Qa.value=e.costo?new Intl.NumberFormat(`es-CO`).format(parseInt(String(e.costo).replace(/\D/g,``))||0):``,$a.value=e.venta?new Intl.NumberFormat(`es-CO`).format(parseInt(String(e.venta).replace(/\D/g,``))||0):``,q&&(q.value=e.precio_revendedor?new Intl.NumberFormat(`es-CO`).format(parseInt(String(e.precio_revendedor).replace(/\D/g,``))||0):``),eo.value=e.estado||`Disponible`,no&&(no.value=e.color||``),ro&&(ro.value=e.ram||``),io&&(io.value=e.memoria||``),ao&&(ao.value=e.condicion||`Nuevo`),oo&&(oo.value=e.notas||``);let t=Ao.find(t=>t.id===e.id_producto),n=t&&t.imagen?`<img src="${t.imagen}" class="w-6 h-6 rounded-md object-cover bg-slate-50" referrerpolicy="no-referrer">`:`<span class="material-symbols-outlined text-[16px] text-slate-400">phone_android</span>`;uo.innerHTML=`
      <div class="flex items-center gap-2">
        ${n}
        <span class="font-black text-slate-800 text-xs">${e.nombre||`—`}</span>
        <span class="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold uppercase">${e.marca||`Genérico`}</span>
      </div>
    `,uo.classList.remove(`text-slate-500`),document.getElementById(`imei-modal-title`).textContent=`Editar Equipo`}else to.value=``,Ja.value=``,Ya.value=``,K.value=``,K.removeAttribute(`data-id`),Xa.value=``,Za.value=``,Qa.value=``,$a.value=``,q&&(q.value=``),eo.value=`Disponible`,no&&(no.value=``),ro&&(ro.value=``),io&&(io.value=``),ao&&(ao.value=`Nuevo`),oo&&(oo.value=``),uo.innerHTML=`Seleccione un equipo...`,uo.classList.add(`text-slate-500`),document.getElementById(`imei-modal-title`).textContent=`Registrar Equipo`;window.syncCustomSelectUI&&window.syncCustomSelectUI(`imei-estado-container`,eo.value),Ua.classList.remove(`hidden`),Ua.classList.add(`flex`)}function Ho(){Ua.classList.add(`hidden`),Ua.classList.remove(`flex`)}async function Uo(){if(!Ja.value.trim()){A(`El IMEI Principal es obligatorio`,`warning`),Ja.focus();return}if(!K.value){A(`Debe seleccionar un equipo del inventario`,`warning`);return}if(!Ra){Ra=!0,qa.textContent=`Guardando...`,qa.disabled=!0;try{let e=to.value,t=K.dataset.id||``,n=K.value.trim(),r=e?Ia.find(t=>t.imei1==e):null,i={imei1:Ja.value.trim(),imei2:Ya.value.trim(),id_producto:t,nombre:n,marca:Xa.value.trim(),proveedor:Za.value.trim(),costo:parseInt(Qa.value.replace(/\D/g,``))||0,venta:parseInt($a.value.replace(/\D/g,``))||0,precio_revendedor:q&&parseInt(q.value.replace(/\D/g,``))||0,estado:eo.value,color:no?no.value.trim():``,ram:ro?ro.value.trim():``,memoria:io?io.value.trim():``,condicion:ao?ao.value:`Nuevo`,notas:oo?oo.value.trim():``,fecha_ingreso:r?r.fecha_ingreso:new Date().toISOString()},a;a=e?await It(e,i):await Ft(i),a&&a.success?(A(`Equipo guardado`,`success`),Ho(),await No(),Ro(Ia)):A(a?.mensaje||`Error al guardar`,`error`)}catch(e){A(`Error de conexión: `+e.message,`error`)}finally{Ra=!1,qa.innerHTML=`<span class="material-symbols-outlined text-[18px]">save</span> Guardar`,qa.disabled=!1}}}var Wo=[],Go=!1,Ko=!1,qo,Jo,Yo,Xo,Zo,Qo,$o,es,ts,ns,rs,is,as,os,ss;function cs(){return async()=>{ls(),window.viewReloaders=window.viewReloaders||{},window.viewReloaders.clients=async()=>{await us(),ds(Wo)},Go||=(await us(),fs(),!0);let e=localStorage.getItem(`clients_search_query`);if(e!==null&&(localStorage.removeItem(`clients_search_query`),Jo)){Jo.value=e;let t=e.toLowerCase().trim();ds(Wo.filter(e=>(e.cedula||``).toLowerCase().includes(t)||(e.nombre||``).toLowerCase().includes(t)||(e.telefono||``).toLowerCase().includes(t)));return}ds(Wo)}}function ls(){qo=document.getElementById(`cli-table-body`),Jo=document.getElementById(`cli-search`),Yo=document.getElementById(`cli-new-btn`),Xo=document.getElementById(`cli-modal`),Zo=document.getElementById(`cli-modal-close`),Qo=document.getElementById(`cli-modal-backdrop`),$o=document.getElementById(`cli-form`),es=document.getElementById(`cli-save-btn`),ts=document.getElementById(`cli-doc`),ns=document.getElementById(`cli-nombre`),rs=document.getElementById(`cli-tel`),is=document.getElementById(`cli-email`),as=document.getElementById(`cli-dir`),os=document.getElementById(`cli-tipo`),ss=document.getElementById(`cli-original`)}async function us(){try{qo.innerHTML=`<tr><td colspan="6" class="p-4 text-center text-on-surface-variant">Cargando clientes...</td></tr>`,Wo=await Et()}catch(e){A(`Error cargando clientes: `+e.message,`error`),Wo=[]}}function ds(e){if(e.length===0){qo.innerHTML=`<tr><td colspan="6" class="p-4 text-center text-on-surface-variant">No se encontraron clientes</td></tr>`;return}let t=JSON.parse(localStorage.getItem(`adminpro_user`)||`{}`).rol===`Administrador`;qo.innerHTML=e.map(e=>{let n=e.tipo===`VIP`?`bg-amber-50 text-amber-700 border border-amber-100`:e.tipo===`Empresa`?`bg-blue-50 text-blue-700 border border-blue-100`:e.tipo===`Mayorista`?`bg-purple-50 text-purple-700 border border-purple-100`:`bg-slate-50 text-slate-500 border border-slate-100`,r=(e.nombre||`C`).split(` `).filter(Boolean).map(e=>e[0]).join(``).substring(0,2).toUpperCase();return`
      <tr class="hover:bg-surface-container-low transition-colors">
        <td class="px-4 py-3 font-mono text-xs font-bold text-on-surface hidden md:table-cell">${e.cedula||`-`}</td>
        <td class="px-4 py-3">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-primary/5 text-primary flex items-center justify-center font-black text-xs shrink-0 border border-primary/10">
              ${r}
            </div>
            <div>
              <p class="font-black text-sm text-on-surface">${e.nombre||`-`}</p>
              <p class="text-[10px] text-on-surface-variant font-mono md:hidden">Doc: ${e.cedula||`-`}</p>
            </div>
          </div>
        </td>
        <td class="px-4 py-3">
          <div class="flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant mb-0.5">
            <span class="material-symbols-outlined text-[15px] text-primary/65">call</span> ${e.telefono||`-`}
          </div>
          ${e.email?`<div class="flex items-center gap-1.5 text-[11px] text-on-surface-variant"><span class="material-symbols-outlined text-[15px] text-primary/45">mail</span> ${e.email}</div>`:``}
        </td>
        <td class="px-4 py-3 text-sm text-on-surface-variant hidden md:table-cell">${e.direccion||`-`}</td>
        <td class="px-4 py-3">
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase ${n}">
            ${e.tipo||`Normal`}
          </span>
        </td>
        <td class="px-4 py-3 text-right">
          <div class="flex items-center justify-end gap-1">
            ${t?`<button onclick="window.cliEdit('${e.cedula}')" class="p-1.5 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-full transition-colors" title="Editar">
              <span class="material-symbols-outlined text-[18px]">edit</span>
            </button>`:``}
            ${t?`<button onclick="window.cliDelete('${e.cedula}')" class="p-1.5 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-full transition-colors" title="Eliminar">
              <span class="material-symbols-outlined text-[18px]">delete</span>
            </button>`:``}
          </div>
        </td>
      </tr>
    `}).join(``)}function fs(){let e=()=>{let e=Jo.value.toLowerCase().trim();ds(Wo.filter(t=>(t.cedula||``).toLowerCase().includes(e)||(t.nombre||``).toLowerCase().includes(e)||(t.telefono||``).toLowerCase().includes(e)))};Jo.addEventListener(`input`,e),window.setupCustomSelect&&window.setupCustomSelect(`cli-tipo-container`,`cli-tipo`),Yo.addEventListener(`click`,()=>ps(null)),Zo.addEventListener(`click`,ms),Qo.addEventListener(`click`,ms),es.addEventListener(`click`,hs),window.cliEdit=e=>{let t=Wo.find(t=>t.cedula==e);t&&ps(t)},window.cliDelete=async t=>{if(await j(`Confirmación`,`¿Eliminar al cliente con documento ${t}?`))try{A(`Eliminando...`,`info`);let n=await kt(t);n&&n.success?(A(`Cliente eliminado`,`success`),await us(),e()):A(n.mensaje||`Error al eliminar`,`error`)}catch(e){A(`Error: `+e.message,`error`)}}}function ps(e){$o.reset(),e?(ss.value=e.cedula,ts.value=e.cedula,ns.value=e.nombre||``,rs.value=e.telefono||``,is.value=e.email||``,as.value=e.direccion||``,os.value=e.tipo||`Normal`,document.getElementById(`cli-modal-title`).textContent=`Editar Cliente`):(ss.value=``,os.value=`Normal`,document.getElementById(`cli-modal-title`).textContent=`Nuevo Cliente`),window.syncCustomSelectUI&&window.syncCustomSelectUI(`cli-tipo-container`,os.value),Xo.classList.remove(`hidden`),Xo.classList.add(`flex`)}function ms(){Xo.classList.add(`hidden`),Xo.classList.remove(`flex`)}async function hs(){if(!$o.checkValidity()){$o.reportValidity();return}if(!Ko){Ko=!0,es.textContent=`Guardando...`,es.disabled=!0;try{let e=ss.value,t={cedula:ts.value.trim(),nombre:ns.value.trim(),telefono:rs.value.trim(),email:is.value.trim(),direccion:as.value.trim(),tipo:os.value},n;n=e?await Ot(e,t):await Dt(t),n&&n.success?(A(`Cliente guardado`,`success`),ms(),await us(),ds(Wo)):A(n?.mensaje||`Error al guardar`,`error`)}catch(e){A(`Error de conexión: `+e.message,`error`)}finally{Ko=!1,es.innerHTML=`<span class="material-symbols-outlined text-[18px]">save</span> Guardar`,es.disabled=!1}}}var Z=[],gs=!1,_s=!1;function vs(){return async()=>{window.viewReloaders=window.viewReloaders||{},window.viewReloaders.credits=async()=>{await ys(),Ts(Z)},gs||=(await ys(),Es(),!0),Ts(Z)}}async function ys(){let e=document.getElementById(`cred-table-body`);e&&(e.innerHTML=`<tr><td colspan="9" class="p-6 text-center text-on-surface-variant">Cargando créditos...</td></tr>`);try{Z=await Vt()}catch(e){A(`Error cargando créditos: `+e.message,`error`),Z=[]}}var bs=e=>`$`+new Intl.NumberFormat(`es-CO`).format(Math.round(e||0));function xs(e,t){if(!e)return 0;let n=e=>{if(!e)return null;let t=String(e).split(`/`);return t.length===3?new Date(t[2],t[1]-1,t[0]):new Date(e)},r=n(e),i=t?n(t):new Date;return!r||isNaN(r)?0:Math.max(0,Math.floor((i-r)/864e5))}function Ss(e){return e?e.split(`;`).filter(Boolean).map(e=>{let t=e.split(`|`);return{fecha:t[0]||``,monto:parseFloat(t[1])||0,nota:t[2]||``,metodo:t[3]||`Efectivo`,evidencia:t[4]||``}}):[]}function Cs(e){return e.map(e=>`${e.fecha}|${e.monto}|${e.nota}|${e.metodo||`Efectivo`}|${e.evidencia||``}`).join(`;`)}function ws(e){let t=0,n=0;e.forEach(e=>{e.estado!==`Cancelado`&&(t+=e.saldo||0),n+=e.abonado||0});let r=document.getElementById(`cred-stat-total`),i=document.getElementById(`cred-stat-recaudo`);r&&(r.textContent=bs(t)),i&&(i.textContent=bs(n))}function Ts(e){ws(Z);let t=document.getElementById(`cred-table-body`);if(t){if(e.length===0){t.innerHTML=`<tr><td colspan="9" class="p-6 text-center text-on-surface-variant">No se encontraron créditos</td></tr>`;return}t.innerHTML=e.map(e=>{let t=e.estado===`Cancelado`||e.estado===`Entregado`,n=xs(e.fecha,t?e.fechaCancelacion:null),r=t?`bg-green-100 text-green-800`:e.estado===`En Mora`?`bg-red-100 text-red-800`:`bg-orange-100 text-orange-800`,i=e.tipo===`Plan Separe`?`bg-emerald-100 text-emerald-800 border-emerald-200`:`bg-blue-100 text-blue-800 border-blue-200`,a=t?`<span class="text-[10px] text-on-surface-variant">Pagó en ${n}d</span>`:`<span class="text-[10px] font-bold ${n>30?`text-red-500`:`text-orange-500`}">${n} días</span>`,o=String(e.telefono||``).replace(/\D/g,``),s=`https://wa.me/57${o}?text=${encodeURIComponent(`Hola ${e.cliente}, le recordamos que tiene un saldo pendiente de ${bs(e.saldo)} con nosotros. Gracias.`)}`;return`
      <tr class="hover:bg-surface-container-low transition-colors ${t?`opacity-60`:``}">
        <td class="px-4 py-3">
          <p class="font-bold text-sm text-on-surface">${e.cliente||`-`}</p>
          <p class="text-[11px] text-on-surface-variant">${e.telefono||``}</p>
          <div class="md:hidden mt-1 text-[11px] text-on-surface-variant flex flex-col gap-0.5 border-t border-surface-variant/30 pt-1">
            <div><span class="font-semibold text-slate-500">Deuda:</span> ${e.fecha||`-`}</div>
            <div><span class="font-semibold text-slate-500">Total:</span> ${bs(e.total)} | <span class="font-semibold text-green-600">Abonado:</span> ${bs(e.abonado)}</div>
            ${e.idFactura?`<div><span class="font-semibold text-slate-500">Ref:</span> <span class="font-mono">${e.idFactura}</span></div>`:``}
          </div>
        </td>
        <td class="px-4 py-3 font-mono text-xs text-on-surface-variant hidden md:table-cell">${e.idFactura||`-`}</td>
        <td class="px-4 py-3 text-sm text-on-surface-variant hidden md:table-cell">${e.fecha||`-`}</td>
        <td class="px-4 py-3">
          <span class="px-2 py-0.5 border rounded-full text-[10px] font-bold uppercase tracking-wider ${i}">${e.tipo||`Crédito`}</span>
        </td>
        <td class="px-4 py-3 text-sm font-medium hidden md:table-cell">${bs(e.total)}</td>
        <td class="px-4 py-3 text-sm font-medium text-green-600 hidden md:table-cell">${bs(e.abonado)}</td>
        <td class="px-4 py-3 text-sm font-black text-error">${bs(e.saldo)}</td>
        <td class="px-4 py-3 text-center">${a}</td>
        <td class="px-4 py-3">
          <span class="px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase ${r}">${e.estado||`Activo`}</span>
        </td>
        <td class="px-4 py-3">
          <div class="flex items-center gap-1.5 justify-end">
            ${o?`<a href="${s}" target="_blank"
                class="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors flex items-center justify-center" title="Enviar WhatsApp">
                <span class="material-symbols-outlined text-[20px]">chat</span>
              </a>`:``}
            <button onclick="window.credImprimirTicket('${e.id}')"
                class="p-2 text-primary hover:bg-surface-container rounded-full transition-colors flex items-center justify-center" title="Imprimir Comprobante/Historial">
                <span class="material-symbols-outlined text-[20px]">print</span>
            </button>
            ${t?`<span class="text-xs text-green-600 font-semibold flex items-center gap-0.5"><span class="material-symbols-outlined text-[16px]">check_circle</span> Pagado</span>`:`<button onclick="window.credAddAbono('${e.id}')"
                class="px-3.5 py-1.5 bg-primary text-on-primary hover:bg-primary/95 rounded-xl text-xs font-bold transition-all shadow-sm">
                Abonar
              </button>`}
          </div>
        </td>
      </tr>
    `}).join(``)}}function Es(){let e=document.getElementById(`cred-search`),t=document.getElementById(`cred-filter-status`),n=document.getElementById(`cred-filter-tipo`),r=()=>{let r=(e?.value||``).toLowerCase().trim(),i=t?.value||``,a=n?.value||``;Ts(Z.filter(e=>{let t=(e.cliente||``).toLowerCase().includes(r)||(e.idFactura||``).toLowerCase().includes(r),n=i?e.estado===i:!0,o=a?(e.tipo||`Crédito`)===a:!0;return t&&n&&o}))};e?.addEventListener(`input`,r),window.setupCustomSelect&&(window.setupCustomSelect(`cred-filter-tipo-container`,`cred-filter-tipo`,r),window.setupCustomSelect(`cred-filter-status-container`,`cred-filter-status`,r),window.setupCustomSelect(`cred-metodo-abono-container`,`cred-metodo-abono`));let i=e=>{let t=e.target.value.replace(/\D/g,``);e.target.value=t?new Intl.NumberFormat(`es-CO`).format(parseInt(t)):``};document.getElementById(`cred-new-total`)?.addEventListener(`input`,i),document.getElementById(`cred-new-abono`)?.addEventListener(`input`,i),document.getElementById(`cred-monto-abono`)?.addEventListener(`input`,i);let a=document.getElementById(`cred-modal`),o=document.getElementById(`cred-modal-close`),s=document.getElementById(`cred-modal-backdrop`),c=document.getElementById(`cred-save-btn`),l=()=>{a?.classList.add(`hidden`),a?.classList.remove(`flex`)};o?.addEventListener(`click`,l),s?.addEventListener(`click`,l),window.credAddAbono=e=>{let t=Z.find(t=>t.id==e);if(!t)return;document.getElementById(`cred-id`).value=t.id,document.getElementById(`cred-cliente-name`).textContent=t.cliente,document.getElementById(`cred-saldo-actual`).textContent=bs(t.saldo);let n=Ss(t.historialAbonos),r=document.getElementById(`cred-historial`);r&&(r.innerHTML=n.length===0?`<p class="text-xs text-on-surface-variant">Sin abonos anteriores</p>`:n.map(e=>`
            <div class="flex justify-between items-start py-2 border-b border-surface-variant/40 last:border-0 text-xs">
              <div class="flex flex-col">
                <span class="font-bold text-on-surface">${e.fecha}</span>
                <span class="text-[10px] text-on-surface-variant mt-0.5">
                  <span class="bg-primary/10 text-primary px-1.5 py-0.5 rounded font-black uppercase text-[8px]">${e.metodo||`Efectivo`}</span>
                  ${e.nota?`• `+e.nota:``}
                </span>
              </div>
              <div class="flex items-center gap-2">
                ${e.evidencia?`
                  <button onclick="window.credVerEvidencia('${e.evidencia.replace(/'/g,`\\'`)}')" class="p-1 hover:bg-surface-container rounded-full text-primary flex items-center justify-center" title="Ver Evidencia">
                    <span class="material-symbols-outlined text-[16px]">visibility</span>
                  </button>
                `:``}
                <span class="font-bold text-green-600">${bs(e.monto)}</span>
              </div>
            </div>`).join(``)),document.getElementById(`cred-monto-abono`).value=``,document.getElementById(`cred-nota-abono`).value=``;let i=document.getElementById(`cred-abono-img-file`);i&&(i.value=``);let o=document.getElementById(`cred-abono-evidencia`);o&&(o.value=``);let s=document.getElementById(`cred-abono-img-preview`);s&&(s.innerHTML=`<span class="material-symbols-outlined text-xl text-slate-400">add_a_photo</span>`);let c=document.getElementById(`cred-metodo-abono`);c&&(c.value=`Efectivo`,window.syncCustomSelectUI&&window.syncCustomSelectUI(`cred-metodo-abono-container`,`Efectivo`)),a?.classList.remove(`hidden`),a?.classList.add(`flex`),document.getElementById(`cred-monto-abono`)?.focus()};let u=document.getElementById(`cred-abono-img-file`),d=document.getElementById(`cred-abono-img-preview`),f=document.getElementById(`cred-abono-evidencia`);u?.addEventListener(`change`,e=>{let t=e.target.files[0];if(!t)return;d&&(d.innerHTML=`<span class="animate-spin material-symbols-outlined text-xl text-primary">sync</span>`);let n=new FileReader;n.onload=async e=>{try{let t=e.target.result,n=await ot(t,800,800,.7);f&&(f.value=n),d&&(d.innerHTML=`<img src="${n}" class="w-full h-full object-cover" />`)}catch(e){A(`Error al procesar la imagen: `+e.message,`error`),d&&(d.innerHTML=`<span class="material-symbols-outlined text-xl text-red-500">error</span>`)}},n.onerror=()=>{A(`Error al leer el archivo`,`error`),d&&(d.innerHTML=`<span class="material-symbols-outlined text-xl text-red-500">error</span>`)},n.readAsDataURL(t)});let p=document.getElementById(`cred-evidencia-modal`),m=document.getElementById(`cred-evidencia-close`),h=document.getElementById(`cred-evidencia-btn-close`),g=document.getElementById(`cred-evidencia-backdrop`),_=document.getElementById(`cred-evidencia-img`),v=()=>{p?.classList.add(`hidden`),p?.classList.remove(`flex`)};m?.addEventListener(`click`,v),h?.addEventListener(`click`,v),g?.addEventListener(`click`,v),window.credVerEvidencia=e=>{e&&(_&&(_.src=e),p?.classList.remove(`hidden`),p?.classList.add(`flex`))},c?.addEventListener(`click`,async()=>{let e=document.getElementById(`cred-id`).value,t=parseInt((document.getElementById(`cred-monto-abono`).value||``).replace(/\D/g,``))||0,n=(document.getElementById(`cred-nota-abono`)?.value||``).trim(),r=document.getElementById(`cred-metodo-abono`)?.value||`Efectivo`,i=document.getElementById(`cred-abono-evidencia`)?.value||``;if(!t||t<=0){A(`Ingresa un monto válido`,`warning`);return}if(!i){A(`La foto de la evidencia de pago es obligatoria`,`warning`);return}if(!_s){_s=!0,c.textContent=`Aplicando...`,c.disabled=!0;try{let a=Z.find(t=>t.id==e),o=Number(a.abonado||0)+t,s=Math.max(0,Number(a.total||0)-o),c=s<=0,u=Ss(a.historialAbonos),d=new Date,f=`${d.toLocaleDateString(`es-CO`)} ${d.toLocaleTimeString(`es-CO`,{hour:`2-digit`,minute:`2-digit`,hour12:!0})}`;u.push({fecha:f,monto:t,nota:n,metodo:r,evidencia:i});let p=a.tipo===`Plan Separe`,m=p?`Separado`:`Activo`,h=p?`Entregado`:`Cancelado`,g={...a,abonado:o,saldo:s,estado:c||a.estado===`Cancelado`||a.estado===`Entregado`?h:m,fechaCancelacion:c?f:a.fechaCancelacion||``,historialAbonos:Cs(u)},_=await Ut(e,g);_?.success?(A(c?`✅ ¡Crédito cancelado!`:`Abono registrado`,`success`),l(),Ds(g,t,n),gs=!1,await ys(),Ts(Z)):A(_?.mensaje||`Error al guardar`,`error`)}catch(e){A(`Error: `+e.message,`error`)}finally{_s=!1,c.innerHTML=`<span class="material-symbols-outlined text-[18px]">save</span> Aplicar Abono`,c.disabled=!1}}});let y=document.getElementById(`cred-new-modal`),b=()=>{y?.classList.add(`hidden`),y?.classList.remove(`flex`)};document.getElementById(`cred-new-btn`)?.addEventListener(`click`,()=>{document.getElementById(`cred-new-form`)?.reset(),document.getElementById(`cred-new-cliente`).value=``,document.getElementById(`cred-new-cliente-doc`).value=``,y?.classList.remove(`hidden`),y?.classList.add(`flex`)}),document.getElementById(`cred-new-close`)?.addEventListener(`click`,b),document.getElementById(`cred-new-backdrop`)?.addEventListener(`click`,b),document.getElementById(`cred-select-client-btn`)?.addEventListener(`click`,()=>{Yr(e=>{document.getElementById(`cred-new-cliente`).value=e.nombre,document.getElementById(`cred-new-cliente-doc`).value=e.cedula||e.documento||e.telefono||``})}),document.getElementById(`cred-save-new-btn`)?.addEventListener(`click`,async()=>{let e=document.getElementById(`cred-new-cliente`).value.trim(),t=document.getElementById(`cred-new-cliente-doc`).value.trim(),n=parseInt((document.getElementById(`cred-new-total`).value||``).replace(/\D/g,``))||0,r=parseInt((document.getElementById(`cred-new-abono`)?.value||``).replace(/\D/g,``))||0,i=document.getElementById(`cred-new-detalle`).value.trim();if(!e||!n){A(`Cliente y monto son requeridos`,`warning`);return}let a=document.getElementById(`cred-save-new-btn`);a.disabled=!0,a.textContent=`Guardando...`;try{let a=new Date,o=`${a.toLocaleDateString(`es-CO`)} ${a.toLocaleTimeString(`es-CO`,{hour:`2-digit`,minute:`2-digit`,hour12:!0})}`,s=await Ht({cliente:e,telefono:t,total:n,detalle:i,historialAbonos:r>0?Cs([{fecha:o,monto:r,nota:`Abono inicial`,metodo:`Efectivo`}]):``});s?.success?(A(`Crédito creado`,`success`),b(),gs=!1,await ys(),Ts(Z)):A(s?.mensaje||`Error al crear crédito`,`error`)}catch(e){A(`Error: `+e.message,`error`)}finally{a.disabled=!1,a.innerHTML=`<span class="material-symbols-outlined text-[18px]">save</span> Guardar`}}),window.credImprimirTicket=e=>{let t=Z.find(t=>t.id==e);t&&Ds(t,0,``)}}async function Ds(e,t,n){let r=null;try{r=await un()}catch(e){console.error(`Error al cargar ajustes de empresa:`,e)}try{console.log(`[Credits] Intentando impresión por Bluetooth...`),await fi(e,t,n,r),A(`Impresión Bluetooth enviada`,`success`);return}catch(e){console.warn(`[Credits] Impresión Bluetooth falló o cancelada. Usando fallback de navegador.`,e)}let i=window.open(``,`_blank`,`width=300,height=600`),a=new Date,o=`${a.getDate()}/${a.getMonth()+1}/${a.getFullYear()} ${a.getHours()}:${a.getMinutes()}`,s=Ss(e.historialAbonos).map((e,t)=>`
    <tr>
      <td style="padding: 4px 0; border-bottom: 1px solid #eee; text-align: left; vertical-align: top;">
        <div style="font-weight: 800;">#${t+1} - ${e.fecha}</div>
        <div style="color: #555; font-size: 8.5px; margin-top: 1px;">
          <span style="background: #f1f5f9; padding: 1px 4px; border-radius: 3px; font-weight: 900; font-size: 7.5px; text-transform: uppercase;">${e.metodo||`Efectivo`}</span>
          ${e.nota?`• `+e.nota:``}
        </div>
      </td>
      <td style="text-align: right; padding: 4px 0; border-bottom: 1px solid #eee; font-weight: 800; vertical-align: bottom;">
        $${new Intl.NumberFormat(`es-CO`).format(e.monto)}
      </td>
    </tr>
  `).join(``),c={nombre:r?.nombre||`MI NEGOCIO`,propietario:r?.propietario||`Juan Pérez`,nit:r?.nit||`900.123.456-1`,direccion:(r?.direccion||`Calle 123 No. 45 - 67`)+`, `+(r?.ciudad||`Bogotá - Cundinamarca`),contacto:r?.contacto||`3001234567`,correo:r?.correo||`contacto@miempresa.com`,condiciones:r?.condiciones||`GARANTIA: Equipos probados y encendidos. Sin garantía en displays/táctiles o equipos apagados.`,logo:r?.logo||``,logo_size:r?.logo_size||40,mostrar_nombre:r?.mostrar_nombre!==0},l=(localStorage.getItem(`fonebase_paper_format`)||`80mm`)===`58mm`?`48mm`:`80mm`;i.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          @page { size: ${l} auto; margin: 0; }
          html, body { 
            width: ${l}; 
            margin: 0; 
            padding: 0; 
            background: #fff;
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }
          body { 
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; 
            padding: 2mm; 
            font-size: 10px; 
            color: #1e293b;
            line-height: 1.3;
          }
          .bold { font-weight: 900; }
          .text-xs { font-size: 8px; }
          .text-sm { font-size: 11px; }
          .text-lg { font-size: 14px; }
          .text-xl { font-size: 18px; }
          .text-slate-500 { color: #64748b; }
          .text-slate-400 { color: #94a3b8; }
          
          .card { 
            border: 1px solid #e2e8f0; 
            border-radius: 6px; 
            padding: 4px; 
            margin-bottom: 6px; 
            background: #f8fafc;
          }
          .flex-between { display: flex; justify-content: space-between; align-items: flex-start; }
          .badge { 
            background: #dcfce7; color: #166534; 
            padding: 2px 4px; border-radius: 8px; 
            font-size: 8px; font-weight: 900; text-transform: uppercase;
          }
          .badge-error {
            background: #fee2e2; color: #991b1b;
            padding: 2px 4px; border-radius: 8px;
            font-size: 8px; font-weight: 900; text-transform: uppercase;
          }
          
          .section-title {
            font-size: 7px;
            font-weight: 900;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 2px;
            margin-top: 4px;
          }
          
          .summary-card {
            background: #0f172a;
            color: white;
            border-radius: 6px;
            padding: 6px;
            margin-top: 6px;
          }
          .center { text-align: center; }
        </style>
      </head>
      <body>
        <!-- Logo -->
        ${c.logo?`
        <div style="text-align: center; margin-bottom: 4px;">
          <img src="${c.logo}" style="max-height: ${c.logo_size||40}px; max-width: 100%; object-fit: contain;">
        </div>
        `:``}
        <div class="center" style="margin-bottom: 6px; font-size: 8px; line-height: 1.2; border: 1px solid #e2e8f0; border-radius: 6px; padding: 4px; background: #f8fafc;">
          ${c.mostrar_nombre?`<div class="bold text-sm" style="text-transform: uppercase; color: #000;">${c.nombre}</div>`:``}
          <div>NIT: ${c.nit}</div>
          <div>${c.direccion}</div>
          <div>Tel: ${c.contacto}</div>
        </div>

        <!-- Header / Comprobante -->
        <div class="card">
          <div class="text-xs text-primary bold" style="color: #dc2626; text-transform: uppercase;">RECIBO DE ABONO</div>
          <div class="flex-between" style="margin-top: 2px;">
            <div class="text-xs bold">${e.tipo===`Plan Separe`?`PLAN SEPARE`:`CRÉDITO`}</div>
            <div class="${e.saldo<=0?`badge`:`badge-error`}">${e.saldo<=0?e.tipo===`Plan Separe`?`ENTREGADO`:`PAGADO`:`PENDIENTE`}</div>
          </div>
          <div class="flex-between" style="margin-top: 2px;">
            <div class="text-xs text-slate-500">${o}</div>
            <div class="text-xs text-slate-500">Factura Ref: ${e.idFactura||`S/N`}</div>
          </div>
        </div>

        <!-- Info Cliente -->
        <div>
          <div class="section-title">INFORMACIÓN DEL CLIENTE</div>
          <div class="bold text-sm">${e.cliente}</div>
          <div class="text-xs text-slate-500">ID: ${e.telefono||``}</div>
        </div>
        
        <div style="border-top: 1px solid #f1f5f9; margin: 6px 0;"></div>
        
        <!-- Detalle Producto -->
        <div>
          <div class="section-title">DETALLE PRODUCTO</div>
          <div class="bold text-sm" style="margin-bottom: 4px;">${e.detalle||`Pago de deuda`}</div>
        </div>

        <div style="border-top: 1px solid #f1f5f9; margin: 6px 0;"></div>

        <!-- Historial de Abonos -->
        <div class="section-title">HISTORIAL DE PAGOS</div>
        <table style="width: 100%; border-collapse: collapse; font-size: 8px;">
          ${s}
        </table>

        <!-- Resumen Financiero -->
        <div class="summary-card">
          <div class="flex-between">
            <span class="text-xs">Valor Total:</span>
            <span class="text-xs font-bold">$${new Intl.NumberFormat(`es-CO`).format(e.total)}</span>
          </div>
          <div class="flex-between" style="color: #4ade80;">
            <span class="text-xs">Abonado:</span>
            <span class="text-xs font-bold">$${new Intl.NumberFormat(`es-CO`).format(e.abonado)}</span>
          </div>
          <div class="flex-between" style="border-top: 1px solid #334155; margin-top: 4px; pt-2; color: #f87171;">
            <span class="text-xs bold">Saldo Pendiente:</span>
            <span class="text-sm font-black">$${new Intl.NumberFormat(`es-CO`).format(e.saldo)}</span>
          </div>
        </div>

        <div class="center bold text-xs text-slate-500" style="margin-top: 10px; font-style: italic;">
          ${e.tipo===`Plan Separe`?`El producto se entregará al completar el pago total.`:`Conserve este recibo como soporte de pago.`}
        </div>
        <div class="center bold" style="margin-top: 8px; font-size: 9px;">¡GRACIAS POR SU PAGO!</div>
      </body>
    </html>
  `),i.document.close(),setTimeout(()=>{i.print(),i.close()},500)}var Os=[],ks=[],Q=null;function As(){return async()=>{try{Q=await un()}catch(e){console.error(`Error al cargar ajustes de empresa en historial:`,e)}document.getElementById(`sales-search`)?.addEventListener(`input`,e=>{let t=e.target.value.toLowerCase().trim();ks=Os.filter(e=>(e.id_factura||``).toLowerCase().includes(t)||(e.cliente||``).toLowerCase().includes(t)||(e.cedula||``).toLowerCase().includes(t)),Ns()});let e=()=>{let e=document.getElementById(`sale-detail-modal`);e.classList.add(`hidden`),e.classList.remove(`flex`)};document.getElementById(`sale-detail-close`)?.addEventListener(`click`,e),document.getElementById(`sale-detail-backdrop`)?.addEventListener(`click`,e),document.getElementById(`sale-detail-print-btn`)?.addEventListener(`click`,()=>{let e=document.querySelector(`#sale-detail-content p.text-2xl`)?.textContent,t=Os.find(t=>t.id_factura===e);t&&js(t)}),document.getElementById(`sale-detail-print-bt`)?.addEventListener(`click`,async()=>{let e=document.querySelector(`#sale-detail-content p.text-2xl`)?.textContent,t=Os.find(t=>t.id_factura===e);t&&(A(`Preparando impresión...`,`info`),await li(t,null,null,Q))}),await Ms()}}function js(e){let t=window.open(``,`_blank`,`width=300,height=600`),n=new Date(e.fecha),r=`${n.getDate()}/${n.getMonth()+1}/${n.getFullYear()} ${n.getHours()}:${n.getMinutes()}`,i=`N/A`;try{let t=JSON.parse(e.imeis||`{}`),n=Object.values(t).flat().filter(e=>e&&e.trim());n.length>0&&(i=n.join(`, `))}catch{e.imeis&&e.imeis!==`{}`&&e.imeis!==`N/A`&&(i=e.imeis)}let a={nombre:Q?.nombre||`MI NEGOCIO`,propietario:Q?.propietario||`Juan Pérez`,nit:Q?.nit||`900.123.456-1`,direccion:(Q?.direccion||`Calle 123 No. 45 - 67`)+`, `+(Q?.ciudad||`Bogotá - Cundinamarca`),contacto:Q?.contacto||`3001234567`,correo:Q?.correo||`contacto@miempresa.com`,condiciones:Q?.condiciones||`GARANTIA: Equipos probados y encendidos. Sin garantía en displays/táctiles o equipos apagados. Doc. asimilado a letra de cambio (Art. 774 C.Comercio).`,logo:Q?.logo||``,logo_size:Q?.logo_size||40,mostrar_nombre:Q?.mostrar_nombre!==0},o=(localStorage.getItem(`fonebase_paper_format`)||`80mm`)===`58mm`?`48mm`:`80mm`;t.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          @page { size: ${o} auto; margin: 0; }
          html, body { 
            width: ${o}; 
            margin: 0; 
            padding: 0; 
            background: #fff;
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }
          body { 
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; 
            padding: 2mm; 
            font-size: 10px; 
            color: #1e293b; /* slate-800 */
            line-height: 1.3;
          }
          .bold { font-weight: 900; }
          .text-xs { font-size: 8px; }
          .text-sm { font-size: 11px; }
          .text-lg { font-size: 14px; }
          .text-xl { font-size: 18px; }
          .text-slate-500 { color: #64748b; }
          .text-slate-400 { color: #94a3b8; }
          .text-primary { color: #020617; } /* using dark slate for primary on print */
          
          .card { 
            border: 1px solid #e2e8f0; 
            border-radius: 6px; 
            padding: 4px; 
            margin-bottom: 6px; 
            background: #f8fafc;
          }
          .flex-between { display: flex; justify-content: space-between; align-items: flex-start; }
          .badge { 
            background: #dcfce7; color: #166534; 
            padding: 2px 4px; border-radius: 8px; 
            font-size: 8px; font-weight: 900; text-transform: uppercase;
          }
          
          .section-title {
            font-size: 7px;
            font-weight: 900;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 2px;
            margin-top: 4px;
          }

          .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; }
          
          .product-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 4px;
            padding: 4px;
            margin-bottom: 4px;
          }
          
          .summary-card {
            background: #0f172a;
            color: white;
            border-radius: 6px;
            padding: 6px;
            margin-top: 6px;
          }
          
          .legal { font-size: 7px; text-align: justify; margin-top: 8px; color: #64748b; }
          .center { text-align: center; }
        </style>
      </head>
      <body>
        <!-- Logo de la Empresa -->
        ${a.logo?`
        <div style="text-align: center; margin-bottom: 4px;">
          <img src="${a.logo}" style="max-height: ${a.logo_size||40}px; max-width: 100%; object-fit: contain;">
        </div>
        `:``}
        <div class="center" style="margin-bottom: 6px; font-size: 8px; line-height: 1.2; border: 1px solid #e2e8f0; border-radius: 6px; padding: 4px; background: #f8fafc;">
          ${a.mostrar_nombre?`<div class="bold text-sm" style="text-transform: uppercase; color: #000;">${a.nombre}</div>`:``}
          <div>NIT: ${a.nit}</div>
          <div>${a.direccion}</div>
          <div>Tel: ${a.contacto}</div>
        </div>

        <!-- Header / Comprobante -->
        <div class="card">
          <div class="text-xs text-primary bold" style="color: #dc2626; text-transform: uppercase;">COMPROBANTE DE VENTA</div>
          <div class="flex-between" style="margin-top: 2px;">
            <div class="text-lg bold" style="line-height: 1;">${e.id_factura}</div>
            <div class="badge">PAGADO</div>
          </div>
          <div class="flex-between" style="margin-top: 2px;">
            <div class="text-xs text-slate-500">${r}</div>
            <div class="text-xs bold">${e.metodo||`Efectivo`}</div>
          </div>
        </div>
        
        <!-- Info Cliente & Vendedor -->
        <div class="grid-2">
          <div>
            <div class="section-title">INFORMACIÓN DEL CLIENTE</div>
            <div class="bold text-sm">${e.cliente}</div>
            <div class="text-xs text-slate-500">ID: ${e.cedula}</div>
            <div class="text-xs text-slate-500"><span class="text-slate-400 bold">Tel:</span> ${e.telefono_cliente||`N/A`}</div>
            <div class="text-xs text-slate-500"><span class="text-slate-400 bold">Ubicación:</span> ${e.direccion||`—`}, ${e.ciudad||`—`}</div>
          </div>
          <div>
            <div class="section-title">ATENDIDO POR</div>
            <div class="bold text-sm">${e.vendedor||`Vendedor`}</div>
            <div class="text-xs text-slate-400" style="font-style: italic;">Vendedor Autorizado</div>
            <div class="text-xs bold" style="color: #dc2626; background: #fef2f2; display: inline-block; padding: 1px 4px; border-radius: 4px; margin-top: 2px;">DIGITAL</div>
          </div>
        </div>
        
        <div style="border-top: 1px solid #f1f5f9; margin: 6px 0;"></div>
        
        <!-- Detalle Productos -->
        <div class="section-title">DETALLE DE PRODUCTOS</div>
        <div class="product-card">
          <div class="flex-between">
            <div class="bold text-sm" style="width: 80%;">${e.productos}</div>
            <div class="bold text-sm">x${e.cantidad||1}</div>
          </div>
        </div>
        ${i&&i!==`N/A`?`<div class="text-xs bold" style="color:#dc2626; margin-top: -2px; margin-bottom: 4px; margin-left: 4px;">IMEI/SERIE: ${i}</div>`:``}

        <!-- Resumen Financiero -->
        <div class="summary-card">
          <div class="flex-between" style="align-items: flex-end;">
            <div>
              <div class="section-title" style="color: #94a3b8; margin-top: 0;">RESUMEN FINANCIERO</div>
              <div class="text-xs" style="color: #cbd5e1;">Subtotal: $${new Intl.NumberFormat(`es-CO`).format(e.subtotal||e.total)}</div>
              <div class="text-xs bold" style="color: #f87171;">Descuento: -$${new Intl.NumberFormat(`es-CO`).format(e.descuento||0)}</div>
            </div>
            <div style="text-align: right;">
              <div class="section-title" style="color: #94a3b8; margin-top: 0; margin-bottom: 0;">TOTAL COBRADO</div>
              <div class="text-xl bold text-white" style="line-height: 1;">$${new Intl.NumberFormat(`es-CO`).format(e.total)}</div>
            </div>
          </div>
        </div>

        <!-- Firmas -->
        <div style="margin-top: 8px; display: flex; flex-direction: column; gap: 6px;">
           <div class="center">
             <div class="text-xs bold text-slate-400">FIRMA COMPRADOR</div>
             <div style="border: 1px solid #e2e8f0; border-radius: 4px; background: #f8fafc; height: 45px; margin-top: 2px; display: flex; justify-content: center; align-items: center; width: 100%;">
               ${e.id_firma_comprador?`<img src="${e.id_firma_comprador}" style="height: 40px; max-width: 100%; object-fit: contain;">`:``}
             </div>
           </div>
           <div class="center">
             <div class="text-xs bold text-slate-400">FIRMA VENDEDOR</div>
             <div style="border: 1px solid #e2e8f0; border-radius: 4px; background: #f8fafc; height: 45px; margin-top: 2px; display: flex; justify-content: center; align-items: center; width: 100%;">
               ${e.id_firma_vendedor?`<img src="${e.id_firma_vendedor}" style="height: 40px; max-width: 100%; object-fit: contain;">`:``}
             </div>
           </div>
        </div>
        
        <!-- Footer Legal -->
        <div class="legal">
          ${a.condiciones}
        </div>
        <div class="center bold" style="margin-top: 8px; font-size: 11px;">¡GRACIAS POR SU COMPRA!</div>
      </body>
    </html>
  `),t.document.close(),setTimeout(()=>{t.print(),t.close()},500)}async function Ms(){let e=document.getElementById(`sales-history-list`);if(e)try{e.innerHTML=`<tr><td colspan="7" class="p-8 text-center text-on-surface-variant italic text-sm">Cargando todas las ventas...</td></tr>`,Os=await zt();try{let e=JSON.parse(localStorage.getItem(`adminpro_user`)||`{}`);if(e.rol&&e.rol!==`Administrador`){let t=(e.nombre||``).toLowerCase().trim();Os=Os.filter(e=>(e.vendedor||``).toLowerCase().trim()===t)}}catch(e){console.error(`Error al filtrar ventas en historial:`,e)}ks=[...Os],Ns()}catch(t){e.innerHTML=`<tr><td colspan="7" class="p-8 text-center text-error italic text-sm">Error: ${t.message}</td></tr>`}}function Ns(){let e=document.getElementById(`sales-history-list`);if(!e)return;let t=ks.length,n=ks.reduce((e,t)=>e+(t.total||0),0),r=document.getElementById(`sales-stat-count`),i=document.getElementById(`sales-stat-amount`);if(r&&(r.textContent=t.toLocaleString()),i&&(i.textContent=`$`+new Intl.NumberFormat(`es-CO`).format(n)),ks.length===0){e.innerHTML=`<tr><td colspan="7" class="p-8 text-center text-on-surface-variant italic text-sm">No se encontraron ventas</td></tr>`;return}e.innerHTML=ks.map((e,t)=>{let n=new Date(e.fecha).toLocaleDateString(`es-CO`,{day:`2-digit`,month:`short`}),r=new Intl.NumberFormat(`es-CO`).format(e.total||0),i=`N/A`;try{let t=JSON.parse(e.imeis||`{}`),n=Object.values(t).flat().filter(e=>e&&e.trim());n.length>0&&(i=n.join(`, `))}catch{e.imeis&&e.imeis!==`{}`&&e.imeis!==`N/A`&&(i=e.imeis)}return`
      <tr class="hover:bg-surface-container-low transition-colors text-[13px]">
        <td class="px-4 py-4 text-center text-on-surface-variant font-medium hidden md:table-cell">${t+1}</td>
        <td class="px-4 py-4">
          <div class="font-bold text-on-surface text-sm">${e.id_factura}</div>
          <div class="text-[10px] text-on-surface-variant uppercase">${n}</div>
        </td>
        <td class="px-4 py-4">
          <div class="font-bold text-on-surface">${e.cliente||`Consumidor Final`}</div>
          <div class="text-[10px] text-on-surface-variant">CC: ${e.cedula||`N/A`}</div>
        </td>
        <td class="px-4 py-4 font-medium text-on-surface-variant hidden md:table-cell">${e.vendedor||`—`}</td>
        <td class="px-4 py-4">
          <div class="text-xs text-on-surface font-semibold truncate max-w-[150px]">${e.productos}</div>
          <div class="text-[10px] text-primary font-bold">IMEI: ${i}</div>
        </td>
        <td class="px-4 py-4 text-right font-black text-on-surface text-sm">
          $${r}
        </td>
        <td class="px-4 py-4 text-center">
           <button onclick="window.viewSaleDetail('${e.id_factura}')" class="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors">
              <span class="material-symbols-outlined text-[20px]">visibility</span>
           </button>
        </td>
      </tr>
    `}).join(``)}window.viewSaleDetail=e=>{let t=Os.find(t=>t.id_factura===e);if(!t)return;let n=document.getElementById(`sale-detail-modal`),r=document.getElementById(`sale-detail-content`),i=e=>new Intl.NumberFormat(`es-CO`).format(e||0),a=`N/A`;try{let e=JSON.parse(t.imeis||`{}`),n=Object.values(e).flat().filter(e=>e&&e.trim());n.length>0&&(a=n.join(`, `))}catch{t.imeis&&t.imeis!==`{}`&&t.imeis!==`N/A`&&(a=t.imeis)}r.innerHTML=`
    <div class="space-y-6">
      <div class="flex justify-between items-start bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div>
          <p class="text-[10px] uppercase font-black text-primary tracking-widest mb-1">Comprobante de Venta</p>
          <p class="text-2xl font-black text-slate-900">${t.id_factura}</p>
          <p class="text-xs text-slate-500 font-medium">${new Date(t.fecha).toLocaleString(`es-CO`)}</p>
        </div>
        <div class="text-right">
          <span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-black uppercase">Pagado</span>
          <p class="text-[11px] text-slate-500 mt-2 font-bold">${t.metodo}</p>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-6">
        <div>
          <p class="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">Información del Cliente</p>
          <p class="text-sm font-black text-slate-900">${t.cliente}</p>
          <p class="text-xs text-slate-600">ID/Cédula: ${t.cedula||`N/A`}</p>
          <p class="text-xs text-slate-600 mt-1"><span class="font-bold text-slate-400">Tel:</span> ${t.telefono_cliente||`N/A`}</p>
          <p class="text-xs text-slate-600 mt-0.5"><span class="font-bold text-slate-400">Ubicación:</span> ${t.direccion||`—`}, ${t.ciudad||`—`}</p>
        </div>
        <div>
          <p class="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">Atendido por</p>
          <p class="text-sm font-black text-slate-900">${t.vendedor}</p>
          <p class="text-xs text-slate-500 italic">Vendedor Autorizado</p>
          <p class="text-[10px] mt-2 font-bold text-primary uppercase bg-primary/5 inline-block px-2 py-0.5 rounded-full">${t.tipo_factura||`física`}</p>
        </div>
      </div>

      <div class="border-t border-slate-100 pt-4">
        <p class="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-3">Detalle de Productos</p>
        <div class="bg-slate-50 rounded-xl p-4 border border-slate-100">
           <div class="flex justify-between text-sm font-bold text-slate-800 mb-1">
              <span>${t.productos}</span>
              <span>x${t.cantidad||1}</span>
           </div>
           <p class="text-[11px] text-primary font-mono font-bold uppercase tracking-tighter">IMEI/SERIE: ${a}</p>
        </div>
      </div>

      <div class="bg-slate-900 text-white p-5 rounded-2xl shadow-xl relative overflow-hidden">
        <div class="relative z-10 flex justify-between items-end">
          <div class="space-y-1">
            <p class="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Resumen Financiero</p>
            <p class="text-xs opacity-80">Subtotal: $${i(t.subtotal)}</p>
            <p class="text-xs text-red-400 font-bold">Descuento: -$${i(t.descuento)}</p>
          </div>
          <div class="text-right">
            <p class="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Total Cobrado</p>
            <p class="text-3xl font-black text-white leading-none mt-1">$${i(t.total)}</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-3 border-t border-slate-100 pt-4">
        <div class="flex flex-col gap-2 text-center">
           <p class="text-[9px] uppercase font-bold text-slate-400">Firma Vend.</p>
           ${t.id_firma_vendedor?`<a href="${t.id_firma_vendedor}" target="_blank" class="h-12 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200"><span class="material-symbols-outlined text-slate-400 text-sm">signature</span></a>`:`<div class="h-12 bg-slate-50 rounded-lg border border-slate-100"></div>`}
        </div>
        <div class="flex flex-col gap-2 text-center">
           <p class="text-[9px] uppercase font-bold text-slate-400">Firma Cli.</p>
           ${t.id_firma_comprador?`<a href="${t.id_firma_comprador}" target="_blank" class="h-12 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200"><span class="material-symbols-outlined text-slate-400 text-sm">person_check</span></a>`:`<div class="h-12 bg-slate-50 rounded-lg border border-slate-100"></div>`}
        </div>
        <div class="flex flex-col gap-2 text-center">
           <p class="text-[9px] uppercase font-bold text-slate-400">Evidencia</p>
           ${t.evidencia?`<a href="${t.evidencia}" target="_blank" class="h-12 bg-primary/5 rounded-lg flex items-center justify-center border border-primary/20"><span class="material-symbols-outlined text-primary/40 text-sm">image</span></a>`:`<div class="h-12 bg-slate-50 rounded-lg border border-slate-100"></div>`}
        </div>
      </div>
    </div>
  `,n.classList.remove(`hidden`),n.classList.add(`flex`)};var Ps=[],Fs=[],Is=[];function Ls(){return async()=>{Rs(),window.viewReloaders=window.viewReloaders||{},window.viewReloaders.tasks=async()=>{await Promise.all([zs(),Vs()])},await Promise.all([zs(),Vs()])}}function Rs(){let e=document.getElementById(`task-new-btn`),t=document.getElementById(`task-modal-close`),n=document.getElementById(`task-modal-backdrop`),r=document.getElementById(`task-form`);e?.replaceWith(e.cloneNode(!0)),t?.replaceWith(t.cloneNode(!0)),n?.replaceWith(n.cloneNode(!0)),r?.replaceWith(r.cloneNode(!0)),document.getElementById(`task-new-btn`)?.addEventListener(`click`,qs),document.getElementById(`task-modal-close`)?.addEventListener(`click`,Js),document.getElementById(`task-modal-backdrop`)?.addEventListener(`click`,Js),document.getElementById(`task-form`)?.addEventListener(`submit`,Ys);let i=document.getElementById(`meta-new-btn`),a=document.getElementById(`meta-modal-close`),o=document.getElementById(`meta-modal-backdrop`),s=document.getElementById(`meta-form`);i?.replaceWith(i.cloneNode(!0)),a?.replaceWith(a.cloneNode(!0)),o?.replaceWith(o.cloneNode(!0)),s?.replaceWith(s.cloneNode(!0)),document.getElementById(`meta-new-btn`)?.addEventListener(`click`,Zs),document.getElementById(`meta-modal-close`)?.addEventListener(`click`,Qs),document.getElementById(`meta-modal-backdrop`)?.addEventListener(`click`,Qs),document.getElementById(`meta-form`)?.addEventListener(`submit`,$s),typeof window.setupCustomSelect==`function`&&(window.setupCustomSelect(`task-input-priority-container`,`task-input-priority`),window.setupCustomSelect(`meta-input-type-container`,`meta-input-type`))}async function zs(){let e=document.getElementById(`task-list`);if(e)try{let e=await on(),t=JSON.parse(localStorage.getItem(`adminpro_user`)||`{}`);Ps=t.rol===`Técnico de reparación`||t.rol===`Vendedor`?e.filter(e=>e.responsable===t.nombre):e,Bs()}catch(t){e.innerHTML=`<li class="p-8 text-center text-error">Error: ${t.message}</li>`}}function Bs(){let e=document.getElementById(`task-list`);if(e){if(!Ps||Ps.length===0){e.innerHTML=`<li class="p-12 text-center text-on-surface-variant italic text-sm">No hay tareas. ¡Buen trabajo!</li>`;return}e.innerHTML=Ps.map(e=>{let t=e.estado===`Completada`;return`
      <li class="flex items-center gap-4 p-4 hover:bg-surface-container-low transition-colors group">
        <button onclick="window.toggleTaskStatus('${e.id}', '${e.estado}')" 
          class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all 
          ${t?`bg-green-500 border-green-500`:`border-surface-variant hover:border-primary`}">
          ${t?`<span class="material-symbols-outlined text-white text-[16px]">done</span>`:``}
        </button>
        <div class="flex-1 min-w-0">
          <h4 class="font-bold text-sm ${t?`text-on-surface-variant line-through opacity-50`:`text-on-surface`}">${e.tarea}</h4>
          <p class="text-[11px] text-on-surface-variant truncate">${e.notas||`Sin notas`}</p>
        </div>
        <div class="text-right">
          <span class="text-[9px] font-black px-2 py-0.5 rounded-full ${Gs(e.prioridad)}">${e.prioridad}</span>
          <p class="text-[10px] text-on-surface-variant mt-1">${Ks(e.fecha_vencimiento)}</p>
        </div>
        <button onclick="window.deleteTask('${e.id}')" class="p-2 text-on-surface-variant hover:text-error opacity-0 group-hover:opacity-100 transition-opacity">
          <span class="material-symbols-outlined text-[18px]">delete</span>
        </button>
      </li>
    `}).join(``)}}async function Vs(){let e=document.getElementById(`meta-list`);if(e)try{Fs=await xn(),Hs(),Us()}catch(t){e.innerHTML=`
      <div class="p-8 text-center text-error border border-error/20 bg-error/5 rounded-2xl text-sm">
        Error al cargar metas: ${t.message}
      </div>
    `}}function Hs(){let e=document.getElementById(`meta-list`);if(e){if(!Fs||Fs.length===0){e.innerHTML=`
      <div class="p-12 text-center text-on-surface-variant italic text-sm bg-surface-container-lowest border border-surface-variant rounded-2xl shadow-sm">
        <span class="material-symbols-outlined text-4xl mb-2 opacity-50" style="font-variation-settings:'FILL' 1">emoji_events</span>
        <p class="font-medium">No hay metas financieras configuradas</p>
      </div>
    `;return}e.innerHTML=Fs.map(e=>{let t=Math.min(100,Math.max(0,e.porcentaje||0)),n=t>=100,r=parseFloat(e.acumulado||0).toLocaleString(`es-CO`),i=parseFloat(e.monto_objetivo||0).toLocaleString(`es-CO`),a=Ks(e.fecha_inicio),o=Ks(e.fecha_limite),s=(e.porcentaje||0).toFixed(1),c=`from-amber-400 to-amber-500`;return t>=50&&t<100?c=`from-blue-500 to-indigo-600`:n&&(c=`from-emerald-400 to-green-600 animate-pulse`),`
      <div class="meta-card bg-surface-container-lowest border border-surface-variant rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer relative group flex flex-col gap-3" 
           data-id="${e.id_meta}" data-completed="${n}">
        
        <div class="flex justify-between items-start gap-4">
          <div class="min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <h4 class="font-black text-sm text-on-surface truncate">${e.titulo}</h4>
              <span class="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${e.tipo_calculo===`Ventas`?`bg-green-50 text-green-700 border border-green-100`:`bg-indigo-50 text-indigo-700 border border-indigo-100`}">${e.tipo_calculo===`Ventas`?`Ventas`:`Utilidad Neta`}</span>
            </div>
            <p class="text-[11px] text-on-surface-variant mt-1">${e.notas||`Sin notas`}</p>
          </div>
          <button class="meta-del-btn p-1.5 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-full transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100 flex-shrink-0" 
                  data-id="${e.id_meta}" title="Eliminar Meta">
            <span class="material-symbols-outlined text-[18px]">delete</span>
          </button>
        </div>

        <div class="flex justify-between items-end text-xs font-semibold text-on-surface">
          <div>
            <span class="text-[10px] text-on-surface-variant block uppercase tracking-wider">Acumulado / Objetivo</span>
            <span class="text-sm font-black">$${r}</span>
            <span class="text-on-surface-variant text-[11px] font-medium">/ $${i}</span>
          </div>
          <div class="text-right">
            <span class="text-sm font-black ${n?`text-green-600`:`text-primary`}">${s}%</span>
          </div>
        </div>

        <div class="w-full h-2 bg-surface-variant/30 rounded-full overflow-hidden">
          <div class="h-full bg-gradient-to-r ${c} rounded-full transition-all duration-1000 ease-out" 
               style="width: 0%;" data-target-width="${t}%"></div>
        </div>

        <div class="flex justify-between items-center text-[10px] text-on-surface-variant font-mono border-t border-surface-variant/50 pt-2.5">
          <span>Inicio: ${a}</span>
          <span>Límite: ${o}</span>
        </div>
      </div>
    `}).join(``),setTimeout(()=>{document.querySelectorAll(`#meta-list .meta-card .h-full`).forEach(e=>{let t=e.dataset.targetWidth;t&&(e.style.width=t)})},100),document.querySelectorAll(`#meta-list .meta-card`).forEach(e=>{e.addEventListener(`click`,t=>{t.target.closest(`.meta-del-btn`)||e.dataset.completed===`true`&&(Ws(),A(`¡Meta completada! 🎯🏆 Gran esfuerzo.`,`success`))})}),document.querySelectorAll(`#meta-list .meta-del-btn`).forEach(e=>{e.addEventListener(`click`,async t=>{let n=e.dataset.id;if(await j(`Confirmación`,`¿Estás seguro de eliminar esta meta financiera?`))try{await bn(n),A(`Meta eliminada`,`success`),await Vs()}catch{A(`Error al eliminar meta`,`error`)}})})}}function Us(){let e=!1;Fs.forEach(t=>{t.porcentaje>=100&&(Is.includes(t.id_meta)||(Is.push(t.id_meta),e=!0))}),e&&setTimeout(()=>{Ws(),A(`¡Felicitaciones! Has alcanzado una de tus metas financieras 🎯🏆`,`success`)},500)}function Ws(){let e=document.createElement(`canvas`);e.style.position=`fixed`,e.style.top=`0`,e.style.left=`0`,e.style.width=`100vw`,e.style.height=`100vh`,e.style.pointerEvents=`none`,e.style.zIndex=`99999`,document.body.appendChild(e);let t=e.getContext(`2d`),n=e.width=window.innerWidth,r=e.height=window.innerHeight,i=()=>{n=e.width=window.innerWidth,r=e.height=window.innerHeight};window.addEventListener(`resize`,i);let a=[`#f43f5e`,`#3b82f6`,`#eab308`,`#10b981`,`#8b5cf6`,`#ff7849`],o=[];for(let e=0;e<120;e++)o.push({x:Math.random()*n,y:Math.random()*r-r,r:Math.random()*6+4,d:Math.random()*r,color:a[Math.floor(Math.random()*a.length)],tilt:Math.random()*10-5,tiltAngleIncremental:Math.random()*.07+.02,tiltAngle:0});let s,c=Date.now();function l(){t.clearRect(0,0,n,r);let a=!1;o.forEach(e=>{e.tiltAngle+=e.tiltAngleIncremental,e.y+=(Math.cos(e.d)+3+e.r/2)/2,e.x+=Math.sin(e.tiltAngle),e.tilt=Math.sin(e.tiltAngle-e.r/2)*5,e.y<r?a=!0:Date.now()-c<3e3&&(e.y=-20,e.x=Math.random()*n,a=!0),t.beginPath(),t.lineWidth=e.r,t.strokeStyle=e.color,t.moveTo(e.x+e.tilt+e.r/2,e.y),t.lineTo(e.x+e.tilt,e.y+e.tilt+e.r/2),t.stroke()}),a?s=requestAnimationFrame(l):(window.removeEventListener(`resize`,i),e.remove())}l(),setTimeout(()=>{cancelAnimationFrame(s),window.removeEventListener(`resize`,i),e.remove()},5e3)}function Gs(e){return e===`Alta`?`bg-red-100 text-red-700`:e===`Media`?`bg-blue-100 text-blue-700`:`bg-slate-100 text-slate-700`}function Ks(e){return e?new Date(e+`T12:00:00`).toLocaleDateString(`es-CO`,{day:`numeric`,month:`short`}):`—`}function qs(){let e=document.getElementById(`task-modal`);document.getElementById(`task-form`).reset(),window.syncCustomSelectUI(`task-input-priority-container`,`Media`),document.getElementById(`task-input-date`).value=new Date().toISOString().slice(0,10),e.classList.remove(`hidden`),e.classList.add(`flex`)}function Js(){document.getElementById(`task-modal`).classList.add(`hidden`),document.getElementById(`task-modal`).classList.remove(`flex`)}async function Ys(e){e.preventDefault();let t=document.getElementById(`task-save-btn`);t.disabled=!0,t.innerHTML=`Guardando...`;let n={tarea:document.getElementById(`task-input-title`).value.trim(),fecha_inicio:new Date().toISOString().slice(0,10),fecha_vencimiento:document.getElementById(`task-input-date`).value,prioridad:document.getElementById(`task-input-priority`).value,responsable:JSON.parse(localStorage.getItem(`adminpro_user`)||`{}`).nombre||`Admin`,notas:document.getElementById(`task-input-notes`).value.trim(),estado:`Pendiente`,color:Xs(document.getElementById(`task-input-priority`).value)};try{await sn(n)&&(A(`Tarea creada`,`success`),Js(),await zs())}catch{A(`Error al guardar`,`error`)}finally{t.disabled=!1,t.innerHTML=`<span class="material-symbols-outlined text-[20px]">save</span> Guardar Tarea`}}function Xs(e){return e===`Alta`?`#ef4444`:e===`Media`?`#3b82f6`:`#64748b`}function Zs(){let e=document.getElementById(`meta-modal`);document.getElementById(`meta-form`).reset(),window.syncCustomSelectUI(`meta-input-type-container`,`Ventas`);let t=new Date().toISOString().slice(0,10),n=new Date(Date.now()+720*60*60*1e3).toISOString().slice(0,10);document.getElementById(`meta-input-start-date`).value=t,document.getElementById(`meta-input-end-date`).value=n,e.classList.remove(`hidden`),e.classList.add(`flex`)}function Qs(){document.getElementById(`meta-modal`).classList.add(`hidden`),document.getElementById(`meta-modal`).classList.remove(`flex`)}async function $s(e){e.preventDefault();let t=document.getElementById(`meta-save-btn`);t.disabled=!0,t.innerHTML=`Guardando...`;let n=parseFloat(document.getElementById(`meta-input-target`).value)||0;if(n<=0){A(`El monto objetivo debe ser mayor a 0`,`warning`),t.disabled=!1,t.innerHTML=`<span class="material-symbols-outlined text-[20px]">save</span> Guardar Meta`;return}let r=document.getElementById(`meta-input-start-date`).value,i=document.getElementById(`meta-input-end-date`).value;if(new Date(r)>new Date(i)){A(`La fecha de inicio no puede ser posterior a la fecha límite`,`warning`),t.disabled=!1,t.innerHTML=`<span class="material-symbols-outlined text-[20px]">save</span> Guardar Meta`;return}let a={titulo:document.getElementById(`meta-input-title`).value.trim(),monto_objetivo:n,tipo_calculo:document.getElementById(`meta-input-type`).value,fecha_inicio:r,fecha_limite:i,notas:document.getElementById(`meta-input-notes`).value.trim(),estado:`Activa`};try{await yn(a)&&(A(`Meta financiera creada exitosamente`,`success`),Qs(),await Vs())}catch{A(`Error al guardar meta`,`error`)}finally{t.disabled=!1,t.innerHTML=`<span class="material-symbols-outlined text-[20px]">save</span> Guardar Meta`}}window.toggleTaskStatus=async(e,t)=>{let n=t===`Completada`?`Pendiente`:`Completada`;try{await cn(e,n),await zs()}catch(e){console.error(e)}},window.deleteTask=async e=>{if(await j(`Confirmación`,`¿Eliminar tarea?`))try{await ln(e),await zs()}catch(e){console.error(e)}};var ec=[],tc=!1;function nc(){return async()=>{tc||=(await rc(),!0),ic()}}async function rc(){let e=document.getElementById(`calendar-container`);e&&(e.innerHTML=`<div class="p-10 text-center text-on-surface-variant italic animate-pulse">Recopilando actividad global...</div>`);try{let e=JSON.parse(localStorage.getItem(`adminpro_user`)||`{}`),t=e.rol===`Administrador`,n=[zt().catch(()=>[]),on().catch(()=>[]),Wt().catch(()=>[])];t&&(n.push($t().catch(()=>[])),n.push(nn().catch(()=>[])));let[r,i,a,o=[],s=[]]=await Promise.all(n);ec=[],r.forEach(e=>{e.fecha&&ec.push({fecha:new Date(e.fecha),tipo:`Venta`,icono:`point_of_sale`,color:`text-green-600`,bg:`bg-green-100`,border:`border-green-200`,titulo:`Factura: ${e.id_factura||`N/A`}`,subtitulo:`Cliente: ${e.cliente||`Consumidor Final`}`,monto:e.total,signo:`+`,usuario:e.vendedor||`Admin`})}),i.forEach(e=>{e.fecha_vencimiento&&ec.push({fecha:new Date(e.fecha_vencimiento),tipo:`Tarea`,icono:`task_alt`,color:`text-indigo-600`,bg:`bg-indigo-100`,border:`border-indigo-200`,titulo:e.tarea,subtitulo:`Resp: ${e.responsable||`Sin asignar`}`,monto:null,usuario:e.responsable||`Admin`})}),a.forEach(e=>{e.fecha&&ec.push({fecha:new Date(e.fecha),tipo:`Reventa`,icono:`storefront`,color:`text-purple-600`,bg:`bg-purple-100`,border:`border-purple-200`,titulo:`Reventa: ${e.producto}`,subtitulo:`Proveedor: ${e.proveedor||`N/A`}`,monto:e.utilidad,signo:`+`,usuario:e.vendedor||`Admin`})}),o.forEach(e=>{e.fecha&&ec.push({fecha:new Date(e.fecha),tipo:`Egreso`,icono:`payments`,color:`text-red-600`,bg:`bg-red-100`,border:`border-red-200`,titulo:`Gasto: ${e.concepto}`,subtitulo:`Cat: ${e.categoria}`,monto:e.monto,signo:`-`})}),s.forEach(e=>{e.fecha&&ec.push({fecha:new Date(e.fecha),tipo:`Nómina`,icono:`request_quote`,color:`text-orange-600`,bg:`bg-orange-100`,border:`border-orange-200`,titulo:`Pago: ${e.empleado}`,subtitulo:`Período: ${e.periodo}`,monto:e.total_pagar,signo:`-`})}),ec.sort((e,t)=>t.fecha-e.fecha),t||(ec=ec.filter(t=>t.usuario===e.nombre))}catch(t){console.error(t),e&&(e.innerHTML=`<div class="p-10 text-center text-error font-bold">Error cargando actividad: ${t.message}</div>`)}}function ic(){let e=document.getElementById(`calendar-container`);if(!e)return;if(ec.length===0){e.innerHTML=`
      <div class="flex-1 flex flex-col items-center justify-center p-10 opacity-50">
        <span class="material-symbols-outlined text-[64px] mb-4">history_toggle_off</span>
        <p class="text-lg font-bold">Sin actividad</p>
        <p class="text-sm">No hay registros de operaciones en el sistema.</p>
      </div>`;return}let t={};ec.forEach(e=>{let n=e.fecha.toISOString().split(`T`)[0];t[n]||(t[n]=[]),t[n].push(e)});let n=e=>new Intl.NumberFormat(`es-CO`,{style:`currency`,currency:`COP`,minimumFractionDigits:0}).format(e),r=``,i=new Date().toISOString().split(`T`)[0],a=new Date;a.setDate(a.getDate()-1);let o=a.toISOString().split(`T`)[0];Object.keys(t).forEach(e=>{let a=t[e],s=e,c=`text-on-surface-variant`,l=`bg-surface-variant`;e===i?(s=`Hoy`,c=`text-primary`,l=`bg-primary`):e===o?s=`Ayer`:(s=new Date(e+`T12:00:00`).toLocaleDateString(`es-CO`,{weekday:`long`,day:`numeric`,month:`long`}),s=s.charAt(0).toUpperCase()+s.slice(1)),r+=`
      <!-- Day Group -->
      <div class="relative">
        <!-- Date Header -->
        <div class="absolute -left-[33px] md:-left-[41px] top-1 w-4 h-4 rounded-full border-4 border-surface ${l} z-10"></div>
        <h3 class="text-sm font-black uppercase tracking-widest ${c} mb-4">${s}</h3>
        
        <div class="flex flex-col gap-3 mb-8">
    `,a.forEach(e=>{let t=e.fecha.toLocaleTimeString(`es-CO`,{hour:`2-digit`,minute:`2-digit`}),i=``;e.monto!==null&&e.monto!==void 0&&(i=`<div class="font-black ${e.signo===`+`?`text-green-600`:`text-red-600`} whitespace-nowrap">${e.signo} ${n(e.monto)}</div>`),r+=`
        <div class="bg-surface-container-lowest border border-surface-variant hover:border-primary/30 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center gap-4 group">
          
          <!-- Icon -->
          <div class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${e.bg} ${e.border} border">
            <span class="material-symbols-outlined ${e.color} text-[24px]" style="font-variation-settings:'FILL' 1">${e.icono}</span>
          </div>
          
          <!-- Content -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-0.5">
              <span class="text-[10px] font-black uppercase tracking-widest ${e.color}">${e.tipo}</span>
              <span class="text-[10px] text-on-surface-variant flex items-center gap-0.5"><span class="material-symbols-outlined text-[12px]">schedule</span> ${t}</span>
            </div>
            <h4 class="text-sm font-bold text-on-surface truncate">${e.titulo}</h4>
            <p class="text-xs text-on-surface-variant truncate">${e.subtitulo}</p>
          </div>
          
          <!-- Amount -->
          ${i}
        </div>
      `}),r+=`
        </div>
      </div>
    `}),e.innerHTML=r}var ac=[],oc=[],sc=!1,cc=!1,lc=null;function uc(){return async()=>{sc||=(await dc(),pc(),!0),fc(ac)}}async function dc(){let e=document.getElementById(`user-table-body`);try{e&&(e.innerHTML=`<tr><td colspan="6" class="p-8 text-center opacity-50">Cargando equipo...</td></tr>`);let[t,n]=await Promise.all([St(),fn()]);ac=t||[],oc=n||[]}catch{A(`Error al cargar usuarios`,`error`),ac=[]}}function fc(e){let t=document.getElementById(`user-table-body`);if(t){if(e.length===0){t.innerHTML=`<tr><td colspan="6" class="p-10 text-center opacity-40 italic">No hay usuarios registrados</td></tr>`;return}t.innerHTML=e.map(e=>{let t=(e.nombre||`U`).split(` `).filter(Boolean).map(e=>e[0]).join(``).substring(0,2).toUpperCase(),n=e.rol===`Administrador`?`bg-purple-50 text-purple-700 border border-purple-100`:e.rol===`Vendedor`?`bg-blue-50 text-blue-700 border border-blue-100`:`bg-orange-50 text-orange-700 border border-orange-100`,r=String(e.sucursal_id||`1`).trim(),i=`Principal`;if(r===`0`||r===`all`)i=`Todas las Sucursales`;else{let e=oc.find(e=>String(e.id).trim()===r);e&&(i=e.nombre)}return`
      <tr class="hover:bg-surface-container-low transition-colors text-sm">
        <td class="px-4 py-4">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-primary/5 text-primary flex items-center justify-center font-black text-xs shrink-0 border border-primary/10">
              ${t}
            </div>
            <div>
              <p class="font-black text-sm text-on-surface">${e.nombre}</p>
              <p class="text-[10px] text-on-surface-variant font-medium md:hidden">${e.email}</p>
            </div>
          </div>
        </td>
        <td class="px-4 py-4 text-on-surface-variant hidden md:table-cell">${e.email}</td>
        <td class="px-4 py-4 text-center">
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${n}">${e.rol}</span>
        </td>
        <td class="px-4 py-4 text-center">
          <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <span class="material-symbols-outlined text-[14px] text-slate-500">storefront</span>
            ${i}
          </span>
        </td>
        <td class="px-4 py-4 text-center">
          <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${e.estado===`Activo`?`bg-green-50 text-green-700 border border-green-100`:`bg-slate-50 text-slate-500 border border-slate-100`}">
            <span class="w-1.5 h-1.5 rounded-full ${e.estado===`Activo`?`bg-green-600`:`bg-slate-400`}"></span>
            ${e.estado}
          </span>
        </td>
        <td class="px-4 py-4 text-right">
          <div class="flex items-center justify-end gap-1">
            <button onclick="window.userReset2FA('${e.email}')" class="p-1.5 text-amber-600 hover:bg-amber-50 rounded-full transition-colors" title="Restablecer 2FA"><span class="material-symbols-outlined text-[18px]">lock_reset</span></button>
            <button onclick="window.userEdit('${e.email}')" class="p-1.5 text-primary hover:bg-primary/10 rounded-full transition-colors" title="Editar"><span class="material-symbols-outlined text-[18px]">edit</span></button>
            <button onclick="window.userDelete('${e.email}')" class="p-1.5 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-full transition-colors" title="Eliminar"><span class="material-symbols-outlined text-[18px]">delete</span></button>
          </div>
        </td>
      </tr>
    `}).join(``)}}function pc(){window.setupCustomSelect(`user-input-rol-container`,`user-input-rol`),window.setupCustomSelect(`user-input-estado-container`,`user-input-estado`),window.setupCustomSelect(`user-input-sucursal-container`,`user-input-sucursal`),document.getElementById(`user-search`)?.addEventListener(`input`,e=>{let t=e.target.value.toLowerCase().trim();fc(ac.filter(e=>e.nombre.toLowerCase().includes(t)||e.email.toLowerCase().includes(t)))}),document.getElementById(`user-new-btn`)?.addEventListener(`click`,()=>mc()),document.getElementById(`user-modal-close`)?.addEventListener(`click`,hc),document.getElementById(`user-modal-backdrop`)?.addEventListener(`click`,hc),document.getElementById(`user-form`)?.addEventListener(`submit`,gc),window.userEdit=e=>{let t=ac.find(t=>t.email===e);t&&mc(t)},window.userDelete=async e=>{if(e===JSON.parse(localStorage.getItem(`adminpro_user`)||`{}`).email)return A(`No puedes eliminarte a ti mismo`,`warning`);if(await j(`Confirmación`,`¿Eliminar al usuario ${e}?`))try{await Tt(e),A(`Usuario eliminado`,`success`),await dc(),fc(ac)}catch(e){A(e.message,`error`)}},window.userReset2FA=async e=>{if(await j(`Confirmación`,`¿Restablecer el 2FA de ${e}? El usuario deberá escanear un nuevo código QR en su móvil en su próximo inicio de sesión.`))try{await xt(e),A(`2FA restablecido con éxito`,`success`),await dc(),fc(ac)}catch(e){A(e.message,`error`)}}}function mc(e=null){lc=e?e.email:null,document.getElementById(`user-form`).reset(),document.getElementById(`user-modal-title`).textContent=e?`Editar Usuario`:`Nuevo Usuario`;let t=document.getElementById(`user-input-sucursal-container`),n=document.getElementById(`user-input-sucursal`);if(t&&n){let r=t.querySelector(`.custom-select-options`),i=`
      <div data-value="0" class="custom-option px-4 py-2.5 text-sm font-semibold text-on-surface hover:bg-surface-variant/20 flex items-center gap-3 cursor-pointer transition-colors">
        <span class="material-symbols-outlined text-[18px] text-slate-400">public</span>
        <span class="flex-1">Todas las Sucursales (Acceso Global)</span>
        <span class="material-symbols-outlined text-[16px] text-primary check-icon hidden">check_circle</span>
      </div>
    `;oc.length>0?i+=oc.map(e=>`
        <div data-value="${e.id}" class="custom-option px-4 py-2.5 text-sm font-semibold text-on-surface hover:bg-surface-variant/20 flex items-center gap-3 cursor-pointer transition-colors">
          <span class="material-symbols-outlined text-[18px] text-slate-400">storefront</span>
          <span class="flex-1">${e.nombre}</span>
          <span class="material-symbols-outlined text-[16px] text-primary check-icon hidden">check_circle</span>
        </div>
      `).join(``):i+=`
        <div data-value="1" class="custom-option px-4 py-2.5 text-sm font-semibold text-on-surface hover:bg-surface-variant/20 flex items-center gap-3 cursor-pointer transition-colors">
          <span class="material-symbols-outlined text-[18px] text-slate-400">storefront</span>
          <span class="flex-1">Principal</span>
          <span class="material-symbols-outlined text-[16px] text-primary check-icon hidden">check_circle</span>
        </div>
      `,r&&(r.innerHTML=i);let a=e?String(e.sucursal_id||`1`).trim():`1`;n.value=a,window.syncCustomSelectUI(`user-input-sucursal-container`,a)}e&&(document.getElementById(`user-input-name`).value=e.nombre,document.getElementById(`user-input-email`).value=e.email,document.getElementById(`user-input-password`).value=e.password,document.getElementById(`user-input-rol`).value=e.rol,document.getElementById(`user-input-estado`).value=e.estado),window.syncCustomSelectUI(`user-input-rol-container`,document.getElementById(`user-input-rol`).value||`Vendedor`),window.syncCustomSelectUI(`user-input-estado-container`,document.getElementById(`user-input-estado`).value||`Activo`);let r=document.getElementById(`user-modal`);r.classList.remove(`hidden`),r.classList.add(`flex`)}function hc(){let e=document.getElementById(`user-modal`);e.classList.add(`hidden`),e.classList.remove(`flex`)}async function gc(e){if(e.preventDefault(),cc)return;cc=!0;let t=document.getElementById(`user-save-btn`);t.disabled=!0,t.innerHTML=`Guardando...`;let n=e=>document.getElementById(e).value.trim(),r=n(`user-input-email`).toLowerCase(),i=n(`user-input-sucursal`)||`1`,a=[r,n(`user-input-password`),n(`user-input-name`),n(`user-input-rol`),n(`user-input-estado`),i];try{lc?await wt(lc,r,[a[1],a[2],a[3],a[4],a[5]]):await Ct(a),A(lc?`Actualizado`:`Creado`,`success`),hc(),await dc(),fc(ac)}catch(e){A(e.message,`error`)}finally{cc=!1,t.disabled=!1,t.innerHTML=`Guardar Usuario`}}var _c=[],vc=!1,yc=!1,bc,xc,Sc,Cc,wc,Tc,Ec,Dc,Oc,kc,Ac,jc,Mc,Nc,Pc;function Fc(){return async()=>{Ic(),window.viewReloaders=window.viewReloaders||{},window.viewReloaders.reventas=async()=>{await Lc(),Rc(_c)},vc||=(await Lc(),zc(),!0),Rc(_c)}}function Ic(){bc=document.getElementById(`ped-table-body`),xc=document.getElementById(`ped-search`),Sc=document.getElementById(`ped-filter-status`),Cc=document.getElementById(`ped-new-btn`),wc=document.getElementById(`ped-modal`),Tc=document.getElementById(`ped-modal-close`),Ec=document.getElementById(`ped-modal-backdrop`),Dc=document.getElementById(`ped-form`),Oc=document.getElementById(`ped-save-btn`),kc=document.getElementById(`ped-id`),Ac=document.getElementById(`ped-producto`),jc=document.getElementById(`ped-categoria`),Mc=document.getElementById(`ped-proveedor`),Nc=document.getElementById(`ped-costo`),Pc=document.getElementById(`ped-precio`)}async function Lc(){try{bc&&(bc.innerHTML=`<tr><td colspan="6" class="p-4 text-center text-on-surface-variant">Cargando reventas...</td></tr>`),_c=await Wt()}catch(e){A(`Error cargando reventas: `+e.message,`error`),_c=[]}}function Rc(e){if(!bc)return;if(e.length===0){bc.innerHTML=`<tr><td colspan="6" class="p-4 text-center text-on-surface-variant">No se encontraron reventas</td></tr>`;return}let t=JSON.parse(localStorage.getItem(`adminpro_user`)||`{}`).rol===`Administrador`;bc.innerHTML=e.map(e=>{let n=Number(e.costo||0),r=Number(e.precio||0),i=Number(e.utilidad||r-n),a=e=>new Intl.NumberFormat(`es-CO`).format(e),o=(e=>{let t=String(e||``).toLowerCase();return t.includes(`celular`)||t.includes(`teléfono`)?`bg-blue-50 text-blue-700 border border-blue-100`:t.includes(`accesorio`)?`bg-purple-50 text-purple-700 border border-purple-100`:t.includes(`repuesto`)?`bg-orange-50 text-orange-700 border border-orange-100`:`bg-slate-50 text-slate-600 border border-slate-100`})(e.categoria);return`
      <tr class="hover:bg-surface-container-low transition-colors text-sm">
        <td class="px-4 py-3 font-mono font-bold hidden md:table-cell">${e.id||`-`}</td>
        <td class="px-4 py-3 font-black text-on-surface">${e.producto||`-`}</td>
        <td class="px-4 py-3">
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${o}">
            ${e.categoria||`Otros`}
          </span>
        </td>
        <td class="px-4 py-3">
          <p class="text-[10px] text-on-surface-variant line-through hidden md:block">C: $${a(n)}</p>
          <p class="font-bold text-primary">V: $${a(r)}</p>
        </td>
        <td class="px-4 py-3 font-black ${i>=0?`text-green-600`:`text-red-600`}">$${a(i)}</td>
        <td class="px-4 py-3 text-right">
          ${t?`
            <div class="flex items-center justify-end gap-1">
              <button onclick="window.pedEdit('${e.id}')" class="p-1.5 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-full transition-colors" title="Editar">
                <span class="material-symbols-outlined text-[18px]">edit</span>
              </button>
              <button onclick="window.pedDelete('${e.id}')" class="p-1.5 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-full transition-colors" title="Eliminar">
                <span class="material-symbols-outlined text-[18px]">delete</span>
              </button>
            </div>
          `:``}
        </td>
      </tr>
    `}).join(``)}function zc(){window.setupCustomSelect(`ped-categoria-container`,`ped-categoria`);let e=()=>{if(!xc)return;let e=xc.value.toLowerCase().trim(),t=Sc?Sc.value:``;Rc(_c.filter(n=>{let r=(n.producto||``).toLowerCase().includes(e)||(n.id||``).toLowerCase().includes(e),i=t?n.categoria===t:!0;return r&&i}))};xc?.addEventListener(`input`,e),Sc?.addEventListener(`change`,e);let t=e=>{let t=e.target.value.replace(/\D/g,``);if(!t){e.target.value=``;return}e.target.value=new Intl.NumberFormat(`es-CO`).format(parseInt(t,10))};Nc?.addEventListener(`input`,t),Pc?.addEventListener(`input`,t),Cc?.addEventListener(`click`,()=>Bc(null)),Tc?.addEventListener(`click`,Vc),Ec?.addEventListener(`click`,Vc),Oc?.addEventListener(`click`,Hc),window.pedDelete=async e=>{if(await j(`Confirmación`,`¿Eliminar la reventa ${e}?`))try{let t=await qt(e);t&&t.success&&(A(`Eliminada`,`success`),await Lc(),Rc(_c))}catch(e){A(e.message,`error`)}},window.pedEdit=e=>{let t=_c.find(t=>t.id===e);t&&Bc(t)}}function Bc(e){if(!wc)return;Dc?.reset(),e&&(kc&&(kc.value=e.id),Ac&&(Ac.value=e.producto||``),jc&&(jc.value=e.categoria||`Celulares`),Mc&&(Mc.value=e.proveedor||``),Nc&&(Nc.value=new Intl.NumberFormat(`es-CO`).format(e.costo||0)),Pc&&(Pc.value=new Intl.NumberFormat(`es-CO`).format(e.precio||0)),Dc&&(Dc.dataset.fecha=e.fecha||new Date().toISOString())),window.syncCustomSelectUI(`ped-categoria-container`,jc?jc.value:`Celulares`);let t=document.getElementById(`ped-modal-title`);t&&(t.textContent=e?`Editar Reventa`:`Nueva Reventa`),wc.classList.remove(`hidden`),wc.classList.add(`flex`)}function Vc(){wc?.classList.add(`hidden`),wc?.classList.remove(`flex`)}async function Hc(){if(!yc){yc=!0;try{let e=kc?.value,t=parseInt(Nc?.value.replace(/\D/g,``))||0,n=parseInt(Pc?.value.replace(/\D/g,``))||0,r={producto:Ac?.value.trim(),categoria:jc?.value,proveedor:Mc?.value.trim(),costo:t,precio:n},i;i=e?await Kt(e,[e,Dc.dataset.fecha||new Date().toISOString(),r.producto,r.categoria,r.costo,r.precio,r.proveedor,r.precio-r.costo]):await Gt(r),i&&i.success&&(A(e?`Actualizado`:`Guardado`,`success`),Vc(),await Lc(),Rc(_c))}catch(e){A(e.message,`error`)}finally{yc=!1}}}var Uc=[],Wc=!1,Gc=!1,Kc=null,qc={},$=null;function Jc(){return async()=>{try{$=await un()}catch(e){console.error(`Error al cargar ajustes de empresa en servicio técnico:`,e)}window.viewReloaders=window.viewReloaders||{},window.viewReloaders.technical=async()=>{await Yc(),Xc(Uc)},Wc||=(await Yc(),Qc(),!0),Xc(Uc)}}async function Yc(){let e=document.getElementById(`tech-grid`);try{e&&(e.innerHTML=`<p class="col-span-full text-center p-10 opacity-50 italic">Cargando servicios...</p>`),Uc=await Jt()}catch{A(`Error al cargar datos`,`error`),Uc=[]}}function Xc(e){let t=document.getElementById(`tech-grid`);if(!t)return;if(e.length===0){t.innerHTML=`<p class="col-span-full text-center p-20 opacity-30 italic text-sm">No hay órdenes de servicio activas</p>`;return}let n=e=>new Intl.NumberFormat(`es-CO`).format(e||0);t.innerHTML=e.map(e=>{let t=(e.precio_final||0)-(e.abono||0),r=(e.estado||``).trim(),i=[`Ingresado`,`Reparado`,`Entregado`,`Sin Arreglo`].includes(r);return`
      <div class="bg-surface-container-lowest border border-surface-variant rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group relative">
        <div class="flex justify-between items-start mb-3">
          <span class="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/5 px-2 py-1 rounded-md">${e.id_orden}</span>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${Zc(e.estado)}">${e.estado}</span>
        </div>
        
        <h3 class="font-black text-on-surface text-base mb-1 truncate">${e.equipo}</h3>
        <p class="text-xs font-bold text-on-surface-variant mb-3 flex items-center gap-1">
          <span class="material-symbols-outlined text-[14px]">person</span> ${e.cliente}
        </p>
 
        <div class="bg-surface-container-low rounded-xl p-3 mb-4">
          <p class="text-[10px] uppercase font-bold text-on-surface-variant/60 mb-1">Falla Reportada</p>
          <p class="text-xs text-on-surface italic line-clamp-2">${e.falla}</p>
        </div>
        
        ${e.evidencias&&e.evidencias!==`{}`&&e.evidencias.length>5?`<div class="flex items-center gap-1.5 mb-3 text-[10px] font-bold text-primary bg-primary/5 px-2 py-1 w-fit rounded-md"><span class="material-symbols-outlined text-[14px]">photo_camera</span> Evidencias Adjuntas</div>`:``}
 
        <div class="grid grid-cols-2 gap-2 mb-4 border-t border-surface-variant/30 pt-3">
          <div>
            <p class="text-[9px] uppercase font-bold text-on-surface-variant/50">Total</p>
            <p class="text-sm font-black text-on-surface">$${n(e.precio_final)}</p>
          </div>
          <div class="text-right">
            <p class="text-[9px] uppercase font-bold text-on-surface-variant/50">Saldo</p>
            <p class="text-sm font-black ${t>0?`text-error`:`text-green-600`}">$${n(t)}</p>
          </div>
        </div>
 
        <div class="flex gap-2">
          ${i?`
          <button onclick="window.techPrint('${e.id_orden}')" title="Imprimir Ticket" class="p-2 bg-surface border border-surface-variant rounded-xl text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-colors">
            <span class="material-symbols-outlined text-[18px]">print</span>
          </button>
          `:``}
          <button onclick="window.techEdit('${e.id_orden}')" class="flex-1 py-2 bg-surface border border-surface-variant rounded-xl text-xs font-bold text-primary hover:bg-primary/5 transition-colors flex items-center justify-center gap-1">
            <span class="material-symbols-outlined text-[16px]">edit</span> Editar
          </button>
          <button onclick="window.techDelete('${e.id_orden}')" class="p-2 bg-surface border border-surface-variant rounded-xl text-error hover:bg-error/5 transition-colors">
            <span class="material-symbols-outlined text-[18px]">delete</span>
          </button>
        </div>
      </div>
    `}).join(``)}function Zc(e){return{Ingresado:`bg-slate-100 text-slate-700`,"En Revisión":`bg-blue-100 text-blue-700`,"En Taller":`bg-blue-100 text-blue-700`,Reparado:`bg-green-100 text-green-700`,Entregado:`bg-emerald-600 text-white`,"Sin Arreglo":`bg-red-100 text-red-700`}[e]||`bg-slate-100 text-slate-600`}function Qc(){let e=()=>{let e=document.getElementById(`tech-search`)?.value.toLowerCase().trim()||``,t=document.getElementById(`tech-filter-status`)?.value||``;Xc(Uc.filter(n=>{let r=n.cliente.toLowerCase().includes(e)||n.id_orden.toLowerCase().includes(e)||n.equipo.toLowerCase().includes(e),i=!t||n.estado===t;return r&&i}))};document.getElementById(`tech-search`)?.addEventListener(`input`,e),window.setupCustomSelect&&window.setupCustomSelect(`tech-filter-status-container`,`tech-filter-status`,e),document.getElementById(`tech-new-btn`)?.addEventListener(`click`,()=>$c()),document.getElementById(`tech-modal-close`)?.addEventListener(`click`,el),document.getElementById(`tech-modal-backdrop`)?.addEventListener(`click`,el),document.getElementById(`tech-form`)?.addEventListener(`submit`,tl),nl(),[`recepcion`,`resultado`].forEach(e=>{let t=document.getElementById(`tech-preview-${e}-btn`),n=document.getElementById(`tech-img-${e}`),r=document.getElementById(`tech-preview-${e}-wrap`),i=document.getElementById(`tech-preview-${e}`),a=document.getElementById(`tech-remove-${e}`);t?.addEventListener(`click`,()=>n?.click()),n?.addEventListener(`change`,n=>{let a=n.target.files[0];if(!a)return;let o=new FileReader;o.onload=n=>{qc[e]={file:a,base64:n.target.result.split(`,`)[1],mime:a.type},i.src=n.target.result,t.classList.add(`hidden`),r.classList.remove(`hidden`)},o.readAsDataURL(a)}),a?.addEventListener(`click`,()=>{n.value=``,delete qc[e],i.src=``,r.classList.add(`hidden`),t.classList.remove(`hidden`)})}),window.techEdit=e=>{let t=Uc.find(t=>t.id_orden===e);t&&$c(t)},window.techPrint=async e=>{let t=Uc.find(t=>t.id_orden===e);if(t)try{A(`Conectando a impresora Bluetooth...`,`info`),await di(t,$)}catch(e){console.error(`Bluetooth print failed, falling back to window print:`,e),A(`Impresión Bluetooth no disponible, usando impresión local...`,`warning`);let n=e=>new Intl.NumberFormat(`es-CO`).format(e||0),r=(t.precio_final||0)-(t.abono||0),i=new Date().toLocaleDateString(`es-CO`,{year:`numeric`,month:`2-digit`,day:`2-digit`,hour:`2-digit`,minute:`2-digit`}),a={nombre:$?.nombre||`MI NEGOCIO`,propietario:$?.propietario||`Juan Pérez`,nit:$?.nit||`900.123.456-1`,direccion:($?.direccion||`Calle 123 No. 45 - 67`)+`, `+($?.ciudad||`Bogotá - Cundinamarca`),contacto:$?.contacto||`3001234567`,correo:$?.correo||`contacto@miempresa.com`,condiciones:$?.condiciones||`GARANTIA: Equipos probados y encendidos. Sin garantía en displays/táctiles o equipos apagados. Doc. asimilado a letra de cambio (Art. 774 C.Comercio).`,logo:$?.logo||``,logo_size:$?.logo_size||40,mostrar_nombre:$?.mostrar_nombre!==0},o=`badge-ingresado`,s=(t.estado||``).trim();s===`En Revisión`?o=`badge-revision`:s===`En Taller`?o=`badge-taller`:s===`Reparado`?o=`badge-reparado`:s===`Entregado`?o=`badge-entregado`:s===`Sin Arreglo`&&(o=`badge-sinarreglo`);let c=(localStorage.getItem(`fonebase_paper_format`)||`80mm`)===`58mm`?`48mm`:`80mm`,l=`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              @page { size: ${c} auto; margin: 0; }
              html, body { 
                width: ${c}; 
                margin: 0; 
                padding: 0; 
                background: #fff;
                -webkit-print-color-adjust: exact;
                color-adjust: exact;
              }
              body { 
                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; 
                padding: 2mm; 
                font-size: 10px; 
                color: #1e293b; 
                line-height: 1.3;
              }
              .bold { font-weight: 900; }
              .text-xs { font-size: 8px; }
              .text-sm { font-size: 11px; }
              .text-lg { font-size: 14px; }
              .text-xl { font-size: 18px; }
              .text-slate-500 { color: #64748b; }
              .text-slate-400 { color: #94a3b8; }
              .text-primary { color: #020617; }
              
              .card { 
                border: 1px solid #e2e8f0; 
                border-radius: 6px; 
                padding: 4px; 
                margin-bottom: 6px; 
                background: #f8fafc;
              }
              .flex-between { display: flex; justify-content: space-between; align-items: flex-start; }
              .badge { 
                padding: 2px 4px; border-radius: 8px; 
                font-size: 8px; font-weight: 900; text-transform: uppercase;
              }
              .badge-ingresado { background: #f1f5f9; color: #334155; }
              .badge-revision { background: #dbeafe; color: #1e40af; }
              .badge-taller { background: #dbeafe; color: #1e40af; }
              .badge-reparado { background: #dcfce7; color: #166534; }
              .badge-entregado { background: #059669; color: #ffffff; }
              .badge-sinarreglo { background: #fee2e2; color: #991b1b; }
              
              .section-title {
                font-size: 7px;
                font-weight: 900;
                color: #94a3b8;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 2px;
                margin-top: 4px;
              }

              .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; }
              
              .product-card {
                background: #f8fafc;
                border: 1px solid #e2e8f0;
                border-radius: 4px;
                padding: 4px;
                margin-bottom: 4px;
              }
              
              .summary-card {
                background: #0f172a;
                color: white;
                border-radius: 6px;
                padding: 6px;
                margin-top: 6px;
              }
              
              .legal { font-size: 7px; text-align: justify; margin-top: 8px; color: #64748b; }
              .center { text-align: center; }
            </style>
          </head>
          <body>
            <!-- Logo de la Empresa -->
            ${a.logo?`
            <div style="text-align: center; margin-bottom: 4px;">
              <img src="${a.logo}" style="max-height: ${a.logo_size||40}px; max-width: 100%; object-fit: contain;">
            </div>
            `:``}
            <div class="center" style="margin-bottom: 6px; font-size: 8px; line-height: 1.2; border: 1px solid #e2e8f0; border-radius: 6px; padding: 4px; background: #f8fafc;">
              ${a.mostrar_nombre?`<div class="bold text-sm" style="text-transform: uppercase; color: #000;">${a.nombre}</div>`:``}
              <div>NIT: ${a.nit}</div>
              <div>${a.direccion}</div>
              <div>Tel: ${a.contacto}</div>
            </div>

            <!-- Header / Comprobante -->
            <div class="card">
              <div class="text-xs text-primary bold" style="color: #dc2626; text-transform: uppercase;">SERVICIO TÉCNICO</div>
              <div class="flex-between" style="margin-top: 2px;">
                <div class="text-lg bold" style="line-height: 1;">${t.id_orden}</div>
                <div class="badge ${o}">${t.estado}</div>
              </div>
              <div class="flex-between" style="margin-top: 2px;">
                <div class="text-xs text-slate-500">${i}</div>
                <div class="text-xs bold" style="color: #dc2626;">SOPORTE</div>
              </div>
            </div>
            
            <!-- Info Cliente -->
            <div class="grid-2">
              <div>
                <div class="section-title">INFORMACIÓN DEL CLIENTE</div>
                <div class="bold text-sm">${t.cliente}</div>
                <div class="text-xs text-slate-500"><span class="text-slate-400 bold">Tel:</span> ${t.telefono||`N/A`}</div>
              </div>
              <div>
                <div class="section-title">DISPOSITIVO</div>
                <div class="bold text-sm">${t.equipo}</div>
                <div class="text-xs text-slate-500"><span class="text-slate-400 bold">IMEI/S:</span> ${t.imei_serie||`N/A`}</div>
                ${t.clave_patron?`<div class="text-xs text-slate-500"><span class="text-slate-400 bold">Clave:</span> ${t.clave_patron}</div>`:``}
              </div>
            </div>
            
            <div style="border-top: 1px solid #f1f5f9; margin: 6px 0;"></div>
            
            <!-- Detalle Soporte -->
            <div class="section-title">DETALLES DEL TRABAJO</div>
            <div class="product-card">
              <div class="bold text-[8px] text-slate-400">FALLA REPORTADA:</div>
              <div class="text-xs text-slate-800" style="margin-bottom: 4px;">${t.falla}</div>
              ${t.repuestos?`
                <div class="bold text-[8px] text-slate-400" style="margin-top: 4px; border-top: 1px dashed #e2e8f0; padding-top: 2px;">REPUESTOS UTILIZADOS:</div>
                <div class="text-xs text-slate-800">${t.repuestos}</div>
              `:``}
            </div>

            <!-- Resumen Financiero -->
            <div class="summary-card">
              <div class="flex-between" style="align-items: flex-end;">
                <div>
                  <div class="section-title" style="color: #94a3b8; margin-top: 0;">RESUMEN DE PAGO</div>
                  <div class="text-xs" style="color: #cbd5e1;">Costo Total: $${n(t.precio_final)}</div>
                  <div class="text-xs text-green-400 font-bold">Abonado: -$${n(t.abono)}</div>
                </div>
                <div style="text-align: right;">
                  <div class="section-title" style="color: #94a3b8; margin-top: 0; margin-bottom: 0;">SALDO PENDIENTE</div>
                  <div class="text-xl bold text-white" style="line-height: 1; color: ${r>0?`#f87171`:`#4ade80`};">$${n(r)}</div>
                </div>
              </div>
            </div>

            <!-- Firmas -->
            <div class="grid-2" style="margin-top: 8px;">
               <div class="center">
                 <div class="text-xs bold text-slate-400">FIRMA TÉCNICO</div>
                 <div style="border: 1px solid #e2e8f0; border-radius: 4px; background: #f8fafc; height: 30px; margin-top: 2px;"></div>
               </div>
               <div class="center">
                 <div class="text-xs bold text-slate-400">FIRMA CLIENTE</div>
                 <div style="border: 1px solid #e2e8f0; border-radius: 4px; background: #f8fafc; height: 30px; margin-top: 2px;"></div>
               </div>
            </div>
            
            <!-- Footer Legal -->
            <div class="legal">
              ${a.condiciones}
              <p style="margin-top: 4px; font-style: italic; text-align: center;">Conserve este ticket para reclamar su equipo.</p>
            </div>
            <div class="center bold" style="margin-top: 8px; font-size: 11px;">¡GRACIAS POR SU CONFIANZA!</div>
          </body>
        </html>
      `,u=window.open(``,`_blank`,`width=300,height=600`);u?(u.document.open(),u.document.write(l),u.document.close(),u.focus(),setTimeout(()=>{u.print(),u.close()},500)):A(`Por favor permite las ventanas emergentes para imprimir`,`warning`)}},window.techDelete=async e=>{if(await j(`Confirmación`,`¿Eliminar orden ${e}?`))try{(await Zt(e)).success&&(A(`Orden eliminada`,`success`),await Yc(),Xc(Uc))}catch(e){A(e.message,`error`)}}}function $c(e=null){if(Kc=e?e.id_orden:null,document.getElementById(`tech-form`).reset(),document.getElementById(`tech-modal-title`).textContent=e?`Editar Orden`:`Ingreso a Servicio Técnico`,qc={},[`recepcion`,`resultado`].forEach(e=>{document.getElementById(`tech-preview-${e}-btn`)?.classList.remove(`hidden`),document.getElementById(`tech-preview-${e}-wrap`)?.classList.add(`hidden`),document.getElementById(`tech-preview-${e}`).src=``}),e&&(document.getElementById(`tech-cliente`).value=e.cliente,document.getElementById(`tech-equipo`).value=e.equipo,document.getElementById(`tech-falla`).value=e.falla,document.getElementById(`tech-costo`).value=new Intl.NumberFormat(`es-CO`).format(e.precio_final||0),document.getElementById(`tech-estado`).value=e.estado,e.evidencias))try{let t=JSON.parse(e.evidencias);[`recepcion`,`resultado`].forEach(e=>{t[e]&&(document.getElementById(`tech-preview-${e}`).src=t[e],document.getElementById(`tech-preview-${e}-btn`).classList.add(`hidden`),document.getElementById(`tech-preview-${e}-wrap`).classList.remove(`hidden`),qc[e]={url:t[e]})})}catch{}rl(e?e.estado:`Ingresado`);let t=document.getElementById(`tech-modal`);t.classList.remove(`hidden`),t.classList.add(`flex`)}function el(){let e=document.getElementById(`tech-modal`);e.classList.add(`hidden`),e.classList.remove(`flex`)}async function tl(e){if(e.preventDefault(),Gc)return;Gc=!0;let t=document.getElementById(`tech-save-btn`);t.disabled=!0;let n=Kc||`ST-${Date.now().toString().slice(-6)}`;t.innerHTML=`<span class="material-symbols-outlined animate-spin">progress_activity</span> Subiendo...`;let r={};for(let e of[`recepcion`,`resultado`])if(qc[e])if(qc[e].base64)try{let t=await mt(qc[e].base64,`${n}_${e}`,qc[e].mime);t&&(r[e]=t)}catch(e){console.error(`Error upload evidencia`,e)}else qc[e].url&&(r[e]=qc[e].url);let i=[n,document.getElementById(`tech-cliente`).value.trim(),`310`,document.getElementById(`tech-equipo`).value.trim(),`S/N`,document.getElementById(`tech-falla`).value.trim(),`0000`,``,0,0,parseInt(document.getElementById(`tech-costo`).value.replace(/\D/g,``))||0,document.getElementById(`tech-estado`).value,JSON.stringify(r)];try{(Kc?await Xt(Kc,i):await Yt(i)).success&&(A(Kc?`Actualizado`:`Ingresado`,`success`),el(),await Yc(),Xc(Uc))}catch(e){A(e.message,`error`)}finally{Gc=!1,t.disabled=!1,t.innerHTML=`<span class="material-symbols-outlined text-[18px]">save</span> Guardar`}}function nl(){let e=document.getElementById(`tech-estado-container`);if(!e)return;let t=e.querySelector(`.custom-select-trigger`),n=e.querySelector(`.custom-select-options`),r=document.getElementById(`tech-estado`),i=e.querySelectorAll(`.custom-option`);t.addEventListener(`click`,e=>{e.stopPropagation(),n.classList.toggle(`hidden`)}),i.forEach(e=>{e.addEventListener(`click`,()=>{let a=e.dataset.value,o=e.querySelector(`.material-symbols-outlined`).textContent,s=e.querySelector(`.flex-1`).textContent;t.querySelector(`.selected-label`).textContent=s,t.querySelector(`.material-symbols-outlined`).textContent=o,i.forEach(t=>{let n=t.querySelector(`.check-icon`);t===e?n.classList.remove(`hidden`):n.classList.add(`hidden`)}),r&&(r.value=a,r.dispatchEvent(new Event(`change`,{bubbles:!0}))),n.classList.add(`hidden`)})}),document.addEventListener(`click`,()=>{n.classList.add(`hidden`)})}function rl(e){let t=document.getElementById(`tech-estado-container`);if(!t)return;let n=t.querySelector(`.custom-select-trigger`),r=t.querySelectorAll(`.custom-option`),i=Array.from(r).find(t=>t.dataset.value===e);if(i){let e=i.querySelector(`.material-symbols-outlined`).textContent,t=i.querySelector(`.flex-1`).textContent;n.querySelector(`.selected-label`).textContent=t,n.querySelector(`.material-symbols-outlined`).textContent=e,r.forEach(e=>{let t=e.querySelector(`.check-icon`);e===i?t.classList.remove(`hidden`):t.classList.add(`hidden`)})}}var il=[],al=!1,ol=!1,sl,cl,ll,ul,dl,fl,pl,ml,hl,gl,_l,vl,yl;function bl(){return async()=>{xl(),window.viewReloaders=window.viewReloaders||{},window.viewReloaders.expenses=async()=>{await Sl(),Cl(il)},al||=(await Sl(),wl(),!0),Cl(il)}}function xl(){sl=document.getElementById(`exp-table-body`),cl=document.getElementById(`exp-search`),ll=document.getElementById(`exp-filter-cat`),ul=document.getElementById(`exp-new-btn`),dl=document.getElementById(`exp-modal`),fl=document.getElementById(`exp-modal-close`),pl=document.getElementById(`exp-modal-backdrop`),ml=document.getElementById(`exp-form`),hl=document.getElementById(`exp-save-btn`),gl=document.getElementById(`exp-monto`),_l=document.getElementById(`exp-categoria`),vl=document.getElementById(`exp-concepto`),yl=document.getElementById(`exp-responsable`)}async function Sl(){try{sl.innerHTML=`<tr><td colspan="6" class="p-4 text-center text-on-surface-variant">Cargando egresos...</td></tr>`,il=await $t()}catch(e){A(`Error cargando egresos: `+e.message,`error`),il=[]}}function Cl(e){if(e.length===0){sl.innerHTML=`<tr><td colspan="6" class="p-4 text-center text-on-surface-variant">No se encontraron egresos</td></tr>`;return}let t=e=>{let t=String(e||``).toLowerCase();return t.includes(`servicio`)?`bg-blue-50 text-blue-700 border border-blue-100`:t.includes(`nomina`)||t.includes(`nómina`)?`bg-purple-50 text-purple-700 border border-purple-100`:t.includes(`compra`)?`bg-emerald-50 text-emerald-700 border border-emerald-100`:t.includes(`arriendo`)?`bg-amber-50 text-amber-700 border border-amber-100`:`bg-slate-50 text-slate-700 border border-slate-100`};sl.innerHTML=e.map(e=>{let n=t(e.categoria);return`
      <tr class="hover:bg-surface-container-low transition-colors">
        <td class="px-4 py-3">
          <div class="font-mono text-[10px] font-medium text-on-surface-variant hidden md:block">${e.id||`-`}</div>
          <div class="text-xs font-bold text-on-surface">${e.fecha||``}</div>
        </td>
        <td class="px-4 py-3">
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${n}">
            ${e.categoria||`Otro`}
          </span>
        </td>
        <td class="px-4 py-3 text-sm font-semibold text-on-surface max-w-[200px] truncate" title="${e.concepto}">
          ${e.concepto||`-`}
        </td>
        <td class="px-4 py-3 text-sm text-on-surface-variant hidden md:table-cell">${e.responsable||`-`}</td>
        <td class="px-4 py-3 text-sm font-black text-red-600">-$${new Intl.NumberFormat(`es-CO`).format(e.monto||0)}</td>
        <td class="px-4 py-3 text-right hidden md:table-cell">
          <button class="p-1.5 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-lg transition-colors opacity-50 cursor-not-allowed" title="No se pueden editar egresos por seguridad">
            <span class="material-symbols-outlined text-[18px]">lock</span>
          </button>
        </td>
      </tr>
    `}).join(``)}function wl(){let e=()=>{let e=cl.value.toLowerCase().trim(),t=ll.value;Cl(il.filter(n=>{let r=(n.concepto||``).toLowerCase().includes(e)||(n.responsable||``).toLowerCase().includes(e)||(n.id||``).toLowerCase().includes(e),i=t?n.categoria===t:!0;return r&&i}))};cl.addEventListener(`input`,e),window.setupCustomSelect&&(window.setupCustomSelect(`exp-filter-cat-container`,`exp-filter-cat`,e),window.setupCustomSelect(`exp-categoria-container`,`exp-categoria`)),gl.addEventListener(`input`,e=>{let t=e.target.value.replace(/\D/g,``);if(!t){e.target.value=``;return}e.target.value=new Intl.NumberFormat(`es-CO`).format(parseInt(t,10))}),ul.addEventListener(`click`,()=>Tl()),fl.addEventListener(`click`,El),pl.addEventListener(`click`,El),hl.addEventListener(`click`,Dl)}function Tl(){ml.reset(),window.syncCustomSelectUI&&window.syncCustomSelectUI(`exp-categoria-container`,_l.value||`Compra Inventario`);try{let e=localStorage.getItem(`adminpro_user`);if(e){let t=JSON.parse(e);yl.value=t.nombre||t.email}}catch{yl.value=`Sistema`}dl.classList.remove(`hidden`),dl.classList.add(`flex`),gl.focus()}function El(){dl.classList.add(`hidden`),dl.classList.remove(`flex`)}async function Dl(){if(!ml.checkValidity()){ml.reportValidity();return}if(!ol){ol=!0,hl.textContent=`Registrando...`,hl.disabled=!0;try{let e=await en({monto:parseInt(gl.value.replace(/\D/g,``))||0,categoria:_l.value,concepto:vl.value.trim(),responsable:yl.value});e&&e.success?(A(`Egreso registrado`,`success`),El(),await Sl(),Cl(il)):A(e?.mensaje||`Error al registrar`,`error`)}catch(e){A(`Error de conexión: `+e.message,`error`)}finally{ol=!1,hl.innerHTML=`<span class="material-symbols-outlined text-[18px]">save</span> Guardar`,hl.disabled=!1}}}var Ol=[],kl=[],Al=[],jl=[];function Ml(){return async()=>{Vl(`nominas`),window.viewReloaders=window.viewReloaders||{},window.viewReloaders.nominas=async()=>{await Nl(),await Ll()},await Nl(),await Ll(),Gl()}}async function Nl(){try{let e=document.getElementById(`nom-list`);e&&(e.innerHTML=`<tr><td colspan="6" class="p-4 text-center text-sm text-on-surface-variant">Cargando nóminas...</td></tr>`),[Ol,kl]=await Promise.all([nn(),St()]),Pl(Ol),Fl(Ol)}catch{A(`Error al cargar nóminas`,`error`)}}function Pl(e){let t=document.getElementById(`nom-list`);if(t){if(!e||e.length===0){t.innerHTML=`
      <tr>
        <td colspan="6" class="p-8 text-center text-on-surface-variant">
          <span class="material-symbols-outlined text-4xl mb-2 opacity-50" style="font-variation-settings:'FILL' 1">request_quote</span>
          <p class="text-sm font-medium">No hay nóminas registradas</p>
        </td>
      </tr>
    `;return}t.innerHTML=e.map(e=>{let t=new Date(e.fecha).toLocaleDateString(`es-CO`,{year:`numeric`,month:`short`,day:`numeric`}),n=parseFloat(e.total_pagar)||0,r=`bg-amber-50 text-amber-700 border border-amber-100`;return e.estado===`Pagado`?r=`bg-green-50 text-green-700 border border-green-100`:e.estado===`Anulado`&&(r=`bg-red-50 text-red-700 border border-red-100`),`
      <tr class="hover:bg-surface-container-low transition-colors group">
        <td class="px-4 py-3 whitespace-nowrap">
          <p class="text-sm font-semibold text-on-surface">${t}</p>
          <p class="text-[10px] text-on-surface-variant font-mono mt-0.5 hidden md:block">${e.id_nomina}</p>
        </td>
        <td class="px-4 py-3">
          <p class="text-sm font-black text-on-surface">${e.empleado}</p>
          <p class="text-xs text-on-surface-variant">${e.periodo}</p>
        </td>
        <td class="px-4 py-3 text-right hidden md:table-cell">
          <p class="text-sm font-medium text-on-surface">$${parseFloat(e.salario_base).toLocaleString(`es-CO`)}</p>
          ${parseFloat(e.bonificaciones)>0?`<p class="text-[11px] text-green-600">+ $${parseFloat(e.bonificaciones).toLocaleString()}</p>`:``}
          ${parseFloat(e.deducciones)>0?`<p class="text-[11px] text-red-600">- $${parseFloat(e.deducciones).toLocaleString()}</p>`:``}
        </td>
        <td class="px-4 py-3 text-right">
          <span class="text-sm font-black text-primary">$${n.toLocaleString(`es-CO`)}</span>
        </td>
        <td class="px-4 py-3 text-center">
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${r}">${e.estado}</span>
        </td>
        <td class="px-4 py-3 text-right">
          <button class="nom-del-btn p-1.5 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-full transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100" data-id="${e.id_nomina}" title="Eliminar">
            <span class="material-symbols-outlined text-[18px]">delete</span>
          </button>
        </td>
      </tr>
    `}).join(``),document.querySelectorAll(`.nom-del-btn`).forEach(e=>{e.addEventListener(`click`,async e=>{let t=e.currentTarget.dataset.id;if(await j(`Confirmación`,`¿Estás seguro de eliminar este registro de nómina?`))try{await an(t),A(`Nómina eliminada`,`success`),Nl()}catch{A(`Error al eliminar`,`error`)}})})}}function Fl(e){let t=new Date,n=t.getMonth(),r=t.getFullYear(),i=0,a=0;e.forEach(e=>{let t=new Date(e.fecha);t.getMonth()===n&&t.getFullYear()===r&&e.estado!==`Anulado`&&(i+=parseFloat(e.total_pagar)||0),e.estado===`Pendiente`&&(a+=parseFloat(e.total_pagar)||0)});let o=document.getElementById(`nom-stat-mes`),s=document.getElementById(`nom-stat-pendiente`);o&&(o.textContent=`$`+i.toLocaleString(`es-CO`)),s&&(s.textContent=`$`+a.toLocaleString(`es-CO`))}function Il(){let e=parseFloat(document.getElementById(`nom-base`).value)||0,t=parseFloat(document.getElementById(`nom-bonos`).value)||0,n=parseFloat(document.getElementById(`nom-deduc`).value)||0,r=e+t-n;document.getElementById(`nom-total-calc`).textContent=`$`+r.toLocaleString(`es-CO`)}async function Ll(){try{let e=document.getElementById(`nom-prestamos-list`);e&&(e.innerHTML=`<tr><td colspan="6" class="p-4 text-center text-sm text-on-surface-variant">Cargando préstamos...</td></tr>`),Al=await hn(),jl=await P(),Rl(Al),zl(Al)}catch{A(`Error al cargar préstamos`,`error`)}}function Rl(e){let t=document.getElementById(`nom-prestamos-list`);if(t){if(!e||e.length===0){t.innerHTML=`
      <tr>
        <td colspan="6" class="p-8 text-center text-on-surface-variant">
          <span class="material-symbols-outlined text-4xl mb-2 opacity-50" style="font-variation-settings:'FILL' 1">payments</span>
          <p class="text-sm font-medium">No hay préstamos registrados</p>
        </td>
      </tr>
    `;return}t.innerHTML=e.map(e=>{let t=new Date(e.fecha).toLocaleDateString(`es-CO`,{year:`numeric`,month:`short`,day:`numeric`}),n=``;n=e.tipo===`Dinero`?`<span class="font-bold text-slate-800">$${parseFloat(e.monto||0).toLocaleString(`es-CO`)}</span>`:`
        <span class="font-bold text-slate-800">${e.cantidad}x ${e.producto_nombre}</span>
        <span class="text-xs text-slate-500 block">Valor: $${parseFloat(e.monto||0).toLocaleString(`es-CO`)}</span>
      `;let r=`bg-amber-50 text-amber-700 border border-amber-100`;e.estado===`Devuelto`?r=`bg-green-50 text-green-700 border border-green-100`:e.estado===`Deducido`&&(r=`bg-slate-100 text-slate-600 border border-slate-200`);let i=``;return i=e.estado===`Pendiente`?`
        <button class="prest-action-btn px-2.5 py-1 text-[11px] font-bold bg-green-50 text-green-700 border border-green-200 rounded-md hover:bg-green-100 transition-colors" data-id="${e.id_prestamo}" data-action="Devuelto">Devolver</button>
        <button class="prest-action-btn px-2.5 py-1 text-[11px] font-bold bg-slate-50 text-slate-700 border border-slate-200 rounded-md hover:bg-slate-100 transition-colors" data-id="${e.id_prestamo}" data-action="Deducido">Deducir</button>
      `:`
        <button class="prest-action-btn px-2.5 py-1 text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 rounded-md hover:bg-amber-100 transition-colors" data-id="${e.id_prestamo}" data-action="Pendiente">Reabrir</button>
      `,`
      <tr class="hover:bg-surface-container-low transition-colors group">
        <td class="px-4 py-3 text-sm font-semibold text-on-surface whitespace-nowrap">${t}</td>
        <td class="px-4 py-3 text-sm font-black text-on-surface">${e.empleado}</td>
        <td class="px-4 py-3">
          <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${e.tipo===`Dinero`?`bg-green-50 text-green-700 border-green-100`:`bg-indigo-50 text-indigo-700 border-indigo-100`}">${e.tipo}</span>
        </td>
        <td class="px-4 py-3 text-sm">${n}</td>
        <td class="px-4 py-3 text-center">
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${r}">${e.estado}</span>
        </td>
        <td class="px-4 py-3">
          <div class="flex items-center gap-2">
            ${i}
            <button class="prest-del-btn p-1 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-full transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100" data-id="${e.id_prestamo}" title="Eliminar">
              <span class="material-symbols-outlined text-[16px]">delete</span>
            </button>
          </div>
        </td>
      </tr>
    `}).join(``),document.querySelectorAll(`.prest-action-btn`).forEach(e=>{e.addEventListener(`click`,async e=>{let t=e.currentTarget.dataset.id,n=e.currentTarget.dataset.action;try{let e=Al.find(e=>e.id_prestamo===t);if(!e)return;if(e.tipo===`Producto`){if(n===`Devuelto`&&e.estado===`Pendiente`)await Bl(e.producto_id,e.cantidad),A(`Stock devuelto a inventario`,`info`);else if(n===`Pendiente`&&e.estado===`Devuelto`){let t=(await P()).find(t=>t.id===e.producto_id);if(!t||(t.stockActual||0)<e.cantidad)return A(`Stock insuficiente en inventario para reabrir el préstamo`,`warning`);await Bl(e.producto_id,-e.cantidad),A(`Stock descontado de inventario`,`info`)}}await _n(t,n),A(`Préstamo marcado como ${n}`,`success`),await Ll()}catch(e){A(`Error al cambiar estado: `+e.message,`error`)}})}),document.querySelectorAll(`.prest-del-btn`).forEach(e=>{e.addEventListener(`click`,async e=>{let t=e.currentTarget.dataset.id;if(await j(`Confirmación`,`¿Estás seguro de eliminar este préstamo?`))try{let e=Al.find(e=>e.id_prestamo===t);e&&e.tipo===`Producto`&&e.estado===`Pendiente`&&(await Bl(e.producto_id,e.cantidad),A(`Stock devuelto a inventario`,`info`)),await vn(t),A(`Préstamo eliminado`,`success`),await Ll()}catch{A(`Error al eliminar`,`error`)}})})}}function zl(e){let t=0,n=0;e.forEach(e=>{let r=parseFloat(e.monto)||0;e.estado===`Pendiente`?t+=r:n+=r});let r=document.getElementById(`nom-prest-stat-activo`),i=document.getElementById(`nom-prest-stat-cobrado`);r&&(r.textContent=`$`+t.toLocaleString(`es-CO`)),i&&(i.textContent=`$`+n.toLocaleString(`es-CO`))}async function Bl(e,t){try{let n=(await P()).find(t=>t.id===e);if(!n)return;let r=Math.max(0,(n.stockActual||0)+t),i=[n.id,n.nombre,n.marca||``,n.categoria||``,n.tipo||`Físico`,n.costo||0,n.precioVenta||0,n.stockMinimo||0,r,n.ubicacion||``,n.sku||``,n.imagen||``];await jt(n.id,i)}catch(e){console.error(`Error al actualizar stock del producto:`,e)}}function Vl(e){let t=document.getElementById(`nom-tab-nominas`),n=document.getElementById(`nom-tab-prestamos`),r=document.getElementById(`nom-nominas-tab-content`),i=document.getElementById(`nom-prestamos-tab-content`),a=document.getElementById(`nom-new-btn`),o=document.getElementById(`nom-prestamos-new-btn`);e===`nominas`?(t?.classList.add(`border-primary`,`text-primary`,`font-black`),t?.classList.remove(`border-transparent`,`text-on-surface-variant`,`font-bold`),n?.classList.remove(`border-primary`,`text-primary`,`font-black`),n?.classList.add(`border-transparent`,`text-on-surface-variant`,`font-bold`),r?.classList.remove(`hidden`),i?.classList.add(`hidden`),a?.classList.remove(`hidden`),o?.classList.add(`hidden`)):(n?.classList.add(`border-primary`,`text-primary`,`font-black`),n?.classList.remove(`border-transparent`,`text-on-surface-variant`,`font-bold`),t?.classList.remove(`border-primary`,`text-primary`,`font-black`),t?.classList.add(`border-transparent`,`text-on-surface-variant`,`font-bold`),i?.classList.remove(`hidden`),r?.classList.add(`hidden`),o?.classList.remove(`hidden`),a?.classList.add(`hidden`))}function Hl(e){let t=document.getElementById(`nom-prestamo-dinero-fields`),n=document.getElementById(`nom-prestamo-producto-fields`);e===`Producto`?(t?.classList.add(`hidden`),n?.classList.remove(`hidden`)):(t?.classList.remove(`hidden`),n?.classList.add(`hidden`))}async function Ul(e){let t=document.getElementById(`nom-prestamos-sugeridos-cont`),n=document.getElementById(`nom-prestamos-sugeridos-desglose`),r=document.getElementById(`nom-deduc`);if(!e){t?.classList.add(`hidden`),r&&(r.value=0),Il();return}try{let i=(await hn()).filter(t=>t.empleado===e&&t.estado===`Pendiente`);if(i.length>0){let e=i.reduce((e,t)=>e+(parseFloat(t.monto)||0),0),a=i.map(e=>e.tipo===`Dinero`?`Préstamo Dinero: $${parseFloat(e.monto).toLocaleString(`es-CO`)}`:`${e.cantidad}x ${e.producto_nombre}: $${parseFloat(e.monto).toLocaleString(`es-CO`)}`).join(`, `);n&&(n.innerHTML=`Sugerido deducir: <strong>$${e.toLocaleString(`es-CO`)}</strong><br/>(${a})`),t?.classList.remove(`hidden`),r&&(r.value=e)}else t?.classList.add(`hidden`),r&&(r.value=0);Il()}catch(e){console.error(`Error al consultar préstamos para deducción:`,e)}}var Wl=!1;function Gl(){if(Wl)return;Wl=!0,document.getElementById(`nom-tab-nominas`)?.addEventListener(`click`,()=>Vl(`nominas`)),document.getElementById(`nom-tab-prestamos`)?.addEventListener(`click`,()=>Vl(`prestamos`)),window.setupCustomSelect(`nom-estado-container`,`nom-estado`),window.setupCustomSelect(`nom-empleado-container`,`nom-empleado`,Ul),window.setupCustomSelect(`nom-prestamo-empleado-container`,`nom-prestamo-empleado`),window.setupCustomSelect(`nom-prestamo-tipo-container`,`nom-prestamo-tipo`,Hl),window.setupCustomSelect(`nom-prestamo-producto-container`,`nom-prestamo-producto`,e=>{let t=jl.find(t=>t.id===e);if(t){let e=parseInt(document.getElementById(`nom-prestamo-cantidad`).value)||1;document.getElementById(`nom-prestamo-monto`).value=(t.precioVenta||0)*e}});let e=document.getElementById(`nom-modal`),t=document.getElementById(`nom-form`);document.getElementById(`nom-new-btn`)?.addEventListener(`click`,()=>{t.reset();let n=kl.map(e=>{let t=`person`;return e.rol===`Administrador`?t=`shield_person`:e.rol===`Técnico de reparación`?t=`build`:e.rol===`Vendedor`&&(t=`badge`),{value:e.nombre,label:`${e.nombre} (${e.rol})`,icon:t}});window.buildCustomSelectOptions(`nom-empleado-container`,`nom-empleado`,n,`Seleccione empleado...`,Ul),window.syncCustomSelectUI(`nom-estado-container`,`Pendiente`),window.syncCustomSelectUI(`nom-empleado-container`,``),document.getElementById(`nom-prestamos-sugeridos-cont`)?.classList.add(`hidden`),Il(),e.classList.remove(`hidden`),e.classList.add(`flex`)}),document.getElementById(`nom-modal-close`)?.addEventListener(`click`,()=>{e.classList.add(`hidden`),e.classList.remove(`flex`)}),document.getElementById(`nom-modal-cancel`)?.addEventListener(`click`,()=>{e.classList.add(`hidden`),e.classList.remove(`flex`)}),document.getElementById(`nom-base`)?.addEventListener(`input`,Il),document.getElementById(`nom-bonos`)?.addEventListener(`input`,Il),document.getElementById(`nom-deduc`)?.addEventListener(`input`,Il),document.getElementById(`nom-save-btn`)?.addEventListener(`click`,async()=>{if(!t.checkValidity()){t.reportValidity();return}let n=document.getElementById(`nom-empleado`).value;if(!n)return A(`Debe seleccionar un empleado`,`warning`);let r=parseFloat(document.getElementById(`nom-base`).value)||0,i=parseFloat(document.getElementById(`nom-bonos`).value)||0,a=parseFloat(document.getElementById(`nom-deduc`).value)||0,o=r+i-a,s={empleado:n,periodo:document.getElementById(`nom-periodo`).value,salario_base:r,bonificaciones:i,deducciones:a,total_pagar:o,estado:document.getElementById(`nom-estado`).value,notas:document.getElementById(`nom-notas`).value},c=document.getElementById(`nom-save-btn`);c.disabled=!0,c.innerHTML=`<span class="material-symbols-outlined text-[18px] animate-spin">refresh</span> Guardando...`;try{await rn(s);try{let e=(await hn()).filter(e=>e.empleado===n&&e.estado===`Pendiente`);for(let t of e)await _n(t.id_prestamo,`Deducido`)}catch(e){console.error(`Error al actualizar estado de préstamos a deducidos:`,e)}A(`Nómina registrada exitosamente`,`success`),e.classList.add(`hidden`),e.classList.remove(`flex`),await Nl(),await Ll()}catch(e){A(`Error al guardar: `+e.message,`error`)}finally{c.disabled=!1,c.innerHTML=`<span class="material-symbols-outlined text-[18px]">save</span> Guardar`}}),document.getElementById(`nom-prestamos-new-btn`)?.addEventListener(`click`,()=>{document.getElementById(`nom-prestamo-form`).reset();let e=kl.filter(e=>e.rol!==`Cliente`).map(e=>{let t=`person`;return e.rol===`Administrador`?t=`shield_person`:e.rol===`Técnico de reparación`?t=`build`:e.rol===`Vendedor`&&(t=`badge`),{value:e.nombre,label:`${e.nombre} (${e.rol})`,icon:t}});window.buildCustomSelectOptions(`nom-prestamo-empleado-container`,`nom-prestamo-empleado`,e,`Seleccione empleado...`);let t=jl.map(e=>({value:e.id,label:`${e.nombre} (Stock: ${e.stockActual||0})`,icon:`smartphone`}));window.buildCustomSelectOptions(`nom-prestamo-producto-container`,`nom-prestamo-producto`,t,`Seleccione producto...`,e=>{let t=jl.find(t=>t.id===e);if(t){let e=parseInt(document.getElementById(`nom-prestamo-cantidad`).value)||1;document.getElementById(`nom-prestamo-monto`).value=(t.precioVenta||0)*e}}),window.syncCustomSelectUI(`nom-prestamo-empleado-container`,``),window.syncCustomSelectUI(`nom-prestamo-tipo-container`,`Dinero`),window.syncCustomSelectUI(`nom-prestamo-producto-container`,``),Hl(`Dinero`);let n=document.getElementById(`nom-prestamo-modal`);n?.classList.remove(`hidden`),n?.classList.add(`flex`)});let n=()=>{let e=document.getElementById(`nom-prestamo-modal`);e?.classList.add(`hidden`),e?.classList.remove(`flex`)};document.getElementById(`nom-prestamo-modal-close`)?.addEventListener(`click`,n),document.getElementById(`nom-prestamo-modal-cancel`)?.addEventListener(`click`,n),document.getElementById(`nom-prestamo-cantidad`)?.addEventListener(`input`,()=>{let e=document.getElementById(`nom-prestamo-producto`).value,t=jl.find(t=>t.id===e);if(t){let e=parseInt(document.getElementById(`nom-prestamo-cantidad`).value)||1;document.getElementById(`nom-prestamo-monto`).value=(t.precioVenta||0)*e}}),document.getElementById(`nom-prestamo-save-btn`)?.addEventListener(`click`,async()=>{let e=document.getElementById(`nom-prestamo-form`);if(!e.checkValidity()){e.reportValidity();return}let t=document.getElementById(`nom-prestamo-empleado`).value,r=document.getElementById(`nom-prestamo-tipo`).value,i=document.getElementById(`nom-prestamo-notas`).value;if(!t)return A(`Debe seleccionar un empleado`,`warning`);let a=``,o=``,s=0,c=0;if(r===`Producto`){if(a=document.getElementById(`nom-prestamo-producto`).value,!a)return A(`Debe seleccionar un producto`,`warning`);let e=jl.find(e=>e.id===a);if(!e)return;if(o=e.nombre,s=parseInt(document.getElementById(`nom-prestamo-cantidad`).value)||1,(e.stockActual||0)<s)return A(`Stock insuficiente. Disponible: ${e.stockActual||0}`,`warning`);c=(e.precioVenta||0)*s}else if(c=parseFloat(document.getElementById(`nom-prestamo-monto`).value)||0,c<=0)return A(`Debe ingresar un monto válido`,`warning`);let l=document.getElementById(`nom-prestamo-save-btn`);l.disabled=!0,l.innerHTML=`<span class="material-symbols-outlined text-[18px] animate-spin">refresh</span> Guardando...`;try{r===`Producto`&&await Bl(a,-s),await gn({empleado:t,tipo:r,monto:c,producto_id:a,producto_nombre:o,cantidad:s,estado:`Pendiente`,notas:i}),A(`Préstamo registrado exitosamente`,`success`),n(),await Ll()}catch(e){A(`Error al guardar préstamo: `+e.message,`error`)}finally{l.disabled=!1,l.innerHTML=`<span class="material-symbols-outlined text-[18px]">save</span> Guardar`}})}var Kl=``;function ql(){return()=>{Yl(),Xl(),Jl(),Zl()}}function Jl(){let e=document.getElementById(`set-api-turso-url`),t=document.getElementById(`set-api-turso-token`),n=document.getElementById(`set-api-openrouter-key`);e&&(e.value=localStorage.getItem(`fonebase_custom_turso_url`)||``),t&&(t.value=localStorage.getItem(`fonebase_custom_turso_token`)||``),n&&(n.value=localStorage.getItem(`fonebase_custom_openrouter_key`)||``)}function Yl(){let e=document.getElementById(`set-avatar`),t=document.getElementById(`set-name`),n=document.getElementById(`set-role`),r=document.getElementById(`set-email`);try{let i=localStorage.getItem(`adminproSession`),a=localStorage.getItem(`adminpro_user`),o=i?JSON.parse(i):a?JSON.parse(a):null;if(o){t&&(t.textContent=o.nombre||`Usuario`),n&&(n.textContent=o.rol||`Administrador`),r&&(r.textContent=o.email||`No disponible`),e&&(e.textContent=(o.nombre?o.nombre.charAt(0):`U`).toUpperCase());let i=document.getElementById(`settings-left-col`),a=document.getElementById(`settings-right-col`);o.rol===`Administrador`?(a&&a.classList.remove(`hidden`),i&&(i.className=`lg:col-span-5 space-y-6`)):(a&&a.classList.add(`hidden`),i&&(i.className=`lg:col-span-12 space-y-6`))}}catch(e){console.error(`Error loading profile`,e)}let i=document.getElementById(`set-theme-toggle`);i&&(i.checked=document.documentElement.classList.contains(`dark`))}async function Xl(){try{let e=await un();if(e){document.getElementById(`set-store-nombre`).value=e.nombre||``,document.getElementById(`set-store-nit`).value=e.nit||``,document.getElementById(`set-store-propietario`).value=e.propietario||``,document.getElementById(`set-store-telefono`).value=e.telefono||``,document.getElementById(`set-store-direccion`).value=e.direccion||``,document.getElementById(`set-store-ciudad`).value=e.ciudad||``,document.getElementById(`set-store-correo`).value=e.correo||``,document.getElementById(`set-store-contacto`).value=e.contacto||``,document.getElementById(`set-store-condiciones`).value=e.condiciones||``;let t=e.logo_size||40,n=document.getElementById(`set-store-logo-size`),r=document.getElementById(`set-store-logo-size-val`);n&&(n.value=t),r&&(r.textContent=t+`px`);let i=e.mostrar_nombre!==0,a=document.getElementById(`set-store-mostrar-nombre`);a&&(a.checked=i);let o=localStorage.getItem(`fonebase_paper_format`)||`48mm`,s=document.getElementById(`set-store-paper-format`);s&&(s.value=o),window.setupCustomSelect(`set-store-paper-format-container`,`set-store-paper-format`),window.syncCustomSelectUI(`set-store-paper-format-container`,o);let c=document.getElementById(`set-store-logo-img`),l=document.getElementById(`set-store-logo-placeholder`);e.logo?(Kl=e.logo,c.src=e.logo,c.classList.remove(`hidden`),l.classList.add(`hidden`)):(Kl=``,c.src=``,c.classList.add(`hidden`),l.classList.remove(`hidden`))}}catch(e){console.error(`Error al cargar datos del almacén:`,e)}}function Zl(){let e=document.getElementById(`settings-add-local-btn`);e&&e.replaceWith(e.cloneNode(!0)),document.getElementById(`settings-add-local-btn`)?.addEventListener(`click`,async()=>{let e=await Ge(`Nueva Sucursal`,`Ingrese el nombre de la nueva sucursal / local:`);if(!(!e||!e.trim()))try{A(`Creando sucursal...`,`info`);let t=await pn(e.trim());localStorage.setItem(`fonebase_active_local_id`,String(t)),A(`Sucursal creada con éxito. Cargando datos...`,`success`),setTimeout(()=>{location.reload()},1500)}catch(e){A(`Error al crear sucursal: `+e.message,`error`)}});let t=document.getElementById(`set-theme-toggle`);t&&t.replaceWith(t.cloneNode(!0)),document.getElementById(`set-theme-toggle`)?.addEventListener(`change`,e=>{e.target.checked?(document.documentElement.classList.add(`dark`),localStorage.setItem(`adminpro_theme`,`dark`)):(document.documentElement.classList.remove(`dark`),localStorage.setItem(`adminpro_theme`,`light`))});let n=document.getElementById(`store-settings-form`);n&&n.replaceWith(n.cloneNode(!0));let r=document.getElementById(`store-settings-form`),i=document.getElementById(`set-store-logo-file`),a=document.getElementById(`set-store-logo-error`),o=document.getElementById(`set-store-logo-size`),s=document.getElementById(`set-store-logo-size-val`);o?.addEventListener(`input`,e=>{let t=e.target.value;s&&(s.textContent=t+`px`)}),i?.addEventListener(`change`,e=>{let t=e.target.files[0];if(!t)return;if(!t.type.startsWith(`image/`)){a.textContent=`Error: El archivo seleccionado no es una imagen válida.`,a.classList.remove(`hidden`),i.value=``;return}a.classList.add(`hidden`);let n=new FileReader;n.onload=function(e){let t=e.target.result,n=new Image;n.src=t,n.onload=function(){let e=n.width,t=n.height;(e>300||t>300)&&(e>t?(t=Math.round(t*300/e),e=300):(e=Math.round(e*300/t),t=300));let r=document.createElement(`canvas`);r.width=e,r.height=t,r.getContext(`2d`).drawImage(n,0,0,e,t);let i=r.toDataURL(`image/png`);Kl=i;let o=document.getElementById(`set-store-logo-img`),s=document.getElementById(`set-store-logo-placeholder`);o&&(o.src=i,o.classList.remove(`hidden`)),s&&s.classList.add(`hidden`),a.classList.add(`hidden`)},n.onerror=function(){a.textContent=`Error al procesar la imagen.`,a.classList.remove(`hidden`),i.value=``}},n.readAsDataURL(t)}),r?.addEventListener(`submit`,async e=>{e.preventDefault();let t=document.getElementById(`set-store-save-btn`);t.disabled=!0,t.textContent=`Guardando...`;let n={nombre:document.getElementById(`set-store-nombre`).value.trim(),nit:document.getElementById(`set-store-nit`).value.trim(),propietario:document.getElementById(`set-store-propietario`).value.trim(),telefono:document.getElementById(`set-store-telefono`).value.trim(),direccion:document.getElementById(`set-store-direccion`).value.trim(),ciudad:document.getElementById(`set-store-ciudad`).value.trim(),contacto:document.getElementById(`set-store-contacto`).value.trim(),correo:document.getElementById(`set-store-correo`).value.trim(),condiciones:document.getElementById(`set-store-condiciones`).value.trim(),logo:Kl,logo_size:parseInt(document.getElementById(`set-store-logo-size`)?.value||`40`,10),mostrar_nombre:+!!document.getElementById(`set-store-mostrar-nombre`)?.checked};try{let e=document.getElementById(`set-store-paper-format`)?.value||`80mm`;localStorage.setItem(`fonebase_paper_format`,e);let t=await dn(n);t&&t.success?A(`Datos de almacén guardados correctamente`,`success`):A(`Error al guardar en base de datos`,`error`)}catch(e){A(`Error: `+e.message,`error`)}finally{t.disabled=!1,t.innerHTML=`<span class="material-symbols-outlined text-[18px]">save</span> Guardar Datos`}});let c=document.getElementById(`set-store-preview-modal`),l=document.getElementById(`set-store-preview-close`),u=document.getElementById(`set-store-preview-close-bg`),d=()=>{try{let e=document.getElementById(`set-store-mostrar-nombre`)?.checked,t=document.getElementById(`preview-ticket-name`);t&&(e?(t.textContent=document.getElementById(`set-store-nombre`)?.value.trim()||``,t.classList.remove(`hidden`)):t.classList.add(`hidden`));let n=document.getElementById(`preview-ticket-nit`);n&&(n.textContent=document.getElementById(`set-store-nit`)?.value.trim()||``);let r=document.getElementById(`preview-ticket-address`);r&&(r.textContent=document.getElementById(`set-store-direccion`)?.value.trim()||``);let i=document.getElementById(`set-store-ciudad`)?.value.trim(),a=document.getElementById(`preview-ticket-city`);a&&(i?(a.textContent=i,a.classList.remove(`hidden`)):(a.textContent=``,a.classList.add(`hidden`)));let o=document.getElementById(`preview-ticket-tel`);o&&(o.textContent=document.getElementById(`set-store-telefono`)?.value.trim()||``);let s=document.getElementById(`preview-ticket-conditions`);s&&(s.textContent=document.getElementById(`set-store-condiciones`)?.value.trim()||``);let l=document.getElementById(`preview-ticket-logo-box`),u=document.getElementById(`preview-ticket-logo-img-box`),d=document.getElementById(`preview-ticket-logo-img`);if(Kl&&d){d.src=Kl;let e=parseInt(document.getElementById(`set-store-logo-size`)?.value||`40`,10);d.style.width=`auto`,d.style.height=`auto`,d.style.maxHeight=e+`px`,d.style.maxWidth=`100%`,l&&l.classList.add(`hidden`),u&&u.classList.remove(`hidden`)}else l&&l.classList.remove(`hidden`),u&&u.classList.add(`hidden`);c&&(c.classList.remove(`hidden`),c.classList.add(`flex`))}catch(e){console.error(`Error al previsualizar factura:`,e)}},f=document.getElementById(`set-store-preview-btn`);f&&(f.replaceWith(f.cloneNode(!0)),document.getElementById(`set-store-preview-btn`)?.addEventListener(`click`,d));let p=document.getElementById(`set-store-top-preview-btn`);p&&(p.replaceWith(p.cloneNode(!0)),document.getElementById(`set-store-top-preview-btn`)?.addEventListener(`click`,d));let m=()=>{c&&(c.classList.add(`hidden`),c.classList.remove(`flex`))};l?.addEventListener(`click`,m),u?.addEventListener(`click`,m);let h=()=>{let e=document.getElementById(`set-store-nombre`)?.value.trim()||``,t=document.getElementById(`set-store-nit`)?.value.trim()||``,n=document.getElementById(`set-store-direccion`)?.value.trim()||``,r=document.getElementById(`set-store-ciudad`)?.value.trim()||``,i=document.getElementById(`set-store-telefono`)?.value.trim()||``,a=document.getElementById(`set-store-condiciones`)?.value.trim()||``,o=document.getElementById(`set-store-mostrar-nombre`)?.checked===!1?0:1,s=parseInt(document.getElementById(`set-store-logo-size`)?.value||`40`,10),c=[n,r].filter(e=>e&&e.trim()).join(`, `);return{idFactura:`FAC-DEMO-001`,fecha:new Date().toISOString(),cliente:`Juan Pérez (Cliente Prueba)`,cedula:`1012345678`,telefono:`3123456789`,direccion:`Carrera 15 # 28 - 10`,ciudad:r,productoNombre:`1x Audífonos Inalámbricos Pro, 1x Cargador 20W`,items:[{nombre:`Audífonos Inalámbricos Pro`,qty:1,precioVenta:8e4},{nombre:`Cargador Carga Rápida 20W`,qty:1,precioVenta:45e3}],subtotal:125e3,descuento:5e3,total:12e4,metodo:`Efectivo`,vendedor:`Administrador`,tipoFactura:`digital`,imeis:`N/A`,emisor:{nombre:e,nit:t,direccion:c,contacto:i,condiciones:a,logo:Kl,logo_size:s,mostrar_nombre:o}}},g=document.getElementById(`set-store-preview-print-bt`);g&&(g.replaceWith(g.cloneNode(!0)),document.getElementById(`set-store-preview-print-bt`)?.addEventListener(`click`,async()=>{try{A(`Conectando a impresora Bluetooth...`,`info`);let e=h();await li(e,null,null,e.emisor),A(`Impresión Bluetooth realizada`,`success`)}catch(e){console.error(`Error en impresión Bluetooth:`,e),A(`Error Bluetooth: `+e.message,`error`)}}));let _=document.getElementById(`api-settings-form`);_&&_.replaceWith(_.cloneNode(!0)),document.getElementById(`api-settings-form`)?.addEventListener(`submit`,async e=>{e.preventDefault();let t=document.getElementById(`set-api-save-btn`);t.disabled=!0,t.textContent=`Guardando...`;let n=document.getElementById(`set-api-turso-url`).value.trim(),r=document.getElementById(`set-api-turso-token`).value.trim(),i=document.getElementById(`set-api-openrouter-key`).value.trim();n?localStorage.setItem(`fonebase_custom_turso_url`,n):localStorage.removeItem(`fonebase_custom_turso_url`),r?localStorage.setItem(`fonebase_custom_turso_token`,r):localStorage.removeItem(`fonebase_custom_turso_token`),i?localStorage.setItem(`fonebase_custom_openrouter_key`,i):localStorage.removeItem(`fonebase_custom_openrouter_key`),A(`Ajustes de conexión guardados. Recargando aplicación...`,`success`),setTimeout(()=>{location.reload()},1500)});let v=document.getElementById(`set-backup-export-btn`);v&&v.replaceWith(v.cloneNode(!0));let y=document.getElementById(`set-backup-export-btn`);y?.addEventListener(`click`,async()=>{y.disabled=!0,y.textContent=`Exportando...`;try{let e=[`usuarios`,`clientes`,`inventario`,`equipos`,`ventas`,`egresos`,`servicio_tecnico`,`creditos`,`reventas`,`proveedores`,`marcas_categorias`,`vales_fisicos`,`tareas`,`nominas`,`prestamos_empleados`,`metas_financieras`,`ajustes_empresa`],t=await M(e.map(e=>`SELECT * FROM ${e}`)),n={metadata:{fecha:new Date().toISOString(),origen:`FoneBase SQLite Cloud Backup`,total_tablas:e.length},tablas:{}};e.forEach((e,r)=>{n.tablas[e]=t[r]||[]});let r=`backup_fonebase_${new Date().toISOString().split(`T`)[0]}.json`,i=JSON.stringify(n,null,2);if(navigator.share)try{let e=new File([i],r,{type:`application/json`});if(navigator.canShare&&navigator.canShare({files:[e]})){await navigator.share({files:[e],title:`Copia de Seguridad FoneBase`,text:`Respaldo completo de base de datos FoneBase en formato JSON.`}),A(`Copia de seguridad compartida correctamente`,`success`);return}}catch(e){console.warn(`No se pudo compartir como archivo, intentando descarga estándar...`,e)}let a=new Blob([i],{type:`application/json`}),o=URL.createObjectURL(a),s=document.createElement(`a`);s.href=o,s.download=r,s.click(),URL.revokeObjectURL(o),A(`Copia de seguridad descargada correctamente`,`success`)}catch(e){A(`Error al exportar copia: `+e.message,`error`)}finally{y.disabled=!1,y.innerHTML=`<span class="material-symbols-outlined text-[18px] text-primary">download</span> Exportar JSON`}});let b=document.getElementById(`set-backup-import-btn`),x=document.getElementById(`set-backup-file-input`);b&&b.replaceWith(b.cloneNode(!0)),x&&x.replaceWith(x.cloneNode(!0));let S=document.getElementById(`set-backup-import-btn`),C=document.getElementById(`set-backup-file-input`);S?.addEventListener(`click`,()=>{C?.click()}),C?.addEventListener(`change`,e=>{let t=e.target.files[0];if(!t)return;let n=new FileReader;n.onload=async e=>{try{let t=JSON.parse(e.target.result);if(!t||!t.tablas)throw Error(`El archivo de copia de seguridad no es válido o está corrupto.`);if(!await j(`Confirmación de Restauración`,`Esta acción borrará TODOS los datos actuales del servidor y restaurará los del archivo seleccionado. ¿Estás seguro de que deseas proceder?`)){C.value=``;return}S.disabled=!0,S.textContent=`Restaurando...`;let n=Object.keys(t.tablas);A(`Iniciando restauración de datos...`,`info`),await M(n.map(e=>`DELETE FROM ${e}`),!0);let r=0,i=[];for(let e of n){let n=t.tablas[e];if(!Array.isArray(n)||n.length===0)continue;let a=Object.keys(n[0]),o=`INSERT INTO ${e} (${a.join(`, `)}) VALUES (${a.map(()=>`?`).join(`, `)})`;for(let e of n){let t=a.map(t=>e[t]);i.push({sql:o,args:N(t)}),i.length>=150&&(await M(i,!0),r+=i.length,i=[])}}i.length>0&&(await M(i,!0),r+=i.length),A(`Restauración exitosa: ${r} registros restaurados. Recargando...`,`success`),setTimeout(()=>{location.reload()},2e3)}catch(e){A(`Error al restaurar copia: `+e.message,`error`)}finally{S.disabled=!1,S.innerHTML=`<span class="material-symbols-outlined text-[18px] text-primary">upload_file</span> Restaurar JSON`,C.value=``}},n.readAsText(t)})}var Ql=null,$l=[],eu=0,tu=!1,nu=``;async function ru(){let e=document.querySelector(`[data-view="kiosk"]`);if(e){try{nu=JSON.parse(localStorage.getItem(`adminpro_user`)||`{}`).rol||``;let[e,t]=await Promise.all([P(),Pt()]),n=(e||[]).filter(e=>e.imagen&&e.precioVenta>0).map(e=>{let t=``,n=``,r=``,i=e.nombre||``,a=(e.categoria||``).trim().toLowerCase();if(a===`celular`||a===`celulares`){let e=/\(([^/)]+)(?:\s*\/\s*([^/)]+))?(?:\s*\/\s*([^/)]+))?\)$/,a=i.match(e);if(a){i=i.replace(e,``).trim();let o=[a[1],a[2],a[3]].filter(Boolean).map(e=>e.trim());o.length===3?(t=o[0],n=o[1],r=o[2]):o.length===2?o[0].toLowerCase().includes(`ram`)?(t=o[0],n=o[1]):o[1].toLowerCase().includes(`ram`)?(t=o[1],n=o[0]):(n=o[0],r=o[1]):o.length===1&&(o[0].toLowerCase().includes(`ram`)?t=o[0]:/\b\d+\s*(?:GB|TB)\b/i.test(o[0])?n=o[0]:r=o[0])}}return t&&=t.replace(/\s*RAM\b/gi,``).trim(),{id:e.id,nombre:i,marca:e.marca||`Editorial`,categoria:e.categoria||`Accesorio`,precio:e.precioVenta,imagen:e.imagen,destacado:e.categoria===`Celulares`?`LA COLECCIÓN EXCLUSIVA`:`EL DETALLE PERFECTO`,subtitulo:`Diseño de vanguardia y rendimiento excepcional en cada línea.`,specs:[r?`Acabado ${r}`:null,t?`Rendimiento de ${t} RAM`:null,n?`Espacio: ${n}`:null].filter(Boolean)}}),r=(t||[]).filter(e=>e.venta>0&&e.estado===`Disponible`).map(e=>({id:e.imei1,nombre:e.nombre,marca:e.marca||`Signature`,categoria:`Celular IMEI`,precio:e.venta,imagen:e.imagen||`https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop`,destacado:`EDICIÓN DE COLECCIONISTA`,subtitulo:`La obra maestra de la tecnología móvil ya está disponible en tienda.`,specs:[`Garantía Certificada`,`Disponibilidad Inmediata`,`IMEI Registrado`]}));$l=[...n,...r],$l.length===0&&($l=[{id:`demo-1`,nombre:`iPhone 15 Pro Max 256GB`,marca:`Apple Edition`,categoria:`Smartphone`,precio:489e4,imagen:`https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800&auto=format&fit=crop`,destacado:`LA CÚSPIDE DE LA ELEGANCIA`,subtitulo:`Un marco de titanio cepillado que redefine la sofisticación moderna y la potencia.`,specs:[`Pantalla 6.7'' Super Retina XDR`,`Estructura de Titanio Grado 5`,`Cámara Teleobjetivo de 120mm`]},{id:`demo-2`,nombre:`Galaxy S24 Ultra Titanium`,marca:`Samsung Lux`,categoria:`Smartphone`,precio:459e4,imagen:`https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=800&auto=format&fit=crop`,destacado:`EL FUTURO ES INTELIGENCIA`,subtitulo:`Inteligencia artificial que optimiza cada momento de tu rutina diaria.`,specs:[`Galaxy AI Integrada`,`Lápiz Óptico Integrado`,`Estructura de Titanio Puro`]}])}catch(e){console.error(`Error al cargar productos en Kiosco:`,e)}eu=0,iu(e),au(),e.addEventListener(`click`,async e=>{e.target.closest(`#kiosk-top-logout-btn`)&&await j(`Confirmación`,`¿Estás seguro de que deseas cerrar sesión?`)&&Qe()})}}function iu(e){let t=$l[eu]||$l[0],n=new Intl.NumberFormat(`es-CO`,{style:`currency`,currency:`COP`,maximumFractionDigits:0}).format(t.precio),r={bg:`#D6D2C9`,black:`#111111`,blackDeep:`#080808`,cream:`#E8E4DC`,green:`#34D399`,red:`#E6171A`,line:`#3A3A3A`},i=t.specs&&t.specs.length>0?t.specs.slice(0,4).map((e,t)=>{let n=[`<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="${r.black}" stroke-width="1.5"><path d="M12 2l8 3v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V5l8-3z"/></svg>`,`<svg width="22" height="26" viewBox="0 0 20 28" fill="none" stroke="${r.black}" stroke-width="1.5"><rect x="1" y="1" width="18" height="26"/><path d="M7 21l6-14"/></svg>`,`<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="${r.black}" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/></svg>`,`<svg width="24" height="26" viewBox="0 0 24 28" fill="none" stroke="${r.black}" stroke-width="1.5"><rect x="6" y="8" width="12" height="16"/><path d="M9 8V4M15 8V4"/></svg>`];return`<div style="display:flex;align-items:center;gap:clamp(10px,3cqw,16px);padding:clamp(12px,4.5cqw,22px) clamp(12px,5cqw,28px);border-top:1px solid ${r.line};${t%2==0?`border-right:1px solid ${r.line};`:``}">
          ${n[t]||n[0]}
          <span style="font-family:'IBM Plex Mono',monospace;font-size:clamp(9px,2.2cqw,13px);font-weight:700;letter-spacing:clamp(0.3px,0.3cqw,1.5px);text-transform:uppercase;line-height:1.3;color:${r.black};">${e.replace(/ /g,`<br>`)}</span>
        </div>`}):[{label:`1 AÑO<br>GARANTÍA`,icon:`<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="${r.black}" stroke-width="1.5"><path d="M12 2l8 3v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V5l8-3z"/></svg>`},{label:`CARGADOR<br>INCLUIDO`,icon:`<svg width="22" height="26" viewBox="0 0 20 28" fill="none" stroke="${r.black}" stroke-width="1.5"><rect x="1" y="1" width="18" height="26"/><path d="M7 21l6-14"/></svg>`},{label:`VIDRIO<br>BLINDADO`,icon:`<svg width="24" height="26" viewBox="0 0 24 24" fill="none" stroke="${r.black}" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/></svg>`},{label:`TODOS LOS<br>OPERADORES`,icon:`<svg width="24" height="26" viewBox="0 0 24 28" fill="none" stroke="${r.black}" stroke-width="1.5"><rect x="6" y="8" width="12" height="16"/><path d="M9 8V4M15 8V4"/></svg>`}].map((e,t)=>`<div style="display:flex;align-items:center;gap:clamp(10px,3cqw,16px);padding:clamp(12px,4.5cqw,22px) clamp(12px,5cqw,28px);border-top:1px solid ${r.line};${t%2==0?`border-right:1px solid ${r.line};`:``}">
        ${e.icon}
        <span style="font-family:'IBM Plex Mono',monospace;font-size:clamp(9px,2.2cqw,13px);font-weight:700;letter-spacing:clamp(0.3px,0.3cqw,1.5px);text-transform:uppercase;line-height:1.3;color:${r.black};">${e.label}</span>
      </div>`),a=$l.map((e,t)=>`<button data-kiosk-index="${t}" style="width:${t===eu?`28px`:`8px`};height:8px;border-radius:4px;background:${t===eu?r.cream:`rgba(232,228,220,0.35)`};border:none;cursor:pointer;transition:all .35s;flex-shrink:0;"></button>`).join(``);e.innerHTML=`
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet">
  
  <style id="kiosk-print-rules">
    @media print {
      @page {
        size: A4 portrait;
        margin: 8mm;
      }
      
      html, body {
        background: #ffffff !important;
        margin: 0 !important;
        padding: 0 !important;
        width: 100% !important;
        height: auto !important;
      }

      /* Ocultar elementos generales fuera del póster */
      body > *:not(#app-shell),
      #app-shell > header,
      #app-shell > aside,
      #desktop-nav,
      .kiosk-no-print {
        display: none !important;
      }

      [data-view="kiosk"] {
        display: block !important;
        position: static !important;
        width: 100% !important;
        height: auto !important;
        background: transparent !important;
        padding: 0 !important;
        margin: 0 !important;
      }

      .kiosk-outer-wrapper {
        position: static !important;
        inset: auto !important;
        background: transparent !important;
        padding: 0 !important;
        margin: 0 !important;
        display: block !important;
        width: 100% !important;
        overflow: visible !important;
      }

      .kiosk-poster-card {
        width: 100% !important;
        max-width: 190mm !important;
        margin: 0 auto !important;
        border: 1px solid #111111 !important;
        box-shadow: none !important;
        overflow: visible !important;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
    }

    /* Screen-only responsive layouts & transitions */
    .kiosk-poster-card {
      animation: fadeInKiosk 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes fadeInKiosk {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .kiosk-benefits-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      border: 1px solid ${r.line};
      margin: 0 clamp(18px, 7cqw, 44px);
      border-top: none;
    }
    
    .kiosk-footer {
      background: ${r.black};
      color: ${r.cream};
      padding: clamp(14px, 5cqw, 26px) clamp(18px, 7cqw, 44px);
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      margin-top: clamp(18px, 5cqw, 36px);
      font-size: clamp(9px, 1.9cqw, 11px);
      font-family: 'IBM Plex Mono', monospace;
      letter-spacing: .4px;
      line-height: 1.6;
    }

    @media (max-width: 639px) {
      .kiosk-benefits-grid {
        grid-template-columns: 1fr !important;
        margin: 0 clamp(10px, 4cqw, 18px) !important;
      }
      .kiosk-benefits-grid > div {
        border-right: none !important;
        border-bottom: 1px solid ${r.line} !important;
      }
      .kiosk-benefits-grid > div:last-child {
        border-bottom: none !important;
      }
      .kiosk-footer {
        flex-direction: column !important;
        align-items: stretch !important;
        gap: 16px !important;
        padding: 16px !important;
        margin-top: 18px !important;
      }
      .kiosk-footer-dots {
        order: 1 !important;
        justify-content: center !important;
      }
      .kiosk-footer-nav {
        order: 2 !important;
        display: flex !important;
        justify-content: space-between !important;
        width: 100% !important;
      }
      .kiosk-footer-controls {
        order: 3 !important;
        display: flex !important;
        flex-direction: column !important;
        gap: 8px !important;
        width: 100% !important;
      }
      .kiosk-footer-controls button {
        width: 100% !important;
        justify-content: center !important;
      }
    }
  </style>

  <div class="kiosk-outer-wrapper" style="
    position:fixed;inset:0;z-index:50;
    background:#9a968d;
    display:flex;justify-content:center;align-items:flex-start;
    padding:clamp(8px,2vh,24px) clamp(6px,2vw,16px);
    font-family:'IBM Plex Mono',monospace;
    overflow-y:auto;
    container-type:inline-size;container-name:kiosk-outer;
  ">
    <!-- Poster -->
    <div class="kiosk-poster-card" style="
      width:min(96vw,640px);
      background:${r.bg};
      position:relative;overflow:hidden;
      container-type:inline-size;container-name:poster;
    ">

      <!-- HEADER -->
      <div style="padding:clamp(20px,8cqw,52px) clamp(18px,7cqw,44px) clamp(14px,5cqw,36px);position:relative;">
        <div class="kiosk-no-print" style="position:absolute;top:clamp(16px,4cqw,32px);right:clamp(18px,7cqw,44px);z-index:10;display:inline-flex;gap:8px;">
          ${nu&&nu.trim().toLowerCase()===`kiosco`?`
          <button id="kiosk-top-logout-btn" title="Cerrar Sesión" style="background:${r.black};border:1px solid ${r.red};color:${r.cream};padding:6px 12px;font-family:'IBM Plex Mono',monospace;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;cursor:pointer;display:inline-flex;align-items:center;gap:6px;border-radius:4px;transition:all .2s;box-shadow:0 2px 8px rgba(0,0,0,0.2);">
            <span class="material-symbols-outlined" style="font-size:16px;line-height:1;color:${r.red};">logout</span>
            <span>Salir</span>
          </button>
          `:``}
          <button id="kiosk-top-print-btn" title="Imprimir Póster PDF" style="background:${r.black};border:1px solid ${r.line};color:${r.cream};padding:6px 12px;font-family:'IBM Plex Mono',monospace;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;cursor:pointer;display:inline-flex;align-items:center;gap:6px;border-radius:4px;transition:all .2s;box-shadow:0 2px 8px rgba(0,0,0,0.2);">
            <span class="material-symbols-outlined" style="font-size:16px;line-height:1;color:${r.green};">picture_as_pdf</span>
            <span>Imprimir PDF</span>
          </button>
        </div>
        <h1 style="
          font-family:'Bebas Neue',sans-serif;
          font-size:clamp(2.2rem,17cqw,7rem);
          line-height:0.88;color:${r.black};margin:0;
          text-transform:uppercase;letter-spacing:1px;
        ">${t.nombre.replace(/\s(.)/g,e=>`<br>`+e.trim())}</h1>
        <div style="margin-top:clamp(12px,4cqw,28px);display:flex;align-items:center;gap:16px;flex-wrap:wrap;">
          <span style="color:${r.black};font-size:clamp(10px,2.2cqw,14px);font-weight:700;letter-spacing:clamp(2px,0.9cqw,5px);text-transform:uppercase;">${t.destacado||`DISPONIBLE`}</span>
          <span style="color:${r.black};opacity:.55;font-size:clamp(9px,1.9cqw,12px);letter-spacing:clamp(1px,0.5cqw,2.5px);text-transform:uppercase;">${t.categoria}</span>
        </div>
        <div style="width:clamp(32px,8cqw,52px);height:4px;background:${r.red};margin-top:clamp(10px,2.5cqw,18px);"></div>
      </div>

      <!-- PRODUCT BLOCK -->
      <div style="
        position:relative;
        margin:0 clamp(18px,7cqw,44px);
        background:${r.black};
        min-height:clamp(300px,82cqw,560px);
        display:flex;align-items:flex-end;justify-content:flex-end;
        overflow:hidden;
      ">
        <!-- Grid overlay -->
        <div style="position:absolute;inset:0;background-image:linear-gradient(90deg,${r.line} 1px,transparent 1px);background-size:40px 100%;opacity:.1;pointer-events:none;"></div>

        <!-- Imagen del producto o teléfono CSS -->
        ${t.imagen?`<img src="${t.imagen}" alt="${t.nombre}"
               style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain;padding:clamp(12px,5cqw,32px);z-index:2;">`:`<!-- CSS Phone -->
             <div style="position:relative;z-index:2;width:44cqw;max-width:420px;height:0;padding-bottom:56cqw;max-height:540px;margin:6cqw 4cqw 0 0;flex-shrink:0;">
               <!-- Back phone -->
               <div style="position:absolute;width:52%;height:84%;left:0;top:11%;background:#1c1c1c;border:1px solid #333;">
                 <div style="position:absolute;top:9%;left:9%;width:47%;height:23%;background:${r.blackDeep};border:1px solid #2a2a2a;">
                   <div style="position:absolute;width:36%;height:36%;border-radius:50%;background:#0a0a0a;border:2px solid #303030;top:5%;left:5%;"></div>
                   <div style="position:absolute;width:36%;height:36%;border-radius:50%;background:#0a0a0a;border:2px solid #303030;top:5%;left:52%;"></div>
                   <div style="position:absolute;width:36%;height:36%;border-radius:50%;background:#0a0a0a;border:2px solid #303030;top:52%;left:5%;"></div>
                   <div style="position:absolute;top:55%;left:55%;width:19%;height:19%;border-radius:50%;background:#4a4a44;"></div>
                 </div>
               </div>
               <!-- Front phone -->
               <div style="position:absolute;width:52%;height:88%;right:0;top:0;background:${r.blackDeep};border:1px solid #2a2a2a;">
                 <div style="position:absolute;inset:2.5%;background:linear-gradient(160deg,#141414,#000 70%);"></div>
                 <div style="position:absolute;top:2.5%;left:50%;transform:translateX(-50%);width:39%;height:4%;background:#000;"></div>
                 <div style="position:absolute;background:#222;width:2px;height:6.5%;left:-2px;top:22%;"></div>
                 <div style="position:absolute;background:#222;width:2px;height:10%;left:-2px;top:32%;"></div>
                 <div style="position:absolute;background:#222;width:2px;height:10%;left:-2px;top:43%;"></div>
               </div>
             </div>`}

        <!-- Price Tag -->
        <div style="
          position:absolute;z-index:5;left:0;bottom:0;
          background:${r.blackDeep};
          border-top:1px solid ${r.line};border-right:1px solid ${r.line};
          padding:clamp(14px,5cqw,26px) clamp(18px,7cqw,38px) clamp(18px,6cqw,30px);
          max-width:78%;
        ">
          <div style="color:${r.cream};font-size:clamp(9px,2cqw,13px);font-weight:700;letter-spacing:clamp(2px,0.9cqw,5px);text-transform:uppercase;opacity:.75;">Precio</div>
          <div style="font-family:'Bebas Neue',sans-serif;color:${r.green};font-size:clamp(1.8rem,11cqw,4.2rem);line-height:1;margin-top:8px;letter-spacing:1px;white-space:nowrap;">${n}</div>
        </div>
      </div>

      <!-- BENEFITS GRID -->
      <div class="kiosk-benefits-grid">
        ${i.join(``)}
      </div>

      <!-- FOOTER -->
      <div class="kiosk-footer">
        <!-- Nav Buttons -->
        <div class="kiosk-no-print kiosk-footer-nav" style="display:flex;align-items:center;gap:10px;">
          <button id="kiosk-prev-btn" style="background:transparent;border:1px solid ${r.cream};color:${r.cream};padding:6px 12px;font-family:'IBM Plex Mono',monospace;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;cursor:pointer;transition:all .2s;">← PREV</button>
          <button id="kiosk-next-btn" style="background:${r.red};border:1px solid ${r.red};color:${r.cream};padding:6px 12px;font-family:'IBM Plex Mono',monospace;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;cursor:pointer;transition:all .2s;">NEXT →</button>
        </div>
        <!-- Dots -->
        <div class="kiosk-no-print kiosk-footer-dots" style="display:flex;align-items:center;gap:6px;flex:1;justify-content:center;min-width:120px;">${a}</div>
        <!-- Controls -->
        <div class="kiosk-no-print kiosk-footer-controls" style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
          <button id="kiosk-print-btn" title="Imprimir Póster PDF" style="background:${r.green};border:1px solid ${r.green};color:${r.black};padding:6px 12px;font-family:'IBM Plex Mono',monospace;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;cursor:pointer;display:inline-flex;align-items:center;gap:6px;border-radius:4px;transition:all .2s;">
            <span class="material-symbols-outlined" style="font-size:16px;line-height:1;">picture_as_pdf</span>
            <span>Imprimir Póster PDF</span>
          </button>
          <button id="kiosk-pause-btn" style="background:transparent;border:1px solid rgba(232,228,220,.3);color:${r.cream};padding:6px 10px;font-family:'IBM Plex Mono',monospace;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;cursor:pointer;">
            ${tu?`▶ PLAY`:`⏸ PAUSA`}
          </button>
          <button id="kiosk-exit-btn" style="background:transparent;border:none;color:rgba(232,228,220,.45);padding:6px 8px;font-family:'IBM Plex Mono',monospace;font-size:10px;font-weight:700;cursor:pointer;letter-spacing:1px;text-transform:uppercase;">SALIR ✕</button>
        </div>
      </div>

    </div><!-- /poster -->
  </div><!-- /outer -->
  `;let o=()=>{let e=tu;ou(),window.print(),!e&&window.location.hash===`#kiosk`&&au()};document.getElementById(`kiosk-print-btn`)?.addEventListener(`click`,o),document.getElementById(`kiosk-top-print-btn`)?.addEventListener(`click`,o),document.getElementById(`kiosk-prev-btn`)?.addEventListener(`click`,()=>{eu=(eu-1+$l.length)%$l.length,iu(e)}),document.getElementById(`kiosk-next-btn`)?.addEventListener(`click`,()=>{eu=(eu+1)%$l.length,iu(e)}),document.getElementById(`kiosk-pause-btn`)?.addEventListener(`click`,()=>{tu=!tu,tu?ou():au(),iu(e)}),document.getElementById(`kiosk-exit-btn`)?.addEventListener(`click`,()=>{ou(),window.location.hash=`#dashboard`}),e.querySelectorAll(`[data-kiosk-index]`).forEach(t=>{t.addEventListener(`click`,t=>{eu=parseInt(t.currentTarget.getAttribute(`data-kiosk-index`),10),iu(e)})})}function au(){ou(),!tu&&(Ql=setInterval(()=>{if(window.location.hash!==`#kiosk`){ou();return}if($l.length>0){eu=(eu+1)%$l.length;let e=document.querySelector(`[data-view="kiosk"]`);e&&iu(e)}},7e3))}function ou(){Ql&&=(clearInterval(Ql),null)}localStorage.getItem(`adminpro_theme`)===`dark`?document.documentElement.classList.add(`dark`):document.documentElement.classList.remove(`dark`),`serviceWorker`in navigator&&(window.location.hostname===`localhost`||window.location.hostname===`127.0.0.1`?(navigator.serviceWorker.getRegistrations().then(e=>{for(let t of e)t.unregister().then(()=>{console.log(`Service Worker desregistrado en localhost`)})}),window.caches&&caches.keys().then(e=>{e.forEach(e=>{caches.delete(e).then(()=>{console.log(`Cache limpiado en localhost: ${e}`)})})})):window.addEventListener(`load`,()=>{navigator.serviceWorker.register(`/adminpro/sw.js`,{scope:`/adminpro/`}).then(e=>{e.addEventListener(`updatefound`,()=>{let t=e.installing;t.addEventListener(`statechange`,()=>{t.state===`installed`&&navigator.serviceWorker.controller&&(A(`Nueva versión disponible. Actualizando aplicación...`,`success`),setTimeout(()=>{window.location.reload()},1500))})})}).catch(e=>{console.log(`ServiceWorker registration failed: `,e)})}));var su=``,cu=null,lu=``,uu=null;document.addEventListener(`keydown`,e=>{if(!(e.ctrlKey||e.altKey||e.metaKey))if(e.key===`Enter`){if(lu.length>=3){let t=lu;lu=``,clearTimeout(uu),document.dispatchEvent(new CustomEvent(`barcodeScanned`,{detail:t})),(document.activeElement?document.activeElement.tagName:``)!==`TEXTAREA`&&e.preventDefault();return}lu=``}else e.key&&e.key.length===1&&(lu+=e.key,clearTimeout(uu),uu=setTimeout(()=>{lu=``},50))});function du(){try{let e=JSON.parse(localStorage.getItem(`adminproSession`)||`null`);return e&&Date.now()<e.expiresAt?e:null}catch{return null}}function fu(e,t){Xe(t),localStorage.setItem(`adminproSession`,JSON.stringify({...e,token:t,expiresAt:Date.now()+480*60*1e3}))}function pu(){Xe(null),localStorage.removeItem(`adminproSession`),localStorage.removeItem(`adminpro_user`)}var mu=[{label:`Inicio`,items:[{id:`dashboard`,label:`Dashboard`,icon:`dashboard`,roles:[`Administrador`,`Vendedor`,`Técnico de reparación`]},{id:`assistant`,label:`Asistente IA`,icon:`forum`,roles:[`Administrador`,`Vendedor`,`Técnico de reparación`]}]},{label:`Operaciones`,items:[{id:`pos`,label:`Ventas (POS)`,icon:`point_of_sale`,roles:[`Administrador`,`Vendedor`]},{id:`sales-history`,label:`Historial de Ventas`,icon:`history`,roles:[`Administrador`,`Vendedor`]},{id:`credits`,label:`Créditos`,icon:`credit_score`,roles:[`Administrador`,`Vendedor`]},{id:`expenses`,label:`Egresos`,icon:`payments`,roles:[`Administrador`]},{id:`nominas`,label:`Nóminas`,icon:`request_quote`,roles:[`Administrador`]}]},{label:`Inventario`,items:[{id:`inventory`,label:`Catálogo General`,icon:`inventory_2`,roles:[`Administrador`,`Vendedor`,`Técnico de reparación`]},{id:`imei`,label:`Equipos IMEI`,icon:`phone_android`,roles:[`Administrador`,`Vendedor`]},{id:`kiosk`,label:`Modo Kiosco`,icon:`tv`,roles:[`Administrador`,`Vendedor`]},{id:`reventas`,label:`Reventas`,icon:`storefront`,roles:[`Administrador`,`Vendedor`]}]},{label:`Servicios`,items:[{id:`technical`,label:`Servicio Técnico`,icon:`build`,roles:[`Administrador`,`Técnico de reparación`]}]},{label:`Organización`,items:[{id:`tasks`,label:`Lista de Tareas`,icon:`check_circle`,roles:[`Administrador`,`Vendedor`,`Técnico de reparación`]},{id:`calendar`,label:`Actividad`,icon:`history_toggle_off`,roles:[`Administrador`,`Vendedor`,`Técnico de reparación`]}]},{label:`Personas`,items:[{id:`clients`,label:`Clientes`,icon:`people`,roles:[`Administrador`,`Vendedor`,`Técnico de reparación`]},{id:`users`,label:`Equipo / Usuarios`,icon:`manage_accounts`,roles:[`Administrador`]}]},{label:`Otros`,items:[{id:`settings`,label:`Ajustes`,icon:`settings`,roles:[`Administrador`,`Vendedor`,`Técnico de reparación`]}]}];function hu(e){let t=document.getElementById(`mobile-drawer`),n=document.getElementById(`mobile-drawer-backdrop`),r=document.getElementById(`mobile-drawer-content`);e?(t.classList.remove(`hidden`),setTimeout(()=>{n.classList.replace(`opacity-0`,`opacity-100`),r.classList.replace(`translate-y-full`,`translate-y-0`)},10)):(n.classList.replace(`opacity-100`,`opacity-0`),r.classList.replace(`translate-y-0`,`translate-y-full`),setTimeout(()=>t.classList.add(`hidden`),300))}function gu(e,t,n=!1){let r=document.getElementById(e);if(!r)return;let i=t||`Vendedor`,a=``;if(n){let e=[];e=i===`Técnico de reparación`?[{id:`dashboard`,label:`Home`,icon:`dashboard`},{id:`assistant`,label:`Asistente`,icon:`forum`},{id:`technical`,label:`Reparar`,icon:`build`},{id:`inventory`,label:`Stock`,icon:`inventory_2`}]:[{id:`dashboard`,label:`Home`,icon:`dashboard`},{id:`assistant`,label:`Asistente`,icon:`forum`},{id:`pos`,label:`Venta`,icon:`point_of_sale`},{id:`inventory`,label:`Stock`,icon:`inventory_2`}],a=e.map(e=>`
      <button data-nav="${e.id}" class="nav-btn flex flex-col items-center justify-center gap-0.5 py-2 w-full text-on-surface-variant hover:text-primary transition-colors">
        <span class="material-symbols-outlined text-[24px]">${e.icon}</span>
        <span class="text-[10px] font-bold tracking-tight">${e.label}</span>
      </button>
    `).join(``),a+=`
      <button id="mobile-more-btn" class="flex flex-col items-center justify-center gap-0.5 py-2 w-full text-on-surface-variant hover:text-primary transition-colors">
        <span class="material-symbols-outlined text-[24px]">apps</span>
        <span class="text-[10px] font-bold tracking-tight">Más</span>
      </button>
    `;let t=document.getElementById(`mobile-drawer-grid`);t&&(t.innerHTML=[{label:`Operaciones y Negocio`,colorClass:`bg-red-50/70 text-primary`,iconColor:`text-primary`,items:[{id:`dashboard`,label:`Dashboard`,icon:`dashboard`,roles:[`Administrador`,`Vendedor`,`Técnico de reparación`]},{id:`assistant`,label:`Asistente IA`,icon:`forum`,roles:[`Administrador`,`Vendedor`,`Técnico de reparación`]},{id:`pos`,label:`Ventas (POS)`,icon:`point_of_sale`,roles:[`Administrador`,`Vendedor`]},{id:`sales-history`,label:`Historial Ventas`,icon:`history`,roles:[`Administrador`,`Vendedor`]},{id:`credits`,label:`Créditos`,icon:`credit_score`,roles:[`Administrador`,`Vendedor`]},{id:`expenses`,label:`Egresos`,icon:`payments`,roles:[`Administrador`]},{id:`nominas`,label:`Nóminas`,icon:`request_quote`,roles:[`Administrador`]}]},{label:`Inventario y Soporte`,colorClass:`bg-blue-50/70 text-blue-600`,iconColor:`text-blue-600`,items:[{id:`inventory`,label:`Catálogo General`,icon:`inventory_2`,roles:[`Administrador`,`Vendedor`,`Técnico de reparación`]},{id:`imei`,label:`Equipos IMEI`,icon:`phone_android`,roles:[`Administrador`,`Vendedor`]},{id:`kiosk`,label:`Modo Kiosco`,icon:`tv`,roles:[`Administrador`,`Vendedor`]},{id:`reventas`,label:`Reventas`,icon:`storefront`,roles:[`Administrador`,`Vendedor`]},{id:`technical`,label:`Servicio Técnico`,icon:`build`,roles:[`Administrador`,`Técnico de reparación`]}]},{label:`Equipo y Configuración`,colorClass:`bg-purple-50/70 text-purple-600`,iconColor:`text-purple-600`,items:[{id:`tasks`,label:`Lista de Tareas`,icon:`check_circle`,roles:[`Administrador`,`Vendedor`,`Técnico de reparación`]},{id:`calendar`,label:`Actividad`,icon:`history_toggle_off`,roles:[`Administrador`,`Vendedor`,`Técnico de reparación`]},{id:`clients`,label:`Clientes`,icon:`people`,roles:[`Administrador`,`Vendedor`,`Técnico de reparación`]},{id:`users`,label:`Equipo / Usuarios`,icon:`manage_accounts`,roles:[`Administrador`]},{id:`settings`,label:`Ajustes`,icon:`settings`,roles:[`Administrador`,`Vendedor`,`Técnico de reparación`]}]}].map(e=>{let t=e.items.filter(e=>!e.roles||e.roles.includes(i));return t.length===0?``:`
          <div class="mt-4 first:mt-0">
            <h4 class="text-[10px] font-black uppercase tracking-[0.2em] px-1 flex items-center gap-1.5 opacity-80 mb-2.5 ${e.iconColor}">
              <span class="w-1.5 h-1.5 rounded-full shrink-0 bg-current opacity-50"></span>
              ${e.label}
            </h4>
            <div class="grid grid-cols-3 gap-2.5">
              ${t.map(t=>`
                <button data-nav="${t.id}"
                  class="bg-white rounded-2xl p-2.5 flex flex-col items-center gap-2
                         active:scale-95 transition-all duration-150 shadow-sm
                         border border-slate-100 hover:border-primary/20 hover:shadow-md group">
                  <div class="w-[50px] h-[50px] rounded-2xl ${e.colorClass} flex items-center justify-center
                              group-active:scale-90 transition-transform">
                    <span class="material-symbols-outlined text-[24px]"
                          style="font-variation-settings:'FILL' 1">${t.icon}</span>
                  </div>
                  <span class="text-[9px] font-extrabold text-slate-700 text-center leading-tight line-clamp-1 w-full">${t.label}</span>
                </button>
              `).join(``)}
            </div>
          </div>
        `}).join(``))}else mu.forEach(e=>{let t=e.items.filter(e=>!e.roles||e.roles.includes(i));t.length!==0&&(a+=`<p class="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 mt-6 mb-2 px-4 italic">${e.label}</p>`,t.forEach(e=>{a+=`
          <button data-nav="${e.id}" class="nav-btn flex items-center gap-3 px-4 py-2.5 rounded-xl w-full text-left text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all duration-150 text-sm font-medium mb-0.5 group">
            <span class="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">${e.icon}</span>
            <span>${e.label}</span>
          </button>
        `}))});r.innerHTML=a,n&&(document.getElementById(`mobile-more-btn`)?.addEventListener(`click`,()=>hu(!0)),document.getElementById(`mobile-drawer-close`)?.addEventListener(`click`,()=>hu(!1)),document.getElementById(`mobile-drawer-backdrop`)?.addEventListener(`click`,()=>hu(!1)),document.querySelectorAll(`#mobile-drawer-grid [data-nav]`).forEach(e=>{e.addEventListener(`click`,()=>{hu(!1),f(e.dataset.nav)})})),r.querySelectorAll(`[data-nav]`).forEach(e=>{e.addEventListener(`click`,()=>f(e.dataset.nav))})}function _u(e){document.querySelectorAll(`#desktop-nav [data-nav]`).forEach(t=>{let n=t.dataset.nav===e;t.classList.toggle(`bg-primary`,n),t.classList.toggle(`text-white`,n),t.classList.toggle(`shadow-lg`,n),t.classList.toggle(`text-slate-400`,!n)}),document.querySelectorAll(`#mobile-nav [data-nav]`).forEach(t=>{let n=t.dataset.nav===e;t.classList.toggle(`text-primary`,n),t.classList.toggle(`text-on-surface-variant`,!n)});let t=`FoneBase`;mu.forEach(n=>{let r=n.items.find(t=>t.id===e);r&&(t=r.label)});let n=document.getElementById(`header-title`);n&&(n.textContent=t);let r=document.getElementById(`app-header`),i=document.getElementById(`main-content`);if(e===`assistant`)r?.classList.add(`hidden`),document.body.style.overflow=`hidden`,window.scrollTo(0,0),i&&(i.className=`assistant-main-content`);else{document.body.style.overflow=``;let e=du();e&&String(e.rol||``).trim().toLowerCase()===`kiosco`?(r?.classList.add(`hidden`),i&&(i.className=`min-h-screen w-full`)):(r?.classList.remove(`hidden`),i&&(i.className=`pt-14 md:ml-[260px] pb-40 md:pb-8 min-h-screen`))}}function vu(){let e=document.getElementById(`app-offline-badge`);e&&(navigator.onLine?e.classList.add(`hidden`):e.classList.remove(`hidden`))}window.addEventListener(`online`,()=>{vu(),rt()}),window.addEventListener(`offline`,()=>{vu()}),setInterval(rt,15e3);function yu(e,t){document.getElementById(`login-screen`).classList.add(`hidden`),document.getElementById(`app-shell`).classList.remove(`hidden`);let n=document.getElementById(`user-name`);n&&(n.textContent=e||`Usuario`);let r=document.getElementById(`mobile-user-name`),i=document.getElementById(`mobile-user-role`);r&&(r.textContent=e||`Usuario`),i&&(i.textContent=t||`Rol`),gu(`desktop-nav`,t,!1),gu(`mobile-nav`,t,!0),Du(),Ou(),vu(),rt();let a=t||`Vendedor`,o=String(a).trim().toLowerCase()===`kiosco`,s=document.getElementById(`desktop-sidebar`),c=document.getElementById(`app-header`),p=document.getElementById(`app-mobile-nav`),m=document.getElementById(`main-content`);o?(s?.classList.add(`hidden`),s?.classList.remove(`md:flex`),c?.classList.add(`hidden`),p?.classList.add(`hidden`),p?.classList.remove(`flex`),m&&(m.className=`min-h-screen w-full`)):(s?.classList.add(`hidden`),s?.classList.add(`md:flex`),c?.classList.remove(`hidden`),p?.classList.remove(`hidden`),p?.classList.add(`flex`),m&&(m.className=`pt-14 md:ml-[260px] pb-40 md:pb-8 min-h-screen`)),d(e=>{try{We()}catch(e){console.warn(`[Router] No se pudo cerrar el escáner al cambiar de ruta:`,e)}if(o)return e===`kiosk`?void 0:`kiosk`;let t=!1,n=!1;if(mu.forEach(r=>{let i=r.items.find(t=>t.id===e);i&&(n=!0,(!i.roles||i.roles.includes(a))&&(t=!0))}),n&&!t)return A(`No tienes permiso para acceder a este módulo`,`warning`),`dashboard`}),document.querySelectorAll(`[data-goto]`).forEach(e=>{let t=e.dataset.goto,n=!1;mu.forEach(e=>{let r=e.items.find(e=>e.id===t);r&&(!r.roles||r.roles.includes(a))&&(n=!0)}),n?e.classList.remove(`hidden`):e.classList.add(`hidden`)}),u(_u),l(`inventory`,Rn()),l(`dashboard`,Hn()),l(`assistant`,jr()),l(`pos`,la()),l(`imei`,jo()),l(`clients`,cs()),l(`credits`,vs()),l(`sales-history`,As()),l(`tasks`,Ls()),l(`calendar`,nc()),l(`users`,uc()),l(`reventas`,Fc()),l(`technical`,Jc()),l(`expenses`,bl()),l(`nominas`,Ml()),l(`settings`,ql()),l(`kiosk`,()=>ru()),f(window.location.hash.replace(`#`,``)||`dashboard`)}function bu(e){let t=document.getElementById(`step-credentials`),n=document.getElementById(`step-pin`);t&&t.classList.toggle(`hidden`,e!==`credentials`),n&&n.classList.toggle(`hidden`,e!==`pin`)}function xu(){document.getElementById(`app-shell`).classList.add(`hidden`),document.getElementById(`login-screen`).classList.remove(`hidden`),bu(`credentials`),Su(),cu||un().then(e=>{cu=e}).catch(e=>console.error(`Error al pre-cargar ajustes:`,e))}function Su(){let e=document.getElementById(`login-user-avatar`),t=document.getElementById(`login-user-name`);e&&(e.innerHTML=`<span class="material-symbols-outlined text-red-400 text-3xl" style="font-variation-settings:'FILL' 1">shield_lock</span>`,e.className=`w-16 h-16 rounded-full bg-red-600/10 border border-red-600/30 flex items-center justify-center font-black text-xl text-red-500 select-none uppercase tracking-wider shadow-inner transition-all duration-300`,e.style.backgroundColor=``,e.style.padding=``),t&&(t.textContent=``)}async function Cu(){await j(`Confirmación`,`¿Estás seguro de que deseas cerrar sesión?`)&&(await Qe(),pu(),xu())}window.addEventListener(`session-expired`,()=>{pu(),xu()}),document.getElementById(`login-form`)?.addEventListener(`submit`,wu),document.getElementById(`pin-form`)?.addEventListener(`submit`,Tu),document.getElementById(`back-to-login`)?.addEventListener(`click`,()=>{bu(`credentials`),Su()}),document.getElementById(`logout-btn`)?.addEventListener(`click`,Cu),document.getElementById(`mobile-logout-btn`)?.addEventListener(`click`,Cu);async function wu(e){e.preventDefault();let t=document.getElementById(`login-btn`),n=document.getElementById(`login-email`).value.trim(),r=document.getElementById(`login-pwd`).value.trim();t.disabled=!0,t.textContent=`Verificando...`;try{let e=await yt(n,r);if(e.success){su=n;let t=document.getElementById(`totp-setup-container`),r=document.getElementById(`pin-hint`);if(e.step===`setup-totp`){t&&t.classList.remove(`hidden`);let n=document.getElementById(`totp-qr`),i=document.getElementById(`totp-secret-text`);n&&(n.src=e.qrCodeUrl),i&&(i.textContent=e.secret),r&&(r.textContent=`Escanea el código QR en tu app autenticadora e ingresa el código de 6 dígitos.`)}else t&&t.classList.add(`hidden`),r&&(r.textContent=`Ingresa el código de 6 dígitos de tu aplicación autenticadora.`);let i=document.getElementById(`login-user-avatar`),a=document.getElementById(`login-user-name`);i&&(i.textContent=(e.nombre?e.nombre.charAt(0):`U`).toUpperCase(),i.className=`w-16 h-16 rounded-full bg-indigo-600/10 border border-indigo-600/30 flex items-center justify-center font-black text-xl text-indigo-500 select-none uppercase tracking-wider shadow-inner transition-all duration-300`),a&&(a.textContent=e.nombre||``),bu(`pin`);let o=document.getElementById(`login-pin`);o&&(o.value=``,o.focus())}else A(e.mensaje||`Credenciales incorrectas`,`error`)}catch(e){A(`Error de conexión: `+e.message,`error`)}finally{t.disabled=!1,t.textContent=`Ingresar`}}async function Tu(e){e.preventDefault();let t=document.getElementById(`pin-btn`),n=document.getElementById(`login-pin`).value.trim();t.disabled=!0,t.textContent=`Verificando...`;try{let e=await bt(su,n);e.success&&e.token?(fu({email:e.email,nombre:e.nombre,rol:e.rol},e.token),yu(e.nombre,e.rol)):A(e.mensaje||`Código de verificación incorrecto`,`error`)}catch(e){A(`Error de conexión: `+e.message,`error`)}finally{t.disabled=!1,t.textContent=`Verificar`}}var Eu=du();Eu&&Eu.token&&Ze()?(Xe(Eu.token),yu(Eu.nombre,Eu.rol)):(pu(),xu());async function Du(){let e=document.getElementById(`header-notification-btn`),t=document.getElementById(`notifications-dropdown`);!e||!t||(e.addEventListener(`click`,e=>{e.stopPropagation(),t.classList.toggle(`hidden`),Au()}),document.addEventListener(`click`,()=>{t.classList.add(`hidden`)}),t.addEventListener(`click`,e=>{e.stopPropagation()}),ku(),setInterval(ku,6e4))}async function Ou(){let e=document.getElementById(`header-local-switcher-container`),t=document.getElementById(`header-local-switcher`);if(!(!e||!t))try{let n=await fn();n.length===0&&n.push({id:1,nombre:`MI NEGOCIO`});let r=localStorage.getItem(`fonebase_active_local_id`)||`1`;t.value=r;let i=e.querySelector(`.custom-select-options`);i&&(i.innerHTML=n.map(e=>`
        <div data-value="${e.id}" class="custom-option px-3 py-2 text-xs font-bold text-on-surface hover:bg-surface-variant/20 flex items-center gap-2 cursor-pointer transition-colors">
          <span class="material-symbols-outlined text-[16px] text-slate-400">storefront</span>
          <span class="flex-1 truncate">${e.nombre.toUpperCase()}</span>
          <span class="material-symbols-outlined text-[16px] text-primary check-icon ${String(e.id)===String(r)?``:`hidden`}">check_circle</span>
        </div>
      `).join(``)),setupCustomSelect(`header-local-switcher-container`,`header-local-switcher`),syncCustomSelectUI(`header-local-switcher-container`,r),t.addEventListener(`change`,e=>{let t=e.target.value;t!==localStorage.getItem(`fonebase_active_local_id`)&&(localStorage.setItem(`fonebase_active_local_id`,t),A(`Cambiando de establecimiento...`,`info`),setTimeout(()=>{location.reload()},1e3))})}catch(e){console.error(`Error al inicializar el selector de local:`,e)}}async function ku(){try{let e=await Qt(),t=[];e.productosBajoStock&&e.productosBajoStock.length>0&&e.productosBajoStock.forEach(e=>{t.push({type:`stock`,icon:`warning`,color:`text-red-600 bg-red-50 border-red-100`,title:`Stock bajo: ${e.nombre}`,desc:`Quedan ${e.stockActual} unidades (Mínimo: ${e.stock_minimo||1})`})}),(await Vt()).filter(e=>e.estado===`En Mora`).forEach(e=>{t.push({type:`credit`,icon:`credit_card`,color:`text-amber-600 bg-amber-50 border-amber-100`,title:`Crédito vencido: ${e.cliente}`,desc:`Saldo pendiente: $${new Intl.NumberFormat(`es-CO`).format(e.saldo)}`})}),(await on()).filter(e=>e.estado!==`Completada`&&new Date(e.fecha_vencimiento)<=new Date).forEach(e=>{t.push({type:`task`,icon:`check_circle`,color:`text-blue-600 bg-blue-50 border-blue-100`,title:`Tarea pendiente: ${e.tarea}`,desc:`Vence el ${new Date(e.fecha_vencimiento).toLocaleDateString()}`})}),window._activeAlerts=t;let n=document.getElementById(`header-notification-badge`),r=document.getElementById(`notifications-count-badge`);t.length>0?(n?.classList.remove(`hidden`),r&&(r.textContent=t.length)):(n?.classList.add(`hidden`),r&&(r.textContent=`0`))}catch(e){console.error(`Error loading alerts`,e)}}function Au(){let e=document.getElementById(`notifications-list`);if(!e)return;let t=window._activeAlerts||[];if(t.length===0){e.innerHTML=`
      <div class="p-6 text-center text-xs text-slate-400 italic flex flex-col items-center gap-2">
        <span class="material-symbols-outlined text-2xl opacity-40">notifications_active</span>
        Sin notificaciones pendientes
      </div>
    `;return}e.innerHTML=t.map(e=>`
    <div class="p-3.5 flex gap-3 hover:bg-slate-50 transition-colors">
      <div class="w-8 h-8 rounded-xl flex items-center justify-center border shrink-0 ${e.color}">
        <span class="material-symbols-outlined text-[18px]">${e.icon}</span>
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-xs font-black text-slate-800 leading-snug truncate">${e.title}</p>
        <p class="text-[10px] text-slate-500 font-medium leading-normal mt-0.5">${e.desc}</p>
      </div>
    </div>
  `).join(``)}window.setupCustomSelect=function(e,t,n){let r=document.getElementById(e);if(!r)return;let i=r.querySelector(`.custom-select-trigger`),a=r.querySelector(`.custom-select-options`),o=document.getElementById(t),s=r.querySelectorAll(`.custom-option`);!i||!a||(i.onclick=e=>{e.stopPropagation(),document.querySelectorAll(`.custom-select-options`).forEach(e=>{e!==a&&e.classList.add(`hidden`)}),a.classList.toggle(`hidden`)},s.forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.value,r=e.querySelector(`.material-symbols-outlined`),c=r?r.textContent:``,l=e.querySelector(`.flex-1`),u=l?l.textContent:``,d=i.querySelector(`.selected-label`);d&&(d.textContent=u);let f=i.querySelector(`.material-symbols-outlined`);f&&c&&(f.textContent=c),s.forEach(t=>{let n=t.querySelector(`.check-icon`);n&&(t===e?n.classList.remove(`hidden`):n.classList.add(`hidden`))}),o&&(o.value=t,o.dispatchEvent(new Event(`change`,{bubbles:!0}))),n&&n(t),a.classList.add(`hidden`)})}))},window.syncCustomSelectUI=function(e,t){let n=document.getElementById(e);if(!n)return;let r=n.querySelector(`.custom-select-trigger`),i=n.querySelectorAll(`.custom-option`);if(!r||!i.length)return;let a=Array.from(i).find(e=>e.dataset.value===t);if(a){let e=a.querySelector(`.material-symbols-outlined`),t=e?e.textContent:``,n=a.querySelector(`.flex-1`),o=n?n.textContent:``,s=r.querySelector(`.selected-label`);s&&(s.textContent=o);let c=r.querySelector(`.material-symbols-outlined`);c&&t&&(c.textContent=t),i.forEach(e=>{let t=e.querySelector(`.check-icon`);t&&(e===a?t.classList.remove(`hidden`):t.classList.add(`hidden`))})}},window.buildCustomSelectOptions=function(e,t,n,r=`Seleccione...`,i){let a=document.getElementById(e);if(!a)return;let o=a.querySelector(`.custom-select-trigger`),s=a.querySelector(`.custom-select-options`),c=document.getElementById(t);if(!o||!s)return;s.innerHTML=``;let l=o.querySelector(`.selected-label`);l&&(l.textContent=r);let u=o.querySelector(`.material-symbols-outlined`);o.onclick=e=>{e.stopPropagation(),document.querySelectorAll(`.custom-select-options`).forEach(e=>{e!==s&&e.classList.add(`hidden`)}),s.classList.toggle(`hidden`)},n.forEach(e=>{let t=document.createElement(`div`);t.className=`custom-option px-4 py-3 text-sm font-semibold text-on-surface hover:bg-surface-variant/20 flex items-center gap-3 cursor-pointer transition-colors`,t.dataset.value=e.value;let n=document.createElement(`span`);n.className=`material-symbols-outlined text-[18px] text-slate-400`,n.textContent=e.icon||`person`,t.appendChild(n);let r=document.createElement(`span`);r.className=`flex-1`,r.textContent=e.label,t.appendChild(r);let i=document.createElement(`span`);i.className=`material-symbols-outlined text-[16px] text-primary check-icon hidden`,i.textContent=`check_circle`,t.appendChild(i),s.appendChild(t)});let d=s.querySelectorAll(`.custom-option`);d.forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.value,n=e.querySelector(`.material-symbols-outlined`),r=n?n.textContent:``,a=e.querySelector(`.flex-1`),o=a?a.textContent:``;l&&(l.textContent=o),u&&r&&(u.textContent=r),d.forEach(t=>{let n=t.querySelector(`.check-icon`);n&&(t===e?n.classList.remove(`hidden`):n.classList.add(`hidden`))}),c&&(c.value=t,c.dispatchEvent(new Event(`change`,{bubbles:!0}))),i&&i(t),s.classList.add(`hidden`)})})},document.addEventListener(`click`,()=>{document.querySelectorAll(`.custom-select-options`).forEach(e=>{e.classList.add(`hidden`)})});
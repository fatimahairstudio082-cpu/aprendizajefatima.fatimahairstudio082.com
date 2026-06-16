/**
 * ═══════════════════════════════════════════════════════════════
 *  M4 MOTOR BRIDGE · Fátima Caldera Studio
 *  ────────────────────────────────────────────────────────────────
 *  Puente para modulo4_carpeta.html (optimizador + Firebase upload).
 *
 *  HACE:
 *  1. Detecta items entrantes con claseId y los marca visualmente
 *     en cada tarjeta del grid (badge "🎯 bio_p01")
 *  2. Cuando subes a Firebase un item con claseId:
 *     · Usa la ruta exacta `academia/{slug}/{claseId}/imagen.jpg`
 *     · TAMBIÉN escribe en Firestore `clases_imgs/{claseId}` con la URL
 *  3. Items sin claseId → flujo libre de siempre (no cambia)
 *
 *  CÓMO USAR:
 *    Al final de modulo4_carpeta.html, antes de </body>:
 *      <script src="motor_p1_bioseg_balayage.js"></script>
 *      <script src="motor_p2_queratina_elevaciones.js"></script>
 *      <script src="motor_p3_morfologia_alertas.js"></script>
 *      <script src="motor_helper.js"></script>
 *      <script src="m4_motor_bridge.js"></script>
 *
 *  REQUIERE Firebase ya inicializado en M4 con:
 *    - firebase.initializeApp(CFG)
 *    - El objeto global firebase o equivalente
 *    Si M4 usa la SDK modular, este bridge se inicializa solo.
 * ═══════════════════════════════════════════════════════════════
 */
(function(){
  'use strict';
  if(window._M4_BRIDGE_LOADED) return;
  window._M4_BRIDGE_LOADED = true;

  console.log('%c[M4 BRIDGE] cargando…', 'color:#00bcd4;font-weight:700');

  /* ──────── Estado del bridge ──────── */
  const STATE = {
    fbReady: false,
    fbApi: null,        // { setDoc, doc, storage, ref, uploadBytes, getDownloadURL, deleteObject, db }
    badgesInjected: false,
    enrichInterval: null
  };

  /* ──────── CSS para badges en tarjetas ──────── */
  injectStyles();

  function injectStyles(){
    if(document.getElementById('m4-bridge-style')) return;
    const css = `
      .file-card .m4-class-badge{
        position:absolute;bottom:6px;left:6px;right:6px;
        background:linear-gradient(90deg,rgba(0,188,212,.95),rgba(0,150,170,.95));
        color:#000;font-family:'JetBrains Mono',monospace;font-size:8px;font-weight:700;
        padding:4px 6px;border-radius:4px;
        display:flex;align-items:center;gap:4px;line-height:1.3;
        box-shadow:0 2px 6px rgba(0,0,0,.4);
        text-shadow:0 1px 0 rgba(255,255,255,.1);
        z-index:5;
      }
      .file-card .m4-class-badge .b-id{background:rgba(0,0,0,.25);padding:1px 5px;border-radius:3px;letter-spacing:.5px;}
      .file-card .m4-class-badge .b-niv{font-size:7px;padding:1px 4px;border-radius:10px;background:rgba(0,0,0,.25);}
      .file-card .m4-class-path{
        position:absolute;bottom:0;left:0;right:0;
        background:rgba(0,0,0,.85);color:#00bcd4;
        font-family:monospace;font-size:7px;
        padding:3px 6px;text-align:center;
        opacity:0;transition:opacity .2s;
        white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
        z-index:6;
      }
      .file-card:hover .m4-class-path{opacity:1;}
      .file-card.m4-class-linked{outline:2px solid rgba(0,188,212,.6);outline-offset:-2px;}

      #m4-bridge-banner{
        background:linear-gradient(90deg,rgba(0,188,212,.12),rgba(0,188,212,.02));
        border-bottom:1px solid rgba(0,188,212,.3);
        padding:8px 16px;display:flex;align-items:center;gap:12px;flex-wrap:wrap;
        font-family:'JetBrains Mono',monospace;font-size:10px;color:#00bcd4;
      }
      #m4-bridge-banner b{color:#fff;}
      #m4-bridge-banner .stat-mini{
        background:rgba(0,0,0,.3);padding:3px 9px;border-radius:20px;
        border:1px solid rgba(0,188,212,.25);
      }
      #m4-bridge-banner .stat-mini.ok{border-color:rgba(34,197,94,.3);color:#22c55e;}
      #m4-bridge-banner .stat-mini.warn{border-color:rgba(249,115,22,.3);color:#F97316;}

      #m4-bridge-toast{
        position:fixed;bottom:20px;left:20px;z-index:1000;
        background:linear-gradient(135deg,rgba(0,188,212,.95),rgba(0,150,170,.95));
        color:#000;padding:12px 18px;border-radius:8px;
        font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;
        box-shadow:0 8px 28px rgba(0,0,0,.5);
        max-width:380px;line-height:1.5;
        transition:opacity .3s,transform .3s;
      }
      #m4-bridge-toast.err{background:linear-gradient(135deg,rgba(231,76,60,.95),rgba(180,40,30,.95));color:#fff;}
    `;
    const s = document.createElement('style');
    s.id = 'm4-bridge-style';
    s.textContent = css;
    document.head.appendChild(s);
  }

  /* ──────── ESPERAR Firebase de M4 ──────── */
  // M4 usa la versión modular de Firebase (importada desde gstatic).
  // Nuestro bridge necesita exponer Firestore + Storage. Inicializamos
  // nuestra propia mini-app para no depender del scope interno de M4.
  initFirebase();

  async function initFirebase(){
    // Si M4 ya expuso _FB o _ADM (compatibilidad), úsalo
    if(window._FB && window._FB.db && window._FB.storage){
      STATE.fbApi = window._FB;
      STATE.fbReady = true;
      console.log('[M4 BRIDGE] reutilizando window._FB de M4');
      return;
    }
    if(window._ADM && window._ADM.db && window._ADM.storage){
      STATE.fbApi = {
        db: window._ADM.db,
        storage: window._ADM.storage,
        setDoc: window._ADM.setDoc,
        doc: window._ADM.doc,
        sRef: window._ADM.storageRef,
        uploadBytes: window._ADM.uploadBytes,
        getDownloadURL: window._ADM.getDownloadURL,
        deleteObject: window._ADM.deleteObject
      };
      STATE.fbReady = true;
      console.log('[M4 BRIDGE] reutilizando window._ADM');
      return;
    }
    // Cargamos nuestra propia instancia de Firebase
    try{
      const [{ initializeApp }, fst, fs] = await Promise.all([
        import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js'),
        import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js'),
        import('https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js')
      ]);
      const CFG = {
        apiKey:"AIzaSyCcvwC7NYFgXl74YTF8ouzu32SFwB559dw",
        authDomain:"aprendisajefatima.firebaseapp.com",
        projectId:"aprendisajefatima",
        storageBucket:"aprendisajefatima.firebasestorage.app",
        messagingSenderId:"744176967394",
        appId:"1:744176967394:web:743b7c2a455e1e6ba7c8bb"
      };
      let app;
      try{ app = initializeApp(CFG, 'm4-bridge'); }
      catch(e){ app = initializeApp(CFG); }
      STATE.fbApi = {
        db: fst.getFirestore(app),
        storage: fs.getStorage(app),
        setDoc: fst.setDoc,
        doc: fst.doc,
        sRef: fs.ref,
        uploadBytes: fs.uploadBytes,
        getDownloadURL: fs.getDownloadURL,
        deleteObject: fs.deleteObject
      };
      STATE.fbReady = true;
      console.log('[M4 BRIDGE] Firebase inicializado de forma autónoma');
    }catch(e){
      console.error('[M4 BRIDGE] no se pudo inicializar Firebase:', e);
    }
  }

  /* ──────── BANNER + ESTADÍSTICAS ──────── */
  function injectBanner(){
    if(document.getElementById('m4-bridge-banner')) return;
    const bar = document.createElement('div');
    bar.id = 'm4-bridge-banner';
    bar.innerHTML = `
      <span>🎯 <b>Motor Bridge activo</b></span>
      <span class="stat-mini" id="m4b-total">0 archivos</span>
      <span class="stat-mini ok" id="m4b-linked">0 vinculados a clases</span>
      <span class="stat-mini warn" id="m4b-free">0 libres</span>
      <span style="margin-left:auto;font-size:9px;opacity:.7;">los archivos con 🎯 suben a la ruta exacta + escriben en Firestore</span>
    `;
    // Insertar después del header o stats
    const stats = document.querySelector('.stats');
    if(stats && stats.parentNode){
      stats.parentNode.insertBefore(bar, stats.nextSibling);
    } else if(document.body.firstChild){
      document.body.insertBefore(bar, document.body.firstChild);
    } else {
      document.body.appendChild(bar);
    }
  }

  function updateBanner(){
    const C = window.C || {}; // C es el estado global de M4
    const files = Array.isArray(C.files) ? C.files : [];
    const total = files.length;
    const linked = files.filter(f => f.claseId).length;
    const free = total - linked;
    const t = document.getElementById('m4b-total'); if(t) t.textContent = total + ' archivos';
    const l = document.getElementById('m4b-linked'); if(l) l.textContent = linked + ' vinculados a clases';
    const f = document.getElementById('m4b-free'); if(f) f.textContent = free + ' libres';
  }

  /* ──────── ENRIQUECER ITEMS DE LA COLA EN MEMORIA ──────── */
  // M4 parsea la cola al cargar y guarda los items en C.files.
  // Pero pierde el metadato claseId al hacer addFiles. Lo restauramos
  // recorriendo la cola raw cuando detectamos items nuevos.
  function enrichFilesWithMetadata(){
    try{
      const C = window.C;
      if(!C || !Array.isArray(C.files)) return;
      // 1. Si la cola tiene items con claseId que no entraron a addFiles,
      //    los completamos por matching de nombre.
      let queueRaw;
      try{ queueRaw = JSON.parse(localStorage.getItem('fc_carpeta_queue_lastread') || '[]'); }catch(e){ queueRaw = []; }

      // Guardar respaldo cuando M4 lea la cola por primera vez
      if(!localStorage.getItem('fc_carpeta_queue_lastread')){
        try{ localStorage.setItem('fc_carpeta_queue_lastread', localStorage.getItem('fc_carpeta_queue')||'[]'); }catch(e){}
      }

      // Para cada item en C.files, si su nombre coincide con uno de la cola raw, copiar metadata
      C.files.forEach(f => {
        if(f.claseId) return; // ya tiene
        const match = queueRaw.find(q => q && q.label && f.name && q.label === f.name);
        if(match && match.claseId){
          f.claseId   = match.claseId;
          f.cat       = match.cat;
          f.slug      = match.slug;
          f.niv       = match.niv;
          f.titulo    = match.titulo;
          f.targetPath = match.targetPath;
        }
      });

      updateBanner();
      injectBadgesIntoGrid();
    }catch(e){
      console.warn('[M4 BRIDGE] enrichFiles error:', e);
    }
  }

  /* ──────── BADGES EN TARJETAS ──────── */
  function injectBadgesIntoGrid(){
    const C = window.C;
    if(!C || !Array.isArray(C.files)) return;
    document.querySelectorAll('.file-card').forEach(card => {
      const id = card.dataset.id || card.getAttribute('data-id');
      let item = null;
      if(id){
        item = C.files.find(f => f.id === id);
      }
      if(!item){
        // intentar por nombre
        const nameEl = card.querySelector('.file-name, .name, [data-name]');
        const name = nameEl ? nameEl.textContent.trim() : '';
        if(name) item = C.files.find(f => f.name === name);
      }
      // Si ya tiene badge y todavía aplica → skip
      const existing = card.querySelector('.m4-class-badge');
      if(item && item.claseId){
        card.classList.add('m4-class-linked');
        if(existing){
          // actualizar contenido
          existing.innerHTML = badgeHTML(item);
        } else {
          const b = document.createElement('div');
          b.className = 'm4-class-badge';
          b.innerHTML = badgeHTML(item);
          card.appendChild(b);
          const p = document.createElement('div');
          p.className = 'm4-class-path';
          p.textContent = '📁 ' + (item.targetPath || '—');
          card.appendChild(p);
        }
      } else {
        card.classList.remove('m4-class-linked');
        if(existing) existing.remove();
        const p = card.querySelector('.m4-class-path');
        if(p) p.remove();
      }
    });
  }

  function badgeHTML(item){
    const niv = (item.niv||'p').toUpperCase();
    return `🎯 <span class="b-id">${item.claseId}</span><span class="b-niv">${niv}</span><span style="font-weight:400;opacity:.7;font-size:7.5px;">${truncate(item.titulo||'',26)}</span>`;
  }
  function truncate(s, n){ return (s||'').length > n ? (s.slice(0,n-1)+'…') : s; }

  /* ──────── INTERCEPTOR DEL UPLOAD A FIREBASE ──────── */
  // M4 ya tiene su función subirFirebase(). Le hacemos wrapping
  // para detectar items con claseId y desviarlos a nuestra subida
  // con metadata + escritura en Firestore.
  function wrapUpload(){
    if(typeof window.subirFirebase !== 'function'){
      return setTimeout(wrapUpload, 400);
    }
    if(window.subirFirebase._m4_wrapped) return;
    const _orig = window.subirFirebase.bind(window);

    window.subirFirebase = async function(){
      const C = window.C || {};
      const sel = (C.files || []).filter(f => C.selected && C.selected.has(f.id) && f.estado === 'optimizado');

      // Separar en 2 grupos: con claseId vs sin claseId
      const linked = sel.filter(f => f.claseId);
      const free = sel.filter(f => !f.claseId);

      if(linked.length === 0){
        // todos libres → comportamiento original
        return _orig.apply(this, arguments);
      }

      // Si hay vinculados → manejar nosotros
      flashBridgeToast(`☁️ Subiendo ${linked.length} archivo(s) vinculado(s) a clases…`);
      await ensureFirebaseReady();
      if(!STATE.fbReady){
        flashBridgeToast('❌ Firebase no inicializado · revisa CFG', 'err');
        return;
      }

      let ok = 0, fail = 0;
      for(const f of linked){
        try{
          await uploadLinkedItem(f);
          f.estado = 'subido';
          ok++;
        }catch(e){
          console.error('[M4 BRIDGE] upload fail', f.name, e);
          fail++;
        }
      }
      flashBridgeToast(`✅ ${ok} subido(s) · ${fail} fallido(s) · rutas escritas en Firestore clases_imgs/`);
      if(typeof window.renderGrid === 'function') window.renderGrid();
      if(typeof window.updateStats === 'function') window.updateStats();
      updateBanner();

      // Subir también los archivos libres (si los hay) con el flujo original
      if(free.length){
        flashBridgeToast(`☁️ Ahora subiendo ${free.length} archivo(s) libre(s) (flujo original)…`);
        return _orig.apply(this, arguments);
      }
    };
    window.subirFirebase._m4_wrapped = true;
    console.log('[M4 BRIDGE] ✅ subirFirebase() envuelto');
  }

  async function ensureFirebaseReady(){
    if(STATE.fbReady) return;
    let tries = 0;
    while(!STATE.fbReady && tries < 30){
      await new Promise(r=>setTimeout(r, 200));
      tries++;
    }
  }

  /* ──────── SUBIDA INDIVIDUAL DE UN ITEM VINCULADO ──────── */
  async function uploadLinkedItem(f){
    const api = STATE.fbApi;
    if(!api) throw new Error('Firebase API no disponible');

    // Determinar blob a subir
    const blob = f.blob || f.file;
    if(!blob) throw new Error('archivo sin blob: ' + f.name);

    // Ruta exacta del target
    const itemKind = f.type === 'img' ? 'img' : f.type === 'vid' ? 'vid' : f.type === 'aud' ? 'aud' : 'pdf';
    let path = f.targetPath;
    if(!path && typeof window.MOTOR_PATH === 'function'){
      path = window.MOTOR_PATH(f.claseId, itemKind);
    }
    if(!path){
      // último recurso: carpeta según categoría
      const fname = itemKind==='img'?'imagen.jpg':itemKind==='vid'?'video.mp4':itemKind==='aud'?'audio.mp3':'guion.pdf';
      const carpeta = (f.cat==='fitness') ? 'fitness' : 'academia';
      path = `${carpeta}/${f.slug||f.claseId}/${f.claseId}/${fname}`;
    }

    // Subir a Storage
    const ref = api.sRef(api.storage, path);
    await api.uploadBytes(ref, blob);
    const url = await api.getDownloadURL(ref);

    // ── Escribir en Firestore · enrutado por categoría ──
    if(f.cat === 'fitness'){
      // FITNESS → colecciones que lee el Bloque 5 (fitness_imgs / fitness_videos)
      let coleccion, patch = { claseId:f.claseId, cat:'fitness' };
      if(itemKind === 'vid'){
        coleccion = 'fitness_videos';
        patch.url_video = url; patch.path_video = path; patch.videoActualizadoEn = new Date().toISOString();
        if(f.titulo) patch.titulo = f.titulo;
      } else if(itemKind === 'aud'){
        coleccion = 'fitness_videos';   // audio acompaña al video de la clase
        patch.url_audio = url; patch.path_audio = path; patch.audioActualizadoEn = new Date().toISOString();
      } else {
        coleccion = 'fitness_imgs';      // img / pdf
        patch.url = url; patch.url_path = path; patch.imgActualizadoEn = new Date().toISOString();
      }
      await api.setDoc(api.doc(api.db, coleccion, f.claseId), patch, { merge: true });
      console.log(`%c[M4 BRIDGE] ✅ FITNESS ${f.claseId} · ${itemKind} → ${coleccion}`, 'color:#22c55e');
      return;
    }

    // PELUQUERÍA / ACADEMIA → clases_imgs (campo según tipo)
    const fieldMap = {
      img: { field:'url_jpg',   pathF:'url_jpg_path', dateF:'imgActualizadoEn' },
      vid: { field:'url_video', pathF:'path_video',   dateF:'videoActualizadoEn' },
      aud: { field:'url_audio', pathF:'path_audio',   dateF:'audioActualizadoEn' },
      pdf: { field:'url_pdf',   pathF:'path_pdf',     dateF:'pdfActualizadoEn' }
    };
    const fm = fieldMap[itemKind] || fieldMap.img;
    const patch = {
      [fm.field]: url,
      [fm.pathF]: path,
      [fm.dateF]: new Date().toISOString()
    };
    // Alias `url` para compatibilidad con el motor original
    if(itemKind === 'img') patch.url = url;
    // Metadata de clase
    patch.claseId = f.claseId;
    patch.cat     = f.cat;
    patch.niv     = f.niv;

    await api.setDoc(api.doc(api.db, 'clases_imgs', f.claseId), patch, { merge: true });

    console.log(`%c[M4 BRIDGE] ✅ ${f.claseId} · ${itemKind} → ${path}`, 'color:#22c55e');
  }

  /* ──────── ARRANQUE ──────── */
  function boot(){
    injectBanner();
    wrapUpload();
    // Polling cada 800ms para mantener badges actualizados (cuando M4 re-renderiza)
    STATE.enrichInterval = setInterval(() => {
      enrichFilesWithMetadata();
    }, 800);
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  /* ──────── UTIL: toast ──────── */
  function flashBridgeToast(msg, type){
    let el = document.getElementById('m4-bridge-toast');
    if(!el){
      el = document.createElement('div');
      el.id = 'm4-bridge-toast';
      document.body.appendChild(el);
    }
    el.className = type === 'err' ? 'err' : '';
    el.textContent = msg;
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
    clearTimeout(el._t);
    el._t = setTimeout(()=>{
      el.style.opacity = '0';
      el.style.transform = 'translateY(10px)';
    }, 4000);
  }
})();

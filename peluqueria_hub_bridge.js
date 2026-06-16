/**
 * ═══════════════════════════════════════════════════════════════
 *  PELUQUERIA ↔ HUB BRIDGE · Fátima Caldera
 *  ────────────────────────────────────────────────────────────────
 *  Pegar en fatima_peluqueria.html justo antes de </body>:
 *      <script src="motor_helper.js"></script>
 *      <script src="peluqueria_hub_bridge.js"></script>
 *
 *  HACE 3 COSAS:
 *  1. AUTO-LOGIN: si la peluquería se abre como iframe del HUB,
 *     reutiliza el correo del usuario logueado y salta el modal.
 *  2. FILTRO POR ACCESO: lee usuarios/{uid}.acceso_clases de
 *     Firestore y oculta las clases NO desbloqueadas.
 *  3. CRÉDITOS: sincroniza con el HUB padre via postMessage.
 *     Si el usuario ve un video premium, descuenta crédito.
 *
 *  Modo solo (sin HUB padre) → funciona como antes.
 *  v1.0 · 28/MAY/2026
 * ═══════════════════════════════════════════════════════════════
 */
(function(){
  'use strict';
  if(window._PEL_BRIDGE_LOADED) return;
  window._PEL_BRIDGE_LOADED = true;

  const STATE = {
    inIframe: window.parent !== window,
    creditos: parseInt(localStorage.getItem('creditos_hub') || '10', 10),
    accesoClases: null,   // Set de claseIds desbloqueadas (null = aún NO cargado)
    esAdmin: false,       // la administradora ve el catálogo completo
    userEmail: null,
    userUid: null,
    fbReady: false,
    fbApi: null
  };

  /* Correos con permiso de admin (ven TODO, sin filtro de accesos). */
  const ADMIN_EMAILS = ['fatimahairstudio082@gmail.com','admin@fatima.com'];
  const _esAdmin = email => ADMIN_EMAILS.includes((email||'').trim().toLowerCase());

  console.log('%c[PELUQUERIA BRIDGE] cargando · iframe=' + STATE.inIframe, 'color:#c9a84c;font-weight:700');

  /* ────────── ESCUCHA AL HUB PADRE ────────── */
  window.addEventListener('message', e => {
    const d = e.data || {};
    if(!d.tipo) return;
    if(d.tipo === 'sincronizarCreditos'){
      STATE.creditos = d.creditos;
      try{ localStorage.setItem('creditos_hub', String(d.creditos)); }catch(_){}
      updateCreditUI();
    } else if(d.tipo === 'usuarioLogueado'){
      // El hub nos manda el correo del usuario logueado
      autoLogin(d.email, d.uid);
    }
  });

  // Pedir créditos al hub padre al cargar
  if(STATE.inIframe){
    try{ window.parent.postMessage({tipo:'pedirCreditos'}, '*'); }catch(_){}
    try{ window.parent.postMessage({tipo:'pedirUsuario'}, '*'); }catch(_){}
  }

  /* ────────── AUTO-LOGIN ────────── */
  function autoLogin(email, uid){
    if(!email) return;
    try{
      localStorage.setItem('aca_correo', email);
      if(uid) localStorage.setItem('aca_uid', uid);
      STATE.userEmail = email;
      STATE.userUid = uid;
      const modal = document.getElementById('modal-acceso');
      if(modal) modal.style.display = 'none';
      const disp = document.getElementById('disp-correo');
      if(disp) disp.textContent = email;
    }catch(_){}
    // Una vez que tenemos uid, cargar accesos
    if(uid) cargarAccesos(uid);
  }

  /* ────────── FIRESTORE: leer acceso_clases ────────── */
  async function cargarAccesos(uid){
    // La administradora SIEMPRE ve el catálogo completo (vista previa).
    if(_esAdmin(STATE.userEmail)){
      STATE.esAdmin = true;
      console.log('%c[PELUQUERIA BRIDGE] sesión admin · catálogo completo', 'color:#c9a84c;font-weight:700');
      return;
    }
    await ensureFirebase();
    if(!STATE.fbReady){
      // Sin Firebase no podemos verificar accesos. Por SEGURIDAD no abrimos
      // todo: dejamos el catálogo bloqueado hasta poder leer la lista real.
      console.warn('[PELUQUERIA BRIDGE] Firebase no disponible · catálogo bloqueado');
      STATE.accesoClases = new Set();
      aplicarFiltroAccesos();
      return;
    }
    try{
      const snap = await STATE.fbApi.getDoc(
        STATE.fbApi.doc(STATE.fbApi.db, 'usuarios', uid)
      );
      const data = (snap.exists() ? snap.data() : {}) || {};
      const ac = Array.isArray(data.acceso_clases) ? data.acceso_clases : [];
      // SIEMPRE aplicamos el filtro, aunque la lista esté vacía:
      // 0 clases asignadas = 0 clases visibles (NO «todo libre»).
      STATE.accesoClases = new Set(ac);
      console.log(`%c[PELUQUERIA BRIDGE] ✓ ${ac.length} clases desbloqueadas para la alumna`, 'color:#22c55e;font-weight:700');
      aplicarFiltroAccesos();
    }catch(e){
      console.warn('[PELUQUERIA BRIDGE] error leyendo usuario · catálogo bloqueado:', e);
      STATE.accesoClases = new Set();
      aplicarFiltroAccesos();
    }
  }

  async function ensureFirebase(){
    if(STATE.fbReady) return;
    // El HUB padre ya cargó firebase-compat. Si estamos en iframe MISMO ORIGEN,
    // lo reutilizamos. El acceso a window.parent.firebase puede lanzar
    // SecurityError si el iframe es cross-origin (p.ej. en una preview): por
    // eso TODO el bloque va dentro de try/catch y si falla, cargamos el SDK
    // modular más abajo.
    if(STATE.inIframe){
      try{
        const p = window.parent;
        if(p && p.firebase){
          STATE.fbApi = {
            db: p.firebase.firestore(),
            getDoc: async (ref) => { const s = await ref.get(); return { exists:()=>s.exists, data:()=>s.data() }; },
            doc: (db, col, id) => p.firebase.firestore().collection(col).doc(id)
          };
          STATE.fbReady = true;
          return;
        }
      }catch(e){
        // cross-origin o aún sin firebase en el padre → seguimos al SDK modular
      }
    }
    // Si no, intentamos cargar modular
    try{
      const [{ initializeApp }, fst] = await Promise.all([
        import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js'),
        import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js')
      ]);
      const CFG = {
        apiKey:"AIzaSyCcvwC7NYFgXl74YTF8ouzu32SFwB559dw",
        authDomain:"aprendisajefatima.firebaseapp.com",
        projectId:"aprendisajefatima",
        storageBucket:"aprendisajefatima.firebasestorage.app",
        messagingSenderId:"744176967394",
        appId:"1:744176967394:web:1db2edfd2498ddbaa7c8bb",
        measurementId:"G-0VH57EQ5GF"
      };
      let app;
      try{ app = initializeApp(CFG, 'pel-bridge'); }
      catch(e){ app = initializeApp(CFG); }
      STATE.fbApi = {
        db: fst.getFirestore(app),
        getDoc: fst.getDoc,
        doc: fst.doc
      };
      STATE.fbReady = true;
    }catch(e){
      console.warn('[PELUQUERIA BRIDGE] no se pudo cargar Firebase modular:', e);
    }
  }

  /* ────────── APLICAR FILTRO ────────── */
  function aplicarFiltroAccesos(){
    // Admin → nunca recortamos.
    if(STATE.esAdmin) return;
    // Aún no sabemos la lista de la alumna → no tocar todavía.
    if(STATE.accesoClases === null) return;

    // Partimos SIEMPRE del catálogo completo (las 299), nunca de uno ya
    // recortado. app.js publica _CONOCIMIENTO_FULL al montar.
    const full = window._CONOCIMIENTO_FULL || window.CONOCIMIENTO;
    if(!full || !window.FLAT){
      return setTimeout(aplicarFiltroAccesos, 300);
    }
    const acceso = STATE.accesoClases;   // Set (puede estar vacío)

    // 1. Filtrar categoría por categoría desde el catálogo completo
    const nuevo = {};
    Object.entries(full).forEach(([cat, clases]) => {
      const fil = clases.filter(c => acceso.has(c.id));
      if(fil.length) nuevo[cat] = fil;
    });
    window.CONOCIMIENTO = nuevo;

    // 2. Reconstruir FLAT (mismo array que usa app.js)
    window.FLAT.length = 0;
    Object.entries(nuevo).forEach(([cat, arr]) => {
      arr.forEach(c => window.FLAT.push({ ...c, cat }));
    });

    // 3. Re-render
    if(typeof window.renderMenu === 'function'){
      try{ window.renderMenu(); }catch(_){}
    }
    if(typeof window.actualizarStats === 'function'){
      try{ window.actualizarStats(); }catch(_){}
    }

    // 4. Estado según resultado
    if(window.FLAT.length === 0){
      // 0 clases asignadas → estado bloqueado claro
      mostrarEstadoVacio();
    } else {
      if(!window.CLASE_ACTIVA || !acceso.has(window.CLASE_ACTIVA)){
        if(typeof window.inyectar === 'function'){
          try{ window.inyectar(window.FLAT[0].id); }catch(_){}
        }
      }
      mostrarBannerAccesos();
    }
  }

  /* Estado cuando la alumna no tiene ninguna clase asignada todavía */
  function mostrarEstadoVacio(){
    const cont = document.getElementById('cats-container');
    if(cont){
      cont.innerHTML = '<div class="sec-lbl">Módulos Curriculares</div>'
        + '<div style="margin:14px 10px;padding:18px 14px;border:1px solid rgba(201,168,76,.28);'
        + 'border-radius:10px;background:rgba(201,168,76,.05);text-align:center;">'
        + '<div style="font-size:1.7rem;margin-bottom:8px;">🔒</div>'
        + '<div style="font-size:.82rem;color:#e6c97d;font-weight:700;margin-bottom:6px;">Aún no tienes clases asignadas</div>'
        + '<div style="font-size:.72rem;color:#94a3b8;line-height:1.6;">Tu instructora activará tus clases muy pronto. '
        + 'Cuando lo haga, aparecerán aquí automáticamente.</div></div>';
    }
    const title = document.getElementById('clase-title');
    if(title) title.textContent = 'Clases bloqueadas';
    const bc = document.getElementById('bc-clase'); if(bc) bc.textContent = 'Sin acceso';
    const lc = document.getElementById('lamina-content');
    if(lc){
      lc.innerHTML = '<div class="importante">🔒 Todavía no tienes clases desbloqueadas. '
        + 'En cuanto tu instructora te asigne acceso, podrás verlas aquí.</div>';
      lc.style.cssText = 'color:#d4dce8;display:block;visibility:visible;opacity:1;';
    }
  }

  function mostrarBannerAccesos(){
    if(document.getElementById('pel-bridge-banner')) return;
    const b = document.createElement('div');
    b.id = 'pel-bridge-banner';
    b.style.cssText = `
      position:fixed;top:62px;right:14px;z-index:100;
      background:linear-gradient(90deg,rgba(34,197,94,.15),rgba(34,197,94,.04));
      border:1px solid rgba(34,197,94,.35);
      border-radius:18px;padding:5px 12px;font-size:9px;color:#22c55e;
      font-family:Monaco,monospace;letter-spacing:.5px;
      box-shadow:0 4px 12px rgba(0,0,0,.4);
    `;
    b.innerHTML = `🔓 ${STATE.accesoClases.size} clases desbloqueadas para ti`;
    document.body.appendChild(b);
    setTimeout(()=>{ b.style.transition = 'opacity .4s'; b.style.opacity = '0'; setTimeout(()=>b.remove(),400); }, 6000);
  }

  // Expuesto para que app.js reaplique el filtro al terminar de montar
  // el catálogo completo (evita la fuga por carrera de tiempos).
  window._PEL_APLICAR_ACCESOS = aplicarFiltroAccesos;

  /* ────────── CRÉDITOS ────────── */
  function updateCreditUI(){
    const el = document.getElementById('credit-hub');
    if(el){ el.textContent = STATE.creditos; }
  }

  // Función global expuesta para gastar créditos desde la peluquería
  window.gastarCreditoHub = function(cantidad, concepto){
    cantidad = parseInt(cantidad, 10) || 1;
    if(STATE.creditos < cantidad){
      if(STATE.inIframe){
        try{ window.parent.postMessage({tipo:'abrirCompra'}, '*'); }catch(_){}
      }
      alert(`⚠️ Necesitas ${cantidad} crédito(s) y tienes ${STATE.creditos}. Recarga.`);
      return false;
    }
    STATE.creditos -= cantidad;
    try{ localStorage.setItem('creditos_hub', String(STATE.creditos)); }catch(_){}
    updateCreditUI();
    if(STATE.inIframe){
      try{ window.parent.postMessage({tipo:'gastarCreditos', cantidad, concepto}, '*'); }catch(_){}
    }
    return true;
  };

  /* ────────── ARRANQUE ────────── */
  function boot(){
    // Inyectar badge de créditos en el header (si no existe)
    const hdrRight = document.querySelector('.hdr-right');
    if(hdrRight && !document.getElementById('credit-hub-pill')){
      const pill = document.createElement('div');
      pill.id = 'credit-hub-pill';
      pill.style.cssText = 'display:flex;align-items:center;gap:7px;background:rgba(201,168,76,.08);border:1px solid rgba(201,168,76,.25);padding:6px 13px;border-radius:30px;font-size:.72rem;color:#C9A84C;';
      pill.innerHTML = `💎 <span id="credit-hub" style="font-weight:800;">${STATE.creditos}</span> cr`;
      hdrRight.appendChild(pill);
    }

    // Si ya hay correo en localStorage (sesión previa), intentar leer uid
    const correo = localStorage.getItem('aca_correo');
    const uid = localStorage.getItem('aca_uid');
    if(correo && uid){
      STATE.userEmail = correo;
      STATE.userUid = uid;
      cargarAccesos(uid);
    }

    updateCreditUI();
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', ()=>setTimeout(boot, 200));
  } else {
    setTimeout(boot, 200);
  }
})();

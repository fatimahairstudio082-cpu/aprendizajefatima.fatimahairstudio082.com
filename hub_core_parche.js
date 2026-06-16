/**
 * HUB CORE · CEREBRO CENTRAL FIREBASE
 * Academia Fátima Caldea · fatimahairstudio082.com
 * Dashboard = solo observador Firebase. No descuenta. No suma.
 */
(function(){
'use strict';
if(window._HUB_CORE_LOADED) return;
window._HUB_CORE_LOADED = true;

/* ── TARIFAS OFICIALES (créditos) · definidas por Fátima ── */
window.REGLAS_CONTROL_CREDITOS = {
  optimizador:   { accion:1, jpg:1,  pdf:1,  limite_gratis:10 },
  motor_corte:   { accion:5, jpg:5,  pdf:5  },
  colorimetria:  { accion:5, jpg:5,  pdf:5  },
  academia:      { accion:5, jpg:8,  pdf:10 },
  nutricion:     { accion:5, jpg:5,  pdf:5  },
  fitness:       { accion:5, jpg:8,  pdf:10 },
  construccion:  { accion:5, jpg:8,  pdf:10 },
  ejercicios:    { accion:5, jpg:8,  pdf:10 }
};

window.BLOQUE_TARIFA_MAP = {
  1:'motor_corte', 2:'colorimetria', 3:'academia',
  4:'nutricion',   5:'fitness',      6:'optimizador',
  7:'colorimetria',8:'construccion', 9:'ejercicios'
};

let _unsubGlobal  = null;
let _unsubBloques = null;

window.HUB_CORE = {
  uid: null,
  creditos: 0,
  saldosBloques: { b6:null, b7:null, b8:null, b9:null },
  _dashAbierto: false,

  iniciar(uid){
    if(this.uid === uid) return;
    this.uid = uid;
    this._arrancarListeners();
  },

  detener(){
    this.uid = null;
    this.creditos = 0;
    this.saldosBloques = { b6:null, b7:null, b8:null, b9:null };
    if(_unsubGlobal){  try{_unsubGlobal();}catch(_){}  _unsubGlobal=null;  }
    if(_unsubBloques){ try{_unsubBloques();}catch(_){} _unsubBloques=null; }
  },

  _arrancarListeners(){
    const db  = window.dbHub || firebase.firestore();
    const uid = this.uid;

    /* Listener 1 — usuarios/{uid} → crédito global */
    if(_unsubGlobal){ try{_unsubGlobal();}catch(_){} }
    _unsubGlobal = db.collection('usuarios').doc(uid)
      .onSnapshot(snap=>{
        const data = snap.exists ? snap.data()||{} : {};
        let cr = typeof data.creditos==='number' ? data.creditos
               : typeof data.creditos==='string' ? parseInt(data.creditos) : null;
        if(cr===null || isNaN(cr)){
          cr = 10;
          db.collection('usuarios').doc(uid)
            .set({creditos:10},{merge:true}).catch(()=>{});
        }
        this.creditos = Math.max(0, cr);
        this._actualizarBadge();
      }, err=>console.warn('[HUB CORE] usuarios:', err.message));

    /* Listener 2 — usuarios_bloques/{uid} → saldos B6-B9 */
    if(_unsubBloques){ try{_unsubBloques();}catch(_){} }
    _unsubBloques = db.collection('usuarios_bloques').doc(uid)
      .onSnapshot(snap=>{
        const data = snap.exists ? snap.data()||{} : {};
        ['b6','b7','b8','b9'].forEach(k=>{
          const v = parseInt(data['cr_'+k]);
          this.saldosBloques[k] = isNaN(v) ? null : Math.max(0, v);
        });
        if(this._dashAbierto) renderCrDashboard_core();
      }, err=>console.warn('[HUB CORE] usuarios_bloques:', err.message));
  },

  _actualizarBadge(){
    const cr = this.creditos;
    const el   = document.getElementById('crDisplay');  if(el)   el.textContent  = cr+' cr';
    const hero = document.getElementById('crHero');     if(hero) hero.textContent = cr+' cr';
    const amt  = document.getElementById('mcrAmount');  if(amt)  amt.textContent  = cr;
    const fill = document.getElementById('mcrFill');
    if(fill) fill.style.width = Math.min(100,(cr/120)*100)+'%';
    if(window.HUB){
      HUB.creditos = cr;
      if(HUB.crKey) localStorage.setItem(HUB.crKey, String(cr));
      /* Reenviar saldo a todos los bloques/iframes en tiempo real */
      if(typeof HUB.sincTodos === 'function') HUB.sincTodos(cr);
    }
    if(this._dashAbierto) renderCrDashboard_core();
  },

  _sincronizarIframes(){
    const poolMap = { frame6:'b6', frame7:'b7', frame8:'b8', frame9:'b9' };
    Object.entries(poolMap).forEach(([id,pool])=>{
      const fr = document.getElementById(id);
      if(fr && fr.src!=='about:blank'){
        const saldo = this.saldosBloques[pool]!==null ? this.saldosBloques[pool] : this.creditos;
        try{ fr.contentWindow.postMessage({tipo:'sincronizarCreditos',creditos:saldo},'*'); }catch(_){}
      }
    });
    ['frame1','frame2','frame3','frame4','frame5'].forEach(id=>{
      const fr = document.getElementById(id);
      if(fr && fr.src!=='about:blank'){
        try{ fr.contentWindow.postMessage({tipo:'sincronizarCreditos',creditos:this.creditos},'*'); }catch(_){}
      }
    });
  }
};

/* ── CONECTAR AUTH ── */
function conectarAuth(){
  const auth = window.auth || firebase.auth();
  if(!auth){ setTimeout(conectarAuth,300); return; }
  auth.onAuthStateChanged(user=>{
    if(user){
      HUB_CORE.iniciar(user.uid);
      const db = window.dbHub || firebase.firestore();
      db.collection('usuarios').doc(user.uid).get().then(snap=>{
        if(!snap.exists || snap.data().creditos===undefined){
          db.collection('usuarios').doc(user.uid)
            .set({creditos:10, nombre:user.displayName||'', email:user.email},{merge:true});
        }
      }).catch(()=>{});
    } else {
      HUB_CORE.detener();
    }
  });
}
setTimeout(conectarAuth, 200);

/* ── DASHBOARD — SOLO OBSERVADOR ── */
window.renderCrDashboard_core = function(){
  const totalEl = document.getElementById('crd-total-val');
  const subEl   = document.getElementById('crd-total-sub');
  const contEl  = document.getElementById('crd-blocks');
  if(!totalEl || !contEl) return;

  totalEl.textContent = HUB_CORE.creditos;

  const bloques = [
    {id:'b6', ico:'🧰', nom:'Optimizador · Herramientas',  sub:'1 cr/acción · 1 cr/descarga'},
    {id:'b7', ico:'🎨', nom:'Calculadora Cromática',        sub:'5 cr/acción · 5 cr/JPG'},
    {id:'b8', ico:'🏗️', nom:'Sistema de Construcción',     sub:'5 cr/cálculo · 5 cr/descarga'},
    {id:'b9', ico:'🏋️', nom:'Diccionario de Ejercicios',   sub:'5 cr/acción · 5 cr/descarga'}
  ];

  const totalBloques = Object.values(HUB_CORE.saldosBloques)
    .reduce((s,v)=>s+(v||0), 0);

  if(subEl) subEl.innerHTML =
    `créditos disponibles · <span style="color:var(--bio);">${totalBloques}</span> en bloques`;

  contEl.innerHTML = bloques.map(b=>{
    const v       = HUB_CORE.saldosBloques[b.id];
    const display = v===null ? '—' : v;
    const cls     = v===null ? '' : v===0 ? 'empty' : v<=5 ? 'low' : '';
    return `<div class="crd-card">
      <div class="left">
        <div class="ico">${b.ico}</div>
        <div><div class="nom">${b.nom}</div><div class="sub">${b.sub}</div></div>
      </div>
      <div class="val ${cls}">${display}<span class="un">cr</span></div>
    </div>`;
  }).join('');

  const logsCont = document.getElementById('crd-logs');
  if(logsCont && window.CRD && CRD.logs){
    logsCont.innerHTML = !CRD.logs.length
      ? '<div class="crd-empty">Aún no has gastado créditos en esta sesión.</div>'
      : CRD.logs.slice(-8).reverse().map(l=>
          `<div class="crd-log">
            <div class="desc"><b>${l.concepto||'Acción'}</b></div>
            <div class="cost">-${l.cantidad}cr</div>
            <div class="when">${l.when}</div>
          </div>`).join('');
  }
};

/* ── ABRIR / CERRAR DASHBOARD ── */
window.abrirCrDashboard = function(){
  HUB_CORE._dashAbierto = true;
  if(window.CRD) CRD.abierto = true;
  const el = document.getElementById('crDashboard');
  if(el) el.classList.add('open');
  renderCrDashboard_core();
};
window.cerrarCrDashboard = function(){
  HUB_CORE._dashAbierto = false;
  if(window.CRD) CRD.abierto = false;
  const el = document.getElementById('crDashboard');
  if(el) el.classList.remove('open');
};

/* ── MENSAJES IFRAMES ── */
window.addEventListener('message', e=>{
  if(!e.data||!e.data.tipo) return;
  if(e.data.tipo==='pedirCreditos' && e.source){
    try{
      e.source.postMessage({tipo:'sincronizarCreditos', creditos:HUB_CORE.creditos},'*');
    }catch(_){}
  }
}, true);

/* ── JUEGOS — usa iframe10 que ya existe en el HTML ── */
window.cambiarBloque = (function(_orig){
  return function(n){
    if(n==='juegos'){
      document.querySelectorAll('.bloque-frame').forEach(f=>f.classList.remove('active'));
      ['panelHome','panelNews','panelDashboard'].forEach(id=>{
        const el=document.getElementById(id); if(el) el.style.display='none';
      });
      const fj = document.getElementById('iframe10');
      if(fj){
        fj.classList.add('active');
        if(fj.src==='about:blank') fj.src = fj.dataset.src||'juegos_fatima.html';
      }
      document.querySelectorAll('.nav-tab[data-bloque]').forEach(t=>
        t.classList.toggle('active', t.dataset.bloque==='juegos')
      );
      const cb = document.getElementById('chatboxFloat');
      if(cb) cb.classList.add('hidden-on-block');
      if(window.toast) toast('🎮 Juegos Gratis — ¡a jugar y aprender!');
      return;
    }
    if(typeof _orig==='function') _orig(n);
  };
})(window.cambiarBloque);

/* ── BANNER JUEGOS en el Home ── */
function inyectarBannerJuegos(){
  if(document.getElementById('juegos-banner-core')) return;
  const grid = document.getElementById('bloquesGrid');
  if(!grid) return;
  const div = document.createElement('div');
  div.id = 'juegos-banner-core';
  div.style.cssText = [
    'display:flex','align-items:center','gap:18px',
    'margin:28px 0 0','padding:22px 24px','border-radius:18px','cursor:pointer',
    'background:linear-gradient(120deg,rgba(0,255,195,.08),rgba(201,168,76,.06))',
    'border:1px solid rgba(0,255,195,.25)','transition:all .3s','flex-wrap:wrap'
  ].join(';');
  div.innerHTML = `
    <div style="font-size:42px;filter:drop-shadow(0 0 14px rgba(0,255,195,.4));">🎮</div>
    <div style="flex:1;min-width:180px;">
      <div style="font-size:8px;font-weight:700;letter-spacing:2px;color:#00ffc3;margin-bottom:5px;">100% GRATIS · SIN CRÉDITOS</div>
      <div style="font-size:16px;color:#fff;font-weight:700;margin-bottom:4px;">Academia Interactiva · Juegos &amp; Retos</div>
      <div style="font-size:10px;color:#64748b;line-height:1.5;">Aprende jugando: quizzes, niveles y desafíos de peluquería, color y más.</div>
    </div>
    <button onclick="event.stopPropagation();cambiarBloque('juegos')"
      style="padding:11px 22px;border-radius:24px;border:none;background:linear-gradient(135deg,#00bfa0,#00ffc3);color:#022;font-size:10px;font-weight:700;cursor:pointer;font-family:Monaco,monospace;white-space:nowrap;">
      Jugar ahora →
    </button>`;
  div.onclick = ()=>cambiarBloque('juegos');
  grid.parentNode.insertBefore(div, grid.nextSibling);
}

const _origRender = window.renderHome;
window.renderHome = function(){
  if(typeof _origRender==='function') _origRender.apply(this,arguments);
  setTimeout(inyectarBannerJuegos, 100);
};
setTimeout(inyectarBannerJuegos, 1500);

console.log('%c[HUB CORE] ✓ listo','color:#22c55e;font-weight:700');
})();

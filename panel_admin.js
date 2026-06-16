/* ════════════════════════════════════════════════════════════════
   FÁTIMA PRO · PANEL DE ADMINISTRACIÓN (BACKEND DE ACTIVACIÓN)
   Academia Fátima Caldea · proyecto Firebase: aprendisajefatima
   ----------------------------------------------------------------
   Firebase = FUENTE DE LA VERDAD.
   Aquí el administrador:
     · activa / desactiva el ACCESO de cada usuario   (campo  activo)
     · recarga / fija los CRÉDITOS                     (campo  creditos)
     · ve todo en TIEMPO REAL (onSnapshot)
   El hub lee estos mismos campos para dar o negar entrada y descontar.
   ════════════════════════════════════════════════════════════════ */
(function(){
'use strict';

/* ───────────────────────────────────────────────────────────────
   1) CONFIGURACIÓN  ·  EDITA SOLO ESTA SECCIÓN
   ─────────────────────────────────────────────────────────────── */
const fbConfig = {
  apiKey:"AIzaSyCcvwC7NYFgXl74YTF8ouzu32SFwB559dw",
  authDomain:"aprendisajefatima.firebaseapp.com",
  projectId:"aprendisajefatima",
  storageBucket:"aprendisajefatima.firebasestorage.app",
  messagingSenderId:"744176967394",
  appId:"1:744176967394:web:1db2edfd2498ddbaa7c8bb"
};

/* ⚠️ CORREOS CON PERMISO DE ADMINISTRADOR.
   Pon aquí el/los correo(s) de Fátima (los dueños del sistema).
   Solo estos correos podrán abrir el panel. */
const ADMIN_EMAILS = [
  "admin@fatima.com",
  "fatimahairstudio082@gmail.com"
];

/* Tarifas oficiales — referencia visual (el descuento real lo hace cada bloque/hub) */
const TARIFAS = [
  {nm:"Motor Peluquería",  accion:5, jpg:5,  pdf:5 },
  {nm:"Calc. Cromática",   accion:5, jpg:5,  pdf:5 },
  {nm:"Academia",          accion:5, jpg:8,  pdf:10},
  {nm:"Nutrición",         accion:5, jpg:5,  pdf:5 },
  {nm:"Neural Fitness",    accion:5, jpg:8,  pdf:10},
  {nm:"Herram. Optimizador",accion:1,jpg:1,  pdf:1 },
  {nm:"Construcción",      accion:5, jpg:8,  pdf:10},
  {nm:"Ejercicios",        accion:5, jpg:8,  pdf:10}
];

/* ───────────────────────────────────────────────────────────────
   2) INIT FIREBASE
   ─────────────────────────────────────────────────────────────── */
firebase.initializeApp(fbConfig);
const auth = firebase.auth();
const db   = firebase.firestore();

let USERS = [];        // cache en memoria (espejo de Firestore)
let FILTRO = 'todos';
let unsub = null;      // listener onSnapshot
let drawerUid = null;  // usuario abierto en el panel lateral

const $ = id => document.getElementById(id);
const esAdmin = email => ADMIN_EMAILS.map(e=>e.toLowerCase()).includes((email||'').toLowerCase());

/* ───────────────────────────────────────────────────────────────
   3) AUTENTICACIÓN
   ─────────────────────────────────────────────────────────────── */
function login(){
  const em = $('email').value.trim();
  const pw = $('pass').value;
  if(!em || !pw){ return errLogin('Completa correo y contraseña.'); }
  if(!esAdmin(em)){ return errLogin('Este correo no tiene permiso de administrador.'); }
  $('btnLogin').disabled = true; errLogin('');
  auth.signInWithEmailAndPassword(em, pw)
    .catch(e=>{ errLogin(traducir(e.code)); $('btnLogin').disabled=false; });
}

function logout(){ auth.signOut(); }

auth.onAuthStateChanged(user=>{
  if(user && esAdmin(user.email)){
    $('login').style.display='none';
    $('app').style.display='block';
    $('adminEmail').textContent = user.email;
    arrancarListener();
    pintarTarifas();
  }else{
    if(user && !esAdmin(user.email)){ auth.signOut(); errLogin('Cuenta sin permiso de administrador.'); }
    if(unsub){ try{unsub();}catch(_){ } unsub=null; }
    $('app').style.display='none';
    $('login').style.display='flex';
    $('btnLogin').disabled=false;
  }
});

function errLogin(m){ $('loginErr').textContent = m; }
function traducir(code){
  const t={
    'auth/invalid-email':'Correo inválido.',
    'auth/user-not-found':'No existe una cuenta con ese correo.',
    'auth/wrong-password':'Contraseña incorrecta.',
    'auth/invalid-credential':'Correo o contraseña incorrectos.',
    'auth/too-many-requests':'Demasiados intentos. Espera un momento.',
    'auth/network-request-failed':'Sin conexión. Revisa tu internet.'
  };
  return t[code] || 'No se pudo iniciar sesión.';
}

/* ───────────────────────────────────────────────────────────────
   4) TIEMPO REAL  ·  espejo de la colección usuarios
   ─────────────────────────────────────────────────────────────── */
function arrancarListener(){
  if(unsub){ try{unsub();}catch(_){ } }
  unsub = db.collection('usuarios').onSnapshot(snap=>{
    USERS = snap.docs.map(d=>{
      const x = d.data()||{};
      return {
        uid: d.id,
        email: x.email || '',
        nombre: x.nombre || x.displayName || (x.email? x.email.split('@')[0] : 'Usuario'),
        creditos: typeof x.creditos==='number' ? x.creditos : (parseInt(x.creditos)||0),
        activo: x.activo !== false,              // por defecto activo si el campo no existe
        plan: x.plan || '—',
        creado: x.creado || null,
        ultimoAcceso: x.ultimoAcceso || null
      };
    });
    render();
    if(drawerUid) pintarDrawer(drawerUid);   // refresca panel lateral en vivo
  }, err=>{
    console.error('[ADMIN] snapshot:', err);
    toast('Error de lectura: '+err.message);
  });
}

/* ───────────────────────────────────────────────────────────────
   5) RENDER  ·  stats + tabla
   ─────────────────────────────────────────────────────────────── */
function setFiltro(f){
  FILTRO=f;
  document.querySelectorAll('.chip').forEach(c=>c.classList.toggle('active', c.dataset.f===f));
  render();
}

function render(){
  // stats
  const total = USERS.length;
  const activos = USERS.filter(u=>u.activo).length;
  const crTotal = USERS.reduce((s,u)=>s+(u.creditos||0),0);
  $('stTotal').textContent = total;
  $('stActivos').textContent = activos;
  $('stPend').textContent = total - activos;
  $('stCr').innerHTML = crTotal.toLocaleString('es-ES')+' <small>cr</small>';

  // filtro + búsqueda
  const q = $('buscar').value.trim().toLowerCase();
  let lista = USERS.slice();
  if(FILTRO==='activos')   lista = lista.filter(u=>u.activo);
  if(FILTRO==='inactivos') lista = lista.filter(u=>!u.activo);
  if(q) lista = lista.filter(u => (u.nombre+' '+u.email).toLowerCase().includes(q));
  lista.sort((a,b)=> a.nombre.localeCompare(b.nombre));

  const tb = $('tbody');
  if(!lista.length){
    tb.innerHTML = '<div class="empty">— Sin usuarios que mostrar —</div>';
    return;
  }
  tb.innerHTML = lista.map(u=>{
    const ini = (u.nombre[0]||'?').toUpperCase();
    const estado = u.activo
      ? '<span class="badge on"><span class="d"></span>Activo</span>'
      : '<span class="badge off"><span class="d"></span>Inactivo</span>';
    const toggleLabel = u.activo ? 'Desactivar' : 'Activar';
    const toggleClass = u.activo ? 'red' : 'green';
    return `<div class="trow">
      <div class="u-id">
        <div class="u-av">${ini}</div>
        <div class="u-meta">
          <div class="u-name">${esc(u.nombre)}</div>
          <div class="u-mail">${esc(u.email||u.uid)}</div>
        </div>
      </div>
      <div class="u-cr">${u.creditos}<small> cr</small></div>
      <div>${estado}</div>
      <div class="row-actions">
        <button class="act ${toggleClass}" onclick="ADMIN.toggle('${u.uid}')">${toggleLabel}</button>
        <button class="act" onclick="ADMIN.recarga('${u.uid}',10)">+10</button>
        <button class="act" onclick="ADMIN.abrirDrawer('${u.uid}')">Gestionar</button>
      </div>
    </div>`;
  }).join('');
}

function pintarTarifas(){
  $('tarGrid').innerHTML = TARIFAS.map(t=>`
    <div class="tar">
      <div class="nm">${t.nm}</div>
      <div class="vals">
        <span><b>${t.accion}</b>acción</span>
        <span><b>${t.jpg}</b>JPG</span>
        <span><b>${t.pdf}</b>PDF</span>
      </div>
    </div>`).join('');
}

/* ───────────────────────────────────────────────────────────────
   6) ACCIONES SOBRE FIREBASE  (escriben la fuente de la verdad)
   ─────────────────────────────────────────────────────────────── */
function toggle(uid){
  const u = USERS.find(x=>x.uid===uid); if(!u) return;
  const nuevo = !u.activo;
  db.collection('usuarios').doc(uid).set({
    activo: nuevo,
    actualizado: firebase.firestore.FieldValue.serverTimestamp()
  },{merge:true})
   .then(()=> toast((nuevo?'✓ Acceso activado · ':'⊘ Acceso desactivado · ')+(u.nombre)))
   .catch(e=> toast('Error: '+e.message));
}

function recarga(uid, n){
  const u = USERS.find(x=>x.uid===uid); if(!u) return;
  const ref = db.collection('usuarios').doc(uid);
  db.runTransaction(tx=> tx.get(ref).then(s=>{
    const cur = (s.exists && typeof s.data().creditos==='number') ? s.data().creditos : 0;
    tx.set(ref,{creditos:cur+n},{merge:true});
    return cur+n;
  })).then(v=> toast('+'+n+' cr · '+u.nombre+' → '+v+' cr'))
     .catch(e=> toast('Error: '+e.message));
}

function fijar(uid, valor){
  const n = Math.max(0, parseInt(valor)||0);
  db.collection('usuarios').doc(uid).set({creditos:n},{merge:true})
    .then(()=> toast('Créditos fijados en '+n))
    .catch(e=> toast('Error: '+e.message));
}

/* ───────────────────────────────────────────────────────────────
   7) DRAWER  ·  gestión detallada de un usuario
   ─────────────────────────────────────────────────────────────── */
function abrirDrawer(uid){
  drawerUid = uid;
  pintarDrawer(uid);
  $('drawerBg').style.display='block';
  requestAnimationFrame(()=> $('drawer').classList.add('open'));
}
function cerrarDrawer(){
  drawerUid = null;
  $('drawer').classList.remove('open');
  $('drawerBg').style.display='none';
}

function pintarDrawer(uid){
  const u = USERS.find(x=>x.uid===uid);
  if(!u){ cerrarDrawer(); return; }
  const ini = (u.nombre[0]||'?').toUpperCase();
  const fecha = ts => { try{ return ts&&ts.toDate ? ts.toDate().toLocaleDateString('es-ES') : '—'; }catch(_){ return '—'; } };
  $('drawer').innerHTML = `
    <button class="dr-x" onclick="ADMIN.cerrarDrawer()">✕</button>
    <div class="dr-av">${ini}</div>
    <div class="dr-name">${esc(u.nombre)}</div>
    <div class="dr-mail">${esc(u.email||'sin correo')}</div>
    <div class="dr-uid">UID: ${u.uid}</div>

    <div class="dr-sec">
      <h4>Acceso al sistema</h4>
      <div class="toggle-acc">
        <div class="lab">${u.activo?'Acceso permitido':'Acceso bloqueado'}
          <small>${u.activo?'Puede entrar al hub y a los bloques':'No podrá iniciar sesión en el hub'}</small>
        </div>
        <button class="sw ${u.activo?'on':''}" onclick="ADMIN.toggle('${u.uid}')"></button>
      </div>
    </div>

    <div class="dr-sec">
      <h4>Créditos (pozo global)</h4>
      <div class="cr-big">${u.creditos}<small> cr</small></div>
      <div class="cr-grid">
        <button onclick="ADMIN.recarga('${u.uid}',10)">+10</button>
        <button onclick="ADMIN.recarga('${u.uid}',30)">+30</button>
        <button onclick="ADMIN.recarga('${u.uid}',60)">+60</button>
        <button onclick="ADMIN.recarga('${u.uid}',100)">+100</button>
      </div>
      <div class="cr-set">
        <input id="crSet" type="number" min="0" placeholder="Fijar valor exacto…"/>
        <button onclick="ADMIN.fijarDesdeInput('${u.uid}')">Fijar</button>
      </div>
    </div>

    <div class="dr-sec">
      <h4>Información</h4>
      <div class="dr-info">
        Estado: <b>${u.activo?'Activo':'Inactivo'}</b><br/>
        Plan: <b>${esc(u.plan)}</b><br/>
        Registrado: <b>${fecha(u.creado)}</b><br/>
        Último acceso: <b>${fecha(u.ultimoAcceso)}</b>
      </div>
      <button class="dr-danger" onclick="ADMIN.fijar('${u.uid}',0)">Vaciar créditos a 0</button>
    </div>`;
}

function fijarDesdeInput(uid){
  const v = $('crSet').value;
  if(v==='' || isNaN(parseInt(v))){ toast('Escribe un número.'); return; }
  fijar(uid, v);
}

/* ───────────────────────────────────────────────────────────────
   8) UTILIDADES
   ─────────────────────────────────────────────────────────────── */
let toastT=null;
function toast(msg){
  const t=$('toast'); t.textContent=msg; t.classList.add('show');
  clearTimeout(toastT); toastT=setTimeout(()=>t.classList.remove('show'),2600);
}
function esc(s){ return String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

/* Enter para login */
document.addEventListener('keydown',e=>{
  if(e.key==='Enter' && $('login').style.display!=='none'){ login(); }
  if(e.key==='Escape') cerrarDrawer();
});

/* API pública */
window.ADMIN = { login, logout, render, setFiltro, toggle, recarga, fijar, fijarDesdeInput,
                 abrirDrawer, cerrarDrawer };
})();

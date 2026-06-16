/* ════════════════════════════════════════════════════════════════
   BIBLIOTECA NEURAL FITNESS · Gestor de contenido
   Academia Fátima Caldea · Firebase: aprendisajefatima
   ----------------------------------------------------------------
   Escribe el contenido que consume el bloque de fitness y el hub:
     · fitness_videos/{dia{N}_{motor}_{grupo}}  -> {url_video,titulo,guion}
     · fitness_imgs/{grupo}_{motor}_{equipo}_{nEj}_v{V}} -> {url}
     · hub_tarjetas/{n}  -> {imgUrl,nom,desc}   (tarjetas de la portada del hub)
   ════════════════════════════════════════════════════════════════ */
(function(){
'use strict';

/* ── CONFIG (igual que el hub/panel) ── */
const fbConfig = {
  apiKey:"AIzaSyCcvwC7NYFgXl74YTF8ouzu32SFwB559dw",
  authDomain:"aprendisajefatima.firebaseapp.com",
  projectId:"aprendisajefatima",
  storageBucket:"aprendisajefatima.firebasestorage.app",
  messagingSenderId:"744176967394",
  appId:"1:744176967394:web:1db2edfd2498ddbaa7c8bb"
};
/* ⚠️ Pon aquí el/los correo(s) de administrador (los mismos del panel). */
const ADMIN_EMAILS = ["admin@fatima.com","fatimahairstudio082@gmail.com"];

const MAX_LAMINAS = 12;

/* Tarjetas del hub (deben coincidir con BLOQUES_DATA del hub) */
const HUB_CARDS = [
  {n:1, ico:'✂️', nom:'Motor de Corte & Diagnóstico'},
  {n:2, ico:'🎨', nom:'Colorimetría · Calculadora Cromática'},
  {n:3, ico:'📚', nom:'Academia & Biblioteca'},
  {n:4, ico:'🥗', nom:'Nutrición & Alimentación Fitness'},
  {n:5, ico:'💪', nom:'Entrenamientos Fitness'},
  {n:6, ico:'🧰', nom:'Optimizador · Herramientas'}
];

/* ── INIT ── */
firebase.initializeApp(fbConfig);
const auth = firebase.auth();
const db   = firebase.firestore();
const $ = id => document.getElementById(id);
const esAdmin = e => ADMIN_EMAILS.map(x=>x.toLowerCase()).includes((e||'').toLowerCase());

let VIDEOS = {};   // espejo fitness_videos
let IMGS   = {};   // espejo fitness_imgs
let TARJ   = {};   // espejo hub_tarjetas
let NOTI   = [];   // espejo noticias (array ordenado)
let CORTE  = {};   // espejo corte_modulos (M1-M7)
let unsubV=null, unsubI=null, unsubT=null, unsubC=null, unsubN=null;
let hubEdit=null;  // n de tarjeta en edición

/* Normaliza una imagen: acepta URL directa o ID/enlace de Google Drive */
function normImg(v){
  if(!v) return '';
  const s=String(v).trim();
  if(/^https?:\/\//i.test(s)){
    if(s.indexOf('drive.google')>=0){ const m=s.match(/[-\w]{25,}/); if(m) return `https://drive.google.com/thumbnail?id=${m[0]}&sz=w1400`; }
    return s;
  }
  if(/^[-\w]{20,}$/.test(s)) return `https://drive.google.com/thumbnail?id=${s}&sz=w1400`;
  return s;
}
const CORTE_LBL={M1:'Protocolo de Limpieza',M2:'Herramientas Profesionales',M3:'Técnica Lógica de Corte',M4:'Avatar Fátima Caldea',M5:'Secciones y Divisiones',M6:'Elevaciones y Proyecciones',M7:'Geometría del Corte'};

/* ── AUTH ── */
function login(){
  const em=$('email').value.trim(), pw=$('pass').value;
  if(!em||!pw) return err('Completa correo y contraseña.');
  if(!esAdmin(em)) return err('Este correo no tiene permiso de administrador.');
  $('btnLogin').disabled=true; err('');
  auth.signInWithEmailAndPassword(em,pw).catch(e=>{ err(traducir(e.code)); $('btnLogin').disabled=false; });
}
function logout(){ auth.signOut(); }
auth.onAuthStateChanged(u=>{
  if(u && esAdmin(u.email)){
    $('login').style.display='none'; $('app').style.display='block';
    $('adminEmail').textContent=u.email;
    initVersionSelect(); vKey(); iKey(); cLoad();
    arrancarListeners();
  }else{
    if(u && !esAdmin(u.email)){ auth.signOut(); err('Cuenta sin permiso de administrador.'); }
    [unsubV,unsubI,unsubT,unsubC].forEach(f=>{ if(f){try{f();}catch(_){}}});
    unsubV=unsubI=unsubT=unsubC=null;
    $('app').style.display='none'; $('login').style.display='flex'; $('btnLogin').disabled=false;
  }
});
function err(m){ $('loginErr').textContent=m; }
function traducir(c){
  return ({'auth/invalid-email':'Correo inválido.','auth/user-not-found':'No existe esa cuenta.',
    'auth/wrong-password':'Contraseña incorrecta.','auth/invalid-credential':'Correo o contraseña incorrectos.',
    'auth/too-many-requests':'Demasiados intentos. Espera un momento.',
    'auth/network-request-failed':'Sin conexión.'}[c])||'No se pudo iniciar sesión.';
}

/* ── TIEMPO REAL ── */
function arrancarListeners(){
  unsubV = db.collection('fitness_videos').onSnapshot(s=>{
    VIDEOS={}; s.forEach(d=>VIDEOS[d.id]=d.data()||{}); pintarVideos();
  }, e=>toast('Error videos: '+e.message));
  unsubI = db.collection('fitness_imgs').onSnapshot(s=>{
    IMGS={}; s.forEach(d=>IMGS[d.id]=(d.data()||{}).url||''); pintarImgs();
  }, e=>toast('Error imágenes: '+e.message));
  unsubT = db.collection('hub_tarjetas').onSnapshot(s=>{
    TARJ={}; s.forEach(d=>TARJ[d.id]=d.data()||{}); pintarHub();
  }, e=>toast('Error tarjetas: '+e.message));
  unsubC = db.collection('corte_modulos').onSnapshot(s=>{
    CORTE={}; s.forEach(d=>CORTE[d.id]=d.data()||{}); pintarCorte();
  }, e=>toast('Error corte: '+e.message));
  unsubN = db.collection('noticias').onSnapshot(s=>{
    NOTI=[]; s.forEach(d=>{ const v=d.data()||{}; v._id=d.id; NOTI.push(v); });
    NOTI.sort((a,b)=>(a.orden||0)-(b.orden||0));
    pintarNews();
  }, e=>toast('Error noticias: '+e.message));
}

/* ── TABS ── */
function tab(t){
  document.querySelectorAll('.tab').forEach(b=>b.classList.toggle('active', b.dataset.t===t));
  document.querySelectorAll('.pane').forEach(p=>p.classList.remove('active'));
  $('pane-'+t).classList.add('active');
}

/* ════════ VIDEOS ════════ */
function vKey(){
  const k = `dia${parseInt($('v_dia').value)||1}_${$('v_obj').value}_${$('v_grupo').value}`;
  $('v_keytxt').textContent = k;
  const ex = VIDEOS[k];
  if(ex){
    $('v_url').value = ex.url_video||'';
    $('v_titulo').value = ex.titulo||'';
    $('v_guion').value = ex.guion||'';
  }
  vPreview();
  return k;
}
function vPreview(){
  const url=$('v_url').value.trim();
  $('v_prev').innerHTML = url
    ? `<video src="${esc(url)}" controls playsinline preload="metadata"></video>`
    : `<div class="empty">Pega una URL para previsualizar el video</div>`;
}
function guardarVideo(){
  const k = `dia${parseInt($('v_dia').value)||1}_${$('v_obj').value}_${$('v_grupo').value}`;
  const url=$('v_url').value.trim();
  if(!url) return toast('Falta la URL del video.');
  db.collection('fitness_videos').doc(k).set({
    url_video:url, titulo:$('v_titulo').value.trim(), guion:$('v_guion').value.trim(),
    actualizado: firebase.firestore.FieldValue.serverTimestamp()
  },{merge:true}).then(()=>toast('✓ Video guardado · '+k)).catch(e=>toast('Error: '+e.message));
}
function pintarVideos(){
  const keys=Object.keys(VIDEOS).sort();
  $('v_count').textContent=keys.length;
  const c=$('v_lista');
  if(!keys.length){ c.innerHTML='<div class="empty-list">Aún no hay videos. Añade el primero →</div>'; return; }
  c.innerHTML=keys.map(k=>{
    const d=VIDEOS[k]||{};
    return `<div class="item">
      <div class="thumb-ic">🎬</div>
      <div class="meta"><b>${esc(d.titulo||k)}</b><small>${esc(k)}</small></div>
      <button class="edit" onclick="BIB.cargarVideo('${esc(k)}')">Editar</button>
      <button class="del" onclick="BIB.borrarVideo('${esc(k)}')">✕</button>
    </div>`;
  }).join('');
}
function cargarVideo(k){
  const m=k.match(/^dia(\d+)_([a-z]+)_([a-z]+)$/); if(!m) return;
  $('v_dia').value=m[1]; $('v_obj').value=m[2]; $('v_grupo').value=m[3];
  tab('videos'); vKey();
  $('v_url').scrollIntoView({block:'center'});
}
function borrarVideo(k){
  if(!confirm('¿Borrar el video '+k+'?')) return;
  db.collection('fitness_videos').doc(k).delete().then(()=>toast('Video borrado')).catch(e=>toast('Error: '+e.message));
}

/* ════════ IMÁGENES ════════ */
function initVersionSelect(){
  const sel=$('i_v'); sel.innerHTML='';
  for(let v=1;v<=MAX_LAMINAS;v++){ const o=document.createElement('option'); o.value=v; o.textContent='v'+v; sel.appendChild(o); }
}
function iBase(){ return `${$('i_grupo').value}_${$('i_obj').value}_${$('i_equipo').value}_${$('i_nej').value}`; }
function iKey(){
  const k = `${iBase()}_v${$('i_v').value}`;
  $('i_keytxt').textContent=k;
  $('i_url').value = IMGS[k]||'';
  iPreview();
  return k;
}
function iPreview(){
  const url=$('i_url').value.trim();
  $('i_prev').innerHTML = url
    ? `<img src="${esc(url)}" alt="lámina" onerror="this.parentNode.innerHTML='<div class=\\'empty\\'>No se pudo cargar la imagen</div>'"/>`
    : `<div class="empty">Pega una URL para previsualizar la lámina</div>`;
}
function guardarImg(todas){
  const url=$('i_url').value.trim();
  if(!url) return toast('Falta la URL de la imagen.');
  const base=iBase();
  if(todas){
    const batch=db.batch();
    for(let v=1;v<=MAX_LAMINAS;v++){ batch.set(db.collection('fitness_imgs').doc(`${base}_v${v}`),{url},{merge:true}); }
    batch.commit().then(()=>toast('✓ Aplicada a las 12 versiones · '+base)).catch(e=>toast('Error: '+e.message));
  }else{
    const k=`${base}_v${$('i_v').value}`;
    db.collection('fitness_imgs').doc(k).set({url},{merge:true})
      .then(()=>toast('✓ Lámina guardada · '+k)).catch(e=>toast('Error: '+e.message));
  }
}
function pintarImgs(){
  const keys=Object.keys(IMGS).sort();
  $('i_count').textContent=keys.length;
  const c=$('i_lista');
  if(!keys.length){ c.innerHTML='<div class="empty-list">Aún no hay láminas. Añade la primera →</div>'; return; }
  c.innerHTML=keys.map(k=>`<div class="item">
      <img class="thumb" src="${esc(IMGS[k])}" onerror="this.outerHTML='<div class=\\'thumb-ic\\'>🖼️</div>'"/>
      <div class="meta"><b>${esc(k)}</b><small>fitness_imgs</small></div>
      <button class="edit" onclick="BIB.cargarImg('${esc(k)}')">Editar</button>
      <button class="del" onclick="BIB.borrarImg('${esc(k)}')">✕</button>
    </div>`).join('');
}
function cargarImg(k){
  const m=k.match(/^([a-z]+)_([a-z]+)_([a-z]+)_(\d+)_v(\d+)$/); if(!m) return;
  $('i_grupo').value=m[1]; $('i_obj').value=m[2]; $('i_equipo').value=m[3]; $('i_nej').value=m[4]; $('i_v').value=m[5];
  tab('imgs'); iKey(); $('i_url').scrollIntoView({block:'center'});
}
function borrarImg(k){
  if(!confirm('¿Borrar la lámina '+k+'?')) return;
  db.collection('fitness_imgs').doc(k).delete().then(()=>toast('Lámina borrada')).catch(e=>toast('Error: '+e.message));
}

/* ════════ TARJETAS HUB ════════ */
function pintarHub(){
  /* poblar inputs de imágenes generales (si el campo no está enfocado) */
  [['h_hero','hero'],['h_login','login'],['h_chat','chatbox']].forEach(([id,doc])=>{
    const el=$(id); if(el && document.activeElement!==el){ el.value=(TARJ[doc]&&TARJ[doc].imgUrl)||''; }
  });
  hPrev('hero'); hPrev('login'); hPrev('chat');
  pintarNews();
  const g=$('hub_grid');
  g.innerHTML=HUB_CARDS.map(b=>{
    const t=TARJ[String(b.n)]||{};
    const img=t.imgUrl||'';
    const nom=t.nom||b.nom;
    return `<div class="hubcard">
      <div class="hc-img">
        ${img?`<img src="${esc(img)}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"/><div class="hc-ph" style="display:none">${b.ico}</div>`
             :`<div class="hc-ph">${b.ico}</div>`}
      </div>
      <div class="hc-b"><div class="nm">${esc(nom)}</div>
        <button onclick="BIB.abrirHub(${b.n})">✎ Editar</button></div>
    </div>`;
  }).join('');
}
function abrirHub(n){
  hubEdit=n;
  restaurarModal();
  const b=HUB_CARDS.find(x=>x.n===n), t=TARJ[String(n)]||{};
  $('mh_title').textContent='Tarjeta '+n+' · '+b.nom;
  $('mh_img').value=t.imgUrl||''; $('mh_nom').value=t.nom||''; $('mh_desc').value=t.desc||'';
  mhPrev();
  $('mh_img').oninput=mhPrev;
  $('modalHub').classList.add('open');
}
function mhPrev(){
  const u=$('mh_img').value.trim();
  $('mh_prev').innerHTML=u?`<img src="${esc(u)}" onerror="this.parentNode.innerHTML='<div class=\\'empty\\'>No carga</div>'"/>`:`<div class="empty">Previsualización</div>`;
}
function cerrarHub(){ $('modalHub').classList.remove('open'); hubEdit=null; restaurarModal(); }
function guardarHub(){
  if(hubEdit==null) return;
  /* noticias: guardamos solo imagen */
  if(typeof hubEdit==='string' && hubEdit.indexOf('news')===0){
    const u=normImg($('mh_img').value.trim());
    const ref=db.collection('hub_tarjetas').doc(hubEdit);
    const op = u ? ref.set({imgUrl:u,actualizado:firebase.firestore.FieldValue.serverTimestamp()},{merge:true}) : ref.delete();
    op.then(()=>{ toast('✓ Noticia guardada'); restaurarModal(); cerrarHub(); }).catch(e=>toast('Error: '+e.message));
    return;
  }
  const data={ imgUrl:normImg($('mh_img').value.trim()), nom:$('mh_nom').value.trim(), desc:$('mh_desc').value.trim(),
    actualizado: firebase.firestore.FieldValue.serverTimestamp() };
  db.collection('hub_tarjetas').doc(String(hubEdit)).set(data,{merge:true})
    .then(()=>{ toast('✓ Tarjeta '+hubEdit+' guardada'); cerrarHub(); }).catch(e=>toast('Error: '+e.message));
}
function restaurarModal(){ const o=$('mh_optional'); if(o) o.style.display=''; }
function resetHub(){
  if(hubEdit==null) return;
  db.collection('hub_tarjetas').doc(String(hubEdit)).delete()
    .then(()=>{ toast('Tarjeta '+hubEdit+' restaurada'); cerrarHub(); }).catch(e=>toast('Error: '+e.message));
}

/* ════════ MOTOR DE CORTE · M1-M7 ════════ */
function cLoad(){
  const id=$('c_mod').value, d=CORTE[id]||{};
  $('c_img').value = d.imgUrl||d.driveId||'';
  $('c_vid').value = d.videoUrl||'';
  $('c_tit').value = d.titulo||'';
  $('c_desc').value= d.desc||'';
  cPrev();
}
function cPrev(){
  const u=normImg($('c_img').value.trim());
  $('c_prev').innerHTML = u
    ? `<img src="${esc(u)}" onerror="this.parentNode.innerHTML='<div class=\'empty\'>No se pudo cargar</div>'"/>`
    : `<div class="empty">Pega una imagen para previsualizar</div>`;
}
function guardarCorte(){
  const id=$('c_mod').value;
  const img=normImg($('c_img').value.trim());
  const data={ actualizado: firebase.firestore.FieldValue.serverTimestamp() };
  if(img) data.imgUrl=img;
  const vid=$('c_vid').value.trim(); if(vid) data.videoUrl=vid;
  const tit=$('c_tit').value.trim(); if(tit) data.titulo=tit;
  const des=$('c_desc').value.trim(); if(des) data.desc=des;
  db.collection('corte_modulos').doc(id).set(data,{merge:true})
    .then(()=>toast('✓ '+id+' guardado')).catch(e=>toast('Error: '+e.message));
}
function cReset(){
  const id=$('c_mod').value;
  if(!confirm('¿Restaurar '+id+' a su contenido original?')) return;
  db.collection('corte_modulos').doc(id).delete()
    .then(()=>toast(id+' restaurado')).catch(e=>toast('Error: '+e.message));
}
function pintarCorte(){
  const ids=['M1','M2','M3','M4','M5','M6','M7'];
  const n=ids.filter(i=>CORTE[i]).length;
  $('c_count').textContent=n;
  $('c_lista').innerHTML=ids.map(id=>{
    const d=CORTE[id]; const has=!!d;
    const u=has?normImg(d.imgUrl||d.driveId||''):'';
    const thumb=u?`<img class="thumb" src="${esc(u)}" onerror="this.outerHTML='<div class=\'thumb-ic\'>✂️</div>'"/>`:`<div class="thumb-ic">✂️</div>`;
    return `<div class="item">${thumb}
      <div class="meta"><b>${id} · ${esc((d&&d.titulo)||CORTE_LBL[id])}</b><small>${has?'personalizado':'original'}</small></div>
      <button class="edit" onclick="BIB.cEdit('${id}')">Editar</button></div>`;
  }).join('');
}
function cEdit(id){ $('c_mod').value=id; tab('corte'); cLoad(); $('c_img').scrollIntoView({block:'center'}); }

/* ════════ HUB · IMÁGENES GENERALES (hero/login/chatbox) ════════ */
const SINGLE_MAP={ hero:{inp:'h_hero',box:'h_hero_prev',lbl:'Hero'},
                   login:{inp:'h_login',box:'h_login_prev',lbl:'Login'},
                   chat:{inp:'h_chat',box:'h_chat_prev',lbl:'Chat',doc:'chatbox'} };
function hPrev(which){
  const m=SINGLE_MAP[which]; if(!m) return;
  const u=normImg($(m.inp).value.trim());
  $(m.box).innerHTML = u
    ? `<img src="${esc(u)}" onerror="this.parentNode.innerHTML='<div class=\'empty\'>No carga</div>'"/>`
    : `<div class="empty">${m.lbl}</div>`;
}
function guardarSingle(doc){
  const which = doc==='chatbox' ? 'chat' : doc;
  const m=SINGLE_MAP[which]; if(!m) return;
  const u=normImg($(m.inp).value.trim());
  if(!u) return toast('Pega una imagen primero.');
  db.collection('hub_tarjetas').doc(doc).set({imgUrl:u,
    actualizado: firebase.firestore.FieldValue.serverTimestamp()},{merge:true})
    .then(()=>toast('✓ '+m.lbl+' guardado')).catch(e=>toast('Error: '+e.message));
}
function resetSingle(doc){
  const which = doc==='chatbox' ? 'chat' : doc;
  const lbl=(SINGLE_MAP[which]&&SINGLE_MAP[which].lbl)||doc;
  db.collection('hub_tarjetas').doc(doc).delete()
    .then(()=>toast(lbl+' restaurado')).catch(e=>toast('Error: '+e.message));
}

/* ════════ HUB · NOTICIAS ════════ */
/* ════════ NOTICIAS (CRUD completo) ════════ */
let notiEdit=null;   // _id de la noticia en edición (null = nueva)
function pintarNews(){
  const g=$('news_lista'); if(!g) return;
  if(!NOTI.length){ g.innerHTML='<div class="empty-list">Aún no hay noticias. Pulsa “+ Nueva noticia”. (El hub mostrará las de respaldo.)</div>'; return; }
  g.innerHTML=NOTI.map(n=>{
    const col=n.col||'#d4af37';
    return `<div class="item">
      ${n.imgUrl?`<img class="thumb" src="${esc(n.imgUrl)}" onerror="this.outerHTML='<div class=\'thumb-ic\'>📰</div>'"/>`:`<div class="thumb-ic">${n.ico||'📰'}</div>`}
      <div class="meta"><b>${esc(n.tit||'(sin título)')}</b><small style="color:${col}">${n.ico||''} ${esc(n.cat||'')} · ${esc(n.fecha||'')}</small></div>
      <button class="edit" onclick="BIB.editarNoticia('${esc(n._id)}')">Editar</button>
      <button class="del" onclick="BIB.borrarNoticiaId('${esc(n._id)}')">✕</button>
    </div>`;
  }).join('');
}
function mnPrev(){
  const u=$('mn_img').value.trim();
  $('mn_prev').innerHTML=u?`<img src="${esc(normImg(u))}" onerror="this.parentNode.innerHTML='<div class=\'empty\'>No carga</div>'"/>`:`<div class="empty">Previsualización</div>`;
}
function nuevaNoticia(){
  notiEdit=null;
  $('mn_title').textContent='Nueva noticia';
  $('mn_cat').selectedIndex=0; $('mn_fecha').value=''; $('mn_tit').value=''; $('mn_txt').value=''; $('mn_img').value='';
  $('mn_del').style.display='none';
  mnPrev(); $('mn_img').oninput=mnPrev;
  $('modalNews').classList.add('open');
}
function editarNoticia(id){
  const n=NOTI.find(x=>x._id===id); if(!n) return;
  notiEdit=id;
  $('mn_title').textContent='Editar noticia';
  // seleccionar la categoría que coincida
  const sel=$('mn_cat');
  for(let i=0;i<sel.options.length;i++){ if(sel.options[i].value.split('|')[0]===n.cat){ sel.selectedIndex=i; break; } }
  $('mn_fecha').value=n.fecha||''; $('mn_tit').value=n.tit||''; $('mn_txt').value=n.txt||''; $('mn_img').value=n.imgUrl||'';
  $('mn_del').style.display='';
  mnPrev(); $('mn_img').oninput=mnPrev;
  $('modalNews').classList.add('open');
}
function cerrarNoticia(){ $('modalNews').classList.remove('open'); notiEdit=null; }
function guardarNoticia(){
  const tit=$('mn_tit').value.trim();
  if(!tit) return toast('Falta el titular.');
  const parts=$('mn_cat').value.split('|');   // CAT|col|ico|bloque
  const data={
    cat:parts[0], col:parts[1], ico:parts[2], bloque:parseInt(parts[3])||1,
    tit, txt:$('mn_txt').value.trim(), fecha:$('mn_fecha').value.trim(),
    imgUrl:normImg($('mn_img').value.trim()),
    actualizado: firebase.firestore.FieldValue.serverTimestamp()
  };
  if(notiEdit){
    db.collection('noticias').doc(notiEdit).set(data,{merge:true})
      .then(()=>{ toast('✓ Noticia actualizada'); cerrarNoticia(); }).catch(e=>toast('Error: '+e.message));
  }else{
    data.orden=(NOTI.length?Math.max(...NOTI.map(n=>n.orden||0)):0)+1;
    db.collection('noticias').add(data)
      .then(()=>{ toast('✓ Noticia publicada'); cerrarNoticia(); }).catch(e=>toast('Error: '+e.message));
  }
}
function borrarNoticia(){ if(notiEdit) borrarNoticiaId(notiEdit); }
function borrarNoticiaId(id){
  if(!confirm('¿Borrar esta noticia?')) return;
  db.collection('noticias').doc(id).delete()
    .then(()=>{ toast('Noticia borrada'); cerrarNoticia(); }).catch(e=>toast('Error: '+e.message));
}

/* ── util ── */
let tt=null;
function toast(m){ const t=$('toast'); t.textContent=m; t.classList.add('show'); clearTimeout(tt); tt=setTimeout(()=>t.classList.remove('show'),2600); }
function esc(s){ return String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
document.addEventListener('keydown',e=>{
  if(e.key==='Enter' && $('login').style.display!=='none') login();
  if(e.key==='Escape'){ cerrarHub(); cerrarNoticia(); }
});

window.BIB={ login,logout,tab, vKey,vPreview,guardarVideo,cargarVideo,borrarVideo,
  iKey,iPreview,guardarImg,cargarImg,borrarImg,
  abrirHub,cerrarHub,guardarHub,resetHub,
  cLoad,cPrev,guardarCorte,cReset,cEdit,
  hPrev,guardarSingle,resetSingle,
  nuevaNoticia,editarNoticia,cerrarNoticia,guardarNoticia,borrarNoticia,borrarNoticiaId };
})();

/* ═══════════════════════════════════════════════════════════════
   MOTOR_INVENTARIO · El cerebro del Motor Automático
   Fátima Caldea Studio · proyecto aprendisajefatima
   ────────────────────────────────────────────────────────────────
   ANTES: el motor era ciego — solo preguntaba a Firebase clave por
   clave durante el lote, nunca miraba Drive ni la galería pendiente,
   y cualquier error de lectura se convertía en "no existe" → volvía
   a llamar a la IA y a gastar crédito por contenido ya generado.

   AHORA este parche (estilo aditivo, cargado al final de
   motor_auto.html) convierte el escáner en la inteligencia del motor:

   1. INVENTARIO EN VIVO · al entrar la administradora se leen las 5
      colecciones (fitness_imgs, fitness_videos, clases_imgs,
      hub_tarjetas, corte_modulos) con onSnapshot: el motor sabe en
      todo momento qué existe, qué falta, qué está parcial y qué
      está corrupto.
   2. GALERÍA VISIBLE · lo generado que espera en la galería de
      revisión (sin subir aún) cuenta como "ya generado" (🟠): relanzar
      un lote ya NO lo vuelve a pagar.
   3. GOOGLE DRIVE · con Drive conectado, un clic escanea la carpeta
      «Fátima Caldea · Generados»; lo que ya está en Drive no se
      regenera: se recupera gratis con ♻️ (se registra el link en
      Firebase sin llamar a la IA).
   4. VERIFICACIÓN SEGURA · se reemplazan los chequeos yaExiste* por
      consultas al inventario. Si el inventario no cargó, el lote se
      DETIENE en vez de generar a ciegas (antes: error silencioso ⇒
      gastar).
   5. GUARDIÁN ECONÓMICO · toda llamada a la IA (Replicate, OpenAI,
      Stability, fal, Luma — todas pasan por genImagen/genVideo)
      registra clave + motivo en el log y en consola; si la clave ya
      existe y el motivo no es un "forzar" tuyo, la llamada se CANCELA.
   6. PASOS DEL CARRUSEL · cada clip de paso subido queda registrado
      en clases_imgs/{claseId}.pasos.paso_NN (+ pasos_total), así una
      clase a medias es 🟡 parcial y solo se generan los pasos que
      faltan — nunca el carrusel completo otra vez.

   Cargado fuera de motor_auto.html es un no-op (estilo puente).
   No cambia ningún contrato de datos: solo AÑADE campos.
   ═══════════════════════════════════════════════════════════════ */
(function(){
'use strict';
if (window._MOTOR_INVENTARIO_LOADED) return;
window._MOTOR_INVENTARIO_LOADED = true;

/* Solo tiene sentido dentro de motor_auto.html (usa sus funciones). */
if (typeof fbInit !== 'function' || typeof logLine !== 'function' || typeof genImagen !== 'function'){
  console.warn('[MOTOR_INVENTARIO] fuera de motor_auto.html · no-op');
  return;
}

/* ════════ ESTADO DEL INVENTARIO ════════ */
var INV = {
  listo: false,
  cargando: false,
  col: { fitness_imgs:{}, fitness_videos:{}, clases_imgs:{}, hub_tarjetas:{}, corte_modulos:{} },
  vistas: {},          // qué colecciones ya llegaron al menos una vez
  drive: null,         // Map(nombre_minúsculas → fileId) tras "Escanear Drive"
  pasosStorage: {},    // claseId → Set('01','02',…) tras verificar Storage
  _waiters: []
};
window.MOTOR_INV = INV;   // visible en consola para depurar

var COLECCIONES = ['fitness_imgs','fitness_videos','clases_imgs','hub_tarjetas','corte_modulos'];
function linkOk(u){ return /^https?:\/\//i.test(String(u||'').trim()); }

function invReady(){
  if (INV.listo) return Promise.resolve(true);
  return new Promise(function(res){
    INV._waiters.push(res);
    setTimeout(function(){ res(INV.listo); }, 20000);
  });
}
function marcarLista(){
  if (INV.listo) return;
  for (var i=0;i<COLECCIONES.length;i++){ if(!INV.vistas[COLECCIONES[i]]) return; }
  INV.listo = true;
  INV._waiters.forEach(function(f){ f(true); }); INV._waiters=[];
  logLine('🧠 Inventario cargado · el motor ya SABE qué existe antes de gastar.','ok');
  refrescarPanel();
}

var FST = null;
async function arrancarInventario(){
  if (INV.cargando) return; INV.cargando = true;
  try{
    await fbInit();
    FST = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
    COLECCIONES.forEach(function(nombre){
      FST.onSnapshot(FST.collection(FB.db, nombre),
        function(snap){
          var m={}; snap.forEach(function(d){ m[d.id]=d.data()||{}; });
          INV.col[nombre]=m; INV.vistas[nombre]=true;
          marcarLista(); refrescarPanel();
        },
        function(err){
          // Motivo exacto y en rojo, nunca en silencio (regla de la casa).
          logLine('❌ Inventario '+nombre+': '+(err.code||err.message)+' — sin inventario el motor NO genera.','err');
          refrescarPanel();
        });
    });
  }catch(e){
    INV.cargando=false;
    logLine('❌ No se pudo iniciar el inventario: '+(e.message||e),'err');
  }
}

/* ════════ CATÁLOGO PELUQUERÍA ════════ */
function peluDe(id){
  try{ if (typeof PELU_FLAT!=='undefined' && !PELU_FLAT.length && typeof cargarPelu==='function') cargarPelu(); }catch(_){}
  if (typeof PELU_FLAT==='undefined') return null;
  for (var i=0;i<PELU_FLAT.length;i++){ if(PELU_FLAT[i].id===id) return PELU_FLAT[i]; }
  return null;
}

/* ════════ ¿QUÉ HAY EN FIREBASE? (por tipo de clave) ════════ */
function estadoPeluVideo(id){
  var d = INV.col.clases_imgs[id];
  var c = peluDe(id);
  var total = (d && d.pasos_total) ? d.pasos_total
            : (c && c.txt && typeof pasosDeClase==='function' ? pasosDeClase(c.txt).length : 0);
  var hechos = 0;
  if (d){
    var p = d.pasos || {};
    Object.keys(p).forEach(function(k){ if(/^paso_\d\d$/.test(k) && linkOk(p[k])) hechos++; });
  }
  var st = INV.pasosStorage[id];
  if (st) hechos = Math.max(hechos, st.size);
  if (!d && !hechos) return { global:'falta', hechos:0, total:total };
  if (d && d.url_video && linkOk(d.url_video)) return { global:'existe', hechos:hechos, total:total };
  if (total>0 && hechos>=total) return { global:'existe', hechos:hechos, total:total };
  if (hechos>0) return { global:'parcial', hechos:hechos, total:total };
  // Docs antiguos: solo videoActualizadoEn (los pasos no se registraban 1 a 1).
  // Conservador: cuenta como existente para NO regenerar carruseles ya pagados.
  if (d && d.videoActualizadoEn) return { global:'existe-legado', hechos:hechos, total:total };
  return { global:'falta', hechos:hechos, total:total };
}
function fbEstado(kind, clave){
  var C=INV.col, d=null, u=null;
  switch(kind){
    case 'fitness-img': d=C.fitness_imgs[clave];  u=d && (d.url||d.url_jpg); break;
    case 'fitness-vid': d=C.fitness_videos[clave];u=d && d.url_video; break;
    case 'pelu-img':    d=C.clases_imgs[clave];   u=d && (d.url_jpg||d.url); break;
    case 'hub':         d=C.hub_tarjetas[clave];  u=d && d.imgUrl; break;
    case 'corte':       d=C.corte_modulos[clave]; u=d && d.imgUrl; break;
    case 'pelu-vid':    return estadoPeluVideo(clave).global;
    case 'pelu-paso': {
      var pt = String(clave).split('#'); var id=pt[0], nn=String(parseInt(pt[1],10)).padStart(2,'0');
      var doc = C.clases_imgs[id] || {};
      var pas = doc.pasos || {};
      if (pas['paso_'+nn] && linkOk(pas['paso_'+nn])) return 'existe';
      var sset = INV.pasosStorage[id];
      if (sset && sset.has(nn)) return 'existe';
      return 'falta';
    }
    default: return 'falta';
  }
  if (!u) return 'falta';
  return linkOk(u) ? 'existe' : 'corrupto';
}

/* ════════ ¿QUÉ HAY EN LA GALERÍA DE REVISIÓN? (🟠 sin subir) ════════ */
function galeriaTiene(kind, clave){
  var jobs = (typeof JOBS!=='undefined' && JOBS) ? JOBS : [];
  for (var i=0;i<jobs.length;i++){
    var j=jobs[i];
    if (j.estado==='descartado') continue;
    var r=j.restore; if(!r) continue;
    switch(kind){
      case 'fitness-img': if (r.kind==='fitness-img' && (r.base+'_v'+r.v)===clave) return true; break;
      case 'fitness-vid': if (r.kind==='fitness-vid' && r.clave===clave) return true; break;
      case 'pelu-img':    if (r.kind==='pelu-img' && r.claseId===clave && r.variant==='cliente') return true; break;
      case 'pelu-vid':    if (r.kind==='pelu-vid-apoyo' && r.claseId===clave) return true; break;
      case 'pelu-paso': {
        var pt=String(clave).split('#');
        if (r.kind==='pelu-vid-paso' && r.claseId===pt[0] && (r.idx+1)===parseInt(pt[1],10)) return true;
        break;
      }
      case 'hub':   if (r.kind==='hub-img'  && r.n===clave) return true; break;
      case 'corte': if (r.kind==='corte-img'&& r.id===clave) return true; break;
    }
  }
  return false;
}

/* ════════ ¿QUÉ HAY EN GOOGLE DRIVE? (☁️ recuperable gratis) ════════ */
function nombresDrive(kind, clave){
  var c;
  switch(kind){
    case 'fitness-img': {
      var base = String(clave).replace(/_v\d+$/,'');
      return [clave+'.jpg', base+'_imagen.jpg', 'fitness_'+clave+'.jpg'];
    }
    case 'fitness-vid': return [clave+'.mp4', 'fitness_'+clave+'.mp4'];
    case 'pelu-img': c=peluDe(clave); return c ? [c.slug+'_'+clave+'_cliente.jpg', c.slug+'_'+clave+'_imagen.jpg', c.slug+'_'+clave+'_img.jpg'] : [];
    case 'pelu-vid': c=peluDe(clave); return c ? [c.slug+'_'+clave+'_video.mp4', c.slug+'_'+clave+'_vid.mp4'] : [];
    case 'pelu-paso': {
      var pt=String(clave).split('#'); c=peluDe(pt[0]);
      var nn=String(parseInt(pt[1],10)).padStart(2,'0');
      return c ? [c.slug+'_'+pt[0]+'_paso_'+nn+'.mp4'] : [];
    }
    case 'hub':   return ['hub_'+clave+'.jpg'];
    case 'corte': return ['corte_'+clave+'.jpg','corte_'+clave+'.mp4'];
    default: return [];
  }
}
function driveArchivo(kind, clave){
  if (!INV.drive) return null;
  var noms = nombresDrive(kind, clave);
  for (var i=0;i<noms.length;i++){
    var id = INV.drive.get(noms[i].toLowerCase());
    if (id) return { id:id, nombre:noms[i] };
  }
  return null;
}
async function invEscanearDrive(){
  if (typeof DRIVE==='undefined' || !DRIVE.token){
    logLine('☁️ Conecta Google Drive primero (botón «Conectar Drive» arriba) y vuelve a pulsar «Escanear Drive».','err');
    return;
  }
  try{
    logLine('☁️ Escaneando tu carpeta «Fátima Caldea · Generados»…','info');
    var folder = await driveFolder();
    var names = new Map(), pageToken = '';
    do{
      var q = encodeURIComponent("'"+folder+"' in parents and trashed=false");
      var url = 'https://www.googleapis.com/drive/v3/files?q='+q+'&fields=nextPageToken,files(id,name)&pageSize=1000'+(pageToken?('&pageToken='+pageToken):'');
      var r = await fetch(url, { headers:{ Authorization:'Bearer '+DRIVE.token } });
      if (!r.ok) throw new Error('Drive HTTP '+r.status);
      var d = await r.json();
      (d.files||[]).forEach(function(f){ names.set(String(f.name||'').toLowerCase(), f.id); });
      pageToken = d.nextPageToken || '';
    } while(pageToken);
    INV.drive = names;
    logLine('☁️ Drive escaneado: '+names.size+' archivo(s) de respaldo · lo que esté ahí NO se regenera.','ok');
    refrescarPanel();
  }catch(e){ logLine('❌ Escaneo de Drive falló: '+(e.message||e),'err'); }
}
/* Recupera de Drive SIN llamar a la IA: hace público el archivo y registra
   el link convertido en el mismo doc/campo que usaría la subida normal. */
async function invRecuperarDrive(kind, clave){
  try{
    var user = await ensureAuth(); if(!user) return;
    var f = driveArchivo(kind, clave);
    if (!f){ logLine('❌ No encontré '+clave+' en el escaneo de Drive.','err'); return; }
    try{
      await fetch('https://www.googleapis.com/drive/v3/files/'+f.id+'/permissions', {
        method:'POST',
        headers:{ Authorization:'Bearer '+DRIVE.token, 'Content-Type':'application/json' },
        body: JSON.stringify({ role:'reader', type:'anyone' })
      });
    }catch(_){}
    var esVid = /\.mp4$/i.test(f.nombre);
    var url = esVid
      ? 'https://drive.google.com/uc?export=download&id='+f.id
      : 'https://drive.google.com/thumbnail?id='+f.id+'&sz=w1400';
    var c;
    switch(kind){
      case 'fitness-img':
        await FB.setDoc(FB.doc(FB.db,'fitness_imgs',clave), { url:url, claseId:clave, cat:'fitness', imgActualizadoEn:new Date().toISOString() }, {merge:true});
        break;
      case 'fitness-vid': await regFitVideo(clave, url); break;
      case 'pelu-img': c=peluDe(clave); if(!c){ logLine('❌ Clase no encontrada: '+clave,'err'); return; } await regPeluImg(c, url); break;
      case 'pelu-vid': c=peluDe(clave); if(!c){ logLine('❌ Clase no encontrada: '+clave,'err'); return; } await regPeluVideo(c, url); break;
      case 'hub':   await regHub(clave, url); break;
      case 'corte': await regCorte(clave, url, esVid?'vid':'img'); break;
      case 'pelu-paso': {
        var pt = String(clave).split('#');
        c = peluDe(pt[0]); if(!c){ logLine('❌ Clase no encontrada: '+pt[0],'err'); return; }
        var nn = String(parseInt(pt[1],10)).padStart(2,'0');
        var patch = { pasos:{} };
        patch.pasos['paso_'+nn] = url;
        var total = (c.txt && typeof pasosDeClase==='function') ? pasosDeClase(c.txt).length : 0;
        if (total) patch.pasos_total = total;
        await FB.setDoc(FB.doc(FB.db,'clases_imgs',pt[0]), patch, {merge:true});
        break;
      }
      default: logLine('❌ Este tipo no se puede recuperar automático: '+kind,'err'); return;
    }
    logLine('♻️ '+clave+' recuperada de Drive y registrada en Firebase · 0 llamadas a la IA.','ok');
  }catch(e){ logLine('❌ Recuperar de Drive falló ('+clave+'): '+(e.message||e),'err'); }
}
window.invEscanearDrive = invEscanearDrive;
window.invRecuperarDrive = invRecuperarDrive;

/* ════════ PASOS REALES EN STORAGE (carruseles antiguos) ════════ */
async function invVerificarPasosStorage(){
  var clases = (typeof clasesPeluSeleccionadas==='function') ? clasesPeluSeleccionadas() : [];
  if (!clases.length){ logLine('Selecciona primero las categorías de la Academia que quieres verificar.','err'); return; }
  try{
    await fbInit();
    var fs = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js');
    var lote = clases.slice(0, 80);
    if (clases.length > 80) logLine('🔬 Verificando las primeras 80 de '+clases.length+' clases (filtra por categoría para el resto).','info');
    else logLine('🔬 Verificando pasos reales en Storage de '+lote.length+' clase(s)…','info');
    for (var i=0;i<lote.length;i++){
      var c = lote[i];
      try{
        var res = await fs.listAll(fs.ref(FB.storage, 'academia/'+c.slug+'/'+c.id));
        var set = new Set();
        res.items.forEach(function(it){ var m=String(it.name||'').match(/^paso_(\d\d)\.mp4$/); if(m) set.add(m[1]); });
        INV.pasosStorage[c.id] = set;
      }catch(e){ console.warn('[pasosStorage]', c.id, e); }
    }
    logLine('🔬 Storage verificado · los pasos ya subidos cuentan como existentes.','ok');
    refrescarPanel();
  }catch(e){ logLine('❌ Verificación de Storage falló: '+(e.message||e),'err'); }
}
window.invVerificarPasosStorage = invVerificarPasosStorage;

/* ════════ ESTADO FINAL DE UNA CLAVE ════════
   existe / existe-legado → 🟢 · parcial → 🟡 · galeria → 🟠
   drive → ☁️ · corrupto → ⚠️ · falta → 🔴 · desconocido (sin inventario) */
function invEstado(kind, clave){
  if (!INV.listo) return 'desconocido';
  var fb = fbEstado(kind, clave);
  if (fb==='existe' || fb==='existe-legado') return fb;
  if (galeriaTiene(kind, clave)) return 'galeria';
  var dr = driveArchivo(kind, clave);
  if (dr) return 'drive';
  return fb; // parcial | corrupto | falta
}
window.invEstado = invEstado;

/* ════════ VERIFICACIÓN SEGURA · reemplaza los yaExiste* ════════
   Antes: getDoc suelto y catch → false (error silencioso = gastar).
   Ahora: inventario en memoria; sin inventario se DETIENE el lote. */
async function chequeo(kind, clave){
  var ok = await invReady();
  if (!ok) throw new Error('🧠 El inventario no cargó: lote detenido para no generar a ciegas. Recarga la página e inicia sesión.');
  var est = invEstado(kind, clave);
  if (est==='drive')  logLine('☁️ '+clave+' ya está en tu Drive (no en Firebase) · usa ♻️ Recuperar de Drive — no hace falta regenerar.','skip');
  if (est==='galeria') logLine('🟠 '+clave+' ya está generada en tu galería de revisión · apruébala y pulsa «Subir aprobadas» — no se regenera.','skip');
  return est==='existe' || est==='existe-legado' || est==='galeria' || est==='drive';
  // 'corrupto' devuelve false a propósito: un link roto no se ve en la app,
  // regenerarlo es lo correcto (igual que lo marca el escáner).
}
yaExiste          = function(clave){ return chequeo('fitness-img', clave); };
yaExisteVideo     = function(clave){ return chequeo('fitness-vid', clave); };
yaExistePelu      = function(id){    return chequeo('pelu-img', id); };
yaExistePeluVideo = function(id){    return chequeo('pelu-vid', id); };
yaExisteHub       = function(n){     return chequeo('hub', n); };
yaExisteCorte     = function(id){    return chequeo('corte', id); };
window.yaExistePeluPaso = function(id, idx){ return chequeo('pelu-paso', id+'#'+(idx+1)); };

/* ════════ REGISTRO POR PASO · clases_imgs.pasos.paso_NN ════════ */
var _subirPeluPaso = subirPeluPaso;
subirPeluPaso = async function(clase, idx, blob){
  var url = await _subirPeluPaso(clase, idx, blob);
  try{
    var nn = String(idx+1).padStart(2,'0');
    var patch = { pasos:{} };
    patch.pasos['paso_'+nn] = url;
    var total = (clase && clase.txt && typeof pasosDeClase==='function') ? pasosDeClase(clase.txt).length : 0;
    if (total) patch.pasos_total = total;
    await FB.setDoc(FB.doc(FB.db,'clases_imgs',clase.id), patch, {merge:true});
  }catch(e){ console.warn('[inventario] no se pudo registrar el paso:', e); }
  return url;
};

/* ════════ GUARDIÁN ECONÓMICO · última puerta antes de la IA ════════ */
window.MOTOR_GUARD = {
  ctx: null,
  declarar: function(kind, clave, motivo){ this.ctx = { kind:kind, clave:clave, motivo:motivo, n:0 }; },
  _puerta: async function(tipo){
    var c = this.ctx;
    if (!c){
      logLine('🛡️ Llamada a IA sin clave declarada · permitida, pero revísala en consola.','info');
      console.warn('[MOTOR_GUARD] llamada a '+tipo+' sin contexto declarado');
      return;
    }
    c.n++;
    var est = invEstado(c.kind, c.clave);
    if (c.n===1){
      logLine('🛡️ IA '+tipo+' → '+c.clave+' · motivo: '+c.motivo+' · estado previo: '+est, 'info');
      console.log('[MOTOR_GUARD]', tipo, c.clave, 'motivo:', c.motivo, 'estado:', est);
    }
    if (c.motivo==='falta' && (est==='existe'||est==='existe-legado'||est==='galeria'||est==='drive')){
      logLine('⛔ GUARDIÁN: '+c.clave+' ya existe ('+est+') · llamada a la IA CANCELADA — crédito protegido.','err');
      throw new Error('⛔ Guardián: '+c.clave+' ya existe ('+est+'). No se llamó a la IA ni se gastó crédito.');
    }
  }
};
var _genImagen = genImagen;
genImagen = async function(prompt, opts){ await MOTOR_GUARD._puerta('imagen'); return _genImagen(prompt, opts); };
var _genVideo = genVideo;
genVideo = async function(prompt){ await MOTOR_GUARD._puerta('video'); return _genVideo(prompt); };

/* ════════ ANÁLISIS DE LA SELECCIÓN ACTUAL ════════ */
var ULT_ANALISIS = null;
var EST_ICONO = { 'existe':'🟢', 'existe-legado':'🟢', 'parcial':'🟡', 'galeria':'🟠', 'drive':'☁️', 'corrupto':'⚠️', 'falta':'🔴', 'desconocido':'⏳' };
var EST_TXT = { 'existe':'ya existe', 'existe-legado':'ya existe (registro antiguo)', 'parcial':'parcial', 'galeria':'en tu galería sin subir', 'drive':'en Drive · recuperable gratis', 'corrupto':'link corrupto · se regenerará', 'falta':'FALTA generar', 'desconocido':'inventario cargando' };

function itemsSeleccion(){
  var items = [];
  if (MODO==='fitness'){
    var combos = combosSeleccionados();
    var tipo = (document.querySelector('input[name="tipo"]:checked')||{}).value || 'img';
    if (tipo==='img'){
      var nVerEl = document.getElementById('nVer');
      var nVer = Math.min(12, Math.max(1, parseInt(nVerEl ? nVerEl.value : 3) || 3));
      combos.forEach(function(cb){
        var lista = (cb.ejercicios && cb.ejercicios.length) ? cb.ejercicios : MOTOR_PROMPTS.ejerciciosDe(cb.grupo, cb.equipo, cb.nej, cb.motor);
        for (var v=1; v<=nVer; v++){
          items.push({ kind:'fitness-img', clave:cb.claveImgBase+'_v'+v, label:cb.claveImgBase+' · versión '+v, coste:(lista.length||cb.nej) });
        }
      });
    } else {
      combos.forEach(function(cb){
        var lista = (cb.ejercicios && cb.ejercicios.length) ? cb.ejercicios : MOTOR_PROMPTS.ejerciciosDe(cb.grupo, cb.equipo, cb.nej, cb.motor);
        lista.forEach(function(nom, i){
          items.push({ kind:'fitness-vid', clave:claveClip(cb.claveImgBase, i, nom), label:cb.claveImgBase+' · '+(i+1)+'. '+nom, coste:1 });
        });
      });
    }
  } else if (MODO==='pelu'){
    var clases = clasesPeluSeleccionadas();
    var tipoP = (document.querySelector('input[name="tipoP"]:checked')||{}).value || 'img';
    clases.forEach(function(c){
      if (tipoP==='img'){
        items.push({ kind:'pelu-img', clave:c.id, label:c.id+' · '+c.titulo, coste:1 });
      } else {
        var st = estadoPeluVideo(c.id);
        items.push({ kind:'pelu-vid', clave:c.id,
          label: c.id+' · '+c.titulo + (st.total ? (' · pasos '+st.hechos+'/'+st.total) : ' · video de apoyo'),
          coste: Math.max(1, (st.total||1) - st.hechos) });
      }
    });
  } else if (MODO==='hub'){
    [].concat(HUB_CARDS, HUB_PORTADAS).forEach(function(b){
      if (SELH.has(b.n)) items.push({ kind:'hub', clave:b.n, label:'Tarjeta '+b.n+' · '+b.nom, coste:1 });
    });
  } else if (MODO==='corte'){
    Object.keys(CORTE_LBL).forEach(function(id){
      if (SELC.has(id)) items.push({ kind:'corte', clave:id, label:id+' · '+CORTE_LBL[id], coste:1 });
    });
  }
  return items;
}

function invAnalizar(){
  var res = document.getElementById('invResumen');
  var lst = document.getElementById('invLista');
  if (!res || !lst) return;
  if (!INV.listo){ res.innerHTML = '⏳ El inventario aún está cargando… (entra con tu sesión de administradora)'; return; }
  var items = itemsSeleccion();
  ULT_ANALISIS = true;
  if (!items.length){
    res.innerHTML = 'Selecciona arriba qué quieres producir (grupos, categorías, tarjetas o módulos) y vuelve a pulsar 🔍.';
    lst.innerHTML = '';
    return;
  }
  var n = {}, llamadas = 0;
  items.forEach(function(it){
    it.estado = invEstado(it.kind, it.clave);
    n[it.estado] = (n[it.estado]||0) + 1;
    if (it.estado==='falta' || it.estado==='corrupto' || it.estado==='parcial') llamadas += it.coste;
  });
  var lim = (typeof loteLimite==='function') ? loteLimite() : 0;
  var partes = [];
  if (n['existe'] || n['existe-legado']) partes.push('🟢 '+((n['existe']||0)+(n['existe-legado']||0))+' ya existen');
  if (n['parcial']) partes.push('🟡 '+n['parcial']+' parciales');
  if (n['galeria']) partes.push('🟠 '+n['galeria']+' en tu galería (súbelas, no las regeneres)');
  if (n['drive'])   partes.push('☁️ '+n['drive']+' en Drive (♻️ gratis)');
  if (n['corrupto'])partes.push('⚠️ '+n['corrupto']+' con link corrupto');
  partes.push('🔴 '+(n['falta']||0)+' faltan');
  res.innerHTML = '<b>'+items.length+' elemento(s) en tu selección:</b> '+partes.join(' · ')
    + '<br>💰 Si inicias el lote ahora se harán <b>≈ '+llamadas+' llamada(s) a la IA</b>'
    + (lim ? ' (tu tope actual: '+lim+' nuevas)' : ' (sin tope: pon un número en «Generar solo las primeras» si quieres ir por tandas)')
    + '.'
    + (INV.drive===null ? '<br>☁️ Aún no escaneaste Drive: pulsa «Escanear Drive» para descontar lo que ya tengas respaldado.' : '');
  // aviso si "Forzar regenerar" está activo en el modo actual
  var rg = (MODO==='pelu') ? document.getElementById('optRegenP') : (MODO==='fitness') ? document.getElementById('optRegen') : null;
  if (rg && rg.checked) res.innerHTML += '<br>⚠️ <b>«Forzar regenerar» está ACTIVADO</b>: se volverá a generar TODO lo seleccionado aunque exista. Desmárcalo si no era tu intención.';
  var filas = items.slice(0, 300).map(function(it){
    var extra = (it.estado==='drive')
      ? ' <button class="btn btn-ghost" style="padding:4px 10px;font-size:11px;" onclick="invRecuperarDrive(\''+it.kind+'\',\''+esc(it.clave)+'\')">♻️ Recuperar de Drive</button>'
      : '';
    return '<div class="crow"><span>'+(EST_ICONO[it.estado]||'❔')+'</span>'
      + '<span class="cid">'+esc(it.clave)+'</span>'
      + '<span class="ctit" title="'+esc(it.label)+'">'+esc(it.label)+'</span>'
      + '<span class="cst '+(it.estado==='falta'||it.estado==='corrupto'?'no':'has')+'">'+(EST_TXT[it.estado]||it.estado)+'</span>'
      + extra + '</div>';
  }).join('');
  if (items.length > 300) filas += '<div class="crow"><span class="ctit">… lista recortada a 300 filas (afina la selección para ver el resto)</span></div>';
  lst.innerHTML = '<div class="clist">'+filas+'</div>';
}
window.invAnalizar = invAnalizar;

/* ════════ 🎯 GENERAR SOLO LO QUE FALTA ════════ */
async function invGenerarFaltantes(){
  if (typeof RUNNING!=='undefined' && RUNNING){ logLine('Ya hay un lote en marcha.','err'); return; }
  if (!INV.listo){ logLine('⏳ Espera: el inventario aún está cargando.','err'); return; }
  // si no seleccionaste nada, se toma TODO el sistema activo
  if (MODO==='fitness' && !combosSeleccionados().length && typeof selTodo==='function') selTodo();
  if (MODO==='pelu' && !clasesPeluSeleccionadas().length && typeof selPeluTodo==='function') selPeluTodo();
  if (MODO==='hub' && !SELH.size && typeof selHubTodo==='function') selHubTodo();
  if (MODO==='corte' && !SELC.size && typeof selCorteTodo==='function') selCorteTodo();
  // modo seguro: omitir=✅ · forzar=❌ (en TODOS los sistemas)
  var set = function(id, val){ var el=document.getElementById(id); if(el) el.checked=val; };
  set('optSkip', true);  set('optRegen', false);
  set('optSkipP', true); set('optRegenP', false);
  set('optSkipH', true); set('optSkipC', true);
  invAnalizar();
  logLine('🎯 Generar SOLO lo que falta · omitir existentes ✅ · forzar regenerar ❌ · guardián activo.','info');
  iniciar();
}
window.invGenerarFaltantes = invGenerarFaltantes;

/* ════════ PANEL «PRODUCCIÓN INTELIGENTE» ════════ */
function chipsGlobal(){
  if (!INV.listo) return '<span class="note">⏳ Leyendo Firebase…</span>';
  try{ if (typeof PELU_FLAT!=='undefined' && !PELU_FLAT.length && typeof cargarPelu==='function') cargarPelu(); }catch(_){}
  var flat = (typeof PELU_FLAT!=='undefined') ? PELU_FLAT : [];
  var tot = flat.length, img=0, vidC=0, vidP=0;
  flat.forEach(function(c){
    var d = INV.col.clases_imgs[c.id] || {};
    if (linkOk(d.url_jpg || d.url)) img++;
    var st = estadoPeluVideo(c.id);
    if (st.global==='existe' || st.global==='existe-legado') vidC++;
    else if (st.global==='parcial') vidP++;
  });
  var laminas = Object.keys(INV.col.fitness_imgs).length;
  var clips = Object.keys(INV.col.fitness_videos).length;
  var hubOk = Object.keys(INV.col.hub_tarjetas).filter(function(k){ return linkOk((INV.col.hub_tarjetas[k]||{}).imgUrl); }).length;
  var corteOk = 0; for (var i=1;i<=7;i++){ if (linkOk((INV.col.corte_modulos['M'+i]||{}).imgUrl)) corteOk++; }
  var pill = function(t){ return '<span class="pill" style="cursor:default;">'+t+'</span>'; };
  return pill('🎓 Academia img '+img+'/'+tot)
       + pill('🎓 Academia video '+vidC+'/'+tot + (vidP ? (' · 🟡 '+vidP) : ''))
       + pill('🏋️ láminas '+laminas)
       + pill('🏋️ clips '+clips)
       + pill('🎴 hub '+hubOk)
       + pill('✂️ corte '+corteOk+'/7');
}
function montarPanel(){
  if (document.getElementById('cardInteligente')) return;
  var ancla = document.getElementById('btnGo'); if (!ancla) return;
  var cardExec = ancla.closest('.card'); if (!cardExec || !cardExec.parentNode) return;
  var div = document.createElement('div');
  div.className = 'card';
  div.id = 'cardInteligente';
  div.innerHTML =
    '<h2>🧠 Producción inteligente <span class="pill no" id="invPill" style="cursor:default;">⏳ cargando inventario…</span></h2>'
    + '<p class="h">El motor ya no está ciego: sabe qué existe en Firebase, qué espera en tu galería y qué tienes en Drive — ANTES de gastar. '
    + '🟢 ya existe · 🟡 parcial · 🟠 generada sin subir · ☁️ en Drive (recuperable gratis) · ⚠️ link roto · 🔴 falta.</p>'
    + '<div style="display:flex;gap:6px;flex-wrap:wrap;" id="invChips"></div>'
    + '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:12px;">'
    +   '<button class="btn btn-ghost" onclick="invAnalizar()">🔍 Analizar mi selección</button>'
    +   '<button class="btn btn-ghost" onclick="invEscanearDrive()">☁️ Escanear Drive</button>'
    +   '<button class="btn btn-ghost" onclick="invVerificarPasosStorage()">🔬 Verificar pasos en Storage</button>'
    +   '<button class="btn btn-go" onclick="invGenerarFaltantes()">🎯 Generar SOLO lo que falta</button>'
    + '</div>'
    + '<div class="note" id="invResumen" style="margin-top:10px;">Elige el sistema y la selección arriba, y pulsa <b>🔍 Analizar</b> para ver qué existe y qué falta antes de gastar un solo crédito.</div>'
    + '<div id="invLista" style="margin-top:10px;"></div>';
  cardExec.parentNode.insertBefore(div, cardExec);
}
var _rpT = null;
function refrescarPanel(){
  clearTimeout(_rpT);
  _rpT = setTimeout(function(){
    var pi = document.getElementById('invPill');
    if (pi){
      pi.textContent = INV.listo ? '✅ inventario en vivo' : '⏳ cargando inventario…';
      pi.className = 'pill ' + (INV.listo ? 'ok' : 'no');
      pi.style.cursor = 'default';
    }
    var ch = document.getElementById('invChips');
    if (ch) ch.innerHTML = chipsGlobal();
    if (ULT_ANALISIS) invAnalizar();
  }, 400);
}

/* ════════ ARRANQUE ════════ */
montarPanel();
fbInit().then(function(){
  var esAdmin = function(u){ return u && u.email && u.email.toLowerCase() === ADMIN_EMAIL.toLowerCase(); };
  FB.onAuth(FB.auth, function(u){ if (esAdmin(u)) arrancarInventario(); });
  if (esAdmin(FB.auth.currentUser)) arrancarInventario();
}).catch(function(e){ console.warn('[MOTOR_INVENTARIO] fbInit falló:', e); });

console.log('%c[MOTOR_INVENTARIO] cerebro del motor cargado · inventario + guardián activos', 'color:#22c55e;font-weight:700');
})();

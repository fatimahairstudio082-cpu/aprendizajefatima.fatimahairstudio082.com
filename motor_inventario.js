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
    invMsg('☁️ Primero conecta Google Drive (botón «Conectar Drive» en la tarjeta de respaldo, más arriba) y vuelve a pulsar «Escanear Drive».');
    logLine('☁️ Conecta Google Drive primero (botón «Conectar Drive» arriba) y vuelve a pulsar «Escanear Drive».','err');
    return;
  }
  try{
    invMsg('☁️ Escaneando tu carpeta de Drive…');
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
    invMsg('☁️ Drive escaneado: '+names.size+' archivo(s) · lo que esté ahí sale como ☁️ y NO se regenera.');
    logLine('☁️ Drive escaneado: '+names.size+' archivo(s) de respaldo · lo que esté ahí NO se regenera.','ok');
    refrescarPanel();
  }catch(e){ invMsg('❌ Escaneo de Drive falló: '+(e.message||e)); logLine('❌ Escaneo de Drive falló: '+(e.message||e),'err'); }
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
  if (!clases.length){
    invMsg('🔬 Este botón es para los VIDEOS de la Academia: pasa a «✂️ Peluquería», marca categorías y vuelve a pulsarlo.');
    logLine('Selecciona primero las categorías de la Academia que quieres verificar.','err');
    return;
  }
  invMsg('🔬 Verificando pasos reales en Storage…');
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
    invMsg('🔬 Storage verificado · los pasos ya subidos cuentan como existentes.');
    logLine('🔬 Storage verificado · los pasos ya subidos cuentan como existentes.','ok');
    refrescarPanel();
  }catch(e){ invMsg('❌ Verificación de Storage falló: '+(e.message||e)); logLine('❌ Verificación de Storage falló: '+(e.message||e),'err'); }
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
          items.push({ kind:'fitness-img', clave:cb.claveImgBase+'_v'+v, label:cb.claveImgBase+' · versión '+v, coste:(lista.length||cb.nej), gen:{combo:cb, v:v} });
        }
      });
    } else {
      combos.forEach(function(cb){
        var lista = (cb.ejercicios && cb.ejercicios.length) ? cb.ejercicios : MOTOR_PROMPTS.ejerciciosDe(cb.grupo, cb.equipo, cb.nej, cb.motor);
        lista.forEach(function(nom, i){
          items.push({ kind:'fitness-vid', clave:claveClip(cb.claveImgBase, i, nom), label:cb.claveImgBase+' · '+(i+1)+'. '+nom, coste:1, gen:{combo:cb, i:i, nombre:nom} });
        });
      });
    }
  } else if (MODO==='pelu'){
    var clases = clasesPeluSeleccionadas();
    var tipoP = (document.querySelector('input[name="tipoP"]:checked')||{}).value || 'img';
    clases.forEach(function(c){
      if (tipoP==='img'){
        items.push({ kind:'pelu-img', clave:c.id, label:c.id+' · '+c.titulo, coste:1, gen:{clase:c} });
      } else {
        var st = estadoPeluVideo(c.id);
        items.push({ kind:'pelu-vid', clave:c.id,
          label: c.id+' · '+c.titulo + (st.total ? (' · pasos '+st.hechos+'/'+st.total) : ' · video de apoyo'),
          coste: Math.max(1, (st.total||1) - st.hechos), gen:{clase:c} });
      }
    });
  } else if (MODO==='hub'){
    [].concat(HUB_CARDS, HUB_PORTADAS).forEach(function(b){
      if (SELH.has(b.n)) items.push({ kind:'hub', clave:b.n, label:'Tarjeta '+b.n+' · '+b.nom, coste:1, gen:{b:b} });
    });
  } else if (MODO==='corte'){
    Object.keys(CORTE_LBL).forEach(function(id){
      if (SELC.has(id)) items.push({ kind:'corte', clave:id, label:id+' · '+CORTE_LBL[id], coste:1, gen:{id:id} });
    });
  }
  return items;
}

/* ── Selección manual dentro de la lista (casillas ✔) ── */
var INV_SEL = new Set();          // claves marcadas: 'kind|clave'
var ULT_ITEMS = [];               // items del último análisis (con su .gen)
function invKey(it){ return it.kind+'|'+it.clave; }
function esPendiente(est){ return est==='falta' || est==='corrupto' || est==='parcial'; }
function invMarcar(key, on){
  if (on) INV_SEL.add(key); else INV_SEL.delete(key);
  var n = document.getElementById('invSelN'); if (n) n.textContent = INV_SEL.size;
}
function invMarcarFaltantes(on){
  ULT_ITEMS.forEach(function(it){
    if (!esPendiente(it.estado)) return;
    if (on) INV_SEL.add(invKey(it)); else INV_SEL.delete(invKey(it));
  });
  invAnalizar();
}
window.invMarcar = invMarcar;
window.invMarcarFaltantes = invMarcarFaltantes;

function invAnalizar(){
  var res = document.getElementById('invResumen');
  var lst = document.getElementById('invLista');
  if (!res || !lst) return;
  if (!INV.listo){ res.innerHTML = '⏳ El inventario aún está cargando… (entra con tu sesión de administradora)'; return; }
  var items = itemsSeleccion();
  ULT_ANALISIS = true;
  ULT_ITEMS = items;
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
  // limpiar marcas de claves que ya no están pendientes o salieron de la selección
  var vigentes = new Set();
  items.forEach(function(it){ if (esPendiente(it.estado)) vigentes.add(invKey(it)); });
  Array.from(INV_SEL).forEach(function(k){ if(!vigentes.has(k)) INV_SEL.delete(k); });

  var filas = items.slice(0, 300).map(function(it){
    var key = invKey(it);
    var chk = esPendiente(it.estado)
      ? '<input type="checkbox" onchange="invMarcar(\''+key+'\', this.checked)"'+(INV_SEL.has(key)?' checked':'')+' style="width:16px;height:16px;accent-color:#22c55e;cursor:pointer;flex:none;" title="Marcar para generar solo esta">'
      : '<span style="width:16px;flex:none;display:inline-block;"></span>';
    var extra = (it.estado==='drive')
      ? ' <button class="btn btn-ghost" style="padding:4px 10px;font-size:11px;" onclick="invRecuperarDrive(\''+it.kind+'\',\''+esc(it.clave)+'\')">♻️ Recuperar de Drive</button>'
      : '';
    return '<div class="crow">'+chk+'<span>'+(EST_ICONO[it.estado]||'❔')+'</span>'
      + '<span class="cid">'+esc(it.clave)+'</span>'
      + '<span class="ctit" title="'+esc(it.label)+'">'+esc(it.label)+'</span>'
      + '<span class="cst '+(it.estado==='falta'||it.estado==='corrupto'?'no':'has')+'">'+(EST_TXT[it.estado]||it.estado)+'</span>'
      + extra + '</div>';
  }).join('');
  if (items.length > 300) filas += '<div class="crow"><span class="ctit">… lista recortada a 300 filas (afina la selección para ver el resto)</span></div>';
  lst.innerHTML =
    '<div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:10px;">'
    + '<button class="btn btn-ghost" onclick="invMarcarFaltantes(true)">☑️ Marcar todas las pendientes</button>'
    + '<button class="btn btn-ghost" onclick="invMarcarFaltantes(false)">◻️ Quitar marcas</button>'
    + '<button class="btn btn-go" onclick="invGenerarSeleccion()">▶️ Generar las marcadas (<span id="invSelN">'+INV_SEL.size+'</span>)</button>'
    + '<span class="note">Marca ✔ solo las que TÚ quieras. El tope «generar solo las primeras N» también manda aquí.</span>'
    + '</div>'
    + '<div class="clist">'+filas+'</div>';
}
window.invAnalizar = invAnalizar;

/* ════════ 🎯 GENERAR SOLO LO QUE FALTA ════════ */
async function invGenerarFaltantes(){
  if (typeof RUNNING!=='undefined' && RUNNING){ invMsg('⏳ Ya hay un lote en marcha; espera o pulsa ⏹ Detener.'); logLine('Ya hay un lote en marcha.','err'); return; }
  if (!INV.listo){ invMsg('⏳ Espera: el inventario aún está cargando.'); logLine('⏳ Espera: el inventario aún está cargando.','err'); return; }
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
  invMsg('🎯 Lote lanzado: solo lo que falta · el avance sale en la barra y el registro negro de abajo.');
  logLine('🎯 Generar SOLO lo que falta · omitir existentes ✅ · forzar regenerar ❌ · guardián activo.','info');
  iniciar();
}
window.invGenerarFaltantes = invGenerarFaltantes;

/* ════════ ▶️ GENERAR LAS MARCADAS · selección manual fila por fila ════════
   Fátima marca ✔ las clases que quiere en la lista del análisis y este
   runner genera SOLO esas, con las mismas piezas del motor (mismos prompts,
   mismas claves, misma galería de revisión, mismo guardián y mismo tope). */
async function generarItem(it, presupuesto){
  var g = it.gen || {};
  if (presupuesto===undefined || presupuesto===null) presupuesto = Infinity;
  if (it.kind==='fitness-img'){
    var cb = g.combo, v = g.v;
    var lista = (cb.ejercicios && cb.ejercicios.length) ? cb.ejercicios : MOTOR_PROMPTS.ejerciciosDe(cb.grupo, cb.equipo, cb.nej, cb.motor);
    if (!lista.length) throw new Error(cb.claveImgBase+' sin ejercicios');
    var armar = async function(){
      var srcs = [];
      for (var i=0;i<lista.length;i++){
        if (STOP) break;
        srcs.push(await genImagen(MOTOR_PROMPTS.fitnessSingle(cb.grupo, cb.equipo, cb.motor, lista[i]), {noRef:true}));
      }
      var imgs = await Promise.all(srcs.map(loadImgSafe));
      return componerLamina(imgs, lista, cb.grupo, cb.equipo);
    };
    var blob = await armar();
    await addJob({ label:it.clave+' · lámina', blob:blob, driveName:it.clave+'.jpg', upload:function(bl){ return subirLaminaVersion(cb.claveImgBase, v, bl); }, regen:armar, restore:{kind:'fitness-img', base:cb.claveImgBase, v:v} });
    return 1;
  }
  if (it.kind==='fitness-vid'){
    var cb2 = g.combo, titulo = (g.i+1)+'. '+g.nombre;
    var genV = async function(){ return fetchToBlob(await genVideo(MOTOR_PROMPTS.fitnessVideo(cb2.grupo, cb2.equipo, cb2.motor, g.nombre))); };
    var b2 = await genV();
    await addJob({ label:'🎬 '+it.clave, blob:b2, isVideo:true, driveName:it.clave+'.mp4', upload:function(bl){ return subirVideo(it.clave, bl, titulo); }, regen:genV, restore:{kind:'fitness-vid', clave:it.clave, titulo:titulo} });
    return 1;
  }
  if (it.kind==='pelu-img'){
    var c = g.clase;
    var genI = async function(){ return fetchToBlob(await genImagen(MOTOR_PROMPTS.peluqueria(c.cat, 'cliente', c))); };
    var b3 = await genI();
    await addJob({ label:c.id+' · cliente', blob:b3, driveName:c.slug+'_'+c.id+'_cliente.jpg', upload:function(bl){ return subirPelu(c, bl, 'cliente'); }, regen:genI, restore:{kind:'pelu-img', claseId:c.id, variant:'cliente'} });
    return 1;
  }
  if (it.kind==='pelu-vid'){
    var c2 = g.clase;
    var pasos = (typeof pasosDeClase==='function') ? pasosDeClase(c2.txt) : [];
    if (!pasos.length){
      var genA = async function(){ return fetchToBlob(await genVideo(MOTOR_PROMPTS.build({cat:c2.cat, catId:c2.cat, titulo:c2.titulo}, 'vid').prompt)); };
      var b4 = await genA();
      await addJob({ label:c2.id+' · 🎬 video', blob:b4, isVideo:true, driveName:c2.slug+'_'+c2.id+'_video.mp4', upload:function(bl){ return subirPeluVideo(c2, bl); }, regen:genA, restore:{kind:'pelu-vid-apoyo', claseId:c2.id} });
      return 1;
    }
    // solo los pasos que FALTAN (los existentes se saltan solos)
    var hechos = 0;
    for (var pi=0; pi<pasos.length; pi++){
      if (STOP) break;
      if (hechos>=presupuesto){ logLine('🔢 Tope alcanzado dentro del carrusel de '+c2.id+' · el resto queda para la próxima tanda.','info'); break; }
      var estP = invEstado('pelu-paso', c2.id+'#'+(pi+1));
      if (estP==='existe' || estP==='galeria' || estP==='drive'){ logLine('⏭️ '+c2.id+' · paso '+(pi+1)+' ya existe · omitido','skip'); continue; }
      MOTOR_GUARD.declarar('pelu-paso', c2.id+'#'+(pi+1), 'falta');
      var nn = String(pi+1).padStart(2,'0');
      var genP = (function(prompt){ return async function(){ return fetchToBlob(await genVideo(prompt)); }; })(MOTOR_PROMPTS.peluqueriaPaso(c2.cat, c2.titulo, c2.niv, pasos[pi]));
      var b5 = await genP();
      await addJob({ label:c2.id+' · paso '+(pi+1)+'/'+pasos.length, blob:b5, isVideo:true, driveName:c2.slug+'_'+c2.id+'_paso_'+nn+'.mp4', upload:(function(idx){ return function(bl){ return subirPeluPaso(c2, idx, bl); }; })(pi), regen:genP, restore:{kind:'pelu-vid-paso', claseId:c2.id, idx:pi} });
      hechos++;
    }
    return hechos;
  }
  if (it.kind==='hub'){
    var b = g.b;
    var genH = async function(){ return fetchToBlob(await genImagen(HUB_PROMPT[b.n] || ('Professional elegant image about '+b.nom+', photorealistic, no text'))); };
    var b6 = await genH();
    await addJob({ label:'Hub · '+b.nom, blob:b6, driveName:'hub_'+b.n+'.jpg', upload:function(bl){ return subirHub(b.n, bl); }, regen:genH, restore:{kind:'hub-img', n:b.n} });
    return 1;
  }
  if (it.kind==='corte'){
    var id = g.id;
    var genC = async function(){ return fetchToBlob(await genImagen(CORTE_PROMPT[id])); };
    var b7 = await genC();
    await addJob({ label:id+' · '+CORTE_LBL[id], blob:b7, driveName:'corte_'+id+'.jpg', upload:function(bl){ return subirCorte(id, bl); }, regen:genC, restore:{kind:'corte-img', id:id} });
    return 1;
  }
  throw new Error('Tipo desconocido: '+it.kind);
}

async function invGenerarSeleccion(){
  if (typeof RUNNING!=='undefined' && RUNNING){ invMsg('⏳ Ya hay un lote en marcha; espera a que termine o pulsa ⏹ Detener.'); return; }
  if (!INV.listo){ invMsg('⏳ El inventario aún está cargando.'); return; }
  var sel = ULT_ITEMS.filter(function(it){ return INV_SEL.has(invKey(it)); });
  if (!sel.length){ invMsg('Marca ✔ al menos una fila pendiente de la lista y vuelve a pulsar ▶️.'); return; }
  if (!replicateKey()){ if(!confirm('No hay token de Replicate guardado. ¿El proxy ya tiene REPLICATE_API_TOKEN? Aceptar para continuar.')) return; }
  if (GEN==='auto'){ var u = await ensureAuth(); if(!u){ logLine('Sin sesión admin no se puede subir.','err'); return; } }

  RUNNING = true; STOP = false;
  var bGo=document.getElementById('btnGo'), bSt=document.getElementById('btnStop');
  if (bGo) bGo.style.display='none';
  if (bSt) bSt.style.display='inline-block';
  var limite = (typeof loteLimite==='function') ? loteLimite() : 0;
  invMsg('▶️ Generando '+sel.length+' marcada(s)'+(limite?(' · tope: '+limite+' nuevas'):'')+' — el avance sale en la barra y el registro de abajo.');
  logLine('▶️ Selección manual · '+sel.length+' elemento(s) marcados'+(limite?(' · tope: '+limite):''),'info');

  var done=0, ok=0, omit=0, err=0, generadas=0;
  for (var i=0;i<sel.length;i++){
    var it = sel[i];
    if (STOP) break;
    if (limite && generadas>=limite){ logLine('🔢 Tope alcanzado: '+limite+' nueva(s). Recarga y vuelve para las siguientes.','info'); break; }
    setProg(done, sel.length, it.clave+' ('+(done+1)+'/'+sel.length+')');
    try{
      // re-verificación al momento (por si algo cambió desde el análisis)
      var est = invEstado(it.kind, it.clave);
      if (est==='existe' || est==='existe-legado' || est==='galeria' || est==='drive'){
        logLine('⏭️ '+it.clave+' ya existe ('+est+') · omitida','skip'); omit++; done++; continue;
      }
      if (it.kind!=='pelu-vid') MOTOR_GUARD.declarar(it.kind, it.clave, 'falta'); // pelu-vid declara paso a paso
      var n = await generarItem(it, limite ? (limite - generadas) : null);
      ok++; generadas += (n||1); done++;
      INV_SEL.delete(invKey(it));
    }catch(e){ err++; done++; logLine('❌ '+it.clave+': '+(e.message||e),'err'); }
  }
  finLote(done, sel.length, ok, omit, err, 'Selección manual');
  invMsg('🏁 Selección manual terminada · ✅ '+ok+' · ⏭️ '+omit+' · ❌ '+err+(GEN==='revisar'?' — revisa la galería y pulsa «Subir aprobadas».':''));
  invAnalizar();
}
window.invGenerarSeleccion = invGenerarSeleccion;

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
       + pill('🎴 hub '+hubOk+'/9')
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
    + '<div class="note" id="invMsg" style="margin-top:8px;color:var(--gold2);min-height:14px;"></div>'
    + '<div class="note" id="invResumen" style="margin-top:6px;">Elige el sistema y la selección arriba, y pulsa <b>🔍 Analizar</b> para ver qué existe y qué falta antes de gastar un solo crédito. En la lista puedes marcar ✔ una por una y generar solo esas.</div>'
    + '<div id="invLista" style="margin-top:10px;"></div>';
  cardExec.parentNode.insertBefore(div, cardExec);
}
/* Mensajes DENTRO del panel: los avisos también van al registro de abajo,
   pero aquí quedan a la vista para que ningún botón parezca sin respuesta. */
function invMsg(txt){
  var el = document.getElementById('invMsg');
  if (el) el.textContent = txt || '';
}
window.invMsg = invMsg;

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

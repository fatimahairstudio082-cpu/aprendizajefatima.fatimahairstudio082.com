/**
 * ════════════════════════════════════════════════════════════════
 *  MOTOR HELPER · FÁTIMA CALDERA STUDIO
 *  Utilidades compartidas para acceso al motor de las 360 clases
 *  ────────────────────────────────────────────────────────────────
 *  REQUISITO: cargar ANTES los 3 archivos del motor:
 *    <script src="motor_p1_bioseg_balayage.js"></script>
 *    <script src="motor_p2_queratina_elevaciones.js"></script>
 *    <script src="motor_p3_morfologia_alertas.js"></script>
 *    <script src="motor_helper.js"></script>  ← este archivo
 *
 *  EXPONE en window:
 *    window.MOTOR        → { "🛡️ Bioseguridad": [...], ... }   (objeto agrupado)
 *    window.MOTOR_FLAT   → [{id, n, niv, cat, dur, img, ...}]   (array plano, 360 items)
 *    window.MOTOR_CATS   → ["🛡️ Bioseguridad", "✂️ Herramientas", ...] (22 categorías)
 *    window.MOTOR_BY_ID  → { "bio_p01": {clase}, ... }          (lookup rápido)
 *
 *  HELPERS:
 *    MOTOR_GET(id)       → objeto clase
 *    MOTOR_CAT(id)       → nombre categoría (ej: "🛡️ Bioseguridad")
 *    MOTOR_SLUG(cat|id)  → slug (ej: "bioseguridad")
 *    MOTOR_NIV_NAME(niv) → "Principiante" / "Intermedio" / "Avanzado" / "Masterclass"
 *    MOTOR_PATH(id,kind) → "academia/bioseguridad/bio_p01/imagen.jpg"
 *                          kind: 'img' | 'vid' | 'pdf' | 'aud'
 *
 *  PUENTE ESTUDIO ↔ ADMIN_MOTORES (localStorage):
 *    MOTOR_SET_TARGET(claseId, kind)  → escribe "fc_admin_target"
 *    MOTOR_GET_TARGET()               → lee y borra "fc_admin_target"
 *    MOTOR_QUEUE_PUSH(item)           → mete item en "fc_carpeta_queue" con metadata
 *    MOTOR_QUEUE_READ()               → lee y vacía la cola
 *
 *  Versión 1.0 · 28/MAY/2026
 * ════════════════════════════════════════════════════════════════
 */
(function(global){
  'use strict';
  if(global._MOTOR_HELPER_LOADED) return;
  global._MOTOR_HELPER_LOADED = true;

  // ── Fusionar los 3 motores ──────────────────────────────────
  const MOTOR = {};
  const FLAT = [];
  [global.CONOCIMIENTO_P1, global.CONOCIMIENTO_P2, global.CONOCIMIENTO_P3].forEach(blk=>{
    if(!blk || typeof blk !== 'object') return;
    Object.entries(blk).forEach(([cat, lista])=>{
      if(!Array.isArray(lista)) return;
      if(!MOTOR[cat]) MOTOR[cat] = [];
      lista.forEach(clase=>{
        if(!clase || !clase.id) return;
        // Anotamos la categoría dentro del objeto para tenerlo a mano
        const enriched = Object.assign({}, clase, { cat });
        MOTOR[cat].push(enriched);
        FLAT.push(enriched);
      });
    });
  });

  // Index por ID (lookup O(1))
  const BY_ID = {};
  FLAT.forEach(c => { BY_ID[c.id] = c; });

  // Lista de categorías (en orden de inserción)
  const CATS = Object.keys(MOTOR);

  // ── HELPERS ──────────────────────────────────────────────────
  const NIV_NAME = {
    p:'Principiante', i:'Intermedio', a:'Avanzado', m:'Masterclass'
  };
  const FILE_KIND = {
    img: { file:'imagen.jpg', mime:'image/jpeg' },
    vid: { file:'video.mp4',  mime:'video/mp4' },
    pdf: { file:'guion.pdf',  mime:'application/pdf' },
    aud: { file:'audio.mp3',  mime:'audio/mpeg' }
  };

  function _slug(str){
    return (str||'')
      .replace(/[^\w\s]/g,'')     // quita emojis/símbolos
      .trim()
      .toLowerCase()
      .replace(/\s+/g,'_');         // espacios → _
  }

  function MOTOR_GET(id){ return BY_ID[id] || null; }

  function MOTOR_CAT(id){
    const c = BY_ID[id];
    return c ? c.cat : null;
  }

  function MOTOR_SLUG(catOrId){
    if(!catOrId) return '';
    // ¿es un ID conocido? → uso su categoría
    const byId = BY_ID[catOrId];
    if(byId) return _slug(byId.cat);
    // si no, asumo que ya es un nombre de categoría
    return _slug(catOrId);
  }

  function MOTOR_NIV_NAME(niv){
    return NIV_NAME[niv] || niv || '';
  }

  function MOTOR_PATH(id, kind){
    const c = BY_ID[id];
    if(!c) return null;
    const k = FILE_KIND[kind];
    if(!k) return null;
    return `academia/${_slug(c.cat)}/${id}/${k.file}`;
  }

  function MOTOR_FIRESTORE_DOC(){
    // Colección donde guardamos las urls
    return 'clases_imgs';
  }

  // ── PUENTE: target (admin → módulos) ────────────────────────
  const TARGET_KEY = 'fc_admin_target';

  function MOTOR_SET_TARGET(claseId, kind /*img|vid|aud|pdf*/){
    const c = BY_ID[claseId];
    if(!c){ console.warn('[MOTOR_HELPER] claseId no encontrado:', claseId); return false; }
    const payload = {
      claseId,
      kind: kind || 'img',
      cat: c.cat,
      slug: _slug(c.cat),
      titulo: c.n || c.titulo || claseId,
      niv: c.niv || 'p',
      nivName: MOTOR_NIV_NAME(c.niv),
      targetPath: MOTOR_PATH(claseId, kind || 'img'),
      stamped: new Date().toISOString()
    };
    try{
      localStorage.setItem(TARGET_KEY, JSON.stringify(payload));
      return true;
    }catch(e){
      console.warn('[MOTOR_HELPER] no se pudo escribir target:', e);
      return false;
    }
  }

  function MOTOR_PEEK_TARGET(){
    // Lee sin borrar
    try{
      const raw = localStorage.getItem(TARGET_KEY);
      if(!raw) return null;
      return JSON.parse(raw);
    }catch(e){ return null; }
  }

  function MOTOR_GET_TARGET(){
    // Lee Y borra (consumir)
    const t = MOTOR_PEEK_TARGET();
    try{ localStorage.removeItem(TARGET_KEY); }catch(e){}
    return t;
  }

  function MOTOR_CLEAR_TARGET(){
    try{ localStorage.removeItem(TARGET_KEY); }catch(e){}
  }

  // ── PUENTE: cola M1/M2/M3 → M4 ─────────────────────────────
  const QUEUE_KEY = 'fc_carpeta_queue';

  function MOTOR_QUEUE_PUSH(item){
    // item: { tipo:'img'|'vid'|'aud'|'pdf', dataUrl, label, fecha, size, ... }
    // Si la clase está en el target, mezclamos su metadata
    const target = MOTOR_PEEK_TARGET();
    let queue;
    try{ queue = JSON.parse(localStorage.getItem(QUEUE_KEY)||'[]'); }
    catch(e){ queue = []; }
    const enriched = Object.assign({}, item);
    if(target && target.claseId){
      enriched.claseId    = target.claseId;
      enriched.cat        = target.cat;
      enriched.slug       = target.slug;
      enriched.niv        = target.niv;
      enriched.titulo     = target.titulo;
      // Si el tipo del item coincide con el target, usamos la ruta
      const itemKind = item.tipo; // 'img' | 'vid' | 'aud' | 'pdf'
      enriched.targetPath = MOTOR_PATH(target.claseId, itemKind) || target.targetPath;
      // Renombramos el label con un nombre limpio
      const k = FILE_KIND[itemKind];
      enriched.label = (item.label && item.label.indexOf(target.claseId) >= 0)
        ? item.label
        : `${target.claseId}_${k ? k.file : (item.label||'archivo')}`;
    }
    queue.push(enriched);
    try{ localStorage.setItem(QUEUE_KEY, JSON.stringify(queue)); }
    catch(e){
      // probablemente quota — limpiamos los más viejos
      console.warn('[MOTOR_HELPER] cola llena, eliminando antiguos');
      const halved = queue.slice(-Math.max(1, Math.floor(queue.length/2)));
      try{ localStorage.setItem(QUEUE_KEY, JSON.stringify(halved)); }catch(_){}
    }
    return enriched;
  }

  function MOTOR_QUEUE_READ(){
    try{
      const raw = localStorage.getItem(QUEUE_KEY);
      if(!raw) return [];
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    }catch(e){ return []; }
  }

  function MOTOR_QUEUE_CONSUME(){
    const arr = MOTOR_QUEUE_READ();
    try{ localStorage.removeItem(QUEUE_KEY); }catch(e){}
    return arr;
  }

  // ── EXPONER en window ──────────────────────────────────────
  global.MOTOR        = MOTOR;
  global.MOTOR_FLAT   = FLAT;
  global.MOTOR_CATS   = CATS;
  global.MOTOR_BY_ID  = BY_ID;

  global.MOTOR_GET            = MOTOR_GET;
  global.MOTOR_CAT            = MOTOR_CAT;
  global.MOTOR_SLUG           = MOTOR_SLUG;
  global.MOTOR_NIV_NAME       = MOTOR_NIV_NAME;
  global.MOTOR_PATH           = MOTOR_PATH;
  global.MOTOR_FIRESTORE_DOC  = MOTOR_FIRESTORE_DOC;

  global.MOTOR_SET_TARGET   = MOTOR_SET_TARGET;
  global.MOTOR_PEEK_TARGET  = MOTOR_PEEK_TARGET;
  global.MOTOR_GET_TARGET   = MOTOR_GET_TARGET;
  global.MOTOR_CLEAR_TARGET = MOTOR_CLEAR_TARGET;

  global.MOTOR_QUEUE_PUSH    = MOTOR_QUEUE_PUSH;
  global.MOTOR_QUEUE_READ    = MOTOR_QUEUE_READ;
  global.MOTOR_QUEUE_CONSUME = MOTOR_QUEUE_CONSUME;

  // Log de carga (para debug)
  console.log(
    `%c[MOTOR_HELPER] ✅ Cargado · ${CATS.length} categorías · ${FLAT.length} clases · ${Object.keys(BY_ID).length} IDs únicos`,
    'color:#c9a84c;font-weight:700'
  );
})(typeof window !== 'undefined' ? window : globalThis);

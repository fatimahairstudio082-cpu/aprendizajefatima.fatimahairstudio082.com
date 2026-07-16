/* ════════════════════════════════════════════════════════════════
   ACADEMIA_DRIVE_FIX · La Academia lee los links de Drive
   Fátima Caldea Studio · parche aditivo · NO modifica app.js ni motores
   ----------------------------------------------------------------
   Se carga con UNA etiqueta en bloque3_academia_pagos.html,
   justo DESPUÉS de academia_carrusel_pasos.js:
       <script src="academia_drive_fix.js"></script>

   Qué hace:
     La Academia hoy solo ve imágenes/videos guardados en Firebase
     Storage (época Firebase). Este puente lee UNA vez la colección
     clases_imgs de Firestore (la misma que ya usa tu biblioteca
     admin_motores) y le entrega al visor los links de Drive:
       · imagen  → campo url_jpg / url   (thumbnail de Drive)
       · video   → campo url_video       (convertido a /preview,
                    que el reproductor iframe YA existente sabe abrir)
     Si una clase NO tiene link en Firestore, todo se comporta
     EXACTAMENTE igual que hoy (Storage → respaldo). Cubre las dos
     épocas a la vez, sin tocar reproductores ni carrusel.

   Qué NO toca:
     app.js, motores P1/P2/P3, carrusel de pasos, créditos, login,
     localStorage, IDs, reglas. Solo envuelve 2 funciones del
     FirebaseMediaLoader guardando las originales como respaldo.

   CORRECCIÓN (aditiva · no cambia nada de lo anterior):
     Antes, cargarMapa() leía clases_imgs INMEDIATAMENTE al cargar el
     script, sin comprobar si ya había sesión de la alumna. La regla
     de Firestore exige sesión para leer esa colección
     (allow read: if logueado()), así que la lectura salía SIEMPRE
     "permission-denied" y el puente quedaba apagado en cada carga
     (fatima_hub.html avisa "usuarioLogueado" recién a los 900ms,
     y este archivo nunca escuchaba ese aviso). Ahora se espera a que
     Firebase Auth resuelva la sesión (mismo patrón ya usado y
     probado en bloque5_fitness.html) antes de intentar leer.
   ════════════════════════════════════════════════════════════════ */
(function(){
  'use strict';
  if (window.__academiaDriveFix) return;

  var CFG = {apiKey:"AIzaSyCcvwC7NYFgXl74YTF8ouzu32SFwB559dw",authDomain:"aprendisajefatima.firebaseapp.com",projectId:"aprendisajefatima",storageBucket:"aprendisajefatima.firebasestorage.app",messagingSenderId:"744176967394",appId:"1:744176967394:web:743b7c2a455e1e6ba7c8bb"};
  var MAP = null;        // claseId → {img, vid, pasos, pasos_total} · null = aún cargando
  var PENDING = [];      // imágenes pedidas antes de que llegue el mapa

  // AMPLIACIÓN (aditiva): el mapa completo se publica en window.ACADEMIA_MAP
  // para que el carrusel de pasos LEA los enlaces registrados en
  // clases_imgs.pasos (misma fuente de verdad que usa fitness) en vez de
  // adivinar rutas en Storage. ACADEMIA_MAP_READY resuelve cuando el mapa
  // terminó de cargar (con sesión o sin ella).
  var _mapListo;
  window.ACADEMIA_MAP_READY = new Promise(function(res){ _mapListo = res; });
  function publicarMapa(){
    window.ACADEMIA_MAP = MAP || {};
    try{ _mapListo(window.ACADEMIA_MAP); }catch(_){}
  }

  // Drive video → formato /preview (el iframe de tu reproductor lo abre solo)
  function toPreview(u){
    u = String(u||'');
    if (u.indexOf('drive.google') < 0) return u;          // Storage u otros: tal cual
    var m = u.match(/[-\w]{25,}/);
    return m ? ('https://drive.google.com/file/d/' + m[0] + '/preview') : u;
  }

  function aplicar(){
    var L = window.FirebaseMediaLoader;
    if (!L || typeof L.cargarImagen !== 'function') return false;

    var _img = L.cargarImagen.bind(L);
    var _vid = L.resolverVideo.bind(L);

    L.cargarImagen = function(catSlug, claseId, fallbackImg, imgEl){
      if (!imgEl) return;
      var d = MAP && MAP[claseId];
      if (d && d.img){
        imgEl.onerror = function(){ imgEl.onerror = null; _img(catSlug, claseId, fallbackImg, imgEl); };
        imgEl.src = d.img;
        return;
      }
      if (MAP === null) PENDING.push({catSlug:catSlug, claseId:claseId, fallbackImg:fallbackImg, imgEl:imgEl});
      _img(catSlug, claseId, fallbackImg, imgEl);          // mientras tanto, lo de siempre
    };

    L.resolverVideo = async function(catSlug, claseId, videoUrlManual){
      if (videoUrlManual && String(videoUrlManual).trim()) return _vid(catSlug, claseId, videoUrlManual); // manual manda, como hoy
      var d = MAP && MAP[claseId];
      if (d && d.vid) return toPreview(d.vid);             // link de Drive → visor iframe
      return _vid(catSlug, claseId, videoUrlManual);       // época Firebase → igual que hoy
    };

    window.__academiaDriveFix = true;
    return true;
  }

  async function cargarMapa(){
    try{
      var appM  = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js');
      var authM = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js');
      var fsM   = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
      var app  = appM.getApps().length ? appM.getApp() : appM.initializeApp(CFG);
      var auth = authM.getAuth(app);
      var db   = fsM.getFirestore(app);

      // ESPERA DE SESIÓN (mismo patrón ya probado en bloque5_fitness.html):
      // clases_imgs exige "allow read: if logueado()". Firebase Auth
      // restaura la sesión de forma asíncrona; si se lee antes de que
      // termine, la lectura sale "permission-denied" SIEMPRE, sin
      // importar qué tan rápida sea la red. Por eso esperamos UNA vez
      // a que Auth resuelva (con sesión o sin ella) antes de leer.
      var user = await new Promise(function(resolve){
        var unsub = authM.onAuthStateChanged(auth, function(u){
          unsub();
          resolve(u);
        });
      });

      if (!user){
        // Sin sesión no hay forma de leer clases_imgs (regla: logueado()).
        // No se intenta una lectura que sabemos que va a fallar: se cae
        // al comportamiento de siempre (Storage → respaldo), igual que
        // si esta clase no tuviera registro en Firestore.
        MAP = {};
        publicarMapa();
        console.warn('[academia_drive_fix] ⚠️ sin sesión activa todavía · clases_imgs no se pudo leer (la Academia sigue normal)');
        return;
      }

      var snap = await fsM.getDocs(fsM.collection(db,'clases_imgs'));
      var m = {};
      snap.forEach(function(doc){
        var d = doc.data() || {};
        m[doc.id] = { img: d.url_jpg || d.url || '', vid: d.url_video || '',
                      pasos: d.pasos || null, pasos_total: d.pasos_total || 0 };
      });
      MAP = m;
      publicarMapa();
      // re-aplicar a las imágenes que se pidieron antes de tener el mapa
      PENDING.forEach(function(p){
        var d = MAP[p.claseId];
        if (d && d.img && p.imgEl){
          p.imgEl.onerror = null;
          p.imgEl.src = d.img;
        }
      });
      PENDING = [];
      // ── ALCANCE AMPLIADO · imagen real también en ficha, impresión y galería ──
      // Pone la imagen registrada en el catálogo (c.img). Es idempotente y
      // se re-aplica una vez por si el catálogo se reconstruye tarde.
      function pintarCatalogo(){
        (window.FLAT || []).forEach(function(c){
          var d = MAP[c.id];
          if (d && d.img && c.img !== d.img) c.img = d.img;
        });
      }
      pintarCatalogo();
      setTimeout(pintarCatalogo, 2000);
      console.log('[academia_drive_fix] ✅ puente activo · ' + Object.keys(m).length + ' clase(s) con registro en clases_imgs');
    }catch(e){
      MAP = {};  // sin mapa → todo sigue como hoy, sin romper nada
      publicarMapa();
      console.warn('[academia_drive_fix] ⚠️ no se pudo leer clases_imgs (la Academia sigue normal):', e && (e.message||e));
    }
  }

  // El loader vive en motor_p1 (cargado antes); reintenta por si acaso.
  if (!aplicar()){
    var n = 0, t = setInterval(function(){ if (aplicar() || ++n > 40) clearInterval(t); }, 250);
  }
  cargarMapa();
})();

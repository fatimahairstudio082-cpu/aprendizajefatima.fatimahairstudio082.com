/* ════════════════════════════════════════════════════════════════
   PELU_DRIVE_FIX · Academia → Google Drive «solo el link»
   Fátima Caldea Studio · parche aditivo · NO toca motor_auto.html
   ----------------------------------------------------------------
   Se carga con UNA etiqueta al final de motor_auto.html,
   justo DESPUÉS de drive_fix.js:
       <script src="pelu_drive_fix.js"></script>

   Qué hace:
     Le da a PELUQUERÍA/ACADEMIA la misma rama que ya tiene FITNESS:
     · Botón «🔥 Firebase»        → todo sigue IGUAL que siempre (no toca nada).
     · Botón «🔗 Drive · solo el link» → la imagen/video de academia se sube
       a tu Google Drive (carpeta «Fátima Caldea · Generados») y en Firebase
       queda SOLO el enlace, en clases_imgs/{claseId} (los mismos campos
       url_jpg / url / url_video que la Academia ya lee). Storage no se usa.
     · Si eliges Drive pero Drive NO está conectado: avisa y NO guarda
       nada en silencio (misma protección que fitness).

   Qué NO hace:
     No borra ni reescribe las funciones originales (quedan guardadas y
     se usan tal cual en modo Firebase). No toca créditos, login, ni
     ninguna otra parte del motor.
   ════════════════════════════════════════════════════════════════ */
(function(){
  function aplicar(){
    if (typeof DRIVE==='undefined' || typeof logLine!=='function' ||
        typeof window.subirPelu!=='function' || typeof window.driveUploadPublic!=='function' ||
        typeof FB==='undefined') return false;
    if (window.__peluDriveFix) return true;

    // originales intactos (modo Firebase los sigue usando)
    var _subirPelu      = window.subirPelu;
    var _subirPeluVideo = window.subirPeluVideo;
    var _subirPeluPaso  = window.subirPeluPaso;

    function modoDrive(){ return window.GEN_DEST==='drive'; }
    function exigirDrive(){
      if(!DRIVE.token) throw new Error('Elegiste "Drive · solo el link" pero Google Drive NO está conectado (la conexión se pierde al recargar la página). Pulsa "Conectar Drive" arriba y reintenta. NADA se guardó.');
    }

    // ── IMAGEN de academia → Drive + link en clases_imgs (mismos campos) ──
    window.subirPelu = async function(clase, blob, variant){
      if(!modoDrive()) return _subirPelu(clase, blob, variant);
      exigirDrive();
      variant = variant || 'cliente';
      var nombre = clase.slug+'_'+clase.id+'_'+(variant==='cliente'?'imagen':variant)+'.jpg';
      var url = await window.driveUploadPublic(blob, nombre, false);
      var patch = { claseId:clase.id, cat:clase.cat, niv:clase.niv, imgActualizadoEn:new Date().toISOString() };
      if(variant==='cliente'){ patch.url_jpg=url; patch.url=url; }
      else { patch['url_'+variant]=url; }
      await FB.setDoc(FB.doc(FB.db,'clases_imgs',clase.id), patch, {merge:true});
      logLine('🔗 '+clase.id+' · '+variant+' → Drive + link en clases_imgs','ok');
      return url;
    };

    // ── VIDEO de academia → Drive + link en clases_imgs.url_video ──
    window.subirPeluVideo = async function(clase, blob){
      if(!modoDrive()) return _subirPeluVideo(clase, blob);
      exigirDrive();
      var url = await window.driveUploadPublic(blob, clase.slug+'_'+clase.id+'_video.mp4', true);
      await FB.setDoc(FB.doc(FB.db,'clases_imgs',clase.id),
        { claseId:clase.id, cat:clase.cat, niv:clase.niv, url_video:url,
          videoActualizadoEn:new Date().toISOString() }, {merge:true});
      logLine('🔗 '+clase.id+' · 🎬 video → Drive + link en clases_imgs','ok');
      return url;
    };

    // ── VIDEO por PASOS → Drive; en Firebase solo el sello de fecha
    //    (idéntico a lo que hoy guarda el original; el link queda en tu
    //    Drive y se muestra aquí en el registro para copiarlo si lo quieres) ──
    window.subirPeluPaso = async function(clase, idx, blob){
      if(!modoDrive()) return _subirPeluPaso(clase, idx, blob);
      exigirDrive();
      var nn=String(idx+1).padStart(2,'0');
      var url = await window.driveUploadPublic(blob, clase.slug+'_'+clase.id+'_paso_'+nn+'.mp4', true);
      await FB.setDoc(FB.doc(FB.db,'clases_imgs',clase.id),
        { claseId:clase.id, cat:clase.cat, niv:clase.niv,
          videoActualizadoEn:new Date().toISOString() }, {merge:true});
      logLine('🔗 '+clase.id+' · paso '+nn+' → Drive: '+url,'ok');
      return url;
    };

    window.__peluDriveFix = true;
    logLine('🩹 Parche PELU→DRIVE activo: con «Drive · solo el link», la academia sube a Drive y guarda solo el enlace (Storage no se toca).','ok');
    return true;
  }

  // Aplica ahora; si el motor aún no cargó, reintenta hasta que esté listo.
  if(!aplicar()){
    var n=0, t=setInterval(function(){ if(aplicar() || ++n>40) clearInterval(t); }, 250);
    window.addEventListener('load', aplicar);
  }
})();

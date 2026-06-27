/* ════════════════════════════════════════════════════════════════
   DRIVE_FIX · Parche de subida a Google Drive · Fátima Caldea Studio
   ----------------------------------------------------------------
   NO toca motor_auto.html. Se carga aparte con UNA etiqueta:
       <script src="drive_fix.js"></script>
   colocada AL FINAL del motor_auto.html, justo ANTES de </body>
   (después del script grande del motor).

   Qué hace (sin borrar nada del original, solo lo mejora):
     1) Si la carpeta "Fátima Caldea · Generados" da 403/404,
        guarda el archivo en la RAÍZ de tu Drive (no se detiene).
     2) Si Drive sigue dando 403 por permiso incompleto, vuelve a
        pedir el permiso COMPLETO (sale la ventana de Google) y
        reintenta la subida solo, una vez.
     3) Si aun así falla, muestra el MOTIVO EXACTO que dice Google
        (para saber si es la API desactivada, falta de permiso o
        Drive sin espacio).

   IMPORTANTE: si TODOS los Drive dan 403 (incluso leer la carpeta),
   casi siempre es que falta ACTIVAR la "Google Drive API" en
   console.cloud.google.com → tu proyecto → Habilitar. Este parche
   te lo dirá en el mensaje de error.
   ════════════════════════════════════════════════════════════════ */
(function(){
  function aplicar(){
    if (typeof DRIVE === 'undefined' || typeof logLine !== 'function') return false;

    // ── conectar Drive con opción de FORZAR permiso completo + promesa ──
    window.conectarDrive = function(forzar){
      var cid = (typeof driveClientId === 'function') ? driveClientId() : (localStorage.getItem('fc_drive_client_id')||'');
      if(!cid){ logLine('Pega tu Client ID de Google OAuth primero.','err'); return; }
      if(!window.google||!google.accounts||!google.accounts.oauth2){ logLine('Google Identity aún no carga; reintenta en un momento.','err'); return; }
      DRIVE.tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: cid,
        scope: 'https://www.googleapis.com/auth/drive.file',
        callback: function(resp){
          if(resp && resp.access_token){
            DRIVE.token = resp.access_token; DRIVE.folderId = null;
            if(typeof renderDrive==='function') renderDrive();
            logLine('✅ Google Drive conectado'+(forzar?' (permiso completo de escritura)':''),'ok');
            if(DRIVE._resolve){ DRIVE._resolve(resp.access_token); DRIVE._resolve=null; }
          } else {
            logLine('❌ No se obtuvo permiso de Drive','err');
            if(DRIVE._resolve){ DRIVE._resolve(null); DRIVE._resolve=null; }
          }
        }
      });
      DRIVE.tokenClient.requestAccessToken({ prompt: forzar ? 'consent' : '' });
    };

    window.repedirPermisoDrive = function(){
      return new Promise(function(resolve){ DRIVE._resolve = resolve; window.conectarDrive(true); });
    };

    // ── carpeta robusta: si falla, devuelve null → se guarda en la raíz ──
    window.driveFolder = async function(){
      if(DRIVE.folderId) return DRIVE.folderId;
      try{
        var q = encodeURIComponent("name='Fátima Caldea · Generados' and mimeType='application/vnd.google-apps.folder' and trashed=false");
        var r = await fetch('https://www.googleapis.com/drive/v3/files?q='+q+'&fields=files(id)',{headers:{Authorization:'Bearer '+DRIVE.token}});
        if(r.ok){ var d=await r.json(); if(d.files&&d.files.length){ DRIVE.folderId=d.files[0].id; return DRIVE.folderId; } }
        var cr = await fetch('https://www.googleapis.com/drive/v3/files',{method:'POST',headers:{Authorization:'Bearer '+DRIVE.token,'Content-Type':'application/json'},body:JSON.stringify({name:'Fátima Caldea · Generados',mimeType:'application/vnd.google-apps.folder'})});
        if(cr.ok){ var cd=await cr.json(); DRIVE.folderId=cd.id; return DRIVE.folderId; }
      }catch(_){}
      return null;
    };

    // ── una subida (devuelve estado + motivo real de Google) ──
    window.driveUploadOnce = async function(blob, nombre, folder){
      var meta = folder ? {name:nombre, parents:[folder]} : {name:nombre};
      var fd = new FormData();
      fd.append('metadata', new Blob([JSON.stringify(meta)],{type:'application/json'}));
      fd.append('file', blob);
      var up = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id',{method:'POST',headers:{Authorization:'Bearer '+DRIVE.token},body:fd});
      var body=null; try{ body=await up.json(); }catch(_){}
      return { ok:up.ok, status:up.status, id:body&&body.id, reason:(body&&body.error&&(body.error.message||(body.error.errors&&body.error.errors[0]&&body.error.errors[0].message)))||'' };
    };

    // ── subida con las 3 defensas en cadena ──
    window.driveUploadPublic = async function(blob, nombre, isVideo){
      if(!DRIVE.token) throw new Error('Conecta Google Drive primero.');
      var folder = await window.driveFolder();
      var res = await window.driveUploadOnce(blob, nombre, folder);

      // 1) la carpeta da 403/404 → guardar en la raíz
      if(!res.ok && folder && (res.status===403 || res.status===404)){
        logLine('   ↳ ⚠️ La carpeta dio '+res.status+'; guardo en la raíz de tu Drive en su lugar.','skip');
        DRIVE.folderId=null; folder=null;
        res = await window.driveUploadOnce(blob, nombre, null);
      }
      // 2) sigue 403 → re-pedir permiso COMPLETO y reintentar una vez
      if(!res.ok && res.status===403 && !DRIVE._reintentado){
        DRIVE._reintentado = true;
        logLine('   ↳ 🔑 Drive pide permiso de nuevo (completo). Acepta la ventana de Google…','skip');
        var tok = await window.repedirPermisoDrive();
        if(tok){ res = await window.driveUploadOnce(blob, nombre, null); }
      }
      // 3) mostrar el motivo exacto
      if(!res.ok){
        var extra = res.reason ? (' · '+res.reason) : '';
        if(res.status===403) throw new Error('Drive 403'+extra+' — revisa en console.cloud.google.com: (1) que la "Google Drive API" esté ACTIVADA en tu proyecto, (2) que tu correo esté como "usuario de prueba" en la pantalla de consentimiento, (3) que tu Drive tenga espacio.');
        throw new Error('Drive subida HTTP '+res.status+extra);
      }

      var id = res.id;
      if(!id) throw new Error('Drive no devolvió ID');
      // hacer público (lectura por enlace) para que el sistema lo muestre
      try{
        await fetch('https://www.googleapis.com/drive/v3/files/'+id+'/permissions',{method:'POST',headers:{Authorization:'Bearer '+DRIVE.token,'Content-Type':'application/json'},body:JSON.stringify({role:'reader',type:'anyone'})});
      }catch(_){}
      return isVideo
        ? 'https://drive.google.com/uc?export=download&id='+id
        : 'https://drive.google.com/thumbnail?id='+id+'&sz=w1400';
    };

    logLine('🔧 Parche de Drive activo: reintento de permiso + guardado en raíz + motivo real del error.','ok');
    return true;
  }

  // Aplica ahora; si el motor aún no cargó, reintenta hasta que esté listo.
  if(!aplicar()){
    var n=0, t=setInterval(function(){ if(aplicar() || ++n>40) clearInterval(t); }, 250);
    window.addEventListener('load', aplicar);
  }
})();

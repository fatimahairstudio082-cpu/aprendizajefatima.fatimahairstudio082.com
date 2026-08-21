/* ════════════════════════════════════════════════════════════════
   bloque5_lamina_local.js — PARCHE ADITIVO (no borra nada del sistema)
   Propuesta 1 de la skill "analizar-evolucionar-bloques":
     1) LÁMINA SIEMPRE VISIBLE · sin coste externo:
        cuando NO hay imagen en fitness_imgs (o su URL falla), en vez del
        placeholder "sube la lámina", dibuja en el navegador (canvas) una
        lámina técnica determinista con los ejercicios de esa combinación.
        Cero llamadas a APIs de pago — todo local.
     2) Explica "1RM" con un tooltip.
     3) Valida valores absurdos ANTES de generar (y antes de gastar créditos).
   Cargado suelto (sin la página) es un no-op: si faltan los globales del
   bloque, no hace nada y no rompe.
   ════════════════════════════════════════════════════════════════ */
(function(){
  'use strict';
  if (window._FIT_LAMINA_LOCAL_LOADED) return;   // idempotente
  window._FIT_LAMINA_LOCAL_LOADED = true;

  var GRUPO_NOMBRE  = { gluteo:'GLÚTEOS', pierna:'PIERNAS', superior:'TREN SUPERIOR' };
  var EQUIPO_NOMBRE = { maquina:'MÁQUINAS', mancuerna:'PESO LIBRE', corporal:'PESO CORPORAL' };
  var MOTOR_NOMBRE  = { masa:'GANAR MASA', perder:'PERDER GRASA', mantener:'MANTENER PESO' };
  var COLOR         = { gluteo:'#ef4444', pierna:'#3b82f6', superior:'#10b981' };
  var ICONO         = { gluteo:'🍑', pierna:'🦵', superior:'💪' };
  var FUENTE = "Barlow Condensed, 'Arial Narrow', Arial, sans-serif";

  /* Nombre de archivo: grupo_obj_equipo_nEjer_vN.jpg  (ver _generar del bloque). */
  function parseNombre(nombre){
    var base = String(nombre||'').replace(/\.(jpg|jpeg|png|webp)$/i,'');
    var p = base.split('_');
    if(p.length < 4) return null;
    return { grupo:p[0], obj:p[1], equipo:p[2], nEjer:p[3] };
  }

  /* Lista de ejercicios de la combinación, reusando EJERCICIOS_DB del bloque.
     Ojo: EJERCICIOS_DB se declara con `const` → vive en el ámbito global léxico,
     NO en window. Se referencia por nombre con guard typeof (window.EJERCICIOS_DB
     sería undefined). */
  function listaEjercicios(x){
    try{
      var db = (typeof EJERCICIOS_DB !== 'undefined') ? EJERCICIOS_DB : null;
      var l = db && db[x.grupo] && db[x.grupo][x.obj] && db[x.grupo][x.obj][x.equipo] && db[x.grupo][x.obj][x.equipo][x.nEjer];
      return Array.isArray(l) ? l : null;
    }catch(e){ return null; }
  }

  /* Dibuja la lámina en canvas y devuelve un dataURL (o null si no se puede). */
  function dibujarLamina(x){
    var ejer = listaEjercicios(x);
    if(!ejer || !ejer.length) return null;
    try{
      var accent   = COLOR[x.grupo] || '#3b82f6';
      var icono    = ICONO[x.grupo] || '🏋️';
      var grupoNom = GRUPO_NOMBRE[x.grupo]  || String(x.grupo||'').toUpperCase();
      var equipoNom= EQUIPO_NOMBRE[x.equipo]|| String(x.equipo||'').toUpperCase();
      var motorNom = MOTOR_NOMBRE[x.obj]    || String(x.obj||'').toUpperCase();

      var n = ejer.length;
      var cols = 2;
      var rows = Math.ceil(n/cols);
      var W = 800, PAD = 24, GAP = 12;
      var HEADER_H = 132, FOOTER_H = 70;
      var cellH = 78;
      var gridH = rows*cellH + (rows-1)*GAP;
      var H = HEADER_H + gridH + FOOTER_H + PAD*2;

      var c = document.createElement('canvas');
      c.width = W; c.height = H;
      var ctx = c.getContext('2d');

      // Fondo
      ctx.fillStyle = '#060c18'; ctx.fillRect(0,0,W,H);

      // Header
      ctx.fillStyle = '#0a1120'; ctx.fillRect(0,0,W,HEADER_H);
      ctx.fillStyle = accent;    ctx.fillRect(0,HEADER_H-5,W,5);
      ctx.textAlign = 'center';
      ctx.font = '900 46px '+FUENTE; ctx.fillStyle = '#ffffff';
      ctx.fillText(icono+'  LÁMINA TÉCNICA', W/2, 52);
      ctx.font = '700 30px '+FUENTE; ctx.fillStyle = accent;
      ctx.fillText(grupoNom+' · '+equipoNom, W/2, 90);
      ctx.font = '400 20px '+FUENTE; ctx.fillStyle = '#64748b';
      ctx.fillText('MOTOR: '+motorNom+'  ·  '+n+' EJERCICIOS  ·  ACADEMIA FÁTIMA CALDEA', W/2, 118);

      // Rejilla de ejercicios
      var gridY = HEADER_H + PAD;
      var cellW = (W - PAD*2 - GAP*(cols-1)) / cols;
      for(var i=0;i<n;i++){
        var col = i % cols, row = Math.floor(i/cols);
        var xx = PAD + col*(cellW+GAP);
        var yy = gridY + row*(cellH+GAP);
        // tarjeta
        ctx.beginPath(); ctx.roundRect(xx,yy,cellW,cellH,12);
        ctx.fillStyle = '#0d1526'; ctx.fill();
        ctx.strokeStyle = accent+'44'; ctx.lineWidth = 1.5; ctx.stroke();
        ctx.fillStyle = accent+'cc'; ctx.fillRect(xx,yy,5,cellH);
        // número
        ctx.beginPath(); ctx.roundRect(xx+16,yy+cellH/2-20,40,40,20);
        ctx.fillStyle = accent; ctx.fill();
        ctx.font = '900 22px '+FUENTE; ctx.fillStyle = '#000'; ctx.textAlign='center';
        ctx.fillText(String(i+1), xx+36, yy+cellH/2+8);
        // nombre (recorta si no cabe)
        ctx.textAlign = 'left'; ctx.fillStyle = '#ffffff';
        var nombre = String(ejer[i]||('Ejercicio '+(i+1)));
        var size = 24, maxW = cellW - 78;
        ctx.font = '700 '+size+'px '+FUENTE;
        while(ctx.measureText(nombre).width > maxW && size > 14){ size--; ctx.font='700 '+size+'px '+FUENTE; }
        if(ctx.measureText(nombre).width > maxW){
          while(nombre.length>4 && ctx.measureText(nombre+'…').width>maxW){ nombre = nombre.slice(0,-1); }
          nombre += '…';
        }
        ctx.fillText(nombre, xx+70, yy+cellH/2+size/3);
      }

      // Footer
      var footY = gridY + gridH + PAD;
      ctx.fillStyle = '#0a1120'; ctx.fillRect(0,footY,W,FOOTER_H);
      ctx.textAlign = 'center';
      ctx.font = '700 22px '+FUENTE; ctx.fillStyle = '#c9a84c';
      ctx.fillText('ACADEMIA FÁTIMA CALDEA', W/2, footY+30);
      ctx.font = '400 15px '+FUENTE; ctx.fillStyle = '#334155';
      ctx.fillText('Lámina generada localmente · sin conexión externa', W/2, footY+52);

      return c.toDataURL('image/jpeg', 0.9);
    }catch(e){ return null; }
  }

  /* ── Override aditivo de crearBloqueImagen ──
     Conserva la imagen real cuando existe; si falta o falla, usa la lámina
     local. Si no se puede dibujar (combo desconocido), cae al original. */
  function instalarOverride(){
    if(typeof window.crearBloqueImagen !== 'function') return false;
    if(window._crearBloqueImagen_orig) return true;
    var orig = window.crearBloqueImagen;
    window._crearBloqueImagen_orig = orig;

    window.crearBloqueImagen = function(imgSrc, nombreArchivo, placeholderURL){
      var x = parseNombre(nombreArchivo);
      var laminaURL = x ? dibujarLamina(x) : null;

      // Sin lámina local disponible → comportamiento original intacto.
      if(!laminaURL) return orig(imgSrc, nombreArchivo, placeholderURL);

      var tieneImg = imgSrc && String(imgSrc).trim() !== '';
      var wrap = document.createElement('div');
      wrap.className = 'fit-img-block';

      if(tieneImg){
        // Imagen real; si falla la carga, se sustituye por la lámina local.
        wrap.innerHTML =
          '<div class="img-hdr">🏋️ LÁMINA TÉCNICA DEL EJERCICIO</div>' +
          '<img alt="'+String(nombreArchivo)+'" style="width:100%;max-height:480px;object-fit:contain;display:block;background:#000;">';
        var img = wrap.querySelector('img');
        img.onerror = function(){ img.onerror = null; img.src = laminaURL; };
        img.src = imgSrc;
      } else {
        var hdr = 'LÁMINA TÉCNICA — ' + (GRUPO_NOMBRE[x.grupo]||x.grupo) + ' · ' + x.nEjer + ' EJERCICIOS';
        wrap.innerHTML =
          '<div class="img-hdr">🏋️ '+hdr+'</div>' +
          '<img alt="'+String(nombreArchivo)+'" src="'+laminaURL+'" style="width:100%;max-height:480px;object-fit:contain;display:block;background:#000;">';
      }
      return wrap;
    };
    return true;
  }

  /* ── Tooltip que explica "1RM" ── */
  function instalarTooltip1RM(){
    try{
      var labels = document.querySelectorAll('.field-label');
      for(var i=0;i<labels.length;i++){
        var L = labels[i];
        if(/1rm/i.test(L.textContent) && !L.querySelector('._fit1rm')){
          var s = document.createElement('span');
          s.className = '_fit1rm';
          s.textContent = ' ⓘ';
          s.style.cssText = 'cursor:help;color:#60a5fa;';
          s.title = '1RM = tu "una repetición máxima": el peso máximo que puedes levantar UNA sola vez con buena técnica. Si no lo sabes, pon un estimado y ajústalo con la práctica.';
          L.appendChild(s);
        }
      }
    }catch(e){}
  }

  /* ── Validación de inputs antes de generar (y antes de gastar créditos) ── */
  var RANGOS = {
    peso:     { min:20,  max:400, nombre:'Peso corporal (kg)' },
    fuerza:   { min:1,   max:500, nombre:'1RM estimado (kg)' },
    estatura: { min:100, max:230, nombre:'Estatura (cm)' },
    dia:      { min:1,   max:30,  nombre:'Día del programa' }
  };
  function avisoValidacion(msg, id){
    try{
      var t = document.createElement('div');
      t.style.cssText = 'position:fixed;top:18px;right:18px;z-index:99999;background:#020617;border:1px solid #ef4444;border-radius:10px;padding:12px 18px;font-family:Inter,sans-serif;font-size:11px;color:#f87171;max-width:280px;';
      t.textContent = '⚠️ ' + msg;
      document.body.appendChild(t);
      setTimeout(function(){ t.remove(); }, 4000);
      var el = document.getElementById(id);
      if(el){ el.style.borderColor = '#ef4444'; el.focus(); setTimeout(function(){ el.style.borderColor=''; }, 4000); }
    }catch(e){}
  }
  function inputsValidos(){
    for(var id in RANGOS){
      var el = document.getElementById(id);
      if(!el) continue;
      var v = parseFloat(el.value);
      var r = RANGOS[id];
      if(isNaN(v) || v < r.min || v > r.max){
        avisoValidacion(r.nombre + ': pon un valor entre ' + r.min + ' y ' + r.max + '.', id);
        return false;
      }
    }
    return true;
  }
  function envolverGenerar(){
    if(typeof window.generar !== 'function' || window._generar_validado) return false;
    window._generar_validado = true;
    var orig = window.generar;   // ya envuelto con créditos por el bloque
    window.generar = function(){ if(!inputsValidos()) return; return orig.apply(this, arguments); };
    return true;
  }

  /* ── Arranque: reintenta hasta que los globales del bloque existan (o desiste) ── */
  var intentos = 0;
  (function arrancar(){
    var okOverride = instalarOverride();
    var okGenerar  = envolverGenerar();
    instalarTooltip1RM();
    if((okOverride && okGenerar) || intentos > 40) return;  // ~ 40 * 150ms ≈ 6 s
    intentos++;
    setTimeout(arrancar, 150);
  })();
})();

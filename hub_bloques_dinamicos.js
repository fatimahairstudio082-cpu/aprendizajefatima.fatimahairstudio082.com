/* ═══════════════════════════════════════════════════════════════
 *  HUB · BLOQUES DINÁMICOS  · parche ADITIVO
 *  Fátima Caldea Studio · proyecto aprendisajefatima
 *  ────────────────────────────────────────────────────────────────
 *  Se carga con UNA etiqueta al final de index.html y fatima_hub.html
 *  (los DOS, siempre en sincronía), después de peluqueria_hub_bridge.js:
 *      <script src="hub_bloques_dinamicos.js"></script>
 *  Requiere además el POOL de iframes de reserva frame11..frame20
 *  (añadido junto a frame1..frame9 / iframe10).
 *
 *  Qué hace:
 *    Lee EN VIVO los documentos hub_tarjetas/din_{11..20} de Firestore
 *    (los crea la pestaña "Bloques del Hub" de biblioteca.html) y pinta
 *    sus tarjetas en el grid del inicio, junto a las 6 originales.
 *    Cada tarjeta según su tipo:
 *      · tipo "html"   → abre el archivo del bloque en el iframe de su
 *                        slot con cambiarBloque(slot): hereda sesión,
 *                        créditos y navegación como un bloque normal.
 *      · tipo "video"  → abre el video en un TEATRO dorado dentro del
 *                        hub (Drive /preview o MP4/Storage), sin salir.
 *      · tipo "imagen" → visor de imagen a pantalla casi completa.
 *    Toggle activo:false en el documento → la tarjeta desaparece del
 *    hub en segundos, sin recargar. También respeta activo:false en
 *    los documentos "1".."6" para ocultar tarjetas originales.
 *
 *  Contrato del documento hub_tarjetas/din_{slot}:
 *    { nom, desc, imgUrl, icono, color, tipo:'html'|'video'|'imagen',
 *      src, orden, activo, slot }
 *
 *  Qué NO toca:
 *    BLOQUES_DATA (jamás se mete ahí: el botón 🔊 usa índices fijos),
 *    renderHome (solo se envuelve: original intacto + tarjetas después),
 *    cambiarBloque, créditos, reglas, app.js, motores. Cargado sin
 *    Firebase o sin sesión es un no-op inofensivo.
 * ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if (window._HUB_DIN_LOADED) return;
  window._HUB_DIN_LOADED = true;

  var DIN = [];          // bloques dinámicos [{id, slot, tipo, ...}]
  var OCULTOS = {};      // "1".."6" con activo:false → tarjeta original oculta
  var SUSCRITO = false;

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function avisar(m) { try { if (typeof toast === 'function') toast(m); } catch (_) {} }

  /* ── Normalizadores defensivos (mismo criterio que biblioteca.js) ── */
  function vidPreview(u) {
    var s = String(u || '').trim();
    if (/drive\.google|googleusercontent/i.test(s)) {
      var m = s.match(/[-\w]{25,}/);
      if (m) return 'https://drive.google.com/file/d/' + m[0] + '/preview';
    }
    return s;
  }
  function esMp4(u) { return /\.(mp4|webm|ogg|mov|m4v)(\?|#|$)|firebasestorage/i.test(String(u || '')); }
  function srcHtmlValido(s) { return /^[A-Za-z0-9_\-]+\.html$/.test(String(s || '').trim()); }
  function urlSegura(s) { return /^https:\/\//i.test(String(s || '').trim()); }

  /* ── Pintar tarjetas dinámicas (se llama tras cada renderHome) ── */
  function pintarDin() {
    var g = document.getElementById('bloquesGrid');
    if (!g) return;

    // ocultar/mostrar tarjetas originales según su toggle activo
    [].forEach.call(g.querySelectorAll('.bloque-card[data-bloque-num]'), function (c) {
      var n = c.dataset.bloqueNum;
      c.style.display = OCULTOS[n] ? 'none' : '';
    });

    // quitar las dinámicas anteriores y repintarlas (idempotente)
    [].forEach.call(g.querySelectorAll('.bloque-card-din'), function (c) { c.remove(); });

    DIN.forEach(function (d) {
      if (d.activo === false) return;
      var color = /^#[0-9a-fA-F]{3,8}$/.test(d.color || '') ? d.color : '#C9A84C';
      var etiqueta = d.tipo === 'video' ? '🎥 VIDEO' : d.tipo === 'imagen' ? '🖼 GALERÍA' : 'BLOQUE ' + d.slot;
      var c = document.createElement('div');
      c.className = 'bloque-card bloque-card-din';
      c.style.borderColor = color + '33';
      c.innerHTML =
        '<div class="bloque-card-img-wrap">' +
        '  <img class="bloque-card-img" src="' + esc(d.imgUrl || '') + '" alt="' + esc(d.nom || '') + '" loading="lazy"' +
        '    onerror="this.style.display=\'none\'">' +
        '  <div class="bloque-card-overlay">' +
        '    <div class="bloque-card-num" style="color:' + color + ';">' + etiqueta + '</div>' +
        '    <div class="bloque-card-tit">' + esc((d.icono || '✨') + ' ' + (d.nom || 'Nueva categoría')) + '</div>' +
        '    <div class="bloque-card-desc">' + esc(d.desc || '') + '</div>' +
        '  </div>' +
        '</div>' +
        '<div class="bloque-card-footer">' +
        '  <button class="bloque-card-btn" style="background:linear-gradient(135deg,' + color + '77,' + color + ');color:#000;">Abrir →</button>' +
        '</div>';
      c.querySelector('.bloque-card-btn').onclick = function () { abrir(d); };
      g.appendChild(c);
    });
  }

  /* ── Abrir una tarjeta según su tipo ── */
  function abrir(d) {
    if (d.tipo === 'video')  { visor(d, 'video');  return; }
    if (d.tipo === 'imagen') { visor(d, 'imagen'); return; }
    // tipo "html": bloque autónomo en el iframe de su slot
    if (!srcHtmlValido(d.src)) { avisar('El archivo del bloque no es válido'); return; }
    var slot = parseInt(d.slot, 10);
    if (!(slot >= 11 && slot <= 20)) { avisar('Slot fuera del pool (11–20)'); return; }
    var frame = document.getElementById('frame' + slot);
    if (!frame) { avisar('Falta el iframe frame' + slot + ' del pool'); return; }
    // si la admin cambió el archivo, recargar limpio ese slot
    if (frame.dataset.src !== d.src) {
      frame.dataset.src = d.src;
      frame.src = 'about:blank';
      try { HUB.cargados.delete(slot); } catch (_) {}
    }
    try {
      cambiarBloque(slot);
      avisar((d.icono || '✨') + ' ' + (d.nom || 'Bloque'));
    } catch (e) { console.warn('[hub_din] no se pudo abrir el bloque:', e && e.message); }
  }

  /* ── Visor teatro para tipos video / imagen (estilo Modo Cine) ── */
  var visorOv = null;
  function cerrarVisor() {
    if (visorOv) { visorOv.remove(); visorOv = null; }   // quitarlo detiene el audio
    document.body.style.overflow = '';
    document.removeEventListener('keydown', escVisor);
  }
  function escVisor(e) { if (e.key === 'Escape') cerrarVisor(); }
  function visor(d, tipo) {
    var url = tipo === 'video' ? vidPreview(d.src) : String(d.src || '').trim();
    if (!urlSegura(url)) { avisar('El enlace del contenido no es válido (debe ser https)'); return; }
    cerrarVisor();
    visorOv = document.createElement('div');
    visorOv.style.cssText = 'position:fixed;inset:0;background:rgba(2,3,5,.94);z-index:9500;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:12px;';
    var ancho = 'min(96vw,calc(82vh*16/9))';
    var hdr = document.createElement('div');
    hdr.style.cssText = 'width:' + ancho + ';display:flex;justify-content:space-between;align-items:center;gap:10px;padding:0 2px 10px;';
    hdr.innerHTML =
      '<span style="color:#F0D080;font-weight:700;font-size:.92rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0;">' +
        esc((d.icono || '') + ' ' + (d.nom || '')) + '</span>' +
      '<button type="button" style="display:flex;align-items:center;gap:6px;background:rgba(0,0,0,.7);border:1px solid #C9A84C;color:#F0D080;border-radius:20px;padding:7px 14px;font-size:.68rem;font-weight:700;letter-spacing:.6px;cursor:pointer;font-family:inherit;text-transform:uppercase;flex-shrink:0;">✕&nbsp;Cerrar</button>';
    var stage = document.createElement('div');
    stage.style.cssText = 'position:relative;width:' + ancho + ';aspect-ratio:16/9;background:#000;border:1px solid #C9A84C;border-radius:14px;overflow:hidden;box-shadow:0 0 60px rgba(201,168,76,.22),0 30px 80px rgba(0,0,0,.85);';
    if (tipo === 'imagen') {
      var img = document.createElement('img');
      img.src = url; img.alt = d.nom || '';
      img.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:contain;';
      stage.appendChild(img);
    } else if (esMp4(url)) {
      var v = document.createElement('video');
      v.src = url; v.controls = true; v.autoplay = true; v.playsInline = true;
      v.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:contain;background:#000;';
      stage.appendChild(v);
    } else {
      var fr = document.createElement('iframe');
      fr.src = url;
      fr.setAttribute('allow', 'autoplay;encrypted-media');
      fr.setAttribute('allowfullscreen', '');
      fr.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:0;background:#000;';
      stage.appendChild(fr);
    }
    var pie = document.createElement('div');
    pie.style.cssText = 'width:' + ancho + ';text-align:center;color:#8a93a5;font-size:.62rem;padding-top:9px;letter-spacing:.4px;';
    pie.textContent = 'Toca afuera o presiona Esc para volver al inicio';
    visorOv.appendChild(hdr); visorOv.appendChild(stage); visorOv.appendChild(pie);
    document.body.appendChild(visorOv);
    document.body.style.overflow = 'hidden';
    hdr.querySelector('button').onclick = cerrarVisor;
    visorOv.addEventListener('click', function (e) { if (e.target === visorOv) cerrarVisor(); });
    document.addEventListener('keydown', escVisor);
  }

  /* ── Envolver renderHome: original intacto + dinámicas después ── */
  function envolverRender() {
    if (typeof window.renderHome !== 'function') { setTimeout(envolverRender, 250); return; }
    if (window.renderHome.__din) return;
    var orig = window.renderHome;
    window.renderHome = function () { orig(); pintarDin(); };
    window.renderHome.__din = true;
  }
  envolverRender();

  /* ── Escucha en tiempo real (tras resolver la sesión, como drive_fix) ── */
  function suscribir() {
    if (SUSCRITO) return;
    SUSCRITO = true;
    firebase.firestore().collection('hub_tarjetas').onSnapshot(function (snap) {
      DIN = []; OCULTOS = {};
      snap.forEach(function (doc) {
        var d = doc.data() || {};
        if (doc.id.indexOf('din_') === 0) {
          d.id = doc.id;
          d.slot = d.slot || parseInt(doc.id.slice(4), 10);
          DIN.push(d);
        } else if (/^[1-9]$/.test(doc.id) && d.activo === false) {
          OCULTOS[doc.id] = true;
        }
      });
      DIN.sort(function (a, b) { return (a.orden || 0) - (b.orden || 0); });
      pintarDin();
      console.log('[hub_din] ✅ ' + DIN.length + ' bloque(s) dinámico(s) en vivo');
    }, function (e) { console.warn('[hub_din] ⚠️ sin lectura de hub_tarjetas (el hub sigue normal):', e && e.message); });
  }
  function arrancar() {
    try {
      if (!window.firebase || !firebase.auth) { setTimeout(arrancar, 400); return; }
      firebase.auth().onAuthStateChanged(function (u) { if (u) suscribir(); });
    } catch (e) { console.warn('[hub_din] ⚠️ no arrancó (el hub sigue normal):', e && e.message); }
  }
  arrancar();
})();

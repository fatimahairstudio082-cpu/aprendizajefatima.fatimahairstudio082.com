/* ══════════════════════════════════════════════════════════════════
   ESTUDIO UNIVERSAL · CARRUSEL
   ------------------------------------------------------------------
   Una portada, las diapositivas que hagan falta y un cierre con el
   contacto. Todas comparten paleta, tipografía y logo, y llevan su
   número y la flecha de «desliza» para que se lean en orden.

   No dibuja nada por su cuenta: cada diapositiva es una hoja del motor
   de folletos (b6_folleto_motor.js) con el texto que escribe el cerebro
   de redacción (b6_folleto_cerebro.js). Encima sólo va el sello.
   ══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if (window._EU_CARRUSEL_LOADED) return;
  window._EU_CARRUSEL_LOADED = true;

  var P = {};

  var st = {
    diapos: null,          // las páginas, una por diapositiva
    sel: 0,
    formato: 'cuadrado',
    tema: 'violeta',
    numerar: true,
    marcadas: {}           // qué diapositivas entran en el ZIP
  };

  var elLienzo = null, elTira = null;

  function M() { return window.FOLLETO_MOTOR || null; }
  function CB() { return window.FOLLETO_CEREBRO || null; }

  function chip(on) {
    return 'flex:none;border-radius:20px;padding:7px 13px;font-size:11.5px;cursor:pointer;' +
      'white-space:nowrap;font-family:inherit;' +
      (on ? 'background:#22224a;border:1px solid #7c3aed;color:#fff;font-weight:600'
          : 'background:transparent;border:1px solid #2d2d4a;color:#94a3b8');
  }

  var FORMATOS = [
    { id: 'cuadrado', n: 'Cuadrado 1:1' },
    { id: 'vertical', n: 'Vertical 4:5' },
    { id: 'historia', n: 'Historia 9:16' }
  ];

  /* ───────────── Las diapositivas ───────────── */

  /* La portada y el cierre llevan una sola pieza; el cuerpo, dos. Es lo que
     hace que la serie se lea como una historia y no como seis tarifas. */
  function unaDiapo(i, total, semilla) {
    var c = CB(), marca = (window.EU && EU.marca) || {};
    var papel = i === 0 ? 'portada' : (i === total - 1 ? 'cierre' : 'cuerpo');
    var celdas = papel === 'cuerpo' ? 2 : 1;
    var p = c.generar({
      rubro: EU.rubro, tono: EU.tono, n: celdas,
      negocio: marca.nombre || 'Tu negocio',
      ciudad: marca.dir || '',
      contacto: EU.contactoTexto ? EU.contactoTexto() : '',
      semilla: semilla == null ? (300 + i * 7) : semilla
    });
    p.rejilla = celdas === 1 ? 'r1' : 'r2a';
    p.formato = st.formato;
    p.tema = st.tema;
    p.papel = papel;
    p.adornos = { grano: false, vineta: true, filetes: true, sombras: true };
    return p;
  }

  function nuevoCarrusel(n) {
    var total = Math.max(2, n || 5), arr = [], i;
    for (i = 0; i < total; i++) arr.push(unaDiapo(i, total));
    st.marcadas = {};
    for (i = 0; i < total; i++) st.marcadas[i] = true;
    return arr;
  }

  function formato() {
    var m = M();
    return (m && m.FORMATOS[st.formato]) || { w: 1080, h: 1080 };
  }

  /* Número de diapositiva y flecha de «desliza»: lo que hace que un montón
     de imágenes se lea como un carrusel y no como piezas sueltas. */
  function sello(ctx, W, H, i, total) {
    if (!st.numerar) return;
    var r = Math.round(W * 0.035), Mg = Math.round(W * 0.045);
    var x = Mg + r, y = H - Mg - r;
    ctx.save();
    ctx.fillStyle = 'rgba(10,10,20,.72)';
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = '700 ' + Math.round(r * 0.86) + 'px Segoe UI,Arial,sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText((i + 1) + '/' + total, x, y + r * 0.04);
    if (i < total - 1) {
      var ax = W - Mg - r * 1.1, ay = y;
      ctx.strokeStyle = 'rgba(255,255,255,.9)';
      ctx.lineWidth = Math.max(2, r * 0.16);
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(ax - r * 0.35, ay - r * 0.5);
      ctx.lineTo(ax + r * 0.3, ay);
      ctx.lineTo(ax - r * 0.35, ay + r * 0.5);
      ctx.stroke();
      ctx.font = '600 ' + Math.round(r * 0.52) + 'px Segoe UI,Arial,sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,.85)';
      ctx.textAlign = 'right';
      ctx.fillText('desliza', ax - r * 0.75, ay + r * 0.03);
    }
    ctx.restore();
  }

  function diapoCanvas(i, W, H) {
    var pag = (st.diapos || [])[i];
    if (!pag || !M()) return null;
    var cv = document.createElement('canvas');
    cv.width = W; cv.height = H;
    var ctx = cv.getContext('2d');
    M().pintar(ctx, W, H, pag, { formaCelda: pag.formaCelda || 'suave' });
    if (EU.marcaAgua) EU.marcaAgua(ctx, W, H);
    sello(ctx, W, H, i, (st.diapos || []).length);
    return cv;
  }

  function pintarLienzo() {
    if (!elLienzo || !st.diapos) return;
    var F = formato();
    var W = 620, H = Math.round(620 * F.h / F.w);
    if (elLienzo.width !== W || elLienzo.height !== H) { elLienzo.width = W; elLienzo.height = H; }
    var ctx = elLienzo.getContext('2d');
    ctx.clearRect(0, 0, W, H);
    var d = diapoCanvas(Math.min(st.sel, st.diapos.length - 1), W, H);
    if (d) ctx.drawImage(d, 0, 0);
  }

  function pintarTira() {
    if (!elTira || !st.diapos) return;
    var F = formato();
    var cvs = elTira.querySelectorAll('canvas[data-mini]');
    for (var k = 0; k < cvs.length; k++) {
      var c = cvs[k], i = +c.getAttribute('data-mini');
      var w = 120, hh = Math.round(120 * F.h / F.w);
      if (c.width !== w || c.height !== hh) { c.width = w; c.height = hh; }
      var g = c.getContext('2d');
      g.clearRect(0, 0, w, hh);
      var d = diapoCanvas(i, w, hh);
      if (d) g.drawImage(d, 0, 0);
    }
  }

  /* ───────────── Descargas ───────────── */

  function lienzoFinal(i) {
    var F = formato();
    return diapoCanvas(i, F.w, F.h);
  }

  function nombre(i) {
    var marca = (window.EU && EU.marca) || {};
    var base = String(marca.nombre || 'carrusel').toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return base + '-' + String(i + 1).padStart(2, '0') + '.png';
  }

  function bajarUna(i) {
    var cv = lienzoFinal(i);
    if (!cv) return;
    var url = cv.toDataURL('image/png');
    var a = document.createElement('a');
    a.href = url; a.download = nombre(i);
    document.body.appendChild(a); a.click(); a.remove();
    if (window.B6Bandeja) B6Bandeja.apuntar(url, a.download, 'carrusel');
  }

  function bajarTodas() {
    var n = (st.diapos || []).length;
    for (var i = 0; i < n; i++) (function (k) {
      setTimeout(function () { bajarUna(k); }, k * 420);
    })(i);
    EU.toast(n + ' diapositivas descargadas, una detrás de otra.');
  }

  function bajarPDF() {
    if (EU.esPro && !EU.esPro() && window.EU_PLAN && EU_PLAN.muro) return EU_PLAN.muro('pdf');
    var jsPDF = window.jspdf && window.jspdf.jsPDF;
    if (!jsPDF) return EU.toast('El PDF necesita conexión la primera vez.');
    var F = formato(), mm = F.mm || [210, 210];
    var horiz = mm[0] > mm[1];
    var doc = new jsPDF({ orientation: horiz ? 'l' : 'p', unit: 'mm', format: [mm[0], mm[1]] });
    var n = (st.diapos || []).length;
    for (var i = 0; i < n; i++) {
      if (i) doc.addPage([mm[0], mm[1]], horiz ? 'l' : 'p');
      doc.addImage(lienzoFinal(i).toDataURL('image/jpeg', 0.94), 'JPEG', 0, 0, mm[0], mm[1]);
    }
    doc.save('carrusel.pdf');
    EU.toast('PDF de ' + n + ' diapositivas descargado.');
  }

  /* El ZIP pasa por la bandeja, que es quien sabe empaquetar. Se apuntan
     primero las marcadas y luego se le pide el ZIP de esta pestaña. */
  function zipMarcadas() {
    if (!window.B6Bandeja) return EU.toast('La bandeja no está cargada.');
    if (!window.JSZip) return EU.toast('El ZIP necesita conexión la primera vez.');
    var n = 0;
    (st.diapos || []).forEach(function (d, i) {
      if (!st.marcadas[i]) return;
      var cv = lienzoFinal(i);
      if (cv) { B6Bandeja.apuntar(cv.toDataURL('image/png'), nombre(i), 'carrusel'); n++; }
    });
    if (!n) return EU.toast('No hay ninguna diapositiva marcada.');
    setTimeout(function () { B6Bandeja.zip('carrusel', { origen: 'carrusel' }); }, 900);
    EU.toast('Preparando el ZIP con ' + n + (n === 1 ? ' diapositiva…' : ' diapositivas…'));
  }

  /* ───────────── Pantalla ───────────── */

  function pintar() {
    var caja = EU.$('euCarrusel');
    if (!caja) return;
    if (!M() || !CB()) {
      caja.innerHTML = '<p class="ayuda">Faltan los motores del folleto en la página.</p>';
      return;
    }
    if (!st.diapos) st.diapos = nuevoCarrusel(5);

    var n = st.diapos.length;
    var marcadas = Object.keys(st.marcadas).filter(function (k) { return st.marcadas[k]; }).length;
    var h = [];

    h.push('<div class="cr-cols">');

    /* ── Izquierda: lienzo, tira y acciones ── */
    h.push('<div>');
    h.push('<div style="background:#0a0a14;border:1px solid #2d2d4a;border-radius:12px;padding:14px;' +
      'display:flex;justify-content:center">' +
      '<canvas id="euCarLienzo" width="620" height="620" style="max-width:100%;max-height:56vh;' +
      'height:auto;border-radius:6px;box-shadow:0 14px 40px rgba(0,0,0,.6);background:#000"></canvas></div>');

    /* Tira de miniaturas */
    h.push('<div id="euCarTira" style="display:flex;gap:7px;overflow-x:auto;padding:10px 2px 4px">');
    st.diapos.forEach(function (d, i) {
      var sel = i === st.sel;
      h.push('<div data-diapo="' + i + '" style="flex:none;width:86px;cursor:pointer;border-radius:9px;' +
        'padding:4px;border:2px solid ' + (sel ? '#7c3aed' : 'transparent') + ';background:#13132a">' +
        '<canvas data-mini="' + i + '" width="120" height="120" style="width:100%;height:auto;' +
        'display:block;border-radius:5px;background:#111"></canvas>' +
        '<div style="display:flex;align-items:center;justify-content:center;gap:5px;margin-top:3px">' +
        '<input type="checkbox" data-marca="' + i + '"' + (st.marcadas[i] ? ' checked' : '') +
        ' style="accent-color:#a855f7;width:13px;height:13px;flex:none" />' +
        '<span style="font-size:9.5px;color:#94a3b8">' +
        (i === 0 ? 'Portada' : (i === n - 1 ? 'Cierre' : String(i + 1))) + '</span></div></div>');
    });
    h.push('<button id="euCarAnadir" style="flex:none;width:86px;border:1px dashed #4b4b7a;' +
      'background:transparent;color:#94a3b8;border-radius:9px;font-size:11px;cursor:pointer;' +
      'font-family:inherit">＋ Añadir</button>');
    h.push('</div>');

    /* Acciones sobre la diapositiva */
    h.push('<div style="display:flex;gap:7px;flex-wrap:wrap;align-items:center;margin-top:6px">' +
      '<button id="euCarIzq" style="' + chip(false) + '">◀ Mover</button>' +
      '<button id="euCarDer" style="' + chip(false) + '">Mover ▶</button>' +
      '<button id="euCarRehacer" style="' + chip(false) + '">🔁 Rehacer esta</button>' +
      '<button id="euCarQuitar" style="' + chip(false) + '">🗑 Quitar</button>' +
      '<span style="flex:1"></span>');
    FORMATOS.forEach(function (f) {
      h.push('<button data-fmt="' + f.id + '" style="' + chip(f.id === st.formato) + '">' + f.n + '</button>');
    });
    h.push('</div>');

    /* Descargas */
    h.push('<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:8px">' +
      '<button id="euCarUna" style="background:transparent;border:1px solid #2d2d4a;color:#cbd5e1;' +
      'border-radius:9px;padding:9px 14px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit">⬇ Esta diapositiva</button>' +
      '<button id="euCarTodas" style="background:linear-gradient(135deg,#0891b2,#06b6d4);color:#fff;border:0;' +
      'border-radius:9px;padding:9px 15px;font-size:12.5px;font-weight:700;cursor:pointer;font-family:inherit">⬇ Todo el carrusel</button>' +
      '<button id="euCarPDF" style="background:transparent;border:1px solid #a855f7;color:#e9d5ff;' +
      'border-radius:9px;padding:9px 14px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit">⬇ PDF del carrusel</button>' +
      '<button id="euCarZip" style="background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;border:0;' +
      'border-radius:9px;padding:9px 15px;font-size:12.5px;font-weight:700;cursor:pointer;font-family:inherit">🗜 ZIP de ' +
      marcadas + (marcadas === 1 ? ' marcada' : ' marcadas') + '</button>' +
      '<button id="euCarMarcar" style="' + chip(false) + '">' +
      (marcadas === n ? 'Desmarcar todas' : 'Marcar todas') + '</button>' +
      '</div>');

    h.push('<div id="euCarBandeja"></div>');
    h.push('</div>');

    /* ── Derecha: ajustes ── */
    h.push('<div class="cr-panel">');
    h.push('<label style="font-size:10px;color:#94a3b8;margin:0 0 4px;display:block;letter-spacing:.06em;' +
      'text-transform:uppercase">Paleta</label>');
    h.push('<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px">');
    Object.keys(M().TEMAS).forEach(function (t) {
      h.push('<button data-tema="' + t + '" style="' + chip(t === st.tema) + '">' +
        EU.esc(M().TEMAS[t].nombre) + '</button>');
    });
    h.push('</div>');
    h.push('<label style="display:flex;align-items:center;gap:8px;font-size:11.5px;color:#cbd5e1;cursor:pointer">' +
      '<input type="checkbox" id="euCarNum"' + (st.numerar ? ' checked' : '') +
      ' style="accent-color:#a855f7;width:15px;height:15px" /> Numerar y poner «desliza»</label>');
    h.push('<p style="margin:10px 0 0;font-size:10.5px;color:#7c7c9e;line-height:1.55">' +
      'La portada y el cierre llevan una sola pieza; las de en medio, dos. Es lo que hace que la ' +
      'serie se lea como una historia y no como seis tarifas seguidas.</p>');
    h.push('</div>');

    h.push('</div>');
    caja.innerHTML = h.join('');

    elLienzo = EU.$('euCarLienzo');
    elTira = EU.$('euCarTira');
    enganchar(caja);
    pintarLienzo();
    setTimeout(pintarTira, 0);

    var host = EU.$('euCarBandeja');
    if (host && window.B6Bandeja) B6Bandeja.panel(host, { origen: 'carrusel' }, 'carrusel');
  }

  function enganchar(caja) {
    caja.onclick = function (ev) {
      var t = ev.target;
      var mini = t.closest ? t.closest('[data-diapo]') : null;
      var b = t.closest ? t.closest('button') : null;

      if (t.hasAttribute && t.hasAttribute('data-marca')) {
        st.marcadas[+t.getAttribute('data-marca')] = t.checked;
        return pintar();
      }
      if (t.id === 'euCarNum') { st.numerar = t.checked; return pintar(); }

      if (b) {
        if (b.hasAttribute('data-fmt')) { st.formato = b.getAttribute('data-fmt'); return pintar(); }
        if (b.hasAttribute('data-tema')) {
          st.tema = b.getAttribute('data-tema');
          (st.diapos || []).forEach(function (d) { d.tema = st.tema; });
          return pintar();
        }
        if (b.id === 'euCarAnadir') {
          var n = st.diapos.length;
          st.diapos.splice(n - 1, 0, unaDiapo(1, n + 1, Date.now() % 9999));
          st.marcadas[n] = true;
          st.sel = n - 1;
          return pintar();
        }
        if (b.id === 'euCarIzq' && st.sel > 0) {
          var a = st.diapos.splice(st.sel, 1)[0];
          st.diapos.splice(st.sel - 1, 0, a); st.sel--;
          return pintar();
        }
        if (b.id === 'euCarDer' && st.sel < st.diapos.length - 1) {
          var c = st.diapos.splice(st.sel, 1)[0];
          st.diapos.splice(st.sel + 1, 0, c); st.sel++;
          return pintar();
        }
        if (b.id === 'euCarRehacer') {
          st.diapos[st.sel] = unaDiapo(st.sel, st.diapos.length, Date.now() % 9999);
          return pintar();
        }
        if (b.id === 'euCarQuitar') {
          if (st.diapos.length <= 2) return EU.toast('Un carrusel necesita al menos portada y cierre.');
          st.diapos.splice(st.sel, 1);
          st.sel = Math.max(0, st.sel - 1);
          return pintar();
        }
        if (b.id === 'euCarUna') return bajarUna(st.sel);
        if (b.id === 'euCarTodas') return bajarTodas();
        if (b.id === 'euCarPDF') return bajarPDF();
        if (b.id === 'euCarZip') return zipMarcadas();
        if (b.id === 'euCarMarcar') {
          var todas = Object.keys(st.marcadas).filter(function (k) { return st.marcadas[k]; }).length === st.diapos.length;
          st.diapos.forEach(function (d, i) { st.marcadas[i] = !todas; });
          return pintar();
        }
      }

      if (mini) { st.sel = +mini.getAttribute('data-diapo'); return pintar(); }
    };
  }

  P.entrar = function () { pintar(); };

  window.EU_CARRUSEL = P;
})();

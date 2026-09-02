/* ══════════════════════════════════════════════════════════════════
   ESTUDIO UNIVERSAL · REPASO Y EXAMEN
   ------------------------------------------------------------------
   Las preguntas salen de la misma técnica que se estudia, no de un
   cuestionario aparte: las escribe el Cerebro (b6_cerebro.js) y de ahí
   salen las dos caras de esta pantalla.

     · a la izquierda, el repaso en pantalla. Cada respuesta se corrige
       al momento y SIEMPRE enseña el porqué, se acierte o se falle,
       porque lo que se aprende es el criterio, no el punto.
     · a la derecha, la misma prueba maquetada en A4 para imprimir
       (b6_examen.js), con su hoja de corrección para el aula.

   Es la traducción a JavaScript de siempre de la pestaña «Repaso» del
   proyecto de Claude Design. Mismo texto, mismos colores, misma lógica.
   ══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if (window._EU_REPASO_LOADED) return;
  window._EU_REPASO_LOADED = true;

  var P = {};

  /* Estado de la pantalla. Vive aquí, no en el almacén del dispositivo:
     un repaso a medias no tiene por qué sobrevivir al cierre. */
  var st = { fam: '', tec: '', resp: {}, cara: 'examen', pag: 0, centro: '' };

  var elExamen = null;

  function CB() { return window.EU_CEREBRO || null; }
  function EX() { return window.EU_EXAMEN || null; }

  /* ───────────── Ayudantes de estilo ─────────────
     Los mismos valores del proyecto de diseño, en un solo sitio. */

  function chip(on) {
    return 'flex:none;border-radius:20px;padding:7px 14px;font-size:12px;cursor:pointer;' +
      'white-space:nowrap;font-family:inherit;' +
      (on ? 'background:#22224a;border:1px solid #7c3aed;color:#fff;font-weight:600'
          : 'background:transparent;border:1px solid #2d2d4a;color:#94a3b8');
  }

  /* ───────────── Lectura del Cerebro ───────────── */

  function familias() { var c = CB(); return c ? c.familias() : []; }

  function tecnicas(fam) { var c = CB(); return c ? c.listar(fam) : []; }

  function tecnicaActual() {
    var c = CB();
    if (!c || !st.tec) return null;
    return c.obtener(st.tec);
  }

  function preguntas() {
    var t = tecnicaActual();
    return t ? (t.repaso || []) : [];
  }

  /* Coloca familia y técnica válidas la primera vez, o cuando cambia la
     familia y la técnica anterior ya no pertenece a ella. */
  function normalizar() {
    var fams = familias();
    if (!fams.length) return false;
    if (!fams.some(function (f) { return f.id === st.fam; })) st.fam = fams[0].id;
    var tecs = tecnicas(st.fam);
    if (!tecs.some(function (t) { return t.id === st.tec; })) {
      st.tec = tecs[0] ? tecs[0].id : '';
      st.resp = {};
      st.pag = 0;
    }
    return true;
  }

  /* ───────────── La hoja de examen ─────────────
     Se arma con lo que la técnica ya sabe de sí misma: su procedimiento y
     sus errores frecuentes. No hay que escribir la pregunta abierta dos
     veces, y cambia sola si mañana se corrige la técnica. */

  function datosExamen() {
    var t = tecnicaActual();
    var fam = familias().filter(function (f) { return f.id === st.fam; })[0] || {};
    return {
      centro: st.centro || 'Centro de formación profesional',
      modulo: fam.n || '',
      titulo: t ? t.n : '',
      subtitulo: 'Prueba escrita de conocimientos',
      enunciado: t ? t.resumen : '',
      instruccion: 'Marca una sola casilla por pregunta. Cada acierto suma un punto; no se descuenta por fallo.',
      preguntas: preguntas(),
      abierta: t ? {
        p: 'Explica con tus palabras cómo ejecutarías «' + t.n + '» de principio a fin. ' +
           'Indica el orden de los pasos, las medidas concretas (tiempos, cantidades, ángulos) ' +
           'y qué comprobarías antes de dar el trabajo por terminado.',
        clave: (t.pasos || []).map(function (p) { return p.t + ': ' + p.n; })
          .concat((((t.ficha || {}).errores) || []).slice(0, 2).map(function (e) {
            return 'Evita el error de ' + e.charAt(0).toLowerCase() + e.slice(1);
          }))
      } : null
    };
  }

  function nPaginas() {
    var E = EX();
    if (!E || !preguntas().length) return 1;
    try { return E.paginas(datosExamen(), st.cara); } catch (e) { return 1; }
  }

  function pintarExamen() {
    var E = EX();
    if (!E || !elExamen) return;
    var d = datosExamen();
    var x = elExamen.getContext('2d');
    if (!d.preguntas.length) { x.clearRect(0, 0, elExamen.width, elExamen.height); return; }
    elExamen.width = E.A4.w;
    elExamen.height = E.A4.h;
    E.hoja(elExamen.getContext('2d'), d, st.cara, st.pag);
  }

  function hojaCanvas(i) {
    var E = EX();
    var cv = document.createElement('canvas');
    cv.width = E.A4.w; cv.height = E.A4.h;
    E.hoja(cv.getContext('2d'), datosExamen(), st.cara, i);
    return cv;
  }

  function nombreBase() {
    var d = datosExamen();
    return (st.cara === 'correccion' ? 'correccion-' : 'examen-') +
      String(d.titulo || 'prueba').toLowerCase()
        .normalize('NFD').replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  function descargar(formato) {
    var E = EX();
    if (!E) return;
    if (!preguntas().length) {
      return EU.toast('Esta técnica todavía no tiene preguntas de repaso.');
    }
    var n = nPaginas(), base = nombreBase(), i;

    if (formato === 'pdf') {
      if (!EU.esPro || !EU.esPro()) {
        if (window.EU_PLAN && EU_PLAN.muro) return EU_PLAN.muro('pdf');
      }
      var jsPDF = window.jspdf && window.jspdf.jsPDF;
      if (!jsPDF) return EU.toast('El PDF necesita conexión la primera vez.');
      var doc = new jsPDF({ orientation: 'p', unit: 'mm', format: [210, 297] });
      for (i = 0; i < n; i++) {
        if (i) doc.addPage([210, 297], 'p');
        doc.addImage(hojaCanvas(i).toDataURL('image/jpeg', 0.96), 'JPEG', 0, 0, 210, 297);
      }
      doc.save(base + '.pdf');
      return EU.toast('PDF de ' + n + (n === 1 ? ' hoja' : ' hojas') + ' descargado.');
    }

    for (i = 0; i < n; i++) {
      var a = document.createElement('a');
      a.href = hojaCanvas(i).toDataURL('image/png');
      a.download = base + (n > 1 ? '-' + (i + 1) : '') + '.png';
      document.body.appendChild(a); a.click(); a.remove();
    }
    EU.toast('Hoja descargada en PNG.');
  }

  /* ───────────── Pintado de la pantalla ───────────── */

  function pintar() {
    var caja = EU.$('euRepaso');
    if (!caja) return;

    if (!CB()) {
      caja.innerHTML = '<p class="ayuda">El motor de conocimiento no se ha cargado. ' +
        'Comprueba que <code>b6_cerebro.js</code> está incluido en la página.</p>';
      return;
    }
    if (!normalizar()) {
      caja.innerHTML = '<p class="ayuda">Todavía no hay técnicas escritas en el Cerebro.</p>';
      return;
    }

    var t = tecnicaActual();
    var pregs = preguntas();
    var hechas = Object.keys(st.resp).length;
    var aciertos = Object.keys(st.resp).filter(function (k) {
      return st.resp[k] === pregs[k].c;
    }).length;
    var completo = pregs.length > 0 && hechas === pregs.length;
    var nPags = nPaginas();

    var h = [];

    /* Familias, en chips */
    h.push('<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px">');
    familias().forEach(function (f) {
      h.push('<button data-fam="' + EU.esc(f.id) + '" style="' + chip(f.id === st.fam) + '">' +
        EU.esc((f.ico ? f.ico + ' ' : '') + f.n) + '</button>');
    });
    h.push('</div>');

    h.push('<div class="rp-cols">');

    /* ── Columna izquierda: el repaso ── */
    h.push('<div>');
    h.push('<select id="euRepTec" style="width:100%;background:#0f0f22;border:1px solid #2d2d4a;' +
      'color:#e2e8f0;border-radius:9px;padding:10px;font-size:13px;margin-bottom:10px;font-family:inherit">');
    tecnicas(st.fam).forEach(function (x) {
      h.push('<option value="' + EU.esc(x.id) + '"' + (x.id === st.tec ? ' selected' : '') + '>' +
        EU.esc(x.n) + '</option>');
    });
    h.push('</select>');

    h.push('<div style="background:#13132a;border:1px solid #2d2d4a;border-radius:12px;padding:15px 17px;margin-bottom:12px">' +
      '<h3 style="margin:0 0 4px;font-size:15px;color:#e2e8f0;font-weight:700">' + EU.esc(t ? t.n : '') + '</h3>' +
      '<p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.6">' + EU.esc(t ? t.resumen : '') + '</p>' +
      '<p style="margin:8px 0 0;font-size:11px;color:#7c7c9e">' +
      (pregs.length ? EU.esc(hechas + ' de ' + pregs.length + (hechas ? '  ·  ' + aciertos + ' correctas' : '')) : '') +
      '</p></div>');

    if (t && !pregs.length) {
      h.push('<p style="margin:0;font-size:12px;color:#7c7c9e;line-height:1.6;background:#13132a;' +
        'border:1px dashed #2d2d4a;border-radius:12px;padding:16px">Esta técnica todavía no tiene ' +
        'preguntas de repaso. Puedes escribirlas en el Cerebro y aparecerán aquí y en la hoja de examen.</p>');
    }

    /* Las preguntas */
    h.push('<div style="display:flex;flex-direction:column;gap:14px">');
    pregs.forEach(function (q, i) {
      var dada = st.resp[i];
      var contestada = dada !== undefined;
      h.push('<div style="background:#18183a;border:1px solid #2d2d4a;border-radius:12px;padding:15px 17px">');
      h.push('<div style="display:flex;gap:9px;align-items:baseline;margin-bottom:11px">' +
        '<span style="font-size:12px;font-weight:700;color:#a855f7;flex:none">' + (i + 1) + '.</span>' +
        '<span style="font-size:13.5px;color:#e2e8f0;line-height:1.55">' + EU.esc(q.p) + '</span></div>');
      h.push('<div style="display:flex;flex-direction:column;gap:7px">');
      (q.o || []).forEach(function (o, j) {
        var esta = dada === j, buena = contestada && j === q.c;
        var borde = '#2d2d4a', fondo = '#13132a', color = '#e2e8f0';
        if (buena) { borde = '#34d399'; fondo = 'rgba(52,211,153,.10)'; color = '#86efac'; }
        else if (esta) { borde = '#f87171'; fondo = 'rgba(248,113,113,.10)'; color = '#fca5a5'; }
        h.push('<button data-q="' + i + '" data-o="' + j + '" style="display:block;width:100%;' +
          'text-align:left;border-radius:9px;padding:10px 13px;font-size:12.5px;line-height:1.5;' +
          'font-family:inherit;cursor:' + (contestada ? 'default' : 'pointer') +
          ';border:1px solid ' + borde + ';background:' + fondo + ';color:' + color + '">' +
          EU.esc(String.fromCharCode(97 + j) + ')  ' + o) + '</button>');
      });
      h.push('</div>');
      if (contestada) {
        var bien = dada === q.c;
        h.push('<div style="margin-top:12px;padding-top:11px;border-top:1px solid #2d2d4a">' +
          '<div style="font-size:10.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:' +
          (bien ? '#34d399' : '#f87171') + '">' + (bien ? 'Correcto' : 'No es esa') + '</div>' +
          '<p style="margin:5px 0 0;font-size:12px;color:#94a3b8;line-height:1.6">' +
          EU.esc(q.x || '') + '</p></div>');
      }
      h.push('</div>');
    });
    h.push('</div>');

    if (completo) {
      h.push('<div style="margin-top:14px;background:#13132a;border:1px solid #7c3aed;border-radius:12px;padding:15px 17px">' +
        '<p style="margin:0;font-size:12.5px;color:#e2e8f0;line-height:1.6">' +
        (aciertos === pregs.length
          ? 'Todo correcto. Repítelo dentro de una semana, no mañana: el repaso sirve cuando ya cuesta recordar.'
          : 'Lee el porqué de las que fallaste y pásalas a tu cuaderno de errores. Vuelve a esta técnica dentro de dos días.') +
        '</p><button id="euRepReiniciar" style="margin-top:11px;background:transparent;border:1px solid #2d2d4a;' +
        'color:#94a3b8;border-radius:9px;padding:8px 15px;font-size:12px;cursor:pointer;font-family:inherit">' +
        'Volver a empezar</button></div>');
    }
    h.push('</div>');

    /* ── Columna derecha: la hoja de examen ── */
    h.push('<div class="rp-hoja">');
    h.push('<h3 style="margin:0 0 3px;font-size:12.5px;color:#e2e8f0;font-weight:700">Hoja de examen</h3>' +
      '<p style="margin:0 0 11px;font-size:10.5px;color:#7c7c9e;line-height:1.5">A4 en papel hueso y ' +
      'tinta oscura: sobrevive a la fotocopia en blanco y negro.</p>');
    h.push('<div style="display:flex;gap:6px;margin-bottom:9px">' +
      '<button data-cara="examen" style="' + chip(st.cara === 'examen') + '">Examen</button>' +
      '<button data-cara="correccion" style="' + chip(st.cara === 'correccion') + '">Corrección</button></div>');
    h.push('<input id="euRepCentro" value="' + EU.esc(st.centro) + '" placeholder="Nombre del centro" ' +
      'style="width:100%;background:#0f0f22;border:1px solid #2d2d4a;color:#e2e8f0;border-radius:8px;' +
      'padding:8px;font-size:11.5px;margin-bottom:10px;font-family:inherit" />');
    h.push('<div style="background:#0a0a14;border:1px solid #2d2d4a;border-radius:10px;padding:10px;' +
      'display:flex;justify-content:center">' +
      '<canvas id="euRepLienzo" width="794" height="1123" style="max-width:100%;max-height:56vh;' +
      'height:auto;border-radius:3px;box-shadow:0 12px 34px rgba(0,0,0,.55);background:#FBF9F4"></canvas></div>');
    if (nPags > 1) {
      h.push('<div style="display:flex;gap:8px;align-items:center;justify-content:center;margin-top:9px">' +
        '<button id="euRepAnt" style="background:transparent;border:1px solid #2d2d4a;color:#94a3b8;' +
        'border-radius:8px;padding:5px 12px;font-size:11.5px;cursor:pointer;font-family:inherit">‹</button>' +
        '<span style="font-size:11px;color:#94a3b8;min-width:82px;text-align:center">Hoja ' +
        (Math.min(st.pag + 1, nPags)) + ' de ' + nPags + '</span>' +
        '<button id="euRepSig" style="background:transparent;border:1px solid #2d2d4a;color:#94a3b8;' +
        'border-radius:8px;padding:5px 12px;font-size:11.5px;cursor:pointer;font-family:inherit">›</button></div>');
    }
    h.push('<div style="display:flex;gap:8px;margin-top:11px">' +
      '<button id="euRepPDF" style="flex:1;background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;' +
      'border:0;border-radius:9px;padding:9px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit">PDF</button>' +
      '<button id="euRepPNG" style="flex:1;background:transparent;border:1px solid #2d2d4a;color:#94a3b8;' +
      'border-radius:9px;padding:9px;font-size:12px;cursor:pointer;font-family:inherit">PNG</button></div>');
    h.push('</div>');

    h.push('</div>');
    caja.innerHTML = h.join('');

    elExamen = EU.$('euRepLienzo');
    enganchar(caja, nPags);
    pintarExamen();
  }

  /* ───────────── Sucesos ─────────────
     Un solo oyente por caja: se vuelve a pintar entera en cada cambio, que
     es barato y evita que se queden botones colgando de un pintado viejo. */

  function enganchar(caja, nPags) {
    caja.onclick = function (ev) {
      var b = ev.target.closest ? ev.target.closest('button') : null;
      if (!b) return;

      if (b.hasAttribute('data-fam')) {
        st.fam = b.getAttribute('data-fam');
        var tecs = tecnicas(st.fam);
        st.tec = tecs[0] ? tecs[0].id : '';
        st.resp = {}; st.pag = 0;
        return pintar();
      }
      if (b.hasAttribute('data-q')) {
        var i = +b.getAttribute('data-q');
        if (st.resp[i] !== undefined) return;      // ya contestada: no se cambia
        st.resp[i] = +b.getAttribute('data-o');
        return pintar();
      }
      if (b.hasAttribute('data-cara')) {
        st.cara = b.getAttribute('data-cara');
        st.pag = 0;
        return pintar();
      }
      if (b.id === 'euRepReiniciar') { st.resp = {}; return pintar(); }
      if (b.id === 'euRepAnt') { st.pag = Math.max(0, st.pag - 1); return pintar(); }
      if (b.id === 'euRepSig') { st.pag = Math.min(nPags - 1, st.pag + 1); return pintar(); }
      if (b.id === 'euRepPDF') return descargar('pdf');
      if (b.id === 'euRepPNG') return descargar('png');
    };

    var sel = EU.$('euRepTec');
    if (sel) sel.onchange = function () {
      st.tec = sel.value; st.resp = {}; st.pag = 0; pintar();
    };

    var cen = EU.$('euRepCentro');
    if (cen) cen.oninput = function () { st.centro = cen.value; pintarExamen(); };
  }

  P.entrar = function () { pintar(); };

  window.EU_REPASO = P;
})();

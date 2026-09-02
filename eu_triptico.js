/* ══════════════════════════════════════════════════════════════════
   ESTUDIO UNIVERSAL · TRÍPTICO
   ------------------------------------------------------------------
   Un A4 apaisado partido en tres cuerpos, por sus dos caras: la de
   fuera (portada, contraportada y solapa) y la de dentro, que es la
   que se lee con el folleto abierto.

   Dos vistas del mismo dibujo:
     · plana  — los tres cuerpos en fila con los pliegues marcados. Es
                lo que se manda a imprimir.
     · libro  — el tríptico abriéndose en la mano, con los dos cuerpos
                de fuera girando sobre su pliegue con perspectiva de
                verdad. Es lo que se enseña.

   Cada cuerpo es una hoja del motor de folletos, así que lo que se ve
   y lo que se descarga son el mismo píxel.
   ══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if (window._EU_TRIPTICO_LOADED) return;
  window._EU_TRIPTICO_LOADED = true;

  var P = {};

  var st = {
    pags: null,        // { ext:[3 páginas], int:[3 páginas] }
    cara: 'ext',
    tema: 'nude',
    forma: 'suave',    // troquel de celda
    libro: false,
    abre: 1            // 0 cerrado, 1 abierto del todo
  };

  var elLienzo = null, rafId = 0, cacheClave = '', cacheCuerpos = null;

  function M() { return window.FOLLETO_MOTOR || null; }
  function CB() { return window.FOLLETO_CEREBRO || null; }

  function chip(on) {
    return 'flex:none;border-radius:20px;padding:7px 13px;font-size:11.5px;cursor:pointer;' +
      'white-space:nowrap;font-family:inherit;' +
      (on ? 'background:#22224a;border:1px solid #7c3aed;color:#fff;font-weight:600'
          : 'background:transparent;border:1px solid #2d2d4a;color:#94a3b8');
  }

  /* ───────────── Las seis páginas ─────────────
     El tríptico sigue siendo de tres cuerpos, así que la rejilla se queda en
     una o dos celdas por cuerpo para que el texto se lea. */

  function unaPagina(n, semilla) {
    var c = CB(), marca = (window.EU && EU.marca) || {};
    var p = c.generar({
      rubro: EU.rubro, tono: EU.tono, n: n,
      negocio: marca.nombre || 'Tu negocio',
      ciudad: marca.dir || '',
      contacto: EU.contactoTexto ? EU.contactoTexto() : '',
      semilla: semilla
    });
    p.rejilla = n === 1 ? 'r1' : 'r2a';
    p.tema = st.tema;
    p.formaCelda = st.forma;
    p.adornos = { grano: false, vineta: false, filetes: true, sombras: true };
    return p;
  }

  function nuevoTriptico() {
    return {
      ext: [unaPagina(1, 11), unaPagina(2, 12), unaPagina(1, 13)],
      int: [unaPagina(2, 21), unaPagina(2, 22), unaPagina(2, 23)]
    };
  }

  function paginas() { return st.pags ? st.pags[st.cara] : null; }

  /* Los tres cuerpos ya pintados, guardados por si se está animando: en el
     libro se redibujan sesenta veces por segundo y no se pueden repintar. */
  function cuerpos(pw, H) {
    var pags = paginas();
    if (!pags) return null;
    var clave = pw + '|' + st.cara + '|' + st.tema + '|' + st.forma + '|' +
      pags.map(function (p) { return p.cabecera.titulo; }).join('~');
    if (cacheClave === clave && cacheCuerpos) return cacheCuerpos;
    cacheCuerpos = pags.map(function (pag) {
      var off = document.createElement('canvas');
      off.width = pw; off.height = H;
      M().pintar(off.getContext('2d'), pw, H, pag, { formaCelda: pag.formaCelda || 'suave' });
      return off;
    });
    cacheClave = clave;
    return cacheCuerpos;
  }

  function invalidar() { cacheClave = ''; cacheCuerpos = null; }

  /* ───────────── La perspectiva del libro ─────────────
     Una cara girada se dibuja en tiras verticales: cada tira se proyecta con
     su propia escala, que es lo que da la profundidad de verdad y no un
     simple aplastado. */

  function ease(p) { return 1 - Math.pow(1 - Math.max(0, Math.min(1, p)), 3); }

  function caraGirada(ctx, img, sw, sh, dx, dy, dw, dh, ang, pivote) {
    var piv = pivote || 0;
    var N = Math.max(26, Math.round(dw / 3));
    var semi = dw / 2, foco = dw * 1.9;
    var xPiv = piv < 0 ? dx : (piv > 0 ? dx + dw : dx + semi);
    var xlPiv = piv * semi;
    var cy = dy + dh / 2;
    var ca = Math.cos(ang), sa = Math.sin(ang);
    if (Math.abs(ca) < 0.02) return;
    var proy = function (u) {
      var xl = (u * 2 - 1) * semi - xlPiv;
      var esc = foco / (foco + xl * sa);
      return { x: xPiv + xl * ca * esc, alt: dh * esc };
    };
    ctx.save();
    for (var i = 0; i < N; i++) {
      var u0 = i / N, u1 = (i + 1) / N;
      var a = proy(u0), b = proy(u1);
      var an = b.x - a.x;
      if (Math.abs(an) < 0.3) continue;
      var alt = (a.alt + b.alt) / 2;
      ctx.drawImage(img, sw * u0, 0, Math.max(0.5, sw * (u1 - u0)), sh,
        Math.min(a.x, b.x), cy - alt / 2, Math.abs(an) + 0.6, alt);
    }
    var e0 = proy(0), e1 = proy(1);
    var x0 = Math.min(e0.x, e1.x), x1 = Math.max(e0.x, e1.x);
    var g = ctx.createLinearGradient(x0, 0, x1, 0);
    var lado = sa > 0 ? 1 : 0;
    g.addColorStop(0, 'rgba(0,0,0,' + (lado ? 0 : Math.abs(sa) * 0.45) + ')');
    g.addColorStop(1, 'rgba(0,0,0,' + (lado ? Math.abs(sa) * 0.45 : 0) + ')');
    ctx.fillStyle = g;
    var mAlt = Math.max(e0.alt, e1.alt);
    ctx.fillRect(x0 - 1, cy - mAlt / 2, x1 - x0 + 2, mAlt);
    ctx.restore();
  }

  function pintarLibro(ctx, W, H, cps, p) {
    var abre = ease(Math.max(0, Math.min(1, p)));
    var pw = cps[0].width, ph = cps[0].height;
    var sc = 0.74, dw = pw * sc, dh = ph * sc;
    var cy = H / 2, cxm = W / 2;
    var g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#0a0a14'); g.addColorStop(1, '#14142a');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

    /* Se empieza en 84°, no en 90°: a 90° la cara es una línea sin ancho y no
       se dibujaría nada, así que los cuerpos aparecerían de golpe. */
    var ang = (1 - abre) * (Math.PI / 2) * 0.935;
    var izqFijo = cxm - dw / 2, derFijo = cxm + dw / 2;

    ctx.save();
    ctx.globalAlpha = 0.35 * abre;
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.ellipse(cxm, cy + dh / 2 + 14, dw * 1.4 * abre + dw * 0.6, 16, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    caraGirada(ctx, cps[0], pw, ph, izqFijo - dw, cy - dh / 2, dw, dh, -ang, 1);
    caraGirada(ctx, cps[2], pw, ph, derFijo, cy - dh / 2, dw, dh, ang, -1);
    ctx.drawImage(cps[1], 0, 0, pw, ph, cxm - dw / 2, cy - dh / 2, dw, dh);

    ctx.save();
    ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.lineWidth = 1.5;
    [izqFijo, derFijo].forEach(function (x) {
      ctx.beginPath(); ctx.moveTo(x, cy - dh / 2); ctx.lineTo(x, cy + dh / 2); ctx.stroke();
    });
    ctx.restore();
  }

  function pintarLienzo() {
    if (!elLienzo || !st.pags) return;
    var W = 1053, H = 744;
    if (elLienzo.width !== W) { elLienzo.width = W; elLienzo.height = H; }
    var ctx = elLienzo.getContext('2d');
    ctx.clearRect(0, 0, W, H);
    var pw = Math.floor(W / 3);
    var cps = cuerpos(pw, H);
    if (!cps) return;

    if (st.libro) return pintarLibro(ctx, W, H, cps, st.abre);

    cps.forEach(function (off, i) { ctx.drawImage(off, i * pw, 0); });
    EU.ponerLogo(ctx, W, H);
    ctx.save();
    ctx.setLineDash([10, 8]);
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(255,255,255,.45)';
    [pw, pw * 2].forEach(function (x) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    });
    ctx.restore();
  }

  function animarLibro() {
    if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
    st.libro = true;
    var t0 = performance.now(), dur = 1500;
    var paso = function (t) {
      st.abre = Math.min(1, (t - t0) / dur);
      pintarLienzo();
      if (st.abre < 1) rafId = requestAnimationFrame(paso); else rafId = 0;
    };
    st.abre = 0;
    rafId = requestAnimationFrame(paso);
  }

  /* ───────────── Descargas ─────────────
     La hoja de imprenta es un A4 apaisado: 1754 × 1240, tres cuerpos de 584. */

  function hojaImprenta(cara) {
    var guardada = st.cara;
    st.cara = cara;
    invalidar();
    var W = 1754, H = 1240, pw = Math.floor(W / 3);
    var cps = cuerpos(pw, H);
    var cv = document.createElement('canvas');
    cv.width = W; cv.height = H;
    var ctx = cv.getContext('2d');
    if (cps) cps.forEach(function (off, i) { ctx.drawImage(off, i * pw, 0); });
    EU.ponerLogo(ctx, W, H);
    st.cara = guardada;
    invalidar();
    return cv;
  }

  function bajarPNG() {
    var cv = hojaImprenta(st.cara);
    var url = cv.toDataURL('image/png');
    var a = document.createElement('a');
    a.href = url;
    a.download = 'triptico-' + (st.cara === 'ext' ? 'fuera' : 'dentro') + '.png';
    document.body.appendChild(a); a.click(); a.remove();
    if (window.B6Bandeja) B6Bandeja.apuntar(url, a.download, 'triptico');
    EU.toast('Cara ' + (st.cara === 'ext' ? 'de fuera' : 'de dentro') + ' descargada.');
  }

  /* El PDF lleva las dos caras, en este orden: primero la de fuera y luego la
     de dentro. Es como lo espera cualquier imprenta para imprimir a doble
     cara y que los pliegues cuadren. */
  function bajarPDF() {
    if (EU.esPro && !EU.esPro() && window.EU_PLAN && EU_PLAN.muro) return EU_PLAN.muro('pdf');
    var jsPDF = window.jspdf && window.jspdf.jsPDF;
    if (!jsPDF) return EU.toast('El PDF necesita conexión la primera vez.');
    var doc = new jsPDF({ orientation: 'l', unit: 'mm', format: [297, 210] });
    doc.addImage(hojaImprenta('ext').toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, 297, 210);
    doc.addPage([297, 210], 'l');
    doc.addImage(hojaImprenta('int').toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, 297, 210);
    doc.save('triptico.pdf');
    EU.toast('PDF de las dos caras descargado, listo para imprimir a doble cara.');
  }

  /* ───────────── Pantalla ───────────── */

  function pintar() {
    var caja = EU.$('euTriptico');
    if (!caja) return;
    if (!M() || !CB()) {
      caja.innerHTML = '<p class="ayuda">Faltan los motores del folleto en la página.</p>';
      return;
    }
    if (!st.pags) st.pags = nuevoTriptico();

    var h = [];
    h.push('<div class="tp-cols">');

    h.push('<div>');
    h.push('<div style="background:#0a0a14;border:1px solid #2d2d4a;border-radius:12px;padding:14px;' +
      'display:flex;justify-content:center">' +
      '<canvas id="euTriLienzo" width="1053" height="744" style="max-width:100%;height:auto;' +
      'border-radius:6px;box-shadow:0 14px 40px rgba(0,0,0,.6);background:#000"></canvas></div>');

    h.push('<div style="display:flex;gap:7px;flex-wrap:wrap;align-items:center;margin-top:10px">' +
      '<button data-cara="ext" style="' + chip(st.cara === 'ext') + '">Cara de fuera</button>' +
      '<button data-cara="int" style="' + chip(st.cara === 'int') + '">Cara de dentro</button>' +
      '<span style="flex:1"></span>' +
      '<button data-vista="plana" style="' + chip(!st.libro) + '">▭ Plana</button>' +
      '<button data-vista="libro" style="' + chip(st.libro) + '">📖 Libro</button>' +
      '<button id="euTriAbrir" style="' + chip(false) + '">▶ Abrir</button>' +
      '</div>');

    h.push('<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px">' +
      '<button id="euTriRehacer" style="' + chip(false) + '">🔁 Rehacer los textos</button>' +
      '<button id="euTriPNG" style="background:transparent;border:1px solid #2d2d4a;color:#cbd5e1;' +
      'border-radius:9px;padding:9px 14px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit">⬇ Esta cara en PNG</button>' +
      '<button id="euTriPDF" style="background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;border:0;' +
      'border-radius:9px;padding:9px 15px;font-size:12.5px;font-weight:700;cursor:pointer;font-family:inherit">⬇ PDF de las dos caras</button>' +
      '</div>');
    h.push('<div id="euTriBandeja"></div>');
    h.push('</div>');

    /* Ajustes */
    h.push('<div class="tp-panel">');
    h.push('<label style="font-size:10px;color:#94a3b8;margin:0 0 4px;display:block;letter-spacing:.06em;' +
      'text-transform:uppercase">Paleta</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px">');
    Object.keys(M().TEMAS).forEach(function (t) {
      h.push('<button data-tema="' + t + '" style="' + chip(t === st.tema) + '">' +
        EU.esc(M().TEMAS[t].nombre) + '</button>');
    });
    h.push('</div>');

    h.push('<label style="font-size:10px;color:#94a3b8;margin:0 0 4px;display:block;letter-spacing:.06em;' +
      'text-transform:uppercase">Troquel de los cuadros</label><div style="display:flex;gap:6px;flex-wrap:wrap">');
    Object.keys(M().FORMAS_CELDA).forEach(function (f) {
      var F = M().FORMAS_CELDA[f];
      h.push('<button data-forma="' + f + '" title="' + EU.esc(F.nombre) + '" style="' +
        chip(f === st.forma) + '">' + F.icono + ' ' + EU.esc(F.nombre) + '</button>');
    });
    h.push('</div>');

    h.push('<p style="margin:12px 0 0;font-size:10.5px;color:#7c7c9e;line-height:1.55">' +
      'La hoja se imprime en A4 apaisado, 297 × 210 mm, partida en tres cuerpos de 99 mm. ' +
      'El PDF sale con la cara de fuera primero y la de dentro después: es el orden que espera ' +
      'la imprenta para que los pliegues cuadren.</p>');
    h.push('</div>');

    h.push('</div>');
    caja.innerHTML = h.join('');

    elLienzo = EU.$('euTriLienzo');
    enganchar(caja);
    pintarLienzo();

    var host = EU.$('euTriBandeja');
    if (host && window.B6Bandeja) B6Bandeja.panel(host, { origen: 'triptico' }, 'triptico');
  }

  function enganchar(caja) {
    caja.onclick = function (ev) {
      var b = ev.target.closest ? ev.target.closest('button') : null;
      if (!b) return;
      if (b.hasAttribute('data-cara')) { st.cara = b.getAttribute('data-cara'); invalidar(); return pintar(); }
      if (b.hasAttribute('data-vista')) { st.libro = b.getAttribute('data-vista') === 'libro'; st.abre = 1; return pintar(); }
      if (b.hasAttribute('data-tema')) {
        st.tema = b.getAttribute('data-tema');
        ['ext', 'int'].forEach(function (c) {
          (st.pags[c] || []).forEach(function (p) { p.tema = st.tema; });
        });
        invalidar(); return pintar();
      }
      if (b.hasAttribute('data-forma')) {
        st.forma = b.getAttribute('data-forma');
        ['ext', 'int'].forEach(function (c) {
          (st.pags[c] || []).forEach(function (p) { p.formaCelda = st.forma; });
        });
        invalidar(); return pintar();
      }
      if (b.id === 'euTriAbrir') return animarLibro();
      if (b.id === 'euTriRehacer') { st.pags = nuevoTriptico(); invalidar(); return pintar(); }
      if (b.id === 'euTriPNG') return bajarPNG();
      if (b.id === 'euTriPDF') return bajarPDF();
    };
  }

  /* La pantalla lleva dos cosas: el tríptico y la hoja suelta. El conmutador
     enseña una u otra sin tocar lo que ya hace cada una. */
  var modo = 'tri';

  var TEXTOS = {
    tri: ['Tríptico · tres cuerpos por cara',
      'Un A4 apaisado partido en tres, por sus dos caras: la de fuera con la portada y la ' +
      'contraportada, y la de dentro, que es la que se lee con el folleto abierto. Puedes verlo ' +
      'plano —como se imprime— o abriéndose en la mano.'],
    vol: ['Volantes y maquetas · la hoja suelta',
      'Tres cosas distintas según a quién van: el volante que se reparte, el cartel de mostrador ' +
      'y la hoja de mando que se rellena a bolígrafo. Cualquiera de las tres se puede ver puesta ' +
      'en el mundo o como plano de imprenta, con el sangrado y las marcas de corte donde tienen ' +
      'que estar.']
  };

  function poner(m) {
    modo = m;
    var t = EU.$('euTriptico'), v = EU.$('euVolantes');
    var bt = EU.$('euModoTri'), bv = EU.$('euModoVol');
    var ti = EU.$('euTriTit'), ay = EU.$('euTriAyuda');
    if (t) t.style.display = (m === 'tri') ? '' : 'none';
    if (v) v.style.display = (m === 'vol') ? '' : 'none';
    if (bt) bt.classList.toggle('on', m === 'tri');
    if (bv) bv.classList.toggle('on', m === 'vol');
    if (ti) ti.textContent = TEXTOS[m][0];
    if (ay) ay.textContent = TEXTOS[m][1];
    if (m === 'tri') pintar();
    else if (window.EU_VOLANTES) EU_VOLANTES.entrar();
  }

  P.entrar = function () {
    var bt = EU.$('euModoTri'), bv = EU.$('euModoVol');
    if (bt) bt.onclick = function () { poner('tri'); };
    if (bv) bv.onclick = function () { poner('vol'); };
    poner(modo);
  };
  P.salir = function () { if (rafId) { cancelAnimationFrame(rafId); rafId = 0; } };

  window.EU_TRIPTICO = P;
})();

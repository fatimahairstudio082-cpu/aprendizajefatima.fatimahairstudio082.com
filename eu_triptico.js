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
    abre: 1,           // 0 cerrado, 1 abierto del todo
    diseno: '',        // plantilla de folleto que manda en acabados y color
    paletaPro: '',     // combinación profesional
    colores: null,     // colores a mano
    qr: false,         // QR en el cuerpo de contacto
    narra: '',         // lo que se cuenta en el vídeo
    vozBlob: null,     // voz subida o grabada, para meterla dentro
    vozNom: '',
    vozVivo: false,    // narrar con la voz del móvil mientras se graba
    ratio: 'hoja'      // medida del vídeo
  };

  var CLAVE_VOZ = 'tri:narra';
  var RATIOS = {
    hoja: { nombre: 'Como la hoja', W: 0,   H: 0 },
    v:    { nombre: '9:16',         W: 720, H: 1280 },
    q:    { nombre: '1:1',          W: 800, H: 800 },
    h:    { nombre: '16:9',         W: 1280, H: 720 }
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
    /* La plantilla elegida manda en acabados, troquel y color; el tríptico
       sigue siendo de tres cuerpos, así que la rejilla no se toca. */
    var D = window.FOLLETO_DISENOS && st.diseno ? FOLLETO_DISENOS.get(st.diseno) : null;
    if (D) {
      if (D.adornos) p.adornos = Object.assign({}, p.adornos, D.adornos);
      if (D.formaCelda) p.formaCelda = D.formaCelda;
      if (D.tema) p.tema = D.tema;
      if (D.colores) p.colores = Object.assign({}, D.colores);
    }
    if (st.paletaPro && window.EU_EDITOR && EU_EDITOR.PALETAS_PRO) {
      var PP = EU_EDITOR.PALETAS_PRO.filter(function (x) { return x.id === st.paletaPro; })[0];
      if (PP) { p.paletaPro = PP.id; p.colores = Object.assign({}, PP.c); }
    }
    if (st.colores) p.colores = Object.assign({}, p.colores || {}, st.colores);
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
    var clave = pw + '|' + st.cara + '|' + st.tema + '|' + st.forma + '|' + st.qr + '|' +
      st.diseno + '|' + st.paletaPro + '|' + JSON.stringify(st.colores || 0) + '|' +
      pags.map(function (p) {
        return p.cabecera.titulo + '¬' + (p.cabecera.sub || '') + '¬' +
          (p.celdas || []).map(function (c) { return (c.titulo || '') + (c.media ? '·f' : ''); }).join('|');
      }).join('~');
    if (cacheClave === clave && cacheCuerpos) return cacheCuerpos;
    cacheCuerpos = pags.map(function (pag, i) {
      var off = document.createElement('canvas');
      off.width = pw; off.height = H;
      var op = { formaCelda: pag.formaCelda || 'suave' };
      // el QR va en el cuerpo del contacto, que es el último de la cara
      if (st.qr && i === pags.length - 1 && EU.qr && EU.qr.el) {
        op.qr = EU.qr.el;
        op.qrTexto = EU.qr.etiqueta || 'Escanéame';
      }
      M().pintar(off.getContext('2d'), pw, H, pag, op);
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
      (st.libro ? '<button id="euTriOtra" style="' + chip(false) + '">↺ Abrir otra vez</button>' : '') +
      '</div>');

    h.push('<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px">' +
      '<button id="euTriRehacer" style="' + chip(false) + '">🔁 Rehacer los textos</button>' +
      '<button id="euTriPNG" style="background:transparent;border:1px solid #2d2d4a;color:#cbd5e1;' +
      'border-radius:9px;padding:9px 14px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit">⬇ Esta cara en PNG</button>' +
      '<button id="euTriAmbas" style="background:transparent;border:1px solid #2d2d4a;color:#cbd5e1;' +
      'border-radius:9px;padding:9px 14px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit">⬇ Las 2 caras</button>' +
      '<button id="euTriCuerpos" style="background:transparent;border:1px solid #2d2d4a;color:#cbd5e1;' +
      'border-radius:9px;padding:9px 14px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit">⬇ Los 6 cuerpos</button>' +
      '<button id="euTriPDF" style="background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;border:0;' +
      'border-radius:9px;padding:9px 15px;font-size:12.5px;font-weight:700;cursor:pointer;font-family:inherit">⬇ PDF de las dos caras</button>' +
      '</div>');
    h.push('<div id="euTriBandeja"></div>');
    h.push('</div>');

    /* Ajustes */
    h.push('<div class="tp-panel">');

    /* Plantilla: la del catálogo de folletos manda en acabados y color. */
    var lista = window.FOLLETO_DISENOS ? FOLLETO_DISENOS.lista() : [];
    h.push('<label class="mini-lbl">Plantilla del tríptico</label>' +
      '<select id="euTriDiseno" style="width:100%;background:#0f0f22;border:1px solid #2d2d4a;' +
      'color:#e2e8f0;border-radius:8px;padding:8px;font-size:12px;font-family:inherit">' +
      '<option value="">Sin plantilla · sólo la paleta de abajo</option>' +
      lista.map(function (d) {
        return '<option value="' + EU.esc(d.id) + '"' + (d.id === st.diseno ? ' selected' : '') + '>' +
          EU.esc(d.nombre) + '</option>';
      }).join('') + '</select>');

    /* Fotos y vídeos: se reparten por los cuadros de esta cara, en orden. */
    h.push('<label class="mini-lbl" style="margin-top:12px">Tus fotos y vídeos</label>' +
      '<input type="file" accept="image/*,video/*" multiple id="euTriFotos" style="font-size:11px;width:100%">' +
      '<div style="font-size:10.5px;color:#7c7c9e;line-height:1.5;margin-top:4px">' +
      'Se reparten por los cuadros de esta cara, en orden.</div>' +
      '<button class="btn btn-g btn-sm" id="euTriQuitaFotos" style="width:100%;margin-top:6px">' +
      'Quitar las fotos de esta cara</button>');

    /* Los tres cuerpos de la cara que se está viendo. */
    var pags = paginas() || [];
    h.push('<label class="mini-lbl" style="margin-top:14px">Cuerpos de esta cara</label>');
    pags.forEach(function (pg, i) {
      h.push('<div style="background:#141430;border:1px solid #2d2d4a;border-radius:9px;padding:8px;margin-bottom:6px">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px">' +
        '<span style="font-size:10px;color:#a855f7;font-weight:700">Cuerpo ' + (i + 1) + '</span>' +
        '<button data-regen="' + i + '" title="Rehacer este cuerpo" style="' + chip(false) +
        ';padding:3px 9px;font-size:11px">🔁</button></div>' +
        '<input data-ttit="' + i + '" value="' + EU.esc(pg.cabecera.titulo || '') + '" ' +
        'placeholder="título" style="width:100%;background:#0f0f22;border:1px solid #2d2d4a;color:#e2e8f0;' +
        'border-radius:7px;padding:7px;font-size:11.5px;margin-bottom:5px;font-family:inherit">' +
        '<input data-tsub="' + i + '" value="' + EU.esc(pg.cabecera.sub || '') + '" ' +
        'placeholder="subtítulo" style="width:100%;background:#0f0f22;border:1px solid #2d2d4a;color:#94a3b8;' +
        'border-radius:7px;padding:7px;font-size:11px;margin-bottom:5px;font-family:inherit">' +
        '<input type="file" accept="image/*,video/*" data-tfoto="' + i + '" style="font-size:10.5px;width:100%">' +
        '</div>');
    });

    h.push('<label class="mini-lbl" style="margin-top:14px">Paleta</label><div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px">');
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

    var PP = (window.EU_EDITOR && EU_EDITOR.PALETAS_PRO) || [];
    if (PP.length) {
      h.push('<label class="mini-lbl" style="margin-top:14px">Combinaciones profesionales</label>' +
        '<div style="display:flex;gap:6px;flex-wrap:wrap">' +
        '<button data-pro="" style="' + chip(!st.paletaPro) + '">Ninguna</button>' +
        PP.map(function (x) {
          return '<button data-pro="' + EU.esc(x.id) + '" style="' + chip(st.paletaPro === x.id) + '">' +
            '<i style="width:11px;height:11px;border-radius:3px;background:' + x.c.acento +
            ';display:inline-block;margin-right:4px"></i>' + EU.esc(x.n) + '</button>';
        }).join('') + '</div>');
    }

    var Cnow = M().colores(pags[0] || { tema: st.tema });
    h.push('<label class="mini-lbl" style="margin-top:14px">Colores a tu gusto</label>' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
      [['fondo', 'Fondo'], ['panel', 'Panel'], ['tinta', 'Tinta'], ['acento', 'Acento'], ['acento2', 'Acento 2']]
        .map(function (c) {
          return '<label style="font-size:10px;color:#94a3b8;display:flex;flex-direction:column;gap:3px;align-items:center">' +
            c[1] + '<input type="color" data-tcol="' + c[0] + '" value="' +
            EU.esc((st.colores && st.colores[c[0]]) || Cnow[c[0]] || '#000000') + '" ' +
            'style="width:40px;height:28px;border:1px solid #2d2d4a;border-radius:6px;background:#0f0f22;padding:1px;cursor:pointer"></label>';
        }).join('') + '</div>' +
      '<button class="btn btn-g btn-sm" id="euTriColRes" style="margin-top:7px">Volver a los de la paleta</button>');

    h.push('<label class="mini-lbl" style="margin-top:14px">QR en el cuerpo de contacto</label>' +
      '<button data-triqr="1" style="' + chip(st.qr) + '">' +
      (st.qr ? '🔳 Puesto' : '🔳 Poner el QR') + '</button>' +
      (EU.qr && EU.qr.el ? '' :
        '<div style="font-size:10.5px;color:#7c7c9e;line-height:1.5;margin-top:5px">' +
        'Antes hay que generarlo en la pestaña QR.</div>'));

    /* Vídeo del tríptico: lo que se cuenta, la medida y la voz. */
    h.push('<label class="mini-lbl" style="margin-top:16px">Vídeo del tríptico con narración</label>' +
      '<p style="margin:0 0 6px;font-size:10.5px;color:#7c7c9e;line-height:1.5">' +
      'Escribe lo que quieres que se cuente. Sale rotulado <b>dentro</b> del vídeo.</p>' +
      '<textarea id="euTriNarra" rows="3" placeholder="Ej.: En Estudio Nube cuidamos tu color de ' +
      'principio a fin. Abre y mira los tratamientos. Pide cita por WhatsApp." ' +
      'style="width:100%;background:#0f0f22;border:1px solid #2d2d4a;color:#e2e8f0;border-radius:8px;' +
      'padding:8px;font-size:11.5px;resize:vertical;line-height:1.6;font-family:inherit">' +
      EU.esc(st.narra) + '</textarea>');

    h.push('<label class="mini-lbl">Medida del vídeo</label><div style="display:flex;gap:6px;flex-wrap:wrap">' +
      Object.keys(RATIOS).map(function (k) {
        return '<button data-tratio="' + k + '" style="' + chip(st.ratio === k) + '">' +
          EU.esc(RATIOS[k].nombre) + '</button>';
      }).join('') + '</div>');

    h.push('<div class="tira" style="margin-top:9px">' +
      '<button class="btn btn-sm" id="euTriVideo">⏺ Grabar vídeo narrado</button>' +
      '<button class="btn btn-g btn-sm" id="euTriLibroVid">⏺ Vídeo del libro</button></div>');

    var tieneVoz = !!(st.vozBlob || (window.EU_VOZ && EU_VOZ.tieneAudio(CLAVE_VOZ)));
    h.push('<label class="mini-lbl" style="margin-top:12px">Voz dentro del vídeo</label>' +
      '<div class="st ' + (tieneVoz ? 'ok' : '') + '" style="margin:0 0 7px;padding:5px 9px;font-size:10.5px">' +
      (tieneVoz ? 'Hay voz: ' + EU.esc(st.vozNom || 'grabada aquí') : 'Sin voz · el vídeo saldrá mudo') + '</div>' +
      '<div class="tira">' +
      '<button class="btn btn-g btn-sm" id="euTriVozGrab">' +
      (window.EU_VOZ && EU_VOZ.grabando() ? '■ Parar' : '● Grabar') + '</button>' +
      '<button class="btn btn-g btn-sm" id="euTriVozSubir">📁 Subir audio</button>' +
      (tieneVoz ? '<button class="btn btn-g btn-sm" id="euTriVozOir">▶ Oír</button>' +
        '<button class="btn btn-g btn-sm" id="euTriVozQuitar">Quitar</button>' : '') +
      '</div>' +
      '<input type="file" accept="audio/*" id="euTriVozFile" style="display:none">' +
      '<div class="fila" style="margin-top:8px"><input type="checkbox" id="euTriVozVivo"' +
      (st.vozVivo ? ' checked' : '') + ' style="width:auto">' +
      '<span style="font-size:11.5px">Narrar en directo con la voz del móvil</span></div>' +
      '<p style="font-size:10.5px;color:#7c7c9e;line-height:1.5;margin:6px 0 0">' +
      'La voz del móvil suena por el altavoz y no entra en el archivo. Para que entre, ' +
      'grábala o súbela aquí.</p>');

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
      if (b.hasAttribute('data-pro')) {
        st.paletaPro = b.getAttribute('data-pro');
        st.colores = null;
        st.pags = nuevoTriptico(); invalidar(); return pintar();
      }
      if (b.hasAttribute('data-triqr')) {
        if (!st.qr && !(EU.qr && EU.qr.el)) return EU.toast('Genera antes el código en la pestaña QR.');
        st.qr = !st.qr; invalidar(); return pintar();
      }
      if (b.hasAttribute('data-regen')) {
        var ri = parseInt(b.getAttribute('data-regen'), 10);
        var pgs = paginas();
        if (pgs && pgs[ri]) {
          var n = (pgs[ri].celdas || []).length || 1;
          var nuevo = unaPagina(n, Date.now() % 9999);
          // las fotos que ya estuvieran puestas no se pierden al rehacer el texto
          (pgs[ri].celdas || []).forEach(function (c, k) {
            if (c.media && nuevo.celdas[k]) nuevo.celdas[k].media = c.media;
          });
          pgs[ri] = nuevo;
        }
        invalidar(); return pintar();
      }
      if (b.id === 'euTriOtra') { st.abre = 0; return animarLibro(); }
      if (b.id === 'euTriColRes') { st.colores = null; st.pags = nuevoTriptico(); invalidar(); return pintar(); }
      if (b.id === 'euTriQuitaFotos') {
        (paginas() || []).forEach(function (pg) {
          (pg.celdas || []).forEach(function (c) { delete c.media; });
        });
        invalidar(); return pintar();
      }
      if (b.id === 'euTriAbrir') return animarLibro();
      if (b.id === 'euTriRehacer') { st.pags = nuevoTriptico(); invalidar(); return pintar(); }
      if (b.id === 'euTriPNG') return bajarPNG();
      if (b.id === 'euTriAmbas') return bajarAmbas();
      if (b.id === 'euTriCuerpos') return bajarCuerpos();
      if (b.id === 'euTriPDF') return bajarPDF();
      if (b.hasAttribute('data-tratio')) { st.ratio = b.getAttribute('data-tratio'); return pintar(); }
      if (b.id === 'euTriVideo') return grabarNarrado();
      if (b.id === 'euTriLibroVid') return grabarLibro();
      if (b.id === 'euTriVozSubir') { EU.$('euTriVozFile').click(); return; }
      if (b.id === 'euTriVozGrab') {
        if (!window.EU_VOZ) return EU.toast('La voz no se ha cargado.');
        if (EU_VOZ.grabando()) {
          return EU_VOZ.pararGrabacion().then(function () { st.vozBlob = null; st.vozNom = ''; pintar(); })
            .catch(function (e) { EU.toast(e.message || 'No se pudo parar.'); pintar(); });
        }
        return EU_VOZ.grabar(CLAVE_VOZ, function () { pintar(); })
          .catch(function (e) { EU.toast(e.message || 'No se pudo grabar.'); pintar(); });
      }
      if (b.id === 'euTriVozOir') {
        if (st.vozBlob) {
          var a = new Audio(URL.createObjectURL(st.vozBlob));
          a.play().catch(function () {});
          return;
        }
        return EU_VOZ.hablar('', CLAVE_VOZ);
      }
      if (b.id === 'euTriVozQuitar') {
        st.vozBlob = null; st.vozNom = '';
        if (window.EU_VOZ) EU_VOZ.borrarAudio(CLAVE_VOZ);
        return pintar();
      }
    };

    /* Lo que se escribe repinta la hoja pero NO vuelve a montar el panel: el
       cursor se quedaría fuera del campo en cada letra. */
    caja.oninput = function (ev) {
      var t = ev.target, pgs = paginas();
      if (!t || !pgs) return;
      if (t.hasAttribute('data-ttit')) {
        pgs[parseInt(t.getAttribute('data-ttit'), 10)].cabecera.titulo = t.value;
        invalidar(); return pintarLienzo();
      }
      if (t.hasAttribute('data-tsub')) {
        pgs[parseInt(t.getAttribute('data-tsub'), 10)].cabecera.sub = t.value;
        invalidar(); return pintarLienzo();
      }
      if (t.id === 'euTriNarra') { st.narra = t.value; return; }
      if (t.hasAttribute('data-tcol')) {
        st.colores = st.colores || {};
        st.colores[t.getAttribute('data-tcol')] = t.value;
        ['ext', 'int'].forEach(function (c) {
          (st.pags[c] || []).forEach(function (p) {
            p.colores = Object.assign({}, p.colores || {}, st.colores);
          });
        });
        invalidar(); return pintarLienzo();
      }
    };

    caja.onchange = function (ev) {
      var t = ev.target;
      if (!t) return;
      if (t.id === 'euTriDiseno') {
        st.diseno = t.value;
        st.pags = nuevoTriptico(); invalidar();
        return pintar();
      }
      if (t.hasAttribute('data-tfoto')) return ponerFoto(t, parseInt(t.getAttribute('data-tfoto'), 10));
      if (t.id === 'euTriFotos') return repartirFotos(t);
      if (t.id === 'euTriVozFile') {
        var f = t.files && t.files[0];
        if (!f) return;
        st.vozBlob = f; st.vozNom = f.name;
        if (window.EU_VOZ) EU_VOZ.borrarAudio(CLAVE_VOZ);
        return pintar();
      }
      if (t.id === 'euTriVozVivo') { st.vozVivo = t.checked; return; }
    };
  }

  /* Un archivo en el primer cuadro de un cuerpo. */
  function ponerFoto(input, i) {
    var f = input.files && input.files[0];
    var pgs = paginas();
    if (!f || !pgs || !pgs[i] || !pgs[i].celdas || !pgs[i].celdas.length) return;
    medio(f, function (m) {
      pgs[i].celdas[0].media = m;
      invalidar(); pintar();
    });
  }

  /* Varias de golpe: se reparten por los cuadros de esta cara, en orden. */
  function repartirFotos(input) {
    var fs = Array.prototype.slice.call(input.files || []);
    var pgs = paginas();
    if (!fs.length || !pgs) return;
    var huecos = [];
    pgs.forEach(function (pg) {
      (pg.celdas || []).forEach(function (c) { huecos.push(c); });
    });
    fs.slice(0, huecos.length).forEach(function (f, k) {
      medio(f, function (m) { huecos[k].media = m; invalidar(); pintarLienzo(); });
    });
    setTimeout(pintar, 600);
    EU.toast(Math.min(fs.length, huecos.length) + ' en los cuadros de esta cara.');
  }

  /* Un vídeo se queda en su primer fotograma: lo pinta `cubrir`, que ya sabe
     distinguir vídeo de foto. */
  function medio(f, alTener) {
    var esVid = /^video\//.test(f.type);
    var el = esVid ? document.createElement('video') : new Image();
    if (esVid) { el.muted = true; el.playsInline = true; el.preload = 'auto'; }
    el.onloadeddata = el.onload = function () { invalidar(); pintarLienzo(); };
    el.onerror = function () { EU.toast('No se pudo leer ese archivo.'); };
    el.src = URL.createObjectURL(f);
    alTener({ el: el, tipo: esVid ? 'vid' : 'img' });
  }

  /* ───────────── Vídeo ─────────────
     Dos vídeos: el libro abriéndose, y el narrado, que enseña la cara de
     fuera, abre, y se queda en la de dentro con el rótulo de lo que se
     cuenta. La voz, si la hay, va DENTRO del archivo. */

  function medidasVid() {
    var R = RATIOS[st.ratio];
    if (R && R.W) return { W: R.W, H: R.H };
    return { W: 1054, H: 744 };          // la proporción de la hoja
  }

  function rotularNarra(ctx, W, H) {
    var t = (st.narra || '').trim();
    if (!t) return;
    var M = M_(), C = M.colores((paginas() || [])[0] || { tema: st.tema });
    var tam = Math.round(W * 0.030);
    ctx.save();
    ctx.font = '600 ' + tam + 'px ' + '"Segoe UI",Arial,sans-serif';
    ctx.textAlign = 'center';
    var lineas = [], linea = '';
    t.split(/\s+/).forEach(function (p) {
      var pr = linea ? linea + ' ' + p : p;
      if (ctx.measureText(pr).width > W * 0.82 && linea) { lineas.push(linea); linea = p; }
      else linea = pr;
    });
    if (linea) lineas.push(linea);
    lineas = lineas.slice(-3);
    var alto = lineas.length * tam * 1.35 + tam * 0.9;
    var y0 = H - alto - H * 0.045;
    ctx.fillStyle = M.rgba(C.fondo, 0.72);
    M.redondo(ctx, W * 0.06, y0, W * 0.88, alto, tam * 0.5);
    ctx.fill();
    ctx.fillStyle = C.tinta;
    lineas.forEach(function (l, i) {
      ctx.fillText(l, W / 2, y0 + tam * 1.15 + i * tam * 1.35);
    });
    ctx.restore();
  }

  function M_() { return window.FOLLETO_MOTOR; }

  /* Prepara la mezcla y graba `dur` segundos pintando con `alFotograma`. */
  function grabarLienzo(dur, alFotograma, nombre) {
    if (!EU_PLAN.exigeSesion()) return;
    if (!window.MediaRecorder || !document.createElement('canvas').captureStream) {
      return EU.toast('Este navegador no sabe grabar vídeo. Prueba en Chrome.');
    }
    var m = medidasVid();
    var cv = document.createElement('canvas');
    cv.width = Math.round(m.W / 2) * 2; cv.height = Math.round(m.H / 2) * 2;
    var ctx = cv.getContext('2d');
    alFotograma(ctx, cv.width, cv.height, 0);

    var flujo = new MediaStream();
    cv.captureStream(30).getVideoTracks().forEach(function (t) { flujo.addTrack(t); });

    var url = st.vozBlob ? null : (window.EU_VOZ && EU_VOZ.audioDe(CLAVE_VOZ));
    var conSonido = !!(st.vozBlob || url);
    var tipo = '';
    (conSonido
      ? ['video/mp4;codecs=avc1.42E01E,mp4a.40.2', 'video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm']
      : ['video/mp4;codecs=avc1', 'video/mp4', 'video/webm;codecs=vp9', 'video/webm']
    ).some(function (x) {
      if (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(x)) { tipo = x; return true; }
      return false;
    });

    var ac = null, fuente = null;
    var seguir = function () { arranca(); };
    if (conSonido) {
      var A = window.AudioContext || window.webkitAudioContext;
      if (!A) { conSonido = false; seguir(); }
      else {
        ac = acMix || (acMix = new A());
        if (ac.state === 'suspended') { try { ac.resume(); } catch (e) {} }
        var dest = ac.createMediaStreamDestination();
        var leer = st.vozBlob
          ? st.vozBlob.arrayBuffer()
          : fetch(url).then(function (r) { return r.arrayBuffer(); });
        leer.then(function (ab) { return ac.decodeAudioData(ab); }).then(function (buf) {
          var g = ac.createGain(); g.gain.value = 1;
          fuente = ac.createBufferSource(); fuente.buffer = buf;
          fuente.connect(g); g.connect(dest); g.connect(ac.destination);
          dest.stream.getAudioTracks().forEach(function (t) { flujo.addTrack(t); });
          seguir();
        }).catch(function () { conSonido = false; seguir(); });
      }
    } else seguir();

    function arranca() {
      var rec;
      try { rec = new MediaRecorder(flujo, tipo ? { mimeType: tipo, videoBitsPerSecond: 4500000 } : undefined); }
      catch (e) { return EU.toast('No se pudo grabar: ' + (e.message || e)); }
      var trozos = [];
      rec.ondataavailable = function (e) { if (e.data && e.data.size) trozos.push(e.data); };
      rec.onstop = function () {
        try { if (fuente) fuente.stop(); } catch (e) {}
        var mp4 = /mp4/.test(rec.mimeType || tipo || '');
        var b = new Blob(trozos, { type: mp4 ? 'video/mp4' : 'video/webm' });
        var arch = nombre + (mp4 ? '.mp4' : '.webm');
        EU_EDITOR.bajar(b, arch);
        if (window.B6Bandeja) {
          var u = URL.createObjectURL(b);
          B6Bandeja.apuntar(u, arch, 'triptico');
          setTimeout(function () { URL.revokeObjectURL(u); }, 10000);
        }
        EU.toast('Vídeo descargado' + (conSonido ? ' con la voz dentro' : '') +
          '. Pesa ' + Math.round(b.size / 1024) + ' KB.');
        pintar();
      };
      EU.toast('Grabando ' + dur.toFixed(1) + ' s. No cambies de pestaña.');
      rec.start();
      if (fuente) { try { fuente.start(); } catch (e) {} }
      if (st.vozVivo && st.narra && window.EU_VOZ && EU_VOZ.disponible) {
        try { EU_VOZ.hablar(st.narra, null); } catch (e) {}
      }
      var t0 = performance.now();
      (function paso() {
        var t = (performance.now() - t0) / 1000;
        var pr = Math.min(1, t / dur);
        alFotograma(ctx, cv.width, cv.height, pr);
        if (pr >= 1) { setTimeout(function () { try { rec.stop(); } catch (e) {} }, 200); return; }
        requestAnimationFrame(paso);
      })();
    }
  }

  var acMix = null;

  /* El libro abriéndose, sin más. */
  function grabarLibro() {
    var guardadaC = st.cara, guardadoL = st.libro, guardadoA = st.abre;
    st.cara = 'ext'; st.libro = true;
    grabarLienzo(4, function (ctx, W, H, pr) {
      st.abre = Math.min(1, pr / 0.75);
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, W, H);
      var cps = cuerpos(Math.floor(1053 / 3), 744);
      if (cps) pintarLibro(ctx, W, H, cps, st.abre);
      EU.ponerLogo(ctx, W, H);
      EU_PLAN.marcaAgua(ctx, W, H);
      ctx.restore();
      if (pr >= 1) { st.cara = guardadaC; st.libro = guardadoL; st.abre = guardadoA; }
    }, 'triptico-libro');
  }

  /* El narrado: fuera, abre, y se queda dentro con el rótulo. */
  function grabarNarrado() {
    var guardadaC = st.cara, guardadoL = st.libro, guardadoA = st.abre;
    var dur = Math.max(6, Math.min(30, (st.narra || '').split(/\s+/).length / 2.6));
    grabarLienzo(dur, function (ctx, W, H, pr) {
      // 0–35 % la cara de fuera abriéndose · 35–100 % la de dentro
      var fuera = pr < 0.35;
      st.cara = fuera ? 'ext' : 'int';
      st.libro = fuera;
      st.abre = fuera ? Math.min(1, pr / 0.30) : 1;
      invalidar();
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, W, H);
      var pw = Math.floor(1053 / 3);
      var cps = cuerpos(pw, 744);
      if (cps) {
        if (fuera) pintarLibro(ctx, W, H, cps, st.abre);
        else {
          var e = Math.min(W / 1053, H / 744);
          var ox = (W - 1053 * e) / 2, oy = (H - 744 * e) / 2;
          ctx.save();
          ctx.translate(ox, oy); ctx.scale(e, e);
          cps.forEach(function (off, i) { ctx.drawImage(off, i * pw, 0); });
          ctx.restore();
        }
      }
      rotularNarra(ctx, W, H);
      EU.ponerLogo(ctx, W, H);
      EU_PLAN.marcaAgua(ctx, W, H);
      ctx.restore();
      if (pr >= 1) { st.cara = guardadaC; st.libro = guardadoL; st.abre = guardadoA; invalidar(); }
    }, 'triptico-narrado');
  }

  /* Las dos caras, y los seis cuerpos sueltos. */
  function bajarAmbas() {
    ['ext', 'int'].forEach(function (c, i) {
      setTimeout(function () {
        var cv = hojaImprenta(c);
        cv.toBlob(function (b) {
          if (!b) return;
          var nom = 'triptico-' + (c === 'ext' ? 'fuera' : 'dentro') + '.png';
          EU_EDITOR.bajar(b, nom);
          if (window.B6Bandeja) {
            var u = URL.createObjectURL(b);
            B6Bandeja.apuntar(u, nom, 'triptico');
            setTimeout(function () { URL.revokeObjectURL(u); }, 10000);
          }
        }, 'image/png');
      }, i * 500);
    });
    EU.toast('Las dos caras, una detrás de otra.');
  }

  function bajarCuerpos() {
    var guardada = st.cara, n = 0;
    ['ext', 'int'].forEach(function (c) {
      st.cara = c; invalidar();
      var pgs = paginas() || [];
      var W = 1754, H = 1240, pw = Math.floor(W / 3);
      var cps = cuerpos(pw, H) || [];
      cps.forEach(function (off, i) {
        var cv = document.createElement('canvas');
        cv.width = pw; cv.height = H;
        var ctx = cv.getContext('2d');
        ctx.drawImage(off, 0, 0);
        EU.ponerLogo(ctx, pw, H);
        var nom = 'triptico-' + (c === 'ext' ? 'fuera' : 'dentro') + '-cuerpo' + (i + 1) + '.png';
        if (window.B6Bandeja) B6Bandeja.apuntar(cv.toDataURL('image/png'), nom, 'triptico');
        n++;
      });
    });
    st.cara = guardada; invalidar(); pintarLienzo();
    if (!window.B6Bandeja) return EU.toast('La bandeja no está cargada.');
    EU.toast('Los ' + n + ' cuerpos están en la bandeja: bájalos sueltos o en ZIP.');
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

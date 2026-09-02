/* ══════════════════════════════════════════════════════════════════
   ESTUDIO UNIVERSAL · VOLANTES Y MAQUETAS
   ------------------------------------------------------------------
   La hoja suelta, que son tres cosas distintas según a quién va:

     · el volante de mano, que se reparte o se buzonea,
     · el cartel de mostrador, que se lee de pie y de lejos,
     · la hoja de mando, que se imprime y se rellena a bolígrafo.

   No dibuja nada por su cuenta: todo sale de b6_volantes.js, que a su
   vez usa el motor de folletos y el cerebro de redacción. Aquí sólo
   está la pantalla: elegir, ver la pieza puesta en el mundo o como
   plano de imprenta, y bajarla.

   La hoja se pinta UNA vez a tamaño de imprenta y de ahí salen las
   tres vistas, así que lo que se enseña y lo que se descarga son el
   mismo píxel.
   ══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if (window._EU_VOLANTES_LOADED) return;
  window._EU_VOLANTES_LOADED = true;

  var P = {};

  var st = {
    variante: 'mano',
    id: '',
    vista: 'contexto',       // hoja · contexto · montaje
    escena: 'mesa',
    tema: '',
    qr: false,
    semilla: 0,
    pag: null
  };

  var elLienzo = null;
  var cacheClave = '', cacheHoja = null;

  function V() { return window.VOLANTES || null; }
  function M() { return window.FOLLETO_MOTOR || null; }

  function chip(on) {
    return 'flex:none;border-radius:20px;padding:7px 13px;font-size:11.5px;cursor:pointer;' +
      'white-space:nowrap;font-family:inherit;' +
      (on ? 'background:#22224a;border:1px solid #7c3aed;color:#fff;font-weight:600'
          : 'background:transparent;border:1px solid #2d2d4a;color:#94a3b8');
  }

  var VISTAS = [
    { id: 'hoja',     n: '📄 La hoja' },
    { id: 'contexto', n: '📷 Puesta en el mundo' },
    { id: 'montaje',  n: '📐 Plano de imprenta' }
  ];

  /* ───────────── La hoja ───────────── */

  function plantilla() {
    var v = V();
    if (!v) return null;
    if (!st.id) primeraDe(st.variante);
    return v.get(st.id);
  }

  function primeraDe(variante) {
    var l = V().lista(variante);
    st.id = l.length ? l[0].id : '';
    st.pag = null;
    invalidar();
  }

  function esOrden() {
    var p = plantilla();
    return !!(p && p.variante === 'orden');
  }

  function nuevaPagina() {
    var v = V(), marca = (window.EU && EU.marca) || {};
    var pag = v.pagina(st.id, {
      rubro: EU.rubro, tono: EU.tono,
      negocio: marca.nombre || 'Tu negocio',
      ciudad: marca.dir || '',
      contacto: EU.contactoTexto ? EU.contactoTexto() : '',
      semilla: 700 + st.semilla,
      paletas: (window.EU_EDITOR && EU_EDITOR.PALETAS_PRO) || []
    });
    // la paleta elegida a mano manda sobre la que trae la plantilla
    if (pag && !pag.orden && st.tema) {
      pag.tema = st.tema;
      delete pag.colores;
      delete pag.paletaPro;
    }
    return pag;
  }

  function invalidar() { cacheClave = ''; cacheHoja = null; }

  /* Pintar un A4 en cada movimiento no hace falta y se nota: la hoja se
     guarda hasta que cambie algo que la afecte de verdad. */
  function hoja() {
    var L = EU.logo || {};
    var clave = [st.id, st.tema, st.qr, st.semilla, L.url ? L.url.length : 0, L.pos, L.tam,
      JSON.stringify(EU.marca || {})].join('|');
    if (cacheClave === clave && cacheHoja) return cacheHoja;
    if (!st.pag) st.pag = nuevaPagina();
    var op = { contacto: EU.contactoTexto ? EU.contactoTexto() : '' };
    // el QR es el mismo que se pone en el folleto, desde la pestaña QR
    if (st.qr && EU.qr && EU.qr.el) {
      op.qr = EU.qr.el;
      op.qrTexto = EU.qr.etiqueta || 'Escanéame';
    }
    cacheHoja = V().hoja(st.id, st.pag, op);
    EU.ponerLogo(cacheHoja.getContext('2d'), cacheHoja.width, cacheHoja.height);
    cacheClave = clave;
    return cacheHoja;
  }

  /* ───────────── Pintar ───────────── */

  function pintarLienzo() {
    var cv = elLienzo;
    if (!cv || !V()) return;
    var md = V().medidas(st.id), hj = hoja();
    var caja = cv.parentNode ? cv.parentNode.clientWidth - 28 : 560;
    var W, H;
    if (st.vista === 'hoja') {
      W = Math.max(220, Math.min(620, caja));
      H = Math.round(W * md.H / md.W);
    } else {
      W = Math.max(240, Math.min(720, caja));
      H = Math.round(W * 0.75);
    }
    if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; }
    var g = cv.getContext('2d');
    g.clearRect(0, 0, W, H);
    if (st.vista === 'hoja') {
      g.drawImage(hj, 0, 0, W, H);
      EU_PLAN.marcaAgua(g, W, H);
    } else if (st.vista === 'montaje') {
      V().montaje(g, W, H, st.id, hj);
    } else {
      V().contexto(g, W, H, st.id, hj, st.escena);
      EU_PLAN.marcaAgua(g, W, H);
    }
  }

  /* Un lienzo de la vista de ahora a tamaño de descarga. */
  function lienzoVista() {
    var md = V().medidas(st.id), hj = hoja();
    var cv = document.createElement('canvas');
    if (st.vista === 'hoja') { cv.width = md.W; cv.height = md.H; }
    else { cv.width = 1600; cv.height = 1200; }
    var g = cv.getContext('2d');
    if (st.vista === 'hoja') g.drawImage(hj, 0, 0);
    else if (st.vista === 'montaje') V().montaje(g, cv.width, cv.height, st.id, hj);
    else V().contexto(g, cv.width, cv.height, st.id, hj, st.escena);
    EU_PLAN.marcaAgua(g, cv.width, cv.height);
    return cv;
  }

  /* ───────────── Descargas ───────────── */

  function nombre(sufijo) {
    var p = plantilla();
    return EU_EDITOR.limpio((EU.marca && EU.marca.nombre) || 'volante') + '-' +
      EU_EDITOR.limpio(p ? p.n : st.id) + (sufijo ? '-' + sufijo : '');
  }

  function bajarLienzo(cv, arch) {
    cv.toBlob(function (b) {
      if (!b) return EU.estado('euVolEstado', 'No se ha podido crear la imagen.', 'err');
      EU_EDITOR.bajar(b, arch + '.png');
      if (window.B6Bandeja) {
        var u = URL.createObjectURL(b);
        B6Bandeja.apuntar(u, arch + '.png', 'volantes');
        setTimeout(function () { URL.revokeObjectURL(u); }, 10000);
      }
      EU.estado('euVolEstado', 'Descargado ' + arch + '.png (' + Math.round(b.size / 1024) + ' KB).', 'ok');
    }, 'image/png');
  }

  function bajarHoja() {
    if (!EU_PLAN.exigeSesion()) return;
    var md = V().medidas(st.id), hj = hoja();
    var cv = document.createElement('canvas');
    cv.width = md.W; cv.height = md.H;
    var g = cv.getContext('2d');
    g.drawImage(hj, 0, 0);
    EU_PLAN.marcaAgua(g, cv.width, cv.height);
    bajarLienzo(cv, nombre('hoja'));
  }

  function bajarVista() {
    if (!EU_PLAN.exigeSesion()) return;
    bajarLienzo(lienzoVista(), nombre(st.vista));
  }

  function bajarMontaje() {
    if (!EU_PLAN.exigeSesion()) return;
    var hj = hoja();
    var cv = document.createElement('canvas');
    cv.width = 1600; cv.height = 1200;
    V().montaje(cv.getContext('2d'), 1600, 1200, st.id, hj);
    bajarLienzo(cv, nombre('montaje'));
  }

  /* PDF a tamaño real de la pieza, con 3 mm de sangrado por lado: es lo que
     pide una imprenta y lo que evita el filo blanco al guillotinar. */
  function bajarPDF() {
    if (!EU_PLAN.exigeSesion()) return;
    var jsPDF = (window.jspdf && window.jspdf.jsPDF) || window.jsPDF;
    if (!jsPDF) return EU.estado('euVolEstado', 'El PDF necesita conexión la primera vez.', 'err');
    var md = V().medidas(st.id), hj = hoja();
    var SANG = 3;
    var pw = md.mmW + SANG * 2, ph = md.mmH + SANG * 2;
    var doc = new jsPDF({ orientation: pw > ph ? 'l' : 'p', unit: 'mm', format: [pw, ph] });

    /* El sangrado se rellena estirando la hoja 3 mm por cada lado: la sangre
       de verdad la pone el diseño al llegar al borde, y esto la garantiza. */
    var cv = document.createElement('canvas');
    cv.width = md.W; cv.height = md.H;
    var g = cv.getContext('2d');
    g.drawImage(hj, 0, 0);
    EU_PLAN.marcaAgua(g, cv.width, cv.height);
    doc.addImage(cv.toDataURL('image/jpeg', 0.94), 'JPEG', 0, 0, pw, ph, '', 'FAST');
    doc.save(nombre('imprenta') + '.pdf');
    EU.estado('euVolEstado',
      'PDF de imprenta descargado: ' + md.mmW + '×' + md.mmH + ' mm más 3 mm de sangrado por lado.', 'ok');
  }

  /* ───────────── Pantalla ───────────── */

  function pintar() {
    var host = EU.$('euVolantes');
    if (!host) return;
    if (!V()) {
      host.innerHTML = '<div class="st err">No se han cargado los volantes (b6_volantes.js).</div>';
      return;
    }
    if (!st.id) primeraDe(st.variante);

    var v = V(), p = plantilla();
    var l = v.lista(st.variante);
    var md = v.medidas(st.id);
    var cats = v.grupos(st.variante);

    host.innerHTML =
      '<div class="tp-cols">' +
      '<div>' +
      '<div class="lienzo-caja"><canvas id="euVolLienzo"></canvas></div>' +

      '<div class="tira" style="margin-top:10px">' +
      VISTAS.map(function (x) {
        return '<button class="pill' + (st.vista === x.id ? ' on' : '') + '" data-vista="' + x.id + '">' +
          EU.esc(x.n) + '</button>';
      }).join('') +
      '<button class="pill" data-rehacer="1">🔁 Rehacer el texto</button>' +
      '</div>' +

      (st.vista === 'contexto'
        ? '<div class="tira" style="margin-top:7px">' +
          v.ESCENAS.map(function (e) {
            return '<button class="pill' + (st.escena === e.id ? ' on' : '') + '" data-escena="' + e.id + '" ' +
              'title="' + EU.esc(e.d) + '">' + EU.esc(e.n) + '</button>';
          }).join('') + '</div>'
        : '') +

      '<p style="font-size:11px;color:var(--tx2);line-height:1.55;margin:9px 0 0">' + EU.esc(nota()) + '</p>' +

      '<div class="tira" style="margin-top:10px">' +
      '<button class="btn btn-g btn-sm" data-baja="hoja">⬇ La hoja</button>' +
      '<button class="btn btn-g btn-sm" data-baja="vista">⬇ Esta vista</button>' +
      '<button class="btn btn-g btn-sm" data-baja="montaje">⬇ Plano de montaje</button>' +
      '<button class="btn btn-sm" data-baja="pdf">⬇ PDF con sangrado</button>' +
      '</div>' +
      '<div id="euVolEstado" style="margin-top:8px"></div>' +
      '<div id="euVolBandeja"></div>' +
      '</div>' +

      '<div class="panel">' +
      '<label class="mini-lbl">Para qué es</label>' +
      '<div style="display:flex;flex-direction:column;gap:6px">' +
      v.VARIANTES.map(function (x) {
        return '<button class="pill' + (st.variante === x.id ? ' on' : '') + '" data-var="' + x.id + '" ' +
          'style="width:100%;justify-content:flex-start;border-radius:9px;text-align:left;padding:9px 12px;height:auto">' +
          '<span style="display:block"><b style="font-size:11.5px">' + EU.esc(x.icono + ' ' + x.nombre) + '</b>' +
          '<span style="font-size:10px;color:var(--tx2);display:block;margin-top:2px;line-height:1.45">' +
          EU.esc(x.d) + '</span></span></button>';
      }).join('') +
      '</div>' +

      '<label class="mini-lbl">Plantilla · ' + l.length + '</label>' +
      '<select id="euVolSel" style="width:100%">' +
      cats.map(function (c) {
        return '<optgroup label="' + EU.esc(c) + '">' +
          l.filter(function (x) { return x.cat === c; }).map(function (x) {
            return '<option value="' + x.id + '"' + (x.id === st.id ? ' selected' : '') + '>' +
              EU.esc(x.nombre) + '</option>';
          }).join('') + '</optgroup>';
      }).join('') +
      '</select>' +
      '<div style="font-size:10.5px;color:var(--tx2);line-height:1.5;margin-top:5px">' +
      EU.esc(p ? p.d : '') + '</div>' +
      '<div style="font-size:10.5px;color:var(--ac2);line-height:1.5;margin-top:4px;font-weight:600">' +
      EU.esc(md.nombre) + '</div>' +

      (esOrden()
        ? '<div class="st" style="margin-top:12px">Los renglones van a 9 mm, que es lo que necesita ' +
          'una letra normal. Si el impreso no cabe, se le quitan filas a las tablas antes que apretar ' +
          'el renglón.</div>'
        : '<label class="mini-lbl">Paleta</label><div class="tira">' +
          '<button class="pill' + (st.tema ? '' : ' on') + '" data-tema="">La de la plantilla</button>' +
          Object.keys(M().TEMAS).map(function (t) {
            return '<button class="pill' + (st.tema === t ? ' on' : '') + '" data-tema="' + t + '">' +
              EU.esc(M().TEMAS[t].nombre) + '</button>';
          }).join('') + '</div>' +
          '<div class="fila" style="margin-top:10px"><input type="checkbox" id="euVolQR"' +
          (st.qr ? ' checked' : '') + ' style="width:auto">' +
          '<span style="font-size:11.5px">Poner el QR en la hoja' +
          (EU.qr && EU.qr.el ? '' : ' <i style="color:var(--tx2);font-style:normal">· antes hay que generarlo en la pestaña QR</i>') +
          '</span></div>') +

      '<p style="font-size:10.5px;color:var(--tx2);line-height:1.5;margin:12px 0 0">' +
      'El nombre del negocio, la dirección y el contacto salen de tu ficha, igual que en el resto ' +
      'de la aplicación.</p>' +
      '</div>' +
      '</div>';

    elLienzo = EU.$('euVolLienzo');
    cablear(host);
    pintarLienzo();

    var hb = EU.$('euVolBandeja');
    if (hb && window.B6Bandeja) {
      if (P._des) { try { P._des(); } catch (e) {} }
      P._des = B6Bandeja.panel(hb, { origen: 'volantes' }, 'volantes');
    }
  }

  function nota() {
    var md = V().medidas(st.id);
    if (st.vista === 'montaje') {
      return 'Plano de imprenta: ' + md.mmW + '×' + md.mmH + ' mm de pieza, 3 mm de sangrado por lado, ' +
        '5 mm de margen de seguridad y las marcas de corte' +
        (md.pliegues.length ? ', con los pliegues señalados.' : '.');
    }
    if (st.vista === 'contexto') return 'La pieza puesta en el mundo, a su tamaño real. Es la foto para enseñarla, no para imprimirla.';
    return 'La hoja tal cual sale de imprenta: ' + md.mmW + '×' + md.mmH + ' mm.';
  }

  function cablear(host) {
    host.querySelectorAll('[data-vista]').forEach(function (b) {
      b.onclick = function () { st.vista = b.getAttribute('data-vista'); pintar(); };
    });
    host.querySelectorAll('[data-escena]').forEach(function (b) {
      b.onclick = function () { st.escena = b.getAttribute('data-escena'); pintar(); };
    });
    host.querySelectorAll('[data-var]').forEach(function (b) {
      b.onclick = function () {
        st.variante = b.getAttribute('data-var');
        primeraDe(st.variante);
        pintar();
      };
    });
    host.querySelectorAll('[data-tema]').forEach(function (b) {
      b.onclick = function () {
        st.tema = b.getAttribute('data-tema');
        st.pag = null; invalidar();
        pintar();
      };
    });
    var sel = EU.$('euVolSel');
    if (sel) sel.onchange = function () {
      st.id = sel.value; st.pag = null; invalidar();
      pintar();
    };
    var q = EU.$('euVolQR');
    if (q) q.onchange = function () { st.qr = q.checked; invalidar(); pintarLienzo(); };
    var r = host.querySelector('[data-rehacer]');
    if (r) r.onclick = function () {
      st.semilla++; st.pag = null; invalidar();
      pintar();
      EU.toast('Texto rehecho.');
    };
    host.querySelectorAll('[data-baja]').forEach(function (b) {
      b.onclick = function () {
        var k = b.getAttribute('data-baja');
        if (k === 'hoja') bajarHoja();
        else if (k === 'vista') bajarVista();
        else if (k === 'montaje') bajarMontaje();
        else bajarPDF();
      };
    });
  }

  P.entrar = function () { pintar(); };
  P.repintar = function () { pintarLienzo(); };

  window.addEventListener('resize', function () {
    if (EU.pantalla === 'triptico' && elLienzo && elLienzo.offsetParent) pintarLienzo();
  });

  window.EU_VOLANTES = P;
})();

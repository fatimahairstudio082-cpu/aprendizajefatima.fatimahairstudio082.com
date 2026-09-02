/* ══════════════════════════════════════════════════════════════════
   ESTUDIO UNIVERSAL · P2 · EDITOR DE FOLLETO
   ------------------------------------------------------------------
   El lienzo manda. El panel de la derecha sólo mueve mandos que el
   motor YA sabe dibujar (cuadrícula, paleta, hoja, acabados, textos,
   fotos, QR), así que nunca se puede desincronizar de la descarga.
   ══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if (window._EU_EDITOR_LOADED) return;
  window._EU_EDITOR_LOADED = true;

  var E = {};
  window.EU_EDITOR = E;

  var tab = 'diseno';
  var historia = [];
  var ANCHO_MAX = 620;

  /* ───────────── Copias para deshacer ─────────────
     Las fotos son objetos Image: no caben en un JSON, así que se guardan
     aparte y se vuelven a enganchar al restaurar. */

  /* Las ocho combinaciones profesionales del proyecto de Claude Design. Cada
     una es un juego completo de color: no se mezclan con el tema, lo sustituyen. */
  var PALETAS_PRO = [
    { id: 'noche_oro', n: 'Noche y oro',      c: { fondo: '#0E0E13', panel: '#191922', acento: '#D4AF37', acento2: '#F1E0A6', tinta: '#F6F3EC', tinta2: '#B6AF9E' } },
    { id: 'editorial', n: 'Editorial claro',  c: { fondo: '#F6F4F0', panel: '#FFFFFF', acento: '#1F2937', acento2: '#B08968', tinta: '#14161A', tinta2: '#5C6472' } },
    { id: 'nude',      n: 'Nude cálido',      c: { fondo: '#F3E7E0', panel: '#FFF8F4', acento: '#B27C68', acento2: '#E3B7A0', tinta: '#3A2A24', tinta2: '#7C635A' } },
    { id: 'verde',     n: 'Verde botánico',   c: { fondo: '#0F1A15', panel: '#17251E', acento: '#4E9E6A', acento2: '#A8D5B5', tinta: '#EDF4EE', tinta2: '#9DB0A4' } },
    { id: 'azul',      n: 'Azul corporativo', c: { fondo: '#0B1220', panel: '#141F33', acento: '#3B82F6', acento2: '#93C5FD', tinta: '#EAF1FB', tinta2: '#9AAFC9' } },
    { id: 'vino',      n: 'Vino y crema',     c: { fondo: '#1A0E12', panel: '#26141A', acento: '#9B2242', acento2: '#E8B4B8', tinta: '#F7EDEA', tinta2: '#C2A4A4' } },
    { id: 'grafito',   n: 'Grafito y cal',    c: { fondo: '#151515', panel: '#202020', acento: '#E7E5E0', acento2: '#8A8A85', tinta: '#F5F4F1', tinta2: '#A8A8A3' } },
    { id: 'coral',     n: 'Coral fresco',     c: { fondo: '#FFF6F2', panel: '#FFFFFF', acento: '#EF5B4C', acento2: '#FFB4A2', tinta: '#26120F', tinta2: '#7A5650' } }
  ];

  var ROLES = [
    { k: 'fondo', n: 'Fondo' }, { k: 'panel', n: 'Cuadro' }, { k: 'tinta', n: 'Texto' },
    { k: 'tinta2', n: 'Texto suave' }, { k: 'acento', n: 'Acento' }, { k: 'acento2', n: 'Acento claro' }
  ];

  function copiar(pag) {
    var medias = (pag.celdas || []).map(function (c) { return c.media || null; });
    var j = JSON.stringify(pag, function (k, v) { return k === 'media' ? undefined : v; });
    return { j: j, medias: medias };
  }
  function restaurar(s) {
    var p = JSON.parse(s.j);
    (p.celdas || []).forEach(function (c, i) { if (s.medias[i]) c.media = s.medias[i]; });
    return p;
  }
  function apuntar() {
    if (!EU.pagina) return;
    historia.push(copiar(EU.pagina));
    if (historia.length > 30) historia.shift();
  }
  E.deshacer = function () {
    if (!historia.length) { EU.toast('No hay nada que deshacer.'); return; }
    EU.pagina = restaurar(historia.pop());
    E.repintar(); E.panel();
  };

  /* ───────────── Entrar en la pantalla ───────────── */

  E.entrar = function () {
    if (!EU.pagina) {
      EU.toast('Elige antes una plantilla.');
      EU.ir('plantillas');
      return;
    }
    E.repintar();
    E.panel();
  };

  /* ───────────── Dibujar ───────────── */

  E.repintar = function () {
    var cv = EU.$('euLienzo');
    if (!cv || !EU.pagina) return;
    var M = EU.motor;
    var F = M.FORMATOS[EU.pagina.formato] || M.FORMATOS.a4v;
    var caja = cv.parentNode.clientWidth - 30;
    // Cabe de ancho Y de alto: en A4 vertical, si no, hay que hacer scroll
    // para ver el folleto entero y se pierde la idea de «el lienzo manda».
    var porAlto = Math.max(300, (window.innerHeight - 250)) * (F.w / F.h);
    var ancho = Math.max(220, Math.min(ANCHO_MAX, caja, porAlto));
    var esc = ancho / F.w;
    cv.width = Math.round(F.w * esc);
    cv.height = Math.round(F.h * esc);
    M.pintar(cv.getContext('2d'), cv.width, cv.height, EU.pagina, opciones());
  };

  /* Opciones de dibujo comunes: aquí entra el QR, para que salga igual en la
     vista previa, en el JPG, en el PDF y en el vídeo. */
  E.opciones = opciones;
  function opciones(extra) {
    var op = Object.assign({ nPagina: 1 }, extra || {});
    if (EU.qr && EU.qr.el) {
      op.qr = EU.qr.el;
      op.qrTexto = EU.qr.etiqueta || 'Escanéame';
      if (EU.qr.pos) op.qrPos = EU.qr.pos;
    }
    return op;
  }

  /* ───────────── Panel de pestañas ───────────── */

  function cablearTabs() {
    var n = EU.$('euEdTabs');
    if (!n || n._eu) return;
    n._eu = true;
    n.addEventListener('click', function (ev) {
      var b = ev.target.closest && ev.target.closest('button[data-t]');
      if (!b) return;
      tab = b.getAttribute('data-t');
      var t = n.querySelectorAll('button');
      for (var i = 0; i < t.length; i++) t[i].classList.toggle('on', t[i] === b);
      E.panel();
    });
  }

  E.panel = function () {
    cablearTabs();
    var c = EU.$('euEdCuerpo');
    if (!c || !EU.pagina) return;
    if (tab === 'diseno') c.innerHTML = htmlDiseno();
    else if (tab === 'textos') c.innerHTML = htmlTextos();
    else if (tab === 'fotos') c.innerHTML = htmlFotos();
    else if (tab === 'qr') c.innerHTML = htmlQR();
    else c.innerHTML = htmlMarca();
    cablear(c);
  };

  /* ── Diseño ── */
  function htmlDiseno() {
    var M = EU.motor, p = EU.pagina;
    var rej = Object.keys(M.REJILLAS).map(function (k) {
      return '<button class="mini-rej' + (p.rejilla === k ? ' on' : '') + '" data-rej="' + k + '" title="' +
        EU.esc(M.REJILLAS[k].nombre + ' · ' + M.REJILLAS[k].uso) + '">' + miniDibujo(k) + '</button>';
    }).join('');

    var temas = Object.keys(M.TEMAS).map(function (k) {
      var t = M.TEMAS[k];
      return '<button class="paleta-b' + (p.tema === k ? ' on' : '') + '" data-tema="' + k + '">' +
        '<span style="font-size:11px">' + EU.esc(t.nombre) + '</span>' +
        '<span class="muestras">' + ['fondo', 'panel', 'tinta', 'acento', 'acento2'].map(function (x) {
          return '<i style="background:' + t[x] + '"></i>';
        }).join('') + '</span></button>';
    }).join('');

    var fmt = Object.keys(M.FORMATOS).map(function (k) {
      return '<option value="' + k + '"' + (p.formato === k ? ' selected' : '') + '>' +
        EU.esc(M.FORMATOS[k].nombre) + '</option>';
    }).join('');

    /* Cuántos cuadros: las rejillas agrupadas por número de piezas, para
       elegir por cantidad antes que por forma. */
    var nums = [];
    Object.keys(M.REJILLAS).forEach(function (k) {
      var n = M.REJILLAS[k].n;
      if (nums.indexOf(n) < 0) nums.push(n);
    });
    nums.sort(function (a, b) { return a - b; });
    var nAct = (M.REJILLAS[p.rejilla] || {}).n;
    var conteos = nums.map(function (n) {
      return '<button class="pill' + (n === nAct ? ' on' : '') + '" data-conteo="' + n + '">' + n + '</button>';
    }).join('');

    /* Los quince troqueles de celda que el motor ya sabe dibujar. */
    var FC = M.FORMAS_CELDA || {};
    var troq = Object.keys(FC).map(function (k) {
      return '<button class="troquel' + ((p.formaCelda || 'suave') === k ? ' on' : '') +
        '" data-forma="' + k + '" title="' + EU.esc(FC[k].nombre) + '">' +
        '<i>' + FC[k].icono + '</i><span>' + EU.esc(FC[k].nombre) + '</span></button>';
    }).join('');

    var ad = p.adornos || {};
    return '' +
      '<label class="mini-lbl">Cuadrícula</label><div class="tira">' + rej + '</div>' +
      '<label class="mini-lbl">Cuántos cuadros</label><div class="tira">' + conteos + '</div>' +
      '<label class="mini-lbl">Hoja</label><select data-campo="formato">' + fmt + '</select>' +
      '<label class="mini-lbl">Forma de los cuadros · 15 troqueles</label>' +
      '<div class="troqueles">' + troq + '</div>' +
      '<label class="mini-lbl">Paleta · 10</label><div style="display:grid;gap:5px">' + temas + '</div>' +
      '<label class="mini-lbl">Acabado</label>' +
      [['grano', 'Grano de papel'], ['vineta', 'Viñeta'], ['filetes', 'Filetes'], ['sombras', 'Sombras duras']]
        .map(function (a) {
          return '<div class="fila" style="margin:4px 0"><input type="checkbox" data-adorno="' + a[0] + '"' +
            (ad[a[0]] !== false ? ' checked' : '') + ' style="width:auto"><span style="font-size:11.5px">' +
            a[1] + '</span></div>';
        }).join('') +
      '<label class="mini-lbl">Cerebro de textos</label>' +
      '<div class="tira"><button class="pill" data-cerebro="otra">Otra versión</button>' +
      '<button class="pill" data-cerebro="corto">Más corto</button>' +
      '<button class="pill" data-cerebro="serio">Más serio</button></div>';
  }

  /* Dibujito de la cuadrícula, hecho con divs: da idea de la forma sin pintar. */
  function miniDibujo(k) {
    var R = EU.motor.REJILLAS[k];
    if (!R) return '';
    return R.filas.map(function (f) {
      var huecos = new Array(f.cols.length + 1).join('<i></i>');
      return '<span style="grid-template-columns:repeat(' + f.cols.length +
        ',1fr);flex:' + f.alto + ' 1 0">' + huecos + '</span>';
    }).join('');
  }

  /* ── Textos ── */
  function htmlTextos() {
    var p = EU.pagina, cab = p.cabecera || {}, pie = p.pie || {};
    var celdas = (p.celdas || []).map(function (c, i) {
      return '<div class="celda-fila">' +
        '<div class="cab"><b>' + (i + 1) + ' · ' + EU.esc(c.titulo || '') + '</b>' +
        '<button class="btn btn-g btn-sm" data-regen="' + i + '">🔄</button></div>' +
        '<input type="text" data-celda="' + i + '" data-k="titulo" value="' + EU.esc(c.titulo || '') + '" maxlength="40">' +
        '<textarea rows="2" data-celda="' + i + '" data-k="texto" maxlength="220">' + EU.esc(c.texto || '') + '</textarea>' +
        '<div class="fila">' +
        '<input type="text" data-celda="' + i + '" data-k="precio" value="' + EU.esc(c.precio || '') + '" placeholder="precio" maxlength="20" style="flex:1">' +
        '<input type="text" data-celda="' + i + '" data-k="etiqueta" value="' + EU.esc(c.etiqueta || '') + '" placeholder="etiqueta" maxlength="20" style="flex:1">' +
        '</div></div>';
    }).join('');

    return '' +
      '<label class="mini-lbl">Cabecera</label>' +
      '<input type="text" data-cab="marca" value="' + EU.esc(cab.marca || '') + '" placeholder="tu marca" maxlength="40">' +
      '<input type="text" data-cab="titulo" value="' + EU.esc(cab.titulo || '') + '" placeholder="título" maxlength="60" style="margin-top:5px">' +
      '<input type="text" data-cab="subtitulo" value="' + EU.esc(cab.subtitulo || '') + '" placeholder="subtítulo" maxlength="80" style="margin-top:5px">' +
      '<label class="mini-lbl">Cuadros</label>' + celdas +
      '<label class="mini-lbl">Pie</label>' +
      '<input type="text" data-pie="cta" value="' + EU.esc(pie.cta || '') + '" placeholder="llamada a la acción" maxlength="30">' +
      '<input type="text" data-pie="contacto" value="' + EU.esc(pie.contacto || '') + '" placeholder="contacto" maxlength="70" style="margin-top:5px">';
  }

  /* ── Fotos ── */
  function htmlFotos() {
    var p = EU.pagina;
    return '<p style="font-size:11px;color:var(--tx2);line-height:1.6;margin:0 0 10px">' +
      'Sin foto, el motor dibuja un fondo con tu propia paleta: nunca finge ser una foto real. ' +
      'Las fotos se quedan en tu móvil, no suben a ningún sitio.</p>' +
      (p.celdas || []).map(function (c, i) {
        return '<div class="celda-fila"><div class="cab"><b>' + (i + 1) + ' · ' + EU.esc(c.titulo || '') + '</b>' +
          (c.media ? '<button class="btn btn-g btn-sm" data-quitafoto="' + i + '">Quitar</button>' : '') + '</div>' +
          '<input type="file" accept="image/*" data-foto="' + i + '" style="font-size:11px">' +
          '</div>';
      }).join('');
  }

  /* ── QR (atajo desde el editor) ── */
  function htmlQR() {
    var hay = !!(EU.qr && EU.qr.el);
    return '<p style="font-size:11.5px;color:var(--tx2);line-height:1.7">' +
      (hay ? 'Tu QR está puesto en la hoja.' : 'Todavía no hay ningún QR en la hoja.') + '</p>' +
      '<label class="mini-lbl">Dónde va</label>' +
      '<div class="tira"><button class="pill' + ((!EU.qr || EU.qr.pos !== 'derecha') ? ' on' : '') + '" data-qrpos="">Centrado</button>' +
      '<button class="pill' + ((EU.qr && EU.qr.pos === 'derecha') ? ' on' : '') + '" data-qrpos="derecha">A la derecha</button></div>' +
      '<button class="btn" style="width:100%;margin-top:12px" data-irqr="1">Abrir el estudio de QR</button>' +
      (hay ? '<button class="btn btn-g btn-sm" style="width:100%;margin-top:6px" data-quitaqr="1">Quitar el QR de la hoja</button>' : '');
  }

  /* ── Marca ── */
  function htmlMarca() {
    var p = EU.pagina, propios = !!(p.colores && p.colores.acento);
    var m = EU.marca;
    return '<div style="font-size:11.5px;line-height:1.7;color:var(--tx2)">' +
      '<b style="color:var(--tx)">' + EU.esc(m.nombre || 'Sin nombre') + '</b><br>' +
      (m.tel ? EU.esc(m.tel) + '<br>' : '') + (m.mail ? EU.esc(m.mail) + '<br>' : '') +
      (m.web ? EU.esc(m.web) + '<br>' : '') + (m.dir ? EU.esc(m.dir) : '') + '</div>' +
      '<button class="btn btn-g btn-sm" style="width:100%;margin-top:10px" data-abremarca="1">Cambiar mis datos</button>' +
      '<label class="mini-lbl">Colores</label>' +
      '<div class="fila"><input type="checkbox" data-miscolores="1"' + (propios ? ' checked' : '') +
      ' style="width:auto"><span style="font-size:11.5px">Usar los colores de mi marca</span></div>' +
      '<button class="btn btn-g btn-sm" style="width:100%;margin-top:10px" data-poncontacto="1">Poner mi contacto en el pie</button>' +
      '<label class="mini-lbl">Combinaciones profesionales</label>' +
      '<div class="pro-grid">' + PALETAS_PRO.map(function (pp) {
        return '<button class="pro-b' + (p.paletaPro === pp.id ? ' on' : '') + '" data-pro="' + pp.id + '">' +
          '<span class="pro-tira">' +
          ['fondo', 'panel', 'acento', 'acento2'].map(function (x) {
            return '<i style="background:' + pp.c[x] + '"></i>';
          }).join('') + '</span>' +
          '<span class="pro-n">' + EU.esc(pp.n) + '</span></button>';
      }).join('') + '</div>' +
      '<label class="mini-lbl">Ajuste fino</label>' +
      '<div class="roles">' + ROLES.map(function (r) {
        var v = (p.colores && p.colores[r.k]) || (EU.motor.colores(p) || {})[r.k] || '#888888';
        return '<label class="rol"><input type="color" data-rol="' + r.k + '" value="' + v + '">' +
          '<span>' + EU.esc(r.n) + '</span></label>';
      }).join('') + '</div>' +
      '<button class="btn btn-g btn-sm" style="width:100%;margin-top:8px" data-volverpaleta="1">Volver a la paleta del tema</button>';
  }

  /* ───────────── Cablear el panel ───────────── */

  function cablear(c) {
    c.querySelectorAll('[data-rej]').forEach(function (b) {
      b.onclick = function () { apuntar(); ajustarCeldas(b.getAttribute('data-rej')); E.repintar(); E.panel(); };
    });
    c.querySelectorAll('[data-tema]').forEach(function (b) {
      b.onclick = function () { apuntar(); EU.pagina.tema = b.getAttribute('data-tema'); E.repintar(); E.panel(); };
    });
    c.querySelectorAll('[data-campo]').forEach(function (s) {
      s.onchange = function () { apuntar(); EU.pagina[s.getAttribute('data-campo')] = s.value; E.repintar(); };
    });
    c.querySelectorAll('[data-adorno]').forEach(function (k) {
      k.onchange = function () {
        apuntar();
        EU.pagina.adornos = EU.pagina.adornos || {};
        EU.pagina.adornos[k.getAttribute('data-adorno')] = k.checked;
        E.repintar();
      };
    });
    /* Cuántos cuadros: salta a la primera rejilla con ese número de piezas. */
    c.querySelectorAll('[data-conteo]').forEach(function (b) {
      b.onclick = function () {
        var n = parseInt(b.getAttribute('data-conteo'), 10), M = EU.motor;
        var k = Object.keys(M.REJILLAS).filter(function (x) { return M.REJILLAS[x].n === n; })[0];
        if (!k) return;
        apuntar(); ajustarCeldas(k); E.repintar(); E.panel();
      };
    });
    /* Troquel de celda: lo lee el motor en pintar(), así que basta guardarlo. */
    c.querySelectorAll('[data-forma]').forEach(function (b) {
      b.onclick = function () {
        apuntar();
        EU.pagina.formaCelda = b.getAttribute('data-forma');
        E.repintar(); E.panel();
      };
    });
    /* Combinación profesional: sustituye la paleta entera, no la mezcla. */
    c.querySelectorAll('[data-pro]').forEach(function (b) {
      b.onclick = function () {
        var id = b.getAttribute('data-pro');
        var pp = PALETAS_PRO.filter(function (x) { return x.id === id; })[0];
        if (!pp) return;
        apuntar();
        if (EU.pagina.paletaPro === id) {          // volver a pulsarla la quita
          delete EU.pagina.paletaPro; delete EU.pagina.colores;
        } else {
          EU.pagina.paletaPro = id;
          EU.pagina.colores = Object.assign({}, pp.c);
        }
        E.repintar(); E.panel();
      };
    });
    /* Ajuste fino: un color por papel. Al tocarlo se deja de seguir la paleta. */
    c.querySelectorAll('[data-rol]').forEach(function (i) {
      i.oninput = function () {
        EU.pagina.colores = Object.assign({}, EU.pagina.colores || {});
        EU.pagina.colores[i.getAttribute('data-rol')] = i.value;
        delete EU.pagina.paletaPro;
        E.repintar();
      };
    });
    c.querySelectorAll('[data-volverpaleta]').forEach(function (b) {
      b.onclick = function () {
        apuntar();
        delete EU.pagina.colores; delete EU.pagina.paletaPro;
        E.repintar(); E.panel();
      };
    });
    c.querySelectorAll('[data-cerebro]').forEach(function (b) {
      b.onclick = function () { cerebro(b.getAttribute('data-cerebro')); };
    });
    c.querySelectorAll('[data-cab]').forEach(function (i) {
      i.oninput = function () {
        EU.pagina.cabecera = EU.pagina.cabecera || {};
        EU.pagina.cabecera[i.getAttribute('data-cab')] = i.value;
        E.repintar();
      };
    });
    c.querySelectorAll('[data-pie]').forEach(function (i) {
      i.oninput = function () {
        EU.pagina.pie = EU.pagina.pie || {};
        EU.pagina.pie[i.getAttribute('data-pie')] = i.value;
        E.repintar();
      };
    });
    c.querySelectorAll('[data-celda]').forEach(function (i) {
      i.oninput = function () {
        var n = parseInt(i.getAttribute('data-celda'), 10);
        EU.pagina.celdas[n][i.getAttribute('data-k')] = i.value;
        E.repintar();
      };
    });
    c.querySelectorAll('[data-regen]').forEach(function (b) {
      b.onclick = function () {
        var n = parseInt(b.getAttribute('data-regen'), 10), cel = EU.pagina.celdas[n];
        apuntar();
        var ctx = { rubro: EU.rubro, tono: EU.tono, servicio: cel.titulo, semilla: Math.floor(Math.random() * 1e9) };
        cel.texto = EU.cerebro.regenerar('texto', ctx) || cel.texto;
        cel.precio = EU.cerebro.regenerar('precio', ctx) || cel.precio;
        E.repintar(); E.panel();
      };
    });
    c.querySelectorAll('[data-foto]').forEach(function (f) {
      f.onchange = function () {
        var n = parseInt(f.getAttribute('data-foto'), 10), file = f.files && f.files[0];
        if (!file) return;
        var img = new Image();
        img.onload = function () { E.repintar(); E.panel(); };
        img.onerror = function () { EU.toast('No se pudo leer esa imagen.'); };
        img.src = URL.createObjectURL(file);
        apuntar();
        EU.pagina.celdas[n].media = { el: img, tipo: 'img' };
      };
    });
    c.querySelectorAll('[data-quitafoto]').forEach(function (b) {
      b.onclick = function () {
        apuntar();
        delete EU.pagina.celdas[parseInt(b.getAttribute('data-quitafoto'), 10)].media;
        E.repintar(); E.panel();
      };
    });
    c.querySelectorAll('[data-qrpos]').forEach(function (b) {
      b.onclick = function () {
        if (!EU.qr) EU.qr = {};
        EU.qr.pos = b.getAttribute('data-qrpos') || '';
        E.repintar(); E.panel();
      };
    });
    var irqr = c.querySelector('[data-irqr]'); if (irqr) irqr.onclick = function () { EU.ir('qr'); };
    var qq = c.querySelector('[data-quitaqr]');
    if (qq) qq.onclick = function () { if (window.EU_QR) EU_QR.quitar(); E.repintar(); E.panel(); };
    var am = c.querySelector('[data-abremarca]'); if (am) am.onclick = function () { EU.abrirMarca(); };
    var mc = c.querySelector('[data-miscolores]');
    if (mc) mc.onchange = function () {
      apuntar();
      if (mc.checked) EU.pagina.colores = { acento: EU.marca.c1, acento2: EU.marca.c2 };
      else delete EU.pagina.colores;
      E.repintar();
    };
    var pc = c.querySelector('[data-poncontacto]');
    if (pc) pc.onclick = function () {
      apuntar();
      EU.pagina.pie = EU.pagina.pie || {};
      EU.pagina.pie.contacto = EU.contactoTexto();
      E.repintar(); E.panel();
      EU.toast('Contacto puesto en el pie.');
    };
  }

  /* Cambiar de cuadrícula sin perder lo escrito: si la nueva pide más
     cuadros, el cerebro rellena solo los que faltan. */
  function ajustarCeldas(rej) {
    var R = EU.motor.REJILLAS[rej];
    if (!R) return;
    EU.pagina.rejilla = rej;
    var c = EU.pagina.celdas || (EU.pagina.celdas = []);
    while (c.length < R.n) {
      var ctx = { rubro: EU.rubro, tono: EU.tono, semilla: Math.floor(Math.random() * 1e9) };
      var serv = EU.cerebro.regenerar('servicio', ctx);
      c.push({
        titulo: serv,
        texto: EU.cerebro.regenerar('texto', { rubro: EU.rubro, tono: EU.tono, servicio: serv, semilla: ctx.semilla }),
        precio: EU.cerebro.regenerar('precio', { rubro: EU.rubro, tono: EU.tono, servicio: serv, semilla: ctx.semilla }),
        etiqueta: ''
      });
    }
    // Los cuadros de más NO se borran: el motor sólo dibuja los que caben en la
    // cuadrícula, así que si se vuelve a una rejilla grande el texto sigue ahí.
  }

  function cerebro(modo) {
    apuntar();
    var R = EU.motor.REJILLAS[EU.pagina.rejilla] || EU.motor.REJILLAS.r4a;
    if (modo === 'otra') EU.semilla = Math.floor(Math.random() * 1e9);
    var tono = (modo === 'serio') ? 'elegante' : EU.tono;
    var nueva = EU.cerebro.generar({
      rubro: EU.rubro, tono: tono, n: R.n,
      negocio: EU.marca.nombre || (EU.pagina.cabecera && EU.pagina.cabecera.marca) || 'Tu negocio',
      contacto: EU.contactoTexto(), ciudad: EU.marca.dir || '', semilla: EU.semilla
    });
    if (modo === 'corto') {
      nueva.celdas.forEach(function (c) {
        var pri = String(c.texto || '').match(/^[^.!?]*[.!?]/);
        if (pri) c.texto = pri[0];
      });
    }
    // se cambian los textos y se conservan fotos, paleta, hoja y acabados
    (nueva.celdas || []).forEach(function (c, i) {
      if (EU.pagina.celdas[i] && EU.pagina.celdas[i].media) c.media = EU.pagina.celdas[i].media;
    });
    EU.pagina.cabecera = nueva.cabecera;
    EU.pagina.celdas = nueva.celdas;
    EU.pagina.pie = nueva.pie;
    E.repintar(); E.panel();
    EU.toast(modo === 'serio' ? 'Texto en tono elegante.' : 'Texto nuevo.');
  }

  /* ───────────── Descargar ───────────── */

  E.lienzoFinal = function () {
    var M = EU.motor;
    var F = M.FORMATOS[EU.pagina.formato] || M.FORMATOS.a4v;
    var cv = document.createElement('canvas');
    cv.width = F.w; cv.height = F.h;
    var ctx = cv.getContext('2d');
    M.pintar(ctx, F.w, F.h, EU.pagina, opciones());
    EU_PLAN.marcaAgua(ctx, F.w, F.h);
    return cv;
  };

  E.descargar = function () {
    if (!EU.pagina) return;
    if (!EU_PLAN.exigeSesion()) return;
    var cv = E.lienzoFinal();
    var nombre = limpio(EU.marca.nombre || 'folleto');

    cv.toBlob(function (b) {
      if (!b) { EU.estado('euEdEstado', 'El navegador no pudo generar la imagen.', 'err'); return; }
      E.bajar(b, nombre + '.jpg');
      EU.estado('euEdEstado',
        'JPG descargado.' + (EU_PLAN.puede('pdf')
          ? ' <button class="btn btn-sm" id="euBtnPdf">También en PDF de imprenta</button>'
          : ' El <b>PDF de imprenta</b> es del plan Pro. <button class="btn btn-sm" id="euBtnPdf">Ver por qué</button>'), 'ok');
      var bp = EU.$('euBtnPdf');
      if (bp) bp.onclick = E.descargarPDF;
    }, 'image/jpeg', 0.94);
  };

  E.descargarPDF = function () {
    if (!EU_PLAN.puede('pdf')) { EU_PLAN.muro('pdf'); return; }
    var JsPDF = (window.jspdf && window.jspdf.jsPDF) || window.jsPDF;
    if (!JsPDF) { EU.estado('euEdEstado', 'No se cargó la librería de PDF. Comprueba la conexión.', 'err'); return; }
    var F = EU.motor.FORMATOS[EU.pagina.formato] || EU.motor.FORMATOS.a4v;
    var cv = E.lienzoFinal();
    var mm = F.mm || [210, 297];
    var pdf = new JsPDF({ orientation: mm[0] > mm[1] ? 'landscape' : 'portrait', unit: 'mm', format: [mm[0], mm[1]] });
    pdf.addImage(cv.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, mm[0], mm[1]);
    pdf.save(limpio(EU.marca.nombre || 'folleto') + '.pdf');
    EU.estado('euEdEstado', 'PDF de imprenta descargado.', 'ok');
  };

  function limpio(s) {
    return String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '').slice(0, 40) || 'folleto';
  }
  function bajar(blob, nombre) {
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = nombre;
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
  }
  E.PALETAS_PRO = PALETAS_PRO;   // las usan también los volantes
  E.bajar = bajar;
  E.limpio = limpio;

  window.addEventListener('resize', function () { if (EU.pantalla === 'editor') E.repintar(); });
})();

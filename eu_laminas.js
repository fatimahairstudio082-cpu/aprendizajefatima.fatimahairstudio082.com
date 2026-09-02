/* ══════════════════════════════════════════════════════════════════
   ESTUDIO UNIVERSAL · LÁMINAS DE EXPOSICIÓN
   ------------------------------------------------------------------
   Mapas conceptuales, mandalas, carruseles, pósters, líneas de tiempo,
   procesos, infografías de datos, comparativas, pirámides y fichas de
   estudio. Trescientas plantillas con contenido de verdad por materia.

   El dibujo lo hacen los motores que ya están en el repositorio:
     · b6_laminas_motor.js   pinta la lámina — pintar(ctx,W,H,lam,op)
       con op.prog de 0 a 1, así que el mismo código sirve de PNG y de
       fotograma del vídeo, y nunca se separan.
     · b6_laminas_disenos.js el catálogo de las trescientas.

   Esta pieza sólo pone la pantalla: familias, galería, lienzo, hojas de
   la serie, animación, narración y descargas.
   ══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if (window._EU_LAMINAS_LOADED) return;
  window._EU_LAMINAS_LOADED = true;

  var P = {};

  var st = {
    fam: 'mapa',
    cat: '',          // materia; vacío = todas
    disenoId: '',
    lam: null,
    hoja: 0,          // hoja de la serie, en los carruseles
    prog: 1,          // avance del dibujo, 0 a 1
    animando: false,
    panel: 'galeria', // galeria · contenido · estilo · anim · bajar
    nodo: 0,          // nodo tocado en Contenido
    texto: ''         // el texto que se pega para repartir
  };

  var PANELES = [
    { id: 'galeria',   n: 'Galería' },
    { id: 'contenido', n: 'Contenido' },
    { id: 'estilo',    n: 'Estilo' },
    { id: 'anim',      n: 'Animación' },
    { id: 'bajar',     n: 'Descargar' }
  ];

  var ANIMACIONES = {
    aparecer: 'Van apareciendo',
    dibujar:  'Se van dibujando',
    rotar:    'Gira',
    pasar:    'Pasa de hoja'
  };

  var elLienzo = null, elGaleria = null, rafId = 0;

  function LM() { return window.LAMINAS_MOTOR || null; }
  function LD() { return window.LAMINAS_DISENOS || null; }

  function chip(on) {
    return 'flex:none;border-radius:20px;padding:7px 14px;font-size:12px;cursor:pointer;' +
      'white-space:nowrap;font-family:inherit;' +
      (on ? 'background:#22224a;border:1px solid #7c3aed;color:#fff;font-weight:600'
          : 'background:transparent;border:1px solid #2d2d4a;color:#94a3b8');
  }

  /* ───────────── La lámina ───────────── */

  /* Una serie de carrusel se reparte: la portada toma la raíz, las hojas de
     punto van tomando un hijo cada una, la de lista se los queda todos y el
     cierre se firma con el nombre del negocio. */
  function construirHojas(lam) {
    var n = lam.nodos || [];
    var raiz = n[0] || { t: '', d: '' };
    var hijos = n.slice(1);
    var marca = (window.EU && EU.marca) || {};
    var k = 0;
    return (lam.serie || []).map(function (est) {
      if (est === 'car_portada') return { est: est, t: raiz.t, d: raiz.d || '' };
      if (est === 'car_cierre') return { est: est, t: 'Gracias', d: marca.nombre || '' };
      if (est === 'car_lista') {
        return { est: est, t: raiz.t, d: '', lista: hijos.map(function (h) { return { t: h.t, d: h.d || '' }; }) };
      }
      var h = hijos[k++] || { t: '', d: '' };
      return { est: est, t: h.t, d: h.d || '' };
    });
  }

  function nueva(id) {
    var D = LD();
    if (!D) return null;
    var lam = D.lamina(id);
    if (!lam) return null;
    if (lam.familia === 'carrusel') lam.hojas = construirHojas(lam);
    lam.veloFondo = 0.72;
    return lam;
  }

  function totalHojas() {
    if (!st.lam) return 1;
    return st.lam.familia === 'carrusel' ? Math.max(1, (st.lam.hojas || []).length) : 1;
  }

  /* La hoja i con forma de lámina, para que el motor la pinte sin saber que
     forma parte de una serie. */
  function laminaDeHoja(i) {
    var lam = st.lam;
    if (!lam || lam.familia !== 'carrusel') return lam;
    var h = (lam.hojas || [])[i] || { est: 'car_punto', t: '', d: '' };
    var nodos;
    if (h.lista) {
      nodos = [{ nivel: 0, t: h.t, d: '', medio: 'h' + i }]
        .concat(h.lista.map(function (x) { return { nivel: 1, t: x.t, d: x.d || '' }; }));
    } else {
      nodos = [{ nivel: 0, t: h.t, d: '', medio: 'h' + i }, { nivel: 1, t: h.d || '', d: '' }];
    }
    var copia = {};
    for (var k in lam) if (lam.hasOwnProperty(k)) copia[k] = lam[k];
    copia.estructura = h.est;
    copia.titulo = lam.titulo || '';
    copia.subtitulo = '';
    copia.nodos = nodos;
    return copia;
  }

  function formato() {
    var M = LM();
    if (!M) return { w: 1240, h: 1754 };
    return M.FORMATOS[st.lam && st.lam.formato] || M.FORMATOS.a4v;
  }

  function pintarLienzo() {
    var M = LM();
    if (!M || !elLienzo || !st.lam) return;
    var F = formato();
    var W = 640, H = Math.round(640 * F.h / F.w);
    if (elLienzo.width !== W || elLienzo.height !== H) { elLienzo.width = W; elLienzo.height = H; }
    var ctx = elLienzo.getContext('2d');
    ctx.clearRect(0, 0, W, H);
    M.pintar(ctx, W, H, laminaDeHoja(Math.min(st.hoja, totalHojas() - 1)), { prog: st.prog });
  }

  /* Miniaturas de la galería: se pintan de verdad, con su paleta y su
     estructura, para que se elija por lo que se ve y no por el nombre. */
  function pintarGaleria() {
    var M = LM(), D = LD();
    if (!elGaleria || !M || !D) return;
    var cvs = elGaleria.querySelectorAll('canvas[data-lam]');
    for (var i = 0; i < cvs.length; i++) {
      var cv = cvs[i], id = cv.getAttribute('data-lam');
      if (cv.getAttribute('data-pintada') === '1') continue;
      var lam = nueva(id);
      if (!lam) continue;
      try {
        M.pintar(cv.getContext('2d'), cv.width, cv.height, lam.familia === 'carrusel'
          ? Object.assign({}, lam, { estructura: (lam.serie || ['car_portada'])[0] })
          : lam, { prog: 1 });
        cv.setAttribute('data-pintada', '1');
      } catch (e) { /* una miniatura que falle no puede tumbar la galería */ }
    }
  }

  /* ───────────── Animación ───────────── */

  function parar() {
    st.animando = false;
    if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
    if (window.EU_VOZ) EU_VOZ.callar();
  }

  function reproducir() {
    parar();
    var M = LM();
    if (!M || !st.lam) return;
    var n = (M.conteo(laminaDeHoja(st.hoja)) || {}).cajas || 6;
    var dur = Math.max(1600, n * (st.lam.segPorNodo || 0.75) * 1000);
    var t0 = performance.now();
    st.animando = true;
    var paso = function (t) {
      if (!st.animando) return;
      st.prog = Math.min(1, (t - t0) / dur);
      pintarLienzo();
      if (st.prog < 1) rafId = requestAnimationFrame(paso);
      else { st.animando = false; rafId = 0; }
    };
    rafId = requestAnimationFrame(paso);
  }

  /* Narración por nodo: cada elemento entra cuando su frase termina, no
     antes. Es lo que hace que lo que se oye y lo que se ve coincidan. */
  function narrar() {
    if (!window.EU_VOZ || !EU_VOZ.disponible) {
      return EU.toast('Este navegador no ofrece voces instaladas.');
    }
    var lam = laminaDeHoja(st.hoja);
    var nodos = (lam.nodos || []).filter(function (x) { return x && x.t; });
    if (!nodos.length) return;
    parar();
    var pasos = nodos.map(function (x, i) {
      return { texto: x.t + (x.d ? '. ' + x.d : ''), clave: 'lam:' + (st.disenoId || '') + ':' + i };
    });
    st.animando = true;
    EU_VOZ.narrar(pasos, function (i) {
      st.prog = (i + 1) / nodos.length;
      pintarLienzo();
    }).then(function () { st.animando = false; st.prog = 1; pintarLienzo(); });
  }

  /* ───────────── Descargas ───────────── */

  function lienzoFinal(i, escala) {
    var M = LM(), F = formato();
    var cv = document.createElement('canvas');
    cv.width = Math.round(F.w * (escala || 1));
    cv.height = Math.round(F.h * (escala || 1));
    M.pintar(cv.getContext('2d'), cv.width, cv.height, laminaDeHoja(i), { prog: 1 });
    return cv;
  }

  function nombreBase() {
    return String((st.lam && st.lam.titulo) || 'lamina').toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  function bajarPNG() {
    if (!st.lam) return;
    var a = document.createElement('a');
    a.href = lienzoFinal(st.hoja, 1).toDataURL('image/png');
    a.download = nombreBase() + (totalHojas() > 1 ? '-' + (st.hoja + 1) : '') + '.png';
    document.body.appendChild(a); a.click(); a.remove();
    if (window.B6Bandeja) B6Bandeja.apuntar(a.href, a.download, 'laminas');
    EU.toast('Lámina descargada en PNG.');
  }

  function bajarPDF(todas) {
    if (!st.lam) return;
    if (EU.esPro && !EU.esPro() && window.EU_PLAN && EU_PLAN.muro) return EU_PLAN.muro('pdf');
    var jsPDF = window.jspdf && window.jspdf.jsPDF;
    if (!jsPDF) return EU.toast('El PDF necesita conexión la primera vez.');
    var F = formato(), mm = F.mm || [210, 297];
    var horiz = mm[0] > mm[1];
    var doc = new jsPDF({ orientation: horiz ? 'l' : 'p', unit: 'mm', format: [mm[0], mm[1]] });
    var n = todas ? totalHojas() : 1;
    for (var i = 0; i < n; i++) {
      var idx = todas ? i : st.hoja;
      if (i) doc.addPage([mm[0], mm[1]], horiz ? 'l' : 'p');
      doc.addImage(lienzoFinal(idx, 1).toDataURL('image/jpeg', 0.94), 'JPEG', 0, 0, mm[0], mm[1]);
    }
    doc.save(nombreBase() + '.pdf');
    EU.toast('PDF de ' + n + (n === 1 ? ' hoja' : ' hojas') + ' descargado.');
  }

  /* La serie entera en PNG, dentro de un ZIP. Pasa por la bandeja, que es
     quien sabe armarlo. */
  function bajarZIP() {
    if (!st.lam) return;
    if (!window.B6Bandeja) return EU.toast('La bandeja no está cargada.');
    var n = totalHojas(), base = nombreBase();
    for (var i = 0; i < n; i++) {
      B6Bandeja.apuntar(lienzoFinal(i, 1).toDataURL('image/png'),
        base + '-' + String(i + 1) + '.png', 'laminas');
    }
    EU.estado('euLamEstado', 'Preparando el ZIP con ' + n + ' hojas…', 'proc');
    setTimeout(function () { B6Bandeja.zip(base, { origen: 'laminas' }); }, 900);
  }

  /* Vídeo de la lámina: se graba el mismo dibujo que ya se ve, avanzando de
     0 a 1. Narrado, la voz gratis del navegador va por el micrófono, igual
     que en la pestaña de vídeo. */
  function bajarVideo(narrado) {
    if (!st.lam) return;
    if (!EU_PLAN.exigeSesion()) return;
    if (!window.MediaRecorder || !document.createElement('canvas').captureStream) {
      return EU.estado('euLamEstado', 'Este navegador no sabe grabar vídeo. Prueba en Chrome.', 'err');
    }
    var M = LM(), F = formato();
    var lado = 1280, e = lado / Math.max(F.w, F.h);
    var W = Math.round(F.w * e / 2) * 2, H = Math.round(F.h * e / 2) * 2;
    var cv = document.createElement('canvas');
    cv.width = W; cv.height = H;
    var g = cv.getContext('2d');
    var lam = laminaDeHoja(st.hoja);
    var nodos = (lam.nodos || []).filter(function (x) { return x && x.t; });
    var dur = Math.max(2, nodos.length * (st.lam.segPorNodo || 1.6));

    M.pintar(g, W, H, lam, { prog: 0 });
    var flujo = new MediaStream();
    cv.captureStream(30).getVideoTracks().forEach(function (t) { flujo.addTrack(t); });

    var tipo = '';
    ['video/mp4;codecs=avc1', 'video/mp4', 'video/webm;codecs=vp9', 'video/webm'].some(function (x) {
      if (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(x)) { tipo = x; return true; }
      return false;
    });
    var rec;
    try { rec = new MediaRecorder(flujo, tipo ? { mimeType: tipo, videoBitsPerSecond: 4500000 } : undefined); }
    catch (er) { return EU.estado('euLamEstado', 'No se pudo grabar: ' + EU.esc(er.message || er), 'err'); }

    var trozos = [];
    rec.ondataavailable = function (ev) { if (ev.data && ev.data.size) trozos.push(ev.data); };
    rec.onstop = function () {
      var mp4 = /mp4/.test(rec.mimeType || tipo || '');
      var b = new Blob(trozos, { type: mp4 ? 'video/mp4' : 'video/webm' });
      var arch = nombreBase() + (narrado ? '-narrada' : '') + (mp4 ? '.mp4' : '.webm');
      EU_EDITOR.bajar(b, arch);
      if (window.B6Bandeja) {
        var u = URL.createObjectURL(b);
        B6Bandeja.apuntar(u, arch, 'laminas');
        setTimeout(function () { URL.revokeObjectURL(u); }, 10000);
      }
      EU.estado('euLamEstado', 'Vídeo descargado. Pesa ' + Math.round(b.size / 1024) + ' KB.', 'ok');
      st.animando = false; st.prog = 1; pintarLienzo();
    };

    EU.estado('euLamEstado', 'Grabando… tarda lo que dura (' + dur.toFixed(1) + ' s). ' +
      '<b>No cambies de pestaña</b>.', 'proc');
    st.animando = true;
    rec.start();
    if (narrado && window.EU_VOZ && EU_VOZ.narrar) {
      try {
        EU_VOZ.narrar(nodos.map(function (x, i) {
          return { texto: x.t + (x.d ? '. ' + x.d : ''), clave: 'lam:' + (st.disenoId || '') + ':' + i };
        }));
      } catch (er) {}
    }
    var t0 = performance.now();
    (function paso() {
      var t = (performance.now() - t0) / 1000;
      var pr = Math.min(1, t / dur);
      M.pintar(g, W, H, lam, { prog: pr });
      EU_PLAN.marcaAgua(g, W, H);
      if (pr >= 1) {
        setTimeout(function () { try { rec.stop(); } catch (er) {} }, 200);
        return;
      }
      requestAnimationFrame(paso);
    })();
  }

  /* ───────────── Los cuerpos del panel ───────────── */

  function ent(id, rot, val, ph) {
    return '<label class="mini-lbl">' + EU.esc(rot) + '</label>' +
      '<input id="' + id + '" value="' + EU.esc(val || '') + '"' +
      (ph ? ' placeholder="' + EU.esc(ph) + '"' : '') +
      ' style="width:100%;background:#0f0f22;border:1px solid #2d2d4a;color:#e2e8f0;' +
      'border-radius:8px;padding:8px;font-size:12px;font-family:inherit">';
  }

  function selec(id, rot, opciones, valor) {
    return '<label class="mini-lbl">' + EU.esc(rot) + '</label>' +
      '<select id="' + id + '" style="width:100%;background:#0f0f22;border:1px solid #2d2d4a;' +
      'color:#e2e8f0;border-radius:8px;padding:8px;font-size:12px;font-family:inherit">' +
      opciones.map(function (o) {
        return '<option value="' + EU.esc(o.id) + '"' + (o.id === valor ? ' selected' : '') + '>' +
          EU.esc(o.n) + '</option>';
      }).join('') + '</select>';
  }

  function panGaleria(todas, visibles, cats) {
    var h = [];
    h.push('<select id="euLamCat" style="width:100%;background:#0f0f22;border:1px solid #2d2d4a;' +
      'color:#e2e8f0;border-radius:8px;padding:8px;font-size:12px;margin-bottom:6px;font-family:inherit">');
    h.push('<option value="">Todas las materias</option>');
    cats.forEach(function (c) {
      h.push('<option value="' + EU.esc(c) + '"' + (c === st.cat ? ' selected' : '') + '>' + EU.esc(c) + '</option>');
    });
    h.push('</select>');
    h.push('<p style="margin:0 0 8px;font-size:10.5px;color:#7c7c9e">' + visibles.length +
      (visibles.length === 1 ? ' plantilla' : ' plantillas') + '</p>');
    h.push('<div id="euLamGaleria" style="display:flex;flex-wrap:wrap;gap:8px">');
    visibles.forEach(function (p) {
      var sel = p.id === st.disenoId;
      h.push('<button data-lam-sel="' + EU.esc(p.id) + '" title="' + EU.esc(p.desc || '') + '" ' +
        'style="width:88px;padding:0;background:transparent;border:2px solid ' +
        (sel ? '#7c3aed' : 'transparent') + ';border-radius:9px;cursor:pointer;font-family:inherit">' +
        '<canvas data-lam="' + EU.esc(p.id) + '" width="84" height="119" ' +
        'style="width:84px;height:119px;border-radius:7px;background:#0a0a14;display:block"></canvas>' +
        '<span style="display:block;font-size:9.5px;color:' + (sel ? '#e2e8f0' : '#7c7c9e') +
        ';line-height:1.3;padding:4px 2px 5px;text-align:center;overflow:hidden">' +
        EU.esc(p.nombre) + '</span></button>');
    });
    h.push('</div>');
    return h.join('');
  }

  /* Contenido: la cabecera de la lámina y, debajo, los nodos uno a uno. En
     los carruseles lo que se edita son las hojas de la serie. */
  function panContenido() {
    var lam = st.lam, h = [];
    if (!lam) return '';
    h.push(ent('euLamTit', 'Título de la lámina', lam.titulo));
    h.push(ent('euLamSub', 'Subtítulo', lam.subtitulo));
    h.push('<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">' +
      '<div>' + ent('euLamRot', 'Rótulo', lam.rotulo, 'Ej.: Tema 4') + '</div>' +
      '<div>' + ent('euLamPie', 'Pie', lam.pie, 'Tu nombre o el centro') + '</div></div>');

    h.push('<label class="mini-lbl" style="margin-top:12px">Nodos · ' + (lam.nodos || []).length + '</label>');
    (lam.nodos || []).forEach(function (n, i) {
      var tocado = i === st.nodo;
      h.push('<div data-nodo="' + i + '" style="background:' + (tocado ? '#22224a' : '#141430') +
        ';border:1px solid ' + (tocado ? '#7c3aed' : '#2d2d4a') + ';border-radius:9px;padding:8px;margin-bottom:6px">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">' +
        '<span style="font-size:10px;color:#a855f7;font-weight:700">' +
        (n.nivel ? '· nivel ' + n.nivel : 'centro') + '</span>' +
        '<button data-quitanodo="' + i + '" style="background:transparent;border:0;color:#7c7c9e;' +
        'font-size:12px;cursor:pointer;font-family:inherit">✕</button></div>' +
        '<input data-nt="' + i + '" value="' + EU.esc(n.t || '') + '" ' +
        'style="width:100%;background:#0f0f22;border:1px solid #2d2d4a;color:#e2e8f0;border-radius:7px;' +
        'padding:7px;font-size:11.5px;margin-bottom:5px;font-family:inherit">' +
        '<textarea data-nd="' + i + '" rows="2" style="width:100%;background:#0f0f22;border:1px solid #2d2d4a;' +
        'color:#94a3b8;border-radius:7px;padding:7px;font-size:11px;resize:vertical;font-family:inherit">' +
        EU.esc(n.d || '') + '</textarea></div>');
    });
    h.push('<button id="euLamMas" style="background:transparent;border:1px dashed #2d2d4a;color:#94a3b8;' +
      'border-radius:8px;padding:8px;font-size:11.5px;cursor:pointer;width:100%;font-family:inherit">+ Otra rama</button>');

    h.push('<label class="mini-lbl" style="margin-top:14px">Pegar un texto</label>');
    h.push('<p style="margin:0 0 6px;font-size:10.5px;color:#7c7c9e;line-height:1.5">' +
      'La primera línea es el centro. Las demás, ramas. Si una empieza por guión o va sangrada, ' +
      'entra como subrama.</p>');
    h.push('<textarea id="euLamTexto" rows="5" placeholder="El agua&#10;Evaporación&#10;- del mar y de los ríos&#10;Condensación&#10;Precipitación" ' +
      'style="width:100%;background:#0f0f22;border:1px solid #2d2d4a;color:#e2e8f0;border-radius:8px;' +
      'padding:8px;font-size:11.5px;resize:vertical;line-height:1.6;font-family:inherit">' +
      EU.esc(st.texto) + '</textarea>');
    h.push('<button id="euLamRepartir" style="background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;' +
      'border:0;border-radius:8px;padding:8px 14px;font-size:11.5px;font-weight:600;cursor:pointer;' +
      'margin-top:8px;font-family:inherit">↧ Repartir en nodos</button>');
    return h.join('');
  }

  function panEstilo() {
    var M = LM(), lam = st.lam, h = [];
    if (!lam) return '';
    var ests = M.porFamilia(lam.familia).map(function (e) { return { id: e.id, n: e.nombre }; });
    h.push(selec('euLamEst', 'Estructura', ests, lam.estructura));

    var pals = M.paletas();
    h.push('<label class="mini-lbl">Paleta</label>' +
      '<select id="euLamPal" style="width:100%;background:#0f0f22;border:1px solid #2d2d4a;color:#e2e8f0;' +
      'border-radius:8px;padding:8px;font-size:12px;font-family:inherit">' +
      ['Educativas', 'Del folleto'].map(function (g) {
        var l = pals.filter(function (p) { return (p.grupo || 'Educativas') === g; });
        if (!l.length) return '';
        return '<optgroup label="' + g + '">' + l.map(function (p) {
          return '<option value="' + EU.esc(p.id) + '"' + (p.id === lam.paleta ? ' selected' : '') + '>' +
            EU.esc(p.nombre) + '</option>';
        }).join('') + '</optgroup>';
      }).join('') + '</select>');

    var C = M.colores(lam);
    h.push('<label class="mini-lbl">Colores a mano</label><div style="display:flex;gap:8px;flex-wrap:wrap">');
    [['fondo', 'Fondo'], ['panel', 'Panel'], ['tinta', 'Tinta'], ['acento', 'Acento'], ['acento2', 'Acento 2']]
      .forEach(function (c) {
        h.push('<label style="font-size:10px;color:#94a3b8;display:flex;flex-direction:column;gap:3px;align-items:center">' +
          c[1] + '<input type="color" data-col="' + c[0] + '" value="' + EU.esc(C[c[0]] || '#000000') + '" ' +
          'style="width:40px;height:28px;border:1px solid #2d2d4a;border-radius:6px;background:#0f0f22;padding:1px;cursor:pointer"></label>');
      });
    h.push('</div>');
    h.push('<button id="euLamColRes" style="background:transparent;border:1px solid #2d2d4a;color:#94a3b8;' +
      'border-radius:8px;padding:7px 12px;font-size:11px;cursor:pointer;margin-top:7px;font-family:inherit">' +
      'Volver a los de la paleta</button>');

    var fmts = Object.keys(M.FORMATOS).map(function (k) { return { id: k, n: M.FORMATOS[k].nombre }; });
    var frms = Object.keys(M.FORMAS_NODO).map(function (k) { return { id: k, n: M.FORMAS_NODO[k].nombre }; });
    h.push('<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px">' +
      '<div>' + selec('euLamFmt', 'Formato', fmts, lam.formato) + '</div>' +
      '<div>' + selec('euLamFrm', 'Forma del nodo', frms, (lam.opciones || {}).forma || 'caja') + '</div></div>');

    h.push('<div class="tira" style="margin-top:10px">' +
      '<button class="pill' + (lam.sombras ? ' on' : '') + '" data-sw="sombras">Sombras</button>' +
      '<button class="pill' + (lam.vineta ? ' on' : '') + '" data-sw="vineta">Viñeta</button></div>');
    return h.join('');
  }

  function panAnim() {
    var lam = st.lam, h = [];
    if (!lam) return '';
    h.push('<label class="mini-lbl">Cómo entra</label><div class="tira">');
    Object.keys(ANIMACIONES).forEach(function (k) {
      h.push('<button class="pill' + (lam.animacion === k ? ' on' : '') + '" data-anim="' + k + '">' +
        EU.esc(ANIMACIONES[k]) + '</button>');
    });
    h.push('</div>');
    h.push('<label class="mini-lbl" style="margin-top:12px">Segundos por nodo · ' +
      Number(lam.segPorNodo || 1.6).toFixed(1) + ' s</label>' +
      '<input type="range" id="euLamSeg" min="0.4" max="4" step="0.1" value="' + (lam.segPorNodo || 1.6) +
      '" style="width:100%">');
    h.push('<p style="margin:8px 0 0;font-size:10.5px;color:#7c7c9e;line-height:1.5">' +
      'Con ' + (lam.nodos || []).length + ' nodos, la lámina entera dura ' +
      ((lam.nodos || []).length * (lam.segPorNodo || 1.6)).toFixed(1) + ' s.</p>');
    return h.join('');
  }

  function panBajar(nH) {
    var h = [];
    h.push('<p style="margin:0 0 9px;font-size:10.5px;color:#7c7c9e;line-height:1.5">' +
      'La lámina se pinta a tamaño de imprenta, así que lo que ves y lo que bajas es lo mismo.</p>');
    h.push('<div style="display:flex;flex-direction:column;gap:6px">' +
      '<button class="btn btn-g btn-sm" id="euLamPNG">↓ PNG de esta hoja</button>' +
      '<button class="btn btn-g btn-sm" id="euLamPDF">↓ PDF de esta hoja</button>' +
      (nH > 1 ? '<button class="btn btn-g btn-sm" id="euLamPDFT">↓ PDF · las ' + nH + ' hojas</button>' +
        '<button class="btn btn-g btn-sm" id="euLamZIP">🗜 ZIP · las ' + nH + ' hojas en PNG</button>' : '') +
      '<button class="btn btn-sm" id="euLamVid">🎬 Vídeo de la lámina</button>' +
      '<button class="btn btn-g btn-sm" id="euLamVidNar">🎬 Vídeo narrado</button>' +
      '</div>');
    h.push('<div id="euLamEstado" style="margin-top:9px"></div>');
    h.push('<div id="euLamBandeja"></div>');
    return h.join('');
  }

  /* ───────────── Pantalla ───────────── */

  function pintar() {
    var caja = EU.$('euLaminas');
    if (!caja) return;
    var M = LM(), D = LD();
    if (!M || !D) {
      caja.innerHTML = '<p class="ayuda">Los motores de láminas no se han cargado. Comprueba que ' +
        '<code>b6_laminas_motor.js</code> y <code>b6_laminas_disenos.js</code> están en la página.</p>';
      return;
    }

    if (!st.lam) {
      var prim = (D.lista(st.fam) || [])[0];
      if (prim) { st.disenoId = prim.id; st.lam = nueva(prim.id); st.hoja = 0; }
    }

    var fam = D.FAMILIAS.filter(function (f) { return f.id === st.fam; })[0] || D.FAMILIAS[0];
    var todas = D.lista(st.fam) || [];
    var cats = [];
    todas.forEach(function (p) { if (cats.indexOf(p.cat) < 0) cats.push(p.cat); });
    var visibles = st.cat ? todas.filter(function (p) { return p.cat === st.cat; }) : todas;
    var esCarrusel = st.lam && st.lam.familia === 'carrusel';
    var nH = totalHojas();

    var h = [];

    /* Familias */
    h.push('<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:6px">');
    D.FAMILIAS.forEach(function (f) {
      h.push('<button data-fam="' + EU.esc(f.id) + '" style="' + chip(f.id === st.fam) + '">' +
        EU.esc(f.icono + ' ' + f.nombre) + '</button>');
    });
    h.push('</div>');
    h.push('<p style="margin:0 0 12px;font-size:11px;color:#7c7c9e">' + EU.esc(fam.d || '') + '</p>');

    h.push('<div class="lm-cols">');

    /* ── Lienzo ── */
    h.push('<div>');
    h.push('<div style="background:#0a0a14;border:1px solid #2d2d4a;border-radius:12px;padding:14px;' +
      'display:flex;justify-content:center">' +
      '<canvas id="euLamLienzo" width="640" height="905" style="max-width:100%;max-height:62vh;' +
      'height:auto;border-radius:6px;box-shadow:0 14px 40px rgba(0,0,0,.6);background:#000"></canvas></div>');

    if (esCarrusel && nH > 1) {
      h.push('<div style="display:flex;gap:8px;align-items:center;justify-content:center;margin-top:10px">' +
        '<button id="euLamAnt" style="background:transparent;border:1px solid #2d2d4a;color:#94a3b8;' +
        'border-radius:8px;padding:6px 13px;font-size:12px;cursor:pointer;font-family:inherit">‹ Anterior</button>' +
        '<span style="font-size:11.5px;color:#94a3b8;min-width:64px;text-align:center">' +
        (st.hoja + 1) + ' de ' + nH + '</span>' +
        '<button id="euLamSig" style="background:transparent;border:1px solid #2d2d4a;color:#94a3b8;' +
        'border-radius:8px;padding:6px 13px;font-size:12px;cursor:pointer;font-family:inherit">Siguiente ›</button></div>');
    }

    h.push('<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px">' +
      '<button id="euLamPlay" style="background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;border:0;' +
      'border-radius:9px;padding:9px 16px;font-size:12.5px;font-weight:600;cursor:pointer;font-family:inherit">▶ Reproducir</button>' +
      '<button id="euLamStop" style="background:transparent;border:1px solid #2d2d4a;color:#94a3b8;' +
      'border-radius:9px;padding:9px 15px;font-size:12.5px;cursor:pointer;font-family:inherit">■ Parar</button>' +
      '<button id="euLamVoz" style="background:transparent;border:1px solid #2d2d4a;color:#94a3b8;' +
      'border-radius:9px;padding:9px 15px;font-size:12.5px;cursor:pointer;font-family:inherit">🔊 Narrar por nodo</button>' +
      '</div>');

    h.push('</div>');

    /* ── Panel con pestañas ── */
    h.push('<div class="lm-panel">');
    h.push('<div style="display:flex;border-bottom:1px solid #2d2d4a;background:#13132a;' +
      'margin:-13px -13px 12px;border-radius:12px 12px 0 0;overflow:auto">');
    PANELES.forEach(function (t) {
      var on = st.panel === t.id;
      h.push('<button data-pan="' + t.id + '" style="flex:1;min-width:74px;background:' +
        (on ? '#18183a' : 'transparent') + ';border:0;border-bottom:2px solid ' +
        (on ? '#a855f7' : 'transparent') + ';color:' + (on ? '#e2e8f0' : '#7c7c9e') +
        ';padding:10px 6px;font-size:11px;font-weight:600;cursor:pointer;font-family:inherit;' +
        'white-space:nowrap">' + EU.esc(t.n) + '</button>');
    });
    h.push('</div>');

    if (st.panel === 'galeria') h.push(panGaleria(todas, visibles, cats));
    else if (st.panel === 'contenido') h.push(panContenido());
    else if (st.panel === 'estilo') h.push(panEstilo());
    else if (st.panel === 'anim') h.push(panAnim());
    else h.push(panBajar(nH));

    h.push('</div>');

    h.push('</div>');
    caja.innerHTML = h.join('');

    elLienzo = EU.$('euLamLienzo');
    elGaleria = EU.$('euLamGaleria');
    enganchar(caja, nH);
    pintarLienzo();
    /* Las miniaturas después del primer pintado: la grande primero, que es
       la que se está mirando. */
    if (st.panel === 'galeria') setTimeout(pintarGaleria, 0);

    var hb = EU.$('euLamBandeja');
    if (hb && window.B6Bandeja) {
      if (P._des) { try { P._des(); } catch (e) {} }
      P._des = B6Bandeja.panel(hb, { origen: 'laminas' }, 'laminas');
    }
  }

  function enganchar(caja, nH) {
    caja.onclick = function (ev) {
      var b = ev.target.closest ? ev.target.closest('button') : null;
      if (!b) return;

      if (b.hasAttribute('data-fam')) {
        parar();
        st.fam = b.getAttribute('data-fam');
        st.cat = ''; st.hoja = 0; st.prog = 1;
        var prim = (LD().lista(st.fam) || [])[0];
        st.disenoId = prim ? prim.id : '';
        st.lam = prim ? nueva(prim.id) : null;
        return pintar();
      }
      if (b.hasAttribute('data-lam-sel')) {
        parar();
        st.disenoId = b.getAttribute('data-lam-sel');
        st.lam = nueva(st.disenoId);
        st.hoja = 0; st.prog = 1;
        return pintar();
      }
      if (b.id === 'euLamAnt') { parar(); st.hoja = Math.max(0, st.hoja - 1); st.prog = 1; return pintar(); }
      if (b.id === 'euLamSig') { parar(); st.hoja = Math.min(nH - 1, st.hoja + 1); st.prog = 1; return pintar(); }
      if (b.id === 'euLamPlay') return reproducir();
      if (b.id === 'euLamStop') { parar(); st.prog = 1; return pintarLienzo(); }
      if (b.id === 'euLamVoz') return narrar();
      if (b.id === 'euLamPNG') return bajarPNG();
      if (b.id === 'euLamPDF') return bajarPDF(false);
      if (b.id === 'euLamPDFT') return bajarPDF(true);
      if (b.id === 'euLamZIP') return bajarZIP();
      if (b.id === 'euLamVid') return bajarVideo(false);
      if (b.id === 'euLamVidNar') return bajarVideo(true);

      if (b.hasAttribute('data-pan')) { st.panel = b.getAttribute('data-pan'); return pintar(); }
      if (b.hasAttribute('data-quitanodo')) {
        var qi = parseInt(b.getAttribute('data-quitanodo'), 10);
        if (st.lam && st.lam.nodos.length > 1) {
          st.lam.nodos.splice(qi, 1);
          st.nodo = Math.max(0, Math.min(st.nodo, st.lam.nodos.length - 1));
          pintar();
        } else EU.toast('Tiene que quedar al menos un nodo.');
        return;
      }
      if (b.id === 'euLamMas') {
        st.lam.nodos.push({ t: 'Rama nueva', d: '', nivel: 1 });
        st.nodo = st.lam.nodos.length - 1;
        return pintar();
      }
      if (b.id === 'euLamRepartir') {
        var ta = EU.$('euLamTexto');
        st.texto = ta ? ta.value : '';
        if (!st.texto.trim()) return EU.toast('Pega antes un texto.');
        st.lam.nodos = LM().nodosDeTexto(st.texto);
        st.lam.titulo = st.lam.nodos[0] ? st.lam.nodos[0].t : st.lam.titulo;
        st.nodo = 0;
        pintar();
        return EU.toast('Texto repartido en ' + st.lam.nodos.length + ' nodos.');
      }
      if (b.id === 'euLamColRes') { delete st.lam.colores; return pintar(); }
      if (b.hasAttribute('data-sw')) {
        var k = b.getAttribute('data-sw');
        st.lam[k] = !st.lam[k];
        return pintar();
      }
      if (b.hasAttribute('data-anim')) {
        st.lam.animacion = b.getAttribute('data-anim');
        return pintar();
      }
    };

    /* Lo que se escribe repinta la lámina pero NO vuelve a montar el panel:
       si se remontara, el cursor saltaría fuera del campo en cada letra. */
    caja.oninput = function (ev) {
      var t = ev.target;
      if (!t || !st.lam) return;
      if (t.id === 'euLamTit') { st.lam.titulo = t.value; return pintarLienzo(); }
      if (t.id === 'euLamSub') { st.lam.subtitulo = t.value; return pintarLienzo(); }
      if (t.id === 'euLamRot') { st.lam.rotulo = t.value; return pintarLienzo(); }
      if (t.id === 'euLamPie') { st.lam.pie = t.value; return pintarLienzo(); }
      if (t.id === 'euLamTexto') { st.texto = t.value; return; }
      if (t.id === 'euLamSeg') { st.lam.segPorNodo = parseFloat(t.value); return; }
      if (t.hasAttribute('data-nt')) {
        st.lam.nodos[parseInt(t.getAttribute('data-nt'), 10)].t = t.value;
        return pintarLienzo();
      }
      if (t.hasAttribute('data-nd')) {
        st.lam.nodos[parseInt(t.getAttribute('data-nd'), 10)].d = t.value;
        return pintarLienzo();
      }
      if (t.hasAttribute('data-col')) {
        st.lam.colores = st.lam.colores || {};
        st.lam.colores[t.getAttribute('data-col')] = t.value;
        return pintarLienzo();
      }
    };

    caja.onchange = function (ev) {
      var t = ev.target;
      if (!t || !st.lam) return;
      if (t.id === 'euLamCat') { st.cat = t.value; return pintar(); }
      if (t.id === 'euLamEst') { st.lam.estructura = t.value; return pintar(); }
      if (t.id === 'euLamPal') { st.lam.paleta = t.value; delete st.lam.colores; return pintar(); }
      if (t.id === 'euLamFmt') { st.lam.formato = t.value; return pintar(); }
      if (t.id === 'euLamFrm') {
        st.lam.opciones = st.lam.opciones || {};
        st.lam.opciones.forma = t.value;
        return pintar();
      }
      if (t.id === 'euLamSeg') return pintar();
    };
  }

  P.entrar = function () { pintar(); };
  P.salir = function () { parar(); };

  window.EU_LAMINAS = P;
})();

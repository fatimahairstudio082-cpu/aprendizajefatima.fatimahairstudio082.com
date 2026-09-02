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
    animando: false
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

    h.push('<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px">' +
      '<button id="euLamPNG" style="background:transparent;border:1px solid #2d2d4a;color:#cbd5e1;' +
      'border-radius:9px;padding:9px 15px;font-size:12.5px;cursor:pointer;font-family:inherit">↓ PNG</button>' +
      '<button id="euLamPDF" style="background:transparent;border:1px solid #2d2d4a;color:#cbd5e1;' +
      'border-radius:9px;padding:9px 15px;font-size:12.5px;cursor:pointer;font-family:inherit">↓ PDF</button>' +
      (nH > 1 ? '<button id="euLamPDFT" style="background:transparent;border:1px solid #2d2d4a;color:#cbd5e1;' +
        'border-radius:9px;padding:9px 15px;font-size:12.5px;cursor:pointer;font-family:inherit">↓ PDF · las ' +
        nH + ' hojas</button>' : '') +
      '</div>');
    h.push('</div>');

    /* ── Galería ── */
    h.push('<div class="lm-panel">');
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
    h.push('</div></div>');

    h.push('</div>');
    caja.innerHTML = h.join('');

    elLienzo = EU.$('euLamLienzo');
    elGaleria = EU.$('euLamGaleria');
    enganchar(caja, nH);
    pintarLienzo();
    /* Las miniaturas después del primer pintado: la grande primero, que es
       la que se está mirando. */
    setTimeout(pintarGaleria, 0);
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
    };

    var sel = EU.$('euLamCat');
    if (sel) sel.onchange = function () { st.cat = sel.value; pintar(); };
  }

  P.entrar = function () { pintar(); };
  P.salir = function () { parar(); };

  window.EU_LAMINAS = P;
})();

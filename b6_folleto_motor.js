/* ═══════════════════════════════════════════════════════════════════════════
   MOTOR DE DIBUJO · Folletos Pro (Bloque 6)
   ───────────────────────────────────────────────────────────────────────────
   Todo lo que se ve del folleto se dibuja aquí, en canvas 2D. Es la ÚNICA
   fuente de verdad: el muestrario, la vista previa, el PNG, el PDF y el vídeo
   llaman a estas mismas funciones, así que no pueden desincronizarse.

   Reutiliza, cuando existen, los ayudantes que ya viven en
   bloque6_herramientas.html (tpRound, flCover, flWrapLines). Si no existen
   —por ejemplo en el muestrario, que es una página suelta— usa su propia
   copia. Cargarlo solo nunca rompe nada.

   API pública:
     FOLLETO_MOTOR.FORMATOS · .TEMAS · .REJILLAS
     FOLLETO_MOTOR.rejilla(id, x, y, w, h, hueco) → [{x,y,w,h}…]
     FOLLETO_MOTOR.pintar(ctx, W, H, pagina, opciones)
     FOLLETO_MOTOR.colores(pagina) · .fotoDemo(...)
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if (window._B6_FOLLETO_MOTOR_LOADED) return;
  window._B6_FOLLETO_MOTOR_LOADED = true;

  /* ───────────────────────── Formatos de hoja ───────────────────────── */

  var FORMATOS = {
    a4v:      { nombre: 'A4 vertical',          w: 1240, h: 1754, mm: [210, 297] },
    a4h:      { nombre: 'A4 horizontal',        w: 1754, h: 1240, mm: [297, 210] },
    cuadrado: { nombre: 'Cuadrado · Instagram', w: 1080, h: 1080, mm: [210, 210] },
    vertical: { nombre: 'Vertical 4:5 · feed',  w: 1080, h: 1350, mm: [190, 238] },
    historia: { nombre: 'Historia · WhatsApp',  w: 1080, h: 1920, mm: [160, 284] }
  };

  /* ───────────────────────── Paletas ─────────────────────────
     claro:true  → pensada para imprimir en papel
     claro:false → luce más en la pantalla del móvil                     */

  /* Parejas tipográficas premium. Cada tema elige una fuente de título (con
     carácter) y una de cuerpo (limpia y legible). Es lo que hace que todas las
     categorías se vean profesionales y no «hechas a máquina». */
  var _SERIF_A = '"Playfair Display", Georgia, serif';
  var _SERIF_B = '"Cormorant Garamond", Georgia, serif';
  var _SANS_D  = '"Space Grotesk", "Segoe UI", sans-serif';
  var _SANS_B  = 'Manrope, "Segoe UI", Arial, sans-serif';

  var TEMAS = {
    oro_negro:  { nombre: 'Oro & Negro',      claro: false, fondo: '#0B0B0D', panel: '#17171B', tinta: '#F5F1E8', tinta2: '#A79E8C', acento: '#C9A227', acento2: '#8C6D1F', titulo: _SERIF_A, cuerpo: _SANS_B },
    rosa:       { nombre: 'Rosa Studio',      claro: true,  fondo: '#FFF5F7', panel: '#FFFFFF', tinta: '#2B1B22', tinta2: '#7A6470', acento: '#E8547C', acento2: '#F2A0B8', titulo: _SERIF_B, cuerpo: _SANS_B },
    nude:       { nombre: 'Nude Elegante',    claro: true,  fondo: '#F3EAE3', panel: '#FFFDFB', tinta: '#3A2E28', tinta2: '#8A776B', acento: '#B08968', acento2: '#DDC3AC', titulo: _SERIF_B, cuerpo: _SANS_B },
    burdeos:    { nombre: 'Burdeos',          claro: false, fondo: '#2A0E17', panel: '#3D1622', tinta: '#F6E9EC', tinta2: '#C39BA6', acento: '#9B2242', acento2: '#D96E86', titulo: _SERIF_A, cuerpo: _SANS_B },
    botanico:   { nombre: 'Verde Botánico',   claro: false, fondo: '#101E18', panel: '#162C22', tinta: '#EAF3ED', tinta2: '#9DBCA9', acento: '#2E7D5B', acento2: '#7FC8A0', titulo: _SERIF_B, cuerpo: _SANS_B },
    corporativo:{ nombre: 'Azul Corporativo', claro: true,  fondo: '#F4F7FB', panel: '#FFFFFF', tinta: '#10233A', tinta2: '#5B7392', acento: '#1E5AA8', acento2: '#4E93D9', titulo: _SANS_D, cuerpo: _SANS_B },
    cian:       { nombre: 'Cian Neón',        claro: false, fondo: '#07131A', panel: '#0E2029', tinta: '#E6FAFF', tinta2: '#7FB3C4', acento: '#06B6D4', acento2: '#22E3B0', titulo: _SANS_D, cuerpo: _SANS_B },
    coral:      { nombre: 'Coral Cálido',     claro: true,  fondo: '#FFF6F0', panel: '#FFFFFF', tinta: '#3A211A', tinta2: '#8B6A5C', acento: '#F2683C', acento2: '#FFB08A', titulo: _SERIF_A, cuerpo: _SANS_B },
    minimal:    { nombre: 'Blanco Minimal',   claro: true,  fondo: '#FFFFFF', panel: '#F7F7F5', tinta: '#141414', tinta2: '#6E6E6E', acento: '#141414', acento2: '#C9C9C4', titulo: _SANS_D, cuerpo: _SANS_D },
    violeta:    { nombre: 'Violeta Fátima',   claro: false, fondo: '#0D0D1A', panel: '#18183A', tinta: '#E2E8F0', tinta2: '#94A3B8', acento: '#7C3AED', acento2: '#A855F7', titulo: _SANS_D, cuerpo: _SANS_B }
  };

  /* Fuentes activas de la hoja que se está pintando. Las fija pintar() según el
     tema; los ayudantes de texto (versalitas, píldora, encajar) las leen. */
  var FUENTE_T = _SANS_D, FUENTE_C = _SANS_B;
  function fijarFuentes(C) { FUENTE_T = (C && C.titulo) || _SANS_D; FUENTE_C = (C && C.cuerpo) || _SANS_B; }

  /* Carga las fuentes web una sola vez, desde el propio motor, para no depender
     de que el HTML anfitrión las incluya. Si no hay internet, el navegador cae
     a Georgia/Segoe y todo sigue funcionando. */
  function garantizarFuentes() {
    if (typeof document === 'undefined' || document.getElementById('fpFuentes')) return;
    var l = document.createElement('link');
    l.id = 'fpFuentes'; l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Cormorant+Garamond:wght@600;700&family=Space+Grotesk:wght@400;500;600;700&family=Manrope:wght@400;500;600;700&display=swap';
    document.head.appendChild(l);
  }

  /* ───────────────────────── Rejillas ─────────────────────────
     Cada rejilla es una lista de filas: alto = peso vertical de la fila,
     cols = pesos horizontales de los cuadros de esa fila. Con eso salen
     las ocho plantillas sin escribir coordenadas a mano.                */

  var REJILLAS = {
    r1:  { nombre: 'Pieza única',        n: 1, uso: 'Carta, cartel o anuncio',    filas: [{ alto: 1, cols: [1] }] },
    r2a: { nombre: 'Dúo apilado',        n: 2, uso: 'Antes y después',            filas: [{ alto: 1, cols: [1] }, { alto: 1, cols: [1] }] },
    r2b: { nombre: 'Dúo lado a lado',    n: 2, uso: 'Dos promociones',            filas: [{ alto: 1, cols: [1, 1] }] },
    r4a: { nombre: 'Cuadrícula 2×2',     n: 4, uso: 'La tarifa clásica',          filas: [{ alto: 1, cols: [1, 1] }, { alto: 1, cols: [1, 1] }] },
    r4b: { nombre: 'Revista',            n: 4, uso: 'Un servicio estrella',       filas: [{ alto: 1.35, cols: [1] }, { alto: 1, cols: [1, 1, 1] }] },
    r6a: { nombre: 'Catálogo 2×3',       n: 6, uso: 'La carta completa',          filas: [{ alto: 1, cols: [1, 1] }, { alto: 1, cols: [1, 1] }, { alto: 1, cols: [1, 1] }] },
    r6b: { nombre: 'Escaparate',         n: 6, uso: 'Lo caro arriba, ofertas abajo', filas: [{ alto: 1.2, cols: [1] }, { alto: 1, cols: [1, 1] }, { alto: 0.85, cols: [1, 1, 1] }] },
    r8a: { nombre: 'Mosaico 2×4',        n: 8, uso: 'Tarifa larga',               filas: [{ alto: 1, cols: [1, 1] }, { alto: 1, cols: [1, 1] }, { alto: 1, cols: [1, 1] }, { alto: 1, cols: [1, 1] }] },
    r8b: { nombre: 'Lookbook',           n: 8, uso: 'Catálogo con jerarquía',     filas: [{ alto: 1.25, cols: [1, 1] }, { alto: 1, cols: [1, 1, 1, 1] }, { alto: 1.05, cols: [1, 1] }] },
    rlista: { nombre: 'Foto + lista de precios', n: 6, uso: 'Foto grande y tarifa al lado', filas: [{ alto: 1, cols: [1] }] }
  };

  function repartir(filas, x, y, w, h, g) {
    var pesoTotal = 0, i, j;
    for (i = 0; i < filas.length; i++) pesoTotal += filas[i].alto;
    var libre = h - g * (filas.length - 1);
    var rects = [], cy = y;
    for (i = 0; i < filas.length; i++) {
      var fh = libre * (filas[i].alto / pesoTotal);
      var cols = filas[i].cols, pc = 0;
      for (j = 0; j < cols.length; j++) pc += cols[j];
      var libreX = w - g * (cols.length - 1), cx = x;
      for (j = 0; j < cols.length; j++) {
        var cw = libreX * (cols[j] / pc);
        rects.push({ x: cx, y: cy, w: cw, h: fh });
        cx += cw + g;
      }
      cy += fh + g;
    }
    return rects;
  }

  /* En hojas apaisadas la rejilla se calcula en vertical y se gira 90°, así
     una 2×3 se convierte en 3×2 sola y ningún cuadro sale espachurrado. */
  function rejilla(id, x, y, w, h, g) {
    var R = REJILLAS[id] || REJILLAS.r4a;
    g = (g == null) ? Math.round(Math.min(w, h) * 0.022) : g;
    if (w > h * 1.15) {
      var base = repartir(R.filas, 0, 0, h, w, g);
      return base.map(function (r) {
        return { x: x + (w - (r.y + r.h)), y: y + r.x, w: r.h, h: r.w };
      });
    }
    return repartir(R.filas, x, y, w, h, g);
  }

  /* ───────────────────────── Ayudantes de dibujo ───────────────────────── */

  function redondo(ctx, x, y, w, h, r) {
    if (typeof window.tpRound === 'function') return window.tpRound(ctx, x, y, w, h, r);
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  /* Ojo con los vídeos: flCover (el del bloque) mide con img.width, que en un
     <video> vale 0 porque es el atributo HTML, no el tamaño real. Salía NaN y
     el cuadro se quedaba en blanco. Los vídeos se miden aquí con videoWidth. */
  /* ken (opcional) = { t:segundos, seed:nº de cuadro, amp:0..1.6 } activa el
     efecto Ken Burns —zoom y paneo lentos— SÓLO en fotos. Los vídeos ya se
     mueven solos, así que nunca reciben Ken Burns. Sin `ken`, dibuja igual
     que siempre (compatibilidad total con lo que ya llamaba a cubrir). */
  function cubrir(ctx, img, x, y, w, h, ken) {
    var esVideo = !!img.videoWidth;
    var iw = img.videoWidth || img.width, ih = img.videoHeight || img.height;
    if (!iw || !ih) return;

    if (ken && !esVideo) {
      var ph = (ken.seed || 0) * 1.3, mv = (ken.amp == null ? 1 : ken.amp), t = ken.t || 0;
      var z = 1.04 + (0.05 + 0.05 * mv) * (0.5 + 0.5 * Math.sin(t * 0.5 + ph));
      var dx = Math.sin(t * 0.35 + ph) * w * 0.05 * mv;
      var dy = Math.cos(t * 0.30 + ph) * h * 0.05 * mv;
      var zw = w * z, zh = h * z;
      var ir0 = iw / ih, rr0 = zw / zh, sw0, sh0, sx0, sy0;
      if (ir0 > rr0) { sh0 = ih; sw0 = sh0 * rr0; sx0 = (iw - sw0) / 2; sy0 = 0; }
      else { sw0 = iw; sh0 = sw0 / rr0; sx0 = 0; sy0 = (ih - sh0) / 2; }
      ctx.save();
      ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
      ctx.drawImage(img, sx0, sy0, sw0, sh0, x - (zw - w) / 2 + dx, y - (zh - h) / 2 + dy, zw, zh);
      ctx.restore();
      return;
    }

    if (!esVideo && typeof window.flCover === 'function') return window.flCover(ctx, img, x, y, w, h);
    var ir = iw / ih, rr = w / h, sw, sh, sx, sy;
    if (ir > rr) { sh = ih; sw = sh * rr; sx = (iw - sw) / 2; sy = 0; }
    else { sw = iw; sh = sw / rr; sx = 0; sy = (ih - sh) / 2; }
    ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
  }

  function partirLineas(ctx, texto, maxW) {
    if (typeof window.flWrapLines === 'function') return window.flWrapLines(ctx, texto, maxW);
    var palabras = String(texto || '').split(/\s+/), linea = '', lineas = [];
    palabras.forEach(function (p) {
      var t = linea ? linea + ' ' + p : p;
      if (ctx.measureText(t).width > maxW && linea) { lineas.push(linea); linea = p; }
      else linea = t;
    });
    if (linea) lineas.push(linea);
    return lineas;
  }

  /* Encoge la letra hasta que el texto cabe en las líneas permitidas. Es lo
     que evita que un nombre de servicio largo se salga del cuadro pequeño. */
  function encajar(ctx, texto, maxW, maxLineas, tam, peso, minTam, fuente) {
    minTam = minTam || 9;
    fuente = fuente || FUENTE_C;
    if (minTam > tam) minTam = tam;
    var t = tam, lineas;
    for (;;) {
      ctx.font = peso + ' ' + t.toFixed(1) + 'px ' + fuente;
      lineas = partirLineas(ctx, texto, maxW);
      if (lineas.length <= maxLineas || t <= minTam) break;
      t = Math.max(minTam, t - Math.max(0.5, t * 0.06));
    }
    // sólo se recorta si de verdad sobra texto (antes ponía «…» aunque cupiese)
    if (lineas.length > maxLineas) {
      lineas = lineas.slice(0, maxLineas);
      var u = lineas[maxLineas - 1];
      while (u.length > 4 && ctx.measureText(u + '…').width > maxW) u = u.slice(0, -1);
      lineas[maxLineas - 1] = u + '…';
    }
    return { lineas: lineas, tam: t };
  }

  function hex2rgb(h) {
    h = String(h || '#000').replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var v = parseInt(h, 16);
    return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
  }
  function rgba(h, a) { var c = hex2rgb(h); return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')'; }
  function mezclar(a, b, t) {
    var x = hex2rgb(a), y = hex2rgb(b);
    return 'rgb(' + Math.round(x[0] + (y[0] - x[0]) * t) + ',' + Math.round(x[1] + (y[1] - x[1]) * t) + ',' + Math.round(x[2] + (y[2] - x[2]) * t) + ')';
  }

  function versalitas(ctx, texto, x, y, tam, color, sep) {
    ctx.fillStyle = color;
    ctx.font = '700 ' + tam.toFixed(1) + 'px ' + FUENTE_C;
    ctx.textAlign = 'left';
    var t = String(texto || '').toUpperCase(), cx = x;
    sep = (sep == null) ? tam * 0.16 : sep;
    for (var i = 0; i < t.length; i++) {
      ctx.fillText(t[i], cx, y);
      cx += ctx.measureText(t[i]).width + sep;
    }
    return cx - x;
  }

  function anchoVersalitas(ctx, texto, tam, sep) {
    ctx.font = '700 ' + tam.toFixed(1) + 'px ' + FUENTE_C;
    var t = String(texto || '').toUpperCase(), w = 0;
    sep = (sep == null) ? tam * 0.16 : sep;
    for (var i = 0; i < t.length; i++) w += ctx.measureText(t[i]).width + sep;
    return w;
  }

  function pildora(ctx, texto, x, y, tam, fondo, tintaTexto, alinear) {
    ctx.font = '700 ' + tam.toFixed(1) + 'px ' + FUENTE_C;
    var tw = ctx.measureText(texto).width;
    var padX = tam * 0.75, h = tam * 1.9, w = tw + padX * 2;
    var px = (alinear === 'derecha') ? x - w : x;
    redondo(ctx, px, y, w, h, h / 2);
    ctx.fillStyle = fondo; ctx.fill();
    ctx.fillStyle = tintaTexto;
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillText(texto, px + padX, y + h / 2 + tam * 0.03);
    ctx.textBaseline = 'alphabetic';
    return { x: px, y: y, w: w, h: h };
  }

  /* ───────────────────────── Colores de la página ───────────────────────── */

  function colores(pag) {
    var base = TEMAS[(pag && pag.tema)] || TEMAS.oro_negro;
    var c = {
      claro: base.claro, fondo: base.fondo, panel: base.panel,
      tinta: base.tinta, tinta2: base.tinta2, acento: base.acento, acento2: base.acento2,
      titulo: base.titulo, cuerpo: base.cuerpo
    };
    if (pag && pag.colores) {
      ['fondo', 'panel', 'tinta', 'tinta2', 'acento', 'acento2'].forEach(function (k) {
        if (pag.colores[k]) c[k] = pag.colores[k];
      });
    }
    // sobre acento fuerte, el texto de la píldora en blanco o negro según pese
    var a = hex2rgb(c.acento);
    c.sobreAcento = (a[0] * 0.299 + a[1] * 0.587 + a[2] * 0.114) > 150 ? '#111111' : '#FFFFFF';
    return c;
  }

  /* ───────────────────────── Foto de ejemplo ─────────────────────────
     Para el muestrario y para los cuadros vacíos: una imagen abstracta
     hecha con la propia paleta. No finge ser una foto real.            */

  function fotoDemo(ctx, x, y, w, h, semilla, C) {
    var s = (semilla * 2654435761) % 2147483647;
    function r() { s = (s * 16807) % 2147483647; return s / 2147483647; }
    var g = ctx.createLinearGradient(x, y, x + w, y + h);
    g.addColorStop(0, mezclar(C.panel, C.acento, 0.30));
    g.addColorStop(1, mezclar(C.panel, C.acento2, 0.55));
    ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
    for (var i = 0; i < 3; i++) {
      var cx = x + w * (0.18 + r() * 0.7), cy = y + h * (0.15 + r() * 0.7);
      var rad = Math.min(w, h) * (0.28 + r() * 0.42);
      var col = [C.acento, C.acento2, C.tinta][i % 3];
      var rg = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
      rg.addColorStop(0, rgba(col, 0.42));
      rg.addColorStop(1, rgba(col, 0));
      ctx.fillStyle = rg; ctx.fillRect(x, y, w, h);
    }
    ctx.save();
    ctx.globalAlpha = 0.16;
    ctx.strokeStyle = C.tinta;
    ctx.lineWidth = Math.max(1, Math.min(w, h) * 0.008);
    for (var k = 0; k < 4; k++) {
      ctx.beginPath();
      ctx.arc(x + w * 0.72, y + h * 0.78, Math.min(w, h) * (0.12 + k * 0.13), 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  /* ───────────────────────── Fondo, grano y viñeta ───────────────────────── */

  function fondo(ctx, W, H, C, ad) {
    var g = ctx.createLinearGradient(0, 0, W * 0.35, H);
    g.addColorStop(0, C.fondo);
    g.addColorStop(1, mezclar(C.fondo, C.panel, 0.85));
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

    // halo suave del acento, arriba a la derecha
    var rg = ctx.createRadialGradient(W * 0.86, H * 0.06, 0, W * 0.86, H * 0.06, Math.max(W, H) * 0.55);
    rg.addColorStop(0, rgba(C.acento, C.claro ? 0.14 : 0.20));
    rg.addColorStop(1, rgba(C.acento, 0));
    ctx.fillStyle = rg; ctx.fillRect(0, 0, W, H);

    if (ad.vineta) {
      var v = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.30, W / 2, H / 2, Math.max(W, H) * 0.75);
      var borde = C.claro ? rgba(C.tinta, 0.10) : 'rgba(0,0,0,.45)';
      v.addColorStop(0, 'rgba(0,0,0,0)');
      v.addColorStop(1, borde);
      ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
    }
    if (ad.grano) {
      var n = Math.floor(W * H * 0.00045);
      for (var i = 0; i < n; i++) {
        var a = 0.02 + Math.random() * 0.05;
        ctx.fillStyle = (Math.random() < 0.5 ? 'rgba(255,255,255,' : 'rgba(0,0,0,') + a + ')';
        ctx.fillRect(Math.random() * W, Math.random() * H, 1.5, 1.5);
      }
    }
  }

  /* ───────────────────────── Cabecera y pie ───────────────────────── */

  function cabecera(ctx, W, H, M, C, pag, ad) {
    var cab = pag.cabecera || {};
    var tamM = W * 0.0155;
    var y = M + tamM;   // y es SIEMPRE la línea base del texto que toca escribir

    if (cab.marca) {
      var anchoM = versalitas(ctx, cab.marca, M, y, tamM, C.acento);
      if (ad.filetes) {
        // el filete va a la altura del ojo de la versalita, nunca sobre el título
        ctx.strokeStyle = rgba(C.acento, 0.55);
        ctx.lineWidth = Math.max(1, W * 0.0016);
        ctx.beginPath();
        ctx.moveTo(M + anchoM + W * 0.018, y - tamM * 0.34);
        ctx.lineTo(W - M, y - tamM * 0.34);
        ctx.stroke();
      }
      y += W * 0.020;   // aire entre la marca y el título
    }

    var t = encajar(ctx, cab.titulo || '', W - M * 2, 2, W * 0.058, '800', W * 0.034, FUENTE_T);
    y += t.tam;
    ctx.fillStyle = C.tinta; ctx.textAlign = 'left';
    t.lineas.forEach(function (l, i) { ctx.fillText(l, M, y + i * t.tam * 1.10); });
    y += (t.lineas.length - 1) * t.tam * 1.10;

    if (cab.subtitulo) {
      var s = encajar(ctx, cab.subtitulo, W - M * 2, 2, W * 0.025, '400', W * 0.018);
      y += W * 0.016 + s.tam;
      ctx.fillStyle = C.tinta2;
      s.lineas.forEach(function (l, i) { ctx.fillText(l, M, y + i * s.tam * 1.3); });
      y += (s.lineas.length - 1) * s.tam * 1.3;
    }
    return y + W * 0.034;
  }

  function pie(ctx, W, H, M, C, pag, ad, nPag) {
    var p = pag.pie || {};
    var yLinea = H - M - W * 0.052;
    if (ad.filetes) {
      ctx.strokeStyle = rgba(C.tinta2, 0.35);
      ctx.lineWidth = Math.max(1, W * 0.0012);
      ctx.beginPath(); ctx.moveTo(M, yLinea); ctx.lineTo(W - M, yLinea); ctx.stroke();
    }
    var yTexto = H - M - W * 0.016;
    var tam = W * 0.021;

    if (p.contacto) {
      ctx.fillStyle = C.tinta2;
      ctx.font = '600 ' + tam.toFixed(1) + 'px ' + FUENTE_C;
      ctx.textAlign = 'left';
      ctx.fillText(p.contacto, M, yTexto);
    }
    if (p.cta) {
      pildora(ctx, p.cta, W - M, yTexto - tam * 1.5, tam, C.acento, C.sobreAcento, 'derecha');
    }
    if (nPag) {
      ctx.fillStyle = rgba(C.tinta2, 0.7);
      ctx.font = '700 ' + (tam * 0.9).toFixed(1) + 'px ' + FUENTE_C;
      ctx.textAlign = 'center';
      ctx.fillText(String(nPag), W / 2, yTexto);
    }
  }

  /* ───────────────────────── Un cuadro ───────────────────────── */

  /* Medidas de un cuadro. Se calculan aparte porque hacen falta dos veces:
     una para medir todos los cuadros iguales y darles la MISMA letra, y otra
     al dibujar. Si cada cuadro elige su tamaño por su cuenta, la hoja queda
     con letras de distinto tamaño y se nota que está hecha a máquina. */
  function geometria(r) {
    var lado = Math.min(r.w, r.h);
    var pad = lado * 0.085;
    return {
      lado: lado, pad: pad, maxW: r.w - pad * 2,
      tamPrecio: Math.max(9, lado * 0.085),
      titulo: Math.max(10, lado * 0.098), minTitulo: Math.max(9, lado * 0.072),
      texto: Math.max(8, lado * 0.062), minTexto: Math.max(7, lado * 0.050)
    };
  }

  function medir(ctx, r, celda) {
    celda = celda || {};
    var G = geometria(r);
    return {
      titulo: celda.titulo ? encajar(ctx, celda.titulo, G.maxW, 2, G.titulo, '800', G.minTitulo, FUENTE_T).tam : G.titulo,
      texto: (celda.texto && r.h > G.lado * 0.55)
        ? encajar(ctx, celda.texto, G.maxW, 2, G.texto, '400', G.minTexto).tam : G.texto
    };
  }

  function cuadro(ctx, r, C, celda, idx, ad, op, forz) {
    celda = celda || {};
    var G = geometria(r);
    forz = forz || { titulo: G.titulo, texto: G.texto };
    var radio = Math.min(r.w, r.h) * 0.075;
    var lado = G.lado;

    if (ad.sombras) {
      ctx.save();
      ctx.shadowColor = C.claro ? rgba(C.tinta, 0.22) : 'rgba(0,0,0,.5)';
      ctx.shadowBlur = lado * 0.10;
      ctx.shadowOffsetY = lado * 0.03;
      redondo(ctx, r.x, r.y, r.w, r.h, radio);
      ctx.fillStyle = C.panel; ctx.fill();
      ctx.restore();
    }

    ctx.save();
    redondo(ctx, r.x, r.y, r.w, r.h, radio);
    ctx.clip();

    // media: foto, fotograma de vídeo, o imagen de ejemplo
    var med = celda.media;
    var pintada = false;
    if (med && med.el) {
      var listo = (med.tipo === 'vid')
        ? (med.el.readyState >= 2)
        : (med.el.complete !== false && (med.el.naturalWidth || med.el.width));
      if (listo) { cubrir(ctx, med.el, r.x, r.y, r.w, r.h, op.ken ? { t: op.t || 0, seed: idx + 1, amp: op.kenAmp } : null); pintada = true; }
    }
    if (!pintada) fotoDemo(ctx, r.x, r.y, r.w, r.h, idx + 1 + (op.semillaFoto || 0), C);

    // velo degradado: lo que hace que el texto se lea con foto clara u oscura
    var alto = r.h * (r.h > r.w * 1.4 ? 0.50 : 0.62);
    var v = ctx.createLinearGradient(0, r.y + r.h - alto, 0, r.y + r.h);
    v.addColorStop(0, rgba(C.panel, 0));
    v.addColorStop(0.45, rgba(C.panel, 0.72));
    v.addColorStop(1, rgba(C.panel, 0.96));
    ctx.fillStyle = v;
    ctx.fillRect(r.x, r.y + r.h - alto, r.w, alto);

    var pad = G.pad, maxW = G.maxW;
    var y = r.y + r.h - pad;

    // se escribe de abajo arriba: primero el precio, luego la descripción y
    // por último el título, así ninguno se come al de abajo
    // op.textoRev(i) → 0..1: hace ENTRAR el texto (sube y aparece) en el vídeo.
    // Sin op.textoRev el texto sale fijo, exactamente como antes.
    var trev = op.textoRev ? Math.max(0, Math.min(1, op.textoRev(idx))) : 1;
    ctx.save();
    if (trev < 1) { ctx.globalAlpha = trev; ctx.translate(0, (1 - trev) * lado * 0.18); }
    if (celda.precio) {
      var tamP = G.tamPrecio;
      pildora(ctx, celda.precio, r.x + r.w - pad, y - tamP * 1.9, tamP, C.acento, C.sobreAcento, 'derecha');
      y -= tamP * 1.9 + lado * 0.03;
    }

    // descripción · si no cabe se recorta con puntos suspensivos, nunca se
    // encoge hasta ser ilegible: más vale media frase legible que dos ilegibles
    if (celda.texto && r.h > lado * 0.55) {
      var d = encajar(ctx, celda.texto, maxW, 2, forz.texto, '400', forz.texto);
      ctx.fillStyle = C.tinta2; ctx.textAlign = 'left';
      for (var i = d.lineas.length - 1; i >= 0; i--) {
        ctx.fillText(d.lineas[i], r.x + pad, y);
        y -= d.tam * 1.25;
      }
      y -= lado * 0.012;
    }

    // título del servicio
    if (celda.titulo) {
      var t = encajar(ctx, celda.titulo, maxW, 2, forz.titulo, '800', forz.titulo, FUENTE_T);
      ctx.fillStyle = C.tinta; ctx.textAlign = 'left';
      for (var j = t.lineas.length - 1; j >= 0; j--) {
        ctx.fillText(t.lineas[j], r.x + pad, y);
        y -= t.tam * 1.14;
      }
    }
    ctx.restore();

    // etiqueta de esquina
    if (celda.etiqueta) {
      var tamE = Math.max(8, lado * 0.058);
      pildora(ctx, celda.etiqueta, r.x + pad, r.y + pad * 0.85, tamE, C.acento2, C.claro ? '#1a1a1a' : '#FFFFFF');
    }

    ctx.restore();

    if (ad.filetes) {
      redondo(ctx, r.x, r.y, r.w, r.h, radio);
      ctx.strokeStyle = rgba(C.acento, 0.45);
      ctx.lineWidth = Math.max(1, lado * 0.006);
      ctx.stroke();
    }
  }

  /* ───────────────────────── Código QR ─────────────────────────
     op.qr es una <img> ya generada (por la herramienta) con el QR del
     teléfono/WhatsApp. Se dibuja como una tarjetita blanca en la esquina
     inferior derecha, con la etiqueta «Escanéame». */
  function dibujarLista(ctx, x, y, w, h, W, H, C, ad, celdas, op) {
    var gap = w * 0.05;
    var fotoW = w * 0.46;
    cuadro(ctx, { x: x, y: y, w: fotoW, h: h }, C, celdas[0] || {}, 0, ad, op, null);
    var lx = x + fotoW + gap, lw = w - fotoW - gap;
    var items = celdas.slice(1).filter(function (c) { return c && (c.titulo || c.texto || c.precio); });
    if (!items.length) return;
    var filaH = h / items.length;
    var tamT = Math.min(w * 0.033, filaH * 0.32);
    var tamP = tamT * 0.98, tamD = tamT * 0.64;
    items.forEach(function (c, i) {
      var cy = y + i * filaH, midY = cy + filaH * 0.42;
      var precio = c.precio || '';
      ctx.font = '800 ' + tamP.toFixed(1) + 'px ' + FUENTE_C;
      var pw = precio ? ctx.measureText(precio).width : 0;
      ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = C.tinta; ctx.font = '700 ' + tamT.toFixed(1) + 'px ' + FUENTE_T;
      var tit = c.titulo || '', maxTit = lw - pw - w * 0.03, cortado = false;
      while (tit && ctx.measureText(tit).width > maxTit && tit.length > 4) { tit = tit.slice(0, -1); cortado = true; }
      if (cortado) tit = tit.replace(/\s+$/, '') + '…';
      ctx.fillText(tit, lx, midY);
      var titW = ctx.measureText(tit).width;
      if (precio) {
        ctx.textAlign = 'right'; ctx.fillStyle = C.acento;
        ctx.font = '800 ' + tamP.toFixed(1) + 'px ' + FUENTE_C;
        ctx.fillText(precio, lx + lw, midY);
      }
      if (ad.filetes) {
        ctx.strokeStyle = rgba(C.tinta2, 0.4); ctx.lineWidth = Math.max(1, w * 0.0015);
        ctx.setLineDash([2, w * 0.008]);
        ctx.beginPath(); ctx.moveTo(lx + titW + w * 0.012, midY - tamT * 0.3); ctx.lineTo(lx + lw - pw - w * 0.012, midY - tamT * 0.3); ctx.stroke();
        ctx.setLineDash([]);
      }
      if (c.texto) {
        ctx.textAlign = 'left'; ctx.fillStyle = C.tinta2;
        ctx.font = '400 ' + tamD.toFixed(1) + 'px ' + FUENTE_C;
        var d = c.texto, cd = false;
        while (ctx.measureText(d).width > lw && d.length > 6) { d = d.slice(0, -1); cd = true; }
        if (cd) d = d.replace(/\s+$/, '') + '…';
        ctx.fillText(d, lx, midY + tamT * 0.9);
      }
      if (ad.filetes && i < items.length - 1) {
        ctx.strokeStyle = rgba(C.tinta2, 0.18); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(lx, cy + filaH - 1); ctx.lineTo(lx + lw, cy + filaH - 1); ctx.stroke();
      }
    });
  }

  // Medidas de la tarjetita del QR. Fuente única de la verdad: la usan
  // dibujarQR (para pintar) y pintar (para reservarle una banda limpia y que
  // NO tape las tarjetas ni la lista de precios de abajo).
  function medidasQR(W, H, M, op) {
    op = op || {};
    // QR discreto: antes ocupaba el 15% del ancho y tapaba el diseño. Al 10%
    // (tope pequeño) sigue leyéndose bien con el móvil sin comerse la hoja.
    var s = Math.max(96, Math.min(W * 0.10, H * 0.13));
    var pad = W * 0.014;
    var lbl = W * 0.024;
    var cardW = s + pad * 2;
    // Centrado horizontal: la tarjetita del QR queda simétrica en la hoja,
    // no pegada a una esquina (op.qrPos:'derecha' recupera el comportamiento viejo).
    var x = (op.qrPos === 'derecha') ? (W - M - s) : ((W - cardW) / 2 + pad);
    var yLineaPie = H - M - W * 0.052;
    var y = yLineaPie - s - lbl - pad * 2 - W * 0.014;
    return { s: s, pad: pad, lbl: lbl, x: x, y: y, top: y - pad };
  }

  function dibujarQR(ctx, W, H, C, M, op) {
    var qr = op.qr;
    if (!qr) return;
    var listo = qr.complete !== false && (qr.naturalWidth || qr.width);
    if (!listo) return;
    var q = medidasQR(W, H, M, op);
    var s = q.s, pad = q.pad, lbl = q.lbl, x = q.x, y = q.y;

    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,.35)';
    ctx.shadowBlur = W * 0.02; ctx.shadowOffsetY = W * 0.005;
    redondo(ctx, x - pad, y - pad, s + pad * 2, s + pad * 2 + lbl * 1.4, W * 0.018);
    ctx.fillStyle = '#FFFFFF'; ctx.fill();
    ctx.restore();

    ctx.drawImage(qr, x, y, s, s);
    ctx.fillStyle = '#111111';
    ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    ctx.font = '700 ' + lbl.toFixed(1) + 'px Segoe UI,Arial,sans-serif';
    ctx.fillText(op.qrTexto || 'Escanéame', x + s / 2, y + s + lbl * 1.25);
  }

  /* ───────────────────────── Pintar la hoja entera ───────────────────────── */

  function pintar(ctx, W, H, pag, op) {
    op = op || {};
    pag = pag || {};
    var C = colores(pag);
    garantizarFuentes();
    fijarFuentes(C);
    var ad = pag.adornos || {};
    ad = { grano: ad.grano !== false, vineta: ad.vineta !== false, filetes: ad.filetes !== false, sombras: ad.sombras !== false };

    var M = Math.round(W * 0.052);
    ctx.save();
    ctx.textBaseline = 'alphabetic';
    fondo(ctx, W, H, C, ad);

    var yCab = cabecera(ctx, W, H, M, C, pag, ad);
    var yPie = H - M - W * 0.075;
    // Si hay QR, la rejilla (y la lista de precios) terminan POR ENCIMA de la
    // tarjetita del QR, con un respiro, para que el QR no tape nada.
    if (op.qr) {
      var qTop = medidasQR(W, H, M, op).top;
      yPie = Math.min(yPie, qTop - W * 0.012);
    }
    var hueco = Math.round(Math.min(W, H) * 0.020);
    var rects = (pag.rejilla === 'rlista') ? [] : rejilla(pag.rejilla || 'r4a', M, yCab, W - M * 2, yPie - yCab, hueco);

    var celdas = pag.celdas || [];

    // layout especial de tarifa lateral: dibuja y termina (mantiene cabecera,
    // pie y QR igual que el resto)
    if (pag.rejilla === 'rlista') {
      dibujarLista(ctx, M, yCab, W - M * 2, yPie - yCab, W, H, C, ad, celdas, op);
      pie(ctx, W, H, M, C, pag, ad, op.nPagina);
      dibujarQR(ctx, W, H, C, M, op);
      ctx.restore();
      return rects;
    }

    // 1ª pasada: los cuadros del mismo tamaño se quedan con la letra más
    // pequeña de todos ellos, para que la hoja lleve una sola tipografía
    var grupos = {};
    var medidas = rects.map(function (r, i) {
      var m = medir(ctx, r, celdas[i]);
      var k = Math.round(r.w) + 'x' + Math.round(r.h);
      if (!grupos[k]) grupos[k] = { titulo: m.titulo, texto: m.texto };
      else {
        grupos[k].titulo = Math.min(grupos[k].titulo, m.titulo);
        grupos[k].texto = Math.min(grupos[k].texto, m.texto);
      }
      return k;
    });

    // 2ª pasada: dibujar. op.revelar(i) devuelve cómo entra ese cuadro en el
    // vídeo, sin duplicar el dibujo:
    //   a       opacidad (0..1)
    //   dx, dy  desplazamiento en píxeles (deslizar, olas)
    //   escala  1 = tamaño normal; menos, entra creciendo (mosaico)
    //   recorte 'circulo' | 'persiana', con avance en rev.p (0..1)
    rects.forEach(function (r, i) {
      var rev = op.revelar ? op.revelar(i) : null;
      if (!rev) return cuadro(ctx, r, C, celdas[i], i, ad, op, grupos[medidas[i]]);
      if (rev.a <= 0.01) return;
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, rev.a));
      if (rev.dx || rev.dy) ctx.translate(rev.dx || 0, rev.dy || 0);
      if (rev.escala && rev.escala !== 1) {
        var cx = r.x + r.w / 2, cy = r.y + r.h / 2;
        ctx.translate(cx, cy); ctx.scale(rev.escala, rev.escala); ctx.translate(-cx, -cy);
      }
      if (rev.recorte === 'circulo') {
        // el cuadro aparece desde el centro en un círculo que crece
        var rad = Math.sqrt(r.w * r.w + r.h * r.h) / 2 * Math.max(0, Math.min(1, rev.p));
        ctx.beginPath();
        ctx.arc(r.x + r.w / 2, r.y + r.h / 2, rad, 0, Math.PI * 2);
        ctx.clip();
      } else if (rev.recorte === 'persiana') {
        // seis franjas horizontales que se abren a la vez
        var n = 6, alto = r.h / n, abre = alto * Math.max(0, Math.min(1, rev.p));
        ctx.beginPath();
        for (var k = 0; k < n; k++) ctx.rect(r.x, r.y + k * alto, r.w, abre);
        ctx.clip();
      }
      cuadro(ctx, r, C, celdas[i], i, ad, op, grupos[medidas[i]]);
      ctx.restore();
    });

    pie(ctx, W, H, M, C, pag, ad, op.nPagina);
    dibujarQR(ctx, W, H, C, M, op);
    ctx.restore();
    return rects;
  }

  window.FOLLETO_MOTOR = {
    FORMATOS: FORMATOS,
    TEMAS: TEMAS,
    REJILLAS: REJILLAS,
    rejilla: rejilla,
    pintar: pintar,
    colores: colores,
    fotoDemo: fotoDemo,
    encajar: encajar,
    redondo: redondo,
    cubrir: cubrir,
    pildora: pildora,
    mezclar: mezclar,
    rgba: rgba
  };
})();

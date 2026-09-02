/* ══════════════════════════════════════════════════════════════════
   ESTUDIO UNIVERSAL · P3 · ESTUDIO DE VÍDEO (3D)
   ------------------------------------------------------------------
   Los cuadros del folleto entran de uno en uno con una animación 3D
   mientras suena la voz. Todo se monta EN EL DISPOSITIVO: sólo la
   voz de estudio sale a internet (functions/tts).

   Cómo se dibuja sin repintar la hoja 30 veces por segundo:
     · «lleno»  → la hoja entera, pintada UNA vez.
     · «base»   → la hoja con los cuadros que ya han entrado; se
                  repinta sólo al cambiar de escena.
     · cada fotograma = base + el trozo del cuadro que entra, recortado
       de «lleno» y transformado (giro, volteo, cubo…).
   Así la grabación va fluida hasta en un móvil.

   Aviso honesto que se enseña siempre: la grabación va en tiempo real
   (un vídeo de 30 s tarda 30 s) porque es cosa del navegador.
   ══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if (window._EU_VIDEO3D_LOADED) return;
  window._EU_VIDEO3D_LOADED = true;

  var V = {};
  window.EU_VIDEO = V;

  var LADO_MAX = 1280;

  /* Medidas reales de cada sitio donde se sube el vídeo. Se marcan los que
     hagan falta y sale un archivo por cada uno, con su medida y con la voz y
     la música ya dentro. */
  var SALIDAS = [
    { id: 'reel', n: 'Reels · Shorts · TikTok · Estado', f: 'vertical-9x16',   w: 720,  h: 1280, d: '9:16 vertical' },
    { id: 'feed', n: 'Facebook e Instagram · muro',      f: 'cuadrado-1x1',    w: 800,  h: 800,  d: '1:1 cuadrado' },
    { id: 'yt',   n: 'YouTube · web',                    f: 'horizontal-16x9', w: 1280, h: 720,  d: '16:9 horizontal' },
    { id: 'wa',   n: 'WhatsApp · más ligero',            f: 'whatsapp-9x16',   w: 540,  h: 960,  d: '9:16 ligero' }
  ];
  /* Medida del vídeo cuando se graba a mano (una sola pieza). «hoja» es la
     de siempre: la del folleto tal cual. */
  var RATIOS = {
    hoja: { nombre: 'Como la hoja', W: 0,   H: 0 },
    v:    { nombre: '9:16',         W: 540, H: 960 },
    q:    { nombre: '1:1',          W: 640, H: 640 },
    h:    { nombre: '16:9',         W: 854, H: 480 }
  };
  var ratio = 'hoja';
  var previa = null;       // lienzo interno para enseñar la medida elegida

  var salidas = [];        // ids marcados por Fátima
  var dimSalida = null;    // durante un lote manda la medida del sitio que toca

  /* ───────────── Catálogo de efectos ───────────── */

  var EFECTOS = {
    giroy:      { nombre: 'Giro en Y',       grupo: '3D' },
    volteox:    { nombre: 'Volteo en X',     grupo: '3D' },
    cubo:       { nombre: 'Cubo',            grupo: '3D' },
    puerta:     { nombre: 'Puerta',          grupo: '3D' },
    caida:      { nombre: 'Caída con rebote',grupo: '3D' },
    profundidad:{ nombre: 'Profundidad',     grupo: '3D' },
    orbita:     { nombre: 'Órbita',          grupo: '3D' },
    hoja:       { nombre: 'Hoja que gira',   grupo: '3D' },
    deslizar:   { nombre: 'Deslizar',        grupo: 'Plana' },
    olas:       { nombre: 'Olas',            grupo: 'Plana' },
    circulo:    { nombre: 'Círculo',         grupo: 'Plana' },
    persiana:   { nombre: 'Persiana',        grupo: 'Plana' },
    latido:     { nombre: 'Latido',          grupo: 'Plana' },
    petalo:     { nombre: 'Pétalo que abre', grupo: 'Plana' }
  };

  /* Capa de ambiente: se pinta sobre toda la escena, así que vale igual para
     los cuadros del folleto y para el cierre. */
  var ADORNOS = {
    ninguno:   'Sin ambiente',
    petalos:   'Pétalos cayendo',
    corazones: 'Corazones que suben',
    rosas:     'Rosas girando',
    brillo:    'Brillo dorado',
    chispas:   'Chispas'
  };
  var adorno = 'ninguno';

  var CAMARAS = {
    ninguna:  'Sin movimiento',
    zoomlento:'Zoom lento',
    acercar:  'Acercar',
    sacudida: 'Sacudida',
    fundido:  'Fundido'
  };

  var VOCES = ['nova', 'alloy', 'shimmer', 'echo', 'fable', 'onyx'];

  /* ───────────── Estado ───────────── */

  var esc = [];              // escenas
  var sel = 0;
  var camara = 'zoomlento';
  var ritmo = 1;
  var subtitulos = true;
  var cierreQR = true;
  var audio = { modo: 'ninguno', blob: null, segundos: 0, nombre: '' };
  /* Música de fondo: va por debajo de la voz y se mezcla dentro del archivo. */
  var musica = { blob: null, nombre: '', vol: 0.35 };
  var lleno = null, base = null, rects = [], baseK = -1;
  var corriendo = false, pararTodo = null;

  /* ───────────── Entrar ───────────── */

  V.entrar = function () {
    if (!EU.pagina) { EU.toast('Elige antes una plantilla.'); EU.ir('plantillas'); return; }
    if (!esc.length || esc._rejilla !== EU.pagina.rejilla) construirEscenas();
    panel();
    preparar();
    pintarFotograma(0);
    duracionTexto();
  };

  function construirEscenas() {
    var celdas = EU.pagina.celdas || [];
    var n = (EU.motor.REJILLAS[EU.pagina.rejilla] || EU.motor.REJILLAS.r4a).n;
    var claves = Object.keys(EFECTOS);
    esc = [{ tipo: 'portada', nombre: 'Portada', efecto: 'profundidad', seg: 2.2, frase: fraseCabecera() }];
    for (var i = 0; i < Math.min(n, celdas.length); i++) {
      esc.push({
        tipo: 'cuadro', idx: i,
        nombre: (i + 1) + ' · ' + (celdas[i].titulo || 'Cuadro'),
        efecto: claves[i % 8],
        seg: 2.5,
        frase: fraseCelda(celdas[i])
      });
    }
    esc.push({ tipo: 'cierre', nombre: 'Cierre + QR', efecto: 'profundidad', seg: 2.6, frase: fraseCierre() });
    esc._rejilla = EU.pagina.rejilla;
    sel = 0;
  }

  function fraseCabecera() {
    var c = EU.pagina.cabecera || {};
    return limpiar((c.marca || '') + '. ' + (c.titulo || ''));
  }
  function fraseCelda(c) {
    return limpiar((c.titulo || '') + '. ' + (c.texto || '') + (c.precio ? ' ' + c.precio : ''));
  }
  function fraseCierre() {
    var p = EU.pagina.pie || {};
    return limpiar((p.cta || 'Contacta con nosotros') + '. ' + (EU.contactoTexto() || ''));
  }
  /* El cerebro ya sabe quitar símbolos que la voz lee raro (€, ·, …). */
  function limpiar(t) {
    if (EU.cerebro && EU.cerebro.limpiarParaVoz) { try { return EU.cerebro.limpiarParaVoz(t); } catch (e) {} }
    return String(t || '').replace(/[·•|]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  /* ───────────── Lienzos de trabajo ───────────── */

  function medidas() {
    var F = EU.motor.FORMATOS[EU.pagina.formato] || EU.motor.FORMATOS.a4v;
    var e = LADO_MAX / Math.max(F.w, F.h);
    // par: algunos codificadores de MP4 rechazan lados impares
    return { W: Math.round(F.w * e / 2) * 2, H: Math.round(F.h * e / 2) * 2 };
  }

  /* La hoja NUNCA se deforma: se mete entera dentro de la medida del sitio y
     lo que sobra se rellena con el fondo de la propia hoja. */
  function cajaSalida(W, H) {
    var m = medidas(), ar = m.W / m.H;
    var w = W, h = Math.round(W / ar);
    if (h > H) { h = H; w = Math.round(H * ar); }
    return { x: Math.round((W - w) / 2), y: Math.round((H - h) / 2), w: w, h: h };
  }

  function fondoSalida(ctx, W, H) {
    var M = EU.motor, C = M.colores(EU.pagina);
    ctx.fillStyle = C.fondo; ctx.fillRect(0, 0, W, H);
    var g = ctx.createRadialGradient(W / 2, H * 0.25, 0, W / 2, H * 0.25, Math.max(W, H) * 0.85);
    g.addColorStop(0, M.rgba(C.acento, 0.22));
    g.addColorStop(1, M.rgba(C.acento, 0));
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  }

  /* Pasa el fotograma ya pintado (a la medida de la hoja) al lienzo que se
     graba (a la medida del sitio), centrado y sin estirar. */
  function componer(origen, cv) {
    var ctx = cv.getContext('2d');
    fondoSalida(ctx, cv.width, cv.height);
    var c = cajaSalida(cv.width, cv.height);
    ctx.drawImage(origen, 0, 0, origen.width, origen.height, c.x, c.y, c.w, c.h);
  }

  function dimRatio() {
    var R = RATIOS[ratio];
    return (!R || !R.W) ? null : { W: R.W, H: R.H };
  }

  function preparar() {
    var m = medidas();
    lleno = document.createElement('canvas');
    lleno.width = m.W; lleno.height = m.H;
    rects = EU.motor.pintar(lleno.getContext('2d'), m.W, m.H, EU.pagina, opVideo()) || [];
    base = document.createElement('canvas');
    base.width = m.W; base.height = m.H;
    baseK = -1;
  }

  function opVideo(extra) {
    var op = (window.EU_EDITOR ? EU_EDITOR.opciones(extra) : Object.assign({ nPagina: 1 }, extra || {}));
    return op;
  }

  /* base = la hoja con los cuadros 0..k-1 ya puestos. Se repinta sólo cuando
     cambia la escena, no en cada fotograma. */
  function ponerBase(k) {
    if (baseK === k) return;
    baseK = k;
    var m = medidas();
    var ctx = base.getContext('2d');
    ctx.clearRect(0, 0, m.W, m.H);
    EU.motor.pintar(ctx, m.W, m.H, EU.pagina, opVideo({
      revelar: function (i) { return (i < k) ? null : { a: 0 }; }
    }));
  }

  /* ───────────── Un fotograma ───────────── */

  function total() {
    var t = 0;
    esc.forEach(function (e) { t += e.seg; });
    return t / ritmo;
  }

  function escenaEn(t) {
    var acu = 0;
    for (var i = 0; i < esc.length; i++) {
      var d = esc[i].seg / ritmo;
      if (t < acu + d || i === esc.length - 1) return { i: i, p: Math.max(0, Math.min(1, (t - acu) / d)) };
      acu += d;
    }
    return { i: 0, p: 0 };
  }

  function pintarFotograma(t, cv) {
    cv = cv || EU.$('euVideoLienzo');
    if (!cv || !lleno) return;
    var m = medidas();
    var mostrar = (cv.id === 'euVideoLienzo');
    /* Con una medida elegida la previa la enseña de verdad: la hoja se pinta
       aparte y se compone dentro, igual que hará el archivo. */
    var dr = mostrar ? dimRatio() : null;
    if (dr) {
      if (!previa) previa = document.createElement('canvas');
      if (previa.width !== m.W || previa.height !== m.H) { previa.width = m.W; previa.height = m.H; }
      pintarFotograma(t, previa);
      var cajaR = cv.parentNode.clientWidth - 30;
      var porAltoR = Math.max(240, window.innerHeight - 300) * (dr.W / dr.H);
      var anchoR = Math.max(200, Math.min(420, cajaR, porAltoR));
      var eR = anchoR / dr.W;
      cv.width = Math.round(dr.W * eR); cv.height = Math.round(dr.H * eR);
      componer(previa, cv);
      return;
    }
    if (mostrar) {
      var caja = cv.parentNode.clientWidth - 30;
      // que quepa entero de alto: el vídeo se juzga viéndolo, no haciendo scroll
      var porAlto = Math.max(240, window.innerHeight - 300) * (m.W / m.H);
      var ancho = Math.max(200, Math.min(420, caja, porAlto));
      var e2 = ancho / m.W;
      cv.width = Math.round(m.W * e2); cv.height = Math.round(m.H * e2);
    }
    var ctx = cv.getContext('2d');
    var s = cv.width / m.W;

    var E = escenaEn(t), e = esc[E.i], p = suave(E.p);
    // Cuántos cuadros están YA puestos en la base: los de las escenas
    // anteriores. El de la escena actual es el que está entrando.
    var cuadroK = 0;
    for (var i = 0; i < E.i; i++) if (esc[i].tipo === 'cuadro') cuadroK++;
    if (e.tipo === 'cierre') cuadroK = rects.length;
    ponerBase(cuadroK);

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, cv.width, cv.height);
    ctx.scale(s, s);
    aplicarCamara(ctx, m, t, E, p);

    ctx.drawImage(base, 0, 0);

    if (e.tipo === 'cuadro' && rects[e.idx]) dibujarEfecto(ctx, rects[e.idx], e.efecto, p, t);
    pintarAdornos(ctx, m.W, m.H, t);
    if (subtitulos && e.frase) subtitulo(ctx, m, e.frase);
    ctx.restore();
  }

  function suave(p) { return p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; }

  function aplicarCamara(ctx, m, t, E, p) {
    var cx = m.W / 2, cy = m.H / 2;
    if (camara === 'zoomlento') {
      var z = 1 + 0.06 * (t / Math.max(0.1, total()));
      ctx.translate(cx, cy); ctx.scale(z, z); ctx.translate(-cx, -cy);
    } else if (camara === 'acercar') {
      var z2 = 1 + 0.045 * p;
      ctx.translate(cx, cy); ctx.scale(z2, z2); ctx.translate(-cx, -cy);
    } else if (camara === 'sacudida') {
      var a = Math.sin(t * 17) * m.W * 0.003, b = Math.cos(t * 13) * m.W * 0.003;
      ctx.translate(a, b);
    } else if (camara === 'fundido') {
      var f = Math.min(1, p / 0.18);
      ctx.globalAlpha = Math.max(0.15, f);
    }
  }

  /* El cuadro que entra: se recorta de «lleno» y se transforma. */
  function dibujarEfecto(ctx, r, efecto, p, t) {
    var cx = r.x + r.w / 2, cy = r.y + r.h / 2;
    ctx.save();

    if (efecto === 'circulo' || efecto === 'persiana') {
      ctx.beginPath();
      if (efecto === 'circulo') {
        ctx.arc(cx, cy, Math.sqrt(r.w * r.w + r.h * r.h) / 2 * p, 0, Math.PI * 2);
      } else {
        var n = 6, alto = r.h / n, abre = alto * p;
        for (var k = 0; k < n; k++) ctx.rect(r.x, r.y + k * alto, r.w, abre);
      }
      ctx.clip();
      trozo(ctx, r);
      ctx.restore();
      return;
    }

    ctx.beginPath(); ctx.rect(r.x - r.w, r.y - r.h, r.w * 3, r.h * 3); ctx.clip();

    if (efecto === 'giroy') {
      var ang = (1 - p) * Math.PI / 2;
      ctx.translate(cx, cy); ctx.scale(Math.max(0.02, Math.cos(ang)), 1); ctx.translate(-cx, -cy);
      ctx.globalAlpha = p;
    } else if (efecto === 'volteox') {
      var a2 = (1 - p) * Math.PI / 2;
      ctx.translate(cx, cy); ctx.scale(1, Math.max(0.02, Math.cos(a2))); ctx.translate(-cx, -cy);
      ctx.globalAlpha = p;
    } else if (efecto === 'cubo') {
      var a3 = (1 - p) * Math.PI / 2;
      ctx.translate(cx + Math.sin(a3) * r.w * 0.5, cy);
      ctx.scale(Math.max(0.02, Math.cos(a3)), 1);
      ctx.translate(-cx, -cy);
    } else if (efecto === 'puerta') {
      ctx.translate(r.x, cy); ctx.scale(Math.max(0.02, p), 1); ctx.translate(-r.x, -cy);
      ctx.globalAlpha = Math.min(1, p * 1.6);
    } else if (efecto === 'caida') {
      var q = rebote(p);
      ctx.translate(0, -(1 - q) * r.h * 1.25);
      ctx.translate(cx, cy); ctx.rotate((1 - q) * -0.12); ctx.translate(-cx, -cy);
    } else if (efecto === 'profundidad') {
      var z = 0.35 + 0.65 * p;
      ctx.translate(cx, cy); ctx.scale(z, z); ctx.translate(-cx, -cy);
      ctx.globalAlpha = p;
    } else if (efecto === 'orbita') {
      var z2 = 0.6 + 0.4 * p;
      ctx.translate(cx, cy); ctx.rotate((1 - p) * -0.42); ctx.scale(z2, z2); ctx.translate(-cx, -cy);
      ctx.globalAlpha = p;
    } else if (efecto === 'hoja') {
      var a4 = (1 - p) * Math.PI / 2;
      ctx.translate(cx, cy); ctx.rotate((1 - p) * 0.18); ctx.scale(Math.max(0.02, Math.cos(a4)), 1); ctx.translate(-cx, -cy);
    } else if (efecto === 'deslizar') {
      ctx.translate(-(1 - p) * (r.x + r.w), 0);
    } else if (efecto === 'olas') {
      ctx.translate(0, (1 - p) * r.h * 0.6 * Math.sin(p * Math.PI + 1));
      ctx.globalAlpha = p;
    } else if (efecto === 'latido') {
      // dos golpes por segundo, como un pulso: entra creciendo y sigue latiendo
      var ta = (typeof t === 'number' ? t : 0) * 2 % 1;
      var pul = 1 + 0.055 * Math.exp(-ta * 3.2) * Math.sin(ta * Math.PI * 2);
      var zl = (0.86 + 0.14 * p) * pul;
      ctx.translate(cx, cy); ctx.scale(zl, zl); ctx.translate(-cx, -cy);
      ctx.globalAlpha = p;
    } else if (efecto === 'petalo') {
      // se abre desde el tallo: gira y crece desde la esquina de abajo
      var pie = cy + r.h * 0.42;
      ctx.translate(cx, pie);
      ctx.rotate((1 - p) * -0.55);
      var zp = 0.25 + 0.75 * p;
      ctx.scale(zp, zp);
      ctx.translate(-cx, -pie);
      ctx.globalAlpha = p;
    }

    trozo(ctx, r);
    ctx.restore();
  }

  /* Partículas de ambiente. Todo sale de una fórmula con semilla: la misma
     escena da los mismos pétalos en el mismo sitio, así que lo que se ve en
     la previa y lo que se graba coinciden exactamente. */
  function pintarAdornos(ctx, W, H, t) {
    if (adorno === 'ninguno' || !EU.pagina) return;
    var M = EU.motor, C = M.colores(EU.pagina);
    var lado = Math.min(W, H);
    var az = function (k) { var x = Math.sin(k * 12.9898) * 43758.5453; return x - Math.floor(x); };

    if (adorno === 'brillo') {
      // un barrido diagonal que cruza la escena cada 3,4 s
      var per = 3.4, q0 = (t % per) / per;
      var anchoB = W * 0.30, bx = -anchoB + (W + anchoB * 2) * q0;
      var g = ctx.createLinearGradient(bx - anchoB, 0, bx + anchoB, H);
      g.addColorStop(0, M.rgba(C.acento, 0));
      g.addColorStop(0.5, M.rgba(C.acento, 0.28));
      g.addColorStop(1, M.rgba(C.acento, 0));
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      ctx.restore();
      return;
    }

    var n = adorno === 'chispas' ? 46 : 26;
    ctx.save();
    for (var k = 0; k < n; k++) {
      var s1 = az(k + 1), s2 = az(k + 7.3), s3 = az(k + 19.7);
      var vel = 0.16 + s2 * 0.26;
      var tam = lado * (adorno === 'chispas' ? 0.006 + s3 * 0.008 : 0.026 + s3 * 0.030);
      var px, py, gir, q;

      if (adorno === 'corazones') {
        q = (t * vel + s1) % 1;
        py = H * (1.08 - q * 1.16);
        px = W * s1 + Math.sin(t * 1.5 + k) * W * 0.035;
        gir = Math.sin(t * 1.2 + k) * 0.22;
      } else {
        q = (t * vel + s1) % 1;
        py = H * (q * 1.16 - 0.08);
        px = W * s1 + Math.sin(t * 0.9 + k * 1.7) * W * 0.06;
        gir = t * (0.5 + s2) * (s3 > 0.5 ? 1 : -1);
      }

      var fade = adorno === 'chispas' ? 0.35 + 0.45 * Math.abs(Math.sin(t * 2.4 + k)) : 0.55;
      ctx.globalAlpha = fade * (0.5 + s3 * 0.5);
      ctx.fillStyle = M.rgba(k % 3 === 0 ? C.acento2 : C.acento, 1);
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(gir);
      if (adorno === 'chispas') {
        ctx.beginPath(); ctx.arc(0, 0, tam, 0, Math.PI * 2); ctx.fill();
      } else {
        var forma = adorno === 'corazones' ? 'corazon' : (adorno === 'rosas' ? 'rosa' : 'petalo');
        if (M.caminoCelda) { M.caminoCelda(ctx, -tam / 2, -tam / 2, tam, tam, forma, 0); ctx.fill(); }
        else { ctx.beginPath(); ctx.arc(0, 0, tam / 2, 0, Math.PI * 2); ctx.fill(); }
      }
      ctx.restore();
    }
    ctx.restore();
  }

  function trozo(ctx, r) {
    ctx.drawImage(lleno, r.x, r.y, r.w, r.h, r.x, r.y, r.w, r.h);
  }

  function rebote(p) {
    if (p < 0.72) return (p / 0.72) * 1.06;
    return 1.06 - 0.06 * ((p - 0.72) / 0.28);
  }

  /* ───────────── Subtítulos ───────────── */

  function subtitulo(ctx, m, frase) {
    var t = String(frase || '').trim();
    if (!t) return;
    if (t.length > 90) t = t.slice(0, 88) + '…';
    var tam = Math.max(14, m.W * 0.032);
    ctx.save();
    ctx.font = '600 ' + tam.toFixed(1) + 'px Segoe UI,Arial,sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    var lineas = partir(ctx, t, m.W * 0.86);
    var alto = lineas.length * tam * 1.35;
    var y0 = m.H - m.H * 0.09 - alto;
    ctx.fillStyle = 'rgba(0,0,0,.52)';
    ctx.fillRect(m.W * 0.05, y0 - tam * 0.55, m.W * 0.90, alto + tam * 0.9);
    ctx.fillStyle = '#ffffff';
    lineas.forEach(function (l, i) { ctx.fillText(l, m.W / 2, y0 + tam * 0.7 + i * tam * 1.35); });
    ctx.restore();
  }
  function partir(ctx, t, ancho) {
    var pal = t.split(' '), li = [], cur = '';
    pal.forEach(function (w) {
      var pr = cur ? cur + ' ' + w : w;
      if (ctx.measureText(pr).width > ancho && cur) { li.push(cur); cur = w; }
      else cur = pr;
    });
    if (cur) li.push(cur);
    return li.slice(0, 3);
  }

  /* ───────────── Panel ───────────── */

  function panel() {
    var c = EU.$('euVideoPanel');
    if (!c) return;
    var grupos = { '3D': [], 'Plana': [] };
    Object.keys(EFECTOS).forEach(function (k) { grupos[EFECTOS[k].grupo].push(k); });

    c.innerHTML =
      '<div class="panel"><h3>Qué se anima</h3>' +
      '<p style="font-size:11px;color:var(--tx2);line-height:1.6;margin:0 0 8px">' +
      'Una escena por cuadro. Toca una y elige su efecto y su frase.</p>' +
      esc.map(function (e, i) {
        return '<div class="escena' + (i === sel ? ' sel' : '') + '" data-e="' + i + '">' +
          '<div class="cab"><b>' + EU.esc(e.nombre) + '</b>' +
          '<span>' + EU.esc(EFECTOS[e.efecto] ? EFECTOS[e.efecto].nombre : e.efecto) + ' · ' + e.seg.toFixed(1) + ' s</span></div>' +
          (i === sel ? '<textarea rows="2" data-frase="' + i + '" placeholder="lo que dice la voz en esta escena">' + EU.esc(e.frase || '') + '</textarea>' +
            '<div class="fila"><label class="lb">Dura</label><input type="range" min="1" max="8" step="0.1" value="' + e.seg + '" data-seg="' + i + '"></div>' : '') +
          '</div>';
      }).join('') +
      '<div class="ed-barra"><button class="btn btn-g btn-sm" data-guion="1">✍️ Que lo escriba el cerebro</button></div>' +
      '</div>' +

      '<div class="panel"><h3>Efecto de la escena</h3>' +
      ['3D', 'Plana'].map(function (g) {
        return '<label class="mini-lbl">' + (g === '3D' ? '3D del cuadro' : 'Entradas planas') + ' · ' + grupos[g].length + '</label>' +
          '<div class="tira">' + grupos[g].map(function (k) {
            return '<button class="pill' + (esc[sel] && esc[sel].efecto === k ? ' on' : '') + '" data-ef="' + k + '">' +
              EU.esc(EFECTOS[k].nombre) + '</button>';
          }).join('') + '</div>';
      }).join('') +
      '<label class="mini-lbl">Cámara</label><div class="tira">' +
      Object.keys(CAMARAS).map(function (k) {
        return '<button class="pill' + (camara === k ? ' on' : '') + '" data-cam="' + k + '">' + EU.esc(CAMARAS[k]) + '</button>';
      }).join('') + '</div>' +
      '<label class="mini-lbl">Ritmo</label><div class="tira">' +
      [['0.8', 'Lento'], ['1', 'Normal'], ['1.3', 'Rápido']].map(function (r) {
        return '<button class="pill' + (String(ritmo) === r[0] ? ' on' : '') + '" data-rit="' + r[0] + '">' + r[1] + '</button>';
      }).join('') + '</div>' +
      '<label class="mini-lbl">Ambiente · se pinta sobre toda la escena</label><div class="tira">' +
      Object.keys(ADORNOS).map(function (k) {
        return '<button class="pill' + (adorno === k ? ' on' : '') + '" data-ador="' + k + '">' + EU.esc(ADORNOS[k]) + '</button>';
      }).join('') + '</div>' +
      '</div>' +

      '<div class="panel"><h3>Sonido</h3>' +
      [['ninguno', 'Sin voz, sólo imagen'],
       ['vozgratis', 'Voz gratis del navegador'],
       ['grabar', 'Grabar mi voz'],
       ['subir', 'Subir música o audio'],
       ['estudio', 'Voz de estudio']].map(function (o) {
        var pro = o[0] === 'estudio';
        return '<div class="fila" style="margin:5px 0"><input type="radio" name="euSon" value="' + o[0] + '"' +
          (audio.modo === o[0] ? ' checked' : '') + ' style="width:auto"><span style="font-size:11.5px">' +
          o[1] + (pro ? '<span class="badge-pro">PRO</span>' : '') + '</span></div>';
      }).join('') +
      '<div id="euSonCtrl"></div>' +
      '<div class="st avi">Con la voz gratis: <b>altavoz, no auriculares</b>, y sitio en silencio — se capta por el micrófono. ' +
      'Y no cambies de pestaña mientras graba.</div>' +
      '</div>' +

      '<div class="panel"><h3>Música de fondo</h3>' +
      '<p style="font-size:11px;color:var(--tx2);line-height:1.6;margin:0 0 8px">Suena por debajo de la voz. '+
      'Entra dentro del archivo que descargues.</p>' +
      '<input type="file" accept="audio/*" id="euMusFile" style="font-size:11px;width:100%">' +
      (musica.blob
        ? '<div class="st ok" style="margin-top:6px">' + EU.esc(musica.nombre || 'música') + '</div>' +
          '<label class="mini-lbl">Volumen de la música · ' + Math.round(musica.vol * 100) + ' %</label>' +
          '<input type="range" min="0" max="1" step="0.05" id="euMusVol" value="' + musica.vol + '">' +
          '<button class="btn btn-g btn-sm" style="width:100%;margin-top:6px" id="euMusQuitar">Quitar la música</button>'
        : '') +
      '</div>' +

      '<div class="panel"><h3>Medida del vídeo</h3>' +
      '<p style="font-size:11px;color:var(--tx2);line-height:1.6;margin:0 0 8px">' +
      'La que sale al pulsar «Grabar el vídeo». La hoja se mete entera dentro y no se estira.</p>' +
      '<div class="tira">' +
      Object.keys(RATIOS).map(function (k) {
        return '<button class="pill' + (ratio === k ? ' on' : '') + '" data-ratio="' + k + '">' +
          EU.esc(RATIOS[k].nombre) + '</button>';
      }).join('') + '</div>' +
      '</div>' +

      '<div class="panel"><h3>Descargar listo para cada sitio</h3>' +
      '<p style="font-size:11px;color:var(--tx2);line-height:1.6;margin:0 0 8px">' +
      'Marca dónde vas a subirlo y sale un archivo por sitio, con su medida y con tu voz y la música dentro. ' +
      'Se graban en fila, uno detrás de otro.</p>' +
      '<div style="display:flex;flex-direction:column;gap:5px">' +
      SALIDAS.map(function (x) {
        var on = salidas.indexOf(x.id) >= 0;
        return '<button class="pill' + (on ? ' on' : '') + '" data-salida="' + x.id + '" ' +
          'style="width:100%;justify-content:flex-start;border-radius:9px;text-align:left">' +
          '<span style="width:16px;flex:none;text-align:center">' + (on ? '☑' : '☐') + '</span>' +
          '<span style="flex:1">' + EU.esc(x.n) + '</span>' +
          '<span style="opacity:.7;font-size:10px">' + EU.esc(x.d) + '</span></button>';
      }).join('') +
      '</div>' +
      '<button class="btn" id="euBtnLote" style="width:100%;margin-top:10px">' +
      '⬇ Descargar todo lo marcado · ' + salidas.length + '</button>' +
      '</div>' +

      '<div class="panel"><h3>Marca en el vídeo</h3>' +
      '<div class="fila"><input type="checkbox" id="euSubs"' + (subtitulos ? ' checked' : '') + ' style="width:auto">' +
      '<span style="font-size:11.5px">Subtítulos de la narración</span></div>' +
      '<div class="fila"><input type="checkbox" id="euCierreQR"' + (cierreQR ? ' checked' : '') + ' style="width:auto">' +
      '<span style="font-size:11.5px">Cierre con el QR grande</span></div>' +
      '<p style="font-size:11px;color:var(--tx2);line-height:1.6;margin:8px 0 0">' +
      (EU_PLAN.llevaMarcaAgua()
        ? 'Con el plan Free el vídeo lleva marca de agua y dura como mucho ' + EU_PLAN.topeVideo() + ' s.'
        : 'Plan Pro: sin marca de agua, hasta ' + EU_PLAN.topeVideo() + ' s.') + '</p>' +
      '</div>';

    cablearPanel(c);
    controlesSonido();
  }

  function cablearPanel(c) {
    c.querySelectorAll('[data-e]').forEach(function (d) {
      d.onclick = function (ev) {
        if (ev.target.tagName === 'TEXTAREA' || ev.target.tagName === 'INPUT') return;
        sel = parseInt(d.getAttribute('data-e'), 10);
        panel(); pintarEnSel();
      };
    });
    c.querySelectorAll('[data-frase]').forEach(function (t) {
      t.oninput = function () { esc[parseInt(t.getAttribute('data-frase'), 10)].frase = t.value; };
    });
    c.querySelectorAll('[data-seg]').forEach(function (r) {
      r.oninput = function () {
        esc[parseInt(r.getAttribute('data-seg'), 10)].seg = parseFloat(r.value);
        duracionTexto();
      };
      r.onchange = function () { panel(); };
    });
    c.querySelectorAll('[data-ef]').forEach(function (b) {
      b.onclick = function () {
        if (!esc[sel]) return;
        esc[sel].efecto = b.getAttribute('data-ef');
        panel(); pintarEnSel();
      };
    });
    c.querySelectorAll('[data-cam]').forEach(function (b) {
      b.onclick = function () { camara = b.getAttribute('data-cam'); panel(); pintarEnSel(); };
    });
    c.querySelectorAll('[data-rit]').forEach(function (b) {
      b.onclick = function () { ritmo = parseFloat(b.getAttribute('data-rit')); panel(); duracionTexto(); };
    });
    c.querySelectorAll('[data-ador]').forEach(function (b) {
      b.onclick = function () { adorno = b.getAttribute('data-ador'); panel(); pintarEnSel(); };
    });
    var g = c.querySelector('[data-guion]');
    if (g) g.onclick = guionCerebro;
    c.querySelectorAll('input[name=euSon]').forEach(function (r) {
      r.onchange = function () {
        if (r.value === 'estudio' && !EU_PLAN.puede('vozEstudio')) {
          EU_PLAN.muro('vozEstudio');
          r.checked = false;
          audio.modo = 'ninguno';
          panel();
          return;
        }
        audio.modo = r.value;
        controlesSonido();
      };
    });
    var mf = EU.$('euMusFile');
    if (mf) mf.onchange = function (e) {
      var f = e.target.files && e.target.files[0];
      if (!f) return;
      musica.blob = f; musica.nombre = f.name;
      panel();
    };
    var mv = EU.$('euMusVol');
    if (mv) mv.oninput = function () { musica.vol = parseFloat(mv.value); };
    var mq = EU.$('euMusQuitar');
    if (mq) mq.onclick = function () { musica.blob = null; musica.nombre = ''; panel(); };
    c.querySelectorAll('[data-ratio]').forEach(function (b) {
      b.onclick = function () { ratio = b.getAttribute('data-ratio'); panel(); pintarEnSel(); };
    });
    c.querySelectorAll('[data-salida]').forEach(function (b) {
      b.onclick = function () {
        var id = b.getAttribute('data-salida'), k = salidas.indexOf(id);
        if (k >= 0) salidas.splice(k, 1); else salidas.push(id);
        panel();
      };
    });
    var lote = EU.$('euBtnLote');
    if (lote) lote.onclick = function () { V.exportarLote(); };
    var s = EU.$('euSubs'); if (s) s.onchange = function () { subtitulos = s.checked; pintarEnSel(); };
    var q = EU.$('euCierreQR'); if (q) q.onchange = function () { cierreQR = q.checked; };
  }

  function pintarEnSel() {
    var t = 0;
    for (var i = 0; i < sel; i++) t += esc[i].seg / ritmo;
    pintarFotograma(t + (esc[sel] ? esc[sel].seg / ritmo * 0.75 : 0));
  }

  function duracionTexto() {
    var e = EU.$('euVideoDur');
    if (!e) return;
    var t = total(), tope = EU_PLAN.topeVideo();
    e.innerHTML = t.toFixed(1) + ' s' + (t > tope ? ' <b style="color:var(--warn)">· tope ' + tope + ' s</b>' : '');
  }

  function guionCerebro() {
    esc.forEach(function (e) {
      if (e.tipo === 'portada') e.frase = fraseCabecera();
      else if (e.tipo === 'cierre') e.frase = fraseCierre();
      else e.frase = fraseCelda(EU.pagina.celdas[e.idx] || {});
    });
    panel();
    EU.toast('Guion escrito con los textos de tu folleto.');
  }

  /* ───────────── Sonido ───────────── */

  function controlesSonido() {
    var c = EU.$('euSonCtrl');
    if (!c) return;
    if (audio.modo === 'ninguno') { c.innerHTML = ''; return; }
    if (audio.modo === 'subir') {
      c.innerHTML = '<input type="file" accept="audio/*" id="euAudioFile" style="font-size:11px;margin-top:6px">';
      EU.$('euAudioFile').onchange = function (e) {
        var f = e.target.files && e.target.files[0];
        if (!f) return;
        audio.blob = f; audio.nombre = f.name;
        medirAudio(f);
      };
    } else if (audio.modo === 'grabar') {
      c.innerHTML = '<button class="btn btn-g btn-sm" style="margin-top:6px;width:100%" id="euGrabarVoz">🎙️ Grabar mi voz</button>';
      EU.$('euGrabarVoz').onclick = grabarVoz;
    } else if (audio.modo === 'vozgratis') {
      c.innerHTML = '<button class="btn btn-g btn-sm" style="margin-top:6px;width:100%" id="euVozGratis">🎙️ Preparar la voz gratis</button>';
      EU.$('euVozGratis').onclick = vozGratis;
    } else if (audio.modo === 'estudio') {
      c.innerHTML = '<label class="mini-lbl">Voz</label><select id="euVozSel">' +
        VOCES.map(function (v) { return '<option value="' + v + '">' + v + '</option>'; }).join('') + '</select>' +
        '<button class="btn btn-g btn-sm" style="margin-top:6px;width:100%" id="euVozEstudio">🎧 Preparar la voz de estudio</button>';
      EU.$('euVozEstudio').onclick = vozEstudio;
    }
    if (audio.blob) {
      c.insertAdjacentHTML('beforeend',
        '<div class="st ok">Audio listo: ' + EU.esc(audio.nombre || 'voz') +
        (audio.segundos ? ' · ' + audio.segundos.toFixed(1) + ' s' : '') + '</div>');
    }
  }

  function guion() {
    return esc.map(function (e) { return e.frase; }).filter(Boolean).join(' ');
  }

  function medirAudio(blob) {
    var a = new Audio();
    a.onloadedmetadata = function () {
      audio.segundos = isFinite(a.duration) ? a.duration : 0;
      if (audio.segundos > 0) ajustarADuracion(audio.segundos);
      controlesSonido(); panel();
    };
    a.onerror = function () { controlesSonido(); };
    a.src = URL.createObjectURL(blob);
  }

  /* «Cada escena dura lo que su frase»: el tiempo del audio se reparte entre
     las escenas en proporción a lo larga que es su frase. */
  function ajustarADuracion(seg) {
    var pesos = esc.map(function (e) { return Math.max(8, (e.frase || '').length); });
    var suma = pesos.reduce(function (a, b) { return a + b; }, 0);
    esc.forEach(function (e, i) { e.seg = Math.max(1, seg * pesos[i] / suma); });
    ritmo = 1;
    duracionTexto();
  }

  function vozGratis() {
    var t = guion();
    if (!t) { EU.estado('euVideoEstado', 'Escribe antes el guion de las escenas.', 'avi'); return; }
    if (!window.B6_VOZ_GRATIS || !B6_VOZ_GRATIS.disponible()) {
      EU.estado('euVideoEstado', 'Este navegador no puede captar la voz gratis. Prueba en Chrome, o graba tu voz.', 'err');
      return;
    }
    EU.estado('euVideoEstado', 'Preparando la voz… pon el <b>altavoz</b> y no cambies de pestaña.', 'proc');
    B6_VOZ_GRATIS.capturar({
      texto: t, vel: 1, tono: 1,
      aviso: function (m) { EU.estado('euVideoEstado', EU.esc(m), 'proc'); }
    }).then(function (r) {
      audio.blob = r.blob; audio.nombre = 'voz gratis'; audio.segundos = r.segundos;
      ajustarADuracion(r.segundos);
      EU.estado('euVideoEstado', 'Voz lista (' + r.segundos.toFixed(1) + ' s). Ya puedes grabar el vídeo.', 'ok');
      controlesSonido(); panel();
    }).catch(function (e) {
      EU.estado('euVideoEstado', EU.esc(e.message || e), 'err');
    });
  }

  function grabarVoz() {
    if (!navigator.mediaDevices || !window.MediaRecorder) {
      EU.estado('euVideoEstado', 'Este navegador no deja grabar audio.', 'err'); return;
    }
    var btn = EU.$('euGrabarVoz');
    if (btn._rec) { btn._rec.stop(); return; }
    navigator.mediaDevices.getUserMedia({ audio: true }).then(function (st) {
      var trozos = [], rec = new MediaRecorder(st);
      btn._rec = rec;
      btn.textContent = '■ Parar de grabar';
      rec.ondataavailable = function (e) { if (e.data && e.data.size) trozos.push(e.data); };
      rec.onstop = function () {
        st.getTracks().forEach(function (t) { t.stop(); });
        btn._rec = null; btn.textContent = '🎙️ Grabar mi voz';
        var b = new Blob(trozos, { type: rec.mimeType || 'audio/webm' });
        audio.blob = b; audio.nombre = 'mi voz';
        medirAudio(b);
      };
      rec.start();
      EU.estado('euVideoEstado', 'Grabando tu voz… vuelve a pulsar para parar.', 'proc');
    }).catch(function (e) {
      EU.estado('euVideoEstado', 'No se pudo abrir el micrófono: ' + EU.esc(e.message || e), 'err');
    });
  }

  function vozEstudio() {
    if (!EU_PLAN.puede('vozEstudio')) { EU_PLAN.muro('vozEstudio'); return; }
    var t = guion();
    if (!t) { EU.estado('euVideoEstado', 'Escribe antes el guion de las escenas.', 'avi'); return; }
    EU.estado('euVideoEstado', 'Pidiendo la voz de estudio…', 'proc');
    fetch('/.netlify/functions/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: t.slice(0, 4000), voice: (EU.$('euVozSel') || {}).value || 'nova', speed: 1 })
    }).then(function (r) {
      if (!r.ok) return r.text().then(function (x) { throw new Error(x); });
      return r.blob();
    }).then(function (b) {
      audio.blob = b; audio.nombre = 'voz de estudio';
      medirAudio(b);
      EU.estado('euVideoEstado', 'Voz de estudio lista.', 'ok');
    }).catch(function (e) {
      EU.estado('euVideoEstado', 'No se pudo generar la voz de estudio: ' + EU.esc(String(e.message || e).slice(0, 300)), 'err');
    });
  }

  /* ───────────── Vista previa ───────────── */

  V.previa = function () {
    if (corriendo) { if (pararTodo) pararTodo(); return; }
    preparar();
    correr(null, function () {});
  };

  function correr(alFotograma, alAcabar) {
    corriendo = true;
    var t0 = performance.now(), dur = total() * 1000, cancelado = false;
    pararTodo = function () { cancelado = true; };
    (function paso() {
      if (cancelado) { corriendo = false; pararTodo = null; alAcabar(); return; }
      var t = (performance.now() - t0) / 1000;
      if (t >= total()) {
        pintarFotograma(total() - 0.001);
        corriendo = false; pararTodo = null;
        alAcabar();
        return;
      }
      pintarFotograma(t);
      if (alFotograma) alFotograma(t);
      requestAnimationFrame(paso);
    })();
    return dur;
  }

  /* ───────────── Grabar ───────────── */

  V.grabar = function (opts) {
    opts = opts || {};
    var fallar = function (msg) {
      dimSalida = null;
      EU.estado('euVideoEstado', msg, 'err');
      if (opts.alFallar) opts.alFallar();
    };
    if (corriendo) { if (pararTodo) pararTodo(); return; }
    if (!EU_PLAN.exigeSesion()) { if (opts.alFallar) opts.alFallar(); return; }

    var tope = EU_PLAN.topeVideo();
    if (total() > tope) {
      EU_PLAN.muro('video', 'Tu vídeo dura ' + total().toFixed(1) + ' s. Acorta las escenas o pasa a Pro.');
      if (opts.alFallar) opts.alFallar();
      return;
    }
    if (!window.MediaRecorder || !document.createElement('canvas').captureStream) {
      fallar('Este navegador no sabe grabar vídeo. Prueba en Chrome.');
      return;
    }

    preparar();
    var m = medidas();
    /* Sin lote se graba tal cual, a la medida de la hoja. Con lote el lienzo
       que se graba lleva la medida del sitio y la hoja se compone dentro. */
    var out = dimSalida || dimRatio() || m;
    var cv = document.createElement('canvas');
    cv.width = out.W; cv.height = out.H;
    var interno = (out !== m) ? document.createElement('canvas') : null;
    if (interno) { interno.width = m.W; interno.height = m.H; }

    /* El primer fotograma tiene que estar YA pintado: hay navegadores que fijan
       la medida del vídeo con lo que encuentran en el lienzo al arrancar. */
    if (interno) { pintarFotograma(0, interno); componer(interno, cv); }
    else pintarFotograma(0, cv);

    var flujo = new MediaStream();
    cv.captureStream(30).getVideoTracks().forEach(function (t) { flujo.addTrack(t); });

    var ac = null, fuente = null;
    var seguir = function () { arranca(); };

    /* La voz y la música se mezclan en un mismo destino, cada una con su
       ganancia: la música por debajo para que la palabra se entienda. Si sólo
       hay una de las dos, suena esa. */
    var fuenteMus = null;
    if (audio.blob || musica.blob) {
      ac = new (window.AudioContext || window.webkitAudioContext)();
      var dest = ac.createMediaStreamDestination();
      var leer = function (blob) {
        return blob.arrayBuffer().then(function (ab) { return ac.decodeAudioData(ab); });
      };
      var pistas = [];
      if (audio.blob) pistas.push(leer(audio.blob).then(function (buf) {
        var g = ac.createGain(); g.gain.value = 1;
        fuente = ac.createBufferSource(); fuente.buffer = buf;
        fuente.connect(g); g.connect(dest); g.connect(ac.destination);
      }));
      if (musica.blob) pistas.push(leer(musica.blob).then(function (buf) {
        var g = ac.createGain(); g.gain.value = musica.vol;
        fuenteMus = ac.createBufferSource(); fuenteMus.buffer = buf;
        fuenteMus.loop = true;                 // la música se repite hasta el final
        fuenteMus.connect(g); g.connect(dest); g.connect(ac.destination);
      }));
      Promise.all(pistas).then(function () {
        dest.stream.getAudioTracks().forEach(function (t) { flujo.addTrack(t); });
        seguir();
      }).catch(function () {
        EU.estado('euVideoEstado', 'No se pudo leer el audio: el vídeo saldrá sin sonido.', 'avi');
        seguir();
      });
    } else { seguir(); }

    function arranca() {
      var tipo = '';
      /* Con sonido hay que exigir un formato que nombre su códec de audio: hay
         navegadores que dicen sí al mp4 genérico y luego entregan el vídeo mudo. */
      var hayAudio = !!(audio.blob || musica.blob);
      (hayAudio
        ? ['video/mp4;codecs=avc1.42E01E,mp4a.40.2', 'video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm']
        : ['video/mp4;codecs=avc1', 'video/mp4', 'video/webm;codecs=vp9', 'video/webm']
      ).some(function (x) {
        if (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(x)) { tipo = x; return true; }
        return false;
      });
      var rec;
      try { rec = new MediaRecorder(flujo, tipo ? { mimeType: tipo, videoBitsPerSecond: 4500000 } : undefined); }
      catch (e) { fallar('No se pudo iniciar la grabación: ' + EU.esc(e.message || e)); return; }

      var trozos = [];
      rec.ondataavailable = function (e) { if (e.data && e.data.size) trozos.push(e.data); };
      rec.onstop = function () {
        try { if (fuente) fuente.stop(); } catch (e) {}
        try { if (fuenteMus) fuenteMus.stop(); } catch (e) {}
        try { if (ac) ac.close(); } catch (e) {}
        var mp4 = /mp4/.test(rec.mimeType || tipo || '');
        var b = new Blob(trozos, { type: mp4 ? 'video/mp4' : 'video/webm' });
        var nom = opts.nombre || EU_EDITOR.limpio(EU.marca.nombre || 'video');
        EU_EDITOR.bajar(b, nom + (mp4 ? '.mp4' : '.webm'));
        if (!opts.alTerminar) {
          EU.estado('euVideoEstado',
            'Vídeo descargado' + (mp4 ? '.' : ' en formato WebM: este navegador no sabe hacer MP4. Se ve en el ordenador y en Android; para iPhone conviértelo.') +
            ' Pesa ' + Math.round(b.size / 1024) + ' KB.', mp4 ? 'ok' : 'avi');
        }
        EU.$('euBtnGrabar').textContent = '⏺ Grabar el vídeo';
        if (cancelado && opts.alFallar) opts.alFallar();
        else if (opts.alTerminar) opts.alTerminar();
      };

      EU.$('euBtnGrabar').textContent = '■ Parar';
      EU.estado('euVideoEstado', opts.aviso ||
        ('Grabando… tarda lo mismo que dura el vídeo (' + total().toFixed(1) + ' s). ' +
         '<b>No cambies de pestaña</b>.'), 'proc');

      rec.start();
      if (fuente) { try { fuente.start(); } catch (e) {} }
      if (fuenteMus) { try { fuenteMus.start(); } catch (e) {} }

      var ctxOff = cv.getContext('2d');
      var t0 = performance.now(), cancelado = false;
      corriendo = true;
      pararTodo = function () { cancelado = true; };

      var salida = function (t) {
        if (interno) { pintarFotograma(t, interno); componer(interno, cv); }
        else pintarFotograma(t, cv);
        EU_PLAN.marcaAgua(ctxOff, out.W, out.H);
      };

      (function paso() {
        var t = (performance.now() - t0) / 1000;
        if (cancelado || t >= total()) {
          salida(Math.min(t, total() - 0.001));
          corriendo = false; pararTodo = null;
          setTimeout(function () { try { rec.stop(); } catch (e) {} }, 120);
          return;
        }
        salida(t);
        pintarFotograma(t);           // espejo en pantalla, para verlo salir
        requestAnimationFrame(paso);
      })();
    }
  };

  /* Descarga en fila un archivo por cada sitio marcado, cada uno con su
     medida propia y el sonido ya dentro. */
  V.exportarLote = function () {
    if (corriendo) { EU.estado('euVideoEstado', 'Espera a que termine la grabación que está en marcha.', 'avi'); return; }
    var defs = salidas.map(function (id) {
      return SALIDAS.filter(function (x) { return x.id === id; })[0];
    }).filter(Boolean);
    if (!defs.length) {
      EU.estado('euVideoEstado', 'Marca al menos un sitio donde vas a subirlo.', 'avi');
      return;
    }
    var limpiar = function () {
      dimSalida = null;
      try { preparar(); pintarEnSel(); } catch (e) {}
    };
    var paso = function (k) {
      if (k >= defs.length) {
        limpiar();
        EU.estado('euVideoEstado',
          defs.length + (defs.length === 1 ? ' vídeo descargado' : ' vídeos descargados') +
          ', cada uno con su medida y con tu voz y la música dentro.', 'ok');
        return;
      }
      var d = defs[k];
      dimSalida = { W: d.w, H: d.h };
      V.grabar({
        nombre: EU_EDITOR.limpio(EU.marca.nombre || 'video') + '-' + d.f,
        aviso: 'Grabando ' + EU.esc(d.d) + ' (' + (k + 1) + ' de ' + defs.length + '). <b>No cambies de pestaña</b>.',
        alTerminar: function () { setTimeout(function () { paso(k + 1); }, 1000); },
        // si un sitio no se puede grabar, se corta el lote y el estudio vuelve
        // a su medida normal, no se queda clavado en la del lote
        alFallar: limpiar
      });
    };
    paso(0);
  };

  window.addEventListener('resize', function () { if (EU.pantalla === 'video' && !corriendo) pintarEnSel(); });
  window.addEventListener('pagehide', function () { if (pararTodo) pararTodo(); });
})();

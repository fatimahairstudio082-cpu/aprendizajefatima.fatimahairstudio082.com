/* ═════════════════════════════════════════════════════════════════
   ESTUDIOS DE BELLEZA · el maniquí reutilizado (Bloque 6)
   ─────────────────────────────────────────────────────────────────
   La misma cabeza que sirve para el corte sirve para lo demás. Aquí
   se dibuja en tres disciplinas, y cada una se ANIMA como se hace
   de verdad en el gabinete:

     · Colorimetría — la mecha se pinta desde la raíz hacia las puntas,
       mechón a mechón, y después corre el tiempo de exposición.
     · Cejas — primero el mapeo de tres líneas desde el ala de la nariz,
       luego el contorno y por último el pelo, en su dirección.
     · Pestañas — la línea de implantación se divide en cinco zonas y
       cada extensión se coloca una a una, con su curvatura y sus mm.

   Todo es lienzo 2D: se ve igual en cualquier móvil, se graba en vídeo
   y se descarga en PNG, JPG, WEBP y PDF.
   ═════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  function el(t, s, txt) {
    var n = document.createElement(t);
    if (s) n.setAttribute('style', s);
    if (txt != null) n.textContent = txt;
    return n;
  }

  var S = {
    caja: 'background:#141430;border:1px solid #2d2d4a;border-radius:12px;padding:12px 14px',
    rot: 'font-size:10px;color:#7c7c9e;letter-spacing:.08em;text-transform:uppercase;font-weight:700;display:block;margin-bottom:6px',
    bt: 'border-radius:9px;padding:9px 14px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit',
    chipOn: 'background:#231a4a;border:1px solid #a855f7;color:#e9d5ff;border-radius:8px;padding:6px 10px;font-size:11px;cursor:pointer;font-family:inherit',
    chipOff: 'background:#1a1a35;border:1px solid #2d2d4a;color:#6b5c40;border-radius:8px;padding:6px 10px;font-size:11px;cursor:pointer;font-family:inherit',
    inp: 'background:#13132a;border:1px solid #2d2d4a;color:#e2e8f0;border-radius:8px;padding:8px 10px;font-size:12px;width:100%;font-family:inherit'
  };

  /* ── tonos de colorimetría, en la escala de siempre ── */
  var TONOS = [
    { n: '1.0 Negro', c: '#1B1614' }, { n: '3.0 Castaño oscuro', c: '#3A2419' },
    { n: '4.0 Castaño', c: '#4E3122' }, { n: '5.35 Chocolate', c: '#5E3A24' },
    { n: '6.0 Rubio oscuro', c: '#7A5230' }, { n: '7.34 Cobre dorado', c: '#9A6330' },
    { n: '8.0 Rubio claro', c: '#B98B4E' }, { n: '9.31 Beige', c: '#D3B183' },
    { n: '10.1 Platino', c: '#E7DCC6' }, { n: '0.66 Rojo', c: '#8E2F26' },
    { n: 'Malva', c: '#7A5C7E' }, { n: 'Azul noche', c: '#2E3B63' }
  ];

  var TECNICAS = [
    { id: 'raiz', n: 'Retoque de raíz', d: 'Solo el crecimiento: 2 cm desde el cuero cabelludo.' },
    { id: 'global', n: 'Color global', d: 'Raíz, medios y puntas del mismo tono.' },
    { id: 'balayage', n: 'Balayage', d: 'Raíz intacta, aclarado barrido de medios a puntas.' },
    { id: 'babylights', n: 'Babylights', d: 'Mechas muy finas desde la raíz, efecto sol.' },
    { id: 'sombre', n: 'Sombré', d: 'Raíz fundida en degradado suave hacia las puntas.' }
  ];

  var FORMAS_CEJA = [
    { id: 'arqueada', n: 'Arqueada' }, { id: 'recta', n: 'Recta' },
    { id: 'curva', n: 'Curvada' }, { id: 'ascendente', n: 'Ascendente' }
  ];

  var EFECTOS = [
    { id: 'abierto', n: 'Ojo abierto', mm: [9, 11, 13, 12, 10] },
    { id: 'gatuno', n: 'Gatuno', mm: [8, 9, 11, 13, 14] },
    { id: 'muneca', n: 'Muñeca', mm: [10, 12, 14, 12, 10] },
    { id: 'natural', n: 'Natural', mm: [8, 9, 10, 10, 9] }
  ];

  var CURVAS = [
    { id: 'C', n: 'Curva C', k: 0.55 },
    { id: 'CC', n: 'Curva CC', k: 0.78 },
    { id: 'D', n: 'Curva D', k: 1.0 },
    { id: 'B', n: 'Curva B', k: 0.35 }
  ];

  var DISCIPLINAS = [
    { id: 'color', n: '🎨 Colorimetría' },
    { id: 'cejas', n: '🪶 Cejas' },
    { id: 'pestanas', n: '👁 Pestañas' }
  ];

  /* Las familias las manda el Cerebro: colorimetría, mechas, hidratación,
     queratina, químicos, técnicas de cabello, cejas, pestañas y maquillaje.
     Si el Cerebro no estuviera cargado, quedan las tres de siempre. */
  function familias() {
    if (window.EU_CEREBRO) return EU_CEREBRO.familias();
    return DISCIPLINAS.map(function (d) {
      return { id: d.id, n: d.n.replace(/^\S+\s/, ''), ico: '', lienzo: d.id };
    });
  }

  /* Cómo se pinta el pelo en cada técnica. El resto del catálogo cae en
     'global' (producto de raíz a puntas), que es lo que hacen la hidratación,
     la queratina, el planchado y los químicos. */
  var MODOS = {
    color_raiz: 'raiz', color_global: 'global', color_balayage: 'balayage',
    color_babylights: 'babylights', color_sombre: 'sombre',
    mechas_aluminio: 'babylights', mechas_gorro: 'babylights',
    quim_decoloracion: 'global', quera_alisado: 'global', cab_planchado: 'global'
  };

  var MEDIDAS = [
    { id: 'hoja', n: 'Como la lámina' },
    { id: 'v', n: '9:16', w: 720, h: 1280 },
    { id: 'q', n: '1:1', w: 900, h: 900 },
    { id: 'h', n: '16:9', w: 1280, h: 720 }
  ];

  /* ─────────────────────────── utilidades de dibujo ─────────────────────────── */

  function lerp(a, b, t) { return a + (b - a) * t; }
  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
  function ease(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }

  /* Punto de una curva cuadrática, para recorrer un mechón o una pestaña. */
  function qp(p0, p1, p2, t) {
    var u = 1 - t;
    return { x: u * u * p0.x + 2 * u * t * p1.x + t * t * p2.x, y: u * u * p0.y + 2 * u * t * p1.y + t * t * p2.y };
  }

  function mezcla(a, b, t) {
    var pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
    var r = Math.round(lerp((pa >> 16) & 255, (pb >> 16) & 255, t));
    var g = Math.round(lerp((pa >> 8) & 255, (pb >> 8) & 255, t));
    var z = Math.round(lerp(pa & 255, pb & 255, t));
    return 'rgb(' + r + ',' + g + ',' + z + ')';
  }

  function textoCentrado(x, txt, cx, cy, font, color) {
    x.save();
    x.font = font; x.fillStyle = color;
    x.textAlign = 'center'; x.textBaseline = 'middle';
    x.fillText(txt, cx, cy);
    x.restore();
  }

  /* Rótulo con guía: un punto, una línea fina y el texto. Es lo que convierte
     un dibujo bonito en una lámina que se puede estudiar. */
  function guia(x, px, py, tx, ty, txt, color, alfa) {
    if (alfa <= 0) return;
    x.save();
    x.globalAlpha = clamp(alfa, 0, 1);
    x.strokeStyle = color; x.lineWidth = 1.1;
    x.setLineDash([4, 4]);
    x.beginPath(); x.moveTo(px, py); x.lineTo(tx, ty); x.stroke();
    x.setLineDash([]);
    x.beginPath(); x.arc(px, py, 3.4, 0, Math.PI * 2); x.fillStyle = color; x.fill();
    x.font = '600 13px Segoe UI,Arial,sans-serif';
    x.textAlign = tx < px ? 'right' : 'left';
    x.textBaseline = 'middle';
    x.fillStyle = '#2a2318';
    x.fillText(txt, tx + (tx < px ? -7 : 7), ty);
    x.restore();
  }

  function banda(x, W, H, txt) {
    if (!txt) return;
    var pad = 26, fs = 19;
    x.save();
    x.font = '600 ' + fs + 'px Segoe UI,Arial,sans-serif';
    x.textAlign = 'center'; x.textBaseline = 'middle';
    var max = W - pad * 2, pal = String(txt).split(/\s+/), ls = [], ln = '';
    pal.forEach(function (p) {
      var t = ln ? ln + ' ' + p : p;
      if (x.measureText(t).width > max && ln) { ls.push(ln); ln = p; } else ln = t;
    });
    if (ln) ls.push(ln);
    var lh = fs * 1.35, alto = ls.length * lh + pad * 0.7, y0 = H - alto - 22;
    var g = x.createLinearGradient(0, y0 - 18, 0, H);
    g.addColorStop(0, 'rgba(250,244,232,0)'); g.addColorStop(0.4, 'rgba(250,244,232,.92)'); g.addColorStop(1, 'rgba(247,239,223,.98)');
    x.fillStyle = g; x.fillRect(0, y0 - 18, W, H - y0 + 18);
    x.strokeStyle = 'rgba(176,135,60,.45)'; x.lineWidth = 1;
    x.beginPath(); x.moveTo(0, y0 - 10.5); x.lineTo(W, y0 - 10.5); x.stroke();
    x.fillStyle = '#2a2318';
    ls.forEach(function (l, k) { x.fillText(l, W / 2, y0 + pad * 0.35 + lh * (k + 0.5)); });
    x.restore();
  }

  function tarjeta(x, px, py, w, h, titulo) {
    x.save();
    x.fillStyle = 'rgba(255,250,240,.92)';
    x.strokeStyle = 'rgba(176,135,60,.45)'; x.lineWidth = 1.2;
    var r = 12;
    x.beginPath();
    x.moveTo(px + r, py); x.arcTo(px + w, py, px + w, py + h, r);
    x.arcTo(px + w, py + h, px, py + h, r); x.arcTo(px, py + h, px, py, r);
    x.arcTo(px, py, px + w, py, r); x.closePath();
    x.fill(); x.stroke();
    if (titulo) {
      x.font = '700 11px Segoe UI,Arial,sans-serif';
      x.fillStyle = '#a8791f';
      x.textAlign = 'left'; x.textBaseline = 'alphabetic';
      x.fillText(titulo.toUpperCase(), px + 14, py + 22);
    }
    x.restore();
  }

  /* ─────────────────────────── la cabeza ───────────────────────────
     La misma silueta del maniquí de corte: cráneo, cara, cuello y hombros.
     Se dibuja una vez y la usan las tres disciplinas.                */

  var CLAVE_FICHA = 'eu_ficha_v1';

  /* Ficha técnica profesional. Cada campo declara su bloque, su rótulo y, si
     es de lista, las opciones: así el panel y la lámina leen del mismo sitio y
     no se pueden desincronizar. */
  var CAMPOS_FICHA = [
    /* Comunes a las cuatro disciplinas. */
    { k: 'alumna', r: 'Alumna', b: 'Identificación', ph: 'Ej.: María Pérez' },
    { k: 'negocio', r: 'Negocio', b: 'Identificación', ph: 'Ej.: Fátima Hair Studio' },
    { k: 'cliente', r: 'Clienta', b: 'Identificación', ph: 'Nombre o referencia' },
    { k: 'fecha', r: 'Fecha', b: 'Identificación', ph: 'dd/mm/aaaa' },

    /* Colorimetría. */
    { k: 'base', r: 'Base natural', b: 'Diagnóstico', d: ['color'], ph: 'Ej.: 5.0 Castaño claro' },
    { k: 'canas', r: 'Canas', b: 'Diagnóstico', d: ['color'], op: ['', 'Sin canas', '25 %', '50 %', '75 %', '100 %'] },
    { k: 'porosidad', r: 'Porosidad', b: 'Diagnóstico', d: ['color'], op: ['', 'Baja', 'Media', 'Alta'] },
    { k: 'textura', r: 'Textura', b: 'Diagnóstico', d: ['color'], op: ['', 'Fino', 'Medio', 'Grueso'] },
    { k: 'estado', r: 'Estado', b: 'Diagnóstico', d: ['color'], op: ['', 'Virgen', 'Teñido', 'Decolorado', 'Dañado'] },
    { k: 'formula', r: 'Fórmula', b: 'Fórmula', d: ['color'], ph: 'Ej.: 7.34 + 9.31', alto: true },
    { k: 'oxidante', r: 'Oxidante', b: 'Fórmula', d: ['color'], op: ['', '10 vol · 3 %', '20 vol · 6 %', '30 vol · 9 %', '40 vol · 12 %'] },
    { k: 'proporcion', r: 'Proporción', b: 'Fórmula', d: ['color'], op: ['', '1:1', '1:1,5', '1:2', '1:2,5'] },
    { k: 'objetivo', r: 'Altura deseada', b: 'Resultado', d: ['color'], ph: 'Ej.: 9.1 Rubio muy claro ceniza' },

    /* Cejas. */
    { k: 'pielCejas', r: 'Tipo de piel', b: 'Diagnóstico', d: ['cejas'], op: ['', 'Seca', 'Normal', 'Mixta', 'Grasa'] },
    { k: 'peloCejas', r: 'Densidad del pelo', b: 'Diagnóstico', d: ['cejas'], op: ['', 'Escasa', 'Media', 'Poblada'] },
    { k: 'asimetria', r: 'Asimetría', b: 'Diagnóstico', d: ['cejas'], op: ['', 'Simétricas', 'Leve', 'Marcada'] },
    { k: 'visagismo', r: 'Visagismo', b: 'Diagnóstico', d: ['cejas'], ph: 'Ej.: rostro ovalado, arco medio' },
    { k: 'medidasCejas', r: 'Medidas', b: 'Fórmula', d: ['cejas'], ph: 'Ej.: inicio 1,8 · arco 3,4 · cola 5,1 cm' },
    { k: 'pigmento', r: 'Pigmento', b: 'Fórmula', d: ['cejas'], ph: 'Ej.: castaño frío + gota de rubio' },
    { k: 'profundidad', r: 'Profundidad', b: 'Fórmula', d: ['cejas'], op: ['', 'Epidermis', 'Dermis superficial', 'Dermis media'] },
    { k: 'retoque', r: 'Retoque', b: 'Resultado', d: ['cejas'], ph: 'Ej.: a los 30 días' },

    /* Pestañas. */
    { k: 'ojo', r: 'Forma del ojo', b: 'Diagnóstico', d: ['pestanas'], op: ['', 'Redondo', 'Almendrado', 'Caído', 'Saltón', 'Juntos', 'Separados'] },
    { k: 'pestNat', r: 'Pestaña natural', b: 'Diagnóstico', d: ['pestanas'], op: ['', 'Escasa', 'Media', 'Poblada'] },
    { k: 'saludPest', r: 'Estado', b: 'Diagnóstico', d: ['pestanas'], op: ['', 'Sana', 'Quebradiza', 'Con extensión previa'] },
    { k: 'mapeo', r: 'Mapeo', b: 'Fórmula', d: ['pestanas'], ph: 'Ej.: 8-9-10-11-10-9 mm' },
    { k: 'curvaPest', r: 'Curvatura y grosor', b: 'Fórmula', d: ['pestanas'], ph: 'Ej.: curva C · 0,15 mm' },
    { k: 'adhesivo', r: 'Adhesivo', b: 'Fórmula', d: ['pestanas'], ph: 'Ej.: secado 1 s, humedad 55 %' },
    { k: 'relleno', r: 'Relleno', b: 'Resultado', d: ['pestanas'], ph: 'Ej.: a las 3 semanas' },

    /* Maquillaje. */
    { k: 'pielMaq', r: 'Tipo de piel', b: 'Diagnóstico', d: ['maquillaje'], op: ['', 'Seca', 'Normal', 'Mixta', 'Grasa'] },
    { k: 'subtono', r: 'Subtono', b: 'Diagnóstico', d: ['maquillaje'], op: ['', 'Frío', 'Neutro', 'Cálido'] },
    { k: 'baseMaq', r: 'Base y corrector', b: 'Fórmula', d: ['maquillaje'], ph: 'Ej.: base 2N + corrector melocotón' },
    { k: 'correccion', r: 'Corrección', b: 'Fórmula', d: ['maquillaje'], ph: 'Ej.: contorno frío, luz en pómulo alto' },
    { k: 'acabado', r: 'Acabado', b: 'Fórmula', d: ['maquillaje'], op: ['', 'Mate', 'Satinado', 'Luminoso'] },
    { k: 'ocasion', r: 'Ocasión', b: 'Resultado', d: ['maquillaje'], ph: 'Ej.: novia de día, luz natural' },

    /* Comunes de cierre. */
    { k: 'tiempo', r: 'Tiempo', b: 'Fórmula', ph: 'Ej.: 35 min' },
    { k: 'temperatura', r: 'Temperatura', b: 'Fórmula', d: ['color'], op: ['', 'Ambiente', 'Calor suave', 'Vapor', 'Secador'] },
    { k: 'mantenimiento', r: 'Mantenimiento', b: 'Resultado', ph: 'Ej.: retoque a las 6 semanas' },
    { k: 'precio', r: 'Precio', b: 'Resultado', ph: 'Ej.: 85 €' },
    { k: 'observaciones', r: 'Observaciones', b: 'Observaciones', ph: 'Prueba de mechón, alergias, contraindicaciones', alto: true }
  ];

  /* Un campo sin lista de disciplinas es común a todas. */
  function campoAplica(cp, disc) { return !cp.d || cp.d.indexOf(disc) >= 0; }

  var BLOQUES_FICHA = ['Identificación', 'Diagnóstico', 'Fórmula', 'Resultado', 'Observaciones'];

  /* [columna, fila] de cada anclaje: 0 izquierda/arriba, 1 centro, 2 derecha/abajo. */
  var POS_FOTO = {
    ai: [0, 0], ac: [1, 0], ad: [2, 0],
    mi: [0, 1], mc: [1, 1], md: [2, 1],
    bi: [0, 2], bc: [1, 2], bd: [2, 2]
  };
  var ORDEN_POS = ['ai', 'ac', 'ad', 'mi', 'mc', 'md', 'bi', 'bc', 'bd'];
  var NOMBRE_POS = {
    ai: 'Arriba izquierda', ac: 'Arriba centro', ad: 'Arriba derecha',
    mi: 'Centro izquierda', mc: 'Centro', md: 'Centro derecha',
    bi: 'Abajo izquierda', bc: 'Abajo centro', bd: 'Abajo derecha'
  };
  var _qrCache = {};

  function qrCanvas(texto) {
    if (!texto || !window.QRCode) return null;
    if (_qrCache[texto] !== undefined) return _qrCache[texto];
    var caja = document.createElement('div');
    caja.style.cssText = 'position:absolute;left:-9999px;top:-9999px';
    document.body.appendChild(caja);
    try { new QRCode(caja, { text: texto, width: 260, height: 260, correctLevel: QRCode.CorrectLevel.M }); } catch (e) { }
    var cv = caja.querySelector('canvas');
    var im = caja.querySelector('img');
    _qrCache[texto] = cv || (im && im.complete ? im : null);
    if (im && !im.complete) im.onload = function () { _qrCache[texto] = im; };
    setTimeout(function () { caja.remove(); }, 50);
    return _qrCache[texto];
  }

  /* Ficha técnica profesional: cabecera con el sello del negocio, los bloques
     de diagnóstico y fórmula a dos columnas y la fórmula a todo el ancho.
     Solo se imprime lo que está rellenado, así nunca sale con huecos. */
  function fichaTecnica(x, W, H, f, c, tecnica, libre, disc) {
    if (!f || !f.puesta) return;

    var pad = Math.round(W * 0.016), fs = Math.max(11, Math.round(W * 0.0092));
    var lh = Math.round(fs * 1.5), kick = Math.round(fs * 0.82);
    var w = Math.round(W * 0.40), colW = Math.round((w - pad * 3) / 2);

    /* Los datos que salen del propio lienzo, no del formulario. */
    var auto = [];
    if (tecnica) auto.push(['Técnica', tecnica]);
    if (c) {
      auto.push(['Raíz', c.raizN]);
      auto.push(['Medios', c.mediosN]);
      auto.push(['Puntas', c.puntasN]);
      auto.push(['Exposición', c.minutos + ' min']);
    }

    /* Cada bloque se convierte en una lista de trazos: rótulo o par. */
    var trazos = [];
    if (auto.length) {
      trazos.push({ t: 'k', v: 'EN LA LÁMINA' });
      auto.forEach(function (a) { if (a[1]) trazos.push({ t: 'p', a: a[0], b: String(a[1]) }); });
    }
    var libres = [];
    BLOQUES_FICHA.forEach(function (bl) {
      if (bl === 'Identificación') return;
      var hay = CAMPOS_FICHA.filter(function (cp) {
        return cp.b === bl && !cp.alto && campoAplica(cp, disc) && (f[cp.k] || '').trim();
      });
      if (!hay.length) return;
      trazos.push({ t: 'k', v: bl.toUpperCase() });
      hay.forEach(function (cp) { trazos.push({ t: 'p', a: cp.r, b: f[cp.k].trim() }); });
    });

    /* Los campos largos van a todo el ancho, debajo de las dos columnas. */
    x.save();
    x.font = fs + 'px Segoe UI,Arial,sans-serif';
    CAMPOS_FICHA.forEach(function (cp) {
      if (!cp.alto || !campoAplica(cp, disc)) return;
      var txt = (f[cp.k] || '').trim();
      if (!txt) return;
      var lin = [], ln = '';
      txt.split(/\s+/).forEach(function (pz) {
        var t = ln ? ln + ' ' + pz : pz;
        if (x.measureText(t).width > w - pad * 2 && ln) { lin.push(ln); ln = pz; } else ln = t;
      });
      if (ln) lin.push(ln);
      libres.push({ r: cp.r.toUpperCase(), l: lin.slice(0, 3) });
    });
    x.restore();

    /* Reparto por columnas: se corta donde se equilibran, sin dejar un rótulo
       de bloque colgando al final de la primera columna. */
    var mitad = Math.ceil(trazos.length / 2);
    if (trazos[mitad - 1] && trazos[mitad - 1].t === 'k') mitad -= 1;
    var izq = trazos.slice(0, mitad), der = trazos.slice(mitad);

    var altoCols = Math.max(izq.length, der.length) * lh;
    var altoLibres = 0;
    libres.forEach(function (b) { altoLibres += kick + 6 + b.l.length * lh + 8; });
    var cabAlto = Math.round(fs * 3.4);
    var h = cabAlto + (altoCols ? altoCols + 8 : 0) + altoLibres + pad;

    var px = Math.round(W * 0.024), py = H - h - Math.round(H * 0.135);
    if (py < 60) py = 60;

    /* Cuerpo de la tarjeta, sin el rótulo de la función tarjeta(): esta ficha
       lleva su propia cabecera. */
    x.save();
    var r = 12;
    x.beginPath();
    x.moveTo(px + r, py);
    x.arcTo(px + w, py, px + w, py + h, r);
    x.arcTo(px + w, py + h, px, py + h, r);
    x.arcTo(px, py + h, px, py, r);
    x.arcTo(px, py, px + w, py, r);
    x.closePath();
    x.fillStyle = 'rgba(253,250,244,.96)';
    x.fill();
    x.strokeStyle = 'rgba(176,135,60,.55)'; x.lineWidth = 1.5; x.stroke();
    x.clip();

    x.textBaseline = 'alphabetic';

    /* Cabecera: filete de oro, título y quién firma. */
    x.fillStyle = '#b0873c';
    x.fillRect(px, py, w, 3);
    var yc = py + pad + fs;
    x.textAlign = 'left';
    x.font = '700 ' + Math.round(fs * 1.15) + 'px Georgia,serif';
    x.fillStyle = '#2a2318';
    x.fillText('FICHA TÉCNICA', px + pad, yc);
    x.textAlign = 'right';
    x.font = '600 ' + kick + 'px Segoe UI,Arial,sans-serif';
    x.fillStyle = '#8d7c58';
    var firma = [f.negocio, f.fecha].filter(Boolean).join('  ·  ');
    if (firma) x.fillText(firma, px + w - pad, yc);
    var sub = [f.alumna, f.cliente ? 'Clienta: ' + f.cliente : ''].filter(Boolean).join('  ·  ');
    x.textAlign = 'left';
    x.font = kick + 'px Segoe UI,Arial,sans-serif';
    x.fillStyle = '#6b6152';
    if (sub) x.fillText(sub, px + pad, yc + Math.round(fs * 1.25));
    x.fillStyle = 'rgba(176,135,60,.3)';
    x.fillRect(px + pad, py + cabAlto - 8, w - pad * 2, 1);

    /* Las dos columnas. */
    var pintarCol = function (lista, cx) {
      var y = py + cabAlto + fs;
      lista.forEach(function (tz) {
        if (tz.t === 'k') {
          x.font = '700 ' + kick + 'px Segoe UI,Arial,sans-serif';
          x.fillStyle = '#b0873c';
          x.textAlign = 'left';
          x.fillText(tz.v, cx, y);
        } else {
          x.font = kick + 'px Segoe UI,Arial,sans-serif';
          x.fillStyle = '#8d7c58';
          x.textAlign = 'left';
          x.fillText(tz.a, cx, y);
          x.font = '600 ' + fs + 'px Segoe UI,Arial,sans-serif';
          x.fillStyle = '#2a2318';
          x.textAlign = 'right';
          x.fillText(tz.b, cx + colW, y);
        }
        y += lh;
      });
    };
    pintarCol(izq, px + pad);
    pintarCol(der, px + pad * 2 + colW);

    /* Fórmula y observaciones, a todo el ancho. */
    var yl = py + cabAlto + (altoCols ? altoCols + fs + 8 : fs);
    libres.forEach(function (b) {
      x.textAlign = 'left';
      x.font = '700 ' + kick + 'px Segoe UI,Arial,sans-serif';
      x.fillStyle = '#b0873c';
      x.fillText(b.r, px + pad, yl);
      yl += kick + 6;
      x.font = fs + 'px Segoe UI,Arial,sans-serif';
      x.fillStyle = '#4a4234';
      b.l.forEach(function (l) { x.fillText(l, px + pad, yl); yl += lh; });
      yl += 8;
    });
    x.restore();

    if (f.enlace) {
      var q = qrCanvas(f.enlace);
      if (q) {
        /* La franja realmente libre de la columna: desde donde acaba el texto
           del paso hasta el borde de la tarjeta. El QR se encoge para caber y,
           si no cabe de ninguna manera, no se imprime: nunca tapa letras. */
        var arriba = (libre || 62) + 10, hueco = py - 14 - arriba;
        var lado = Math.min(Math.round(W * 0.085), hueco - 20);
        if (lado >= 62) {
          var qx = px, qy = arriba + Math.round((hueco - lado - 20) / 2);
        x.save();
        x.fillStyle = '#fff';
        x.fillRect(qx - 6, qy - 6, lado + 12, lado + 28);
        try { x.drawImage(q, qx, qy, lado, lado); } catch (e) { }
        x.fillStyle = '#1c1c2c';
        x.font = '700 9px Segoe UI,Arial,sans-serif';
        x.textAlign = 'center'; x.textBaseline = 'alphabetic';
        x.fillText('ESCANÉAME', qx + lado / 2, qy + lado + 12);
        x.restore();
        }
      }
    }
  }

  /* Lámina de antes y después: la pieza que la alumna enseña a su clienta.
     Dos fotos al mismo tamaño, mismo encuadre y misma altura, con el sello del
     negocio arriba y los datos que justifican el trabajo abajo. */
  function laminaAntes(x, W, H, par, f, tecnica, disc) {
    par = par || {};
    var m = Math.round(W * 0.05), hueco = Math.round(W * 0.028);
    var anc = Math.round((W - m * 2 - hueco) / 2);
    var top = Math.round(H * 0.19), alt = Math.round(H * 0.56);

    x.save();
    x.textBaseline = 'alphabetic';

    /* Cabecera. */
    x.textAlign = 'left';
    x.font = '700 ' + Math.round(W * 0.011) + 'px Segoe UI,Arial,sans-serif';
    x.fillStyle = '#b0873c';
    x.fillText('ANTES Y DESPUÉS', m, Math.round(H * 0.085));
    x.font = '700 ' + Math.round(W * 0.026) + 'px Georgia,serif';
    x.fillStyle = '#2a2318';
    x.fillText(tecnica || 'Trabajo terminado', m, Math.round(H * 0.135));
    var firma = [f && f.negocio, f && f.fecha].filter(Boolean).join('  ·  ');
    if (firma) {
      x.textAlign = 'right';
      x.font = '600 ' + Math.round(W * 0.011) + 'px Segoe UI,Arial,sans-serif';
      x.fillStyle = '#8d7c58';
      x.fillText(firma, W - m, Math.round(H * 0.085));
    }

    var marco = function (px, rot, dato) {
      var r = 12;
      x.save();
      x.beginPath();
      x.moveTo(px + r, top);
      x.arcTo(px + anc, top, px + anc, top + alt, r);
      x.arcTo(px + anc, top + alt, px, top + alt, r);
      x.arcTo(px, top + alt, px, top, r);
      x.arcTo(px, top, px + anc, top, r);
      x.closePath();
      if (dato && dato.img && dato.img.width) {
        x.save(); x.clip();
        /* Recorte central: las dos fotos se ven al mismo encuadre aunque
           vengan de móviles distintos. */
        var ri = dato.img.width / dato.img.height, rc = anc / alt;
        var sw = dato.img.width, sh = dato.img.height, sx = 0, sy = 0;
        if (ri > rc) { sw = dato.img.height * rc; sx = (dato.img.width - sw) / 2; }
        else { sh = dato.img.width / rc; sy = (dato.img.height - sh) / 2; }
        x.drawImage(dato.img, sx, sy, sw, sh, px, top, anc, alt);
        x.restore();
      } else {
        x.fillStyle = 'rgba(176,135,60,.07)';
        x.fill();
        x.save();
        x.setLineDash([9, 7]);
        x.strokeStyle = 'rgba(176,135,60,.6)'; x.lineWidth = 1.5; x.stroke();
        x.restore();
        x.textAlign = 'center';
        x.font = '600 ' + Math.round(W * 0.013) + 'px Segoe UI,Arial,sans-serif';
        x.fillStyle = '#a08a5e';
        x.fillText('Sube la foto del ' + rot.toLowerCase(), px + anc / 2, top + alt / 2);
      }
      x.strokeStyle = 'rgba(176,135,60,.75)'; x.lineWidth = 2; x.stroke();

      /* Cinta con el rótulo, sobre la propia foto. */
      var hc = Math.round(H * 0.055);
      x.save();
      x.beginPath();
      x.rect(px, top + alt - hc, anc, hc);
      x.clip();
      x.fillStyle = 'rgba(28,24,16,.72)';
      x.fillRect(px, top + alt - hc, anc, hc);
      x.textAlign = 'left';
      x.font = '700 ' + Math.round(W * 0.014) + 'px Segoe UI,Arial,sans-serif';
      x.fillStyle = '#f0e2c4';
      x.fillText(rot.toUpperCase(), px + 16, top + alt - hc / 2 + Math.round(W * 0.005));
      x.restore();
      x.restore();
    };
    marco(m, 'Antes', par.antes);
    marco(m + anc + hueco, 'Después', par.despues);

    /* Pie: los datos que sostienen el resultado, en una sola línea. */
    var datos = [];
    CAMPOS_FICHA.forEach(function (cp) {
      if (cp.alto || !campoAplica(cp, disc)) return;
      if (['alumna', 'negocio', 'cliente', 'fecha', 'precio'].indexOf(cp.k) >= 0) return;
      var v = (f && f[cp.k] || '').trim();
      if (v) datos.push(cp.r + ': ' + v);
    });
    var yp = top + alt + Math.round(H * 0.06);
    x.textAlign = 'left';
    if (datos.length) {
      x.font = Math.round(W * 0.0105) + 'px Segoe UI,Arial,sans-serif';
      x.fillStyle = '#5a5040';
      var w = W - m * 2 - Math.round(W * 0.12), ln = '', lin = [];
      datos.join('   ·   ').split(' ').forEach(function (pz) {
        var t = ln ? ln + ' ' + pz : pz;
        if (x.measureText(t).width > w && ln) { lin.push(ln); ln = pz; } else ln = t;
      });
      if (ln) lin.push(ln);
      lin.slice(0, 2).forEach(function (l, i) { x.fillText(l, m, yp + i * Math.round(W * 0.016)); });
    }
    if (f && f.alumna) {
      x.font = '600 ' + Math.round(W * 0.0105) + 'px Segoe UI,Arial,sans-serif';
      x.fillStyle = '#8d7c58';
      x.fillText(f.alumna + (f.cliente ? '  ·  Clienta: ' + f.cliente : ''), m, top + alt + Math.round(H * 0.032));
    }
    x.restore();

    if (f && f.enlace) {
      var q = qrCanvas(f.enlace);
      if (q) {
        var lado = Math.round(W * 0.075);
        var qx = W - m - lado, qy = top + alt + Math.round(H * 0.02);
        x.save();
        x.fillStyle = '#fff';
        x.fillRect(qx - 6, qy - 6, lado + 12, lado + 26);
        try { x.drawImage(q, qx, qy, lado, lado); } catch (e) { }
        x.fillStyle = '#1c1c2c';
        x.font = '700 9px Segoe UI,Arial,sans-serif';
        x.textAlign = 'center'; x.textBaseline = 'alphabetic';
        x.fillText('ESCANÉAME', qx + lado / 2, qy + lado + 12);
        x.restore();
      }
    }
  }

  /* ══ DIAGRAMAS CONCEPTUALES ══
     El porqué, no el cómo. Aquí no hay cabeza ni divisiones: hay teoría
     dibujada, que es lo que hace que la alumna deje de copiar y empiece a
     decidir. Cada lámina se pinta sola a partir de sus datos. */

  var RUEDA = [
    { n: 'Amarillo', c: '#F2D231' }, { n: 'Amarillo naranja', c: '#F3B428' },
    { n: 'Naranja', c: '#EC8B24' }, { n: 'Naranja rojo', c: '#DF5C27' },
    { n: 'Rojo', c: '#C9302C' }, { n: 'Rojo violeta', c: '#A03060' },
    { n: 'Violeta', c: '#6E3E93' }, { n: 'Azul violeta', c: '#4A4A9E' },
    { n: 'Azul', c: '#2E6FB0' }, { n: 'Azul verde', c: '#2A8E92' },
    { n: 'Verde', c: '#3D9A55' }, { n: 'Amarillo verde', c: '#96BC36' }
  ];

  var ALTURAS = [
    { n: 1, t: 'Negro', c: '#1B1614', f: 'Rojo muy oscuro' },
    { n: 2, t: 'Castaño muy oscuro', c: '#2A1C15', f: 'Rojo oscuro' },
    { n: 3, t: 'Castaño oscuro', c: '#3A2419', f: 'Rojo' },
    { n: 4, t: 'Castaño', c: '#4E3122', f: 'Rojo naranja' },
    { n: 5, t: 'Castaño claro', c: '#6B4229', f: 'Naranja' },
    { n: 6, t: 'Rubio oscuro', c: '#8B5E3C', f: 'Naranja amarillo' },
    { n: 7, t: 'Rubio', c: '#A9743F', f: 'Amarillo naranja' },
    { n: 8, t: 'Rubio claro', c: '#C79A5C', f: 'Amarillo' },
    { n: 9, t: 'Rubio muy claro', c: '#DEC08A', f: 'Amarillo claro' },
    { n: 10, t: 'Rubio clarísimo', c: '#EFDDB8', f: 'Amarillo pálido' }
  ];

  var PARES_NEUTRO = [
    { a: 'Amarillo', ca: '#F2D231', b: 'Violeta', cb: '#6E3E93', txt: 'El violeta apaga el amarillo del rubio decolorado.' },
    { a: 'Naranja', ca: '#EC8B24', b: 'Azul', cb: '#2E6FB0', txt: 'El azul apaga el naranja del castaño aclarado.' },
    { a: 'Rojo', ca: '#C9302C', b: 'Verde', cb: '#3D9A55', txt: 'El verde apaga el rojo que sale al levantar bases oscuras.' }
  ];

  var OXIDANTES = [
    { v: '10 vol', p: '3 %', s: 1, u: 'Tono sobre tono. No aclara: deposita y sella.' },
    { v: '20 vol', p: '6 %', s: 2, u: 'Cobertura de canas y cambio de un tono. El de todos los días.' },
    { v: '30 vol', p: '9 %', s: 3, u: 'Aclarado medio. Pide cabello sano y control de tiempo.' },
    { v: '40 vol', p: '12 %', s: 4, u: 'Solo con decolorante y fuera de la raíz. Máximo riesgo.' }
  ];

  var ESCALA_PH = [
    { v: '3,5', n: 'Mascarilla ácida', c: '#C9302C' },
    { v: '4,5', n: 'Champú', c: '#EC8B24' },
    { v: '5,5', n: 'Cabello sano', c: '#3D9A55' },
    { v: '7,0', n: 'Agua', c: '#2A8E92' },
    { v: '9,0', n: 'Tinte', c: '#2E6FB0' },
    { v: '10,5', n: 'Decolorante', c: '#6E3E93' }
  ];

  var DANO = [
    { n: 'Virgen', c: '#3D9A55', d: 'Cutícula cerrada. Absorbe despacio y de forma pareja.' },
    { n: 'Teñido', c: '#96BC36', d: 'Cutícula abierta a ratos. Igualar antes de aplicar.' },
    { n: 'Poroso', c: '#F3B428', d: 'Absorbe de golpe y suelta igual de rápido. Baja el volumen.' },
    { n: 'Decolorado', c: '#EC8B24', d: 'Córtex expuesto. Solo tono sobre tono y tratamiento.' },
    { n: 'Roto', c: '#C9302C', d: 'No se toca con química. Solo tijera y reconstrucción.' }
  ];

  /* Las disciplinas que agrupan las láminas, para que la lista de chips no
     crezca hasta ser inservible. */
  var DISCIPLINAS = [
    { id: 'color', n: 'Colorimetría' },
    { id: 'diagnostico', n: 'Diagnóstico' },
    { id: 'cejas', n: 'Cejas' },
    { id: 'pestanas', n: 'Pestañas' },
    { id: 'maquillaje', n: 'Maquillaje' },
    { id: 'estudio', n: 'Estudio' }
  ];

  /* ══ LÁMINAS CONCEPTUALES ══
     Las siete primeras tienen dibujo propio. Las demás se declaran como datos
     y las pinta un motor genérico: 'tabla' (filas comparadas) o 'escala' (una
     barra con hitos). Añadir una lámina nueva es añadir un objeto aquí, sin
     tocar el motor de dibujo. */
  var CONCEPTUALES = [
    { id: 'rueda', n: 'Rueda cromática', disc: 'color' },
    { id: 'neutro', n: 'Neutralización', disc: 'color' },
    { id: 'alturas', n: 'Escala de alturas', disc: 'color' },
    { id: 'fondos', n: 'Fondos de decoloración', disc: 'color' },
    { id: 'oxidante', n: 'Volúmenes de oxidante', disc: 'color' },
    { id: 'ph', n: 'Escala de pH', disc: 'color' },
    { id: 'dano', n: 'Estado del cabello', disc: 'diagnostico' },

    {
      id: 'tiempos', n: 'Tiempos de exposición', disc: 'color', tipo: 'tabla',
      kicker: 'QUÍMICA  ·  CUÁNTO TIEMPO Y POR QUÉ',
      pie: 'El tiempo no se alarga para conseguir más color: se cumple para conseguir el que se calculó. Pasado el tiempo el producto ya no trabaja, solo daña.',
      filas: [
        { n: 'Tono sobre tono', c: '#8B5E3C', d: 'Deposita sin abrir. El pigmento entra y se sella.', r: '20 min' },
        { n: 'Cobertura de canas', c: '#6B4229', d: 'Necesita el tiempo completo o la cana vuelve a asomar.', r: '35–40 min' },
        { n: 'Aclarado con tinte', c: '#A9743F', d: 'Los últimos diez minutos son los que suben el nivel.', r: '45 min' },
        { n: 'Decoloración', c: '#DEC08A', d: 'Se controla a la vista, nunca por reloj. Se para en el fondo.', r: 'Vista' },
        { n: 'Matización', c: '#C7B9C9', d: 'Corta y vigilada: el matiz se pasa en un minuto.', r: '5–15 min' },
        { n: 'Tratamiento ácido', c: '#9BA7A0', d: 'Cierra la cutícula después de cualquier química.', r: '5–10 min' }
      ]
    },
    {
      id: 'porosidad', n: 'Escala de porosidad', disc: 'diagnostico', tipo: 'escala',
      kicker: 'DIAGNÓSTICO  ·  CÓMO ABSORBE',
      izq: 'CERRADA  ·  ABSORBE DESPACIO', der: 'ABIERTA  ·  ABSORBE DE GOLPE',
      grad: [[0, '#3D9A55'], [0.5, '#F3B428'], [1, '#C9302C']],
      pie: 'La porosidad decide el volumen y el tiempo, no el color que se quiere. Se comprueba antes de mezclar: un mechón entre los dedos, de puntas a raíz.',
      hitos: [
        { v: 'Baja', n: 'Cutícula cerrada', d: 'Cabello virgen o sano. Cuesta que entre: volumen normal y tiempo completo.' },
        { v: 'Media', n: 'Cabello trabajado', d: 'Teñido reciente. Absorbe parejo si se igualan medios y puntas antes.' },
        { v: 'Alta', n: 'Poroso', d: 'Entra de golpe y se va igual de rápido. Bajar volumen y acortar tiempo.' },
        { v: 'Muy alta', n: 'Decolorado', d: 'Córtex expuesto. Solo tono sobre tono, con relleno previo si hace falta.' }
      ]
    },
    {
      id: 'capas', n: 'Capas del cabello', disc: 'diagnostico', tipo: 'tabla',
      kicker: 'ANATOMÍA  ·  DÓNDE TRABAJA CADA PRODUCTO',
      pie: 'Saber en qué capa actúa cada producto es saber qué se puede deshacer y qué no. Lo que pasa en la cutícula se corrige; lo que pasa en el córtex se convive.',
      filas: [
        { n: 'Cutícula', c: '#DEC08A', d: 'La escama exterior. La abre el alcalino y la cierra el ácido.', r: 'Brillo' },
        { n: 'Córtex', c: '#A9743F', d: 'Donde vive el pigmento y la fuerza. Aquí actúan tinte y decolorante.', r: 'Color' },
        { n: 'Médula', c: '#6B4229', d: 'El canal interior. No en todos los cabellos, y no se trabaja.', r: '—' },
        { n: 'Puente de disulfuro', c: '#4E3122', d: 'La unión que se rompe al alisar o rizar y se vuelve a formar.', r: 'Forma' }
      ]
    },
    {
      id: 'rostros', n: 'Morfología del rostro', disc: 'cejas', tipo: 'tabla',
      kicker: 'VISAGISMO  ·  LA FORMA MANDA SOBRE EL GUSTO',
      pie: 'La ceja no se copia de una foto: se calcula sobre el rostro que hay delante. La forma del óvalo decide el arco, y no al contrario.',
      filas: [
        { n: 'Ovalado', c: '#8B5E3C', d: 'Frente y mentón en proporción. Admite cualquier diseño.', r: 'Arco suave' },
        { n: 'Redondo', c: '#A9743F', d: 'Ancho y alto parecidos, sin ángulos marcados.', r: 'Arco alto' },
        { n: 'Cuadrado', c: '#6B4229', d: 'Mandíbula ancha y línea de frente recta.', r: 'Arco curvo' },
        { n: 'Corazón', c: '#C79A5C', d: 'Frente ancha y mentón estrecho.', r: 'Arco redondeado' },
        { n: 'Alargado', c: '#4E3122', d: 'Bastante más alto que ancho.', r: 'Ceja horizontal' },
        { n: 'Triangular', c: '#B58A5C', d: 'Mandíbula más ancha que la frente.', r: 'Cola elevada' }
      ]
    },
    {
      id: 'proporcion', n: 'Proporción de la ceja', disc: 'cejas', tipo: 'tabla',
      kicker: 'CEJAS  ·  LOS TRES PUNTOS Y EL GROSOR',
      pie: 'Los tres puntos se miden, no se estiman: lápiz desde el ala de la nariz. Con los tres marcados el diseño ya está hecho; lo demás es limpiar fuera de la línea.',
      filas: [
        { n: 'Inicio', c: '#3A2419', d: 'En la vertical del lagrimal, alineado con el ala de la nariz.', r: 'Punto 1' },
        { n: 'Arco', c: '#6B4229', d: 'Sobre el borde exterior del iris, mirando al frente.', r: 'Punto 2' },
        { n: 'Cola', c: '#8B5E3C', d: 'En la diagonal nariz–rabillo del ojo. Nunca por debajo del inicio.', r: 'Punto 3' },
        { n: 'Grosor', c: '#B58A5C', d: 'Máximo en el inicio y descendiendo hacia la cola.', r: 'Degradado' },
        { n: 'Distancia', c: '#DCC199', d: 'Entre ambas, el ancho de la base de la nariz.', r: 'Simetría' }
      ]
    },
    {
      id: 'ojos', n: 'Formas del ojo', disc: 'pestanas', tipo: 'tabla',
      kicker: 'MAPPING  ·  CADA OJO PIDE SU EFECTO',
      pie: 'El mapping se decide por la forma del ojo y por dónde cae el párpado, no por el efecto que está de moda. Un mismo juego de longitudes cambia de resultado en cada ojo.',
      filas: [
        { n: 'Almendrado', c: '#8B5E3C', d: 'La forma de referencia. Acepta cualquier mapping.', r: 'Abierto o gatuno' },
        { n: 'Redondo', c: '#A9743F', d: 'Bastante abertura vertical. Alargar hacia fuera.', r: 'Gatuno' },
        { n: 'Caído', c: '#6B4229', d: 'El rabillo desciende. Levantar sin peso en la cola.', r: 'Muñeca invertida' },
        { n: 'Encapotado', c: '#4E3122', d: 'El párpado tapa la línea. Longitud corta y curva fuerte.', r: 'Curva D corta' },
        { n: 'Saltón', c: '#C79A5C', d: 'El globo sobresale. Curvas suaves para no rozar.', r: 'Curva B o C' },
        { n: 'Juntos', c: '#B58A5C', d: 'Poca distancia entre lagrimales. Vaciar el interior.', r: 'Peso exterior' }
      ]
    },
    {
      id: 'curvas', n: 'Curvaturas de pestaña', disc: 'pestanas', tipo: 'tabla',
      kicker: 'PESTAÑAS  ·  QUÉ HACE CADA CURVA',
      pie: 'La curva no se elige por catálogo: cuanto más cae el párpado, más curva hace falta para que la pestaña se vea de frente. Y cuanto más corta la natural, menos peso admite.',
      filas: [
        { n: 'Curva B', c: '#DCC199', d: 'Apenas curva. Efecto natural sobre pestaña que ya sube.', r: 'Natural' },
        { n: 'Curva C', c: '#C79A5C', d: 'La de todos los días. Se ve de frente sin forzar.', r: 'Estándar' },
        { n: 'Curva CC', c: '#B58A5C', d: 'Un paso más de apertura sin llegar a rizo cerrado.', r: 'Apertura' },
        { n: 'Curva D', c: '#8B5E3C', d: 'Rizo marcado. Levanta párpado caído y encapotado.', r: 'Levanta' },
        { n: 'Curva L', c: '#6B4229', d: 'Base recta y punta al alza. Para párpado muy caído.', r: 'Correctora' },
        { n: 'Curva M', c: '#4E3122', d: 'Efecto máscara, muy abierta. Pide pestaña fuerte.', r: 'Máximo efecto' }
      ]
    },
    {
      id: 'subtono', n: 'Subtono de la piel', disc: 'maquillaje', tipo: 'tabla',
      kicker: 'MAQUILLAJE  ·  ANTES DE ELEGIR LA BASE',
      pie: 'El tono se ve, el subtono se comprueba: a la luz del día, en la muñeca y en el cuello, nunca en la mano. Acertar el subtono es lo que hace que la base desaparezca.',
      filas: [
        { n: 'Frío', c: '#D8C0BC', d: 'Venas azuladas y la plata favorece. Base rosada.', r: 'Rosa' },
        { n: 'Cálido', c: '#E0C39A', d: 'Venas verdosas y el oro favorece. Base dorada.', r: 'Dorado' },
        { n: 'Neutro', c: '#DCC7B4', d: 'Ni rosa ni oro predominan. Admite ambas familias.', r: 'Beige' },
        { n: 'Oliva', c: '#CFC49E', d: 'Fondo verdoso. Se corrige con base ligeramente dorada.', r: 'Verde–oro' }
      ]
    }
  ];

  /* Corta un texto a lo que quepa, con puntos suspensivos. */
  function recorta(x, txt, max) {
    if (x.measureText(txt).width <= max) return txt;
    var t = txt;
    while (t.length > 4 && x.measureText(t + '…').width > max) t = t.slice(0, -1);
    return t + '…';
  }

  /* Motor 'tabla': filas comparadas con muestra de color, nombre, explicación
     y una etiqueta corta a la derecha. Cualquier lámina nueva de este tipo es
     solo datos. */
  function conceptoTabla(x, W, H, d, firma) {
    var m = Math.round(W * 0.05);
    cabConcepto(x, W, H, d.kicker, d.n, firma);
    var top = Math.round(H * 0.20);
    var n = d.filas.length, fila = Math.floor((Math.round(H * 0.74) - top) / n);
    var lado = Math.min(Math.round(fila * 0.60), Math.round(H * 0.058));
    var fsN = Math.round(W * 0.0145), fsD = Math.round(W * 0.0105);
    d.filas.forEach(function (r, i) {
      var y = top + i * fila;
      x.fillStyle = r.c;
      x.fillRect(m, y, lado, lado);
      x.strokeStyle = 'rgba(176,135,60,.5)'; x.lineWidth = 1;
      x.strokeRect(m + 0.5, y + 0.5, lado, lado);
      var tx = m + lado + Math.round(W * 0.014);
      var derAnc = r.r ? Math.round(W * 0.17) : 0;
      var disp = W - m - derAnc - tx - Math.round(W * 0.02);
      x.textAlign = 'left';
      x.font = '700 ' + fsN + 'px Georgia,serif';
      x.fillStyle = '#2a2318';
      x.fillText(recorta(x, r.n, disp), tx, y + Math.round(lado * 0.44));
      x.font = fsD + 'px Segoe UI,Arial,sans-serif';
      x.fillStyle = '#5a5040';
      x.fillText(recorta(x, r.d, disp), tx, y + Math.round(lado * 0.94));
      if (r.r) {
        x.textAlign = 'right';
        x.font = '600 ' + fsD + 'px Segoe UI,Arial,sans-serif';
        x.fillStyle = '#b0873c';
        x.fillText(r.r, W - m, y + Math.round(lado * 0.66));
        x.textAlign = 'left';
      }
    });
    pieConcepto(x, W, H, d.pie);
  }

  /* Motor 'escala': una barra con degradado, los hitos repartidos encima y su
     explicación debajo. Mismo patrón que la escala de pH, pero por datos. */
  function conceptoEscala(x, W, H, d, firma) {
    var m = Math.round(W * 0.05);
    cabConcepto(x, W, H, d.kicker, d.n, firma);
    var bx = m, bw = W - m * 2, by = Math.round(H * 0.24), bh = Math.round(H * 0.085);
    var g = x.createLinearGradient(bx, 0, bx + bw, 0);
    d.grad.forEach(function (p) { g.addColorStop(p[0], p[1]); });
    x.fillStyle = g;
    x.fillRect(bx, by, bw, bh);
    x.strokeStyle = 'rgba(176,135,60,.55)'; x.lineWidth = 1.4;
    x.strokeRect(bx + 0.5, by + 0.5, bw, bh);
    var n = d.hitos.length;
    d.hitos.forEach(function (e, i) {
      var px = bx + bw * ((i + 0.5) / n);
      x.strokeStyle = '#2a2318'; x.lineWidth = 2;
      x.beginPath(); x.moveTo(px, by - 9); x.lineTo(px, by + bh + 9); x.stroke();
      x.textAlign = 'center';
      x.font = '700 ' + Math.round(W * 0.0135) + 'px Georgia,serif';
      x.fillStyle = '#2a2318';
      x.fillText(e.v, px, by - 22);
      x.font = '600 ' + Math.round(W * 0.0092) + 'px Segoe UI,Arial,sans-serif';
      x.fillStyle = '#6b6152';
      x.fillText(e.n, px, by + bh + Math.round(W * 0.021));
    });
    if (d.izq || d.der) {
      x.font = '700 ' + Math.round(W * 0.0098) + 'px Segoe UI,Arial,sans-serif';
      x.fillStyle = '#b0873c';
      var yl = by + bh + Math.round(H * 0.075);
      x.textAlign = 'left'; x.fillText(d.izq || '', m, yl);
      x.textAlign = 'right'; x.fillText(d.der || '', W - m, yl);
    }
    /* Las explicaciones, una por hito, en lista. */
    var y2 = by + bh + Math.round(H * 0.135), fs = Math.round(W * 0.0108);
    x.textAlign = 'left';
    d.hitos.forEach(function (e) {
      x.font = '700 ' + fs + 'px Georgia,serif';
      x.fillStyle = '#2a2318';
      x.fillText(e.v, m, y2);
      var tx = m + Math.round(W * 0.075);
      x.font = fs + 'px Segoe UI,Arial,sans-serif';
      x.fillStyle = '#5a5040';
      x.fillText(recorta(x, e.d, W - m - tx), tx, y2);
      y2 += Math.round(fs * 2.05);
    });
    pieConcepto(x, W, H, d.pie);
  }

  /* ══ LOS QUINCE MODELOS DE MANDALA ══
     Cada uno es una clase entera: qué división se traza, por dónde se empieza,
     en qué orden se avanza y por qué. La alumna elige el modelo y la lámina se
     reescribe sola; después puede editar cualquier palabra. */
  var MODELOS_MANDALA = [
    {
      id: 'base', n: 'Raíz, medios y puntas', coronas: 3, sectores: 8,
      sentido: 'reloj', arranque: 'frente', orden: 'correlativo',
      tonos: ['#8B5E3C', '#A9743F', '#C08A4A'],
      nombres: ['Raíz', 'Medios', 'Puntas'],
      notas: [
        'Se aplica la última: el calor del cuero cabelludo acelera el revelado y adelantaría el tono.',
        'Primera pasada. Es la zona que marca el resultado que se ve.',
        'Se abren antes si están porosas: absorben más y viran a frío.'
      ]
    },
    {
      id: 'global4', n: 'Color global en cuatro', coronas: 2, sectores: 4,
      sentido: 'reloj', arranque: 'frente', orden: 'correlativo',
      tonos: ['#5E3A24', '#7A4A2C'],
      nombres: ['Largos', 'Raíz'],
      notas: [
        'Cuatro cuadrantes: la división de toda la vida, la que sostiene cualquier técnica.',
        'Última pasada, cuando quedan diez minutos de exposición.'
      ]
    },
    {
      id: 'canas', n: 'Cobertura de canas', coronas: 3, sectores: 12,
      sentido: 'reloj', arranque: 'frente', orden: 'correlativo',
      tonos: ['#4E3122', '#6B4229', '#8B5E3C'],
      nombres: ['Contorno y raya', 'Coronilla', 'Resto'],
      notas: [
        'Se empieza donde más se ve la cana: frente y raya. Doce sectores para no dejar ni un hueco.',
        'Segunda zona crítica: la luz cae aquí y delata cualquier fallo.',
        'Se cubre al final, con lo que queda de mezcla.'
      ]
    },
    {
      id: 'raizdeco', n: 'Decoloración de raíz', coronas: 2, sectores: 8,
      sentido: 'reloj', arranque: 'nuca', orden: 'alterno',
      tonos: ['#C08A4A', '#E5C07B'],
      nombres: ['Centímetro de seguridad', 'Raíz nueva'],
      notas: [
        'Se deja sin tocar: es la zona que ya está aclarada y se rompería.',
        'Se empieza por la nuca, que es la más fría y la que más tarda en levantar.'
      ]
    },
    {
      id: 'balayage', n: 'Balayage radial', coronas: 3, sectores: 6,
      sentido: 'reloj', arranque: 'frente', orden: 'correlativo',
      tonos: ['#6B4229', '#B07A45', '#E5C07B'],
      nombres: ['Base intacta', 'Transición', 'Barrido'],
      notas: [
        'No se toca: es la sombra que hace natural el resultado.',
        'Se difumina con la brocha en plano, sin marcar línea.',
        'Aquí se apoya el producto de verdad. Cuanto más lejos de la raíz, más natural.'
      ]
    },
    {
      id: 'babylights', n: 'Babylights de coronilla', coronas: 4, sectores: 12,
      sentido: 'reloj', arranque: 'frente', orden: 'espiral',
      tonos: ['#6B4229', '#8B5E3C', '#C08A4A', '#F0D9A8'],
      nombres: ['Nuca', 'Laterales', 'Coronilla', 'Contorno de luz'],
      notas: [
        'Mechas muy finas y pocas: la nuca no se ve, no gasta producto.',
        'Se sube en densidad conforme se acerca a la cara.',
        'Máxima densidad: es de donde sale la luz.',
        'Las mechas que enmarcan el rostro. Se hacen las últimas y se miran de frente.'
      ]
    },
    {
      id: 'espiral', n: 'Mechas en espiral', coronas: 3, sectores: 10,
      sentido: 'reloj', arranque: 'frente', orden: 'espiral',
      tonos: ['#5E3A24', '#A9743F', '#E5C07B'],
      nombres: ['Interior', 'Medio', 'Exterior'],
      notas: [
        'La espiral reparte la luz sin que se vean bandas al mover el pelo.',
        'Cada vuelta cambia de corona: por eso el número salta hacia dentro.',
        'La capa que se ve. Aquí van las mechas más claras.'
      ]
    },
    {
      id: 'contraste', n: 'Dos tonos en contraste', coronas: 2, sectores: 8,
      sentido: 'reloj', arranque: 'frente', orden: 'alterno',
      tonos: ['#3A2419', '#D6A55E'],
      nombres: ['Tono profundo', 'Tono claro'],
      notas: [
        'Se aplica en sectores alternos: el número salta al sector opuesto.',
        'Nunca se tocan en húmedo. Papel de por medio o se manchan.'
      ]
    },
    {
      id: 'bano', n: 'Baño de color', coronas: 2, sectores: 6,
      sentido: 'reloj', arranque: 'frente', orden: 'correlativo',
      tonos: ['#7A4A2C', '#A9743F'],
      nombres: ['Medios y puntas', 'Raíz'],
      notas: [
        'Tono sobre tono, sin amoníaco: solo deposita, no aclara.',
        'Se pasa por encima al final, dos minutos, para igualar.'
      ]
    },
    {
      id: 'hidratacion', n: 'Hidratación por capas', coronas: 3, sectores: 4,
      sentido: 'reloj', arranque: 'nuca', orden: 'correlativo',
      tonos: ['#9BA7A0', '#B6C0B8', '#D2D9D3'],
      nombres: ['Puntas', 'Medios', 'Raíz'],
      notas: [
        'Donde está el daño. Doble cantidad y más tiempo.',
        'Capa normal, peine de púa ancha para repartir.',
        'Solo si el cabello es seco. En cuero graso se salta.'
      ]
    },
    {
      id: 'queratina', n: 'Queratina y alisado', coronas: 3, sectores: 8,
      sentido: 'reloj', arranque: 'nuca', orden: 'correlativo',
      tonos: ['#B98C56', '#CFA771', '#E3C79A'],
      nombres: ['Nuca', 'Laterales', 'Coronilla'],
      notas: [
        'Se empieza por la nuca: es la zona más resistente y necesita más tiempo de producto.',
        'Mechas de un centímetro, ni una más gruesa, o la plancha no sella.',
        'Se deja para el final: es la más fina y la que antes se satura.'
      ]
    },
    {
      id: 'permanente', n: 'Permanente radial', coronas: 4, sectores: 12,
      sentido: 'anti', arranque: 'nuca', orden: 'correlativo',
      tonos: ['#7F6A55', '#9B8368', '#B79C7C', '#D3B693'],
      nombres: ['Nuca baja', 'Nuca alta', 'Laterales', 'Coronilla'],
      notas: [
        'Bigudíes más grandes abajo: el peso del pelo abre el rizo.',
        'Se sube en diagonal para que no se marque el escalón.',
        'Dirección hacia atrás, nunca hacia la cara.',
        'Bigudíes finos: es donde el rizo tiene que aguantar más.'
      ]
    },
    {
      id: 'matiz', n: 'Matización', coronas: 2, sectores: 8,
      sentido: 'reloj', arranque: 'frente', orden: 'correlativo',
      tonos: ['#C7B9C9', '#E0D6E2'],
      nombres: ['Zona amarilla', 'Zona neutra'],
      notas: [
        'El violeta apaga el amarillo. Aquí se apoya más producto y se vigila cada minuto.',
        'Se pasa por encima para igualar, no se deja tiempo.'
      ]
    },
    {
      id: 'corte', n: 'Corte radial', coronas: 4, sectores: 8,
      sentido: 'reloj', arranque: 'frente', orden: 'correlativo',
      tonos: ['#5A5F6B', '#767C88', '#9299A5', '#AEB5C1'],
      nombres: ['Mecha guía', 'Primera capa', 'Segunda capa', 'Contorno'],
      notas: [
        'La primera mecha manda: todas las demás vuelven a ella.',
        'Se corta con la misma elevación en todos los sectores.',
        'Aquí se decide si el corte tiene movimiento o peso.',
        'Se comprueba de frente, con la clienta sentada recta.'
      ]
    },
    {
      id: 'visagismo', n: 'Mapa de visagismo', coronas: 3, sectores: 6,
      sentido: 'reloj', arranque: 'frente', orden: 'correlativo',
      tonos: ['#8B5E3C', '#B58A5C', '#DCC199'],
      nombres: ['Zona que enmarca', 'Zona de volumen', 'Zona de peso'],
      notas: [
        'Lo que toca la cara. Aquí se corrige la forma del rostro.',
        'Donde se levanta o se aplana según lo que el rostro pida.',
        'La que da equilibrio. En rostros alargados se deja abajo.'
      ]
    },

    /* ── Cejas ── El mandala aquí no es la cabeza desde arriba: es la ceja
       abierta en coronas (grosor) y sectores (recorrido de inicio a cola). */
    {
      id: 'cejas_tres', n: 'Cejas · tres puntos', disc: 'cejas', coronas: 3, sectores: 6,
      sentido: 'reloj', arranque: 'frente', orden: 'correlativo',
      tonos: ['#3A2419', '#6B4229', '#B58A5C'],
      nombres: ['Línea de diseño', 'Relleno', 'Difuminado'],
      notas: [
        'Los tres puntos medidos: inicio en el lagrimal, arco sobre el iris, cola en la diagonal.',
        'Se trabaja de la cola al inicio, para que el inicio quede el más claro.',
        'El borde se abre hacia fuera: nada de líneas cerradas.'
      ]
    },
    {
      id: 'cejas_depilacion', n: 'Cejas · depilación por zonas', disc: 'cejas', coronas: 2, sectores: 8,
      sentido: 'reloj', arranque: 'frente', orden: 'alterno',
      tonos: ['#6B4229', '#C79A5C'],
      nombres: ['Fuera de la línea', 'Contorno fino'],
      notas: [
        'Solo lo que queda fuera del diseño marcado. Dentro no se entra.',
        'Se alterna un lado y otro para comparar simetría antes de seguir.'
      ]
    },
    {
      id: 'cejas_tinte', n: 'Cejas · tinte por tercios', disc: 'cejas', coronas: 3, sectores: 6,
      sentido: 'reloj', arranque: 'derecha', orden: 'correlativo',
      tonos: ['#3A2419', '#5E3A24', '#8B5E3C'],
      nombres: ['Cola', 'Arco', 'Inicio'],
      notas: [
        'Se empieza por la cola: es la que más tiempo aguanta el producto.',
        'El arco recibe menos tiempo que la cola.',
        'El inicio, al final y con lo que queda: siempre el más suave.'
      ]
    },
    {
      id: 'cejas_laminado', n: 'Cejas · laminado', disc: 'cejas', coronas: 2, sectores: 6,
      sentido: 'reloj', arranque: 'frente', orden: 'correlativo',
      tonos: ['#9BA7A0', '#D2D9D3'],
      nombres: ['Alisado', 'Fijado'],
      notas: [
        'El pelo se peina hacia arriba y hacia fuera, zona a zona, sin cruzarlo.',
        'La segunda fórmula cierra la forma. Pasado el tiempo, el pelo se abre.'
      ]
    },

    /* ── Pestañas ── Coronas por longitud en milímetros, sectores por zona del
       párpado, del lagrimal al rabillo. Es el mapping puesto en rueda. */
    {
      id: 'pest_mapping', n: 'Pestañas · mapping por zonas', disc: 'pestanas', coronas: 3, sectores: 6,
      sentido: 'reloj', arranque: 'frente', orden: 'correlativo',
      tonos: ['#3A2419', '#6B4229', '#A9743F'],
      nombres: ['8–9 mm', '10–11 mm', '12–13 mm'],
      notas: [
        'Zona del lagrimal: la más corta siempre, o el ojo se cierra.',
        'Centro del párpado: la longitud de referencia.',
        'Rabillo: la máxima, y nunca más allá del hueso.'
      ]
    },
    {
      id: 'pest_gatuno', n: 'Pestañas · efecto gatuno', disc: 'pestanas', coronas: 3, sectores: 6,
      sentido: 'reloj', arranque: 'derecha', orden: 'correlativo',
      tonos: ['#4E3122', '#8B5E3C', '#C79A5C'],
      nombres: ['Interior corto', 'Transición', 'Cola larga'],
      notas: [
        'El interior se vacía: dos milímetros menos de lo que se pondría.',
        'La subida es progresiva, sin saltos de más de un milímetro.',
        'Todo el peso al exterior. Es lo que estira la mirada.'
      ]
    },
    {
      id: 'pest_volumen', n: 'Pestañas · volumen por capas', disc: 'pestanas', coronas: 4, sectores: 8,
      sentido: 'reloj', arranque: 'frente', orden: 'espiral',
      tonos: ['#3A2419', '#5E3A24', '#8B5E3C', '#C79A5C'],
      nombres: ['Capa inferior', 'Segunda capa', 'Tercera capa', 'Cierre'],
      notas: [
        'Se empieza por debajo: la capa que no se ve es la que sostiene.',
        'Cada capa se aísla. Si dos pestañas naturales se pegan, se nota al mes.',
        'El abanico se abre igual en todas: mismo número de puntas.',
        'Se cierra en espiral para revisar la simetría en cada vuelta.'
      ]
    },
    {
      id: 'pest_lifting', n: 'Pestañas · lifting por bigudí', disc: 'pestanas', coronas: 2, sectores: 6,
      sentido: 'reloj', arranque: 'frente', orden: 'correlativo',
      tonos: ['#9BA7A0', '#C7B9C9'],
      nombres: ['Fijación', 'Neutralizado'],
      notas: [
        'La pestaña se pega estirada sobre el bigudí, sin cruces ni pliegues.',
        'El neutralizante se aplica en el mismo orden y con el mismo tiempo.'
      ]
    },

    /* ── Maquillaje ── El rostro en coronas por capa de producto y sectores por
       zona, en el orden real de aplicación. */
    {
      id: 'maq_base', n: 'Maquillaje · zonas de base', disc: 'maquillaje', coronas: 3, sectores: 6,
      sentido: 'reloj', arranque: 'frente', orden: 'correlativo',
      tonos: ['#E0C39A', '#DCC7B4', '#D8C0BC'],
      nombres: ['Centro del rostro', 'Mejillas y laterales', 'Contorno y cuello'],
      notas: [
        'Se empieza en el centro, donde más cobertura hace falta, y se degrada.',
        'Se extiende hacia fuera con lo que queda en la herramienta.',
        'El contorno y el cuello se difuminan hasta que no haya línea de corte.'
      ]
    },
    {
      id: 'maq_luces', n: 'Maquillaje · luces y sombras', disc: 'maquillaje', coronas: 2, sectores: 8,
      sentido: 'reloj', arranque: 'frente', orden: 'alterno',
      tonos: ['#F0E2CB', '#8B7355'],
      nombres: ['Lo que se ilumina', 'Lo que se hunde'],
      notas: [
        'La luz va donde se quiere volumen: puente nasal, pómulo alto, arco de cupido.',
        'La sombra donde se quiere restar: sien, ángulo mandibular, laterales de la nariz.'
      ]
    },
    {
      id: 'maq_ojo', n: 'Maquillaje · sombreado del ojo', disc: 'maquillaje', coronas: 3, sectores: 6,
      sentido: 'reloj', arranque: 'derecha', orden: 'correlativo',
      tonos: ['#C7B9C9', '#9B8368', '#4E3122'],
      nombres: ['Transición', 'Color medio', 'Profundidad'],
      notas: [
        'Primero el tono de transición en la cuenca: es el que hace que nada se corte.',
        'El medio en el párpado móvil, sin pasar del pliegue.',
        'La profundidad solo en el exterior y en la línea de agua.'
      ]
    },
    {
      id: 'maq_correccion', n: 'Maquillaje · corrección por zonas', disc: 'maquillaje', coronas: 2, sectores: 6,
      sentido: 'reloj', arranque: 'frente', orden: 'alterno',
      tonos: ['#F3B428', '#3D9A55'],
      nombres: ['Corrector cálido', 'Corrector verde'],
      notas: [
        'El melocotón sobre la ojera azulada, en poca cantidad y en capas.',
        'El verde solo sobre rojez: aletas de la nariz, mentón, mejillas.'
      ]
    },

    /* ── Estudio ── Láminas sin contenido: la alumna las rellena. Son las que
       convierten el mandala en una herramienta para cualquier trabajo. */
    {
      id: 'muda', n: 'Lámina muda · para rellenar', disc: 'estudio', coronas: 3, sectores: 8,
      sentido: 'reloj', arranque: 'frente', orden: 'correlativo',
      tonos: ['#E8E2D4', '#F0EBE0', '#F7F4EC'],
      nombres: ['Corona 1', 'Corona 2', 'Corona 3'],
      notas: [
        'Escribe aquí qué se aplica en esta corona.',
        'Y aquí el porqué: la corona sin porqué no enseña nada.',
        'La última, para lo que se hace al final.'
      ]
    },
    {
      id: 'examen', n: 'Examen práctico', disc: 'estudio', coronas: 3, sectores: 12,
      sentido: 'reloj', arranque: 'frente', orden: 'correlativo',
      tonos: ['#EFEAE0', '#E4DDCE', '#D8CFBC'],
      nombres: ['Zona A', 'Zona B', 'Zona C'],
      notas: [
        'Doce sectores numerados: la alumna dice en voz alta qué hace en cada uno.',
        'Se corrige sobre la misma lámina, sin borrar el error.',
        'Al final se compara con el modelo de la técnica.'
      ]
    },
    {
      id: 'libre', n: 'Ensayo libre', disc: 'estudio', coronas: 4, sectores: 16,
      sentido: 'reloj', arranque: 'frente', orden: 'espiral',
      tonos: ['#F2EDE3', '#E6DFD1', '#DAD1BF', '#CEC3AD'],
      nombres: ['Capa 1', 'Capa 2', 'Capa 3', 'Capa 4'],
      notas: [
        'La rejilla más fina del sistema, para probar una idea propia.',
        'Cambia coronas, sectores y sentido hasta que la lámina explique tu técnica.',
        'Los tonos se editan uno a uno desde el panel.',
        'Cuando funcione, se descarga y pasa a ser material de clase.'
      ]
    }
  ];

  /* Los quince originales son de colorimetría y corte: se etiquetan aquí para
     no repetir el campo en cada uno. */
  MODELOS_MANDALA.forEach(function (m) { if (!m.disc) m.disc = 'color'; });

  /* ══ MANDALA ══
     La cabeza vista desde arriba como un mandala: coronas concéntricas por
     altura de aplicación y sectores radiales por orden de trabajo. Explica de
     un golpe de vista dónde empieza, hacia dónde gira y en qué orden se aplica.
     Todo lo que se ve aquí es editable desde el panel. */
  function laminaMandala(x, W, H, mn, f, tecnica) {
    var cor = mn.coronas, sec = mn.sectores;
    var cx = Math.round(W * 0.32), cy = Math.round(H * 0.56);
    /* El radio se limita por lo que queda entre la cabecera y el marco: los
       rótulos FRENTE y NUCA viven fuera del círculo y tienen que caber. */
    var R = Math.round(Math.min(W * 0.27, (H * 0.94 - cy) / 1.3, (cy - H * 0.16) / 1.24));

    x.save();
    x.textBaseline = 'alphabetic';

    /* Cabecera. */
    x.textAlign = 'left';
    x.font = '700 ' + Math.round(W * 0.0105) + 'px Segoe UI,Arial,sans-serif';
    x.fillStyle = '#b0873c';
    x.fillText('MANDALA DE APLICACIÓN  ·  VISTA DESDE ARRIBA', Math.round(W * 0.05), Math.round(H * 0.085));
    x.font = '700 ' + Math.round(W * 0.024) + 'px Georgia,serif';
    x.fillStyle = '#2a2318';
    var mod = null;
    for (var mi = 0; mi < MODELOS_MANDALA.length; mi++) if (MODELOS_MANDALA[mi].id === mn.modelo) mod = MODELOS_MANDALA[mi];
    x.fillText((mod ? mod.n : (tecnica || 'División radial')), Math.round(W * 0.05), Math.round(H * 0.135));
    if (mod && tecnica) {
      x.font = '600 ' + Math.round(W * 0.011) + 'px Segoe UI,Arial,sans-serif';
      x.fillStyle = '#8d7c58';
      x.fillText(tecnica, Math.round(W * 0.05), Math.round(H * 0.168));
    }

    /* Coronas, de fuera hacia dentro para que la de arriba no se coma a la de abajo. */
    var paso = R / cor;
    for (var i = cor - 1; i >= 0; i--) {
      var rf = paso * (i + 1);
      x.beginPath();
      x.arc(cx, cy, rf, 0, Math.PI * 2);
      x.fillStyle = mn.tonos[i] || '#8a6a4a';
      x.globalAlpha = 0.9;
      x.fill();
      x.globalAlpha = 1;
      x.lineWidth = 1.6;
      x.strokeStyle = 'rgba(253,250,244,.75)';
      x.stroke();
    }

    /* Sectores: los radios que la alumna traza con la punta del peine. */
    var giro = mn.sentido === 'anti' ? -1 : 1;
    var ARR = { frente: -90, nuca: 90, izquierda: 180, derecha: 0 };
    var inicio = ARR[mn.arranque] != null ? ARR[mn.arranque] : -90;
    for (var j = 0; j < sec; j++) {
      var a = (inicio + giro * j * (360 / sec)) * Math.PI / 180;
      x.beginPath();
      x.moveTo(cx, cy);
      x.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R);
      x.strokeStyle = 'rgba(253,250,244,.85)';
      x.lineWidth = 1.8;
      x.stroke();
    }

    /* Orden de trabajo: el número va en el centro de cada sector, en la corona
       de fuera, que es por donde se empieza. */
    if (mn.numerar) {
      x.textAlign = 'center';
      x.font = '700 ' + Math.round(R * 0.11) + 'px Segoe UI,Arial,sans-serif';
      var secuencia = ordenSectores(sec, mn.orden);
      for (var k = 0; k < secuencia.length; k++) {
        var am = (inicio + giro * (secuencia[k] + 0.5) * (360 / sec)) * Math.PI / 180;
        /* En espiral cada número baja una corona: así se ve que se trabaja
           hacia dentro y no dando vueltas por fuera. */
        var ci = mn.orden === 'espiral' ? (k % cor) : 0;
        var rr = R - paso * (ci + 0.5);
        var nx = cx + Math.cos(am) * rr, ny = cy + Math.sin(am) * rr;
        x.beginPath();
        x.arc(nx, ny, R * 0.075, 0, Math.PI * 2);
        x.fillStyle = 'rgba(253,250,244,.94)';
        x.fill();
        x.strokeStyle = 'rgba(176,135,60,.8)'; x.lineWidth = 1.5; x.stroke();
        x.fillStyle = '#2a2318';
        x.fillText(String(k + 1), nx, ny + R * 0.04);
      }
    }

    /* Nariz: sin esta marca nadie sabe hacia dónde mira la cabeza. */
    x.beginPath();
    x.moveTo(cx - R * 0.07, cy - R - 4);
    x.lineTo(cx, cy - R - R * 0.14);
    x.lineTo(cx + R * 0.07, cy - R - 4);
    x.closePath();
    x.fillStyle = '#2a2318';
    x.fill();
    x.textAlign = 'center';
    x.font = '700 ' + Math.round(W * 0.0092) + 'px Segoe UI,Arial,sans-serif';
    x.fillStyle = '#8d7c58';
    x.fillText('FRENTE', cx, cy - R - R * 0.2);
    x.fillText('NUCA', cx, cy + R + R * 0.24);

    /* Sentido del giro, dibujado como flecha sobre el borde. */
    var a0 = gr2(inicio + giro * 18), a1 = gr2(inicio + giro * 62);
    x.beginPath();
    x.arc(cx, cy, R + R * 0.11, giro > 0 ? a0 : a1, giro > 0 ? a1 : a0);
    x.strokeStyle = '#b0873c'; x.lineWidth = 2.4;
    x.stroke();
    var pf = { x: cx + Math.cos(a1) * (R + R * 0.11), y: cy + Math.sin(a1) * (R + R * 0.11) };
    x.save();
    x.translate(pf.x, pf.y);
    x.rotate(a1 + (giro > 0 ? Math.PI / 2 : -Math.PI / 2));
    x.beginPath();
    x.moveTo(0, 0); x.lineTo(-R * 0.045, -R * 0.055); x.lineTo(R * 0.045, -R * 0.055);
    x.closePath();
    x.fillStyle = '#b0873c'; x.fill();
    x.restore();

    /* Leyenda: la parte que enseña. Cada corona con su tono, su nombre y para
       qué sirve. */
    var lx = Math.round(W * 0.63), ly = Math.round(H * 0.2), lw = Math.round(W * 0.32);
    x.textAlign = 'left';
    x.font = '700 ' + Math.round(W * 0.0098) + 'px Segoe UI,Arial,sans-serif';
    x.fillStyle = '#b0873c';
    x.fillText('CORONAS', lx, ly);
    var fs = Math.round(W * 0.0105), y = ly + Math.round(fs * 2.2);
    for (var m2 = 0; m2 < cor; m2++) {
      var sw = Math.round(fs * 1.5);
      x.fillStyle = mn.tonos[m2] || '#8a6a4a';
      x.beginPath();
      x.arc(lx + sw / 2, y - fs * 0.35, sw / 2, 0, Math.PI * 2);
      x.fill();
      x.strokeStyle = 'rgba(176,135,60,.55)'; x.lineWidth = 1.2; x.stroke();
      x.fillStyle = '#2a2318';
      x.font = '600 ' + fs + 'px Segoe UI,Arial,sans-serif';
      x.fillText((m2 + 1) + '.  ' + (mn.nombres[m2] || 'Corona ' + (m2 + 1)), lx + sw + 10, y);
      var nota = mn.notas[m2] || '';
      if (nota) {
        x.font = Math.round(fs * 0.88) + 'px Segoe UI,Arial,sans-serif';
        x.fillStyle = '#6b6152';
        var lin = [], ln = '';
        nota.split(' ').forEach(function (pz) {
          var t = ln ? ln + ' ' + pz : pz;
          if (x.measureText(t).width > lw - sw - 10 && ln) { lin.push(ln); ln = pz; } else ln = t;
        });
        if (ln) lin.push(ln);
        lin.slice(0, 2).forEach(function (l, ii) {
          x.fillText(l, lx + sw + 10, y + Math.round(fs * 1.25) * (ii + 1));
        });
        y += Math.round(fs * 1.25) * Math.min(lin.length, 2);
      }
      y += Math.round(fs * 2.1);
    }

    /* Cómo se lee el mandala: la frase que convierte el dibujo en clase. */
    x.font = '700 ' + Math.round(W * 0.0098) + 'px Segoe UI,Arial,sans-serif';
    x.fillStyle = '#b0873c';
    x.fillText('CÓMO SE LEE', lx, y + Math.round(fs * 0.6));
    x.font = Math.round(fs * 0.92) + 'px Segoe UI,Arial,sans-serif';
    x.fillStyle = '#5a5040';
    var DESDE = { frente: 'desde la frente', nuca: 'desde la nuca', izquierda: 'desde el lateral izquierdo', derecha: 'desde el lateral derecho' };
    var MODO = {
      correlativo: 'Se avanza de un sector al vecino, sin saltarse ninguno: el tiempo de exposición queda igualado en toda la cabeza.',
      alterno: 'El orden salta al sector opuesto para que dos aplicaciones contiguas no se toquen en húmedo.',
      espiral: 'La numeración cierra hacia dentro: cada vuelta baja una corona, y así la luz se reparte sin dejar bandas.'
    };
    var expl = sec + ' sectores ' + (DESDE[mn.arranque] || DESDE.frente) + ', ' +
      (giro > 0 ? 'en el sentido del reloj' : 'contra el reloj') + ', y ' + cor +
      ' coronas de fuera hacia dentro. ' + (MODO[mn.orden] || MODO.correlativo);
    var yl = y + Math.round(fs * 2.2), lin2 = [], ln2 = '';
    expl.split(' ').forEach(function (pz) {
      var t = ln2 ? ln2 + ' ' + pz : pz;
      if (x.measureText(t).width > lw && ln2) { lin2.push(ln2); ln2 = pz; } else ln2 = t;
    });
    if (ln2) lin2.push(ln2);
    lin2.forEach(function (l) { x.fillText(l, lx, yl); yl += Math.round(fs * 1.35); });

    var firma = [f && f.negocio, f && f.alumna, f && f.fecha].filter(Boolean).join('  ·  ');
    if (firma) {
      x.textAlign = 'right';
      x.font = '600 ' + Math.round(W * 0.0098) + 'px Segoe UI,Arial,sans-serif';
      x.fillStyle = '#8d7c58';
      x.fillText(firma, W - Math.round(W * 0.05), Math.round(H * 0.085));
    }
    x.restore();
  }

  function gr2(a) { return a * Math.PI / 180; }

  /* Cabecera común de las láminas conceptuales. */
  function cabConcepto(x, W, H, kicker, titulo, firma) {
    x.textAlign = 'left';
    x.textBaseline = 'alphabetic';
    x.font = '700 ' + Math.round(W * 0.0105) + 'px Segoe UI,Arial,sans-serif';
    x.fillStyle = '#b0873c';
    x.fillText(kicker, Math.round(W * 0.05), Math.round(H * 0.085));
    x.font = '700 ' + Math.round(W * 0.026) + 'px Georgia,serif';
    x.fillStyle = '#2a2318';
    x.fillText(titulo, Math.round(W * 0.05), Math.round(H * 0.135));
    if (firma) {
      x.textAlign = 'right';
      x.font = '600 ' + Math.round(W * 0.0098) + 'px Segoe UI,Arial,sans-serif';
      x.fillStyle = '#8d7c58';
      x.fillText(firma, W - Math.round(W * 0.05), Math.round(H * 0.085));
      x.textAlign = 'left';
    }
  }

  /* Párrafo de cierre: la frase que convierte el dibujo en clase. */
  function pieConcepto(x, W, H, txt) {
    var m = Math.round(W * 0.05), fs = Math.round(W * 0.0108);
    x.font = fs + 'px Segoe UI,Arial,sans-serif';
    x.fillStyle = '#5a5040';
    x.textAlign = 'left';
    var w = W - m * 2, lin = [], ln = '';
    txt.split(' ').forEach(function (pz) {
      var t = ln ? ln + ' ' + pz : pz;
      if (x.measureText(t).width > w && ln) { lin.push(ln); ln = pz; } else ln = t;
    });
    if (ln) lin.push(ln);
    var y = H - Math.round(H * 0.055) - (lin.length - 1) * Math.round(fs * 1.4);
    lin.forEach(function (l) { x.fillText(l, m, y); y += Math.round(fs * 1.4); });
  }

  function laminaConcepto(x, W, H, id, f) {
    var m = Math.round(W * 0.05);
    var firma = [f && f.negocio, f && f.alumna].filter(Boolean).join('  ·  ');
    x.save();

    /* Primero las láminas declaradas como datos: si la ficha trae 'tipo', la
       pinta el motor genérico y no hace falta código propio. */
    var dat = null;
    for (var ci = 0; ci < CONCEPTUALES.length; ci++) if (CONCEPTUALES[ci].id === id) dat = CONCEPTUALES[ci];
    if (dat && dat.tipo === 'tabla') { conceptoTabla(x, W, H, dat, firma); x.restore(); return; }
    if (dat && dat.tipo === 'escala') { conceptoEscala(x, W, H, dat, firma); x.restore(); return; }

    if (id === 'neutro') {
      cabConcepto(x, W, H, 'TEORÍA DEL COLOR  ·  QUÉ APAGA QUÉ', 'Neutralización', firma);
      var pw = W - m * 2, ph = Math.round(H * 0.15), gap = Math.round(H * 0.035);
      PARES_NEUTRO.forEach(function (pr, i) {
        var y = Math.round(H * 0.21) + i * (ph + gap);
        var lado = Math.round(pw * 0.26);
        x.fillStyle = pr.ca;
        x.fillRect(m, y, lado, ph);
        x.fillStyle = pr.cb;
        x.fillRect(m + pw - lado, y, lado, ph);
        x.strokeStyle = 'rgba(176,135,60,.5)'; x.lineWidth = 1.4;
        x.strokeRect(m + 0.5, y + 0.5, lado, ph);
        x.strokeRect(m + pw - lado + 0.5, y + 0.5, lado, ph);
        x.textAlign = 'center';
        x.font = '700 ' + Math.round(W * 0.0125) + 'px Segoe UI,Arial,sans-serif';
        x.fillStyle = '#fdfaf4';
        x.fillText(pr.a.toUpperCase(), m + lado / 2, y + ph / 2 + 5);
        x.fillText(pr.b.toUpperCase(), m + pw - lado / 2, y + ph / 2 + 5);
        /* La flecha del centro: el segundo color va contra el primero. */
        var ax = m + lado + 24, bx = m + pw - lado - 24, my = y + ph / 2;
        x.strokeStyle = '#b0873c'; x.lineWidth = 2.2;
        x.beginPath(); x.moveTo(bx, my); x.lineTo(ax + 12, my); x.stroke();
        x.beginPath();
        x.moveTo(ax, my); x.lineTo(ax + 14, my - 7); x.lineTo(ax + 14, my + 7);
        x.closePath(); x.fillStyle = '#b0873c'; x.fill();
        x.font = Math.round(W * 0.0105) + 'px Segoe UI,Arial,sans-serif';
        x.fillStyle = '#5a5040';
        x.fillText(pr.txt, (ax + bx) / 2, my - 16);
      });
      pieConcepto(x, W, H, 'Colores opuestos en la rueda se anulan. Para bajar un reflejo se aplica su contrario en pequeña cantidad: de más a menos, porque quitar es fácil y devolver no.');
      x.restore(); return;
    }

    if (id === 'rueda') {
      cabConcepto(x, W, H, 'TEORÍA DEL COLOR  ·  DOCE SECTORES', 'Rueda cromática', firma);
      var cx = Math.round(W * 0.32), cy = Math.round(H * 0.56);
      var R = Math.round(Math.min(W * 0.24, (H * 0.9 - cy) / 1.05, (cy - H * 0.19)));
      RUEDA.forEach(function (s2, i) {
        var a0 = gr2(-90 + i * 30), a1 = gr2(-90 + (i + 1) * 30);
        x.beginPath();
        x.moveTo(cx, cy);
        x.arc(cx, cy, R, a0, a1);
        x.closePath();
        x.fillStyle = s2.c; x.fill();
        x.strokeStyle = 'rgba(253,250,244,.85)'; x.lineWidth = 1.6; x.stroke();
      });
      x.beginPath(); x.arc(cx, cy, R * 0.34, 0, Math.PI * 2);
      x.fillStyle = '#fdfaf4'; x.fill();
      x.strokeStyle = 'rgba(176,135,60,.6)'; x.lineWidth = 1.5; x.stroke();
      /* El eje que enseña: amarillo contra violeta, los que más se usan. */
      x.save();
      x.setLineDash([7, 6]);
      x.strokeStyle = '#2a2318'; x.lineWidth = 2;
      x.beginPath();
      x.moveTo(cx + Math.cos(gr2(-75)) * R, cy + Math.sin(gr2(-75)) * R);
      x.lineTo(cx + Math.cos(gr2(105)) * R, cy + Math.sin(gr2(105)) * R);
      x.stroke();
      x.restore();
      x.textAlign = 'center';
      x.font = '700 ' + Math.round(W * 0.011) + 'px Segoe UI,Arial,sans-serif';
      x.fillStyle = '#2a2318';
      x.fillText('EJE', cx, cy - 2);
      x.font = Math.round(W * 0.0088) + 'px Segoe UI,Arial,sans-serif';
      x.fillStyle = '#6b6152';
      x.fillText('opuestos', cx, cy + Math.round(W * 0.014));
      /* Leyenda de los doce. */
      var lx = Math.round(W * 0.62), fs = Math.round(W * 0.0098);
      var y2 = Math.round(H * 0.215);
      x.textAlign = 'left';
      RUEDA.forEach(function (s2, i) {
        var yy = y2 + i * Math.round(fs * 2.1);
        x.fillStyle = s2.c;
        x.beginPath(); x.arc(lx + fs * 0.7, yy - fs * 0.35, fs * 0.7, 0, Math.PI * 2); x.fill();
        x.strokeStyle = 'rgba(176,135,60,.5)'; x.lineWidth = 1; x.stroke();
        x.font = '600 ' + fs + 'px Segoe UI,Arial,sans-serif';
        x.fillStyle = '#2a2318';
        x.fillText(s2.n, lx + fs * 2.2, yy);
        x.font = fs * 0.9 + 'px Segoe UI,Arial,sans-serif';
        x.fillStyle = '#8d7c58';
        x.textAlign = 'right';
        x.fillText('↔ ' + RUEDA[(i + 6) % 12].n, W - m, yy);
        x.textAlign = 'left';
      });
      pieConcepto(x, W, H, 'Cada color tiene enfrente el que lo anula. La columna de la derecha da la pareja: eso es todo lo que hace falta saber para corregir un reflejo.');
      x.restore(); return;
    }

    if (id === 'alturas' || id === 'fondos') {
      var esF = id === 'fondos';
      cabConcepto(x, W, H,
        esF ? 'DECOLORACIÓN  ·  LO QUE APARECE AL LEVANTAR' : 'COLORIMETRÍA  ·  DEL 1 AL 10',
        esF ? 'Fondos de decoloración' : 'Escala de alturas', firma);
      var n = ALTURAS.length, gap2 = 6;
      var anc = Math.round((W - m * 2 - gap2 * (n - 1)) / n);
      var top = Math.round(H * 0.22), alt = Math.round(H * 0.34);
      ALTURAS.forEach(function (a, i) {
        var px = m + i * (anc + gap2);
        x.fillStyle = a.c;
        x.fillRect(px, top, anc, alt);
        x.strokeStyle = 'rgba(176,135,60,.45)'; x.lineWidth = 1;
        x.strokeRect(px + 0.5, top + 0.5, anc, alt);
        x.textAlign = 'center';
        x.font = '700 ' + Math.round(W * 0.016) + 'px Georgia,serif';
        x.fillStyle = a.n >= 8 ? '#2a2318' : '#fdfaf4';
        x.fillText(String(a.n), px + anc / 2, top + Math.round(alt * 0.55));
        x.font = '600 ' + Math.round(W * 0.0082) + 'px Segoe UI,Arial,sans-serif';
        x.fillStyle = '#5a5040';
        var pal = a.t.split(' ');
        pal.forEach(function (pz, k) {
          x.fillText(pz, px + anc / 2, top + alt + 18 + k * Math.round(W * 0.011));
        });
        if (esF) {
          var yf = top + alt + Math.round(H * 0.13);
          x.fillStyle = '#b0873c';
          x.beginPath();
          x.moveTo(px + anc / 2, yf - 16); x.lineTo(px + anc / 2 - 5, yf - 26); x.lineTo(px + anc / 2 + 5, yf - 26);
          x.closePath(); x.fill();
          x.font = '600 ' + Math.round(W * 0.0082) + 'px Segoe UI,Arial,sans-serif';
          x.fillStyle = '#2a2318';
          a.f.split(' ').forEach(function (pz, k) {
            x.fillText(pz, px + anc / 2, yf + k * Math.round(W * 0.011));
          });
        }
      });
      pieConcepto(x, W, H, esF
        ? 'Al aclarar no aparece el color que se quiere, aparece el pigmento que había debajo. Se levanta hasta el fondo que corresponde y solo entonces se matiza: matizar antes de tiempo es tirar producto.'
        : 'La altura es cuánta luz tiene el cabello, no el reflejo. Cada escalón es un nivel: subir dos o más pide decolorante, no tinte.');
      x.restore(); return;
    }

    if (id === 'oxidante') {
      cabConcepto(x, W, H, 'QUÍMICA  ·  CUÁNTO LEVANTA CADA UNO', 'Volúmenes de oxidante', firma);
      var top2 = Math.round(H * 0.22), fila = Math.round(H * 0.135);
      OXIDANTES.forEach(function (o, i) {
        var y = top2 + i * fila;
        x.textAlign = 'left';
        x.font = '700 ' + Math.round(W * 0.019) + 'px Georgia,serif';
        x.fillStyle = '#2a2318';
        x.fillText(o.v, m, y + Math.round(W * 0.014));
        x.font = '600 ' + Math.round(W * 0.0098) + 'px Segoe UI,Arial,sans-serif';
        x.fillStyle = '#8d7c58';
        x.fillText(o.p, m, y + Math.round(W * 0.029));
        /* Barra de escalones: uno por nivel que levanta. */
        var bx = m + Math.round(W * 0.09), bw = Math.round(W * 0.035), bh = Math.round(H * 0.055);
        for (var k = 0; k < 4; k++) {
          var lleno = k < o.s;
          x.fillStyle = lleno ? ['#8B5E3C', '#A9743F', '#C79A5C', '#DEC08A'][k] : 'rgba(176,135,60,.12)';
          x.fillRect(bx + k * (bw + 6), y, bw, bh);
          x.strokeStyle = 'rgba(176,135,60,.5)'; x.lineWidth = 1;
          x.strokeRect(bx + k * (bw + 6) + 0.5, y + 0.5, bw, bh);
        }
        x.font = '600 ' + Math.round(W * 0.0095) + 'px Segoe UI,Arial,sans-serif';
        x.fillStyle = '#b0873c';
        x.fillText(o.s + (o.s > 1 ? ' niveles' : ' nivel'), bx, y + bh + Math.round(W * 0.014));
        x.font = Math.round(W * 0.0105) + 'px Segoe UI,Arial,sans-serif';
        x.fillStyle = '#5a5040';
        x.fillText(o.u, bx + Math.round(W * 0.19), y + Math.round(W * 0.021));
      });
      pieConcepto(x, W, H, 'El volumen no es potencia, es cuántos niveles abre la cutícula. Más volumen del necesario no aclara mejor: rompe antes y el color se va en tres lavados.');
      x.restore(); return;
    }

    if (id === 'ph') {
      cabConcepto(x, W, H, 'QUÍMICA  ·  ÁCIDO Y ALCALINO', 'Escala de pH', firma);
      var bx2 = m, bw2 = W - m * 2, by = Math.round(H * 0.28), bh2 = Math.round(H * 0.09);
      var g = x.createLinearGradient(bx2, 0, bx2 + bw2, 0);
      g.addColorStop(0, '#C9302C'); g.addColorStop(0.35, '#EC8B24');
      g.addColorStop(0.5, '#3D9A55'); g.addColorStop(0.72, '#2E6FB0');
      g.addColorStop(1, '#6E3E93');
      x.fillStyle = g;
      x.fillRect(bx2, by, bw2, bh2);
      x.strokeStyle = 'rgba(176,135,60,.55)'; x.lineWidth = 1.4;
      x.strokeRect(bx2 + 0.5, by + 0.5, bw2, bh2);
      ESCALA_PH.forEach(function (e, i) {
        var t = (parseFloat(e.v.replace(',', '.')) - 3) / 8.5;
        var px = bx2 + bw2 * Math.max(0, Math.min(1, t));
        x.strokeStyle = '#2a2318'; x.lineWidth = 2;
        x.beginPath(); x.moveTo(px, by - 10); x.lineTo(px, by + bh2 + 10); x.stroke();
        var arriba = i % 2 === 0;
        x.textAlign = 'center';
        x.font = '700 ' + Math.round(W * 0.0125) + 'px Georgia,serif';
        x.fillStyle = '#2a2318';
        x.fillText(e.v, px, arriba ? by - 22 : by + bh2 + Math.round(W * 0.023));
        x.font = '600 ' + Math.round(W * 0.0092) + 'px Segoe UI,Arial,sans-serif';
        x.fillStyle = '#6b6152';
        x.fillText(e.n, px, arriba ? by - 40 : by + bh2 + Math.round(W * 0.036));
      });
      x.textAlign = 'left';
      x.font = '700 ' + Math.round(W * 0.0098) + 'px Segoe UI,Arial,sans-serif';
      x.fillStyle = '#b0873c';
      x.fillText('ÁCIDO  ·  CIERRA LA CUTÍCULA', m, Math.round(H * 0.71));
      x.textAlign = 'right';
      x.fillText('ALCALINO  ·  LA ABRE', W - m, Math.round(H * 0.71));
      pieConcepto(x, W, H, 'Toda la química abre la cutícula y todo cierre la devuelve a su sitio. Después de un tinte o una decoloración, un producto ácido: sin ese paso el color se escapa.');
      x.restore(); return;
    }

    if (id === 'dano') {
      cabConcepto(x, W, H, 'DIAGNÓSTICO  ·  QUÉ SE PUEDE HACER Y QUÉ NO', 'Estado del cabello', firma);
      var top3 = Math.round(H * 0.22), fila2 = Math.round(H * 0.105);
      DANO.forEach(function (d, i) {
        var y = top3 + i * fila2;
        var lado = Math.round(H * 0.055);
        x.fillStyle = d.c;
        x.fillRect(m, y, lado, lado);
        x.strokeStyle = 'rgba(176,135,60,.5)'; x.lineWidth = 1;
        x.strokeRect(m + 0.5, y + 0.5, lado, lado);
        x.textAlign = 'left';
        x.font = '700 ' + Math.round(W * 0.014) + 'px Georgia,serif';
        x.fillStyle = '#2a2318';
        x.fillText(d.n, m + lado + 18, y + Math.round(lado * 0.45));
        x.font = Math.round(W * 0.0105) + 'px Segoe UI,Arial,sans-serif';
        x.fillStyle = '#5a5040';
        x.fillText(d.d, m + lado + 18, y + Math.round(lado * 0.9));
        /* Barra de riesgo: cinco pasos, se llena según el estado. */
        var rx = W - m - Math.round(W * 0.14);
        for (var k = 0; k <= 4; k++) {
          x.fillStyle = k <= i ? d.c : 'rgba(176,135,60,.13)';
          x.fillRect(rx + k * Math.round(W * 0.028), y + Math.round(lado * 0.2), Math.round(W * 0.021), Math.round(lado * 0.5));
        }
      });
      pieConcepto(x, W, H, 'El diagnóstico manda sobre la fórmula. Un cabello poroso con la fórmula del sano da un tono que no se pidió, y uno roto no se arregla con química: se corta.');
      x.restore(); return;
    }

    x.restore();
  }

  /* El orden en que se numeran los sectores es parte de la enseñanza:
     correlativo se avanza vecino a vecino, alterno salta al opuesto para que
     dos tonos no se toquen, y espiral va cerrando hacia dentro. */
  function ordenSectores(sec, modo) {
    var i, r = [];
    if (modo === 'alterno') {
      var mitad = Math.ceil(sec / 2);
      for (i = 0; i < mitad; i++) {
        r.push(i);
        if (i + mitad < sec) r.push(i + mitad);
      }
      return r;
    }
    for (i = 0; i < sec; i++) r.push(i);
    return r;
  }

  function cabeza(x, cx, cy, r, op) {
    op = op || {};
    var rx = r, ry = r * 1.22;
    x.save();

    // hombros y cuello
    x.fillStyle = '#e3d6bd';
    x.beginPath();
    x.moveTo(cx - r * 0.40, cy + ry * 0.86);
    x.lineTo(cx - r * 0.34, cy + ry * 1.26);
    x.quadraticCurveTo(cx - r * 1.75, cy + ry * 1.40, cx - r * 2.0, cy + ry * 2.1);
    x.lineTo(cx + r * 2.0, cy + ry * 2.1);
    x.quadraticCurveTo(cx + r * 1.75, cy + ry * 1.40, cx + r * 0.34, cy + ry * 1.26);
    x.lineTo(cx + r * 0.40, cy + ry * 0.86);
    x.closePath(); x.fill();
    x.strokeStyle = 'rgba(122,102,58,.40)'; x.lineWidth = 1.2; x.stroke();

    // óvalo de la cara
    var g = x.createLinearGradient(cx - rx, cy - ry, cx + rx, cy + ry);
    g.addColorStop(0, '#d9c8a8'); g.addColorStop(1, '#f6efe1');
    x.fillStyle = op.piel || g;
    x.beginPath();
    x.moveTo(cx, cy - ry);
    x.bezierCurveTo(cx + rx, cy - ry, cx + rx * 1.02, cy + ry * 0.30, cx + rx * 0.62, cy + ry * 0.72);
    x.quadraticCurveTo(cx, cy + ry * 1.06, cx - rx * 0.62, cy + ry * 0.72);
    x.bezierCurveTo(cx - rx * 1.02, cy + ry * 0.30, cx - rx, cy - ry, cx, cy - ry);
    x.closePath(); x.fill();
    x.strokeStyle = 'rgba(90,70,40,.55)'; x.lineWidth = 1.5; x.stroke();
    x.restore();
    return { rx: rx, ry: ry };
  }

  /* ═══════════════════ 1 · COLORIMETRÍA ═══════════════════
     Mechones que se pintan desde la raíz. La técnica decide dónde
     empieza el color y cómo funde.                                */

  function mechones(cx, cy, r, n) {
    var out = [];
    for (var i = 0; i < n; i++) {
      var u = n === 1 ? 0.5 : i / (n - 1);
      var ang = lerp(-Math.PI * 0.92, -Math.PI * 0.08, u);
      var p0 = { x: cx + Math.cos(ang) * r * 0.98, y: cy + Math.sin(ang) * r * 1.16 };
      var caida = r * (1.95 + Math.sin(u * Math.PI) * 0.50);
      var lado = (u - 0.5) * 2;
      var sgn = lado < 0 ? -1 : 1;
      /* Aunque el mechón nazca en la coronilla, cae por fuera del óvalo de la
         cara: si no, el pelo pintado tapaba el rostro y no se leía nada. */
      var ancho = (0.80 + Math.abs(lado) * 0.60) * r * 1.22;
      var p2 = { x: cx + sgn * ancho, y: p0.y + caida };
      var p1 = { x: cx + sgn * ancho * 1.10, y: p0.y + caida * 0.40 };
      out.push({ p0: p0, p1: p1, p2: p2, u: u });
    }
    return out;
  }

  /* ─────────────────── divisiones del maniquí ───────────────────
     Las líneas de trabajo de la técnica, no un adorno: cada una viene del
     catálogo del Cerebro con su nombre de oficio, y se trazan en orden. */
  function dibujarDivisiones(x, cx, cy, r, divs, p) {
    if (!divs || !divs.length || p <= 0) return;
    var yt = cy - r * 1.22, yb = cy + r * 1.62;
    var xi = cx - r * 1.20, xd = cx + r * 1.20;
    var lineas = divs.filter(function (d) { return d.tipo === 'h' || d.tipo === 'v' || d.tipo === 'd'; });
    x.save();
    x.lineWidth = 1.5;
    x.font = '700 11px Segoe UI,Arial,sans-serif';
    x.textBaseline = 'middle';
    lineas.forEach(function (d, j) {
      var pp = clamp((p - j * 0.16) / 0.7, 0, 1);
      if (pp <= 0) return;
      var col = d.tipo === 'h' ? 'rgba(6,182,212,' : (d.tipo === 'v' ? 'rgba(168,85,247,' : 'rgba(255,214,102,');
      x.strokeStyle = col + (0.85 * pp) + ')';
      x.setLineDash([8, 6]);
      x.beginPath();
      var ax, ay, bx, by;
      if (d.tipo === 'h') {
        ay = by = lerp(yt, yb, d.y == null ? 0.5 : d.y);
        ax = xi; bx = lerp(xi, xd, pp);
      } else if (d.tipo === 'v') {
        ax = bx = lerp(xi, xd, d.x == null ? 0.5 : d.x);
        ay = yt; by = lerp(yt, yb, pp);
      } else {
        var k = d.k || 1;
        ax = xi; ay = k > 0 ? yt + r * 0.30 : yb - r * 0.30;
        bx = lerp(xi, xd, pp);
        by = lerp(ay, k > 0 ? yb - r * 0.10 : yt + r * 0.10, pp);
      }
      x.moveTo(ax, ay); x.lineTo(bx, by); x.stroke();
      x.setLineDash([]);
      if (pp > 0.75) {
        x.globalAlpha = (pp - 0.75) / 0.25;
        x.fillStyle = col + '1)';
        x.textAlign = d.tipo === 'v' ? 'center' : 'left';
        if (d.tipo === 'v') x.fillText(d.n, bx, yt - 10);
        else x.fillText(d.n, bx + 8, by);
        x.globalAlpha = 1;
      }
    });
    x.restore();
  }

  /* El listado completo, zonas incluidas: es el mapa que la alumna copia. */
  function cartaDivisiones(x, W, H, divs, p) {
    if (!divs || !divs.length || p <= 0) return;
    var px = W * 0.66, pw = W * 0.30;
    var fil = divs.slice(0, 7);
    var h = 34 + fil.length * 19 + 10;
    var py = H * 0.62;
    x.save();
    x.globalAlpha = clamp(p, 0, 1);
    tarjeta(x, px, py, pw, h, 'Divisiones');
    x.textAlign = 'left'; x.textBaseline = 'middle';
    fil.forEach(function (d, j) {
      var yy = py + 44 + j * 19;
      x.fillStyle = d.tipo === 'h' ? '#0e7d8f' : (d.tipo === 'v' ? '#b0873c' : (d.tipo === 'd' ? '#a8791f' : '#8d7c58'));
      x.beginPath(); x.arc(px + 18, yy, 3.2, 0, Math.PI * 2); x.fill();
      x.font = '600 12px Segoe UI,Arial,sans-serif';
      x.fillStyle = '#2a2318';
      x.fillText(d.n, px + 30, yy);
    });
    x.restore();
  }

  /* La tabla de balayage: el mechón apoyado y el pincel barriendo desde el
     arranque hacia la punta. Es el gesto que no se ve en la cabeza. */
  function tablaBalayage(x, W, H, t, cfg) {
    var p = clamp((t - 0.18) / 0.58, 0, 1);
    if (p <= 0) return;
    var bx = W * 0.30, by = H * 0.80, L = Math.min(W, H) * 0.34, an = L * 0.30;
    var desde = cfg.desde != null ? cfg.desde : 0.42;
    x.save();
    x.translate(bx, by); x.rotate(-18 * Math.PI / 180);
    x.globalAlpha = clamp(p * 3, 0, 1);

    /* la tabla */
    x.fillStyle = '#26262c';
    x.strokeStyle = 'rgba(176,135,60,.45)'; x.lineWidth = 1.2;
    x.beginPath();
    x.moveTo(-L * 0.52, -an * 0.5);
    x.lineTo(L * 0.40, -an * 0.34);
    x.lineTo(L * 0.52, an * 0.20);
    x.lineTo(-L * 0.52, an * 0.5);
    x.closePath(); x.fill(); x.stroke();

    /* el mechón, raíz a la izquierda y punta a la derecha */
    var hebras = 9;
    for (var i = 0; i < hebras; i++) {
      var u = i / (hebras - 1), yy = lerp(-an * 0.34, an * 0.34, u);
      x.strokeStyle = '#2E211C'; x.lineWidth = an * 0.075; x.lineCap = 'round';
      x.beginPath();
      x.moveTo(-L * 0.46, yy * 0.55);
      x.quadraticCurveTo(0, yy * 0.9, L * 0.44, yy);
      x.stroke();
    }

    /* el producto: entra en el arranque y avanza hacia la punta */
    var x0 = lerp(-L * 0.46, L * 0.44, clamp(desde, 0, 1));
    var frente = lerp(x0, L * 0.44, p);
    x.save();
    x.beginPath(); x.rect(x0, -an * 0.6, frente - x0, an * 1.2); x.clip();
    for (var j = 0; j < hebras; j++) {
      var v = j / (hebras - 1), y2 = lerp(-an * 0.34, an * 0.34, v);
      var g = x.createLinearGradient(x0, 0, L * 0.44, 0);
      g.addColorStop(0, 'rgba(214,196,166,0)');
      g.addColorStop(0.35, 'rgba(226,209,176,.85)');
      g.addColorStop(1, '#efe2c8');
      x.strokeStyle = g; x.lineWidth = an * 0.085; x.lineCap = 'round';
      x.beginPath();
      x.moveTo(-L * 0.46, y2 * 0.55);
      x.quadraticCurveTo(0, y2 * 0.9, L * 0.44, y2);
      x.stroke();
    }
    x.restore();

    /* el pincel, en el borde del barrido */
    x.save();
    x.translate(frente, -an * 0.72);
    x.rotate(26 * Math.PI / 180);
    x.fillStyle = '#1c1c22';
    x.fillRect(-an * 0.07, -L * 0.30, an * 0.14, L * 0.30);
    x.fillStyle = '#3a3a44';
    x.beginPath();
    x.moveTo(-an * 0.16, 0); x.lineTo(an * 0.16, 0);
    x.lineTo(an * 0.11, an * 0.30); x.lineTo(-an * 0.11, an * 0.30);
    x.closePath(); x.fill();
    x.restore();

    /* el arranque, rotulado */
    x.setLineDash([5, 4]);
    x.strokeStyle = '#b0873c'; x.lineWidth = 1.4;
    x.beginPath(); x.moveTo(x0, -an * 0.62); x.lineTo(x0, an * 0.62); x.stroke();
    x.setLineDash([]);
    x.restore();

    x.save();
    x.font = '700 11px Segoe UI,Arial,sans-serif';
    x.fillStyle = '#a8791f'; x.textAlign = 'center'; x.textBaseline = 'alphabetic';
    x.fillText('TABLA · ARRANQUE ' + Math.round(desde * 100) + '%', bx, by + L * 0.30);
    x.restore();
  }

  function escenaColor(x, W, H, t, cfg) {
    var cx = W * 0.36, cy = H * 0.40, r = Math.min(W, H) * 0.20;

    // fondo del pelo: masa oscura detrás de la cabeza
    x.save();
    x.fillStyle = '#241a19';
    x.beginPath();
    x.ellipse(cx, cy + r * 0.22, r * 1.20, r * 1.52, 0, 0, Math.PI * 2);
    x.fill();
    x.restore();

    cabeza(x, cx, cy, r);

    var ms = mechones(cx, cy, r, 17);
    var base = '#2E211C';

    /* 1 · particiones: las de esta técnica, con su nombre, antes de tocar
       el producto. Vienen del Cerebro; no son las mismas para todo. */
    var pPart = clamp(t / 0.20, 0, 1);
    if (cfg.divs && cfg.divs.length) dibujarDivisiones(x, cx, cy, r, cfg.divs, pPart);
    else if (pPart > 0) {
      x.save();
      x.strokeStyle = 'rgba(122,102,58,.42)';
      x.setLineDash([7, 6]); x.lineWidth = 1.4;
      [0.30, 0.62].forEach(function (k, j) {
        var yy = cy + r * (0.55 + j * 1.05);
        var w = r * 1.36 * (1 - j * 0.12);
        var pp = clamp((pPart - j * 0.25) / 0.75, 0, 1);
        x.beginPath();
        x.moveTo(cx - w, yy);
        x.lineTo(cx - w + w * 2 * pp, yy);
        x.stroke();
      });
      x.setLineDash([]);
      x.restore();
    }

    // 2 · el pelo sin pintar
    x.save();
    x.lineCap = 'round';
    ms.forEach(function (m) {
      x.strokeStyle = base; x.lineWidth = r * 0.115;
      x.beginPath(); x.moveTo(m.p0.x, m.p0.y);
      x.quadraticCurveTo(m.p1.x, m.p1.y, m.p2.x, m.p2.y);
      x.stroke();
    });
    x.restore();

    /* 3 · la aplicación: cada mechón se pinta de raíz a puntas. La técnica
       decide desde dónde entra el color y cuánto funde. */
    var tec = cfg.modo || cfg.tecnica;
    var desde = cfg.desde != null ? cfg.desde
      : (tec === 'balayage' ? 0.42 : (tec === 'sombre' ? 0.22 : 0));
    if (tec !== 'balayage' && tec !== 'sombre' && cfg.desde == null) desde = 0;
    var hasta = tec === 'raiz' ? 0.26 : 1;
    var fase = clamp((t - 0.16) / 0.56, 0, 1);
    var activo = -1;

    x.save();
    x.lineCap = 'round';
    ms.forEach(function (m, i) {
      var orden = Math.abs(m.u - 0.5) * 2;            // de la nuca hacia la cara
      var pm = clamp((fase - orden * 0.35) / 0.62, 0, 1);
      if (pm <= 0) return;
      if (pm < 1 && activo < 0) activo = i;
      if (tec === 'babylights' && i % 2) pm = pm * 0.75;

      var pasos = 26;
      for (var k = 0; k < pasos; k++) {
        var t0 = k / pasos, t1 = (k + 1) / pasos;
        var rel = lerp(desde, hasta, t0);
        if (t0 > pm) break;
        if (rel < desde) continue;
        var a = qp(m.p0, m.p1, m.p2, lerp(desde, hasta, t0));
        var b = qp(m.p0, m.p1, m.p2, lerp(desde, hasta, Math.min(1, t1)));
        var col;
        if (t0 < 0.30) col = mezcla(cfg.raiz, cfg.medios, t0 / 0.30);
        else if (t0 < 0.70) col = mezcla(cfg.medios, cfg.puntas, (t0 - 0.30) / 0.40);
        else col = cfg.puntas;
        if (tec === 'sombre' && t0 < 0.22) col = mezcla(base, col, t0 / 0.22);
        x.strokeStyle = col;
        x.lineWidth = r * (tec === 'babylights' ? 0.06 : 0.105);
        x.beginPath(); x.moveTo(a.x, a.y); x.lineTo(b.x, b.y); x.stroke();
      }

      // el pincel, justo en el punto donde está entrando el color
      if (pm < 1 && pm > 0.02 && i === activo) {
        var pt = qp(m.p0, m.p1, m.p2, lerp(desde, hasta, pm));
        x.save();
        x.translate(pt.x, pt.y);
        x.rotate(0.5);
        x.fillStyle = '#2a2318';
        x.fillRect(-4, -34, 8, 26);
        x.fillStyle = cfg.medios;
        x.beginPath(); x.moveTo(-7, -10); x.lineTo(7, -10); x.lineTo(0, 9); x.closePath(); x.fill();
        x.restore();
      }
    });
    x.restore();

    // 4 · tiempo de exposición
    var pExp = clamp((t - 0.74) / 0.26, 0, 1);
    if (pExp > 0) {
      var ox = W * 0.36, oy = H * 0.90, rad = 26;
      x.save();
      x.lineWidth = 5;
      x.strokeStyle = 'rgba(122,102,58,.16)';
      x.beginPath(); x.arc(ox, oy, rad, 0, Math.PI * 2); x.stroke();
      x.strokeStyle = '#0a5664';
      x.beginPath(); x.arc(ox, oy, rad, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * pExp); x.stroke();
      textoCentrado(x, Math.round(cfg.minutos * pExp) + "'", ox, oy + 1, '700 15px Segoe UI,Arial,sans-serif', '#2a2318');
      x.font = '600 12px Segoe UI,Arial,sans-serif';
      x.fillStyle = '#6b5c40'; x.textAlign = 'left'; x.textBaseline = 'middle';
      x.fillText('Exposición ' + cfg.minutos + ' min', ox + rad + 12, oy);
      x.restore();
    }

    // rótulos de las tres alturas
    var gA = clamp((t - 0.30) / 0.2, 0, 1);
    var mDer = ms[ms.length - 3];
    [['RAÍZ', 0.06, cfg.raiz], ['MEDIOS', 0.5, cfg.medios], ['PUNTAS', 0.95, cfg.puntas]].forEach(function (row, j) {
      var pt = qp(mDer.p0, mDer.p1, mDer.p2, row[1]);
      guia(x, pt.x, pt.y, W * 0.615, H * (0.30 + j * 0.115), row[0], row[2], gA - j * 0.12);
    });

    // ficha de la fórmula
    var fx = W * 0.66, fy = H * 0.16, fw = W * 0.30, fh = H * 0.44;
    tarjeta(x, fx, fy, fw, fh, 'Fórmula');
    x.save();
    x.textAlign = 'left'; x.textBaseline = 'middle';
    [['Raíz', cfg.raizN, cfg.raiz], ['Medios', cfg.mediosN, cfg.medios], ['Puntas', cfg.puntasN, cfg.puntas]].forEach(function (row, j) {
      var yy = fy + 58 + j * 52;
      x.fillStyle = row[2];
      x.beginPath();
      var rr = 8, px = fx + 16, ph = 34, pw = 34;
      x.moveTo(px + rr, yy - ph / 2); x.arcTo(px + pw, yy - ph / 2, px + pw, yy + ph / 2, rr);
      x.arcTo(px + pw, yy + ph / 2, px, yy + ph / 2, rr); x.arcTo(px, yy + ph / 2, px, yy - ph / 2, rr);
      x.arcTo(px, yy - ph / 2, px + pw, yy - ph / 2, rr); x.closePath(); x.fill();
      x.font = '700 11px Segoe UI,Arial,sans-serif'; x.fillStyle = '#8d7c58';
      x.fillText(row[0].toUpperCase(), fx + 62, yy - 9);
      x.font = '600 14px Segoe UI,Arial,sans-serif'; x.fillStyle = '#2a2318';
      x.fillText(row[1], fx + 62, yy + 9);
    });
    var tecN = TECNICAS.filter(function (z) { return z.id === cfg.tecnica; })[0] || TECNICAS[0];
    x.font = '700 11px Segoe UI,Arial,sans-serif'; x.fillStyle = '#8d7c58';
    x.fillText('TÉCNICA', fx + 16, fy + fh - 46);
    x.font = '600 14px Segoe UI,Arial,sans-serif'; x.fillStyle = '#b0873c';
    x.fillText(cfg.tecN || tecN.n, fx + 16, fy + fh - 26);
    x.restore();

    cartaDivisiones(x, W, H, cfg.divs, clamp((t - 0.10) / 0.2, 0, 1));
    var md = cfg.modo || cfg.tecnica;
    if (md === 'balayage' || md === 'sombre' || md === 'babylights') tablaBalayage(x, W, H, t, cfg);
  }

  /* ═══════════════════ 2 · CEJAS ═══════════════════
     Mapeo de tres líneas desde el ala de la nariz, contorno y pelo. */

  function ojo(x, cx, cy, w, hh, abierto) {
    x.save();
    x.strokeStyle = 'rgba(42,35,24,.75)'; x.lineWidth = 2;
    x.beginPath();
    x.moveTo(cx - w, cy);
    x.quadraticCurveTo(cx, cy - hh * (abierto == null ? 1 : abierto), cx + w, cy);
    x.quadraticCurveTo(cx, cy + hh * 0.72, cx - w, cy);
    x.closePath(); x.stroke();
    x.save();
    x.clip();
    x.fillStyle = 'rgba(120,140,190,.30)';
    x.beginPath(); x.arc(cx, cy - hh * 0.05, hh * 0.72, 0, Math.PI * 2); x.fill();
    x.fillStyle = 'rgba(42,35,24,.85)';
    x.beginPath(); x.arc(cx, cy - hh * 0.05, hh * 0.30, 0, Math.PI * 2); x.fill();
    x.restore();
    x.restore();
    return { x: cx, y: cy, w: w, h: hh };
  }

  /* Perfil de la ceja: columna vertebral desde el inicio al final. */
  function perfilCeja(ini, arco, fin, forma, alto) {
    var subida = { arqueada: 1, recta: 0.28, curva: 0.72, ascendente: 1.25 }[forma] || 1;
    var yArco = arco.y - alto * subida;
    return {
      p0: { x: ini.x, y: ini.y },
      p1: { x: arco.x - (arco.x - ini.x) * 0.25, y: yArco + alto * 0.10 },
      pA: { x: arco.x, y: yArco },
      p3: { x: fin.x, y: fin.y - alto * (forma === 'ascendente' ? 0.30 : 0.02) }
    };
  }

  function escenaCejas(x, W, H, t, cfg) {
    var cx = W * 0.42, cy = H * 0.46, r = Math.min(W, H) * 0.30;
    cabeza(x, cx, cy, r);

    var ojoY = cy + r * 0.10, sep = r * 0.46, ow = r * 0.30, oh = r * 0.15;
    var oI = ojo(x, cx - sep, ojoY, ow, oh);
    var oD = ojo(x, cx + sep, ojoY, ow, oh);

    // nariz
    x.save();
    x.strokeStyle = 'rgba(42,35,24,.35)'; x.lineWidth = 1.6;
    x.beginPath();
    x.moveTo(cx - r * 0.05, ojoY + r * 0.05);
    x.quadraticCurveTo(cx - r * 0.12, ojoY + r * 0.42, cx - r * 0.02, ojoY + r * 0.52);
    x.stroke();
    var ala = { x: cx - r * 0.155, y: ojoY + r * 0.56 };
    x.beginPath(); x.arc(ala.x, ala.y, r * 0.055, Math.PI * 0.15, Math.PI * 1.25); x.stroke();
    // boca, apenas insinuada
    x.beginPath();
    x.moveTo(cx - r * 0.17, ojoY + r * 0.86);
    x.quadraticCurveTo(cx, ojoY + r * 0.94, cx + r * 0.17, ojoY + r * 0.86);
    x.stroke();
    x.restore();

    /* Maquillaje comparte el rostro, pero no el mapeo de la ceja: aquí lo
       que se señala son las zonas de la base y del ojo. */
    if (cfg.maquillaje) {
      var zonas = [
        { n: 'Base · del centro hacia fuera', p: { x: cx, y: ojoY + r * 0.30 }, rr: r * 0.30, k: 0.00 },
        { n: 'Triángulo del corrector', p: { x: cx - sep, y: ojoY + oh * 2.6 }, rr: r * 0.13, k: 0.22 },
        { n: 'Cuenca · sombra media', p: { x: cx + sep, y: ojoY - oh * 1.5 }, rr: r * 0.14, k: 0.44 },
        { n: 'Externo · difuminado', p: { x: cx + sep + ow * 0.8, y: ojoY - oh * 0.6 }, rr: r * 0.10, k: 0.62 },
        { n: 'Colorete · pómulo', p: { x: cx - sep - ow * 0.5, y: ojoY + r * 0.46 }, rr: r * 0.13, k: 0.80 }
      ];
      x.save();
      x.textAlign = 'left'; x.textBaseline = 'middle';
      zonas.forEach(function (z) {
        var pp = clamp((t - z.k) / 0.16, 0, 1);
        if (pp <= 0) return;
        x.globalAlpha = pp;
        x.strokeStyle = 'rgba(168,85,247,.75)'; x.lineWidth = 1.6;
        x.setLineDash([6, 5]);
        x.beginPath(); x.ellipse(z.p.x, z.p.y, z.rr, z.rr * 0.72, 0, 0, Math.PI * 2); x.stroke();
        x.setLineDash([]);
        if (pp > 0.7) {
          x.globalAlpha = (pp - 0.7) / 0.3;
          x.font = '700 11.5px Segoe UI,Arial,sans-serif';
          x.fillStyle = '#a07d2e';
          x.fillText(z.n, z.p.x + z.rr + 8, z.p.y);
        }
      });
      x.restore();
      return;
    }

    /* Las tres líneas del mapeo, siempre desde el ala de la nariz:
       1 inicio por el lagrimal · 2 arco por el borde externo del iris
       3 final por el extremo del ojo. */
    var puntos = [
      { p: { x: oI.x - ow * 0.92, y: oI.y }, n: '1 · Inicio', d: 'Vertical desde el ala por el lagrimal' },
      { p: { x: oI.x + ow * 0.30, y: oI.y - oh * 0.30 }, n: '2 · Arco', d: 'Por el borde externo del iris' },
      { p: { x: oI.x + ow * 1.02, y: oI.y }, n: '3 · Final', d: 'Por el extremo externo del ojo' }
    ];

    var altoCeja = r * 0.26;
    /* Cada línea se prolonga desde el ala de la nariz hasta la altura de la
       ceja: ahí es donde marca el inicio, el arco y el final. */
    var cejaY = oI.y - oh * 2.30;
    var extremos = puntos.map(function (q) {
      var dx = q.p.x - ala.x, dy = q.p.y - ala.y;
      var k = Math.abs(dy) < 1 ? 1 : (cejaY - ala.y) / dy;
      return { x: ala.x + dx * k, y: cejaY };
    });

    var pMapa = clamp(t / 0.34, 0, 1);
    x.save();
    x.lineWidth = 1.5;
    puntos.forEach(function (q, i) {
      var pp = clamp((pMapa - i * 0.26) / 0.74, 0, 1);
      if (pp <= 0) return;
      var e = extremos[i];
      x.strokeStyle = 'rgba(9,86,100,.95)';
      x.setLineDash([6, 5]);
      x.beginPath();
      x.moveTo(ala.x, ala.y);
      x.lineTo(lerp(ala.x, e.x, pp), lerp(ala.y, e.y, pp));
      x.stroke();
      x.setLineDash([]);
      if (pp > 0.9) {
        x.fillStyle = '#0a5664';
        x.beginPath(); x.arc(e.x, e.y, 4, 0, Math.PI * 2); x.fill();
        x.font = '700 12px Segoe UI,Arial,sans-serif';
        x.fillStyle = '#0a5664';
        x.textAlign = 'center'; x.textBaseline = 'bottom';
        x.fillText(String(i + 1), e.x, e.y - 8);
      }
    });
    x.fillStyle = '#0a5664';
    x.beginPath(); x.arc(ala.x, ala.y, 3.5, 0, Math.PI * 2); x.fill();
    x.restore();

    // contorno de la ceja
    var ini = { x: extremos[0].x, y: cejaY + oh * 0.10 };
    var arc = { x: extremos[1].x, y: cejaY };
    var fin = { x: extremos[2].x + r * 0.03, y: cejaY + oh * 0.32 };
    var C = perfilCeja(ini, arc, fin, cfg.forma, altoCeja);
    var grosor = altoCeja * (0.24 + cfg.grosor * 0.34);

    var pCont = clamp((t - 0.34) / 0.22, 0, 1);
    if (pCont > 0) {
      x.save();
      x.strokeStyle = 'rgba(74,39,110,.95)'; x.lineWidth = 2.4;
      x.setLineDash([300 * pCont, 300]);
      x.beginPath();
      x.moveTo(C.p0.x, C.p0.y);
      x.quadraticCurveTo(C.p1.x, C.p1.y, C.pA.x, C.pA.y);
      x.quadraticCurveTo(C.pA.x + (C.p3.x - C.pA.x) * 0.4, C.pA.y - altoCeja * 0.04, C.p3.x, C.p3.y);
      x.stroke();
      // borde inferior
      x.beginPath();
      x.moveTo(C.p0.x, C.p0.y + grosor * 0.55);
      x.quadraticCurveTo(C.p1.x, C.p1.y + grosor, C.pA.x, C.pA.y + grosor * 0.92);
      x.quadraticCurveTo(C.pA.x + (C.p3.x - C.pA.x) * 0.45, C.pA.y + grosor * 0.62, C.p3.x, C.p3.y + grosor * 0.10);
      x.stroke();
      x.setLineDash([]);
      x.restore();
    }

    /* El pelo, en su dirección: hacia arriba en la cabeza, en diagonal en el
       arco y hacia abajo en la cola. Es lo que hace que una ceja parezca ceja. */
    var pPelo = clamp((t - 0.52) / 0.44, 0, 1);
    if (pPelo > 0) {
      var n = 64;
      x.save();
      x.lineCap = 'round';
      for (var i = 0; i < n; i++) {
        var u = i / (n - 1);
        var pp = clamp((pPelo - u * 0.55) / 0.45, 0, 1);
        if (pp <= 0) continue;
        var a = qp(C.p0, C.p1, C.pA, Math.min(1, u * 1.6));
        var b = qp(C.pA, { x: C.pA.x + (C.p3.x - C.pA.x) * 0.4, y: C.pA.y }, C.p3, clamp((u - 0.62) / 0.38, 0, 1));
        var base = u < 0.62 ? a : b;
        var jitter = (Math.sin(i * 12.9898) * 43758.5453) % 1;
        var gy = grosor * (0.15 + Math.abs(jitter) * 0.85) * (u < 0.62 ? 1 : 0.72);
        var ang = u < 0.18 ? -1.30 : (u < 0.55 ? -0.62 : 0.28);
        var largo = grosor * (0.85 + Math.abs(jitter) * 0.55) * pp;
        x.strokeStyle = cfg.tono;
        x.globalAlpha = 0.55 + Math.abs(jitter) * 0.45;
        x.lineWidth = 1.5 + Math.abs(jitter) * 1.1;
        x.beginPath();
        x.moveTo(base.x, base.y + gy * 0.55);
        x.lineTo(base.x + Math.cos(ang) * largo * 0.5, base.y + gy * 0.55 + Math.sin(ang) * largo);
        x.stroke();
      }
      x.restore();
    }

    // rótulos del mapeo, ya con la ceja hecha
    var gA = clamp((t - 0.70) / 0.2, 0, 1);
    puntos.forEach(function (q, i) {
      var e = extremos[i];
      guia(x, e.x, e.y, W * 0.70, H * (0.24 + i * 0.10), q.n, '#0e7d8f', gA);
    });

    // ficha
    var fx = W * 0.70, fy = H * 0.56, fw = W * 0.26, fh = H * 0.30;
    tarjeta(x, fx, fy, fw, fh, 'Diseño');
    x.save();
    x.textAlign = 'left'; x.textBaseline = 'middle';
    var fN = FORMAS_CEJA.filter(function (z) { return z.id === cfg.forma; })[0] || FORMAS_CEJA[0];
    [['Forma', fN.n], ['Grosor', Math.round(cfg.grosor * 100) + '%'], ['Pelo', cfg.tonoN]].forEach(function (row, j) {
      var yy = fy + 54 + j * 42;
      x.font = '700 11px Segoe UI,Arial,sans-serif'; x.fillStyle = '#8d7c58';
      x.fillText(row[0].toUpperCase(), fx + 16, yy - 9);
      x.font = '600 14px Segoe UI,Arial,sans-serif'; x.fillStyle = '#2a2318';
      x.fillText(row[1], fx + 16, yy + 9);
    });
    x.restore();
  }

  /* ═══════════════════ 3 · PESTAÑAS ═══════════════════
     Línea de implantación en cinco zonas y las extensiones colocadas
     una a una, con su curvatura y sus milímetros.                    */

  function escenaPestanas(x, W, H, t, cfg) {
    var cx = W * 0.42, cy = H * 0.50;
    var ow = Math.min(W, H) * 0.36, oh = ow * 0.42;

    // párpado y ojo, en grande
    x.save();
    x.fillStyle = 'rgba(28,28,56,.9)';
    x.beginPath();
    x.moveTo(cx - ow, cy);
    x.quadraticCurveTo(cx, cy - oh * 1.5, cx + ow, cy);
    x.quadraticCurveTo(cx, cy + oh * 1.05, cx - ow, cy);
    x.closePath(); x.fill();
    x.strokeStyle = 'rgba(42,35,24,.55)'; x.lineWidth = 2.2; x.stroke();
    x.save(); x.clip();
    var gi = x.createRadialGradient(cx, cy - oh * 0.1, oh * 0.1, cx, cy - oh * 0.1, oh * 0.95);
    gi.addColorStop(0, 'rgba(150,175,230,.75)'); gi.addColorStop(1, 'rgba(60,80,140,.55)');
    x.fillStyle = gi;
    x.beginPath(); x.arc(cx, cy - oh * 0.06, oh * 0.92, 0, Math.PI * 2); x.fill();
    x.fillStyle = '#0d0d1e';
    x.beginPath(); x.arc(cx, cy - oh * 0.06, oh * 0.38, 0, Math.PI * 2); x.fill();
    x.fillStyle = 'rgba(122,102,58,.85)';
    x.beginPath(); x.arc(cx - oh * 0.22, cy - oh * 0.34, oh * 0.13, 0, Math.PI * 2); x.fill();
    x.restore();
    x.restore();

    // línea de implantación, de lagrimal a extremo
    var L0 = { x: cx - ow, y: cy };
    var L1 = { x: cx, y: cy - oh * 1.5 };
    var L2 = { x: cx + ow, y: cy };
    var pLinea = clamp(t / 0.16, 0, 1);
    x.save();
    x.strokeStyle = 'rgba(74,39,110,.95)'; x.lineWidth = 3.6;
    x.setLineDash([420 * pLinea, 420]);
    x.beginPath(); x.moveTo(L0.x, L0.y); x.quadraticCurveTo(L1.x, L1.y, L2.x, L2.y); x.stroke();
    x.setLineDash([]);
    x.restore();

    // cinco zonas del mapa
    var mm = cfg.mm;
    var pZona = clamp((t - 0.14) / 0.18, 0, 1);
    x.save();
    for (var z = 0; z <= 5; z++) {
      var u = z / 5;
      var pt = qp(L0, L1, L2, u);
      var pp = clamp((pZona - u * 0.5) / 0.5, 0, 1);
      if (pp <= 0) continue;
      x.strokeStyle = 'rgba(9,86,100,' + (0.95 * pp) + ')';
      x.lineWidth = 2;
      x.beginPath();
      x.moveTo(pt.x, pt.y - 6);
      x.lineTo(pt.x, pt.y - 6 - 16 * pp);
      x.stroke();
      if (z < 5 && pp > 0.7) {
        var mid = qp(L0, L1, L2, (z + 0.5) / 5);
        x.font = '700 12px Segoe UI,Arial,sans-serif';
        x.fillStyle = '#0a5664';
        x.textAlign = 'center'; x.textBaseline = 'bottom';
        x.fillText(mm[z] + ' mm', mid.x, mid.y - 30);
        x.font = '700 10px Segoe UI,Arial,sans-serif';
        x.fillStyle = '#8d7c58';
        x.fillText('Z' + (z + 1), mid.x, mid.y - 46);
      }
    }
    x.restore();

    /* Las extensiones: una a una, en el orden real de colocación (de la
       zona externa hacia el lagrimal), cada una con su curvatura. */
    var curva = CURVAS.filter(function (c) { return c.id === cfg.curva; })[0] || CURVAS[0];
    var n = 58;
    var pPuesta = clamp((t - 0.30) / 0.62, 0, 1);
    x.save();
    x.lineCap = 'round';
    for (var i = 0; i < n; i++) {
      var u2 = 0.03 + (i / (n - 1)) * 0.94;
      var orden = 1 - u2;                                  // se empieza por fuera
      var pp2 = clamp((pPuesta - orden * 0.55) / 0.45, 0, 1);
      if (pp2 <= 0) continue;
      var zi = clamp(Math.floor(u2 * 5), 0, 4);
      var base2 = qp(L0, L1, L2, u2);
      var largo = mm[zi] * (Math.min(W, H) * 0.0135);
      var tang = { x: qp(L0, L1, L2, Math.min(1, u2 + 0.01)).x - base2.x, y: qp(L0, L1, L2, Math.min(1, u2 + 0.01)).y - base2.y };
      var nn = Math.hypot(tang.x, tang.y) || 1;
      var nx = tang.y / nn, ny = -tang.x / nn;             // normal hacia fuera del ojo
      var salida = { x: base2.x + nx * largo * 0.55, y: base2.y + ny * largo * 0.55 };
      var punta = {
        x: salida.x + nx * largo * 0.55 + (u2 - 0.5) * largo * 0.55 * curva.k,
        y: salida.y + ny * largo * 0.55 - largo * 0.30 * curva.k
      };
      // aparece cayendo un poco: así se ve que se está colocando
      var caida = (1 - ease(pp2)) * 14;
      x.save();
      x.globalAlpha = 0.35 + 0.65 * ease(pp2);
      x.translate(0, -caida);
      var grad = x.createLinearGradient(base2.x, base2.y, punta.x, punta.y);
      grad.addColorStop(0, '#0c0c18'); grad.addColorStop(1, 'rgba(20,20,40,.55)');
      x.strokeStyle = grad;
      x.lineWidth = 2.6 - (i % 3) * 0.4;
      x.beginPath();
      x.moveTo(base2.x, base2.y);
      x.quadraticCurveTo(salida.x, salida.y, punta.x, punta.y);
      x.stroke();
      x.restore();
    }
    x.restore();

    // pinza, en el punto donde se está colocando
    if (pPuesta > 0.02 && pPuesta < 0.99) {
      var uu = clamp(1 - pPuesta, 0.03, 0.97);
      var pt2 = qp(L0, L1, L2, uu);
      x.save();
      x.translate(pt2.x + 26, pt2.y - 46);
      x.rotate(0.7);
      x.strokeStyle = '#5a5040'; x.lineWidth = 2.4; x.lineCap = 'round';
      x.beginPath(); x.moveTo(-2, 0); x.lineTo(-14, -34); x.stroke();
      x.beginPath(); x.moveTo(2, 0); x.lineTo(6, -35); x.stroke();
      x.restore();
    }

    // rótulos
    var gA2 = clamp((t - 0.78) / 0.2, 0, 1);
    var ef = EFECTOS.filter(function (e2) { return e2.id === cfg.efecto; })[0] || EFECTOS[0];
    guia(x, qp(L0, L1, L2, 0.5).x, qp(L0, L1, L2, 0.5).y - 8, W * 0.70, H * 0.22, 'Línea de implantación', '#b0873c', gA2);
    guia(x, qp(L0, L1, L2, 0.9).x, qp(L0, L1, L2, 0.9).y, W * 0.70, H * 0.32, 'Zona externa · Z5', '#0e7d8f', gA2);

    var fx = W * 0.70, fy = H * 0.42, fw = W * 0.26, fh = H * 0.38;
    tarjeta(x, fx, fy, fw, fh, 'Mapa');
    x.save();
    x.textAlign = 'left'; x.textBaseline = 'middle';
    [['Efecto', ef.n], ['Curvatura', curva.n], ['Milímetros', mm.join(' · ')], ['Grosor', cfg.grosorMm + ' mm']].forEach(function (row, j) {
      var yy = fy + 54 + j * 44;
      x.font = '700 11px Segoe UI,Arial,sans-serif'; x.fillStyle = '#8d7c58';
      x.fillText(row[0].toUpperCase(), fx + 16, yy - 9);
      x.font = '600 14px Segoe UI,Arial,sans-serif'; x.fillStyle = '#2a2318';
      x.fillText(row[1], fx + 16, yy + 9);
    });
    x.restore();
  }

  /* ─────────────────────────── el componente ─────────────────────────── */

  class Estudios extends HTMLElement {
    connectedCallback() {
      if (this._hecho) return;
      this._hecho = true;

      this.disc = 'color';
      this.fam = 'color';
      this.vista = 'maniqui';
      this.tecId = null;
      this.t = 1;
      this.tocando = false;
      this.ratio = 'hoja';
      this.fmt = 'png';
      this.voz = true;

      this.cfg = {
        color: {
          raiz: '#4E3122', raizN: '4.0 Castaño', medios: '#9A6330', mediosN: '7.34 Cobre dorado',
          puntas: '#D3B183', puntasN: '9.31 Beige', tecnica: 'balayage', minutos: 35
        },
        cejas: { forma: 'arqueada', grosor: 0.5, tono: '#3A2419', tonoN: '3.0 Castaño oscuro' },
        pestanas: { efecto: 'abierto', curva: 'C', mm: EFECTOS[0].mm.slice(), grosorMm: 0.15 },
        mandala: (function () {
          var m = MODELOS_MANDALA[0];
          return {
            modelo: m.id, numerar: m.numerar !== false, coronas: m.coronas, sectores: m.sectores,
            sentido: m.sentido, arranque: m.arranque, orden: m.orden,
            tonos: m.tonos.slice(), nombres: m.nombres.slice(), notas: m.notas.slice()
          };
        })(),
        ficha: this.leerFicha()
      };

      if (window.EU_CEREBRO) {
        var l0 = EU_CEREBRO.listar('color');
        this.tecId = l0.length ? l0[0].id : null;
      }
      this.sincronizar();
      this.leerFoto();
      this.leerPar();
      if (window.EU_CEREBRO) {
        var yo = this;
        /* Si se corrige un dato de la técnica, la lámina se redibuja sola. */
        this._desuscribir = EU_CEREBRO.suscribir(function (id) {
          if (id === yo.tecId) { yo.sincronizar(); yo.refrescar(); }
        });
      }

      this.style.display = 'block';
      var caja = el('div', 'display:grid;grid-template-columns:1fr 300px;gap:14px;align-items:start;font-family:Segoe UI,system-ui,sans-serif;color:#e8e8f5');

      var izq = el('div', 'min-width:0');
      var marco = el('div', 'background:#0a0a14;border:1px solid #2d2d4a;border-radius:12px;padding:12px');
      this.cv = el('canvas', 'width:100%;height:auto;display:block;border-radius:8px;background:#0a0a14');
      this.cv.width = 1280; this.cv.height = 720;
      marco.appendChild(this.cv);
      izq.appendChild(marco);

      var fd = el('div', 'display:flex;gap:6px;flex-wrap:wrap;margin-top:10px');
      var self = this;
      this.btDisc = {};
      familias().forEach(function (d) {
        var b = el('button', (self.fam === d.id ? S.chipOn : S.chipOff) + ';font-size:12px;padding:8px 14px',
          (d.ico ? d.ico + ' ' : '') + d.n);
        b.onclick = function () {
          self.fam = d.id;
          self.disc = d.lienzo || 'color';
          if (window.EU_CEREBRO) {
            var ls = EU_CEREBRO.listar(d.id);
            self.tecId = ls.length ? ls[0].id : null;
          }
          self.sincronizar();
          self.refrescar();
          self.animar();
        };
        self.btDisc[d.id] = b;
        fd.appendChild(b);
      });
      fd.appendChild(el('span', 'flex:1'));
      var bPlay = el('button', S.bt + ';background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;border:0', '▶ Ver la animación');
      bPlay.onclick = function () { self.animar(); };
      fd.appendChild(bPlay);
      izq.appendChild(fd);

      var fx = el('div', 'display:flex;gap:6px;flex-wrap:wrap;margin-top:8px;align-items:center');
      ['png', 'jpg', 'webp'].forEach(function (f) {
        var b = el('button', (self.fmt === f ? S.chipOn : S.chipOff), f.toUpperCase());
        b.onclick = function () { self.fmt = f; self.refrescar(); };
        fx.appendChild(b);
      });
      var bImg = el('button', S.bt + ';background:transparent;border:1px solid #2d2d4a;color:#cbd5e1', '⬇ Lámina');
      bImg.onclick = function () { self.bajarLamina(); };
      var bSec = el('button', S.bt + ';background:transparent;border:1px solid #2d2d4a;color:#cbd5e1', '⬇ Los 6 momentos');
      bSec.title = 'Seis instantes de la animación, para imprimir el proceso paso a paso';
      bSec.onclick = function () { self.bajarSecuencia(); };
      var bPdf = el('button', S.bt + ';background:transparent;border:1px solid #2d2d4a;color:#cbd5e1', '⬇ PDF');
      bPdf.onclick = function () { self.pdf(); };
      var bVid = el('button', S.bt + ';background:linear-gradient(135deg,#0891b2,#06b6d4);color:#fff;border:0', '⏺ Vídeo narrado');
      bVid.onclick = function () { self.grabar(); };
      fx.appendChild(bImg); fx.appendChild(bSec); fx.appendChild(bPdf);
      fx.appendChild(el('span', 'flex:1'));
      fx.appendChild(bVid);
      izq.appendChild(fx);

      var fm = el('div', 'display:flex;gap:5px;flex-wrap:wrap;margin-top:8px;align-items:center');
      fm.appendChild(el('span', 'font-size:10px;color:#7c7c9e;letter-spacing:.06em;text-transform:uppercase;font-weight:700', 'Medida del vídeo'));
      this.btMed = {};
      MEDIDAS.forEach(function (m) {
        var b = el('button', (self.ratio === m.id ? S.chipOn : S.chipOff), m.n);
        b.onclick = function () { self.ratio = m.id; self.refrescar(); };
        self.btMed[m.id] = b;
        fm.appendChild(b);
      });
      izq.appendChild(fm);

      if (window.B6Voz) {
        var hv = el('div', '');
        izq.appendChild(hv);
        B6Voz.panel(hv);
      }
      if (window.B6Bandeja) {
        var hb = el('div', '');
        izq.appendChild(hb);
        B6Bandeja.panel(hb, { origen: 'estudios' }, 'estudios');
      }

      this.txtEstado = el('div', 'font-size:11.5px;color:#94a3b8;margin-top:9px;line-height:1.6;min-height:18px');
      izq.appendChild(this.txtEstado);

      this.panel = el('div', S.caja);
      caja.appendChild(izq);
      caja.appendChild(this.panel);
      this.appendChild(caja);

      /* En el móvil la columna de 300px no cabe al lado de la lámina: se
         montaba encima de los botones de disciplina. Debajo de 760 px de
         ancho el panel baja y todo va en una sola columna. */
      this._ajustar = function () {
        var ancho = self.getBoundingClientRect().width || window.innerWidth || 1024;
        var estrecho = ancho < 760;
        caja.style.gridTemplateColumns = estrecho ? '1fr' : '1fr 300px';
        caja.style.gap = estrecho ? '10px' : '14px';
      };
      this._ajustar();
      if (window.ResizeObserver) {
        this._ro = new ResizeObserver(function () { self._ajustar(); });
        this._ro.observe(this);
      } else {
        window.addEventListener('resize', this._ajustar);
      }

      this.refrescar();
      this.animar();
    }

    aviso(t) { if (this.txtEstado) this.txtEstado.textContent = t || ''; }

    /* La técnica elegida manda: sus divisiones, su modo de pintado y su
       nombre. Nada de esto se copia: se pregunta al Cerebro. */
    sincronizar() {
      var t = (window.EU_CEREBRO && this.tecId) ? EU_CEREBRO.obtener(this.tecId) : null;
      this.tec = t;
      var c = this.cfg.color;
      c.divs = t ? EU_CEREBRO.divisiones(this.tecId) : [];
      c.modo = t ? (MODOS[this.tecId] || 'global') : c.tecnica;
      c.tecN = t ? t.n : null;
      this.cfg.cejas.maquillaje = this.fam === 'maquillaje';
      if (t && t.pintado) {
        if (this._tecPrev !== this.tecId || c.desde == null) c.desde = t.pintado.desde;
      } else c.desde = null;
      this._tecPrev = this.tecId;
    }

    famN() {
      var f = familias().filter(function (z) { return z.id === this.fam; }, this)[0];
      return f ? f.n : 'Estudio';
    }

    narracion() {
      /* La narración es la del Cerebro, paso a paso: la misma que se ve en
         pantalla, la que se lee en el PDF y la que se graba en el vídeo. */
      if (this.tec) {
        var n = EU_CEREBRO.narracion(this.tecId);
        if (n.length) return n;
      }
      var c = this.cfg;
      if (this.disc === 'color') {
        var tec = TECNICAS.filter(function (z) { return z.id === c.color.tecnica; })[0] || TECNICAS[0];
        return [
          'Técnica: ' + tec.n + '. ' + tec.d,
          'Se marcan las particiones de trabajo y se separa la melena en secciones.',
          'La aplicación entra por la raíz, mechón a mechón, desde la nuca hacia la cara.',
          'Raíz ' + c.color.raizN + ', medios ' + c.color.mediosN + ', puntas ' + c.color.puntasN + '.',
          'Tiempo de exposición: ' + c.color.minutos + ' minutos, y emulsionado antes de aclarar.'
        ];
      }
      if (this.disc === 'cejas') {
        var f = FORMAS_CEJA.filter(function (z) { return z.id === c.cejas.forma; })[0] || FORMAS_CEJA[0];
        return [
          'Mapeo de cejas. Las tres líneas salen siempre del ala de la nariz.',
          'Línea uno: el inicio, en vertical por el lagrimal.',
          'Línea dos: el arco, por el borde externo del iris.',
          'Línea tres: el final, por el extremo externo del ojo.',
          'Forma ' + f.n.toLowerCase() + '. El pelo se dibuja en su dirección: arriba en la cabeza, en diagonal en el arco y abajo en la cola.'
        ];
      }
      var ef = EFECTOS.filter(function (z) { return z.id === c.pestanas.efecto; })[0] || EFECTOS[0];
      var cu = CURVAS.filter(function (z) { return z.id === c.pestanas.curva; })[0] || CURVAS[0];
      return [
        'Mapa de pestañas, efecto ' + ef.n.toLowerCase() + '.',
        'La línea de implantación se divide en cinco zonas, del lagrimal al extremo.',
        'Milímetros por zona: ' + c.pestanas.mm.join(', ') + '.',
        cu.n + ', grosor ' + c.pestanas.grosorMm + ' milímetros.',
        'Se coloca de fuera hacia dentro, una extensión por pestaña natural.'
      ];
    }

    pintar() {
      var x = this.cv.getContext('2d'), W = this.cv.width, H = this.cv.height;
      var g = x.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, '#faf4e8'); g.addColorStop(1, '#efe3cd');
      x.fillStyle = g; x.fillRect(0, 0, W, H);

      x.save();
      x.font = '700 13px Segoe UI,Arial,sans-serif';
      x.fillStyle = '#a8791f'; x.textAlign = 'left'; x.textBaseline = 'alphabetic';
      x.fillText(this.famN().toUpperCase() + (this.tec ? '  ·  ' + this.tec.n : ''), 30, 40);
      x.restore();

      x.save();
      x.strokeStyle = 'rgba(176,135,60,.55)'; x.lineWidth = 1.2;
      x.strokeRect(14.5, 14.5, W - 29, H - 29);
      x.strokeStyle = 'rgba(176,135,60,.28)';
      x.strokeRect(20.5, 20.5, W - 41, H - 41);
      x.restore();

      if (this.vista === 'concepto') {
        laminaConcepto(x, W, H, this.conceptoId || 'rueda', this.cfg.ficha);
        var Lc = window.EU_LOGO;
        if (Lc && Lc.pintar) Lc.pintar(x, W, H);
        return;
      }

      if (this.vista === 'mandala') {
        laminaMandala(x, W, H, this.cfg.mandala || { coronas: 3, sectores: 8, sentido: 'reloj', numerar: true, tonos: [], nombres: [], notas: [] }, this.cfg.ficha, this.tec ? this.tec.n : '');
        var Lm = window.EU_LOGO;
        if (Lm && Lm.pintar) Lm.pintar(x, W, H);
        return;
      }

      if (this.vista === 'antes') {
        laminaAntes(x, W, H, this.par, this.cfg.ficha, this.tec ? this.tec.n : '', this.discFicha());
        var La = window.EU_LOGO;
        if (La && La.pintar) La.pintar(x, W, H);
        return;
      }

      var esDiag = this.vista === 'diagrama' && window.EU_DIVISIONES && this.tecId && EU_DIVISIONES.tiene(this.tecId);
      if (esDiag) {
        EU_DIVISIONES.dibujar(x, W, H, this.tecId, {
          p: this.t,
          titulo: this.tec ? this.tec.n : '',
          desde: this.cfg.color.desde
        });
        this.pieDiagrama(x, W, H, this.tec ? EU_CEREBRO.pasoEn(this.tecId, this.t) : null);
        this.dibujarFoto(x, W, H);
        var Ld = window.EU_LOGO;
        if (Ld && Ld.pintar) Ld.pintar(x, W, H);
        return;
      }

      /* Si la ficha está puesta se le reserva la columna izquierda y la escena
         se encoge hacia la derecha: nunca se pisan. */
      var reserva = this.cfg.ficha && this.cfg.ficha.puesta ? W * 0.44 : 0;
      x.save();
      if (reserva) {
        var kr = (W - reserva) / W;
        x.translate(reserva, (H - H * kr) / 2);
        x.scale(kr, kr);
      }
      if (this.disc === 'color') escenaColor(x, W, H, this.t, this.cfg.color);
      else if (this.disc === 'cejas') escenaCejas(x, W, H, this.t, this.cfg.cejas);
      else escenaPestanas(x, W, H, this.t, this.cfg.pestanas);
      x.restore();

      var fr = this.narracion();
      var paso = this.tec ? EU_CEREBRO.pasoEn(this.tecId, this.t) : null;
      if (paso) {
        banda(x, W, H, paso.paso.n);
        /* El paso y su error común: lo que separa una lámina bonita de una
           lámina que enseña. */
        x.save();
        x.textAlign = 'left'; x.textBaseline = 'alphabetic';
        x.font = '700 12px Segoe UI,Arial,sans-serif';
        x.fillStyle = '#a8791f';
        x.fillText('PASO ' + (paso.i + 1) + ' DE ' + paso.total, 30, 62);
        x.font = '700 17px Segoe UI,Arial,sans-serif';
        x.fillStyle = '#2a2318';
        x.fillText(paso.paso.t, 30, 86);
        if (paso.paso.e) {
          x.font = '600 12.5px Segoe UI,Arial,sans-serif';
          x.fillStyle = '#9e2f2f';
          x.fillText('Error común: ' + paso.paso.e, 30, 108);
        }
        x.restore();
      } else {
        var k = Math.min(fr.length - 1, Math.floor(this.t * fr.length));
        banda(x, W, H, fr[k]);
      }

      /* El bloque del paso ocupa la esquina de arriba a la izquierda: la ficha
         necesita saber hasta dónde llega para no pisarlo con el QR. */
      var topePaso = paso ? (paso.paso.e ? 116 : 94) : 46;
      fichaTecnica(x, W, H, this.cfg.ficha,
        this.disc === 'color' ? this.cfg.color : null,
        this.tec ? this.tec.n : '', topePaso, this.discFicha());
      this.dibujarFoto(x, W, H);

      var L = window.EU_LOGO;      if (L && L.img && (L.img.naturalWidth || L.img.width)) {
        var anc = W * ((L.tam || 9) / 100);
        var alt = anc * ((L.img.naturalHeight || L.img.height) / (L.img.naturalWidth || L.img.width));
        var M = Math.round(W * 0.024);
        var px = W - M - anc, py = M;
        if (L.pos === 'ti') { px = M; py = M; }
        else if (L.pos === 'pc') { px = (W - anc) / 2; py = H - M - alt - 90; }
        else if (L.pos === 'pd') { px = W - M - anc; py = H - M - alt - 90; }
        x.save();
        x.shadowColor = 'rgba(0,0,0,.45)'; x.shadowBlur = anc * 0.12;
        x.drawImage(L.img, px, py, anc, alt);
        x.restore();
      }
    }

    animar(dur, alAcabar) {
      var self = this;
      if (this._raf) cancelAnimationFrame(this._raf);
      var D = dur || 7.5;
      var t0 = performance.now();
      this.tocando = true;
      var paso = function () {
        var s = (performance.now() - t0) / 1000;
        self.t = clamp(s / D, 0, 1);
        self.pintar();
        if (s < D) { self._raf = requestAnimationFrame(paso); return; }
        self._raf = null;
        self.tocando = false;
        if (alAcabar) alAcabar();
      };
      paso();
    }

    /* ── panel de la derecha, distinto por disciplina ── */
    /* Pie de la lámina de diagramas: el paso, su narración y su error,
       en tinta oscura porque el fondo es de papel. */
    pieDiagrama(x, W, H, paso) {
      if (!paso) return;
      var cortar = function (t, an) {
        t = String(t || '');
        if (x.measureText(t).width <= an) return t;
        while (t.length > 4 && x.measureText(t + '…').width > an) t = t.slice(0, -1);
        return t + '…';
      };
      x.save();
      x.textAlign = 'left'; x.textBaseline = 'alphabetic';
      var y = H - 66;
      x.strokeStyle = '#e0d3b6'; x.lineWidth = 1;
      x.beginPath(); x.moveTo(30, y - 16); x.lineTo(W - 30, y - 16); x.stroke();
      x.font = '700 11px Segoe UI,Arial,sans-serif';
      x.fillStyle = '#a8791f';
      x.fillText('PASO ' + (paso.i + 1) + ' DE ' + paso.total, 30, y);
      x.font = '800 17px Segoe UI,Arial,sans-serif';
      x.fillStyle = '#2a2318';
      x.fillText(cortar(paso.paso.t, W * 0.42), 30, y + 23);
      x.font = '600 12.5px Segoe UI,Arial,sans-serif';
      x.fillStyle = '#6b5c40';
      x.fillText(cortar(paso.paso.n, W * 0.55), 30, y + 44);
      if (paso.paso.e) {
        x.textAlign = 'right';
        x.font = '700 11px Segoe UI,Arial,sans-serif';
        x.fillStyle = '#d94141';
        x.fillText('ERROR COMÚN', W - 30, y);
        x.font = '600 12.5px Segoe UI,Arial,sans-serif';
        x.fillStyle = '#7a4a4a';
        x.fillText(cortar(paso.paso.e, W * 0.36), W - 30, y + 23);
      }
      x.restore();
    }

    /* La foto de la alumna, en una esquina y pequeña: acompaña a la lámina
       sin taparla, y viaja en el PNG, en el PDF y en el vídeo. */
    dibujarFoto(x, W, H) {
      var f = this.foto;
      if (!f || !f.img || !f.img.width) return;
      var esc = f.tam || 0.17;
      var an = Math.round(W * esc);
      var al = Math.round(Math.min(an * f.img.height / f.img.width, H * 0.34));
      /* Nueve anclajes: la alumna elige el hueco libre de la lámina y la foto
         se coloca ahí sin pisar el texto ni el diagrama. */
      var pos = POS_FOTO[f.pos] ? f.pos : 'ad';
      var col = POS_FOTO[pos][0], fil = POS_FOTO[pos][1];
      var mx = 30, arriba = 62, abajo = H - 96;
      var px = col === 0 ? mx : (col === 1 ? Math.round((W - an) / 2) : W - mx - an);
      var py = fil === 0 ? arriba : (fil === 1 ? Math.round((arriba + abajo - al) / 2) : abajo - al);
      x.save();
      var r = 10;
      x.beginPath();
      x.moveTo(px + r, py); x.arcTo(px + an, py, px + an, py + al, r);
      x.arcTo(px + an, py + al, px, py + al, r); x.arcTo(px, py + al, px, py, r);
      x.arcTo(px, py, px + an, py, r); x.closePath();
      x.save(); x.clip();
      /* recorte central: la foto llena el hueco sin deformarse */
      var ri = f.img.width / f.img.height, rc = an / al, sw = f.img.width, sh = f.img.height, sx = 0, sy = 0;
      if (ri > rc) { sw = f.img.height * rc; sx = (f.img.width - sw) / 2; }
      else { sh = f.img.width / rc; sy = (f.img.height - sh) / 2; }
      x.drawImage(f.img, sx, sy, sw, sh, px, py, an, al);
      x.restore();
      x.strokeStyle = 'rgba(176,135,60,.75)'; x.lineWidth = 2; x.stroke();
      x.restore();
    }

    /* Antes y después comparten el mismo reductor que la foto de referencia:
       640 px de ancho y JPEG, para que quepan entre sesiones. */
    cargarPar(archivo, cual) {
      var self = this;
      var fr = new FileReader();
      fr.onload = function () {
        var im = new Image();
        im.onload = function () {
          var k = Math.min(1, 900 / im.width);
          var cv = document.createElement('canvas');
          cv.width = Math.round(im.width * k); cv.height = Math.round(im.height * k);
          cv.getContext('2d').drawImage(im, 0, 0, cv.width, cv.height);
          var url = cv.toDataURL('image/jpeg', 0.85);
          var im2 = new Image();
          im2.onload = function () {
            self.par = self.par || {};
            self.par[cual] = { img: im2, url: url };
            self.guardarPar();
            self.refrescar();
          };
          im2.src = url;
        };
        im.src = fr.result;
      };
      fr.readAsDataURL(archivo);
    }

    guardarPar() {
      try {
        var d = {};
        ['antes', 'despues'].forEach(function (c) {
          if (this.par && this.par[c]) d[c] = this.par[c].url;
        }, this);
        localStorage.setItem('eu_estudio_par', JSON.stringify(d));
      } catch (e) { }
    }

    leerPar() {
      var self = this;
      try {
        var d = JSON.parse(localStorage.getItem('eu_estudio_par') || 'null');
        if (!d) return;
        self.par = self.par || {};
        ['antes', 'despues'].forEach(function (c) {
          if (!d[c]) return;
          var im = new Image();
          im.onload = function () {
            self.par[c] = { img: im, url: d[c] };
            if (self.panel) self.refrescar(); else self.pintar();
          };
          im.src = d[c];
        });
      } catch (e) { }
    }

    cargarFoto(archivo) {
      var self = this;
      var fr = new FileReader();
      fr.onload = function () {
        var im = new Image();
        im.onload = function () {
          /* Se reduce antes de guardar: la lámina no necesita más de 640 px
             y así cabe entre sesiones. */
          var k = Math.min(1, 640 / im.width);
          var cv = document.createElement('canvas');
          cv.width = Math.round(im.width * k); cv.height = Math.round(im.height * k);
          cv.getContext('2d').drawImage(im, 0, 0, cv.width, cv.height);
          var url = cv.toDataURL('image/jpeg', 0.82);
          var im2 = new Image();
          im2.onload = function () {
            self.foto = { img: im2, url: url, pos: (self.foto && self.foto.pos) || 'ad', tam: (self.foto && self.foto.tam) || 0.17 };
            self.guardarFoto();
            self.refrescar();
          };
          im2.src = url;
        };
        im.src = fr.result;
      };
      fr.readAsDataURL(archivo);
    }

    leerFoto() {
      var self = this;
      try {
        var d = JSON.parse(localStorage.getItem('eu_estudio_foto') || 'null');
        if (!d || !d.url) return;
        var im = new Image();
        var pos = d.pos === 'sd' ? 'ad' : (d.pos === 'ia' ? 'bd' : (d.pos || 'ad'));
        im.onload = function () {           self.foto = { img: im, url: d.url, pos: pos, tam: d.tam || 0.17 };
          /* El panel ya se construyó sin foto: hay que rehacerlo para que
             aparezcan la rejilla de posición y el tamaño. */
          if (self.panel) self.refrescar(); else self.pintar();
        };
        im.src = d.url;
      } catch (e) { }
    }

    guardarFoto() {
      if (!this.foto) return;
      try {
        localStorage.setItem('eu_estudio_foto', JSON.stringify({
          url: this.foto.url, pos: this.foto.pos, tam: this.foto.tam
        }));
      } catch (e) { }
    }

    refrescar() {
      var self = this;
      familias().forEach(function (d) {
        if (self.btDisc[d.id]) self.btDisc[d.id].setAttribute('style', (self.fam === d.id ? S.chipOn : S.chipOff) + ';font-size:12px;padding:8px 14px');
      });
      MEDIDAS.forEach(function (m) {
        if (self.btMed[m.id]) self.btMed[m.id].setAttribute('style', self.ratio === m.id ? S.chipOn : S.chipOff);
      });

      var p = this.panel;
      p.textContent = '';
      this.panelTecnica(p);
      /* Maquillaje comparte el rostro con cejas, pero no sus controles:
         la forma y el grosor del pelo de la ceja no pintan nada aquí. */
      if (this.fam === 'maquillaje') this.panelMaquillaje(p);
      else if (this.disc === 'color') this.panelColor(p);
      else if (this.disc === 'cejas') this.panelCejas(p);
      else this.panelPestanas(p);
      if (this.vista === 'antes') this.panelPar(p);
      else if (this.vista === 'mandala') this.panelMandala(p);
      else if (this.vista === 'concepto') this.panelConcepto(p);
      else this.panelFoto(p);
      if (this.vista !== 'mandala' && this.vista !== 'concepto') this.panelFicha(p);
      this.pintar();
    }

    /* Maquillaje: el rostro sirve de lienzo, pero lo que se ajusta es la
       piel y el ojo, no el pelo de la ceja. */
    panelMaquillaje(p) {
      var self = this, c = this.cfg.cejas;
      p.appendChild(el('label', S.rot, 'Tono de piel'));
      var fp = el('div', 'display:flex;gap:5px;flex-wrap:wrap');
      [{ n: 'Claro', v: '#f2d9c4' }, { n: 'Medio', v: '#e0b48d' }, { n: 'Trigueño', v: '#c89168' }, { n: 'Oscuro', v: '#8d5b3c' }].forEach(function (t) {
        var b = el('button', (c.piel === t.v ? S.chipOn : S.chipOff), t.n);
        b.onclick = function () { c.piel = t.v; self.refrescar(); };
        fp.appendChild(b);
      });
      p.appendChild(fp);
      p.appendChild(el('div', 'font-size:10.5px;color:#7c7c9e;line-height:1.5;margin-top:8px',
        'El tono se prueba en la mandíbula, junto al cuello, y se comprueba con luz natural. La muñeca engaña.'));
    }

    /* Selector de técnica de la familia, leído del Cerebro. */
    panelTecnica(p) {
      if (!window.EU_CEREBRO) return;
      var self = this;
      var ls = EU_CEREBRO.listar(this.fam);
      if (!ls.length) return;
      p.appendChild(el('label', S.rot, 'Técnica del Cerebro'));
      var ft = el('div', 'display:flex;gap:5px;flex-wrap:wrap');
      ls.forEach(function (t) {
        var b = el('button', (self.tecId === t.id ? S.chipOn : S.chipOff), t.n);
        b.title = t.resumen;
        b.onclick = function () {
          self.tecId = t.id; self.sincronizar(); self.refrescar(); self.animar();
        };
        ft.appendChild(b);
      });
      p.appendChild(ft);

      /* Tres maneras de mirar el mismo trabajo: el maniquí en color, el
         diagrama de divisiones que se copia en la cabeza real, y la lámina de
         antes y después que la alumna enseña a su clienta. */
      var vistas = [{ id: 'maniqui', n: 'Maniquí' }];
      if (window.EU_DIVISIONES && EU_DIVISIONES.tiene(this.tecId)) vistas.push({ id: 'diagrama', n: 'Diagrama de divisiones' });
      vistas.push({ id: 'mandala', n: 'Mandala' });
      vistas.push({ id: 'concepto', n: 'Conceptual' });
      vistas.push({ id: 'antes', n: 'Antes y después' });
      p.appendChild(el('label', S.rot + ';margin-top:12px', 'Vista'));
      var fv = el('div', 'display:flex;gap:5px;flex-wrap:wrap');
      vistas.forEach(function (v) {
        var b = el('button', (self.vista === v.id ? S.chipOn : S.chipOff), v.n);
        b.onclick = function () { self.vista = v.id; self.refrescar(); self.animar(); };
        fv.appendChild(b);
      });
      p.appendChild(fv);
      if (this.vista === 'diagrama' && window.EU_DIVISIONES && EU_DIVISIONES.tiene(this.tecId)) {
        var lm = EU_DIVISIONES.laminasDe(this.tecId);
        p.appendChild(el('div', 'font-size:10.5px;color:#7c7c9e;line-height:1.5;margin-top:5px',
          lm.length + ' lámina' + (lm.length > 1 ? 's' : '') + ': ' + lm.map(function (l) { return l.n; }).join(' · ')));
      }

      if (this.tec) {
        p.appendChild(el('div', 'font-size:10.5px;color:#7c7c9e;line-height:1.5;margin-top:5px', this.tec.resumen));
        var ds = EU_CEREBRO.divisiones(this.tecId);
        if (ds.length) {
          p.appendChild(el('label', S.rot + ';margin-top:12px', 'Divisiones (' + ds.length + ')'));
          var fd = el('div', 'display:flex;gap:4px;flex-wrap:wrap');
          ds.forEach(function (d) {
            var c = el('span', 'font-size:10.5px;color:#cbd5e1;background:#1a1a35;border:1px solid #2d2d4a;border-radius:6px;padding:3px 7px', d.n);
            c.title = d.d || '';
            fd.appendChild(c);
          });
          p.appendChild(fd);
        }
        var pas = EU_CEREBRO.pasos(this.tecId);
        var nrep = EU_CEREBRO.repaso(this.tecId).length;
        p.appendChild(el('div', 'font-size:10.5px;color:#7c7c9e;margin-top:8px',
          pas.length + (pas.length === 1 ? ' paso · ' : ' pasos · ') + EU_CEREBRO.duracion(this.tecId) + ' s de animación · ' +
          nrep + (nrep === 1 ? ' pregunta de repaso' : ' preguntas de repaso')));

        /* Balayage y sombré: la altura de arranque del barrido, en tanto
           por ciento del largo. Lo que pediste, de 20 a 90. */
        var pin = this.tec.pintado;
        if (pin && pin.ajustable) {
          var c2 = this.cfg.color;
          var rot = el('label', S.rot + ';margin-top:12px',
            'Arranque del barrido · ' + Math.round((c2.desde != null ? c2.desde : pin.desde) * 100) + '%');
          p.appendChild(rot);
          var r2 = el('input', 'width:100%;accent-color:#a855f7');
          r2.type = 'range';
          r2.min = Math.round((pin.min != null ? pin.min : 0.2) * 100);
          r2.max = Math.round((pin.max != null ? pin.max : 0.9) * 100);
          r2.step = 5;
          r2.value = Math.round((c2.desde != null ? c2.desde : pin.desde) * 100);
          r2.oninput = function () {
            c2.desde = parseInt(r2.value, 10) / 100;
            rot.textContent = 'Arranque del barrido · ' + r2.value + '%';
            self.pintar();
          };
          p.appendChild(r2);
          p.appendChild(el('div', 'font-size:10.5px;color:#7c7c9e;line-height:1.5;margin-top:4px',
            'Cuanto más bajo, más lejos de la raíz empieza el aclarado y más natural se ve.'));
        }
      }
      p.appendChild(el('div', 'height:1px;background:#2d2d4a;margin:14px 0'));
    }

    /* Las láminas de teoría: se elige cuál y se dibuja sola. */
    panelConcepto(p) {
      var self = this;
      p.appendChild(el('div', 'height:1px;background:#2d2d4a;margin:14px 0'));
      var idAct = self.conceptoId || 'rueda', actual = null;
      CONCEPTUALES.forEach(function (c) { if (c.id === idAct) actual = c; });
      if (!self.cDisc) self.cDisc = (actual && actual.disc) || 'color';

      p.appendChild(el('label', S.rot, 'Disciplina'));
      var fd = el('div', 'display:flex;gap:4px;flex-wrap:wrap');
      DISCIPLINAS.forEach(function (d) {
        var hay = CONCEPTUALES.some(function (c) { return c.disc === d.id; });
        if (!hay) return;
        var b = el('button', (self.cDisc === d.id ? S.chipOn : S.chipOff), d.n);
        b.onclick = function () { self.cDisc = d.id; self.refrescar(); };
        fd.appendChild(b);
      });
      p.appendChild(fd);

      var lista = CONCEPTUALES.filter(function (c) { return c.disc === self.cDisc; });
      p.appendChild(el('label', S.rot + ';margin-top:12px', 'Diagrama · ' + lista.length + ' de ' + CONCEPTUALES.length));
      var fc = el('div', 'display:flex;gap:4px;flex-wrap:wrap');
      lista.forEach(function (c) {
        var b = el('button', (idAct === c.id ? S.chipOn : S.chipOff), c.n);
        b.onclick = function () { self.conceptoId = c.id; self.refrescar(); };
        fc.appendChild(b);
      });
      p.appendChild(fc);
      p.appendChild(el('div', 'font-size:10.5px;color:#7c7c9e;line-height:1.5;margin-top:7px',
        'Son las láminas de teoría: explican el porqué, no el cómo. Llevan el sello del negocio y se descargan igual que las demás.'));
    }

    /* El mandala, editable de arriba abajo: coronas, sectores, sentido,
       tono de cada corona y lo que dice la leyenda. */
    panelMandala(p) {
      var self = this, mn = this.cfg.mandala;
      p.appendChild(el('div', 'height:1px;background:#2d2d4a;margin:14px 0'));

      var actual = null;
      MODELOS_MANDALA.forEach(function (m) { if (m.id === mn.modelo) actual = m; });
      if (!this.mDisc) this.mDisc = (actual && actual.disc) || 'color';

      p.appendChild(el('label', S.rot, 'Disciplina'));
      var fdm = el('div', 'display:flex;gap:4px;flex-wrap:wrap');
      DISCIPLINAS.forEach(function (d) {
        var hay = MODELOS_MANDALA.some(function (m) { return m.disc === d.id; });
        if (!hay) return;
        var b = el('button', (self.mDisc === d.id ? S.chipOn : S.chipOff), d.n);
        b.onclick = function () { self.mDisc = d.id; self.refrescar(); };
        fdm.appendChild(b);
      });
      p.appendChild(fdm);

      var listaM = MODELOS_MANDALA.filter(function (m) { return m.disc === self.mDisc; });
      p.appendChild(el('label', S.rot + ';margin-top:12px', 'Modelo · ' + listaM.length + ' de ' + MODELOS_MANDALA.length));
      var fm = el('div', 'display:flex;gap:4px;flex-wrap:wrap');
      listaM.forEach(function (m) {
        var b = el('button', (mn.modelo === m.id ? S.chipOn : S.chipOff), m.n);
        b.onclick = function () {
          /* Aplicar un modelo reescribe la lámina entera; después todo sigue
             siendo editable palabra por palabra. */
          mn.modelo = m.id;
          mn.numerar = m.numerar !== false;
          mn.coronas = m.coronas; mn.sectores = m.sectores;
          mn.sentido = m.sentido; mn.arranque = m.arranque; mn.orden = m.orden;
          mn.tonos = m.tonos.slice(); mn.nombres = m.nombres.slice(); mn.notas = m.notas.slice();
          self.refrescar();
        };
        fm.appendChild(b);
      });
      p.appendChild(fm);

      p.appendChild(el('label', S.rot + ';margin-top:12px', 'Coronas'));
      var fc = el('div', 'display:flex;gap:5px;flex-wrap:wrap');
      [2, 3, 4, 5].forEach(function (n) {
        var b = el('button', (mn.coronas === n ? S.chipOn : S.chipOff), String(n));
        b.onclick = function () { mn.coronas = n; self.refrescar(); };
        fc.appendChild(b);
      });
      p.appendChild(fc);

      p.appendChild(el('label', S.rot + ';margin-top:12px', 'Sectores'));
      var fs2 = el('div', 'display:flex;gap:5px;flex-wrap:wrap');
      [4, 6, 8, 10, 12, 16].forEach(function (n) {
        var b = el('button', (mn.sectores === n ? S.chipOn : S.chipOff), String(n));
        b.onclick = function () { mn.sectores = n; self.refrescar(); };
        fs2.appendChild(b);
      });
      p.appendChild(fs2);

      p.appendChild(el('label', S.rot + ';margin-top:12px', 'Sentido y orden'));
      var fo = el('div', 'display:flex;gap:5px;flex-wrap:wrap');
      [{ id: 'reloj', n: 'Con el reloj' }, { id: 'anti', n: 'Contra el reloj' }].forEach(function (o) {
        var b = el('button', (mn.sentido === o.id ? S.chipOn : S.chipOff), o.n);
        b.onclick = function () { mn.sentido = o.id; self.refrescar(); };
        fo.appendChild(b);
      });
      var bn = el('button', (mn.numerar ? S.chipOn : S.chipOff), mn.numerar ? 'Numerado' : 'Sin números');
      bn.onclick = function () { mn.numerar = !mn.numerar; self.refrescar(); };
      fo.appendChild(bn);
      p.appendChild(fo);

      p.appendChild(el('label', S.rot + ';margin-top:12px', 'Por dónde se empieza'));
      var fa = el('div', 'display:flex;gap:5px;flex-wrap:wrap');
      [{ id: 'frente', n: 'Frente' }, { id: 'nuca', n: 'Nuca' },
       { id: 'izquierda', n: 'Lateral izq.' }, { id: 'derecha', n: 'Lateral der.' }].forEach(function (o) {
        var b = el('button', ((mn.arranque || 'frente') === o.id ? S.chipOn : S.chipOff), o.n);
        b.onclick = function () { mn.arranque = o.id; self.refrescar(); };
        fa.appendChild(b);
      });
      p.appendChild(fa);

      p.appendChild(el('label', S.rot + ';margin-top:12px', 'Recorrido'));
      var fr2 = el('div', 'display:flex;gap:5px;flex-wrap:wrap');
      [{ id: 'correlativo', n: 'Vecino a vecino' }, { id: 'alterno', n: 'Al opuesto' },
       { id: 'espiral', n: 'En espiral' }].forEach(function (o) {
        var b = el('button', ((mn.orden || 'correlativo') === o.id ? S.chipOn : S.chipOff), o.n);
        b.onclick = function () { mn.orden = o.id; self.refrescar(); };
        fr2.appendChild(b);
      });
      p.appendChild(fr2);

      var est = 'width:100%;box-sizing:border-box;background:#1a1a35;border:1px solid #2d2d4a;' +
        'color:#e8e8f5;border-radius:7px;padding:7px 9px;font-size:11.5px;font-family:inherit';
      for (var i = 0; i < mn.coronas; i++) {
        (function (i) {
          p.appendChild(el('div', 'font-size:9.5px;letter-spacing:.16em;color:#b0873c;font-weight:700;margin:13px 0 2px',
            'CORONA ' + (i + 1)));
          var ni = el('input', est);
          ni.value = mn.nombres[i] || '';
          ni.placeholder = 'Nombre de la corona';
          ni.oninput = function () { mn.nombres[i] = ni.value; self.pintar(); };
          p.appendChild(ni);
          var na = el('textarea', est + ';min-height:44px;resize:vertical;line-height:1.5;margin-top:5px');
          na.value = mn.notas[i] || '';
          na.placeholder = 'Para qué sirve esta corona';
          na.oninput = function () { mn.notas[i] = na.value; self.pintar(); };
          p.appendChild(na);
          var ft2 = el('div', 'display:grid;grid-template-columns:repeat(6,1fr);gap:4px;margin-top:5px');
          TONOS.forEach(function (t) {
            var b = el('button', 'height:22px;border-radius:5px;cursor:pointer;border:2px solid ' +
              (mn.tonos[i] === t.c ? '#a855f7' : 'transparent') + ';background:' + t.c);
            b.title = t.n;
            b.onclick = function () { mn.tonos[i] = t.c; self.refrescar(); };
            ft2.appendChild(b);
          });
          p.appendChild(ft2);
        })(i);
      }

      p.appendChild(el('div', 'font-size:10.5px;color:#7c7c9e;line-height:1.5;margin-top:9px',
        'La leyenda y la frase de cómo se lee se escriben solas con lo que pongas aquí. La flecha marca el sentido y la marca de la frente orienta la cabeza.'));
    }

    /* Las dos fotos de la lámina de antes y después. */
    panelPar(p) {
      var self = this;
      this.par = this.par || {};
      p.appendChild(el('div', 'height:1px;background:#2d2d4a;margin:14px 0'));
      p.appendChild(el('label', S.rot, 'Fotos del antes y el después'));
      [{ k: 'antes', n: 'Antes' }, { k: 'despues', n: 'Después' }].forEach(function (o) {
        var fila = el('div', 'display:flex;gap:5px;align-items:center;margin-top:7px');
        fila.appendChild(el('span', 'font-size:11.5px;color:#b8b8d4;width:56px', o.n));
        var inp = document.createElement('input');
        inp.type = 'file'; inp.accept = 'image/*'; inp.style.display = 'none';
        inp.onchange = function () { if (inp.files && inp.files[0]) self.cargarPar(inp.files[0], o.k); };
        var b = el('button', self.par[o.k] ? S.chipOn : S.chipOff, self.par[o.k] ? 'Cambiar' : 'Subir');
        b.onclick = function () { inp.click(); };
        fila.appendChild(b);
        if (self.par[o.k]) {
          var bq = el('button', S.chipOff, 'Quitar');
          bq.onclick = function () { delete self.par[o.k]; self.guardarPar(); self.refrescar(); };
          fila.appendChild(bq);
        }
        fila.appendChild(inp);
        p.appendChild(fila);
      });
      p.appendChild(el('div', 'font-size:10.5px;color:#7c7c9e;line-height:1.5;margin-top:7px',
        'Las dos se recortan al mismo encuadre y a la misma altura, aunque vengan de móviles distintos. Debajo salen los datos de la ficha que justifican el resultado.'));
    }

    /* Subir una imagen de referencia o del trabajo real y colocarla en
       cualquiera de los nueve huecos de la lámina, al tamaño que se quiera. */
    panelFoto(p) {
      var self = this;
      p.appendChild(el('label', S.rot + ';margin-top:12px', 'Imagen de referencia'));
      var fila = el('div', 'display:flex;gap:5px;flex-wrap:wrap;align-items:center');
      var inp = document.createElement('input');
      inp.type = 'file'; inp.accept = 'image/*'; inp.style.display = 'none';
      inp.onchange = function () { if (inp.files && inp.files[0]) self.cargarFoto(inp.files[0]); };
      var bs = el('button', S.chipOff, this.foto ? 'Cambiar' : 'Subir imagen');
      bs.onclick = function () { inp.click(); };
      fila.appendChild(bs);
      if (this.foto) {
        var bq = el('button', S.chipOff, 'Quitar');
        bq.onclick = function () {
          self.foto = null;
          try { localStorage.removeItem('eu_estudio_foto'); } catch (e) { }
          self.refrescar();
        };
        fila.appendChild(bq);
      }
      fila.appendChild(inp);
      p.appendChild(fila);

      if (!this.foto) {
        p.appendChild(el('div', 'font-size:10.5px;color:#7c7c9e;line-height:1.5;margin-top:5px',
          'Sube una foto de referencia o del trabajo real. Después eliges dónde va y de qué tamaño, para que no le quite sitio al diseño.'));
        return;
      }

      /* Rejilla de tres por tres: se pulsa el hueco de la lámina donde debe ir. */
      p.appendChild(el('label', S.rot + ';margin-top:12px', 'Dónde va'));
      var rej = el('div', 'display:grid;grid-template-columns:repeat(3,1fr);gap:4px');
      ORDEN_POS.forEach(function (id) {
        var puesto = self.foto.pos === id;
        var b = el('button', 'height:30px;border-radius:6px;cursor:pointer;font-size:0;padding:0;' +
          'border:1.5px solid ' + (puesto ? '#b0873c' : '#2d2d4a') + ';' +
          'background:' + (puesto ? 'rgba(176,135,60,.22)' : '#191932') + ';' +
          'display:flex;align-items:center;justify-content:center');
        b.title = NOMBRE_POS[id];
        b.appendChild(el('span', 'width:13px;height:9px;border-radius:2px;background:' +
          (puesto ? '#d8ab55' : '#3c3c60')));
        b.onclick = function () { self.foto.pos = id; self.guardarFoto(); self.refrescar(); };
        rej.appendChild(b);
      });
      p.appendChild(rej);

      p.appendChild(el('label', S.rot + ';margin-top:12px',
        'Tamaño · ' + Math.round((this.foto.tam || 0.17) * 100) + '% del ancho'));
      var r = document.createElement('input');
      r.type = 'range'; r.min = 8; r.max = 40; r.step = 1;
      r.style.cssText = 'width:100%;accent-color:#b0873c';
      r.value = Math.round((this.foto.tam || 0.17) * 100);
      r.oninput = function () {
        self.foto.tam = parseInt(r.value, 10) / 100;
        self.guardarFoto();
        self.pintar();
      };
      r.onchange = function () { self.refrescar(); };
      p.appendChild(r);
      p.appendChild(el('div', 'font-size:10.5px;color:#7c7c9e;line-height:1.5;margin-top:5px',
        'Viaja en el PNG, el PDF y el vídeo, en el hueco y al tamaño que dejes aquí.'));
    }

    filaTonos(cont, rot, campo, campoN) {
      var self = this, c = this.cfg.color;
      cont.appendChild(el('label', S.rot + ';margin-top:12px', rot));
      var f = el('div', 'display:grid;grid-template-columns:repeat(6,1fr);gap:5px');
      TONOS.forEach(function (t) {
        var b = el('button', 'height:26px;border-radius:6px;cursor:pointer;border:2px solid ' +
          (c[campo] === t.c ? '#a855f7' : 'transparent') + ';background:' + t.c);
        b.title = t.n;
        b.onclick = function () { c[campo] = t.c; c[campoN] = t.n; self.refrescar(); self.animar(); };
        f.appendChild(b);
      });
      cont.appendChild(f);
      cont.appendChild(el('div', 'font-size:10.5px;color:#7c7c9e;margin-top:4px', c[campoN]));
    }

    leerFicha() {
      var base = { puesta: true, enlace: '' };
      CAMPOS_FICHA.forEach(function (cp) { base[cp.k] = ''; });
      try {
        var g = JSON.parse(localStorage.getItem(CLAVE_FICHA) || '{}');
        return Object.assign(base, g || {});
      } catch (e) { return base; }
    }

    guardarFicha() {
      try { localStorage.setItem(CLAVE_FICHA, JSON.stringify(this.cfg.ficha)); } catch (e) { }
    }

    panelColor(p) {
      var self = this, c = this.cfg.color;
      /* La técnica ya la elige el selector del Cerebro, arriba del panel. */
      this.filaTonos(p, 'Raíz', 'raiz', 'raizN');
      this.filaTonos(p, 'Medios', 'medios', 'mediosN');
      this.filaTonos(p, 'Puntas', 'puntas', 'puntasN');

      p.appendChild(el('label', S.rot + ';margin-top:12px', 'Exposición · ' + c.minutos + ' min'));
      var r = el('input', 'width:100%;accent-color:#a855f7');
      r.type = 'range'; r.min = 10; r.max = 60; r.step = 5; r.value = c.minutos;
      r.oninput = function () { c.minutos = parseInt(r.value, 10); self.refrescar(); };
      p.appendChild(r);

    }

    /* Ficha técnica: acompaña a la lámina en todo lo que se descargue. */
    /* Maquillaje comparte lienzo con cejas pero no ficha: cada disciplina
       pregunta lo que de verdad se apunta en su hoja de trabajo. */
    discFicha() { return this.fam === 'maquillaje' ? 'maquillaje' : this.disc; }

    panelFicha(p) {
      var self = this, f = this.cfg.ficha, disc = this.discFicha();
      p.appendChild(el('div', 'height:1px;background:#2d2d4a;margin:14px 0'));
      var cab = el('div', 'display:flex;align-items:center;gap:8px');
      cab.appendChild(el('span', S.rot + ';flex:1;margin:0', 'Ficha técnica'));
      var bp = el('button', (f.puesta ? S.chipOn : S.chipOff), f.puesta ? 'Puesta' : 'Quitada');
      bp.onclick = function () { f.puesta = !f.puesta; self.guardarFicha(); self.refrescar(); };
      cab.appendChild(bp);
      p.appendChild(cab);
      if (!f.puesta) return;

      var estCampo = 'width:100%;box-sizing:border-box;background:#1a1a35;border:1px solid #2d2d4a;' +
        'color:#e8e8f5;border-radius:7px;padding:7px 9px;font-size:11.5px;font-family:inherit';

      BLOQUES_FICHA.forEach(function (bl) {
        var suyos = CAMPOS_FICHA.filter(function (cp) { return cp.b === bl && campoAplica(cp, disc); });
        if (!suyos.length) return;
        p.appendChild(el('div', 'font-size:9.5px;letter-spacing:.16em;color:#b0873c;font-weight:700;margin:13px 0 2px', bl.toUpperCase()));
        CAMPOS_FICHA.filter(function (cp) { return cp.b === bl && campoAplica(cp, disc); }).forEach(function (cp) {
          p.appendChild(el('label', S.rot + ';margin-top:8px', cp.r));
          var i;
          if (cp.op) {
            i = el('select', estCampo + ';cursor:pointer');
            cp.op.forEach(function (o) {
              var op = document.createElement('option');
              op.value = o; op.textContent = o || '— sin indicar —';
              i.appendChild(op);
            });
            i.value = f[cp.k] || '';
            i.onchange = function () { f[cp.k] = i.value; self.guardarFicha(); self.pintar(); };
          } else {
            i = el(cp.alto ? 'textarea' : 'input',
              estCampo + (cp.alto ? ';min-height:52px;resize:vertical;line-height:1.5' : ''));
            i.value = f[cp.k] || '';
            i.placeholder = cp.ph || '';
            i.oninput = function () { f[cp.k] = i.value; self.guardarFicha(); self.pintar(); };
          }
          p.appendChild(i);
        });
      });

      p.appendChild(el('div', 'font-size:9.5px;letter-spacing:.16em;color:#b0873c;font-weight:700;margin:13px 0 2px', 'ENLACE'));
      p.appendChild(el('label', S.rot + ';margin-top:8px', 'Enlace para el QR'));
      var iq = el('input', estCampo);
      iq.value = f.enlace || '';
      iq.placeholder = 'https:// o https://wa.me/34...';
      iq.oninput = function () { f.enlace = iq.value; self.guardarFicha(); self.pintar(); };
      p.appendChild(iq);

      p.appendChild(el('div', 'font-size:10.5px;color:#7c7c9e;line-height:1.5;margin-top:9px',
        'Solo se imprime lo que rellenes: los huecos vacíos no salen. Va en la lámina, en el PDF y en el vídeo, con el QR en la esquina. Los datos se recuerdan en este dispositivo.'));
    }

    panelCejas(p) {
      var self = this, c = this.cfg.cejas;
      p.appendChild(el('label', S.rot, 'Forma'));
      var ff = el('div', 'display:flex;gap:5px;flex-wrap:wrap');
      FORMAS_CEJA.forEach(function (f) {
        var b = el('button', (c.forma === f.id ? S.chipOn : S.chipOff), f.n);
        b.onclick = function () { c.forma = f.id; self.refrescar(); self.animar(); };
        ff.appendChild(b);
      });
      p.appendChild(ff);

      p.appendChild(el('label', S.rot + ';margin-top:12px', 'Grosor · ' + Math.round(c.grosor * 100) + '%'));
      var r = el('input', 'width:100%;accent-color:#a855f7');
      r.type = 'range'; r.min = 0; r.max = 100; r.step = 5; r.value = Math.round(c.grosor * 100);
      r.oninput = function () { c.grosor = parseInt(r.value, 10) / 100; self.refrescar(); };
      p.appendChild(r);

      p.appendChild(el('label', S.rot + ';margin-top:12px', 'Tono del pelo'));
      var f2 = el('div', 'display:grid;grid-template-columns:repeat(6,1fr);gap:5px');
      TONOS.slice(0, 9).forEach(function (t) {
        var b = el('button', 'height:26px;border-radius:6px;cursor:pointer;border:2px solid ' +
          (c.tono === t.c ? '#a855f7' : 'transparent') + ';background:' + t.c);
        b.title = t.n;
        b.onclick = function () { c.tono = t.c; c.tonoN = t.n; self.refrescar(); self.animar(); };
        f2.appendChild(b);
      });
      p.appendChild(f2);
      p.appendChild(el('div', 'font-size:10.5px;color:#7c7c9e;line-height:1.5;margin-top:8px',
        'El mapeo sale del ala de la nariz: es la referencia que no se mueve aunque la cara sea asimétrica.'));
    }

    panelPestanas(p) {
      var self = this, c = this.cfg.pestanas;
      p.appendChild(el('label', S.rot, 'Efecto'));
      var fe = el('div', 'display:flex;gap:5px;flex-wrap:wrap');
      EFECTOS.forEach(function (e2) {
        var b = el('button', (c.efecto === e2.id ? S.chipOn : S.chipOff), e2.n);
        b.onclick = function () { c.efecto = e2.id; c.mm = e2.mm.slice(); self.refrescar(); self.animar(); };
        fe.appendChild(b);
      });
      p.appendChild(fe);

      p.appendChild(el('label', S.rot + ';margin-top:12px', 'Curvatura'));
      var fc = el('div', 'display:flex;gap:5px;flex-wrap:wrap');
      CURVAS.forEach(function (cu) {
        var b = el('button', (c.curva === cu.id ? S.chipOn : S.chipOff), cu.n);
        b.onclick = function () { c.curva = cu.id; self.refrescar(); self.animar(); };
        fc.appendChild(b);
      });
      p.appendChild(fc);

      p.appendChild(el('label', S.rot + ';margin-top:12px', 'Milímetros por zona'));
      c.mm.forEach(function (v, i) {
        var fila = el('div', 'display:flex;align-items:center;gap:7px;margin-bottom:4px');
        fila.appendChild(el('span', 'font-size:10.5px;color:#7c7c9e;width:22px', 'Z' + (i + 1)));
        var r = el('input', 'flex:1;accent-color:#a855f7');
        r.type = 'range'; r.min = 6; r.max = 16; r.step = 1; r.value = v;
        r.oninput = function () { c.mm[i] = parseInt(r.value, 10); self.refrescar(); };
        fila.appendChild(r);
        fila.appendChild(el('span', 'font-size:11px;color:#e8e8f5;width:38px;text-align:right', v + ' mm'));
        p.appendChild(fila);
      });

      p.appendChild(el('label', S.rot + ';margin-top:12px', 'Grosor · ' + c.grosorMm + ' mm'));
      var rg = el('input', 'width:100%;accent-color:#a855f7');
      rg.type = 'range'; rg.min = 3; rg.max = 25; rg.step = 1; rg.value = Math.round(c.grosorMm * 100);
      rg.oninput = function () { c.grosorMm = parseInt(rg.value, 10) / 100; self.refrescar(); };
      p.appendChild(rg);
    }

    /* ── descargas ── */
    mimeSel() {
      return this.fmt === 'jpg' ? ['image/jpeg', 'jpg'] : (this.fmt === 'webp' ? ['image/webp', 'webp'] : ['image/png', 'png']);
    }

    nombre() {
      return 'estudio-' + (this.tecId || this.fam || 'lamina');
    }

    bajar(url, nom) {
      if (window.B6Bandeja) B6Bandeja.apuntar(url, nom, 'estudios');
      var a = document.createElement('a');
      a.href = url; a.download = nom;
      document.body.appendChild(a); a.click();
      setTimeout(function () { a.remove(); }, 500);
    }

    bajarLamina() {
      var m = this.mimeSel();
      this.bajar(this.cv.toDataURL(m[0], 0.95), this.nombre() + '.' + m[1]);
      this.aviso('Lámina descargada en ' + m[1].toUpperCase() + ' a ' + this.cv.width + '×' + this.cv.height + '.');
    }

    /* Seis instantes del proceso: sirve de lámina de estudio impresa. */
    bajarSecuencia() {
      var self = this, m = this.mimeSel();
      var tG = this.t;
      var pasos = [0.16, 0.34, 0.52, 0.70, 0.86, 1];
      pasos.forEach(function (p, k) {
        setTimeout(function () {
          self.t = p;
          self.pintar();
          self.bajar(self.cv.toDataURL(m[0], 0.95), self.nombre() + '-' + String(k + 1).padStart(2, '0') + '.' + m[1]);
          if (k === pasos.length - 1) { self.t = tG; self.pintar(); }
        }, k * 420);
      });
      this.aviso('Seis momentos del proceso, uno por archivo, en ' + m[1].toUpperCase() + '.');
    }

    pdf() {
      var jsPDF = window.jspdf && window.jspdf.jsPDF;
      if (!jsPDF) return this.aviso('El PDF necesita conexión la primera vez.');
      var doc = new jsPDF({ orientation: 'l', unit: 'mm', format: 'a4' });
      var W = 297, H = 210;
      var fr = this.narracion();
      var tG = this.t;
      var pasos = [0.2, 0.45, 0.7, 1];
      var self = this;
      pasos.forEach(function (p, k) {
        self.t = p; self.pintar();
        if (k) doc.addPage();
        doc.setFillColor(255, 255, 255); doc.rect(0, 0, W, H, 'F');
        doc.setFillColor(124, 58, 237); doc.rect(0, 0, W, 4, 'F');
        doc.setTextColor(124, 58, 237); doc.setFont('helvetica', 'bold'); doc.setFontSize(9);
        doc.text('MOMENTO ' + (k + 1) + ' DE ' + pasos.length, 14, 15);
        doc.setTextColor(28, 28, 44); doc.setFontSize(15);
        doc.text(doc.splitTextToSize(self.famN() + (self.tec ? ' · ' + self.tec.n : ''), 200), 46, 15);
        doc.addImage(self.cv.toDataURL('image/jpeg', 0.93), 'JPEG', 14, 22, 269, 269 * 720 / 1280);
        doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.setTextColor(45, 45, 65);
        var idx = Math.min(fr.length - 1, Math.floor(p * fr.length));
        doc.text(doc.splitTextToSize(fr[idx], 269), 14, 22 + 269 * 720 / 1280 + 12);
      });
      self.t = tG; self.pintar();
      doc.save(this.nombre() + '.pdf');
      this.aviso('PDF con cuatro momentos del proceso y su explicación.');
    }

    /* Vídeo: la animación completa, con la narración rotulada dentro y, si se
       comparte el audio de la pestaña, también con voz. */
    grabar() {
      if (this._grabando) return;
      var self = this;
      var med = MEDIDAS.filter(function (m) { return m.id === self.ratio; })[0] || MEDIDAS[0];
      var OW = med.w || this.cv.width, OH = med.h || this.cv.height;
      var out = document.createElement('canvas');
      out.width = OW; out.height = OH;
      var octx = out.getContext('2d');
      if (!out.captureStream) return this.aviso('Este navegador no sabe grabar el lienzo.');

      var fr = this.narracion();
      var palabras = fr.join(' ').split(/\s+/).length;
      var dur = clamp(palabras / 2.3 + 3, 9, 60);

      var componer = function () {
        var g = octx.createLinearGradient(0, 0, 0, OH);
        g.addColorStop(0, '#faf4e8'); g.addColorStop(1, '#efe3cd');
        octx.fillStyle = g; octx.fillRect(0, 0, OW, OH);
        var esc = Math.min(OW / self.cv.width, OH / self.cv.height) * (med.id === 'hoja' ? 1 : 0.97);
        var dw = self.cv.width * esc, dh = self.cv.height * esc;
        octx.drawImage(self.cv, (OW - dw) / 2, (OH - dh) / 2, dw, dh);
      };

      var arrancar = function (pista, pz) {
        self._grabando = true;
        self.t = 0; self.pintar(); componer();
        var mime = window.B6Voz ? B6Voz.mime(!!pista)
          : ['video/mp4;codecs=avc1.42E01E', 'video/webm'].filter(function (m) { return window.MediaRecorder && MediaRecorder.isTypeSupported(m); })[0];
        var flujo = out.captureStream(30);
        if (pista) { try { flujo.addTrack(pista); } catch (e) { } }
        var rec;
        try { rec = new MediaRecorder(flujo, mime ? { mimeType: mime, videoBitsPerSecond: 7000000, audioBitsPerSecond: 160000 } : undefined); }
        catch (err) { self._grabando = false; return self.aviso('No se ha podido grabar: ' + err.message); }
        var trozos = [];
        rec.ondataavailable = function (e) { if (e.data && e.data.size) trozos.push(e.data); };
        rec.onstop = function () {
          var tipo = (mime && mime.indexOf('mp4') >= 0) ? 'video/mp4' : 'video/webm';
          var url = URL.createObjectURL(new Blob(trozos, { type: tipo }));
          self.bajar(url, self.nombre() + '-' + (med.id) + (tipo === 'video/mp4' ? '.mp4' : '.webm'));
          setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
          if (pz) { try { pz.parar(); } catch (e) { } }
          else if (pista) { try { pista.stop(); } catch (e) { } }
          self._grabando = false;
          self.aviso('Vídeo descargado' + (pista ? ' con tu voz dentro del archivo.' : ' con la narración rotulada.') + ' Medida: ' + med.n + '.');
        };
        rec.start(250);
        if (pz) pz.empezar();
        self.aviso((pz && pz.directo ? 'Narra ahora: ' : 'Grabando ') + Math.round(dur) + ' s. No cambies de pestaña.');

        var t0 = performance.now();
        var paso = function () {
          var s = (performance.now() - t0) / 1000;
          self.t = clamp(s / dur, 0, 1);
          self.pintar();
          componer();
          if (s < dur) { requestAnimationFrame(paso); return; }
          try { speechSynthesis.cancel(); } catch (e) { }
          setTimeout(function () { try { rec.stop(); } catch (e) { } }, 350);
        };
        paso();
      };

      /* El guion viaja al módulo de voz antes de pedirle la pista: la clave de
         cada audio lleva la técnica dentro, para que la grabación siga al
         contenido y no a la posición en la lista. */
      if (window.B6Voz) {
        B6Voz.ponerGuion(this.narracion().map(function (t, i) {
          return { texto: t, clave: 'est:' + (self.tecId || 'x') + ':' + i };
        }));
      }
      if (window.B6Voz && (B6Voz.hay() || B6Voz.vivo)) {
        B6Voz.pista()
          .then(function (pz) { if (!pz) { self.aviso(B6Voz.nota || 'Sin voz disponible: sale con la narración rotulada.'); return arrancar(null); } arrancar(pz.track, pz); })
          .catch(function () { arrancar(null); });
      } else arrancar(null);
    }
  }

  if (!window.customElements.get('estudios-belleza')) window.customElements.define('estudios-belleza', Estudios);
})();

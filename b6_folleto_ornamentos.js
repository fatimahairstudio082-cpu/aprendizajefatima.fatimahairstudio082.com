/* ══════════════════════════════════════════════════════════════════════════
   FOLLETO_ORNAMENTOS · la capa elegante
   ──────────────────────────────────────────────────────────────────────────
   Los elementos que separan un folleto de cuadrícula de una pieza de
   estudio: orla botánica, frase manuscrita, insignia circular, fila de
   iconos, pincelada, barra de contacto y foto con aro.

   Dibuja sobre un ctx ya existente y SIEMPRE devuelve el contexto como
   estaba. Se apoya en FOLLETO_FORMAS para las siluetas.

   Todas las medidas se dan en píxeles del lienzo real: quien llama decide
   el tamaño, aquí sólo se dibuja.
   ══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if (window._B6_FOLLETO_ORNAMENTOS_LOADED) return;
  window._B6_FOLLETO_ORNAMENTOS_LOADED = true;

  var O = {};
  window.FOLLETO_ORNAMENTOS = O;

  function F() { return window.FOLLETO_FORMAS; }

  /* ─────────────────────────────────────────────────────────────────────
     Hoja suelta: el ladrillo de toda la decoración botánica.
     ───────────────────────────────────────────────────────────────────── */
  O.hoja = function (ctx, cx, cy, largo, ancho, giro, color, relleno) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(giro);
    ctx.beginPath();
    ctx.moveTo(-largo / 2, 0);
    ctx.bezierCurveTo(-largo / 6, -ancho, largo / 6, -ancho, largo / 2, 0);
    ctx.bezierCurveTo(largo / 6, ancho, -largo / 6, ancho, -largo / 2, 0);
    ctx.closePath();
    if (relleno) { ctx.fillStyle = color; ctx.fill(); }
    else { ctx.strokeStyle = color; ctx.lineWidth = Math.max(1, ancho * 0.14); ctx.stroke(); }
    ctx.restore();
  };

  /* Rama: un tallo curvo con hojas alternas a lo largo. «lado» invierte la
     curvatura para poder espejar la rama en la esquina opuesta. */
  O.rama = function (ctx, x, y, largo, op) {
    op = op || {};
    var color = op.color || '#C9A227';
    var lado = op.lado || 1;
    var hojas = op.hojas || 7;
    var grosor = op.grosor || Math.max(1, largo * 0.008);
    var curva = op.curva == null ? 0.42 : op.curva;

    // El tallo: una bezier que se aleja y vuelve.
    var x2 = x + largo, y2 = y - largo * 0.10 * lado;
    var c1x = x + largo * 0.30, c1y = y - largo * curva * lado;
    var c2x = x + largo * 0.72, c2y = y - largo * curva * 0.55 * lado;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(c1x, c1y, c2x, c2y, x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = grosor;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Hojas repartidas por el tallo, alternando arriba y abajo.
    for (var i = 1; i <= hojas; i++) {
      var t = i / (hojas + 1);
      var p = bezier(t, x, y, c1x, c1y, c2x, c2y, x2, y2);
      var d = bezierDir(t, x, y, c1x, c1y, c2x, c2y, x2, y2);
      var ang = Math.atan2(d.y, d.x);
      var arriba = (i % 2 === 0) ? 1 : -1;
      var lh = largo * (0.16 + (i % 3) * 0.022);
      O.hoja(ctx, p.x, p.y, lh, lh * 0.34,
        ang + arriba * lado * 0.85, color, op.rellenas !== false);
    }
    ctx.restore();
  };

  function bezier(t, x0, y0, x1, y1, x2, y2, x3, y3) {
    var u = 1 - t, a = u * u * u, b = 3 * u * u * t, c = 3 * u * t * t, d = t * t * t;
    return { x: a * x0 + b * x1 + c * x2 + d * x3, y: a * y0 + b * y1 + c * y2 + d * y3 };
  }
  function bezierDir(t, x0, y0, x1, y1, x2, y2, x3, y3) {
    var u = 1 - t, a = 3 * u * u, b = 6 * u * t, c = 3 * t * t;
    return { x: a * (x1 - x0) + b * (x2 - x1) + c * (x3 - x2),
             y: a * (y1 - y0) + b * (y2 - y1) + c * (y3 - y2) };
  }

  /* ─────────────────────────────────────────────────────────────────────
     Orla: marco botánico. Ramas en las esquinas y un arco de hojas arriba.
     ───────────────────────────────────────────────────────────────────── */
  O.orla = function (ctx, x, y, w, h, op) {
    op = op || {};
    var color = op.color || '#C9A227';
    var l = Math.min(w, h) * (op.escala || 0.42);

    ctx.save();
    ctx.globalAlpha = op.alpha == null ? 0.95 : op.alpha;

    // Arriba: dos ramas que salen del centro hacia los lados.
    if (op.arriba !== false) {
      var cx = x + w / 2, cy = y + h * 0.055;
      ctx.save(); ctx.translate(cx, cy);
      O.rama(ctx, 0, 0, l, { color: color, lado: 1, hojas: 6 });
      ctx.scale(-1, 1);
      O.rama(ctx, 0, 0, l, { color: color, lado: 1, hojas: 6 });
      ctx.restore();
    }
    // Abajo: espejo del de arriba.
    if (op.abajo !== false) {
      var bx = x + w / 2, by = y + h * 0.945;
      ctx.save(); ctx.translate(bx, by); ctx.scale(1, -1);
      O.rama(ctx, 0, 0, l * 0.72, { color: color, lado: 1, hojas: 5 });
      ctx.scale(-1, 1);
      O.rama(ctx, 0, 0, l * 0.72, { color: color, lado: 1, hojas: 5 });
      ctx.restore();
    }
    ctx.restore();
  };

  /* ─────────────────────────────────────────────────────────────────────
     Frase manuscrita, con rúbrica opcional por debajo.
     ───────────────────────────────────────────────────────────────────── */
  O.frase = function (ctx, texto, cx, y, tam, op) {
    op = op || {};
    ctx.save();
    // Sin 'italic': las manuscritas de verdad (Great Vibes y compañía) no
    // tienen cursiva, y pedirla hace que el navegador se caiga a una serif
    // inclinada. Se veia texto en serif donde debia haber letra a mano.
    ctx.font = op.fuente
      ? op.fuente.replace('{t}', tam)
      : tam + 'px "Great Vibes", "Segoe Script", cursive';
    ctx.fillStyle = op.color || '#C9A227';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(texto, cx, y);

    if (op.rubrica !== false) {
      var an = ctx.measureText(texto).width;
      ctx.beginPath();
      ctx.moveTo(cx - an * 0.42, y + tam * 0.22);
      ctx.bezierCurveTo(cx - an * 0.10, y + tam * 0.40,
                        cx + an * 0.16, y + tam * 0.06,
                        cx + an * 0.46, y + tam * 0.26);
      ctx.strokeStyle = op.colorRubrica || op.color || '#C9A227';
      ctx.lineWidth = Math.max(1.2, tam * 0.045);
      ctx.lineCap = 'round';
      ctx.stroke();
    }
    ctx.restore();
  };

  /* ─────────────────────────────────────────────────────────────────────
     Insignia circular: el «SÁBADO 30» del cartel de la expo.
     ───────────────────────────────────────────────────────────────────── */
  O.insignia = function (ctx, cx, cy, r, lineas, op) {
    op = op || {};
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = op.fondo || '#1F3D2B';
    ctx.fill();
    if (op.aro !== false) {
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.90, 0, Math.PI * 2);
      ctx.strokeStyle = op.colorAro || 'rgba(255,255,255,.30)';
      ctx.lineWidth = Math.max(1, r * 0.018);
      ctx.stroke();
    }

    // Las líneas se reparten verticalmente; la del medio manda en tamaño.
    var n = lineas.length;
    var alto = r * 1.30;
    var y0 = cy - alto / 2;
    var pesos = lineas.map(function (l) { return l.peso || 1; });
    var suma = pesos.reduce(function (a, b) { return a + b; }, 0);
    var acum = 0;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    lineas.forEach(function (l, i) {
      var trozo = (pesos[i] / suma) * alto;
      var cyL = y0 + acum + trozo / 2;
      acum += trozo;
      var tam = trozo * (l.ajuste || 0.80);
      ctx.font = (l.bold === false ? '' : '700 ') + tam + 'px ' +
        (l.fuente || '"Manrope", system-ui, sans-serif');
      ctx.fillStyle = l.color || op.tinta || '#FFFFFF';
      if (l.espaciado) ctx.letterSpacing = (tam * l.espaciado) + 'px';
      ctx.fillText(l.t, cx, cyL);
      ctx.letterSpacing = '0px';
    });
    ctx.restore();
  };

  /* ─────────────────────────────────────────────────────────────────────
     Filete: línea fina con un adorno centrado. Separa bloques con clase.
     ───────────────────────────────────────────────────────────────────── */
  O.filete = function (ctx, cx, y, ancho, op) {
    op = op || {};
    var color = op.color || '#C9A227';
    var hueco = op.hueco || ancho * 0.09;
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = op.grosor || Math.max(1, ancho * 0.004);
    ctx.beginPath();
    ctx.moveTo(cx - ancho / 2, y); ctx.lineTo(cx - hueco, y);
    ctx.moveTo(cx + hueco, y);     ctx.lineTo(cx + ancho / 2, y);
    ctx.stroke();
    // Rombo central.
    var d = hueco * 0.42;
    ctx.beginPath();
    ctx.moveTo(cx, y - d); ctx.lineTo(cx + d, y);
    ctx.lineTo(cx, y + d); ctx.lineTo(cx - d, y);
    ctx.closePath();
    ctx.fillStyle = color; ctx.fill();
    ctx.restore();
  };

  /* ─────────────────────────────────────────────────────────────────────
     Foto (o color) recortada en una forma, con aro alrededor.
     ───────────────────────────────────────────────────────────────────── */
  O.fotoEnForma = function (ctx, img, forma, x, y, w, h, op) {
    op = op || {};
    F().recortar(ctx, forma, x, y, w, h, function (c) {
      if (img) {
        // Cubrir la caja sin deformar la imagen.
        var ri = img.width / img.height, rc = w / h, dw, dh;
        if (ri > rc) { dh = h; dw = h * ri; } else { dw = w; dh = w / ri; }
        c.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
      } else {
        c.fillStyle = op.fondo || '#2A3B31';
        c.fillRect(x, y, w, h);
      }
    });
    if (op.aro !== false) {
      F().contorno(ctx, forma, x, y, w, h,
        op.colorAro || '#C9A227', op.grosorAro || Math.max(2, Math.min(w, h) * 0.020));
    }
  };

  /* ─────────────────────────────────────────────────────────────────────
     Fila de iconos: círculo + título + descripción. La del abogado.
     ───────────────────────────────────────────────────────────────────── */
  O.filaIconos = function (ctx, x, y, ancho, items, op) {
    op = op || {};
    var alto = op.alto || 0;
    var sep = op.separacion == null ? 1.0 : op.separacion;
    var r = op.radio || ancho * 0.048;
    var yy = y;
    items.forEach(function (it, i) {
      // Disco del icono.
      ctx.save();
      ctx.beginPath();
      ctx.arc(x + r, yy + r, r, 0, Math.PI * 2);
      ctx.fillStyle = op.fondoIcono || '#12294A';
      ctx.fill();
      ctx.font = (r * 1.05) + 'px system-ui';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillStyle = op.colorIcono || '#C9A227';
      ctx.fillText(it.icono || '•', x + r, yy + r + r * 0.06);
      ctx.restore();

      // Texto a la derecha del disco.
      var tx = x + r * 2.6, tw = ancho - (r * 2.6);
      ctx.save();
      ctx.textAlign = 'left'; ctx.textBaseline = 'top';
      var tt = op.tamTitulo || r * 0.72;
      ctx.font = '700 ' + tt + 'px ' + (op.fuenteTitulo || '"Manrope", system-ui, sans-serif');
      ctx.fillStyle = op.colorTitulo || '#12294A';
      if (op.espaciadoTitulo) ctx.letterSpacing = (tt * op.espaciadoTitulo) + 'px';
      ctx.fillText(String(it.titulo || '').toUpperCase(), tx, yy);
      ctx.letterSpacing = '0px';

      var yd = yy + tt * 1.35;
      if (it.desc) {
        var td = op.tamDesc || r * 0.56;
        ctx.font = td + 'px ' + (op.fuenteDesc || '"Manrope", system-ui, sans-serif');
        ctx.fillStyle = op.colorDesc || 'rgba(18,41,74,.72)';
        yd = envolver(ctx, it.desc, tx, yd, tw, td * 1.32);
      }
      ctx.restore();

      var usado = Math.max(r * 2.2, (yd - yy));
      // Filete de separación entre servicios.
      if (op.separador !== false && i < items.length - 1) {
        ctx.save();
        ctx.strokeStyle = op.colorSeparador || 'rgba(201,162,39,.42)';
        ctx.lineWidth = Math.max(1, ancho * 0.0022);
        ctx.beginPath();
        ctx.moveTo(tx, yy + usado + r * 0.30);
        ctx.lineTo(x + ancho, yy + usado + r * 0.30);
        ctx.stroke();
        ctx.restore();
      }
      yy += usado + r * 0.85 * sep;
    });
    return yy;
  };

  /* Parte el texto en líneas que quepan en «ancho». Devuelve la y final. */
  function envolver(ctx, texto, x, y, ancho, salto) {
    var palabras = String(texto).split(/\s+/), linea = '', yy = y;
    for (var i = 0; i < palabras.length; i++) {
      var prueba = linea ? linea + ' ' + palabras[i] : palabras[i];
      if (ctx.measureText(prueba).width > ancho && linea) {
        ctx.fillText(linea, x, yy); yy += salto; linea = palabras[i];
      } else linea = prueba;
    }
    if (linea) { ctx.fillText(linea, x, yy); yy += salto; }
    return yy;
  }
  O.envolver = envolver;

  /* ─────────────────────────────────────────────────────────────────────
     Barra de contacto del pie, con iconos y separador vertical.
     ───────────────────────────────────────────────────────────────────── */
  O.barraContacto = function (ctx, x, y, w, h, campos, op) {
    op = op || {};
    ctx.save();
    ctx.fillStyle = op.fondo || '#12294A';
    ctx.fillRect(x, y, w, h);

    var n = campos.length || 1;
    var anchoCol = w / n;
    campos.forEach(function (c, i) {
      var cx = x + anchoCol * i;
      var r = h * 0.15;
      ctx.beginPath();
      ctx.arc(cx + anchoCol * 0.13, y + h * 0.46, r, 0, Math.PI * 2);
      ctx.fillStyle = op.colorIcono || '#C9A227';
      ctx.fill();
      ctx.font = (r * 1.0) + 'px system-ui';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillStyle = op.fondo || '#12294A';
      ctx.fillText(c.icono || '•', cx + anchoCol * 0.13, y + h * 0.47);

      ctx.textAlign = 'left'; ctx.textBaseline = 'top';
      var te = h * 0.135;
      ctx.font = '600 ' + te + 'px "Manrope", system-ui, sans-serif';
      ctx.letterSpacing = (te * 0.10) + 'px';
      ctx.fillStyle = op.colorEtiqueta || '#C9A227';
      ctx.fillText(String(c.etiqueta || '').toUpperCase(), cx + anchoCol * 0.24, y + h * 0.22);
      ctx.letterSpacing = '0px';

      var tv = h * 0.20;
      ctx.font = '700 ' + tv + 'px "Manrope", system-ui, sans-serif';
      ctx.fillStyle = op.tinta || '#FFFFFF';
      envolver(ctx, c.valor || '', cx + anchoCol * 0.24, y + h * 0.42,
        anchoCol * 0.72, tv * 1.22);

      if (i < n - 1) {
        ctx.beginPath();
        ctx.moveTo(cx + anchoCol * 0.97, y + h * 0.20);
        ctx.lineTo(cx + anchoCol * 0.97, y + h * 0.80);
        ctx.strokeStyle = 'rgba(201,162,39,.45)';
        ctx.lineWidth = Math.max(1, w * 0.0015);
        ctx.stroke();
      }
    });
    ctx.restore();
  };

  /* ─────────────────────────────────────────────────────────────────────
     Pincelada: mancha de color detrás de un texto corto.
     ───────────────────────────────────────────────────────────────────── */
  O.pincelada = function (ctx, cx, cy, w, h, color, semilla) {
    var s = semilla || 1;
    function r(n) { s = (s * 9301 + 49297) % 233280; return (s / 233280) * n; }
    ctx.save();
    ctx.fillStyle = color || '#7C8C3F';
    ctx.beginPath();
    var x0 = cx - w / 2, x1 = cx + w / 2;
    ctx.moveTo(x0, cy - h * 0.34 + r(h * 0.10));
    ctx.bezierCurveTo(x0 + w * 0.30, cy - h * 0.62, x0 + w * 0.72, cy - h * 0.40,
                      x1, cy - h * 0.30 + r(h * 0.08));
    ctx.bezierCurveTo(x1 + w * 0.02, cy, x1 - w * 0.01, cy + h * 0.18, x1, cy + h * 0.34);
    ctx.bezierCurveTo(x0 + w * 0.70, cy + h * 0.60, x0 + w * 0.26, cy + h * 0.36,
                      x0, cy + h * 0.30);
    ctx.bezierCurveTo(x0 - w * 0.02, cy + h * 0.10, x0 - w * 0.01, cy - h * 0.12,
                      x0, cy - h * 0.34);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };
})();

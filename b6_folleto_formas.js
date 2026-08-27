/* ══════════════════════════════════════════════════════════════════════════
   FOLLETO_FORMAS · recortes con forma para cuadros y hojas
   ──────────────────────────────────────────────────────────────────────────
   Da al motor un vocabulario de siluetas (corazón, rosa, arco, hexágono…)
   para que una tarjeta o un cuadro deje de ser siempre un rectángulo.

   No dibuja nada por su cuenta: SOLO construye trazados (Path2D). Quien
   pinta sigue siendo el motor. Así una forma sirve igual para recortar una
   foto, para rellenar con color o para trazar un contorno dorado.

   API pública:
     FOLLETO_FORMAS.lista()                    → [{id, nombre, grupo}…]
     FOLLETO_FORMAS.grupos()                   → ['Romántico', 'Geométrico'…]
     FOLLETO_FORMAS.trazado(id, x, y, w, h)    → Path2D encajado en esa caja
     FOLLETO_FORMAS.recortar(ctx, id, x,y,w,h, pinta)  → pinta dentro
     FOLLETO_FORMAS.contorno(ctx, id, x,y,w,h, color, grosor)

   Todo determinista, en el dispositivo, sin dependencias.
   ══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if (window._B6_FOLLETO_FORMAS_LOADED) return;
  window._B6_FOLLETO_FORMAS_LOADED = true;

  /* Cada forma se dibuja en un lienzo imaginario de 0..1 en los dos ejes y
     luego se escala a la caja real. Así la misma silueta vale para una
     tarjeta de visita y para un A4 sin tocar una sola coordenada. */

  var FORMAS = {

    /* ── Romántico ───────────────────────────────────────────────────── */

    corazon: {
      nombre: 'Corazón', grupo: 'Romántico',
      d: function (p) {
        // Dos lóbulos superiores y una punta abajo. Los tiradores están
        // calculados para que la punta caiga centrada y no quede picuda.
        p.moveTo(0.5, 0.28);
        p.bezierCurveTo(0.5, 0.10, 0.20, 0.02, 0.09, 0.22);
        p.bezierCurveTo(-0.02, 0.42, 0.12, 0.62, 0.5, 0.96);
        p.bezierCurveTo(0.88, 0.62, 1.02, 0.42, 0.91, 0.22);
        p.bezierCurveTo(0.80, 0.02, 0.50, 0.10, 0.5, 0.28);
        p.closePath();
      }
    },

    rosa: {
      nombre: 'Rosa', grupo: 'Romántico',
      d: function (p) { festoneado(p, 6, 0.50, 0.29, -Math.PI / 2); }
    },

    flor: {
      nombre: 'Flor', grupo: 'Romántico',
      d: function (p) { festoneado(p, 8, 0.49, 0.34, -Math.PI / 2); }
    },

    petalo: {
      nombre: 'Pétalo', grupo: 'Romántico',
      d: function (p) {
        // Hoja apuntada arriba y abajo (vesica): elegante para retratos.
        p.moveTo(0.5, 0.01);
        p.bezierCurveTo(0.99, 0.30, 0.99, 0.70, 0.5, 0.99);
        p.bezierCurveTo(0.01, 0.70, 0.01, 0.30, 0.5, 0.01);
        p.closePath();
      }
    },

    /* ── Clásico ─────────────────────────────────────────────────────── */

    arco: {
      nombre: 'Arco', grupo: 'Clásico',
      d: function (p) {
        // Medio punto arriba, recto abajo. El arco más usado en carteles
        // de boda y belleza.
        p.moveTo(0, 1);
        p.lineTo(0, 0.5);
        p.arc(0.5, 0.5, 0.5, Math.PI, 0);
        p.lineTo(1, 1);
        p.closePath();
      }
    },

    arcoOjival: {
      nombre: 'Arco ojival', grupo: 'Clásico',
      d: function (p) {
        p.moveTo(0, 1);
        p.lineTo(0, 0.52);
        p.bezierCurveTo(0.02, 0.22, 0.26, 0, 0.5, 0);
        p.bezierCurveTo(0.74, 0, 0.98, 0.22, 1, 0.52);
        p.lineTo(1, 1);
        p.closePath();
      }
    },

    circulo: {
      nombre: 'Círculo', grupo: 'Clásico',
      d: function (p) { p.arc(0.5, 0.5, 0.5, 0, Math.PI * 2); }
    },

    ovalo: {
      nombre: 'Óvalo', grupo: 'Clásico',
      d: function (p) {
        p.moveTo(1, 0.5);
        p.bezierCurveTo(1, 0.79, 0.78, 1, 0.5, 1);
        p.bezierCurveTo(0.22, 1, 0, 0.79, 0, 0.5);
        p.bezierCurveTo(0, 0.21, 0.22, 0, 0.5, 0);
        p.bezierCurveTo(0.78, 0, 1, 0.21, 1, 0.5);
        p.closePath();
      }
    },

    /* ── Geométrico ──────────────────────────────────────────────────── */

    hexagono: {
      nombre: 'Hexágono', grupo: 'Geométrico',
      d: function (p) { poligono(p, 6, -Math.PI / 2); }
    },

    rombo: {
      nombre: 'Rombo', grupo: 'Geométrico',
      d: function (p) {
        p.moveTo(0.5, 0); p.lineTo(1, 0.5); p.lineTo(0.5, 1); p.lineTo(0, 0.5);
        p.closePath();
      }
    },

    escudo: {
      nombre: 'Escudo', grupo: 'Geométrico',
      d: function (p) {
        p.moveTo(0.5, 1);
        p.bezierCurveTo(0.06, 0.74, 0, 0.52, 0, 0.10);
        p.lineTo(0.5, 0);
        p.lineTo(1, 0.10);
        p.bezierCurveTo(1, 0.52, 0.94, 0.74, 0.5, 1);
        p.closePath();
      }
    },

    /* ── Orgánico ────────────────────────────────────────────────────── */

    hoja: {
      nombre: 'Hoja', grupo: 'Orgánico',
      d: function (p) {
        // Punta arriba a la derecha, base abajo a la izquierda.
        p.moveTo(0.04, 0.96);
        p.bezierCurveTo(0.04, 0.40, 0.40, 0.04, 0.96, 0.04);
        p.bezierCurveTo(0.96, 0.60, 0.60, 0.96, 0.04, 0.96);
        p.closePath();
      }
    },

    gota: {
      nombre: 'Gota', grupo: 'Orgánico',
      d: function (p) {
        p.moveTo(0.5, 0);
        p.bezierCurveTo(0.86, 0.34, 1, 0.55, 1, 0.68);
        p.bezierCurveTo(1, 0.87, 0.78, 1, 0.5, 1);
        p.bezierCurveTo(0.22, 1, 0, 0.87, 0, 0.68);
        p.bezierCurveTo(0, 0.55, 0.14, 0.34, 0.5, 0);
        p.closePath();
      }
    },

    ondas: {
      nombre: 'Onda', grupo: 'Orgánico',
      d: function (p) {
        // Rectángulo con el borde de abajo ondulado: para bandas de foto.
        p.moveTo(0, 0); p.lineTo(1, 0); p.lineTo(1, 0.84);
        p.bezierCurveTo(0.75, 1.04, 0.55, 0.72, 0.32, 0.90);
        p.bezierCurveTo(0.18, 1.01, 0.09, 0.94, 0, 0.86);
        p.closePath();
      }
    },

    /* ── Recto (los de siempre, para no perderlos) ───────────────────── */

    rect: {
      nombre: 'Rectángulo', grupo: 'Recto',
      d: function (p) { p.rect(0, 0, 1, 1); }
    },

    redondeado: {
      nombre: 'Esquinas suaves', grupo: 'Recto',
      d: function (p) { redondo(p, 0.08); }
    },

    capsula: {
      nombre: 'Cápsula', grupo: 'Recto',
      d: function (p) { redondo(p, 0.5); }
    }
  };

  /* ───────────── Ayudas de trazado ───────────── */

  /* Silueta de n pétalos en UN SOLO trazo cerrado: los valles caen a «rVal»
     y las puntas salen a «rExt». Al ser un único subtrazado, el contorno se
     dibuja por fuera y no aparecen las líneas interiores de cada pétalo. */
  function festoneado(p, n, rExt, rVal, giro) {
    var cx = 0.5, cy = 0.5, paso = (Math.PI * 2) / n, k = rExt * 1.32;
    for (var i = 0; i <= n; i++) {
      var a = giro + i * paso;
      var x = cx + Math.cos(a) * rVal, y = cy + Math.sin(a) * rVal;
      if (i === 0) { p.moveTo(x, y); continue; }
      var am = a - paso / 2;
      p.bezierCurveTo(
        cx + Math.cos(am - paso * 0.30) * k, cy + Math.sin(am - paso * 0.30) * k,
        cx + Math.cos(am + paso * 0.30) * k, cy + Math.sin(am + paso * 0.30) * k,
        x, y);
    }
    p.closePath();
  }

  function poligono(p, n, giro) {
    for (var i = 0; i < n; i++) {
      var a = giro + (i / n) * Math.PI * 2;
      var x = 0.5 + Math.cos(a) * 0.5, y = 0.5 + Math.sin(a) * 0.5;
      if (i === 0) p.moveTo(x, y); else p.lineTo(x, y);
    }
    p.closePath();
  }

  /* Radio en fracción del lado corto, para que no se deforme en cajas
     muy alargadas. */
  function redondo(p, r) {
    r = Math.min(r, 0.5);
    p.moveTo(r, 0);
    p.lineTo(1 - r, 0); p.quadraticCurveTo(1, 0, 1, r);
    p.lineTo(1, 1 - r); p.quadraticCurveTo(1, 1, 1 - r, 1);
    p.lineTo(r, 1);     p.quadraticCurveTo(0, 1, 0, 1 - r);
    p.lineTo(0, r);     p.quadraticCurveTo(0, 0, r, 0);
    p.closePath();
  }

  /* ───────────── API ───────────── */

  var F = {};
  window.FOLLETO_FORMAS = F;

  F.lista = function () {
    return Object.keys(FORMAS).map(function (id) {
      return { id: id, nombre: FORMAS[id].nombre, grupo: FORMAS[id].grupo };
    });
  };

  F.grupos = function () {
    var g = [];
    F.lista().forEach(function (f) { if (g.indexOf(f.grupo) < 0) g.push(f.grupo); });
    return g;
  };

  F.existe = function (id) { return !!FORMAS[id]; };
  F.nombre = function (id) { return FORMAS[id] ? FORMAS[id].nombre : id; };

  /* Devuelve el trazado ya escalado y movido a la caja pedida. Si la forma
     no existe se cae al rectángulo: nunca se queda sin dibujar. */
  F.trazado = function (id, x, y, w, h) {
    var forma = FORMAS[id] || FORMAS.rect;
    var unidad = new Path2D();
    forma.d(unidad);
    var m = (typeof DOMMatrix === 'function') ? new DOMMatrix() : null;
    var salida = new Path2D();
    if (m) {
      salida.addPath(unidad, m.translateSelf(x, y).scaleSelf(w, h));
      return salida;
    }
    // Navegador sin DOMMatrix: se pinta con transformación del contexto.
    return unidad;
  };

  /* Pinta lo que haga «pinta» recortado a la forma. Deja el contexto como
     estaba, pase lo que pase. */
  F.recortar = function (ctx, id, x, y, w, h, pinta) {
    ctx.save();
    try {
      if (typeof DOMMatrix === 'function') {
        ctx.clip(F.trazado(id, x, y, w, h));
      } else {
        ctx.translate(x, y); ctx.scale(w, h);
        ctx.clip(F.trazado(id, 0, 0, 1, 1));
        ctx.setTransform(1, 0, 0, 1, 0, 0);
      }
      pinta(ctx);
    } finally {
      ctx.restore();
    }
  };

  /* Contorno de la forma (el aro dorado alrededor de la foto). */
  F.contorno = function (ctx, id, x, y, w, h, color, grosor) {
    ctx.save();
    ctx.strokeStyle = color || '#C9A227';
    ctx.lineWidth = grosor || Math.max(1, Math.min(w, h) * 0.012);
    ctx.lineJoin = 'round';
    if (typeof DOMMatrix === 'function') {
      ctx.stroke(F.trazado(id, x, y, w, h));
    } else {
      ctx.translate(x, y); ctx.scale(w, h);
      ctx.lineWidth = ctx.lineWidth / Math.min(w, h);
      ctx.stroke(F.trazado(id, 0, 0, 1, 1));
    }
    ctx.restore();
  };
})();

/* ══════════════════════════════════════════════════════════════════
   ESTUDIO UNIVERSAL · PLAN Y MURO DE PAGO
   ------------------------------------------------------------------
   Regla de oro del diseño: el muro aparece al DESCARGAR, nunca al
   diseñar. Primero la persona ve su folleto terminado.

   El plan lo pone la administración en usuarios/{uid}.plan, igual que
   hoy con los créditos. Desde el cliente no se puede subir.
   ══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if (window._EU_PLAN_LOADED) return;
  window._EU_PLAN_LOADED = true;

  /* Un solo sitio donde viven los topes: si mañana cambian, se cambian aquí. */
  var REGLAS = {
    free: {
      nombre: 'Free',
      marcaAgua: true,
      videoSeg: 15,
      pdf: false,
      vozEstudio: false,
      proyectos: 3,
      lista: [
        'Todas las plantillas y todas las paletas',
        'Descarga en JPG',
        'Vídeo de hasta 15 segundos',
        'Marca de agua discreta en el pie',
        'Hasta 3 proyectos guardados'
      ]
    },
    pro: {
      nombre: 'Pro',
      marcaAgua: false,
      videoSeg: 60,
      pdf: true,
      vozEstudio: true,
      proyectos: 0,           // 0 = sin límite
      lista: [
        'Todo lo del plan Free',
        'Sin marca de agua',
        'PDF listo para imprenta',
        'Vídeo de hasta 60 segundos',
        'Voz de estudio (la que suena a locutor)',
        'Proyectos sin límite'
      ]
    }
  };

  var MOTIVOS = {
    pdf: 'El PDF para imprenta es del plan Pro. En Free puedes bajar el JPG, que sirve para WhatsApp, redes y para imprimir en casa.',
    vozEstudio: 'La voz de estudio es del plan Pro. Con el plan Free tienes la voz gratis del navegador y también puedes grabar la tuya.',
    marcaAgua: 'Quitar la marca de agua es del plan Pro.',
    video: 'En el plan Free el vídeo dura como mucho 15 segundos. Con Pro llega a 60.',
    proyectos: 'En el plan Free se guardan 3 proyectos. Borra uno o pasa a Pro para guardar sin límite.',
    sesion: 'Para descargar o guardar hace falta entrar con tu cuenta.'
  };

  var P = {};
  window.EU_PLAN = P;

  P.reglas = function () { return REGLAS[EU.esPro() ? 'pro' : 'free']; };

  /* ¿Puede hacer esto? clave: 'pdf' | 'vozEstudio' | 'proyectos' | 'video' */
  P.puede = function (clave) {
    var r = P.reglas();
    if (clave === 'pdf') return !!r.pdf;
    if (clave === 'vozEstudio') return !!r.vozEstudio;
    return true;
  };

  P.topeVideo = function () { return P.reglas().videoSeg; };
  P.topeProyectos = function () { return P.reglas().proyectos; };
  P.llevaMarcaAgua = function () { return !!P.reglas().marcaAgua; };

  P.muro = function (clave, extra) {
    var t = EU.$('euMuroTxt');
    if (t) t.innerHTML = EU.esc(MOTIVOS[clave] || 'Esto es del plan Pro.') +
      (extra ? '<br><br>' + EU.esc(extra) : '');
    EU.$('euMuro').classList.add('on');
  };
  P.cerrarMuro = function () { EU.$('euMuro').classList.remove('on'); };

  /* ¿Hay sesión? Sin sesión no se descarga ni se guarda (así lo pide el mapa). */
  P.exigeSesion = function () {
    if (EU.uid) return true;
    P.muro('sesion');
    return false;
  };

  /* ───────────── Marca de agua ─────────────
     Se pinta ENCIMA del folleto ya dibujado, en el pie, discreta: no
     estropea la vista previa, pero se nota en la descarga. */
  P.marcaAgua = function (ctx, W, H) {
    if (!P.llevaMarcaAgua()) return;
    var t = 'Hecho con Fátima Pro · Estudio Universal';
    var tam = Math.max(11, W * 0.017);
    ctx.save();
    ctx.font = '600 ' + tam.toFixed(1) + 'px Segoe UI,Arial,sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'alphabetic';
    var an = ctx.measureText(t).width, pad = tam * 0.55;
    var x = W - tam, y = H - tam * 0.9;
    ctx.fillStyle = 'rgba(0,0,0,.42)';
    ctx.fillRect(x - an - pad, y - tam, an + pad * 2, tam * 1.5);
    ctx.fillStyle = 'rgba(255,255,255,.82)';
    ctx.fillText(t, x, y);
    ctx.restore();
  };

  /* ───────────── Pantalla de planes ───────────── */
  P.entrar = function () {
    var caja = EU.$('euPlanes');
    if (!caja) return;
    caja.innerHTML = ['free', 'pro'].map(function (k) {
      var r = REGLAS[k], activo = (EU.esPro() ? 'pro' : 'free') === k;
      return '<div class="plan-c' + (k === 'pro' ? ' pro' : '') + '">' +
        '<h4>' + r.nombre + (activo ? ' <span class="badge-pro">TU PLAN</span>' : '') + '</h4>' +
        '<ul>' + r.lista.map(function (l) { return '<li>' + EU.esc(l) + '</li>'; }).join('') + '</ul>' +
        '</div>';
    }).join('');
  };
})();

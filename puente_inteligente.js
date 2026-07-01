/* ══════════════════════════════════════════════════════════════════════
   PUENTE INTELIGENTE · relevo automático entre hostings   (versión "pega y ya")
   ────────────────────────────────────────────────────────────────────
   Para Fátima:
     El motor tiene VARIAS puertas hacia Replicate (Netlify, Vercel,
     Cloudflare...). Este archivo es el PORTERO LISTO: prueba cuál puerta
     está abierta y usa esa. Si una se queda sin crédito o se apaga, salta
     solo a la siguiente. Cuando la primera vuelve, la reusa.

     NO hay que cambiar NADA dentro del motor. Este archivo se engancha por
     detrás y solo toca las llamadas a Replicate; Drive, Firebase y tus
     actualizaciones quedan igual.

   Instalar:
     1) Guarda este archivo como  puente_inteligente.js  junto al motor.
     2) Pega la etiqueta (una sola línea) JUSTO ANTES del <script> grande
        del motor. Nada más.
     3) Rellena abajo tu lista PUENTES con las direcciones que tengas.
   ══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── 1) TUS PUERTAS, en orden de preferencia ──────────────────────────
     El primero que responda "vivo" se usa. Deja activas solo las que tengas
     publicadas (quita el // del inicio y pon TU dirección real). */
  window.PUENTES = window.PUENTES || [
    'https://fatimahairstudio082.com/.netlify/functions/replicate', // 1º Netlify (principal)
    // 'https://TU-APP.vercel.app/api/replicate',                    // 2º Vercel (respaldo)
    // 'https://TU-PROYECTO.pages.dev/replicate',                    // 3º Cloudflare (respaldo)
  ];

  var LS_ACTIVO  = 'fc_puente_activo';
  var TIMEOUT_MS = 6000;
  var _fetch = window.fetch.bind(window); // fetch ORIGINAL (no morder nuestra propia cola)

  /* ── Arranque INSTANTÁNEO: deja una puerta sana puesta antes de que el
     motor lea su variable, para que nunca arranque "en vacío". ── */
  (function inicioSincrono () {
    var recordado = localStorage.getItem(LS_ACTIVO);
    var primero   = (window.PUENTES.filter(Boolean))[0] || null;
    window.PROXY_ACTIVO = recordado || primero;
    if (window.PROXY_ACTIVO) window.REPLICATE_PROXY = window.PROXY_ACTIVO;
  })();

  function conTimeout (p, ms) {
    return Promise.race([p, new Promise(function (_, rej) {
      setTimeout(function () { rej(new Error('timeout')); }, ms);
    })]);
  }

  /* ¿Está vivo? Le pide su "saludo" (GET) que responde {ok:true}. */
  async function estaVivo (url) {
    try {
      var r = await conTimeout(_fetch(url, { method: 'GET' }), TIMEOUT_MS);
      if (!r.ok) return false;
      var d = await r.json().catch(function () { return null; });
      return !!(d && d.ok);
    } catch (_) { return false; }
  }

  /* Pinta en pantalla el puente activo (si existen esos elementos). */
  function mostrarActivo (url) {
    try {
      var host = url ? new URL(url).host : '—';
      var elP = document.getElementById('proxyTxt');
      if (elP) elP.textContent = url || '(ninguno)';
      var elPill = document.getElementById('pillPuente');
      if (elPill) {
        elPill.textContent = url ? ('🌉 ' + host) : '🌉 sin puente';
        elPill.className = 'pill ' + (url ? 'ok' : 'no');
      }
    } catch (_) {}
  }

  /* Elige el primer puente vivo. Si 'forzar', revisa todos desde cero. */
  window.elegirPuente = async function (forzar) {
    var lista = window.PUENTES.filter(Boolean);
    if (!lista.length) { window.PROXY_ACTIVO = null; mostrarActivo(null); return null; }
    var recordado = localStorage.getItem(LS_ACTIVO);
    var orden = (!forzar && recordado)
      ? [recordado].concat(lista.filter(function (u) { return u !== recordado; }))
      : lista.slice();

    for (var i = 0; i < orden.length; i++) {
      if (await estaVivo(orden[i])) {
        localStorage.setItem(LS_ACTIVO, orden[i]);
        window.PROXY_ACTIVO = orden[i];
        window.REPLICATE_PROXY = orden[i];
        mostrarActivo(orden[i]);
        if (window.console) console.log('[puente] activo →', orden[i]);
        return orden[i];
      }
    }
    window.PROXY_ACTIVO = orden[0] || null; // ninguno saludó: usa el primero por si el POST sí sirve
    mostrarActivo(window.PROXY_ACTIVO);
    if (window.console) console.warn('[puente] ninguno saludó; usando', window.PROXY_ACTIVO);
    return window.PROXY_ACTIVO;
  };

  /* Fetch con RELEVO: si el puente falla feo (402 sin crédito, 404 borrado,
     5xx caído, o no responde) salta al siguiente y reintenta una vez. */
  window.puenteFetch = async function (sub, opts, _reintento) {
    if (!window.PROXY_ACTIVO) await window.elegirPuente(false);
    var base = window.PROXY_ACTIVO;
    if (!base) throw new Error('No hay ningún puente configurado (revisa la lista PUENTES).');
    try {
      var r = await _fetch(base + sub, opts);
      if ((r.status === 404 || r.status === 402 || r.status >= 500) && !_reintento) {
        var nuevo = await window.elegirPuente(true);
        if (nuevo && nuevo !== base) return window.puenteFetch(sub, opts, true);
      }
      return r;
    } catch (e) {
      if (!_reintento) {
        var nuevo2 = await window.elegirPuente(true);
        if (nuevo2 && nuevo2 !== base) return window.puenteFetch(sub, opts, true);
      }
      throw e;
    }
  };

  /* Botón/chip "revisar puentes": vuelve a chequear todos. */
  window.revisarPuentes = function () { return window.elegirPuente(true); };

  /* ── ENGANCHE AUTOMÁTICO ──────────────────────────────────────────────
     Interceptamos SOLO las llamadas a Replicate (llevan 'replicate' y '/v1').
     Esas van con relevo automático. TODO lo demás (Drive, Firebase, Google)
     pasa igual que siempre, sin tocar. */
  function subDe (url) { var i = url.indexOf('/v1'); return i >= 0 ? url.slice(i) : null; }
  function esLlamadaReplicate (url) {
    return typeof url === 'string' && url.indexOf('replicate') >= 0 && url.indexOf('/v1') >= 0;
  }
  window.fetch = function (input, init) {
    try {
      if (esLlamadaReplicate(input)) {
        var sub = subDe(input);
        if (sub) return window.puenteFetch(sub, init);
      }
    } catch (_) {}
    return _fetch(input, init);
  };

  /* Al cargar, verifica el mejor puente en segundo plano (no bloquea nada). */
  window.elegirPuente(false);
})();

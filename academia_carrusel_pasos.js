/* ═══════════════════════════════════════════════════════════════
 *  ACADEMIA · CARRUSEL DE PASOS DE VIDEO  (ADITIVO · no borra nada)
 *  Fátima Caldea Studio · proyecto aprendisajefatima
 *  ────────────────────────────────────────────────────────────────
 *  Envuelve inyectar() — igual que FirebaseMediaLoader — para añadir
 *  un CARRUSEL paso a paso en el cuadro de "Video de Apoyo".
 *
 *  Si la clase tiene clips de pasos en Storage:
 *      academia/{slug}/{claseId}/paso_01.mp4 , paso_02.mp4 , …
 *  los muestra como carrusel:  ‹  Paso N / M · {texto del paso}  ›
 *  Si NO hay clips de pasos, deja el video de apoyo original intacto.
 *
 *  CÓMO ACTIVARLO:  añade en bloque3_academia_pagos.html, justo
 *  DESPUÉS de  <script src="app.js"></script> :
 *      <script src="academia_carrusel_pasos.js"></script>
 *  No modifica app.js ni los motores. Respeta las reglas de Firebase
 *  (solo LEE de Storage por HEAD, como ya hace tu sistema).
 * ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  function slugDe(cat) {
    if (window.FirebaseMediaLoader && FirebaseMediaLoader.catToSlug) return FirebaseMediaLoader.catToSlug(cat || '');
    return String(cat || '').replace(/[^\w\s]/g, '').trim().toLowerCase().replace(/\s+/g, '_');
  }
  function urlDe(slug, id, file) {
    if (window.FirebaseMediaLoader && FirebaseMediaLoader.buildURL) return FirebaseMediaLoader.buildURL(slug, id, file);
    return 'https://firebasestorage.googleapis.com/v0/b/aprendisajefatima.appspot.com/o/' +
      encodeURIComponent('academia/' + slug + '/' + id + '/' + file) + '?alt=media';
  }
  // Pasos numerados (puntos) del txt de la clase → ['texto 1', 'texto 2', …]
  function pasosTexto(txt) {
    if (!txt) return [];
    var out = [], re = /<span class="punto-num">\s*\d+\s*<\/span>\s*<span>([\s\S]*?)<\/span>/g, m;
    while ((m = re.exec(txt))) out.push(m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
    return out;
  }
  function existe(u) {
    return fetch(u, { method: 'HEAD' }).then(function (r) { return r.ok; }).catch(function () { return false; });
  }

  function limpiarCarru() {
    var ov = document.getElementById('vap-carru');
    if (ov) ov.remove();
  }

  async function montar(c) {
    var labels = pasosTexto(c.txt);
    if (!labels.length) return;                 // clase sin pasos → no tocar nada
    var slug = slugDe(c.cat), clips = [];
    for (var i = 1; i <= labels.length; i++) {
      var nn = (i < 10 ? '0' : '') + i;
      var u = urlDe(slug, c.id, 'paso_' + nn + '.mp4');
      if (await existe(u)) clips.push({ url: u, label: labels[i - 1] || ('Paso ' + i) });
    }
    if (!clips.length) return;                   // aún no se han generado los clips
    // la clase pudo cambiar mientras consultábamos
    if (window.CLASE_ACTIVA && window.CLASE_ACTIVA !== c.id) return;
    pintar(c, clips);
  }

  function pintar(c, clips) {
    var box = document.getElementById('vid-apoyo-box');
    if (!box) return;
    // ocultar el media original (sin borrarlo)
    ['vap-ph', 'vap-thumb', 'vap-play', 'vap-nourl'].forEach(function (id) {
      var e = document.getElementById(id); if (e) e.style.display = 'none';
    });
    var fr = document.getElementById('vap-frame'); if (fr) { fr.src = ''; fr.style.display = 'none'; }
    var m = document.getElementById('vap-mp4'); if (m) { try { m.pause(); } catch (_) {} m.style.display = 'none'; }

    limpiarCarru();
    var ov = document.createElement('div'); ov.id = 'vap-carru';
    ov.style.cssText = 'position:absolute;inset:0;background:#000;z-index:4;';
    box.appendChild(ov);

    var v = document.createElement('video');
    v.playsInline = true; v.muted = true; v.controls = true;
    v.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;';
    ov.appendChild(v);

    var total = clips.length, cur = 0;
    function nav(html, side) {
      var b = document.createElement('button'); b.innerHTML = html;
      b.style.cssText = 'position:absolute;' + side + ':6px;top:50%;transform:translateY(-50%);z-index:6;width:34px;height:34px;border-radius:50%;background:rgba(0,0,0,.72);color:#C9A84C;border:1px solid #C9A84C;cursor:pointer;font-size:18px;line-height:1;display:flex;align-items:center;justify-content:center;';
      ov.appendChild(b); return b;
    }
    var prev = total > 1 ? nav('‹', 'left') : null;
    var next = total > 1 ? nav('›', 'right') : null;

    var bar = document.createElement('div');
    bar.style.cssText = 'position:absolute;left:0;right:0;bottom:0;background:rgba(0,0,0,.8);color:#fff;font-size:11px;padding:6px 9px;display:flex;gap:8px;align-items:center;z-index:6;';
    var cnt = document.createElement('span'); cnt.style.cssText = 'color:#F0D080;font-weight:700;white-space:nowrap;';
    var lbl = document.createElement('span'); lbl.style.cssText = 'overflow:hidden;text-overflow:ellipsis;white-space:nowrap;opacity:.9;';
    bar.appendChild(cnt); bar.appendChild(lbl); ov.appendChild(bar);

    var dots = null;
    if (total > 1) {
      dots = document.createElement('div');
      dots.style.cssText = 'position:absolute;top:8px;left:50%;transform:translateX(-50%);display:flex;gap:5px;z-index:6;';
      for (var d = 0; d < total; d++) {
        var dot = document.createElement('span');
        dot.dataset.i = d;
        dot.style.cssText = 'width:8px;height:8px;border-radius:50%;background:#555;cursor:pointer;';
        dot.onclick = (function (idx) { return function () { show(idx); }; })(d);
        dots.appendChild(dot);
      }
      ov.appendChild(dots);
    }

    function show(i) {
      cur = (i + total) % total;
      var cl = clips[cur];
      v.src = cl.url; v.load();
      var p = v.play(); if (p && p.catch) p.catch(function () {});
      cnt.textContent = 'Paso ' + (cur + 1) + ' / ' + total;
      lbl.textContent = cl.label;
      if (dots) [].forEach.call(dots.children, function (dd, di) { dd.style.background = di === cur ? '#C9A84C' : '#555'; });
    }
    if (prev) prev.onclick = function () { show(cur - 1); };
    if (next) next.onclick = function () { show(cur + 1); };
    v.addEventListener('ended', function () { if (total > 1) show(cur + 1); });
    show(0);

    var t = document.getElementById('vap-title');
    if (t) t.textContent = (c.n || '') + ' · paso a paso (' + total + ')';
  }

  function envolver() {
    if (typeof window.inyectar !== 'function') { setTimeout(envolver, 150); return; }
    if (window.__CARRU_PASOS_OK) return;
    window.__CARRU_PASOS_OK = true;
    var orig = window.inyectar.bind(window);
    window.inyectar = function (id) {
      limpiarCarru();             // quitar carrusel de la clase anterior
      orig(id);                   // lógica original intacta (video de apoyo normal)
      var c = (window.FLAT || []).find(function (x) { return x.id === id; });
      if (c) montar(c).catch(function () {});
    };
  }
  document.addEventListener('DOMContentLoaded', envolver);
  envolver();
})();

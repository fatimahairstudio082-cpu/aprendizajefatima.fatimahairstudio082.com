/* ═══════════════════════════════════════════════════════════════
 *  ACADEMIA · MODO CINE ("Ver en grande")  · parche ADITIVO
 *  Fátima Caldea Studio · proyecto aprendisajefatima
 *  ────────────────────────────────────────────────────────────────
 *  Se carga con UNA etiqueta en bloque3_academia_pagos.html, justo
 *  DESPUÉS de academia_drive_fix.js:
 *      <script src="academia_teatro_video.js"></script>
 *
 *  Qué hace:
 *    El "Video de Apoyo" vive en el panel izquierdo, en un cuadro de
 *    ~280×158 px. Ahí el video se ve diminuto, object-fit:cover lo
 *    recorta ("se ve a la mitad") y con los videos de Drive el botón
 *    de "abrir" del visor de Google saca a la alumna hacia
 *    drive.google.com. Este parche añade:
 *
 *      · Un botón dorado ⛶ VER EN GRANDE sobre el cuadro de video
 *        (solo aparece cuando la clase SÍ tiene video o carrusel).
 *      · Un TEATRO a pantalla casi completa: fondo oscurecido, marco
 *        dorado, video centrado y COMPLETO (object-fit:contain, nunca
 *        recortado). Los videos de Drive se ven en grande DENTRO de
 *        la Academia, en el mismo iframe /preview de siempre.
 *      · El carrusel de pasos (‹ Paso N/M ›) se lleva entero al
 *        teatro y regresa intacto al cerrar.
 *      · Se cierra con ✕, con la tecla Esc o tocando afuera.
 *        En el celular ocupa todo el ancho de la pantalla.
 *      · Al presionar el botón ▶ de "ver video" también se abre el
 *        teatro directo (envuelve playVideoApoyo sin modificarlo).
 *
 *  Cómo lo hace (sin duplicar reproductores):
 *    NO crea un segundo reproductor: MUEVE al teatro los elementos
 *    reales que ya pintó app.js / el carrusel (#vap-mp4, #vap-frame,
 *    #vap-carru) y al cerrar los devuelve al cuadro original con su
 *    object-fit de siempre. Así nunca suenan dos audios a la vez y
 *    no cambia ningún contrato de datos.
 *
 *  Qué NO toca:
 *    app.js, motores P1/P2/P3, academia_carrusel_pasos.js,
 *    academia_drive_fix.js, Firebase, créditos, login, IDs, reglas.
 *    Cargado solo (sin video, o fuera del hub) es un no-op inofensivo.
 * ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if (window._TEATRO_VIDEO_LOADED) return;
  window._TEATRO_VIDEO_LOADED = true;

  var ABIERTO = false;
  var MOVIDOS = [];   // [{el, fit}] elementos llevados al teatro (para devolverlos igual)

  /* ── Estilos del teatro (una sola vez) ── */
  var css = document.createElement('style');
  css.id = 'teatro-video-css';
  css.textContent = [
    '#vap-teatro-btn{position:absolute;top:6px;right:6px;z-index:8;display:none;align-items:center;gap:5px;',
    '  background:rgba(0,0,0,.78);border:1px solid #C9A84C;color:#F0D080;border-radius:20px;',
    '  padding:6px 11px;font-size:.62rem;font-weight:700;letter-spacing:.6px;cursor:pointer;',
    '  font-family:inherit;text-transform:uppercase;transition:.2s;user-select:none;}',
    '#vap-teatro-btn:hover{background:#C9A84C;color:#000;}',
    '#teatro-backdrop{position:fixed;inset:0;background:rgba(2,3,5,.94);z-index:9000;',
    '  display:none;flex-direction:column;align-items:center;justify-content:center;padding:12px;}',
    '#teatro-backdrop.abierto{display:flex;}',
    '#teatro-hdr{width:min(96vw,calc(82vh*16/9));display:flex;justify-content:space-between;',
    '  align-items:center;gap:10px;padding:0 2px 10px;}',
    '#teatro-titulo{color:#F0D080;font-weight:700;font-size:.92rem;letter-spacing:.3px;',
    '  overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0;}',
    '#teatro-cerrar{display:flex;align-items:center;gap:6px;background:rgba(0,0,0,.7);',
    '  border:1px solid #C9A84C;color:#F0D080;border-radius:20px;padding:7px 14px;',
    '  font-size:.68rem;font-weight:700;letter-spacing:.6px;cursor:pointer;font-family:inherit;',
    '  text-transform:uppercase;transition:.2s;flex-shrink:0;}',
    '#teatro-cerrar:hover{background:#C9A84C;color:#000;}',
    '#teatro-stage{position:relative;width:min(96vw,calc(82vh*16/9));aspect-ratio:16/9;',
    '  background:#000;border:1px solid #C9A84C;border-radius:14px;overflow:hidden;',
    '  box-shadow:0 0 60px rgba(201,168,76,.22),0 30px 80px rgba(0,0,0,.85);}',
    '#teatro-pie{width:min(96vw,calc(82vh*16/9));text-align:center;color:#8a93a5;',
    '  font-size:.62rem;padding-top:9px;letter-spacing:.4px;}',
    '@media(max-width:800px){',
    '  #teatro-hdr,#teatro-stage,#teatro-pie{width:96vw;}',
    '  #teatro-titulo{font-size:.78rem;}',
    '}'
  ].join('\n');
  document.head.appendChild(css);

  /* ── Teatro (creado una vez, oculto) ── */
  var backdrop = document.createElement('div');
  backdrop.id = 'teatro-backdrop';
  backdrop.innerHTML =
    '<div id="teatro-hdr">' +
    '  <span id="teatro-titulo"></span>' +
    '  <button id="teatro-cerrar" type="button">✕&nbsp;Cerrar</button>' +
    '</div>' +
    '<div id="teatro-stage"></div>' +
    '<div id="teatro-pie">Toca afuera o presiona Esc para volver a la clase</div>';

  function stage() { return document.getElementById('teatro-stage'); }
  function box()   { return document.getElementById('vid-apoyo-box'); }

  function visible(el) {
    return !!(el && el.style.display !== 'none' && el.style.display !== '');
  }
  /* app.js usa display:'block' para mostrar y '' inicial/none para ocultar;
     el carrusel (#vap-carru) existe solo cuando hay clips. */
  function hayMedia() {
    var mp4 = document.getElementById('vap-mp4');
    var fr  = document.getElementById('vap-frame');
    var ca  = document.getElementById('vap-carru');
    return !!ca || visible(mp4) || visible(fr);
  }

  function llevar(el) {
    if (!el) return;
    var fit = el.style.objectFit || '';
    MOVIDOS.push({ el: el, fit: fit });
    stage().appendChild(el);
    if (el.tagName === 'VIDEO') el.style.objectFit = 'contain';
    var v = el.tagName === 'VIDEO' ? null : el.querySelector && el.querySelector('video');
    if (v) { // video interno del carrusel
      MOVIDOS.push({ el: v, fit: v.style.objectFit || '', interno: true });
      v.style.objectFit = 'contain';
    }
  }

  function abrirTeatro() {
    if (ABIERTO || !box() || !hayMedia()) return;
    if (!backdrop.parentNode) document.body.appendChild(backdrop);

    var titulo = document.getElementById('clase-title');
    var vapT   = document.getElementById('vap-title');
    document.getElementById('teatro-titulo').textContent =
      (titulo && titulo.textContent) || (vapT && vapT.textContent) || 'Video de la clase';

    MOVIDOS = [];
    var mp4 = document.getElementById('vap-mp4');
    var fr  = document.getElementById('vap-frame');
    var ca  = document.getElementById('vap-carru');
    if (ca) llevar(ca);                       // el carrusel completo manda
    else if (visible(mp4)) llevar(mp4);
    else if (visible(fr)) llevar(fr);         // Drive /preview, ahora en grande
    if (!MOVIDOS.length) return;

    ABIERTO = true;
    backdrop.classList.add('abierto');
    document.body.style.overflow = 'hidden';
    actualizarBoton();

    // con espacio y pantalla grande, el video merece sonido
    if (visible(mp4) && !ca) {
      try { mp4.muted = false; var p = mp4.play(); if (p && p.catch) p.catch(function(){ mp4.muted = true; mp4.play().catch(function(){}); }); } catch (_) {}
    }
    var vc = ca && ca.querySelector('video');
    if (vc && visible(vc)) { try { var p2 = vc.play(); if (p2 && p2.catch) p2.catch(function(){}); } catch (_) {} }
  }

  function cerrarTeatro() {
    if (!ABIERTO) return;
    var b = box();
    MOVIDOS.forEach(function (m) {
      m.el.style.objectFit = m.fit;
      if (!m.interno && b) b.appendChild(m.el);  // los internos viajan con su padre
    });
    MOVIDOS = [];
    ABIERTO = false;
    backdrop.classList.remove('abierto');
    document.body.style.overflow = '';
    actualizarBoton();
  }

  backdrop.addEventListener('click', function (e) { if (e.target === backdrop) cerrarTeatro(); });
  document.addEventListener('keydown', function (e) { if (ABIERTO && e.key === 'Escape') cerrarTeatro(); });
  // el botón Cerrar se crea con innerHTML: escuchar por delegación
  backdrop.addEventListener('click', function (e) {
    var t = e.target;
    while (t && t !== backdrop) { if (t.id === 'teatro-cerrar') { cerrarTeatro(); return; } t = t.parentNode; }
  });

  /* ── Botón ⛶ VER EN GRANDE sobre el cuadro pequeño ── */
  var btn = null;
  function crearBoton() {
    var b = box();
    if (!b) { setTimeout(crearBoton, 300); return; }
    btn = document.createElement('button');
    btn.id = 'vap-teatro-btn';
    btn.type = 'button';
    btn.innerHTML = '⛶&nbsp;Ver en grande';
    btn.onclick = function (e) { e.stopPropagation(); abrirTeatro(); };
    b.appendChild(btn);
  }
  function actualizarBoton() {
    if (!btn) return;
    btn.style.display = (!ABIERTO && hayMedia()) ? 'flex' : 'none';
  }
  crearBoton();
  /* El video/carrusel aparece de forma asíncrona (Storage, Firestore,
     Drive); un sondeo ligero mantiene el botón sincronizado sin tocar
     inyectar() ni los puentes existentes. */
  setInterval(actualizarBoton, 600);

  /* ── El botón ▶ del cuadro pequeño también abre el teatro ── */
  function envolverPlay() {
    if (typeof window.playVideoApoyo !== 'function') { setTimeout(envolverPlay, 250); return; }
    if (window.playVideoApoyo.__teatro) return;
    var orig = window.playVideoApoyo;
    window.playVideoApoyo = function () { orig(); abrirTeatro(); };
    window.playVideoApoyo.__teatro = true;
  }
  envolverPlay();

  /* Si cambia la clase con el teatro abierto (poco probable: el fondo
     bloquea los paneles), se cierra limpio para no dejar medios huérfanos. */
  function envolverInyectar() {
    if (typeof window.inyectar !== 'function') { setTimeout(envolverInyectar, 250); return; }
    if (window.inyectar.__teatro) return;
    var orig = window.inyectar;
    window.inyectar = function (id) { cerrarTeatro(); return orig(id); };
    window.inyectar.__teatro = true;
  }
  envolverInyectar();

  console.log('[academia_teatro_video] ✅ Modo Cine listo · botón "Ver en grande" activo');
})();

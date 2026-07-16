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
 *      · El carrusel de pasos (‹ Paso N/M ›) se ve entero en el
 *        teatro con sus flechas, puntos y textos.
 *      · Se cierra con ✕, con la tecla Esc o tocando afuera.
 *        En el celular ocupa todo el ancho de la pantalla.
 *      · Al presionar el botón ▶ de "ver video" también se abre el
 *        teatro directo (envuelve playVideoApoyo sin modificarlo).
 *
 *  Cómo lo hace (sin mover NADA del DOM):
 *    No crea un segundo reproductor ni re-cuelga elementos: EXPANDE
 *    el propio cuadro #vid-apoyo-box con position:fixed hasta el
 *    tamaño del teatro y lo devuelve a su sitio al cerrar. Como el
 *    iframe/video jamás cambia de padre, el video NO se recarga ni
 *    se reinicia: sigue corriendo sin interrupción (mover un iframe
 *    de padre lo recargaría — por eso se expande en su lugar).
 *
 *  Apilamiento (z-index):
 *    fondo del teatro 8000 · cuadro expandido 8001. Por encima de
 *    los cajones móviles (500) y su backdrop (450); por debajo de
 *    los toasts (8888) para que los avisos del sistema se sigan
 *    viendo, y de los modales .modal-ov (9999) y .pdf-ov (9990).
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

  var ABIERTO  = false;
  var CAJA_CSS = '';   // estilos en línea originales del cuadro (para restaurar)
  var FITS     = [];   // [{el, fit}] object-fit original de cada video

  /* ── Estilos del teatro (una sola vez) ── */
  var css = document.createElement('style');
  css.id = 'teatro-video-css';
  css.textContent = [
    '#vap-teatro-btn{position:absolute;top:6px;right:6px;z-index:8;display:none;align-items:center;gap:5px;',
    '  background:rgba(0,0,0,.78);border:1px solid #C9A84C;color:#F0D080;border-radius:20px;',
    '  padding:6px 11px;font-size:.62rem;font-weight:700;letter-spacing:.6px;cursor:pointer;',
    '  font-family:inherit;text-transform:uppercase;transition:.2s;user-select:none;}',
    '#vap-teatro-btn:hover{background:#C9A84C;color:#000;}',
    '#teatro-backdrop{position:fixed;inset:0;background:rgba(2,3,5,.94);z-index:8000;',
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
    /* el "escenario" es solo la guía de tamaño/posición; el cuadro real
       #vid-apoyo-box se expande encima con exactamente este rectángulo */
    '#teatro-stage{position:relative;width:min(96vw,calc(82vh*16/9));aspect-ratio:16/9;',
    '  background:#000;border-radius:14px;',
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
  /* app.js usa display:'block' para mostrar y ''/none para ocultar;
     el carrusel (#vap-carru) existe solo cuando hay clips. */
  function hayMedia() {
    var mp4 = document.getElementById('vap-mp4');
    var fr  = document.getElementById('vap-frame');
    var ca  = document.getElementById('vap-carru');
    return !!ca || visible(mp4) || visible(fr);
  }

  /* Copia el rectángulo del escenario al cuadro real (position:fixed).
     Se repite en cada cambio de tamaño/orientación de la pantalla. */
  function sincronizar() {
    var b = box(), st = stage();
    if (!ABIERTO || !b || !st) return;
    var r = st.getBoundingClientRect();
    b.style.position     = 'fixed';
    b.style.left         = r.left + 'px';
    b.style.top          = r.top + 'px';
    b.style.width        = r.width + 'px';
    b.style.height       = r.height + 'px';
    b.style.paddingTop   = '0';
    b.style.margin       = '0';
    b.style.zIndex       = '8001';
    b.style.background   = '#000';
    b.style.borderColor  = '#C9A84C';
    b.style.borderRadius = '14px';
  }
  window.addEventListener('resize', sincronizar);
  window.addEventListener('orientationchange', function () { setTimeout(sincronizar, 120); });

  function abrirTeatro() {
    var b = box();
    if (ABIERTO || !b || !hayMedia()) return;
    if (!backdrop.parentNode) document.body.appendChild(backdrop);

    var titulo = document.getElementById('clase-title');
    var vapT   = document.getElementById('vap-title');
    document.getElementById('teatro-titulo').textContent =
      (titulo && titulo.textContent) || (vapT && vapT.textContent) || 'Video de la clase';

    CAJA_CSS = b.style.cssText;                    // para devolverlo igualito
    FITS = [];
    [].forEach.call(b.querySelectorAll('video'), function (v) {
      FITS.push({ el: v, fit: v.style.objectFit || '' });
      v.style.objectFit = 'contain';               // completo, nunca recortado
    });

    ABIERTO = true;
    backdrop.classList.add('abierto');
    document.body.style.overflow = 'hidden';
    sincronizar();
    setTimeout(sincronizar, 60);                   // por si el layout se asienta tarde
    actualizarBoton();

    // con espacio y pantalla grande, el video merece sonido
    var mp4 = document.getElementById('vap-mp4');
    if (visible(mp4)) {
      try {
        mp4.muted = false;
        var p = mp4.play();
        if (p && p.catch) p.catch(function () { mp4.muted = true; mp4.play().catch(function () {}); });
      } catch (_) {}
    }
  }

  function cerrarTeatro() {
    if (!ABIERTO) return;
    var b = box();
    FITS.forEach(function (f) { f.el.style.objectFit = f.fit; });
    FITS = [];
    if (b) b.style.cssText = CAJA_CSS;             // el cuadro vuelve a su sitio
    ABIERTO = false;
    backdrop.classList.remove('abierto');
    document.body.style.overflow = '';
    actualizarBoton();
  }

  backdrop.addEventListener('click', function (e) {
    if (e.target === backdrop) { cerrarTeatro(); return; }
    var t = e.target;                              // botón Cerrar (por delegación)
    while (t && t !== backdrop) { if (t.id === 'teatro-cerrar') { cerrarTeatro(); return; } t = t.parentNode; }
  });
  document.addEventListener('keydown', function (e) { if (ABIERTO && e.key === 'Escape') cerrarTeatro(); });

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
     bloquea los paneles), se cierra limpio antes de pintar la nueva. */
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

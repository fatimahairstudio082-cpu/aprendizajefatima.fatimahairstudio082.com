/* ══════════════════════════════════════════════════════════════════
   hub_tarjetas_3d.js · Parche aditivo de animaciones 3D para las
   tarjetas del hub (.bloque-card del panel Home).

   - Inclinación 3D que sigue el cursor (perspectiva real).
   - Brillo/reflejo dinámico que se mueve con el ratón.
   - Profundidad en capas: título, descripción e imagen "flotan"
     a distinta Z (parallax).
   - Entrada animada escalonada al aparecer las tarjetas.
   - En móvil/táctil o con "reduce motion" se desactiva el tilt y se
     deja una animación suave, para no molestar ni gastar batería.

   Defensivo: si no encuentra el grid de bloques, es un no-op total.
   Se auto-observa porque renderHome() reescribe el grid dinámicamente.
   ══════════════════════════════════════════════════════════════════ */
(function(){
  if (window._HUB_3D_LOADED) return;
  window._HUB_3D_LOADED = true;

  var REDUCE = false;
  try { REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch(e){}
  var TOUCH = false;
  try { TOUCH = window.matchMedia('(hover: none), (pointer: coarse)').matches; } catch(e){}

  var MAX_TILT = 11;   // grados máximos de inclinación
  var LIFT     = 16;   // cuánto sube la tarjeta (px) en hover

  /* ── 1. Inyección de estilos (una sola vez) ── */
  function inyectarCSS(){
    if (document.getElementById('hub3dCSS')) return;
    var s = document.createElement('style');
    s.id = 'hub3dCSS';
    s.textContent = [
      /* El grid da la perspectiva compartida a todas las tarjetas */
      '.bloques-grid{perspective:1200px;perspective-origin:50% 30%;}',

      /* Base 3D de la tarjeta. Anula el translateY plano original y usa',
         una transición más elástica cuando NO se está arrastrando el cursor */
      '.bloque-card{transform-style:preserve-3d;transition:transform .5s cubic-bezier(.22,1,.36,1),box-shadow .5s cubic-bezier(.22,1,.36,1),border-color .35s;will-change:transform;}',
      '.bloque-card.tilt-activo{transition:box-shadow .2s ease,border-color .35s;}',

      /* Mientras se inclina, el navegador sigue el transform inline (JS).
         El hover clásico se mantiene como reserva para no-JS */
      '.bloque-card:hover{transform:translateY(-'+LIFT+'px);box-shadow:0 30px 70px rgba(0,0,0,.8);}',
      '.bloque-card.tilt-activo:hover{box-shadow:0 34px 80px rgba(0,0,0,.85);}',

      /* Capas con profundidad (parallax en Z) */
      '.bloque-card-img-wrap{transform:translateZ(0);transform-style:preserve-3d;}',
      '.bloque-card-overlay{transform:translateZ(55px);transition:transform .5s cubic-bezier(.22,1,.36,1);}',
      '.bloque-card-num{transform:translateZ(20px);}',
      '.bloque-card-tit{transform:translateZ(38px);}',
      '.bloque-card-desc{transform:translateZ(24px);}',
      '.bloque-card:hover .bloque-card-img{transform:scale(1.08);}',

      /* Reflejo/brillo que sigue el ratón */
      '.bloque-card .card-glare{position:absolute;inset:0;z-index:2;pointer-events:none;border-radius:inherit;opacity:0;transition:opacity .4s ease;background:radial-gradient(circle at var(--gx,50%) var(--gy,0%),rgba(255,255,255,.28),rgba(255,255,255,0) 45%);mix-blend-mode:soft-light;}',
      '.bloque-card.tilt-activo .card-glare{opacity:1;}',

      /* Borde luminoso que reacciona al color del bloque en hover */
      '.bloque-card::after{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;box-shadow:inset 0 0 0 1px rgba(255,255,255,0);transition:box-shadow .4s ease;z-index:3;}',
      '.bloque-card:hover::after{box-shadow:inset 0 0 0 1px rgba(255,255,255,.14),inset 0 0 34px rgba(255,255,255,.05);}',

      /* Entrada animada escalonada */
      '@keyframes card3dIn{0%{opacity:0;transform:perspective(1200px) rotateX(14deg) translateY(34px) scale(.94);}100%{opacity:1;transform:perspective(1200px) rotateX(0) translateY(0) scale(1);}}',
      '.bloque-card.card-entrar{animation:card3dIn .7s cubic-bezier(.22,1,.36,1) both;}',

      /* Respeto a quien prefiere menos movimiento */
      '@media (prefers-reduced-motion: reduce){.bloque-card,.bloque-card.card-entrar{animation:none!important;transition:box-shadow .3s ease,border-color .3s ease!important;}.bloque-card .card-glare{display:none;}}'
    ].join('\n');
    document.head.appendChild(s);
  }

  /* ── 2. Tilt 3D siguiendo el puntero (delegado en el grid) ── */
  var raf = null, pend = null;
  function aplicar(){
    raf = null;
    if (!pend) return;
    var card = pend.card, rx = pend.rx, ry = pend.ry;
    card.style.transform =
      'perspective(1200px) rotateX('+rx.toFixed(2)+'deg) rotateY('+ry.toFixed(2)+'deg) translateY(-'+LIFT+'px) scale(1.02)';
    pend = null;
  }

  function onMove(e){
    if (REDUCE || TOUCH) return;
    var card = e.target.closest && e.target.closest('.bloque-card');
    if (!card) return;
    var r = card.getBoundingClientRect();
    var px = (e.clientX - r.left) / r.width;   // 0..1
    var py = (e.clientY - r.top)  / r.height;  // 0..1
    var ry = (px - .5) *  2 * MAX_TILT;        // rotateY: izq/der
    var rx = (py - .5) * -2 * MAX_TILT;        // rotateX: arriba/abajo
    if (!card.classList.contains('tilt-activo')) card.classList.add('tilt-activo');
    var glare = card.querySelector('.card-glare');
    if (glare){ glare.style.setProperty('--gx', (px*100).toFixed(1)+'%');
                glare.style.setProperty('--gy', (py*100).toFixed(1)+'%'); }
    pend = { card:card, rx:rx, ry:ry };
    if (!raf) raf = requestAnimationFrame(aplicar);
  }

  function reset(card){
    card.classList.remove('tilt-activo');
    card.style.transform = '';
  }
  function onOut(e){
    var card = e.target.closest && e.target.closest('.bloque-card');
    if (!card) return;
    // sólo resetear si realmente salimos de la tarjeta
    var to = e.relatedTarget;
    if (to && card.contains(to)) return;
    reset(card);
  }

  /* ── 3. Preparar cada tarjeta (glare + entrada) ── */
  function preparar(card, i){
    if (card._3dListo) return;
    card._3dListo = true;
    if (!card.querySelector('.card-glare')){
      var g = document.createElement('div');
      g.className = 'card-glare';
      card.appendChild(g);
    }
    if (!REDUCE){
      card.style.animationDelay = Math.min(i,12)*60 + 'ms';
      card.classList.add('card-entrar');
      card.addEventListener('animationend', function h(){
        card.classList.remove('card-entrar');
        card.style.animationDelay = '';
        card.removeEventListener('animationend', h);
      });
    }
  }

  function escanear(){
    var grid = document.getElementById('bloquesGrid');
    if (!grid) return;
    if (!grid._3dEnlazado){
      grid._3dEnlazado = true;
      grid.addEventListener('pointermove', onMove, { passive:true });
      grid.addEventListener('pointerout',  onOut,  { passive:true });
    }
    var cards = grid.querySelectorAll('.bloque-card');
    for (var i=0;i<cards.length;i++) preparar(cards[i], i);
  }

  /* ── 4. Observar el grid: renderHome() lo reescribe ── */
  function arrancar(){
    var grid = document.getElementById('bloquesGrid');
    if (!grid) return; // no hay hub → no-op
    inyectarCSS();
    escanear();
    try{
      var mo = new MutationObserver(function(){ escanear(); });
      mo.observe(grid, { childList:true });
    }catch(e){}
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', function(){ setTimeout(arrancar, 60); });
  } else {
    setTimeout(arrancar, 60);
  }
})();

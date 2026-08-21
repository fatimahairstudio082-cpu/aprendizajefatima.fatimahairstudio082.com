/* ══════════════════════════════════════════════════════════════════
   hub_tarjetas_3d.js · Parche aditivo de animaciones 3D para las
   tarjetas del hub (.bloque-card del panel Home).

   EFECTO CUBO 3D PREMIUM (volteo en hover):
   Dirección de motion (Fatima Creative OS · tono luxury/editorial):
   - Cada tarjeta es un cubo 3D de dos caras.
       · Frontal : imagen + título del bloque.
       · Trasera : descripción, niveles y botones (Abrir / Escuchar).
   - Giro LENTO y elegante (~1.25s) con easing ease-in-out (sin rebote):
     arranca y frena suave, sensación de estudio profesional.
   - Iluminación simulada: la cara que se aleja de la luz se oscurece y
     la que aparece se ilumina (gradiente de sombra por cara).
   - Sombra profunda y suave (lujo) + brillo dinámico que sigue el ratón.
   - Tilt 3D sutil y responsivo como microinteracción (no compite con el
     giro, que es el movimiento protagonista).
   - Entrada animada escalonada. En táctil se voltea tocando la tarjeta.
   - Respeta prefers-reduced-motion.

   Defensivo: no-op si no hay grid; guarda si la estructura no es la
   esperada; observa el grid porque renderHome() lo reescribe. No toca
   Firebase ni el HTML generado por el render.

   Para afinar: FLIP_MS (duración del giro) y EASE (curva) abajo.
   ══════════════════════════════════════════════════════════════════ */
(function(){
  if (window._HUB_3D_LOADED) return;
  window._HUB_3D_LOADED = true;

  var REDUCE = false;
  try { REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch(e){}
  var TOUCH = false;
  try { TOUCH = window.matchMedia('(hover: none), (pointer: coarse)').matches; } catch(e){}

  var MAX_TILT = 6;      // inclinación con el cursor (sutil, microinteracción)
  var LIFT     = 12;     // cuánto sube la tarjeta (px) en hover
  var FLIP_MS  = 1250;   // duración del giro del cubo (ms) · lento/profesional
  var EASE     = 'cubic-bezier(.76,0,.24,1)'; // ease-in-out premium, sin rebote

  /* ── 1. Inyección de estilos (una sola vez) ── */
  function inyectarCSS(){
    if (document.getElementById('hub3dCSS')) return;
    var FS = (FLIP_MS/1000).toFixed(3) + 's';
    var s = document.createElement('style');
    s.id = 'hub3dCSS';
    s.textContent = [
      /* El grid da la perspectiva compartida a todas las tarjetas */
      '.bloques-grid{perspective:1500px;perspective-origin:50% 32%;}',

      /* Escena: sólo perspectiva. El tilt de seguimiento va aparte y rápido */
      '.bloque-card.cubo{display:block;overflow:visible;background:transparent;border:none;box-shadow:none;perspective:1300px;transition:transform .55s '+EASE+';will-change:transform;}',
      '.bloque-card.cubo.tilt-activo{transition:transform .12s linear;}',

      /* Contenedor que gira como un cubo · giro lento y premium */
      '.cubo-inner{position:relative;transform-style:preserve-3d;transition:transform '+FS+' '+EASE+';will-change:transform;}',
      '.bloque-card.cubo:hover .cubo-inner,.bloque-card.cubo.volteada .cubo-inner{transform:rotateY(180deg);}',

      /* Caras del cubo · sombra profunda y suave (lujo) */
      '.cubo-cara{position:relative;border-radius:18px;overflow:hidden;background:var(--panel);border:1px solid rgba(255,255,255,.09);box-shadow:0 26px 60px -12px rgba(0,0,0,.7),0 6px 18px rgba(0,0,0,.4);transition:box-shadow '+FS+' '+EASE+';display:flex;flex-direction:column;backface-visibility:hidden;-webkit-backface-visibility:hidden;}',
      '.bloque-card.cubo:hover .cubo-cara{box-shadow:0 44px 88px -16px rgba(0,0,0,.82),0 12px 30px rgba(0,0,0,.5);}',
      '.cubo-frente{position:relative;}',
      '.cubo-detras{position:absolute;inset:0;transform:rotateY(180deg);}',

      /* Iluminación simulada: la cara que se aleja de la luz se oscurece,
         la que aparece se ilumina (mismo tiempo que el giro) */
      '.cubo-cara::after{content:"";position:absolute;inset:0;z-index:5;pointer-events:none;border-radius:inherit;background:linear-gradient(115deg,rgba(0,0,0,.62),rgba(0,0,0,.12) 60%);transition:opacity '+FS+' '+EASE+';}',
      '.cubo-frente::after{opacity:0;}',
      '.bloque-card.cubo:hover .cubo-frente::after,.bloque-card.cubo.volteada .cubo-frente::after{opacity:.9;}',
      '.cubo-detras::after{opacity:.9;}',
      '.bloque-card.cubo:hover .cubo-detras::after,.bloque-card.cubo.volteada .cubo-detras::after{opacity:0;}',

      /* Contenido de la cara trasera */
      '.cubo-detras-inner{position:relative;z-index:1;height:100%;display:flex;flex-direction:column;gap:9px;padding:20px 18px 0;background:linear-gradient(160deg,rgba(255,255,255,.05),rgba(2,4,8,.55));}',
      '.cubo-detras-tit{font-size:17px;color:#fff;font-weight:700;letter-spacing:.3px;}',
      '.cubo-detras-desc{font-size:11px;color:rgba(255,255,255,.72);line-height:1.65;flex:1;overflow:hidden;}',
      '.cubo-detras .nivel-badges{padding:0 0 4px;}',
      '.cubo-detras .bloque-card-footer{position:relative;z-index:6;margin:0 -18px;}',

      /* Zoom lento y suave de la imagen frontal */
      '.bloque-card.cubo .bloque-card-img{transition:transform '+FS+' '+EASE+';}',
      '.bloque-card.cubo:hover .bloque-card-img{transform:scale(1.05);}',

      /* Reflejo/brillo que sigue el ratón (sobre la cara frontal) */
      '.cubo-frente .card-glare{position:absolute;inset:0;z-index:4;pointer-events:none;border-radius:inherit;opacity:0;transition:opacity .5s ease;background:radial-gradient(circle at var(--gx,50%) var(--gy,0%),rgba(255,255,255,.28),rgba(255,255,255,0) 45%);mix-blend-mode:soft-light;}',
      '.bloque-card.cubo.tilt-activo .card-glare{opacity:1;}',

      /* Pista visual de que la tarjeta se puede voltear (sólo táctil) */
      '.cubo-flip-hint{position:absolute;top:12px;right:12px;z-index:6;width:30px;height:30px;border-radius:50%;background:rgba(0,0,0,.5);border:1px solid rgba(255,255,255,.25);color:#fff;font-size:14px;display:flex;align-items:center;justify-content:center;pointer-events:none;}',

      /* Entrada animada escalonada (suave, ease-out) */
      '@keyframes cubo3dIn{0%{opacity:0;transform:perspective(1500px) rotateX(15deg) translateY(38px) scale(.93);}100%{opacity:1;transform:perspective(1500px) rotateX(0) translateY(0) scale(1);}}',
      '.bloque-card.cubo.card-entrar{animation:cubo3dIn .85s cubic-bezier(.22,1,.36,1) both;}',

      /* Respeto a quien prefiere menos movimiento: sin giro automático */
      '@media (prefers-reduced-motion: reduce){.cubo-inner,.cubo-cara,.cubo-cara::after,.bloque-card.cubo .bloque-card-img{transition:none!important;}.bloque-card.cubo:hover .cubo-inner{transform:none;}.bloque-card.cubo.card-entrar{animation:none!important;}.cubo-frente .card-glare{display:none;}}'
    ].join('\n');
    document.head.appendChild(s);
  }

  /* ── 2. Convertir una tarjeta en cubo (front/back) ── */
  function armarCubo(card){
    if (card._cubo) return;
    var imgWrap = card.querySelector('.bloque-card-img-wrap');
    if (!imgWrap) return;               // estructura inesperada → no tocar
    card._cubo = true;

    var badges = card.querySelector('.nivel-badges');
    var footer = card.querySelector('.bloque-card-footer');
    var numEl  = card.querySelector('.bloque-card-num');
    var titEl  = card.querySelector('.bloque-card-tit');
    var descEl = card.querySelector('.bloque-card-desc');

    var color   = (numEl && numEl.style.color) || 'var(--oro)';
    var numTxt  = numEl  ? numEl.textContent  : '';
    var titTxt  = titEl  ? titEl.textContent  : '';
    var descTxt = descEl ? descEl.textContent : '';

    var inner  = document.createElement('div'); inner.className = 'cubo-inner';
    var frente = document.createElement('div'); frente.className = 'cubo-cara cubo-frente';
    var detras = document.createElement('div'); detras.className = 'cubo-cara cubo-detras';

    /* Cara frontal = la imagen con su overlay (título) */
    frente.appendChild(imgWrap);
    var glare = document.createElement('div'); glare.className = 'card-glare';
    frente.appendChild(glare);
    if (TOUCH){
      var hint = document.createElement('div'); hint.className = 'cubo-flip-hint'; hint.textContent = '⟳';
      frente.appendChild(hint);
    }

    /* Cara trasera = detalle + niveles + botones */
    var bin = document.createElement('div'); bin.className = 'cubo-detras-inner';
    detras.style.borderTop = '3px solid ' + color;
    var hNum = document.createElement('div'); hNum.className = 'bloque-card-num'; hNum.style.color = color; hNum.textContent = numTxt;
    var hTit = document.createElement('div'); hTit.className = 'cubo-detras-tit'; hTit.textContent = titTxt;
    var hDes = document.createElement('div'); hDes.className = 'cubo-detras-desc'; hDes.textContent = descTxt;
    bin.appendChild(hNum); bin.appendChild(hTit); bin.appendChild(hDes);
    if (badges) bin.appendChild(badges);     // conserva onclick (enviarWA)
    detras.appendChild(bin);
    if (footer) detras.appendChild(footer);  // conserva onclick (cambiarBloque / TTS)

    inner.appendChild(frente);
    inner.appendChild(detras);
    card.innerHTML = '';
    card.appendChild(inner);
    card.classList.add('cubo');

    /* Táctil: tocar la tarjeta (fuera de botones/niveles) la voltea */
    if (TOUCH){
      card.addEventListener('click', function(e){
        if (e.target.closest('button, a, .nivel-b')) return;
        card.classList.toggle('volteada');
      });
    }
  }

  /* ── 3. Tilt 3D siguiendo el puntero (delegado en el grid) ── */
  var raf = null, pend = null;
  function aplicar(){
    raf = null;
    if (!pend) return;
    pend.card.style.transform =
      'perspective(1300px) rotateX('+pend.rx.toFixed(2)+'deg) rotateY('+pend.ry.toFixed(2)+'deg) translateY(-'+LIFT+'px)';
    pend = null;
  }
  function onMove(e){
    if (REDUCE || TOUCH) return;
    var card = e.target.closest && e.target.closest('.bloque-card');
    if (!card) return;
    var r = card.getBoundingClientRect();
    var px = (e.clientX - r.left) / r.width;
    var py = (e.clientY - r.top)  / r.height;
    var ry = (px - .5) *  2 * MAX_TILT;
    var rx = (py - .5) * -2 * MAX_TILT;
    if (!card.classList.contains('tilt-activo')) card.classList.add('tilt-activo');
    var glare = card.querySelector('.card-glare');
    if (glare){ glare.style.setProperty('--gx', (px*100).toFixed(1)+'%');
                glare.style.setProperty('--gy', (py*100).toFixed(1)+'%'); }
    pend = { card:card, rx:rx, ry:ry };
    if (!raf) raf = requestAnimationFrame(aplicar);
  }
  function onOut(e){
    var card = e.target.closest && e.target.closest('.bloque-card');
    if (!card) return;
    var to = e.relatedTarget;
    if (to && card.contains(to)) return;
    card.classList.remove('tilt-activo');
    card.style.transform = '';
  }

  /* ── 4. Entrada animada escalonada ── */
  function entrar(card, i){
    if (REDUCE || card._entro) return;
    card._entro = true;
    card.style.animationDelay = Math.min(i,12)*60 + 'ms';
    card.classList.add('card-entrar');
    card.addEventListener('animationend', function h(){
      card.classList.remove('card-entrar');
      card.style.animationDelay = '';
      card.removeEventListener('animationend', h);
    });
  }

  /* ── 5. Escanear + observar el grid (renderHome lo reescribe) ── */
  function escanear(){
    var grid = document.getElementById('bloquesGrid');
    if (!grid) return;
    if (!grid._3dEnlazado){
      grid._3dEnlazado = true;
      grid.addEventListener('pointermove', onMove, { passive:true });
      grid.addEventListener('pointerout',  onOut,  { passive:true });
    }
    var cards = grid.querySelectorAll('.bloque-card');
    for (var i=0;i<cards.length;i++){ armarCubo(cards[i]); entrar(cards[i], i); }
  }

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

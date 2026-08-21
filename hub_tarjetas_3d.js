/* ══════════════════════════════════════════════════════════════════
   hub_tarjetas_3d.js · Parche aditivo de animaciones 3D para las
   tarjetas del hub (.bloque-card del panel Home).

   EFECTO CUBO (volteo en hover):
   - Cada tarjeta se convierte en un cubo 3D con dos caras.
       · Cara frontal  : imagen + título del bloque.
       · Cara trasera  : descripción completa, niveles y botones
                         (Abrir bloque / Escuchar).
   - Al pasar el ratón la tarjeta gira 180° como un cubo y muestra la
     cara trasera; al salir vuelve.
   - Inclinación 3D que sigue el cursor + brillo dinámico (se combinan
     con el giro para dar sensación de volumen).
   - Entrada animada escalonada al aparecer las tarjetas.
   - En táctil se voltea tocando la tarjeta (los botones siguen
     funcionando). Respeta prefers-reduced-motion.

   Defensivo: si no encuentra el grid de bloques, es un no-op total.
   Se auto-observa porque renderHome() reescribe el grid dinámicamente.
   No toca Firebase ni el HTML generado por el render.
   ══════════════════════════════════════════════════════════════════ */
(function(){
  if (window._HUB_3D_LOADED) return;
  window._HUB_3D_LOADED = true;

  var REDUCE = false;
  try { REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch(e){}
  var TOUCH = false;
  try { TOUCH = window.matchMedia('(hover: none), (pointer: coarse)').matches; } catch(e){}

  var MAX_TILT = 9;    // grados máximos de inclinación con el cursor
  var LIFT     = 14;   // cuánto sube la tarjeta (px) en hover

  /* ── 1. Inyección de estilos (una sola vez) ── */
  function inyectarCSS(){
    if (document.getElementById('hub3dCSS')) return;
    var s = document.createElement('style');
    s.id = 'hub3dCSS';
    s.textContent = [
      /* El grid da la perspectiva compartida a todas las tarjetas */
      '.bloques-grid{perspective:1400px;perspective-origin:50% 30%;}',

      /* La tarjeta actúa de "escena": sólo perspectiva, sin fondo ni recorte */
      '.bloque-card.cubo{display:block;overflow:visible;background:transparent;border:none;box-shadow:none;perspective:1200px;transition:transform .5s cubic-bezier(.22,1,.36,1),box-shadow .5s cubic-bezier(.22,1,.36,1);will-change:transform;}',
      '.bloque-card.cubo:hover{transform:translateY(-'+LIFT+'px);}',

      /* Contenedor que gira como un cubo */
      '.cubo-inner{position:relative;transform-style:preserve-3d;transition:transform .8s cubic-bezier(.34,1.3,.5,1);will-change:transform;}',
      '.bloque-card.cubo:hover .cubo-inner,.bloque-card.cubo.volteada .cubo-inner{transform:rotateY(180deg);}',

      /* Caras del cubo */
      '.cubo-cara{border-radius:18px;overflow:hidden;background:var(--panel);border:1px solid rgba(255,255,255,.08);backface-visibility:hidden;-webkit-backface-visibility:hidden;box-shadow:0 22px 55px rgba(0,0,0,.6);display:flex;flex-direction:column;}',
      '.cubo-frente{position:relative;}',
      '.cubo-detras{position:absolute;inset:0;transform:rotateY(180deg);}',

      /* Contenido de la cara trasera */
      '.cubo-detras-inner{height:100%;display:flex;flex-direction:column;gap:9px;padding:20px 18px 0;background:linear-gradient(160deg,rgba(255,255,255,.05),rgba(2,4,8,.55));}',
      '.cubo-detras-tit{font-size:17px;color:#fff;font-weight:700;letter-spacing:.3px;}',
      '.cubo-detras-desc{font-size:11px;color:rgba(255,255,255,.72);line-height:1.65;flex:1;overflow:hidden;}',
      '.cubo-detras .nivel-badges{padding:0 0 4px;}',
      '.cubo-detras .bloque-card-footer{margin:0 -18px;}',

      /* Zoom suave de la imagen frontal */
      '.bloque-card.cubo .bloque-card-img{transition:transform .6s cubic-bezier(.22,1,.36,1);}',
      '.bloque-card.cubo:hover .bloque-card-img{transform:scale(1.06);}',

      /* Reflejo/brillo que sigue el ratón (sobre la cara frontal) */
      '.cubo-frente .card-glare{position:absolute;inset:0;z-index:2;pointer-events:none;border-radius:inherit;opacity:0;transition:opacity .4s ease;background:radial-gradient(circle at var(--gx,50%) var(--gy,0%),rgba(255,255,255,.30),rgba(255,255,255,0) 45%);mix-blend-mode:soft-light;}',
      '.bloque-card.cubo.tilt-activo .card-glare{opacity:1;}',

      /* Pista visual de que la tarjeta se puede voltear (sólo táctil) */
      '.cubo-flip-hint{position:absolute;top:12px;right:12px;z-index:4;width:30px;height:30px;border-radius:50%;background:rgba(0,0,0,.5);border:1px solid rgba(255,255,255,.25);color:#fff;font-size:14px;display:flex;align-items:center;justify-content:center;pointer-events:none;}',

      /* Entrada animada escalonada */
      '@keyframes cubo3dIn{0%{opacity:0;transform:perspective(1400px) rotateX(16deg) translateY(38px) scale(.93);}100%{opacity:1;transform:perspective(1400px) rotateX(0) translateY(0) scale(1);}}',
      '.bloque-card.cubo.card-entrar{animation:cubo3dIn .75s cubic-bezier(.22,1,.36,1) both;}',

      /* Respeto a quien prefiere menos movimiento: sin giro automático */
      '@media (prefers-reduced-motion: reduce){.cubo-inner{transition:none!important;}.bloque-card.cubo:hover .cubo-inner{transform:none;}.bloque-card.cubo.card-entrar{animation:none!important;}.cubo-frente .card-glare{display:none;}}'
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
      'perspective(1200px) rotateX('+pend.rx.toFixed(2)+'deg) rotateY('+pend.ry.toFixed(2)+'deg) translateY(-'+LIFT+'px)';
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

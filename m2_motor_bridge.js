/**
 * ═══════════════════════════════════════════════════════════════
 *  M2 MOTOR BRIDGE · Fátima Caldera Studio
 *  ────────────────────────────────────────────────────────────────
 *  Mismo patrón que M1, adaptado a M2 (video).
 *  - Lee target → banner + prefill prompt
 *  - Interceptor de fc_carpeta_queue → etiqueta videos con claseId
 *
 *  CÓMO USAR:
 *    Al final de modulo2_video.html, antes de </body>:
 *      <script src="motor_p1_bioseg_balayage.js"></script>
 *      <script src="motor_p2_queratina_elevaciones.js"></script>
 *      <script src="motor_p3_morfologia_alertas.js"></script>
 *      <script src="motor_helper.js"></script>
 *      <script src="m2_motor_bridge.js"></script>
 * ═══════════════════════════════════════════════════════════════
 */
(function(){
  'use strict';
  if(window._M2_BRIDGE_LOADED) return;
  window._M2_BRIDGE_LOADED = true;

  const target = (typeof window.MOTOR_PEEK_TARGET === 'function')
    ? window.MOTOR_PEEK_TARGET()
    : (function(){ try{ return JSON.parse(localStorage.getItem('fc_admin_target')||'null'); }catch(e){ return null; } })();

  installQueueInterceptor();

  if(!target || !target.claseId){
    console.log('%c[M2 BRIDGE] sin target activo · M2 funciona en modo libre', 'color:#7A6130');
    return;
  }
  console.log('%c[M2 BRIDGE] 🎯 target activo: ' + target.claseId + ' (' + target.cat + ')',
              'color:#60a5fa;font-weight:700');

  injectBanner(target);
  waitForPrompt(target);

  function injectBanner(t){
    const css = `
      #m2-bridge-banner{
        position:sticky;top:0;z-index:200;
        background:linear-gradient(90deg,rgba(96,165,250,.15),rgba(96,165,250,.04));
        border-bottom:1px solid rgba(96,165,250,.4);
        padding:10px 18px;
        display:flex;align-items:center;gap:14px;flex-wrap:wrap;
        font-family:'JetBrains Mono',monospace;font-size:11px;color:#60a5fa;
        animation:m2bin .3s ease-out;
      }
      @keyframes m2bin{from{transform:translateY(-100%);opacity:0;}}
      #m2-bridge-banner .b-ic{font-size:22px;}
      #m2-bridge-banner .b-info{flex:1;min-width:200px;line-height:1.5;}
      #m2-bridge-banner .b-info b{color:#fff;}
      #m2-bridge-banner .b-id{font-family:monospace;background:rgba(0,0,0,.4);padding:2px 8px;border-radius:4px;color:#60a5fa;font-size:10px;}
      #m2-bridge-banner .b-niv{font-size:9px;padding:2px 7px;border-radius:20px;background:rgba(0,0,0,.4);letter-spacing:1px;}
      #m2-bridge-banner .b-niv.p{color:#22c55e;}
      #m2-bridge-banner .b-niv.i{color:#3b82f6;}
      #m2-bridge-banner .b-niv.a{color:#a855f7;}
      #m2-bridge-banner .b-niv.m{color:#f59e0b;}
      #m2-bridge-banner .b-path{font-family:monospace;font-size:9px;color:#7A6130;}
      #m2-bridge-banner .b-x{background:rgba(231,76,60,.1);border:1px solid rgba(231,76,60,.3);color:#E74C3C;padding:5px 11px;border-radius:5px;cursor:pointer;font-size:9px;letter-spacing:.5px;font-family:inherit;}
      #m2-bridge-banner .b-x:hover{background:rgba(231,76,60,.2);}
    `;
    const style = document.createElement('style');
    style.id = 'm2-bridge-style';
    style.textContent = css;
    document.head.appendChild(style);

    const bar = document.createElement('div');
    bar.id = 'm2-bridge-banner';
    bar.innerHTML = `
      <div class="b-ic">🎬</div>
      <div class="b-info">
        Generando <b>VIDEO</b> para clase
        <span class="b-id">${t.claseId}</span>
        <span class="b-niv ${t.niv||'p'}">${(t.nivName||t.niv||'').toUpperCase()}</span>
        <br/>
        <b>${escapeHtml(t.titulo||'')}</b>
        <span style="opacity:.7;"> · ${escapeHtml(t.cat||'')}</span>
        <br/>
        <span class="b-path">📁 ${t.targetPath||'—'}</span>
      </div>
      <button class="b-x" onclick="window._M2_BRIDGE_CLEAR()">✕ Modo libre</button>
    `;
    if(document.body.firstChild) document.body.insertBefore(bar, document.body.firstChild);
    else document.body.appendChild(bar);

    window._M2_BRIDGE_CLEAR = function(){
      if(typeof window.MOTOR_CLEAR_TARGET === 'function') window.MOTOR_CLEAR_TARGET();
      else try{ localStorage.removeItem('fc_admin_target'); }catch(e){}
      const el = document.getElementById('m2-bridge-banner');
      if(el) el.remove();
    };
  }

  function waitForPrompt(t, tries){
    tries = tries || 0;
    const ids = ['txtPrompt','prompt','promptInput','txt-prompt'];
    let input = null;
    for(const id of ids){
      const el = document.getElementById(id);
      if(el && (el.tagName==='TEXTAREA' || el.tagName==='INPUT')){
        input = el; break;
      }
    }
    if(!input){
      if(tries < 50) return setTimeout(()=>waitForPrompt(t, tries+1), 200);
      return;
    }
    if(input.value && input.value.trim().length > 0) return;
    input.value = buildVideoPromptSuggestion(t);
    ['input','change','keyup'].forEach(ev => {
      try{ input.dispatchEvent(new Event(ev, {bubbles:true})); }catch(e){}
    });
    console.log('[M2 BRIDGE] prompt video pre-llenado');
  }

  function buildVideoPromptSuggestion(t){
    const base = (t.titulo||'').trim();
    const ctx = (t.cat||'').replace(/[^\w\s]/g,'').trim();
    const lower = (t.cat||'').toLowerCase();
    // Plantillas video — más movimiento que en imagen
    let style = 'cinematographic, slow camera movement, professional hairstyling, salon lighting, 4K';
    if(lower.includes('bioseguridad'))   style = 'professional hairdresser putting on protective equipment, slow zoom in, salon environment';
    else if(lower.includes('herramientas')) style = 'close-up of hair tools, gentle rotation, dramatic lighting, premium texture';
    else if(lower.includes('lavado'))    style = 'cinematic hair washing scene, water flow in slow motion, hands massaging';
    else if(lower.includes('tinte'))     style = 'hair coloring technique, brush applying tint to strands, smooth camera pan';
    else if(lower.includes('balayage'))  style = 'balayage technique, free-hand brush on hair, soft camera dolly';
    else if(lower.includes('queratina')) style = 'keratin treatment application, steam rising, plate gliding smoothly';
    else if(lower.includes('corte'))     style = 'precise hair cutting with scissors, slow motion strands falling';
    else if(lower.includes('morfolog'))  style = 'model turning slowly showing different angles, beautiful lighting on face';

    return `${base} — ${style}, ${ctx}, no text overlay, no watermark`;
  }

  function installQueueInterceptor(){
    const origSet = localStorage.setItem.bind(localStorage);
    if(origSet._m2_wrapped) return;
    const wrapped = function(key, val){
      try{
        if(key === 'fc_carpeta_queue'){
          const t = (typeof window.MOTOR_PEEK_TARGET === 'function')
            ? window.MOTOR_PEEK_TARGET()
            : (function(){ try{ return JSON.parse(localStorage.getItem('fc_admin_target')||'null'); }catch(e){ return null; } })();
          if(t && t.claseId){
            const queue = JSON.parse(val);
            if(Array.isArray(queue) && queue.length){
              queue.forEach(item => {
                if(item && !item.claseId){
                  const itemKind = item.tipo || 'vid';
                  const fileName = itemKind==='vid' ? 'video.mp4'
                                 : itemKind==='img' ? 'imagen.jpg'
                                 : itemKind==='aud' ? 'audio.mp3'
                                 : (item.label||'archivo');
                  item.claseId   = t.claseId;
                  item.cat       = t.cat;
                  item.slug      = t.slug;
                  item.niv       = t.niv;
                  item.titulo    = t.titulo;
                  item.targetPath = (typeof window.MOTOR_PATH === 'function')
                    ? window.MOTOR_PATH(t.claseId, itemKind)
                    : `academia/${t.slug}/${t.claseId}/${fileName}`;
                  item.label = `${t.claseId}_${fileName}`;
                }
              });
              val = JSON.stringify(queue);
              flashSuccess('✓ Enviado a M4 etiquetado como ' + t.claseId);
            }
          }
        }
      }catch(e){
        console.warn('[M2 BRIDGE] interceptor error:', e);
      }
      return origSet(key, val);
    };
    wrapped._m2_wrapped = true;
    localStorage.setItem = wrapped;
  }

  function flashSuccess(msg){
    let el = document.getElementById('m2-bridge-flash');
    if(!el){
      el = document.createElement('div');
      el.id = 'm2-bridge-flash';
      el.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:300;background:rgba(34,197,94,.95);color:#000;padding:12px 18px;border-radius:8px;font-family:JetBrains Mono,monospace;font-size:11px;font-weight:700;box-shadow:0 8px 24px rgba(0,0,0,.4);transition:opacity .3s;';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.style.opacity = '1';
    clearTimeout(el._t);
    el._t = setTimeout(()=>{ el.style.opacity='0'; }, 3500);
  }

  function escapeHtml(str){
    return String(str||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }
})();

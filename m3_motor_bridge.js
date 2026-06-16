/**
 * ═══════════════════════════════════════════════════════════════
 *  M3 MOTOR BRIDGE · Fátima Caldera Studio
 *  ────────────────────────────────────────────────────────────────
 *  Puente para modulo3_voz.html (TTS).
 *  Extra: si la clase tiene un campo `txt` en el motor (guion HTML),
 *  lo limpia y lo pre-llena en el textarea de M3.
 *
 *  CÓMO USAR:
 *    Antes de </body> de modulo3_voz.html:
 *      <script src="motor_p1_bioseg_balayage.js"></script>
 *      <script src="motor_p2_queratina_elevaciones.js"></script>
 *      <script src="motor_p3_morfologia_alertas.js"></script>
 *      <script src="motor_helper.js"></script>
 *      <script src="m3_motor_bridge.js"></script>
 * ═══════════════════════════════════════════════════════════════
 */
(function(){
  'use strict';
  if(window._M3_BRIDGE_LOADED) return;
  window._M3_BRIDGE_LOADED = true;

  const target = (typeof window.MOTOR_PEEK_TARGET === 'function')
    ? window.MOTOR_PEEK_TARGET()
    : (function(){ try{ return JSON.parse(localStorage.getItem('fc_admin_target')||'null'); }catch(e){ return null; } })();

  installQueueInterceptor();

  if(!target || !target.claseId){
    console.log('%c[M3 BRIDGE] sin target activo · M3 funciona en modo libre', 'color:#7A6130');
    return;
  }
  console.log('%c[M3 BRIDGE] 🎯 target activo: ' + target.claseId + ' (' + target.cat + ')',
              'color:#a78bfa;font-weight:700');

  injectBanner(target);
  waitForTextarea(target);

  function injectBanner(t){
    const css = `
      #m3-bridge-banner{
        position:sticky;top:0;z-index:200;
        background:linear-gradient(90deg,rgba(167,139,250,.15),rgba(167,139,250,.04));
        border-bottom:1px solid rgba(167,139,250,.4);
        padding:10px 18px;
        display:flex;align-items:center;gap:14px;flex-wrap:wrap;
        font-family:'JetBrains Mono',monospace;font-size:11px;color:#a78bfa;
        animation:m3bin .3s ease-out;
      }
      @keyframes m3bin{from{transform:translateY(-100%);opacity:0;}}
      #m3-bridge-banner .b-ic{font-size:22px;}
      #m3-bridge-banner .b-info{flex:1;min-width:200px;line-height:1.5;}
      #m3-bridge-banner .b-info b{color:#fff;}
      #m3-bridge-banner .b-id{font-family:monospace;background:rgba(0,0,0,.4);padding:2px 8px;border-radius:4px;color:#a78bfa;font-size:10px;}
      #m3-bridge-banner .b-niv{font-size:9px;padding:2px 7px;border-radius:20px;background:rgba(0,0,0,.4);letter-spacing:1px;}
      #m3-bridge-banner .b-niv.p{color:#22c55e;}
      #m3-bridge-banner .b-niv.i{color:#3b82f6;}
      #m3-bridge-banner .b-niv.a{color:#a855f7;}
      #m3-bridge-banner .b-niv.m{color:#f59e0b;}
      #m3-bridge-banner .b-path{font-family:monospace;font-size:9px;color:#7A6130;}
      #m3-bridge-banner .b-x{background:rgba(231,76,60,.1);border:1px solid rgba(231,76,60,.3);color:#E74C3C;padding:5px 11px;border-radius:5px;cursor:pointer;font-size:9px;letter-spacing:.5px;font-family:inherit;}
      #m3-bridge-banner .b-x:hover{background:rgba(231,76,60,.2);}
    `;
    const style = document.createElement('style');
    style.id = 'm3-bridge-style';
    style.textContent = css;
    document.head.appendChild(style);

    const bar = document.createElement('div');
    bar.id = 'm3-bridge-banner';
    bar.innerHTML = `
      <div class="b-ic">🔊</div>
      <div class="b-info">
        Generando <b>AUDIO</b> para clase
        <span class="b-id">${t.claseId}</span>
        <span class="b-niv ${t.niv||'p'}">${(t.nivName||t.niv||'').toUpperCase()}</span>
        <br/>
        <b>${escapeHtml(t.titulo||'')}</b>
        <span style="opacity:.7;"> · ${escapeHtml(t.cat||'')}</span>
        <br/>
        <span class="b-path">📁 ${t.targetPath||'—'}</span>
      </div>
      <button class="b-x" onclick="window._M3_BRIDGE_CLEAR()">✕ Modo libre</button>
    `;
    if(document.body.firstChild) document.body.insertBefore(bar, document.body.firstChild);
    else document.body.appendChild(bar);

    window._M3_BRIDGE_CLEAR = function(){
      if(typeof window.MOTOR_CLEAR_TARGET === 'function') window.MOTOR_CLEAR_TARGET();
      else try{ localStorage.removeItem('fc_admin_target'); }catch(e){}
      const el = document.getElementById('m3-bridge-banner');
      if(el) el.remove();
    };
  }

  function waitForTextarea(t, tries){
    tries = tries || 0;
    // Buscar textarea principal en M3
    const candidates = document.querySelectorAll('textarea.txt-area, textarea#txtTTS, textarea#ttsInput, textarea');
    let input = null;
    for(const el of candidates){
      if(el && el.offsetParent !== null){ input = el; break; } // visible
    }
    if(!input){
      if(tries < 50) return setTimeout(()=>waitForTextarea(t, tries+1), 200);
      return;
    }
    if(input.value && input.value.trim().length > 0) return;

    // Construir guion limpio: título + texto plano del motor (si existe)
    const clase = (typeof window.MOTOR_GET === 'function') ? window.MOTOR_GET(t.claseId) : null;
    const titulo = (clase && (clase.n || clase.titulo)) || t.titulo || '';
    const rawHtml = clase && clase.txt || '';
    const guion = htmlToReadable(rawHtml);
    const speech = guion
      ? `${titulo}.\n\n${guion}`
      : `${titulo}.\n\nBienvenida a esta clase de ${(t.cat||'').replace(/[^\w\s]/g,'').trim()}.\n[Aquí va el guion de la clase.]`;

    input.value = speech;
    ['input','change','keyup'].forEach(ev => {
      try{ input.dispatchEvent(new Event(ev, {bubbles:true})); }catch(e){}
    });
    console.log('[M3 BRIDGE] guion pre-llenado en textarea');
  }

  function htmlToReadable(html){
    if(!html) return '';
    // Convertir HTML del motor a texto plano legible para TTS
    let s = html
      .replace(/<div class="importante">[^<]*?(\S[^<]*)<\/div>/gi, '\n$1')
      .replace(/<div class="alerta">[^<]*?(\S[^<]*)<\/div>/gi, '\n¡Atención! $1')
      .replace(/<div class="tip">[^<]*?(\S[^<]*)<\/div>/gi, '\nConsejo: $1')
      .replace(/<span class="punto-num">(\d+)<\/span><span>([^<]+)<\/span>/gi, '\nPunto $1: $2')
      .replace(/<div class="punto">/gi, '\n')
      .replace(/<\/div>/gi, '\n')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<strong>([^<]+)<\/strong>/gi, '$1')
      .replace(/<em>([^<]+)<\/em>/gi, '$1')
      .replace(/<[^>]+>/g, '')         // strip remaining tags
      .replace(/&nbsp;/g, ' ')
      .replace(/[📌⚠️✅🚨]/g, '')      // remove emojis prefijo
      .replace(/[ \t]+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    return s;
  }

  function installQueueInterceptor(){
    const origSet = localStorage.setItem.bind(localStorage);
    if(origSet._m3_wrapped) return;
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
                  const itemKind = item.tipo || 'aud';
                  const fileName = itemKind==='aud' ? 'audio.mp3'
                                 : itemKind==='img' ? 'imagen.jpg'
                                 : itemKind==='vid' ? 'video.mp4'
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
              flashSuccess('✓ Audio enviado a M4 etiquetado como ' + t.claseId);
            }
          }
        }
      }catch(e){
        console.warn('[M3 BRIDGE] interceptor error:', e);
      }
      return origSet(key, val);
    };
    wrapped._m3_wrapped = true;
    localStorage.setItem = wrapped;
  }

  function flashSuccess(msg){
    let el = document.getElementById('m3-bridge-flash');
    if(!el){
      el = document.createElement('div');
      el.id = 'm3-bridge-flash';
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

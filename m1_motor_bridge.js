/**
 * ═══════════════════════════════════════════════════════════════
 *  M1 MOTOR BRIDGE · Fátima Caldera Studio
 *  PARCHE APLICADO: waitForPrompt no contamina con peluquería
 *  cuando el contexto es de peluquería → activa modo cats directamente
 * ═══════════════════════════════════════════════════════════════
 */
(function(){
  'use strict';
  if(window._M1_BRIDGE_LOADED) return;
  window._M1_BRIDGE_LOADED = true;

  const target = (typeof window.MOTOR_PEEK_TARGET === 'function')
    ? window.MOTOR_PEEK_TARGET()
    : (function(){ try{ return JSON.parse(localStorage.getItem('fc_admin_target')||'null'); }catch(e){ return null; } })();

  installQueueInterceptor();

  if(!target || !target.claseId){
    console.log('%c[M1 BRIDGE] sin target activo · M1 funciona en modo libre', 'color:#7A6130');
    return;
  }

  console.log('%c[M1 BRIDGE] 🎯 target activo: ' + target.claseId + ' (' + target.cat + ')',
              'color:#fbbf24;font-weight:700');

  injectBanner(target);
  waitForPrompt(target);

  function injectBanner(t){
    const css = `
      #m1-bridge-banner{
        position:sticky;top:0;z-index:200;
        background:linear-gradient(90deg,rgba(251,191,36,.15),rgba(251,191,36,.04));
        border-bottom:1px solid rgba(251,191,36,.4);
        padding:10px 18px;
        display:flex;align-items:center;gap:14px;flex-wrap:wrap;
        font-family:'JetBrains Mono',monospace;font-size:11px;
        color:#fbbf24;animation:m1bin .3s ease-out;
      }
      @keyframes m1bin{from{transform:translateY(-100%);opacity:0;}}
      #m1-bridge-banner .b-ic{font-size:22px;}
      #m1-bridge-banner .b-info{flex:1;min-width:200px;line-height:1.5;}
      #m1-bridge-banner .b-info b{color:#fff;}
      #m1-bridge-banner .b-id{font-family:monospace;background:rgba(0,0,0,.4);padding:2px 8px;border-radius:4px;color:#fbbf24;font-size:10px;}
      #m1-bridge-banner .b-niv{font-size:9px;padding:2px 7px;border-radius:20px;background:rgba(0,0,0,.4);letter-spacing:1px;}
      #m1-bridge-banner .b-niv.p{color:#22c55e;}
      #m1-bridge-banner .b-niv.i{color:#3b82f6;}
      #m1-bridge-banner .b-niv.a{color:#a855f7;}
      #m1-bridge-banner .b-niv.m{color:#f59e0b;}
      #m1-bridge-banner .b-path{font-family:monospace;font-size:9px;color:#7A6130;}
      #m1-bridge-banner .b-x{
        background:rgba(231,76,60,.1);border:1px solid rgba(231,76,60,.3);
        color:#E74C3C;padding:5px 11px;border-radius:5px;cursor:pointer;
        font-size:9px;letter-spacing:.5px;font-family:inherit;
      }
      #m1-bridge-banner .b-x:hover{background:rgba(231,76,60,.2);}
    `;
    const style = document.createElement('style');
    style.id = 'm1-bridge-style';
    style.textContent = css;
    document.head.appendChild(style);

    const bar = document.createElement('div');
    bar.id = 'm1-bridge-banner';
    bar.innerHTML = `
      <div class="b-ic">🎯</div>
      <div class="b-info">
        Generando imagen para clase
        <span class="b-id">${t.claseId}</span>
        <span class="b-niv ${t.niv||'p'}">${(t.nivName||t.niv||'').toUpperCase()}</span>
        <br/>
        <b>${escapeHtml(t.titulo||'')} </b>
        <span style="opacity:.7;"> · ${escapeHtml(t.cat||'')} </span>
        <br/>
        <span class="b-path">📁 ${t.targetPath||'—'} </span>
      </div>
      <button class="b-x" onclick="window._M1_BRIDGE_CLEAR()">✕ Modo libre</button>
    `;
    if(document.body.firstChild){
      document.body.insertBefore(bar, document.body.firstChild);
    } else {
      document.body.appendChild(bar);
    }

    window._M1_BRIDGE_CLEAR = function(){
      if(typeof window.MOTOR_CLEAR_TARGET === 'function') window.MOTOR_CLEAR_TARGET();
      else try{ localStorage.removeItem('fc_admin_target'); }catch(e){}
      const el = document.getElementById('m1-bridge-banner');
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

    // PARCHE: Si es peluquería (academia), NO tocar el textarea
    // Activar modo cats para que M1 use sus prompts profesionales de CATS[]
    const esPeluqueria = t.cat && t.cat.toLowerCase() !== 'fitness';
    if(esPeluqueria){
      setTimeout(function(){
        if(typeof window.activarModo === 'function') window.activarModo('cats');
        // Intentar seleccionar la categoría correcta en CATS[]
        if(window.CATS && Array.isArray(window.CATS)){
          const catLower = (t.cat||'').toLowerCase();
          const idx = window.CATS.findIndex(c =>
            catLower.includes(c.id) ||
            (c.label||c.id||''). toLowerCase().replace(/[^a-z]/g,'').includes(catLower.replace(/[^a-z]/g,'').slice(0,5))
          );
          if(idx >= 0 && window.S){ window.S.catIdx = idx; }
        }
        if(typeof window.updateModeUI === 'function') window.updateModeUI();
        console.log('[M1 BRIDGE] peluquería → modo cats activado, textarea intacto');
      }, 200);
      return; // NO pre-llenar textarea con prompt de peluquería
    }

    // FITNESS: solo pre-llenar si está vacío
    if(input.value && input.value.trim().length > 0) return;
    const suggestion = buildPromptSuggestion(t);
    if(!suggestion) return;
    input.value = suggestion;
    ['input','change','keyup'].forEach(ev => {
      try{ input.dispatchEvent(new Event(ev, {bubbles:true})); }catch(e){}
    });
    console.log('[M1 BRIDGE] prompt pre-llenado:', suggestion);
  }

  function buildPromptSuggestion(t){
    const base = (t.titulo||'').trim();
    const lower = (t.cat||'').toLowerCase();
    // Solo construir prompt para fitness — peluquería usa CATS[] directamente
    if(lower !== 'fitness') return '';
    const grupoEn = {gluteo:'glutes and hips',pierna:'legs (quadriceps, hamstrings, calves)',superior:'upper body (chest, back, shoulders, arms)'}[t.grupo] || t.grupo;
    const equipoEn = {maquina:'using professional gym machines',mancuerna:'using dumbbells and free weights',corporal:'using bodyweight only, no equipment'}[t.equipo] || t.equipo;
    const motorEn = {masa:'hypertrophy training, heavy load, focused on building muscle mass',perder:'high-intensity metabolic training, focused on fat loss',mantener:'controlled strength-maintenance training'}[t.motor] || t.motor;
    return base + ' — professional fitness training, ' + grupoEn + ', ' + equipoEn + ', ' + motorEn + ', no text, no watermark';
  }

  function installQueueInterceptor(){
    const origSet = localStorage.setItem.bind(localStorage);
    if(origSet._m1_wrapped) return;
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
                  const itemKind = item.tipo || 'img';
                  const fileName = itemKind==='img' ? 'imagen.jpg'
                                 : itemKind==='vid' ? 'video.mp4'
                                 : itemKind==='aud' ? 'audio.mp3'
                                 : itemKind==='pdf' ? 'guion.pdf'
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
        console.warn('[M1 BRIDGE] interceptor error:', e);
      }
      return origSet(key, val);
    };
    wrapped._m1_wrapped = true;
    localStorage.setItem = wrapped;
  }

  function flashSuccess(msg){
    let el = document.getElementById('m1-bridge-flash');
    if(!el){
      el = document.createElement('div');
      el.id = 'm1-bridge-flash';
      el.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:300;background:rgba(34,197,94,.95);color:#000;padding:12px 18px;border-radius:8px;font-family:JetBrains Mono,monospace;font-size:11px;font-weight:700;box-shadow:0 8px 24px rgba(0,0,0,.4);transition:opacity .3s;';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.style.opacity = '1';
    clearTimeout(el._t);
    el._t = setTimeout(()=>{ el.style.opacity='0'; }, 3500);
  }

  function escapeHtml(str){
    return String(str||'')
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }
})();
/* ════════════════════════════════════════════════════════════════
   HUB CRÉDITO BRIDGE · Academia Fátima Caldea
   ----------------------------------------------------------------
   Unifica el gasto de créditos de CADA bloque hacia el POZO GLOBAL
   del hub  ->  usuarios/{uid}.creditos
   Cada acción / descarga avisa al hub por postMessage; el hub descuenta
   en Firebase con una transacción atómica y reenvía el saldo. Así el
   badge del hub baja en TIEMPO REAL en cada acción de cualquier bloque,
   y los 10 créditos gratis son un único pozo compartido.

   Antes cada bloque descontaba por su cuenta (unos en localStorage,
   otros en usuarios_bloques.cr_bN) y el hub nunca se enteraba.

   Modo standalone (abrir el bloque suelto, sin hub)  ->  no toca nada,
   el bloque sigue funcionando como antes.
   ════════════════════════════════════════════════════════════════ */
(function(){
  if(window.__HUB_CR_BRIDGE) return;
  window.__HUB_CR_BRIDGE = true;

  var inHub = (window.parent && window.parent !== window);
  var lastSes = null;   /* recordamos uid/email de la sesión del hub */
  var miBloque = (window.FC_BLOQUE_ID || '').toString();  /* ej. 'b5' */

  /* Avisar al hub: descuenta según reglas (prueba-por-bloque / comprados) */
  function post(n, concepto){
    n = parseInt(n) || 0;
    if(inHub && n > 0){
      var esDescarga = /jpg|pdf|descarg/i.test(concepto||'');
      try{ window.parent.postMessage({tipo:'gastarCreditos', cantidad:n, concepto:(concepto||'Acción'),
        bloque:miBloque, esDescarga:esDescarga}, '*'); }catch(e){}
    }
  }
  window.hubGastar = post;

  /* ── 1) Redirigir escritores directos a usuarios_bloques -> pozo global ──
        (calc cromática b7, construcción b8, ejercicios b9) */
  function redirFirebase(){
    ['_B7_gastarFirebase','_B8_gastarFirebase','_B9_gastarFirebase'].forEach(function(fn){
      var orig = window[fn];
      if(typeof orig === 'function' && !orig._hubPatched){
        var nf = function(n, accion){ post(n, accion); return Promise.resolve(); };
        nf._hubPatched = true;
        window[fn] = nf;
      }
    });
  }

  /* ── 2) Envolver funciones de gasto locales que NO avisaban al hub ── */
  function wrapSync(name, getN, getC){
    var orig = window[name];
    if(typeof orig === 'function' && !orig._hubPatched){
      var nf = function(){
        var r = orig.apply(this, arguments);
        if(r === true){ post(getN(arguments), getC(arguments)); }
        return r;
      };
      nf._hubPatched = true;
      window[name] = nf;
    }
  }
  function aplicarWraps(){
    /* bloque1 corte:     _desc(n, concepto) */
    wrapSync('_desc',        function(a){return a[0];}, function(a){return a[1];});
    /* bloque4 nutrición:  gastarCredito(accion, cantidad) */
    wrapSync('gastarCredito',function(a){return a[1];}, function(a){return a[0];});
  }

  /* ── 3) Reflejar el saldo global en el display del bloque, en vivo ── */
  function aplicarSaldo(cr){
    cr = parseInt(cr);
    if(isNaN(cr)) return;
    /* claves locales que usan los distintos bloques */
    try{ localStorage.setItem('fc_credits', cr); }catch(e){}
    try{ sessionStorage.setItem('nn_creditos', String(cr)); }catch(e){}
    try{ localStorage.setItem('_cr_b7', JSON.stringify({credits:cr})); }catch(e){}
    /* objetos de estado mutables */
    if(window.CR_STATE && typeof window.CR_STATE === 'object') window.CR_STATE.credits = cr;
    if(window.CREDITS_STATE && typeof window.CREDITS_STATE === 'object'){ window.CREDITS_STATE.credits = cr; window.CREDITS_LOADED = true; }
    /* re-emitir hubSesion para bloques que siembran su número desde ahí
       (b7 cromática, b8 construcción, b9 ejercicios) — preservando uid/email */
    if(lastSes){
      try{
        window.postMessage({tipo:'hubSesion', uid:lastSes.uid, email:lastSes.email,
          creditos:cr, creditos_b6:cr, creditos_b7:cr, creditos_b8:cr, creditos_b9:cr}, '*');
      }catch(e){}
    }
    /* refrescar badges con cualquiera de los nombres conocidos */
    ['_badge','renderCreditos','_renderCR','_renderCreditsBadge','updateUI'].forEach(function(fn){
      if(typeof window[fn] === 'function'){ try{ window[fn](); }catch(e){} }
    });
    if(typeof window.initCreditos === 'function'){ try{ window.initCreditos(); }catch(e){} }
  }

  window.addEventListener('message', function(e){
    var d = e.data || {};
    if(!d || !d.tipo) return;
    if(d.tipo === 'hubSesion' || d.tipo === 'session'){
      lastSes = { uid:d.uid || (lastSes&&lastSes.uid) || '', email:d.email || (lastSes&&lastSes.email) || '' };
    } else if(d.tipo === 'sincronizarCreditos'){
      /* el hub ya envia el valor correcto del bloque (prueba gratis o comprados) */
      aplicarSaldo(d.creditos);
    } else if(d.tipo === 'creditosInsuficientes'){
      aplicarSaldo(d.disponibles);
    }
  });

  /* ── 4) Pedir el saldo actual al hub al cargar ── */
  function pedir(){ if(inHub){ try{ window.parent.postMessage({tipo:'pedirCreditos'}, '*'); }catch(e){} } }

  function apply(){ redirFirebase(); aplicarWraps(); }

  /* aplicar ahora y reintentar por si alguna función se define tarde */
  apply(); pedir();
  setTimeout(function(){ apply(); pedir(); }, 500);
  setTimeout(apply, 1500);

  try{ console.log('%c[HUB CR BRIDGE] ✓ gasto unificado al pozo global','color:#22c55e;font-weight:700'); }catch(e){}
})();

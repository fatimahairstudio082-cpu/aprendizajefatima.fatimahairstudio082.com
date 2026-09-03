/* ══════════════════════════════════════════════════════════════════
   ESTUDIO UNIVERSAL · NÚCLEO
   ------------------------------------------------------------------
   Sesión, plan, marca, navegación y el estado de la página que se
   está diseñando. Todo lo demás (parrilla, editor, QR, vídeo,
   proyectos, plan) cuelga de aquí.

   Cargado suelto no rompe nada: si no hay Firebase se queda en modo
   invitado y la página sigue funcionando para mirar y diseñar.
   ══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if (window._EU_NUCLEO_LOADED) return;
  window._EU_NUCLEO_LOADED = true;

  var CFG = {
    apiKey: 'AIzaSyCcvwC7NYFgXl74YTF8ouzu32SFwB559dw',
    authDomain: 'aprendisajefatima.firebaseapp.com',
    projectId: 'aprendisajefatima',
    storageBucket: 'aprendisajefatima.firebasestorage.app',
    messagingSenderId: '744176967394',
    appId: '1:744176967394:web:743b7c2a455e1e6ba7c8bb'
  };

  var MARCA_LOCAL = 'eu_marca';      // respaldo cuando no hay sesión
  var LOGO_LOCAL = 'eu_logo';        // el logo vive en el dispositivo
  var LOGOCFG_LOCAL = 'eu_logo_cfg';
  var auth = null, db = null;

  var EU = {
    motor: null, cerebro: null, disenos: null,
    uid: null, email: '', nombre: '',
    plan: 'free',
    invitado: false,
    marca: { nombre: '', tel: '', mail: '', web: '', dir: '', c1: '#7c3aed', c2: '#a855f7' },
    rubro: 'peluqueria',
    tono: 'cercano',
    formato: 'a4v',
    semilla: Math.floor(Math.random() * 1e9),
    pagina: null,          // la hoja que dibuja el motor
    proyectoId: null,      // id en proyectos/{uid} si ya se guardó
    qr: null,              // { el:Image, contenido:'', tipo:'', oculto:true }
    pantalla: 'plantillas'
  };
  window.EU = EU;

  /* ───────────── Ayudantes ───────────── */

  function $(id) { return document.getElementById(id); }
  EU.$ = $;

  EU.esc = function (s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  };

  EU.estado = function (id, msg, tipo) {
    var e = $(id);
    if (!e) return;
    e.innerHTML = msg ? '<div class="st ' + (tipo || 'proc') + '">' + msg + '</div>' : '';
  };

  EU.toast = function (msg) {
    var caja = $('euToast');
    if (!caja) return;
    var d = document.createElement('div');
    d.textContent = msg;
    caja.appendChild(d);
    setTimeout(function () { if (d.parentNode) d.parentNode.removeChild(d); }, 3200);
  };

  /* Traduce los errores de Firebase a algo que se entienda. */
  EU.traducir = function (e) {
    var c = (e && (e.code || e.message)) || '';
    if (/wrong-password|invalid-credential/.test(c)) return 'Correo o contraseña incorrectos.';
    if (/user-not-found/.test(c)) return 'Ese correo no está registrado.';
    if (/too-many-requests/.test(c)) return 'Demasiados intentos. Espera un minuto.';
    if (/network/.test(c)) return 'Sin conexión con el servidor.';
    if (/permission-denied/.test(c)) return 'Permisos de Firestore: ' + c;
    return (e && e.message) || String(e);
  };

  /* ───────────── Navegación ───────────── */

  EU.ir = function (p) {
    EU.pantalla = p;
    var todas = document.querySelectorAll('section.pantalla');
    for (var i = 0; i < todas.length; i++) todas[i].classList.remove('on');
    var s = $('p' + p.charAt(0).toUpperCase() + p.slice(1));
    if (p === 'qr') s = $('pQR');
    if (s) s.classList.add('on');

    ['euTabs', 'euMTabs'].forEach(function (nid) {
      var n = $(nid);
      if (!n) return;
      var b = n.querySelectorAll('button');
      for (var j = 0; j < b.length; j++) b[j].classList.toggle('on', b[j].getAttribute('data-p') === p);
    });

    try { window.scrollTo(0, 0); } catch (e) {}
    if (p === 'editor' && window.EU_EDITOR) EU_EDITOR.entrar();
    if (p === 'video' && window.EU_VIDEO) EU_VIDEO.entrar();
    if (p === 'qr' && window.EU_QR) EU_QR.entrar();
    if (p === 'mios' && window.EU_PROYECTOS) EU_PROYECTOS.entrar();
    if (p === 'plan' && window.EU_PLAN) EU_PLAN.entrar();
    if (p === 'triptico' && window.EU_TRIPTICO) EU_TRIPTICO.entrar();
    if (p === 'carrusel' && window.EU_CARRUSEL) EU_CARRUSEL.entrar();
    if (p === 'laminas' && window.EU_LAMINAS) EU_LAMINAS.entrar();
    if (p === 'repaso' && window.EU_REPASO) EU_REPASO.entrar();
  };

  function cablearPestanas() {
    ['euTabs', 'euMTabs'].forEach(function (nid) {
      var n = $(nid);
      if (!n) return;
      n.addEventListener('click', function (ev) {
        var b = ev.target.closest ? ev.target.closest('button') : null;
        if (b && b.getAttribute('data-p')) EU.ir(b.getAttribute('data-p'));
      });
    });
  }

  /* ───────────── Marca (ficha del negocio) ───────────── */

  EU.contactoTexto = function () {
    var m = EU.marca, p = [];
    if (m.tel) p.push(m.tel);
    if (m.web) p.push(m.web);
    else if (m.mail) p.push(m.mail);
    return p.join(' · ');
  };

  EU.pintarMarcaResumen = function () {
    var e = $('euMarcaResumen');
    if (!e) return;
    var m = EU.marca;
    var rub = (EU.cerebro && buscarNombre(EU.cerebro.rubros(), EU.rubro)) || EU.rubro;
    var ton = (EU.cerebro && buscarNombre(EU.cerebro.tonos(), EU.tono)) || EU.tono;
    e.innerHTML =
      '<b style="color:var(--tx)">' + EU.esc(m.nombre || 'Sin nombre todavía') + '</b><br>' +
      EU.esc(rub) + ' · tono ' + EU.esc(ton) +
      (m.tel ? '<br>' + EU.esc(m.tel) : '') +
      (m.web ? '<br>' + EU.esc(m.web) : '');
  };

  function buscarNombre(lista, id) {
    for (var i = 0; i < lista.length; i++) if (lista[i].id === id) return lista[i].nombre;
    return id;
  }

  EU.abrirMarca = function () {
    var m = EU.marca;
    $('euMNombre').value = m.nombre || '';
    $('euMTel').value = m.tel || '';
    $('euMMail').value = m.mail || '';
    $('euMWeb').value = m.web || '';
    $('euMDir').value = m.dir || '';
    $('euMC1').value = m.c1 || '#7c3aed';
    $('euMC2').value = m.c2 || '#a855f7';
    EU.estado('euMarcaEstado', '');
    $('euMarcaVelo').classList.add('on');
    EU.pintarMandosLogo();
  };
  EU.cerrarMarca = function () { $('euMarcaVelo').classList.remove('on'); };

  /* Los mandos del logo. El logo se aplica al momento —no espera al botón de
     guardar— porque no viaja a la cuenta: vive en este dispositivo. */
  EU.pintarMandosLogo = function () {
    var pv = $('euLogoPrevio');
    if (pv) pv.style.background = EU.logo.url
      ? '#fff url(' + EU.logo.url + ') center/contain no-repeat' : '#1a1a35';
    var tp = $('euLogoPos');
    if (tp) {
      tp.style.cssText = 'display:grid;grid-template-columns:repeat(3,1fr);gap:4px;max-width:150px';
      tp.innerHTML = ORDEN_POS.map(function (k) {
        var on = EU.logo.pos === k;
        return '<button data-logopos="' + k + '" title="' + EU.esc(LOGO_POS[k]) + '" ' +
          'style="height:30px;border-radius:6px;cursor:pointer;font-size:0;padding:0;' +
          'border:1.5px solid ' + (on ? 'var(--ac2)' : 'var(--bd)') + ';' +
          'background:' + (on ? 'var(--card2)' : 'var(--bg3)') + ';' +
          'display:flex;align-items:center;justify-content:center">' +
          '<span style="width:13px;height:9px;border-radius:2px;background:' +
          (on ? 'var(--ac2)' : 'var(--bd)') + '"></span></button>';
      }).join('');
      tp.querySelectorAll('[data-logopos]').forEach(function (b) {
        b.onclick = function () {
          EU.logo.pos = b.getAttribute('data-logopos');
          EU.guardarCfgLogo();
          EU.pintarMandosLogo();
          EU.refrescarPiezas();
        };
      });
    }
    var rt = $('euLogoTamRot');
    if (rt) rt.textContent = 'Dónde va · ' + LOGO_POS[EU.logo.pos] + '  ·  Tamaño ' + EU.logo.tam + ' % del ancho';
    var tm = $('euLogoTam');
    if (tm && String(tm.value) !== String(EU.logo.tam)) tm.value = EU.logo.tam;
  };

  EU.cablearLogo = function () {
    var f = $('euLogoFile');
    if (f) f.onchange = function (ev) {
      var file = ev.target.files && ev.target.files[0];
      ev.target.value = '';
      if (!file) return;
      var lec = new FileReader();
      lec.onload = function () {
        /* Se reescala a 512 px de lado mayor antes de guardarlo: un logo hecho
           con el móvil son varios megas y no cabe en el almacén del navegador. */
        var im = new Image();
        im.onload = function () {
          var k = Math.min(1, 512 / Math.max(im.naturalWidth, im.naturalHeight));
          var cv = document.createElement('canvas');
          cv.width = Math.max(1, Math.round(im.naturalWidth * k));
          cv.height = Math.max(1, Math.round(im.naturalHeight * k));
          cv.getContext('2d').drawImage(im, 0, 0, cv.width, cv.height);
          var url = cv.toDataURL('image/png');
          try { localStorage.setItem(LOGO_LOCAL, url); }
          catch (e) { EU.toast('El logo no cabe en este navegador, pero se usa mientras la página esté abierta.'); }
          EU.ponerImagenLogo(url, function () {
            EU.pintarMandosLogo();
            EU.refrescarPiezas();
            EU.toast('Logo puesto.');
          });
        };
        im.onerror = function () { EU.toast('Ese archivo no es una imagen que se pueda leer.'); };
        im.src = lec.result;
      };
      lec.readAsDataURL(file);
    };
    var q = $('euLogoQuitar');
    if (q) q.onclick = function () {
      try { localStorage.removeItem(LOGO_LOCAL); } catch (e) {}
      EU.ponerImagenLogo('', function () {
        EU.pintarMandosLogo();
        EU.refrescarPiezas();
        EU.toast('Logo quitado.');
      });
    };
    var t = $('euLogoTam');
    if (t) {
      t.oninput = function () {
        EU.logo.tam = parseInt(t.value, 10) || 9;
        var rt = $('euLogoTamRot');
        if (rt) rt.textContent = 'Dónde va · ' + LOGO_POS[EU.logo.pos] + '  ·  Tamaño ' + EU.logo.tam + ' % del ancho';
      };
      t.onchange = function () { EU.guardarCfgLogo(); EU.refrescarPiezas(); };
    }
  };

  EU.guardarMarca = function () {
    var m = {
      nombre: ($('euMNombre').value || '').trim().slice(0, 60),
      tel: ($('euMTel').value || '').trim().slice(0, 30),
      mail: ($('euMMail').value || '').trim().slice(0, 60),
      web: ($('euMWeb').value || '').trim().slice(0, 60),
      dir: ($('euMDir').value || '').trim().slice(0, 60),
      c1: $('euMC1').value,
      c2: $('euMC2').value
    };
    EU.marca = m;
    try { localStorage.setItem(MARCA_LOCAL, JSON.stringify(m)); } catch (e) {}
    EU.pintarMarcaResumen();

    if (!db || !EU.uid) {
      EU.cerrarMarca();
      EU.toast('Datos guardados en este dispositivo.');
      if (window.EU_PARRILLA) EU_PARRILLA.repintar();
      return;
    }
    EU.estado('euMarcaEstado', 'Guardando…', 'proc');
    db.collection('usuarios').doc(EU.uid).set({ marca: m }, { merge: true })
      .then(function () {
        EU.cerrarMarca();
        EU.toast('Ficha guardada en tu cuenta.');
        if (window.EU_PARRILLA) EU_PARRILLA.repintar();
      })
      .catch(function (e) {
        // Si las reglas todavía no dejan escribir 'marca', se avisa CLARO
        // en vez de fallar en silencio (queda guardado en el dispositivo).
        EU.estado('euMarcaEstado',
          'Guardado solo en este dispositivo. Firestore dijo: ' + EU.esc(EU.traducir(e)) +
          '<br>La administración tiene que publicar las reglas nuevas (ver LEEME_ESTUDIO_UNIVERSAL.md).', 'avi');
        if (window.EU_PARRILLA) EU_PARRILLA.repintar();
      });
  };

  /* ───────────── El logo ─────────────
     Se guarda en el dispositivo, no en la cuenta: es una imagen y no tiene
     por qué viajar. Se pinta ENCIMA de la hoja ya dibujada, en la misma capa
     en todas las piezas: folleto, tríptico, carrusel, láminas y vídeo. */

  EU.logo = { url: '', img: null, pos: 'ad', tam: 9 };

  /* Nueve huecos, los mismos que ya usa la foto de las fichas de Estudios:
     [columna, fila] · 0 izquierda/arriba, 1 centro, 2 derecha/abajo. */
  var POS_XY = {
    ai: [0, 0], ac: [1, 0], ad: [2, 0],
    mi: [0, 1], mc: [1, 1], md: [2, 1],
    bi: [0, 2], bc: [1, 2], bd: [2, 2]
  };
  var ORDEN_POS = ['ai', 'ac', 'ad', 'mi', 'mc', 'md', 'bi', 'bc', 'bd'];
  var LOGO_POS = {
    ai: 'Arriba izquierda', ac: 'Arriba centro', ad: 'Arriba derecha',
    mi: 'Centro izquierda', mc: 'Centro', md: 'Centro derecha',
    bi: 'Abajo izquierda', bc: 'Abajo centro', bd: 'Abajo derecha'
  };
  EU.LOGO_POS = LOGO_POS;

  /* Los nombres viejos de cuatro esquinas siguen valiendo: se traducen. */
  var VIEJAS = { td: 'ad', ti: 'ai', pd: 'bd', pc: 'bc' };

  function cargarLogoLocal() {
    try {
      var c = JSON.parse(localStorage.getItem(LOGOCFG_LOCAL) || 'null');
      if (c && typeof c === 'object') {
        var pv = VIEJAS[c.pos] || c.pos;
        if (LOGO_POS[pv]) EU.logo.pos = pv;
        if (c.tam) EU.logo.tam = Math.max(4, Math.min(40, c.tam));
      }
      var u = localStorage.getItem(LOGO_LOCAL) || '';
      if (u) EU.ponerImagenLogo(u);
    } catch (e) {}
  }

  EU.ponerImagenLogo = function (url, alAcabar) {
    if (!url) {
      EU.logo.url = ''; EU.logo.img = null;
      window.EU_LOGO = null;
      if (alAcabar) alAcabar();
      return;
    }
    var im = new Image();
    im.onload = function () {
      EU.logo.url = url; EU.logo.img = im;
      window.EU_LOGO = EU.logo;
      if (alAcabar) alAcabar();
    };
    im.onerror = function () { if (alAcabar) alAcabar(); };
    im.src = url;
  };

  EU.guardarCfgLogo = function () {
    try {
      localStorage.setItem(LOGOCFG_LOCAL, JSON.stringify({ pos: EU.logo.pos, tam: EU.logo.tam }));
    } catch (e) {}
  };

  /* El logo va después de todo y antes de la marca de agua. El tamaño es un
     porcentaje del ancho de la pieza, así que se ve igual en un A4 que en
     una historia de móvil. */
  EU.ponerLogo = function (ctx, W, H) {
    var im = EU.logo && EU.logo.img;
    if (!im || !(im.naturalWidth || im.width)) return;
    var anc = W * ((EU.logo.tam || 9) / 100);
    var alt = anc * ((im.naturalHeight || im.height) / (im.naturalWidth || im.width));
    var M = W * 0.055;
    var pos = POS_XY[EU.logo.pos] ? EU.logo.pos : 'ad';
    var col = POS_XY[pos][0], fil = POS_XY[pos][1];
    var x = col === 0 ? M : (col === 1 ? (W - anc) / 2 : W - M - anc);
    var y = fil === 0 ? M : (fil === 1 ? (H - alt) / 2 : H - M - alt);
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,.28)';
    ctx.shadowBlur = anc * 0.10;
    ctx.drawImage(im, x, y, anc, alt);
    ctx.restore();
  };

  /* Repintar lo que esté a la vista cuando cambia el logo. */
  EU.refrescarPiezas = function () {
    var m = { editor: 'EU_EDITOR', triptico: 'EU_TRIPTICO', carrusel: 'EU_CARRUSEL',
              laminas: 'EU_LAMINAS', video: 'EU_VIDEO' };
    var n = m[EU.pantalla];
    var mod = n && window[n];
    if (mod && mod.repintar) { try { mod.repintar(); return; } catch (e) {} }
    if (mod && mod.entrar) { try { mod.entrar(); } catch (e) {} }
  };

  function cargarMarcaLocal() {
    try {
      var m = JSON.parse(localStorage.getItem(MARCA_LOCAL) || 'null');
      if (m && typeof m === 'object') EU.marca = Object.assign(EU.marca, m);
    } catch (e) {}
  }

  /* ───────────── Plan ───────────── */

  EU.esPro = function () { return EU.plan === 'pro'; };

  EU.pintarPlan = function () {
    var c = $('euChipPlan');
    if (!c) return;
    c.textContent = EU.esPro() ? 'PRO' : 'FREE';
    c.classList.toggle('pro', EU.esPro());
  };

  /* ───────────── Sesión ───────────── */

  EU.entrar = function () {
    if (!auth) { EU.estado('euLoginEstado', 'No se pudo cargar Firebase. Comprueba la conexión.', 'err'); return; }
    var em = ($('euEmail').value || '').trim(), pw = $('euPass').value || '';
    if (!em || !pw) { EU.estado('euLoginEstado', 'Completa correo y contraseña.', 'err'); return; }
    $('euBtnEntrar').disabled = true;
    EU.estado('euLoginEstado', 'Entrando…', 'proc');
    auth.signInWithEmailAndPassword(em, pw)
      .catch(function (e) {
        EU.estado('euLoginEstado', EU.esc(EU.traducir(e)), 'err');
        $('euBtnEntrar').disabled = false;
      });
  };

  EU.mirarSinCuenta = function () {
    EU.invitado = true;
    $('euLogin').classList.remove('on');
    EU.toast('Modo mirar: puedes diseñar, pero no descargar ni guardar.');
  };

  function alHaberSesion(u) {
    EU.uid = u.uid;
    EU.email = u.email || '';
    EU.invitado = false;
    $('euLogin').classList.remove('on');
    var sub = $('euSub');
    if (sub) sub.textContent = EU.email;

    if (!db) return;
    db.collection('usuarios').doc(u.uid).get().then(function (d) {
      var v = (d.exists && d.data()) || {};
      EU.nombre = v.nombre || '';
      EU.plan = (v.plan === 'pro') ? 'pro' : 'free';
      if (v.marca && typeof v.marca === 'object') EU.marca = Object.assign(EU.marca, v.marca);
      if (!EU.marca.nombre) EU.marca.nombre = EU.nombre || '';
      EU.pintarPlan();
      EU.pintarMarcaResumen();
      if (window.EU_PARRILLA) EU_PARRILLA.repintar();
    }).catch(function (e) {
      EU.toast('No se pudo leer tu ficha: ' + EU.traducir(e));
    });
  }

  function alNoHaberSesion() {
    EU.uid = null; EU.plan = 'free'; EU.pintarPlan();
    if (!EU.invitado) $('euLogin').classList.add('on');
  }

  /* ───────────── Arranque ───────────── */

  function arrancar() {
    EU.motor = window.FOLLETO_MOTOR;
    EU.cerebro = window.FOLLETO_CEREBRO;
    EU.disenos = window.FOLLETO_DISENOS;

    if (!EU.motor || !EU.cerebro) {
      document.querySelector('.wrap').innerHTML =
        '<div class="st err">No se cargaron los motores de folletos ' +
        '(b6_folleto_motor.js / b6_folleto_cerebro.js). Recarga la página.</div>';
      return;
    }

    cargarMarcaLocal();
    cargarLogoLocal();
    EU.cablearLogo();
    cablearPestanas();
    EU.pintarPlan();
    EU.pintarMarcaResumen();

    try {
      if (window.firebase && firebase.apps !== undefined) {
        var app = firebase.apps.length ? firebase.app() : firebase.initializeApp(CFG);
        auth = firebase.auth(app);
        db = firebase.firestore(app);
        EU.db = db; EU.auth = auth;
        auth.onAuthStateChanged(function (u) { u ? alHaberSesion(u) : alNoHaberSesion(); });
      } else {
        EU.invitado = true;
      }
    } catch (e) {
      EU.invitado = true;
      EU.toast('Sin Firebase: modo mirar.');
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar);
  else arrancar();
})();

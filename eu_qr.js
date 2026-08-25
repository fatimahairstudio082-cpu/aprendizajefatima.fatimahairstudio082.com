/* ══════════════════════════════════════════════════════════════════
   ESTUDIO UNIVERSAL · P4 · QR
   ------------------------------------------------------------------
   La idea que lo hace útil: el dato viaja DENTRO del código, no
   impreso en la hoja. El cliente escanea y llama, pero no ve el
   número. Se genera en el propio dispositivo (librería qrcodejs), no
   sube a ningún servidor, y funciona impreso en blanco y negro.
   ══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if (window._EU_QR_LOADED) return;
  window._EU_QR_LOADED = true;

  var Q = {};
  window.EU_QR = Q;

  /* Cada tipo dice qué campos pide y cómo se arma el contenido del código. */
  var TIPOS = {
    tel:     { nombre: 'Teléfono',  campos: [['num', 'Número', '+34 600 00 00 00']],
               arma: function (v) { return 'tel:' + soloTel(v.num); } },
    whatsapp:{ nombre: 'WhatsApp',  campos: [['num', 'Número', '+34 600 00 00 00'], ['msg', 'Mensaje (opcional)', 'Hola, quiero pedir cita']],
               arma: function (v) {
                 var n = soloTel(v.num).replace(/\D/g, '');
                 return 'https://wa.me/' + n + (v.msg ? '?text=' + encodeURIComponent(v.msg) : '');
               } },
    correo:  { nombre: 'Correo',    campos: [['mail', 'Correo', 'hola@ejemplo.com'], ['asunto', 'Asunto (opcional)', 'Cita']],
               arma: function (v) { return 'mailto:' + v.mail + (v.asunto ? '?subject=' + encodeURIComponent(v.asunto) : ''); } },
    web:     { nombre: 'Web',       campos: [['url', 'Dirección', 'www.ejemplo.com']],
               arma: function (v) { return /^https?:/i.test(v.url) ? v.url : 'https://' + String(v.url).replace(/^\/+/, ''); } },
    wifi:    { nombre: 'Wifi',      campos: [['ssid', 'Nombre de la red', 'MiWifi'], ['clave', 'Contraseña', '']],
               arma: function (v) { return 'WIFI:T:WPA;S:' + esc2(v.ssid) + ';P:' + esc2(v.clave) + ';;'; } },
    vcard:   { nombre: 'vCard',     campos: [['nom', 'Nombre', ''], ['tel', 'Teléfono', ''], ['mail', 'Correo', ''], ['org', 'Negocio', '']],
               arma: function (v) {
                 return 'BEGIN:VCARD\nVERSION:3.0\nN:' + (v.nom || '') + '\nFN:' + (v.nom || '') +
                   '\nORG:' + (v.org || '') + '\nTEL:' + soloTel(v.tel) + '\nEMAIL:' + (v.mail || '') + '\nEND:VCARD';
               } },
    lugar:   { nombre: 'Ubicación', campos: [['dir', 'Dirección', 'Calle Mayor 12']],
               arma: function (v) { return 'https://maps.google.com/?q=' + encodeURIComponent(v.dir || ''); } },
    texto:   { nombre: 'Texto',     campos: [['txt', 'Lo que se lee al escanear', '']],
               arma: function (v) { return String(v.txt || ''); } }
  };

  var tipo = 'whatsapp';
  var valores = {};
  var ultimo = '';

  function soloTel(s) {
    var t = String(s || '').replace(/[^\d+]/g, '');
    return t;
  }
  function esc2(s) { return String(s || '').replace(/([\;,:"])/g, '\\$1'); }

  /* ───────────── Pintar la pantalla ───────────── */

  Q.entrar = function () {
    var t = EU.$('euQrTipos');
    if (!t) return;
    t.innerHTML = Object.keys(TIPOS).map(function (k) {
      return '<button class="pill' + (tipo === k ? ' on' : '') + '" data-qt="' + k + '">' + EU.esc(TIPOS[k].nombre) + '</button>';
    }).join('');
    t.onclick = function (e) {
      var b = e.target.closest && e.target.closest('button[data-qt]');
      if (!b) return;
      tipo = b.getAttribute('data-qt');
      Q.entrar();
    };
    campos();
    var lbl = EU.$('euQrLbl');
    if (lbl && !lbl._eu) { lbl._eu = true; lbl.oninput = generar; }
    var oc = EU.$('euQrOculto');
    if (oc && !oc._eu) { oc._eu = true; oc.onchange = aplicarOculto; }
    generar();
  };

  function campos() {
    var caja = EU.$('euQrCampos');
    var T = TIPOS[tipo];
    var v = (valores[tipo] = valores[tipo] || porDefecto(tipo));
    caja.innerHTML = T.campos.map(function (c) {
      return '<label class="mini-lbl">' + EU.esc(c[1]) + '</label>' +
        '<input type="text" data-qc="' + c[0] + '" value="' + EU.esc(v[c[0]] || '') +
        '" placeholder="' + EU.esc(c[2] || '') + '" maxlength="120">';
    }).join('');
    caja.querySelectorAll('[data-qc]').forEach(function (i) {
      i.oninput = function () { v[i.getAttribute('data-qc')] = i.value; generar(); };
    });
  }

  /* Los campos vienen rellenos con la ficha del negocio: nadie tiene que
     escribir su teléfono dos veces. */
  function porDefecto(k) {
    var m = EU.marca || {};
    if (k === 'tel') return { num: m.tel || '' };
    if (k === 'whatsapp') return { num: m.tel || '', msg: '' };
    if (k === 'correo') return { mail: m.mail || '', asunto: '' };
    if (k === 'web') return { url: m.web || '' };
    if (k === 'vcard') return { nom: m.nombre || '', tel: m.tel || '', mail: m.mail || '', org: m.nombre || '' };
    if (k === 'lugar') return { dir: m.dir || '' };
    return {};
  }

  /* ───────────── Generar el código ───────────── */

  function generar() {
    var contenido = '';
    try { contenido = TIPOS[tipo].arma(valores[tipo] || {}); } catch (e) { contenido = ''; }
    contenido = String(contenido || '').trim();
    var caja = EU.$('euQrLienzo');

    if (!contenido || contenido.length < 3) {
      caja.innerHTML = '<div style="color:#666;font-size:11px;padding:18px;text-align:center">Rellena el dato y aparece el código.</div>';
      EU.estado('euQrEstado', '');
      return;
    }
    if (typeof QRCode === 'undefined') {
      EU.estado('euQrEstado', 'No se cargó el generador de códigos QR. Comprueba la conexión y recarga.', 'err');
      return;
    }

    caja.innerHTML = '';
    try {
      new QRCode(caja, {
        text: contenido, width: 480, height: 480,
        colorDark: '#000000', colorLight: '#FFFFFF',
        correctLevel: QRCode.CorrectLevel.M
      });
    } catch (e) {
      EU.estado('euQrEstado', 'No se pudo crear el QR: ' + EU.esc(e.message || e), 'err');
      return;
    }
    ultimo = contenido;
    EU.estado('euQrEstado', 'Listo. Pruébalo con tu propio móvil antes de imprimir.', 'ok');
  }

  /* La librería devuelve <canvas> o <img> según el navegador: se normaliza. */
  function fuente() {
    var caja = EU.$('euQrLienzo');
    var cv = caja.querySelector('canvas'), im = caja.querySelector('img');
    try { return cv ? cv.toDataURL('image/png') : (im ? im.src : null); }
    catch (e) { return im ? im.src : null; }
  }

  /* ───────────── Acciones ───────────── */

  Q.ponerEnFolleto = function () {
    var src = fuente();
    if (!src) { EU.estado('euQrEstado', 'Todavía no hay ningún código generado.', 'avi'); return; }
    var img = new Image();
    img.onload = function () {
      if (window.EU_EDITOR) EU_EDITOR.repintar();
    };
    img.src = src;
    EU.qr = {
      el: img,
      contenido: ultimo,
      tipo: tipo,
      etiqueta: (EU.$('euQrLbl').value || 'Escanéame').slice(0, 28),
      pos: (EU.qr && EU.qr.pos) || '',
      oculto: EU.$('euQrOculto').checked
    };
    aplicarOculto();
    EU.toast('QR puesto en la hoja.');
    EU.ir('editor');
  };

  Q.quitar = function () {
    EU.qr = null;
    if (window.EU_EDITOR) EU_EDITOR.repintar();
    EU.toast('QR quitado de la hoja.');
  };

  /* «No imprimir mis datos»: se borra el contacto del pie de la hoja, porque
     ya viaja dentro del código. Si se desmarca, vuelve. */
  function aplicarOculto() {
    if (!EU.pagina) return;
    var oc = EU.$('euQrOculto');
    if (EU.qr) EU.qr.oculto = oc.checked;
    EU.pagina.pie = EU.pagina.pie || {};
    if (oc.checked && EU.qr) {
      if (EU.pagina.pie.contacto) EU.pagina.pie._contacto = EU.pagina.pie.contacto;
      EU.pagina.pie.contacto = '';
    } else if (EU.pagina.pie._contacto) {
      EU.pagina.pie.contacto = EU.pagina.pie._contacto;
    }
    if (window.EU_EDITOR) EU_EDITOR.repintar();
  }

  Q.descargar = function () {
    var src = fuente();
    if (!src) { EU.estado('euQrEstado', 'Todavía no hay ningún código generado.', 'avi'); return; }
    fetch(src).then(function (r) { return r.blob(); }).then(function (b) {
      EU_EDITOR.bajar(b, 'qr_' + tipo + '.png');
      EU.estado('euQrEstado', 'PNG descargado.', 'ok');
    }).catch(function () {
      EU.estado('euQrEstado', 'Este navegador no deja descargar el PNG. Manténlo pulsado y «guardar imagen».', 'avi');
    });
  };

  Q.contenido = function () { return ultimo; };
})();

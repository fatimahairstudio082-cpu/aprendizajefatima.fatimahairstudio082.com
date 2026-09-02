/* ══════════════════════════════════════════════════════════════════
   ESTUDIO UNIVERSAL · P5 · MIS PROYECTOS
   ------------------------------------------------------------------
   Contrato de datos:

     proyectos/{uid}/items/{id}
       tipo      'folleto' | 'video' | 'qr'
       nombre    string   (lo que se ve en la lista)
       pagina    map      la hoja tal cual la dibuja el motor
                          (rejilla, tema, formato, adornos, cabecera,
                           celdas, pie, colores)
       mini      string   miniatura JPEG pequeña, para la lista
       creado / tocado    marcas de tiempo del servidor

   Las FOTOS no se suben: son objetos del navegador. Se guarda el
   diseño y el texto; al abrir el proyecto se vuelven a poner las
   fotos si hacen falta. Así ningún proyecto pesa más de unos KB y
   nada privado sale del dispositivo sin pedirlo.
   ══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if (window._EU_PROYECTOS_LOADED) return;
  window._EU_PROYECTOS_LOADED = true;

  var P = {};
  var ultimos = [];        // los proyectos leídos, para no volver a Firestore
  window.EU_PROYECTOS = P;

  function col() {
    if (!EU.db || !EU.uid) return null;
    return EU.db.collection('proyectos').doc(EU.uid).collection('items');
  }

  /* ───────────── Guardar ───────────── */

  P.guardar = function () {
    if (!EU.pagina) { EU.toast('No hay nada que guardar.'); return; }
    if (!EU_PLAN.exigeSesion()) return;
    var c = col();
    if (!c) { EU.toast('Sin conexión con Firestore.'); return; }

    EU.estado('euEdEstado', 'Guardando el proyecto…', 'proc');

    contar().then(function (n) {
      var tope = EU_PLAN.topeProyectos();
      if (tope && !EU.proyectoId && n >= tope) {
        EU.estado('euEdEstado', '', '');
        EU_PLAN.muro('proyectos', 'Ahora mismo tienes ' + n + '.');
        return null;
      }
      var d = {
        tipo: 'folleto',
        nombre: nombreProyecto(),
        pagina: limpiarPagina(EU.pagina),
        mini: miniatura(),
        tocado: new Date().toISOString()
      };
      if (!EU.proyectoId) d.creado = d.tocado;
      var ref = EU.proyectoId ? c.doc(EU.proyectoId) : c.doc();
      return ref.set(d, { merge: true }).then(function () {
        EU.proyectoId = ref.id;
        EU.estado('euEdEstado', 'Proyecto guardado.', 'ok');
        EU.toast('Guardado en «Míos».');
      });
    }).catch(function (e) {
      EU.estado('euEdEstado',
        'No se pudo guardar. Firestore dijo: ' + EU.esc(EU.traducir(e)) +
        '<br>Si pone «permisos», la administración tiene que publicar las reglas nuevas ' +
        '(ver LEEME_ESTUDIO_UNIVERSAL.md).', 'err');
    });
  };

  function nombreProyecto() {
    var c = EU.pagina.cabecera || {};
    return String(c.titulo || EU.pagina.disenoNombre || 'Folleto').slice(0, 60);
  }

  /* Se quita todo lo que no cabe en un documento: las fotos son objetos vivos. */
  function limpiarPagina(p) {
    return JSON.parse(JSON.stringify(p, function (k, v) {
      if (k === 'media' || k === 'el') return undefined;
      return v;
    }));
  }

  /* Miniatura pequeña: entra de sobra en el documento y evita repintar la
     lista con el motor cada vez que se abre «Míos». */
  function miniatura() {
    try {
      var M = EU.motor;
      var F = M.FORMATOS[EU.pagina.formato] || M.FORMATOS.a4v;
      var cv = document.createElement('canvas');
      var e = 240 / F.w;
      cv.width = Math.round(F.w * e); cv.height = Math.round(F.h * e);
      M.pintar(cv.getContext('2d'), cv.width, cv.height, EU.pagina, { nPagina: 1 });
      return cv.toDataURL('image/jpeg', 0.6);
    } catch (e) { return ''; }
  }

  function contar() {
    var c = col();
    if (!c) return Promise.resolve(0);
    return c.get().then(function (s) { return s.size; });
  }

  /* ───────────── Listar ───────────── */

  P.entrar = function () {
    var caja = EU.$('euMios');
    if (!caja) return;
    if (!EU.uid) {
      caja.innerHTML = '';
      EU.estado('euMiosEstado', 'Entra con tu cuenta para ver tus proyectos guardados.', 'avi');
      return;
    }
    EU.estado('euMiosEstado', 'Cargando…', 'proc');
    col().get().then(function (s) {
      var arr = [];
      s.forEach(function (d) { var v = d.data() || {}; v._id = d.id; arr.push(v); });
      arr.sort(function (a, b) { return String(b.tocado || '').localeCompare(String(a.tocado || '')); });

      var tope = EU_PLAN.topeProyectos();
      EU.estado('euMiosEstado', arr.length
        ? arr.length + ' proyecto' + (arr.length === 1 ? '' : 's') +
          (tope ? ' · plan Free: ' + tope + ' como mucho' : ' · sin límite')
        : 'Todavía no has guardado ninguno. Diseña uno y pulsa «Guardar».', arr.length ? 'ok' : 'avi');

      ultimos = arr;
      caja.innerHTML = (arr.length
        ? '<div class="tira" style="width:100%;margin-bottom:10px">' +
          '<button class="btn btn-sm" id="euMiosZip">🗜 Todos en un ZIP</button></div>'
        : '') + arr.map(function (v) {
        return '<div class="proy-tarj">' +
          (v.mini ? '<img src="' + v.mini + '" style="display:block;width:100%">' : '') +
          '<div class="pie"><b style="font-size:12px">' + EU.esc(v.nombre || 'Sin nombre') + '</b>' +
          '<div style="font-size:10.5px;color:var(--tx2);margin:2px 0 7px">' +
          EU.esc(fecha(v.tocado)) + '</div>' +
          '<div class="tira">' +
          '<button class="btn btn-sm" data-abrir="' + v._id + '">Abrir</button>' +
          '<button class="btn btn-g btn-sm" data-dup="' + v._id + '">Duplicar</button>' +
          '<button class="btn btn-g btn-sm" data-png="' + v._id + '">↓ PNG</button>' +
          '<button class="btn btn-g btn-sm" data-borrar="' + v._id + '">Borrar</button>' +
          '</div></div></div>';
      }).join('');

      caja.querySelectorAll('[data-abrir]').forEach(function (b) {
        b.onclick = function () { abrir(b.getAttribute('data-abrir'), false); };
      });
      caja.querySelectorAll('[data-dup]').forEach(function (b) {
        b.onclick = function () { abrir(b.getAttribute('data-dup'), true); };
      });
      caja.querySelectorAll('[data-borrar]').forEach(function (b) {
        b.onclick = function () { borrar(b.getAttribute('data-borrar')); };
      });
      caja.querySelectorAll('[data-png]').forEach(function (b) {
        b.onclick = function () { bajarUno(b.getAttribute('data-png')); };
      });
      var z = EU.$('euMiosZip');
      if (z) z.onclick = zipTodos;

      var hb = EU.$('euMiosBandeja');
      if (hb && window.B6Bandeja) {
        if (P._des) { try { P._des(); } catch (e) {} }
        P._des = B6Bandeja.panel(hb, { origen: 'mios' }, 'mis-proyectos');
      }
    }).catch(function (e) {
      caja.innerHTML = '';
      EU.estado('euMiosEstado',
        'No se pudieron leer tus proyectos. Firestore dijo: ' + EU.esc(EU.traducir(e)) +
        '<br>Si pone «permisos», faltan las reglas nuevas (ver LEEME_ESTUDIO_UNIVERSAL.md).', 'err');
    });
  };

  function fecha(iso) {
    if (!iso) return '';
    try { return new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }); }
    catch (e) { return String(iso).slice(0, 10); }
  }

  /* La hoja de un proyecto guardado, a tamaño de imprenta. El documento
     guarda la página entera, así que se puede repintar sin abrirla. */
  function hojaDe(v) {
    var M = EU.motor;
    var pag = v.pagina;
    if (!M || !pag) return null;
    var F = M.FORMATOS[pag.formato] || M.FORMATOS.a4v;
    var cv = document.createElement('canvas');
    cv.width = F.w; cv.height = F.h;
    var ctx = cv.getContext('2d');
    M.pintar(ctx, F.w, F.h, pag, { nPagina: 1 });
    EU.ponerLogo(ctx, F.w, F.h);
    EU_PLAN.marcaAgua(ctx, F.w, F.h);
    return cv;
  }

  function limpioNombre(t) {
    return String(t || 'folleto').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'folleto';
  }

  function bajarUno(id) {
    var v = ultimos.filter(function (x) { return x._id === id; })[0];
    var cv = v && hojaDe(v);
    if (!cv) return EU.toast('Ese proyecto no se puede repintar.');
    cv.toBlob(function (b) {
      if (!b) return EU.toast('El navegador no pudo generar la imagen.');
      EU_EDITOR.bajar(b, limpioNombre(v.nombre) + '.png');
      if (window.B6Bandeja) {
        var u = URL.createObjectURL(b);
        B6Bandeja.apuntar(u, limpioNombre(v.nombre) + '.png', 'mios');
        setTimeout(function () { URL.revokeObjectURL(u); }, 10000);
      }
    }, 'image/png');
  }

  /* Todos los proyectos en un ZIP: se repintan uno a uno a tamaño de
     imprenta y se pasan a la bandeja, que es quien sabe armar el ZIP. */
  function zipTodos() {
    if (!ultimos.length) return EU.toast('No hay proyectos que bajar.');
    if (!EU_PLAN.exigeSesion()) return;
    if (!window.B6Bandeja) return EU.toast('La bandeja no está cargada.');
    var n = 0;
    ultimos.forEach(function (v, i) {
      var cv = hojaDe(v);
      if (!cv) return;
      B6Bandeja.apuntar(cv.toDataURL('image/png'),
        String(i + 1).padStart(2, '0') + '-' + limpioNombre(v.nombre) + '.png', 'mios');
      n++;
    });
    if (!n) return EU.toast('Ninguno de tus proyectos se pudo repintar.');
    EU.estado('euMiosEstado', 'Preparando el ZIP con ' + n +
      (n === 1 ? ' proyecto…' : ' proyectos…'), 'proc');
    setTimeout(function () { B6Bandeja.zip('mis-proyectos', { origen: 'mios' }); }, 900);
  }

  function abrir(id, duplicar) {
    col().doc(id).get().then(function (d) {
      if (!d.exists) { EU.toast('Ese proyecto ya no está.'); P.entrar(); return; }
      var v = d.data() || {};
      EU.pagina = v.pagina || null;
      EU.proyectoId = duplicar ? null : id;
      if (!EU.pagina) { EU.toast('Ese proyecto está vacío.'); return; }
      EU.toast(duplicar ? 'Copia abierta: al guardar se crea una nueva.' : 'Proyecto abierto.');
      EU.ir('editor');
    }).catch(function (e) {
      EU.estado('euMiosEstado', EU.esc(EU.traducir(e)), 'err');
    });
  }

  function borrar(id) {
    if (!window.confirm('¿Seguro que quieres borrar este proyecto? No se puede deshacer.')) return;
    col().doc(id).delete().then(function () {
      if (EU.proyectoId === id) EU.proyectoId = null;
      EU.toast('Proyecto borrado.');
      P.entrar();
    }).catch(function (e) {
      EU.estado('euMiosEstado', EU.esc(EU.traducir(e)), 'err');
    });
  }
})();

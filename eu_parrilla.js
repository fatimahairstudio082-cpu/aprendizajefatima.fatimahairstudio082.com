/* ══════════════════════════════════════════════════════════════════
   ESTUDIO UNIVERSAL · P1 · PARRILLA DE PLANTILLAS
   ------------------------------------------------------------------
   Enseña el catálogo de diseños dibujado por el MOTOR DE VERDAD (no
   son imágenes: es la misma función que pinta la hoja final), así que
   lo que se ve en la miniatura es exactamente lo que se descarga.

   Las miniaturas se pintan de una en una para que el móvil no se
   quede pillado con veinte lienzos a la vez.
   ══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if (window._EU_PARRILLA_LOADED) return;
  window._EU_PARRILLA_LOADED = true;

  var P = {};
  window.EU_PARRILLA = P;

  var filtroRej = '', filtroTema = '';   // '' = todas
  var cola = [], pintando = false;

  /* ───────────── Rellenar mandos ───────────── */

  function llenar() {
    var M = EU.motor, C = EU.cerebro;

    var sr = EU.$('euRubro');
    sr.innerHTML = C.rubros().map(function (r) {
      return '<option value="' + r.id + '">' + EU.esc(r.nombre) + '</option>';
    }).join('');
    sr.value = EU.rubro;
    sr.onchange = function () { EU.rubro = sr.value; P.repintar(); EU.pintarMarcaResumen(); };

    var st = EU.$('euTono');
    st.innerHTML = C.tonos().map(function (t) {
      return '<option value="' + t.id + '">' + EU.esc(t.nombre) + '</option>';
    }).join('');
    st.value = EU.tono;
    st.onchange = function () { EU.tono = st.value; P.repintar(); EU.pintarMarcaResumen(); };

    var sf = EU.$('euFormato');
    sf.innerHTML = '<option value="">Como venga la plantilla</option>' +
      Object.keys(M.FORMATOS).map(function (k) {
        return '<option value="' + k + '">' + EU.esc(M.FORMATOS[k].nombre) + '</option>';
      }).join('');
    sf.value = '';
    sf.onchange = function () { P.repintar(); };

    // Por número de cuadros, no por rejilla: hay dos de 2, dos de 4, dos de 6 y
    // dos de 8, y una tira «1 2 2 4 4 6 6 8 8» no dice nada. Al pulsar «4»
    // salen las dos de cuatro cuadros, que es lo que la persona quiere ver.
    var fr = EU.$('euFiltroRej');
    var cuentas = [];
    Object.keys(M.REJILLAS).forEach(function (k) {
      if (k === 'rlista') return;
      if (cuentas.indexOf(M.REJILLAS[k].n) < 0) cuentas.push(M.REJILLAS[k].n);
    });
    cuentas.sort(function (a, b) { return a - b; });
    fr.innerHTML = '<button class="pill on" data-r="">Todas</button>' +
      cuentas.map(function (n) {
        return '<button class="pill" data-r="n' + n + '">' + n +
          (n === 1 ? ' cuadro' : ' cuadros') + '</button>';
      }).join('') +
      '<button class="pill" data-r="rlista">lista</button>';
    fr.onclick = function (e) {
      var b = e.target.closest && e.target.closest('button[data-r]');
      if (!b) return;
      filtroRej = b.getAttribute('data-r');
      marcar(fr, b);
      P.repintar();
    };

    var ft = EU.$('euFiltroTema');
    ft.innerHTML = '<button class="pill on" data-t="">Todas</button>' +
      Object.keys(M.TEMAS).map(function (k) {
        return '<button class="pill" data-t="' + k + '" title="' + EU.esc(M.TEMAS[k].nombre) + '">' +
          '<i style="width:12px;height:12px;border-radius:3px;background:' + M.TEMAS[k].acento + ';display:inline-block"></i>' +
          EU.esc(M.TEMAS[k].nombre.split(' ')[0]) + '</button>';
      }).join('');
    ft.onclick = function (e) {
      var b = e.target.closest && e.target.closest('button[data-t]');
      if (!b) return;
      filtroTema = b.getAttribute('data-t');
      marcar(ft, b);
      P.repintar();
    };
  }

  function marcar(caja, btn) {
    var b = caja.querySelectorAll('button');
    for (var i = 0; i < b.length; i++) b[i].classList.remove('on');
    btn.classList.add('on');
  }

  /* ───────────── Armar la hoja de una plantilla ───────────── */

  P.hacerPagina = function (d, semilla) {
    var M = EU.motor, C = EU.cerebro;
    var rej = M.REJILLAS[d.rejilla] || M.REJILLAS.r4a;
    var pag = C.generar({
      rubro: EU.rubro, tono: EU.tono, n: rej.n,
      negocio: EU.marca.nombre || 'Tu negocio',
      contacto: EU.contactoTexto(),
      ciudad: EU.marca.dir || '',
      semilla: (semilla == null ? EU.semilla : semilla)
    });
    pag.rejilla = d.rejilla;
    pag.tema = d.tema;
    pag.adornos = Object.assign({}, d.adornos || {});
    pag.formato = EU.$('euFormato').value || d.formato || 'a4v';
    pag.disenoId = d.id;
    pag.disenoNombre = d.nombre;
    return pag;
  };

  /* ───────────── Miniaturas ───────────── */

  function filtradas() {
    var lista = EU.disenos ? EU.disenos.lista() : [];
    var M = EU.motor;
    return lista.filter(function (d) {
      if (filtroRej === 'rlista' && d.rejilla !== 'rlista') return false;
      if (filtroRej && filtroRej.charAt(0) === 'n') {
        var n = parseInt(filtroRej.slice(1), 10);
        if (d.rejilla === 'rlista' || !M.REJILLAS[d.rejilla] || M.REJILLAS[d.rejilla].n !== n) return false;
      }
      if (filtroTema && d.tema !== filtroTema) return false;
      return true;
    });
  }

  P.repintar = function () {
    var caja = EU.$('euParrilla');
    if (!caja) return;
    cola = []; pintando = false;

    var lista = filtradas();
    if (!lista.length) {
      caja.innerHTML = '';
      EU.estado('euParrillaEstado', 'Con esos filtros no queda ninguna plantilla. Quita alguno.', 'avi');
      return;
    }
    EU.estado('euParrillaEstado', '');

    caja.innerHTML = lista.map(function (d, i) {
      return '<div class="tarj" data-id="' + EU.esc(d.id) + '">' +
        '<canvas id="euMini' + i + '" width="10" height="14"></canvas>' +
        '<div class="pie"><b>' + EU.esc(d.nombre) + '</b>' +
        '<span>' + EU.esc(nombreTema(d.tema)) + ' · ' + EU.esc(nombreRej(d.rejilla)) + '</span></div>' +
        '</div>';
    }).join('');

    caja.onclick = function (e) {
      var t = e.target.closest && e.target.closest('.tarj');
      if (t) P.elegir(t.getAttribute('data-id'));
    };

    lista.forEach(function (d, i) { cola.push({ d: d, cv: EU.$('euMini' + i) }); });
    siguiente();
  };

  function nombreTema(k) { var t = EU.motor.TEMAS[k]; return t ? t.nombre : k; }
  function nombreRej(k) { var r = EU.motor.REJILLAS[k]; return r ? r.nombre : k; }

  /* Una miniatura por hueco de animación: así la parrilla aparece sola,
     de arriba abajo, y el navegador nunca se queda bloqueado. */
  function siguiente() {
    if (pintando) return;
    pintando = true;
    (function paso() {
      if (!cola.length) { pintando = false; return; }
      var t = cola.shift();
      try { dibujarMini(t.cv, t.d); } catch (e) {}
      requestAnimationFrame(paso);
    })();
  }

  function dibujarMini(cv, d) {
    if (!cv) return;
    var M = EU.motor;
    var pag = P.hacerPagina(d);
    var F = M.FORMATOS[pag.formato] || M.FORMATOS.a4v;
    var ancho = 360;                       // ancho fijo: se estira con CSS
    var esc = ancho / F.w;
    cv.width = Math.round(F.w * esc);
    cv.height = Math.round(F.h * esc);
    M.pintar(cv.getContext('2d'), cv.width, cv.height, pag, { nPagina: 1 });
  }

  /* ───────────── Acciones ───────────── */

  P.elegir = function (id) {
    var d = EU.disenos.get(id);
    if (!d) return;
    EU.pagina = P.hacerPagina(d);
    EU.proyectoId = null;
    EU.formato = EU.pagina.formato;
    EU.toast('Plantilla «' + (d.nombre || '').replace(/^\W+\s*/, '') + '» lista.');
    EU.ir('editor');
  };

  P.otraVersion = function () {
    EU.semilla = Math.floor(Math.random() * 1e9);
    P.repintar();
    EU.toast('El cerebro ha escrito otra versión.');
  };

  P.enBlanco = function () {
    var M = EU.motor;
    var n = M.REJILLAS.r4a.n, celdas = [];
    for (var i = 0; i < n; i++) celdas.push({ titulo: 'Escribe aquí', texto: '', precio: '', etiqueta: '' });
    EU.pagina = {
      cabecera: { marca: EU.marca.nombre || 'Tu negocio', titulo: 'Tu título', subtitulo: '' },
      celdas: celdas,
      pie: { cta: 'Contacta', contacto: EU.contactoTexto() },
      rejilla: 'r4a', tema: 'minimal', formato: EU.$('euFormato').value || 'a4v',
      adornos: { grano: false, vineta: false, filetes: true, sombras: false }
    };
    EU.proyectoId = null;
    EU.ir('editor');
  };

  /* ───────────── Arranque ───────────── */
  function arrancar() {
    if (!window.EU || !EU.motor) { setTimeout(arrancar, 120); return; }
    llenar();
    P.repintar();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar);
  else arrancar();
})();

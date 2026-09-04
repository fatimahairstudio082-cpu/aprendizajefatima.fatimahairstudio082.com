/* ══════════════════════════════════════════════════════════════════════════
   GUÍAS PRO 3D · <guias-3d>
   La cabeza de maniquí es la REPRESENTACIÓN del motor de corte, no un adorno.
   El motor manda: pila de elevaciones por zonas (Z0…Z6) en cara frontal y
   posterior, dirección de partición, y de ahí sale el dibujo sobre el cráneo —
   línea de partición, mechón proyectado al ángulo real, línea guía de corte y
   la numeración de cada elevación.

   Cambia un número en el motor → recalcula → la cabeza lo muestra.

   Piezas: Three.js para el cráneo y los trazos · un lienzo 2D encima para
   rótulos y numeración (es el que se graba) · la voz del navegador para la
   narración · jsPDF para el documento.
   ══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var URLS_THREE = [
    'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',
    'https://unpkg.com/three@0.128.0/build/three.min.js',
    'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.min.js',
    'https://esm.sh/three@0.128.0/build/three.min.js'
  ];

  /* ── Convenio de SphereGeometry en este archivo ───────────────────────────
     theta baja desde lo alto de la cabeza (0 = coronilla).
     phi: cara en π/2 (+Z) · oreja izquierda en 0 (−X) · oreja derecha en π
     (+X) · nuca en −π/2 (−Z). */
  var CARA = 1.5708, IZQ = 0, DER = 3.1416, NUCA = -1.5708;

  /* Las dos caras del motor. Cada una se divide en siete zonas de arriba
     abajo, igual que la pila de elevaciones del motor de corte. La frontal
     termina en la línea de nacimiento; la posterior baja hasta la nuca. */
  var CARAS = {
    frontal: {
      n: 'Frontal', col: '#B58A2B', col3: 0xB58A2B,
      /* De oreja a oreja: la cara frontal abarca de sien a sien pasando por el
         rostro, no una banda estrecha. Las particiones horizontales salen
         entonces de oreja a oreja, como se replantea de verdad.

         La frontal EMPIEZA delante de la coronilla (t0 0.34), no en el polo: la
         coronilla se trabaja con la parte de atrás. Con las dos caras naciendo
         en 0.10 sus bandas de zona se solapaban por arriba y las divisiones de
         la posterior salían pintadas sobre el área frontal. */
      p0: CARA - 1.42, p1: CARA + 1.42, t0: 0.34, t1: 1.30, vista: 'frente'
    },
    posterior: {
      n: 'Posterior', col: '#0E8A62', col3: 0x0E8A62,
      p0: NUCA - 0.90, p1: NUCA + 0.90, t0: 0.10, t1: 1.98, vista: 'nuca'
    }
  };

  var NZ = 7;

  /* Zonas de la coronilla a la base. IMPORTANTE: Z0 es la NUCA / borde
     inferior, que es donde empieza el corte a 0°, y de ahí sube. El panel las
     lista en ese mismo orden — Z0 abajo del todo — para que se lea igual que el
     motor y no parezca volteado. */
  var NOMBRE_Z = {
    frontal: ['Nacimiento frontal', 'Frontal baja', 'Frontal media', 'Frontal alta',
      'Cresta frontal', 'Parietal frontal', 'Coronilla'],
    posterior: ['Nuca baja', 'Nuca media', 'Nuca alta', 'Occipital bajo',
      'Occipital alto', 'Cresta posterior', 'Coronilla']
  };

  /* Colores de zona: siete pasos legibles sobre papel. */
  var COL_Z = ['#B01E45', '#C96A1E', '#D9920E', '#18906A', '#2C6FD1', '#7A4BD1', '#8A1C6B'];

  var PARTICIONES = [
    { id: 'horizontal', n: 'Horizontal', d: 'de lado a lado, oreja a oreja' },
    { id: 'vertical', n: 'Vertical', d: 'de la frente a la nuca' },
    { id: 'diagAdelante', n: 'Diagonal adelante', d: 'diagonal que sube hacia la cara' },
    { id: 'diagAtras', n: 'Diagonal atrás', d: 'diagonal que sube hacia la nuca' },
    { id: 'oblicua', n: 'Oblicua', d: 'oblicua marcada, para desconexión' }
  ];

  /* Abanico de referencia: los cinco gestos con nombre que salen del mismo
     punto, como en la lámina de técnica. Cada uno con su color y su etiqueta. */
  var GESTOS = [
    { g: 0, n: 'Caída natural', col: '#E0483C' },
    { g: 45, n: 'Ascendente', col: '#E08A2C' },
    { g: 90, n: 'Elevación 90°', col: '#18906A' },
    { g: 135, n: 'Totalmente ascendente', col: '#7A4BD1' },
    { g: 180, n: 'Vertical', col: '#2C6FD1' }
  ];

  var TIPOS_CORTE = ['Recto', 'Diagonal', 'Oblícuo', 'Desfilado', 'Desgrafilado', 'Punteado', 'Deslizado'];
  var HERRAMIENTAS = ['Tijera', 'Tijera de entresacar', 'Navaja', 'Máquina'];

  var ELEV_RAPIDAS = [0, 45, 90, 135, 180];

  var VISTAS = [
    { id: 'frente', n: 'Frente', a: 0, e: 0.05 },
    { id: 'perfilD', n: 'Perfil derecho', a: 1.57, e: 0.05 },
    { id: 'perfilI', n: 'Perfil izquierdo', a: -1.57, e: 0.05 },
    { id: 'nuca', n: 'Nuca', a: 3.14, e: 0.05 },
    { id: 'alto', n: 'Desde arriba', a: 0.6, e: 1.15 },
    { id: 'diag', n: 'Tres cuartos', a: 0.85, e: 0.28 }
  ];

  /* Cuántas cabezas se maquetan y qué enseña cada una. La secuencia sigue el
     orden con el que se recorre la cabeza en el taller: se empieza de frente,
     se comprueba de perfil y se termina por detrás. */
  var VISTAS_PANEL = {
    2: [
      { cara: 'frontal', vista: 'frente', n: 'De frente' },
      { cara: 'posterior', vista: 'nuca', n: 'Por detrás' }
    ],
    3: [
      { cara: 'frontal', vista: 'frente', n: 'De frente' },
      { cara: 'frontal', vista: 'perfilD', n: 'De perfil' },
      { cara: 'posterior', vista: 'nuca', n: 'Por detrás' }
    ],
    4: [
      { cara: 'frontal', vista: 'frente', n: 'De frente' },
      { cara: 'frontal', vista: 'perfilD', n: 'Perfil derecho' },
      { cara: 'posterior', vista: 'perfilI', n: 'Perfil izquierdo' },
      { cara: 'posterior', vista: 'nuca', n: 'Por detrás' }
    ]
  };

  /* Referencias de replanteo que se pueden encender sobre el cráneo. */
  var REFS = [
    { id: 'orejas', n: 'Oreja a oreja', on: true },
    { id: 'media', n: 'Línea media', on: true },
    { id: 'cresta', n: 'Cresta parietal', on: false },
    { id: 'diagonal', n: 'Diagonales', on: false }
  ];

  /* Las cuatro direcciones de peinado del campo Dirección, traducidas a
     geometría: cuánto se inclina el mechón (a, en radianes), en qué plano va la
     flecha maestra y hacia dónde apunta. "Al centro" cambia de signo según el
     lado, porque los dos lados convergen. */
  var SESGOS = {
    'Hacia el rostro': { a: 0.42, signo: 'lado', eje: 'sagital', sentido: 1, rotulo: 'Hacia el rostro' },
    'Hacia atrás': { a: -0.42, signo: 'lado', eje: 'sagital', sentido: -1, rotulo: 'Hacia atrás' },
    'Al centro': { a: 0.55, signo: 'centro', eje: 'transversal', sentido: -1, rotulo: 'Al centro' },
    'Natural': { a: 0, signo: 'fijo', eje: 'sagital', sentido: 1, rotulo: '' }
  };

  function pilaCero() { return [0, 0, 0, 0, 0, 0, 0]; }
  function pilaRampa() { return [0, 15, 30, 45, 60, 75, 90]; }

  function nuevoPaso(k) {
    var cara = k % 2 === 1 ? 'posterior' : 'frontal';
    return {
      titulo: 'Paso ' + k,
      cara: cara,
      /* Las dos pilas nacen con escalonado real. La frontal empezaba a 0° en
         todas sus zonas, así que al elegir Frontal los siete mechónes caían
         rectos y parecía que ese motor no hacía nada. */
      elevF: pilaRampa(),
      elevB: pilaRampa(),
      /* Con las dos caras a la vez, cuál manda en los paneles, la ficha y la
         escala. Antes estaba fijo en posterior: el motor frontal existía pero
         no se veía por ningún lado. */
      foco: 'posterior',
      /* Partición y zona son POR CARA. En un corte de dama la parte de atrás se
         divide en diagonal desde el occipital y la de delante en horizontal de
         oreja a oreja: con un solo valor compartido, tocar la trasera cambiaba
         la delantera y la vertical se perdía al saltar de cara. */
      zonaF: 3, zonaB: 3,
      particionF: 'horizontal',
      particionB: 'diagAtras',
      /* La vista SALE de la cara, no se fija a mano: cada cara tiene la suya
         (CARAS[cara].vista) y es la única desde la que se ven sus particiones.
         Con una vista fija el paso podía nacer mirando el rostro mientras todo
         el dibujo quedaba detrás del cráneo. */
      vista: CARAS[cara] ? CARAS[cara].vista : 'diag',
      // la ficha técnica que acompaña a la lámina
      tecnica: '', direccion: 'Hacia el rostro', tipoCorte: 'Diagonal',
      herramienta: 'Tijera', resultado: '', observaciones: '',
      /* Todo lo que hace la lámina profesional viene encendido: el goniómetro
         graduado y la lámina completa. Apagados por defecto la vista parecía
         pobre y había que descubrir los botones para llegar al diagrama real. */
      abanico: true, laminaCompleta: true, goniometro: true,
      /* Lámina limpia: fuera el abanico rotulado y el goniómetro. Quedan la
         geometría de la cabeza, las flechas de cada zona y sus números de
         elevación — que es lo que el alumno tiene que leer. */
      limpia: true,
      /* Dos cabezas a la vez: la frontal de frente y la posterior por detrás. */
      dos: false,
      texto: '',
      seg: 5
    };
  }

  var GUIA_VACIA = function () {
    return {
      nombre: 'Guía sin título', autora: '', tecnica: '',
      refs: { orejas: true, media: true, cresta: false, diagonal: false },
      pasos: [nuevoPaso(1)]
    };
  };

  var _three = null;
  function cargarThree(reintentar) {
    if (reintentar) _three = null;
    if (_three) return _three;
    _three = new Promise(function (ok, mal) {
      if (window.THREE) return ok(window.THREE);
      var i = 0;
      var probar = function () {
        if (i >= URLS_THREE.length) return mal(new Error('sin conexión'));
        var s = document.createElement('script');
        s.src = URLS_THREE[i++];
        var fin = false;
        var pasar = function () {
          if (fin) return; fin = true; clearTimeout(reloj); probar();
        };
        /* Un CDN puede quedarse colgado sin disparar onerror — en móvil pasa a
           menudo. Sin este plazo la carga espera para siempre y nunca se prueba
           el siguiente origen, que es lo que dejaba el diagrama plano. */
        var reloj = setTimeout(pasar, 9000);
        s.onload = function () {
          if (fin) return; fin = true; clearTimeout(reloj);
          window.THREE ? ok(window.THREE) : probar();
        };
        s.onerror = pasar;
        document.head.appendChild(s);
      };
      probar();
    });
    return _three;
  }

  var S = {
    caja: 'background:#18183a;border:1px solid #2d2d4a;border-radius:12px;padding:12px 14px',
    rot: 'font-size:10px;color:#94a3b8;letter-spacing:.06em;text-transform:uppercase;font-weight:700;display:block;margin:0 0 6px',
    inp: 'width:100%;background:#0f0f22;border:1px solid #2d2d4a;color:#e8e8f5;border-radius:8px;padding:7px 9px;font-size:12px;font-family:inherit;box-sizing:border-box',
    bt: 'border-radius:9px;padding:8px 13px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit',
    chipOn: 'flex:none;border-radius:20px;padding:6px 12px;font-size:11px;cursor:pointer;font-weight:600;background:rgba(168,85,247,.18);border:1px solid #a855f7;color:#e9d5ff;font-family:inherit',
    chipOff: 'flex:none;border-radius:20px;padding:6px 12px;font-size:11px;cursor:pointer;font-weight:600;background:#1a1a35;border:1px solid #2d2d4a;color:#94a3b8;font-family:inherit'
  };

  function el(tag, estilo, texto) {
    var e = document.createElement(tag);
    if (estilo) e.setAttribute('style', estilo);
    if (texto != null) e.textContent = texto;
    return e;
  }

  /* ═══════════════════════════════════════════════════════════════════════ */

  class GuiasTresD extends HTMLElement {
    connectedCallback() {
      if (this._montado) return;
      this._montado = true;
      this.guia = this.leerUltima() || GUIA_VACIA();
      if (!this.guia.refs) this.guia.refs = { orejas: true, media: true, cresta: false, diagonal: false };
      /* Guías guardadas con la pila frontal plana a 0°: era el valor heredado
         del arranque — el motor frontal parecía apagado —, nunca una decisión.
         Quien quiera todo a 0° lo tiene a un botón. */
      (this.guia.pasos || []).forEach(function (q) {
        if (q.elevF && q.elevF.join(',') === pilaCero().join(',')) q.elevF = pilaRampa();
      });
      this.aplicarFoto();
      this.iSel = 0;
      this.cam = { a: 0.85, e: 0.28, r: 6.2 };
      this.construir();
      var self = this;
      this.pintar2D();
      cargarThree().then(function (T) { self.escena(T); self.bucle(); })
        .catch(function () { self.sinTres(); });
    }

    disconnectedCallback() {
      this.vivo = false;
      if (this._raf) cancelAnimationFrame(this._raf);
      try { speechSynthesis.cancel(); } catch (e) { }
    }

    /* ────────────────────── el motor: cálculo puro ────────────────────── */

    /* Banda de theta de una zona. La zona 6 es la coronilla, la 0 el borde
       inferior de esa cara. */
    banda(cara, zi) {
      var C = CARAS[cara];
      var paso = (C.t1 - C.t0) / NZ;
      // zi 6 = arriba (t0) · zi 0 = abajo (t1)
      var k = NZ - 1 - zi;
      return [C.t0 + paso * k, C.t0 + paso * (k + 1)];
    }

    pila(p, cara) { return cara === 'frontal' ? p.elevF : p.elevB; }

    // partición y zona de una cara concreta, con respaldo a los campos antiguos
    part(p, cara) {
      var v = cara === 'frontal' ? p.particionF : p.particionB;
      return v || p.particion || (cara === 'frontal' ? 'horizontal' : 'diagAtras');
    }
    ponPart(p, cara, id) {
      if (cara === 'frontal') p.particionF = id; else p.particionB = id;
    }
    zonaDe(p, cara) {
      var v = cara === 'frontal' ? p.zonaF : p.zonaB;
      return v == null ? (p.zona == null ? 3 : p.zona) : v;
    }
    ponZona(p, cara, zi) {
      if (cara === 'frontal') p.zonaF = zi; else p.zonaB = zi;
    }
    // la cara cuyos datos se muestran en los paneles y rótulos
    caraFoco(p) {
      if (p.cara !== 'ambas') return p.cara;
      return p.foco === 'frontal' ? 'frontal' : 'posterior';
    }

    /* Recorrido de la partición dentro de una zona, según su dirección. Es lo
       que decide si el mechón sale de una raya horizontal, vertical u oblicua. */
    caminoParticion(cara, zi, dir, n) {
      var C = CARAS[cara], b = this.banda(cara, zi);
      var margenP = (C.p1 - C.p0) * 0.10;
      var p0 = C.p0 + margenP, p1 = C.p1 - margenP;
      var t0 = b[0] + (b[1] - b[0]) * 0.18, t1 = b[1] - (b[1] - b[0]) * 0.18;
      var tC = (t0 + t1) / 2, pC = (p0 + p1) / 2;
      var out = [];
      for (var i = 0; i < n; i++) {
        var u = n === 1 ? 0.5 : i / (n - 1);
        var ph, th;
        if (dir === 'vertical') {
          // raya que corre de la frente a la nuca dentro de la zona: recorre
          // theta a phi fijo, así el mechón sale de una vertical de verdad
          ph = pC; th = b[0] + (b[1] - b[0]) * u;
        } else if (dir === 'diagAdelante') {
          ph = p0 + (p1 - p0) * u; th = t1 - (t1 - t0) * u;
        } else if (dir === 'diagAtras') {
          ph = p0 + (p1 - p0) * u; th = t0 + (t1 - t0) * u;
        } else if (dir === 'oblicua') {
          ph = p0 + (p1 - p0) * u; th = t0 + (t1 - t0) * (0.15 + 0.85 * u);
        } else {
          ph = p0 + (p1 - p0) * u; th = tC;
        }
        out.push({ ph: ph, th: th });
      }
      return out;
    }

    /* Punto sobre el elipsoide del cráneo. */
    punto(ph, th, r) {
      var T = this.T, st = Math.sin(th);
      return new T.Vector3(
        -r * Math.cos(ph) * st,
        r * Math.cos(th) * this.ESC.y,
        r * Math.sin(ph) * st * this.ESC.z
      );
    }

    /* Normal al cuero en ese punto (sale perpendicular a la piel). */
    normal(ph, th) {
      var T = this.T, st = Math.sin(th);
      return new T.Vector3(
        -Math.cos(ph) * st,
        Math.cos(th),
        Math.sin(ph) * st
      ).normalize();
    }

    /* Dirección del mechón: el ángulo se mide desde la caída natural (0° = el
       pelo cuelga) hasta la perpendicular al cuero (90°) y más allá (180° =
       proyectado al lado opuesto). Es la definición del motor. */
    direccionMechon(ph, th, grados, sesgo) {
      var T = this.T;
      var nor = this.normal(ph, th);
      var abajo = new T.Vector3(0, -1, 0);
      var tan = abajo.clone().sub(nor.clone().multiplyScalar(abajo.dot(nor)));
      if (tan.lengthSq() < 1e-5) tan = new T.Vector3(0, 0, 1);
      tan.normalize();
      var a = (grados || 0) * Math.PI / 180;
      var d = tan.multiplyScalar(Math.cos(a)).add(nor.multiplyScalar(Math.sin(a))).normalize();
      return this.sesgar(d, nor, ph, sesgo);
    }

    /* La dirección de peinado no cambia la elevación: inclina el mechón de lado,
       girando alrededor de la normal al cuero.

       El signo del giro no es el mismo para todas las direcciones, y confundirlo
       peina medio cráneo al revés. Al girar sobre la normal el mechón se desplaza
       hacia (nor × abajo) = (sinφ·sθ, 0, cosφ·sθ): la componente de delante/detrás
       la manda cosφ y la de izquierda/derecha, sinφ.

       — Barrer al rostro o hacia atrás es mover el mechón en Z, así que el signo
         lo pone cosφ, o sea el lado de la cabeza.
       — Converger al centro es mover el mechón en X CONTRA su propia X, y como
         la posición va con cosφ y el desplazamiento con sinφ, el signo necesita
         los dos: sinφ·cosφ. Con el signo del barrido, "al centro" no convergía
         — era un "hacia el rostro" más fuerte. */
    sesgar(d, nor, ph, sesgo) {
      if (!sesgo || !sesgo.a) return d;
      var ang = sesgo.a * this.manoDe(sesgo.signo, ph);
      return d.applyAxisAngle(nor, ang).normalize();
    }

    manoDe(signo, ph) {
      if (signo === 'lado') return Math.cos(ph) >= 0 ? 1 : -1;
      if (signo === 'centro') return Math.sin(ph) * Math.cos(ph) >= 0 ? 1 : -1;
      return 1;
    }

    /* Cuánto se inclina y hacia dónde, según el campo Dirección de la ficha. */
    sesgoDe(p) {
      return SESGOS[(p && p.direccion) || 'Natural'] || SESGOS.Natural;
    }

    /* El cálculo completo del paso: para cada zona con elevación puesta,
       dónde va la partición, cómo sale el mechón y dónde cae la punta. */
    calcular(p) {
      var self = this;
      var res = { zonas: [], caras: [] };
      if (!this.T) return res;
      var caras = p.cara === 'ambas' ? ['frontal', 'posterior'] : [p.cara];
      res.caras = caras;

      var sesgo = this.sesgoDe(p);
      caras.forEach(function (cara) {
        var pila = self.pila(p, cara);
        for (var zi = NZ - 1; zi >= 0; zi--) {
          var grados = pila[zi];
          if (grados == null) continue;
          /* La zona en primer plano es la de SU cara: con un solo índice, elegir
             Z4 detrás marcaba también Z4 delante y las dos salían destacadas. */
          var esSel = (cara === p.cara || p.cara === 'ambas') && zi === self.zonaDe(p, cara);
          /* En modo lámina completa TODAS las zonas sacan su abanico con flecha,
             como en la lámina de referencia: la cabeza queda rodeada de mechones
             y el arco de puntas dibuja la línea de corte. En modo normal sólo la
             zona en primer plano, para poder estudiar una técnica sin ruido. */
          var completa = p.laminaCompleta;
          var nMech = esSel ? 7 : (completa ? 5 : 0);
          var dirP = self.part(p, cara);
          var camino = nMech ? self.caminoParticion(cara, zi, dirP, nMech) : [];
          var rayaN = self.caminoParticion(cara, zi, dirP, 14);
          var largo = esSel ? 1.02 : (completa ? 0.86 : 0);

          var segs = [], puntas = [], centro = null, ancCentro = null, norCentro = null;
          for (var i = 0; i < camino.length; i++) {
            var ph = camino[i].ph, th = camino[i].th;
            var anc = self.punto(ph, th, 1.02);
            var dir = self.direccionMechon(ph, th, grados, sesgo);
            var pt = anc.clone().add(dir.clone().multiplyScalar(largo));
            segs.push(anc, pt);
            puntas.push(pt);
            if (i === Math.floor(camino.length / 2)) {
              centro = pt.clone(); ancCentro = anc.clone(); norCentro = self.normal(ph, th);
            }
          }

          res.zonas.push({
            cara: cara, zi: zi, grados: grados, sel: esSel,
            col: COL_Z[zi], col3: parseInt(COL_Z[zi].slice(1), 16),
            segs: segs, puntas: puntas, centro: centro,
            ancla: ancCentro, nor: norCentro,
            raya: rayaN.map(function (c) { return self.punto(c.ph, c.th, 1.032); })
          });
        }
      });
      return res;
    }

    /* ─────────────────────────── interfaz ─────────────────────────── */

    construir() {
      this.style.display = 'block';
      /* En un móvil el panel no puede ir al lado: empuja la cabeza fuera de
         pantalla. Debajo de 900px pasa a una sola columna, con el visor arriba. */
      var cont = el('div', 'display:grid;grid-template-columns:1fr 348px;gap:14px;align-items:start');
      var mq = window.matchMedia('(max-width: 900px)');
      var acomodar = function () {
        cont.style.gridTemplateColumns = mq.matches ? '1fr' : '1fr 348px';
      };
      acomodar();
      if (mq.addEventListener) mq.addEventListener('change', acomodar);
      else if (mq.addListener) mq.addListener(acomodar);
      var self = this;

      var izq = el('div', 'min-width:0');
      var marco = el('div', 'position:relative;background:#F2EEE7;border:1px solid #2d2d4a;border-radius:14px;overflow:hidden');
      this.cv = el('canvas', 'display:block;width:100%;height:auto;touch-action:none;cursor:grab');
      this.cv.width = 1280; this.cv.height = 720;
      marco.appendChild(this.cv);
      izq.appendChild(marco);

      var barra = el('div', 'display:flex;gap:6px;flex-wrap:wrap;margin-top:10px;align-items:center');
      VISTAS.forEach(function (v) {
        var b = el('button', S.chipOff, v.n);
        b.onclick = function () { self.irVista(v, true); };
        barra.appendChild(b);
      });
      /* El selector de cabezas vive AQUÍ, junto al visor: en el panel del paso
         quedaba enterrado entre chips y no se encontraba. */
      barra.appendChild(el('span', 'font-size:10px;color:#7c7c9e;letter-spacing:.06em;text-transform:uppercase;font-weight:700;margin-left:6px', 'Cabezas'));
      this.btnCab = [];
      [[1, '□ 1'], [2, '◫ 2'], [3, '▤ 3'], [4, '▦ 4']].forEach(function (par) {
        var b = el('button', S.chipOff, par[1]);
        b._n = par[0];
        b.title = par[0] === 1 ? 'Una sola cabeza, girable'
          : (VISTAS_PANEL[par[0]] || []).map(function (v) { return v.n; }).join(' · ');
        b.onclick = function () { self.ponerCabezas(par[0]); };
        self.btnCab.push(b);
        barra.appendChild(b);
      });
      barra.appendChild(el('span', 'font-size:10px;color:#7c7c9e;flex-basis:100%;line-height:1.5;margin-top:2px', 'Con dos o más cabezas el mismo paso se ve desde varios ángulos a la vez; arrastra para inclinarlas todas.'));
      izq.appendChild(barra);

      // referencias de replanteo
      var fr = el('div', 'display:flex;gap:6px;flex-wrap:wrap;margin-top:7px;align-items:center');
      fr.appendChild(el('span', 'font-size:10px;color:#7c7c9e;letter-spacing:.06em;text-transform:uppercase;font-weight:700', 'Referencias'));
      this.btnRefs = {};
      REFS.forEach(function (r) {
        var b = el('button', S.chipOff, r.n);
        b.onclick = function () {
          self.guia.refs[r.id] = !self.guia.refs[r.id];
          self.pintarRefs(); self.refrescarPanel();
        };
        self.btnRefs[r.id] = b;
        fr.appendChild(b);
      });
      izq.appendChild(fr);

      this.txtEstado = el('div', 'font-size:11.5px;color:#94a3b8;margin-top:9px;line-height:1.6;min-height:18px');
      izq.appendChild(this.txtEstado);

      var acc = el('div', 'display:flex;gap:7px;flex-wrap:wrap;margin-top:10px');
      var mk = function (txt, estilo, fn) {
        var b = el('button', S.bt + ';' + estilo, txt);
        b.onclick = fn; acc.appendChild(b); return b;
      };
      mk('▶ Ver la guía', 'background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;border:0', function () { self.reproducir(false); });
      mk('🔊 Ver con narración', 'background:transparent;border:1px solid #a855f7;color:#e9d5ff', function () { self.reproducir(true); });
      mk('👁 Vista previa', 'background:transparent;border:1px solid #2d2d4a;color:#cbd5e1', function () { self.vistaPrevia(); });
      mk('⏺ Descargar vídeo', 'background:transparent;border:1px solid #2d2d4a;color:#cbd5e1', function () { self.grabar(); });
      mk('📄 Descargar PDF', 'background:transparent;border:1px solid #2d2d4a;color:#cbd5e1', function () { self.pdf(); });
      mk('⤓ Descargar láminas', 'background:transparent;border:1px solid #06b6d4;color:#a5f3fc', function () { self.abrirLote(); });
      mk('🎙 Vídeo narrado', 'background:transparent;border:1px solid #06b6d4;color:#a5f3fc', function () { self.abrirVid(); });
      izq.appendChild(acc);

      this.tira = el('div', 'display:none;gap:8px;margin-top:12px;overflow-x:auto;padding-bottom:4px');
      izq.appendChild(this.tira);

      this.cajaLote = el('div', 'display:none;margin-top:12px;background:#141430;border:1px solid #2d2d4a;border-radius:12px;padding:12px 14px');
      izq.appendChild(this.cajaLote);

      this.cajaVid = el('div', 'display:none;margin-top:12px;background:#141430;border:1px solid #2d2d4a;border-radius:12px;padding:12px 14px');
      izq.appendChild(this.cajaVid);

      if (window.B6Bandeja) {
        this.cajaBan = el('div', '');
        izq.appendChild(this.cajaBan);
        if (this._offBan) { try { this._offBan(); } catch (e) { } }
        this._offBan = B6Bandeja.panel(this.cajaBan, { origen: 'guias' }, 'guias');
      }

      // escala y ficha, en HTML donde sí se leen
      this.datos = el('div', 'display:flex;gap:10px;flex-wrap:wrap;margin-top:12px');
      izq.appendChild(this.datos);

      /* ── panel derecho ── */
      var der = el('div', 'display:flex;flex-direction:column;gap:12px;min-width:0');

      /* La biblioteca de cortes: familia → corte → cabello. El corte pone la
         geometría; el cabello decide la dirección del filo y el aviso. */
      if (window.EU_CORTES) {
        this.cCortes = el('div', S.caja);
        der.appendChild(this.cCortes);
      }

      var cDatos = el('div', S.caja);
      cDatos.appendChild(el('label', S.rot, 'La guía'));
      this.inNombre = el('input', S.inp); this.inNombre.placeholder = 'Nombre de la guía';
      this.inAutora = el('input', S.inp + ';margin-top:6px'); this.inAutora.placeholder = 'Tu nombre profesional';
      this.inTecnica = el('input', S.inp + ';margin-top:6px'); this.inTecnica.placeholder = 'Técnica (balayage, bob, mechas…)';
      /* El QR: enlace o texto que se imprime en la esquina de la lámina para que
         la alumna se lleve la guía al móvil. */
      this.inQR = el('input', S.inp + ';margin-top:6px'); this.inQR.placeholder = 'QR: enlace al vídeo o texto';
      this.inQR.oninput = function () { self.guia.qr = self.inQR.value; self.sincroQR(); };
      [['nombre', this.inNombre], ['autora', this.inAutora], ['tecnica', this.inTecnica]].forEach(function (par) {
        par[1].oninput = function () { self.guia[par[0]] = par[1].value; self.pintar2D(); };
        cDatos.appendChild(par[1]);
      });
      cDatos.appendChild(this.inQR);
      /* Foto de la clienta: el diagrama se dibuja ENCIMA, en capas, para que la
         guía se entienda sobre el pelo real y no sólo sobre el maniquí. */
      var fFoto = el('div', 'display:flex;gap:6px;flex-wrap:wrap;margin-top:8px');
      var bFoto = el('button', S.bt + ';background:#1a1a35;border:1px solid #2d2d4a;color:#cbd5e1', '🖼️ Foto de la clienta');
      var inFoto = el('input', 'display:none'); inFoto.type = 'file'; inFoto.accept = 'image/*';
      bFoto.onclick = function () { inFoto.click(); };
      inFoto.onchange = function () {
        var f = inFoto.files && inFoto.files[0];
        if (!f) return;
        var lec = new FileReader();
        lec.onload = function () { self.guia.foto = lec.result; self.aplicarFoto(); };
        lec.readAsDataURL(f);
        inFoto.value = '';
      };
      var bSinFoto = el('button', S.bt + ';background:#1a1a35;border:1px solid #2d2d4a;color:#cbd5e1', '✕ Quitar');
      bSinFoto.onclick = function () { self.guia.foto = ''; self.aplicarFoto(); };
      fFoto.appendChild(bFoto); fFoto.appendChild(inFoto); fFoto.appendChild(bSinFoto);
      cDatos.appendChild(fFoto);

      der.appendChild(cDatos);

      var cPasos = el('div', S.caja);
      cPasos.appendChild(el('label', S.rot, 'Pasos'));
      this.listaPasos = el('div', 'display:flex;flex-direction:column;gap:5px');
      cPasos.appendChild(this.listaPasos);
      var bAdd = el('button', S.bt + ';background:#1a1a35;border:1px dashed #4b4b7a;color:#cbd5e1;width:100%;margin-top:8px', '+ Añadir paso');
      bAdd.onclick = function () {
        self.guia.pasos.push(nuevoPaso(self.guia.pasos.length + 1));
        self.iSel = self.guia.pasos.length - 1;
        self.refrescarPanel(); self.aplicarPaso();
      };
      cPasos.appendChild(bAdd);
      der.appendChild(cPasos);

      this.cMotor = el('div', S.caja);
      der.appendChild(this.cMotor);

      this.cEdit = el('div', S.caja);
      der.appendChild(this.cEdit);

      var cArch = el('div', S.caja);
      cArch.appendChild(el('label', S.rot, 'Guardar y compartir'));
      var fila = el('div', 'display:flex;gap:6px;flex-wrap:wrap');
      var bG = el('button', S.bt + ';background:#1a1a35;border:1px solid #2d2d4a;color:#cbd5e1', '💾 Guardar');
      bG.onclick = function () { self.guardar(); };
      var bE = el('button', S.bt + ';background:#1a1a35;border:1px solid #2d2d4a;color:#cbd5e1', '📤 Exportar');
      bE.onclick = function () { self.exportar(); };
      var bI = el('button', S.bt + ';background:#1a1a35;border:1px solid #2d2d4a;color:#cbd5e1', '📥 Importar');
      var fIn = el('input', 'display:none'); fIn.type = 'file'; fIn.accept = 'application/json,.json';
      fIn.onchange = function (ev) { self.importar(ev); };
      bI.onclick = function () { fIn.click(); };
      [bG, bE, bI].forEach(function (b) { fila.appendChild(b); });
      cArch.appendChild(fila);
      cArch.appendChild(fIn);
      this.listaGuardadas = el('div', 'display:flex;flex-direction:column;gap:4px;margin-top:9px');
      cArch.appendChild(this.listaGuardadas);
      der.appendChild(cArch);

      cont.appendChild(izq); cont.appendChild(der);
      this.appendChild(cont);

      this.inNombre.value = this.guia.nombre;
      this.inAutora.value = this.guia.autora || '';
      this.inTecnica.value = this.guia.tecnica || '';
      this.panelCortes();
      this.refrescarPanel();
      this.raton();
    }

    refrescarPanel() {
      var self = this;
      REFS.forEach(function (r) {
        var b = self.btnRefs[r.id];
        if (b) b.setAttribute('style', self.guia.refs[r.id] ? S.chipOn : S.chipOff);
      });

      this.listaPasos.textContent = '';
      this.guia.pasos.forEach(function (p, i) {
        var C = CARAS[p.cara] || CARAS.frontal;
        var caraF = self.caraFoco(p);
        var pila = self.pila(p, caraF);
        var rango = Math.min.apply(null, pila) + '–' + Math.max.apply(null, pila) + '°';
        var f = el('div', 'display:flex;align-items:center;gap:6px;border-radius:9px;padding:7px 9px;cursor:pointer;' +
          (i === self.iSel ? 'background:rgba(168,85,247,.14);border:1px solid #a855f7' : 'background:#1a1a35;border:1px solid #2d2d4a'));
        var pun = el('span', 'width:20px;height:20px;flex:none;border-radius:50%;display:grid;place-items:center;font-size:10px;font-weight:800;color:#fff;background:' + C.col, String(i + 1));
        var tx = el('div', 'flex:1;min-width:0');
        tx.appendChild(el('div', 'font-size:11.5px;font-weight:600;color:#e8e8f5;white-space:nowrap;overflow:hidden;text-overflow:ellipsis', p.titulo));
        tx.appendChild(el('div', 'font-size:10px;color:#94a3b8',
          (p.cara === 'ambas' ? 'Ambas caras' : C.n) + ' · ' + rango + ' · ' +
          ((PARTICIONES.filter(function (z) { return z.id === self.part(p, caraF); })[0] || {}).n || '')));
        f.appendChild(pun); f.appendChild(tx);
        f.onclick = function () { self.iSel = i; self.refrescarPanel(); self.aplicarPaso(); };
        if (self.guia.pasos.length > 1) {
          var bx = el('button', 'background:transparent;border:0;color:#7c7c9e;cursor:pointer;font-size:14px;padding:0 2px;font-family:inherit', '×');
          bx.onclick = function (ev) {
            ev.stopPropagation();
            self.guia.pasos.splice(i, 1);
            self.iSel = Math.max(0, Math.min(self.iSel, self.guia.pasos.length - 1));
            self.refrescarPanel(); self.aplicarPaso();
          };
          f.appendChild(bx);
        }
        self.listaPasos.appendChild(f);
      });
      this.motorPanel();
      this.editorPaso();
      this.pintarGuardadas();
    }

    /* ─────────────── biblioteca de cortes ─────────────── */

    panelCortes() {
      var c = this.cCortes;
      if (!c || !window.EU_CORTES) return;
      var self = this, A = window.EU_CORTES;
      var fams = A.familias(), cabs = A.cabellos();
      if (!this.selFam) this.selFam = fams[0].id;
      var lista = A.lista(this.selFam);
      if (!lista.filter(function (q) { return q.id === self.selCorte; }).length) {
        this.selCorte = lista.length ? lista[0].id : '';
      }
      if (!this.selCabello) this.selCabello = cabs[1].id;

      c.textContent = '';
      c.appendChild(el('label', S.rot, 'Biblioteca de cortes'));

      var sel = function (opciones, valor, fn) {
        var s = el('select', S.inp + ';margin-bottom:6px');
        opciones.forEach(function (o) {
          var op = el('option', '', o.n);
          op.value = o.id;
          if (o.id === valor) op.selected = true;
          s.appendChild(op);
        });
        s.onchange = function () { fn(s.value); };
        c.appendChild(s);
        return s;
      };

      sel(fams, this.selFam, function (v) {
        self.selFam = v; self.selCorte = ''; self.panelCortes();
      });
      sel(lista, this.selCorte, function (v) { self.selCorte = v; self.panelCortes(); });
      sel(cabs, this.selCabello, function (v) { self.selCabello = v; self.panelCortes(); });

      var corte = lista.filter(function (q) { return q.id === self.selCorte; })[0];
      var regla = A.reglaDe(this.selCabello);
      if (corte) {
        c.appendChild(el('p', 'margin:2px 0 6px;font-size:10.5px;color:#94a3b8;line-height:1.55', corte.d));
      }
      c.appendChild(el('p', 'margin:0 0 8px;font-size:10.5px;line-height:1.55;color:#a5f3fc', '✂ ' + regla.aviso));
      if (corte && !A.encaja(this.selCorte, this.selCabello)) {
        c.appendChild(el('p', 'margin:0 0 8px;font-size:10.5px;line-height:1.55;color:#f0a0b8',
          '⚠ Este corte no es el recomendado para ' + regla.n.toLowerCase() + '. Se puede hacer, pero hay que compensar el peso.'));
      }

      var b = el('button', S.bt + ';width:100%;background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;border:0', '↧ Cargar en la guía');
      b.onclick = function () { self.cargarCorte(); };
      c.appendChild(b);
    }

    /* Cargar = sustituir la guía por la del catálogo. Cada paso del catálogo se
       monta ENCIMA de un paso nuevo, así hereda los interruptores de lámina que
       el catálogo no escribe (vista, goniómetro, dos cabezas…). */
    cargarCorte() {
      var A = window.EU_CORTES;
      if (!A || !this.selCorte) return;
      var g = A.guiaDe(this.selCorte, this.selCabello);
      if (!g) return;
      var pasos = g.pasos.map(function (q, i) {
        var base = nuevoPaso(i + 1);
        for (var k in q) if (q.hasOwnProperty(k)) base[k] = q[k];
        base.vista = (CARAS[base.cara] || CARAS.posterior).vista;
        return base;
      });
      this.guia = {
        nombre: g.nombre,
        autora: this.guia.autora || '',
        tecnica: g.tecnica,
        refs: g.refs,
        qr: this.guia.qr || '',
        foto: this.guia.foto || '',
        aviso: g.aviso,
        encaja: g.encaja,
        pasos: pasos
      };
      this.iSel = 0;
      this.inNombre.value = this.guia.nombre;
      this.inTecnica.value = this.guia.tecnica;
      this._claveHTML = '';
      this.aplicarFoto();
      this.refrescarPanel();
      this.aplicarPaso();
      this.aviso('Cargado: ' + g.nombre + '. ' + g.aviso);
    }

    /* La pila de elevaciones: el corazón del motor, zona por zona. */
    motorPanel() {
      var self = this, p = this.guia.pasos[this.iSel], c = this.cMotor;
      c.textContent = '';
      if (!p) return;
      c.appendChild(el('label', S.rot, 'Elevaciones por zona · el motor'));
      c.appendChild(el('p', 'margin:0 0 9px;font-size:10px;color:#7c7c9e;line-height:1.55',
        'Escribe el grado de cada zona, de la coronilla a la base. La cabeza dibuja el mechón en esa dirección al instante.'));

      var cab = el('div', 'display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-bottom:5px');
      ['frontal', 'posterior'].forEach(function (cara) {
        cab.appendChild(el('div', 'font-size:9px;font-weight:800;text-align:center;letter-spacing:.08em;color:' + CARAS[cara].col, CARAS[cara].n.toUpperCase()));
      });
      c.appendChild(cab);

      var rej = el('div', 'display:grid;grid-template-columns:1fr 1fr;gap:9px');
      ['frontal', 'posterior'].forEach(function (cara) {
        var col = el('div', 'display:flex;flex-direction:column;gap:3px');
        for (var zi = NZ - 1; zi >= 0; zi--) {
          col.appendChild(self.filaZona(p, cara, zi));
        }
        /* Cada motor con su propio relleno: delante y detrás no se cortan igual,
           así que rellenar una cara no puede tocar la otra. Y si la pila está
           entera a 0° se dice — ese es el estado que parecía «apagado». */
        var pilaC = self.pila(p, cara);
        var apagada = pilaC.every(function (g) { return !g; });
        var fr = el('div', 'display:flex;gap:3px;flex-wrap:wrap;margin-top:5px');
        [['0→90', function (i) { return Math.round(i * 15); }],
        ['0→180', function (i) { return Math.round(i * 30); }],
        ['90°', function () { return 90; }],
        ['0°', function () { return 0; }]].forEach(function (par) {
          var b = el('button', S.chipOff + ';padding:3px 7px;font-size:9px', par[0]);
          b.title = 'Rellenar sólo la cara ' + CARAS[cara].n.toLowerCase();
          b.onclick = function () {
            var pl = self.pila(p, cara);
            for (var i = 0; i < NZ; i++) pl[i] = par[1](i);
            self.refrescarPanel(); self.aplicarPaso(true);
          };
          fr.appendChild(b);
        });
        col.appendChild(fr);
        if (apagada) {
          col.appendChild(el('div', 'font-size:9px;color:#f0a0b8;margin-top:3px;line-height:1.4',
            'Motor apagado: todo a 0°. Pulsa 0→90 para encenderlo.'));
        }
        rej.appendChild(col);
      });
      c.appendChild(rej);

      var rap = el('div', 'display:flex;gap:4px;flex-wrap:wrap;margin-top:9px;align-items:center');
      rap.appendChild(el('span', 'font-size:9px;color:#7c7c9e;font-weight:700', 'LAS DOS CARAS'));
      var poner = function (txt, fn) {
        var b = el('button', S.chipOff + ';padding:4px 9px;font-size:10px', txt);
        b.onclick = function () {
          /* Este atajo es el de LAS DOS pilas a la vez, a diferencia de los de
             cada columna. */
          ['frontal', 'posterior'].forEach(function (cara) {
            var pila = self.pila(p, cara);
            for (var i = 0; i < NZ; i++) pila[i] = fn(i);
          });
          self.refrescarPanel(); self.aplicarPaso(true);
        };
        rap.appendChild(b);
      };
      poner('Todo 0°', function () { return 0; });
      poner('Todo 90°', function () { return 90; });
      poner('Rampa 0→90', function (i) { return Math.round(i * 15); });
      poner('Rampa 0→180', function (i) { return Math.round(i * 30); });
      c.appendChild(rap);
    }

    filaZona(p, cara, zi) {
      var self = this;
      var pila = this.pila(p, cara);
      var caraActiva = p.cara === 'ambas' || p.cara === cara;
      var sel = caraActiva && zi === this.zonaDe(p, cara);
      var f = el('div', 'display:flex;align-items:center;gap:4px;border-radius:6px;padding:3px 5px;' +
        (sel ? 'background:rgba(168,85,247,.16);border:1px solid #a855f7' : 'background:#0f0f22;border:1px solid #21213c') +
        (caraActiva ? '' : ';opacity:.62'));

      // la fila apagada sigue siendo editable; sólo dice que no es la cara en pantalla
      f.title = caraActiva ? NOMBRE_Z[cara][zi] : NOMBRE_Z[cara][zi] + ' — pulsa Z' + zi + ' para ver esta cara en la cabeza';

      var pt = el('span', 'width:9px;height:9px;flex:none;border-radius:50%;background:' + COL_Z[zi]);
      var lb = el('button', 'flex:none;width:22px;background:transparent;border:0;color:#94a3b8;font-size:9px;font-weight:800;cursor:pointer;font-family:inherit;padding:0', 'Z' + zi);
      lb.title = NOMBRE_Z[cara][zi];
      lb.onclick = function () {
        p.cara = cara;
        self.ponZona(p, cara, zi);
        p.vista = CARAS[cara].vista;
        self.refrescarPanel(); self.aplicarPaso();
      };

      var inp = el('input', 'width:44px;flex:none;background:#000;border:1px solid #2d2d4a;border-radius:4px;color:#fff;font-size:11px;font-family:inherit;text-align:center;padding:3px 2px;outline:none');
      inp.type = 'number'; inp.min = 0; inp.max = 180; inp.step = 1; inp.value = pila[zi];
      inp.onfocus = function () { inp.style.borderColor = COL_Z[zi]; };
      inp.onblur = function () { inp.style.borderColor = '#2d2d4a'; };
      /* Escribir un grado NO reconstruye el panel: hacerlo destruía el propio
         campo a mitad de teclear (se perdía el foco tras el primer dígito) y
         además reescribía la cara y la vista del paso, tirando el diagrama que
         la persona estaba mirando. Cambiar de cara o de zona es cosa del botón
         Zn, que es deliberado. */
      inp.oninput = function () {
        var g = Math.max(0, Math.min(180, parseInt(inp.value, 10) || 0));
        pila[zi] = g;
        eco.textContent = g + '°';
        self.aplicarPaso(true);
      };

      var eco = el('span', 'flex:1;text-align:right;font-size:10px;font-weight:800;color:' + COL_Z[zi], pila[zi] + '°');

      f.appendChild(pt); f.appendChild(lb); f.appendChild(inp); f.appendChild(eco);
      return f;
    }

    editorPaso() {
      var self = this, p = this.guia.pasos[this.iSel], c = this.cEdit;
      c.textContent = '';
      if (!p) return;
      c.appendChild(el('label', S.rot, 'Paso ' + (this.iSel + 1)));

      var inT = el('input', S.inp); inT.value = p.titulo; inT.placeholder = 'Título del paso';
      inT.oninput = function () { p.titulo = inT.value; self.refrescarPanel(); };
      c.appendChild(inT);

      c.appendChild(el('label', S.rot + ';margin-top:11px', 'Qué cara se trabaja'));
      var fc = el('div', 'display:flex;gap:5px;flex-wrap:wrap');
      [['frontal', 'Frontal'], ['posterior', 'Posterior'], ['ambas', 'Las dos']].forEach(function (par) {
        var b = el('button', (p.cara === par[0] ? S.chipOn : S.chipOff), par[1]);
        b.onclick = function () {
          p.cara = par[0];
          if (par[0] !== 'ambas') p.vista = CARAS[par[0]].vista;
          self.refrescarPanel(); self.aplicarPaso();
        };
        fc.appendChild(b);
      });
      c.appendChild(fc);

      /* De una a cuatro cabezas: la explicación completa de un paso — el mismo
         gesto visto desde todos los ángulos que hacen falta para copiarlo. */
      var nAct = this.nCabezas(p);
      var fCab = el('div', 'display:flex;gap:6px;flex-wrap:wrap;margin-top:7px');
      [[1, '1 cabeza'], [2, '2 cabezas'], [3, '3 cabezas'], [4, '4 cabezas']].forEach(function (par) {
        var b = el('button', (nAct === par[0] ? S.chipOn : S.chipOff) + ';flex:1', par[1]);
        b.title = par[0] === 1 ? 'Una sola cabeza, girable'
          : (VISTAS_PANEL[par[0]] || []).map(function (v) { return v.n; }).join(' · ');
        b.onclick = function () { self.ponerCabezas(par[0]); };
        fCab.appendChild(b);
      });
      c.appendChild(fCab);
      if (nAct > 1) {
        c.appendChild(el('div', 'font-size:10.5px;color:#7c7c9e;margin-top:5px;line-height:1.5',
          (VISTAS_PANEL[nAct] || []).map(function (v) { return v.n; }).join('  ·  ')));
      }

      /* Ejemplo real anclado al paso: la foto o el vídeo de la técnica. Va en la
         lámina, y por tanto en el PDF y en el vídeo, y viaja en el JSON. */
      c.appendChild(el('label', S.rot + ';margin-top:11px', 'Ejemplo de la técnica'));
      var fEj = el('div', 'display:flex;gap:5px;flex-wrap:wrap;align-items:center');
      var bEj = el('button', S.chipOff, '📎 Subir foto o vídeo');
      var inEj = el('input', 'display:none'); inEj.type = 'file'; inEj.accept = 'image/*,video/*';
      bEj.onclick = function () { inEj.click(); };
      inEj.onchange = function () {
        var f = inEj.files && inEj.files[0];
        inEj.value = '';
        if (f) self.ponerMedio(f);
      };
      fEj.appendChild(bEj); fEj.appendChild(inEj);
      if (p.medio && p.medio.src) {
        var nom = (p.medio.nombre || (p.medio.tipo === 'video' ? 'vídeo' : 'foto'));
        fEj.appendChild(el('span', 'font-size:10px;color:#94a3b8;max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap',
          (p.medio.tipo === 'video' ? '🎬 ' : '🖼️ ') + nom));
        var bQ = el('button', S.chipOff + ';padding:4px 8px;font-size:10px', '✕');
        bQ.title = 'Quitar el ejemplo de este paso';
        bQ.onclick = function () { p.medio = null; self.sincroMedio(); self.refrescarPanel(); };
        fEj.appendChild(bQ);
      }
      c.appendChild(fEj);

      /* Con las dos caras trabajando hay que decir cuál se lee en la ficha, la
         escala y los rótulos — y desde dónde mira la cámara. */
      if (p.cara === 'ambas') {
        c.appendChild(el('label', S.rot + ';margin-top:9px', 'Cara en primer plano'));
        var ff = el('div', 'display:flex;gap:5px;flex-wrap:wrap');
        [['posterior', 'Posterior'], ['frontal', 'Frontal']].forEach(function (par) {
          var b = el('button', (self.caraFoco(p) === par[0] ? S.chipOn : S.chipOff), par[1]);
          b.onclick = function () {
            p.foco = par[0];
            p.vista = CARAS[par[0]].vista;
            self.refrescarPanel(); self.aplicarPaso();
          };
          ff.appendChild(b);
        });
        c.appendChild(ff);
      }

      var caraZ = this.caraFoco(p);

      /* Cuando se trabajan las dos caras hay DOS particiones que elegir: la de
         atrás y la de delante. Antes sólo había una fila y cambiarla afectaba a
         las dos, que es lo que hacía saltar la trasera a horizontal. */
      var carasEdit = p.cara === 'ambas' ? ['posterior', 'frontal'] : [p.cara];
      c.appendChild(el('label', S.rot + ';margin-top:11px', 'Línea de partición'));
      carasEdit.forEach(function (ce) {
        if (carasEdit.length > 1) {
          c.appendChild(el('div', 'font-size:9px;font-weight:800;letter-spacing:.07em;margin:5px 0 4px;color:' + CARAS[ce].col, CARAS[ce].n.toUpperCase()));
        }
        var fp = el('div', 'display:flex;gap:5px;flex-wrap:wrap');
        PARTICIONES.forEach(function (pt) {
          var act = self.part(p, ce) === pt.id;
          var b = el('button', (act ? S.chipOn : S.chipOff), pt.n);
          b.title = pt.d;
          b.onclick = function () { self.ponPart(p, ce, pt.id); self.refrescarPanel(); self.aplicarPaso(true); };
          fp.appendChild(b);
        });
        c.appendChild(fp);
        var pdef = PARTICIONES.filter(function (z) { return z.id === self.part(p, ce); })[0];
        c.appendChild(el('div', 'font-size:10px;color:#7c7c9e;margin-top:5px;line-height:1.5', pdef ? pdef.d : ''));
      });

      c.appendChild(el('label', S.rot + ';margin-top:11px', 'Zona en primer plano · ' + CARAS[caraZ].n));
      var fz = el('div', 'display:flex;gap:4px;flex-wrap:wrap');
      for (var zi = NZ - 1; zi >= 0; zi--) {
        (function (z) {
          var b = el('button', (self.zonaDe(p, caraZ) === z ? S.chipOn : S.chipOff) + ';padding:5px 9px;font-size:10px', 'Z' + z);
          b.title = NOMBRE_Z[caraZ][z];
          b.onclick = function () { self.ponZona(p, caraZ, z); self.refrescarPanel(); self.aplicarPaso(true); };
          fz.appendChild(b);
        })(zi);
      }
      c.appendChild(fz);
      var zAct = this.zonaDe(p, caraZ);
      c.appendChild(el('div', 'font-size:10px;color:#7c7c9e;margin-top:5px', NOMBRE_Z[caraZ][zAct] + ' · ' + this.pila(p, caraZ)[zAct] + '°'));

      var fer = el('div', 'display:flex;gap:4px;flex-wrap:wrap;margin-top:7px');
      ELEV_RAPIDAS.forEach(function (g) {
        var b = el('button', S.chipOff + ';padding:4px 9px;font-size:10px', g + '°');
        b.onclick = function () {
          self.pila(p, caraZ)[self.zonaDe(p, caraZ)] = g;
          self.refrescarPanel(); self.aplicarPaso(true);
        };
        fer.appendChild(b);
      });
      c.appendChild(fer);

      c.appendChild(el('label', S.rot + ';margin-top:11px', 'Ficha técnica de la lámina'));
      var campo = function (clave, marca, opciones) {
        var w = el('div', 'margin-bottom:6px');
        if (opciones) {
          w.appendChild(el('div', 'font-size:9px;color:#7c7c9e;font-weight:800;margin-bottom:3px;letter-spacing:.06em', marca.toUpperCase()));
          var fo = el('div', 'display:flex;gap:4px;flex-wrap:wrap');
          opciones.forEach(function (o) {
            var b = el('button', (p[clave] === o ? S.chipOn : S.chipOff) + ';padding:4px 9px;font-size:10px', o);
            b.onclick = function () { p[clave] = o; self.refrescarPanel(); self.pintar2D(); };
            fo.appendChild(b);
          });
          w.appendChild(fo);
        } else {
          var i2 = el('input', S.inp + ';font-size:11.5px');
          i2.value = p[clave] || ''; i2.placeholder = marca;
          i2.oninput = function () { p[clave] = i2.value; self.pintar2D(); };
          w.appendChild(i2);
        }
        c.appendChild(w);
      };
      campo('tecnica', 'Técnica (desfilado lateral…)');
      campo('direccion', 'Dirección', ['Hacia el rostro', 'Hacia atrás', 'Natural', 'Al centro']);
      campo('tipoCorte', 'Tipo de corte', TIPOS_CORTE);
      campo('herramienta', 'Herramienta', HERRAMIENTAS);
      campo('resultado', 'Resultado (movimiento, ligereza…)');
      campo('observaciones', 'Observaciones');

      var bAb = el('button', ((p.abanico !== false) ? S.chipOn : S.chipOff) + ';margin-top:2px', '↗ Abanico de referencia');
      bAb.onclick = function () { p.abanico = p.abanico === false; self.refrescarPanel(); self.pintar2D(); };
      c.appendChild(bAb);

      var fmodo = el('div', 'display:flex;gap:5px;flex-wrap:wrap;margin-top:6px');
      var bLam = el('button', (p.laminaCompleta ? S.chipOn : S.chipOff), '☉ Lámina completa');
      bLam.title = 'Todas las zonas con su abanico de flechas, como una lámina de técnica';
      bLam.onclick = function () { p.laminaCompleta = !p.laminaCompleta; self.refrescarPanel(); self.aplicarPaso(true); };
      var bLim = el('button', ((p.limpia !== false) ? S.chipOn : S.chipOff), '◍ Lámina limpia');
      bLim.title = 'Sin abanico rotulado ni goniómetro: sólo geometría, flechas y números de elevación';
      bLim.onclick = function () { p.limpia = p.limpia === false; self.refrescarPanel(); self.pintar2D(); };
      var bGon = el('button', (p.goniometro ? S.chipOn : S.chipOff), '◔ Goniómetro');
      bGon.title = 'Arco graduado de 0° a 180° sobre el punto de partición';
      bGon.onclick = function () { p.goniometro = !p.goniometro; self.refrescarPanel(); self.pintar2D(); };
      fmodo.appendChild(bLim); fmodo.appendChild(bLam); fmodo.appendChild(bGon);
      c.appendChild(fmodo);

      c.appendChild(el('label', S.rot + ';margin-top:11px', 'Recomendación'));
      var ta = el('textarea', S.inp + ';min-height:64px;resize:vertical;line-height:1.5');
      ta.value = p.texto; ta.placeholder = 'Lo que hay que hacer y por qué. Se narra en el vídeo y sale en el PDF.';
      ta.oninput = function () { p.texto = ta.value; self.pintar2D(); };
      c.appendChild(ta);

      var fseg = el('div', 'display:flex;align-items:center;gap:8px;margin-top:9px');
      fseg.appendChild(el('span', 'font-size:11px;color:#94a3b8', 'Duración'));
      var rs = el('input', 'flex:1'); rs.type = 'range'; rs.min = 2; rs.max = 14; rs.step = 1; rs.value = p.seg;
      var lbl = el('span', 'font-size:11px;color:#e8e8f5;font-weight:600;width:32px;text-align:right', p.seg + 's');
      rs.oninput = function () { p.seg = +rs.value; lbl.textContent = p.seg + 's'; };
      fseg.appendChild(rs); fseg.appendChild(lbl);
      c.appendChild(fseg);
    }

    /* La cabeza no ha cargado: se avisa con un botón para reintentar, en vez de
       dejar el diagrama plano sin explicación. */
    sinTres() {
      var self = this;
      this.bucle();
      if (!this.txtEstado) return;
      this.txtEstado.textContent = '';
      this.txtEstado.appendChild(el('span', 'color:#f0a0b8',
        'La cabeza 3D no ha podido cargar (la red la está bloqueando o va muy lenta). Mientras tanto ves el diagrama plano, y el motor sigue entero: zonas, elevaciones, PDF y vídeo. '));
      var b = el('button', 'background:transparent;border:1px solid #a855f7;color:#e9d5ff;border-radius:8px;padding:4px 11px;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit;margin-left:4px', '↺ Reintentar');
      b.onclick = function () {
        self.aviso('Cargando la cabeza 3D…');
        cargarThree(true)
          .then(function (T) { self.escena(T); self.aviso('Cabeza 3D lista. Arrastra para girarla.'); })
          .catch(function () { self.sinTres(); });
      };
      this.txtEstado.appendChild(b);
    }

    aviso(t) { if (this.txtEstado) this.txtEstado.textContent = t; }

    /* ─────────────────────────── escena 3D ─────────────────────────── */

    escena(T) {
      this.T = T;
      var self = this;
      this.ESC = { y: 1.17, z: 1.05 };

      this.gl = document.createElement('canvas');
      this.gl.width = 1280; this.gl.height = 720;
      /* Fondo transparente: así la foto de la clienta puede ir DEBAJO de la
         cabeza y el diagrama queda en capas sobre el rostro real. */
      var ren = new T.WebGLRenderer({ canvas: this.gl, antialias: true, alpha: true });
      ren.setPixelRatio(1); ren.setSize(1280, 720, false);
      ren.setClearAlpha(0);
      this.ren = ren;

      var sc = new T.Scene();
      sc.background = null;
      this.sc = sc;
      this.camara = new T.PerspectiveCamera(38, 1280 / 720, 0.1, 100);

      sc.add(new T.HemisphereLight(0xffffff, 0xC8BEB2, 0.72));
      var l1 = new T.DirectionalLight(0xffffff, 0.48); l1.position.set(3, 4, 4); sc.add(l1);
      var l2 = new T.DirectionalLight(0xffffff, 0.16); l2.position.set(-4, 1, -3); sc.add(l2);

      var piel = new T.MeshStandardMaterial({ color: 0xDCD3C8, roughness: 0.92 });
      var g = new T.Group();
      sc.add(g);
      this.cabeza = g;

      var craneo = new T.Mesh(new T.SphereGeometry(1, 64, 48), piel);
      craneo.scale.set(1, this.ESC.y, this.ESC.z);
      g.add(craneo);

      var mand = new T.Mesh(new T.SphereGeometry(0.84, 48, 36), piel);
      mand.scale.set(0.94, 0.80, 1.02);
      mand.position.set(0, -0.72, 0.10);
      g.add(mand);

      var nariz = new T.Mesh(new T.ConeGeometry(0.115, 0.34, 20), piel);
      nariz.rotation.x = Math.PI / 2.1;
      nariz.position.set(0, -0.26, 1.12);
      g.add(nariz);

      [-1, 1].forEach(function (s) {
        var or = new T.Mesh(new T.SphereGeometry(0.17, 24, 18), piel);
        or.scale.set(0.42, 1, 0.72);
        or.position.set(s * 0.99, -0.20, 0.02);
        g.add(or);
      });

      /* Rostro: cada pieza se apoya SOBRE el elipsoide, resolviendo el punto de
         la superficie en esa dirección. Sin él no se sabe dónde está la cara ni
         de qué oreja a qué oreja va una partición. */
      var trazo = new T.MeshBasicMaterial({ color: 0x33291F });
      var enPiel = function (x, y, z, fuera) {
        var k = 1 / Math.sqrt(x * x + (y * y) / (self.ESC.y * self.ESC.y) + (z * z) / (self.ESC.z * self.ESC.z));
        var f = k * (fuera == null ? 1.005 : fuera);
        return new T.Vector3(x * f, y * f, z * f);
      };
      [-1, 1].forEach(function (s) {
        var ojo = new T.Mesh(new T.SphereGeometry(0.13, 20, 14), new T.MeshBasicMaterial({ color: 0xFBF7F2 }));
        ojo.scale.set(1, 0.60, 0.46);
        ojo.position.copy(enPiel(s * 0.30, -0.06, 0.90, 1.0));
        g.add(ojo);
        var iris = new T.Mesh(new T.SphereGeometry(0.058, 16, 12), trazo);
        iris.scale.set(1, 1, 0.55);
        iris.position.copy(enPiel(s * 0.30, -0.06, 0.90, 1.055));
        g.add(iris);
        var cej = new T.Mesh(new T.BoxGeometry(0.30, 0.042, 0.042), trazo);
        cej.position.copy(enPiel(s * 0.31, 0.13, 0.88, 1.03));
        cej.rotation.z = -s * 0.17;
        g.add(cej);
      });
      var boca = new T.Mesh(new T.SphereGeometry(0.17, 24, 14), new T.MeshBasicMaterial({ color: 0xB0525C }));
      boca.scale.set(1, 0.30, 0.32);
      boca.position.copy(enPiel(0, -0.56, 0.86, 1.02));
      g.add(boca);
      var com = new T.Mesh(new T.BoxGeometry(0.32, 0.022, 0.024), new T.MeshBasicMaterial({ color: 0x7A3A42 }));
      com.position.copy(enPiel(0, -0.56, 0.86, 1.075));
      g.add(com);

      var cuello = new T.Mesh(new T.CylinderGeometry(0.44, 0.52, 0.95, 32), piel);
      cuello.position.set(0, -1.62, 0.02);
      g.add(cuello);
      var peana = new T.Mesh(new T.CylinderGeometry(0.78, 0.92, 0.16, 40),
        new T.MeshStandardMaterial({ color: 0xC2B8AB, roughness: 0.6 }));
      peana.position.set(0, -2.16, 0);
      g.add(peana);

      /* Referencias de replanteo, cada una un arco sobre el cráneo. */
      this.refs = {};
      var arco = function (fn, color, guiones) {
        var pts = [];
        for (var q = 0; q <= 60; q++) pts.push(fn(q / 60));
        var mat = guiones
          ? new T.LineDashedMaterial({ color: color, dashSize: 0.085, gapSize: 0.055, transparent: true, opacity: 0 })
          : new T.LineBasicMaterial({ color: color, transparent: true, opacity: 0 });
        var l = new T.Line(new T.BufferGeometry().setFromPoints(pts), mat);
        if (guiones) l.computeLineDistances();
        g.add(l);
        return l;
      };
      // oreja a oreja, por la coronilla
      this.refs.orejas = arco(function (u) { return self.punto(IZQ + Math.PI * u, 1.5708, 1.028); }, 0x1F3D6B, false);
      // línea media, frente a nuca
      this.refs.media = arco(function (u) { return self.punto(CARA, -Math.PI + 2 * Math.PI * u, 1.028); }, 0x1F3D6B, false);
      // cresta parietal: el aro donde la cabeza cambia de plano
      this.refs.cresta = arco(function (u) { return self.punto(-Math.PI + 2 * Math.PI * u, 0.62, 1.028); }, 0x8A1C6B, true);
      // diagonales de trabajo
      this.refs.diagonal = arco(function (u) { return self.punto(CARA - 1.2 + 2.4 * u, 0.45 + 1.1 * u, 1.028); }, 0x0E8A62, true);
      this.refs.diagonal2 = arco(function (u) { return self.punto(CARA + 1.2 - 2.4 * u, 0.45 + 1.1 * u, 1.028); }, 0x0E8A62, true);

      /* Trazos del motor: se rehacen en cada cálculo. */
      this.grupoMotor = new T.Group();
      g.add(this.grupoMotor);

      this.pintarRefs();
      this.aplicarPaso();
      this.aviso('Arrastra para girar la cabeza. La rueda acerca. Cambia un grado del motor y el mechón se mueve.');
    }

    pintarRefs() {
      if (!this.refs) return;
      var r = this.guia.refs || {};
      var set = function (l, on) { if (l) l.material.opacity = on ? 0.85 : 0; };
      set(this.refs.orejas, r.orejas);
      set(this.refs.media, r.media);
      set(this.refs.cresta, r.cresta);
      set(this.refs.diagonal, r.diagonal);
      set(this.refs.diagonal2, r.diagonal);
    }

    /* Rehace los trazos del motor: partición, mechones y línea guía por zona. */
    aplicarPaso(sinMoverCamara) {
      if (!this.T || !this.grupoMotor) return;
      var p = this.guia.pasos[this.iSel];
      if (!p) return;
      var T = this.T, gm = this.grupoMotor;

      while (gm.children.length) {
        var c = gm.children.pop();
        if (c.geometry) c.geometry.dispose();
        if (c.material) c.material.dispose();
      }

      var calc = this.calcular(p);
      this.calc = calc;

      calc.zonas.forEach(function (z) {
        /* Los trazos del motor NO se dibujan aquí: las líneas del render 3D son
         de un píxel y no admiten grosor, así que a plena luz no se veían. Se
         pintan en el lienzo 2D (ver trazos2D), donde llevan grosor real y
         halo blanco. Aquí sólo queda el cálculo. */
      });

      this.encuadrar(calc);
      this.sincroMedio();
      this.sincroCabezas();
      /* Con dos o más cabezas la cámara no obedece a p.vista: cada panel tiene
         la suya y lo que guarda this.cam es el giro compartido del arrastre. */
      if (!sinMoverCamara && this.nCabezas(p) === 1) {
        var v = VISTAS.filter(function (x) { return x.id === p.vista; })[0];
        if (v) this.irVista(v, true);
      }
      this.pintar2D();
    }

    /* La anatomía manda el encuadre; las puntas de los mechones sólo pueden
       pedir que la cámara se retire lo justo para entrar en el fotograma. */
    encuadrar(calc) {
      if (!this.T) return;
      var tan19 = Math.tan(38 * Math.PI / 360);
      var tanBanda = tan19 * ((566 - 128) / 720);
      var tanH = tan19 * (1280 / 720) * 0.88;

      var aMin = -1.35, aMax = 1.20, aLat = 1.12;
      this.mira = (aMin + aMax) / 2;
      var mi = this.mira;

      var r = Math.max(Math.abs(aMax - mi), Math.abs(aMin - mi)) / tanBanda + 1.0;
      r = Math.max(r, aLat / tanH + 1.2);

      var lista = [];
      (calc && calc.zonas || []).forEach(function (z) {
        for (var i = 0; i < z.puntas.length; i++) lista.push(z.puntas[i]);
      });
      for (var i = 0; i < lista.length; i++) {
        var dy = Math.abs(lista[i].y - mi) + 0.08;
        var dl = Math.sqrt(lista[i].x * lista[i].x + lista[i].z * lista[i].z) + 0.08;
        r = Math.max(r, dy / tan19 + 1.0, dl / tanH + 1.05);
      }
      this.rMin = Math.max(3.2, Math.min(12, r));
      this.cam.r = this.rMin;
    }

    irVista(v, suave) {
      var p = this.guia.pasos[this.iSel];
      if (p) p.vista = v.id;
      if (suave) this.destino = { a: v.a, e: v.e };
      else { this.cam.a = v.a; this.cam.e = v.e; this.destino = null; }
    }

    raton() {
      var self = this, arr = null;
      this.cv.addEventListener('pointerdown', function (e) {
        arr = { x: e.clientX, y: e.clientY, a: self.cam.a, e: self.cam.e };
        self.destino = null;
        self.cv.setPointerCapture(e.pointerId);
        self.cv.style.cursor = 'grabbing';
      });
      this.cv.addEventListener('pointermove', function (e) {
        if (!arr) return;
        var k = self.cv.clientWidth || 900;
        self.cam.a = arr.a - (e.clientX - arr.x) / k * 3.2;
        self.cam.e = Math.max(-1.15, Math.min(1.35, arr.e + (e.clientY - arr.y) / k * 2.6));
      });
      this.cv.addEventListener('pointerup', function () { arr = null; self.cv.style.cursor = 'grab'; });
      this.cv.addEventListener('wheel', function (e) {
        e.preventDefault();
        self.cam.r = Math.max(self.rMin || 3.2, Math.min(11, self.cam.r + (e.deltaY > 0 ? 0.35 : -0.35)));
      }, { passive: false });
    }

    bucle() {
      this.vivo = true;
      var self = this;
      var paso = function () {
        if (!self.vivo) return;
        if (self.destino) {
          var d = self.destino, k = 0.10;
          var dif = ((d.a - self.cam.a + Math.PI) % (Math.PI * 2)) - Math.PI;
          self.cam.a += dif * k;
          self.cam.e += (d.e - self.cam.e) * k;
          if (Math.abs(dif) < 0.005 && Math.abs(d.e - self.cam.e) < 0.005) self.destino = null;
        }
        /* Un fallo al dibujar NO puede matar el bucle: si la excepción escapa,
           el siguiente fotograma nunca se programa y la cabeza queda congelada
           con todos los botones aparentemente muertos. Se avisa una vez y se
           sigue girando. */
        try { self.render3D(); self.pintar2D(); }
        catch (err) {
          if (!self._avisado) { self._avisado = true; console.error('Guías 3D · dibujo', err); }
        }
        self._raf = requestAnimationFrame(paso);
      };
      paso();
    }

    render3D() {
      if (!this.ren || !this.T) return;
      var c = this.cam, my = this.mira == null ? -0.08 : this.mira;
      this.camara.position.set(
        c.r * Math.cos(c.e) * Math.sin(c.a),
        my + c.r * Math.sin(c.e),
        c.r * Math.cos(c.e) * Math.cos(c.a)
      );
      this.camara.lookAt(0, my, 0);
      this.ren.render(this.sc, this.camara);
    }

    /* ─────────────────── lienzo 2D: rótulos y numeración ─────────────────── */

    /* Maquetación de la columna de paneles, resuelta UNA vez por fotograma.

       Los dos paneles comparten altura de fila, y el cuerpo se despeja de lo
       que de verdad consumen: 14 renglones (7 zonas + 7 filas de ficha) más los
       marcos, dentro de la banda útil. Así la ficha cabe POR CONSTRUCCIÓN justo
       debajo de la escala y no hace falta ningún ajuste posterior que la suba
       encima — que era lo que las solapaba. */
    metricas(W, H) {
      var K = Math.max(1, Math.min(2.2, 1280 / Math.max(240, this.cv.clientWidth || 1280)));
      var y0 = 150, tope = H - 130;
      var disp = tope - y0 - 56;                  // menos los dos marcos
      // 14 filas de (cuerpo + 9) tienen que caber en disp
      var cuerpo = Math.max(12, Math.min(Math.round(15 * K), Math.floor(disp / 14) - 9));
      var fila = cuerpo + 9;
      // el panel no puede comerse el sitio de las chapas de numeración
      var anc = Math.round(Math.min(W * 0.26, 214 * K));
      var ancF = Math.round(Math.min(W * 0.26, 268 * K));
      var etq = Math.max(10, Math.round(cuerpo * 0.74));
      return {
        K: K, anc: anc, ancF: ancF, y0: y0, tope: tope,
        x0: W - anc - 36, x0F: W - ancF - 36,
        cuerpo: cuerpo, etq: etq, fila: fila,
        reserva: Math.max(anc, ancF) + 56
      };
    }

    /* El lienzo mide 1280 pero se muestra reducido — en un móvil a un tercio.
       Un rótulo de 13px de lienzo acaba en 5px reales y no se lee. fs() sube el
       cuerpo lo que haga falta para que en PANTALLA nunca baje de 12px. */
    fs(px, minCSS) {
      var K = Math.max(1, Math.min(2.2, 1280 / Math.max(240, this.cv.clientWidth || 1280)));
      return Math.round(Math.max(px, (minCSS || 12) * K * 0.85));
    }

    /* La foto de la clienta como capa de fondo, encuadrada en la mitad libre
       del lienzo (la derecha la ocupan los rótulos) y con un velo claro: sin él
       las particiones se pierden sobre el pelo oscuro. */
    fotoFondo(x, W, H) {
      var im = this._foto;
      if (!im || !im.width) return;
      /* A pantalla completa la foto tapaba el diagrama entero: es la referencia,
         no el fondo. En modo de dos cabezas se dibuja como tarjeta, igual que el
         ejemplo, y aquí no se pinta nada. */
      if ((this.guia.pasos[this.iSel] || {}).dos) return;
      var util = W - (this.M ? this.M.reserva : 330);
      var k = Math.max(util / im.width, H / im.height);
      var w = im.width * k, h = im.height * k;
      x.save();
      x.beginPath(); x.rect(0, 0, util, H); x.clip();
      x.drawImage(im, (util - w) / 2, (H - h) / 2, w, h);
      x.fillStyle = 'rgba(242,238,231,.44)'; x.fillRect(0, 0, util, H);
      x.restore();
    }

    aplicarFoto() {
      var src = this.guia.foto || '';
      if (!src) { this._foto = null; this._fotoSrc = ''; this.pintar2D(); return; }
      if (this._fotoSrc === src) return;
      var self = this;
      var im = new Image();
      im.onload = function () { self._foto = im; self.pintar2D(); };
      im.onerror = function () { self._foto = null; };
      im.src = src;
      this._fotoSrc = src;
    }

    /* DOS CABEZAS, una por cara: la de la izquierda mira de frente y lleva el
       motor frontal; la de la derecha es la nuca y lleva el posterior. Es como
       se explica un corte de verdad — delante no se corta como detrás — y evita
       tener que girar una sola cabeza para entender el paso.

       Se rinde la MISMA escena dos veces con la cámara en dos sitios, y los
       trazos vectoriales se dibujan con una transformación que mete el lienzo
       virtual completo dentro de cada mitad: así trazos2D sigue proyectando en
       coordenadas de 1280×720 sin saber nada de esto. */
    panelDoble(x, W, H, p) {
      if (!this.calc) return;
      var self = this;
      /* El margen de M.reserva es para la escala y la ficha incrustadas, que
         sólo se dibujan al exportar. En pantalla esos datos viven en el panel
         HTML de debajo, así que reservar ese ancho dejaba un tercio del lienzo
         en blanco y encogía las dos cabezas sin motivo. */
      /* La tarjeta del ejemplo se queda en su columna a la derecha y las cabezas
         le ceden ancho, con un canalón de aire entre medias: así no tapa ni el
         diagrama ni los rótulos. */
      var cajaM = this.medioCaja(W, H);
      var util = W - (this.exportando ? this.M.reserva : 22) -
        (cajaM ? cajaM.w + 34 : 0);
      var hueco = 14, m = 10;
      /* De dos a cuatro cabezas. Con dos y con tres van en una fila; con cuatro,
         en rejilla de dos por dos, que es como se maqueta la lámina de taller.
         Cada panel tiene su cara y su vista: así el mismo paso se ve de frente,
         de perfil y por detrás sin que la alumna gire nada. */
      var lados = (VISTAS_PANEL[this.nCabezas(p)] || VISTAS_PANEL[2]).map(function (v) {
        return { cara: v.cara, vista: v.vista, n: v.n };
      });
      var cols = lados.length >= 4 ? 2 : lados.length;
      var filas = Math.ceil(lados.length / cols);
      var pw = (util - hueco * (cols - 1) - m * 2) / cols;
      var py = this.exportando ? 132 : 104;
      var altoTotal = H - py - (this.exportando ? 152 : 96);
      var vHueco = filas > 1 ? 46 : 0;
      var ph = (altoTotal - vHueco * (filas - 1)) / filas;
      lados.forEach(function (P, i) {
        P.x = m + (i % cols) * (pw + hueco);
        P.y = py + Math.floor(i / cols) * (ph + vHueco);
      });
      var cam0 = { a: this.cam.a, e: this.cam.e };
      var todas = this.calc.zonas;

      var rotulo = function (P) {
        var C = CARAS[P.cara];
        var pn = (PARTICIONES.filter(function (q) { return q.id === self.part(p, P.cara); })[0] || {}).n || '';
        var zi = self.zonaDe(p, P.cara);
        x.save();
        x.textAlign = 'left';
        x.fillStyle = C.col;
        x.font = '800 ' + self.fs(filas > 1 ? 17 : 21, 14) + 'px system-ui, sans-serif';
        x.fillText(C.n.toUpperCase() + '  ·  ' + P.n.toUpperCase(), P.x + 6, P.y - 26);
        x.fillStyle = 'rgba(60,60,80,.85)';
        x.font = '600 ' + self.fs(filas > 1 ? 13 : 16, 11) + 'px system-ui, sans-serif';
        x.fillText('Z' + zi + ' ' + NOMBRE_Z[P.cara][zi] + '  ·  ' +
          self.pila(p, P.cara)[zi] + '°  ·  ' + pn, P.x + 6, P.y - 6);
        x.restore();
      };

      /* Sin Three.js el diagrama es el maniquí dibujado a mano. Antes el panel
         doble exigía Three.js, y como la cabeza se está pintando en 2D el modo
         de dos cabezas no se veía nunca. */
      if (!this.T) {
        lados.forEach(function (P) {
          x.save();
          x.beginPath(); x.rect(P.x, P.y, pw, ph); x.clip();
          x.translate(P.x + pw / 2 - W / 2, P.y + ph / 2 - H * 0.46);
          /* El maniquí plano se extiende hasta 1.32R bajo el centro y el mechón
             a 90° sale ~1.95R de lado, más la chapa del número: se ajusta a eso,
             no a una fracción inventada del lienzo. */
          var esc = Math.min(pw / (W * 2.30), ph / (H * 2.60));
          self.diagramaPlano(x, W, H, p, {
            cara: P.cara, vista: P.vista, cx: W / 2,
            esc: Math.max(0.06, Math.min(esc, 0.34))
          });
          x.restore();
          rotulo(P);
        });
        return;
      }

      lados.forEach(function (P) {
        var base = VISTAS.filter(function (v) { return v.id === P.vista; })[0] || { a: 0, e: 0.05 };
        self.cam.a = base.a + cam0.a;
        self.cam.e = Math.max(-0.9, Math.min(1.25, base.e + cam0.e));
        self.render3D();

        var mias = todas.filter(function (z) { return z.cara === P.cara; });

        /* La escala sale de MEDIR lo que hay dibujado, no de suponer qué
           fracción del fotograma ocupa. Con fracciones fijas los mechónes a
           90-180° se salían del recorte y las flechas y sus chapas quedaban
           cortadas arriba y abajo. */
        var caja = self.cajaContenido(mias, W, H);
        var s = Math.min((pw - 8) / caja.w, (ph - 8) / caja.h);
        s = Math.max(0.10, Math.min(s, 1.6));

        x.save();
        x.beginPath(); x.rect(P.x, P.y, pw, ph); x.clip();
        x.translate(P.x + pw / 2, P.y + ph / 2);
        x.scale(s, s);
        x.translate(-caja.cx, -caja.cy);
        if (self.gl) {
          x.save();
          if (self._foto) x.globalAlpha = 0.46;
          x.drawImage(self.gl, 0, 0, W, H);
          x.restore();
        }
        self.calc.zonas = mias;
        self.trazos2D(x, W, H);
        self.calc.zonas = todas;
        self.numerosPanel(x, W, H, mias, s);
        x.restore();
        rotulo(P);
      });

      this.cam.a = cam0.a; this.cam.e = cam0.e;
    }

    /* Caja que ocupa de verdad el diagrama de estas zonas en el fotograma:
       partículas proyectadas de cada mechón, su raíz y su chapa de número. Sin
       esto el ajuste era una suposición y recortaba el contenido. */
    cajaContenido(zonas, W, H) {
      var self = this;
      var x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9, n = 0;
      var meter = function (v, pad) {
        if (!v) return;
        var s = v.clone().project(self.camara);
        if (s.z > 1) return;
        var px = (s.x + 1) / 2 * W, py2 = (1 - s.y) / 2 * H;
        pad = pad || 0;
        x0 = Math.min(x0, px - pad); x1 = Math.max(x1, px + pad);
        y0 = Math.min(y0, py2 - pad); y1 = Math.max(y1, py2 + pad);
        n++;
      };
      (zonas || []).forEach(function (z) {
        (z.segs || []).forEach(function (v) { meter(v, 6); });
        (z.puntas || []).forEach(function (v) { meter(v, 10); });
        (z.raya || []).forEach(function (v) { meter(v, 6); });
        // la chapa del número cuelga bajo el centro y es lo primero que se corta
        meter(z.centro, z.sel ? 44 : 30);
        meter(z.ancla, 10);
      });

      /* La cabeza también se dibuja: el cráneo, el cuello y los hombros salen
         bastante más abajo que cualquier punto de zona, así que midiendo sólo
         las zonas la malla quedaba cortada por el recorte. Se mide la caja de
         la propia malla proyectando sus ocho esquinas. */
      if (this.cabeza && this.T) {
        var caja3 = new this.T.Box3().setFromObject(this.cabeza);
        if (!caja3.isEmpty()) {
          [caja3.min.x, caja3.max.x].forEach(function (ax) {
            [caja3.min.y, caja3.max.y].forEach(function (ay) {
              [caja3.min.z, caja3.max.z].forEach(function (az) {
                meter(new self.T.Vector3(ax, ay, az), 4);
              });
            });
          });
        }
      }
      if (n < 2 || !(x1 > x0) || !(y1 > y0)) return { cx: W / 2, cy: H / 2, w: W, h: H };
      return { cx: (x0 + x1) / 2, cy: (y0 + y1) / 2, w: x1 - x0, h: y1 - y0 };
    }

    /* Numeración dentro de un panel: la chapa va junto a la punta de su mechón,
       sin la maquetación de márgenes de la lámina de una sola cabeza (aquí no
       hay márgenes que repartir). Compensa la escala del panel para que el
       número salga del mismo tamaño en las dos mitades. */
    numerosPanel(x, W, H, zonas, s) {
      if (!this.camara) return;
      var self = this, usados = [];
      var k = 1 / Math.max(0.2, s);
      zonas.slice().sort(function (a, b) { return (b.sel ? 1 : 0) - (a.sel ? 1 : 0); }).forEach(function (z) {
        var ref = z.centro || z.ancla;
        if (!ref) return;
        var v = ref.clone().project(self.camara);
        if (v.z > 1) return;
        var cx = (v.x + 1) / 2 * W, cy = (1 - v.y) / 2 * H;
        var R = (z.sel ? 30 : 21) * k;
        for (var i = 0; i < usados.length; i++) {
          if (Math.hypot(cx - usados[i].x, cy - usados[i].y) < R + usados[i].r + 4 * k) return;
        }
        usados.push({ x: cx, y: cy, r: R });
        x.save();
        x.beginPath(); x.arc(cx, cy, R, 0, Math.PI * 2);
        x.fillStyle = 'rgba(255,255,255,.97)'; x.fill();
        x.lineWidth = (z.sel ? 3.4 : 2.2) * k; x.strokeStyle = z.col; x.stroke();
        x.textAlign = 'center';
        x.fillStyle = '#1B1B24';
        x.font = '800 ' + Math.round((z.sel ? 19 : 14) * k) + 'px system-ui, sans-serif';
        x.fillText(z.grados + '°', cx, cy + (z.sel ? -1 : 1) * k);
        x.fillStyle = z.col;
        x.font = '700 ' + Math.round((z.sel ? 11 : 9) * k) + 'px system-ui, sans-serif';
        x.fillText('Z' + z.zi, cx, cy + R * 0.58);
        x.restore();
      });
    }

    /* Cuántas cabezas maqueta este paso: 1 (una sola, el modo normal) o de 2 a 4
       en panel. Sale de p.nCab; p.dos se conserva para las guías ya guardadas. */
    nCabezas(p) {
      if (!p) return 1;
      var n = p.nCab || (p.dos ? 2 : 1);
      return Math.max(1, Math.min(4, n));
    }

    /* Fija el número de cabezas. Un solo sitio para las dos entradas — la barra
       del visor y el panel del paso — y así no se desincronizan. */
    ponerCabezas(n) {
      var p = this.guia.pasos[this.iSel];
      if (!p) return;
      p.nCab = Math.max(1, Math.min(4, n));
      p.dos = p.nCab > 1;
      if (p.dos) {
        p.cara = 'ambas';
        // this.cam pasa a ser el giro COMPARTIDO de todas las cabezas
        this.cam.a = 0; this.cam.e = 0.12; this.destino = null;
        var d = (VISTAS_PANEL[p.nCab] || []).map(function (v) { return v.n.toLowerCase(); }).join(', ');
        this.aviso(p.nCab + ' cabezas: ' + d + '. Arrastra para inclinarlas todas a la vez.');
      }
      this.sincroCabezas();
      this.refrescarPanel();
      this.aplicarPaso(true);
    }

    sincroCabezas() {
      var n = this.nCabezas(this.guia.pasos[this.iSel]);
      (this.btnCab || []).forEach(function (b) {
        b.style.cssText = (b._n === n ? S.chipOn : S.chipOff);
      });
    }

    alternarDos() {
      this.ponerCabezas(this.nCabezas(this.guia.pasos[this.iSel]) > 1 ? 1 : 2);
    }

    /* Ejemplo del paso: foto o vídeo de la técnica, anclado al paso y por tanto
       a la guía — sale en la lámina, en el PDF, en el vídeo y en el JSON. */
    ponerMedio(file) {
      var self = this, p = this.guia.pasos[this.iSel];
      if (!p || !file) return;
      var tipo = /^video/.test(file.type || '') ? 'video' : 'img';
      var lec = new FileReader();
      lec.onload = function () {
        p.medio = { tipo: tipo, src: lec.result, nombre: file.name || '' };
        if (String(lec.result).length > 2600000) {
          self.aviso('El ejemplo pesa bastante: se ve en la lámina y viaja en la descarga, pero puede no caber en el guardado del dispositivo.');
        }
        self.sincroMedio();
        self.refrescarPanel();
      };
      lec.readAsDataURL(file);
    }

    sincroMedio() {
      var p = this.guia.pasos[this.iSel], m = p && p.medio;
      if (!m || !m.src) {
        this._medio = null; this._medioSrc = '';
        this.pintar2D();
        return;
      }
      if (this._medioSrc === m.src) return;
      this._medioSrc = m.src;
      var self = this;
      if (m.tipo === 'video') {
        var v = document.createElement('video');
        v.muted = true; v.loop = true; v.playsInline = true; v.preload = 'auto';
        v.oncanplay = function () { v.play().catch(function () { }); };
        v.src = m.src;
        this._medio = { tipo: 'video', el: v };
      } else {
        var im = new Image();
        im.onload = function () { self.pintar2D(); };
        im.src = m.src;
        this._medio = { tipo: 'img', el: im };
      }
    }

    /* La tarjeta del ejemplo va a la ESQUINA superior derecha del área útil, por
       encima de la banda de las cabezas y con aire alrededor: pegada a ellas
       competía con el diagrama, que es lo que hay que leer. */
    medioCaja(W, H) {
      if (!this._medio || !this.M) return null;
      var w = Math.round(Math.min(268, W * 0.21)), h = Math.round(w * 0.66);
      var der = this.exportando ? this.M.reserva : 22;
      return { x: W - der - w, y: 150, w: w, h: h };
    }

    /* El QR en la esquina inferior derecha del área útil, sobre su tarjeta
       blanca con rótulo: la alumna lo escanea y se lleva la guía al móvil. */
    sincroQR() {
      var t = (this.guia.qr || '').trim();
      if (t === this._qrTexto) return;
      this._qrTexto = t;
      this.qrImg = null;
      if (!t || !window.QRCode) { this.pintar2D(); return; }
      var self = this;
      if (!this._qrCaja) {
        this._qrCaja = document.createElement('div');
        this._qrCaja.style.cssText = 'position:absolute;left:-9999px;top:0';
        document.body.appendChild(this._qrCaja);
      }
      this._qrCaja.textContent = '';
      try {
        new window.QRCode(this._qrCaja, {
          text: t, width: 420, height: 420,
          colorDark: '#1B1B24', colorLight: '#ffffff',
          correctLevel: window.QRCode.CorrectLevel.H
        });
      } catch (e) { return; }
      setTimeout(function () { self.recogerQR(); }, 60);
    }

    /* qrcodejs pinta en un CANVAS y sólo rellena su &lt;img&gt; en algunos caminos: al
       coger la img primero salía una tarjeta blanca con el código en blanco. Se
       acepta la img sólo si tiene píxeles de verdad. */
    recogerQR() {
      var b = this._qrCaja;
      if (!b) return;
      var im = b.querySelector('img');
      if (im && !im.naturalWidth) {
        var self = this;
        im.onload = function () { self.qrImg = im.naturalWidth ? im : b.querySelector('canvas'); self.pintar2D(); };
        im = null;
      }
      this.qrImg = im || b.querySelector('canvas') || null;
      this.pintar2D();
    }

    /* El logo del negocio, el mismo que se sube en la ficha del estudio. */
    dibujarLogo(x, W, H) {
      var L = window.EU_LOGO;
      if (!L || !L.img || !(L.img.naturalWidth || L.img.width)) return;
      var anc = W * ((L.tam || 9) / 100);
      var alt = anc * ((L.img.naturalHeight || L.img.height) / (L.img.naturalWidth || L.img.width));
      var M = Math.round(W * 0.028);
      var px = W - M - anc, py = M;
      if (L.pos === 'ti') { px = M; py = M; }
      else if (L.pos === 'pc') { px = (W - anc) / 2; py = H - M - alt; }
      else if (L.pos === 'pd') { px = W - M - anc; py = H - M - alt; }
      x.save();
      x.shadowColor = 'rgba(0,0,0,.45)'; x.shadowBlur = anc * 0.12;
      x.drawImage(L.img, px, py, anc, alt);
      x.restore();
    }

    dibujarQR(x, W, H) {
      var im = this.qrImg;
      if (!im || !this.M) return;
      var lado = Math.round(Math.min(150, W * 0.115));
      var der = this.exportando ? this.M.reserva : 26;
      var pad = 11;
      var bx = W - der - lado - pad * 2;
      var by = H - (this.exportando ? 40 : 26) - lado - pad * 2 - 20;
      x.save();
      x.fillStyle = 'rgba(255,255,255,.96)';
      this.redondo(x, bx, by, lado + pad * 2, lado + pad * 2 + 20, 12); x.fill();
      x.strokeStyle = 'rgba(27,27,36,.16)'; x.lineWidth = 1.5; x.stroke();
      try { x.drawImage(im, bx + pad, by + pad, lado, lado); } catch (e) { }
      x.textAlign = 'center';
      x.fillStyle = '#5B5B72';
      x.font = '800 ' + this.fs(13, 10) + 'px system-ui, sans-serif';
      x.fillText('ESCANEA LA GUÍA', bx + pad + lado / 2, by + pad + lado + 15);
      x.restore();
    }

    dibujarEjemplo(x, W, H) {
      var m = this._medio, r = this.medioCaja(W, H);
      if (!m || !r) return;
      var e = m.el;
      var iw = m.tipo === 'video' ? e.videoWidth : e.naturalWidth;
      var ih = m.tipo === 'video' ? e.videoHeight : e.naturalHeight;
      x.save();
      x.fillStyle = 'rgba(255,255,255,.97)';
      this.redondo(x, r.x, r.y, r.w, r.h + 30, 14); x.fill();
      x.strokeStyle = 'rgba(27,27,36,.16)'; x.lineWidth = 1.5; x.stroke();
      if (iw && ih) {
        var k = Math.max((r.w - 16) / iw, (r.h - 16) / ih);
        x.save();
        x.beginPath(); this.redondo(x, r.x + 8, r.y + 8, r.w - 16, r.h - 16, 9); x.clip();
        x.drawImage(e, r.x + 8 + (r.w - 16 - iw * k) / 2, r.y + 8 + (r.h - 16 - ih * k) / 2, iw * k, ih * k);
        x.restore();
      }
      x.fillStyle = 'rgba(27,27,36,.72)';
      x.textAlign = 'left';
      x.font = '800 ' + this.fs(14, 11) + 'px system-ui, sans-serif';
      x.fillText(m.tipo === 'video' ? 'VÍDEO DE EJEMPLO' : 'FOTO DE EJEMPLO', r.x + 11, r.y + r.h + 21);
      x.restore();
    }

    pintar2D() {
      if (!this.cv) return;
      var x = this.cv.getContext('2d'), W = this.cv.width, H = this.cv.height;
      this.M = this.metricas(W, H);
      var p = this.guia.pasos[this.iSel];
      if (!p) return;
      var lim = p.limpia !== false;
      var dos = !!p.dos;
      x.fillStyle = '#F2EEE7'; x.fillRect(0, 0, W, H);
      this.fotoFondo(x, W, H);
      if (dos) {
        this.panelDoble(x, W, H, p);
      } else {
        if (this.gl && this.T) {
          x.save();
          // con foto debajo, la cabeza se vuelve translúcida y no la tapa
          if (this._foto) x.globalAlpha = 0.46;
          x.drawImage(this.gl, 0, 0, W, H);
          x.restore();
        }
        if (!this.T) this.diagramaPlano(x, W, H, p);
        else { this.trazos2D(x, W, H); this.numeracion(x, W, H, p); }
      }

      /* La cara que se lee sale de caraFoco, nunca de un valor fijo: con «Las
         dos» y el foco en frontal, el panel y la escala seguían clavados en
         posterior y el motor frontal no llegaba a la lámina. */
      var caraZ = this.caraFoco(p);
      var C = CARAS[caraZ] || CARAS.frontal;

      // cabecera
      x.save();
      var g = x.createLinearGradient(0, 0, 0, 120);
      g.addColorStop(0, 'rgba(242,238,231,.95)'); g.addColorStop(1, 'rgba(242,238,231,0)');
      x.fillStyle = g; x.fillRect(0, 0, W, 120);
      x.fillStyle = '#1B1B24'; x.font = '800 34px system-ui, sans-serif'; x.textAlign = 'left';
      x.fillText(this.guia.nombre || 'Guía', 40, 52);
      x.fillStyle = '#7C3AED'; x.font = '600 19px system-ui, sans-serif';
      var sub = [this.guia.tecnica, this.guia.autora].filter(Boolean).join(' · ');
      if (sub) x.fillText(sub, 40, 81);
      x.textAlign = 'right';
      x.fillStyle = 'rgba(27,27,36,.75)'; x.font = '600 19px system-ui, sans-serif';
      x.fillText(p.titulo || '', W - 40, 52);
      x.fillStyle = 'rgba(90,90,110,.85)'; x.font = '600 16px system-ui, sans-serif';
      x.fillText((this.iSel + 1) + ' de ' + this.guia.pasos.length, W - 40, 78);
      x.restore();

      this.avisoTextura(x, W, H);

      // chapa del paso
      x.save();
      x.fillStyle = 'rgba(124,58,237,.94)';
      this.redondo(x, 40, H - 168, 148, 46, 23); x.fill();
      x.fillStyle = '#fff'; x.font = '800 20px system-ui, sans-serif'; x.textAlign = 'center';
      x.fillText('PASO ' + (this.iSel + 1), 114, H - 138);
      x.restore();

      // cara · partición · zona en primer plano
      x.save();
      x.textAlign = 'left';
      x.fillStyle = C.col; x.font = '800 26px system-ui, sans-serif';
      // se resuelve fuera del callback: dentro, `this` ya no es el componente
      var pn = (PARTICIONES.filter(function (z) { return z.id === this.part(p, caraZ); }, this)[0] || {}).n || '';
      x.fillText((p.cara === 'ambas' ? 'Ambas caras · ' + C.n : C.n) + '  ·  ' + pn, 204, H - 137);
      x.fillStyle = 'rgba(60,60,80,.9)'; x.font = '600 ' + this.fs(17, 14) + 'px system-ui, sans-serif';
      var zF = this.zonaDe(p, caraZ);
      x.fillText('Z' + zF + ' ' + NOMBRE_Z[caraZ][zF] + '  ·  ' + this.pila(p, caraZ)[zF] + '°', 206, H - 114);
      x.restore();

      /* Los paneles de datos sólo se pintan DENTRO del lienzo cuando se exporta.
         En pantalla el lienzo se muestra a menos de la mitad, y catorce
         renglones de texto ahí dentro no pueden ser legibles a la vez que caben
         — así que en pantalla van como HTML debajo del visor, donde un píxel es
         un píxel de verdad. El vídeo y el PDF sí los llevan incrustados. */
      if (this.exportando) {
        this.escala(x, W, H, p, caraZ);
        this.ficha(x, W, H, p);
      } else {
        this._finEscala = this.M.y0;
        this.panelHTML(p, caraZ);
      }

      var z0 = this.calc && this.calc.zonas.filter(function (q) { return q.sel; })[0];
      if (z0 && this.T && !dos) {
        if (p.goniometro && !lim) this.goniometro(x, W, H, z0);
        if (!lim) this.abanico(x, W, H, z0, p);
        this.tijera(x, W, H, z0, p);
        this.flechaMaestra(x, W, H, z0, p);
      }

      this.dibujarEjemplo(x, W, H);
      this.dibujarQR(x, W, H);
      this.dibujarLogo(x, W, H);

      if (p.texto) {
        x.save();
        var lin = this.partir(x, p.texto, W - 320, '600 21px system-ui, sans-serif', 3);
        var alto = lin.length * 30 + 24;
        x.fillStyle = 'rgba(255,255,255,.93)';
        this.redondo(x, 40, H - 96, W - 320, alto, 14); x.fill();
        x.strokeStyle = 'rgba(27,27,36,.14)'; x.lineWidth = 1.5; x.stroke();
        x.fillStyle = '#2B2B36'; x.textAlign = 'left';
        x.font = '600 21px system-ui, sans-serif';
        for (var i = 0; i < lin.length; i++) x.fillText(lin[i], 62, H - 96 + 32 + i * 30);
        x.restore();
      }
    }

    /* El aviso del cabello sobre la lámina: la regla del filo es lo primero que
       hay que leer, así que va bajo la cabecera y no enterrada en la ficha. */
    avisoTextura(x, W, H) {
      var t = (this.guia.aviso || '').trim();
      if (!t) return;
      var mal = this.guia.encaja === false;
      var anc = Math.min(W * 0.52, 640);
      var cuerpo = this.fs(15, 12);
      x.save();
      x.font = '600 ' + cuerpo + 'px system-ui, sans-serif';
      var lin = this.partir(x, '✂ ' + t, anc - 34, '600 ' + cuerpo + 'px system-ui, sans-serif', 2);
      var paso = Math.round(cuerpo * 1.4);
      var alto = lin.length * paso + 16;
      x.fillStyle = mal ? 'rgba(255,238,242,.95)' : 'rgba(255,255,255,.92)';
      this.redondo(x, 40, 96, anc, alto, 10); x.fill();
      x.strokeStyle = mal ? 'rgba(176,30,69,.45)' : 'rgba(24,144,106,.42)';
      x.lineWidth = 1.6; x.stroke();
      x.fillStyle = mal ? '#8E1234' : '#14614A';
      x.textAlign = 'left';
      for (var i = 0; i < lin.length; i++) x.fillText(lin[i], 56, 96 + 12 + cuerpo * 0.82 + i * paso);
      x.restore();
    }

    /* La pila de elevaciones dibujada en el fotograma: se lee el escalonado de
       un vistazo, igual que en el motor. */
    /* Escala y ficha en HTML, debajo del visor: aquí la letra se lee. */
    panelHTML(p, cara) {
      if (!this.datos) return;
      var pila = this.pila(p, cara), zAct = this.zonaDe(p, cara);
      var clave = cara + '|' + pila.join(',') + '|' + zAct + '|' + p.tecnica + '|' + p.direccion +
        '|' + p.tipoCorte + '|' + p.herramienta + '|' + p.resultado + '|' + p.observaciones +
        '|' + this.part(p, cara) + '|' + this.guia.tecnica;
      if (this._claveHTML === clave) return;
      this._claveHTML = clave;
      var self = this;
      this.datos.textContent = '';

      var esc = el('div', 'background:#18183a;border:1px solid #2d2d4a;border-radius:12px;padding:11px 13px;flex:1 1 260px;min-width:0');
      esc.appendChild(el('div', 'font-size:10px;font-weight:800;letter-spacing:.07em;margin-bottom:7px;color:' + CARAS[cara].col,
        'ELEVACIÓN · ' + CARAS[cara].n.toUpperCase()));
      for (var k = 0; k < NZ; k++) {
        var zi = NZ - 1 - k, sel = zi === zAct;
        var f = el('div', 'display:flex;align-items:center;gap:8px;padding:3px 5px;border-radius:6px;' +
          (sel ? 'background:rgba(168,85,247,.15)' : ''));
        f.appendChild(el('span', 'width:8px;height:8px;flex:none;border-radius:50%;background:' + COL_Z[zi]));
        f.appendChild(el('span', 'font-size:12px;font-weight:' + (sel ? '800' : '600') + ';color:#cbd5e1;width:22px;flex:none', 'Z' + zi));
        var barra = el('div', 'flex:1;height:9px;border-radius:5px;background:#0f0f22;overflow:hidden;min-width:30px');
        barra.appendChild(el('div', 'height:100%;border-radius:5px;background:' + COL_Z[zi] + ';width:' + Math.max(4, pila[zi] / 180 * 100) + '%'));
        f.appendChild(barra);
        f.appendChild(el('span', 'font-size:12.5px;font-weight:800;width:38px;text-align:right;flex:none;color:' + COL_Z[zi], pila[zi] + '°'));
        esc.appendChild(f);
      }

      var fic = el('div', 'background:#18183a;border:1px solid #2d2d4a;border-radius:12px;padding:11px 13px;flex:1 1 260px;min-width:0');
      fic.appendChild(el('div', 'font-size:10px;font-weight:800;letter-spacing:.07em;margin-bottom:7px;color:#a855f7', 'FICHA TÉCNICA'));
      var pn = (PARTICIONES.filter(function (z) { return z.id === self.part(p, cara); })[0] || {}).n || '—';
      [['Técnica', p.tecnica || this.guia.tecnica || '—'],
      ['Elevación', pila[zAct] + '° · ' + NOMBRE_Z[cara][zAct]],
      ['Partición', pn],
      ['Dirección', p.direccion || '—'],
      ['Tipo de corte', p.tipoCorte || '—'],
      ['Herramienta', p.herramienta || '—'],
      ['Resultado', p.resultado || '—']].concat(p.observaciones ? [['Observaciones', p.observaciones]] : [])
        .forEach(function (r) {
          var f2 = el('div', 'display:flex;gap:10px;align-items:baseline;padding:2.5px 0');
          f2.appendChild(el('span', 'font-size:10.5px;color:#7c7c9e;font-weight:700;flex:none;width:92px', r[0]));
          f2.appendChild(el('span', 'font-size:12.5px;color:#e8e8f5;font-weight:600;flex:1;min-width:0;word-break:break-word', String(r[1])));
          fic.appendChild(f2);
        });

      this.datos.appendChild(esc);
      this.datos.appendChild(fic);
    }

    /* La escala, incrustada en el lienzo. Sólo al exportar. */
    escala(x, W, H, p, cara) {
      var M = this.M, pila = this.pila(p, cara);
      var anc = M.anc, x0 = M.x0, y0 = M.y0, alto = M.fila;
      x.save();
      x.fillStyle = 'rgba(255,255,255,.90)';
      this.redondo(x, x0 - 12, y0 - M.cuerpo - 16, anc + 24, NZ * alto + M.cuerpo + 30, 12); x.fill();
      x.strokeStyle = 'rgba(27,27,36,.13)'; x.lineWidth = 1.5; x.stroke();

      x.textAlign = 'left';
      x.fillStyle = CARAS[cara].col; x.font = '800 ' + M.etq + 'px system-ui, sans-serif';
      x.fillText('ELEVACIÓN · ' + CARAS[cara].n.toUpperCase(), x0, y0 - 10);

      for (var k = 0; k < NZ; k++) {
        var zi = NZ - 1 - k;
        var y = y0 + k * alto;
        var mid = y + alto * 0.5;
        var sel = zi === this.zonaDe(p, cara);
        if (sel) {
          x.fillStyle = 'rgba(124,58,237,.13)';
          this.redondo(x, x0 - 6, y, anc + 12, alto - 2, 6); x.fill();
        }
        x.textAlign = 'left';
        x.fillStyle = COL_Z[zi];
        x.beginPath(); x.arc(x0 + 6, mid, 5, 0, Math.PI * 2); x.fill();
        x.fillStyle = 'rgba(60,60,80,.95)'; x.font = (sel ? '800' : '600') + ' ' + M.cuerpo + 'px system-ui, sans-serif';
        x.fillText('Z' + zi, x0 + 18, mid + M.cuerpo * 0.36);
        var bx = x0 + 24 + M.cuerpo * 1.7, bw = anc - (24 + M.cuerpo * 1.7) - M.cuerpo * 2.6;
        x.fillStyle = 'rgba(27,27,36,.10)';
        this.redondo(x, bx, mid - 5, bw, 10, 5); x.fill();
        x.fillStyle = COL_Z[zi];
        this.redondo(x, bx, mid - 5, Math.max(3, bw * (pila[zi] / 180)), 10, 5); x.fill();
        x.textAlign = 'right';
        x.fillStyle = COL_Z[zi]; x.font = '800 ' + M.cuerpo + 'px system-ui, sans-serif';
        x.fillText(pila[zi] + '°', x0 + anc, mid + M.cuerpo * 0.36);
      }
      x.restore();
      this._finEscala = y0 + NZ * alto + 30;
    }

    /* Numeración de las elevaciones. Dos criterios que la mantienen legible:

       · Sólo se rotula lo que aporta: la zona en primer plano y cada zona cuyo
         grado CAMBIA respecto a la de arriba. En un corte sólido (todo 0°) sale
         una chapa, no siete iguales.
       · Si la chapa cae sobre la cabeza — y de frente, con partición
         horizontal, todas las puntas se proyectan en la misma x, justo sobre el
         rostro — se manda al margen libre de la izquierda con su tirador, nunca
         hacia abajo por la cara. */
    numeracion(x, W, H, p) {
      if (!this.calc || !this.camara) return;
      var self = this;

      // silueta de la cabeza en pantalla, para no escribir encima
      var caja = null;
      var muestras = [];
      for (var q = 0; q < 12; q++) {
        var a = q / 12 * Math.PI * 2;
        muestras.push(new this.T.Vector3(Math.cos(a) * 1.05, 0, Math.sin(a) * 1.05));
      }
      muestras.push(new this.T.Vector3(0, 1.22, 0));
      muestras.push(new this.T.Vector3(0, -1.45, 0));
      muestras.forEach(function (v) {
        var s = v.clone().project(self.camara);
        var sx = (s.x + 1) / 2 * W, sy = (1 - s.y) / 2 * H;
        if (!caja) caja = { x0: sx, x1: sx, y0: sy, y1: sy };
        caja.x0 = Math.min(caja.x0, sx); caja.x1 = Math.max(caja.x1, sx);
        caja.y0 = Math.min(caja.y0, sy); caja.y1 = Math.max(caja.y1, sy);
      });

      // qué zonas merecen chapa
      var porCara = {};
      this.calc.zonas.forEach(function (z) {
        (porCara[z.cara] = porCara[z.cara] || []).push(z);
      });
      var rotular = [];
      Object.keys(porCara).forEach(function (cara) {
        var lista = porCara[cara].slice().sort(function (a, b) { return b.zi - a.zi; });
        var previo = null;
        lista.forEach(function (z) {
          if (z.sel || previo === null || z.grados !== previo) rotular.push(z);
          previo = z.grados;
        });
      });
      // la seleccionada primero: se lleva el mejor hueco
      rotular.sort(function (a, b) { return (b.sel ? 1 : 0) - (a.sel ? 1 : 0); });

      var usados = [];
      var BANDA0 = 128, BANDA1 = 548;   // techo y suelo duros: debajo va la chapa del paso
      var libre = function (cx, cy, R) {
        if (cy - R < BANDA0 || cy + R > BANDA1) return false;
        if (cx - R < 8 || cx + R > W - (self.M ? self.M.reserva : 330)) return false;
        /* La cabeza también es un obstáculo AQUÍ, no sólo en la comprobación
           inicial: con chapas grandes una columna «de margen» vuelve a caer
           sobre el cráneo, y así no puede construirse esa posición. */
        if (caja && cx + R > caja.x0 - 6 && cx - R < caja.x1 + 6 &&
          cy + R > caja.y0 - 6 && cy - R < caja.y1 + 6) return false;
        for (var i = 0; i < usados.length; i++) {
          if (Math.hypot(cx - usados[i].x, cy - usados[i].y) < R + usados[i].r + 8) return false;
        }
        return true;
      };

      /* Columnas de los márgenes, de dentro hacia fuera. Se separan según el
         tamaño de la chapa, no 66px fijos, o dos chapas grandes se pisan. */
      var bx0 = caja ? caja.x0 : W * 0.38, bx1 = caja ? caja.x1 : W * 0.62;
      var columnas = function (R) {
        var out = [], paso = R * 2 + 12, k, v;
        for (k = 0; k < 4; k++) {
          v = bx0 - R - 14 - k * paso;
          if (v - R > 8) out.push(v);
        }
        for (k = 0; k < 4; k++) {
          v = bx1 + R + 14 + k * paso;
          if (v + R < W - (self.M ? self.M.reserva : 330)) out.push(v);
        }
        return out;
      };

      var buscarHueco = function (R) {
        var cols = columnas(R);
        for (var c = 0; c < cols.length; c++) {
          for (var y = BANDA0 + R; y <= BANDA1 - R; y += R + 10) {
            if (libre(cols[c], y, R)) return { x: cols[c], y: y };
          }
        }
        return null;
      };

      rotular.forEach(function (z) {
        if (!z.centro) return;
        var v = z.centro.clone().project(self.camara);
        if (v.z > 1) return;
        var px = (v.x + 1) / 2 * W, py = (1 - v.y) / 2 * H;
        // chapas más contenidas: legibles sin tapar el cráneo
        var R = z.sel ? Math.max(34, self.fs(22, 17) * 1.35) : Math.max(22, self.fs(14, 11) * 1.35);
        var cx = px, cy = py;

        var sobreCabeza = caja &&
          cx + R > caja.x0 - 6 && cx - R < caja.x1 + 6 &&
          cy + R > caja.y0 - 6 && cy - R < caja.y1 + 6;

        if (sobreCabeza || !libre(cx, cy, R)) {
          var h = buscarHueco(R);
          if (!h) return;
          cx = h.x; cy = h.y;
        }
        usados.push({ x: cx, y: cy, r: R });

        x.save();
        if (Math.abs(cx - px) > 3 || Math.abs(cy - py) > 3) {
          var suave = (self.guia.pasos[self.iSel] || {}).limpia !== false && !z.sel;
          x.strokeStyle = suave ? 'rgba(27,27,36,.22)' : 'rgba(27,27,36,.45)';
          x.lineWidth = suave ? 1.1 : 1.6;
          x.setLineDash([5, 4]);
          x.beginPath(); x.moveTo(px, py); x.lineTo(cx, cy); x.stroke();
          x.setLineDash([]);
          x.fillStyle = z.col;
          x.beginPath(); x.arc(px, py, 3.5, 0, Math.PI * 2); x.fill();
        }
        x.beginPath(); x.arc(cx, cy, R, 0, Math.PI * 2);
        x.fillStyle = 'rgba(255,255,255,.97)'; x.fill();
        x.lineWidth = z.sel ? 4 : 2.5; x.strokeStyle = z.col; x.stroke();
        x.textAlign = 'center';
        x.fillStyle = '#1B1B24';
        x.font = '800 ' + (z.sel ? self.fs(22, 17) : self.fs(14, 11)) + 'px system-ui, sans-serif';
        x.fillText(z.grados + '°', cx, cy + (z.sel ? -1 : 1));
        x.fillStyle = z.col;
        x.font = '700 ' + (z.sel ? self.fs(13, 11) : self.fs(9, 9)) + 'px system-ui, sans-serif';
        x.fillText('Z' + z.zi, cx, cy + R * 0.55);
        x.restore();
      });
    }

    /* Reserva sin 3D: el diagrama sigue diciendo zona, ángulo y partición. */
    diagramaPlano(x, W, H, p, op) {
      /* El maniquí dibujado a mano, sin depender de la red. Antes esto era una
         elipse con rayas y por eso parecía que la cabeza había desaparecido: la
         3D sólo es la versión girable de ESTE mismo diagrama. Se dibuja de
         perfil o de frente según la vista del paso, con su rostro, y de cada
         zona sale su mechón al ángulo real del motor. */
      var self = this;
      op = op || {};
      var cara = op.cara || this.caraFoco(p);
      var vista = op.vista || p.vista;
      var pila = this.pila(p, cara);
      var zAct = this.zonaDe(p, cara);
      var perfil = vista === 'perfilD' || vista === 'perfilI' || vista === 'diag';
      var mirarIzq = vista === 'perfilI';

      var cx = (op.cx != null ? op.cx : W * 0.40), cy = H * 0.46;
      var R = Math.min(W, H) * (op.esc || 0.30);
      var RX = R * (perfil ? 0.84 : 0.80);     // semiancho

      x.save();
      x.translate(cx, cy);
      if (mirarIzq) x.scale(-1, 1);

      var piel = '#DCD3C8', tinta = '#33291F';

      // cuello y hombros
      x.fillStyle = '#CFC5B8';
      x.beginPath();
      x.moveTo(-RX * 0.42, R * 0.72);
      x.lineTo(-RX * 0.40, R * 1.32);
      x.lineTo(RX * 0.40, R * 1.32);
      x.lineTo(RX * 0.42, R * 0.72);
      x.closePath(); x.fill();

      // cráneo
      x.fillStyle = piel;
      x.strokeStyle = 'rgba(51,41,31,.55)'; x.lineWidth = 2.5;
      x.beginPath();
      if (perfil) {
        // perfil: frente, nariz, labios, barbilla y occipital
        x.moveTo(RX * 0.20, -R);
        x.bezierCurveTo(RX * 0.86, -R * 0.90, RX * 1.02, -R * 0.34, RX * 0.94, -R * 0.02);
        x.lineTo(RX * 1.16, R * 0.16);          // nariz
        x.lineTo(RX * 0.90, R * 0.24);
        x.bezierCurveTo(RX * 0.98, R * 0.34, RX * 0.86, R * 0.40, RX * 0.84, R * 0.46);
        x.bezierCurveTo(RX * 0.92, R * 0.62, RX * 0.60, R * 0.86, RX * 0.16, R * 0.86);
        x.bezierCurveTo(-RX * 0.52, R * 0.84, -RX * 1.00, R * 0.40, -RX * 1.00, -R * 0.10);
        x.bezierCurveTo(-RX * 1.00, -R * 0.68, -RX * 0.44, -R, RX * 0.20, -R);
      } else {
        // de frente: óvalo con mandíbula
        x.moveTo(0, -R);
        x.bezierCurveTo(RX * 1.06, -R * 0.96, RX * 1.06, R * 0.10, RX * 0.80, R * 0.46);
        x.bezierCurveTo(RX * 0.56, R * 0.86, RX * 0.24, R * 0.98, 0, R * 0.98);
        x.bezierCurveTo(-RX * 0.24, R * 0.98, -RX * 0.56, R * 0.86, -RX * 0.80, R * 0.46);
        x.bezierCurveTo(-RX * 1.06, R * 0.10, -RX * 1.06, -R * 0.96, 0, -R);
      }
      x.closePath(); x.fill(); x.stroke();

      // rostro
      x.fillStyle = tinta;
      if (perfil) {
        x.beginPath(); x.ellipse(RX * 0.62, -R * 0.10, R * 0.045, R * 0.032, 0, 0, Math.PI * 2); x.fill();
        x.strokeStyle = tinta; x.lineWidth = 3;
        x.beginPath(); x.moveTo(RX * 0.46, -R * 0.22); x.lineTo(RX * 0.78, -R * 0.19); x.stroke();
        x.lineWidth = 2.5;
        x.beginPath(); x.moveTo(RX * 0.74, R * 0.40); x.lineTo(RX * 0.92, R * 0.40); x.stroke();
        // oreja
        x.strokeStyle = 'rgba(51,41,31,.7)'; x.lineWidth = 2.5;
        x.beginPath(); x.ellipse(RX * 0.02, R * 0.06, R * 0.10, R * 0.15, 0, 0, Math.PI * 2); x.stroke();
      } else {
        [-1, 1].forEach(function (s) {
          x.fillStyle = '#FBF7F2';
          x.beginPath(); x.ellipse(s * RX * 0.36, -R * 0.06, R * 0.11, R * 0.062, 0, 0, Math.PI * 2); x.fill();
          x.fillStyle = tinta;
          x.beginPath(); x.arc(s * RX * 0.36, -R * 0.06, R * 0.038, 0, Math.PI * 2); x.fill();
          x.strokeStyle = tinta; x.lineWidth = 3.2;
          x.beginPath();
          x.moveTo(s * RX * 0.20, -R * 0.22); x.lineTo(s * RX * 0.52, -R * 0.19);
          x.stroke();
          // orejas
          x.strokeStyle = 'rgba(51,41,31,.6)'; x.lineWidth = 2.5;
          x.beginPath(); x.ellipse(s * RX * 0.95, R * 0.02, R * 0.055, R * 0.13, 0, 0, Math.PI * 2); x.stroke();
        });
        x.strokeStyle = tinta; x.lineWidth = 2.6;
        x.beginPath(); x.moveTo(0, -R * 0.02); x.lineTo(-R * 0.05, R * 0.22); x.lineTo(R * 0.04, R * 0.24); x.stroke();
        x.fillStyle = '#B0525C';
        x.beginPath(); x.ellipse(0, R * 0.46, R * 0.12, R * 0.045, 0, 0, Math.PI * 2); x.fill();
      }

      // referencias de replanteo
      var refs = this.guia.refs || {};
      x.strokeStyle = '#1F3D6B'; x.lineWidth = 2; x.setLineDash([7, 5]);
      if (refs.orejas) {
        x.beginPath();
        if (perfil) { x.moveTo(RX * 0.02, R * 0.06); x.lineTo(RX * 0.02, -R * 1.02); }
        else { x.moveTo(-RX * 0.97, R * 0.02); x.bezierCurveTo(-RX * 0.6, -R * 1.05, RX * 0.6, -R * 1.05, RX * 0.97, R * 0.02); }
        x.stroke();
      }
      if (refs.media) {
        x.beginPath();
        if (perfil) { x.moveTo(-RX * 0.98, -R * 0.10); x.bezierCurveTo(-RX * 0.5, -R * 1.06, RX * 0.4, -R * 1.02, RX * 0.86, -R * 0.20); }
        else { x.moveTo(0, -R * 1.02); x.lineTo(0, R * 0.20); }
        x.stroke();
      }
      x.setLineDash([]);

      /* Las zonas: cada una su línea de partición sobre el cráneo y, la
         seleccionada, su mechón con flecha al ángulo del motor. */
      var borde = function (t) {
        // punto del contorno a la altura t (0 arriba, 1 abajo), lado derecho
        var yy = -R + t * 2 * R;
        var k = Math.max(0, 1 - Math.pow(yy / R, 2));
        return { x: RX * Math.sqrt(k) * (perfil ? 0.98 : 1), y: yy };
      };

      for (var k2 = 0; k2 < NZ; k2++) {
        var zi = NZ - 1 - k2;                       // Z6 arriba … Z0 abajo
        var t = 0.06 + (k2 / (NZ - 1)) * 0.80;
        var b = borde(t);
        var sel = zi === zAct;

        x.strokeStyle = COL_Z[zi];
        x.lineWidth = sel ? 4.5 : 2.4;
        x.globalAlpha = sel ? 1 : 0.55;
        x.beginPath(); x.moveTo(-b.x, b.y); x.lineTo(b.x, b.y); x.stroke();

        if (!sel) { x.globalAlpha = 1; continue; }

        // mechón: 0° cuelga, 90° perpendicular al cráneo, 180° al lado opuesto
        var g = pila[zi];
        var nx = 1, ny = b.y / R * 0.6;              // normal aproximada
        var nl = Math.hypot(nx, ny); nx /= nl; ny /= nl;
        var tx = 0, ty = 1;                          // caída
        var ang = g * Math.PI / 180;
        var dx = tx * Math.cos(ang) + nx * Math.sin(ang);
        var dy = ty * Math.cos(ang) + ny * Math.sin(ang);
        var dl = Math.hypot(dx, dy); dx /= dl; dy /= dl;
        var L = R * 0.95;
        var fx = b.x + dx * L, fy = b.y + dy * L;

        // banda del mechón
        x.globalAlpha = 0.16; x.fillStyle = COL_Z[zi];
        x.beginPath();
        x.moveTo(-b.x * 0.15, b.y); x.lineTo(b.x, b.y);
        x.lineTo(fx, fy); x.lineTo(-b.x * 0.15 + dx * L, b.y + dy * L);
        x.closePath(); x.fill();

        x.globalAlpha = 1;
        x.strokeStyle = COL_Z[zi]; x.lineWidth = 5; x.lineCap = 'round';
        x.beginPath(); x.moveTo(b.x, b.y); x.lineTo(fx, fy); x.stroke();
        // punta de flecha
        var ux = dx, uy = dy, tt = 15;
        x.fillStyle = COL_Z[zi];
        x.beginPath();
        x.moveTo(fx, fy);
        x.lineTo(fx - ux * tt - uy * tt * 0.5, fy - uy * tt + ux * tt * 0.5);
        x.lineTo(fx - ux * tt + uy * tt * 0.5, fy - uy * tt - ux * tt * 0.5);
        x.closePath(); x.fill();

        // el número, siempre derecho aunque la vista esté espejada
        x.save();
        if (mirarIzq) { x.translate(fx, fy); x.scale(-1, 1); x.translate(-fx, -fy); }
        var RCh = Math.max(30, self.fs(21, 18) * 1.5);
        x.beginPath(); x.arc(fx, fy + RCh + 4, RCh, 0, Math.PI * 2);
        x.fillStyle = 'rgba(255,255,255,.97)'; x.fill();
        x.lineWidth = 4; x.strokeStyle = COL_Z[zi]; x.stroke();
        x.textAlign = 'center';
        x.fillStyle = '#1B1B24'; x.font = '800 ' + self.fs(21, 18) + 'px system-ui, sans-serif';
        x.fillText(g + '°', fx, fy + RCh + 2);
        x.fillStyle = COL_Z[zi]; x.font = '700 ' + self.fs(12, 11) + 'px system-ui, sans-serif';
        x.fillText('Z' + zi, fx, fy + RCh + 4 + RCh * 0.55);
        x.restore();
      }
      x.globalAlpha = 1;
      x.restore();
    }

    /* Los trazos del motor, pintados sobre el render con grosor real y halo
       blanco: es lo que los hace legibles a plena luz en un móvil. Cada punto
       se comprueba contra la cámara, así que lo que está al otro lado del
       cráneo no se cuela por delante. */
    trazos2D(x, W, H) {
      if (!this.calc || !this.camara) return;
      var self = this, T = this.T, cam = this.camara.position;
      var EY = this.ESC.y * this.ESC.y, EZ = this.ESC.z * this.ESC.z;

      var pantalla = function (v) {
        var s = v.clone().project(self.camara);
        return { x: (s.x + 1) / 2 * W, y: (1 - s.y) / 2 * H, fuera: s.z > 1 };
      };
      var deFrente = function (v) {
        var n = new T.Vector3(v.x, v.y / EY, v.z / EZ).normalize();
        return n.dot(cam.clone().sub(v)) > -0.02;
      };
      var trazar = function (pts, col, grosor, alfa, guiones) {
        if (pts.length < 2) return;
        var traza = function (ancho, color) {
          x.lineWidth = ancho; x.strokeStyle = color;
          x.lineCap = 'round'; x.lineJoin = 'round';
          x.beginPath();
          var mover = true;
          for (var i = 0; i < pts.length; i++) {
            if (!pts[i]) { mover = true; continue; }
            if (mover) { x.moveTo(pts[i].x, pts[i].y); mover = false; }
            else x.lineTo(pts[i].x, pts[i].y);
          }
          x.stroke();
        };
        x.save();
        x.globalAlpha = alfa;
        if (guiones) x.setLineDash([9, 6]);
        traza(grosor + 4.5, 'rgba(255,255,255,.92)');   // halo, para separar del cráneo
        traza(grosor, col);
        x.setLineDash([]);
        x.restore();
      };

      /* Punta de flecha al final del mechón: es lo que convierte una raya en
         una dirección legible, y apunta justo a donde va su numeración. */
      var flecha = function (sa, sb, col, grosor, alfa) {
        var dx = sb.x - sa.x, dy = sb.y - sa.y;
        var L = Math.hypot(dx, dy);
        if (L < 14) return;
        var ux = dx / L, uy = dy / L;
        var t = 7 + grosor * 2.1;
        var px = -uy, py = ux;
        var p1 = { x: sb.x - ux * t + px * t * 0.55, y: sb.y - uy * t + py * t * 0.55 };
        var p2 = { x: sb.x - ux * t - px * t * 0.55, y: sb.y - uy * t - py * t * 0.55 };
        x.save();
        x.globalAlpha = alfa;
        [['rgba(255,255,255,.92)', 4.5], [col, 0]].forEach(function (par) {
          x.beginPath();
          x.moveTo(sb.x + ux * par[1] * 0.5, sb.y + uy * par[1] * 0.5);
          x.lineTo(p1.x, p1.y); x.lineTo(p2.x, p2.y);
          x.closePath();
          x.lineWidth = par[1]; x.lineJoin = 'round';
          x.fillStyle = par[0]; x.strokeStyle = par[0];
          if (par[1]) x.stroke();
          x.fill();
        });
        x.restore();
      };

      // primero las zonas de fondo, la seleccionada al final
      var zonas = this.calc.zonas.slice().sort(function (a, b) { return (a.sel ? 1 : 0) - (b.sel ? 1 : 0); });

      /* En lámina limpia las particiones y las flechas engordan: al quitar el
         ruido de alrededor son ellas las que tienen que cantar. */
      var lim = (this.guia.pasos[this.iSel] || {}).limpia !== false;
      zonas.forEach(function (z) {
        var gr = z.sel ? (lim ? 6.5 : 5.5) : (lim ? 3.6 : 3);
        var al = z.sel ? 1 : (lim ? 0.68 : 0.5);

        // línea de partición sobre el cuero
        var raya = z.raya.map(function (v) {
          if (!deFrente(v)) return null;
          var s = pantalla(v);
          return s.fuera ? null : s;
        });
        trazar(raya, z.col, gr + 1, al);

        // mechón como BANDA ancha, no como rayas sueltas: es una sección de
        // cabello con cuerpo, que es como se dibuja en una lámina profesional
        if (z.sel && z.segs.length >= 4) {
          var borde1 = [], borde2 = [], ok1 = true;
          for (var m = 0; m < z.segs.length; m += 2) {
            if (!deFrente(z.segs[m])) { ok1 = false; break; }
            var s1 = pantalla(z.segs[m]), s2 = pantalla(z.segs[m + 1]);
            if (s1.fuera || s2.fuera) { ok1 = false; break; }
            borde1.push(s1); borde2.push(s2);
          }
          if (ok1 && borde1.length > 1) {
            x.save();
            x.beginPath();
            x.moveTo(borde1[0].x, borde1[0].y);
            borde1.forEach(function (q) { x.lineTo(q.x, q.y); });
            for (var r2 = borde2.length - 1; r2 >= 0; r2--) x.lineTo(borde2[r2].x, borde2[r2].y);
            x.closePath();
            x.fillStyle = z.col; x.globalAlpha = 0.16; x.fill();
            x.globalAlpha = 0.9; x.lineWidth = 2.2; x.strokeStyle = z.col; x.stroke();
            x.restore();
          }
        }

        // mechones con punta de flecha, apuntando a su numeración
        for (var i = 0; i < z.segs.length; i += 2) {
          var a = z.segs[i], b = z.segs[i + 1];
          if (!a || !b || !deFrente(a)) continue;
          var sa = pantalla(a), sb = pantalla(b);
          if (sa.fuera || sb.fuera) continue;
          trazar([sa, sb], z.col, gr, al);
          flecha(sa, sb, z.col, gr, al);
        }

        // línea guía del corte: por donde pasa la tijera
        var guia = z.puntas.map(function (v, k) {
          if (!deFrente(z.segs[k * 2])) return null;
          var s = pantalla(v);
          return s.fuera ? null : s;
        });
        trazar(guia, z.col, z.sel ? 3.5 : 2.4, al * 0.9, true);

        // eje perpendicular al cuero de la zona en primer plano
        if (z.sel && z.ancla && z.nor && deFrente(z.ancla)) {
          var fin = z.ancla.clone().add(z.nor.clone().multiplyScalar(0.72));
          trazar([pantalla(z.ancla), pantalla(fin)], '#4B5563', 2.6, 0.85, true);
        }
      });
    }

    /* Goniómetro: la cruz de 0° a 180° con su arco graduado sobre el punto de
       partición, como la lámina clásica de ángulos de elevación. */
    goniometro(x, W, H, z) {
      if (!z.ancla || !z.nor || !this.camara) return;
      var self = this;
      var o = z.ancla.clone().project(this.camara);
      if (o.z > 1) return;
      var ox = (o.x + 1) / 2 * W, oy = (1 - o.y) / 2 * H;

      // radio en píxeles a partir de la proyección de un gesto de referencia
      var d90 = this.direccionMechon2(z, 90);
      if (!d90) return;
      var r90 = z.ancla.clone().add(d90.multiplyScalar(1.42)).project(this.camara);
      var R = Math.hypot((r90.x + 1) / 2 * W - ox, (1 - r90.y) / 2 * H - oy);
      if (!(R > 30)) return;

      x.save();
      // arco graduado cada 15°
      for (var g = 0; g <= 180; g += 15) {
        var d = self.direccionMechon2(z, g);
        if (!d) continue;
        var s = z.ancla.clone().add(d.multiplyScalar(1.42)).project(self.camara);
        if (s.z > 1) continue;
        var px = (s.x + 1) / 2 * W, py = (1 - s.y) / 2 * H;
        var mayor = g % 45 === 0;
        var ux = (px - ox) / R, uy = (py - oy) / R;
        var t = mayor ? 13 : 7;
        x.lineWidth = mayor ? 2.2 : 1.2;
        x.strokeStyle = mayor ? 'rgba(27,27,36,.62)' : 'rgba(27,27,36,.34)';
        x.beginPath();
        x.moveTo(px - ux * t, py - uy * t);
        x.lineTo(px, py);
        x.stroke();
        if (mayor) {
          x.font = '800 13px system-ui, sans-serif';
          x.textAlign = 'center'; x.textBaseline = 'middle';
          var lx = px + ux * 16, ly = py + uy * 16;
          var et = g + '°';
          var an = x.measureText(et).width + 10;
          x.fillStyle = 'rgba(255,255,255,.9)';
          self.redondo(x, lx - an / 2, ly - 9, an, 18, 5); x.fill();
          x.fillStyle = 'rgba(27,27,36,.8)';
          x.fillText(et, lx, ly);
          x.textBaseline = 'alphabetic';
        }
      }
      x.restore();
    }

    /* El abanico con nombre: los cinco gestos saliendo del mismo punto de
       partición, cada uno rotulado. Es la mitad izquierda de tu lámina. */
    abanico(x, W, H, z, p) {
      if (!p.abanico || !z.ancla || !z.nor || !this.camara) return;
      var self = this;
      var o = z.ancla.clone().project(this.camara);
      if (o.z > 1) return;
      var ox = (o.x + 1) / 2 * W, oy = (1 - o.y) / 2 * H;

      GESTOS.forEach(function (G) {
        var d = self.direccionMechon2(z, G.g);
        if (!d) return;
        var fin = z.ancla.clone().add(d.multiplyScalar(1.22));
        var s = fin.clone().project(self.camara);
        if (s.z > 1) return;
        var fx = (s.x + 1) / 2 * W, fy = (1 - s.y) / 2 * H;
        var act = G.g === z.grados;
        x.save();
        x.globalAlpha = act ? 1 : 0.40;
        x.lineCap = 'round';
        x.lineWidth = (act ? 4 : 2.2) + 3.5;
        x.strokeStyle = 'rgba(255,255,255,.9)';
        x.beginPath(); x.moveTo(ox, oy); x.lineTo(fx, fy); x.stroke();
        x.lineWidth = act ? 4 : 2.2; x.strokeStyle = G.col;
        x.beginPath(); x.moveTo(ox, oy); x.lineTo(fx, fy); x.stroke();
        var L = Math.hypot(fx - ox, fy - oy);
        if (L > 16) {
          var ux = (fx - ox) / L, uy = (fy - oy) / L, t = act ? 15 : 10;
          x.beginPath();
          x.moveTo(fx, fy);
          x.lineTo(fx - ux * t - uy * t * 0.5, fy - uy * t + ux * t * 0.5);
          x.lineTo(fx - ux * t + uy * t * 0.5, fy - uy * t - ux * t * 0.5);
          x.closePath(); x.fillStyle = G.col; x.fill();
        }
        x.font = (act ? '800 ' + self.fs(16, 14) : '700 ' + self.fs(13, 12)) + 'px system-ui, sans-serif';
        var et = G.g + '° ' + G.n;
        var anc = x.measureText(et).width;
        /* Si la etiqueta se metiera en la zona de los paneles, se voltea al otro
           lado del trazo en vez de escribirse encima. */
        var lim = W - (self.M ? self.M.reserva : 300);
        var haciaIzq = fx < ox || (fx + 14 + anc > lim);
        x.textAlign = haciaIzq ? 'right' : 'left';
        var tx = fx + (haciaIzq ? -14 : 14);
        x.fillStyle = 'rgba(255,255,255,.92)';
        self.redondo(x, haciaIzq ? tx - anc - 7 : tx - 7, fy - 13, anc + 14, 24, 6);
        x.fill();
        x.fillStyle = G.col;
        x.fillText(et, tx, fy + 5);
        x.restore();
      });

      x.save();
      x.beginPath(); x.arc(ox, oy, 7, 0, Math.PI * 2);
      x.fillStyle = '#fff'; x.fill();
      x.lineWidth = 3; x.strokeStyle = '#1B1B24'; x.stroke();
      x.restore();
    }

    direccionMechon2(z, grados) {
      if (!z.nor || !this.T) return null;
      var T = this.T;
      var nor = z.nor.clone();
      var abajo = new T.Vector3(0, -1, 0);
      var tan = abajo.clone().sub(nor.clone().multiplyScalar(abajo.dot(nor)));
      if (tan.lengthSq() < 1e-5) tan = new T.Vector3(0, 0, 1);
      tan.normalize();
      var a = grados * Math.PI / 180;
      return tan.multiplyScalar(Math.cos(a)).add(nor.multiplyScalar(Math.sin(a))).normalize();
    }

    /* La flecha maestra: un arco sobre la coronilla que dice hacia dónde se
       peina todo el paso. Los mechónes ya salen inclinados; esto lo declara en
       grande, que es lo que se ve desde el fondo del aula. */
    flechaMaestra(x, W, H, z, p) {
      var S2 = this.sesgoDe(p);
      if (!S2 || !S2.rotulo || !this.T || !this.camara) return;
      var T = this.T;
      /* El arco transversal apunta al plano medio desde el lado en el que está la
         zona en primer plano: eso lo dice su X, no su Z. */
      var lado = z && z.ancla && z.ancla.x >= 0 ? 1 : -1;
      var arco = [], i;
      for (i = 0; i <= 24; i++) {
        var u = i / 24;
        /* Un arco corto justo por encima del cráneo, girado al plano que
           corresponde a la dirección: sagital para rostro y atrás, transversal
           para el centro. */
        var a = (-0.55 + 1.10 * u) * S2.sentido;
        var v = S2.eje === 'sagital'
          ? new T.Vector3(0, Math.cos(a) * this.ESC.y * 1.30, Math.sin(a) * this.ESC.z * 1.34)
          : new T.Vector3(Math.sin(a) * 1.30 * lado, Math.cos(a) * this.ESC.y * 1.30, 0);
        var s = v.project(this.camara);
        if (s.z > 1) return;
        arco.push({ x: (s.x + 1) / 2 * W, y: (1 - s.y) / 2 * H });
      }
      x.save();
      x.lineCap = 'round'; x.lineJoin = 'round';
      for (var capa = 0; capa < 2; capa++) {
        x.lineWidth = capa ? 5 : 10;
        x.strokeStyle = capa ? '#E0347A' : 'rgba(255,255,255,.92)';
        x.beginPath();
        x.moveTo(arco[0].x, arco[0].y);
        for (i = 1; i < arco.length; i++) x.lineTo(arco[i].x, arco[i].y);
        x.stroke();
      }
      var f = arco[arco.length - 1], q = arco[arco.length - 4];
      var L = Math.hypot(f.x - q.x, f.y - q.y);
      if (L > 4) {
        var ux = (f.x - q.x) / L, uy = (f.y - q.y) / L, t = 20;
        x.beginPath();
        x.moveTo(f.x + ux * 6, f.y + uy * 6);
        x.lineTo(f.x - ux * t - uy * t * 0.55, f.y - uy * t + ux * t * 0.55);
        x.lineTo(f.x - ux * t + uy * t * 0.55, f.y - uy * t - ux * t * 0.55);
        x.closePath();
        x.fillStyle = '#E0347A';
        x.strokeStyle = 'rgba(255,255,255,.92)'; x.lineWidth = 3.5;
        x.stroke(); x.fill();
      }
      var m = arco[Math.floor(arco.length / 2)];
      x.font = '800 ' + this.fs(14, 12) + 'px system-ui, sans-serif';
      var et = S2.rotulo, an = x.measureText(et).width;
      x.fillStyle = 'rgba(255,255,255,.94)';
      this.redondo(x, m.x - an / 2 - 9, m.y - 32, an + 18, 23, 7); x.fill();
      x.fillStyle = '#B21C5C'; x.textAlign = 'center';
      x.fillText(et, m.x, m.y - 15);
      x.restore();
    }

    /* La tijera en la punta del mechón, orientada según la partición. */
    tijera(x, W, H, z, p) {
      if (!z.centro || !this.camara) return;
      var s = z.centro.clone().project(this.camara);
      if (s.z > 1) return;
      var cx = (s.x + 1) / 2 * W + 34, cy = (1 - s.y) / 2 * H + 26;
      // la tijera gira con la partición DE SU CARA
      var dirT = this.part(p, z.cara);
      var ang = dirT === 'vertical' ? Math.PI / 2
        : dirT === 'diagAdelante' ? -Math.PI / 4
          : dirT === 'diagAtras' ? Math.PI / 4
            : dirT === 'oblicua' ? -Math.PI / 6 : 0;
      x.save();
      x.translate(cx, cy); x.rotate(ang);
      x.strokeStyle = '#18906A'; x.lineWidth = 2.6; x.lineCap = 'round';
      x.beginPath(); x.moveTo(-14, -7); x.lineTo(13, 6); x.stroke();
      x.beginPath(); x.moveTo(-14, 7); x.lineTo(13, -6); x.stroke();
      x.beginPath(); x.arc(-17, -10, 4.6, 0, Math.PI * 2); x.stroke();
      x.beginPath(); x.arc(-17, 10, 4.6, 0, Math.PI * 2); x.stroke();
      x.restore();
    }

    /* Ficha técnica de la lámina. */
    /* Ficha técnica de la lámina. Se dimensiona contra el alto REALMENTE
       disponible: etiqueta y valor van en la misma línea, y si aún no cabe se
       recortan las filas menos críticas — mejor menos datos que un panel
       cortado por el borde del lienzo (que es lo que se graba y se imprime). */
    ficha(x, W, H, p) {
      var M = this.M;
      var cara = this.caraFoco(p);
      var pn2 = (PARTICIONES.filter(function (z) { return z.id === this.part(p, cara); }, this)[0] || {}).n || '—';
      var filas = [
        ['TÉCNICA', p.tecnica || this.guia.tecnica || '—'],
        ['ELEVACIÓN', this.pila(p, cara)[this.zonaDe(p, cara)] + '°'],
        ['PARTICIÓN', pn2],
        ['DIRECCIÓN', p.direccion || '—'],
        ['TIPO DE CORTE', p.tipoCorte || '—'],
        ['HERRAMIENTA', p.herramienta || '—'],
        ['RESULTADO', p.resultado || '—']
      ];
      if (p.observaciones) filas.push(['OBSERVACIONES', p.observaciones]);

      /* Una fila por dato, de la misma altura que las de la escala: la etiqueta
         pequeña a la izquierda y el valor a la derecha. Compartir altura de fila
         es lo que garantiza que las dos rejillas quepan una debajo de otra. */
      var anc = M.ancF, x0 = M.x0F, fila = M.fila;
      var y0 = this._finEscala || M.y0;
      var alto = filas.length * fila + 16;

      x.save();
      x.fillStyle = 'rgba(255,255,255,.94)';
      this.redondo(x, x0 - 12, y0 - 10, anc + 24, alto, 12); x.fill();
      x.strokeStyle = 'rgba(27,27,36,.14)'; x.lineWidth = 1.5; x.stroke();
      filas.forEach(function (f, i) {
        var mid = y0 - 2 + i * fila + fila * 0.5;
        x.textAlign = 'left';
        x.fillStyle = '#7C3AED'; x.font = '800 ' + M.etq + 'px system-ui, sans-serif';
        x.fillText(f[0], x0, mid + M.etq * 0.36);
        var izq = x.measureText(f[0]).width + 10;
        x.textAlign = 'right';
        x.fillStyle = '#1B1B24'; x.font = '600 ' + M.cuerpo + 'px system-ui, sans-serif';
        var t = String(f[1]), disp = anc - izq;
        if (x.measureText(t).width > disp) {
          while (t.length > 3 && x.measureText(t + '…').width > disp) t = t.slice(0, -1);
          t += '…';
        }
        x.fillText(t, x0 + anc, mid + M.cuerpo * 0.36);
      });
      x.restore();
    }

    redondo(x, px, py, w, h, r) {
      x.beginPath();
      x.moveTo(px + r, py);
      x.arcTo(px + w, py, px + w, py + h, r);
      x.arcTo(px + w, py + h, px, py + h, r);
      x.arcTo(px, py + h, px, py, r);
      x.arcTo(px, py, px + w, py, r);
      x.closePath();
    }

    partir(x, txt, maxW, font, maxL) {
      x.font = font;
      var pal = String(txt).split(/\s+/), lin = [], act = '';
      for (var i = 0; i < pal.length; i++) {
        var pr = act ? act + ' ' + pal[i] : pal[i];
        if (x.measureText(pr).width > maxW && act) { lin.push(act); act = pal[i]; }
        else act = pr;
        if (lin.length === maxL) break;
      }
      if (lin.length < maxL && act) lin.push(act);
      if (lin.length === maxL) {
        var u = lin[maxL - 1];
        while (u.length > 6 && x.measureText(u + '…').width > maxW) u = u.slice(0, -1);
        if (pal.join(' ').length > lin.join(' ').length) lin[maxL - 1] = u + '…';
      }
      return lin;
    }

    /* ─────────────────────── narración y reproducción ─────────────────────── */

    vozES() {
      var vs = (window.speechSynthesis && speechSynthesis.getVoices()) || [];
      var es = vs.filter(function (v) { return /^es/i.test(v.lang); });
      return es.filter(function (v) { return /google/i.test(v.name); })[0] ||
        es.filter(function (v) { return /female|mónica|monica|helena|paulina/i.test(v.name); })[0] ||
        es[0] || null;
    }

    hablar(txt) {
      var self = this;
      return new Promise(function (ok) {
        if (!window.speechSynthesis || !txt) return ok(0);
        try {
          var u = new SpeechSynthesisUtterance(txt);
          var v = self.vozES();
          if (v) { u.voice = v; u.lang = v.lang; } else u.lang = 'es-ES';
          u.rate = 0.98; u.pitch = 1.04;
          u.onend = function () { ok(1); };
          u.onerror = function () { ok(0); };
          speechSynthesis.speak(u);
        } catch (e) { ok(0); }
      });
    }

    guionPaso(p, i) {
      var self = this;
      var cara = this.caraFoco(p);
      var pila = this.pila(p, cara);
      var nomP = function (ce) {
        return ((PARTICIONES.filter(function (z) { return z.id === self.part(p, ce); })[0] || {}).n || '').toLowerCase();
      };
      var escal = [];
      for (var zi = NZ - 1; zi >= 0; zi--) escal.push('zona ' + zi + ', ' + pila[zi] + ' grados');
      var zF = this.zonaDe(p, cara);
      var frasePart = p.cara === 'ambas'
        ? 'Detrás, partición ' + nomP('posterior') + '. Delante, partición ' + nomP('frontal') + '. '
        : 'Partición ' + nomP(cara) + '. ';
      return 'Paso ' + (i + 1) + '. ' + (p.titulo || '') + '. ' +
        (p.cara === 'ambas' ? 'Se trabajan las dos caras. ' : 'Cara ' + CARAS[cara].n.toLowerCase() + '. ') +
        frasePart +
        'Escala de elevaciones: ' + escal.join('. ') + '. ' +
        'En primer plano, ' + NOMBRE_Z[cara][zF].toLowerCase() + ' a ' + pila[zF] + ' grados. ' +
        (p.texto || '');
    }

    reproducir(conVoz, alAcabar) {
      if (this.animando) return;
      this.animando = true;
      var self = this, i = 0;
      try { speechSynthesis.cancel(); } catch (e) { }
      var siguiente = function () {
        if (i >= self.guia.pasos.length) {
          self.animando = false;
          self.aviso('Fin de la guía.');
          if (alAcabar) alAcabar();
          return;
        }
        self.iSel = i;
        self.refrescarPanel();
        self.aplicarPaso();
        var p = self.guia.pasos[i];
        self.aviso('Paso ' + (i + 1) + ' de ' + self.guia.pasos.length + (conVoz ? ' · narrando' : ''));
        var espera = new Promise(function (ok) { setTimeout(ok, (p.seg || 5) * 1000); });
        var voz = conVoz ? self.hablar(self.guionPaso(p, i)) : Promise.resolve();
        Promise.all([espera, voz]).then(function () { i++; siguiente(); });
      };
      siguiente();
    }

    /* Todos los pasos renderizados de verdad, para revisar antes de descargar. */
    vistaPrevia() {
      if (this.animando) return;
      var self = this;
      if (this.tira.style.display !== 'none' && this.tira.childNodes.length) {
        this.tira.style.display = 'none';
        return this.aviso('');
      }
      this.tira.textContent = '';
      this.tira.style.display = 'flex';
      var iG = this.iSel, camG = { a: this.cam.a, e: this.cam.e, r: this.cam.r };

      this.guia.pasos.forEach(function (p, i) {
        self.iSel = i;
        self.aplicarPaso(true);
        var v = VISTAS.filter(function (x) { return x.id === p.vista; })[0];
        if (v) { self.cam.a = v.a; self.cam.e = v.e; }
        self.destino = null;
        self.render3D();
        self.pintar2D();
        var f = el('div', 'flex:none;width:186px;cursor:pointer');
        var im = el('img', 'width:186px;height:105px;object-fit:cover;border-radius:8px;border:1px solid #2d2d4a;display:block');
        im.src = self.cv.toDataURL('image/jpeg', 0.82);
        f.appendChild(im);
        var caraZ = self.caraFoco(p);
        f.appendChild(el('div', 'font-size:10px;color:#94a3b8;margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis',
          (i + 1) + '. ' + (p.titulo || '') + ' · Z' + self.zonaDe(p, caraZ) + ' ' + self.pila(p, caraZ)[self.zonaDe(p, caraZ)] + '°'));
        f.onclick = function () { self.iSel = i; self.refrescarPanel(); self.aplicarPaso(); };
        self.tira.appendChild(f);
      });

      this.iSel = iG; this.cam = camG;
      this.aplicarPaso();
      this.aviso('Vista previa de los ' + this.guia.pasos.length + ' pasos, tal como saldrán en el vídeo y el PDF. Pulsa una para ir a ese paso.');
    }

    /* ───────────── descarga de láminas · por selección o todas ───────────── */

    FORMATOS = [
      { id: 'png', n: 'PNG', mime: 'image/png', ext: 'png', d: 'sin pérdida' },
      { id: 'jpg', n: 'JPG', mime: 'image/jpeg', ext: 'jpg', d: 'ligero' },
      { id: 'webp', n: 'WEBP', mime: 'image/webp', ext: 'webp', d: 'web' },
      { id: 'pdfuno', n: 'PDF en uno', mime: '', ext: 'pdf', d: 'un documento con las láminas marcadas' },
      { id: 'pdfcada', n: 'PDF por lámina', mime: '', ext: 'pdf', d: 'un archivo suelto por lámina' }
    ];

    abrirLote() {
      if (this.animando) return;
      var abierto = this.cajaLote.style.display !== 'none';
      this.cajaLote.style.display = abierto ? 'none' : 'block';
      if (abierto) return this.aviso('');
      if (!this.loteSel) this.loteSel = {};
      if (!this.loteFmt) this.loteFmt = 'png';
      this.pintarLote();
    }

    loteMarcadas() {
      var s = this.loteSel || {};
      var r = [];
      for (var i = 0; i < this.guia.pasos.length; i++) if (s[i]) r.push(i);
      return r;
    }

    pintarLote() {
      var self = this, c = this.cajaLote;
      c.textContent = '';
      if (!this.loteSel) this.loteSel = {};

      var cab = el('div', 'display:flex;align-items:center;gap:8px;flex-wrap:wrap');
      cab.appendChild(el('span', 'font-size:10px;color:#7c7c9e;letter-spacing:.08em;text-transform:uppercase;font-weight:700;flex:1', 'Descargar láminas'));
      var bTodas = el('button', S.bt + ';background:transparent;border:1px solid #2d2d4a;color:#cbd5e1;padding:5px 10px;font-size:10.5px', 'Todas');
      bTodas.onclick = function () {
        self.guia.pasos.forEach(function (p, i) { self.loteSel[i] = true; });
        self.pintarLote();
      };
      var bNada = el('button', S.bt + ';background:transparent;border:1px solid #2d2d4a;color:#cbd5e1;padding:5px 10px;font-size:10.5px', 'Ninguna');
      bNada.onclick = function () { self.loteSel = {}; self.pintarLote(); };
      cab.appendChild(bTodas); cab.appendChild(bNada);
      c.appendChild(cab);

      var lista = el('div', 'display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:5px;margin-top:9px;max-height:196px;overflow:auto');
      this.guia.pasos.forEach(function (p, i) {
        var on = !!self.loteSel[i];
        var f = el('label', 'display:flex;align-items:center;gap:7px;background:' + (on ? '#231a4a' : '#1a1a35') + ';border:1px solid ' + (on ? '#7c3aed' : '#2d2d4a') + ';border-radius:8px;padding:6px 9px;cursor:pointer;font-size:11px;color:#e8e8f5');
        var ck = el('input', 'accent-color:#a855f7;cursor:pointer;flex:none');
        ck.type = 'checkbox'; ck.checked = on;
        ck.onchange = function () { self.loteSel[i] = ck.checked; self.pintarLote(); };
        var t = el('span', 'flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis', (i + 1) + '. ' + (p.titulo || 'Paso ' + (i + 1)));
        f.appendChild(ck); f.appendChild(t);
        lista.appendChild(f);
      });
      c.appendChild(lista);

      c.appendChild(el('label', 'font-size:10px;color:#7c7c9e;letter-spacing:.06em;text-transform:uppercase;font-weight:700;display:block;margin:11px 0 5px', 'Formato'));
      var ff = el('div', 'display:flex;gap:5px;flex-wrap:wrap');
      this.FORMATOS.forEach(function (f) {
        var b = el('button', (self.loteFmt === f.id ? S.chipOn : S.chipOff), f.n);
        b.title = f.d;
        b.onclick = function () { self.loteFmt = f.id; self.pintarLote(); };
        ff.appendChild(b);
      });
      c.appendChild(ff);

      var fmt = this.FORMATOS.filter(function (f) { return f.id === self.loteFmt; })[0];
      var n = this.loteMarcadas().length;
      c.appendChild(el('div', 'font-size:10.5px;color:#7c7c9e;line-height:1.55;margin-top:8px',
        fmt.d + '. Sin límite de láminas: se descargan una detrás de otra.'));

      var bGo = el('button', S.bt + ';width:100%;margin-top:9px;background:linear-gradient(135deg,#0891b2,#06b6d4);color:#fff;border:0;font-weight:700',
        n ? ('⤓ Descargar ' + n + (n === 1 ? ' lámina' : ' láminas') + ' en ' + fmt.n) : 'Marca al menos una lámina');
      bGo.disabled = !n;
      if (!n) bGo.style.opacity = '.5';
      bGo.onclick = function () { self.descargarLote(); };
      c.appendChild(bGo);
    }

    /* ───────────────── vídeo narrado · la narración va escrita dentro ─────────────────
       El texto de cada paso sale rotulado sobre la lámina mientras se ve el
       diagrama. Si el navegador deja compartir el audio de la pestaña, la voz
       de Google entra también dentro del archivo. */

    MEDIDAS_VID = [
      { id: 'hoja', n: 'Como la lámina' },
      { id: 'v', n: '9:16', w: 720, h: 1280 },
      { id: 'q', n: '1:1', w: 900, h: 900 },
      { id: 'h', n: '16:9', w: 1280, h: 720 }
    ];

    abrirVid() {
      if (this.animando) return;
      var abierto = this.cajaVid.style.display !== 'none';
      this.cajaVid.style.display = abierto ? 'none' : 'block';
      if (abierto) return this.aviso('');
      if (!this.ratioVid) this.ratioVid = 'hoja';
      this.pintarVid();
    }

    textoNarra(p, i) {
      return (p.texto && p.texto.trim()) ? p.texto.trim() : this.guionPaso(p, i);
    }

    pintarVid() {
      var self = this, c = this.cajaVid;
      c.textContent = '';
      c.appendChild(el('div', 'font-size:10px;color:#7c7c9e;letter-spacing:.08em;text-transform:uppercase;font-weight:700', 'Vídeo con la narración escrita dentro'));
      c.appendChild(el('div', 'font-size:10.5px;color:#7c7c9e;line-height:1.55;margin-top:5px',
        'Se rotula el texto de cada paso sobre su lámina. Los pasos sin texto usan la explicación automática de su escala de elevaciones.'));

      c.appendChild(el('label', 'font-size:10px;color:#7c7c9e;letter-spacing:.06em;text-transform:uppercase;font-weight:700;display:block;margin:11px 0 5px', 'Medida'));
      var fm = el('div', 'display:flex;gap:5px;flex-wrap:wrap');
      this.MEDIDAS_VID.forEach(function (m) {
        var b = el('button', (self.ratioVid === m.id ? S.chipOn : S.chipOff), m.n);
        b.onclick = function () { self.ratioVid = m.id; self.pintarVid(); };
        fm.appendChild(b);
      });
      c.appendChild(fm);

      if (window.B6Voz) {
        var hv = document.createElement('div');
        c.appendChild(hv);
        if (this._offVoz) { try { this._offVoz(); } catch (e) { } }
        this._offVoz = B6Voz.panel(hv);
      }

      var seg = this.guia.pasos.reduce(function (a, p, i) {
        var w = String(self.textoNarra(p, i)).trim().split(/\s+/).length;
        return a + Math.max(p.seg || 5, w / 2.3 + 1.5);
      }, 0);
      c.appendChild(el('div', 'font-size:10.5px;color:#7c7c9e;line-height:1.55;margin-top:8px',
        'Durará unos ' + Math.round(seg) + ' s, el tiempo que se tarda en leer la narración. Se graba en tiempo real.'));

      var bGo = el('button', S.bt + ';width:100%;margin-top:9px;background:linear-gradient(135deg,#0891b2,#06b6d4);color:#fff;border:0;font-weight:700', '⏺ Grabar vídeo narrado');
      bGo.onclick = function () { self.grabarNarrado(); };
      c.appendChild(bGo);
    }

    capVid(x, W, H, txt) {
      if (!txt) return;
      var pad = Math.round(W * 0.045);
      var fs = Math.max(16, Math.round(W * 0.030));
      x.save();
      x.font = '600 ' + fs + 'px Segoe UI,Arial,sans-serif';
      x.textAlign = 'center'; x.textBaseline = 'middle';
      var max = W - pad * 2, pal = String(txt).split(/\s+/), lineas = [], ln = '';
      pal.forEach(function (p) {
        var t = ln ? ln + ' ' + p : p;
        if (x.measureText(t).width > max && ln) { lineas.push(ln); ln = p; } else ln = t;
      });
      if (ln) lineas.push(ln);
      if (lineas.length > 5) lineas = lineas.slice(0, 5);
      var lh = fs * 1.3, alto = lineas.length * lh + pad * 0.8;
      var y0 = H - alto - Math.round(H * 0.03);
      var gr = x.createLinearGradient(0, y0 - pad * 0.6, 0, H);
      gr.addColorStop(0, 'rgba(8,8,18,0)'); gr.addColorStop(0.4, 'rgba(8,8,18,.85)'); gr.addColorStop(1, 'rgba(8,8,18,.95)');
      x.fillStyle = gr; x.fillRect(0, y0 - pad * 0.6, W, H - y0 + pad * 0.6);
      x.fillStyle = '#ffffff';
      x.shadowColor = 'rgba(0,0,0,.8)'; x.shadowBlur = fs * 0.3;
      lineas.forEach(function (l, k) { x.fillText(l, W / 2, y0 + pad * 0.4 + lh * (k + 0.5)); });
      x.restore();
    }

    grabarNarrado() {
      if (this.animando) return;
      var self = this;
      var pasos = this.guia.pasos;
      if (!pasos.length) return this.aviso('La guía no tiene pasos.');

      var med = this.MEDIDAS_VID.filter(function (m) { return m.id === (self.ratioVid || 'hoja'); })[0] || this.MEDIDAS_VID[0];
      var OW = med.w || this.cv.width, OH = med.h || this.cv.height;
      var out = document.createElement('canvas');
      out.width = OW; out.height = OH;
      var octx = out.getContext('2d');
      if (!out.captureStream) return this.aviso('Este navegador no sabe grabar el lienzo.');

      var textos = pasos.map(function (p, i) { return self.textoNarra(p, i); });
      var durs = pasos.map(function (p, i) {
        var w = String(textos[i]).trim().split(/\s+/).length;
        return Math.max(p.seg || 5, w / 2.3 + 1.5);
      });

      var cur = 0;
      var componer = function () {
        var gr = octx.createLinearGradient(0, 0, 0, OH);
        gr.addColorStop(0, '#0a0a14'); gr.addColorStop(1, '#14142a');
        octx.fillStyle = gr; octx.fillRect(0, 0, OW, OH);
        var esc = Math.min(OW / self.cv.width, OH / self.cv.height) * (med.id === 'hoja' ? 1 : 0.96);
        var dw = self.cv.width * esc, dh = self.cv.height * esc;
        octx.drawImage(self.cv, (OW - dw) / 2, (OH - dh) / 2 - OH * 0.05, dw, dh);
        self.capVid(octx, OW, OH, textos[cur]);
      };

      var arrancar = function (pistaAudio, pz) {
        self.animando = true;
        self.iSel = 0; self.aplicarPaso(); self.render3D(); self.pintar2D();
        componer();
        var mime = window.B6Voz ? B6Voz.mime(!!pistaAudio)
          : ['video/mp4;codecs=avc1.42E01E', 'video/webm'].filter(function (m) { return window.MediaRecorder && MediaRecorder.isTypeSupported(m); })[0];
        var flujo = out.captureStream(30);
        if (pistaAudio) { try { flujo.addTrack(pistaAudio); } catch (e) { } }
        var rec;
        try { rec = new MediaRecorder(flujo, mime ? { mimeType: mime, videoBitsPerSecond: 7000000, audioBitsPerSecond: 160000 } : undefined); }
        catch (err) { self.animando = false; return self.aviso('No se ha podido grabar: ' + err.message); }
        var trozos = [];
        rec.ondataavailable = function (e) { if (e.data && e.data.size) trozos.push(e.data); };
        rec.onstop = function () {
          var tipo = (mime && mime.indexOf('mp4') >= 0) ? 'video/mp4' : 'video/webm';
          var url = URL.createObjectURL(new Blob(trozos, { type: tipo }));
          self.bajar(url, (self.guia.nombre || 'guia').replace(/[^\w\sáéíóúñ-]/gi, '') + ' - narrada.' + (tipo === 'video/mp4' ? 'mp4' : 'webm'));
          setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
          if (pz) { try { pz.parar(); } catch (e) { } }
          else if (pistaAudio) { try { pistaAudio.stop(); } catch (e) { } }
          self.animando = false;
          self.aviso('Vídeo narrado descargado' + (pistaAudio ? ' con tu voz dentro del archivo.' : ' con la narración rotulada.') + ' Medida: ' + med.n + '.');
        };
        rec.start(250);
        if (pz) pz.empezar();
        self.aviso(pz && pz.directo ? 'Grabando: narra ahora, tu voz entra en el archivo.' : 'Grabando la guía narrada. No cambies de pestaña.');

        var raf = function () {
          if (!self.animando) return;
          componer();
          requestAnimationFrame(raf);
        };
        raf();

        try { speechSynthesis.cancel(); } catch (e) { }
        var siguiente = function () {
          if (cur >= pasos.length) {
            try { speechSynthesis.cancel(); } catch (e) { }
            setTimeout(function () { try { rec.stop(); } catch (e) { } }, 400);
            return;
          }
          self.iSel = cur;
          self.refrescarPanel();
          self.aplicarPaso();
          var p = pasos[cur];
          var v = VISTAS.filter(function (x) { return x.id === p.vista; })[0];
          if (v) { self.cam.a = v.a; self.cam.e = v.e; }
          setTimeout(function () { cur++; siguiente(); }, durs[cur] * 1000);
        };
        siguiente();
      };

      /* El guion viaja al módulo de voz antes de pedirle la pista, con una
         clave por paso: así la voz grabada acompaña al paso, no al orden. */
      if (window.B6Voz) {
        B6Voz.ponerGuion((this.guia.pasos || []).map(function (p, i) {
          return { texto: self.textoNarra(p, i), clave: 'g3d:' + (self.guia.id || 'x') + ':' + i };
        }));
      }
      if (window.B6Voz && (B6Voz.hay() || B6Voz.vivo)) {
        B6Voz.pista()
          .then(function (pz) { if (!pz) { self.aviso(B6Voz.nota || 'Sin voz disponible: sale con la narración rotulada.'); return arrancar(null); } arrancar(pz.track, pz); })
          .catch(function () { arrancar(null); });
      } else arrancar(null);
    }

    /* Renderiza un paso de verdad y devuelve su imagen. Comparte el mismo
       camino que el vídeo y el PDF, así lo que se descarga es lo que se ve. */
    laminaURL(i, mime, calidad) {
      var p = this.guia.pasos[i];
      this.iSel = i;
      this.aplicarPaso(true);
      var v = VISTAS.filter(function (x) { return x.id === p.vista; })[0];
      if (v) { this.cam.a = v.a; this.cam.e = v.e; }
      this.destino = null;
      this.render3D(); this.pintar2D();
      return this.cv.toDataURL(mime || 'image/png', calidad || 0.94);
    }

    descargarLote() {
      if (this.animando) return;
      var self = this;
      var idx = this.loteMarcadas();
      if (!idx.length) return;
      var fmt = this.FORMATOS.filter(function (f) { return f.id === self.loteFmt; })[0];
      var base = (this.guia.nombre || 'guia').replace(/[^\w\sáéíóúñ-]/gi, '').trim() || 'guia';
      var jsPDF = window.jspdf && window.jspdf.jsPDF;
      if (fmt.id.indexOf('pdf') === 0 && !jsPDF)
        return this.aviso('El PDF necesita conexión la primera vez. Con internet vuelve a intentarlo.');

      var camG = { a: this.cam.a, e: this.cam.e, r: this.cam.r }, iG = this.iSel;
      var fin = function (msg) {
        self.iSel = iG; self.cam = camG;
        self.aplicarPaso();
        self.aviso(msg);
      };

      if (fmt.id === 'pdfuno') {
        var doc = new jsPDF({ orientation: 'l', unit: 'mm', format: 'a4' });
        idx.forEach(function (i, k) {
          var img = self.laminaURL(i, 'image/jpeg', 0.92);
          if (k) doc.addPage();
          doc.setFillColor(255, 255, 255); doc.rect(0, 0, 297, 210, 'F');
          doc.setFillColor(124, 58, 237); doc.rect(0, 0, 297, 4, 'F');
          doc.addImage(img, 'JPEG', 12, 22, 273, 273 * 720 / 1280);
          doc.setTextColor(124, 58, 237); doc.setFont('helvetica', 'bold'); doc.setFontSize(9);
          doc.text('LÁMINA ' + (i + 1), 12, 15);
          doc.setTextColor(30, 30, 45); doc.setFontSize(14);
          doc.text(doc.splitTextToSize(self.guia.pasos[i].titulo || ('Paso ' + (i + 1)), 240), 34, 15);
          doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(150, 150, 170);
          doc.text((self.guia.autora || '') + (self.guia.autora ? '  ·  ' : '') + (self.guia.nombre || ''), 12, 203);
        });
        doc.save(base + ' - laminas.pdf');
        return fin(idx.length + ' láminas en un solo PDF.');
      }

      /* Uno detrás de otro, con una pausa mínima: así el navegador no descarta
         descargas y no hay tope de archivos. */
      var k = 0;
      var paso = function () {
        if (k >= idx.length) return fin(idx.length + (idx.length === 1 ? ' lámina descargada en ' : ' láminas descargadas en ') + fmt.n + '.');
        var i = idx[k];
        var num = String(i + 1).length < 2 ? '0' + (i + 1) : String(i + 1);
        var nom = base + ' - ' + num;
        self.aviso('Descargando ' + (k + 1) + ' de ' + idx.length + '…');

        if (fmt.id === 'pdfcada') {
          var img = self.laminaURL(i, 'image/jpeg', 0.92);
          var d = new jsPDF({ orientation: 'l', unit: 'mm', format: 'a4' });
          d.setFillColor(255, 255, 255); d.rect(0, 0, 297, 210, 'F');
          d.setFillColor(124, 58, 237); d.rect(0, 0, 297, 4, 'F');
          d.addImage(img, 'JPEG', 12, 22, 273, 273 * 720 / 1280);
          d.setTextColor(124, 58, 237); d.setFont('helvetica', 'bold'); d.setFontSize(9);
          d.text('LÁMINA ' + (i + 1), 12, 15);
          d.setTextColor(30, 30, 45); d.setFontSize(14);
          d.text(d.splitTextToSize(self.guia.pasos[i].titulo || ('Paso ' + (i + 1)), 240), 34, 15);
          d.save(nom + '.pdf');
        } else {
          var url = self.laminaURL(i, fmt.mime, 0.94);
          self.bajar(url, nom + '.' + fmt.ext);
        }
        k++;
        setTimeout(paso, 320);
      };
      paso();
    }

    /* ─────────────────────────── vídeo ─────────────────────────── */

    grabar() {
      if (this.animando) return;
      var self = this;
      if (!this.cv.captureStream) return this.aviso('Este navegador no sabe grabar el lienzo.');
      var conVoz = !!(window.B6Voz && (B6Voz.hay() || B6Voz.vivo));
      var mime = window.B6Voz ? B6Voz.mime(conVoz)
        : ['video/mp4;codecs=avc1.42E01E', 'video/webm'].filter(function (m) { return window.MediaRecorder && MediaRecorder.isTypeSupported(m); })[0];

      var listo = function (pistaAudio, pz) {
        var flujo = self.cv.captureStream(30);
        if (pistaAudio) { try { flujo.addTrack(pistaAudio); } catch (e) { } }
        var rec;
        try { rec = new MediaRecorder(flujo, mime ? { mimeType: mime, videoBitsPerSecond: 6000000, audioBitsPerSecond: 160000 } : undefined); }
        catch (err) { return self.aviso('No se ha podido grabar: ' + err.message); }
        var trozos = [];
        rec.ondataavailable = function (e) { if (e.data && e.data.size) trozos.push(e.data); };
        rec.onstop = function () {
          var tipo = (mime && mime.indexOf('mp4') >= 0) ? 'video/mp4' : 'video/webm';
          var url = URL.createObjectURL(new Blob(trozos, { type: tipo }));
          self.bajar(url, (self.guia.nombre || 'guia').replace(/[^\w\sáéíóúñ-]/gi, '') + '.' + (tipo === 'video/mp4' ? 'mp4' : 'webm'));
          setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
          if (pz) { try { pz.parar(); } catch (e) { } }
          else if (pistaAudio) try { pistaAudio.stop(); } catch (e) { }
          self.aviso('Vídeo de la guía descargado' + (pistaAudio ? ' con tu voz dentro del archivo.' : '.'));
        };
        rec.start(250);
        if (pz) pz.empezar();
        self.aviso(pz && pz.directo ? 'Narra ahora: se graba tu voz con la guía.' : 'Grabando la guía. No cambies de pestaña.');
        self.reproducir(false, function () { setTimeout(function () { try { rec.stop(); } catch (e) { } }, 400); });
      };

      if (window.B6Voz && (B6Voz.hay() || B6Voz.vivo)) {
        B6Voz.pista()
          .then(function (pz) { if (!pz) { self.aviso(B6Voz.nota || 'Sin voz disponible: se graba sin voz.'); return listo(null); } listo(pz.track, pz); })
          .catch(function () { listo(null); });
      } else listo(null);
    }

    /* ─────────────────────────── PDF ─────────────────────────── */

    pdf() {
      var jsPDF = window.jspdf && window.jspdf.jsPDF;
      var self = this;
      if (!jsPDF) return this.aviso('El PDF necesita conexión la primera vez. Con internet vuelve a intentarlo.');
      if (this.animando) return;

      var doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
      var W = 210, H = 297;

      doc.setFillColor(255, 255, 255); doc.rect(0, 0, W, H, 'F');
      doc.setFillColor(124, 58, 237); doc.rect(0, 0, W, 8, 'F');
      doc.setTextColor(32, 30, 29);
      doc.setFont('helvetica', 'bold'); doc.setFontSize(30);
      doc.text(doc.splitTextToSize(this.guia.nombre || 'Guía profesional', W - 40), 20, 96);
      doc.setFontSize(14); doc.setTextColor(109, 40, 217);
      doc.setFont('helvetica', 'normal');
      var sub = [this.guia.tecnica, this.guia.autora].filter(Boolean).join('  ·  ');
      if (sub) doc.text(sub, 20, 118);
      doc.setFontSize(11); doc.setTextColor(100, 116, 139);
      doc.text(this.guia.pasos.length + ' pasos  ·  ' + new Date().toLocaleDateString('es-ES'), 20, 132);
      doc.text('Guía de técnica profesional. Secciones, particiones y elevaciones por zona.', 20, H - 24);

      var camG = { a: this.cam.a, e: this.cam.e, r: this.cam.r }, iG = this.iSel;

      this.guia.pasos.forEach(function (p, i) {
        var cara = self.caraFoco(p);
        var pila = self.pila(p, cara);
        self.iSel = i;
        self.aplicarPaso(true);
        var v = VISTAS.filter(function (x) { return x.id === p.vista; })[0];
        if (v) { self.cam.a = v.a; self.cam.e = v.e; }
        self.destino = null;
        self.render3D(); self.pintar2D();
        var img = self.cv.toDataURL('image/jpeg', 0.92);

        doc.addPage();
        doc.setFillColor(255, 255, 255); doc.rect(0, 0, W, H, 'F');
        doc.setFillColor(124, 58, 237); doc.rect(0, 0, W, 5, 'F');

        doc.setTextColor(124, 58, 237); doc.setFont('helvetica', 'bold'); doc.setFontSize(10);
        doc.text('PASO ' + (i + 1) + ' DE ' + self.guia.pasos.length, 18, 22);
        doc.setTextColor(20, 20, 35); doc.setFontSize(21);
        doc.text(doc.splitTextToSize(p.titulo || 'Paso ' + (i + 1), W - 36), 18, 34);

        doc.addImage(img, 'JPEG', 18, 44, W - 36, (W - 36) * 720 / 1280);

        var y = 44 + (W - 36) * 720 / 1280 + 14;
        doc.setDrawColor(226, 226, 240); doc.line(18, y - 7, W - 18, y - 7);

        doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(124, 58, 237);
        doc.text('CARA', 18, y);
        doc.text('PARTICIÓN', 62, y);
        doc.text('ZONA', 128, y);
        doc.setFont('helvetica', 'normal'); doc.setFontSize(12); doc.setTextColor(20, 20, 35);
        doc.text(p.cara === 'ambas' ? 'Ambas' : CARAS[cara].n, 18, y + 7);
        doc.text((PARTICIONES.filter(function (z) { return z.id === self.part(p, cara); })[0] || {}).n || '—', 62, y + 7);
        doc.text('Z' + self.zonaDe(p, cara) + ' · ' + pila[self.zonaDe(p, cara)] + '°', 128, y + 7);

        // tabla de la escala de elevaciones
        doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(124, 58, 237);
        doc.text('ESCALA DE ELEVACIONES', 18, y + 20);
        doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5); doc.setTextColor(45, 45, 65);
        var fila = [];
        for (var zi = NZ - 1; zi >= 0; zi--) fila.push('Z' + zi + ' ' + pila[zi] + '°');
        doc.text(fila.join('   ·   '), 18, y + 27);

        if (p.texto) {
          doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(124, 58, 237);
          doc.text('RECOMENDACIÓN', 18, y + 39);
          doc.setFont('helvetica', 'normal'); doc.setFontSize(11.5); doc.setTextColor(45, 45, 65);
          doc.text(doc.splitTextToSize(p.texto, W - 36), 18, y + 46);
        }

        doc.setFontSize(8); doc.setTextColor(150, 150, 170);
        doc.text((self.guia.autora || '') + (self.guia.autora ? '  ·  ' : '') + (self.guia.nombre || ''), 18, H - 10);
      });

      this.iSel = iG; this.cam = camG;
      this.aplicarPaso();
      doc.save((this.guia.nombre || 'guia').replace(/[^\w\sáéíóúñ-]/gi, '') + '.pdf');
      this.aviso('PDF de la guía descargado, con un diagrama y su escala de elevaciones por paso.');
    }

    /* ────────────────── guardar en el dispositivo · JSON ────────────────── */

    CLAVE = 'guias_pro_v2';

    leerTodas() {
      try { return JSON.parse(localStorage.getItem(this.CLAVE) || '[]'); } catch (e) { return []; }
    }

    leerUltima() {
      var l = this.leerTodas();
      return l.length ? l[0].guia : null;
    }

    guardar() {
      var l = this.leerTodas();
      var nom = this.guia.nombre || 'Guía sin título';
      var reg = { id: Date.now(), nombre: nom, fecha: new Date().toLocaleDateString('es-ES'), guia: JSON.parse(JSON.stringify(this.guia)) };
      l = l.filter(function (r) { return r.nombre !== nom; });
      l.unshift(reg);
      try { localStorage.setItem(this.CLAVE, JSON.stringify(l.slice(0, 30))); }
      catch (e) { return this.aviso('No hay sitio para guardar más guías en este dispositivo.'); }
      this.pintarGuardadas();
      this.aviso('«' + nom + '» guardada en este dispositivo.');
    }

    pintarGuardadas() {
      if (!this.listaGuardadas) return;
      var self = this, l = this.leerTodas();
      this.listaGuardadas.textContent = '';
      if (!l.length) {
        this.listaGuardadas.appendChild(el('div', 'font-size:10.5px;color:#7c7c9e;line-height:1.5',
          'Lo que guardes se queda en este dispositivo, sin cuenta ni servidor. Exporta para pasárselo a otra profesional.'));
        return;
      }
      l.forEach(function (r) {
        var f = el('div', 'display:flex;align-items:center;gap:6px;background:#1a1a35;border:1px solid #2d2d4a;border-radius:8px;padding:6px 9px');
        var t = el('div', 'flex:1;min-width:0');
        t.appendChild(el('div', 'font-size:11px;font-weight:600;color:#e8e8f5;white-space:nowrap;overflow:hidden;text-overflow:ellipsis', r.nombre));
        t.appendChild(el('div', 'font-size:9.5px;color:#7c7c9e', r.fecha + ' · ' + (r.guia.pasos || []).length + ' pasos'));
        var ba = el('button', 'background:transparent;border:1px solid #4b4b7a;color:#cbd5e1;border-radius:6px;padding:3px 8px;font-size:10px;cursor:pointer;font-family:inherit', 'Abrir');
        ba.onclick = function () { self.cargarGuia(r.guia); };
        var bb = el('button', 'background:transparent;border:0;color:#7c7c9e;cursor:pointer;font-size:13px;font-family:inherit', '×');
        bb.onclick = function () {
          var l2 = self.leerTodas().filter(function (z) { return z.id !== r.id; });
          localStorage.setItem(self.CLAVE, JSON.stringify(l2));
          self.pintarGuardadas();
        };
        f.appendChild(t); f.appendChild(ba); f.appendChild(bb);
        self.listaGuardadas.appendChild(f);
      });
    }

    cargarGuia(g) {
      if (!g || !g.pasos || !g.pasos.length) return this.aviso('Ese archivo no tiene pasos.');
      var n = JSON.parse(JSON.stringify(g));
      if (!n.refs) n.refs = { orejas: true, media: true, cresta: false, diagonal: false };
      /* Guías de la versión anterior traían una sola elevación: se reparte como
         escala plana para que sigan abriéndose sin quedar en blanco. */
      n.pasos = n.pasos.map(function (p, k) {
        var q = Object.assign(nuevoPaso(k + 1), p);
        if (!Array.isArray(q.elevF) || q.elevF.length !== NZ) q.elevF = pilaCero();
        if (!Array.isArray(q.elevB) || q.elevB.length !== NZ) q.elevB = pilaCero();
        if (typeof p.elevacion === 'number' && !Array.isArray(p.elevF)) {
          for (var i = 0; i < NZ; i++) { q.elevF[i] = p.elevacion; q.elevB[i] = p.elevacion; }
        }
        if (!CARAS[q.cara] && q.cara !== 'ambas') q.cara = 'posterior';
        /* Guías antiguas tenían una sola partición y una sola zona: se copian a
           las dos caras para que se abran igual que se guardaron. */
        if (p.particion && !p.particionF && !p.particionB) { q.particionF = p.particion; q.particionB = p.particion; }
        if (typeof p.zona === 'number' && p.zonaF == null && p.zonaB == null) { q.zonaF = p.zona; q.zonaB = p.zona; }
        if (!q.particionF) q.particionF = 'horizontal';
        if (!q.particionB) q.particionB = 'diagAtras';
        [['zonaF'], ['zonaB']].forEach(function (k2) {
          if (q[k2[0]] == null || q[k2[0]] < 0 || q[k2[0]] >= NZ) q[k2[0]] = 3;
        });
        return q;
      });
      this.guia = n;
      this.aplicarFoto();
      this.sincroQR();
      this.iSel = 0;
      this.inNombre.value = this.guia.nombre || '';
      this.inAutora.value = this.guia.autora || '';
      this.inTecnica.value = this.guia.tecnica || '';
      this.inQR.value = this.guia.qr || '';
      this.refrescarPanel();
      this.pintarRefs();
      this.aplicarPaso();
      this.aviso('«' + (this.guia.nombre || 'Guía') + '» abierta.');
    }

    exportar() {
      var txt = JSON.stringify(this.guia, null, 2);
      var url = URL.createObjectURL(new Blob([txt], { type: 'application/json' }));
      this.bajar(url, (this.guia.nombre || 'guia').replace(/[^\w\sáéíóúñ-]/gi, '') + '.json');
      setTimeout(function () { URL.revokeObjectURL(url); }, 3000);
      this.aviso('Guía exportada. Ese archivo se puede importar en cualquier dispositivo.');
    }

    importar(ev) {
      var f = ev.target.files && ev.target.files[0];
      if (!f) return;
      var self = this, r = new FileReader();
      r.onload = function () {
        try { self.cargarGuia(JSON.parse(r.result)); }
        catch (e) { self.aviso('Ese archivo no se ha podido leer.'); }
      };
      r.readAsText(f);
      ev.target.value = '';
    }

    bajar(url, nombre) {
      if (window.B6Bandeja) B6Bandeja.apuntar(url, nombre, 'guias');
      var a = document.createElement('a');
      a.href = url; a.download = nombre;
      document.body.appendChild(a); a.click();
      setTimeout(function () { a.remove(); }, 500);
    }
  }

  if (!window.customElements.get('guias-3d')) customElements.define('guias-3d', GuiasTresD);
})();

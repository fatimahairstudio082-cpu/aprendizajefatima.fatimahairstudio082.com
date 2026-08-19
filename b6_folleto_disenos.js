/* ═══════════════════════════════════════════════════════════════════════════
   CEREBRO DE DISEÑO · Folletos Pro (Bloque 6)
   ───────────────────────────────────────────────────────────────────────────
   Estilos profesionales listos para elegir con un clic. Cada estilo es una
   combinación armónica de PALETA + CUADRÍCULA + HOJA + ACABADOS que ya sabe
   dibujar el motor (b6_folleto_motor.js). La persona elige el tipo de diseño
   que quiere y la plantilla se coloca sola; después puede seguir cambiando
   cualquier cosa a mano.

   No inventa nada nuevo en el lienzo: sólo mueve los mandos que ya existen,
   así que lo que promete es exactamente lo que sale. 100% en el dispositivo,
   sin coste, sin internet.

   API pública:
     FOLLETO_DISENOS.lista()   → [{id, nombre, desc, cat, tema, rejilla, formato, adornos}]
     FOLLETO_DISENOS.grupos()  → ['Catálogo y tarifa', 'Redes sociales', …]
     FOLLETO_DISENOS.get(id)   → un estilo, o null
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if (window._B6_FOLLETO_DISENOS_LOADED) return;
  window._B6_FOLLETO_DISENOS_LOADED = true;

  var TODO = { grano: true, vineta: true, filetes: true, sombras: true };
  var LIMPIO = { grano: false, vineta: false, filetes: true, sombras: false };
  var IMPRESO = { grano: false, vineta: false, filetes: true, sombras: true };
  var SUAVE = { grano: true, vineta: false, filetes: true, sombras: true };

  /* cat = grupo para el desplegable · tema/rejilla/formato = mandos del motor */
  var DISENOS = [

    /* ── Carta y cartel (una sola pieza: foto grande + texto) ── */
    { id: 'carta_presentacion', cat: 'Carta y cartel', nombre: '💌 Carta de presentación',
      desc: 'Una sola pieza limpia: foto grande, tu nombre y tu mensaje.',
      tema: 'minimal', rejilla: 'r1', formato: 'a4v', adornos: LIMPIO },
    { id: 'cartel_anuncio', cat: 'Carta y cartel', nombre: '📢 Cartel de anuncio',
      desc: 'Pieza única llamativa en oro sobre negro, para anunciar algo.',
      tema: 'oro_negro', rejilla: 'r1', formato: 'a4v', adornos: TODO },
    { id: 'anuncio_historia', cat: 'Carta y cartel', nombre: '📱 Anuncio para historia',
      desc: 'Pieza única vertical para stories y estados de WhatsApp.',
      tema: 'violeta', rejilla: 'r1', formato: 'historia', adornos: TODO },
    { id: 'anuncio_cuadrado', cat: 'Carta y cartel', nombre: '📸 Anuncio cuadrado',
      desc: 'Pieza única para el feed de Instagram, cálida y clara.',
      tema: 'coral', rejilla: 'r1', formato: 'cuadrado', adornos: SUAVE },

    /* ── Catálogo y tarifa (para imprimir o PDF) ── */
    { id: 'catalogo_lujo', cat: 'Catálogo y tarifa', nombre: '👑 Catálogo lujo',
      desc: 'Oro sobre negro, seis servicios. El más elegante.',
      tema: 'oro_negro', rejilla: 'r6a', formato: 'a4v', adornos: TODO },
    { id: 'tarifa_clasica', cat: 'Catálogo y tarifa', nombre: '📋 Tarifa clásica',
      desc: 'Rejilla 2×2 en tonos nude. La de toda la vida, bien hecha.',
      tema: 'nude', rejilla: 'r4a', formato: 'a4v', adornos: IMPRESO },
    { id: 'carta_completa', cat: 'Catálogo y tarifa', nombre: '🍷 Carta completa',
      desc: 'Ocho servicios en burdeos. Cuando ofreces de todo.',
      tema: 'burdeos', rejilla: 'r8a', formato: 'a4v', adornos: TODO },
    { id: 'revista', cat: 'Catálogo y tarifa', nombre: '📰 Portada de revista',
      desc: 'Un servicio estrella grande arriba y tres debajo.',
      tema: 'violeta', rejilla: 'r4b', formato: 'a4v', adornos: TODO },

    /* ── Redes sociales (cuadrado e historia) ── */
    { id: 'ig_post', cat: 'Redes sociales', nombre: '📸 Post de Instagram',
      desc: 'Cuadrado, cuatro cuadros, coral cálido. Para el feed.',
      tema: 'coral', rejilla: 'r4a', formato: 'cuadrado', adornos: IMPRESO },
    { id: 'ig_historia', cat: 'Redes sociales', nombre: '📲 Historia / WhatsApp',
      desc: 'Vertical, seis cuadros. Para estados y stories.',
      tema: 'violeta', rejilla: 'r6a', formato: 'historia', adornos: TODO },
    { id: 'neon_redes', cat: 'Redes sociales', nombre: '⚡ Neón para redes',
      desc: 'Cian brillante que llama la atención en el móvil.',
      tema: 'cian', rejilla: 'r4a', formato: 'cuadrado', adornos: TODO },
    { id: 'promo_oferta', cat: 'Redes sociales', nombre: '🔥 Cartel de oferta',
      desc: 'Dúo grande vertical, para anunciar una promoción.',
      tema: 'coral', rejilla: 'r2a', formato: 'historia', adornos: TODO },

    /* ── Elegante y eventos ── */
    { id: 'boda', cat: 'Elegante y eventos', nombre: '🤍 Elegante boda',
      desc: 'Rosa suave, dos piezas lado a lado. Fino y romántico.',
      tema: 'rosa', rejilla: 'r2b', formato: 'a4v', adornos: SUAVE },
    { id: 'minimal', cat: 'Elegante y eventos', nombre: '◻️ Minimal blanco',
      desc: 'Limpio, sin adornos, negro sobre blanco. Muy pro.',
      tema: 'minimal', rejilla: 'r4a', formato: 'a4v', adornos: LIMPIO },
    { id: 'corporativo', cat: 'Elegante y eventos', nombre: '💼 Corporativo',
      desc: 'Azul serio, seis cuadros. Para empresa y servicios.',
      tema: 'corporativo', rejilla: 'r6a', formato: 'a4v', adornos: IMPRESO },
    { id: 'botanico', cat: 'Elegante y eventos', nombre: '🌿 Verde natural',
      desc: 'Botánico, seis cuadros. Bienestar, spa, ecológico.',
      tema: 'botanico', rejilla: 'r6a', formato: 'a4v', adornos: TODO },

    /* ── Escaparate (con jerarquía) ── */
    { id: 'escaparate', cat: 'Escaparate', nombre: '🛍️ Escaparate',
      desc: 'Lo caro grande arriba, las ofertas pequeñas abajo.',
      tema: 'oro_negro', rejilla: 'r6b', formato: 'a4v', adornos: TODO },
    { id: 'lookbook', cat: 'Escaparate', nombre: '📖 Lookbook',
      desc: 'Ocho piezas con jerarquía, estilo catálogo de moda.',
      tema: 'burdeos', rejilla: 'r8b', formato: 'a4v', adornos: TODO }
  ];

  var PORID = {};
  DISENOS.forEach(function (d) { PORID[d.id] = d; });

  function grupos() {
    var vistos = {}, orden = [];
    DISENOS.forEach(function (d) { if (!vistos[d.cat]) { vistos[d.cat] = true; orden.push(d.cat); } });
    return orden;
  }

  window.FOLLETO_DISENOS = {
    lista: function () { return DISENOS.slice(); },
    grupos: grupos,
    get: function (id) { return PORID[id] || null; }
  };
})();

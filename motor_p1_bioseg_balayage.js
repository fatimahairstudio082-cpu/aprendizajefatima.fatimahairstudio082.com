/**
 * ═══════════════════════════════════════════════════════════════
 *  MOTOR DE CONOCIMIENTO — ACADEMIA FÁTIMA CALDERA
 *  Parte 1 / 3 — Firebase Loader + Categorías 1–8
 *  Categorías: Bioseguridad · Herramientas · Divisiones · Lavado
 *              Tinte · Mechas · Balayage
 *
 *  CÓMO USAR ESTE ARCHIVO:
 *  1. Sube este archivo al repo GitHub como:
 *     motor_conocimiento_p1.js
 *  2. En fatima_peluqueria.html, dentro del <head>, agrega
 *     ANTES del <script> principal:
 *     <script src="motor_conocimiento_p1.js"></script>
 *     <script src="motor_conocimiento_p2.js"></script>
 *     <script src="motor_conocimiento_p3.js"></script>
 *  3. Al final del <script> principal, busca:
 *         const CONOCIMIENTO = { ... };
 *     y COMENTA toda esa línea (no la borres aún).
 *     El sistema usará window.CONOCIMIENTO automáticamente.
 *
 *  FIREBASE STORAGE — RUTA DE ARCHIVOS:
 *  academia/{cat_slug}/{clase_id}/imagen.jpg
 *  academia/{cat_slug}/{clase_id}/video.mp4
 *  Ejemplo: academia/bioseguridad/bio_p01/imagen.jpg
 * ═══════════════════════════════════════════════════════════════
 */

// ── FIREBASE MEDIA LOADER ────────────────────────────────────
// Carga dinámica de imagen y video desde Firebase Storage.
// Se inyecta sobre la función inyectar() EXISTENTE, sin tocarla.
// ─────────────────────────────────────────────────────────────
window.FirebaseMediaLoader = {

  /** Bucket de Storage del proyecto aprendisajefatima */
  BUCKET: 'aprendisajefatima.appspot.com',

  /** URL base pública de Firebase Storage */
  buildURL(catSlug, claseId, archivo) {
    const path = encodeURIComponent(
      `academia/${catSlug}/${claseId}/${archivo}`
    );
    return `https://firebasestorage.googleapis.com/v0/b/${this.BUCKET}/o/${path}?alt=media`;
  },

  /** Convierte nombre de categoría a slug válido para Storage.
   *  Ej: "🛡️ Bioseguridad" → "bioseguridad" */
  catToSlug(cat) {
    return cat
      .replace(/[^\w\s]/g, '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '_');
  },

  /** Intenta cargar imagen desde Storage.
   *  Si falla, usa la URL de respaldo (Unsplash) del objeto de clase. */
  cargarImagen(catSlug, claseId, fallbackImg, imgEl) {
    if (!imgEl) return;
    const urlJpg  = this.buildURL(catSlug, claseId, 'imagen.jpg');
    const urlWebp = this.buildURL(catSlug, claseId, 'imagen.webp');
    const t1 = new Image();
    t1.onload  = () => { imgEl.src = urlJpg; };
    t1.onerror = () => {
      const t2 = new Image();
      t2.onload  = () => { imgEl.src = urlWebp; };
      t2.onerror = () => { if (fallbackImg) imgEl.src = fallbackImg; };
      t2.src = urlWebp;
    };
    t1.src = urlJpg;
  },

  /** Resuelve la URL de video: manual primero, Storage segundo.
   *  Devuelve null si no hay nada. */
  async resolverVideo(catSlug, claseId, videoUrlManual) {
    if (videoUrlManual && videoUrlManual.trim()) return videoUrlManual.trim();
    const urlMp4 = this.buildURL(catSlug, claseId, 'video.mp4');
    try {
      const res = await fetch(urlMp4, { method: 'HEAD' });
      if (res.ok) return urlMp4;
    } catch (_) {}
    return null;
  }
};

// ── PATCH DE inyectar() ──────────────────────────────────────
// Se envuelve la función original para añadir carga de media
// dinámica desde Firebase. NO modifica ninguna línea existente.
// ─────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const esperarInyectar = () => {
    if (typeof window.inyectar !== 'function') {
      setTimeout(esperarInyectar, 120);
      return;
    }

    const _orig = window.inyectar.bind(window);
    window.inyectar = function (id) {
      _orig(id); // ejecuta la lógica original completa

      const c = (window.FLAT || []).find(x => x.id === id);
      if (!c) return;

      const loader = window.FirebaseMediaLoader;
      const slug   = loader.catToSlug(c.cat || '');

      // Imagen en thumbnail del video de apoyo (panel izquierdo)
      loader.cargarImagen(slug, id, c.img, document.getElementById('vap-thumb'));

      // Video: resolver y mostrar/ocultar botón play
      loader.resolverVideo(slug, id, c.videoUrl || '').then(url => {
        window._resolvedVideoUrl = url;
        const play   = document.getElementById('vap-play');
        const nourl  = document.getElementById('vap-nourl');
        if (url) {
          if (play)  play.style.display  = 'flex';
          if (nourl) nourl.style.display = 'none';
        } else {
          if (play)  play.style.display  = 'none';
          if (nourl) nourl.style.display = 'flex';
        }
      });
    };

    // Patch de playVideoApoyo para usar URL resuelta por Firebase
    if (typeof window.playVideoApoyo === 'function') {
      const _origPlay = window.playVideoApoyo.bind(window);
      window.playVideoApoyo = function () {
        const url = window._resolvedVideoUrl;
        if (!url) return;
        const c = (window.FLAT || []).find(x => x.id === window.CLASE_ACTIVA);
        if (c) {
          const prev = c.videoUrl;
          c.videoUrl = url;
          _origPlay();
          c.videoUrl = prev;
        }
      };
    }
  };
  esperarInyectar();
});

// ── BLOQUE DE CONOCIMIENTO — PARTE 1 ────────────────────────
// Se fusiona con el objeto CONOCIMIENTO existente.
// Las clases del archivo original se conservan intactas.
// Aquí solo se AGREGAN categorías y clases nuevas.
// ─────────────────────────────────────────────────────────────
window.CONOCIMIENTO_P1 = {

// ════════════════════════════════════════════════════════
"🛡️ Bioseguridad": [
  // ── PRINCIPIANTE ──
  {id:"bio_p01",n:"¿Qué es la Bioseguridad en Peluquería?",niv:"p",dur:"8 min",
   img:"https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800",videoUrl:"",
   tools:["Guantes nitrilo","Mascarilla","Alcohol 70%"],
   vt:"Fundamentos de Bioseguridad",vds:"Concepto base y por qué es obligatoria en cada servicio.",
   txt:`<div class="importante">📌 La bioseguridad protege al cliente y al profesional de contagios, infecciones y reacciones adversas.</div>
<div class="punto"><span class="punto-num">1</span><span>Antes de tocar cualquier cabello: evaluación visual del cuero cabelludo y la fibra.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Identifica: caspa, seborrea, hongos, heridas o irritaciones activas.</span></div>
<div class="tip">✅ Regla de oro: <strong>si hay duda, hay guante</strong>. Siempre.</div>`},

  {id:"bio_p02",n:"EPP Básico — Los 4 Elementos Obligatorios",niv:"p",dur:"6 min",
   img:"https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800",videoUrl:"",
   tools:["Guantes nitrilo","Mascarilla","Delantal","Zapato cerrado"],
   vt:"Equipo de Protección Personal",vds:"Los 4 elementos mínimos de protección en el salón.",
   txt:`<div class="punto"><span class="punto-num">1</span><span><strong>Guantes:</strong> en todo proceso químico. Nitrilo si hay alergia al látex.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Mascarilla:</strong> obligatoria con decolorantes y queratinas — vapores tóxicos.</span></div>
<div class="punto"><span class="punto-num">3</span><span><strong>Delantal:</strong> protección de ropa y piel del tronco ante derrames.</span></div>
<div class="alerta">⚠️ El zapato cerrado evita quemaduras por derrame de productos químicos.</div>`},

  {id:"bio_p03",n:"Prueba de Mechón — Paso a Paso",niv:"p",dur:"10 min",
   img:"https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800",videoUrl:"",
   tools:["Mechón de prueba","Producto seleccionado","Agua","Champú"],
   vt:"Test de Mechón Obligatorio",vds:"Procedimiento completo antes de cualquier proceso químico.",
   txt:`<div class="importante">📌 La prueba de mechón es <strong>OBLIGATORIA</strong> siempre. No importa cuántas veces hayas atendido al cliente.</div>
<div class="punto"><span class="punto-num">1</span><span>Toma un mechón pequeño de la nuca — zona menos visible.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Aplica el producto exacto que usarás en dosis real.</span></div>
<div class="punto"><span class="punto-num">3</span><span>Evalúa: pigmentación, resistencia, elasticidad, olor, tonalidad resultante.</span></div>
<div class="punto"><span class="punto-num">4</span><span>Si hay ardor, picazón o enrojecimiento: retira inmediatamente con agua.</span></div>
<div class="alerta">⚠️ Un producto "natural" también puede causar reacción. La prueba es siempre obligatoria.</div>`},

  {id:"bio_p04",n:"Desinfección Básica de Herramientas",niv:"p",dur:"8 min",
   img:"https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800",videoUrl:"",
   tools:["Alcohol 70%","Vinagre blanco","Paño limpio","Recipiente plástico"],
   vt:"Limpieza Básica entre Clientes",vds:"Protocolo mínimo que previene el 80% de contagios cruzados.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Retira el cabello visible de peines, cepillos y tijeras después de cada cliente.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Sumerge en solución agua + vinagre blanco (50/50) durante 20 minutos.</span></div>
<div class="punto"><span class="punto-num">3</span><span>Enjuaga, seca con paño limpio y aplica alcohol 70% al final.</span></div>
<div class="tip">✅ Este proceso entre cliente y cliente previene el <strong>80% de contagios cruzados</strong>.</div>`},

  {id:"bio_p05",n:"Identificación de Hongos Capilares",niv:"p",dur:"12 min",
   img:"https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800",videoUrl:"",
   tools:["Guantes","Ficha de cliente"],
   vt:"Detección Visual de Hongos",vds:"Señales visuales y olfativas antes de comenzar el servicio.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Señales visuales: cuero cabelludo escamoso con placas blancas o amarillentas.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Señal olfativa: olor particular diferente al cabello sano, aunque esté recién lavado.</span></div>
<div class="punto"><span class="punto-num">3</span><span>Nunca rechaces al cliente. Atiéndelo con guantes y profesionalismo.</span></div>
<div class="alerta">⚠️ Deriva siempre a <strong>dermatólogo</strong>. El peluquero no diagnostica ni trata enfermedades.</div>
<div class="tip">✅ Cubo post-cliente especial: <strong>vinagre + limón + jabón + cloro</strong>. Eficaz y económico.</div>`},

  // ── INTERMEDIO ──
  {id:"bio_i01",n:"Control de Hongos — Soluciones Naturales Validadas",niv:"i",dur:"15 min",
   img:"https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800",videoUrl:"",
   tools:["Jabón azul Llaves","Vinagre de manzana","Clavo de olor","Limón"],
   vt:"Protocolo Antifúngico Natural",vds:"Fórmulas naturales de 19 años de práctica real como complemento al dermatólogo.",
   txt:`<div class="importante">📌 Estas son medidas de apoyo complementario — <strong>no reemplazan al dermatólogo</strong>.</div>
<div class="punto"><span class="punto-num">1</span><span><strong>Fórmula 1:</strong> Jabón azul Llaves + vinagre de manzana (1cc) + agua tibia. 15-20 min, 10 días.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Fórmula 2:</strong> Infusión de clavo de olor + unas gotas de limón. Último enjuague.</span></div>
<div class="alerta">⚠️ Prueba de alergia antes. El clavo puede irritar cueros sensibles.</div>`},

  {id:"bio_i02",n:"Ficha de Cliente y Consentimiento Informado",niv:"i",dur:"10 min",
   img:"https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800",videoUrl:"",
   tools:["Ficha impresa","Bolígrafo","Carpeta"],
   vt:"Documentación Profesional",vds:"Por qué y cómo documentar cada servicio para protección legal.",
   txt:`<div class="importante">📌 Una ficha de cliente bien hecha te protege legalmente ante cualquier reclamo.</div>
<div class="punto"><span class="punto-num">1</span><span>Incluir: tipo de cabello, historial de procesos, alergias, medicamentos actuales.</span></div>
<div class="punto"><span class="punto-num">2</span><span>El cliente firma que entiende el procedimiento y los riesgos informados.</span></div>
<div class="tip">✅ La ficha del cliente es tu <strong>seguro profesional</strong>. Guardar mínimo 2 años.</div>`},

  {id:"bio_i03",n:"Embarazo y Procesos Químicos — Protocolo Completo",niv:"i",dur:"12 min",
   img:"https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800",videoUrl:"",
   tools:["Ficha cliente","Tratamientos libres de químicos"],
   vt:"Contraindicaciones en Embarazo",vds:"Qué se puede y qué está absolutamente prohibido en embarazadas.",
   txt:`<div class="alerta">🚨 REGLA ABSOLUTA: En embarazo, <strong>NINGÚN proceso químico</strong>. Sin excepciones.</div>
<div class="punto"><span class="punto-num">1</span><span>Prohibido: tinte, decoloración, mechas, balayage, queratina, alisado, permanente.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Permitido: lavado, corte, hidratación 100% natural, peinado, secado.</span></div>
<div class="importante">📌 Hidratación permitida: aloe vera puro + aceite de argán sin perfumes artificiales.</div>`},

  {id:"bio_i04",n:"Ventilación y Ambiente del Salón",niv:"i",dur:"8 min",
   img:"https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800",videoUrl:"",
   tools:["Ventilador","Extractor","Mascarilla FFP2"],
   vt:"Control Ambiental del Salón",vds:"Cómo proteger tu salud respiratoria a largo plazo.",
   txt:`<div class="importante">📌 Los peluqueros con más de 10 años tienen mayor riesgo de daño respiratorio por vapores acumulados.</div>
<div class="punto"><span class="punto-num">1</span><span>Ventilación cruzada obligatoria durante queratinas y decoloraciones.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Mascarilla FFP2 para procesos con polvo decolorante y queratinas con formol.</span></div>
<div class="tip">✅ Tu salud es tu herramienta de trabajo. Protégela igual que proteges al cliente.</div>`},

  {id:"bio_i05",n:"Alergias Químicas — Reconocimiento y Actuación",niv:"i",dur:"14 min",
   img:"https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800",videoUrl:"",
   tools:["Agua fría","Champú neutro","Contacto médico"],
   vt:"Manejo de Reacciones Alérgicas",vds:"Protocolo de actuación ante una reacción en cabina.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Señales: picazón inmediata, enrojecimiento del cuero cabelludo, ardor intenso.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Retirar el producto de inmediato con agua fría abundante. No usar calor.</span></div>
<div class="punto"><span class="punto-num">3</span><span>Lavar con champú neutro. Agua fría durante mínimo 15 minutos.</span></div>
<div class="alerta">⚠️ Si hay hinchazón en cara o cuello: <strong>emergencia médica. Llama al 112</strong>.</div>`},

  // ── AVANZADO ──
  {id:"bio_a01",n:"Protocolos de Bioseguridad Nivel Clínico",niv:"a",dur:"20 min",
   img:"https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800",videoUrl:"",
   tools:["Autoclave portátil","Lámpara UV-C","Registro de esterilización"],
   vt:"Esterilización Nivel Clínico",vds:"Estándares de salones de alta gama y protocolo médico-estético.",
   txt:`<div class="importante">📌 Los salones premium aplican protocolos equivalentes a los de clínicas estéticas.</div>
<div class="punto"><span class="punto-num">1</span><span><strong>Autoclave portátil:</strong> esterilización total de tijeras y herramientas metálicas.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Lámpara UV-C:</strong> desinfección del ambiente entre clientes.</span></div>
<div class="punto"><span class="punto-num">3</span><span>Registro escrito de cada ciclo: fecha, hora, herramientas esterilizadas.</span></div>
<div class="tip">✅ El nivel clínico no es solo higiene — es diferenciación de marca y argumento comercial.</div>`},

  {id:"bio_a02",n:"Dermatitis de Contacto Ocupacional",niv:"a",dur:"18 min",
   img:"https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800",videoUrl:"",
   tools:["Guantes doble capa","Crema barrera","Ficha médica"],
   vt:"Protección de Manos Profesional",vds:"La enfermedad laboral más común del peluquero avanzado.",
   txt:`<div class="alerta">🚨 La dermatitis de contacto afecta al <strong>40% de peluqueros</strong> con más de 5 años de carrera.</div>
<div class="punto"><span class="punto-num">1</span><span>Causas: exposición repetida a persulfatos (decolorante), PPD (tinte) y formaldehído (queratinas).</span></div>
<div class="punto"><span class="punto-num">2</span><span>Prevención: crema barrera antes de cada servicio, guantes siempre, hidratación post-jornada.</span></div>
<div class="importante">📌 Si aparece eccema persistente: consultar alergólogo. Puede implicar reconversión profesional.</div>`},

  {id:"bio_a03",n:"Auditoría de Bioseguridad del Salón",niv:"a",dur:"15 min",
   img:"https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800",videoUrl:"",
   tools:["Check-list de auditoría","Cámara","Carpeta de protocolos"],
   vt:"Autoevaluación del Salón",vds:"Cómo auditar tu espacio como lo haría Sanidad.",
   txt:`<div class="importante">📌 Una auditoría interna trimestral previene sanciones y detecta riesgos antes de que ocurran.</div>
<div class="punto"><span class="punto-num">1</span><span>Revisar: fechas de caducidad de todos los productos en uso.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Verificar: stock de EPP suficiente para 30 días de trabajo.</span></div>
<div class="punto"><span class="punto-num">3</span><span>Comprobar: protocolos escritos visibles y accesibles para todo el equipo.</span></div>
<div class="tip">✅ Un salón auditado inspira <strong>confianza real</strong> al cliente desde el primer momento.</div>`}
],

// ════════════════════════════════════════════════════════
"✂️ Herramientas": [
  {id:"her_p01",n:"Guía de Peines — Cuándo Usar Cada Uno",niv:"p",dur:"10 min",
   img:"https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800",videoUrl:"",
   tools:["Peine fino","Peine cola","Peine dientes anchos","Peine afro"],
   vt:"Tipos de Peines Profesionales",vds:"Selección correcta de peine según técnica y textura capilar.",
   txt:`<div class="punto"><span class="punto-num">1</span><span><strong>Peine fino (aguja):</strong> divisiones precisas para colorimetría y mechas.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Peine cola:</strong> seccionar, hacer fila, acabados.</span></div>
<div class="punto"><span class="punto-num">3</span><span><strong>Dientes anchos:</strong> cabello rizado, hidrataciones, desenredo sin daño.</span></div>
<div class="punto"><span class="punto-num">4</span><span><strong>Peine afro:</strong> cabello muy rizado o con permanente.</span></div>
<div class="tip">✅ Un peine con dientes rotos <strong>parte el cabello</strong>. Revisa tus peines mensualmente.</div>`},

  {id:"her_p02",n:"Tipos de Cepillos y Su Uso Correcto",niv:"p",dur:"10 min",
   img:"https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800",videoUrl:"",
   tools:["Cepillo redondo","Cepillo paleta","Cepillo neumático"],
   vt:"Cepillos Profesionales",vds:"Cuándo y cómo usar cada cepillo en el servicio.",
   txt:`<div class="punto"><span class="punto-num">1</span><span><strong>Cepillo redondo:</strong> secado con volumen y definición de ondas simultáneamente.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Cepillo paleta:</strong> alisado, secado rápido de grandes secciones.</span></div>
<div class="punto"><span class="punto-num">3</span><span><strong>Cepillo neumático (ventilado):</strong> secado veloz sin tensión excesiva en la raíz.</span></div>
<div class="alerta">⚠️ Nunca el mismo cepillo para desenredar que para secar — acumula bacterias y sebo.</div>`},

  {id:"her_p03",n:"Tijeras — Tipos y Función de Cada Una",niv:"p",dur:"8 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Tijera recta","Tijera entresacar","Navaja"],
   vt:"Tijeras de Peluquería",vds:"Diferencias entre tijera recta, entresacar y navaja.",
   txt:`<div class="punto"><span class="punto-num">1</span><span><strong>Tijera recta:</strong> todos los cortes base — recto, capas, degradado.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Tijera de entresacar:</strong> reduce volumen sin acortar longitud.</span></div>
<div class="punto"><span class="punto-num">3</span><span><strong>Navaja:</strong> texturizado y movimiento. Solo en cabello liso y mojado.</span></div>
<div class="alerta">⚠️ Navaja en cabello rizado = frizz masivo garantizado. Solo para cabello liso.</div>`},

  {id:"her_p04",n:"Secador — Temperaturas, Boquillas y Difusor",niv:"p",dur:"10 min",
   img:"https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=800",videoUrl:"",
   tools:["Secador profesional","Boquilla concentradora","Difusor"],
   vt:"Control del Secador",vds:"Potencia, temperatura y accesorios según tipo de cabello.",
   txt:`<div class="punto"><span class="punto-num">1</span><span><strong>Boquilla concentradora:</strong> dirige el flujo de aire para alisar sin abrir la cutícula.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Difusor:</strong> cabello rizado — distribuye el aire sin romper la onda.</span></div>
<div class="punto"><span class="punto-num">3</span><span>Finalizar siempre con el <strong>botón de frío</strong> para sellar la cutícula y dar brillo.</span></div>
<div class="tip">✅ El botón de frío al final da el <strong>brillo y la duración</strong> del peinado.</div>`},

  {id:"her_p05",n:"Mantenimiento Básico de Herramientas",niv:"p",dur:"8 min",
   img:"https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800",videoUrl:"",
   tools:["Aceite de tijeras","Paño de microfibra"],
   vt:"Cuidado de Herramientas",vds:"Cómo extender la vida útil de tu inversión profesional.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Una gota de aceite en el tornillo de las tijeras cada semana de uso intensivo.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Limpiar la plancha y el rizador con paño húmedo en frío, nunca con abrasivos.</span></div>
<div class="tip">✅ Tijeras bien mantenidas duran <strong>10-15 años</strong>. Mal mantenidas, 2 años.</div>`},

  {id:"her_i01",n:"Planchas — Temperatura por Tipo de Cabello",niv:"i",dur:"12 min",
   img:"https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=800",videoUrl:"",
   tools:["Plancha BaByliss","Plancha Remington","Termómetro infrarrojo"],
   vt:"Control Térmico de Planchas",vds:"Temperatura óptima según porosidad y grosor capilar.",
   txt:`<div class="importante">📌 La temperatura incorrecta es la causa número 1 de daño capilar irreversible por plancha.</div>
<div class="punto"><span class="punto-num">1</span><span><strong>Cabello fino y delicado:</strong> 160-180°C. BaByliss: 300-330°F.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Cabello normal:</strong> 185-200°C. Remington: 350°F.</span></div>
<div class="punto"><span class="punto-num">3</span><span><strong>Cabello grueso y resistente:</strong> 210-230°C máximo.</span></div>
<div class="alerta">⚠️ Cabello con decoloración: nunca superar <strong>180°C</strong> — la cutícula ya está abierta.</div>`},

  {id:"her_i02",n:"Papel de Aluminio vs Plantillas — Diferencias Técnicas",niv:"i",dur:"12 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Papel de aluminio","Plantillas plásticas","Papel especial de mechas","Bowl"],
   vt:"Materiales de Aplicación",vds:"Cuándo usar cada material y cómo afecta el resultado.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>El aluminio y las plantillas <strong>absorben peróxido y polvo decolorante</strong> — la mezcla pierde consistencia.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Por esto: prepara mezcla nueva cada <strong>15 minutos máximo</strong> en trabajos largos.</span></div>
<div class="tip">✅ Para trabajos de más de 2 horas: divide la preparación en <strong>bloques de mezcla</strong>.</div>`},

  {id:"her_i03",n:"Rizadores — Selección de Diámetro",niv:"i",dur:"10 min",
   img:"https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=800",videoUrl:"",
   tools:["Rizador 19mm","Rizador 25mm","Rizador 32mm","Rizador 38mm"],
   vt:"Diámetros de Rizador",vds:"Qué bucle produce cada tamaño de barril.",
   txt:`<div class="punto"><span class="punto-num">1</span><span><strong>19mm:</strong> bucles muy cerrados, rizo definido.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>25mm:</strong> onda clásica — el más versátil para todos los tipos de cabello.</span></div>
<div class="punto"><span class="punto-num">3</span><span><strong>32-38mm:</strong> ondas suaves, efecto beach wave natural.</span></div>
<div class="tip">✅ Cabello fino + barril grande → ondas más definidas. Cabello grueso + barril pequeño → el rizo se relaja antes.</div>`},

  {id:"her_i04",n:"Pinceles para Colorimetría — Selección Correcta",niv:"i",dur:"8 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Pincel plano ancho","Pincel de balayage","Pincel fino","Bowl inox"],
   vt:"Pinceles de Color",vds:"El pincel correcto determina la precisión del resultado.",
   txt:`<div class="punto"><span class="punto-num">1</span><span><strong>Pincel plano ancho:</strong> mechas en aluminio, aplicación uniforme de tinte.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Pincel de balayage (espátula):</strong> degradados libres, técnica pintura.</span></div>
<div class="punto"><span class="punto-num">3</span><span><strong>Pincel fino:</strong> raíz, retoques, correcciones puntuales.</span></div>
<div class="importante">📌 Limpia el pincel entre secciones — no contaminar la mezcla con producto anterior.</div>`},

  {id:"her_i05",n:"Organización de la Estación de Trabajo",niv:"i",dur:"10 min",
   img:"https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800",videoUrl:"",
   tools:["Carrito peluquero","Organizadores","Etiquetas"],
   vt:"Ergonomía y Eficiencia",vds:"Cómo organizar tu estación para trabajar el doble de rápido.",
   txt:`<div class="importante">📌 Un profesional desorganizado pierde entre 30 y 45 minutos por jornada buscando herramientas.</div>
<div class="punto"><span class="punto-num">1</span><span>Organiza por uso: izquierda (herramientas activas), derecha (productos), abajo (stock).</span></div>
<div class="punto"><span class="punto-num">2</span><span>Todo lo que usas más de 10 veces al día debe estar a menos de <strong>30cm de tu mano dominante</strong>.</span></div>
<div class="tip">✅ Una estación organizada transmite <strong>profesionalismo visual</strong> al cliente desde que entra.</div>`},

  {id:"her_a01",n:"Tijeras Premium — Acero Japonés vs Alemán",niv:"a",dur:"15 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Tijera Kasho","Tijera Jaguar","Piedra de afilar japonesa"],
   vt:"Metalurgia de Tijeras Profesionales",vds:"Por qué el acero cambia el resultado del corte.",
   txt:`<div class="importante">📌 Una tijera de acero japonés VG-10 puede triplicar el precio de una alemana, pero dura 5 veces más afilada.</div>
<div class="punto"><span class="punto-num">1</span><span><strong>Acero japonés:</strong> más duro, filo microscópico, corte quirúrgico. Requiere afilado especializado.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Acero alemán:</strong> más resistente a impactos, más fácil de afilar, más económico a largo plazo.</span></div>
<div class="tip">✅ Inversión nivel avanzado: <strong>una tijera japonesa + una alemana de respaldo</strong>.</div>`},

  {id:"her_a02",n:"Planchas — Titanio vs Cerámica vs Turmalina",niv:"a",dur:"12 min",
   img:"https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=800",videoUrl:"",
   tools:["Plancha titanio","Plancha cerámica","Plancha turmalina"],
   vt:"Tecnología de Planchas Premium",vds:"Diferencias reales de resultado según material.",
   txt:`<div class="punto"><span class="punto-num">1</span><span><strong>Cerámica:</strong> calor uniforme, ideal para cabello fino. No para uso extremo diario.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Titanio:</strong> calienta 5× más rápido. Para cabello grueso y resistente.</span></div>
<div class="punto"><span class="punto-num">3</span><span><strong>Turmalina:</strong> emite iones negativos, reduce frizz. Ideal post-queratina.</span></div>
<div class="importante">📌 Un salón profesional tiene <strong>al menos 2 tipos diferentes</strong> para distintos clientes.</div>`},

  {id:"her_a03",n:"Auditoría de Herramientas — Cuándo Reemplazar",niv:"a",dur:"10 min",
   img:"https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800",videoUrl:"",
   tools:["Lista de inventario","Presupuesto anual"],
   vt:"Gestión de Herramientas",vds:"Cuándo reemplazar y cómo calcular el costo real por herramienta.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Tijeras: reemplazar cuando el filo no se recupera con afilado profesional.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Planchas: reemplazar al detectar puntos calientes (temperatura irregular).</span></div>
<div class="punto"><span class="punto-num">3</span><span>Secadores: reemplazar al primer olor a quemado o pérdida de potencia notable.</span></div>
<div class="tip">✅ Presupuesto recomendado: <strong>10% de ingresos anuales</strong> para renovación de herramientas.</div>`}
],

// ════════════════════════════════════════════════════════
"📐 Divisiones": [
  {id:"div_p01",n:"Qué es una División Capilar y Por Qué Importa",niv:"p",dur:"8 min",
   img:"https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800",videoUrl:"",
   tools:["Peine de aguja","Pinzas mariposa"],
   vt:"Fundamento de la División",vds:"Por qué toda técnica profesional comienza con una buena división.",
   txt:`<div class="importante">📌 La división capilar es el <strong>primer paso de toda técnica profesional</strong>. Sin ella, nada funciona bien.</div>
<div class="punto"><span class="punto-num">1</span><span>Una división limpia y precisa da mechas uniformes, tinte parejo, corte simétrico.</span></div>
<div class="punto"><span class="punto-num">2</span><span>El peine de aguja (cola fina) es la herramienta correcta para hacer divisiones.</span></div>
<div class="tip">✅ Practica las divisiones en seco antes de practicar con producto.</div>`},

  {id:"div_p02",n:"División por Volumen Capilar — Cálculo de Producto",niv:"p",dur:"15 min",
   img:"https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800",videoUrl:"",
   tools:["Peineta","Pinzas","Báscula"],
   vt:"Matemática del Volumen Capilar",vds:"Cálculo de producto según gramos de cabello.",
   txt:`<div class="importante">📌 Identificar el volumen del cabello es el <strong>paso previo a cualquier cálculo de producto</strong>.</div>
<div class="punto"><span class="punto-num">1</span><span><strong>100g:</strong> cabello corto — una sesión de mechas.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>200-300g:</strong> cabello mediano — planificación en secciones.</span></div>
<div class="punto"><span class="punto-num">3</span><span><strong>400-600g:</strong> cabello largo y abundante — sesión de 2-3 horas.</span></div>
<div class="tip">✅ 100g → <strong>60g polvo decolorante + 200ml peróxido 30v</strong> para mechas con aluminio.</div>`},

  {id:"div_p03",n:"División Horizontal — Técnica Base",niv:"p",dur:"12 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Peine de aguja","Pinzas mariposa"],
   vt:"División Horizontal",vds:"La división más fundamental del oficio profesional.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Comienza desde la nuca con una línea horizontal perfecta de oreja a oreja.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Sube capas de <strong>1cm (un dedo)</strong> hacia arriba, asegurando con pinza.</span></div>
<div class="punto"><span class="punto-num">3</span><span>Trabaja siempre de abajo hacia arriba — la capa inferior primero.</span></div>
<div class="tip">✅ La constancia de 1cm por capa garantiza mechas uniformes y tinte parejo.</div>`},

  {id:"div_p04",n:"División Vertical y Diagonal",niv:"p",dur:"10 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Peine de aguja","Pinzas"],
   vt:"Divisiones Verticales y Diagonales",vds:"Cuándo y cómo usar cada tipo según la técnica.",
   txt:`<div class="punto"><span class="punto-num">1</span><span><strong>Vertical:</strong> mechas de colores alternos o efectos de líneas.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Diagonal adelante:</strong> enmarca el rostro, ideal para balayage frontal.</span></div>
<div class="punto"><span class="punto-num">3</span><span><strong>Diagonal atrás:</strong> crea movimiento natural en la parte posterior.</span></div>
<div class="importante">📌 La diagonal es la división más usada en balayage y mechas de efectos naturales.</div>`},

  {id:"div_p05",n:"Guía de Pulgadas y Medidas Capilares",niv:"p",dur:"8 min",
   img:"https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800",videoUrl:"",
   tools:["Regla de pulgadas","Cinta métrica flexible"],
   vt:"Tabla de Medidas Capilares",vds:"Referencia estándar de longitudes en pulgadas.",
   txt:`<div class="punto"><span class="punto-num">1</span><span><strong>10 pulgadas (25cm):</strong> cabello corto, antes de los hombros.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>12 pulgadas (30cm):</strong> casi en los hombros.</span></div>
<div class="punto"><span class="punto-num">3</span><span><strong>15 pulgadas (38cm):</strong> más abajo de los hombros.</span></div>
<div class="punto"><span class="punto-num">4</span><span><strong>20 pulgadas (50cm):</strong> nivel del pecho.</span></div>
<div class="punto"><span class="punto-num">5</span><span><strong>30 pulgadas (76cm):</strong> cerca de la cintura / glúteo.</span></div>`},

  {id:"div_i01",n:"Mapa Completo de Zonas Capilares",niv:"i",dur:"18 min",
   img:"https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800",videoUrl:"",
   tools:["Peine de aguja","10+ pinzas mariposa"],
   vt:"Mapa de Zonas Capilares",vds:"Nuca, occipital, parietal, coronilla, franja frontal.",
   txt:`<div class="importante">📌 El cabello se divide en 5 zonas. Conocerlas cambia completamente tu trabajo.</div>
<div class="punto"><span class="punto-num">1</span><span><strong>Nuca:</strong> base. Primera zona en trabajar. Cabello más fino.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Occipital:</strong> parte posterior central. Más visible de espalda.</span></div>
<div class="punto"><span class="punto-num">3</span><span><strong>Parietales:</strong> laterales. Marco del rostro.</span></div>
<div class="punto"><span class="punto-num">4</span><span><strong>Coronilla:</strong> más expuesta al sol — puede estar más decolorada.</span></div>
<div class="punto"><span class="punto-num">5</span><span><strong>Franja frontal:</strong> lo más visible. Última en trabajar.</span></div>`},

  {id:"div_i02",n:"Planificación de Sesiones — 6 a 13 Secciones",niv:"i",dur:"15 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Peine de aguja","Pinzas mariposa"],
   vt:"Planificación de Secciones",vds:"Cómo planificar el trabajo en secciones según volumen.",
   txt:`<div class="punto"><span class="punto-num">1</span><span><strong>Cabello corto:</strong> 6-8 secciones totales son suficientes.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Cabello mediano:</strong> 8-10 secciones para control total.</span></div>
<div class="punto"><span class="punto-num">3</span><span><strong>Cabello largo:</strong> 10-13 secciones. Mayor tiempo y precisión.</span></div>
<div class="importante">📌 Cada sección es una unidad de trabajo independiente. No mezcles secciones.</div>`},

  {id:"div_i03",n:"Zigzag Profesional con Peine de Aguja",niv:"i",dur:"12 min",
   img:"https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800",videoUrl:"",
   tools:["Peine de aguja","Pinzas de clips"],
   vt:"Técnica de División en Zigzag",vds:"Por qué el zigzag da mechas más naturales que la línea recta.",
   txt:`<div class="importante">📌 El zigzag es la firma del colorista profesional. Crea mechas de aspecto más natural.</div>
<div class="punto"><span class="punto-num">1</span><span>Mueve el peine de aguja en 45° alternando derecha-izquierda mientras avanzas.</span></div>
<div class="punto"><span class="punto-num">2</span><span>La amplitud del zigzag determina el tamaño del mechón seleccionado.</span></div>
<div class="tip">✅ Más zigzag = mechones más pequeños = resultado más natural y difuminado.</div>`},

  {id:"div_i04",n:"División para Corrección de Color",niv:"i",dur:"15 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Peine aguja","Pinzas de clips","Papel aluminio","Pincel fino"],
   vt:"Secciones de Corrección",vds:"Cómo dividir para retocar color de manera quirúrgica.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>En correcciones, divide en zonas de <strong>problema específico</strong> — no en todo el cabello.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Aisla con aluminio las zonas que NO recibirán producto.</span></div>
<div class="importante">📌 Una corrección mal seccionada afecta zonas que no necesitan tratamiento.</div>`},

  {id:"div_i05",n:"División para Cabello Rizado",niv:"i",dur:"12 min",
   img:"https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",videoUrl:"",
   tools:["Peine dientes anchos","Clips de mariposa grandes"],
   vt:"Divisiones en Cabello con Textura",vds:"Adaptación de la técnica al cabello rizado.",
   txt:`<div class="importante">📌 En cabello rizado nunca uses peine fino. El diente ancho respeta la estructura de la onda.</div>
<div class="punto"><span class="punto-num">1</span><span>Divide en 4 cuadrantes principales con clips grandes.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Trabaja sección por sección con los dedos para no romper los rizos.</span></div>
<div class="tip">✅ El cabello rizado tiene más volumen aparente — trabaja con <strong>secciones más gruesas</strong> que en cabello liso.</div>`},

  {id:"div_a01",n:"División para Balayage — Sisa Triangular Avanzada",niv:"a",dur:"20 min",
   img:"https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800",videoUrl:"",
   tools:["Peine aguja","Pinzas de clips","Pincel de balayage"],
   vt:"Geometría del Balayage Libre",vds:"Formas triangulares y en V para máxima naturalidad.",
   txt:`<div class="importante">📌 En balayage avanzado, la división es intencional e irregular — no sigue reglas clásicas.</div>
<div class="punto"><span class="punto-num">1</span><span><strong>Sisa triangular:</strong> triángulos irregulares que imitan cómo el sol aclara el cabello naturalmente.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>División en V:</strong> amplía la zona de transición para degradados más suaves.</span></div>
<div class="tip">✅ La irregularidad controlada es lo que hace que un balayage parezca natural.</div>`},

  {id:"div_a02",n:"Mapa de Color — Planificación antes del Proceso",niv:"a",dur:"18 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Peine aguja","Clips de colores","Papel","Ficha técnica"],
   vt:"Planificación Avanzada de Color",vds:"Cómo diseñar el mapa de color antes de tocar el cabello.",
   txt:`<div class="importante">📌 Un colorista avanzado diseña el mapa completo en papel antes de comenzar. No improvisa.</div>
<div class="punto"><span class="punto-num">1</span><span>Dibuja un esquema de la cabeza con las zonas que recibirán cada color o técnica.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Asigna colores de clip por zona para no confundirte durante el proceso.</span></div>
<div class="tip">✅ 10 minutos de planificación ahorran 2 horas de corrección.</div>`},

  {id:"div_a03",n:"División para Color en Movimiento",niv:"a",dur:"15 min",
   img:"https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800",videoUrl:"",
   tools:["Peine aguja","Pincel ancho","Aluminio","Pincel fino"],
   vt:"Técnica de Color en Movimiento",vds:"Divisiones curvas para efecto de cabello siempre en movimiento.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>El color en movimiento requiere divisiones que siguen la <strong>dirección natural del cabello</strong>.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Usa divisiones curvas siguiendo el contorno del cráneo para máxima naturalidad.</span></div>
<div class="alerta">⚠️ Error común: divisiones rectas en técnicas de movimiento. El resultado se ve artificial y plano.</div>`}
],

// ════════════════════════════════════════════════════════
"💧 Lavado": [
  {id:"lav_p01",n:"Técnica Correcta de Lavado — Protocolo Base",niv:"p",dur:"12 min",
   img:"https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",videoUrl:"",
   tools:["Champú profesional","Enjuague","Toalla de microfibra"],
   vt:"Protocolo de Lavado Capilar",vds:"Técnica base de lavado para todos los tipos de cabello.",
   txt:`<div class="importante">📌 Un buen lavado es la base de <strong>todo procedimiento capilar</strong>. Si el lavado falla, todo falla.</div>
<div class="punto"><span class="punto-num">1</span><span>Siempre con la <strong>yema de los dedos</strong>, nunca con las uñas — lastiman el cuero cabelludo.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Frotar bien en la raíz, luego deslizar hacia las puntas siguiendo la dirección de la cutícula.</span></div>
<div class="punto"><span class="punto-num">3</span><span>Repetir hasta obtener espuma abundante y homogénea.</span></div>
<div class="punto"><span class="punto-num">4</span><span>Finalizar con un chorro de <strong>agua fría para cerrar la cutícula</strong> y dar brillo.</span></div>
<div class="tip">✅ Para enjuague en cabello graso: solo <strong>0.5cc a 1cc en las puntas</strong>. Nunca en la raíz.</div>`},

  {id:"lav_p02",n:"Selección de Champú por Tipo de Cabello",niv:"p",dur:"10 min",
   img:"https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",videoUrl:"",
   tools:["Champú normalizador","Champú hidratante","Champú sin sal"],
   vt:"Guía de Champús",vds:"El champú correcto potencia o arruina cualquier tratamiento.",
   txt:`<div class="punto"><span class="punto-num">1</span><span><strong>Cabello graso:</strong> champú normalizador o regulador sebáceo. Sin silicona en la fórmula.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Cabello reseco:</strong> champú hidratante con proteínas o keratina suave.</span></div>
<div class="punto"><span class="punto-num">3</span><span><strong>Post-proceso químico:</strong> champú sin sal para preservar el resultado.</span></div>
<div class="alerta">⚠️ El champú incorrecto puede destruir una queratina en el primer lavado.</div>`},

  {id:"lav_p03",n:"Temperatura del Agua — Por Qué Importa",niv:"p",dur:"6 min",
   img:"https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",videoUrl:"",
   tools:["Ducha de regadera profesional"],
   vt:"Control de Temperatura en el Lavado",vds:"Por qué la temperatura del agua cambia el resultado capilar.",
   txt:`<div class="punto"><span class="punto-num">1</span><span><strong>Agua tibia (35-38°C):</strong> abre la cutícula, permite que el champú penetre y limpie mejor.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Agua fría al final:</strong> cierra la cutícula, sella el brillo.</span></div>
<div class="alerta">⚠️ Agua muy caliente (más de 45°C) abre la cutícula en exceso y aumenta la porosidad.</div>`},

  {id:"lav_p04",n:"Masaje Capilar Terapéutico",niv:"p",dur:"8 min",
   img:"https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",videoUrl:"",
   tools:["Yemas de los dedos"],
   vt:"Masaje Capilar Profesional",vds:"El masaje que activa la circulación y fideliza clientes.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Iniciar en la nuca con movimientos circulares lentos. Subir hacia la coronilla.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Presión media constante — nunca presión fuerte que lastime el cuero cabelludo.</span></div>
<div class="punto"><span class="punto-num">3</span><span>El masaje activa la <strong>circulación sanguínea</strong> y favorece el crecimiento capilar.</span></div>
<div class="tip">✅ Un buen masaje en el lavado es uno de los factores que más <strong>fideliza al cliente</strong>.</div>`},

  {id:"lav_p05",n:"Secado con Toalla — Sin Daño",niv:"p",dur:"6 min",
   img:"https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",videoUrl:"",
   tools:["Toalla de microfibra"],
   vt:"Secado Pre-Profesional",vds:"Cómo secar el cabello con toalla sin causar frizz ni daño.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Nunca frotar el cabello con la toalla — levanta la cutícula y causa frizz masivo.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Técnica correcta: <strong>presionar y absorber</strong> suavemente de raíz a punta.</span></div>
<div class="punto"><span class="punto-num">3</span><span>Toalla de microfibra: absorbe 3× más agua con menos fricción que el algodón.</span></div>
<div class="tip">✅ El cabello húmedo es el más frágil. Trátalo con <strong>máximo cuidado</strong> en este momento.</div>`},

  {id:"lav_i01",n:"Lavado Pre-Queratina — Protocolo Completo",niv:"i",dur:"15 min",
   img:"https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=800",videoUrl:"",
   tools:["Champú clarificante","Agua tibia","Toalla seca"],
   vt:"Preparación Capilar para Queratina",vds:"Apertura máxima de cutícula para absorción óptima de queratina.",
   txt:`<div class="importante">📌 Para aplicar queratina la cutícula debe estar <strong>completamente abierta</strong>. El lavado lo logra.</div>
<div class="punto"><span class="punto-num">1</span><span>Usar champú clarificante para eliminar toda la silicona y build-up acumulado.</span></div>
<div class="punto"><span class="punto-num">2</span><span>En cabello muy graso: hasta <strong>10 lavadas intensivas</strong>.</span></div>
<div class="punto"><span class="punto-num">3</span><span>No usar acondicionador — cierra la cutícula y bloquea la absorción de la queratina.</span></div>
<div class="alerta">⚠️ Cabello sin lavar bien + queratina = resultado que dura 2 semanas en vez de 3-4 meses.</div>`},

  {id:"lav_i02",n:"Lavado Pre-Colorimetría",niv:"i",dur:"10 min",
   img:"https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",videoUrl:"",
   tools:["Champú suave","Toalla"],
   vt:"Preparación para Tinte o Decoloración",vds:"Cuándo lavar antes de teñir y cuándo no hacerlo.",
   txt:`<div class="importante">📌 Existe debate profesional: algunos tintes se aplican en cabello sucio para proteger el cuero cabelludo.</div>
<div class="punto"><span class="punto-num">1</span><span><strong>Cabello sucio:</strong> el sebo protege el cuero de irritación química.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Cabello limpio:</strong> el tinte agarra más uniformemente, especialmente en bases difíciles.</span></div>
<div class="tip">✅ Regla de Fátima: cuero cabelludo sensible → en cabello sucio. Base rebelde → lavar primero.</div>`},

  {id:"lav_i03",n:"Lavado con Hierbas e Infusiones Naturales",niv:"i",dur:"15 min",
   img:"https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800",videoUrl:"",
   tools:["Romero fresco","Manzanilla","Ortiga","Olla","Colador"],
   vt:"Enjuagues Capilares Naturales",vds:"Infusiones herbales como último enjuague terapéutico.",
   txt:`<div class="punto"><span class="punto-num">1</span><span><strong>Romero:</strong> activa la circulación, estimula el crecimiento. Infusión 20 min.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Manzanilla:</strong> suaviza y aclara ligeramente cabellos rubios.</span></div>
<div class="punto"><span class="punto-num">3</span><span><strong>Ortiga:</strong> regula el sebo en cuero cabelludo graso.</span></div>
<div class="importante">📌 Estas infusiones se usan como <strong>último enjuague</strong>, no como champú base.</div>`},

  {id:"lav_i04",n:"Doble Lavado — Cuándo y Cómo",niv:"i",dur:"8 min",
   img:"https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",videoUrl:"",
   tools:["Champú suave","Timer"],
   vt:"Técnica del Doble Lavado",vds:"El segundo lavado que elimina el build-up que el primero no pudo.",
   txt:`<div class="punto"><span class="punto-num">1</span><span><strong>Primer lavado:</strong> elimina suciedad superficial y sebo.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Segundo lavado:</strong> limpia a fondo — aquí sí aparece la espuma abundante.</span></div>
<div class="tip">✅ Si el primer lavado casi no genera espuma: el cabello tenía demasiado build-up. El doble lavado es necesario.</div>`},

  {id:"lav_i05",n:"Lavado Post-Colorimetría",niv:"i",dur:"10 min",
   img:"https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",videoUrl:"",
   tools:["Champú sin sal","Acondicionador post-color","Agua tibia-fría"],
   vt:"Cierre del Proceso de Color",vds:"El lavado final que determina la durabilidad del color.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Retirar el tinte con agua tibia hasta que salga completamente clara.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Champú sin sal suave para no abrir la cutícula recién tratada.</span></div>
<div class="punto"><span class="punto-num">3</span><span>Acondicionador post-color: cierra la cutícula y sella el pigmento.</span></div>
<div class="alerta">⚠️ Agua caliente al retirar el tinte abre la cutícula y el color se va en el primer lavado.</div>`},

  {id:"lav_a01",n:"pH del Cabello y Productos de Lavado",niv:"a",dur:"18 min",
   img:"https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",videoUrl:"",
   tools:["Tiras de pH","Champú ácido","Vinagre de manzana"],
   vt:"Química del pH Capilar",vds:"Por qué el pH lo cambia todo en el cuidado capilar.",
   txt:`<div class="importante">📌 El cabello sano tiene un pH de <strong>4.5 a 5.5</strong>. Todo proceso químico lo altera.</div>
<div class="punto"><span class="punto-num">1</span><span>Alcalizantes (decolorante, tinte) suben el pH a 9-10 — abren la cutícula para penetrar.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Acidificantes (vinagre, champú ácido) bajan el pH — cierran la cutícula y sellan el tratamiento.</span></div>
<div class="tip">✅ Enjuague final con 1cc de vinagre de manzana por litro de agua = cierre perfecto post-proceso.</div>`},

  {id:"lav_a02",n:"Micelares y Champús sin Surfactantes Agresivos",niv:"a",dur:"15 min",
   img:"https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",videoUrl:"",
   tools:["Champú micelar","pH metro"],
   vt:"Lavado de Baja Agresión",vds:"Para cabellos muy procesados que no toleran champús convencionales.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Los lauril sulfatos (SLS) son limpiadores muy agresivos — eliminan el sebo natural por completo.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Los micelares limpian con micelas que atraen la suciedad sin alterar el manto lípido.</span></div>
<div class="tip">✅ Para clientes con cabello muy procesado o sensible: recomendar champú micelar o co-wash.</div>`},

  {id:"lav_a03",n:"Programa de Lavado Personalizado para Clientes",niv:"a",dur:"20 min",
   img:"https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",videoUrl:"",
   tools:["Ficha de cliente","Productos seleccionados","Guía impresa"],
   vt:"Prescripción de Rutina de Lavado",vds:"Cómo diseñar y vender una rutina de lavado personalizada.",
   txt:`<div class="importante">📌 Prescribir una rutina de lavado es un servicio de valor agregado que genera fidelización y venta de retail.</div>
<div class="punto"><span class="punto-num">1</span><span>Analiza tipo de cabello, frecuencia de lavado actual y procesos químicos vigentes.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Diseña una rutina semanal: días de lavado, productos en orden, tiempo de enjuague.</span></div>
<div class="punto"><span class="punto-num">3</span><span>Entrégala impresa o por WhatsApp con los productos recomendados.</span></div>
<div class="tip">✅ Un cliente con rutina personalizada <strong>vuelve más seguido y gasta más</strong> en cada visita.</div>`}
],

// ════════════════════════════════════════════════════════
"🎨 Tinte": [
  {id:"tin_p01",n:"Qué es el Tinte — Tipos y Familias",niv:"p",dur:"12 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Catálogo de colores","Bowl","Peróxido"],
   vt:"Fundamentos del Tinte",vds:"Permanentes, semipermanentes y sin amoniaco — diferencias reales.",
   txt:`<div class="punto"><span class="punto-num">1</span><span><strong>Permanente:</strong> contiene amoniaco y peróxido. Abre la cutícula y deposita pigmento en la corteza. Dura 4-6 semanas.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Semipermanente:</strong> sin amoniaco, sin oxidación. Recubre la cutícula. Dura 2-4 lavados.</span></div>
<div class="punto"><span class="punto-num">3</span><span><strong>Sin amoniaco:</strong> pigmentación más suave. Para cabellos sensibles. Duración intermedia.</span></div>
<div class="importante">📌 Para cobertura de canas al 100% se necesita siempre tinte <strong>permanente con amoniaco</strong>.</div>`},

  {id:"tin_p02",n:"La Tabla de Colores — Cómo Leerla",niv:"p",dur:"14 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Tabla de colores","Catálogo de la marca"],
   vt:"Lectura de Tabla Cromática",vds:"El sistema numérico de colores que todo peluquero debe dominar.",
   txt:`<div class="importante">📌 Los tintes se leen en código numérico. Ejemplo: <strong>7.1 = Rubio Ceniza</strong>.</div>
<div class="punto"><span class="punto-num">1</span><span>El <strong>primer número</strong>: profundidad/base. 1=Negro · 3=Castaño oscuro · 6=Rubio oscuro · 9=Muy claro.</span></div>
<div class="punto"><span class="punto-num">2</span><span>El <strong>número tras el punto</strong>: reflejo. 0=Natural · 1=Ceniza · 3=Dorado · 4=Cobrizo · 5=Caoba.</span></div>
<div class="punto"><span class="punto-num">3</span><span>Ejemplo: <em>6.43</em> = Rubio oscuro cobrizo dorado.</span></div>
<div class="tip">✅ Memorizar la tabla de números es la base del colorista profesional.</div>`},

  {id:"tin_p03",n:"Identificación de la Base Natural del Cabello",niv:"p",dur:"15 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Tabla de bases","Muestras de cabello"],
   vt:"Identificación de Base Capilar",vds:"Cómo identificar la base real antes de aplicar cualquier color.",
   txt:`<div class="importante">📌 Antes de aplicar cualquier tinte, <strong>IDENTIFICA la base natural</strong>. Este paso lo determina todo.</div>
<div class="punto"><span class="punto-num">1</span><span>Observa en la nuca — es la zona más virgen y representa la base real.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Compara con tabla de bases: desde 1 (negro) hasta 10 (rubio platino).</span></div>
<div class="alerta">⚠️ Sin conocer la base real, puedes aplicar un tinte que no neutraliza y dejar un color no deseado.</div>`},

  {id:"tin_p04",n:"Peróxidos — Volúmenes y Su Función Real",niv:"p",dur:"12 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Peróxido 10v","Peróxido 20v","Peróxido 30v","Peróxido 40v","Bowl","Medidor"],
   vt:"Guía de Peróxidos",vds:"Cuándo usar cada volumen y qué hace exactamente cada uno.",
   txt:`<div class="punto"><span class="punto-num">1</span><span><strong>10 volúmenes (3%):</strong> deposita color sin aclarar. Matizadores y tonos oscuros.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>20 volúmenes (6%):</strong> 1 tono de aclaración. Cobertura de canas estándar.</span></div>
<div class="punto"><span class="punto-num">3</span><span><strong>30 volúmenes (9%):</strong> 2-3 tonos de aclaración. Mechas, iluminaciones.</span></div>
<div class="punto"><span class="punto-num">4</span><span><strong>40 volúmenes (12%):</strong> máxima aclaración. Solo en mechas con aluminio.</span></div>
<div class="alerta">⚠️ Nunca uses 40 volúmenes en cuero cabelludo — quemadura química garantizada.</div>`},

  {id:"tin_p05",n:"Proporción de Mezcla — Tinte y Peróxido",niv:"p",dur:"8 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Bowl","Medidor de ml","Báscula","Espátula"],
   vt:"Proporciones de Colorimetría",vds:"La mezcla correcta que garantiza el resultado esperado.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Proporción estándar: <strong>1 parte de tinte : 1.5 partes de peróxido</strong>.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Ejemplo: 60g tinte + 90ml peróxido 20v para un servicio completo.</span></div>
<div class="punto"><span class="punto-num">3</span><span>Algunas marcas usan 1:1. Verificar siempre la ficha técnica del producto.</span></div>
<div class="importante">📌 Una proporción incorrecta cambia el tono final y la cobertura de canas.</div>`},

  {id:"tin_i01",n:"Melanina y Pigmentación — La Química del Color",niv:"i",dur:"18 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Tabla cromática","Bowl","Peróxido","Tinte"],
   vt:"Química de la Melanina",vds:"Eumelanina vs feomelanina y cómo afectan el resultado del color.",
   txt:`<div class="importante">📌 Comprender la melanina es comprender por qué los cabellos reaccionan diferente al mismo producto.</div>
<div class="punto"><span class="punto-num">1</span><span><strong>Eumelanina:</strong> pigmento oscuro (castaño/negro). Cabellos resistentes a la aclaración.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Feomelanina:</strong> pigmento claro (rojizo/dorado). Cabellos que se vuelven naranja al decolorar.</span></div>
<div class="tip">✅ Saber el tipo de melanina te permite predecir el resultado antes de aplicar el producto.</div>`},

  {id:"tin_i02",n:"Porcentaje de Canas y Estrategia de Cobertura",niv:"i",dur:"14 min",
   img:"https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800",videoUrl:"",
   tools:["Tinte de cobertura","Peróxido 20v","Bowl","Pincel"],
   vt:"Cobertura Estratégica de Canas",vds:"Fórmulas según porcentaje real de canas.",
   txt:`<div class="punto"><span class="punto-num">1</span><span><strong>Menos del 30% de canas:</strong> tinte normal con reflejo a elección.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>30-60% de canas:</strong> agregar base 1 (negro) o 4 (castaño) para reforzar cobertura.</span></div>
<div class="punto"><span class="punto-num">3</span><span><strong>Más del 60% de canas:</strong> tinte de cobertura especial 100% + peróxido 20v. Tiempo máximo.</span></div>
<div class="importante">📌 Las canas son resistentes porque no tienen melanina. Necesitan más tiempo de actuación.</div>`},

  {id:"tin_i03",n:"Neutralización de Tonos — Tabla Práctica",niv:"i",dur:"20 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Rueda cromática","Tabla de neutralización","Tintes correctores"],
   vt:"Rueda Cromática de Neutralización",vds:"Qué color neutraliza cada tono no deseado.",
   txt:`<div class="importante">📌 La neutralización usa colores opuestos en la rueda cromática. Esta es la clave de la colorimetría avanzada.</div>
<div class="punto"><span class="punto-num">1</span><span><strong>Naranja/Cobrizo:</strong> neutralizar con ceniza (Azul). Tintes .1 o .11.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Amarillo:</strong> neutralizar con violeta. Matizadores violeta o tintes .2.</span></div>
<div class="punto"><span class="punto-num">3</span><span><strong>Rojo:</strong> neutralizar con verde. Tintes .3 o mezcla complementaria.</span></div>
<div class="alerta">⚠️ Sin saber neutralizar no apliques color — puedes dejar al cliente con un tono que empeora su problema.</div>`},

  {id:"tin_i04",n:"Aplicación de Retoque de Raíz",niv:"i",dur:"15 min",
   img:"https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800",videoUrl:"",
   tools:["Tinte","Peróxido 20v","Bowl","Pincel fino","Pinzas"],
   vt:"Retoque de Raíz Profesional",vds:"Técnica para empalmar el color nuevo con el anterior sin sobreprocesar.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Aplicar el tinte solo en la raíz nueva, respetando <strong>exactamente el borde del color anterior</strong>.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Tiempo de proceso: el recomendado por el fabricante + 5 min extra para canas resistentes.</span></div>
<div class="punto"><span class="punto-num">3</span><span>En los últimos 5 minutos: peinar el sobrante hacia las puntas para refrescar el largo.</span></div>
<div class="alerta">⚠️ Aplicar tinte completo sobre cabello ya teñido = oscurecimiento acumulado y sobreprocesamiento.</div>`},

  {id:"tin_i05",n:"Tiempo de Procesamiento según Tipo de Cabello",niv:"i",dur:"12 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Timer","Tabla de tiempos"],
   vt:"Control de Tiempos de Proceso",vds:"Cómo el tiempo afecta el resultado final del color.",
   txt:`<div class="punto"><span class="punto-num">1</span><span><strong>Cabello virgen (sin procesos):</strong> tiempo estándar del fabricante — 30-45 min.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Cabello poroso (ya procesado):</strong> reducir tiempo — absorbe más rápido.</span></div>
<div class="punto"><span class="punto-num">3</span><span><strong>Cabello resistente (canas rebeldes):</strong> aumentar 10-15 min y revisar cada 5 min.</span></div>
<div class="tip">✅ Un timer profesional en tu estación es obligatorio. Nunca calcular el tiempo a ojo.</div>`},

  {id:"tin_a01",n:"Colorimetría Avanzada — Doble Proceso",niv:"a",dur:"25 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Decolorante","Peróxido 30v","Tinte final","Bowl","Pincel","Timer"],
   vt:"Técnica de Doble Proceso",vds:"Decolorar y tonificar en la misma sesión para máxima transformación.",
   txt:`<div class="importante">📌 El doble proceso es la técnica más demandante en colorimetría. Requiere máximo control y experiencia.</div>
<div class="punto"><span class="punto-num">1</span><span><strong>Paso 1:</strong> Decolorar al nivel base necesario para el color final deseado.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Paso 2:</strong> Tonificar con el color objetivo una vez alcanzado el nivel de decoloración.</span></div>
<div class="alerta">⚠️ Sin mínimo 2 años de experiencia en colorimetría: no realizar doble proceso. Riesgo de daño irreversible.</div>`},

  {id:"tin_a02",n:"Súper Mezclas — Formulación Maestra",niv:"a",dur:"25 min",
   img:"https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800",videoUrl:"",
   tools:["3-4 tintes diferentes","Peróxido","Bowl grande","Tabla cromática","Báscula"],
   vt:"Formulación de Súper Mezclas",vds:"Sistema de mezclas maestras para casos cromáticos complejos.",
   txt:`<div class="importante">📌 La súper mezcla se usa cuando ningún tinte individual logra la neutralización o el tono requerido.</div>
<div class="punto"><span class="punto-num">1</span><span>Ejemplo para neutralizar rojos intensos: <em>7.1 + 8.1 + 9.1</em> en proporciones iguales.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Ejemplo para cenizas perfectas en base oscura: <em>5.1 + 6.11 + matizador azul</em>.</span></div>
<div class="alerta">⚠️ Un error en la súper mezcla puede resultar en colores indeseados y reclamos legales. Documentar siempre.</div>`},

  {id:"tin_a03",n:"Colorimetría Correctiva — Casos Difíciles",niv:"a",dur:"30 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Tabla cromática completa","Tintes correctivos","Decapante","Ficha técnica"],
   vt:"Corrección de Color Compleja",vds:"Cómo rescatar cabellos con colorimetría anterior defectuosa.",
   txt:`<div class="importante">📌 La corrección de color es el servicio más rentable y el más complejo. Puede requerir múltiples sesiones.</div>
<div class="punto"><span class="punto-num">1</span><span>Nunca prometer resultado en una sesión para correcciones complejas — es irresponsable.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Diagnóstico previo: identificar colores presentes, porcentaje de proceso y daño estructural.</span></div>
<div class="punto"><span class="punto-num">3</span><span>Plan progresivo: máximo 2 procesos por sesión para no comprometer la integridad capilar.</span></div>
<div class="tip">✅ Cobra por sesión de corrección, no por el resultado final. Cada sesión tiene su costo real.</div>`}
],

// ════════════════════════════════════════════════════════
"🌟 Mechas": [
  {id:"mec_p01",n:"Qué Son las Mechas — Tipos y Para Qué Sirven",niv:"p",dur:"8 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Catálogo de resultados"],
   vt:"Introducción a las Mechas",vds:"Tipos de mechas y el resultado que logra cada una.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Las mechas son mechones aclarados que crean contraste, luminosidad y tridimensionalidad.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Mechas clásicas:</strong> línea fina y precisa con aluminio. Efecto definido.</span></div>
<div class="punto"><span class="punto-num">3</span><span><strong>Babylights:</strong> muy finas, imitan el cabello aclarado por el sol en la infancia.</span></div>
<div class="tip">✅ Las mechas son el mejor ingreso por servicio de colorimetría en el salón.</div>`},

  {id:"mec_p02",n:"Materiales Completos para Mechas",niv:"p",dur:"6 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Papel aluminio","Polvo decolorante","Peróxido 30v","Peine aguja","Pincel","Bowl","Pinzas","Balde"],
   vt:"Equipamiento para Mechas",vds:"Lista completa de lo que necesitas antes de empezar.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Papel de aluminio cortado en tiras de 20-25cm × 10cm.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Polvo decolorante + peróxido 30v (relación 1:2).</span></div>
<div class="punto"><span class="punto-num">3</span><span>Peine de aguja para divisiones, pincel para aplicación, pinzas para secciones libres.</span></div>
<div class="importante">📌 Prepara todo antes de empezar. Interrumpir el servicio para buscar materiales arruina el resultado.</div>`},

  {id:"mec_p03",n:"Prueba de Mechón Obligatoria Pre-Mechas",niv:"p",dur:"10 min",
   img:"https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800",videoUrl:"",
   tools:["Mechón de prueba","Decolorante","Peróxido 30v","Timer"],
   vt:"Test Pre-Decoloración",vds:"Evaluación de resistencia y respuesta al decolorante.",
   txt:`<div class="alerta">🚨 La prueba de mechón en decoloración es <strong>OBLIGATORIA</strong>. No es opcional.</div>
<div class="punto"><span class="punto-num">1</span><span>Toma un mechón de la nuca y aplica la mezcla de decolorante.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Observa el cambio cada 5 minutos. Registra el tiempo hasta el nivel deseado.</span></div>
<div class="punto"><span class="punto-num">3</span><span>Si el mechón se parte o la textura se vuelve pastosa → STOP inmediato.</span></div>`},

  {id:"mec_p04",n:"Cálculo de Producto para Mechas",niv:"p",dur:"10 min",
   img:"https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800",videoUrl:"",
   tools:["Báscula","Polvo decolorante","Peróxido","Bowl medidor"],
   vt:"Fórmula de Cálculo de Producto",vds:"Cuánto producto preparar según el volumen de cabello.",
   txt:`<div class="punto"><span class="punto-num">1</span><span><strong>100g de cabello:</strong> 60g polvo decolorante + 200ml peróxido 30v.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>200g de cabello:</strong> 120g polvo + 400ml peróxido.</span></div>
<div class="punto"><span class="punto-num">3</span><span>En mechas parciales: preparar el <strong>50% de la fórmula completa</strong>.</span></div>
<div class="tip">✅ Sobra producto → no importa. Faltan a mitad del proceso → desastre. Siempre prepara de más.</div>`},

  {id:"mec_p05",n:"Proceso de Mechas con Aluminio — Paso a Paso",niv:"p",dur:"25 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Aluminio","Decolorante","Peróxido 30v","Peine aguja","Pincel","Pinzas"],
   vt:"Mechas con Aluminio Completo",vds:"El proceso completo de mechas desde la división hasta el lavado.",
   txt:`<div class="importante">📌 El paso más importante es la <strong>DIVISIÓN</strong>. Sin buena división, las mechas no quedan bien.</div>
<div class="punto"><span class="punto-num">1</span><span>Divide el cabello en 4 cuadrantes con pinzas.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Empieza por la nuca. Zigzag de 1cm con peine de aguja.</span></div>
<div class="punto"><span class="punto-num">3</span><span>Coloca el aluminio debajo del mechón. Aplica de <strong>arriba hacia abajo sin tocar la raíz</strong>.</span></div>
<div class="punto"><span class="punto-num">4</span><span>Dobla el aluminio y sigue alternando: sección libre → mecha → sección libre.</span></div>
<div class="punto"><span class="punto-num">5</span><span>Revisa cada 10 minutos. Retira cuando alcance el nivel deseado.</span></div>
<div class="alerta">⚠️ Embarazadas: absolutamente prohibido. Prueba de mechón siempre primero.</div>`},

  {id:"mec_i01",n:"Babylights — Técnica de Mechas Ultra Finas",niv:"i",dur:"30 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Papel de aluminio fino","Decolorante","Peróxido 20v","Peine aguja fino","Pincel fino"],
   vt:"Babylights Profesionales",vds:"La técnica de mechas más fina y naturalista del mercado.",
   txt:`<div class="importante">📌 Las babylights requieren el doble de tiempo que las mechas clásicas pero dan el resultado más natural posible.</div>
<div class="punto"><span class="punto-num">1</span><span>Mechones ultra finos — menos de 3mm de ancho.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Peróxido 20v (no 30v) — resultado más gradual y controlado.</span></div>
<div class="tip">✅ Las babylights son el servicio de mayor fidelización — el cliente vuelve cada 3 meses mínimo.</div>`},

  {id:"mec_i02",n:"Papel de Mechas vs Aluminio",niv:"i",dur:"12 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Papel de mechas","Papel de aluminio","Decolorante"],
   vt:"Comparativa de Materiales",vds:"Cuándo usar papel vs aluminio y cómo afecta el resultado.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>El aluminio refleja calor — acelera el proceso. Ideal para cabellos resistentes.</span></div>
<div class="punto"><span class="punto-num">2</span><span>El papel de mechas no refleja calor — proceso más gradual. Para cabellos finos.</span></div>
<div class="tip">✅ En ambos casos: la mezcla pierde consistencia al contacto. Prepara en bloques de 15 min.</div>`},

  {id:"mec_i03",n:"Cálculo de Tiempo por Tipo de Cabello",niv:"i",dur:"15 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Timer","Tabla de tiempos"],
   vt:"Control de Tiempo en Mechas",vds:"Cuánto tiempo dejar actuar según cabello y nivel objetivo.",
   txt:`<div class="punto"><span class="punto-num">1</span><span><strong>Cabello virgen (base 3-4):</strong> 30-45 min para llegar a rubio.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Cabello ya procesado:</strong> 15-25 min — la cutícula ya está abierta.</span></div>
<div class="punto"><span class="punto-num">3</span><span><strong>Cabello resistente/grueso:</strong> 45-60 min con revisión cada 10 min.</span></div>
<div class="alerta">⚠️ Superar los 60 min de decoloración = daño en la corteza. Nunca olvidarse del timer.</div>`},

  {id:"mec_i04",n:"Mechas Cromáticas — Color sobre Decoloración",niv:"i",dur:"20 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Tinte de fantasía","Decolorante","Peróxido","Bowl"],
   vt:"Mechas a Color",vds:"Cómo aplicar colores fantasía sobre mechas decoloradas.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Decolorar hasta nivel 9-10 (amarillo muy claro/platino) para que el color de fantasía sea puro.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Tonificar inmediatamente o en sesión posterior con el color elegido.</span></div>
<div class="importante">📌 Colores fantasía (rosado, azul, verde) solo dan el resultado esperado sobre base muy aclarada.</div>`},

  {id:"mec_i05",n:"Mantenimiento y Duración de las Mechas",niv:"i",dur:"10 min",
   img:"https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800",videoUrl:"",
   tools:["Champú sin sal","Mascarilla hidratante","Matizador"],
   vt:"Cuidado Post-Mechas",vds:"Cómo enseñar al cliente a mantener sus mechas en casa.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Champú sin sal siempre — los sulfatos aceleran la pérdida del tono y la hidratación.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Matizador violeta o azul cada 15 días para neutralizar el amarillo que aparece en mechas claras.</span></div>
<div class="importante">📌 El retoque de mechas se recomienda cada <strong>8-12 semanas</strong>. Enséñalo al cliente.</div>`},

  {id:"mec_a01",n:"Mechas Multidimensionales — 3 Tonos",niv:"a",dur:"35 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["3 mezclas diferentes","Aluminio","Peine aguja","Bowl × 3","Timer"],
   vt:"Color Multidimensional",vds:"Cómo crear profundidad con 3 tonos en el mismo servicio.",
   txt:`<div class="importante">📌 Las mechas multidimensionales son el estándar de los salones premium. Requieren planificación total.</div>
<div class="punto"><span class="punto-num">1</span><span>Preparar 3 mezclas: oscura (sombra), media (base) y clara (iluminación).</span></div>
<div class="punto"><span class="punto-num">2</span><span>Distribuir estratégicamente según el movimiento natural del cabello.</span></div>
<div class="tip">✅ El resultado justifica cobrar entre 2 y 3 veces el precio de una mecha simple.</div>`},

  {id:"mec_a02",n:"Registro Técnico y Ficha de Mechas",niv:"a",dur:"15 min",
   img:"https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800",videoUrl:"",
   tools:["Ficha técnica","Foto antes/después","Timer registro"],
   vt:"Documentación de Servicio de Mechas",vds:"Cómo documentar mechas para reproducir resultados exactos.",
   txt:`<div class="importante">📌 Un servicio documentado se puede reproducir exactamente. Un servicio no documentado depende de la memoria.</div>
<div class="punto"><span class="punto-num">1</span><span>Foto antes (luz natural), foto después, nota de productos usados y tiempos.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Registrar: peróxido, tiempo de proceso, nivel alcanzado, tono de tonificación.</span></div>
<div class="tip">✅ El cliente que obtiene el mismo resultado exacto cada vez se convierte en cliente de por vida.</div>`},

  {id:"mec_a03",n:"Mechas en Geometrías Avanzadas",niv:"a",dur:"25 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Papel aluminio","Decolorante","Peróxido","Peine","Pincel"],
   vt:"Geometría Avanzada de Mechas",vds:"Formas en V, diagonal y geométricas para efectos únicos.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Las mechas en V siguen la división natural en V en la coronilla — resultado muy arquitectónico.</span></div>
<div class="punto"><span class="punto-num">2</span><span>La diagonal profunda crea mechas que enmarcan el rostro de forma ultra personalizada.</span></div>
<div class="importante">📌 Estas geometrías son técnicas de firma que te diferencian en el mercado de lujo.</div>`}
],

// ════════════════════════════════════════════════════════
"🌊 Balayage": [
  {id:"bal_p01",n:"Qué es el Balayage — Origen y Filosofía",niv:"p",dur:"8 min",
   img:"https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800",videoUrl:"",
   tools:["Catálogo de resultados"],
   vt:"Introducción al Balayage",vds:"Historia y filosofía de la técnica francesa de colorimetría libre.",
   txt:`<div class="importante">📌 Balayage viene del francés "barrer". Técnica de aplicación libre a mano alzada, sin aluminio.</div>
<div class="punto"><span class="punto-num">1</span><span>Nació en los años 70 en París. Hoy es la técnica de colorimetría más solicitada mundialmente.</span></div>
<div class="punto"><span class="punto-num">2</span><span>El objetivo es imitar cómo el sol aclara el cabello naturalmente — sin línea de demarcación.</span></div>
<div class="tip">✅ El balayage diferencia a un colorista de un peluquero genérico.</div>`},

  {id:"bal_p02",n:"Materiales para Balayage",niv:"p",dur:"6 min",
   img:"https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800",videoUrl:"",
   tools:["Papel de mecca o film","Polvo decolorante","Peróxido 30v","Pincel de balayage","Peine de aguja","Bowl"],
   vt:"Equipamiento de Balayage",vds:"Qué herramientas específicas necesita la técnica.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Pincel de balayage: más ancho y plano que el de mechas. Aplica de forma difuminada.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Film plástico o papel de mechas para aislar secciones si es necesario.</span></div>
<div class="punto"><span class="punto-num">3</span><span>Peróxido 30v estándar. Algunos usan 20v para mayor control.</span></div>`},

  {id:"bal_p03",n:"Punto de Inicio del Balayage",niv:"p",dur:"10 min",
   img:"https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800",videoUrl:"",
   tools:["Pincel","Decolorante"],
   vt:"Dónde Empieza el Balayage",vds:"La decisión más importante antes de aplicar el producto.",
   txt:`<div class="importante">📌 El punto de inicio determina si el resultado se ve natural o artificial.</div>
<div class="punto"><span class="punto-num">1</span><span><strong>2 dedos de la raíz (15-20%):</strong> degradado sutil. Ideal para mantenimiento.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>4 dedos (30-40%):</strong> degradado pronunciado. Efecto sol intenso.</span></div>
<div class="punto"><span class="punto-num">3</span><span><strong>Mitad del largo:</strong> solombrée o balayage extremo. Solo en cabellos largos.</span></div>
<div class="tip">✅ Regla de Fátima: el punto de inicio es una decisión estética TUYA como profesional.</div>`},

  {id:"bal_p04",n:"La Pincelada Libre de Balayage",niv:"p",dur:"15 min",
   img:"https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800",videoUrl:"",
   tools:["Pincel de balayage","Decolorante preparado"],
   vt:"Técnica de Pincelada",vds:"La pincelada de abajo hacia arriba que define la técnica.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Carga el pincel con producto y aplica de abajo hacia arriba en el mechón.</span></div>
<div class="punto"><span class="punto-num">2</span><span>La presión disminuye conforme subes hacia la raíz — esto crea el degradado.</span></div>
<div class="punto"><span class="punto-num">3</span><span>Las puntas reciben más producto. La raíz no recibe nada.</span></div>
<div class="importante">📌 No hay aluminio debajo. El cabello libre permite que el producto se difumine solo.</div>`},

  {id:"bal_p05",n:"Sisa Triangular — La Base del Balayage Natural",niv:"p",dur:"12 min",
   img:"https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800",videoUrl:"",
   tools:["Peine aguja","Pinzas","Pincel"],
   vt:"División en Sisa Triangular",vds:"La geometría que hace que el balayage sea 100% natural.",
   txt:`<div class="importante">📌 La sisa triangular amplía la zona de aplicación y crea el efecto más natural posible.</div>
<div class="punto"><span class="punto-num">1</span><span>En vez de mechones rectos, toma triángulos irregulares que amplían la base hacia abajo.</span></div>
<div class="punto"><span class="punto-num">2</span><span>La división en triángulo crea transiciones más suaves sin línea de demarcación visible.</span></div>
<div class="tip">✅ Sisa + pincelada degradada = balayage que parece hecho por el sol.</div>`},

  {id:"bal_i01",n:"Balayage Completo — Protocolo Avanzado",niv:"i",dur:"30 min",
   img:"https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800",videoUrl:"",
   tools:["Polvo decolorante","Peróxido","Pincel plano","Papel aluminio","Pinzas"],
   vt:"Balayage Profesional Completo",vds:"De la división al resultado final — protocolo completo.",
   txt:`<div class="importante">📌 Balayage es colorimetría nivel avanzado. Requiere dominio de la técnica y la cromática.</div>
<div class="punto"><span class="punto-num">1</span><span>Divide en cuadrantes y trabaja de dentro hacia afuera.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Aplica con pincelada libre, sin aluminio, dejando el cabello caer naturalmente.</span></div>
<div class="punto"><span class="punto-num">3</span><span>Revisar cada 10 minutos. Tabla cromática para saber cuándo está listo.</span></div>
<div class="alerta">⚠️ Sin supervisión profesional, no practicar en personas reales. Usar maniquí primero.</div>`},

  {id:"bal_i02",n:"Tonificación Post-Balayage",niv:"i",dur:"15 min",
   img:"https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800",videoUrl:"",
   tools:["Tinte tonificador","Peróxido 10v","Bowl","Pincel"],
   vt:"Tonificación de Balayage",vds:"El paso final que convierte un balayage en obra maestra.",
   txt:`<div class="importante">📌 La tonificación convierte un balayage ordinario en uno de lujo.</div>
<div class="punto"><span class="punto-num">1</span><span>Una vez retirado el decolorante, aplicar tono al gusto sobre las zonas aclaradas.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Peróxido 10v — solo depósito de pigmento, sin aclaración adicional.</span></div>
<div class="tip">✅ Beige, arena, bronce, ceniza — la tonificación define el estilo final del balayage.</div>`},

  {id:"bal_i03",n:"Balayage en Cabello Oscuro",niv:"i",dur:"25 min",
   img:"https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800",videoUrl:"",
   tools:["Decolorante potente","Peróxido 30v-40v","Pincel","Timer"],
   vt:"Balayage en Bases Oscuras",vds:"Cómo lograr balayage en cabello castaño oscuro o negro.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>En bases muy oscuras (1-3): puede requerirse <strong>2 sesiones</strong> para alcanzar el nivel objetivo.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Primera sesión: aclarar hasta naranja/cobrizo. Segunda: aclarar a rubio y tonificar.</span></div>
<div class="alerta">⚠️ Prometer balayage platino en 1 sesión sobre base negra = garantía de daño capilar severo.</div>`},

  {id:"bal_i04",n:"Mantenimiento del Balayage",niv:"i",dur:"10 min",
   img:"https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800",videoUrl:"",
   tools:["Champú sin sal","Matizador","Mascarilla hidratante"],
   vt:"Cuidado del Balayage en Casa",vds:"Rutina de mantenimiento que Fátima recomienda a sus clientes.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Champú sin sal siempre — el cloruro de sodio destruye la tonificación.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Matizador azul/violeta cada 2 semanas en las zonas más claras.</span></div>
<div class="tip">✅ El balayage bien mantenido dura 3-4 meses sin retoque. Enséñalo al cliente desde el primer día.</div>`},

  {id:"bal_i05",n:"Balayage + Hidratación Simultánea",niv:"i",dur:"20 min",
   img:"https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800",videoUrl:"",
   tools:["Decolorante","Mascarilla hidratante","Peróxido","Timer"],
   vt:"Balayage con Tratamiento Integrado",vds:"Cómo integrar hidratación en el proceso de balayage.",
   txt:`<div class="importante">📌 El balayage debilita la fibra. Añadir hidratación es un diferencial de calidad.</div>
<div class="punto"><span class="punto-num">1</span><span>Al retirar el decolorante, aplicar mascarilla hidratante profunda antes de tonificar.</span></div>
<div class="punto"><span class="punto-num">2</span><span>El cabello hidratado agarra mejor la tonificación y queda más brillante.</span></div>
<div class="tip">✅ Ofrecer "balayage con tratamiento" como servicio premium con precio mayor.</div>`},

  {id:"bal_a01",n:"Airtouch — Balayage con Secador",niv:"a",dur:"35 min",
   img:"https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800",videoUrl:"",
   tools:["Secador","Decolorante","Peróxido","Papel de mechas","Pincel"],
   vt:"Técnica Airtouch Professional",vds:"El secador selecciona mecánicamente los mechones más fuertes.",
   txt:`<div class="importante">📌 La técnica Airtouch usa el secador para separar el cabello fino y débil del grueso — aclarando solo los fuertes.</div>
<div class="punto"><span class="punto-num">1</span><span>Coloca el mechón sobre el papel. Pasa el secador a temperatura media — los cabellos finos vuelan.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Los cabellos que quedan en el papel son los que recibirán el producto.</span></div>
<div class="tip">✅ Resultado: balayage ultra natural, sin líneas, como si el sol hubiera elegido cada mechón.</div>`},

  {id:"bal_a02",n:"Balayage con Shadowing",niv:"a",dur:"30 min",
   img:"https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800",videoUrl:"",
   tools:["Tinte oscuro","Decolorante","Peróxido","Bowl × 2","Pincel"],
   vt:"Balayage con Sombreado",vds:"Añadir profundidad con técnica de shadow en balayage.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Aplicar primero el shadow (sombra oscura) en la raíz de forma difuminada.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Luego aplicar el balayage claro en las puntas y medios.</span></div>
<div class="importante">📌 El resultado: transición oscuro → claro de máxima profundidad y naturalidad.</div>`},

  {id:"bal_a03",n:"Formulación Cromática para Balayage — Nivel Master",niv:"a",dur:"25 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Tabla cromática","3-5 tintes","Peróxido","Ficha técnica"],
   vt:"Formulación Master de Balayage",vds:"Cómo formular el tono exacto para cada tipo de piel y base.",
   txt:`<div class="importante">📌 El balayage master considera: tono de piel, color de ojos, estilo de vida del cliente y base capilar.</div>
<div class="punto"><span class="punto-num">1</span><span>Piel fría (rosada/azulada): tonificación ceniza o beige frío.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Piel cálida (dorada/oliva): tonificación dorada, miel o caramelo.</span></div>
<div class="tip">✅ El colorista que formula basado en el cliente (no solo en tendencias) fideliza para siempre.</div>`}
]

}; // Fin CONOCIMIENTO_P1

// ── FUSIÓN CON CONOCIMIENTO EXISTENTE ────────────────────────
// Al cargar, fusiona CONOCIMIENTO_P1 con el CONOCIMIENTO
// principal ya definido en fatima_peluqueria.html.
// Solo agrega categorías nuevas — no sobreescribe las existentes.
// ─────────────────────────────────────────────────────────────
(function fusionarP1 () {
  const intentar = () => {
    if (typeof window.CONOCIMIENTO === 'undefined') {
      setTimeout(intentar, 150);
      return;
    }
    Object.entries(window.CONOCIMIENTO_P1).forEach(([cat, clases]) => {
      if (!window.CONOCIMIENTO[cat]) {
        // Categoría nueva → agregar completa
        window.CONOCIMIENTO[cat] = clases;
      } else {
        // Categoría existente → agregar solo clases con ID nuevo
        const idsExistentes = new Set(window.CONOCIMIENTO[cat].map(c => c.id));
        clases.forEach(c => {
          if (!idsExistentes.has(c.id)) {
            window.CONOCIMIENTO[cat].push(c);
          }
        });
      }
    });
    console.log('[Motor Fátima P1] Fusión completada ✅');
  };
  intentar();
})();

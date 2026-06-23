/**
 * ═══════════════════════════════════════════════════════════════
 *  MOTOR_PROMPTS · Librería ÚNICA de prompts automáticos
 *  Fátima Caldea Studio · proyecto aprendisajefatima
 *  ────────────────────────────────────────────────────────────────
 *  FUENTE ÚNICA DE VERDAD para construir los prompts de generación
 *  (imagen + video) de TODA clase, fitness y peluquería. Sustituye a
 *  los 4 generadores divergentes que había (construirPromptFitness,
 *  buildPrompt, m1_motor_bridge, promptLamina).
 *
 *  No llama a ninguna API ni Firebase: solo arma TEXTO + metadatos.
 *  La generación/subida la hacen M1 / motor_auto usando esta librería.
 *
 *  API:
 *    MOTOR_PROMPTS.fitnessCombos()            → 81 combos únicos de lámina
 *    MOTOR_PROMPTS.ejerciciosDe(g,e,nej)      → lista real de ejercicios
 *    MOTOR_PROMPTS.fitnessSingle(g,e,m,nom)   → prompt 1 ejercicio (imagen)
 *    MOTOR_PROMPTS.fitnessVideo(g,e,m,nom)    → prompt 1 ejercicio (video)
 *    MOTOR_PROMPTS.peluqueria(catId,variant)  → prompt peluquería (imagen)
 *    MOTOR_PROMPTS.build(clase, kind)         → { prompt, modelo, aspect, ... }
 *      · clase: objeto con {cat, grupo, motor, equipo, nej | catId, niv, titulo}
 *      · kind:  'img' | 'vid'
 * ═══════════════════════════════════════════════════════════════
 */
(function () {
  'use strict';
  if (window.MOTOR_PROMPTS) return;

  /* ── Etiquetas en inglés (mejores resultados en los modelos) ── */
  var GRUPO_EN = {
    gluteo: 'glutes and hips',
    pierna: 'legs (quadriceps, hamstrings, calves)',
    superior: 'upper body (chest, back, shoulders, arms)'
  };
  var MUSCLE_EN = {
    gluteo: 'glutes and hamstrings',
    pierna: 'quadriceps, hamstrings and calves',
    superior: 'chest, back, shoulders and arms'
  };
  var EQUIPO_EN = {
    mancuerna: 'using dumbbells and free weights',
    maquina: 'using professional gym machines',
    corporal: 'using bodyweight only, no equipment'
  };
  var MOTOR_EN = {
    masa: 'hypertrophy training, heavy controlled load, focused on building muscle mass',
    perder: 'fat loss, dynamic high-intensity metabolic training',
    mantener: 'strength maintenance, controlled steady technique'
  };
  var NIV_BY_NEJ = { 6: 'p', 8: 'i', 12: 'a' };
  var NIV_LBL = { p: 'beginner', i: 'intermediate', a: 'advanced' };

  /* ── Modelos por defecto (Replicate · API privada) ── */
  var MODELOS = {
    imagen: 'black-forest-labs/flux-dev',
    // Video: mismo modelo que usa M2 (Replicate). Cambiable desde motor_auto.
    video: 'wan-video/wan-2.2-t2v-fast'
  };

  /* ── Acceso a la base de ejercicios (sin duplicar datos) ──
     Prioriza el motor de conocimiento; si no está, usa el EJERCICIOS
     local de M1 (misma forma). Devuelve [] si no hay. */
  function _ejDB() {
    if (window.MOTOR_FITNESS && window.MOTOR_FITNESS.EJERCICIOS_DB) return window.MOTOR_FITNESS.EJERCICIOS_DB;
    if (window.EJERCICIOS) return window.EJERCICIOS; // fallback (claves '6'/'8'/'12')
    return null;
  }
  function ejerciciosDe(grupo, equipo, nej, motor) {
    // Preferir la función canónica del motor de conocimiento (depende del motor)
    if (motor && window.MOTOR_FITNESS && window.MOTOR_FITNESS.ejerciciosDe) {
      var r = window.MOTOR_FITNESS.ejerciciosDe(grupo, motor, equipo, nej);
      if (r && r.length) return r.slice();
    }
    var db = _ejDB();
    if (!db) return [];
    var g = db[grupo];
    if (!g) return [];
    // forma con motor: g[motor][equipo][nej]
    if (motor && g[motor] && g[motor][equipo] && (g[motor][equipo][nej] || g[motor][equipo][String(nej)])) {
      return (g[motor][equipo][nej] || g[motor][equipo][String(nej)]).slice();
    }
    // forma M1 (sin motor): g[equipo][nej]
    if (g[equipo] && (g[equipo][nej] || g[equipo][String(nej)])) {
      return (g[equipo][nej] || g[equipo][String(nej)]).slice();
    }
    // forma motor_conocimiento sin motor dado: primer motor disponible
    var motorKeys = Object.keys(g);
    for (var i = 0; i < motorKeys.length; i++) {
      var m = g[motorKeys[i]];
      if (m && m[equipo] && (m[equipo][nej] || m[equipo][String(nej)])) {
        return (m[equipo][nej] || m[equipo][String(nej)]).slice();
      }
    }
    return [];
  }

  /* ── 81 combos únicos de lámina fitness (la imagen NO depende del día) ── */
  function fitnessCombos() {
    var grupos = ['gluteo', 'pierna', 'superior'];
    var motores = ['masa', 'perder', 'mantener'];
    var equipos = ['maquina', 'mancuerna', 'corporal'];
    var cantidades = [6, 8, 12];
    var out = [];
    grupos.forEach(function (grupo) {
      motores.forEach(function (motor) {
        equipos.forEach(function (equipo) {
          cantidades.forEach(function (nej) {
            out.push({
              cat: 'fitness',
              grupo: grupo, motor: motor, equipo: equipo, nej: nej,
              niv: NIV_BY_NEJ[nej],
              claveImgBase: grupo + '_' + motor + '_' + equipo + '_' + nej,
              ejercicios: ejerciciosDe(grupo, equipo, nej)
            });
          });
        });
      });
    });
    return out;
  }

  /* ── PROMPT · 1 ejercicio fitness (imagen, panel de la lámina) ── */
  function fitnessSingle(grupo, equipo, motor, nombreEj) {
    return 'Professional fitness photo of a single real athletic person performing "' + nombreEj +
      '" with perfect controlled technique, ' + (GRUPO_EN[grupo] || grupo) + ', ' + (EQUIPO_EN[equipo] || equipo) + '. ' +
      (MOTOR_EN[motor] || motor) + '. The working ' + (MUSCLE_EN[grupo] || 'muscles') +
      ' highlighted with a glowing orange anatomical muscle overlay on the body. ' +
      'Full body clearly visible, correct posture, fitted dark athletic wear, modern premium gym with equipment in background, ' +
      'clean composition, soft professional studio lighting. Photorealistic, sharp focus, natural anatomy, single person only, ' +
      'centered, no text, no labels, no watermark, no collage, no split panels. Vertical 3:4 portrait.';
  }

  /* ── PROMPT · 1 ejercicio fitness (video) ── alineado con M2:
     una sola persona, un solo ejercicio, plano fijo 3/4, sin paneles. */
  function fitnessVideo(grupo, equipo, motor, nombreEj) {
    var nLabel = ''; // nivel no aplica al video individual
    return 'Professional fitness instructional video of ONE single athlete performing the exercise "' + nombreEj +
      '" ' + (EQUIPO_EN[equipo] || equipo) + ' in a professional gym. The athlete demonstrates the COMPLETE movement with correct form and full range of motion, slow and controlled. ' +
      (MOTOR_EN[motor] || motor) + ', ' + (GRUPO_EN[grupo] || grupo) + ' clearly engaged. ' +
      'Three-quarter side camera angle, the whole body stays inside the frame during the entire repetition. ' +
      'Cinematic 60fps 1080p, professional gym lighting, ultra-stable camera, photorealistic, high detail. ' +
      'STRICT: a single person doing a single exercise, one continuous shot, NO split screen, NO multiple panels, NO grid, NO text, NO numbers on screen, no watermark.';
  }

  /* ── PROMPT · peluquería / academia (imagen) ──
     Deriva de la categoría y la variante. Reutiliza la tabla CATS de M1
     si está cargada; si no, arma un prompt profesional coherente desde
     el id/título de la categoría. variant: cliente|peluquero|protocolo|alertas */
  var VARIANT_EN = {
    cliente: 'clean elegant client-facing result photo, professional salon, soft flattering lighting',
    peluquero: 'professional technique demonstration, hands and tools in focus, step-by-step clarity',
    protocolo: 'clear technical protocol diagram on mannequin head, clean professional illustration, labeled sections',
    alertas: 'safety and warning visual, highlighting risks and contraindications, clinical clean background'
  };
  function peluqueria(catIdOrLabel, variant) {
    variant = variant || 'cliente';
    // 1) reutiliza CATS de M1 si existe (prompt curado)
    if (window.CATS && Array.isArray(window.CATS)) {
      var c = window.CATS.find(function (x) {
        return x.id === catIdOrLabel ||
          (x.label && x.label.toLowerCase().indexOf(String(catIdOrLabel).toLowerCase()) >= 0);
      });
      if (c && c.prompts && (c.prompts[variant] || c.prompts.cliente)) {
        return c.prompts[variant] || c.prompts.cliente;
      }
    }
    // 2) genérico coherente
    var tema = String(catIdOrLabel || 'professional hairdressing').replace(/[^\wáéíóúñ\s-]/gi, '').trim();
    return 'Professional hairdressing academy image about "' + tema + '", ' + (VARIANT_EN[variant] || VARIANT_EN.cliente) +
      '. Modern salon, realistic high-quality photography, clean composition, no text, no watermark, high resolution, 4:3.';
  }

  /* ── ENTRADA UNIFICADA · build(clase, kind) ──
     Devuelve el prompt y los metadatos de generación para una clase.
     · Fitness lámina: el prompt "maestro" describe la grilla, pero la
       generación real es 1 imagen por ejercicio + composición por código
       (M1.generarLaminaFitness). Aquí se exponen también los prompts por
       ejercicio en .panels para que el generador headless los use. */
  function build(clase, kind) {
    kind = kind || 'img';
    clase = clase || {};
    if (clase.cat === 'fitness') {
      var nej = parseInt(clase.nej || clase.n || 6, 10);
      var ejercicios = (clase.ejercicios && clase.ejercicios.length)
        ? clase.ejercicios.map(function (e) { return e.nombre || e; })
        : ejerciciosDe(clase.grupo, clase.equipo, nej);
      var panels = ejercicios.map(function (nom) {
        return {
          nombre: nom,
          prompt: kind === 'vid'
            ? fitnessVideo(clase.grupo, clase.equipo, clase.motor, nom)
            : fitnessSingle(clase.grupo, clase.equipo, clase.motor, nom)
        };
      });
      return {
        cat: 'fitness',
        kind: kind,
        modelo: kind === 'vid' ? MODELOS.video : MODELOS.imagen,
        aspect: kind === 'vid' ? '9:16' : '3:4',
        claveImgBase: clase.grupo + '_' + clase.motor + '_' + clase.equipo + '_' + nej,
        nivel: NIV_LBL[NIV_BY_NEJ[nej]] || '',
        // la lámina se COMPONE: una imagen por panel + grilla por código
        compuesto: kind === 'img',
        panels: panels,
        // prompt maestro (descriptivo, por si se quiere 1 sola imagen)
        prompt: panels.length ? panels[0].prompt : fitnessSingle(clase.grupo, clase.equipo, clase.motor, '')
      };
    }
    // peluquería / academia
    var variant = clase.variant || 'cliente';
    return {
      cat: clase.cat || 'academia',
      kind: kind,
      modelo: kind === 'vid' ? MODELOS.video : MODELOS.imagen,
      aspect: kind === 'vid' ? '9:16' : '4:3',
      compuesto: false,
      prompt: kind === 'vid'
        ? 'Short professional hairdressing technique video about "' + (clase.titulo || clase.catId || clase.cat) + '", realistic salon, clear step demonstration, no text, no watermark, 9:16.'
        : peluqueria(clase.catId || clase.cat || clase.titulo, variant)
    };
  }

  window.MOTOR_PROMPTS = {
    MODELOS: MODELOS,
    GRUPO_EN: GRUPO_EN, EQUIPO_EN: EQUIPO_EN, MOTOR_EN: MOTOR_EN,
    NIV_BY_NEJ: NIV_BY_NEJ, NIV_LBL: NIV_LBL,
    ejerciciosDe: ejerciciosDe,
    fitnessCombos: fitnessCombos,
    fitnessSingle: fitnessSingle,
    fitnessVideo: fitnessVideo,
    peluqueria: peluqueria,
    build: build
  };
  console.log('%c[MOTOR_PROMPTS] librería única de prompts cargada', 'color:#22c55e;font-weight:700');
})();

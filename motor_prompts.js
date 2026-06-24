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

  /* ── Traducción de cada ejercicio al INGLÉS (clave para que la IA NO
     alucine). Copia de la tabla del motor de conocimiento. Si el motor
     de conocimiento expone su propia tabla/función, se prefiere esa
     (fuente única); si no, se usa esta. ── */
  var EJERCICIO_EN = {
    'Hip Thrust Máquina':'Machine Hip Thrust','Prensa Glúteo 45°':'45° Glute Press','Kickback Cable':'Cable Kickback',
    'Abducción Sentada':'Seated Hip Abduction','Step-Up con Carga':'Loaded Step-Up','Extensión Cadera':'Hip Extension',
    'Sentadilla Smith':'Smith Machine Squat','Curl Femoral':'Lying Hamstring Curl','Hiperextensión':'Back Hyperextension',
    'Peso Muerto Máquina':'Machine Deadlift','Patada Trasera':'Glute Kickback','Aducción Sentada':'Seated Hip Adduction',
    'Hip Thrust Mancuerna':'Dumbbell Hip Thrust','Sentadilla Goblet':'Goblet Squat','Peso Muerto Rumano':'Romanian Deadlift',
    'Zancada Lateral':'Lateral Lunge','Step-Up Mancuerna':'Dumbbell Step-Up','Patada de Burro':'Donkey Kick',
    'Sentadilla Sumo':'Sumo Squat','Zancada Búlgara':'Bulgarian Split Squat','Hip Hinge':'Hip Hinge',
    'Abducción de Pie':'Standing Hip Abduction','Peso Muerto Copa':'Goblet Deadlift','Sentadilla Pulso':'Pulse Squat',
    'Hip Thrust Peso Corp.':'Bodyweight Hip Thrust','Sentadilla Búlgara':'Bulgarian Split Squat','Puente de Glúteo':'Glute Bridge',
    'Step-Up Sin Peso':'Bodyweight Step-Up','Sentadilla Pistol':'Pistol Squat','Clamshell':'Clamshell',
    'Puente Unilateral':'Single-Leg Glute Bridge','Sentadilla Lateral':'Lateral Squat','Patada Lateral':'Side Leg Kick',
    'Abducción Máquina':'Machine Hip Abduction','Prensa Pies Altos':'High Foot Leg Press','Aducción Máquina':'Machine Hip Adduction',
    'Sentadilla Hack':'Hack Squat','Patada Cable':'Cable Glute Kickback','Extensión Lumbar':'Lower Back Extension',
    'Zancada Frontal':'Forward Lunge','Step-Up Máquina':'Machine Step-Up','Zancada Alterna':'Alternating Lunge',
    'Hip Hinge Unilat.':'Single-Leg Hip Hinge','Marcha Glúteo':'Glute March','Prensa Glúteo':'Glute Leg Press',
    'Hip Thrust Unilat.':'Single-Leg Hip Thrust',
    'Sentadilla Trasera Barra':'Back Barbell Squat','Zancada Lateral Mancuerna':'Dumbbell Lateral Lunge',
    'Peso Muerto Sumo':'Sumo Deadlift','Extensión Pantorrilla':'Standing Calf Raise','Sentadilla Copa':'Goblet Squat',
    'Prensa 45°':'45° Leg Press','Extensión Cuádriceps':'Leg Extension','Prensa Pies Bajos':'Low Foot Leg Press',
    'Curl Fem. Parado':'Standing Hamstring Curl','Prensa Unilateral':'Single-Leg Press','Sentadilla Sissy':'Sissy Squat',
    'Sentadilla Libre':'Bodyweight Squat','Wall Sit':'Wall Sit','Salto Sentadilla':'Jump Squat','Caminata Isométrica':'Isometric Wall Sit Walk',
    'Prensa 45° Ligera':'Light 45° Leg Press','Aducción':'Hip Adduction','Curl Isquiotibial':'Hamstring Curl',
    'Zancada Reversa':'Reverse Lunge','Marcha Alta':'High Knee March','Zancada Salta':'Jumping Lunge',
    'Press Pecho Máquina':'Machine Chest Press','Jalón al Pecho':'Lat Pulldown','Remo Máquina':'Machine Row',
    'Press Hombro':'Shoulder Press','Curl Bíceps':'Bicep Curl','Extensión Tríceps':'Tricep Extension',
    'Cruce Poleas':'Cable Crossover','Face Pull':'Face Pull','Mariposa Máquina':'Machine Pec Fly',
    'Remo Sentado':'Seated Cable Row','Press Arnold Máquina':'Machine Arnold Press','Pushdown Cable':'Cable Tricep Pushdown',
    'Press Banca Mancuerna':'Dumbbell Bench Press','Remo Unilateral':'Single-Arm Dumbbell Row','Press Hombro Mancuerna':'Dumbbell Shoulder Press',
    'Curl Alternado':'Alternating Dumbbell Curl','Pullover':'Dumbbell Pullover','Elevación Lateral':'Lateral Raise','Curl Martillo':'Hammer Curl',
    'Mariposa Mancuerna':'Dumbbell Chest Fly','Remo Inclinado':'Bent-Over Row','Arnold Press':'Arnold Press','Patada Tríceps':'Tricep Kickback',
    'Flexiones':'Push-Up','Dominadas':'Pull-Up','Fondos Tríceps':'Tricep Dips','Remo Invertido':'Inverted Row',
    'Pike Push-Up':'Pike Push-Up','Superman':'Superman Exercise','Flexión Diamante':'Diamond Push-Up','Flexión Ancha':'Wide Push-Up',
    'Archer Push-Up':'Archer Push-Up','L-Sit':'L-Sit Hold','Curl Isométrico':'Isometric Curl','Elevación Frontal':'Front Raise',
    'Curl Cable':'Cable Curl','Mariposa':'Pec Fly','Press Arnold':'Arnold Press','Curl Predikador':'Preacher Curl',
    'Press Banca':'Bench Press','Pseudo Planche':'Pseudo Planche Push-Up','Flexión Lenta':'Slow Tempo Push-Up','Isométrico Pecho':'Isometric Chest Hold',
    'Curl Concentrado':'Concentration Curl'
  };
  function ejercicioEN(nombreEs){
    if (window.MOTOR_FITNESS && typeof window.MOTOR_FITNESS.ejercicioEN === 'function'){
      var r = window.MOTOR_FITNESS.ejercicioEN(nombreEs); if (r) return r;
    }
    return EJERCICIO_EN[nombreEs] || nombreEs;
  }

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

  /* ── PROMPT · 1 ejercicio fitness (imagen, panel de la lámina) ──
     El nombre se traduce al INGLÉS para que la IA represente el ejercicio
     CORRECTO (sin alucinar). El panel = un solo ejercicio real. */
  function fitnessSingle(grupo, equipo, motor, nombreEj) {
    var en = ejercicioEN(nombreEj);
    return 'Professional fitness photo of ONE single real athletic person performing the exercise "' + en +
      '" (' + (EQUIPO_EN[equipo] || equipo) + ') with perfect, anatomically correct technique. ' +
      'This must clearly and unmistakably be the "' + en + '" exercise, training ' + (GRUPO_EN[grupo] || grupo) + '. ' +
      (MOTOR_EN[motor] || motor) + '. The working muscles (' + (MUSCLE_EN[grupo] || 'muscles') +
      ') subtly highlighted with a glowing orange anatomical overlay. ' +
      'Full body in frame, correct posture mid-movement, fitted dark athletic wear, modern premium gym background, ' +
      'soft professional studio lighting. Photorealistic, sharp focus, natural anatomy, ONE person only, centered. ' +
      'STRICT: no text, no labels, no numbers, no watermark, no collage, no split panels, no multiple people. Vertical 3:4 portrait.';
  }

  /* ── PROMPT · 1 ejercicio fitness (video) ── nombre en inglés, 1 persona, 1 ejercicio. */
  function fitnessVideo(grupo, equipo, motor, nombreEj) {
    var en = ejercicioEN(nombreEj);
    return 'Professional fitness instructional video of ONE single athlete performing the exercise "' + en +
      '" ' + (EQUIPO_EN[equipo] || equipo) + ' in a professional gym. This must clearly be the "' + en + '" movement. ' +
      'The athlete demonstrates the COMPLETE repetition with correct form and full range of motion, slow and controlled. ' +
      (MOTOR_EN[motor] || motor) + ', ' + (GRUPO_EN[grupo] || grupo) + ' clearly engaged. ' +
      'Three-quarter side camera angle, whole body inside frame during the entire repetition. ' +
      'Cinematic 60fps 1080p, professional gym lighting, ultra-stable camera, photorealistic, high detail. ' +
      'STRICT: a single person doing a single exercise, one continuous shot, NO split screen, NO multiple panels, NO grid, NO text, NO numbers on screen, no watermark.';
  }

  /* ── PROMPT · peluquería / academia (imagen) ──
     Deriva de la categoría y la variante. Reutiliza la tabla CATS de M1
     si está cargada; si no, arma un prompt profesional coherente desde
     el id/título de la categoría. variant: cliente|peluquero|protocolo|alertas */
  var VARIANT_EN = {
    cliente: 'clean elegant client-facing result photo, professional salon, soft flattering lighting',
    peluquero: 'professional technique demonstration, hairdresser hands and tools in focus, step-by-step clarity',
    protocolo: 'clear technical protocol on a mannequin head, clean professional illustration, labeled sections',
    alertas: 'safety and warning visual, highlighting risks and contraindications, clinical clean background'
  };
  /* Detección de tema por palabra clave → contexto en INGLÉS específico,
     para que la IA represente la técnica real y no algo genérico. */
  var PELU_TEMA_EN = [
    [/balayage|mechas|babylight|highlight/i, 'balayage / hair highlighting technique, painted lightened strands, natural sun-kissed blonde result'],
    [/querat|alis|botox capilar|nanoplast/i, 'keratin smoothing / straightening treatment, sleek glossy straight hair, flat iron sealing'],
    [/tinte|coloraci|color|tono|cromat|matiz/i, 'professional hair coloring, color application with brush and bowl, vivid even color result'],
    [/decolora|blanque|platino|rubio/i, 'hair bleaching / lightening, platinum blonde result, foils and lightener'],
    [/peine|cepillo|tijera|plancha|secador|rizador|pincel|herramient|navaja/i, 'professional hairdressing tools close-up, scissors combs brushes flat iron arranged on a clean salon station'],
    [/lavado|champ|enjuague|hidrata|mascar|nutri|tratam/i, 'professional hair washing and treatment at the salon basin, foam and water, healthy shiny hydrated hair'],
    [/divisi|secci|zona|mapa|zigzag|pulgada|medida/i, 'professional hair sectioning and parting with a tail comb and clips on a mannequin head, neat divided sections'],
    [/corte|capas|fleco|bob|degrad/i, 'professional haircut technique, precise scissor cutting, clean layered finish'],
    [/morfolog|rostro|diagn|consulta/i, 'face shape analysis and hair diagnosis consultation, matching haircut to face morphology'],
    [/bioseg|higien|desinfec|esteril|epp|guante|mascar|alergia|hongo|embaraz/i, 'salon hygiene and biosafety protocol, sterilized tools, gloves and mask, clean sanitized station'],
    [/eleva|proyec|geometr|angulo/i, 'haircut elevation and projection angles, geometric sectioning on a mannequin head'],
    [/recogid|peinad|updo|trenza|onda|rizo|volumen/i, 'professional hairstyling and updo, elegant finished styling with brushes and tools'],
    [/extensi|peluca|postiz/i, 'hair extensions application, attaching wefts, long voluminous result']
  ];
  function temaPeluEN(label){
    var s = String(label || '');
    for (var i = 0; i < PELU_TEMA_EN.length; i++){ if (PELU_TEMA_EN[i][0].test(s)) return PELU_TEMA_EN[i][1]; }
    return 'professional hairdressing technique in an elegant salon';
  }
  /* ── PROMPT · 1 PASO de una clase de peluquería (video del carrusel) ──
     Toma el texto real del paso (de la lámina) + el tema detectado y arma
     un clip cinematográfico de ESE paso concreto. */
  function peluqueriaPaso(catIdOrLabel, titulo, niv, stepText) {
    var tema = temaPeluEN(String(catIdOrLabel || '') + ' ' + String(titulo || ''));
    var nivEN = niv === 'a' ? 'advanced professional level' : niv === 'i' ? 'intermediate level' : 'beginner-friendly';
    var step = String(stepText || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    return 'Cinematic professional hairdressing tutorial video, ' + nivEN + ', technique: ' + tema + '. ' +
      'This clip shows ONE concrete step of the process: ' + step + '. ' +
      'A real hairstylist performing exactly this step with accurate professional movements, close-up on the hands, hair and tools. ' +
      'Luxury elegant salon, soft cinematic lighting, warm gold tones, shallow depth of field, ultra-stable camera, slow controlled motion, photorealistic 1080p. ' +
      'STRICT: one continuous shot, anatomically correct hands, accurate professional technique, no text, no numbers on screen, no watermark, no split screen. Vertical 9:16.';
  }

  function peluqueria(catIdOrLabel, variant, clase) {
    variant = variant || 'cliente';
    clase = clase || {};
    // 1) reutiliza CATS de M1 si existe (prompt curado por ti)
    if (window.CATS && Array.isArray(window.CATS)) {
      var c = window.CATS.find(function (x) {
        return x.id === catIdOrLabel ||
          (x.label && x.label.toLowerCase().indexOf(String(catIdOrLabel).toLowerCase()) >= 0);
      });
      if (c && c.prompts && (c.prompts[variant] || c.prompts.cliente)) {
        return c.prompts[variant] || c.prompts.cliente;
      }
    }
    // 2) prompt ESPECÍFICO en inglés. Tema detectado en categoría O título
    //    (lo que primero coincida), para que cada clase varíe y sea correcta.
    var titulo = clase.titulo || clase.n || '';
    var tema = temaPeluEN(catIdOrLabel + ' ' + titulo);
    var nivEN = clase.niv === 'a' ? 'advanced professional level' : clase.niv === 'i' ? 'intermediate level' : 'clear beginner-friendly';
    return 'Editorial high-end hairdressing academy photograph, ' + nivEN + ', showing ' + tema + '. ' +
      (VARIANT_EN[variant] || VARIANT_EN.cliente) + '. ' +
      'Shot like a luxury hair magazine cover: cinematic soft directional lighting, shallow depth of field, ' +
      'rich elegant color grading with warm gold tones, pristine modern salon, immaculate styling, ' +
      'ultra-realistic skin and hair detail, glossy healthy hair, professional retouch quality, 8k, photorealistic. ' +
      'STRICT: anatomically correct hands, accurate professional technique, no text, no labels, no watermark, no collage. Vertical 4:3 portrait.';
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
        ? ('Cinematic professional hairdressing video, ' + temaPeluEN((clase.catId || clase.cat || '') + ' ' + (clase.titulo || '')) + '. ' +
           'A real professional hairstylist demonstrating the technique with accurate, controlled movements, close-up on the hands and hair. ' +
           'Luxury elegant salon, soft cinematic lighting, warm gold tones, shallow depth of field, ultra-stable camera, slow controlled motion, photorealistic 1080p. ' +
           'STRICT: one continuous shot, anatomically correct hands, accurate professional technique, no text, no numbers on screen, no watermark, no split screen. Vertical 9:16.')
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
    peluqueriaPaso: peluqueriaPaso,
    build: build
  };
  console.log('%c[MOTOR_PROMPTS] librería única de prompts cargada', 'color:#22c55e;font-weight:700');
})();

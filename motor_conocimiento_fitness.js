/* ════════════════════════════════════════════════════════════════
   MOTOR DE CONOCIMIENTO · BLOQUE 5 · NEURAL FITNESS
   Academia Fátima Caldea · Firebase: aprendisajefatima
   ----------------------------------------------------------------
   Define el catálogo de TODO el contenido que alimenta el bloque 5,
   con la MISMA forma que los motores de la Academia:
       window.CONOCIMIENTO_FITNESS = { "categoría": [ {id, n, ...} ] }
   tal como admin_motores.html consume window.CONOCIMIENTO_P1/P2/P3.

   El conocimiento (taxonomía + ejercicios + guiones) es copia EXACTA
   de bloque5_fitness.html. No se inventó nada.

   ESTE ARCHIVO NO TOCA NADA: solo define datos en memoria.

   ──────────────────────────────────────────────────────────────
   ACTUALIZACIÓN 3 (sincronizado 1:1 con bloque5_fitness.html real):
   Se revisó el código FUENTE del Bloque 5 (función getClaseVideoClips
   y getDriveURL) y las claves de este motor se corrigieron para
   coincidir EXACTAMENTE con lo que el Bloque 5 sabe leer. Antes de
   esta versión las claves de video por ejercicio eran una invención
   que el Bloque 5 NO iba a encontrar; ahora son una copia fiel.

   VIDEO · el Bloque 5 busca, en este orden:
     1) dia{N}_{grupo}_{obj}_{equipo}_{nEjer}_NN_slug   ← clips CON día
     2) {grupo}_{obj}_{equipo}_{nEjer}_NN_slug          ← clips SIN día (genérica)
     3) dia{N}_{obj}_{grupo}                            ← video único legado
   Este motor genera AMBAS claves (1 y 2) para cada ejercicio de cada
   clase, tal como se pidió, para que el Bloque 5 siempre encuentre
   contenido sin importar si busca por día específico o genérico.
   NN es el índice de 2 dígitos (01,02...) que usa la regex del
   Bloque 5 (/_(\d{2})_/) para ordenar el carrusel. slug es el nombre
   del ejercicio en minúsculas, sin tildes, espacios→"_".

   IMAGEN · el Bloque 5 (getDriveURL) busca SIEMPRE sin ejercicio:
     {grupo}_{obj}_{equipo}_{nEjer}_v{1..12}
   Por eso las tarjetas de imagen del catálogo SIGUEN siendo 1 lámina
   por clase completa (sin "_ej" ni "_NN"), exactamente como ya
   funcionaba. No se tocó nada de las imágenes.

   ACTUALIZACIÓN 1 y 2 previas (ya incorporadas):
   · DIAS = 365 (antes 30) — biblioteca de contenido día a día.
   · Catálogo dinámico: cada combinación día+motor+grupo+equipo+nivel
     expone su lista REAL de ejercicios (de EJERCICIOS_DB), agrupada
     en rangos de 30 días para no saturar el navegador.
   ════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── TAXONOMÍA REAL DEL BLOQUE 5 (sin cambios) ── */
  var GRUPO_LBL  = { gluteo: 'Glúteo', pierna: 'Pierna', superior: 'Tren Superior' };
  var MOTOR_LBL  = { masa: 'Ganar masa', perder: 'Perder grasa', mantener: 'Mantener' };
  var EQUIPO_LBL = { maquina: 'Máquina', mancuerna: 'Mancuerna', corporal: 'Corporal' };

  /* iconos y colores REALES del bloque 5 (MUSCULO_ICONO / header-* / MUSCULO_COLOR) */
  var GRUPO_ICO   = { gluteo: '🍑', pierna: '🦵', superior: '💪' };
  var MOTOR_COLOR = { masa: '#3b82f6', perder: '#ef4444', mantener: '#10b981' };
  var GRUPO_COLOR = { gluteo: '#ef4444', pierna: '#3b82f6', superior: '#10b981' };

  var CANTIDADES   = [6, 8, 12];
  var DIAS         = 365;  // biblioteca de contenido día a día, hasta 365.
  var MAX_LAMINAS  = 12;   // versiones por lámina, igual que el bloque 5
  var DIAS_POR_RANGO = 30; // tamaño de cada bloque "Días 1-30", "Días 31-60"...

  /* NIVEL según el número de ejercicios (metodología real de Fátima):
     6 = Principiante · 8 = Intermedio · 12 = Avanzado */
  var NIV_BY_NEJ = { 6: 'p', 8: 'i', 12: 'a' };
  var NIV_LBL    = { p: 'Principiante', i: 'Intermedio', a: 'Avanzado' };

  /* ── EJERCICIOS_DB · COPIA EXACTA DEL BLOQUE 5 (sin cambios) ── */
  var EJERCICIOS_DB = {
    gluteo: {
      masa: {
        maquina: {
          6: ['Hip Thrust Máquina', 'Prensa Glúteo 45°', 'Kickback Cable', 'Abducción Sentada', 'Step-Up con Carga', 'Extensión Cadera'],
          8: ['Hip Thrust Máquina', 'Prensa Glúteo 45°', 'Kickback Cable', 'Abducción Sentada', 'Step-Up con Carga', 'Extensión Cadera', 'Sentadilla Smith', 'Curl Femoral'],
          12: ['Hip Thrust Máquina', 'Prensa Glúteo 45°', 'Kickback Cable', 'Abducción Sentada', 'Step-Up con Carga', 'Extensión Cadera', 'Sentadilla Smith', 'Curl Femoral', 'Hiperextensión', 'Peso Muerto Máquina', 'Patada Trasera', 'Aducción Sentada']
        },
        mancuerna: {
          6: ['Hip Thrust Mancuerna', 'Sentadilla Goblet', 'Peso Muerto Rumano', 'Zancada Lateral', 'Step-Up Mancuerna', 'Patada de Burro'],
          8: ['Hip Thrust Mancuerna', 'Sentadilla Goblet', 'Peso Muerto Rumano', 'Zancada Lateral', 'Step-Up Mancuerna', 'Patada de Burro', 'Sentadilla Sumo', 'Zancada Búlgara'],
          12: ['Hip Thrust Mancuerna', 'Sentadilla Goblet', 'Peso Muerto Rumano', 'Zancada Lateral', 'Step-Up Mancuerna', 'Patada de Burro', 'Sentadilla Sumo', 'Zancada Búlgara', 'Hip Hinge', 'Abducción de Pie', 'Peso Muerto Copa', 'Sentadilla Pulso']
        },
        corporal: {
          6: ['Hip Thrust Peso Corp.', 'Sentadilla Búlgara', 'Puente de Glúteo', 'Patada Trasera', 'Sentadilla Sumo', 'Step-Up Sin Peso'],
          8: ['Hip Thrust Peso Corp.', 'Sentadilla Búlgara', 'Puente de Glúteo', 'Patada Trasera', 'Sentadilla Sumo', 'Step-Up Sin Peso', 'Sentadilla Pistol', 'Abducción de Pie'],
          12: ['Hip Thrust Peso Corp.', 'Sentadilla Búlgara', 'Puente de Glúteo', 'Patada Trasera', 'Sentadilla Sumo', 'Step-Up Sin Peso', 'Sentadilla Pistol', 'Abducción de Pie', 'Clamshell', 'Puente Unilateral', 'Sentadilla Lateral', 'Patada Lateral']
        }
      },
      perder: {
        maquina: {
          6: ['Kickback Cable', 'Abducción Máquina', 'Prensa Pies Altos', 'Extensión Cadera', 'Sentadilla Smith', 'Step-Up Máquina'],
          8: ['Kickback Cable', 'Abducción Máquina', 'Prensa Pies Altos', 'Extensión Cadera', 'Sentadilla Smith', 'Step-Up Máquina', 'Curl Femoral', 'Aducción Máquina'],
          12: ['Kickback Cable', 'Abducción Máquina', 'Prensa Pies Altos', 'Extensión Cadera', 'Sentadilla Smith', 'Step-Up Máquina', 'Curl Femoral', 'Aducción Máquina', 'Hip Thrust Máquina', 'Sentadilla Hack', 'Patada Cable', 'Extensión Lumbar']
        },
        mancuerna: {
          6: ['Peso Muerto Rumano', 'Zancada Frontal', 'Sentadilla Sumo', 'Step-Up Mancuerna', 'Zancada Lateral', 'Hip Hinge'],
          8: ['Peso Muerto Rumano', 'Zancada Frontal', 'Sentadilla Sumo', 'Step-Up Mancuerna', 'Zancada Lateral', 'Hip Hinge', 'Zancada Búlgara', 'Sentadilla Goblet'],
          12: ['Peso Muerto Rumano', 'Zancada Frontal', 'Sentadilla Sumo', 'Step-Up Mancuerna', 'Zancada Lateral', 'Hip Hinge', 'Zancada Búlgara', 'Sentadilla Goblet', 'Hip Thrust Mancuerna', 'Patada de Burro', 'Abducción Pie', 'Sentadilla Copa']
        },
        corporal: {
          6: ['Sentadilla Sumo', 'Puente Glúteo', 'Patada Trasera', 'Zancada Alterna', 'Abducción Pie', 'Sentadilla Pulso'],
          8: ['Sentadilla Sumo', 'Puente Glúteo', 'Patada Trasera', 'Zancada Alterna', 'Abducción Pie', 'Sentadilla Pulso', 'Clamshell', 'Hip Hinge Unilat.'],
          12: ['Sentadilla Sumo', 'Puente Glúteo', 'Patada Trasera', 'Zancada Alterna', 'Abducción Pie', 'Sentadilla Pulso', 'Clamshell', 'Hip Hinge Unilat.', 'Puente Unilateral', 'Sentadilla Lateral', 'Patada Lateral', 'Marcha Glúteo']
        }
      },
      mantener: {
        maquina: {
          6: ['Hip Thrust Máquina', 'Abducción Sentada', 'Prensa Glúteo', 'Extensión Cadera', 'Step-Up Máquina', 'Curl Femoral'],
          8: ['Hip Thrust Máquina', 'Abducción Sentada', 'Prensa Glúteo', 'Extensión Cadera', 'Step-Up Máquina', 'Curl Femoral', 'Kickback Cable', 'Sentadilla Smith'],
          12: ['Hip Thrust Máquina', 'Abducción Sentada', 'Prensa Glúteo', 'Extensión Cadera', 'Step-Up Máquina', 'Curl Femoral', 'Kickback Cable', 'Sentadilla Smith', 'Aducción Máquina', 'Extensión Lumbar', 'Patada Cable', 'Hiperextensión']
        },
        mancuerna: {
          6: ['Hip Thrust Mancuerna', 'Peso Muerto Rumano', 'Sentadilla Goblet', 'Zancada Frontal', 'Step-Up Mancuerna', 'Hip Hinge'],
          8: ['Hip Thrust Mancuerna', 'Peso Muerto Rumano', 'Sentadilla Goblet', 'Zancada Frontal', 'Step-Up Mancuerna', 'Hip Hinge', 'Sentadilla Sumo', 'Zancada Búlgara'],
          12: ['Hip Thrust Mancuerna', 'Peso Muerto Rumano', 'Sentadilla Goblet', 'Zancada Frontal', 'Step-Up Mancuerna', 'Hip Hinge', 'Sentadilla Sumo', 'Zancada Búlgara', 'Patada de Burro', 'Abducción Pie', 'Peso Muerto Copa', 'Sentadilla Pulso']
        },
        corporal: {
          6: ['Puente Glúteo', 'Sentadilla Búlgara', 'Hip Thrust Unilat.', 'Patada Trasera', 'Sentadilla Sumo', 'Clamshell'],
          8: ['Puente Glúteo', 'Sentadilla Búlgara', 'Hip Thrust Unilat.', 'Patada Trasera', 'Sentadilla Sumo', 'Clamshell', 'Abducción Pie', 'Step-Up Sin Peso'],
          12: ['Puente Glúteo', 'Sentadilla Búlgara', 'Hip Thrust Unilat.', 'Patada Trasera', 'Sentadilla Sumo', 'Clamshell', 'Abducción Pie', 'Step-Up Sin Peso', 'Puente Unilateral', 'Sentadilla Lateral', 'Patada Lateral', 'Marcha Glúteo']
        }
      }
    },
    pierna: {
      masa: {
        maquina: {
          6: ['Sentadilla Hack', 'Prensa 45°', 'Extensión Cuádriceps', 'Curl Femoral', 'Prensa Pies Bajos', 'Abducción Máquina'],
          8: ['Sentadilla Hack', 'Prensa 45°', 'Extensión Cuádriceps', 'Curl Femoral', 'Prensa Pies Bajos', 'Abducción Máquina', 'Sentadilla Smith', 'Curl Fem. Parado'],
          12: ['Sentadilla Hack', 'Prensa 45°', 'Extensión Cuádriceps', 'Curl Femoral', 'Prensa Pies Bajos', 'Abducción Máquina', 'Sentadilla Smith', 'Curl Fem. Parado', 'Extensión Cadera', 'Step-Up Máquina', 'Prensa Unilateral', 'Sentadilla Sissy']
        },
        mancuerna: {
          6: ['Sentadilla Trasera Barra', 'Zancada Lateral Mancuerna', 'Peso Muerto Sumo', 'Extensión Pantorrilla', 'Zancada Búlgara', 'Sentadilla Copa'],
          8: ['Sentadilla Trasera Barra', 'Zancada Lateral Mancuerna', 'Peso Muerto Sumo', 'Extensión Pantorrilla', 'Zancada Búlgara', 'Sentadilla Copa', 'Peso Muerto Rumano', 'Step-Up Mancuerna'],
          12: ['Sentadilla Trasera Barra', 'Zancada Lateral Mancuerna', 'Peso Muerto Sumo', 'Extensión Pantorrilla', 'Zancada Búlgara', 'Sentadilla Copa', 'Peso Muerto Rumano', 'Step-Up Mancuerna', 'Zancada Frontal', 'Sentadilla Sumo', 'Hip Hinge', 'Curl Isquiotibial']
        },
        corporal: {
          6: ['Sentadilla Libre', 'Zancada Alterna', 'Sentadilla Búlgara', 'Sentadilla Pistol', 'Step-Up Sin Peso', 'Sentadilla Sumo'],
          8: ['Sentadilla Libre', 'Zancada Alterna', 'Sentadilla Búlgara', 'Sentadilla Pistol', 'Step-Up Sin Peso', 'Sentadilla Sumo', 'Sentadilla Lateral', 'Sentadilla Pulso'],
          12: ['Sentadilla Libre', 'Zancada Alterna', 'Sentadilla Búlgara', 'Sentadilla Pistol', 'Step-Up Sin Peso', 'Sentadilla Sumo', 'Sentadilla Lateral', 'Sentadilla Pulso', 'Zancada Frontal', 'Wall Sit', 'Salto Sentadilla', 'Caminata Isométrica']
        }
      },
      perder: {
        maquina: {
          6: ['Prensa 45° Ligera', 'Extensión Cuádriceps', 'Curl Femoral', 'Step-Up Máquina', 'Abducción Máquina', 'Sentadilla Smith'],
          8: ['Prensa 45° Ligera', 'Extensión Cuádriceps', 'Curl Femoral', 'Step-Up Máquina', 'Abducción Máquina', 'Sentadilla Smith', 'Prensa Unilateral', 'Curl Fem. Parado'],
          12: ['Prensa 45° Ligera', 'Extensión Cuádriceps', 'Curl Femoral', 'Step-Up Máquina', 'Abducción Máquina', 'Sentadilla Smith', 'Prensa Unilateral', 'Curl Fem. Parado', 'Sentadilla Hack', 'Aducción', 'Extensión Cadera', 'Prensa Pies Altos']
        },
        mancuerna: {
          6: ['Zancada Frontal', 'Sentadilla Goblet', 'Peso Muerto Rumano', 'Zancada Lateral', 'Step-Up Mancuerna', 'Sentadilla Sumo'],
          8: ['Zancada Frontal', 'Sentadilla Goblet', 'Peso Muerto Rumano', 'Zancada Lateral', 'Step-Up Mancuerna', 'Sentadilla Sumo', 'Zancada Búlgara', 'Hip Hinge'],
          12: ['Zancada Frontal', 'Sentadilla Goblet', 'Peso Muerto Rumano', 'Zancada Lateral', 'Step-Up Mancuerna', 'Sentadilla Sumo', 'Zancada Búlgara', 'Hip Hinge', 'Sentadilla Copa', 'Curl Isquiotibial', 'Zancada Reversa', 'Sentadilla Pulso']
        },
        corporal: {
          6: ['Sentadilla Sumo', 'Zancada Alterna', 'Sentadilla Búlgara', 'Sentadilla Lateral', 'Step-Up Sin Peso', 'Sentadilla Pulso'],
          8: ['Sentadilla Sumo', 'Zancada Alterna', 'Sentadilla Búlgara', 'Sentadilla Lateral', 'Step-Up Sin Peso', 'Sentadilla Pulso', 'Salto Sentadilla', 'Wall Sit'],
          12: ['Sentadilla Sumo', 'Zancada Alterna', 'Sentadilla Búlgara', 'Sentadilla Lateral', 'Step-Up Sin Peso', 'Sentadilla Pulso', 'Salto Sentadilla', 'Wall Sit', 'Sentadilla Pistol', 'Marcha Alta', 'Zancada Salta', 'Caminata Isométrica']
        }
      },
      mantener: {
        maquina: {
          6: ['Prensa 45°', 'Extensión Cuádriceps', 'Curl Femoral', 'Sentadilla Smith', 'Step-Up Máquina', 'Abducción Máquina'],
          8: ['Prensa 45°', 'Extensión Cuádriceps', 'Curl Femoral', 'Sentadilla Smith', 'Step-Up Máquina', 'Abducción Máquina', 'Sentadilla Hack', 'Curl Fem. Parado'],
          12: ['Prensa 45°', 'Extensión Cuádriceps', 'Curl Femoral', 'Sentadilla Smith', 'Step-Up Máquina', 'Abducción Máquina', 'Sentadilla Hack', 'Curl Fem. Parado', 'Prensa Unilateral', 'Aducción Máquina', 'Extensión Cadera', 'Prensa Pies Bajos']
        },
        mancuerna: {
          6: ['Sentadilla Goblet', 'Peso Muerto Rumano', 'Zancada Frontal', 'Step-Up Mancuerna', 'Sentadilla Sumo', 'Hip Hinge'],
          8: ['Sentadilla Goblet', 'Peso Muerto Rumano', 'Zancada Frontal', 'Step-Up Mancuerna', 'Sentadilla Sumo', 'Hip Hinge', 'Zancada Búlgara', 'Zancada Lateral'],
          12: ['Sentadilla Goblet', 'Peso Muerto Rumano', 'Zancada Frontal', 'Step-Up Mancuerna', 'Sentadilla Sumo', 'Hip Hinge', 'Zancada Búlgara', 'Zancada Lateral', 'Sentadilla Copa', 'Hip Thrust Mancuerna', 'Curl Isquiotibial', 'Sentadilla Pulso']
        },
        corporal: {
          6: ['Sentadilla Libre', 'Zancada Alterna', 'Sentadilla Búlgara', 'Step-Up Sin Peso', 'Sentadilla Sumo', 'Sentadilla Lateral'],
          8: ['Sentadilla Libre', 'Zancada Alterna', 'Sentadilla Búlgara', 'Step-Up Sin Peso', 'Sentadilla Sumo', 'Sentadilla Lateral', 'Sentadilla Pulso', 'Wall Sit'],
          12: ['Sentadilla Libre', 'Zancada Alterna', 'Sentadilla Búlgara', 'Step-Up Sin Peso', 'Sentadilla Sumo', 'Sentadilla Lateral', 'Sentadilla Pulso', 'Wall Sit', 'Sentadilla Pistol', 'Zancada Frontal', 'Sentadilla Copa', 'Salto Sentadilla']
        }
      }
    },
    superior: {
      masa: {
        maquina: {
          6: ['Press Pecho Máquina', 'Jalón al Pecho', 'Remo Máquina', 'Press Hombro', 'Curl Bíceps', 'Extensión Tríceps'],
          8: ['Press Pecho Máquina', 'Jalón al Pecho', 'Remo Máquina', 'Press Hombro', 'Curl Bíceps', 'Extensión Tríceps', 'Cruce Poleas', 'Face Pull'],
          12: ['Press Pecho Máquina', 'Jalón al Pecho', 'Remo Máquina', 'Press Hombro', 'Curl Bíceps', 'Extensión Tríceps', 'Cruce Poleas', 'Face Pull', 'Mariposa Máquina', 'Remo Sentado', 'Press Arnold Máquina', 'Pushdown Cable']
        },
        mancuerna: {
          6: ['Press Banca Mancuerna', 'Remo Unilateral', 'Press Hombro Mancuerna', 'Curl Alternado', 'Extensión Tríceps', 'Pullover'],
          8: ['Press Banca Mancuerna', 'Remo Unilateral', 'Press Hombro Mancuerna', 'Curl Alternado', 'Extensión Tríceps', 'Pullover', 'Elevación Lateral', 'Curl Martillo'],
          12: ['Press Banca Mancuerna', 'Remo Unilateral', 'Press Hombro Mancuerna', 'Curl Alternado', 'Extensión Tríceps', 'Pullover', 'Elevación Lateral', 'Curl Martillo', 'Mariposa Mancuerna', 'Remo Inclinado', 'Arnold Press', 'Patada Tríceps']
        },
        corporal: {
          6: ['Flexiones', 'Dominadas', 'Fondos Tríceps', 'Remo Invertido', 'Pike Push-Up', 'Superman'],
          8: ['Flexiones', 'Dominadas', 'Fondos Tríceps', 'Remo Invertido', 'Pike Push-Up', 'Superman', 'Flexión Diamante', 'Flexión Ancha'],
          12: ['Flexiones', 'Dominadas', 'Fondos Tríceps', 'Remo Invertido', 'Pike Push-Up', 'Superman', 'Flexión Diamante', 'Flexión Ancha', 'Archer Push-Up', 'L-Sit', 'Curl Isométrico', 'Elevación Frontal']
        }
      },
      perder: {
        maquina: {
          6: ['Cruce Poleas', 'Jalón al Pecho', 'Face Pull', 'Press Hombro', 'Curl Cable', 'Pushdown Cable'],
          8: ['Cruce Poleas', 'Jalón al Pecho', 'Face Pull', 'Press Hombro', 'Curl Cable', 'Pushdown Cable', 'Remo Sentado', 'Mariposa'],
          12: ['Cruce Poleas', 'Jalón al Pecho', 'Face Pull', 'Press Hombro', 'Curl Cable', 'Pushdown Cable', 'Remo Sentado', 'Mariposa', 'Press Pecho Máquina', 'Remo Máquina', 'Extensión Tríceps', 'Curl Predikador']
        },
        mancuerna: {
          6: ['Elevación Lateral', 'Curl Alternado', 'Remo Unilateral', 'Patada Tríceps', 'Curl Martillo', 'Elevación Frontal'],
          8: ['Elevación Lateral', 'Curl Alternado', 'Remo Unilateral', 'Patada Tríceps', 'Curl Martillo', 'Elevación Frontal', 'Press Arnold', 'Extensión Tríceps'],
          12: ['Elevación Lateral', 'Curl Alternado', 'Remo Unilateral', 'Patada Tríceps', 'Curl Martillo', 'Elevación Frontal', 'Press Arnold', 'Extensión Tríceps', 'Press Hombro', 'Mariposa Mancuerna', 'Pullover', 'Curl Concentrado']
        },
        corporal: {
          6: ['Flexiones', 'Pike Push-Up', 'Remo Invertido', 'Fondos Tríceps', 'Flexión Diamante', 'Superman'],
          8: ['Flexiones', 'Pike Push-Up', 'Remo Invertido', 'Fondos Tríceps', 'Flexión Diamante', 'Superman', 'Archer Push-Up', 'Flexión Ancha'],
          12: ['Flexiones', 'Pike Push-Up', 'Remo Invertido', 'Fondos Tríceps', 'Flexión Diamante', 'Superman', 'Archer Push-Up', 'Flexión Ancha', 'L-Sit', 'Pseudo Planche', 'Flexión Lenta', 'Isométrico Pecho']
        }
      },
      mantener: {
        maquina: {
          6: ['Press Pecho Máquina', 'Jalón al Pecho', 'Remo Sentado', 'Press Hombro', 'Curl Bíceps', 'Extensión Tríceps'],
          8: ['Press Pecho Máquina', 'Jalón al Pecho', 'Remo Sentado', 'Press Hombro', 'Curl Bíceps', 'Extensión Tríceps', 'Face Pull', 'Cruce Poleas'],
          12: ['Press Pecho Máquina', 'Jalón al Pecho', 'Remo Sentado', 'Press Hombro', 'Curl Bíceps', 'Extensión Tríceps', 'Face Pull', 'Cruce Poleas', 'Mariposa Máquina', 'Remo Máquina', 'Pushdown Cable', 'Curl Predikador']
        },
        mancuerna: {
          6: ['Press Banca', 'Remo Unilateral', 'Press Hombro', 'Curl Alternado', 'Extensión Tríceps', 'Elevación Lateral'],
          8: ['Press Banca', 'Remo Unilateral', 'Press Hombro', 'Curl Alternado', 'Extensión Tríceps', 'Elevación Lateral', 'Curl Martillo', 'Arnold Press'],
          12: ['Press Banca', 'Remo Unilateral', 'Press Hombro', 'Curl Alternado', 'Extensión Tríceps', 'Elevación Lateral', 'Curl Martillo', 'Arnold Press', 'Mariposa Mancuerna', 'Pullover', 'Patada Tríceps', 'Curl Concentrado']
        },
        corporal: {
          6: ['Flexiones', 'Dominadas', 'Fondos Tríceps', 'Remo Invertido', 'Superman', 'Pike Push-Up'],
          8: ['Flexiones', 'Dominadas', 'Fondos Tríceps', 'Remo Invertido', 'Superman', 'Pike Push-Up', 'Flexión Diamante', 'Flexión Ancha'],
          12: ['Flexiones', 'Dominadas', 'Fondos Tríceps', 'Remo Invertido', 'Superman', 'Pike Push-Up', 'Flexión Diamante', 'Flexión Ancha', 'Archer Push-Up', 'L-Sit', 'Curl Isométrico', 'Pseudo Planche']
        }
      }
    }
  };

  /* ── GUIONES_FIT · COPIA EXACTA DEL BLOQUE 5 (voz por motor, sin cambios) ── */
  var GUIONES_FIT = {
    masa: function (dia, grupo, series, equipo) {
      return 'Día ' + dia + ' del programa de hipertrofia. Hoy trabajamos ' + grupo + '. ' +
        'Primera serie: ' + series[0].kg + ' kilos por ' + series[0].reps + ' repeticiones. ' +
        'Progresión acumulada: más ' + ((dia - 1) * 0.2).toFixed(1) + ' por ciento. ' +
        'Descansa 90 a 120 segundos entre series. Equipamiento: ' + equipo + '. Vamos.';
    },
    perder: function (dia, grupo, series, equipo) {
      return 'Día ' + dia + ' del protocolo de definición. Zona de trabajo: ' + grupo + '. ' +
        'Empezamos con ' + series[0].kg + ' kilos por ' + series[0].reps + ' repeticiones. ' +
        'Máximo 45 segundos de descanso. Mantén la frecuencia cardíaca alta. ' +
        'Progresión: más ' + ((dia - 1) * 0.2).toFixed(1) + ' por ciento. Equipamiento: ' + equipo + '. Quema.';
    },
    mantener: function (dia, grupo, series, equipo) {
      return 'Día ' + dia + ' del plan de mantenimiento. Grupo muscular: ' + grupo + '. ' +
        'Carga estable de ' + series[0].kg + ' kilos por ' + series[0].reps + ' repeticiones. ' +
        'Descansa 60 a 90 segundos. Técnica perfecta hoy. ' +
        'Progresión día ' + dia + ': más ' + ((dia - 1) * 0.2).toFixed(1) + ' por ciento. Equipamiento: ' + equipo + '.';
    }
  };

  /* ── CLAVES LEGADO · idénticas a las que ya existen, SIN CAMBIOS ── */
  function claveImg(grupo, motor, equipo, nej, v) {
    return grupo + '_' + motor + '_' + equipo + '_' + nej + '_v' + v;
  }
  function claveVideo(dia, motor, grupo) {
    return 'dia' + dia + '_' + motor + '_' + grupo;
  }

  /* ── slug del nombre de ejercicio, IGUAL al patrón que ya usa el
     Bloque 5 en su comentario de ejemplo ("hip_thrust"): minúsculas,
     sin tildes, sin puntos, espacios y guiones → "_" ── */
  function slug(nombre) {
    return String(nombre)
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // quita tildes
      .toLowerCase()
      .replace(/[°.]/g, '')
      .replace(/[\s-]+/g, '_')
      .replace(/[^a-z0-9_]/g, '')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');
  }

  /* ── NN de 2 dígitos, tal como exige la regex del Bloque 5 (/_(\d{2})_/) ── */
  function nn(i) { return String(i).padStart(2, '0'); }

  /* ── CLAVES NUEVAS · EXACTAS a getClaseVideoClips() del Bloque 5 ──
     i es 1-based (1,2,3...nEjer). Se generan las DOS variantes que el
     Bloque 5 sabe leer: la específica de día y la genérica de clase. */
  function claveVideoEjConDia(dia, grupo, obj, equipo, nej, i, nombreEj) {
    return 'dia' + dia + '_' + grupo + '_' + obj + '_' + equipo + '_' + nej + '_' + nn(i) + '_' + slug(nombreEj);
  }
  function claveVideoEjSinDia(grupo, obj, equipo, nej, i, nombreEj) {
    return grupo + '_' + obj + '_' + equipo + '_' + nej + '_' + nn(i) + '_' + slug(nombreEj);
  }

  /* ── helper de rango de día: "Días 1-30", "Días 31-60"... ── */
  function rangoDia(dia) {
    var ini = Math.floor((dia - 1) / DIAS_POR_RANGO) * DIAS_POR_RANGO + 1;
    var fin = ini + DIAS_POR_RANGO - 1;
    return 'Días ' + ini + '-' + fin;
  }

  /* ── obtener la lista REAL de ejercicios de una combinación ──
     Devuelve copia (no la referencia interna) para que nadie la mute
     por accidente. Si la combinación no existe, devuelve []. */
  function ejerciciosDe(grupo, motor, equipo, nej) {
    var lst = (EJERCICIOS_DB[grupo] && EJERCICIOS_DB[grupo][motor] &&
      EJERCICIOS_DB[grupo][motor][equipo] && EJERCICIOS_DB[grupo][motor][equipo][nej]) || [];
    return lst.slice();
  }

  /* ── construir la "clase" (día+motor+grupo+equipo+nivel) con TODOS
     sus ejercicios y AMBAS claves de video por ejercicio (con día y
     sin día), más la clave de imagen LEGADO de la clase completa
     (sin ejercicio, tal como la usa getDriveURL del Bloque 5).
     No inventa ejercicios: los toma tal cual de EJERCICIOS_DB. ── */
  function construirClase(dia, motor, grupo, equipo, nej) {
    var ejercicios = ejerciciosDe(grupo, motor, equipo, nej);
    var niv = NIV_BY_NEJ[nej];
    var items = ejercicios.map(function (nombreEj, idx) {
      var i = idx + 1; // 1-based, igual que NN
      return {
        i: i,
        nombre: nombreEj,
        slug: slug(nombreEj),
        claveVideoConDia: claveVideoEjConDia(dia, grupo, motor, equipo, nej, i, nombreEj),
        claveVideoSinDia: claveVideoEjSinDia(grupo, motor, equipo, nej, i, nombreEj)
      };
    });
    return {
      dia: dia, motor: motor, grupo: grupo, equipo: equipo, nej: nej,
      niv: niv, nivNombre: NIV_LBL[niv],
      totalEjercicios: items.length,
      ejercicios: items,
      /* imagen: 1 lámina por clase completa, igual que siempre (sin ejercicio) */
      claveImgBase: grupo + '_' + motor + '_' + equipo + '_' + nej
    };
  }

  /* ── GENERADOR DEL CATÁLOGO (tarjetas) ──
     Genera tarjetas tipo "clase": una por cada combinación
     día × motor × grupo × equipo × nivel. Cada tarjeta de clase trae
     adentro la lista completa de ejercicios (con sus claves de video
     reales, con-día y sin-día) y la clave base de imagen de la clase
     (sin ejercicio), para que la biblioteca pinte un sub-listado
     expandible que coincide 1:1 con lo que el Bloque 5 sabe leer. */
  function buildConocimiento() {
    var C = {};

    Object.keys(GRUPO_LBL).forEach(function (grupo) {
      Object.keys(MOTOR_LBL).forEach(function (motor) {
        Object.keys(EQUIPO_LBL).forEach(function (equipo) {
          for (var dia = 1; dia <= DIAS; dia++) {
            var cat = GRUPO_ICO[grupo] + ' ' + GRUPO_LBL[grupo] + ' · ' + MOTOR_LBL[motor] + ' · ' + EQUIPO_LBL[equipo] + ' · ' + rangoDia(dia);
            if (!C[cat]) C[cat] = [];
            CANTIDADES.forEach(function (nej) {
              var clase = construirClase(dia, motor, grupo, equipo, nej);
              var niv = NIV_BY_NEJ[nej];
              C[cat].push({
                id: 'clase_dia' + dia + '_' + grupo + '_' + motor + '_' + equipo + '_' + nej,
                tipo: 'clase',
                n: 'Día ' + dia + ' · ' + GRUPO_LBL[grupo] + ' · ' + MOTOR_LBL[motor] + ' · ' + EQUIPO_LBL[equipo],
                dia: dia, grupo: grupo, motor: motor, equipo: equipo, nej: nej,
                niv: niv, nivNombre: NIV_LBL[niv],
                dur: 'Día ' + dia + ' · ' + NIV_LBL[niv] + ' · ' + nej + ' ej',
                color: MOTOR_COLOR[motor],
                ico: GRUPO_ICO[grupo],
                ejercicios: clase.ejercicios,
                totalEjercicios: clase.totalEjercicios,
                claveImgBase: clase.claveImgBase
              });
            });
          }
        });
      });
    });

    return C;
  }

  /* ── MOTOR DE PROMPTS · generación automática para copiar/pegar ──
     No llama a ninguna IA ni API: solo arma el TEXTO del prompt para
     que la persona lo copie y lo pegue en la herramienta que ya usa
     (Replicate u otra). No elimina ni reemplaza nada del flujo de
     guardado existente — es una capa adicional.
     Los prompts se generan DIRECTAMENTE EN INGLÉS (sin traductor ni
     API externa) porque la mayoría de modelos de imagen/video dan
     mejores resultados en inglés y así no se depende de ningún
     servicio adicional que pueda fallar o tener costo. */

  var EQUIPO_DESC_EN = {
    maquina: 'using professional gym machines (cable pulleys, leg press, multi-station equipment)',
    mancuerna: 'using dumbbells and free weights',
    corporal: 'using bodyweight only, no equipment'
  };
  var MOTOR_DESC_EN = {
    masa: 'hypertrophy training, heavy load, visible muscular effort, focused on building muscle mass',
    perder: 'high-intensity metabolic training, visible sweat, dynamic fast pace, focused on fat loss',
    mantener: 'controlled strength-maintenance training, steady consistent technique, focused on staying fit'
  };
  var GRUPO_DESC_EN = {
    gluteo: 'glutes and hips',
    pierna: 'legs (quadriceps, hamstrings, calves)',
    superior: 'upper body (chest, back, shoulders, arms)'
  };

  /* Traducción de cada nombre de ejercicio (mismo orden y mismas
     claves que EJERCICIOS_DB en español, NO se modifica esa lista:
     esta es solo una tabla de traducción para el texto del prompt). */
  var EJERCICIO_EN = {
    'Hip Thrust Máquina':'Machine Hip Thrust','Prensa Glúteo 45°':'45° Glute Press','Kickback Cable':'Cable Kickback',
    'Abducción Sentada':'Seated Hip Abduction','Step-Up con Carga':'Loaded Step-Up','Extensión Cadera':'Hip Extension',
    'Sentadilla Smith':'Smith Machine Squat','Curl Femoral':'Hamstring Curl','Hiperextensión':'Hyperextension',
    'Peso Muerto Máquina':'Machine Deadlift','Patada Trasera':'Glute Kickback','Aducción Sentada':'Seated Hip Adduction',
    'Hip Thrust Mancuerna':'Dumbbell Hip Thrust','Sentadilla Goblet':'Goblet Squat','Peso Muerto Rumano':'Romanian Deadlift',
    'Zancada Lateral':'Lateral Lunge','Step-Up Mancuerna':'Dumbbell Step-Up','Patada de Burro':'Donkey Kick',
    'Sentadilla Sumo':'Sumo Squat','Zancada Búlgara':'Bulgarian Split Squat','Hip Hinge':'Hip Hinge',
    'Abducción de Pie':'Standing Hip Abduction','Peso Muerto Copa':'Goblet Deadlift','Sentadilla Pulso':'Pulse Squat',
    'Hip Thrust Peso Corp.':'Bodyweight Hip Thrust','Sentadilla Búlgara':'Bulgarian Squat','Puente de Glúteo':'Glute Bridge',
    'Step-Up Sin Peso':'Bodyweight Step-Up','Sentadilla Pistol':'Pistol Squat','Clamshell':'Clamshell',
    'Puente Unilateral':'Single-Leg Glute Bridge','Sentadilla Lateral':'Lateral Squat','Patada Lateral':'Side Kick',
    'Abducción Máquina':'Machine Hip Abduction','Prensa Pies Altos':'High Foot Press','Aducción Máquina':'Machine Hip Adduction',
    'Sentadilla Hack':'Hack Squat','Patada Cable':'Cable Kick','Extensión Lumbar':'Lower Back Extension',
    'Zancada Frontal':'Forward Lunge','Step-Up Máquina':'Machine Step-Up','Zancada Alterna':'Alternating Lunge',
    'Hip Hinge Unilat.':'Single-Leg Hip Hinge','Marcha Glúteo':'Glute March','Prensa Glúteo':'Glute Press',
    'Hip Thrust Unilat.':'Single-Leg Hip Thrust',
    'Sentadilla Trasera Barra':'Back Barbell Squat','Zancada Lateral Mancuerna':'Dumbbell Lateral Lunge',
    'Peso Muerto Sumo':'Sumo Deadlift','Extensión Pantorrilla':'Calf Raise','Sentadilla Copa':'Cup Squat',
    'Prensa 45°':'45° Leg Press','Extensión Cuádriceps':'Quad Extension','Prensa Pies Bajos':'Low Foot Press',
    'Curl Fem. Parado':'Standing Hamstring Curl','Prensa Unilateral':'Single-Leg Press','Sentadilla Sissy':'Sissy Squat',
    'Sentadilla Libre':'Free Squat','Wall Sit':'Wall Sit','Salto Sentadilla':'Squat Jump','Caminata Isométrica':'Isometric Walk',
    'Prensa 45° Ligera':'Light 45° Leg Press','Aducción':'Hip Adduction','Curl Isquiotibial':'Hamstring Curl',
    'Zancada Reversa':'Reverse Lunge','Marcha Alta':'High March','Zancada Salta':'Jump Lunge',
    'Press Pecho Máquina':'Machine Chest Press','Jalón al Pecho':'Lat Pulldown','Remo Máquina':'Machine Row',
    'Press Hombro':'Shoulder Press','Curl Bíceps':'Bicep Curl','Extensión Tríceps':'Tricep Extension',
    'Cruce Poleas':'Cable Crossover','Face Pull':'Face Pull','Mariposa Máquina':'Machine Chest Fly',
    'Remo Sentado':'Seated Row','Press Arnold Máquina':'Machine Arnold Press','Pushdown Cable':'Cable Pushdown',
    'Press Banca Mancuerna':'Dumbbell Bench Press','Remo Unilateral':'Single-Arm Row','Press Hombro Mancuerna':'Dumbbell Shoulder Press',
    'Curl Alternado':'Alternating Curl','Pullover':'Pullover','Elevación Lateral':'Lateral Raise','Curl Martillo':'Hammer Curl',
    'Mariposa Mancuerna':'Dumbbell Chest Fly','Remo Inclinado':'Bent-Over Row','Arnold Press':'Arnold Press','Patada Tríceps':'Tricep Kickback',
    'Flexiones':'Push-Up','Dominadas':'Pull-Up','Fondos Tríceps':'Tricep Dips','Remo Invertido':'Inverted Row',
    'Pike Push-Up':'Pike Push-Up','Superman':'Superman','Flexión Diamante':'Diamond Push-Up','Flexión Ancha':'Wide Push-Up',
    'Archer Push-Up':'Archer Push-Up','L-Sit':'L-Sit','Curl Isométrico':'Isometric Curl','Elevación Frontal':'Front Raise',
    'Curl Cable':'Cable Curl','Mariposa':'Chest Fly','Press Arnold':'Arnold Press','Curl Predikador':'Preacher Curl',
    'Press Banca':'Bench Press','Pseudo Planche':'Pseudo Planche','Flexión Lenta':'Slow Push-Up','Isométrico Pecho':'Isometric Chest Hold',
    'Curl Concentrado':'Concentration Curl'
  };
  function ejercicioEN(nombreEs){ return EJERCICIO_EN[nombreEs] || nombreEs; }

  /* Prompt de LÁMINA de clase: collage/grid con TODOS los ejercicios
     de la combinación, coherente con lo que arma descargarJPG() del
     Bloque 5 (grid 3x2 / 4x2 / 3x4 según nej). Persona real + íconos
     técnicos de apoyo (flechas de movimiento, músculo resaltado).
     Texto completo en inglés. */
  function promptLamina(claseCard) {
    var grupo = GRUPO_DESC_EN[claseCard.grupo] || claseCard.grupo;
    var equipo = EQUIPO_DESC_EN[claseCard.equipo] || claseCard.equipo;
    var motor = MOTOR_DESC_EN[claseCard.motor] || claseCard.motor;
    var nombres = claseCard.ejercicios.map(function (e) { return e.i + '. ' + ejercicioEN(e.nombre); }).join(', ');
    var cols = claseCard.nej === 6 ? '3 columns x 2 rows' : claseCard.nej === 8 ? '4 columns x 2 rows' : '3 columns x 4 rows';

    return 'Technical fitness collage/grid layout (' + cols + '), dark professional background like a premium gym app. ' +
      'Show ' + claseCard.totalEjercicios + ' panels, one per exercise, each featuring a real person (vary the model in each panel, do not repeat the same person) correctly performing the movement, athletic body, fitted athletic wear, well-lit professional gym. ' +
      'Mixed style: realistic high-quality photography + overlaid technical iconography (white or neon-blue arrows indicating movement direction, muscle silhouette highlighted in color over the worked area: ' + grupo + '). ' +
      'Each panel must include a small text label with the exercise number and name. ' +
      'Training context: ' + motor + '. Equipment: ' + equipo + '. ' +
      'Exact list of the ' + claseCard.totalEjercicios + ' exercises to represent in order: ' + nombres + '. ' +
      'Cool studio lighting with neon blue/orange accents, high contrast, clean professional composition, no extra text outside the panel labels, no watermark, high resolution, vertical 3:4 format.';
  }

  /* Prompt de VIDEO de un ejercicio puntual: texto genérico en inglés,
     listo para copiar/pegar en cualquier herramienta de IA de video. */
  function promptVideo(claseCard, ejercicio) {
    var grupo = GRUPO_DESC_EN[claseCard.grupo] || claseCard.grupo;
    var equipo = EQUIPO_DESC_EN[claseCard.equipo] || claseCard.equipo;
    var motor = MOTOR_DESC_EN[claseCard.motor] || claseCard.motor;
    var nombreEn = ejercicioEN(ejercicio.nombre);

    return 'Short video (6-10 seconds, perfect loop) of a real person with an athletic body performing the exercise "' + nombreEn + '" ' +
      'with perfect, controlled technique, training ' + grupo + ', ' + equipo + '. ' +
      'Training context: ' + motor + '. ' +
      'Fixed camera shot, 3/4 side angle clearly showing the full execution of the movement (eccentric and concentric phase). ' +
      'Professional well-lit gym, clean blurred background, cool studio lighting with neon blue/orange accents. ' +
      'Fitted athletic wear, fluid and realistic motion, no abrupt cuts, static camera, high resolution, vertical 9:16 format. ' +
      'No on-screen text, no watermark.';
  }

  /* ── Lista plana de todas las tarjetas de clase (como FLAT en admin_motores) ── */
  function flat() {
    var f = [];
    Object.keys(CONOCIMIENTO_FITNESS).forEach(function (cat) {
      CONOCIMIENTO_FITNESS[cat].forEach(function (c) {
        var copia = {};
        for (var k in c) { if (Object.prototype.hasOwnProperty.call(c, k)) copia[k] = c[k]; }
        copia.cat = cat;
        f.push(copia);
      });
    });
    return f;
  }

  /* ── EXPOSICIÓN (misma convención que window.CONOCIMIENTO_P1/P2/P3) ── */
  var CONOCIMIENTO_FITNESS = buildConocimiento();
  window.CONOCIMIENTO_FITNESS = CONOCIMIENTO_FITNESS;

  /* API auxiliar, por si la biblioteca quiere usarla */
  window.MOTOR_FITNESS = {
    CONOCIMIENTO: CONOCIMIENTO_FITNESS,
    flat: flat,
    claveImg: claveImg,
    claveVideo: claveVideo,
    claveVideoEjConDia: claveVideoEjConDia,
    claveVideoEjSinDia: claveVideoEjSinDia,
    slug: slug,
    nn: nn,
    ejerciciosDe: ejerciciosDe,
    construirClase: construirClase,
    promptLamina: promptLamina,
    promptVideo: promptVideo,
    rangoDia: rangoDia,
    EJERCICIOS_DB: EJERCICIOS_DB,
    GUIONES_FIT: GUIONES_FIT,
    taxonomia: {
      grupos: GRUPO_LBL, motores: MOTOR_LBL, equipos: EQUIPO_LBL,
      niveles: NIV_LBL, nivPorEjercicios: NIV_BY_NEJ,
      cantidades: CANTIDADES, dias: DIAS, diasPorRango: DIAS_POR_RANGO, maxLaminas: MAX_LAMINAS
    }
  };
})();

---
name: leer-horario-turnos
description: >-
  Lee el cuadrante mensual de turnos de Eddeilis (el que le llega por WhatsApp) y
  extrae SUS turnos por color de celda, para actualizar el Planificador de Turnos
  (planificador_turnos.html) o darle el desglose por turno. Úsala SIEMPRE que
  Eddeilis (o el owner) suba una foto/imagen de un cuadrante, horario o "roster"
  del trabajo y quiera saber sus mañanas/tardes/noches/libres/vacaciones de un mes,
  imprimirlos, o cargarlos en la app — aunque no diga "escáner" ni "skill".
  Palabras que la disparan: "mi horario", "mi turno", "cuadrante", "léelo",
  "qué días trabajo", "mis días libres", "escanea mi horario de [mes]".
---

# Leer el horario de turnos (por color)

Eddeilis trabaja a turnos y cada mes le mandan por WhatsApp una **foto del cuadrante
del equipo**: una tabla con una fila por persona y una columna por día del mes. Su
fila es la de **EDDEILIS**. Esta habilidad convierte esa foto en su horario personal.

## La regla de oro: el turno es el COLOR, no la letra

En estos cuadrantes el turno de cada día está codificado por el **color de la celda**.
La letra, cuando la hay, solo confirma. **Los días de libre y de vacaciones suelen ir
SIN letra** (celda de color a secas), por eso NUNCA hay que leer solo letras: se lee color.

| Color de la celda | Turno | Letra que puede aparecer |
|---|---|---|
| 🟨 Amarillo | Mañana (6:00–14:00) | M |
| 🟦 Azul | Tarde (14:00–22:00) | T |
| 🟧 Naranja / ámbar | Noche (22:00–6:00) | N |
| 🟩 Verde | Libre (descanso) | (a menudo vacía) |
| 🟥 Rojo | Vacaciones / festivo | (a menudo vacía) |

Ojo con dos trampas del cuadrante:
- La **segunda fila de cabecera** son las iniciales del día de la semana e incluye
  **L (lunes) y M (martes)** — chocan con los códigos de turno. Nunca la cuentes como turnos.
- Las **letras del propio nombre** (p. ej. la L de EDDEILIS) no son turnos.

Por eso el enfoque correcto es **leer el color de cada casilla alineada a su columna de día**.

## Cómo hacerlo

Tienes dos caminos; el primero es el que usa la app y el segundo sirve para verificar.

### 1) En la app (lo normal para Eddeilis)
`planificador_turnos.html` ya trae el escáner por color arreglado:
1. Sección **"📷 Escanear mi horario"** → poner el mes/año → subir la foto.
2. El sistema busca la fila "EDDEILIS"; si no la encuentra, **toca su fila** en la imagen.
3. Revisar el preview y pulsar **Aplicar** → el calendario salta a ese mes.
4. **"Mis días por turno"** muestra día + fecha por turno; botones **Imprimir** y **Escuchar**.

Las funciones clave viven en el `<script>` de ese archivo: `escanearHorario`,
`detectarColumnas`/`centrosDia` (rejilla), `clasificarColor` (color→turno por tono HSV),
`leerFila` y `finalizarLectura`. Si hay que tocar el lector, es ahí.

### 2) Para verificar o extraer desde una foto (fuera de la app)
Usa el script bundled, que replica el mismo algoritmo validado:

```bash
python3 .claude/skills/leer-horario-turnos/scripts/leer_horario.py \
  <ruta_de_la_foto.jpg> --mes 7 --ano 2026 --row-frac 0.64
```

- `--mes` es 1–12 (julio = 7). `--ano` el año del cuadrante.
- La fila de Eddeilis se indica con `--row-y <pixel>` o `--row-frac <0..1>` (fracción de
  la altura). Para hallarla: abre la imagen con la herramienta Read, localiza visualmente
  la fila "EDDEILIS" y estima su altura relativa (o recorta una banda y léela, como se hizo
  al arreglar el escáner). Sin `--row-*`, el script lista las bandas de fila detectadas.
- Imprime los días agrupados por turno (con día de la semana) y avisa si no lee el mes entero.

## Umbrales de color (medidos en cuadrantes reales, por si hay que reajustar)

La clasificación es por **matiz (hue) HSV**, ignorando píxeles casi negros (texto) y
blancos/grises (celda sin color). Fronteras que funcionan en estos cuadrantes:
`rojo <20° o ≥345° = vacaciones · <52° = noche (ámbar ~45°) · <70° = mañana (amarillo ~60°) ·
70–170° = libre (verde ~89°) · 175–260° = tarde (azul ~196°)`. Si un cuadrante nuevo usa
tonos distintos, mide un par de celdas conocidas y ajusta estas fronteras (en el script y en
`clasificarColor` de la app).

## Verificación

Tras extraer, comprueba que el total de días leídos = días del mes y que un par de días que
Eddeilis reconozca (p. ej. el de hoy) coinciden. Referencia conocida: **julio 2026** de
Eddeilis salió M: 6,7,8,9,29 · T: 2,3,4,11,19,20,22,23,30,31 · N: 12,13,14,24,25 · L: 11 días.

## Notas
- El repo es HTML/CSS/JS puro, se publica en Netlify al fusionar a `main`. Todo en español.
- El nombre por defecto en la app es EDDEILIS; si el cuadrante lo escribe distinto, ese es el
  que hay que buscar/tocar.

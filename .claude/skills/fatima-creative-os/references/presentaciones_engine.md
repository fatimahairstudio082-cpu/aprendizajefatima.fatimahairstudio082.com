# presentaciones_engine

Módulo de **presentaciones y láminas**. Una presentación no es un documento con
diapositivas: es una narración con apoyo visual. Si las láminas se pueden leer
solas sin quien las presenta, están mal — eso es un informe, no un deck.

## Cómo generarlas

- **HTML/CSS → PDF** — la vía por defecto aquí: control total del diseño, sin
  depender de que haya nada instalado. Una lámina por sección, tamaño fijo.
- **Reveal.js / Marp / Slidev** — Markdown a láminas navegables y exportables.
  Buenos para decks técnicos y contenido que cambia a menudo.
- **python-pptx** — genera `.pptx` reales por código, editables por el cliente.
  Solo si la librería está disponible (`tool_selector`: comprobar antes).
- **Google Slides API** — cuando el deck debe vivir y editarse en Drive.

Si la herramienta ideal no está instalada, entrega el equivalente que sí puedas
producir y dilo — nunca dejes el encargo sin salida.

## Estándares de lámina

- **Una idea por lámina.** Si hay dos, son dos láminas.
- **Máximo ~6 líneas de texto.** El resto se dice hablando.
- **Retícula constante** en todas las láminas: márgenes, posición del título y
  del pie no se mueven. La estabilidad es lo que da aire de profesional.
- **Paleta limitada** (3-4 colores) y jerarquía tipográfica de 3 niveles.
- **Prohibidas las plantillas por defecto de Office/Slides.** Se reconocen a un
  metro y anulan cualquier identidad.
- **Contraste y tamaño de sala:** cuerpo mínimo equivalente a 18-20 pt; lo que no
  se lee desde el fondo, sobra.

## Arco narrativo del deck

Gancho → problema → tensión → propuesta → prueba (datos, casos) → cierre con
petición concreta. El detalle de estructura vive en `story_engine.md`; aquí solo
se maqueta. Reserva las láminas de mayor impacto visual para el gancho y el
cierre.

## Láminas de datos

Un gráfico por lámina, con el titular **ya interpretado** ("las ventas caen un
12 % en agosto"), no neutro ("ventas por mes"). Resalta el dato que importa y
apaga el resto. Ver `infographics_engine.md`.

## Formatos

16:9 estándar · 4:3 solo por exigencia del cliente · vertical para móvil o
carrusel social (`format_engine` recompone, no escala). Exporta siempre una
versión PDF ligera para enviar.

## Principio

La lámina apoya a quien habla; no lo sustituye ni compite con él. Menos texto,
más jerarquía, y una plantilla maestra propia de la marca que se pueda reutilizar
sin rehacer el diseño cada vez.

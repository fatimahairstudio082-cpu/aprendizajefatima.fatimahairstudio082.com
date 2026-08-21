# motion_engine

Motor de animación de **texto** y **objetos**. Mucho más amplio que un puñado de
transiciones. Es un vocabulario abierto: se amplía por módulos, no es una lista
cerrada.

## Texto

Conceptos que soporta (combínalos con criterio, no todos a la vez):

fade · rise · scale · reveal · mask · type-on · word reveal · character reveal ·
kinetic typography · split text · stretch · bounce · elastic · overshoot · blur ·
glitch · liquid · handwriting · outline reveal · 3D text · extrusion.

Guía rápida de intención:
- **Elegante/luxury** → fade, rise, mask reveal, outline reveal, lento y suave.
- **Enérgico/social** → word/character reveal rápido, bounce, overshoot, kinetic.
- **Tech/futurista** → glitch, type-on, blur, 3D text.
- **Handmade/orgánico** → handwriting, liquid.

## Objetos

scale · pan · zoom · rotation · orbit · float · parallax · follow path · magnetic
· morph · depth · stagger · perspective · camera push · camera pull.

- **parallax / depth / perspective** → sensación de profundidad (capas a
  distinta velocidad).
- **stagger** → varios elementos entran escalonados; da ritmo y orden de lectura.
- **camera push/pull, orbit** → lenguaje cinematográfico; coordina con
  `three_d_engine`.
- **magnetic / float / morph** → vida sutil, microinteracción, marca viva.

## Principios de buen movimiento

- **Motivado.** Cada animación tiene una razón: revelar jerarquía, dirigir la
  atención, dar continuidad o expresar carácter. Movimiento porque sí = ruido.
- **Easing, no lineal.** Las cosas arrancan y frenan; usa curvas (ease-out para
  entradas, ease-in-out para desplazamientos). El movimiento lineal se siente
  robótico.
- **Jerarquía temporal.** No todo entra a la vez: primero lo importante, luego el
  contexto (stagger). Guía la lectura en el tiempo.
- **Menos y mejor.** Una animación cuidada > cinco superpuestas. Si distrae del
  mensaje, simplifica (lo verificará `quality_engine`).
- **Coherencia de física.** Mantén una misma "física" (velocidades, rebotes,
  inercia) en toda la pieza para que se sienta de un mismo mundo.

## Ampliación modular

Nuevos efectos se añaden como entradas de este vocabulario, agrupados por familia
(texto / objeto / cámara). No hace falta reescribir el motor para crecer:
documenta el nuevo efecto, su intención y su easing típico.

# transition_engine

Transiciones entre escenas y planos. **No es una lista fija de 8**: es un sistema
de **familias** que puede crecer. Se elige la familia por el tono de la pieza y
la relación entre las dos escenas que une.

## Familias

- **cinematic** — cortes con intención, fundidos, dip-to-black/white, match cut.
- **3D** — giros de plano, cubos, flips con profundidad.
- **camera** — push, pull, whip pan, swish, dolly entre escenas.
- **morph** — un elemento se transforma en el siguiente (continuidad de forma).
- **liquid** — deformaciones fluidas, gotas, ondas.
- **geometric** — máscaras de formas, wipes, splits, grids.
- **mask** — revelado por máscara (texto, silueta, logo).
- **light** — flashes, destellos, lens flare, exposición.
- **blur** — desenfoque de salida/entrada, motion blur.
- **distortion** — RGB split, warp, ripple.
- **particle** — dispersión/agrupación de partículas.
- **paper / collage** — cortes, capas, rasgados, stop-motion.
- **depth** — capas que se separan y recomponen (parallax de transición).
- **object-based** — un objeto de la escena guía el corte (barre, tapa, revela).
- **glitch** — cortes digitales, datamosh (con mesura).
- **seamless** — transición invisible: parece un plano continuo.

## Cómo elegir

1. **Tono** del brief: luxury/editorial → cinematic, light, mask, seamless;
   social/juvenil → camera whip, glitch, morph, object-based; tech → 3D,
   distortion, particle; handmade → paper/collage.
2. **Relación entre escenas**: si comparten un elemento → morph u object-based
   (continuidad); si hay cambio de tema → un corte más marcado; si es el mismo
   ritmo → seamless.
3. **Ritmo**: en piezas rápidas, transiciones cortas y con energía; en piezas
   lentas, fundidos y mask reveals largos.

## Principios

- **Continuidad > espectáculo.** La mejor transición muchas veces es la que no
  se nota (seamless, match cut). Guarda las llamativas para momentos clave.
- **Consistencia de familia.** Elige una familia dominante por pieza; alternar
  diez tipos distintos rompe la unidad. Repite para crear lenguaje.
- **Motivada por el contenido.** La transición conecta ideas; no es relleno entre
  planos que no sabías cómo unir.
- **Coordina con** `motion_engine` (misma física), `three_d_engine` (cuando hay
  cámara/3D) y `timeline_engine` (duración exacta del cambio).

## Ampliación modular

Se añaden transiciones nuevas dentro de su familia. El sistema crece por familias;
no se rehace.

# tool_selector

Decide **qué tecnología** conviene para cada trabajo. No hay una herramienta por
defecto para todo: se elige por **calidad + rendimiento + compatibilidad + coste
+ complejidad**.

## Herramientas y su terreno

- **Canvas 2D** — render pixelado dinámico, muchas partículas/puntos, juegos
  ligeros, manipulación de imagen en cliente. Rápido, pero no vectorial.
- **SVG** — gráficos vectoriales nítidos y **animables** (ideal para infografías,
  iconos, logos, texto que se dibuja). Escala sin perder calidad; ligero.
- **CSS (+ HTML)** — animaciones de UI y texto, transiciones, layouts. Barato,
  compatible, suficiente para gran parte del motion 2D en web.
- **WebGL** — 3D/2D acelerado por GPU, shaders, efectos pesados. Potente pero más
  complejo y con coste de compatibilidad.
- **Three.js** — 3D en navegador de forma manejable (producto, logo, texto 3D,
  cámaras). La opción por defecto para 3D interactivo web (`three_d_engine`).
- **FFmpeg** — render y composición de **vídeo** (concatenar, encodear, mezclar
  audio, quemar subtítulos). El caballo de batalla para exportar el resultado.
- **IA de imagen** — cuando se necesita fotorrealismo, escenas o texturas
  imposibles de montar a mano en tiempo. Coste por generación.
- **IA de vídeo** — clips generados; útil para B-roll o planos irreales. Coste y
  control limitado; revisar calidad.
- **TTS** — voz sintética (`voice_audio_engine`) cuando no hay locución humana.
- **Web Audio API** — control fino de audio en navegador (mezcla, efectos,
  sincronía) para experiencias interactivas.
- **Otras herramientas disponibles** — usa las que el entorno ofrezca (p. ej.
  render offline si existe) cuando mejoren el resultado.

## Cómo elegir

1. **¿Estático o en movimiento? ¿2D o 3D?** → acota la familia.
2. **¿Dónde se consume?** Web navegador → CSS/SVG/Canvas/Three.js/WebGL; vídeo
   exportado → FFmpeg como capa final; impresión → vectorial/alta resolución.
3. **¿Qué calidad exige** vs. **qué rendimiento y compatibilidad** soporta el
   destino? (Un WebGL pesado no va en cualquier móvil.)
4. **¿Cuánto cuesta** (tiempo, dinero, complejidad)? La solución más simple que
   cumple gana. No metas Three.js si un SVG animado resuelve.
5. **Combina capas**: p. ej. 3D en Three.js → capturado a frames → montado con
   FFmpeg junto a voz TTS y música. Cada herramienta en su tramo.

## Encaje con el ecosistema

Cuando la salida se implemente **en este repo**, respeta que es un sitio estático
vanilla sin build: prefiere Canvas/SVG/CSS y scripts autocontenidos; nada de
bundlers ni frameworks (ver `CLAUDE.md`). La sofisticación técnica se logra con
las herramientas ya disponibles, no introduciendo tooling nuevo.

## Principio

La herramienta sirve al resultado, no al revés (regla principal del OS:
Tecnología va la última). Elige la que consiga el mejor resultado con el menor
coste y la mayor compatibilidad; evita la sobreingeniería.

# format_engine

Adaptación multiformato. Una misma idea debe poder existir en varios formatos —
pero **recomponiéndose**, no estirándose.

## Formatos habituales

- **9:16** — vertical (TikTok, Reels, Shorts, Stories).
- **4:5** — feed vertical (Instagram): más alto que ancho, buen alcance en feed.
- **1:1** — cuadrado (feed clásico, versátil).
- **16:9** — horizontal (YouTube, web, presentaciones, TV).
- **A4** — impresión / PDF (folletos, carteles, dossiers).
- **web** — responsive; se recompone por breakpoints.
- **presentación** — diapositivas 16:9 (o 4:3), una idea por slide.

## Regla: recomponer, no estirar

Cambiar de formato **no** es escalar el mismo diseño. Es rehacer la composición
para el nuevo lienzo:

- Reordena la **jerarquía** según la nueva forma (en 9:16 el foco sube; en 16:9
  se reparte horizontal).
- Reubica el **texto** y ajusta su tamaño para la legibilidad del soporte
  (móvil ≠ impresión).
- Replantea el **encuadre** de imagen/vídeo (un plano bueno en horizontal puede
  necesitar otro encuadre en vertical, no un recorte forzado).
- Respeta **zonas seguras** (UI de la plataforma, sangrados en impresión).
- Mantén la **identidad** (colores, tipos, tono): cambia el layout, no la marca.

## Flujo recomendado

1. Diseña primero en el formato **principal** (donde vivirá sobre todo la pieza).
2. Identifica los **elementos invariables** (logo, claim, foco, CTA).
3. Recompón cada formato adicional colocando esos invariables según su nueva
   jerarquía.
4. Verifica legibilidad y zonas seguras en cada uno (`quality_engine`).

## Principio

El mismo concepto, la misma marca, distinta composición. Una idea bien pensada
sobrevive el cambio de formato porque su **mensaje** es independiente del lienzo;
solo cambia cómo se organiza para que funcione en cada sitio.

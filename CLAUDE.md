# Estudio Universal Pro — orientación para Claude Code

## Qué es esto
Aplicación web de un solo archivo de entrada más módulos de apoyo. No hay build, no hay npm,
no hay bundler. Se abre en el navegador tal cual.

## Entrada
`Estudio Universal Pro.dc.html` — es un "Design Component": el archivo contiene una plantilla
`<x-dc>` y una clase `Component extends DCLogic`. El runtime está en `support.js` (no editar).
Dentro de `<helmet>` se cargan, por `<script src>`, todos los módulos `b6_*.js`.

Los `src` llevan un sufijo `?v=<timestamp>` para romper caché del navegador. **Si editas un
módulo `b6_*.js` y no ves el cambio, sube ese número en todas las líneas del `<helmet>`.**
Ese es el fallo de caché más frecuente aquí.

## Módulos (todos en la raíz)
Cada `b6_*.js` se registra solo en `window` o como custom element, y se monta desde la
plantilla con `<x-import component-from-global-scope="…" from="./b6_x.js">`.

- `b6_cerebro.js` — motor de conocimiento: genera las explicaciones automáticas de los pasos.
- `b6_divisiones.js` — particiones y divisiones de la cabeza.
- `b6_cortes.js` — catálogo y lógica de cortes.
- `b6_guias_3d.js` — vista de guías 3D: cabeza, pasos, elevaciones, foto de la clienta
  (capa de fondo bajo la cabeza, opacidad 46%, no se pinta en modo dos cabezas).
- `b6_estudios.js` — el maniquí en el resto de disciplinas; aquí sí existen los controles de
  posición (rejilla de nueve huecos) y tamaño de imagen.
- `b6_voz.js` — síntesis de voz / narración.
- `b6_bandeja.js` — bandeja de trabajo.
- `b6_folleto_motor.js`, `b6_folleto_disenos.js`, `b6_folleto_cerebro.js` — folletos.
- `b6_laminas_motor.js`, `b6_laminas_disenos.js` — láminas.
- `b6_examen.js` — exámenes.
- `b6_volantes.js` — volantes.

Otros: `Canvas.dc.html` (lienzo de exploraciones), `_ds/` (sistemas de diseño vinculados),
`uploads/` (material subido por la usuaria), `screenshots/`.

## Cómo ejecutarlo en local
Hace falta servirlo por HTTP (los `<script src>` relativos no funcionan con `file://`):

    python3 -m http.server 8000

y abrir `http://localhost:8000/Estudio%20Universal%20Pro.dc.html`.

## Reglas de estilo del proyecto
- Estilos **en línea**, no hojas de estilo ni clases. En `<helmet>` solo `@font-face`,
  `@keyframes` y resets.
- JavaScript clásico, sin TypeScript, sin `import`/`export` en los módulos `b6_*`.
- El idioma de toda la interfaz y de los comentarios del código es español.
- Los cambios pedidos son quirúrgicos: tocar solo lo pedido, no rediseñar lo demás.

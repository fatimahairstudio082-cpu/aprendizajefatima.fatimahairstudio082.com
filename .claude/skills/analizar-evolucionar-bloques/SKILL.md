---
name: analizar-evolucionar-bloques
description: >-
  Analiza y hace evolucionar cualquier bloque de la app Fátima Pro (corte,
  colorimetría, academia, nutrición, fitness, herramientas, construcción,
  ejercicios y el hub). Audita el bloque, cruza oportunidades de negocio y — con
  tu OK — implementa la mejora de forma aditiva sin romper los duplicados
  (index↔hub, bloque3↔peluqueria) ni los contratos de datos de Firebase. Úsala
  SIEMPRE que alguien pida analizar, mejorar, modernizar, hacer crecer o
  "evolucionar" un bloque, agregarle algo, monetizar la app, proponer bloques
  nuevos o montar automatizaciones. Dispárala aunque no digan "skill": frases
  como "analiza el bloque de fitness", "cómo mejoro la calculadora", "qué le
  agrego a la academia", "dame ideas para ganar dinero con esto", "qué bloque
  nuevo pongo" o "automatiza X" deben activarla. Palabras que la disparan:
  "analiza", "evoluciona", "mejora", "moderniza", "haz crecer", "qué le agrego",
  "monetizar", "ganar dinero", "bloque nuevo", "bloque autónomo", "automatizar".
---

# Analizar y evolucionar bloques de Fátima Pro

Esta skill es el copiloto para hacer crecer la app **sin romperla**. Fátima Pro es un
sitio estático (HTML/CSS/JS plano, sin build) donde cada mejora histórica ha sido
**aditiva**: un patch-script o un bloque guardado, nunca una reescritura. Respeta esa
tradición o romperás datos de alumnas y flujos que ya funcionan.

## Regla de oro (no negociable)

1. **Aditivo, no destructivo.** Prefiere agregar un `<script src="...js">` que
   monkey-parchea al cargar (con guard `window._X_LOADED`) antes que reescribir un HTML
   grande. Ver `references/evolucion_playbook.md`.
2. **Nunca rompas contratos de datos.** Las claves de documentos Firestore/Storage y el
   `claseId` son contratos entre el lado admin/generador y las páginas de las alumnas.
   Si dudas, consulta al subagente `guardian-firebase` antes de tocar nada.
3. **Sincroniza los duplicados.** `index.html` ↔ `fatima_hub.html` son el mismo hub;
   `bloque3_academia_pagos.html` ↔ `fatima_peluqueria.html` (edita el primero). Un cambio
   en uno casi siempre necesita el mismo cambio en su gemelo.
4. **Texto visible siempre en español.**
5. **`firestore.rules` se despliega a mano** (pegando en la consola de Firebase). Pushear
   a Netlify NO lo actualiza. Si tu cambio necesita nuevas reglas, dilo explícitamente.

## Cómo trabajar una petición

1. **Identifica el bloque objetivo.** Traduce el nombre coloquial → archivo real usando
   `references/inventario_bloques.md` (p.ej. "el de fitness" → `bloque5_fitness.html`).
   Si no está claro, pregunta.
2. **Lee el archivo real + su ficha** en el inventario. Para localizar una función o
   pantalla dentro de archivos grandes (>100 KB) sin cargarlos enteros, usa el subagente
   `explorador-sistema`.
3. **Corre el checklist de diagnóstico** de `references/diagnostico.md` (UX, monetización,
   datos, seguridad, rendimiento, i18n, sincronía de duplicados).
4. **Cruza oportunidades** con `references/monetizacion.md`,
   `references/bloques_autonomos.md` y `references/automatizaciones.md`.
5. **Presenta diagnóstico + propuesta priorizada** (impacto vs esfuerzo) y **pide OK**
   antes de escribir código. No implementes cambios grandes sin confirmación.
6. **Implementa con el OK**, siguiendo `references/evolucion_playbook.md`.
7. **Verifica** antes de dar por hecho:
   - `guardian-firebase` si tocaste datos/Firestore/Drive.
   - `guardian-seguridad` si tocaste login, permisos, reglas, claves o tokens.
   - `revisor-fatima` **siempre** (duplicados sincronizados, español, estilo aditivo).

## Mapa de módulos (`references/`)

- `inventario_bloques.md` — qué es y qué hace cada bloque + avisos clave por bloque.
- `diagnostico.md` — checklist de auditoría por ejes para puntuar un bloque.
- `evolucion_playbook.md` — cómo evolucionar sin romper (patrón patch-script, duplicados,
  contratos, Drive, reglas).
- `monetizacion.md` — 10 ideas de monetización que resuelven problemas reales + cómo
  priorizarlas.
- `bloques_autonomos.md` — categorías de bloques autónomos nuevos a agregar.
- `automatizaciones.md` — catálogo de automatizaciones para el sistema.

## Encaje con el ecosistema

- Para piezas visuales/audiovisuales de una mejora (banners, reels, carteles), delega en la
  skill `fatima-creative-os`.
- Para generar o auditar media de clases/fitness, usa el subagente `agente-generador`.
- El pozo global de créditos (`usuarios/{uid}.creditos`) se maneja SOLO por el hub vía
  `hub_credito_bridge.js` (transacción atómica); los bloques nunca debitan directo. Cualquier
  monetización basada en créditos pasa por ese puente.

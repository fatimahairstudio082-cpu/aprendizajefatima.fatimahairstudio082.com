---
name: analizar-evolucionar-bloques
description: >-
  Analiza y hace evolucionar cualquier bloque de la app Fátima Pro (corte,
  colorimetría, academia, nutrición, fitness, herramientas, construcción,
  ejercicios y el hub). Audita el bloque, cruza oportunidades de negocio con
  control estricto de costes y — con tu OK — implementa la mejora de forma
  aditiva sin romper los duplicados (index↔hub, bloque3↔peluqueria) ni los
  contratos de datos de Firebase. Nunca introduce gasto externo sin informe
  económico y aprobación explícita. Úsala
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
6. **Coste bajo control (regla económica, abajo).** Ninguna propuesta que pueda gastar
   dinero avanza sin informe económico y aprobación explícita.

## Regla económica (obligatoria y no negociable)

Antes de **proponer o implementar** cualquier funcionalidad que pueda generar costes
externos —IA, Replicate, APIs, WhatsApp, correo, almacenamiento, Firebase, Netlify,
schedulers, generación de imágenes o vídeos, servicios de terceros, etc.— la skill DEBE:

1. **Identificar el servicio externo** que utilizaría.
2. **Indicar su modelo de precio:** gratuito, de pago por uso, o recurrente.
3. **Identificar quién asume el coste** (el owner, la alumna, un tercero).
4. **Estimar el coste por operación o por usuario** cuando sea posible.
5. **Estimar escenarios de 10, 100 y 1.000 usuarios** cuando sea relevante.
6. **Indicar el posible coste mensual.**
7. **Buscar primero una alternativa gratuita, local o de coste mínimo.**
8. **Proponer límites de uso, cuotas, créditos, rate limits** o mecanismos de protección.
9. **Identificar riesgos de consumo inesperado.**
10. **Pedir aprobación explícita** antes de implementar cualquier cosa que pueda gastar.

Si el precio real no está disponible, **indícalo claramente como "coste pendiente de
determinar". Nunca inventes precios.**

### Regla de no gasto silencioso
Ninguna evolución debe introducir **llamadas ilimitadas** a servicios externos. Toda
funcionalidad que pueda generar coste debe contemplar, cuando corresponda: límite de
llamadas · límite diario · límite mensual · timeout · control de reintentos · protección
contra loops · control de errores · registro del consumo · mecanismo de desactivación ·
presupuesto/cuota máxima cuando el proveedor lo permita. **Una automatización nunca debe
poder ejecutarse indefinidamente y generar costes en silencio.**

### Informe económico obligatorio
Cuando una propuesta pueda generar costes, preséntala con esta ficha (usa "pendiente de
determinar" donde falten datos, nunca cifras inventadas):

- **Problema**
- **Solución**
- **Coste de construcción**
- **Coste por operación**
- **Coste por usuario**
- **Coste mensual estimado** (con escenarios 10 / 100 / 1.000 usuarios si aplica)
- **Proveedor o servicio implicado**
- **Quién paga**
- **Cómo se recupera el coste**
- **Alternativa gratuita o de bajo coste**
- **Riesgos** (incluido consumo inesperado)
- **Límites recomendados**
- **Recomendación final**

### Control de IA
Toda propuesta que use IA debe analizar antes: qué parte necesita **realmente** IA · si se
puede resolver con JavaScript, reglas, plantillas, datos existentes o lógica determinista ·
si hay alternativa gratuita · coste por ejecución · cómo limitar el consumo · si se pueden
cobrar créditos por esa acción · qué margen hace falta para que sea rentable. **No uses IA
cuando una solución determinista resuelva el mismo problema correctamente.**

### Regla de rentabilidad
Toda funcionalidad con coste variable necesita una estrategia para cubrirlo. Comprueba:

> **INGRESO POR USO > COSTE REAL POR USO** (considerando también almacenamiento,
> procesamiento, APIs y mantenimiento).

Si una función puede generar pérdidas, márcala como
**🔴 NO RECOMENDADA HASTA CAMBIAR EL MODELO ECONÓMICO.**

### Separación entre skill y producto
Distingue siempre:
- **A. Herramientas internas** que usa la skill para analizar, diseñar y evolucionar el
  sistema (subagentes, diagnósticos, planes).
- **B. Funcionalidades que *podrían* incorporarse al producto** (chatbot, CRM, WhatsApp,
  generación de media, automatizaciones, etc.).

Nada del grupo B se considera existente ni gratuito por el hecho de aparecer en esta
documentación: es una **propuesta que requiere análisis técnico y económico** antes de
implementarse.

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
5. **Filtra por coste (obligatorio).** Si la propuesta puede gastar dinero, aplica la
   **Regla económica** de arriba y adjunta el **informe económico**. Si puede generar
   pérdidas, márcala 🔴. Prefiere siempre la variante determinista o gratuita.
6. **Presenta diagnóstico + propuesta priorizada** (impacto vs esfuerzo **vs coste**) y
   **pide OK** antes de escribir código. Para cualquier cosa que gaste dinero, pide
   **aprobación explícita del gasto**, no solo del cambio.
7. **Implementa con el OK**, siguiendo `references/evolucion_playbook.md`. Toda llamada
   externa lleva sus límites (no gasto silencioso) desde la primera versión.
8. **Verifica** antes de dar por hecho:
   - `guardian-firebase` si tocaste datos/Firestore/Drive.
   - `guardian-seguridad` si tocaste login, permisos, reglas, claves o tokens.
   - `revisor-fatima` **siempre** (duplicados sincronizados, español, estilo aditivo).

## Mapa de módulos (`references/`)

- `inventario_bloques.md` — qué es y qué hace cada bloque + avisos clave por bloque.
- `diagnostico.md` — checklist de auditoría por ejes para puntuar un bloque.
- `evolucion_playbook.md` — cómo evolucionar sin romper (patrón patch-script, duplicados,
  contratos, Drive, reglas).
- `monetizacion.md` — modelos de monetización priorizados por economía real (la suscripción
  es la última opción, solo con justificación); ideas con su implicación de coste.
- `bloques_autonomos.md` — categorías de bloques autónomos, clasificadas por nivel de coste.
- `automatizaciones.md` — catálogo de automatizaciones, cada una con su bandera de coste y su
  mecanismo de control obligatorio.

## Encaje con el ecosistema

- Para piezas visuales/audiovisuales de una mejora (banners, reels, carteles), delega en la
  skill `fatima-creative-os`.
- Para generar o auditar media de clases/fitness, usa el subagente `agente-generador`.
- El pozo global de créditos (`usuarios/{uid}.creditos`) se maneja SOLO por el hub vía
  `hub_credito_bridge.js` (transacción atómica); los bloques nunca debitan directo. Cualquier
  monetización basada en créditos pasa por ese puente.

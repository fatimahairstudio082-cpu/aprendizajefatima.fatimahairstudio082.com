# Categorías de bloques autónomos (clasificadas por coste)

"Autónomo" = aporta valor **sin intervención manual constante del admin**. Pero autónomo **no**
significa gratis: un bloque que corre solo con IA o APIs puede gastar solo. Por eso cada
propuesta se clasifica por **coste externo** y **no se recomienda IA/automatización solo porque
sea técnicamente posible**. La prioridad es **resolver problemas reales con el menor coste
operativo**. Todo lo 🟠/🔴 exige informe económico + límites antes de implementarse.

Niveles: 🟢 autónomo **sin** coste externo · 🟡 coste **bajo** · 🟠 coste **variable** · 🔴 riesgo
de coste **elevado**.

Recordatorio (separación skill/producto): ninguna de estas funcionalidades existe todavía; son
**propuestas** que requieren análisis técnico y económico.

## A. Gestión del negocio de la alumna  → **la de mayor prioridad**
La que más fideliza y, además, la de menor coste: casi todo es lógica determinista sobre datos
que ya se guardan.
- **CRM de clientas** — 🟢 historial de fórmula/color y notas por clienta (escrituras/lecturas
  Firestore que ya se pagan). Sin IA ni APIs.
- **Agenda / reservas** — 🟢 la agenda en sí; el **recordatorio** es 🟢 si es enlace `wa.me`
  manual, 🟠/🔴 si es envío automático por API de pago (ver `automatizaciones.md` #3).
- **Finanzas del salón** — 🟢 registro y dashboards calculados en cliente.
- **Portafolio público auto-generado** — 🟢 en generación (HTML desde fotos ya subidas); vigila
  solo el **coste de almacenamiento** de las imágenes (🟡 si crece mucho).

## B. Comunidad y engagement
Se alimenta del contenido de las usuarias.
- **Foro / comunidad** — 🟢 en coste externo (Firestore). El coste real es de **moderación**
  (tiempo/seguridad), no de infraestructura; contempla anti-abuso.
- **Retos y plan semanal auto-generado** — 🟢 si el reto se arma con **plantillas/lógica**
  (extiende el "Plan Semanal" de `bloque9_ejercicios.html`); 🟠 solo si se genera con IA — y ahí
  hay que justificar por qué la IA es necesaria frente a una rotación de plantillas.
- **Ranking y logros** — 🟢 datos ya en Firestore.

## C. Inteligencia / asistente autónomo  → **la de mayor riesgo de coste**
- **Chatbot experto 24/7** — 🔴 si responde con un LLM por cada mensaje: coste por conversación,
  escalable con el número de usuarias, con riesgo de consumo inesperado. *Antes de proponerlo*
  aplica **Control de IA**: ¿basta una **búsqueda determinista** sobre el catálogo `MOTOR` (360
  clases) y FAQ con respuestas predefinidas? Suele bastar y es 🟢. Si se usa LLM: límite de
  mensajes por usuaria/día, créditos que cubran el coste, timeout, y aprobación explícita.
- **Tendencias auto-actualizado** — 🟢 si el owner publica en `noticias` (manual/curado); 🟠/🔴
  si "trae tendencias solo" vía API/scraping/IA. Preferir curado o fuente gratuita.

## D. Comercio
- **Tienda / catálogo de productos** — 🟢 en coste externo (enlaces de compra/afiliación).
- **Marketplace de clases sueltas** — 🟢 (reusa catálogo + créditos existentes).

## Cómo elegir el siguiente bloque
1. ¿Resuelve un problema que la alumna/peluquera tiene **todos los días** (no solo mientras
   estudia)? → la categoría **A** suele ganar, y encima es la más barata.
2. ¿Funciona **sin que el admin lo alimente** y **sin coste externo por uso**? Si necesita IA o
   APIs de pago, replantéalo: primero la variante determinista.
3. ¿Reusa Firebase + créditos + header común? Cuanto más reuse, menor coste de construcción.
4. Constrúyelo **aditivo**: nuevo `bloqueN_xxx.html` + registro como iframe en el hub (sincroniza
   `index.html` y `fatima_hub.html`) + colección Firestore nueva con sus reglas (que se pegan a
   mano en la consola).
5. Para cualquier bloque 🟠/🔴: **informe económico + límites + aprobación explícita** antes de
   una sola línea de integración con el servicio de pago.

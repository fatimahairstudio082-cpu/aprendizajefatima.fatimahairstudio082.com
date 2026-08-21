# Checklist de diagnóstico de un bloque

Recorre estos 8 ejes. Para cada uno da un veredicto (🟢 bien / 🟡 mejorable / 🔴 problema) y
una nota concreta. Al final, prioriza por **impacto vs esfuerzo vs coste**.

## 1. UX / claridad
- ¿La primera pantalla explica en 5 segundos qué hace el bloque y qué gana la alumna?
- ¿Hay estados vacíos claros (sin datos, sin créditos, cargando, error)?
- ¿El resultado se puede guardar/compartir (PDF, JPG, WhatsApp)?
- ¿Funciona bien en móvil (es una PWA)? ¿Botones tocables, sin scroll horizontal?

## 2. Monetización
- ¿El bloque cobra por sus acciones de valor, o regala lo caro?
- ¿El modelo elegido encaja con el problema y el coste real, sin asumir suscripción por defecto
  (ver el orden de preferencia en `monetizacion.md`)?
- ¿Hay un momento natural de cobro (justo cuando la alumna ve el valor)?
- ¿Se puede convertir una acción educativa en un servicio de pago?
- ¿El coste real (IA/Replicate, generación) está **cubierto** por lo que cobra
  (**INGRESO POR USO > COSTE REAL POR USO**)? Si no, es 🔴.

## 3. Datos / contratos Firebase
- ¿Lee/escribe claves de documentos que otras páginas dependen? (No cambiar formas existentes.)
- ¿Los links de Drive se convierten al formato correcto antes de guardar (imágenes
  `thumbnail?...w1400`, videos `.../preview`)?
- ¿Los errores de permisos se muestran (status bar/toast) o fallan en silencio?
- ¿El debitado de créditos pasa por el hub (`hub_credito_bridge.js`) y no directo en el bloque?

## 4. Seguridad
- ¿Renderiza `nombre`/`email` de alumnas con `innerHTML` sin escapar? (Debe usar `esc()`.)
- ¿Depende de checks de admin por email (`fatimahairstudio082@gmail.com`) en cliente que
  también estén respaldados por `firestore.rules`?
- ¿Expone claves/tokens en el HTML? (Las llamadas IA deben ir por las funciones Netlify.)
- Si toca login/permisos/reglas → pasar por `guardian-seguridad`.

## 5. Rendimiento
- Tamaño del archivo (varios >100 KB con CSS/JS inline). ¿Se puede extraer lógica nueva a un
  patch-script en vez de inflar el HTML?
- ¿Carga librerías pesadas (jsPDF, html2canvas, React) solo cuando se necesitan?
- ¿El service worker (`fatima-pro-v1`) cachea bien lo nuevo? (No cachea cross-origin.)

## 6. Accesibilidad / i18n
- ¿Texto visible en español? ¿Contraste suficiente sobre el dorado `#c9a84c`?
- ¿TTS disponible donde ayuda a la alumna?
- ¿Se beneficiaría de i18n? (bloque9 ya tiene `applyAppLang` como patrón.)

## 7. Sincronía de duplicados
- Si el cambio toca el hub → replicar en `index.html` **y** `fatima_hub.html`.
- Si toca la academia → recordar que `fatima_peluqueria.html` es gemelo (editar
  `bloque3_academia_pagos.html`).
- ¿El cambio depende de un motor/bridge compartido que otros bloques también usan?

## 8. Coste y economía externa
- ¿El bloque hace (o la mejora haría) llamadas a servicios externos de pago (IA, Replicate,
  APIs, WhatsApp, correo, almacenamiento, schedulers)?
- ¿Esas llamadas tienen límites (por llamada / diario / mensual), timeout, tope de reintentos y
  registro del consumo, o pueden gastar en silencio? (Ver `automatizaciones.md`.)
- ¿Se está usando IA donde una solución **determinista** (JS, reglas, plantillas, datos
  existentes) resolvería lo mismo? (Ver **Control de IA** en `SKILL.md`.)
- ¿Hay riesgo de consumo inesperado (loops, retries sin tope, cron mal puesto)?

## Salida del diagnóstico
Entrega una tabla corta: eje · veredicto · nota, y luego **3 propuestas priorizadas**
(1 rápida de alto impacto, 1 media, 1 estratégica), cada una con: problema que resuelve,
qué se cambia, cómo se implementa aditivamente, y si toca datos/reglas. **Para cada propuesta
que pueda gastar dinero, adjunta el informe económico del `SKILL.md` y su bandera de coste
(🟢/🟡/🟠/🔴); si puede dar pérdidas, márcala 🔴 NO RECOMENDADA hasta cambiar el modelo.**

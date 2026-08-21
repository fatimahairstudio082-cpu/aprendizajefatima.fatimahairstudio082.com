# Checklist de diagnóstico de un bloque

Recorre estos 7 ejes. Para cada uno da un veredicto (🟢 bien / 🟡 mejorable / 🔴 problema) y
una nota concreta. Al final, prioriza por **impacto vs esfuerzo**.

## 1. UX / claridad
- ¿La primera pantalla explica en 5 segundos qué hace el bloque y qué gana la alumna?
- ¿Hay estados vacíos claros (sin datos, sin créditos, cargando, error)?
- ¿El resultado se puede guardar/compartir (PDF, JPG, WhatsApp)?
- ¿Funciona bien en móvil (es una PWA)? ¿Botones tocables, sin scroll horizontal?

## 2. Monetización
- ¿El bloque cobra créditos por sus acciones de valor, o regala lo caro?
- ¿Hay un momento natural de "upgrade" (justo cuando la alumna ve el valor)?
- ¿Se puede convertir una acción educativa en un servicio de pago (ver `monetizacion.md`)?
- ¿El coste real (IA/Replicate, generación) está cubierto por lo que cobra?

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

## Salida del diagnóstico
Entrega una tabla corta: eje · veredicto · nota, y luego **3 propuestas priorizadas**
(1 rápida de alto impacto, 1 media, 1 estratégica), cada una con: problema que resuelve,
qué se cambia, cómo se implementa aditivamente, y si toca datos/reglas.

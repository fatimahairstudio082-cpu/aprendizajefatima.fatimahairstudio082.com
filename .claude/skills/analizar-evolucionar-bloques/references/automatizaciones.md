# Catálogo de automatizaciones

Automatizaciones que ahorran trabajo al owner y evitan errores. Cada una dice qué resuelve y
sobre qué pieza existente se monta. Priorizadas de más fácil/alto valor a más elaboradas.

## Operación diaria (alto valor, bajo esfuerzo)
1. **Generación de media desatendida por lotes** — programar tandas de `motor_auto.html`
   ("generar solo N que falten", "omitir las que ya están") para no generar a mano ni duplicar
   coste.
2. **Escáner de faltantes proactivo** — sobre `escaner_faltantes_total.html` /
   `escaner_clips_faltantes.html`: en vez de mirar el dashboard, que **avise** qué media falta
   (resumen automático por Academia, Corte, Hub, Fitness).
3. **Onboarding y recordatorios por WhatsApp** — mensajes automáticos: bienvenida al registrarse,
   "te quedan X créditos", "no entras hace N días". Extiende la recarga por WhatsApp existente
   (`_waRecharge`, `abrirWA`).

## Integridad del sistema (previene romper cosas)
4. **Chequeo de sincronía de duplicados** — avisa si `index.html`↔`fatima_hub.html` o
   `bloque3_academia_pagos.html`↔`fatima_peluqueria.html` divergen. Puede correr en el workflow
   de GitHub (`.github/workflows/`) o como paso del subagente `revisor-fatima`.
5. **Backup automático de Firestore/Storage** — copia periódica de datos de alumnas y media.
6. **Health-check de deploy** — tras cada publicación, verificar que las funciones Netlify
   (`replicate.js`, `aiproxy.js`) responden y que una lectura de prueba en Firestore no rompió
   por un cambio de reglas.
7. **Conversión automática de links de Drive** — forzar el formato correcto (imágenes
   `thumbnail?...w1400`, videos `.../preview`) en **todo** punto de guardado, no solo en
   `biblioteca.js`. Reusa la lógica de los `*_drive_fix.js`.
8. **Retry / regeneración automática de media fallida** — reintentar las generaciones que
   fallaron (con failover de hosting vía `puente_inteligente.js`).

## Negocio y retención
9. **Emisión automática de certificado** al completar el 100% de un módulo (enlaza con
   monetización #2, certificado con QR).
10. **Reporte semanal al owner** — resumen automático: alumnas activas, créditos consumidos,
    clases más vistas, media que falta. Un correo/WhatsApp los lunes.

## Cómo implementarlas
- Muchas viven en el **cliente** (patch-scripts que corren al cargar) o en las **funciones
  Netlify** (único código de servidor). Las programadas (backup, reporte, escáner) necesitan
  un scheduler externo (Netlify Scheduled Functions, GitHub Actions cron, o similar).
- Cualquier automatización que **escriba** en Firestore debe respetar `firestore.rules` (que se
  despliega a mano) y las formas de documento existentes.
- Empieza por la #2 (escáner proactivo) y la #3 (recordatorios): máximo ahorro de tiempo con lo
  que ya existe.

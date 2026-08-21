# Inventario de bloques

El hub (`index.html` = `fatima_hub.html`, ~1550 líneas cada uno, **casi idénticos: mantener
sincronizados a mano**) carga los bloques como `<iframe class="bloque-frame" data-src="...">`.

Ejes reutilizables que comparten casi todos:
- **Firebase** proyecto `aprendisajefatima` (misma config embebida; SDK compat de gstatic,
  mayormente 10.12.2).
- **Créditos** vía `hub_credito_bridge.js` + `postMessage` al hub (pozo global
  `usuarios/{uid}.creditos`, transacción atómica en el hub). Badge/pill en el header, modal
  "sin créditos", recarga por WhatsApp.
- **Header común** (marca dorada `#c9a84c`, pill de créditos, toggle TTS, logout), **TTS**
  integrado, **export PDF/JPG** (jsPDF + html2canvas por CDN).
- **Modo dual hub/standalone**: los bridges detectan `window.parent !== window`; suelto es
  no-op y la página funciona sola.
- **Salida al hub** uniforme: `postMessage({tipo:'salirBloque', destino:'index.html'})`.

**Puntos de coste externo (dónde ya se gasta dinero hoy):** la generación IA vía **Replicate**
(sobre todo `bloque5_fitness.html` y las funciones Netlify `replicate.js`/`aiproxy.js`) es el
principal coste por operación; el resto (Firestore, Storage, CDNs) es coste de uso más bajo pero
no nulo. Cualquier evolución que aumente estas llamadas cae bajo la **Regla económica** del
`SKILL.md`. Este inventario es descriptivo: no implica que ninguna función nueva sea gratuita.

## Ficha por bloque

### bloque1_motor_corte.html — Corte / visajismo (~832 líneas) · COMPLETO
Motor de técnicas de corte. Genera fichas de protocolo, dibuja cráneo/visajismo en canvas,
visor de módulos en video desde Firebase (`cargarModulosFirebase`, extrae IDs de Drive), TTS
por ficha, export PDF. Firebase (auth+firestore) + créditos vía `hub_credito_bridge.js`.
Único bloque con **barra de estado/error de Firestore** visible (buen patrón a replicar).

### calc_cromatica_v8.html — Colorimetría (bloques 2 y 7) (~1658 líneas) · COMPLETO
Calculadora cromática tipo React (`CalcApp`, `ColorPalette`, `ZonaEditor`, `VolSelector`,
`PresupBox`, `MuyMaltratadoPanel`): niveles, volúmenes, diagnóstico de cabello maltratado,
paletas, **presupuesto** y panel de audio/TTS flotante. Firebase + créditos.
**Aviso:** carga React 18 desde los archivos vendorizados de la raíz
(`react.production.min.js` / `react-dom.production.min.js`, con fallback a unpkg). No los
borres o la calculadora renderiza página negra.

### bloque3_academia_pagos.html — Academia oficial (~464 líneas) · COMPLETO (front delgado)
Visor de la academia/masterclass: login por email, módulos→clases, reproductor (iframe +
`<video>` mp4), video de apoyo, visor/impresión de PDF, galería de completadas, progreso y
certificado. **Aviso:** NO trae motor propio: delega en `app.js` (`window.CONOCIMIENTO`),
`motor_helper.js` (+ `motor_p1/p2/p3`), `peluqueria_hub_bridge.js` y los patch-scripts
`academia_carrusel_pasos.js`, `academia_drive_fix.js`, `academia_teatro_video.js`. Los
"próximamente" son fallback cuando una clase aún no tiene video.
**Aviso:** `fatima_peluqueria.html` es el gemelo de respaldo — **edita este, no aquel**.

### bloque4_nutricion.html — "Neural Nutrition v12" (~813 líneas) · COMPLETO
Pestañas Plan Diario / Calendario 365 / Macros. `calcMacros`, plan e ingestas, modales de
voz/audio, descarga JPG/PDF. Créditos (`gastarCredito`) vía `hub_credito_bridge.js`. No usa
Firebase directamente.

### bloque5_fitness.html — "Neural Fitness" (~1011 líneas) · COMPLETO (el más generador)
Genera rutinas y multimedia: calcula series, crea bloques de imagen y **llama a Replicate**
para generar imágenes (`_generar`, `crearBloqueImagen`, `_iframe`). Export PDF.
**Aviso:** usa su **propia variante de créditos** con prefijo `_fit*` (`_fitLeerCreditos`,
`_fitDescontarCreditos`, `_fitSinCreditos`, `_fitSuscribir`), NO el `hub_credito_bridge.js`
estándar. Firebase (el bloque con más referencias). Es el más pesado en generación IA.

### bloque6_herramientas.html — "Herramientas de Utilidad Pro" (~3150 líneas) · COMPLETO (el más grande)
Navaja suiza: editor de imágenes (capas de pintura, marca de agua `buildWmLines`, fondos,
calidad auto), generador de CV (`_cvColectarTexto`, `addSkill`), conversión audio→WAV
(`audioBufferToWav`), mucha exportación PDF. Créditos con modal propio (`checkCr`,
`closeCredModal`, `gastarCreditos`) + Firebase. El de más funciones distintas → candidato a
dividir/monetizar por herramienta.

### bloque8_construccion.html — "Construcción & Resina Epóxica" (~1383 líneas) · COMPLETO
**Aviso importante: NO es un placeholder "en construcción".** Es un bloque temático completo
de dominio construcción/resina: calculadoras de materiales (`calcAcero`, `calcBloques`,
`calcCeramica`, `calcLosa`, `calcEncimera`, `calcMesa`, `calcMolde`, `calcExtras`), filas
dinámicas, chat, envío por WhatsApp (`abrirWA`), export PDF, loader, header con pill de
créditos, TTS. Firebase + `hub_credito_bridge.js`.

### bloque9_ejercicios.html — "Diccionario de Ejercicios · Plan Semanal" (~1056 líneas) · COMPLETO
Pestañas Nutrición / Entrenamiento / Pagos / Librería. `calcNut`, `calcLibrary`, chat con
fallback (`chatFallback`), i18n (`applyAppLang`, `_applyLangFull`). Créditos con badge y modal
propios (`_cargarCreditosFirebase`, `_renderCreditsBadge`, `consumeCredits`,
`_showNoCreditsModal`, recarga por WhatsApp `_waRecharge`). Firebase + `hub_credito_bridge.js`.
Ya tiene **i18n**: buen punto de partida si se quiere expandir a más idiomas.

### Hub — index.html / fatima_hub.html · COMPLETO
Shell de la PWA. Carga los 8 bloques + `juegos_fatima.html`. Aquí vive el **debitado central**
de créditos (nunca en los bloques). `fatima_modules.js` aporta extras del hub (dashboard de
progreso, tests por bloque, certificados jsPDF, chatbox).

## Estado general
- **Ningún bloque está vacío ni es placeholder.** Los 8 están implementados.
- El más ligero (bloque3) lo es por delegar en scripts compartidos.
- Los bloques con feedback de error más maduro: bloque1 (status bar). Los demás usan
  toasts/modales.

## Bridges y datos (referencia rápida)
- `hub_credito_bridge.js` — puente central de créditos (lo usan b1, b4, b8, b9, calc). b5 y b9
  además tienen variantes locales.
- `peluqueria_hub_bridge.js` — auto-login + filtro de clases por `acceso_clases` + créditos de
  video premium (b3/peluqueria).
- `puente_inteligente.js` — failover entre hostings hacia Replicate.
- Catálogo de 360 clases: `motor_p1_bioseg_balayage.js` + `motor_p2_queratina_elevaciones.js`
  + `motor_p3_morfologia_alertas.js` + `motor_helper.js` (expone `MOTOR`, `MOTOR_FLAT`,
  `MOTOR_BY_ID`, `MOTOR_PATH`). El `claseId` (p.ej. `bio_p01`) es la clave universal.

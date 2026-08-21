# Playbook: cómo evolucionar un bloque sin romperlo

La app es estática, sin build, con archivos HTML enormes y contratos de datos vivos entre el
lado admin y las alumnas. Cada mejora histórica ha sido **aditiva**. Sigue estas reglas.

> **Antes de escribir código que pueda gastar dinero:** aplica la **Regla económica** del
> `SKILL.md` (informe económico + aprobación explícita) y la sección 11 de abajo. No hay
> excepciones.

## 1. Prefiere el patch-script antes que reescribir
En vez de editar un HTML de 3000 líneas, agrega un `<script src="mi_parche.js">` al final del
`<body>` y monkey-parchea al cargar. Protégelo con un guard para que sea idempotente:

```js
if (window._MI_PARCHE_LOADED) { /* ya cargó, salir */ } else {
  window._MI_PARCHE_LOADED = true;
  // ... tu mejora ...
}
```
Precedentes: `academia_carrusel_pasos.js`, `*_drive_fix.js`, los `*_motor_bridge.js`.

## 2. Escribe defensivo (modo dual hub/standalone)
Todo lo que dependa del hub debe degradar a no-op si el bloque corre suelto:
```js
const enHub = window.parent && window.parent !== window;
```
Nunca asumas que `window.parent` es el hub.

## 3. No toques las formas de documentos Firestore/Storage
Las claves son contratos (ver `LEEME_MOTOR_AUTOMATICO.md` y CLAUDE.md). Ejemplos:
`clases_imgs/{claseId}` (campos `url_jpg`, `url`, `url_video`), `fitness_imgs/{clave}_v1..v12`,
`hub_tarjetas/{n}` (`imgUrl`), `academia/{slug}/{claseId}/imagen.jpg|video.mp4`. **Agrega**
campos nuevos si hace falta, pero **no renombres ni cambies** los existentes. Ante la duda,
pasa por el subagente `guardian-firebase`.

## 4. Créditos: siempre por el hub
El debitado real es una transacción atómica en el hub sobre `usuarios/{uid}.creditos`. Un
bloque nunca incrementa ni debita directo. Para cobrar una acción nueva, emite el `postMessage`
correspondiente (`gastarCreditos`) siguiendo `hub_credito_bridge.js`. (bloque5 y bloque9 tienen
variantes locales `_fit*`/`_cargarCreditosFirebase` — respeta la que ya use el bloque.)

## 5. Links de Google Drive
Convierte antes de guardar: imágenes al formato `thumbnail?...w1400`, videos a
`https://drive.google.com/file/d/{ID}/preview`. Links crudos o `uc?export=download` renderizan
negro. Reusa `biblioteca.js` / `conversor_drive.html` / los `*_drive_fix.js`.

## 6. Sincroniza los duplicados (paso obligatorio)
- Hub: cambio en `index.html` → mismo cambio en `fatima_hub.html`.
- Academia: editar `bloque3_academia_pagos.html` (no `fatima_peluqueria.html`).
- Manifests: `manifest.json` (hub) vs `manifest-estudio.json` (`manifestestudio.json` es
  duplicado suelto).

## 7. Seguridad al renderizar datos de alumnas
`nombre`/`email` son escribibles por la alumna al crear su doc → escápalos con el helper
`esc()` antes de `innerHTML` (patrón en `admin_motores.html` y `panel_admin.js`). Si tu cambio
toca login/permisos/reglas/tokens → `guardian-seguridad`.

## 8. `firestore.rules` se despliega a mano
Pushear a Netlify NO actualiza las reglas. Si tu mejora requiere nuevas reglas (p.ej. una
colección nueva readable por logueados / escribible por admin), **entrega el bloque de reglas
por separado** y avisa al owner que debe pegarlo en la consola de Firebase.

## 9. Texto en español y estilo visual
UI, mensajes y comentarios de cara al owner en español. Marca dorada `#c9a84c`. Reusa el header
común (pill de créditos, toggle TTS, logout) y los patrones de tarjeta/ficha existentes.

## 10. Cierre: verifica siempre
Antes de decir "listo": corre `revisor-fatima` (duplicados sincronizados, español, aditivo);
`guardian-firebase` si tocaste datos; `guardian-seguridad` si tocaste seguridad. Si tu cambio
introdujo alguna llamada externa, revisa que lleve todos sus límites (sección 11). Recuerda que
el deploy a `main` es automático por Netlify (~1 min), así que no subas nada a medias.

## 11. Coste externo: nunca sin límites (regla de no gasto silencioso)
Toda funcionalidad que llame a un servicio externo de pago (IA, Replicate, APIs, WhatsApp,
correo, almacenamiento, schedulers) DEBE incluir, desde la primera versión, lo que aplique:
límite de llamadas · límite diario · límite mensual · timeout · tope de reintentos (con
backoff, sin loops) · control de errores · registro del consumo · mecanismo de desactivación
(flag) · presupuesto/cuota máxima cuando el proveedor lo permita.

- **Preferir la solución determinista/gratuita** (JS, reglas, plantillas, datos ya guardados,
  enlace `wa.me` manual) antes que IA o envíos automáticos de pago. Ver **Control de IA** en el
  `SKILL.md`.
- **Ningún scheduler** (Netlify Scheduled Functions, GitHub Actions cron) sin frecuencia
  justificada y sin interruptor de apagado: un cron mal puesto es la vía más común de gasto
  silencioso.
- **El failover de hosting** (`puente_inteligente.js`) cambia de puerta cuando una se queda sin
  crédito; **no** autoriza a reintentar sin tope.
- Cualquier acción con coste variable se cobra de forma que **INGRESO POR USO > COSTE REAL POR
  USO**; si no, no se enciende (🔴).

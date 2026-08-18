# Voz GRATIS dentro del video (Bloque 6 · Flyers)

## Qué pasaba antes

En la pestaña **Flyers** había dos cosas distintas que parecían la misma:

| | Cómo sonaba | ¿Entraba en el video? | ¿Necesita clave? |
|---|---|---|---|
| **Panel de voz** (`b6_voz_flyer.js`) | Voces gratuitas del navegador (Google, del móvil) | ❌ NO | No |
| **Audio → 🗣️ Voz de estudio** (`voz_ia`) | OpenAI vía `/.netlify/functions/tts` | ✅ Sí | **Sí** |

El motivo NO era un fallo del código: **el navegador no deja grabar las voces
gratuitas**. `speechSynthesis` suena por el altavoz, pero no entrega ninguna
pista de audio que `MediaRecorder` pueda mezclar en el video. Por eso el video
con voz acababa siempre en la voz de pago.

## Qué se ha añadido

`b6_voz_video_gratis.js` — parche aditivo, no toca nada de lo que ya funciona.

Aparece un botón nuevo debajo del panel de voz:
**🎙️ Poner esta voz en el video**

Lo que hace, paso a paso:

1. Pide permiso del micrófono **con la cancelación de eco apagada** (si se deja
   encendida, el navegador borra justo lo que sale del altavoz: la voz).
2. Cuenta atrás de 3 segundos para dar tiempo a subir el volumen.
3. Hace hablar a la voz gratuita elegida (misma voz, velocidad y tono del panel)
   y la graba por el micrófono.
4. Limpia lo grabado: **recorta los silencios** del principio y del final y
   **sube el volumen** al 90% (la voz por altavoz sale floja).
5. Lo convierte a **WAV** y se lo entrega al flyer como si fuera un archivo de
   música subido a mano (rellena `#flAudio` y dispara su `change`).
6. A partir de ahí trabaja el motor de siempre: `flStartVideo` mezcla el audio
   y **el video dura exactamente lo que dura la voz**.

## Reglas de negocio

- **No cobra créditos por la voz.** Cobra el video, como siempre: **2 créditos**.
- **Ninguna alumna tiene que poner ninguna clave.** Funciona en cualquier móvil
  o PC con Chrome.
- Monetiza solo: voz gratis → video → 2 créditos → pack de recarga por WhatsApp.

## Cómo se usa (para explicárselo a las alumnas)

1. Pestaña **📣 Flyers** → escribe el texto en el panel de voz.
2. Elige la voz y pulsa **▶ Escuchar gratis** para probar cómo suena.
3. Pulsa **🎙️ Poner esta voz en el video**.
4. **Con el altavoz** (no auriculares), en un sitio en silencio, deja que hable
   sin hablar encima ni tapar el micrófono.
5. Cuando diga «✅ Voz lista», pulsa **🎬 Grabar video**.

Si el micrófono no oyó nada, avisa: *«Quita los auriculares, sube el volumen
del altavoz y repite»*. No entrega audio mudo.

## La voz de estudio (pro) sigue estando

La opción **Audio → 🗣️ Voz de estudio (pro)** no se ha tocado. Suena mejor
(estudio, sin ruido de sala) pero necesita clave:

- **Recomendado:** poner `OPENAI_API_TOKEN` en las variables de entorno de
  Netlify **una sola vez**. A partir de ahí ninguna alumna ve ni pone claves y
  la voz pro también queda monetizada por créditos.
- Si no hay variable, cada quien tendría que pegar su propia clave. Eso es lo
  que hacía falta antes y lo que ahora ya no hace falta para tener voz.

### Aviso sobre el dominio (revisar si algún día falla la voz pro)

`netlify/functions/tts.js` solo usa la clave del servidor si la petición viene
de `*.fatimahairstudio082.com` o de `algo--aprendizajefatima.netlify.app`.
El dominio **`aprendizajefatima.netlify.app` a secas (sin los dos guiones) NO
entra en esa lista**, así que ahí la voz pro pediría clave. Si alguna vez se
publica por esa dirección, hay que ampliar esa comprobación.

## Archivos tocados

- `b6_voz_video_gratis.js` — **nuevo** (todo el parche).
- `bloque6_herramientas.html` — 1 línea de `<script src>` + la etiqueta de la
  opción de audio, ahora dice «Voz de estudio (pro)» para que se distinga.
- `b6_voz_flyer.js` — solo el texto del pie del panel, que apuntaba a la voz de
  pago y ahora apunta al botón gratis.

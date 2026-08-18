# Ponle voz a tu video (Bloque 6 · pestaña Vídeo & Audio)

Sube un video tuyo, ponle voz y descárgalo montado, listo para mandar por
**WhatsApp**, subir a **Instagram** o a **YouTube**. Todo se monta en el
dispositivo: ningún video sube a internet.

## Dónde está

Pestaña **🎬 Vídeo & Audio** → panel **🎙️ Ponle voz a tu video**, debajo del
optimizador que ya existía (ese no se ha tocado).

## Cómo se usa

1. Arrastra o elige tu video (MP4, MOV o WEBM, hasta 3 minutos).
2. Elige de dónde sale la voz:
   - **🗣️ Voz gratis que lee mi texto** — escribes el texto y la voz gratuita
     del navegador lo lee. Se capta por el micrófono, así que hay que usar el
     **altavoz** (no auriculares) y estar en un sitio en silencio. Sin clave.
   - **🎤 Narrar yo con el micrófono** — hablas tú mientras se monta el video.
     Aquí **sí conviene usar auriculares** para que no se cuele el sonido del
     video en tu narración.
   - **🎵 Subir una voz o música** — un archivo de audio que ya tengas.
   - **✨ Voz de estudio (pro)** — la de OpenAI. Suena mejor pero necesita la
     clave o la variable `OPENAI_API_TOKEN` en Netlify.
   - **🔇 Sin voz** — solo para cambiar el volumen del sonido original.
3. Ajusta **Volumen voz** y **Sonido original** (por defecto el original baja al
   25% para que se entienda la voz; a 0% queda mudo).
4. **🎬 Montar el video con la voz** → se descarga solo al terminar.

## Cosas que hay que saber

- **Tarda lo mismo que dura el video.** La grabación va en tiempo real; es un
  límite del navegador, no del código. Un video de 1 minuto tarda 1 minuto.
- **No cierres ni cambies de pestaña** mientras monta: el navegador congela el
  dibujo de las pestañas de fondo y el video saldría a trompicones.
- **Si la voz dura más que el video**, se congela el último fotograma hasta que
  la voz termina, así no se corta a media frase (comprobado: video de 3 s + voz
  de 6 s → sale un archivo de 6,1 s).
- **Formato de salida:** intenta **MP4** primero, que es el que WhatsApp e
  iPhone reproducen bien. Si el navegador no puede, sale WebM y se avisa.
- El video se reescala a 1280 px de lado mayor como mucho, para que el archivo
  no se dispare de tamaño.

## Créditos

**2 créditos por video montado**, igual que los demás videos del bloque. Se
cobran solo cuando el grabador ya arrancó de verdad: si algo falla antes (no da
permiso el micrófono, el servidor de voz da error, el navegador no puede
grabar), **no se cobra nada**.

## Para el técnico

- Archivo nuevo: `b6_video_con_voz.js` (IDs con prefijo `vc`).
- El video se dibuja en un canvas y de ahí sale la imagen
  (`canvas.captureStream`); el sonido original y la voz se mezclan con dos
  ganancias de Web Audio y de ahí sale el sonido; `MediaRecorder` junta las dos
  pistas.
- La voz gratis se pide al motor común `window.B6_VOZ_GRATIS.capturar()`, que
  vive en `b6_voz_video_gratis.js` y es el mismo que usa la pestaña Flyers.
- No toca `processMedia`, `optimizeVideo`, `optimizeAudio`, `flStartVideo`,
  `gastar()`, Firebase ni el CSS.

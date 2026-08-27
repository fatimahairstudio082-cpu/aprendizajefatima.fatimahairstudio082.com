---
name: higgsfield-video
description: >-
  Genera un clip de video con Higgsfield (image-to-video) a partir de una imagen
  ya existente de una clase/combo de la academia, y lo sube al Google Drive
  personal del owner con el formato de enlace que este proyecto necesita para
  reproducirlo. Úsala cuando el owner pida "genera un video con Higgsfield",
  "anima esta imagen con Higgsfield", "haz el video de la clase X con
  Higgsfield" o "súbelo a mi drive". NO usa Replicate ni los proxies de
  Netlify (`aiproxy.js`/`replicate.js`) — llama a la API de Higgsfield
  directamente desde esta sesión.
---

# Video con Higgsfield → Google Drive

Genera un clip corto (image-to-video) con Higgsfield para una clase del motor
(`claseId`) o cualquier imagen que dé el owner, y lo deja en su Google Drive
personal ya en el formato de enlace que usan las páginas de esta app.

Este flujo es **independiente del generador habitual del proyecto**
(`motor_auto.html`, que usa Replicate/aiproxy y sube a Firebase Storage). Aquí
el video queda en Drive, no en Firebase — es para cuando el owner quiere
probar Higgsfield o generar algo puntual sin pasar por el panel.

## 0) Antes de nada: confirmar la API en vivo

La documentación de Higgsfield puede cambiar. **No asumas el endpoint ni el
formato de autenticación de memoria** — antes de la primera llamada de la
sesión, comprueba la documentación oficial:

```
WebFetch: https://docs.higgsfield.ai/docs
```

Si esta sesión corre en un entorno remoto con salida de red restringida,
`WebFetch`/`curl` a `docs.higgsfield.ai` o `api.higgsfield.ai` puede fallar con
`EGRESS_BLOCKED` o un `403` en el CONNECT. En ese caso avisa al owner: hay que
o bien ejecutar este skill desde un Claude Code local (sin la política de red
restringida), o bien pedirle al owner que amplíe la política de red del
entorno remoto para incluir `api.higgsfield.ai` (ver
https://code.claude.com/docs/en/claude-code-on-the-web). No inventes una
respuesta como si la llamada hubiera funcionado.

Con la doc confirmada, identifica: URL base, endpoint de image-to-video,
cabeceras de autenticación exactas, forma del body, y si el job es síncrono o
asíncrono (job id + polling).

## 1) Credenciales

Necesitas `HIGGSFIELD_API_KEY` (y el secret que pida el esquema de auth
vigente) como variable de entorno de la sesión — **nunca la escribas en un
archivo del repo ni la commitees**. Si no está definida, pídesela al owner
directamente en el chat.

## 2) Imagen de origen

- Si es para una clase del motor: el `claseId` (p. ej. `bio_p01`) identifica la
  imagen ya generada — normalmente en `clases_imgs/{claseId}.url` o
  `url_jpg` en Firestore, o la ruta local si el owner la pasó a mano.
- Si el owner simplemente adjunta o referencia una imagen suelta, úsala tal cual.

## 3) Generar el video

1. Envía la imagen a Higgsfield (image-to-video) según lo confirmado en el
   paso 0. Guarda el job id si es asíncrono.
2. Haz polling hasta que el job termine (o procesa la respuesta directa si es
   síncrono).
3. Descarga el mp4 resultante a un archivo temporal en el scratchpad de la
   sesión (no en el repo).

## 4) Subir a Google Drive del owner

Usa las herramientas MCP de Google Drive ya conectadas en esta sesión:

1. `mcp__Google_Drive__create_file` para subir el mp4. Ponlo en una carpeta
   dedicada, p. ej. **"Fátima Academia - Videos Higgsfield"** (créala si no
   existe, o pregunta al owner en qué carpeta lo quiere).
2. `mcp__Google_Drive__share_file` para dar acceso "cualquiera con el enlace,
   lector" — **imprescindible**, si no el video sale negro/no carga cuando la
   app lo intente reproducir (mismo motivo por el que `biblioteca.js` rechaza
   enlaces mal formados).
3. Toma el `fileId` devuelto y arma el enlace en el **formato que este
   proyecto exige para videos** (ver `CLAUDE.md` → contrato de medios):

   ```
   https://drive.google.com/file/d/{FILE_ID}/preview
   ```

   Nunca entregues el link crudo de "compartir" (`.../view?usp=sharing`) ni
   uno de `uc?export=download` — esos no reproducen (salen negros), como ya
   documenta `conversor_drive.html`.

## 5) Entregar el resultado

Dale al owner el enlace `/preview` ya formateado y dile dónde pegarlo según lo
que sea:
- Clase del catálogo → `admin_motores.html` (campo del video de esa clase) o
  directamente el doc `clases_imgs/{claseId}.url_video` en Firestore.
- Tarjeta suelta del hub / academia → `biblioteca.html` o
  `conversor_drive.html` para verificar el formato antes de pegarlo.

No sobrescribas media ya existente para el mismo `claseId` sin confirmar antes
con el owner — el contrato de datos es compartido con las páginas de alumnas.

## Notas

- Todo el texto de cara al owner/alumnas es en español, como el resto del proyecto.
- Este skill no toca Firebase Storage ni los proxies de Netlify; si más
  adelante se decide meter Higgsfield al flujo oficial de `motor_auto.html`,
  eso es un cambio de arquitectura aparte (añadirlo al allowlist de
  `netlify/functions/aiproxy.js`), no lo que hace este skill.

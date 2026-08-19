# Folletos Pro (Bloque 6 · pestaña 📰 Folletos Pro)

Tu carta de servicios en una hoja: una cuadrícula de **2, 4, 6 u 8 cuadros**, con
una **foto o un vídeo** en cada hueco, el nombre del servicio, una frase y el
precio. Se lleva en **imagen, PDF, vídeo con voz o folleto web**.

**No gasta créditos.** Ni diseñar ni descargar. Es la única herramienta del
bloque que no cobra; las demás siguen cobrando lo de siempre.

## Cómo se usa

1. Pestaña **📰 Folletos Pro**.
2. Elige un **🎨 Estilo** de diseño profesional (Catálogo lujo, Post de
   Instagram, Historia/WhatsApp, Minimal blanco, Corporativo, Escaparate…): de
   un clic te coloca la paleta, la cuadrícula, la hoja y los acabados que pegan.
   Después puedes cambiar la **cuadrícula** (2, 4, 6 u 8 cuadros) y la **hoja**
   (A4 vertical, A4 apaisada, cuadrado de Instagram o historia de WhatsApp) a
   mano si quieres afinarlo.
3. Elige los **colores** de las 10 paletas, o cámbialos a mano con los seis
   selectores. **🎲 Sorpresa** gira el tono manteniendo la armonía.
4. Pulsa **📝 Escríbelo tú por mí**: elige tu tipo de negocio y el tono, y te
   escribe todos los textos y unos precios de referencia. **Después cambia lo
   que quieras**: cada título, cada frase y cada precio son tuyos. El **🔁** de
   cada cuadro reescribe sólo esa frase.
   - **No es sólo para peluquerías.** Hay categorías para muchos sectores
     (restaurante y bar, cafetería y panadería, tienda de ropa, mascotas y
     peluquería canina, fotografía, inmobiliaria, eventos, limpieza y hogar,
     reformas…) además de todas las de belleza. Si tu negocio no está en la
     lista, elige **✍️ Otra (la escribo yo)**: trae textos neutros y
     profesionales que cambias por los tuyos.
5. En cada cuadro, **pon tu foto o tu vídeo**. Los vídeos se ven moviéndose
   dentro del folleto y entran en el vídeo final.
6. Si el folleto tiene varias hojas: monta la primera, pulsa **📚 Guardar como
   página**, cambia las fotos y los textos, y sigue. El PDF y el folleto web
   salen con todas las páginas.

## Las cuatro descargas

| Botón | Qué sale |
|---|---|
| **🖼️ Imagen** | Un JPG por hoja. Para Instagram y estados de WhatsApp. |
| **📄 PDF** | Todas las hojas en un PDF, cada una a su tamaño real. Para imprimir. |
| **🌐 Folleto web** | Un solo archivo `.html` que se abre en cualquier móvil, se pasa con el dedo, reproduce los vídeos y lee el folleto en voz alta al pulsar 🔊. |
| **🎬 Hacer el vídeo** | El folleto animado, con los cuadros entrando de uno en uno y la voz leyendo. |

### La música de fondo (gratis)

Debajo de las opciones de voz hay un selector **🎵 Música**: las mismas 16
melodías **sin derechos de autor** que ya usaba Flyers (enérgica, elegante,
lo-fi, tropical, reggaetón, flamenco, jazz…), sintetizadas en el propio móvil.
El botón **▶ Escuchar** las prueba antes de grabar. La música suena **por debajo
de la voz** (o sola, si eliges «Sin sonido» en la voz), y entra dentro del vídeo
descargado. No hace falta subir ningún archivo ni tener conexión.

### La voz del vídeo

Cinco opciones, las mismas que en Flyers y en «Ponle voz a tu video»:

- **🗣️ Voz gratis que lee mi folleto** — la del navegador, sin claves. Al
  elegirla se abre un **player de voces**: eliges la voz que más te guste (las
  🟢 son de **Google**, suelen ser las mejores), ajustas **velocidad** y **tono**
  con dos deslizadores, y la **▶ pruebas** al momento antes de grabar. Como el
  navegador no deja grabarla, se capta por el micrófono: usa el **altavoz** (no
  auriculares), en un sitio en silencio, y no hables encima. Es el motor común
  `window.B6_VOZ_GRATIS`, el mismo que ya usaban las otras dos herramientas, al
  que ahora se le pasan la voz, la velocidad y el tono elegidos.
- **🎤 Narro yo con el micrófono** — hablas tú mientras se monta.
- **🎵 Subir música o voz** — un archivo que ya tengas.
- **✨ Voz de estudio (pro)** — la de OpenAI. Suena mejor pero necesita la clave
  o la variable `OPENAI_API_TOKEN` en Netlify.
- **🔇 Sin sonido**.

El cuadro **«Lo que dirá»** es el guion, y se puede editar. Sale ya limpio para
hablar: sin emojis y diciendo «euros» en vez de `€`, porque la voz lee fatal los
símbolos.

## Cosas que hay que saber

- **El vídeo se graba en tiempo real**: uno de 12 segundos tarda 12 segundos. Es
  un límite del navegador, no del código. **No cambies de pestaña** mientras lo
  hace, o el dibujo se congela y sale a trompicones.
- **Formato del vídeo**: intenta **MP4** primero (el que va bien en WhatsApp y en
  iPhone). Si el navegador no puede, sale WebM y te avisa.
- **Topes de vídeo**: máximo **4 vídeos por folleto** y **60 segundos** cada uno,
  para que no se atragante el móvil. Si pones uno más largo, avisa.
- **Folleto web con vídeos dentro**: si lo incrustado pasa de **45 MB**, los
  vídeos se dejan fuera (queda su primer fotograma en la hoja) y te lo dice —
  un HTML de 200 MB no se abre en un móvil ni se manda por WhatsApp. Un mismo
  vídeo repetido en varias hojas **se guarda una sola vez**.
- **Nada sube a internet.** Las fotos y los vídeos no salen del dispositivo. La
  única excepción es la voz de estudio (pro), que sí llama al servidor.

## Para el técnico

Cuatro archivos nuevos, todos parches aditivos con guarda `window._B6_*_LOADED`:

- **`b6_folleto_disenos.js`** — el cerebro de diseño: 14 estilos profesionales
  agrupados por uso (catálogo, redes, elegante, escaparate). Cada estilo es una
  combinación de paleta + cuadrícula + hoja + acabados que ya sabe dibujar el
  motor; no inventa nada nuevo en el lienzo. Expone `FOLLETO_DISENOS.lista()`,
  `.grupos()` y `.get(id)`. Es opcional: si no carga, la herramienta funciona
  igual sin la fila de estilos.

- **`b6_folleto_motor.js`** — el dibujo, en canvas 2D. Es la única fuente de
  verdad: la vista previa, el JPG, el PDF, el vídeo y las portadas del folleto
  web llaman todos a `FOLLETO_MOTOR.pintar()`. Trae los 4 formatos, las 10
  paletas y las 8 rejillas. `rejilla(id,x,y,w,h,hueco)` es una función pura que
  devuelve los rectángulos; en hoja apaisada la calcula en vertical y la gira
  90°, así una 2×3 pasa a 3×2 sola. `op.revelar(i)` es lo que usa el vídeo para
  hacer entrar los cuadros de uno en uno sin duplicar el dibujo.
- **`b6_folleto_cerebro.js`** — los textos. 22 rubros × 8 servicios (belleza y
  muchos otros sectores, más «✍️ Otra»), 5 tonos, precios de salón y el guion
  para la voz. Bolsa sin reposición: en una hoja de 8 cuadros no se repite ni un
  servicio ni una descripción.
- **`b6_folleto_pro.js`** — la herramienta (IDs con prefijo `fp`). La **música
  de fondo** reutiliza los datos `FL_MELODIES` / `FL_NOTE` de Flyers (ya
  cargados en el bloque) pero sintetiza con su propio mezclador, que conecta
  sólo a la pista que se graba; si esos datos no están, la fila de música se
  oculta sola.

En `bloque6_herramientas.html` sólo se han tocado 7 líneas: el botón de la
pestaña, el contenedor `#tab-folleto`, la llamada a `fpOpen` en `switchMain`, la
guía hablada y los cuatro `<script src>`.

**No se toca** nada de lo que ya funcionaba: ni `flStartVideo`, ni `gastar()`, ni
Firebase, ni `firestore.rules`, ni el CSS, ni `index.html` / `fatima_hub.html`.

### Dos trampas que costaron encontrar

1. **`flCover` no vale para vídeos.** El ayudante del bloque mide con
   `img.width`, que en un `<video>` es el atributo HTML y vale 0: salía `NaN` y
   el cuadro se quedaba en blanco. `FOLLETO_MOTOR.cubrir()` detecta el vídeo y
   lo mide con `videoWidth`; para las fotos sigue reutilizando `flCover`.
2. **`loadedmetadata` es demasiado pronto.** Ahí el `readyState` todavía es 1 y
   no hay fotograma que dibujar. Hay que esperar a `loadeddata`.

### Muestrario de diseño

`folleto_muestrario.html` es una página suelta con las 8 rejillas y las 10
paletas dibujadas, para elegir y descartar diseños. Usa el mismo motor, así que
lo que se ve ahí es lo que sale en la herramienta. No hace falta para que
Folletos Pro funcione; se queda como referencia.

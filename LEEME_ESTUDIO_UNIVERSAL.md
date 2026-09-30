# LEEME · ESTUDIO UNIVERSAL (bloque premium Business)

Página nueva: **`estudio_universal.html`**. Junta en un solo sitio lo que ya
existía suelto — el motor de folletos del Bloque 6, el cerebro de textos, la
voz gratis y la voz de estudio — y le añade parrilla de plantillas, editor,
estudio de vídeo 3D, QR, proyectos guardados y planes Free/Pro.

**No reescribe nada.** Los motores viejos se cargan tal cual y no se ha tocado
ni una línea suya.

---

## Dónde aparece (ya viene puesto, no hay que configurar nada)

**En el hub de las alumnas** — como cuarta tarjeta de la tira **🧰 Herramientas Pro**, junto a la
Calculadora de Color, Ejercicios y Construcción. Ahí, y no en la parrilla de categorías de arriba,
porque el Estudio Universal no es un bloque de aprendizaje: es una herramienta.

**En el Centro Admin** — pestaña `🎬 Estudio Universal`, al lado del Conversor Drive.

Nada de esto se crea desde Biblioteca → Bloques del Hub: va en el código y se publica con el resto.

### Detalle técnico del hueco

La tarjeta abre `frame21`, un iframe propio añadido a `index.html` **y** a `fatima_hub.html`. Se ha
elegido el 21 a propósito: los slots **11–20 son el pool** que `hub_bloques_dinamicos.js` reparte
entre las categorías dinámicas, y meterse ahí se las comería.

> Los dos gemelos del hub llevan el mismo cambio y **hay que mantenerlos sincronizados**. Ojo al
> editarlos: `fatima_hub.html` usa saltos de línea CRLF y `index.html` usa LF. Si se cambian sin
> querer, el diff sale entero aunque no hayas tocado nada.

## ⚠️ Hay que publicar las reglas de Firestore A MANO

`firestore.rules` **no se despliega con Netlify**. Sin este paso, guardar la
ficha del negocio y los proyectos fallará con «permisos» (la página lo dice en
rojo, no falla en silencio).

Firebase → Firestore → Reglas → pegar TODO `firestore.rules` → Publicar.

Lo que cambia respecto a las reglas de hoy:

1. La alumna puede escribir también **`marca`** en su propio documento
   (antes sólo `creditos` y `ultimoAcceso`). Se valida campo a campo: mapa con
   claves conocidas y textos cortos, por el mismo motivo por el que `nombre`
   ya iba acotado — esos datos acaban pintados en paneles.
2. Colección nueva **`proyectos/{uid}/items/{id}`**: cada quien lee y escribe
   sólo lo suyo.
3. **`plan` sigue siendo de escritura sólo del admin**, igual que `creditos`.
   Desde el navegador nadie puede subirse a Pro.

---

## Archivos

### Nuevos

```
estudio_universal.html   la página (armazón, login, pestañas, estilos)
eu_nucleo.js             sesión, plan, marca, LOGO, navegación, estado de la hoja
eu_plan.js               topes de Free/Pro, muro de pago, marca de agua
eu_parrilla.js           Plantillas · catálogo con miniaturas reales
eu_editor.js             Editor · Diseño/Textos/Fotos/QR/Marca + JPG/PDF
eu_video3d.js            Vídeo · 3D, clips propios, sonido, salidas por sitio
eu_triptico.js           Tríptico · tres cuerpos por cara, plano y libro
eu_volantes.js           Volantes y maquetas · la hoja suelta (dentro de Tríptico)
eu_carrusel.js           Carrusel · diapositivas encadenadas
eu_laminas.js            Láminas · 300 plantillas de exposición
eu_repaso.js             Repaso · examen y corrección
eu_qr.js                 QR de 8 tipos
eu_proyectos.js          Míos · guardar/abrir/duplicar/borrar en Firestore
```

Cada uno se protege con `window._EU_X_LOADED`, como los parches que ya existían.

### Se reutilizan (no se tocan)

```
b6_folleto_motor.js      dibuja la hoja (12 rejillas · 10 paletas · 7 formatos · 15 troqueles)
b6_folleto_cerebro.js    escribe los textos (32 rubros · 5 tonos)
b6_folleto_disenos.js    el catálogo de 56 plantillas
b6_cerebro.js            el cerebro pedagógico (10 familias de técnica)
b6_cortes.js             40 cortes y 7 tipos de cabello
b6_divisiones.js         particiones y elevaciones
b6_guias_3d.js           <guias-3d>   · la cabeza de maniquí
b6_estudios.js           <estudios-belleza> · las fichas de estudio
b6_laminas_motor.js      dibuja las láminas
b6_laminas_disenos.js    300 plantillas de lámina en 10 familias
b6_volantes.js           30 plantillas de hoja suelta + maqueta y plano
b6_examen.js             la hoja A4 del examen
b6_bandeja.js            la bandeja de descargas y el ZIP
b6_voz.js                voces del navegador y grabación por elemento
b6_voz_video_gratis.js   capta la voz gratis del navegador por el micro
netlify/functions/tts.js voz de estudio (OpenAI)
```

Y de CDN: **qrcodejs**, **jsPDF** y **JSZip**. Sin JSZip el botón de ZIP de la
bandeja no funciona en ninguna pestaña — estuvo faltando y ya está puesto.

---

## Contrato de datos

```
usuarios/{uid}
  plan    'free' | 'pro'        ← lo pone SOLO el admin
  marca   { nombre, tel, mail, web, dir, c1, c2 }

proyectos/{uid}/items/{id}
  tipo    'folleto' | 'video' | 'qr'
  nombre  string
  pagina  { rejilla, tema, formato, adornos, cabecera, celdas[], pie, colores }
  mini    miniatura JPEG pequeña (para la lista, sin repintar con el motor)
  creado / tocado
```

> El diseño escribía `proyectos/{uid}/{id}`, que en Firestore no es una ruta
> válida (colección/documento/colección). La ruta real es
> `proyectos/{uid}/items/{id}`.

**Las fotos no se suben.** Se guarda el diseño y el texto; las imágenes que la
persona pone en los cuadros se quedan en su dispositivo. Así ningún proyecto
pesa más de unos KB y nada privado sale sin pedirlo.

### En el dispositivo, no en la cuenta

```
localStorage
  eu_marca       respaldo de la ficha cuando no hay sesión
  eu_logo        el logo en PNG, reescalado a 512 px de lado mayor
  eu_logo_cfg    { pos: 'td'|'ti'|'pd'|'pc', tam: 4..22 }
```

El logo **no viaja a la cuenta**: es una imagen y no tiene por qué. Si no cabe
en el almacén del navegador, la página lo dice y lo usa mientras esté abierta.
Lo mismo con las fotos, los vídeos y los clips: nada de eso sale del móvil.

---

## Qué hace hoy (probado)

Doce pestañas: **Plantillas · Editor · Vídeo · Tríptico · Carrusel · Láminas ·
Repaso · Guías · Estudios · QR · Míos · Plan**.

- **Plantillas** — 56 plantillas dibujadas por el motor de verdad, de una en
  una para no bloquear el móvil. Filtros de materia, tono, hoja, cuadrícula,
  paleta y **troquel del cuadro** (15). El texto ya viene escrito con los datos
  del negocio.
- **Editor** — cuadrícula, hoja, 10 paletas y **8 combinaciones profesionales**,
  4 acabados, **15 troqueles** —también **uno por cuadro**—, número de cuadros;
  textos de cabecera, cuadros y pie con regenerado por cuadro; fotos y vídeos
  por cuadro y **varios de golpe**, con la cuadrícula creciendo hasta la que
  los acoja; colores de marca uno a uno; deshacer; bandeja. Descarga **JPG**
  siempre y **PDF de imprenta** en Pro.
- **Vídeo** — barra de tiempo con reloj para ir a cualquier instante, ↺
  rehacer el guion, segundos por cuadro, rótulo con el nombre del negocio,
  volumen y quitar la voz, y el guion entero para leer con la voz del móvil.
  Una escena por cuadro, **14 efectos** (8 en 3D, 6 planos),
  **5 cámaras**, **6 ambientes** (pétalos, corazones, rosas, brillo, chispas).
  **Tus propios clips** se pegan en medio del guion, recortados desde el
  segundo que se elija. Sonido: voz gratis, voz grabada, audio subido, voz de
  estudio (Pro) y **música de fondo**, todo mezclado dentro del archivo.
  Medida a elegir (como la hoja, 9:16, 1:1, 16:9) y **salidas por sitio**:
  se marcan Reels/TikTok, Facebook e Instagram, YouTube y WhatsApp y sale un
  archivo por cada uno con su medida. Bandeja de descargas.
- **Tríptico** — A4 apaisado en tres cuerpos por sus dos caras, plano y
  abriéndose como un libro. Plantilla del catálogo, los tres cuerpos con
  título y subtítulo editables, 🔁 por cuerpo, fotos y vídeos (uno a uno o
  varios repartidos), 8 combinaciones, 5 colores a mano, QR en el cuerpo de
  contacto. Descargas: esta cara, las 2 caras, los 6 cuerpos y PDF.
  **Vídeo narrado** —enseña la cara de fuera, la abre y se queda en la de
  dentro con el rótulo de lo que se cuenta— y **vídeo del libro**, en cuatro
  medidas, con la voz grabada o subida **dentro del archivo**.
- **Volantes y maquetas** (segundo modo de Tríptico) — 30 plantillas en tres
  variantes: volante de mano (12), cartel de mostrador (9) y hoja de mando
  (9). Tres vistas: la hoja, la pieza **puesta en el mundo** y el **plano de
  imprenta** con sangrado, marcas de corte, margen de seguridad y cotas.
  PNG, plano y **PDF con sangrado**.
- **Carrusel** — portada, cuerpo y cierre con número y flecha de «desliza»,
  tres medidas, plantilla del catálogo, título y subtítulo por diapositiva,
  **fotos y vídeos por cuadro**, PDF y ZIP.
- **Láminas** — 300 plantillas en 10 familias, con panel de siete solapas:
  Galería, **Contenido** (título, nodos uno a uno, pegar un texto que se
  reparte solo), **Estilo** (estructura, 22 paletas, colores a mano, 7
  formatos, 10 formas de nodo), **Medios** (foto o vídeo dentro del nodo,
  fondo con velo, pista de sonido), **Voz** (narrar al reproducir, voz del
  navegador y **tu voz elemento a elemento**), **Animación** —con barra de
  avance para mirar un momento concreto— y **Descargar** (PNG, PDF, PDF de la
  serie, ZIP, vídeo y vídeo con el sonido dentro). En Contenido se puede
  **traer una técnica del Cerebro** —el título es la técnica y cada paso una
  rama— y, en los carruseles, editar las **hojas de la serie**.
- **Repaso** — examen por familia con corrección al momento y hoja A4.
- **Guías** — la cabeza de maniquí con particiones y elevaciones.
- **Estudios** — las fichas de estudio de las técnicas.
- **QR** — teléfono, WhatsApp, correo, web, wifi, vCard, ubicación y texto.
  «No imprimir mis datos en la hoja» borra el contacto del pie: el dato viaja
  dentro del código. Se pone en el folleto y se baja en PNG.
- **Míos** — guardar, abrir, duplicar y borrar proyectos, **PNG de cada uno y
  ZIP de todos**.
- **Plan** — Free/Pro y el **muro de pago sólo al descargar**, nunca al
  diseñar.

**El logo** se sube una vez en la ficha del negocio (**nueve huecos** —los
mismos que la foto de las fichas de Estudios— y tamaño en porcentaje del
ancho, de 8 a 40 %) y sale en el folleto, el tríptico, el carrusel, las
láminas, los volantes y el vídeo, siempre en la misma capa: encima de la hoja
y debajo de la marca de agua. Se guarda en el dispositivo, reescalado a 512 px.

Cómo se ha comprobado: Chromium con la página servida en local. Las doce
pestañas abren sin un solo error de consola. Del vídeo salen archivos a la
medida exacta de cada sitio (540×960, 800×800, 854×480 medidos en el archivo);
un clip de color plano pegado en el guion aparece en el archivo grabado entre
el segundo 5,6 y el 8,4; y el vídeo de una lámina con pista sale con **audio
Opus dentro del contenedor**, no mudo.

Lo que **no** se ha podido probar aquí (necesita el sitio publicado): Firebase
(login, plan, marca, proyectos y el ZIP de Míos), la librería de QR, la de PDF
y la de ZIP —van por CDN, bloqueado en el entorno de pruebas— y la voz de
estudio.

---

## Topes de cada plan (están todos en un solo sitio: `eu_plan.js`)

| | Free | Pro |
| --- | --- | --- |
| Plantillas y paletas | todas | todas |
| JPG | sí | sí |
| PDF de imprenta | no | sí |
| Vídeo | hasta 15 s | hasta 60 s |
| Marca de agua | sí | no |
| Voz de estudio | no | sí |
| Proyectos guardados | 3 | sin límite |

---

## ❗ Lo que falta y hay que decidir

### 1. No hay forma de poner a alguien en Pro

Ningún panel escribe `usuarios/{uid}.plan`. Hoy hay que ponerlo a mano en la
consola de Firebase. **Falta un botón Free/Pro en `panel_admin.html`**, al
lado del de recargar créditos. No se ha hecho aquí para no tocar el panel de
créditos sin permiso.

### 2. Los dos diseños se contradicen en los topes

- El «Mapa de flujo» dice: marca de agua, vídeo de 15 s, sin PDF, 3 proyectos.
- El artboard grande dice: «sin marcas de agua ni tope de descargas» y «sin
  límite de escenas ni de duración».

Se ha implementado **el mapa de flujo** (la ficha de entrega). Si la idea es
que el Business no tenga topes, se cambian los números de `eu_plan.js` y ya.

### 3. ¿Gasta créditos?

Los bloques 6/8/9 cobran créditos por vídeo. El Estudio Universal **no cobra
nada**: se rige sólo por el plan. Si tiene que gastar créditos también, hay que
decirlo (se engancharía al mismo `hub_credito_bridge.js` que el resto).

### 4. La cabecera promete «facturas» y no hay facturación

El subtítulo de la página dice **«folletos · vídeo · QR · facturas»** y la
ficha del negocio dice «aparece en todo: folleto, vídeo, QR y factura». No hay
ninguna pestaña de facturación. Hay que decidir: o se hace la pantalla
(conceptos, IVA, descuento, numeración, QR de pago, ZIP del mes) o se corrige
el texto. **No se ha tocado el texto sin permiso.**

### 5. Lo que sigue faltando del diseño

La maqueta de las doce pantallas de Claude Design suma **255 mandos**. Se
extrajo uno a uno y se comparó contra el repositorio; lo que faltaba está
traído. Queda esto:

| Del diseño | Estado |
| --- | --- |
| **Tarjeta de facturación** | falta · ver el punto 4 |
| **Añadir QR a un vídeo ya editado** (cualquier MP4) | falta |
| Efectos de **texto** y transiciones **entre escenas** | falta — están los 14 del cuadro, los 6 de ambiente y las 5 de cámara |
| QR en **SVG**, esquinas y **logo en medio** | falta — hoy PNG con color |
| **Arrastrar para reordenar** escenas y diapositivas | falta — se mueven con flechas |
| **Tocar el texto en el lienzo** para editarlo | falta — se edita en el panel de la derecha |
| **Asistente** («¿qué necesitas hoy?», 3 preguntas → 3 plantillas) | falta |
| **Productividad** (tareas, notas, calendario de publicaciones) | falta |
| **Compartir** (enlace público de sólo ver) | falta — y hay que decidir antes dónde se aloja: hoy nada del Estudio sale del dispositivo |

Del informe técnico del propio proyecto de Claude Design quedan además:

| Punto | Estado |
| --- | --- |
| **P1 · Guías 3D** · campo de narración por paso, que mande sobre el texto del Cerebro | falta |
| **P2 · Guías 3D** · los nueve huecos y el tamaño de la foto, que ya existen en Estudios | falta ahí — el mismo patrón sí se usa ya para el logo |
| **P3 · Guías 3D** · la foto desaparece en modo dos cabezas | decisión de producto |
| **P4 · Bandeja** · se vacía al recargar; habría que guardarla en el dispositivo | falta |
| **D2** · jsPDF y JSZip vienen de un CDN: sin conexión no hay PDF ni ZIP | falta guardarlos en el propio proyecto |

> **Aviso honesto sobre el alcance de esta comparación.** El archivo de
> entrada de Claude Design pesa más de 256 KiB y la herramienta lo entrega
> cortado: la maqueta se lee entera, pero el último tramo del código no. Por
> eso se puede afirmar que **no falta ningún mando**, y no se puede afirmar
> que cada uno se comporte por dentro exactamente igual que allí.

### 6. Categorías que el cerebro no tiene

El diseño lista *bautizo*, *cumpleaños*, *recuerdo* e *iglesia*. El cerebro
tiene 32 rubros (peluquería, restaurante, bodas, eventos, inmobiliaria,
taller…) y uno libre, **«✍️ Otra (la escribo yo)»**, pero esos cuatro no tienen
textos propios. Si se quieren, se añaden en `b6_folleto_cerebro.js` con sus
servicios y sus frases.

### 7. Cosas del navegador que no se pueden arreglar desde aquí

- **La grabación va en tiempo real**: un vídeo de 30 s tarda 30 s. Es cosa del
  navegador, no del código. La página lo avisa.
- **La voz gratis no entra en el archivo**: suena por el altavoz y no pasa
  por la tarjeta de sonido. En Vídeo se capta por el micrófono (altavoz, no
  auriculares, y en silencio); en Láminas hace falta grabar cada elemento o
  subir una pista, y la página lo avisa en vez de entregar un archivo mudo.
- **La voz gratis se capta por el micrófono**: hay que usar altavoz (no
  auriculares) y estar en silencio. La página lo avisa.
- **MP4 o WebM** según el navegador. Si sale WebM, la página lo dice: se ve en
  ordenador y en Android, pero para iPhone hay que convertirlo.
- **La voz de estudio necesita `OPENAI_API_TOKEN`** en las variables de
  Netlify. Si no está, `functions/tts` contesta con el error y la página lo
  enseña tal cual.

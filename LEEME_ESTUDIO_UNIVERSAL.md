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
eu_nucleo.js             sesión, plan, marca, navegación, estado de la hoja
eu_plan.js               topes de Free/Pro, muro de pago, marca de agua
eu_parrilla.js           P1 · catálogo de plantillas con miniaturas reales
eu_editor.js             P2 · editor (Diseño/Textos/Fotos/QR/Marca) + JPG/PDF
eu_qr.js                 P4 · QR de 8 tipos
eu_video3d.js            P3 · estudio de vídeo 3D + sonido + grabación
eu_proyectos.js          P5 · guardar/abrir/duplicar/borrar en Firestore
```

Cada uno se protege con `window._EU_X_LOADED`, como los parches que ya existían.

### Se reutilizan (no se tocan)

```
b6_folleto_motor.js      dibuja la hoja (10 rejillas · 10 paletas · 7 formatos)
b6_folleto_cerebro.js    escribe los textos (32 rubros · 5 tonos)
b6_folleto_disenos.js    el catálogo de 26 plantillas
b6_voz_video_gratis.js   capta la voz gratis del navegador por el micro
netlify/functions/tts.js voz de estudio (OpenAI)
```

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

---

## Qué hace hoy (probado)

- **P1 · Plantillas** — las 26 plantillas dibujadas por el motor de verdad, de
  una en una para no bloquear el móvil. Filtros de categoría, tono, hoja,
  cuadrícula y paleta. El texto ya viene escrito con los datos del negocio.
- **P2 · Editor** — cuadrícula, hoja, 10 paletas, 4 acabados; textos de
  cabecera, cuadros y pie con regenerado por cuadro; fotos por cuadro; colores
  de marca; deshacer. Descarga **JPG** siempre y **PDF de imprenta** en Pro.
- **P3 · Vídeo** — una escena por cuadro. **8 animaciones 3D** (giro en Y,
  volteo en X, cubo, puerta, caída con rebote, profundidad, órbita, hoja que
  gira) + **4 entradas planas** (deslizar, olas, círculo, persiana) +
  **4 cámaras** (zoom lento, acercar, sacudida, fundido). Sonido: sin voz, voz
  gratis del navegador, grabar mi voz, subir audio, o voz de estudio (Pro).
  Cuando hay audio, **cada escena se estira o se acorta en proporción a su
  frase**. Subtítulos opcionales. Graba **MP4** (WebM y aviso si el navegador
  no sabe MP4), lado mayor 1280 px.
- **P4 · QR** — teléfono, WhatsApp, correo, web, wifi, vCard, ubicación y
  texto. Los campos vienen rellenos con la ficha del negocio. «No imprimir mis
  datos en la hoja» borra el contacto del pie: el dato viaja dentro del código.
  Se puede poner en el folleto (centrado o a la derecha) y bajar en PNG.
- **P5 · Míos** — guardar, abrir, duplicar y borrar proyectos.
- **P9 · Plan** — Free/Pro y el **muro de pago sólo al descargar**, nunca al
  diseñar.

Cómo se ha comprobado: Chromium con la página servida en local — las 26
miniaturas se pintan, el editor abre y responde, los 12 efectos y las 4 cámaras
se recorren sin un solo error de consola, y la grabación produce un **MP4 real
de 1,6 MB** que el sistema reconoce como ISO Media MP4.

Lo que **no** se ha podido probar aquí (necesita el sitio publicado):
Firebase (login, plan, marca, proyectos), la librería de QR y la de PDF —van
por CDN, bloqueada en el entorno de pruebas— y la voz de estudio.

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

### 4. Pantallas del diseño que todavía no están

| Del diseño | Estado |
| --- | --- |
| **Tríptico** (3 cuerpos por cara, PDF/PNG/JPG/ZIP/MP4) | falta |
| **Tarjeta de facturación** (conceptos, IVA, descuento, QR de pago, numeración, ZIP del mes, enviar por WhatsApp) | falta |
| **Carrusel de redes** (Instagram/TikTok/Facebook/Historia, diapositivas, PNG/MP4/ZIP, pie de foto y etiquetas) | falta |
| **«Vídeo con mis fotos»** (modo B: carrusel de fotos y vídeos subidos) | falta |
| **Añadir QR a un vídeo ya editado** (cualquier MP4) | falta |
| Efectos de **texto** (4) y transiciones **entre escenas** (4) | falta — están los 8 del cuadro, las 4 planas y las 4 de cámara |
| **Música de fondo que baja sola cuando habla la voz** | falta — hoy es una pista o la otra |
| QR en **SVG**, color, esquinas y **logo en medio** | falta — hoy PNG en blanco y negro |
| **Arrastrar para reordenar** escenas y diapositivas | falta |
| **Tocar el texto en el lienzo** para editarlo | falta — hoy se edita en el panel de la derecha |
| **Subir el logo** de la marca | falta — la ficha guarda colores, no logo |
| **P6 · Asistente** («¿qué necesitas hoy?», 3 preguntas → 3 plantillas) | falta |
| **P7 · Productividad** (tareas, notas, calendario de publicaciones) | falta |
| **P8 · Compartir** (enlace público de sólo ver) | falta — y hay que decidir antes dónde se aloja: hoy nada del Estudio sale del dispositivo |

### 5. Categorías que el cerebro no tiene

El diseño lista *bautizo*, *cumpleaños*, *recuerdo* e *iglesia*. El cerebro
tiene 32 rubros (peluquería, restaurante, bodas, eventos, inmobiliaria,
taller…) y uno libre, **«✍️ Otra (la escribo yo)»**, pero esos cuatro no tienen
textos propios. Si se quieren, se añaden en `b6_folleto_cerebro.js` con sus
servicios y sus frases.

### 6. Cosas del navegador que no se pueden arreglar desde aquí

- **La grabación va en tiempo real**: un vídeo de 30 s tarda 30 s. Es cosa del
  navegador, no del código. La página lo avisa.
- **La voz gratis se capta por el micrófono**: hay que usar altavoz (no
  auriculares) y estar en silencio. La página lo avisa.
- **MP4 o WebM** según el navegador. Si sale WebM, la página lo dice: se ve en
  ordenador y en Android, pero para iPhone hay que convertirlo.
- **La voz de estudio necesita `OPENAI_API_TOKEN`** en las variables de
  Netlify. Si no está, `functions/tts` contesta con el error y la página lo
  enseña tal cual.

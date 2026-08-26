# documentos_comerciales

Módulo de **documentos de negocio y papelería**. Facturas, presupuestos, recibos
y material corporativo. Aquí manda la claridad y la corrección legal: un
documento comercial precioso pero con un campo fiscal mal puesto no sirve.

## Antes de diseñar: pregunta el país

Los campos obligatorios de una factura cambian por país (identificación fiscal,
impuestos aplicables, numeración correlativa, menciones legales, plazos). **No
lo asumas ni lo inventes.** Pregunta el país y, si hace falta, verifícalo
(`research_engine`). Es la única pregunta realmente innegociable de este módulo.

## Documentos que cubre

Facturas · facturas rectificativas · recibos · presupuestos y cotizaciones ·
órdenes de compra · albaranes · notas de crédito y débito.

## Estructura de una factura que funciona

Emisor y receptor con sus datos fiscales · número correlativo y fecha ·
conceptos con cantidad, precio unitario e importe · base imponible, impuestos
desglosados y total destacado · forma de pago y datos bancarios · vencimiento ·
menciones legales al pie. El **total** es lo primero que busca el ojo: dale el
mayor peso visual de la página.

## Generación programática

- **HTML/CSS → PDF** — la vía recomendada: plantilla única, datos desde
  JSON/CSV/Excel, un PDF por registro. Control total y sin dependencias raras.
- **LaTeX / Typst** — cuando se exige máxima calidad tipográfica o volumen alto.
- Numeración automática y sin huecos, y **código QR de pago** cuando aporte.

Si la librería de PDF no está instalada, entrega el HTML listo para imprimir (con
`@media print` y tamaño A4 correcto) y avísalo: el usuario obtiene el PDF desde
el navegador y nadie se queda parado.

## Papelería corporativa

Manual de identidad · hoja membretada · sobres y carpetas · tarjetas de
presentación · firma de correo · credenciales · certificados y diplomas ·
invitaciones · etiquetas. Todo sale del mismo sistema de marca
(`brand_engine`): si cada pieza parece de una empresa distinta, no hay identidad.

## Especificaciones

Impreso en CMYK con sangrado de 3 mm, marcas de corte y textos a 5 mm del borde;
digital en RGB. El detalle completo de imprenta está en `format_engine.md`.
Entrega siempre las dos versiones: una para imprimir y otra ligera para enviar
por correo o WhatsApp.

## Principio

Legibilidad y corrección primero; identidad después; ornamento al final. Un
documento comercial se lee con prisa y a menudo en un móvil: que el importe, la
fecha y el vencimiento se encuentren sin buscarlos.

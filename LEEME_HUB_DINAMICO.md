# LEEME · HUB DINÁMICO (categorías nuevas sin tocar código)

## Qué es

Desde **Centro Admin → Biblioteca → pestaña "🚀 Bloques del Hub"** se pueden
crear, encender, apagar, editar y quitar categorías del inicio del hub
**sin tocar nunca más index.html / fatima_hub.html**. El hub las refleja en
tiempo real (segundos, sin recargar).

## Cómo agregar una categoría nueva

1. (Solo si es tipo "Bloque HTML") crear el archivo del bloque, ej.
   `bloque_maquillaje.html`, y subirlo al repositorio como siempre.
2. Abrir Biblioteca → pestaña **Bloques del Hub** → **＋ Nueva categoría**.
3. Llenar: nombre, icono (emoji), color, orden, descripción, imagen de
   portada (acepta link/ID de Drive — se convierte solo), tipo y contenido:
   - **🧩 Bloque HTML** → nombre del archivo (`bloque_maquillaje.html`).
   - **🎥 Video** → link de Drive o MP4/Storage (se convierte a /preview solo).
   - **🖼 Imagen** → URL o link/ID de Drive.
4. **Guardar y publicar** → la tarjeta aparece en el hub al instante.

Toggle verde = visible · gris = oculta. También se pueden apagar/encender
las 6 tarjetas originales (solo se ocultan del inicio, nada se borra).

## Contrato de datos (Firestore)

```
hub_tarjetas/din_{slot}   slot = 11..20 (pool de iframes de reserva)
  nom     string   nombre de la categoría (máx 60)
  desc    string   descripción corta
  imgUrl  string   portada (https, Drive ya convertido a thumbnail w1400)
  icono   string   emoji
  color   string   #rrggbb
  tipo    string   "html" | "video" | "imagen"
  src     string   html → "archivo.html" (mismo sitio, sin rutas)
                   video → https (Drive /preview o MP4/Storage)
                   imagen → https
  orden   number   posición en el grid
  activo  boolean  false = oculta del hub
  slot    number   iframe frame{slot} que usa (solo tipo html)

hub_tarjetas/{1..6}  (originales) admiten ahora también:
  activo  boolean  false = tarjeta original oculta del inicio
```

## Piezas (todo aditivo)

- `hub_bloques_dinamicos.js` — el hub lee `hub_tarjetas` en vivo, pinta las
  tarjetas dinámicas tras cada `renderHome()` y abre cada tipo (html →
  `cambiarBloque(slot)` con sesión/créditos heredados; video/imagen →
  teatro dorado dentro del hub). NO toca `BLOQUES_DATA` ni `app.js`.
- `biblioteca_bloques_parche.js` — inyecta la pestaña y el formulario en
  la Biblioteca. Reutiliza `db`, `normImg`, `normVid`, `toast`, `esc`.
- `index.html` + `fatima_hub.html` — pasada ÚNICA: pool `frame11..frame20`
  + 1 etiqueta script (los dos gemelos quedaron sincronizados).
- `biblioteca.html` — 1 etiqueta script.

## Seguridad

- `hub_tarjetas` ya era "leen alumnas logueadas, escribe solo la admin"
  (firestore.rules) — sin cambios de reglas.
- El hub valida antes de abrir: tipo html solo acepta `nombre.html` del
  mismo sitio (nunca URLs externas ni rutas); video/imagen solo https.

## Límite

10 categorías dinámicas a la vez (slots 11–20). Si el pool se llena,
quitar una para crear otra (o pedir ampliar el pool: es 1 línea por slot).

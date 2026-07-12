# 🧠 Motor Inteligente · el motor ya NO es ciego

**Fecha:** julio 2026 · **Archivos:** `motor_inventario.js` (nuevo) + retoques en `motor_auto.html`

## El problema que esto resuelve

El Motor Automático generaba "a ciegas": no sabía qué ya estaba generado en
Firebase, ni qué esperaba en la galería de revisión sin subir, ni qué había en
Google Drive. Relanzar un lote volvía a llamar a la API (Replicate, OpenAI,
fal…) por contenido YA PAGADO. Cada duplicado = dinero perdido.

## Qué hace ahora (automático, sin tocar nada)

Al entrar a `motor_auto.html` con tu sesión de administradora, el motor **lee
solo** todo lo que existe en Firebase (fitness, academia, hub, corte) y lo
mantiene actualizado en vivo. Verás una tarjeta nueva: **🧠 Producción
inteligente**, con el estado de cada cosa:

- 🟢 **ya existe** — no se toca, no se paga
- 🟡 **parcial** — carrusel a medias: solo se generan los pasos que faltan
- 🟠 **en tu galería sin subir** — ya la pagaste; apruébala y súbela, NO se regenera
- ☁️ **en Drive** — ya la tienes respaldada: botón **♻️ Recuperar de Drive** la
  registra en Firebase GRATIS, sin llamar a la IA
- ⚠️ **link corrupto** — no se ve en la app; se regenera al iniciar el lote
- 🔴 **falta** — esto es lo único que cuesta dinero

## Cómo trabajar ahora (recomendado)

1. Elige el sistema (Fitness / Peluquería / Hub / Corte) y tu selección.
2. Pulsa **🔍 Analizar mi selección** → te dice exactamente cuántas llamadas a
   la IA costará ANTES de gastar.
3. (Opcional) **☁️ Escanear Drive** → descuenta lo que ya tengas respaldado.
4. Dos formas de generar:
   - **🎯 Generar SOLO lo que falta** → activa "omitir" ✅, apaga "forzar
     regenerar" ❌ y lanza el lote solo con lo pendiente.
   - **Selección manual fila por fila**: en la lista del análisis, marca ✔
     las clases exactas que quieras (solo las pendientes tienen casilla) y
     pulsa **▶️ Generar las marcadas**. El tope "generar solo las primeras N"
     también manda aquí.

## Qué botón hace qué (ninguno es decorativo)

- Los **contadores** (`Academia img 170/299`, `láminas`, `clips`, `hub`,
  `corte`) son informativos: muestran cuánto existe ya en Firebase. No se
  pulsan.
- **🔍 Analizar mi selección** → calcula estados y costo de TU selección.
- **☁️ Escanear Drive** → necesita Drive conectado antes (tarjeta "Respaldo
  en Google Drive": Client ID + «Conectar Drive»).
- **🔬 Verificar pasos en Storage** → solo para VIDEOS de la Academia
  (modo Peluquería + 🎬): cuenta los clips paso_NN.mp4 reales.
- **🎯 Generar SOLO lo que falta** / **▶️ Generar las marcadas** → lanzan la
  producción; el avance sale en la barra y el registro negro de "🚀 Generar
  y subir". Los avisos de cada botón también aparecen en dorado dentro del
  propio panel.

## El guardián económico

Antes de CADA llamada a la IA, el motor registra en el log del panel (y en la
consola del navegador): `🛡️ IA imagen → clave · motivo · estado previo`.
Si la clave ya existe y tú no lo forzaste, la llamada se **CANCELA**:
`⛔ GUARDIÁN: … llamada a la IA CANCELADA — crédito protegido.`

**Regenerar algo que salió mal sigue siendo fácil**, pero solo a propósito:
marca "Forzar regenerar", o usa el 🔄 de la galería, o entra desde
`admin_motores` a esa clase concreta. El guardián lo permite y lo deja anotado.

## Otras protecciones incluidas

- Si Firebase falla al verificar, el lote se **DETIENE** (antes: el error se
  tragaba en silencio y el motor generaba de más).
- "Omitir las que ya están" ahora viene **marcado** también en Hub y Corte.
- El atajo desde `admin_motores` (?clase=…) ya no deja "Forzar regenerar"
  pegado al volver a generar por categorías.
- Cada clip de paso del carrusel queda registrado en
  `clases_imgs/{claseId}.pasos.paso_NN` (+ `pasos_total`): las clases a medias
  por fin se ven como 🟡 parcial. Para carruseles antiguos (subidos antes de
  este cambio) usa **🔬 Verificar pasos en Storage**.

## Videos de fitness: cómo los reconoce

Los clips se emparejan **igual que los lee el Bloque 5**: por combinación +
número de posición (`grupo_obj_equipo_nej_NN_…`), aceptando los clips
antiguos aunque tengan otro nombre de ejercicio, el prefijo `diaN_` delante
o el enlace guardado en otro campo (`url`, `link`, etc.). Así lo ya generado
sale 🟢 y no se paga dos veces.

Única excepción (sistema viejísimo): el video único "por día"
(`dia5_masa_gluteo`, un solo video para toda la clase) NO cuenta como
carrusel — si generas el carrusel de esa clase, convivirán y el Bloque 5
mostrará el carrusel nuevo (prioridad de clips sobre el video único).

## Datos (para no romper nada)

Solo se AÑADEN campos: `pasos` (mapa paso_NN → url) y `pasos_total` en
`clases_imgs/{claseId}`. Ningún campo existente cambia; la Academia, el Bloque
5, los escáneres y los paneles siguen leyendo lo mismo de siempre.
`escaner_faltantes_total.html` sigue funcionando como tablero de solo lectura.

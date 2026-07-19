# INFORME · Presupuesto de generación IA (Academia · Fitness · Hub · Corte)

Fecha: 2026-07-19
Para revisar: Fátima, al salir de trabajar (10pm)

## 1. Qué se construyó y por qué

Pediste (por voz) una forma de saber, antes de lanzar un lote nuevo en `motor_auto.html`,
qué media ya está generada y qué falta, y sobre todo **cuánto te va a costar en dinero**
generar lo que falta — para poder presupuestar. También preguntaste si convenía ampliar
el escáner que ya usas desde `centro_admin.html` o hacer uno aparte.

Se construyeron 3 cosas:

1. **`escaner_presupuesto_generacion.html`** — herramienta nueva, de solo lectura, que
   escanea las mismas 5 colecciones de Firebase que ya conoces y te da un desglose de
   piezas faltantes por categoría con un costo estimado en USD.
2. Un botón nuevo **"💰 Presupuesto IA"** en `centro_admin.html`, junto al de
   "🛰️ Escáner Total".
3. Este informe.

## 2. Decisión de arquitectura: herramienta nueva vs. ampliar el escáner existente

Se decidió **construir una herramienta nueva y separada**, no tocar
`escaner_faltantes_total.html`. Razones:

- Ya existe el mismo patrón en tu sistema: `escaner_clips_faltantes.html` es un
  "escáner hijo" standalone que duplica el boilerplate del escáner principal en vez de
  fusionarse con él — es el estilo aditivo que ya usas.
- `escaner_faltantes_total.html` es una herramienta que abres a diario para chequeos
  rápidos. Meterle inputs de precio y cálculos de presupuesto la haría más pesada y
  arriesgaría romper un flujo que ya funciona bien.
- La calculadora de presupuesto necesita datos que el escáner actual no carga
  (`motor_prompts.js`, para saber los 81 combos reales de fitness).

## 3. Cómo se calcula el presupuesto

**Universo total que se audita:**

| Categoría | Total | De dónde sale |
|---|---|---|
| Academia (Corte/Estudio) | 299 clases | Conteo real de `motor_p1_bioseg_balayage.js` + `motor_p2_queratina_elevaciones.js` + `motor_p3_morfologia_alertas.js` (91+104+104), expuesto en runtime como `window.MOTOR_FLAT` |
| Fitness | 81 combos únicos de lámina | 3 grupos × 3 objetivos × 3 equipos × 3 cantidades de ejercicio (6/8/12), calculado por `MOTOR_PROMPTS.fitnessCombos()` en `motor_prompts.js` |
| Hub | tarjetas registradas en `hub_tarjetas` | lo que exista hoy en esa colección |
| Corte M1–M7 | 7 módulos fijos | fijo en el propio motor de corte |

**Criterio de "falta":** el mismo que ya usa `escaner_faltantes_total.html` — un campo
vacío o un link que no empieza con `http`/`https` cuenta como pendiente. No se inventó
un criterio nuevo para que los números coincidan entre ambas herramientas.

**Multiplicadores de fitness:** cada combo tiene un número de ejercicios reales (6, 8 o
12) que determina cuántos paneles trae la lámina de imagen y cuántos clips de video
necesita; y tú eliges cuántas "versiones" de lámina quieres contar (por defecto 3,
igual que el valor por defecto de `motor_auto.html`).

**Fórmula por categoría** (la que aplica la herramienta):

```
Academia · imagen  = clases_faltantes_img × precio_imagen
Academia · video   = clases_faltantes_vid × clips_promedio_por_clase × precio_video
Fitness · imagen   = paneles_faltantes (Σ nej de cada lámina incompleta) × precio_imagen
Fitness · video    = clips_faltantes × precio_video
Hub                = tarjetas_faltantes × precio_imagen
Corte              = módulos_faltantes × precio_imagen
TOTAL              = suma de las 6 líneas de arriba
```

## 4. LIMITACIÓN CRÍTICA: los precios son estimados, no verificados

Se revisó **todo el repositorio** (código de `motor_auto.html`, `motor_prompts.js`,
`motor_inventario.js`, `netlify/functions/replicate.js`, `netlify/functions/aiproxy.js`
y todos los `LEEME*.md/.txt`) buscando algún precio en dólares ya guardado. **No existe
ninguno.** Lo único que el sistema ya calculaba antes de esta herramienta era un conteo
de *llamadas a la IA* (no de dinero), en `motor_inventario.js`.

Por eso, la herramienta nueva trae 2 campos de precio editables con valores de partida
(`$0.03` por imagen, `$0.05` por clip de video) que **debes verificar tú** en
[replicate.com/pricing](https://replicate.com/pricing) (o en el panel del proveedor que
uses si generas con OpenAI/Stability/fal.ai/Luma) antes de tomar cualquier decisión de
negocio con el total que te muestre. Los modelos que usa tu sistema por defecto son
`black-forest-labs/flux-dev` (imagen) y `wan-video/wan-2.2-t2v-fast` (video).

## 5. Discrepancia encontrada: "299" vs "360" clases

Varios comentarios en el código (`escaner_faltantes_total.html`, `motor_helper.js`,
y el propio `CLAUDE.md`) dicen "las 360 clases". El conteo real, sumando las entradas
de `motor_p1/p2/p3.js`, da **299**. No afecta el funcionamiento del sistema (es solo un
comentario, no una constante usada en cálculos), pero conviene saberlo — y por eso la
nueva herramienta usa 299 como fuente de verdad. Si quieres, en otro momento puedo
corregir esos comentarios desactualizados.

## 6. LIMITACIÓN DE ENTORNO: no hay acceso a tu Firebase real desde aquí

Este trabajo se hizo sin las credenciales de tu proyecto Firebase (`aprendisajefatima`).
**Ninguna cifra de "cuánto falta hoy" o "cuánto costaría hoy" fue calculada en esta
sesión** — no se generó ningún número real. Los números reales solo aparecen cuando
TÚ abres la herramienta en tu navegador e inicias sesión con tu correo de administradora.

## 7. Cómo usar la herramienta

1. Entra a `centro_admin.html` → pestaña **💰 Presupuesto IA** (o abre directamente
   `escaner_presupuesto_generacion.html`).
2. Inicia sesión con tu correo y contraseña de administradora (igual que en el Escáner
   Total).
3. Ajusta los 4 campos si quieres: precio por imagen, precio por clip de video,
   versiones objetivo de fitness, y clips promedio por clase de Academia.
4. Pulsa "🔄 Recalcular presupuesto" y lee el desglose por categoría y el total en USD
   al final.
5. Los números de "falta" deben coincidir con los que ya ves en
   `escaner_faltantes_total.html` — si no coinciden, algo cambió entre un escaneo y otro
   (por ejemplo, generaste algo entre medio).

## 8. Archivos tocados/creados

- `escaner_presupuesto_generacion.html` (nuevo)
- `centro_admin.html` (1 línea añadida al array `TOOLS`, nada más se tocó)
- `INFORME_PRESUPUESTO_GENERACION.md` (este documento)

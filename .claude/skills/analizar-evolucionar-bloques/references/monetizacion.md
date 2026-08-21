# 10 ideas de monetización (problema real → solución)

Cada idea parte de un problema real de las alumnas/peluqueras o del negocio, y dice **cómo
cobra** y con qué piezas del sistema se apoya. Al final, cómo priorizar.

## 1. Suscripción por niveles (Básico / Pro / Estudio)
- **Problema:** hoy la alumna prueba con ~10 créditos y no hay un plan claro de qué sigue;
  el ingreso es de cobro único.
- **Solución:** planes mensuales que recargan créditos y desbloquean tandas de clases
  (`acceso_clases`) automáticamente. Ingreso **recurrente** > cobro único.
- **Apoyo:** pozo global de créditos + `acceso_clases` (el admin ya asigna clases).

## 2. Certificado premium verificable con QR
- **Problema:** un PDF suelto no da credibilidad para conseguir clientas.
- **Solución:** certificado oficial de pago con **QR que apunta a una página pública de
  validación** (doc en Firebase con nombre, curso, fecha, folio). Emisión = servicio cobrado.
- **Apoyo:** los certificados jsPDF ya existen en `fatima_modules.js`; agregar colección
  `certificados/{folio}` (readable público) + página `verificar.html`.

## 3. Clases sueltas / packs temáticos a la carta
- **Problema:** no todas quieren el curso entero.
- **Solución:** vender clases sueltas o packs (balayage, colorimetría avanzada, keratina) con
  micro-pagos en créditos.
- **Apoyo:** el catálogo `MOTOR` ya está segmentado por `claseId`/categorías; solo falta el
  "escaparate" de compra por pack.

## 4. "Precios Pro": cotizador para la peluquera (B2B)
- **Problema:** la peluquera no sabe cobrar bien un servicio (producto + tiempo + margen).
- **Solución:** herramienta que calcula coste real y genera un **presupuesto PDF con su
  marca**. Se vende como herramienta profesional, no solo educativa.
- **Apoyo:** reusar la lógica de presupuesto de `calc_cromatica_v8.html` (`PresupBox`) y las
  calculadoras de `bloque8_construccion.html`.

## 5. Generador de marketing para el salón de la alumna
- **Problema:** las peluqueras necesitan reels/carteles/posts para captar clientas y no saben
  diseñar.
- **Solución:** bloque que genera pieza (post/reel/cartel) con su logo y datos; se cobra por
  generación (créditos) o suscripción de marketing.
- **Apoyo:** skill `fatima-creative-os` + generación IA (Replicate vía funciones Netlify).

## 6. Planes de nutrición/fitness personalizados premium
- **Problema:** los bloques 4/5/9 son educativos; muchas pagarían por un plan personalizado
  real con seguimiento.
- **Solución:** convertir en servicio de coaching: plan PDF personalizado + revisión periódica.
- **Apoyo:** `bloque4_nutricion.html`, `bloque5_fitness.html`, `bloque9_ejercicios.html` ya
  calculan macros/rutinas; falta el envoltorio de servicio de pago.

## 7. Licencia white-label para otras academias
- **Problema:** otras academias de belleza quieren su propia app y no pueden construirla.
- **Solución:** licenciar Fátima Pro como plantilla white-label (su marca, su Firebase). Ingreso
  **B2B alto** y recurrente.
- **Apoyo:** la arquitectura ya es config-driven (config Firebase embebida, marca por variables
  de color); documentar el proceso de "clonar y renombrar".

## 8. Afiliación de productos + tienda
- **Problema:** la alumna aprende una técnica y no sabe qué producto comprar.
- **Solución:** fichas de clase con productos recomendados / catálogo con enlace de compra →
  **comisión de afiliación**. Resuelve "qué compro" y monetiza.
- **Apoyo:** colección tipo `productos` (readable logueados, escribible admin) + tarjetas
  enlazadas por `claseId`.

## 9. Revisión de trabajos / mentoría por sesión
- **Problema:** el video no resuelve la duda concreta del trabajo real de la alumna.
- **Solución:** la alumna sube foto de su trabajo y paga créditos por una **revisión** (IA y/o
  de Fátima). Consultoría 1-a-1 escalable.
- **Apoyo:** subida de imagen a Storage + cola de revisión; cobro por el puente de créditos.

## 10. Gamificación + referidos + packs de recarga
- **Problema:** abandono y baja recompra.
- **Solución:** rachas, logros, **referidos ("trae una amiga = créditos")** y packs de recarga
  con descuento por volumen. Sube el LTV y la retención.
- **Apoyo:** extiende la recarga por WhatsApp existente (`_waRecharge`) y el dashboard de
  progreso de `fatima_modules.js`.

## Cómo priorizar
Puntúa cada idea por **impacto** (¿cuánto ingreso/retención mueve?) y **esfuerzo** (¿reusa lo
que ya existe o hay que construir mucho?). Empieza por lo de alto impacto y bajo esfuerzo:
- **Rápidas (reusan lo existente):** #1 suscripción, #3 packs, #10 referidos/recarga.
- **Medias:** #2 certificado QR, #4 cotizador, #8 afiliación.
- **Estratégicas (mayor construcción, mayor techo):** #5 marketing, #6 coaching, #7 white-label,
  #9 revisión de trabajos.
Regla: cobra la acción justo cuando la alumna **ve el valor**, y asegúrate de que lo caro (IA,
generación) esté cubierto por lo que cobra.

# Monetización (priorizada por economía real)

**Regla base:** la suscripción **NO** es el modelo por defecto. Es una posibilidad más y solo
se recomienda cuando tiene una justificación económica clara (ver el final). Elige el modelo
por el **problema** y por el **coste real**, no por costumbre. Toda idea que pueda gastar
dinero pasa por la **Regla económica** y el **informe económico** del `SKILL.md`.

## Orden de preferencia de modelos (de menor a mayor compromiso)
1. **Herramientas gratuitas para captar usuarios** — resuelven algo real sin coste externo;
   son el gancho de entrada.
2. **Compras únicas** — pago una vez por un desbloqueo permanente.
3. **Pago por uso** — se cobra por acción, alineado con el coste que esa acción genera.
4. **Créditos** — prepago que amortigua el coste variable (ya existe el pozo global).
5. **Packs de créditos** — descuento por volumen; mejora caja sin coste recurrente.
6. **Productos digitales** — PDF, guías, plantillas: coste marginal ~0 tras crearlos.
7. **Servicios premium** — revisión, mentoría, coaching (coste = tiempo, no infraestructura).
8. **Funcionalidades B2B** — herramientas profesionales para la peluquera (mayor disposición
   a pagar).
9. **White-label** — licenciar la plantilla a otras academias (ticket alto, coste marginal
   bajo).
10. **Afiliación / comisiones** — ingreso sin coste de producción propio.
11. **Suscripción** — **solo** con justificación económica clara (ver abajo).

## Cuándo (y solo entonces) proponer una suscripción
Al proponer una suscripción, la skill DEBE explicar:
- **qué problema** resuelve;
- **por qué** una suscripción es mejor que un pago único o un pago por uso para ese caso;
- **qué costes recurrentes** existen que la suscripción cubre;
- **cuánto** habría que ingresar al mes para cubrirlos (umbral de rentabilidad);
- **qué alternativa sin suscripción** existe.
Si no cubre costes recurrentes reales, **no es una suscripción: es un pago por uso disfrazado**
→ usa pago por uso o créditos.

---

# Ideas por problema real (con implicación de coste)

Cada idea indica su **coste externo** de forma cualitativa. Antes de implementar cualquiera con
🟡/🔴, completa el **informe económico** del `SKILL.md` (con cifras o "pendiente de determinar",
nunca inventadas).

### 🟢 Sin coste externo (empezar por aquí)
- **Herramienta gratuita de captación** — p.ej. un mini-diagnóstico o calculadora que ya corre
  en el navegador (JavaScript). Modelo: gancho → luego compra única / créditos.
  *Problema:* atraer usuarias nuevas sin gastar. *Coste:* solo desarrollo.
- **Clases sueltas y packs temáticos** — vender acceso a contenido que **ya existe** (catálogo
  `MOTOR`, `acceso_clases`). Modelo: compra única o créditos.
  *Problema:* no todas quieren el curso entero. *Coste:* solo el pago (Firestore ya en uso).
- **Productos digitales** (guías/plantillas PDF) — se generan con jsPDF en cliente. Modelo:
  compra única. *Coste externo:* ninguno tras crearlos.
- **"Precios Pro": cotizador para la peluquera (B2B)** — cálculo determinista + PDF en cliente,
  reusa `PresupBox` de `calc_cromatica_v8.html` y las calculadoras de `bloque8`.
  *Problema:* no saben cobrar bien. *Coste externo:* ninguno. **Alta prioridad: B2B sin coste.**
- **Gamificación y referidos** — rachas/logros con datos ya en Firestore; "trae una amiga = X
  créditos". *Problema:* retención y recompra. *Coste externo:* ninguno (solo escrituras que ya
  ocurren). Cuida solo el anti-abuso de referidos.

### 🟡 Coste variable (requiere informe económico + límites)
- **Revisión de trabajos / mentoría por sesión** — si la revisión es **humana**, el coste es
  tiempo (no infraestructura) → 🟢 servicio premium. Si se apoya en **IA de visión**, es 🟡:
  hay coste por imagen analizada. Antes de usar IA aplica **Control de IA** del `SKILL.md`;
  cobra créditos que cubran el coste + margen y pon límite diario.
- **Generador de marketing para el salón** — usa generación IA (Replicate/APIs). 🟡/🔴 según
  volumen. Reusa `fatima-creative-os` para la parte determinista (plantillas, layout) y reserva
  la IA solo para lo que de verdad la necesita. Cobra por generación; nunca ilimitado.
- **Planes de nutrición/fitness "premium"** — si el plan se arma con la **lógica ya existente**
  (`calcMacros`, `calcNut`, catálogos), es 🟢 (producto digital / servicio). Solo es 🟡 si se
  añade IA generativa: entonces, informe económico y créditos.
- **Afiliación de productos + tienda** — 🟢 en coste externo (enlaces); el "coste" es mantener
  el catálogo. Ingreso por comisión.

### 🔵 B2B / licencia (coste marginal bajo, ticket alto)
- **Licencia white-label para otras academias** — coste = soporte y despliegue, no por usuario.
  *Problema:* otras academias quieren su app y no pueden construirla. Modelo: licencia (pago
  único de setup + tarifa) — evaluar si recurrente se justifica por soporte real.

### ⚠️ Suscripción (última opción, con justificación)
- **Suscripción por niveles** — solo si hay **costes recurrentes reales** que cubrir (p.ej.
  almacenamiento creciente, IA recurrente, soporte continuo). Si el valor es contenido estático
  que ya está pagado, es mejor **compra única / packs de créditos**. Aplica la sección "Cuándo
  proponer una suscripción" y demuestra el umbral de rentabilidad antes de recomendarla.

## Cómo priorizar (impacto × esfuerzo × coste)
1. Primero lo **🟢 sin coste externo** de alto impacto: cotizador B2B, packs, productos
   digitales, gamificación/referidos.
2. Luego lo **🟡** solo con informe económico aprobado y límites: revisión con IA, marketing IA.
3. Lo **🔵 B2B/white-label** cuando haya demanda concreta.
4. La **suscripción** al final, y solo si pasa su justificación económica.
Regla de cierre: **cobra la acción justo cuando la usuaria ve el valor**, y verifica
**INGRESO POR USO > COSTE REAL POR USO** antes de encender cualquier función con coste variable.

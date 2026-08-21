# Catálogo de automatizaciones (con bandera de coste y control)

**Regla de no gasto silencioso (del `SKILL.md`):** ninguna automatización puede ejecutarse
indefinidamente ni hacer llamadas externas ilimitadas. Cada una lleva su **bandera de coste** y
su **mecanismo de control obligatorio**. Antes de encender cualquiera 🟡/🔴, completa el
**informe económico**.

Banderas: 🟢 sin coste externo · 🟡 coste bajo/acotable · 🟠 coste variable · 🔴 riesgo de coste
elevado si no se controla.

## Operación diaria
1. **Generación de media desatendida por lotes** — 🔴 (Replicate/APIs de imagen/vídeo por
   operación). *Control obligatorio:* tope de N por tanda, "omitir las que ya están", límite
   diario y mensual, timeout por llamada, control de reintentos (máx. 1–2), registro del
   consumo, botón/flag de desactivación, y **aprobación explícita** del tamaño de tanda.
   *Alternativa:* generar solo lo que falta (nunca regenerar en masa). Se apoya en las tandas
   que ya ofrece `motor_auto.html`.
2. **Escáner de faltantes proactivo** — 🟢 (solo lecturas Firestore que ya se hacen).
   *Control:* frecuencia acotada (p.ej. diaria), no dispara generación por sí mismo; solo
   informa. Riesgo real: coste de lecturas si se abusa de la frecuencia → cachear resultado.
3. **Onboarding y recordatorios por WhatsApp** — 🟠/🔴 según proveedor: WhatsApp vía API de
   terceros suele ser **de pago por mensaje**; un enlace `wa.me`/`abrirWA` que abre el chat es
   🟢 (lo envía la persona, no el sistema). *Control obligatorio si es API:* límite de mensajes
   por usuario y por día, deduplicación, plantilla aprobada, registro de envíos, desactivación.
   *Coste:* **pendiente de determinar** (depende del proveedor). *Preferir* el enlace manual
   `wa.me` (gratis) frente al envío automático de pago.

## Integridad del sistema
4. **Chequeo de sincronía de duplicados** — 🟢 (comparación de archivos en el repo). *Control:*
   corre en el workflow de GitHub o como paso de `revisor-fatima`; sin coste externo.
5. **Backup automático de Firestore/Storage** — 🟠 (coste de almacenamiento del backup + posible
   coste de operaciones de lectura/exportación). *Control obligatorio:* frecuencia acotada,
   retención limitada (borrar backups viejos), tamaño vigilado, registro. *Coste:* pendiente de
   determinar según destino.
6. **Emisión automática de certificado** — 🟢 (jsPDF en cliente + una escritura Firestore).
   *Control:* se dispara una sola vez por módulo completado (idempotente); sin coste externo.
7. **Health-check de deploy** — 🟢/🟡 (peticiones a funciones Netlify y una lectura de prueba).
   *Control:* frecuencia baja, timeout, no reintentar en bucle. Coste marginal.
8. **Conversión automática de links de Drive** — 🟢 (transformación de strings en cliente, reusa
   `*_drive_fix.js`). Sin coste externo.
9. **Retry / regeneración automática de media fallida** — 🔴 (cada retry es otra llamada de
   pago). *Control obligatorio y estricto:* **máximo de reintentos duro** (1–2), backoff,
   protección contra loops, no reintentar errores no transitorios, registro del consumo,
   desactivación. El failover de hosting (`puente_inteligente.js`) cambia de puerta, **no**
   autoriza a reintentar sin límite.

## Negocio
10. **Reporte semanal al owner** — 🟢/🟡 (agrega lecturas que en su mayoría ya ocurren; si se
    envía por email/WhatsApp de pago, hereda ese coste). *Control:* una ejecución semanal,
    consulta acotada, canal preferente gratuito.

## Reglas transversales para cualquier automatización
- **Todo scheduler** (Netlify Scheduled Functions, GitHub Actions cron, etc.) debe tener
  frecuencia mínima justificada y un interruptor de apagado. Un cron mal puesto es la vía más
  común de gasto silencioso.
- **Toda llamada externa** lleva: timeout, tope de reintentos, control de errores y registro del
  consumo, desde la primera versión.
- **Toda automatización con IA/APIs de pago** completa el informe económico y espera aprobación
  explícita antes de activarse.
- Prioriza siempre la variante **determinista/gratuita** (escáner que informa vs. generación que
  gasta; enlace `wa.me` vs. envío automático de pago).

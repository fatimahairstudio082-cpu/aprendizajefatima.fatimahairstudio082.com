# Categorías de bloques autónomos a agregar

"Autónomo" = un bloque que aporta valor **sin intervención manual constante del admin**: o se
alimenta solo del contenido de las usuarias, o se auto-actualiza, o responde 24/7. Cuatro
categorías, con bloques concretos por categoría.

## A. Gestión del negocio de la alumna
Convierte la app de "academia" a "sistema operativo del salón". Alto valor y fideliza.
- **CRM de clientas** — ficha por clienta con **historial de fórmula/color** (nivel, volumen,
  marca, resultado) y notas. Autónomo: recuerda la última fórmula al volver.
- **Agenda / reservas** — citas con confirmación y recordatorio automático por WhatsApp.
- **Finanzas del salón** — registro de ingresos/gastos con dashboards automáticos (mensual,
  servicio más rentable).
- **Portafolio público auto-generado** — página del trabajo de la alumna creada sola desde las
  fotos que sube; enlace para compartir con clientas.

## B. Comunidad y engagement
Se alimenta del contenido de las propias usuarias → crece sin trabajo del admin.
- **Foro / comunidad** entre alumnas (preguntas, antes/después, dudas de técnica).
- **Retos y plan semanal auto-generado** — un reto nuevo cada semana sin que nadie lo suba a
  mano (extiende el "Plan Semanal" de `bloque9_ejercicios.html`).
- **Ranking / logros** — tabla de progreso y racha; combina con la gamificación de
  monetización #10.

## C. Inteligencia / asistente autónomo
Responde y se actualiza solo.
- **Chatbot experto 24/7** — responde dudas de las alumnas basándose en el catálogo `MOTOR`
  (360 clases) y el conocimiento (`app.js`). Reduce soporte manual.
- **Bloque de tendencias auto-actualizado** — trae novedades de colorimetría/corte y las
  publica solo (reusa la colección `noticias` existente).

## D. Comercio
Genera ingreso de forma pasiva.
- **Tienda / catálogo de productos** — autoservicio con enlaces de compra/afiliación
  (monetización #8).
- **Marketplace de clases sueltas** — escaparate de packs a la carta (monetización #3).

## Cómo elegir el siguiente bloque
1. ¿Resuelve un problema que la alumna tiene **todos los días** (no solo mientras estudia)?
   → categoría A suele ganar (la retiene aunque termine el curso).
2. ¿Puede funcionar **sin que el admin lo alimente**? Si no, no es autónomo — replantéalo.
3. ¿Reusa Firebase + créditos + header común? Cuanto más reuse, más barato de construir.
4. Constrúyelo **aditivo**: nuevo archivo `bloqueN_xxx.html` + registro como iframe en el hub
   (recordar sincronizar `index.html` y `fatima_hub.html`) + colección Firestore nueva con sus
   reglas (que se pegan a mano en la consola).

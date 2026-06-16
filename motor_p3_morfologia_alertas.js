/**
 * ═══════════════════════════════════════════════════════════════
 *  MOTOR DE CONOCIMIENTO — ACADEMIA FÁTIMA CALDERA
 *  Parte 3 / 3 — Categorías 16–22 (FINAL)
 *  Morfología · Corrección de Color · Matización · Mezclas
 *  Cab.Graso · Cab.Reseco · Alertas Cliente · Alertas Peluquero
 *
 *  INSTALACIÓN COMPLETA DEL SISTEMA:
 *  En fatima_peluqueria.html, dentro del <head>,
 *  ANTES del <script> principal del archivo, agregar:
 *
 *  <script src="motor_p1_bioseg_balayage.js"></script>
 *  <script src="motor_p2_queratina_elevaciones.js"></script>
 *  <script src="motor_p3_morfologia_alertas.js"></script>
 *
 *  FIREBASE STORAGE — SUBIR IMÁGENES Y VIDEOS:
 *  Ruta: academia/{cat_slug}/{clase_id}/imagen.jpg
 *        academia/{cat_slug}/{clase_id}/video.mp4
 *  Ejemplo: academia/morfologia/mor_p01/imagen.jpg
 *
 *  CÓMO SUBIR DESDE FIREBASE CONSOLE:
 *  1. Firebase Console → Storage → carpeta "academia"
 *  2. Crear subcarpeta con el slug de la categoría
 *     (ej: "morfologia", "correccion_de_color", "cab_graso")
 *  3. Dentro: crear carpeta con el ID de la clase
 *     (ej: "mor_p01")
 *  4. Subir: imagen.jpg (miniatura) y video.mp4 (clase)
 *  El sistema los detecta automáticamente al seleccionar la clase.
 * ═══════════════════════════════════════════════════════════════
 */

window.CONOCIMIENTO_P3 = {

// ════════════════════════════════════════════════════════
"👤 Morfología": [
  // ── PRINCIPIANTE ──
  {id:"mor_p01",n:"Qué es la Morfología Facial",niv:"p",dur:"10 min",
   img:"https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",videoUrl:"",
   tools:["Espejo grande","Tabla de morfología"],
   vt:"Introducción a la Morfología",vds:"Por qué el análisis facial es el primer paso antes de cualquier servicio.",
   txt:`<div class="importante">📌 La morfología facial es el análisis de la forma del rostro para elegir el corte, color y peinado que más favorece.</div>
<div class="punto"><span class="punto-num">1</span><span>Antes de sugerir cualquier servicio: analiza la forma del rostro del cliente.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Un servicio que favorece la morfología fideliza para siempre. Uno que no, genera insatisfacción.</span></div>
<div class="tip">✅ El análisis morfológico es el diferencial que separa al asesor de imagen del peluquero genérico.</div>`},

  {id:"mor_p02",n:"Las 7 Formas de Rostro — Guía Completa",niv:"p",dur:"15 min",
   img:"https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",videoUrl:"",
   tools:["Espejo grande","Tabla de morfología","Lápiz de labios (para trazar)"],
   vt:"Guía de Formas de Rostro",vds:"Cómo identificar cada forma de rostro con precisión.",
   txt:`<div class="punto"><span class="punto-num">1</span><span><strong>Ovalado:</strong> el ideal universal. Frente ligeramente más ancha que el mentón, mejillas redondeadas.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Redondo:</strong> anchura y longitud similares. Mejillas llenas. Sin ángulos marcados.</span></div>
<div class="punto"><span class="punto-num">3</span><span><strong>Cuadrado:</strong> mandíbula y frente igual de anchas. Ángulos pronunciados.</span></div>
<div class="punto"><span class="punto-num">4</span><span><strong>Corazón (triángulo invertido):</strong> frente ancha, mentón estrecho y puntiagudo.</span></div>
<div class="punto"><span class="punto-num">5</span><span><strong>Alargado (oblongo):</strong> más largo que ancho. Frente, mejillas y mandíbula similares en anchura.</span></div>
<div class="punto"><span class="punto-num">6</span><span><strong>Diamante:</strong> pómulos anchos, frente y mentón estrechos.</span></div>
<div class="punto"><span class="punto-num">7</span><span><strong>Triángulo (pera):</strong> mandíbula más ancha que la frente.</span></div>`},

  {id:"mor_p03",n:"Cortes Recomendados por Morfología",niv:"p",dur:"15 min",
   img:"https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",videoUrl:"",
   tools:["Tabla de morfología","Catálogo de cortes","Espejo"],
   vt:"Cortes por Forma de Rostro",vds:"Qué corte favorece a cada morfología.",
   txt:`<div class="punto"><span class="punto-num">1</span><span><strong>Ovalado:</strong> cualquier corte funciona. Es el ideal universal.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Redondo:</strong> capas verticales que alarguen. Evitar volumen en los lados.</span></div>
<div class="punto"><span class="punto-num">3</span><span><strong>Cuadrado:</strong> capas suaves y ondas. Nunca líneas muy rectas horizontales.</span></div>
<div class="punto"><span class="punto-num">4</span><span><strong>Corazón:</strong> volumen en la parte baja. Evitar volumen en la frente y la coronilla.</span></div>
<div class="punto"><span class="punto-num">5</span><span><strong>Alargado:</strong> capas laterales para dar anchura. Evitar altura en la coronilla.</span></div>
<div class="tip">✅ El cliente que se ve bien con el corte que elegiste para su morfología vuelve siempre.</div>`},

  {id:"mor_p04",n:"Color según Morfología — Ilusión Óptica",niv:"p",dur:"12 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Tabla cromática","Catálogo de colores","Espejo"],
   vt:"Color y Morfología",vds:"Cómo usar el color para crear ilusión óptica y equilibrar el rostro.",
   txt:`<div class="importante">📌 El color puede alargar, ensanchar, adelgazar o acortar visualmente el rostro — igual que el corte.</div>
<div class="punto"><span class="punto-num">1</span><span>Colores claros en los laterales: ensanchan el rostro. Ideal para rostros alargados.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Colores oscuros en los laterales: afilan y alargan. Ideal para rostros redondos.</span></div>
<div class="punto"><span class="punto-num">3</span><span>Mechas en la zona del flequillo: iluminan el centro y alargan la nariz visualmente.</span></div>
<div class="tip">✅ La estrategia de color según morfología es un argumento de venta poderoso y diferenciador.</div>`},

  {id:"mor_p05",n:"Cómo Hacer el Análisis al Cliente",niv:"p",dur:"10 min",
   img:"https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",videoUrl:"",
   tools:["Espejo grande","Ficha de cliente","Tabla de morfología"],
   vt:"Protocolo de Análisis Morfológico",vds:"Cómo presentar el análisis al cliente de forma profesional.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Pedir al cliente que se recoja el cabello completamente hacia atrás antes del análisis.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Observar desde el frente a 1 metro de distancia — no desde arriba ni de lado.</span></div>
<div class="punto"><span class="punto-num">3</span><span>Presentar el análisis como una recomendación personalizada, no como un diagnóstico.</span></div>
<div class="tip">✅ Frase que funciona: "Basándome en tu forma de rostro, el corte que más te va a favorecer es..."</div>`},

  // ── INTERMEDIO ──
  {id:"mor_i01",n:"Morfología y Frente — Análisis Completo",niv:"i",dur:"18 min",
   img:"https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",videoUrl:"",
   tools:["Espejo grande","Tabla completa de morfología"],
   vt:"Análisis de Frente y Sien",vds:"Cómo el ancho de la frente determina el tipo de flequillo ideal.",
   txt:`<div class="importante">📌 El análisis completo incluye frente, pómulos, mandíbula Y características adicionales como orejas y nariz.</div>
<div class="punto"><span class="punto-num">1</span><span><strong>Frente amplia:</strong> flequillo lateral o cortina para reducir visualmente el ancho.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Frente pequeña:</strong> evitar flequillos voluminosos que la reduzcan más.</span></div>
<div class="punto"><span class="punto-num">3</span><span><strong>Sien pronunciada:</strong> volumen en la zona media del cabello para equilibrar.</span></div>
<div class="tip">✅ El análisis detallado de la frente es lo que convierte un corte genérico en uno completamente personalizado.</div>`},

  {id:"mor_i02",n:"Morfología en Hombres — Diferencias Clave",niv:"i",dur:"15 min",
   img:"https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",videoUrl:"",
   tools:["Espejo","Catálogo de cortes masculinos","Tabla de morfología"],
   vt:"Morfología Masculina",vds:"Cómo aplicar el análisis morfológico al cliente masculino.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>En hombres la mandíbula cuadrada es valorada — no siempre hay que suavizarla.</span></div>
<div class="punto"><span class="punto-num">2</span><span>El análisis en hombres se centra más en: forma de cabeza, implantación del cabello, entradas.</span></div>
<div class="importante">📌 En cortes masculinos: las entradas y la implantación determinan más el corte que la forma del rostro.</div>`},

  {id:"mor_i03",n:"Peinados según Morfología",niv:"i",dur:"15 min",
   img:"https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800",videoUrl:"",
   tools:["Tabla de morfología","Catálogo de peinados","Espejo grande"],
   vt:"Peinados por Forma de Rostro",vds:"Qué peinados favorecen y cuáles perjudican según la morfología.",
   txt:`<div class="punto"><span class="punto-num">1</span><span><strong>Rostro redondo:</strong> recogidos altos que alarguen. Evitar moños bajos que ensanchen.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Rostro cuadrado:</strong> recogidos con mechones sueltos en los laterales para suavizar.</span></div>
<div class="punto"><span class="punto-num">3</span><span><strong>Rostro ovalado:</strong> cualquier recogido favorece. Aprovechar para experimentar.</span></div>
<div class="tip">✅ El recogido correcto para la morfología puede hacer que el cliente se vea 5 años más joven.</div>`},

  {id:"mor_i04",n:"Tono de Piel y Morfología — Análisis Integral",niv:"i",dur:"20 min",
   img:"https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",videoUrl:"",
   tools:["Muestras de color","Tabla de tonos de piel","Espejo con luz natural"],
   vt:"Análisis Integral de Imagen",vds:"Cómo combinar morfología, tono de piel y tipo de cabello.",
   txt:`<div class="importante">📌 La imagen completa combina tres variables: morfología facial + tono de piel + tipo de cabello.</div>
<div class="punto"><span class="punto-num">1</span><span><strong>Piel fría + morfología cuadrada:</strong> colores ceniza o platino suavizan los ángulos.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Piel cálida + morfología redonda:</strong> colores oscuros en los laterales afilan el rostro.</span></div>
<div class="tip">✅ Este análisis integral es el servicio de asesoría de imagen más valorado y mejor pagado del salón.</div>`},

  {id:"mor_i05",n:"Fotografía del Análisis — Documentación Visual",niv:"i",dur:"10 min",
   img:"https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",videoUrl:"",
   tools:["Smartphone","Luz natural","Fondo neutro","Ficha de cliente"],
   vt:"Documentación Morfológica",vds:"Cómo fotografiar y registrar el análisis para seguimiento.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Foto frontal con cabello recogido — la que muestra mejor la forma del rostro.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Foto de perfil derecho e izquierdo para análisis completo.</span></div>
<div class="tip">✅ Las fotos de análisis guardadas en la ficha del cliente hacen que cada visita sea más personalizada.</div>`},

  // ── AVANZADO ──
  {id:"mor_a01",n:"Asesoría de Imagen Completa como Servicio Premium",niv:"a",dur:"30 min",
   img:"https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",videoUrl:"",
   tools:["Ficha de asesoría completa","Tabla de morfología","Catálogo de estilos","Cámara"],
   vt:"Consultoría de Imagen Profesional",vds:"Cómo estructurar y vender la asesoría de imagen como servicio independiente.",
   txt:`<div class="importante">📌 La asesoría de imagen es el servicio premium más escalable: no requiere productos, solo conocimiento.</div>
<div class="punto"><span class="punto-num">1</span><span>Sesión de 60-90 minutos con análisis completo: morfología, tono de piel, estilo de vida, presupuesto.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Entrega: informe personalizado con recomendaciones de corte, color y mantenimiento.</span></div>
<div class="tip">✅ Una asesoría de imagen cobrada como servicio independiente puede valer entre 50€ y 150€.</div>`},

  {id:"mor_a02",n:"Morfología y Envejecimiento — Adaptación con los Años",niv:"a",dur:"22 min",
   img:"https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",videoUrl:"",
   tools:["Fotos de referencia por edad","Tabla de morfología","Espejo con buena luz"],
   vt:"Morfología y Edad",vds:"Cómo la morfología cambia con los años y cómo adaptar el servicio.",
   txt:`<div class="importante">📌 La morfología del rostro cambia con los años: la piel pierde firmeza y el óvalo se transforma.</div>
<div class="punto"><span class="punto-num">1</span><span>A partir de los 40: evitar cortes muy cortos en las sienes — pueden endurecer los rasgos.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Los colores cálidos y luminosos cerca del rostro rejuvenecen visualmente.</span></div>
<div class="tip">✅ El cliente que envejece y sigue viéndose bien con tu asesoría es el cliente más fiel de tu carrera.</div>`},

  {id:"mor_a03",n:"Morfología en Medios y Redes — Posicionamiento",niv:"a",dur:"20 min",
   img:"https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",videoUrl:"",
   tools:["Cámara","Ring light","Texto para publicación","Tabla de morfología"],
   vt:"Comunicación de Morfología en Redes",vds:"Cómo usar el conocimiento de morfología para generar contenido de valor.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Publicaciones sobre morfología generan entre 3 y 5 veces más interacción que los simples antes/después.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Formato que funciona: "Cortes según forma de rostro" con imágenes y explicaciones claras.</span></div>
<div class="tip">✅ El conocimiento de morfología publicado en redes posiciona como experta en imagen, no solo en peluquería.</div>`}
],

// ════════════════════════════════════════════════════════
"🎯 Corrección de Color": [
  // ── PRINCIPIANTE ──
  {id:"cco_p01",n:"Qué es la Corrección de Color",niv:"p",dur:"8 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Rueda cromática","Tabla de corrección"],
   vt:"Fundamentos de la Corrección",vds:"Qué es y cuándo se necesita una corrección de color.",
   txt:`<div class="importante">📌 La corrección de color es el proceso de neutralizar o modificar un color existente que no es el deseado.</div>
<div class="punto"><span class="punto-num">1</span><span>Se necesita cuando: el color resultó de un tono diferente al deseado, o hay colores previos incompatibles.</span></div>
<div class="punto"><span class="punto-num">2</span><span>La corrección puede requerir 1, 2 o hasta 5 sesiones según la complejidad.</span></div>
<div class="alerta">⚠️ Nunca prometer corrección en una sesión sin antes hacer el diagnóstico completo.</div>`},

  {id:"cco_p02",n:"La Rueda Cromática — Colores Opuestos",niv:"p",dur:"12 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Rueda cromática","Tabla de neutralización"],
   vt:"Rueda Cromática de Neutralización",vds:"La herramienta fundamental de toda corrección de color.",
   txt:`<div class="importante">📌 Los colores opuestos en la rueda cromática se neutralizan mutuamente. Esta es la ley de la corrección.</div>
<div class="punto"><span class="punto-num">1</span><span><strong>Naranja/Cobrizo</strong> → neutralizar con <strong>Azul (Ceniza)</strong>. Tintes .1 o .11.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Amarillo</strong> → neutralizar con <strong>Violeta</strong>. Matizadores o tintes .2.</span></div>
<div class="punto"><span class="punto-num">3</span><span><strong>Rojo</strong> → neutralizar con <strong>Verde</strong>. Tintes .3 o mezcla complementaria.</span></div>
<div class="punto"><span class="punto-num">4</span><span><strong>Verde</strong> → neutralizar con <strong>Rojo/Cobre</strong>. Tintes .4 o .44.</span></div>
<div class="tip">✅ Memorizar la rueda cromática es tan importante como memorizar la tabla numérica de colores.</div>`},

  {id:"cco_p03",n:"Diagnóstico Pre-Corrección",niv:"p",dur:"15 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Ficha técnica","Foto del cabello actual","Prueba de porosidad","Prueba de elasticidad"],
   vt:"Diagnóstico de Corrección",vds:"Los pasos previos que determinan si la corrección es posible y cuántas sesiones requiere.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Identificar: qué colores hay actualmente en el cabello, cuántos procesos tiene y el daño estructural.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Test de elasticidad: tirar suavemente del mechón. Si se parte → no está listo para corrección.</span></div>
<div class="punto"><span class="punto-num">3</span><span>Test de porosidad: un mechón en agua. Si hunde rápido → alta porosidad → absorbe color irregular.</span></div>
<div class="alerta">⚠️ Un diagnóstico incompleto es la causa número 1 de correcciones fallidas.</div>`},

  {id:"cco_p04",n:"Corrección de Naranja — El Error Más Común",niv:"p",dur:"12 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Tinte ceniza (.1 o .11)","Peróxido 20v","Bowl","Pincel"],
   vt:"Neutralización del Naranja",vds:"Cómo eliminar el tono naranja que aparece al decolorar bases oscuras.",
   txt:`<div class="importante">📌 El naranja es el tono de escape más común al decolorar cabellos con eumelanina oscura.</div>
<div class="punto"><span class="punto-num">1</span><span>El naranja aparece porque la feomelanina roja-amarilla se revela antes de que la decoloración llegue al rubio.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Neutralizar con tinte ceniza (azul) en peróxido 20v. Tiempo: 20-30 min según intensidad del naranja.</span></div>
<div class="tip">✅ Si el naranja es muy intenso: sesión de decoloración adicional antes de tonificar.</div>`},

  {id:"cco_p05",n:"Corrección de Amarillo — Matización Básica",niv:"p",dur:"10 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Matizador violeta","Champú matizante","Peróxido 10v","Bowl"],
   vt:"Neutralización del Amarillo",vds:"Cómo eliminar el tono amarillo en cabellos rubios o decolorados.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>El amarillo aparece en cabellos muy claros o en rubios naturales desgastados por el sol.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Neutralizar con: matizador violeta directo o champú matizante 2-3 veces por semana.</span></div>
<div class="punto"><span class="punto-num">3</span><span>Para corrección más rápida: tinte violeta (reflejo .2) en peróxido 10v durante 10-15 min.</span></div>
<div class="tip">✅ El champú matizante violeta es el mantenimiento en casa más efectivo para cabellos rubios.</div>`},

  // ── INTERMEDIO ──
  {id:"cco_i01",n:"Decapado — Cuándo y Cómo Usarlo",niv:"i",dur:"20 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Decapante","Agua tibia","Champú neutro","Timer","Guantes"],
   vt:"Técnica de Decapado",vds:"El decapado que elimina pigmento artificial sin decolorar la base natural.",
   txt:`<div class="importante">📌 El decapado elimina el pigmento artificial del tinte pero NO aclara la melanina natural.</div>
<div class="punto"><span class="punto-num">1</span><span>Ideal cuando el tinte está demasiado oscuro o hay acumulación de pigmento de muchos tintes.</span></div>
<div class="punto"><span class="punto-num">2</span><span>El resultado del decapado es impredecible — siempre comunicarlo al cliente antes.</span></div>
<div class="punto"><span class="punto-num">3</span><span>Después del decapado: siempre tonificar inmediatamente para cerrar la cutícula.</span></div>
<div class="alerta">⚠️ El decapado puede repetirse máximo 2 veces en la misma sesión. Más = daño severo.</div>`},

  {id:"cco_i02",n:"Corrección de Verde — El Error del Colorista",niv:"i",dur:"18 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Tinte cobrizo (.4 o .44)","Peróxido 20v","Bowl","Timer"],
   vt:"Neutralización del Verde",vds:"Cómo corregir el tono verde que aparece tras cenizas mal aplicadas.",
   txt:`<div class="alerta">⚠️ El verde aparece cuando se aplica demasiado ceniza (azul) sobre una base que ya tenía pigmento azul/verde residual.</div>
<div class="punto"><span class="punto-num">1</span><span>Neutralizar con tinte cobrizo (.4) o dorado-cobrizo (.43) en peróxido 20v.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Si el verde es muy intenso: aplicar mezcla de tinte rojizo-cobrizo primero como base correctora.</span></div>
<div class="tip">✅ El verde es el tono más difícil de corregir. Requiere paciencia y puede necesitar 2-3 sesiones.</div>`},

  {id:"cco_i03",n:"Corrección Progresiva — Planificación por Sesiones",niv:"i",dur:"20 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Ficha técnica de corrección","Calendario de sesiones","Fotos de seguimiento"],
   vt:"Plan de Corrección Progresiva",vds:"Cómo planificar una corrección compleja en múltiples sesiones.",
   txt:`<div class="importante">📌 Las correcciones complejas son un proceso, no un evento. Planificar en papel antes de empezar.</div>
<div class="punto"><span class="punto-num">1</span><span><strong>Sesión 1:</strong> diagnóstico, decapado (si necesario) y primer paso de neutralización.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Sesión 2:</strong> 3-4 semanas después. Segundo paso de corrección con cabello recuperado.</span></div>
<div class="punto"><span class="punto-num">3</span><span><strong>Sesión 3+:</strong> Afinar y llegar al tono objetivo. Hidratación entre cada sesión.</span></div>
<div class="tip">✅ Documenta con fotos antes de cada sesión. Son la prueba del progreso ante el cliente.</div>`},

  {id:"cco_i04",n:"Corrección de Color con Exceso de Tinte Oscuro",niv:"i",dur:"18 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Decapante","Decolorante suave","Peróxido 10v","Bowl","Timer"],
   vt:"Corrección de Tinte Oscuro Acumulado",vds:"Qué hacer cuando el cabello se oscureció por exceso de retoque.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>El tinte oscuro acumulado por retoques repetidos crea un pigmento artificial muy difícil de eliminar.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Proceso: decapado → evaluación → segundo decapado si es necesario → tonificación.</span></div>
<div class="alerta">⚠️ Nunca usar decolorante fuerte directo sobre cabello con mucho tinte acumulado — puede romper la fibra.</div>`},

  {id:"cco_i05",n:"Fotografía de Corrección — Antes, Durante y Después",niv:"i",dur:"10 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Smartphone","Luz natural","Fondo neutro"],
   vt:"Documentación Visual de Correcciones",vds:"Cómo documentar cada fase de una corrección compleja.",
   txt:`<div class="importante">📌 Una corrección sin fotos documentadas es una corrección que no puedes defender ni reutilizar.</div>
<div class="punto"><span class="punto-num">1</span><span>Foto antes (siempre en luz natural, sin flash).</span></div>
<div class="punto"><span class="punto-num">2</span><span>Foto después de cada paso del proceso (post-decapado, post-tonificación).</span></div>
<div class="punto"><span class="punto-num">3</span><span>Foto final con el cliente satisfecho — es tu mejor contenido para redes.</span></div>
<div class="tip">✅ Las fotos de corrección bien documentadas son el contenido de mayor valor educativo para redes sociales.</div>`},

  // ── AVANZADO ──
  {id:"cco_a01",n:"Corrección de Color Fantasía — Casos Extremos",niv:"a",dur:"30 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Decapante especializado","Decolorante","Neutralizadores","Bowl × 3","Timer","Ficha técnica"],
   vt:"Corrección de Colores Fantasía",vds:"Cómo corregir rosado, azul, verde o rojo intenso de color fantasía.",
   txt:`<div class="importante">📌 Los colores fantasía (rosado, azul, verde) son los más difíciles de corregir porque penetran profundamente en la cutícula porosa.</div>
<div class="punto"><span class="punto-num">1</span><span>Proceso de corrección fantasía: baño de color neutro → evaluación → decapado → tonificación.</span></div>
<div class="punto"><span class="punto-num">2</span><span>El azul fantasía puede requerir 3-5 sesiones de decapado progresivo.</span></div>
<div class="alerta">⚠️ Cobrar por sesión. Nunca comprometerse con el resultado final en la primera sesión.</div>`},

  {id:"cco_a02",n:"Formulación Cromática para Corrección Compleja",niv:"a",dur:"25 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Tabla cromática completa","3-5 tintes","Bowl × 3","Báscula","Ficha técnica"],
   vt:"Formulación de Correctores Complejos",vds:"Cómo formular mezclas correctoras para casos que no tienen solución simple.",
   txt:`<div class="importante">📌 Los casos de corrección compleja requieren mezclas personalizadas que no existen en catálogo.</div>
<div class="punto"><span class="punto-num">1</span><span>Analizar los pigmentos presentes + los que necesitas neutralizar → formular el corrector exacto.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Ejemplo: corrector para cabello teñido de negro con base roja: decapante + tinte ceniza + pigmento azul directo.</span></div>
<div class="tip">✅ Documentar SIEMPRE las fórmulas de corrección exitosas — son conocimiento de valor exclusivo.</div>`},

  {id:"cco_a03",n:"Precio y Comunicación de Correcciones al Cliente",niv:"a",dur:"18 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Ficha de presupuesto","Contrato de servicio","Fotos de referencia"],
   vt:"Gestión Comercial de Correcciones",vds:"Cómo comunicar el precio y el proceso a un cliente que viene con problemas de color.",
   txt:`<div class="importante">📌 La corrección de color es el servicio más rentable SI se gestiona correctamente con el cliente.</div>
<div class="punto"><span class="punto-num">1</span><span>Siempre mostrar el diagnóstico antes de dar precio. Nunca cotizar sin ver el cabello real.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Hacer firmar un documento de expectativas claras: tiempo estimado, número de sesiones, resultado posible.</span></div>
<div class="tip">✅ Un cliente que entiende el proceso desde el principio nunca se queja del precio ni del resultado.</div>`}
],

// ════════════════════════════════════════════════════════
"✨ Matización": [
  // ── PRINCIPIANTE ──
  {id:"mat_p01",n:"Qué es el Matiz y Para Qué Sirve",niv:"p",dur:"8 min",
   img:"https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800",videoUrl:"",
   tools:["Matizador violeta","Matizador azul","Bowl pequeño"],
   vt:"Fundamentos de la Matización",vds:"Qué es el matiz y cómo transforma el resultado del color.",
   txt:`<div class="importante">📌 El matiz ajusta el reflejo del color sin modificar la base — es el retoque fino de la colorimetría.</div>
<div class="punto"><span class="punto-num">1</span><span>Se aplica en peróxido 10v para depositar pigmento sin aclarar nada.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Transforma un resultado aceptable en uno perfecto en 15-30 minutos.</span></div>
<div class="tip">✅ La matización es el último paso de todo proceso de colorimetría completo.</div>`},

  {id:"mat_p02",n:"Matizadores más Usados — Guía Práctica",niv:"p",dur:"10 min",
   img:"https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800",videoUrl:"",
   tools:["Matizador violeta","Matizador azul","Matizador beige","Peróxido 10v","Bowl"],
   vt:"Tabla de Matizadores",vds:"Los matizadores más usados y cuándo aplicar cada uno.",
   txt:`<div class="punto"><span class="punto-num">1</span><span><strong>Matizador violeta:</strong> neutraliza el amarillo en rubios. El más solicitado del mercado.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Matizador azul/ceniza:</strong> neutraliza el naranja en cabellos medios.</span></div>
<div class="punto"><span class="punto-num">3</span><span><strong>Matizador beige/arena:</strong> suaviza y calienta cabellos rubios muy fríos.</span></div>
<div class="punto"><span class="punto-num">4</span><span><strong>Matizador bronce/dorado:</strong> da calidez a cabellos ceniza que quedaron muy fríos.</span></div>`},

  {id:"mat_p03",n:"Proporción de Matizador en la Mezcla",niv:"p",dur:"8 min",
   img:"https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800",videoUrl:"",
   tools:["Matizador","Tinte base","Peróxido 10v","Bowl","Báscula"],
   vt:"Dosificación de Matizadores",vds:"Cuánto matizador usar según la intensidad de corrección deseada.",
   txt:`<div class="importante">📌 Los matizadores se usan en dosis pequeñas dentro de la mezcla — nunca en proporción igual al tinte base.</div>
<div class="punto"><span class="punto-num">1</span><span><strong>Matiz suave:</strong> 10-20% de matizador en la mezcla total.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Matiz medio:</strong> 30-40% de matizador.</span></div>
<div class="punto"><span class="punto-num">3</span><span><strong>Matiz intenso (tono puro):</strong> 100% matizador + peróxido 10v.</span></div>
<div class="alerta">⚠️ Exceso de matizador violeta en cabello muy claro puede dejarlo grisáceo o malva.</div>`},

  {id:"mat_p04",n:"Tiempo de Actuación del Matizador",niv:"p",dur:"6 min",
   img:"https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800",videoUrl:"",
   tools:["Timer","Matizador preparado"],
   vt:"Control de Tiempo de Matización",vds:"Cuánto tiempo dejar el matizador para cada resultado.",
   txt:`<div class="punto"><span class="punto-num">1</span><span><strong>Matiz suave (reflejo):</strong> 10-15 minutos.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Matiz medio (neutralización):</strong> 20-30 minutos.</span></div>
<div class="punto"><span class="punto-num">3</span><span><strong>Matiz intenso (corrección):</strong> 30-45 minutos. Revisar cada 10 min.</span></div>
<div class="tip">✅ El timer es obligatorio en la matización — la diferencia de 5 minutos puede cambiar el resultado.</div>`},

  {id:"mat_p05",n:"Matización en Casa — Instrucciones al Cliente",niv:"p",dur:"8 min",
   img:"https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800",videoUrl:"",
   tools:["Champú matizante","Mascarilla matizante","Ficha de instrucciones"],
   vt:"Matización en Casa",vds:"Cómo enseñar al cliente a mantener el tono en casa.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Champú matizante: usar 1-2 veces por semana. Dejar actuar 3-5 minutos antes de enjuagar.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Mascarilla matizante: una vez por semana, 10-20 minutos. Mayor hidratación + matización simultánea.</span></div>
<div class="tip">✅ El cliente que mantiene bien el tono en casa viene más frecuente al salón por servicios adicionales.</div>`},

  // ── INTERMEDIO ──
  {id:"mat_i01",n:"Matización Post-Balayage — Técnica Específica",niv:"i",dur:"18 min",
   img:"https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800",videoUrl:"",
   tools:["Matizador elegido","Peróxido 10v","Bowl","Pincel","Timer"],
   vt:"Matización de Balayage",vds:"Cómo elegir y aplicar el matiz perfecto después del balayage.",
   txt:`<div class="importante">📌 La matización post-balayage es lo que convierte un resultado ordinario en uno de lujo.</div>
<div class="punto"><span class="punto-num">1</span><span>Solo en las zonas aclaradas — no en toda la cabeza.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Pincel para mayor control: aplicar solo donde el color necesita ajuste.</span></div>
<div class="tip">✅ Ofrecer la matización como servicio incluido en el precio del balayage — justifica cobrar más.</div>`},

  {id:"mat_i02",n:"Matización Creativa — Tonos Modernos",niv:"i",dur:"20 min",
   img:"https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800",videoUrl:"",
   tools:["Matizadores en tonos modernos","Peróxido 10v","Bowl × 2","Pincel"],
   vt:"Matización de Tendencia",vds:"Cómo usar la matización para crear tonos modernos y de moda.",
   txt:`<div class="punto"><span class="punto-num">1</span><span><strong>Tono ceniza plateado:</strong> matizador violeta intenso + matizador azul en proporciones iguales.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Tono beige arenoso:</strong> matizador beige + base dorada suave.</span></div>
<div class="punto"><span class="punto-num">3</span><span><strong>Tono bronce rosado:</strong> matizador cobrizo + toque de matizador rosado.</span></div>
<div class="tip">✅ Los tonos modernos se consiguen mezclando matizadores — no comprando nuevos productos.</div>`},

  {id:"mat_i03",n:"Matización en Cabellos Oscuros",niv:"i",dur:"15 min",
   img:"https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800",videoUrl:"",
   tools:["Matizador especializado para oscuros","Peróxido 10v","Bowl","Timer"],
   vt:"Matización en Bases Oscuras",vds:"Cómo lograr reflejos visibles en cabellos oscuros sin decolorar.",
   txt:`<div class="importante">📌 En cabellos oscuros el matiz no puede aclarar — solo puede depositar un reflejo sobre el tono existente.</div>
<div class="punto"><span class="punto-num">1</span><span>Matizadores en reflejos caoba, rojizo o cobrizo son los más visibles en bases oscuras.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Tiempo de actuación mayor: 35-45 min para que el pigmento se fije en la cutícula densa.</span></div>
<div class="tip">✅ La matización en cabellos oscuros da vida y brillo sin necesidad de proceso de aclaración.</div>`},

  {id:"mat_i04",n:"Matización de Canas — Suavizar sin Cubrir",niv:"i",dur:"15 min",
   img:"https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800",videoUrl:"",
   tools:["Matizador dorado o beige","Peróxido 10v","Bowl","Timer"],
   vt:"Matización de Canas",vds:"Cómo matizar para integrar las canas sin cubrirlas completamente.",
   txt:`<div class="importante">📌 La matización de canas es una tendencia creciente: integrar en vez de esconder.</div>
<div class="punto"><span class="punto-num">1</span><span>Matizador dorado o beige sobre canas: las integra visualmente al color general.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Matizador violeta sobre canas: las transforma en un plateado elegante y moderno.</span></div>
<div class="tip">✅ El "granny look" o cabello plateado intencional es uno de los servicios más solicitados actualmente.</div>`},

  {id:"mat_i05",n:"Registro de Fórmulas de Matización",niv:"i",dur:"8 min",
   img:"https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800",videoUrl:"",
   tools:["Ficha técnica","Fotos del resultado","App de notas"],
   vt:"Documentación de Matices",vds:"Por qué registrar cada fórmula exitosa.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Anotar: producto usado, proporción, peróxido, tiempo y resultado obtenido.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Fotografiar el resultado siempre — la foto dice más que las palabras en la ficha.</span></div>
<div class="tip">✅ Una base de datos de fórmulas exitosas es el activo más valioso de un colorista profesional.</div>`},

  // ── AVANZADO ──
  {id:"mat_a01",n:"Sistema de Matización Personalizada por Cliente",niv:"a",dur:"25 min",
   img:"https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800",videoUrl:"",
   tools:["Kit completo de matizadores","Tabla de fórmulas","Ficha de cliente","Báscula de precisión"],
   vt:"Sistema de Matización Personalizada",vds:"Cómo crear una fórmula de matiz única para cada cliente.",
   txt:`<div class="importante">📌 El colorista avanzado tiene una fórmula de matiz específica para cada cliente — no usa la misma para todos.</div>
<div class="punto"><span class="punto-num">1</span><span>Evaluar tono de piel, color de ojos y preferencia de temperatura del color.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Crear una fórmula base + ajustes en cada visita según la evolución del cabello.</span></div>
<div class="tip">✅ El cliente con fórmula personalizada no puede ir a otro salón — nadie más tiene su fórmula.</div>`},

  {id:"mat_a02",n:"Matización como Servicio Expreso Rentable",niv:"a",dur:"18 min",
   img:"https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800",videoUrl:"",
   tools:["Matizador preparado","Timer","Tarjeta de servicio expreso"],
   vt:"Servicio Expreso de Matización",vds:"Cómo estructurar la matización como servicio rápido y rentable.",
   txt:`<div class="importante">📌 La matización express (30 min) puede ser un servicio independiente muy rentable.</div>
<div class="punto"><span class="punto-num">1</span><span>Servicio de 30 minutos: lavado + aplicación + enjuague + secado básico.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Precio sugerido: 25-40% del precio de un tinte completo.</span></div>
<div class="tip">✅ Ofrecer matización express entre citas de color fideliza y genera ingreso adicional sin aumentar el tiempo de trabajo.</div>`},

  {id:"mat_a03",n:"Matización y Fotografía — Contenido para Redes",niv:"a",dur:"15 min",
   img:"https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800",videoUrl:"",
   tools:["Ring light","Smartphone","Fondo neutro","Spray de brillo"],
   vt:"Fotografía de Resultados de Matización",vds:"Cómo capturar el brillo y el tono para redes sociales.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>La matización se fotografía con luz lateral para capturar el reflejo y la profundidad del tono.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Spray de brillo antes de fotografiar — amplifica el reflejo del matiz visualmente.</span></div>
<div class="tip">✅ Las fotos de matización bien tomadas generan más consultas de nuevos clientes que cualquier otro resultado.</div>`}
],

// ════════════════════════════════════════════════════════
"🧪 Mezclas": [
  // ── PRINCIPIANTE ──
  {id:"mez_p01",n:"Fundamentos de las Mezclas de Color",niv:"p",dur:"10 min",
   img:"https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800",videoUrl:"",
   tools:["Bowl","Báscula","Espátula","2 tintes","Peróxido"],
   vt:"Bases de las Mezclas Cromáticas",vds:"Por qué mezclamos tintes y qué principios rigen el resultado.",
   txt:`<div class="importante">📌 Mezclar tintes permite lograr tonos que no existen en ningún catálogo individual.</div>
<div class="punto"><span class="punto-num">1</span><span>Al mezclar dos tintes: el resultado es la combinación de los pigmentos de ambos.</span></div>
<div class="punto"><span class="punto-num">2</span><span>La proporción determina qué color domina en el resultado final.</span></div>
<div class="tip">✅ Practica siempre en un mechón antes de aplicar una mezcla nueva en el cliente.</div>`},

  {id:"mez_p02",n:"Proporción 1:1 — La Mezcla Más Usada",niv:"p",dur:"10 min",
   img:"https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800",videoUrl:"",
   tools:["Bowl","Báscula","2 tintes en misma cantidad","Peróxido"],
   vt:"Mezcla en Proporciones Iguales",vds:"Cuándo usar proporciones iguales y qué resultado produce.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>La mezcla 1:1 produce un resultado exactamente intermedio entre los dos tintes usados.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Ejemplo: 7.0 (rubio natural) + 7.1 (rubio ceniza) en 1:1 = rubio ligeramente ceniza.</span></div>
<div class="tip">✅ La mezcla 1:1 es el punto de inicio para cualquier ajuste de reflejo o temperatura del color.</div>`},

  {id:"mez_p03",n:"Mezcla para Cobertura de Canas — Fórmula Básica",niv:"p",dur:"12 min",
   img:"https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800",videoUrl:"",
   tools:["Tinte de cobertura","Tinte de color deseado","Peróxido 20v","Bowl","Báscula"],
   vt:"Mezcla para Canas",vds:"La fórmula de mezcla que garantiza cobertura de canas + tono deseado.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Fórmula básica: <strong>50% tinte de cobertura + 50% tinte del tono deseado</strong>.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Para más de 60% de canas: <strong>70% cobertura + 30% tono deseado</strong>.</span></div>
<div class="tip">✅ La base de cobertura refuerza el pigmento sin añadir un tono específico — funciona con cualquier tinte.</div>`},

  {id:"mez_p04",n:"Mezcla de Temperaturas — Frío y Cálido",niv:"p",dur:"10 min",
   img:"https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800",videoUrl:"",
   tools:["Tinte frío (ceniza)","Tinte cálido (dorado/cobrizo)","Bowl","Báscula"],
   vt:"Control de Temperatura del Color",vds:"Cómo equilibrar la temperatura del color con mezclas.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Tinte muy frío que queda grisáceo → añadir 10-20% de tinte dorado para calentar.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Tinte muy cálido que queda naranja → añadir 10-20% de tinte ceniza para enfriar.</span></div>
<div class="importante">📌 El equilibrio de temperatura del color es lo que hace que un resultado sea "natural" o "artificial".</div>`},

  {id:"mez_p05",n:"Registro de Mezclas — Cuaderno del Colorista",niv:"p",dur:"5 min",
   img:"https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800",videoUrl:"",
   tools:["Cuaderno de fórmulas","Bolígrafo","Fotos del resultado"],
   vt:"Documentación de Fórmulas",vds:"El hábito más importante del colorista profesional.",
   txt:`<div class="importante">📌 El cuaderno de fórmulas es el activo más valioso de un colorista. Sin él, cada mezcla nueva empieza de cero.</div>
<div class="punto"><span class="punto-num">1</span><span>Anotar siempre: marcas, referencias de color, proporciones exactas, tiempo y resultado.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Fotografiar el resultado con la ficha en la mano — vincula la fórmula con el resultado visual.</span></div>
<div class="tip">✅ Después de 2 años de registro: tienes un libro de fórmulas que vale más que cualquier curso.</div>`},

  // ── INTERMEDIO ──
  {id:"mez_i01",n:"Súper Mezclas — Sistema de 3 o Más Tintes",niv:"i",dur:"25 min",
   img:"https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800",videoUrl:"",
   tools:["3-4 tintes diferentes","Peróxido","Bowl grande","Báscula","Tabla cromática"],
   vt:"Formulación de Súper Mezclas",vds:"Sistema de mezclas maestras para casos cromáticos complejos.",
   txt:`<div class="importante">📌 La súper mezcla se usa cuando ningún tinte individual logra la neutralización o el tono requerido.</div>
<div class="punto"><span class="punto-num">1</span><span>Ejemplo para neutralizar rojos intensos: <em>7.1 + 8.1 + 9.1</em> en proporciones iguales.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Ejemplo para cenizas perfectas en base oscura: <em>5.1 + 6.11 + matizador azul</em>.</span></div>
<div class="alerta">⚠️ Una súper mezcla mal formulada puede resultar en colores indeseados. Siempre prueba de mechón.</div>`},

  {id:"mez_i02",n:"Mezcla de Tintes de Diferentes Marcas",niv:"i",dur:"15 min",
   img:"https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800",videoUrl:"",
   tools:["Tintes de 2 marcas diferentes","Bowl","Báscula","Peróxido de una marca"],
   vt:"Compatibilidad entre Marcas",vds:"Cuándo se puede y cuándo NO mezclar tintes de distintas marcas.",
   txt:`<div class="alerta">⚠️ Mezclar tintes de marcas diferentes puede generar resultados impredecibles. Hacerlo con conocimiento.</div>
<div class="punto"><span class="punto-num">1</span><span>Regla: si ambas marcas usan peróxido estándar (1.5-2% por tono), generalmente son compatibles.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Siempre usar el peróxido de una sola marca — no mezclar oxidantes de diferentes fabricantes.</span></div>
<div class="tip">✅ Prueba de mechón obligatoria al mezclar marcas por primera vez.</div>`},

  {id:"mez_i03",n:"Mezcla para Técnica de Pintura Global",niv:"i",dur:"18 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["2-3 tintes","Peróxido 20v","Bowl","Pincel de balayage"],
   vt:"Mezclas para Pintura Global",vds:"Cómo formular mezclas para técnicas de aplicación libre.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>La pintura global usa mezclas de consistencia más fluida — ligeramente más peróxido para mayor deslizamiento.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Para mayor difuminado: mezclar dos tintes de diferente profundidad (ej: 7.0 + 8.0) para gradación natural.</span></div>
<div class="tip">✅ La mezcla correcta es tan importante como la técnica de aplicación en cualquier resultado de pintura global.</div>`},

  {id:"mez_i04",n:"Ajuste de Mezcla según la Respuesta del Cabello",niv:"i",dur:"15 min",
   img:"https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800",videoUrl:"",
   tools:["Tintes de ajuste","Bowl","Báscula","Espátula"],
   vt:"Ajuste en Tiempo Real",vds:"Cómo modificar la fórmula durante el proceso si el resultado no es el esperado.",
   txt:`<div class="importante">📌 Un colorista avanzado ajusta la fórmula durante el proceso — no espera al resultado final.</div>
<div class="punto"><span class="punto-num">1</span><span>Si el cabello está agrandando demasiado el naranja: añadir más ceniza a la mezcla restante.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Si el resultado está quedando demasiado frío: añadir tinte dorado a la mezcla para calentar.</span></div>
<div class="tip">✅ Tener siempre preparado un "kit de ajuste" con tintes correctores a mano durante el proceso.</div>`},

  {id:"mez_i05",n:"Mezcla de Colorimetría Vegetal",niv:"i",dur:"20 min",
   img:"https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800",videoUrl:"",
   tools:["Henna","Índigo","Cúrcuma","Bowl","Agua tibia","Guantes de tela"],
   vt:"Colorimetría Vegetal",vds:"Mezclas de tintes vegetales para clientes que rechazan la química convencional.",
   txt:`<div class="importante">📌 La colorimetría vegetal es una alternativa real para clientes con sensibilidades o embarazadas (después del primer trimestre, consultar médico).</div>
<div class="punto"><span class="punto-num">1</span><span><strong>Henna pura:</strong> tonos rojizos sobre base clara. No mezclar con químicos.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Henna + índigo:</strong> tonos castaños o negros naturales.</span></div>
<div class="alerta">⚠️ Una vez aplicada henna, no se puede usar tinte químico sobre el cabello sin riesgo de reacción.</div>`},

  // ── AVANZADO ──
  {id:"mez_a01",n:"Sistema de Formulación Digital del Colorista",niv:"a",dur:"25 min",
   img:"https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800",videoUrl:"",
   tools:["App de formulación","Tablet o smartphone","Base de datos de fórmulas"],
   vt:"Digitalización de Fórmulas",vds:"Cómo crear un sistema digital de fórmulas propio.",
   txt:`<div class="importante">📌 El colorista avanzado tiene un sistema digital de fórmulas que puede consultar en cualquier momento.</div>
<div class="punto"><span class="punto-num">1</span><span>Estructura mínima: cliente + foto + fecha + fórmula completa + resultado + ajustes para próxima vez.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Herramientas: Google Sheets o Notion son suficientes. No necesitas una app especializada cara.</span></div>
<div class="tip">✅ Un sistema digital de fórmulas te permite atender a tus clientes aunque haya pasado un año entre visitas.</div>`},

  {id:"mez_a02",n:"Mezclas para Colores Especiales — Pastel y Neon",niv:"a",dur:"22 min",
   img:"https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800",videoUrl:"",
   tools:["Pigmentos directos","Condicionador blanco","Bowl","Báscula"],
   vt:"Mezclas de Colores Especiales",vds:"Formulación de colores pastel y neon con pigmentos directos.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Colores pastel: pigmento directo + condicionador blanco en proporción 1:4 a 1:8.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Colores neon: pigmento directo puro sobre base platino (nivel 10). Sin dilución.</span></div>
<div class="importante">📌 Los colores especiales requieren base platino (nivel 9-10) para que el pigmento sea fiel al color del catálogo.</div>`},

  {id:"mez_a03",n:"Enseñar Formulación — Workshop de Colorimetría",niv:"a",dur:"30 min",
   img:"https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800",videoUrl:"",
   tools:["Kit de tintes para workshop","Maniquíes","Báscula","Fichas de práctica"],
   vt:"Workshop de Formulación",vds:"Cómo estructurar y vender un workshop de mezclas y formulación.",
   txt:`<div class="importante">📌 Enseñar formulación a otros peluqueros es el servicio B2B más rentable del sector.</div>
<div class="punto"><span class="punto-num">1</span><span>Workshop de 4-6 horas: teoría cromática + práctica de mezclas + casos reales de corrección.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Grupos de máximo 8 personas para poder atender las dudas individuales.</span></div>
<div class="tip">✅ Un workshop de formulación bien estructurado puede generar el equivalente a 3-4 días de trabajo de salón en una sola jornada.</div>`}
],

// ════════════════════════════════════════════════════════
"💧 Cabello Graso": [
  // ── PRINCIPIANTE ──
  {id:"cgr_p01",n:"Qué es el Cabello Graso — Causas y Tipos",niv:"p",dur:"8 min",
   img:"https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",videoUrl:"",
   tools:["Ficha de cliente","Champú regulador"],
   vt:"Fundamentos del Cabello Graso",vds:"Por qué el cabello se vuelve graso y qué tipos existen.",
   txt:`<div class="importante">📌 El cabello graso es causado por la sobreproducción de sebo de las glándulas sebáceas del cuero cabelludo.</div>
<div class="punto"><span class="punto-num">1</span><span><strong>Causas:</strong> genética, hormonas, estrés, lavado excesivo (efecto rebote), productos inadecuados.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Tipos:</strong> graso en raíz con puntas secas (el más común), graso uniforme, graso con caspa.</span></div>
<div class="tip">✅ El cabello graso con puntas secas es el caso más difícil porque requiere dos tratamientos simultáneos.</div>`},

  {id:"cgr_p02",n:"Protocolo de Lavado para Cabello Graso",niv:"p",dur:"10 min",
   img:"https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",videoUrl:"",
   tools:["Champú regulador sebáceo","Enjuague mínimo","Agua fría final"],
   vt:"Lavado Correcto del Cabello Graso",vds:"El protocolo de lavado que regula sin agravar el problema.",
   txt:`<div class="importante">📌 El error más común en cabello graso: lavar demasiado seguido → efecto rebote → más grasa.</div>
<div class="punto"><span class="punto-num">1</span><span>Lavar máximo 3 veces por semana. El lavado diario estimula más producción de sebo.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Enjuague: solo <strong>1cc máximo en las puntas</strong>. Nunca en la raíz.</span></div>
<div class="punto"><span class="punto-num">3</span><span>Agua fría al final — cierra los poros del cuero cabelludo y reduce la producción de sebo.</span></div>
<div class="tip">✅ Una ampolla de vitamina E antes del secado neutraliza la grasa y da brillo sin añadir peso.</div>`},

  {id:"cgr_p03",n:"Productos Recomendados para Cabello Graso",niv:"p",dur:"8 min",
   img:"https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",videoUrl:"",
   tools:["Champú regulador","Tónico capilar","Spray de raíz"],
   vt:"Guía de Productos para Cabello Graso",vds:"Qué productos funcionan y cuáles empeoran el problema.",
   txt:`<div class="punto"><span class="punto-num">1</span><span><strong>Usar:</strong> champús sin silicona, reguladores sebáceos, tónicos de ortiga o té verde.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Evitar:</strong> mascarillas pesadas en la raíz, aceites en el cuero cabelludo, productos con silicona.</span></div>
<div class="tip">✅ El dry shampoo es el aliado del cliente con cabello graso para alargar entre lavados.</div>`},

  {id:"cgr_p04",n:"Colorimetría en Cabello Graso — Precauciones",niv:"p",dur:"10 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Champú clarificante","Decolorante o tinte","Timer"],
   vt:"Color en Cabello Graso",vds:"Cómo afecta la grasa al resultado de los procesos de color.",
   txt:`<div class="importante">📌 El sebo en exceso actúa como barrera que impide que el tinte o decolorante penetre uniformemente.</div>
<div class="punto"><span class="punto-num">1</span><span>Siempre lavar el cabello graso antes de colorimetría — aunque sea una sola lavada con champú clarificante.</span></div>
<div class="punto"><span class="punto-num">2</span><span>La grasa concentrada en la raíz puede hacer que la decoloración allí sea más lenta o irregular.</span></div>
<div class="alerta">⚠️ El cabello graso mal lavado + plancha = quema la cutícula aunque no se note inmediatamente.</div>`},

  {id:"cgr_p05",n:"Masajes de Cuero Cabelludo para Regular el Sebo",niv:"p",dur:"8 min",
   img:"https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",videoUrl:"",
   tools:["Aceite de árbol de té diluido","Yemas de los dedos"],
   vt:"Masaje Regulador",vds:"Cómo el masaje correcto puede regular la producción de sebo.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Masaje suave con yemas (no uñas) en movimientos circulares 2-3 minutos diarios.</span></div>
<div class="punto"><span class="punto-num">2</span><span>El masaje distribiye el sebo naturalmente y estimula la circulación sin sobreproducir.</span></div>
<div class="tip">✅ 1-2 gotas de aceite de árbol de té diluido en el masaje tiene efecto antibacteriano sobre el cuero cabelludo graso.</div>`},

  // ── INTERMEDIO ──
  {id:"cgr_i01",n:"Tratamientos Profesionales para Cabello Graso",niv:"i",dur:"18 min",
   img:"https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",videoUrl:"",
   tools:["Ampolla reguladora","Tónico de ortiga","Mascarilla arcilla (solo en raíz)","Gorro térmico"],
   vt:"Tratamientos Reguladores Profesionales",vds:"El protocolo completo de tratamiento en salón para cabello graso.",
   txt:`<div class="punto"><span class="punto-num">1</span><span><strong>Ampolla reguladora:</strong> aplicar solo en el cuero cabelludo. Dejar 20 min con calor suave.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Arcilla (kaolín):</strong> absorbe el exceso de sebo. Aplicar solo en raíz, 15 minutos máximo.</span></div>
<div class="punto"><span class="punto-num">3</span><span><strong>Tónico de ortiga:</strong> aplicar post-lavado sin enjuagar. Regula la producción sebácea a largo plazo.</span></div>
<div class="tip">✅ El tratamiento en salón se complementa con la rutina correcta en casa para resultados duraderos.</div>`},

  {id:"cgr_i02",n:"Dieta y Estilo de Vida — Factores Externos",niv:"i",dur:"12 min",
   img:"https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",videoUrl:"",
   tools:["Ficha de estilo de vida","Material informativo"],
   vt:"Factores Externos del Cabello Graso",vds:"Cómo la alimentación y los hábitos afectan la producción de sebo.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Alimentos que aumentan la grasa: azúcares refinados, grasas saturadas, lácteos en exceso.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Factores que agravan: estrés, calor excesivo, tocar el cabello constantemente.</span></div>
<div class="tip">✅ Comunicar estos factores al cliente es un diferencial de servicio que pocos peluqueros ofrecen.</div>`},

  {id:"cgr_i03",n:"Cabello Graso con Caspa — Doble Problema",niv:"i",dur:"18 min",
   img:"https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",videoUrl:"",
   tools:["Champú anticaspa regulador","Tónico antifúngico","Ficha de derivación"],
   vt:"Seborrea con Caspa",vds:"Tratamiento del cuero cabelludo con grasa Y caspa simultáneamente.",
   txt:`<div class="importante">📌 La caspa en cabello graso es a menudo de origen fúngico (seborrea). Requiere tratamiento específico.</div>
<div class="punto"><span class="punto-num">1</span><span>Champú con zinc o selenium sulfide para control antifúngico.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Si la caspa no mejora en 4 semanas: derivar obligatoriamente al dermatólogo.</span></div>
<div class="alerta">⚠️ La caspa con picazón intensa o enrojecimiento puede ser psoriasis — solo el médico puede diagnosticar.</div>`},

  {id:"cgr_i04",n:"Secado Profesional de Cabello Graso",niv:"i",dur:"12 min",
   img:"https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",videoUrl:"",
   tools:["Secador","Cepillo paleta","Ampolla de vitamina E","Voluminizador ligero"],
   vt:"Secado de Cabello Graso",vds:"Técnica de secado que prolonga la limpieza y el volumen.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Secar en frío o temperatura baja en la raíz — el calor excesivo activa las glándulas sebáceas.</span></div>
<div class="punto"><span class="punto-num">2</span><span>No usar cepillo redondo en la raíz — el calor concentrado en la raíz acelera la producción de sebo.</span></div>
<div class="tip">✅ Terminar con chorro de aire frío en toda la raíz — sella el cuero cabelludo y prolonga la limpieza.</div>`},

  {id:"cgr_i05",n:"Rutina de Casa para Cabello Graso — Guía Cliente",niv:"i",dur:"10 min",
   img:"https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",videoUrl:"",
   tools:["Guía impresa de rutina","Productos seleccionados"],
   vt:"Rutina Personalizada para Cabello Graso",vds:"La rutina de casa que Fátima recomienda para regular el sebo.",
   txt:`<div class="punto"><span class="punto-num">1</span><span><strong>Lunes/Miércoles/Sábado:</strong> lavado con champú regulador + enjuague mínimo en puntas.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Días sin lavado:</strong> dry shampoo en la raíz al despertar.</span></div>
<div class="punto"><span class="punto-num">3</span><span><strong>Una vez por semana:</strong> tónico de ortiga o romero en la raíz sin enjuagar.</span></div>
<div class="tip">✅ El cliente que sigue esta rutina ve resultados en 3-4 semanas. La constancia es clave.</div>`},

  // ── AVANZADO ──
  {id:"cgr_a01",n:"Diagnóstico de Cuero Cabelludo — Nivel Clínico",niv:"a",dur:"25 min",
   img:"https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",videoUrl:"",
   tools:["Lupa o dermatoscopio portátil","Ficha de diagnóstico","Ficha de derivación"],
   vt:"Análisis Clínico del Cuero Cabelludo",vds:"Cómo hacer un diagnóstico profesional del cuero cabelludo.",
   txt:`<div class="importante">📌 El diagnóstico avanzado del cuero cabelludo permite ofrecer un servicio que muy pocos peluqueros pueden dar.</div>
<div class="punto"><span class="punto-num">1</span><span>Con dermatoscopio portátil: evaluar el diámetro del folículo, presencia de inflamación y tipo de sebo.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Documentar con foto para seguimiento y para derivación al tricólogo o dermatólogo.</span></div>
<div class="tip">✅ Un servicio de análisis de cuero cabelludo con dermatoscopio puede cobrar 30-60€ independiente del servicio.</div>`},

  {id:"cgr_a02",n:"Tratamiento Intensivo de 4 Semanas para Cabello Graso",niv:"a",dur:"22 min",
   img:"https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",videoUrl:"",
   tools:["Kit de tratamiento regulador 4 semanas","Ficha de seguimiento","Fotos semanales"],
   vt:"Programa de Tratamiento Regulador",vds:"Cómo estructurar y vender un programa de 4 semanas.",
   txt:`<div class="importante">📌 Un programa de tratamiento de 4 semanas es un servicio premium con seguimiento que genera ingresos recurrentes.</div>
<div class="punto"><span class="punto-num">1</span><span>Semana 1-2: tratamiento intensivo de regulación en salón (2 visitas).</span></div>
<div class="punto"><span class="punto-num">2</span><span>Semana 3-4: mantenimiento con rutina de casa + check-in por WhatsApp.</span></div>
<div class="tip">✅ El programa de 4 semanas se vende como "tratamiento completo" — precio del programa vs visita individual.</div>`},

  {id:"cgr_a03",n:"Cabello Graso y Colorimetría — Protocolo Completo",niv:"a",dur:"20 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Champú clarificante","Tinte o decolorante","Timer","Ficha técnica"],
   vt:"Color en Cabello Graso — Nivel Avanzado",vds:"Protocolo completo para colorimetría en cueros cabelludos grasos.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Pre-lavado con champú clarificante 48h antes del servicio de color para eliminar la barrera de sebo.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Aplicar el tinte o decolorante en cabello limpio (día anterior al servicio si el cliente viene con pelo lavado ese día).</span></div>
<div class="tip">✅ El cabello graso sin lavar previo al color es el error más frecuente en peluquería generalista.</div>`}
],

// ════════════════════════════════════════════════════════
"🌵 Cabello Reseco": [
  // ── PRINCIPIANTE ──
  {id:"cre_p01",n:"Qué es el Cabello Reseco — Tipos y Causas",niv:"p",dur:"8 min",
   img:"https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800",videoUrl:"",
   tools:["Ficha de cliente","Muestra de cabello reseco"],
   vt:"Fundamentos del Cabello Reseco",vds:"Por qué el cabello pierde humedad y cómo identificar la causa real.",
   txt:`<div class="importante">📌 El cabello reseco es cabello que ha perdido su contenido de agua y lípidos naturales.</div>
<div class="punto"><span class="punto-num">1</span><span><strong>Causas externas:</strong> sol, mar, piscina, planchas sin protección, decoloración excesiva.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Causas internas:</strong> deshidratación, alimentación pobre en ácidos grasos, desequilibrio hormonal.</span></div>
<div class="punto"><span class="punto-num">3</span><span>Test simple: tira suavemente de un mechón. Si se parte sin estirarse → reseco severo.</span></div>
<div class="tip">✅ Identificar la causa real del reseco determina si el tratamiento es hidratación, nutrición o reconstrucción.</div>`},

  {id:"cre_p02",n:"Protocolo de Lavado para Cabello Reseco",niv:"p",dur:"10 min",
   img:"https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800",videoUrl:"",
   tools:["Champú hidratante","Enjuague completo","Mascarilla semanal","Agua tibia-fría"],
   vt:"Lavado Correcto del Cabello Reseco",vds:"El protocolo de lavado que nutre mientras limpia.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Usar enjuague completo — en cabello reseco no se restringe el acondicionador.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Dejar el enjuague actuar 2-3 minutos antes de retirar.</span></div>
<div class="punto"><span class="punto-num">3</span><span>Mascarilla hidratante una vez por semana como mínimo.</span></div>
<div class="alerta">⚠️ Cabello reseco + procesos químicos sin hidratación previa = riesgo de quiebre masivo.</div>`},

  {id:"cre_p03",n:"Hidratación Urgente para Cabello Muy Reseco",niv:"p",dur:"15 min",
   img:"https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800",videoUrl:"",
   tools:["Mascarilla de hidratación profunda","Gorro térmico","Aceite de argán","Ampolla"],
   vt:"Tratamiento de Emergencia",vds:"Qué hacer cuando el cabello está al límite de romperse.",
   txt:`<div class="importante">📌 Cuando el cabello está al borde del quiebre, la hidratación de emergencia es el primer paso ANTES de cualquier otro servicio.</div>
<div class="punto"><span class="punto-num">1</span><span>Mascarilla de hidratación profunda + aceite de argán + ampolla de vitamina E: mezclar y aplicar todo junto.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Gorro térmico durante 60 minutos mínimo.</span></div>
<div class="punto"><span class="punto-num">3</span><span>No realizar ningún proceso químico hasta que el cabello recupere su elasticidad.</span></div>
<div class="tip">✅ Un cabello sin elasticidad que se somete a proceso químico puede perder hasta el 30% de su longitud por rotura.</div>`},

  {id:"cre_p04",n:"Corte de Puntas en Cabello Reseco — Frecuencia",niv:"p",dur:"8 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Tijeras profesionales","Peine","Spray de agua"],
   vt:"Corte Terapéutico",vds:"Por qué el corte regular es el tratamiento más efectivo para el reseco.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Cabello muy reseco: corte de puntas cada 15-20 días para eliminar las puntas abiertas.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Cabello reseco en recuperación: corte cada 6 semanas para mantener las puntas sanas.</span></div>
<div class="tip">✅ El corte terapéutico frecuente + hidratación semanal es la combinación más efectiva para recuperar el cabello reseco.</div>`},

  {id:"cre_p05",n:"Protección Solar para el Cabello",niv:"p",dur:"6 min",
   img:"https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800",videoUrl:"",
   tools:["Spray protector solar capilar","Sombrero","Aceite con filtro UV"],
   vt:"Protección UV Capilar",vds:"Cómo proteger el cabello del sol para prevenir el reseco.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Spray capilar con factor de protección UV antes de la exposición solar.</span></div>
<div class="punto"><span class="punto-num">2</span><span>El sol UV es la causa más común de reseco en cabello con mechas o decoloración.</span></div>
<div class="tip">✅ Recomendar siempre protección solar capilar a clientes con cabellos aclarados — es venta de retail sin presión.</div>`},

  // ── INTERMEDIO ──
  {id:"cre_i01",n:"Reconstrucción Capilar — Protocolo Completo",niv:"i",dur:"25 min",
   img:"https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800",videoUrl:"",
   tools:["Tratamiento reconstructor","Ampolla proteica","Aceite sellador","Gorro térmico","Timer"],
   vt:"Reconstrucción Capilar Profesional",vds:"El protocolo completo de reconstrucción para cabello muy dañado.",
   txt:`<div class="importante">📌 La reconstrucción capilar es el tratamiento de mayor valor cuando el cabello está al límite del daño.</div>
<div class="punto"><span class="punto-num">1</span><span><strong>Paso 1 — Limpieza:</strong> champú clarificante para eliminar build-up.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Paso 2 — Reconstrucción:</strong> mascarilla reconstructora + ampolla proteica. 30-45 min con calor.</span></div>
<div class="punto"><span class="punto-num">3</span><span><strong>Paso 3 — Sellado:</strong> aceite sellador sobre el cabello húmedo antes de secar.</span></div>
<div class="tip">✅ La reconstrucción completa puede transformar un cabello que parecía sin remedio en 2-3 sesiones.</div>`},

  {id:"cre_i02",n:"Hidratación Natural Profunda — Catálogo Completo",niv:"i",dur:"20 min",
   img:"https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800",videoUrl:"",
   tools:["Aloe vera","Clara de huevo","Miel","Plátano","Aguacate","Aceites naturales","Gorro térmico"],
   vt:"Recetas Naturales para Cabello Reseco",vds:"Catálogo completo de hidrataciones 100% naturales validadas.",
   txt:`<div class="importante">📌 Estas fórmulas han sido validadas en 19 años de práctica real con resultados comprobados.</div>
<div class="punto"><span class="punto-num">1</span><span><strong>Reseco extremo:</strong> Aguacate + 2 claras de huevo + aceite de argán + Vitamina E. 60 min + gorro.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Reseco con frizz:</strong> Aloe vera + leche de coco + aceite de coco. 30 min + gorro.</span></div>
<div class="punto"><span class="punto-num">3</span><span><strong>Puntas muy abiertas:</strong> Miel pura + aceite de oliva tibia. Aplicar solo en puntas. 20 min.</span></div>
<div class="tip">✅ La miel tiene propiedades humectantes naturales que retienen la humedad en la fibra capilar.</div>`},

  {id:"cre_i03",n:"Cabello Reseco y Colorimetría — Compatibilidad",niv:"i",dur:"15 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Prueba de elasticidad","Hidratación previa","Ficha técnica"],
   vt:"Colorimetría en Cabello Reseco",vds:"Cuándo SÍ y cuándo NO aplicar color en cabello muy reseco.",
   txt:`<div class="alerta">🚨 Si el cabello no pasa la prueba de elasticidad: PROHIBIDO aplicar cualquier proceso químico.</div>
<div class="punto"><span class="punto-num">1</span><span>Test de elasticidad: estirar un mechón mojado. Debe estirarse y volver. Si se parte: no está listo.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Mínimo 2-4 semanas de hidratación intensa antes de cualquier proceso químico en cabello muy reseco.</span></div>
<div class="tip">✅ El cliente que entiende este requisito acepta esperar — es parte de la asesoría profesional.</div>`},

  {id:"cre_i04",n:"Aceite de Argán — Usos Profesionales",niv:"i",dur:"12 min",
   img:"https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800",videoUrl:"",
   tools:["Aceite de argán puro","Gotero","Toalla"],
   vt:"Usos Profesionales del Aceite de Argán",vds:"Todos los usos del aceite de argán en el salón y en casa.",
   txt:`<div class="punto"><span class="punto-num">1</span><span><strong>Pre-lavado:</strong> 3-5 gotas aplicadas 30 min antes del champú — hidratación profunda que el agua no elimina.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Post-lavado:</strong> 2-3 gotas en el largo húmedo antes de secar — anti-frizz y brillo.</span></div>
<div class="punto"><span class="punto-num">3</span><span><strong>Mascarilla:</strong> 1 cucharada mezclado con la mascarilla para potenciar la hidratación.</span></div>
<div class="tip">✅ El aceite de argán puro es la mejor inversión en retail que puedes recomendar al cliente con cabello reseco.</div>`},

  {id:"cre_i05",n:"Programa de Recuperación de 8 Semanas",niv:"i",dur:"15 min",
   img:"https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800",videoUrl:"",
   tools:["Calendario de tratamientos","Kit de recuperación","Ficha de seguimiento"],
   vt:"Programa de Recuperación Capilar",vds:"Cómo planificar 8 semanas de recuperación para cabello muy dañado.",
   txt:`<div class="punto"><span class="punto-num">1</span><span><strong>Semanas 1-2:</strong> hidratación profunda en salón × 2 + corte de puntas.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Semanas 3-4:</strong> reconstrucción proteica + rutina de casa supervisada.</span></div>
<div class="punto"><span class="punto-num">3</span><span><strong>Semanas 5-8:</strong> consolidación — tratamiento quincenal + evaluación de progreso.</span></div>
<div class="tip">✅ Un programa de 8 semanas vendido como paquete genera ingreso seguro y fideliza al cliente.</div>`},

  // ── AVANZADO ──
  {id:"cre_a01",n:"Tricología Básica — Estructura y Daño Capilar",niv:"a",dur:"25 min",
   img:"https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800",videoUrl:"",
   tools:["Manual de tricología básica","Diagrama de la fibra capilar","Lupa"],
   vt:"Fundamentos de Tricología",vds:"La ciencia de la fibra capilar aplicada al tratamiento del cabello reseco.",
   txt:`<div class="importante">📌 La tricología es la ciencia del cabello. Conocerla te permite entender POR QUÉ funciona cada tratamiento.</div>
<div class="punto"><span class="punto-num">1</span><span>La fibra capilar tiene 3 capas: cutícula (protección), corteza (color/fuerza) y médula (central).</span></div>
<div class="punto"><span class="punto-num">2</span><span>El daño por reseco comienza en la cutícula y avanza hacia la corteza si no se trata.</span></div>
<div class="tip">✅ Un peluquero con conocimiento de tricología básica tiene un argumento de autoridad que ningún generista puede igualar.</div>`},

  {id:"cre_a02",n:"Servicio de Spa Capilar — Experiencia Premium",niv:"a",dur:"30 min",
   img:"https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800",videoUrl:"",
   tools:["Kit de spa capilar completo","Aceites esenciales","Música relajante","Velas","Infusión para el cliente"],
   vt:"Spa Capilar como Servicio Premium",vds:"Cómo convertir el tratamiento de reseco en una experiencia de lujo.",
   txt:`<div class="importante">📌 El spa capilar no es solo un tratamiento — es una experiencia sensorial completa.</div>
<div class="punto"><span class="punto-num">1</span><span>Incluir: masaje capilar con aceites esenciales + mascarilla premium + aromaterapia + finalizador de brillo.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Tiempo: 90 minutos. Precio: 2-3 veces el precio de un tratamiento simple.</span></div>
<div class="tip">✅ El spa capilar es el servicio que más recomiendas clientes — la experiencia se convierte en historia que se cuenta.</div>`},

  {id:"cre_a03",n:"Seguimiento Digital del Tratamiento",niv:"a",dur:"15 min",
   img:"https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800",videoUrl:"",
   tools:["WhatsApp Business","Fotos del proceso","Ficha digital de seguimiento"],
   vt:"Seguimiento por WhatsApp",vds:"Cómo usar el seguimiento digital para fidelizar y generar referencias.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Check-in semanal por WhatsApp: foto del cabello en casa + pregunta de cómo va la rutina.</span></div>
<div class="punto"><span class="punto-num">2</span><span>El seguimiento demuestra compromiso real con el resultado — no solo con la venta del servicio.</span></div>
<div class="tip">✅ Un cliente con seguimiento activo referencia entre 3 y 5 personas nuevas en 6 meses.</div>`}
],

// ════════════════════════════════════════════════════════
"⚠️ Alertas Cliente": [
  // ── PRINCIPIANTE ──
  {id:"alc_p01",n:"Las 5 Alertas Absolutas del Peluquero",niv:"p",dur:"10 min",
   img:"https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800",videoUrl:"",
   tools:["Ficha de cliente","Formulario de alertas"],
   vt:"Alertas Absolutas del Salón",vds:"Las 5 situaciones en que el profesional debe detener el servicio.",
   txt:`<div class="alerta">🚨 ALERTA 1 — EMBARAZO: Ningún proceso químico. Sin excepciones.</div>
<div class="alerta">🚨 ALERTA 2 — REACCIÓN ALÉRGICA ACTIVA: Detener inmediatamente. Agua fría y llamar al 112 si hay hinchazón.</div>
<div class="alerta">🚨 ALERTA 3 — HERIDAS ABIERTAS EN CUERO CABELLUDO: No aplicar ningún producto hasta cicatrización.</div>
<div class="alerta">🚨 ALERTA 4 — CABELLO SIN ELASTICIDAD: No aplicar procesos químicos hasta recuperar la estructura.</div>
<div class="alerta">🚨 ALERTA 5 — INFECCIÓN ACTIVA (hongos, piojos): Atender con EPP completo. Derivar al médico.</div>`},

  {id:"alc_p02",n:"Contraindicaciones de Medicamentos",niv:"p",dur:"10 min",
   img:"https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800",videoUrl:"",
   tools:["Ficha de salud del cliente","Lista de medicamentos de riesgo"],
   vt:"Medicamentos y Colorimetría",vds:"Qué medicamentos pueden afectar el resultado del color o la queratina.",
   txt:`<div class="importante">📌 Algunos medicamentos alteran la química del cabello y pueden hacer que el tinte no tome o la queratina falle.</div>
<div class="punto"><span class="punto-num">1</span><span><strong>Quimioterapia:</strong> no realizar ningún proceso químico durante el tratamiento.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Isotretinoína (Roacután):</strong> el cuero cabelludo está extremadamente sensible — evitar decoloración.</span></div>
<div class="punto"><span class="punto-num">3</span><span><strong>Anticoagulantes:</strong> evitar masajes de presión fuerte que puedan irritar el cuero cabelludo.</span></div>
<div class="tip">✅ Siempre preguntar: "¿Estás tomando algún medicamento actualmente?" antes de cualquier proceso.</div>`},

  {id:"alc_p03",n:"Alergias Conocidas — Ficha Obligatoria",niv:"p",dur:"8 min",
   img:"https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800",videoUrl:"",
   tools:["Ficha de alergias","Lista de alérgenos comunes en colorimetría"],
   vt:"Registro de Alergias del Cliente",vds:"Cómo registrar y gestionar las alergias del cliente.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Alergenos más comunes en colorimetría: PPD (parafenilendiamina), persulfatos, resorcinol.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Si el cliente tiene alergia conocida a alguno: usar tintes sin PPD o productos sin persulfatos.</span></div>
<div class="alerta">⚠️ La alergia al PPD puede convertirse en anafilaxia en exposiciones repetidas. Tomar muy en serio.</div>`},

  {id:"alc_p04",n:"Cliente Menor de Edad — Protocolos Especiales",niv:"p",dur:"8 min",
   img:"https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800",videoUrl:"",
   tools:["Formulario de consentimiento parental","Ficha de cliente menor"],
   vt:"Atención a Menores de Edad",vds:"Qué servicios se pueden y no se pueden hacer a menores.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Menores de 14 años: no aplicar ningún proceso químico sin consentimiento escrito y firmado de los padres.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Menores de 16 años: presencia obligatoria de un adulto responsable durante el servicio.</span></div>
<div class="alerta">⚠️ La queratina con formol está contraindicada en menores de 16 años por sus vapores tóxicos.</div>`},

  {id:"alc_p05",n:"Cómo Comunicar una Negativa al Cliente",niv:"p",dur:"8 min",
   img:"https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800",videoUrl:"",
   tools:["Guía de comunicación asertiva","Alternativas al servicio"],
   vt:"Comunicación Asertiva de Límites",vds:"Cómo decir no a un servicio sin perder al cliente.",
   txt:`<div class="importante">📌 Saber comunicar una negativa profesional fideliza más que ceder y ofrecer un servicio que puede dañar.</div>
<div class="punto"><span class="punto-num">1</span><span>Frase que funciona: "En este momento, tu cabello no está en condiciones para ese proceso. Te propongo..."</span></div>
<div class="punto"><span class="punto-num">2</span><span>Siempre ofrecer una alternativa: "En su lugar puedo hacerte X, que le dará un resultado similar sin el riesgo."</span></div>
<div class="tip">✅ El cliente que recibe una negativa profesional bien explicada vuelve más comprometido con el profesional.</div>`},

  // ── INTERMEDIO ──
  {id:"alc_i01",n:"Documentación Legal de Servicios de Riesgo",niv:"i",dur:"15 min",
   img:"https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800",videoUrl:"",
   tools:["Contrato de servicio","Formulario de consentimiento","Carpeta de documentos"],
   vt:"Documentación Legal del Salón",vds:"Qué documentos te protegen legalmente ante reclamaciones.",
   txt:`<div class="importante">📌 La falta de documentación es el error legal más costoso de un peluquero profesional.</div>
<div class="punto"><span class="punto-num">1</span><span>Consentimiento informado firmado antes de: decoloración, queratina, corrección de color, alisado.</span></div>
<div class="punto"><span class="punto-num">2</span><span>El formulario debe incluir: descripción del servicio, riesgos posibles, alternativas y firma del cliente.</span></div>
<div class="tip">✅ Un solo reclamo legal justifica tener todos los formularios en orden desde el primer día.</div>`},

  {id:"alc_i02",n:"Gestión de Clientes Insatisfechos",niv:"i",dur:"15 min",
   img:"https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800",videoUrl:"",
   tools:["Protocolo de gestión de quejas","Ficha del servicio realizado"],
   vt:"Manejo de Reclamaciones",vds:"Cómo gestionar una queja de forma profesional que no destruya tu reputación.",
   txt:`<div class="importante">📌 La forma en que gestionas una queja determina si el cliente se va para siempre o se convierte en tu mayor promotor.</div>
<div class="punto"><span class="punto-num">1</span><span>Primero: escuchar sin interrumpir. Nunca ponerse a la defensiva.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Segundo: evaluar si el problema fue técnico (tu responsabilidad) o expectativas no alineadas.</span></div>
<div class="punto"><span class="punto-num">3</span><span>Tercero: proponer solución concreta. Nunca solo decir "lo sentimos".</span></div>
<div class="tip">✅ Ofrecer una corrección gratuita dentro de los 7 días siguientes es la solución estándar en el sector.</div>`},

  {id:"alc_i03",n:"Alertas de Caída del Cabello — Cuándo Derivar",niv:"i",dur:"12 min",
   img:"https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800",videoUrl:"",
   tools:["Ficha de derivación","Lista de tricólogos y dermatólogos de referencia"],
   vt:"Caída Capilar — Reconocimiento y Derivación",vds:"Cuándo la caída del cabello requiere atención médica especializada.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Caída normal: 50-100 cabellos diarios. Por encima de esto durante más de 4 semanas → derivar.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Señales de alarma: zonas de calvicie visibles, caída por mechones, cuero cabelludo inflamado.</span></div>
<div class="alerta">⚠️ La caída severa puede ser síntoma de: anemia, tiroides, alopecia areata u otras patologías. El peluquero no diagnostica — deriva.</div>`},

  {id:"alc_i04",n:"Reacciones Post-Servicio — Protocolo de Seguimiento",niv:"i",dur:"10 min",
   img:"https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800",videoUrl:"",
   tools:["Mensaje de seguimiento","WhatsApp del cliente"],
   vt:"Seguimiento Post-Servicio",vds:"Por qué el seguimiento 24-48h después es fundamental.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Mensaje 24h después de queratina, decoloración o corrección: "¿Cómo está el cabello? ¿Alguna molestia?"</span></div>
<div class="punto"><span class="punto-num">2</span><span>Si el cliente reporta picazón, ardor o irritación: cita inmediata sin costo para evaluación.</span></div>
<div class="tip">✅ El seguimiento post-servicio es la acción que más diferencia a un profesional de un comerciante.</div>`},

  {id:"alc_i05",n:"Alertas de Piojos — Protocolo de Actuación",niv:"i",dur:"10 min",
   img:"https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800",videoUrl:"",
   tools:["Guantes","Desinfectante potente","Protocolo de comunicación al cliente"],
   vt:"Piojos en el Salón",vds:"Cómo actuar profesionalmente al detectar piojos en un cliente.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Comunicar al cliente de forma discreta y privada, nunca delante de otros clientes.</span></div>
<div class="punto"><span class="punto-num">2</span><span>No realizar el servicio. Ofrecer reprogramar después del tratamiento.</span></div>
<div class="punto"><span class="punto-num">3</span><span>Desinfectar todos los utensilios y el área de trabajo inmediatamente.</span></div>
<div class="alerta">⚠️ Los piojos vivos sobreviven hasta 48h fuera del cuero cabelludo. Desinfección total es obligatoria.</div>`},

  // ── AVANZADO ──
  {id:"alc_a01",n:"Sistema de Gestión de Alertas del Salón",niv:"a",dur:"22 min",
   img:"https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800",videoUrl:"",
   tools:["Manual de protocolos","Ficha de alertas por cliente","Sistema de notas digitales"],
   vt:"Sistema de Alertas Profesional",vds:"Cómo crear un sistema de gestión de alertas que proteja al cliente y al profesional.",
   txt:`<div class="importante">📌 Un sistema de alertas bien implementado previene el 95% de los incidentes en el salón.</div>
<div class="punto"><span class="punto-num">1</span><span>Ficha de alertas por cliente: actualizada en cada visita con medicamentos, alergias, historial de reacciones.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Semáforo de riesgo: verde (sin restricciones), amarillo (precaución), rojo (requiere autorización médica).</span></div>
<div class="tip">✅ Un sistema de alertas bien comunicado es también un argumento de marketing: "nos preocupamos por tu salud".</div>`},

  {id:"alc_a02",n:"Responsabilidad Legal del Peluquero Profesional",niv:"a",dur:"20 min",
   img:"https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800",videoUrl:"",
   tools:["Información sobre seguros de responsabilidad civil","Contratos de servicio"],
   vt:"Marco Legal del Peluquero",vds:"Qué responsabilidades legales tiene el peluquero profesional.",
   txt:`<div class="importante">📌 El peluquero tiene responsabilidad civil ante los resultados de los servicios que ofrece.</div>
<div class="punto"><span class="punto-num">1</span><span>El seguro de responsabilidad civil profesional es obligatorio en España para cualquier actividad estética.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Ante un reclamo: la documentación (fichas, consentimientos, fotos) es tu única defensa.</span></div>
<div class="tip">✅ Invertir en documentación y protocolos correctos es más económico que un solo proceso judicial.</div>`},

  {id:"alc_a03",n:"Formación Continua en Seguridad — Obligación Profesional",niv:"a",dur:"15 min",
   img:"https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800",videoUrl:"",
   tools:["Calendario de formación","Cursos de seguridad","Certificados"],
   vt:"Actualización en Seguridad Profesional",vds:"Por qué la formación en seguridad es una obligación, no una opción.",
   txt:`<div class="importante">📌 Las normativas de seguridad en cosmética cambian regularmente. Mantenerse actualizado no es opcional para un profesional.</div>
<div class="punto"><span class="punto-num">1</span><span>Actualización anual mínima en: nuevos alérgenos regulados, cambios en normativa de formol, productos prohibidos.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Certificados de formación en seguridad: argumento de valor ante clientes y ante inspecciones.</span></div>
<div class="tip">✅ El profesional que se forma continuamente en seguridad es el que dura más tiempo en el mercado con su reputación intacta.</div>`}
],

// ════════════════════════════════════════════════════════
"⚠️ Alertas Peluquero": [
  // ── PRINCIPIANTE ──
  {id:"alp_p01",n:"Ética Profesional — Los 5 Principios Fundamentales",niv:"p",dur:"10 min",
   img:"https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800",videoUrl:"",
   tools:["Ficha de ética profesional"],
   vt:"Ética del Peluquero Profesional",vds:"Los 5 principios que definen a un peluquero con integridad.",
   txt:`<div class="importante">📌 La ética profesional es lo que te permite dormir tranquila después de cada jornada.</div>
<div class="punto"><span class="punto-num">1</span><span><strong>Honestidad:</strong> decir siempre qué se puede y qué no se puede hacer con el cabello del cliente.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Responsabilidad:</strong> asumir los errores y corregirlos sin excusas.</span></div>
<div class="punto"><span class="punto-num">3</span><span><strong>Confidencialidad:</strong> lo que el cliente comparte en la silla queda en la silla.</span></div>
<div class="punto"><span class="punto-num">4</span><span><strong>Actualización:</strong> mantenerse al día en técnicas y normativas.</span></div>
<div class="punto"><span class="punto-num">5</span><span><strong>Respeto:</strong> tratar a cada cliente como si fuera el único del día.</span></div>`},

  {id:"alp_p02",n:"Alertas de Salud del Peluquero",niv:"p",dur:"10 min",
   img:"https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800",videoUrl:"",
   tools:["Lista de síntomas de alerta","Información sobre enfermedades laborales"],
   vt:"Salud Ocupacional del Peluquero",vds:"Los riesgos de salud más comunes en la profesión y cómo prevenirlos.",
   txt:`<div class="punto"><span class="punto-num">1</span><span><strong>Problemas respiratorios:</strong> por vapores de decolorantes y queratinas. Prevención: mascarilla + ventilación.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Problemas de espalda:</strong> por postura al trabajar. Prevención: silla ergonómica + pausas activas.</span></div>
<div class="punto"><span class="punto-num">3</span><span><strong>Dermatitis en manos:</strong> por contacto químico repetido. Prevención: guantes + crema barrera.</span></div>
<div class="alerta">⚠️ Tu salud es tu herramienta de trabajo. Sin ella, no hay carrera profesional.</div>`},

  {id:"alp_p03",n:"Límites Profesionales con el Cliente",niv:"p",dur:"8 min",
   img:"https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800",videoUrl:"",
   tools:["Protocolo de límites profesionales"],
   vt:"Límites en la Relación Profesional",vds:"Cómo mantener una relación profesional sana con los clientes.",
   txt:`<div class="importante">📌 El peluquero es un profesional — no un psicólogo, ni un amigo íntimo, ni un confidente permanente.</div>
<div class="punto"><span class="punto-num">1</span><span>Es normal y deseable que el cliente se sienta cómodo hablando. Pero el profesional mantiene su rol.</span></div>
<div class="punto"><span class="punto-num">2</span><span>No compartas información personal excesiva ni te involucres emocionalmente en los problemas del cliente.</span></div>
<div class="tip">✅ Mantener los límites profesionales protege tu bienestar emocional y la relación a largo plazo.</div>`},

  {id:"alp_p04",n:"Error Técnico — Cómo Actuar",niv:"p",dur:"10 min",
   img:"https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800",videoUrl:"",
   tools:["Protocolo de gestión de errores","Formulario de incidente"],
   vt:"Gestión de Errores Técnicos",vds:"Qué hacer cuando algo no sale como esperabas.",
   txt:`<div class="importante">📌 Todo profesional comete errores. Lo que te define es cómo los gestionas.</div>
<div class="punto"><span class="punto-num">1</span><span>Reconocer el error inmediatamente — nunca esperar a que el cliente lo note.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Proponer una solución concreta antes de que el cliente la pida.</span></div>
<div class="punto"><span class="punto-num">3</span><span>Documentar el incidente en la ficha para prevenir repetición.</span></div>
<div class="tip">✅ El profesional que reconoce y soluciona sus errores gana más confianza que el que nunca los comete.</div>`},

  {id:"alp_p05",n:"Burnout en Peluquería — Señales y Prevención",niv:"p",dur:"8 min",
   img:"https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800",videoUrl:"",
   tools:["Test de burnout","Plan de autocuidado"],
   vt:"Prevención del Burnout",vds:"Las señales de agotamiento profesional y cómo prevenirlo.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Señales de burnout: irritabilidad con los clientes, falta de motivación, errores frecuentes.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Prevención: jornadas con límites claros, día libre real, formación que renueve la motivación.</span></div>
<div class="tip">✅ Una peluquera descansada y motivada da el 100% en cada cliente. Una agotada da el 60% y pierde clientes.</div>`},

  // ── INTERMEDIO ──
  {id:"alp_i01",n:"Responsabilidad Legal — Documentación Obligatoria",niv:"i",dur:"15 min",
   img:"https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800",videoUrl:"",
   tools:["Contrato de servicio","Fichas de consentimiento","Registro de incidentes"],
   vt:"Responsabilidad Legal del Profesional",vds:"Qué documentación te protege ante cualquier reclamación.",
   txt:`<div class="importante">📌 Un mal procedimiento de color puede tener consecuencias legales. La documentación es tu escudo.</div>
<div class="punto"><span class="punto-num">1</span><span>Documenta la prueba de mechón: fecha, resultado, firma del cliente.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Conserva las fichas de consentimiento durante mínimo 2 años.</span></div>
<div class="punto"><span class="punto-num">3</span><span>Fotografía el estado del cabello antes de cada proceso de riesgo.</span></div>
<div class="tip">✅ Tu reputación se construye con cada cliente bien atendido y cada protocolo respetado.</div>`},

  {id:"alp_i02",n:"Formación Continua — Por Qué es Obligatoria",niv:"i",dur:"12 min",
   img:"https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800",videoUrl:"",
   tools:["Calendario de formación","Lista de cursos y eventos del sector"],
   vt:"Actualización Profesional Continua",vds:"Por qué el peluquero que no se forma queda obsoleto en 3 años.",
   txt:`<div class="importante">📌 El sector de la peluquería evoluciona cada año. Sin formación continua, el profesional pierde relevancia.</div>
<div class="punto"><span class="punto-num">1</span><span>Mínimo 2 formaciones por año: una técnica (nueva técnica) y una de negocio (gestión, marketing).</span></div>
<div class="punto"><span class="punto-num">2</span><span>Seguir a referentes del sector en redes — la formación informal también cuenta.</span></div>
<div class="tip">✅ El profesional que se forma continuamente tiene argumentos de precio que el que no se forma no puede ofrecer.</div>`},

  {id:"alp_i03",n:"Gestión del Tiempo en el Salón",niv:"i",dur:"15 min",
   img:"https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800",videoUrl:"",
   tools:["Agenda","Sistema de citas online","Timer por servicio"],
   vt:"Optimización del Tiempo Profesional",vds:"Cómo gestionar la agenda para maximizar ingresos sin perder calidad.",
   txt:`<div class="importante">📌 El tiempo no gestionado bien es el mayor ladrón de ingresos del profesional autónomo.</div>
<div class="punto"><span class="punto-num">1</span><span>Tiempos estándar por servicio: tinte completo 90 min, mechas 120 min, corte 45 min, queratina 180 min.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Buffer de 15 min entre servicios complejos para limpiar, preparar y evitar retrasos en cascada.</span></div>
<div class="tip">✅ Una agenda bien estructurada puede incrementar los ingresos un 30% sin atender más clientes.</div>`},

  {id:"alp_i04",n:"Precios — Cómo Calcular Tu Valor Real",niv:"i",dur:"18 min",
   img:"https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800",videoUrl:"",
   tools:["Calculadora de costos","Lista de gastos fijos","Tabla de precios"],
   vt:"Cálculo de Precios Profesionales",vds:"Cómo calcular el precio real de cada servicio para no perder dinero.",
   txt:`<div class="importante">📌 El peluquero que no calcula sus costos reales trabaja gratis o con pérdida sin saberlo.</div>
<div class="punto"><span class="punto-num">1</span><span>Precio = coste de materiales + coste de tiempo (hora de trabajo) + margen de beneficio (mínimo 40%).</span></div>
<div class="punto"><span class="punto-num">2</span><span>Revisar precios mínimo 2 veces al año — los costes de materiales suben constantemente.</span></div>
<div class="tip">✅ Subir el precio 10% con la comunicación correcta no pierde clientes — los fideliza mejor.</div>`},

  {id:"alp_i05",n:"Redes Sociales — Estrategia sin Agotarse",niv:"i",dur:"15 min",
   img:"https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800",videoUrl:"",
   tools:["Smartphone","App de planificación de contenido","Ring light","Fondo neutro"],
   vt:"Estrategia de Redes para Peluquería",vds:"Cómo gestionar las redes sociales sin que consuman todo tu tiempo.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Frecuencia mínima efectiva: 3-4 publicaciones por semana. Más no siempre es mejor.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Contenido que más funciona en peluquería: antes/después, proceso de trabajo, consejos cortos.</span></div>
<div class="tip">✅ Planificar el contenido de la semana en 30 minutos los lunes es más efectivo que improvisar todos los días.</div>`},

  // ── AVANZADO ──
  {id:"alp_a01",n:"Marca Personal — Construir Autoridad en el Sector",niv:"a",dur:"30 min",
   img:"https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800",videoUrl:"",
   tools:["Ficha de marca personal","Portfolio digital","Bio profesional"],
   vt:"Construcción de Marca Personal",vds:"Cómo posicionarte como referente en el sector de la peluquería.",
   txt:`<div class="importante">📌 La marca personal es lo que la gente dice de ti cuando no estás presente — es tu mayor activo a largo plazo.</div>
<div class="punto"><span class="punto-num">1</span><span>Define tu especialidad: colorimetría, rizos, morfología, tratamientos... El generalista compite en precio. El especialista, en valor.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Portfolio digital con tus mejores trabajos: 20-30 fotos de alta calidad son más que suficientes.</span></div>
<div class="tip">✅ Una marca personal bien construida atrae clientes que vienen buscando exactamente lo que ofreces.</div>`},

  {id:"alp_a02",n:"Modelo de Negocio — Ingresos Múltiples",niv:"a",dur:"25 min",
   img:"https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800",videoUrl:"",
   tools:["Mapa de ingresos","Calculadora de modelo de negocio"],
   vt:"Diversificación de Ingresos",vds:"Cómo generar ingresos más allá del servicio directo al cliente.",
   txt:`<div class="importante">📌 El peluquero avanzado tiene múltiples fuentes de ingreso — no depende solo de las horas de silla.</div>
<div class="punto"><span class="punto-num">1</span><span><strong>Servicio directo:</strong> el núcleo. Maximizar por precio, no por volumen.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Retail:</strong> venta de productos de mantenimiento — 20-30% de ingreso adicional sin tiempo extra.</span></div>
<div class="punto"><span class="punto-num">3</span><span><strong>Formación:</strong> workshops, cursos online, academia digital.</span></div>
<div class="punto"><span class="punto-num">4</span><span><strong>Contenido digital:</strong> colaboraciones, afiliaciones, consultoría online.</span></div>
<div class="tip">✅ Un modelo de negocio con 3-4 fuentes de ingreso es 10 veces más estable que uno con una sola fuente.</div>`},

  {id:"alp_a03",n:"Academia Digital — Monetizar el Conocimiento",niv:"a",dur:"30 min",
   img:"https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800",videoUrl:"",
   tools:["Plataforma de cursos online","Cámara","Micrófono","Guión del curso"],
   vt:"Creación de Academia Digital",vds:"Cómo transformar tu conocimiento de 19 años en un activo digital.",
   txt:`<div class="importante">📌 El conocimiento de 19 años de práctica real tiene un valor enorme que puede escalar sin límite de tiempo ni de geografía.</div>
<div class="punto"><span class="punto-num">1</span><span>Un curso online bien estructurado se vende repetidamente sin trabajo adicional.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Estructura mínima viable: 5-8 módulos, videos de 5-15 minutos, materiales descargables.</span></div>
<div class="punto"><span class="punto-num">3</span><span>La academia digital de Fátima ya es una realidad — este sistema es la base de ese conocimiento.</span></div>
<div class="tip">✅ El ingreso pasivo de una academia digital es el objetivo final: trabajar una vez, cobrar siempre.</div>`}
]

}; // Fin CONOCIMIENTO_P3

// ── FUSIÓN FINAL CON CONOCIMIENTO PRINCIPAL ──────────────────
(function fusionarP3 () {
  const intentar = () => {
    if (typeof window.CONOCIMIENTO === 'undefined') {
      setTimeout(intentar, 150);
      return;
    }
    Object.entries(window.CONOCIMIENTO_P3).forEach(([cat, clases]) => {
      if (!window.CONOCIMIENTO[cat]) {
        window.CONOCIMIENTO[cat] = clases;
      } else {
        const ids = new Set(window.CONOCIMIENTO[cat].map(c => c.id));
        clases.forEach(c => {
          if (!ids.has(c.id)) window.CONOCIMIENTO[cat].push(c);
        });
      }
    });
    // Reconstruir FLAT global con todas las clases fusionadas
    if (typeof window.FLAT !== 'undefined' && typeof window.CONOCIMIENTO !== 'undefined') {
      window.FLAT = [];
      Object.entries(window.CONOCIMIENTO).forEach(([cat, arr]) => {
        arr.forEach(c => window.FLAT.push({ ...c, cat }));
      });
      // Actualizar contador total si existe
      if (typeof window.TOTAL !== 'undefined') {
        window.TOTAL = window.FLAT.length;
      }
    }
    console.log('[Motor Fátima P3] Fusión FINAL completada ✅');
    console.log('[Motor Fátima] Total clases en sistema:', window.FLAT ? window.FLAT.length : 'calcular manualmente');
  };
  intentar();
})();

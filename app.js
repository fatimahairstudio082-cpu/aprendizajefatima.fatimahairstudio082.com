// ============================================================
//  app.js — Academia Fátima Caldera
//  Lógica completa: datos, menú, inyector, audio, PDF, galería
// ============================================================

window.CONOCIMIENTO = {
"🛡️ Bioseguridad":[
  {id:"bio_01",n:"Protocolo Principal del Peluquero",niv:"p",dur:"12 min",
   img:"https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
   videoUrl:"",tools:["Guantes","Alcohol 70%","Cubo desinfectante"],
   vt:"Protocolo de Bioseguridad",vds:"Protocolo real de 19 años de experiencia en peluquería profesional.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Antes de cualquier procedimiento, <strong>olfatea y revisa visualmente la cutícula</strong> del cabello basándote en sus características.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Identifica presencia de hongos, seborrea o alteraciones. Los hongos provienen de <em>cepillos no desinfectados</em> en otras peluquerías.</span></div>
<div class="punto"><span class="punto-num">3</span><span>Nunca rechaces al cliente. <strong>Atiéndelo con normalidad y profesionalismo</strong>, usando guantes desde el inicio.</span></div>
<div class="alerta">⚠️ En personas <strong>embarazadas</strong>: PROHIBIDO absolutamente cualquier proceso químico — tinte, decoloración, queratina.</div>
<div class="importante">📌 Mantén siempre un cubo con <strong>vinagre, limón, jabón y cloro</strong> para desinfectar utensilios después de cada cliente especial.</div>`},
  {id:"bio_02",n:"Desinfección de Herramientas",niv:"p",dur:"8 min",
   img:"https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=800&q=80",
   videoUrl:"",tools:["Vinagre","Limón","Cloro","Alcohol","Secador"],
   vt:"Esterilización Profesional",vds:"Desinfección con soluciones naturales validadas en práctica real.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Sumerge <em>peine, cepillo y tijeras</em> en vinagre + limón durante mínimo <strong>45 minutos</strong> de remojo.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Frota con limón, añade agua, finaliza rociando con alcohol. Seca con paño tibio.</span></div>
<div class="punto"><span class="punto-num">3</span><span>Usa el <strong>secador a máxima potencia</strong> para secar todas las herramientas después del remojo.</span></div>
<div class="tip">✅ Solución efectiva: <strong>Jabón azul (Llaves) + vinagre de manzana + clavo de olor</strong>. Aplica 15-20 min durante 10 días para hongos capilares.</div>`},
  {id:"bio_03",n:"Prueba de Mechón Obligatoria",niv:"p",dur:"10 min",
   img:"https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
   videoUrl:"",tools:["Mechón de prueba","Producto a aplicar","Agua","Champú"],
   vt:"Test Alérgico y de Resistencia",vds:"Validación capilar previa a cualquier proceso químico.",
   txt:`<div class="importante">📌 La prueba de mechón es <strong>OBLIGATORIA</strong> antes de todo procedimiento químico.</div>
<div class="punto"><span class="punto-num">1</span><span>Toma un mechón pequeño y aplica el producto que vas a usar (<em>decolorante, tinte, queratina</em>).</span></div>
<div class="punto"><span class="punto-num">2</span><span>Evalúa la <strong>pigmentación, resistencia y tonalidad</strong> que agarra antes de proceder.</span></div>
<div class="punto"><span class="punto-num">3</span><span>Si hay <em>enrojecimiento, ardor, picazón o reacción alérgica</em>: retira inmediatamente con agua y champú.</span></div>
<div class="alerta">⚠️ Incluso productos naturales pueden causar reacciones. <strong>Siempre haz la prueba primero.</strong></div>`},
  {id:"bio_04",n:"Uso de EPP y Guantes",niv:"p",dur:"6 min",
   img:"https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
   videoUrl:"",tools:["Guantes nitrilo","Mascarilla","Alcohol"],
   vt:"Equipo de Protección Personal",vds:"Estándares mínimos de seguridad en el salón profesional.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Siempre usa <strong>guantes de nitrilo o látex</strong> al aplicar cualquier producto químico.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Los hongos capilares pueden penetrar por las uñas. El uso de guantes es <em>protección básica</em>.</span></div>
<div class="tip">✅ Mantén en tu estación: <strong>Alcohol 70%, guantes desechables, mascarilla</strong>.</div>`},
  {id:"bio_05",n:"Control de Hongos Capilares",niv:"i",dur:"15 min",
   img:"https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80",
   videoUrl:"",tools:["Jabón azul","Vinagre de manzana","Clavo de olor","Limón"],
   vt:"Tratamiento Antifúngico Natural",vds:"Soluciones naturales validadas en 19 años de práctica real.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Identifica hongos por: <em>olor particular, aspecto escamoso del cuero cabelludo, seborrea visible.</em></span></div>
<div class="punto"><span class="punto-num">2</span><span>Remedio validado: <strong>Jabón azul + vinagre de limón (1cc) + jabón</strong>. Frotar y dejar 15-20 min, repetir 10 días.</span></div>
<div class="alerta">⚠️ Siempre deriva al <strong>dermatólogo</strong>. Estas son medidas complementarias naturales.</div>`}
],
"✂️ Herramientas":[
  {id:"her_01",n:"Peine de Aguja — Técnica de Zigzag",niv:"p",dur:"10 min",
   img:"https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80",
   videoUrl:"",tools:["Peine de aguja","Peine cola"],
   vt:"Peine de Aguja",vds:"Herramienta base para divisiones en zigzag.",
   txt:`<div class="importante">📌 El <strong>peine de aguja</strong> es el instrumento fundamental para dividir el cabello con precisión milimétrica.</div>
<div class="punto"><span class="punto-num">1</span><span>Técnica de división en <em>zigzag</em> que permite separar mechones con exactitud.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Separación ideal por capa: <strong>1 cm (un dedo)</strong> — asegura mechas uniformes.</span></div>
<div class="tip">✅ Dominar el peine de aguja = dominar la <strong>base de todas las técnicas de colorimetría</strong>.</div>`},
  {id:"her_02",n:"Planchas: Temperaturas por Tipo de Cabello",niv:"i",dur:"12 min",
   img:"https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=800&q=80",
   videoUrl:"",tools:["Plancha BaByliss","Plancha Remington","Termómetro"],
   vt:"Control Térmico de Planchas",vds:"Temperatura óptima según tipo capilar.",
   txt:`<div class="punto"><span class="punto-num">1</span><span><strong>Cabello fino:</strong> 180°C / 180-250°F (Remington) / 330°F (BaByliss)</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Cabello grueso:</strong> hasta 230°C, nunca superar límites del fabricante.</span></div>
<div class="alerta">⚠️ El cabello graso <em>mal lavado</em> quema las cutículas invisiblemente al planchar.</div>`},
  {id:"her_03",n:"Papel de Aluminio vs Plantillas",niv:"i",dur:"10 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
   videoUrl:"",tools:["Papel de aluminio","Plantillas","Balde","Toallas"],
   vt:"Materiales de Aplicación",vds:"Diferencias técnicas entre aluminio, plantillas y papel especial.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Tanto el papel de aluminio como las plantillas <strong>absorben el peróxido y el polvo decolorante</strong>.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Por esta absorción, el producto pierde consistencia. <strong>Prepara mezcla nueva cada 15 minutos</strong>.</span></div>
<div class="tip">✅ Usa un balde de agua a mano para limpiar exceso de producto entre aplicaciones.</div>`}
],
"📐 Divisiones":[
  {id:"div_01",n:"División por Volumen Capilar",niv:"p",dur:"15 min",
   img:"https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80",
   videoUrl:"",tools:["Peineta","Pinzas","Báscula 100g"],
   vt:"Matemática del Volumen Capilar",vds:"Cálculo de producto según gramos de cabello.",
   txt:`<div class="importante">📌 La división del cabello es el <strong>PASO PRINCIPAL</strong> de toda colorimetría.</div>
<div class="punto"><span class="punto-num">1</span><span><strong>Identifica el volumen:</strong> <em>100g / 200g / 300g / 400g / 600g</em> de cabello.</span></div>
<div class="punto"><span class="punto-num">2</span><span>El volumen determina la cantidad de producto y el <em>número de sesiones</em> necesarias.</span></div>
<div class="tip">✅ 100g → <strong>60g polvo decolorante + 200ml peróxido 30v</strong> para mechas.</div>`},
  {id:"div_02",n:"División Horizontal y Vertical",niv:"p",dur:"12 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
   videoUrl:"",tools:["Peine de aguja","Pinzas mariposa","Peineta"],
   vt:"Mapa de Divisiones Capilares",vds:"Geometría de la división horizontal, vertical y diagonal.",
   txt:`<div class="punto"><span class="punto-num">1</span><span><strong>Parte de atrás:</strong> Divide horizontalmente en cuadrado, dejando <em>1 cm (un dedo)</em> por capa.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Laterales:</strong> Divide de oreja a oreja, luego en diagonal. <em>6-8 sesiones</em> por lado.</span></div>
<div class="importante">📌 Aplica el producto de <strong>arriba hacia abajo sin tocar la raíz</strong>.</div>`},
  {id:"div_03",n:"Pulgadas del Cabello — Medidas",niv:"p",dur:"8 min",
   img:"https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80",
   videoUrl:"",tools:["Regla de pulgadas","Cinta métrica"],
   vt:"Tabla de Pulgadas Capilares",vds:"Referencia de medidas para cálculo de producto.",
   txt:`<div class="punto"><span class="punto-num">1</span><span><strong>10 pulgadas:</strong> Antes de los hombros</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>12 pulgadas:</strong> Casi en los hombros</span></div>
<div class="punto"><span class="punto-num">3</span><span><strong>15 pulgadas:</strong> Más abajo de los hombros</span></div>
<div class="punto"><span class="punto-num">4</span><span><strong>30 pulgadas:</strong> Cerca de la cintura / glúteo</span></div>`}
],
"💧 Lavado":[
  {id:"lav_01",n:"Técnica Correcta de Lavado",niv:"p",dur:"12 min",
   img:"https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
   videoUrl:"",tools:["Champú profesional","Enjuague","Jeringa 1cc"],
   vt:"Protocolo de Lavado Capilar",vds:"Técnica profesional de lavado según tipo de cabello.",
   txt:`<div class="importante">📌 Un <strong>buen lavado</strong> es la base de todo procedimiento capilar.</div>
<div class="punto"><span class="punto-num">1</span><span>Nunca lavar con las <strong>yemas de uñas</strong> — siempre con la yema de los dedos.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Frotar bien en la raíz, luego restregar hacia abajo. <strong>Repetir hasta espuma abundante.</strong></span></div>
<div class="tip">✅ Para enjuague en cabello graso: solo <strong>0.5cc a 1cc en las puntas</strong>.</div>`},
  {id:"lav_02",n:"Lavado Pre-Queratina",niv:"i",dur:"15 min",
   img:"https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=800&q=80",
   videoUrl:"",tools:["Champú sin sal","Agua tibia","Toalla seca"],
   vt:"Preparación Capilar para Queratina",vds:"Protocolo de apertura de cutícula para tratamientos térmicos.",
   txt:`<div class="importante">📌 Para aplicar queratina es <strong>MANDATORIO</strong> abrir completamente la cutícula.</div>
<div class="punto"><span class="punto-num">1</span><span>Usar <strong>champú sin sal</strong> con agua tibia para abrir la cutícula.</span></div>
<div class="punto"><span class="punto-num">2</span><span>En cabello muy graso: realizar <strong>hasta 10 lavadas intensivas</strong>.</span></div>
<div class="alerta">⚠️ El acondicionador <strong>cierra la cutícula</strong>. Nunca en esta fase.</div>`}
],
"🎨 Tinte":[
  {id:"tin_01",n:"Base de Cabello y Melanina",niv:"i",dur:"18 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
   videoUrl:"",tools:["Tabla de colores","Bowl","Medidor","Peróxido"],
   vt:"Tabla Cromática Profesional",vds:"Fórmulas de neutralización según melanina y base capilar.",
   txt:`<div class="importante">📌 Antes de aplicar cualquier tinte, <strong>ESTUDIA la característica del cabello</strong>.</div>
<div class="punto"><span class="punto-num">1</span><span>Identificar la <strong>base natural del cabello</strong> para obtener el tono natural.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Para neutralizar: ir a la <strong>tabla de colores cromática</strong> y preparar la fórmula correcta.</span></div>
<div class="alerta">⚠️ Si no sabes cómo neutralizar un tono, puedes <strong>dejar manchado el cabello</strong> del cliente.</div>`},
  {id:"tin_02",n:"Porcentaje de Canas y Cobertura",niv:"i",dur:"14 min",
   img:"https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80",
   videoUrl:"",tools:["Tinte de cobertura","Peróxido 20v","Bowl","Pincel"],
   vt:"Cobertura de Canas",vds:"Estrategias de cobertura según porcentaje y distribución.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Evalúa el <strong>porcentaje de canas</strong> antes de elegir la fórmula.</span></div>
<div class="tip">✅ Para alta cobertura: <strong>combina tintes con base de cobertura + fórmula de neutralización</strong>.</div>`}
],
"🌟 Mechas":[
  {id:"mec_01",n:"Mechas con Papel de Aluminio",niv:"i",dur:"25 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
   videoUrl:"",tools:["Papel aluminio","Polvo decolorante","Peróxido 30v","Peine aguja","Pincel","Balde"],
   vt:"Mechas Profesionales con Aluminio",vds:"Técnica completa de mechas con cálculo de producto por volumen.",
   txt:`<div class="importante">📌 El paso principal es la <strong>DIVISIÓN</strong>. Sin buena división, las mechas no quedan bien.</div>
<div class="punto"><span class="punto-num">1</span><span><strong>Identifica el volumen</strong>: 100g, 200g, 300g, 400g o 600g.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Zigzag con peine de aguja. Coloca aluminio y desliza producto <strong>de arriba hacia abajo sin tocar raíz</strong>.</span></div>
<div class="tip">✅ 100g de cabello = <strong>60g polvo decolorante + 200ml peróxido 30 volúmenes</strong>.</div>
<div class="alerta">⚠️ Prueba de mechón <strong>OBLIGATORIA</strong>. Embarazadas: prohibido.</div>`},
  {id:"mec_02",n:"Cálculo de Producto por Volumen",niv:"i",dur:"15 min",
   img:"https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=800&q=80",
   videoUrl:"",tools:["Báscula","Polvo decolorante","Peróxido","Bowl medidor"],
   vt:"Calculadora de Producto",vds:"Fórmula matemática para cálculo exacto.",
   txt:`<div class="punto"><span class="punto-num">1</span><span><strong>100g de cabello (mechas aluminio):</strong> 60g polvo decolorante + 200ml peróxido 30v</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Balayage y mechas:</strong> <em>40-50g polvo + 100ml peróxido</em> por cada 100g de cabello</span></div>`}
],
"🌊 Balayage":[
  {id:"bal_01",n:"Balayage Avanzado — Técnica Completa",niv:"a",dur:"30 min",
   img:"https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80",
   videoUrl:"",tools:["Polvo decolorante","Peróxido","Pincel plano","Papel aluminio","Pinzas"],
   vt:"Balayage Profesional Avanzado",vds:"Técnica completa de degradación libre con fórmulas cromáticas.",
   txt:`<div class="importante">📌 Balayage es <strong>colorimetría nivel avanzado</strong>. Requiere dominio completo.</div>
<div class="punto"><span class="punto-num">1</span><span>Inicia el producto a <em>2 dedos de la raíz (20%)</em> o <strong>4 dedos (30%)</strong>.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Revisar cada <strong>10 minutos</strong>. Usar la <em>tabla cromática para neutralización</em>.</span></div>
<div class="alerta">⚠️ Sin supervisión profesional: PROHIBIDO practicar en personas reales. <strong>Usa maniquí primero.</strong></div>`},
  {id:"bal_02",n:"Sisa Triangular en Balayage",niv:"a",dur:"18 min",
   img:"https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80",
   videoUrl:"",tools:["Pincel plano","Peine de aguja","Papel aluminio"],
   vt:"Geometría del Balayage",vds:"Formas triangulares para degradados naturales.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>La <strong>sisa triangular</strong> amplía la zona de aplicación para un degradado más natural.</span></div>
<div class="importante">📌 División en triángulo profundo = <strong>degradado más suave y luminoso</strong>.</div>`}
],
"💎 Queratina":[
  {id:"que_01",n:"Queratina Orgánica vs Formol",niv:"i",dur:"20 min",
   img:"https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=800&q=80",
   videoUrl:"",tools:["Champú sin sal","Queratina","Plancha","Peine fino"],
   vt:"Sellado Térmico con Queratina",vds:"Control de temperatura y técnica de aplicación.",
   txt:`<div class="importante">📌 Las queratinas son procesos químicos <strong>FUERTES</strong>. En cabello muy maltratado pueden destruir la fibra.</div>
<div class="punto"><span class="punto-num">1</span><span>Aplicar a <strong>medio centímetro de la raíz</strong>. Nunca en la raíz directamente.</span></div>
<div class="alerta">⚠️ Queratinas inorgánicas con formol alto en cabello procesado = <strong>riesgo de caída masiva</strong>.</div>`}
],
"🌿 Hidratación":[
  {id:"hid_01",n:"Hidratación con Productos Naturales",niv:"p",dur:"20 min",
   img:"https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=800&q=80",
   videoUrl:"",tools:["Aloe vera","Clara de huevo","Vitamina E","Suero 13cc","Gorro térmico","Licuadora"],
   vt:"Receta Natural de Hidratación",vds:"Fórmula personal de hidratación profunda con ingredientes naturales.",
   txt:`<div class="importante">📌 Receta personal de 19 años: <strong>hidratación profunda natural</strong> para cabello maltratado.</div>
<div class="punto"><span class="punto-num">1</span><span><strong>Ingredientes:</strong> <em>Clara de huevo + cristal de aloe vera + Vitamina E (cápsula) + 13cc de suero inyectable.</em></span></div>
<div class="punto"><span class="punto-num">2</span><span>Colocar <strong>gorro térmico</strong> y dejar reposar <em>45-60 minutos</em>.</span></div>
<div class="tip">✅ También: <strong>Aguacate + huevo + aceite de argán</strong>. Ideal para cabellos con procesos previos.</div>`},
  {id:"hid_02",n:"Hidratación para Cabello con Mechas",niv:"i",dur:"15 min",
   img:"https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=800&q=80",
   videoUrl:"",tools:["Aloe vera","Clara de huevo","Gorro térmico","Pinzas"],
   vt:"Tratamiento Pre-Proceso",vds:"Hidratación de preparación antes de procesos químicos.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Cabello con mechas acumuladas: usar <strong>hidratación profunda natural</strong> antes de cualquier nuevo proceso.</span></div>
<div class="tip">✅ La hidratación es la <strong>base del crecimiento saludable</strong>.</div>`}
],
"✂️ Corte":[
  {id:"cor_01",n:"El Cabello Respira por las Puntas",niv:"p",dur:"10 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
   videoUrl:"",tools:["Tijeras profesionales","Peine","Pinzas"],
   vt:"Fisiología del Crecimiento Capilar",vds:"Por qué el corte regular es esencial.",
   txt:`<div class="importante">📌 Conocimiento clave: <strong>EL CABELLO RESPIRA POR LA PUNTA</strong>, no por la raíz.</div>
<div class="punto"><span class="punto-num">1</span><span>Cortes de punta cada <strong>15-20 días</strong> para cabello maltratado.</span></div>
<div class="tip">✅ Explica siempre esto a tus clientes. El <strong>corte regular es necesario para el crecimiento</strong>.</div>`}
],
"🔥 Planchado":[
  {id:"pla_01",n:"Técnica de Planchado Profesional",niv:"p",dur:"18 min",
   img:"https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=800&q=80",
   videoUrl:"",tools:["Plancha profesional","Cepillo de secar","Secador","Ampolla hidratante"],
   vt:"Planchado sin Daño Capilar",vds:"Técnica correcta para alisado duradero.",
   txt:`<div class="importante">📌 Error más común: planchar sin buen lavado previo. El <strong>cabello graso mal lavado quema las cutículas</strong>.</div>
<div class="punto"><span class="punto-num">1</span><span>Dividir en <strong>8-12 sesiones</strong>, mechones de 2cm. <strong>Máximo 2-3 pasadas por mechón.</strong></span></div>
<div class="alerta">⚠️ Nunca <em>5-10 pasadas de plancha</em>. Quema la cutícula aunque no se vea inmediatamente.</div>`}
],
"💨 Secado":[
  {id:"sec_01",n:"Secado Profesional — Técnica Base",niv:"p",dur:"15 min",
   img:"https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
   videoUrl:"",tools:["Secador profesional","Cepillo redondo","Cepillo paleta","Pinzas"],
   vt:"Técnica de Secado con Cepillo",vds:"División y método de secado para resultado duradero.",
   txt:`<div class="importante">📌 La clave del secado duradero está en el <strong>buen lavado previo</strong>.</div>
<div class="punto"><span class="punto-num">1</span><span>Dividir el cabello en <strong>8-13 sesiones</strong>. Mechones de <em>2cm de grosor</em>.</span></div>
<div class="tip">✅ Si el secado no dura: la causa es casi siempre un <strong>mal lavado o exceso de grasa</strong>.</div>`}
],
"🪮 Técnica de Peine":[
  {id:"tep_01",n:"Tipos de Peinado según Textura",niv:"p",dur:"12 min",
   img:"https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=800&q=80",
   videoUrl:"",tools:["Peine fino","Peine dientes anchos","Peine cola"],
   vt:"Selección de Peines",vds:"Guía de peines según técnica y textura capilar.",
   txt:`<div class="punto"><span class="punto-num">1</span><span><strong>Peine fino:</strong> para cabello liso, divisiones precisas, técnicas de color.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Peine de dientes anchos:</strong> para cabello rizado, hidrataciones, desenredado.</span></div>
<div class="tip">✅ El peine correcto <strong>marca la diferencia en la precisión del resultado final</strong>.</div>`}
],
"✂️ Técnica de Tijera":[
  {id:"tij_01",n:"Posición Correcta de la Tijera",niv:"p",dur:"10 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
   videoUrl:"",tools:["Tijeras profesionales","Tijeras entresacar","Navaja"],
   vt:"Biomecánica del Corte",vds:"Posición y ángulos correctos para cada tipo de corte.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>El pulgar controla la hoja móvil. Los demás dedos sostienen la hoja fija. <em>Muñeca relajada.</em></span></div>
<div class="tip">✅ Tijera afilada = corte limpio. Tijera desafilada = <strong>puntas abiertas inmediatas</strong>.</div>`}
],
"📊 Elevaciones":[
  {id:"ele_01",n:"Elevaciones y Ángulos de Corte",niv:"i",dur:"18 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
   videoUrl:"",tools:["Peine","Tijeras","Peineta divisora"],
   vt:"Tabla de Elevaciones",vds:"Guía de ángulos de corte y su efecto en el resultado.",
   txt:`<div class="punto"><span class="punto-num">1</span><span><strong>0°:</strong> Corte recto o cuadrado.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>45°:</strong> Capas internas, gradación suave.</span></div>
<div class="punto"><span class="punto-num">3</span><span><strong>90°:</strong> Capas uniformes, volumen máximo.</span></div>
<div class="punto"><span class="punto-num">4</span><span><strong>180°:</strong> Capas largas degradadas hacia adelante.</span></div>`}
],
"👤 Morfología":[
  {id:"mor_01",n:"Análisis Facial y Morfología",niv:"i",dur:"20 min",
   img:"https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
   videoUrl:"",tools:["Espejo grande","Tabla de morfología","Lupa"],
   vt:"Morfología Facial Completa",vds:"Análisis de formas de rostro para cortes personalizados.",
   txt:`<div class="importante">📌 El <strong>análisis facial</strong> es el primer paso antes de sugerir cualquier corte.</div>
<div class="punto"><span class="punto-num">1</span><span><strong>Rostro ovalado:</strong> Cualquier corte. Es el ideal universal.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Rostro redondo:</strong> Volumen en la parte superior, no en los lados.</span></div>
<div class="punto"><span class="punto-num">3</span><span><strong>Rostro cuadrado:</strong> Suavizar con capas, ondas. <em>Evitar líneas rectas.</em></span></div>
<div class="punto"><span class="punto-num">4</span><span><strong>Rostro alargado:</strong> Capas laterales para dar anchura.</span></div>`}
],
"🎯 Corrección de Color":[
  {id:"cco_01",n:"Corrección de Tonos No Deseados",niv:"a",dur:"25 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
   videoUrl:"",tools:["Tabla cromática","Tintes correctores","Bowl","Pincel","Peróxido"],
   vt:"Rueda Cromática de Corrección",vds:"Neutralización basada en colores opuestos.",
   txt:`<div class="importante">📌 La corrección de color requiere <strong>matemática, física y química cromática</strong>.</div>
<div class="punto"><span class="punto-num">1</span><span>Usa el <strong>color opuesto en la rueda cromática</strong>: naranja→azul; amarillo→violeta; rojo→verde.</span></div>
<div class="alerta">⚠️ Sin conocimiento de fórmulas, puedes <strong>"escandalizar" el color</strong>.</div>`}
],
"✨ Matización":[
  {id:"mat_01",n:"Matices y Tonos Complementarios",niv:"i",dur:"15 min",
   img:"https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=800&q=80",
   videoUrl:"",tools:["Matizador violeta","Matizador azul","Bowl pequeño","Peróxido 10v"],
   vt:"Tabla de Matizadores",vds:"Guía de tonos complementarios para ajuste fino del color.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>El matiz ajusta el <strong>reflejo del color sin modificar la base</strong>.</span></div>
<div class="tip">✅ Los matizadores se usan en <strong>dosis pequeñas dentro de la mezcla</strong>.</div>`}
],
"🧪 Súper Mezclas":[
  {id:"sme_01",n:"Súper Mezcla Cromática — Técnica",niv:"a",dur:"25 min",
   img:"https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=800&q=80",
   videoUrl:"",tools:["3-4 tintes diferentes","Peróxido","Bowl grande","Pincel","Tabla cromática"],
   vt:"Formulación de Súper Mezclas",vds:"Sistema de mezclas maestras para casos complejos.",
   txt:`<div class="importante">📌 La súper mezcla se usa cuando <strong>ningún tinte individual</strong> logra la neutralización requerida.</div>
<div class="punto"><span class="punto-num">1</span><span>Ejemplo: <em>7.1 + 8.1 + 9.1</em> = mezcla maestra para neutralizar rojos intensos.</span></div>
<div class="alerta">⚠️ Un error puede tener <strong>consecuencias legales</strong>. Estudia y practica antes de aplicar.</div>`}
],
"💧 Cabello Graso":[
  {id:"cgr_01",n:"Tratamiento del Cabello Graso",niv:"p",dur:"15 min",
   img:"https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
   videoUrl:"",tools:["Champú regulador","Enjuague mínimo","Ampolla vitamina E","Jeringa 1cc"],
   vt:"Protocolo Cabello Graso",vds:"Manejo completo del cabello seborreico.",
   txt:`<div class="importante">📌 El cabello graso afecta <strong>TODO procedimiento capilar</strong>.</div>
<div class="punto"><span class="punto-num">1</span><span>Lavar hasta <strong>6 veces</strong> si es necesario. Enjuague: solo <em>1cc en puntas</em>.</span></div>
<div class="tip">✅ Una <strong>ampolla de vitamina E</strong> antes del secado neutraliza la grasa y da brillo.</div>`}
],
"🌵 Cabello Reseco":[
  {id:"cre_01",n:"Tratamiento del Cabello Reseco",niv:"p",dur:"15 min",
   img:"https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=800&q=80",
   videoUrl:"",tools:["Enjuague hidratante","Ampolla botox","Vitamina E","Gorro térmico"],
   vt:"Restauración Capilar",vds:"Protocolo de recuperación para fibra capilar deshidratada.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Usar <strong>enjuague completo</strong> (no limitarlo como en cabello graso).</span></div>
<div class="importante">📌 Cabello reseco + procesos químicos sin hidratación = <strong>riesgo de quiebre masivo</strong>.</div>`}
],
"⚠️ Alertas Cliente":[
  {id:"alc_01",n:"Contraindicaciones y Alertas",niv:"p",dur:"12 min",
   img:"https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
   videoUrl:"",tools:["Ficha de cliente","Formulario alérgico"],
   vt:"Protocolo de Alertas",vds:"Contraindicaciones absolutas que todo peluquero debe conocer.",
   txt:`<div class="alerta">🚨 <strong>EMBARAZO:</strong> Prohibido absolutamente cualquier proceso químico. Sin excepciones.</div>
<div class="alerta">🚨 <strong>ALERGIAS:</strong> Siempre prueba de mechón y prueba alérgica.</div>
<div class="alerta">🚨 <strong>HONGOS CAPILARES:</strong> Atender con guantes. Derivar a dermatólogo.</div>
<div class="tip">✅ Siempre recomienda al cliente lo que <strong>necesita</strong>, no lo que quiere.</div>`}
],
"⚠️ Alertas Peluquero":[
  {id:"alp_01",n:"Ética y Responsabilidad Profesional",niv:"p",dur:"10 min",
   img:"https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=800&q=80",
   videoUrl:"",tools:["Ficha de registro","Formulario de consentimiento"],
   vt:"Responsabilidad Legal del Peluquero",vds:"Marco ético y legal de la práctica profesional.",
   txt:`<div class="importante">📌 El peluquero profesional tiene <strong>responsabilidad legal</strong> ante los resultados.</div>
<div class="punto"><span class="punto-num">1</span><span>Un mal procedimiento de color puede tener <em>consecuencias legales</em>. <strong>Documenta la prueba de mechón.</strong></span></div>
<div class="tip">✅ Tu reputación se construye con cada cliente bien atendido y cada <strong>protocolo respetado</strong>.</div>`}
]
};

// ── Estado global ──
let FLAT = [], TOTAL = 0, CLASE_ACTIVA = null, AUDIO_ON = false;
window.FLAT = FLAT;

// ── Inicio ──
window.onload = () => {
  setTimeout(() => {
    // ── FUENTE ÚNICA DE CATÁLOGO ──────────────────────────────
    // El catálogo REAL son las 299 clases del motor (motor_p1/p2/p3),
    // las MISMAS que gestiona el panel de administración. Si el motor
    // está cargado lo usamos; el CONOCIMIENTO en línea queda solo como
    // respaldo para abrir este archivo suelto sin los motores.
    // (Antes el alumno veía un catálogo viejo de ~50 clases con IDs que
    //  NO coincidían con lo que se desbloquea en el admin → por eso los
    //  accesos no se respetaban.)
    if (window.MOTOR && Object.keys(window.MOTOR).length) {
      window.CONOCIMIENTO = window.MOTOR;
    }
    // Copia íntegra (sin filtrar) — el filtro de accesos SIEMPRE parte de
    // aquí, nunca de un catálogo ya recortado.
    window._CONOCIMIENTO_FULL = window.CONOCIMIENTO;

    // Reconstruir FLAT con TODAS las clases del catálogo activo
    FLAT.length = 0;
    Object.entries(window.CONOCIMIENTO).forEach(([cat, arr]) =>
      arr.forEach(c => FLAT.push({ ...c, cat }))
    );
    window.FLAT = FLAT;
    TOTAL = FLAT.length;

    // Si el puente de accesos YA cargó la lista de la alumna, aplicarla
    // ahora que el catálogo completo está montado (evita la fuga donde se
    // veían todas las clases por una carrera de tiempos).
    if (typeof window._PEL_APLICAR_ACCESOS === 'function') {
      try { window._PEL_APLICAR_ACCESOS(); } catch (_) {}
    }

    const correo = localStorage.getItem('aca_correo');
    if (!correo) {
      document.getElementById('modal-acceso').style.display = 'flex';
      return;
    }
    document.getElementById('modal-acceso').style.display = 'none';
    document.getElementById('disp-correo').textContent = correo;
    if (!localStorage.getItem('aca_comp')) localStorage.setItem('aca_comp', JSON.stringify([]));
    renderMenu(); actualizarStats(); actualizarGaleria();
    if (FLAT.length) inyectar(FLAT[0].id);
  }, 200);
};

function entrar() {
  const v = document.getElementById('inp-correo').value.trim();
  if (!v || !v.includes('@')) { toast('Ingresa un correo válido', 'e'); return; }
  localStorage.setItem('aca_correo', v);
  if (!localStorage.getItem('aca_comp')) localStorage.setItem('aca_comp', JSON.stringify([]));
  document.getElementById('modal-acceso').style.display = 'none';
  document.getElementById('disp-correo').textContent = v;
  renderMenu(); actualizarStats(); actualizarGaleria();
  if (FLAT.length) inyectar(FLAT[0].id);
}

function cerrarSesion() {
  if (!confirm('¿Cerrar sesión?')) return;
  localStorage.removeItem('aca_correo');
  location.reload();
}

// ── Menú ──
function renderMenu(filtro = '') {
  const cont = document.getElementById('cats-container');
  const comp = JSON.parse(localStorage.getItem('aca_comp') || '[]');
  cont.innerHTML = '<div class="sec-lbl">Módulos Curriculares</div>';
  let pri = true;
  Object.entries(CONOCIMIENTO).forEach(([cat, clases]) => {
    const fil = filtro
      ? clases.filter(c => c.n.toLowerCase().includes(filtro.toLowerCase()) || cat.toLowerCase().includes(filtro.toLowerCase()))
      : clases;
    if (!fil.length) return;
    const blk = document.createElement('div'); blk.className = 'cat-block';
    const hdr = document.createElement('div'); hdr.className = 'cat-hdr';
    const done = fil.filter(c => comp.includes(c.id)).length;
    hdr.innerHTML = `<span>${cat}</span><span class="cnt-badge">${done}/${fil.length}</span>`;
    const wrap = document.createElement('div'); wrap.className = 'clases-wrap';
    if (pri) { wrap.classList.add('open'); pri = false; }
    hdr.onclick = () => wrap.classList.toggle('open');
    fil.forEach(c => {
      const el = document.createElement('div');
      el.className = 'clase-item'; el.id = 'item-' + c.id;
      if (CLASE_ACTIVA === c.id) el.classList.add('activa');
      const isDone = comp.includes(c.id);
      const nm = {p:'dot-p', i:'dot-i', a:'dot-a'};
      el.innerHTML = `<span class="nivel-dot ${nm[c.niv]||'dot-i'}"></span><span style="flex:1">${c.n}</span><i class="ti ${isDone ? 'ti-circle-check-filled check-ic done' : 'ti-circle-play check-ic'}"></i>`;
      el.onclick = () => inyectar(c.id);
      wrap.appendChild(el);
    });
    blk.appendChild(hdr); blk.appendChild(wrap); cont.appendChild(blk);
  });
}

function buscar(v) { renderMenu(v); }

// ── Inyector principal ──
function inyectar(id) {
  if (AUDIO_ON) toggleAudio();
  CLASE_ACTIVA = id;
  const c = FLAT.find(x => x.id === id); if (!c) return;

  document.getElementById('bc-cat').textContent = c.cat;
  document.getElementById('bc-clase').textContent = c.n;
  const nTag = document.getElementById('nivel-tag');
  const nMap = {p:['tag-p','🌱 PRINCIPIANTE'], i:['tag-i','⭐ INTERMEDIO'], a:['tag-a','🔥 AVANZADO']};
  const [cls, lbl] = nMap[c.niv] || nMap.i;
  nTag.className = 'nivel-tag ' + cls; nTag.innerHTML = lbl;
  document.getElementById('clase-title').textContent = c.n;
  document.getElementById('meta-dur').textContent = c.dur || '—';
  document.getElementById('meta-cat').textContent = c.cat;

  document.getElementById('lamina-id').textContent = c.id.toUpperCase();
  const lc = document.getElementById('lamina-content');
  lc.innerHTML = c.txt;
  lc.style.cssText = 'color:#d4dce8;display:block;visibility:visible;opacity:1;position:relative;z-index:1;font-size:.88rem;line-height:1.85;';

  // Video de apoyo
  const vapThumb = document.getElementById('vap-thumb');
  const vapPlay  = document.getElementById('vap-play');
  const vapPh    = document.getElementById('vap-ph');
  const vapNourl = document.getElementById('vap-nourl');
  const vapFrame = document.getElementById('vap-frame');
  const vapMp4   = document.getElementById('vap-mp4');
  const vapTitle = document.getElementById('vap-title');

  vapFrame.src = ''; vapFrame.style.display = 'none';
  vapMp4.pause(); vapMp4.src = ''; vapMp4.style.display = 'none';
  vapThumb.style.display = 'none';
  vapPh.style.display = 'none';
  vapPlay.style.display = 'none';
  vapNourl.style.display = 'none';

  if (c.videoUrl) {
    const isMP4 = c.videoUrl.includes('.mp4') || c.videoUrl.includes('firebasestorage');
    if (isMP4) {
      vapMp4.src = c.videoUrl; vapMp4.style.display = 'block'; vapMp4.load();
      const pp = vapMp4.play();
      if (pp !== undefined) pp.catch(() => { vapPlay.style.display = 'flex'; vapMp4.muted = true; vapMp4.play().catch(() => {}); });
    } else {
      const autoUrl = c.videoUrl.includes('?') ? c.videoUrl + '&autoplay=1' : c.videoUrl + '?autoplay=1';
      vapFrame.src = autoUrl; vapFrame.style.display = 'block';
    }
  } else {
    if (c.img) { vapThumb.src = c.img; vapThumb.style.display = 'block'; } else vapPh.style.display = 'flex';
    vapNourl.style.display = 'flex';
  }
  vapTitle.textContent = c.n;

  // Ficha derecha
  document.getElementById('ficha-title').textContent = c.vt || c.n;
  document.getElementById('ficha-desc').textContent  = c.vds || '';
  const toolsEl = document.getElementById('tools-wrap'); toolsEl.innerHTML = '';
  if (c.tools && c.tools.length) c.tools.forEach(t => { const sp = document.createElement('span'); sp.className = 'tool-tag'; sp.textContent = t; toolsEl.appendChild(sp); });

  // Audio TTS automático
  setTimeout(() => {
    const txt = document.getElementById('lamina-content').innerText;
    if (!txt || txt.length < 10) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(txt);
    utt.lang = 'es-ES'; utt.rate = 0.92; utt.pitch = 1;
    const voices = window.speechSynthesis.getVoices();
    const v = voices.find(x => x.name.toLowerCase().includes('google') && (x.lang === 'es-ES' || x.lang === 'es-US'))
           || voices.find(x => x.lang === 'es-ES')
           || voices.find(x => x.lang.startsWith('es'))
           || null;
    if (v) utt.voice = v;
    utt.onstart = () => {
      AUDIO_ON = true;
      document.getElementById('ic-audio').className = 'ti ti-player-pause';
      document.getElementById('audio-status').textContent = 'Reproduciendo...';
      document.getElementById('audio-bar').classList.add('playing');
    };
    utt.onend = () => apagarAudio();
    utt.onerror = () => apagarAudio();
    window.speechSynthesis.speak(utt);
  }, 400);
}

function playVideoApoyo() {
  const mp4 = document.getElementById('vap-mp4');
  const c = FLAT.find(x => x.id === CLASE_ACTIVA); if (!c || !c.videoUrl) return;
  document.getElementById('vap-play').style.display = 'none';
  if (mp4 && mp4.src) { mp4.muted = false; mp4.play().catch(() => { mp4.muted = true; mp4.play(); }); }
}

// ── Audio ──
function toggleAudio() {
  if (!AUDIO_ON) {
    const txt = document.getElementById('lamina-content').innerText;
    const utt = new SpeechSynthesisUtterance(txt);
    utt.lang = 'es-ES'; utt.rate = 0.92; utt.pitch = 1;
    const voices = window.speechSynthesis.getVoices();
    const v = voices.find(x => x.name.toLowerCase().includes('google') && (x.lang === 'es-ES' || x.lang === 'es-US'))
           || voices.find(x => x.lang === 'es-ES')
           || voices.find(x => x.lang.startsWith('es'))
           || null;
    if (v) utt.voice = v;
    utt.onend = () => apagarAudio();
    window.speechSynthesis.speak(utt);
    AUDIO_ON = true;
    document.getElementById('ic-audio').className = 'ti ti-player-pause';
    document.getElementById('audio-status').textContent = 'Reproduciendo...';
    document.getElementById('audio-bar').classList.add('playing');
  } else {
    window.speechSynthesis.cancel(); apagarAudio();
  }
}

function apagarAudio() {
  AUDIO_ON = false;
  document.getElementById('ic-audio').className = 'ti ti-player-play';
  document.getElementById('audio-status').textContent = 'Listo';
  document.getElementById('audio-bar').classList.remove('playing');
}

// ── Progreso ──
function marcarCompletada() {
  if (!CLASE_ACTIVA) { toast('Selecciona una clase primero', 'e'); return; }
  let comp = JSON.parse(localStorage.getItem('aca_comp') || '[]');
  if (comp.includes(CLASE_ACTIVA)) { toast('Esta clase ya está completada ✓'); return; }
  comp.push(CLASE_ACTIVA);
  localStorage.setItem('aca_comp', JSON.stringify(comp));
  toast('¡Clase completada y guardada en tu galería! 🏆');
  renderMenu(); actualizarStats(); actualizarGaleria();
  setTimeout(() => siguienteClase(), 1200);
}

function actualizarStats() {
  // Recalcular TOTAL desde el FLAT vivo (puede haberse recortado por accesos)
  TOTAL = (window.FLAT || FLAT).length;
  const comp = JSON.parse(localStorage.getItem('aca_comp') || '[]');
  const pct = TOTAL > 0 ? Math.round(comp.length / TOTAL * 100) : 0;
  document.getElementById('stat-total').textContent = TOTAL;
  document.getElementById('stat-comp').textContent  = comp.length;
  document.getElementById('stat-pct').textContent   = pct + '%';
  document.getElementById('prog-fill').style.width  = pct + '%';
  document.getElementById('prog-txt').textContent   = comp.length + ' / ' + TOTAL;
  document.getElementById('hdr-prog').textContent   = pct + '% completado';
  document.getElementById('cert-total').textContent = TOTAL;
  document.getElementById('cert-prog').textContent  = comp.length + ' de ' + TOTAL + ' clases';
}

function actualizarGaleria() {
  const grid = document.getElementById('galeria-grid');
  const comp = JSON.parse(localStorage.getItem('aca_comp') || '[]');
  if (!comp.length) {
    grid.innerHTML = '<div class="gal-empty"><i class="ti ti-bookmark" style="font-size:1.8rem;display:block;margin-bottom:6px;opacity:.3;"></i>Completa tu primera clase para verla aquí</div>';
    return;
  }
  grid.innerHTML = '';
  comp.forEach(id => {
    const c = FLAT.find(x => x.id === id); if (!c) return;
    const card = document.createElement('div'); card.className = 'gal-card'; card.onclick = () => inyectar(c.id);
    card.innerHTML = `<div class="gal-thumb-wrap">${c.img ? `<img src="${c.img}" alt="${c.n}" loading="lazy">` : '📸'}</div>
    <div class="gal-info"><div class="gal-title">${c.n}</div><div class="gal-tag"><i class="ti ti-circle-check-filled"></i> Completada</div></div>`;
    grid.appendChild(card);
  });
}

function limpiarGaleria() {
  if (!confirm('¿Limpiar historial? Se perderá el progreso.')) return;
  localStorage.setItem('aca_comp', JSON.stringify([]));
  actualizarStats(); actualizarGaleria(); renderMenu();
  toast('Progreso reiniciado');
}

function siguienteClase() {
  const idx = FLAT.findIndex(x => x.id === CLASE_ACTIVA);
  if (idx >= 0 && idx < FLAT.length - 1) inyectar(FLAT[idx + 1].id);
}

// ── PDF ──
function abrirPDF() {
  const c = FLAT.find(x => x.id === CLASE_ACTIVA); if (!c) return;
  document.getElementById('pdf-modal-title').textContent = c.n;
  document.getElementById('pdf-modal-meta').textContent  = `Módulo: ${c.cat} · Nivel: ${c.niv==='p'?'Principiante':c.niv==='i'?'Intermedio':'Avanzado'} · ${c.dur}`;
  const imgEl = document.getElementById('pdf-modal-img');
  if (c.img) { imgEl.src = c.img; imgEl.style.display = 'block'; } else imgEl.style.display = 'none';
  document.getElementById('pdf-modal-body').innerHTML = c.txt;
  document.getElementById('pdf-ov').classList.add('show');
}

function closePDF() { document.getElementById('pdf-ov').classList.remove('show'); }

function imprimirPDF() {
  const c = FLAT.find(x => x.id === CLASE_ACTIVA); if (!c) return;
  const hoy = new Date().toLocaleDateString('es-ES');
  const w = window.open('', '_blank');
  w.document.write(`<!DOCTYPE html><html><head><title>${c.n} — Academia Fátima Caldera</title>
  <style>body{font-family:Arial,sans-serif;max-width:720px;margin:40px auto;color:#1a1a1a;line-height:1.75;}.header{background:#111;color:#C9A84C;padding:20px;border-radius:10px;margin-bottom:24px;text-align:center;}.header h2{font-size:1.6rem;letter-spacing:2px;margin:0;}.header p{font-size:.75rem;color:#888;margin-top:4px;}.meta{font-size:.8rem;color:#666;margin-bottom:16px;}.clase-img{width:100%;max-height:300px;object-fit:cover;border-radius:10px;margin:0 auto 20px;display:block;border:1px solid #ddd;}h1{font-size:1.35rem;border-bottom:2px solid #C9A84C;padding-bottom:8px;margin-bottom:12px;}strong{background:#fff8e1;padding:1px 4px;border-radius:3px;color:#111;}em{color:#C9A84C;font-style:normal;}.alerta{background:#fff0f0;border-left:4px solid #ff4d4f;padding:10px 14px;margin:12px 0;border-radius:0 6px 6px 0;font-size:.85rem;}.tip{background:#f6ffed;border-left:4px solid #52c41a;padding:10px 14px;margin:12px 0;border-radius:0 6px 6px 0;font-size:.85rem;}.importante{background:#fffbf0;border-left:4px solid #C9A84C;padding:10px 14px;margin:12px 0;border-radius:0 6px 6px 0;font-size:.85rem;}.punto{display:flex;gap:10px;margin:8px 0;}.punto-num{color:#C9A84C;font-weight:800;min-width:20px;}footer{margin-top:30px;border-top:1px solid #ddd;padding-top:12px;font-size:.7rem;color:#999;text-align:center;}</style></head><body>
  <div class="header"><h2>✂️ ACADEMIA FÁTIMA CALDERA</h2><p>Masterclass Premium · Contenido Original de Autor</p></div>
  <h1>${c.n}</h1><p class="meta">Módulo: ${c.cat} &nbsp;|&nbsp; Nivel: ${c.niv==='p'?'Principiante':c.niv==='i'?'Intermedio':'Avanzado'} &nbsp;|&nbsp; ${c.dur}</p>
  ${c.img ? `<img src="${c.img}" class="clase-img" alt="${c.n}">` : ''}${c.txt}
  <footer>© Fátima Caldera · Todos los derechos reservados · ${hoy}</footer></body></html>`);
  w.document.close(); setTimeout(() => w.print(), 500);
}

// ── Toast ──
function toast(msg, tipo) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.className = 'toast ' + (tipo === 'e' ? 'toast-err' : 'toast-ok');
  t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 2800);
}

if (window.speechSynthesis) window.speechSynthesis.onvoiceschanged = () => {};

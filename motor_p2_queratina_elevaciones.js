/**
 * ═══════════════════════════════════════════════════════════════
 *  MOTOR DE CONOCIMIENTO — ACADEMIA FÁTIMA CALDERA
 *  Parte 2 / 3 — Categorías 8–15
 *  Queratina · Hidratación · Corte · Planchado
 *  Secado · Técnica de Peine · Técnica de Tijera · Elevaciones
 *
 *  INSTALACIÓN:
 *  En fatima_peluqueria.html, dentro del <head>,
 *  DESPUÉS de motor_p1_bioseg_balayage.js:
 *  <script src="motor_p2_queratina_elevaciones.js"></script>
 * ═══════════════════════════════════════════════════════════════
 */

window.CONOCIMIENTO_P2 = {

// ════════════════════════════════════════════════════════
"💎 Queratina": [
  // ── PRINCIPIANTE ──
  {id:"que_p01",n:"Qué es la Queratina — Tipos Principales",niv:"p",dur:"10 min",
   img:"https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=800",videoUrl:"",
   tools:["Queratina muestra","Fichas técnicas de producto"],
   vt:"Tipos de Queratina",vds:"Diferencias entre queratina orgánica, con formol y sin formol.",
   txt:`<div class="punto"><span class="punto-num">1</span><span><strong>Queratina orgánica:</strong> sin formaldehído. Más suave, durabilidad 2-3 meses. Para cabellos sensibles.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Queratina formol bajo (menos del 2%):</strong> equilibrio entre durabilidad y seguridad. 3-4 meses.</span></div>
<div class="punto"><span class="punto-num">3</span><span><strong>Queratina formol alto:</strong> máxima durabilidad pero alto riesgo en cabellos procesados. Solo expertos.</span></div>
<div class="alerta">⚠️ Embarazadas y menores de 12 años: prohibida toda queratina, incluyendo las "naturales".</div>`},

  {id:"que_p02",n:"Preparación del Cabello Pre-Queratina",niv:"p",dur:"12 min",
   img:"https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=800",videoUrl:"",
   tools:["Champú clarificante","Agua tibia","Toalla","Timer"],
   vt:"Preparación Pre-Queratina",vds:"Por qué el lavado previo es el paso más crítico de todo el proceso.",
   txt:`<div class="importante">📌 La queratina no penetra en cabello sucio o con build-up. El lavado previo lo determina todo.</div>
<div class="punto"><span class="punto-num">1</span><span>Champú clarificante (purificante) para eliminar siliconas, aceites y residuos de producto.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Cabello muy graso: hasta <strong>10 lavadas</strong>. No usar acondicionador.</span></div>
<div class="punto"><span class="punto-num">3</span><span>Secar el 80% con secador antes de aplicar la queratina.</span></div>
<div class="alerta">⚠️ Nunca aplicar queratina en cabello mojado — queda superficial y no penetra correctamente.</div>`},

  {id:"que_p03",n:"Aplicación de Queratina — Paso a Paso",niv:"p",dur:"20 min",
   img:"https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=800",videoUrl:"",
   tools:["Queratina","Peine de dientes finos","Pinzas","Plancha","Timer"],
   vt:"Protocolo de Aplicación Completo",vds:"De la preparación al sellado final con plancha.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Aplicar a <strong>medio centímetro de la raíz</strong>. Nunca directamente en el cuero cabelludo.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Distribuir con peine de dientes finos de raíz a punta en secciones delgadas.</span></div>
<div class="punto"><span class="punto-num">3</span><span>Dejar actuar el tiempo indicado por el fabricante (15-30 min según producto).</span></div>
<div class="punto"><span class="punto-num">4</span><span>Sellar con plancha caliente sección por sección, <strong>3-5 pasadas por mechón</strong>.</span></div>
<div class="importante">📌 El sellado con plancha activa el tratamiento y lo fija en la cutícula.</div>`},

  {id:"que_p04",n:"Post-Queratina — Los Primeros 3 Días Críticos",niv:"p",dur:"8 min",
   img:"https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=800",videoUrl:"",
   tools:["Champú sin sal (para venta al cliente)"],
   vt:"Cuidados Post-Queratina",vds:"Lo que el cliente NO debe hacer en las primeras 72 horas.",
   txt:`<div class="alerta">🚨 PRIMERAS 72 HORAS POST-QUERATINA — PROHIBIDO:</div>
<div class="punto"><span class="punto-num">1</span><span>No lavar el cabello — el producto sigue fijándose en la cutícula.</span></div>
<div class="punto"><span class="punto-num">2</span><span>No usar accesorios que marquen el cabello (ganchos, coletas, aros de tela).</span></div>
<div class="punto"><span class="punto-num">3</span><span>No mojarlo en piscina, mar ni lluvia.</span></div>
<div class="tip">✅ Después de las 72h: solo champú sin sal para toda la vida de la queratina.</div>`},

  {id:"que_p05",n:"Duración y Mantenimiento de la Queratina",niv:"p",dur:"8 min",
   img:"https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=800",videoUrl:"",
   tools:["Champú sin sal","Mascarilla sin sal","Ficha de cliente"],
   vt:"Vida Útil de la Queratina",vds:"Cuánto dura y cómo maximizar la durabilidad.",
   txt:`<div class="punto"><span class="punto-num">1</span><span><strong>Queratina orgánica:</strong> 2-3 meses con champú sin sal.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Queratina con formol:</strong> 3-6 meses según cuidado y tipo de cabello.</span></div>
<div class="tip">✅ Clientes que usan champú con sal: la queratina dura la mitad. Enséñales a leer etiquetas.</div>`},

  // ── INTERMEDIO ──
  {id:"que_i01",n:"Queratina Orgánica — Ingredientes y Cómo Actúa",niv:"i",dur:"18 min",
   img:"https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=800",videoUrl:"",
   tools:["Queratina orgánica","Ficha de ingredientes","Champú sin sal"],
   vt:"Química de la Queratina Orgánica",vds:"Qué contiene y cómo actúa sin formaldehído.",
   txt:`<div class="importante">📌 La queratina orgánica usa ácido glioxílico, taninos y proteínas vegetales — sin vapores tóxicos.</div>
<div class="punto"><span class="punto-num">1</span><span>El <strong>ácido glioxílico</strong> realiza el sellado sin emitir vapores peligrosos.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Los <strong>taninos vegetales</strong> aportan brillo y suavidad sin afectar la estructura capilar.</span></div>
<div class="tip">✅ Ideal para salones con ventilación limitada o clientes con sensibilidad química.</div>`},

  {id:"que_i02",n:"Queratina con Formol — Protocolo de Seguridad",niv:"i",dur:"20 min",
   img:"https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=800",videoUrl:"",
   tools:["Mascarilla FFP3","Extractor de aire","Guantes","Timer"],
   vt:"Seguridad en Queratinas con Formol",vds:"Cómo aplicar queratinas de formol de forma segura.",
   txt:`<div class="alerta">⚠️ El formaldehído es un irritante respiratorio potente. Las medidas de seguridad son OBLIGATORIAS.</div>
<div class="punto"><span class="punto-num">1</span><span>Ventilación cruzada máxima durante todo el proceso.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Mascarilla FFP3 para el peluquero. Mascarilla quirúrgica para el cliente.</span></div>
<div class="punto"><span class="punto-num">3</span><span>Nunca aplicar en espacios sin ventana ni sin extractor activo.</span></div>
<div class="importante">📌 Límite legal de formol en cosméticos en España: <strong>0.2%</strong>. Exige siempre la ficha técnica.</div>`},

  {id:"que_i03",n:"Queratina en Cabello con Procesos Previos",niv:"i",dur:"15 min",
   img:"https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=800",videoUrl:"",
   tools:["Queratina suave","Prueba de mechón","Timer"],
   vt:"Compatibilidad de Queratina",vds:"Cuándo SÍ y cuándo NO aplicar queratina en cabello procesado.",
   txt:`<div class="alerta">🚨 Queratina con formol alto en cabello muy decolorado = riesgo de caída masiva.</div>
<div class="punto"><span class="punto-num">1</span><span>Cabello con mechas o decoloración: usar SOLO queratina orgánica o con formol bajo.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Prueba de mechón obligatoria para evaluar la resistencia antes de aplicar.</span></div>
<div class="tip">✅ Si el cabello se rompe en el mechón de prueba: esperar mínimo 4 semanas de hidratación antes.</div>`},

  {id:"que_i04",n:"Temperatura de Plancha en Queratina",niv:"i",dur:"12 min",
   img:"https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=800",videoUrl:"",
   tools:["Plancha profesional","Termómetro infrarrojo","Peine fino"],
   vt:"Control Térmico en Queratina",vds:"La temperatura correcta que activa sin destruir la fibra.",
   txt:`<div class="punto"><span class="punto-num">1</span><span><strong>Queratina orgánica:</strong> 190-210°C.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Queratina con formol:</strong> 220-230°C — el calor activa la fijación del formaldehído en la cutícula.</span></div>
<div class="alerta">⚠️ Temperatura insuficiente = queratina que no fija. Temperatura excesiva = daño capilar irreversible.</div>`},

  {id:"que_i05",n:"Derris Catiónico — Alisado Progresivo Natural",niv:"i",dur:"20 min",
   img:"https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=800",videoUrl:"",
   tools:["Derris catiónico","Champú neutro","Plancha","Peine fino","Mascarilla hidratante"],
   vt:"Derris Catiónico Profesional",vds:"El alisado natural alternativo a la queratina con formol.",
   txt:`<div class="importante">📌 El derris catiónico es un alisado progresivo con base en ingredientes catiónicos que recubren la cutícula.</div>
<div class="punto"><span class="punto-num">1</span><span>Sin formaldehído. Ideal para clientes que quieren alisado sin riesgo químico.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Aplicar sobre cabello lavado (sin acondicionador), distribuir uniformemente y sellar con plancha.</span></div>
<div class="punto"><span class="punto-num">3</span><span>Durabilidad: 2-3 meses. Champú sin sal para maximizar.</span></div>
<div class="tip">✅ El derris catiónico es la opción segura para cabellos sensibles y clientes que rechazan el formol.</div>`},

  // ── AVANZADO ──
  {id:"que_a01",n:"Derris Normal — Diferencias con el Catiónico",niv:"a",dur:"18 min",
   img:"https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=800",videoUrl:"",
   tools:["Derris normal","Derris catiónico","Ficha técnica comparativa"],
   vt:"Comparativa Derris Normal vs Catiónico",vds:"Cuándo usar cada tipo y qué resultado diferencial ofrecen.",
   txt:`<div class="importante">📌 El derris normal y el catiónico tienen bases químicas diferentes que producen resultados distintos.</div>
<div class="punto"><span class="punto-num">1</span><span><strong>Derris normal:</strong> mayor poder de alisado, acción más profunda en la cutícula. Para cabellos muy rebeldes.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Derris catiónico:</strong> más suave, recubre sin penetrar profundamente. Para cabellos sensibles o con procesos.</span></div>
<div class="punto"><span class="punto-num">3</span><span>El catiónico tiene mayor compatibilidad con colorimetría posterior (menor alteración del color).</span></div>
<div class="tip">✅ Dominar ambos te permite personalizar el alisado según el historial capilar real del cliente.</div>`},

  {id:"que_a02",n:"Botox Capilar — Qué Es y Cómo Difiere",niv:"a",dur:"18 min",
   img:"https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=800",videoUrl:"",
   tools:["Botox capilar","Champú neutro","Plancha","Timer"],
   vt:"Botox Capilar Avanzado",vds:"Qué es realmente el botox capilar y cómo difiere de la queratina.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>El botox capilar no alisa — <strong>rellena y repara la fibra capilar</strong> dañada.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Contiene: aminoácidos, vitaminas B5/E, ácido hialurónico y proteínas de trigo o soja.</span></div>
<div class="punto"><span class="punto-num">3</span><span>No requiere formol. Ideal para cabellos muy dañados que no toleran queratina convencional.</span></div>
<div class="tip">✅ El botox capilar es la mejor opción como tratamiento previo antes de una queratina en cabello muy maltratado.</div>`},

  {id:"que_a03",n:"Protocolo de Queratina para Salón Premium",niv:"a",dur:"25 min",
   img:"https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=800",videoUrl:"",
   tools:["Kit de queratina premium","Ficha de consentimiento","Cámara","Infusión de bienvenida"],
   vt:"Servicio de Queratina de Lujo",vds:"Cómo elevar el servicio de queratina a experiencia premium.",
   txt:`<div class="importante">📌 Un servicio de queratina premium incluye antes, durante y después — no solo la aplicación.</div>
<div class="punto"><span class="punto-num">1</span><span>Diagnóstico capilar con foto y ficha técnica antes del servicio.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Masaje capilar y tiempo de hidratación durante la espera del proceso.</span></div>
<div class="punto"><span class="punto-num">3</span><span>Kit de mantenimiento (champú sin sal + mascarilla) incluido en el precio.</span></div>
<div class="tip">✅ El precio de queratina premium puede triplicarse cuando la experiencia justifica el valor percibido.</div>`}
],

// ════════════════════════════════════════════════════════
"🌿 Hidratación": [
  // ── PRINCIPIANTE ──
  {id:"hid_p01",n:"Por Qué Hidratamos el Cabello",niv:"p",dur:"8 min",
   img:"https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800",videoUrl:"",
   tools:["Mascarilla hidratante","Enjuague hidratante"],
   vt:"Fundamentos de la Hidratación",vds:"Por qué el cabello pierde agua y cómo recuperarla.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>El cabello sano contiene entre 10-15% de agua. Los procesos químicos reducen esto drásticamente.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Cabello deshidratado: sin brillo, quebradizo, puntas abiertas, sin elasticidad.</span></div>
<div class="importante">📌 La hidratación no es un lujo — es el mantenimiento básico de la salud capilar.</div>`},

  {id:"hid_p02",n:"Receta de Hidratación Profunda Natural — Fórmula de Fátima",niv:"p",dur:"20 min",
   img:"https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800",videoUrl:"",
   tools:["Clara de huevo","Aloe vera (cristal)","Vitamina E (cápsula)","Suero inyectable 13cc","Licuadora","Gorro térmico"],
   vt:"Fórmula Natural de Hidratación Profunda",vds:"Receta personal validada en 19 años de práctica real.",
   txt:`<div class="importante">📌 Esta es mi receta personal de hidratación profunda, validada en 19 años de práctica real.</div>
<div class="punto"><span class="punto-num">1</span><span><strong>Ingredientes:</strong> Clara de huevo + cristal de aloe vera + Vitamina E (1 cápsula) + 13cc de suero inyectable.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Mezclar todo en licuadora. Aplicar de raíz a punta en cabello limpio y semihúmedo.</span></div>
<div class="punto"><span class="punto-num">3</span><span>Gorro térmico y dejar reposar <strong>45-60 minutos</strong>. Retirar con agua tibia y champú suave.</span></div>
<div class="tip">✅ Para cabellos con procesos previos: usar 2 claras de huevo para mayor proteína reconstructora.</div>`},

  {id:"hid_p03",n:"Hidratación con Aguacate y Aceite de Argán",niv:"p",dur:"15 min",
   img:"https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800",videoUrl:"",
   tools:["Aguacate maduro","Aceite de argán","Huevo entero","Bol","Licuadora","Gorro térmico"],
   vt:"Mascarilla Natural de Aguacate",vds:"La hidratación más completa con ingredientes naturales accesibles.",
   txt:`<div class="punto"><span class="punto-num">1</span><span><strong>Ingredientes:</strong> ½ aguacate maduro + 1 huevo entero + 2 cucharadas de aceite de argán.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Mezclar hasta consistencia cremosa. Aplicar evitando el cuero cabelludo (el aceite puede saturar la raíz).</span></div>
<div class="punto"><span class="punto-num">3</span><span>Gorro térmico, 30-45 minutos. Retirar con agua tibia abundante.</span></div>
<div class="tip">✅ El aguacate aporta ácidos grasos esenciales que penetran hasta la corteza capilar.</div>`},

  {id:"hid_p04",n:"Diferencia entre Hidratación y Nutrición Capilar",niv:"p",dur:"8 min",
   img:"https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800",videoUrl:"",
   tools:["Mascarilla hidratante","Mascarilla nutritiva"],
   vt:"Hidratación vs Nutrición",vds:"Por qué son dos procesos distintos y cómo elegir el correcto.",
   txt:`<div class="importante">📌 Error frecuente: confundir hidratación con nutrición. Son procesos complementarios pero distintos.</div>
<div class="punto"><span class="punto-num">1</span><span><strong>Hidratación:</strong> repone agua. Para cabellos resecos sin procesos. Ingredientes: aloe, agua, humectantes.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Nutrición:</strong> repone lípidos y proteínas. Para cabellos maltratados por química.</span></div>
<div class="tip">✅ Cabello reseco natural → hidratación. Cabello dañado por química → nutrición proteica.</div>`},

  {id:"hid_p05",n:"Frecuencia de Hidratación según Tipo de Cabello",niv:"p",dur:"6 min",
   img:"https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800",videoUrl:"",
   tools:["Calendario de tratamientos"],
   vt:"Planificación de Hidratación",vds:"Cada cuánto tiempo hidratar según tipo y condición del cabello.",
   txt:`<div class="punto"><span class="punto-num">1</span><span><strong>Cabello virgen y sano:</strong> hidratación mensual para mantenimiento.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Cabello con color o mechas:</strong> hidratación cada 2 semanas.</span></div>
<div class="punto"><span class="punto-num">3</span><span><strong>Cabello muy procesado o quebradizo:</strong> hidratación semanal hasta recuperar elasticidad.</span></div>
<div class="importante">📌 La hidratación es la base del crecimiento saludable. Sin ella el cabello se parte antes de crecer.</div>`},

  // ── INTERMEDIO ──
  {id:"hid_i01",n:"Hidratación para Cabello con Mechas",niv:"i",dur:"15 min",
   img:"https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800",videoUrl:"",
   tools:["Mascarilla proteica","Aloe vera","Gorro térmico","Aceite de argán"],
   vt:"Hidratación Post-Mechas",vds:"Cómo recuperar la fibra capilar después de la decoloración.",
   txt:`<div class="importante">📌 La decoloración abre la cutícula al máximo y extrae agua y melanina. La recuperación es obligatoria.</div>
<div class="punto"><span class="punto-num">1</span><span>Mascarilla con alta concentración proteica inmediatamente después de retirar el decolorante.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Aloe vera puro en las zonas aclaradas mientras están húmedas.</span></div>
<div class="tip">✅ La hidratación post-mechas determina si el cliente puede seguir con más procesos o necesita descanso.</div>`},

  {id:"hid_i02",n:"Catálogo Completo de Hidrataciones Totalmente Naturales",niv:"i",dur:"25 min",
   img:"https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800",videoUrl:"",
   tools:["Aloe vera","Clara huevo","Miel","Plátano","Leche de coco","Yogur natural","Aceites variados","Gorro térmico"],
   vt:"Recetas Naturales Completas",vds:"Catálogo de hidrataciones 100% naturales para cada tipo de cabello.",
   txt:`<div class="importante">📌 Todas estas fórmulas han sido validadas en la práctica real de 19 años.</div>
<div class="punto"><span class="punto-num">1</span><span><strong>Cabello muy seco:</strong> Plátano maduro + miel + aceite de argán. 45 min + gorro térmico.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Cabello con frizz:</strong> Leche de coco + aloe vera + unas gotas de aceite de argán. 30 min.</span></div>
<div class="punto"><span class="punto-num">3</span><span><strong>Cuero cabelludo irritado:</strong> Yogur natural + miel + 1cc aceite de árbol de té. 20 min solo en cuero cabelludo.</span></div>
<div class="punto"><span class="punto-num">4</span><span><strong>Reconstrucción profunda:</strong> Clara de huevo + aloe vera + Vitamina E + suero 13cc. 60 min.</span></div>
<div class="tip">✅ Verificar alergia al huevo antes de aplicar. Los ingredientes naturales son seguros si se usan correctamente.</div>`},

  {id:"hid_i03",n:"Aceites Naturales — Cuándo y Cuáles",niv:"i",dur:"15 min",
   img:"https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800",videoUrl:"",
   tools:["Aceite de argán","Aceite de coco","Aceite de ricino","Aceite de oliva"],
   vt:"Aceites Capilares Terapéuticos",vds:"Guía completa de aceites naturales para cada tipo de cabello.",
   txt:`<div class="punto"><span class="punto-num">1</span><span><strong>Argán:</strong> brillo, suavidad, anti-frizz. Para todos los tipos. Dosis: 3-5 gotas en puntas.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Coco:</strong> nutrición profunda, penetra la corteza. Para cabellos muy secos. Usar en mascarilla, no suelto.</span></div>
<div class="punto"><span class="punto-num">3</span><span><strong>Ricino:</strong> activa el crecimiento, engrosa el cabello. Aplicar en cuero cabelludo con masaje.</span></div>
<div class="alerta">⚠️ El aceite de oliva en exceso satura el cabello fino. Solo en cabellos gruesos y muy secos.</div>`},

  {id:"hid_i04",n:"Tratamiento de Proteínas — Cuándo y Cómo",niv:"i",dur:"20 min",
   img:"https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800",videoUrl:"",
   tools:["Tratamiento proteico","Timer","Gorro térmico","Champú sin sal"],
   vt:"Reconstrucción Proteica Capilar",vds:"Cuándo usar proteínas y cómo aplicarlas correctamente.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Usar cuando el cabello pierde elasticidad — se estira sin volver a su forma original.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Aplicar en cabello limpio y húmedo, de raíz a punta. Tiempo: 10-30 min según fabricante.</span></div>
<div class="punto"><span class="punto-num">3</span><span>Usar calor (gorro térmico) para mayor penetración.</span></div>
<div class="alerta">⚠️ Exceso de proteínas = cabello rígido y quebradizo. No usar más de una vez a la semana.</div>`},

  {id:"hid_i05",n:"Método LOC para Cabello Rizado",niv:"i",dur:"20 min",
   img:"https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800",videoUrl:"",
   tools:["Crema hidratante","Aceite de jojoba","Crema de rizado","Peine dientes anchos"],
   vt:"Método LOC para Rizos",vds:"El sistema de hidratación más efectivo para cabello con textura.",
   txt:`<div class="importante">📌 LOC: Liquid (Líquido) + Oil (Aceite) + Cream (Crema). El orden determina la retención de humedad.</div>
<div class="punto"><span class="punto-num">1</span><span><strong>L (Líquido):</strong> agua o aloe vera. Hidrata la cutícula abierta.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>O (Aceite):</strong> sella la humedad recién incorporada.</span></div>
<div class="punto"><span class="punto-num">3</span><span><strong>C (Crema):</strong> define y protege el rizo.</span></div>
<div class="tip">✅ El método LOC reduce la resequedad en cabello rizado hasta un 60%.</div>`},

  // ── AVANZADO ──
  {id:"hid_a01",n:"Diagnóstico de Porosidad — Test y Tratamiento",niv:"a",dur:"25 min",
   img:"https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800",videoUrl:"",
   tools:["Vaso de agua","Tabla de porosidad","Ficha de cliente"],
   vt:"Diagnóstico de Hidratación por Porosidad",vds:"Cómo prescribir tratamiento basado en análisis real de porosidad.",
   txt:`<div class="importante">📌 Un diagnóstico correcto antes de hidratar marca la diferencia entre un resultado ordinario y uno extraordinario.</div>
<div class="punto"><span class="punto-num">1</span><span>Test de porosidad: toma un mechón y colócalo en agua. Hunde rápido = alta porosidad. Flota = baja porosidad.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Alta porosidad → tratamiento sellador (proteínas + aceites). Baja porosidad → hidratación con calor.</span></div>
<div class="tip">✅ El diagnóstico de porosidad es un servicio premium que diferencia al profesional del amateur.</div>`},

  {id:"hid_a02",n:"Cronograma Capilar — Sistema de Rotación Mensual",niv:"a",dur:"20 min",
   img:"https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800",videoUrl:"",
   tools:["Calendario mensual","Tratamientos seleccionados","Ficha de cliente"],
   vt:"Cronograma de Tratamientos",vds:"El sistema de rotación que maximiza resultados acumulativos.",
   txt:`<div class="importante">📌 El cronograma capilar es la planificación mensual de tratamientos que garantiza resultados a largo plazo.</div>
<div class="punto"><span class="punto-num">1</span><span><strong>Semana 1:</strong> Hidratación profunda.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Semana 2:</strong> Nutrición (aceites/lípidos).</span></div>
<div class="punto"><span class="punto-num">3</span><span><strong>Semana 3:</strong> Reconstrucción proteica.</span></div>
<div class="punto"><span class="punto-num">4</span><span><strong>Semana 4:</strong> Tratamiento libre según necesidad del momento.</span></div>
<div class="tip">✅ Diseñar y vender cronogramas capilares como servicio premium mensual.</div>`},

  {id:"hid_a03",n:"Hidratación Integrada en Procesos de Color",niv:"a",dur:"22 min",
   img:"https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800",videoUrl:"",
   tools:["Tratamiento hidratante","Tinte o decolorante","Timer","Ficha técnica"],
   vt:"Hidratación Integrada en Procesos",vds:"Cómo añadir hidratación dentro de los procesos sin interferir.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>En balayage: aplicar mascarilla hidratante durante la espera entre decoloración y tonificación.</span></div>
<div class="punto"><span class="punto-num">2</span><span>En tinte: añadir 1 ampolla de hidratación directamente en la mezcla (verificar compatibilidad).</span></div>
<div class="alerta">⚠️ Verificar con el fabricante que el tratamiento no interfiere con la oxidación del tinte.</div>
<div class="tip">✅ Un proceso de color con hidratación integrada se cobra como servicio premium (+20-30%).</div>`}
],

// ════════════════════════════════════════════════════════
"✂️ Corte": [
  // ── PRINCIPIANTE ──
  {id:"cor_p01",n:"El Cabello Respira por las Puntas",niv:"p",dur:"10 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Tijeras profesionales","Peine","Pinzas"],
   vt:"Fisiología del Crecimiento Capilar",vds:"Por qué el corte regular es esencial para el crecimiento.",
   txt:`<div class="importante">📌 Conocimiento clave: <strong>EL CABELLO RESPIRA POR LA PUNTA</strong>, no por la raíz.</div>
<div class="punto"><span class="punto-num">1</span><span>Las puntas abiertas o secas bloquean el crecimiento — el cabello se parte antes de llegar a la longitud deseada.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Cortes de punta cada 15-20 días para cabello maltratado, cada 6-8 semanas para cabello sano.</span></div>
<div class="tip">✅ Explica siempre esto a tus clientes. El corte regular es necesario para el crecimiento, aunque lo crean un mito.</div>`},

  {id:"cor_p02",n:"Tipos de Corte — Recto, Capas y Degradado",niv:"p",dur:"15 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Tijeras","Peine","Spray de agua"],
   vt:"Tipos de Corte Base",vds:"Los 3 cortes fundamentales que son la base de todo lo demás.",
   txt:`<div class="punto"><span class="punto-num">1</span><span><strong>Corte recto:</strong> una sola longitud. Línea horizontal perfecta. Crea peso y densidad visual.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Corte en capas:</strong> diferentes longitudes que crean movimiento y volumen.</span></div>
<div class="punto"><span class="punto-num">3</span><span><strong>Degradado:</strong> transición gradual de corto a largo. Soft o hard según el ángulo.</span></div>
<div class="importante">📌 Estos 3 cortes son la base de todos los demás. Domínalos antes de avanzar.</div>`},

  {id:"cor_p03",n:"Posición Correcta de la Tijera",niv:"p",dur:"10 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Tijeras profesionales"],
   vt:"Biomecánica del Corte",vds:"Posición de dedos, muñeca y cuerpo para un corte perfecto.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>El pulgar controla la hoja móvil. Los demás dedos sostienen la hoja fija.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Muñeca relajada siempre — la tensión causa cortes imprecisos y fatiga en mano y codo.</span></div>
<div class="punto"><span class="punto-num">3</span><span>Cuerpo alineado con la sección que cortas — no te inclines ni te tuerzas.</span></div>
<div class="tip">✅ Tijera afilada = corte limpio. Tijera desafilada = puntas abiertas inmediatas.</div>`},

  {id:"cor_p04",n:"Control del Mechón — Tensión y Ángulo",niv:"p",dur:"12 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Tijeras","Peine","Spray de agua"],
   vt:"Control del Mechón",vds:"Cómo sostener el mechón para cortes uniformes y sin sorpresas.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Tensión consistente en cada mechón = resultado uniforme. Tensión variable = largo desigual.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Cabello mojado: más fácil de controlar pero se encoge al secar — siempre cortar más largo que el deseado.</span></div>
<div class="importante">📌 El cabello rizado puede encogerse hasta un 40% al secar. Ajustar siempre el corte.</div>`},

  {id:"cor_p05",n:"Corte de Flequillo — Técnica Correcta",niv:"p",dur:"12 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Tijeras finas","Peine fino","Clips","Spray de agua"],
   vt:"Técnica de Flequillo",vds:"Cómo cortar un flequillo que dure y favorezca realmente al cliente.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Delimitar la sección del flequillo en triángulo en la frente. No más ancho que las cejas.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Cortar con tijera horizontal de fuera hacia adentro para mayor control.</span></div>
<div class="punto"><span class="punto-num">3</span><span>Afinar con la tijera en vertical (punto por punto) para acabado natural.</span></div>
<div class="alerta">⚠️ El flequillo mojado siempre parece más largo. Corta menos de lo que crees necesario.</div>`},

  // ── INTERMEDIO ──
  {id:"cor_i01",n:"Capas en V y en U",niv:"i",dur:"20 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Tijeras","Peine","Pinzas"],
   vt:"Capas con Forma",vds:"Cómo lograr capas en V y U para diferentes efectos y morfologías.",
   txt:`<div class="importante">📌 La forma de las capas cambia completamente el movimiento y la silueta del corte.</div>
<div class="punto"><span class="punto-num">1</span><span><strong>Capas en V:</strong> el centro más corto que los laterales. Efecto cola de golondrina.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Capas en U:</strong> los laterales más cortos que el centro. Más suave, versátil y flattering.</span></div>
<div class="tip">✅ Para rostros cuadrados: siempre capas en U — suaviza los ángulos naturalmente.</div>`},

  {id:"cor_i02",n:"Bob y Pixie — Cortes Estructurados",niv:"i",dur:"25 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Tijeras","Navaja","Peine","Peineta","Clips"],
   vt:"Cortes Estructurados de Precisión",vds:"Bob clásico, bob asimétrico y pixie — técnica completa.",
   txt:`<div class="punto"><span class="punto-num">1</span><span><strong>Bob clásico:</strong> línea horizontal en la nuca, ángulo negativo de 0°. Base de todos los bobs.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Bob asimétrico:</strong> un lado más largo que el otro. Requiere planificación previa.</span></div>
<div class="punto"><span class="punto-num">3</span><span><strong>Pixie:</strong> muy corto con diferentes longitudes. Técnica de nuca hacia coronilla.</span></div>
<div class="alerta">⚠️ Estos cortes requieren revisión cada 4-6 semanas para mantener la forma.</div>`},

  {id:"cor_i03",n:"Texturizado y Entresacado",niv:"i",dur:"18 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Tijera de entresacar","Navaja","Peine"],
   vt:"Técnicas de Texturizado",vds:"Cómo quitar volumen sin quitar longitud.",
   txt:`<div class="punto"><span class="punto-num">1</span><span><strong>Tijera de entresacar:</strong> reduce peso en puntos específicos. Para cabello muy grueso o voluminoso.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Navaja en húmedo:</strong> texturiza, crea movimiento y reduce peso al mismo tiempo.</span></div>
<div class="alerta">⚠️ Navaja en cabello rizado = frizz garantizado. Solo usar en cabello liso y húmedo.</div>`},

  {id:"cor_i04",n:"Corte para Cabello Rizado — DevaCut",niv:"i",dur:"20 min",
   img:"https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",videoUrl:"",
   tools:["Tijeras","Peine dientes anchos","Clips grandes","Spray con agua"],
   vt:"Técnica DevaCut",vds:"Corte en seco para respetar la estructura natural del rizo.",
   txt:`<div class="importante">📌 El cabello rizado se corta en seco y con su forma natural para respetar cada rizo individualmente.</div>
<div class="punto"><span class="punto-num">1</span><span>Dejar el cabello secar completamente con su forma natural antes de cortar.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Cortar rizo por rizo, respetando la dirección natural de cada uno.</span></div>
<div class="tip">✅ El DevaCut es el servicio de mayor diferenciación técnica del mercado actual de cabello rizado.</div>`},

  {id:"cor_i05",n:"Equilibrio y Simetría en el Corte",niv:"i",dur:"15 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Tijeras","Espejo doble","Peineta"],
   vt:"Simetría Profesional",vds:"Cómo verificar y corregir la simetría durante el corte.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Verificar la simetría cada 3-4 secciones cortadas, no al final del proceso.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Usar espejo de mano para revisar la parte trasera mientras se trabaja.</span></div>
<div class="tip">✅ La asimetría detectada a mitad del corte se corrige en 2 minutos. Al final puede requerir empezar de nuevo.</div>`},

  // ── AVANZADO ──
  {id:"cor_a01",n:"Diseño de Corte según Morfología Facial",niv:"a",dur:"25 min",
   img:"https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",videoUrl:"",
   tools:["Ficha de morfología","Catálogo de cortes","Espejo grande"],
   vt:"Diseño de Imagen Personalizado",vds:"Cómo diseñar el corte perfecto para cada forma de rostro.",
   txt:`<div class="importante">📌 El corte diseñado para la morfología del cliente es el servicio de mayor valor profesional.</div>
<div class="punto"><span class="punto-num">1</span><span><strong>Ovalado:</strong> el ideal universal — cualquier corte funciona.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Redondo:</strong> alargar con capas verticales. Evitar volumen en los lados.</span></div>
<div class="punto"><span class="punto-num">3</span><span><strong>Cuadrado:</strong> suavizar con capas y ondas. Nunca líneas muy rectas.</span></div>
<div class="punto"><span class="punto-num">4</span><span><strong>Corazón:</strong> volumen en la parte baja, no en la frente.</span></div>
<div class="tip">✅ El cliente que se ve bien con el corte que elegiste para él vuelve siempre.</div>`},

  {id:"cor_a02",n:"Corte y Color — Diseño Integral de Imagen",niv:"a",dur:"30 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Ficha técnica","Catálogo de color","Tijeras","Espejo"],
   vt:"Diseño Integral Corte + Color",vds:"Cómo diseñar corte y color como un sistema integrado.",
   txt:`<div class="importante">📌 El colorista avanzado diseña el corte Y el color como una sola obra — no como dos servicios separados.</div>
<div class="punto"><span class="punto-num">1</span><span>El corte determina dónde irán las mechas o el balayage para máxima sinergia visual.</span></div>
<div class="punto"><span class="punto-num">2</span><span>El color puede alargar visualmente un corte corto o acortar uno largo según el tono elegido.</span></div>
<div class="tip">✅ Presentar siempre corte + color como servicio conjunto — la experiencia total justifica el precio total.</div>`},

  {id:"cor_a03",n:"Eficiencia en el Corte sin Perder Calidad",niv:"a",dur:"20 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Tijeras","Peine","Timer","Espejo"],
   vt:"Optimización del Corte Profesional",vds:"Cómo cortar mejor en menos tiempo para más clientes al día.",
   txt:`<div class="importante">📌 Un corte rápido y malo pierde clientes. Un corte lento y perfecto pierde tiempo. El equilibrio es la meta.</div>
<div class="punto"><span class="punto-num">1</span><span>Sistematizar: siempre el mismo orden de secciones → menos decisiones → más velocidad.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Pre-dividir todo el cabello antes de empezar a cortar — no dividir mientras cortas.</span></div>
<div class="tip">✅ Un corte eficiente en 45 min vale más que uno lento en 90 min si el resultado es igual.</div>`}
],

// ════════════════════════════════════════════════════════
"🔥 Planchado": [
  // ── PRINCIPIANTE ──
  {id:"pla_p01",n:"Base del Planchado Profesional",niv:"p",dur:"12 min",
   img:"https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=800",videoUrl:"",
   tools:["Plancha profesional","Cepillo paleta","Secador","Protector térmico"],
   vt:"Fundamentos del Planchado",vds:"Por qué el planchado correcto no daña el cabello.",
   txt:`<div class="importante">📌 Error más común: planchar cabello sin buen lavado previo. El cabello graso mal lavado quema la cutícula.</div>
<div class="punto"><span class="punto-num">1</span><span>Cabello completamente seco antes de planchar — la humedad residual crea burbujas en la cutícula.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Dividir en secciones de máximo 2cm. No intentar planchar secciones gruesas.</span></div>
<div class="punto"><span class="punto-num">3</span><span>Máximo <strong>2-3 pasadas por mechón</strong>. Más pasadas = daño acumulado invisible.</span></div>
<div class="alerta">⚠️ 5-10 pasadas de plancha quema la cutícula aunque no se vea inmediatamente.</div>`},

  {id:"pla_p02",n:"Protectores Térmicos — Cuándo y Cuáles",niv:"p",dur:"8 min",
   img:"https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=800",videoUrl:"",
   tools:["Spray térmico","Serum protector","Aceite protector"],
   vt:"Protección Térmica Obligatoria",vds:"El protector térmico que no puede faltar antes de planchar.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>El protector térmico crea una barrera entre la plancha y la cutícula del cabello.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Spray protector:</strong> uniforme y ligero. Ideal para cabellos finos.</span></div>
<div class="punto"><span class="punto-num">3</span><span><strong>Serum/aceite protector:</strong> mayor protección. Para cabellos gruesos o muy secos.</span></div>
<div class="alerta">⚠️ Nunca planchar sin protector térmico. El daño es acumulativo y aparece semanas después.</div>`},

  {id:"pla_p03",n:"Planchado por Secciones — Paso a Paso",niv:"p",dur:"18 min",
   img:"https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=800",videoUrl:"",
   tools:["Plancha","Peine","Pinzas","Spray de brillo"],
   vt:"Método de Planchado Sistemático",vds:"El orden de trabajo que garantiza un planchado perfecto y uniforme.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Empieza siempre por la nuca — la zona más gruesa y con más volumen.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Sube capa por capa con secciones de 2cm. La zona frontal siempre al final.</span></div>
<div class="punto"><span class="punto-num">3</span><span>Velocidad constante al deslizar la plancha — ni muy rápida ni muy lenta.</span></div>
<div class="tip">✅ El planchado sistemático te ahorra tener que repasar zonas olvidadas al final.</div>`},

  {id:"pla_p04",n:"Duración del Planchado — Factores Clave",niv:"p",dur:"10 min",
   img:"https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=800",videoUrl:"",
   tools:["Spray de fijación","Champú normalizador"],
   vt:"Por Qué No Dura el Planchado",vds:"Factores que afectan la duración y cómo controlarlos.",
   txt:`<div class="punto"><span class="punto-num">1</span><span><strong>Cabello graso:</strong> el sebo deshace el planchado en horas. Lavado extra antes de planchar.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Alta humedad ambiental:</strong> el cabello absorbe la humedad del aire y se ondula.</span></div>
<div class="punto"><span class="punto-num">3</span><span><strong>Calor insuficiente:</strong> la cutícula no se sella completamente.</span></div>
<div class="tip">✅ Para mayor duración: finalizar con spray de brillo fijador con silicona ligera.</div>`},

  {id:"pla_p05",n:"Planchado en Cabello con Color",niv:"p",dur:"10 min",
   img:"https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=800",videoUrl:"",
   tools:["Plancha con regulador","Protector térmico fuerte"],
   vt:"Planchado Post-Color",vds:"Cómo planchar sin destruir el trabajo de color reciente.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Esperar mínimo 48h después de la colorimetría para planchar.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Temperatura reducida (15-20° menos) en cabellos recién teñidos o decolorados.</span></div>
<div class="alerta">⚠️ Planchar inmediatamente después de decolorar = quemar la corteza ya debilitada.</div>`},

  // ── INTERMEDIO ──
  {id:"pla_i01",n:"Técnica de Planchado Profesional Avanzada",niv:"i",dur:"20 min",
   img:"https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=800",videoUrl:"",
   tools:["Plancha BaByliss","Cepillo de aire","Pinzas","Peine fino"],
   vt:"Planchado con Acabado de Salón",vds:"La técnica cepillo + plancha simultáneos que da ese acabado brillante de salón.",
   txt:`<div class="importante">📌 El acabado de salón no es solo temperatura — es la combinación de técnica, producto y cierre correcto.</div>
<div class="punto"><span class="punto-num">1</span><span>Pasa el cepillo de aire justo delante de la plancha mientras deslizas — simultáneamente.</span></div>
<div class="punto"><span class="punto-num">2</span><span>El cepillo tensiona, la plancha sella. Resultado: alisado de mayor duración.</span></div>
<div class="tip">✅ Esta técnica reduce el tiempo total de planchado en un 30%.</div>`},

  {id:"pla_i02",n:"Ondas con Plancha — Técnica Completa",niv:"i",dur:"18 min",
   img:"https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=800",videoUrl:"",
   tools:["Plancha ancha","Peine de dientes anchos","Pinzas","Spray de brillo"],
   vt:"Ondas con Plancha Plana",vds:"Cómo crear ondas suaves y naturales con plancha plana.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Toma un mechón, cierra la plancha y gira la muñeca 180° hacia adentro mientras deslizas.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Para ondas alternas: gira hacia adentro en un mechón, hacia afuera en el siguiente.</span></div>
<div class="tip">✅ Ondas con plancha duran más que con rizador en cabellos muy lacios.</div>`},

  {id:"pla_i03",n:"Planchado en Cabello Rizado — Sin Daño",niv:"i",dur:"15 min",
   img:"https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=800",videoUrl:"",
   tools:["Plancha","Peine dientes anchos","Protector térmico fuerte","Aceite de argán"],
   vt:"Alisado Temporal de Rizos",vds:"Técnica para alisar cabello rizado sin dañar la textura original.",
   txt:`<div class="importante">📌 El cabello rizado necesita más protección térmica que el liso — su estructura es más sensible al calor.</div>
<div class="punto"><span class="punto-num">1</span><span>Protector térmico con factor de protección alto (250°C+).</span></div>
<div class="punto"><span class="punto-num">2</span><span>Secciones más finas que en cabello liso — los rizos requieren más trabajo por mechón.</span></div>
<div class="alerta">⚠️ Planchar cabello rizado más de una vez por semana daña progresivamente la estructura del rizo.</div>`},

  {id:"pla_i04",n:"Acabados — Brillo, Sedosidad, Volumen",niv:"i",dur:"12 min",
   img:"https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=800",videoUrl:"",
   tools:["Spray de brillo","Aceite de argán","Spray voluminizador"],
   vt:"Finales de Planchado Profesional",vds:"Los productos que marcan la diferencia en el acabado final.",
   txt:`<div class="punto"><span class="punto-num">1</span><span><strong>Para brillo máximo:</strong> spray de brillo con silicona ligera sobre el cabello planchado.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Para sedosidad:</strong> 2-3 gotas de aceite de argán pasadas con las palmas sobre el largo.</span></div>
<div class="punto"><span class="punto-num">3</span><span><strong>Para volumen en la raíz:</strong> spray voluminizador solo en la raíz antes de planchar.</span></div>`},

  {id:"pla_i05",n:"Mantenimiento de la Plancha Profesional",niv:"i",dur:"8 min",
   img:"https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=800",videoUrl:"",
   tools:["Paño de microfibra","Limpiador de planchas","Funda"],
   vt:"Cuidado de la Plancha",vds:"Cómo mantener tu plancha para que dure 5+ años.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Limpiar las placas con paño húmedo en frío después de cada uso.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Nunca limpiar la plancha caliente con productos — esperar que enfríe completamente.</span></div>
<div class="tip">✅ El build-up de producto en las placas quema el cabello y arruina el acabado final.</div>`},

  // ── AVANZADO ──
  {id:"pla_a01",n:"Alisado Japonés — Técnica Permanente",niv:"a",dur:"30 min",
   img:"https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=800",videoUrl:"",
   tools:["Solución de alisado japonés","Plancha","Champú neutro","Guantes","FFP2"],
   vt:"Alisado Permanente Japonés",vds:"La técnica de alisado más permanente del mercado.",
   txt:`<div class="importante">📌 El alisado japonés usa tioglicolato de amonio para romper los puentes de disulfuro y reordenarlos en forma lisa.</div>
<div class="punto"><span class="punto-num">1</span><span>Aplicar la solución en cabello limpio. Tiempo de acción: 20-40 min según marca.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Neutralizar y sellar con plancha sección por sección.</span></div>
<div class="alerta">⚠️ Solo para profesionales certificados. Error en el tiempo = daño irreversible en la fibra capilar.</div>`},

  {id:"pla_a02",n:"Queratina + Planchado — Protocolo de Activación",niv:"a",dur:"25 min",
   img:"https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=800",videoUrl:"",
   tools:["Queratina","Plancha 230°C","Peine fino","Pinzas","Timer"],
   vt:"Planchado como Activador de Queratina",vds:"Cómo el planchado correcto maximiza el resultado de queratina.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>La plancha en la queratina no es solo alisar — es <strong>activar y fijar el tratamiento</strong> en la cutícula.</span></div>
<div class="punto"><span class="punto-num">2</span><span>3-5 pasadas por mechón a velocidad constante — el calor funde la proteína dentro de la cutícula.</span></div>
<div class="tip">✅ El planchado de la queratina determina el 50% del resultado final y la durabilidad.</div>`},

  {id:"pla_a03",n:"Planchado para Fotografía y Moda",niv:"a",dur:"20 min",
   img:"https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=800",videoUrl:"",
   tools:["Plancha","Spray de fijación extrema","Gel","Laca"],
   vt:"Planchado para Imagen Editorial",vds:"Técnicas de planchado para fotografía, moda y pasarela.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Para fotografía: planchado perfecto, uniforme y sin ningún punto de fuga.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Usar fijación extrema para mantener el look bajo luces de estudio o pasarela.</span></div>
<div class="tip">✅ El planchado de moda requiere práctica específica — considera asistir a jornadas de image making.</div>`}
],

// ════════════════════════════════════════════════════════
"💨 Secado": [
  // ── PRINCIPIANTE ──
  {id:"sec_p01",n:"Técnica de Secado Profesional Base",niv:"p",dur:"15 min",
   img:"https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",videoUrl:"",
   tools:["Secador profesional","Cepillo redondo","Cepillo paleta","Pinzas"],
   vt:"Secado con Cepillo Redondo",vds:"La técnica de secado que fideliza clientes y diferencia al profesional.",
   txt:`<div class="importante">📌 La clave del secado duradero está en el buen lavado previo y la técnica correcta de cepillo.</div>
<div class="punto"><span class="punto-num">1</span><span>Dividir el cabello en 8-13 secciones con pinzas. Empezar siempre por la nuca.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Mechones de 2cm. Cepillo redondo enrolla el mechón, secador apunta desde arriba.</span></div>
<div class="punto"><span class="punto-num">3</span><span>Finalizar cada mechón con botón de frío para sellar la cutícula y fijar el resultado.</span></div>
<div class="tip">✅ Si el secado no dura: la causa es casi siempre un mal lavado o exceso de grasa en la raíz.</div>`},

  {id:"sec_p02",n:"Selección de Cepillo para Secado",niv:"p",dur:"8 min",
   img:"https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",videoUrl:"",
   tools:["Cepillo redondo pequeño","Cepillo redondo grande","Cepillo paleta"],
   vt:"Cepillos de Secado",vds:"Cuándo usar cada cepillo para el resultado deseado.",
   txt:`<div class="punto"><span class="punto-num">1</span><span><strong>Cepillo redondo pequeño (25mm):</strong> rizos definidos, ondas, cabello corto.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Cepillo redondo grande (50mm+):</strong> volumen, alisado, cabello largo.</span></div>
<div class="punto"><span class="punto-num">3</span><span><strong>Cepillo paleta:</strong> alisado rápido sin volumen para cabellos lacios.</span></div>`},

  {id:"sec_p03",n:"Dirección del Aire — Hacia Abajo Siempre",niv:"p",dur:"6 min",
   img:"https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",videoUrl:"",
   tools:["Secador con boquilla concentradora"],
   vt:"Dirección Correcta del Aire",vds:"Por qué el aire siempre va de raíz a punta en el secado profesional.",
   txt:`<div class="importante">📌 La dirección del aire determina el brillo y la suavidad final del secado.</div>
<div class="punto"><span class="punto-num">1</span><span>Siempre de raíz a punta, en la misma dirección que las escamas de la cutícula.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Aire en dirección contraria levanta la cutícula → frizz → opacidad.</span></div>
<div class="tip">✅ Esta es la diferencia más importante entre un secado en casa y uno profesional.</div>`},

  {id:"sec_p04",n:"Secado Difuso para Cabello Rizado",niv:"p",dur:"12 min",
   img:"https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",videoUrl:"",
   tools:["Secador con difusor","Crema definidora","Gel ligero"],
   vt:"Técnica de Difusión para Rizos",vds:"Cómo secar el rizo sin destruirlo ni crear frizz.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Aplicar crema definidora en cabello húmedo y definir cada rizo con los dedos.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Difusor en temperatura media, sin mover mucho el cabello — dejar caer en el difusor.</span></div>
<div class="punto"><span class="punto-num">3</span><span>No tocar el cabello hasta que esté completamente seco.</span></div>
<div class="alerta">⚠️ Secar rizos sin difusor rompe la estructura del rizo y crea frizz masivo.</div>`},

  {id:"sec_p05",n:"Tiempo de Secado según Tipo de Cabello",niv:"p",dur:"6 min",
   img:"https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",videoUrl:"",
   tools:["Timer","Secador a potencia adecuada"],
   vt:"Control de Tiempo de Secado",vds:"Cuánto tiempo requiere cada tipo de cabello.",
   txt:`<div class="punto"><span class="punto-num">1</span><span><strong>Cabello corto y fino:</strong> 15-25 minutos.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Cabello mediano normal:</strong> 25-40 minutos.</span></div>
<div class="punto"><span class="punto-num">3</span><span><strong>Cabello largo y grueso:</strong> 45-70 minutos.</span></div>
<div class="tip">✅ El tiempo correcto de secado vale igual que la técnica. No aceleres lo que lleva su tiempo.</div>`},

  // ── INTERMEDIO ──
  {id:"sec_i01",n:"Blowout Profesional — Técnica de Volumen",niv:"i",dur:"20 min",
   img:"https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",videoUrl:"",
   tools:["Secador","Cepillo redondo grande","Voluminizador","Laca ligera"],
   vt:"Blowout de Volumen",vds:"La técnica de secado que duplica el volumen natural.",
   txt:`<div class="importante">📌 El blowout usa el cepillo redondo grande para crear volumen desde la raíz que dura días.</div>
<div class="punto"><span class="punto-num">1</span><span>Aplicar voluminizador en la raíz húmeda antes de secar.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Enrollar el cepillo en la raíz, dirigir el secador hacia la raíz 10 seg, luego deslizar hacia la punta.</span></div>
<div class="tip">✅ El blowout de volumen dura 3-5 días en cabello fino si se evita tocar la raíz constantemente.</div>`},

  {id:"sec_i02",n:"Secado con Ampolla — Tratamiento y Secado Simultáneo",niv:"i",dur:"15 min",
   img:"https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",videoUrl:"",
   tools:["Ampolla de vitamina E o brillo","Secador","Cepillo paleta"],
   vt:"Secado con Tratamiento Activo",vds:"Cómo incorporar ampollas al secado para maximizar el brillo.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Aplicar 1 ampolla de brillo o vitamina E en el cabello semihúmedo antes de secar.</span></div>
<div class="punto"><span class="punto-num">2</span><span>El calor del secador activa los ingredientes — mejor absorción que en frío.</span></div>
<div class="tip">✅ Una ampolla de vitamina E antes del secado neutraliza la grasa y da brillo en cabello graso.</div>`},

  {id:"sec_i03",n:"Secado para Efecto Liso sin Plancha",niv:"i",dur:"20 min",
   img:"https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",videoUrl:"",
   tools:["Secador","Cepillo paleta grande","Sérum alisador","Spray térmico"],
   vt:"Secado con Máximo Liso",vds:"Combinación de productos y técnica para máximo alisado sin plancha.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Aplicar sérum alisador en cabello húmedo — distribuir de raíz a punta.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Secar con cepillo paleta en tensión máxima mientras el secador apunta hacia abajo.</span></div>
<div class="punto"><span class="punto-num">3</span><span>Finalizar con botón de frío en cada sección completada.</span></div>
<div class="tip">✅ Esta técnica puede eliminar la necesidad de planchar en cabellos naturalmente semi-lisos.</div>`},

  {id:"sec_i04",n:"Ondas al Agua con Secador",niv:"i",dur:"18 min",
   img:"https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",videoUrl:"",
   tools:["Secador","Cepillo redondo pequeño","Crema de ondas","Pinzas de mariposa"],
   vt:"Ondas al Agua",vds:"Técnica clásica de ondas al agua con cepillo y secador.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Enrollar mechones en el cepillo redondo, calentar y fijar con pinza de mariposa mientras enfría.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Retirar las pinzas cuando todo el cabello esté completamente frío.</span></div>
<div class="tip">✅ Ondas al agua duran 3-5 días si no se mojan. Ideal para eventos especiales.</div>`},

  {id:"sec_i05",n:"Control de Volumen Extremo en el Secado",niv:"i",dur:"15 min",
   img:"https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",videoUrl:"",
   tools:["Secador de alta potencia","Cepillo paleta","Sérum antivolumen","Pinzas"],
   vt:"Control de Volumen Extremo",vds:"Cómo domar el volumen sin añadir más calor del necesario.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Aplicar sérum antivolumen en el largo antes de secar — no en la raíz.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Secar en tensión constante, sección fina por sección fina.</span></div>
<div class="importante">📌 El volumen extremo muchas veces es deshidratación. Proponer hidratación antes del siguiente servicio.</div>`},

  // ── AVANZADO ──
  {id:"sec_a01",n:"Modelo Bar de Blow — Servicio Solo de Secado",niv:"a",dur:"20 min",
   img:"https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",videoUrl:"",
   tools:["Secador","Cepillos variados","Productos de secado","Timer"],
   vt:"Bar de Blow como Modelo de Negocio",vds:"Cómo estructurar y vender el servicio solo de secado.",
   txt:`<div class="importante">📌 El blow bar es el modelo de negocio de secado puro que más crece en ciudades de moda.</div>
<div class="punto"><span class="punto-num">1</span><span>Servicios estandarizados (liso, ondas, volumen) con precios fijos y tiempos controlados.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Tiempo objetivo: 30-45 min por cliente incluyendo lavado.</span></div>
<div class="tip">✅ Con 4-6 clientes de blow al día se puede complementar significativamente el ingreso de colorimetría.</div>`},

  {id:"sec_a02",n:"Enseñar al Cliente a Secar en Casa",niv:"a",dur:"15 min",
   img:"https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",videoUrl:"",
   tools:["Secador (del cliente)","Cepillo adecuado","Ficha de instrucciones"],
   vt:"Tutorial de Secado para Cliente",vds:"Cómo enseñar la técnica y generar fidelización.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Al final del servicio, mostrar los 3 pasos clave del secado correcto para su tipo de cabello.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Entregar una ficha pequeña con las instrucciones específicas para que reproduzca en casa.</span></div>
<div class="tip">✅ El cliente que sabe cuidar su cabello en casa vuelve más feliz al salón y recomienda más.</div>`},

  {id:"sec_a03",n:"Fotografía del Secado para Portfolio Digital",niv:"a",dur:"10 min",
   img:"https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",videoUrl:"",
   tools:["Smartphone","Luz natural o ring light","Fondo neutro"],
   vt:"Fotografía de Secados para Redes",vds:"Cómo fotografiar tus secados para construir portfolio digital.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Luz natural lateral es la mejor para mostrar brillo y textura del cabello.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Foto antes y después siempre — el contraste es lo que genera engagement en redes.</span></div>
<div class="tip">✅ 3-5 fotos de calidad por semana en redes son suficientes para construir un portfolio de referencia en 6 meses.</div>`}
],

// ════════════════════════════════════════════════════════
"🪮 Técnica de Peine": [
  // ── PRINCIPIANTE ──
  {id:"tep_p01",n:"Peine de Aguja — Técnica de Zigzag",niv:"p",dur:"10 min",
   img:"https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800",videoUrl:"",
   tools:["Peine de aguja","Cabello de práctica o maniquí"],
   vt:"Dominio del Peine de Aguja",vds:"La herramienta base de toda técnica de colorimetría.",
   txt:`<div class="importante">📌 El peine de aguja es el instrumento fundamental para dividir el cabello con precisión milimétrica.</div>
<div class="punto"><span class="punto-num">1</span><span>La cola del peine (aguja) va directamente sobre el cuero cabelludo para divisiones limpias.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Zigzag: mover la aguja 45° alternando derecha-izquierda mientras avanzas.</span></div>
<div class="tip">✅ Dominar el peine de aguja = dominar la base de todas las técnicas de colorimetría.</div>`},

  {id:"tep_p02",n:"Cómo Desenredar sin Romper el Cabello",niv:"p",dur:"10 min",
   img:"https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800",videoUrl:"",
   tools:["Peine dientes anchos","Spray desenredante","Aceite de argán"],
   vt:"Técnica de Desenredo sin Daño",vds:"El orden correcto para desenredar sin causar rotura.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Siempre de punta a raíz — nunca de raíz a punta en cabello enredado.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Sostener el mechón con la otra mano para que la tracción no llegue al cuero cabelludo.</span></div>
<div class="punto"><span class="punto-num">3</span><span>Spray desenredante en cabello muy enredado antes de empezar.</span></div>
<div class="alerta">⚠️ Desenredar de raíz a punta en cabello mojado puede romper cientos de cabellos por sesión.</div>`},

  {id:"tep_p03",n:"Peinado Clásico Profesional",niv:"p",dur:"12 min",
   img:"https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800",videoUrl:"",
   tools:["Peine fino","Cepillo de cerdas","Espejo doble"],
   vt:"Técnica de Peinado Clásico",vds:"La técnica de peinado que da un acabado limpio y pulido.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Peinar primero con cepillo para distribuir el cabello uniformemente.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Terminar con peine fino para definir la silueta y el acabado.</span></div>
<div class="tip">✅ El orden correcto es siempre: cepillo primero, peine fino al final.</div>`},

  {id:"tep_p04",n:"Recogidos Básicos — Cola, Moño y Media Cola",niv:"p",dur:"15 min",
   img:"https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800",videoUrl:"",
   tools:["Peine cola","Ligas","Horquillas","Spray de fijación"],
   vt:"Recogidos Básicos",vds:"Cola de caballo, moño y media cola — técnica correcta.",
   txt:`<div class="punto"><span class="punto-num">1</span><span><strong>Cola alta:</strong> peinado hacia arriba con tensión uniforme en todo el perímetro.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Moño limpio:</strong> cola alta + torcer y enrollar + fijar con horquillas en X.</span></div>
<div class="punto"><span class="punto-num">3</span><span>Spray de fijación para controlar los cabellos pequeños del perímetro.</span></div>
<div class="tip">✅ Un recogido limpio y perfecto tarda 10 minutos con la técnica correcta.</div>`},

  {id:"tep_p05",n:"Limpieza de Peines y Cepillos",niv:"p",dur:"5 min",
   img:"https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800",videoUrl:"",
   tools:["Agua tibia","Champú suave","Paño limpio"],
   vt:"Higiene de Herramientas de Peinado",vds:"Limpieza básica que previene contagios y mantiene el rendimiento.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Retirar los cabellos del cepillo diariamente con el mango de otro peine.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Lavar con agua y champú suave semanalmente. Dejar secar boca abajo.</span></div>
<div class="tip">✅ Un peine con build-up de producto transfiere sebo y residuos al cabello del cliente.</div>`},

  // ── INTERMEDIO ──
  {id:"tep_i01",n:"Trenzas Profesionales — Francesa y Holandesa",niv:"i",dur:"25 min",
   img:"https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800",videoUrl:"",
   tools:["Peine cola","Ligas pequeñas","Spray de agua","Horquillas"],
   vt:"Trenzas Profesionales",vds:"Trenza francesa, holandesa y sus variaciones combinadas.",
   txt:`<div class="punto"><span class="punto-num">1</span><span><strong>Trenza francesa:</strong> añadir cabello desde los lados hacia adentro mientras trenzas hacia abajo.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Trenza holandesa (inversa):</strong> igual pero cruzando por debajo — sobresale del cabello.</span></div>
<div class="tip">✅ Las trenzas son el servicio con mayor ratio precio/tiempo en peluquería.</div>`},

  {id:"tep_i02",n:"Peinados para Ocasiones Especiales",niv:"i",dur:"20 min",
   img:"https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800",videoUrl:"",
   tools:["Plancha","Rizador","Horquillas","Laca","Accesorios"],
   vt:"Peinados de Evento",vds:"Catálogo de peinados para boda, gala, quinceaños y prom.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Para eventos nocturnos: mayor fijación, más laca, horquillas invisibles como base.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Para eventos diurnos: más natural, menos spray, más movimiento visible.</span></div>
<div class="importante">📌 Siempre hacer una prueba previa para eventos importantes. Nunca el mismo día.</div>`},

  {id:"tep_i03",n:"Peinados de Novia — Técnica Completa",niv:"i",dur:"30 min",
   img:"https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800",videoUrl:"",
   tools:["Plancha","Rizador","Horquillas","Laca fuerte","Spray de brillo","Accesorios nupciales"],
   vt:"Peinados de Novia Profesionales",vds:"Recogidos y semi-recogidos para el día más importante.",
   txt:`<div class="importante">📌 El peinado de novia es el servicio de mayor presión y mayor honorario en peluquería.</div>
<div class="punto"><span class="punto-num">1</span><span>Prueba obligatoria 2-3 semanas antes: verificar duración, fijación y adaptación al estilo.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Construir de abajo hacia arriba siempre — base sólida primero.</span></div>
<div class="tip">✅ Cobrar la prueba como servicio independiente. El tiempo y el producto tienen costo real.</div>`},

  {id:"tep_i04",n:"Acabados con Cepillo de Cerdas Naturales",niv:"i",dur:"12 min",
   img:"https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800",videoUrl:"",
   tools:["Cepillo de cerdas naturales","Spray ligero","Espejo"],
   vt:"Acabados con Cerdas Naturales",vds:"El cepillo de cerdas naturales que distribuye el brillo natural.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>El cepillo de cerdas naturales distribuye el sebo natural de raíz a punta.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Ideal para dar brillo natural sin productos — especialmente en cabello oscuro.</span></div>
<div class="tip">✅ 100 pasadas diarias con cepillo de cerdas naturales activa la circulación del cuero cabelludo.</div>`},

  {id:"tep_i05",n:"Peinado con Extensiones de Clip",niv:"i",dur:"18 min",
   img:"https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800",videoUrl:"",
   tools:["Extensiones de clip","Peine cola","Plancha","Horquillas"],
   vt:"Integración de Extensiones",vds:"Cómo integrar extensiones de clip de forma invisible.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Colocar las extensiones empezando por la nuca, capa por capa hacia arriba.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Usar la plancha para unificar la textura del cabello natural con las extensiones.</span></div>
<div class="tip">✅ El secreto de las extensiones bien integradas es igualar la textura y el color del cabello natural.</div>`},

  // ── AVANZADO ──
  {id:"tep_a01",n:"Peinados Editoriales para Portfolio",niv:"a",dur:"35 min",
   img:"https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800",videoUrl:"",
   tools:["Kit completo de peinado","Accesorios creativos","Laca extrema","Ring light"],
   vt:"Peinados de Moda Editorial",vds:"Cómo crear peinados de impacto para portfolio y redes sociales.",
   txt:`<div class="importante">📌 Los peinados editoriales son los que construyen reputación de artista, no solo de técnico.</div>
<div class="punto"><span class="punto-num">1</span><span>Inspirarse en tendencias de runway y adaptarlas a tu estilo personal.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Fotografiar siempre con buena luz. El peinado editorial mal fotografiado pierde todo su valor.</span></div>
<div class="tip">✅ 4 sesiones editoriales por año son suficientes para mantenerse relevante en el mercado.</div>`},

  {id:"tep_a02",n:"Recogidos de Alta Complejidad",niv:"a",dur:"40 min",
   img:"https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800",videoUrl:"",
   tools:["Kit completo","Accesorios","Alambres para estructura","Horquillas variadas","Laca extrema"],
   vt:"Recogidos Estructurados Premium",vds:"Creación de recogidos con estructura interna para eventos de alta gama.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Los recogidos de alta complejidad tienen una estructura interior (horquillas base) y exterior (acabado visible).</span></div>
<div class="punto"><span class="punto-num">2</span><span>La clave es construir una base sólida invisible que soporte el volumen y la forma deseada.</span></div>
<div class="tip">✅ Recogidos de alta complejidad justifican honorarios que triplican el precio de un recogido estándar.</div>`},

  {id:"tep_a03",n:"Workshops de Peinado — Modelo de Ingreso Escalable",niv:"a",dur:"20 min",
   img:"https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800",videoUrl:"",
   tools:["Maniquíes","Kit de peinado","Presentación","Cámara"],
   vt:"Monetización a través de Workshops",vds:"Cómo estructurar y vender talleres de peinado rentables.",
   txt:`<div class="importante">📌 Un workshop de peinados es el modelo de ingreso que más escala sin aumentar horas de trabajo directo.</div>
<div class="punto"><span class="punto-num">1</span><span>Definir 3-4 técnicas específicas como tema del workshop (trenzas, recogidos, ondas).</span></div>
<div class="punto"><span class="punto-num">2</span><span>Grupos de 5-8 personas. Presencial o virtual. Duración: 3-4 horas.</span></div>
<div class="tip">✅ El workshop grabado se vende repetidamente como curso digital — ingreso pasivo real.</div>`}
],

// ════════════════════════════════════════════════════════
"✂️ Técnica de Tijera": [
  // ── PRINCIPIANTE ──
  {id:"tij_p01",n:"Partes de la Tijera y Cómo Sostenerla",niv:"p",dur:"8 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Tijera profesional"],
   vt:"Anatomía y Agarre de Tijera",vds:"Todo lo que debes saber sobre tu herramienta más importante.",
   txt:`<div class="punto"><span class="punto-num">1</span><span><strong>Partes:</strong> hoja estática (inferior), hoja móvil (superior), tornillo de tensión, anillas, apoyo de meñique.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Solo el pulgar va en la anilla superior. Los otros 3 dedos sostienen la anilla inferior. Meñique en el apoyo.</span></div>
<div class="punto"><span class="punto-num">3</span><span>Solo el pulgar se mueve para cortar. Los demás dedos son estáticos.</span></div>
<div class="alerta">⚠️ Sostener la tijera con más dedos reduce la precisión y cansa la mano más rápido.</div>`},

  {id:"tij_p02",n:"Corte Directo y Corte con Peine",niv:"p",dur:"12 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Tijera","Peine","Spray de agua"],
   vt:"Técnicas Base de Corte",vds:"Corte directo sobre los dedos y corte siguiendo el peine.",
   txt:`<div class="punto"><span class="punto-num">1</span><span><strong>Corte sobre dedos:</strong> el mechón entre índice y medio. Los dedos guían la línea de corte.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Corte siguiendo el peine:</strong> la tijera sigue la guía que marca el peine. Mayor control de línea.</span></div>
<div class="tip">✅ Ambas técnicas se usan según el área y el tipo de corte. Dominar las dos es obligatorio.</div>`},

  {id:"tij_p03",n:"Texturizado con Tijera — Técnica de Punto",niv:"p",dur:"12 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Tijera profesional","Spray de agua"],
   vt:"Texturizado con Tijera Recta",vds:"Cómo dar textura y movimiento sin necesitar tijera de entresacar.",
   txt:`<div class="punto"><span class="punto-num">1</span><span><strong>Técnica de punto:</strong> tijera en vertical, hacer pequeños cortes en la punta del mechón.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Resultado: puntas más naturales, menos línea de corte visible, más movimiento.</span></div>
<div class="tip">✅ El punto elimina la línea de corte visible en cabellos muy lisos o con muchas capas.</div>`},

  {id:"tij_p04",n:"Corte en Seco vs Corte en Mojado",niv:"p",dur:"10 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Tijera","Spray de agua","Secador"],
   vt:"Mojado vs Seco",vds:"Cuándo cortar mojado y cuándo en seco según la técnica.",
   txt:`<div class="punto"><span class="punto-num">1</span><span><strong>Corte mojado:</strong> más control de línea. Mejor para cortes de precisión y líneas rectas.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Corte seco:</strong> ver el resultado real. Para ajustes finales y cabello rizado.</span></div>
<div class="importante">📌 El cabello seco es siempre más corto que mojado. Calcular la diferencia antes de cortar.</div>`},

  {id:"tij_p05",n:"Mantenimiento del Filo de la Tijera",niv:"p",dur:"6 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Aceite de tijeras","Paño suave"],
   vt:"Cuidado del Filo",vds:"Cómo mantener el filo entre afilados profesionales.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Una gota de aceite en el tornillo y en las hojas cada 2-3 días de uso intensivo.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Limpiar las hojas con paño suave después de cada cliente para quitar sebo y agua.</span></div>
<div class="tip">✅ Una tijera bien mantenida mantiene el filo el doble de tiempo entre afilados.</div>`},

  // ── INTERMEDIO ──
  {id:"tij_i01",n:"Corte con Navaja — Técnica Completa",niv:"i",dur:"18 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Navaja profesional","Spray de agua","Protector para dedos"],
   vt:"Técnica de Navaja",vds:"El uso correcto de la navaja para texturizar y dar movimiento.",
   txt:`<div class="importante">📌 La navaja es la herramienta de mayor riesgo y mayor creatividad. Usarla mal destruye el cabello.</div>
<div class="punto"><span class="punto-num">1</span><span>Solo en cabello mojado — la navaja seca parte el cabello en vez de texturizarlo.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Ángulo de 30-45° sobre el mechón. Movimiento deslizante, no raspante.</span></div>
<div class="alerta">⚠️ Navaja en cabello rizado = frizz permanente. Solo cabello liso y mojado.</div>`},

  {id:"tij_i02",n:"Degradados con Tijera — Fade y Undercut",niv:"i",dur:"22 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Tijera","Tijera larga","Peineta","Cepillo de acabado"],
   vt:"Degradados con Tijera",vds:"Técnica de degradado de tijera para resultados más naturales que con máquina.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>El degradado con tijera es más suave que con máquina — ideal para estilos sofisticados.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Técnica de deslizamiento: la hoja abre y cierra mientras se mueve hacia arriba.</span></div>
<div class="tip">✅ El degradado de tijera requiere 3× más práctica pero da resultados 3× más naturales.</div>`},

  {id:"tij_i03",n:"Tijera de Entresacar — Uso Estratégico",niv:"i",dur:"12 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Tijera de entresacar 30-40%","Peine","Spray de agua"],
   vt:"Entresacado Estratégico",vds:"Cuándo, dónde y cuánto entresacar para el efecto correcto.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Solo usar la tijera de entresacar en el largo — nunca en la raíz.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Aplicar en zonas de exceso de volumen — nunca en todo el cabello uniformemente.</span></div>
<div class="alerta">⚠️ Exceso de entresacado = cabello sin fuerza, sin forma y difícil de estilizar.</div>`},

  {id:"tij_i04",n:"Control de Tensión en el Corte",niv:"i",dur:"12 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Tijera","Peine","Spray de agua"],
   vt:"Tensión en el Corte",vds:"Cómo la tensión del mechón afecta el resultado final.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Alta tensión → el corte queda más corto al soltar. Calcular siempre el reencogimiento.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Tensión consistente en todos los mechones = resultado uniforme sin escalones visibles.</span></div>
<div class="importante">📌 La tensión inconsistente es la causa número 1 de cortes asimétricos involuntarios.</div>`},

  {id:"tij_i05",n:"Acabados con Tijera — Detallado Final",niv:"i",dur:"10 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Tijera fina","Espejo de mano","Spray de brillo"],
   vt:"Detallado Final del Corte",vds:"Los últimos 10 minutos que transforman un buen corte en uno perfecto.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Revisar el corte seco, con la forma final, antes de dar por terminado.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Afinar el flequillo, los laterales y la nuca con tijera fina en seco.</span></div>
<div class="tip">✅ El detallado final es lo que convierte un corte de 30€ en uno de 80€.</div>`},

  // ── AVANZADO ──
  {id:"tij_a01",n:"Corte de Autor — Desarrollo de Estilo Propio",niv:"a",dur:"30 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Kit completo de corte","Espejo","Cámara para portfolio"],
   vt:"Firma Visual en el Corte",vds:"Cómo desarrollar un elemento reconocible en todos tus cortes.",
   txt:`<div class="importante">📌 Los profesionales de nivel avanzado tienen una firma — un elemento reconocible en todos sus cortes.</div>
<div class="punto"><span class="punto-num">1</span><span>Identifica qué técnica dominas mejor que cualquier otro — esa es tu firma potencial.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Repite y perfecciona esa técnica hasta que se vuelva instintiva y perfecta.</span></div>
<div class="tip">✅ La firma estilística atrae clientes específicos sin necesidad de competir en precio.</div>`},

  {id:"tij_a02",n:"Velocidad y Precisión — Nivel Competición",niv:"a",dur:"25 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Timer","Tijeras de competición","Maniquí"],
   vt:"Corte de Competición",vds:"Técnicas de velocidad y precisión para competencias de peluquería.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>En competición: velocidad sin sacrificar simetría ni calidad. Practicar con timer siempre.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Pre-visualizar el corte completo antes de empezar — como un ajedrecista planea sus movimientos.</span></div>
<div class="tip">✅ Las competiciones de peluquería son la mejor forma de acelerar el desarrollo técnico en 12 meses.</div>`},

  {id:"tij_a03",n:"Corte para Tendencias Actuales",niv:"a",dur:"20 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Tijeras","Peine","Tablet con referencias","Cámara"],
   vt:"Lectura e Interpretación de Tendencias",vds:"Cómo adaptar tendencias de runway al cliente real.",
   txt:`<div class="importante">📌 Un profesional avanzado sabe filtrar las tendencias de runway y adaptarlas al cliente real.</div>
<div class="punto"><span class="punto-num">1</span><span>Wolf cut, shag, curtain bangs y bubble braid son tendencias actuales con técnica específica.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Practicar cada nueva tendencia en maniquí antes de ofrecerla a clientes reales.</span></div>
<div class="tip">✅ Ofrecer tendencias actuales atrae clientes jóvenes de manera orgánica en redes sociales.</div>`}
],

// ════════════════════════════════════════════════════════
"📊 Elevaciones": [
  // ── PRINCIPIANTE ──
  {id:"ele_p01",n:"Qué es la Elevación en el Corte",niv:"p",dur:"10 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Peine","Tijeras","Peineta"],
   vt:"Fundamento de Elevaciones",vds:"Qué significa elevar el cabello y cómo cambia el resultado.",
   txt:`<div class="importante">📌 La elevación es el ángulo al que sostienes el mechón respecto al cuero cabelludo antes de cortar.</div>
<div class="punto"><span class="punto-num">1</span><span>A mayor elevación, más capa y más movimiento. A menor elevación, más peso y más longitud.</span></div>
<div class="punto"><span class="punto-num">2</span><span>La elevación es la variable que más transforma el resultado de un mismo corte.</span></div>
<div class="tip">✅ Dominar las elevaciones te da control total sobre el volumen, el peso y el movimiento del corte.</div>`},

  {id:"ele_p02",n:"Las 4 Elevaciones Básicas",niv:"p",dur:"12 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Peine","Tijeras","Peineta divisora"],
   vt:"Tabla de Elevaciones Básicas",vds:"Las 4 elevaciones fundamentales y su efecto en el cabello.",
   txt:`<div class="punto"><span class="punto-num">1</span><span><strong>0° (sin elevación):</strong> corte recto o cuadrado. Máximo peso en la línea de corte.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>45°:</strong> capas internas, gradación suave. La transición más popular.</span></div>
<div class="punto"><span class="punto-num">3</span><span><strong>90°:</strong> capas uniformes, volumen máximo en todo el cabello.</span></div>
<div class="punto"><span class="punto-num">4</span><span><strong>180°:</strong> capas largas degradadas hacia adelante. Efecto V muy pronunciado.</span></div>`},

  {id:"ele_p03",n:"Elevación y Guía de Corte",niv:"p",dur:"12 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Peine","Tijeras","Spray de agua"],
   vt:"Guía de Corte con Elevación",vds:"Cómo usar una guía fija para mantener la elevación constante.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>La guía de corte es el primer mechón cortado que sirve como referencia para todos los demás.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Con guía fija: todos los mechones se llevan al mismo punto → capa uniforme.</span></div>
<div class="punto"><span class="punto-num">3</span><span>Con guía móvil: los mechones siguen el mechón anterior → capas graduadas.</span></div>
<div class="importante">📌 La guía perdida = el corte más común de corrección en peluquería. Nunca la pierdas de vista.</div>`},

  {id:"ele_p04",n:"Elevación según Morfología",niv:"p",dur:"10 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Ficha de morfología","Peine","Tijeras"],
   vt:"Elevaciones por Morfología Facial",vds:"Qué elevación favorece a cada forma de rostro.",
   txt:`<div class="punto"><span class="punto-num">1</span><span><strong>Rostro redondo:</strong> elevación alta (90°+) en la coronilla. Alarga visualmente.</span></div>
<div class="punto"><span class="punto-num">2</span><span><strong>Rostro cuadrado:</strong> elevación media (45°) para suavizar. Evitar líneas en 0°.</span></div>
<div class="punto"><span class="punto-num">3</span><span><strong>Rostro ovalado:</strong> cualquier elevación funciona. El ideal universal.</span></div>
<div class="tip">✅ La elevación es la herramienta invisible que adapta cualquier corte a cualquier rostro.</div>`},

  {id:"ele_p05",n:"Práctica de Elevaciones en Maniquí",niv:"p",dur:"20 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Maniquí de práctica","Tijeras","Peine","Spray de agua"],
   vt:"Ejercicios de Elevación",vds:"Cómo practicar cada elevación hasta dominarla.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>Practicar una elevación a la vez — no mezclar hasta dominar cada una individualmente.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Usar marcadores de colores para etiquetar los mechones por elevación en el maniquí.</span></div>
<div class="tip">✅ 20 minutos diarios de práctica en maniquí durante 30 días = dominio completo de elevaciones básicas.</div>`},

  // ── INTERMEDIO ──
  {id:"ele_i01",n:"Elevaciones Combinadas — Cortes Mixtos",niv:"i",dur:"20 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Peine","Tijeras","Peineta","Spray de agua"],
   vt:"Combinación de Elevaciones",vds:"Cómo mezclar elevaciones en un mismo corte para efectos únicos.",
   txt:`<div class="importante">📌 Los cortes profesionales avanzados combinan diferentes elevaciones en diferentes zonas del cabello.</div>
<div class="punto"><span class="punto-num">1</span><span>Ejemplo: 0° en la nuca (peso en la línea) + 90° en la corona (volumen arriba).</span></div>
<div class="punto"><span class="punto-num">2</span><span>Esta combinación crea el efecto "abultado arriba y definido abajo" que es muy solicitado.</span></div>
<div class="tip">✅ Mapear las elevaciones en papel antes de empezar el corte — como un arquitecto.</div>`},

  {id:"ele_i02",n:"Elevaciones para Cabello Rizado",niv:"i",dur:"18 min",
   img:"https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",videoUrl:"",
   tools:["Tijeras","Peine dientes anchos","Spray de agua"],
   vt:"Elevaciones en Cabello con Textura",vds:"Cómo adaptar las elevaciones al comportamiento del cabello rizado.",
   txt:`<div class="importante">📌 El cabello rizado encoge al secar. Las elevaciones deben compensar este encogimiento.</div>
<div class="punto"><span class="punto-num">1</span><span>Cortar siempre con el encogimiento calculado — generalmente 20-40% más largo que el deseado.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Elevaciones más bajas que en cabello liso para no crear demasiado volumen en la corona.</span></div>
<div class="tip">✅ El cabello rizado tiene su propio sistema de elevaciones. No apliques las reglas del cabello liso.</div>`},

  {id:"ele_i03",n:"Sobre-Dirección — Control Avanzado del Resultado",niv:"i",dur:"15 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Peine","Tijeras","Peineta","Spray de agua"],
   vt:"Sobre-Dirección en el Corte",vds:"Cómo la sobre-dirección cambia el resultado más que la elevación.",
   txt:`<div class="importante">📌 La sobre-dirección es mover el mechón fuera de su caída natural antes de cortar.</div>
<div class="punto"><span class="punto-num">1</span><span>Sobre-dirección hacia adelante: el cabello posterior queda más largo. Crea peso atrás.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Sobre-dirección hacia atrás: el cabello frontal queda más corto. Crea capas que enmarcan.</span></div>
<div class="tip">✅ Dominar la sobre-dirección multiplica las posibilidades de diseño de cualquier corte base.</div>`},

  {id:"ele_i04",n:"Cero Grados — El Corte Bob Perfecto",niv:"i",dur:"18 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Tijeras","Peineta","Spray de agua","Espejo doble"],
   vt:"Técnica del Corte a 0°",vds:"Cómo lograr el bob más limpio y preciso con elevación cero.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>El corte a 0° es el más exigente en simetría — cualquier error es completamente visible.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Verificar la línea desde todos los ángulos antes de dar por terminado.</span></div>
<div class="importante">📌 Un bob perfecto es la tarjeta de presentación más poderosa del peluquero técnico.</div>`},

  {id:"ele_i05",n:"Noventa Grados — Capas Uniformes",niv:"i",dur:"15 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Peine","Tijeras","Peineta divisora","Spray de agua"],
   vt:"Corte a 90° Puro",vds:"Técnica completa del corte en capas uniformes a 90°.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>El corte a 90° lleva todos los mechones perpendiculares al cuero cabelludo antes de cortar.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Resultado: todas las capas tienen la misma longitud real, distribuyendo el volumen uniformemente.</span></div>
<div class="tip">✅ El 90° es la base del corte en capas más usado en peluquería. Dominarlo es obligatorio.</div>`},

  // ── AVANZADO ──
  {id:"ele_a01",n:"Elevaciones Negativas — Técnica Bob Graduado",niv:"a",dur:"22 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Tijeras","Peineta","Espejo de mano","Spray de agua"],
   vt:"Elevaciones Negativas",vds:"Elevaciones por debajo de 0° para crear peso en la base del corte.",
   txt:`<div class="importante">📌 Las elevaciones negativas (por debajo de 0°) crean el efecto bob graduado — más corto en la nuca, más largo adelante.</div>
<div class="punto"><span class="punto-num">1</span><span>Inclinar el mechón hacia abajo (bajo 0°) antes de cortar — la parte interna queda más corta.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Cuanto mayor la inclinación negativa, más pronunciado el graduado.</span></div>
<div class="tip">✅ El bob graduado es uno de los 3 cortes más pedidos en salones de todo el mundo.</div>`},

  {id:"ele_a02",n:"Diseño de Corte con Mapa de Elevaciones",niv:"a",dur:"25 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Papel","Lápiz","Cabeza de maniquí","Tijeras","Kit completo"],
   vt:"Planificación de Cortes Complejos",vds:"Cómo diseñar un corte complejo antes de ejecutarlo.",
   txt:`<div class="importante">📌 Un corte complejo diseñado en papel antes de ejecutarlo tiene un 90% más de probabilidad de éxito.</div>
<div class="punto"><span class="punto-num">1</span><span>Dibujar la cabeza de perfil y de frente, marcar las zonas y sus elevaciones con números.</span></div>
<div class="punto"><span class="punto-num">2</span><span>Identificar la guía principal, las guías secundarias y las zonas de transición.</span></div>
<div class="tip">✅ Este hábito de diseño previo es lo que separa a un técnico avanzado de uno ordinario.</div>`},

  {id:"ele_a03",n:"Elevaciones en Cortes Masculinos — Fade Técnico",niv:"a",dur:"25 min",
   img:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",videoUrl:"",
   tools:["Tijeras","Máquina de corte","Peine","Espejo de mano"],
   vt:"Fade con Tijera",vds:"Cómo ejecutar un fade técnico con tijera en vez de solo máquina.",
   txt:`<div class="punto"><span class="punto-num">1</span><span>El fade técnico combina máquina en la base y tijera en la transición para un resultado más natural.</span></div>
<div class="punto"><span class="punto-num">2</span><span>La zona de transición (2-4cm) es donde la tijera define la calidad del fade.</span></div>
<div class="tip">✅ El peluquero que domina el fade técnico con tijera tiene acceso al mercado masculino premium.</div>`}
]

}; // Fin CONOCIMIENTO_P2

// ── FUSIÓN CON CONOCIMIENTO PRINCIPAL ────────────────────────
(function fusionarP2 () {
  const intentar = () => {
    if (typeof window.CONOCIMIENTO === 'undefined') {
      setTimeout(intentar, 150);
      return;
    }
    Object.entries(window.CONOCIMIENTO_P2).forEach(([cat, clases]) => {
      if (!window.CONOCIMIENTO[cat]) {
        window.CONOCIMIENTO[cat] = clases;
      } else {
        const ids = new Set(window.CONOCIMIENTO[cat].map(c => c.id));
        clases.forEach(c => {
          if (!ids.has(c.id)) window.CONOCIMIENTO[cat].push(c);
        });
      }
    });
    console.log('[Motor Fátima P2] Fusión completada ✅');
  };
  intentar();
})();

/* ════════════════════════════════════════════════════════════════
   FÁTIMA PRO HUB · MÓDULOS AVANZADOS v3.7
   ▸ Dashboard "Mi Progreso"
   ▸ Test / Evaluación por bloque
   ▸ Certificado descargable en PDF (jsPDF — sin html2canvas, sin CORS)
   ▸ Chatbox conversacional con voz Ramona es-DO
   ════════════════════════════════════════════════════════════════ */

/* ═════ FAQ del Chatbox ═════ */
const FAQ_CHAT=[
  {q:'¿Cómo funciona el hub?',a:'Tienes 5 sistemas profesionales: Corte, Colorimetría, Academia, Nutrición y Fitness. Cada uno con su video de explicación y su PDF. Empiezas con 10 créditos gratis para ver videos y hacer acciones. Las descargas, evaluaciones y certificados requieren créditos extras que compras conmigo por WhatsApp.'},
  {q:'¿Cuánto cuestan los créditos?',a:'Tenemos dos paquetes: el pack de 50 créditos por 9 dólares con 99 centavos, ideal para empezar. Y el pack de 120 créditos por 25 dólares, el más conveniente porque te incluye un bono extra. Pulsa el botón Comprar por WhatsApp y conversamos directamente.'},
  {q:'Soy principiante, ¿por dónde empiezo?',a:'¡Bienvenida! Te recomiendo empezar por el Bloque 1, Motor de Corte, en nivel Principiante. Ahí aprenderás las elevaciones, vectores y las primeras técnicas. Cuando termines, tomas la evaluación y desbloqueas tu primer certificado. ¡Vamos paso a paso!'},
  {q:'¿Cómo descargo una clase?',a:'Cada clase tiene su video y su PDF descargable. Para descargar el PDF necesitas 10 créditos. El video lo puedes ver con 5 créditos. Recuerda que las descargas son tuyas para siempre una vez compradas.'},
  {q:'¿Cómo obtengo el certificado?',a:'Excelente pregunta. Para obtener tu certificado debes completar la evaluación del bloque y aprobarla con un setenta por ciento o más. Cada bloque tiene su propio certificado. Al aprobar, lo descargas como PDF profesional con tu nombre y mi firma.'},
  {q:'¿Las clases tienen tiempo límite?',a:'No. Una vez que compras créditos y desbloqueas una clase, queda en tu galería para siempre. Puedes verla las veces que necesites y descargar el PDF cuando quieras.'},
  {q:'¿Qué incluye cada bloque?',a:'Bloque 1: técnicas de corte y diagnóstico. Bloque 2: colorimetría, fórmulas y matización. Bloque 3: academia con clases en video. Bloque 4: nutrición profesional. Bloque 5: rutinas de entrenamiento físico. Todo creado por mí, Fátima Caldea.'},
  {q:'¿Puedo cambiar mi contraseña?',a:'Sí, escríbeme por WhatsApp y te ayudo con eso personalmente mientras automatizamos esa opción. Tu seguridad es prioridad.'}
];

/* ═════ TESTS · 10 preguntas por bloque ═════ */
const TESTS_DATA={
  1:{titulo:'Evaluación · Motor de Corte',color:'#d4af37',ico:'✂️',preguntas:[
    {q:'¿Qué elevación se usa para un corte recto sin movimiento?',opts:['0°','45°','90°','180°'],ok:0},
    {q:'¿Qué genera mayor desconexión en un corte tipo wolf?',opts:['Elevación 0°','Elevación máxima en coronilla y nuca baja','Solo punta cortada','Texturizado con navaja'],ok:1},
    {q:'¿Qué es la sub-sección guía?',opts:['Una herramienta de corte','La primera sección cortada que marca la referencia para las siguientes','El cepillo de blower','Un tipo de mecha'],ok:1},
    {q:'¿Cómo se llama la técnica de cortar con la punta de la tijera para crear textura?',opts:['Slicing','Point cutting','Bricking','Razor cut'],ok:1},
    {q:'En un bob largo clásico, ¿cuál es la elevación recomendada?',opts:['90°','0°','45°','180°'],ok:1},
    {q:'¿Por qué se peina húmedo al cortar?',opts:['Por moda','El cabello cae uniforme y permite precisión','Para hacerlo más rápido','No es necesario'],ok:1},
    {q:'¿Qué efecto tiene una elevación mayor a 90°?',opts:['Quita volumen','Genera capas y volumen en la zona superior','Hace un corte recto','No afecta'],ok:1},
    {q:'¿Cuál es el ángulo correcto del dedo de soporte al cortar?',opts:['Perpendicular a la mecha','Paralelo a la línea de corte deseada','45° siempre','No importa'],ok:1},
    {q:'¿Qué densidad capilar requiere más desfilado?',opts:['Densidad fina','Densidad muy abundante','Densidad media','Todas igual'],ok:1},
    {q:'¿Cuál es el primer paso del diagnóstico capilar antes de cortar?',opts:['Lavar','Analizar densidad, textura, forma de rostro y crecimiento','Aplicar producto','Decolorar'],ok:1}
  ]},
  2:{titulo:'Evaluación · Colorimetría',color:'#00f2ff',ico:'🎨',preguntas:[
    {q:'¿Qué volumen de oxidante se usa para cubrir canas sin aclarar?',opts:['10 vol','20 vol','30 vol','40 vol'],ok:1},
    {q:'¿Cuál es el fondo de aclarado del nivel 7?',opts:['Rojo','Naranja','Amarillo','Beige'],ok:1},
    {q:'¿Qué tono neutraliza el reflejo amarillo no deseado?',opts:['Rojo','Verde','Violeta','Azul'],ok:2},
    {q:'¿Qué tono neutraliza el verde?',opts:['Rojo','Violeta','Amarillo','Azul'],ok:0},
    {q:'¿Cuántos niveles aclara el oxidante de 30 volúmenes?',opts:['1 nivel','2 niveles','3 niveles','5 niveles'],ok:2},
    {q:'¿Qué hace un bonder (ej: Olaplex, K18)?',opts:['Tinta el cabello','Repara y une los enlaces de disulfuro durante el proceso químico','Aclara más rápido','Da brillo solamente'],ok:1},
    {q:'¿Qué porcentaje mínimo de tono natural debe llevar una fórmula para cobertura total de canas?',opts:['10%','25%','50% o más','No se mezcla con natural'],ok:2},
    {q:'En balayage clásico, ¿se debe tocar la raíz?',opts:['Sí, siempre','No, se deja transición natural desde la raíz','Solo en cabellos oscuros','Depende del cliente'],ok:1},
    {q:'¿Cuál es el tiempo promedio de exposición de un tinte permanente?',opts:['5 minutos','15-20 minutos','30-45 minutos','2 horas'],ok:2},
    {q:'¿Cuál es la regla de oro para igualar un color desparejo?',opts:['Aclarar todo','Pre-pigmentar las zonas más claras antes del tono final','Usar solo oxidante 40','Lavar con shampoo morado'],ok:1}
  ]},
  3:{titulo:'Evaluación · Academia & Negocio',color:'#a855f7',ico:'📚',preguntas:[
    {q:'¿Cuál es la mejor estrategia para fidelizar un cliente nuevo?',opts:['Bajarle el precio','Atención personalizada + seguimiento post-servicio','Regalarle todo','Ignorarlo después'],ok:1},
    {q:'¿Qué red social es prioritaria para mostrar trabajos de peluquería?',opts:['LinkedIn','Instagram y TikTok por su formato visual','Facebook solo','Email'],ok:1},
    {q:'¿Cada cuánto debes publicar antes/después en redes?',opts:['Una vez al mes','Mínimo 3-5 veces por semana','Solo cuando hay tiempo','Nunca'],ok:1},
    {q:'¿Cómo se calcula el precio justo de un servicio?',opts:['Lo que cobre la competencia','Costo de productos + tiempo + experiencia + ganancia deseada','Al azar','Lo que pida el cliente'],ok:1},
    {q:'¿Cómo manejar una queja de cliente?',opts:['Ignorarla','Escuchar, validar emoción y ofrecer solución concreta','Discutir','Bloquear al cliente'],ok:1},
    {q:'¿Qué es un portfolio profesional?',opts:['Una lista de precios','Conjunto curado de tus mejores trabajos para mostrar a clientes nuevos','Tu factura','Tu agenda'],ok:1},
    {q:'¿Cuándo es buen momento para subir precios?',opts:['Nunca','Cuando tu demanda supera tu disponibilidad y tu técnica ha crecido','Cada semana','Solo en diciembre'],ok:1},
    {q:'¿Qué incluye un paquete de cliente nuevo?',opts:['Solo el servicio','Servicio + asesoría + recomendación de cuidado + recordatorio próxima cita','Solo descuento','Producto gratis'],ok:1},
    {q:'¿Cómo conseguir reseñas de clientes?',opts:['No pedirlas','Pedirlas al final del servicio cuando el cliente está feliz, con link directo','Comprar reseñas falsas','Esperar suerte'],ok:1},
    {q:'¿Qué es la regla del 80/20 en redes?',opts:['Postear solo promos','80% contenido de valor + 20% promoción','80% memes','No existe'],ok:1}
  ]},
  4:{titulo:'Evaluación · Nutrición',color:'#22c55e',ico:'🥗',preguntas:[
    {q:'¿Cuántos gramos de proteína por kg de peso corporal recomienda para hipertrofia?',opts:['0.5-0.8 g/kg','1.6-2.2 g/kg','5 g/kg','No importa'],ok:1},
    {q:'¿Cuál es la "ventana anabólica" post-entreno?',opts:['10 minutos','2 horas después del entrenamiento','12 horas','24 horas'],ok:1},
    {q:'¿Cuáles son los tres macronutrientes principales?',opts:['Vitaminas, minerales, agua','Proteínas, carbohidratos y grasas','Solo proteína','Azúcar, sal y fibra'],ok:1},
    {q:'¿Cuánta agua se recomienda al día para una mujer activa?',opts:['500 ml','2.5-3 litros aprox','10 litros','Lo que se pueda'],ok:1},
    {q:'¿Qué son los carbohidratos complejos?',opts:['Dulces','Cereales integrales, avena, batata — liberan energía lenta','Solo arroz blanco','Refrescos'],ok:1},
    {q:'¿Cuál es el déficit calórico saludable para perder grasa?',opts:['10% bajo mantenimiento','15-25% bajo mantenimiento','75% bajo mantenimiento','Cero calorías'],ok:1},
    {q:'¿Para qué sirve la creatina?',opts:['Quemar grasa','Aumentar fuerza y volumen muscular en entrenamientos cortos e intensos','Bajar peso','Dormir mejor'],ok:1},
    {q:'¿La deshidratación reduce el rendimiento físico?',opts:['No','Sí, hasta un 20-30%','Solo en verano','Solo en hombres'],ok:1},
    {q:'¿Qué proteína se absorbe más rápido?',opts:['Caseína','Whey (suero de leche)','Proteína de res','Frijoles'],ok:1},
    {q:'¿Es necesario el desayuno para ganar masa muscular?',opts:['Imprescindible','Lo que importa es el total calórico y proteico del día','No comer','Solo café'],ok:1}
  ]},
  5:{titulo:'Evaluación · Fitness',color:'#f97316',ico:'💪',preguntas:[
    {q:'¿Cuántas series por grupo muscular se recomiendan a la semana para hipertrofia?',opts:['3-5','10-20 series semanales','100+','Ninguna'],ok:1},
    {q:'¿Cuál es el rango de repeticiones óptimo para hipertrofia?',opts:['1-3 reps','6-12 reps','25-50 reps','100 reps'],ok:1},
    {q:'¿Cuánto descanso entre series para fuerza máxima?',opts:['10 segundos','2-5 minutos','30 minutos','No descansar'],ok:1},
    {q:'¿Qué es la sobrecarga progresiva?',opts:['Cargar mal el peso','Aumentar gradualmente la intensidad (peso, reps o volumen) con el tiempo','Hacer menos cada sesión','Solo cardio'],ok:1},
    {q:'¿Cuántos días por semana se debe entrenar un mismo músculo?',opts:['Todos los días','2 veces por semana mínimo','Una vez al mes','Solo domingo'],ok:1},
    {q:'¿Cuánto debe durar un calentamiento adecuado?',opts:['No es necesario','5-10 minutos con movilidad y activación','60 minutos','3 segundos'],ok:1},
    {q:'¿Cuál es la diferencia entre ejercicio compuesto y aislado?',opts:['Ninguna','Compuesto involucra varios grupos musculares; aislado solo uno','Aislado es más rápido','Compuesto es solo para hombres'],ok:1},
    {q:'¿Cuándo aumentar el peso en una serie?',opts:['Nunca','Cuando puedas completar todas las reps con buena técnica y aún sobra energía','Cada día','Solo si duele'],ok:1},
    {q:'¿Por qué es importante el descanso entre entrenamientos?',opts:['No es importante','El músculo crece durante el descanso, no durante el entrenamiento','Solo para flojera','Reduce fuerza'],ok:1},
    {q:'¿Qué hace el cardio en ayunas?',opts:['Nada','Favorece la oxidación de grasas pero debe evaluarse según el nivel de glucógeno','Solo cansa','Engorda'],ok:1}
  ]}
};

/* ═════ PROGRESO DEL ALUMNO (localStorage por uid) ═════ */
const HUB_PROGRESS={
  key:'fc_progress',data:null,
  setUid(uid){this.key='fc_progress_'+uid;this.load();this._actualizarRacha();},
  load(){try{this.data=JSON.parse(localStorage.getItem(this.key))||this._vacio();}catch(e){this.data=this._vacio();}return this.data;},
  save(){localStorage.setItem(this.key,JSON.stringify(this.data));},
  _vacio(){return{bloques:{1:{},2:{},3:{},4:{},5:{}},racha:{dias:0,ultimoLogin:null,recordHist:0},certificados:[],ultimoBloqueVisto:null};},
  _hoy(){return new Date().toISOString().slice(0,10);},
  _actualizarRacha(){
    const hoy=this._hoy();const r=this.data.racha;
    if(!r.ultimoLogin){r.dias=1;r.ultimoLogin=hoy;}
    else if(r.ultimoLogin===hoy){}
    else{const d1=new Date(r.ultimoLogin),d2=new Date(hoy);const diff=Math.round((d2-d1)/86400000);if(diff===1){r.dias+=1;}else{r.dias=1;}r.ultimoLogin=hoy;}
    r.recordHist=Math.max(r.recordHist||0,r.dias);this.save();
  },
  marcarBloqueVisto(n){
    this.data.ultimoBloqueVisto=n;
    const b=this.data.bloques[n]||{};b.visto=true;b.ultimaVez=this._hoy();b.veces=(b.veces||0)+1;
    this.data.bloques[n]=b;this.save();
  },
  guardarResultadoTest(bloque,score,total){
    const pct=Math.round((score/total)*100);const aprobado=pct>=70;
    const b=this.data.bloques[bloque]||{};
    b.test={score,total,pct,aprobado,fecha:this._hoy()};
    this.data.bloques[bloque]=b;
    if(aprobado&&!this.data.certificados.find(c=>c.bloque===bloque)){
      this.data.certificados.push({bloque,pct,fecha:this._hoy()});
    }
    this.save();return{pct,aprobado};
  },
  pctTotal(){
    let s=0;
    for(let i=1;i<=5;i++){const b=this.data.bloques[i]||{};if(b.visto)s+=10;if(b.test&&b.test.aprobado)s+=10;}
    return s;
  }
};

/* ═════ TEST · Modal con preguntas ═════ */
const HUB_TEST={
  bloqueActual:null,idx:0,respuestas:[],
  abrir(bloque){
    if(!TESTS_DATA[bloque])return;
    this.bloqueActual=bloque;this.idx=0;
    this.respuestas=new Array(TESTS_DATA[bloque].preguntas.length).fill(null);
    document.getElementById('modalTest').classList.add('open');this.render();
  },
  cerrar(){document.getElementById('modalTest').classList.remove('open');HUB_TTS&&HUB_TTS.parar&&HUB_TTS.parar();},
  render(){
    const data=TESTS_DATA[this.bloqueActual];const total=data.preguntas.length;
    const i=this.idx;const p=data.preguntas[i];const c=data.color;
    const pct=Math.round((i/total)*100);
    document.getElementById('modalTestBody').innerHTML=`
      <div class="mt-header" style="border-color:${c}44;">
        <div><div class="mt-cat" style="color:${c};">${data.ico} BLOQUE ${this.bloqueActual} · EVALUACIÓN</div><div class="mt-tit">${data.titulo}</div></div>
        <button class="mt-close" onclick="HUB_TEST.cerrar()">✕</button>
      </div>
      <div class="mt-bar"><div class="mt-fill" style="width:${pct}%;background:${c};"></div></div>
      <div class="mt-meta">Pregunta ${i+1} de ${total} · Aprobado con 70%</div>
      <div class="mt-q">${p.q}</div>
      <div class="mt-opts">
        ${p.opts.map((o,oi)=>`
          <button class="mt-opt ${this.respuestas[i]===oi?'selected':''}" data-i="${oi}"
            style="${this.respuestas[i]===oi?`border-color:${c};background:${c}22;color:${c};`:''}"
            onclick="HUB_TEST.elegir(${oi})">
            <span class="mt-opt-letra">${String.fromCharCode(65+oi)}</span>
            <span class="mt-opt-txt">${o}</span>
          </button>`).join('')}
      </div>
      <div class="mt-nav">
        <button class="mt-nav-btn" ${i===0?'disabled':''} onclick="HUB_TEST.anterior()">← Anterior</button>
        ${i<total-1
          ?`<button class="mt-nav-btn mt-nav-primary" style="background:${c};color:#000;" onclick="HUB_TEST.siguiente()">Siguiente →</button>`
          :`<button class="mt-nav-btn mt-nav-primary" style="background:${c};color:#000;" onclick="HUB_TEST.terminar()">✓ Terminar Evaluación</button>`}
      </div>`;
  },
  elegir(oi){this.respuestas[this.idx]=oi;this.render();},
  siguiente(){if(this.idx<TESTS_DATA[this.bloqueActual].preguntas.length-1){this.idx++;this.render();}},
  anterior(){if(this.idx>0){this.idx--;this.render();}},
  terminar(){
    const data=TESTS_DATA[this.bloqueActual];
    const sinResp=this.respuestas.findIndex(r=>r===null);
    if(sinResp!==-1){this.idx=sinResp;this.render();if(window.toast)toast('Responde la pregunta '+(sinResp+1));return;}
    let score=0;
    this.respuestas.forEach((r,i)=>{if(r===data.preguntas[i].ok)score++;});
    const total=data.preguntas.length;
    const res=HUB_PROGRESS.guardarResultadoTest(this.bloqueActual,score,total);
    this._mostrarResultado(score,total,res.pct,res.aprobado);
  },
  _mostrarResultado(score,total,pct,aprobado){
    const data=TESTS_DATA[this.bloqueActual];const c=data.color;
    document.getElementById('modalTestBody').innerHTML=`
      <div class="mt-result">
        <div class="mt-result-ico" style="background:${aprobado?'#22c55e22':'#ef444422'};border-color:${aprobado?'#22c55e':'#ef4444'};color:${aprobado?'#22c55e':'#ef4444'};">${aprobado?'🏆':'📚'}</div>
        <div class="mt-result-pct" style="color:${aprobado?'#22c55e':'#ef4444'};">${pct}%</div>
        <div class="mt-result-score">${score} de ${total} correctas</div>
        <div class="mt-result-msg" style="color:${aprobado?'#22c55e':'#ef4444'};">${aprobado?'¡APROBADA! Certificado desbloqueado 🎉':'No alcanzó el 70%. Repasa el bloque y vuelve a intentarlo.'}</div>
        <div class="mt-result-btns">
          ${aprobado
            ?`<button class="mt-result-btn" style="background:linear-gradient(135deg,#a07830,#c9a84c);color:#000;" onclick="HUB_TEST.cerrar();HUB_CERT.mostrar(${this.bloqueActual})">🏆 Ver Certificado</button>`
            :`<button class="mt-result-btn" style="background:${c};color:#000;" onclick="HUB_TEST.abrir(${this.bloqueActual})">🔄 Intentar de nuevo</button>`}
          <button class="mt-result-btn" style="background:transparent;border:1px solid #334155;color:#94a3b8;" onclick="HUB_TEST.cerrar()">Cerrar</button>
        </div>
      </div>`;
    if(aprobado&&window.HUB_TTS&&window.HUB_TTS._speak){
      window.HUB_TTS._speak(`¡Felicidades! Has aprobado con ${pct} por ciento. Tu certificado del bloque ${this.bloqueActual} ya está disponible para descargar. ¡Sigue así!`);
    }else if(window.HUB_TTS&&window.HUB_TTS._speak){
      window.HUB_TTS._speak(`Obtuviste ${pct} por ciento. Necesitas setenta para aprobar. Repasa el bloque y vuelve a intentarlo. ¡Tú puedes!`);
    }
    if(window.renderDashboard)window.renderDashboard();
  }
};

/* ═════════════════════════════════════════════════════════════════
   CERTIFICADO — PARCHE P2
   Descarga en PDF usando jsPDF puro.
   Sin html2canvas. Sin rutas externas. Sin CORS.
   La firma de Fátima Caldea está incrustada como base64.
   ═════════════════════════════════════════════════════════════════ */

/* Firma Fátima Caldea — PNG en base64 (fondo negro, trazo blanco/dorado) */
const FIRMA_B64 = 'data:image/png;base64,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';

/* ══ EMBLEMAS CENTRALES POR BLOQUE (sello del certificado) ══
   Colorimetría usa la rueda de color. Para los demás se dibuja un sello
   dorado genérico. Podés añadir más imágenes locales por número de bloque. */
const EMBLEMAS_SRC = { 1:'cert_emblema_corte.png', 2:'cert_emblema_colorimetria.png' };
const EMBLEMAS_IMG = {};
try{ Object.keys(EMBLEMAS_SRC).forEach(k=>{ const im=new Image(); im.src=EMBLEMAS_SRC[k]; EMBLEMAS_IMG[k]=im; }); }catch(_){}

/* Sello dorado genérico (cuando el bloque no tiene imagen propia) */
function dibujarSelloGenerico(doc, cx, cy, R, color){
  const hex=(color||'#a07830').replace('#','');
  const r=parseInt(hex.substring(0,2),16)||160, g=parseInt(hex.substring(2,4),16)||120, b=parseInt(hex.substring(4,6),16)||48;
  doc.setDrawColor(r,g,b);
  doc.setLineWidth(0.8); doc.circle(cx,cy,R,'S');
  doc.setLineWidth(0.3); doc.circle(cx,cy,R-2.2,'S');
  doc.setLineWidth(0.4);
  for(let i=0;i<24;i++){ const a=i*Math.PI/12; const r1=R-3.2, r2=R-4.6;
    doc.line(cx+Math.cos(a)*r1, cy+Math.sin(a)*r1, cx+Math.cos(a)*r2, cy+Math.sin(a)*r2); }
  doc.setLineWidth(0.3); doc.circle(cx,cy,R*0.30,'S');
}

/* ── Función principal: genera el PDF con jsPDF ── */
const HUB_CERT={
  mostrar(bloque){
    const cert=HUB_PROGRESS.data.certificados.find(c=>c.bloque===bloque);
    if(!cert){if(window.toast)toast('Primero aprueba el test del bloque');return;}
    const data=TESTS_DATA[bloque];
    const u=window.auth&&window.auth.currentUser;
    const nombre=u?(u.displayName||u.email.split('@')[0]||'Alumna Fátima Pro'):'Alumna Fátima Pro';
    const fecha=new Date(cert.fecha).toLocaleDateString('es-DO',{day:'numeric',month:'long',year:'numeric'});

    document.getElementById('modalCert').classList.add('open');
    const embSrc=EMBLEMAS_SRC[bloque]||'';
    const embHTML = embSrc
      ? `<div class="cert-emblema-zone"><img class="cert-emblema" src="${embSrc}" alt="emblema"></div>`
      : `<div class="cert-emblema-zone"><div class="cert-emblema-sello" style="border-color:${data.color};color:${data.color};">${data.ico}</div></div>`;
    document.getElementById('modalCertBody').innerHTML=`
      <button class="mt-close" style="position:absolute;top:14px;right:14px;z-index:5;" onclick="HUB_CERT.cerrar()">✕</button>
      <div class="cert-card" id="certCard">
        <div class="cert-border">
          <div class="cert-ornament cert-ornament-tl"></div>
          <div class="cert-ornament cert-ornament-tr"></div>
          <div class="cert-ornament cert-ornament-bl"></div>
          <div class="cert-ornament cert-ornament-br"></div>
          <div class="cert-inner">
            <div class="cert-brand">FÁTIMA PRO · ACADEMIA FÁTIMA CALDEA</div>
            <div class="cert-titulo">CERTIFICADO</div>
            <div class="cert-sub">DE APROBACIÓN PROFESIONAL</div>
            <div class="cert-divider">◆ ◆ ◆</div>
            <div class="cert-otorga">Se otorga el presente certificado a</div>
            <div class="cert-nombre">${nombre}</div>
            <div class="cert-otorga">por haber completado y aprobado satisfactoriamente la evaluación del</div>
            <div class="cert-bloque" style="color:${data.color};">${data.ico} ${data.titulo.replace('Evaluación · ','')}</div>
            <div class="cert-puntaje">Calificación obtenida: <strong style="color:#c9a84c;">${cert.pct}%</strong></div>
            ${embHTML}
            <div class="cert-firma-zone">
              <div class="cert-firma-col">
                <img class="cert-firma-img" src="firma-fatima.png" alt="Firma Fátima Caldea" onerror="this.style.display='none';this.nextElementSibling.style.display='block'">
                <div style="display:none;font-size:28px;font-family:Georgia,serif;color:#c9a84c;font-style:italic;margin-bottom:6px;">Fátima Caldea</div>
                <div class="cert-firma-line"></div>
                <div class="cert-firma-name-tipo">Fátima Caldea</div>
                <div class="cert-firma-cargo">Directora · Academia Fátima Pro</div>
              </div>
              <div class="cert-firma-col">
                <div class="cert-fecha-num">${fecha}</div>
                <div class="cert-firma-line"></div>
                <div class="cert-firma-cargo">Fecha de emisión</div>
              </div>
            </div>
            <div class="cert-folio">Folio: FCP-B${bloque}-${(u?u.uid:'000').slice(0,6).toUpperCase()}-${cert.fecha.replace(/-/g,'')}</div>
          </div>
        </div>
      </div>
      <div class="cert-actions">
        <button class="cert-btn cert-btn-primary" onclick="HUB_CERT.descargar(${bloque},'${nombre.replace(/'/g,"\\'")}','${fecha}',${cert.pct},'${u?u.uid:000}')">📥 Descargar PDF</button>
        <button class="cert-btn cert-btn-share" onclick="HUB_CERT.compartirWA(${bloque})">📲 Compartir WhatsApp</button>
        <button class="cert-btn cert-btn-volver" onclick="HUB_CERT.cerrar()">← Volver al sistema</button>
      </div>`;
  },
  cerrar(){document.getElementById('modalCert').classList.remove('open');},

  /* ══ PARCHE P2: descarga PDF con jsPDF — sin html2canvas, sin CORS ══ */
  descargar(bloque, nombre, fecha, pct, uid){
    if(typeof window.jspdf === 'undefined' && typeof jsPDF === 'undefined'){
      if(window.toast) toast('Cargando jsPDF, intenta en 3 segundos…');
      return;
    }
    const {jsPDF} = window.jspdf || {jsPDF: window.jsPDF};
    const doc = new jsPDF({orientation:'landscape', unit:'mm', format:'a4'});
    const W=297, H=210;

    // ── PARCHE P7: Fondo beige cálido profesional ──
    doc.setFillColor(255,248,231);
    doc.rect(0,0,W,H,'F');

    // ── Borde dorado doble ──
    doc.setDrawColor(160,120,48);
    doc.setLineWidth(1.5);
    doc.rect(8,8,W-16,H-16);
    doc.setLineWidth(0.4);
    doc.rect(11,11,W-22,H-22);

    // ── Ornamentos en esquinas ──
    const oc=12, os=18;
    doc.setLineWidth(1);
    doc.setDrawColor(160,120,48);
    // TL
    doc.line(oc,oc,oc+os,oc); doc.line(oc,oc,oc,oc+os);
    // TR
    doc.line(W-oc,oc,W-oc-os,oc); doc.line(W-oc,oc,W-oc,oc+os);
    // BL
    doc.line(oc,H-oc,oc+os,H-oc); doc.line(oc,H-oc,oc,H-oc-os);
    // BR
    doc.line(W-oc,H-oc,W-oc-os,H-oc); doc.line(W-oc,H-oc,W-oc,H-oc-os);

    // ── Header marca ──
    doc.setFont('helvetica','bold');
    doc.setFontSize(7);
    doc.setTextColor(140,100,30);
    doc.text('FÁTIMA PRO · ACADEMIA FÁTIMA CALDEA',W/2,26,{align:'center',charSpace:3});

    // ── Título principal ──
    doc.setFontSize(36);
    doc.setTextColor(140,100,30);
    doc.text('CERTIFICADO',W/2,50,{align:'center'});

    // ── Subtítulo ──
    doc.setFontSize(8);
    doc.setFont('helvetica','normal');
    doc.setTextColor(160,120,48);
    doc.text('DE APROBACIÓN PROFESIONAL',W/2,58,{align:'center',charSpace:4});

    // ── Divider ──
    doc.setFillColor(160,120,48);
    [-6,0,6].forEach(dx=>{ doc.circle(W/2+dx,64,0.9,'F'); });

    // ── "Se otorga a" ──
    doc.setFontSize(9);
    doc.setFont('helvetica','italic');
    doc.setTextColor(60,50,30);
    doc.text('Se otorga el presente certificado a',W/2,75,{align:'center'});

    // ── Nombre del alumno ──
    doc.setFont('helvetica','bold');
    doc.setFontSize(22);
    doc.setTextColor(30,20,10);
    doc.text(nombre,W/2,88,{align:'center'});
    // Línea bajo el nombre
    const nw=doc.getTextWidth(nombre);
    doc.setDrawColor(160,120,48);doc.setLineWidth(0.4);
    doc.line(W/2-nw/2-10,91,W/2+nw/2+10,91);

    // ── "por haber completado..." ──
    doc.setFont('helvetica','italic');
    doc.setFontSize(9);
    doc.setTextColor(80,65,40);
    doc.text('por haber completado y aprobado satisfactoriamente la evaluación del',W/2,99,{align:'center'});

    // ── Nombre del bloque ──
    const data=TESTS_DATA[bloque];
    doc.setFont('helvetica','bold');
    doc.setFontSize(14);
    const hex=data.color.replace('#','');
    const cr=parseInt(hex.substring(0,2),16),cg=parseInt(hex.substring(2,4),16),cb=parseInt(hex.substring(4,6),16);
    doc.setTextColor(cr,cg,cb);
    doc.text(data.titulo.replace('Evaluación · ',''),W/2,110,{align:'center'});

    // ── Calificación ──
    doc.setFont('helvetica','normal');
    doc.setFontSize(9);
    doc.setTextColor(60,50,30);
    doc.text(`Calificación obtenida:  ${pct}%`,W/2,120,{align:'center'});

    // ══ EMBLEMA / SELLO CENTRAL ══ (en el medio, entre las dos firmas)
    const EC=W/2, EY=141, ER=14;
    const emb=EMBLEMAS_IMG[bloque];
    if(emb && emb.complete && emb.naturalWidth>0){
      try{ doc.addImage(emb,'PNG',EC-ER,EY-ER,ER*2,ER*2); }catch(_){}
      doc.setDrawColor(160,120,48);
      doc.setLineWidth(0.8); doc.circle(EC,EY,ER+1.2,'S');
      doc.setLineWidth(0.3); doc.circle(EC,EY,ER+2.6,'S');
    } else {
      dibujarSelloGenerico(doc, EC, EY, ER+1, data.color);
    }

    // ── Líneas de firma ──
    const fy=148;
    const fx1=W/2-52;
    // Firma manuscrita real de Fátima Caldea (PNG sobre beige)
    try{ doc.addImage(FIRMA_B64,'PNG',fx1-24,fy-30,48,26); }catch(_){}
    doc.setDrawColor(160,120,48);doc.setLineWidth(0.5);
    doc.line(fx1-30,fy,fx1+30,fy);
    doc.setFont('helvetica','bold');
    doc.setFontSize(7);
    doc.setTextColor(140,100,30);
    doc.text('FÁTIMA CALDEA',fx1,fy+5,{align:'center',charSpace:1.5});
    doc.setFont('helvetica','normal');
    doc.setFontSize(7);
    doc.setTextColor(100,80,50);
    doc.text('Directora · Academia Fátima Pro',fx1,fy+10,{align:'center'});

    const fx2=W/2+52;
    doc.setDrawColor(160,120,48);doc.setLineWidth(0.5);
    doc.line(fx2-30,fy,fx2+30,fy);
    doc.setFont('helvetica','bold');
    doc.setFontSize(9);
    doc.setTextColor(30,20,10);
    doc.text(fecha,fx2,fy-5,{align:'center'});
    doc.setFont('helvetica','normal');
    doc.setFontSize(7);
    doc.setTextColor(100,80,50);
    doc.text('Fecha de emisión',fx2,fy+5,{align:'center'});

    // ── Folio ──
    const folio=`Folio: FCP-B${bloque}-${String(uid).slice(0,6).toUpperCase()}-${new Date().toISOString().slice(0,10).replace(/-/g,'')}`;
    doc.setFont('helvetica','normal');
    doc.setFontSize(6);
    doc.setTextColor(130,110,70);
    doc.text(folio,W/2,H-14,{align:'center',charSpace:1.5});

    // ── PARCHE P5: cerrar modal y volver a Mi Progreso tras descarga ──
    const nmFile=(nombre||'alumna').split(' ')[0].toLowerCase().replace(/[^a-z]/g,'');
    doc.save(`certificado-bloque${bloque}-${nmFile}.pdf`);
    if(window.toast) toast('✅ ¡Certificado descargado! Volviendo a tu progreso…');
    setTimeout(()=>{
      HUB_CERT.cerrar();
      if(window.cambiarBloque) cambiarBloque('progress');
    }, 1400);
  },

  compartirWA(bloque){
    const data=TESTS_DATA[bloque];
    const msg=`🏆 ¡Acabo de aprobar la evaluación de *${data.titulo.replace('Evaluación · ','')}* en Fátima Pro Academy! Estoy aprendiendo con la mejor 💖`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`,'_blank');
  }
};

/* ═════ DASHBOARD · Render del panel "Mi Progreso" ═════ */
function renderDashboard(){
  const panel=document.getElementById('panelDashboard');if(!panel)return;
  /* PARCHE P6: forzar recarga fresca desde localStorage antes de cada render */
  HUB_PROGRESS.load();
  HUB_PROGRESS._actualizarRacha();
  const d=HUB_PROGRESS.data;
  const racha=d.racha.dias||0;
  const certs=d.certificados||[];
  const pctGlobal=HUB_PROGRESS.pctTotal();
  const u=window.auth&&window.auth.currentUser;
  const nombre=u?(u.displayName||u.email.split('@')[0]):'Alumna';
  const ultimoBloque=d.ultimoBloqueVisto;
  const ultimoData=ultimoBloque?(window.BLOQUES_DATA||[]).find(b=>b.n===ultimoBloque):null;

  const cardsBloques=(window.BLOQUES_DATA||[]).map(b=>{
    const bd=d.bloques[b.n]||{};
    const test=bd.test||null;
    const cert=certs.find(c=>c.bloque===b.n);
    const pctBloque=(bd.visto?50:0)+(test&&test.aprobado?50:0);
    return`
      <div class="dash-bloque-card" style="border-color:${b.color}44;">
        <div class="dash-bloque-head">
          <div class="dash-bloque-ico" style="background:${b.color}22;color:${b.color};">${b.ico}</div>
          <div style="flex:1;min-width:0;">
            <div class="dash-bloque-num" style="color:${b.color};">BLOQUE ${b.n}</div>
            <div class="dash-bloque-tit">${b.nom}</div>
          </div>
          <div class="dash-bloque-pct" style="color:${b.color};">${pctBloque}%</div>
        </div>
        <div class="dash-bar"><div class="dash-fill" style="width:${pctBloque}%;background:${b.color};"></div></div>
        <div class="dash-bloque-meta">
          <span class="${bd.visto?'on':''}">📺 ${bd.visto?'Visto':'Sin ver'}</span>
          <span class="${test&&test.aprobado?'on':''}">📝 ${test?(test.aprobado?`Aprobado ${test.pct}%`:`No aprobado ${test.pct}%`):'Sin evaluar'}</span>
          <span class="${cert?'on':''}">🏆 ${cert?'Certificado':'Sin cert.'}</span>
        </div>
        <div class="dash-bloque-acts">
          <button class="dash-act dash-act-primary" style="background:${b.color};color:#000;" onclick="cambiarBloque(${b.n})">${bd.visto?'Repasar':'Empezar'} →</button>
          <button class="dash-act" style="border:1px solid ${b.color}55;color:${b.color};" onclick="HUB_TEST.abrir(${b.n})">📝 ${test?'Repetir':'Tomar'} Test</button>
          ${cert?`<button class="dash-act" style="border:1px solid #c9a84c55;color:#c9a84c;" onclick="HUB_CERT.mostrar(${b.n})">🏆 Certificado</button>`:''}
        </div>
      </div>`;
  }).join('');

  panel.innerHTML=`
    <div class="dash-hero">
      <div>
        <div class="dash-hero-saludo">Hola, ${nombre.split(' ')[0]} 👋</div>
        <div class="dash-hero-tit">Tu progreso en Fátima Pro</div>
        <div class="dash-hero-sub">${pctGlobal===100?'¡Has completado todo el programa! Eres oficialmente Maestra Fátima Pro 🏆':`Llevas ${pctGlobal}% del programa completo. ¡Sigue así!`}</div>
        <div class="dash-bar" style="margin-top:14px;max-width:420px;"><div class="dash-fill" style="width:${pctGlobal}%;background:linear-gradient(90deg,#a07830,#c9a84c);"></div></div>
      </div>
      <div class="dash-hero-stats">
        <div class="dash-stat"><div class="dash-stat-num" style="color:#f97316;">🔥 ${racha}</div><div class="dash-stat-lbl">Días seguidos</div></div>
        <div class="dash-stat"><div class="dash-stat-num" style="color:#c9a84c;">🏆 ${certs.length}/5</div><div class="dash-stat-lbl">Certificados</div></div>
        <div class="dash-stat"><div class="dash-stat-num" style="color:#22c55e;">${pctGlobal}%</div><div class="dash-stat-lbl">Progreso total</div></div>
      </div>
    </div>
    ${ultimoData?`
      <div class="dash-continuar" style="border-color:${ultimoData.color}55;">
        <div class="dash-continuar-ico" style="background:${ultimoData.color}22;color:${ultimoData.color};">${ultimoData.ico}</div>
        <div style="flex:1;min-width:0;">
          <div class="dash-continuar-lbl">Continuar donde quedaste</div>
          <div class="dash-continuar-tit">${ultimoData.nom}</div>
        </div>
        <button class="dash-act dash-act-primary" style="background:${ultimoData.color};color:#000;" onclick="cambiarBloque(${ultimoData.n})">Continuar →</button>
      </div>`:''}
    <div class="dash-section-tit">📚 Tus 5 Sistemas</div>
    <div class="dash-bloques-grid">${cardsBloques}</div>
    ${certs.length>0?`
      <div class="dash-section-tit" style="margin-top:32px;">🏆 Tus Certificados (${certs.length})</div>
      <div class="dash-certs-grid">
        ${certs.map(c=>{
          const b=(window.BLOQUES_DATA||[]).find(x=>x.n===c.bloque);
          return`<div class="dash-cert" style="border-color:#c9a84c55;" onclick="HUB_CERT.mostrar(${c.bloque})">
            <div class="dash-cert-ico">🏆</div>
            <div class="dash-cert-tit">${b?b.nom:'Bloque '+c.bloque}</div>
            <div class="dash-cert-pct">${c.pct}% · ${new Date(c.fecha).toLocaleDateString('es-DO')}</div>
            <div class="dash-cert-btn">Ver / Descargar PDF →</div>
          </div>`;
        }).join('')}
      </div>`:`
      <div class="dash-empty-certs">
        <div style="font-size:42px;margin-bottom:10px;">🎓</div>
        <div style="color:#c9a84c;font-weight:700;margin-bottom:6px;">Aún no tienes certificados</div>
        <div style="color:#64748b;font-size:11px;">Aprueba la evaluación de cualquier bloque con 70% o más y desbloquea tu primer certificado dorado.</div>
      </div>`}
  `;
}
window.renderDashboard=renderDashboard;

/* ═════ CHATBOX CONVERSACIONAL ═════ */
const HUB_CHAT={
  modo:'inicio',
  render(){
    const b=document.getElementById('cbBody');if(!b)return;
    if(this.modo==='inicio')this._inicio(b);
    else if(this.modo==='faq')this._faq(b);
    else if(this.modo==='comprar')this._comprar(b);
  },
  _inicio(b){
    const intro='¡Hola! Soy Fátima. Para acceder a los cursos y descargar las clases necesitas créditos. Cómpralos directo por WhatsApp con tu número de teléfono. Te respondo en minutos.';
    b.innerHTML=`
      <div class="cb-msg cb-msg-bot">
        <div class="cb-msg-name">Fátima</div>
        <div class="cb-msg-txt">¡Hola! Soy Fátima 💖 Para acceder a los cursos necesitas <strong style="color:#c9a84c;">créditos</strong>. Cómpralos por WhatsApp.</div>
        <button class="cb-msg-tts" onclick="HUB_TTS._speak(${JSON.stringify(intro)})">🔊 Escuchar</button>
      </div>
      <button class="cb-wa-big" onclick="abrirWADirecto('creditos')">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff" style="flex-shrink:0;"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413"/></svg>
        <span>COMPRAR CRÉDITOS POR WHATSAPP</span>
      </button>
      <div class="cb-wa-sub">💎 Pack 50 cr · $9.99  │  120 cr · $25.00</div>
      <div class="cb-quick">
        <button class="cb-chip cb-chip-gold" onclick="HUB_CHAT.modo='comprar';HUB_CHAT.render();">🎓 Acceder a un curso específico</button>
        <button class="cb-chip" onclick="HUB_CHAT.preguntar(1)">¿Cuánto cuestan los créditos?</button>
        <button class="cb-chip" onclick="HUB_CHAT.preguntar(3)">¿Cómo descargo una clase?</button>
        <button class="cb-chip" onclick="HUB_CHAT.preguntar(4)">¿Cómo obtengo el certificado?</button>
        <button class="cb-chip" onclick="HUB_CHAT.preguntar(0)">¿Cómo funciona el hub?</button>
        <button class="cb-chip" onclick="HUB_CHAT.modo='faq';HUB_CHAT.render();">📚 Ver más preguntas</button>
      </div>`;
  },
  _faq(b){
    b.innerHTML=`
      <div class="cb-back" onclick="HUB_CHAT.modo='inicio';HUB_CHAT.render();">← Volver</div>
      <div class="cb-label">📚 Preguntas frecuentes</div>
      <div class="cb-faq-list">
        ${FAQ_CHAT.map((f,i)=>`<button class="cb-faq-q" onclick="HUB_CHAT.preguntar(${i})">${f.q}</button>`).join('')}
      </div>`;
  },
  _comprar(b){
    const sistemas=[{n:1,ico:'✂️',nom:'Corte'},{n:2,ico:'🎨',nom:'Colorimetría'},{n:3,ico:'📚',nom:'Academia'},{n:4,ico:'🥗',nom:'Nutrición'},{n:5,ico:'💪',nom:'Fitness'}];
    const NV=window.NIVELES||[{id:'principiante',lbl:'Principiante',color:'#22c55e'},{id:'intermedio',lbl:'Intermedio',color:'#c9a84c'},{id:'avanzado',lbl:'Avanzado',color:'#ef4444'}];
    b.innerHTML=`
      <div class="cb-back" onclick="HUB_CHAT.modo='inicio';HUB_CHAT.render();">← Volver</div>
      <div class="cb-label">💳 Elige tu sistema y nivel → abre WhatsApp</div>
      ${sistemas.map(s=>`
        <div class="cb-sistem">
          <div class="cb-sistem-name">${s.ico} ${s.nom}</div>
          <div class="cb-btns">
            ${NV.map(nv=>`<button class="cb-btn" onclick="enviarWA(${s.n},'${nv.id}')">
              <span class="cb-btn-nivel" style="background:${nv.color}22;color:${nv.color};border:1px solid ${nv.color}44;">${nv.lbl}</span>
              ${nv.lbl} ${s.nom}</button>`).join('')}
          </div>
        </div>`).join('')}`;
  },
  preguntar(i){
    const f=FAQ_CHAT[i];if(!f)return;
    const b=document.getElementById('cbBody');
    b.innerHTML=`
      <div class="cb-back" onclick="HUB_CHAT.modo='inicio';HUB_CHAT.render();">← Inicio</div>
      <div class="cb-msg cb-msg-user"><div class="cb-msg-txt">${f.q}</div></div>
      <div class="cb-msg cb-msg-bot">
        <div class="cb-msg-name">Fátima</div>
        <div class="cb-msg-txt">${f.a}</div>
        <button class="cb-msg-tts" onclick="HUB_TTS._speak(${JSON.stringify(f.a)})">🔊 Escuchar respuesta</button>
      </div>
      <button class="cb-wa-big" onclick="abrirWADirecto('creditos')">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff" style="flex-shrink:0;"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413"/></svg>
        <span>COMPRAR CRÉDITOS Y ACCEDER AL CURSO</span>
      </button>
      <div class="cb-quick" style="margin-top:14px;">
        <button class="cb-chip" onclick="HUB_CHAT.modo='inicio';HUB_CHAT.render();">← Más preguntas</button>
        <button class="cb-chip cb-chip-gold" onclick="HUB_CHAT.modo='comprar';HUB_CHAT.render();">🎓 Elegir nivel y sistema</button>
      </div>`;
    setTimeout(()=>{HUB_TTS&&HUB_TTS._speak&&HUB_TTS._speak(f.a);},320);
  }
};
window.HUB_CHAT=HUB_CHAT;

/* ══ WHATSAPP DIRECTO ══ */
function _waNums(){return[atob('KzM0NjA0ODIyMjY1'),atob('KzU4NDE2MzE1MTE3MA==')];}
function _waElegirNumero(){
  const geo=(document.getElementById('geoBadge')?.textContent||'').toLowerCase();
  const nums=_waNums();
  if(/venezuela|colombia|ecuador|perú|peru|chile|argentina|méxico|mexico|panamá|panama|república dominicana|dominicana|cuba|bolivia|uruguay|paraguay|costa rica|guatemala|honduras|nicaragua|salvador|puerto rico/i.test(geo))return nums[1];
  return nums[0];
}
function abrirWADirecto(contexto,idx){
  const u=window.auth&&window.auth.currentUser;
  const nm=u?((u.displayName||'').split(' ')[0]||'Alumna'):'Alumna';
  const cr=(window.HUB&&HUB.leerCr)?HUB.leerCr():10;
  let msg=`¡Hola Fátima! 💎 Soy *${nm}* del Hub Fátima Pro.\n\nQuiero *comprar créditos* para seguir aprendiendo.`;
  if(contexto==='faq'&&typeof idx==='number'&&FAQ_CHAT[idx]) msg+=`\n\n_(Estaba viendo: ${FAQ_CHAT[idx].q})_`;
  msg+=`\n\nMis créditos actuales: *${cr} cr*\n\n¿Qué paquetes tienes disponibles y cómo pago? 💖\n\n_Enviado desde Fátima Pro Hub_`;
  const numero=_waElegirNumero().replace(/\D/g,'');
  const url=`https://wa.me/${numero}?text=${encodeURIComponent(msg)}`;
  if(window.toast)toast('💳 Abriendo WhatsApp para comprar créditos…');
  if(window.HUB_TTS&&HUB_TTS._speak)HUB_TTS._speak('Abriendo WhatsApp para comprar tus créditos');
  window.open(url,'_blank','noopener,noreferrer');
}
window.abrirWADirecto=abrirWADirecto;
window.HUB_TEST=HUB_TEST;
window.HUB_CERT=HUB_CERT;
window.HUB_PROGRESS=HUB_PROGRESS;

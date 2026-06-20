/* ════════════════════════════════════════════════════════════════
   PUENTE CATÁLOGO → M2 · MÓDULO 2 VIDEO
   Academia Fátima Caldea
   ----------------------------------------------------------------
   ARCHIVO NUEVO E INDEPENDIENTE. No modifica ni una línea de
   modulo2_video.html. Solo se agrega como <script> adicional al
   final de ese archivo.

   QUÉ HACE:
   Cuando el Catálogo de la biblioteca (biblioteca.js → catGenerarVideoEj)
   abre M2 con el ejercicio ya elegido, este puente:
     1) Lee el contexto que dejó la biblioteca en
        localStorage('fc_admin_target').
     2) Activa el Cerebro 1 · Fitness de M2 y selecciona los botones
        correctos (nivel, grupo, equipo, motor) — los MISMOS botones
        que ya existen en M2, simplemente los "toca" por código en
        vez de que la persona los toque a mano.
     3) Sobrescribe la etiqueta Firebase que M2 calcula por defecto
        (formato de imagen "grupo_motor_equipo_nej_v1") por la clave
        REAL de video sincronizada con el Bloque 5:
          dia{N}_{grupo}_{obj}_{equipo}_{nej}_{NN}_{slug}
     4) Pre-llena el campo de prompt libre con el prompt en inglés ya
        armado por el motor de conocimiento (si está disponible),
        para que la persona pueda usarlo de referencia o ajustarlo,
        sin tener que escribirlo de cero.

   QUÉ NO HACE (a propósito):
     - No toca generar(), callVideoEngine(), ni ningún motor de IA.
     - No toca enviarM4() / enviarItemM4() / enviarActualM4().
     - No toca el guardado en galería ni ningún flujo ya en producción.
     - No escribe nada en Firebase directamente.
   Es solo un "autocompletado" de entrada, nada más.
   ════════════════════════════════════════════════════════════════ */
(function(){
  'use strict';

  function leerContexto(){
    try{
      var raw = localStorage.getItem('fc_admin_target');
      if(!raw) return null;
      var data = JSON.parse(raw);
      // Solo nos interesa si viene del catálogo con un ejercicio de video
      if(!data || data.kind!=='vid' || data.tipo!=='ejercicio') return null;
      return data;
    }catch(e){ return null; }
  }

  /* Click "real" sobre los botones que ya existen en M2, usando las
     mismas funciones globales que M2 expone (setFN/setFG/setFE/setFM).
     Así no duplicamos lógica ni tocamos su CSS/estado interno. */
  function aplicarSelectoresFitness(ctx){
    if(typeof window.activarCerebro === 'function') window.activarCerebro('fitness');

    var mapaNivel = {6:'fn6', 8:'fn8', 12:'fn12'};
    var mapaGrupo = {gluteo:'fg-gluteo', pierna:'fg-pierna', superior:'fg-superior'};
    var mapaEquipo = {mancuerna:'fe-mancuerna', maquina:'fe-maquina', corporal:'fe-corporal'};
    var mapaMotor = {masa:'fm-masa', perder:'fm-perder', mantener:'fm-mantener'};

    var idN = mapaNivel[ctx.nej];
    var idG = mapaGrupo[ctx.grupo];
    var idE = mapaEquipo[ctx.equipo];
    var idM = mapaMotor[ctx.motor];

    if(idN && typeof window.setFN==='function'){ var elN=document.getElementById(idN); if(elN) window.setFN(elN, String(ctx.nej)); }
    if(idG && typeof window.setFG==='function'){ var elG=document.getElementById(idG); if(elG) window.setFG(elG, ctx.grupo); }
    if(idE && typeof window.setFE==='function'){ var elE=document.getElementById(idE); if(elE) window.setFE(elE, ctx.equipo); }
    if(idM && typeof window.setFM==='function'){ var elM=document.getElementById(idM); if(elM) window.setFM(elM, ctx.motor); }
  }

  /* Sobrescribe la etiqueta Firebase calculada por M2 (formato imagen)
     por la clave real de video del ejercicio, sincronizada con
     getClaseVideoClips() del Bloque 5. Prioriza la clave CON día
     porque es la que el Bloque 5 busca primero. */
  function aplicarEtiquetaVideo(ctx){
    var etiqueta = ctx.claveVideoConDia || ctx.claveVideoSinDia;
    if(!etiqueta) return;
    var elTxt = document.getElementById('fitEtiqueta');
    var elInput = document.getElementById('txtEtiqueta');
    if(elTxt) elTxt.textContent = etiqueta;
    if(elInput) elInput.value = etiqueta;
    if(window.MV) window.MV._fitEtiqueta = etiqueta;
  }

  /* Pre-llena el título con el nombre del ejercicio, para que la
     galería y el envío a M4 ya muestren un nombre legible. */
  function aplicarTitulo(ctx){
    var elTit = document.getElementById('txtTitulo');
    if(elTit && ctx.titulo) elTit.value = ctx.titulo;
  }

  /* Pre-llena el campo de prompt libre con el prompt en inglés que ya
     arma motor_conocimiento_fitness.js (si la biblioteca dejó ese
     motor cargado en esta misma sesión de navegador — si no, no pasa
     nada, M2 sigue funcionando con su Cerebro 1 normalmente). */
  function aplicarPromptSugerido(ctx){
    var elPrompt = document.getElementById('txtPrompt');
    if(!elPrompt || !ctx.ejercicio) return;
    // El motor de conocimiento no viaja entre pestañas, así que armamos
    // aquí un texto equivalente con los mismos datos del contexto.
    var grupoEn = {gluteo:'glutes and hips', pierna:'legs (quadriceps, hamstrings, calves)', superior:'upper body (chest, back, shoulders, arms)'}[ctx.grupo] || ctx.grupo;
    var equipoEn = {maquina:'using professional gym machines', mancuerna:'using dumbbells and free weights', corporal:'using bodyweight only, no equipment'}[ctx.equipo] || ctx.equipo;
    var motorEn = {masa:'hypertrophy training, heavy load, focused on building muscle mass', perder:'high-intensity metabolic training, focused on fat loss', mantener:'controlled strength-maintenance training'}[ctx.motor] || ctx.motor;
    var sugerido = 'Short video (6-10 seconds, perfect loop) of a real person with an athletic body performing the exercise "' + ctx.ejercicio.nombre + '" ' +
      'with perfect, controlled technique, training ' + grupoEn + ', ' + equipoEn + '. Training context: ' + motorEn + '. ' +
      'Fixed camera, 3/4 side angle, professional well-lit gym, cool studio lighting with neon blue/orange accents, vertical 9:16 format, no on-screen text, no watermark.';
    // No pisamos algo que la persona ya haya escrito manualmente en esta sesión.
    if(!elPrompt.value.trim()) elPrompt.value = sugerido;
    if(typeof window.updatePromptPreview === 'function') window.updatePromptPreview();
  }

  function avisar(ctx){
    var sb = document.getElementById('statusBar');
    if(sb) sb.innerHTML = '<span class="s-ok">✓ Contexto recibido del catálogo · Día '+ctx.dia+' · '+(ctx.ejercicio?ctx.ejercicio.nombre:'')+' · etiqueta lista</span>';
  }

  function init(){
    var ctx = leerContexto();
    if(!ctx) return; // M2 sigue funcionando 100% normal si no viene del catálogo

    // Pequeño retraso para asegurar que M2 ya terminó su propio init() interno
    setTimeout(function(){
      aplicarSelectoresFitness(ctx);
      aplicarEtiquetaVideo(ctx);
      aplicarTitulo(ctx);
      aplicarPromptSugerido(ctx);
      avisar(ctx);
    }, 150);
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

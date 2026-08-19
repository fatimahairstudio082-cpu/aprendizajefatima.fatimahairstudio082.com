/* ═══════════════════════════════════════════════════════════════════════════
   CEREBRO DE REDACCIÓN · Folletos Pro (Bloque 6)
   ───────────────────────────────────────────────────────────────────────────
   Escribe solo los textos del folleto: título, subtítulo, el nombre y la
   descripción de cada cuadro, el precio, la etiqueta, la llamada a la acción
   y el guion que leerá la voz.

   · 100% en el dispositivo. Sin claves, sin internet, sin coste.
   · Humanizado: las frases se construyen, no se copian de una lista fija.
     Ritmo variado, sin repetir pieza dentro del mismo folleto, y con el
     trato (tú / usted) coherente según el tono elegido.
   · Determinista: la misma semilla da el mismo folleto. El botón «Otra
     versión» sólo cambia la semilla.

   API pública:
     FOLLETO_CEREBRO.generar({rubro, tono, n, negocio, ciudad, semilla})
     FOLLETO_CEREBRO.regenerar(campo, ctx)
     FOLLETO_CEREBRO.rubros()  ·  FOLLETO_CEREBRO.tonos()
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if (window._B6_FOLLETO_CEREBRO_LOADED) return;
  window._B6_FOLLETO_CEREBRO_LOADED = true;

  /* ───────────────────────── Azar con semilla ───────────────────────── */

  function motorAzar(semilla) {
    var s = (semilla >>> 0) || 1;
    return function () {
      s += 0x6D2B79F5;
      var t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function uno(rng, lista) {
    return lista[Math.floor(rng() * lista.length) % lista.length];
  }

  /* Bolsa sin reposición: dentro de un mismo folleto no se repite ninguna
     pieza hasta que se han gastado todas. Es lo que evita que los 8 cuadros
     suenen al mismo texto. */
  function Bolsa(rng, lista) {
    this.rng = rng;
    this.origen = lista.slice();
    this.quedan = [];
  }
  Bolsa.prototype.coger = function () {
    if (!this.origen.length) return '';
    if (!this.quedan.length) {
      this.quedan = this.origen.slice();
      // barajado Fisher-Yates con la misma semilla
      for (var i = this.quedan.length - 1; i > 0; i--) {
        var j = Math.floor(this.rng() * (i + 1));
        var tmp = this.quedan[i]; this.quedan[i] = this.quedan[j]; this.quedan[j] = tmp;
      }
    }
    return this.quedan.pop();
  };

  /* ───────────────────────── Tonos de voz ───────────────────────── */

  var TONOS = {
    elegante: {
      nombre: 'Elegante',
      trato: 'usted',
      ritmo: ['medio', 'largo', 'medio', 'corto'],
      cierres: [
        'Siempre con cita previa.',
        'El tiempo de cada sesión se reserva en exclusiva.',
        'Le asesoramos antes de empezar.',
        'Sin prisas y con el detalle cuidado.'
      ],
      ctas: ['Reserve su cita', 'Consúltenos', 'Pida hora', 'Le esperamos'],
      remates: ['Un trabajo hecho con criterio.', 'Calidad que se nota al tacto.']
    },
    cercano: {
      nombre: 'Cercano',
      trato: 'tu',
      ritmo: ['corto', 'medio', 'corto', 'largo'],
      cierres: [
        'Te lo explicamos todo antes de empezar.',
        'Y si tienes dudas, preguntas y ya está.',
        'Sales sabiendo cómo mantenerlo en casa.',
        'Aquí se viene a estar a gusto.'
      ],
      ctas: ['Pide tu cita', 'Escríbenos', 'Te esperamos', 'Reserva tu hueco'],
      remates: ['Como te gusta a ti.', 'Sencillo y bien hecho.']
    },
    vendedor: {
      nombre: 'Vendedor',
      trato: 'tu',
      ritmo: ['corto', 'corto', 'medio', 'medio'],
      cierres: [
        'Plazas limitadas cada semana.',
        'Precio cerrado, sin sorpresas.',
        'Incluye el diagnóstico previo.',
        'Reserva antes de que se llene.'
      ],
      ctas: ['Reserva hoy', 'Aprovecha ya', 'Coge tu cita', 'Últimas plazas'],
      remates: ['Al mejor precio del mes.', 'Resultado garantizado.']
    },
    informativo: {
      nombre: 'Informativo',
      trato: 'neutro',
      ritmo: ['medio', 'medio', 'largo', 'medio'],
      cierres: [
        'Duración aproximada de una hora.',
        'Incluye lavado, tratamiento y peinado.',
        'Se recomienda repetir cada seis semanas.',
        'Apto para todo tipo de cabello.'
      ],
      ctas: ['Más información', 'Consultar disponibilidad', 'Ver horarios', 'Solicitar cita'],
      remates: ['Servicio realizado por profesional titulado.', 'Producto profesional incluido.']
    },
    lujo: {
      nombre: 'Lujo',
      trato: 'usted',
      ritmo: ['corto', 'corto', 'corto', 'medio'],
      cierres: [
        'Sólo con reserva.',
        'Atención personal, de principio a fin.',
        'Producto de alta gama.',
        'Su tiempo, en exclusiva.'
      ],
      ctas: ['Reserve', 'Solicite su cita', 'Atención exclusiva', 'Agenda privada'],
      remates: ['Excelencia, sin atajos.', 'El detalle lo es todo.']
    }
  };

  /* ───────────────────────── Bancos por rubro ─────────────────────────
     Cada servicio: n = nombre · p = [precio mín, máx] · d = variantes de
     descripción escritas a mano (de ahí sale que no suene a plantilla).   */

  var RUBROS = {

    peluqueria: {
      nombre: 'Peluquería',
      titulos: ['Carta de Servicios', 'Nuestro Salón', 'Tu Pelo, a Punto', 'Servicios de Peluquería'],
      subs: ['Corte, color y cuidado con criterio profesional',
             'Trabajamos cada cabello según lo que necesita',
             'Del diagnóstico al peinado final',
             'Un salón para venir con tiempo'],
      serv: [
        { n: 'Corte con asesoría', p: [18, 30], d: [
          'Miramos tu cara y tu tipo de pelo antes de tocar las tijeras.',
          'Un corte pensado para ti, que aguanta bien entre visita y visita.'] },
        { n: 'Lavado y peinado', p: [12, 22], d: [
          'Lavado con masaje y secado con forma, para salir a la calle.',
          'El peinado que necesitas cuando tienes algo que celebrar.'] },
        { n: 'Color de raíz', p: [28, 45], d: [
          'Cubre la raíz sin cambiar el tono que ya llevas.',
          'Retoque limpio de raíz, respetando el largo trabajado.'] },
        { n: 'Recogido de fiesta', p: [35, 60], d: [
          'Recogidos que aguantan toda la noche sin recolocarse.',
          'Lo probamos antes del día señalado, para ir sobre seguro.'] },
        { n: 'Tratamiento de brillo', p: [20, 38], d: [
          'Sella la fibra y devuelve el brillo que se pierde con el tiempo.',
          'Media hora que cambia cómo refleja la luz tu pelo.'] },
        { n: 'Corte infantil', p: [10, 16], d: [
          'Con paciencia y sin prisas, para que no sea un mal rato.',
          'Rápido, cómodo y con la forma que le queda bien.'] },
        { n: 'Alisado de queratina', p: [60, 120], d: [
          'Domina el encrespado durante meses, sin dejarlo lacio del todo.',
          'Menos secador cada mañana y el pelo más manejable.'] },
        { n: 'Tratamiento anticaída', p: [30, 55], d: [
          'Trabajamos el cuero cabelludo, que es donde está el problema.',
          'Sesiones pautadas y revisión al mes para ver si responde.'] }
      ]
    },

    color: {
      nombre: 'Color',
      titulos: ['Carta de Color', 'Servicios de Coloración', 'Color a Medida', 'Tu Color, Bien Hecho'],
      subs: ['Colorimetría con diagnóstico previo',
             'Cada fórmula se calcula para tu base real',
             'Color que respeta la salud del cabello',
             'Del tono soñado al tono posible, y bien'],
      serv: [
        { n: 'Color completo', p: [40, 70], d: [
          'Fórmula calculada sobre tu base real, no sobre la foto.',
          'Cambiamos el tono de raíz a puntas con una sola aplicación.'] },
        { n: 'Corrección de color', p: [60, 120], d: [
          'Arreglamos naranjas, verdes y tirones de tinte anterior.',
          'Trabajo por fases: primero sanear, después igualar el tono.'] },
        { n: 'Matiz y tonalizado', p: [18, 35], d: [
          'Quita el amarillo y devuelve el tono frío que buscabas.',
          'Un matiz cada pocas semanas mantiene el rubio limpio.'] },
        { n: 'Cobertura de canas', p: [30, 50], d: [
          'Cobertura completa con un resultado natural, no plano.',
          'Elegimos el reflejo para que la cana no vuelva a marcar.'] },
        { n: 'Diagnóstico capilar', p: [0, 15], d: [
          'Miramos porosidad, base y qué aguanta tu pelo antes de decidir.',
          'Media hora de estudio que ahorra disgustos y dinero.'] },
        { n: 'Color fantasía', p: [55, 110], d: [
          'Tonos vivos con la decoloración controlada y por pasos.',
          'Del pastel al intenso, midiendo lo que el cabello soporta.'] },
        { n: 'Baño de color', p: [20, 38], d: [
          'Da brillo y aviva el tono sin usar amoniaco.',
          'Ideal entre color y color, cuando el pelo pide descanso.'] },
        { n: 'Decoloración global', p: [70, 140], d: [
          'Aclarado completo por fases, vigilando la fibra en cada paso.',
          'El cambio grande, hecho con cabeza y con protector.'] }
      ]
    },

    mechas: {
      nombre: 'Mechas y balayage',
      titulos: ['Mechas y Balayage', 'Nuestras Técnicas de Luz', 'Carta de Mechas', 'Luz en tu Pelo'],
      subs: ['Técnicas de aclarado con la fibra cuidada',
             'Luz que crece bonita y sin raíz marcada',
             'Balayage, babylights, mechas y contrastes',
             'Aclarados progresivos, sin castigar el cabello'],
      serv: [
        { n: 'Balayage', p: [70, 130], d: [
          'Luz pintada a mano que crece sin dejar raíz marcada.',
          'Barrido natural, más claro en puntas y suave en la raíz.'] },
        { n: 'Babylights', p: [65, 120], d: [
          'Mechas finísimas que imitan el pelo aclarado por el sol.',
          'Da luz sin que se note la técnica; el efecto es de niña.'] },
        { n: 'Mechas californianas', p: [60, 110], d: [
          'Degradado de medios a puntas, con el largo iluminado.',
          'Ideal si quieres cambio pero sin mantenimiento mensual.'] },
        { n: 'Mechas con papel', p: [50, 90], d: [
          'Aclarado más marcado y uniforme, de raíz a puntas.',
          'Control total del nivel de aclarado en cada mecha.'] },
        { n: 'Retoque de raíz aclarada', p: [45, 80], d: [
          'Mantiene la mecha viva sin repetir todo el largo.',
          'Sólo se trabaja el crecimiento, que es lo que se ve.'] },
        { n: 'Baño de color post-mecha', p: [20, 35], d: [
          'Cierra la cutícula y fija el tono recién aclarado.',
          'El paso que hace que el rubio dure limpio más semanas.'] },
        { n: 'Corrección de mechas', p: [70, 130], d: [
          'Igualamos mechas anchas, manchadas o con la raíz cortada.',
          'Se rescata lo que hay antes de volver a aclarar.'] },
        { n: 'Iluminación de contorno', p: [40, 75], d: [
          'Luz sólo alrededor de la cara, que es donde más se ve.',
          'Cambio pequeño y barato con efecto grande en la foto.'] }
      ]
    },

    unas: {
      nombre: 'Uñas',
      titulos: ['Carta de Manicura', 'Uñas y Cuidado de Manos', 'Nuestros Servicios de Uñas', 'Manos a Punto'],
      subs: ['Manicura, esmaltado y uña esculpida',
             'Trabajo cuidado, con material esterilizado',
             'Del cuidado básico al diseño completo',
             'Uñas que duran y manos cuidadas'],
      serv: [
        { n: 'Manicura completa', p: [15, 25], d: [
          'Limado, cutícula y esmaltado, con las manos hidratadas.',
          'La base de todo: uña sana antes que uña bonita.'] },
        { n: 'Esmaltado semipermanente', p: [18, 30], d: [
          'Color que aguanta tres semanas sin saltarse.',
          'Brillo de primer día durante todo el mes.'] },
        { n: 'Uñas esculpidas', p: [35, 60], d: [
          'Largo y forma a medida, con acabado resistente.',
          'Estructura bien hecha: ni pesan ni se despegan.'] },
        { n: 'Relleno de uñas', p: [25, 40], d: [
          'Mantenimiento cada tres o cuatro semanas.',
          'Se rellena el crecimiento y se revisa la forma.'] },
        { n: 'Nail art', p: [5, 20], d: [
          'Diseños a mano, desde la línea fina al degradado.',
          'Desde un detalle discreto hasta la uña completa.'] },
        { n: 'Pedicura spa', p: [25, 40], d: [
          'Baño, exfoliación, durezas y esmaltado, con masaje.',
          'Una hora de descanso que además se nota al andar.'] },
        { n: 'Manicura rusa', p: [25, 40], d: [
          'Cutícula trabajada al detalle, con acabado muy limpio.',
          'El esmaltado llega al borde y por eso dura más.'] },
        { n: 'Retirada de esmaltado', p: [8, 15], d: [
          'Se quita sin limar de más ni castigar la uña.',
          'Mejor esto que arrancarlo en casa, que deja la uña fina.'] }
      ]
    },

    maquillaje: {
      nombre: 'Maquillaje',
      titulos: ['Servicios de Maquillaje', 'Maquillaje Profesional', 'Tu Día, tu Cara', 'Carta de Maquillaje'],
      subs: ['Maquillaje social, de novia y de fotografía',
             'Producto profesional de larga duración',
             'Prueba previa incluida en los eventos',
             'Te maquillamos y te enseñamos a hacerlo'],
      serv: [
        { n: 'Maquillaje de día', p: [25, 40], d: [
          'Piel luminosa y natural, para que sigas siendo tú.',
          'Lo justo para verte descansada sin parecer maquillada.'] },
        { n: 'Maquillaje de noche', p: [35, 55], d: [
          'Ojo trabajado y fijado para aguantar hasta el final.',
          'Intensidad medida, que se ve bien en foto y en persona.'] },
        { n: 'Maquillaje de novia', p: [80, 160], d: [
          'Con prueba previa, para llegar al día sin sorpresas.',
          'Larga duración, resistente a lágrimas y a horas de fotos.'] },
        { n: 'Clase de automaquillaje', p: [40, 70], d: [
          'Aprendes con tus productos y sobre tu propia cara.',
          'Sales sabiendo repetirlo sola en veinte minutos.'] },
        { n: 'Diseño de cejas', p: [12, 22], d: [
          'La forma cambia la mirada más que cualquier otra cosa.',
          'Medimos la cara y respetamos el grosor natural.'] },
        { n: 'Pestañas postizas', p: [10, 25], d: [
          'Pelo a pelo o en tira, según lo que aguante tu ojo.',
          'Colocación cómoda, que no pesa ni molesta.'] },
        { n: 'Maquillaje de fotografía', p: [50, 95], d: [
          'Preparado para el flash: sin brillos ni polvos que reboten.',
          'Lo que se ve raro en persona es lo que sale bien en foto.'] },
        { n: 'Asesoría de color', p: [25, 45], d: [
          'Qué tonos te encienden la cara y cuáles te apagan.',
          'Sales con tu carta de colores y dejas de fallar comprando.'] }
      ]
    },

    estetica: {
      nombre: 'Estética facial',
      titulos: ['Cabina Facial', 'Tratamientos de Estética', 'Cuidado de tu Piel', 'Carta de Cabina'],
      subs: ['Limpieza, hidratación y tratamiento de cabina',
             'Protocolos según el tipo de piel',
             'Resultados que se ven desde la primera sesión',
             'Diagnóstico de piel antes de cada protocolo'],
      serv: [
        { n: 'Limpieza facial profunda', p: [30, 50], d: [
          'Extracción cuidadosa y piel calmada al terminar.',
          'El tratamiento que descongestiona y prepara la piel.'] },
        { n: 'Hidratación intensiva', p: [35, 55], d: [
          'Devuelve agua y confort a la piel tirante.',
          'Se nota al tacto el mismo día de la sesión.'] },
        { n: 'Tratamiento antiedad', p: [45, 80], d: [
          'Trabaja firmeza y líneas finas por sesiones.',
          'Protocolo progresivo, con resultados acumulativos.'] },
        { n: 'Peeling facial', p: [40, 70], d: [
          'Renueva la superficie y unifica el tono.',
          'Menos marcas, más luz, con la piel protegida después.'] },
        { n: 'Presoterapia facial', p: [25, 45], d: [
          'Descongestiona y desinflama la zona de ojos y mandíbula.',
          'Ideal cuando la cara amanece hinchada.'] },
        { n: 'Bono de 5 sesiones', p: [150, 300], d: [
          'El precio por sesión baja y el resultado se sostiene.',
          'Constancia: es lo que de verdad cambia una piel.'] },
        { n: 'Radiofrecuencia facial', p: [45, 85], d: [
          'Calor controlado que trabaja firmeza en óvalo y cuello.',
          'No duele y se puede volver a la calle al terminar.'] },
        { n: 'Tratamiento antimanchas', p: [45, 80], d: [
          'Aclara la mancha y evita que vuelva con protección diaria.',
          'Requiere constancia y sombra: sin eso no hay resultado.'] }
      ]
    },

    barberia: {
      nombre: 'Barbería',
      titulos: ['Carta de Barbería', 'Servicios de Caballero', 'Barbería Clásica', 'Corte y Barba'],
      subs: ['Corte, barba y afeitado a navaja',
             'Trabajo clásico con producto profesional',
             'Sin cita larga: entras y sales a punto',
             'Del degradado al afeitado tradicional'],
      serv: [
        { n: 'Corte de caballero', p: [12, 20], d: [
          'Tijera y máquina, con el remate de cuello a navaja.',
          'La forma que te va, y que se mantiene sola tres semanas.'] },
        { n: 'Degradado', p: [14, 22], d: [
          'Transición limpia, sin escalones ni cortes de luz.',
          'Del cero al largo, con el degradado a la altura que pidas.'] },
        { n: 'Arreglo de barba', p: [10, 18], d: [
          'Perfilado, largo igualado y aceite al terminar.',
          'La barba deja de parecer descuidada en quince minutos.'] },
        { n: 'Afeitado a navaja', p: [15, 25], d: [
          'Toalla caliente, navaja y bálsamo. El clásico.',
          'Apurado de verdad, con la piel calmada después.'] },
        { n: 'Corte + barba', p: [20, 32], d: [
          'El pack completo, salir listo de una sentada.',
          'Cara y pelo a juego, que es como se nota.'] },
        { n: 'Corte infantil', p: [9, 14], d: [
          'Con paciencia y buen rollo, para que vuelva contento.',
          'Rápido y sin líos, con el resultado que él quiere.'] },
        { n: 'Perfilado de cejas', p: [6, 12], d: [
          'Se quita lo que sobra sin que se note que estás depilado.',
          'Cinco minutos que cambian la cara más de lo que parece.'] },
        { n: 'Coloración de canas', p: [15, 30], d: [
          'Rebaja la cana sin dejarla de un color plano.',
          'Se difumina, no se tapa: queda natural.'] }
      ]
    },

    nutricion: {
      nombre: 'Nutrición',
      titulos: ['Plan de Nutrición', 'Asesoría Nutricional', 'Come Mejor', 'Nuestros Planes'],
      subs: ['Planes reales, para vidas reales',
             'Sin dietas milagro ni pasar hambre',
             'Acompañamiento y seguimiento semanal',
             'Cambios que se sostienen en el tiempo'],
      serv: [
        { n: 'Primera consulta', p: [30, 55], d: [
          'Hablamos de tus horarios, tus gustos y tu punto de partida.',
          'De aquí sale el plan; sin esto, cualquier dieta es a ciegas.'] },
        { n: 'Plan semanal', p: [25, 45], d: [
          'Menú cerrado con lista de la compra incluida.',
          'Comida normal, de supermercado, que se cocina rápido.'] },
        { n: 'Seguimiento mensual', p: [20, 40], d: [
          'Ajustamos el plan según lo que ha funcionado.',
          'Lo que no encaja en tu vida se cambia, no se aguanta.'] },
        { n: 'Educación nutricional', p: [25, 45], d: [
          'Aprendes a leer etiquetas y a montar tu propio plato.',
          'El objetivo es que dejes de necesitarnos.'] },
        { n: 'Plan deportivo', p: [35, 60], d: [
          'Comida ajustada a tus entrenamientos y descansos.',
          'Rendir mejor sin vivir contando gramos.'] },
        { n: 'Bono trimestral', p: [90, 180], d: [
          'Tres meses de acompañamiento con revisiones incluidas.',
          'El tiempo que hace falta para que se vuelva costumbre.'] },
        { n: 'Estudio de composición', p: [20, 40], d: [
          'Miramos músculo, grasa y agua, no sólo lo que marca la báscula.',
          'El número del peso solo, sin esto, engaña.'] },
        { n: 'Plan vegetariano', p: [25, 50], d: [
          'Proteína y hierro cubiertos, sin carne y sin suplementos raros.',
          'Menús completos, pensados para no quedarse corta.'] }
      ]
    },

    fitness: {
      nombre: 'Fitness',
      titulos: ['Entrenamiento', 'Nuestras Clases', 'Muévete con Nosotras', 'Plan de Entrenamiento'],
      subs: ['Rutinas por nivel, con la técnica cuidada',
             'Grupos pequeños y corrección individual',
             'Entrena en casa o en sala, tú eliges',
             'Progresión medida, sin lesiones'],
      serv: [
        { n: 'Entrenamiento personal', p: [25, 45], d: [
          'Una hora sólo para ti, con la técnica corregida.',
          'El plan se adapta a tus molestias y a tu ritmo.'] },
        { n: 'Clase en grupo', p: [8, 15], d: [
          'Grupos pequeños, para que nadie entrene sin mirar.',
          'Sesiones de una hora con calentamiento y vuelta a la calma.'] },
        { n: 'Rutina para casa', p: [15, 30], d: [
          'Sin material o con lo mínimo, en veinte minutos.',
          'Pensada para hacerla los días que no da tiempo a nada.'] },
        { n: 'Suelo pélvico y core', p: [20, 35], d: [
          'Trabajo profundo que se nota en la postura y en el día a día.',
          'Especialmente indicado después del embarazo.'] },
        { n: 'Valoración inicial', p: [0, 20], d: [
          'Miramos movilidad, fuerza y de dónde partes.',
          'Sin valoración no hay progresión, sólo suerte.'] },
        { n: 'Bono mensual', p: [40, 80], d: [
          'Entrenas las veces que quieras dentro del mes.',
          'Sale a cuenta desde la tercera sesión.'] },
        { n: 'Clase de estiramientos', p: [8, 16], d: [
          'Media hora que te quita la espalda cargada del trabajo.',
          'Movilidad de verdad, no cuatro estiramientos sueltos.'] },
        { n: 'Plan de fuerza', p: [30, 60], d: [
          'Progresión por semanas, con las cargas anotadas.',
          'Ganar fuerza es lo que sostiene todo lo demás.'] }
      ]
    },

    cursos: {
      nombre: 'Cursos y academia',
      titulos: ['Formación Profesional', 'Nuestros Cursos', 'Aprende con Nosotras', 'Academia'],
      subs: ['Formación práctica con modelo real',
             'Plazas limitadas y material incluido',
             'De cero a trabajar: temario completo',
             'Certificado al terminar cada módulo'],
      serv: [
        { n: 'Curso de colorimetría', p: [180, 400], d: [
          'Aprendes a calcular la fórmula, no a copiarla.',
          'Base, reflejo, volumen y neutralización, con práctica.'] },
        { n: 'Curso de mechas', p: [200, 450], d: [
          'Balayage, babylights y papel, sobre cabeza real.',
          'Sales con la técnica en la mano, no sólo en apuntes.'] },
        { n: 'Curso de corte', p: [150, 350], d: [
          'Las bases geométricas que sirven para cualquier corte.',
          'Tijera, navaja y máquina, con corrección constante.'] },
        { n: 'Curso de uñas', p: [180, 380], d: [
          'Del limado a la esculpida, con material profesional.',
          'Prácticas suficientes para coger velocidad.'] },
        { n: 'Módulo de bioseguridad', p: [60, 120], d: [
          'Higiene, esterilización y protocolo, que es lo que te protege.',
          'Obligatorio si quieres trabajar en serio.'] },
        { n: 'Clase suelta', p: [40, 90], d: [
          'Una técnica concreta en una tarde.',
          'Para reciclarte sin meterte en un curso entero.'] },
        { n: 'Curso de recogidos', p: [150, 320], d: [
          'Base, sujeción y acabado, que es lo que aguanta la noche.',
          'Novias, comuniones y fiesta, con práctica sobre cabeza.'] },
        { n: 'Curso de barbería', p: [180, 400], d: [
          'Degradados, navaja y barba, de cero a soltarse.',
          'Mucha máquina en la mano, poco apunte.'] }
      ]
    },

    ofertas: {
      nombre: 'Promociones',
      titulos: ['Promociones del Mes', 'Ofertas Especiales', 'Packs y Descuentos', 'Este Mes en el Salón'],
      subs: ['Precios cerrados durante todo el mes',
             'Packs pensados para ahorrar de verdad',
             'Sólo con cita previa y hasta fin de existencias',
             'Las combinaciones que más nos piden'],
      serv: [
        { n: 'Pack corte + color', p: [45, 75], d: [
          'Los dos servicios en la misma cita y a mejor precio.',
          'Ahorras tiempo y ahorras dinero, en una tarde.'] },
        { n: 'Pack novia', p: [120, 250], d: [
          'Prueba, peinado y maquillaje del día, cerrado.',
          'Todo el día señalado resuelto con una sola reserva.'] },
        { n: 'Martes de manicura', p: [12, 20], d: [
          'Precio especial de manicura todos los martes.',
          'El día tranquilo de la semana, al mejor precio.'] },
        { n: 'Trae a una amiga', p: [0, 15], d: [
          'Las dos os lleváis descuento en el servicio.',
          'Venir acompañada sale más barato para las dos.'] },
        { n: 'Bono de 5 servicios', p: [90, 200], d: [
          'Pagas cuatro y te llevas cinco.',
          'Sin caducidad corta: lo gastas cuando puedes.'] },
        { n: 'Primera visita', p: [0, 20], d: [
          'Diagnóstico gratuito si es tu primera vez aquí.',
          'Nos conocemos sin compromiso y decides después.'] },
        { n: 'Pack madre e hija', p: [40, 90], d: [
          'Las dos en la misma cita, cada una con lo suyo.',
          'Una tarde juntas y las dos salís arregladas.'] },
        { n: 'Bono de cabina', p: [100, 220], d: [
          'Cinco sesiones de facial al precio de cuatro.',
          'La piel cambia con la serie, no con una sesión suelta.'] }
      ]
    },

    salon: {
      nombre: 'Salón (general)',
      titulos: ['Nuestro Salón', 'Todo lo que Hacemos', 'Servicios', 'Bienvenida'],
      subs: ['Peluquería, estética y uñas en un mismo sitio',
             'Todo tu cuidado, con una sola cita',
             'Equipo formado y producto profesional',
             'Un espacio para cuidarte con calma'],
      serv: [
        { n: 'Peluquería', p: [15, 60], d: [
          'Corte, color y tratamiento, con diagnóstico antes.',
          'Desde el retoque rápido al cambio completo.'] },
        { n: 'Estética facial', p: [30, 70], d: [
          'Cabina con protocolos según tu tipo de piel.',
          'Limpieza, hidratación y antiedad por sesiones.'] },
        { n: 'Manicura y pedicura', p: [15, 40], d: [
          'Manos y pies cuidados, con material esterilizado.',
          'Del cuidado básico al esmaltado que dura semanas.'] },
        { n: 'Depilación', p: [8, 35], d: [
          'Cera tibia por zonas, rápida y con la piel calmada.',
          'Tratamos la piel antes y después, no sólo el pelo.'] },
        { n: 'Novias y eventos', p: [80, 200], d: [
          'Prueba previa y todo el día resuelto.',
          'Peinado, maquillaje y uñas coordinados.'] },
        { n: 'Asesoría de imagen', p: [30, 60], d: [
          'Qué te favorece y por qué, explicado con calma.',
          'Color, forma y mantenimiento realista para tu día a día.'] },
        { n: 'Tratamiento capilar', p: [25, 60], d: [
          'Elegimos el tratamiento según lo que le falte a tu pelo.',
          'Hidratación, proteína o cuero cabelludo: no es lo mismo.'] },
        { n: 'Maquillaje social', p: [25, 55], d: [
          'Para la boda, la cena o la foto que te toca.',
          'Aguanta las horas y sigue pareciendo tu cara.'] }
      ]
    }
  };

  var ETIQUETAS = ['Nuevo', 'Top ventas', 'Lo más pedido', 'Recomendado', 'Plazas limitadas', '-20%', 'Oferta'];

  /* ───────────────────────── Utilidades de texto ───────────────────────── */

  /* Precios "de salón": ni 37,42 € ni cifras redondas siempre. */
  function precio(rng, rango) {
    var min = rango[0], max = rango[1];
    if (max <= 0) return 'Gratis';
    if (min <= 0) return rng() < 0.5 ? 'Gratis' : (Math.round(max / 5) * 5) + '€';
    var escalones = [];
    for (var v = Math.ceil(min / 5) * 5; v <= max; v += 5) escalones.push(v);
    if (!escalones.length) escalones = [Math.round((min + max) / 2)];
    var p = uno(rng, escalones);
    // de vez en cuando, el clásico terminado en 9
    if (rng() < 0.22 && p > 15) p = p - 1;
    return p + '€';
  }

  function primeraFrase(txt) {
    var i = txt.indexOf('. ');
    return i > 0 ? txt.slice(0, i + 1) : txt;
  }

  /* El ritmo es lo que más delata a una máquina: si todas las descripciones
     miden lo mismo, suena a formulario. Alternamos a propósito. */
  function descripcion(bolsas, servicio, tono, largo) {
    var base = bolsas.desc[servicio.n] ? bolsas.desc[servicio.n].coger() : uno(bolsas.rng, servicio.d);
    if (largo === 'corto') return primeraFrase(base);
    if (largo === 'largo') return base + ' ' + bolsas.cierres.coger();
    return base;
  }

  /* Verbos en segunda persona que de verdad aparecen en el banco de textos.
     Sólo se listan los que no pueden confundirse con un sustantivo: «dudas»,
     «marcas», «partes» o «prisas» se quedan fuera a propósito. */
  var VERBOS_USTED = {
    ahorras: 'ahorra', aprendes: 'aprende', buscabas: 'buscaba', decides: 'decide',
    dejas: 'deja', dejes: 'deje', entrenas: 'entrena', gastas: 'gasta',
    llevas: 'lleva', necesitas: 'necesita', pagas: 'paga', pidas: 'pida',
    puedes: 'puede', quieras: 'quiera', quieres: 'quiere', sales: 'sale',
    sigas: 'siga', tienes: 'tiene'
  };

  /* Pasar de «tú» a «usted». El orden importa: «te lo» se convierte en
     «se lo», no en «le lo», que es lo que salía antes y no es español. */
  function trato(texto, tono) {
    if (!TONOS[tono] || TONOS[tono].trato !== 'usted') return texto;
    return texto
      .replace(/\b(\w+)\b/g, function (m) {
        var bajo = m.toLowerCase();
        if (!VERBOS_USTED[bajo]) return m;
        var v = VERBOS_USTED[bajo];
        return (m[0] === m[0].toUpperCase()) ? v[0].toUpperCase() + v.slice(1) : v;
      })
      .replace(/\btu pelo\b/g, 'su cabello')
      .replace(/\bTu pelo\b/g, 'Su cabello')
      .replace(/\b([Tt])e\s+(lo|la|los|las)\b/g, function (m, T, p) { return (T === 'T' ? 'Se ' : 'se ') + p; })
      .replace(/\bte\b/g, 'le').replace(/\bTe\b/g, 'Le')
      .replace(/\btus\b/g, 'sus').replace(/\bTus\b/g, 'Sus')
      .replace(/\btu\b/g, 'su').replace(/\bTu\b/g, 'Su');
  }

  /* El guion es para la VOZ: sin emojis ni símbolos, con «euros» escrito, y
     con comas donde toca respirar. La voz del navegador lee fatal los signos. */
  function limpiarParaVoz(txt) {
    return String(txt || '')
      .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu, ' ')
      .replace(/€/g, ' euros')
      .replace(/%/g, ' por ciento')
      .replace(/[·|•→#*_]/g, ' ')
      .replace(/\s*-\s*(\d)/g, ' menos $1')
      .replace(/\s{2,}/g, ' ')
      .replace(/\s+([.,;:])/g, '$1')
      .trim();
  }

  /* ───────────────────────── Generación ───────────────────────── */

  function generar(op) {
    op = op || {};
    var claveRubro = RUBROS[op.rubro] ? op.rubro : 'peluqueria';
    var claveTono = TONOS[op.tono] ? op.tono : 'cercano';
    var R = RUBROS[claveRubro], T = TONOS[claveTono];
    var n = Math.max(1, Math.min(8, parseInt(op.n, 10) || 4));
    var semilla = (op.semilla == null) ? Math.floor(Math.random() * 1e9) : op.semilla;
    var rng = motorAzar(semilla);

    var negocio = String(op.negocio || '').trim() || 'Fátima Hair Studio';
    var ciudad = String(op.ciudad || '').trim();

    // Bolsas: nada se repite dentro del mismo folleto
    var bolsas = {
      rng: rng,
      cierres: new Bolsa(rng, T.cierres),
      etiquetas: new Bolsa(rng, ETIQUETAS),
      desc: {}
    };
    R.serv.forEach(function (s) { bolsas.desc[s.n] = new Bolsa(rng, s.d); });

    var bolsaServ = new Bolsa(rng, R.serv.map(function (s) { return s.n; }));
    var porNombre = {};
    R.serv.forEach(function (s) { porNombre[s.n] = s; });

    var celdas = [];
    for (var i = 0; i < n; i++) {
      var serv = porNombre[bolsaServ.coger()] || R.serv[i % R.serv.length];
      var largo = T.ritmo[i % T.ritmo.length];
      celdas.push({
        titulo: serv.n,
        texto: trato(descripcion(bolsas, serv, claveTono, largo), claveTono),
        precio: precio(rng, serv.p),
        // sólo algunos cuadros llevan etiqueta: si la llevan todos, no destaca ninguno
        etiqueta: (rng() < 0.38) ? bolsas.etiquetas.coger() : ''
      });
    }

    var titulo = uno(rng, R.titulos);
    var subtitulo = uno(rng, R.subs) + (ciudad ? ' · ' + ciudad : '');
    var cta = uno(rng, T.ctas);

    var pagina = {
      cabecera: { marca: negocio, titulo: titulo, subtitulo: subtitulo },
      celdas: celdas,
      pie: { cta: cta, contacto: op.contacto || '' },
      rubro: claveRubro,
      tono: claveTono,
      semilla: semilla
    };
    pagina.guion = guion(pagina, T, rng);
    return pagina;
  }

  function guion(pag, T, rng) {
    var partes = [];
    partes.push(pag.cabecera.marca + '.');
    partes.push(pag.cabecera.titulo + '. ' + pag.cabecera.subtitulo + '.');
    pag.celdas.forEach(function (c) {
      var linea = c.titulo + '. ' + c.texto;
      if (c.precio && c.precio !== 'Gratis') linea += ' Por ' + c.precio + '.';
      else if (c.precio === 'Gratis') linea += ' Sin coste.';
      partes.push(linea);
    });
    partes.push(uno(rng, T.remates));
    partes.push(pag.pie.cta + '.');
    return limpiarParaVoz(partes.join(' '));
  }

  /* Rehacer un solo campo, para el botón 🔁 de cada cuadro. */
  function regenerar(campo, ctx) {
    ctx = ctx || {};
    var R = RUBROS[ctx.rubro] || RUBROS.peluqueria;
    var T = TONOS[ctx.tono] || TONOS.cercano;
    var rng = motorAzar(ctx.semilla == null ? Math.floor(Math.random() * 1e9) : ctx.semilla);

    if (campo === 'titulo') return uno(rng, R.titulos);
    if (campo === 'subtitulo') return uno(rng, R.subs);
    if (campo === 'cta') return uno(rng, T.ctas);
    if (campo === 'etiqueta') return uno(rng, ETIQUETAS);

    var serv = null;
    if (ctx.servicio) {
      R.serv.some(function (s) { if (s.n === ctx.servicio) { serv = s; return true; } return false; });
    }
    if (!serv) serv = uno(rng, R.serv);

    if (campo === 'servicio') return serv.n;
    if (campo === 'precio') return precio(rng, serv.p);
    if (campo === 'texto') {
      var largo = uno(rng, ['corto', 'medio', 'largo']);
      var base = uno(rng, serv.d);
      if (largo === 'corto') return primeraFrase(base);
      if (largo === 'largo') return base + ' ' + uno(rng, T.cierres);
      return base;
    }
    return '';
  }

  function lista(obj) {
    return Object.keys(obj).map(function (k) { return { id: k, nombre: obj[k].nombre }; });
  }

  window.FOLLETO_CEREBRO = {
    generar: generar,
    regenerar: regenerar,
    limpiarParaVoz: limpiarParaVoz,
    rubros: function () { return lista(RUBROS); },
    tonos: function () { return lista(TONOS); }
  };
})();

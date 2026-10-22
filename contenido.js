// ============================================================
//  contenido.js — Solo datos · Flujograma
//  Aprende, glosario y ejemplos. HTML de confianza escrito a mano.
//  Fuente: temas 2 (Herramientas) y 3 (Procesos) del curso y ejercicios 5 a 8
//  con sus soluciones (sin nombres de centro ni de personas).
//  window.Contenido en navegador y module.exports en Node (tests).
// ============================================================
(function (raiz) {
  "use strict";

  const box = (tipo, tag, html) => `<div class="box box--${tipo}"><span class="box-tag">${tag}</span><p>${html}</p></div>`;

  // ---------- Aprende ----------
  // c = color del tema (clases pdca--P/H/V/A de styles.css, solo como color)
  const TEMAS = [
    { n: 1, c: "P", titulo: "Mapa de procesos y flujograma", sub: "Ver el proceso entero antes de buscar dónde falla",
      minuto: [
        "Un <b>proceso</b> es un conjunto de actividades relacionadas que transforman unas <b>entradas</b> (un paciente, una petición, una muestra) en un <b>resultado</b> para el paciente.",
        "El <b>mapa de procesos</b> representa gráficamente esas actividades: quién hace qué, en qué orden y dónde se decide algo.",
        "El <b>flujograma</b> (diagrama de flujo) es la herramienta para dibujarlo paso a paso, con unos <b>símbolos normalizados</b>.",
        "Sirve para entender el proceso, ponerse de acuerdo en el equipo y, sobre todo, <b>encontrar los puntos críticos</b>: el punto de partida del AMFE y del mapa de riesgos."],
      secciones: [
        { t: "¿Para qué sirve en seguridad del paciente?", h: `<ul><li><b>Claridad</b>: todos ven el mismo proceso, sin malentendidos.</li><li><b>Detección de riesgos</b>: se ven de antemano los pasos donde puede fallar.</li><li><b>Eficiencia</b>: aparecen pasos repetidos, esperas y cuellos de botella.</li><li><b>Mejora continua</b>: es la base para revisar el proceso después de un cambio o de un incidente.</li></ul>
          <p>Un ejemplo real del curso: un centro dibujó la administración de medicación y descubrió varios puntos donde las órdenes se duplicaban. Al simplificar el proceso bajaron los errores.</p>` },
        { t: "Las seis fases para hacerlo", h: `<ol><li><b>Elegir el proceso</b>: relevante para la unidad y con riesgo para el paciente.</li><li><b>Definir el alcance</b>: dónde empieza y dónde acaba. No abarcar demasiado.</li><li><b>Recoger la información</b>: preguntar a quien lo hace cada día, observar, revisar protocolos.</li><li><b>Dibujarlo</b> con los símbolos normalizados.</li><li><b>Revisarlo y validarlo</b> con todo el equipo.</li><li><b>Identificar los puntos críticos</b>.</li></ol>
          ${box("practica", "En la práctica", "En esta app las fases 2 a 4 son los pasos 1 a 3: tú escribes y la app dibuja. La fase 5 es el paso 4 (revisar y marcar como validado) y la 6, el paso 5.")}` },
        { t: "Dibujar el proceso real, no el ideal", h: `<p>Un flujograma útil para la seguridad refleja <b>lo que de verdad se hace</b>, con sus atajos y sus esperas, no lo que dice el protocolo. Por eso hay que dibujarlo con quien hace el proceso a diario.</p>
          ${box("trampa", "Ojo, trampa", "Si lo dibuja una sola persona desde el despacho, saldrá el proceso «de papel» y faltarán justo los pasos donde se falla.")}` }
      ],
      minicaso: `<p>Una UCI elige la <b>administración de medicación intravenosa</b> porque los errores pueden ser muy graves. Limita el alcance desde la prescripción hasta la administración (deja fuera la valoración del paciente). Dibuja cada paso: orden médica, preparación, doble verificación, administración y registro. Al validarlo con el equipo señala la <b>preparación</b> como punto crítico, y pone una doble verificación con lista de comprobación.</p>`,
      practica: { texto: "Ver el ejemplo de toma de constantes", href: "#/flujo/ej-fl-constantes/4" } },

    { n: 2, c: "H", titulo: "Los símbolos", sub: "Cada forma dice qué tipo de paso es",
      minuto: [
        "<b>Inicio / fin</b> (rectángulo redondeado, verde): dónde empieza y dónde acaba.",
        "<b>Actividad</b> (rectángulo, amarillo): lo que alguien hace. <b>Decisión</b> (rombo, naranja): una pregunta con respuesta Sí o No.",
        "<b>Datos</b> (paralelogramo, malva) y <b>documento</b> (hoja ondulada, azul): información que se registra o papeles que se usan.",
        "Las <b>flechas</b> dicen el orden. Un paso puede tener varias flechas de salida solo si es una decisión."],
      secciones: [
        { t: "Los seis símbolos que usa la app", h: `<div data-leyenda="1"></div>
          <ul><li><b>Inicio / fin</b>: puede haber varios (en Urgencias el paciente llega solo o en ambulancia, y sale a domicilio, a planta, a la UCI…).</li><li><b>Actividad</b>: se escribe con un verbo y corta: «Extrae la muestra», «Traslada al paciente».</li><li><b>Decisión</b>: una pregunta cerrada, «¿Valores normales?». De ella salen dos flechas, Sí y No.</li><li><b>Datos</b>: se leen o se registran datos («Mecaniza datos», «Registra en la historia clínica»).</li><li><b>Documento</b>: un papel o un informe («Hoja de tratamiento», «Informe de alta»).</li><li><b>Proceso externo</b>: otro servicio u otro proceso que se usa pero no se detalla (Radiología, Laboratorio).</li></ul>` },
        { t: "Las flechas", h: `<p>Unen los pasos en el orden en que ocurren. La app las dibuja con tramos rectos y esquinas en ángulo recto, y pone en verde el <b>Sí</b> y en granate el <b>No</b>, como en las soluciones del curso.</p>
          <p>Cuando algo <b>va y vuelve</b> (el paciente va a Radiología y regresa al box), se puede marcar la flecha como «ida y vuelta»: sale roja y discontinua, con punta en los dos extremos.</p>` }
      ],
      minicaso: `<p>En la petición de una radiografía, «Documento de solicitud» es un <b>documento</b>; «¿Correctamente cumplimentado?» es una <b>decisión</b>; «Mecaniza datos» son <b>datos</b>; «Realiza la prueba» es una <b>actividad</b>. Ábrelo en los ejemplos y fíjate en cada forma.</p>`,
      practica: { texto: "Ver el ejemplo de radiografía", href: "#/flujo/ej-fl-radiografia/4" } },

    { n: 3, c: "H", titulo: "Proceso, subprocesos y alcance", sub: "Poner límites para que el dibujo se pueda leer",
      minuto: [
        "El <b>alcance</b> dice dónde empieza y dónde acaba el proceso, y qué queda dentro y fuera.",
        "Un <b>subproceso</b> es una fase con su inicio, su fin y sus roles: «Recepción y registro», «Triaje», «Gestión del ingreso».",
        "Los subprocesos ordenan el dibujo en <b>bandas</b> y sirven después para repartir los fallos del AMFE.",
        "Si un proceso pasa de unos 25 pasos, conviene dividirlo."],
      secciones: [
        { t: "Cómo delimitar", h: `<p>Pregúntate: ¿qué hecho abre el proceso? (llega el paciente, se recibe una petición) ¿Y cuál lo cierra? (sale de la unidad, se informa el resultado). Todo lo que pase antes o después queda fuera.</p>
          ${box("trampa", "Ojo, trampa", "Un mapa demasiado grande no se termina nunca y no se puede analizar. Un mapa demasiado pequeño deja fuera los traspasos, que es donde más se falla.")}` },
        { t: "Subprocesos (como en el ejercicio 6)", h: `<p>Para cada subproceso: nombre, descripción, inicio, fin y roles implicados. En Urgencias el curso definió siete: recepción y registro administrativo, triaje de enfermería, estancia en sala de espera, valoración médica inicial, pruebas diagnósticas y traslado, comunicación de resultados y gestión del ingreso.</p>
          ${box("practica", "En la práctica", "En el paso 3 eliges a qué subproceso pertenece cada paso y la app lo dibuja dentro de su banda de color. Un subproceso nunca empieza antes de que termine el anterior.")}` }
      ],
      minicaso: `<p>«Toda la atención en Urgencias» es mucho. Si os preocupa sobre todo la identificación, podéis empezar por el tramo <b>desde la llegada a admisión hasta la colocación de la pulsera</b> y dejar el resto para otro flujograma.</p>`,
      practica: { texto: "Crear un flujograma", href: "#/flujo/nuevo" } },

    { n: 4, c: "V", titulo: "Calles y actores", sub: "Quién hace cada paso, y por qué importan los cambios de manos",
      minuto: [
        "Cada <b>actor</b> (profesional, servicio o el propio paciente) tiene su <b>calle</b>: una columna del dibujo con su nombre arriba.",
        "Cada paso se dibuja en la calle de quien lo hace.",
        "Cuando una flecha <b>cruza de una calle a otra</b>, el proceso cambia de manos: es un <b>traspaso</b>.",
        "En los traspasos se pierde información con facilidad: son candidatos claros a <b>punto crítico</b>."],
      secciones: [
        { t: "Cómo coloca la app los pasos", h: `<ol><li>Cada paso va una fila por debajo del paso que le precede.</li><li>Cada paso va en la calle de quien lo hace.</li><li>Si dos pasos coinciden (las dos ramas de una decisión), se ponen uno al lado del otro: el Sí sigue recto y el No sale hacia un lado.</li><li>Los inicios y los fines que no son de nadie van fuera de las calles, a la izquierda y a la derecha.</li><li>Las flechas que vuelven atrás («repite la prueba») suben por un pasillo lateral para no tapar nada.</li></ol>` },
        { t: "Una calle por actor o por turnos", h: `<p>Las soluciones del curso repiten la calle de un actor cada vez que vuelve a intervenir (Facultativo · Enfermería · Facultativo). La app pone <b>una calle por actor</b>: así hay menos columnas y se ve de un vistazo cuántas veces vuelve el proceso a la misma persona.</p>` }
      ],
      minicaso: `<p>En la toma de constantes, la hoja de tratamiento pasa del facultativo a enfermería, y los valores anómalos vuelven de enfermería al facultativo. Son dos traspasos: si la hoja no llega o el aviso se pierde, el paciente no recibe lo que necesita.</p>`,
      practica: { texto: "Ver el ejemplo de toma de constantes", href: "#/flujo/ej-fl-constantes/4" } },

    { n: 5, c: "V", titulo: "Decisiones bien hechas", sub: "Una pregunta, dos salidas, ningún callejón",
      minuto: [
        "Una decisión se escribe como <b>pregunta cerrada</b>: «¿Valores normales?», «¿Documentación completa?».",
        "Siempre tiene <b>dos salidas</b>: Sí y No. Si hay más opciones, se encadenan dos decisiones.",
        "Ningún paso puede quedarse <b>sin salida</b> (salvo un fin) y a todos se tiene que <b>llegar</b> desde un inicio.",
        "Las vueltas atrás («repite la prueba») tienen que acabar saliendo hacia un fin."],
      secciones: [
        { t: "Lo que revisa la app", h: `<p>El validador del paso 3 avisa de: falta de inicio o de fin; pasos sin salida (callejones); pasos a los que no se llega; decisiones sin Sí o sin No, o con más de dos salidas; decisiones que no están escritas como pregunta; pasos sin actor; vueltas atrás que nunca terminan; y actividades que parecen un documento.</p>` },
        { t: "Trucos para escribir rápido", h: `<p>En el paso 3 puedes pegar una lista como las del ejercicio 5 («1. Enfermera consulta hoja de indicaciones…»). La app:</p>
          <ul><li>crea un paso por línea y los encadena;</li><li>adivina el actor por la primera palabra («Enfermera…» → Enfermería; «Médico…» → Facultativo);</li><li>convierte en decisión las preguntas («¿…?») y las frases con «si»: «Informa al médico si hay valores anómalos» se convierte en «¿Hay valores anómalos?» con el Sí hacia «Informa al médico»;</li><li>añade un inicio y un fin si faltan.</li></ul>
          ${box("practica", "En la práctica", "Después revisa siempre la tabla: la app adivina, pero quien conoce el proceso eres tú.")}` }
      ],
      minicaso: `<p>En un alta hospitalaria, la decisión «¿Documentación completa?» tiene el No hacia «Informar al facultativo»… y ahí se acaba. Es un <b>callejón sin salida</b>: ¿qué pasa después? Lo lógico es que vuelva a la revisión de la documentación.</p>`,
      practica: { texto: "Crear un flujograma", href: "#/flujo/nuevo" } },

    { n: 6, c: "A", titulo: "Puntos críticos", sub: "Dónde puede fallar el proceso, marcado sobre el dibujo",
      minuto: [
        "Un <b>punto crítico</b> es un paso donde el proceso puede fallar y dañar al paciente.",
        "Se buscan sobre el flujograma ya validado, con el equipo, subproceso a subproceso (ejercicio 8).",
        "Cada uno lleva un <b>título</b> (lo que puede salir mal) y una <b>descripción</b> del error o del riesgo.",
        "Son el punto de partida del <b>AMFE</b>: cada punto crítico es un candidato a modo de fallo."],
      secciones: [
        { t: "Dónde suele fallar un proceso", h: `<ul><li><b>Traspasos</b> entre profesionales: información que no llega, paciente que nadie vigila.</li><li><b>Decisiones</b>: si se decide mal, todo lo que viene después va por el camino equivocado.</li><li><b>Identificación</b> del paciente y de las muestras (pulsera, etiquetas, verificación).</li><li><b>Registros</b> y <b>comunicación</b>: lo que no se anota o no se dice no existe para el siguiente.</li><li><b>Traslados</b> y <b>esperas</b>: el paciente queda sin vigilancia.</li><li><b>Medicación</b>: prescripción, preparación y administración.</li></ul>
          ${box("practica", "En la práctica", "En el paso 5 la app te propone estos lugares. Añade los que tengan sentido en tu unidad y descarta el resto: la decisión es del equipo.")}` },
        { t: "Cómo escribirlos", h: `<p>Como <b>lo que puede salir mal</b>, en una frase concreta: «No colocación de la pulsera identificativa», «Clasificación errónea del nivel de prioridad», «Resultados no comunicados al médico». La consecuencia («error de identidad», «retraso en la atención») va después, en la columna «efecto» del AMFE.</p>
          ${box("trampa", "Ojo, trampa", "Un punto crítico en un inicio o en un fin casi siempre está mal colocado: el riesgo está en el paso de al lado.")}` },
        { t: "Del punto crítico al mapa de riesgos", h: `<p>Cuando el AMFE puntúa los fallos, cada punto crítico se puede enlazar con los números de esos fallos. Así el mapa de riesgos dibuja sobre el flujograma un aviso con los números (en Urgencias, «3, 5, 7» sobre Recepción), coloreado según su prioridad.</p>` }
      ],
      minicaso: `<p>En la petición de radiografía, el celador recibe el aviso y va a buscar al paciente. Si el paciente <b>no lleva pulsera</b>, no puede comprobar quién es: punto crítico «Paciente no identificado (sin pulsera)», en el paso «¿Paciente verificado?». Su efecto, en el AMFE: prueba al paciente equivocado.</p>`,
      practica: { texto: "Ver los puntos críticos de la radiografía", href: "#/flujo/ej-fl-radiografia/5" } }
  ];

  // ---------- Glosario ----------
  const GLOSARIO = [
    ["Proceso", "Conjunto de actividades relacionadas que transforman unas entradas en un resultado para el paciente."],
    ["Proceso asistencial", "Proceso que afecta directamente a la atención del paciente. Son los más importantes para su seguridad."],
    ["Subproceso", "Fase de un proceso con un inicio, un fin y unos roles claros. En el dibujo, una banda de color."],
    ["Mapa de procesos", "Representación gráfica de las actividades de una unidad o de un proceso, para entenderlo y encontrar sus puntos críticos."],
    ["Procesos estratégicos", "Los que marcan la dirección de la organización: contrato programa, plan de calidad, gestión clínica…"],
    ["Proceso clave", "El que da el servicio al paciente (en Urgencias, la atención integral al paciente)."],
    ["Procesos de soporte", "Los que dan apoyo al proceso clave: recursos humanos, sistemas de información, farmacia, laboratorio, limpieza…"],
    ["Flujograma", "Diagrama de flujo: dibujo de un proceso paso a paso con símbolos normalizados y flechas que marcan el orden."],
    ["Alcance", "Los límites del proceso: dónde empieza, dónde acaba y qué queda dentro y fuera."],
    ["Entrada", "Lo que se necesita para que empiece el proceso: un paciente, una petición, una muestra, información."],
    ["Salida", "El resultado del proceso: un paciente atendido, un informe, un resultado disponible."],
    ["Terminal (inicio / fin)", "Símbolo de rectángulo redondeado que marca dónde empieza o dónde acaba el proceso."],
    ["Actividad", "Símbolo rectangular: algo que alguien hace. Se escribe con un verbo."],
    ["Decisión", "Símbolo de rombo: una pregunta que se responde Sí o No, con una flecha para cada respuesta."],
    ["Datos", "Símbolo de paralelogramo: lectura o registro de datos (historia clínica, sistema informático)."],
    ["Documento", "Símbolo de hoja con la base ondulada: un papel o un informe que se usa o se genera."],
    ["Proceso externo", "Símbolo de rectángulo con doble lateral: otro proceso u otro servicio que se usa pero no se detalla."],
    ["Flecha de flujo", "Línea con punta que une dos pasos y dice en qué orden ocurren."],
    ["Calle (swimlane)", "Columna del dibujo de un actor: todos sus pasos van en ella."],
    ["Actor", "Quien hace un paso: un profesional, un servicio o el propio paciente."],
    ["Traspaso", "Momento en que el proceso pasa de un actor a otro. En el dibujo, una flecha que cruza de una calle a otra."],
    ["Callejón sin salida", "Paso que no lleva a ningún sitio y no es un fin. Es un error de dibujo (o un hueco real del proceso)."],
    ["Punto crítico", "Paso del proceso donde puede producirse un fallo que dañe al paciente. Es el punto de partida del AMFE."],
    ["Validar el flujograma", "Revisarlo con todo el equipo que hace el proceso para confirmar que refleja lo que de verdad se hace."],
    ["AMFE", "Análisis Modal de Fallos y Efectos: método para encontrar qué puede fallar en cada paso del proceso, qué pasaría y por qué, y priorizar."],
    ["Mapa de riesgos", "Flujograma con los riesgos (los fallos del AMFE) marcados encima, coloreados según su prioridad."],
    ["draw.io (diagrams.net)", "Programa gratuito de dibujo de diagramas que usa el curso. La app exportará el flujograma en su formato para retocarlo."]
  ];

  // ---------- Ejemplos (los del ejercicio 5 del curso) ----------
  // Pasos: [num, tipo, texto, actor (índice en actores o -1), salidas ("3" | "si:4,no:5" | "3,ida:7"), subproceso (índice o -1), con (num)]
  const TIPO = { T: "terminal", A: "actividad", D: "decision", Da: "datos", Doc: "documento", X: "externo" };
  function miniFlujo(m) {
    const id = "ej-fl-" + m.clave, pid = n => `${id}-p${n}`;
    const actores = m.actores.map((nombre, i) => ({ id: `${id}-a${i}`, nombre }));
    const subprocesos = (m.subprocesos || []).map((s, i) => Object.assign({ id: `${id}-s${i}`, descripcion: "", inicio: "", fin: "", roles: "", color: String(i), origenApp: "", origenId: "" }, s));
    const pasos = m.pasos.map(([n, t, texto, ac, sal, sub, con]) => ({
      id: pid(n), num: n, tipo: TIPO[t], texto, actorId: ac >= 0 ? actores[ac].id : "", subprocesoId: sub >= 0 && subprocesos[sub] ? subprocesos[sub].id : "",
      siguientes: String(sal || "").split(",").filter(Boolean).map(x => { const [a, b] = x.includes(":") ? x.split(":") : ["", x]; return { a: pid(b), etiqueta: a === "si" || a === "no" ? a : "", estilo: a === "ida" ? "idavuelta" : "normal" }; }),
      con: con ? pid(con) : "", nota: "", ajuste: { fila: "", lado: "" }
    }));
    // Puntos críticos: [num, paso, título, descripción]
    const puntos = (m.puntos || []).map(([n, paso, titulo, descripcion, fallos]) => ({ id: `${id}-c${n}`, num: n, pasoId: pid(paso), titulo, descripcion, fallos: (fallos || []).map(String), origen: fallos ? "amfe" : "manual", clave: "" }));
    return Object.assign({ id, titulo: "", unidad: "", incluye: "", excluye: "", responsable: "", fecha: "", puntos, exportado: "", descartes: [], vista: { orientacion: "vertical", calles: "actor", subprocesos: true, letra: "normal", numeros: true, marco: false },
      marco: { estrategicos: [], soporte: [] }, validado: "", edicion: "00", anteriorId: "", tipoEdicion: "actual", notas: "", creado: "2026-10-22T00:00:00.000Z", modificado: "2026-10-22T00:00:00.000Z" },
      m.meta, { actores, subprocesos, pasos });
  }

  const CONSTANTES = miniFlujo({ clave: "constantes",
    meta: { titulo: "Toma de constantes en planta", proceso: "Toma de constantes en planta", unidad: "Hospitalización",
      objetivo: "Que las constantes indicadas se tomen, se registren y, si son anómalas, lleguen al facultativo a tiempo para decidir.",
      inicio: "El facultativo indica la toma de constantes", fin: "El facultativo decide en función de los valores",
      notas: "Solución del ejercicio 5 del curso (proceso A). Para practicar: ¿dónde están los traspasos? ¿Qué pasa si la hoja de tratamiento no llega o si el aviso de valores anómalos se pierde?" },
    actores: ["Facultativo", "Enfermería"],
    pasos: [
      [1, "T", "Facultativo indica toma de constantes", -1, "2"],
      [2, "A", "Escribe hoja de tratamiento", 0, "3"],
      [3, "Doc", "Hoja de tratamiento", 0, "4"],
      [4, "A", "Lectura de indicaciones", 1, "5"],
      [5, "A", "Toma de constantes", 1, "6"],
      [6, "D", "¿Valores normales?", 1, "si:7,no:9"],
      [7, "A", "Anota constantes en hoja de evolución", 1, "8"],
      [8, "Doc", "Hoja de evolución", 1, "10"],
      [9, "A", "Informa a facultativo", 1, "10"],
      [10, "A", "Valora información", 0, "11"],
      [11, "T", "Toma de decisión en función de valores", -1, ""]
    ],
    puntos: [
      [1, 2, "Hoja de tratamiento incompleta o ilegible", "No consta qué constantes tomar ni con qué frecuencia, o no se entiende lo escrito."],
      [2, 4, "No se leen las indicaciones actualizadas", "Enfermería toma las constantes de la pauta anterior porque la hoja ha cambiado y nadie lo ha avisado."],
      [3, 6, "Valores anómalos que no se reconocen como tales", "Se da por normal un valor alterado (por ejemplo, una saturación baja en un paciente sin oxígeno previo)."],
      [4, 9, "El aviso al facultativo no llega o llega tarde", "No se localiza al facultativo o el aviso se da de palabra y se olvida; el paciente empeora sin que se actúe."]
    ] });

  const RADIOGRAFIA = miniFlujo({ clave: "radiografia",
    meta: { titulo: "Petición de radiografía simple", proceso: "Petición de radiografía simple", unidad: "Urgencias / Radiodiagnóstico",
      objetivo: "Que la radiografía se haga al paciente correcto, con una petición completa, y que el informe llegue al sistema.",
      inicio: "El facultativo decide pedir la radiografía", fin: "El informe de resultados está en el sistema",
      notas: "Solución del ejercicio 5 del curso (proceso E). Añadido para el ejemplo: la vuelta de «Corregir errores» a la solicitud, el destino de la disconformidad y de la notificación («Prueba no realizada») y los tres subprocesos." },
    actores: ["Facultativo", "Enfermería", "Celador", "Técnico de Radiología", "Radiólogo"],
    subprocesos: [
      { nombre: "Solicitud", descripcion: "Petición y comprobación de la solicitud", inicio: "Se decide pedir la prueba", fin: "Se avisa al celador", roles: "Facultativo, enfermería" },
      { nombre: "Traslado", descripcion: "Verificación del paciente y traslado a Radiología", inicio: "El celador recibe el aviso", fin: "El paciente llega a Radiología", roles: "Celador" },
      { nombre: "Realización e informe", descripcion: "Verificación, prueba, validación de la imagen e informe", inicio: "Llega el paciente a Radiología", fin: "Informe en el sistema", roles: "Técnico de Radiología, radiólogo" }
    ],
    pasos: [
      [1, "T", "Inicio", -1, "2", 0],
      [2, "A", "Solicitud radiografía", 0, "4", 0],
      [3, "Doc", "Documento solicitud", 0, "", 0, 2],
      [4, "D", "¿Correctamente cumplimentado?", 0, "si:6,no:5", 0],
      [5, "A", "Corregir errores", 0, "2", 0],
      [6, "A", "Imprime petición", 1, "8", 0],
      [7, "Doc", "Petición con códigos", 1, "", 0, 6],
      [8, "A", "Avisa a celador", 1, "9", 0],
      [9, "D", "¿Paciente verificado?", 2, "si:11,no:10", 1],
      [10, "Doc", "Informe de disconformidad", 2, "21", 1],
      [11, "A", "Traslada al paciente", 2, "12", 1],
      [12, "D", "¿Paciente y petición correctos?", 3, "si:14,no:13", 2],
      [13, "A", "Notificación", 3, "21", 2],
      [14, "Da", "Mecaniza datos", 3, "15", 2],
      [15, "A", "Realiza la prueba", 3, "16", 2],
      [16, "D", "¿Imagen válida?", 3, "si:18,no:17", 2],
      [17, "A", "Repite la prueba", 3, "15", 2],
      [18, "A", "Emite informe", 4, "19", 2],
      [19, "Doc", "Informe de resultados", 4, "20", 2],
      [20, "T", "Fin", -1, "", 2],
      [21, "T", "Prueba no realizada", -1, "", -1]
    ],
    puntos: [
      [1, 2, "Solicitud sin información clínica suficiente", "El técnico y el radiólogo no saben qué se busca: la proyección o la interpretación pueden no ser las adecuadas."],
      [2, 9, "Paciente no identificado (sin pulsera)", "El celador no puede comprobar la identidad y la prueba se hace al paciente equivocado."],
      [3, 12, "Traslado sin información clínica mínima al técnico", "Se omiten datos como el embarazo o la movilidad, que cambian cómo se hace la prueba."],
      [4, 16, "Imagen no válida que no se repite", "Se da por buena una imagen movida o mal centrada y el diagnóstico se retrasa."],
      [5, 18, "Resultados que no se comunican al médico", "El informe queda en el sistema sin que nadie lo revise a tiempo."]
    ] });

  const ALTA = miniFlujo({ clave: "alta",
    meta: { titulo: "Alta hospitalaria programada", proceso: "Alta hospitalaria programada", unidad: "Hospitalización",
      objetivo: "Que el paciente salga de la planta con su informe, su medicación y los cuidados que necesita en casa, y que la familia lo sepa a tiempo.",
      inicio: "El facultativo evalúa la situación clínica del paciente", fin: "El paciente sale de alta o continúa ingresado",
      notas: "Solución del ejercicio 5 del curso (proceso B). Añadido para el ejemplo: la vuelta de «Informa al facultativo» al informe de alta cuando la documentación no está completa." },
    actores: ["Facultativo", "Enfermería", "Administrativo"],
    pasos: [
      [1, "T", "Facultativo evalúa situación clínica del paciente", -1, "2"],
      [2, "A", "Evaluación clínica", 0, "4"],
      [3, "Doc", "Hoja de evolución", 0, "", -1, 2],
      [4, "D", "¿Alta?", 0, "si:5,no:17"],
      [5, "A", "Comunica al paciente", 0, "6"],
      [6, "Doc", "Informe de alta", 0, "7"],
      [7, "A", "Lectura de indicaciones", 1, "8"],
      [8, "D", "¿Cuidados domiciliarios?", 1, "si:9,no:11"],
      [9, "Doc", "Instrucciones específicas", 1, "10"],
      [10, "A", "Comunica a trabajo social o a la enfermera de enlace", 1, "12"],
      [11, "Doc", "Informe de cuidados", 1, "12"],
      [12, "D", "¿Documentación completa?", 1, "si:14,no:13"],
      [13, "A", "Informa al facultativo", 1, "6"],
      [14, "A", "Hoja de alta administrativa", 2, "15"],
      [15, "A", "Entrega informe a la familia", 1, "16"],
      [16, "T", "Alta a domicilio", -1, ""],
      [17, "T", "Continúa ingreso", -1, ""]
    ],
    puntos: [
      [1, 6, "Informe de alta sin conciliar la medicación", "El paciente sale con la medicación del ingreso y la de casa duplicadas o con interacciones."],
      [2, 8, "No se valoran los cuidados que necesita en casa", "Un paciente dependiente se va sin apoyo ni seguimiento de enfermería de enlace."],
      [3, 12, "Documentación incompleta al alta", "Falta el informe de cuidados o las citas, y el paciente o su centro de salud no saben qué hacer."],
      [4, 15, "La familia no recibe la información a tiempo", "Nadie viene a recoger al paciente o no entienden las indicaciones."]
    ] });

  const QUIROFANO = miniFlujo({ clave: "quirofano",
    meta: { titulo: "Preparación de quirófano", proceso: "Preparación de quirófano para cirugía programada", unidad: "Bloque quirúrgico",
      objetivo: "Que llegue al quirófano el paciente correcto, preparado, para el procedimiento correcto y con todo el material comprobado.",
      inicio: "El celador va a buscar al paciente a la planta", fin: "El paciente y el material están listos para la cirugía",
      notas: "Solución del ejercicio 5 del curso (proceso C). Fíjate en que Enfermería de quirófano interviene dos veces: con «Calles por turnos» sale como en el curso, en dos columnas. Añadido para el ejemplo: el final «Cirugía suspendida o aplazada» para las discrepancias." },
    actores: ["Celador", "Enfermería de quirófano", "TCAE de quirófano"],
    pasos: [
      [1, "T", "Inicio", -1, "2"],
      [2, "D", "¿Paciente preparado (ayunas, higiene, documentación)?", 0, "si:4,no:3"],
      [3, "A", "Comunicar discrepancia", 0, "16"],
      [4, "A", "Traslado a quirófano", 0, "5"],
      [5, "D", "¿Identidad y procedimiento verificados?", 1, "si:9,no:6"],
      [6, "A", "Detener el proceso y comunicar discrepancia", 1, "16"],
      [7, "Doc", "Hoja de evolución", 1, "", -1, 6],
      [8, "Doc", "Checklist quirúrgico", 1, "", -1, 5],
      [9, "A", "Retira ropa y colabora con la preparación del paciente y del material", 2, "10"],
      [10, "A", "Higiene y canalización de vías", 1, "11"],
      [11, "D", "¿Precisa material específico o prótesis?", 1, "si:14,no:12"],
      [12, "A", "Verificar bandejas y equipos de anestesia", 1, "14"],
      [13, "Doc", "Checklist de material completo y en buen estado", 1, "", -1, 12],
      [14, "A", "Verificar disponibilidad y esterilidad", 1, "15"],
      [15, "T", "Fin", -1, ""],
      [16, "T", "Cirugía suspendida o aplazada", -1, ""]
    ],
    puntos: [
      [1, 2, "Paciente sin ayunas o sin la preparación indicada", "Se descubre ya en quirófano y la cirugía se suspende o se hace con riesgo de aspiración."],
      [2, 5, "Error de identificación, de procedimiento o de lado", "No se hace la verificación con el paciente y el listado quirúrgico, o se hace de memoria."],
      [3, 12, "Material incompleto o equipos de anestesia sin revisar", "Falta material o un equipo falla en mitad de la intervención."],
      [4, 14, "Prótesis o material no estéril o no disponible", "Se abre al paciente sin tener la prótesis adecuada o con material de esterilidad dudosa."]
    ] });

  const ANALITICA = miniFlujo({ clave: "analitica",
    meta: { titulo: "Solicitud de analítica urgente", proceso: "Solicitud de analítica urgente", unidad: "Urgencias / Laboratorio",
      objetivo: "Que la muestra correcta llegue al laboratorio en buen estado y que un resultado alarmante llegue a tiempo al facultativo que lo pidió.",
      inicio: "El facultativo decide pedir una analítica urgente", fin: "El resultado está validado y, si es alarmante, comunicado",
      notas: "Solución del ejercicio 5 del curso (proceso D). Añadido para el ejemplo: la vuelta de «Corregir errores» a la solicitud y de la notificación de una muestra incorrecta a una nueva extracción." },
    actores: ["Facultativo", "Enfermería", "Celador", "Técnico de Laboratorio", "Facultativo analista"],
    pasos: [
      [1, "T", "Inicio", -1, "2"],
      [2, "A", "Solicitud de analítica urgente", 0, "4"],
      [3, "Doc", "Documento de solicitud", 0, "", -1, 2],
      [4, "D", "¿Correctamente cumplimentado?", 0, "si:6,no:5"],
      [5, "A", "Corregir errores", 0, "2"],
      [6, "A", "Imprime etiquetas", 1, "8"],
      [7, "Doc", "Petición con códigos", 1, "", -1, 6],
      [8, "A", "Realiza la extracción", 1, "9"],
      [9, "A", "Transporte de muestras", 2, "10"],
      [10, "A", "Recepción y verificación de la muestra", 3, "11"],
      [11, "D", "¿Muestra correcta?", 3, "si:13,no:12"],
      [12, "A", "Notificación", 3, "8"],
      [13, "A", "Inicio del proceso de análisis", 3, "14"],
      [14, "Doc", "Informe de resultados", 4, "15"],
      [15, "A", "Validación de resultados", 4, "16"],
      [16, "D", "¿Señal de alarma?", 4, "si:17,no:18"],
      [17, "A", "Informa al facultativo peticionario", 4, "18"],
      [18, "T", "Fin", -1, ""]
    ],
    puntos: [
      [1, 6, "Etiquetas de otro paciente", "Se imprimen o se cogen las etiquetas equivocadas y la muestra queda a nombre de otra persona."],
      [2, 8, "Muestra mal identificada en la extracción", "Se etiqueta lejos de la cama del paciente o después de extraer varias muestras."],
      [3, 9, "Retraso o deterioro en el transporte", "La muestra espera en un mostrador o se transporta sin las condiciones que necesita."],
      [4, 16, "Valor crítico que no se comunica", "El resultado alarmante queda en el sistema y el facultativo no se entera a tiempo."]
    ] });

  // Urgencias: flujograma general del ejercicio 7, subprocesos del ejercicio 6 y avisos del mapa de riesgos del
  // Documento Final (página 15) con los números de fallo del AMFE de Urgencias.
  const URGENCIAS = miniFlujo({ clave: "urgencias",
    meta: { titulo: "Atención integral en Urgencias", proceso: "Atención integral en el Servicio de Urgencias", unidad: "Servicio de Urgencias",
      objetivo: "Garantizar la atención segura del paciente desde su llegada a Urgencias hasta la decisión sobre su destino (alta, ingreso o UCI), sin pérdidas de información entre profesionales.",
      inicio: "El paciente llega a Urgencias, por su pie o en ambulancia", fin: "Se decide y se hace efectivo su destino",
      incluye: "Pacientes adultos atendidos en Urgencias generales", excluye: "Urgencias pediátricas y obstétricas; estancia en planta tras el ingreso",
      vista: { orientacion: "vertical", calles: "actor", subprocesos: true, letra: "normal", numeros: true, marco: true },
      marco: { estrategicos: ["Contrato programa", "Control de gestión", "Gestión clínica", "Plan de docencia", "Plan de investigación", "Plan de calidad", "Guías de práctica clínica"], soporte: ["Recursos humanos", "Documentación clínica", "Formación", "Sistemas de información", "Servicio de farmacia", "Servicio de radiodiagnóstico", "Servicio de laboratorio", "Cocina y limpieza", "Suministros"] },
      notas: "Flujograma general del ejercicio 7 del curso, con los 7 subprocesos del ejercicio 6 y el marco de procesos estratégicos, clave y de soporte del Documento Final. Los avisos llevan los números de fallo del AMFE de Urgencias, como el mapa de riesgos del Documento Final (página 15); en la app AMFE está ese AMFE completo. Simplificado para el ejemplo: la decisión final tiene tres destinos (domicilio, planta y UCI) en lugar de seis, y las pruebas se piden juntas." },
    actores: ["Celador", "Administrativo", "Enfermería", "TCAE", "Facultativo"],
    subprocesos: [
      { nombre: "Recepción y registro administrativo", descripcion: "Registro inicial y verificación de datos del paciente", inicio: "Llegada del paciente al mostrador de admisión", fin: "Derivación al triaje", roles: "Administrativo, celador, paciente, acompañante" },
      { nombre: "Triaje de enfermería", descripcion: "Evaluación clínica inicial y asignación de prioridad", inicio: "Recepción por enfermería de triaje", fin: "Derivación a sala de espera", roles: "Enfermería, celador" },
      { nombre: "Estancia en sala de espera", descripcion: "Permanencia del paciente hasta la atención clínica", inicio: "Entrada en sala de espera", fin: "Llamada a consulta médica", roles: "TCAE, celador, paciente" },
      { nombre: "Valoración médica inicial", descripcion: "Exploración y toma de decisiones clínicas preliminares", inicio: "Entrada a consulta médica", fin: "Solicitud de pruebas diagnósticas", roles: "Facultativo, paciente" },
      { nombre: "Pruebas diagnósticas y traslado", descripcion: "Realización y retorno de estudios solicitados", inicio: "Salida de la consulta para pruebas", fin: "Regreso a box o área de observación", roles: "Celador, técnico de rayos, enfermería, paciente" },
      { nombre: "Comunicación de resultados y decisión", descripcion: "Valoración de pruebas y decisión terapéutica", inicio: "Disponibilidad de resultados clínicos", fin: "Decisión de ingreso, alta o derivación", roles: "Facultativo" },
      { nombre: "Gestión del ingreso", descripcion: "Preparación y formalización del ingreso hospitalario", inicio: "Confirmación del ingreso por el facultativo", fin: "Salida del paciente hacia planta", roles: "Facultativo, enfermería, administrativo, celador" }
    ],
    pasos: [
      [1, "T", "Acude solo", -1, "3", 0],
      [2, "T", "Llega en ambulancia", -1, "4", 0],
      [3, "A", "Recepción", 0, "5", 0],
      [4, "D", "¿Paciente crítico?", 0, "si:12,no:3", 0],
      [5, "A", "Registro de datos", 1, "6", 0],
      [6, "A", "Triaje", 2, "7", 1],
      [7, "A", "Traslado", 0, "8", 1],
      [8, "D", "¿Prioridad vital?", 2, "si:12,no:9", 1],
      [9, "D", "¿Consulta libre?", 2, "si:11,no:10", 2],
      [10, "A", "Sala de espera", 3, "11", 2],
      [11, "A", "Consulta", 4, "13", 3],
      [12, "A", "Sala de críticos", 4, "13", 3],
      [13, "D", "¿Precisa pruebas?", 4, "si:14,no:19", 3],
      [14, "A", "Extrae analítica y prepara al paciente", 2, "ida:15,16", 4],
      [15, "X", "Laboratorio", -1, "19", 4],
      [16, "A", "Traslado a Radiología", 0, "17", 4],
      [17, "X", "Radiología", -1, "18", 4],
      [18, "A", "Traslado de vuelta al box", 0, "19", 4],
      [19, "A", "Valoración de resultados", 4, "20", 5],
      [20, "D", "¿Precisa ingreso?", 4, "si:21,no:25", 5],
      [21, "D", "¿Ingreso en UCI?", 4, "si:26,no:22", 6],
      [22, "A", "Gestiona la cama y el ingreso", 1, "23", 6],
      [23, "A", "Traslado a planta", 0, "24", 6],
      [24, "T", "Ingreso hospitalario", -1, "", 6],
      [25, "T", "Alta a domicilio", -1, "", 5],
      [26, "T", "Ingreso en UCI", -1, "", 6]
    ],
    puntos: [
      [1, 3, "Datos clínicos o de contacto incompletos en la recepción", "Se omiten alergias o medicación, el sistema no alerta de antecedentes y no hay protocolo para el paciente frágil.", [3, 5, 7]],
      [2, 6, "Prioridad mal asignada en el triaje", "Clasificación errónea del nivel de prioridad, paciente frágil no detectado, constantes mal registradas o sin pulsera identificativa.", [8, 9, 10, 11]],
      [3, 7, "Paciente sin pulsera o confusión de camillas en el traslado", "Sin identificación física, el paciente puede ser confundido con otro en pruebas o tratamientos.", [29, 30]],
      [4, 10, "Espera prolongada sin reevaluación ni supervisión", "El paciente empeora en la sala sin que nadie lo note; los frágiles quedan solos.", [15, 16]],
      [5, 11, "Valoración médica incompleta", "Medicación habitual no conciliada, resultados sin revisar o mala coordinación con la planta.", [23, 36, 45]],
      [6, 18, "Confusión de camillas al volver de pruebas", "Al regresar al box, el paciente se identifica a la vista y se confunde con otro.", [29, 30]],
      [7, 22, "Demora en encontrar cama y familia sin avisar", "El paciente permanece en Urgencias más de lo necesario y la familia no sabe dónde está.", [43, 49]]
    ] });

  const EJEMPLOS = {
    flujos: [CONSTANTES, ALTA, QUIROFANO, ANALITICA, RADIOGRAFIA, URGENCIAS],
    fichas: [
      { t: "Toma de constantes en planta", s: "2 calles · 11 pasos · una decisión y dos documentos. El más sencillo para empezar.", href: "#/flujo/ej-fl-constantes/4" },
      { t: "Alta hospitalaria programada", s: "3 calles · 17 pasos · tres decisiones y dos finales (alta o continúa ingreso).", href: "#/flujo/ej-fl-alta/4" },
      { t: "Preparación de quirófano", s: "3 calles · 16 pasos · Enfermería interviene dos veces: prueba «Calles por turnos».", href: "#/flujo/ej-fl-quirofano/4" },
      { t: "Solicitud de analítica urgente", s: "5 calles · 18 pasos · dos vueltas atrás y una señal de alarma.", href: "#/flujo/ej-fl-analitica/4" },
      { t: "Petición de radiografía simple", s: "5 calles · 21 pasos · 3 subprocesos, cuatro decisiones, una vuelta atrás y dos finales.", href: "#/flujo/ej-fl-radiografia/4" }
    ],
    urgencias: { t: "Atención integral en el Servicio de Urgencias", s: "El proceso general del curso: dos entradas, 5 calles, 7 subprocesos, Laboratorio y Radiología como procesos externos, tres destinos y el marco de procesos estratégicos, clave y de soporte. Los avisos llevan los números de fallo del AMFE de Urgencias, como el mapa de riesgos del Documento Final.", href: "#/flujo/ej-fl-urgencias/5" },
    proximos: []
  };

  const API = { TEMAS, GLOSARIO, EJEMPLOS };
  if (typeof module !== "undefined" && module.exports) module.exports = API;
  else raiz.Contenido = API;
})(typeof window !== "undefined" ? window : this);

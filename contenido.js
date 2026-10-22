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
      practica: { texto: "Crear un flujograma", href: "#/flujo/nuevo" } }
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
    return Object.assign({ id, titulo: "", unidad: "", incluye: "", excluye: "", responsable: "", fecha: "", puntos: [], vista: { orientacion: "vertical", calles: "actor", subprocesos: true, letra: "normal", numeros: true, marco: false },
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
    ] });

  const EJEMPLOS = {
    flujos: [CONSTANTES, RADIOGRAFIA],
    fichas: [
      { t: "Toma de constantes en planta", s: "2 calles · 11 pasos · una decisión y dos documentos. El más sencillo para empezar.", href: "#/flujo/ej-fl-constantes/4" },
      { t: "Petición de radiografía simple", s: "5 calles · 21 pasos · 3 subprocesos, cuatro decisiones, una vuelta atrás y dos finales.", href: "#/flujo/ej-fl-radiografia/4" }
    ],
    proximos: ["Alta hospitalaria programada", "Preparación de quirófano para cirugía programada", "Solicitud de analítica urgente", "Atención integral en el Servicio de Urgencias"]
  };

  const API = { TEMAS, GLOSARIO, EJEMPLOS };
  if (typeof module !== "undefined" && module.exports) module.exports = API;
  else raiz.Contenido = API;
})(typeof window !== "undefined" ? window : this);

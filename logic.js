// ============================================================
//  logic.js — Lógica PURA (sin DOM) · Flujograma
//  Modelo del flujograma (proceso, actores = calles, subprocesos, pasos con
//  su tipo, quién los hace y a qué paso siguen, puntos críticos), avisos
//  didácticos por paso (validador), escritura rápida (una lista o una tabla
//  pegada → pasos), colocación automática del dibujo (`disponer`), progreso
//  y «tu siguiente paso», saneado por esquema y fusión.
//  window.Logica en navegador y module.exports en Node (tests).
// ============================================================
(function (raiz) {
  "use strict";

  const VERSION_DATOS = 1;
  const URL_AMFE = "https://cjgaland.github.io/amfe/";
  const URL_AUD = "https://cjgaland.github.io/auditorias/";
  const URL_IND = "https://cjgaland.github.io/indicadores-calidad/";
  const URL_TM = "https://cjgaland.github.io/tamano-muestral/";

  // ---------- Utilidades ----------
  const lleno = v => v != null && String(v).trim() !== "";
  const sinTildes = s => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
  const num = v => { if (typeof v === "number") return v; const s = String(v == null ? "" : v).trim().replace(/\s/g, "").replace(",", "."); return s === "" || isNaN(s) ? NaN : Number(s); };
  const corto = (s, n = 60) => { s = String(s || "").trim(); return s.length > n ? s.slice(0, n - 1) + "…" : s || "sin nombre"; };
  const normal = s => sinTildes(s).replace(/[^a-z0-9ñ ]/g, " ").replace(/\s+/g, " ").trim();
  const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;
  const listaY = l => l.length > 1 ? l.slice(0, -1).join(", ") + " y " + l[l.length - 1] : l.join("");
  const mayuscula = s => { s = String(s || "").trim(); return s ? s[0].toUpperCase() + s.slice(1) : s; };
  const minuscula = s => { s = String(s || "").trim().replace(/[.]$/, ""); return s && /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]/.test(s) ? s[0].toLowerCase() + s.slice(1) : s; };

  // ---------- Pasos del asistente ----------
  const PASOS = [
    { n: 1, k: "proceso", corto: "Proceso", titulo: "El proceso", que: "Qué proceso vais a dibujar, para qué sirve, dónde empieza y dónde acaba.", entrega: 1 },
    { n: 2, k: "actores", corto: "Actores", titulo: "Actores y subprocesos", que: "Quién interviene (cada uno será una calle del dibujo) y en qué fases se divide.", entrega: 1 },
    { n: 3, k: "pasos", corto: "Pasos", titulo: "Los pasos", que: "Cada paso con su tipo, quién lo hace y a qué paso sigue. Se puede pegar una lista.", entrega: 1 },
    { n: 4, k: "dibujo", corto: "Dibujo", titulo: "El dibujo", que: "La app dibuja el flujograma con los símbolos normalizados. Se revisa con el equipo.", entrega: 1 },
    { n: 5, k: "puntos", corto: "Puntos", titulo: "Puntos críticos", que: "Dónde puede fallar el proceso: se marcan numerados encima del dibujo.", entrega: 2 },
    { n: 6, k: "exportar", corto: "Exportar", titulo: "Documentos y exportar", que: "Imagen, PDF, Word, draw.io y Excel.", entrega: 2 }
  ];

  // ---------- Tipos de paso (símbolos del curso, con sus colores de las plantillas de draw.io) ----------
  const TIPOS = {
    terminal: { nom: "Inicio / fin", corto: "Inicio/fin", forma: "Rectángulo redondeado", que: "Dónde empieza o dónde acaba el proceso.", relleno: "#d5e8d4", borde: "#82b366" },
    actividad: { nom: "Actividad", corto: "Actividad", forma: "Rectángulo", que: "Algo que alguien hace. Se escribe con un verbo: «Extrae la muestra».", relleno: "#fff2cc", borde: "#d6b656" },
    decision: { nom: "Decisión", corto: "Decisión", forma: "Rombo", que: "Una pregunta que se responde Sí o No: «¿Valores normales?».", relleno: "#ffe6cc", borde: "#d79b00" },
    datos: { nom: "Datos", corto: "Datos", forma: "Paralelogramo", que: "Se leen o se registran datos (historia clínica, sistema informático).", relleno: "#e1d5e7", borde: "#9673a6" },
    documento: { nom: "Documento", corto: "Documento", forma: "Hoja con la base ondulada", que: "Un papel o informe que se usa o se genera («Hoja de tratamiento»).", relleno: "#dae8fc", borde: "#6c8ebf" },
    externo: { nom: "Proceso externo", corto: "Externo", forma: "Rectángulo con doble lateral", que: "Otro proceso u otro servicio que se usa pero no se detalla (Radiología, Laboratorio).", relleno: "#f8cecc", borde: "#b85450" }
  };
  const ORDEN_TIPOS = ["terminal", "actividad", "decision", "datos", "documento", "externo"];
  const COLORES_SUB = 8;   // número de colores de subproceso (styles.css: .sub-c0 … .sub-c7)
  // Mismos colores que styles.css (modo claro), para el dibujo (que siempre va sobre papel blanco)
  const COLOR_SUB_HEX = ["#2563eb", "#7c3aed", "#c026d3", "#0f766e", "#475569", "#92400e", "#1e3a8a", "#0284c7"];

  // Actores habituales (propuestas a un toque)
  const ACTORES_SUG = ["Facultativo", "Enfermería", "TCAE", "Celador", "Administrativo", "Técnico de Radiología", "Técnico de Laboratorio", "Farmacia", "Trabajo social", "Paciente", "Familia"];

  // ---------- Fábricas ----------
  function nuevoFlujo(id, fecha) {
    return { id, titulo: "", proceso: "", unidad: "", objetivo: "", inicio: "", fin: "", incluye: "", excluye: "", responsable: "", fecha: "",
      actores: [], subprocesos: [], pasos: [], puntos: [], vista: nuevaVista(), marco: { estrategicos: [], soporte: [] },
      validado: "", edicion: "00", anteriorId: "", tipoEdicion: "actual", control: nuevoControl(), notas: "", creado: fecha, modificado: fecha };
  }
  const nuevaVista = () => ({ orientacion: "vertical", calles: "actor", subprocesos: true, letra: "normal", numeros: true, marco: false });
  function nuevoActor(id, nombre = "") { return { id, nombre }; }
  function nuevoSubproceso(id, color = 0) { return { id, nombre: "", descripcion: "", inicio: "", fin: "", roles: "", color: String(color % COLORES_SUB), origenApp: "", origenId: "" }; }
  // siguientes: flechas que salen del paso. En una decisión, la del Sí lleva etiqueta "si" y la del No, "no".
  // con: un documento o unos datos «pegados» a una actividad (se dibujan a su lado).
  function nuevoPaso(id, num, tipo = "actividad") { return { id, num, tipo, texto: "", actorId: "", subprocesoId: "", siguientes: [], con: "", nota: "", ajuste: { fila: "", lado: "" } }; }
  const nuevaFlecha = (a, etiqueta = "", estilo = "normal") => ({ a, etiqueta, estilo });
  function nuevoPunto(id, num) { return { id, num, pasoId: "", titulo: "", descripcion: "", fallos: [], origen: "manual" }; }
  function nuevaPersona() { return { nombre: "", cargo: "" }; }
  function nuevoControl() { return { elaborado: [nuevaPersona()], revisado: [nuevaPersona()], aprobado: [nuevaPersona()], historial: [{ edicion: "00", fecha: "", cambio: "Documento inicial" }] }; }
  const siguienteNum = (lista) => lista.reduce((m, x) => Math.max(m, Number(x.num) || 0), 0) + 1;
  function colorLibre(f) {
    const usados = f.subprocesos.map(s => s.color);
    for (let i = 0; i < COLORES_SUB; i++) if (!usados.includes(String(i))) return i;
    return f.subprocesos.length % COLORES_SUB;
  }
  const actorDe = (f, p) => f.actores.find(x => x.id === p.actorId) || null;
  const subDe = (f, p) => f.subprocesos.find(s => s.id === p.subprocesoId) || null;
  const pasoDe = (f, id) => f.pasos.find(p => p.id === id) || null;
  const buscaActor = (f, nombre) => f.actores.find(a => normal(a.nombre) === normal(nombre)) || null;

  function sugerirObjetivo(f) {
    const p = lleno(f.proceso) ? f.proceso.trim() : "";
    if (!p) return "";
    const tramoTxt = lleno(f.inicio) && lleno(f.fin) ? `, desde ${minuscula(f.inicio)} hasta ${minuscula(f.fin)}` : "";
    return `Garantizar que el proceso «${p}» se realiza de forma segura, ordenada y sin pérdidas de información entre profesionales${tramoTxt}.`;
  }

  // ---------- El grafo: entradas, salidas, inicios y fines ----------
  // Flechas válidas (a un paso que existe y que no es el mismo)
  function flechas(f) {
    const ids = new Set(f.pasos.map(p => p.id)), E = [];
    f.pasos.forEach(p => p.siguientes.forEach((s, i) => { if (ids.has(s.a) && s.a !== p.id) E.push({ de: p.id, a: s.a, etiqueta: s.etiqueta || "", estilo: s.estilo || "normal", i }); }));
    return E;
  }
  function entradas(f) {
    const m = new Map(f.pasos.map(p => [p.id, []]));
    flechas(f).forEach(e => m.get(e.a).push(e));
    return m;
  }
  // Un terminal es inicio si nadie apunta a él, y fin si no apunta a nadie
  function papelTerminal(f, p, ent) {
    if (p.tipo !== "terminal") return "";
    const E = (ent || entradas(f)).get(p.id) || [], S = p.siguientes.filter(s => pasoDe(f, s.a) && s.a !== p.id);
    if (!E.length && S.length) return "inicio";
    if (E.length && !S.length) return "fin";
    if (!E.length && !S.length) return f.pasos.indexOf(p) === 0 ? "inicio" : "fin";
    return "medio";
  }
  const esInicio = (f, p, ent) => papelTerminal(f, p, ent) === "inicio";
  const esFin = (f, p, ent) => papelTerminal(f, p, ent) === "fin";
  const anexoDe = (f, p) => (p.tipo === "documento" || p.tipo === "datos") && lleno(p.con) && p.con !== p.id ? pasoDe(f, p.con) : null;
  // Pasos a los que se llega desde los inicios
  function alcanzables(f) {
    const ent = entradas(f), ini = f.pasos.filter(p => esInicio(f, p, ent));
    const semillas = ini.length ? ini : f.pasos.slice(0, 1), vistos = new Set(), cola = semillas.map(p => p.id);
    const sal = new Map(f.pasos.map(p => [p.id, []])); flechas(f).forEach(e => sal.get(e.de).push(e.a));
    while (cola.length) { const id = cola.shift(); if (vistos.has(id)) continue; vistos.add(id); sal.get(id).forEach(x => cola.push(x)); }
    // Lo pegado a un paso al que se llega también cuenta como alcanzado
    f.pasos.forEach(p => { const h = anexoDe(f, p); if (h && vistos.has(h.id)) vistos.add(p.id); });
    return vistos;
  }
  // Pasos desde los que se llega a algún fin
  function llegaAFin(f) {
    const ent = entradas(f), fines = f.pasos.filter(p => esFin(f, p, ent)).map(p => p.id), ok = new Set(), cola = fines.slice();
    while (cola.length) { const id = cola.shift(); if (ok.has(id)) continue; ok.add(id); (ent.get(id) || []).forEach(e => cola.push(e.de)); }
    return ok;
  }

  // ---------- Avisos didácticos (cada aviso: nivel error | warn | nota, texto y, si es de un paso, su id) ----------
  const DOC_NOMBRES = ["hoja", "informe", "documento", "volante", "historia", "etiqueta", "etiquetas", "consentimiento", "receta", "formulario", "impreso"];
  function avisosProceso(f) {
    const r = [];
    if (!lleno(f.proceso)) r.push({ nivel: "warn", texto: "Escribe el nombre del proceso que vais a dibujar." });
    if (!lleno(f.inicio) || !lleno(f.fin)) r.push({ nivel: "warn", texto: "Falta dónde empieza o dónde acaba el proceso. Sin unos límites claros el dibujo crece sin parar (el tema 3 insiste: no abarcar demasiado)." });
    else if (normal(f.inicio) === normal(f.fin)) r.push({ nivel: "warn", texto: "El inicio y el fin son iguales: ¿seguro?" });
    if (lleno(f.proceso) && !lleno(f.objetivo)) r.push({ nivel: "nota", texto: "Escribe el objetivo del proceso (o pide uno propuesto): ayuda a ver qué pasos sobran y dónde está el riesgo." });
    return r;
  }
  // Roles de los subprocesos que no son ningún actor
  function rolesSinCalle(f) {
    const r = [], vistos = new Set();
    f.subprocesos.forEach(s => String(s.roles || "").split(/,|;|\s+y\s+|\//).map(x => x.trim()).filter(Boolean).forEach(x => {
      const n = normal(x); if (vistos.has(n) || buscaActor(f, x)) return; vistos.add(n); r.push(mayuscula(x));
    }));
    return r;
  }
  function avisosActores(f) {
    const r = [], A = f.actores.filter(a => lleno(a.nombre));
    if (!A.length) r.push({ nivel: "warn", texto: "Añade al menos un actor: cada profesional o servicio que interviene será una calle (una columna) del dibujo." });
    else if (A.length === 1) r.push({ nivel: "nota", texto: "Solo hay un actor. ¿Seguro que nadie más interviene (celadores, administrativos, el propio paciente)? Los cambios de manos son donde más se falla." });
    if (A.length > 8) r.push({ nivel: "warn", texto: `Hay ${A.length} actores: el dibujo será muy ancho. ¿Podéis agrupar algunos (por ejemplo, «Enfermería/TCAE»)?` });
    const nombres = new Map(); A.forEach(a => { const n = normal(a.nombre); nombres.set(n, (nombres.get(n) || 0) + 1); });
    [...nombres].filter(([, c]) => c > 1).forEach(([n]) => r.push({ nivel: "warn", texto: `El actor «${A.find(a => normal(a.nombre) === n).nombre}» está repetido.` }));
    if (f.pasos.length) A.filter(a => !f.pasos.some(p => p.actorId === a.id)).forEach(a => r.push({ nivel: "nota", texto: `«${a.nombre}» no hace ningún paso: no saldrá en el dibujo.` }));
    f.subprocesos.forEach((s, i) => {
      const nom = lleno(s.nombre) ? `«${corto(s.nombre, 50)}»` : `nº ${i + 1}`;
      if (!lleno(s.nombre)) r.push({ nivel: "warn", texto: `El subproceso nº ${i + 1} no tiene nombre.` });
      if (!lleno(s.inicio) || !lleno(s.fin)) r.push({ nivel: "nota", texto: `Al subproceso ${nom} le falta el inicio o el fin.` });
    });
    const sin = rolesSinCalle(f);
    if (sin.length) r.push({ nivel: "nota", k: "roles", texto: `Los subprocesos citan ${sin.length === 1 ? "a" : "a"} ${listaY(sin.map(x => "«" + x + "»"))}, que no ${sin.length === 1 ? "es" : "son"} ningún actor.` });
    return r;
  }
  function avisosPasos(f) {
    const r = [], P = f.pasos;
    if (!P.length) return [{ nivel: "nota", texto: "Aún no hay pasos. Escríbelos uno a uno o pega una lista: la app los encadena y dibuja el flujograma." }];
    const ent = entradas(f), alc = alcanzables(f), fin = llegaAFin(f);
    const ini = P.filter(p => esInicio(f, p, ent)), fines = P.filter(p => esFin(f, p, ent));
    if (!ini.length) r.push({ nivel: "error", texto: "Falta el inicio: añade al principio un paso de tipo «Inicio / fin» (por ejemplo, «Llega el paciente»)." });
    if (!fines.length) r.push({ nivel: "error", texto: "Falta el fin: añade al final un paso de tipo «Inicio / fin» (por ejemplo, «Alta a domicilio»)." });
    const etq = p => `El paso nº ${p.num}${lleno(p.texto) ? ` («${corto(p.texto, 40)}»)` : ""}`;
    let sinFinAvisado = false;
    P.forEach(p => {
      const S = p.siguientes.filter(s => pasoDe(f, s.a) && s.a !== p.id), anexo = anexoDe(f, p);
      if (!lleno(p.texto)) r.push({ nivel: "warn", paso: p.id, texto: `El paso nº ${p.num} no tiene texto.` });
      if (p.tipo !== "terminal" && p.tipo !== "externo" && !actorDe(f, p)) r.push({ nivel: "warn", paso: p.id, texto: `${etq(p)}: ¿quién lo hace? Elige un actor (si no, sale en la calle «Sin asignar»).` });
      if (p.tipo === "decision") {
        const si = S.filter(s => s.etiqueta === "si").length, no = S.filter(s => s.etiqueta === "no").length;
        if (!si || !no) r.push({ nivel: "error", paso: p.id, texto: `${etq(p)} es una decisión y le falta la salida del ${!si && !no ? "Sí y la del No" : !si ? "Sí" : "No"}. Una decisión siempre tiene las dos.` });
        if (S.length > 2) r.push({ nivel: "warn", paso: p.id, texto: `${etq(p)} tiene ${S.length} salidas. Una decisión solo tiene Sí y No: si hay más opciones, encadena dos decisiones.` });
        if (lleno(p.texto) && !/\?\s*$/.test(p.texto)) r.push({ nivel: "warn", paso: p.id, texto: `${etq(p)} es una decisión: escríbela como pregunta que se responde Sí o No (por ejemplo, «¿${mayuscula(p.texto.replace(/[.¿?]/g, "").trim())}?»).` });
      } else if (!S.length && p.tipo !== "terminal" && !anexo) {
        if (p.tipo === "documento" || p.tipo === "datos") r.push({ nivel: "nota", paso: p.id, texto: `${etq(p)} no lleva a ningún sitio. Si es un papel que acompaña a una actividad, pégalo a ella («Va con»).` });
        else r.push({ nivel: "error", paso: p.id, texto: `${etq(p)} no lleva a ningún sitio (callejón sin salida). Di a qué paso sigue, o termina en un fin.` });
      }
      if (p.tipo === "terminal" && papelTerminal(f, p, ent) === "medio") r.push({ nivel: "warn", paso: p.id, texto: `${etq(p)} es de tipo «Inicio / fin» pero está en medio del proceso. ¿No será una actividad?` });
      if (!alc.has(p.id) && ini.length) r.push({ nivel: "warn", paso: p.id, texto: `${etq(p)}: no se llega a él desde ningún inicio. ¿Qué paso lleva hasta aquí?` });
      if (!sinFinAvisado && fines.length && S.length && !fin.has(p.id) && alc.has(p.id)) { sinFinAvisado = true; r.push({ nivel: "warn", paso: p.id, texto: `Desde ${etq(p).replace(/^El paso/, "el paso")} no se llega a ningún fin: ¿hay una vuelta atrás que nunca termina?` }); }
      if (p.tipo === "actividad" && DOC_NOMBRES.includes(normal(p.texto).split(" ")[0])) r.push({ nivel: "nota", paso: p.id, texto: `${etq(p)} parece un papel, no algo que alguien hace. ¿No será del tipo «Documento»?` });
      if (String(p.texto || "").length > 70) r.push({ nivel: "nota", paso: p.id, texto: `${etq(p)} es largo: resume en el dibujo y deja el detalle en la nota.` });
      if (lleno(p.con) && !anexo) r.push({ nivel: "nota", paso: p.id, texto: `${etq(p)}: solo los documentos y los datos se pueden pegar a otro paso.` });
    });
    if (P.length > 25 && !f.subprocesos.length) r.push({ nivel: "nota", texto: `Hay ${P.length} pasos. Con tantos, conviene dividir el proceso en subprocesos (paso 2) para que el dibujo se lea por partes.` });
    return r;
  }
  const avisos = f => ({ 1: avisosProceso(f), 2: avisosActores(f), 3: avisosPasos(f), 4: avisosPasos(f) });
  const errores = f => avisosPasos(f).filter(a => a.nivel === "error");

  // ---------- Progreso y «tu siguiente paso» ----------
  function progreso(f) {
    const P = f.pasos, ent = entradas(f);
    const pasosOk = P.length >= 3 && P.some(p => esInicio(f, p, ent)) && P.some(p => esFin(f, p, ent)) && !errores(f).length;
    return {
      1: lleno(f.proceso) && lleno(f.inicio) && lleno(f.fin),
      2: f.actores.some(a => lleno(a.nombre)),
      3: pasosOk,
      4: pasosOk && lleno(f.validado),
      5: pasosOk && f.puntos.some(x => lleno(x.titulo)),
      6: false
    };
  }
  function pasoPendiente(f, entrega) {
    const g = progreso(f), disp = PASOS.filter(p => p.entrega <= entrega);
    return disp.find(x => !g[x.n]) || null;
  }
  const TEXTO_PASO = {
    1: f => lleno(f.proceso) ? `Escribe dónde empieza y dónde acaba «${corto(f.proceso, 50)}».` : "Describe el proceso que vais a dibujar: nombre, dónde empieza y dónde acaba.",
    2: () => "Di quién interviene: cada profesional o servicio será una calle del dibujo.",
    3: f => f.pasos.length ? "Revisa los pasos: el validador te dice qué falta (inicio, fin, salidas de las decisiones…)." : "Escribe los pasos del proceso, o pega una lista: la app los encadena y dibuja el flujograma.",
    4: () => "Mira el dibujo, revísalo con el equipo y márcalo como validado.",
    5: () => "Marca los puntos críticos: dónde puede fallar el proceso.",
    6: () => "Descarga el flujograma."
  };
  function siguientePaso(datos, entrega) {
    const L = datos.flujos;
    if (!L.length) return { k: "crear", texto: "Empieza tu primer flujograma: elige un proceso de tu unidad y escribe sus pasos. La app lo dibuja sola.", href: "#/flujo/nuevo", btn: "Crear un flujograma" };
    const f = L.slice().sort((x, y) => String(y.modificado).localeCompare(String(x.modificado)))[0];
    const p = pasoPendiente(f, entrega), nom = corto(f.titulo || f.proceso || "tu flujograma", 50);
    if (p) return { k: "paso" + p.n, texto: `«${nom}»: ${TEXTO_PASO[p.n](f)}`, href: `#/flujo/${f.id}/${p.n}`, btn: `Ir al paso ${p.n}` };
    return { k: "listo", texto: `«${nom}» está dibujado y validado. Pronto podrás marcar los puntos críticos y descargarlo en imagen, PDF, Word y draw.io.`, href: `#/flujo/${f.id}/4`, btn: "Ver el dibujo" };
  }
  function resumen(f) {
    const ent = entradas(f);
    return {
      pasos: f.pasos.length, actores: f.actores.filter(a => lleno(a.nombre)).length, subprocesos: f.subprocesos.filter(s => lleno(s.nombre)).length,
      decisiones: f.pasos.filter(p => p.tipo === "decision").length, puntos: f.puntos.length,
      traspasos: flechas(f).filter(e => { const a = pasoDe(f, e.de), b = pasoDe(f, e.a); return a.actorId && b.actorId && a.actorId !== b.actorId; }).length,
      errores: errores(f).length, inicios: f.pasos.filter(p => esInicio(f, p, ent)).length
    };
  }

  // ---------- Escritura rápida: una lista o una tabla → pasos ----------
  // Actor por la primera palabra («Enfermera consulta…» → Enfermería). El orden importa: lo más concreto primero.
  const ACTOR_PATRONES = [
    [/^(?:el |la |los |las )?t[eé]cnic[oa]s? (?:de |en )?(?:rayos|radiolog[ií]a|radiodiagn[oó]stico|imagen)\b/i, "Técnico de Radiología"],
    [/^(?:el |la |los |las )?t[eé]cnic[oa]s? (?:de |en )?laboratorio\b/i, "Técnico de Laboratorio"],
    [/^(?:el |la |los |las )?t[eé]cnic[oa]s?\b/i, "Técnico"],
    [/^(?:el |la |los |las )?radi[oó]log[oa]s?\b/i, "Radiólogo"],
    [/^(?:el |la |los |las )?(?:enfermer[oa]s?|enfermer[ií]a|due)(?: de (quir[oó]fano|triaje|planta|urgencias|enlace))?\b/i, "Enfermería"],
    [/^(?:el |la |los |las )?(?:tcae|auxiliar(?:es)?(?: de enfermer[ií]a)?)\b/i, "TCAE"],
    [/^(?:el |la |los |las )?(?:m[eé]dic[oa]s?|facultativ[oa]s?|doctor(?:a)?)\b/i, "Facultativo"],
    [/^(?:el |la |los |las )?celador(?:a|es|as)?\b/i, "Celador"],
    [/^(?:el |la |los |las )?(?:administrativ[oa]s?|admisi[oó]n)\b/i, "Administrativo"],
    [/^(?:el |la |los |las )?(?:farmac[eé]utic[oa]s?|farmacia)\b/i, "Farmacia"],
    [/^(?:el |la |los |las )?trabajador(?:a)? social\b/i, "Trabajo social"],
    [/^(?:el |la |los |las )?pacientes?\b/i, "Paciente"],
    [/^(?:el |la |los |las )?(?:familia|familiar(?:es)?|acompañantes?)\b/i, "Familia"]
  ];
  function adivinarActor(texto) {
    const t = String(texto || "").trim();
    for (const [re, nom] of ACTOR_PATRONES) {
      const m = re.exec(t); if (!m) continue;
      const resto = t.slice(m[0].length).replace(/^[\s,:-]+/, "");
      // Solo si después viene algo (si no, la frase es el actor y nada más)
      if (!resto) return { actor: "", resto: t };
      const actor = nom === "Enfermería" && m[1] ? `Enfermería de ${sinTildes(m[1]) === "quirofano" ? "quirófano" : m[1].toLowerCase()}` : nom;
      return { actor, resto: mayuscula(resto) };
    }
    return { actor: "", resto: t };
  }
  const limpiaLinea = l => String(l || "").replace(/^\s*(?:[-–•*]|\d+\s*[.)º-]|[a-z]\))\s*/i, "").replace(/\s*[.;]\s*$/, "").trim();
  // Una lista (una línea por paso) → filas { k, tipo, texto, actor, sig: [{ k, etiqueta }] }
  function leerLista(texto, opc = {}) {
    const lineas = String(texto || "").replace(/\r\n?/g, "\n").split("\n").map(limpiaLinea).filter(Boolean);
    const items = []; let actorPrevio = "";
    lineas.forEach(l => {
      let m, tipo = "actividad", txt = l;
      if ((m = /^(inicio|comienzo|entrada)\s*[:-]\s*(.+)$/i.exec(l)) || /^(inicio|comienzo)$/i.test(l)) { items.push({ tipo: "terminal", texto: m ? mayuscula(m[2]) : "Inicio", actor: "" }); return; }
      if ((m = /^(fin|final|salida|destino)\s*[:-]\s*(.+)$/i.exec(l)) || /^(fin|final)$/i.test(l)) { items.push({ tipo: "terminal", texto: m ? mayuscula(m[2]) : "Fin", actor: "", fin: true }); return; }
      if ((m = /^(documento|doc|papel)\s*[:-]\s*(.+)$/i.exec(l))) { tipo = "documento"; txt = m[2]; }
      else if ((m = /^(datos|registro)\s*[:-]\s*(.+)$/i.exec(l))) { tipo = "datos"; txt = m[2]; }
      else if ((m = /^(externo|proceso externo|servicio)\s*[:-]\s*(.+)$/i.exec(l))) { tipo = "externo"; txt = m[2]; }
      // Un proceso externo (Laboratorio, Radiología) no es de nadie: no hereda el actor ni lo cambia
      if (tipo === "externo") { items.push({ tipo, texto: mayuscula(txt), actor: "" }); return; }
      const g = adivinarActor(txt), actor = g.actor || actorPrevio;
      if (g.actor) actorPrevio = g.actor;
      txt = g.resto;
      if (tipo === "actividad" && (/^¿/.test(txt) || /\?$/.test(txt))) { items.push({ tipo: "decision", texto: "¿" + mayuscula(txt.replace(/^¿|\?$/g, "").trim()) + "?", actor, pregunta: true }); return; }
      // «Informa al médico si hay valores anómalos» o «Si hay valores anómalos, informa al médico» → decisión + actividad
      let cond = null, accion = null;
      if (tipo === "actividad" && (m = /^si\s+(.+?),\s*(.+)$/i.exec(txt))) { cond = m[1]; accion = m[2]; }
      else if (tipo === "actividad" && (m = /^(.*\S)\s+si\s+(.+)$/i.exec(txt)) && m[1].split(" ").length >= 2) { accion = m[1]; cond = m[2]; }
      if (cond) {
        items.push({ tipo: "decision", texto: "¿" + mayuscula(cond.trim()) + "?", actor, condicional: true });
        items.push({ tipo: "actividad", texto: mayuscula(accion.trim()), actor, rama: true });
        return;
      }
      items.push({ tipo, texto: mayuscula(txt), actor });
    });
    if (opc.terminales !== false && items.length) {
      if (items[0].tipo !== "terminal") items.unshift({ tipo: "terminal", texto: "Inicio", actor: "" });
      if (items[items.length - 1].tipo !== "terminal") items.push({ tipo: "terminal", texto: "Fin", actor: "", fin: true });
    }
    // Encadenado: cada uno al siguiente; la decisión de una condición va por el Sí a su actividad y por el No a lo que viene después
    const filas = items.map((x, i) => ({ k: String(i), tipo: x.tipo, texto: x.texto, actor: x.actor, subproceso: "", sig: [] }));
    items.forEach((x, i) => {
      const fila = filas[i], sig = i + 1 < items.length ? String(i + 1) : null;
      if (x.tipo === "terminal" && x.fin) return;
      if (x.condicional) { fila.sig.push({ k: String(i + 1), etiqueta: "si" }); if (i + 2 < items.length) fila.sig.push({ k: String(i + 2), etiqueta: "no" }); return; }
      if (x.pregunta) { if (sig) fila.sig.push({ k: sig, etiqueta: "si" }); return; }
      if (sig) fila.sig.push({ k: sig, etiqueta: "" });
    });
    return filas;
  }
  // Una tabla pegada desde Excel, Calc o Word → mismas filas
  const CAB_PEGAR = {
    num: ["n", "no", "nº", "n.º", "numero", "num", "id", "paso n", "n paso"],
    tipo: ["tipo", "simbolo", "forma"],
    texto: ["texto", "paso", "pasos", "actividad", "actividades", "descripcion", "que se hace", "tarea"],
    actor: ["quien", "quien lo hace", "actor", "actores", "responsable", "rol", "calle", "profesional"],
    subproceso: ["subproceso", "fase", "etapa"],
    sigue: ["sigue a", "siguiente", "siguientes", "va a", "sigue", "despues"],
    si: ["si", "si ->", "si →"],
    no: ["no", "no ->", "no →"]
  };
  function tipoDeTexto(t) {
    const s = normal(t);
    if (/^(inicio|fin|terminal|inicio fin|inicio o fin)$/.test(s)) return "terminal";
    if (/^decision/.test(s) || s === "rombo") return "decision";
    if (/^dato/.test(s)) return "datos";
    if (/^doc/.test(s)) return "documento";
    if (/externo|predefinido/.test(s)) return "externo";
    if (/^(actividad|tarea|accion)/.test(s)) return "actividad";
    return "";
  }
  function leerTabla(texto) {
    const lineas = String(texto || "").replace(/\r\n?/g, "\n").split("\n").filter(l => l.trim());
    const sep = lineas.some(l => l.includes("\t")) ? "\t" : ";";
    const celdas = lineas.map(l => l.split(sep).map(c => c.trim().replace(/^"(.*)"$/, "$1")));
    let mapa = ["num", "tipo", "texto", "actor", "sigue"], cabecera = false;
    const rec = celdas[0].map(c => { const t = normal(c); return Object.keys(CAB_PEGAR).find(k => CAB_PEGAR[k].includes(t)) || null; });
    if (rec.filter(Boolean).length >= 2) { cabecera = true; mapa = rec; celdas.shift(); }
    const filas = [];
    celdas.forEach((c, i) => {
      const r = {}; c.forEach((v, j) => { const k = mapa[j]; if (k && r[k] === undefined) r[k] = v; });
      if (!lleno(r.texto)) return;
      const n = Number.isFinite(num(r.num)) ? String(num(r.num)) : "f" + i;
      let tipo = tipoDeTexto(r.tipo || "");
      if (!tipo) tipo = /\?\s*$/.test(r.texto) ? "decision" : "actividad";
      const nums = s => (String(s || "").match(/\d+/g) || []);
      const sig = [];
      if (lleno(r.si) || lleno(r.no)) { nums(r.si).slice(0, 1).forEach(k => sig.push({ k, etiqueta: "si" })); nums(r.no).slice(0, 1).forEach(k => sig.push({ k, etiqueta: "no" })); }
      if (lleno(r.sigue)) {
        const s = String(r.sigue), mSi = /s[ií]\s*[→>:-]*\s*(\d+)/i.exec(s), mNo = /no\s*[→>:-]*\s*(\d+)/i.exec(s);
        if (tipo === "decision" && (mSi || mNo)) { if (mSi) sig.push({ k: mSi[1], etiqueta: "si" }); if (mNo) sig.push({ k: mNo[1], etiqueta: "no" }); }
        else nums(s).forEach((k, j) => sig.push({ k, etiqueta: tipo === "decision" ? (j === 0 ? "si" : j === 1 ? "no" : "") : "" }));
      }
      filas.push({ k: n, tipo, texto: r.texto.slice(0, 300), actor: (r.actor || "").trim(), subproceso: (r.subproceso || "").trim(), sig, tieneSigue: lleno(r.sigue) || lleno(r.si) || lleno(r.no) });
    });
    // Si la tabla no dice a qué paso sigue cada uno, se encadenan en orden
    if (filas.length && !filas.some(x => x.tieneSigue)) filas.forEach((x, i) => { if (i + 1 < filas.length) x.sig.push({ k: filas[i + 1].k, etiqueta: x.tipo === "decision" ? "si" : "" }); });
    return { filas, cabecera };
  }
  // Decide si lo pegado es una tabla (columnas) o una lista (una línea por paso)
  function leerPegado(texto, opc) {
    const lineas = String(texto || "").split(/\r?\n/).filter(l => l.trim());
    const conCols = lineas.filter(l => l.split(l.includes("\t") ? "\t" : ";").length >= 2).length;
    if (lineas.length && conCols >= Math.max(1, Math.ceil(lineas.length * 0.6))) { const t = leerTabla(texto); return { modo: "tabla", filas: t.filas, cabecera: t.cabecera }; }
    return { modo: "lista", filas: leerLista(texto, opc), cabecera: false };
  }
  // Añade las filas al flujograma: crea los actores y subprocesos que falten y une el último paso abierto con el primero nuevo.
  function incorporarPasos(f, filas, genId) {
    if (!filas.length) return { pasos: 0, actores: 0, subprocesos: 0 };
    let nAct = 0, nSub = 0, n = siguienteNum(f.pasos);
    const abierto = f.pasos.slice().reverse().find(p => !p.siguientes.length && p.tipo !== "terminal" && !anexoDe(f, p));
    const clave = new Map(), nuevos = [];
    filas.forEach(x => {
      const p = nuevoPaso(genId(), n++, ORDEN_TIPOS.includes(x.tipo) ? x.tipo : "actividad");
      p.texto = String(x.texto || "").slice(0, 300);
      if (lleno(x.actor)) { let a = buscaActor(f, x.actor); if (!a) { a = nuevoActor(genId(), mayuscula(x.actor.trim())); f.actores.push(a); nAct++; } p.actorId = a.id; }
      if (lleno(x.subproceso)) { let s = f.subprocesos.find(y => normal(y.nombre) === normal(x.subproceso)); if (!s) { s = nuevoSubproceso(genId(), colorLibre(f)); s.nombre = x.subproceso.trim(); f.subprocesos.push(s); nSub++; } p.subprocesoId = s.id; }
      clave.set(x.k, p.id); nuevos.push([p, x]); f.pasos.push(p);
    });
    nuevos.forEach(([p, x]) => x.sig.forEach(s => { const a = clave.get(s.k); if (a && a !== p.id && !p.siguientes.some(y => y.a === a)) p.siguientes.push(nuevaFlecha(a, s.etiqueta)); }));
    if (abierto && nuevos.length) abierto.siguientes.push(nuevaFlecha(nuevos[0][0].id, ""));
    return { pasos: nuevos.length, actores: nAct, subprocesos: nSub };
  }

  // ---------- Editar el encadenado ----------
  // Inserta un paso nuevo justo después de «p» (en la lista y en el flujo): lo que salía de p sale ahora del nuevo
  function insertarDespues(f, p, nuevo) {
    const i = f.pasos.indexOf(p);
    f.pasos.splice(i < 0 ? f.pasos.length : i + 1, 0, nuevo);
    if (!p) return nuevo;
    if (p.tipo === "decision") return nuevo;
    if (nuevo.tipo === "decision") {
      const ant = p.siguientes.find(s => !s.etiqueta || s.etiqueta === "si");
      nuevo.siguientes = ant ? [nuevaFlecha(ant.a, "si")] : [];
    } else nuevo.siguientes = p.siguientes.filter(s => s.estilo !== "idavuelta").map(s => nuevaFlecha(s.a, ""));
    p.siguientes = p.siguientes.filter(s => s.estilo === "idavuelta").concat([nuevaFlecha(nuevo.id, "")]);
    return nuevo;
  }
  // Quita un paso; quien apuntaba a él pasa a apuntar a lo que venía después (si solo había una salida)
  function quitarPaso(f, id) {
    const p = pasoDe(f, id); if (!p) return;
    const sal = p.siguientes.filter(s => s.a !== id && pasoDe(f, s.a));
    f.pasos.forEach(x => {
      if (x === p) return;
      x.siguientes.forEach(s => { if (s.a === id) s.a = sal.length === 1 ? sal[0].a : ""; });
      x.siguientes = x.siguientes.filter((s, i, l) => lleno(s.a) && s.a !== x.id && l.findIndex(y => y.a === s.a) === i);
      if (x.con === id) x.con = "";
    });
    f.pasos = f.pasos.filter(x => x !== p);
    f.puntos.forEach(x => { if (x.pasoId === id) x.pasoId = ""; });
  }
  // Cambiar el tipo: al pasar a decisión, las salidas se etiquetan Sí / No; al dejar de serlo, se quitan las etiquetas
  function cambiarTipo(p, tipo) {
    if (p.tipo === tipo) return;
    if (tipo === "decision") p.siguientes.forEach((s, i) => { s.etiqueta = i === 0 ? "si" : i === 1 ? "no" : ""; });
    else if (p.tipo === "decision") p.siguientes.forEach(s => { s.etiqueta = ""; });
    if (tipo !== "documento" && tipo !== "datos") p.con = "";
    p.tipo = tipo;
  }
  // Fija la salida del Sí, del No o la n-ésima flecha de un paso
  function ponerSalida(p, cual, destino) {
    const etq = cual === "si" || cual === "no" ? cual : "";
    if (etq) {
      p.siguientes = p.siguientes.filter(s => s.etiqueta !== etq);
      if (lleno(destino) && destino !== p.id) p.siguientes.push(nuevaFlecha(destino, etq));
      p.siguientes.sort((a, b) => ({ si: 0, no: 1 }[a.etiqueta] ?? 2) - ({ si: 0, no: 1 }[b.etiqueta] ?? 2));
      return;
    }
    const i = Number(cual);
    if (!lleno(destino) || destino === p.id) { if (p.siguientes[i]) p.siguientes.splice(i, 1); return; }
    if (p.siguientes.some((s, j) => s.a === destino && j !== i)) return;
    if (p.siguientes[i]) p.siguientes[i].a = destino; else p.siguientes.push(nuevaFlecha(destino, ""));
  }
  // Pasos que no saben quién los hace y roles de subprocesos sin calle: para añadir de un toque
  function anadirActores(f, nombres, genId) {
    let n = 0; nombres.forEach(x => { if (lleno(x) && !buscaActor(f, x)) { f.actores.push(nuevoActor(genId(), mayuscula(x.trim()))); n++; } }); return n;
  }

  // ============================================================
  //  Colocación automática del dibujo (Diseño, sección 6)
  //  Se trabaja en dos ejes: «v» = el sentido del proceso (las filas) y «u» = el ancho (las calles).
  //  En vertical, x = u e y = v; en horizontal, al revés. Así un mismo cálculo sirve para las dos.
  // ============================================================
  const MEDIDAS = {
    terminal: { w: 150, min: 42, chars: 21, extra: 16 },
    actividad: { w: 150, min: 48, chars: 21, extra: 18 },
    externo: { w: 150, min: 48, chars: 18, extra: 18 },
    datos: { w: 160, min: 48, chars: 18, extra: 18 },
    documento: { w: 150, min: 52, chars: 21, extra: 26 },
    decision: { w: 150, min: 84, chars: 13, extra: 54 }
  };
  // Parte un texto en líneas de como mucho «max» letras (las palabras muy largas se cortan)
  function partir(texto, max, maxLineas = 6) {
    const pal = String(texto || "").trim().split(/\s+/).filter(Boolean), l = [];
    let act = "";
    pal.forEach(w => {
      while (w.length > max) { if (act) { l.push(act); act = ""; } l.push(w.slice(0, max - 1) + "-"); w = w.slice(max - 1); }
      if (!act) act = w; else if ((act + " " + w).length <= max) act += " " + w; else { l.push(act); act = w; }
    });
    if (act) l.push(act);
    if (l.length > maxLineas) { const r = l.slice(0, maxLineas); r[maxLineas - 1] = r[maxLineas - 1].replace(/.?$/, "…"); return r; }
    return l.length ? l : [""];
  }
  function medida(p, grande) {
    const M = MEDIDAS[p.tipo] || MEDIDAS.actividad, lh = grande ? 16 : 14, k = grande ? 0.86 : 1;
    // El rombo se ensancha si una palabra no cabe (para no partir «¿Correctamente…»)
    const largo = Math.max(0, ...String(p.texto || "").split(/\s+/).map(x => x.length));
    const base = p.tipo === "decision" ? Math.min(20, Math.max(M.chars, largo)) : M.chars, chars = Math.floor(base * k);
    const w = p.tipo === "decision" ? Math.max(M.w, Math.round(base * 11)) : M.w;
    const lineas = partir(p.texto || "", chars);
    return { w, h: Math.max(M.min, lineas.length * lh + M.extra), lineas, lh };
  }
  const DIB = { GU: 26, CV: 42, CABV: 34, CABH: 118, BANDA: 26, MARGEN: 12 };

  function disponer(f, opc = {}) {
    const V = Object.assign({}, nuevaVista(), f.vista || {}, opc);
    const vertical = V.orientacion !== "horizontal", grande = V.letra === "grande";
    const P = f.pasos, byId = new Map(P.map(p => [p.id, p])), idx = new Map(P.map((p, i) => [p.id, i]));
    const E = flechas(f), ent = entradas(f);
    const sal = new Map(P.map(p => [p.id, []])); E.forEach(e => sal.get(e.de).push(e));
    const anexo = new Map(); P.forEach(p => { const h = anexoDe(f, p); if (h && !anexoDe(f, h)) anexo.set(p.id, h.id); });

    // 1. Flechas que vuelven atrás (rompen los ciclos): búsqueda en profundidad desde los inicios, en el orden de la tabla
    const estado = new Map(), atras = new Set();
    const semillas = [...P.filter(p => esInicio(f, p, ent)), ...P];
    semillas.forEach(s => {
      if (estado.has(s.id)) return;
      const pila = [[s.id, 0]]; estado.set(s.id, 1);
      while (pila.length) {
        const top = pila[pila.length - 1], l = sal.get(top[0]);
        if (top[1] >= l.length) { estado.set(top[0], 2); pila.pop(); continue; }
        const e = l[top[1]++];
        if (anexo.get(e.a) === e.de) continue;              // lo que va pegado a su actividad no cuenta
        const st = estado.get(e.a);
        if (st === 1) atras.add(e);
        else if (!st) { estado.set(e.a, 1); pila.push([e.a, 0]); }
      }
    });
    const adelante = e => !atras.has(e) && anexo.get(e.a) !== e.de;

    // 2. Filas: cada paso, una fila por debajo del que le precede (el camino más largo). Los subprocesos van seguidos.
    const subIdx = new Map(f.subprocesos.map((s, i) => [s.id, i]));
    const subDeP = p => V.subprocesos && subIdx.has(p.subprocesoId) ? subIdx.get(p.subprocesoId) : -1;
    const fila = new Map(P.map(p => [p.id, 0]));
    for (let it = 0, cambio = true; cambio && it < P.length * 3 + 5; it++) {
      cambio = false;
      const inicioBanda = []; let max = -1;
      f.subprocesos.forEach((s, i) => { inicioBanda[i] = max + 1; P.forEach(p => { if (subDeP(p) === i) max = Math.max(max, fila.get(p.id)); }); });
      P.forEach(p => {
        let r = 0;
        (ent.get(p.id) || []).forEach(e => { if (adelante(e)) r = Math.max(r, fila.get(e.de) + 1); });
        const si = subDeP(p); if (si >= 0) r = Math.max(r, inicioBanda[si]);
        if (anexo.has(p.id)) r = fila.get(anexo.get(p.id));
        if (r !== fila.get(p.id)) { fila.set(p.id, r); cambio = true; }
      });
    }
    // Las filas vacías se cierran (puede pasar al empujar subprocesos)
    const usadas = [...new Set(fila.values())].sort((a, b) => a - b), comp = new Map(usadas.map((r, i) => [r, i]));
    P.forEach(p => fila.set(p.id, comp.get(fila.get(p.id))));
    const nFilas = usadas.length;

    // 3. Calles: una por actor, más «Inicio» (a la izquierda) y «Fin» (a la derecha) para los terminales sin actor
    const calleDe = p => {
      if (actorDe(f, p)) return p.actorId;
      if (p.tipo === "terminal") return esInicio(f, p, ent) ? "_in" : "_out";
      if (p.tipo === "externo") return "_ext";
      return "_sin";
    };
    const claves = new Set(P.map(calleDe));
    const ordenCalles = ["_in", ...f.actores.map(a => a.id), "_sin", "_ext", "_out"].filter(k => claves.has(k));

    // 4. Huecos dentro de cada calle: cada paso, bajo su paso anterior; si dos coinciden, uno al lado del otro (el Sí antes que el No)
    const hueco = new Map(), huecosCalle = new Map(ordenCalles.map(k => [k, 1]));
    const pesoEtq = e => ({ si: 0, "": 1, no: 2 }[e ? e.etiqueta : ""] ?? 1);
    for (let r = 0; r < nFilas; r++) {
      ordenCalles.forEach(k => {
        const aqui = P.filter(p => fila.get(p.id) === r && calleDe(p) === k);
        if (!aqui.length) return;
        const principales = aqui.filter(p => !anexo.has(p.id)).map(p => {
          const e = (ent.get(p.id) || []).filter(adelante).find(x => calleDe(byId.get(x.de)) === k && hueco.has(x.de));
          return { p, deseado: e ? hueco.get(e.de) : 0, peso: pesoEtq(e), i: idx.get(p.id) };
        }).sort((a, b) => a.deseado - b.deseado || a.peso - b.peso || a.i - b.i);
        let ult = -1;
        const colocar = (p, d) => { const s = Math.max(d, ult + 1); hueco.set(p.id, s); ult = s; };
        principales.forEach(x => {
          colocar(x.p, x.deseado);
          aqui.filter(y => anexo.get(y.id) === x.p.id).forEach(y => colocar(y, hueco.get(x.p.id) + 1));
        });
        aqui.filter(y => !hueco.has(y.id)).forEach(y => colocar(y, 0));
        huecosCalle.set(k, Math.max(huecosCalle.get(k), ult + 1));
      });
    }

    // 5. Medidas y coordenadas
    const med = new Map(P.map(p => [p.id, medida(p, grande)]));
    const su = p => vertical ? med.get(p.id).w : med.get(p.id).h, sv = p => vertical ? med.get(p.id).h : med.get(p.id).w;
    const CU = Math.max(vertical ? 150 : 46, ...P.map(su)), GU = DIB.GU, CV = DIB.CV;
    const hayBandas = V.subprocesos && f.subprocesos.some((s, i) => P.some(p => subDeP(p) === i));
    const U0 = DIB.MARGEN + (hayBandas ? DIB.BANDA : 0), V0 = vertical ? DIB.CABV + 8 : DIB.CABH + 8;
    const calles = []; let u = U0;
    ordenCalles.forEach(k => {
      const n = huecosCalle.get(k), ancho = GU + n * (CU + GU);
      const a = f.actores.find(x => x.id === k);
      calles.push({ clave: k, actorId: a ? a.id : "", nombre: a ? a.nombre : k === "_sin" ? "Sin asignar" : "", pseudo: k === "_in" || k === "_out" || k === "_ext", u0: u, ancho, huecos: n });
      u += ancho;
    });
    const anchoU = u + DIB.MARGEN;
    const calleU = new Map(calles.map(c => [c.clave, c]));
    const tamFila = Array.from({ length: nFilas }, (_, r) => Math.max(40, ...P.filter(p => fila.get(p.id) === r).map(sv)));
    const vFila = []; let v = V0 + CV / 2;
    tamFila.forEach((t, r) => { vFila[r] = v + t / 2; v += t + CV; });
    const largoV = v - CV / 2 + DIB.MARGEN;
    const pasillo = r => r < 0 ? V0 + CV / 4 : vFila[r] + tamFila[r] / 2 + CV / 2;   // a media distancia entre la fila r y la r+1
    const caja = new Map(P.map(p => {
      const c = calleU.get(calleDe(p)), cu = c.u0 + GU + hueco.get(p.id) * (CU + GU) + CU / 2;
      return [p.id, { cu, cv: vFila[fila.get(p.id)], hu: su(p) / 2, hv: sv(p) / 2, r: fila.get(p.id) }];
    }));
    const canalDe = (b, lado) => b.cu + lado * (CU / 2 + GU / 2);

    // 6. Flechas: tramos rectos con esquinas en ángulo recto, siempre por los pasillos entre filas y entre huecos
    const ocupada = (cu, r, excl) => P.some(p => p.id !== excl && fila.get(p.id) === r && Math.abs(caja.get(p.id).cu - cu) < 1);
    const libreColumna = (cu, r1, r2, excl) => { for (let r = r1; r <= r2; r++) if (ocupada(cu, r, excl)) return false; return true; };
    const entreFila = (r, u1, u2, excl) => P.some(p => p.id !== excl && fila.get(p.id) === r && caja.get(p.id).cu > Math.min(u1, u2) + 1 && caja.get(p.id).cu < Math.max(u1, u2) - 1);
    function ramaLateral(pe, e) {
      const S = sal.get(pe.id).filter(x => !atras.has(x) && caja.get(x.a).r > caja.get(pe.id).r);
      if (S.length < 2 || !S.includes(e)) return false;
      const A = caja.get(pe.id), recta = S.filter(x => Math.abs(caja.get(x.a).cu - A.cu) < 1);
      const principal = recta.length === 1 ? recta[0] : S.find(x => x.etiqueta === "si") || S[0];
      return e !== principal;
    }
    function ruta(e) {
      const A = caja.get(e.de), B = caja.get(e.a), pe = byId.get(e.de);
      const abajo = X => [X.cu, X.cv + X.hv], arriba = X => [X.cu, X.cv - X.hv], lado = (X, s) => [X.cu + s * X.hu, X.cv];
      if (anexo.get(e.a) === e.de || anexo.get(e.de) === e.a || (A.r === B.r && !atras.has(e))) {
        const s = B.cu >= A.cu ? 1 : -1;
        if (!entreFila(A.r, A.cu, B.cu)) return [lado(A, s), lado(B, -s)];
        const c = pasillo(A.r); return [abajo(A), [A.cu, c], [B.cu, c], abajo(B)];
      }
      if (!atras.has(e) && B.r > A.r) {
        // En una decisión sigue recta la rama cuyo destino está justo debajo (si no, la del Sí); la otra sale por un lado
        const sale = pe.tipo === "decision" && ramaLateral(pe, e) ? (B.cu < A.cu - 1 ? -1 : 1) : 0;
        if (sale) {
          if (B.r === A.r + 1 && (B.cu - A.cu) * sale > 0 && !entreFila(A.r, A.cu, B.cu + sale, e.de) && !ocupada(B.cu, A.r, e.de)) return [lado(A, sale), [B.cu, A.cv], arriba(B)];
          const g = canalDe(A, sale), c = pasillo(B.r - 1);
          return [lado(A, sale), [g, A.cv], [g, c], [B.cu, c], arriba(B)];
        }
        if (Math.abs(B.cu - A.cu) < 1 && libreColumna(A.cu, A.r + 1, B.r - 1)) return [abajo(A), arriba(B)];
        if (B.r === A.r + 1) { const c = pasillo(A.r); return [abajo(A), [A.cu, c], [B.cu, c], arriba(B)]; }
        if (libreColumna(A.cu, A.r + 1, B.r - 1)) { const c = pasillo(B.r - 1); return [abajo(A), [A.cu, c], [B.cu, c], arriba(B)]; }
        if (libreColumna(B.cu, A.r + 1, B.r - 1)) { const c = pasillo(A.r); return [abajo(A), [A.cu, c], [B.cu, c], arriba(B)]; }
        const g = canalDe(B, A.cu < B.cu ? -1 : 1), c1 = pasillo(A.r), c2 = pasillo(B.r - 1);
        return [abajo(A), [A.cu, c1], [g, c1], [g, c2], [B.cu, c2], arriba(B)];
      }
      // Vuelta atrás: sale por un lado, sube por el pasillo y entra por el lado
      const s = B.cu > A.cu + 1 ? 1 : B.cu < A.cu - 1 ? -1 : 1;
      const gA = canalDe(A, s);
      if (Math.abs(B.cu - A.cu) < 1) return [lado(A, s), [gA, A.cv], [gA, B.cv], lado(B, s)];
      const gB = canalDe(B, -s), c = pasillo(B.r - 1);
      return [lado(A, s), [gA, A.cv], [gA, c], [gB, c], [gB, B.cv], lado(B, -s)];
    }
    const limpia = pts => {
      const r = [];
      pts.forEach(p => { const q = r[r.length - 1]; if (!q || Math.abs(q[0] - p[0]) > 0.1 || Math.abs(q[1] - p[1]) > 0.1) r.push(p.slice()); });
      for (let i = r.length - 2; i > 0; i--) { const a = r[i - 1], b = r[i], c = r[i + 1]; if ((Math.abs(a[0] - b[0]) < 0.1 && Math.abs(b[0] - c[0]) < 0.1) || (Math.abs(a[1] - b[1]) < 0.1 && Math.abs(b[1] - c[1]) < 0.1)) r.splice(i, 1); }
      return r;
    };
    const rutas = E.map(e => ({ e, pts: limpia(ruta(e)) }));
    // Tramos interiores que coinciden con los de otra flecha (que no comparte origen ni destino): se apartan unos píxeles
    const tramos = [];
    rutas.forEach(R => {
      const pts = R.pts;
      for (let i = 1; i < pts.length - 2; i++) {
        const a = pts[i], b = pts[i + 1], horiz = Math.abs(a[1] - b[1]) < 0.1, eje = horiz ? 1 : 0, otro = 1 - eje;
        const choca = c => tramos.some(t => t.eje === eje && Math.abs(t.c - c) < 3 && t.e.de !== R.e.de && t.e.a !== R.e.a && Math.min(t.hasta, Math.max(a[otro], b[otro])) - Math.max(t.desde, Math.min(a[otro], b[otro])) > 2);
        let d = 0;
        for (const x of [0, 7, -7, 13, -13]) { if (!choca(a[eje] + x)) { d = x; break; } }
        if (d) { a[eje] += d; b[eje] += d; }
        tramos.push({ eje, c: a[eje], desde: Math.min(a[otro], b[otro]), hasta: Math.max(a[otro], b[otro]), e: R.e });
      }
    });

    // 7. Paso a x / y
    const xy = (uu, vv) => vertical ? [uu, vv] : [vv, uu];
    const nodos = P.map(p => {
      const c = caja.get(p.id), m = med.get(p.id), [x, y] = xy(c.cu, c.cv);
      return { pasoId: p.id, num: p.num, tipo: p.tipo, texto: p.texto, lineas: m.lineas, lh: m.lh, actorId: p.actorId, subprocesoId: p.subprocesoId, fila: c.r, x: x - m.w / 2, y: y - m.h / 2, w: m.w, h: m.h };
    });
    const flechasD = rutas.map(R => {
      const puntos = R.pts.map(q => xy(q[0], q[1]));
      let etiqueta = null;
      if (R.e.etiqueta === "si" || R.e.etiqueta === "no" || (lleno(R.e.etiqueta) && byId.get(R.e.de).tipo !== "decision")) {
        const [a, b] = puntos, largo = Math.hypot(b[0] - a[0], b[1] - a[1]), t = largo > 44 ? 22 / largo : 0.5;
        etiqueta = { texto: R.e.etiqueta === "si" ? "Sí" : R.e.etiqueta === "no" ? "No" : R.e.etiqueta, x: a[0] + (b[0] - a[0]) * t, y: a[1] + (b[1] - a[1]) * t };
      }
      return { de: R.e.de, a: R.e.a, etiqueta: R.e.etiqueta, estilo: R.e.estilo, atras: atras.has(R.e), anexo: anexo.get(R.e.a) === R.e.de, puntos, rotulo: etiqueta };
    });
    // Documentos pegados a una actividad sin flecha entre ellos: una línea fina que los une
    const uniones = P.filter(p => anexo.has(p.id) && !E.some(e => (e.de === anexo.get(p.id) && e.a === p.id) || (e.a === anexo.get(p.id) && e.de === p.id))).map(p => {
      const A = caja.get(anexo.get(p.id)), B = caja.get(p.id), s = B.cu >= A.cu ? 1 : -1;
      return { de: anexo.get(p.id), a: p.id, puntos: [xy(A.cu + s * A.hu, A.cv), xy(B.cu - s * B.hu, B.cv)] };
    });
    const callesD = calles.map(c => {
      const r = vertical ? { x: c.u0, y: DIB.MARGEN / 2, w: c.ancho, h: largoV - DIB.MARGEN } : { x: DIB.MARGEN / 2, y: c.u0, w: largoV - DIB.MARGEN, h: c.ancho };
      return Object.assign({ clave: c.clave, actorId: c.actorId, nombre: c.nombre, pseudo: c.pseudo }, r);
    });
    const bandas = !hayBandas ? [] : f.subprocesos.map((s, i) => {
      const l = P.filter(p => subDeP(p) === i); if (!l.length) return null;
      const r1 = Math.min(...l.map(p => fila.get(p.id))), r2 = Math.max(...l.map(p => fila.get(p.id)));
      const v1 = vFila[r1] - tamFila[r1] / 2 - CV / 2 + 3, v2 = vFila[r2] + tamFila[r2] / 2 + CV / 2 - 3;
      const r = vertical ? { x: DIB.MARGEN, y: v1, w: anchoU - 2 * DIB.MARGEN, h: v2 - v1 } : { x: v1, y: DIB.MARGEN, w: v2 - v1, h: anchoU - 2 * DIB.MARGEN };
      return Object.assign({ subprocesoId: s.id, nombre: s.nombre, color: COLOR_SUB_HEX[Number(s.color) || 0], orden: i + 1 }, r);
    }).filter(Boolean);
    const [ancho, alto] = vertical ? [anchoU, largoV] : [largoV, anchoU];
    return { version: 1, orientacion: vertical ? "vertical" : "horizontal", letra: grande ? "grande" : "normal", ancho: Math.ceil(ancho), alto: Math.ceil(alto), cabecera: vertical ? DIB.CABV : DIB.CABH, banda: hayBandas ? DIB.BANDA : 0, calles: callesD, bandas, nodos, flechas: flechasD, uniones, iconos: [] };
  }

  // ---------- Saneado por esquema (lo que se carga o se importa nunca se usa sin pasar por aquí) ----------
  // [max] = texto; "b" = sí/no (si falta, el valor de la fábrica); "id" = id propio; "ref" = id de otro objeto; "ent" = entero ≥ 0;
  // {en} = enumerado; {lista: max, max} = lista de textos; {de: esquema, max} = lista de objetos; {obj: esquema} = objeto anidado
  const idValido = v => typeof v === "string" && /^[a-z0-9-]{1,40}$/i.test(v);
  const txt = (v, max) => (typeof v === "string" || typeof v === "number") ? String(v).slice(0, max) : "";
  const ESQ = {
    actor: { id: "id", nombre: [100] },
    subproceso: { id: "id", nombre: [200], descripcion: [1000], inicio: [300], fin: [300], roles: [500], color: { en: Array.from({ length: COLORES_SUB }, (_, i) => String(i)) }, origenApp: [20], origenId: [60] },
    flecha: { a: "ref", etiqueta: [30], estilo: { en: ["normal", "idavuelta"] } },
    ajuste: { fila: [3], lado: "ref" },
    paso: { id: "id", num: "ent", tipo: { en: ORDEN_TIPOS }, texto: [300], actorId: "ref", subprocesoId: "ref", siguientes: { de: "flecha", max: 8 }, con: "ref", nota: [1000], ajuste: { obj: "ajuste" } },
    punto: { id: "id", num: "ent", pasoId: "ref", titulo: [300], descripcion: [1500], fallos: { lista: 6, max: 40 }, origen: { en: ["manual", "propuesta", "amfe"] } },
    vista: { orientacion: { en: ["vertical", "horizontal"] }, calles: { en: ["actor", "turno"] }, subprocesos: "b", letra: { en: ["normal", "grande"] }, numeros: "b", marco: "b" },
    marco: { estrategicos: { lista: 120, max: 12 }, soporte: { lista: 120, max: 16 } },
    persona: { nombre: [200], cargo: [200] },
    revision: { edicion: [10], fecha: [20], cambio: [500] },
    control: { elaborado: { de: "persona", max: 10 }, revisado: { de: "persona", max: 10 }, aprobado: { de: "persona", max: 10 }, historial: { de: "revision", max: 50 } },
    flujo: { id: "id", titulo: [200], proceso: [300], unidad: [200], objetivo: [2000], inicio: [300], fin: [300], incluye: [2000], excluye: [2000], responsable: [300], fecha: [40],
      actores: { de: "actor", max: 30 }, subprocesos: { de: "subproceso", max: 30 }, pasos: { de: "paso", max: 400 }, puntos: { de: "punto", max: 300 },
      vista: { obj: "vista" }, marco: { obj: "marco" }, validado: [40], edicion: [4], anteriorId: "ref", tipoEdicion: { en: ["actual", "propuesto"] }, control: { obj: "control" }, notas: [3000], creado: [40], modificado: [40] }
  };
  const FABRICA = { actor: id => nuevoActor(id), subproceso: id => nuevoSubproceso(id), flecha: () => nuevaFlecha(""), ajuste: () => ({ fila: "", lado: "" }), paso: id => nuevoPaso(id, 0), punto: id => nuevoPunto(id, 0),
    vista: nuevaVista, marco: () => ({ estrategicos: [], soporte: [] }), persona: nuevaPersona, revision: () => ({ edicion: "", fecha: "", cambio: "" }), control: () => ({ elaborado: [], revisado: [], aprobado: [], historial: [] }), flujo: id => nuevoFlujo(id, "") };
  function sanear(esq, o, genId) {
    if (!o || typeof o !== "object" || Array.isArray(o)) return null;
    const S = ESQ[esq], r = FABRICA[esq](genId());
    Object.keys(S).forEach(k => {
      const regla = S[k], v = o[k];
      if (regla === "id") r[k] = idValido(v) ? v : r[k];
      else if (regla === "ref") r[k] = idValido(v) ? v : "";
      else if (regla === "b") r[k] = typeof v === "boolean" ? v : r[k];
      else if (regla === "ent") { const n = num(v); r[k] = Number.isInteger(n) && n >= 0 && n < 1e6 ? n : 0; }
      else if (Array.isArray(regla)) { if (v !== undefined) r[k] = txt(v, regla[0]); }
      else if (regla.en && !regla.lista) r[k] = regla.en.includes(v) ? v : r[k];
      else if (regla.lista) r[k] = Array.isArray(v) ? [...new Set(v.slice(0, regla.max * 2).map(x => txt(x, regla.lista).trim()).filter(Boolean))].slice(0, regla.max) : [];
      else if (regla.de) r[k] = Array.isArray(v) ? v.slice(0, regla.max).map(x => sanear(regla.de, x, genId)).filter(Boolean) : [];
      else if (regla.obj) r[k] = sanear(regla.obj, v, genId) || r[k];
    });
    return r;
  }
  function sanearFlujo(o, genId, fecha) {
    const f = sanear("flujo", o, genId); if (!f) return null;
    if (!f.creado) f.creado = fecha; if (!f.modificado) f.modificado = f.creado;
    // Ids repetidos fuera; referencias rotas fuera; números de paso y de punto únicos
    const unico = l => { const v = new Set(); return l.filter(x => !v.has(x.id) && v.add(x.id)); };
    f.actores = unico(f.actores); f.subprocesos = unico(f.subprocesos); f.pasos = unico(f.pasos); f.puntos = unico(f.puntos);
    const act = new Set(f.actores.map(a => a.id)), subs = new Set(f.subprocesos.map(s => s.id)), pas = new Set(f.pasos.map(p => p.id));
    f.pasos.forEach(p => {
      if (!act.has(p.actorId)) p.actorId = "";
      if (!subs.has(p.subprocesoId)) p.subprocesoId = "";
      if (!pas.has(p.con) || p.con === p.id || (p.tipo !== "documento" && p.tipo !== "datos")) p.con = "";
      if (!pas.has(p.ajuste.lado)) p.ajuste.lado = "";
      p.siguientes = p.siguientes.filter((s, i, l) => pas.has(s.a) && s.a !== p.id && l.findIndex(y => y.a === s.a) === i);
      if (p.tipo !== "decision") p.siguientes.forEach(s => { if (s.etiqueta === "si" || s.etiqueta === "no") s.etiqueta = ""; });
    });
    f.puntos.forEach(x => { if (!pas.has(x.pasoId)) x.pasoId = ""; });
    if (!lleno(f.edicion)) f.edicion = "00";
    [f.pasos, f.puntos].forEach(l => {
      const usados = new Set();
      l.forEach(x => { if (!x.num || usados.has(x.num)) x.num = 0; else usados.add(x.num); });
      l.filter(x => !x.num).forEach(x => { x.num = siguienteNum(l); });
    });
    return f;
  }
  function sanearDatos(o, genId, fecha) {
    if (!o || typeof o !== "object" || !Array.isArray(o.flujos)) return null;
    return { flujos: o.flujos.slice(0, 300).map(x => sanearFlujo(x, genId, fecha)).filter(Boolean) };
  }
  // Fusiona sin duplicar: si un id ya existe se conserva el más reciente
  function fusionar(actual, nuevo) {
    const m = new Map(actual.flujos.map(x => [x.id, x]));
    nuevo.flujos.forEach(x => { const y = m.get(x.id); if (!y || String(x.modificado) > String(y.modificado)) m.set(x.id, x); });
    return { flujos: Array.from(m.values()) };
  }

  const API = {
    VERSION_DATOS, URL_AMFE, URL_AUD, URL_IND, URL_TM,
    lleno, sinTildes, num, corto, normal, plural, listaY, mayuscula, minuscula,
    PASOS, TIPOS, ORDEN_TIPOS, COLORES_SUB, COLOR_SUB_HEX, ACTORES_SUG,
    nuevoFlujo, nuevaVista, nuevoActor, nuevoSubproceso, nuevoPaso, nuevaFlecha, nuevoPunto, nuevoControl, siguienteNum, colorLibre,
    actorDe, subDe, pasoDe, buscaActor, sugerirObjetivo,
    flechas, entradas, papelTerminal, esInicio, esFin, anexoDe, alcanzables, llegaAFin,
    avisosProceso, avisosActores, avisosPasos, avisos, errores, rolesSinCalle,
    progreso, pasoPendiente, siguientePaso, resumen,
    adivinarActor, leerLista, leerTabla, leerPegado, incorporarPasos,
    insertarDespues, quitarPaso, cambiarTipo, ponerSalida, anadirActores,
    partir, medida, disponer,
    ESQ, sanear, sanearFlujo, sanearDatos, fusionar
  };
  if (typeof module !== "undefined" && module.exports) module.exports = API;
  else raiz.Logica = API;
})(typeof window !== "undefined" ? window : this);

// ============================================================
//  app.js — UI y estado · Flujograma
//  Las reglas viven en logic.js (funciones puras), el dibujo SVG en dibujo.js
//  y los textos didácticos y ejemplos en contenido.js. Aquí: datos en
//  localStorage, enrutado por hash, inicio, lista de flujogramas, asistente
//  por pasos, visor del dibujo (zoom con el dedo), ejemplos, Aprende,
//  glosario, copias de seguridad.
//  Base copiada de AMFE (mismos patrones: data-k, refrescar sin perder el
//  foco, repintar conservando el scroll, borradores, ejemplos en memoria).
// ============================================================
(function () {
  "use strict";
  const L = window.Logica, C = window.Contenido, D = window.Dibujo;

  // ---------- Versión y novedades ----------
  // Al publicar cambios: añadir una entrada AL PRINCIPIO de NOVEDADES, poner su versión en los ?v= de index.html, en
  // APP_VERSION y subir CACHE_NAME en sw.js. Formato de versión: AAAA.NN.
  const APP_VERSION = "2026.07";
  const NOVEDADES = [
    { version: "2026.07", fecha: "Octubre 2026", titulo: "Nueva app hermana: Mapa de Riesgos", cambios: [
      "Enlace a la nueva app hermana Mapa de Riesgos en la portada y en «Acerca de»: pone los riesgos del AMFE encima de tu flujograma, coloreados por su IPR, y prepara el documento final."] },
    { version: "2026.06", fecha: "Octubre 2026", titulo: "Avisos coloreados por IPR y preparación para Mapa de Riesgos", cambios: [
      "Si has traído el AMFE (paso 1), el aviso de cada punto crítico toma el color del IPR más alto de sus fallos: rojo muy alto, naranja alto, amarillo medio y verde bajo, como en el AMFE. Sale en el dibujo, en la imagen, en el PDF, en Word y en draw.io.",
      "Por dentro: la futura app Mapa de Riesgos podrá usar el motor y el dibujo de Flujograma tal cual, sin copiarlos."] },
    { version: "2026.05", fecha: "Octubre 2026", titulo: "Nueva app hermana: DAFO · CAME", cambios: [
      "Enlace a la nueva app hermana DAFO · CAME (análisis DAFO de una unidad, estrategias CAME y plan de acción) en la portada y en «Acerca de». La portada enlaza también a Indicadores y a Tamaño Muestral."] },
    { version: "2026.04", fecha: "Octubre 2026", titulo: "Ponte a prueba, recorrido, modo reunión y ediciones", cambios: [
      "«Ponte a prueba»: las preguntas del test del curso sobre procesos y flujogramas y otras sobre cómo hacerlos, con su explicación.",
      "Cuatro ejercicios: ¿qué símbolo es?, ordena los pasos, encuentra el error en un flujograma mal hecho y señala los puntos críticos comparando con el ejemplo.",
      "Tres minicasos con errores a propósito para practicar con el validador.",
      "Vista recorrido en el paso 4: el proceso paso a paso, en tarjetas grandes, para revisarlo en el móvil o con el equipo. Y modo reunión, con letra grande y la pantalla limpia para proyectar.",
      "Ediciones en el paso 6: una revisión del proceso actual o el proceso propuesto tras las mejoras. La app compara las dos y marca en el dibujo los pasos nuevos y los cambiados.",
      "Hoja en blanco para dibujar en papel en las sesiones: la leyenda de símbolos, las calles con sus nombres y las tablas de pasos y de puntos críticos.",
      "Aprende: nuevo tema 7, del flujograma al AMFE y al mapa de riesgos."] },
    { version: "2026.03", fecha: "Octubre 2026", titulo: "Word, Excel, «Traer de AMFE» y el ejemplo de Urgencias", cambios: [
      "Documento del proceso en Word editable: control del documento, descripción, actores, subprocesos, el flujograma como imagen, la leyenda de símbolos, la tabla de pasos y los puntos críticos.",
      "Libro de Excel con los pasos, los puntos críticos (sus columnas se pueden pegar tal cual en el paso 4 de AMFE), los subprocesos y los actores.",
      "«Traer de AMFE» en el paso 1: trae el proceso, los subprocesos y sus roles como calles, y si quieres un borrador de los pasos y un punto crítico por cada fallo prioritario. Funciona en el mismo navegador o con la copia de seguridad de AMFE.",
      "Al escribir los números de fallo del AMFE en un punto crítico, la app dice qué fallo es cada uno.",
      "Marco del mapa de procesos, como en el Documento Final: procesos estratégicos arriba, proceso clave a la izquierda y procesos de soporte abajo. Sale en el dibujo, en la imagen, en el PDF, en Word y en draw.io.",
      "Control del documento (elaborado, revisado, aprobado e histórico de revisiones) en el paso 6.",
      "Nuevo ejemplo: atención integral en el Servicio de Urgencias, con sus 7 subprocesos, el marco de procesos y los avisos con los números de fallo del AMFE, como el mapa de riesgos del curso."] },
    { version: "2026.02", fecha: "Octubre 2026", titulo: "Puntos críticos y exportar: imagen, PDF y draw.io", cambios: [
      "Nuevo paso 5, Puntos críticos: se marcan sobre el dibujo, numerados, con un aviso rojo y amarillo como en el mapa de riesgos del curso. Cada uno con su título, su descripción y los números de fallo del AMFE con los que se relaciona.",
      "La app propone dónde buscarlos: los traspasos entre calles, las decisiones y los pasos de identificación, traslado, registro, comunicación, medicación, muestras y esperas. Cada propuesta se acepta o se descarta.",
      "Tabla de puntos críticos por subproceso, como en el ejercicio 8 del curso.",
      "Nuevo paso 6, Exportar: imagen (PNG y SVG), PDF con la ficha del proceso, el dibujo, los pasos y los puntos críticos, y archivo de draw.io (diagrams.net) para retocarlo con los mismos estilos que las plantillas del curso.",
      "Retoques ligeros del dibujo: bajar un paso una fila o ponerlo al lado de otro.",
      "Calles por turnos, como en las soluciones del curso: una calle nueva cada vez que el proceso vuelve a un profesional.",
      "Nuevos ejemplos del curso: alta hospitalaria, preparación de quirófano y solicitud de analítica urgente. Todos con puntos críticos.",
      "Las apps AMFE y Mapa de Riesgos podrán traer este flujograma en el mismo navegador (próximamente en ellas)."] },
    { version: "2026.01", fecha: "Octubre 2026", titulo: "Primera versión: escribe los pasos y la app dibuja", cambios: [
      "Asistente en 6 pasos con «Tu siguiente paso» en la portada. En esta versión están disponibles los pasos 1 a 4.",
      "El proceso (dónde empieza y dónde acaba, con objetivo propuesto), los actores (cada uno, una calle del dibujo) y los subprocesos.",
      "Los pasos, con su tipo (inicio/fin, actividad, decisión, datos, documento o proceso externo), quién lo hace y a qué paso sigue.",
      "Escritura rápida: pega una lista («1. Enfermera consulta hoja de indicaciones…») o una tabla de Excel y la app crea y encadena los pasos, adivina quién los hace y convierte en decisión las preguntas y las frases con «si».",
      "La app dibuja sola el flujograma con los símbolos del curso, por calles y con los subprocesos en bandas de color, de arriba abajo o de izquierda a derecha. Se amplía con el dedo y, al tocar un símbolo, se corrige su paso.",
      "Validador: avisa si falta el inicio o el fin, de los callejones sin salida, de las decisiones sin Sí o sin No y de otros errores habituales.",
      "Ejemplos del curso (toma de constantes y petición de radiografía), Aprende (5 temas), glosario y copia de seguridad."] }
  ];
  const ENTREGA = 4;   // pasos ya construidos (ver L.PASOS[].entrega)

  // ---------- Utilidades ----------
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const view = $("#view");
  const hoy = () => new Date().toISOString();
  const hoyIso = () => new Date().toISOString().slice(0, 10);
  const fechaCorta = iso => { const d = new Date(iso); return isNaN(d) ? "" : d.toLocaleDateString("es-ES"); };
  const fmtFecha = s => /^\d{4}-\d{2}-\d{2}$/.test(s || "") ? s.split("-").reverse().join("/") : (s || "");
  const genId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const lleno = L.lleno, plural = L.plural;
  const clon = o => JSON.parse(JSON.stringify(o));
  const leer = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  const escribir = (k, v) => { try { localStorage.setItem(k, v); return true; } catch (e) { return false; } };

  // ---------- Datos (solo en este dispositivo) ----------
  const KEY_DATOS = "flujograma-datos", KEY_INTERCAMBIO = "flujograma-intercambio";
  let datos = { flujos: [], ultimaCopia: null };
  (function cargar() {
    const crudo = leer(KEY_DATOS); if (!crudo) return;
    try {
      const o = JSON.parse(crudo), s = L.sanearDatos(o, genId, hoy());
      if (s) datos = { flujos: s.flujos, ultimaCopia: typeof o.ultimaCopia === "string" ? o.ultimaCopia : null };
    } catch (e) { /* datos dañados: se empieza de cero sin borrar lo guardado */ }
  })();
  // Los datos del usuario son los únicos que se guardan. Los ejemplos viven aparte, en memoria
  // (ids «ej-…»): se pueden tocar, pero ni se guardan ni se mezclan con los suyos.
  const datosUsuario = datos;
  let datosEjemplo = null, modoEjemplo = false;
  const esIdEjemplo = id => /^ej-/.test(id || "");
  function ejemplos() {
    if (!datosEjemplo) datosEjemplo = { flujos: C.EJEMPLOS.flujos.map(f => L.sanearFlujo(clon(f), genId, hoy())), ultimaCopia: null };
    return datosEjemplo;
  }
  let tGuardar = null, avisoSinEspacio = false;
  function guardar(inmediato) {
    clearTimeout(tGuardar);
    const fn = () => {
      const ok = escribir(KEY_DATOS, JSON.stringify({ app: "flujograma", v: L.VERSION_DATOS, ultimaCopia: datosUsuario.ultimaCopia, flujos: datosUsuario.flujos }));
      // Paquete con forma fija para que otras apps del mismo dominio lo lean («Traer de Flujograma»); nunca leen flujograma-datos
      try { escribir(KEY_INTERCAMBIO, JSON.stringify(L.paqueteIntercambio(datosUsuario.flujos, APP_VERSION, hoy()))); } catch (e) { /* */ }
      if (!ok && !avisoSinEspacio) { avisoSinEspacio = true; toast("No se ha podido guardar en este navegador (¿modo privado o sin espacio?). Haz una copia de seguridad.", 6000); }
    };
    if (inmediato) fn(); else tGuardar = setTimeout(fn, 250);
  }
  window.addEventListener("pagehide", () => guardar(true));
  const buscaFlujo = id => datos.flujos.find(x => x.id === id);
  // Un flujograma recién creado no se guarda hasta que se escribe algo
  const borradores = new Map();
  const esVacio = f => !f.pasos.length && !f.actores.length && !f.subprocesos.length && !["titulo", "proceso", "unidad", "objetivo", "inicio", "fin", "responsable"].some(k => lleno(f[k]));

  // ---------- Textos de ayuda reutilizables ----------
  const box = (tipo, tag, html) => `<div class="box box--${tipo}"><span class="box-tag">${tag}</span>${html}</div>`;
  const idea = html => box("idea", "Idea clave", `<p>${html}</p>`);
  const trampa = html => box("trampa", "Ojo, trampa", `<p>${html}</p>`);
  const practica = html => box("practica", "En la práctica", `<p>${html}</p>`);
  const KEY_FACIL = "flujograma-facil-abierto";
  const facil = (html, titulo = "Explicado fácil") => `<details class="facil" data-recordar="1"${leer(KEY_FACIL) === "1" ? " open" : ""}><summary>${titulo}</summary><div class="facil-body">${html}</div></details>`;
  const avisoHtml = a => {
    const ver = a.paso && (pasoActual === 4 || pasoActual === 5) ? ` <button type="button" class="link-btn" data-act="ver-paso" data-id="${a.paso}">Ver</button>` : "";
    return a.nivel === "nota" ? `<div class="note">ℹ ${esc(a.texto)}${ver}</div>` : a.nivel === "error" ? `<div class="aviso-error">✕ ${esc(a.texto)}${ver}</div>` : `<div class="warn">⚠ ${esc(a.texto)}${ver}</div>`;
  };

  // ---------- Campos ----------
  function getPath(o, path) { return path.split(".").reduce((a, k) => (a == null ? undefined : a[k]), o); }
  function setPath(o, path, v) {
    const ks = path.split("."), ult = ks.pop();
    let a = o; ks.forEach(k => { if (a[k] == null || typeof a[k] !== "object") a[k] = {}; a = a[k]; });
    a[ult] = v;
  }
  let nAyuda = 0;
  function ayudaBtn(help) {
    if (!help) return { btn: "", box: "" };
    const id = "h" + (++nAyuda);
    return { btn: `<button type="button" class="info-btn" data-info="${id}" aria-expanded="false" aria-label="Ayuda">i</button>`, box: `<p class="help" id="help-${id}" hidden>${help}</p>` };
  }
  function campo(obj, path, label, o = {}) {
    const v = getPath(obj, path) || "", a = ayudaBtn(o.help);
    const bind = o.bind || `data-k="${path}"`;
    const ctrl = o.area
      ? `<textarea class="txt-in" ${bind} rows="${o.rows || 2}" placeholder="${esc(o.ph || "")}">${esc(v)}</textarea>`
      : `<div class="input-wrap"><input class="txt-in" ${bind} value="${esc(v)}" placeholder="${esc(o.ph || "")}"${o.tipo ? ` type="${o.tipo}"` : ""} autocomplete="off" /></div>`;
    return `<div class="field${o.destacado ? " field--destacado" : ""}"><div class="field-head"><label class="field-label">${label}</label>${o.opt ? '<span class="field-opt">(opcional)</span>' : ""}${a.btn}</div>${a.box}${o.sub ? `<p class="field-sub">${o.sub}</p>` : ""}${ctrl}${o.extra || ""}</div>`;
  }
  function selector(label, bind, valor, opciones, o = {}) {
    const a = ayudaBtn(o.help);
    return `<div class="field${o.clase ? " " + o.clase : ""}"><div class="field-head"><label class="field-label">${label}</label>${a.btn}</div>${a.box}<div class="input-wrap"><select class="txt-in" ${bind}>${opciones.map(([v, t]) => `<option value="${esc(v)}"${v === valor ? " selected" : ""}>${esc(t)}</option>`).join("")}</select></div></div>`;
  }

  // ---------- Pasos del asistente ----------
  const disponible = p => p.entrega <= ENTREGA;
  const pasosDisp = () => L.PASOS.filter(disponible);
  function pasosHtml(f, actualN) {
    return `<ol class="wiz-steps wiz-steps--6 no-print" aria-label="Pasos del flujograma" data-zona="pasos">${pasosInner(f, actualN)}</ol>`;
  }
  function pasosInner(f, actualN, g = L.progreso(f)) {
    return L.PASOS.map(p => `<li><a href="#/flujo/${f.id}/${p.n}" class="wiz-step${p.n === actualN ? " actual" : g[p.n] ? " hecho" : ""}${disponible(p) ? "" : " prox"}"${p.n === actualN ? ' aria-current="step"' : ""} title="${esc(p.titulo + (disponible(p) ? "" : " (próximamente)"))}"><span class="wiz-num">${g[p.n] && p.n !== actualN ? "✓" : p.n}</span><span class="wiz-lbl">${p.corto}</span></a></li>`).join("");
  }
  const volver = (href, txt) => `<a class="volver-cuadro" href="${href}">← ${txt}</a>`;
  const nombreFlujo = f => f.titulo || f.proceso || "";
  const subPunto = s => `<span class="sub-dot sub-c${s ? s.color : "x"}" aria-hidden="true"></span>`;
  const tipoChip = t => `<span class="tipo-chip tipo--${t}" aria-hidden="true"></span>`;

  // ---------- Inicio ----------
  function renderHome() {
    const d = datosUsuario, sig = L.siguientePaso(d, ENTREGA), n = d.flujos.length;
    const np = d.flujos.reduce((s, f) => s + f.pasos.length, 0);
    const diasCopia = d.ultimaCopia ? Math.floor((Date.now() - new Date(d.ultimaCopia)) / 864e5) : null;
    const avisoCopia = n && (diasCopia === null || diasCopia > 30)
      ? `<div class="warn">⚠ ${diasCopia === null ? "Aún no has hecho ninguna copia de seguridad." : `Tu última copia de seguridad es de hace ${diasCopia} días.`} Tus datos solo están en este dispositivo: guarda una copia.</div>` : "";
    const ult = d.flujos.slice().sort((x, y) => String(y.modificado).localeCompare(String(x.modificado)))[0];
    view.innerHTML = `
      <section class="hero">
        <h1 class="hero-t"><span>Flujograma</span></h1>
        <p class="hero-p">Dibuja <b>cualquier proceso sanitario</b> como un diagrama de flujo <b>sin saber dibujar</b>: escribe los pasos, quién los hace y qué viene después, y la app lo dibuja sola con los símbolos normalizados, por calles y por subprocesos.</p>
        <div class="hero-btns">
          <a class="btn btn--primary btn--grande" href="#/flujo/nuevo">+ Nuevo flujograma</a>
          <a class="btn btn--grande" href="#/flujo">Mis flujogramas${n ? ` <span class="contador">${n}</span>` : ""}</a>
        </div>
      </section>
      <div class="siguiente">
        <span class="siguiente-tag">Tu siguiente paso</span>
        <p>${esc(sig.texto)}</p>
        <a class="btn btn--primary" href="${sig.href}">${esc(sig.btn)} →</a>
      </div>
      <h2 class="sec-t">El camino, en 6 pasos</h2>
      <p class="page-lead">Del proceso al dibujo validado por el equipo, y de ahí a los puntos críticos que analizará el AMFE.</p>
      <ol class="fases">
        ${L.PASOS.map(p => `<li><a class="fase fase--acc${disponible(p) ? "" : " prox"}" href="${ult ? `#/flujo/${ult.id}/${p.n}` : "#/flujo/nuevo"}">
          <span class="fase-cab"><span class="pdca-num">${p.n}</span><b>${p.titulo}</b></span>
          <span class="fase-que">${p.que}</span>
          ${disponible(p) ? "" : `<span class="fase-prox">Próximamente</span>`}
        </a></li>`).join("")}
      </ol>
      <h2 class="sec-t">Tus datos</h2>
      <div class="card datos-card">
        <div class="datos-cifras">
          <a href="#/flujo"><b>${n}</b><span>${n === 1 ? "flujograma" : "flujogramas"}</span></a>
          <a href="#/flujo"><b>${np}</b><span>${np === 1 ? "paso" : "pasos"}</span></a>
          <a href="#/flujo"><b>${d.flujos.filter(f => lleno(f.validado)).length}</b><span>validados</span></a>
        </div>
        ${avisoCopia}
        <p class="field-sub">Se guardan <b>solo en este dispositivo</b>. Para trabajar en equipo, pasa tu copia a los demás: al importarla se junta con lo suyo sin duplicar.${d.ultimaCopia ? ` Última copia: ${fechaCorta(d.ultimaCopia)}.` : ""}</p>
        <div class="toolbar"><button class="btn" data-act="copia">⬇ Copia de seguridad</button><button class="btn" data-act="importar">⬆ Importar copia</button></div>
      </div>
      <div class="guide">
        <a class="guide-card" href="#/ejemplos"><span class="guide-num">Ej</span><div><div class="guide-q">Ejemplos</div><div class="guide-a">La <b>atención en Urgencias</b> con su mapa de riesgos, los <b>cinco procesos</b> del curso y tres minicasos con errores para corregir.</div></div><span class="guide-go">›</span></a>
        <a class="guide-card" href="#/aprende"><span class="guide-num">?</span><div><div class="guide-q">Aprende</div><div class="guide-a">${C.TEMAS.length} temas <b>explicados fácil</b>: del mapa de procesos a las decisiones bien hechas.</div></div><span class="guide-go">›</span></a>
        <a class="guide-card" href="#/prueba"><span class="guide-num">✓</span><div><div class="guide-q">Ponte a prueba</div><div class="guide-a">${C.TEST.length} preguntas con su <b>explicación</b> y cuatro ejercicios: símbolos, ordenar, encontrar el error y puntos críticos.</div></div><span class="guide-go">›</span></a>
        <a class="guide-card" href="#/glosario"><span class="guide-num">A–Z</span><div><div class="guide-q">Glosario</div><div class="guide-a">${C.GLOSARIO.length} términos <b>en lenguaje llano</b>, con buscador.</div></div><span class="guide-go">›</span></a>
        <a class="guide-card guide-card--hermana" href="${L.URL_AMFE}" target="_blank" rel="noopener"><span class="guide-num">!</span><div><div class="guide-q">AMFE ↗</div><div class="guide-a">App hermana: analiza <b>qué puede fallar</b> en cada paso del proceso, qué pasaría y por qué.</div></div><span class="guide-go">›</span></a>
        <a class="guide-card guide-card--hermana" href="${L.URL_AUD}" target="_blank" rel="noopener"><span class="guide-num">✓</span><div><div class="guide-q">Auditorías ↗</div><div class="guide-a">App hermana: <b>comprueba con una auditoría</b> si el proceso se hace como se ha dibujado.</div></div><span class="guide-go">›</span></a>
        <a class="guide-card guide-card--hermana" href="${L.URL_IND}" target="_blank" rel="noopener"><span class="guide-num">%</span><div><div class="guide-q">Indicadores ↗</div><div class="guide-a">App hermana: <b>diseña los indicadores</b> con los que medir los puntos críticos de tu proceso.</div></div><span class="guide-go">›</span></a>
        <a class="guide-card guide-card--hermana" href="${L.URL_TM}" target="_blank" rel="noopener"><span class="guide-num">n</span><div><div class="guide-q">Tamaño Muestral ↗</div><div class="guide-a">App hermana: <b>cuántos casos revisar</b> para medir esos indicadores.</div></div><span class="guide-go">›</span></a>
        <a class="guide-card guide-card--hermana" href="${L.URL_DAFO}" target="_blank" rel="noopener"><span class="guide-num">D</span><div><div class="guide-q">DAFO · CAME ↗</div><div class="guide-a">App hermana: <b>analiza tu unidad</b> con un DAFO para decidir qué proceso conviene dibujar y mejorar.</div></div><span class="guide-go">›</span></a>
        <a class="guide-card guide-card--hermana" href="${L.URL_MAPA}" target="_blank" rel="noopener"><span class="guide-num">◆</span><div><div class="guide-q">Mapa de Riesgos ↗</div><div class="guide-a">App hermana: <b>elabora el mapa de riesgos</b> del proceso: pone los riesgos del AMFE encima de este flujograma, coloreados por su IPR.</div></div><span class="guide-go">›</span></a>
      </div>
      ${practica("<b>Protección de datos:</b> un flujograma describe un proceso, no a pacientes concretos. No escribas nombres de pacientes ni números de historia clínica, ni nombres de profesionales: usa perfiles («Enfermería», «Celador»).")}`;
  }

  // ---------- Lista ----------
  function renderLista() {
    const lista = datos.flujos.slice().sort((a, b) => String(b.modificado).localeCompare(String(a.modificado)));
    view.innerHTML = `
      <h1 class="page-title">Mis flujogramas</h1>
      <p class="page-lead">Cada flujograma dibuja un proceso: sus pasos, quién los hace y en qué orden.</p>
      ${facil(`<p>Un <b>flujograma</b> es el dibujo de un proceso paso a paso. Aquí no tienes que dibujar nada: escribes los pasos en una tabla (qué se hace, quién lo hace y qué viene después) y la app coloca los símbolos, las calles y las flechas.</p>`)}
      <div class="toolbar no-print"><a class="btn btn--primary" href="#/flujo/nuevo">+ Nuevo flujograma</a><a class="btn" href="#/flujo/ej-fl-constantes/4">Ver un ejemplo</a></div>
      ${lista.length ? `<div class="cuadro-lista">${lista.map(tarjeta).join("")}</div>`
        : `<div class="placeholder-box"><p><b>Todavía no tienes ningún flujograma.</b></p><p>Crea uno nuevo, o abre antes un ejemplo para ver cómo queda.</p></div>`}`;
  }
  function tarjeta(f) {
    const r = L.resumen(f), g = L.progreso(f), disp = pasosDisp(), hechos = disp.filter(p => g[p.n]).length;
    return `<div class="item-card">
      <a class="item-main" href="#/flujo/${f.id}">
        <b class="item-t">${lleno(nombreFlujo(f)) ? esc(nombreFlujo(f)) : '<span class="vacio">Flujograma sin nombre</span>'}</b>
        <span class="item-s">${esc([f.unidad, f.titulo && f.proceso !== f.titulo ? f.proceso : ""].filter(lleno).join(" · ")) || "&nbsp;"}</span>
        <span class="badges"><span class="badge">${plural(r.pasos, "paso", "pasos")}</span><span class="badge">${plural(r.actores, "calle", "calles")}</span>${r.subprocesos ? `<span class="badge">${plural(r.subprocesos, "subproceso", "subprocesos")}</span>` : ""}${r.errores ? `<span class="badge badge--grave">${plural(r.errores, "error", "errores")}</span>` : ""}${lleno(f.validado) ? `<span class="badge badge--ok">Validado</span>` : ""}${f.edicion && f.edicion !== "00" ? `<span class="badge">Edición ${esc(f.edicion)}${f.tipoEdicion === "propuesto" ? " · propuesto" : ""}</span>` : ""}<span class="badge badge--prog">Pasos ${hechos}/${disp.length}</span></span>
      </a>
      <div class="item-pie"><span>Modificado: ${fechaCorta(f.modificado)}</span><span><button class="link-btn" data-act="fl-dup" data-id="${f.id}">Duplicar</button> · <button class="link-btn link-btn--peligro" data-act="fl-del" data-id="${f.id}">Borrar</button></span></div>
    </div>`;
  }

  // ---------- Ficha de un flujograma: armazón común ----------
  let actual = null, pasoActual = 1;
  const abiertos = new Set();          // pasos desplegados en el paso 3
  let pegarAbierto = false, selPaso = "";
  const avisosDe = (f, n) => ({ 1: L.avisosProceso, 2: L.avisosActores, 3: L.avisosPasos, 4: L.avisosPasos }[n] || (() => []))(f);
  const avisosGenerales = (f, n) => avisosDe(f, n).filter(x => !x.paso).map(avisoHtml).join("");
  const avisosPaso = (f, id) => L.avisosPasos(f).filter(x => x.paso === id).map(a => avisoHtml(Object.assign({}, a, { paso: "" }))).join("");

  function renderFlujo(f, n) {
    actual = f; pasoActual = n; nAyuda = 0;
    if (document.body.classList.contains("ver-informe")) { if (docActual === "hoja") renderHoja(f); else renderInforme(f); return; }
    const p = L.PASOS[n - 1], disp = pasosDisp();
    const prev = disp.filter(x => x.n < n).pop(), next = disp.find(x => x.n > n);
    const cuerpo = !disponible(p) ? pasoProximo(f, p) : RENDER[n](f);
    view.innerHTML = `
      <div class="wiz-top no-print">${volver(modoEjemplo ? "#/ejemplos" : "#/flujo", modoEjemplo ? "Ejemplos" : "Mis flujogramas")}${pasosHtml(f, n)}</div>
      <div class="wiz-titulo"><span class="wiz-paso">Paso ${n} de 6${lleno(nombreFlujo(f)) ? " · " + esc(L.corto(nombreFlujo(f), 60)) : ""}</span><h1 class="page-title">${p.titulo}</h1></div>
      ${cuerpo}
      <div class="wiz-nav no-print">${prev ? `<a class="btn" href="#/flujo/${f.id}/${prev.n}">← ${prev.corto}</a>` : `<span></span>`}${next ? `<a class="btn btn--primary" href="#/flujo/${f.id}/${next.n}">${next.corto} →</a>` : `<span></span>`}</div>`;
    if (n === 4 || n === 5) iniciarLienzo();
  }
  function pasoProximo(f, p) {
    return `<p class="page-lead">${p.que}</p>
      <div class="placeholder-box"><p><b>Este paso llegará en una próxima versión.</b></p>
      <p>Mientras, haz una copia de seguridad desde la portada: guarda todo tu trabajo.</p>
      <div class="toolbar" style="justify-content:center"><a class="btn" href="#/aprende/4">Repasarlo en «Aprende»</a><a class="btn btn--primary" href="#/flujo/${f.id}/4">Volver al dibujo →</a></div></div>`;
  }

  // ---------- Paso 1 · El proceso ----------
  function paso1(f) {
    return `
      ${idea("Antes de dibujar hay que <b>poner límites</b>: qué hecho abre el proceso y cuál lo cierra. Lo que pase antes o después queda fuera del dibujo.")}
      ${facil(`<p>Elige un proceso <b>relevante para la seguridad del paciente</b> en tu unidad: la toma de constantes, un alta, una petición de prueba, la preparación de quirófano…</p>
        <p>Escribe dónde <b>empieza</b> («El facultativo indica la toma de constantes») y dónde <b>acaba</b> («El facultativo decide con los valores»). Esos serán el primer y el último símbolo del dibujo.</p>
        ${trampa("Un proceso demasiado grande («toda la atención en Urgencias») da un dibujo enorme que nadie revisa. Mejor uno acotado y, si hace falta, varios flujogramas.")}`)}
      <div class="card">
        <h2 class="sub-h">Datos del proceso</h2>
        ${campo(f, "proceso", "Proceso que se dibuja", { ph: "p. ej. Toma de constantes en planta", help: "El proceso, con el nombre con el que lo conoce todo el mundo en la unidad." })}
        <div class="dos-col">
          ${campo(f, "titulo", "Nombre corto de este flujograma", { opt: true, ph: "p. ej. Constantes planta 3.ª", help: "Para reconocerlo en tu lista. Si lo dejas vacío, se usa el nombre del proceso." })}
          ${campo(f, "unidad", "Unidad o servicio", { ph: "p. ej. Hospitalización de Medicina Interna" })}
        </div>
        <div class="dos-col">
          ${campo(f, "inicio", "El proceso empieza cuando…", { ph: "p. ej. El facultativo indica la toma de constantes" })}
          ${campo(f, "fin", "Y termina cuando…", { ph: "p. ej. El facultativo decide con los valores" })}
        </div>
        <div class="dos-col">
          ${campo(f, "incluye", "Qué queda dentro", { area: true, opt: true, ph: "p. ej. Pacientes adultos ingresados" })}
          ${campo(f, "excluye", "Qué queda fuera", { area: true, opt: true, ph: "p. ej. Monitorización continua en UCI" })}
        </div>
        ${campo(f, "objetivo", "Objetivo del proceso", { area: true, opt: true, ph: "p. ej. Que las constantes se tomen, se registren y lleguen al facultativo a tiempo", help: "Para qué existe el proceso. Ayuda a ver qué pasos sobran y dónde está el riesgo.", extra: `<div class="quick no-print"><button type="button" class="chip chip--accent" data-act="sug-objetivo">✎ Proponer objetivo</button></div>` })}
        <div class="dos-col">
          ${campo(f, "responsable", "Responsable", { opt: true, ph: "p. ej. Supervisión de enfermería" })}
          ${campo(f, "fecha", "Fecha", { opt: true, ph: "p. ej. Octubre 2026" })}
        </div>
      </div>
      ${amfeHtml(f)}
      <div data-zona="avisos">${avisosGenerales(f, 1)}</div>`;
  }
  // «Traer de AMFE»: lee el paquete «amfe-fallos» de este navegador o de la copia .json de AMFE
  let amfesLeidos = null, amfeElegido = "", opcAmfe = { proceso: true, actores: true, esqueleto: true, puntos: true };
  function amfeHtml(f) {
    const ya = f.amfe && f.amfe.id ? `<p class="field-sub">Traído del AMFE «${esc(f.amfe.titulo || "sin nombre")}» el ${esc(fmtFecha(f.amfe.traido))} (${plural(f.amfe.fallos.length, "fallo", "fallos")}). Si el AMFE cambia, vuelve a traerlo.</p>` : "";
    if (!amfesLeidos) return `<div class="card amfe-card no-print"><h2 class="sub-h">¿Ya tienes un AMFE de este proceso?</h2>
      <p class="field-sub">Trae de la app <b>AMFE</b> el proceso, sus subprocesos y quién interviene, y si quieres un borrador de los pasos y un punto crítico por cada fallo prioritario.</p>${ya}
      <div class="toolbar"><button class="btn" data-act="amfe-buscar">⇩ Traer de AMFE</button></div></div>`;
    const A = amfesLeidos, a = A.find(x => x.id === amfeElegido) || A[0];
    const chk = (k, t, sub) => `<label class="check"><input type="checkbox" data-amfeopc="${k}"${opcAmfe[k] ? " checked" : ""}${sub ? "" : ""} /> <span>${t}</span></label>`;
    return `<div class="card amfe-card no-print"><h2 class="sub-h">Traer de AMFE</h2>
      ${selector("AMFE", 'data-amfesel="1"', a.id, A.map(x => [x.id, `${x.titulo || x.proceso || "AMFE sin nombre"} · ${plural((x.subprocesos || []).length, "subproceso", "subprocesos")} · ${plural((x.fallos || []).length, "fallo", "fallos")}`]))}
      <div class="amfe-opc">
        ${chk("proceso", "El proceso y sus subprocesos (con inicio, fin y roles)")}
        ${chk("actores", "Los roles de los subprocesos como calles")}
        ${chk("esqueleto", f.pasos.length ? "Borrador de los pasos (no se hará: este flujograma ya tiene pasos)" : "Un borrador de los pasos: el inicio y el fin de cada subproceso, encadenados")}
        ${chk("puntos", `Un punto crítico por cada fallo prioritario (${(a.fallos || []).filter(x => x.prioritario === true).length})`)}
      </div>
      <div class="toolbar"><button class="btn btn--primary" data-act="amfe-traer">Traer</button><button class="btn" data-act="amfe-cancelar">Cancelar</button></div>
      <p class="field-sub">Se copia: si después cambias el AMFE, vuelve a traerlo. Nada de lo que ya tienes se borra.</p></div>`;
  }

  // ---------- Paso 2 · Actores y subprocesos ----------
  function actorCard(f, a, i, total) {
    const n = f.pasos.filter(p => p.actorId === a.id).length;
    return `<div class="actor-fila">
      <span class="eq-n">${i + 1}</span>
      <div class="input-wrap"><input class="txt-in" data-ac="${a.id}" data-f="nombre" value="${esc(a.nombre)}" placeholder="p. ej. Enfermería" autocomplete="off" aria-label="Actor ${i + 1}" /></div>
      <span class="actor-n">${plural(n, "paso", "pasos")}</span>
      <span class="sub-acc no-print"><button type="button" class="icon-mini" data-act="ac-subir" data-id="${a.id}" aria-label="Subir"${i === 0 ? " disabled" : ""}>↑</button><button type="button" class="icon-mini" data-act="ac-bajar" data-id="${a.id}" aria-label="Bajar"${i === total - 1 ? " disabled" : ""}>↓</button><button type="button" class="link-btn link-btn--peligro" data-act="ac-del" data-id="${a.id}">Quitar</button></span>
    </div>`;
  }
  const bs = (s, k) => `data-s="${s.id}" data-f="${k}"`;
  function subCard(s, i, total) {
    return `<div class="sub-card sub-c${s.color}" data-sid="${s.id}">
      <div class="sub-cab">${subPunto(s)}<b>Subproceso ${i + 1}</b>
        <span class="sub-acc no-print"><button type="button" class="icon-mini" data-act="sub-subir" data-id="${s.id}" aria-label="Subir"${i === 0 ? " disabled" : ""}>↑</button><button type="button" class="icon-mini" data-act="sub-bajar" data-id="${s.id}" aria-label="Bajar"${i === total - 1 ? " disabled" : ""}>↓</button><button type="button" class="link-btn link-btn--peligro" data-act="sub-del" data-id="${s.id}">Quitar</button></span></div>
      ${campo(s, "nombre", "Nombre", { bind: bs(s, "nombre"), ph: "p. ej. Triaje de enfermería" })}
      ${campo(s, "descripcion", "Qué se hace", { bind: bs(s, "descripcion"), area: true, opt: true, ph: "p. ej. Evaluación clínica inicial y asignación de prioridad" })}
      <div class="dos-col">
        ${campo(s, "inicio", "Empieza cuando…", { bind: bs(s, "inicio"), ph: "p. ej. Recepción por enfermería de triaje" })}
        ${campo(s, "fin", "Termina cuando…", { bind: bs(s, "fin"), ph: "p. ej. Derivación a sala de espera" })}
      </div>
      ${campo(s, "roles", "Quién interviene", { bind: bs(s, "roles"), opt: true, ph: "p. ej. Enfermería, paciente, acompañante", help: "Separa los perfiles con comas. La app te avisa si alguno no tiene calle." })}
    </div>`;
  }
  function paso2(f) {
    const usados = new Set(f.actores.map(a => L.normal(a.nombre)));
    const sin = L.rolesSinCalle(f);
    return `
      ${idea("Cada <b>actor</b> (un profesional, un servicio o el propio paciente) tendrá su <b>calle</b>: una columna del dibujo. Cuando el proceso pasa de una calle a otra hay un <b>traspaso</b>, y ahí es donde más se falla.")}
      ${facil(`<p>Escribe <b>perfiles</b>, no nombres de personas: «Facultativo», «Enfermería», «Celador», «Técnico de Radiología». El orden de la lista es el orden de las columnas (de izquierda a derecha).</p>
        <p>Los <b>subprocesos</b> son opcionales: sirven para procesos largos (como el de Urgencias, con siete). Cada uno es una fase con su inicio, su fin y sus roles, y en el dibujo sale como una banda de color.</p>`)}
      <h2 class="sec-t">Actores (calles) <span class="contador" data-zona="nact">${f.actores.length}</span></h2>
      <div class="card no-print"><p class="field-sub">Añade con un toque los habituales:</p>
        <div class="quick">${L.ACTORES_SUG.map((x, i) => `<button type="button" class="chip${usados.has(L.normal(x)) ? " active" : ""}" data-act="ac-sug" data-i="${i}">+ ${esc(x)}</button>`).join("")}</div></div>
      <div class="actor-lista">${f.actores.map((a, i) => actorCard(f, a, i, f.actores.length)).join("") || `<p class="placeholder-box">Aún no hay actores. Añádelos con los botones de arriba o escribe uno nuevo.</p>`}</div>
      <div class="toolbar no-print"><button class="btn btn--primary" data-act="ac-add">+ Añadir actor</button>${sin.length ? `<button class="btn" data-act="ac-roles">+ Añadir los roles de los subprocesos (${sin.length})</button>` : ""}</div>
      <h2 class="sec-t">Subprocesos <span class="field-opt">(opcional)</span> <span class="contador" data-zona="nsub">${f.subprocesos.length}</span></h2>
      <div class="sub-lista">${f.subprocesos.map((s, i) => subCard(s, i, f.subprocesos.length)).join("")}</div>
      <div class="toolbar no-print"><button class="btn" data-act="sub-add">+ Añadir subproceso</button></div>
      <div data-zona="avisos">${avisosGenerales(f, 2)}</div>`;
  }

  // ---------- Paso 3 · Los pasos ----------
  const bp = (p, k) => `data-pa="${p.id}" data-f="${k}"`;
  const nomPaso = (q) => `${q.num}. ${L.corto(q.texto || "(sin texto)", 42)}`;
  function salidasTxt(f, p) {
    const n = id => { const q = L.pasoDe(f, id); return q ? q.num : "?"; };
    const S = p.siguientes.filter(s => L.pasoDe(f, s.a));
    if (p.tipo === "decision") return ["si", "no"].map(k => { const s = S.find(x => x.etiqueta === k); return `${k === "si" ? "Sí" : "No"} → ${s ? n(s.a) : "?"}`; }).join(" · ");
    if (!S.length) return p.tipo === "terminal" ? "Fin" : "→ ?";
    return S.map(s => `→ ${n(s.a)}${s.estilo === "idavuelta" ? " ⇄" : ""}`).join(" · ");
  }
  function pasoCabInner(f, p) {
    const a = L.actorDe(f, p), err = L.avisosPasos(f).some(x => x.paso === p.id && x.nivel === "error");
    return `<span class="rg-puesto">Nº ${p.num}</span>${tipoChip(p.tipo)}<span class="rg-txt"><b>${lleno(p.texto) ? esc(p.texto) : '<span class="vacio">Paso sin texto</span>'}</b><span>${a ? esc(a.nombre) : p.tipo === "terminal" || p.tipo === "externo" ? L.TIPOS[p.tipo].nom : '<span class="falta">¿Quién?</span>'} · ${esc(salidasTxt(f, p))}${err ? ' <span class="falta">Revisar</span>' : ""}</span></span><span class="rg-flecha" aria-hidden="true">▾</span>`;
  }
  function salidasHtml(f, p) {
    const otros = f.pasos.filter(q => q.id !== p.id);
    const ops = [["", "— Ninguno —"], ...otros.map(q => [q.id, nomPaso(q)])];
    const sel = (lab, c, v, extra = "") => `<div class="sal-fila"><span class="sal-lab${c === "si" ? " sal--si" : c === "no" ? " sal--no" : ""}">${lab}</span><div class="input-wrap"><select class="txt-in" data-sal="${p.id}" data-c="${c}" aria-label="${esc(lab)}">${ops.map(([id, t]) => `<option value="${esc(id)}"${id === v ? " selected" : ""}>${esc(t)}</option>`).join("")}</select></div>${extra}</div>`;
    if (p.tipo === "decision") {
      const si = p.siguientes.find(s => s.etiqueta === "si"), no = p.siguientes.find(s => s.etiqueta === "no");
      return `<div class="field"><div class="field-head"><label class="field-label">Salidas</label></div>${sel("Sí →", "si", si ? si.a : "")}${sel("No →", "no", no ? no.a : "")}</div>`;
    }
    const filas = p.siguientes.map((s, i) => sel(i === 0 ? "Sigue a →" : "Y a →", String(i), s.a, `<button type="button" class="chip chip--mini${s.estilo === "idavuelta" ? " active" : ""}" data-act="p-ida" data-id="${p.id}" data-i="${i}" title="Flecha roja discontinua con punta en los dos extremos: algo que va y vuelve">⇄ ida y vuelta</button>`));
    if (!filas.length) filas.push(sel(p.tipo === "terminal" ? "Sigue a → (si es inicio)" : "Sigue a →", "0", ""));
    return `<div class="field"><div class="field-head"><label class="field-label">Sigue a</label>${ayudaBtn("El paso que viene después. Si algo sigue a dos pasos a la vez, añade otra flecha. Una «vuelta atrás» (repetir algo) se hace eligiendo un paso anterior.").btn}</div>${filas.join("")}
      ${p.siguientes.length ? `<button type="button" class="link-btn no-print" data-act="p-flecha" data-id="${p.id}">+ Otra flecha</button>` : ""}</div>`;
  }
  function pasoCard(f, p, siempre) {
    const ab = siempre || abiertos.has(p.id), anfitriones = f.pasos.filter(q => q.id !== p.id && q.tipo !== "documento" && q.tipo !== "datos");
    return `<div class="rg paso-card tipo-borde--${p.tipo}" data-pid="${p.id}">
      <div class="rg-cab">${siempre ? `<div class="rg-toggle rg-toggle--fijo">${pasoCabInner(f, p)}</div>` : `<button type="button" class="rg-toggle" data-act="p-toggle" data-id="${p.id}" aria-expanded="${ab}">${pasoCabInner(f, p)}</button>`}</div>
      <div data-zav="${p.id}">${avisosPaso(f, p.id)}</div>
      <div class="rg-body"${ab ? "" : " hidden"}>
        <div class="field"><div class="field-head"><label class="field-label">Tipo</label>${ayudaBtn(L.ORDEN_TIPOS.map(t => `<b>${L.TIPOS[t].nom}</b> (${L.TIPOS[t].forma.toLowerCase()}): ${L.TIPOS[t].que}`).join("<br>")).btn}</div>
          <div class="tipos" role="group" aria-label="Tipo de paso">${L.ORDEN_TIPOS.map(t => `<button type="button" class="tipo-btn${p.tipo === t ? " active" : ""}" data-act="p-tipo" data-id="${p.id}" data-v="${t}">${tipoChip(t)}<span>${L.TIPOS[t].corto}</span></button>`).join("")}</div></div>
        ${campo(p, "texto", p.tipo === "decision" ? "Pregunta (se responde Sí o No)" : p.tipo === "terminal" ? "Qué pasa al empezar o al acabar" : "Qué se hace", { bind: bp(p, "texto"), area: true, ph: { decision: "p. ej. ¿Valores normales?", terminal: "p. ej. Llega el paciente a admisión", documento: "p. ej. Hoja de tratamiento", datos: "p. ej. Registra en la historia clínica", externo: "p. ej. Laboratorio" }[p.tipo] || "p. ej. Extrae la muestra y la identifica" })}
        <div class="dos-col">
          ${selector(p.tipo === "terminal" || p.tipo === "externo" ? "Calle (opcional)" : "Quién lo hace", bp(p, "actorId"), p.actorId, [["", p.tipo === "terminal" || p.tipo === "externo" ? "— Fuera de las calles —" : "— Sin asignar —"], ...f.actores.map(a => [a.id, a.nombre || "(actor sin nombre)"])], { help: p.tipo === "terminal" || p.tipo === "externo" ? "Los inicios, los fines y los procesos externos suelen ir fuera de las calles, como en el curso. Si eliges un actor, va en su calle." : "Elige un actor del paso 2. Para añadir otro, ve al paso 2." })}
          ${f.subprocesos.length ? selector("Subproceso", bp(p, "subprocesoId"), p.subprocesoId, [["", "— Ninguno —"], ...f.subprocesos.map((s, i) => [s.id, `${i + 1}. ${s.nombre || "Sin nombre"}`])]) : ""}
        </div>
        ${salidasHtml(f, p)}
        ${p.tipo === "documento" || p.tipo === "datos" ? selector("Va con (opcional)", bp(p, "con"), p.con, [["", "— Va suelto en el flujo —"], ...anfitriones.map(q => [q.id, nomPaso(q)])], { help: "Si es un papel o unos datos que acompañan a una actividad, se dibuja a su lado y no ocupa una fila propia." }) : ""}
        ${campo(p, "nota", "Nota", { bind: bp(p, "nota"), area: true, opt: true, ph: "Aclaración que no sale en el dibujo" })}
        <div class="toolbar toolbar--paso no-print">
          <button type="button" class="btn btn--sm" data-act="p-debajo" data-id="${p.id}">+ Paso debajo</button>
          <button type="button" class="btn btn--sm" data-act="p-decision" data-id="${p.id}">+ Decisión debajo</button>
          ${siempre ? "" : `<button type="button" class="icon-mini" data-act="p-subir" data-id="${p.id}" aria-label="Subir en la lista">↑</button><button type="button" class="icon-mini" data-act="p-bajar" data-id="${p.id}" aria-label="Bajar en la lista">↓</button>`}
          <button type="button" class="link-btn link-btn--peligro" data-act="p-del" data-id="${p.id}">Quitar</button>
        </div>
      </div>
    </div>`;
  }
  function pegarHtml() {
    if (!pegarAbierto) return "";
    return `<div class="card pegar-card no-print">
      <h2 class="sub-h">Escribir o pegar los pasos</h2>
      <p class="field-sub">Una <b>lista</b>, un paso por línea (como el ejercicio 5), o una <b>tabla</b> copiada de Excel, Calc o Word con columnas Nº · Tipo · Paso · Quién · Sigue a.</p>
      <textarea class="txt-in" id="pegar-txt" rows="7" placeholder="1. Enfermera consulta hoja de indicaciones.&#10;2. Acude a la habitación del paciente.&#10;3. Mide TA, FC, FR, SatO2 y Tª.&#10;4. Registra en historia clínica electrónica.&#10;5. Informa al médico si hay valores anómalos."></textarea>
      <div data-zona="pegar"></div>
      ${facil(`<ul><li>Si la línea empieza por un profesional («Enfermera…», «Médico…», «Celador…»), ese es el actor; si no, el de la línea anterior.</li><li>Las preguntas («¿…?») son decisiones; las frases con «si» («Informa al médico si hay valores anómalos») se convierten en decisión + actividad.</li><li>«Inicio: …», «Fin: …», «Documento: …» y «Datos: …» al principio de la línea fijan el tipo.</li><li>Si no hay inicio o fin, se añaden.</li></ul>`, "Cómo lo entiende la app")}
      <div class="toolbar"><button class="btn btn--primary" data-act="pegar-ok" disabled>Añadir los pasos</button><button class="btn" data-act="pegar-cerrar">Cancelar</button></div>
    </div>`;
  }
  function paso3(f) {
    return `
      ${idea("Escribe el proceso <b>paso a paso</b>: qué se hace, <b>quién</b> lo hace y <b>a qué paso sigue</b>. La app dibuja el flujograma con todo eso.")}
      ${facil(`<p>Cada paso tiene un <b>tipo</b>, que decide su símbolo:</p><div class="leyenda-wrap">${D.leyenda(L.ORDEN_TIPOS.map(t => [t, L.TIPOS[t].corto]))}</div>
        <p>Una <b>decisión</b> es una pregunta con dos salidas: Sí y No. El resto de pasos suelen tener una salida: el paso que viene después.</p>
        ${trampa("Lo más frecuente al empezar: decisiones sin la salida del No, pasos que no llevan a ningún sitio y actividades escritas como un papel («Hoja de tratamiento» es un documento; «Escribe la hoja de tratamiento», una actividad).")}`)}
      <div class="toolbar no-print">
        <button class="btn btn--primary" data-act="p-add">+ Añadir paso</button>
        <button class="btn" data-act="pegar-abrir">✎ Escribir o pegar una lista</button>
        ${f.pasos.length ? `<button class="btn" data-act="p-todos">${abiertos.size ? "Cerrar todos" : "Abrir todos"}</button><a class="btn" href="#/flujo/${f.id}/4">Ver el dibujo →</a>` : ""}
      </div>
      ${pegarHtml()}
      <div class="pasos-lista">${f.pasos.map(p => pasoCard(f, p)).join("") || (pegarAbierto ? "" : `<div class="placeholder-box"><p><b>Aún no hay pasos.</b></p><p>Lo más rápido: «Escribir o pegar una lista». También puedes añadirlos uno a uno.</p></div>`)}</div>
      ${f.pasos.length ? `<div class="toolbar no-print"><button class="btn" data-act="p-add">+ Añadir paso al final</button></div>` : ""}
      <h2 class="sec-t">¿Está bien hecho?</h2>
      <div data-zona="avisos3">${validadorHtml(f)}</div>`;
  }
  function validadorHtml(f) {
    const A = L.avisosPasos(f), err = A.filter(a => a.nivel === "error").length, war = A.filter(a => a.nivel === "warn").length;
    if (!f.pasos.length) return A.map(avisoHtml).join("");
    const cab = !err && !war ? `<div class="ok-box">✓ El validador no encuentra errores. Revisa el dibujo con el equipo.</div>` : `<p class="field-sub">${err ? `<b>${plural(err, "error", "errores")}</b> que impiden dar el flujograma por bueno` : ""}${err && war ? " y " : ""}${war ? plural(war, "aviso", "avisos") : ""}.</p>`;
    return cab + A.map(avisoHtml).join("");
  }

  // ---------- Paso 4 · El dibujo ----------
  const KEY_ZOOM = "flujograma-zoom";
  let zoom = null;   // null = ajustar a la pantalla
  const sinPasos = f => `<div class="placeholder-box"><p><b>Aún no hay nada que dibujar.</b></p><p>Escribe los pasos en el paso 3 y vuelve aquí.</p><div class="toolbar" style="justify-content:center"><a class="btn btn--primary" href="#/flujo/${f.id}/3">Ir al paso 3 →</a></div></div>`;
  function lienzoHtml(f) {
    const V = f.vista;
    const seg = (act, val, ops) => `<div class="seg seg--sm" role="group">${ops.map(([v, t]) => `<button type="button" class="${val === v ? "active" : ""}" data-act="${act}" data-v="${v}">${t}</button>`).join("")}</div>`;
    return `<div class="lienzo-barra no-print">
        ${seg("v-or", V.orientacion, [["vertical", "↓ De arriba abajo"], ["horizontal", "→ De izquierda a derecha"]])}
        <div class="lienzo-ops">
          ${f.subprocesos.length ? `<button type="button" class="chip${V.subprocesos ? " active" : ""}" data-act="v-sub">Subprocesos</button>` : ""}
          <button type="button" class="chip${V.calles === "turno" ? " active" : ""}" data-act="v-turno" title="Una calle nueva cada vez que el proceso vuelve a un profesional, como en las soluciones del curso">Calles por turnos</button>
          <button type="button" class="chip${V.marco ? " active" : ""}" data-act="v-marco" title="Procesos estratégicos, proceso clave y procesos de soporte, como en el Documento Final">Marco de procesos</button>
          <button type="button" class="chip${V.numeros ? " active" : ""}" data-act="v-num">Números</button>
          <button type="button" class="chip${V.letra === "grande" ? " active" : ""}" data-act="v-letra">Letra grande</button>
        </div>
        ${pasoActual === 4 ? `<div class="lienzo-ops"><button type="button" class="chip${recorrido ? " active" : ""}" data-act="recorrido">▶ Recorrido</button><button type="button" class="chip" data-act="reunion">⛶ Modo reunión</button>${anteriorDe(f) ? `<button type="button" class="chip${verCambios ? " active" : ""}" data-act="ver-cambios" title="Verde: pasos nuevos; ámbar: pasos cambiados respecto a la edición anterior">Cambios</button>` : ""}</div>` : ""}
        <div class="zoom-btns"><button type="button" class="icon-mini" data-act="z-menos" aria-label="Reducir">−</button><button type="button" class="btn btn--sm" data-act="z-ajustar">Ajustar</button><button type="button" class="icon-mini" data-act="z-mas" aria-label="Ampliar">+</button></div>
      </div>
      ${recorrido && pasoActual === 4 ? `<div data-zona="recorrido">${recorridoHtml(f)}</div>` : ""}
      <div class="lienzo" id="lienzo" tabindex="0" aria-label="Flujograma. Usa los botones para ampliar o reducir."><div class="lienzo-in" data-zona="lienzo">${svgActual(f)}</div></div>
      <div data-zona="panel">${panelHtml(f)}</div>
      ${V.marco && pasoActual === 4 ? marcoHtml(f) : ""}`;
  }
  // Marco del mapa de procesos (mejora E): una línea por proceso
  function marcoHtml(f) {
    const area = (k, t, ph) => `<div class="field"><div class="field-head"><label class="field-label">${t}</label></div><textarea class="txt-in" data-marco="${k}" rows="4" placeholder="${esc(ph)}">${esc(f.marco[k].join("\n"))}</textarea></div>`;
    return `<div class="card no-print"><h2 class="sub-h">Marco de procesos</h2><p class="field-sub">Un proceso por línea. El proceso clave es el que dibujas.</p>
      <div class="dos-col">${area("estrategicos", "Procesos estratégicos (arriba)", "p. ej. Contrato programa")}${area("soporte", "Procesos de soporte (abajo)", "p. ej. Sistemas de información")}</div>
      ${!f.marco.estrategicos.length && !f.marco.soporte.length ? `<div class="toolbar"><button class="btn btn--sm" data-act="marco-sug">Proponer los habituales</button></div>` : ""}</div>`;
  }
  function paso4(f) {
    const err = L.errores(f).length;
    if (!f.pasos.length) return sinPasos(f);
    return `
      ${facil(`<p>La app coloca cada paso <b>en la calle de quien lo hace</b> y <b>una fila por debajo</b> del paso anterior. Las dos ramas de una decisión se separan: la que va justo debajo sigue recta y la otra sale por un lado. Las vueltas atrás suben por un pasillo lateral.</p>
        <p><b>Toca un símbolo</b> para corregir su paso aquí mismo. Amplía con los botones o pellizcando con dos dedos.</p>
        ${practica("Revisad el dibujo <b>con quien hace el proceso cada día</b>: ¿falta algún paso?, ¿alguien hace algo que no sale?, ¿hay esperas o atajos? Cuando estéis de acuerdo, marcadlo como validado.")}
        <p>Si algo no queda bien colocado, toca el paso y usa <b>«Retoque del dibujo»</b>: bajarlo una fila o ponerlo al lado de otro. Para retoques finos, descárgalo para draw.io en el paso 6.</p>`)}
      ${err ? `<div class="aviso-error">✕ El dibujo tiene ${plural(err, "error", "errores")} (en rojo). <a href="#avisos4">Ver cuáles</a></div>` : ""}
      ${lienzoHtml(f)}
      <div class="leyenda-wrap no-print">${D.leyenda(L.ORDEN_TIPOS.map(t => [t, L.TIPOS[t].corto]))}</div>
      <h2 class="sec-t" id="avisos4">¿Está bien hecho?</h2>
      <div data-zona="avisos3">${validadorHtml(f)}</div>
      <h2 class="sec-t">Revisión con el equipo</h2>
      <div class="card" data-zona="validado">${validadoHtml(f)}</div>`;
  }
  function svgActual(f) {
    const marcar = new Set(pasoActual === 5 ? [] : L.errores(f).map(a => a.paso).filter(Boolean));
    const cmp = pasoActual === 4 && verCambios && anteriorDe(f) ? L.compararEdiciones(anteriorDe(f), f) : null;
    return D.svg(L.dibujar(f), { marcar, sel: recorrido && pasoActual === 4 ? pasoRec : selPaso, nuevos: cmp ? new Set(cmp.nuevos.map(p => p.id)) : null, cambiados: cmp ? new Set(cmp.cambiados.map(c => c.paso.id)) : null, numeros: f.vista.numeros, titulo: "Flujograma: " + (nombreFlujo(f) || "sin nombre"), accesible: true });
  }
  function panelHtml(f) {
    const p = selPaso && L.pasoDe(f, selPaso);
    if (pasoActual === 5) {
      if (!p) return `<p class="field-sub panel-pista no-print">Toca un paso del dibujo para marcar en él un punto crítico.</p>`;
      const l = f.puntos.filter(x => x.pasoId === p.id);
      return `<div class="panel-paso no-print"><div class="panel-cab"><b>Paso nº ${p.num} · ${esc(L.corto(p.texto || "sin texto", 50))}</b><button type="button" class="link-btn" data-act="panel-cerrar">Cerrar ✕</button></div>
        ${l.map(x => puntoCard(f, x)).join("") || `<p class="field-sub">Este paso no tiene puntos críticos.</p>`}
        <div class="toolbar"><button class="btn btn--primary btn--sm" data-act="pc-add" data-id="${p.id}">+ Punto crítico en este paso</button></div></div>`;
    }
    if (!p) return `<p class="field-sub panel-pista no-print">Toca un símbolo del dibujo para corregir su paso.</p>`;
    return `<div class="panel-paso no-print"><div class="panel-cab"><b>Paso nº ${p.num}</b><button type="button" class="link-btn" data-act="panel-cerrar">Cerrar ✕</button></div>${pasoCard(f, p, true)}${retoqueHtml(f, p)}</div>`;
  }
  // Retoques ligeros (mejora H): bajar el paso unas filas o ponerlo al lado de otro. El resto se recoloca solo.
  function retoqueHtml(f, p) {
    const fila = parseInt(p.ajuste.fila, 10) || 0, otros = f.pasos.filter(q => q.id !== p.id && !(q.ajuste && q.ajuste.lado === p.id));
    return `<div class="card retoque"><h3 class="sub-h">Retoque del dibujo</h3>
      <div class="toolbar"><button type="button" class="btn btn--sm" data-act="aj-bajar" data-id="${p.id}"${p.ajuste.lado ? " disabled" : ""}>↓ Bajar una fila</button><button type="button" class="btn btn--sm" data-act="aj-subir" data-id="${p.id}"${fila ? "" : " disabled"}>↑ Subir</button>${fila ? `<span class="badge">${plural(fila, "fila de más", "filas de más")}</span>` : ""}</div>
      ${selector("Poner al lado de", `data-aj="${p.id}"`, p.ajuste.lado, [["", "— Donde lo pone la app —"], ...otros.map(q => [q.id, nomPaso(q)])], { help: "Lo coloca en la misma fila que el paso elegido, a su derecha si es de la misma calle." })}
      ${fila || p.ajuste.lado ? `<button type="button" class="link-btn" data-act="aj-quitar" data-id="${p.id}">Quitar los retoques de este paso</button>` : ""}</div>`;
  }
  function validadoHtml(f) {
    const err = L.errores(f).length;
    if (lleno(f.validado)) return `<p class="ok-box">✓ Validado con el equipo el <b>${esc(fmtFecha(f.validado))}</b>.</p><p class="field-sub">Si cambiáis el proceso, volved a revisarlo.</p><div class="toolbar no-print"><button class="btn btn--sm" data-act="validar-quitar">Quitar la validación</button></div>`;
    return `<p class="field-sub">El tema 3 del curso insiste: el flujograma se <b>revisa y valida con todo el equipo</b> que hace el proceso, para que refleje lo que de verdad se hace.</p>
      <div class="toolbar no-print"><button class="btn btn--primary" data-act="validar"${err ? " disabled" : ""}>✓ Lo hemos revisado: marcar como validado hoy</button></div>${err ? `<p class="field-sub">Antes, corrige los errores del validador.</p>` : ""}`;
  }

  // Zoom del lienzo: botones, Ctrl + rueda y pellizco con dos dedos
  function anchoSvg() { const s = $("#lienzo svg"); return s ? Number(s.getAttribute("width")) : 0; }
  function aplicarZoom() {
    const s = $("#lienzo svg"), l = $("#lienzo"); if (!s || !l) return;
    const w = Number(s.getAttribute("width")), h = Number(s.getAttribute("height"));
    // Por defecto, ajustado al ancho pero nunca tan pequeño que no se lea (en el móvil se desplaza con el dedo)
    const z = zoom == null ? Math.max(0.55, Math.min(1, ajusteAncho())) : zoom;
    s.style.width = Math.round(w * z) + "px"; s.style.height = Math.round(h * z) + "px";
  }
  function ajusteAncho() { const s = $("#lienzo svg"), l = $("#lienzo"); return s && l ? Math.min(1, (l.clientWidth - 4) / Number(s.getAttribute("width")), (l.clientHeight - 4) / Number(s.getAttribute("height"))) : 1; }
  function zoomActual() { const s = $("#lienzo svg"); return s ? parseFloat(s.style.width) / anchoSvg() : 1; }
  function ponerZoom(z, cx, cy) {
    const l = $("#lienzo"); if (!l) return;
    const antes = zoomActual(), nz = Math.max(0.2, Math.min(3, z));
    const px = (l.scrollLeft + (cx == null ? l.clientWidth / 2 : cx)) / antes, py = (l.scrollTop + (cy == null ? l.clientHeight / 2 : cy)) / antes;
    zoom = nz; aplicarZoom();
    l.scrollLeft = px * nz - (cx == null ? l.clientWidth / 2 : cx); l.scrollTop = py * nz - (cy == null ? l.clientHeight / 2 : cy);
  }
  function iniciarLienzo() {
    const l = $("#lienzo"); if (!l) return;
    aplicarZoom();
    const dedos = new Map(); let ini = null;
    l.addEventListener("pointerdown", e => { if (e.pointerType === "touch") dedos.set(e.pointerId, [e.clientX, e.clientY]); if (dedos.size === 2) { const [a, b] = [...dedos.values()]; ini = { d: Math.hypot(a[0] - b[0], a[1] - b[1]), z: zoomActual() }; } });
    l.addEventListener("pointermove", e => {
      if (!dedos.has(e.pointerId)) return; dedos.set(e.pointerId, [e.clientX, e.clientY]);
      if (dedos.size === 2 && ini) { const [a, b] = [...dedos.values()], r = l.getBoundingClientRect(); ponerZoom(ini.z * Math.hypot(a[0] - b[0], a[1] - b[1]) / ini.d, (a[0] + b[0]) / 2 - r.left, (a[1] + b[1]) / 2 - r.top); }
    });
    const fuera = e => { dedos.delete(e.pointerId); if (dedos.size < 2) ini = null; };
    ["pointerup", "pointercancel", "pointerleave"].forEach(t => l.addEventListener(t, fuera));
    l.addEventListener("wheel", e => { if (!e.ctrlKey) return; e.preventDefault(); const r = l.getBoundingClientRect(); ponerZoom(zoomActual() * (e.deltaY < 0 ? 1.1 : 0.9), e.clientX - r.left, e.clientY - r.top); }, { passive: false });
    l.addEventListener("keydown", e => { const g = e.target.closest && e.target.closest(".fl-nodo"); if (g && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); seleccionar(g.dataset.paso); } });
  }
  function seleccionar(id) {
    selPaso = id; const f = actual; if (!f) return;
    const z = $("[data-zona='lienzo']"); if (z) { z.innerHTML = svgActual(f); aplicarZoom(); }
    const pz = $("[data-zona='panel']"); if (pz) { pz.innerHTML = panelHtml(f); if (id) pz.scrollIntoView({ block: "nearest", behavior: "smooth" }); }
  }
  window.addEventListener("resize", () => { if ((pasoActual === 4 || pasoActual === 5) && zoom == null) aplicarZoom(); });

  // ---------- Vista recorrido y modo reunión (mejora F) ----------
  let recorrido = false, pasoRec = "", historialRec = [], verCambios = true;
  const anteriorDe = f => f.anteriorId ? (datos.flujos.find(x => x.id === f.anteriorId) || null) : null;
  function recorridoHtml(f) {
    const p = L.pasoDe(f, pasoRec) || L.primerPaso(f); if (!p) return "";
    pasoRec = p.id;
    const i = f.pasos.indexOf(p), a = L.actorDe(f, p), sb = L.subDe(f, p), S = L.salidasDe(f, p), E = L.entradasDe(f, p), pts = f.puntos.filter(x => x.pasoId === p.id);
    const traspaso = q => q && q.actorId && p.actorId && q.actorId !== p.actorId;
    return `<div class="rec-card tipo-borde--${p.tipo}">
      <div class="rec-cab"><span class="rec-n">Paso ${p.num}</span>${tipoChip(p.tipo)}<span class="rec-tipo">${esc(L.TIPOS[p.tipo].nom)}</span>${sb ? `<span class="rec-sub">${subPunto(sb)}${esc(sb.nombre)}</span>` : ""}<button type="button" class="link-btn" data-act="recorrido">Cerrar ✕</button></div>
      <p class="rec-txt">${esc(p.texto || "(sin texto)")}</p>
      <p class="rec-quien">${a ? `<b>${esc(a.nombre)}</b>` : p.tipo === "terminal" ? (L.esInicio(f, p) ? "Inicio del proceso" : "Fin del proceso") : "Sin actor"}${E.length ? ` · viene de ${E.map(q => `nº ${q.num}${traspaso(q) ? " (traspaso desde " + esc(L.actorDe(f, q).nombre) + ")" : ""}`).join(", ")}` : ""}</p>
      ${pts.length ? `<div class="rec-pc">${pts.map(x => `<span class="pc-num">⚠ ${x.num}</span> ${esc(x.titulo)}`).join("<br>")}</div>` : ""}
      <div class="rec-acc">
        <button type="button" class="btn" data-act="rec-atras"${historialRec.length ? "" : " disabled"}>← Atrás</button>
        ${S.map(x => `<button type="button" class="btn btn--primary${x.s.etiqueta === "no" ? " rec-no" : ""}" data-act="rec-ir" data-id="${x.q.id}">${x.s.etiqueta === "si" ? "Sí → " : x.s.etiqueta === "no" ? "No → " : "→ "}${esc(L.corto(x.q.texto, 34))}</button>`).join("") || `<span class="badge">Fin</span><button type="button" class="btn" data-act="rec-inicio">Volver a empezar</button>`}
      </div></div>`;
  }
  function irRecorrido(id, atras) {
    if (!atras && pasoRec) historialRec.push(pasoRec);
    pasoRec = id; const f = actual;
    const z = $("[data-zona='recorrido']"); if (z) z.innerHTML = recorridoHtml(f);
    const l = $("[data-zona='lienzo']"); if (l) { l.innerHTML = svgActual(f); aplicarZoom(); }
    const s = $(`#lienzo .fl-nodo[data-paso="${pasoRec}"]`), lz = $("#lienzo");
    if (s && lz) { const r = s.getBoundingClientRect(), rl = lz.getBoundingClientRect(); lz.scrollLeft += r.left - rl.left - rl.width / 2 + r.width / 2; lz.scrollTop += r.top - rl.top - rl.height / 2 + r.height / 2; }
  }
  function ponerReunion(si) {
    document.body.classList.toggle("modo-reunion", si);
    let x = $("#salir-reunion");
    if (si && !x) { x = document.createElement("button"); x.id = "salir-reunion"; x.className = "btn salir-reunion no-print"; x.textContent = "✕ Salir del modo reunión"; x.addEventListener("click", () => ponerReunion(false)); document.body.appendChild(x); }
    if (!si && x) x.remove();
    if (actual) { zoom = null; repintar(); }
  }

  // ---------- Paso 5 · Puntos críticos ----------
  const bpc = (x, k) => `data-pc="${x.id}" data-f="${k}"`;
  function puntoCard(f, x) {
    const p = L.pasoDe(f, x.pasoId);
    return `<div class="sub-card punto-card" data-ptid="${x.id}">
      <div class="sub-cab"><span class="pc-num" aria-hidden="true">⚠ ${x.num}</span><b>Punto crítico nº ${x.num}</b>${x.origen === "propuesta" ? `<span class="badge">Propuesto por la app</span>` : ""}
        <span class="sub-acc no-print"><button type="button" class="link-btn link-btn--peligro" data-act="pc-del" data-id="${x.id}">Quitar</button></span></div>
      <div data-zpc="${x.id}">${avisosPunto(f, x.id)}</div>
      ${campo(x, "titulo", "Error o punto crítico", { bind: bpc(x, "titulo"), area: true, ph: "p. ej. No colocación de la pulsera identificativa", help: "Lo que puede salir mal en este paso, en una frase. Es un candidato a modo de fallo del AMFE." })}
      ${campo(x, "descripcion", "Descripción del error o riesgo", { bind: bpc(x, "descripcion"), area: true, opt: true, ph: "p. ej. El paciente no recibe su identificación física, con riesgo de errores en pruebas o tratamientos" })}
      <div class="dos-col">
        ${selector("En el paso", bpc(x, "pasoId"), x.pasoId, [["", "— Elige el paso —"], ...f.pasos.map(q => [q.id, nomPaso(q)])])}
        <div class="field"><div class="field-head"><label class="field-label">Fallos del AMFE</label><span class="field-opt">(opcional)</span>${ayudaBtn("Los números de los fallos del AMFE que corresponden a este punto, separados por comas. Es lo que mostrará el Mapa de Riesgos en el aviso, como «3, 5, 7» en el Documento Final de Urgencias.").btn}</div>
          <div class="input-wrap"><input class="txt-in" ${bpc(x, "fallos")} value="${esc(x.fallos.join(", "))}" placeholder="p. ej. 3, 5, 7" inputmode="numeric" autocomplete="off" /></div><div data-zfa="${x.id}">${fallosNombres(f, x)}</div></div>
      </div>
      ${p && pasoActual === 5 ? `<button type="button" class="link-btn no-print" data-act="ver-paso" data-id="${p.id}">Ver en el dibujo</button>` : ""}
    </div>`;
  }
  // Qué es cada número de fallo, si el flujograma se trajo de un AMFE
  function fallosNombres(f, x) {
    if (!f.amfe || !f.amfe.fallos.length || !x.fallos.length) return "";
    return `<ul class="fallos-amfe">${x.fallos.map(n => { const y = L.falloAmfe(f, n); return `<li><b>${esc(n)}</b> ${y ? esc(L.corto(y.fallo, 70)) + (y.ipr ? ` <span class="badge">IPR ${y.ipr}</span>` : "") : '<span class="falta">no está en el AMFE traído</span>'}</li>`; }).join("")}</ul>`;
  }
  const avisosPunto = (f, id) => L.avisosPuntos(f).filter(a => a.punto === id).map(avisoHtml).join("");
  function propuestasHtml(f) {
    const P = L.propuestasPuntos(f), nd = f.descartes.length;
    if (!P.length) return `<p class="field-sub">No quedan propuestas.${nd ? ` <button type="button" class="link-btn" data-act="prop-recuperar">Recuperar las ${nd} descartadas</button>` : ""}</p>`;
    return `<div class="prop-lista">${P.map(x => { const p = L.pasoDe(f, x.pasoId); return `<div class="prop">
        <div class="prop-txt"><b>${esc(x.titulo)}</b><span>Paso nº ${p.num} · ${esc(L.corto(p.texto, 50))}. ${esc(x.motivo)}</span></div>
        <div class="prop-acc no-print"><button type="button" class="btn btn--sm btn--primary" data-act="prop-ok" data-k="${esc(x.clave)}">Añadir</button><button type="button" class="btn btn--sm" data-act="prop-no" data-k="${esc(x.clave)}">Descartar</button><button type="button" class="link-btn" data-act="ver-paso" data-id="${p.id}">Ver</button></div>
      </div>`; }).join("")}</div>${nd ? `<p class="field-sub"><button type="button" class="link-btn" data-act="prop-recuperar">Recuperar las ${nd} descartadas</button></p>` : ""}`;
  }
  function tablaPuntosHtml(f) {
    const G = L.puntosPorSub(f);
    if (!G.length) return `<p class="placeholder-box">Aún no hay puntos críticos. Añade alguno de las propuestas o toca un paso del dibujo.</p>`;
    return G.map(g => `<h3 class="grupo-t">${g.sub ? subPunto(g.sub) + esc(g.sub.nombre || "Subproceso sin nombre") : "Sin subproceso"}<span class="contador">${g.puntos.length}</span></h3><div class="sub-lista">${g.puntos.map(x => puntoCard(f, x)).join("")}</div>`).join("");
  }
  function paso5(f) {
    if (!f.pasos.length) return sinPasos(f);
    const nP = L.propuestasPuntos(f).length;
    return `
      ${idea("Un <b>punto crítico</b> es un paso donde el proceso puede fallar y dañar al paciente. Es el punto de partida del AMFE: cada uno es un candidato a modo de fallo.")}
      ${facil(`<p>¿Dónde buscarlos? Donde más se falla:</p>
        <ul><li><b>Traspasos</b>: cuando el proceso pasa de una calle a otra (información que no llega, paciente que se queda sin vigilar).</li><li><b>Decisiones</b>: si se decide mal, el paciente va por el camino equivocado.</li><li><b>Identificación</b> del paciente y de las muestras.</li><li><b>Registros</b>, <b>comunicación</b>, <b>traslados</b>, <b>medicación</b> y <b>esperas</b>.</li></ul>
        <p>Escribe cada uno como <b>lo que puede salir mal</b> («No se coloca la pulsera identificativa»), no como su consecuencia («Error de identidad»): esa irá en la columna «efecto» del AMFE.</p>
        ${practica("Toca un paso del dibujo para marcar en él un punto crítico. En el dibujo sale un aviso con su número, como en el mapa de riesgos del curso.")}`)}
      ${lienzoHtml(f)}
      ${f.amfe && f.amfe.fallos.some(x => x.ipr) ? `<p class="field-sub leyenda-niv"><span class="niv-c" style="background:#e51400"></span>IPR ≥ 300 <span class="niv-c" style="background:#f97316"></span>≥ 200 <span class="niv-c" style="background:#facc15"></span>≥ 100 <span class="niv-c" style="background:#22c55e"></span>menor · color del aviso según el IPR más alto de sus fallos del AMFE (los avisos sin números de fallo salen en rojo).</p>` : ""}
      <h2 class="sec-t">Propuestas de la app <span class="contador" data-zona="nprop">${nP}</span></h2>
      <p class="field-sub">Lugares del proceso donde suele haber riesgo. Añade los que tengan sentido en tu unidad y descarta los demás.</p>
      <div data-zona="propuestas">${propuestasHtml(f)}</div>
      <h2 class="sec-t">Puntos críticos por subproceso <span class="contador" data-zona="npc">${f.puntos.length}</span></h2>
      <div data-zona="tablapc">${tablaPuntosHtml(f)}</div>
      <div data-zona="avisos">${avisosGenerales(f, 5)}</div>`;
  }

  // ---------- Paso 6 · Documentos y exportar ----------
  function paso6(f) {
    if (!f.pasos.length) return sinPasos(f);
    const err = L.errores(f).length;
    return `
      ${idea("Descarga el flujograma para el documento del proceso, para el AMFE o para retocarlo en <b>draw.io</b>, la herramienta del curso.")}
      ${err ? `<div class="warn">⚠ El flujograma tiene ${plural(err, "error", "errores")} del validador. Puedes descargarlo igualmente, pero revísalo antes (paso 3).</div>` : ""}
      <div class="export-grid">
        <div class="card export-card"><h3 class="sub-h">🖼 Imagen</h3><p class="field-sub">El dibujo con su título, para pegarlo en un documento o una presentación. PNG para cualquier programa; SVG se amplía sin perder calidad.</p>
          <div class="toolbar"><button class="btn btn--primary" data-act="ex-png">⬇ PNG</button><button class="btn" data-act="ex-svg">⬇ SVG</button></div></div>
        <div class="card export-card"><h3 class="sub-h">📄 PDF</h3><p class="field-sub">Ficha del proceso, el dibujo, la tabla de pasos, los puntos críticos por subproceso y la leyenda. Primero se ve y después se guarda o se imprime.</p>
          <div class="toolbar"><button class="btn btn--primary" data-act="informe">Ver y guardar el PDF</button></div></div>
        <div class="card export-card"><h3 class="sub-h">✎ draw.io (diagrams.net)</h3><p class="field-sub">El dibujo editable, con los mismos estilos que las plantillas del curso: calles, flechas unidas a sus símbolos, Sí y No, subprocesos y avisos de los puntos críticos. Ábrelo en <b>app.diagrams.net</b> (Archivo → Abrir desde → Dispositivo) o en la app de escritorio de draw.io.</p>
          <div class="toolbar"><button class="btn btn--primary" data-act="ex-drawio">⬇ Archivo .drawio</button></div>
          <p class="field-sub">Lo que retoques en draw.io no vuelve a esta app: para seguir editando aquí, guarda la copia de seguridad.</p></div>
        <div class="card export-card"><h3 class="sub-h">📝 Word</h3><p class="field-sub">El documento del proceso, editable: control del documento, descripción, actores, subprocesos, el flujograma, la leyenda, los pasos y los puntos críticos.</p>
          <div class="toolbar"><button class="btn btn--primary" data-act="ex-word">⬇ Word</button></div></div>
        <div class="card export-card"><h3 class="sub-h">📊 Excel</h3><p class="field-sub">Pasos, puntos críticos, subprocesos y actores. Las columnas «Subproceso» y «Error o punto crítico» se pueden copiar y pegar en el paso 4 de AMFE.</p>
          <div class="toolbar"><button class="btn btn--primary" data-act="ex-excel">⬇ Excel</button></div></div>
      </div>
      <div class="toolbar no-print"><button class="btn" data-act="hoja">🖨 Hoja en blanco para dibujar en papel</button></div>
      <h2 class="sec-t">Control del documento</h2>
      ${controlHtml(f)}
      <h2 class="sec-t">Ediciones</h2>
      ${edicionesHtml(f)}
      <h2 class="sec-t">Para otras apps</h2>
      ${practica("Las apps <b>AMFE</b> y <b>Mapa de Riesgos</b> podrán traer este flujograma (sus subprocesos, sus pasos y sus puntos críticos) con un botón «Traer de Flujograma», si las usas en este mismo navegador. Desde otro dispositivo, con la copia de seguridad.")}
      <div class="toolbar no-print"><button class="btn" data-act="copia">⬇ Copia de seguridad</button></div>`;
  }

  // Ediciones (mejora G): revisión del proceso actual o proceso propuesto tras las mejoras
  function edicionesHtml(f) {
    const ant = anteriorDe(f), cmp = ant ? L.compararEdiciones(ant, f) : null, lst = l => l.map(p => `nº ${p.num} «${esc(L.corto(p.texto, 40))}»`).join(", ");
    return `<div class="card">
      <p class="field-sub">Edición <b>${esc(f.edicion || "00")}</b> · ${f.tipoEdicion === "propuesto" ? "<b>proceso propuesto</b> (cómo quedará tras las mejoras)" : "proceso actual"}${ant ? ` · viene de la edición ${esc(ant.edicion)} (<a href="#/flujo/${ant.id}/4">abrirla</a>)` : ""}.</p>
      ${cmp ? `<div class="cmp-ed"><b>Cambios respecto a la edición ${esc(ant.edicion)}</b>
        <ul><li>Pasos: ${cmp.pasos[0]} → ${cmp.pasos[1]} · traspasos entre calles: ${cmp.traspasos[0]} → ${cmp.traspasos[1]} · decisiones: ${cmp.decisiones[0]} → ${cmp.decisiones[1]} · puntos críticos: ${cmp.puntos[0]} → ${cmp.puntos[1]}</li>
        ${cmp.nuevos.length ? `<li><span class="cmp-nuevo">Nuevos</span> ${lst(cmp.nuevos)}</li>` : ""}${cmp.quitados.length ? `<li><span class="cmp-quitado">Quitados</span> ${lst(cmp.quitados)}</li>` : ""}
        ${cmp.cambiados.map(c => `<li><span class="cmp-cambio">Cambia</span> nº ${c.paso.num}: ${esc(c.cambios.join("; "))}</li>`).join("")}
        ${!cmp.nuevos.length && !cmp.quitados.length && !cmp.cambiados.length ? "<li>Aún no hay cambios en los pasos.</li>" : ""}</ul>
        <p class="field-sub">En el dibujo (paso 4), «Cambios» marca en verde los pasos nuevos y en ámbar los cambiados.</p></div>` : ""}
      <p class="field-sub">Crea una edición nueva para revisar el proceso (tras un cambio o un incidente) o para dibujar el proceso propuesto tras las acciones de mejora. Esta edición se queda como está, para comparar.</p>
      <div class="toolbar no-print"><button class="btn" data-act="ed-nueva" data-v="actual">Nueva edición: revisión</button><button class="btn btn--primary" data-act="ed-nueva" data-v="propuesto">Nueva edición: proceso propuesto</button></div></div>`;
  }

  // Control del documento (como en el Documento Final): elaborado, revisado, aprobado e histórico de revisiones
  function controlHtml(f) {
    const C = f.control, grupo = (k, t) => `<div class="ctl-grupo"><b>${t}</b>${C[k].map((x, i) => `<div class="ctl-fila"><div class="input-wrap"><input class="txt-in" data-cp="${k}" data-i="${i}" data-f="nombre" value="${esc(x.nombre)}" placeholder="Nombre (opcional)" aria-label="${t}: nombre" /></div><div class="input-wrap"><input class="txt-in" data-cp="${k}" data-i="${i}" data-f="cargo" value="${esc(x.cargo)}" placeholder="Cargo" aria-label="${t}: cargo" /></div><button type="button" class="icon-mini no-print" data-act="cp-del" data-k="${k}" data-i="${i}" aria-label="Quitar">✕</button></div>`).join("")}<button type="button" class="link-btn no-print" data-act="cp-add" data-k="${k}">+ Añadir</button></div>`;
    return `<div class="card">${grupo("elaborado", "Elaborado por")}${grupo("revisado", "Revisado por")}${grupo("aprobado", "Aprobado por")}
      <div class="ctl-grupo"><b>Histórico de revisiones</b>${C.historial.map((h, i) => `<div class="ctl-fila ctl-fila--h"><div class="input-wrap"><input class="txt-in" data-ch="${i}" data-f="edicion" value="${esc(h.edicion)}" aria-label="Edición" /></div><div class="input-wrap"><input class="txt-in" type="date" data-ch="${i}" data-f="fecha" value="${esc(h.fecha)}" aria-label="Fecha" /></div><div class="input-wrap"><input class="txt-in" data-ch="${i}" data-f="cambio" value="${esc(h.cambio)}" placeholder="Qué cambia" aria-label="Cambio" /></div><button type="button" class="icon-mini no-print" data-act="ch-del" data-i="${i}" aria-label="Quitar">✕</button></div>`).join("")}<button type="button" class="link-btn no-print" data-act="ch-add">+ Añadir revisión</button></div>
      <p class="field-sub">Sale al principio del documento de Word. Basta con los cargos; los nombres son opcionales.</p></div>`;
  }

  const RENDER = { 1: paso1, 2: paso2, 3: paso3, 4: paso4, 5: paso5, 6: paso6 };

  // Refresca lo que depende de lo escrito sin repintar los campos (no se pierde el foco)
  let tLienzo = null;
  function refrescar(idPaso) {
    const f = actual; if (!f) return;
    const n = pasoActual;
    const Z = { pasos: () => pasosInner(f, n), avisos: () => avisosGenerales(f, n), avisos3: () => validadorHtml(f), nact: () => String(f.actores.length), nsub: () => String(f.subprocesos.length), validado: () => validadoHtml(f),
      nprop: () => String(L.propuestasPuntos(f).length), npc: () => String(f.puntos.length) };
    $$("[data-zona]").forEach(el => { const fn = Z[el.dataset.zona]; if (fn) el.innerHTML = fn(); });
    $$("[data-zav]").forEach(el => { el.innerHTML = avisosPaso(f, el.dataset.zav); });
    $$("[data-zpc]").forEach(el => { el.innerHTML = avisosPunto(f, el.dataset.zpc); });
    $$(".paso-card").forEach(el => { const p = L.pasoDe(f, el.dataset.pid), t = $(".rg-toggle", el); if (p && t) t.innerHTML = pasoCabInner(f, p); });
    if (n === 4 || n === 5) { clearTimeout(tLienzo); tLienzo = setTimeout(() => { const z = $("[data-zona='lienzo']"); if (z) { z.innerHTML = svgActual(f); aplicarZoom(); } }, 150); }
  }
  function repintar() {
    const y = window.scrollY, l = $("#lienzo"), sx = l ? l.scrollLeft : 0, sy = l ? l.scrollTop : 0;
    renderFlujo(actual, pasoActual); window.scrollTo(0, y);
    const l2 = $("#lienzo"); if (l2) { l2.scrollLeft = sx; l2.scrollTop = sy; }
  }

  // ---------- Aprende ----------
  function renderAprende(n) {
    const T = C.TEMAS, t = T.find(x => x.n === n);
    if (!t) {
      view.innerHTML = `
        <h1 class="page-title">Aprende</h1>
        <p class="page-lead">${T.length} temas, explicados fácil, para tener a mano mientras haces tu flujograma.</p>
        <div class="temas">${T.map(x => `<a class="tema-card pdca--${x.c}" href="#/aprende/${x.n}"><span class="tema-n">${x.n}</span><span><b>${x.titulo}</b><span>${x.sub}</span></span></a>`).join("")}</div>
        <div class="toolbar"><a class="btn btn--primary" href="#/prueba">✓ Ponte a prueba</a></div>`;
      return;
    }
    const prev = T.find(x => x.n === n - 1), next = T.find(x => x.n === n + 1);
    view.innerHTML = `
      <div class="wiz-top no-print">${volver("#/aprende", "Aprende")}<div class="tema-pills">${T.map(x => `<a href="#/aprende/${x.n}" class="pdca--${x.c}${x.n === n ? " actual" : ""}">${x.n}</a>`).join("")}</div></div>
      <div class="wiz-titulo"><span class="wiz-paso">Tema ${n} de ${T.length}</span><h1 class="page-title">${t.titulo}</h1><p class="page-lead">${t.sub}</p></div>
      <div class="card minuto pdca--${t.c}"><h2 class="sub-h">En un minuto</h2><ul>${t.minuto.map(x => `<li>${x}</li>`).join("")}</ul></div>
      ${t.secciones.map((s, i) => `<details class="facil"${i === 0 ? " open" : ""}><summary>${s.t}</summary><div class="facil-body">${s.h}</div></details>`).join("")}
      ${box("ejemplo", "Minicaso", t.minicaso)}
      <div class="toolbar"><a class="btn" href="#/prueba">✓ Ponte a prueba</a><a class="btn btn--primary" href="${t.practica.href}">${t.practica.texto} →</a></div>
      <div class="wiz-nav no-print">${prev ? `<a class="btn" href="#/aprende/${prev.n}">← ${prev.titulo}</a>` : "<span></span>"}${next ? `<a class="btn" href="#/aprende/${next.n}">${next.titulo} →</a>` : "<span></span>"}</div>`;
    $$("[data-leyenda]", view).forEach(el => { el.className = "leyenda-wrap"; el.innerHTML = D.leyenda(L.ORDEN_TIPOS.map(x => [x, L.TIPOS[x].corto])); });
  }

  // ---------- Ejemplos ----------
  function renderEjemplos() {
    view.innerHTML = `
      <h1 class="page-title">Ejemplos</h1>
      <p class="page-lead">Para ver cómo queda antes de hacerlo tú. Están aparte: puedes tocarlos, pero <b>no se guardan ni se mezclan con tus datos</b>. Si te sirve de punto de partida, pulsa «Copiar a mis datos».</p>
      <h2 class="sec-t">Ejemplo completo: atención en Urgencias</h2>
      <div class="ej-grid"><a class="ej-card ej-card--grande" href="${C.EJEMPLOS.urgencias.href}"><b>${esc(C.EJEMPLOS.urgencias.t)}</b><span>${esc(C.EJEMPLOS.urgencias.s)}</span></a></div>
      <h2 class="sec-t">Procesos del ejercicio 5</h2>
      <div class="ej-grid">${C.EJEMPLOS.fichas.map(x => `<a class="ej-card" href="${x.href}"><b>${esc(x.t)}</b><span>${esc(x.s)}</span></a>`).join("")}</div>
      <h2 class="sec-t">Minicasos con errores</h2>
      <p class="field-sub">Flujogramas cortos e inventados con errores a propósito. Ábrelos, mira qué marca el validador en rojo y corrígelos.</p>
      <div class="ej-grid ej-grid--mini">${C.EJEMPLOS.minicasos.map(x => `<a class="ej-card" href="${x.href}"><b>${esc(x.t)}</b><span>${esc(x.s)}</span></a>`).join("")}</div>
      ${practica("Los ejemplos reproducen las soluciones del curso. Lo que se ha añadido para que el dibujo no tenga callejones sin salida se explica en la nota de cada uno (paso 1).")}`;
  }

  // ---------- Ponte a prueba ----------
  const respuestas = {}, respSimb = {}, respErr = {}, ordenes = C.EJERCICIOS.ordenar.map(() => ({ sel: [], hecho: false })), puntosEj = { sel: new Set(), ver: false };
  let temaPrueba = "";
  // Orden de las opciones barajado pero estable (para que la correcta no esté siempre en el mismo sitio)
  const barajar = (n, semilla) => { const a = Array.from({ length: n }, (_, i) => i); let s = semilla * 9301 + 49297; for (let i = n - 1; i > 0; i--) { s = (s * 9301 + 49297) % 233280; const j = Math.floor(s / 233280 * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pillsPrueba = act => `<div class="tema-pills prueba-pills no-print"><a href="#/prueba" class="pdca--P${!act ? " actual" : ""}" title="Todas las preguntas">T</a>${Object.keys(C.TEMAS_TEST).map((k, i) => `<a href="#/prueba/${k}" class="pdca--P${act === k ? " actual" : ""}" title="${esc(C.TEMAS_TEST[k].nom)}">${i + 1}</a>`).join("")}<a href="#/prueba/practica" class="pdca--H${act === "practica" ? " actual" : ""}" title="Ejercicios prácticos">✎</a></div>`;
  function renderPrueba(tema) {
    temaPrueba = C.TEMAS_TEST[tema] ? tema : tema === "practica" ? "practica" : "";
    if (temaPrueba === "practica") { renderPractica(); return; }
    const Q = C.TEST.map((q, i) => Object.assign({ i }, q)).filter(q => !temaPrueba || q.t === temaPrueba);
    const hechas = Q.filter(q => q.i in respuestas), bien = hechas.filter(q => respuestas[q.i] === q.ok).length, pc = hechas.length ? bien / hechas.length : 0;
    view.innerHTML = `
      <h1 class="page-title">Ponte a prueba</h1>
      <p class="page-lead">${C.TEST.length} preguntas: las del test del curso sobre procesos y flujogramas, y otras sobre cómo hacerlos${temaPrueba ? ` (aquí, «${esc(C.TEMAS_TEST[temaPrueba].nom)}»)` : ""}. Toca la respuesta y lee la explicación. En ✎, cuatro ejercicios prácticos.</p>
      ${pillsPrueba(temaPrueba)}
      <div class="marcador">${hechas.length ? `<span><b>${bien}</b> aciertos de ${hechas.length} respondidas (de ${Q.length})</span>${hechas.length === Q.length ? `<span class="sem-b sem-b--${pc >= 0.8 ? "verde" : pc >= 0.6 ? "ambar" : "rojo"}">${pc >= 0.8 ? "¡Muy bien!" : pc >= 0.6 ? "Bien: repasa los fallos" : "Repasa «Aprende»"}</span>` : ""}` : `<span class="field-sub">Aciertos: 0 de ${Q.length}</span>`}</div>
      <div class="card">${Q.map(q => { const ord = barajar(q.o.length, q.i + 3), r = respuestas[q.i]; return `<div class="quiz-q">
        <p><span class="badge">${esc(C.TEMAS_TEST[q.t].nom)}</span> <b>${esc(q.q)}</b></p>
        ${ord.map(j => `<button class="quiz-o${r != null ? (j === q.ok ? " quiz-o--ok" : j === r ? " quiz-o--mal" : "") : ""}" data-act="quiz" data-q="${q.i}" data-o="${j}">${esc(q.o[j])}</button>`).join("")}
        ${r != null ? `<p class="quiz-fb">${r === q.ok ? "<b>¡Correcto!</b> " : "<b>No.</b> "}${esc(q.e)} <a href="#/aprende/${q.aprende}">Repasar en «Aprende»</a></p>` : ""}
      </div>`; }).join("")}</div>
      <div class="toolbar no-print"><button class="btn" data-act="quiz-reset">Empezar de nuevo</button><a class="btn btn--primary" href="#/prueba/practica">Ejercicios prácticos →</a></div>`;
  }
  const repPractica = () => { const y = window.scrollY; renderPractica(); window.scrollTo(0, y); };
  function svgEjemplo(id, opc = {}) {
    const f = ejemplos().flujos.find(x => x.id === id); if (!f) return "";
    const g = Object.assign(clon(f), opc.sinPuntos ? { puntos: [] } : {});
    return D.svg(L.dibujar(g, { marco: false }), Object.assign({ numeros: true }, opc));
  }
  function renderPractica() {
    const E = C.EJERCICIOS, TS = L.ORDEN_TIPOS;
    const nS = Object.keys(respSimb).length, bS = E.simbolos.filter((x, i) => respSimb[i] === x.tipo).length;
    const fP = ejemplos().flujos.find(x => x.id === E.puntos.flujo), suyos = new Set(fP.puntos.map(x => x.pasoId));
    const coinc = [...puntosEj.sel].filter(x => suyos.has(x)).length;
    view.innerHTML = `
      <h1 class="page-title">Ponte a prueba · ejercicios</h1>
      <p class="page-lead">Cuatro ejercicios con los procesos del curso.</p>
      ${pillsPrueba("practica")}
      <h2 class="sec-t">1. ¿Qué símbolo es?</h2>
      <p class="field-sub">¿Con qué símbolo dibujarías cada paso? ${nS ? `<b>${bS} de ${nS}</b> bien.` : ""}</p>
      <div class="card">${E.simbolos.map((x, i) => { const r = respSimb[i]; return `<div class="quiz-q"><p><b>«${esc(x.texto)}»</b></p>
        <div class="tipos" role="group">${TS.map(tp => `<button type="button" class="tipo-btn${r ? (tp === x.tipo ? " fec-ok" : tp === r ? " fec-mal" : "") : ""}" data-act="simb" data-i="${i}" data-v="${tp}">${tipoChip(tp)}<span>${L.TIPOS[tp].corto}</span></button>`).join("")}</div>
        ${r ? `<p class="quiz-fb">${r === x.tipo ? "<b>¡Correcto!</b> " : "<b>No.</b> "}Es ${esc(L.TIPOS[x.tipo].nom.toLowerCase())} (${esc(L.TIPOS[x.tipo].forma.toLowerCase())}): ${esc(L.TIPOS[x.tipo].que)}</p>` : ""}</div>`; }).join("")}</div>
      <h2 class="sec-t">2. Ordena los pasos</h2>
      <p class="field-sub">Toca los pasos en el orden en que ocurren.</p>
      ${E.ordenar.map((o, k) => { const st = ordenes[k], mez = barajar(o.pasos.length, k + 7), bien = st.sel.every((x, i) => x === i); return `<div class="card"><h3 class="sub-h">${esc(o.t)}</h3>
        ${st.sel.length ? `<ol class="ord-elegidos">${st.sel.map((x, i) => `<li class="${st.hecho ? (x === i ? "ord-ok" : "ord-mal") : ""}">${esc(o.pasos[x])}</li>`).join("")}</ol>` : ""}
        <div class="ord-op">${mez.filter(j => !st.sel.includes(j)).map(j => `<button type="button" class="chip" data-act="ord" data-k="${k}" data-i="${j}">${esc(o.pasos[j])}</button>`).join("")}</div>
        ${st.hecho ? `<p class="quiz-fb">${bien ? "<b>¡Correcto!</b> Ese es el orden del curso." : "<b>No del todo.</b> En verde, los que están en su sitio. El orden del curso: " + esc(o.pasos.join(" → ")) + "."}</p>` : ""}
        ${st.sel.length ? `<button type="button" class="link-btn" data-act="ord-reset" data-k="${k}">Empezar de nuevo</button>` : ""}</div>`; }).join("")}
      <h2 class="sec-t">3. Encuentra el error</h2>
      <p class="field-sub">Cada uno de estos flujogramas tiene algún error. ¿Cuál?</p>
      ${C.ERRORES.map((x, i) => { const r = respErr[i]; return `<div class="card err-ej"><h3 class="sub-h">${esc(x.t)}</h3>
        <div class="lienzo lienzo--mini"><div class="lienzo-in">${svgEjemplo(x.flujo)}</div></div>
        ${x.o.map((op, j) => `<button class="quiz-o${r != null ? (j === x.ok ? " quiz-o--ok" : j === r ? " quiz-o--mal" : "") : ""}" data-act="err" data-i="${i}" data-o="${j}">${esc(op)}</button>`).join("")}
        ${r != null ? `<p class="quiz-fb">${r === x.ok ? "<b>¡Correcto!</b> " : "<b>No.</b> "}${esc(x.e)} <a href="#/flujo/${x.flujo}/3">Corregirlo</a></p>` : ""}</div>`; }).join("")}
      <h2 class="sec-t">4. Señala los puntos críticos</h2>
      <p class="field-sub">Toca en el dibujo de la toma de constantes los pasos donde crees que puede fallar el proceso, y compara con los del ejemplo.</p>
      <div class="card pc-ej">
        <div class="lienzo lienzo--mini"><div class="lienzo-in">${puntosEj.ver ? svgEjemplo(E.puntos.flujo, { elegidos: puntosEj.sel }) : svgEjemplo(E.puntos.flujo, { sinPuntos: true, elegidos: puntosEj.sel })}</div></div>
        ${puntosEj.ver ? `<p class="quiz-fb">Has marcado ${plural(puntosEj.sel.size, "paso", "pasos")}; ${plural(coinc, "coincide", "coinciden")} con los ${fP.puntos.length} del ejemplo (los avisos rojos):</p><ul>${fP.puntos.map(x => `<li><b>${esc(x.titulo)}</b> (paso ${L.pasoDe(fP, x.pasoId).num})</li>`).join("")}</ul><p class="field-sub">No hay una única respuesta correcta: lo importante es saber justificar por qué un paso es crítico. ¿Has pensado en los traspasos entre calles?</p>` : `<div class="toolbar"><button class="btn btn--primary" data-act="pc-comparar"${puntosEj.sel.size ? "" : " disabled"}>Comparar con el ejemplo</button><span class="field-sub">${plural(puntosEj.sel.size, "paso marcado", "pasos marcados")}</span></div>`}
      </div>
      <div class="toolbar no-print"><button class="btn" data-act="practica-reset">Empezar de nuevo</button><a class="btn" href="#/prueba">← Preguntas</a></div>`;
  }

  // ---------- Glosario ----------
  function renderGlosario() {
    view.innerHTML = `<h1 class="page-title">Glosario</h1><p class="page-lead">${C.GLOSARIO.length} términos en lenguaje llano.</p>
      <div class="input-wrap glos-buscar"><input id="glos-q" type="search" placeholder="Buscar término…" autocomplete="off" /></div>
      <dl class="glos-lista" id="glos-lista"></dl>`;
    const pinta = q => {
      const t = L.sinTildes(q);
      const l = C.GLOSARIO.filter(([a, b]) => !t || L.sinTildes(a + " " + b).includes(t)).sort((x, y) => x[0].localeCompare(y[0], "es"));
      $("#glos-lista").innerHTML = l.length ? l.map(([a, b]) => `<div class="glos-item"><dt>${esc(a)}</dt><dd>${esc(b)}</dd></div>`).join("") : `<p class="placeholder-box">Sin resultados.</p>`;
    };
    pinta(""); $("#glos-q").addEventListener("input", e => pinta(e.target.value));
  }

  // ---------- Avisos breves ----------
  function esIOS() { return /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1); }
  function toast(msg, ms) {
    let t = $("#toast");
    if (!msg) { if (t) t.hidden = true; return; }
    if (!t) { t = document.createElement("div"); t.id = "toast"; t.className = "toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
    t.textContent = msg; t.hidden = false; clearTimeout(toast.h);
    if (ms) toast.h = setTimeout(() => { t.hidden = true; }, ms);
  }
  function descargar(blob, nombre) {
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = nombre;
    document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 200);
  }
  const rutaActual = () => location.hash.split("?")[0];

  // ---------- Exportar: imagen, draw.io y vista para imprimir / PDF ----------
  const fechaArchivo = () => new Date().toLocaleDateString("es-ES").replace(/\//g, "-");
  function nombreArchivo(ext, f = actual) {
    const base = "Flujograma " + (f ? (nombreFlujo(f) || "").slice(0, 60) : "");
    return `${base.replace(/[\\/:*?"<>|%]/g, "").trim()} ${fechaArchivo()}.${ext}`;
  }
  function compartirOBajar(blob, nombre, msg) {
    const file = new File([blob], nombre, { type: blob.type });
    if (esIOS() && navigator.canShare && navigator.canShare({ files: [file] })) navigator.share({ files: [file], title: nombre }).catch(() => {});
    else { descargar(blob, nombre); toast(msg, 3500); }
  }
  const tituloDibujo = f => "Proceso " + (f.proceso || f.titulo || "sin nombre");
  function marcarExportado(f) { if (f.exportado !== hoyIso()) { f.exportado = hoyIso(); tocado(f); refrescar(); } }
  function svgExport(f) { return D.svg(L.dibujar(f), { numeros: f.vista.numeros, cabecera: tituloDibujo(f), titulo: tituloDibujo(f) }); }
  // SVG → PNG a doble resolución, sin pasar del tamaño máximo de un lienzo en el móvil
  function pngDe(s, maxPx = 16e6) {
    return new Promise((ok, mal) => {
      const im = new Image(), w = Number(/width="(\d+)/.exec(s)[1]), h = Number(/height="(\d+)/.exec(s)[1]), k = Math.min(2, Math.sqrt(maxPx / (w * h)));
      im.onload = () => {
        const cv = document.createElement("canvas"); cv.width = Math.round(w * k); cv.height = Math.round(h * k);
        const ctx = cv.getContext("2d"); ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, cv.width, cv.height); ctx.drawImage(im, 0, 0, cv.width, cv.height);
        cv.toBlob(b => b ? ok({ blob: b, w, h }) : mal(new Error("png")), "image/png");
      };
      im.onerror = () => mal(new Error("svg"));
      im.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(s);
    });
  }
  function exportarImagen(f, tipo) {
    const s = svgExport(f);
    if (tipo === "svg") { compartirOBajar(new Blob([s], { type: "image/svg+xml" }), nombreArchivo("svg", f), "Imagen SVG descargada."); marcarExportado(f); return; }
    pngDe(s).then(r => { compartirOBajar(r.blob, nombreArchivo("png", f), "Imagen PNG descargada."); marcarExportado(f); }).catch(() => toast("No se ha podido crear la imagen.", 4000));
  }
  async function exportarWord(f) {
    toast("Preparando el Word…");
    try {
      const fecha = new Date().toLocaleDateString("es-ES");
      const r = await pngDe(D.svg(L.dibujar(f), { numeros: f.vista.numeros }), 12e6);
      const doc = L.documentoProceso(f, fecha, { png: new Uint8Array(await r.blob.arrayBuffer()), w: r.w, h: r.h, maxAlto: r.w > r.h * 1.15 ? 15 : 22 });
      const bytes = window.Docx.construirDocx(Object.assign({ pie: doc.titulo + " · Generado con la app Flujograma" }, doc));
      compartirOBajar(new Blob([bytes], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }), nombreArchivo("docx", f), "Word descargado. Ábrelo con Word, Pages o LibreOffice y ajústalo a tu gusto.");
      marcarExportado(f);
    } catch (e) { toast("No se ha podido crear el Word.", 4000); }
  }
  function exportarExcel(f) {
    try {
      const bytes = window.Xlsx.construirLibroXlsx(L.hojasExcel(f, new Date().toLocaleDateString("es-ES")));
      compartirOBajar(new Blob([bytes], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), nombreArchivo("xlsx", f), "Excel descargado.");
      marcarExportado(f);
    } catch (e) { toast("No se ha podido crear el Excel.", 4000); }
  }
  function exportarDrawio(f) {
    try {
      const x = D.drawio(L.dibujar(f), { titulo: tituloDibujo(f), numeros: f.vista.numeros, id: f.id });
      compartirOBajar(new Blob([x], { type: "application/xml" }), nombreArchivo("drawio", f), "Archivo de draw.io descargado. Ábrelo en app.diagrams.net.");
      marcarExportado(f);
    } catch (e) { toast("No se ha podido crear el archivo de draw.io.", 4000); }
  }
  // Vista para imprimir / PDF: ficha, dibujo, pasos, puntos críticos y leyenda
  let porSubproceso = false;
  function informeCab(titulo, sub) {
    return `<header class="print-head print-only"><h1>${esc(titulo)}</h1><p>${esc(sub ? sub + " · " : "")}Flujograma · Calidad y seguridad del paciente · ${new Date().toLocaleDateString("es-ES")}</p></header>`;
  }
  function informePie() {
    return `<footer class="print-foot print-only">
      <span class="autor-titulo">Aplicación desarrollada por</span>
      <span class="autor"><b>Carlos J. Galán Doval</b> · Médico de Familia · Técnico en Calidad y Seguridad del Paciente</span>
      <span class="autor"><b>Rafael J. Romero de Castilla Gil</b> · Médico de Familia · Responsable del Área de Calidad y Seguridad del Paciente</span>
      <span class="autor-area">Área de Gestión Sanitaria Sur de Córdoba · Andalucía</span>
      <span class="autor-uso">De libre uso con fines docentes y divulgativos. No sustituye el criterio profesional.</span>
      <span class="footer-version">Flujograma · versión ${APP_VERSION}</span>
    </footer>`;
  }
  // Un subproceso solo, para dibujarlo en su propia página (las flechas que salen de él se quitan)
  function soloSub(f, s) {
    const ids = new Set(f.pasos.filter(p => p.subprocesoId === s.id).map(p => p.id));
    return Object.assign({}, f, { pasos: f.pasos.filter(p => ids.has(p.id)).map(p => Object.assign({}, p, { siguientes: p.siguientes.filter(x => ids.has(x.a)), con: ids.has(p.con) ? p.con : "" })), puntos: f.puntos.filter(x => ids.has(x.pasoId)) });
  }
  function renderInforme(f) {
    const fila = (k, v) => lleno(v) ? `<tr><th>${k}</th><td>${esc(v)}</td></tr>` : "";
    const d = L.dibujar(f), r = L.resumen(f), apaisado = d.ancho > d.alto * 1.1;
    let est = $("#estilo-pagina"); if (!est) { est = document.createElement("style"); est.id = "estilo-pagina"; document.head.appendChild(est); }
    est.textContent = `@page { size: A4 ${apaisado ? "landscape" : "portrait"}; margin: 12mm; }`;
    const subsConPasos = f.subprocesos.filter(s => f.pasos.some(p => p.subprocesoId === s.id));
    const salidas = p => { const S = p.siguientes.map(x => { const q = L.pasoDe(f, x.a); return q ? (x.etiqueta === "si" ? "Sí → " : x.etiqueta === "no" ? "No → " : "") + q.num : ""; }).filter(Boolean); return S.join(" · ") || (p.tipo === "terminal" ? "Fin" : "—"); };
    const G = L.puntosPorSub(f);
    view.innerHTML = `
      <div class="informe-bar informe-only"><button class="btn" data-act="volver">← Volver</button><span class="informe-acc">${subsConPasos.length > 1 ? `<button class="btn${porSubproceso ? " btn--on" : ""}" data-act="inf-sub">${porSubproceso ? "✓ " : ""}Un subproceso por página</button>` : ""}<button class="btn btn--primary" data-act="imprimir">Guardar / imprimir</button></span></div>
      ${informeCab("Flujograma · " + (f.proceso || nombreFlujo(f) || "Proceso sin nombre"), f.unidad)}
      <div class="ficha">
        <div class="ficha-cab"><span class="wiz-paso">Flujograma del proceso</span><h2 class="ficha-nombre">${esc(f.proceso || nombreFlujo(f) || "Proceso sin nombre")}</h2></div>
        <table class="ficha-t">${fila("Unidad o servicio", f.unidad)}${fila("Objetivo", f.objetivo)}${fila("Empieza", f.inicio)}${fila("Termina", f.fin)}${fila("Qué queda dentro", f.incluye)}${fila("Qué queda fuera", f.excluye)}${fila("Responsable", f.responsable)}${fila("Fecha", f.fecha)}${fila("Validado con el equipo", fmtFecha(f.validado))}
          <tr><th>Resumen</th><td>${plural(r.pasos, "paso", "pasos")} · ${plural(r.actores, "actor", "actores")} · ${plural(r.decisiones, "decisión", "decisiones")} · ${plural(r.traspasos, "traspaso", "traspasos")} entre calles · ${plural(r.puntos, "punto crítico", "puntos críticos")}</td></tr></table>
      </div>
      <h2 class="sec-t">Diagrama</h2>
      <div class="informe-graf informe-dib">${D.svg(d, { numeros: f.vista.numeros, cabecera: tituloDibujo(f), titulo: tituloDibujo(f) })}</div>
      <div class="leyenda-wrap">${D.leyenda(L.ORDEN_TIPOS.map(t => [t, L.TIPOS[t].corto]))}</div>
      ${porSubproceso ? subsConPasos.map((s, i) => `<div class="doc-salto"></div><h2 class="sec-t">Subproceso ${f.subprocesos.indexOf(s) + 1}: ${esc(s.nombre)}</h2><p class="field-sub">${esc([s.inicio && "Empieza: " + s.inicio, s.fin && "Termina: " + s.fin].filter(Boolean).join(" · "))}</p><div class="informe-graf informe-dib">${D.svg(L.disponer(soloSub(f, s), { subprocesos: false }), { numeros: f.vista.numeros })}</div>`).join("") : ""}
      ${f.subprocesos.length ? `<h2 class="sec-t">Subprocesos</h2><div class="table-wrap"><table class="mini tabla-riesgos"><thead><tr><th>Nº</th><th>Subproceso</th><th>Descripción</th><th>Inicio</th><th>Fin</th><th>Roles</th></tr></thead><tbody>${f.subprocesos.map((s, i) => `<tr><td>${i + 1}</td><td>${subPunto(s)} <b>${esc(s.nombre)}</b></td><td>${esc(s.descripcion)}</td><td>${esc(s.inicio)}</td><td>${esc(s.fin)}</td><td>${esc(s.roles)}</td></tr>`).join("")}</tbody></table></div>` : ""}
      <h2 class="sec-t">Pasos</h2>
      <div class="table-wrap"><table class="mini tabla-riesgos"><thead><tr><th>Nº</th><th>Tipo</th><th>Paso</th><th>Quién</th>${f.subprocesos.length ? "<th>Subproceso</th>" : ""}<th>Sigue a</th></tr></thead><tbody>${f.pasos.map(p => { const a = L.actorDe(f, p), s = L.subDe(f, p); return `<tr><td>${p.num}</td><td>${tipoChip(p.tipo)} ${esc(L.TIPOS[p.tipo].corto)}</td><td><b>${esc(p.texto)}</b>${lleno(p.nota) ? `<br><span class="field-sub">${esc(p.nota)}</span>` : ""}</td><td>${esc(a ? a.nombre : "")}</td>${f.subprocesos.length ? `<td>${esc(s ? s.nombre : "")}</td>` : ""}<td>${esc(salidas(p))}</td></tr>`; }).join("")}</tbody></table></div>
      ${G.length ? `<h2 class="sec-t">Puntos críticos</h2><div class="table-wrap"><table class="mini tabla-riesgos"><thead><tr><th>Id</th><th>Subproceso</th><th>Paso</th><th>Error o punto crítico</th><th>Descripción del error o riesgo</th><th>Fallos AMFE</th></tr></thead><tbody>${G.map(g => g.puntos.map(x => { const p = L.pasoDe(f, x.pasoId); return `<tr><td>${x.num}</td><td>${esc(g.sub ? g.sub.nombre : "")}</td><td>${p ? p.num + ". " + esc(L.corto(p.texto, 40)) : ""}</td><td><b>${esc(x.titulo)}</b></td><td>${esc(x.descripcion)}</td><td>${esc(x.fallos.join(", "))}</td></tr>`; }).join("")).join("")}</tbody></table></div>` : ""}
      ${lleno(f.notas) ? `<p class="field-sub">${esc(f.notas)}</p>` : ""}
      ${informePie()}`;
    if (actual === f) marcarExportado(f);
  }
  // Hoja en blanco para las sesiones en papel (mejora J)
  function renderHoja(f) {
    let est = $("#estilo-pagina"); if (!est) { est = document.createElement("style"); est.id = "estilo-pagina"; document.head.appendChild(est); }
    est.textContent = "@page { size: A4 landscape; margin: 12mm; }";
    const act = f.actores.filter(a => lleno(a.nombre)).map(a => a.nombre), nombres = act.length ? act : ["", "", "", ""];
    const vacias = (n, cols) => Array.from({ length: n }, () => `<tr>${cols.map(() => "<td>&nbsp;</td>").join("")}</tr>`).join("");
    view.innerHTML = `
      <div class="informe-bar informe-only"><button class="btn" data-act="volver">← Volver</button><span class="informe-acc"><button class="btn btn--primary" data-act="imprimir">Guardar / imprimir</button></span></div>
      ${informeCab("Hoja de trabajo · " + (f.proceso || nombreFlujo(f) || "Flujograma"), f.unidad)}
      <div class="hoja-cab"><p><b>Proceso:</b> ${esc(f.proceso || "______________________________")} &nbsp; <b>Empieza:</b> ${esc(f.inicio || "____________________")} &nbsp; <b>Termina:</b> ${esc(f.fin || "____________________")}</p></div>
      <h2 class="sec-t">Símbolos</h2>
      <div class="leyenda-wrap">${D.leyenda(L.ORDEN_TIPOS.map(t => [t, L.TIPOS[t].corto]))}</div>
      <p class="field-sub">Actividad con verbo («Extrae la muestra»). Decisión como pregunta, con salida Sí y No. Inicio y fin fuera de las calles.</p>
      <h2 class="sec-t">Flujograma</h2>
      <div class="informe-graf informe-dib">${D.callesEnBlanco(nombres)}</div>
      <div class="doc-salto"></div>
      <h2 class="sec-t">Pasos</h2>
      <div class="table-wrap"><table class="mini tabla-riesgos tabla-hoja"><thead><tr><th>Nº</th><th>Tipo</th><th>Qué se hace</th><th>Quién</th><th>Sigue a (Sí / No)</th></tr></thead><tbody>${vacias(14, [1, 2, 3, 4, 5])}</tbody></table></div>
      <h2 class="sec-t">Puntos críticos</h2>
      <div class="table-wrap"><table class="mini tabla-riesgos tabla-hoja"><thead><tr><th>Id</th><th>Subproceso</th><th>Paso</th><th>Error o punto crítico</th><th>Descripción del error o riesgo</th></tr></thead><tbody>${vacias(8, [1, 2, 3, 4, 5])}</tbody></table></div>
      ${informePie()}`;
  }
  // ---------- PDF en iOS (sin librerías; mismo método que AMFE y Auditorías) ----------
  // En iOS, window.print() no hace nada cuando la app está instalada en la pantalla de inicio.
  function pdfDesdeJPEGs(paginas, wPt, hPt) {
    const enc = new TextEncoder(), partes = [], offs = []; let pos = 0;
    const push = x => { const b = typeof x === "string" ? enc.encode(x) : x; partes.push(b); pos += b.length; };
    const obj = (n, cuerpo) => { offs[n] = pos; push(`${n} 0 obj\n`); cuerpo(); push("\nendobj\n"); };
    push("%PDF-1.4\n"); push(new Uint8Array([37, 226, 227, 207, 211, 10]));
    const n = paginas.length;
    obj(1, () => push("<< /Type /Catalog /Pages 2 0 R >>"));
    obj(2, () => push(`<< /Type /Pages /Kids [${paginas.map((_, i) => `${3 + i * 3} 0 R`).join(" ")}] /Count ${n} >>`));
    paginas.forEach((p, i) => {
      const pg = 3 + i * 3, cont = pg + 1, img = pg + 2, flujo = `q ${wPt} 0 0 ${hPt} 0 0 cm /Im${i} Do Q`;
      obj(pg, () => push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${wPt} ${hPt}] /Resources << /XObject << /Im${i} ${img} 0 R >> >> /Contents ${cont} 0 R >>`));
      obj(cont, () => { push(`<< /Length ${flujo.length} >>\nstream\n${flujo}\nendstream`); });
      obj(img, () => { push(`<< /Type /XObject /Subtype /Image /Width ${p.w} /Height ${p.h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${p.bytes.length} >>\nstream\n`); push(p.bytes); push("\nendstream"); });
    });
    const total = 3 + n * 3, xref = pos;
    let x = `xref\n0 ${total}\n0000000000 65535 f \n`;
    for (let k = 1; k < total; k++) x += String(offs[k]).padStart(10, "0") + " 00000 n \n";
    push(x + `trailer\n<< /Size ${total} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`);
    return new Blob(partes, { type: "application/pdf" });
  }
  async function generarPDF() {
    const ANCHO = 720, K = 2;
    const A4W = 595.28, A4H = 841.89, MARGEN_PT = 34;
    const PX = (A4W - 2 * MARGEN_PT) / ANCHO;
    const PW = A4W / PX, PH = A4H / PX, M = MARGEN_PT / PX, ALTO_UTIL = PH - 2 * M;
    const hoja = document.createElement("div");
    hoja.className = "view";
    hoja.style.cssText = `position:absolute;left:-20000px;top:0;width:${ANCHO}px;max-width:none;margin:0;padding:0;box-shadow:none;`;
    hoja.innerHTML = $("#view").innerHTML;
    $$(".informe-bar, [id]", hoja).forEach(el => { if (el.classList.contains("informe-bar")) el.remove(); else el.removeAttribute("id"); });
    $$("details", hoja).forEach(d => { d.open = true; });
    document.body.appendChild(hoja);
    try {
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
      const R0 = hoja.getBoundingClientRect();
      const ops = [], cortes = [0], bloques = [];
      const SIN_CORTE = ".print-head, .chart-card, tr, .formula, .box, .print-foot, h1, h2, h3, .ficha-cab, .leyenda";
      const rel = r => ({ x: r.left - R0.left, y: r.top - R0.top, w: r.width, h: r.height });
      const hayColor = c => !!c && c !== "transparent" && !/rgba\([^)]*,\s*0\)$/.test(c);
      const LADOS = ["Top", "Right", "Bottom", "Left"];
      const texto = (n, cs) => {
        const t = n.textContent, re = /\S+/g, rg = document.createRange(); let m;
        const font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
        while ((m = re.exec(t))) {
          rg.setStart(n, m.index); rg.setEnd(n, m.index + m[0].length);
          const rs = rg.getClientRects(); if (!rs.length) continue;
          ops.push({ t: "txt", s: cs.textTransform === "uppercase" ? m[0].toUpperCase() : m[0], r: rel(rs[0]), font, col: cs.color, ls: cs.letterSpacing });
        }
      };
      const recorre = el => {
        const cs = getComputedStyle(el);
        if (cs.display === "none" || cs.visibility === "hidden") return;
        const r = rel(el.getBoundingClientRect());
        if (r.h > 0) cortes.push(r.y + r.h);
        if (el.matches(SIN_CORTE)) bloques.push([r.y, r.y + r.h]);
        if (el instanceof SVGSVGElement) { ops.push({ t: "svg", el, r }); return; }
        const bordes = LADOS.map(l => [parseFloat(cs[`border${l}Width`]) || 0, cs[`border${l}Color`]]);
        if (hayColor(cs.backgroundColor) || bordes.some(b => b[0] > 0 && hayColor(b[1]))) ops.push({ t: "caja", r, bg: cs.backgroundColor, rad: parseFloat(cs.borderTopLeftRadius) || 0, bordes });
        if (el.tagName === "LI") {
          const ol = el.parentElement.tagName === "OL", idx = Array.prototype.indexOf.call(el.parentElement.children, el) + 1;
          ops.push({ t: "txt", s: ol ? idx + "." : "•", r: { x: r.x - (ol ? 20 : 14), y: r.y, w: 16, h: parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.4 }, font: `normal 700 ${cs.fontSize} ${cs.fontFamily}`, col: ol ? "#3730a3" : cs.color, ls: "normal" });
        }
        for (const n of el.childNodes) {
          if (n.nodeType === 1) recorre(n);
          else if (n.nodeType === 3 && n.textContent.trim()) texto(n, cs);
        }
      };
      recorre(hoja);
      for (const op of ops.filter(o => o.t === "svg")) {
        const cl = op.el.cloneNode(true), orig = [op.el, ...op.el.querySelectorAll("*")], copia = [cl, ...cl.querySelectorAll("*")];
        orig.forEach((o, i) => { const cs = getComputedStyle(o); copia[i].setAttribute("style", ["fill", "stroke", "stroke-width", "stroke-dasharray", "font-family", "font-size", "font-weight"].map(p => `${p}:${cs.getPropertyValue(p)}`).join(";")); });
        cl.setAttribute("xmlns", "http://www.w3.org/2000/svg"); cl.setAttribute("width", op.r.w); cl.setAttribute("height", op.r.h);
        op.img = await new Promise(res => { const im = new Image(); im.onload = () => res(im); im.onerror = () => res(null); im.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(new XMLSerializer().serializeToString(cl)); });
      }
      const alto = Math.ceil(R0.height);
      const parte = y => bloques.some(([a, b]) => a < y - 0.5 && y + 0.5 < b && b - a < ALTO_UTIL);
      const cands = [...new Set(cortes.map(c => Math.ceil(c)))].sort((a, b) => a - b);
      const pags = []; let y0 = 0;
      while (y0 < alto - 1) {
        const lim = y0 + ALTO_UTIL;
        if (lim >= alto) { pags.push([y0, alto]); break; }
        const y = cands.filter(c => c > y0 + 80 && c <= lim && !parte(c)).pop() || Math.floor(lim);
        pags.push([y0, y]); y0 = y;
      }
      const ponFuente = (ctx, f) => { ctx.font = "10px serif"; ctx.font = f; if (ctx.font === "10px serif") ctx.font = f.replace(/^(.*?\d+(\.\d+)?px).*$/, "$1 sans-serif"); };
      const caja = (ctx, op) => {
        const { x, y, w, h } = op.r, rad = Math.min(op.rad, w / 2, h / 2);
        const camino = () => { ctx.beginPath(); if (rad > 0 && ctx.roundRect) ctx.roundRect(x, y, w, h, rad); else ctx.rect(x, y, w, h); };
        if (hayColor(op.bg)) { ctx.fillStyle = op.bg; camino(); ctx.fill(); }
        const [t, d, b, l] = op.bordes;
        if (op.bordes.every(z => z[0] === t[0] && z[1] === t[1]) && t[0] > 0 && hayColor(t[1])) { ctx.strokeStyle = t[1]; ctx.lineWidth = t[0]; ctx.beginPath(); if (rad > 0 && ctx.roundRect) ctx.roundRect(x + t[0] / 2, y + t[0] / 2, w - t[0], h - t[0], Math.max(0, rad - t[0] / 2)); else ctx.rect(x + t[0] / 2, y + t[0] / 2, w - t[0], h - t[0]); ctx.stroke(); return; }
        const lado = (z, rx, ry, rw, rh) => { if (z[0] > 0 && hayColor(z[1])) { ctx.fillStyle = z[1]; ctx.fillRect(rx, ry, rw, rh); } };
        lado(t, x, y, w, t[0]); lado(b, x, y + h - b[0], w, b[0]); lado(l, x, y, l[0], h); lado(d, x + w - d[0], y, d[0], h);
      };
      const dibujaPaginas = conSVG => pags.map(([a, b]) => {
        const cv = document.createElement("canvas"); cv.width = Math.round(PW * K); cv.height = Math.round(PH * K);
        const ctx = cv.getContext("2d");
        ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, cv.width, cv.height);
        ctx.scale(K, K); ctx.translate(M, M - a);
        ctx.beginPath(); ctx.rect(-2, a, ANCHO + 4, b - a); ctx.clip();
        for (const op of ops) {
          if (op.r.y >= b || op.r.y + op.r.h <= a) continue;
          if (op.t === "caja") caja(ctx, op);
          else if (op.t === "svg") { if (conSVG && op.img) ctx.drawImage(op.img, op.r.x, op.r.y, op.r.w, op.r.h); }
          else {
            ponFuente(ctx, op.font); ctx.fillStyle = op.col; ctx.textBaseline = "alphabetic";
            if ("letterSpacing" in ctx) ctx.letterSpacing = op.ls && op.ls !== "normal" ? op.ls : "0px";
            const mt = ctx.measureText(op.s), asc = mt.fontBoundingBoxAscent || mt.actualBoundingBoxAscent || op.r.h * 0.8, desc = mt.fontBoundingBoxDescent || mt.actualBoundingBoxDescent || op.r.h * 0.2;
            ctx.fillText(op.s, op.r.x, op.r.y + (op.r.h - (asc + desc)) / 2 + asc);
          }
        }
        const url = cv.toDataURL("image/jpeg", 0.9), bin = atob(url.slice(url.indexOf(",") + 1)), bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        return { bytes, w: cv.width, h: cv.height };
      });
      let paginas;
      try { paginas = dibujaPaginas(true); } catch (e) { paginas = dibujaPaginas(false); }
      return pdfDesdeJPEGs(paginas, A4W, A4H);
    } finally { hoja.remove(); }
  }
  let pdfListo = null;
  function prepararPDF() {
    pdfListo = null; const r = rutaActual();
    setTimeout(() => { if (rutaActual() === r && document.body.classList.contains("ver-informe")) generarPDF().then(b => { pdfListo = { r, blob: b }; }).catch(() => {}); }, 300);
  }
  async function guardarPDF() {
    if (!document.body.classList.contains("ver-informe")) { irInforme(); toast("Preparando el PDF… pulsa de nuevo «Guardar / imprimir» en un momento.", 4000); return; }
    let blob = pdfListo && pdfListo.r === rutaActual() ? pdfListo.blob : null;
    if (!blob) { toast("Preparando el PDF…"); try { blob = await generarPDF(); pdfListo = { r: rutaActual(), blob }; } catch (e) { toast("No se ha podido crear el PDF.", 4000); return; } }
    const file = new File([blob], nombreArchivo("pdf"), { type: "application/pdf" });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ files: [file], title: file.name }); toast(""); }
      catch (e) { if (e && e.name === "AbortError") { toast(""); return; } toast("PDF listo: pulsa otra vez «Guardar / imprimir».", 4000); }
      return;
    }
    descargar(blob, file.name); toast("PDF descargado.", 3000);
  }
  function irInforme(doc) { location.hash = rutaActual() + "?informe=1" + (doc ? "&doc=" + doc : ""); }
  function imprimir() {
    if (esIOS()) { guardarPDF(); return; }
    if (!document.body.classList.contains("ver-informe")) { irInforme(); setTimeout(() => window.print(), 400); return; }
    window.print();
  }

  // ---------- Copia de seguridad e importar ----------
  async function copiaSeguridad() {
    const contenido = JSON.stringify({ app: "flujograma", v: L.VERSION_DATOS, exportado: hoy(), flujos: datosUsuario.flujos, intercambio: L.paqueteIntercambio(datosUsuario.flujos, APP_VERSION, hoy()) }, null, 1);
    const nombre = `Flujograma copia ${new Date().toISOString().slice(0, 10)}.json`;
    const blob = new Blob([contenido], { type: "application/json" });
    const file = new File([blob], nombre, { type: "application/json" });
    if (esIOS() && navigator.canShare && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ files: [file], title: nombre }); } catch (e) { if (e && e.name === "AbortError") return; }
    } else descargar(blob, nombre);
    datosUsuario.ultimaCopia = hoy(); guardar(true);
    toast("Copia guardada. Guárdala en un sitio seguro (Archivos, Drive, correo…).", 4500);
    if (rutaActual() === "#/" || rutaActual() === "") renderHome();
  }
  function importar(file) {
    const fr = new FileReader();
    fr.onload = () => {
      let s = null; try { s = L.sanearDatos(JSON.parse(fr.result), genId, hoy()); } catch (e) { /* */ }
      if (!s) { toast("Ese archivo no es una copia de Flujograma.", 4000); return; }
      // Nunca se importa nada con id de ejemplo
      s.flujos.forEach(x => { if (esIdEjemplo(x.id)) x.id = genId(); });
      const aplicar = modo => {
        const r = modo === "sustituir" ? s : L.fusionar(datosUsuario, s);
        datosUsuario.flujos = r.flujos; guardar(true);
        toast(`Importados ${plural(s.flujos.length, "flujograma", "flujogramas")}.`, 4000);
        location.hash = "#/"; route();
      };
      if (!datosUsuario.flujos.length) { aplicar("sustituir"); return; }
      confirmar(`<p>La copia tiene <b>${plural(s.flujos.length, "flujograma", "flujogramas")}</b>.</p><p><b>Añadir</b> los junta con los tuyos (si uno está en los dos, se queda el más reciente): así se trabaja en equipo. Si prefieres <b>sustituir</b> todo lo tuyo por la copia, pulsa «Sustituir».</p>`, "Añadir a mis datos", () => aplicar("anadir"), { titulo: "Importar copia", peligro: false, otro: ["Sustituir", () => confirmar("<p>Se borrarán tus flujogramas actuales y se quedará solo lo de la copia. Esto no se puede deshacer.</p>", "Sustituir", () => aplicar("sustituir"))] });
    };
    fr.readAsText(file);
  }

  // ---------- Confirmación ----------
  function confirmar(html, siTxt, alSi, o = {}) {
    const m = $("#modal-confirmar");
    $("#conf-titulo").textContent = o.titulo || "¿Seguro?";
    $("#conf-texto").innerHTML = html;
    const si = $("#btn-conf-si"), no = $("#btn-conf-no");
    si.textContent = siTxt; si.className = "btn " + (o.peligro === false ? "btn--primary" : "btn--peligro");
    let extra = $("#btn-conf-otro"); if (extra) extra.remove();
    if (o.otro) { extra = document.createElement("button"); extra.id = "btn-conf-otro"; extra.className = "btn"; extra.textContent = o.otro[0]; no.after(extra); extra.onclick = () => { m.hidden = true; o.otro[1](); }; }
    si.onclick = () => { m.hidden = true; alSi(); };
    no.onclick = () => { m.hidden = true; };
    m.hidden = false; si.focus();
  }

  // ---------- Copiar un ejemplo a mis datos ----------
  function copiarAMisDatos() {
    if (!actual || !esIdEjemplo(actual.id)) return;
    // Ids nuevos para todo, y referencias rehechas, para que no quede nada «ej-…»
    const c = clon(actual), m = new Map(), nuevo = id => { if (!id) return id; if (!m.has(id)) m.set(id, genId()); return m.get(id); };
    c.id = genId(); c.creado = hoy(); c.modificado = hoy();
    c.actores.forEach(a => { a.id = nuevo(a.id); }); c.subprocesos.forEach(s => { s.id = nuevo(s.id); });
    c.pasos.forEach(p => { p.id = nuevo(p.id); });
    c.pasos.forEach(p => { p.actorId = nuevo(p.actorId); p.subprocesoId = nuevo(p.subprocesoId); p.con = nuevo(p.con); p.siguientes.forEach(s => { s.a = nuevo(s.a); }); p.ajuste.lado = nuevo(p.ajuste.lado); });
    c.puntos.forEach(x => { x.id = genId(); x.pasoId = nuevo(x.pasoId); });
    datosUsuario.flujos.push(c); guardar(true); location.hash = `#/flujo/${c.id}/${pasoActual}`;
    toast("Copiado a tus flujogramas. Ya es tuyo: cámbialo a tu gusto.", 4000);
  }

  // ---------- Enrutado ----------
  const NAV = [["", "Inicio"], ["flujo", "Mis flujogramas"], ["ejemplos", "Ejemplos"], ["aprende", "Aprende"], ["prueba", "Ponte a prueba"], ["glosario", "Glosario"]];
  function buildNav() { $("#calc-nav").innerHTML = NAV.map(([r, t]) => `<a href="#/${r}" data-r="${r}">${t}</a>`).join(""); }
  function noEncontrado(que, href, txt) { view.innerHTML = `<div class="error-box">No se encuentra ${que} en este dispositivo.</div><p><a href="${href}">${txt}</a></p>`; }
  let previo = null, docActual = "";
  function route() {
    const [ruta, qs] = (location.hash.replace(/^#\/?/, "") || "").split("?");
    const partes = ruta.split("/"), q = new URLSearchParams(qs || ""), informe = q.get("informe") === "1";
    docActual = informe ? (q.get("doc") || "") : "";
    document.body.classList.toggle("ver-informe", informe);
    actual = null;
    const idR = partes[1] || "", ej = ejemplos();
    modoEjemplo = partes[0] === "ejemplos" || (esIdEjemplo(idR) && ej.flujos.some(x => x.id === idR));
    datos = modoEjemplo ? ej : datosUsuario;
    $("#banner-ejemplo").hidden = !modoEjemplo || informe || partes[0] === "ejemplos";
    let navR = partes[0];
    if (partes[0] === "flujo" && partes[1] === "nuevo") {
      const f = L.nuevoFlujo(genId(), hoy()); borradores.set(f.id, f); abiertos.clear(); pegarAbierto = false; selPaso = ""; previo = f.id; zoom = null;
      history.replaceState(null, "", `#/flujo/${f.id}/1`); renderFlujo(f, 1);
    } else if (partes[0] === "flujo" && partes[1]) {
      const f = buscaFlujo(partes[1]) || borradores.get(partes[1]);
      if (!f) noEncontrado("ese flujograma", "#/flujo", "Ir a mis flujogramas");
      else {
        if (previo !== f.id) { abiertos.clear(); pegarAbierto = false; selPaso = ""; previo = f.id; zoom = null; recorrido = false; pasoRec = ""; historialRec = []; }
        let n = parseInt(partes[2], 10);
        if (!(n >= 1 && n <= 6)) { const p = L.pasoPendiente(f, ENTREGA); n = p ? p.n : 6; history.replaceState(null, "", `#/flujo/${f.id}/${n}${informe ? "?informe=1" : ""}`); }
        renderFlujo(f, n);
        if (informe && esIOS()) prepararPDF();
      }
      navR = "flujo";
    } else if (partes[0] === "flujo") renderLista();
    else if (partes[0] === "ejemplos") renderEjemplos();
    else if (partes[0] === "aprende") renderAprende(parseInt(partes[1], 10) || 0);
    else if (partes[0] === "glosario") renderGlosario();
    else if (partes[0] === "prueba") renderPrueba(partes[1] || "");
    else { renderHome(); navR = ""; }
    if (modoEjemplo) navR = "ejemplos";
    $$("#calc-nav a").forEach(a => a.classList.toggle("active", a.dataset.r === navR));
    const act = $("#calc-nav a.active"); if (act && act.scrollIntoView) act.scrollIntoView({ block: "nearest", inline: "center" });
    window.scrollTo(0, 0);
  }

  // ---------- Eventos ----------
  function tocado(f) {
    f.modificado = hoy();
    if (f === actual && !esVacio(f) && !datos.flujos.includes(f)) { datos.flujos.push(f); borradores.delete(f.id); }
    guardar();
  }
  const buscaEn = (lista, id) => lista.find(x => x.id === id);
  function autoAlto(el) { el.style.height = "auto"; el.style.height = el.scrollHeight + 2 + "px"; }
  new MutationObserver(() => $$("textarea.txt-in", view).forEach(el => { if (!el.closest("[hidden]")) autoAlto(el); })).observe(view, { childList: true, subtree: true });

  function vistaPegado(txt) {
    const r = L.leerPegado(txt), z = $("[data-zona='pegar']"), b = $("[data-act='pegar-ok']");
    if (!z || !b) return;
    const F = r.filas;
    z.innerHTML = !txt.trim() ? "" : F.length
      ? `<div class="note">ℹ Se ${F.length === 1 ? "ha reconocido 1 paso" : "han reconocido " + F.length + " pasos"} (${r.modo === "tabla" ? "tabla" + (r.cabecera ? " con fila de títulos" : "") : "lista"}).</div>
         <ol class="pegar-prev">${F.slice(0, 12).map(x => `<li>${tipoChip(x.tipo)} <b>${esc(L.corto(x.texto, 60))}</b>${x.actor ? ` <span class="badge">${esc(x.actor)}</span>` : ""}</li>`).join("")}${F.length > 12 ? `<li>…</li>` : ""}</ol>`
      : `<div class="warn">⚠ No se reconoce ningún paso.</div>`;
    b.disabled = !F.length; b.textContent = F.length ? `Añadir ${plural(F.length, "paso", "pasos")}` : "Añadir los pasos";
  }
  view.addEventListener("input", e => {
    const t = e.target, f = actual;
    if (t.matches("textarea.txt-in")) autoAlto(t);
    if (t.id === "pegar-txt") { vistaPegado(t.value); return; }
    if (!f) return;
    const k = t.dataset.f, esSel = t.tagName === "SELECT";
    if (t.dataset.ac) { const a = buscaEn(f.actores, t.dataset.ac); if (!a) return; a[k] = t.value; tocado(f); refrescar(); return; }
    if (t.dataset.s) { const s = buscaEn(f.subprocesos, t.dataset.s); if (!s) return; s[k] = t.value; tocado(f); refrescar(); return; }
    if (t.dataset.pa) {
      const p = L.pasoDe(f, t.dataset.pa); if (!p) return;
      p[k] = t.value; tocado(f);
      if (esSel) { if (pasoActual === 4) seleccionar(p.id); else repintar(); refrescar(); } else refrescar(p.id);
      return;
    }
    if (t.dataset.pc) {
      const x = buscaEn(f.puntos, t.dataset.pc); if (!x) return;
      if (k === "fallos") { x.fallos = L.numsFallos(t.value); $$(`[data-zfa="${x.id}"]`).forEach(el => { el.innerHTML = fallosNombres(f, x); }); } else x[k] = t.value;
      tocado(f);
      if (esSel) repintar(); else refrescar();
      return;
    }
    if (t.dataset.marco) { f.marco[t.dataset.marco] = t.value.split("\n").map(x => x.trim()).filter(Boolean).slice(0, t.dataset.marco === "soporte" ? 16 : 12); tocado(f); refrescar(); return; }
    if (t.dataset.cp) { const x = f.control[t.dataset.cp][Number(t.dataset.i)]; if (!x) return; x[k] = t.value; tocado(f); return; }
    if (t.dataset.ch) { const x = f.control.historial[Number(t.dataset.ch)]; if (!x) return; x[k] = t.value; tocado(f); return; }
    if (t.dataset.amfesel) { amfeElegido = t.value; repintar(); return; }
    if (t.dataset.amfeopc) { opcAmfe[t.dataset.amfeopc] = t.checked; return; }
    if (t.dataset.aj) { const p = L.pasoDe(f, t.dataset.aj); if (!p) return; p.ajuste.lado = t.value; if (t.value) p.ajuste.fila = ""; tocado(f); seleccionar(p.id); refrescar(); return; }
    if (t.dataset.sal) {
      const p = L.pasoDe(f, t.dataset.sal); if (!p) return;
      L.ponerSalida(p, t.dataset.c, t.value); tocado(f);
      if (pasoActual === 4) seleccionar(p.id); else repintar();
      refrescar(); return;
    }
    if (t.dataset.k) { setPath(f, t.dataset.k, t.value); tocado(f); refrescar(); }
  });
  view.addEventListener("toggle", e => {
    if (e.target.matches && e.target.matches("details[data-recordar]")) escribir(KEY_FACIL, e.target.open ? "1" : "0");
  }, true);

  function nuevoPasoTras(f, ref, tipo) {
    const p = L.nuevoPaso(genId(), L.siguienteNum(f.pasos), tipo);
    if (ref) { p.actorId = tipo === "terminal" ? "" : ref.actorId; p.subprocesoId = ref.subprocesoId; L.insertarDespues(f, ref, p); }
    else {
      // Al final: se une con el último paso que no lleva a ningún sitio
      const abierto = f.pasos.slice().reverse().find(q => !q.siguientes.length && q.tipo !== "terminal");
      const ultimo = f.pasos[f.pasos.length - 1];
      if (!f.pasos.length) p.tipo = "terminal";
      else { p.actorId = ultimo.actorId || ""; p.subprocesoId = ultimo.subprocesoId; }
      f.pasos.push(p);
      if (abierto) abierto.siguientes.push(L.nuevaFlecha(p.id, abierto.tipo === "decision" ? (abierto.siguientes.some(s => s.etiqueta === "si") ? "no" : "si") : ""));
    }
    return p;
  }
  function enfocarPaso(p) {
    abiertos.add(p.id);
    if (pasoActual === 4) { seleccionar(p.id); const el = $(`[data-pa="${p.id}"][data-f="texto"]`); if (el) el.focus(); return; }
    repintar();
    const el = $(`[data-pa="${p.id}"][data-f="texto"]`); if (el) { el.focus(); el.scrollIntoView({ block: "center" }); }
  }

  view.addEventListener("click", e => {
    const t = e.target; let b;
    if ((b = t.closest(".info-btn"))) { const h = $("#help-" + b.dataset.info); if (!h) return; const open = h.hidden; h.hidden = !open; b.setAttribute("aria-expanded", String(open)); return; }
    const f = actual;
    if ((b = t.closest(".pc-ej .fl-nodo"))) { if (!puntosEj.ver) { const id = b.dataset.paso; if (puntosEj.sel.has(id)) puntosEj.sel.delete(id); else puntosEj.sel.add(id); repPractica(); } return; }
    if ((b = t.closest(".fl-nodo")) && f) { if (recorrido && pasoActual === 4) { irRecorrido(b.dataset.paso); return; } seleccionar(b.dataset.paso === selPaso ? "" : b.dataset.paso); return; }
    if (!(b = t.closest("[data-act]"))) return;
    const act = b.dataset.act, id = b.dataset.id;
    // --- Lista ---
    if (act === "fl-dup") {
      const o = buscaFlujo(id); if (!o) return;
      const c = Object.assign(clon(o), { id: genId(), titulo: (nombreFlujo(o) || "Flujograma") + " (copia)", validado: "", creado: hoy(), modificado: hoy() });
      datos.flujos.push(c); guardar(); renderLista(); toast("Flujograma duplicado.", 2500);
    }
    else if (act === "fl-del") {
      const o = buscaFlujo(id); if (!o) return;
      confirmar(`<p>Se borrará «${esc(L.corto(nombreFlujo(o) || "Flujograma sin nombre", 80))}» con sus ${plural(o.pasos.length, "paso", "pasos")}. Esto no se puede deshacer${datosUsuario.ultimaCopia ? "" : " (y aún no tienes ninguna copia de seguridad)"}.</p>`, "Borrar", () => {
        datos.flujos = datos.flujos.filter(x => x.id !== id); if (!modoEjemplo) datosUsuario.flujos = datos.flujos; guardar(true); renderLista();
      });
    }
    // --- Paso 1 ---
    else if (act === "sug-objetivo" && f) {
      const s = L.sugerirObjetivo(f);
      if (!s) { toast("Escribe primero el nombre del proceso.", 3000); return; }
      const hacer = () => { f.objetivo = s; tocado(f); repintar(); };
      if (lleno(f.objetivo)) confirmar("<p>Se sustituirá el objetivo que has escrito por el propuesto.</p>", "Sustituir", hacer, { peligro: false }); else hacer();
    }
    // --- Paso 2 ---
    else if (act === "ac-sug" && f) {
      const nom = L.ACTORES_SUG[Number(b.dataset.i)]; if (!nom) return;
      if (L.buscaActor(f, nom)) { toast("Ese actor ya está.", 2000); return; }
      f.actores.push(L.nuevoActor(genId(), nom)); tocado(f); repintar();
    }
    else if (act === "ac-add" && f) {
      const a = L.nuevoActor(genId()); f.actores.push(a); tocado(f); repintar();
      const el = $(`[data-ac="${a.id}"]`); if (el) el.focus();
    }
    else if (act === "ac-roles" && f) { const n = L.anadirActores(f, L.rolesSinCalle(f), genId); tocado(f); repintar(); toast(`${plural(n, "actor añadido", "actores añadidos")}. Revisa los nombres.`, 3000); }
    else if ((act === "ac-subir" || act === "ac-bajar" || act === "sub-subir" || act === "sub-bajar") && f) {
      const l = act.startsWith("ac") ? f.actores : f.subprocesos, i = l.findIndex(x => x.id === id), j = act.endsWith("subir") ? i - 1 : i + 1;
      if (i < 0 || j < 0 || j >= l.length) return;
      [l[i], l[j]] = [l[j], l[i]]; tocado(f); repintar();
    }
    else if (act === "ac-del" && f) {
      const a = buscaEn(f.actores, id); if (!a) return;
      const n = f.pasos.filter(p => p.actorId === id).length;
      const hacer = () => { f.actores = f.actores.filter(x => x.id !== id); f.pasos.forEach(p => { if (p.actorId === id) p.actorId = ""; }); tocado(f); repintar(); };
      if (n) confirmar(`<p>Se quitará «${esc(a.nombre || "sin nombre")}». Sus ${plural(n, "paso", "pasos")} no se borran: quedarán «sin asignar».</p>`, "Quitar", hacer); else hacer();
    }
    else if (act === "sub-add" && f) {
      const s = L.nuevoSubproceso(genId(), L.colorLibre(f)); f.subprocesos.push(s); tocado(f); repintar();
      const el = $(`[data-s="${s.id}"][data-f="nombre"]`); if (el) { el.focus(); el.scrollIntoView({ block: "center" }); }
    }
    else if (act === "sub-del" && f) {
      const s = buscaEn(f.subprocesos, id); if (!s) return;
      const n = f.pasos.filter(p => p.subprocesoId === id).length;
      const hacer = () => { f.subprocesos = f.subprocesos.filter(x => x.id !== id); f.pasos.forEach(p => { if (p.subprocesoId === id) p.subprocesoId = ""; }); tocado(f); repintar(); };
      if (n || lleno(s.nombre)) confirmar(`<p>Se quitará el subproceso «${esc(L.corto(s.nombre || "sin nombre", 60))}».${n ? ` Sus ${plural(n, "paso", "pasos")} no se borran.` : ""}</p>`, "Quitar", hacer); else hacer();
    }
    // --- Paso 3 y panel del paso 4 ---
    else if (act === "p-toggle") {
      if (abiertos.has(id)) abiertos.delete(id); else abiertos.add(id);
      const card = $(`.paso-card[data-pid="${id}"]`); if (!card) return;
      const ab = abiertos.has(id);
      $(".rg-body", card).hidden = !ab; $(".rg-toggle", card).setAttribute("aria-expanded", ab);
      if (ab) $$("textarea.txt-in", card).forEach(autoAlto);
    }
    else if (act === "p-todos" && f) { if (abiertos.size) abiertos.clear(); else f.pasos.forEach(p => abiertos.add(p.id)); repintar(); }
    else if (act === "p-add" && f) { const p = nuevoPasoTras(f, null, "actividad"); tocado(f); enfocarPaso(p); }
    else if ((act === "p-debajo" || act === "p-decision") && f) {
      const ref = L.pasoDe(f, id); if (!ref) return;
      const p = nuevoPasoTras(f, ref, act === "p-decision" ? "decision" : "actividad"); tocado(f); enfocarPaso(p);
    }
    else if (act === "p-tipo" && f) { const p = L.pasoDe(f, id); if (!p) return; L.cambiarTipo(p, b.dataset.v); tocado(f); if (pasoActual === 4) { seleccionar(p.id); refrescar(); } else { abiertos.add(p.id); repintar(); } }
    else if (act === "p-ida" && f) { const p = L.pasoDe(f, id), s = p && p.siguientes[Number(b.dataset.i)]; if (!s) return; s.estilo = s.estilo === "idavuelta" ? "normal" : "idavuelta"; tocado(f); if (pasoActual === 4) seleccionar(p.id); else repintar(); }
    else if (act === "p-flecha" && f) {
      const p = L.pasoDe(f, id); if (!p) return;
      const libre = f.pasos.find(q => q.id !== p.id && !p.siguientes.some(s => s.a === q.id));
      if (!libre) return; p.siguientes.push(L.nuevaFlecha(libre.id, "")); tocado(f); if (pasoActual === 4) seleccionar(p.id); else repintar();
      toast("Elige en la lista a qué paso va la nueva flecha.", 3000);
    }
    else if ((act === "p-subir" || act === "p-bajar") && f) {
      const i = f.pasos.findIndex(p => p.id === id), j = act === "p-subir" ? i - 1 : i + 1;
      if (i < 0 || j < 0 || j >= f.pasos.length) return;
      [f.pasos[i], f.pasos[j]] = [f.pasos[j], f.pasos[i]]; tocado(f); repintar();
    }
    else if (act === "p-del" && f) {
      const p = L.pasoDe(f, id); if (!p) return;
      const llegan = f.pasos.filter(q => q.siguientes.some(s => s.a === id)).length;
      const hacer = () => { L.quitarPaso(f, id); abiertos.delete(id); if (selPaso === id) selPaso = ""; tocado(f); repintar(); };
      if (lleno(p.texto) || llegan) confirmar(`<p>Se quitará el paso nº ${p.num} «${esc(L.corto(p.texto || "sin texto", 60))}».${llegan ? " Los pasos que llevaban a él pasarán a llevar a lo que venía después (si solo había un camino)." : ""}</p>`, "Quitar", hacer); else hacer();
    }
    else if (act === "pegar-abrir") { pegarAbierto = true; repintar(); const el = $("#pegar-txt"); if (el) { el.focus(); el.scrollIntoView({ block: "center" }); } }
    else if (act === "pegar-cerrar") { pegarAbierto = false; repintar(); }
    else if (act === "pegar-ok" && f) {
      const r = L.leerPegado($("#pegar-txt").value, { terminales: !f.pasos.length }); if (!r.filas.length) return;
      const n = L.incorporarPasos(f, r.filas, genId);
      pegarAbierto = false; tocado(f); repintar();
      toast(`Añadidos ${plural(n.pasos, "paso", "pasos")}${n.actores ? ` y ${plural(n.actores, "actor", "actores")}` : ""}. Revisa los que salgan en rojo y mira el dibujo.`, 4500);
    }
    // --- Paso 4 ---
    else if (act === "ver-paso" && f) {
      if (pasoActual !== 4 && pasoActual !== 5) return;
      seleccionar(id);
      const s = $(`#lienzo .fl-nodo[data-paso="${id}"]`), l = $("#lienzo");
      if (s && l) { const r = s.getBoundingClientRect(), rl = l.getBoundingClientRect(); l.scrollLeft += r.left - rl.left - rl.width / 2 + r.width / 2; l.scrollTop += r.top - rl.top - rl.height / 2 + r.height / 2; l.scrollIntoView({ block: "nearest" }); }
    }
    else if (act === "panel-cerrar") seleccionar("");
    // --- Retoques ---
    else if ((act === "aj-bajar" || act === "aj-subir" || act === "aj-quitar") && f) {
      const p = L.pasoDe(f, id); if (!p) return;
      const n = parseInt(p.ajuste.fila, 10) || 0;
      if (act === "aj-quitar") { p.ajuste.fila = ""; p.ajuste.lado = ""; } else p.ajuste.fila = String(Math.max(0, Math.min(9, n + (act === "aj-bajar" ? 1 : -1)))).replace(/^0$/, "");
      tocado(f); seleccionar(p.id);
    }
    // --- Paso 5 ---
    else if (act === "pc-add" && f) {
      const x = L.nuevoPunto(genId(), L.siguienteNum(f.puntos)); x.pasoId = id; f.puntos.push(x); tocado(f);
      seleccionar(id); refrescar(); const z = $("[data-zona='tablapc']"); if (z) z.innerHTML = tablaPuntosHtml(f);
      const el = $(`.panel-paso [data-pc="${x.id}"][data-f="titulo"]`); if (el) el.focus();
    }
    else if (act === "pc-del" && f) {
      const x = buscaEn(f.puntos, id); if (!x) return;
      const hacer = () => { f.puntos = f.puntos.filter(y => y.id !== id); tocado(f); repintar(); };
      if (lleno(x.titulo) || lleno(x.descripcion)) confirmar(`<p>Se quitará el punto crítico nº ${x.num} «${esc(L.corto(x.titulo || "sin título", 60))}».${x.clave ? " La propuesta volverá a la lista." : ""}</p>`, "Quitar", hacer); else hacer();
    }
    else if (act === "prop-ok" && f) {
      const pr = L.propuestasPuntos(f).find(x => x.clave === b.dataset.k); if (!pr) return;
      const x = L.aceptarPropuesta(f, pr, genId); tocado(f); repintar();
      toast(`Añadido el punto crítico nº ${x.num}. Ajusta el título y escribe la descripción.`, 3500);
    }
    else if (act === "prop-no" && f) { if (!f.descartes.includes(b.dataset.k)) f.descartes.push(b.dataset.k); tocado(f); repintar(); }
    else if (act === "prop-recuperar" && f) { f.descartes = []; tocado(f); repintar(); }
    // --- Paso 6 ---
    else if (act === "ex-png" && f) exportarImagen(f, "png");
    else if (act === "ex-svg" && f) exportarImagen(f, "svg");
    else if (act === "ex-drawio" && f) exportarDrawio(f);
    else if (act === "informe") irInforme();
    else if (act === "volver") location.hash = rutaActual();
    else if (act === "imprimir") imprimir();
    else if (act === "inf-sub") { porSubproceso = !porSubproceso; const y = window.scrollY; renderInforme(actual); window.scrollTo(0, y); }
    else if (act === "v-or" && f) { f.vista.orientacion = b.dataset.v; zoom = null; tocado(f); repintar(); }
    else if (act === "v-sub" && f) { f.vista.subprocesos = !f.vista.subprocesos; tocado(f); repintar(); }
    else if (act === "v-marco" && f) { f.vista.marco = !f.vista.marco; if (f.vista.marco && !f.marco.estrategicos.length && !f.marco.soporte.length) f.marco = clon(L.MARCO_SUG); tocado(f); repintar(); }
    else if (act === "marco-sug" && f) { f.marco = clon(L.MARCO_SUG); tocado(f); repintar(); }
    else if (act === "amfe-buscar" && f) {
      let l = null; try { l = L.leerAmfe(JSON.parse(leer("amfe-intercambio") || "null")); } catch (er) { /* */ }
      if (l && l.length) { amfesLeidos = l; amfeElegido = l[0].id; repintar(); }
      else confirmar("<p>No hay ningún AMFE de la app <b>AMFE</b> en este navegador.</p><p>Si lo tienes en otro dispositivo, carga su copia de seguridad (.json).</p>", "Cargar una copia", () => $("#input-amfe").click(), { titulo: "Traer de AMFE", peligro: false });
    }
    else if (act === "amfe-cancelar") { amfesLeidos = null; repintar(); }
    else if (act === "amfe-traer" && f && amfesLeidos) {
      const a = amfesLeidos.find(x => x.id === amfeElegido) || amfesLeidos[0];
      const r = L.traerDeAmfe(f, a, opcAmfe, genId); amfesLeidos = null; tocado(f); repintar();
      const partes = [r.subprocesos && plural(r.subprocesos, "subproceso", "subprocesos"), r.actores && plural(r.actores, "actor", "actores"), r.pasos && plural(r.pasos, "paso", "pasos"), r.puntos && plural(r.puntos, "punto crítico", "puntos críticos")].filter(Boolean);
      toast(`${partes.length ? "Traído del AMFE: " + L.listaY(partes) + "." : "No había nada nuevo que traer."}${r.esqueletoOmitido ? " El borrador de pasos no se ha hecho porque ya tenías pasos." : ""}`, 5000);
    }
    else if (act === "recorrido" && f) { recorrido = !recorrido; if (recorrido) { pasoRec = selPaso || (L.primerPaso(f) || {}).id || ""; historialRec = []; } repintar(); if (recorrido) { const z = $("[data-zona='recorrido']"); if (z) z.scrollIntoView({ block: "nearest" }); } }
    else if (act === "rec-ir" && f) irRecorrido(id);
    else if (act === "rec-atras" && f) { const p = historialRec.pop(); if (p) irRecorrido(p, true); }
    else if (act === "rec-inicio" && f) { historialRec = []; irRecorrido((L.primerPaso(f) || {}).id, true); }
    else if (act === "reunion") ponerReunion(!document.body.classList.contains("modo-reunion"));
    else if (act === "ver-cambios" && f) { verCambios = !verCambios; repintar(); }
    else if (act === "hoja") irInforme("hoja");
    else if (act === "ed-nueva" && f) {
      const tipo = b.dataset.v, n = String((parseInt(f.edicion, 10) || 0) + 1).padStart(2, "0");
      confirmar(`<p>Se creará la <b>edición ${n}</b>${tipo === "propuesto" ? ": el <b>proceso propuesto</b>, para dibujar cómo quedará tras las acciones de mejora" : ", para revisar el proceso"}. Es una copia completa; esta edición se queda como está, para comparar.</p>`, "Crear la edición", () => {
        // En los ejemplos, la edición nueva también es de ejemplo (id «ej-…»): vive en memoria y no se mezcla con los datos
        const c = L.nuevaEdicion(f, modoEjemplo ? () => "ej-ed-" + genId() : genId, hoy(), tipo); datos.flujos.push(c); if (!modoEjemplo) guardar(true);
        location.hash = `#/flujo/${c.id}/3`; toast(`Edición ${c.edicion} creada. Cambia los pasos; en el dibujo verás marcados los nuevos y los cambiados.`, 4500);
      }, { titulo: "Nueva edición", peligro: false });
    }
    // --- Ponte a prueba ---
    else if (act === "quiz") {
      const qi = Number(b.dataset.q); if (!C.TEST[qi] || qi in respuestas) return;
      respuestas[qi] = Number(b.dataset.o); const y = window.scrollY; renderPrueba(temaPrueba); window.scrollTo(0, y);
    }
    else if (act === "quiz-reset") { Object.keys(respuestas).forEach(k => delete respuestas[k]); renderPrueba(temaPrueba); }
    else if (act === "simb") { const i = Number(b.dataset.i); if (!(i in respSimb)) { respSimb[i] = b.dataset.v; repPractica(); } }
    else if (act === "ord") { const o = ordenes[b.dataset.k]; if (!o.hecho && !o.sel.includes(Number(b.dataset.i))) { o.sel.push(Number(b.dataset.i)); if (o.sel.length === C.EJERCICIOS.ordenar[Number(b.dataset.k)].pasos.length) o.hecho = true; repPractica(); } }
    else if (act === "ord-reset") { ordenes[b.dataset.k] = { sel: [], hecho: false }; repPractica(); }
    else if (act === "err") { const i = Number(b.dataset.i); if (!(i in respErr)) { respErr[i] = Number(b.dataset.o); repPractica(); } }
    else if (act === "pc-comparar") { puntosEj.ver = true; repPractica(); }
    else if (act === "practica-reset") { [respSimb, respErr].forEach(o => Object.keys(o).forEach(k => delete o[k])); ordenes.splice(0, ordenes.length, ...C.EJERCICIOS.ordenar.map(() => ({ sel: [], hecho: false }))); puntosEj.sel.clear(); puntosEj.ver = false; renderPractica(); }
    else if (act === "ex-word" && f) exportarWord(f);
    else if (act === "ex-excel" && f) exportarExcel(f);
    else if (act === "cp-add" && f) { f.control[b.dataset.k].push({ nombre: "", cargo: "" }); tocado(f); repintar(); }
    else if (act === "cp-del" && f) { f.control[b.dataset.k].splice(Number(b.dataset.i), 1); tocado(f); repintar(); }
    else if (act === "ch-add" && f) { const H = f.control.historial, u = H.length ? parseInt(H[H.length - 1].edicion, 10) : -1; H.push({ edicion: String((Number.isFinite(u) ? u : -1) + 1).padStart(2, "0"), fecha: hoyIso(), cambio: "" }); tocado(f); repintar(); }
    else if (act === "ch-del" && f) { f.control.historial.splice(Number(b.dataset.i), 1); tocado(f); repintar(); }
    else if (act === "v-turno" && f) { f.vista.calles = f.vista.calles === "turno" ? "actor" : "turno"; tocado(f); repintar(); }
    else if (act === "v-num" && f) { f.vista.numeros = !f.vista.numeros; tocado(f); repintar(); }
    else if (act === "v-letra" && f) { f.vista.letra = f.vista.letra === "grande" ? "normal" : "grande"; tocado(f); repintar(); }
    else if (act === "z-mas") ponerZoom(zoomActual() * 1.25);
    else if (act === "z-menos") ponerZoom(zoomActual() / 1.25);
    else if (act === "z-ajustar") { zoom = ajusteAncho(); aplicarZoom(); }
    else if (act === "validar" && f) { if (L.errores(f).length) return; f.validado = hoyIso(); tocado(f); refrescar(); toast("Marcado como validado con el equipo.", 2500); }
    else if (act === "validar-quitar" && f) { f.validado = ""; tocado(f); refrescar(); }
    // --- Generales ---
    else if (act === "copia") copiaSeguridad();
    else if (act === "importar") $("#input-importar").click();
  });
  $("#banner-copiar").addEventListener("click", copiarAMisDatos);
  // Copia de seguridad de la app AMFE (para «Traer de AMFE» desde otro dispositivo)
  $("#input-amfe").addEventListener("change", e => {
    const fl = e.target.files && e.target.files[0]; e.target.value = ""; if (!fl) return;
    const fr = new FileReader();
    fr.onload = () => {
      let l = null; try { l = L.leerAmfe(JSON.parse(fr.result)); } catch (er) { /* */ }
      if (!l || !l.length) { toast("Ese archivo no es una copia de la app AMFE (o es de una versión que no se reconoce).", 4500); return; }
      amfesLeidos = l; amfeElegido = l[0].id; if (actual) repintar();
    };
    fr.readAsText(fl);
  });
  $("#input-importar").addEventListener("change", e => { const fl = e.target.files && e.target.files[0]; if (fl) importar(fl); e.target.value = ""; });

  // ---------- Tema ----------
  function setTema(t) {
    document.documentElement.setAttribute("data-tema", t);
    const m = $("#meta-theme-color"); if (m) m.content = t === "claro" ? "#f0f7fb" : "#0d1b2a";
  }
  setTema(document.documentElement.getAttribute("data-tema") || "claro");
  $("#btn-tema").addEventListener("click", () => {
    const t = document.documentElement.getAttribute("data-tema") === "oscuro" ? "claro" : "oscuro";
    setTema(t); escribir("flujograma-tema", t);
  });
  if (window.matchMedia) matchMedia("(prefers-color-scheme: dark)").addEventListener("change", ev => { if (!leer("flujograma-tema")) setTema(ev.matches ? "oscuro" : "claro"); });

  // ---------- Modales ----------
  const KEY_BIENV = "flujograma-bienvenida-vista";
  const mb = $("#modal-bienvenida"), ma = $("#modal-acerca");
  const vista = leer(KEY_BIENV);
  if (!vista) mb.hidden = false;
  $("#btn-bienv-ok").addEventListener("click", () => { if ($("#modal-no-repetir").checked) escribir(KEY_BIENV, "1"); mb.hidden = true; });
  $("#btn-acerca").addEventListener("click", () => { ma.hidden = false; });
  $("#btn-acerca-cerrar").addEventListener("click", () => { ma.hidden = true; });
  ma.addEventListener("click", e => { if (e.target === ma) ma.hidden = true; });
  document.addEventListener("keydown", e => { if (e.key === "Escape") { ma.hidden = true; $("#modal-confirmar").hidden = true; if (document.body.classList.contains("modo-reunion")) ponerReunion(false); } });

  // ---------- Versiones y novedades ----------
  const KEY_VERSION = "flujograma-version-vista";
  const listaCambios = n => `<div class="version-item"><div class="version-cab"><b>${esc(n.titulo)}</b><span class="version-tag">v${esc(n.version)} · ${esc(n.fecha)}</span></div><ul>${n.cambios.map(c => `<li>${esc(c)}</li>`).join("")}</ul></div>`;
  $("#historial-versiones").innerHTML = NOVEDADES.map(listaCambios).join("");
  $("#about-version").textContent = $("#footer-version").textContent = `Versión ${APP_VERSION}`;
  const mn = $("#modal-novedades");
  $("#btn-novedades-ok").addEventListener("click", () => { mn.hidden = true; escribir(KEY_VERSION, APP_VERSION); });
  (function gestionarNovedades() {
    const vistaV = leer(KEY_VERSION);
    if (vistaV === APP_VERSION) return;
    if (!vistaV && !vista) { escribir(KEY_VERSION, APP_VERSION); return; }
    const idx = NOVEDADES.findIndex(n => n.version === vistaV);
    const nuevas = idx > 0 ? NOVEDADES.slice(0, idx) : [NOVEDADES[0]];
    $("#novedades-sub").textContent = nuevas.length > 1 ? "Esto es lo nuevo desde tu última visita" : "Gracias por mantener la app al día";
    $("#novedades-body").innerHTML = nuevas.map(listaCambios).join("");
    if (mb.hidden) mn.hidden = false;
  })();

  // ---------- Service worker y aviso de nueva versión ----------
  let actualizando = false;
  function avisoActualizacion(reg) {
    if ($("#update-banner")) return;
    const b = document.createElement("div");
    b.id = "update-banner"; b.className = "update-banner no-print"; b.setAttribute("role", "status");
    b.innerHTML = "<span>Nueva versión disponible</span><button type=\"button\">Actualizar</button>";
    b.querySelector("button").addEventListener("click", () => { guardar(true); actualizando = true; if (reg.waiting) reg.waiting.postMessage({ type: "SKIP_WAITING" }); b.remove(); });
    document.body.appendChild(b);
  }
  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    navigator.serviceWorker.register("sw.js").then(reg => {
      if (reg.waiting && navigator.serviceWorker.controller) avisoActualizacion(reg);
      reg.addEventListener("updatefound", () => {
        const nw = reg.installing; if (!nw) return;
        nw.addEventListener("statechange", () => { if (nw.state === "installed" && navigator.serviceWorker.controller) avisoActualizacion(reg); });
      });
    }).catch(() => {});
    let recargando = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => { if (recargando || !actualizando) return; recargando = true; location.reload(); });
  }

  // ---------- Instalar como aplicación ----------
  let avisoInstalar = null;
  window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); avisoInstalar = e; const b = $("#btn-instalar"); if (b) b.hidden = false; });
  $("#btn-instalar").addEventListener("click", async () => { if (!avisoInstalar) return; avisoInstalar.prompt(); try { await avisoInstalar.userChoice; } catch (e) { /* */ } avisoInstalar = null; $("#btn-instalar").hidden = true; });
  window.addEventListener("appinstalled", () => { const b = $("#btn-instalar"); if (b) b.hidden = true; });
  if (matchMedia("(display-mode: standalone)").matches || navigator.standalone) { const i = $("#instalar-bloque"); if (i) i.classList.add("instalada"); }

  window.FLUJOGRAMA = { datos: () => datos, generarPDF };   // solo para pruebas desde la consola

  // ---------- Arranque ----------
  buildNav();
  window.addEventListener("hashchange", route);
  route();
})();

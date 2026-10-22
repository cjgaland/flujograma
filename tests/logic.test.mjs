// Tests de la lógica pura de Flujograma: node tests/logic.test.mjs
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const L = require("../logic.js"), D = require("../dibujo.js"), C = require("../contenido.js");

let ok = 0, mal = 0;
const t = (nombre, cond) => { if (cond) ok++; else { mal++; console.log("✕", nombre); } };
let n = 0; const genId = () => "t" + (n++);
const clon = o => JSON.parse(JSON.stringify(o));
const solapes = d => { const r = []; for (const a of d.nodos) for (const b of d.nodos) if (a !== b && a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h) r.push([a.num, b.num]); return r; };
const ortogonal = e => e.puntos.every((p, i) => i === 0 || Math.abs(p[0] - e.puntos[i - 1][0]) < 0.2 || Math.abs(p[1] - e.puntos[i - 1][1]) < 0.2);
const tocaNodo = (pt, nd) => pt[0] >= nd.x - 0.6 && pt[0] <= nd.x + nd.w + 0.6 && pt[1] >= nd.y - 0.6 && pt[1] <= nd.y + nd.h + 0.6;

// ---------- Actor por la primera palabra ----------
t("actor enfermera", L.adivinarActor("Enfermera consulta hoja de indicaciones").actor === "Enfermería");
t("resto sin actor", L.adivinarActor("Enfermera consulta hoja de indicaciones").resto === "Consulta hoja de indicaciones");
t("actor médico", L.adivinarActor("Médico rellena la solicitud").actor === "Facultativo");
t("actor técnico de rayos", L.adivinarActor("Técnico de rayos realiza la prueba").actor === "Técnico de Radiología");
t("actor enfermería de quirófano", L.adivinarActor("Enfermería de quirófano verifica identidad").actor === "Enfermería de quirófano");
t("sin actor", L.adivinarActor("Se imprime volante").actor === "");

// ---------- Escritura rápida (proceso A del ejercicio 5) ----------
const listaA = `1. Enfermera consulta hoja de indicaciones.
2. Acude a la habitación del paciente.
3. Mide TA, FC, FR, SatO2 y Tª.
4. Registra en historia clínica electrónica.
5. Informa al médico si hay valores anómalos.`;
const r = L.leerPegado(listaA);
t("modo lista", r.modo === "lista");
t("8 filas (inicio + 4 + decisión + acción + fin)", r.filas.length === 8);
t("hereda el actor", r.filas[2].actor === "Enfermería");
t("condicional → decisión", r.filas[5].tipo === "decision" && r.filas[5].texto === "¿Hay valores anómalos?");
t("decisión Sí → acción, No → fin", r.filas[5].sig.find(s => s.etiqueta === "si").k === "6" && r.filas[5].sig.find(s => s.etiqueta === "no").k === "7");
const f = L.nuevoFlujo(genId(), "x");
const inc = L.incorporarPasos(f, r.filas, genId);
t("incorpora pasos y actores", inc.pasos === 8 && inc.actores === 1 && f.actores[0].nombre === "Enfermería");
t("sin avisos de error", L.errores(f).length === 0);
t("inicio y fin reconocidos", L.esInicio(f, f.pasos[0]) && L.esFin(f, f.pasos[7]));
t("progreso paso 3", L.progreso(f)[3] === true);

// ---------- Tabla pegada ----------
const tabla = "Nº\tTipo\tPaso\tQuién\tSigue a\n1\tInicio\tLlega el paciente\t\t2\n2\tActividad\tRegistra datos\tAdministrativo\t3\n3\tDecisión\t¿Datos completos?\tAdministrativo\tSí 4, No 2\n4\tFin\tPasa a triaje\t\t";
const rt = L.leerPegado(tabla);
t("modo tabla con cabecera", rt.modo === "tabla" && rt.cabecera && rt.filas.length === 4);
t("tabla: decisión con Sí y No", rt.filas[2].sig.length === 2 && rt.filas[2].sig[1].etiqueta === "no" && rt.filas[2].sig[1].k === "2");
const ft = L.nuevoFlujo(genId(), "x"); L.incorporarPasos(ft, rt.filas, genId);
t("tabla: sin errores (vuelta atrás válida)", L.errores(ft).length === 0);
t("tabla: tipos", ft.pasos.map(p => p.tipo).join() === "terminal,actividad,decision,terminal");

// ---------- Validador ----------
const fv = L.nuevoFlujo(genId(), "x");
const a1 = L.nuevoPaso(genId(), 1, "actividad"), d1 = L.nuevoPaso(genId(), 2, "decision"), a3 = L.nuevoPaso(genId(), 3, "actividad");
a1.texto = "Hoja de tratamiento"; d1.texto = "Valores normales"; a3.texto = "Anota";
a1.siguientes.push(L.nuevaFlecha(d1.id)); d1.siguientes.push(L.nuevaFlecha(a3.id, "si"));
fv.pasos.push(a1, d1, a3);
const av = L.avisosPasos(fv), txt = av.map(x => x.texto).join(" | ");
t("falta inicio", /Falta el inicio/.test(txt));
t("falta fin", /Falta el fin/.test(txt));
t("decisión sin No", av.some(x => x.paso === d1.id && x.nivel === "error" && /No/.test(x.texto)));
t("decisión sin pregunta", av.some(x => x.paso === d1.id && /pregunta/.test(x.texto)));
t("callejón sin salida", av.some(x => x.paso === a3.id && /callejón/.test(x.texto)));
t("parece un documento", av.some(x => x.paso === a1.id && /papel/.test(x.texto)));
t("sin actor", av.some(x => x.paso === a1.id && /quién/.test(x.texto)));

// ---------- Editar el encadenado ----------
const fe = L.nuevoFlujo(genId(), "x"); L.incorporarPasos(fe, L.leerLista("Celador traslada al paciente\nTécnico realiza la prueba"), genId);
const [i0, p1, p2] = fe.pasos;
const nuevo = L.nuevoPaso(genId(), 99); L.insertarDespues(fe, p1, nuevo);
t("insertar: p1 → nuevo → p2", p1.siguientes[0].a === nuevo.id && nuevo.siguientes[0].a === p2.id && fe.pasos[2] === nuevo);
L.quitarPaso(fe, nuevo.id);
t("quitar: p1 vuelve a p2", p1.siguientes.length === 1 && p1.siguientes[0].a === p2.id);
L.cambiarTipo(p1, "decision"); t("cambiar a decisión etiqueta Sí", p1.siguientes[0].etiqueta === "si");
L.ponerSalida(p1, "no", i0.id); t("poner salida No", p1.siguientes.some(s => s.etiqueta === "no" && s.a === i0.id));
L.cambiarTipo(p1, "actividad"); t("dejar de ser decisión quita etiquetas", p1.siguientes.every(s => !s.etiqueta));

// ---------- Ejemplos: saneado, validador y colocación ----------
C.EJEMPLOS.flujos.forEach(raw => {
  const fx = L.sanearFlujo(clon(raw), genId, "x");
  t(`${raw.id}: el saneado conserva todo`, fx.pasos.length === raw.pasos.length && fx.pasos.every((p, i) => p.siguientes.length === raw.pasos[i].siguientes.length));
  t(`${raw.id}: sin errores ni avisos`, L.avisosPasos(fx).filter(a => a.nivel !== "nota").length === 0);
  ["vertical", "horizontal"].forEach(o => {
    ["normal", "grande"].forEach(letra => {
      const d = L.disponer(fx, { orientacion: o, letra });
      const nodo = id => d.nodos.find(x => x.pasoId === id);
      t(`${raw.id} ${o} ${letra}: sin solapes`, solapes(d).length === 0);
      t(`${raw.id} ${o} ${letra}: todas las flechas`, d.flechas.length === L.flechas(fx).length);
      t(`${raw.id} ${o} ${letra}: flechas en ángulo recto`, d.flechas.every(ortogonal));
      t(`${raw.id} ${o} ${letra}: flechas de nodo a nodo`, d.flechas.every(e => tocaNodo(e.puntos[0], nodo(e.de)) && tocaNodo(e.puntos[e.puntos.length - 1], nodo(e.a))));
      t(`${raw.id} ${o} ${letra}: Sí y No rotulados`, d.flechas.filter(e => e.etiqueta === "si" || e.etiqueta === "no").every(e => e.rotulo));
      t(`${raw.id} ${o} ${letra}: dentro del lienzo`, d.nodos.every(x => x.x >= 0 && x.y >= 0 && x.x + x.w <= d.ancho && x.y + x.h <= d.alto));
      t(`${raw.id} ${o} ${letra}: cada paso en su calle`, d.nodos.every(x => { const c = d.calles.find(k => k.actorId && k.actorId === x.actorId); return !c || (x.x >= c.x && x.x + x.w <= c.x + c.w && x.y >= c.y && x.y + x.h <= c.y + c.h); }));
      t(`${raw.id} ${o} ${letra}: mismo resultado siempre`, JSON.stringify(d) === JSON.stringify(L.disponer(fx, { orientacion: o, letra })));
      const svg = D.svg(d);
      t(`${raw.id} ${o} ${letra}: SVG con todos los pasos`, svg.startsWith("<svg") && (svg.match(/class="fl-nodo"/g) || []).length === fx.pasos.length);
    });
  });
});
// Radiografía: los subprocesos van seguidos (ninguno empieza antes de que acabe el anterior)
const fr = L.sanearFlujo(clon(C.EJEMPLOS.flujos[1]), genId, "x"), dr = L.disponer(fr);
t("bandas de subproceso sin solaparse", dr.bandas.length === 3 && dr.bandas.every((b, i) => i === 0 || b.y >= dr.bandas[i - 1].y + dr.bandas[i - 1].h - 0.1));
t("vuelta atrás detectada (repite la prueba)", dr.flechas.some(e => e.atras && e.de === "ej-fl-radiografia-p17"));
t("documento pegado a su actividad, en la misma fila", (() => { const a = dr.nodos.find(x => x.num === 2), b = dr.nodos.find(x => x.num === 3); return Math.abs((a.y + a.h / 2) - (b.y + b.h / 2)) < 1 && b.x > a.x; })());
t("proceso externo fuera de las calles", (() => { const fx = L.nuevoFlujo(genId(), "x"); L.incorporarPasos(fx, L.leerLista("Enfermera extrae la muestra\nExterno: Laboratorio\nMédico valora el resultado"), genId); const ext = fx.pasos.find(p => p.tipo === "externo"); return !ext.actorId && !L.avisosPasos(fx).some(a => a.paso === ext.id); })());

// ---------- Saneado ----------
const sucio = { flujos: [{ id: "a", pasos: [{ id: "p1", num: 1, tipo: "raro", siguientes: [{ a: "p1" }, { a: "noexiste" }, { a: "p2", etiqueta: "si" }], actorId: "fantasma" }, { id: "p2", num: 1, tipo: "decision" }, { id: "p1", num: 3 }], vista: { subprocesos: false } }, "basura"] };
const s = L.sanearDatos(sucio, genId, "x");
t("saneado: descarta lo que no es objeto", s.flujos.length === 1);
t("saneado: ids repetidos fuera", s.flujos[0].pasos.length === 2);
t("saneado: tipo desconocido → actividad", s.flujos[0].pasos[0].tipo === "actividad");
t("saneado: flechas a sí mismo o rotas fuera", s.flujos[0].pasos[0].siguientes.length === 1 && s.flujos[0].pasos[0].siguientes[0].a === "p2");
t("saneado: etiqueta Sí fuera si no es decisión", s.flujos[0].pasos[0].siguientes[0].etiqueta === "");
t("saneado: actor inexistente fuera", s.flujos[0].pasos[0].actorId === "");
t("saneado: números únicos", new Set(s.flujos[0].pasos.map(p => p.num)).size === 2);
t("saneado: conserva un «no» explícito", s.flujos[0].vista.subprocesos === false && s.flujos[0].vista.numeros === true);
t("sanear datos inválidos → null", L.sanearDatos({ nada: 1 }, genId, "x") === null);
const fu = L.fusionar({ flujos: [{ id: "a", modificado: "2" }] }, { flujos: [{ id: "a", modificado: "3" }, { id: "b", modificado: "1" }] });
t("fusionar: gana el más reciente", fu.flujos.length === 2 && fu.flujos.find(x => x.id === "a").modificado === "3");

// ---------- Siguiente paso ----------
t("siguiente paso sin datos", L.siguientePaso({ flujos: [] }, 1).k === "crear");
t("siguiente paso con flujograma a medias", /^paso/.test(L.siguientePaso({ flujos: [f] }, 1).k));

console.log(`${ok} correctos, ${mal} fallidos`);
if (mal) process.exit(1);

// Tests de la lógica pura de Flujograma: node tests/logic.test.mjs
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const L = require("../logic.js"), D = require("../dibujo.js"), C = require("../contenido.js");

let ok = 0, mal = 0;
const t = (nombre, cond) => { if (cond) ok++; else { mal++; console.log("✕", nombre); } };
let n = 0; const genId = () => "t" + (n++);
const clon = o => JSON.parse(JSON.stringify(o));
const CONST = () => C.EJEMPLOS.flujos.find(x => x.id === "ej-fl-constantes");
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
const fr = L.sanearFlujo(clon(C.EJEMPLOS.flujos.find(x => x.id === "ej-fl-radiografia")), genId, "x"), dr = L.disponer(fr);
t("bandas de subproceso sin solaparse", dr.bandas.length === 3 && dr.bandas.every((b, i) => i === 0 || b.y >= dr.bandas[i - 1].y + dr.bandas[i - 1].h - 0.1));
t("vuelta atrás detectada (repite la prueba)", dr.flechas.some(e => e.atras && e.de === "ej-fl-radiografia-p17"));
t("documento pegado a su actividad, en la misma fila", (() => { const a = dr.nodos.find(x => x.num === 2), b = dr.nodos.find(x => x.num === 3); return Math.abs((a.y + a.h / 2) - (b.y + b.h / 2)) < 1 && b.x > a.x; })());
t("proceso externo fuera de las calles", (() => { const fx = L.nuevoFlujo(genId(), "x"); L.incorporarPasos(fx, L.leerLista("Enfermera extrae la muestra\nExterno: Laboratorio\nMédico valora el resultado"), genId); const ext = fx.pasos.find(p => p.tipo === "externo"); return !ext.actorId && !L.avisosPasos(fx).some(a => a.paso === ext.id); })());

// ---------- Puntos críticos (entrega 2) ----------
const fq = L.sanearFlujo(clon(C.EJEMPLOS.flujos.find(x => x.id === "ej-fl-quirofano")), genId, "x");
t("ejemplos: todos con puntos críticos bien colocados", C.EJEMPLOS.flujos.every(raw => { const fx = L.sanearFlujo(clon(raw), genId, "x"); return fx.puntos.length >= 4 && L.progreso(fx)[5] && !L.avisosPuntos(fx).some(a => a.nivel !== "nota"); }));
const props = L.propuestasPuntos(fq);
t("propone traspasos", props.some(x => x.clave.startsWith("tras:")));
t("propone decisiones", props.some(x => x.clave.startsWith("dec:")));
t("propone por palabras (verificar, traslado…)", props.some(x => x.clave.startsWith("pal:")));
const nAntes = props.length, pr = props[0], nuevoP = L.aceptarPropuesta(fq, pr, genId);
t("aceptar una propuesta crea el punto y la quita de la lista", nuevoP.clave === pr.clave && L.propuestasPuntos(fq).length === nAntes - 1);
fq.descartes.push(props[1].clave);
t("descartar quita la propuesta", L.propuestasPuntos(fq).length === nAntes - 2);
const pFin = L.nuevoPunto(genId(), 99); pFin.pasoId = "ej-fl-quirofano-p15"; pFin.titulo = "Daño al paciente"; fq.puntos.push(pFin);
const ap = L.avisosPuntos(fq);
t("aviso: punto en un fin", ap.some(a => a.punto === pFin.id && /fin/.test(a.texto)));
t("aviso: título que parece un efecto", ap.some(a => a.punto === pFin.id && /efecto/.test(a.texto)));
t("números de fallo", L.numsFallos("3, 5 y 7, 5").join() === "3,5,7");
const dq = L.disponer(fq);
t("iconos: uno por paso con puntos", dq.iconos.length === new Set(fq.puntos.map(x => x.pasoId)).size);
t("iconos: agrupan los números", dq.iconos.some(ic => ic.nums.length >= 2) || fq.puntos.every((x, i, l) => l.findIndex(y => y.pasoId === x.pasoId) === i));
t("iconos: dentro del lienzo", dq.iconos.every(ic => ic.x >= 0 && ic.y >= 0 && ic.x + ic.w <= dq.ancho));
t("puntos por subproceso", L.puntosPorSub(L.sanearFlujo(clon(C.EJEMPLOS.flujos.find(x => x.id === "ej-fl-radiografia")), genId, "x")).length === 3);

// ---------- Calles por turnos ----------
const dt = L.disponer(fq, { calles: "turno" });
t("turnos: Enfermería de quirófano sale dos veces, como en el curso", dt.calles.filter(c => c.nombre === "Enfermería de quirófano").length === 2);
t("turnos: sin solapes", solapes(dt).length === 0);
t("por actor: una calle por actor", L.disponer(fq).calles.filter(c => c.nombre === "Enfermería de quirófano").length === 1);

// ---------- Retoques ligeros ----------
const fa = L.sanearFlujo(clon(CONST()), genId, "x"), r0 = L.disponer(fa), p5 = fa.pasos.find(p => p.num === 5);
p5.ajuste.fila = "2";
const r1 = L.disponer(fa), filaDe = (d, num) => d.nodos.find(x => x.num === num).fila;
t("retoque: bajar dos filas", filaDe(r1, 5) === filaDe(r0, 5) + 2 && filaDe(r1, 6) === filaDe(r0, 6) + 2 && solapes(r1).length === 0);
p5.ajuste.fila = ""; const p9 = fa.pasos.find(p => p.num === 9); p9.ajuste.lado = fa.pasos.find(p => p.num === 7).id;
const r2 = L.disponer(fa);
t("retoque: al lado de otro paso (misma fila)", filaDe(r2, 9) === filaDe(r2, 7) && solapes(r2).length === 0);

// ---------- Paquete de intercambio ----------
const paq = L.paqueteIntercambio([fq, Object.assign(clon(fq), { id: "ej-otro" })], "2026.02", "2026-10-22T00:00:00Z");
t("intercambio: formato y versión", paq.formato === "flujograma-procesos" && paq.version === 1);
t("intercambio: nunca los ejemplos", paq.flujos.length === 0);
const fu2 = Object.assign(clon(fq), { id: "mio" }), paq2 = L.paqueteIntercambio([fu2], "2026.02", "x"), x0 = paq2.flujos[0];
t("intercambio: pasos con actor y subproceso resueltos", x0.pasos.every(p => typeof p.actor === "string") && x0.pasos.some(p => p.esInicio) && x0.pasos.some(p => p.esFin));
t("intercambio: puntos con número de paso", x0.puntos.every(x => x.paso == null || Number.isInteger(x.paso)));
t("intercambio: dibujo con coordenadas", x0.dibujo && x0.dibujo.nodos.length === fu2.pasos.length);
t("intercambio: se lee", L.leerIntercambio(JSON.parse(JSON.stringify(paq2))).length === 1);
t("intercambio: versión desconocida → null", L.leerIntercambio(Object.assign({}, paq2, { version: 2 })) === null);

// ---------- draw.io ----------
C.EJEMPLOS.flujos.forEach(raw => ["vertical", "horizontal"].forEach(o => {
  const fx = L.sanearFlujo(clon(raw), genId, "x"), x = D.drawio(L.disponer(fx, { orientacion: o }), { titulo: "Proceso " + fx.proceso });
  const ids = new Set([...x.matchAll(/<mxCell id="([^"]+)"/g)].map(m => m[1]));
  const refs = [...x.matchAll(/(?:parent|source|target)="([^"]+)"/g)].map(m => m[1]);
  t(`${raw.id} ${o}: draw.io con referencias válidas`, x.startsWith("<mxfile") && refs.every(r => ids.has(r)));
  t(`${raw.id} ${o}: draw.io con todos los pasos y flechas`, (x.match(/id="paso-/g) || []).length === fx.pasos.length && (x.match(/edge="1" parent="1" source/g) || []).length === L.flechas(fx).length + L.disponer(fx).uniones.length);
  t(`${raw.id} ${o}: draw.io sin caracteres sin escapar`, !/value="[^"]*[<>][^"]*"/.test(x));
}));

// ---------- Entrega 3: Traer de AMFE ----------
// Paquete real generado por la app AMFE (su ejemplo de Urgencias, con id de usuario para que el paquete lo incluya)
let LA = null, CA = null;
try { LA = require("../../../AMFE/Aplicación/logic.js"); CA = require("../../../AMFE/Aplicación/contenido.js"); } catch (e) { /* AMFE no está al lado */ }
if (LA && CA) {
  const ua = Object.assign(clon(CA.EJEMPLOS.amfes.find(x => x.id === "ej-amfe-urg")), { id: "amfe-urg" });
  const paqA = JSON.parse(JSON.stringify(LA.paqueteIntercambio([LA.sanearAmfe(ua, genId, "x")], "2026.05", "x")));
  const lA = L.leerAmfe(paqA);
  t("AMFE: se lee el paquete amfe-fallos v1", lA && lA.length === 1);
  t("AMFE: también desde la copia .json", L.leerAmfe({ app: "amfe", intercambio: paqA }).length === 1);
  t("AMFE: versión desconocida → null", L.leerAmfe(Object.assign({}, paqA, { version: 9 })) === null);
  const fA = L.nuevoFlujo(genId(), "x");
  const rA = L.traerDeAmfe(fA, lA[0], { proceso: true, actores: true, esqueleto: true, puntos: true }, genId);
  t("AMFE: 7 subprocesos con su origen", rA.subprocesos === 7 && fA.subprocesos.every(s => s.origenApp === "amfe" && s.origenId));
  t("AMFE: actores normalizados (Médico → Facultativo, técnico de rayos → Técnico de Radiología)", ["Facultativo", "Técnico de Radiología", "Enfermería de triaje", "Celador"].every(n => L.buscaActor(fA, n)) && !L.buscaActor(fA, "Médico"));
  t("AMFE: esqueleto encadenado y sin errores", rA.pasos > 10 && L.errores(fA).length === 0 && fA.pasos.every(p => p.subprocesoId || p.tipo === "terminal"));
  const nPrio = lA[0].fallos.filter(x => x.prioritario).length;
  t("AMFE: un punto crítico por fallo prioritario, en su subproceso", rA.puntos === nPrio && fA.puntos.every(x => { const p = L.pasoDe(fA, x.pasoId), fl = lA[0].fallos.find(y => String(y.num) === x.fallos[0]); return p && L.subDe(fA, p).nombre === fl.subproceso; }));
  t("AMFE: copia de los fallos para ver qué es cada número", fA.amfe.fallos.length === 49 && L.falloAmfe(fA, 10).fallo.startsWith("Omisión de constantes"));
  const rB = L.traerDeAmfe(fA, lA[0], { proceso: true, actores: true, esqueleto: true, puntos: true }, genId);
  t("AMFE: traer dos veces no duplica", rB.subprocesos === 0 && rB.actores === 0 && rB.pasos === 0 && rB.puntos === 0 && rB.esqueletoOmitido);
  t("AMFE: la copia del AMFE sobrevive al saneado", L.sanearFlujo(clon(fA), genId, "x").amfe.fallos.length === 49);
} else console.log("(sin la app AMFE al lado: se omiten las pruebas de «Traer de AMFE»)");

// ---------- Entrega 3: marco, Word y Excel ----------
const fU = L.sanearFlujo(clon(C.EJEMPLOS.flujos.find(x => x.id === "ej-fl-urgencias")), genId, "x");
const dU = L.dibujar(fU), dU0 = L.disponer(fU);
t("Urgencias: marco con estratégicos, clave y soporte", dU.marco && dU.marco.estrategicos.cajas.length === 7 && dU.marco.soporte.cajas.length === 9);
t("Urgencias: el marco no tapa el diagrama", dU.nodos.every(n => n.y > dU.marco.estrategicos.cajas[0].y + 34 && n.y + n.h < dU.marco.soporte.cajas[0].y && n.x > dU.marco.clave.x + dU.marco.clave.w));
t("Urgencias: el marco desplaza todo por igual", dU.nodos.every((n, i) => Math.abs(n.x - dU0.nodos[i].x - 46) < 0.01) && dU.ancho > dU0.ancho && dU.alto > dU0.alto);
t("Urgencias: 2 inicios y 3 destinos", fU.pasos.filter(p => L.esInicio(fU, p)).length === 2 && fU.pasos.filter(p => L.esFin(fU, p)).length === 3);
t("Urgencias: avisos con los números del Documento Final", fU.puntos.find(x => L.pasoDe(fU, x.pasoId).texto === "Triaje").fallos.join() === "8,9,10,11");
t("Urgencias: SVG con el marco", D.svg(dU).includes("PROCESOS ESTRATÉGICOS"));
const xU = D.drawio(dU, { titulo: "Urgencias" }), idsU = new Set([...xU.matchAll(/<mxCell id="([^"]+)"/g)].map(m => m[1]));
t("Urgencias: draw.io con marco y referencias válidas", xU.includes("rotation=-90") && [...xU.matchAll(/(?:parent|source|target)="([^"]+)"/g)].every(m => idsU.has(m[1])));
const Dx = require("../docx.js"), X = require("../xlsx.js");
const PNG = Uint8Array.from(Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==", "base64"));
const docU = L.documentoProceso(fU, "22/10/2026", { png: PNG, w: 2000, h: 2400, maxAlto: 22 });
t("Word: bloques con imagen, subprocesos, pasos y puntos", docU.bloques.some(b => b.t === "imagen") && docU.bloques.filter(b => b.t === "tabla").length >= 5 && !docU.horizontal);
const bytesU = Dx.construirDocx(Object.assign({ pie: "x" }, docU)), zU = Buffer.from(bytesU).toString("latin1");
t("Word: el .docx lleva la imagen y su relación", zU.includes("word/media/imagen1.png") && zU.includes('Target="media/imagen1.png"') && zU.includes('<Default Extension="png"'));
t("Word: sin imagen también funciona", Dx.construirDocx(L.documentoProceso(L.nuevoFlujo(genId(), "x"), "x", null)).length > 1000);
const hx = L.hojasExcel(fU, "22/10/2026");
t("Excel: 4 hojas", hx.hojas.map(h => h.nombre).join() === "Pasos,Puntos críticos,Subprocesos,Proceso y actores");
t("Excel: una fila por paso y por punto", hx.hojas[0].filas.length === 3 + fU.pasos.length && hx.hojas[1].filas.length === 3 + fU.puntos.length);
t("Excel: cabecera que AMFE reconoce al pegar", ["Subproceso", "Error o punto crítico"].every(c => hx.hojas[1].filas[2].some(x => x.texto === c)));
t("Excel: se construye", X.construirLibroXlsx(hx).length > 3000);
if (process.env.GUARDAR) { require("fs").writeFileSync(process.env.GUARDAR + "/prueba.docx", bytesU); require("fs").writeFileSync(process.env.GUARDAR + "/prueba.xlsx", X.construirLibroXlsx(hx)); }

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

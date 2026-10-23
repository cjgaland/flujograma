// ============================================================
//  dibujo.js — Del «dibujo» calculado por Logica.disponer a SVG · Flujograma
//  Símbolos y colores de las plantillas de draw.io del curso. El diagrama va
//  siempre sobre papel blanco (también en modo oscuro), igual que al exportar.
//  Separado de app.js para que lo pueda reutilizar el Mapa de Riesgos.
//  window.Dibujo en navegador y module.exports en Node (tests).
// ============================================================
(function (raiz) {
  "use strict";

  const COL = {
    terminal: ["#d5e8d4", "#82b366"], actividad: ["#fff2cc", "#d6b656"], decision: ["#ffe6cc", "#d79b00"],
    datos: ["#e1d5e7", "#9673a6"], documento: ["#dae8fc", "#6c8ebf"], externo: ["#f8cecc", "#b85450"]
  };
  const SI = "#008a00", NO = "#a20025", TINTA = "#1f2937", CALLE = "#d6b656", CALLE_FONDO = "#fffcf2", CALLE_CAB = "#fff2cc";
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const r1 = v => Math.round(v * 10) / 10;

  function forma(n) {
    const [rel, bor] = COL[n.tipo] || COL.actividad, { x, y, w, h } = n;
    const st = `fill="${rel}" stroke="${bor}" stroke-width="1.3"`;
    switch (n.tipo) {
      case "terminal": return `<rect x="${r1(x)}" y="${r1(y)}" width="${w}" height="${h}" rx="${Math.min(h / 2, 22)}" ${st}/>`;
      case "decision": return `<polygon points="${r1(x + w / 2)},${r1(y)} ${r1(x + w)},${r1(y + h / 2)} ${r1(x + w / 2)},${r1(y + h)} ${r1(x)},${r1(y + h / 2)}" ${st}/>`;
      case "datos": return `<polygon points="${r1(x + 14)},${r1(y)} ${r1(x + w)},${r1(y)} ${r1(x + w - 14)},${r1(y + h)} ${r1(x)},${r1(y + h)}" ${st}/>`;
      case "documento": { const b = y + h - 9; return `<path d="M${r1(x)} ${r1(y)}H${r1(x + w)}V${r1(b)}C${r1(x + w * 0.78)} ${r1(b - 12)} ${r1(x + w * 0.62)} ${r1(b - 10)} ${r1(x + w / 2)} ${r1(b)}S${r1(x + w * 0.2)} ${r1(b + 11)} ${r1(x)} ${r1(b)}Z" ${st}/>`; }
      case "externo": return `<rect x="${r1(x)}" y="${r1(y)}" width="${w}" height="${h}" ${st}/><line x1="${r1(x + 10)}" y1="${r1(y)}" x2="${r1(x + 10)}" y2="${r1(y + h)}" stroke="${bor}" stroke-width="1.3"/><line x1="${r1(x + w - 10)}" y1="${r1(y)}" x2="${r1(x + w - 10)}" y2="${r1(y + h)}" stroke="${bor}" stroke-width="1.3"/>`;
      default: return `<rect x="${r1(x)}" y="${r1(y)}" width="${w}" height="${h}" rx="2" ${st}/>`;
    }
  }
  function texto(n, tam) {
    const sube = n.tipo === "documento" ? 4 : 0, cy = n.y + n.h / 2 - sube, y0 = cy - (n.lineas.length - 1) * n.lh / 2;
    const peso = n.tipo === "terminal" ? ' font-weight="700"' : "";
    return `<text x="${r1(n.x + n.w / 2)}" text-anchor="middle" dominant-baseline="central" font-size="${tam}"${peso} fill="${TINTA}">${n.lineas.map((l, i) => `<tspan x="${r1(n.x + n.w / 2)}" y="${r1(y0 + i * n.lh)}">${esc(l)}</tspan>`).join("")}</text>`;
  }
  const camino = pts => "M" + pts.map(p => `${r1(p[0])} ${r1(p[1])}`).join("L");

  // Aviso de punto crítico: triángulo amarillo y caja roja con los números (como el mapa de riesgos del curso).
  // Opcional: `nivel` (muyalto|alto|medio|bajo) colorea la caja por IPR y `critico` le pone un borde negro grueso.
  const NIVEL_COL = { muyalto: ["#e51400", "#b20000", "#ffff00"], alto: ["#f97316", "#c2410c", "#000000"], medio: ["#facc15", "#a16207", "#000000"], bajo: ["#22c55e", "#15803d", "#000000"] };
  const colIcono = ic => NIVEL_COL[ic.nivel] || NIVEL_COL.muyalto;
  function icono(ic) {
    const { x, y, w, h } = ic, [rel, bor, letra] = colIcono(ic), borde = ic.critico ? 'stroke="#000" stroke-width="3"' : `stroke="${bor}"`;
    return `<g class="fl-icono${ic.nivel ? " fl-icono--" + ic.nivel : ""}${ic.critico ? " fl-icono--critico" : ""}" data-paso="${esc(ic.pasoId)}"><rect x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${h}" rx="2" fill="${rel}" ${borde}/><path d="M${r1(x + 12)} ${r1(y + 3)}L${r1(x + 21)} ${r1(y + h - 3)}H${r1(x + 3)}Z" fill="#ffff00" stroke="#b09500" stroke-linejoin="round"/><text x="${r1(x + 12)}" y="${r1(y + h - 6.5)}" text-anchor="middle" font-size="9" font-weight="700" fill="#000">!</text><text x="${r1(x + 26)}" y="${r1(y + h / 2)}" dominant-baseline="central" font-size="11" font-weight="700" fill="${letra}">${esc(ic.texto)}</text></g>`;
  }

  // Marco del mapa de procesos (Documento Final): estratégicos en rojo arriba, proceso clave en naranja a la izquierda, soporte en amarillo abajo
  const MARCO_COL = { est: ["#f8cecc", "#b85450"], clave: ["#ffe6cc", "#d79b00"], sop: ["#fff2cc", "#d6b656"] };
  function marcoSvg(m) {
    const p = [], caja = (b, [rel, bor], tam, peso, esp) => p.push(`<rect x="${r1(b.x)}" y="${r1(b.y)}" width="${r1(b.w)}" height="${r1(b.h)}" fill="${rel}" stroke="${bor}"/>${textoCaja(b, tam, peso, esp)}`);
    if (m.estrategicos) { caja(m.estrategicos.barra, MARCO_COL.est, 12, 700, 5); m.estrategicos.cajas.forEach(c => caja(c, MARCO_COL.est, 9.5, 700, 0)); }
    if (m.soporte) { caja(m.soporte.barra, MARCO_COL.sop, 12, 700, 5); m.soporte.cajas.forEach(c => caja(c, MARCO_COL.sop, 9.5, 700, 0)); }
    const k = m.clave, cx = k.x + k.w / 2, cy = k.y + k.h / 2;
    p.push(`<rect x="${r1(k.x)}" y="${r1(k.y)}" width="${k.w}" height="${r1(k.h)}" fill="${MARCO_COL.clave[0]}" stroke="${MARCO_COL.clave[1]}"/><text x="${r1(cx)}" y="${r1(cy)}" transform="rotate(-90 ${r1(cx)} ${r1(cy)})" text-anchor="middle" dominant-baseline="central" font-size="11.5" font-weight="700" letter-spacing="3" fill="${TINTA}">${esc(recorta(k.texto, Math.floor(k.h / 10)))}</text>`);
    return p.join("");
  }
  function textoCaja(b, tam, peso, esp) {
    const l = partirSimple(String(b.texto).toUpperCase(), Math.max(6, Math.floor(b.w / (tam * 0.68)))).slice(0, 2), y0 = b.y + b.h / 2 - (l.length - 1) * tam * 0.6;
    return `<text text-anchor="middle" dominant-baseline="central" font-size="${tam}" font-weight="${peso}"${esp ? ` letter-spacing="${esp}"` : ""} fill="${TINTA}">${l.map((x, i) => `<tspan x="${r1(b.x + b.w / 2)}" y="${r1(y0 + i * tam * 1.2)}">${esc(x)}</tspan>`).join("")}</text>`;
  }

  // opc: { marcar: Set de ids (en rojo), sel: id (resaltado), numeros: bool, titulo, accesible: bool, cabecera: texto (barra negra arriba, como el curso) }
  function svg(d, opc = {}) {
    const tam = d.letra === "grande" ? 14 : 12, numeros = opc.numeros !== false;
    const vertical = d.orientacion !== "horizontal", marcar = opc.marcar || new Set();
    const p = [], CAB = opc.cabecera ? 46 : 0, alto = d.alto + CAB;
    p.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${d.ancho} ${alto}" width="${d.ancho}" height="${alto}" font-family="Arial, Helvetica, sans-serif" role="img" aria-label="${esc(opc.titulo || "Flujograma")}">`);
    p.push(`<defs><marker id="fl-punta" viewBox="0 0 10 10" refX="9.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="${TINTA}"/></marker><marker id="fl-punta-r" viewBox="0 0 10 10" refX="9.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#e00"/></marker></defs>`);
    p.push(`<rect width="${d.ancho}" height="${alto}" fill="#fff"/>`);
    if (CAB) { const t = recorta(opc.cabecera, Math.floor((d.ancho - 40) / 8)), w = Math.min(d.ancho - 24, t.length * 8.4 + 40); p.push(`<rect x="12" y="10" width="${r1(w)}" height="28" rx="5" fill="#000"/><text x="${r1(12 + w / 2)}" y="24" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="700" fill="#fff">${esc(t)}</text><g transform="translate(0 ${CAB})">`); }
    if (d.marco) p.push(marcoSvg(d.marco));
    // Bandas de subproceso (detrás de todo)
    d.bandas.forEach(b => {
      p.push(`<rect x="${r1(b.x)}" y="${r1(b.y)}" width="${r1(b.w)}" height="${r1(b.h)}" fill="${b.color}" fill-opacity=".07" stroke="${b.color}" stroke-opacity=".45" stroke-dasharray="2 3"/>`);
      const nom = `${b.orden}. ${b.nombre || "Subproceso"}`;
      if (vertical) { const cx = b.x + d.banda / 2 - 1, cy = b.y + b.h / 2; p.push(`<rect x="${r1(b.x)}" y="${r1(b.y)}" width="${d.banda - 4}" height="${r1(b.h)}" fill="${b.color}" fill-opacity=".85"/><text x="${r1(cx)}" y="${r1(cy)}" transform="rotate(-90 ${r1(cx)} ${r1(cy)})" text-anchor="middle" dominant-baseline="central" font-size="11" font-weight="700" fill="#fff">${esc(recorta(nom, Math.floor(b.h / 6.6)))}</text>`); }
      else p.push(`<rect x="${r1(b.x)}" y="${r1(b.y)}" width="${r1(b.w)}" height="${d.banda - 4}" fill="${b.color}" fill-opacity=".85"/><text x="${r1(b.x + b.w / 2)}" y="${r1(b.y + (d.banda - 4) / 2)}" text-anchor="middle" dominant-baseline="central" font-size="11" font-weight="700" fill="#fff">${esc(recorta(nom, Math.floor(b.w / 6.6)))}</text>`);
    });
    // Calles (columnas en vertical, filas en horizontal) con el nombre del actor en la cabecera
    d.calles.forEach(c => {
      if (c.pseudo) return;
      p.push(`<rect x="${r1(c.x + 2)}" y="${r1(c.y)}" width="${r1(c.w - 4)}" height="${r1(c.h)}" rx="6" fill="${CALLE_FONDO}" fill-opacity=".35" stroke="${CALLE}" stroke-dasharray="5 4"/>`);
      if (vertical) p.push(`<rect x="${r1(c.x + 2)}" y="${r1(c.y)}" width="${r1(c.w - 4)}" height="${d.cabecera - 8}" rx="6" fill="${CALLE_CAB}" stroke="${CALLE}" stroke-dasharray="5 4"/><text x="${r1(c.x + c.w / 2)}" y="${r1(c.y + (d.cabecera - 8) / 2)}" text-anchor="middle" dominant-baseline="central" font-size="12" font-weight="700" fill="${TINTA}">${esc(recorta(c.nombre, Math.floor((c.w - 12) / 7)))}</text>`);
      else p.push(`<rect x="${r1(c.x)}" y="${r1(c.y + 2)}" width="${d.cabecera - 10}" height="${r1(c.h - 4)}" rx="6" fill="${CALLE_CAB}" stroke="${CALLE}" stroke-dasharray="5 4"/>${textoCab(c, d)}`);
    });
    // Flechas
    d.uniones.forEach(u => p.push(`<path d="${camino(u.puntos)}" fill="none" stroke="#6b7280" stroke-width="1.2" stroke-dasharray="3 3"/>`));
    d.flechas.forEach(e => {
      const ida = e.estilo === "idavuelta";
      p.push(`<path d="${camino(e.puntos)}" fill="none" stroke="${ida ? "#e00" : TINTA}" stroke-width="1.4"${ida ? ' stroke-dasharray="6 4" marker-start="url(#fl-punta-r)"' : ""} marker-end="url(#fl-punta${ida ? "-r" : ""})" stroke-linejoin="round"/>`);
    });
    // Símbolos
    d.nodos.forEach(n => {
      const halo = marcar.has(n.pasoId) ? "#dc2626" : opc.sel === n.pasoId ? "#4f46e5" : opc.nuevos && opc.nuevos.has(n.pasoId) ? "#16a34a" : opc.cambiados && opc.cambiados.has(n.pasoId) ? "#d97706" : opc.elegidos && opc.elegidos.has(n.pasoId) ? "#e51400" : "";
      p.push(`<g class="fl-nodo" data-paso="${esc(n.pasoId)}"${opc.accesible ? ` tabindex="0" role="button" aria-label="Paso ${n.num}: ${esc(n.texto)}"` : ""}>`);
      if (halo) p.push(`<rect x="${r1(n.x - 6)}" y="${r1(n.y - 6)}" width="${n.w + 12}" height="${n.h + 12}" rx="10" fill="${halo}" fill-opacity=".10" stroke="${halo}" stroke-width="2.2"/>`);
      p.push(forma(n), texto(n, tam));
      if (numeros) { const cx = r1(n.x + (n.tipo === "decision" ? n.w * 0.2 : 2)), cy = r1(n.y + (n.tipo === "decision" ? n.h * 0.14 : 2)); p.push(`<circle cx="${cx}" cy="${cy}" r="9" fill="#fff" stroke="#94a3b8"/><text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="central" font-size="9" font-weight="700" fill="#475569">${n.num}</text>`); }
      p.push(`</g>`);
    });
    // Etiquetas Sí / No encima de las flechas
    d.flechas.forEach(e => {
      if (!e.rotulo) return;
      const t = e.rotulo.texto, w = Math.max(24, t.length * 7 + 10), col = e.etiqueta === "si" ? SI : e.etiqueta === "no" ? NO : "#475569";
      p.push(`<rect x="${r1(e.rotulo.x - w / 2)}" y="${r1(e.rotulo.y - 9)}" width="${w}" height="18" rx="4" fill="${col}"/><text x="${r1(e.rotulo.x)}" y="${r1(e.rotulo.y)}" text-anchor="middle" dominant-baseline="central" font-size="11" font-weight="700" fill="#fff">${esc(t)}</text>`);
    });
    (d.iconos || []).forEach(ic => p.push(icono(ic)));
    if (CAB) p.push(`</g>`);
    p.push(`</svg>`);
    return p.join("");
  }
  function textoCab(c, d) {
    const l = partirSimple(c.nombre, 14).slice(0, 3), cx = c.x + (d.cabecera - 10) / 2, cy = c.y + c.h / 2, y0 = cy - (l.length - 1) * 7;
    return `<text text-anchor="middle" dominant-baseline="central" font-size="12" font-weight="700" fill="${TINTA}">${l.map((x, i) => `<tspan x="${r1(cx)}" y="${r1(y0 + i * 14)}">${esc(x)}</tspan>`).join("")}</text>`;
  }
  function partirSimple(s, max) {
    const l = []; let a = "";
    String(s || "").split(/\s+/).filter(Boolean).forEach(w => { if (!a) a = w; else if ((a + " " + w).length <= max) a += " " + w; else { l.push(a); a = w; } });
    if (a) l.push(a); return l;
  }
  const recorta = (s, n) => { s = String(s || ""); return n > 3 && s.length > n ? s.slice(0, n - 1) + "…" : s; };

  // Leyenda de símbolos (para la pantalla y, más adelante, para los documentos)
  function leyenda(tipos) {
    const n = tipos.length, W = 128, p = [];
    p.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${n * W} 64" width="${n * W}" height="64" font-family="Arial, Helvetica, sans-serif" role="img" aria-label="Leyenda de símbolos">`);
    tipos.forEach(([tipo, nom], i) => {
      const nodo = { tipo, x: i * W + 19, y: 6, w: 90, h: tipo === "decision" ? 38 : 30 };
      p.push(forma(nodo), `<text x="${i * W + 64}" y="56" text-anchor="middle" font-size="11" fill="${TINTA}">${esc(nom)}</text>`);
    });
    p.push(`</svg>`);
    return p.join("");
  }

  // ---------- draw.io (diagrams.net) ----------
  // XML «mxfile» sin comprimir, con los estilos de las plantillas del curso. Las calles son swimlanes y los pasos van
  // dentro (si se mueve la calle, se mueven sus pasos); las flechas van unidas a sus símbolos (si se mueve uno, la flecha le sigue).
  const ESTILO = {
    terminal: "rounded=1;whiteSpace=wrap;html=1;arcSize=40;fontStyle=1;fillColor=#d5e8d4;strokeColor=#82b366;",
    actividad: "rounded=0;whiteSpace=wrap;html=1;fillColor=#fff2cc;strokeColor=#d6b656;",
    decision: "rhombus;whiteSpace=wrap;html=1;fillColor=#ffe6cc;strokeColor=#d79b00;",
    datos: "shape=parallelogram;perimeter=parallelogramPerimeter;whiteSpace=wrap;html=1;fixedSize=1;size=14;fillColor=#e1d5e7;strokeColor=#9673a6;",
    documento: "shape=document;whiteSpace=wrap;html=1;boundedLbl=1;size=0.18;fillColor=#dae8fc;strokeColor=#6c8ebf;",
    externo: "shape=process;whiteSpace=wrap;html=1;backgroundOutline=1;size=0.07;fillColor=#f8cecc;strokeColor=#b85450;"
  };
  const xa = s => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/\n/g, "&#10;");
  const n2 = v => Math.round(v * 100) / 100;
  // opc: { titulo, numeros, id }
  function drawio(d, opc = {}) {
    const vertical = d.orientacion !== "horizontal", fs = d.letra === "grande" ? 13 : 11, DY = opc.titulo ? 50 : 0;
    const c = [], celda = x => c.push(x), geo = (x, y, w, h) => `<mxGeometry x="${n2(x)}" y="${n2(y + DY)}" width="${n2(w)}" height="${n2(h)}" as="geometry" />`;
    const ids = new Map(); let k = 0; const nid = pre => `${pre}-${++k}`;
    if (opc.titulo) celda(`<mxCell id="titulo" value="${xa(opc.titulo)}" style="text;html=1;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=1;fontStyle=1;fontSize=13;fontColor=#FFFFFF;fillColor=#000000;" vertex="1" parent="1"><mxGeometry x="12" y="10" width="${n2(Math.min(d.ancho - 24, String(opc.titulo).length * 8.4 + 40))}" height="30" as="geometry" /></mxCell>`);
    // Marco del mapa de procesos
    if (d.marco) {
      const m = d.marco, est = ([rel, bor], tam, extra = "") => `rounded=0;whiteSpace=wrap;html=1;fontStyle=1;fontSize=${tam};fillColor=${rel};strokeColor=${bor};${extra}`;
      [[m.estrategicos, MARCO_COL.est], [m.soporte, MARCO_COL.sop]].forEach(([g, col]) => { if (!g) return;
        celda(`<mxCell id="${nid("marco")}" value="${xa(g.barra.texto.split("").join(" "))}" style="${est(col, 12)}" vertex="1" parent="1">${geo(g.barra.x, g.barra.y, g.barra.w, g.barra.h)}</mxCell>`);
        g.cajas.forEach(c => celda(`<mxCell id="${nid("marco")}" value="${xa(String(c.texto).toUpperCase())}" style="${est(col, 10)}" vertex="1" parent="1">${geo(c.x, c.y, c.w, c.h)}</mxCell>`)); });
      const k = m.clave;
      celda(`<mxCell id="${nid("marco")}" value="${xa(k.texto)}" style="${est(MARCO_COL.clave, 11, "rotation=-90;")}" vertex="1" parent="1">${geo(k.x + k.w / 2 - k.h / 2, k.y + k.h / 2 - k.w / 2, k.h, k.w)}</mxCell>`);
    }
    // Bandas de subproceso (detrás)
    d.bandas.forEach(b => {
      celda(`<mxCell id="${nid("banda")}" value="" style="rounded=0;whiteSpace=wrap;html=1;fillColor=${b.color};opacity=8;strokeColor=${b.color};dashed=1;dashPattern=2 3;" vertex="1" parent="1">${geo(b.x, b.y, b.w, b.h)}</mxCell>`);
      const nom = xa(`${b.orden}. ${b.nombre || "Subproceso"}`), est = `text;html=1;align=center;verticalAlign=middle;whiteSpace=wrap;fontStyle=1;fontSize=11;fontColor=#FFFFFF;fillColor=${b.color};`;
      if (vertical) celda(`<mxCell id="${nid("banda-t")}" value="${nom}" style="${est}rotation=-90;" vertex="1" parent="1">${geo(b.x + (d.banda - 4) / 2 - b.h / 2, b.y + b.h / 2 - (d.banda - 4) / 2, b.h, d.banda - 4)}</mxCell>`);
      else celda(`<mxCell id="${nid("banda-t")}" value="${nom}" style="${est}" vertex="1" parent="1">${geo(b.x, b.y, b.w, d.banda - 4)}</mxCell>`);
    });
    // Calles
    const padre = new Map();
    d.calles.forEach(cl => {
      if (cl.pseudo) return;
      const id = nid("calle"); padre.set(cl, id);
      const est = `swimlane;html=1;startSize=${vertical ? d.cabecera - 8 : d.cabecera - 10};rounded=1;dashed=1;fillColor=#fff2cc;swimlaneFillColor=none;strokeColor=#d6b656;fontSize=12;${vertical ? "" : "horizontal=0;"}`;
      if (vertical) celda(`<mxCell id="${id}" value="${xa(cl.nombre)}" style="${est}" vertex="1" parent="1">${geo(cl.x + 2, cl.y, cl.w - 4, cl.h)}</mxCell>`);
      else celda(`<mxCell id="${id}" value="${xa(cl.nombre)}" style="${est}" vertex="1" parent="1">${geo(cl.x, cl.y + 2, cl.w, cl.h - 4)}</mxCell>`);
    });
    // En qué calle cae un punto (para hacer al símbolo hijo de su calle)
    const calleDe = n => d.calles.find(cl => !cl.pseudo && n.x >= cl.x && n.x + n.w <= cl.x + cl.w && n.y >= cl.y && n.y + n.h <= cl.y + cl.h);
    const colocar = (n, x, y, w, h) => { const cl = calleDe(n), pid = cl ? padre.get(cl) : "1", ox = cl ? (vertical ? cl.x + 2 : cl.x) : 0, oy = cl ? (vertical ? cl.y : cl.y + 2) + DY : 0; return { pid, g: `<mxGeometry x="${n2(x - ox)}" y="${n2(y + DY - oy)}" width="${n2(w)}" height="${n2(h)}" as="geometry" />` }; };
    d.nodos.forEach(n => {
      const id = nid("paso"); ids.set(n.pasoId, id);
      const { pid, g } = colocar(n, n.x, n.y, n.w, n.h);
      celda(`<mxCell id="${id}" value="${xa(n.texto)}" style="${ESTILO[n.tipo] || ESTILO.actividad}fontSize=${fs};" vertex="1" parent="${pid}">${g}</mxCell>`);
      if (opc.numeros !== false) {
        const cx = n.tipo === "decision" ? n.x + n.w * 0.2 : n.x + 2, cy = n.tipo === "decision" ? n.y + n.h * 0.14 : n.y + 2, q = colocar(n, cx - 9, cy - 9, 18, 18);
        celda(`<mxCell id="${nid("num")}" value="${n.num}" style="ellipse;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#94A3B8;fontSize=9;fontStyle=1;fontColor=#475569;" vertex="1" parent="${q.pid}">${q.g}</mxCell>`);
      }
    });
    const caja = new Map(d.nodos.map(n => [n.pasoId, n]));
    const puerto = (pt, n) => { const rx = Math.max(0, Math.min(1, (pt[0] - n.x) / n.w)), ry = Math.max(0, Math.min(1, (pt[1] - n.y) / n.h)); return [n2(rx), n2(ry)]; };
    d.flechas.forEach(e => {
      const A = caja.get(e.de), B = caja.get(e.a), pts = e.puntos, id = nid("flecha");
      const [ex, ey] = puerto(pts[0], A), [nx, ny] = puerto(pts[pts.length - 1], B);
      const ida = e.estilo === "idavuelta";
      const est = `edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;exitX=${ex};exitY=${ey};exitDx=0;exitDy=0;entryX=${nx};entryY=${ny};entryDx=0;entryDy=0;${ida ? "dashed=1;strokeColor=#FF0000;startArrow=classic;startFill=1;" : ""}endArrow=classic;endFill=1;`;
      const medio = pts.slice(1, -1).map(q => `<mxPoint x="${n2(q[0])}" y="${n2(q[1] + DY)}" />`).join("");
      celda(`<mxCell id="${id}" value="" style="${est}" edge="1" parent="1" source="${ids.get(e.de)}" target="${ids.get(e.a)}"><mxGeometry relative="1" as="geometry">${medio ? `<Array as="points">${medio}</Array>` : ""}</mxGeometry></mxCell>`);
      if (e.rotulo) {
        const col = e.etiqueta === "si" ? "#008a00" : e.etiqueta === "no" ? "#a20025" : "#475569";
        celda(`<mxCell id="${nid("rotulo")}" value="${xa(e.rotulo.texto)}" style="edgeLabel;html=1;align=center;verticalAlign=middle;resizable=0;points=[];fontStyle=1;fontSize=11;fontColor=#FFFFFF;labelBackgroundColor=${col};" vertex="1" connectable="0" parent="${id}"><mxGeometry x="-0.7" relative="1" as="geometry"><mxPoint as="offset" /></mxGeometry></mxCell>`);
      }
    });
    d.uniones.forEach(u => celda(`<mxCell id="${nid("union")}" value="" style="endArrow=none;html=1;rounded=0;dashed=1;strokeColor=#6B7280;" edge="1" parent="1" source="${ids.get(u.de)}" target="${ids.get(u.a)}"><mxGeometry relative="1" as="geometry" /></mxCell>`));
    (d.iconos || []).forEach(ic => {
      const [rel, bor, letra] = colIcono(ic);
      celda(`<mxCell id="${nid("aviso")}" value="${xa(ic.texto)}" style="rounded=0;whiteSpace=wrap;html=1;fillColor=${rel};strokeColor=${ic.critico ? "#000000" : bor};${ic.critico ? "strokeWidth=3;" : ""}fontColor=${letra};fontStyle=1;fontSize=10;align=right;spacingRight=4;" vertex="1" parent="1">${geo(ic.x, ic.y, ic.w, ic.h)}</mxCell>`);
      celda(`<mxCell id="${nid("aviso-t")}" value="" style="triangle;direction=north;whiteSpace=wrap;html=1;fillColor=#FFFF00;strokeColor=#B09500;" vertex="1" parent="1">${geo(ic.x + 3, ic.y + 3, 18, ic.h - 6)}</mxCell>`);
    });
    const ancho = Math.ceil(d.ancho), alto = Math.ceil(d.alto + DY);
    return `<mxfile host="app.diagrams.net" agent="Flujograma" version="24.0.0">\n  <diagram name="${xa(opc.titulo || "Flujograma")}" id="${xa(opc.id || "flujograma")}">\n    <mxGraphModel dx="${ancho}" dy="${alto}" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="${ancho}" pageHeight="${alto}" math="0" shadow="0">\n      <root>\n        <mxCell id="0" />\n        <mxCell id="1" parent="0" />\n        ${c.join("\n        ")}\n      </root>\n    </mxGraphModel>\n  </diagram>\n</mxfile>\n`;
  }

  // Hoja en blanco para dibujar en papel (mejora J): calles vacías con su nombre
  function callesEnBlanco(nombres, ancho = 1000, alto = 560) {
    const n = Math.max(1, nombres.length), w = (ancho - 20) / n, p = [];
    p.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${ancho} ${alto}" width="${ancho}" height="${alto}" font-family="Arial, Helvetica, sans-serif" role="img" aria-label="Calles en blanco">`, `<rect width="${ancho}" height="${alto}" fill="#fff"/>`);
    for (let i = 0; i < n; i++) {
      const x = 10 + i * w;
      p.push(`<rect x="${r1(x + 2)}" y="10" width="${r1(w - 4)}" height="${alto - 20}" rx="6" fill="none" stroke="${CALLE}" stroke-dasharray="5 4"/><rect x="${r1(x + 2)}" y="10" width="${r1(w - 4)}" height="26" rx="6" fill="${CALLE_CAB}" stroke="${CALLE}" stroke-dasharray="5 4"/>`);
      if (nombres[i]) p.push(`<text x="${r1(x + w / 2)}" y="23" text-anchor="middle" dominant-baseline="central" font-size="12" font-weight="700" fill="${TINTA}">${esc(recorta(nombres[i], Math.floor((w - 12) / 7)))}</text>`);
    }
    p.push(`</svg>`);
    return p.join("");
  }

  const API = { svg, leyenda, drawio, callesEnBlanco, COLORES: COL, NIVEL_COL };
  if (typeof module !== "undefined" && module.exports) module.exports = API;
  else raiz.Dibujo = API;
})(typeof window !== "undefined" ? window : this);

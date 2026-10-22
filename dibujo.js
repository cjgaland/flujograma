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

  // opc: { marcar: Set de ids (en rojo), sel: id (resaltado), numeros: bool, titulo, accesible: bool }
  function svg(d, opc = {}) {
    const tam = d.letra === "grande" ? 14 : 12, numeros = opc.numeros !== false;
    const vertical = d.orientacion !== "horizontal", marcar = opc.marcar || new Set();
    const p = [];
    p.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${d.ancho} ${d.alto}" width="${d.ancho}" height="${d.alto}" font-family="Arial, Helvetica, sans-serif" role="img" aria-label="${esc(opc.titulo || "Flujograma")}">`);
    p.push(`<defs><marker id="fl-punta" viewBox="0 0 10 10" refX="9.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="${TINTA}"/></marker><marker id="fl-punta-r" viewBox="0 0 10 10" refX="9.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#e00"/></marker></defs>`);
    p.push(`<rect width="${d.ancho}" height="${d.alto}" fill="#fff"/>`);
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
      const halo = marcar.has(n.pasoId) ? "#dc2626" : opc.sel === n.pasoId ? "#4f46e5" : "";
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

  const API = { svg, leyenda, COLORES: COL };
  if (typeof module !== "undefined" && module.exports) module.exports = API;
  else raiz.Dibujo = API;
})(typeof window !== "undefined" ? window : this);

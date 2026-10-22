# CLAUDE.md — Flujograma

> Documento común a todas las apps (lista, carpetas, identidad visual e intercambio de datos): `/Users/Trabajo/Desktop/Ecosistema Calidad/ECOSISTEMA.md`.

Guía de referencia para el desarrollo asistido por IA. Léela antes de proponer cambios. Responder siempre en español y en lenguaje claro (el autor no es programador). El diseño completo, las decisiones del autor y el plan por entregas están en `/Users/Trabajo/Desktop/Flujograma/Diseño/DISEÑO_FLUJOGRAMA.md` (léelo también al empezar una sesión).

## 1. Descripción
PWA estática (sin build, sin dependencias, sin CDN) para **dibujar cualquier proceso sanitario como un flujograma sin saber dibujar**: se escriben los pasos (tipo, quién lo hace, a qué paso sigue) y la app dibuja sola el diagrama en SVG con los símbolos normalizados del curso, por **calles de actores** y agrupado por **subprocesos**. Después (entrega 2) se marcan encima los **puntos críticos**. Nace del curso «Elaboración de Mapas de Riesgo en Procesos Sanitarios» (material en `/Users/Trabajo/Desktop/Mapa de Riesgos/Curso Mapa de Riesgo/`). Herramienta docente y de apoyo.

Es una **herramienta** del ecosistema (funciona sola) y la pieza visual de la futura superaplicación **Mapa de Riesgos**. Hermana de AMFE, Auditorías, Indicadores y Tamaño Muestral: mismos tokens CSS, modo claro/oscuro, modales, SW network-first con aviso «Actualizar».

Autoría (idéntica en el pie de index.html, «Acerca de» y el README; orden alfabético, sin centro de trabajo): Carlos J. Galán Doval (Médico de Familia · Técnico en Calidad y Seguridad del Paciente) y Rafael J. Romero de Castilla Gil (Médico de Familia · Responsable del Área de Calidad y Seguridad del Paciente), Área de Gestión Sanitaria Sur de Córdoba · Andalucía.

## 2. Arquitectura
Base copiada de `AMFE/Aplicación` (mismos patrones). Archivos:
- `index.html` — esqueleto, cabecera, nav, franja de ejemplo, modales (bienvenida, Acerca de, novedades, confirmar), `<input type=file>` para importar.
- `styles.css` — copiado de AMFE con el **acento cambiado a índigo** (la variable sigue llamándose `--cyan`: claro `#4f46e5`, oscuro `#818cf8`, texto sobre acento en oscuro `#13113a`, impreso `#3730a3`). Bloque final «Componentes propios de Flujograma»: `.tipo-chip`/`.tipo--<tipo>` (forma y color de cada símbolo), `.tipos`/`.tipo-btn`, `.actor-fila`, `.paso-card`, `.sal-fila` (Sí verde `#008a00`, No granate `#a20025`), `.lienzo` (visor del dibujo, siempre fondo blanco), `.panel-paso`, `.leyenda-wrap`. Quedan reglas heredadas de AMFE sin usar.
- `logic.js` — funciones PURAS (`window.Logica` / `module.exports`): `PASOS` (6, con la entrega en que se activa cada uno), `TIPOS` (6 símbolos con los colores de las plantillas draw.io del curso), `ACTORES_SUG`, fábricas (`nuevoFlujo`, `nuevoActor`, `nuevoSubproceso`, `nuevoPaso`, `nuevaFlecha`, `nuevoPunto`), grafo (`flechas`, `entradas`, `papelTerminal` = inicio si nadie apunta a él y fin si no apunta a nadie, `anexoDe`, `alcanzables`, `llegaAFin`), **validador** (`avisosProceso`, `avisosActores`, `avisosPasos`, `errores`, `rolesSinCalle`), progreso y «tu siguiente paso», **escritura rápida** (`adivinarActor`, `leerLista`, `leerTabla`, `leerPegado` decide lista o tabla, `incorporarPasos`), edición del encadenado (`insertarDespues`, `quitarPaso` reengancha, `cambiarTipo`, `ponerSalida`), **colocación** (`medida`, `partir`, **`disponer(flujo, opc)`** → objeto `dibujo`, ver 2.1), saneado por esquema (`ESQ` + `sanear`, `sanearFlujo`, `sanearDatos`) y `fusionar`.
- `dibujo.js` — `window.Dibujo.svg(dibujo, { marcar, sel, numeros, titulo, accesible })` y `leyenda(tipos)`. Separado para que lo reutilice Mapa de Riesgos. Cada símbolo es `<g class="fl-nodo" data-paso="id">`.
- `contenido.js` — solo datos: `TEMAS` (Aprende, 5 temas; un `<div data-leyenda>` se sustituye por la leyenda), `GLOSARIO`, `EJEMPLOS` (`flujos` construidos con `miniFlujo`, `fichas`, `proximos`). Ejemplos: toma de constantes (`ej-fl-constantes`) y radiografía simple (`ej-fl-radiografia`, con 3 subprocesos), soluciones del ejercicio 5.
- `app.js` — UI: datos, enrutado, inicio, lista, asistente (`RENDER` = pasos construidos; el resto `pasoProximo`), visor con zoom (botones, Ctrl+rueda, pellizco), panel del paso tocado en el dibujo, Aprende, ejemplos, glosario, copia/importar, tema, modales, SW. `ENTREGA` = pasos disponibles.
- `sw.js` — network-first; sin `skipWaiting` al instalar.
- `docx.js`, `xlsx.js` — copiados de AMFE (color índigo) y **aún sin usar** (Word y Excel llegan en la entrega 3; no están en el SW ni en index.html).
- `tests/logic.test.mjs` — `node tests/logic.test.mjs`.

### 2.1 Colocación automática (`disponer`)
Ejes abstractos: `v` = sentido del proceso (filas), `u` = ancho (calles). En vertical x = u, y = v; en horizontal al revés. Pasos: 1) búsqueda en profundidad desde los inicios para marcar las flechas que vuelven atrás; 2) filas por camino más largo, con los subprocesos seguidos (`fila ≥ inicio de la banda`) y lo pegado (`con`) en la fila de su actividad; 3) calles: `_in` (inicios sin actor), una por actor en el orden de `f.actores`, `_sin` (sin asignar), `_ext` (procesos externos sin actor), `_out` (fines sin actor); 4) huecos dentro de cada calle: bajo su paso anterior, el Sí antes que el No; 5) medidas (el rombo se ensancha con palabras largas); 6) rutas ortogonales por pasillos entre filas y canales entre huecos (en una decisión sigue recta la rama cuyo destino está debajo; las vueltas atrás salen por un lado y suben por el canal) y se apartan unos píxeles los tramos que coinciden. Resultado: `{ version, orientacion, letra, ancho, alto, cabecera, banda, calles, bandas, nodos, flechas: [{ de, a, etiqueta, estilo, atras, anexo, puntos, rotulo }], uniones, iconos }`. Determinista (tests).

### Rutas (hash)
`#/` inicio · `#/flujo` mis flujogramas · `#/flujo/nuevo` (crea un borrador y redirige) · `#/flujo/<id>` (primer paso pendiente) · `#/flujo/<id>/<1-6>` · `#/ejemplos` · `#/aprende[/<1-5>]` · `#/glosario`.

### Datos
- `localStorage["flujograma-datos"]` = `{ app: "flujograma", v, ultimaCopia, flujos: [] }`. Guardado con 250 ms de retardo y al salir (`pagehide`).
- Al cargar e importar se pasa SIEMPRE por `sanearDatos`. **Al añadir un campo**: fábrica (`nuevoX`) + `ESQ`. Regla `"b"`: si falta, se queda el valor de la fábrica (no `false`).
- Flujo: `{ id, titulo, proceso, unidad, objetivo, inicio, fin, incluye, excluye, responsable, fecha, actores: [{ id, nombre }], subprocesos: [{ id, nombre, descripcion, inicio, fin, roles, color: "0"–"7", origenApp, origenId }], pasos: [{ id, num, tipo: terminal|actividad|decision|datos|documento|externo, texto, actorId, subprocesoId, siguientes: [{ a, etiqueta: ""|si|no|texto, estilo: normal|idavuelta }], con, nota, ajuste: { fila, lado } }], puntos: [{ id, num, pasoId, titulo, descripcion, fallos: [nº AMFE], origen }], vista: { orientacion, calles, subprocesos, letra, numeros, marco }, marco: { estrategicos, soporte }, validado (AAAA-MM-DD), edicion, anteriorId, tipoEdicion, control, notas, creado, modificado }`. El orden de `actores` es el de las calles; el de `pasos`, el de la tabla. `num` es fijo (el que sale en el dibujo).
- Enlaces en la UI: campos del flujo `data-k`; actores `data-ac` + `data-f`; subprocesos `data-s` + `data-f`; pasos `data-pa` + `data-f`; salidas `data-sal` + `data-c` (`si`, `no` o índice). Al escribir se refresca sin perder el foco (`refrescar`: zonas `data-zona`, avisos `data-zav`, cabeceras de las tarjetas y, en el paso 4, el SVG con 150 ms de retardo); los cambios de estructura repintan conservando el scroll (`repintar`), y en el paso 4 `seleccionar(id)` repinta solo el dibujo y el panel.
- Borradores: un flujograma nuevo vive en `borradores` hasta que se escribe algo (`esVacio`).
- Ejemplos: en memoria, ids `ej-…`; «Copiar a mis datos» rehace todos los ids. Nunca se importa un id `ej-`.
- Copia `.json` (en iOS, Compartir) y aviso en la portada si no hay copia o tiene más de 30 días. Importar: añadir (fusiona, gana el más reciente) o sustituir (doble confirmación).
- Aún NO hay paquete de intercambio: `flujograma-intercambio` (formato `flujograma-procesos` v1, Diseño 7.3) llega en la entrega 2.

## 3. Decisiones del autor (2026-10-22)
- Diseño aprobado con las **mejoras A–K**. Flujograma **guiado** (tabla → dibujo), no editor libre.
- **Una calle por actor** por defecto (opción «por turnos, como el curso» pendiente). Acento **índigo**. **Retoques ligeros + draw.io** (sin arrastre libre).
- Heredadas: en pantalla no se menciona el curso (solo en «Acerca de» y en las notas de los ejemplos, que dicen «solución del ejercicio 5 del curso»); sin nombres de centro ni de personas; trabajo en equipo con la copia `.json`; lenguaje inclusivo neutro.
- Por defecto (sin respuesta expresa): nombre visible «Flujograma · Diagramas de flujo de procesos», repositorio `cjgaland/flujograma`.

## 4. Entorno y pruebas
- Node v26. `node tests/logic.test.mjs` (123 comprobaciones en la entrega 1).
- Servir: `cd "/Users/Trabajo/Desktop/Flujograma/Aplicación" && python3 -m http.server 8769` (en segundo plano) y abrir la vista previa `app-flujograma` de `/Users/Trabajo/Desktop/Flujograma/.claude/launch.json`.
- Revisar en escritorio y en móvil (360 px: `document.documentElement.scrollWidth === 360`) y en modo oscuro. El dibujo se puede pasar a PNG para mirarlo con `qlmanage -t -s 1400 -o <carpeta> archivo.svg`.
- Iconos: `icon-512.svg` → `qlmanage -t -s 512` y tamaños con `sips -z`.

## 5. Versiones
- `APP_VERSION` y `NOVEDADES` al principio de `app.js` (AAAA.NN, la más reciente arriba). Claves: `flujograma-datos`, `flujograma-tema`, `flujograma-bienvenida-vista`, `flujograma-version-vista`, `flujograma-facil-abierto`.

## 6. Copias de seguridad locales
```
Desktop/Flujograma/
├── Aplicación/   ← la app (este repositorio git, lo que se publica)
├── Backup/       ← 5 copias más recientes, fuera del repositorio
└── Diseño/       ← DISEÑO_FLUJOGRAMA.md
```
`bash ~/.claude/skills/app-copia_seguridad/scripts/copia_seguridad.sh --root "/Users/Trabajo/Desktop/Flujograma" --name Flujograma --exclude "Curso*" --exclude "Documentos*" --exclude "*.docx" --exclude .claude`. Hacer una antes de cada publicación.

## 7. Publicación
Sin publicar. Solo cuando el autor lo pida: repositorio público `cjgaland/flujograma`, GitHub Pages desde `main` (raíz). Pasos por versión: copia de seguridad; `NOVEDADES` + `APP_VERSION`; mismos `?v=` en index.html; subir `CACHE_NAME` en sw.js; tests; commit en español terminado en `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`; push.

## 8. Estado y pendiente
- **Entrega 1 (hecha, 2026-10-22, v2026.01)**: esqueleto e identidad (índigo, icono); datos y copias; pasos 1 (proceso), 2 (actores y subprocesos), 3 (tarjetas de pasos, escritura rápida de lista o tabla, validador) y 4 (dibujo SVG automático vertical u horizontal, zoom, panel del paso tocado, validación con el equipo); ejemplos de toma de constantes y radiografía; Aprende temas 1–5; glosario; 123 tests.
- **Entrega 2**: paso 5 (puntos críticos, propuestas, iconos numerados), imagen PNG/SVG, PDF, **draw.io**, paquete `flujograma-procesos` v1, retoques ligeros (`ajuste`), calles por turnos, los otros 3 ejemplos del ejercicio 5.
- Entregas 3 y 4: ver el diseño (sección 13).

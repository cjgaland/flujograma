# Flujograma

PWA estática (HTML/CSS/JS puro, sin dependencias ni CDN, funciona sin conexión) para **dibujar cualquier proceso sanitario como un diagrama de flujo sin saber dibujar**: se escriben los pasos, quién los hace y qué viene después, y la app dibuja el flujograma con los símbolos normalizados, por calles de actores y por subprocesos.

Seis pasos:

1. El proceso: dónde empieza, dónde acaba y para qué sirve.
2. Actores (cada uno, una calle del dibujo) y subprocesos.
3. Los pasos: tipo, quién lo hace y a qué paso sigue. Se puede pegar una lista o una tabla de Excel.
4. El dibujo, que se revisa y se valida con el equipo.
5. Puntos críticos, con propuestas de dónde buscarlos y avisos numerados sobre el dibujo.
6. Imagen (PNG, SVG), PDF, Word, Excel y archivo de draw.io para retocarlo.

- Validador de los errores habituales: sin inicio o sin fin, callejones sin salida, decisiones sin Sí o sin No…
- **Aprende**, **glosario** y **ejemplos**: la atención en Urgencias (con el marco de procesos y los fallos del AMFE) y los cinco procesos del ejercicio 5 del curso, con sus puntos críticos.
- «Traer de AMFE»: el proceso, los subprocesos, quién interviene y los fallos prioritarios como puntos críticos.
- Paquete «flujograma-procesos» para que AMFE y Mapa de Riesgos puedan traer el flujograma.

Los datos se guardan solo en el dispositivo; para trabajar en equipo se comparte la copia de seguridad.

Hermana de [AMFE](https://cjgaland.github.io/amfe/), [Auditorías](https://cjgaland.github.io/auditorias/), [Indicadores](https://cjgaland.github.io/indicadores-calidad/) y [Tamaño Muestral](https://cjgaland.github.io/tamano-muestral/).

## Uso
Servir la carpeta y abrir `index.html`:

    python3 -m http.server 8769

Tests de la lógica:

    node tests/logic.test.mjs

Documentación técnica y decisiones: ver `CLAUDE.md`.

Aplicación desarrollada por:

- **Carlos J. Galán Doval** · Médico de Familia · Técnico en Calidad y Seguridad del Paciente
- **Rafael J. Romero de Castilla Gil** · Médico de Familia · Responsable del Área de Calidad y Seguridad del Paciente

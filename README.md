# Flujograma

PWA estática (HTML/CSS/JS puro, sin dependencias ni CDN, funciona sin conexión) para **dibujar cualquier proceso sanitario como un diagrama de flujo sin saber dibujar**: se escriben los pasos, quién los hace y qué viene después, y la app dibuja el flujograma con los símbolos normalizados, por calles de actores y por subprocesos.

Seis pasos (en esta versión, del 1 al 4):

1. El proceso: dónde empieza, dónde acaba y para qué sirve.
2. Actores (cada uno, una calle del dibujo) y subprocesos.
3. Los pasos: tipo, quién lo hace y a qué paso sigue. Se puede pegar una lista o una tabla de Excel.
4. El dibujo, que se revisa y se valida con el equipo.
5. Puntos críticos (próximamente).
6. Imagen, PDF, Word, draw.io y Excel (próximamente).

- Validador de los errores habituales: sin inicio o sin fin, callejones sin salida, decisiones sin Sí o sin No…
- **Aprende**, **glosario** y **ejemplos** del curso (toma de constantes y petición de radiografía).

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

# Laboratorio de Integración Numérica

Aplicación educativa responsive con HTML, CSS y JavaScript modular (ES modules), sin backend. Incluye POO para problemas con función y datos tabulados; clases `TrapecioCompuesto`, `Simpson13` y `Simpson38`; tabla de pesos; gráficas Plotly; animaciones autónomas; y curva log-log del error cuando se indica una referencia.

## Ejecutar

Como usa módulos JavaScript, abre la carpeta con un servidor HTTP local, no con `file://`.

1. Instala Python 3 si no lo tienes.
2. En una terminal, entra a esta carpeta.
3. Ejecuta `python -m http.server 8000`.
4. Abre `http://localhost:8000`.

También puedes abrir la carpeta en VS Code y usar Live Server. Se necesita conexión a internet para cargar Plotly.js, MathJax y la fuente web.

## Funcionalidades

- Modo función: expresión `f(x)`, límites `a`, `b`, subintervalos `n`, unidades y referencia opcional.
- Modo tabulado: edición de pares `x,y` y ejercicios precargados 19, 20, 21 y 27 del solucionario proporcionado.
- Validación de datos numéricos, x estrictamente creciente, espaciamiento uniforme y condiciones de Simpson.
- Resultados con al menos cinco decimales, factores exteriores y tabla de pesos.
- Tres gráficos de aproximación independientes, con refinamiento animado de la partición para funciones.
- Curva de error absoluto frente a n en ejes logarítmicos, solo cuando se proporciona una referencia.

## Estructura

- `index.html`: estructura de la interfaz.
- `css/styles.css`: estilos y diseño responsive.
- `js/models.js`: `FunctionProblem`, `TabulatedProblem` y parser matemático.
- `js/integration.js`: clases de integración y Simpson combinado.
- `js/presets.js`: tablas precargadas de ejercicios.
- `js/app.js`: eventos, renderizado, gráficos y animaciones.

## Expresiones admitidas

Aritmética `+ - * / ^`, paréntesis, multiplicación implícita (`2x`), `pi`, `e` y funciones `sin`, `cos`, `tan`, `asin`, `acos`, `atan`, `sqrt`, `abs`, `exp`, `log`, `ln`, `log10`, `floor`, `ceil`. Usa `x^2` para elevar al cuadrado.

## Prueba mínima

En modo función, `f(x)=x^2`, `a=0`, `b=2`, `n=8`, referencia `2.666666666666667`. Simpson 1/3 debe dar `2.66666667`; Simpson 3/8 también es aplicable con n=9 o n=6, no con n=8. Trapecio con n=8 da `2.6875`. Para la verificación exacta, prueba `n=6` (Simpson 1/3 y 3/8 válidos) o `n=12`.

## Consideraciones académicas

- Los datos de los ejercicios 19, 20, 21 y 27 se precargan como aparecen en el documento aportado. Las unidades y conversiones físicas específicas de cada ejercicio deben revisarse en el informe; la aplicación integra los valores y muestra la unidad escrita por quien la usa.
- El ejercicio 27 usa diámetro en la tabla del solucionario. La integral de volumen exige `π(d/2)^2`; para reproducir ese problema físico debe transformarse el dato, no integrar directamente el diámetro.
- El ejercicio 19 necesita dividir la integral velocidad-tiempo por 3600 para expresar distancia en millas si el tiempo está en segundos y la velocidad en mi/h.
- El ejercicio 21 tiene diez nodos y nueve subintervalos: no es válido aplicar Simpson 1/3 o 3/8 puro sobre todos los subintervalos. Para reglas combinadas, utiliza `combinedSimpson` desde `integration.js` con una partición compatible o añade una opción de combinación a la interfaz.
- El error porcentual no se define cuando la referencia es cero. Sin referencia, la gráfica de error verdadero se omite.

## Bibliografía base para citar en el informe

El documento de la asignación aporta las fórmulas de trapecio compuesto, Simpson 1/3, Simpson 3/8 y error absoluto/porcentual. Para sustentar teóricamente el informe, consulta una edición disponible de:

- Burden, R. L., Faires, J. D. y Burden, A. M., *Numerical Analysis*, Cengage Learning. Capítulos de integración numérica y estimación del error.
- Atkinson, K. E., *An Introduction to Numerical Analysis*, Wiley. Integración numérica y fórmulas de Newton–Cotes.
- Springer Nature, “Computing Integrals”, capítulo 3 de un texto de métodos numéricos. Expone la derivación de la regla trapezoidal compuesta: https://link.springer.com/chapter/10.1007/978-3-319-32428-9_3
- OpenStax, *Calculus Volume 2*, sección 3.6 “Numerical Integration”. Presenta Simpson compuesto y una cota del error: https://openstax.org/books/calculus-volume-2/pages/3-6-numerical-integration
- UNED, “Métodos Numéricos”, módulo 4. Recurso en español con las reglas y sus expresiones de error: https://multimedia.uned.ac.cr/pem/metodos_numericos_ensenanza/modulo4/descripcion.html

Comprueba los metadatos bibliográficos completos de la fuente Springer (autor, título del libro, editor y año) al abrir el capítulo; no atribuyas autoría ni páginas sin verificarlas. La fórmula de error absoluto/porcentual usada en la interfaz también aparece en la guía de la asignación.

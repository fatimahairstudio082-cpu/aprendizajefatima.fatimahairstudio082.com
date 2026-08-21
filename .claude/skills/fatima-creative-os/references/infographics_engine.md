# infographics_engine

Infografías, diagramas y visualización de datos. Convierte información en algo
que se **entiende de un vistazo** y, cuando hace falta, se anima.

## Qué genera

Diagramas, procesos, flujos, timelines, comparaciones, rankings, estadísticas,
barras, porcentajes, gráficos de círculo/dona, mapas conceptuales, pasos
numerados, dashboards y visualizaciones de datos.

## Reglas de claridad

- **Un mensaje por gráfico.** El dato clave debe saltar primero. Si un gráfico
  cuenta tres cosas, probablemente son tres gráficos.
- **La forma sigue al dato.** Comparar magnitudes → barras; evolución → línea;
  parte del todo → dona/apilado (con pocos segmentos); proceso → flujo con
  dirección clara; relación → mapa conceptual.
- **Menos tinta, más señal.** Fuera rejillas pesadas, 3D decorativo en gráficos,
  leyendas redundantes. Etiqueta directamente cuando puedas.
- **Jerarquía numérica.** El número protagonista grande; el contexto, pequeño.
- **Color con función.** El color codifica (categoría, bueno/malo), no decora.
  Contraste suficiente y accesible.
- **Honestidad.** Ejes desde cero en barras; escalas coherentes; nada que
  exagere o engañe.

## Animación de datos

Los elementos pueden animarse (coordina con `motion_engine` y `timeline_engine`):

- Barras que **crecen** desde la base; líneas que se **dibujan**; contadores que
  **suben** hasta la cifra; donas que se **rellenan**; pasos que aparecen en
  **stagger** al ritmo de la narración.
- La animación debe **revelar** la información en el orden en que se cuenta, no
  distraer de ella. Un dato ya visible no necesita seguir moviéndose.

## Herramienta

Para datos, `tool_selector` suele apuntar a SVG (nítido, animable, ligero) o
Canvas para volúmenes grandes de puntos. Reserva WebGL/3D solo si el 3D aporta
significado, no espectáculo.

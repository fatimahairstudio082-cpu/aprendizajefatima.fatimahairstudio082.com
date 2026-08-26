# ui_ux_engine

Módulo de **interfaz y experiencia**. Cubre el diseño de producto digital:
pantallas, componentes, estados y comportamiento. Aquí el diseño no se mira, se
usa — así que la medida del éxito es que la persona consiga lo que venía a hacer
sin pensar.

## Arquitectura de componentes

- **Atomic design** — átomos (botón, campo), moléculas (buscador), organismos
  (cabecera), plantillas, páginas. Evita rediseñar lo mismo diez veces.
- **Design tokens** — color, espaciado, radios, sombras y tipografía como
  variables (CSS custom properties), nunca valores sueltos. Es lo que permite
  cambiar el tema entero sin tocar componentes.
- **Estados completos.** Todo componente tiene: normal, hover, foco, activo,
  cargando, vacío, error y deshabilitado. Diseñar solo el estado feliz es la
  causa número uno de que una interfaz se sienta rota.

## Recursos modernos (usar cuando aporten)

Container queries (componentes que responden a su contenedor, no a la ventana) ·
`:has()` para estilos condicionales sin JS · view transitions para cambios de
vista fluidos · animaciones ligadas al scroll · dark mode nativo con
`prefers-color-scheme` · tipografía variable. Comprueba el soporte real del
destino antes de apoyarte en algo reciente.

## Microinteracciones y feedback

Toda acción responde en menos de 100 ms, aunque sea solo un cambio de estado. Lo
que tarda muestra progreso real, no un spinner eterno. Lo que falla dice **qué**
pasó y **cómo** arreglarlo, en lenguaje humano y en español. Las animaciones de
interfaz son cortas (150-300 ms) y respetan `prefers-reduced-motion`.

## Accesibilidad (mínimo WCAG 2.2 AA)

Contraste 4,5:1 en texto normal y 3:1 en texto grande · foco visible siempre ·
todo operable con teclado · áreas táctiles ≥ 44 px · etiquetas reales en los
campos, no solo *placeholder* · jerarquía de encabezados correcta · el color
nunca es el único portador de información. No es un extra: es parte del diseño.

## Encaje con este repo

Fátima Pro es un sitio estático vanilla sin build (ver `CLAUDE.md`): nada de
React, Tailwind ni bundlers. Los tokens se hacen con custom properties, los
componentes con HTML/CSS/JS autocontenido y los añadidos como scripts de parche
guardados por `window._X_LOADED`. La sofisticación se consigue con CSS moderno,
no metiendo tooling.

## Principio

Una interfaz buena se nota poco. Prioriza claridad, estados completos y
accesibilidad por encima del efecto; un producto que se entiende siempre gana a
uno que impresiona.

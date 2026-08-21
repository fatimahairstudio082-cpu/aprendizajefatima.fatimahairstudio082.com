# story_engine

Sistema narrativo. Convierte una idea en una estructura que **engancha, sostiene
y cierra**. Toda pieza —incluso un cartel— cuenta algo; aquí se decide cómo.

## Arco base

```
Hook → desarrollo → demostración → emoción → conclusión → CTA
```

- **Hook** — los primeros 1-2 s (o el primer golpe de vista). Promete valor,
  crea tensión o rompe el patrón. Si el hook falla, nada más importa.
- **Desarrollo** — se entrega lo prometido; se introduce el tema/problema.
- **Demostración** — prueba: producto en acción, antes/después, dato, muestra.
- **Emoción** — el momento que hace *sentir* (deseo, alivio, identificación).
- **Conclusión** — se cierra la idea; queda claro el mensaje único.
- **CTA** — la acción concreta. Una sola, clara, sin fricción.

No todas las piezas usan los seis pasos ni en este orden: es un esqueleto que se
adapta a la estructura elegida.

## Estructuras disponibles

Elige la que sirva al objetivo y al formato:

historia · tutorial · problema/solución · antes/después · lista · comparación ·
testimonio · producto · oferta · educativo · documental · emocional ·
entretenimiento · storytelling comercial.

Orientación:
- **Vender rápido** → problema/solución, oferta, producto, antes/después.
- **Enseñar** → tutorial, educativo, lista, comparación.
- **Conectar** → historia, testimonio, emocional, documental.
- **Retener/entretener** → entretenimiento, lista con giros, historia con tensión.

## Principios

- **Una idea por pieza.** Si intentas contar tres, no se recuerda ninguna.
- **Tensión y resolución.** El interés vive en la brecha entre lo que se promete
  y lo que se resuelve. Ábrela pronto, ciérrala al final.
- **Ritmo narrativo.** Alterna intensidad; da respiraciones antes de los golpes.
  Coordina con `timeline_engine` y `voice_audio_engine`.
- **Show, don't tell.** Demuestra (visual, dato, ejemplo) en vez de afirmar.
- **El CTA es parte de la historia**, no un pegote final: es la consecuencia
  natural de lo contado.

## Salida

El story_engine entrega el **guion** (texto + estructura de escenas) que alimenta
`voice_audio_engine` (locución) y `timeline_engine` (tiempos). El guion se
escribe antes de medir duraciones: primero qué se cuenta, luego cuánto dura.

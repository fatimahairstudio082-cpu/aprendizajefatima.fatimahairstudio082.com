# timeline_engine

El motor de sincronización. Alinea en el tiempo todo lo que se mueve: narración,
texto, animaciones, imágenes, vídeos, transiciones, música, efectos y CTA. Su
principio rector es que **la duración se adapta al contenido real**.

## Reloj maestro

La **narración** es el reloj (`voice_audio_engine`). Si no hay voz, el reloj es
la música o el ritmo de lectura pensado para el mensaje. Todo lo demás se cuelga
de ese reloj.

Ejemplo: locución de 9 s → escena de ~9 s. No se trocea la voz para que entre en
un molde. Si el brief pide 20 s y la locución natural son 23, se ajusta el guion
(quitar palabras) o se acepta la duración real; **no** se acelera la voz hasta
hacerla artificial.

## Cómo se monta un timeline

1. Coloca la **voz** en la línea de tiempo; marca sus pausas y palabras clave.
2. Divide en **escenas** según el guion; cada escena dura lo que dura su tramo de
   voz.
3. Sincroniza **texto/reveals** con las palabras que refuerzan (`motion_engine`):
   la palabra aparece cuando se dice o justo antes.
4. Coloca **transiciones** en los cambios de idea, preferiblemente en pausas
   (`transition_engine`).
5. Ajusta **música** (entrada, clímax, ducking bajo la voz) y **SFX** en los
   golpes.
6. Reserva aire para el **CTA**: que se lea/oiga con calma al final.

## Principios

- **Sincronía sobre relleno.** Cada elemento entra cuando aporta, no para llenar.
- **Ritmo con respiraciones.** Alterna densidad y pausa; sin respiraciones, todo
  cansa y nada destaca.
- **Coherencia de duración.** Si el contenido crece, el tiempo crece; no se
  sacrifica la comprensión por un número redondo.
- **Puntos de anclaje.** Hook, demostración, clímax emocional y CTA son anclas
  fijas; el resto se acomoda entre ellas.

## Verificación

`quality_engine` comprueba que voz, texto, movimiento y música están sincronizados
y que ninguna narración quedó cortada para caber en un molde.

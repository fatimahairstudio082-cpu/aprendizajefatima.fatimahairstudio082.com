# voice_audio_engine

Narración, voz, música y efectos. El audio no es un adorno final: es la mitad de
la experiencia y **determina la duración** de las piezas con voz.

## Voz / narración

- **Fuentes**: narración humana grabada, TTS, voces gratuitas, voces premium.
  Elige por calidad, presupuesto y tono (una voz robótica arruina una pieza
  luxury; una voz cálida vende).
- **Dirección de voz**: define género/edad aproximada, tono (cálido, enérgico,
  íntimo, autoritario), ritmo y énfasis. La voz debe encajar con el `design_engine`
  y la marca.
- **Interpretación**: marca pausas y énfasis en el guion. Una pausa antes del
  claim o del CTA vale más que un efecto.

## Música y efectos

- **Música** — fija la emoción y el ritmo base. Elige tempo y género según el
  brief; que apoye, no que tape la voz (ducking bajo la locución).
- **Efectos (SFX)** — subrayan momentos (un whoosh en una transición, un click en
  el CTA). Con mesura: pocos y bien colocados.
- **Silencio** — es una herramienta. Un silencio antes del golpe crea tensión.

## Regla de oro: el orden correcto

```
guion → voz → duración real → escenas → animación → transición → música
```

Primero se escribe el guion (`story_engine`), luego se genera/graba la voz, y
**se mide su duración real**. Solo entonces se construyen las escenas para que
encajen con la voz. **Nunca al revés**: no se recorta ni acelera la narración
para meterla en un vídeo de duración predeterminada. Si la locución dura 9 s, la
escena dura ~9 s.

## Coordinación

La voz es el reloj maestro que `timeline_engine` usa para sincronizar texto,
animaciones, transiciones y música. El ritmo del montaje sigue el ritmo del habla:
los cortes caen en las pausas, los reveals de texto acompañan las palabras clave.

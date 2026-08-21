# three_d_engine

Subsistema 3D. Sirve para **diseño estático**, **vídeo** y **transiciones**. El
3D se usa cuando aporta deseo (producto hero), impacto (logo/texto) o materiales
imposibles de fotografiar — no como efecto por defecto.

## Qué cubre

- Objetos 3D, productos, logos, texto 3D, extrusión, profundidad, perspectiva.
- Cámaras, iluminación, sombras, reflejos.
- Materiales: metal, chrome, glass, holographic, clay, y superficies mate.
- Partículas, floating objects.
- Movimientos de cámara: orbit camera, camera push/pull.
- Montajes: 3D carousel, logo reveal, product showcase.

## Decisiones clave

- **Material = emoción.** Chrome/glass → premium, tecnológico, deseo; clay →
  amable, playful; holographic → futurista/Y2K; mate → sobrio, editorial. Elige
  el material por lo que comunica.
- **Iluminación cuenta la historia.** Una luz principal marca la forma; los
  reflejos y sombras dan realismo y lujo. Luz suave → elegancia; contraste alto
  → drama; rim light → separar del fondo.
- **Cámara con intención.** Orbit para mostrar el producto por completo; push
  para acercar al detalle/CTA; float sutil para dar vida sin marear.
- **Composición 3D = composición.** Aplican las mismas reglas del `design_engine`
  (jerarquía, aire, foco): el 3D no exime de componer bien.

## Product showcase (patrón frecuente)

1. Entrada del producto (float in / camera push).
2. Orbit lento que revela forma y material.
3. Punto de detalle (macro del acabado, reflejo, textura).
4. Texto 3D o 2D (ver `typography_engine`/`motion_engine`) con el claim.
5. Resolución hacia el CTA (push final, luz que enfatiza).

## Herramienta

`tool_selector` decide: **Three.js/WebGL** para 3D interactivo o render en
navegador; imágenes/vídeo por **IA generativa** cuando el realismo fotográfico
supera lo alcanzable en tiempo real; **Blender/render offline** si existe el
recurso y se busca máxima calidad. Elige por calidad + rendimiento + coste.

## Coordinación

El 3D se integra con `motion_engine` (física del movimiento), `transition_engine`
(familia 3D/camera) y `timeline_engine` (sincronía con voz y música). Un producto
3D en un anuncio no vive aislado: gira cuando la locución lo nombra.

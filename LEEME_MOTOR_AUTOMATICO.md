# 🚀 MOTOR AUTOMÁTICO · Cómo subirlo (Fátima Caldea)

Genera imágenes y videos con la IA, los **revisas**, y los sube a Firebase
(+ respaldo en Google Drive). Alimenta en tiempo real: **Academia, Bloque 5
de Fitness, Hub y Motor de Corte M1-M7.**

═══════════════════════════════════════════════════════════════
## 📦 QUÉ SUBIR (4 archivos)
  1) motor_auto.html               ← el panel (videos por clip + paso a paso)
  2) motor_prompts.js              ← la librería de prompts
  3) bloque5_fitness.html          ← el Bloque 5 con CARRUSEL de clips
  4) academia_carrusel_pasos.js    ← carrusel paso a paso de la Academia

Van en la **misma carpeta** que ya publicas (junto a admin_motores.html).
El bloque5_fitness.html REEMPLAZA al viejo (el de un solo video).

⚡ PARA ACTIVAR EL CARRUSEL DE LA ACADEMIA (1 sola línea):
  En bloque3_academia_pagos.html, justo DESPUÉS de <script src="app.js"></script>,
  añade:   <script src="academia_carrusel_pasos.js"></script>
  (No borra nada. Si una clase no tiene clips de pasos, se ve igual que antes.)

Estos YA están en tu repo y NO se tocan:
  · netlify/functions/replicate.js   (el puente a Replicate)
  · motor_conocimiento_fitness.js
  · motor_p1_bioseg_balayage.js / motor_p2_… / motor_p3_…

═══════════════════════════════════════════════════════════════
## 🪜 PASOS (GitHub → Netlify, como siempre)
  1. Abre tu repo:  fatimahairstudio082-cpu/aprendizaje…
  2. "Add file" → "Upload files"
  3. Arrastra  motor_auto.html  y  motor_prompts.js
  4. "Commit changes" → Netlify publica solo en ~1 min.
  5. Entra a:  https://TU-SITIO/motor_auto.html

═══════════════════════════════════════════════════════════════
## ▶️ CÓMO USARLO (sin equivocarte)
  1. Inicia sesión con el correo admin (fatimahairstudio082@gmail.com).
  2. Elige el sistema: 🏋️ Fitness · ✂️ Peluquería · 🎴 Hub · ✂️ Corte.
  3. Deja el modo "👁️ Generar y revisar" (recomendado).
  4. Selecciona qué generar → ▶️ Iniciar lote.
  5. Mira la galería: ✅ Aprobar · 🔄 Regenerar · 🗑 Descartar.
  6. "☁️ Subir aprobadas" → cae en Firebase + Drive.
  7. Listo: la Academia / Bloque 5 / Hub se actualizan solos.

El **claseId** (etiqueta de cada imagen) es tu garantía: es la misma clave
que ve la alumna. Si en admin_motores el badge pasa de gris a 🖼/🎥, quedó bien.

═══════════════════════════════════════════════════════════════
## 📎 SUBIR DESDE GOOGLE DRIVE O TU PC (sin IA)
  En el panel "📎 Subida inteligente":
   · Elige sistema y la clase destino (con buscador).
   · Pega el enlace de Drive  O  elige un archivo de tu PC.
   · "➕ Añadir a revisión" → aprobar → subir.
  Convierte el enlace de Drive igual que tu biblioteca (thumbnail w1400).

═══════════════════════════════════════════════════════════════
## ☁️ GOOGLE DRIVE (respaldo) — OPCIONAL
  Tu carpeta "Fátima Caldea · Generados" YA existe → el motor la reutiliza.
  Para activarlo:
   1. Google Cloud Console → crea un "OAuth Client ID" (tipo Web).
   2. En "Orígenes de JavaScript autorizados" pon el dominio de tu Netlify.
   3. Pega ese Client ID en el motor → "Conectar Drive".
  Sin esto, todo funciona igual solo con Firebase.

═══════════════════════════════════════════════════════════════
## 🔑 REPLICATE
  Tu token ya vive en Netlify (variable REPLICATE_API_TOKEN) → el motor lo
  usa solo. Si no, pégalo en el campo "Replicate token r8_…" del panel.

═══════════════════════════════════════════════════════════════
## ✅ DÓNDE CAE CADA COSA (contrato, idéntico a producción)
  Fitness lámina  → fitness_imgs/{clave}_v1..v12  (campo url)
  Fitness CLIPS   → fitness_videos/{grupo}_{obj}_{equipo}_{nej}_{NN}_{ejercicio}
                    (1 clip por ejercicio · el CARRUSEL del Bloque 5 los ordena por _NN_)
  Academia img    → clases_imgs/{claseId}          (url_jpg + url)
  Academia video  → academia/{slug}/{claseId}/video.mp4   (1 video de apoyo)
  Academia PASOS  → academia/{slug}/{claseId}/paso_01.mp4 , paso_02.mp4 …
                    (1 clip por paso · el CARRUSEL de la Academia los muestra en orden)
  Academia video  → clases_imgs/{claseId}          (url_video)
  Hub tarjeta     → hub_tarjetas/{n}               (imgUrl)
  Corte módulo    → corte_modulos/{M1..M7}         (imgUrl)
  Storage academia→ academia/{slug}/{claseId}/imagen.jpg
═══════════════════════════════════════════════════════════════

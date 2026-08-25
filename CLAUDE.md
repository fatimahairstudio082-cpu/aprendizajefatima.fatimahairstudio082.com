# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

"Fátima Pro" — a Spanish-language beauty-academy PWA (hair styling, colorimetry, nutrition, fitness) for Fátima Hair Studio. It is a **static site with no build system**: plain HTML/CSS/JS files in the repo root, deployed by Netlify directly from the `main` branch. There is no package.json, no bundler, no linter, and no test suite.

- **Deploy:** push/merge to `main` → Netlify publishes automatically in ~1 minute.
- **Local preview:** most pages open as plain files, but anything using the Netlify functions (AI generation in `modulo1_imagen.html`, `modulo2_video.html`, `motor_auto.html`) only works on the published HTTPS site, because the browser calls `/.netlify/functions/...`. Use `npx netlify dev` if you need functions locally.
- **All UI text, comments, and commit-facing docs are in Spanish.** Keep new user-facing text in Spanish. The `LEEME*.txt/.md` files in the root are the owner's deployment/change notes and the closest thing to project documentation — read them for history and data contracts.

## Architecture

### Hub + iframes + postMessage bridges

`index.html` and `fatima_hub.html` are both full copies of the hub shell (the PWA entry point). **They are near-duplicates that must be kept in sync manually** — a change to one usually needs the same change in the other.

The hub lazily loads each learning block into an `<iframe class="bloque-frame" data-src="...">`:

- `bloque1_motor_corte.html` — cutting techniques
- `calc_cromatica_v8.html` — colorimetry calculator (blocks 2 and 7)
- `bloque3_academia_pagos.html` — the official academy (video classes). `fatima_peluqueria.html` is a backup duplicate the hub does NOT use — always edit `bloque3_academia_pagos.html`.
- `bloque4_nutricion.html`, `bloque5_fitness.html`, `bloque6_herramientas.html`, `bloque8_construccion.html`, `bloque9_ejercicios.html`

`estudio_universal.html` is the **premium Business block** ("Estudio Universal"): plantilla grid →
folleto editor → 3D video studio → QR → saved projects, gated by a `free`/`pro` plan. It is a loose
page that reuses the Block 6 engines untouched (`b6_folleto_motor.js`, `b6_folleto_cerebro.js`,
`b6_folleto_disenos.js`, `b6_voz_video_gratis.js`, `netlify/functions/tts.js`) and adds `eu_*.js`,
one file per screen, each guarded by `window._EU_X_LOADED`. It is **not** wired into the hub HTML:
it is published as a dynamic hub card (Biblioteca → Bloques del Hub) pointing at
`estudio_universal.html`, so `index.html` ↔ `fatima_hub.html` stay untouched. Data contract and the
list of what is still missing live in `LEEME_ESTUDIO_UNIVERSAL.md`.

Cross-frame communication is done by "bridge" scripts using `postMessage` and `localStorage`. Every bridge is written defensively: loaded standalone (no hub parent) it must be a no-op and the page keeps working alone. Key bridges:

- `hub_core_parche.js` — central credit rules (`window.REGLAS_CONTROL_CREDITOS`, per-block tariffs); the dashboard only observes Firebase, never debits.
- `hub_credito_bridge.js` — routes each block's credit spending to the single global pool `usuarios/{uid}.creditos` via an atomic Firestore transaction in the hub parent.
- `peluqueria_hub_bridge.js` — auto-login from hub session, filters classes by `usuarios/{uid}.acceso_clases`, syncs credits.
- `m1..m4_motor_bridge.js`, `puente_catalogo_m2.js`, `puente_inteligente.js` — connect the Estudio modules to the class catalog and admin targets (via `localStorage` keys `fc_admin_target`, `fc_carpeta_queue`).
- `*_drive_fix.js` (`drive_fix`, `academia_drive_fix`, `pelu_drive_fix`) — patch scripts that normalize Google Drive links at render time.

Patch scripts are the established style here: rather than rewriting a big HTML file, behavior is added by appending a `<script src="...js">` include that monkey-patches at load (guarded by `window._X_LOADED` flags). E.g. `academia_carrusel_pasos.js` adds the step-by-step clip carousel to the academy.

### Class catalog ("motor" data)

The 360-class catalog lives in three data files that must load in order, then the helper:

```html
<script src="motor_p1_bioseg_balayage.js"></script>
<script src="motor_p2_queratina_elevaciones.js"></script>
<script src="motor_p3_morfologia_alertas.js"></script>
<script src="motor_helper.js"></script>
```

`motor_helper.js` exposes `window.MOTOR`, `MOTOR_FLAT`, `MOTOR_CATS`, `MOTOR_BY_ID` and helpers (`MOTOR_GET`, `MOTOR_PATH(id, 'img'|'vid'|'pdf'|'aud')`, etc.). The `claseId` (e.g. `bio_p01`) is the universal key linking admin panels, generated media, Firestore docs, and Storage paths. `app.js` holds the academy's own class content (`window.CONOCIMIENTO`); `motor_conocimiento_fitness.js` holds the fitness catalog; `fatima_modules.js` holds hub extras (progress dashboard, per-block tests, jsPDF certificates, chatbox).

### Firebase (backend)

Single Firebase project **`aprendisajefatima`** (note the intentional misspelling — do not "fix" it). Every page embeds its own copy of the config and loads the **compat** SDK from gstatic (mostly 10.12.2; older blocks still on 9.23.0 / 10.12.0). Auth is email/password; the admin is identified **by email** (`fatimahairstudio082@gmail.com`) both in UI checks and in `firestore.rules`.

`firestore.rules` in this repo is the source of truth for security but is **deployed manually** by pasting into the Firebase console — pushing to Netlify never updates it. Key invariants encoded there:

- Students can never increase their own `creditos` or touch `acceso_clases` — only the admin assigns classes and recharges the global credit pool.
- New user docs are created with ≤10 trial credits, zero unlocked classes, an `email` matching the auth token, and a `nombre` that is a string ≤60 chars (the last two close a stored-XSS→admin-escalation path: student-controlled names/emails are rendered in the admin panels).
- Admin panels that render student `nombre`/`email` via `innerHTML` MUST escape them (`esc()` helper in `admin_motores.html` and `panel_admin.js`) — the data is student-writable at create time.
- Content collections (`fitness_videos`, `fitness_imgs`, `hub_tarjetas`, `hub_images`, `hub_tools`, `noticias`, `corte_modulos`, `clases_imgs`, `clases_videos`, `clases`) are read-by-logged-in, write-by-admin-only.
- `usuarios_bloques` / `registros_bloques` are the legacy per-block credit system kept for blocks 6/8/9.

### Media contract (Firestore/Storage document keys)

Generated/uploaded media lands at fixed keys the reader pages depend on (from `LEEME_MOTOR_AUTOMATICO.md`):

```
fitness_imgs/{clave}_v1..v12                       (campo url)
fitness_videos/{grupo}_{obj}_{equipo}_{nej}_{NN}_{ejercicio}   (1 clip/ejercicio, carrusel ordena por _NN_)
clases_imgs/{claseId}                              (url_jpg, url, url_video)
academia/{slug}/{claseId}/imagen.jpg | video.mp4 | paso_01.mp4, paso_02.mp4…
hub_tarjetas/{n}   (imgUrl)        corte_modulos/{M1..M7}   (imgUrl)

usuarios/{uid}.plan     'free' | 'pro'   (Estudio Universal · solo el admin escribe)
usuarios/{uid}.marca    {nombre,tel,mail,web,dir,c1,c2}
proyectos/{uid}/items/{id}   (tipo, nombre, pagina, mini, creado, tocado)
```

Google Drive links must be converted before storage: images to the `thumbnail?...w1400` format, videos to `https://drive.google.com/file/d/{ID}/preview` (raw share or `uc?export=download` links render black). `biblioteca.js` auto-converts and rejects non-`https://` input on save; `conversor_drive.html` does manual conversion.

`calc_cromatica_v8.html` loads React 18 from the vendored root files `react.production.min.js` / `react-dom.production.min.js` (with a unpkg CDN fallback) — keep them, or the colorimetry calculator renders a black page.

### Netlify functions (the only server code)

`netlify.toml` points at `netlify/functions/` (esbuild bundler):

- `netlify/functions/replicate.js` — CORS proxy to api.replicate.com. Token comes from the `Authorization` / `x-replicate-token` header or the `REPLICATE_API_TOKEN` Netlify env var. GET on the bare path is a health check.
- `netlify/functions/aiproxy.js` — allowlist-based proxy for other AI providers (OpenAI, Stability, fal, Luma) keyed by the `x-ai-url` header; clients call `/.netlify/functions/aiproxy`.

The point of both: browser talks to same-origin Netlify, keys never live in the public site, no CORS issues.

### Admin panels vs student pages

- `centro_admin.html` — tabbed shell embedding every admin panel (bookmark page for the owner).
- `admin_motores.html` — assign/lock classes per student (`acceso_clases`); badge turns 🖼/🎥 when media exists for a claseId.
- `panel_admin.html` + `panel_admin.js` — global credit pool + activate/deactivate students. (`admin2.html` is retired and just redirects here.)
- `biblioteca.html` + `biblioteca.js` — upload videos/images/home cards/news.
- `motor_auto.html` + `motor_prompts.js` — the **only** generation tool in daily use: batch AI panel that generates → review gallery (approve/regenerate/discard) → uploads approved media to Firebase (+ optional Drive backup) at the contract keys above. Has a "generar solo N que falten" batch cap + "omitir las que ya están" so the owner generates in small tandas without duplicating cost.
- `estudio.html` + `modulo1_imagen.html`/`modulo2_video.html`/`modulo3_voz.html`/`modulo4_carpeta.html` — the OLD private studio (M1–M4). The owner abandoned these (buggy) and generates everything via `motor_auto.html`. They are **hidden from the admin UI**: the `centro_admin.html` tabs and the `admin_motores.html` per-class studio-bridge buttons now point to `motor_auto.html`, and the old M1–M4 entries are commented out (files kept for possible reactivation). Don't re-surface them without being asked.
- `escaner_faltantes_total.html` — read-only dashboard of missing/existing media across Academia (`clases_imgs`), Corte M1–M7, Hub cards, and a fitness summary; `escaner_clips_faltantes.html` is the per-class fitness clip detail.
- One-shot repair tools (not daily-use): `reparar_registros_video.html`, `migrar_links_video.html`.

### PWA

`service-worker.js` (cache `fatima-pro-v1`): network-first for same-origin GETs, never touches cross-origin (Firebase, Drive, CDNs). `_headers` sets `no-cache` on the service worker and manifest content types. `manifest.json` is the hub app; `manifest-estudio.json` the studio (`manifestestudio.json` is a stray duplicate).

## Conventions and gotchas

- Everything is vanilla JS in single self-contained HTML files (inline CSS/JS, some >100 KB). Match that style; don't introduce build tooling, modules, or frameworks.
- Changes here are historically **additive**: new behavior ships as a patch script or a guarded block rather than rewrites, so student data and working flows never break. Follow that instinct — especially around Firestore document shapes, which are load-bearing contracts between the admin/generator side and the student-facing readers.
- Duplicated files to watch: `index.html` ↔ `fatima_hub.html` (both are the hub), `bloque3_academia_pagos.html` ↔ `fatima_peluqueria.html` (edit the former).
- Firebase reads that fail permissions have historically failed silently ("próximamente" placeholders); newer pages surface the exact Firestore error in a red status bar — keep doing that.

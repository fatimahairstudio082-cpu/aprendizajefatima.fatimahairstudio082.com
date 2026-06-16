# 🚀 SISTEMA FÁTIMA PRO — Paquete listo para publicar

Este paquete contiene **TODO el sistema actualizado y conectado a Firebase**,
listo para subir a tu hosting (Netlify, OneDrive, Hostinger, etc.).

---

## ✅ Qué se corrigió en esta actualización

1. **Control de acceso a las clases (RESTAURADO).**
   - La academia vuelve a respetar lo que seleccionas en `admin_motores.html`.
   - Lo que NO le asignas a la alumna queda **bloqueado** (antes se veía todo libre).
   - 0 clases asignadas = la alumna no ve nada (mensaje "sin clases asignadas").
   - Mismo catálogo de **299 clases** en el admin y en la academia.

2. **Alumnas nuevas aparecen en el admin.**
   - Al registrarse, se crea su ficha en Firebase (`usuarios/{uid}`).
   - El botón **Activar/Desactivar** del admin ahora SÍ surte efecto.

3. **Sincronización del Home con la Biblioteca.**
   - Nombre, descripción e imagen de cada tarjeta del hub se actualizan solos.
   - Imágenes de hero, login y chatbox sincronizadas.
   - Noticias en vivo desde Firebase (antes eran fijas en el código).

4. **Créditos unificados.**
   - `admin2.html` (viejo, con saldos negativos) quedó **retirado** → redirige
     al panel nuevo `panel_admin.html` (pozo global de créditos, nunca baja de 0).

5. **Firebase profesional.**
   - Todos los archivos apuntan al mismo proyecto `aprendisajefatima`.
   - `appId` real corregido en el puente de la academia.
   - **Reglas de seguridad endurecidas** (`firestore.rules`): la alumna ya
     NO puede auto-desbloquearse clases ni subirse créditos.

---

## 📋 PASOS PARA PUBLICAR

### 1) Sube TODOS los archivos de esta carpeta a tu hosting
Sube el contenido completo de `SISTEMA_FATIMA/` a la raíz de tu sitio.
El punto de entrada es **`index.html`** (lleva al hub automáticamente).

### 2) Publica las reglas de seguridad en Firebase
1. Entra a https://console.firebase.google.com → proyecto **aprendisajefatima**.
2. Ve a **Firestore Database → Reglas**.
3. Borra lo que haya y **pega TODO** el contenido de `firestore.rules`.
4. Pulsa **Publicar**.

> ⚠️ Sin este paso, la seguridad no queda activa.

### 3) Comprueba que el control de clases funciona
1. Abre `admin_motores.html` → pestaña **Alumnas & Accesos**.
2. Elige una alumna, márcale 5 clases y pulsa **Guardar**.
3. Entra al hub con esa cuenta → la Academia mostrará **solo esas 5**.
4. Quítale todas → verá "Aún no tienes clases asignadas".

---

## 🔑 Generador de imágenes (Módulo 1)
El código está correcto. Pollinations cambió y **ya no genera en modo anónimo**:
hay que pegar un **token gratuito** una sola vez.
1. Regístrate gratis en **enter.pollinations.ai**.
2. Copia tu token.
3. Pégalo en el panel izquierdo, campo **"Pollinations · Token"**.

---

## 🗂️ Mapa de paneles de administración

> 🎛️ **TODO desde un solo lugar:** abre **`centro_admin.html`** — es el Centro de
> Administración con **pestañas** para moverte entre Clases, Créditos, Biblioteca,
> Estudio, Generador de Imagen y Conversor Drive sin entrar a la carpeta.
> Inicias sesión una sola vez y vale para todas. **Guárdalo en favoritos.**

| Archivo | Para qué |
|---|---|
| `centro_admin.html` | ⭐ **Centro con pestañas** — acceso a todos los paneles |
| `admin_motores.html` | Seleccionar/bloquear las **clases** de cada alumna |
| `panel_admin.html`   | **Créditos** (pozo global) + activar/desactivar alumnas |
| `biblioteca.html`    | Cargar **videos, láminas, tarjetas del home y noticias** |
| `estudio.html`       | Centro de control del estudio privado |
| `conversor_drive.html` | Convierte enlaces de Drive en URL directa |
| `admin2.html`        | (retirado → redirige a `panel_admin.html`) |

## 📌 Notas
- `fatima_hub.html` es el sistema público (el hub). `index.html` lleva ahí.
- `bloque3_academia_pagos.html` es la academia oficial que usa el hub.
  `fatima_peluqueria.html` es un duplicado de respaldo (no lo usa el hub):
  edita siempre `bloque3_academia_pagos.html`.
- Correo administrador: `fatimahairstudio082@gmail.com`.

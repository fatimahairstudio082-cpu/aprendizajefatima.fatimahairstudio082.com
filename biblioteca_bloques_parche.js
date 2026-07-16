/* ═══════════════════════════════════════════════════════════════
 *  BIBLIOTECA · PESTAÑA "BLOQUES DEL HUB"  · parche ADITIVO
 *  Fátima Caldea Studio · proyecto aprendisajefatima
 *  ────────────────────────────────────────────────────────────────
 *  Se carga con UNA etiqueta en biblioteca.html, justo DESPUÉS de
 *  biblioteca.js:
 *      <script src="biblioteca_bloques_parche.js"></script>
 *
 *  Qué hace:
 *    Inyecta una pestaña nueva "🚀 Bloques del Hub" en la Biblioteca
 *    para gestionar las tarjetas dinámicas del inicio SIN tocar nunca
 *    más index.html / fatima_hub.html:
 *      · Crear una categoría nueva: nombre, icono, color, descripción,
 *        imagen de portada, tipo (bloque HTML / video / imagen) y el
 *        contenido según el tipo. Se le asigna solo un slot libre
 *        del pool (11–20).
 *      · Encender/apagar cualquier tarjeta (toggle activo) — también
 *        las 6 originales del hub.
 *      · Editar o quitar las categorías dinámicas.
 *    Guarda en Firestore hub_tarjetas/din_{slot}; el hub las pinta en
 *    tiempo real gracias a hub_bloques_dinamicos.js.
 *
 *  Reutiliza (sin modificarlos) los ayudantes de biblioteca.js:
 *    db, esc(), toast(), normImg(), normVid(), tab() vía BIB.tab.
 *  Cargado standalone o sin sesión admin es un no-op (las reglas de
 *  Firestore rechazan cualquier escritura que no sea de la admin).
 * ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if (window._BIB_BLOQUES_LOADED) return;
  window._BIB_BLOQUES_LOADED = true;

  var BLQ = {};        // espejo hub_tarjetas (docs din_* y 1..6)
  var editando = null; // id del doc din_* en edición (null = nuevo)

  var ORIGINALES = {
    '1': '✂️ Motor de Corte & Diagnóstico',
    '2': '🎨 Colorimetría · Calculadora Cromática',
    '3': '📚 Academia & Biblioteca',
    '4': '🥗 Nutrición & Alimentación Fitness',
    '5': '💪 Entrenamientos Fitness',
    '6': '🧰 Optimizador · Herramientas'
  };
  var TIPOS = { html: '🧩 Bloque HTML', video: '🎥 Video', imagen: '🖼 Imagen' };
  var HINT = {
    html:   'Nombre del archivo del bloque · ej: bloque_maquillaje.html',
    video:  'Link del video (Google Drive o MP4/Storage) — se convierte solo',
    imagen: 'URL de la imagen (o link/ID de Google Drive) — se convierte sola'
  };

  /* ── Inyectar pestaña + panel (mismo estilo de la Biblioteca) ── */
  function montarUI() {
    var tabs = document.querySelector('.tabs');
    var wrap = document.querySelector('.wrap');
    if (!tabs || !wrap) { setTimeout(montarUI, 300); return; }
    if (document.getElementById('pane-bloques')) return;

    /* inputs del modal con el mismo look de los .fld input de la Biblioteca */
    var css = document.createElement('style');
    css.textContent =
      '#blq-modal input.inp,#blq-modal select.inp{background:#060c16;border:1px solid #1e2533;' +
      'border-radius:10px;padding:11px 13px;color:#e8e8e8;font-size:12px;outline:none;font-family:inherit;}' +
      '#blq-modal input.inp:focus,#blq-modal select.inp:focus{border-color:#C9A84C;}' +
      '#blq-modal label{display:block;color:#9aa3b5;}';
    document.head.appendChild(css);

    var btn = document.createElement('button');
    btn.className = 'tab'; btn.dataset.t = 'bloques';
    btn.innerHTML = '<span class="ic">🚀</span> Bloques del Hub';
    btn.onclick = function () { BIB.tab('bloques'); };
    tabs.appendChild(btn);

    var pane = document.createElement('div');
    pane.className = 'pane'; pane.id = 'pane-bloques';
    pane.innerHTML =
      '<div class="card">' +
      '  <h2><span class="ic">🚀</span> Categorías del inicio del Hub</h2>' +
      '  <p style="font-size:12px;opacity:.7;margin:6px 0 14px;">Enciende/apaga tarjetas y crea categorías nuevas sin tocar el código. Los cambios se ven en el hub en segundos. Pool disponible: slots 11–20.</p>' +
      '  <div id="blq-lista"></div>' +
      '  <button id="blq-nuevo" style="margin-top:14px;display:flex;align-items:center;gap:8px;background:rgba(201,168,76,.12);border:1px solid rgba(201,168,76,.4);color:#F0D080;border-radius:10px;padding:11px 16px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;">＋ Nueva categoría</button>' +
      '</div>';
    wrap.appendChild(pane);

    /* modal de edición */
    var ov = document.createElement('div');
    ov.id = 'blq-modal';
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.75);z-index:900;display:none;align-items:center;justify-content:center;padding:16px;';
    ov.innerHTML =
      '<div style="background:#12141c;border:1px solid rgba(201,168,76,.35);border-radius:14px;max-width:480px;width:100%;max-height:92vh;overflow-y:auto;padding:20px;">' +
      '  <h2 id="blq-m-tit" style="font-size:15px;color:#F0D080;margin-bottom:14px;">Nueva categoría</h2>' +
      '  <div style="display:flex;flex-direction:column;gap:10px;font-size:12px;">' +
      '    <label>Nombre de la categoría<input id="blq-nom" class="inp" placeholder="ej: Maquillaje Artístico" style="width:100%;margin-top:4px;"></label>' +
      '    <div style="display:flex;gap:10px;">' +
      '      <label style="flex:1;">Icono (emoji)<input id="blq-ico" class="inp" placeholder="💄" maxlength="4" style="width:100%;margin-top:4px;"></label>' +
      '      <label style="flex:1;">Color<input id="blq-color" type="color" value="#C9A84C" style="width:100%;height:34px;margin-top:4px;border:1px solid #333;border-radius:8px;background:transparent;cursor:pointer;"></label>' +
      '      <label style="flex:1;">Orden<input id="blq-orden" class="inp" type="number" min="1" value="7" style="width:100%;margin-top:4px;"></label>' +
      '    </div>' +
      '    <label>Descripción corta<input id="blq-desc" class="inp" placeholder="ej: Técnicas de maquillaje profesional paso a paso" style="width:100%;margin-top:4px;"></label>' +
      '    <label>Imagen de portada (URL o link/ID de Drive)<input id="blq-img" class="inp" placeholder="https://… o link de Drive" style="width:100%;margin-top:4px;"></label>' +
      '    <label>Tipo de contenido' +
      '      <select id="blq-tipo" class="inp" style="width:100%;margin-top:4px;">' +
      '        <option value="html">🧩 Bloque HTML autónomo (como los demás bloques)</option>' +
      '        <option value="video">🎥 Video (se abre en teatro dentro del hub)</option>' +
      '        <option value="imagen">🖼 Imagen (visor a pantalla completa)</option>' +
      '      </select></label>' +
      '    <label><span id="blq-src-lbl">Contenido</span><input id="blq-src" class="inp" style="width:100%;margin-top:4px;"></label>' +
      '    <div id="blq-err" style="color:#ff7875;font-size:11px;display:none;"></div>' +
      '  </div>' +
      '  <div style="display:flex;gap:10px;margin-top:16px;justify-content:flex-end;">' +
      '    <button id="blq-cancelar" class="btn-ghost" style="cursor:pointer;">Cancelar</button>' +
      '    <button id="blq-guardar" style="background:linear-gradient(135deg,#C9A84C,#F0D080);color:#000;border:none;border-radius:9px;padding:10px 20px;font-weight:800;font-size:12px;cursor:pointer;font-family:inherit;">Guardar y publicar</button>' +
      '  </div>' +
      '</div>';
    document.body.appendChild(ov);

    document.getElementById('blq-nuevo').onclick = function () { abrirModal(null); };
    document.getElementById('blq-cancelar').onclick = cerrarModal;
    document.getElementById('blq-guardar').onclick = guardar;
    document.getElementById('blq-tipo').onchange = pintarHint;
    ov.addEventListener('click', function (e) { if (e.target === ov) cerrarModal(); });

    pintarLista();
  }

  function pintarHint() {
    var t = document.getElementById('blq-tipo').value;
    document.getElementById('blq-src-lbl').textContent = 'Contenido — ' + TIPOS[t];
    document.getElementById('blq-src').placeholder = HINT[t];
  }

  /* ── Lista: 6 originales (toggle) + dinámicas (toggle/editar/quitar) ── */
  function filaHTML(id, titulo, sub, activo, esDin) {
    return (
      '<div style="display:flex;align-items:center;gap:10px;background:#0d0f16;border:1px solid #23273340;border-radius:10px;padding:10px 12px;margin-bottom:8px;' + (activo ? '' : 'opacity:.55;') + '">' +
      '  <div style="flex:1;min-width:0;">' +
      '    <div style="font-size:13px;font-weight:700;color:#e8e8e8;">' + titulo + '</div>' +
      '    <div style="font-size:10px;opacity:.6;font-family:monospace;">' + sub + '</div>' +
      '  </div>' +
      '  <button data-acc="toggle" data-id="' + id + '" title="' + (activo ? 'Apagar (ocultar del hub)' : 'Encender (mostrar en el hub)') + '"' +
      '    style="width:40px;height:22px;border-radius:11px;border:none;cursor:pointer;position:relative;flex-shrink:0;background:' + (activo ? '#52c41a' : '#3a3f50') + ';">' +
      '    <span style="position:absolute;top:3px;left:' + (activo ? '21px' : '3px') + ';width:16px;height:16px;border-radius:50%;background:#fff;transition:.2s;"></span></button>' +
      (esDin
        ? '<button data-acc="editar" data-id="' + id + '" class="btn-ghost" style="cursor:pointer;font-size:10px;">Editar</button>' +
          '<button data-acc="quitar" data-id="' + id + '" style="background:transparent;border:1px solid rgba(255,77,79,.4);color:#ff7875;border-radius:8px;padding:6px 10px;font-size:10px;cursor:pointer;font-family:inherit;">Quitar</button>'
        : '<span style="font-size:9px;letter-spacing:1px;color:#666;text-transform:uppercase;flex-shrink:0;">Original</span>') +
      '</div>'
    );
  }

  function pintarLista() {
    var cont = document.getElementById('blq-lista');
    if (!cont) return;
    var html = '<div style="font-size:10px;letter-spacing:2px;text-transform:uppercase;opacity:.5;margin-bottom:8px;">Bloques originales</div>';
    Object.keys(ORIGINALES).forEach(function (n) {
      var d = BLQ[n] || {};
      html += filaHTML(n, esc(ORIGINALES[n]), 'bloque fijo · doc hub_tarjetas/' + n, d.activo !== false, false);
    });
    html += '<div style="font-size:10px;letter-spacing:2px;text-transform:uppercase;opacity:.5;margin:16px 0 8px;">Categorías dinámicas</div>';
    var dins = Object.keys(BLQ).filter(function (k) { return k.indexOf('din_') === 0; })
      .sort(function (a, b) { return (BLQ[a].orden || 0) - (BLQ[b].orden || 0); });
    if (!dins.length) html += '<div style="font-size:12px;opacity:.5;padding:6px 2px;">Todavía no hay categorías dinámicas — crea la primera con el botón de abajo.</div>';
    dins.forEach(function (k) {
      var d = BLQ[k];
      html += filaHTML(k, esc((d.icono || '✨') + ' ' + (d.nom || 'Sin nombre')),
        esc(TIPOS[d.tipo] || d.tipo || '?') + ' · ' + esc(d.src || '—') + ' · slot ' + (d.slot || '?'),
        d.activo !== false, true);
    });
    cont.innerHTML = html;
    [].forEach.call(cont.querySelectorAll('button[data-acc]'), function (b) {
      var id = b.dataset.id;
      if (b.dataset.acc === 'toggle') b.onclick = function () { toggleActivo(id); };
      if (b.dataset.acc === 'editar') b.onclick = function () { abrirModal(id); };
      if (b.dataset.acc === 'quitar') b.onclick = function () { quitar(id); };
    });
  }

  /* ── Acciones ── */
  function toggleActivo(id) {
    var d = BLQ[id] || {};
    var nuevo = !(d.activo !== false);
    db.collection('hub_tarjetas').doc(id).set(
      { activo: nuevo, actualizado: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true })
      .then(function () { toast(nuevo ? 'Tarjeta encendida ✅ — visible en el hub' : 'Tarjeta apagada — oculta del hub'); })
      .catch(function (e) { toast('Error: ' + e.message); });
  }

  function quitar(id) {
    var d = BLQ[id] || {};
    if (!confirm('¿Quitar la categoría "' + (d.nom || id) + '" del hub?\nEsto borra su tarjeta (el archivo HTML no se toca).')) return;
    db.collection('hub_tarjetas').doc(id).delete()
      .then(function () { toast('Categoría quitada del hub'); })
      .catch(function (e) { toast('Error: ' + e.message); });
  }

  function slotLibre() {
    for (var s = 11; s <= 20; s++) { if (!BLQ['din_' + s]) return s; }
    return null;
  }

  function abrirModal(id) {
    editando = id;
    var d = id ? (BLQ[id] || {}) : {};
    document.getElementById('blq-m-tit').textContent = id ? 'Editar categoría' : 'Nueva categoría';
    document.getElementById('blq-nom').value = d.nom || '';
    document.getElementById('blq-ico').value = d.icono || '';
    document.getElementById('blq-color').value = /^#[0-9a-fA-F]{6}$/.test(d.color || '') ? d.color : '#C9A84C';
    document.getElementById('blq-orden').value = d.orden || (Object.keys(BLQ).filter(function (k) { return k.indexOf('din_') === 0; }).length + 7);
    document.getElementById('blq-desc').value = d.desc || '';
    document.getElementById('blq-img').value = d.imgUrl || '';
    document.getElementById('blq-tipo').value = d.tipo || 'html';
    document.getElementById('blq-src').value = d.src || '';
    document.getElementById('blq-err').style.display = 'none';
    pintarHint();
    document.getElementById('blq-modal').style.display = 'flex';
  }
  function cerrarModal() { document.getElementById('blq-modal').style.display = 'none'; editando = null; }

  function error(m) {
    var e = document.getElementById('blq-err');
    e.textContent = '⚠️ ' + m; e.style.display = 'block';
  }

  function guardar() {
    var nom  = document.getElementById('blq-nom').value.trim();
    var tipo = document.getElementById('blq-tipo').value;
    var src  = document.getElementById('blq-src').value.trim();
    var img  = document.getElementById('blq-img').value.trim();
    if (!nom) return error('Ponle un nombre a la categoría.');
    if (nom.length > 60) return error('El nombre es muy largo (máx. 60).');
    if (!src) return error('Falta el contenido (' + HINT[tipo] + ').');

    if (tipo === 'html') {
      if (!/^[A-Za-z0-9_\-]+\.html$/.test(src)) return error('Para un bloque HTML escribe solo el nombre del archivo, ej: bloque_maquillaje.html (sin http, sin carpetas).');
    } else if (tipo === 'video') {
      src = normVid(src);
      if (!/^https:\/\//i.test(src)) return error('El link del video debe ser https (Drive, Storage o MP4).');
    } else {
      src = normImg(src);
      if (!/^https:\/\//i.test(src)) return error('El link de la imagen debe ser https (o un link/ID de Drive).');
    }
    if (img) img = normImg(img);

    var slot, id;
    if (editando) { id = editando; slot = BLQ[id] && BLQ[id].slot || parseInt(id.slice(4), 10); }
    else {
      slot = slotLibre();
      if (!slot) return error('El pool está lleno (10 categorías dinámicas). Quita una para crear otra.');
      id = 'din_' + slot;
    }

    var data = {
      nom: nom,
      desc: document.getElementById('blq-desc').value.trim(),
      icono: document.getElementById('blq-ico').value.trim() || '✨',
      color: document.getElementById('blq-color').value,
      imgUrl: img,
      tipo: tipo,
      src: src,
      orden: parseInt(document.getElementById('blq-orden').value, 10) || 7,
      slot: slot,
      activo: editando ? (BLQ[id].activo !== false) : true,
      actualizado: firebase.firestore.FieldValue.serverTimestamp()
    };
    db.collection('hub_tarjetas').doc(id).set(data, { merge: true })
      .then(function () {
        cerrarModal();
        toast('✅ "' + nom + '" publicada — ya está en vivo en el hub (slot ' + slot + ')');
      })
      .catch(function (e) { error('No se pudo guardar: ' + e.message); });
  }

  /* ── Espejo en tiempo real (propio, no toca los listeners existentes) ── */
  function suscribir() {
    try {
      db.collection('hub_tarjetas').onSnapshot(function (s) {
        BLQ = {};
        s.forEach(function (doc) {
          if (doc.id.indexOf('din_') === 0 || /^[1-9]$/.test(doc.id)) BLQ[doc.id] = doc.data() || {};
        });
        pintarLista();
      }, function (e) { console.warn('[bib_bloques] sin lectura:', e && e.message); });
    } catch (e) { console.warn('[bib_bloques] no arrancó:', e && e.message); }
  }

  function arrancar() {
    if (!window.firebase || !firebase.auth || typeof db === 'undefined') { setTimeout(arrancar, 400); return; }
    firebase.auth().onAuthStateChanged(function (u) { if (u) suscribir(); });
    montarUI();
  }
  arrancar();
})();

/* ════════════════════════════════════════════════════════════════
   PUENTE GENÉRICO MULTI-API · Fátima Caldea Studio
   ----------------------------------------------------------------
   NO reemplaza ni elimina el puente replicate.js: es ADICIONAL.
   Replicate sigue usando su propio puente. Este puente reenvía las
   llamadas a OTROS proveedores de IA (OpenAI, Stability, fal.ai,
   Luma…) usando la clave que TÚ pegas en el panel. Así:
     · Tus claves nunca quedan expuestas en la web pública.
     · No hay problema de CORS (el navegador habla con TU Netlify,
       y tu Netlify habla con el proveedor).
     · Si mañana quieres otro proveedor, se añade su dominio a la
       lista blanca de abajo y listo.

   Cómo lo llama el navegador:
     POST /.netlify/functions/aiproxy
     headers:
        x-ai-url     = URL completa del proveedor (ej. https://api.openai.com/v1/images/generations)
        Authorization= la clave (ej. "Bearer sk-..." o "Key id:secret")
     body = el JSON que pide ese proveedor

   El puente valida que la URL sea de un proveedor conocido (lista
   blanca), reenvía la llamada y devuelve la respuesta tal cual.
   ════════════════════════════════════════════════════════════════ */

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-ai-url, Accept',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
};
const JSON_HEAD = { ...CORS, 'Content-Type': 'application/json' };

/* Lista blanca: SOLO se reenvía a estos dominios (seguridad). */
const HOSTS_PERMITIDOS = [
  'api.openai.com',
  'api.stability.ai',
  'fal.run',
  'queue.fal.run',
  'rest.alpha.fal.ai',
  'api.lumalabs.ai',
  'api.bfl.ml',
  'api.bfl.ai',
  'generativelanguage.googleapis.com',
  'api.runwayml.com',
  'api.dev.runwayml.com',
  'api.minimaxi.chat',
  'api.minimax.io'
];

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' };

  const h = event.headers || {};
  const target = h['x-ai-url'] || h['X-Ai-Url'] || h['x-ai-Url'];

  // Ping de salud
  if (event.httpMethod === 'GET' && !target) {
    return {
      statusCode: 200, headers: JSON_HEAD,
      body: JSON.stringify({ ok: true, puente: 'aiproxy', mensaje: 'Puente multi-API vivo.', node: process.version, proveedores: HOSTS_PERMITIDOS })
    };
  }

  if (!target) {
    return { statusCode: 400, headers: JSON_HEAD, body: JSON.stringify({ error: 'Falta el encabezado x-ai-url (la URL del proveedor).' }) };
  }

  let host;
  try { host = new URL(target).host; }
  catch (_) { return { statusCode: 400, headers: JSON_HEAD, body: JSON.stringify({ error: 'x-ai-url no es una URL válida.' }) }; }

  if (!HOSTS_PERMITIDOS.includes(host)) {
    return { statusCode: 403, headers: JSON_HEAD, body: JSON.stringify({ error: 'Proveedor no permitido: ' + host + '. Pídele a tu asistente que lo agregue a la lista blanca.' }) };
  }

  const auth = h['authorization'] || h['Authorization'];
  if (!auth) {
    return { statusCode: 400, headers: JSON_HEAD, body: JSON.stringify({ error: 'Falta tu clave (Authorization). Pégala en el panel.' }) };
  }

  let body = event.body;
  if (body && event.isBase64Encoded) body = Buffer.from(body, 'base64').toString('utf8');

  const init = { method: event.httpMethod, headers: { Authorization: auth, 'Content-Type': 'application/json' } };
  if (h['accept'] || h['Accept']) init.headers['Accept'] = h['accept'] || h['Accept'];
  if (event.httpMethod !== 'GET' && event.httpMethod !== 'HEAD' && body) init.body = body;

  if (typeof fetch !== 'function') {
    return { statusCode: 500, headers: JSON_HEAD, body: JSON.stringify({ error: 'Node sin fetch. En Netlify pon NODE_VERSION = 18 o 20.' }) };
  }

  try {
    const r = await fetch(target, init);
    const text = await r.text();
    return { statusCode: r.status, headers: JSON_HEAD, body: text };
  } catch (e) {
    return { statusCode: 502, headers: JSON_HEAD, body: JSON.stringify({ error: 'El puente no pudo contactar al proveedor (' + host + '): ' + e.message }) };
  }
};

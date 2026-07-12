const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Prefer, x-replicate-token',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
};
const JSON_HEAD = { ...CORS, 'Content-Type': 'application/json' };

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' };

  let sub = (event.path || '').replace(/^.*\/replicate/, '');

  if (event.httpMethod === 'GET' && (!sub || sub === '/' || sub === '/v1' || sub === '/v1/')) {
    return {
      statusCode: 200,
      headers: JSON_HEAD,
      body: JSON.stringify({
        ok: true,
        puente: 'replicate',
        mensaje: 'El puente Replicate esta vivo y publicado correctamente.',
        tokenEnVariableEntorno: !!process.env.REPLICATE_API_TOKEN,
        node: process.version
      })
    };
  }

  if (!sub || sub === '/') sub = '/v1/predictions';
  const url = 'https://api.replicate.com' + sub;

  const h = event.headers || {};

  // ── Blindaje: el token de la dueña (variable de entorno) SOLO se usa para
  //    peticiones que vengan del propio sitio. Así nadie de fuera puede llamar
  //    a este puente sin token y gastar el saldo de Replicate de Fátima.
  const origen = (h['origin'] || h['Origin'] || h['referer'] || h['Referer'] || '');
  const esDominioPropio = /(^|\/\/)([a-z0-9-]+\.)*fatimahairstudio082\.com/i.test(origen)
                       || /--aprendizajefatima\.netlify\.app/i.test(origen);

  let auth = h['authorization'] || h['Authorization'];
  if (!auth) {
    // Token pegado por el cliente (x-replicate-token): siempre válido.
    // Token de entorno: solo si la petición es del dominio propio.
    let t = h['x-replicate-token'] || h['X-Replicate-Token'];
    if (!t && esDominioPropio) t = process.env.REPLICATE_API_TOKEN;
    if (t) auth = 'Bearer ' + t;
  }
  if (!auth) {
    return { statusCode: 400, headers: JSON_HEAD,
      body: JSON.stringify({ error: 'Falta la clave de Replicate (r8_...). Pegala en la app y pulsa Enter.' }) };
  }

  let body = event.body;
  if (body && event.isBase64Encoded) body = Buffer.from(body, 'base64').toString('utf8');

  const init = { method: event.httpMethod, headers: { Authorization: auth, 'Content-Type': 'application/json' } };
  if (h['prefer'] || h['Prefer']) init.headers['Prefer'] = h['prefer'] || h['Prefer'];
  if (event.httpMethod !== 'GET' && event.httpMethod !== 'HEAD' && body) init.body = body;

  if (typeof fetch !== 'function') {
    return { statusCode: 500, headers: JSON_HEAD,
      body: JSON.stringify({ error: 'Node sin fetch. En Netlify pon NODE_VERSION = 18 o 20.' }) };
  }

  try {
    const r = await fetch(url, init);
    const text = await r.text();
    return { statusCode: r.status, headers: JSON_HEAD, body: text };
  } catch (e) {
    return { statusCode: 502, headers: JSON_HEAD,
      body: JSON.stringify({ error: 'El puente no pudo contactar con Replicate: ' + e.message }) };
  }
};

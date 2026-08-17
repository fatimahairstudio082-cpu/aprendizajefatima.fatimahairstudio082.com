/* ════════════════════════════════════════════════════════════════
   TTS (Texto a Voz) · Fátima Caldea Studio
   ----------------------------------------------------------------
   Genera audio hablado con OpenAI TTS. Devuelve un MP3 que el
   navegador puede reproducir y grabar dentro de un video.

   POST /.netlify/functions/tts
   body: { text, voice?, speed? }
   headers: Authorization (Bearer sk-...) — opcional si hay env var.

   Clave: Authorization del cliente > OPENAI_API_TOKEN env var
   (la env var SOLO se usa si la petición viene del dominio propio).
   ════════════════════════════════════════════════════════════════ */

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
};
const JSON_HEAD = { ...CORS, 'Content-Type': 'application/json' };

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS')
    return { statusCode: 200, headers: CORS, body: '' };

  if (event.httpMethod === 'GET')
    return { statusCode: 200, headers: JSON_HEAD,
      body: JSON.stringify({ ok: true, puente: 'tts', mensaje: 'TTS vivo.' }) };

  if (event.httpMethod !== 'POST')
    return { statusCode: 405, headers: JSON_HEAD,
      body: JSON.stringify({ error: 'Solo POST.' }) };

  const h = event.headers || {};
  let auth = h['authorization'] || h['Authorization'];

  if (!auth) {
    const origen = (h['origin'] || h['Origin'] || h['referer'] || h['Referer'] || '');
    const propio = /(^|\/\/)([a-z0-9-]+\.)*fatimahairstudio082\.com/i.test(origen)
                || /--aprendizajefatima\.netlify\.app/i.test(origen);
    const envKey = process.env.OPENAI_API_TOKEN || process.env.OPENAI_API_KEY;
    if (propio && envKey) auth = 'Bearer ' + envKey;
  }

  if (!auth)
    return { statusCode: 400, headers: JSON_HEAD,
      body: JSON.stringify({ error: 'Falta la clave de OpenAI. Pégala en el motor (Otros proveedores → OpenAI) o configura OPENAI_API_TOKEN en Netlify.' }) };

  let body;
  try {
    const raw = event.isBase64Encoded
      ? Buffer.from(event.body, 'base64').toString('utf8')
      : event.body;
    body = JSON.parse(raw);
  } catch (e) {
    return { statusCode: 400, headers: JSON_HEAD,
      body: JSON.stringify({ error: 'JSON inválido.' }) };
  }

  const text = (body.text || '').trim();
  if (!text)
    return { statusCode: 400, headers: JSON_HEAD,
      body: JSON.stringify({ error: 'Falta el texto.' }) };

  if (text.length > 4000)
    return { statusCode: 400, headers: JSON_HEAD,
      body: JSON.stringify({ error: 'Texto demasiado largo (máx 4000 caracteres).' }) };

  const voice = body.voice || 'nova';
  const speed = Math.max(0.25, Math.min(4.0, parseFloat(body.speed) || 1.0));

  if (typeof fetch !== 'function')
    return { statusCode: 500, headers: JSON_HEAD,
      body: JSON.stringify({ error: 'Node sin fetch. Pon NODE_VERSION = 18 o 20 en Netlify.' }) };

  try {
    const r = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: { Authorization: auth, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'tts-1',
        input: text,
        voice: voice,
        speed: speed,
        response_format: 'mp3'
      })
    });

    if (!r.ok) {
      const err = await r.text();
      return { statusCode: r.status, headers: JSON_HEAD,
        body: JSON.stringify({ error: 'OpenAI TTS: ' + err }) };
    }

    const buffer = Buffer.from(await r.arrayBuffer());
    return {
      statusCode: 200,
      headers: { ...CORS, 'Content-Type': 'audio/mpeg', 'Cache-Control': 'no-cache' },
      body: buffer.toString('base64'),
      isBase64Encoded: true
    };
  } catch (e) {
    return { statusCode: 502, headers: JSON_HEAD,
      body: JSON.stringify({ error: 'No se pudo contactar con OpenAI: ' + e.message }) };
  }
};

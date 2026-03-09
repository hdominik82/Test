// netlify/functions/config.js
// Bez zewnętrznych zależności — używa fetch wbudowanego w Node 18+

exports.handler = async (event) => {
  const CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS, body: '' };
  }

  const ADMIN_PASS = process.env.ADMIN_PASSWORD;
  if (!ADMIN_PASS) {
    return json(500, CORS, { error: 'Brak zmiennej ADMIN_PASSWORD w Netlify → Environment variables.' });
  }

  // Netlify Blobs — dostęp przez zmienne wstrzykiwane automatycznie przez runtime
  // NETLIFY_BLOBS_CONTEXT jest ustawiane automatycznie przez Netlify w trakcie wykonania funkcji
  const siteId   = process.env.SITE_ID || process.env.NETLIFY_SITE_ID;
  const token    = process.env.NETLIFY_BLOBS_CONTEXT
                    ? JSON.parse(Buffer.from(process.env.NETLIFY_BLOBS_CONTEXT, 'base64').toString()).token
                    : process.env.NETLIFY_API_TOKEN || process.env.TOKEN;
  const edgeUrl  = process.env.NETLIFY_BLOBS_CONTEXT
                    ? JSON.parse(Buffer.from(process.env.NETLIFY_BLOBS_CONTEXT, 'base64').toString()).url
                    : null;

  const STORE = 'ceva-configs';

  async function blobGet(key) {
    let url, headers;
    if (edgeUrl) {
      url = `${edgeUrl}/${encodeURIComponent(STORE)}/${encodeURIComponent(key)}`;
      headers = {};
    } else {
      url = `https://api.netlify.com/api/v1/blobs/${siteId}/${STORE}/${encodeURIComponent(key)}`;
      headers = { Authorization: `Bearer ${token}` };
    }
    const r = await fetch(url, { headers });
    if (r.status === 404) return null;
    if (!r.ok) throw new Error(`Blobs GET ${r.status}`);
    return r.json();
  }

  async function blobPut(key, value) {
    let url, headers;
    if (edgeUrl) {
      url = `${edgeUrl}/${encodeURIComponent(STORE)}/${encodeURIComponent(key)}`;
      headers = { 'Content-Type': 'application/json' };
    } else {
      url = `https://api.netlify.com/api/v1/blobs/${siteId}/${STORE}/${encodeURIComponent(key)}`;
      headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
    }
    const r = await fetch(url, { method: 'PUT', headers, body: JSON.stringify(value) });
    if (!r.ok) throw new Error(`Blobs PUT ${r.status}: ${await r.text()}`);
  }

  async function blobList() {
    let url, headers;
    if (edgeUrl) {
      url = `${edgeUrl}/${encodeURIComponent(STORE)}`;
      headers = {};
    } else {
      if (!siteId) return [];
      url = `https://api.netlify.com/api/v1/blobs/${siteId}/${STORE}`;
      headers = { Authorization: `Bearer ${token}` };
    }
    const r = await fetch(url, { headers });
    if (!r.ok) return [];
    const d = await r.json().catch(() => ({}));
    return (d.blobs || []).map(b => b.key);
  }

  // ── GET ──────────────────────────────────────────────────
  if (event.httpMethod === 'GET') {
    const location = (event.queryStringParameters || {}).location;
    try {
      if (!location) {
        const keys = await blobList();
        return json(200, { ...CORS, 'Cache-Control': 'no-cache' }, { locations: keys });
      }
      const data = await blobGet(location);
      if (!data) {
        return json(404, CORS, {
          error: `Brak konfiguracji dla: ${location}`,
          hint: 'Użyj Panelu Admina aby wysłać config.',
        });
      }
      return json(200, { ...CORS, 'Cache-Control': 'no-cache' }, data);
    } catch (e) {
      return json(500, CORS, { error: e.message });
    }
  }

  // ── POST ─────────────────────────────────────────────────
  if (event.httpMethod === 'POST') {
    let body;
    try { body = JSON.parse(event.body || '{}'); }
    catch { return json(400, CORS, { error: 'Nieprawidłowy JSON' }); }

    const { location, password, config } = body;

    if (password !== ADMIN_PASS) {
      return json(401, CORS, { error: 'Nieprawidłowe hasło administratora.' });
    }
    if (!location || !config) {
      return json(400, CORS, { error: 'Wymagane: location, password, config' });
    }

    try {
      const payload = {
        ...config,
        _meta: {
          location,
          savedAt: new Date().toISOString(),
          version: ((config._meta && config._meta.version) || 0) + 1,
        },
      };
      await blobPut(location, payload);
      return json(200, CORS, {
        ok: true,
        location,
        savedAt: payload._meta.savedAt,
        version: payload._meta.version,
      });
    } catch (e) {
      return json(500, CORS, { error: e.message });
    }
  }

  return json(405, CORS, { error: 'Method Not Allowed' });
};

function json(status, headers, body) {
  return {
    statusCode: status,
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  };
}







// netlify/functions/config.js
// GET  /api/config                    → lista lokalizacji
// GET  /api/config?location=ORA-PL-01 → config lokalizacji  
// POST /api/config                    → zapis (wymaga hasła)

const { getStore } = require('@netlify/blobs');

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

  const store = getStore('ceva-configs');

  // ── GET ──────────────────────────────────────────────────
  if (event.httpMethod === 'GET') {
    const location = (event.queryStringParameters || {}).location;
    try {
      if (!location) {
        const { blobs } = await store.list();
        const keys = blobs.map(b => b.key);
        return json(200, { ...CORS, 'Cache-Control': 'no-cache' }, { locations: keys });
      }
      const data = await store.get(location, { type: 'json' });
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
      await store.setJSON(location, payload);
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

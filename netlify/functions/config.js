// netlify/functions/config.js
// ══════════════════════════════════════════════════════════
//  GET  /api/config                     → lista lokalizacji
//  GET  /api/config?location=ORA-PL-01  → config lokalizacji
//  POST /api/config                     → zapis configa (wymaga hasła)
// ══════════════════════════════════════════════════════════

exports.handler = async (event) => {

  const CORS = {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS, body: '' };
  }

  // ── Netlify Blobs – dostęp przez REST API ─────────────────
  const SITE_ID = process.env.NETLIFY_SITE_ID;
  const TOKEN   = process.env.NETLIFY_BLOBS_TOKEN || process.env.TOKEN;
  const STORE   = 'ceva-configs';

  async function bGet(key) {
    const r = await fetch(
      `https://api.netlify.com/api/v1/blobs/${SITE_ID}/${STORE}/${encodeURIComponent(key)}`,
      { headers: { Authorization: `Bearer ${TOKEN}` } }
    );
    if (r.status === 404) return null;
    if (!r.ok) throw new Error(`Blobs GET ${r.status}: ${await r.text()}`);
    return r.json();
  }

  async function bPut(key, value) {
    const r = await fetch(
      `https://api.netlify.com/api/v1/blobs/${SITE_ID}/${STORE}/${encodeURIComponent(key)}`,
      {
        method: 'PUT',
        headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(value),
      }
    );
    if (!r.ok) throw new Error(`Blobs PUT ${r.status}: ${await r.text()}`);
  }

  async function bList() {
    const r = await fetch(
      `https://api.netlify.com/api/v1/blobs/${SITE_ID}/${STORE}`,
      { headers: { Authorization: `Bearer ${TOKEN}` } }
    );
    if (!r.ok) return [];
    const d = await r.json().catch(() => ({}));
    return (d.blobs || []).map(b => b.key);
  }

  // ── Sprawdź wymagane zmienne ──────────────────────────────
  const ADMIN_PASS = process.env.ADMIN_PASSWORD;

  if (!ADMIN_PASS) {
    return json(500, CORS, {
      error: 'Brak zmiennej ADMIN_PASSWORD. Ustaw ją w Netlify → Site configuration → Environment variables.'
    });
  }

  if (!SITE_ID) {
    return json(500, CORS, {
      error: 'Brak zmiennej NETLIFY_SITE_ID. Netlify ustawia ją automatycznie – spróbuj zrobić redeploy.'
    });
  }

  // ══════════════════════════════════════════════════════════
  // GET
  // ══════════════════════════════════════════════════════════
  if (event.httpMethod === 'GET') {
    const location = (event.queryStringParameters || {}).location;
    try {
      if (!location) {
        const keys = await bList();
        return json(200, { ...CORS, 'Cache-Control': 'no-cache' }, { locations: keys });
      }
      const config = await bGet(location);
      if (!config) {
        return json(404, CORS, {
          error: `Brak konfiguracji dla lokalizacji: ${location}`,
          hint:  'Użyj Panelu Admina (admin-config.html) aby wysłać config.'
        });
      }
      return json(200, { ...CORS, 'Cache-Control': 'no-cache' }, config);
    } catch (e) {
      return json(500, CORS, { error: e.message });
    }
  }

  // ══════════════════════════════════════════════════════════
  // POST – zapis
  // ══════════════════════════════════════════════════════════
  if (event.httpMethod === 'POST') {
    let body;
    try { body = JSON.parse(event.body || '{}'); }
    catch { return json(400, CORS, { error: 'Nieprawidłowy JSON' }); }

    const { location, password, config } = body;

    if (password !== ADMIN_PASS) {
      return json(401, CORS, { error: 'Nieprawidłowe hasło administratora.' });
    }
    if (!location || !config) {
      return json(400, CORS, { error: 'Wymagane pola: location, password, config' });
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
      await bPut(location, payload);
      return json(200, CORS, {
        ok:      true,
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

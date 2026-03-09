// netlify/functions/config.js
// Storage: GitHub API — zapisuje config jako plik JSON w repo
// Wymagane zmienne środowiskowe w Netlify:
//   ADMIN_PASSWORD  — hasło do panelu admina
//   GITHUB_TOKEN    — Personal Access Token (repo scope)
//   GITHUB_OWNER    — np. hdominik82
//   GITHUB_REPO     — np. Test

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
  const GH_TOKEN   = process.env.GITHUB_TOKEN;
  const GH_OWNER   = process.env.GITHUB_OWNER;
  const GH_REPO    = process.env.GITHUB_REPO;

  if (!ADMIN_PASS) return json(500, CORS, { error: 'Brak zmiennej ADMIN_PASSWORD' });
  if (!GH_TOKEN)   return json(500, CORS, { error: 'Brak zmiennej GITHUB_TOKEN' });
  if (!GH_OWNER)   return json(500, CORS, { error: 'Brak zmiennej GITHUB_OWNER' });
  if (!GH_REPO)    return json(500, CORS, { error: 'Brak zmiennej GITHUB_REPO' });

  const GH_BRANCH = 'main';

  function filePath(location) {
    return `configs/${location}.json`;
  }

  async function ghGet(path) {
    const r = await fetch(
      `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${path}?ref=${GH_BRANCH}`,
      { headers: { Authorization: `Bearer ${GH_TOKEN}`, Accept: 'application/vnd.github+json' } }
    );
    if (r.status === 404) return null;
    if (!r.ok) throw new Error(`GitHub GET ${r.status}: ${await r.text()}`);
    return r.json(); // zwraca { content, sha, ... }
  }

  async function ghPut(path, content, sha) {
    const body = {
      message: `Update config ${path}`,
      content: Buffer.from(JSON.stringify(content, null, 2)).toString('base64'),
      branch:  GH_BRANCH,
    };
    if (sha) body.sha = sha; // wymagane przy update

    const r = await fetch(
      `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${path}`,
      {
        method: 'PUT',
        headers: {
          Authorization:  `Bearer ${GH_TOKEN}`,
          Accept:         'application/vnd.github+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );
    if (!r.ok) throw new Error(`GitHub PUT ${r.status}: ${await r.text()}`);
    return r.json();
  }

  async function ghListConfigs() {
    const r = await fetch(
      `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/configs?ref=${GH_BRANCH}`,
      { headers: { Authorization: `Bearer ${GH_TOKEN}`, Accept: 'application/vnd.github+json' } }
    );
    if (r.status === 404) return [];
    if (!r.ok) return [];
    const files = await r.json();
    return files
      .filter(f => f.name.endsWith('.json'))
      .map(f => f.name.replace('.json', ''));
  }

  // ── GET ──────────────────────────────────────────────────
  if (event.httpMethod === 'GET') {
    const location = (event.queryStringParameters || {}).location;
    try {
      if (!location) {
        const locations = await ghListConfigs();
        return json(200, { ...CORS, 'Cache-Control': 'no-cache' }, { locations });
      }

      const file = await ghGet(filePath(location));
      if (!file) {
        return json(404, CORS, {
          error: `Brak konfiguracji dla: ${location}`,
          hint: 'Użyj Panelu Admina aby wysłać config.',
        });
      }
      const data = JSON.parse(Buffer.from(file.content, 'base64').toString('utf-8'));
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
      const path = filePath(location);

      // Pobierz SHA jeśli plik już istnieje (wymagane do update)
      const existing = await ghGet(path);
      const sha = existing ? existing.sha : undefined;

      const payload = {
        ...config,
        _meta: {
          location,
          savedAt:  new Date().toISOString(),
          version: ((config._meta && config._meta.version) || 0) + 1,
        },
      };

      await ghPut(path, payload, sha);

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

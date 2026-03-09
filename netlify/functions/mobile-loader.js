/**
 * mobile-loader.js
 * ══════════════════════════════════════════════════════════
 * Wrzuć do GŁÓWNEGO folderu repo (obok mobile-index.html).
 *
 * Następnie dodaj JEDNĄ linię do KAŻDEJ strony tabletu
 * (mobile-index.html, gemba-audit.html, 5s-audit-simple.html,
 *  problem-report.html, process-audit.html) — w sekcji <head>,
 * PRZED wszelkimi innymi skryptami:
 *
 *   <script src="/mobile-loader.js"></script>
 *
 * Co robi:
 *  1. Sprawdza lokalizację (URL ?location=KOD lub pamięć urządzenia)
 *  2. Pobiera config z /api/config?location=KOD
 *  3. Udostępnia go jako window.CEVA_CONFIG (kompatybilny z config.js)
 *  4. Tryb offline: jeśli serwer niedostępny → używa ostatniego configa
 *  5. Brak lokalizacji → pokazuje ekran wyboru
 * ══════════════════════════════════════════════════════════
 */
(function () {
  'use strict';

  var LOC_KEY = 'ceva_location';
  var CFG_PRE = 'ceva_cfg_';
  var API     = window.location.origin + '/api/config';

  /* ── helpers ───────────────────────────────────────────── */

  function getLoc() {
    var p = new URLSearchParams(window.location.search).get('location');
    if (p) { localStorage.setItem(LOC_KEY, p.toUpperCase()); return p.toUpperCase(); }
    return localStorage.getItem(LOC_KEY) || null;
  }

  function readCache(loc) {
    try { return JSON.parse(localStorage.getItem(CFG_PRE + loc)); } catch (e) { return null; }
  }

  function writeCache(loc, cfg) {
    try { localStorage.setItem(CFG_PRE + loc, JSON.stringify(cfg)); } catch (e) {}
  }

  function apply(cfg) {
    window.CEVA_CONFIG = cfg;
    try { window.dispatchEvent(new CustomEvent('ceva-config-ready', { detail: cfg })); } catch (e) {}
  }

  function toast(msg, color, persist) {
    var old = document.getElementById('_cvt');
    if (old) old.remove();
    var d = document.createElement('div');
    d.id = '_cvt';
    d.style.cssText = 'position:fixed;bottom:0;left:0;right:0;z-index:99999;'
      + 'padding:9px 16px;background:' + color + ';color:#fff;'
      + 'font:600 13px/1.4 sans-serif;text-align:center;';
    d.textContent = msg;
    document.body.appendChild(d);
    if (!persist) setTimeout(function () { if (d.parentNode) d.remove(); }, 3000);
  }

  /* ── fetch config ──────────────────────────────────────── */

  function fetchCfg(loc, cb) {
    var x = new XMLHttpRequest();
    x.open('GET', API + '?location=' + encodeURIComponent(loc), true);
    x.timeout = 8000;
    x.onload = function () {
      if (x.status === 200) {
        try { cb(null, JSON.parse(x.responseText)); }
        catch (e) { cb('Błąd parsowania odpowiedzi serwera'); }
      } else if (x.status === 404) {
        cb('Brak konfiguracji dla "' + loc + '". Użyj Panelu Admina.');
      } else {
        cb('Błąd serwera: HTTP ' + x.status);
      }
    };
    x.onerror = x.ontimeout = function () { cb('Brak połączenia z serwerem'); };
    x.send();
  }

  function fetchList(cb) {
    var x = new XMLHttpRequest();
    x.open('GET', API, true);
    x.timeout = 5000;
    x.onload = function () {
      try { cb((JSON.parse(x.responseText).locations || [])); } catch (e) { cb([]); }
    };
    x.onerror = x.ontimeout = function () { cb([]); };
    x.send();
  }

  /* ── location picker ───────────────────────────────────── */

  function showPicker() {
    fetchList(function (locs) {
      var ov = document.createElement('div');
      ov.style.cssText = 'position:fixed;inset:0;z-index:999999;'
        + 'background:linear-gradient(135deg,#021D49,#1D4289);'
        + 'display:flex;align-items:center;justify-content:center;'
        + 'font-family:sans-serif;padding:20px;';

      var selHtml = locs.length
        ? '<select id="_cvs" style="width:100%;padding:10px;border-radius:7px;border:none;'
          + 'font-size:1em;background:#fff;color:#021D49;font-weight:700;margin-bottom:8px;">'
          + '<option value="">— wybierz z listy —</option>'
          + locs.map(function (l) { return '<option>' + l + '</option>'; }).join('')
          + '</select>'
        : '<p style="font-size:.8em;opacity:.65;margin-bottom:14px;color:#fff;">Brak lokalizacji na serwerze.<br>Użyj Panelu Admina aby dodać konfigurację.</p>';

      ov.innerHTML = '<div style="background:rgba(255,255,255,.12);border-radius:14px;'
        + 'padding:28px 24px;max-width:360px;width:100%;text-align:center;color:#fff;">'
        + '<div style="font-size:2.2em;margin-bottom:8px">📍</div>'
        + '<div style="font-size:1.2em;font-weight:800;margin-bottom:5px">Wybierz lokalizację</div>'
        + '<div style="font-size:.8em;opacity:.65;margin-bottom:18px">Wybór zostanie zapamiętany na tym urządzeniu.</div>'
        + selHtml
        + '<input id="_cvi" type="text" placeholder="lub wpisz kod: ORA-PL-01"'
        + ' style="width:100%;padding:10px;border-radius:7px;border:none;font-size:1em;'
        + 'font-family:monospace;text-transform:uppercase;box-sizing:border-box;'
        + 'text-align:center;margin-bottom:12px;">'
        + '<button id="_cvb" style="width:100%;padding:12px;border-radius:7px;border:none;'
        + 'background:#4ecdc4;color:#021D49;font-size:1em;font-weight:800;cursor:pointer;">'
        + '✅ Załaduj konfigurację</button>'
        + '<div id="_cve" style="margin-top:9px;color:#fca5a5;font-size:.82em;min-height:16px;"></div>'
        + '</div>';

      document.body.appendChild(ov);

      var sel = document.getElementById('_cvs');
      var inp = document.getElementById('_cvi');
      var btn = document.getElementById('_cvb');
      var err = document.getElementById('_cve');

      if (sel) sel.onchange = function () { inp.value = sel.value.toUpperCase(); };
      inp.oninput = function () { inp.value = inp.value.toUpperCase(); };

      btn.onclick = function () {
        var loc = inp.value.trim();
        if (!loc) { err.textContent = 'Wpisz lub wybierz kod lokalizacji.'; return; }
        btn.textContent = '⏳ Ładowanie…';
        btn.disabled = true;
        err.textContent = '';
        fetchCfg(loc, function (e, cfg) {
          if (e) {
            err.textContent = '❌ ' + e;
            btn.textContent = '✅ Załaduj konfigurację';
            btn.disabled = false;
            return;
          }
          localStorage.setItem(LOC_KEY, loc);
          writeCache(loc, cfg);
          apply(cfg);
          ov.remove();
          toast('✅ Załadowano: ' + loc, '#1d4289');
        });
      };

      setTimeout(function () { inp.focus(); }, 80);
    });
  }

  /* ── init ──────────────────────────────────────────────── */

  function start() {
    var loc    = getLoc();
    var cached = loc ? readCache(loc) : null;

    // Brak lokalizacji → ekran wyboru
    if (!loc) {
      return (document.readyState === 'loading')
        ? document.addEventListener('DOMContentLoaded', showPicker)
        : showPicker();
    }

    // Mamy cache → użyj od razu, odśwież w tle
    if (cached) {
      apply(cached);
      fetchCfg(loc, function (e, fresh) {
        if (!fresh) return;
        var ov = (cached._meta && cached._meta.version) || 0;
        var nv = (fresh._meta  && fresh._meta.version)  || 0;
        writeCache(loc, fresh);
        if (nv > ov) {
          apply(fresh);
          toast('🔄 Nowy config v' + nv + ' — odśwież stronę aby zastosować', '#d97706', true);
        }
      });
      return;
    }

    // Brak cache → pobierz synchronicznie
    function doLoad() {
      toast('⏳ Pobieranie konfiguracji: ' + loc + '…', '#1d4289', true);
      fetchCfg(loc, function (e, cfg) {
        if (e) {
          toast('❌ ' + e, '#dc2626', true);
          setTimeout(function () { localStorage.removeItem(LOC_KEY); showPicker(); }, 2500);
          return;
        }
        writeCache(loc, cfg);
        apply(cfg);
        toast('✅ Załadowano: ' + loc + ' (v' + ((cfg._meta && cfg._meta.version) || '1') + ')', '#1d4289');
      });
    }

    (document.readyState === 'loading')
      ? document.addEventListener('DOMContentLoaded', doLoad)
      : doLoad();
  }

  /* ── public API ────────────────────────────────────────── */
  window.CevaLoader = {
    reload:         function () {
      var loc = localStorage.getItem(LOC_KEY);
      if (loc) fetchCfg(loc, function (e, c) { if (c) { writeCache(loc, c); apply(c); } });
    },
    changeLocation: function () { localStorage.removeItem(LOC_KEY); showPicker(); },
    getLocation:    function () { return localStorage.getItem(LOC_KEY); },
  };

  start();
})();

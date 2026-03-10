/**
 * mobile-loader.js
 * Pobiera config.js z SharePoint i wstrzykuje dane do CEVA_CONFIG
 * 
 * Dodaj jako PIERWSZY skrypt w każdej stronie tabletu:
 *   <script src="/mobile-loader.js"></script>
 *   <script src="/config.js"></script>  ← fallback lokalny
 */
(function () {
  'use strict';

  var SHAREPOINT_CONFIG_URL = 'https://cevalogisticsoffice365.sharepoint.com/sites/AuditTool/Shared%20Documents/ORA-PL-01_Orange/Test%20ConfigTablet/config.js';
  var CACHE_KEY = 'ceva_sp_config';
  var CACHE_TS  = 'ceva_sp_config_ts';
  var CACHE_TTL = 5 * 60 * 1000; // 5 minut

  function readCache() {
    try {
      var ts = parseInt(localStorage.getItem(CACHE_TS) || '0');
      if (Date.now() - ts > CACHE_TTL) return null;
      var txt = localStorage.getItem(CACHE_KEY);
      return txt || null;
    } catch(e) { return null; }
  }

  function writeCache(txt) {
    try {
      localStorage.setItem(CACHE_KEY, txt);
      localStorage.setItem(CACHE_TS, Date.now().toString());
    } catch(e) {}
  }

  function clearCache() {
    try { localStorage.removeItem(CACHE_KEY); localStorage.removeItem(CACHE_TS); } catch(e) {}
  }

  function applyConfigText(txt) {
    try {
      // Wykonaj skrypt — nadpisze globalny CEVA_CONFIG
      var fn = new Function(txt);
      fn();
      toast('✅ Config załadowany z SharePoint', '#16a34a');
    } catch(e) {
      toast('⚠️ Błąd parsowania config z SharePoint: ' + e.message, '#d97706');
    }
  }

  function fetchFromSharePoint(cb) {
    var x = new XMLHttpRequest();
    x.open('GET', SHAREPOINT_CONFIG_URL + '?t=' + Date.now(), true);
    x.withCredentials = true; // wymagane dla SharePoint — używa ciasteczek logowania
    x.timeout = 10000;
    x.onload = function() {
      if (x.status === 200) {
        cb(null, x.responseText);
      } else {
        cb('HTTP ' + x.status);
      }
    };
    x.onerror  = function() { cb('Brak połączenia'); };
    x.ontimeout = function() { cb('Timeout'); };
    x.send();
  }

  function toast(msg, color) {
    var old = document.getElementById('_sptoast');
    if (old) old.remove();
    var d = document.createElement('div');
    d.id = '_sptoast';
    d.style.cssText = 'position:fixed;bottom:0;left:0;right:0;z-index:99999;'
      + 'padding:9px 16px;background:' + color + ';color:#fff;'
      + 'font:600 13px/1.4 sans-serif;text-align:center;';
    d.textContent = msg;
    document.body.appendChild(d);
    setTimeout(function() { if (d.parentNode) d.remove(); }, 3000);
  }

  function start() {
    var params = new URLSearchParams(window.location.search);
    var force  = params.get('refresh') === '1';

    if (!force) {
      var cached = readCache();
      if (cached) {
        // Zastosuj cache od razu
        applyConfigText(cached);
        // Odśwież w tle
        fetchFromSharePoint(function(err, txt) {
          if (!err && txt) {
            writeCache(txt);
            applyConfigText(txt);
          }
        });
        return;
      }
    } else {
      clearCache();
    }

    // Brak cache lub force — pobierz od razu
    function doLoad() {
      fetchFromSharePoint(function(err, txt) {
        if (err) {
          toast('⚠️ Nie można pobrać config z SharePoint (' + err + ') — używam lokalnego', '#d97706');
          return; // fallback: lokalny config.js załaduje się normalnie
        }
        writeCache(txt);
        applyConfigText(txt);
      });
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', doLoad);
    } else {
      doLoad();
    }
  }

  // Publiczne API
  window.CevaLoader = {
    reload: function() { clearCache(); location.reload(); },
    clearCache: clearCache
  };

  start();
})();

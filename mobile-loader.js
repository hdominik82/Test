/**
 * mobile-loader.js v3
 * Czyta config zapisany lokalnie przez load-config.html
 * Brak zależności od internetu / SharePoint / GitHub
 *
 * Dodaj jako PIERWSZY skrypt w każdej stronie tabletu:
 *   <script src="/mobile-loader.js"></script>
 *   <script src="/config.js"></script>
 */
(function () {
  'use strict';

  var CACHE_KEY = 'ceva_local_config';

  function readLocal() {
    try { return JSON.parse(localStorage.getItem(CACHE_KEY)); }
    catch(e) { return null; }
  }

  function toast(msg, color, persist) {
    var old = document.getElementById('_cvt');
    if (old) old.remove();
    var d = document.createElement('div');
    d.id = '_cvt';
    d.style.cssText = 'position:fixed;bottom:0;left:0;right:0;z-index:99999;'
      + 'padding:10px 16px;background:' + color + ';color:#fff;'
      + 'font:600 13px/1.4 sans-serif;text-align:center;cursor:pointer;';
    d.textContent = msg;
    d.onclick = function(){ d.remove(); };
    document.body.appendChild(d);
    if (!persist) setTimeout(function(){ if(d.parentNode) d.remove(); }, 4000);
  }

  function applyConfig(cfg) {
    if (!cfg) return;
    var loc = cfg.location || (cfg._meta && cfg._meta.location);

    // Czekaj aż config.js załaduje CEVA_CONFIG
    function inject() {
      if (typeof CEVA_CONFIG === 'undefined' || !CEVA_CONFIG.branches) {
        setTimeout(inject, 30);
        return;
      }

      // Utwórz lub zaktualizuj branch
      if (!CEVA_CONFIG.branches[loc]) CEVA_CONFIG.branches[loc] = {};
      var b = CEVA_CONFIG.branches[loc];

      if (cfg.zones)              b.zones              = cfg.zones;
      if (cfg.auditors)           b.auditors           = cfg.auditors;
      if (cfg.auditors5S)         b.auditors5S         = cfg.auditors5S;
      if (cfg.gembaParticipants)  b.gembaParticipants  = cfg.gembaParticipants;
      if (cfg.gembaQuestions)     b.gembaQuestions     = cfg.gembaQuestions;

      // Ustaw jako aktywny branch
      CEVA_CONFIG.defaultBranch = loc;
      CEVA_CONFIG.getCurrentBranch = function() {
        return CEVA_CONFIG.branches[loc];
      };

      window.dispatchEvent(new CustomEvent('ceva-config-ready', { detail: cfg }));
    }

    inject();
  }

  function showNoConfigBanner() {
    function doShow() {
      var d = document.createElement('div');
      d.style.cssText = 'position:fixed;inset:0;z-index:999999;background:linear-gradient(135deg,#021D49,#1D4289);'
        + 'display:flex;align-items:center;justify-content:center;font-family:sans-serif;padding:20px;';
      d.innerHTML = '<div style="background:rgba(255,255,255,.12);border-radius:14px;padding:28px 24px;'
        + 'max-width:360px;width:100%;text-align:center;color:#fff;">'
        + '<div style="font-size:2.5em;margin-bottom:12px">⚙️</div>'
        + '<div style="font-size:1.2em;font-weight:800;margin-bottom:8px">Brak konfiguracji</div>'
        + '<div style="font-size:.85em;opacity:.8;margin-bottom:20px;line-height:1.6">'
        + 'Poproś administratora o wysłanie linku konfiguracyjnego dla tego urządzenia.</div>'
        + '<div style="font-size:.78em;opacity:.6;background:rgba(0,0,0,.2);border-radius:8px;padding:10px;">'
        + 'Po otrzymaniu linku — otwórz go w tej przeglądarce aby załadować konfigurację.</div>'
        + '</div>';
      document.body.appendChild(d);
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', doShow);
    } else {
      doShow();
    }
  }

  function start() {
    var cfg = readLocal();

    if (!cfg) {
      // Brak lokalnego config — pokaż komunikat
      showNoConfigBanner();
      return;
    }

    // Mamy lokalny config — zastosuj
    applyConfig(cfg);

    var v   = cfg._meta && cfg._meta.version  ? 'v' + cfg._meta.version  : '';
    var loc = cfg.location || '';
    var savedAt = cfg._meta && cfg._meta.savedAt
      ? new Date(cfg._meta.savedAt).toLocaleString('pl-PL') : '';

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function(){
        toast('✅ Config ' + loc + ' ' + v + (savedAt ? ' (' + savedAt + ')' : ''), '#16a34a');
      });
    } else {
      toast('✅ Config ' + loc + ' ' + v + (savedAt ? ' (' + savedAt + ')' : ''), '#16a34a');
    }
  }

  // Publiczne API
  window.CevaLoader = {
    clearConfig: function() {
      localStorage.removeItem(CACHE_KEY);
      location.reload();
    },
    getConfig: readLocal
  };

  start();
})();

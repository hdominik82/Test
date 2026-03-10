/**
 * mobile-loader.js v4
 * Musi być załadowany PRZED config.js
 * Czyta lokalny config i nadpisuje CEVA_CONFIG po jego załadowaniu
 */
(function () {
  'use strict';

  var CACHE_KEY = 'ceva_local_config';

  function readLocal() {
    try { return JSON.parse(localStorage.getItem(CACHE_KEY)); }
    catch(e) { return null; }
  }

  function toast(msg, color) {
    function doToast() {
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
      setTimeout(function(){ if(d.parentNode) d.remove(); }, 5000);
    }
    if (document.body) doToast();
    else document.addEventListener('DOMContentLoaded', doToast);
  }

  function applyToDOM(cfg) {
    // Aktualizuj widoczne elementy na stronie jeśli istnieją
    var loc = cfg.location || '';
    var branch = cfg;

    var branchName = document.getElementById('branchName');
    var branchCode = document.getElementById('branchCode');
    if (branchName) branchName.textContent = cfg.fullName || cfg.name || loc;
    if (branchCode) branchCode.textContent = loc + (cfg.country ? ' - ' + cfg.country : '');
  }

  function patchCevaConfig(cfg) {
    var loc = cfg.location || (cfg._meta && cfg._meta.location) || '';

    // Buduj obiekt branch z danych lokalnego config
    var branch = {
      code:             cfg.code || loc,
      name:             cfg.name || loc,
      fullName:         cfg.fullName || cfg.name || loc,
      country:          cfg.country || '',
      sharePointFolder: cfg.sharePointFolder || loc,
      zones:            cfg.zones || [],
      auditors:         cfg.auditors || [],
      auditors5S:       cfg.auditors5S || [],
      gembaParticipants:cfg.gembaParticipants || {level1:[],level2:[],level3:[]},
      gembaQuestions:   cfg.gembaQuestions || {},
      instructions:     cfg.instructions || [],
      problemCategories:cfg.problemCategories || ['5S','Bezpieczeństwo','Jakość','Produktywność','Inne']
    };

    function patch() {
      if (typeof CEVA_CONFIG === 'undefined') {
        setTimeout(patch, 20);
        return;
      }

      // Wstrzyknij branch
      if (!CEVA_CONFIG.branches) CEVA_CONFIG.branches = {};
      CEVA_CONFIG.branches[loc] = branch;
      CEVA_CONFIG.defaultBranch = loc;

      // Nadpisz getCurrentBranch — zwraca ZAWSZE nasz branch
      CEVA_CONFIG.getCurrentBranch = function() {
        return CEVA_CONFIG.branches[loc];
      };

      // Aktualizuj DOM jeśli już załadowany
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function(){ applyToDOM(branch); });
      } else {
        applyToDOM(branch);
      }

      // Wyemituj event dla innych skryptów
      try {
        window.dispatchEvent(new CustomEvent('ceva-config-ready', { detail: cfg }));
      } catch(e) {}
    }

    patch();
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
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', doShow);
    else doShow();
  }

  var cfg = readLocal();

  if (!cfg) {
    showNoConfigBanner();
  } else {
    // Patch CEVA_CONFIG od razu — jeszcze przed DOMContentLoaded
    patchCevaConfig(cfg);

    var v   = cfg._meta && cfg._meta.version ? 'v' + cfg._meta.version : '';
    var loc = cfg.location || '';
    var dt  = cfg._meta && cfg._meta.savedAt
      ? new Date(cfg._meta.savedAt).toLocaleString('pl-PL') : '';
    toast('✅ Config: ' + loc + ' ' + v + (dt ? ' (' + dt + ')' : ''), '#16a34a');
  }

  window.CevaLoader = {
    clearConfig: function() { localStorage.removeItem(CACHE_KEY); location.reload(); },
    getConfig:   readLocal
  };

})();

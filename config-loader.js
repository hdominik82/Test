/**
 * config-loader.js v2
 * Czyta dane z localStorage/sessionStorage (zapisane przez import-config.html)
 * Dodaj po <script src="config.js"></script> w każdym module HTML
 */
(function () {
  var KEY = 'ceva_cfg';
  try {
    var raw = localStorage.getItem(KEY) || sessionStorage.getItem(KEY);
    if (!raw) return;
    var d = JSON.parse(raw);
    var loc = d.location;
    if (!loc || typeof CEVA_CONFIG === 'undefined') return;
    if (!CEVA_CONFIG.branches[loc]) CEVA_CONFIG.branches[loc] = {};
    var b = CEVA_CONFIG.branches[loc];
    ['zones','auditors','auditors5S','gembaParticipants','gembaQuestions',
     'instructions','problemCategories','code','name','fullName','country'].forEach(function(k){
      if (d[k] !== undefined) b[k] = d[k];
    });
    CEVA_CONFIG.defaultBranch = loc;
    CEVA_CONFIG.getCurrentBranch = function () { return CEVA_CONFIG.branches[loc]; };
    console.log('[CEVA] Config loaded:', loc, d._v ? 'v'+d._v : '');
  } catch (e) { console.warn('[CEVA] config-loader error:', e); }
})();

/**
 * config-loader.js — czyta dane z localStorage (zapisane przez import-config.html)
 * Dołącz do każdego modułu HTML: <script src="config-loader.js"></script>
 * Musi być załadowany PO config.js
 */
(function () {
  var KEY = 'ceva_cfg';
  try {
    var raw = localStorage.getItem(KEY);
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
    console.log('[CEVA] Config loaded from local storage:', loc, d._v ? 'v'+d._v : '');
  } catch (e) { console.warn('[CEVA] config-loader error:', e); }
})();

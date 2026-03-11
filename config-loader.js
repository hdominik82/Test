/**
 * config-loader.js — CEVA Android Chrome v1.0
 * Czyta konfigurację z localStorage (zapisaną przez import-config.html)
 * i nadpisuje dane w CEVA_CONFIG
 */
(function () {
  var KEY = 'ceva_cfg';

  try {
    var raw = localStorage.getItem(KEY);
    if (!raw) return; // brak danych — config.js działa domyślnie

    var data = JSON.parse(raw);
    if (!data || !data.location) return;

    var loc = data.location;

    // Upewnij się że branch istnieje
    if (!CEVA_CONFIG.branches[loc]) {
      CEVA_CONFIG.branches[loc] = {};
    }

    var b = CEVA_CONFIG.branches[loc];

    // Nadpisz dane z localStorage
    if (data.zones)             b.zones             = data.zones;
    if (data.auditors)          b.auditors          = data.auditors;
    if (data.auditors5S)        b.auditors5S        = data.auditors5S;
    if (data.instructions)      b.instructions      = data.instructions;
    if (data.gembaParticipants) b.gembaParticipants = data.gembaParticipants;
    if (data.gembaQuestions)    b.gembaQuestions    = data.gembaQuestions;
    if (data.problemCategories) b.problemCategories = data.problemCategories;
    if (data.name)              b.name              = data.name;
    if (data.fullName)          b.fullName          = data.fullName;
    if (data.country)           b.country           = data.country;
    if (data.sharePointFolder)  b.sharePointFolder  = data.sharePointFolder;

    // Ustaw aktywną lokalizację
    CEVA_CONFIG.defaultBranch = loc;
    CEVA_CONFIG.getCurrentBranch = function () {
      return CEVA_CONFIG.branches[loc];
    };

  } catch (e) {
    console.warn('[CEVA config-loader] Błąd:', e.message);
  }
})();

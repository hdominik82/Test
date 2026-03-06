# CEVA Logistics - System Audytów i Zarządzania

System audytów i zarządzania procesami dla oddziału **ORA-PL-01 Orange**.

## 📱 Architektura

### Mobile (Audyty w terenie)
- **5S Audit** - Audyty miesięczne 5S dla stref
- **GEMBA Walk** - Obserwacje miejsca pracy + 7 strat LEAN
- **Process Audit** - Audyty procesów i instrukcji (do uzupełnienia pytaniami)
- **Problem Report** - Zgłaszanie problemów

### Desktop (Zarządzanie)
- **Action Plan** - Plan działań (zbiera dane z Mobile)
- **Competency Matrix** - Macierz kompetencji
- **Training** - System szkoleń i wdrożeń
- **Knowledge Tests** - Testy wiedzy (BHP, Kaizen, Środowisko, Compliance)

## 🏢 Konfiguracja ORA-PL-01 Orange

### Strefy (5):
1. Inbound - Jan Surwilo (cel: 90%)
2. Odnowa - Konrad Kasinski (cel: 90%)
3. Zwroty - Mariusz Maciah (cel: 90%)
4. B2B - Dominik Harezlak (cel: 90%)
5. B2C - Patryk Krzeminski (cel: 90%)

### Audytorzy:
- Jan Surwilo
- Konrad Kasinski
- Mariusz Maciah
- Dominik Harezlak
- Patryk Krzeminski

## 🚀 Wdrożenie na Railway

### Krok 1: Przygotowanie
1. Zaloguj się na https://railway.app
2. Zaloguj przez GitHub (użyj konta hdominik82)

### Krok 2: Deploy
1. Kliknij **"New Project"**
2. Wybierz **"Deploy from GitHub repo"**
3. Wybierz **"hdominik82/ceva-audits-system"**
4. Railway automatycznie wykryje static site
5. Kliknij **"Deploy"**

### Krok 3: Konfiguracja
1. Po deploy kliknij projekt
2. Wejdź w **"Settings"**
3. Sekcja **"Domains"** → **"Generate Domain"**
4. Dostaniesz link typu: `ceva-audits-system.up.railway.app`

### Krok 4: Dostęp
- **Mobile:** https://twoja-domena.railway.app/mobile-index.html
- **Desktop:** https://twoja-domena.railway.app/index.html

## 💾 Synchronizacja danych

System używa localStorage (dane w przeglądarce). Synchronizacja:

1. **Eksport:** Kliknij "Eksport danych" na stronie głównej
2. Zapisz plik JSON
3. Udostępnij przez OneDrive/SharePoint
4. **Import:** Inni użytkownicy pobierają plik i klikają "Import danych"

## 📝 Pozostałe do uzupełnienia

### Process Audit
Plik `process-audit.html` czeka na pytania audytowe. Dodaj je jutro.

### GEMBA Walk
Gotowy z kategoriami:
- BHP
- Jakość
- 5S
- Standard Pracy
- 7 Strat LEAN (Nadprodukcja, Oczekiwanie, Transport, etc.)
- Inne

## 🔧 Rozbudowa w przyszłości

### Dodawanie kolejnych oddziałów
Edytuj plik `config.js` - dodaj nowy oddział:
```javascript
'KRA-PL-02': {
    code: 'KRA-PL-02',
    name: 'Kraków',
    zones: [...],
    auditors: [...]
}

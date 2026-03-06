// KONFIGURACJA SYSTEMU AUDYTÓW CEVA
// Wersja: 2.2 - Multi-branch z danymi z Excel + Instrukcje
// Ostatnia aktualizacja: 2025-11-06

const CEVA_CONFIG = {
    // SharePoint URLs
    sharePointSite: 'https://cevalogisticsoffice365.sharepoint.com/sites/AuditTool',
    sharePointDocuments: 'Shared%20Documents',
    
    // Generowanie pełnego URL do folderu SharePoint
    getSharePointFolderUrl: function(branchCode, folderType) {
        const branch = this.branches[branchCode];
        if (!branch) return this.sharePointSite;
        
        const folderName = this.folders[folderType];
        return `${this.sharePointSite}/${this.sharePointDocuments}/Forms/AllItems.aspx?id=%2Fsites%2FAuditTool%2F${this.sharePointDocuments}%2F${branch.sharePointFolder}%2F${folderName}`;
    },
    
    // Nazwy folderów SharePoint (standard dla wszystkich oddziałów)
    folders: {
        fiveS: '5S',
        gemba: 'Gemba',
        process: 'Process',
        problems: 'Problems'
    },
    
    // Konfiguracja oddziałów
    branches: {
        'ORA-PL-01': {
            code: 'ORA-PL-01',
            name: 'Orange',
            country: 'PL',
            fullName: 'CEVA Orange Poland',
            sharePointFolder: 'ORA-PL-01_Orange',
            
            // Strefy/obszary w oddziale
            zones: [
                {id: 1, name: 'B2C', responsible: 'Jan Surwilo', target: 90},
                {id: 2, name: 'B2B', responsible: 'Dominik Harezlak', target: 90},
                {id: 3, name: 'ZWROTY', responsible: 'Mariusz Maciąg', target: 90},
                {id: 4, name: 'ODNOWA', responsible: 'Konrad Kasinski', target: 90},
                {id: 5, name: 'PRZYJĘCIA/ VAS', responsible: 'Jan Surwilo', target: 90},
                {id: 6, name: 'ZEWNĄTRZ BUDYNKU', responsible: 'Piotr Żebrowski', target: 90},
                {id: 7, name: 'ŚREDNI WYNIK MAGAZYNU', responsible: 'Jan Surwilo', target: 90}
            ],
            
            // Lista audytorów (do audytów Process i problemów)
            auditors: [
                'Jan Surwilo',
                'Renata Zegarek',
                'Janusz Mandes',
                'Jaroslaw Domanski',
                'Rober Zach',
                'Iwona Kaluza',
                'Grzegorz Oniszczuk',
                'Rafal Nowak'
            ],
            
            // Lista audytorów 5S
            auditors5S: [
                'PAWEŁ ADAMCZYK',
                'NATALIA FUDAŁA',
                'MONIKA SOCHA',
                'JOANNA KEMPCZYŃSKA',
                'ANNA KAPLER',
                'PIOTR ŻEBROWSKI',
                'JAN SURWIŁO'
            ],
            
            // INSTRUKCJE - struktura z danych Excel
            instructions: [
                {code: 'PL-WI-CL-OPL-046', name: 'Putaway systemowy', department: 'Inbound', process: 'Przyjecie IN', assigned: true},
                {code: 'PL-WI-CL-OPL-046', name: 'Putaway systemowy', department: 'REFURBISHMENT', process: 'Admin REF', assigned: true},
                {code: 'PL-WI-CL-OPL-046', name: 'Putaway systemowy', department: 'RETURNS', process: 'Przyjęcie RET', assigned: true},
                {code: 'PL-WI-CL-OPL-026', name: 'Testing', department: 'Inbound', process: 'KJ', assigned: true},
                {code: 'PL-WI-CL-OPL-027', name: 'Sposób postępowania z produktem niezgodnym - dział INBOUND', department: 'Inbound', process: 'PN', assigned: true},
                {code: 'PL-WI-CL-OPL-028', name: 'Rozładunek i załadunek dostawy', department: 'Inbound', process: 'Relokacja IN', assigned: true},
                {code: 'PL-WI-CL-OPL-029', name: 'Relokacja za pomocą skanera', department: 'Inbound', process: 'Relokacja IN', assigned: true},
                {code: 'PL-WI-CL-OPL-029', name: 'Relokacja za pomocą skanera', department: 'B2B', process: 'Relokacja B2B', assigned: true},
                {code: 'PL-WI-CL-OPL-029', name: 'Relokacja za pomocą skanera', department: 'REFURBISHMENT', process: 'Relokacja REF', assigned: true},
                {code: 'PL-WI-CL-OPL-029', name: 'Relokacja za pomocą skanera', department: 'RETURNS', process: 'Relokacja RET', assigned: true},
                {code: 'PL-WI-CL-OPL-030', name: 'Przyjęcie podstawowe', department: 'Inbound', process: 'Przyjecie IN', assigned: true},
                {code: 'PL-WI-CL-OPL-030', name: 'Przyjęcie podstawowe', department: 'REFURBISHMENT', process: 'Admin REF', assigned: true},
                {code: 'PL-WI-CL-OPL-030', name: 'Przyjęcie podstawowe', department: 'RETURNS', process: 'Przyjęcie RET', assigned: true},
                {code: 'PL-WI-CL-OPL-032', name: 'Opisywanie i relokacja towaru z B2C-ZW', department: 'Inbound', process: 'Przyjecie IN', assigned: true},
                {code: 'PL-WI-CL-OPL-031', name: 'Proces SHELB VAS', department: 'VAS', process: 'VAS', assigned: true},
                {code: 'PL-WI-CL-OPL-033', name: 'Oklejanie asortymentu na VAS', department: 'VAS', process: 'VAS', assigned: true},
                {code: 'PL-WI-CL-OPL-040', name: 'Alokacja towaru do zleceń', department: 'B2B', process: 'Admin B2B', assigned: true},
                {code: 'PL-WI-CL-OPL-040', name: 'Alokacja towaru do zleceń', department: 'B2C', process: 'Admin B2C', assigned: true},
                {code: 'PL-WI-CL-OPL-040', name: 'Alokacja towaru do zleceń', department: 'RETURNS', process: 'Admin RET', assigned: true},
                {code: 'PL-WI-CL-OPL-052', name: 'Ręczna alokacja zamówień w WMS', department: 'B2B', process: 'Admin B2B', assigned: true},
                {code: 'PL-WI-CL-OPL-052', name: 'Ręczna alokacja zamówień w WMS', department: 'REFURBISHMENT', process: 'Admin REF', assigned: true},
                {code: 'PL-WI-CL-OPL-052', name: 'Ręczna alokacja zamówień w WMS', department: 'RETURNS', process: 'Admin RET', assigned: true},
                {code: 'PL-WI-CL-OPL-047', name: 'Pick Face', department: 'B2B', process: 'Admin B2B', assigned: true},
                {code: 'PL-WI-CL-OPL-002', name: 'Repack zamówień B2B', department: 'B2B', process: 'Pakowanie B2B', assigned: true},
                {code: 'PL-WI-CL-OPL-002', name: 'Repack zamówień B2B', department: 'REFURBISHMENT', process: 'Admin REF', assigned: true},
                {code: 'PL-WI-CL-OPL-005', name: 'Sposób postępowania z produktem niezgodnym dział B2B Internal', department: 'B2B', process: 'PN', assigned: true},
                {code: 'PL-WI-CL-OPL-006', name: 'Wymiana pokryw w pojemnikach transportowych', department: 'B2B', process: 'Wymiana Pokryw', assigned: true},
                {code: 'PL-WI-CL-OPL-001', name: 'Pobranie towaru z lokalizacji - Automatyka', department: 'B2B', process: 'Pobranie B2B', assigned: true},
                {code: 'PL-WI-CL-OPL-007', name: 'Przypisanie kontenera do zamówienia', department: 'B2B', process: 'Pobranie B2B', assigned: true},
                {code: 'PL-WI-CL-OPL-008', name: 'Pobranie towaru z lokalizacji', department: 'B2B', process: 'Pobranie B2B', assigned: true},
                {code: 'PL-WI-CL-OPL-008', name: 'Pobranie towaru z lokalizacji', department: 'REFURBISHMENT', process: 'Relokacja REF', assigned: true},
                {code: 'PL-WI-CL-OPL-042', name: 'Replenishment', department: 'B2B', process: 'Relokacja B2B', assigned: true},
                {code: 'PL-WI-CL-OPL-061-EXT', name: 'Instrukcja wymiany obudowy i pasty termoprzewodzącej dla urządzenia IWU200', department: 'REFURBISHMENT', process: 'Czyszczenie', assigned: true},
                {code: 'PL-WI-CL-OPL-058-EXT', name: 'Instrukcja testowania dla urządzenia ICU 100', department: 'REFURBISHMENT', process: 'Testowanie', assigned: true},
                {code: 'PL-WI-CL-OPL-063-EXT', name: 'Instrukcja czyszczenia dla urządzenia ICU 100', department: 'REFURBISHMENT', process: 'Czyszczenie', assigned: true},
                {code: 'PL-WI-CL-OPL-065-EXT', name: 'Instrukcja pakowania dla urządzenia ICU 100', department: 'REFURBISHMENT', process: 'Pakowanie REF', assigned: true},
                {code: 'PL-WI-CL-OPL-057-EXT', name: 'Instrukcja testowania dla urządzenia Funbox 3', department: 'REFURBISHMENT', process: 'Testowanie', assigned: true},
                {code: 'PL-WI-CL-OPL-064-EXT', name: 'Instrukcja czyszczenia dla urządzenie Funbox 3', department: 'REFURBISHMENT', process: 'Czyszczenie', assigned: true},
                {code: 'PL-WI-CL-OPL-068-EXT', name: 'Instrukcja pakowania dla urządzenia Funbox 3', department: 'REFURBISHMENT', process: 'Pakowanie REF', assigned: true},
                {code: 'PL-WI-CL-OPL-056-EXT', name: 'Instrukcja testowania dla urządzenia IWU200', department: 'REFURBISHMENT', process: 'Testowanie', assigned: true},
                {code: 'PL-WI-CL-OPL-062-EXT', name: 'Instrukcja czyszczenia dla urządzenia IWU200', department: 'REFURBISHMENT', process: 'Czyszczenie', assigned: true},
                {code: 'PL-WI-CL-OPL-070-EXT', name: 'Instrukcja pakowania dla urządzenia IWU200', department: 'REFURBISHMENT', process: 'Pakowanie REF', assigned: true},
                {code: 'PL-WI-CL-OPL-069-EXT', name: 'Instrukcja pakowania dla urządzenia WHD 80', department: 'REFURBISHMENT', process: 'Pakowanie REF', assigned: true},
                {code: 'PL-WI-CL-OPL-066-EXT', name: 'Instrukcja czyszczenia dla urządzenia WHD 80', department: 'REFURBISHMENT', process: 'Czyszczenie', assigned: true},
                {code: 'PL-WI-CL-OPL-060-EXT', name: 'Instrukcja testowania dla urządzenia WHD 80', department: 'REFURBISHMENT', process: 'Testowanie', assigned: true},
                {code: 'PL-WI-CL-OPL-067-EXT', name: 'Instrukcja czyszczenia dla urządzenia Funbox 2', department: 'REFURBISHMENT', process: 'Czyszczenie', assigned: true},
                {code: 'PL-WI-CL-OPL-072-EXT', name: 'Instrukcja pakowania dla urządzenia FUNBOX', department: 'REFURBISHMENT', process: 'Pakowanie REF', assigned: true},
                {code: 'PL-WI-CL-OPL-059-EXT', name: 'Instrukcja testowania dla urządzenia FUNBOX', department: 'REFURBISHMENT', process: 'Testowanie', assigned: true},
                {code: 'PL-WI-CL-OPL-015', name: 'Realizacja zamówień dokumentowych B2C', department: 'B2C', process: 'Pakowanie B2C', assigned: true},
                {code: 'PL-WI-CL-OPL-016', name: 'Realizacja zamówień NJU MOBILE', department: 'B2C', process: 'Pakowanie B2C', assigned: true},
                {code: 'PL-WI-CL-OPL-017', name: 'Realizacja zamówień z produktem', department: 'B2C', process: 'Pakowanie B2C', assigned: true},
                {code: 'PL-WI-CL-OPL-018', name: 'Rozpisywanie dokumentów', department: 'B2C', process: 'Pakowanie B2C', assigned: true},
                {code: 'PL-WI-CL-OPL-019', name: 'Relokacja za pomocą skanera na linię B2C', department: 'B2C', process: 'Relokacja B2C', assigned: true},
                {code: 'PL-WI-CL-OPL-035', name: 'Transport paczek do strefy wysyłki', department: 'B2B', process: 'Pakowanie B2B', assigned: true},
                {code: 'PL-WI-CL-OPL-035', name: 'Transport paczek do strefy wysyłki', department: 'B2C', process: 'Pakowanie B2C', assigned: true},
                {code: 'PL-WI-CL-OPL-024', name: 'Odbiory własne SBE Broker Utylizacja', department: 'RETURNS', process: 'Admin RET', assigned: true},
                {code: 'PL-WI-CL-OPL-025-EXT', name: 'Przyjęcie paczek od kuriera', department: 'RETURNS', process: 'Odbiór kurier', assigned: true},
                {code: 'PL-WI-CL-OPL-043-EXT', name: 'Rejestracja zwrotów i odbić z kanału B2C oraz B2B', department: 'RETURNS', process: 'Przyjęcie B2C', assigned: true},
                {code: 'PL-WI-CL-OPL-074-EXT', name: 'Opiniowanie zwrotów oczekujących na decyzję', department: 'RETURNS', process: 'Opiniowanie', assigned: true},
                {code: 'PL-WI-CL-OPL-073-EXT', name: 'Rejestracja i przyjęcie zwrotów z POS', department: 'RETURNS', process: 'Przyjęcie POS', assigned: true},
                {code: 'PL-WI-CL-OPL-075', name: 'Reklamacje zwroty z POS', department: 'RETURNS', process: 'Reklamacja POS', assigned: true},
                {code: 'PL-WI-CL-OPL-045', name: 'Produktywność B2C', department: 'B2C', process: 'Admin B2C', assigned: true},
                {code: 'PL-WI-CL-OPL-020', name: 'Porównanie stanów magazynowych', department: 'INVENTORY', process: 'Admin INV', assigned: true},
                {code: 'PL-WI-CL-OPL-021', name: 'Stock Check', department: 'INVENTORY', process: 'Inwetaryzacja', assigned: true},
                {code: 'PL-WI-CL-OPL-022', name: 'Zgłaszanie braków do Ochrony', department: 'INVENTORY', process: 'Admin INV', assigned: true},
                {code: 'PL-WI-CL-OPL-023', name: 'Tworzenie raportu zgodności pustych lokalizacji', department: 'INVENTORY', process: 'Admin INV', assigned: true},
                {code: 'PL-WI-CL-OPL-011', name: 'Przygotowanie WZ oraz FV do reklamacji do przewoźnika', department: 'QUALITY', process: 'Reklamacja MC', assigned: true},
                {code: 'PL-WI-CL-OPL-004', name: 'Organizacja pracy z użyciem systemu atlas', department: 'MAGAZYN', process: 'Operator wózka', assigned: true},
                {code: 'PL-WI-CL-OPL-009', name: 'Obsługa bazy reklamacji CEVA', department: 'QUALITY', process: 'Reklamacja MC', assigned: true},
                {code: 'PL-WI-CL-OPL-010', name: 'Historia transakcji magazynowych w systemie WMS', department: 'QUALITY', process: 'Reklamacja MC', assigned: true},
                {code: 'PL-WI-CL-OPL-012', name: 'Składanie reklamacji DPD', department: 'QUALITY', process: 'Reklamacja MC', assigned: true},
                {code: 'PL-WI-CL-OPL-013', name: 'Wydruk danych z systemu WMS', department: 'QUALITY', process: 'Reklamacja MC', assigned: true},
                {code: 'PL-WI-CL-OPL-014', name: 'Zarządzanie systemem bezpieczeństwa', department: 'QUALITY', process: 'Ochrona', assigned: true},
                {code: 'PL-WI-CL-OPL-034', name: 'Rejestracja czasu pracy', department: 'HR', process: 'HR', assigned: true},
                {code: 'PL-WI-CL-OPL-036', name: 'Uzupełnianie wody demineralizowanej w akumulatorze wózka jezdniowego', department: 'MAGAZYN', process: 'Operator wózka', assigned: true},
                {code: 'PL-WI-CL-OPL-037', name: 'Oragnizacja pracy operatorów wózków jezdniowych', department: 'MAGAZYN', process: 'Operator wózka', assigned: true},
                {code: 'PL-WI-CL-OPL-038', name: 'Zestaw awaryjny - oznaczenie uszkodzonego narzędzia i miejsca', department: 'MAGAZYN', process: 'MAGAZYN', assigned: true},
                {code: 'PL-WI-CL-OPL-039', name: 'Czynności wykonywane przed przystąpieniem do pracy z użyciem wózka jezdniowego', department: 'MAGAZYN', process: 'Operator wózka', assigned: true},
                {code: 'PL-WI-CL-OPL-041', name: 'Kontrola Wagi', department: 'B2B', process: 'Pobranie B2B', assigned: true},
                {code: 'PL-WI-CL-OPL-044', name: 'Sposób postępowania z produktem niezgodnym - Dział B2C', department: 'B2C', process: 'PN', assigned: true},
                {code: 'PL-WI-CL-OPL-048', name: 'Kompletacja zestawów- kitting', department: 'VAS', process: 'VAS', assigned: true},
                {code: 'PL-WI-CL-OPL-049', name: 'Pick Bundli - Kitting', department: 'VAS', process: 'VAS', assigned: true},
                {code: 'PL-WI-CL-OPL-050', name: 'Putaway', department: 'Inbound', process: 'Relokacja IN', assigned: true},
                {code: 'PL-WI-CL-OPL-071-EXT', name: 'Instrukcja Kontroli Jakości działu Odnowa', department: 'REFURBISHMENT', process: 'KJ', assigned: true},
                {code: 'PL-WI-CL-OPL-076', name: 'Uzupełnianie SCHEDULING TOOL', department: 'Admin', process: 'Admin', assigned: true},
                {code: 'PL-WI-CL-OPL-077', name: 'Uzupełnianie raportu QS', department: 'REPORTING', process: 'Raport QS', assigned: true},
                {code: 'PL-WI-CL-OPL-078', name: 'Użytkowanie prasy stacjonarnej oraz wywrotnicy', department: 'MAGAZYN', process: 'MAGAZYN', assigned: true},
                {code: 'PL-WI-CL-OPL-079', name: 'Kontrola w zakresie Ochrony Środowiska i stanu czystości', department: 'QUALITY', process: 'Środowisko', assigned: true},
                {code: 'PL-WI-CL-OPL-080', name: 'Kontrolowanie stanu zapasów materiałów pomocniczych', department: 'MAGAZYN', process: 'Opakowania', assigned: true},
                {code: 'PL-WI-CL-OPL-081', name: 'Produktywność B2B', department: 'B2B', process: 'Admin B2B', assigned: true},
                {code: 'PL-WI-CL-OPL-082', name: 'Wysyłka paczek do klienta', department: 'RETURNS', process: 'Odsyłka', assigned: true},
                {code: 'PL-WI-CL-OPL-053-EXT', name: 'Instrukcja testowania dla Funbox 6', department: 'REFURBISHMENT', process: 'Testowanie', assigned: true},
                {code: 'PL-WI-CL-OPL-054-EXT', name: 'Instrukcja pakowania dla Funbox 6', department: 'REFURBISHMENT', process: 'Pakowanie REF', assigned: true},
                {code: 'PL-WI-CL-OPL-055-EXT', name: 'Instrukcja czyszczenia dla Funbox 6', department: 'REFURBISHMENT', process: 'Czyszczenie', assigned: true},
                {code: 'PL-WI-CL-OPL-003', name: 'Roliczenie Finansowe', department: 'REPORTING', process: 'Rozliczenie', assigned: true},
                {code: 'PL-WI-CL-OPL-051', name: 'Relokacja systemowa', department: 'B2B', process: 'Admin B2B', assigned: true},
                {code: 'PL-WI-CL-OPL-051', name: 'Relokacja systemowa', department: 'REFURBISHMENT', process: 'Admin REF', assigned: true},
                {code: 'PL-WI-CL-OPL-051', name: 'Relokacja systemowa', department: 'RETURNS', process: 'Przyjęcie RET', assigned: true}
            ],
            
            // Uczestnicy GEMBA Walk według poziomów
            gembaParticipants: {
                level1: [
                    {name: 'Brygadzista B2C', email: 'wydania.skladanie@cevalogistics.com'},
                    {name: 'Brygadzista B2B', email: 'Wydania.Realizacja@Cevalogistics.com'},
                    {name: 'Brygadzista Zwrotów', email: 'ptk.zwroty@cevalogistics.com'},
                    {name: 'Brygadzista Odnowy', email: 'kamil.markowski@cevalogistics.com'},
                    {name: 'Brygadzista Odnowy', email: 'marcin.borysiak@cevalogistics.com'}
                ],
                level2: [
                    {name: 'Kasiński Konrad', email: 'konrad.kasinski@cevalogistics.com'},
                    {name: 'Maciąg Mariusz', email: 'mariusz.maciag@cevalogistics.com'},
                    {name: 'Zegarek Renata', email: 'renata.zegarek@cevalogistics.com'},
                    {name: 'Jan Surwiło', email: 'jan.surwilo@cevalogistics.com'},
                    {name: 'Mandes Janusz', email: 'janusz.mandes@cevalogistics.com'},
                    {name: 'Domański Jarosław', email: 'jaroslaw.domanski@cevalogistics.com'},
                    {name: 'Żach Robert', email: 'robert.zach@cevalogistics.com'},
                    {name: 'Kałuża Iwona', email: 'iwona.kaluza@cevalogistics.com'},
                    {name: 'Grzegorz Oniszczuk', email: 'Grzegorz.Oniszczuk@Cevalogistics.com'},
                    {name: 'Nowak Rafał', email: 'Rafal.Nowak@Cevalogistics.com'},
                    {name: 'Piotr Żebrowski', email: 'Piotr.Zebrowski@Cevalogistics.com'},
                    {name: 'Kawałek Tomasz', email: 'Tomasz.Kawalek@cevalogistics.com'}
                ],
                level3: [
                    {name: 'Wichrowski Piotr', email: 'krzysztof.wilczynski@cevalogistics.com'},
                    {name: 'Wilczyński Krzysztof', email: 'krzysztof.wilczynski@cevalogistics.com'},
                    {name: 'Dominik Haręźlak', email: 'dominik.harezlak@cevalogistics.com'},
                    {name: 'Maciej Wesolowski', email: 'maciej.wesolowski@cevalogistics.com'},
                    {name: 'Marta Jęznach', email: 'marta.jeznach@cevalogistics.com'}
                ]
            },
            
            // Pytania GEMBA według poziomów i kategorii
            gembaQuestions: {
                'Identyfikacja strat': [
                    {question: 'Jakie najczęstsze przestoje występują na tym stanowisku pracy i jak długo trwają?', levels: [1, 2, 3]},
                    {question: 'Czy widzisz jakieś zbędne ruchy lub przemieszczenia podczas wykonywania zadań?', levels: [1, 2, 3]},
                    {question: 'Ile czasu zajmuje oczekiwanie na materiały, narzędzia lub decyzje?', levels: [2, 3]},
                    {question: 'Czy występują problemy z jakością produktów? Jaki jest poziom braków/poprawek?', levels: [2, 3]},
                    {question: 'Jakie zapasy leżą niewykorzystane i od jak dawna?', levels: [3]},
                    {question: 'Czy są zadania, które wykonujesz, a które uważasz za niepotrzebne?', levels: [1, 2, 3]},
                    {question: 'Gdzie widzisz największe marnotrawstwo czasu w procesie?', levels: [1, 2, 3]}
                ],
                'Analiza przyczyn i rozwiązywanie problemów': [
                    {question: 'Dlaczego ten problem występuje? Co jest jego główną przyczyną?', levels: [1, 2]},
                    {question: 'Czy możesz pokazać mi, jak dokładnie powstaje ten problem?', levels: [1, 2]},
                    {question: 'Jakie działania podjęliście, aby rozwiązać ten problem? Czy przyniosły efekty?', levels: [3]},
                    {question: 'Kto jest zaangażowany w rozwiązywanie problemów na tym obszarze?', levels: [1, 2, 3]},
                    {question: 'Jak dokumentujecie problemy i ich rozwiązania?', levels: [2, 3]},
                    {question: 'jakich używacie narzędzi typu do analizy  problemów?', levels: [2, 3]},
                    {question: 'Skąd wiecie, że problem został trwale rozwiązany?', levels: [2, 3]}
                ],
                'Standaryzacja i optymalizacja': [
                    {question: 'Czy istnieje standardowa instrukcja dla tego procesu? Czy mogę ją zobaczyć?', levels: [1, 2]},
                    {question: 'Jak często aktualizujecie standardy pracy?', levels: [2, 3]},
                    {question: 'Czy wszyscy pracownicy wykonują zadanie w ten sam sposób?', levels: [1, 2]},
                    {question: 'Jakie pomysły na usprawnienia zgłaszali ostatnio pracownicy?', levels: [1, 2]},
                    {question: 'Czy standardy uwzględnią najlepsze znane metody wykonania?', levels: [2, 3]},
                    {question: 'Jak sprawdzacie zgodność pracy ze standardem?', levels: [2, 3]},
                    {question: 'Co można zrobić, aby proces był bardziej efektywny?', levels: [2, 3]},
                    {question: 'Jaki jest główny cel tej instrukcji i dlaczego jest ważne, abyś wykonywał/a ją dokładnie w ten sposób?" ', levels: [1, 2]},
                    {question: 'Gdybyś miał/a wątpliwości co do jakiegoś kroku kroku , co zrobiłbyś/abyś w pierwszej kolejności, aby upewnić się, że robisz to poprawnie', levels: [1, 2]},
                    {question: 'W trakcie tego procesu, który krok niesie ze sobą największe ryzyko błędu lub niezgodności, i jak to minimalizujesz?', levels: [1, 2]},
                    {question: 'Gdybyś zauważył/a, że instrukcja pracy jest nieaktualna lub trudna do wykonania, jaki jest Twój standardowy proces zgłaszania tego?', levels: [1, 2]}
                ],
                'Produktywność i KPI': [
                    {question: 'Jakie wskaźniki KPI monitorujecie na tym obszarze?', levels: [1, 2, 3]},
                    {question: 'Jak często sprawdzacie wyniki i gdzie są one wyświetlane?', levels: [2, 3]},
                    {question: 'Jaki jest cel dzienny/tygodniowy i czy jest osiągany?', levels: [2]},
                    {question: 'Co robicie, gdy wskaźniki są poniżej celu?', levels: [2]},
                    {question: 'Czy pracownicy rozumieją, jak ich praca wpływa na KPI?', levels: [1, 2]},
                    {question: 'Jakie są główne przyczyny nieosiągania celów?', levels: [2, 3]},
                    {question: 'Jak mierzycie produktywność na tym stanowisku?', levels: [2, 3]}
                ],
                'Audyt operacyjny na magazynie, 5S, BHP': [
                    {question: 'Czy wszystkie przedmioty mają wyznaczone i oznaczone miejsca?', levels: [1]},
                    {question: 'Kiedy ostatnio przeprowadzaliście audyt 5S? Jakie były wyniki?', levels: [1]},
                    {question: 'Czy standard sprzątania jest jasno określony i przestrzegany?', levels: [1, 2]},
                    {question: 'Czy wszyscy pracownicy stosują wymagane środki ochrony osobistej?', levels: [1, 2, 3]},
                    {question: 'Czy są zgłaszane wypadki lub sytuacje potencjalnie wypadkowe?', levels: [1]},
                    {question: 'Czy drogi ewakuacyjne są drożne i oznaczone?', levels: [1, 2, 3]},
                    {question: 'Jakie zagrożenia widzisz na tym stanowisku pracy?', levels: [1]},
                    {question: 'Jakie są największe wyzwania w codziennej pracy magazynu?', levels: [1, 2, 3]}
                ]
            },
            
            // Kategorie problemów
            problemCategories: [
                '5S',
                'Bezpieczeństwo',
                'Jakość',
                'Produktywność',
                'Inne'
            ]
        }
        
        // Tutaj dodasz kolejne oddziały, np:
        // 'KRA-PL-02': { ... }
    },
    
    // Domyślny oddział (będzie można zmienić w mobile-index.html)
    defaultBranch: 'ORA-PL-01',
    
    // Funkcje pomocnicze
    getBranch: function(code) {
        return this.branches[code] || this.branches[this.defaultBranch];
    },
    
    getCurrentBranch: function() {
        // Zawsze zwracaj domyślny oddział (uproszczona wersja)
        return this.branches[this.defaultBranch];
    },
    
    setBranch: function(code) {
        if (this.branches[code]) {
            localStorage.setItem('ceva_selected_branch', code);
            return true;
        }
        return false;
    },
    
    // Generowanie nazwy pliku dla audytu
    generateFileName: function(type, zone, date) {
        const branch = this.getCurrentBranch();
        const dateStr = date || new Date().toISOString().split('T')[0];
        const zoneStr = zone.replace(/\s+/g, '');
        return `${type}_${branch.code}_${zoneStr}_${dateStr}.json`;
    },
    
    // Pobierz pytania GEMBA dla wybranego poziomu i kategorii
    getGembaQuestions: function(level, category) {
        const branch = this.getCurrentBranch();
        const questions = branch.gembaQuestions[category];
        if (!questions) return [];
        
        return questions.filter(q => q.levels.includes(level));
    },
    
    // Pobierz uczestników GEMBA dla wybranego poziomu
    getGembaParticipants: function(level) {
        const branch = this.getCurrentBranch();
        const participants = [];
        
        // Dla poziomu 1: tylko poziom 1
        if (level === 1) {
            return [...branch.gembaParticipants.level1];
        }
        // Dla poziomu 2: poziom 1 + poziom 2
        else if (level === 2) {
            return [
                ...branch.gembaParticipants.level1,
                ...branch.gembaParticipants.level2
            ];
        }
        // Dla poziomu 3: wszystkie poziomy
        else if (level === 3) {
            return [
                ...branch.gembaParticipants.level1,
                ...branch.gembaParticipants.level2,
                ...branch.gembaParticipants.level3
            ];
        }
        
        return participants;
    },
    
    // Pobierz kategorie GEMBA
    getGembaCategories: function() {
        const branch = this.getCurrentBranch();
        return Object.keys(branch.gembaQuestions);
    },
    
    // ========== NOWE FUNKCJE DLA INSTRUKCJI ==========
    
    // Pobierz wszystkie unikalne działy
    getDepartments: function() {
        const branch = this.getCurrentBranch();
        const departments = [...new Set(branch.instructions.map(i => i.department))];
        return departments.sort();
    },
    
    // Pobierz procesy dla wybranego działu
    getProcessesByDepartment: function(department) {
        const branch = this.getCurrentBranch();
        const processes = branch.instructions
            .filter(i => i.department === department && i.assigned)
            .map(i => i.process);
        return [...new Set(processes)].sort();
    },
    
    // Pobierz instrukcje dla wybranego działu i procesu
    getInstructionsByDepartmentAndProcess: function(department, process) {
        const branch = this.getCurrentBranch();
        const instructions = branch.instructions
            .filter(i => i.department === department && i.process === process && i.assigned);
        
        // Zwróć unikalne instrukcje (po kodzie)
        const uniqueInstructions = [];
        const seen = new Set();
        
        instructions.forEach(instr => {
            if (!seen.has(instr.code)) {
                seen.add(instr.code);
                uniqueInstructions.push({
                    code: instr.code,
                    name: instr.name,
                    fullName: `${instr.code} - ${instr.name}`
                });
            }
        });
        
        return uniqueInstructions;
    },
    
    // Pobierz wszystkie instrukcje (bez filtrów)
    getAllInstructions: function() {
        const branch = this.getCurrentBranch();
        const instructions = branch.instructions.filter(i => i.assigned);
        
        // Zwróć unikalne instrukcje (po kodzie)
        const uniqueInstructions = [];
        const seen = new Set();
        
        instructions.forEach(instr => {
            if (!seen.has(instr.code)) {
                seen.add(instr.code);
                uniqueInstructions.push({
                    code: instr.code,
                    name: instr.name,
                    fullName: `${instr.code} - ${instr.name}`
                });
            }
        });
        
        return uniqueInstructions.sort((a, b) => a.code.localeCompare(b.code));
    },
    
    // Pobierz szczegóły instrukcji po kodzie
    getInstructionDetails: function(code) {
        const branch = this.getCurrentBranch();
        return branch.instructions.filter(i => i.code === code && i.assigned);
    }
};

// Export dla modułów
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CEVA_CONFIG;
}

// --- MODULO GUIDA ALL'USO ---

function inizializzaGuida() {
    const containerGuida = document.getElementById('contenitore-guida');
    if (!containerGuida) return;

    containerGuida.innerHTML = `
        <div class="guida-container">
            <h2>📖 Guida all'Uso dell'Applicazione</h2>
            <p style="margin-bottom: 15px; color: #9CA3AF; font-size: 0.9rem;">
                Clicca sulle sezioni sottostanti per espandere le istruzioni dettagliate di ciascuna funzionalità.
            </p>

            
            
            <button class="guida-accordion">📋 Gestione Scadenze Casa</button>
            <div class="guida-panel">
                <p><strong>A cosa serve:</strong> Permette di monitorare bollette, tasse, abbonamenti e impegni economici con scadenze definite.</p>
                <ul style="margin-left: 20px; margin-top: 8px;">
                    <li><strong>Inserire una scadenza:</strong> Clicca sul pulsante "+ Nuova" ed inserisci descrizione, data, importo e la frequenza di ricorrenza (es. Mensile, Annuale).</li>
                    <li><strong>Segnare come pagato:</strong> Clicca sul pulsante con la spunta verde (✓). Se la scadenza è ricorrente, il sistema genererà automaticamente la nuova scadenza per il periodo successivo.</li>
                    <li><strong>Stati cromatici:</strong> Le righe evidenziate in <em>Rosso</em> indicano scadenze già scadute, in <em>Giallo</em> quelle in arrivo entro 7 giorni, e in <em>Verde</em> quelle saldate.</li>
                </ul>
            </div>

            <button class="guida-accordion">🧾 Archivio Scontrini e Garanzie</button>
            <div class="guida-panel">
                <p><strong>A cosa serve:</strong> Tiene traccia degli acquisti importanti, registrando la durata della garanzia legale per una rapida consultazione.</p>
                <ul style="margin-left: 20px; margin-top: 8px;">
                    <li><strong>Registrazione:</strong> Salva il nome del negozio, il prodotto acquistato, la data d'acquisto e la durata della garanzia (es. 24 mesi).</li>
                    <li><strong>Calcolo automatico:</strong> Il sistema calcola direttamente la data di fine garanzia e segnala se il prodotto è ancora coperto da assistenza.</li>
                </ul>
            </div>

            <button class="guida-accordion">🩺 Diario Salute e Farmaci</button>
            <div class="guida-panel">
                <p><strong>A cosa serve:</strong> Registra visite mediche, esami clinici, dosaggi di farmaci e promemoria per le prescrizioni.</p>
                <ul style="margin-left: 20px; margin-top: 8px;">
                    <li><strong>Monitoraggio:</strong> Inserisci il tipo di controllo o farmaco con la relativa data d'assunzione o la futura visita specialistica.</li>
                    <li><strong>Ricerca:</strong> Usa la barra di ricerca rapida per ritrovare al volo lo storico di una specifica visita o terapia.</li>
                </ul>
            </div>

            <button class="guida-accordion">🚗 Gestione Veicoli e Manutenzione</button>
            <div class="guida-panel">
                <p><strong>A cosa serve:</strong> Gestisce bollo, assicurazione, revisione, tagliandi e interventi di manutenzione per i tuoi veicoli.</p>
                <ul style="margin-left: 20px; margin-top: 8px;">
                    <li><strong>Inscatolamento spese:</strong> Associa ogni spesa al mezzo specifico ed imposta la data di scadenza della polizza o del bollo.</li>
                    <li><strong>Pianificazione:</strong> Evita sanzioni tenendo d'occhio gli avvisi per la revisione periodica.</li>
                </ul>
            </div>

            <button class="guida-accordion">📊 Report e Statistiche Globali</button>
            <div class="guida-panel">
                <p><strong>A cosa serve:</strong> Offre una panoramica sui costi complessivi sostenuti nelle varie sezioni.</p>
                <ul style="margin-left: 20px; margin-top: 8px;">
                    <li><strong>Filtri di stampa:</strong> Genera resoconti cartacei o PDF formattati in modo pulito e pronti per l'archiviazione fisica.</li>
                    <li><strong>Visualizzazione aggregata:</strong> Visualizza in un unico valore le somme totali impegnate e saldate.</li>
                </ul>
            </div>

            <button class="guida-accordion">💾 Backup e Ripristino Dati</button>
            <div class="guida-panel">
                <p><strong>A cosa serve:</strong> Protegge i tuoi dati salvati sul browser ed esegue il trasferimento su altri dispositivi.</p>
                <ul style="margin-left: 20px; margin-top: 8px;">
                    <li><strong>Esporta JSON:</strong> Scarica un file di backup sul tuo computer con tutte le scadenze e i registri salvati.</li>
                    <li><strong>Importa JSON:</strong> Carica un file salvato in precedenza per ripristinare le tue informazioni in caso di cambio dispositivo o pulizia del browser.</li>
                </ul>
            </div>
        </div>
    `;

    // Attivazione dell'effetto fisarmonica (Accordion)
    const accordions = containerGuida.querySelectorAll('.guida-accordion');
    accordions.forEach(acc => {
        acc.addEventListener('click', function () {
            this.classList.toggle('active');
            const panel = this.nextElementSibling;
            if (panel.style.display === 'block') {
                panel.style.display = 'none';
            } else {
                panel.style.display = 'block';
            }
        });
    });
}

// --- AVVIO AUTOMATICO ALL'APERTURA DELLA PAGINA ---
document.addEventListener('DOMContentLoaded', () => {
    inizializzaGuida();
});
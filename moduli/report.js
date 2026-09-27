// --- MODULO REPORT E STAMPE AVANZATO ---

function inizializzaModuloReport() {
    const container = document.getElementById('contenitore-report');
    if (!container) return;

    container.innerHTML = `
        <div class="card-report">
            <h2>📊 Stampa e Resoconti Personalizzati</h2>
            <p style="color: #9CA3AF; margin-bottom: 20px; font-size: 0.9rem;">
                Seleziona i filtri desiderati per generare una stampa o un PDF pulito e formattato.
            </p>

            <div style="display: flex; flex-direction: column; gap: 15px;">
                <!-- SELEZIONE AMBITO -->
                <div>
                    <label style="font-weight: bold; display: block; margin-bottom: 5px;">Seziona Modulo:</label>
                    <select id="report-sezione" class="input-field" style="width: 100%; padding: 8px; border-radius: 6px; background: #2B2B3D; color: #FFF; border: 1px solid #374151;">
                        <option value="TUTTI">🌐 Report Globale (Tutte le sezioni)</option>
                        <option value="scadenze">📋 Scadenze Casa</option>
                        <option value="scontrini">🧾 Scontrini & Garanzie</option>
                        <option value="salute">🏥 Visite & Salute</option>
                        <option value="veicoli">🚗 Veicoli e Manutenzione</option>
                    </select>
                </div>

                <!-- FILTRI DINAMICI -->
                <div id="box-filtri-specifici">
                    <!-- I filtri cambiano in base alla sezione scelta -->
                </div>

                <button id="btn-genera-report" class="btn btn-primary" style="padding: 10px; font-weight: bold; margin-top: 10px;">
                    🖨️ Genera e Stampa Report
                </button>
            </div>
        </div>
    `;

    const selectSezione = document.getElementById('report-sezione');
    const btnStampa = document.getElementById('btn-genera-report');

    selectSezione.addEventListener('change', aggiornaFiltriSpecifici);
    btnStampa.addEventListener('click', eseguiStampa);

    aggiornaFiltriSpecifici();
}

function aggiornaFiltriSpecifici() {
    const sezione = document.getElementById('report-sezione').value;
    const box = document.getElementById('box-filtri-specifici');
    if (!box) return;

    let htmlFiltri = '';

    if (sezione === 'scadenze') {
        htmlFiltri = `
            <label style="font-weight: bold; display: block; margin-bottom: 5px;">Filtra Scadenze:</label>
            <select id="filtro-stato-report" class="input-field" style="width: 100%; padding: 8px; border-radius: 6px; background: #2B2B3D; color: #FFF; border: 1px solid #374151;">
                <option value="TUTTE">Tutte le scadenze</option>
                <option value="PAGATE">Solo Pagate</option>
                <option value="DA_PAGARE">Solo Da Pagare</option>
                <option value="IN_SCADENZA">Solo In Scadenza (Prossimi 7 gg)</option>
                <option value="SCADUTE">Solo Scadute</option>
            </select>
        `;
    } else if (sezione === 'scontrini') {
        htmlFiltri = `
            <label style="font-weight: bold; display: block; margin-bottom: 5px;">Filtra Garanzie:</label>
            <select id="filtro-stato-report" class="input-field" style="width: 100%; padding: 8px; border-radius: 6px; background: #2B2B3D; color: #FFF; border: 1px solid #374151;">
                <option value="TUTTI">Tutti gli scontrini</option>
                <option value="VALIDI">Solo Garanzie Ancora Valide</option>
                <option value="SCADUTI">Solo Garanzie Scadute</option>
            </select>
        `;
    } else if (sezione === 'salute') {
        htmlFiltri = `
            <label style="font-weight: bold; display: block; margin-bottom: 5px;">Filtra Visite / Salute:</label>
            <select id="filtro-stato-report" class="input-field" style="width: 100%; padding: 8px; border-radius: 6px; background: #2B2B3D; color: #FFF; border: 1px solid #374151;">
                <option value="TUTTI">Tutti i controlli / visite</option>
                <option value="FUTURE">Solo Visite Future / In Scadenza</option>
                <option value="PASSATE">Solo Storico Visite Effettuate</option>
            </select>
        `;
    } else if (sezione === 'veicoli') {
        htmlFiltri = `
            <label style="font-weight: bold; display: block; margin-bottom: 5px;">Filtra Manutenzione & Scadenze Veicoli:</label>
            <select id="filtro-stato-report" class="input-field" style="width: 100%; padding: 8px; border-radius: 6px; background: #2B2B3D; color: #FFF; border: 1px solid #374151;">
                <option value="TUTTI">Tutte le spese / scadenze veicoli</option>
                <option value="IN_SCADENZA">Solo Scadenze Imminenti (Bollo/Assicurazione/Revisione)</option>
                <option value="EFFETTUATE">Solo Manutenzioni / Pagamenti Effettuati</option>
            </select>
        `;
    } else {
        htmlFiltri = `<p style="color: #9CA3AF; font-size: 0.85rem;">Verrà generato un prospetto completo di tutti i dati registrati nell'applicazione.</p>`;
    }

    box.innerHTML = htmlFiltri;
}

function eseguiStampa() {
    const sezione = document.getElementById('report-sezione').value;
    const filtroEl = document.getElementById('filtro-stato-report');
    const filtro = filtroEl ? filtroEl.value : 'TUTTI';

    let contenutoHtml = '';
    let titoloReport = 'Report Generale';

    if (sezione === 'scadenze' || sezione === 'TUTTI') {
        contenutoHtml += generaTabellaScadenze(filtro);
    }
    if (sezione === 'scontrini' || sezione === 'TUTTI') {
        contenutoHtml += generaTabellaScontrini(filtro);
    }
    if (sezione === 'salute' || sezione === 'TUTTI') {
        contenutoHtml += generaTabellaSalute(filtro);
    }
    if (sezione === 'veicoli' || sezione === 'TUTTI') {
        contenutoHtml += generaTabellaVeicoli(filtro);
    }

    if (!contenutoHtml.trim()) {
        alert('Nessun dato trovato per i filtri selezionati.');
        return;
    }

    const finestraStampa = window.open('', '_blank');
    finestraStampa.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Report - Gestione Casa</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 25px; color: #222; }
                h1 { color: #1E293B; border-bottom: 2px solid #3B82F6; padding-bottom: 6px; font-size: 22px; }
                h2 { color: #334155; margin-top: 25px; font-size: 16px; border-bottom: 1px solid #CBD5E1; padding-bottom: 4px; }
                table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 15px; font-size: 13px; }
                th, td { border: 1px solid #CBD5E1; padding: 7px 10px; text-align: left; }
                th { background-color: #F1F5F9; font-weight: bold; }
                .totale { text-align: right; font-weight: bold; font-size: 14px; margin-top: 5px; }
            </style>
        </head>
        <body>
            <h1>📋 Resoconto Dati - ${new Date().toLocaleDateString('it-IT')}</h1>
            ${contenutoHtml}
            <script>window.onload = function() { window.print(); }</script>
        </body>
        </html>
    `);
    finestraStampa.document.close();
}

// --- GENERATORI TABELLE SPECIFICHE ---

function generaTabellaScadenze(filtro) {
    const dati = JSON.parse(localStorage.getItem('scadenze_db')) || [];
    let righe = '';
    let totale = 0;

    dati.forEach(s => {
        const diffGiorni = Math.ceil((new Date(s.data) - new Date()) / (1000 * 3600 * 24));
        let stato = s.pagato ? 'PAGATE' : (diffGiorni < 0 ? 'SCADUTE' : (diffGiorni <= 7 ? 'IN_SCADENZA' : 'DA_PAGARE'));

        if (filtro !== 'TUTTI' && filtro !== 'TUTTE' && filtro !== stato) return;

        totale += Number(s.importo || 0);
        righe += `
            <tr>
                <td>${s.descrizione}</td>
                <td>${window.formatoDataIta ? window.formatoDataIta(s.data) : s.data}</td>
                <td>${Number(s.importo || 0).toFixed(2)} €</td>
                <td>${s.ricorrenza || 'Nessuna'}</td>
                <td>${s.pagato ? 'Sì' : 'No'}</td>
            </tr>
        `;
    });

    if (!righe) return '';

    return `
        <h2>📋 Scadenze Casa</h2>
        <table>
            <thead>
                <tr><th>Descrizione</th><th>Data</th><th>Importo</th><th>Ricorrenza</th><th>Pagato</th></tr>
            </thead>
            <tbody>${righe}</tbody>
        </table>
        <div class="totale">Totale Parziale: ${totale.toFixed(2)} €</div>
    `;
}

function generaTabellaScontrini(filtro) {
    const dati = JSON.parse(localStorage.getItem('scontrini_db')) || [];
    let righe = '';

    dati.forEach(s => {
        const dataFine = new Date(s.dataAcquisto);
        dataFine.setMonth(dataFine.getMonth() + Number(s.mesiGaranzia || 24));
        const eValida = dataFine >= new Date();
        const stato = eValida ? 'VALIDI' : 'SCADUTI';

        if (filtro !== 'TUTTI' && filtro !== stato) return;

        righe += `
            <tr>
                <td>${s.negozio || '-'}</td>
                <td>${s.prodotto}</td>
                <td>${window.formatoDataIta ? window.formatoDataIta(s.dataAcquisto) : s.dataAcquisto}</td>
                <td>${s.mesiGaranzia} mesi</td>
                <td>${eValida ? 'In Garanzia' : 'Scaduta'}</td>
            </tr>
        `;
    });

    if (!righe) return '';

    return `
        <h2>🧾 Scontrini e Garanzie</h2>
        <table>
            <thead>
                <tr><th>Negozio</th><th>Prodotto</th><th>Data Acquisto</th><th>Garanzia</th><th>Stato</th></tr>
            </thead>
            <tbody>${righe}</tbody>
        </table>
    `;
}

function generaTabellaSalute(filtro) {
    const dati = JSON.parse(localStorage.getItem('salute_db')) || [];
    let righe = '';

    dati.forEach(s => {
        const eFutura = new Date(s.data) >= new Date();
        const stato = eFutura ? 'FUTURE' : 'PASSATE';

        if (filtro !== 'TUTTI' && filtro !== stato) return;

        righe += `
            <tr>
                <td>${s.tipo || 'Visita'}</td>
                <td>${s.descrizione}</td>
                <td>${window.formatoDataIta ? window.formatoDataIta(s.data) : s.data}</td>
                <td>${s.note || '-'}</td>
            </tr>
        `;
    });

    if (!righe) return '';

    return `
        <h2>🏥 Visite & Salute</h2>
        <table>
            <thead>
                <tr><th>Tipo</th><th>Descrizione</th><th>Data</th><th>Note</th></tr>
            </thead>
            <tbody>${righe}</tbody>
        </table>
    `;
}

function generaTabellaVeicoli(filtro) {
    const dati = JSON.parse(localStorage.getItem('veicoli_db')) || [];
    let righe = '';

    dati.forEach(v => {
        const diffGiorni = Math.ceil((new Date(v.data) - new Date()) / (1000 * 3600 * 24));
        const stato = (diffGiorni >= 0 && diffGiorni <= 15) ? 'IN_SCADENZA' : 'EFFETTUATE';

        if (filtro !== 'TUTTI' && filtro !== stato) return;

        righe += `
            <tr>
                <td>${v.veicolo}</td>
                <td>${v.tipoSpesa}</td>
                <td>${window.formatoDataIta ? window.formatoDataIta(v.data) : v.data}</td>
                <td>${Number(v.importo || 0).toFixed(2)} €</td>
            </tr>
        `;
    });

    if (!righe) return '';

    return `
        <h2>🚗 Veicoli e Manutenzione</h2>
        <table>
            <thead>
                <tr><th>Veicolo</th><th>Spesa/Intervento</th><th>Data</th><th>Importo</th></tr>
            </thead>
            <tbody>${righe}</tbody>
        </table>
    `;
}

// --- AVVIO AUTOMATICO ALL'APERTURA DELLA PAGINA ---
document.addEventListener('DOMContentLoaded', () => {
    inizializzaModuloReport();
});
// --- UTILITÀ GLOBALE DATA ---
window.formatoDataIta = function (dataIso) {
    if (!dataIso) return '-';
    const parti = dataIso.split('-');
    if (parti.length !== 3) return dataIso;
    return `${parti[2]}/${parti[1]}/${parti[0]}`;
};

// --- MODULO SCADENZE CASA ---
let scadenze = JSON.parse(localStorage.getItem('scadenze_db')) || [];
let filtroAttivo = 'Tutte';

function inizializzaModuloScadenze() {
    const btnNuova = document.getElementById('btn-nuova');
    const btnAnnulla = document.getElementById('btn-annulla');
    const formScadenza = document.getElementById('form-scadenza');
    const btnElimina = document.getElementById('btn-elimina');
    const inputCerca = document.getElementById('input-cerca');
    const btnStampa = document.getElementById('btn-stampa');

    if (btnNuova) btnNuova.addEventListener('click', () => apriModal());
    if (btnAnnulla) btnAnnulla.addEventListener('click', chiudiModal);
    if (formScadenza) formScadenza.addEventListener('submit', salvaScadenza);
    if (btnElimina) btnElimina.addEventListener('click', eliminaScadenza);
    if (inputCerca) inputCerca.addEventListener('input', caricaDatiGriglia);
    if (btnStampa) btnStampa.addEventListener('click', generaReportStampa);

    const btnsFiltro = document.querySelectorAll('.btn-filter');
    btnsFiltro.forEach(btn => {
        btn.addEventListener('click', (e) => {
            btnsFiltro.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            filtroAttivo = e.target.getAttribute('data-filter');
            caricaDatiGriglia();
        });
    });

    caricaDatiGriglia();
}

function salvaSulDatabase() {
    localStorage.setItem('scadenze_db', JSON.stringify(scadenze));
    caricaDatiGriglia();
}

function calcolaProssimaData(dataIso, frequenza) {
    if (!dataIso || frequenza === 'Nessuna') return dataIso;
    let [anno, mese, giorno] = dataIso.split('-').map(Number);
    let dt = new Date(anno, mese - 1, giorno);
    const mesiDaAggiungere = {
        'Mensile': 1, 'Bimestrale': 2, 'Trimestrale': 3, 'Semestrale': 6, 'Annuale': 12
    }[frequenza] || 0;
    dt.setMonth(dt.getMonth() + mesiDaAggiungere);
    let YYYY = dt.getFullYear();
    let MM = String(dt.getMonth() + 1).padStart(2, '0');
    let DD = String(dt.getDate()).padStart(2, '0');
    return `${YYYY}-${MM}-${DD}`;
}

function calcolaStato(dataIso, pagato) {
    if (pagato) return 'pagato';
    const oggi = new Date();
    oggi.setHours(0, 0, 0, 0);
    const [a, m, g] = dataIso.split('-').map(Number);
    const dtScadenza = new Date(a, m - 1, g);
    const diffTempo = dtScadenza - oggi;
    const diffGiorni = Math.ceil(diffTempo / (1000 * 60 * 60 * 24));

    if (diffGiorni < 0) return 'scaduto';
    if (diffGiorni >= 0 && diffGiorni <= 7) return 'imminente';
    return 'normale';
}

function caricaDatiGriglia() {
    const listaHtml = document.getElementById('lista-scadenze');
    if (!listaHtml) return;
    listaHtml.innerHTML = '';

    let numScadute = 0;
    let numImminenti = 0;
    let totaleDaPagare = 0;
    const inputCerca = document.getElementById('input-cerca');
    const testoCerca = inputCerca ? inputCerca.value.toLowerCase() : '';

    scadenze.sort((a, b) => a.data.localeCompare(b.data));

    scadenze.forEach(s => {
        const stato = calcolaStato(s.data, s.pagato);
        if (stato === 'scaduto') numScadute++;
        if (stato === 'imminente') numImminenti++;
        if (!s.pagato) totaleDaPagare += Number(s.importo || 0);

        if (!s.descrizione.toLowerCase().includes(testoCerca)) return;
        if (filtroAttivo === 'Scadute' && stato !== 'scaduto') return;
        if (filtroAttivo === 'In Scadenza' && stato !== 'imminente') return;
        if (filtroAttivo === 'Pagate' && stato !== 'pagato') return;

        const tr = document.createElement('tr');
        tr.className = `row-${stato}`;
        tr.innerHTML = `
            <td><strong>${s.descrizione}</strong></td>
            <td>${formatoDataIta(s.data)}</td>
            <td>${Number(s.importo || 0).toFixed(2)} €</td>
            <td>${s.ricorrenza}</td>
            <td>${s.pagato ? 'Sì' : 'No'}</td>
            <td>
                ${!s.pagato ? `<button class="btn btn-success" onclick="segnaPagato(${s.id})">✓</button>` : ''}
                <button class="btn btn-secondary" style="padding:4px 8px; font-size:0.8rem;" onclick="apriModal(${s.id})">✏️</button>
            </td>
        `;
        listaHtml.appendChild(tr);
    });

    const elScadute = document.getElementById('stat-scadute');
    const elImminenti = document.getElementById('stat-imminenti');
    const elTotale = document.getElementById('stat-totale');

    if (elScadute) elScadute.innerText = numScadute;
    if (elImminenti) elImminenti.innerText = numImminenti;
    if (elTotale) elTotale.innerText = `${totaleDaPagare.toFixed(2)} €`;
}

window.caricaDati = caricaDatiGriglia;

window.segnaPagato = function (id) {
    const item = scadenze.find(s => s.id === id);
    if (!item) return;
    item.pagato = true;

    if (item.ricorrenza && item.ricorrenza !== 'Nessuna') {
        const nuovaData = calcolaProssimaData(item.data, item.ricorrenza);
        scadenze.push({
            id: Date.now(),
            descrizione: item.descrizione,
            data: nuovaData,
            importo: item.importo,
            ricorrenza: item.ricorrenza,
            pagato: false
        });
    }
    salvaSulDatabase();
};

window.apriModal = function (id = null) {
    const modal = document.getElementById('modal-form');
    const title = document.getElementById('modal-title');
    const groupPagato = document.getElementById('group-pagato');
    const btnElimina = document.getElementById('btn-elimina');

    if (!modal) return;
    modal.classList.remove('hidden');

    if (id) {
        const item = scadenze.find(s => s.id === id);
        if (title) title.innerText = 'Modifica Scadenza';
        document.getElementById('edit-id').value = item.id;
        document.getElementById('field-descrizione').value = item.descrizione;
        document.getElementById('field-data').value = item.data;
        document.getElementById('field-importo').value = item.importo;
        document.getElementById('field-ricorrenza').value = item.ricorrenza || 'Nessuna';
        document.getElementById('field-pagato').checked = item.pagato;
        if (groupPagato) groupPagato.style.display = 'block';
        if (btnElimina) btnElimina.style.display = 'inline-block';
    } else {
        if (title) title.innerText = 'Nuova Scadenza';
        document.getElementById('form-scadenza').reset();
        document.getElementById('edit-id').value = '';
        document.getElementById('field-data').value = new Date().toISOString().split('T')[0];
        if (groupPagato) groupPagato.style.display = 'none';
        if (btnElimina) btnElimina.style.display = 'none';
    }
};

function chiudiModal() {
    const modal = document.getElementById('modal-form');
    if (modal) modal.classList.add('hidden');
}

function salvaScadenza(e) {
    e.preventDefault();
    const id = document.getElementById('edit-id').value;
    const desc = document.getElementById('field-descrizione').value.trim();
    const data = document.getElementById('field-data').value;
    const importo = parseFloat(document.getElementById('field-importo').value) || 0;
    const ricorrenza = document.getElementById('field-ricorrenza').value;
    const pagato = document.getElementById('field-pagato').checked;

    if (!desc || !data) return;

    if (id) {
        const index = scadenze.findIndex(s => s.id == id);
        if (index !== -1) {
            const statoPrecedente = scadenze[index].pagato;
            scadenze[index] = { id: Number(id), descrizione: desc, data, importo, ricorrenza, pagato };

            if (!statoPrecedente && pagato && ricorrenza !== 'Nessuna') {
                const nuovaData = calcolaProssimaData(data, ricorrenza);
                scadenze.push({ id: Date.now(), descrizione: desc, data: nuovaData, importo, ricorrenza, pagato: false });
            }
        }
    } else {
        scadenze.push({ id: Date.now(), descrizione: desc, data, importo, ricorrenza, pagato: false });
    }

    salvaSulDatabase();
    chiudiModal();
}

function eliminaScadenza() {
    const id = document.getElementById('edit-id').value;
    if (id && confirm('Sei sicuro di voler eliminare questa scadenza?')) {
        scadenze = scadenze.filter(s => s.id != id);
        salvaSulDatabase();
        chiudiModal();
    }
}

function generaReportStampa() {
    let righeHtml = '';
    let totale = 0;

    scadenze.forEach(s => {
        totale += Number(s.importo || 0);
        righeHtml += `
            <tr>
                <td>${s.descrizione}</td>
                <td style="text-align:center;">${formatoDataIta(s.data)}</td>
                <td style="text-align:right;">${Number(s.importo || 0).toFixed(2)} €</td>
                <td style="text-align:center;">${s.ricorrenza}</td>
                <td style="text-align:center;">${s.pagato ? 'Sì' : 'No'}</td>
            </tr>
        `;
    });

    const finestraStampa = window.open('', '_blank');
    finestraStampa.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Report Scadenze</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
                h1 { color: #1E293B; border-bottom: 2px solid #3B82F6; padding-bottom: 8px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #CBD5E1; padding: 8px; text-align: left; }
                th { background-color: #F1F5F9; }
                .totale { font-size: 16px; font-weight: bold; margin-top: 20px; text-align: right; }
            </style>
        </head>
        <body>
            <h1>📋 Report Scadenze Casa</h1>
            <table>
                <thead>
                    <tr><th>Descrizione</th><th>Data</th><th>Importo</th><th>Ricorrenza</th><th>Pagato</th></tr>
                </thead>
                <tbody>${righeHtml}</tbody>
            </table>
            <div class="totale">Totale Importi: ${totale.toFixed(2)} €</div>
            <script>window.onload = function() { window.print(); }</script>
        </body>
        </html>
    `);
    finestraStampa.document.close();
}

// --- AVVIO AUTOMATICO ALL'APERTURA DELLA PAGINA ---
document.addEventListener('DOMContentLoaded', () => {
    inizializzaModuloScadenze();
});
// --- MODULO SCONTRINI E GARANZIE ---
let scontrini = JSON.parse(localStorage.getItem('scontrini_db')) || [];

function inizializzaModuloScontrini() {
    const form = document.getElementById('form-scontrino');
    const cerca = document.getElementById('input-cerca-scontrini');

    if (form) form.addEventListener('submit', salvaScontrino);
    if (cerca) cerca.addEventListener('input', caricaDatiScontrini);

    caricaDatiScontrini();
}

function calcolaScadenzaGaranzia(dataAcquistoIso, mesi) {
    if (!dataAcquistoIso) return '';
    let [anno, mese, giorno] = dataAcquistoIso.split('-').map(Number);
    let dt = new Date(anno, mese - 1 + Number(mesi), giorno);
    let YYYY = dt.getFullYear();
    let MM = String(dt.getMonth() + 1).padStart(2, '0');
    let DD = String(dt.getDate()).padStart(2, '0');
    return `${YYYY}-${MM}-${DD}`;
}

function caricaDatiScontrini() {
    const listaHtml = document.getElementById('lista-scontrini');
    if (!listaHtml) return;
    listaHtml.innerHTML = '';

    const inputCerca = document.getElementById('input-cerca-scontrini');
    const testoCerca = inputCerca ? inputCerca.value.toLowerCase() : '';

    scontrini.sort((a, b) => {
        const scandA = calcolaScadenzaGaranzia(a.dataAcquisto, a.mesiGaranzia);
        const scandB = calcolaScadenzaGaranzia(b.dataAcquisto, b.mesiGaranzia);
        return scandA.localeCompare(scandB);
    });

    scontrini.forEach(s => {
        const prod = (s.prodotto || '').toLowerCase();
        const neg = (s.negozio || '').toLowerCase();

        if (!prod.includes(testoCerca) && !neg.includes(testoCerca)) return;

        const dataScadenza = calcolaScadenzaGaranzia(s.dataAcquisto, s.mesiGaranzia);
        const stato = typeof calcolaStato === 'function' ? calcolaStato(dataScadenza, false) : 'normale';

        const tr = document.createElement('tr');
        tr.className = `row-${stato}`;
        tr.innerHTML = `
            <td><strong>${s.prodotto}</strong><br><small style="color:#9CA3AF;">${s.prezzo ? s.prezzo + ' €' : ''}</small></td>
            <td>${typeof formatoDataIta === 'function' ? formatoDataIta(s.dataAcquisto) : s.dataAcquisto}</td>
            <td>${typeof formatoDataIta === 'function' ? formatoDataIta(dataScadenza) : dataScadenza} (${s.mesiGaranzia} mesi)</td>
            <td>${s.negozio || '-'}<br><small style="color:#9CA3AF;">${s.note || ''}</small></td>
            <td>
                <button class="btn btn-secondary" style="padding:4px 8px; font-size:0.8rem;" onclick="apriModalScontrino(${s.id})">✏️</button>
            </td>
        `;
        listaHtml.appendChild(tr);
    });
}

window.caricaDatiScontrini = caricaDatiScontrini;

window.apriModalScontrino = function (id = null) {
    const modal = document.getElementById('modal-scontrino');
    const title = document.getElementById('modal-title-scontrino');
    const btnElimina = document.getElementById('btn-elimina-scontrino');

    if (!modal) return;
    modal.classList.remove('hidden');

    if (id) {
        const item = scontrini.find(s => s.id === id);
        if (title) title.innerText = 'Modifica Scontrino';
        document.getElementById('edit-id-scontrino').value = item.id;
        document.getElementById('field-prodotto').value = item.prodotto;
        document.getElementById('field-data-acquisto').value = item.dataAcquisto;
        document.getElementById('field-mesi-garanzia').value = item.mesiGaranzia;
        document.getElementById('field-negozio').value = item.negozio || '';
        document.getElementById('field-prezzo-scontrino').value = item.prezzo || '';
        document.getElementById('field-note-scontrino').value = item.note || '';
        if (btnElimina) btnElimina.style.display = 'inline-block';
    } else {
        if (title) title.innerText = 'Nuovo Scontrino / Garanzia';
        document.getElementById('form-scontrino').reset();
        document.getElementById('edit-id-scontrino').value = '';
        document.getElementById('field-data-acquisto').value = new Date().toISOString().split('T')[0];
        document.getElementById('field-mesi-garanzia').value = 24;
        if (btnElimina) btnElimina.style.display = 'none';
    }
};

window.chiudiModalScontrino = function () {
    const modal = document.getElementById('modal-scontrino');
    if (modal) modal.classList.add('hidden');
};

function salvaScontrino(e) {
    e.preventDefault();
    const id = document.getElementById('edit-id-scontrino').value;
    const prodotto = document.getElementById('field-prodotto').value.trim();
    const dataAcquisto = document.getElementById('field-data-acquisto').value;
    const mesiGaranzia = parseInt(document.getElementById('field-mesi-garanzia').value) || 24;
    const negozio = document.getElementById('field-negozio').value.trim();
    const prezzo = parseFloat(document.getElementById('field-prezzo-scontrino').value) || '';
    const note = document.getElementById('field-note-scontrino').value.trim();

    if (!prodotto || !dataAcquisto) return;

    if (id) {
        const index = scontrini.findIndex(s => s.id == id);
        if (index !== -1) {
            scontrini[index] = { id: Number(id), prodotto, dataAcquisto, mesiGaranzia, negozio, prezzo, note };
        }
    } else {
        scontrini.push({ id: Date.now(), prodotto, dataAcquisto, mesiGaranzia, negozio, prezzo, note });
    }

    localStorage.setItem('scontrini_db', JSON.stringify(scontrini));
    caricaDatiScontrini();
    chiudiModalScontrino();
}

window.eliminaScontrino = function () {
    const id = document.getElementById('edit-id-scontrino').value;
    if (id && confirm('Sei sicuro di voler eliminare questa garanzia?')) {
        scontrini = scontrini.filter(s => s.id != id);
        localStorage.setItem('scontrini_db', JSON.stringify(scontrini));
        caricaDatiScontrini();
        chiudiModalScontrino();
    }
};
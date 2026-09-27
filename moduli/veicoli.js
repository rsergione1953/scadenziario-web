// --- MODULO GESTIONE VEICOLI ---
let veicoli = JSON.parse(localStorage.getItem('veicoli_db')) || [];

function inizializzaModuloVeicoli() {
    const form = document.getElementById('form-veicolo');
    const cerca = document.getElementById('input-cerca-veicoli');

    if (form) form.addEventListener('submit', salvaVeicolo);
    if (cerca) cerca.addEventListener('input', caricaDatiVeicoli);

    caricaDatiVeicoli();
}

function caricaDatiVeicoli() {
    const listaHtml = document.getElementById('lista-veicoli');
    if (!listaHtml) return;
    listaHtml.innerHTML = '';

    const inputCerca = document.getElementById('input-cerca-veicoli');
    const testoCerca = inputCerca ? inputCerca.value.toLowerCase() : '';

    // Ordina per nome/tipo veicolo
    veicoli.sort((a, b) => (a.nome || '').localeCompare(b.nome || ''));

    veicoli.forEach(v => {
        const nomeTxt = (v.nome || '').toLowerCase();
        const targaTxt = (v.targa || '').toLowerCase();
        const tipoTxt = (v.tipo || '').toLowerCase();

        if (!nomeTxt.includes(testoCerca) &&
            !targaTxt.includes(testoCerca) &&
            !tipoTxt.includes(testoCerca)) return;

        // Determina lo stato peggiore tra le tre scadenze (bollo, revisione, assicurazione)
        const statoBollo = v.scadenzaBollo ? calcolaStato(v.scadenzaBollo, false) : 'normale';
        const statoRevisione = v.scadenzaRevisione ? calcolaStato(v.scadenzaRevisione, false) : 'normale';
        const statoAssicurazione = v.scadenzaAssicurazione ? calcolaStato(v.scadenzaAssicurazione, false) : 'normale';

        let statoGenerale = 'normale';
        if ([statoBollo, statoRevisione, statoAssicurazione].includes('scaduto')) {
            statoGenerale = 'scaduto';
        } else if ([statoBollo, statoRevisione, statoAssicurazione].includes('imminente')) {
            statoGenerale = 'imminente';
        }

        const tr = document.createElement('tr');
        tr.className = `row-${statoGenerale}`;
        tr.innerHTML = `
            <td>
                <strong>${v.nome}</strong><br>
                <small style="color:#9CA3AF;">${v.tipo} ${v.targa ? '• ' + v.targa : ''}</small>
            </td>
            <td>${formatoDataScadenza(v.scadenzaBollo, statoBollo)}</td>
            <td>${formatoDataScadenza(v.scadenzaRevisione, statoRevisione)}</td>
            <td>${formatoDataScadenza(v.scadenzaAssicurazione, statoAssicurazione)}</td>
            <td>
                <button class="btn btn-secondary" style="padding:4px 8px; font-size:0.8rem;" onclick="apriModalVeicolo(${v.id})">✏️</button>
            </td>
        `;
        listaHtml.appendChild(tr);
    });
}

function formatoDataScadenza(dataIso, stato) {
    if (!dataIso) return '-';
    const dataFormatted = typeof formatoDataIta === 'function' ? formatoDataIta(dataIso) : dataIso;
    if (stato === 'scaduto') return `<span style="color:#EF4444; font-weight:bold;">${dataFormatted} ⚠️</span>`;
    if (stato === 'imminente') return `<span style="color:#F59E0B; font-weight:bold;">${dataFormatted} ⏳</span>`;
    return dataFormatted;
}

window.caricaDatiVeicoli = caricaDatiVeicoli;

window.apriModalVeicolo = function (id = null) {
    const modal = document.getElementById('modal-veicolo');
    const title = document.getElementById('modal-title-veicolo');
    const btnElimina = document.getElementById('btn-elimina-veicolo');

    if (!modal) return;
    modal.classList.remove('hidden');

    if (id) {
        const item = veicoli.find(v => v.id === id);
        if (title) title.innerText = 'Modifica Veicolo';
        document.getElementById('edit-id-veicolo').value = item.id;
        document.getElementById('field-nome-veicolo').value = item.nome;
        document.getElementById('field-tipo-veicolo').value = item.tipo || 'Auto';
        document.getElementById('field-targa-veicolo').value = item.targa || '';
        document.getElementById('field-bollo-veicolo').value = item.scadenzaBollo || '';
        document.getElementById('field-revisione-veicolo').value = item.scadenzaRevisione || '';
        document.getElementById('field-assicurazione-veicolo').value = item.scadenzaAssicurazione || '';
        document.getElementById('field-note-veicolo').value = item.note || '';

        if (btnElimina) btnElimina.style.display = 'inline-block';
    } else {
        if (title) title.innerText = 'Nuovo Veicolo';
        document.getElementById('form-veicolo').reset();
        document.getElementById('edit-id-veicolo').value = '';
        if (btnElimina) btnElimina.style.display = 'none';
    }
};

window.chiudiModalVeicolo = function () {
    const modal = document.getElementById('modal-veicolo');
    if (modal) modal.classList.add('hidden');
};

function salvaVeicolo(e) {
    e.preventDefault();
    const id = document.getElementById('edit-id-veicolo').value;
    const nome = document.getElementById('field-nome-veicolo').value.trim();
    const tipo = document.getElementById('field-tipo-veicolo').value;
    const targa = document.getElementById('field-targa-veicolo').value.trim().toUpperCase();
    const scadenzaBollo = document.getElementById('field-bollo-veicolo').value;
    const scadenzaRevisione = document.getElementById('field-revisione-veicolo').value;
    const scadenzaAssicurazione = document.getElementById('field-assicurazione-veicolo').value;
    const note = document.getElementById('field-note-veicolo').value.trim();

    if (!nome) return;

    const datiVeicolo = {
        id: id ? Number(id) : Date.now(),
        nome,
        tipo,
        targa,
        scadenzaBollo,
        scadenzaRevisione,
        scadenzaAssicurazione,
        note
    };

    if (id) {
        const index = veicoli.findIndex(v => v.id == id);
        if (index !== -1) veicoli[index] = datiVeicolo;
    } else {
        veicoli.push(datiVeicolo);
    }

    localStorage.setItem('veicoli_db', JSON.stringify(veicoli));
    caricaDatiVeicoli();
    chiudiModalVeicolo();
}

window.eliminaVeicolo = function () {
    const id = document.getElementById('edit-id-veicolo').value;
    if (id && confirm('Sei sicuro di voler eliminare questo veicolo?')) {
        veicoli = veicoli.filter(v => v.id != id);
        localStorage.setItem('veicoli_db', JSON.stringify(veicoli));
        caricaDatiVeicoli();
        chiudiModalVeicolo();
    }
};
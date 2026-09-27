// --- MODULO VISITE & SALUTE ---
let salute = JSON.parse(localStorage.getItem('salute_db')) || [];

function inizializzaModuloSalute() {
    const form = document.getElementById('form-salute');
    const cerca = document.getElementById('input-cerca-salute');

    if (form) form.addEventListener('submit', salvaSalute);
    if (cerca) cerca.addEventListener('input', caricaDatiSalute);

    caricaDatiSalute();
}

function caricaDatiSalute() {
    const listaHtml = document.getElementById('lista-salute');
    if (!listaHtml) return;
    listaHtml.innerHTML = '';

    const inputCerca = document.getElementById('input-cerca-salute');
    const testoCerca = inputCerca ? inputCerca.value.toLowerCase() : '';

    // Ordina per data più vicina
    salute.sort((a, b) => (a.data || '').localeCompare(b.data || ''));

    salute.forEach(s => {
        const visitaTxt = (s.visita || '').toLowerCase();
        const medicoTxt = (s.medico || '').toLowerCase();
        const noteTxt = (s.note || '').toLowerCase();

        if (!visitaTxt.includes(testoCerca) &&
            !medicoTxt.includes(testoCerca) &&
            !noteTxt.includes(testoCerca)) return;

        const stato = typeof calcolaStato === 'function' ? calcolaStato(s.data, s.effettuata) : 'normale';

        const tr = document.createElement('tr');
        tr.className = `row-${stato}`;
        tr.innerHTML = `
            <td><strong>${s.visita}</strong></td>
            <td>${typeof formatoDataIta === 'function' ? formatoDataIta(s.data) : s.data} ${s.ora ? 'ore ' + s.ora : ''}</td>
            <td>${s.medico || '-'}<br><small style="color:#9CA3AF;">${s.note || ''}</small></td>
            <td>${s.effettuata ? 'Effettuata' : 'Da fare'}</td>
            <td>
                ${!s.effettuata ? `<button class="btn btn-success" onclick="segnaEffettuata(${s.id})">✓</button>` : ''}
                <button class="btn btn-secondary" style="padding:4px 8px; font-size:0.8rem;" onclick="apriModalSalute(${s.id})">✏️</button>
            </td>
        `;
        listaHtml.appendChild(tr);
    });
}

window.caricaDatiSalute = caricaDatiSalute;

window.segnaEffettuata = function (id) {
    const item = salute.find(s => s.id === id);
    if (!item) return;
    item.effettuata = true;
    localStorage.setItem('salute_db', JSON.stringify(salute));
    caricaDatiSalute();
};

window.apriModalSalute = function (id = null) {
    const modal = document.getElementById('modal-salute');
    const title = document.getElementById('modal-title-salute');
    const groupEffettuata = document.getElementById('group-effettuata');
    const btnElimina = document.getElementById('btn-elimina-salute');

    if (!modal) return;
    modal.classList.remove('hidden');

    if (id) {
        const item = salute.find(s => s.id === id);
        if (title) title.innerText = 'Modifica Visita Medica';
        document.getElementById('edit-id-salute').value = item.id;
        document.getElementById('field-visita').value = item.visita;
        document.getElementById('field-data-salute').value = item.data;
        document.getElementById('field-ora-salute').value = item.ora || '';
        document.getElementById('field-medico').value = item.medico || '';
        document.getElementById('field-note-salute').value = item.note || '';
        document.getElementById('field-effettuata').checked = item.effettuata || false;

        if (groupEffettuata) groupEffettuata.style.display = 'block';
        if (btnElimina) btnElimina.style.display = 'inline-block';
    } else {
        if (title) title.innerText = 'Nuova Visita Medica';
        document.getElementById('form-salute').reset();
        document.getElementById('edit-id-salute').value = '';
        document.getElementById('field-data-salute').value = new Date().toISOString().split('T')[0];

        if (groupEffettuata) groupEffettuata.style.display = 'none';
        if (btnElimina) btnElimina.style.display = 'none';
    }
};

window.chiudiModalSalute = function () {
    const modal = document.getElementById('modal-salute');
    if (modal) modal.classList.add('hidden');
};

function salvaSalute(e) {
    e.preventDefault();
    const id = document.getElementById('edit-id-salute').value;
    const visita = document.getElementById('field-visita').value.trim();
    const data = document.getElementById('field-data-salute').value;
    const ora = document.getElementById('field-ora-salute').value;
    const medico = document.getElementById('field-medico').value.trim();
    const note = document.getElementById('field-note-salute').value.trim();
    const effettuata = document.getElementById('field-effettuata').checked;

    if (!visita || !data) return;

    if (id) {
        const index = salute.findIndex(s => s.id == id);
        if (index !== -1) {
            salute[index] = { id: Number(id), visita, data, ora, medico, note, effettuata };
        }
    } else {
        salute.push({ id: Date.now(), visita, data, ora, medico, note, effettuata: false });
    }

    localStorage.setItem('salute_db', JSON.stringify(salute));
    caricaDatiSalute();
    chiudiModalSalute();
}

window.eliminaSalute = function () {
    const id = document.getElementById('edit-id-salute').value;
    if (id && confirm('Sei sicuro di voler eliminare questa visita?')) {
        salute = salute.filter(s => s.id != id);
        localStorage.setItem('salute_db', JSON.stringify(salute));
        caricaDatiSalute();
        chiudiModalSalute();
    }
};
// --- FUNZIONI UTILITY CONDIVISE ---
function formatoDataIta(dataIso) {
    if (!dataIso) return '-';
    const parti = dataIso.split('-');
    if (parti.length !== 3) return dataIso;
    return `${parti[2]}/${parti[1]}/${parti[0]}`;
}

// --- NAVIGAZIONE TRA I MODULI ---
function mostraModulo(nomeModulo) {
    const viste = document.querySelectorAll('.vista');
    viste.forEach(v => v.classList.add('hidden'));

    const btnHome = document.getElementById('btn-home');
    const appTitle = document.getElementById('app-title');

    if (nomeModulo === 'menu') {
        const vistaMenu = document.getElementById('vista-menu');
        if (vistaMenu) vistaMenu.classList.remove('hidden');
        if (btnHome) btnHome.classList.add('hidden');
        if (appTitle) appTitle.innerText = '📋 Gestione Casa';
    } else {
        const vistaTarget = document.getElementById(`vista-${nomeModulo}`);
        if (vistaTarget) vistaTarget.classList.remove('hidden');
        if (btnHome) btnHome.classList.remove('hidden');

        const titoli = {
            'scadenze': '📅 Scadenze',
            'scontrini': '🧾 Scontrini & Garanzie',
            'salute': '🏥 Visite & Salute',
            'veicoli': '🚗 Gestione Veicoli',
            'report': '🖨️ Report',
            'guida': '📖 Guida'
        };

        if (appTitle) appTitle.innerText = titoli[nomeModulo] || 'Gestione Casa';

        if (nomeModulo === 'scadenze' && typeof caricaDatiGriglia === 'function') caricaDatiGriglia();
        if (nomeModulo === 'scontrini' && typeof caricaDatiScontrini === 'function') caricaDatiScontrini();
        if (nomeModulo === 'salute' && typeof caricaDatiSalute === 'function') caricaDatiSalute();
        if (nomeModulo === 'veicoli' && typeof caricaDatiVeicoli === 'function') caricaDatiVeicoli();
    }
}

// Funzione globale per tornare al menu
function mostraMenu() {
    mostraModulo('menu');
}

// --- INIZIALIZZAZIONE APPLICAZIONE ---
document.addEventListener('DOMContentLoaded', () => {
    if (typeof inizializzaModuloScadenze === 'function') inizializzaModuloScadenze();
    if (typeof inizializzaModuloScontrini === 'function') inizializzaModuloScontrini();
    if (typeof inizializzaModuloSalute === 'function') inizializzaModuloSalute();
    if (typeof inizializzaModuloVeicoli === 'function') inizializzaModuloVeicoli();
    if (typeof inizializzaModuloGuida === 'function') inizializzaModuloGuida();

    // Inizia sempre mostrando il menu principale
    mostraMenu();
});

// --- GESTIONE INSTALLAZIONE PWA ---
let deferredPrompt;
const btnInstalla = document.getElementById('btn-install-app');

window.addEventListener('beforeinstallprompt', (e) => {
    // Impedisce a Chrome/browser di mostrare automaticamente il banner di default
    e.preventDefault();
    // Salva l'evento per poterne gestire l'attivazione manuale
    deferredPrompt = e;

    // Mostra il pulsante nella barra di navigazione/header
    if (btnInstalla) {
        btnInstalla.style.display = 'inline-block';
    }
});

if (btnInstalla) {
    btnInstalla.addEventListener('click', async () => {
        if (!deferredPrompt) return;

        // Mostra il prompt nativo di installazione
        deferredPrompt.prompt();

        // Attende la scelta dell'utente
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`Risposta installazione: ${outcome}`);

        // Resetta la variabile e nasconde il pulsante
        deferredPrompt = null;
        btnInstalla.style.display = 'none';
    });
}

// Nasconde il pulsante se l'app è già stata installata ed è aperta in finestra PWA
window.addEventListener('appinstalled', () => {
    if (btnInstalla) {
        btnInstalla.style.display = 'none';
    }
    console.log('App installata con successo!');
});
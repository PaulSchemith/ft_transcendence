
function hideCurrentSection() {
    const sections = document.querySelectorAll('section');
    sections.forEach(function (section) {
        if (!section.classList.contains('hidden-element')) {
            section.classList.add('hidden-element');
        }
    });
}

function showSection(sectionId) {
    let targetSection = document.getElementById(sectionId);

    hideCurrentSection();
    // Si sectionId est vide, affichez la section principale par défaut
    if (!sectionId) {
        // Remplacez 'main' par l'ID de votre section principale
        targetSection = document.getElementById('main');
        targetSection.classList.remove('hidden-element');

        location.hash = ''; // Supprime le hash de l'URL
    } else {
        targetSection.classList.remove('hidden-element');
        location.hash = '#' + sectionId;
    }
    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 10);
}


// Écouter les changements d'état du navigateur (bouton de retour)
window.addEventListener('popstate', function (event) {
    var sectionId = (location.hash) ? location.hash.slice(1) : null;
    // console.log('Popstate event:', sectionId);

    showSection(sectionId);

});

// Au chargement initial, vérifiez s'il y a un hash et affichez la section correspondante
document.addEventListener('DOMContentLoaded', function () {
    var sectionId = location.hash.slice(1);
    // console.log('Initial hash:', sectionId);

    showSection(sectionId);

});

// Navbar close auto
document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('.navbar-nav a');

    navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            // Ferme le menu
            const navbarToggler = document.querySelector('.navbar-toggler');
            if (navbarToggler && !navbarToggler.classList.contains('collapsed')) {
                navbarToggler.click();
            }
        });
    });
});


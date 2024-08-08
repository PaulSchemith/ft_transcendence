function alert_register_fail(message) {

    // document.getElementById('spinner').remove();

    let div = document.createElement('div');
    div.classList = 'w-75 mx-auto alert alert-danger alert-dismissible fade show text-center text-danger shadow ';
    div.style.maxWidth= '350px';
    div.role = 'alert';
    div.id = 'alert';
    div.textContent = message;

    let button = document.createElement('button');
    button.classList = 'btn-close';
    button.id = 'alertBtn';
    button.setAttribute('data-bs-dismiss', 'alert');
    button.setAttribute('aria-label', 'Close');
    div.appendChild(button);

    document.getElementById('signUpDiv').appendChild(div);

    document.getElementById('alertBtn').addEventListener("click", function() {
    const signUpSection = document.getElementById('signUp');

        signUpSection.querySelectorAll('input, button').forEach((element) => {
            element.disabled = false;  // Rendre l'élément actif
        });
    });
}

function alert_register_success() {

    // document.getElementById('spinner').remove();

    let div = document.createElement('div');
    div.classList = 'w-75 mx-auto alert alert-success text-center text-success shadow';
    div.style.maxWidth= '350px';
    div.role = 'alert';
    div.id = 'alertSuccess';
    div.textContent = 'The account has been successfully created, a confirmation email has been sent.';

    const br = document.createElement('br');
    div.appendChild(br);

    document.getElementById('signUpDiv').appendChild(div);
    setTimeout(function () {
        showSection('signIn');
        document.getElementById('alertSuccess').remove();
        const signUpSection = document.getElementById('signUp');
        signUpSection.querySelectorAll('input, button').forEach((element) => {
            element.disabled = false;  // Rendre l'élément inactif
        });
    }, 3000);
}

function alert_login_fail() {
    // Disable form
    const signInSection = document.getElementById('signIn');
    // Parcourez tous les éléments descendants de la section
    signInSection.querySelectorAll('input, button').forEach((element) => {
        element.disabled = true;  // Rendre l'élément inactif
    });


    let div = document.createElement('div');
    div.classList = 'w-75 mx-auto alert alert-danger alert-dismissible fade show text-center text-danger shadow ';
    div.style.maxWidth= '350px';
    div.role = 'alert';
    div.id = 'alert';
    div.textContent = 'Error';

    let button = document.createElement('button');
    button.classList = 'btn-close';
    button.id = 'alertBtn';
    button.setAttribute('data-bs-dismiss', 'alert');
    button.setAttribute('aria-label', 'Close');
    div.appendChild(button);

    document.getElementById('signInDiv').appendChild(div);

    document.getElementById('alertBtn').addEventListener("click", function() {

        signInSection.querySelectorAll('input, button').forEach((element) => {
            element.disabled = false;  // Rendre l'élément actif
        });
        document.getElementById('signin-form').reset();
        document.getElementById('signin-form').addEventListener('submit', formSubmitHandler_login);
    });

}

function alert_login_success() {

    // Sélectionnez la section par son ID
    const signInSection = document.getElementById('signIn');

    // Parcourez tous les éléments descendants de la section
    signInSection.querySelectorAll('input, button').forEach((element) => {
    element.disabled = true;  // Rendre l'élément inactif
    });

    const div = document.createElement('div');
    div.classList = 'w-75 mx-auto alert alert-success text-center text-success shadow';
    div.style.maxWidth= '350px';
    div.role = 'alert';
    div.id = 'alertSuccess';
    div.textContent = 'You are successfully logged !';

    document.getElementById('signInDiv').appendChild(div);

    const div1 = document.createElement('div');
    div1.id = 'spinner';
    div1.classList = 'd-flex justify-content-center';

    const div2 = document.createElement('div');
    div2.classList = 'spinner-border text-success';
    div2.role = 'status';
    div1.appendChild(div2);

    document.getElementById('signInDiv').appendChild(div1);
    document.getElementById('signin-form').addEventListener('submit', formSubmitHandler_login);
    setTimeout(function () {

        document.getElementById('alertSuccess').remove();
        document.getElementById('spinner').remove();
        itemsVisibility_logged_in();
        signInSection.querySelectorAll('input, button').forEach((element) => {
            element.disabled = false;  // Rendre l'élément actif
        });
        document.getElementById('signin-form').reset();
        showSection('main');
      }, 2000);

}

function itemsVisibility_logged_in() {

    const elementsToShow = ['friends-gameHistory-btn',
                            'profile',
                            'dashboard',
                            'dropDownProfile',
                            'gameHistory',
                            'displayChatBtn'];

    elementsToShow.forEach((elementId) => {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.remove('unvisible');
        }
    });
//----------------------------------------------------------------
    const elementsToHide = ['nav-signIn',
                            'nav-signUp',
                            'signIn-signUp-btn',
                            'signIn',
                            'signUp'];

    elementsToHide.forEach((elementId) => {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.add('unvisible');
        }
    });
}

function itemsVisibility_logged_out() {

    const elementsToShow = ['nav-signIn',
                            'nav-signUp',
                            'signIn-signUp-btn',
                            'signIn',
                            'signUp'];

    elementsToShow.forEach((elementId) => {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.remove('unvisible');
        }
    });
//----------------------------------------------------------------
    const elementsToHide = ['friends-gameHistory-btn',
                            'profile',
                            'dashboard',
                            'dropDownProfile',
                            'gameHistory',
                            'displayChatBtn',
                            'mainChat'];

    elementsToHide.forEach((elementId) => {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.add('unvisible');
        }
    });
}

function refreshAccessToken() {
    // Récupérez le refresh token de votre système de stockage (par exemple, localStorage)
    const refreshToken = localStorage.getItem('refreshToken');
    console.error(JSON.stringify({
        refresh: refreshToken,
    }));

    if (!refreshToken) {
        console.error('No refresh token available');
        return;
    }
    // Effectuez une requête au point de terminaison de rafraîchissement du token côté serveur
    fetch( domainPath + '/api/account/token/refresh/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            refresh: refreshToken,
        }),
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            // console.log('access token expired, auto logout redirect to signIn');
            userLogout();
            showSection('signIn');
        }
    })
    .then(data => {
        localStorage.setItem('accessToken', data.access);
        location.reload();
        // console.log('Token refreshed successfully');
    })
}

function verifyToken() {
    fetch( domainPath + '/api/account/token/verify/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            token: localStorage.getItem('accessToken'),
        }),
    })
    .then(response => {
        if (response.ok) {
            // console.log('acces token verified');

        } else {
            refreshAccessToken();

            // console.log('refreshAccessToken() called');
        }
    })
}

function profileAccess(connectWith) {

    if (connectWith === '42') {
        document.getElementById('authDiv').classList.add('unvisible');
        document.getElementById('emailProfileDiv').classList.add('unvisible');
        document.getElementById('changePasswordBtn').classList.add('unvisible');
        document.getElementById('setInfoIc').classList.add('unvisible');
    } else if (connectWith === 'signin') {
        document.getElementById('authDiv').classList.remove('unvisible');
        document.getElementById('emailProfileDiv').classList.remove('unvisible');
        document.getElementById('changePasswordBtn').classList.remove('unvisible');
        document.getElementById('setInfoIc').classList.remove('unvisible');
    }
}

function usernameLength(input) {
    if(input.length > 11) {
        alert_register('Username is too long, 11 characters max !');
        return true;
    }
    return false;
}

function alert_register(message) {

    let div = document.createElement('div');
    div.classList = 'mt-3 mb-0 alert alert-danger alert-dismissible fade show text-center text-danger shadow ';
    div.role = 'alert';
    div.id = 'alert';
    div.textContent = message;

    let button = document.createElement('button');
    button.classList = 'btn-close';
    button.id = 'alertButton';
    button.setAttribute('data-bs-dismiss', 'alert');
    button.setAttribute('aria-label', 'Close');
    div.appendChild(button);

    let targetDiv = document.getElementById('signup-form');
    targetDiv.appendChild(div);

    button.addEventListener("click", function() {
        button.remove();
    });
}
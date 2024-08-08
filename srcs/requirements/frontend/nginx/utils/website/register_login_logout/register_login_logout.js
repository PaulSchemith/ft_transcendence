// REGISTER ----------------------------------------------------------------------

document.getElementById('signup-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const inputUsername = formData.get('username');
  if (!usernameLength(inputUsername)) {

    fetch(domainPath + '/api/account/register/', {
      method: 'POST',
      body: formData

    })
    .then(response => {
      // console.log('response = ' + response);

      if (response.status === 201) { // 201 Created (ou le code approprié renvoyé par votre API en cas de succès)
        // console.log('Register Success !' + response.status);
      alert_register_success();
      e.target.reset();
    } else {
      response.json().then((jsonData) => {
        console.error('Erreur lors de l\'inscription : ' + Object.values(jsonData));
        alert_register_fail("Registration error : " + Object.values(jsonData));
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération du contenu JSON de la réponse : ' + error);
      });
      e.target.reset();
    }
    })
    .catch(error => {
      console.error('Erreur lors de la soumission du formulaire :', error);
    });
  }
});

// LOGIN -------------------------------------------------------------------------

function requestLogin(formData) {

  // verifyToken();

  // fetch('http://localhost:8000/api/account/login/', {
    fetch(domainPath + '/api/account/login/', {
    method: 'POST',
    body: formData
  })
  .then(response => {
    if (response.status === 200) {
      // Authentification réussie
      // console.log('login success');
      connected = true;
      alert_login_success();
      return response.json();
    } else {
      // Authentification échouée
      console.error('Authentication failed : ' + response.status);
      response.json()
      .then(data => {
        // console.log('Response data.details:', data);
        alert_login_fail();
      })
      throw new Error('Authentication failed');
    }
  })
  .then(data => {
    // Récupère les informations de l'utilisateur et le jeton d'accès
    // console.log(data);
    // const userInformation = data.user;
    localStorage.setItem('accessToken', data.access);
    localStorage.setItem('refreshToken', data.refresh);
    localStorage.setItem('connectType', 'signin');
    getProfileInfos();
    // getDashboardInfos();
    profileAccess(localStorage.getItem('connectType'));
    //waitForWebSocketConnection(data.user.username);
  })
  .catch(error => {
    console.error('Error : form submit :', error);
    // alert_login_fail(error);
  });
}

document.getElementById('signin-form').addEventListener('submit', formSubmitHandler_login);
function formSubmitHandler_login(e) {
  e.preventDefault();

  // Supprimez l'événement après son déclenchement
  document.getElementById('signin-form').removeEventListener('submit', formSubmitHandler_login);

  check2FA(e)
    .then(response => {
      const formData = new FormData(e.target);
      if (response) {
        // console.log('new form data for 2FA');
        getOTP_createForm(formData);
      } else {
        requestLogin(formData);
      }
    });
}

function userLogout() {
  document.getElementById('alert-bg-blur').classList.remove('hidden-element');
  document.getElementById('cancelLogout').addEventListener('click', function() {
    document.getElementById('alert-bg-blur').classList.add('hidden-element');
  });
}
document.getElementById('validLogout').addEventListener('click', function() {

  document.getElementById('cancelLogout').classList.add('disabled');
  document.getElementById('validLogout').classList.add('disabled');

  userLogout_API();
  const div1 = document.createElement('div');
  div1.id = 'spinner';
  div1.classList = 'd-flex justify-content-center';

  const div2 = document.createElement('div');
  div2.classList = 'spinner-border text-light mt-3';
  div2.role = 'status';
  div1.appendChild(div2);
  const target = document.getElementById('confirm-logout');
  target.appendChild(div1);
  setTimeout(function () {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    itemsVisibility_logged_out();
    document.getElementById('spinner').remove();
    document.getElementById('alert-bg-blur').classList.add('hidden-element');
    showSection('main');
    location.reload();
  }, 3000);
});

// LOGIN WITH 42 ******************************************************************************************
function loginWith42() {
  // console.log('connect with 42 function');
  const oauthUrl = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-44e47265c9b8312f83a47d720211e265bef85a1c8fc632f8786fe9dcdade34d1&redirect_uri=https%3A%2F%2F10.12.5.4%3A8002&response_type=code';
  window.location.href = oauthUrl;
}

const code = getAuthorizationCode();
if (code) {
  // console.log('code = ' + code);
    exchangeCodeForToken(code);
}

function getAuthorizationCode() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('code');
}

async function exchangeCodeForToken(code) {
  try {
    const response = await fetch(domainPath + '/api/account/o/token/?code=' + code);

    if (!response.ok) {
      throw new Error('Error : fetch : exchange token');
    }
    const data = await response.json();
    // console.log('data.access = ' + data.access);
    // console.log('data.refresh = ' + data.refresh);
    // console.log('data = :', data);
    connected = true;
    localStorage.setItem('accessToken', data.access);
    localStorage.setItem('refreshToken', data.refresh);
    localStorage.setItem('connectType', '42');
    itemsVisibility_logged_in();

    // console.log('exchange token');
    getProfileInfos();
    profileAccess(localStorage.getItem('connectType'));

   removeParamURL();
  } catch (error) {
    console.error('Error : request exchange code / token :', error);
    throw error;
  }
}

function removeParamURL() {
  // Récupérer l'URL actuelle
  const currentURL = new URL(window.location.href);

  // Récupérer les paramètres de l'URL
  const urlParams = currentURL.searchParams;

  // Supprimer le paramètre spécifié (dans ce cas, 'code')
  urlParams.delete('code');

  // Mettre à jour l'URL sans le paramètre
  window.history.replaceState({}, document.title, currentURL.href);
}

window.addEventListener('DOMContentLoaded', function () {
  var hash = window.location.hash.substring(1);

  if (hash === 'verify-email') {

    verifyEmail();
  }
});

function verifyEmail() {
  // console.log('Fonction verifyEmail !');

  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');

  // console.log(token);

  if (token) {
    fetch(domainPath + '/api/account/email/verify/?token=' + token)
    .then(response => {
      if (response.status === 200) {
        // Authentification réussie
        // return response.json();
        // console.log('email verified !');
        alert_email_success();
      } else {
        // Gestion des erreurs lors de la récupération du profil
        console.error('Error email verification', response.status);
        // Vous pouvez afficher un message d'erreur ici si nécessaire
      }
    })
    .catch(error => {
      console.error('Network error', error);
      // Vous pouvez afficher un message d'erreur ici si nécessaire
    });
  } else {
    console.error('Token not found in URL');
    // Vous pouvez afficher un message d'erreur ici si nécessaire
  }
}

function alert_email_success() {

  // console.log('Fonction alertEmailSuccess !');
  document.getElementById('verify-email').classList.remove('unvisible');
  const div = document.createElement('div');
  div.classList = 'w-75 p-4 mx-auto alert alert-success text-center text-success shadow';
  div.style.cssText = 'position: fixed; top: 20%; left: 50%; transform: translate(-50%, -50%)';

  div.style.maxWidth= '350px';
  div.role = 'alert';
  div.id = 'alertSuccessEmail';
  div.innerHTML = 'Email has been verified with success<br>You can close this window.';

  document.getElementById('verify-email').appendChild(div);
  document.getElementById('header').classList.add('hidden-element');
  document.getElementById('footer').classList.add('hidden-element');
}


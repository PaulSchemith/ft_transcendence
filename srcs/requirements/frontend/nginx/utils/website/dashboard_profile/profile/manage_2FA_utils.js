function displaySpinner() {
    const div1 = document.createElement('div');
    div1.id = 'spinner';
    div1.classList = 'd-flex justify-content-center mt-3';
    const div2 = document.createElement('div');
    div2.classList = 'spinner-border text-info';
    div2.role = 'status';
    div1.appendChild(div2);
    document.getElementById('mainBtnDiv').appendChild(div1);
}

function check2FA(e) {
    const form = e.target;
    const usernameInput = form.querySelector('input[name="username"]');
    const usernameValue = usernameInput.value;

    // const passwordInput = form.querySelector('input[name="password"]');
    // const passwordValue = passwordInput.value;

    // Retourne la promesse de l'appel fetch
    return fetch(domainPath + '/api/account/profile/' + usernameValue + '/', {
        // return fetch('http://localhost:8000/api/account/profile/' + usernameValue, passwordValue, {
      method: 'GET',
    })
    .then(response => {
      if (response.status === 200) {
        return response.json();
      } else {
          alert_login_fail('Error : wrong username or password');
          throw new Error(response.statusText);
        }
    })
    .then(data => {
        // console.log('data.two_fa = ' + data.two_fa);
      return data.two_fa; // Renvoie la valeur pour que cela soit disponible dans la chaîne de promesses
    })
    .catch(error => {
      console.error('Error : ' + error);
      throw error; // Renvoie l'erreur pour la gérer dans la chaîne de promesses
    });
}

function handleBtn_2FA(formData) {

    // email btn ------------------------------------------------------------------------
    document.getElementById('two_fa_emailBtn').addEventListener('click', function() {
        //-- Active inputs & buttons on signIn form -----------------------
        document.getElementById('two_fa_emailBtn').classList.add('btn-info');
        document.getElementById('two_fa_emailBtn').classList.remove('btn-outline-info');

        disable2FABtn();
        sendCode(formData, 'email');
        displaySpinner();
    })

    // email sms ------------------------------------------------------------------------
    document.getElementById('two_fa_smsBtn').addEventListener('click', function() {
        //-- Active inputs & buttons on signIn form -----------------------
        document.getElementById('two_fa_smsBtn').classList.add('btn-info');
        document.getElementById('two_fa_smsBtn').classList.remove('btn-outline-info');

        disable2FABtn();
        sendCode(formData, 'sms');
        displaySpinner();
    })

    // email app ------------------------------------------------------------------------
    document.getElementById('two_fa_appBtn').addEventListener('click', function() {
        //-- Active inputs & buttons on signIn form -----------------------
        document.getElementById('two_fa_appBtn').classList.add('btn-info');
        document.getElementById('two_fa_appBtn').classList.remove('btn-outline-info');

        disable2FABtn();
        sendCode(formData, 'application');
        displaySpinner();
    })

    // Cancel btn ----------------------------------------------------------------------
    document.getElementById('two_fa_cancelBtn').addEventListener('click', function() {

        signIn_form_state('on');
        document.getElementById('manage_two_fa-div').remove();
        document.getElementById('signin-form').addEventListener('submit', formSubmitHandler_login);

        // document.getElementById('signin-form').reset();
    })
}

function signIn_form_state(state) {
    if (state === 'on') {
        document.querySelectorAll('#signIn, input').forEach((element) => {
            element.disabled = false;  // Rendre l'élément actif
        });
        document.querySelectorAll('#signIn, button').forEach((element) => {
            element.classList.remove('disabled');
        });
        document.getElementById('signin-form').reset();

    }
    if (state === 'off') {

        document.querySelectorAll('#signIn, input').forEach((element) => {
            element.disabled = true;  // Rendre l'élément actif
        });
        document.querySelectorAll('#signIn, button').forEach((element) => {
            element.classList.add('disabled');
        });
    }
}

function disable2FABtn() {
    document.getElementById('two_fa_emailBtn').classList.add('disabled');
    document.getElementById('two_fa_appBtn').classList.add('disabled');
    document.getElementById('two_fa_smsBtn').classList.add('disabled');
}

function alert_sendCode_error(errorMessage) {

    const spinner = document.getElementById('spinner');
    if (spinner) {
        spinner.remove();
    }

    let alertDiv = document.createElement('div');
    alertDiv.classList = 'alert alert-danger alert-dismissible text-center text-danger shadow';
    alertDiv.style.maxWidth= '350px';
    alertDiv.role = 'alert';
    alertDiv.id = 'alert';
    alertDiv.textContent = errorMessage;

    let button = document.createElement('button');
    button.classList = 'btn-close';
    button.id = 'alertBtn';
    button.setAttribute('data-bs-dismiss', 'alert');
    button.setAttribute('aria-label', 'Close');
    alertDiv.appendChild(button);

    document.getElementById('btnDiv').classList.add('hidden-element');
    document.getElementById('mainBtnDiv').appendChild(alertDiv);

    button.addEventListener('click', function() {
        document.getElementById('btnDiv').classList.remove('hidden-element');
        reset2FABtn();

    })

}

function reset2FABtn() {
    document.getElementById('two_fa_emailBtn').classList.remove('disabled');
    document.getElementById('two_fa_appBtn').classList.remove('disabled');
    document.getElementById('two_fa_smsBtn').classList.remove('disabled');

    document.getElementById('two_fa_emailBtn').classList.remove('btn-info');
    document.getElementById('two_fa_emailBtn').classList.add('btn-outline-info');

    document.getElementById('two_fa_appBtn').classList.remove('btn-info');
    document.getElementById('two_fa_appBtn').classList.add('btn-outline-info');

    document.getElementById('two_fa_smsBtn').classList.remove('btn-info');
    document.getElementById('two_fa_smsBtn').classList.add('btn-outline-info');
}

function displayQRcode(totpUrl) {

    new QRCode(document.getElementById("qrcode"), {
        text: totpUrl,
        width: 160,
        height: 160,
        correctLevel: QRCode.CorrectLevel.H,

    });
}

function getOTP_createForm(formData) {

    signIn_form_state('off');

    const mainDiv = document.createElement('div');
    mainDiv.id = 'manage_two_fa-div';
    mainDiv.classList = 'col mx-auto p-3 mt-3 shadow rounded-3';

    const title = document.createElement('h6');
    title.classList = 'col text-center text-secondary fw-bold';
    title.textContent = '2FA Authentication';
    mainDiv.appendChild(title);

    const mainBtnDiv = document.createElement('div');
    mainBtnDiv.id = 'mainBtnDiv';
    mainDiv.appendChild(mainBtnDiv);

    const btnDiv = document.createElement('div');
    btnDiv.classList = 'col-12 d-flex justify-content-around mt-3';
    btnDiv.id = 'btnDiv';

    //-- 2FA by mail btn -------------------------------------------------
    const emailBtn = document.createElement('button');
    emailBtn.type = 'button';
    emailBtn.classList = 'btn btn-sm btn-outline-info fw-bold';
    emailBtn.textContent = 'email';
    emailBtn.name = 'two_fa_email';
    emailBtn.id = 'two_fa_emailBtn';
    emailBtn.autocomplete = 'off';
    btnDiv.appendChild(emailBtn);
    //-------------------------------------------------------------------

    //-- 2FA by app btn -------------------------------------------------
    const appBtn = document.createElement('button');
    appBtn.type = 'button';
    appBtn.classList = 'btn btn-sm btn-outline-info fw-bold';
    appBtn.textContent = 'app';
    appBtn.name = 'two_fa_app';
    appBtn.id = 'two_fa_appBtn';
    appBtn.autocomplete = 'off';
    btnDiv.appendChild(appBtn);
    //-------------------------------------------------------------------

    //-- 2FA by sms btn -------------------------------------------------
    const smsBtn = document.createElement('button');
    smsBtn.type = 'button';
    smsBtn.classList = 'btn btn-sm btn-outline-info fw-bold';
    smsBtn.textContent = 'sms';
    smsBtn.name = 'two_fa_app';
    smsBtn.id = 'two_fa_smsBtn';
    smsBtn.autocomplete = 'off';
    btnDiv.appendChild(smsBtn);
    //-------------------------------------------------------------------

    mainBtnDiv.appendChild(btnDiv);
    mainDiv.appendChild(mainBtnDiv);

   //-- Cancel btn -------------------------------------------------------
    const line = document.createElement('hr');
    line.classList = 'px-5 mt-4 text-info border-2';

    mainDiv.appendChild(line);

    const quitDiv = document.createElement('div');
    quitDiv.classList = 'mx-auto mt-4'
    const quitBtn = document.createElement('button');
    quitBtn.type = 'button';
    quitBtn.classList = 'btn btn-sm btn-outline-danger w-100 fw-bold';
    quitBtn.textContent = 'Cancel';
    quitBtn.name = 'two_fa_app';
    quitBtn.id = 'two_fa_cancelBtn';
    quitBtn.autocomplete = 'off';
    quitDiv.appendChild(quitBtn);
    mainDiv.appendChild(quitDiv);
    //-------------------------------------------------------------------

    targetDiv = document.getElementById('signin-form').appendChild(mainDiv);
    handleBtn_2FA(formData);
}

function mobileInput_createForm() {

    disableProfileBtn();

    document.getElementById('mobileInfosDiv').classList.add('hidden-element');

    const mainDiv = document.createElement('div');
    mainDiv.id = 'modifyForm';
    mainDiv.classList = 'col-md-6  p-3 shadow rounded-3';

    const mobileForm = document.createElement('form');
    mobileForm.method = 'patch';
    mobileForm.id = 'mobile-form';
    mainDiv.appendChild(mobileForm);

    const rowDiv = document.createElement('div');
    rowDiv.classList = 'row';
    rowDiv.id = 'inputMobileRowDiv';

    const div1 = document.createElement('div');
    div1.classList = 'form-group col-5';

    const select = document.createElement('select');
    select.id = 'countryCode';
    select.classList = 'form-control form-control-sm border-info text-center text-info fw-bold';
    select.name = 'country_code';

    const option1 = document.createElement('option');
    option1.value = '+33';
    option1.textContent = '+33 (FR)';
    select.appendChild(option1)

    const option2 = document.createElement('option');
    option2.value = '+44';
    option2.textContent = '+44 (UK)';
    select.appendChild(option2)

    const option3 = document.createElement('option');
    option3.value = '+1';
    option3.textContent = '+1 (US)';
    select.appendChild(option3)

    const option4 = document.createElement('option');
    option4.value = '+61';
    option4.textContent = '+61 (AUS)';
    select.appendChild(option4)

    const option5 = document.createElement('option');
    option5.value = '+39';
    option5.textContent = '+39 (IT)';
    select.appendChild(option5)

    div1.appendChild(select);
    rowDiv.appendChild(div1);
    mobileForm.appendChild(rowDiv);

    const div2 = document.createElement('div');
    div2.classList = 'form-group col-7';

    const input = document.createElement('input');
    input.type = 'tel';
    input.name = 'mobile_number';
    input.classList = 'form-control form-control-sm border-info text-center text-info fw-bold';
    input.id = 'inputMobileNumber';
    input.placeholder = 'mobile number';
    input.autocomplete = 'off';

    div2.appendChild(input);
    rowDiv.appendChild(div2);
    mobileForm.appendChild(rowDiv);

    const sendBtn = document.createElement('button');
    sendBtn.id = 'sendBtn';
    sendBtn.type = 'submit';
    sendBtn.classList = 'btn btn-sm btn-outline-info fw-bold mt-3 w-100';
    sendBtn.textContent = 'Send';
    mobileForm.appendChild(sendBtn);
    mainDiv.appendChild(mobileForm);

    const line = document.createElement('hr');
    line.classList = 'px-5 mt-4 text-info border-2';
    mainDiv.appendChild(line);

    const cancelBtn = document.createElement('button');
    cancelBtn.id = 'cancelBtn';
    cancelBtn.classList = 'btn btn-sm btn-outline-danger fw-bold w-100 shadow';
    cancelBtn.textContent = 'Cancel';

    mainDiv.appendChild(cancelBtn);
    document.getElementById('mobileDiv').appendChild(mainDiv);

    document.getElementById('cancelBtn').addEventListener('click', function() {

        document.getElementById('modifyForm').remove();
        document.getElementById('mobileInfosDiv').classList.remove('hidden-element');
        enableProfileBtn();
    })

    document.getElementById('sendBtn').addEventListener('click', function() {

        setMobile_API();
    })

}

function verifyMobile_createForm(formData) {

    disableProfileBtn();

    document.getElementById('mobileInfosDiv').classList.add('hidden-element');

    const mainDiv = document.createElement('div');
    mainDiv.id = 'modifyForm';
    mainDiv.classList = 'col-md-6  p-3 shadow rounded-3';

    const mobileForm = document.createElement('form');
    mobileForm.method = 'post';
    mobileForm.id = 'mobile-form';
    mainDiv.appendChild(mobileForm);

    const input = document.createElement('input');
    input.type = 'text';
    input.name = 'codeOTP';
    input.classList = 'form-control form-control-sm border-info text-center text-info fw-bold';
    input.id = 'codeOTP';
    input.placeholder = 'code';
    input.autocomplete = 'off';

    mobileForm.appendChild(input);

    const sendBtn = document.createElement('button');
    sendBtn.id = 'verifyBtn';
    sendBtn.type = 'submit';
    sendBtn.classList = 'btn btn-sm btn-outline-info fw-bold mt-3 w-100';
    sendBtn.textContent = 'Verify mobile';
    mobileForm.appendChild(sendBtn);
    mainDiv.appendChild(mobileForm);

    const line = document.createElement('hr');
    line.classList = 'px-5 mt-4 text-info border-2';
    mainDiv.appendChild(line);

    const cancelBtn = document.createElement('button');
    cancelBtn.id = 'cancelBtn';
    cancelBtn.classList = 'btn btn-sm btn-outline-danger fw-bold w-100 shadow';
    cancelBtn.textContent = 'Cancel';

    mainDiv.appendChild(cancelBtn);
    document.getElementById('mobileDiv').appendChild(mainDiv);

    document.getElementById('cancelBtn').addEventListener('click', function() {

        document.getElementById('modifyForm').remove();
        document.getElementById('mobileInfosDiv').classList.remove('hidden-element');
        enableProfileBtn();
    })

    document.getElementById('verifyBtn').addEventListener('click', function() {
        verifyMobile_API();
    })

}

function verifyMobile_API() {
    // console.log('VERIFY MOBILE FUNCTION');
    verifyToken();

    document.getElementById('mobile-form').addEventListener('submit', function (e) {
        e.preventDefault();
        const form = e.target;
        const inputOTP = form.querySelector('input[name="codeOTP"]');
        const OTPValue = inputOTP.value;

        fetch ( domainPath + '/api/account/mobile/verify/?otp=' + OTPValue, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }
        })
        .then(response => {
            if (response.ok) {
                // console.log('Mobile Verified Success :', response.status);
                alert_modify_success('mobileInfosDiv', 'Mobile verified !');
                getProfileInfos(localStorage.getItem('accessToken'));
            }
            else {
                console.error('Error : Mobile Verifification : ', response.status);
                alert_modify_error('mobileInfosDiv', 'Error : Mobile not verified !');
                getProfileInfos(localStorage.getItem('accessToken'));
            }
        })
        .catch(error => {
            console.error('Fetch Error : ', error);
        });
    })
}

function sendCode(formData, method) {

    formData.append('send_method', method);

    fetch( domainPath + '/api/account/otp/', {
        method: 'POST',
        body: formData
    })
    .then(response => {
    //   console.log('response = ' + response);

      if (response.ok) { // 201 Created (ou le code approprié renvoyé par votre API en cas de succès)
        // console.log('Send ' + method + ' success ! ' + response.status);
        if (method !== 'application') {
            inputCode_form('Enter the code sent by ' + method, formData, method);
        }
        else {
            response.json()
            .then(data => {
                // console.log('Response data:', data);
                inputCode_form('Enter the code sent by ' + method, formData, method, data);
            })
            .catch(error => {
                console.error('Error parsing JSON:', error);
            });
        }
      }
      else {
            response.json().then((jsonData) => {
            console.error('Error : Send ' + method + ' : ' + Object.values(jsonData));
            alert_sendCode_error(Object.values(jsonData));
        })
        .catch((error) => {
          console.error('Error : Send ' + method + ' OTP ' + error);
        });
      }
    })
    .catch(error => {
      console.error('Error during fetch: ', error);
    });
}

function inputCode_form(message, formData, method, totpUrl) {

    document.getElementById('spinner').remove();

    let alertDiv = document.createElement('div');
    alertDiv.classList = 'alert text-center text-info fw-bold';
    alertDiv.style.maxWidth= '350px';
    alertDiv.role = 'alert';
    alertDiv.id = 'alertSuccess';
    alertDiv.textContent = message;

    if(method === 'application') {
        const appDiv = document.createElement('div');
        appDiv.classList = 'col';
        appDiv.id = 'appDiv';
        const qrcodeDiv = document.createElement('div');
        qrcodeDiv.id = 'qrcode';
        qrcodeDiv.classList = 'py-3 d-flex justify-content-center';
        appDiv.appendChild(qrcodeDiv);
        alertDiv.append(appDiv);
    }

    const inputDiv = document.createElement('input');
    inputDiv.type = 'text';
    inputDiv.classList = 'form-control form-control-sm border-info mt-2';
    inputDiv.id = 'inputOTP';
    inputDiv.autocomplete = 'off';
    alertDiv.appendChild(inputDiv);

    const sendBtn = document.createElement('button');
    sendBtn.classList = 'btn btn-sm btn-outline-info fw-bold w-100 shadow mt-3';
    sendBtn.textContent = 'Send';
    sendBtn.type = 'button';
    sendBtn.id = 'sendBtn';

    alertDiv.appendChild(sendBtn);

    document.getElementById('btnDiv').remove();
    document.getElementById('mainBtnDiv').appendChild(alertDiv);
    if(method === 'application') {
        displayQRcode(totpUrl);

    }
    sendBtn.addEventListener('click', function() {
        if(inputDiv.value === "") {
            return;
        }
        let key;
        if (method === 'email' || method === 'sms') {
            key = 'otp';
        }
        if (method === 'application') {
            key = 'totp';
        }
        formData.append(key, inputDiv.value);
        requestLogin(formData);
        signIn_form_state('on');
        document.getElementById('manage_two_fa-div').remove();
    })
}


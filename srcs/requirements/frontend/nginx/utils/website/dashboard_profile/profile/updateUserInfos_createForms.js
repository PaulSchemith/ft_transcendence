function handleAvatar_createForm() {
    // hide current infos
    document.getElementById('avatarProfile').classList.add('hidden-element');
    disableProfileBtn();

    const mainDiv = document.createElement('div');
    mainDiv.id = 'modifyForm';
    mainDiv.classList = 'col-sm-6 mx-auto shadow p-3 rounded-4 bg-info bg-opacity-10';

    const formDiv = document.createElement('form');
    formDiv.id = 'modifyAvatar-form';
    formDiv.method = 'post';
    mainDiv.appendChild(formDiv);


    const input = document.createElement('input');
    input.accept = 'image/*';
    input.name = 'avatar';
    input.id = 'avatarInput';

    input.type = 'file';
    input.classList = 'form-control form-control-sm my-4 border-info text-secondary text-center';

    formDiv.appendChild(input);


    const rowDiv = document.createElement('div');
    rowDiv.classList = 'row mt-2';

    const col1Div = document.createElement('div');
    col1Div.classList = 'col-6';

    const cancelBtn = document.createElement('button');
    cancelBtn.id = 'cancelBtn';
    cancelBtn.classList = 'btn btn-sm btn-outline-danger w-100 shadow bagelFatOne';
    cancelBtn.type = 'submit';
    cancelBtn.textContent = 'Cancel';
    col1Div.appendChild(cancelBtn);
    rowDiv.appendChild(col1Div);

    const col2Div = document.createElement('div');
    col2Div.classList = 'col-6';

    const applyBtn = document.createElement('button');
    applyBtn.id = 'applyBtn';
    applyBtn.classList = 'btn btn-sm btn-outline-success w-100 shadow bagelFatOne';
    applyBtn.type = 'submit';
    applyBtn.textContent = 'Apply';
    col2Div.appendChild(applyBtn);
    rowDiv.appendChild(col2Div);

    formDiv.appendChild(rowDiv);
    document.getElementById('avatarDiv').appendChild(mainDiv);

    document.getElementById('cancelBtn').addEventListener('click', function () {
        document.getElementById('modifyForm').remove();
        document.getElementById('avatarProfile').classList.remove('hidden-element');
        enableProfileBtn();
    });

    document.getElementById('applyBtn').addEventListener('click', function () {
        // console.log('apply btn pushed');
        modifyAvatar_API();
    });

}

function handleBio_createForm() {
    // hide current bio
    document.getElementById('bioProfileDiv').classList.add('hidden-element');
    // document.getElementById('setBioIc').classList.add('hidden-element');

    disableProfileBtn();

    const mainDiv = document.createElement('div');
    mainDiv.id = 'modifyForm';
    mainDiv.classList = 'col-sm-10 mx-auto shadow p-3  rounded-4 bg-info bg-opacity-10';

    const formDiv = document.createElement('form');
    formDiv.id = 'modifyBio-form';
    formDiv.method = 'patch';
    mainDiv.appendChild(formDiv);

    const textareaDiv = document.createElement('textarea');
    textareaDiv.id = 'newBio';
    textareaDiv.type = 'text';
    textareaDiv.classList = 'form-control form-control-sm mb-2 border-info shadow text-center';
    textareaDiv.name = 'bio';
    textareaDiv.rows = '4';
    textareaDiv.placeholder = 'Enter your bio here';
    formDiv.appendChild(textareaDiv);

    // input = document.createElement('input');
    // input.id = 'password';
    // input.type = 'password';
    // input.name = 'password';
    // input.classList = 'form-control w-50 mx-auto form-control-sm mb-1 mt-3 border-success text-center shadow w-50 mx-auto';
    // input.placeholder = 'password';
    // formDiv.appendChild(input);

    const rowDiv = document.createElement('div');
    rowDiv.classList = 'row mt-2';

    const col1Div = document.createElement('div');
    col1Div.classList = 'col-6';

    const cancelBtn = document.createElement('button');
    cancelBtn.id = 'cancelBtn';
    cancelBtn.classList = 'btn btn-sm btn-outline-danger w-100 shadow bagelFatOne';
    cancelBtn.type = 'submit';
    cancelBtn.textContent = 'Cancel';
    col1Div.appendChild(cancelBtn);
    rowDiv.appendChild(col1Div);

    const col2Div = document.createElement('div');
    col2Div.classList = 'col-6';

    const applyBtn = document.createElement('button');
    applyBtn.id = 'applyBtn';
    applyBtn.classList = 'btn btn-sm btn-outline-success w-100 shadow bagelFatOne';
    applyBtn.type = 'submit';
    applyBtn.textContent = 'Apply';
    col2Div.appendChild(applyBtn);
    rowDiv.appendChild(col2Div);

    formDiv.appendChild(rowDiv);
    document.getElementById('bioDiv').appendChild(mainDiv);


    document.getElementById('cancelBtn').addEventListener('click', function () {
        document.getElementById('modifyForm').remove();
        document.getElementById('bioProfileDiv').classList.remove('hidden-element');
        document.getElementById('setBioIc').classList.remove('hidden-element');
        enableProfileBtn();
    });
    document.getElementById('applyBtn').addEventListener('click', function () {
        modifyBio_API();

    });
}

function handleInfos_createForm() {
    // hide current infos
    document.getElementById('infosProfile').classList.add('hidden-element');
    disableProfileBtn();

    const mainDiv = document.createElement('div');
    mainDiv.id = 'modifyForm';
    mainDiv.classList = 'col-sm-6 mx-auto shadow p-3 rounded-4 bg-info bg-opacity-10';

    const formDiv = document.createElement('form');
    formDiv.id = 'modifyProfileInfos-form';
    formDiv.method = 'patch';
    mainDiv.appendChild(formDiv);

    const inputsName = ["username", "first_name", "last_name"];
    for (let i = 0; i < 3; i++) {
        const input = document.createElement('input');

        input.name = inputsName[i];
        input.id = inputsName[i] + 'ModifyProfile';
        input.placeholder = inputsName[i];
        input.type = 'text';
        input.classList = 'form-control mb-2 border-info text-secondary text-center';

        formDiv.appendChild(input);
    }

    const rowDiv = document.createElement('div');
    rowDiv.classList = 'row mt-2';

    const col1Div = document.createElement('div');
    col1Div.classList = 'col-6';

    const cancelBtn = document.createElement('button');
    cancelBtn.id = 'cancelBtn';
    cancelBtn.classList = 'btn btn-sm btn-outline-danger w-100 shadow bagelFatOne';
    cancelBtn.type = 'submit';
    cancelBtn.textContent = 'Cancel';
    col1Div.appendChild(cancelBtn);
    rowDiv.appendChild(col1Div);

    const col2Div = document.createElement('div');
    col2Div.classList = 'col-6';

    const applyBtn = document.createElement('button');
    applyBtn.id = 'applyBtn';
    applyBtn.classList = 'btn btn-sm btn-outline-success w-100 shadow bagelFatOne';
    applyBtn.type = 'submit';
    applyBtn.textContent = 'Apply';
    col2Div.appendChild(applyBtn);
    rowDiv.appendChild(col2Div);

    formDiv.appendChild(rowDiv);
    document.getElementById('infosDiv').appendChild(mainDiv);

    document.getElementById('cancelBtn').addEventListener('click', function () {
        document.getElementById('modifyForm').remove();
        document.getElementById('infosProfile').classList.remove('hidden-element');
        enableProfileBtn();
    });

    document.getElementById('applyBtn').addEventListener('click', function () {
        // console.log('apply btn pushed');

        modifyInfos_API();
    });

}

function handleEmail_createForm() {
    // hide current email
    document.getElementById('emailProfileDiv').classList.add('hidden-element');
    // document.getElementById('setEmailIc').classList.add('hidden-element');
    disableProfileBtn();


    const mainDiv = document.createElement('div');
    mainDiv.id = 'modifyForm';
    mainDiv.classList = 'col-sm-8 mx-auto shadow p-3 rounded-4 bg-info bg-opacity-10';

    const text = document.createElement('h6');
    text.classList = 'text-secondary text-danger text-secondary text-center fst-italic fw-light bagelFatOne';
    text.textContent = "You'll be disconnected to verify the new address";
    mainDiv.appendChild(text);

    const formDiv = document.createElement('form');
    formDiv.id = 'modifyEmail-form';
    formDiv.method = 'patch';
    mainDiv.appendChild(formDiv);

    let input = document.createElement('input');
    input.id = 'newEmail';
    input.type = 'email';
    input.name = 'email';
    input.classList = 'form-control mb-2 border-info text-secondar text-center';
    input.placeholder = 'new email';
    formDiv.appendChild(input);

    const rowDiv = document.createElement('div');
    rowDiv.classList = 'row mt-2';

    const col1Div = document.createElement('div');
    col1Div.classList = 'col-6';

    const cancelBtn = document.createElement('button');
    cancelBtn.id = 'cancelBtn';
    cancelBtn.classList = 'btn btn-sm btn-outline-danger w-100 shadow bagelFatOne';
    cancelBtn.type = 'submit';
    cancelBtn.textContent = 'Cancel';
    col1Div.appendChild(cancelBtn);
    rowDiv.appendChild(col1Div);

    const col2Div = document.createElement('div');
    col2Div.classList = 'col-6';

    const applyBtn = document.createElement('button');
    applyBtn.id = 'applyBtn';
    applyBtn.classList = 'btn btn-sm btn-outline-success w-100 shadow bagelFatOne';
    applyBtn.type = 'submit';
    applyBtn.textContent = 'Apply';
    col2Div.appendChild(applyBtn);
    rowDiv.appendChild(col2Div);

    formDiv.appendChild(rowDiv);
    document.getElementById('emailDiv').appendChild(mainDiv);

    modifyEmail_API();

    document.getElementById('cancelBtn').addEventListener('click', function () {
        document.getElementById('modifyForm').remove();
        document.getElementById('emailProfileDiv').classList.remove('hidden-element');
        document.getElementById('setEmailIc').classList.remove('hidden-element');
        enableProfileBtn();

    });
}

function handlePassword_createForm() {
    // hide 'change password' btn
    document.getElementById('changeEraseBtn').classList.add('hidden-element');
    disableProfileBtn();


    const mainDiv = document.createElement('div');
    mainDiv.id = 'modifyForm';
    mainDiv.classList = 'col-sm-6 mx-auto shadow p-3 mt-3 rounded-4 bg-info bg-opacity-10';

    const formDiv = document.createElement('form');
    formDiv.id = 'modifyPassword-form';
    formDiv.method = 'patch';


    let input = document.createElement('input');
    input.id = 'currentPassword';
    input.type = 'password';
    input.name = 'password';
    input.classList = 'form-control form-control-sm mb-2 border-info shadow text-center w-50 mx-auto';
    input.placeholder = 'current password';
    formDiv.appendChild(input);

    input = document.createElement('input');
    input.id = 'newPassword';
    input.type = 'password';
    input.name = 'new_password';
    input.classList = 'form-control form-control-sm mb-2 border-info shadow text-center w-50 mx-auto';
    input.placeholder = 'new password';
    formDiv.appendChild(input);


    const rowDiv = document.createElement('div');
    rowDiv.classList = 'row mt-2';

    const col1Div = document.createElement('div');
    col1Div.classList = 'col-6';

    const cancelBtn = document.createElement('button');
    cancelBtn.id = 'cancelBtn';
    cancelBtn.classList = 'btn btn-sm btn-outline-danger w-100 shadow bagelFatOne';
    cancelBtn.type = 'submit';
    cancelBtn.textContent = 'Cancel';
    col1Div.appendChild(cancelBtn);
    rowDiv.appendChild(col1Div);

    const col2Div = document.createElement('div');
    col2Div.classList = 'col-6';

    const applyBtn = document.createElement('button');
    applyBtn.id = 'applyBtn';
    applyBtn.classList = 'btn btn-sm btn-outline-success w-100 shadow bagelFatOne';
    applyBtn.type = 'submit';
    applyBtn.textContent = 'Apply';
    col2Div.appendChild(applyBtn);
    rowDiv.appendChild(col2Div);

    formDiv.appendChild(rowDiv);
    mainDiv.appendChild(formDiv);

    document.getElementById('changeEraseDiv').appendChild(mainDiv);

    document.getElementById('cancelBtn').addEventListener('click', function () {
        document.getElementById('modifyForm').remove();
        document.getElementById('changeEraseBtn').classList.remove('hidden-element');
        enableProfileBtn();

    });

    document.getElementById('applyBtn').addEventListener('click', function () {
       modifyPassword_API();
    });
}

function handle2FA_createForm() {

    document.getElementById('authProfile').classList.add('hidden-element');
    disableProfileBtn();
    const mainDiv = document.createElement('div');
    mainDiv.id = 'modifyForm';
    mainDiv.classList = 'col-sm-6 mx-auto shadow p-3 mt-3 rounded-4 bg-info bg-opacity-10';

    const title = document.createElement('h6');
    title.classList = 'col text-center text-secondary fw-bold bagelFatOne';
    title.textContent = '2FA Authentication';
    mainDiv.appendChild(title);

    const formDiv = document.createElement('form');
    formDiv.id = 'twofa-form';
    formDiv.method = 'patch';
    mainDiv.appendChild(formDiv);

    const btnDiv = document.createElement('div');
    btnDiv.classList = 'col-12 d-flex justify-content-center mt-0';
    formDiv.appendChild(btnDiv);

    let input = document.createElement('input');
    input.type = 'radio';
    input.classList = 'form-control btn-check';
    input.name = 'two_fa_on';
    input.id = 'two_fa_on';
    input.autocomplete = 'off';
    if (two_fa === true) {
        input.checked = true;
    } else {
        input.checked = false;
    }
    btnDiv.appendChild(input);

    let label = document.createElement('label');
    label.classList = 'btn btn-sm btn-outline-info py-0 px-2 me-1 bagelFatOne';
    label.htmlFor = 'two_fa_on';
    label.textContent = 'ON';
    btnDiv.appendChild(label);


    input = document.createElement('input');
    input.type = 'radio';
    input.classList = 'form-control btn-check';
    input.name = 'two_fa_off';
    input.id = 'two_fa_off';
    input.autocomplete = 'off';
    if (two_fa === false) {
        input.checked = true;
    } else {
        input.checked = false;
    }
    btnDiv.appendChild(input);

    label = document.createElement('label');
    label.classList = 'btn btn-sm btn-outline-info py-0 px-2 me-1 bagelFatOne';
    label.htmlFor = 'two_fa_off';
    label.textContent = 'OFF';
    btnDiv.appendChild(label);

    const rowDiv = document.createElement('div');
    rowDiv.classList = 'row mt-2';


    const col1Div = document.createElement('div');
    col1Div.classList = 'col-6';
    const cancelBtn = document.createElement('button');
    cancelBtn.id = 'cancelBtn';
    cancelBtn.classList = 'btn btn-sm btn-outline-danger w-100 shadow bagelFatOne';
    cancelBtn.type = 'submit';
    cancelBtn.textContent = 'Cancel';
    col1Div.appendChild(cancelBtn);
    rowDiv.appendChild(col1Div);

    const col2Div = document.createElement('div');
    col2Div.classList = 'col-6';
    const applyBtn = document.createElement('button');
    applyBtn.id = 'applyBtn';
    applyBtn.classList = 'btn btn-sm btn-outline-success w-100 shadow bagelFatOne';
    applyBtn.type = 'submit';
    applyBtn.textContent = 'Apply';
    col2Div.appendChild(applyBtn);
    rowDiv.appendChild(col2Div);

    formDiv.appendChild(rowDiv);
    document.getElementById('authDiv').appendChild(mainDiv);


    document.getElementById('cancelBtn').addEventListener('click', function () {
        document.getElementById('modifyForm').remove();
        document.getElementById('authProfile').classList.remove('hidden-element');
        enableProfileBtn();
    });

    document.getElementById('applyBtn').addEventListener('click', function () {
        // if(document.getElementById('2FA-btn-on').checked = true) {
        //     document.getElementById('mobileDiv').classList.remove('hidden-element');
        // } else {
        //     document.getElementById('mobileDiv').classList.add('hidden-element');
        // }
        modify2FA_API();

    });


    document.getElementById('two_fa_on').addEventListener('click', function (element) {

        element.checked = true;
        document.getElementById('two_fa_off').checked = false;
        document.getElementById('authTitle').classList.add('text-success');
    });

    document.getElementById('two_fa_off').addEventListener('click', function (element) {

        element.checked = true;
        document.getElementById('two_fa_on').checked = false;
        document.getElementById('authTitle').classList.remove('text-success');


    });
}

// function handleTwoFA_createForm() {
//     const mainDiv = document.createElement('div');
//     mainDiv.id = 'mobileDiv';
//     mainDiv.classList = 'col d-flex justify-content-center';
//     const textBtn = document.createElement('h6');
//     textBtn.classList = 'btn btn-sm border-0 text-center text-secondary fw-light';
//     textBtn.setAttribute('onclick', "");
//     textBtn.textContent = 'authenticate with mobile';

//     mainDiv.appendChild(textBtn);

//     if (two_fa === true) {
//         document.getElementById('authTitleDiv').appendChild(mainDiv);
//         document.getElementById('authTitle').classList.add('text-success');
//     } else {
//         document.getElementById('mobileDiv').remove();
//         document.getElementById('authTitle').classList.remove('text-success');
//     }
// }

function eraseAccount_createForm() {
    // hide 'change password' btn
    document.getElementById('changeEraseBtn').classList.add('hidden-element');
    disableProfileBtn();


    const mainDiv = document.createElement('div');
    mainDiv.id = 'modifyForm';
    mainDiv.classList = 'col-sm-6 mx-auto shadow p-4 mt-3 rounded-4 ';

    const textLine1 = document.createElement('p');
    textLine1.classList = 'text-danger text-center fw-bold mb-0 bagelFatOne';
    textLine1.textContent = 'Your account will be erased'
    mainDiv.appendChild(textLine1);

    const textLine2 = document.createElement('p');
    textLine2.classList = 'text-danger text-center fw-bold bagelFatOne';
    textLine2.textContent = '! This action is irreversible !'
    mainDiv.appendChild(textLine2);

    const formDiv = document.createElement('form');
    formDiv.id = 'eraseAccount-form';
    formDiv.method = 'delete';
    mainDiv.appendChild(formDiv);


    const rowDiv = document.createElement('div');
    rowDiv.classList = 'row mt-2';


    const col1Div = document.createElement('div');
    col1Div.classList = 'col-6';

    const applyBtn = document.createElement('button');
    applyBtn.id = 'applyBtn';
    applyBtn.classList = 'btn btn-sm btn-outline-danger py-2 fw-bold w-100 shadow-lg bagelFatOne';
    applyBtn.type = 'submit';
    applyBtn.textContent = 'ERASE';
    col1Div.appendChild(applyBtn);
    rowDiv.appendChild(col1Div);

    const col2Div = document.createElement('div');
    col2Div.classList = 'col-6';

    const cancelBtn = document.createElement('button');
    cancelBtn.id = 'cancelBtn';
    cancelBtn.classList = 'btn btn-sm btn-success py-2 fw-bold w-100 shadow-lg bagelFatOne';
    cancelBtn.type = 'submit';
    cancelBtn.textContent = 'Cancel';
    col2Div.appendChild(cancelBtn);
    rowDiv.appendChild(col2Div);

    formDiv.appendChild(rowDiv);
    document.getElementById('changeEraseDiv').appendChild(mainDiv);
    eraseAccount_API();
    document.getElementById('cancelBtn').addEventListener('click', function () {
        document.getElementById('modifyForm').remove();
        document.getElementById('changeEraseBtn').classList.remove('hidden-element');
        enableProfileBtn();

    });
}

function disableProfileBtn() {
    document.querySelectorAll('#profile button').forEach(function (element) {

        element.classList.add('icon-disabled');
    });
    document.querySelectorAll('#profile i').forEach(function (element) {

        element.classList.add('icon-disabled');
    });

}

function enableProfileBtn() {
    document.querySelectorAll('#profile button').forEach(function (element) {

        element.classList.remove('icon-disabled');
    });
    document.querySelectorAll('#profile i').forEach(function (element) {

        element.classList.remove('icon-disabled');
    });
}




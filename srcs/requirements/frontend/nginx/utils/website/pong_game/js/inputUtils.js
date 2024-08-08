function checkDblName(input) {
    // console.log(input.value);
    for(let i = 0; i < tournamentPlayers.length; i++) {
        if (tournamentPlayers[i].name === input.value) {
            tournamentPlayers = [];
            alert_message('Two players cannot have the same name !');
            return true;
        }
    }
    return false;
}

function emptyInput(input) {
    if(input.value === "") {
        alert_message('Player(s) missing');
        return true;
    }
    return false;
}

function shorteredName(input) {
    if(input.value.length > 10) {
        const shotered = input.value.substring(0, 10) + '.';
        return shotered;
    }
    return input.value;
}

function alert_message(message) {

    const playBtn = document.getElementById('playBtn');
    playBtn.classList.add("hidden-element");

    let div = document.createElement('div');
    div.classList = 'w-75 alert alert-danger alert-dismissible  fade show text-center text-danger shadow ';
    div.role = 'alert';
    div.id = 'alert';
    div.textContent = message;

    let button = document.createElement('button');
    button.classList = 'btn-close';
    button.id = 'alertButton';
    button.setAttribute('data-bs-dismiss', 'alert');
    button.setAttribute('aria-label', 'Close');
    div.appendChild(button);


    let targetDiv = document.getElementById('divBtn');
    targetDiv.appendChild(div);

    const alertButton = document.getElementById('alertButton');
    alertButton.addEventListener("click", function() {
        let alert = document.getElementById('alert')
        alert.remove();
        playBtn.classList.remove("hidden-element");
    });
}

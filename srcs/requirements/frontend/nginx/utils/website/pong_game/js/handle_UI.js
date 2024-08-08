join = false;

const btn = {
    easyBtn: document.getElementById("easyBtn"),
    mediumBtn: document.getElementById("mediumBtn"),
    hardBtn: document.getElementById("hardBtn"),

    localBtn: document.getElementById("localBtn"),
    onLineBtn: document.getElementById("onLineBtn"),

    createBtn: document.getElementById("createBtn"),
    joinBtn: document.getElementById("joinBtn"),

    onePlayerBtn: document.getElementById("onePlayerBtn"),
    twoPlayersBtn: document.getElementById("twoPlayersBtn"),
    tournamentBtn: document.getElementById("tournamentBtn"),

    createRoomBtn: document.getElementById("createRoomBtn"),
};

//************************************************************************************

btn.createBtn.addEventListener("click", function() {

    btn.createBtn.classList.add("disabled");
    btn.createBtn.classList.remove("btn-outline-info");
    btn.createBtn.classList.add("btn-info");
    btn.joinBtn.classList.add("disabled");

    document.getElementById('createRoomMenu').classList.remove('hidden-element');
    document.getElementById('dificultyMenu').classList.remove('hidden-element');

    // // btn.createRoomBtn.addEventListener("click", createRoomButtonClickHandler);
    // const createRoomBtn = document.getElementById("createRoomBtn");
    // createRoomBtn.addEventListener('click', () => {

    //     create_room();
    // });

    // createRoomBtn.removeEventListener("click", () => {});


});

btn.joinBtn.addEventListener("click", function() {

    join = true;

    btn.joinBtn.classList.add("disabled");
    btn.joinBtn.classList.remove("btn-outline-info");
    btn.joinBtn.classList.add("btn-info");
    btn.createBtn.classList.add("disabled");
    document.getElementById('gameModeMenu').classList.remove('hidden-element');
    btn.onePlayerBtn.classList.add("hidden-element");
    btn.twoPlayersBtn.classList.remove("disabled");
    btn.tournamentBtn.classList.remove("disabled");

    // showSection('sessions');
    // reset_UI();
});


//************************************************************************************

btn.localBtn.addEventListener("click", function() {

    btn.localBtn.classList.add("disabled");
    btn.localBtn.classList.remove("btn-outline-info");
    btn.localBtn.classList.add("btn-info");
    btn.onLineBtn.classList.add("disabled");
    btn.onePlayerBtn.classList.remove("hidden-element");

    document.getElementById('dificultyMenu').classList.remove('hidden-element');
    document.getElementById('gameModeMenu').classList.remove('hidden-element');

    playLocal = true;
    playOnline = false;
    playTournament = false;
});
btn.onLineBtn.addEventListener("click", function() {

    if (connected) {

        btn.localBtn.classList.add("disabled");
        btn.onLineBtn.classList.add("disabled");
        btn.onLineBtn.classList.remove("btn-outline-info");
        btn.onLineBtn.classList.add("btn-info");
        btn.createRoomBtn.classList.add("hidden-element");

        document.getElementById('onlineMenu').classList.remove('hidden-element');
        // document.getElementById('chat-container_session').classList.remove('hidden-element');
        playLocal = false;
        playOnline = true;


        join = false;
        playTournament = false;

    } else {

        navbarSwitch('off');
        document.getElementById('containerGameMenu').querySelectorAll('button').forEach((element) => {
            element.disabled = true;
        });

        const div = document.createElement('div');
        div.classList = 'w-75 mx-auto alert alert-danger alert-dismissible fade show text-center text-danger shadow ';
        div.style.maxWidth= '350px';
        div.role = 'alert';
        div.id = 'alert';
        div.textContent = 'You must be logged to play online !';

        const button = document.createElement('button');
        button.classList = 'btn-close';
        button.id = 'alertBtn';
        button.setAttribute('data-bs-dismiss', 'alert');
        button.setAttribute('aria-label', 'Close');
        div.appendChild(button);

        document.getElementById('containerGameMenu').appendChild(div);

        button.addEventListener("click", function() {
            div.remove();
            navbarSwitch('on');
            document.getElementById('containerGameMenu').querySelectorAll('button').forEach((element) => {
                element.disabled = false;
            });
        });
    }
});

//************************************************************************************

btn.easyBtn.addEventListener("click", function() {
    btn.easyBtn.classList.add("disabled");
    btn.easyBtn.classList.remove("btn-outline-info");
    btn.easyBtn.classList.add("btn-info");
    btn.mediumBtn.classList.add("disabled");
    btn.hardBtn.classList.add("disabled");

    if (playLocal) {
        btn.onePlayerBtn.classList.remove("disabled");
        btn.onePlayerBtn.classList.remove("hidden-element");
        btn.twoPlayersBtn.classList.remove("disabled");
        btn.tournamentBtn.classList.remove("disabled");
    }
    if (playOnline) {
        document.getElementById('gameModeMenu').classList.remove('hidden-element');
        btn.onePlayerBtn.classList.add("hidden-element");
        btn.twoPlayersBtn.classList.remove("disabled");
        btn.tournamentBtn.classList.remove("disabled");
        // btn.createRoomBtn.classList.remove('disabled');
    }
    // btn.onLineBtn.classList.remove("disabled");
    // btn.localBtn.classList.remove("disabled");

    level = 3;
    paddleHeight = 110;
});

btn.mediumBtn.addEventListener("click", function() {

    btn.easyBtn.classList.add("disabled");
    btn.mediumBtn.classList.add("disabled");
    btn.mediumBtn.classList.remove("btn-outline-info");
    btn.mediumBtn.classList.add("btn-info");
    btn.hardBtn.classList.add("disabled");

    if (playLocal) {
        btn.onePlayerBtn.classList.remove("disabled");
        btn.twoPlayersBtn.classList.remove("disabled");
        btn.tournamentBtn.classList.remove("disabled");
    }
    if (playOnline) {
        document.getElementById('gameModeMenu').classList.remove('hidden-element');
        btn.onePlayerBtn.classList.add("hidden-element");
        btn.twoPlayersBtn.classList.remove("disabled");
        btn.tournamentBtn.classList.remove("disabled");
        // btn.createRoomBtn.classList.remove('disabled');
    }
    // btn.onLineBtn.classList.remove("disabled");
    // btn.localBtn.classList.remove("disabled");

    level = 5;
    paddleHeight = 80;
});

btn.hardBtn.addEventListener("click", function() {

    btn.easyBtn.classList.add("disabled");
    btn.mediumBtn.classList.add("disabled");
    btn.hardBtn.classList.add("disabled");
    btn.hardBtn.classList.remove("btn-outline-info");
    btn.hardBtn.classList.add("btn-info");

    if (playLocal) {
        btn.onePlayerBtn.classList.remove("disabled");
        btn.twoPlayersBtn.classList.remove("disabled");
        btn.tournamentBtn.classList.remove("disabled");
    }
    if (playOnline) {
        document.getElementById('gameModeMenu').classList.remove('hidden-element');
        btn.onePlayerBtn.classList.add("hidden-element");
        btn.twoPlayersBtn.classList.remove("disabled");
        btn.tournamentBtn.classList.remove("disabled");
        // btn.createRoomBtn.classList.remove('disabled');
    }
    // btn.onLineBtn.classList.remove("disabled");
    // btn.localBtn.classList.remove("disabled");

    level = 7;
    paddleHeight = 60;
});



//************************************************************************************

btn.onePlayerBtn.addEventListener("click", function() {

    btn.onePlayerBtn.classList.add("disabled");
    btn.onePlayerBtn.classList.remove("btn-outline-info");
    btn.onePlayerBtn.classList.add("btn-info");
    btn.twoPlayersBtn.classList.add("disabled");
    btn.tournamentBtn.classList.add("disabled");

    onePlayer = true;
    create_OnePlayer_input();
});

btn.twoPlayersBtn.addEventListener("click", function() {

    btn.onePlayerBtn.classList.add("disabled");
    btn.twoPlayersBtn.classList.add("disabled");
    btn.twoPlayersBtn.classList.remove("btn-outline-info");
    btn.twoPlayersBtn.classList.add("btn-info");
    btn.tournamentBtn.classList.add("disabled");

    twoPlayers = true;

    if (playLocal) {
        create_TwoPlayers_input();
    }
    if (playOnline) {
        btn.createRoomBtn.classList.remove("hidden-element");
        btn.createRoomBtn.classList.remove('disabled');
        if (join === true)
            showSection('sessions');
    }
    // if(playOnline) {

    //     const message = JSON.stringify({
    //         messageType: 'createSession',
    //         level: level,
    //         // paddleHeight: paddleHeight,

    //         // id: 123,
    //         // username: sessionUsername,
    //     });
    //     console.log("session user create ", sessionUsername);
        // socket.send(message);

    // }
});

btn.tournamentBtn.addEventListener("click", function() {

    if (join === true)
    {
        showSection('tournament');
        return;
    }
    btn.onePlayerBtn.classList.add("disabled");
    btn.twoPlayersBtn.classList.add("disabled");
    btn.tournamentBtn.classList.add("disabled");
    btn.tournamentBtn.classList.remove("btn-outline-info");
    btn.tournamentBtn.classList.add("btn-info");
    tournament = true;
    if (playOnline) {
        tournamentSize = 4;
        create_tournament_room();
    }
    else {
        create_Tournament_mode();
    }
});

btn.createRoomBtn.addEventListener("click", function() {

    create_room();

});




function initPlayBtn() {
    const playBtn = document.getElementById("playBtn");
    playBtn.addEventListener("click", function() {


        if(onePlayer) {

            const playerName = document.getElementById("name");
            if(playerName.value === "") {
                alert_message('Player name missing !');
                return;
            }
            leftPlayerName = playerName.value;
            rightPlayerName = "cpu";
        }

        else if(twoPlayers) {
            const playerName_1 = document.getElementById("playerName_1");
            const playerName_2 = document.getElementById("playerName_2");

            if(emptyInput(playerName_1) || emptyInput(playerName_2)) {
                return;
            }
            if(playerName_1.value === playerName_2.value) {
                alert_message('Two players cannot have the same name !');
                return;
            }
            leftPlayerName = playerName_1.value;
            rightPlayerName = playerName_2.value;

        }

        else if(tournament) {
            // console.log('tournament condition');
            for(let i = 0; i < tournamentSize; i++) {

                const playerNameInput = document.getElementById("playerName" + (i+1));

                if(emptyInput(playerNameInput)) {
                    return;
                }
                if(checkDblName(playerNameInput)) {
                    return;
                }
                const playerName = shorteredName(playerNameInput);
                tournamentPlayers.push({...playerObj, name: playerName});
            }
            matchMakingLogs();
            hideCurrentSection();
            showSection('playPong');
            create_MatchMaking_menu();
            reset_UI();
            removeInput();
            return;
        }
        start = true;
        // Set Players Names
        setPlayerNameToPrint(leftPlayerName, rightPlayerName);
        setHandToStart();
        printConsoleInfos();
        hideCurrentSection();
        showSection('playPong');
        document.getElementById('gameDiv').classList.remove('hidden-element');
        reset_UI();
        removeInput();
        navbarSwitch('off');
        if (onePlayer) {
            iaRun();
        }
        else
            localRun();

    });
}

function reset_UI() {

    for (let key in btn) {
        if (['localBtn', 'onLineBtn', 'easyBtn', 'mediumBtn', 'hardBtn', 'createBtn', 'joinBtn'].includes(key)) {
            // Pour les cas spécifiques
            if (btn[key].classList.contains('disabled')) {
                btn[key].classList.remove('disabled');
            }
        } else {
            // Pour le cas par défaut
            if (!btn[key].classList.contains('disabled')) {
                btn[key].classList.add('disabled');
            }
        }
        // Commun à tous les cas
        if (btn[key].classList.contains('btn-info')) {
            btn[key].classList.remove('btn-info');
            btn[key].classList.add('btn-outline-info');
        }
    }
    document.getElementById('dificultyMenu').classList.add('hidden-element');
    document.getElementById('gameModeMenu').classList.add('hidden-element');
    document.getElementById('onlineMenu').classList.add('hidden-element');
    // document.getElementById('chat-container_session').classList.add('hidden-element');

}

function removeInput() {
    const deleteInput = document.getElementById('input-div');
    if(deleteInput)
        deleteInput.remove();
    const deleteTournamentBtn = document.getElementById('tournamentModeBtn');
    if(deleteTournamentBtn)
        deleteTournamentBtn.remove();

}

// close btn
const closeBtnUI = document.getElementById('clBtnUI');
closeBtnUI.addEventListener('click', function() {
    reset_UI();
    removeInput();
    resetGameValues();
    showSection('main');
});

// close reset
const resetBtnUI = document.getElementById('resetBtnUI');
resetBtnUI.addEventListener('click', function() {
    reset_UI();
    removeInput();
    resetGameValues();
});

const quitButton = document.getElementById("quitGameBtn");
quitGameBtn.addEventListener("click", function() {

    if (playLocal) {
        resetGameValues();
        navbarSwitch('on');
        showSection('main');
    }
    if (playOnline) {

        if (leftPlayerScore !== 10 && rightPlayerScore !== 10) {

            document.getElementById('quitGameBtn-div').classList.add('hidden-element');

            const div = document.createElement('div');
            div.classList = 'col-12 p-3 bg-white rounded shadow';
            const h5 = document.createElement('h5');
            h5.classList = 'text-center text-danger';
            h5.textContent = 'If you leave the game, you declare forfeit !';
            div.appendChild(h5);

            const divBtns = document.createElement('div');
            divBtns.classList = 'col d-flex justify-content-center';

            const confirmBtn = document.createElement('button');
            confirmBtn.classList = 'btn btn-sm btn-outline-danger fw-bold mx-auto';
            confirmBtn.type = 'button';
            confirmBtn.textContent = 'Confirm';
            divBtns.appendChild(confirmBtn);
            const cancelBtn = document.createElement('button');
            cancelBtn.classList = 'btn btn-sm btn-outline-success fw-bold mx-auto';
            cancelBtn.type = 'button';
            cancelBtn.textContent = 'Cancel';
            divBtns.appendChild(cancelBtn);

            div.appendChild(divBtns);

            document.getElementById('pong-ui').appendChild(div);

            confirmBtn.addEventListener('click', function() {
                if (playTournament)
                {
                    const message = JSON.stringify({ messageType: 'surrenderTournamentSession' });
                    socket.send(message);
                }
                else
                {
                    const message = JSON.stringify({ messageType: 'surrenderSession' });
                    socket.send(message);
                }
                start = false;
                div.remove();
                document.getElementById('quitGameBtn-div').classList.remove('hidden-element');
                // resetGameValues();
                // navbarSwitch('on');
                // showSection('main');
                // location.reload();
                window.location.href = domainPath;
            });
            cancelBtn.addEventListener('click', function() {
                div.remove();
                document.getElementById('quitGameBtn-div').classList.remove('hidden-element');
            });
        } else {
            // resetGameValues();
            // navbarSwitch('on');
            // showSection('main');
            // location.reload();
            window.location.href = domainPath;
        }
    }
});
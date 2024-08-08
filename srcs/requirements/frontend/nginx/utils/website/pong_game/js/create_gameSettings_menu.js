
function create_OnePlayer_input() {

    // Input part --------------------------------------------------------------
    const mainDiv = document.createElement('div');
    mainDiv.id = 'input-div';

    let hr = document.createElement('hr');
    hr.classList = 'text-info mt-4';
    mainDiv.appendChild(hr);

    let div = document.createElement('div');
    div.className = 'col d-flex justify-content-center mt-5';

    // Creation de l'input
    let input = document.createElement('input');
    input.className = 'form-control border-info w-50';
    input.type = 'text';
    input.id = 'name';
    input.placeholder="Name"

    div.appendChild(input);
    mainDiv.appendChild(div);

    // Creation du bouton
    let playBtn = document.createElement('button');
    playBtn.type = 'button';
    playBtn.className = 'btn btn-outline-success w-25 mb-3 mt-3 p-2 bagelFatOne';
    playBtn.id = 'playBtn';
    playBtn.textContent = 'Play';

    div = document.createElement('div');
    div.className = 'col d-flex justify-content-center mt-2';
    div.id = 'divBtn';

    div.appendChild(playBtn);
    mainDiv.appendChild(div);

    // Récupération de la section par son ID
    let mySection = document.getElementById('containerGameMenu');
    // Ajout de l'élément div principal à la section spécifiée
    mySection.appendChild(mainDiv);
    initPlayBtn();

}

function create_TwoPlayers_input() {

    // Input part --------------------------------------------------------------
    const mainDiv = document.createElement('div');
    mainDiv.id = 'input-div';

    let hr = document.createElement('hr');
    hr.classList = 'text-info mt-4';
    mainDiv.appendChild(hr);

    let div = document.createElement('div');
    div.className = 'col d-flex justify-content-center mt-5';

    // Creation de l'input 1
    let input1 = document.createElement('input');
    input1.className = 'form-control border-info w-50 me-2';
    input1.type = 'text';
    input1.id = 'playerName_1';
    input1.placeholder="Player 1"
    div.appendChild(input1);
    mainDiv.appendChild(div);

    // Creation de l'input 2
    let input2 = document.createElement('input');
    input2.className = 'form-control border-info w-50';
    input2.type = 'text';
    input2.id = 'playerName_2';
    input2.placeholder="Player 2"
    div.appendChild(input2);
    mainDiv.appendChild(div);


    // Creation du bouton
    div = document.createElement('div');
    div.className = 'col d-flex justify-content-center mt-2';
    div.id = 'divBtn';
    let playBtn = document.createElement('button');
    playBtn.type = 'button';
    playBtn.className = 'btn btn-outline-success w-25 mb-3 mt-3 p-2 bagelFatOne';
    playBtn.id = 'playBtn';
    playBtn.textContent = 'Play';

    div.appendChild(playBtn);
    mainDiv.appendChild(div);

    // Récupération de la section par son ID
    let mySection = document.getElementById('containerGameMenu');
    // Ajout de l'élément div principal à la section spécifiée
    mySection.appendChild(mainDiv);
    initPlayBtn();
}


function create_Tournament_mode() {

    const div = document.createElement('div');
    div.classList = 'col d-flex justify-content-center m-2';
    div.id = 'tournamentModeBtn';

    // Création des boutons
    let fourPlayersBtn = document.createElement('button');
    fourPlayersBtn.type = 'button';
    fourPlayersBtn.className = 'btn btn-outline-info mx-1 bagelFatOne';
    fourPlayersBtn.id = 'fourPlayersBtn';
    fourPlayersBtn.textContent = '4 Players';

    let heightPlayersBtn = document.createElement('button');
    heightPlayersBtn.type = 'button';
    heightPlayersBtn.className = 'btn btn-outline-info mx-1 bagelFatOne';
    heightPlayersBtn.id = 'heightPlayersBtn';
    heightPlayersBtn.textContent = '8 Players';

    let sixteenPlayersBtn = document.createElement('button');
    sixteenPlayersBtn.type = 'button';
    sixteenPlayersBtn.className = 'btn btn-outline-info mx-1 bagelFatOne';
    sixteenPlayersBtn.id = 'sixteenPlayersBtn';
    sixteenPlayersBtn.textContent = '16 Players';

    // Ajout des boutons à l'élément div des boutons
    div.appendChild(fourPlayersBtn);
    div.appendChild(heightPlayersBtn);
    div.appendChild(sixteenPlayersBtn);

    // Récupération de la section par son ID
    let mySection = document.getElementById('containerGameMenu');

    // Ajout de l'élément div principal à la section spécifiée
    mySection.appendChild(div);
    // init_Tournament_buttons();
    init_Tournament_mode_buttons();
}

function init_Tournament_mode_buttons() {

    const fourPlayersBtn = document.getElementById('fourPlayersBtn');
    const heightPlayersBtn = document.getElementById('heightPlayersBtn');
    const sixteenPlayersBtn = document.getElementById('sixteenPlayersBtn');

    fourPlayersBtn.addEventListener('click', function() {

        fourPlayersBtn.classList.add('disabled');
        fourPlayersBtn.classList.remove('btn-outline-info');
        fourPlayersBtn.classList.add('btn-info');
        heightPlayersBtn.classList.add('disabled');
        sixteenPlayersBtn.classList.add('disabled');

        tournamentSize = 4;
        create_Tournament_inputs();
    });

    heightPlayersBtn.addEventListener('click', function() {

        fourPlayersBtn.classList.add('disabled');
        heightPlayersBtn.classList.add('disabled');
        heightPlayersBtn.classList.remove('btn-outline-info');
        heightPlayersBtn.classList.add('btn-info');
        sixteenPlayersBtn.classList.add('disabled');

        tournamentSize = 8;
        if (playLocal)
            create_Tournament_inputs();
        if (playOnline)
            create_tournament_room();
    });

    sixteenPlayersBtn.addEventListener('click', function() {

        fourPlayersBtn.classList.add('disabled');
        heightPlayersBtn.classList.add('disabled');
        sixteenPlayersBtn.classList.add('disabled');
        sixteenPlayersBtn.classList.remove('btn-outline-info');
        sixteenPlayersBtn.classList.add('btn-info');

        tournamentSize = 16;
        if (playLocal)
            create_Tournament_inputs();
        if (playOnline)
            create_tournament_room();
    });
}

function create_Tournament_inputs() {

    const div = document.createElement('div');
    div.id = 'input-div';
    const hr = document.createElement('hr');
    hr.classList = 'text-info my-4';
    div.appendChild(hr);

    let playerNb = 0;
    for (let i = 0; i < (tournamentSize / 2); i++) {
        const inputDiv = document.createElement('div');
        inputDiv.classList = 'col d-flex justify-content-center m-2';
        for (let j = 0; j < 2; j++) {

            playerNb++;
            const input = document.createElement('input');
            input.classList = 'form-control border-info m-1';
            input.type = 'text';
            input.name = 'playerName' + playerNb;
            input.id = 'playerName' + playerNb;
            input.placeholder = 'Player ' + playerNb;
            inputDiv.appendChild(input);
        }
        div.appendChild(inputDiv);
    }
    // Creation du bouton
    const divBtn = document.createElement('div');
    divBtn.className = 'col d-flex justify-content-center mt-2';
    divBtn.id = 'divBtn';
    let playBtn = document.createElement('button');
    playBtn.type = 'button';
    playBtn.className = 'btn btn-outline-success w-25 mb-3 mt-3 p-2 bagelFatOne';
    playBtn.id = 'playBtn';
    playBtn.textContent = 'Play';

    divBtn.appendChild(playBtn);
    div.appendChild(divBtn);
    const targetContainer = document.getElementById('containerGameMenu');
    targetContainer.appendChild(div);

    initPlayBtn();
}


// function updateSessionsList(sessions, peer) {
//     // const sessionsListElement = document.getElementById('sessionsList');
//     // sessionsListElement.innerHTML = '';

//     let index = 1;
//     sessions.forEach(session => {
//         sessions_createContent(session, index, peer);
//         index++;
//         // const sessionLink = document.createElement('a');
//         // // sessionLink.href = `https://transcendence42.ddns.net/#playPong`;
//         // sessionLink.href = '#playPong';
//         // sessionLink.textContent = `Session ID: ${session.id}, Created At: ${session.createdAt}, By : ${session.CreatorUsername}`;
//         // sessionLink.addEventListener('click', () => {

//         //     socket.send(JSON.stringify({ action: 'join', sessionId: session.id, username:session }));

//         //     leftPlayerName ="test";
//         //     rightPlayerName="test1";

//         //     level = 5;
//         //     playOnline = true;
//         //     twoPlayers = true;
//         //     start = true;

//         //     setPlayerNameToPrint(leftPlayerName, rightPlayerName);
//         //     setHandToStart();
//         //     printConsoleInfos();

//         //     showSection("playPong");
//         //     document.getElementById('gameDiv').classList.remove('hidden-element');
//         //     run();

//         // });

//         // const sessionElement = document.createElement('p');
//         // sessionElement.appendChild(sessionLink);

//         // sessionsListElement.appendChild(sessionElement);
//     });

//     console.log('Updated sessions list:', sessions);
// }

document.addEventListener('DOMContentLoaded', function () {
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash;
        const match = hash.match(/^#playPong\/([a-zA-Z0-9-]+)$/);

        if (match) {
            const sessionId = match[1];
            // console.log('Joining session with ID:', sessionId);
        }
    });
});

// function  sessions_createContent(session, index) {

//     document.getElementById('sessionListeEmpty').classList.add('hidden-element');

//     const div = document.createElement('div');
//     div.id = 'joinCard' + index;
//     div.classList = 'col-auto m-2 p-3 rounded-4 shadow';

//     const title = document.createElement('h5');
//     title.classList = 'fs-3 fw-bold text-info text-center';
//     title.textContent = 'Room ' + index;
//     div.appendChild(title);

//     const creator = document.createElement('h5');
//     creator.classList = 'fs-5 fw-bold text-secondary text-center';
//     creator.textContent = 'Creator : ' + session.CreatorUsername;
//     div.appendChild(creator);

//     const level = document.createElement('h5');
//     level.classList = 'fs-5 fw-bold text-secondary text-center';
//     level.textContent = 'Level : ' + session.level;
//     div.appendChild(level);

//     const joinBtn = document.createElement('h5');
//     joinBtn.id = 'joinRoomBtn';
//     joinBtn.classList = 'fs-3 fw-bold text-success text-center';
//     joinBtn.textContent = 'Play !';
//     joinBtn.role = 'button';
//     div.appendChild(joinBtn);

//     document.getElementById('sessionsList').appendChild(div);

//     joinBtn.addEventListener('click', function() {
//         joinSession(session, index, peer);
//     })


// }


function create_room() {

    peer = new SimplePeer({initiator: true})
    peer.once('signal', (dataPeer) => {
        // console.log('PeerCreator signal:', dataPeer);
        socket.send(JSON.stringify({ messageType: 'createSession', level:level , peerId: dataPeer, paddleHeight: paddleHeight}));
    });

    socket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);
        if (data.messageType === 'confirmCreat') {
            if (data.confirme == "true"){

                document.getElementById('containerGameMenu').classList.add('hidden-element');

                navbarSwitch('off');
                reset_UI();

                const mainDiv = document.createElement('div');
                mainDiv.id = 'roomCreatedDiv';
                mainDiv.classList = 'col-auto p-3 mx-auto rounded-4 bg-white shadow mt-5 fade-in';
                mainDiv.style.maxWidth = '400px';

                const secDiv = document.createElement('div');
                secDiv.id = 'waitingDiv';

                const title = document.createElement('h5');
                title.classList = 'fs-3 fw-bold text-info text-center';
                title.textContent = 'Room created !';
                secDiv.appendChild(title);

                const text = document.createElement('h5');
                text.classList = 'fs-5 fw-bold text-secondary text-center';
                text.textContent = 'Please wait for someone to join the game';
                secDiv.appendChild(text);

                const spinnersDiv = document.createElement('div');
                spinnersDiv.classList = 'col mt-3 d-flex justify-content-center';
                for (let i = 0; i < 3; i++) {
                    const div = document.createElement('div');
                    div.role = 'status';
                    if (i === 1) {
                        div.classList = 'spinner-grow spinner-grow-sm text-info mx-2';
                    } else {
                        div.classList = 'spinner-grow spinner-grow-sm text-info';
                    }
                    spinnersDiv.appendChild(div);
                }
                secDiv.appendChild(spinnersDiv);

                const row = document.createElement('div');
                row.classList = 'row';
                const col = document.createElement('div');
                col.classList = 'col-auto mx-auto mt-3';
                const cancelBtn = document.createElement('h5');
                cancelBtn.id = 'cancelCreatedRoomBtn';
                cancelBtn.classList = 'rounded shadow p-2 text-warning text-center fs-5';
                cancelBtn.role = 'button';
                cancelBtn.textContent = 'Cancel';
                col.appendChild(cancelBtn);
                row.appendChild(col);
                secDiv.appendChild(row);
                mainDiv.appendChild(secDiv);

                document.getElementById('gameMenu').appendChild(mainDiv);

                cancelBtn.addEventListener('click', function() {

                    document.getElementById('roomCreatedDiv').remove();
                    document.getElementById('containerGameMenu').classList.remove('hidden-element');
                    document.getElementById('createRoomMenu').classList.add('hidden-element');
                    const message = JSON.stringify({ messageType: 'quitSession' });
                    socket.send(message);
                    // console.log('Quit session');
                    location.reload();
                })


            }
            else {
                //close le peer
                peer.close();
                // console.log("Tu es deja dans une room");
            }
        }

    });

}

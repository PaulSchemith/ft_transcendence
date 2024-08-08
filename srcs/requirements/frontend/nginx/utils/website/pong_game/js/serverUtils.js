let socket;
let chatInit = false;
let peer, peer2;
// let username;

function createPeer(sessionId)
{
    peer = new SimplePeer({initiator: true, trickle: false});
    peer.once('signal', (dataPeer) => {
        // console.log('Peer signal:', dataPeer);
        socket.send(JSON.stringify({ messageType: 'creatorPeer', sessionId: sessionId, peerCreator: dataPeer }));
    });

}

function waitForWebSocketConnection(username) {
    return new Promise((resolve, reject) => {
        if (!socket || socket.readyState !== WebSocket.OPEN)
                     socket = new WebSocket('wss://10.12.5.4:8002/ws/general/?user_username=' + username);

        // username = username;
        socket.addEventListener('open', () => {
            // console.log('Connected to WebSocket server');
            resolve(socket);
            socket.send(JSON.stringify({
                'messageType': 'online',
                'owner': username,
                'message' : "",
                'time' : new Date().toLocaleTimeString(),
            }));
            // chatGeneral_createContent(username, "is connected", new Date().toLocaleTimeString(), "online");
        });

        socket.addEventListener('error', (error) => {
            console.error('WebSocket error:', error);
            reject(error);
        });

        socket.addEventListener('close', (event) => {
            // console.log('WebSocket connection closed');
            reject(new Error('WebSocket connection closed'));
        });
    })
.then((socket) => {

    // console.log('WebSocket connection is ready');


    socket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);
        if (data.messageType === 'updateSessions') {
            // console.log('Updating sessions list...');
            // console.log(data.sessions);
            updateSessionsList(data.sessions);
        }
    });

    socket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);
        if (data.messageType === 'updateTournamentSessions') {
            // console.log('Updating tournament sessions list...');
            // console.log(data.tournamentSessions);
            updateTournamentSessionsList(data.tournamentSessions);
        }
    });

    // chat general
    socket.addEventListener('message', (event) => {
        const receivedMessage = JSON.parse(event.data);
        if(receivedMessage.messageType == "classic" || receivedMessage.messageType == "online" || receivedMessage.messageType == "offline" || receivedMessage.messageType == "tournament"){

            chatGeneral_createContent(receivedMessage.owner, receivedMessage.message, receivedMessage.time, receivedMessage.messageType);
            // });
            const messageContainer = document.getElementById('chat-area');
            messageContainer.scrollTop = messageContainer.scrollHeight;
        // }
            chatInit = true;
        }
    });


    socket.addEventListener('message', (event) => {
        const receivedMessage = JSON.parse(event.data);
        if (receivedMessage.messageType === 'messageSession') {
            chatSession_createContent(receivedMessage.owner, receivedMessage.message, receivedMessage.time, receivedMessage.messageType);
            // });
            const messageContainer = document.getElementById('chat-area');
            messageContainer.scrollTop = messageContainer.scrollHeight;
            // }
            chatInit = true;
        }
    });

    let surrender_variable = 0
    socket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);
        if (data.messageType === 'surrenderSession' && surrender_variable == 0) {
            // console.log('data received', data);
            surrender_variable = 1
            start = false;
            const message = JSON.stringify({ messageType: 'endGame', leftPlayerScore : leftPlayerScore, rightPlayerScore : rightPlayerScore , sessionUsername : sessionUsername, winner : sessionUsername});
            socket.send(message);

            if (leftPlayerName !== sessionUsername) {
                surrenderMessage_createContent(leftPlayerName)
            } else {
                surrenderMessage_createContent(rightPlayerName)
            }
            // console.log(leftPlayerName, rightPlayerName);

            function surrenderMessage_createContent(surrenderPlayerName) {

                document.getElementById('gameDiv').classList.add('hidden-element');
                const div = document.createElement('div');
                div.classList = 'container p-3 mt-5';
                const line_1 = document.createElement('h5');
                line_1.classList = 'display-3 fw-bold cl-green text-center';
                line_1.textContent = surrenderPlayerName + ' left the game';
                const line_2 = document.createElement('h5');
                line_2.classList = 'display-5 fw-bold cl-green text-center';
                line_2.textContent = 'You won by forfeit !';
                div.appendChild(line_1);
                div.appendChild(line_2);
                document.getElementById('playPong').appendChild(div);

            }
            setTimeout(function() {
                // div.remove();
                window.location.href = domainPath;

            }, 3000);
        }
    });

    socket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);
        if (data.messageType === 'inviteSession') {

            // console.log('data.session = ', data.session);
            invitedToPlay_createContent(data.session);
        }

    });


    // start game for creator
    socket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);
        if (data.messageType === 'receivePlayerPeer') {
            // console.log('data received', data.playerPeer);
            peer.signal(data.playerPeer);
            peer.on('signal', (data) => {
                // console.log('Signal sent:', data);
                // Vous pouvez mettre ici le code pour gérer le signal envoyé avec succès
            });

            peer.on('error', (error) => {
                console.error('Error in peer connection:', error);
                // Vous pouvez mettre ici le code pour gérer les erreurs survenues lors de la connexion
            });

            peer.on('close', () => {
                // console.log('Peer connection closed');
                // Vous pouvez mettre ici le code pour gérer la fermeture de la connexion
            });
            peer.on('connect', () => {
                // console.log("connecté au peerID : ", data.playerPeer);
                // console.log(data.player, "a rejoind la session", data.level);
                leftPlayerName = sessionUsername;
                rightPlayerName = data.player;

                if(start){
                    return
                }
                start = true;
                playOnline = true;
                setPlayerNameToPrint(leftPlayerName, rightPlayerName);
                // setHandToStart();
                leftPaddleHand = true;

                // printConsoleInfos();

                showSection("playPong");
                document.getElementById('gameDiv').classList.remove('hidden-element');
                // createPeer(data.sessionId)
                peer.on('data', (data) => {
                    // Convertir les données en objet JavaScript si nécessaire
                    const gameData = JSON.parse(data);
                    // console.log('Nouvelles données de jeu reçues :', gameData);
                    // Traiter les nouvelles données de jeu
                    rightPaddleY = gameData.rightPaddleY;
                    // processGameData(gameData);
                    spaceBarPressed = gameData.spaceBarPressed;
                    spaceRight = gameData.spaceRight;

                });
                onlineRun(peer);
                // console.log("peer = ", peer);

                showSection('playPong');
                if (data.session.isPrivate === "true") {
                    // mainDiv.remove();
                    document.getElementById('inviteToPlayDiv').remove();
                    document.getElementById('chat-messages-general').classList.remove('unvisible');
                    document.getElementById('mainChat-form').classList.remove('unvisible');
                    const mainChat = document.getElementById('mainChat');
                    mainChat.classList.add('unvisible');
                }
            });

        }
    });

    socket.addEventListener('message', (event) => {
        let data = JSON.parse(event.data);
        if (data.messageType === 'newPeerTurn') {
            // data.tournamentData.players = data.tournamentData.players;
            showSection('playPong');
            // console.log('newPeerTurn', data);
            ManageOnlineTournament(data.tournamentData);
        }
    });

    socket.addEventListener('message', (event) => {
        let data = JSON.parse(event.data);
        if (data.messageType === 'waitingTournament') {
            document.getElementById('containerGameMenu').classList.add('hidden-element');

            navbarSwitch('off');
            reset_UI();
            waiting_tournament(data.tournamentData);
        }
    });


})
.catch((error) => {
    console.error('Une erreur s\'est produite lors de la connexion WebSocket:', error);
});
}

function sendMessageSession() {
    const messageInput = document.getElementById('message-input_session');
    const message = messageInput.value.trim();

    if (message !== '') {
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ messageType: 'sendMessageSession', message: message, sessionUsername: sessionUsername, 'time' : new Date().toLocaleTimeString()}));
            messageInput.value = '';
        } else {
            console.warn('La connexion WebSocket n\'est pas encore établie.');
        }
    }
}




function updateSessionsList(sessions) {

    let index = 1;
    var sessions = JSON.parse(sessions);

    const to_remove = document.getElementById("sessionsList");
    const childCount = to_remove.childElementCount;

    if (childCount > 0){

        while(to_remove.firstChild){
            to_remove.removeChild(to_remove.firstChild)
        }
    }

    sessions.forEach(session => {
        // console.log("session.is_private", session.is_private);
        if (session.players.length == 1 && session.isPrivate == "false") {
            sessions_createContent(session, index);
            index++;
        }
    });

    // console.log('Updated sessions list:', sessions);
}



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

function  sessions_createContent(session, index) {

    document.getElementById('sessionListeEmpty').classList.add('hidden-element');

    const div = document.createElement('div');
    div.id = 'joinCard' + index;
    div.classList = 'col-auto m-2 p-3 rounded-4 shadow';

    const title = document.createElement('h5');
    title.classList = 'fs-3 fw-bold text-info text-center';
    title.textContent = 'Room ' + index;
    div.appendChild(title);

    const creator = document.createElement('h5');
    creator.classList = 'fs-5 fw-bold text-secondary text-center';
    creator.textContent = 'Creator : ' + session.CreatorUsername;
    div.appendChild(creator);

    const level = document.createElement('h5');
    level.classList = 'fs-5 fw-bold text-secondary text-center';
    level.textContent = 'Level : ' + session.level;
    div.appendChild(level);

    const joinBtn = document.createElement('h5');
    joinBtn.id = 'joinRoomBtn';
    joinBtn.classList = 'fs-3 fw-bold text-success text-center';
    joinBtn.textContent = 'Play !';
    joinBtn.role = 'button';
    div.appendChild(joinBtn);

    document.getElementById('sessionsList').appendChild(div);



    joinBtn.addEventListener('click', function() {
        // document.getElementById('joinCard' + index).remove();
        // console.log("session :", session);
        joinSession(session, index);
    })
}



//start game for joiner
function joinSession(session, index) {

    // console.log('session creator:', session.CreatorUsername);
    // console.log('session username:', sessionUsername);
    socket.send(JSON.stringify({ messageType: 'join', sessionId: session.sessionId}));

    socket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);
        if (data.messageType === 'confirmJoin')
            if (data.confirme == "true") {
                peer2 = new SimplePeer({ initiator: false });
                // console.log('Peer2 created:', peer2);
                peer2.signal(data.peerCreator[0]);

                peer2.on('signal', (dataPeer) => {
                    // console.log('Peer2 signal:', dataPeer);
                    // console.log('sessionID:', session.sessionId);
                    socket.send(JSON.stringify({ messageType: 'playerPeer', sessionId: session.sessionId, playerPeer: dataPeer }));
                });

                peer2.on('connect', () => {
                    // console.log('Connected to peer2');
                    leftPlayerName = session.CreatorUsername;
                    rightPlayerName= sessionUsername;
                    level = session.level;
                    paddleHeight = session.paddleHeight
                    playOnline = true;
                    twoPlayers = true;
                    start = true
                    setPlayerNameToPrint(leftPlayerName, rightPlayerName);
                    // printConsoleInfos();
                    showSection("playPong");
                    document.getElementById('gameDiv').classList.remove('hidden-element');
                    peer2.on('connect', () => {
                        // console.log("connecté au peerID : ", data.peerId);
                    });
                    peer2.on('data', (data) => {
                        // Convertir les données en objet JavaScript si nécessaire
                        const gameData = JSON.parse(data);
                        // console.log('Nouvelles données de jeu reçues :', gameData);
                        if (gameData.messageType === 'reset') {
                            rightPaddleY = gameData.rightPaddleY;
                            rightPaddleHand = gameData.rightPaddleHand;
                        }
                        else {
                        // Traiter les nouvelles données de jeu
                            processGameData(gameData);
                        }

                    });
                    // console.log("level :", level)
                    // console.log("paddleHeight :", paddleHeight)

                    navbarSwitch('off');
                    onlineRun(peer2);

                    document.getElementById('joinCard' + index).remove();
                    if (document.getElementById('sessionsList').childElementCount == 0 ) {
                        document.getElementById('sessionListeEmpty').classList.remove('hidden-element');
                    }
                }
                );
            }
    });
}
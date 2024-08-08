let mutedFriends = [];

function showMainChat() {

    const mainChat = document.getElementById('mainChat');
    if (mainChat.classList.contains('unvisible')) {
        mainChat.classList.remove('unvisible');
        document.getElementById('mainChatBtn').classList.add('text-secondary');
    } else {
        mainChat.classList.add('unvisible');
        document.getElementById('mainChatBtn').classList.remove('text-secondary');
    }
}

function chatGeneral_createContent(username, message, time, messageType) {

    if (mutedFriends.includes(username)) {return;}

    const mainDiv = document.createElement('div');
    const small = document.createElement('small');
    small.textContent = message;

    if (messageType !== 'classic') {

        const div = document.createElement('div');
        if (messageType === 'online') {
            if (username === sessionUsername) {
                small.textContent = 'You are connected';
            } else {
                small.textContent = username + ': is connected';
            }
            div.classList = ' fw-bold fst-italic text-success text-center fade-in mx-auto';
        }
        else if (messageType === 'offline'){
            small.textContent = username + ': is disconnected';
            div.classList = ' fw-bold fst-italic text-danger text-center fade-in mx-auto';
        }
        else if (messageType === 'tournament'){
            small.textContent = 'a tournament match is starting';
            div.classList = ' fw-bold fst-italic text-dark text-center fade-in mx-auto';
        }
        div.style.maxWidth = '210px';
        div.appendChild(small);
        mainDiv.appendChild(div);
        document.getElementById('chat-messages-general').appendChild(mainDiv);
        return;
    }

    if (username === sessionUsername) {
        const timeDiv = document.createElement('div');
        timeDiv.classList = 'row p-0';
        const timeText = document.createElement('p');
        timeText.classList = 'col-12 small fw-bold fst-italic text-warning text-end m-0';
        const small2 = document.createElement('small');
        small2.textContent = time;

        timeText.appendChild(small2);
        timeDiv.appendChild(timeText);
        mainDiv.appendChild(timeDiv);
        const div = document.createElement('div');
        div.classList = 'lh-1 fw-semibold p-2 text-white bg-info bg-opacity-75 rounded-bottom-4 rounded-start-4 ms-auto mb-2 text-break fade-in';
        div.style.maxWidth = '210px';

        div.appendChild(small);
        mainDiv.appendChild(div);
        document.getElementById('chat-messages-general').appendChild(mainDiv);

    } else {

        const usernameDiv = document.createElement('div');
        usernameDiv.classList = 'row';

        const usernameText = document.createElement('p');
        usernameText.classList = 'col-4 fw-semibold fst-italic text-info m-0';
        usernameText.id = username + '_btnProfileChat';

        const small1 = document.createElement('small');
        small1.textContent = username + ': ';
        small1.classList = 'col-auto';
        small1.role = 'button';
        usernameText.appendChild(small1);
        usernameDiv.appendChild(usernameText);

        const timeText = document.createElement('p');
        timeText.classList = 'col-4 small fw-bold fst-italic text-end text-warning m-0 p-0';
        const small2 = document.createElement('small');
        small2.textContent = time;
        timeText.appendChild(small2);
        usernameDiv.appendChild(timeText);


        mainDiv.appendChild(usernameDiv);

        const div = document.createElement('div');
        div.classList = 'lh-1 fw-semibold p-2 text-white bg-secondary bg-opacity-75 rounded-bottom-4 rounded-end-4 me-auto mb-2 text-break fade-in';
        div.style.maxWidth = '210px';

        div.appendChild(small);
        mainDiv.appendChild(div);
        document.getElementById('chat-messages-general').appendChild(mainDiv);

        usernameText.addEventListener('click', function() {
            chatProfile_createContent(username);
        })
    }
}

function chatSession_createContent(username, message, time, messageType) {

    const messageContainer = document.getElementById('chat-messages_session');

    messageContainer.innerHTML += `<div><strong>${username}:</strong> ${message}</div>`;

    messageContainer.scrollTop = messageContainer.scrollHeight;
}

function chatProfile_createContent(username) {

    const input = document.getElementById('message-input_general');
    input.disabled = true;
    fetchUserProfile(username)
    .then((data) => {

        const mainDiv = document.createElement('div');
        mainDiv.classList = 'row p-1 d-flex justify-content-center fade-in';

        const imgDiv = document.createElement('div');
        imgDiv.classList = 'col-auto';

        const img = document.createElement('img');
        getAvatar(username)
        .then(imageURL => {
          img.src = imageURL;
        })
        .catch(error => {
          console.error("Error : download avatar imgage 'chatProfile_createContent()' !", error);
        });
        img.alt = 'avatarImg';
        img.classList = 'rounded-2 shadow';
        img.style.maxHeight = '80px';
        imgDiv.appendChild(img);
        mainDiv.appendChild(imgDiv);

        const infoDiv1 = document.createElement('div');
        infoDiv1.classList = 'col-auto my-auto';

        const userName = document.createElement('h5');
        userName.classList = 'text-center text-info text-uppercase';
        userName.textContent = data.user.username;
        infoDiv1.appendChild(userName);

        const firstName = document.createElement('h5');
        firstName.classList = 'text-center text-secondary mb-0';
        firstName.textContent = data.user.first_name;
        infoDiv1.appendChild(firstName);

        const lastName = document.createElement('h5');
        lastName.classList = 'text-center text-secondary mb-0';
        lastName.textContent = data.user.last_name;
        infoDiv1.appendChild(lastName);

        mainDiv.appendChild(infoDiv1);

        const infoDiv2 = document.createElement('div');

        const hr1 = document.createElement('hr');
        hr1.classList = 'mb-1';
        infoDiv2.appendChild(hr1);

        const friends = document.createElement('h5');
        friends.classList = 'text-center text-primary mb-0';
        friends.textContent = 'Friends - ' + data.friend.length;
        infoDiv2.appendChild(friends);

        const played = document.createElement('h5');
        played.classList = 'text-center text-info mb-0';
        played.textContent = 'Played - ' + (data.win + data.lose);
        infoDiv2.appendChild(played);

        const victories = document.createElement('h5');
        victories.classList = 'text-center text-success mb-0';
        victories.textContent = 'Victories - ' + data.win;
        infoDiv2.appendChild(victories);

        const defeats = document.createElement('h5');
        defeats.classList = 'text-center text-danger mb-0';
        defeats.textContent = 'Defeats - ' + data.lose;
        infoDiv2.appendChild(defeats);

        const hr2 = document.createElement('hr');
        hr2.classList = 'mt-1 mb-2';
        infoDiv2.appendChild(hr2);

        mainDiv.appendChild(infoDiv2);

        const btnsRow = document.createElement('div');
        btnsRow.classList = 'row d-flex justify-content-between';

        const inviteIcon = document.createElement('i');
        inviteIcon.id = 'invite-icon'
        inviteIcon.classList = 'col-auto fas fa-table-tennis fa-2x text-info';
        inviteIcon.role = 'button';
        btnsRow.appendChild(inviteIcon);

        const btnsDiv = document.createElement('div');
        btnsDiv.classList = 'col-auto';

        const mute_icon = document.createElement('i');
        mute_icon.id = 'mute-icon';
        if (mutedFriends.includes(username)) {
            mute_icon.classList = 'fa-solid fa-comment-slash fa-2x text-success me-3';
        } else {
            mute_icon.classList = 'fa-solid fa-comment-slash fa-2x text-secondary text-opacity-50 me-3';
        }
        mute_icon.role = 'button';
        btnsDiv.appendChild(mute_icon);

        const unMute_icon = document.createElement('i');
        unMute_icon.id = 'unMute-icon';
        if (!mutedFriends.includes(username)) {
            unMute_icon.classList = 'fa-solid fa-comment fa-2x text-success me-3';
        } else {
            unMute_icon.classList = 'fa-solid fa-comment fa-2x text-secondary text-opacity-50 me-3';
        }
        unMute_icon.role = 'button';
        btnsDiv.appendChild(unMute_icon);
        btnsRow.appendChild(btnsDiv);

        mainDiv.appendChild(btnsRow);

        const closeBtn = document.createElement('h5');
        closeBtn.classList = 'col-auto text-info fst-italic text-center fs-6 mb-0 mt-2';
        closeBtn.textContent = 'Close';
        closeBtn.role = 'button';
        mainDiv.appendChild(closeBtn);

        document.getElementById('chatProfile').appendChild(mainDiv);

        document.getElementById('chat-messages-general').classList.add('unvisible');
        document.getElementById('chatProfile').classList.remove('unvisible');

        mute_icon.addEventListener('click', function() {

            if (mute_icon.classList.contains('text-secondary')) {

                mute_icon.classList.remove('text-secondary');
                mute_icon.classList.remove('text-opacity-50');
                mute_icon.classList.add('text-success');
                unMute_icon.classList.add('text-secondary');
                unMute_icon.classList.add('text-opacity-50');
                unMute_icon.classList.remove('text-success');

                mutedFriends.push(username);
            }
        })

        unMute_icon.addEventListener('click', function() {

            if (unMute_icon.classList.contains('text-secondary')) {

                unMute_icon.classList.remove('text-secondary');
                unMute_icon.classList.remove('text-opacity-50');
                unMute_icon.classList.add('text-success');
                mute_icon.classList.add('text-secondary');
                mute_icon.classList.add('text-opacity-50');
                mute_icon.classList.remove('text-success');

                mutedFriends.pop(username);
            }
        })

        inviteIcon.addEventListener('click', function() {

            mainDiv.remove();
            document.getElementById('chat-messages-general').classList.add('unvisible');
            document.getElementById('chatProfile').classList.add('unvisible');
            document.getElementById('mainChat-form').classList.add('unvisible');

            inviteFriendToPlayFromChat_createContent(username);
            input.disabled = false;

        })

        closeBtn.addEventListener('click', function() {

            document.getElementById('chat-messages-general').classList.remove('unvisible');
            document.getElementById('chatProfile').classList.add('unvisible');
            mainDiv.remove();
            const messageContainer = document.getElementById('chat-area');
            messageContainer.scrollTop = messageContainer.scrollHeight;
            input.disabled = false;
        })
    })
}

function inviteFriendToPlayFromChat_createContent(username) {

    const mainDiv = document.createElement('div');
    mainDiv.id = 'inviteToPlayDiv';
    mainDiv.classList = 'col-auto p-3 m-2 bg-white shadow-lg rounded-3 fade-in';
    // mainDiv.style.height = '300px';

    const secDiv = document.createElement('div');
    secDiv.id = 'waitingDiv';

    const title = document.createElement('h5');
    title.classList = 'fs-3 pt-1 fw-bold text-info text-capitalize text-center';
    title.textContent = 'Invite ' + username + ' to play';
    secDiv.appendChild(title);

    const text = document.createElement('h5');
    text.classList = 'fs-5 fw-bold text-secondary text-center mt-3';
    text.textContent = 'Choose dificulty';
    secDiv.appendChild(text);

    const dificultyRow = document.createElement('div');
    dificultyRow.classList = 'row d-flex justify-content-center g-2 mt-4';

    const easyDiv = document.createElement('div');
    easyDiv.classList = 'col-auto';
    const easyBtn = document.createElement('h5');
    easyBtn.classList = 'text-success p-2 shadow rounded-2';
    easyBtn.textContent = 'Easy';
    easyBtn.role = 'button';
    easyDiv.appendChild(easyBtn);
    dificultyRow.appendChild(easyDiv);

    const mediumDiv = document.createElement('div');
    mediumDiv.classList = 'col-auto';
    const mediumBtn = document.createElement('h5');
    mediumBtn.classList = 'text-warning p-2 shadow rounded-2';
    mediumBtn.textContent = 'Medium';
    mediumBtn.role = 'button';
    mediumDiv.appendChild(mediumBtn);
    dificultyRow.appendChild(mediumDiv);

    const hardDiv = document.createElement('div');
    hardDiv.classList = 'col-auto';
    const hardBtn = document.createElement('h5');
    hardBtn.classList = 'text-danger p-2 shadow rounded-2';
    hardBtn.textContent = 'Hard';
    hardBtn.role = 'button';
    hardDiv.appendChild(hardBtn);
    dificultyRow.appendChild(hardDiv);

    secDiv.appendChild(dificultyRow);

    const row = document.createElement('div');
    row.classList = 'row';
    const col = document.createElement('div');
    col.classList = 'col-auto mx-auto mt-4';
    const cancelBtn = document.createElement('h5');
    cancelBtn.id = 'cancelInviteToPlayBtn';
    cancelBtn.classList = 'rounded shadow p-2 text-secondary text-center';
    cancelBtn.role = 'button';
    cancelBtn.textContent = 'Cancel';
    col.appendChild(cancelBtn);
    row.appendChild(col);
    secDiv.appendChild(row);
    mainDiv.appendChild(secDiv);

    document.getElementById('chat-area').appendChild(mainDiv);

    cancelBtn.addEventListener('click', function() {
        mainDiv.remove();
        document.getElementById('chat-messages-general').classList.remove('unvisible');
        document.getElementById('mainChat-form').classList.remove('unvisible');
        const messageContainer = document.getElementById('chat-area');
        messageContainer.scrollTop = messageContainer.scrollHeight;
    })

    easyBtn.addEventListener('click', function() {
        mainDiv.remove();
        level = 3;
        paddleHeight = 110;
        inviteFriendCreateSession_createContent(username);
    })

    mediumBtn.addEventListener('click', function() {
        mainDiv.remove();
        level = 5;
        paddleHeight = 80;
        inviteFriendCreateSession_createContent(username);
    })

    hardBtn.addEventListener('click', function() {
        mainDiv.remove();
        level = 7;
        paddleHeight = 60;
        inviteFriendCreateSession_createContent(username);
    })
}

function inviteFriendCreateSession_createContent(username) {


    peer = new SimplePeer({initiator: true})
    peer.once('signal', (dataPeer) => {
        // console.log('PeerCreator signal:', dataPeer);
        socket.send(JSON.stringify({ messageType: 'inviteSession', level:level , peerId: dataPeer, paddleHeight: paddleHeight, usernameInvited: username}));
    });

    socket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);
        if (data.messageType === 'confirmInvite') {
            if (data.confirme == "true"){
                // if (document.getElementById('inviteToPlayDiv') == null)
                // return;
                // console.log("confirmInvite")
                const mainDiv = document.createElement('div');
                mainDiv.id = 'inviteToPlayDiv';
                mainDiv.classList = 'col-auto p-3 m-2 bg-white shadow-lg rounded-3 fade-in';
                // mainDiv.style.height = '300px';

                const secDiv = document.createElement('div');
                secDiv.id = 'waitingDiv';

                const title = document.createElement('h5');
                title.classList = 'fs-3 pt-5 fw-bold text-info text-center';
                title.textContent = 'Invitation sent !';
                secDiv.appendChild(title);

                const text = document.createElement('h5');
                text.classList = 'fs-5 fw-bold text-secondary text-center';
                text.textContent = 'Please wait for response';
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
                cancelBtn.id = 'cancelInviteToPlayBtn';
                cancelBtn.classList = 'rounded shadow p-2 text-warning text-center fs-5';
                cancelBtn.role = 'button';
                cancelBtn.textContent = 'Cancel';
                col.appendChild(cancelBtn);
                row.appendChild(col);
                secDiv.appendChild(row);
                mainDiv.appendChild(secDiv);
                // console.log('coucou');
                document.getElementById('chat-area').appendChild(mainDiv);

                cancelBtn.addEventListener('click', function() {
                    mainDiv.remove();
                    document.getElementById('chat-messages-general').classList.remove('unvisible');
                    document.getElementById('mainChat-form').classList.remove('unvisible');
                    const messageContainer = document.getElementById('chat-area');
                    messageContainer.scrollTop = messageContainer.scrollHeight;

                    let message = JSON.stringify({ messageType: 'quitSession' });
                    socket.send(message);

                    message = JSON.stringify({ messageType: 'cancelInvit' , usernameInvited: username});
                    socket.send(message);
                    peer.destroy();
                    location.reload();
                })
            } else {

                document.getElementById('chat-messages-general').classList.remove('unvisible');
                document.getElementById('mainChat-form').classList.remove('unvisible');
                // console.log("Tu es deja dans une room");
                peer.close;

            }
        }
    });

    socket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);
        if (data.messageType === 'denyInvit') {
            peer.destroy();
            document.getElementById('inviteToPlayDiv').remove();
            document.getElementById('chat-messages-general').classList.remove('unvisible');
            document.getElementById('mainChat-form').classList.remove('unvisible');
            const messageContainer = document.getElementById('chat-area');
            messageContainer.scrollTop = messageContainer.scrollHeight;
            location.reload();
            // const parentDiv = inviteToPlayDiv.parentNode; // Récupère le parent de mainDiv

            // Vérifie que le parent existe et que mainDiv est un enfant de ce parent
            // if (parentDiv.contains(inviteToPlayDiv)) {
                // parentDiv.removeChild(inviteToPlayDiv); // Supprime mainDiv du DOM
            // }
        }
    });
    // console.log('Create game : ' + sessionUsername + ' VS ' + username + ' level : ' + level);


    // const message = JSON.stringify({
    //     messageType: 'inviteSession',
    //     sessionUsername: sessionUsername,
    //     username: username,
    //     level: level
    // });

    // socket.send(message);

}

function invitedToPlay_createContent(session) {

    document.getElementById('chat-messages-general').classList.add('unvisible');
    // document.getElementById('chatProfile').classList.add('unvisible');
    document.getElementById('mainChat-form').classList.add('unvisible');

    const mainDiv = document.createElement('div');
    mainDiv.id = 'invitedToPlayDiv';
    mainDiv.classList = 'col-auto p-3 m-2 bg-white shadow-lg rounded-3 fade-in';

    const secDiv = document.createElement('div');
    secDiv.id = 'invitedWaitingDiv';

    const name = document.createElement('h5');
    name.classList = 'fs-3 pt-1 fw-bold text-info text-uppercase text-center';
    name.textContent = session.CreatorUsername;
    secDiv.appendChild(name);

    const text = document.createElement('h5');
    text.classList = 'fs-5 fw-bold text-secondary text-center mt-3';
    text.textContent = 'Invited You To Play !';
    secDiv.appendChild(text);

    const btnDiv = document.createElement('div');
    btnDiv.classList = 'row d-flex justify-content-center g-2 mt-4';

    const denyDiv = document.createElement('div');
    denyDiv.classList = 'col-auto';
    const denyBtn = document.createElement('h5');
    denyBtn.classList = 'text-warning p-2 shadow rounded-2';
    denyBtn.textContent = 'Deny';
    denyBtn.role = 'button';
    denyDiv.appendChild(denyBtn);
    btnDiv.appendChild(denyDiv);

    const acceptDiv = document.createElement('div');
    acceptDiv.classList = 'col-auto';
    const acceptBtn = document.createElement('h5');
    acceptBtn.classList = 'text-success p-2 shadow rounded-2';
    acceptBtn.textContent = 'Accept';
    acceptBtn.role = 'button';
    acceptDiv.appendChild(acceptBtn);
    btnDiv.appendChild(acceptDiv);

    secDiv.appendChild(btnDiv);

    mainDiv.appendChild(secDiv);

    document.getElementById('chat-area').appendChild(mainDiv);

    denyBtn.addEventListener('click', function() {
        mainDiv.remove();
        document.getElementById('chat-messages-general').classList.remove('unvisible');
        document.getElementById('mainChat-form').classList.remove('unvisible');
        // CLOSE LA ROOM ?
        socket.send(JSON.stringify({ messageType: 'denyInvit', session: session}));
    });

    acceptBtn.addEventListener('click', function() {
        // LANCER LA PARTIE ...
        // console.log('Accept invite to play');
        // console.log('sessionId :', session.sessionId);
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

                        mainDiv.remove();
                        document.getElementById('chat-messages-general').classList.remove('unvisible');
                        document.getElementById('mainChat-form').classList.remove('unvisible');
                        const mainChat = document.getElementById('mainChat');
                        mainChat.classList.add('unvisible');
                    }
                    );
                }
        });
    });

    socket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);
        if (data.messageType === 'cancelInvit') {
                mainDiv.remove();
                document.getElementById('chat-messages-general').classList.remove('unvisible');
                document.getElementById('mainChat-form').classList.remove('unvisible');
                const messageContainer = document.getElementById('chat-area');
                messageContainer.scrollTop = messageContainer.scrollHeight;
        }
    });
}

function updateTournamentSessionsList(tournamentSessions) {

    let indexSession = 1;
    var tournamentSessions = JSON.parse(tournamentSessions);

    const to_remove = document.getElementById("tournamentList");
    const childCount = to_remove.childElementCount;

    if (childCount > 0){

        while(to_remove.firstChild){
            to_remove.removeChild(to_remove.firstChild)
        }
    }

    tournamentSessions.forEach(tournamentSession => {
		if (tournamentSession.available === true) {
        tournamentSessions_createContent(tournamentSession, indexSession);
        indexSession++;
		}
    });

    // console.log('Updated tournament sessions list:', tournamentSessions);
}


function tournamentSessions_createContent(tournamentSession, indexSession) {
    document.getElementById('tournamentListeEmpty').classList.add('hidden-element');

    const div = document.createElement('div');
    div.id = 'joinCard' + indexSession;
    div.classList = 'col-auto m-2 p-3 rounded-4 shadow';

    const title = document.createElement('h5');
    title.classList = 'fs-3 fw-bold text-info text-center';
    title.textContent = 'Tournament ' + indexSession;
    div.appendChild(title);

    const tournament = document.createElement('h5');
    tournament.classList = 'fs-5 fw-bold text-secondary text-center';
    tournament.textContent = tournamentSession.players.length + ' / ' + tournamentSession.maxPlayers;
    div.appendChild(tournament);

    const creator = document.createElement('h5');
    creator.classList = 'fs-5 fw-bold text-secondary text-center';
    creator.textContent = 'Creator : ' + tournamentSession.CreatorUsername;
    div.appendChild(creator);

    const level = document.createElement('h5');
    level.classList = 'fs-5 fw-bold text-secondary text-center';
    level.textContent = 'Level : ' + tournamentSession.level;
    div.appendChild(level);

    const joinBtn = document.createElement('h5');
    joinBtn.id = 'joinRoomBtn';
    joinBtn.classList = 'fs-3 fw-bold text-success text-center';
    joinBtn.textContent = 'Play !';
    joinBtn.role = 'button';
    div.appendChild(joinBtn);

    document.getElementById('tournamentList').appendChild(div);



    joinBtn.addEventListener('click', function() {
        // document.getElementById('joinCard' + indexSession).remove();
        // console.log("tournamentSession :", tournamentSession);
        join_tournament_room(tournamentSession, indexSession);
    })
}


function waiting_tournament(tournamentData) {
	let tournamentId = tournamentData.tournamentId;

    const mainDiv = document.createElement('div');
    mainDiv.id = 'roomCreatedDiv';
    mainDiv.classList = 'col-auto p-3 mx-auto rounded-4 bg-white shadow mt-5 fade-in';
    mainDiv.style.maxWidth = '400px';

    const secDiv = document.createElement('div');
    secDiv.id = 'waitingDiv';

    const title = document.createElement('h5');
    title.classList = 'fs-3 fw-bold text-info text-center';
	if (tournamentData.players.length == 1 ){
        	title.textContent = 'Tournament created !';
	}
	else
		title.textContent = 'Tournament joined !';
        secDiv.appendChild(title);

        const text = document.createElement('h5');
        text.classList = 'fs-5 fw-bold text-secondary text-center';
        text.textContent = 'Please wait players to join the game';
        secDiv.appendChild(text);

	let players = document.createElement('h5');
	players.classList = 'fs-5 fw-bold text-secondary text-center';
	players.textContent = 'Players : ' + tournamentData.players.length + ' / ' + tournamentData.maxPlayers;
	secDiv.appendChild(players);

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

    document.getElementById('cancelCreatedRoomBtn').addEventListener('click', function() {
    document.getElementById('roomCreatedDiv').remove();
    document.getElementById('containerGameMenu').classList.remove('hidden-element');
    document.getElementById('createRoomMenu').classList.add('hidden-element');
    const message = JSON.stringify({ messageType: 'quitTournamentSession' });
    socket.send(message);
    location.reload();
    })

	socket.addEventListener('message', (event) => {
		const data = JSON.parse(event.data);
		if (data.messageType === 'updateTournamentSessions') {
			tournamentData = findTournamentById(JSON.parse(data.tournamentSessions), tournamentId);
			if (tournamentData != null) {
				players.textContent = 'Players : ' + tournamentData.players.length + ' / ' + tournamentData.maxPlayers;
				if (tournamentData.players.length === tournamentData.maxPlayers) {
					document.getElementById('roomCreatedDiv').remove();
					document.getElementById('containerGameMenu').classList.add('hidden-element');
					document.getElementById('createRoomMenu').classList.add('hidden-element');
					navbarSwitch('off');
					// for(let i = 0; i < tournamentData.maxPlayers ; i++) {
					// 	tournamentPlayers.push({...playerObj, name: tournamentData.players[i]});
					// }
					matchMakingLogs();
					hideCurrentSection();
					showSection('playPong');
					ManageOnlineTournament(tournamentData);
					reset_UI();
					// removeInput();
				}
			}
		}
	}
	);
}

function findTournamentById(tournamentSessions, tournamentId) {
    for (let key in tournamentSessions) {
        if (tournamentSessions[key].tournamentId === tournamentId) {
            return tournamentSessions[key];
        }
    }
    return null;
}

function create_tournament_room()
{
    document.getElementById('containerGameMenu').classList.add('hidden-element');

    navbarSwitch('off');
    reset_UI();

    socket.send(JSON.stringify({ messageType: 'createTournamentSession', level:level, max_player: tournamentSize ,paddleHeight: paddleHeight}))
	socket.addEventListener('message', (event) => {
        let data = JSON.parse(event.data);
		if (data.messageType === 'confirmTournamentCreat') {
			if (data.confirme == "true"){
				waiting_tournament(data.tournamentData);
			}
		}
	});
}

function join_tournament_room(tournamentSession)
{
	socket.send(JSON.stringify({ messageType: 'joinTournamentSessions', tournamentId: tournamentSession.tournamentId}));
	socket.addEventListener('message', (event) => {
		let data = JSON.parse(event.data);
		if (data.messageType === 'confirmJoinTournamentSessions') {
			document.getElementById('tournament').classList.add('hidden-element');
			showSection('gameMenu');
			document.getElementById('containerGameMenu').classList.add('hidden-element');
			navbarSwitch('off');
			reset_UI();
			// console.log('confirmJoinTournamentSessions', data);
			waiting_tournament(data.tournamentData);
		}
	});
}


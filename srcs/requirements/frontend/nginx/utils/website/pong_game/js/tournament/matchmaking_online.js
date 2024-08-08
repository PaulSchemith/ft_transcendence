

function tournament_dashboard(tournamentData)
{
	// Création de l'élément div container
	let containerDiv = document.createElement('div');
	containerDiv.id = 'matchMakingTable';
	containerDiv.className = 'container bg-secondary bg-opacity-25 pt-4 pb-5 mt-5 w-auto rounded-4 shadow-lg';
	containerDiv.style.cssText = 'width: 100%; max-width: 900px;';

	// Création de l'élément div pour le coutdown
	let coutdown = document.getElementById('countdown');
	coutdown.classList.remove('hidden-element');
	containerDiv.appendChild(coutdown);
	// buttonDiv.className = 'd-flex justify-content-center';
	// buttonDiv.id = 'buttonDiv';

	// Table part
	let rowDiv = document.createElement('div');
	rowDiv.classList = 'row d-flex justify-content-center';
	rowDiv.id = 'rowDiv';
	containerDiv.appendChild(rowDiv);

	let table = document.createElement('table');
	table.classList = 'table table-sm table-hover mt-4 mb-3 text-center w-75 shadow';
	table.id = 'table';
	rowDiv.appendChild(table);

	let thead = document.createElement('thead');
	thead.classList = 'table-secondary';
	table.appendChild(thead);

	let tr = document.createElement('tr');
	thead.appendChild(tr);

	// Set the 4 'th' inside 'tr'
	for(let i = 0; i < 4; i++) {

		let titles = ["#", "Player 1", "Player 2", "Score"];
		let th = document.createElement('th');
		th.classList = 'text-info';
		th.textContent = titles[i];
		tr.appendChild(th);
	}

	// Set the 'tbody'
	let tbody = document.createElement('tbody');
	table.appendChild(tbody);

	// Récupération de la section par son ID
	let mySection = document.getElementById('playPong');
	// Ajout de l'élément div principal à la section spécifiée
	mySection.appendChild(containerDiv);
	document.getElementById('gameDiv').classList.add('hidden-element');
	document.getElementById('countdown').classList.remove('hidden-element');

	socket.addEventListener('message', (event) => {
		let data = JSON.parse(event.data);
		if (data.messageType === 'getMatchmaking') {
			// draw the table
			// console.log('getMatchmaking', data.tournamentData.matchs);
			for(let i = 0; i < data.tournamentData.matchs.length; i++) {
				tr = document.createElement('tr');
				tr.id = 'match ' + (i + 1);
				tbody.appendChild(tr);
				// Set the 4 cols - first[matchNumber] - second[player 1 name] - third[player 2 name] - forth[score init with '-']
				for(let j = 0; j < 4; j++) {

					let td = document.createElement('td');

					if(j === 0) {
						td.classList = 'text-info table-secondary border-end';
						td.textContent = data.tournamentData.matchs[i].matchNumber;
					}
					else if( j === 1 ) {
						if (data.tournamentData.matchs[i].player1 === sessionUsername)
							td.classList = 'text-info fw-bold border-end';
						else
							td.classList = 'text-secondary fw-bold border-end';
						td.textContent = data.tournamentData.matchs[i].player1;
					}
					else if(j === 2) {
						if (data.tournamentData.matchs[i].player2 === sessionUsername)
							td.classList = 'text-info fw-bold border-end';
						else
							td.classList = 'text-secondary fw-bold border-end';
						td.textContent = data.tournamentData.matchs[i].player2;
					}
					else if(j === 3) {
						if (data.tournamentData.matchs[i].score === "not played yet")
							td.classList = 'text-secondary fw-lighter fst-italic border-end';
						else
							td.classList = 'text-info fw-lighter fst-italic border-end';
						td.textContent = data.tournamentData.matchs[i].score;
					}
					tr.appendChild(td);
				}
			}
		}
	});


	socket.addEventListener('message', (event) => {
		let data = JSON.parse(event.data);
		if (data.messageType === 'updateScore') {
			// console.log('updateScore' , data.match);
			let match = data.match;
			let tr = document.getElementById('match ' + data.match.matchNumber);
			let td = tr.getElementsByTagName('td')[3];
			td.classList = 'text-info fw-lighter fst-italic border-end';
			td.textContent = match.score;
		}
	});

	socket.addEventListener('message', (event) => {
		let data = JSON.parse(event.data);
		if (data.messageType === 'updateMatchsInTurn') {
			// console.log('updateMatchsInTurn' , data.match);
			for (let i = 0; i < data.tournamentData.matchs.length; i++) {
				let match = data.tournamentData.matchs[i];
				let tr = document.getElementById('match ' + match.matchNumber);
				let td = tr.getElementsByTagName('td')[1];
				if (match.player1 === sessionUsername)
					td.classList = 'text-info fw-bold border-end';
				td.textContent = match.player1;
				td = tr.getElementsByTagName('td')[2];
				if (match.player2 === sessionUsername)
					td.classList = 'text-info fw-bold border-end';
				td.textContent = match.player2;
			}
		}
	});
}


let turn = 0;

function ManageOnlineTournament(tournamentData) {

	// let tourMax;
	// if (tournamentData.players.length == 4)
	// 	tourMax = 2;
	// else if (tournamentData.players.length == 8)
	// 	tourMax = 3;
	// else if (tournamentData.players.length == 16)
	// 	tourMax = 4;
	// console.log("tournamentData", tournamentData);

	//define the number of matchs
	if (tournamentData.turn == 0 && tournamentData.players[0] === sessionUsername)
	{
		socket.send(JSON.stringify({ messageType: 'createMatchmaking', tournamentData: tournamentData}));
	}

	tournament_dashboard(tournamentData);
	// if (tournamentData.CreatorUsername === sessionUsername)
	// if (turn !== 0)
	// {
	// matchs = tournamentData.matchs;
	socket.send(JSON.stringify({ messageType: 'getMatchmaking'}));
	// }

	socket.send(JSON.stringify({ messageType: 'enterMatchmakingRoom', tournamentData: tournamentData}));


	// let tournamentOn = true;

	// while (tournamentOn) {
		socket.addEventListener('message', (event) => {
			let data = JSON.parse(event.data);
			if (data.messageType === 'newTurn') {

			if (data.tournamentData.players.length <= 1)
			{
				winnerAnnoucement(700).then(() => {
					socket.send(JSON.stringify({ messageType: 'endTournament', tournamentData: data.tournamentData}));
					window.location.href = domainPath;

				});
				return;
			}

			let currentMatch = 0;
			let matchPassed = 0;
			for (let i = 0; i < data.tournamentData.matchs.length; i++) {
				if (data.tournamentData.matchs[i].score === "not played yet")
				break;
				currentMatch++;
				matchPassed++;
			}

			turn = data.tournamentData.turn;
			// console.log('New turn', turn);
			noPlayer = 0;
			let nbMatchinTurn = 0;
			for (let i = currentMatch; i < matchPassed + data.tournamentData.players.length / 2; i++) {
				// console.log('currentMatch', currentMatch);
				// console.log('Match number :', data.tournamentData.matchs[currentMatch]);
				// console.log('Players tournament DATA :', data.tournamentData.players);
				data.tournamentData.matchs[currentMatch].player1 = data.tournamentData.players[noPlayer];
				data.tournamentData.matchs[currentMatch].player2 = data.tournamentData.players[noPlayer + 1];
				// console.log('Match number :', currentMatch, " ", data.tournamentData.matchs[currentMatch]);
				noPlayer += 2;
				currentMatch++;
				nbMatchinTurn++;
			}
			// if (data.players.length === 2) {
			// 	currentMatch--;

			// }
			// if (data.tournamentData.players[0] === sessionUsername)
				// if (turn === 0)
				// 	socket.send(JSON.stringify({ messageType: 'updateMatchmaking', tournamentData: data.tournamentData, matchs: matchs}));
				// else
				// {
					// let index = currentMatch - nbMatchinTurn;
					// console.log('Index :', index);
			if (data.tournamentData.players[0] === sessionUsername)
				socket.send(JSON.stringify({ messageType: 'updateMatchsInTurn', tournamentData: data.tournamentData}));
				// }

			for (let i = currentMatch - nbMatchinTurn; i < currentMatch - nbMatchinTurn + nbMatchinTurn ; i++) {
			if (data.tournamentData.matchs[i].player2 === sessionUsername)
			{
				startCountdown(400).then(() => {
					join_tournament_duel(data.tournamentData, data.tournamentData.matchs[i]);
				});
			}
			else if (data.tournamentData.matchs[i].player1 === sessionUsername)
			{
				startCountdown(500).then(() => {
					create_tournament_duel(data.tournamentData, data.tournamentData.matchs[i]);
				});
			}
		}

		}
	});




}

function winnerAnnoucement(time) {
    return new Promise((resolve, reject) => {
        let count = 10; // Compte à rebours initial
        const countdownElement = document.getElementById('countdown-text');

        // Mise à jour du texte du compte à rebours toutes les secondes
        const countdownInterval = setInterval(function() {
            countdownElement.textContent = "Congratulations! You won the tournament!";
            count--;

            // Arrête le compte à rebours lorsque count atteint 0
            if (count < 0) {
                clearInterval(countdownInterval);
                resolve(); // Résout la promesse lorsque le compte à rebours est terminé
            }
        }, time);
    });
}


function startCountdown(time) {
    return new Promise((resolve, reject) => {
        let count = 10; // Compte à rebours initial
        const countdownElement = document.getElementById('countdown-text');

        // Mise à jour du texte du compte à rebours toutes les secondes
        const countdownInterval = setInterval(function() {
            countdownElement.textContent = `Game start in ${count} sec`;
            count--;

            // Arrête le compte à rebours lorsque count atteint 0
            if (count < 0) {
                clearInterval(countdownInterval);
                countdownElement.textContent = 'Game starting!';
                resolve(); // Résout la promesse lorsque le compte à rebours est terminé
            }
        }, time);
    });
}
function create_tournament_duel(tournamentData, match) {
    peer = new SimplePeer({initiator: true})
    peer.once('signal', (dataPeer) => {
        // console.log('PeerCreator signal:', dataPeer);
        socket.send(JSON.stringify({ messageType: 'creatorPeerTournament',tournamentData: tournamentData , match:match , peerCreator: dataPeer}));
    });
	peer.on('close', () => {
		// console.log('Peer connection closed');
		// Vous pouvez mettre ici le code pour gérer la fermeture de la connexion
	});
	socket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);
        if (data.messageType === 'PlayerPeerTournament') {
			// console.log('PlayerPeerTournament', data.playerPeer);
			peer.signal(data.playerPeer);
			peer.on('connect', () => {
				// console.log('PeerCreator connected');
				leftPlayerName = data.match.player1;
    	   		rightPlayerName= data.match.player2;
    	   		level = data.tournamentData.level;
    	   		paddleHeight = data.tournamentData.paddleHeight
    		    if(start){
    		        return
    		    }
				playTournament = true;
				playOnline = true;
    		    start = true;
    		    setPlayerNameToPrint(leftPlayerName, rightPlayerName);
    		    // setHandToStart();
    		    leftPaddleHand = true;
    		    // printConsoleInfos();
    		    showSection("playPong");
    		    document.getElementById('gameDiv').classList.remove('hidden-element');
				document.getElementById('countdown').classList.add('hidden-element');
				document.getElementById('matchMakingTable').classList.add('hidden-element');
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
    		    // console.log("level :", level)
    		    // console.log("level :", paddleHeight)
    		    tournamentRun(peer, data.tournamentData, match);
    		    // console.log("peer = ", peer);
    		    showSection('playPong');
			});
		}
	});
	socket.addEventListener('message', (event) => {
		let data = JSON.parse(event.data);
		if (data.messageType === 'surrenderTournamentSession') {
			if (data.surrendedPlayer === match.player2) {
				// peer.destroy();
				// console.log("data tournamentData: ", data.tournamentData)
				tournamentData = data.tournamentData;
				// console.log("tournamentData after: ", tournamentData)
				// tournamentData.players = tournamentData.players.filter(player => player !== match.player1);
				start = false;
				// if (peer)
				// 	peer.destroy();
                const message = JSON.stringify({messageType : "endMatchGame", leftPlayerScore : leftPlayerScore, rightPlayerScore : rightPlayerScore , match : match, winner : sessionUsername, tournamentData : tournamentData});
				socket.send(message);
				// document.getElementById('gameDiv').classList.add('hidden-element');

				// socket.send(JSON.stringify({ messageType: 'newPeerTurn', tournamentData: tournamentData}));
				// showSection('gameMenu');
				alert("Opponent has surrendered! You won the match!");
				window.location.href = domainPath;
			}
	}
	});
}




function join_tournament_duel(tournamentData, match) {
	// console.log('join_tournament_duel');
	socket.addEventListener('message', (event) => {
		let data = JSON.parse(event.data);
		if (data.messageType === 'creatorPeerTournament') {
			// let signalsent = false;
			// console.log('creatorPeerTournament');
			peer2 = new SimplePeer({ initiator: false })
			// console.log('PeerCreator signal:', data.peerCreator);
			peer2.signal(data.peerCreator);

			peer2.on('close', () => {
                // console.log('Peer connection closed');
                // Vous pouvez mettre ici le code pour gérer la fermeture de la connexion
            });

			peer2.on('signal', (dataPeer) => {
				// console.log('PeerJoiner signal:', dataPeer);
				// if(!signalsent) {
					// console.log('signal sent');
					socket.send(JSON.stringify({ messageType: 'playerPeerTournament', tournamentData:tournamentData, match:match, playerPeer: dataPeer }));
					// signalsent = true;
				// }
			});

		peer2.on('connect', () => {
			// console.log('PeerJoiner connected');
			leftPlayerName = data.match.player1;
    	    rightPlayerName= data.match.player2;
    	    level = data.tournamentData.level;
    	    paddleHeight = data.tournamentData.paddleHeight
    	    playOnline = true;
			playTournament = true;
    	    start = true
    	    setPlayerNameToPrint(leftPlayerName, rightPlayerName);
    	    // printConsoleInfos();
    	    showSection("playPong");
    	    document.getElementById('gameDiv').classList.remove('hidden-element');
			document.getElementById('countdown').classList.add('hidden-element');
			document.getElementById('matchMakingTable').classList.add('hidden-element');
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
    	    tournamentRun(peer2, data.tournamentData, match);
		});

		}
	}
	);
	socket.addEventListener('message', (event) => {
		let data = JSON.parse(event.data);
		if (data.messageType === 'surrenderTournamentSession') {
			if (data.surrendedPlayer === match.player1) {
				// console.log("data tournamentData: ", data.tournamentData)
				tournamentData = data.tournamentData;
				// console.log("tournamentData after: ", tournamentData)
				// peer2.destroy();array = array.filter(item => item !== valueToRemove);
				// tournamentData.players = tournamentData.players.filter(player => player !== match.player2);
				start = false;
				// if (peer2)
				// 	peer2.destroy();
                const message = JSON.stringify({messageType : "endMatchGame", leftPlayerScore : leftPlayerScore, rightPlayerScore : rightPlayerScore , match : match, winner : sessionUsername, tournamentData : tournamentData});
				socket.send(message);
				// document.getElementById('gameDiv').classList.add('hidden-element');
				// socket.send(JSON.stringify({ messag	eType: 'newPeerTurn', tournamentData: tournamentData}));
				// showSection('gameMenu');
				alert("Opponent has surrendered! You won the match!");
				window.location.href = domainPath;
			}
	}
	});
}
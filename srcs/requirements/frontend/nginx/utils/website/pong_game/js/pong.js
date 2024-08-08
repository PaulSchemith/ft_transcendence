
// printConsoleInfos();
// Fonction principale de mise à jour et de rendu
printGame();

function localRun() {

    if(!start) {

        return;
    }
    serve();
    printGame();
    printInfos();

        if (p_keyPressed && rightPaddleY > 0) {
            rightPaddleY -= level + 1.8;
        } else if (l_keyPressed && rightPaddleY + paddleHeight < canvas.height) {
            rightPaddleY += level + 1.8;
        }
        // if(twoPlayers || tournament) {
            if (q_keyPressed && leftPaddleY > 0) {
                leftPaddleY -= level + 1.8;
            } else if (a_keyPressed && leftPaddleY + paddleHeight < canvas.height) {
                leftPaddleY += level + 1.8;
            }
        // }

        ballX += ballSpeedX;
        ballY += ballSpeedY;

        // Bouncing Sides
        if (ballY + ballSize > canvas.height || ballY - ballSize < 0) {
            ballSpeedY = -ballSpeedY;
        }

        // Right Paddle Bounce
        if (
            ballX + ballSize > canvas.width - paddleWidth &&
            ballY > rightPaddleY &&
            ballY < rightPaddleY + paddleHeight
        ) {
            ballSpeedX = -ballSpeedX;
            paddleFX.play();
        } else if (ballX + ballSize > canvas.width) { // Right Wall Bounce
            leftPlayerScore++;
            ballLaunched = false;
            spaceBarPressed = false;
            leftPaddleHand = true;
            rightPaddleHand = false;
            if(leftPlayerScore < 10) {
                pointFX.play();
            } else {
                applauseFX.play();
            }
            // leftPaddleY = (canvas.height - paddleHeight) / 2;
            // rightPaddleY = (canvas.height - paddleHeight) / 2;

        }
        // Left Paddle Bounce
        if (
            ballX - ballSize < paddleWidth &&
            ballY > leftPaddleY &&
            ballY < leftPaddleY + paddleHeight
        ) {
            ballSpeedX = -ballSpeedX;
            paddleFX.play();
        } else if (ballX + ballSize < 0) { // Left Wall Bounce
            rightPlayerScore++;
            ballLaunched = false;
            spaceBarPressed = false;
            leftPaddleHand = false;
            rightPaddleHand = true;
            if(rightPlayerScore < 10) {
                pointFX.play();
            } else {
                applauseFX.play();
            }

            // leftPaddleY = (canvas.height - paddleHeight) / 2;
            // rightPaddleY = (canvas.height - paddleHeight) / 2;

        }

    requestAnimationFrame(() => localRun());
}



// let lastUpdateSentTime = 0;
// const updateInterval = 500; // Interval de mise à jour en millisecondes

function onlineRun(peer) {
    // printConsoleInfos();
    // const currentTime = Date.now();
    if (leftPlayerName == sessionUsername){
        // console.log("spaceBarPressed" , spaceBarPressed)
        if (q_keyPressed && leftPaddleY > 0) {
            leftPaddleY -= level + 1.8;
            // printConsoleInfos();

            // sendPaddlePositions(peer, leftPaddleY, "left")
        } else if (a_keyPressed && leftPaddleY + paddleHeight < canvas.height) {
            leftPaddleY += level + 1.8;
            // printConsoleInfos();
            // sendPaddlePositions(peer, leftPaddleY, "left")
        }
        // if (leftPaddleHand){
        // }
        serveLeft();

    }
    else {

        // console.log("rightPaddleHand", rightPaddleHand);
        if (q_keyPressed && rightPaddleY > 0) {
            rightPaddleY -= level + 1.8;
            sendGameUpdate(peer);
            // sendPaddlePositions(peer, rightPaddleY, "right")
            // printConsoleInfos();
        } if (a_keyPressed && rightPaddleY + paddleHeight < canvas.height) {
            rightPaddleY += level + 1.8;
            sendGameUpdate(peer);
            // printConsoleInfos();

            // sendPaddlePositions(peer, rightPaddleY, "right")
        } if (spaceBarPressed && rightPaddleHand){
            spaceRight = true;
            sendGameUpdate(peer);
            // sendGameUpdate(peer);
            // sendGameUpdate(peer);
            spaceBarPressed = false;
            spaceRight = false;
        }
        if (!start){
            printGame();
            printInfos();
            return;
        }


    }

    if (leftPlayerName == sessionUsername){

        // serveRight();
        // if (rightPaddleHand){

            // }
        // serve();

        // sendPaddlePositions(leftPaddleY, "left");
        // sendPaddlePositions(rightPaddleY, "right");

        // Ball Update Position
        if (ballLaunched) {
            ballX += ballSpeedX;
            ballY += ballSpeedY;
        }
        // sendBallPositions(peer, ballX, ballY);
        sendGameUpdate(peer);
        if (!start){
            if (leftPlayerScore >= 10){
                winner = leftPlayerName;
                const message = JSON.stringify({messageType : "endGame", leftPlayerScore : leftPlayerScore, rightPlayerScore : rightPlayerScore , sessionUsername : sessionUsername, winner : winner});
                socket.send(message);
            }
            else if (rightPlayerScore >= 10){
                winner = rightPlayerName;
                const message = JSON.stringify({messageType : "endGame", leftPlayerScore : leftPlayerScore, rightPlayerScore : rightPlayerScore , sessionUsername : sessionUsername, winner : winner});
                socket.send(message);
            }
            printGame();
            printInfos();
            peer.destroy();
            return;
        }

        // sendValue(peer, spaceBarPressed, rightPaddleHand, leftPaddleHand, leftPlayerScore, rightPlayerScore, ballLaunched);

        // sendPaddlePositions(rightPaddleY, "right");

        // Bouncing Sides
        if (ballY + ballSize > canvas.height || ballY - ballSize < 0) {
            ballSpeedY = -ballSpeedY;
        }
        // Right Paddle Bounce
        if (
            ballX + ballSize > canvas.width - paddleWidth &&
            ballY > rightPaddleY &&
            ballY < rightPaddleY + paddleHeight
        ) {
            ballSpeedX = -ballSpeedX;
            paddleFX.play();
        } else if (ballX + ballSize > canvas.width) { // Right Wall Bounce
            leftPlayerScore++;
            ballLaunched = false;
            spaceBarPressed = false;
            leftPaddleHand = true;
            rightPaddleHand = false;
            if(leftPlayerScore < 10) {
                pointFX.play();
            } else {
                applauseFX.play();
            }
            // leftPaddleY = (canvas.height - paddleHeight) / 2;
            // rightPaddleY = (canvas.height - paddleHeight) / 2;
            sendGameUpdate(peer, 'reset');
            // sendPaddlePositions(peer, leftPaddleY, "left");
            // sendPaddlePositions(peer, rightPaddleY, "right");
            // sendValue(spaceBarPressed,leftPaddleHand, rightPaddleHand, leftPlayerScore, rightPlayerScore, ballLaunched)
        }

        // Left Paddle Bounce
        if (
            ballX - ballSize < paddleWidth &&
            ballY > leftPaddleY &&
            ballY < leftPaddleY + paddleHeight
        ){
            ballSpeedX = -ballSpeedX;
            paddleFX.play();
        } else if (ballX + ballSize < 0) { // Left Wall Bounce
            rightPlayerScore++;
            ballLaunched = false;
            spaceBarPressed = false;
            leftPaddleHand = false;
            rightPaddleHand = true;
            if(rightPlayerScore < 10) {
                pointFX.play();
            } else {
                applauseFX.play();
            }

            // leftPaddleY = (canvas.height - paddleHeight) / 2;
            // rightPaddleY = (canvas.height - paddleHeight) / 2;
            sendGameUpdate(peer, 'reset');
            // sendPaddlePositions(leftPaddleY, "left");
            // sendPaddlePositions(rightPaddleY, "right");

            // sendValue(spaceBarPressed,leftPaddleHand, rightPaddleHand, leftPlayerScore, rightPlayerScore, ballLaunched)
        }

    }
    printGame();
    printInfos();
    // if (currentTime - lastUpdateSentTime >= updateInterval) {
        // lastUpdateSentTime = currentTime;
        // }
        // Appeler la fonction update à la prochaine frame
    requestAnimationFrame(() => onlineRun(peer));

}

function tournamentRun(peer, tournamentData, match) {
    // printConsoleInfos();
    // const currentTime = Date.now();
    if (leftPlayerName == sessionUsername){
        if (q_keyPressed && leftPaddleY > 0) {
            leftPaddleY -= level + 1.8;
            // printConsoleInfos();

            // sendPaddlePositions(peer, leftPaddleY, "left")
        } else if (a_keyPressed && leftPaddleY + paddleHeight < canvas.height) {
            leftPaddleY += level + 1.8;
            // printConsoleInfos();
            // sendPaddlePositions(peer, leftPaddleY, "left")
        }
        // if (leftPaddleHand){
        // }
        serveLeft();

    }
    else {
        if (q_keyPressed && rightPaddleY > 0) {
            rightPaddleY -= level + 1.8;
            sendGameUpdate(peer);
            // sendPaddlePositions(peer, rightPaddleY, "right")
            // printConsoleInfos();
        } if (a_keyPressed && rightPaddleY + paddleHeight < canvas.height) {
            rightPaddleY += level + 1.8;
            sendGameUpdate(peer);
            // printConsoleInfos();

            // sendPaddlePositions(peer, rightPaddleY, "right")
        } if (spaceBarPressed && rightPaddleHand){
            // console.log(spaceBarPressed);
            spaceRight = true;
            sendGameUpdate(peer);
            // sendGameUpdate(peer);
            // sendGameUpdate(peer);
            spaceBarPressed = false;
            spaceRight = false;
        }
        if (!start){
            // console.log('first if');
            printGame();
            printInfos();
            // peer.destroy();
            // getElementById("playPong").classList.add("hidden-element");
            window.location.href = domainPath;
            return;
        }


    }

    if (leftPlayerName == sessionUsername){

        // serveRight();
        // if (rightPaddleHand){

            // }
        // serve();

        // sendPaddlePositions(leftPaddleY, "left");
        // sendPaddlePositions(rightPaddleY, "right");

        // Ball Update Position
        if (ballLaunched) {
            ballX += ballSpeedX;
            ballY += ballSpeedY;
        }
        // sendBallPositions(peer, ballX, ballY);
        sendGameUpdate(peer);
        if (!start){
            // console.log('second if');
            printGame();
            printInfos();

            if (leftPlayerScore >= 10){
                const quitButton = document.getElementById("quitGameBtn");
                quitButton.classList.add("disabled");
                winner = leftPlayerName;
                const message = JSON.stringify({messageType : "endMatchGame", leftPlayerScore : leftPlayerScore, rightPlayerScore : rightPlayerScore , match : match, winner : winner, tournamentData : tournamentData});
                socket.send(message);

            }
            else if (rightPlayerScore >= 10){
                const quitButton = document.getElementById("quitGameBtn");
                quitButton.classList.add("disabled");
                winner = rightPlayerName;
                const message = JSON.stringify({messageType : "endMatchGame", leftPlayerScore : leftPlayerScore, rightPlayerScore : rightPlayerScore , match : match, winner : winner, tournamentData : tournamentData});
                socket.send(message);
            }
            // peer.destroy();
            setTimeout(function() {
                // getElementById("playPong").classList.add("hidden-element");
                window.location.href = domainPath;
                // location.reload();
            }, 1000);
            // startCountdown(500).then(() => {
            // });
            return;
        }

        // sendValue(peer, spaceBarPressed, rightPaddleHand, leftPaddleHand, leftPlayerScore, rightPlayerScore, ballLaunched);

        // sendPaddlePositions(rightPaddleY, "right");

        // Bouncing Sides
        if (ballY + ballSize > canvas.height || ballY - ballSize < 0) {
            ballSpeedY = -ballSpeedY;
        }
        // Right Paddle Bounce
        if (
            ballX + ballSize > canvas.width - paddleWidth &&
            ballY > rightPaddleY &&
            ballY < rightPaddleY + paddleHeight
        ) {
            ballSpeedX = -ballSpeedX;
            paddleFX.play();
        } else if (ballX + ballSize > canvas.width) { // Right Wall Bounce
            leftPlayerScore++;
            ballLaunched = false;
            spaceBarPressed = false;
            leftPaddleHand = true;
            rightPaddleHand = false;
            if(leftPlayerScore < 10) {
                pointFX.play();
            } else {
                applauseFX.play();
            }
            // leftPaddleY = (canvas.height - paddleHeight) / 2;
            // rightPaddleY = (canvas.height - paddleHeight) / 2;
            sendGameUpdate(peer, 'reset');
            // sendPaddlePositions(peer, leftPaddleY, "left");
            // sendPaddlePositions(peer, rightPaddleY, "right");
            // sendValue(spaceBarPressed,leftPaddleHand, rightPaddleHand, leftPlayerScore, rightPlayerScore, ballLaunched)
        }

        // Left Paddle Bounce
        if (
            ballX - ballSize < paddleWidth &&
            ballY > leftPaddleY &&
            ballY < leftPaddleY + paddleHeight
        ){
            ballSpeedX = -ballSpeedX;
            paddleFX.play();
        } else if (ballX + ballSize < 0) { // Left Wall Bounce
            rightPlayerScore++;
            ballLaunched = false;
            spaceBarPressed = false;
            leftPaddleHand = false;
            rightPaddleHand = true;
            if(rightPlayerScore < 10) {
                pointFX.play();
            } else {
                applauseFX.play();
            }

            // leftPaddleY = (canvas.height - paddleHeight) / 2;
            // rightPaddleY = (canvas.height - paddleHeight) / 2;
            sendGameUpdate(peer, 'reset');
            // sendPaddlePositions(leftPaddleY, "left");
            // sendPaddlePositions(rightPaddleY, "right");

            // sendValue(spaceBarPressed,leftPaddleHand, rightPaddleHand, leftPlayerScore, rightPlayerScore, ballLaunched)
        }

    }
    printGame();
    printInfos();
    // if (currentTime - lastUpdateSentTime >= updateInterval) {
        // lastUpdateSentTime = currentTime;
        // }
        // Appeler la fonction update à la prochaine frame
    requestAnimationFrame(() => tournamentRun(peer, tournamentData, match));

}


function sendGameUpdate(peer, messageType) {

    let gameData;
    if (leftPlayerName == sessionUsername) // joueur gauche vers droite
    {
        if (messageType === 'reset')
        {
            gameData = {
                messageType: messageType,
                rightPaddleY : rightPaddleY,
                // spaceBarPressed: spaceBarPressed,
                rightPaddleHand : rightPaddleHand,

            }

        }
        else {

        gameData  = {
            ballX,
            ballY,
            leftPaddleY,
            // rightPaddleY,
            leftPlayerScore,
            rightPlayerScore,

            // spaceBarPressed,
            // rightPaddleHand

            start,
            // Autres données de jeu à inclure...
        };
    }
    }
    else // joueur droite vers gauche
    {
        // console.log("spacebar pressed : ", spaceBarPressed);
        gameData = {
            rightPaddleY,
            spaceBarPressed,
            spaceRight
        }
    }
    peer.send(JSON.stringify(gameData));
}

function processGameData(gameData) { // recpetion des données de jeu a droite
    // Traiter les nouvelles données de jeu
    // console.log('Nouvelles données de jeu reçues :', gameData);
    if (gameData.messageType === 'reset')
    {
        rightPaddleY = gameData.rightPaddleY;
        // spaceBarPressed = gameData.spaceBarPressed;
        rightPaddleHand = gameData.rightPaddleHand;
        // ballLaunched = gameData.ballLaunched

    }
    // Mettre à jour le jeu en fonction des données reçues
    // Par exemple :
    ballX = gameData.ballX;
    ballY = gameData.ballY;
    leftPaddleY = gameData.leftPaddleY;

    // rightPaddleY = gameData.rightPaddleY;

    leftPlayerScore = gameData.leftPlayerScore;
    rightPlayerScore = gameData.rightPlayerScore;

    // spaceBarPressed = gameData.spaceBarPressed;

    start = gameData.start


    // leftPaddleHand = gameData.leftPaddleHand;
    // rightPaddleHand = gameData.rightPaddleHand;
    // ballLaunched = gameData.ballLaunched;

    // etc.
}

// function sendBallPositions(peer, ballX, ballY) {

//     const message = JSON.stringify({
//         messageType: 'updateBallPositions',
//         ballX: ballX,
//         ballY: ballY,
//     });
//     peer.send(message);
// }


// function sendPaddlePositions(peer, pos, cote) {

//     const message = JSON.stringify({
//         messageType: 'updatePaddlePositions',
//         pos: pos,
//         cote: cote,
//         time: new Date().toLocaleTimeString()
//     });

//     peer.send(message);
// }


// function sendValue(peer, spaceBarPressed, rightPaddleHand, leftPaddleHand, leftPlayerScore, rightPlayerScore, ballLaunched){
//     const message = JSON.stringify({
//         messageType: 'values',
//         spaceBarPressed: spaceBarPressed,
//         leftPaddleHand: leftPaddleHand,
//         rightPaddleHand: rightPaddleHand,
//         leftPlayerScore: leftPlayerScore,
//         rightPlayerScore: rightPlayerScore,
//         ballLaunched: ballLaunched,
//     });
//     peer.send(message);
// }


// function sendValue(spaceBarPressed,leftPaddleHand, rightPaddleHand, leftPlayerScore, rightPlayerScore, ballLaunched){
//     const message = JSON.stringify({
//         action: 'values',
//         spaceBarPressed: spaceBarPressed,
//         leftPaddleHand: leftPaddleHand,
//         rightPaddleHand: rightPaddleHand,
//         leftPlayerScore: leftPlayerScore,
//         rightPlayerScore: rightPlayerScore,
//         ballLaunched: ballLaunched,
//     });
//     socket.send(message);
// }
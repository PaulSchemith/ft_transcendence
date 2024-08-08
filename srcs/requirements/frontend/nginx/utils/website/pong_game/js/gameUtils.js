function printConsoleInfos() {
    // console.log("------ Game logs ----------------------------------");
    // console.log("Left Player Name : " + leftPlayerName);
    // console.log("Right Player Name : " + rightPlayerName);
    // console.log("Paddles Height : " + paddleHeight);
    // console.log("Level : " + level);
    // console.log("Paddle Left Pos : " + leftPaddleY);
    // console.log("Paddle Right Pos : " + rightPaddleY);
    if(leftPaddleHand) {
        // console.log("Hand : left");
    } else {
        // console.log("Hand : right");
    }
    // console.log("Left Player Score : " + leftPlayerScore);
    // console.log("Right Player Score : " + rightPlayerScore);
    // console.log("Ball Speed X : " + ballSpeedX);
    // console.log("Ball Speed Y : " + ballSpeedY);
    // console.log("Ball X : " + ballX);
    // console.log("Ball Y : " + ballY);
    // console.log("Ball Size : " + ballSize);
    // console.log("Start : " + start);
    // console.log("Ball Launched : " + ballLaunched);
    // console.log("spaceBarPressed : " + spaceBarPressed);
    // console.log("Theme : " + theme);
    // console.log("One Player : " + onePlayer);
    // console.log("Two Player : " + twoPlayers);
    // console.log("Tournament : " + tournament);
    // console.log("Local : " + playLocal);
    // console.log("Online : " + playOnline);



    // console.log("\n");
}

function printGame() {

    // Effacement du canvas
    ctx.fillStyle = themeColor[theme].field;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dessin de la ligne au milieu du terrain
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.lineWidth = 4;
    ctx.strokeStyle = themeColor[theme].midLine;
    ctx.stroke();
    ctx.closePath();

    // Dessin des raquettes
    ctx.fillStyle = themeColor[theme].paddle;
    drawPaddles(5, leftPaddleY, paddleWidth, paddleHeight, 5);  // Left Paddle
    drawPaddles(canvas.width - paddleWidth -5, rightPaddleY, paddleWidth, paddleHeight, 5);  // Right Paddle

    // Dessin de la balle
    ctx.fillStyle = themeColor[theme].ball;
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();

}

function printWinner() {

    navbarSwitch('on');
    ctx.font = '130px "Bagel Fat One", sans-serif';
    ctx.fillStyle = themeColor[theme].winPrint;
    if(rightPlayerScore === 10) {

        ctx.fillText("Win!",  680, 400);
    }
    if(leftPlayerScore === 10) {

        ctx.fillText("Win!", 140, 400);
    }
    leftPlayerNamePrint = "";
    rightPlayerNamePrint = "";

    if(tournament) {
        setTimeout(function () {
            ManageTournament();
          }, 2500);
    }
}

function printInfos() {

    // Print score
    ctx.font = '90px "Bagel Fat One", sans-serif';
    if( leftPlayerScore < 10) {

        ctx.fillText(leftPlayerScore, 465, 85);
    } else {
        ctx.fillText(leftPlayerScore, 420, 85);
    }
    ctx.fillText(rightPlayerScore, 580, 85);

    if (leftPlayerScore === 10 || rightPlayerScore === 10) {
        start = false;
        printWinner();

    }

    // Print Players Name
    ctx.fillStyle = themeColor[theme].playersName;
    ctx.globalAlpha = 0.2;
    ctx.fillText(leftPlayerNamePrint, 20, 85);
    ctx.fillText(rightPlayerNamePrint, 900, 85);
    ctx.globalAlpha = 1.0;

    // Print Commands CTRL
    if(connectedFrom_desktop) {

        ctx.globalAlpha = 0.2;
        ctx.font = '40px "Bagel Fat One", sans-serif';
        ctx.fillText('UP = Q', 20, 635);
        ctx.fillText('DN = A', 20, 680);
        if (playLocal) {

            ctx.fillText('UP = P', 970, 635);
            ctx.fillText('DN = L', 970, 680);
        }
        ctx.globalAlpha = 1.0;
        if ((!ballLaunched && leftPlayerScore === 0 && rightPlayerScore === 0 && playLocal === true)
            || (!ballLaunched && leftPlayerScore === 0 && rightPlayerScore === 0 && playOnline === true && leftPlayerName == sessionUsername)) {
            // Print PRESS SPACE TO LAUNCH
            ctx.fillStyle = themeColor[theme].field;
            ctx.fillRect(540, 297, 20, 80);
            ctx.fillStyle = themeColor[theme].playersName;
            ctx.font = '35px "Bagel Fat One", sans-serif';
            ctx.fillText('PRESS SPACE TO LAUNCH', 335, 350);
        }
    }
}

function serve() {

    // Si la balle n'a pas été lancée et la barre d'espace est enfoncée, lancez la balle

    if (!ballLaunched) {


        if(rightPaddleHand) {
            ballX = canvas.width - 25;
            ballY = rightPaddleY + paddleHeight / 2;
        }
        else if(leftPaddleHand) {
            ballX = 25;
            ballY = leftPaddleY + paddleHeight / 2;
        }
        ctx.arc(ballX, ballY, ballSize, 0, Math.PI * 2);
        ctx.fill();
        if (spaceBarPressed) {

            ballSpeedX = level + 2; // Choisissez la vitesse initiale en fonction de votre préférence
            ballSpeedY = level; // Choisissez la vitesse initiale en fonction de votre préférence
            ballLaunched = true;
            paddleFX.play();
        }
    }
}

function serveLeft() {

    // Si la balle n'a pas été lancée et la barre d'espace est enfoncée, lancez la balle
    if (!ballLaunched) {



        if(rightPaddleHand) {

            ballX = canvas.width - 25;
            ballY = rightPaddleY + paddleHeight / 2;
        }
        else if(leftPaddleHand) {

            ballX = 25;
            ballY = leftPaddleY + paddleHeight / 2;
            // console.log('ballX = ', ballX, ' ballY = ', ballY);
        }
        ctx.arc(ballX, ballY, ballSize, 0, Math.PI * 2);
        ctx.fill();
        if (spaceBarPressed && leftPaddleHand) {

            ballSpeedX = level + 2; // Choisissez la vitesse initiale en fonction de votre préférence
            ballSpeedY = level; // Choisissez la vitesse initiale en fonction de votre préférence
            ballLaunched = true;
            paddleFX.play();
        }
        else if (spaceRight && rightPaddleHand)
        {
            ballSpeedX = level + 2; // Choisissez la vitesse initiale en fonction de votre préférence
            ballSpeedY = level; // Choisissez la vitesse initiale en fonction de votre préférence
            ballLaunched = true;
            paddleFX.play();
            spaceRight = false;
        }

    }
}


function serveRight() {

    // Si la balle n'a pas été lancée et la barre d'espace est enfoncée, lancez la balle

    if (!ballLaunched) {

        // console.log('serveRight')
        if(rightPaddleHand) {
            ballX = canvas.width - 25;
            ballY = rightPaddleY + paddleHeight / 2;
        }
        else if(leftPaddleHand) {
            ballX = 25;
            ballY = leftPaddleY + paddleHeight / 2;
        }
        ctx.arc(ballX, ballY, ballSize, 0, Math.PI * 2);
        ctx.fill();
        if (spaceRight && rightPaddleHand) {

            ballSpeedX = level + 2; // Choisissez la vitesse initiale en fonction de votre préférence
            ballSpeedY = level; // Choisissez la vitesse initiale en fonction de votre préférence
            ballLaunched = true;
            paddleFX.play();
            spaceRight = false;
        }
    }
}

// Cut the name if is length > 3
function setPlayerNameToPrint(leftName, rightName) {

    if (leftName.length > 3) {
        leftPlayerNamePrint = leftName.substring(0, 3);
        leftPlayerNamePrint = leftPlayerNamePrint.toUpperCase();
    }
    else {
        leftPlayerNamePrint = leftName;
        leftPlayerNamePrint = leftPlayerNamePrint.toUpperCase(leftPlayerNamePrint);
    }
    if (rightName.length > 3) {
        rightPlayerNamePrint = rightName.substring(0, 3);
        rightPlayerNamePrint = rightPlayerNamePrint.toUpperCase();
    }
    else {
        rightPlayerNamePrint = rightName;
        rightPlayerNamePrint = rightPlayerNamePrint.toUpperCase();
    }
}

function setHandToStart() {
    // Générer un nombre entier aléatoire entre 0 et 1
    let number = Math.floor(Math.random() * 2);
    if (number == 0) {
        leftPaddleHand = true;
    } else {
        rightPaddleHand = true;
    }
}

function drawPaddles(x, y, largeur, hauteur, rayon) {
    // Dessiner une forme rectangulaire avec des coins arrondis
    ctx.beginPath();
    ctx.moveTo(x + rayon, y);
    ctx.arcTo(x + largeur, y, x + largeur, y + hauteur, rayon);
    ctx.arcTo(x + largeur, y + hauteur, x, y + hauteur, rayon);
    ctx.arcTo(x, y + hauteur, x, y, rayon);
    ctx.arcTo(x, y, x + largeur, y, rayon);
    ctx.closePath();
    ctx.fill();
}

function resetGameValues() {

    resetTournament();
    onePlayer = false;
    twoPlayers = false;
    tournament = false;

    leftPlayerScore = 0;
    rightPlayerScore = 0;

    leftPlayerName = "";
    rightPlayerName = "";

    start = false;
    level = 0;
    leftPaddleY = (canvas.height - paddleHeight) / 2;
    rightPaddleY = (canvas.height - paddleHeight) / 2;

    ballX = 0;
    ballY = 0;
    printConsoleInfos();
    printGame();

}
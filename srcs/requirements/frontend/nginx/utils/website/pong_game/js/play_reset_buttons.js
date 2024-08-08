// PLAY - RESET -BUTTONS- ******************************************************
const playButton = document.getElementById("playButton");
const quitButton = document.getElementById("quitButton");

playButton.addEventListener("click", function() {
    playButton.classList.add("disabled");
    quitButton.classList.remove("disabled");
    create_Dificulty_menu();
});
quitButton.addEventListener("click", function() {
    playButton.classList.remove("disabled");
    quitButton.classList.add("disabled");
    reset();
});

function reset() {

    removeContent();
    resetTournament();
    onePlayer = false;
    twoPlayer = false;
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

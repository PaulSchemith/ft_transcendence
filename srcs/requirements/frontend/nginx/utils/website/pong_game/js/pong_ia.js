

/***

IA
**/


async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

var tableau = [[]];


var model_easy;
var model_medium;
var model_hard;
var best_pos =  (canvas.height - paddleHeight) / 2 + 40;
var layer_size;


async function loadmodel(){
    model_easy = await tf.loadLayersModel(domainPath + '/api/game/easy/model.json');
    model_medium = await tf.loadLayersModel(domainPath + '/api/game/medium/model.json');
    model_hard = await tf.loadLayersModel(domainPath + '/api/game/hard/model.json');
}

loadmodel();

// console.log("model : ", model_easy);

async function predict(Xtest){

    var Xstest = tf.tensor2d(Xtest);

    if(level == 3){
        ypred = await model_easy.predictOnBatch(Xstest);}
    else if(level == 5 ){
        ypred = await model_medium.predictOnBatch(Xstest);}
    else if(level == 7 ){
        ypred = await model_hard.predictOnBatch(Xstest);}

    res = await ypred.data();
    return(res[0]);

}

async function getFirstPos()
{
    var tmpBallY = leftPaddleY + paddleHeight / 2;
    tmpballSpeedY = level;
    tmpballSpeedX = level + 2;

    for(let i=0; i < Math.abs(Math.ceil((25 - 1085)/tmpballSpeedX)) ; i++){
        if (tmpBallY + ballSize > canvas.height || tmpBallY - ballSize < 0) {
            tmpballSpeedY = -tmpballSpeedY;
        }
        tmpBallY += tmpballSpeedY;
    }

    return(tmpBallY);
}


let event = new KeyboardEvent('keydown', {
    key: ' ',
    code: 'Space',
    keyCode: 32,
    which: 32,
    bubbles: true,
    cancelable: true
  });

let target = document;

async function iaRun() {

    if(!start) {
        return;
    }

    serve();
    printGame();
    printInfos();

    if(rightPaddleHand) {
        if (ballLaunched == false){
            await sleep(1000);
        }
        target.dispatchEvent(event);
    }
    // Updating paddles position based on key presses

    if (q_keyPressed && leftPaddleY > 0) {
        leftPaddleY -= level + 1.8;
    } else if (a_keyPressed && leftPaddleY + paddleHeight < canvas.height) {
        leftPaddleY += level + 1.8;
    }

    // Ball Update Position
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    /*update data for IA*/
    if(spaceBarPressed){
        tableau[0].push(ballY/700);
    }
    if((tableau[0].length == 214 && level == 3) ||
        (tableau[0].length == 154 && level == 5) ||
        (tableau[0].length == 119 && level == 7)
        ){
        // console.log(tableau);
        var res = predict(tableau);
        res.then(tableau => {
            best_pos = tableau*700;
            // console.log(best_pos);
          });

    }

    if(!spaceBarPressed && ( ballX < 200 || leftPaddleHand)){
       var res = getFirstPos();
        res.then(tableau => {
            best_pos = tableau;
          });
    }

    // Bouncing Sides
    if (ballY + ballSize > canvas.height || ballY - ballSize < 0) {
        ballSpeedY = -ballSpeedY;
    }

    // Right Paddle Bounce
    if (
        ballX + ballSize > canvas.width - paddleWidth  &&
        ballY > rightPaddleY &&
        ballY < rightPaddleY + paddleHeight
    ) {
        ballSpeedX = -ballSpeedX;
        tableau = [[]];
        //paddleFX.play();
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
        tableau = [[]];
        best_pos =  (canvas.height - paddleHeight) / 2 + 40;

    }
    // Left Paddle Bounce
    if (
        ballX - ballSize < paddleWidth   &&
        ballY > leftPaddleY &&
        ballY < leftPaddleY + paddleHeight
    ) {
        ballSpeedX = -ballSpeedX;
        //paddleFX.play();
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
        tableau = [[]];
        best_pos =  (canvas.height - paddleHeight) / 2 + paddleHeight/2;

    }
    // bouger l'IA
    // console.log("len", tableau[0].length)
    if(rightPaddleY  < best_pos - paddleHeight/2 && rightPaddleY + paddleHeight < canvas.height)
    {
        // if (tableau[0].length > handicap * 10)
            rightPaddleY +=  (level + 1.8) / 2;
    }
    if (rightPaddleY  > best_pos - 40 && rightPaddleY > 0){
        // if (tableau[0].length > handicap * 10)
            rightPaddleY -=  (level + 1.8) / 2;
    }

    // Appeler la fonction update à la prochaine frame
    requestAnimationFrame(iaRun);
}

printGame();


/*******************************************************************************
 *
 *
 *  Collect Data
 *
 *
 ********************************************************************************/

// var tableau = [];


// function iaRun() {
//     console.log("iaRun");
//     if(!start) {
//         return;
//     }

//     serve();
//     printGame();
//     printInfos();

//     // Updating paddles position based on key presses

//     if (p_keyPressed && rightPaddleY > 0) {
//         rightPaddleY -= level + 1.8;
//     } else if (l_keyPressed && rightPaddleY + paddleHeight < canvas.height) {
//         rightPaddleY += level + 1.8;
//     }
//     if(twoPlayers || tournament) {
//         if (q_keyPressed && leftPaddleY > 0) {
//             leftPaddleY -= level + 1.8;
//         } else if (a_keyPressed && leftPaddleY + paddleHeight < canvas.height) {
//             leftPaddleY += level + 1.8;
//         }
//     }

//     // Ball Update Position
//     ballX += ballSpeedX;
//     ballY += ballSpeedY;

//     /* update data */
//     tableau.push(ballX);
//     tableau.push(ballY);

//     // console.log(tableau.length);

//     /* save data */
//     if(tableau.length == 10000){
//         // console.log("yes");
//         // Convertir le tableau en chaîne de caractères avec des retours à la ligne
//         const contenu = tableau.join('\n');

//         // Créer un élément de lien
//         const element = document.createElement('a');

//         // Définir l'attribut href avec les données du fichier texte
//         element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(contenu));

//         // Définir l'attribut download avec le nom du fichier
//         element.setAttribute('download', 'monTableau.txt');

//         // Cacher l'élément (il n'a pas besoin d'être visible)
//         element.style.display = 'none';

//         // Ajouter l'élément au document
//         document.body.appendChild(element);

//         // Simuler un clic sur l'élément pour déclencher le téléchargement
//         element.click();

//         // Retirer l'élément du document
//         document.body.removeChild(element);}

//     // Bouncing Sides
//     if (ballY + ballSize > canvas.height || ballY - ballSize < 0) {
//         ballSpeedY = -ballSpeedY;
//     }

//     // Right Paddle Bounce
//     if (
//         ballX + ballSize > canvas.width - paddleWidth /*&&
//         ballY > rightPaddleY &&
//         ballY < rightPaddleY + paddleHeight*/
//     ) {
//         ballSpeedX = -ballSpeedX;

//     } else if (ballX + ballSize > canvas.width) { // Right Wall Bounce
//         leftPlayerScore++;
//         ballLaunched = false;
//         spaceBarPressed = false;
//         leftPaddleHand = true;
//         rightPaddleHand = false;
//         if(leftPlayerScore < 10) {
//             pointFX.play();
//         } else {
//             applauseFX.play();
//         }
//         leftPaddleY = (canvas.height - paddleHeight) / 2;
//         rightPaddleY = (canvas.height - paddleHeight) / 2;

//     }
//     // Left Paddle Bounce
//     if (
//         ballX - ballSize < paddleWidth  /* &&
//         ballY > leftPaddleY &&
//         ballY < leftPaddleY + paddleHeight */
//     ) {
//         ballSpeedX = -ballSpeedX;
//     } else if (ballX + ballSize < 0) { // Left Wall Bounce
//         rightPlayerScore++;
//         ballLaunched = false;
//         spaceBarPressed = false;
//         leftPaddleHand = false;
//         rightPaddleHand = true;
//         if(rightPlayerScore < 10) {
//             pointFX.play();
//         } else {
//             applauseFX.play();
//         }

//         leftPaddleY = (canvas.height - paddleHeight) / 2;
//         rightPaddleY = (canvas.height - paddleHeight) / 2;

//     }



//     // Appeler la fonction update à la prochaine frame
//     requestAnimationFrame(iaRun);
// }

// printGame();
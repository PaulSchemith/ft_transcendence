let tournamentSize =  0;
let matchNumber = 0;
let tourNumber = 0;
let tournamentWinnerName = "";
let tournament_PlayerName_left = "";
let tournament_PlayerName_right = "";

let tournamentPlayers = [];
const playerObj = {
    name: "",
    victories: 0,
    played: false,
    in: true,
};

function resetTournament() {
    tournamentSize = 0;
    matchNumber = 0;
    tourNumber = 0;
    tournamentWinnerName = "";
    tournament_PlayerName_left = "";
    tournament_PlayerName_right = "";
    tournamentPlayers = [];
}
function printTournamentLogs() {

    // console.log("------ Tournament logs ----------------------------");

    // console.log("Tournament Size : " + tournamentSize);
    for(let i = 0; i < tournamentPlayers.length; i++) {
        // console.log(tournamentPlayers[i]);
    }

    // console.log("\n");

}

function matchMakingLogs() {

    // console.log("------ Match Making -------------------------------");

    // console.log("Tournament Size : " + tournamentSize);

    for(let i = 0; i < tournamentPlayers.length; i++) {
        if(tournamentPlayers[i].in === true) {
            const playerTmp = tournamentPlayers[i];
            i++;
            while(tournamentPlayers[i].in !== true && i < tournamentPlayers.length) {
                i++;
            }
            // console.log(playerTmp.name + " VS " + tournamentPlayers[i].name);
        }
    }
    // console.log("\n");
}

function matchMaking_selectPlayersToPrint() {



    for(let i = 0; i < tournamentPlayers.length; i++) {
        if(tournamentPlayers[i].in === true && tournamentPlayers[i].played === false) {
            tournament_PlayerName_left = tournamentPlayers[i].name;
            i++;
            while(tournamentPlayers[i].in !== true && i < tournamentPlayers.length) {
                i++;
            }
            tournament_PlayerName_right = tournamentPlayers[i].name;
            break;
        }
    }
    setPlayerNameToPrint(tournament_PlayerName_left, tournament_PlayerName_right);
}













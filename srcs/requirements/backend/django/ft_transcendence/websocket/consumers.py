# chat/consumers.py
import json
import uuid

from channels.generic.websocket import AsyncWebsocketConsumer
from urllib.parse import parse_qs
from datetime import datetime
from game.models import Game
from game import serializers
from account.models import UserProfile
from asgiref.sync import sync_to_async
from django.core.serializers import serialize
import asyncio
import time

import pytz
fuseau = pytz.timezone('Europe/Paris')

class Tournament:
    def __init__(self, tournament_id, creator_username, level, max_player, paddleHeight):
        self.tournament_id = tournament_id
        self.game_type = "tournament"
        self.creator_username = creator_username
        self.level = level
        self.players = []
        self.max_players = max_player
        self.paddleHeight = paddleHeight
        self.matchs = []
        self.turn = 0
        self.available = True
        self.playersInGame = []

    def to_json(self):
        return {
            "tournamentId": self.tournament_id,
            "game_type": self.game_type,
            "CreatorUsername": self.creator_username,
            "level": self.level,
            "players": self.players,
            "maxPlayers": self.max_players,
            "paddleHeight": self.paddleHeight,
            "matchs": self.matchs,
            "turn": self.turn,
            "available": self.available,
            "playersInGame": self.playersInGame
        }

    def add_player(self, player):
        self.players.append(player)

    def remove_player(self, username):
        for player in self.players:
            if player == username:
                self.players.remove(player)
                return True
        return False

class Session:
    def __init__(self, session_id, creator_username, peer_creator, is_private, level, paddleHeight):
        self.session_id = session_id
        self.creator_username = creator_username
        self.peer_creator = peer_creator,
        self.is_private = is_private
        self.level = level
        self.players = []
        self.paddleHeight = paddleHeight

    def to_json(self):
        return {
            "sessionId": self.session_id,
            "CreatorUsername": self.creator_username,
            "CreatorPeerId": self.peer_creator,
            "isPrivate": self.is_private,
            "level": self.level,
            "players": self.players,
            "paddleHeight": self.paddleHeight,
        }

    def add_player(self, player):
        self.players.append(player)

    def remove_player(self, username):
        for player in self.players:
            if player == username:
                self.players.remove(player)
                return True
        return False

# class waitingPlayers:
#     def __init__(self, waiting_room_id, player_list, creator):
#         self.waiting_room = waiting_room_id
#         self.player_list = player_list
#         self.creator = creator

#     def to_json(self):
#         return {
#             "waiting_room_id": self.waiting_room,
#             "player_list": self.players,
#             "creator": self.creator
#         }

#     def add_player(self, player):
#         self.player_list.append(player)

#     def remove_player(self, username):
#         for player in self.player_list:
#             if player == username:
#                 self.player_list.remove(player)
#                 return True
#         return False

sessions = []

TournamentSessions = []

waitingPlayers = []

# Définir un délai de 5 secondes
DISCONNECTION_DELAY = 5

# Dictionnaire pour suivre les déconnexions des joueurs
disconnected_players = {}

# Fonction pour gérer la déconnexion d'un joueur
async def handle_player_disconnect(username):
    disconnected_players[username] = asyncio.get_event_loop().time()

# Fonction pour vérifier périodiquement les joueurs déconnectés
async def check_disconnected_players(username, channel_layer, room_group_name):
    # print("check_disconnected_players")
    await asyncio.sleep(DISCONNECTION_DELAY)
    if username in disconnected_players:
        # Le joueur est resté déconnecté pendant le délai, retirer du tournoi
        del disconnected_players[username]
        # Envoyer un signal à l'autre joueur pour indiquer qu'il a abandonné
        await send_surrender_signal(room_group_name, channel_layer, username)
        user_profile = await get_user_profile(username)
        await update_status(user_profile, "offline")

async def send_surrender_signal(room_group_name, channel_layer, username):
    # Envoyer un signal à l'autre joueur pour indiquer qu'il a abandonné
    # print("send_surrender_signal")
    tournament = search_player_in_tournament(username)
    messageType = "surrenderTournamentSession"
    if tournament:
        # print("tournament players", tournament.players)
        tournament.playersInGame.remove(username)
        tournament.players.remove(username)
        #print("tournament players after", tournament.players)
        players = tournament.players
        await channel_layer.group_send(
            room_group_name, { "type": "tournament.surrender" ,"messageType": messageType, "tournament": tournament.to_json(), "username" : username, "players": players}
    )



class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):

        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = f"chat_{self.room_name}"
        query_params = parse_qs(self.scope['query_string'].decode())
        self.user_username = query_params.get('user_username', [None])[0]


        # Join room group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()
        # Appeler la fonction de vérification des joueurs déconnectés en tant que tâche asynchrone
        # asyncio.create_task(check_disconnected_players())
        user_profile = await get_user_profile(self.user_username)
        await update_status(user_profile, "online")

        if self.user_username in disconnected_players:
           del disconnected_players[self.user_username]

        remove_player_sessions(self.user_username)

        tournament = search_player_in_tournament(self.user_username)
        # tournament_json = convert_tournament_json()
        if tournament:
            if tournament.available == True:
                await self.channel_layer.group_send(
                    self.room_group_name, { "type": "waiting.tournament" ,"messageType": "waitingTournament", "tournamentData" : tournament.to_json(), "user": self.user_username}
                )
            else:
                await self.channel_layer.group_send(
                    self.room_group_name, { "type": "send.newPeerTurn" ,"messageType": "newPeerTurn", "tournament": tournament.to_json(), "playerToSend" : self.user_username}
                )



        # remove_player_tournament(self.user_username)

        sessions_json = convert_list_json()
        await self.channel_layer.group_send(
            self.room_group_name, { "type": "session.list" ,"messageType": "updateSessions", "session": sessions_json, }
        )
        tournament_json = convert_tournament_json()
        await self.channel_layer.group_send(
            self.room_group_name, { "type": "tournamentSession_list" ,"messageType": "updateTournamentSessions", "tournamentSession": tournament_json, }
        )

    async def disconnect(self, close_code):

        # Leave room group
        # if (self.user_username in waitingPlayers):
        #     waitingPlayers.remove(self.user_username)

        await handle_player_disconnect(self.user_username)
        asyncio.create_task(check_disconnected_players(self.user_username, self.channel_layer ,self.room_group_name))

        # await check_disconnected_players(self.user_username, self.room_group_name)

        # print(self.user_username, " c est deco")
        session=search_player_in_game(self.user_username)
        if session:
            remove_player_sessions(self.user_username)
            await self.channel_layer.group_send(
                self.room_group_name, { "type": "session.surrender" ,"messageType": "surrenderSession", "session": session.to_json(), "username" : self.user_username}
            )


        # fuseau = pytz.timezone("Europe/Paris")
        await self.channel_layer.group_send(
            self.room_group_name, {"type": "chat.disconnect", "user_username": self.user_username, "time": datetime.now().astimezone(fuseau).strftime("%H:%M:%S")}
        )
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)


    # Receive message from WebSocket
    async def receive(self, text_data):
        data = json.loads(text_data)

        messageType = data["messageType"]

        if (messageType == "classic" or messageType == "online"):
            message = data["message"]
            # owner = text_data_json["owner"]
            time = data["time"]
            # print (f"User {self.user_username} connected to room {self.room_name}")
            # Send message to room group
            await self.channel_layer.group_send(
                self.room_group_name, {"type": "chat.message" ,"messageType": messageType, "message": message, "owner": self.user_username, "time": time}
            )

        if (messageType == "sendMessageSession"):
            sessionUsername = data["sessionUsername"]
            message = data["message"]
            time = data["time"]
            session = search_player_in_game(sessionUsername)

            await self.channel_layer.group_send(
                self.room_group_name, {"type": "chat.session" ,"messageType": "messageSession", "message": message, "owner": self.user_username, "time": time, "players": session.players}
            )

        if (messageType == 'createTournamentSession'):
            if (search_player_in_game(self.user_username)):
                # print(self.user_username, "deja dans une room")
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "confirmTournament.creat",
                        "messageType": "confirmTournamentCreat",
                        "confirme": "false",
                    }
                )
            else:
                level = data["level"]
                paddleHeight = data["paddleHeight"]
                max_player = data["max_player"]
                tournamentId = str(uuid.uuid4())

                tournament = Tournament(tournamentId, self.user_username, level, max_player, paddleHeight)
                tournament.add_player(self.user_username)

                players = tournament.players

                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "confirmTournament.creat",
                        "messageType": "confirmTournamentCreat",
                        "confirme": "true",
                        "tournamentData": tournament.to_json(),
                        "players": players,
                    }
                )

                TournamentSessions.append(tournament)


                tournament_json = convert_tournament_json()

                await self.channel_layer.group_send(
                    self.room_group_name, { "type": "tournamentSession.list" ,"messageType": "updateTournamentSessions", "tournamentSession": tournament_json}
                )

        if (messageType == "joinTournamentSessions"):
            tournament = find_tournament_by_id(data["tournamentId"])
            players = tournament.players
            if (search_player_in_game(self.user_username) or search_player_in_tournament(self.user_username)):
                # print(self.user_username, "deja dans une room ou tournoi")
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "confirmTournament.join",
                        "messageType": "confirmJoinTournamentSessions",
                        "confirme": "false",
                        "players": players,
                    }
                )
            else:
                tournament.add_player(self.user_username)
                if len(tournament.players) == tournament.max_players:
                    tournament.available = False
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "confirmTournament.join",
                        "messageType": "confirmJoinTournamentSessions",
                        "confirme": "true",
                        "players": players,
                        "tournamentData": tournament.to_json(),
                    }
                )
                # print("Tournament created :", tournamentId, self.user_username, level,)

                # TournamentSessions.append(tournament)


                tournament_json = convert_tournament_json()

                await self.channel_layer.group_send(
                    self.room_group_name, { "type": "tournamentSession.list" ,"messageType": "updateTournamentSessions", "tournamentSession": tournament_json}
                )

        if (messageType == "createMatchmaking"):
            tournamentData = data["tournamentData"]

            tournament = find_tournament_by_id(tournamentData["tournamentId"])

            if (len(tournament.matchs) > 0):
                return

            for i in range(0, len(tournament.players) - 1, 1):
                match = {
                    "matchNumber": i + 1,
                    "player1": "",
                    "player2": "",
                    "score": "not played yet"
                }
                tournament.matchs.append(match)
            # print("tournament.matchs", tournament.matchs)

        if (messageType == "getMatchmaking"):

            playerToSend = self.user_username

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "send.getMatchmaking",
                    "messageType": "getMatchmaking",
                    "playerToSend": playerToSend
                }
            )


        if (messageType == "enterMatchmakingRoom"):
            tournamentData = data["tournamentData"]
            players = tournamentData['players']

            waitingPlayers.append(self.user_username)
            # print("Players", players)
            # print("waitingPlayers", waitingPlayers)
            all_players_found = all(player in waitingPlayers for player in players)
            tournament = find_tournament_by_id(tournamentData["tournamentId"])
            # print("all_players_found", all_players_found)
            if all_players_found:
                # print("all players found")
                tournament.turn += 1
                for player in players:
                    waitingPlayers.remove(player)

                # message pour avertir dans le chat
                # await self.channel_layer.group_send(
                # self.room_group_name, {"type": "chat.message" ,"messageType": "tournament", "message": "", "owner": self.user_username, "time": datetime.now().astimezone(fuseau).strftime("%H:%M:%S")}
                # )

                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "send.newTurn",
                        "messageType": "newTurn",
                        "tournamentData": tournamentData,
                        "players": players
                    }
                )

        if (messageType == "endMatchGame"):
            tournamentData = data["tournamentData"]
            match = data["match"]
            # print("match", match)
            final_score = str(data["leftPlayerScore"]) + ":" + str(data["rightPlayerScore"]);
            match["score"] = final_score
            winner = await get_user_profile(data["winner"])
            player_one = await get_user_profile(match["player1"])
            player_two = await get_user_profile(match["player2"])
            await update_game(player_one, player_two, winner, final_score)

            tournament = find_tournament_by_id(tournamentData["tournamentId"])
            for m in tournament.matchs:
                if m["matchNumber"] == match["matchNumber"]:
                    m["score"] = final_score


            if (data["leftPlayerScore"] == 10):
                tournament.playersInGame.remove(match["player2"])
                tournament.players.remove(match["player2"])
            elif (data["rightPlayerScore"] == 10):
                tournament.playersInGame.remove(match["player1"])
                tournament.players.remove(match["player1"])
            tournament.playersInGame.remove(data["winner"])

            # if (len(tournament.players) == 1):
            #     tournament.players = []

            # print("playersInGame", tournament.playersInGame)

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "send.match",
                    "messageType": "updateScore",
                    "match": match,
                    "tournamentData": tournament.to_json(),
                }
            )

        if (messageType == "endTournament"):
            tournamentData = data["tournamentData"]
            tournament = find_tournament_by_id(tournamentData["tournamentId"])

            TournamentSessions.remove(tournament)


        if (messageType == "updateMatchmaking"):
            tournamentData = data["tournamentData"]
            # matchs = tournamentData["matchs"]
            # print("tournamentData", tournamentData)
            # players = tournamentData['players']
            # print("players", players)

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "send.matchmaking",
                    "messageType": "updateMatchmaking",
                    "tournamentData": tournamentData,
                }
            )

        if (messageType == "updateMatchsInTurn"):
            # print("match", match)
            # players = [match["player1"], match["player2"]]
            tournamentData = data["tournamentData"]

            tournament = find_tournament_by_id(tournamentData["tournamentId"])

            tournament.matchs = tournamentData["matchs"]

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "send.matchsInTurn",
                    "messageType": "updateMatchsInTurn",
                    "tournamentData": tournament.to_json(),
                }
            )

        if (messageType == "creatorPeerTournament"):
            tournamentData = data["tournamentData"]
            tournament = find_tournament_by_id(tournamentData["tournamentId"])
            match = data["match"]
            peerCreator = data["peerCreator"]
            players = [match["player1"], match["player2"]]

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "send.creatorPeerTournament",
                    "messageType": "creatorPeerTournament",
                    "players": players,
                    "tournamentData": tournamentData,
                    "peerCreator": peerCreator,
                    "match": match
                }
            )

        if (messageType == "playerPeerTournament"):
            tournamentData = data["tournamentData"]
            tournament = find_tournament_by_id(tournamentData["tournamentId"])
            match = data["match"]
            playerPeer = data["playerPeer"]
            players = [match["player1"], match["player2"]]

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "send.playerPeerTournament",
                    "messageType": "PlayerPeerTournament",
                    "players": players,
                    "tournamentData": tournamentData,
                    "playerPeer": playerPeer,
                    "match": match
                }
            )

        if (messageType == "inviteSession"):
            if (search_player_in_game(self.user_username)):
                # print(self.user_username, "deja dans une room")
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "confirm.invite",
                        "messageType": "confirmInvite",
                        "confirme": "false",
                        "username": self.user_username,
                        "players": self.user_username,
                        "CreatorPeerId" : data["peerId"]
                    }
                )
            else:
                level = data["level"]
                creatorPeer = data["peerId"]
                sessionId = str(uuid.uuid4())

                session = Session(sessionId, self.user_username, creatorPeer, "true", level, data["paddleHeight"])
                session.add_player(self.user_username)

                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "confirm.invite",
                        "messageType": "confirmInvite",
                        "confirme": "true",
                        "username": self.user_username,
                        "creatorPeer": creatorPeer,
                        "players": self.user_username,
                        "sessionId": sessionId,
                    }
                )

                # print("Session created :", sessionId, self.user_username, level,)

                sessions.append(session)


                usernameInvited = data["usernameInvited"]

                await self.channel_layer.group_send(
                    self.room_group_name, { "type": "invite.Session" ,"messageType": "inviteSession", "session": session.to_json(), "usernameInvited": usernameInvited}
                )


        if (messageType == "denyInvit"):
            session = data["session"]

            session = find_session_by_id(session["sessionId"])

            remove_player_sessions(session.creator_username)

            await self.channel_layer.group_send(
                self.room_group_name, { "type": "deny.invit" ,"messageType": "denyInvit", "session": session.to_json()}
            )


        if (messageType == "createSession"):
            if (search_player_in_game(self.user_username)):
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "confirm.creat",
                        "messageType": "confirmCreat",
                        "confirme": "false",
                        "username": self.user_username,
                        "players": self.user_username,
                        "CreatorPeerId" : data["peerId"]
                    }
                )

            else:
                level = data["level"]
                creatorPeer = data["peerId"]
                sessionId = str(uuid.uuid4())

                session = Session(sessionId, self.user_username, creatorPeer, "false", level, data["paddleHeight"])
                session.add_player(self.user_username)

                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "confirm.creat",
                        "messageType": "confirmCreat",
                        "confirme": "true",
                        "username": self.user_username,
                        "creatorPeer": creatorPeer,
                        "players": self.user_username,
                        "sessionId": sessionId,
                    }
                )

                # print("Session created :", sessionId, self.user_username, level,)

                sessions.append(session)


                sessions_json = convert_list_json()

                await self.channel_layer.group_send(
                    self.room_group_name, { "type": "session.list" ,"messageType": "updateSessions", "session": sessions_json}
                )

        if(messageType == "playerPeer"):
            sessionId = data["sessionId"]
            session = find_session_by_id(sessionId)
            # print("session", session)
            # session_json = convert_list_json()
            await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "send.playerPeer",
                        "messageType": "receivePlayerPeer",
                        "players": session.players,
                        "playerPeer": data["playerPeer"],
                        "sessionCreator": session.creator_username,
                        "session" : session.to_json()
                    }
                )

        if(messageType == "join"):

            if (search_player_in_game(self.user_username)):
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "confirm.creat",
                        "messageType": "confirmJoin",
                        "confirme": "false",
                        "username": self.user_username,
                        "players": self.user_username,
                    }
                )

            else:
                session = find_session_by_id(data["sessionId"])
                session.add_player(self.user_username)


                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "confirm_join",
                        "messageType": "confirmJoin",
                        "confirme": "true",
                        "username": self.user_username,
                        "peerCreator": session.peer_creator,
                        "players": session.players,
                        "sessionUsername": session.creator_username,
                        "sessionId": session.session_id
                    }
                )

        if (messageType == "cancelInvit"):
            usernameInvited = data["usernameInvited"]

            await self.channel_layer.group_send(
                self.room_group_name, { "type": "cancel.invit" ,"messageType": "cancelInvit", "usernameInvited": usernameInvited}
            )

        if (messageType == "quitSession"):
            remove_player_sessions(self.user_username)
            sessions_json = convert_list_json()
            await self.channel_layer.group_send(
                self.room_group_name, { "type": "session.list" ,"messageType": "updateSessions", "session": sessions_json}
            )

        if (messageType == "quitTournamentSession"):
            remove_player_tournament(self.user_username)
            tournament_json = convert_tournament_json()
            await self.channel_layer.group_send(
                self.room_group_name, { "type": "tournamentSession_list" ,"messageType": "updateTournamentSessions", "tournamentSession": tournament_json}
            )

        if (messageType == "surrenderSession"):
            session = search_player_in_game(self.user_username)
            # session.players.remove(self.user_username)
            await self.channel_layer.group_send(
                self.room_group_name, { "type": "session.surrender" ,"messageType": messageType, "session": session.to_json(), "username" : self.user_username}
            )

        if (messageType == "endGame") :
            session = search_player_in_game(data["sessionUsername"])
            final_score = str(data["leftPlayerScore"]) + ":" + str(data["rightPlayerScore"]);
            winner = await get_user_profile(data.get("winner"))
            player_one = await get_user_profile(session.creator_username)
            player_two = await get_user_profile(session.players[1])
            await update_game(player_one, player_two, winner, final_score)
            sessions.remove(session)

        if (messageType == "surrenderTournamentSession") :
            tournament = search_player_in_tournament(self.user_username)
            # print("tournament players", tournament.players)
            tournament.playersInGame.remove(self.user_username)
            tournament.players.remove(self.user_username)
            #print("tournament players after", tournament.players)
            players = tournament.players

            await self.channel_layer.group_send(
                self.room_group_name, { "type": "tournament.surrender" ,"messageType": messageType, "tournament": tournament.to_json(), "username" : self.user_username, "players": players}
            )



    async def deny_invit(self, event):
        session = event.get("session")

        if session :
            # Send message to WebSocket
            if session["CreatorUsername"] == self.user_username:
                await self.send(text_data=json.dumps({"messageType" : "denyInvit"}))

    async def cancel_invit(self, event):
        usernameInvited = event.get("usernameInvited")
        # Send message to WebSocket
        if usernameInvited == self.user_username:
            await self.send(text_data=json.dumps({"messageType" : "cancelInvit"}))

    async def send_getMatchmaking(self, event):
        message_type = event.get("messageType")
        # print("tournamentData", tournamentData)

        tournament = search_player_in_tournament(self.user_username)

        playerToSend = event.get("playerToSend")

        if playerToSend == self.user_username:
                # print("send_newTurn")
            await self.send(text_data=json.dumps({
                'messageType': message_type,
                'tournamentData': tournament.to_json()
            }))


    async def send_newPeerTurn(self, event):
        message_type = event.get("messageType")
        tournamentData = event.get("tournament")
        playerToSend = event.get("playerToSend")

        if playerToSend == self.user_username:
                await self.send(text_data=json.dumps({
                    'messageType': message_type,
                    'tournamentData': tournamentData
                }))


    async def send_matchsInTurn(self, event):
        message_type = event.get("messageType")
        tournamentData = event.get("tournamentData")
        players = tournamentData["players"]

        for player in players:
            if player == self.user_username:
                # print("send_newTurn")
                await self.send(text_data=json.dumps({
                    'messageType': message_type,
                    'tournamentData': tournamentData,
            }))


    async def tournament_surrender(self, event):
        messageType = event.get("messageType")
        tournament = event.get("tournament")
        players = event.get("players")
        username = event.get("username")

        # Send message to WebSocket
        for player in players:
            if player == self.user_username and username != self.user_username:
                await self.send(text_data=json.dumps({"messageType" : messageType, "surrendedPlayer": username, "tournamentData": tournament}))


    async def send_newTurn(self, event):
        message_type = event.get("messageType")
        tournamentData = event.get("tournamentData")
        players = tournamentData["players"]

        tournament = find_tournament_by_id(tournamentData["tournamentId"])

        for player in players:
            if player == self.user_username:
                await self.send(text_data=json.dumps({
                    'messageType': message_type,
                    'tournamentData': tournament.to_json()
                }))
                await self.send(text_data=json.dumps({"type": "chat.message" ,"messageType": "tournament", "message": "", "owner": self.user_username, "time": datetime.now().astimezone(fuseau).strftime("%H:%M:%S")}))

    async def session_surrender(self, event):
        messageType = event.get("messageType")
        session = event.get("session")
        players = session["players"]
        username = event.get("username")
        # Send message to WebSocket
        for player in players:
            if player == self.user_username and username != self.user_username:
                await self.send(text_data=json.dumps({"messageType" : messageType, "session": session}))

    async def chat_session(self, event):
        players = event.get("players")
        messageType = event["messageType"]
        message = event["message"]
        owner = event["owner"]
        time = event["time"]
        # Send message to WebSocket
        for player in players:
            if player == self.user_username:
                await self.send(text_data=json.dumps({"message": message, "owner": owner, "messageType" : messageType, "time": time}))

    async def confirm_creat(self, event):
        message_type = event.get("messageType")
        confirme = event.get("confirme")

        player = event.get("players")
        if player == self.user_username:
            await self.send(text_data=json.dumps({
                'messageType': message_type,
                'username': event.get("username"),
                'confirme': confirme,
                'sessionId': event.get("sessionId"),
            }))

    async def confirm_invite(self, event):
        message_type = event.get("messageType")
        confirme = event.get("confirme")

        player = event.get("players")
        if player == self.user_username:
            await self.send(text_data=json.dumps({
                'messageType': message_type,
                'username': event.get("username"),
                'confirme': confirme,
                'sessionId': event.get("sessionId"),
            }))

    async def confirmTournament_creat(self, event):
        message_type = event.get("messageType")
        confirme = event.get("confirme")
        tournament_data = event.get("tournamentData")
        players = event.get("players")

        for player in players:
            if player == self.user_username:
                await self.send(text_data=json.dumps({
                    'messageType': message_type,
                    'username': event.get("username"),
                    'confirme': confirme,
                    'tournamentData': tournament_data,
                }))

    async def confirmTournament_join(self, event):
        message_type = event.get("messageType")
        confirme = event.get("confirme")
        players = event.get("players")
        tournament_data = event.get("tournamentData")

        for player in players:
            if player == self.user_username and player == players[-1]:
                await self.send(text_data=json.dumps({
                    'messageType': message_type,
                    'confirme': confirme,
                    'tournamentData': tournament_data,
                }))

    async def send_matchmaking(self, event):
        message_type = event.get("messageType")
        tournamentData = event.get("tournamentData")
        # print("tournamentData", tournamentData)
        # print("players", players)
        playerToSend = event.get("playerToSend")

        tournament = find_tournament_by_id(tournamentData["tournamentId"])

        tournament.matchs = tournamentData["matchs"]

        if playerToSend == self.user_username:
            await self.send(text_data=json.dumps({
                'messageType': message_type,
                'tournamentData': tournament.to_json()
            }))

    async def send_match(self, event):
        message_type = event.get("messageType")
        match = event.get("match")

        tournamentData = event.get("tournamentData")
        players = tournamentData["players"]

        for player in players:
            if player == self.user_username:
                await self.send(text_data=json.dumps({
                    'messageType': message_type,
                    'match': match,
                    'tournamentData': tournamentData
                }))


    async def send_creatorPeerTournament(self, event):
        message_type = event.get("messageType")
        players = event.get("players")
        tournamentData = event.get("tournamentData")
        peerCreator = event.get("peerCreator")
        match = event.get("match")

        for player in players:
            # print("player", player)
            if player == self.user_username and player == match["player2"]:
                # print("send_creatorPeerTournament to", match["player2"])
                await self.send(text_data=json.dumps({
                    'messageType': message_type,
                    'players': players,
                    'tournamentData': tournamentData,
                    'peerCreator': peerCreator,
                    'match': match
                }))

    async def send_playerPeerTournament(self, event):
        message_type = event.get("messageType")
        players = event.get("players")
        tournamentData = event.get("tournamentData")
        playerPeer = event.get("playerPeer")
        match = event.get("match")
        tournament = find_tournament_by_id(tournamentData["tournamentId"])
        for player in players:
            if player == self.user_username and player == match["player1"]:
                difficulty = ""
                if tournamentData["level"] == 3:
                    difficulty = "easy"
                elif tournamentData["level"] == 5:
                    difficulty = "medium"
                elif tournamentData["level"] == 7:
                    difficulty = "hard"
                gameData = {
                    "player_one" : players[0],
                    "player_two" : players[1],
                    "game_type" : "tournament",
                    "difficulty" : difficulty,
                }
                serializer = serializers.GameSerializer(data=gameData, partial=True)
                # if get_game(players[0], players[1], winner=None) is None:
                if serializer.is_valid():
                   player_one = await get_user_profile(gameData.get("player_one"))
                   player_two = await get_user_profile(gameData.get("player_two"))
                   serializer.validated_data['player_one'] = player_one
                   serializer.validated_data['player_two'] = player_two
                   await update_user_profile(player_one)
                   await update_user_profile(player_two)
                   await create_game(serializer, player_one, player_two)
                   if players[0] not in tournament.playersInGame and players[1] not in tournament.playersInGame:
                       tournament.playersInGame.append(players[0])
                       tournament.playersInGame.append(players[1])

                await self.send(text_data=json.dumps({
                    'messageType': message_type,
                    'players': players,
                    'tournamentData': tournamentData,
                    'playerPeer': playerPeer,
                    'match': match
                }))


    async def confirm_join(self, event):
        message_type = event.get("messageType")
        confirme = event.get("confirme")
        sessionCreator = event.get("sessionUsername")
        sessionId = event.get("sessionId")

        players = event.get("players")
        session = find_session_by_id(sessionId)

        for player in players:
            if player == self.user_username and player != sessionCreator:
                difficulty = ""
                if session.level == 3:
                    difficulty = "easy"
                elif session.level == 5:
                    difficulty = "medium"
                elif session.level == 7:
                    difficulty = "hard"
                gameData = {
                    "player_one" : sessionCreator,
                    "player_two" : players[1],
                    "game_type" : "pvp",
                    "difficulty" : difficulty,
                }
                serializer = serializers.GameSerializer(data=gameData, partial=True)
                if serializer.is_valid():
                    player_one = await get_user_profile(gameData.get("player_one"))
                    player_two = await get_user_profile(gameData.get("player_two"))
                    serializer.validated_data['player_one'] = player_one
                    serializer.validated_data['player_two'] = player_two
                    await update_user_profile(player_one)
                    await update_user_profile(player_two)
                    await create_game(serializer, player_one, player_two)

                await self.send(text_data=json.dumps({
                    'messageType': message_type,
                    'username': event.get("username"),
                    'confirme': confirme,
                    'peerCreator': event.get("peerCreator"),
                    'sessionId': sessionId,
                }))


    async def send_playerPeer(self, event):
        message_type = event.get("messageType")
        players = event.get("players")
        playerPeer = event.get("playerPeer")
        sessionCreator = event.get("sessionCreator")
        session = event.get("session")

        for player in players:
            if player == self.user_username and player == sessionCreator:
                await self.send(text_data=json.dumps({
                    'messageType': message_type,
                    'playerPeer': playerPeer,
                    'player' : players[1],
                    'session' : session
                }))

    async def invite_Session(self, event):
       messageType = event["messageType"]
       usernameInvited = event["usernameInvited"]
       # Send message to WebSocket
       if usernameInvited == self.user_username:
           await self.send(text_data=json.dumps({"messageType" : messageType, "session": event["session"]}))


    async def waiting_tournament(self, event):
        message_type = event.get("messageType")
        tournamentData = event.get("tournamentData")
        user = event.get("user")

        if user == self.user_username:
            await self.send(text_data=json.dumps({
                'messageType': message_type,
                'tournamentData': tournamentData
            }))

    async def session_list(self, event):
        messageType = event["messageType"]

        # Send message to WebSocket
        await self.send(text_data=json.dumps({"messageType" : messageType, "sessions": event["session"]}))

    async def tournamentSession_list(self, event):
        messageType = event["messageType"]

        # Send message to WebSocket
        await self.send(text_data=json.dumps({"messageType" : messageType, "tournamentSessions": event["tournamentSession"]}))

    # Receive message from room group
    async def chat_message(self, event):
        messageType = event["messageType"]
        message = event["message"]
        owner = event["owner"]
        time = event["time"]
        # Send message to WebSocket
        await self.send(text_data=json.dumps({"message": message, "owner": owner, "messageType" : messageType, "time": time}))

    async def chat_disconnect(self, event):
        # Envoyer un message pour informer que l'utilisateur s'est déconnecté
        owner = event["user_username"]
        time = event["time"]
        await self.send(
            text_data=json.dumps(
                {"message": "", "owner": owner, "messageType": "offline", "time": time}
            )
        )





def search_player_in_tournament(username):
    for tournament in TournamentSessions:
        for player in tournament.players:
            if player == username:
                return tournament
    return False

def search_player_in_tournament_match(username, tournament):
    for match in tournament.matchs:
        if match["player1"] == username or match["player2"] == username:
            return match
    return False


def find_tournament_by_id(tournament_id):
    for tournament in TournamentSessions:
        if tournament.tournament_id == tournament_id:
            return tournament
    return None

def search_player_in_game(username):
    for session in sessions:
        for player in session.players:
            if player == username:
                return session
    return False

def remove_player_sessions(username):
    for session in sessions:
        for player in session.players:
            if player == username:
                session.remove_player(username)
                if not session.players:
                    sessions.remove(session)
    return False

def remove_player_tournament(username):
    for tournament in TournamentSessions:
        for player in tournament.players:
            if player == username:
                tournament.remove_player(username)
                if not tournament.players:
                    TournamentSessions.remove(tournament)
    return False


def find_session_by_id(session_id):
    for session in sessions:
        if session.session_id == session_id:
            return session
    return None


def convert_list_json():
    sessions_json = []
    for session in sessions:
        sessions_json.append(session.to_json())
    sessions_json2 = json.dumps(sessions_json)
    return(sessions_json2)

def convert_tournament_json():
    tournament_json = []
    for tournament in TournamentSessions:
        tournament_json.append(tournament.to_json())
    tournament_json2 = json.dumps(tournament_json)
    return(tournament_json2)

@sync_to_async
def update_status(user_profile, status):
    if status == "offline":
        user_profile.is_connected = False
    elif status == "online":
        user_profile.is_connected = True
    user_profile.save()

@sync_to_async
def get_user_profile(username):
    return UserProfile.objects.get(user__username=username)

@sync_to_async
def update_user_profile(player):
    player.is_ingame = True
    player.save()


@sync_to_async
def create_game(serializer, player_one, player_two):
    findGame = Game.objects.filter(player_one=player_one, player_two=player_two, winner=None).first()
    if findGame is None:
        serializer.save()
    # else:
    #     serializer = serializers.GameSerializer(findGame, data=serializer.validated_data, partial=True)
    # serializer.save()

@sync_to_async
def get_game(player_one, player_two):
    return Game.objects.filter(player_one=player_one, player_two=player_two, winner=None).first()

@sync_to_async
def update_game(player_one, player_two, winner, final_score):
    findGame = Game.objects.filter(player_one=player_one, player_two=player_two, winner=None).first()
    findGame.winner = winner
    findGame.final_score = final_score
    findGame.save()
    player_one.games_id.add(findGame.id)
    player_two.games_id.add(findGame.id)
    if winner == player_one:
        player_one.win += 1
        player_two.lose += 1
    else :
        player_two.win += 1
        player_one.lose += 1
    player_two.is_ingame = False
    player_one.is_ingame = False
    player_one.save()
    player_two.save()


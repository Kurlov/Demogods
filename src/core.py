import asyncio
import websockets
import json
import requests
from uuid import uuid4
import pygame
from pygame.locals import *

#screen = pygame.display.set_mode((1024, 768))

class Client:

    def __init__(self):
        self.match_id = 0
        self.player_id = str(uuid4())
        self.cards_left = 0
        self.creatures = 0
        self.hand_cards = 0

    @asyncio.coroutine
    def __searching_match(self):
        print("Start searching... ")
        print("Player id: {}".format(self.player_id))
        websocket = yield from websockets.connect('ws://192.168.1.6:9000/findMatch/' + self.player_id)
        match_id_json = yield from websocket.recv()
        print("< {}".format(match_id_json))
        data = json.loads(match_id_json)
        self.match_id = data['matchId']
        print("Match id: {}".format(self.match_id))

    def search_match(self):
        asyncio.get_event_loop().run_until_complete(self.__searching_match())

    def get_start_cards(self):
        url = 'http://192.168.1.6:9000/gameState'
        payload = {'matchId': self.match_id, 'userId': self.player_id}
        headers = {'Content-type': 'application/json'}
        r = requests.post(url, data=json.dumps(payload), headers=headers)
        data = r.json()
        self.cards_left = data['remainingCards']
        print("{} cards left".format(self.cards_left))
        self.hand_cards = data['cards']
        print("{} hand_cards".format(self.hand_cards))
        self.creatures = data['creatures']
        print("creatures: {}".format(self.creatures))

if __name__ == '__main__':
    client = Client()
    client.search_match()
    client.get_start_cards()
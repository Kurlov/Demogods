import asyncio
import websockets
import json
import pygame
from pygame.locals import *

#screen = pygame.display.set_mode((1024, 768))

@asyncio.coroutine
def search_match():
    websocket = yield from websockets.connect('ws://192.168.1.6:9000/findMatch/123')
    match_id = yield from websocket.recv()
    print("< {}".format(match_id))

asyncio.get_event_loop().run_until_complete(search_match())
import pygame
import sys
import os

class Player():


    
    def __init__ (self, health, cards, num, surface):
        self.health = health
        
        if (num > 1) or (num < 0):
            print("invalid player number")
        else:
            self.num = num
        
        self.surface = surface
        self.picts = []
        self.set_cards(cards)

    def draw(self):
        self.surface.fill((255, 255, 0))
        print(len(self.picts))
        for card_num in range(len(self.picts)):
            card_pict = self.picts[card_num]
            card_pict = pygame.transform.scale(card_pict, (100, 150))
            
            x0, y0, x1, y1 = card_pict.get_rect()
            rect = x0 + card_num * (y1 - y0), y0, x1 + card_num * (y1 - y0), y1
               
            self.surface.blit(card_pict, rect)
        
    def set_cards(self, cards_ids):
        picts = [] 
        self.cards = cards_ids
        for card in self.cards:
            try:
                picts.append(pygame.image.load(os.path.join(str(card) + ".png")))
            except IOError:
                print("card not found")
            except Exception as e:
                print("unknown error: " + str(e))
        self.picts = picts
        
     


class GUI():
    size = width, height  = 0, 0
    
    player0 = None
    player1 = None
    player_zone_size = 200
    
    player0_surface = None
    player1_surface = None
    player0_rect = None
    player1_rect = None
    screen = None
    
    def __init__(self, *args):
        pygame.init()
        if args:
            self.size = self.width, self.height = args
        else:
            self.size = self.width, self.height = 800, 600
        self.screen = pygame.display.set_mode(self.size)
        white = 255, 255, 255
        self.screen.fill(white)

        self.player0_surface = pygame.Surface((self.width, self.player_zone_size))
        self.player1_surface = pygame.Surface((self.width, self.player_zone_size))
        
        self.player0_rect = ((0, 0 * (self.height - self.player_zone_size), self.width, self.player_zone_size + 0 * self.height))
        self.player1_rect = ((0, 1 * (self.height - self.player_zone_size), self.width, self.player_zone_size + 1 * self.height))

        self.player0 = Player(100, ["e7d9cbc2-3f7f-4007-9c23-3f490d57dd11"], 0, self.player0_surface)
        self.player1 = Player(100, ["49a1d18e-a466-470b-88aa-589089e2d5d6"], 1, self.player1_surface)


    def loop(self):
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()
                                        
        self.player0.draw()
        self.player1.draw()
        self.screen.blit(self.player0_surface, self.player0_rect)
        self.screen.blit(self.player1_surface, self.player1_rect)
        pygame.display.flip()
            
            


if __name__ == "__main__":
    gui = GUI(1024, 768)
    gui.player0.set_cards(["e7d9cbc2-3f7f-4007-9c23-3f490d57dd11", "49a1d18e-a466-470b-88aa-589089e2d5d6"])
    gui.player1.set_cards(["49a1d18e-a466-470b-88aa-589089e2d5d6", "e7d9cbc2-3f7f-4007-9c23-3f490d57dd11"])
    a = []
    while True:
        gui.loop()
                     

import pygame
import sys

class Player():

    health = 0
    cards = []
    num = 0
    
    def __init__ (self, health, cards, num):
        self.health = health
        self.cards = cards
        if num > 1:
            raise ValueError("player number can be only 0 or 1")
        else:
            self.num = num

    def draw(self, surface):
        height = surface.get_height()
        width = surface.get_width()
        surface.fill((255, 255, 50*self.num), (0, self.num * (height - 50), width, 50 + self.num * height))



class GUI():
    size = width, height  = 0, 0
    player0 = Player(100, [], 0)
    player1 = Player(100, [], 1)

    def __init__(self, *args):
        pygame.init()
        if args:
            self.size = self.width, self.height = args
        else:
            self.size = self.width, self.height = 800, 600
        self.screen = pygame.display.set_mode(self.size)
        white = 255, 255, 255
        self.screen.fill(white)

        self.loop()

    def loop(self):
        while True:
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    sys.exit()

            self.player0.draw(self.screen)
            self.player1.draw(self.screen)
            pygame.display.flip()
            
            


if __name__ == "__main__":
    gui = GUI(1024, 768)
                     

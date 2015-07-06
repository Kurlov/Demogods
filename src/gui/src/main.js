var gui = new GUI();
gui.showMainMenu();
gui.setPlayer1Health(20);
gui.setPlayer2Health(30);
gui.addPlayer1Card('cyan_card', 'assets/cards/cyan.png');
gui.addPlayer2Card('yellow_card', 'assets/cards/yellow.png');
gui.addMonster('monster', 'assets/cards/monster.png', 15);
gui.addMonster('monster', 'assets/cards/monster.png', 30);
gui.deleteMonster('monster');
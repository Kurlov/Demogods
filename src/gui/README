GUI client module for DEMOGODS

Usage:
	* make sure you have imported all dependencies in your html file (see main.html for example);
	* create instance of GUI class via new GUI();
	
API:
	* showMainMenu() - shows main menu
	* play() - starts playing session. Parameters may be set both before and during this state. Currently called from main menu by big fancy "GO" button;
	* setPlayer1Health(health) - obviously, sets player 1 health level (seen in top-left corner). Parameter is number;
	* setPlayer2Health(health) - same for player 2;
	* addPlayer1Card(id, imageUrl) - adds a card to first players' deck. Id must be unique string(still no checking implemented though), imageUrl is used for dynamic image loads (not implemented too, so it doesn't matter right now); sprite defined by id, which should be the same as image id preloaded during preload state;
	* addPlayer2Card(id, imageUrl) - same for player 2;
	* addMonster(id, imageUrl, health) - like player's deck, adds item to playing table (center of the screen). Health is a number.
	* deletePlayer1Card(id) - deletes card from first players' deck, specified by id;
	* deletePlayer2Card(id) - same for the second player;
	* deleteMonster(id) - same for playing table;

Example can be seen in main.js file, starting from line 171.
API is obviously not complete, so place your feature request right on scrum table in "ToDo" section.
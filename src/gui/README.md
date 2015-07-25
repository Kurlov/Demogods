# GUI client module for DEMOGODS  
  
## Usage:  
* make sure you have imported all dependencies in your html file (see **main.html** for example);  
* create instance of GUI class via `new GUI();`
* you will need a webserver to run;
	 
## API:  
* `showMainMenu()` - shows main menu  
* `play()` - starts playing session. Parameters may be set both before and during this state. Currently called from main menu by big fancy "GO" button;  
* `setPlayer1Health(health)` - obviously, sets player 1 health level (seen in top-left corner). Parameter is number;  
* `setPlayer2Health(health)` - same for player 2;  
* `addPlayer1Card(id, imageUrl)` - adds a card to first players' deck. **Id** must be unique string(still no checking implemented though), **imageUrl** is used for dynamic image loads (not implemented too, so it doesn't matter right now); sprite defined by id, which should be the same as image id preloaded during preload state; returns Card object; 
* `addPlayer2Card(id, imageUrl)` - same for player 2;  
* `addMonster(id, imageUrl, health)` - like player's deck, adds item to playing table (center of the screen). **Health** is a number.  Returns Monster object;
* `deletePlayer1Card(id)` - deletes card from first players' deck, specified by **id**;  returns `true` if successful;
* `deletePlayer2Card(id)` - same for the second player;  
* `deleteMonster(id)` - same for playing table;  
* `attack(attacker, target)` - Manually trigger attack action. **attacker** and **target** are unique id's of items.
* `moveMonster(id, position)` - Move monster to a new position an a table. **id** is unique id, **position** is new position of Monster.
* `movePlayer1Card(id, position)` - same for player 1 cards.
* `movePlayer2Card(id, position)` - same for player 2 cards.
  
Example can be seen in **main.js** file;
API is obviously not complete, so place your feature request right on scrum table in "ToDo" section.  
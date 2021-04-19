# JavaUno-Online-Frontend
Card game - Multiplayer browser game - The Frontend

## Version
2.0 (2021, April, 19th)

## Description
The Frontend offers the view to the card game.\
It is an VUE.js-Application

## Backend
You can use your own backend or use my backend under: https://github.com/tomatenmark/JavaUno-Online-Backend.\
If you want to use your own backend, it has to offer the same api endpoints like my backend
(see README.md of my backend to get further information)

## Config
There are two files for config:
* /res/js/config-default.js: This file holds all the settings and its default values. It is part of the git repository
* /config.js: This file is used to override the settings of config-default.js. It is NOT part of the git repository
  * Example to override the siteHostname: config.siteHostname='javauno.example.com';

## tokenized-game-create
* Enable/Disable optional feature:\
  Enable/Disable feature in Backend (see: https://github.com/tomatenmark/JavaUno-Online-Backend/blob/master/readme.md#tokenized-game-create)
* visitors have to provide a valid token to create a game
* token is given by url (/?token=...)
* token validation happens in backend (see: https://github.com/tomatenmark/JavaUno-Online-Backend/blob/master/readme.md#tokenized-game-create)
* frontend with this feature (enabled or disable) is not compatible with backend without the feature

### Spielanleitung
./manual.pdf\
(For the combination of my backend and my frontend)

## License
* The Frontend source code is licensed under a CC-BY-SA-NC 4.0 Licence\
   * License: https://creativecommons.org/licenses/by-nc-sa/4.0/
   * Creator: Mark Herrmann (Nickname: Tomatenmark)
* For the card images all rights are reserved to Creators Denis Oster and Mark Herrmann (Nickname: Tomatenmark)
* For the original card game all rights are reserved to Mattel games.\
  (I have no co-operation with Mattel)
  
Notice: Mattel also offers an own free app to play UNO.
See my version as fun project

## changeLog

### Version 2.0
* New feature: built-in qr-scanner
* New optional feature: tokenized-game-create (see #tokenized-game-create) (limited downwards compatibility)
* New feature: You can switch the game to another device
* New feature: You can leave the running game (will become a bot)
* New feature: You can kick players (humans and bots, humans will become bots)
* New feature: You and the other players can commit to stop running game
* New feature: Chat 
* Security: use trusted base for urls in generated qr-codes
* Improvement: Beginning Player is selected randomly (or the last winner)
* Improvement: Last put card is visible in winner dialog
* UI improvement:
  * Icons on buttons
  * Smooth scrollbar
  * minor improvements

### Version 1.2
* improved ux: beautified processing animation
* bugfix: restore localStorage Items. could be removed while leaving another game

### Version 1.1
* improved ux
   * show myself in players list instead of only showing the others
   * reverse display order of players if playing direction is reversed
  
### Future Updates

#### Version 3.0 (maybe Winter 2021)
* ability to join to a running game
* end game when loser is known (not when winner is known)
* configurable ruleset
* win counting

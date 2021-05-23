# JavaUno-Online-Frontend
Card game - Multiplayer browser game - The Frontend\
This is the frontend for play.java-uno.de

## Version
2.0 (2021, May, 23rd)

## Description
The Frontend offers the view to the card game.\
It is an VUE.js-Application

## Backend
Backend is here: https://github.com/tomatenmark/JavaUno-Online-Backend.\

## Config
There are two files for config:
* /res/js/config-default.js: This file holds all the settings and its default values. It is part of the git repository
* /config.js: This file is used to override the settings of config-default.js. It is NOT part of the git repository
  * Example to override the siteHostname: config.siteHostname='javauno.example.com';

## tokenized-game-create
* Enable/Disable optional feature: Enable/Disable feature in Backend
* visitors have to provide a valid token to create a game
* token is given by url (/?token=...) and saved in localStorage
* token validation happens in backend
* see also: https://github.com/tomatenmark/JavaUno-Online-Backend -> readme.md

### Spielanleitung
./manual.docs\
(generated to https://play.java-uno.de/manual.pdf)

## License
* The Frontend source code is licensed under a CC-BY-SA-NC 4.0 Licence\
   * License: https://creativecommons.org/licenses/by-nc-sa/4.0/
   * Creator: Mark Herrmann (Nickname: Tomatenmark)
* For the card images all rights are reserved to Creators Denis Oster and Mark Herrmann (Nickname: Tomatenmark)

## Compatibility
* version 2.x frontend <-> version 1.x backend
  * NOT compatible
* Version 2.x backend <-> version 1.x frontend
  * Compatible, if tokenized-game-create feature is disabled
  * manual should be modified (due to randomized selection of the beginning player)

## changeLog

### Version 2.0
* Modified draw behaviour: Draw duties or penalties are drawn all at once
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
* Improvement: Fixed xss attack which was providing method to have empty name
* Improvement: native share for invitation link
* UI improvement:
  * New Card design
  * All actions are animated now (action transitions)
  * darken disabled cards so enabled (putable) cards will be determined sooner
  * coloring joker card with desired color instead of an indicating top bar
  * Added dark theme
  * Icons on buttons
  * Simplified invitation link copy and added native link sharing
  * Beautified none-touch-device scrollbars (Chrome & Firefox)
  * minor improvements

### Version 1.2
* improved ux: beautified processing animation
* bugfix: restore localStorage Items. could be removed while leaving another game

### Version 1.1
* improved ux
   * show myself in players list instead of only showing the others
   * reverse display order of players if playing direction is reversed

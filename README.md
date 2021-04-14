# JavaUno-Online-Frontend
Cardgame - Multiplayer browser game - The Frontend

## Version
1.2 (2020, July 11th)

## Description
The Frontend offers the view to the card game.\
It is an VUE.js-Application

## Backend
You can use your own backend or use my backend under: https://github.com/tomatenmark/JavaUno-Online-Backend.\
If you want to use your own backend, it has to offer the same api endpoints like my backend
(see README.md of my backend to get further information)

## Configuration
Following settings have to be made in config.js
* apiBase: the base url for the backend api ()
* vueDevToolsEnabled: set the value to true, to use vue devtools in browser, not recommended is production
* error messages from backend for no such game and no such player (used to handle out dated cookies)
    * noSuchGameMessage: error message for no such game
    * noSuchPlayerMessage: error message for no such player

### Spielanleitung
./manual.pdf

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

### Version 1.2
* improved ux: beautified processing animation
* bugfix: restore cookies. could be removed while leaving another game

### Version 1.1
* improved ux
   * show myself in players list instead of only showing the others
   * reverse display order of players if playing direction is reversed
# JavaUno-Online-Frontend
Cardgame - Multiplayer browser game - The Frontend

## Version
1.0_beta.6 (2020, Jan. 25th)

## Description
The Frontend offers the view to the card game.\
It is an VUE.js-Application

## Backend
You can use your own backend or use my backend under: https://github.com/tomatenmark/JavaUno-Online-Backend.\
If you want to use your own backend, it has to offer the same api endpoints like my backend
(see readme.md of my backend to get further information)

## Configuration
Following settings have to be made in config.js
* apiBase: the base url for the backend api ()
* vueDevToolsEnabled: set the value to true, to use vue devtools in browser, not recommended is production
* error messages from backend for no such game and no such player (used to handle out dated cookies)
    * noSuchGameMessage: error message for no such game
    * noSuchPlayerMessage: error message for no such player

## Live
You can play this version (my backend and my frontend) at:\
https://java-uno.de/

### Spielanleitung
https://java-uno.de/spielanleitung.pdf

## License
* The Frontend source code is licensed under a CC-BY-SA-NC 4.0 Licence\
   * License: https://creativecommons.org/licenses/by-nc-sa/4.0/
   * Creator: Mark Herrmann (Nickname: Tomatenmark)
* For the card images all rights are reserved to Creator Denis Oster
* For the original card game all rights are reserved to Mattel games.\
  (I have no co-operation with Mattel)
  
Notice: Mattel also offers an own free app to play UNO.
See my version as fun project

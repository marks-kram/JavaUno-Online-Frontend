# JavaUno-Online-Frontend
Card game - Multiplayer browser game - The Frontend

## Version
1.2 (2020, July, 11th)

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

### Version 1.2
* improved ux: beautified processing animation
* bugfix: restore localStorage Items. could be removed while leaving another game

### Version 1.1
* improved ux
   * show myself in players list instead of only showing the others
   * reverse display order of players if playing direction is reversed

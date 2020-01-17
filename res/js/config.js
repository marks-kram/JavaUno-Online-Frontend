const config = {
    //base url for the backend api
    apiBase: '/api',

    //enable (true) or disable (false) devTools for Vue.js in Browser-DevTools - false is recommended for production
    vueDevToolsEnabled: true,

    //length of the final countdown before the next turn starts (countdown in backend, unit: milliseconds)
    backendCountdownLength: 3000,

    //error messages from backend for no such game and no such player (used to handle out dated cookies)
    noSuchGameMessage: 'failure: de.markherrmann.javauno.exceptions.IllegalArgumentException: There is no such game.',
    noSuchPlayerMessage: 'failure: de.markherrmann.javauno.exceptions.IllegalArgumentException: There is no such player in this game.'
};





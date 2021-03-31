const config = {
    //base url for the backend api
    apiBase: '/api',

    //enable (true) or disable (false) devTools for Vue.js in Browser-DevTools - false is recommended for production
    vueDevToolsEnabled: true,

    //error messages from backend for no such game and no such player (used to handle out dated cookies)
    noSuchGameMessage: 'failure: de.markherrmann.javauno.exceptions.IllegalArgumentException: There is no such game.',
    noSuchPlayerMessage: 'failure: de.markherrmann.javauno.exceptions.IllegalArgumentException: There is no such player in this game.',
};
const features = {
    //tokenized-game-create: see README.md for feature-description.
    enableTokenizedGameCreate: false, //can be overridden by /features.js (features.enableTokenizedGameCreate=true/false)
    invalidTokenMessage: 'failure: de.markherrmann.javauno.exceptions.InvalidTokenException: Invalid Token provided.',
    fileReadErrorMessage: 'failure: de.markherrmann.javauno.exceptions.FileReadException: Could not read token file in backend. Please try again later or report this error to me.'
}





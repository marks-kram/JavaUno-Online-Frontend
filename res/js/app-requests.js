const noSuchGameMessage = 'failure: de.markherrmann.javauno.exceptions.IllegalArgumentException: There is no such game.';

function handleRequestSuccess(response) {
    app.callback(response.data);
}

function handleRequestError(response) {
    if(response.data.message !== undefined){
        console.error("Request-Error: " + response.data.message);
        if(response.data.message === noSuchGameMessage){
            app.currentView = reset();
        }
    } else {
        console.error("Request-Error: " + response);
    }
}

function doGetRequest(path, callback){
    app.callback = callback;
    app.$http.get(apiBase+path).then(handleRequestSuccess, handleRequestError);
}

function doPostRequest(path, data, callback){
    app.callback = callback;
    app.$http.post(apiBase+path, JSON.stringify(data)).then(handleRequestSuccess, handleRequestError);
}

function doDeleteRequest(path, callback){
    app.callback = callback;
    app.$http.delete(apiBase+path).then(handleRequestSuccess, handleRequestError);
}

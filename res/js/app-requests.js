const noSuchGameMessage = config.noSuchGameMessage;
const noSuchPlayerMessage = config.noSuchPlayerMessage;

let rI;

function handleRequestSuccess(response, callback) {
    if(response.url.indexOf('say-uno') >= 0){
        sayUnoRequestRunning = false;
        app.$cookies.remove('sayUno');
    }
    callback(response.data);
    if(callback === setGameState || callback === setGameStateWithoutPlayer){
        stopProcessingAnimation();
    }
    clearInterval(rI);
}

function handleRequestError(response) {
    if(response.status === 502){
        app.currentView = 'backend-down';
        rI = setInterval('self.location.reload()', 5000);
    }
    if(response.url.indexOf('say-uno') >= 0){
        setTimeout('sayUno()', 1000)
    } else {
        stopProcessingAnimation();
    }
    if(response.data.message !== undefined){
        console.error("Request-Error: " + response.data.message);
        if(response.data.message === noSuchGameMessage){
            reset();
        }
        if(response.data.message === noSuchPlayerMessage){
            app.$cookies.remove('playerUuid');
            self.location.reload();
        }
    } else {
        console.error("Request-Error: responseObject: " + JSON.stringify(response));
    }
}

function doGetRequest(path, callback){
    startProcessingAnimation();
    app.$http.get(config.apiBase+path).then(function (response) {
        handleRequestSuccess(response, callback);
    }, handleRequestError);
}

function doPostRequest(path, data, callback){
    startProcessingAnimation();
    app.$http.post(config.apiBase+path, JSON.stringify(data)).then(function (response) {
        handleRequestSuccess(response, callback);
    }, handleRequestError);
}

function doDeleteRequest(path, callback){
    startProcessingAnimation();
    app.$http.delete(config.apiBase+path).then(function (response) {
        handleRequestSuccess(response, callback);
    }, handleRequestError);
}

function sleep(){
    return new Promise(resolve => setTimeout(resolve, 50));
}
const noSuchGameMessage = config.noSuchGameMessage;
const noSuchPlayerMessage = config.noSuchPlayerMessage;

let rI;

function handleRequestSuccess(response, callback) {
    callback(response.data);
    if(callback === setGameState || callback === setGameStateWithoutPlayer){
        stopProcessAnimation();
    }
    clearInterval(rI);
}

function handleRequestError(response) {
    if(response.status === 502){
        app.currentView = 'backend-down';
        rI = setInterval('self.location.reload()', 5000);
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
    stopProcessAnimation();
}

function doGetRequest(path, callback){
    startProcessAnimation();
    app.$http.get(config.apiBase+path).then(function (response) {
        handleRequestSuccess(response, callback);
    }, handleRequestError);
}

function doPostRequest(path, data, callback){
    startProcessAnimation();
    app.$http.post(config.apiBase+path, JSON.stringify(data)).then(function (response) {
        handleRequestSuccess(response, callback);
    }, handleRequestError);
}

function doDeleteRequest(path, callback){
    startProcessAnimation();
    app.$http.delete(config.apiBase+path).then(function (response) {
        handleRequestSuccess(response, callback);
    }, handleRequestError);
}

let pA;
let process = false;

function startProcessAnimation(){
    if(!process){
        process = true;
        pA = setTimeout('document.getElementById(\'process\').style.display = \'block\'', 500);
    }
}

function stopProcessAnimation(){
    if(process){
        process = false;
        clearTimeout(pA);
        document.getElementById('process').style.display = 'none';
    }

}

function sleep(){
    return new Promise(resolve => setTimeout(resolve, 50));
}

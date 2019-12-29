function handleRequestSuccess(response) {
    if(response.data.success){
        app.callback(response.data);
    } else {
        console.error("Error. Response: " + response.data.message);
    }
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

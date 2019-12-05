var juApp = new Vue({
    el: '#ju-app',
    data: {
        apiBase: '/api',
        currentView: 'start',
        name: '',
        state: {
            success: true,
            message: 'success',
            game: null,
            players: [],
            cards: []
        },
        message: 'Hallo Vue.js!'
    }
});
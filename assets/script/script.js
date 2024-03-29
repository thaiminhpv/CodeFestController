console.warn("%cMade by DxqDz", "color:yellow");

const $ = document.getElementById.bind(document);

loader();
function loader() {
    window.addEventListener('load', () => {
        document.querySelector('.main').classList.remove('disable');
    
        document.querySelector('.page__loader').classList.add('fade--out');
        setTimeout(() => {
            document.querySelector('.page__loader').style.display = 'none';
        }, 300);
    });
}

var joinGameForm = $('join-game');
var gameDriver = $('game-driver');
var apiServer = ''
var gameId = '';
var playerId = '';
var joinGameBtn = $("join-game-btn");
var reconnectBtn = $("reconnect-btn");
var quitGameBtn = $("quit-game-btn");
var socket;

joinGameBtn.onclick = joinGame;
function joinGame() {
    apiServer= $("host").value;
    gameId = $("gameID").value;
    playerId = $("playerID").value;
    DisableForm();
    socket = io.connect(apiServer, {
        reconnect: false, 
        transports: ['websocket']
    });
    setSocketAtt();
    gamePadHandler()
}

reconnectBtn.onclick = reconnect;
function reconnect() {
    socket.close();
    socket = io.connect(apiServer, {
        reconnect: false, 
        transports: ['websocket']
    });
    setSocketAtt();
    gamePadHandler()
}

quitGameBtn.onclick = quitGame;
function quitGame() {
    socket.close();
    EnableForm();
}

window.addEventListener("keydown", (e) => {
    let keyPressed = e.which
    if (keyPressed === 13 && !joinGameForm.classList.contains("disable")) {
        e.preventDefault();
        joinGame();
    }

    if (keyPressed === 82 && !gameDriver.classList.contains("disable")) {
        e.preventDefault();
        reconnect();
    }

    if ((keyPressed === 81 || keyPressed === 27) && !gameDriver.classList.contains("disable")) {
        e.preventDefault();
        quitGame();
    }
});

function DisableForm() {
    joinGameForm.classList.add("fade-out");
    setTimeout(() => {
        joinGameForm.classList.add("disable");
        joinGameForm.classList.remove("fade-out");
        gameDriver.classList.remove("disable");
    }, 300)
}

function EnableForm() {
    gameDriver.classList.add("fade-out");
    setTimeout(() => {
        gameDriver.classList.add("disable");
        gameDriver.classList.remove("fade-out");
        joinGameForm.classList.add("fade-in");
        joinGameForm.classList.remove("disable");
        setTimeout(() => {
            joinGameForm.classList.remove("fade-in");
        }, 300)
    }, 300)
}

// Connecto to API App server

function setSocketAtt() {
    let connectedStatus = $('connected-status');
    let socketStatus = $('socket-status');
    let joinGameStatus = $('joingame-status');
    let ticktackGameStatus = $('ticktack-status');

    socket.on('connect', () => {
        console.log('on connect');
        Object.assign(socketStatus.style, {
            color: "var(--green)",
            textShadow: "var(--neon-green)"
        });
        Object.assign(connectedStatus.style, {
            color: "var(--green)",
            textShadow: "var(--neon-green)"
        });
        console.log('[Socket] connected to server');    
        // API-1a
        socket.emit('join game', {
            game_id: gameId,
            player_id: playerId 
        });
    });
    
    socket.on('disconnect', () => {
        console.warn('[Socket] disconnected');
        Object.assign(socketStatus.style, {
            color: "var(--red)",
            textShadow: "var(--neon-red)"
        });
        Object.assign(connectedStatus.style, {
            color: "var(--red)",
            textShadow: "var(--neon-red)"
        });
    });
    
    socket.on('connect_failed', () => {
        console.warn('[Socket] connect_failed');
        Object.assign(socketStatus.style, {
            color: "var(--red)",
            textShadow: "var(--neon-red)"
        });
        Object.assign(connectedStatus.style, {
            color: "var(--red)",
            textShadow: "var(--neon-red)"
        });
    });
    
    socket.on('error', (err) => {
        console.error('[Socket] error ', err);
        Object.assign(socketStatus.style, {
            color: "var(--red)",
            textShadow: "var(--neon-red)"
        });
        Object.assign(connectedStatus.style, {
            color: "var(--red)",
            textShadow: "var(--neon-red)"
        });
    });
    
    
    // SOCKET EVENTS
    
    // API-1b
    socket.on('join game', (res) => {
        console.log('[Socket] join-game responsed', res);
        Object.assign(joinGameStatus.style, {
            color: "var(--green)",
            textShadow: "var(--neon-green)"
        });
    });
    
    //API-2
    socket.on('ticktack player', (res) => {
        console.info('> ticktack');
        console.log('[Socket] ticktack-player responsed, map_info: ', res.map_info);
        Object.assign(ticktackGameStatus.style, {
            color: "var(--green)",
            textShadow: "var(--neon-green)"
        });
    });
    
    socket.on('drive player', (res) => {
        console.log('[Socket] drive-player responsed, res: ', res);
    });    
}

function gamePadHandler() {
    window.onkeydown = (e) => {
        let keyPressed = e.which;
        let currKey;
        switch (keyPressed) {
            case 65: case 37:
                currKey = $("ctrl--left");
                keyPressDown(currKey);
                break;
            case 68: case 39:
                currKey = $("ctrl--right");
                keyPressDown(currKey);
                break;
            case 87: case 38:
                currKey = $("ctrl--up");
                keyPressDown(currKey);
                break;
            case 83: case 40:
                currKey = $("ctrl--down");
                keyPressDown(currKey);
                break;
            case 32: case 13:
                currKey = $("ctrl--bomb");
                keyPressDown(currKey);
                break;
        }
    };
    
    window.onkeyup = (e) => {
        let keyPressed = e.which;
        let currKey;
        switch (keyPressed) {
            case 65: case 37:
                currKey = $("ctrl--left");
                keyPressUp(currKey);
                break;
            case 68: case 39:
                currKey = $("ctrl--right");
                keyPressUp(currKey);
                break;
            case 87: case 38:
                currKey = $("ctrl--up");
                keyPressUp(currKey);
                break;
            case 83: case 40:
                currKey = $("ctrl--down");
                keyPressUp(currKey);
                break;
            case 32: case 13:
                currKey = $("ctrl--bomb");
                keyPressUp(currKey);
                break;
        }
    };
    
    function keyPressDown(currKey) {
        currKey.click();
        currKey.classList.add('active');
    }
    
    function keyPressUp(currKey) {
        currKey.classList.remove('active');
    }
}
// Precondition: You need to require socket.io.js in your html page
// Reference link https://socket.io
// <script src="socket.io.js"></script>

window.addEventListener('load', () => {
    document.querySelector('.main').classList.remove('disable');

    document.querySelector('.page__loader').classList.add('fade--out');
    setTimeout(() => {
        document.querySelector('.page__loader').style.display = 'none';
    }, 600);
});

// const gameId = '422d6910-5520-41db-9de8-f653699fc3b7';
// const playerId = 'player2-xxx';
// const apiServer = 'http://jsclub.me:5000';

var apiServer = ''
var gameId = '';
var playerId = '';
var joinGameBtn = document.getElementById("join-game-btn");
var reconnectBtn = document.getElementById("reconnect-btn");
var quitGameBtn = document.getElementById("quit-game-btn");
var socket;

joinGameBtn.addEventListener("click", () => {
    apiServer= document.getElementById("host").value;
    gameId = document.getElementById("gameID").value;
    playerId = document.getElementById("playerID").value;
    DisableForm();
    socket = io.connect(apiServer, { reconnect: false, transports: ['websocket'] });
    setSocketAtt();
});

reconnectBtn.addEventListener("click", () => {
    socket.close();
    socket = io.connect(apiServer, { reconnect: false, transports: ['websocket'] });
    setSocketAtt();
})

quitGameBtn.addEventListener("click", () => {
    socket.close();
    EnableForm();
})

function DisableForm() {
    document.getElementById("join-game").classList.add("fade-out");
    setTimeout(function() {
        document.getElementById("join-game").classList.add("disable");
        document.getElementById("join-game").classList.remove("fade-out");
        document.getElementById("game-driver").classList.remove("disable");
    }, 500)
}

function EnableForm() {
    document.getElementById("game-driver").classList.add("fade-out");
    setTimeout(function() {
        document.getElementById("game-driver").classList.add("disable");
        document.getElementById("join-game").classList.add("fade-in");
        document.getElementById("game-driver").classList.remove("fade-out");
        document.getElementById("join-game").classList.remove("disable");
        setTimeout(() => {
            document.getElementById("join-game").classList.remove("fade-in");
        }, 500)
    }, 500)
}

// Connecto to API App server


// LISTEN SOCKET.IO EVENTS

// It it required to emit `join channel` event every time connection is happened
function setSocketAtt() {
    socket.on('connect', () => {
        console.log('on connect');
        document.getElementById('connected-status').style.textShadow = "var(--neon-green)";
        document.getElementById('socket-status').style.textShadow = "var(--neon-green)";
        console.log('[Socket] connected to server');    
        // API-1a
        socket.emit('join game', { game_id: gameId, player_id: playerId });
    });
    
    socket.on('disconnect', () => {
        console.warn('[Socket] disconnected');
        document.getElementById('socket-status').style.textShadow = "var(--neon-red)";
        document.getElementById('connected-status').style.textShadow = "var(--neon-red)";
    });
    
    socket.on('connect_failed', () => {
        console.warn('[Socket] connect_failed');
        document.getElementById('connected-status').style.textShadow = "var(--neon-red)";
        document.getElementById('socket-status').style.textShadow = "var(--neon-red)";
    });
    
    
    socket.on('error', (err) => {
        console.error('[Socket] error ', err);
        document.getElementById('connected-status').style.textShadow = "var(--neon-red)";
        document.getElementById('socket-status').style.textShadow = "var(--neon-red)";
    });
    
    
    // SOCKET EVENTS
    
    // API-1b
    socket.on('join game', (res) => {
        console.log('[Socket] join-game responsed', res);
        document.getElementById('joingame-status').style.textShadow = "var(--neon-green)";
    });
    
    //API-2
    socket.on('ticktack player', (res) => {
        console.info('> ticktack');
        console.log('[Socket] ticktack-player responsed, map_info: ', res.map_info);
        document.getElementById('ticktack-status').style.textShadow = "var(--neon-green)";
    });
    
    // API-3a
    // socket.emit('drive player', { direction: '111b333222' });
    //API-3b
    socket.on('drive player', (res) => {
        console.log('[Socket] drive-player responsed, res: ', res);
    });    
}
var btnLeftPressed = document.getElementById("ctrl--left");
var btnRightPressed = document.getElementById("ctrl--right");
var btnUpPressed = document.getElementById("ctrl--up");
var btnDownPressed = document.getElementById("ctrl--down");
var btnBombPressed = document.getElementById("ctrl--bomb");
window.onkeypress = (e) => {
    const key = String.fromCharCode(e.which);
    switch (key) {
        case "a":
            btnLeftPressed.click();
            keyPress(btnLeftPressed);
            break;
        case "d":
            btnRightPressed.click();
            keyPress(btnRightPressed);
            break;
        case "w":
            btnUpPressed.click();
            keyPress(btnUpPressed);
            break;
        case "s":
            btnDownPressed.click();
            keyPress(btnDownPressed);
            break;
        case " ":
            btnBombPressed.click();
            keyPress(btnBombPressed);
            break;
    }
    
    function keyPress(keyPressed) {
        keyPressed.classList.add('active');
        setTimeout(function() {
            keyPressed.classList.remove('active');
        }, 150)
    }
};

function CheckScreenOrientation() {
    if(screen.availHeight > screen.availWidth){
        alert("Please use Landscape!");
    }
}
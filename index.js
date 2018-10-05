const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, {});
var players = {};
var playerCount = 0;

app.use(express.static("./public"));

app.get("*", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

server.listen(process.env.PORT || 8080, function() {
    console.log("Let's fight!-- 8080");
});

io.on("connection", function(socket) {
    let playerNum; //to be populated with num
    const vals = Object.values(players);

    console.log(`new user with socketId ${socket.id} connected`);

    //PURPOSE: LIMIT TO 4 PLAYERS; SAVE PLAYER SLOTS ON PLAYER EXIT
    const player1 = vals.find(p => p.playerNo == 1);
    if (!player1) {
        playerNum = 1;
    } else {
        const player2 = vals.find(p => p.playerNo == 2);
        if (!player2) {
            playerNum = 2;
        } else {
            const player3 = vals.find(p => p.playerNo == 3);
            if (!player3) {
                playerNum = 3;
            } else {
                const player4 = vals.find(p => p.playerNo == 4);
                if (!player4) playerNum = 4;
            }
        }
    }
    if (!playerNum) {
        console.log("no player to add!");
    } else {
        players[socket.id] = {
            x: Math.floor(Math.random() * 360) + 150,
            y: 80,
            playerNo: playerNum,
            socketId: socket.id
        };
    }
    // console.log("PLAYERS-------------->", players);

    // send the players object to the new player
    socket.emit("currentPlayers", players);
    // update all other players of the new player
    socket.broadcast.emit("newPlayer", players[socket.id]);

    socket.on("disconnect", function() {
        delete players[socket.id];
        playerCount -= 1;
        console.log(`user disconnected: ${socket.id}`);
        // console.log("PLAYERS REMAINING ----------->", players);
        io.emit("userDisconnect", socket.id);
    });
    socket.on("playerMovement", function(movementData) {
        // console.log(movementData);
        players[socket.id].x = movementData.x;
        players[socket.id].y = movementData.y;
        players[socket.id].data = movementData.data;
        // console.log("moving", players[socket.id]);
        socket.broadcast.emit("playerMoved", players[socket.id]);
    });
    socket.on("playerDamaged", function(damagedPlayer) {
        var enemySocketId = damagedPlayer.enemyData.socketId;
        players[enemySocketId].data = damagedPlayer.enemyData;
        console.log(damagedPlayer);
        // console.log("moving", players[socket.id]);
        io.sockets.emit("damagedPlayer", players[enemySocketId]);
    });
    socket.on("playerDeath", function(player) {
        // console.log("player which died->", player);
        players[socket.id].data.lives = player.lives;
        io.sockets.emit("playerDied", players[socket.id]);
    });
    socket.on("allPlayerData", function(allPlayers) {
        io.sockets.emit("allPlayers", allPlayers);
    });
    socket.on("gameOver", function(player) {
        console.log(player);
        io.sockets.emit("gameEnd", player);
    });
});

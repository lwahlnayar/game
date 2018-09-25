const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, { origins: "localhost:8080" });
var players = {};

app.use(express.static("./public"));

app.get("*", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

server.listen(8080, function() {
    console.log("Let's fight!-- 8080");
});

io.on("connection", function(socket) {
    console.log("a user connected");
    players[socket.id] = {
        rotation: 0,
        x: Math.floor(Math.random() * 700) + 50,
        y: Math.floor(Math.random() * 500) + 50,
        playerId: socket.id,
        team: Math.floor(Math.random() * 2) == 0 ? "red" : "blue"
    };

    console.log(players);
    // send the players object to the new player
    socket.emit("currentPlayers", players);
    // update all other players of the new player
    socket.broadcast.emit("newPlayer", players[socket.id]);

    socket.on("disconnect", function() {
        console.log("user disconnected");
        // remove this player from our players object
        delete players[socket.id];
        // emit a message to all players to remove this player
        io.emit("disconnect", socket.id);
    });
});

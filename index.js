const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, { origins: "localhost:8080" });

app.use(express.static("./public"));

app.get("*", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

server.listen(8080, function() {
    console.log("Let's fight!-- 8080");
});

io.on("connection", function(socket) {
    console.log("a user connected");
    socket.on("disconnect", function() {
        console.log("user disconnected");
    });
});

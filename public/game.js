var config = {
    type: Phaser.AUTO,
    width: 640,
    height: 360,
    pixelArt: true,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var borderLimitTop = -100;
var borderLimitLeft = -100;
var borderLimitRight = game.config.width + 100;
var borderLimitBot = game.config.height + 100;

function preload() {
    this.load.image("sky", "assets/sky2.jpg");
    this.load.image("ground", "assets/platform.png");
    this.load.spritesheet("player1", "assets/player1.png", {
        frameWidth: 80,
        frameHeight: 110
    });
    this.load.spritesheet("player2", "assets/player2.png", {
        frameWidth: 80,
        frameHeight: 110
    });
    this.load.spritesheet("player3", "assets/player3.png", {
        frameWidth: 80,
        frameHeight: 110
    });
    this.load.spritesheet("player4", "assets/player4.png", {
        frameWidth: 80,
        frameHeight: 110
    });
}

///////////////////////////////////////////////////////////////////////////////////
/////////////////////////////// C R E A T E ///////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

function create() {
    var self = this;
    players = this.physics.add.group();
    this.socket = io(); //SOCKET ACTIVATED

    //ADD IMAGES, BACKGROUND, COLLIDERS
    this.add.image(320, 180, "sky");
    platforms = this.physics.add.staticGroup();
    platforms
        .create(320, 290, "ground")
        .setScale(1.2)
        .refreshBody();
    self.physics.add.collider(players, platforms);

    //SOCKET LISTENERS
    this.socket.on("currentPlayers", function(players) {
        console.log(players);
        Object.keys(players).forEach(function(id) {
            setTimeout(function() {
                addPlayer(self, players[id]);
            }, 50);
        });
    });
    this.socket.on("newPlayer", function(playerInfo) {
        console.log(playerInfo);
        setTimeout(function() {
            addOtherPlayers(self, playerInfo);
        }, 50);
    });
    this.socket.on("playerMoved", function(playerInfo) {
        console.log("player moving!!", playerInfo.x);
        players.getChildren().forEach(function(p) {
            if (playerInfo.socketId == p.data.list.socketId) {
                p.setPosition(playerInfo.x, playerInfo.y);
            }
        });
    });
    this.socket.on("userDisconnect", function(disconectedUserId) {
        console.log("user disconnects!", disconectedUserId);
        players.getChildren().forEach(function(p) {
            if (disconectedUserId == p.data.list.socketId) {
                p.destroy();
            }
        });
    });

    //SCORE TEXTS
    scoreTextP1 = this.add.text(40, 16, "P1: 5", {
        fontSize: "22px",
        fill: "#000"
    });
    scoreTextP2 = this.add.text(200, 16, "P2: 0", {
        fontSize: "22px",
        fill: "#000"
    });
    scoreTextP3 = this.add.text(360, 16, "P3: 0", {
        fontSize: "22px",
        fill: "#000"
    });
    scoreTextP4 = this.add.text(520, 16, "P4: 0", {
        fontSize: "22px",
        fill: "#000"
    });

    //Animations PLAYER 1
    this.anims.create({
        key: "neutralRight",
        frames: [
            "player1",
            {
                key: "player1",
                frame: 0
            }
        ],
        frameRate: 18
    });

    this.anims.create({
        key: "neutralLeft",
        frames: [
            "player1",
            {
                key: "player1",
                frame: 16
            }
        ],
        frameRate: 18
    });

    this.anims.create({
        key: "leftRun",
        frames: this.anims.generateFrameNumbers("player1", {
            start: 16,
            end: 19
        }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: "leftPunch",
        frames: this.anims.generateFrameNumbers("player1", {
            start: 20,
            end: 22
        }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: "leftKick",
        frames: this.anims.generateFrameNumbers("player1", {
            start: 26,
            end: 28
        }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: "leftJump",
        frames: this.anims.generateFrameNumbers("player1", {
            start: 30,
            end: 30
        }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: "leftJumpB",
        frames: this.anims.generateFrameNumbers("player1", {
            start: 30,
            end: 30
        }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: "leftHurt",
        frames: this.anims.generateFrameNumbers("player1", {
            start: 24,
            end: 25
        }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: "rightRun",
        frames: this.anims.generateFrameNumbers("player1", {
            start: 3,
            end: 6
        }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: "rightPunch",
        frames: this.anims.generateFrameNumbers("player1", {
            start: 0,
            end: 2
        }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: "rightKick",
        frames: this.anims.generateFrameNumbers("player1", {
            start: 10,
            end: 12
        }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: "rightJump",
        frames: this.anims.generateFrameNumbers("player1", {
            start: 8,
            end: 8
        }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: "rightJumpB",
        frames: this.anims.generateFrameNumbers("player1", {
            start: 8,
            end: 8
        }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: "rightHurt",
        frames: this.anims.generateFrameNumbers("player1", {
            start: 13,
            end: 14
        }),
        frameRate: 10,
        repeat: -1
    });
    //ANIMATIONS PLAYER 2
    this.anims.create({
        key: "neutralRight2",
        frames: [
            "player2",
            {
                key: "player2",
                frame: 0
            }
        ],
        frameRate: 18
    });

    this.anims.create({
        key: "neutralLeft2",
        frames: [
            "player2",
            {
                key: "player2",
                frame: 16
            }
        ],
        frameRate: 18
    });

    this.anims.create({
        key: "leftRun2",
        frames: this.anims.generateFrameNumbers("player2", {
            start: 16,
            end: 19
        }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: "leftPunch2",
        frames: this.anims.generateFrameNumbers("player2", {
            start: 20,
            end: 22
        }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: "leftKick2",
        frames: this.anims.generateFrameNumbers("player2", {
            start: 26,
            end: 28
        }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: "leftJump2",
        frames: this.anims.generateFrameNumbers("player2", {
            start: 30,
            end: 30
        }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: "leftJumpB2",
        frames: this.anims.generateFrameNumbers("player2", {
            start: 30,
            end: 30
        }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: "leftHurt2",
        frames: this.anims.generateFrameNumbers("player2", {
            start: 24,
            end: 25
        }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: "rightRun2",
        frames: this.anims.generateFrameNumbers("player2", {
            start: 3,
            end: 6
        }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: "rightPunch2",
        frames: this.anims.generateFrameNumbers("player2", {
            start: 0,
            end: 2
        }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: "rightKick2",
        frames: this.anims.generateFrameNumbers("player2", {
            start: 10,
            end: 12
        }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: "rightJump2",
        frames: this.anims.generateFrameNumbers("player2", {
            start: 8,
            end: 8
        }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: "rightJumpB2",
        frames: this.anims.generateFrameNumbers("player2", {
            start: 8,
            end: 8
        }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: "rightHurt2",
        frames: this.anims.generateFrameNumbers("player2", {
            start: 13,
            end: 14
        }),
        frameRate: 10,
        repeat: -1
    });

    // DOUBLE JUMP
    function jumpListener(player) {
        if (player.body.touching.down) {
            player.setData({ jump: 2 });
        }
        if (player.body.touching.none) {
            player.setData({ jump: 1 });
        }
        self.input.keyboard.on(
            "keydown_UP",
            function(event) {
                player.setGravityY(300);
                if (player.body.touching.down) {
                    player.setData({ jump: 1 });
                    player.setVelocityY(-400);
                } else if (
                    player.body.touching.none &&
                    player.data.list.jump == 1
                ) {
                    player.setData({ jump: 0 });
                    player.setVelocityY(-300);
                }
            },
            this
        );
    } //CLOSE DOUBLE JUMP

    //PUNCH FUNCTION
    function punchListener(player) {
        self.input.keyboard.on("keydown_A", function(event) {
            if (player.data.list.movedRight) {
                player.setData({ actionRight: true, actionLeft: false });
            } else if (player.data.list.movedLeft) {
                player.setData({ actionRight: false, actionLeft: true });
            }
        });
    } //CLOSE PUNCH FUNCTION

    //KICK function

    function kickListener(player) {
        self.input.keyboard.on("keydown_D", function(event) {
            if (player.data.list.movedRight) {
                player.setData({ actionRight: true, actionLeft: false });
            } else if (player.data.list.movedLeft) {
                player.setData({ actionRight: false, actionLeft: true });
            }
        });
    } //CLOSE KICK FUNCTION

    setTimeout(function() {
        if (
            typeof player1 != "undefined" &&
            self.socket.id == player1.data.list.socketId
        ) {
            jumpListener(player1);
            punchListener(player1);
            kickListener(player1);
        } else if (
            typeof player2 != "undefined" &&
            self.socket.id == player2.data.list.socketId
        ) {
            jumpListener(player2);
            punchListener(player2);
            kickListener(player2);
        } else if (
            typeof player3 != "undefined" &&
            self.socket.id == player3.data.list.socketId
        ) {
            jumpListener(player3);
            punchListener(player3);
            kickListener(player3);
        } else if (
            typeof player4 != "undefined" &&
            self.socket.id == player4.data.list.socketId
        ) {
            jumpListener(player4);
            punchListener(player4);
            kickListener(player4);
        }
    }, 80);
} //CLOSES CREATE FUNCTION

///////////////////////////////////////////////////////////////////////////////////
/////////////////////////////// U P D A T E ///////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

function update() {
    var self = this;
    cursors = this.input.keyboard.createCursorKeys();
    this.key_A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.key_D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    //CHARACTER MOVEMENTS
    function characterMove(player) {
        if (
            (cursors.left.isDown && self.key_A.isDown) ||
            (cursors.right.isDown && self.key_A.isDown)
        ) {
            if (player.data.list.actionLeft) {
                player.setData({
                    actionRight: false,
                    actionLeft: true
                });
                player.anims.play("leftPunch", true);
            } else if (player.data.list.actionRight) {
                player.setData({
                    actionRight: true,
                    actionLeft: false
                });
                player.anims.play("rightPunch", true);
            }
        } else if (
            (cursors.left.isDown && self.key_D.isDown) ||
            (cursors.right.isDown && self.key_D.isDown)
        ) {
            if (player.data.list.actionLeft) {
                player.setData({
                    actionRight: false,
                    actionLeft: true
                });
                player.anims.play("leftKick", true);
            } else if (player.data.list.actionRight) {
                player.setData({
                    actionRight: true,
                    actionLeft: false
                });
                player.anims.play("rightKick", true);
            }
        } else if (cursors.left.isDown) {
            if (player.body.touching.down) {
                player.setVelocityX(-200);
                player.anims.play("leftRun", true);
            } else {
                player.setVelocityX(-200);
                player.anims.play("leftJump", true);
            }
            player.setData({ movedRight: false });
            player.setData({ movedLeft: true });
        } else if (cursors.right.isDown) {
            if (player.body.touching.down) {
                player.setVelocityX(200);
                player.anims.play("rightRun", true);
            } else {
                player.setVelocityX(200);
                player.anims.play("rightJump", true);
            }
            player.setData({ movedLeft: false });
            player.setData({ movedRight: true });
        } else if (self.key_A.isDown) {
            if (player.data.list.actionLeft) {
                player.setData({ actionRight: false, actionLeft: true });
                player.anims.play("leftPunch", true);
                if (!cursors.right.isDown || !cursors.left.isDown) {
                    player.setVelocityX(0);
                }
            } else if (player.data.list.actionRight) {
                player.setData({ actionRight: true, actionLeft: false });
                player.anims.play("rightPunch", true);
                if (!cursors.right.isDown || !cursors.left.isDown) {
                    player.setVelocityX(0);
                }
            }
        } else if (self.key_D.isDown) {
            if (player.data.list.actionLeft) {
                player.setData({ actionRight: false, actionLeft: true });
                player.anims.play("leftKick", true);
                if (!cursors.right.isDown || !cursors.left.isDown) {
                    player.setVelocityX(0);
                }
            } else if (player.data.list.actionRight) {
                player.setData({ actionRight: true, actionLeft: false });
                player.anims.play("rightKick", true);
                if (!cursors.right.isDown || !cursors.left.isDown) {
                    player.setVelocityX(0);
                }
            }
        } else {
            player.setVelocityX(0);
            if (player.data.list.movedRight) {
                if (!player.body.touching.down) {
                    player.anims.play("rightJumpB");
                } else {
                    player.anims.play("neutralRight");
                }
            } else {
                if (!player.body.touching.down) {
                    player.anims.play("leftJumpB");
                } else {
                    player.anims.play("neutralLeft");
                }
            }
        }
    }
    function characterMove2(player) {
        if (
            (cursors.left.isDown && self.key_A.isDown) ||
            (cursors.right.isDown && self.key_A.isDown)
        ) {
            if (player.data.list.actionLeft) {
                player.setData({
                    actionRight: false,
                    actionLeft: true
                });
                player.anims.play("leftPunch2", true);
            } else if (player.data.list.actionRight) {
                player.setData({
                    actionRight: true,
                    actionLeft: false
                });
                player.anims.play("rightPunch2", true);
            }
        } else if (
            (cursors.left.isDown && self.key_D.isDown) ||
            (cursors.right.isDown && self.key_D.isDown)
        ) {
            if (player.data.list.actionLeft) {
                player.setData({
                    actionRight: false,
                    actionLeft: true
                });
                player.anims.play("leftKick2", true);
            } else if (player.data.list.actionRight) {
                player.setData({
                    actionRight: true,
                    actionLeft: false
                });
                player.anims.play("rightKick2", true);
            }
        } else if (cursors.left.isDown) {
            if (player.body.touching.down) {
                player.setVelocityX(-200);
                player.anims.play("leftRun2", true);
            } else {
                player.setVelocityX(-200);
                player.anims.play("leftJump2", true);
            }
            player.setData({ movedRight: false });
            player.setData({ movedLeft: true });
        } else if (cursors.right.isDown) {
            if (player.body.touching.down) {
                player.setVelocityX(200);
                player.anims.play("rightRun2", true);
            } else {
                player.setVelocityX(200);
                player.anims.play("rightJump2", true);
            }
            player.setData({ movedLeft: false });
            player.setData({ movedRight: true });
        } else if (self.key_A.isDown) {
            if (player.data.list.actionLeft) {
                player.setData({ actionRight: false, actionLeft: true });
                player.anims.play("leftPunch2", true);
                if (!cursors.right.isDown || !cursors.left.isDown) {
                    player.setVelocityX(0);
                }
            } else if (player.data.list.actionRight) {
                player.setData({ actionRight: true, actionLeft: false });
                player.anims.play("rightPunch2", true);
                if (!cursors.right.isDown || !cursors.left.isDown) {
                    player.setVelocityX(0);
                }
            }
        } else if (self.key_D.isDown) {
            if (player.data.list.actionLeft) {
                player.setData({ actionRight: false, actionLeft: true });
                player.anims.play("leftKick2", true);
                if (!cursors.right.isDown || !cursors.left.isDown) {
                    player.setVelocityX(0);
                }
            } else if (player.data.list.actionRight) {
                player.setData({ actionRight: true, actionLeft: false });
                player.anims.play("rightKick2", true);
                if (!cursors.right.isDown || !cursors.left.isDown) {
                    player.setVelocityX(0);
                }
            }
        } else {
            player.setVelocityX(0);
            if (player.data.list.movedRight) {
                if (!player.body.touching.down) {
                    player.anims.play("rightJumpB2");
                } else {
                    player.anims.play("neutralRight2");
                }
            } else {
                if (!player.body.touching.down) {
                    player.anims.play("leftJumpB2");
                } else {
                    player.anims.play("neutralLeft2");
                }
            }
        }
    }

    function characterMove3(player) {
        if (
            (cursors.left.isDown && self.key_A.isDown) ||
            (cursors.right.isDown && self.key_A.isDown)
        ) {
            if (player.data.list.actionLeft) {
                player.setData({
                    actionRight: false,
                    actionLeft: true
                });
                player.anims.play("leftPunch2", true);
            } else if (player.data.list.actionRight) {
                player.setData({
                    actionRight: true,
                    actionLeft: false
                });
                player.anims.play("rightPunch2", true);
            }
        } else if (
            (cursors.left.isDown && self.key_D.isDown) ||
            (cursors.right.isDown && self.key_D.isDown)
        ) {
            if (player.data.list.actionLeft) {
                player.setData({
                    actionRight: false,
                    actionLeft: true
                });
                player.anims.play("leftKick2", true);
            } else if (player.data.list.actionRight) {
                player.setData({
                    actionRight: true,
                    actionLeft: false
                });
                player.anims.play("rightKick2", true);
            }
        } else if (cursors.left.isDown) {
            if (player.body.touching.down) {
                player.setVelocityX(-200);
                player.anims.play("leftRun2", true);
            } else {
                player.setVelocityX(-200);
                player.anims.play("leftJump2", true);
            }
            player.setData({ movedRight: false });
            player.setData({ movedLeft: true });
        } else if (cursors.right.isDown) {
            if (player.body.touching.down) {
                player.setVelocityX(200);
                player.anims.play("rightRun2", true);
            } else {
                player.setVelocityX(200);
                player.anims.play("rightJump2", true);
            }
            player.setData({ movedLeft: false });
            player.setData({ movedRight: true });
        } else if (self.key_A.isDown) {
            if (player.data.list.actionLeft) {
                player.setData({ actionRight: false, actionLeft: true });
                player.anims.play("leftPunch2", true);
                if (!cursors.right.isDown || !cursors.left.isDown) {
                    player.setVelocityX(0);
                }
            } else if (player.data.list.actionRight) {
                player.setData({ actionRight: true, actionLeft: false });
                player.anims.play("rightPunch2", true);
                if (!cursors.right.isDown || !cursors.left.isDown) {
                    player.setVelocityX(0);
                }
            }
        } else if (self.key_D.isDown) {
            if (player.data.list.actionLeft) {
                player.setData({ actionRight: false, actionLeft: true });
                player.anims.play("leftKick2", true);
                if (!cursors.right.isDown || !cursors.left.isDown) {
                    player.setVelocityX(0);
                }
            } else if (player.data.list.actionRight) {
                player.setData({ actionRight: true, actionLeft: false });
                player.anims.play("rightKick2", true);
                if (!cursors.right.isDown || !cursors.left.isDown) {
                    player.setVelocityX(0);
                }
            }
        } else {
            player.setVelocityX(0);
            if (player.data.list.movedRight) {
                if (!player.body.touching.down) {
                    player.anims.play("rightJumpB2");
                } else {
                    player.anims.play("neutralRight2");
                }
            } else {
                if (!player.body.touching.down) {
                    player.anims.play("leftJumpB2");
                } else {
                    player.anims.play("neutralLeft2");
                }
            }
        }
    }

    setTimeout(function() {
        if (
            typeof player1 != "undefined" &&
            self.socket.id == player1.data.list.socketId
        ) {
            var x = player1.x;
            var y = player1.y;
            characterMove(player1);
            deathCheck(player1);
            self.socket.emit("playerMovement", { x, y });
        } else if (
            typeof player2 != "undefined" &&
            self.socket.id == player2.data.list.socketId
        ) {
            var x = player2.x;
            var y = player2.y;
            characterMove2(player2);
            deathCheck(player2);
            self.socket.emit("playerMovement", { x, y });
        } else if (
            typeof player3 != "undefined" &&
            self.socket.id == player3.data.list.socketId
        ) {
            var x = player3.x;
            var y = player3.y;
            characterMove3(player3);
            deathCheck(player3);
            self.socket.emit("playerMovement", { x, y });
        } else if (
            typeof player4 != "undefined" &&
            self.socket.id == player4.data.list.socketId
        ) {
            var x = player4.x;
            var y = player4.y;
            characterMove4(player4);
            deathCheck(player4);
            self.socket.emit("playerMovement", { x, y });
        }
    }, 50);
}

///////////////////////////////////////////////////////////////////////////////////
/////////////////////////////// O T H E R S ///////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

function deathCheck(player) {
    var lives = player.data.list.lives;
    if (
        player.x > borderLimitRight ||
        player.x < borderLimitLeft ||
        player.y < borderLimitTop ||
        player.y > borderLimitBot
    ) {
        //if breaks limits, sets player alive status to false
        player.setData("alive", false);
        player.setVelocity(0, 10);
        player.setGravityY(10);
        player.setPosition(100, 100);
        //show death animation here
    }
    if (!player.data.list.alive) {
        lives--;
        console.log("player dies");
        player.setData({ alive: true, lives: lives });
        // livesP1--;
        scoreTextP1.setText("P1: " + player.data.list.lives);
    }
}

//ADD PLAYERS
function addPlayer(self, playerInfo) {
    var curPlayer = "player" + playerInfo.playerNo;
    window[curPlayer] = players
        .create(playerInfo.x, playerInfo.y, curPlayer)
        .setScale(0.5, 0.5)
        .setData({
            alive: true,
            lives: 5,
            jump: 0,
            movedLeft: false,
            movedRight: false,
            socketId: playerInfo.socketId,
            player: curPlayer
        });
    window[curPlayer].body.setGravityY(300);
    window[curPlayer].setBounce(0.2);
}
function addOtherPlayers(self, playerInfo) {
    var otherPlayer = "player" + playerInfo.playerNo;
    window[otherPlayer] = players
        .create(playerInfo.x, playerInfo.y, otherPlayer)
        .setScale(0.5, 0.5)
        .setData({
            alive: true,
            lives: 5,
            jump: 0,
            movedLeft: false,
            movedRight: false,
            socketId: playerInfo.socketId,
            player: otherPlayer
        });
    window[otherPlayer].body.setGravityY(300);
    window[otherPlayer].setBounce(0.2);
}

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
        frameWidth: 79.875,
        frameHeight: 89.75
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
        Object.keys(players).forEach(function(id) {
            if (id === self.socket.id) {
                setTimeout(function() {
                    addPlayer(self, players[id]);
                }, 100);
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

    //Animations
    this.anims.create({
        key: "neutralRight",
        frames: [{ key: "player1", frame: 0 }],
        frameRate: 18
    });

    this.anims.create({
        key: "neutralLeft",
        frames: [{ key: "player1", frame: 16 }],
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
        if (player1) {
            jumpListener(player1);
            punchListener(player1);
            kickListener(player1);
        }
    }, 200);
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
    setTimeout(function() {
        if (player1) {
            characterMove(player1);
            deathCheck(player1);
        }
    }, 200);
}

///////////////////////////////////////////////////////////////////////////////////
/////////////////////////////// O T H E R S ///////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

function resetPlayerPosition(player) {
    player.x = 100; //randomize later
    player.y = 100; //randomize later
}

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
        resetPlayerPosition(player);
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
            movedRight: false
        });
    window[curPlayer].body.setGravityY(300);
    window[curPlayer].setBounce(0.2);
}

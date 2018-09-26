(function() {
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
        this.load.spritesheet("rightplayer1", "assets/rightplayer1.png", {
            frameWidth: 80,
            frameHeight: 110
        });
        this.load.spritesheet("rightplayer2", "assets/rightplayer2.png", {
            frameWidth: 80,
            frameHeight: 110
        });
        this.load.spritesheet("rightplayer3", "assets/rightplayer3.png", {
            frameWidth: 80,
            frameHeight: 110
        });
        this.load.spritesheet("rightplayer4", "assets/rightplayer4.png", {
            frameWidth: 80,
            frameHeight: 110
        });
        //otherside
        this.load.spritesheet("leftplayer1", "assets/leftplayer1.png", {
            frameWidth: 80,
            frameHeight: 110
        });
        this.load.spritesheet("leftplayer2", "assets/leftplayer2.png", {
            frameWidth: 80,
            frameHeight: 110
        });
        this.load.spritesheet("leftplayer3", "assets/leftplayer3.png", {
            frameWidth: 80,
            frameHeight: 110
        });
        this.load.spritesheet("leftplayer4", "assets/leftplayer4.png", {
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
                setTimeout(function() {
                    console.log(
                        "player brackets id current plaeyers",
                        players[id]
                    );
                    addPlayers(self, players[id]);
                }, 50);
            });
        });
        this.socket.on("newPlayer", function(playerInfo) {
            setTimeout(function() {
                console.log(
                    "new player brackets id current plaeyers",
                    playerInfo
                );
                addPlayers(self, playerInfo);
            }, 50);
        });
        this.socket.on("playerMoved", function(playerInfo) {
            console.log("player moving!!", playerInfo);
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

        //ANIMATIONS PLAYER 1
        this.anims.create({
            key: "neutralRight",
            frames: [{ key: "rightplayer1", frame: 0 }],
            frameRate: 18
        });

        this.anims.create({
            key: "neutralLeft",
            frames: [{ key: "leftplayer1", frame: 8 }],
            frameRate: 18
        });

        this.anims.create({
            key: "leftRun",
            frames: [
                { key: "leftplayer1", frame: 10 },
                { key: "leftplayer1", frame: 16 }
            ],
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: "leftPunch",
            frames: [
                { key: "leftplayer1", frame: 12 },
                { key: "leftplayer1", frame: 8 }
            ],
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: "leftKick",
            frames: [
                { key: "leftplayer1", frame: 11 },
                { key: "leftplayer1", frame: 8 }
            ],
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: "leftJump",
            frames: [{ key: "leftplayer1", frame: 7 }],
            frameRate: 10,
            repeat: -1
        });
        // this.anims.create({
        //     key: "leftJumpB",
        //     frames: this.anims.generateFrameNumbers("player1", {
        //         start: 30,
        //         end: 30
        //     }),
        //     frameRate: 10,
        //     repeat: -1
        // });
        this.anims.create({
            key: "leftHurt",
            frames: [{ key: "leftplayer1", frame: 4 }],
            frameRate: 10
        });

        this.anims.create({
            key: "rightRun",
            frames: [
                { key: "rightplayer1", frame: 10 },
                { key: "rightplayer1", frame: 16 }
            ],
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: "rightPunch",
            frames: [
                { key: "rightplayer1", frame: 14 },
                { key: "rightplayer1", frame: 0 }
            ],
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: "rightKick",
            frames: [
                { key: "rightplayer1", frame: 15 },
                { key: "rightplayer1", frame: 16 }
            ],
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: "rightJump",
            frames: [{ key: "rightplayer1", frame: 1 }],
            frameRate: 10
        });
        this.anims.create({
            key: "JumpB",
            frames: [{ key: "rightplayer1", frame: 8 }],
            frameRate: 10
        });
        this.anims.create({
            key: "rightHurt",
            frames: [{ key: "rightplayer1", frame: 4 }],
            frameRate: 10
        });

        //////////////////////////////////////////////ANIMATIONS PLAYER 2
        this.anims.create({
            key: "neutralRight2",
            frames: [{ key: "rightplayer2", frame: 0 }],
            frameRate: 18
        });

        this.anims.create({
            key: "neutralLeft2",
            frames: [{ key: "leftplayer2", frame: 8 }],
            frameRate: 18
        });

        this.anims.create({
            key: "leftRun2",
            frames: [
                { key: "leftplayer2", frame: 16 },
                { key: "leftplayer2", frame: 10 }
            ],
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: "leftPunch2",
            frames: [
                { key: "leftplayer2", frame: 12 },
                { key: "leftplayer2", frame: 8 }
            ],
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: "leftKick2",
            frames: [
                { key: "leftplayer2", frame: 11 },
                { key: "leftplayer2", frame: 8 }
            ],
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: "leftJump2",
            frames: [{ key: "leftplayer2", frame: 7 }],
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: "leftHurt2",
            frames: [{ key: "leftplayer2", frame: 4 }],
            frameRate: 10
        });

        this.anims.create({
            key: "rightRun2",
            frames: [
                { key: "rightplayer2", frame: 10 },
                { key: "rightplayer2", frame: 16 }
            ],
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: "rightPunch2",
            frames: [
                { key: "rightplayer2", frame: 14 },
                { key: "rightplayer2", frame: 0 }
            ],
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: "rightKick2",
            frames: [
                { key: "rightplayer2", frame: 15 },
                { key: "rightplayer2", frame: 16 }
            ],
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: "rightJump2",
            frames: [{ key: "rightplayer2", frame: 1 }],
            frameRate: 10
        });
        this.anims.create({
            key: "JumpB2",
            frames: [{ key: "rightplayer2", frame: 8 }],
            frameRate: 10
        });
        this.anims.create({
            key: "rightHurt2",
            frames: [{ key: "rightplayer2", frame: 4 }],
            frameRate: 10
        });

        /////////////////////////////////////////////////////////////////////

        /////////////////////////////////////////////////ANIMATIONS PLAYER 3
        this.anims.create({
            key: "neutralRight3",
            frames: [{ key: "rightplayer3", frame: 0 }],
            frameRate: 18
        });

        this.anims.create({
            key: "neutralLeft3",
            frames: [{ key: "leftplayer3", frame: 8 }],
            frameRate: 18
        });

        this.anims.create({
            key: "leftRun3",
            frames: [
                { key: "leftplayer3", frame: 16 },
                { key: "leftplayer3", frame: 10 }
            ],
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: "leftPunch3",
            frames: [
                { key: "leftplayer3", frame: 12 },
                { key: "leftplayer3", frame: 8 }
            ],
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: "leftKick3",
            frames: [
                { key: "leftplayer3", frame: 11 },
                { key: "leftplayer3", frame: 8 }
            ],
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: "leftJump3",
            frames: [{ key: "leftplayer3", frame: 7 }],
            frameRate: 10,
            repeat: -1
        });
        // this.anims.create({
        //     key: "leftJumpB1",
        //     frames: this.anims.generateFrameNumbers("player1", {
        //         start: 30,
        //         end: 30
        //     }),
        //     frameRate: 10,
        //     repeat: -1
        // });
        this.anims.create({
            key: "leftHurt3",
            frames: [{ key: "leftplayer3", frame: 4 }],
            frameRate: 10
        });

        this.anims.create({
            key: "rightRun3",
            frames: [
                { key: "rightplayer3", frame: 10 },
                { key: "rightplayer3", frame: 16 }
            ],
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: "rightPunch3",
            frames: [
                { key: "rightplayer3", frame: 14 },
                { key: "rightplayer3", frame: 0 }
            ],
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: "rightKick3",
            frames: [
                { key: "rightplayer3", frame: 15 },
                { key: "rightplayer3", frame: 16 }
            ],
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: "rightJump3",
            frames: [{ key: "rightplayer3", frame: 1 }],
            frameRate: 10
        });
        this.anims.create({
            key: "JumpB3",
            frames: [{ key: "rightplayer3", frame: 8 }],
            frameRate: 10
        });
        this.anims.create({
            key: "rightHurt3",
            frames: [{ key: "rightplayer3", frame: 4 }],
            frameRate: 10
        });

        /////////////////////////////////ANIMATIONS PLAYER 4
        this.anims.create({
            key: "neutralRight4",
            frames: [{ key: "rightplayer4", frame: 0 }],
            frameRate: 18
        });

        this.anims.create({
            key: "neutralLeft4",
            frames: [{ key: "leftplayer4", frame: 8 }],
            frameRate: 18
        });

        this.anims.create({
            key: "leftRun4",
            frames: [
                { key: "leftplayer4", frame: 16 },
                { key: "leftplayer4", frame: 10 }
            ],
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: "leftPunch4",
            frames: [
                { key: "leftplayer4", frame: 12 },
                { key: "leftplayer4", frame: 8 }
            ],

            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: "leftKick4",
            frames: [
                { key: "leftplayer4", frame: 11 },
                { key: "leftplayer4", frame: 8 }
            ],
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: "leftJump4",
            frames: [{ key: "leftplayer4", frame: 7 }],
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: "leftHurt4",
            frames: [{ key: "leftplayer4", frame: 4 }],
            frameRate: 10
        });

        this.anims.create({
            key: "rightRun4",
            frames: [
                { key: "rightplayer4", frame: 10 },
                { key: "rightplayer4", frame: 16 }
            ],
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: "rightPunch4",
            frames: [
                { key: "rightplayer4", frame: 14 },
                { key: "rightplayer4", frame: 0 }
            ],
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: "rightKick4",
            frames: [
                { key: "rightplayer4", frame: 15 },
                { key: "rightplayer4", frame: 16 }
            ],
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: "rightJump4",
            frames: [{ key: "rightplayer4", frame: 1 }],
            frameRate: 10
        });
        this.anims.create({
            key: "JumpB4",
            frames: [{ key: "rightplayer4", frame: 8 }],
            frameRate: 10
        });
        this.anims.create({
            key: "rightHurt4",
            frames: [{ key: "rightplayer4", frame: 4 }],
            frameRate: 10
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
        this.key_A = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.A
        );
        this.key_D = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.D
        );

        // //CHARACTER MOVEMENTS
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
                        player.anims.play("leftJump");
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
                        player.anims.play("leftJump2");
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
                    player.anims.play("leftPunch3", true);
                } else if (player.data.list.actionRight) {
                    player.setData({
                        actionRight: true,
                        actionLeft: false
                    });
                    player.anims.play("rightPunch3", true);
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
                    player.anims.play("leftKick3", true);
                } else if (player.data.list.actionRight) {
                    player.setData({
                        actionRight: true,
                        actionLeft: false
                    });
                    player.anims.play("rightKick3", true);
                }
            } else if (cursors.left.isDown) {
                if (player.body.touching.down) {
                    player.setVelocityX(-200);
                    player.anims.play("leftRun3", true);
                } else {
                    player.setVelocityX(-200);
                    player.anims.play("leftJump3", true);
                }
                player.setData({ movedRight: false });
                player.setData({ movedLeft: true });
            } else if (cursors.right.isDown) {
                if (player.body.touching.down) {
                    player.setVelocityX(200);
                    player.anims.play("rightRun3", true);
                } else {
                    player.setVelocityX(200);
                    player.anims.play("rightJump3", true);
                }
                player.setData({ movedLeft: false });
                player.setData({ movedRight: true });
            } else if (self.key_A.isDown) {
                if (player.data.list.actionLeft) {
                    player.setData({ actionRight: false, actionLeft: true });
                    player.anims.play("leftPunch3", true);
                    if (!cursors.right.isDown || !cursors.left.isDown) {
                        player.setVelocityX(0);
                    }
                } else if (player.data.list.actionRight) {
                    player.setData({ actionRight: true, actionLeft: false });
                    player.anims.play("rightPunch3", true);
                    if (!cursors.right.isDown || !cursors.left.isDown) {
                        player.setVelocityX(0);
                    }
                }
            } else if (self.key_D.isDown) {
                if (player.data.list.actionLeft) {
                    player.setData({ actionRight: false, actionLeft: true });
                    player.anims.play("leftKick3", true);
                    if (!cursors.right.isDown || !cursors.left.isDown) {
                        player.setVelocityX(0);
                    }
                } else if (player.data.list.actionRight) {
                    player.setData({ actionRight: true, actionLeft: false });
                    player.anims.play("rightKick3", true);
                    if (!cursors.right.isDown || !cursors.left.isDown) {
                        player.setVelocityX(0);
                    }
                }
            } else {
                player.setVelocityX(0);
                if (player.data.list.movedRight) {
                    if (!player.body.touching.down) {
                        player.anims.play("rightJumpB3");
                    } else {
                        player.anims.play("neutralRight3");
                    }
                } else {
                    if (!player.body.touching.down) {
                        player.anims.play("leftJump3");
                    } else {
                        player.anims.play("neutralLeft3");
                    }
                }
            }
        }
        function characterMove4(player) {
            if (
                (cursors.left.isDown && self.key_A.isDown) ||
                (cursors.right.isDown && self.key_A.isDown)
            ) {
                if (player.data.list.actionLeft) {
                    player.setData({
                        actionRight: false,
                        actionLeft: true
                    });
                    player.anims.play("leftPunch4", true);
                } else if (player.data.list.actionRight) {
                    player.setData({
                        actionRight: true,
                        actionLeft: false
                    });
                    player.anims.play("rightPunch4", true);
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
                    player.anims.play("leftKick4", true);
                } else if (player.data.list.actionRight) {
                    player.setData({
                        actionRight: true,
                        actionLeft: false
                    });
                    player.anims.play("rightKick4", true);
                }
            } else if (cursors.left.isDown) {
                if (player.body.touching.down) {
                    player.setVelocityX(-200);
                    player.anims.play("leftRun4", true);
                } else {
                    player.setVelocityX(-200);
                    player.anims.play("leftJump4", true);
                }
                player.setData({ movedRight: false });
                player.setData({ movedLeft: true });
            } else if (cursors.right.isDown) {
                if (player.body.touching.down) {
                    player.setVelocityX(200);
                    player.anims.play("rightRun4", true);
                } else {
                    player.setVelocityX(200);
                    player.anims.play("rightJump4", true);
                }
                player.setData({ movedLeft: false });
                player.setData({ movedRight: true });
            } else if (self.key_A.isDown) {
                if (player.data.list.actionLeft) {
                    player.setData({ actionRight: false, actionLeft: true });
                    player.anims.play("leftPunch4", true);
                    if (!cursors.right.isDown || !cursors.left.isDown) {
                        player.setVelocityX(0);
                    }
                } else if (player.data.list.actionRight) {
                    player.setData({ actionRight: true, actionLeft: false });
                    player.anims.play("rightPunch4", true);
                    if (!cursors.right.isDown || !cursors.left.isDown) {
                        player.setVelocityX(0);
                    }
                }
            } else if (self.key_D.isDown) {
                if (player.data.list.actionLeft) {
                    player.setData({ actionRight: false, actionLeft: true });
                    player.anims.play("leftKick4", true);
                    if (!cursors.right.isDown || !cursors.left.isDown) {
                        player.setVelocityX(0);
                    }
                } else if (player.data.list.actionRight) {
                    player.setData({ actionRight: true, actionLeft: false });
                    player.anims.play("rightKick4", true);
                    if (!cursors.right.isDown || !cursors.left.isDown) {
                        player.setVelocityX(0);
                    }
                }
            } else {
                player.setVelocityX(0);
                if (player.data.list.movedRight) {
                    if (!player.body.touching.down) {
                        player.anims.play("rightJumpB4");
                    } else {
                        player.anims.play("neutralRight4");
                    }
                } else {
                    if (!player.body.touching.down) {
                        player.anims.play("leftJump4");
                    } else {
                        player.anims.play("neutralLeft4");
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
                var data = player1.data.list;
                characterMove(player1);
                deathCheck(player1);
                self.socket.emit("playerMovement", { x, y, data });
            } else if (
                typeof player2 != "undefined" &&
                self.socket.id == player2.data.list.socketId
            ) {
                var x = player2.x;
                var y = player2.y;
                var data = player2.data.list;
                characterMove2(player2);
                deathCheck(player2);
                self.socket.emit("playerMovement", { x, y, data });
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
    function addPlayers(self, playerInfo) {
        var curPlayer = "player" + playerInfo.playerNo;
        window[curPlayer] = players
            .create(
                playerInfo.x,
                playerInfo.y,
                "rightplayer" + playerInfo.playerNo
            )
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
})(); // CLOSE IIFE

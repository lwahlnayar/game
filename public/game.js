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
    var mainPlayerId;
    var mainPlayerNo;
    var borderLimitTop = -100;
    var borderLimitLeft = -100;
    var borderLimitRight = game.config.width + 100;
    var borderLimitBot = game.config.height + 100;
    var downFlag;

    function preload() {
        this.load.image("sky", "assets/sky2.jpg");
        this.load.image("ground", "assets/platform2.png");
        this.load.image("cloud", "assets/cloud.png");
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
        this.load.audio("backgroundSound", "/assets/Audio/MOUSE FAN CLUB.mp3");
        this.load.audio(
            "actionSound",
            "assets/Audio/action-_audiotrimmer.com_.mp3"
        );
        this.load.image("p1", "assets/headshots/p1.png");
        this.load.image("p2", "assets/headshots/p2.png");
        this.load.image("p3", "assets/headshots/p3.png");
        this.load.image("p4", "assets/headshots/p4.png");
        this.load.image("p1dead", "assets/headshots/p1dead.png");
        this.load.image("p2dead", "assets/headshots/p2dead.png");
        this.load.image("p3dead", "assets/headshots/p3dead.png");
        this.load.image("p4dead", "assets/headshots/p4dead.png");
    }

    ///////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////// C R E A T E ///////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////

    function create() {
        var self = this;
        var image1;
        var image2;
        var image3;
        var image4;
        var image1dead;
        var image2dead;
        var image3dead;
        var image4dead;

        players = this.physics.add.group();
        var backgroundSound = this.sound.add("backgroundSound", {
            loop: true
        });

        backgroundSound.play();

        this.socket = io(); //SOCKET ACTIVATED

        //ADD IMAGES, BACKGROUND, COLLIDERS
        this.add.image(320, 180, "sky");
        platforms = this.physics.add.staticGroup();
        platforms
            .create(320, 340, "ground")
            .setScale(1.5)
            .refreshBody();
        self.physics.add.collider(players, platforms);

        clouds = this.physics.add.staticGroup();
        clouds
            .create(25, 120, "cloud")
            .setScale(1.5)
            .refreshBody();

        clouds
            .create(500, 150, "cloud")
            .setScale(1)
            .refreshBody();

        self.physics.add.collider(players, clouds);

        //SOCKET LISTENERS
        this.socket.on("currentPlayers", function(players) {
            // console.log("THIS player SOCKET", self.socket.id);
            console.log("SOCKET TO WHICH PLAYER", players);
            mainPlayerId = self.socket.id;
            Object.keys(players).forEach(function(id) {
                setTimeout(function() {
                    addPlayers(self, players[id]);
                    if (self.socket.id == id) {
                        if (players[id].playerNo === 1) {
                            jumpListener(player1);
                            punchListener(player1);
                            kickListener(player1);
                        } else if (players[id].playerNo === 2) {
                            jumpListener(player2);
                            punchListener(player2);
                            kickListener(player2);
                        } else if (players[id].playerNo === 3) {
                            jumpListener(player3);
                            punchListener(player3);
                            kickListener(player3);
                        } else if (players[id].playerNo === 4) {
                            jumpListener(player4);
                            punchListener(player4);
                            kickListener(player4);
                        }
                    }
                }, 50);
            });
        });
        this.socket.on("newPlayer", function(playerInfo) {
            setTimeout(function() {
                addPlayers(self, playerInfo);
            }, 50);
        });
        this.socket.on("playerMoved", function(playerInfo) {
            players.getChildren().forEach(function(p) {
                if (playerInfo.socketId == p.data.list.socketId) {
                    var count = "";
                    // console.log("PLAYER FROM SOCKET -->", playerInfo);
                    if (playerInfo.playerNo == 1) {
                        // console.log("do nothing");
                    } else if (playerInfo.playerNo == 2) {
                        count = 2;
                    } else if (playerInfo.playerNo == 3) {
                        count = 3;
                    } else if (playerInfo.playerNo == 4) {
                        count = 4;
                    }
                    p.setPosition(playerInfo.x, playerInfo.y);
                    if (playerInfo.data.leftRun) {
                        p.anims.play("leftRun" + count, true);
                    } else if (playerInfo.data.rightRun) {
                        p.anims.play("rightRun" + count, true);
                    } else if (playerInfo.data.neutralLeft) {
                        p.anims.play("neutralLeft" + count, true);
                    } else if (playerInfo.data.neutralRight) {
                        p.anims.play("neutralRight" + count, true);
                    } else if (playerInfo.data.leftJump) {
                        p.anims.play("leftJump" + count, true);
                    } else if (playerInfo.data.rightJump) {
                        p.anims.play("rightJump" + count, true);
                    } else if (playerInfo.data.jumpNeutralRight) {
                        p.anims.play("jumpNeutralRight" + count, true);
                    } else if (playerInfo.data.jumpNeutralLeft) {
                        p.anims.play("jumpNeutralLeft" + count, true);
                    } else if (playerInfo.data.leftPunch) {
                        p.anims.play("leftPunch" + count, true);
                    } else if (playerInfo.data.rightPunch) {
                        p.anims.play("rightPunch" + count, true);
                    } else if (playerInfo.data.leftKick) {
                        p.anims.play("leftKick" + count, true);
                    } else if (playerInfo.data.rightKick) {
                        p.anims.play("rightKick" + count, true);
                    }
                }
            });
        });

        this.socket.on("damagedPlayer", function(damagedPlayer) {
            players.getChildren().forEach(function(p) {
                if (damagedPlayer.socketId == p.data.list.socketId) {
                    var count = "";
                    // console.log("PLAYER FROM SOCKET -->", playerInfo);
                    if (damagedPlayer.playerNo == 1) {
                        // console.log("do nothing");
                    } else if (damagedPlayer.playerNo == 2) {
                        count = 2;
                    } else if (damagedPlayer.playerNo == 3) {
                        count = 3;
                    } else if (damagedPlayer.playerNo == 4) {
                        count = 4;
                    }
                    // console.log(
                    //     "A PLAYER GOT DAMAGED! SHARING WITH EVERYONE ->",
                    //     damagedPlayer
                    // );
                    if (damagedPlayer.data.rightHurt) {
                        if (
                            typeof player1 != "undefined" &&
                            player1.data &&
                            player1.data.list &&
                            player1.data.list.socketId == damagedPlayer.socketId
                        ) {
                            var diff = 999 - player1.data.list.hp;
                            player1.setVelocityY(-100);
                            player1.setVelocityX(-150 - diff);
                        } else if (
                            typeof player2 != "undefined" &&
                            player2.data &&
                            player2.data.list &&
                            player2.data.list.socketId == damagedPlayer.socketId
                        ) {
                            var diff = 999 - player2.data.list.hp;
                            player2.setVelocityY(-100);
                            player2.setVelocityX(-150 - diff);
                        } else if (
                            typeof player3 != "undefined" &&
                            player3.data &&
                            player3.data.list &&
                            player3.data.list.socketId == damagedPlayer.socketId
                        ) {
                            var diff = 999 - player3.data.list.hp;
                            player3.setVelocityY(-100);
                            player3.setVelocityX(-150 - diff);
                        } else if (
                            typeof player4 != "undefined" &&
                            player4.data &&
                            player4.data.list &&
                            player4.data.list.socketId == damagedPlayer.socketId
                        ) {
                            var diff = 999 - player4.data.list.hp;
                            player4.setVelocityY(-100);
                            player4.setVelocityX(-150 - diff);
                        }
                        p.anims.play("rightHurt" + count, true);
                        p.setData({
                            hp: damagedPlayer.data.hp,
                            leftHurt: true,
                            rightHurt: false
                        });
                    } else if (damagedPlayer.data.leftHurt) {
                        if (
                            typeof player1 != "undefined" &&
                            player1.data &&
                            player1.data.list &&
                            player1.data.list.socketId == damagedPlayer.socketId
                        ) {
                            var diff = 999 - player1.data.list.hp;
                            player1.setVelocityY(-100);
                            player1.setVelocityX(+150 + diff);
                        } else if (
                            typeof player2 != "undefined" &&
                            player2.data &&
                            player2.data.list &&
                            player2.data.list.socketId == damagedPlayer.socketId
                        ) {
                            var diff = 999 - player2.data.list.hp;
                            player2.setVelocityY(-100);
                            player2.setVelocityX(+150 + diff);
                        } else if (
                            typeof player3 != "undefined" &&
                            player3.data &&
                            player3.data.list &&
                            player3.data.list.socketId == damagedPlayer.socketId
                        ) {
                            var diff = 999 - player3.data.list.hp;
                            player3.setVelocityY(-100);
                            player3.setVelocityX(+150 + diff);
                        } else if (
                            typeof player4 != "undefined" &&
                            player4.data &&
                            player4.data.list &&
                            player4.data.list.socketId == damagedPlayer.socketId
                        ) {
                            var diff = 999 - player4.data.list.hp;
                            player4.setVelocityY(-100);
                            player4.setVelocityX(+150 + diff);
                        }
                        p.anims.play("leftHurt" + count, true);
                        p.setData({
                            hp: damagedPlayer.data.hp,
                            leftHurt: true,
                            rightHurt: false
                        });
                    }
                }
            });
        });

        this.socket.on("gameEnd", function(player) {
            if (player.player == "player1") {
                self.add.image(70, 325, "p1dead").setScale(0.9);
            } else if (player.player == "player2") {
                self.add.image(210, 325, "p2dead").setScale(0.9);
            } else if (player.player == "player3") {
                self.add.image(340, 325, "p3dead").setScale(0.9);
            } else if (player.player == "player4") {
                self.add.image(480, 325, "p4dead").setScale(0.9);
            }
        });

        this.socket.on("userDisconnect", function(disconectedUserId) {
            console.log("user disconnects!", disconectedUserId);
            console.log("IMAGE DEAD 1", self.image1dead);
            players.getChildren().forEach(function(p) {
                // console.log("p.data.list.player", p.data.list.player);
                if (disconectedUserId == p.data.list.socketId) {
                    if (p.data.list.player == "player1") {
                        console.log("player1 userDisconnect");
                        scoreTextP1.setText("");
                        this.image1.destroy();
                    } else if (p.data.list.player == "player2") {
                        console.log("player2 disconnect");
                        scoreTextP2.setText("");
                        this.image2.destroy();
                    } else if (p.data.list.player == "player3") {
                        // console.log("player3 disconnect");
                        scoreTextP3.setText("");
                        this.image3.destroy();
                    } else if (p.data.list.player == "player4") {
                        scoreTextP4.setText("");
                        this.image4.destroy();
                    }
                    p.destroy();
                }
            });
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
            key: "jumpNeutralRight",
            frames: [{ key: "rightplayer1", frame: 8 }],
            frameRate: 10
        });
        this.anims.create({
            key: "jumpNeutralLeft",
            frames: [{ key: "leftplayer1", frame: 0 }],
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
            key: "jumpNeutralRight2",
            frames: [{ key: "rightplayer2", frame: 8 }],
            frameRate: 10
        });
        this.anims.create({
            key: "jumpNeutralLeft2",
            frames: [{ key: "leftplayer2", frame: 0 }],
            frameRate: 10
        });
        this.anims.create({
            key: "rightHurt2",
            frames: [{ key: "rightplayer2", frame: 4 }],
            frameRate: 10
        });

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
            key: "jumpNeutralRight3",
            frames: [{ key: "rightplayer3", frame: 8 }],
            frameRate: 10
        });
        this.anims.create({
            key: "jumpNeutralLeft3",
            frames: [{ key: "leftplayer3", frame: 0 }],
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
            key: "jumpNeutralRight4",
            frames: [{ key: "rightplayer4", frame: 8 }],
            frameRate: 10
        });
        this.anims.create({
            key: "jumpNeutralLeft4",
            frames: [{ key: "leftplayer4", frame: 0 }],
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

        // setTimeout(function() {
        //     if (
        //         typeof player1 != "undefined" &&
        //         self.socket.id == player1.data.list.socketId
        //     ) {
        //         jumpListener(player1);
        //         punchListener(player1);
        //         kickListener(player1);
        //     } else if (
        //         typeof player2 != "undefined" &&
        //         self.socket.id == player2.data.list.socketId
        //     ) {
        //         jumpListener(player2);
        //         punchListener(player2);
        //         kickListener(player2);
        //     } else if (
        //         typeof player3 != "undefined" &&
        //         self.socket.id == player3.data.list.socketId
        //     ) {
        //         jumpListener(player3);
        //         punchListener(player3);
        //         kickListener(player3);
        //     } else if (
        //         typeof player4 != "undefined" &&
        //         self.socket.id == player4.data.list.socketId
        //     ) {
        //         jumpListener(player4);
        //         punchListener(player4);
        //         kickListener(player4);
        //     }
        // }, 80);
    } //CLOSES CREATE FUNCTION

    ///////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////// U P D A T E ///////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////

    function update() {
        var self = this;

        // var neutralLeftObj = toggleTrue("neutralLeft");
        // var neutralRightObj = toggleTrue("neutralRight");
        // var jumpNeutralLeftObj = toggleTrue("jumpNeutralLeft");
        // var jumpNeutralRightObj = toggleTrue("jumpNeutralRight");
        // var leftJumpObj = toggleTrue("leftJump");
        // var rightJumpObj = toggleTrue("rightJump");
        // var leftRunObj = toggleTrue("leftRun");
        // var rightRunObj = toggleTrue("rightRun");
        // var leftHurtObj = toggleTrue("leftHurt");
        // var rightHurtObj = toggleTrue("rightHurt");
        var leftPunchObj = toggleTrue("leftPunch"); // needed all false
        var rightPunchObj = toggleTrue("rightPunch"); // needed all false
        var leftKickObj = toggleTrue("leftKick"); //needed all false
        var rightKickObj = toggleTrue("rightKick"); //needed all false

        cursors = this.input.keyboard.createCursorKeys();
        this.key_A = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.A
        );
        this.key_D = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.D
        );

        if (self.key_A.isDown || self.key_D.isDown) {
            downFlag = true;
        } else {
            if (downFlag == true) {
                downFlag = false;
                game.sound.play("actionSound");
            }
        }

        this.socket.off("playerDied").on("playerDied", function(deadPlayer) {
            //fuq
            if (deadPlayer.data.player == "player1") {
                player1.setData({ lives: deadPlayer.data.lives, hp: 999 });
                scoreTextP1.setText("P1: " + deadPlayer.data.lives);
            } else if (deadPlayer.data.player == "player2") {
                player2.setData({ lives: deadPlayer.data.lives, hp: 999 });
                scoreTextP2.setText("P2: " + deadPlayer.data.lives);
            } else if (deadPlayer.data.player == "player3") {
                player3.setData({ lives: deadPlayer.data.lives, hp: 999 });
                scoreTextP3.setText("P3: " + deadPlayer.data.lives);
            } else if (deadPlayer.data.player == "player4") {
                player4.setData({ lives: deadPlayer.data.lives, hp: 999 });
                scoreTextP4.setText("P4: " + deadPlayer.data.lives);
            }
        });

        //////////// CHARACTER MOVEMENTS //////////////
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
                    player.setData(leftPunchObj); //state on own player
                    // makeSound(self);
                    if (checkIfInRange().length > 0) {
                        doDmgLeft(checkIfInRange(), self); //state on enemy player
                    }
                } else if (player.data.list.actionRight) {
                    player.setData({
                        actionRight: true,
                        actionLeft: false
                    });
                    player.anims.play("rightPunch", true);
                    player.setData(rightPunchObj); //
                    if (checkIfInRange().length > 0) {
                        doDmgRight(checkIfInRange(), self); //state on enemy player
                    }
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
                    player.setData(leftKickObj); //
                    if (checkIfInRange().length > 0) {
                        doDmgLeft(checkIfInRange(), self); //state on enemy player
                    }
                } else if (player.data.list.actionRight) {
                    player.setData({
                        actionRight: true,
                        actionLeft: false
                    });
                    player.anims.play("rightKick", true);
                    player.setData(rightKickObj); //
                    if (checkIfInRange().length > 0) {
                        doDmgRight(checkIfInRange(), self); //state on enemy player
                    }
                }
            } else if (cursors.left.isDown) {
                if (player.body.touching.down) {
                    player.setVelocityX(-200);
                    player.anims.play("leftRun", true);
                    player.setData({ leftRun: true, rightRun: false }); //
                } else {
                    player.setVelocityX(-200);
                    player.anims.play("leftJump", true);
                    player.setData({
                        leftJump: true,
                        rightJump: false,
                        neutralLeft: false,
                        neutralRight: false,
                        leftRun: false,
                        rightRun: false
                    }); //
                }
                player.setData({ movedRight: false });
                player.setData({ movedLeft: true });
            } else if (cursors.right.isDown) {
                if (player.body.touching.down) {
                    player.setVelocityX(200);
                    player.anims.play("rightRun", true);
                    player.setData({ leftRun: false, rightRun: true }); //
                } else {
                    player.setVelocityX(200);
                    player.anims.play("rightJump", true);
                    player.setData({
                        leftJump: false,
                        rightJump: true,
                        neutralLeft: false,
                        neutralRight: false,
                        leftRun: false,
                        rightRun: false
                    }); //
                }
                player.setData({ movedLeft: false });
                player.setData({ movedRight: true });
            } else if (self.key_A.isDown) {
                if (
                    !player.data.list.actionLeft &&
                    !player.data.list.actionRight
                ) {
                    player.setData({ actionRight: false, actionLeft: true });
                    player.anims.play("leftPunch", true);
                    player.setData(leftPunchObj); //state on own player
                    // makeSound(self);
                    if (checkIfInRange().length > 0) {
                        doDmgLeft(checkIfInRange(), self); //state on enemy player
                    }
                }
                if (player.data.list.actionLeft) {
                    player.setData({ actionRight: false, actionLeft: true });
                    player.anims.play("leftPunch", true);
                    player.setData(leftPunchObj); //state on own player
                    // makeSound(self);
                    if (checkIfInRange().length > 0) {
                        doDmgLeft(checkIfInRange(), self); //state on enemy player
                    }
                    if (!cursors.right.isDown || !cursors.left.isDown) {
                        player.setVelocityX(0);
                    }
                } else if (player.data.list.actionRight) {
                    player.setData({ actionRight: true, actionLeft: false });
                    player.anims.play("rightPunch", true);
                    player.setData(rightPunchObj); //
                    if (checkIfInRange().length > 0) {
                        doDmgRight(checkIfInRange(), self); //state on enemy player
                    }
                    if (!cursors.right.isDown || !cursors.left.isDown) {
                        player.setVelocityX(0);
                    }
                }
            } else if (self.key_D.isDown) {
                if (
                    !player.data.list.actionLeft &&
                    !player.data.list.actionRight
                ) {
                    player.setData({ actionRight: false, actionLeft: true });
                    player.anims.play("leftKick", true);
                    player.setData(leftKickObj); //
                    if (checkIfInRange().length > 0) {
                        doDmgLeft(checkIfInRange(), self); //state on enemy player
                    }
                }
                if (player.data.list.actionLeft) {
                    player.setData({ actionRight: false, actionLeft: true });
                    player.anims.play("leftKick", true);
                    player.setData(leftKickObj); //
                    if (checkIfInRange().length > 0) {
                        doDmgLeft(checkIfInRange(), self); //state on enemy player
                    }
                    if (!cursors.right.isDown || !cursors.left.isDown) {
                        player.setVelocityX(0);
                    }
                } else if (player.data.list.actionRight) {
                    player.setData({ actionRight: true, actionLeft: false });
                    player.anims.play("rightKick", true);
                    player.setData(rightKickObj); //
                    if (checkIfInRange().length > 0) {
                        doDmgRight(checkIfInRange(), self); //state on enemy player
                    }
                    if (!cursors.right.isDown || !cursors.left.isDown) {
                        player.setVelocityX(0);
                    }
                }
            } else {
                player.setVelocityX(0);
                if (player.data.list.movedRight) {
                    if (!player.body.touching.down) {
                        player.anims.play("jumpNeutralRight");
                        player.setData({
                            jumpNeutralRight: true,
                            jumpNeutralLeft: false,
                            leftJump: false,
                            rightJump: false,
                            leftRun: false,
                            rightRun: false,
                            neutralLeft: false,
                            neutralRight: false
                        }); //
                    } else {
                        player.anims.play("neutralRight");
                        player.setData({
                            leftRun: false,
                            rightRun: false,
                            neutralLeft: false,
                            neutralRight: true
                        }); //
                    }
                } else {
                    if (!player.body.touching.down) {
                        player.anims.play("jumpNeutralLeft");
                        player.setData({
                            jumpNeutralLeft: true,
                            jumpNeutralRight: false,
                            leftJump: false,
                            rightJump: false,
                            leftRun: false,
                            rightRun: false,
                            neutralLeft: false,
                            neutralRight: false
                        }); //
                    } else {
                        player.anims.play("neutralLeft");
                        player.setData({
                            leftRun: false,
                            rightRun: false,
                            neutralLeft: true,
                            neutralRight: false
                        }); //
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
                    player.setData(leftPunchObj); // state of own player
                    if (checkIfInRange().length > 0) {
                        doDmgLeft(checkIfInRange(), self); //state on enemy player
                    }
                } else if (player.data.list.actionRight) {
                    player.setData({
                        actionRight: true,
                        actionLeft: false
                    });
                    player.anims.play("rightPunch2", true);
                    player.setData(rightPunchObj); //
                    if (checkIfInRange().length > 0) {
                        doDmgRight(checkIfInRange(), self); //state on enemy player
                    }
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
                    player.setData(leftKickObj); //
                    if (checkIfInRange().length > 0) {
                        doDmgLeft(checkIfInRange(), self); //state on enemy player
                    }
                } else if (player.data.list.actionRight) {
                    player.setData({
                        actionRight: true,
                        actionLeft: false
                    });
                    player.anims.play("rightKick2", true);
                    player.setData(rightKickObj); //
                    if (checkIfInRange().length > 0) {
                        doDmgRight(checkIfInRange(), self); //state on enemy player
                    }
                }
            } else if (cursors.left.isDown) {
                if (player.body.touching.down) {
                    player.setVelocityX(-200);
                    player.anims.play("leftRun2", true);
                    player.setData({ leftRun: true, rightRun: false }); //
                } else {
                    player.setVelocityX(-200);
                    player.anims.play("leftJump2", true);
                    player.setData({
                        leftJump: true,
                        rightJump: false,
                        neutralLeft: false,
                        neutralRight: false,
                        leftRun: false,
                        rightRun: false
                    }); //
                }
                player.setData({ movedRight: false, movedLeft: true });
            } else if (cursors.right.isDown) {
                if (player.body.touching.down) {
                    player.setVelocityX(200);
                    player.anims.play("rightRun2", true);
                    player.setData({ leftRun: false, rightRun: true }); //
                } else {
                    player.setVelocityX(200);
                    player.anims.play("rightJump2", true);
                    player.setData({
                        leftJump: false,
                        rightJump: true,
                        neutralLeft: false,
                        neutralRight: false,
                        leftRun: false,
                        rightRun: false
                    }); //
                }
                player.setData({ movedLeft: false, movedRight: true });
            } else if (self.key_A.isDown) {
                if (
                    !player.data.list.actionLeft &&
                    !player.data.list.actionRight
                ) {
                    player.setData({ actionRight: false, actionLeft: true });
                    player.anims.play("leftPunch2", true);
                    player.setData(leftPunchObj); // state of own player
                    if (checkIfInRange().length > 0) {
                        doDmgLeft(checkIfInRange(), self); //state on enemy player
                    }
                }
                if (player.data.list.actionLeft) {
                    player.setData({ actionRight: false, actionLeft: true });
                    player.anims.play("leftPunch2", true);
                    player.setData(leftPunchObj); // state of own player
                    if (checkIfInRange().length > 0) {
                        doDmgLeft(checkIfInRange(), self); //state on enemy player
                    }
                    if (!cursors.right.isDown || !cursors.left.isDown) {
                        player.setVelocityX(0);
                    }
                } else if (player.data.list.actionRight) {
                    player.setData({ actionRight: true, actionLeft: false });
                    player.anims.play("rightPunch2", true);
                    player.setData(rightPunchObj); //
                    if (checkIfInRange().length > 0) {
                        doDmgRight(checkIfInRange(), self); //state on enemy player
                    }
                    if (!cursors.right.isDown || !cursors.left.isDown) {
                        player.setVelocityX(0);
                    }
                }
            } else if (self.key_D.isDown) {
                if (
                    !player.data.list.actionLeft &&
                    !player.data.list.actionRight
                ) {
                    player.setData({ actionRight: false, actionLeft: true });
                    player.anims.play("leftKick2", true);
                    player.setData(leftKickObj); //
                    if (checkIfInRange().length > 0) {
                        doDmgLeft(checkIfInRange(), self); //state on enemy player
                    }
                }
                if (player.data.list.actionLeft) {
                    player.setData({ actionRight: false, actionLeft: true });
                    player.anims.play("leftKick2", true);
                    player.setData(leftKickObj); //
                    if (checkIfInRange().length > 0) {
                        doDmgLeft(checkIfInRange(), self); //state on enemy player
                    }
                    if (!cursors.right.isDown || !cursors.left.isDown) {
                        player.setVelocityX(0);
                    }
                } else if (player.data.list.actionRight) {
                    player.setData({ actionRight: true, actionLeft: false });
                    player.anims.play("rightKick2", true);
                    player.setData(rightKickObj); //
                    if (checkIfInRange().length > 0) {
                        doDmgRight(checkIfInRange(), self); //state on enemy player
                    }
                    if (!cursors.right.isDown || !cursors.left.isDown) {
                        player.setVelocityX(0);
                    }
                }
            } else {
                player.setVelocityX(0);
                if (player.data.list.movedRight) {
                    if (!player.body.touching.down) {
                        player.anims.play("jumpNeutralRight2");
                        player.setData({
                            jumpNeutralRight: true,
                            jumpNeutralLeft: false,
                            leftJump: false,
                            rightJump: false,
                            leftRun: false,
                            rightRun: false,
                            neutralLeft: false,
                            neutralRight: false
                        }); //
                    } else {
                        player.anims.play("neutralRight2");
                        player.setData({
                            leftRun: false,
                            rightRun: false,
                            neutralLeft: false,
                            neutralRight: true
                        }); //
                    }
                } else {
                    if (!player.body.touching.down) {
                        player.anims.play("jumpNeutralLeft2");
                        player.setData({
                            jumpNeutralLeft: true,
                            jumpNeutralRight: false,
                            leftJump: false,
                            rightJump: false,
                            leftRun: false,
                            rightRun: false,
                            neutralLeft: false,
                            neutralRight: false
                        }); //
                    } else {
                        player.anims.play("neutralLeft2");
                        player.setData({
                            leftRun: false,
                            rightRun: false,
                            neutralLeft: true,
                            neutralRight: false
                        }); //
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
                    player.setData(leftPunchObj); // state of own player
                    if (checkIfInRange().length > 0) {
                        doDmgLeft(checkIfInRange(), self); //state on enemy player
                    }
                } else if (player.data.list.actionRight) {
                    player.setData({
                        actionRight: true,
                        actionLeft: false
                    });
                    player.anims.play("rightPunch3", true);
                    player.setData(rightPunchObj); //
                    if (checkIfInRange().length > 0) {
                        doDmgRight(checkIfInRange(), self); //state on enemy player
                    }
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
                    player.setData(leftKickObj); //
                    if (checkIfInRange().length > 0) {
                        doDmgLeft(checkIfInRange(), self); //state on enemy player
                    }
                } else if (player.data.list.actionRight) {
                    player.setData({
                        actionRight: true,
                        actionLeft: false
                    });
                    player.anims.play("rightKick3", true);
                    player.setData(rightKickObj); //
                    if (checkIfInRange().length > 0) {
                        doDmgRight(checkIfInRange(), self); //state on enemy player
                    }
                }
            } else if (cursors.left.isDown) {
                if (player.body.touching.down) {
                    player.setVelocityX(-200);
                    player.anims.play("leftRun3", true);
                    player.setData({ leftRun: true, rightRun: false }); //
                } else {
                    player.setVelocityX(-200);
                    player.anims.play("leftJump3", true);
                    player.setData({
                        leftJump: true,
                        rightJump: false,
                        neutralLeft: false,
                        neutralRight: false,
                        leftRun: false,
                        rightRun: false
                    }); //
                }
                player.setData({ movedRight: false });
                player.setData({ movedLeft: true });
            } else if (cursors.right.isDown) {
                if (player.body.touching.down) {
                    player.setVelocityX(200);
                    player.anims.play("rightRun3", true);
                    player.setData({ leftRun: false, rightRun: true }); //
                } else {
                    player.setVelocityX(200);
                    player.anims.play("rightJump3", true);
                    player.setData({
                        leftJump: false,
                        rightJump: true,
                        neutralLeft: false,
                        neutralRight: false,
                        leftRun: false,
                        rightRun: false
                    }); //
                }
                player.setData({ movedLeft: false });
                player.setData({ movedRight: true });
            } else if (self.key_A.isDown) {
                if (
                    !player.data.list.actionLeft &&
                    !player.data.list.actionRight
                ) {
                    player.setData({ actionRight: false, actionLeft: true });
                    player.anims.play("leftPunch3", true);
                    player.setData(leftPunchObj); // state of own player
                    if (checkIfInRange().length > 0) {
                        doDmgLeft(checkIfInRange(), self); //state on enemy player
                    }
                }
                if (player.data.list.actionLeft) {
                    player.setData({ actionRight: false, actionLeft: true });
                    player.anims.play("leftPunch3", true);
                    player.setData(leftPunchObj); // state of own player
                    if (checkIfInRange().length > 0) {
                        doDmgLeft(checkIfInRange(), self); //state on enemy player
                    }
                    if (!cursors.right.isDown || !cursors.left.isDown) {
                        player.setVelocityX(0);
                    }
                } else if (player.data.list.actionRight) {
                    player.setData({ actionRight: true, actionLeft: false });
                    player.anims.play("rightPunch3", true);
                    player.setData(rightPunchObj); //
                    if (checkIfInRange().length > 0) {
                        doDmgRight(checkIfInRange(), self); //state on enemy player
                    }
                    if (!cursors.right.isDown || !cursors.left.isDown) {
                        player.setVelocityX(0);
                    }
                }
            } else if (self.key_D.isDown) {
                if (
                    !player.data.list.actionLeft &&
                    !player.data.list.actionRight
                ) {
                    player.setData({ actionRight: false, actionLeft: true });
                    player.anims.play("leftKick3", true);
                    player.setData(leftKickObj); //
                    if (checkIfInRange().length > 0) {
                        doDmgLeft(checkIfInRange(), self); //state on enemy player
                    }
                }
                if (player.data.list.actionLeft) {
                    player.setData({ actionRight: false, actionLeft: true });
                    player.anims.play("leftKick3", true);
                    player.setData(leftKickObj); //
                    if (checkIfInRange().length > 0) {
                        doDmgLeft(checkIfInRange(), self); //state on enemy player
                    }
                    if (!cursors.right.isDown || !cursors.left.isDown) {
                        player.setVelocityX(0);
                    }
                } else if (player.data.list.actionRight) {
                    player.setData({ actionRight: true, actionLeft: false });
                    player.anims.play("rightKick3", true);
                    player.setData(rightKickObj); //
                    if (checkIfInRange().length > 0) {
                        doDmgRight(checkIfInRange(), self); //state on enemy player
                    }
                    if (!cursors.right.isDown || !cursors.left.isDown) {
                        player.setVelocityX(0);
                    }
                }
            } else {
                player.setVelocityX(0);
                if (player.data.list.movedRight) {
                    if (!player.body.touching.down) {
                        player.anims.play("jumpNeutralRight3");
                        player.setData({
                            jumpNeutralRight: true,
                            jumpNeutralLeft: false,
                            leftJump: false,
                            rightJump: false,
                            leftRun: false,
                            rightRun: false,
                            neutralLeft: false,
                            neutralRight: false
                        }); //
                    } else {
                        player.anims.play("neutralRight3");
                        player.setData({
                            leftRun: false,
                            rightRun: false,
                            neutralLeft: false,
                            neutralRight: true
                        }); //
                    }
                } else {
                    if (!player.body.touching.down) {
                        player.anims.play("jumpNeutralLeft3");
                        player.setData({
                            jumpNeutralLeft: true,
                            jumpNeutralRight: false,
                            leftJump: false,
                            rightJump: false,
                            leftRun: false,
                            rightRun: false,
                            neutralLeft: false,
                            neutralRight: false
                        }); //
                    } else {
                        player.anims.play("neutralLeft3");
                        player.setData({
                            leftRun: false,
                            rightRun: false,
                            neutralLeft: true,
                            neutralRight: false
                        }); //
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
                    player.setData(leftPunchObj); // state of own player
                    if (checkIfInRange().length > 0) {
                        doDmgLeft(checkIfInRange(), self); //state on enemy player
                    }
                } else if (player.data.list.actionRight) {
                    player.setData({
                        actionRight: true,
                        actionLeft: false
                    });
                    player.anims.play("rightPunch4", true);
                    player.setData(rightPunchObj); //
                    if (checkIfInRange().length > 0) {
                        doDmgRight(checkIfInRange(), self); //state on enemy player
                    }
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
                    player.setData(leftKickObj); //
                    if (checkIfInRange().length > 0) {
                        doDmgLeft(checkIfInRange(), self); //state on enemy player
                    }
                } else if (player.data.list.actionRight) {
                    player.setData({
                        actionRight: true,
                        actionLeft: false
                    });
                    player.anims.play("rightKick4", true);
                    player.setData(rightKickObj); //
                    if (checkIfInRange().length > 0) {
                        doDmgRight(checkIfInRange(), self); //state on enemy player
                    }
                }
            } else if (cursors.left.isDown) {
                if (player.body.touching.down) {
                    player.setVelocityX(-200);
                    player.anims.play("leftRun4", true);
                    player.setData({ leftRun: true, rightRun: false }); //
                } else {
                    player.setVelocityX(-200);
                    player.anims.play("leftJump4", true);
                    player.setData({
                        leftJump: true,
                        rightJump: false,
                        neutralLeft: false,
                        neutralRight: false,
                        leftRun: false,
                        rightRun: false
                    }); //
                }
                player.setData({ movedRight: false });
                player.setData({ movedLeft: true });
            } else if (cursors.right.isDown) {
                if (player.body.touching.down) {
                    player.setVelocityX(200);
                    player.anims.play("rightRun4", true);
                    player.setData({ leftRun: false, rightRun: true }); //
                } else {
                    player.setVelocityX(200);
                    player.anims.play("rightJump4", true);
                    player.setData({
                        leftJump: false,
                        rightJump: true,
                        neutralLeft: false,
                        neutralRight: false,
                        leftRun: false,
                        rightRun: false
                    }); //
                }
                player.setData({ movedLeft: false });
                player.setData({ movedRight: true });
            } else if (self.key_A.isDown) {
                if (
                    !player.data.list.actionLeft &&
                    !player.data.list.actionRight
                ) {
                    player.setData({ actionRight: false, actionLeft: true });
                    player.anims.play("leftPunch4", true);
                    player.setData(leftPunchObj); // state of own player
                    if (checkIfInRange().length > 0) {
                        doDmgLeft(checkIfInRange(), self); //state on enemy player
                    }
                }
                if (player.data.list.actionLeft) {
                    player.setData({ actionRight: false, actionLeft: true });
                    player.anims.play("leftPunch4", true);
                    player.setData(leftPunchObj); // state of own player
                    if (checkIfInRange().length > 0) {
                        doDmgLeft(checkIfInRange(), self); //state on enemy player
                    }
                    if (!cursors.right.isDown || !cursors.left.isDown) {
                        player.setVelocityX(0);
                    }
                } else if (player.data.list.actionRight) {
                    player.setData({ actionRight: true, actionLeft: false });
                    player.anims.play("rightPunch4", true);
                    player.setData(rightPunchObj); //
                    if (checkIfInRange().length > 0) {
                        doDmgRight(checkIfInRange(), self); //state on enemy player
                    }
                    if (!cursors.right.isDown || !cursors.left.isDown) {
                        player.setVelocityX(0);
                    }
                }
            } else if (self.key_D.isDown) {
                if (player.data.list.actionLeft) {
                    if (
                        !player.data.list.actionLeft &&
                        !player.data.list.actionRight
                    ) {
                        player.setData({
                            actionRight: false,
                            actionLeft: true
                        });
                        player.anims.play("leftKick4", true);
                        player.setData(leftKickObj); //
                        if (checkIfInRange().length > 0) {
                            doDmgLeft(checkIfInRange(), self); //state on enemy player
                        }
                    }
                }
                if (player.data.list.actionLeft) {
                    player.setData({ actionRight: false, actionLeft: true });
                    player.anims.play("leftKick4", true);
                    player.setData(leftKickObj); //
                    if (checkIfInRange().length > 0) {
                        doDmgLeft(checkIfInRange(), self); //state on enemy player
                    }
                    if (!cursors.right.isDown || !cursors.left.isDown) {
                        player.setVelocityX(0);
                    }
                } else if (player.data.list.actionRight) {
                    player.setData({ actionRight: true, actionLeft: false });
                    player.anims.play("rightKick4", true);
                    player.setData(rightKickObj); //
                    if (checkIfInRange().length > 0) {
                        doDmgRight(checkIfInRange(), self); //state on enemy player
                    }
                    if (!cursors.right.isDown || !cursors.left.isDown) {
                        player.setVelocityX(0);
                    }
                }
            } else {
                player.setVelocityX(0);
                if (player.data.list.movedRight) {
                    if (!player.body.touching.down) {
                        player.anims.play("jumpNeutralRight4");
                        player.setData({
                            jumpNeutralRight: true,
                            jumpNeutralLeft: false,
                            leftJump: false,
                            rightJump: false,
                            leftRun: false,
                            rightRun: false,
                            neutralLeft: false,
                            neutralRight: false
                        }); //
                    } else {
                        player.anims.play("neutralRight4");
                        player.setData({
                            leftRun: false,
                            rightRun: false,
                            neutralLeft: false,
                            neutralRight: true
                        }); //
                    }
                } else {
                    if (!player.body.touching.down) {
                        player.anims.play("jumpNeutralLeft4");
                        player.setData({
                            jumpNeutralLeft: true,
                            jumpNeutralRight: false,
                            leftJump: false,
                            rightJump: false,
                            leftRun: false,
                            rightRun: false,
                            neutralLeft: false,
                            neutralRight: false
                        }); //
                    } else {
                        player.anims.play("neutralLeft4");
                        player.setData({
                            leftRun: false,
                            rightRun: false,
                            neutralLeft: true,
                            neutralRight: false
                        }); //
                    }
                }
            }
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
                player.setPosition(Math.floor(Math.random() * 360) + 150, 100);
                //show death animation here
            } //fuq
            if (player.data.list.player == "player1") {
                if (!player.data.list.alive) {
                    console.log("player 1 dies");
                    lives--;
                    player.setData({ alive: true, lives: lives });
                    self.socket.emit("playerDeath", {
                        player: player.data.list.player,
                        lives: player.data.list.lives,
                        allPlayers: players.getChildren()
                    });
                    if (lives == 0) {
                        image1dead = self.add
                            .image(70, 325, "p1dead")
                            .setScale(0.9);
                        self.socket.emit("gameOver", {
                            player: player1.data.list.player
                        });
                        player1.destroy();
                    }
                }
            } else if (player.data.list.player == "player2") {
                if (!player.data.list.alive) {
                    console.log("player 2 dies");
                    lives--;
                    player.setData({ alive: true, lives: lives });
                    self.socket.emit("playerDeath", {
                        player: player.data.list.player,
                        lives: player.data.list.lives,
                        allPlayers: players.getChildren()
                    });
                    if (lives == 0) {
                        image2dead = self.add
                            .image(210, 325, "p2dead")
                            .setScale(0.9);
                        self.socket.emit("gameOver", {
                            player: player2.data.list.player
                        });
                        player2.destroy();
                    }
                }
            } else if (player.data.list.player == "player3") {
                if (!player.data.list.alive) {
                    console.log("player 3 dies");
                    lives--;
                    player.setData({ alive: true, lives: lives });
                    self.socket.emit("playerDeath", {
                        player: player.data.list.player,
                        lives: player.data.list.lives,
                        allPlayers: players.getChildren()
                    });
                    if (lives == 0) {
                        image3dead = self.add
                            .image(340, 325, "p3dead")
                            .setScale(0.9);
                        self.socket.emit("gameOver", {
                            player: player3.data.list.player
                        });
                        player3.destroy();
                    }
                }
            } else if (player.data.list.player == "player4") {
                if (!player.data.list.alive) {
                    console.log("player 4 dies");
                    lives--;
                    player.setData({ alive: true, lives: lives });
                    self.socket.emit("playerDeath", {
                        player: player.data.list.player,
                        lives: player.data.list.lives,
                        allPlayers: players.getChildren()
                    });
                    if (lives == 0) {
                        image4dead = self.add
                            .image(480, 325, "p4dead")
                            .setScale(0.9);
                        self.socket.emit("gameOver", {
                            player: player4.data.list.player
                        });
                        player4.destroy();
                    }
                }
            }
        }

        setTimeout(function() {
            if (
                typeof player1 != "undefined" &&
                player1.data &&
                player1.data.list &&
                self.socket.id == player1.data.list.socketId
            ) {
                characterMove(player1);
                deathCheck(player1);
                var x = player1.x;
                var y = player1.y;
                var data = player1.data.list;
                self.socket.emit("playerMovement", { x, y, data });
            } else if (
                typeof player2 != "undefined" &&
                player2.data &&
                player2.data.list &&
                self.socket.id == player2.data.list.socketId
            ) {
                characterMove2(player2);
                deathCheck(player2);
                var x = player2.x;
                var y = player2.y;
                var data = player2.data.list;
                self.socket.emit("playerMovement", { x, y, data });
            } else if (
                typeof player3 != "undefined" &&
                player3.data &&
                player3.data.list &&
                self.socket.id == player3.data.list.socketId
            ) {
                characterMove3(player3);
                deathCheck(player3);
                var x = player3.x;
                var y = player3.y;
                var data = player3.data.list;
                self.socket.emit("playerMovement", { x, y, data });
            } else if (
                typeof player4 != "undefined" &&
                player4.data &&
                player4.data.list &&
                self.socket.id == player4.data.list.socketId
            ) {
                characterMove4(player4);
                deathCheck(player4);
                var x = player4.x;
                var y = player4.y;
                var data = player4.data.list;
                self.socket.emit("playerMovement", { x, y, data });
            }
        }, 80);
    }

    ///////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////// O T H E R S ///////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////

    //ADD PLAYERS
    function addPlayers(self, playerInfo) {
        var curPlayer = "player" + playerInfo.playerNo;
        mainPlayerNo = curPlayer;
        window[curPlayer] = players
            .create(
                playerInfo.x,
                playerInfo.y,
                "rightplayer" + playerInfo.playerNo
            )
            .setScale(0.5, 0.5)
            .setData({
                alive: true,
                lives: 8,
                hp: 999,
                jump: 0,
                movedLeft: false,
                movedRight: false,
                socketId: playerInfo.socketId,
                player: curPlayer,
                neutralRight: false,
                neutralLeft: false,
                leftRun: false,
                leftPunch: false,
                leftKick: false,
                leftJump: false,
                leftHurt: false,
                rightRun: false,
                rightPunch: false,
                rightKick: false,
                rightJump: false,
                jumpNeutralRight: true,
                jumpNeutralLeft: false,
                rightHurt: false
            });
        window[curPlayer].body.setGravityY(300);

        if (curPlayer == "player1") {
            image1 = self.add.image(70, 325, "p1").setScale(0.9);
            scoreTextP1 = self.add.text(
                95,
                318,
                "P1: " + player1.data.list.lives,
                {
                    fontSize: "23px",
                    fill: "#b12f25",
                    strokeThickness: "5"
                }
            );
        } else if (curPlayer == "player2") {
            image2 = self.add.image(210, 325, "p2").setScale(0.9);
            scoreTextP2 = self.add.text(
                230,
                318,
                "P2: " + player2.data.list.lives,
                {
                    fontSize: "23px",
                    fill: "#d67d29",
                    strokeThickness: "5"
                }
            );
        } else if (curPlayer == "player3") {
            image3 = self.add.image(340, 325, "p3").setScale(0.9);
            scoreTextP3 = self.add.text(
                370,
                318,
                "P3: " + player3.data.list.lives,
                {
                    fontSize: "23px",
                    fill: "#2931d6",
                    strokeThickness: "5"
                }
            );
        } else if (curPlayer == "player4") {
            image4 = self.add.image(480, 325, "p4").setScale(0.9);
            scoreTextP4 = self.add.text(
                500,
                318,
                "P4: " + player4.data.list.lives,
                {
                    fontSize: "23px",
                    fill: "#347628",
                    strokeThickness: "5"
                }
            );
        }
    }

    //PURPOSE: TO USE WITH SOCKET ANIMATIONS
    function toggleTrue(keySearched) {
        //MAKE ALL !!!!FALSE!!!!
        var obj = {
            neutralRight: false,
            neutralLeft: false,
            leftRun: false,
            leftPunch: false,
            leftKick: false,
            leftJump: false,
            leftHurt: false,
            rightRun: false,
            rightPunch: false,
            rightKick: false,
            rightJump: false,
            jumpNeutralRight: false,
            jumpNeutralLeft: false,
            rightHurt: false
        };
        obj[keySearched] = true;
        return obj;
    }

    function checkIfInRange() {
        var allPlayers = players.getChildren();
        var nearbyEnemies = [];
        allPlayers.forEach(function(p) {
            if (p.data.list.socketId == mainPlayerId) {
                var mainCoordinateX = p.x;
                var mainCoordinateY = p.y;
                for (var i = 0; i < allPlayers.length; i++) {
                    if (allPlayers[i].data.list.socketId != mainPlayerId) {
                        var distance = Phaser.Math.Distance.Between(
                            mainCoordinateX,
                            mainCoordinateY,
                            allPlayers[i].x,
                            allPlayers[i].y
                        );
                        if (distance <= 45) {
                            var nearbyEnemy = allPlayers[i];
                            nearbyEnemies.push(nearbyEnemy);
                        }
                    }
                }
            }
        });
        return nearbyEnemies;
    }
    function doDmgLeft(enemyArray, self) {
        var dmgQuantity = Math.floor(Math.random() * 4) + 2;
        enemyArray.forEach(function(enemy) {
            var hp = enemy.data.list.hp - dmgQuantity;
            var enemyData = {
                socketId: enemy.data.list.socketId,
                hp,
                leftHurt: false,
                rightHurt: true
            };
            self.socket.emit("playerDamaged", { enemyData });
        });
    }
    function doDmgRight(enemyArray, self) {
        var dmgQuantity = Math.floor(Math.random() * 4) + 2;
        enemyArray.forEach(function(enemy) {
            var hp = enemy.data.list.hp - dmgQuantity;
            var enemyData = {
                socketId: enemy.data.list.socketId,
                hp,
                leftHurt: true,
                rightHurt: false
            };
            self.socket.emit("playerDamaged", { enemyData });
        });
    }
    function setFriction(player, platform) {
        if (platform.key === "ice-platform") {
            player.body.x -= platform.body.x - platform.body.prev.x;
        }
    }
    // function makeSound(self) {
    //     self.socket.emit("sound", "anysound");
    // }
})(); // CLOSE IIFE

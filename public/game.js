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

function preload() {
    this.load.image("sky", "assets/sky2.jpg");
    this.load.image("ground", "assets/platform.png");
    this.load.spritesheet("player1", "assets/player1.png", {
        frameWidth: 80,
        frameHeight: 90
    });
}

function create() {
    this.socket = io(); //SOCKET ACTIVATED
    this.add.image(320, 180, "sky");
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
    platforms = this.physics.add.staticGroup();
    //ADD PLAYERS
    player1 = this.physics.add.sprite(100, 150, "player1");
    player1.setScale(0.5, 0.5);
    player1.setData({ alive: true, lives: 5, jump: 0, downFlag: false });
    player1.body.setGravityY(300);
    //CLOSE ADD PLAYERS
    this.physics.add.collider(player1, platforms);

    platforms
        .create(320, 290, "ground")
        .setScale(1.2)
        .refreshBody();

    player1.setBounce(0.2);
    // player1.setCollideWorldBounds(false);

    this.anims.create({
        key: "neutral",
        frames: [{ key: "player1", frame: 0 }],
        frameRate: 20
    });

    this.anims.create({
        key: "leftRun",
        frames: this.anims.generateFrameNumbers("player1", {
            start: 14,
            end: 18
        }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: "leftPunch",
        frames: this.anims.generateFrameNumbers("player1", {
            start: 0,
            end: 3
        }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: "leftKick",
        frames: this.anims.generateFrameNumbers("player1", {
            start: 10,
            end: 13
        }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: "leftJump",
        frames: this.anims.generateFrameNumbers("player1", {
            start: 7,
            end: 7
        }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: "leftHurt",
        frames: this.anims.generateFrameNumbers("player1", {
            start: 13,
            end: 15
        }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: "rightRun",
        frames: this.anims.generateFrameNumbers("player1", {
            start: 3,
            end: 7
        }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: "rightPunch",
        frames: this.anims.generateFrameNumbers("player1", {
            start: 20,
            end: 23
        }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: "rightKick",
        frames: this.anims.generateFrameNumbers("player1", {
            start: 24,
            end: 26
        }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: "rightJump",
        frames: this.anims.generateFrameNumbers("player1", {
            start: 29,
            end: 29
        }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: "rightHurt",
        frames: this.anims.generateFrameNumbers("player1", {
            start: 24,
            end: 26
        }),
        frameRate: 10,
        repeat: -1
    });

    // DOUBLE JUMP
    var self = this;
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
    jumpListener(player1);
} //CLOSES CREATE FUNCTION

var borderLimitTop = -100;
var borderLimitLeft = -100;
var borderLimitRight = game.config.width + 100;
var borderLimitBot = game.config.height + 100;

function update() {
    cursors = this.input.keyboard.createCursorKeys();

    //CHARACTER MOVEMENTS
    function characterMove(player) {
        if (cursors.left.isDown) {
            player.setVelocityX(-200);
            player.anims.play("leftRun", true);
        } else if (player.body.touching.none) {
            // console.log("left chicken flying");
            // console.log(player.body.velocity.x);
            player.anims.play("leftJump", true);
        } else if (cursors.right.isDown) {
            player.setVelocityX(200);
            player.anims.play("rightRun", true);
        } else if (player.body.touching.none) {
            player.anims.play("rightJump", true);
        } else {
            player.setVelocityX(0);
            player.anims.play("neutral");
        }
    }
    characterMove(player1);
    //CLOSE CHARACTER MOVEMENTS

    // DOUBLE JUMP
    // if (onGroundP1) {
    //     player1.setData({ jump: 2 });
    //     player1.setGravityY(300);
    // }
    // if (cursors.up.isDown) {
    //     player1.setData({ downFlag: true });
    // } else {
    //     if (player1.data.list.downFlag) {
    //         player1.setData({ downFlag: false });
    //         if (player1.data.list.jump == 2) {
    //             player1.setData({ jump: 1 });
    //             player1.setVelocityY(-400);
    //         } else if (player1.data.list.jump == 1) {
    //             player1.setData({ jump: 0 });
    //             player1.setVelocityY(-300);
    //         }
    //     }
    // }
    // CLOSE DOUBLE JUMP

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
    deathCheck(player1);
}

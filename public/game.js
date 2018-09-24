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
        frameWidth: 72,
        frameHeight: 160
    });
}

function create() {
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
    player1.setData({ alive: true, lives: 5 });
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
        key: "left",
        frames: this.anims.generateFrameNumbers("player1", {
            start: 0,
            end: 3
        }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: "turn",
        frames: [{ key: "player1", frame: 4 }],
        frameRate: 20
    });

    this.anims.create({
        key: "right",
        frames: this.anims.generateFrameNumbers("player1", {
            start: 5,
            end: 8
        }),
        frameRate: 10,
        repeat: -1
    });

    // platforms.create(300, 200, "ground");
    // platforms.create(25, 125, "ground");
    // platforms.create(325, 110, "ground");
}

var downFlag = false;
var jump = 0;

var borderLimitTop = -100;
var borderLimitLeft = -100;
var borderLimitRight = game.config.width + 100;
var borderLimitBot = game.config.height + 100;

// livesP1 = 5;

function update() {
    cursors = this.input.keyboard.createCursorKeys();
    var onGround = player1.body.touching.down;

    //CHARACTER MOVEMENTS
    if (cursors.left.isDown) {
        player1.setVelocityX(-160);
        // console.log(player1.x, player1.y);
        player1.anims.play("left", true);
    } else if (cursors.right.isDown) {
        player1.setVelocityX(160);
        player1.anims.play("right", true);
    } else {
        player1.setVelocityX(0);
        player1.anims.play("turn");
    } //CLOSE CHARACTER MOVEMENTS

    // DOUBLE JUMP
    if (onGround) {
        jump = 2;
        player1.setGravityY(300);
    }
    if (cursors.up.isDown) {
        downFlag = true;
    } else {
        if (downFlag) {
            downFlag = false;
            if (jump == 2) {
                jump--;
                player1.setVelocityY(-400);
            } else if (jump == 1) {
                jump--;
                player1.setVelocityY(-300);
            }
        }
    } // CLOSE DOUBLE JUMP
    function resetPlayerPosition(player) {
        player.x = 100;
        player.y = 100;
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
            // player.x = 100; //randomize later
            // player.y = 150; //randomize later
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

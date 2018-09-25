var config = {
    type: Phaser.AUTO,
    width: 640,
    height: 360,
    pixelArt: true,
    roundPixels: true,
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
    this.load.image("ground", "assets/platform2.png");
    this.load.image("cloud", "assets/cloud.png");

    this.load.spritesheet("player1", "assets/player1.png", {
        frameWidth: 80,
        frameHeight: 90
    });
}

function create() {
    this.socket = io(); //SOCKET ACTIVATED
    this.add.image(320, 180, "sky");

    //SCORE TEXT
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

    //END text

    // ADD PLATFORMS
    cloud = this.physics.add.staticGroup();

    platform = this.physics.add.staticGroup();

    platform
        .create(250, 325, "ground")
        .setScale(1.2)
        .refreshBody();
    //
    // cloud.create(600, 200, "cloud");
    //
    // cloud
    //     .create(20, 150, "cloud")
    //     // .setScale(1.5)
    //     // .refreshBody()
    //     .setVelocity(Phaser.Math.Between(-200, 200), 20);

    // bombs = this.physics.add.group();

    // this.physics.add.collider(bombs, platforms);
    //
    // this.physics.add.collider(player, bombs, hitBomb, null, this);

    var clouds = cloud.create(20, 16, "cloud");
    clouds.setBounce(1);
    clouds.setCollideWorldBounds(true);
    clouds.setVelocity(Phaser.Math.Between(-200, 200), 20);
    // clouds.allowGravity = false;

    //END PLATFORMS

    //ADD PLAYERS
    player1 = this.physics.add.sprite(100, 150, "player1");
    player1.setScale(0.5, 0.5);
    player1.setData({ alive: true, lives: 5, jump: 0, downFlag: false });
    player1.body.setGravityY(300);
    //CLOSE ADD PLAYERS
    this.physics.add.collider(player1, platform);
    this.physics.add.collider(player1, cloud);

    player1.setBounce(0.2);
    player1.setCollideWorldBounds(false);

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

function update() {
    cloud.setAngularVelocity(-150);
}

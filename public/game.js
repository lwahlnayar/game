var config = {
    type: Phaser.AUTO,
    width: 640,
    height: 360,
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
    this.load.image("star", "assets/star.png");
    this.load.image("bomb", "assets/bomb.png");
    this.load.spritesheet("dude", "assets/dude.png", {
        frameWidth: 32,
        frameHeight: 48
    });
}

function create() {
    this.add.image(320, 180, "sky");
    platforms = this.physics.add.staticGroup();
    player = this.physics.add.sprite(100, 150, "dude");
    player.body.setGravityY(300);
    this.physics.add.collider(player, platforms);

    platforms
        .create(320, 290, "ground")
        .setScale(1.2)
        .refreshBody();

    player.setBounce(0.2);
    // player.setCollideWorldBounds(false);

    this.anims.create({
        key: "left",
        frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: "turn",
        frames: [{ key: "dude", frame: 4 }],
        frameRate: 20
    });

    this.anims.create({
        key: "right",
        frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    // platforms.create(300, 200, "ground");
    // platforms.create(25, 125, "ground");
    // platforms.create(325, 110, "ground");
}

var downFlag = false;
var jump = 0;

function update() {
    cursors = this.input.keyboard.createCursorKeys();
    var onGround = player.body.touching.down;

    if (cursors.left.isDown) {
        player.setVelocityX(-160);

        player.anims.play("left", true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);

        player.anims.play("right", true);
    } else {
        player.setVelocityX(0);

        player.anims.play("turn");
    }

    if (onGround) {
        jump = 2;
        // console.log(jump);
    }

    if (cursors.up.isDown) {
        downFlag = true;
    } else {
        if (downFlag) {
            downFlag = false;
            if (jump == 2) {
                jump--;
                player.setVelocityY(-400);
            } else if (jump == 1) {
                jump--;
                player.setVelocityY(-300);
            }
        }
    }
}

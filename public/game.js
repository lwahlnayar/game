// var config = {
//     type: Phaser.AUTO,
//     width: 640,
//     height: 360,
//     pixelArt: true,
//     physics: {
//         default: "arcade",
//         arcade: {
//             gravity: { y: 300 },
//             debug: false
//         }
//     },
//     scene: {
//         preload: preload,
//         create: create,
//         update: update
//     }
// };
//
// var game = new Phaser.Game(config);
//
// function preload() {
//     this.load.image("sky", "assets/sky2.jpg");
//     this.load.image("ground", "assets/platform.png");
//     this.load.spritesheet("player1", "assets/player1.png", {
//         frameWidth: 80,
//         frameHeight: 90
//     });
//     //
//     // this.load.image("gameTiles", "assets/tileset.png");
//     // this.load.tilemap("level1", "assets/map.json");
// }
//
// function create() {
//     // this.map = this.add.tilemap("level1");
//     // this.map.addTilesetImage("tiles_spritesheet", "gameTiles");
//     // this.backgroundLayer = this.map.createLayer("backgroundLayer");
//
//     this.add.image(320, 180, "sky");
//     scoreTextP1 = this.add.text(40, 16, "P1: 5", {
//         fontSize: "22px",
//         fill: "#000"
//     });
//     scoreTextP2 = this.add.text(200, 16, "P2: 0", {
//         fontSize: "22px",
//         fill: "#000"
//     });
//     scoreTextP3 = this.add.text(360, 16, "P3: 0", {
//         fontSize: "22px",
//         fill: "#000"
//     });
//     scoreTextP4 = this.add.text(520, 16, "P4: 0", {
//         fontSize: "22px",
//         fill: "#000"
//     });
//     platforms = this.physics.add.staticGroup();
//     //ADD PLAYERS
//     player1 = this.physics.add.sprite(100, 150, "player1");
//     player1.setScale(0.5, 0.5);
//     player1.setData({ alive: true, lives: 5 });
//     player1.body.setGravityY(300);
//     //CLOSE ADD PLAYERS
//     this.physics.add.collider(player1, platforms);
//
//     platforms
//         .create(320, 290, "ground")
//         .setScale(1.2)
//         .refreshBody();
//
//     player1.setBounce(0.2);
//     // player1.setCollideWorldBounds(false);
//     this.anims.create({
//         key: "neutral",
//         frames: [{ key: "player1", frame: 16 }],
//         frameRate: 20
//     });
//
//     this.anims.create({
//         key: "leftRun",
//         frames: this.anims.generateFrameNumbers("player1", {
//             start: 3,
//             end: 7
//         }),
//         frameRate: 10,
//         repeat: -1
//     });
//
//     this.anims.create({
//         key: "leftPunch",
//         frames: this.anims.generateFrameNumbers("player1", {
//             start: 0,
//             end: 3
//         }),
//         frameRate: 10,
//         repeat: -1
//     });
//
//     this.anims.create({
//         key: "leftKick",
//         frames: this.anims.generateFrameNumbers("player1", {
//             start: 10,
//             end: 13
//         }),
//         frameRate: 10,
//         repeat: -1
//     });
//     this.anims.create({
//         key: "leftJump",
//         frames: this.anims.generateFrameNumbers("player1", {
//             start: 7,
//             end: 10
//         }),
//         frameRate: 10,
//         repeat: -1
//     });
//     this.anims.create({
//         key: "leftHurt",
//         frames: this.anims.generateFrameNumbers("player1", {
//             start: 13,
//             end: 15
//         }),
//         frameRate: 10,
//         repeat: -1
//     });
//
//     this.anims.create({
//         key: "rightRun",
//         frames: this.anims.generateFrameNumbers("player1", {
//             start: 16,
//             end: 20
//         }),
//         frameRate: 10,
//         repeat: -1
//     });
//
//     this.anims.create({
//         key: "rightPunch",
//         frames: this.anims.generateFrameNumbers("player1", {
//             start: 20,
//             end: 23
//         }),
//         frameRate: 10,
//         repeat: -1
//     });
//
//     this.anims.create({
//         key: "rightKick",
//         frames: this.anims.generateFrameNumbers("player1", {
//             start: 24,
//             end: 26
//         }),
//         frameRate: 10,
//         repeat: -1
//     });
//     this.anims.create({
//         key: "rightJump",
//         frames: this.anims.generateFrameNumbers("player1", {
//             start: 26,
//             end: 29
//         }),
//         frameRate: 10,
//         repeat: -1
//     });
//     this.anims.create({
//         key: "rightHurt",
//         frames: this.anims.generateFrameNumbers("player1", {
//             start: 24,
//             end: 26
//         }),
//         frameRate: 10,
//         repeat: -1
//     });
//
//     platforms.create(300, 200, "ground");
//     platforms.create(25, 125, "ground");
//     platforms.create(325, 110, "ground");
// }
//
// var downFlag = false;
// var jump = 0;
//
// var borderLimitTop = -100;
// var borderLimitLeft = -100;
// var borderLimitRight = game.config.width + 100;
// var borderLimitBot = game.config.height + 100;
//
// // livesP1 = 5;
//
// function update() {
//     cursors = this.input.keyboard.createCursorKeys();
//     var onGround = player1.body.touching.down;
//
//     //CHARACTER MOVEMENTS
//     if (cursors.left.isDown) {
//         player1.setVelocityX(-160);
//         // console.log(player1.x, player1.y);
//         player1.anims.play("leftRun", true);
//     } else if (cursors.right.isDown) {
//         player1.setVelocityX(160);
//         player1.anims.play("rightRun", true);
//     } else {
//         player1.setVelocityX(0);
//         player1.anims.play("neutral");
//     } //CLOSE CHARACTER MOVEMENTS
//
//     // DOUBLE JUMP
//     if (onGround) {
//         jump = 2;
//         player1.setGravityY(300);
//     }
//     if (cursors.up.isDown) {
//         downFlag = true;
//     } else {
//         if (downFlag) {
//             downFlag = false;
//             if (jump == 2) {
//                 jump--;
//                 player1.setVelocityY(-400);
//             } else if (jump == 1) {
//                 jump--;
//                 player1.setVelocityY(-300);
//             }
//         }
//     } // CLOSE DOUBLE JUMP
//     function resetPlayerPosition(player) {
//         player.x = 100;
//         player.y = 100;
//     }
//
//     function deathCheck(player) {
//         var lives = player.data.list.lives;
//         if (
//             player.x > borderLimitRight ||
//             player.x < borderLimitLeft ||
//             player.y < borderLimitTop ||
//             player.y > borderLimitBot
//         ) {
//             //if breaks limits, sets player alive status to false
//             player.setData("alive", false);
//             player.setVelocity(0, 10);
//             player.setGravityY(10);
//             resetPlayerPosition(player);
//             // player.x = 100; //randomize later
//             // player.y = 150; //randomize later
//             //show death animation here
//         }
//         if (!player.data.list.alive) {
//             lives--;
//             console.log("player dies");
//             player.setData({ alive: true, lives: lives });
//             // livesP1--;
//             scoreTextP1.setText("P1: " + player.data.list.lives);
//         }
//     }
//     deathCheck(player1);
// }

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 500 },
            debug: false
        }
    },
    scene: {
        key: "main",
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var layer;

var player;
var cursors;
var groundLayer, coinLayer;
var text;
var score = 0;

function preload() {
    this.load.tilemapCSV("map", "assets/map_Tile Layer 1.csv");
    this.load.spritesheet("tiles", "assets/tilesheet_grass.png", {
        frameWidth: 32,
        frameHeight: 32
    });

    this.load.tilemapCSV("map2", "assets/map_Tile Layer 2.csv");

    this.load.spritesheet(
        "tiles2",
        "assets/tile_water-rising_16x16_8-frames.png",
        {
            frameWidth: 32,
            frameHeight: 32
        }
    );
}

function create() {
    const map = this.make.tilemap({
        key: "map",
        tileWidth: 16,
        tileHeight: 16
    });
    const tileset = map.addTilesetImage("tiles");
    layer = map.createStaticLayer(0, tileset, -30, 138);

    layer.setScale(0.9, 0.9);

    const map2 = this.make.tilemap({
        key: "map2",
        tileWidth: 16,
        tileHeight: 16
    });
    const tileset2 = map2.addTilesetImage("tiles2");
    layer2 = map2.createStaticLayer(0, tileset2, -30, 138);

    layer2.setScale(0.9, 0.9);
}
function update() {}

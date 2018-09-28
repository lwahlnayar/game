// class Example1 extends Phaser.Scene {
//     constructor() {
//         super({ key: "Example1" });
//     }
//
//     preload() {
//         this.load.image("CAT", "/assets/cat.jpeg");
//     }
//
//     create() {
//         this.image = this.add.image(400, 300, "CAT");
//
//         // this.input.keyboard.on(
//         //     "keyup_D",
//         //     function(event) {
//         //         console.log("in wannabe P");
//         //         this.image.x += 10;
//         //     },
//         //     this
//         // );
//
//         this.key_A = this.input.keyboard.addKey(
//             Phaser.Input.Keyboard.KeyCodes.A
//         );
//         this.input.on(
//             "pointerdown",
//             function(event) {
//                 this.image.x = event.x;
//                 this.image.y = event.y;
//             },
//             this
//         );
//
//         this.input.keyboard.on(
//             "keyup_D",
//             function(event) {
//                 console.log("P KEY!!!!");
//                 var physicsImg = this.physicsImg.add.image(
//                     this.image.x,
//                     this.image.y,
//                     "CAT"
//                 );
//                 // physicsImg.setVelocity(
//                 //     Phaser.Math.RND.integerInRange(-100, 100),
//                 //     -300
//                 // );
//             },
//             this
//         );
//     }
//
//     update(delta) {
//         if (this.key_A.isDown) this.image.x--;
//     }
// }

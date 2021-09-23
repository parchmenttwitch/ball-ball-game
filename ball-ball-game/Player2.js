class Player2 extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "ball2");
    this.scene = scene;
    scene.physics.world.enable(this);
    scene.add.existing(this);
    this.setBounce(0.2);
  }

  update() {
    this.anims.play("fire", true);
  }
}

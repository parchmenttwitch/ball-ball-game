class Runer extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "run");
    this.scene = scene;
    scene.physics.world.enable(this);
    scene.add.existing(this);
  }
  update() {
    this.anims.play("runing", true);
  }
}

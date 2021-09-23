class Chandelier extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "light");
    this.scene = scene;
    scene.physics.world.enable(this);
    scene.add.existing(this);
  }

  update() {
    // this.anims.play("noflash", true);
  }
}

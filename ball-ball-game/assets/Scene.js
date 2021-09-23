/**
 * 定義一個 scene，用成員變數儲存 scene 上面的物件
 * override preload, create, update 函式
 */
class Scene extends Phaser.Scene {
  /*********************************************************************************************************************** */
  constructor() {
    super();
    this.player = null;
    this.run = null;
    this.cursors = null;
    this.sofas = null;
    this.wardrobes = null;
    this.TVcabinets = null;
    this.dogs = null;
    this.tileSprite = null;
    this.animationKey = "ufo_y";
    this.finish = false;
    this.score = 0;
    this.canDoubleJump = false;
  }
  preload() {
    this.load.image("bg", "assets/bg.png");
    this.load.image("platform", "assets/platform.png");
    this.load.image("platformI", "assets/platformI.png");
    this.load.image("sofa", "assets/sofa.png");
    this.load.image("wardrobe", "assets/wardrobe.png");
    this.load.image("TVcabinet", "assets/TVcabinet.png");
    this.load.image("dog", "assets/dog.png");

    this.load.spritesheet("ufo", "assets/ballani.png", {
      frameWidth: 52,
      frameHeight: 52
    });
    this.load.spritesheet("run", "assets/run.png", {
      frameWidth: 77,
      frameHeight: 102
    });
  }
  create() {
    //捲軸背景設定、障礙物群組及UFO位置佈署

    this.tileSprite = this.add.tileSprite(400, 200, 800, 400, "bg");
    this.sofas = this.physics.add.group({
      key: "sofa",
      repeat: 50,
      setXY: { x: 100, y: 351, stepX: Math.random() * 400 + 350 } //352
    });
    this.wardrobes = this.physics.add.group({
      key: "wardrobe",
      repeat: 50,
      setXY: { x: 350, y: 318, stepX: Math.random() * 400 + 350 } //319
    });
    this.TVcabinets = this.physics.add.group({
      key: "TVcabinet",
      repeat: 50,
      setXY: { x: 600, y: 379, stepX: Math.random() * 400 + 350 } //380
    });

    this.dogs = this.physics.add.group({
      key: "dog",
      repeat: 100,
      setXY: {
        x: 850,
        y: 300,
        stepX: Math.random() * 400 + 1000
      } //300
    });

    this.platforms = this.physics.add.staticGroup();
    this.floor = this.platforms.create(400, 433, "platform");
    this.floor.setScale(2.5);
    this.floor.refreshBody();

    this.platformIs = this.physics.add.staticGroup();
    this.floor = this.platformIs.create(-34, 400, "platformI");
    this.floor.setScale(2.5);
    this.floor.refreshBody();

    this.player = new Player(this, 60, 255);
    //ufo動畫狀態設定，兩種狀態死亡(gameover)與存活(ufo_y)
    this.anims.create({
      key: "gameover",
      frames: this.anims.generateFrameNumbers("ufo", { start: 0, end: 3 }),
      frameRate: 12,
      repeat: -1
    });

    this.anims.create({
      key: "ufo_y",
      frames: [{ key: "ufo", frame: 0 }],
      frameRate: 24,
      repeat: -1
    });
    //取得鍵盤事件
    this.cursors = this.input.keyboard.createCursorKeys();

    /*********************************************************************************************************************** */

    this.time.addEvent({
      delay: 1000,
      callback: this.updateCounter,
      callbackScope: this,
      loop: true
    });

    this.physics.add.collider(this.player, this.sofas);
    this.physics.add.collider(this.player, this.wardrobes);
    this.physics.add.collider(this.player, this.TVcabinets);
    this.physics.add.collider(this.player, this.dogs);
    this.physics.add.collider(this.sofas, this.platforms);
    this.physics.add.collider(this.wardrobes, this.platforms);
    this.physics.add.collider(this.TVcabinets, this.platforms);
    // this.physics.add.collider(this.dogs, this.platforms);
    this.physics.add.collider(this.sofas, this.wardrobes);
    this.physics.add.collider(this.wardrobes, this.TVcabinets);
    // this.physics.add.collider(this.TVcabinets, this.dogs);
    // this.physics.add.collider(this.sofas, this.dogs);

    this.scoreText = this.add.text(10, 10, "score: 0", {
      fontSize: "32px",
      color: "#ffffff"
    });

    this.time.addEvent({
      delay: 1000,
      callback: this.updateCounter,
      callbackScope: this,
      loop: true
    });

    this.physics.add.overlap(
      this.player,
      this.platforms,
      this.collision,
      null,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.platformIs,
      this.collision,
      null,
      this
    );
  }

  collision(player, platform) {
    player.disableBody(true, true);
    this.animationKey = "gameover";
    this.finish = true;
    this.add.text(250, 150, "GameOver!", {
      fontSize: "64px",
      color: "#ff0000"
    });

    this.clickButton = this.add
      .text(300, 300, "[Restart Game]", { fontSize: "25px", fill: "#0f0" })
      .setInteractive({ useHandCursor: true })
      .on("pointerup", () => {
        this.restart();
      });
  }

  restart() {
    this.scene.start();
    this.animationKey = "ufo_y";
    this.finish = false;
    this.score = 0;
  }

  /*********************************************************************************************************************** */
  updateCounter() {
    if (!this.finish) {
      this.score = this.score + 0.5;
    }
  }
  update() {
    this.scoreText.setText("Score: " + this.score);
    // 時間更新設定
    // 捲軸背景位移設定
    this.tileSprite.tilePositionX += 6;

    // 障礙物位移設定
    this.sofas.setVelocityX(-100);
    this.wardrobes.setVelocityX(-100);
    this.TVcabinets.setVelocityX(-100);
    this.dogs.setVelocityX(-100);
    // 利用取得的鍵盤事件判定來執行需要的動作
    this.player.idle();

    // if (this.cursors.space.isDown) {
    //   if (this.player.body.touching.down) {
    //     this.canDoubleJump = true;
    //     player.body.setVelocityY(-100);
    //   } else if (this.canDoubleJump) {
    //     this.canDoubleJump = false;
    //     player.body.setVelocityY(-100);
    //   }

    if (this.cursors.space.isDown) {
      if (this.player.body.touching.down) {
        this.canDoubleJump = true;
        this.player.goJump();      
}
       
    

    this.player.update();
  }
}

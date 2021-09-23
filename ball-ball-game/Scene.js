/**
 * 定義一個 scene，用成員變數儲存 scene 上面的物件
 * override preload, create, update 函式
 */
class Scene extends Phaser.Scene {
  /*********************************************************************************************************************** */
  constructor() {
    super();
    this.player = null;
    this.speed = null;
    this.runer = null;
    this.cursors = null;
    this.sofas = null;
    this.wardrobes = null;
    this.TVcabinets = null;
    this.dog = null;
    this.chandelier = null;
    this.tileSprite = null;
    this.finish = false;
    this.score = 0;
    this.canDoubleJump = 0;
    this.bulb = false;
    this.change = 0;
    this.time = 0;
    this.dogcount = 0;
    this.begin = 0;
  }
  preload() {
    this.load.image("bg", "assets/bg.png");
    this.load.image("platform", "assets/platform.png");
    this.load.image("platformI", "assets/platformI.png");
    this.load.image("sofa", "assets/sofa.png");
    this.load.image("wardrobe", "assets/wardrobe.png");
    this.load.image("TVcabinet", "assets/TVcabinet.png");
    this.load.image("dog", "assets/dog.png");
    this.load.image("speed", "assets/speed.png");
    this.load.spritesheet("light", "assets/chandeliersprite.png", {
      frameWidth: 77,
      frameHeight: 102
    });
    this.load.spritesheet("ball", "assets/ballani.png", {
      frameWidth: 52,
      frameHeight: 52
    });
    this.load.spritesheet("run", "assets/runer.png", {
      frameWidth: 100,
      frameHeight: 132
    });
    this.load.spritesheet("ball2", "assets/fireball.png", {
      frameWidth: 123,
      frameHeight: 80
    });
  }
  create() {
    this.tileSprite = this.add.tileSprite(400, 200, 800, 400, "bg");
    this.sofas = this.physics.add.group({
      key: "sofa",
      repeat: 200,
      setXY: { x: 150, y: 351, stepX: Math.random() * 200 + 500 }
    });
    this.wardrobes = this.physics.add.group({
      key: "wardrobe",
      repeat: 200,
      setXY: { x: 400, y: 318, stepX: Math.random() * 200 + 500 }
    });
    this.TVcabinets = this.physics.add.group({
      key: "TVcabinet",
      repeat: 200,
      setXY: { x: 650, y: 379, stepX: Math.random() * 200 + 500 }
    });

    this.speeds = this.physics.add.staticGroup();
    this.speed = this.speeds.create(400, 200, "speed");

    this.platforms = this.physics.add.staticGroup();
    this.floor = this.platforms.create(385, 433, "platform");
    this.floor.setScale(2.5);
    this.floor.refreshBody();

    this.platformIs = this.physics.add.staticGroup();
    this.floor = this.platformIs.create(-34, 400, "platformI");
    this.floor.setScale(2.5);
    this.floor.refreshBody();

    this.platformus = this.physics.add.staticGroup();
    this.floor = this.platformus.create(400, -33, "platform");
    this.floor.setScale(2.5);
    this.floor.refreshBody();

    this.player = new Player(this, 60, 120);
    this.runer = new Runer(this, 2000, 340);
    this.chandelier = new Chandelier(this, 200, 52);
    this.player2 = new Player2(this, -58, 200);
    this.dog = new Dog(this, 800, 250);

    this.anims.create({
      key: "rotate",
      frames: this.anims.generateFrameNumbers("ball", { start: 0, end: 3 }),
      frameRate: 12,
      repeat: -1
    });
    this.anims.create({
      key: "runing",
      frames: this.anims.generateFrameNumbers("run", { start: 0, end: 7 }),
      frameRate: 14,
      repeat: -1
    });
    //人的碰撞箱修改
    this.runer.body.setCircle(45);

    this.anims.create({
      key: "dog",
      frames: [{ key: "dog", frame: 0 }],
      frameRate: 14
    });
    this.anims.create({
      key: "noflash",
      frames: [{ key: "light", frame: 0 }],
      frameRate: 14
    });
    this.anims.create({
      key: "flash",
      frames: this.anims.generateFrameNumbers("light", { start: 0, end: 1 }),
      frameRate: 6,
      repeat: -1
    });
    this.anims.create({
      key: "fire",
      frames: this.anims.generateFrameNumbers("ball2", { start: 0, end: 7 }),
      frameRate: 14,
      repeat: -1
    });
    //取得鍵盤事件
    this.cursors = this.input.keyboard.createCursorKeys();

    /*********************************************************************************************************************** */

    this.physics.add.collider(this.player, this.sofas);
    this.physics.add.collider(this.player, this.wardrobes);
    this.physics.add.collider(this.player, this.TVcabinets);
    this.physics.add.collider(this.player, this.dog);
    this.physics.add.collider(this.player, this.chandelier);
    this.physics.add.collider(this.sofas, this.platforms);
    this.physics.add.collider(this.wardrobes, this.platforms);
    this.physics.add.collider(this.TVcabinets, this.platforms);
    this.physics.add.collider(this.sofas, this.wardrobes);
    this.physics.add.collider(this.wardrobes, this.TVcabinets);
    this.physics.add.collider(this.chandelier, this.platformus);
    //分數和擊中狗的次數 文字
    this.scoreText = this.add.text(10, 10, "score: 0", {
      fontSize: "32px",
      color: "#ff0000"
    });
    this.hitdog = this.add.text(590, 10, "hitdog: 0", {
      fontSize: "32px",
      color: "#ff0000"
    });
    //分數的時間
    this.time.addEvent({
      delay: 800,
      callback: this.updateCounter,
      callbackScope: this,
      loop: true
    });
    this.time.addEvent({
      delay: 80,
      callback: this.updateCount,
      callbackScope: this,
      loop: true
    });
    //球 下邊界
    this.physics.add.overlap(
      this.player,
      this.platforms,
      this.collision,
      null,
      this
    );
    //球 左邊界
    this.physics.add.overlap(
      this.player,
      this.platformIs,
      this.collision,
      null,
      this
    );
    //球 人
    this.physics.add.overlap(
      this.player,
      this.runer,
      this.collision,
      null,
      this
    );
    //球 吊燈
    this.physics.add.overlap(
      this.player,
      this.chandelier,
      function () {
        this.bulb = true;
      },
      null,
      this
    );
    //狗 下邊界
    this.physics.add.overlap(
      this.platforms,
      this.dog,
      function () {
        this.dog.x = Math.random() * 400 + 1000;
        this.dog.setVelocityY(0);
        this.dog.y = 250;
        this.change = this.change + 1;
        this.dogcount = this.dogcount + 1;
      },
      null,
      this
    );
  }

  collision(player, platform) {
    player.disableBody(true, true);
    this.animationKey = "rotate";
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
    this.finish = false;
    this.score = 0;
    this.change = 0;
    this.dogcount = 0;
  }
  beginon() {
    this.finish = true;
    this.add.text(100, 170, "press [space] to start", {
      fontSize: "50px",
      color: "#0000ff"
    });
  }

  /*********************************************************************************************************************** */
  updateCounter() {
    if (!this.finish && this.change !== 3) {
      this.score = this.score + 1;
    }
  }
  updateCount() {
    if (this.change === 3) {
      this.score = this.score + 1;
    }
  }
  update() {
    const didPressJump = Phaser.Input.Keyboard.JustDown(this.cursors.space);
    const touchingGround = this.player.body.touching.down;
    this.speed.disableBody(true, true);
    this.scoreText.setText("Score: " + this.score);
    this.hitdog.setText("hitdog: " + this.dogcount);
    if (!this.bulb) {
      this.chandelier.anims.play("noflash", true);
    } else {
      this.chandelier.anims.play("flash", true);
    }
    if (this.begin === 0) {
      this.beginon();
      this.player.x = 60;
      this.player.y = 120;
      this.tileSprite.tilePositionX += 0;
      this.sofas.setVelocityX(0);
      this.wardrobes.setVelocityX(0);
      this.TVcabinets.setVelocityX(0);
      this.dog.setVelocityX(0);
      this.chandelier.setVelocityX(0);
      this.runer.setVelocityX(0);
      this.player2.x = -60;
      this.score = 0;
    } else if (this.change === 3) {
      this.player.disableBody(true, true);
      this.speed.enableBody(true, 400, 200, true, true);
      this.tileSprite.tilePositionX += 10;
      this.sofas.setVelocityX(-800);
      this.wardrobes.setVelocityX(-800);
      this.TVcabinets.setVelocityX(-800);
      this.dog.setVelocityX(-800);
      this.chandelier.setVelocityX(-800);
      this.runer.setVelocityX(-800);
      this.player2.setVelocityX(100);
      if (this.player2.x > 750) {
        this.player.enableBody(true, 60, 120, true, true);
        this.speed.disableBody(true, true);
        this.change = 0;
      }
    } else {
      this.tileSprite.tilePositionX += 0.5;
      this.sofas.setVelocityX(-100);
      this.wardrobes.setVelocityX(-100);
      this.TVcabinets.setVelocityX(-100);
      this.dog.setVelocityX(-100);
      this.chandelier.setVelocityX(-100);
      this.runer.setVelocityX(-200);
      this.player2.x = -60;
    }
    if (this.begin === 0 && didPressJump) {
      this.player.setVelocityY(0);
      this.restart();
      this.begin = 1;
    } else if (
      this.begin === 1 &&
      didPressJump &&
      (touchingGround || this.canDoubleJump < 2)
    ) {
      this.player.setVelocityY(-330);
      ++this.canDoubleJump;
    } else if (this.begin === 1 && touchingGround && !didPressJump) {
      this.canDoubleJump = 0;
    }

    if (this.runer.x < -40) {
      this.runer.x = 1600;
    }
    if (this.dog.x < -40 || this.dog.y < -400) {
      this.dog.x = Math.random() * 400 + 800;
      this.dog.setVelocityY(0);
      this.dog.y = 250;
    }
    if (this.chandelier.x < -40) {
      this.chandelier.x = 1200;
      this.bulb = false;
    }
    this.player.update();
    this.player2.update();
    this.runer.update();
    this.dog.update();
  }
}

/**@type{HTMLCanvasElement} */

window.addEventListener("load", function () {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 1280;
  canvas.height = 720;

  class InputHandler {
    constructor(game) {
      this.game = game;
      window.addEventListener("keydown", (e) => {
        this.game.lastKey = "P" + e.key;
      });
      window.addEventListener("keyup", (e) => {
        this.game.lastKey = "R" + e.key;
      });
    }
  }
  class OwlBear {
    constructor(game) {
      this.game = game;
      this.spriteWidth = 200;
      this.spriteHeight = 200;
      this.frameX = 0;
      this.frameY = 0;
      this.maxFrame = 10;
      this.width = this.spriteWidth;
      this.height = this.spriteHeight;
      this.x = 200;
      this.y = 200;
      this.speedX = 0;
      this.speedY = 0;
      this.maxSpeed = 2;
      this.topMargin = 200;
      this.image = document.getElementById("owlBear");
      this.fps = 60;
      this.frameInterval = 1000 / this.fps;
      this.frameTimer = 0;
    }
    draw(context) {
      //  context.fillRect(this.x, this.y, this.width, this.height);
      //draw sprite
      context.drawImage(
        this.image,
        this.frameX * this.spriteWidth,
        this.frameY * this.spriteHeight,
        this.spriteWidth,
        this.spriteHeight,
        this.x,
        this.y,
        this.spriteWidth,
        this.spriteHeight
      );
    }
    setSpeed(speedX, speedY) {
      this.speedX = speedX;
      this.speedY = speedY;
    }
    update(deltaTime) {
      this.x += this.speedX;
      this.y += this.speedY;

      //player movement from keys and sprite swap
      if (this.game.lastKey == "PArrowLeft") {
        this.setSpeed(-this.maxSpeed, 0);
        this.frameY = 3;
      } else if (this.game.lastKey == "RArrowLeft" && this.speedX < 0) {
        this.setSpeed(0, 0);
        this.frameY = 2;
      } else if (this.game.lastKey == "PArrowRight") {
        this.setSpeed(this.maxSpeed, 0);
        this.frameY = 5;
      } else if (this.game.lastKey == "RArrowRight" && this.speedX > 0) {
        this.setSpeed(0, 0);
        this.frameY = 4;
      } else if (this.game.lastKey == "PArrowUp") {
        this.setSpeed(0, -this.maxSpeed * 0.6);
        this.frameY = 7;
      } else if (this.game.lastKey == "RArrowUp" && this.speedY < 0) {
        this.setSpeed(0, 0);
        this.frameY = 6;
      } else if (this.game.lastKey == "PArrowDown") {
        this.setSpeed(0, this.maxSpeed * 0.6);
        this.frameY = 1;
      } else if (this.game.lastKey == "RArrowDown" && this.speedY > 0) {
        this.setSpeed(0, 0);
        this.frameY = 0;
      }
      //edge restrictions
      if (this.x < 0) {
        this.x = 0;
      } else if (this.x + this.width > this.game.width) {
        this.x = this.game.width - this.width;
      }

      if (this.y < 0 + this.topMargin) {
        this.y = this.topMargin;
      } else if (this.y + this.height > this.game.height) {
        this.y = this.game.height - this.height;
      }

      //animate sprites
      if (this.frameTimer > this.frameInterval) {
        if (this.frameX < this.maxFrame) {
          this.frameX++;
        } else {
          this.frameX = 0;
        }
        this.frameTimer = 0;
      } else {
        this.frameTimer += deltaTime;
      }
    }
  }
  class Bush {
    constructor(game) {
      this.game = game;
      this.image = document.getElementById("bushImg");
      this.imageWidth = 200;
      this.imageHeight = 200;
      this.width = this.imageWidth;
      this.height = this.imageHeight;
      this.x = Math.random() * game.width - this.width;
      this.y = 200 + Math.random() * (game.height - this.height - 200);
    }
    draw(context) {
      context.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
    update() {}
  }
  class Plant {
    constructor(game) {
      this.game = game;
      this.image = document.getElementById("plantImg");
      this.imageWidth = 212;
      this.imageHeight = 118;
      this.width = this.imageWidth;
      this.height = this.imageHeight;
      this.x = Math.random() * game.width - this.width;
      this.y = 200 + Math.random() * (game.height - this.height - 200);
    }
    draw(context) {
      context.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
    update() {}
  }
  class Grass {
    constructor(game) {
      this.game = game;
      this.image = document.getElementById("grassImg");
      this.imageWidth = 103;
      this.imageHeight = 183;
      this.width = this.imageWidth;
      this.height = this.imageHeight;
      this.x = Math.random() * game.width - this.width;
      this.y = 200 + Math.random() * (game.height - this.height - 200);
    }
    draw(context) {
      context.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
    update() {}
  }
  class Game {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.latKey = undefined;
      this.input = new InputHandler(this);
      this.owlBear = new OwlBear(this);
      this.numberOfPlants = 10;
      this.plantsArray = [];
      this.gameObjects = [];
    }
    render(context, deltaTime) {
      this.gameObjects = [this.owlBear, ...this.plantsArray];
      this.gameObjects.sort((a, b) => {
        return a.y + a.height - (b.y + b.height);
      });
      this.gameObjects.forEach((object) => {
        object.draw(context);
        object.update(deltaTime);
      });
    }
    init() {
      for (let i = 0; i < this.numberOfPlants; i++) {
        let randomize = Math.random();
        if (randomize < 0.3) {
          this.plantsArray.push(new Bush(this));
        } else if (randomize < 0.6) {
          this.plantsArray.push(new Plant(this));
        } else {
          this.plantsArray.push(new Grass(this));
        }
      }
    }
  }
  const game = new Game(canvas.width, canvas.height);
  game.init();
  let lastTime = 0;
  function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.render(ctx, deltaTime);

    requestAnimationFrame(animate);
  }
  animate(0);

  //load function end
});

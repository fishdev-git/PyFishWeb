//Contributions:
//Duncan Anthony: All
class object {
  constructor(col, row, type) {
    this.col = col;
    this.row = row;
    this.type = type;
  }
  draw() {
    if (this.type == "wall") {
      image(textures[0], this.row * tileSize, this.col * tileSize);
    } else if (this.type == "void") {
      image(textures[0], this.row * tileSize, this.col * tileSize);
    }
  }
  scollidec(entity, radius) {
    var diff = createVector(
      abs(entity.pos.x - this.row * tileSize),
      abs(entity.pos.y - this.col * tileSize)
    );
    //just kinda pretend the square is just a fat circle
    if (diff.x > tileSize / 2 + radius) {
      return false;
    }
    if (diff.y > tileSize / 2 + radius) {
      return false;
    }
    return true;
  }
}
//torch drawing
class light {
  constructor(col, row) {
    this.row = row;
    this.col = col;
    this.particles = [];
    this.ptimer = 0;
  }
  draw() {
    this.ptimer++;
    //make particles
    if (this.ptimer % 10 == 0) {
      this.particles.push(
        new smoke(
          this.row * tileSize,
          this.col * tileSize - 10,
          createVector(Math.random() * 1 - 0.5, 3)
        )
      );
    }
    stroke(0);
    strokeWeight(2);
    fill(100, 30, 0);
    rect(this.row * tileSize, this.col * tileSize, 10, 25, 5);
    noStroke();
    fill(255, 0, 0, 150);
    circle(this.row * tileSize, this.col * tileSize - 12.5, 10);
    fill(255, 150, 0, 150);
    circle(this.row * tileSize, this.col * tileSize - 12.5, 8);
    fill(255, 255, 0, 150);
    circle(this.row * tileSize, this.col * tileSize - 12.5, 4);
    for (var i = 0; i < this.particles.length; i++) {
      this.particles[i].draw();
      this.particles[i].move();
      if (this.particles[i].disttrav > 75) {
        this.particles.splice(i, 1);
        i--;
      }
    }
  }
}
//ore drawing
class ore {
  constructor(col, row, type, health) {
    this.col = col;
    this.row = row;
    this.type = type;
    this.health = health;
  }
  draw() {
    if (this.type == "reg") {
      if (this.health == 3) {
        image(textures[11], this.row * tileSize, this.col * tileSize, 150, 150);
      } else if (this.health == 2) {
        image(textures[12], this.row * tileSize, this.col * tileSize, 150, 150);
      } else {
        image(textures[13], this.row * tileSize, this.col * tileSize, 150, 150);
      }
    } else if (this.type == "rare") {
      if (this.health >= 5) {
        image(textures[14], this.row * tileSize, this.col * tileSize, 150, 150);
      } else if (this.health >= 3) {
        image(textures[15], this.row * tileSize, this.col * tileSize, 150, 150);
      } else {
        image(textures[16], this.row * tileSize, this.col * tileSize, 150, 150);
      }
    }
  }
  scollidec(entity, radius) {
    var diff = createVector(
      abs(entity.pos.x - this.row * tileSize),
      abs(entity.pos.y - this.col * tileSize)
    );
    //just kinda pretend the square is just a fat circle
    if (diff.x > tileSize / 2 + radius) {
      return false;
    }
    if (diff.y > tileSize / 2 + radius) {
      return false;
    }
    return true;
  }
}
//shope class
class shoppe {
  constructor(pos) {
    this.pos = pos;
    this.open = false;
    this.buttons = [];
    this.buttons.push(new button(this.pos.x + 100, this.pos.y, 60, 40, ">"));
    this.buttons.push(new button(this.pos.x - 100, this.pos.y, 60, 40, "<"));
    this.buttons.push(
      new button(this.pos.x + 100, this.pos.y + 100, 120, 50, "BUY")
    );
    this.buttons.push(
      new button(this.pos.x - 100, this.pos.y + 100, 120, 50, "SELL ORE")
    );
    this.buttons[0].col1 = color(200);
    this.buttons[0].col2 = color(150);
    this.buttons[1].col1 = color(200);
    this.buttons[1].col2 = color(150);
    this.buttons[3].col1 = color(0, 255, 0);
    this.buttons[3].col2 = color(0, 150, 0, 150);
    //inventory
    this.it = 0;
    this.inv = [new torch(), new pickax(), new kit(), new stim()];
  }
  draw() {
    this.checkOpen();
    push();
    translate(this.pos.x - tileSize / 2, this.pos.y - tileSize / 2 - 20);
    stroke(0);
    strokeWeight(2);
    //strings
    fill(0);
    rect(75, 15, 130, 3, 5);
    //flags
    fill(255, 0, 0);
    triangle(68, 15, 75, 40, 82, 15);
    triangle(100, 15, 107, 40, 113, 15);
    triangle(36, 15, 43, 40, 50, 15);
    fill(255, 255, 0);
    triangle(84, 15, 91, 40, 97, 15);
    triangle(52, 15, 59, 40, 66, 15);
    triangle(116, 15, 123, 40, 129, 15);
    triangle(20, 15, 27, 40, 34, 15);
    //ruf
    fill(100, 60, 0);
    rect(10, 75, 10, 140, 5);
    rect(140, 75, 10, 140, 5);
    //rails
    fill(198, 128, 0);
    rect(10, 130, 20, 60, 5);
    rect(30, 130, 20, 60, 5);
    rect(50, 130, 20, 60, 5);
    rect(75, 130, 30, 60, 5);
    rect(100, 130, 20, 60, 5);
    rect(120, 130, 20, 60, 5);
    rect(140, 130, 20, 60, 5);
    //table
    fill(100, 60, 0);
    rect(75, 90, 160, 25, 5);
    stroke(255, 0, 0);
    fill(255, 250, 200);
    rect(75, 130, 100, 40, 15);
    //sign
    textSize(30);
    fill(255, 0, 0);
    text("SHOP", 75, 140);
    pop();

    if (this.open) {
      //GUI
      stroke(0);
      fill(200, 240);
      rect(this.pos.x, this.pos.y, 400, 300, 40);
      fill(0);
      textSize(25);
      strokeWeight(2);
      text("SHOP", this.pos.x, this.pos.y - 100);
      fill(150, 200);
      rect(this.pos.x, this.pos.y, 70, 70, 10);
      this.buttons[0].draw();
      this.buttons[1].draw();
      this.buttons[2].draw();
      this.buttons[3].draw();
      //draw inventory item
      this.inv[this.it].drawBar(this.pos.x, this.pos.y, false);
      text(this.inv[this.it].type, this.pos.x, this.pos.y + 52);
      textSize(15);
      text("$" + this.inv[this.it].cost, this.pos.x, this.pos.y + 68);
    }
  }
  checkOpen() {
    var kindadist =
      (this.pos.x - hero.pos.x) ** 2 + (this.pos.y - hero.pos.y) ** 2;
    if (kindadist < 9000) {
      //open shoppe
      this.open = true;
      hero.guiize = true;
    } else {
      this.open = false;
      hero.guiize = false;
    }
  }
}
//if clicked and shop open
function shoppeClick() {
  if (session.shop.buttons[0].clicked()) {
    session.shop.it++;
    if (session.shop.it > session.shop.inv.length - 1) {
      session.shop.it = 0;
    }
  }
  if (session.shop.buttons[1].clicked()) {
    session.shop.it--;
    if (session.shop.it < 0) {
      session.shop.it = session.shop.inv.length - 1;
    }
  }
  if (session.shop.buttons[2].clicked()) {
    //if add item
    if (session.shop.inv[session.shop.it].cost <= hero.bands) {
      var thing = null;
      if (session.shop.inv[session.shop.it].type == "Torch") {
        thing = new torch();
      } else if (session.shop.inv[session.shop.it].type == "Rock Shovel") {
        thing = new pickax();
      } else if (session.shop.inv[session.shop.it].type == "Bandage Sauce") {
        thing = new kit();
      } else if (session.shop.inv[session.shop.it].type == "Smoked Hotdog") {
        thing = new stim();
      }
      var test = hero.findFirst(thing, true);
      //print(test);
    }
  }
  if (session.shop.buttons[3].clicked()) {
    //sell all gems
    for (var i = 0; i < hero.inventory.length; i++) {
      if (hero.inventory[i] != null) {
        if (hero.inventory[i].type == "ORE") {
          hero.bands += hero.inventory[i].qual;
          hero.inventory[i] = null;
        }
      }
    }
  }
}
//mite nests
class nest {
  constructor(pos) {
    this.pos = pos;
  }
  draw() {
    push();
    translate(this.pos.x, this.pos.y);
    fill(150, 75, 0);
    stroke(0);
    strokeWeight(2.2);
    //panels
    rect(0, 15, 27, 90, 15);
    rect(50, 15, 15, 90, 15);
    rect(35, 15, 15, 90, 15);
    rect(20, 15, 15, 90, 15);
    rect(-20, 15, 15, 90, 15);
    rect(-35, 15, 15, 90, 15);
    rect(-50, 15, 15, 90, 15);
    //top bars
    rect(0, 60, 120, 15, 15);
    rect(0, -30, 120, 15, 15);
    //sign
    fill(255, 255, 200);
    stroke(255, 0, 0);
    rect(0, 17, 100, 43, 15);
    textSize(25);
    fill(255, 0, 0);
    text("BOMBS", 0, 25);
    pop();
  }
  spawn() {
    var gamble = Math.random() * 170000;
    if (gamble <= 150) {
      //print("YES");
      return true;
    }
    return false;
  }
}
//class for drawing and handling the collision of the locked doors
class lockedDoor {
  constructor(pos, qual, col, row) {
    this.pos = pos;
    this.qual = qual;
    this.col = col;
    this.row = row;
  }
  draw() {
    push();
    translate(this.pos.x, this.pos.y);
    fill(53, 33, 0);
    noStroke();
    square(0, 0, 150);
    fill(30);
    rect(0, 30, 70, 90);
    circle(0, -10, 70);
    if (this.qual == 0) {
      fill("brown");
    } else if (this.qual == 1) {
      fill("silver");
    } else if (this.qual == 2) {
      fill("gold");
    }
    circle(0, 0, 30);
    rect(0, 15, 20, 40, 5);
    fill(0);
    circle(0, 0, 20);
    rect(0, 10, 10, 40, 5);
    pop();
  }
  //collision logic
  scollidec(entity, radius) {
    var diff = createVector(
      abs(entity.pos.x - this.row * tileSize),
      abs(entity.pos.y - this.col * tileSize)
    );
    //just kinda pretend the square is just a fat circle
    if (diff.x > tileSize / 2 + radius) {
      return false;
    }
    if (diff.y > tileSize / 2 + radius) {
      return false;
    }
    return true;
  }
}

//Contributions:
//Duncan Anthony: All
class player {
  constructor() {
    //player stats
    this.health = 100;
    this.stamina = 100;
    this.speed = 3;
    this.sprintspeed = 6;
    this.walkspeed = 3;
    this.tired = false;
    this.tiredTimer = 0;
    this.bands = 5;
    this.boosted = false;
    this.btimer = 0;
    this.lives = 3;
    //player phys
    this.pos = createVector(200, 200);
    this.vel = createVector(0, 0);
    //tectures
    this.images = [];
    //location data
    this.tx = 0;
    this.ty = 0;
    this.lightlevel = 100;
    this.angle = 0;
    this.lookit = [];
    //should i attack?
    this.smash = false;
    this.damage = 1;
    //inventory
    this.inventory = [null, null, null, null];
    this.invIt = 0;
    this.cloesest = null;
    this.ptimer = 0;
    //torch interaction
    this.torch = false;
    //key
    this.usekey = false;
    //in gui?
    this.guiize = false;
    //fireballs holder
    this.balls = [];
    //leg tracker
    this.lit = false;
    this.ltime = 0;
    //arm tracker
    this.raise = false;
    this.rtimer = 0;
    //partiles
    this.particles = [];
    this.ptimer = 0;
  }
  draw() {
    this.ptimer += 1;
    this.smash = false;
    stroke(0);
    fill(0);
    let mouseXRel = mouseX - width / 2;
    let mouseYRel = mouseY - height / 2;
    //draw pointing arrow
    stroke(0);
    fill(0);
    strokeWeight(4);
    push();
    //draw arrow
    translate(this.pos.x, this.pos.y);

    this.angle = atan2(mouseYRel, mouseXRel);
    rotate(this.angle);
    line(0, 0, 65, 0);
    line(55, 5, 65, 0);
    line(55, -5, 65, 0);
    pop();
    //draw player
    push();
    translate(this.pos.x, this.pos.y);
    //direction
    if (mouseXRel < 0) {
      scale(-1, 1);
    }
    image(textures[17], 0, 0, 60, 60);
    //draw legs
    noStroke();
    fill(81, 102, 157);
    if (this.vel.mag() == 0) {
      rect(12, 38, 7, 20, 5);
      rect(-12, 38, 7, 20, 5);
      fill(0);
      rect(-10, 48, 15, 7, 3);
      rect(14, 48, 15, 7, 3);
      this.ltime = 0;
    } else {
      this.ltime += 1;
      if (this.ltime / 60 >= 1 / this.speed) {
        this.ltime = 0;
        this.lit ^= true;
      }
      if (this.lit) {
        rect(12, 38, 7, 20, 5);
        rect(-12, 30, 7, 11, 5);
        fill(0);
        rect(14, 48, 15, 7, 3);
        rect(-10, 38, 15, 7, 3);
      } else {
        rect(-12, 38, 7, 20, 5);
        rect(12, 30, 7, 11, 5);
        fill(0);
        rect(-10, 48, 15, 7, 3);
        rect(14, 38, 15, 7, 3);
      }
    }
    //draw arms
    //right
    stroke(247, 141, 0);
    noFill();
    strokeWeight(5);
    if (this.raise) {
      line(27, 5, 38, 0);
      line(38, 0, 43, -10);
      noStroke();
      fill(232, 132, 222);
      circle(43, -10, 7);
      if (this.inventory[this.invIt] != null) {
        if (this.inventory[this.invIt].type == "Rock Shovel") {
          this.inventory[this.invIt].drawBar(57, -28, false);
        } else {
          this.inventory[this.invIt].drawBar(47, -18, false);
        }
      }
      this.rtimer += 1;
      if (this.rtimer / 60 >= 0.75) {
        this.raise = false;
        this.rtimer = 0;
      }
    } else {
      if (this.lit) {
        line(27, 5, 28, 23);
        noStroke();
        fill(232, 132, 222);
        circle(27, 23, 7);
        if (this.inventory[this.invIt] != null) {
          if (this.inventory[this.invIt].type == "Rock Shovel") {
            this.inventory[this.invIt].drawBar(41, 5, false);
          } else {
            this.inventory[this.invIt].drawBar(31, 15, false);
          }
        }
      } else {
        line(27, 5, 32, 20);
        noStroke();
        fill(232, 132, 222);
        circle(32, 23, 7);
        if (this.inventory[this.invIt] != null) {
          if (this.inventory[this.invIt].type == "Rock Shovel") {
            this.inventory[this.invIt].drawBar(46, 5, false);
          } else {
            this.inventory[this.invIt].drawBar(36, 15, false);
          }
        }
      }
    }
    //left
    stroke(247, 141, 0);
    noFill();
    strokeWeight(5);
    point(-27, 3);
    if (this.lit) {
      line(-28, 2, -28, 23);
      noStroke();
      fill(232, 132, 222);
      circle(-28, 23, 7);
    } else {
      line(-28, 2, -30, 23);
      noStroke();
      fill(232, 132, 222);
      circle(-30, 23, 7);
    }
    //particles
    for (var i = 0; i < this.particles.length; i++) {
      this.particles[i].draw();
      this.particles[i].move();
      if (this.particles[i].disttrav > 60) {
        this.particles.splice(i, 1);
        i--;
      }
    }
    pop();
    strokeWeight(2);
    if (!this.guiize) {
      if (mouseXRel ** 2 + mouseYRel ** 2 < 50000) {
        fill(0, 20);
        var lx = floor((this.pos.x + mouseXRel + tileSize / 2) / tileSize);
        var ly = floor((this.pos.y + mouseYRel + tileSize / 2) / tileSize);

        square(lx * tileSize, ly * tileSize, tileSize);
        this.lookit = [lx, ly];
      } else {
        this.lookit = [null, null];
      }
    }
    for (var v = 0; v < this.balls.length; v++) {
      this.balls[v].draw();
      if (this.balls[v].kill) {
        this.balls.splice(v, 1);
        v--;
      }
    }
  }
  drawHUD() {
    //draw bands
    fill(0, 100);
    noStroke();
    arc(300, 500, 1000, 200, 0, 2 * PI);
    arc(300, 0, 600, 170, 0, 2 * PI);
    //draw item boxes
    stroke(0, 150);
    strokeWeight(3);
    noFill();
    square(270, 450, 60);
    square(330, 450, 60);
    square(210, 450, 60, 20, 0, 0, 20); //outside
    square(390, 450, 60, 0, 20, 20, 0); //ouside

    fill(255, 255, 0, 200);
    arc(465, 450, 60, 60, 0, (2 * PI * this.stamina) / 100);
    fill(255, 0, 0, 200);
    arc(135, 450, 60, 60, 0, (2 * PI * this.health) / 100);
    //go backdw
    //draw on health and stamina bars
    //draw item bar
    for (var i = 0; i < this.inventory.length; i++) {
      if (this.inventory[i] != null) {
        this.inventory[i].drawBar(210 + i * 60, 450, true);
      }
    }
    //draw equipped arrow
    push();
    translate(182 + this.invIt * 60, 450);
    noStroke();
    fill(255, 0, 0);
    triangle(0, -5, 5, 0, 0, 5);
    pop();
    //draw money and weight
    fill(255, 255, 0);
    stroke(255, 255, 0);
    strokeWeight(2);
    textSize(20);
    text("$" + this.bands, 50, 460);

    //draw countdown
    var timeleft = 300 - session.countdown / 60;
    var minutes = floor(timeleft / 60);
    var seconds = floor(timeleft - minutes * 60);
    var mili = floor((timeleft - seconds - minutes * 60) * 100);
    fill(128, 0, 32);
    stroke(256, 0, 64);
    strokeWeight(2);
    textSize(40);
    if (timeleft < 59) {
      if (mili < 10) {
        text(seconds + ".0" + mili, 300, 50);
      } else {
        text(seconds + "." + mili, 300, 50);
      }
    } else {
      if (seconds < 10) {
        text(minutes + ":0" + seconds, 300, 50);
      } else {
        text(minutes + ":" + seconds, 300, 50);
      }
    }
  }
  handlePlayer() {
    if (this.boosted) {
      this.btimer++;
      this.stamina = 100;
      //print("IM FEELING IT");
      if (this.btimer / 60 > 10) {
        this.boosted = false;
      }
      if (this.ptimer / 60 >= 0.3) {
        this.ptimer = 0;
        this.particles.push(
          new stimpart(
            Math.random() * 30 - 15,
            Math.random() * 30 - 15,
            createVector(Math.random() * 1 - 0.5, 3)
          )
        );
      }
    }
    //user input
    //sprint detection
    if (keyIsDown(SHIFT) && !this.tired) {
      this.speed = this.sprintspeed;
      this.stamina -= 0.5;
    } else {
      this.speed = this.walkspeed;
      //if fully tired slow down recovery
      if (!this.tired) {
        this.stamina += 0.5;
      }
    }
    //make sure stats don't exceed values
    if (this.stamina > 100) {
      this.stamina = 100;
    } else if (this.stamina <= 0 && !this.tired) {
      this.tired = true;
      this.tiredTimer = 0;
      this.stamina = 0;
    }
    //tired check
    if (this.tired) {
      this.tiredTimer++;
      {
        if (this.tiredTimer / 60 > 2) {
          this.tired = false;
        }
      }
    }
    //wasd movement
    if (keyIsDown(87)) {
      this.vel.y = -1;
    } else if (keyIsDown(83)) {
      this.vel.y = 1;
    } else {
      this.vel.y = 0;
    }
    if (keyIsDown(65)) {
      this.vel.x = -1;
    } else if (keyIsDown(68)) {
      this.vel.x = 1;
    } else {
      this.vel.x = 0;
    }
    //equip bar
    if (keyIsDown(49)) {
      this.invIt = 0;
    } else if (keyIsDown(50)) {
      this.invIt = 1;
    } else if (keyIsDown(51)) {
      this.invIt = 2;
    } else if (keyIsDown(52)) {
      this.invIt = 3;
    }
    //drop items
    this.ptimer++;
    if (keyIsDown(81)) {
      if (this.inventory[this.invIt] != null && this.ptimer / 60 > 0.5) {
        //there is something in thne hand
        session.floorstuffs.push(this.inventory[this.invIt]);
        session.floorstuffs[session.floorstuffs.length - 1].pos = createVector(
          this.pos.x,
          this.pos.y
        );
        this.inventory[this.invIt] = null;
      }
    }
    //pick up item
    if (keyIsDown(69)) {
      //there is something in thne hand
      if (this.closest != null && this.ptimer / 60 > 0.2) {
        if (this.findFirst(session.floorstuffs[this.closest])) {
          session.floorstuffs.splice(this.closest, 1);
          this.closest = null;
          this.ptimer = 0;
        }
      }
    }
    //update positiona
    this.pos.add(this.vel.normalize().mult(this.speed));
    //update tile
    this.tx = floor((this.pos.x + tileSize / 2) / tileSize);
    this.ty = floor((this.pos.y + tileSize / 2) / tileSize);
    //interaction
    this.closestItem();
    //clamp stats
    if (this.health > 100) {
      this.health = 100;
    }
    if (this.health < 0) {
      this.health = 0;
    }
    if (this.stamina > 100) {
      this.stamina = 100;
    }
    if (this.stamina < 0) {
      this.stamina = 0;
    }
  }
  click() {
    if (!this.guiize) {
      if (this.inventory[this.invIt] == null) {
        //punshing barehanded
        if (this.lookit[0] != null && this.stamina >= 33) {
          //mouse is close enough to swing
          //find the rock you clicked
          this.smash = true;
          this.raise = true;
          this.damage = 1;
        }
      } else {
        if (
          this.inventory[this.invIt].type == "Torch" &&
          this.lookit[0] != null
        ) {
          this.torch = true; //flag to mark terrain change helps update darkness
          this.raise = true;
        } else if (
          this.inventory[this.invIt].type == "Rock Shovel" &&
          this.lookit[0] != null &&
          this.stamina >= 33
        ) {
          //mouse is close enough to swing
          //find the rock you clicked
          this.smash = true;
          this.raise = true;
          this.damage = 3;
        } else if (this.inventory[this.invIt].type == "Bandage Sauce") {
          glug.setVolume(volLevel / 100);
          glug.play();
          this.health += 50;
          this.inventory[this.invIt] = null;
          var hr = 10;
          while (hr != 0) {
            hr -= 1;
            this.particles.push(
              new healpart(
                Math.random() * 30 - 15,
                Math.random() * 30 - 15,
                createVector(Math.random() * 1 - 0.5, 3)
              )
            );
          }
        } else if (this.inventory[this.invIt].type == "Smoked Hotdog") {
          munch.setVolume(volLevel / 100);
          munch.play();
          this.boosted = true;
          this.btimer = 0;
          this.inventory[this.invIt] = null;
        } else if (this.inventory[this.invIt].type == "key") {
          this.usekey = true;
          this.raise = true;
        }
      }
    }
  }
  findFirst(item, spend) {
    this.valid = null;
    for (var i = 0; i < this.inventory.length; i++) {
      //print(this.inventory[i]);
      if (this.inventory[i] == null) {
        if (this.valid == null) {
          this.valid = i;
        }
      } else if (item.type == this.inventory[i].type && item.type == "Torch") {
        this.inventory[i].count++;
        if (spend) {
          hero.bands -= item.cost;
        }
        return true;
      }
    }
    //print(this.valid);
    if (this.valid != null) {
      this.inventory[this.valid] = item;
      if (spend) {
        hero.bands -= item.cost;
      }
      return true;
    }
    return false;
  }
  closestItem() {
    var closest = 100 ** 2;
    for (var i = 0; i < session.floorstuffs.length; i++) {
      var kindadist =
        (session.floorstuffs[i].pos.x - this.pos.x) ** 2 +
        (session.floorstuffs[i].pos.y - this.pos.y) ** 2;
      if (kindadist < closest) {
        this.closest = i;
        closest = kindadist;
      }
    }
    if (closest >= 100 ** 2) {
      this.closest = null;
    }
  }
  hasPass() {
    for (var i = 0; i < this.inventory.length; i++) {
      if (this.inventory[i] != null) {
        if (this.inventory[i].type == "pass") {
          if (this.inventory[i].qual == 0) {
            return "next";
          }
          if (this.inventory[i].qual == 1) {
            return "dub";
          }
        }
      }
    }
    return "nah";
  }
  resetInventory() {
    for (var i = 0; i < this.inventory.length; i++) {
      if (this.inventory[i] != null) {
        if (
          this.inventory[i].type == "pass" ||
          this.inventory[i].type == "key"
        ) {
          session.floorstuffs.push(this.inventory[i]);
          session.floorstuffs[
            session.floorstuffs.length - 1
          ].pos = createVector(hero.pos.x, hero.pos.y);
        }
      }
      this.inventory[i] = null;
    }
  }
  extractReset() {
    for (var i = 0; i < this.inventory.length; i++) {
      if (this.inventory[i] != null) {
        if (
          this.inventory[i].type == "pass" ||
          this.inventory[i].type == "key"
        ) {
          this.inventory[i] = null;
        }
      }
      this.inventory[i] = null;
    }
  }
}
class healpart {
  constructor(x, y, dir) {
    this.x = x;
    this.y = y;
    this.dir = dir;

    this.disttrav = 0;
  }
  draw() {
    push();
    translate(this.x, this.y);
    fill(0, 255, 0);
    noStroke();
    rect(0, 0, 15, 5, 5);
    rect(0, 0, 5, 15, 5);
    pop();
  }
  move() {
    this.x += this.dir.x;
    this.y -= this.dir.y;

    this.disttrav += this.dir.y;
  }
}

class stimpart {
  constructor(x, y, dir) {
    this.x = x;
    this.y = y;
    this.dir = dir;

    this.disttrav = 0;
  }
  draw() {
    push();
    translate(this.x, this.y);
    stroke(200, 190, 0);
    strokeWeight(3);
    line(-7, 0, 7, -10);
    line(-7, 0, 7, 0);
    line(7, 0, -7, 10);
    pop();
  }
  move() {
    this.x += this.dir.x;
    this.y -= this.dir.y;

    this.disttrav += this.dir.y;
  }
}

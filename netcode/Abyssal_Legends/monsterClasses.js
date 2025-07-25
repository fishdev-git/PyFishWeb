//Contributions:
//Duncan Anthony: All

class bombmite {
  constructor(pos, still) {
    this.pos = pos;
    this.vel = createVector(0, 0);
    this.still = still;
    this.flashing = false;
    this.whitemask = 200;
    this.inc = false;
    this.angle = 0;
    this.name = "Bombmite";
    this.desc =
      "Spawns from Bombmite nests. Run away if one starts flashing. Resulting explosion can clear rocks.";
    this.bombtimer = 0;
    this.boom = false;
    this.target = [];
    this.calcTimer = 0;
    this.speed = 4;
    this.state = "wander";
  }
  draw() {
    push();
    translate(this.pos.x, this.pos.y);
    fill(50);
    stroke(0);
    strokeWeight(2);
    circle(0, 0, 20);
    fill(30);
    rect(0, -10, 8, 5, 10);
    fill(106, 66, 0);
    stroke(106, 66, 0);
    strokeWeight(3);
    line(0, -10, 3, -20);
    stroke(0);
    strokeWeight(2);
    fill(30);
    rect(0, -10, 8, 5, 10);
    //drawing fee
    push();
    translate(7, 8);
    rotate(this.angle);
    rect(0, 0, 8, 5, 10);
    pop();
    push();
    translate(-7, 8);
    rotate(this.angle);
    rect(0, 0, 8, 5, 10);
    pop();
    fill(255, 0, 0);
    stroke(255, 0, 0);
    point(-4, -3);
    point(4, -3);
    arc(0, 0, 5, 2, PI, 0);
    fill(0);
    stroke(0);
    strokeWeight(1);
    arc(0, 0, 5, 3, PI, 0);
    point(-4, -3);
    point(4, -3);
    if (this.flashing) {
      fill(255, this.whitemask);
      noStroke();
      //strokeWeight(2);
      circle(0, 0, 21);
      push();
      translate(-7, 8);
      rotate(this.angle);
      rect(0, 0, 8, 5, 10);
      pop();
      rect(0, -10, 8, 5, 10);
      push();
      translate(7, 8);
      rotate(this.angle);
      rect(0, 0, 8, 5, 10);
      pop();
      if (!this.inc) {
        this.whitemask -= 15;
        if (this.whitemask <= 0) {
          this.inc = true;
        }
      } else {
        this.whitemask += 15;
        if (this.whitemask >= 200) {
          this.inc = false;
        }
      }
      this.angle += 0.5;
    }

    pop();
  }
  handle() {
    //print(this.state);
    switch (this.state) {
      case "wander":
        //if I have no target calculate a new random spot -3-3 tiles away in any position
        while (this.target.length == 0) {
          this.speed = 2;
          var xChange = floor(Math.random() * 16 - 8);
          var yChange = floor(Math.random() * 16 - 8);

          this.target = findBestPath(
            session.graph,
            new vector(
              floor((this.pos.x + tileSize / 2) / tileSize),
              floor((this.pos.y + tileSize / 2) / tileSize)
            ),
            new vector(
              floor((this.pos.x + tileSize / 2) / tileSize) + xChange,
              floor((this.pos.y + tileSize / 2) / tileSize) + yChange
            )
          );
        }
        this.calcTimer += 1;
        //if the player goes into the dark
        if (this.calcTimer % 30 == 0) {
          var test = findBestPath(
            session.graph,
            new vector(
              floor((this.pos.x + tileSize / 2) / tileSize),
              floor((this.pos.y + tileSize / 2) / tileSize)
            ),
            new vector(hero.tx, hero.ty)
          );

          if (test.length != 0) {
            this.state = "chase";
          }
        }
        break;
      case "chase":
        this.speed = 3.2;
        if (this.target.length >= 10) {
          this.state = "wander";
          this.target = [];
        }
        //calc every 30 frames
        this.calcTimer += 1;
        if (this.calcTimer % 30 == 0 && this.bombtimer / 60 <= 0.75) {
          this.calcTimer = 0;
          this.target = [];
          //check if can get to player
          this.target = findBestPath(
            session.graph,
            new vector(
              floor((this.pos.x + tileSize / 2) / tileSize),
              floor((this.pos.y + tileSize / 2) / tileSize)
            ),
            new vector(hero.tx, hero.ty)
          );
        }
        break;
    }
    //check dist from player
    var kd = (hero.pos.x - this.pos.x) ** 2 + (hero.pos.y - this.pos.y) ** 2;
    if (kd <= 17000 || this.bombtimer / 60 >= 0.75) {
      this.flashing = true;
      this.bombtimer += 1;
      if (this.bombtimer / 60 > 0.75) {
        this.vel.x = 0;
        this.vel.y = 0;
        this.target = [];
      }
    } else {
      this.flashing = false;
      this.bombtimer = 0;
    }
    if (this.bombtimer / 60 >= 1.25) {
      this.boom = true;
    }
  }
  move() {
    if (this.target.length != 0) {
      this.vel.x = this.target[0].x * tileSize - this.pos.x;
      this.vel.y = this.target[0].y * tileSize - this.pos.y;
      this.vel.normalize().mult(-this.speed);
      if (
        dist(
          floor((this.pos.x + tileSize / 2) / tileSize),
          floor((this.pos.y + tileSize / 2) / tileSize),
          this.target[0].x,
          this.target[0].y
        ) == 0
      ) {
        this.target.splice(0, 1);
      }
    } else {
      this.vel = createVector(0, 0);
    }
    let check = dist(this.pos.x, this.pos.y, hero.pos.x, hero.pos.y);
    if (check <= 100 && check >= 5) {
      //if you are close to player
      this.vel.x = hero.pos.x - this.pos.x;
      this.vel.y = hero.pos.y - this.pos.y;
      this.vel.normalize().mult(-this.speed);
    } else if (check < 5) {
      //if you are really close
      this.vel.x = 0;
      this.vel.y = 0;
    }
    this.pos.sub(this.vel);
  }
}

class dhampir {
  constructor(pos, still) {
    this.pos = pos;
    this.vel = createVector(0, 0);
    this.still = still;
    this.name = "Rick";
    this.desc =
      "Can smell cave dwellars hiding in the dark. Harmless when illuminated.";
    this.it = 7;
    this.stillTimer = 0;
    this.walkTimer = 0;
    this.globTimer = 0;
    this.particles = [];
    this.target = []; //pathfinding
    this.calcTimer = 0;
    this.speed = 2;
    this.attackTimer = 0;
    //ai flags
    this.state = "wander";
    this.wanderpos = null;
  }
  draw() {
    if (this.target.length != 0) {
      fill(255, 0, 0);
      stroke(255, 0, 0);
      strokeWeight(4);
      circle(
        this.target[0].x * tileSize,
        this.target[0].y * 150 * tileSize,
        50
      );
    }
    this.globTimer++;
    push();
    translate(this.pos.x, this.pos.y);
    if (this.still) {
      image(textures[this.it], 0, 0, 50, 60);
    } else {
      image(textures[this.it], 0, 0, 100, 120);
    }
    for (var i = 0; i < this.particles.length; i++) {
      this.particles[i].draw();
      this.particles[i].move();
      if (this.particles[i].disttrav > 60) {
        this.particles.splice(i, 1);
        i--;
      }
    }
    pop();
    if (this.still) {
      this.stillTimer += 1;
      if (this.stillTimer / 60 >= 1.5 && this.it == 7) {
        this.it = 8;
        this.stillTimer = 0;
      } else if (this.stillTimer / 60 >= 4 && (this.it == 8 || this.it == 9)) {
        this.it = 7;
        this.stillTimer = 0;
      }
    } else {
      if (this.vel.mag() != 0) {
        if (this.it == 7) {
          this.it = 8;
        }
      } else {
        this.it = 7;
      }
    }
    if (this.it == 8 || this.it == 9) {
      this.walkTimer++;
      if (this.walkTimer / 60 >= 0.2 && this.it == 8) {
        this.it = 9;
        this.walkTimer = 0;
      } else if (this.walkTimer / 60 >= 0.2 && this.it == 9) {
        this.it = 8;
        this.walkTimer = 0;
      }
    } else {
      this.walkTimer = 0;
      if (this.globTimer % 20 == 0) {
        this.particles.push(
          new huh(
            Math.random() * 30 - 15,
            Math.random() * 30 - 15,
            createVector(Math.random() * 1 - 0.5, 3)
          )
        );
      }
    }
  }
  handle() {
    switch (this.state) {
      case "wander":
        //if I have no target calculate a new random spot -3-3 tiles away in any position
        while (this.target.length == 0) {
          this.speed = 1;
          var xChange = floor(Math.random() * 16 - 8);
          var yChange = floor(Math.random() * 16 - 8);

          this.target = findBestPath(
            session.graph,
            new vector(
              floor((this.pos.x + tileSize / 2) / tileSize),
              floor((this.pos.y + tileSize / 2) / tileSize)
            ),
            new vector(
              floor((this.pos.x + tileSize / 2) / tileSize) + xChange,
              floor((this.pos.y + tileSize / 2) / tileSize) + yChange
            )
          );
        }
        //if the player goes into the dark
        if (hero.lightlevel > 225) {
          var test = findBestPath(
            session.graph,
            new vector(
              floor((this.pos.x + tileSize / 2) / tileSize),
              floor((this.pos.y + tileSize / 2) / tileSize)
            ),
            new vector(hero.tx, hero.ty)
          );

          if (test.length != 0) {
            this.state = "chase";
          }
        }
        break;
      case "chase":
        this.speed = 3;
        if (hero.lightlevel <= 225) {
          this.state = "wander";
          this.target = [];
        }
        //calc every 30 frames
        this.calcTimer += 1;
        if (this.calcTimer % 30 == 0) {
          //print("checking");
          this.calcTimer = 0;
          this.target = [];
          //check if can get to player
          this.target = findBestPath(
            session.graph,
            new vector(
              floor((this.pos.x + tileSize / 2) / tileSize),
              floor((this.pos.y + tileSize / 2) / tileSize)
            ),
            new vector(hero.tx, hero.ty)
          );
        }
        break;
    }
  }
  move() {
    this.attackTimer += 1;
    if (this.target.length != 0) {
      this.vel.x = this.target[0].x * tileSize - this.pos.x;
      this.vel.y = this.target[0].y * tileSize - this.pos.y;
      this.vel.normalize().mult(-this.speed);
      if (
        dist(
          floor((this.pos.x + tileSize / 2) / tileSize),
          floor((this.pos.y + tileSize / 2) / tileSize),
          this.target[0].x,
          this.target[0].y
        ) == 0
      ) {
        this.target.splice(0, 1);
        //print(this.target);
      }
    }
    let check = dist(this.pos.x, this.pos.y, hero.pos.x, hero.pos.y);
    if (check <= 100 && check >= 5) {
      //if you are close to player
      this.vel.x = hero.pos.x - this.pos.x;
      this.vel.y = hero.pos.y - this.pos.y;
      this.vel.normalize().mult(-this.speed);
    } else if (check < 5) {
      //if you are really close
      this.vel.x = 0;
      this.vel.y = 0;
      if (this.attackTimer / 60 > 3 && hero.lightlevel > 250) {
        //print("ready to attack");
        //ATTACK
        hero.health -= 80;
        this.attackTimer = 0;
      }
    }
    this.pos.sub(this.vel);
  }
}

class cavewizard {
  constructor(pos, still) {
    this.pos = pos;
    this.vel = createVector(0, 0);
    this.speed = 3;
    this.still = still;
    this.name = "Cave Wizard";
    this.desc =
      "Attacks cave dwellars holding the pass to the next cave. Summons a ring of fireballs around target that slowly fire in their direction.";
    this.it = 3;
    this.stillTimer = 0;
    this.smokeTimer = 0;
    this.particles = [];
    this.target = [];
    this.state = "chillin";
    this.calcTimer = 0;
    this.angle = PI / 32;
    this.bounce = 0;
  }
  draw() {
    push();
    translate(this.pos.x, this.pos.y);

    if (this.still) {
      this.stillTimer += 1;
      if (this.stillTimer / 60 >= 1.5 && this.it == 3) {
        this.it = 4;
        this.stillTimer = 0;
      } else if (this.stillTimer / 60 >= 4 && this.it == 4) {
        this.it = 3;
        this.stillTimer = 0;
      }
      image(images[this.it], 0, 0);
    } else {
      if (this.state == "chillin") {
        this.it = 3;
      } else {
        //print(this.vel)
        if (this.vel.mag() >= 1) {
          this.bounce++;
          if (this.bounce / 60 >= 0.25) {
            this.angle = -1 * this.angle;
            this.bounce = 0;
          }
          rotate(this.angle);
        }
        this.it = 4;
      }
      image(images[this.it], 0, 0, 80, 80);
    }
    for (var i = 0; i < this.particles.length; i++) {
      this.particles[i].draw();
      this.particles[i].move();
      if (this.particles[i].disttrav > 75) {
        this.particles.splice(i, 1);
        i--;
      }
    }
    if (this.it == 4) {
      if (this.still) {
        this.particles.push(
          new smoke(-12, -8, createVector(Math.random() * 1 - 0.5, 3))
        );
        this.particles.push(
          new smoke(15, -8, createVector(Math.random() * 1 - 0.5, 3))
        );
      } else {
        this.particles.push(
          new smoke(-26, -8, createVector(Math.random() * 1 - 0.5, 3))
        );
        this.particles.push(
          new smoke(33, -8, createVector(Math.random() * 1 - 0.5, 3))
        );
      }
    } else {
      this.particles = [];
    }
    strokeWeight(4);
    stroke(255, 0, 0);
    pop();
    this.handle();
  }
  handle() {
    switch (this.state) {
      case "chillin":
        this.target = [];
        if (hero.hasPass() != "nah") {
          this.state = "mad";
        }
        //do nothing vibe out have a good time
        break;
      case "mad":
        if (hero.hasPass() == "nah") {
          this.state = "chillin";
        }
        //shoot fireballs
        if (
          hero.balls.length == 0 &&
          dist(hero.pos.x, hero.pos.y, this.pos.x, this.pos.y) < 300
        ) {
          hero.balls.push(new fireProjectile(0));
          hero.balls.push(new fireProjectile(PI));
          hero.balls.push(new fireProjectile(PI / 2));
          hero.balls.push(new fireProjectile((3 * PI) / 2));
          hero.balls.push(new fireProjectile(PI / 4));
          hero.balls.push(new fireProjectile((3 * PI) / 4));
          hero.balls.push(new fireProjectile((5 * PI) / 4));
          hero.balls.push(new fireProjectile((7 * PI) / 4));
        }
        //calc every 30 frames
        this.calcTimer += 1;
        if (this.calcTimer % 30 == 0) {
          //print("checking");
          this.calcTimer = 0;
          this.target = [];
          //check if can get to player
          this.target = findBestPath(
            session.graph,
            new vector(
              floor((this.pos.x + tileSize / 2) / tileSize),
              floor((this.pos.y + tileSize / 2) / tileSize)
            ),
            new vector(hero.tx, hero.ty)
          );
        }
        break;
    }
    this.move();
  }
  move() {
    this.attackTimer += 1;
    if (this.target.length != 0) {
      this.vel.x = this.target[0].x * tileSize - this.pos.x;
      this.vel.y = this.target[0].y * tileSize - this.pos.y;
      this.vel.normalize().mult(-this.speed);
      if (
        dist(
          floor((this.pos.x + tileSize / 2) / tileSize),
          floor((this.pos.y + tileSize / 2) / tileSize),
          this.target[0].x,
          this.target[0].y
        ) == 0
      ) {
        //print("Here");
        this.target.splice(0, 1);
        //print(this.target);
      }
      let check = dist(this.pos.x, this.pos.y, hero.pos.x, hero.pos.y);
      if (check <= 200) {
        //if you are close to player
        this.vel.x = 0;
        this.vel.y = 0;
        this.vel.normalize().mult(-this.speed);
      }
      this.pos.sub(this.vel);
    }
  }
}
//class for handling the fireballs that the wizard creates
class fireProjectile {
  constructor(angle) {
    this.idle = true;
    this.ang = angle;
    this.pos = createVector(
      hero.pos.x + Math.cos(this.ang) * 200,
      hero.pos.y + Math.sin(this.ang) * 200
    );
    this.particles = [];
    this.vel = createVector(hero.pos.x - this.pos.x, hero.pos.y - this.pos.y);
    this.kill = false;
    this.disttrav = 0;
  }
  draw() {
    //draw fire
    for (var i = 0; i < this.particles.length; i++) {
      this.particles[i].draw();
      this.particles[i].move();
      if (this.particles[i].disttrav > 75) {
        this.particles.splice(i, 1);
        i--;
      }
    }
    if (this.idle) {
      this.ang += PI / 256;
      this.vel = createVector(Math.cos(this.ang), Math.sin(this.ang)).mult(8);
      //update to where guy is
      this.pos = createVector(
        hero.pos.x + Math.cos(this.ang) * 200,
        hero.pos.y + Math.sin(this.ang) * 200
      );
      if (Math.random() < 0.002) {
        this.vel.normalize().mult(-5);
        this.idle = false;
      }
      this.particles.push(
        new smoke(this.pos.x, this.pos.y, createVector(this.vel.x, -this.vel.y))
      );
    } else {
      //print(this.vel);
      this.particles.push(
        new smoke(this.pos.x, this.pos.y, createVector(-this.vel.x, this.vel.y))
      );
      this.pos.add(this.vel);
      this.disttrav += 5;
      if (this.disttrav >= 3000) {
        this.kill = true;
      }
      if (dist(this.pos.x, this.pos.y, hero.pos.x, hero.pos.y) < 30) {
        hero.health -= 20;
        this.kill = true;
      }
    }
  }
}

class kekheqet {
  constructor(pos, still) {
    this.pos = pos;
    this.still = still;
    this.name = "KekHeqet";
    this.desc =
      "Beware the evil Frog. Loves to grab targets with their tongue.";
    this.it = 5;
    this.size = 0;
    this.tinc = true;
    this.stillTimer = 0;
    this.particles = [];
    this.state = "wander";
    this.target = [];
    this.vel = createVector(0, 0);
    this.speed = 5;
    this.calcTimer = 0;
    this.waitTimer = 9999;
    this.ready = true;
    this.trav = 0;
    this.angle = 0;
    this.attackTimer = 9999;
    this.tong = null;
  }
  draw() {
    if (this.tong != null) {
      //print("drawing");
      this.tong.draw();
      this.size = 0;
    }
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.angle);
    if (this.still) {
      this.stillTimer += 1;
      if (this.stillTimer / 60 >= 1 && this.it == 5) {
        this.it = 6;
        this.stillTimer = 0;
      } else if (this.stillTimer / 60 >= 0.4 && this.it == 6) {
        this.it = 5;
        this.stillTimer = 0;
      }
    }
    if (this.it == 5) {
      if (this.tinc) {
        this.size += 0.5;
        if (this.size >= 9) {
          this.tinc = false;
        }
      } else {
        this.size -= 0.5;
        if (this.size <= 0) {
          this.tinc = true;
        }
      }
    }
    if (this.still) {
      image(textures[this.it], 0, 0, 40, 40);
      stroke(251, 198, 207);
      strokeWeight(3);
      point(0, 15);
      line(0, 15, 0, 16 + this.size);
    } else {
      if (this.airborn) {
        this.it = 6;
      } else {
        this.it = 5;
      }
      image(textures[this.it], 0, 0, 60, 60);
      stroke(251, 198, 207);
      strokeWeight(3);
      line(0, 20, 0, 21 + this.size);
      this.handle();
    }
    for (var i = 0; i < this.particles.length; i++) {
      this.particles[i].draw();
      this.particles[i].move();
      if (this.particles[i].disttrav > 50) {
        this.particles.splice(i, 1);
        i--;
      }
    }
    pop();
    if (this.it == 6) {
      this.particles.push(
        new wind(
          Math.random() * 30 - 15,
          Math.random() * 30 - 15,
          createVector(Math.random() * 1 - 0.5, 3)
        )
      );
    }
  }
  handle() {
    if (this.tong != null) {
      this.attackTimer += 1;
      if(this.tong.kill){
        this.tong = null;
      }
    }
    switch (this.state) {
      case "wander":
        //if I have no target calculate a new random spot -3-3 tiles away in any position
        while (this.target.length > 0) {
          var xChange = floor(Math.random() * 16 - 8);
          var yChange = floor(Math.random() * 16 - 8);

          this.target = findBestPath(
            session.graph,
            new vector(
              floor((this.pos.x + tileSize / 2) / tileSize),
              floor((this.pos.y + tileSize / 2) / tileSize)
            ),
            new vector(
              floor((this.pos.x + tileSize / 2) / tileSize) + xChange,
              floor((this.pos.y + tileSize / 2) / tileSize) + yChange
            )
          );
        }
        this.calcTimer += 1;
        if (this.calcTimer % 30 == 0) {
          //print("checking");
          this.calcTimer = 0;
          var test = findBestPath(
            session.graph,
            new vector(
              floor((this.pos.x + tileSize / 2) / tileSize),
              floor((this.pos.y + tileSize / 2) / tileSize)
            ),
            new vector(hero.tx, hero.ty)
          );

          if (test.length < 10) {
            this.state = "chase";
          }
        }
        break;
      case "chase":
        if (this.target.length >= 10) {
          this.state = "wander";
          this.target = [];
        }
        //calc every 30 frames
        this.calcTimer += 1;
        if (this.calcTimer % 30 == 0) {
          //print("checking");
          this.calcTimer = 0;
          this.target = [];
          //check if can get to player
          this.target = findBestPath(
            session.graph,
            new vector(
              floor((this.pos.x + tileSize / 2) / tileSize),
              floor((this.pos.y + tileSize / 2) / tileSize)
            ),
            new vector(hero.tx, hero.ty)
          );
        }
        break;
    }

    if (this.ready && this.tong == null) {
      this.move();
    } else {
      this.waitTimer++;
      if (this.waitTimer / 60 > 2) {
        this.ready = true;
        this.trav = 0;
      }
    }
  }
  move() {
    if (this.target.length > 1) {
      this.vel.x = this.target[0].x * tileSize - this.pos.x;
      this.vel.y = this.target[0].y * tileSize - this.pos.y;
      this.vel.normalize().mult(-this.speed);
      if (
        dist(
          floor((this.pos.x + tileSize / 2) / tileSize),
          floor((this.pos.y + tileSize / 2) / tileSize),
          this.target[0].x,
          this.target[0].y
        ) == 0
      ) {
        //print("Here");
        this.target.splice(0, 1);
        //print(this.target);
      }
    } else if (this.state == "chase") {
      this.angle =
        Math.atan2(hero.pos.y - this.pos.y, hero.pos.x - this.pos.x) - PI / 2;
      if (this.attackTimer / 60 > 3 && this.tong == null) {
        this.tong = new tongue(
          this.pos.copy(),
          createVector(hero.pos.x - this.pos.x, hero.pos.y - this.pos.y)
        );
      }
    }
    this.pos.sub(this.vel);
    if (this.ready) {
      this.trav += this.vel.mag();
    }
    if (this.trav >= 150) {
      this.angle = Math.atan2(this.vel.y, this.vel.x) + PI / 2;
      this.ready = false;
      this.waitTimer = 0;
    }
  }
}

class duckstatue {
  constructor(pos, still) {
    this.pos = pos;
    this.vel = createVector(0, 0);
    this.still = still;
    this.name = "Rock Duck";
    this.desc =
      "Appears to just be a statue of a duck. Don't take your eyes off of it, or it will get you.";
    this.angle = 0;
    this.speed = 1;
    this.dec = true;
    this.target = [];
    this.state = "mad";
    this.calcTimer = 0;
    this.attackTimer = 9999;
  }
  draw() {
    push();
    translate(this.pos.x, this.pos.y);
    noStroke();
    fill(255, 165, 0);
    rect(-8, -8, 20, 4, 5);
    stroke(255, 165, 0);
    push();
    translate(-8, -8);
    rotate(this.angle);
    strokeWeight(3);
    line(0, 0, -7, 0);
    point(0, 0);
    pop();
    strokeWeight(6);
    line(10, 25, 10, 30);
    line(10, 30, 6, 30);
    noStroke();
    fill(80);
    rect(-3, -8, 15, 8, 5);
    rect(2, 1, 8, 25, 5);
    rect(10, 15, 30, 22, 15);
    stroke(80);
    strokeWeight(7);
    line(20, 10, 22, 6);
    if (this.state == "mad" || this.still) {
      fill(255, 0, 0);
      stroke(255, 0, 0);
    } else {
      fill(255);
      stroke(255);
    }
    strokeWeight(5);
    point(0, -8);
    stroke(0);
    strokeWeight(2);
    point(0, -8);
    pop();
    if (this.dec && (this.state == "mad" || this.still)) {
      this.angle -= PI / 128;
      if (this.angle <= (-PI * 2) / 6) {
        this.dec = false;
      }
    } else if (this.state == "mad" || this.still) {
      this.angle += PI / 128;
      if (this.angle > 0) {
        this.dec = true;
      }
    }
    if (!this.still) {
      this.handle();
    }
  }
  handle() {
    var angle =
      Math.atan2(hero.pos.y - this.pos.y, hero.pos.x - this.pos.x) - PI;
    //print(Math.abs(angle - hero.angle));

    //print("duck: " + (angle % PI));
    //rint("player: " + hero.angle);
    if (angle > Math.PI) {
      angle -= 2 * Math.PI;
    } else if (angle < -Math.PI) {
      angle += 2 * Math.PI;
    }
    if (Math.abs(angle - hero.angle) < PI / 3.5) {
      this.state = "chillin";
    } else {
      this.state = "mad";
    }
    //find angle between hero.pos and this.poshttps://preview.p5js.org/16ef3ad8-f1ec-4faf-8042-f468bdd3e53b:759:10
    switch (this.state) {
      case "chillin":
        this.target = [];
        //do nothing vibe out have a good time
        break;
      case "mad":
        //calc every 30 frames
        this.calcTimer += 1;
        if (this.calcTimer % 30 == 0) {
          //print("checking");
          this.calcTimer = 0;
          this.target = [];
          //check if can get to player
          this.target = findBestPath(
            session.graph,
            new vector(
              floor((this.pos.x + tileSize / 2) / tileSize),
              floor((this.pos.y + tileSize / 2) / tileSize)
            ),
            new vector(hero.tx, hero.ty)
          );
        }
        this.move();
        break;
    }
  }
  move() {
    this.attackTimer += 1;
    if (this.target.length != 0) {
      this.vel.x = this.target[0].x * tileSize - this.pos.x;
      this.vel.y = this.target[0].y * tileSize - this.pos.y;
      this.vel.normalize().mult(-this.speed);
      if (
        dist(
          floor((this.pos.x + tileSize / 2) / tileSize),
          floor((this.pos.y + tileSize / 2) / tileSize),
          this.target[0].x,
          this.target[0].y
        ) == 0
      ) {
        //print("Here");
        this.target.splice(0, 1);
        //print(this.target);
      }
    }
    let check = dist(this.pos.x, this.pos.y, hero.pos.x, hero.pos.y);
    if (check <= 100 && check >= 30 && this.state == "mad") {
      //if you are close to player
      this.vel.x = hero.pos.x - this.pos.x;
      this.vel.y = hero.pos.y - this.pos.y;
      this.vel.normalize().mult(-this.speed);
    } else if (check < 30) {
      //if you are really close
      this.vel.x = 0;
      this.vel.y = 0;
      if (this.attackTimer / 60 > 3 && this.state == "mad") {
        //print("ready to attack");
        //ATTACK
        hero.health -= 50;
        this.attackTimer = 0;
      }
    }
    this.pos.sub(this.vel);
  }
}

class wingedGnome {
  constructor(pos, still) {
    this.pos = pos;
    this.still = still;
    this.name = "Winged Gnome";
    this.desc =
      "Phases through walls looking for cave dwellars. Stand still to avoid confrontation.";
    this.it = 1;
    this.attack = false;
    this.stillTimer = 0;
    this.wavetimer = 0;
    this.particles = [];
    this.attack = false;
    this.vel = createVector(Math.random() * 2 - 1, Math.random() * 2 - 1);
    this.upperX = session.tilemap[0].length * tileSize - tileSize / 2;
    this.upperY = session.tilemap.length * tileSize - tileSize / 2;
    this.state = "roam";
    this.speed = 2;
    this.acc = createVector(0, 0);
    this.trackTimer = 0;
    this.attackTimer = 9999;
    this.attack = false;
  }
  draw() {
    for (var i = 0; i < this.particles.length; i++) {
      this.particles[i].draw();
      if (this.particles[i].size > 60) {
        this.particles.splice(i, 1);
        break;
      }
    }
    if (this.still) {
      this.stillTimer += 1;
      if (this.stillTimer / 60 >= 1.5 && this.it == 1) {
        this.it = 2;
        this.stillTimer = 0;
      } else if (this.stillTimer / 60 >= 4 && this.it == 2) {
        this.it = 1;
        this.stillTimer = 0;
      }
    }
    if (this.attack) {
      this.it = 2;
    } else if (!this.still) {
      this.it = 1;
    }
    if (this.it == 2) {
      this.wavetimer++;
      if (this.wavetimer % 10 == 0) {
        this.particles.push(new wave(this.pos.x, this.pos.y));
      }
    } else {
      this.waveTimer = 0;
      this.particles = [];
    }
    push();
    translate(this.pos.x, this.pos.y);
    if (this.still) {
      image(textures[this.it], 0, 0, 40, 40);
    } else {
      if (this.vel.x > 0) {
        scale(-1, 1);
      }
      image(textures[this.it], 0, 0, 60, 60);
    }
    pop();
    if (!this.still) {
      this.handle();
    }
  }
  handle() {
    if (this.pos.x < -tileSize / 2 || this.pos.x > this.upperX) {
      this.vel.x *= -1;
    }
    if (this.pos.y < -tileSize / 2 || this.pos.y > this.upperY) {
      this.vel.y *= -1;
    }
    this.vel.add(this.acc.normalize().mult(3));
    this.pos.add(this.vel.normalize().mult(this.speed));
    switch (this.state) {
      case "roam":
        this.it = 1;
        this.attackTimer += 1;
        this.acc = createVector(0, 0);
        if (
          dist(hero.pos.x, hero.pos.y, this.pos.x, this.pos.y) < 300 &&
          hero.vel.mag() != 0 &&
          this.attackTimer / 60 > 1
        ) {
          this.state = "mad";
        }
        break;
      case "mad":
        this.speed = 2.5;
        this.acc = createVector(
          hero.pos.x - this.pos.x,
          hero.pos.y - this.pos.y
        );
        if (this.attackTimer / 60 < 2) {
          this.attack = false;
          this.state = "roam";
        }
        if (hero.vel.mag() == 0) {
          this.trackTimer += 1;
        } else {
          this.trackTimer = 0;
        }
        if (this.trackTimer / 60 > 1) {
          this.attack = false;
          this.state = "roam";
        }
        if (dist(hero.pos.x, hero.pos.y, this.pos.x, this.pos.y) < 100) {
          this.attack = true;
        }
        if (
          dist(hero.pos.x, hero.pos.y, this.pos.x, this.pos.y) < 60 &&
          this.attack
        ) {
          this.attack = false;
          this.attackTimer = 0;
          this.state = "roam";
          hero.health -= 30;
        }

        break;
    }
  }
}
//fairy blast
class wave {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 0;
  }
  draw() {
    stroke(255 - 1.001 ** this.size, 0, 255 - 1.1 ** this.size);
    strokeWeight(4);
    noFill();
    circle(this.x, this.y, this.size);
    this.size++;
  }
}
//fire
class smoke {
  constructor(x, y, dir) {
    this.x = x;
    this.y = y;
    this.dir = dir;
    this.size = Math.random() * 10 + 10;
    this.disttrav = 0;
  }
  draw() {
    noStroke();
    if (this.disttrav <= 10) {
      fill(255, 90, 0, 50);
    } else {
      fill(90, 50);
    }
    circle(this.x, this.y, this.size);
  }
  move() {
    this.x += this.dir.x;
    this.y -= this.dir.y;

    this.disttrav += this.dir.mag();
  }
}
//kek particles
class wind {
  constructor(x, y, dir) {
    this.x = x;
    this.y = y;
    this.dir = dir;

    this.disttrav = 0;
  }
  draw() {
    noStroke();
    if (this.disttrav <= 10) {
      fill(200, 180);
    } else {
      fill(90, 180);
    }
    rect(this.x, this.y, 2, 6, 3);
  }
  move() {
    this.x += this.dir.x;
    this.y -= this.dir.y;

    this.disttrav += this.dir.y;
  }
}
//ricks particles
class huh {
  constructor(x, y, dir) {
    this.x = x;
    this.y = y;
    this.dir = dir;

    this.disttrav = 0;
  }
  draw() {
    image(textures[10], this.x, this.y, 15, 15);
  }
  move() {
    this.x += this.dir.x;
    this.y -= this.dir.y;

    this.disttrav += this.dir.y;
  }
}
//tongue projectile
class tongue {
  constructor(pos, vel) {
    this.pos = pos;
    this.og = pos.copy();
    this.vel = vel;
    this.trav = 0;
    this.speed = 8;
    this.stuck = false;
    this.stuckTimer = 0;
    this.kill = false;
  }
  draw() {
    stroke(251, 198, 207);
    strokeWeight(3);
    line(this.og.x, this.og.y, this.pos.x, this.pos.y);

    this.move();
  }
  move() {
    if (!this.stuck) {
      this.pos.add(this.vel.normalize().mult(this.speed));
      this.trav += 5;
      if(this.trav > 300){
        
        this.kill = true;
      }

      if (dist(this.pos.x, this.pos.y, hero.pos.x, hero.pos.y) < 30) {
        this.stuck = true;
      }
    } else {
      this.stuckTimer += 1
      this.pos = hero.pos.copy();
      //pull the player
      var diff = createVector(hero.pos.x-this.og.x,hero.pos.y-this.og.y)
      hero.pos.add(diff.normalize().mult(-2));
      if(this.stuckTimer/60>3){
        this.kill = true;
      }
    }
  }
}

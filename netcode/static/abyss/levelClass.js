//Contributions:
//Duncan Anthony: All
//This file contains the class that handles world generation and everything that the world can hold"",
let tileSize = 150;
let lightDist = 600;
//change amount of partitions in the darkness
let darkPartitions = 2;
class level {
  constructor() {
    this.tilemap = [];
    this.lives = 3;
    //stuff in the world
    this.start = createVector(0, 0);
    this.walls = [];
    this.void = [];
    this.rocks = [];
    this.lights = [];
    this.floorstuffs = [];
    this.shop = null;
    this.darknessBuffer = [];
    this.doors = [];
    this.done = false; //leave flag
    //monster arrays
    this.nests = [];
    this.mites = [];
    this.wizards = [];
    this.ricks = [];
    this.ducks = [];
    this.gnomes = [];
    this.frogs = [];
    //A* stuff
    this.graph = [[]];
    //particles
    this.expl = [];

    //EXIT
    this.exit = null;
    //timer
    this.countdown = 0;
  }
  buildmap(map) {
    this.tilemap = map;
    for (var i = 0; i < this.tilemap.length; i++) {
      this.graph[i] = [];
      for (var j = 0; j < this.tilemap[i].length; j++) {
        this.graph[i][j] = 0;
        switch (this.tilemap[i][j]) {
          case "w":
            this.walls.push(new object(i, j, "wall"));
            this.graph[i][j] = -1;
            break;
          case " ":
            break;
          case "-":
            this.void.push(new object(i, j, "void"));
            break;
          case "o":
            //wAswthis.lights.push(new light(i, j));
            this.rocks.push(new ore(i, j, "reg", 3));
            this.graph[i][j] = -1;
            break;
          case "r":
            //wAswthis.lights.push(new light(i, j));
            this.rocks.push(new ore(i, j, "rare", 6));
            this.graph[i][j] = -1;
            break;
          case "s":
            this.start.x = j * tileSize;
            this.start.y = i * tileSize;
            this.exit = createVector(j * tileSize, i * tileSize);
            break;
          case "l":
            this.lights.push(new light(i, j));
            break;
          case "S":
            this.shop = new shoppe(createVector(j * tileSize, i * tileSize));
            break;
          case "n":
            this.nests.push(new nest(createVector(j * tileSize, i * tileSize)));
            break;
          case "G":
            this.ricks.push(
              new dhampir(createVector(j * tileSize, i * tileSize), false)
            );
            break;
          case "$":
            this.doors.push(
              new lockedDoor(createVector(j * tileSize, i * tileSize), 0, i, j)
            );
            this.graph[i][j] = -1;
            break;
          case "%":
            this.doors.push(
              new lockedDoor(createVector(j * tileSize, i * tileSize), 1, i, j)
            );
            this.graph[i][j] = -1;
            break;
          case "^":
            this.doors.push(
              new lockedDoor(createVector(j * tileSize, i * tileSize), 2, i, j)
            );
            this.graph[i][j] = -1;
            break;
          case "!":
            this.floorstuffs.push(new keyEnt());
            this.floorstuffs[this.floorstuffs.length - 1].qual = 0;
            this.floorstuffs[this.floorstuffs.length - 1].pos = createVector(
              j * tileSize,
              i * tileSize
            );
            break;
          case "@":
            this.floorstuffs.push(new keyEnt());
            this.floorstuffs[this.floorstuffs.length - 1].qual = 1;
            this.floorstuffs[this.floorstuffs.length - 1].pos = createVector(
              j * tileSize,
              i * tileSize
            );
            break;
          case "#":
            this.floorstuffs.push(new keyEnt());
            this.floorstuffs[this.floorstuffs.length - 1].qual = 2;
            this.floorstuffs[this.floorstuffs.length - 1].pos = createVector(
              j * tileSize,
              i * tileSize
            );
            break;
          case "P":
            this.floorstuffs.push(new pass());
            this.floorstuffs[this.floorstuffs.length - 1].pos = createVector(
              j * tileSize,
              i * tileSize
            );
            break;
          case "?":
            this.floorstuffs.push(new pass());
            this.floorstuffs[this.floorstuffs.length - 1].pos = createVector(
              j * tileSize,
              i * tileSize
            );
            this.floorstuffs[this.floorstuffs.length - 1].qual = 1;
            break;
          case "M":
            this.wizards.push(
              new cavewizard(createVector(j * tileSize, i * tileSize), false)
            );
            break;
          case "D":
            this.ducks.push(
              new duckstatue(createVector(j * tileSize, i * tileSize), false)
            );
            break;
          case "g":
            this.gnomes.push(
              new wingedGnome(createVector(j * tileSize, i * tileSize), false)
            );
            break;
          case "f":
            this.frogs.push(
              new kekheqet(createVector(j * tileSize, i * tileSize), false)
            );
            break;
        }
      }
    }
    this.updateDark();
  }
  draw() {
    noStroke();
    fill(255,150);
    ellipse(this.start.x,this.start.y, 120,50);
    this.countdown++;
    this.calcplayerlight();
    //loop through all the rocks
    for (var r = 0; r < this.rocks.length; r++) {
      this.rocks[r].draw();
      if (this.rocks[r].health <= 0) {
        //break rock
        if (this.rocks[r].type == "reg") {
          //normal rock
          var gamble = Math.random();
          if (gamble < 0.5) {
            this.floorstuffs.push(new oreEnt());
            this.floorstuffs[this.floorstuffs.length - 1].pos = createVector(
              this.rocks[r].row * tileSize,
              this.rocks[r].col * tileSize
            );
          }
        } else {
          //rare rock
          var gamble = Math.random();
          if (gamble < 0.6) {
            if (gamble < 0.3) {
              this.floorstuffs.push(new oreEnt());
              this.floorstuffs[this.floorstuffs.length - 1].pos = createVector(
                this.rocks[r].row * tileSize,
                this.rocks[r].col * tileSize
              );
              this.floorstuffs[this.floorstuffs.length - 1].qual = 3;
            } else {
              this.floorstuffs.push(new oreEnt());
              this.floorstuffs[this.floorstuffs.length - 1].pos = createVector(
                this.rocks[r].row * tileSize,
                this.rocks[r].col * tileSize
              );
            }
          }
        }
        //update maps and files
        this.graph[this.rocks[r].col][this.rocks[r].row] = 0;
        this.rocks.splice(r, 1);
        r--;
      }
      if (hero.smash) {
        if (
          this.rocks[r].row == hero.lookit[0] &&
          this.rocks[r].col == hero.lookit[1]
        ) {
          hero.smash = false;
          this.rocks[r].health -= hero.damage;
          clank.setVolume(volLevel / 100);
          clank.play();
          hero.stamina -= 30;
          if (hero.inventory[hero.invIt] != null) {
            if (hero.inventory[hero.invIt].type == "Rock Shovel") {
              hero.inventory[hero.invIt].count--;
              if (hero.inventory[hero.invIt].count == 0) {
                hero.inventory[hero.invIt] = null;
              }
            }
          }
        }
      }
    }
    for (var q = 0; q < this.walls.length; q++) {
      this.walls[q].draw();
    }
    for (var t = 0; t < this.void.length; t++) {
      this.void[t].draw();
    }
    for (var v = 0; v < this.lights.length; v++) {
      this.lights[v].draw();
    }
    //particles
    for (v = 0; v < this.expl.length; v++) {
      this.expl[v].draw();
      this.expl[v].move();
      if (this.expl[v].distdtrav >= 200) {
        this.expl.splice(v, 1);
        v--;
      }
    }
    //monsters and nests
    for (v = 0; v < this.nests.length; v++) {
      this.nests[v].draw();
      if (this.nests[v].spawn() && this.mites.length < 10) {
        this.mites.push(
          new bombmite(
            createVector(this.nests[v].pos.x, this.nests[v].pos.y),
            false
          )
        );
      }
    }
    //ricks
    for (v = 0; v < this.ricks.length; v++) {
      this.ricks[v].draw();
      this.ricks[v].move();
      this.ricks[v].handle();
    }
    //mites
    for (v = 0; v < this.mites.length; v++) {
      this.mites[v].draw();
      this.mites[v].handle();
      this.mites[v].move();
      //explosion check
      if (this.mites[v].boom) {
        //create particles
        var smokei = 0;
        //create smoke
        while (smokei < 40) {
          this.expl.push(
            new smoke(
              this.mites[v].pos.x,
              this.mites[v].pos.y,
              createVector(Math.random() * 10 - 5, Math.random() * 10 - 5)
            )
          );
          this.expl[this.expl.length - 1].size = Math.random() * 50 + 50;
          smokei++;
        }
        //damage check
        var damdist = dist(
          this.mites[v].pos.x,
          this.mites[v].pos.y,
          hero.pos.x,
          hero.pos.y
        );
        if (damdist <= 150) {
          if (damdist < 20) {
            hero.health -= 100;
          } else if (damdist < 75) {
            hero.health -= 60;
          } else {
            hero.health -= 20;
          }
        }
        //wall check
        for (var i = 0; i < this.rocks.length; i++) {
          if (
            dist(
              this.mites[v].pos.x,
              this.mites[v].pos.y,
              this.rocks[i].row * tileSize,
              this.rocks[i].col * tileSize
            ) < 300
          ) {
            this.rocks[i].health -= 4;
          }
        }
        //destroy
        this.mites.splice(v, 1);
      }
    }
    //wizards
    for (v = 0; v < this.wizards.length; v++) {
      this.wizards[v].draw();
    }
    //ducks
    for (v = 0; v < this.ducks.length; v++) {
      this.ducks[v].draw();
    }
    //gnomes
    for (v = 0; v < this.gnomes.length; v++) {
      this.gnomes[v].draw();
    }
    //frogs
    for (v = 0; v < this.frogs.length; v++) {
      this.frogs[v].draw();
    }
    //floor stuffs drawing
    for (v = 0; v < this.floorstuffs.length; v++) {
      this.floorstuffs[v].drawBar(
        this.floorstuffs[v].pos.x,
        this.floorstuffs[v].pos.y
      );
      if (v == hero.closest) {
        push();
        translate(
          this.floorstuffs[hero.closest].pos.x,
          this.floorstuffs[hero.closest].pos.y
        );
        strokeWeight(2);
        fill(200, 200);
        stroke(200, 200);
        textSize(20);
        text("[E] Pickup", 0, 50);

        pop();
      }
    }
    //locked doors
    for (v = 0; v < this.doors.length; v++) {
      this.doors[v].draw();
    }
    //exit hole
    if (dist(hero.pos.x, hero.pos.y, this.exit.x, this.exit.y) < 100) {
      strokeWeight(2);
      fill(200, 200);
      stroke(200, 200);
      textSize(20);
      text("[X] Leave", this.exit.x, this.exit.y- 30);
      if (keyIsDown(88)) {
        this.done = true;
      }
    }
    //secondary functions
    this.collisions();
    this.playerInteract();
    //this.peek();
  }
  drawShoppe() {
    //have to to this seperately so its on top
    this.shop.draw();
  }
  drawDark() {
    //this.updateDark();
    for (var z = 0; z < this.darknessBuffer.length; z++) {
      this.darknessBuffer[z].draw();
    }
  }
  updateDark() {
    this.darknessBuffer = [];
    for (var i = 0; i < this.tilemap.length * darkPartitions; i++) {
      for (var j = 0; j < this.tilemap[0].length * darkPartitions; j++) {
        let shadex =
          (j * tileSize) / darkPartitions -
          tileSize / Math.pow(darkPartitions, 2);
        let shadey =
          (i * tileSize) / darkPartitions -
          tileSize / Math.pow(darkPartitions, 2);
        let closestTorch = Infinity;
        for (var o = 0; o < this.lights.length; o++) {
          let torchDist =
            Math.pow(shadex - this.lights[o].row * tileSize, 2) +
            Math.pow(shadey - this.lights[o].col * tileSize, 2);
          if (torchDist < closestTorch) {
            closestTorch = torchDist;
          }
        }
        strokeWeight(0.1);
        let lightfill = (closestTorch * 255) / (lightDist * lightDist);
        if (lightfill > 255) {
          lightfill = 255;
        }
        this.darknessBuffer.push(
          new dark(shadex, shadey, lightfill, tileSize / darkPartitions)
        );
      }
    }
  }
  collisions() {
    for (var q = 0; q < this.walls.length; q++) {
      //if wall collides with player
      if (this.walls[q].scollidec(hero, 30)) {
        //apply a bounce
        var playervec = createVector(hero.pos.x, hero.pos.y);
        var pumpvec = createVector(
          this.walls[q].row * tileSize,
          this.walls[q].col * tileSize
        );
        var bouncevec = playervec.sub(pumpvec).mult(-1);
        bouncevec.normalize();
        hero.pos.add(bouncevec.mult(-hero.speed * 2)); //only way to prevent phasing through cornersdw
      }
    }
    for (var r = 0; r < this.rocks.length; r++) {
      //if wall collides with player
      if (this.rocks[r].scollidec(hero, 30)) {
        //apply a bounce
        var playervec2 = createVector(hero.pos.x, hero.pos.y);
        var pumpvec2 = createVector(
          this.rocks[r].row * tileSize,
          this.rocks[r].col * tileSize
        );
        var bouncevec2 = playervec2.sub(pumpvec2).mult(-1);
        bouncevec2.normalize();
        hero.pos.add(bouncevec2.mult(-hero.speed * 2)); //only way to prevent phasing through cornersdw
      }
    }
    for (r = 0; r < this.doors.length; r++) {
      //if wall collides with player
      if (this.doors[r].scollidec(hero, 30)) {
        //apply a bounce
        var playervec2 = createVector(hero.pos.x, hero.pos.y);
        var pumpvec2 = createVector(
          this.doors[r].row * tileSize,
          this.doors[r].col * tileSize
        );
        var bouncevec2 = playervec2.sub(pumpvec2).mult(-1);
        bouncevec2.normalize();
        hero.pos.add(bouncevec2.mult(-hero.speed * 2)); //only way to prevent phasing through cornersdw
      }
    }
  }

  calcplayerlight() {
    let closest = 999999;
    for (var v = 0; v < this.lights.length; v++) {
      let torchDist =
        Math.pow(hero.pos.x - this.lights[v].row * tileSize, 2) +
        Math.pow(hero.pos.y - this.lights[v].col * tileSize, 2);

      if (torchDist < closest) {
        closest = torchDist;
      }
    }
    hero.lightlevel = int((closest * 255) / lightDist ** 2);
  }
  playerInteract() {
    if (hero.torch) {
      //check if  a torch is there
      var place = true;
      //little cheaky v
      var v = 0;
      //check for other lights
      for (v = 0; v < this.lights.length; v++) {
        if (
          this.lights[v].col == hero.lookit[1] &&
          this.lights[v].row == hero.lookit[0]
        ) {
          place = false;
        }
      }
      //check for rocks
      for (v = 0; v < this.rocks.length; v++) {
        if (
          this.rocks[v].col == hero.lookit[1] &&
          this.rocks[v].row == hero.lookit[0]
        ) {
          place = false;
        }
      }
      //check for walls
      for (v = 0; v < this.walls.length; v++) {
        if (
          this.walls[v].col == hero.lookit[1] &&
          this.walls[v].row == hero.lookit[0]
        ) {
          place = false;
        }
      }
      //check for void
      for (v = 0; v < this.void.length; v++) {
        if (
          this.void[v].col == hero.lookit[1] &&
          this.void[v].row == hero.lookit[0]
        ) {
          place = false;
        }
      }
      if (place) {
        place2.setVolume(volLevel / 100);
        place2.play();
        this.lights.push(new light(hero.lookit[1], hero.lookit[0]));
        hero.inventory[hero.invIt].count--;
        if (hero.inventory[hero.invIt].count == 0) {
          hero.inventory[hero.invIt] = null;
        }
        this.updateDark();
      }
      hero.torch = false;
    }
    if (hero.usekey) {
      for (var v = 0; v < this.doors.length; v++) {
        if (
          this.doors[v].col == hero.lookit[1] &&
          this.doors[v].row == hero.lookit[0]
        ) {
          if (this.doors[v].qual == hero.inventory[hero.invIt].qual) {
            //key used like a charm

            hero.inventory[hero.invIt] = null;
            this.graph[this.doors[v].col][this.doors[v].row] = 0;
            this.doors.splice(v, 1);
            break;
          }
        }
      }
      hero.usekey = false;
    }
  }
  peek() {
    stroke(0);
    textSize(20);
    for (var i = 0; i < this.graph.length; i++) {
      for (var j = 0; j < this.graph[i].length; j++) {
        text(this.graph[i][j], j * tileSize, i * tileSize + 5);
      }
    }
  }
}

class dark {
  constructor(x, y, shade, size) {
    this.x = x;
    this.y = y;
    this.shade = shade;
    this.size = size;
  }
  draw() {
    strokeWeight(0.1);
    stroke(0, this.shade);
    fill(0, this.shade);
    square(this.x, this.y, this.size);
  }
}

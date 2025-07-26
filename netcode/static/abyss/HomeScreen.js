//Contributions:
//Duncan Anthony: All
class home {
  //builds the homescreen with all its buttons and monsters
  constructor() {
    this.colorit = 0;
    this.state = "main";
    this.buttons = [];
    this.buttons.push(new button(300, 350, 250, 30, "Start"));
    this.buttons[0].col2 = color(200, 0, 0, 100);
    this.buttons.push(new button(300, 390, 250, 30, "Options"));
    this.buttons[1].col2 = color(200, 0, 0, 100);
    this.buttons.push(new button(300, 430, 250, 30, "Monsterpedia"));
    this.buttons[2].col2 = color(200, 0, 0, 100);
    this.buttons.push(new button(140, 180, 50, 30, "Back"));
    this.buttons[3].textSize = 15;
    this.buttons.push(new button(400, 225, 30, 30, "+"));
    this.buttons[4].col1 = color(0, 255, 0);
    this.buttons[4].col2 = color(0, 150, 0);
    this.buttons.push(new button(440, 225, 30, 30, "-"));
    this.buttons.push(new button(400, 250, 40, 30, ">"));
    this.buttons.push(new button(200, 250, 40, 30, "<"));
    this.buttons[6].col1 = color(200);
    this.buttons[6].col2 = color(150);
    this.buttons[7].col1 = color(200);
    this.buttons[7].col2 = color(150);
    this.buttons.push(new button(200, 270, 100, 25, "Controls"));
    this.buttons[8].col1 = color(150);
    this.buttons[8].col2 = color(100);
    this.buttons[8].textSize = 15;
    this.monsterlist = [
      new bombmite(createVector(300, 250), true),
      new dhampir(createVector(300, 250), true),
      new cavewizard(createVector(300, 250), true),
      new kekheqet(createVector(300, 250), true),
      new duckstatue(createVector(300, 250), true),
      new wingedGnome(createVector(300, 250), true)
    ];
    this.monsterlist[0].flashing = true;
    this.monit = 0;

    this.miterator = 0;

    this.animation = new loganime();

  //  this.music = loadSound("Audio/Logo.mp3", () => {
  //   this.musicLoaded = true; // Set a flag when the music is loaded
   // });
  //  this.musicLoaded = false;
  }
  //state based homescreen drawing
  draw() {
    this.animation.draw();
    strokeWeight(2);
    //image(textures[1], 300, 250);
    //state machine for location in the menu
    switch (this.state) {
      case "main":
        this.buttons[0].draw();
        this.buttons[1].draw();
        this.buttons[2].draw();
        break;
      case "options":
        fill(200, 240);
        rect(300, 250, 400, 200, 40);
        this.buttons[3].draw();
        this.buttons[4].draw();
        this.buttons[5].draw();
        this.buttons[8].draw();
        textSize(20);
        fill(0);
        text("Options", 300, 180);
        textSize(15);
        text(`Volume: ${int(volLevel)}`, 200, 230);
        break;
      case "monsters":
        fill(200, 240);
        rect(300, 300, 400, 300, 40);
        this.buttons[3].draw();
        fill(0);
        textSize(20);
        text("Monsters", 300, 185);
        fill(150, 200);
        rect(300, 250, 70, 70, 10);
        this.monsterlist[this.monit].draw();
        this.buttons[6].draw();
        this.buttons[7].draw();
        fill(0);
        stroke(0);
        strokeWeight(2);
        textSize(20);
        text(this.monsterlist[this.monit].name, 300, 305);
        textSize(15);
        strokeWeight(1);
        text(this.monsterlist[this.monit].desc, 300, 390, 330, 100);
        break;
      case "controls":
        fill(200, 240);
        rect(300, 300, 400, 300, 40);
        this.buttons[3].draw();
        textSize(20);
        fill(0);
        text("Controls", 300, 180);
        //textAlign(CORNER);
        textSize(15)
        text("Move: WASD", 300, 210);
        text("Sprint: SHIFT", 300, 225);
        text("Interact/Pickup: E", 300, 240);
        text("Use Item: Mouse Click", 300, 255);
        text("Drop Item: Q", 300, 270);
        text("Empty hands/Rock Shovel break ore", 300, 290);
        text("The player faces the cursor", 300, 305);
        text("Find and return the key pass to ", 300, 320);
        text("the Entrance to advance", 300, 335);
        text("Find the Golden Spoon to win", 300, 350);
        
        text("THERE ARE NO VICTORY CONDITIONS RIGHT NOW", 300, 380);
        //textAlign(CENTER)

        break;
    }
    //audio player
    if (this.musicLoaded && !this.music.isPlaying()) {
      this.music.setVolume(volLevel / 100);
      //this.music.play();
    }
  }
  handleInput() {}
}
//this functions is part of the mouseclick handling for the homescreen
function handleHome() {
  // Code to run.
  switch (homescreen.state) {
    case "main":
      if (homescreen.buttons[0].clicked()) {
        appState = "Playing";
      } else if (homescreen.buttons[1].clicked()) {
        homescreen.state = "options";
      } else if (homescreen.buttons[2].clicked()) {
        homescreen.state = "monsters";
      }
      break;
    case "options":
      if (homescreen.buttons[3].clicked()) {
        homescreen.state = "main";
      }
      if (homescreen.buttons[4].clicked()) {
        if (keyIsPressed && key === "Shift") {
          volLevel += 1;
        } else {
          volLevel += 10;
        }
        homescreen.music.setVolume(volLevel / 100);
      }
      if (homescreen.buttons[5].clicked()) {
        if (keyIsPressed && key === "Shift") {
          volLevel -= 1;
        } else {
          volLevel -= 10;
        }
        homescreen.music.setVolume(volLevel / 100);
      }
      if (homescreen.buttons[8].clicked()) {
        homescreen.state = "controls";
      }
      if (volLevel < 0) {
        volLevel = 0;
        homescreen.music.setVolume(volLevel / 100);
      }
      if (volLevel > 100) {
        volLevel = 100;
        homescreen.music.setVolume(volLevel / 100);
      }
      break;
    case "monsters":
      if (homescreen.buttons[3].clicked()) {
        homescreen.state = "main";
      }
      if (homescreen.buttons[6].clicked()) {
        homescreen.monit++;
      }
      if (homescreen.buttons[7].clicked()) {
        homescreen.monit--;
      }
      if (homescreen.monit == homescreen.monsterlist.length) {
        homescreen.monit = 0;
      }
      if (homescreen.monit < 0) {
        homescreen.monit = homescreen.monsterlist.length - 1;
      }
      break;
    case "controls":
      if (homescreen.buttons[3].clicked()) {
        homescreen.state = "options";
      }
      break;
  }
}
//helps make the start animation along wit the appearnce of the shiny title badge
class loganime {
  constructor() {
    this.timer = 0;
    this.timer2 = 0;
    this.timer3 = 0;
    this.it = 0;
    this.rings = [];
    this.stop = false;
    this.rings.push(new loop(color(0, 0, 0)));
    this.rings[0].spec = true;
    this.rings[0].size = 5;
    this.title = "Abyssal Legends";
  }
  draw() {
    background(0, 100, 0);
    if (this.timer <= 80 && !this.stop) {
      this.timer += 2;
    }
    if (!this.stop) {
      this.rings.push(
        new loop(color(100 - this.timer, 50 - this.timer, 20 - this.timer))
      );
    }
    for (var i = 0; i < this.rings.length; i++) {
      this.rings[i].draw();
      if (!this.stop) {
        this.rings[i].size += 6;
      }
      if (this.rings[i].size >= 700) {
        //this.rings.splice(i, 1);
        this.stop = true;
      }
    }
    strokeWeight(2);
    stroke(255,70);
    noFill();
    textSize(25);
    text("By: Duncan Anthony",300,20);
    fill(0, 200);
    noStroke();
    circle(300, 250, 50 + this.timer);
    //draw title name
    if (this.stop) {
      noStroke();
      fill(159, 99, 0, 200);
      rect(300, 240, (this.timer2 * 300) / 60, (this.timer2 * 130) / 60, 40);
      textFont("Brush Script MT");
      textSize(this.timer2 * 0.8);
      fill(0);
      text(this.title, 300, 250);
      fill(255, 215, 0);
      this.timer3++;
      //please don't look at this if block
      if (this.it == 0) {
        text("A                 ", 300, 250);
        // "Abyssal Legends";
      } else if (this.it == 1) {
        text("  b                ", 300, 250);
      } else if (this.it == 2) {
        text("y            ", 300, 250);
      } else if (this.it == 3) {
        text("      s               ", 300, 250);
      } else if (this.it == 4) {
        text("        s               ", 300, 250);
      } else if (this.it == 5) {
        text("           a               ", 300, 250);
      } else if (this.it == 6) {
        text("              l                ", 300, 250);
      } else if (this.it == 7) {
        text("                 L              ", 300, 250);
      } else if (this.it == 8) {
        text("                    e              ", 300, 250);
      } else if (this.it == 9) {
        text("                      g              ", 300, 250);
      } else if (this.it == 10) {
        text("                         e              ", 300, 250);
      } else if (this.it == 11) {
        text("                           n              ", 300, 250);
      } else if (this.it == 12) {
        text("                              d              ", 300, 250);
      } else if (this.it == 13) {
        text("                                 s              ", 300, 250);
      }
      //print(this.it);
      if (this.timer3 % 5 == 0) {
        this.it += 1;
        if (this.it > 13) {
          this.it = 0;
        }
      }
      this.timer2++;
      if (this.timer2 > 60) {
        this.timer2 = 60;
      }
    }
  }
}
//Helper class for the animation of falling down a hole
class loop {
  constructor(col) {
    this.col = col;
    this.size = 0;
    this.spec = false;
  }
  draw() {
    noFill();
    strokeWeight(6);
    if (this.sepc) {
      strokeWeight(30);
    }
    stroke(this.col);
    circle(300, 250, this.size);
    //this.size += 3;
  }
}

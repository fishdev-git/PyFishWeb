//Contributions:
//Duncan Anthony: All
var session;
var hero;
var textures = [];
var appState = "Menu";
var matchState = "Return";
var volLevel = 100;
var homescreen;
var boop;
var clank;
var place2;
var glug;
var munch;
var dtimer = 0;
var hearts;
var gameit = 0;
var ttimer = 0;

let test = ["wwwww", "w g w", "wlSlw", "w s w", "wwwww"];

let map1 = [
  "----------www---------------",
  "---------wrG w--------------",
  "---------wr# ww-------------",
  "---------wr    w------------",
  "--------wwwwww w--www-wwwwww",
  "-wwwwwww     w w-w   w     w",
  "w   oorr w w%wow-w w w     w",
  "w    oww$w w wowww w^w  M ow",
  "w Gwwwwwownw       w     oow",
  "w     wwoww-wwwwwwwwww  ooPw",
  "wrr@rrwworrw----------wwwww-",
  "-wwwwwwwooow---wwwwww---www-",
  "wo    wwooowwww      www   w",
  "wo    w     ooo wwww oo  ! w",
  "w lSl   lsl orwwwq w orw   w",
  "w     w     owwon    ww-www-",
  "wo   owwwwwww-wooo   w------",
  "woo oow-------wwwwwww-------",
  "-wwwww----------------------",
];
let map2 = [
  "------wwwwwww--------------------",
  "------w  M  w--------------------",
  "------w  P  w-------------g------",
  "------www^www--------------------",
  "--------w^w----------------------",
  "------www^www--------------------",
  "---wwww!    w-----g--------------",
  "--w#  %ooo  w--------------------",
  "--gwwwwooooowwwww--wwwwwww-------",
  "------w   oo%  #w--w  @ Dw----www",
  "--www-w    owrrDw--w wwwww----w@w",
  "-wDrrww     wrrrw--w w--------wrw",
  "-wrr# %o    wwwwwwww$wwwwwwwwww$w",
  "--wwwwwo !   g    l       o     rw",
  "-------ww wwwwwww$wwwwwwwwww wwww",
  "--------w w-----w w--------wrw---",
  "--------wow-----w w--------wrw---",
  "-------wooow----w wwwwww---www---",
  "------w     w---w    l w---------",
  "------w  S  w---w  @ D w---------",
  "------w lsl w---w!   l w---------",
  "------wr   ow---wwwwwwww---------",
  "-------wwwww---------------------",
];
let map3 = [
  "-----www-----",
  "-----wsw-----",
  "---wwwlwww---",
  "---w     www-",
  "---wl S lwDw-",
  "---w     r@@w",
  "---wrr rrwDw-",
  "---wrr%rrwww-",
  "---wrr%rrw---",
  "-wwwrr rrw---",
  "ww@w     w---",
  "wn rf g fw---",
  "ww@w     w---",
  "-wwwrr rrw---",
  "---wrr%rrw---",
  "---wrr%rrw---",
  "---wrr rrw---",
  "---w     w---",
  "---w  o  w---",
  "---w ooo w---",
  "---wooooow---",
  "---www www---",
  "---w     w---",
  "--wM     Mw--",
  "---wwl?lww---",
  "---wwwwwww---",
];
function setup() {
  createCanvas(600, 500);
  textures = createTextures();
  session = new level();
  hero = new player();
  session.buildmap(map2);
  hero.pos.x = session.start.x;
  hero.pos.y = session.start.y;
  homescreen = new home();
  rectMode(CENTER);
  textAlign(CENTER);
  imageMode(CENTER);
  boop = loadSound("Audio/Boop3.mp3");
  clank = loadSound("Audio/clank2.mp3");
  glug = loadSound("Audio/glug2.mp3");
  munch = loadSound("Audio/swallow2.mp3");
  place2 = loadSound("Audio/place2.mp3");
  hearts = [
    new heart(createVector(width / 2 - 75, height / 2 + 35)),
    new heart(createVector(width / 2, height / 2 + 50)),
    new heart(createVector(width / 2 + 75, height / 2 + 35)),
  ];
  //frameRate(30);
}

function draw() {
  switch (appState) {
    case "Menu":
      homescreen.draw();
      //homescreen.handleInput();
      break;
    case "Playing":
      switch (matchState) {
        case "Alive":
          push();
          translate(width / 2 - hero.pos.x, height / 2 - hero.pos.y);
          background(50);
          session.draw();
          hero.draw();
          hero.handlePlayer();
          session.drawDark();
          session.drawShoppe();
          fill(0);
          stroke(0);
          pop();
          //text(`X: ${hero.lightlevel}`, 90, 15);
          hero.drawHUD();
          if (hero.health == 0) {
            matchState = "Dead";
            hero.resetInventory();
            ttimer += session.countdown;
            session.countdown = 0;
            dtimer = 0;
          }
          if (session.countdown / 60 >= 300) {
            matchState = "Left";
            ttimer += session.countdown;
            session.countdown = 0;
            dtimer = 0;
          }
          if (session.done) {
            session.done = false;
            matchState = "Extract";
            ttimer += session.countdown;
            session.countdown = 0;
            dtimer = 0;
          }
          break;

        case "Dead":
          dtimer++;
          background(50);
          fill(255, 0, 0);
          textSize(50);
          stroke(255, 0, 0);
          text("YOU DIED", width / 2, height / 2);

          textSize(20);
          var clock = 5 - dtimer / 60;
          clock = Math.trunc(clock);
          text(clock, width / 2, height / 2 + 50);
          if (clock <= 0) {
            session.lives--;
            if (session.lives == 0) {
              //lose
              appState = "Lose";
            }
            matchState = "Return";
          }
          break;
        case "Left":
          dtimer++;
          background(50);
          fill(255, 150, 0);
          textSize(40);
          stroke(255, 0, 0);
          text("YOU WERE LEFT BEHIND", width / 2, height / 2);

          textSize(20);
          var clock = 5 - dtimer / 60;
          clock = Math.trunc(clock);
          text(clock, width / 2, height / 2 + 50);
          if (clock <= 0) {
            session.lives--;
            if (session.lives == 0) {
              //lose
              appState = "Lose";
            }
            matchState = "Return";
          }
          break;
        case "Extract":
          dtimer++;
          background(50);
          fill(0, 255, 0);
          textSize(40);
          stroke(0, 255, 0);
          text("Successfully Extracted", width / 2, height / 2);

          textSize(20);
          var clock = 5 - dtimer / 60;
          clock = Math.trunc(clock);
          text(clock, width / 2, height / 2 + 50);
          if (clock <= 0) {
            session.lives--;
            if (hero.hasPass() == "next") {
              hero.extractReset();
              //move on to next level
              session = new level();
              if (this.gameit == 0) {
                this.gameit++;
                session.buildmap(map2);
              } else if (this.gameit == 1) {
                this.gameit++;
                session.buildmap(map3);
              }
              hero.pos.x = session.start.x;
              hero.pos.y = session.start.y;
              dtimer = 0;
              matchState = "NextLevel";
            } else if (hero.hasPass() == "dub") {
              appState = "win";
            } else if (session.lives == 0) {
              //lose
              appState = "Lose";
            } else {
              matchState = "Return";
            }
          }
          break;
        case "NextLevel":
          dtimer++;
          background(50);
          fill(255, 200, 0);
          textSize(40);
          stroke(255, 200, 0);
          text("Traveling to Next Cave", width / 2, height / 2);

          textSize(20);
          var clock = 5 - dtimer / 60;
          clock = Math.trunc(clock);
          text(clock, width / 2, height / 2 + 50);
          if (clock <= 0) {
            matchState = "Return";
          }
          break;
        case "Return":
          background(20);
          fill(255, 220, 0);
          textSize(50);
          stroke(255, 220, 0);
          text("Dive In", width / 2, height / 2 - 50);
          textSize(20);
          text("Press Space to Enter", width / 2, height / 2);
          if (keyIsPressed) {
            if (key == " ") {
              hero.pos.x = session.start.x;
              hero.pos.y = session.start.y;
              hero.health = 100;
              hero.stamina = 100;
              matchState = "Alive";
              hero.balls = [];
            }
          }
          for (var i = 0; i < 3; i++) {
            if (i < session.lives) {
              hearts[i].draw(false);
            } else {
              hearts[i].draw(true);
            }
          }
          break;
      }
      break;
    case "Lose":
      background(20);
      fill(255, 220, 0);
      textSize(50);
      stroke(255, 220, 0);
      text("YOU LOSE", width / 2, height / 2 - 50);
      textSize(20);
      text("Press Space to Return to Menu", width / 2, height / 2);
      if (keyIsPressed) {
        if (key == " ") {
          session = new level();
          hero = new player();
          session.buildmap(map1);
          hero.pos.x = session.start.x;
          hero.pos.y = session.start.y;
          appState = "Menu";
          matchState = "Alive";
        }
      }
      break;
    case "win":
      background(20);

      fill("gold");
      textSize(50);
      stroke("gold");
      text("YOU WIN", width / 2, height / 2 - 50);
      textSize(20);
      text("Press Space to Return to Menu", width / 2, height / 2);
      text("Time Spent in the Caves:", width / 2, height / 2 + 50);
      //draw countdown
      var total = ttimer / 60;
      var minutes = floor(total / 60);
      var seconds = floor(total - minutes * 60);
      var mili = floor((total - seconds - minutes * 60) * 100);
      strokeWeight(2);
      textSize(40);
      if (ttimer < 59) {
        if (mili < 10) {
          text(seconds + ".0" + mili, 300, 380);
        } else {
          text(seconds + "." + mili, 300, 380);
        }
      } else {
        if (seconds < 10) {
          text(minutes + ":0" + seconds, 300, 380);
        } else {
          text(minutes + ":" + seconds, 300, 380);
        }
      }
      if (keyIsPressed) {
        if (key == " ") {
          session = new level();
          hero = new player();
          session.buildmap(map1);
          hero.pos.x = session.start.x;
          hero.pos.y = session.start.y;
          appState = "Menu";
          matchState = "Alive";
        }
      }
      break;
  }
}
function mouseClicked() {
  switch (appState) {
    case "Menu":
      ttimer = 0;
      handleHome();
      break;
    case "Playing":
      hero.click();
      if (hero.guiize) {
        shoppeClick();
      }
      break;
  }
}

class heart {
  constructor(pos) {
    this.pos = pos;
  }
  draw(miss) {
    push();
    translate(this.pos.x, this.pos.y);
    if (miss) {
      fill(50);
    } else {
      fill(128, 0, 32);
    }
    noStroke();
    circle(0, 0, 30);
    rect(0, 20, 24, 40, 10);
    rect(7, 40, 10, 40, 10);
    rect(-7, 40, 10, 40, 10);
    rect(0, 10, 50, 10, 10);
    rect(-20, 23, 10, 30, 10);
    rect(20, 23, 10, 30, 10);
    pop();
  }
}

//this file handles all the items that can be dropped on the floor or equipped
class torch {
  constructor() {
    this.count = 1;
    this.type = "Torch";
    this.cost = 2;
    this.pos = null;
  }
  drawBar(x, y, showCount) {
    //draw torch
    push();
    translate(x, y);
    rotate(PI / 6);
    stroke(0);
    strokeWeight(2);
    fill(100, 30, 0);
    rect(0, 0, 10, 25, 5);
    noStroke();
    fill(255, 0, 0, 150);
    circle(0, -12.5, 10);
    fill(255, 150, 0, 150);
    circle(0, -12.5, 8);
    fill(255, 255, 0, 150);
    circle(0, -12.5, 4);
    pop();
    //text
    if (showCount) {
      fill(255, 255, 0);
      stroke(0);
      textSize(15);
      text("x" + this.count, x - 18, y - 15);
    }
  }
}
//pick ax class
class pickax {
  constructor() {
    this.count = 5;
    this.type = "Rock Shovel";
    this.cost = 3;
    this.pos = null;
  }
  drawBar(x, y, showCount) {
    //draw torch
    push();
    translate(x, y);
    rotate(PI / 6);
    stroke(0);
    strokeWeight(2);
    fill(100, 20, 0);
    rect(0, 5, 4, 55, 3);
    stroke(100);
    strokeWeight(7);
    line(10, -15, 20, -4);
    line(-10, -15, -20, -4);
    line(10, -15, -10, -15);
    pop();
  }
}

//health kit
class kit {
  constructor() {
    this.count = 5;
    this.type = "Bandage Sauce";
    this.cost = 4;
    this.pos = null;
  }
  drawBar(x, y, showCount) {
    //draw torch
    push();
    translate(x, y);
    rotate(PI / 6);
    fill(255, 250, 200);
    stroke(0);
    strokeWeight(1);
    rect(0, -5, 5, 17, 1);
    rect(0, 5, 15, 20, 3);
    fill(255, 150, 0);
    rect(0, -13, 7, 2, 1);
    noStroke();
    rect(0, 5, 14, 10);
    noFill();
    stroke(128, 0, 32);
    rect(0, 5, 5, 5, 2);
    pop();
  }
}
//stim
class stim {
  constructor() {
    this.count = 5;
    this.type = "Smoked Hotdog";
    this.cost = 7;
    this.pos = null;
  }
  drawBar(x, y, showCount) {
    //draw torch
    push();
    translate(x, y);
    rotate(-PI / 6);
    stroke(0);
    strokeWeight(1);
    fill(255, 0, 50);
    rect(17.5, 0, 3, 3, 1);
    rect(-17.5, 0, 3, 3, 1);
    rect(0, 0, 35, 5, 2);
    stroke(0);
    noFill();
    arc(0, 0, 3, 5, PI / 2, (3 * PI) / 2);
    arc(4, 0, 3, 5, PI / 2, (3 * PI) / 2);
    arc(8, 0, 3, 5, PI / 2, (3 * PI) / 2);
    arc(12, 0, 3, 5, PI / 2, (3 * PI) / 2);
    arc(16, 0, 3, 5, PI / 2, (3 * PI) / 2);
    arc(-4, 0, 3, 5, PI / 2, (3 * PI) / 2);
    arc(-8, 0, 3, 5, PI / 2, (3 * PI) / 2);
    arc(-12, 0, 3, 5, PI / 2, (3 * PI) / 2);
    arc(-16, 0, 3, 5, PI / 2, (3 * PI) / 2);
    fill(0, 150, 0);
    stroke(0);
    rect(-6, 0, 12, 5, 2);
    pop();
  }
}

class oreEnt {
  constructor() {
    this.type = "ORE";
    this.qual = 1;
    this.pos = null;
  }
  drawBar(x, y, showCount) {
    //draw torch
    push();
    translate(x, y);
    rotate(PI / 6);
    if (this.qual == 1) {
      strokeWeight(1);
      stroke(156, 100, 0);
      fill(106, 66, 0);
      circle(0, 0, 25);
      circle(0, 0, 25);
      circle(-3, 0, 22);
      circle(3, 3, 19);
      circle(3, -5, 15);
      fill("gold");
      stroke(255, 200, 0);
      circle(3, 3, 5);
      circle(4, 4, 4);
      circle(2, 3, 5);

      ellipse(-4, -4, 6, 4);

      fill(255, 70);
      noStroke();
      circle(4, 3, 7);
      circle(4, 3, 5);
      circle(4, 3, 3);

      circle(-3, -4, 7);
      circle(-3, -4, 5);
      circle(-3, -4, 3);
    } else if (this.qual == 3) {
      fill(150, 0, 150);
      stroke(255, 0, 150);
      strokeWeight(1);
      triangle(0, -10, 0, -15, -7, -10);
      rect(-4, 3, 7, 25);
      fill(100, 0, 100);
      stroke(200, 0, 100);
      triangle(0, -10, 0, -15, 7, -10);
      rect(4, 3, 7, 25);
      noStroke();
      fill(53, 33, 0);
      rect(0, 15, 25, 10, 5);
      rect(0, 19, 18, 10, 5);
    }
    pop();
  }
}
//class for the different keys
class keyEnt {
  constructor() {
    this.type = "key";
    this.qual = 0;
    this.pos = null;
  }
  drawBar(x, y, showCount) {
    //draw torch
    push();
    translate(x, y);
    noFill();
    strokeWeight(5);
    if (this.qual == 0) {
      stroke("brown");
    } else if (this.qual == 1) {
      stroke("silver");
    } else if (this.qual == 2) {
      stroke("gold");
    }
    circle(10, -10, 15);
    line(5, -5, -5, 10);
    line(-5, 10, 3, 16);
    line(0, 5, 4, 8);
    strokeWeight(2);
    if (this.qual == 0) {
      stroke(50, 50, 0, 50);
    } else if (this.qual == 1) {
      stroke(200, 50);
    } else if (this.qual == 2) {
      stroke(255, 255, 0, 50);
    }
    circle(10, -10, 15);
    line(5, -5, -5, 10);
    line(-5, 10, 3, 16);
    line(0, 5, 4, 8);
    pop();
  }
}
//class for the pass the proceeds to the next level
class pass {
  constructor() {
    this.type = "pass";
    this.qual = 0;
    this.pos = null;
  }
  drawBar(x, y, showCount) {
    //draw torch
    push();
    translate(x, y);
    rotate(-PI / 6);
    if (this.qual == 0) {
      fill("gold");
      stroke(255);
      strokeWeight(1);
      rect(0, 0, 50, 30, 15);
      noStroke();
      fill(255, 255, 0, 150);
      rect(0, 0, 40, 25, 15);
      fill(255, 200);
      rect(12, -10, 10, 7, 3);
      textSize(13);
      fill(153, 0, 33);
      strokeWeight(3);
      text("PASS", 0, 4);
    } else {
      fill(225, 185, 69);
      stroke(255, 200, 0);
      strokeWeight(1.2);
      triangle(-8, 0, 8, 0, 0, 25);
      strokeWeight(0.5);
      line(-7, 2, 5, 9);
      line(-6, 6, 4, 12);
      line(-5, 10, 3, 15);
      line(-4, 14, 2, 18);
      line(-3, 18, 1, 21);
      strokeWeight(1.2);
      fill("gold");
      ellipse(0, -1, 18, 16);
      ellipse(0, 3, 23, 7);
      noStroke();
      fill(255, 100);
      circle(4, -6, 7);
      circle(4, -6, 4);
      circle(4, -6, 4);
    }
    pop();
  }
}

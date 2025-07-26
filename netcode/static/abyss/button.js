class button {
  constructor(x, y, w, h, tex) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.tex = tex;
    this.col1 = color(255, 0, 0);
    this.col2 = color(200, 0, 0);
    this.textSize = 20;
  }
  draw() {
    textFont("Courier New");
    stroke(0);
    strokeWeight(2);
    if (!hero.guiize) {
      //home screen gui (done)
      if (
        mouseX >= this.x - this.w / 2 &&
        mouseX <= this.x + this.w / 2 &&
        mouseY >= this.y - this.h / 2 &&
        mouseY <= this.y + this.h / 2
      ) {
        fill(this.col2);
      } else {
        fill(this.col1);
      }
    } else {
      //HELPERS
      let buttonX = this.x;
      let buttonY = this.y;

      let mx = hero.pos.x + mouseX - width / 2;
      let my = hero.pos.y + mouseY - height / 2;
      //in the shop gui
      //print("Bx: " + buttonX + " By: " + buttonY);
      //rint("Mx: " + mx + " My: " + my);
      if (
        mx >= buttonX - this.w / 2 &&
        mx <= buttonX + this.w / 2 &&
        my >= buttonY - this.h / 2 &&
        my <= buttonY + this.h / 2
      ) {
        fill(this.col2);
      } else {
        fill(this.col1);
      }
    }
    rectMode(CENTER);
    rect(this.x, this.y, this.w, this.h, 30);
    textSize(this.textSize);
    fill(0);
    text(this.tex, this.x, this.y + 5);
  }
  clicked() {
    if (!hero.guiize) {
      //home screen gui (done)
      if (
        mouseX >= this.x - this.w / 2 &&
        mouseX <= this.x + this.w / 2 &&
        mouseY >= this.y - this.h / 2 &&
        mouseY <= this.y + this.h / 2
      ) {
        boop.setVolume(volLevel / 100);
        boop.play();
        return true;
      }
      return false;
    } else {
      //HELPERS
      let buttonX = this.x;
      let buttonY = this.y;

      let mx = hero.pos.x + mouseX - width / 2;
      let my = hero.pos.y + mouseY - height / 2;
      //in the shop gui
      //print("Bx: " + buttonX + " By: " + buttonY);
      //rint("Mx: " + mx + " My: " + my);
      if (
        mx >= buttonX - this.w / 2 &&
        mx <= buttonX + this.w / 2 &&
        my >= buttonY - this.h / 2 &&
        my <= buttonY + this.h / 2
      ) {
        boop.setVolume(volLevel / 100);
        boop.play();
        return true;
      }
      return false;
    }
  }
}

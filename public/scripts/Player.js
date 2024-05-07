// Player

import { context } from './CanvasUtil.js';

export class Player {
  constructor({ position, velocity }) {
    this.position = position; // {x, y}
    this.velocity = velocity;
    this.rotation = 0;
  }
  draw() {
    // creating a circle
    // context.arc(this.position.x, this.position.y, 10, 0, Math.PI * 2, false)
    // context.fillStyle = "red"
    // context.fill()
    context.save();

    context.translate(this.position.x, this.position.y);
    context.rotate(this.rotation);
    context.translate(-this.position.x, -this.position.y);

    context.beginPath();
    context.moveTo(this.position.x + 30, this.position.y);
    context.lineTo(this.position.x - 20, this.position.y - 20);
    context.lineTo(this.position.x - 20, this.position.y + 20);
    context.lineWidth = 3;
    context.closePath();

    context.strokeStyle = 'white';
    context.stroke();
    context.restore();
  }
  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
  getVertices() {
    const cos = Math.cos(this.rotation);
    const sin = Math.sin(this.rotation);

    return [
      {
        x: this.position.x + cos * 30 - sin * 0,
        y: this.position.y + sin * 30 + cos * 0,
      },
      {
        x: this.position.x + cos * -10 - sin * 10,
        y: this.position.y + sin * -10 + cos * 10,
      },
      {
        x: this.position.x + cos * -10 - sin * -10,
        y: this.position.y + sin * -10 + cos * -10,
      },
    ];
  }
}

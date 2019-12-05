export class Square {
  private color = 'red';
  private x = 0;
  private y = 0;
  private z = 30;

  private canvasWidth = 1920;
  private canvasHeight = 1080;

  constructor(private ctx: CanvasRenderingContext2D, private img: CanvasImageSource) {}

  action() {
    this.x+=5;
    this.y+=2;
    //this.img.style.filter = `opacity(${Math.floor(Math.random()*50 + 50)}%) invert(${Math.floor(Math.random()*100)}%) sepia(${Math.floor(Math.random()*100)}%) saturate(${Math.floor(Math.random()*200)}%) hue-rotate(${Math.floor(Math.random()*360)}deg) brightness(${Math.floor(Math.random()*200)}%) contrast(${Math.floor(Math.random()*200)}%)`;
    this.draw();
  }

  private draw() {

    this.ctx.fillStyle = this.color;
    //this.ctx.fillRect(this.z * this.x, this.z * this.y, this.z, this.z);

    this.ctx.drawImage(this.img,this.x,this.y);
  }
}

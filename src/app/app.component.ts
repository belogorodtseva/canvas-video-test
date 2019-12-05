import { Component, ViewChild, ElementRef, OnInit, NgZone } from '@angular/core';
import { Square } from './square';
import { CCaptureWrapped } from './ccapturewrapped';
import {  FileUploader, FileSelectDirective } from 'ng2-file-upload';

const UploadURL = 'http://localhost:3000/api/upload';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    ctx: CanvasRenderingContext2D;
    requestId;
    interval;
    squares: Square[] = [];


  title = 'project-test';
  timeMove: number = 500;
  timeColor: number = 100;
  timeSize: number = 100;
  size: number = 5;
  color: string = '#e740bf';
  url: string = 'assets/cat.png';

  resizeInterval;
  colorInterval;
  moveInterval;
  image;
  canvasBlock;
  h;
  w;

   capturer;

    uploader: FileUploader = new FileUploader({url: UploadURL, itemAlias: 'photo'});

  constructor(private ngZone: NgZone) {}

  public ngOnInit() {
    this.image = document.getElementById("cat");
    this.canvasBlock = document.getElementById("canvas");
    this.ctx = this.canvasBlock.getContext('2d');
    this.h = parseInt(this.canvasBlock.getAttribute("height"));
    this.w = parseInt(this.canvasBlock.getAttribute("width"));
    console.log(this.canvasBlock);
    console.log(this.ctx);
    this.capturer = new CCaptureWrapped({
      framerate: 60,
      format: 'webm',
      quality: 1
    });
    this.ngZone.runOutsideAngular(() => this.tick());
    setInterval(() => {
      this.tick();
    }, 60);

    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
         console.log('ImageUpload:uploaded:', item, status, response);
         alert('File uploaded successfully');

         this.url = `uploads/${item.file.name}`
     };
  }

  public tick() {
    //this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.squares.forEach((square: Square) => {
      this.capturer.capture(this.canvasBlock);
      this.runScript(square);
    });
    this.requestId = requestAnimationFrame(() => this.tick);
  }

  public play() {
    const square = new Square(this.ctx, this.image);
    this.squares = this.squares.concat(square);
  }

  public ngOnDestroy() {
    clearInterval(this.interval);
    cancelAnimationFrame(this.requestId);
  }

  public onChangeMoveTime(event) {
    this.timeMove = event.value * 1000;
  }

  public onChangeColorTime(event) {
    this.timeColor = event.value * 1000;
  }

  public onChangeSizeTime(event) {
    this.timeSize = event.value * 1000;
  }

  public onChangeSize(event) {
    this.size = event.value;
  }

  public onChangeColor(event) {
    this.color = event;
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(0,0,this.w,this.h);
  }

  public runScript(square: Square) {
    // const catImage = document.getElementById("cat");
    // const actionPage = document.getElementById("actionPage");
    //
    // catImage.style.left = '0px';
    // catImage.style.top = '0px';
    //
    // clearInterval(this.resizeInterval);
    // clearInterval(this.colorInterval);
    // clearInterval(this.moveInterval);
    // this.resizeInterval = setInterval(() => {
    //   this.resizing(catImage);
    // }, this.timeSize);
    //
    // this.colorInterval = setInterval(() => {
    //   this.recolor(catImage);
    // }, this.timeColor);
    //
    // this.moveInterval = setInterval(() => {
    //   this.moving(catImage,actionPage.clientWidth,actionPage.clientHeight);
    // }, this.timeMove);
    //
    // catImage.style.transition = `width ${this.timeSize}ms ease-in-out, filter ${this.timeColor}ms ease-in-out, top ${this.timeMove}ms ease-in-out, left ${this.timeMove}ms ease-in-out`;
    // actionPage.style.backgroundColor = this.color;
    square.action();
  }

  public start() {
    this.capturer.start();
  }

  public record() {
    this.capturer.stop();
    this.capturer.save();
  }

  public recolor(object) {
      object.style.filter = `opacity(${Math.floor(Math.random()*50 + 50)}%) invert(${Math.floor(Math.random()*100)}%) sepia(${Math.floor(Math.random()*100)}%) saturate(${Math.floor(Math.random()*200)}%) hue-rotate(${Math.floor(Math.random()*360)}deg) brightness(${Math.floor(Math.random()*200)}%) contrast(${Math.floor(Math.random()*200)}%)`;
  }

  public resizing(object) {
    const x = Math.floor(Math.random()*this.size*100 + 100);
    object.style.width = x + 'px';
  }

  public moving(object, pageX, pageY) {
    const x = Math.floor(Math.random()*(pageX-object.clientWidth));
    const y = Math.floor(Math.random()*(pageY-object.clientHeight));
    object.style.left = x + 'px';
    object.style.top = y + 'px';
  }

  public onFileChange(event) {
    console.log(event);
  }
}

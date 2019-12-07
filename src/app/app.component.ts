import { Component, NgZone, OnDestroy, AfterViewInit } from '@angular/core';
import { FileService } from './file.service';
import { Observable } from 'rxjs';
import { Square } from './square';
import { CCaptureWrapped } from './ccapturewrapped';
import { Validators, FormBuilder } from '@angular/forms';

@Component({
 selector: 'app-root',
 templateUrl: './app.component.html',
 styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy, AfterViewInit {
 imageSrc = '/assets/cat.png';
 image;
 canvasBlock;
 h;
 w;
 capturer;
 requestId;

 ctx: CanvasRenderingContext2D;
squares: Square[] = [];
color: string = '#e740bf';

fileList$: Observable<string[]> = this.fileService.list();

 displayLoader: Observable<boolean> = this.fileService.isLoading();

 formGroup = this.fb.group({
   file: [null, Validators.required]
 });

 fileName;

 constructor(private fileService: FileService,
              private ngZone: NgZone,
            private fb: FormBuilder){}

 changeImage(event) {
  this.imageSrc = `./files/${event}`;
  if (window) {
      this.image = window.document.getElementById("cat");
  }
}

public ngAfterViewInit() {
  if (window) {
    this.image = window.document.getElementById("cat");
    this.canvasBlock = window.document.getElementById("canvas");
    this.ctx = this.canvasBlock.getContext('2d');
    this.h = parseInt(this.canvasBlock.getAttribute("height"));
    this.w = parseInt(this.canvasBlock.getAttribute("width"));
  }
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
    if (window) {
        window.cancelAnimationFrame(this.requestId);
    }
  }

  public onChangeColor(event) {
    this.color = event;
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(0,0,this.w,this.h);
  }

  public runScript(square: Square) {
    square.action();
  }

  public start() {
    this.capturer.start();
  }

  public record() {
    this.capturer.stop();
    this.capturer.save();
  }

  public download(fileName: string): void {
    this.fileService.download(fileName);
  }

  public remove(fileName: string): void {
    this.fileService.remove(fileName);
  }

  public onFileChange(event) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      this.fileName = event.target.files[0].name;
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.formGroup.patchValue({
          file: reader.result
        });
      };
    }
  }

  public onSubmit(): void {
    this.fileService.upload(this.fileName, this.formGroup.get('file').value);
  }
}

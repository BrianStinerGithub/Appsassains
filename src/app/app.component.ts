import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <canvas #canvas width="600" height="300"></canvas>
    <button (click)="animate()">Play</button>   
  `,
  styles: ['canvas { border-style: solid }']
})
export class AppComponent implements OnInit {
  constructor(private el: ElementRef, private img: HTMLImageElement) {
    this.canvas = el.nativeElement;
    this.ctx = this.canvas.nativeElement.getContext('2d')!;
    this.img = img;
  }
  @ViewChild('canvas', { static: true })
  canvas: ElementRef;
  ctx: CanvasRenderingContext2D;
  history: Array<CanvasRenderingContext2D> = [];
  memory: Number = 0;                   //Memory is a variable that holds the current index of the history array for undo and redo.
  clipboard:Array<CanvasRenderingContext2D> = [];                       //Clipboard is an array that the user controls.                   
  brushType = 'Pen';                    //BrushType decides which function we use in drawPoint.
  brushSize = 10;                       //BrushSize is the size of the brush.
  brushColor = '#000000';               //BrushColor is the color of the brush.
  brushOpacity = 1;                     //BrushOpacity is the opacity of the brush.

  ngOnInit() {
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
  }
  clearCanvas() {
      this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
  }
  displayImage() {                                // TODO: Create a popup window to ask for user copy paste link
    this.img.src = 'example.png';
    this.img.addEventListener('load', () {
          this.ctx.drawImage(this.img, 0, 0);
      }, false);
  }

  download() {                                    //This oddly only works before any images are drawn.
      const link = document.createElement('a');   // create temporary link
      link.download = 'image.png';                // set the name of the download file 
      link.href = this.canvas.toDataURL();             // set the link to the data URL
      link.click();                               // click the link
       // delete the link link.delete;                               
  }


  RecordHistory() {
      history.push(this.ctx.getImageData(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height));
      memory = history.length - 1;
  }
  Undo() {
      if (history.length > 0 && memory > 0) {
          history.pop();
          this.clearCanvas();
          this.ctx.putImageData(history[memory--], 0, 0);   
  }}
  Redo() {
      if (history.length > 0 && memory < history.length - 1 && memory >= 0) {
          history.pop();
          this.clearCanvas();
          this.ctx.putImageData(history[memory++], 0, 0); 
  }}
}
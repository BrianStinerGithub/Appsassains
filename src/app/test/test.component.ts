import { Component, ViewChild, ElementRef, HostListener, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-test',
  template: '<canvas #myCanvas></canvas>',
})

export class TestComponent implements AfterViewInit {
  
  // its important myCanvas matches the variable name in the template
  @ViewChild('myCanvas') myCanvas!: ElementRef<HTMLCanvasElement>;
  public ctx!: CanvasRenderingContext2D; //the ! is there to stop "It may be Null" errors
  
  constructor() {
    this.ctx = this.myCanvas.nativeElement.getContext("2d");
    this.ctx.fillStyle = "#D74022";
    this.ctx.fillRect(25, 25, 150, 150);
  }
  

  ngAfterViewInit(): void {
    this.ctx = this.myCanvas.nativeElement.getContext('2d')!;
    console.log(this.ctx);
    console.log(this.myCanvas);
  }

  drawRectable() {
    this.ctx.fillStyle = "#D74022";
    this.ctx.fillRect(25, 25, 150, 150);
    this.ctx.fillStyle = "rgba(0,0,0,0.5)";
    this.ctx.clearRect(60, 60, 120, 120);
    this.ctx.strokeRect(90, 90, 80, 80);

  }

  saveImage() {
    var image = this.myCanvas.nativeElement.toDataURL("image/png").replace("image/png", "image/octet-stream");  // here is the most important part because if you dont replace you will get a DOM 18 exception.
    window.location.href = image;  // it will save locally
  }



}
import { Component, ViewChild, ElementRef, OnInit, HostListener } from '@angular/core';

@Component({
    selector: 'canvas-comp',
    templateUrl: './canvas.component.html',
    styleUrls: ['./canvas.component.css']
})

export class CanvasComponent implements OnInit {
    constructor(private el: ElementRef, private img: HTMLImageElement) {
        this.canvas = el.nativeElement;
        this.ctx = this.canvas.nativeElement.getContext('2d')!;
        this.img = img;
    }

    @ViewChild('canvas', { static: true })
    canvas: ElementRef;
    ctx: CanvasRenderingContext2D;
    hist: Array<ImageData> = [];
    memory: number = 0;                      //Memory is a variable that holds the current index of the history array for undo and redo.
    clipboard:Array<ImageData> = [];         //Clipboard is an array that the user controls.                   
    brushType = 'Pen';                       //BrushType decides which function we use in drawPoint.
    brushSize = 10;                          //BrushSize is the size of the brush.
    brushColor = '#000000';                  //BrushColor is the color of the brush.
    brushOpacity = 1;                        //BrushOpacity is the opacity of the brush.

    drawPoint:Function = this.drawPointPen;  // This is the function that is called when the user clicks on the canvas.
    nStartX = 0;
    nStartY = 0;
    bIsDrawing = false;
    nDeltaX = 0;
    nDeltaY = 0;
    radius = 10;

    @HostListener('window:mousedown', ['$event']) onclick(e: MouseEvent)  {this.putPoint(e);}
    @HostListener('window:mousemove', ['$event']) onmove(e: MouseEvent)   {this.drawPoint(e);}
    @HostListener('window:mouseup',   ['$event']) onup(e: MouseEvent)     {this.stopPoint();}
        
    ngOnInit() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    }
    ClearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    }
    DisplayImage() {                                // TODO: Create a popup window to ask for user copy paste link
        this.img.src = 'example.png';
        this.img.addEventListener('load', () => {
            this.ctx.drawImage(this.img, 0, 0);
        }, false);
    }

    Download() {                                            //This oddly only works before any images are drawn.
        const link = document.createElement('a');           // create temporary link
        link.download = 'image.png';                        // set the name of the download file 
        link.href = this.canvas.nativeElement.toDataURL();  // set the link to the data URL
        link.click();                                       // click the link
        // delete the link link.delete;                               
    }

    RecordHistory() {
        this.hist.push(this.ctx.getImageData(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height));
        this.memory = history.length - 1;
    }
    Undo() {
        if (this.hist.length > 0 && this.memory > 0) {
            this.hist.pop();
            this.ClearCanvas();
            this.ctx.putImageData(this.hist[--this.memory], 0, 0);
    }}
    Redo() {
        if (this.hist.length > 0 && this.memory < this.hist.length - 1 && this.memory >= 0) {
            this.hist.pop();
            this.ClearCanvas();
            this.ctx.putImageData(this.hist[++this.memory], 0, 0); //memory++?
    }}



    putPoint(e: MouseEvent){    // e is event: e.clientX and e.clientY are the coordinates of the mouse.
        this.nStartX = e.clientX;
        this.nStartY = e.clientY;
        this.bIsDrawing = true;
    }
    stopPoint(){
        this.bIsDrawing = false;
        this.RecordHistory();
    }
    switchTool(choice:string){
        switch(choice){
            case 'Pen':
                this.drawPoint = this.drawPointPen;      break;
            case 'Eraser':
                this.drawPoint = this.drawPointEraser;   break;
            case 'Circle':
                this.drawPoint = this.drawPointCircle;   break;
            case 'Heart':
                this.drawPoint = this.drawPointHeart;    break;
            case 'Line':
                this.drawPoint = this.drawPointLine;     break;
            case 'Rectangle':
                this.drawPoint = this.drawPointRectangle;break;
            case 'Triangle':
                this.drawPoint = this.drawPointTriangle; break;
            case 'Square':
                this.drawPoint = this.drawPointSquare;   break;
        }
    }
    
    drawPointPen(e: MouseEvent){        // This draws on mouse
        if(!this.bIsDrawing){
            return;
        }
        this.ctx.beginPath();
        this.ctx.moveTo(this.nStartX, this.nStartY);
        this.ctx.lineTo(e.clientX, e.clientY);
        this.ctx.stroke();
        this.nStartX = e.clientX;
        this.nStartY = e.clientY;
    }
    drawPointEraser(e: MouseEvent){     // This erases on mouse
        if(!this.bIsDrawing){return;}
        this.ctx.globalCompositeOperation = 'destination-out';
        this.ctx.beginPath();
        this.ctx.arc(this.nStartX, this.nStartY, 10, 0, Math.PI*2);
        this.ctx.fill();
        this.ctx.globalCompositeOperation = 'source-over';
        this.nStartX = e.clientX;
        this.nStartY = e.clientY;
    }
    drawPointCircle(e: MouseEvent){     // This draws circles.
        if(!this.bIsDrawing)
            return;
        this.nDeltaX = this.nStartX - e.clientX;
        this.nDeltaY = this.nStartY - e.clientY;
        this.radius = Math.sqrt(this.nDeltaX * this.nDeltaX + this.nDeltaY * this.nDeltaY)
        this.ctx.beginPath();
        this.ctx.arc(this.nStartX, this.nStartY, this.radius, 0, Math.PI*2);
        this.ctx.fill();
    }
    drawPointHeart(e: MouseEvent){      // This draws hearts.
        if(!this.bIsDrawing)
            return;
        this.nDeltaX = this.nStartX - e.clientX;
        this.nDeltaY = this.nStartY - e.clientY;
        this.radius = Math.sqrt(this.nDeltaX * this.nDeltaX + this.nDeltaY * this.nDeltaY)
        this.ctx.beginPath();
        this.ctx.moveTo(this.nStartX, this.nStartY);
        this.ctx.bezierCurveTo(this.nStartX + this.radius, this.nStartY, this.nStartX + this.radius, this.nStartY - this.radius, this.nStartX, this.nStartY - this.radius);
        this.ctx.bezierCurveTo(this.nStartX - this.radius, this.nStartY - this.radius, this.nStartX - this.radius, this.nStartY, this.nStartX, this.nStartY);
        this.ctx.fill();
    }
    drawPointLine(e: MouseEvent){       // This draws lines.
        if(!this.bIsDrawing)
            return;
        this.ctx.beginPath();
        this.ctx.moveTo(this.nStartX, this.nStartY);
        this.ctx.lineTo(e.clientX, e.clientY);
        this.ctx.stroke();
    }
    drawPointRectangle(e: MouseEvent){  // This draws rectangles.
        if(!this.bIsDrawing)
            return;
        this.ctx.beginPath();
        this.ctx.rect(this.nStartX, this.nStartY, e.clientX - this.nStartX, e.clientY - this.nStartY);
        this.ctx.fill();
    }
    drawPointTriangle(e: MouseEvent){   // This draws triangles.
        if(!this.bIsDrawing)
            return;
        this.ctx.beginPath();
        this.ctx.moveTo(this.nStartX, this.nStartY);
        this.ctx.lineTo(e.clientX, e.clientY);
        this.ctx.lineTo(this.nStartX, e.clientY);
        this.ctx.lineTo(this.nStartX, this.nStartY);
        this.ctx.fill();
    }
    drawPointSquare(e: MouseEvent){     // This draws squares.
        if(!this.bIsDrawing)
            return;
        this.ctx.beginPath();
        this.ctx.moveTo(this.nStartX, this.nStartY);
        this.ctx.lineTo(e.clientX, e.clientY);
        this.ctx.lineTo(this.nStartX, e.clientY);
        this.ctx.lineTo(e.clientX, this.nStartY);
        this.ctx.lineTo(this.nStartX, this.nStartY);
        this.ctx.fill();
    }
}
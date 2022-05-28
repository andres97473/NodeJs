import {
  AfterViewInit,
  Component,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-draw',
  templateUrl: './draw.component.html',
  styleUrls: ['./draw.component.css'],
})
export class DrawComponent implements OnInit, AfterViewInit {
  @ViewChild('canvasRef', { static: false }) canvasRef: any;

  public width = 800;
  public height = 800;

  private cx!: CanvasRenderingContext2D;

  private points: Array<any> = [];

  @HostListener('document:mousemove', ['$event'])
  onMouseMove = (e: any) => {
    // console.log(e);

    if (e.target.id === 'canvasId') {
      // console.log(e);
      this.write(e);
    }
  };

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.render();
  }

  private render() {
    const canvasEl = this.canvasRef.nativeElement;
    // console.log(canvasEl);
    this.cx = canvasEl.getContext('2d');

    canvasEl.width = this.width;
    canvasEl.height = this.height;

    this.cx.lineWidth = 3;
    this.cx.lineCap = 'round';
    this.cx.strokeStyle = '#000';
  }

  private write(res: any): any {
    const canvasEl: any = this.canvasRef.nativeElement;
    const rect = canvasEl.getBoundingClientRect();
    const prevPos = {
      x: res.clientX - rect.left,
      y: res.clientY - rect.top,
    };
    // console.log(prevPos);
    this.writeSingle(prevPos);
  }

  private writeSingle = (prevPos: any) => {
    this.points.push(prevPos);
    if (this.points.length > 3) {
      const prevPos = this.points[this.points.length - 1];
      const currentPos = this.points[this.points.length - 2];
      // console.log(prevPos, currentPos);
      this.drawOnCanvas(prevPos, currentPos);
    }
  };

  private drawOnCanvas(prevPos: any, currentPos: any) {
    if (!this.cx) {
      return;
    }
    this.cx.beginPath();
    if (prevPos) {
      this.cx.moveTo(prevPos.x, prevPos.y);
      this.cx.lineTo(prevPos.x, prevPos.y);
      this.cx.stroke();
    }
  }
}

import { DrawService } from './draw.service';
import { BoundingBoxStyle } from './marked-menu';
import { MenuProvider, ModeProvider } from './providers';

const SCALE_INCREMENT = 0.5;

export class CanvasDrawer {
  canvasPainted: boolean = false;
  scaleValue = 1;
  private canvasRef: any;
  private imageCanvasRef: any;

  setElements(canvasRef: any, imageCanvasRef: any) {
    this.canvasRef = canvasRef;
    this.imageCanvasRef = imageCanvasRef;
  }

  constructor(
    private draw: DrawService,
    private mode: ModeProvider,
    private menu: MenuProvider,
    private boundingBoxStyle: BoundingBoxStyle
  ) {}

  incrementScale() {
    this.scaleValue += SCALE_INCREMENT;
  }

  decrementScale() {
    this.scaleValue -= SCALE_INCREMENT;
  }

  redrawCanvas(selectionBox: any, changePage: boolean = false) {
    let canvas = this.canvasRef.nativeElement;
    let imageCanvas = this.imageCanvasRef.nativeElement;

    const image = this.menu.value?.imageElement;

    if (!image) {
      return;
    }

    if (changePage || !this.canvasPainted) {
      let context = imageCanvas.getContext('2d');
      imageCanvas.height = image.height;
      imageCanvas.width = image.width;

      canvas.height = image.height;
      canvas.width = image.width;
      context.drawImage(image, 0, 0);
      this.canvasPainted = true;
    }

    let context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (this.mode.isView()) {
      this.drawViewCanvas(context);
    } else {
      this.drawEditCanvas(context, selectionBox);
    }
  }

  drawViewCanvas(context: any) {
    if (!this.menu.value) {
      return;
    }

    context.lineWidth = 3;
    for (let box of this.menu.value.markup) {
      let x = box.x1;
      let y = box.y1;
      let w = box.x2 - x;
      let h = box.y2 - y;
      if (box.viewToggled && box.viewStyle) {
        this.draw.drawBox(context, x, y, w, h, box.viewStyle);
      }
    }
  }

  drawEditCanvas(context: any, selectionBox: any) {
    const menu = this.menu.value;
    if (!menu) {
      return;
    }
    for (let i = 0; i < menu.markup.length; i++) {
      let line = menu.markup[i];
      let x = line.x1;
      let y = line.y1;
      let w = line.x2 - x;
      let h = line.y2 - y;
      if (!line.hovered && !line.editSelected) {
        context.beginPath();
        context.strokeStyle = this.boundingBoxStyle.color;
        context.lineWidth = this.boundingBoxStyle.width;
        context.rect(x - 1, y - 1, w + 2, h + 2);
        context.stroke();
        context.lineWidth = this.boundingBoxStyle.constastWidth;
        context.beginPath();
        context.strokeStyle = this.boundingBoxStyle.contrastColor;
        context.rect(x, y, w, h);
        context.stroke();
      } else {
        context.beginPath();
        context.strokeStyle = this.boundingBoxStyle.selectedColor
        context.lineWidth = this.boundingBoxStyle.selectedWidth;
        context.rect(x - 2, y - 2, w + 4, h + 4);
        context.stroke();
        context.lineWidth = this.boundingBoxStyle.constastWidth;
        context.beginPath();
        context.strokeStyle = this.boundingBoxStyle.contrastColor;
        context.rect(x, y, w, h);
        context.stroke();
      }
    }

    if (selectionBox) {
      let x = selectionBox[0][0];
      let y = selectionBox[0][1];
      let w = selectionBox[1][0] - x;
      let h = selectionBox[1][1] - y;
      context.beginPath();
      context.fillStyle = 'rgba(225,0,0,0.3)';
      context.fillRect(x, y, w, h);
      context.stroke();
    }
  }
}

import { OcrBox, OcrDocument } from './ocr-document';

export class ModeProvider {
  public value: string = 'edit';

  switchToEdit() {
    this.value = 'edit';
  }

  switchToView() {
    this.value = 'view';
  }

  isView = () => this.value == 'view';
  isEdit = () => this.value == 'edit';
}

export class DocumentProvider {
  public value: OcrDocument | null = null;

  public set(document: OcrDocument) {
    this.value = document;
  }
}

export class SelectionProvider {
  constructor(private menu: DocumentProvider) {}

  getLeftSelection(canvas: any) {
    if (!this.menu.value) {
      return 0;
    }
    let selection = this.menu.value.markup.filter((l: OcrBox) => l.editSelected);
    if (selection.length == 0) {
      return 0;
    }
    let x: any[] = [];
    let texts = [];
    selection.forEach((l: any) => {
      x.push(l.x1);
      x.push(l.x2);
      texts.push(l.text);
    });

    let left = Math.max(...x);
    let rect = canvas.getBoundingClientRect();

    if (!this.menu.value.imageElement) {
      return;
    }

    let canvasRealHeight = rect.height;
    let canvasHeight = this.menu.value.imageElement.height;
    let ratio = canvasHeight / canvasRealHeight;
    let leftOffset = canvas.offsetLeft;
    return left / ratio + leftOffset + 3;
  }

  getTopSelection(canvas: any) {
    if (!this.menu.value) {
      return 0;
    }
    let selection = this.menu.value.markup.filter((l: OcrBox) => l.editSelected);
    if (selection.length == 0) {
      return 0;
    }
    let y: any[] = [];
    let texts = [];
    selection.forEach((l: OcrBox) => {
      y.push(l.y1);
      y.push(l.y2);
      texts.push(l.text);
    });

    let top = Math.min(...y);
    let rect = canvas.getBoundingClientRect();
    let imageElement = this.menu.value.imageElement;
    if (!imageElement) {
      return;
    }

    let canvasRealHeight = rect.height;
    let canvasHeight = imageElement.height;
    let ratio = canvasHeight / canvasRealHeight;
    let topOffset = canvas.offsetTop;
    return top / ratio + topOffset - 15;
  }

  isAnySelected() {
    if (!this.menu.value) {
      return false;
    }
    return this.menu.value.markup.findIndex((l: OcrBox) => l.editSelected) >= 0;
  }

  getSelectionLength() {
    if (!this.menu.value) {
      return 0;
    }
    return this.menu.value.markup.filter((l: OcrBox) => l.editSelected).length;
  }
}

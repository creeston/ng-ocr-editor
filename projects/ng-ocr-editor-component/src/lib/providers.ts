import { OcrLine, OcrDocument, OcrPage } from './marked-menu';


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

export class MenuProvider {
  public value: OcrDocument | null = null;

  public setMenu(menu: OcrDocument) {
    this.value = menu;
  }
}

export class PagesProvider {
  public value: OcrPage[] = [];

  public setPages(pages: OcrPage[]) {
    this.value = pages;
  }
}

export class PageProvider {
  public current: number = 0;

  changePage(value: number) {
    this.current = value;
  }
}

export class SelectionProvider {
  constructor(
    private page: PageProvider,
    private menu: MenuProvider,
    private pages: PagesProvider
  ) { }

  getLeftSelection(canvas: any) {
    if (!this.menu.value) {
      return 0;
    }
    let selection = this.menu.value.pages[this.page.current].markup.filter(
      (l: OcrLine) => l.editSelected
    );
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
    let page = this.pages.value[this.page.current];

    if (!page.imageElement) {
      return;
    }

    let canvasRealHeight = rect.height;
    let canvasHeight = page.imageElement.height;
    let ratio = canvasHeight / canvasRealHeight;
    let leftOffset = canvas.offsetLeft;
    return left / ratio + leftOffset + 3;
  }

  getTopSelection(canvas: any) {
    if (!this.menu.value) {
      return 0;
    }
    let selection = this.menu.value.pages[this.page.current].markup.filter(
      (l: OcrLine) => l.editSelected
    );
    if (selection.length == 0) {
      return 0;
    }
    let y: any[] = [];
    let texts = [];
    selection.forEach((l: OcrLine) => {
      y.push(l.y1);
      y.push(l.y2);
      texts.push(l.text);
    });

    let top = Math.min(...y);
    let rect = canvas.getBoundingClientRect();
    let page = this.pages.value[this.page.current];
    if (!page.imageElement) {
      return;
    }


    let canvasRealHeight = rect.height;
    let canvasHeight = page.imageElement.height;
    let ratio = canvasHeight / canvasRealHeight;
    let topOffset = canvas.offsetTop;
    return top / ratio + topOffset - 15;
  }

  isAnySelected() {
    if (!this.menu.value) {
      return false;
    }
    return (
      this.menu.value.pages[this.page.current].markup.findIndex(
        (l: OcrLine) => l.editSelected
      ) >= 0
    );
  }
}

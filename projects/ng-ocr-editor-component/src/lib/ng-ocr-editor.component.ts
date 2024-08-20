import { Component, Input, OnInit, ViewChild, importProvidersFrom } from '@angular/core';
import {
  MenuProvider,
  ModeProvider,
  PageProvider,
  PagesProvider,
  SelectionProvider,
} from './providers';
import { CanvasDrawer } from './canvas-drawer';
import { CanvasController } from './canvas-controller';
import { SelectionController } from './selection-controller';
import { LineController } from './line-controller';
import { OcrLine, OcrDocument } from './marked-menu';
import { DrawService } from './draw.service';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';

const ZOOM_INCREMENT = 25;

@Component({
  selector: 'ng-ocr-editor-component',
  standalone: true,
  imports: [
    CommonModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatTableModule,
    MatInputModule,
    MatTooltipModule,
  ],
  providers: [DrawService],
  templateUrl: './ng-ocr-editor.component.html',
  styleUrls: ['./ng-ocr-editor.component.scss'],
})
export class NgOcrEditorComponent {
  canvasHeight: number = 80;

  @Input() menu: OcrDocument;

  origialMenu: OcrDocument | null = null;

  menuProvider: MenuProvider = new MenuProvider();
  page: PageProvider = new PageProvider();
  pagesProvider: PagesProvider = new PagesProvider();
  selection: SelectionProvider = new SelectionProvider(
    this.page,
    this.menuProvider,
    this.pagesProvider
  );
  mode: ModeProvider = new ModeProvider();

  canvasDrawer: CanvasDrawer | null = null;
  canvasController: CanvasController | null = null;
  selectionController: SelectionController | null = null;
  lineController: LineController = new LineController(
    this.menuProvider,
    this.page
  );

  markupedSavedMessage = '';
  closeText = '';

  @ViewChild('markup') canvasRef: any;
  @ViewChild('image') imageCanvasRef: any;

  saveDisabled: boolean = false;

  displayedColumns = ['position', 'name', 'presence'];
  primaryColors: string[] = [
    '#3f51b5',
    '#da5167',
    '#45606f',
    '#704b4b',
    '#4caf50',
    '#e6c026',
  ];

  constructor(
    private draw: DrawService,
  ) {
    this.canvasDrawer = new CanvasDrawer(
      this.draw,
      this.mode,
      this.page,
      this.menuProvider,
      this.pagesProvider
    );
    this.canvasController = new CanvasController(
      this.mode,
      this.page,
      this.canvasDrawer,
      this.menuProvider
    );
    this.selectionController = new SelectionController(
      this.canvasDrawer,
      this.page,
      this.canvasController,
      this.menuProvider
    );
  }

  ngAfterViewInit() {
    this.canvasController?.setCanvas(this.canvasRef);
    this.canvasDrawer?.setElements(this.canvasRef, this.imageCanvasRef);
    this.menuProvider.setMenu(this.menu);
    this.pagesProvider.setPages(this.menu.pages);
    this.origialMenu = JSON.parse(JSON.stringify(this.menu));
    this.mode.switchToEdit();
    this.redrawCanvas();
  }

  async loadImageAsync(imageUrl: string): Promise<HTMLImageElement> {
    let image = new Image();
    image.src = imageUrl;
    return new Promise((resolve, reject) => {
      image.onload = () => {
        resolve(image);
      }
    });
  }

  flatChildrenLines(line: OcrLine) {
    if (!line.children || line.children.length == 0) {
      return [line];
    } else {
      let result: any[] = [];
      line.children.forEach((l) => {
        let children = this.flatChildrenLines(l);
        children.forEach((c) => result.push(c));
      });
      return result;
    }
  }

  removeLine(line: OcrLine) {
    this.lineController.removeLine(line);
    this.redrawCanvas();
  }

  selectAll() {
    this.lineController.selectAll();
    this.redrawCanvas();
  }

  deselectAll() {
    this.lineController.deselectAll();
    this.redrawCanvas();
  }

  deleteSelected() {
    this.lineController.deleteSelected();
    this.redrawCanvas();
  }

  addLine(index: number) {
    this.lineController.addLine(index);
    this.redrawCanvas();
  }

  mergeSelection() {
    this.lineController.mergeSelection();
    this.redrawCanvas();
  }

  onLineSelected(event: any) {
    this.redrawCanvas();
  }

  onCoordChange(event: any, line: OcrLine, lineIndex: number, prop: any) {
    this.lineController.onCoordChange(event, line, lineIndex, prop);
    this.redrawCanvas();
  }

  redrawCanvas(changePage: boolean = false) {
    this.canvasDrawer?.redrawCanvas(
      this.canvasController!.selectionBox,
      changePage
    );
  }

  resetMarkup() {
    if (this.origialMenu) {
      this.menuProvider.setMenu(this.origialMenu);
    }
  }

  rollback() {
    this.lineController.rollback();
    this.redrawCanvas();
  }

  zoomIn() {
    if (this.canvasHeight >= 150) {
      return;
    }
    this.canvasHeight += ZOOM_INCREMENT;
    this.canvasDrawer?.incrementScale();
    this.redrawCanvas(true);
  }

  zoomOut() {
    if (this.canvasHeight - ZOOM_INCREMENT <= 50) {
      return;
    }
    this.canvasHeight -= ZOOM_INCREMENT;
    this.canvasDrawer?.decrementScale();
    this.redrawCanvas(true);
  }

  toViewMode() {
    this.mode.switchToView();
    this.redrawCanvas();
  }

  toEditMode() {
    this.mode.switchToEdit();
    this.redrawCanvas();
  }
}

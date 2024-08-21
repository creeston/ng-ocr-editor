import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MenuProvider, ModeProvider, SelectionProvider } from './providers';
import { CanvasDrawer } from './canvas-drawer';
import { CanvasController } from './canvas-controller';
import { SelectionController } from './selection-controller';
import { LineController } from './line-controller';
import { BoundingBoxStyle, OcrBox, OcrDocument } from './marked-menu';
import { DrawService } from './draw.service';
import { CommonModule } from '@angular/common';

const ZOOM_INCREMENT = 25;

@Component({
  selector: 'ng-ocr-editor-component',
  standalone: true,
  imports: [CommonModule],
  providers: [DrawService],
  templateUrl: './ng-ocr-editor.component.html',
  styleUrls: ['./ng-ocr-editor.component.scss'],
})
export class NgOcrEditorComponent {
  canvasHeight: number = 80;

  @Input({ required: true }) menu: OcrDocument;
  @Output() menuChange = new EventEmitter<OcrDocument>();

  @Input() mode: 'edit' | 'view' = 'edit';
  @Input({ required: true }) boundingBoxStyle: BoundingBoxStyle;

  origialMenu: OcrDocument | null = null;

  menuProvider: MenuProvider = new MenuProvider();
  selection: SelectionProvider = new SelectionProvider(this.menuProvider);
  modeProvider: ModeProvider = new ModeProvider();

  canvasDrawer: CanvasDrawer | null = null;
  canvasController: CanvasController | null = null;
  selectionController: SelectionController | null = null;
  lineController: LineController = new LineController(this.menuProvider);

  markupedSavedMessage = '';
  closeText = '';

  @ViewChild('markup') canvasRef: any;
  @ViewChild('image') imageCanvasRef: any;

  saveDisabled: boolean = false;

  constructor(private draw: DrawService) {}

  ngAfterViewInit() {
    this.canvasDrawer = new CanvasDrawer(this.draw, this.modeProvider, this.menuProvider, this.boundingBoxStyle);
    this.canvasController = new CanvasController(this.modeProvider, this.canvasDrawer, this.menuProvider);
    this.selectionController = new SelectionController(this.canvasDrawer, this.canvasController, this.menuProvider);

    this.canvasController?.setCanvas(this.canvasRef);
    this.canvasDrawer?.setElements(this.canvasRef, this.imageCanvasRef);
    this.menuProvider.setMenu(this.menu);
    this.origialMenu = JSON.parse(JSON.stringify(this.menu));
    if (this.mode == 'view') {
      this.modeProvider.switchToView();
    } else {
      this.modeProvider.switchToEdit();
    }
    this.redrawCanvas();
  }

  flatChildrenLines(line: OcrBox) {
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

  removeLine(line: OcrBox) {
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

  onCoordChange(event: any, line: OcrBox, lineIndex: number, prop: any) {
    this.lineController.onCoordChange(event, line, lineIndex, prop);
    this.redrawCanvas();
  }

  redrawCanvas(changePage: boolean = false) {
    this.canvasDrawer?.redrawCanvas(this.canvasController!.selectionBox, changePage);
  }

  resetMarkup() {
    if (!this.origialMenu) {
      return;
    }

    const image = this.menu.imageElement;
    this.menu = JSON.parse(JSON.stringify(this.origialMenu));
    this.menu.imageElement = image;
    this.menuProvider.setMenu(this.menu);
    this.menuChange.emit(this.menu);
    this.redrawCanvas();
  }

  rollback() {
    this.lineController.rollback();
    this.redrawCanvas();
  }

  anyActionsToRollback() {
    return this.lineController.anyActionsToRollback();
  }

  isAnySelected() {
    return this.selection.isAnySelected();
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
    this.modeProvider.switchToView();
    this.redrawCanvas();
  }

  toEditMode() {
    this.modeProvider.switchToEdit();
    this.redrawCanvas();
  }

  isEdit() {
    return this.modeProvider.isEdit();
  }

  isView() {
    return this.modeProvider.isView();
  }

  moveSelectionUp() {
    this.selectionController?.moveUp();
  }

  moveSelectionDown() {
    this.selectionController?.moveDown();
  }

  moveSelectionLeft() {
    this.selectionController?.moveLeft();
  }

  moveSelectionRight() {
    this.selectionController?.moveRight();
  }

  moveSelectionUp2() {
    this.selectionController?.moveUp2();
  }

  moveSelectionDown2() {
    this.selectionController?.moveDown2();
  }

  moveSelectionLeft2() {
    this.selectionController?.moveLeft2();
  }

  moveSelectionRight2() {
    this.selectionController?.moveRight2();
  }
}

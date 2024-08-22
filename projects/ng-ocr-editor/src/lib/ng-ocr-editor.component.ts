import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { DocumentProvider, ModeProvider, SelectionProvider } from './providers';
import { CanvasDrawer } from './canvas-drawer';
import { CanvasController } from './canvas-controller';
import { SelectionController } from './selection-controller';
import { LineController } from './line-controller';
import { BoundingBoxStyle, InteractiveOcrBox, InteractiveOcrDocument, OcrBox, OcrDocument } from './ocr-document';
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

  @Input({ required: true }) document: OcrDocument;
  @Output() documentChange = new EventEmitter<OcrDocument>();

  @Input() mode: 'edit' | 'view' = 'edit';
  @Input() boundingBoxStyle: BoundingBoxStyle | null = null;

  originalDocument: OcrDocument | null = null;

  documentProvider: DocumentProvider = new DocumentProvider();
  selection: SelectionProvider = new SelectionProvider(this.documentProvider);
  modeProvider: ModeProvider = new ModeProvider();

  canvasDrawer: CanvasDrawer | null = null;
  canvasController: CanvasController | null = null;
  selectionController: SelectionController | null = null;
  lineController: LineController = new LineController(this.documentProvider);

  markupedSavedMessage = '';
  closeText = '';

  @ViewChild('markup') canvasRef: any;
  @ViewChild('image') imageCanvasRef: any;

  saveDisabled: boolean = false;

  constructor(private draw: DrawService) {}

  ngAfterViewInit() {
    if (this.boundingBoxStyle == null) {
      this.boundingBoxStyle = {
        color: '#627320',
        width: 2,
        selectedColor: '#4F4742',
        selectedWidth: 5,
        contrastColor: '#fff6f0',
        constastWidth: 1,
      };
    }
    this.canvasDrawer = new CanvasDrawer(this.draw, this.modeProvider, this.documentProvider, this.boundingBoxStyle);
    this.canvasController = new CanvasController(this.modeProvider, this.canvasDrawer, this.documentProvider);
    this.selectionController = new SelectionController(this.canvasDrawer, this.canvasController, this.documentProvider);

    this.canvasController?.setCanvas(this.canvasRef);
    this.canvasDrawer?.setElements(this.canvasRef, this.imageCanvasRef);

    const interactiveDocument = this.convertToIntercativeDocument(this.document);
    this.documentProvider.set(interactiveDocument);
    this.originalDocument = JSON.parse(JSON.stringify(this.document));
    if (this.mode == 'view') {
      this.modeProvider.switchToView();
    } else {
      this.modeProvider.switchToEdit();
    }
    this.redrawCanvas();
  }

  flatChildrenLines(line: InteractiveOcrBox) {
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

  removeLine(line: InteractiveOcrBox) {
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

  onCoordChange(event: any, line: InteractiveOcrBox, lineIndex: number, prop: any) {
    this.lineController.onCoordChange(event, line, lineIndex, prop);
    this.redrawCanvas();
  }

  redrawCanvas(changePage: boolean = false) {
    this.canvasDrawer?.redrawCanvas(this.canvasController!.selectionBox, changePage);
  }

  resetMarkup() {
    if (!this.originalDocument) {
      return;
    }

    const image = this.document.imageElement;
    this.document = JSON.parse(JSON.stringify(this.originalDocument));
    this.document.imageElement = image;
    const interactiveDocument = this.convertToIntercativeDocument(this.document);
    this.documentProvider.set(interactiveDocument);
    this.documentChange.emit(this.document);
    this.redrawCanvas();
  }

  convertToIntercativeDocument(document: OcrDocument): InteractiveOcrDocument {
    const interactiveOcrBoxes = document.markup.map((l: OcrBox) => {
      return {
        ...l,
        editSelected: false,
        hovered: false,
        viewToggled: false,
        children: [],
      } as InteractiveOcrBox;
    });
    return {
      markup: interactiveOcrBoxes,
      imageElement: document.imageElement,
    };
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

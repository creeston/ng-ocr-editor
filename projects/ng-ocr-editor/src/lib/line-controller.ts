import { InteractiveOcrBox, OcrBox } from './ocr-document';
import { DocumentProvider } from './providers';

export class LineController {
  deletedLines: string[] = [];
  historicalActions: any[] = [];

  constructor(private menu: DocumentProvider) {}

  mergeSelection() {
    if (!this.menu.value) {
      return;
    }
    let markup = this.menu.value.markup;
    let selection = markup.filter((l: InteractiveOcrBox) => l.editSelected);
    if (selection.length == 0) {
      return;
    }

    let selectionIndexes: number[] = [];
    for (let i = 0; i < markup.length; i += 1) {
      let line = markup[i];
      if (line.editSelected) {
        selectionIndexes.push(i);
      }
    }

    let x: any[] = [];
    let y: any[] = [];
    let texts: any[] = [];
    selection.forEach((l: any) => {
      x.push(l.x1);
      x.push(l.x2);
      y.push(l.y1);
      y.push(l.y2);
      texts.push(l.text);
    });

    let x1 = Math.min(...x);
    let x2 = Math.max(...x);
    let y1 = Math.min(...y);
    let y2 = Math.max(...y);

    let line = {
      text: texts.join(' '),
      x1: x1,
      x2: x2,
      y1: y1,
      y2: y2,
      editSelected: true,
      viewToggled: true,
      hovered: false,
      children: selection,
    } as InteractiveOcrBox;

    let insertIndex = this.menu.value.markup.indexOf(selection[0]);
    this.menu.value.markup = this.menu.value.markup.filter((item: any) => !item.editSelected);
    this.menu.value.markup.splice(insertIndex, 0, line);

    this.historicalActions.push(() => this.reverseMergeSelection(line, selectionIndexes));
  }

  reverseMergeSelection(line: InteractiveOcrBox, selectionIndexes: number[]) {
    if (!this.menu.value) {
      return;
    }
    let selection = line.children;
    if (!selection) {
      return;
    }
    let currentMarkup = this.menu.value.markup;
    currentMarkup = currentMarkup.filter((l: any) => l !== line);
    for (let i = 0; i < selectionIndexes.length; i += 1) {
      let index = selectionIndexes[i];
      let line = selection[i];
      line.editSelected = false;
      line.hovered = false;
      currentMarkup.splice(index, 0, line);
    }
    this.menu.value.markup = currentMarkup;
  }

  initializeLine(line: InteractiveOcrBox) {
    line.editSelected = false;
    line.hovered = false;
    line.text = line.text?.toLowerCase() ?? '';
    return line;
  }

  addLine(index: number) {
    if (!this.menu.value) {
      return;
    }
    let line: any = {};
    if (index < 0) {
      if (this.menu.value.markup.length > 0) {
        let baseLine = this.menu.value.markup[0];
        var x1 = baseLine.x1;
        var x2 = baseLine.x2;
        var y1 = Math.max(10, baseLine.y1 - 20);
        var y2 = Math.max(30, baseLine.y2 - 20);
      } else {
        x1 = 10;
        x2 = 70;
        y1 = 10;
        y2 = 30;
      }
      line = {
        text: '',
        x1: x1,
        x2: x2,
        y1: y1,
        y2: y2,
        editSelected: true,
        viewSelected: true,
        hover: false,
        box: [
          [x1, y1],
          [x1, y2],
        ],
        tag: 'DISH',
        children: [],
      };
      this.menu.value.markup.unshift(line);
    } else {
      let baseLine = this.menu.value.markup[index];
      let baseLineHeight = baseLine.y2 - baseLine.y1;
      line = {
        text: '',
        x1: baseLine.x1,
        x2: baseLine.x2,
        y1: baseLine.y1 + baseLineHeight,
        y2: baseLine.y2 + baseLineHeight,
        editSelected: true,
        viewSelected: true,
        hover: false,
        box: [
          [baseLine.x1, baseLine.x2],
          [baseLine.y1 + baseLineHeight, baseLine.y2 + baseLineHeight],
        ],
        tag: 'DISH',
        children: [],
      };
      this.menu.value.markup.splice(index + 1, 0, line);
      baseLine.editSelected = false;
    }

    this.historicalActions.push(() => this.reverseAddLine(line));
  }

  reverseAddLine(line: OcrBox) {
    if (!this.menu.value) {
      return;
    }
    let markup = this.menu.value.markup;
    this.menu.value.markup = markup.filter((item: any) => item !== line);
  }

  removeLine(line: InteractiveOcrBox) {
    if (!this.menu.value) {
      return;
    }
    let currentMarkup = this.menu.value.markup;
    let index = currentMarkup.indexOf(line);
    this.menu.value.markup = currentMarkup.filter((item: any) => item !== line);
    this.deletedLines.push(line.text ?? '');
    this.historicalActions.push(() => this.reverseRemoveLine(line, index));
  }

  reverseRemoveLine(line: InteractiveOcrBox, index: number) {
    if (!this.menu.value) {
      return;
    }
    let currentMarkup = this.menu.value.markup;
    line.editSelected = false;
    line.hovered = false;
    currentMarkup.splice(index, 0, line);
    this.menu.value.markup = currentMarkup;
    this.deletedLines.pop();
  }

  selectAll() {
    if (!this.menu.value) {
      return;
    }
    this.menu.value.markup.forEach((line: any) => {
      line.editSelected = true;
    });
  }

  deselectAll() {
    if (!this.menu.value) {
      return;
    }
    this.menu.value.markup.forEach((line: any) => {
      line.editSelected = false;
    });
  }

  deleteSelected() {
    if (!this.menu.value) {
      return;
    }
    let actions: any[] = [];
    let currentMarkup = this.menu.value.markup;
    for (let i = currentMarkup.length - 1; i >= 0; i -= 1) {
      let line = currentMarkup[i];
      if (!line.editSelected) {
        continue;
      }
      this.deletedLines.push(line.text ?? '');
      actions.push(() => this.reverseRemoveLine(line, i));
    }

    actions.reverse();

    this.menu.value.markup = this.menu.value.markup.filter((item: any) => !item.editSelected);
    this.historicalActions.push(() => {
      actions.forEach((a) => a());
    });
  }

  onCoordChange(event: any, line: any, lineIndex: number, prop: any) {
    if (!this.menu.value) {
      return;
    }

    if (line.editSelected) {
      let value = line[prop];
      this.menu.value.markup.forEach((l: any) => {
        if (l.editSelected) {
          l[prop] = value;
        }
      });
    }
  }

  rollback() {
    if (this.historicalActions.length == 0) {
      return;
    }
    let action = this.historicalActions.pop();
    action();
  }

  anyActionsToRollback() {
    return this.historicalActions.length > 0;
  }
}

<h1 align="center">Angular OCR Results Editor</h1>

<p align="center">Angular component that allows to edit and view OCR results data in UI.</p>


[![npm](https://img.shields.io/badge/demo-online-008000.svg)](https://creeston.github.io/ng-ocr-editor)
[![npm](https://img.shields.io/npm/v/ng-ocr-editor)](https://www.npmjs.com/package/ng-ocr-editor)
[![npm](https://img.shields.io/npm/l/express.svg?maxAge=2592000)](/LICENSE)

___

## Usage

**app.component.html**
```
<ng-ocr-editor-component
    [(document)]="demoDocument" [boudingBoxStyle]="boundingBoxStyle"
></ng-ocr-editor-component>

<img src="assets/demoImage.jpg" #demoImage hidden (load)="onImageLoad()"/>
```
**app.component.ts**
```
  boundingBoxStyle: BoundingBoxStyle = {
    color: '#627320',
    width: 2,
    selectedColor: '#4F4742',
    selectedWidth: 5,
    contrastColor: '#fff6f0',
    constastWidth: 1,
  };

  @ViewChild('demoImage') imageElement: ElementRef;
  demoMenu: demoDocument | null = null;

  onImageLoad() {
    this.demoDocument = {
      imageElement: this.imageElement.nativeElement,
      markup: [
        {
          text: 'Text',
          x1: 75, x2: 410, y1: 250, y2: 300,
        },
      ],
    };
  }
```

## Build

`npm install`

`ng serve demo-app`

___


## Issues

If you identify any errors in this module, or have an idea for an improvement, please open an [issue](https://github.com/creeston/ng-ocr-editor/issues).
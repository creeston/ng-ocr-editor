import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgOcrEditorComponent } from '../../../ng-ocr-editor-component/src/public-api';
import { OcrDocument } from '../../../ng-ocr-editor-component/src/lib/marked-menu';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgOcrEditorComponent, CommonModule],
  templateUrl: './app.component.html',
  providers: [],
  styleUrl: './app.component.scss'
})
export class AppComponent  {
  onImageLoad(): void {
    this.demoMenu = {
      pages: [
        {
          pageNumber: 1,
          imageElement: this.imageElement.nativeElement,
          markup: [
            {
              text: "Cheescake",
              x1: 75,
              x2: 410,
              y1: 250,
              y2: 300,
              editSelected: false,
              hover: false,
              children: []
            },
            {
              text: "Chocolate lava cake",
              x1: 75,
              x2: 560,
              y1: 480,
              y2: 540,
              editSelected: false,
              hover: false,
              children: []
            },
          ]
        }
      ]
      
    }
  }
  title = 'demo-app';

  @ViewChild('demoImage') imageElement: ElementRef;
  demoMenu: OcrDocument | null = null;
}

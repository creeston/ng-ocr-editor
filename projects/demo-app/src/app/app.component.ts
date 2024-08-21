import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgOcrEditorComponent } from '../../../ng-ocr-editor/src/public-api';
import { BoundingBoxStyle, OcrDocument } from '../../../ng-ocr-editor/src/lib/marked-menu';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NgOcrEditorComponent,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    CommonModule,
  ],
  templateUrl: './app.component.html',
  providers: [],
  styleUrl: './app.component.scss',
})
export class AppComponent {
  @ViewChild('editor') ocrEditor: NgOcrEditorComponent;
  displayedColumns = ['position', 'name'];

  boundingBoxStyle: BoundingBoxStyle = {
    color: '#627320',
    width: 2,
    selectedColor: '#4F4742',
    selectedWidth: 5,
    contrastColor: '#fff6f0',
    constastWidth: 1,
  };

  onImageLoad(): void {
    this.demoMenu = {
      imageElement: this.imageElement.nativeElement,
      markup: [
        {
          text: 'Cheescake',
          x1: 75,
          x2: 410,
          y1: 250,
          y2: 300,
          editSelected: false,
          viewToggled: true,
          hovered: false,
          children: [],
          viewStyle: {
            style: 'underline',
            color: 'red',
          },
        },
        {
          text: 'Chocolate lava cake',
          x1: 75,
          x2: 560,
          y1: 480,
          y2: 540,
          editSelected: false,
          viewToggled: true,
          hovered: false,
          children: [],
          viewStyle: {
            style: 'fill',
            color: '#000000',
          },
        },
        {
          text: 'Soft drinks',
          x1: 75,
          x2: 400,
          y1: 835,
          y2: 895,
          editSelected: false,
          viewToggled: true,
          hovered: false,
          children: [],
          viewStyle: {
            style: 'overflow',
            color: '#000000',
          },
        },
      ],
    };
  }
  title = 'demo-app';

  @ViewChild('demoImage') imageElement: ElementRef;
  demoMenu: OcrDocument | null = null;
}

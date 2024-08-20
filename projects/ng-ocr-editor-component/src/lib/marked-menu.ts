export interface OcrDocument {
    pages: OcrPage[];
}

export interface OcrPage {
    pageNumber: number;
    markup: OcrLine[];
    imageElement?: HTMLImageElement;
}

export interface Viewport {
    x1: number;
    y1: number;
    height: number;
    width: number;
}

export interface OcrLine {
    text: string;
    x1: number;
    x2: number;
    y1: number;
    y2: number;
    editSelected: boolean;
    hover: boolean;
    children: OcrLine[];
}
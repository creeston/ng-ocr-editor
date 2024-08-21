export interface OcrDocument {
  markup: OcrBox[];
  imageElement?: HTMLImageElement;
}

export interface Viewport {
  x1: number;
  y1: number;
  height: number;
  width: number;
}

export interface OcrBox {
  text: string;
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  editSelected: boolean;
  viewToggled: boolean;
  hovered: boolean;
  viewStyle?: ViewStyle;
  children: OcrBox[];
}

export interface BoundingBoxStyle {
  color: string;
  width: number;
  selectedColor: string;
  selectedWidth: number;
  contrastColor: string;
  constastWidth: number
}

export interface ViewStyle {
  color: string;
  style: 'underline' | 'fill' | 'overflow';
}

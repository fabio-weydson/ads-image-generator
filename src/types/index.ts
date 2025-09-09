export interface ProductData {
  name: string;
  price: string;
  description: string;
  image: string | null;
}

export interface CustomizationData {
  slogan: string;
  logo: string | null;
  mainColor: string | null;
  imageUrl: string;
  resultImages: string[] | null;
  context?: string;
  focusOnProduct?: boolean;
  zoomLevel?: number;
  productPosition?: 'center'| 'center-left' | 'center-right' | 'left-bottom' | 'right-bottom' | 'left-top' | 'right-top';
  usePeople: boolean;
}

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
        inlineData?: {
          data: string;
          mimeType: string;
        };
      }>;
    };
  }>;
}

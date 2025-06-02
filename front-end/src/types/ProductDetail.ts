export interface Product {
  id: string;
  name: string;
  price: number;
  images: {
    main: string;
    thumbnails: string[];
  };
  sku: string;
  inStock: boolean;
  colors: {
    name: string;
    value: string;
    isSelected?: boolean;
  }[];
  sizes: {
    name: string;
    weight: string;
    isSelected?: boolean;
  }[];
  description: string;
  features: string;
  reviews: any[];
}

export interface RelatedProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  isFavorite?: boolean;
}
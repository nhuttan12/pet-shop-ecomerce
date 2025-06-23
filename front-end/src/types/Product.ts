export interface PetCategory {
  id: number;
  name: string;
  image: string;
  vectorImage: string;
}

export interface FilterCategory {
  id: number;
  name: string;
  count: number;
  checked: boolean;
}

export interface Brand {
  id: number;
  name: string;
  count: number;
  checked: boolean;
}

export interface PetTag {
  id: number;
  name: string;
  selected: boolean;
}

export interface Product {
  id: number;
  name: string;
  price: string;
  // image: string;
  thumbnailUrl?: string;
  isFavorite: boolean;
  wishlistId?: number;
}

export interface PriceRange {
  min: number;
  max: number;
}

// src/types/product.ts
export interface GetAllProductResponseDto {
  id: number;
  name: string;
  description: string;
  price: number;
  brandName: string;
  categoryName: string;
  status: string;
  thumbnailUrl: string;
  stock: number;
}

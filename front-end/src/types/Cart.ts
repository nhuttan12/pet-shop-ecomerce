// export interface CartItem {
//   id: number;
//   name: string;
//   price: number;
//   quantity: number;
//   image: string;
// }

export interface PromoCode {
  code: string;
  discount: number;
}

export interface CartDetailResponse {
  cartDetailId: number;
  quantity: number;
  price: number;
  cartDetailStatus: string; // hoặc enum
  productId: number;
  productName: string;
  productPrice: number;
  productStocking: number;
  productStatus: string; // hoặc enum
  imageUrl: string | null;
}
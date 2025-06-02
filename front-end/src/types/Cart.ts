export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface PromoCode {
  code: string;
  discount: number;
}
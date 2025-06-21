export interface GetOrderDetailsByOrderIdResponseDto {
  id: number;
  orderId: number;
  productname: string;
  imageUrl: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

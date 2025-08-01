export interface GetOrderDetailsByOrderIDResponseDto {
  id: number;
  orderID: number;
  productname: string;
  imageUrl: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

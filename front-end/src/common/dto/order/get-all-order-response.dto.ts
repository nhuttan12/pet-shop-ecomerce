export interface GetAllOrdersResponseDto {
  id: number;
  userID: number;
  totalPrice: number;
  paymentMethod: string;
  shippingMethod: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetAllOrdersResponseDto {
  id: number;
  userId: number;
  totalPrice: number;
  paymentMethod: string;
  shippingMethod: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

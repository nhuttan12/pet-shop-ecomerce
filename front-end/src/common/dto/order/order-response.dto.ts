import { OrderStatus } from "../../enum/order/order-status.enum";
import { PaymentMethod } from "../../enum/order/payment-method.enum";
import { ShippingMethod } from "../../enum/order/shipping_method.enum";

export interface OrderResponseDto {
  id: number;
  userID: number;
  totalPrice: number;
  paymentMethod: PaymentMethod;
  shippingMethod: ShippingMethod;
  voucherID?: number;
  address: string;
  city: string;
  country: string;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

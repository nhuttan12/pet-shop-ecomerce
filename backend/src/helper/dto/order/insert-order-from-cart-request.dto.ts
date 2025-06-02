import { PaymentMethod } from 'src/helper/enum/payment-method.enum';
import { ShippingMethod } from 'src/helper/enum/shipping_method.enum';
import { OrderStatus } from 'src/helper/enum/status/order-status.enum';
import { InsertOrderDetailDto } from './insert-order-detail-request.dto';

export class InsertOrderFromCartDto {
  userId: number;
  totalPrice: number;
  paymentMethod: PaymentMethod;
  shippingMethod: ShippingMethod;
  status: OrderStatus;
  orderDetails: InsertOrderDetailDto[];
}

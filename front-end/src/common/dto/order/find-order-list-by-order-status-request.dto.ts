import { OrderStatus } from "../../enum/order/order-status.enum.ts";

export interface FindOrderListByOrderStatusRequestDto {
  status: OrderStatus;
}

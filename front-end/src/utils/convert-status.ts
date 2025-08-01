import { OrderStatus } from "../common/enum/order/order-status.enum.ts";

const statusMap: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: "Chờ thanh toán",
  [OrderStatus.CONFIRMED]: "Đã xác nhận",
  [OrderStatus.PROCESSING]: "Đang xử lý",
  [OrderStatus.SHIPPING]: "Vận chuyển",
  [OrderStatus.DELIVERED]: "Hoàn thành",
  [OrderStatus.CANCELED]: "Đã hủy",
  [OrderStatus.RETURNED]: "Trả hàng/Hoàn tiền",
  [OrderStatus.FAILED]: "Thất bại",
};

export function toVietnameseStatus(status: OrderStatus): string {
  return statusMap[status] || status;
}

export function toEnglishStatus(vnStatus: string): OrderStatus | null {
  const found = (Object.keys(statusMap) as OrderStatus[]).find(
    (key) => statusMap[key] === vnStatus
  );
  return found || null;
}
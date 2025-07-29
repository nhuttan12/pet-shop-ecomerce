import React from "react";
import {
  GetAllOrdersResponseDto
} from "../../common/dto/order/get-all-order-response.dto";

interface OrderListProps {
  orders: GetAllOrdersResponseDto[];
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    case "completed":
      return "bg-green-100 text-green-700";
    case "cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export const OrderList: React.FC<OrderListProps> = ({ orders }) => {
  if (!orders || orders.length === 0) {
    return <p className="text-gray-500 text-sm text-center py-6">No orders
      found.</p>;
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div
          key={order.id}
          className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-all duration-200"
        >
          {/* Header */}
          <div
            className="flex flex-wrap justify-between items-center border-b pb-3 mb-3">
            <p className="text-sm font-medium text-gray-800">
              Order <span className="font-semibold">#{order.id}</span>
            </p>
            <span
              className={`text-xs font-medium px-3 py-1 rounded-full ${getStatusColor(
                order.status
              )}`}
            >
              {order.status}
            </span>
          </div>

          {/* Details */}
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-gray-700">
            <p>
              <span
                className="font-semibold">Payment:</span> {order.paymentMethod}
            </p>
            <p>
              <span
                className="font-semibold">Shipping:</span> {order.shippingMethod}
            </p>
            <p>
              <span className="font-semibold">Total:</span>{" "}
              <span className="text-orange-600 font-semibold">
                {order.totalPrice.toLocaleString()}₫
              </span>
            </p>
            <p className="col-span-2 lg:col-span-1">
              <span className="font-semibold">Created:</span>{" "}
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-4">
            <button
              className="px-4 py-2 text-sm border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 transition">
              Chi tiết đơn hàng
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

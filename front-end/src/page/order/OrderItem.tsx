import React from "react";

interface OrderItemProps {
  image: string;
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export const OrderItem: React.FC<OrderItemProps> = ({
  image,
  id,
  name,
  price,
  quantity
}: OrderItemProps) => {
  return (
    <div className="border border-gray-300 rounded overflow-hidden">
      <div
        className="flex flex-col md:flex-row items-center justify-between gap-4 p-4">
        <div className="flex items-center gap-4 w-full">
          <img
            src={image}
            alt={name}
            className="w-[80px] h-[80px] object-cover border border-gray-200"
          />
          <div>
            <h3 className="font-semibold text-sm text-gray-800">{name}</h3>
            <p className="text-xs text-gray-500">ID: {id}</p>
            <p className="text-xs text-gray-500">x{quantity}</p>
          </div>
        </div>

        <div
          className="flex items-center justify-between md:justify-end w-full md:w-auto gap-4">
          <div
            className="text-orange-600 font-semibold text-sm">{price.toLocaleString()} vnđ
          </div>
          <button
            className="text-sm px-4 py-2 border border-orange-500 text-orange-500 rounded hover:bg-orange-100">
            Đánh giá
          </button>
          <button
            className="text-sm px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">
            Mua lại
          </button>
        </div>
      </div>
    </div>
  )
}
import { OrderItem } from "./OrderItem.tsx";
import { useEffect } from "react";

interface OrderDetailModalProps {
  isOpen: boolean;
  isLoading?: boolean;
  onClose: () => void;
  orderItems: {
    image: string;
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  isOpen,
  onClose,
  orderItems,
  isLoading
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-xl overflow-y-auto"
    >
      <div
        className="bg-white rounded-lg shadow-lg w-[90%] max-w-5xl max-h-[90vh] p-6 relative overflow-y-auto"
      >
        <h2 className="text-lg font-semibold mb-4">Chi tiết đơn hàng</h2>

        {isLoading ?
          (
            <div className="text-center py-4 text-gray-500">Đang tải chi
              tiết đơn hàng...</div>
          ) :
          (
            <div className="space-y-4">
              {orderItems.map((item) => (
                <OrderItem
                  key={item.id}
                  image={item.image}
                  id={item.id}
                  name={item.name}
                  price={item.price}
                  quantity={item.quantity}
                />
              ))}
            </div>
          )}

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default OrderDetailModal;
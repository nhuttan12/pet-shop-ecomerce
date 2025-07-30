import { OrderStatus } from "../../common/enum/order/order-status.enum.ts";
import { toVietnameseStatus } from "../../utils/convert-status.ts";

interface Props {
  selectedStatus: OrderStatus | null;
  onChange: (status: OrderStatus | null) => void;
  onStatusSelect: (status: OrderStatus | null) => void;
}

const OrderStatusFilter: React.FC<Props> = ({
  selectedStatus,
  onChange,
  onStatusSelect
}) => {
  return (
    <div
      className="flex flex-wrap items-center gap-4 border-b border-gray-200 pb-2 text-sm font-medium text-gray-600">
      {Object.values(OrderStatus).map((status) => {
        const isSelected = selectedStatus === status;

        return (
          <button
            key={status}
            onClick={() => {
              const newStatus: OrderStatus | null = isSelected ?
                null :
                status;
              onChange(newStatus);
              onStatusSelect(newStatus);
            }}
            className={`
              px-3 py-1 rounded-md border border-gray-300 transition-colors duration-200
              ${isSelected ?
              "bg-orange-500 text-white" :
              "bg-white text-gray-700 hover:bg-gray-100"}
            `}
          >
            {toVietnameseStatus(status)}
          </button>
        );
      })}
    </div>
  );
};

export default OrderStatusFilter;
import React, { useEffect, useState } from "react";
import { useOrder } from "../../hooks/product/useOrder.ts";
import {
  GetAllOrdersResponseDto
} from "../../common/dto/order/get-all-order-response.dto.ts";
import { OrderList } from "./Orderlist.tsx";
import { useAuth } from "../../contexts/AuthContext.tsx";

const MyOrders: React.FC = () => {
  const {
    error,
    loading,
    getAllOrdersHandler,
    getOrderListByOrderIDHandler
  } = useOrder();
  const { token } = useAuth();
  const [orders, setOrders] = useState<GetAllOrdersResponseDto[]>([]);
  const [searchID, setSearchID] = useState<string>('');

  useEffect(() => {
    const fetchOrder = async () => {
      if (!token) return;

      const data: GetAllOrdersResponseDto[] | null = await getAllOrdersHandler({
        page: 1,
        limit: 10
      }, token);

      if (data === null) {
        return;
      }

      setOrders(data);
    }

    fetchOrder();
  }, [token]);

  // Handle search
  const handleSearch = async () => {
    if (!token) return;

    if (!searchID.trim()) {
      // If search box is empty, load all orders again
      const data: GetAllOrdersResponseDto[] | null = await getAllOrdersHandler({
        page: 1,
        limit: 10
      }, token);
      if (data) setOrders(data);
      return;
    }

    const id: number = parseInt(searchID, 10);

    if (isNaN(id)) {
      alert("Mã số đơn hàng phải là số!");
      return;
    }

    const data: GetAllOrdersResponseDto[] | null = await getOrderListByOrderIDHandler(
      { orderID: id },
      token
    );

    // API returns an array of OrderResponseDto
    if (data) {
      setOrders(data as GetAllOrdersResponseDto[]);
    } else {
      setOrders([]);
    }
  };

  return (
    <div className="bg-white py-8">
      <div className="container mx-auto px-4">
        {/* Bộ lọc trạng thái đơn hàng */}
        <div className="mb-4">
          <div
            className="flex flex-wrap items-center gap-4 border-b border-gray-200 pb-2 text-sm font-medium text-gray-600">
            {[
              "Tất cả",
              "Chờ thanh toán",
              "Vận chuyển",
              "Chờ giao hàng",
              "Hoàn thành",
              "Đã hủy",
              "Trả hàng/Hoàn tiền",
            ].map((status, idx) => (
              <button
                key={idx}
                className={`px-2 pb-2 border-b-2 ${
                  idx === 0 ?
                    "border-orange-500 text-black" :
                    "border-transparent"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Thanh tìm kiếm đơn hàng */}
        <div className="mb-4 flex items-center gap-2 w-full">
          <input
            type="text"
            value={searchID}
            onChange={(e) => setSearchID(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
            className="w-full border border-gray-300 rounded px-4 py-2 text-sm"
            placeholder="Bạn có thể tìm kiếm theo mã số đơn hàng"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 whitespace-nowrap"
          >
            Tìm
          </button>
        </div>

        {/* Thông tin đơn hàng */}
        {loading ?
          (<p>'Đang tải đơn hàng'</p>) :
          error ?
            (<p>Có lỗi xảy ra khi tải đơn hàng</p>) :
            (<OrderList orders={orders}/>)
        }
      </div>
    </div>
  );
};

export default MyOrders;

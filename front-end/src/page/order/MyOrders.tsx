import React, { useEffect, useState } from "react";
import { useOrder } from "../../hooks/product/useOrder.ts";
import {
  GetAllOrdersResponseDto
} from "../../common/dto/order/get-all-order-response.dto.ts";
import { OrderList } from "./Orderlist.tsx";
import { useAuth } from "../../contexts/AuthContext.tsx";
import OrderStatusFilter from "./OrderStatusFilter.tsx";
import { OrderStatus } from "../../common/enum/order/order-status.enum.ts";
import { useNavigate } from "react-router-dom";

const MyOrders: React.FC = () => {
  const {
    error,
    loading,
    getAllOrdersHandler,
    getOrderListByOrderIDHandler,
    findOrderListByOrderStatusHandler
  } = useOrder();
  const { token, isLoading } = useAuth();
  const [orders, setOrders] = useState<GetAllOrdersResponseDto[]>([]);
  const [searchID, setSearchID] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token && !isLoading) {
      alert('Vui lòng đăng nhập trên trang chính');
      navigate('/');
    }
  }, [token, isLoading, navigate]);

  useEffect(() => {
    if (token) {
      fetchOrder();
    }
  }, [token]);

  if (isLoading) return <p>Đang kiểm tra đăng nhập...</p>;

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

  const handleStatusSelect = async (status: OrderStatus | null) => {
    if (!token) return;

    if (!status) {
      await fetchOrder();
      return;
    }

    const data = await findOrderListByOrderStatusHandler({ status }, token);
    setOrders(data ?? []);
  };

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
          <OrderStatusFilter
            selectedStatus={selectedStatus}
            onChange={(status: OrderStatus | null) => setSelectedStatus(status)}
            onStatusSelect={handleStatusSelect}
          />
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
            (<OrderList orders={orders} token={token!}/>)
        }
      </div>
    </div>
  );
};

export default MyOrders;

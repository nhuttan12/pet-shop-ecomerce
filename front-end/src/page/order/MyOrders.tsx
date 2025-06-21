import React from "react";

const MyOrders: React.FC = () => {
  return (
    <div className="bg-white py-8">
      <div className="container mx-auto px-4">
        {/* Bộ lọc trạng thái đơn hàng */}
        <div className="mb-4">
          <div className="flex flex-wrap items-center gap-4 border-b border-gray-200 pb-2 text-sm font-medium text-gray-600">
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
                  idx === 0 ? "border-orange-500 text-black" : "border-transparent"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Thanh tìm kiếm đơn hàng */}
        <div className="mb-4">
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-4 py-2 text-sm"
            placeholder="Bạn có thể tìm kiếm theo ID đơn hàng và tên món hàng"
          />
        </div>

        {/* Thông tin đơn hàng */}
        <div className="border border-gray-300 rounded overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4">
            <div className="flex items-center gap-4 w-full">
              <img
                src="/images/sample-product.png"
                alt="Sản phẩm"
                className="w-[80px] h-[80px] object-cover border border-gray-200"
              />
              <div>
                <h3 className="font-semibold text-sm text-gray-800">Bát ăn cho chó Ferplast</h3>
                <p className="text-xs text-gray-500">x1</p>
              </div>
            </div>

            <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-4">
              <div className="text-orange-600 font-semibold text-sm">99.000 vnđ</div>
              <button className="text-sm px-4 py-2 border border-orange-500 text-orange-500 rounded hover:bg-orange-100">
                Đánh giá
              </button>
              <button className="text-sm px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">
                Mua lại
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyOrders;

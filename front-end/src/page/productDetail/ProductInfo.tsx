import React, { useState } from "react";
import { ProductDetailResponse } from "../../types/ProductDetail";
import { formatCurrency } from "../../utils/formatCurrency";

interface ProductInfoProps {
  product: ProductDetailResponse;
  onAddToCart: (product: ProductDetailResponse, quantity: number) => void;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product, onAddToCart }) => {
  const [quantity, setQuantity] = useState<number>(1);

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
  };

  return (
    <div className="bg-white p-4 md:p-6">
      <h1 className="text-2xl font-bold text-[#522f1f] mb-4 leading-tight">
        {product.name}
      </h1>

      <div className="text-sm text-gray-700 mb-4">
        <span className="font-medium">Danh mục:</span> {product.categoryName}{" "}
        | <span className="font-medium">Thương hiệu:</span> {product.brandName}
      </div>

      <div className="text-2xl font-semibold text-red-600 mb-6">
        {formatCurrency(product.price)}
      </div>

      <div className="text-sm text-gray-700 mb-6">
        {product.stock > 0 ? (
          <span className="text-green-600">Còn hàng: {product.stock} sản phẩm</span>
        ) : (
          <span className="text-red-500">Hết hàng</span>
        )}
      </div>

      {/* Quantity and Add to Cart */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex">
          <button
            className="w-[45px] h-[45px] bg-gray-100"
            onClick={() => quantity > 1 && setQuantity(quantity - 1)}
          >
            -
          </button>
          <div className="w-[60px] h-[45px] border flex items-center justify-center">
            {quantity}
          </div>
          <button
            className="w-[45px] h-[45px] bg-gray-100"
            onClick={() => setQuantity(quantity + 1)}
          >
            +
          </button>
        </div>

        <button
          className="h-[45px] bg-red-600 text-white px-8 uppercase"
          onClick={handleAddToCart}
        >
          Thêm vào giỏ
        </button>
      </div>
    </div>
  );
};

export default ProductInfo;


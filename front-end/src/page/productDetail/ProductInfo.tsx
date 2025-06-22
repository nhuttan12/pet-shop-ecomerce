import React, { useState } from "react";
import { Product } from "../../types/ProductDetail";
import { formatCurrency } from "../../utils/formatCurrency";
import { FaCheck } from "react-icons/fa6";

interface ProductInfoProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product, onAddToCart }) => {
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors.find((color) => color.isSelected)?.value ||
      product.colors[0]?.value ||
      ""
  );

  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes.find((size) => size.isSelected)?.name ||
      product.sizes[0]?.name ||
      ""
  );

  const [quantity, setQuantity] = useState<number>(1);

  const handleColorChange = (colorValue: string) => {
    setSelectedColor(colorValue);
  };

  const handleSizeChange = (sizeName: string) => {
    setSelectedSize(sizeName);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
  };

  return (
    <div className="bg-white p-4 md:p-6">
      <h1 className="text-2xl font-bold text-[#522f1f] mb-4 leading-tight">
        {product.name}
      </h1>

      <div className="flex items-center text-sm text-gray-700 mb-4">
        <span>
          Mã sản phẩm:{" "}
          <span className="text-[#6b4433] font-medium">{product.sku}</span>
        </span>
        <div className="mx-2 h-2.5 w-0.5 bg-gray-300"></div>
        <span>
          Tình trạng:{" "}
          <span className="text-[#6b4433] font-medium">
            {product.inStock ? "Còn hàng" : "Hết hàng"}
          </span>
        </span>
      </div>

      <div className="text-2xl font-semibold text-red-600 mb-6">
        {formatCurrency(product.price)}
      </div>

      {/* Color Selection */}
      <div className="mb-6">
        <div className="text-sm mb-2">
          Màu sắc:{" "}
          <span className="font-bold text-black">
            {product.colors.find((c) => c.value === selectedColor)?.name}
          </span>
        </div>
        <div className="flex gap-2">
          {product.colors.map((color, index) => (
            <div
              key={index}
              className={`relative w-[70px] h-[35px] flex items-center justify-center cursor-pointer overflow-hidden rounded ${
                color.value === selectedColor
                  ? "bg-[#6b44330f] border border-[#6b4433]"
                  : "bg-gray-100"
              }`}
              onClick={() => handleColorChange(color.value)}
            >
              <span className="text-xs font-medium">{color.name}</span>

              {/* Tam giác góc trên bên phải */}
              {color.value === selectedColor && (
                <>
                  <div className="absolute top-0 right-0 w-0 h-0 border-t-[24px] border-l-[24px] border-t-[#6b4433] border-l-transparent" />
                  <div className="absolute top-0 right-0 w-[20px] h-[20px] flex items-center justify-center translate-x-1 -translate-y-1">
                    <FaCheck className="text-white text-[10px]" />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Size Selection */}
      <div className="mb-6">
        <div className="text-sm mb-2">Kích thước:</div>
        <div className="flex flex-wrap gap-2">
          {product.sizes.map((size, index) => (
            <div
              key={index}
              className={`relative w-[70px] h-[35px] flex items-center justify-center cursor-pointer rounded overflow-hidden ${
                size.name === selectedSize
                  ? "bg-[#6b44330f] border border-[#6b4433]"
                  : "bg-gray-100"
              }`}
              onClick={() => handleSizeChange(size.name)}
            >
              <span className="text-xs font-medium">{size.name}</span>

              {/* Tam giác + dấu tích */}
              {size.name === selectedSize && (
                <>
                  <div className="absolute top-0 right-0 w-0 h-0 border-t-[28px] border-l-[28px] border-t-[#6b4433] border-l-transparent" />
                  <div className="absolute top-0 right-0 w-[24px] h-[24px] flex items-center justify-center translate-x-1 -translate-y-1">
                    <FaCheck className="text-white text-[12px]" />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quantity and Add to Cart */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex">
          <button
            className="w-[45px] h-[45px] bg-gray-100 flex items-center justify-center text-lg font-semibold"
            onClick={decreaseQuantity}
          >
            -
          </button>
          <div className="w-[60px] h-[45px] border border-gray-100 flex items-center justify-center">
            <span className="text-sm font-semibold">{quantity}</span>
          </div>
          <button
            className="w-[45px] h-[45px] bg-gray-100 flex items-center justify-center text-lg font-semibold"
            onClick={increaseQuantity}
          >
            +
          </button>
        </div>

        <button
          className="h-[45px] bg-red-600 text-white font-semibold px-8 tracking-wider uppercase"
          onClick={handleAddToCart}
        >
          Thêm vào giỏ
        </button>
      </div>

      {/* Product Information */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-[#522f1f] uppercase mb-4">
          Thông tin sản phẩm
        </h2>
        <p className="text-base">
          Bạn inbox cho shop giống cún, mèo và cân nặng, tụi mình tư vấn size để
          bạn đặt hàng cho đúng nhé ❤
        </p>
      </div>
    </div>
  );
};

export default ProductInfo;

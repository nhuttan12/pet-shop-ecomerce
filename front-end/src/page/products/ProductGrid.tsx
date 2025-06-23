import React from 'react';
import { Product } from '../../types/Product';
import Card from '../../components/common/Card';
import Dropdown from '../../components/ui/Dropdown';
import Pagination from '../../components/ui/Pagination';
import { RiArrowDropDownLine } from "react-icons/ri";

interface ProductGridProps {
  products: Product[];
  totalResults: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSortChange: (value: string) => void;
  onFavoriteToggle: (id: number) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  totalResults,
  currentPage,
  totalPages,
  onPageChange,
  onSortChange,
  onFavoriteToggle
}) => {
  const sortOptions = [
    { value: 'newest', label: 'Sắp xếp theo mới nhất' },
    { value: 'price-asc', label: 'Giá: Thấp đến cao' },
    { value: 'price-desc', label: 'Giá: Cao đến thấp' },
    { value: 'name-asc', label: 'Tên: A-Z' },
    { value: 'name-desc', label: 'Tên: Z-A' },
  ];

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <p className="text-xl text-gray-500">
          Hiển thị kết quả từ 12 đến 12 trong số {totalResults} kết quả
        </p>
        <Dropdown
          options={sortOptions}
          value="newest"
          onChange={onSortChange}
          className="w-full md:w-[270px] mt-4 md:mt-0"
          icon={<RiArrowDropDownLine className="w-6 h-6" />}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card
            key={product.id}
            id={product.id}
            image={product.image}
            title={product.name}
            price={product.price}
            isFavorite={product.isFavorite}
            // onFavoriteToggle={onFavoriteToggle}
            onFavoriteToggle={() => onFavoriteToggle(product.id)}
          />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        className="mt-12"
      />
    </div>
  );
};

export default ProductGrid;
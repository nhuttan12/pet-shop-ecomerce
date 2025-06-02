import React, { useState } from 'react';
import { FilterCategory, Brand, PetTag, PriceRange } from '../../types/Product';
import Button from '../../components/ui/Button';

interface FilterSectionProps {
  categories: FilterCategory[];
  brands: Brand[];
  tags: PetTag[];
  priceRange: PriceRange;
  onCategoryChange: (id: number) => void;
  onBrandChange: (id: number) => void;
  onTagSelect: (id: number) => void;
  onPriceRangeChange: (range: PriceRange) => void;
  onApplyFilters: () => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  categories,
  brands,
  tags,
  priceRange,
  onCategoryChange,
  onBrandChange,
  onTagSelect,
  onPriceRangeChange,
  onApplyFilters
}) => {
  const [localPriceRange, setLocalPriceRange] = useState<PriceRange>(priceRange);

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setLocalPriceRange({
      ...localPriceRange,
      max: value
    });
  };

  const handleApplyClick = () => {
    onPriceRangeChange(localPriceRange);
    onApplyFilters();
  };

  return (
    <aside className="w-full">
      {/* Categories */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Lọc theo danh mục</h3>
        <ul className="space-y-3">
          {categories.map((category) => (
            <li key={category.id} className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={`category-${category.id}`}
                  checked={category.checked}
                  onChange={() => onCategoryChange(category.id)}
                  className="w-4 h-4 border border-gray-400 rounded"
                />
                <label htmlFor={`category-${category.id}`} className="ml-3 text-base font-medium">
                  {category.name}
                </label>
              </div>
              <span className="bg-gray-50 text-orange-DEFAULT text-sm px-2 py-1 rounded-full">
                {category.count}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Price Range */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Lọc theo giá</h3>
        <input
          type="range"
          min={200000}
          max={10000000}
          step={100000}
          value={localPriceRange.max}
          onChange={handleRangeChange}
          className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <p className="mt-4 text-base font-medium">
          Giá: {localPriceRange.min.toLocaleString()}đ - {localPriceRange.max.toLocaleString()}đ
        </p>
        <Button 
          variant="primary" 
        //   size="sm" 
          className="mt-4 bg-black text-white"
          onClick={handleApplyClick}
        >
          Áp dụng
        </Button>
      </div>

      {/* Brands */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Lọc theo thương hiệu</h3>
        <ul className="space-y-3">
          {brands.map((brand) => (
            <li key={brand.id} className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={`brand-${brand.id}`}
                  checked={brand.checked}
                  onChange={() => onBrandChange(brand.id)}
                  className="w-4 h-4 border border-gray-400 rounded"
                />
                <label htmlFor={`brand-${brand.id}`} className="ml-3 text-base font-medium">
                  {brand.name}
                </label>
              </div>
              <span className="bg-gray-50 text-orange-DEFAULT text-sm px-2 py-1 rounded-full">
                {brand.count}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Tags */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Lọc theo thẻ</h3>
        <div className="flex flex-wrap gap-3">
          {tags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => onTagSelect(tag.id)}
              className={`py-2 px-4 rounded-xl text-base font-semibold ${
                tag.selected 
                  ? 'bg-orange-DEFAULT text-white' :'bg-gray-50 text-black border-2 border-gray-50'
              }`}
            >
              {tag.name}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default FilterSection;
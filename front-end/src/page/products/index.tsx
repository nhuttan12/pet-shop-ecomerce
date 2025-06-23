import React, { useState } from 'react';
import Header from '../../components/layout/header/header';
import Footer from '../../components/layout/footer/footer';
import HeroSection from '../../components/common/HeroSection';
import CategorySection from './CategorySection';
import FilterSection from './FilterSection';
import ProductGrid from './ProductGrid';
import { useProducts } from '../../hooks/product/useProducts';

import { PetCategory, FilterCategory, Brand, PetTag, Product, PriceRange } from '../../types/Product';

import cat from '../../assets/cat.jpg';
import hamster from '../../assets/hamster.jpg';
import dog from '../../assets/dog.jpg';
import vet from '../../assets/vet.jpg';
import rabbit from '../../assets/rabbit.jpg';
import turtle from '../../assets/turtle.jpg';

const Products: React.FC = () => {
  // Pet categories (giữ lại data tĩnh nếu muốn)
  const [categories] = useState<PetCategory[]>([
    { id: 1, name: 'Mèo', image: cat, vectorImage: cat },
    { id: 2, name: 'Chuột', image: hamster , vectorImage: hamster },
    { id: 3, name: 'Chó', image: dog, vectorImage: dog },
    { id: 4, name: 'Vẹt', image: vet, vectorImage: vet },
    { id: 5, name: 'Thỏ', image: rabbit, vectorImage: rabbit },
    { id: 6, name: 'Rùa', image: turtle, vectorImage: turtle },
  ]);

  // Filter categories
  const [filterCategories, setFilterCategories] = useState<FilterCategory[]>([
    { id: 1, name: 'Nội thất', count: 21, checked: false },
    { id: 2, name: 'Khay thức ăn', count: 28, checked: false },
    { id: 3, name: 'Đồ thú cưng', count: 12, checked: false },
    { id: 4, name: 'Thức ăn', count: 80, checked: false },
    { id: 5, name: 'Đồ chơi', count: 90, checked: false },
    { id: 6, name: 'Khuyễn mãi', count: 24, checked: false },
  ]);

  // Brands
  const [brands, setBrands] = useState<Brand[]>([
    { id: 1, name: 'Perflast', count: 28, checked: false },
    { id: 2, name: 'Pet care', count: 18, checked: false },
    { id: 3, name: 'Petmate', count: 16, checked: false },
    { id: 4, name: 'Hagen', count: 40, checked: false },
    { id: 5, name: 'PetSafe', count: 28, checked: false },
    { id: 6, name: 'CATS LOVE', count: 18, checked: false },
  ]);

  // Pet tags
  const [tags, setTags] = useState<PetTag[]>([
    { id: 1, name: 'Chó', selected: false },
    { id: 2, name: 'Mèo', selected: false },
    { id: 3, name: 'Tự nhiên', selected: false },
    { id: 4, name: 'Vẹt', selected: false },
    { id: 5, name: 'Cún con', selected: false },
    { id: 6, name: 'Mèo con', selected: false },
  ]);

  // Price range
  const [priceRange, setPriceRange] = useState<PriceRange>({
    min: 200000,
    max: 10000000
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const limit = 12; // items per page

  // Lấy products từ hook, truyền currentPage và limit
  const { products, loading, error } = useProducts(currentPage, limit);

  // Bạn có thể lấy totalPages và totalResults từ API trả về nếu có, hoặc tạm giả định
  const totalResults = products.length; // tạm thời là số lượng hiện tại
  const totalPages = Math.ceil(totalResults / limit) || 1;

  // Các hàm xử lý filter, sort, page change (giữ nguyên hoặc tùy chỉnh theo API)

  const handleCategoryChange = (id: number) => {
    setFilterCategories(
      filterCategories.map(category => 
        category.id === id 
          ? { ...category, checked: !category.checked } 
          : category
      )
    );
  };

  const handleBrandChange = (id: number) => {
    setBrands(
      brands.map(brand => 
        brand.id === id 
          ? { ...brand, checked: !brand.checked } 
          : brand
      )
    );
  };

  const handleTagSelect = (id: number) => {
    setTags(
      tags.map(tag => 
        tag.id === id 
          ? { ...tag, selected: !tag.selected } 
          : tag
      )
    );
  };

  const handlePriceRangeChange = (range: PriceRange) => {
    setPriceRange(range);
  };

  const handleApplyFilters = () => {
    console.log('Applying filters...');
    // TODO: Gọi API filter nếu có
  };

  const handleSortChange = (value: string) => {
    console.log('Sort changed to:', value);
    // TODO: Xử lý sort khi gọi API
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFavoriteToggle = (id: number) => {
    // Nếu muốn xử lý yêu thích, bạn có thể gọi API hoặc update state local tạm thời
    console.log('Toggle favorite for product id:', id);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <CategorySection categories={categories} />
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <FilterSection 
                categories={filterCategories}
                brands={brands}
                tags={tags}
                priceRange={priceRange}
                onCategoryChange={handleCategoryChange}
                onBrandChange={handleBrandChange}
                onTagSelect={handleTagSelect}
                onPriceRangeChange={handlePriceRangeChange}
                onApplyFilters={handleApplyFilters}
              />
            </div>
            <div className="lg:col-span-3">
              {loading && <p>Đang tải sản phẩm...</p>}
              {error && <p className="text-red-500">{error}</p>}
              {!loading && !error && (
                <ProductGrid 
                  products={products}
                  totalResults={totalResults}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  onSortChange={handleSortChange}
                  onFavoriteToggle={handleFavoriteToggle}
                />
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Products;

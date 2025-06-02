import React, { useState } from 'react';
import Header from '../../components/layout/header/header';
import Footer from '../../components/layout/footer/footer';
import HeroSection from '../../components/common/HeroSection';
import CategorySection from './CategorySection';
import FilterSection from './FilterSection';
import ProductGrid from './ProductGrid';
import { PetCategory, FilterCategory, Brand, PetTag, Product, PriceRange } from '../../types/Product';

import cat from '../../assets/cat.jpg';
import hamster from '../../assets/hamster.jpg';
import dog from '../../assets/dog.jpg';
import vet from '../../assets/vet.jpg';
import rabbit from '../../assets/rabbit.jpg';
import turtle from '../../assets/turtle.jpg';
import food from '../../assets/thucan.jpg';

const Products: React.FC = () => {
  // Pet categories
  const [categories] = useState<PetCategory[]>([
    { id: 1, name: 'Mèo', image: cat, vectorImage: cat },
    { id: 2, name: 'Chuột', image:hamster , vectorImage: hamster },
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

  // Products
  const [products, setProducts] = useState<Product[]>([
    { 
      id: 1, 
      name: 'Giỏ đựng thú cưng Petmate', 
      price: '349.000 VNĐ', 
      image: food, 
      isFavorite: false 
    },
    { 
      id: 2, 
      name: 'Bát ăn cho mèo PetSafe', 
      price: '49.000 VNĐ', 
      image: food, 
      isFavorite: false 
    },
    { 
      id: 3, 
      name: 'Giường cho mèo Catit', 
      price: '429.000 VNĐ', 
      image: food, 
      isFavorite: false 
    },
    { 
      id: 4, 
      name: 'Thức ăn cho mèo cao cấp CATS LOVE', 
      price: '249.000 VNĐ', 
      image: food, 
      isFavorite: false 
    },
    { 
      id: 5, 
      name: 'Bát ăn cho chó Omlet', 
      price: '49.000 VNĐ', 
      image: food, 
      isFavorite: false 
    },
    { 
      id: 6, 
      name: 'Máy rửa chân cho chó', 
      price: '429.000 VNĐ', 
      image: food, 
      isFavorite: false 
    },
    { 
      id: 7, 
      name: 'Dây dắt chó Hagen', 
      price: '99.000 VNĐ', 
      image: food, 
      isFavorite: false 
    },
    { 
      id: 8, 
      name: 'Giường cho chó Ferplast', 
      price: '399.000 VNĐ', 
      image: food, 
      isFavorite: false 
    },
    { 
      id: 9, 
      name: 'Máy xấy khô lông thú cưng', 
      price: '199.000 VNĐ', 
      image: food, 
      isFavorite: false 
    },
    { 
      id: 10, 
      name: 'Thức ăn cho chó hãng Jinx', 
      price: '269.000 VNĐ', 
      image: food, 
      isFavorite: false 
    },
    { 
      id: 11, 
      name: 'Bát ăn cho chó Ferplast', 
      price: '129.000 VNĐ', 
      image: food, 
      isFavorite: false 
    },
    { 
      id: 12, 
      name: 'Thức ăn cho chó hãng Omni', 
      price: '169.000 VNĐ', 
      image: food, 
      isFavorite: false 
    },
  ]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 2;
  const totalResults = 14;

  // Handle category filter change
  const handleCategoryChange = (id: number) => {
    setFilterCategories(
      filterCategories.map(category => 
        category.id === id 
          ? { ...category, checked: !category.checked } 
          : category
      )
    );
  };

  // Handle brand filter change
  const handleBrandChange = (id: number) => {
    setBrands(
      brands.map(brand => 
        brand.id === id 
          ? { ...brand, checked: !brand.checked } 
          : brand
      )
    );
  };

  // Handle tag selection
  const handleTagSelect = (id: number) => {
    setTags(
      tags.map(tag => 
        tag.id === id 
          ? { ...tag, selected: !tag.selected } 
          : tag
      )
    );
  };

  // Handle price range change
  const handlePriceRangeChange = (range: PriceRange) => {
    setPriceRange(range);
  };

  // Handle apply filters
  const handleApplyFilters = () => {
    console.log('Applying filters...');
    // In a real app, this would filter the products based on selected filters
  };

  // Handle sort change
  const handleSortChange = (value: string) => {
    console.log('Sort changed to:', value);
    // In a real app, this would sort the products
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle favorite toggle
  const handleFavoriteToggle = (id: number) => {
    setProducts(
      products.map(product => 
        product.id === id 
          ? { ...product, isFavorite: !product.isFavorite } 
          : product
      )
    );
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
              <ProductGrid 
                products={products}
                totalResults={totalResults}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                onSortChange={handleSortChange}
                onFavoriteToggle={handleFavoriteToggle}
              />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Products;
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Header from '../../components/layout/header/header';
import Footer from '../../components/layout/footer/footer';
import HeroSection from '../../components/common/HeroSection';
import FilterSection from './FilterSection';
import ProductGrid from './ProductGrid';
import { useProducts } from '../../hooks/product/useProducts';
import { useWishlist } from '../../hooks/product/useWishlist';

import {
  FilterCategory,
  Brand,
  PetTag,
  Product,
  PriceRange,
} from '../../types/Product';

import { useAuth } from '../../contexts/AuthContext';

const Products: React.FC = () => {
  const { token, isLoggedIn, isLoading } = useAuth();

  const {
    wishlistItems,
    add,
    remove,
    fetch: fetchWishlist,
    loading: wishlistLoading,
    error: wishlistError,
  } = useWishlist(token ?? '');

  // Fetch wishlist khi component mount
  useEffect(() => {
    fetchWishlist(1, 1000); // 🛠 Tăng limit để đảm bảo không bị thiếu item
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    max: 10000000,
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const limit = 12; // items per page

  // Lấy products từ hook
  const {
    products: productsFromHook,
    loading,
    error,
  } = useProducts(currentPage, limit);

  // Quản lý local state products để cập nhật isFavorite, wishlistId
  const [products, setProducts] = useState<Product[]>([]);

  // Đồng bộ products với wishlistItems khi productsFromHook hoặc wishlistItems thay đổi
  useEffect(() => {
    const updatedProducts = productsFromHook.map((product) => {
      const wishItem = wishlistItems.find((w) => w.id === product.id); // 👈 SỬA DÒNG NÀY
      return {
        ...product,
        isFavorite: !!wishItem,
        wishlistId: wishItem ? wishItem.id : undefined,
      };
    });
    console.log(
      '📦 All Products:',
      productsFromHook.map((p) => p.id)
    );
    console.log(
      '❤️ Wishlist ProductIds:',
      wishlistItems.map((w) => w.id)
    );
    setProducts(updatedProducts);
  }, [productsFromHook, wishlistItems]);

  if (isLoading) {
    return <p>Đang kiểm tra đăng nhập...</p>;
  }

  if (!isLoggedIn || !token) {
    return <Navigate to='/' replace />;
  }

  // Tính tổng trang và kết quả (tạm)
  const totalResults = products.length;
  const totalPages = Math.ceil(totalResults / limit) || 1;

  // Xử lý các filter
  const handleCategoryChange = (id: number) => {
    setFilterCategories(
      filterCategories.map((category) =>
        category.id === id
          ? { ...category, checked: !category.checked }
          : category
      )
    );
  };

  const handleBrandChange = (id: number) => {
    setBrands(
      brands.map((brand) =>
        brand.id === id ? { ...brand, checked: !brand.checked } : brand
      )
    );
  };

  const handleTagSelect = (id: number) => {
    setTags(
      tags.map((tag) =>
        tag.id === id ? { ...tag, selected: !tag.selected } : tag
      )
    );
  };

  const handlePriceRangeChange = (range: PriceRange) => {
    setPriceRange(range);
  };

  const handleApplyFilters = () => {
    console.log('Applying filters...');
    // TODO: gọi API lọc nếu có
  };

  const handleSortChange = (value: string) => {
    console.log('Sort changed to:', value);
    // TODO: xử lý sort nếu có API
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Xử lý toggle yêu thích
  const handleFavoriteToggle = async (id: number) => {
    try {
      const product = products.find((p) => p.id === id);
      if (!product) return;

      if (product.isFavorite) {
        if (!product.wishlistId) {
          console.error(
            'wishlistId không tồn tại, không thể xóa khỏi wishlist'
          );
          return;
        }
        await remove(product.wishlistId);
      } else {
        await add(id);
      }

      await fetchWishlist();
    } catch (e: any) {
      if (e.response && e.response.status === 409) {
        // Sản phẩm đã có trong wishlist rồi
        console.warn('Sản phẩm đã có trong wishlist.');
      } else {
        console.error('Failed to toggle favorite:', e);
      }
    }
  };

  return (
    <div className='min-h-screen flex flex-col'>
      <Header />
      <main className='flex-grow'>
        <HeroSection />
        <div className='container mx-auto px-4 py-8'>
          <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
            <div className='lg:col-span-1 max-w-[220px]'>
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
            <div className='lg:col-span-3'>
              {(loading || wishlistLoading) && <p>Đang tải sản phẩm...</p>}
              <p className='text-red-500'>
                {typeof error === 'string' ? error : ''}
                {typeof wishlistError === 'string' ? wishlistError : ''}
              </p>

              {!loading && !error && !wishlistLoading && !wishlistError && (
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

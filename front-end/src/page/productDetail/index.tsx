import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/layout/header/header';
import Footer from '../../components/layout/footer/footer';
import Breadcrumbs from '../../components/ui/BreadcrumbItem';
import Tabs from '../../components/ui/tabs';
import ProductImages from './ProductImages';
import ProductInfo from './ProductInfo';
import useProductDetail from '../../hooks/product/useProductDetail';
import { useCart } from '../../hooks/product/useCart'; // import hook cart
import { useAuth } from '../../contexts/AuthContext'; // giả sử bạn có hook lấy token
import { GetProductDetailResponseDto } from '../../common/dto/product/product-detail.dto';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const productID = id ? Number(id) : null;

  const { product, loading, error } = useProductDetail({ productID });

  // Lấy token user (hoặc truyền token từ props/context)
  const { token } = useAuth();

  // Dùng hook cart
  const {
    addToCart,
    loading: cartLoading,
    error: cartError,
  } = useCart(token || '');

  if (loading) return <div>Đang tải sản phẩm...</div>;
  if (error) return <div>Lỗi: {error}</div>;
  if (!product) return <div>Không tìm thấy sản phẩm.</div>;

  const breadcrumbItems = [
    { label: 'Trang chủ', path: '/' },
    { label: product.categoryNames[0] || 'Danh mục', path: '#' },
    { label: product.name },
  ];

  const tabs = [
    {
      id: 'description',
      label: 'Mô tả',
      content: (
        <div className='text-base leading-relaxed whitespace-pre-wrap'>
          {product.description}
        </div>
      ),
    },
  ];

  const handleAddToCart = async (
    product: GetProductDetailResponseDto,
    quantity: number
  ) => {
    try {
      await addToCart(product.id, quantity);
      alert(`Đã thêm ${quantity} sản phẩm "${product.name}" vào giỏ hàng!`);
    } catch (err: unknown) {
      console.error(err);
      alert('Thêm vào giỏ hàng thất bại, vui lòng thử lại.');
    }
  };

  return (
    <div className='min-h-screen flex flex-col'>
      <Header />

      <main className='flex-grow container mx-auto px-4 py-8'>
        <Breadcrumbs items={breadcrumbItems} className='text-lg mb-8' />

        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-12'>
          <ProductImages
            mainImage={product.thumbnailUrl}
            thumbnails={product.imagesUrl}
          />
          <ProductInfo product={product} onAddToCart={handleAddToCart} />
        </div>

        {cartLoading && <p>Đang xử lý giỏ hàng...</p>}
        {cartError && <p className='text-red-500'>Lỗi giỏ hàng: {cartError}</p>}

        <Tabs tabs={tabs} defaultActiveTab='description' className='mb-12' />
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetailPage;

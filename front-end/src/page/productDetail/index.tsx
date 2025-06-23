// import React, { useState } from "react";
// import Header from "../../components/layout/header/header";
// import Footer from "../../components/layout/footer/footer";
// import Breadcrumbs from "../../components/ui/BreadcrumbItem";
// import Tabs from "../../components/ui/tabs";
// import ProductImages from "./ProductImages";
// import ProductInfo from "./ProductInfo";
// import RelatedProducts from "./ReletedProducts";
// import { Product, RelatedProduct } from "../../types/ProductDetail";
// import food from '../../assets/thucan.jpg';
// import cat from '../../assets/cat.jpg';

// const ProductDetailPage: React.FC = () => {
//   // Mock product data
//   //   const [product, setProduct] = useState<Product>({
//   const [product] = useState<Product>({
//     id: "striped-dog-sweater",
//     name: "Áo liền chân sọc ngang chó trắng có khoen dắt Mozzi",
//     price: 145000,
//     images: {
//       main: food,
//       thumbnails: [
//         food,
//         food,
//         food,
//         food,
//       ],
//     },
//     sku: "SP70005909",
//     inStock: true,
//     colors: [
//       { name: "Đỏ", value: "red", isSelected: true },
//       { name: "Đen", value: "black" },
//     ],
//     sizes: [
//       { name: "S", weight: "1.5 – 3kg", isSelected: true },
//       { name: "M", weight: "3 – 4.5kg" },
//       { name: "L", weight: "4.5 – 6.5kg" },
//       { name: "XL", weight: "6.5 – 8.5kg" },
//       { name: "XXL", weight: "8.5 – 11kg" },
//     ],
//     description: `Chiếc áo liền chân với hoạ tiết sọc ngang nổi bật, dành riêng cho các bé chó trắng đáng yêu. Thiết kế ôm gọn, giúp giữ ấm và bảo vệ cơ thể thú cưng trong những ngày se lạnh. Phần khoen dắt tiện lợi được may chắc chắn phía sau lưng, giúp bạn dễ dàng gắn dây dắt mà không cần mặc thêm dây yếm. Chất vải mềm mại, co giãn tốt, thân thiện với làn da thú cưng, dễ giặt và nhanh khô.

// Bảng size cơ bản:
//           XS           0.5 – 1.5kg
//           S              1.5 – 3kg
//           M             3 – 4.5kg
//           L              4.5 – 6.5kg
//           XL            6.5 – 8.5kg
//           2XL          8.5 – 11kg
//           3XL          11 – 13kg
//           4XL          13 – 15kg

// Lưu ý: Nên đo vòng cổ, vòng ngực và chiều dài lưng của bé trước khi chọn size để đảm bảo vừa vặn và thoải mái nhất nhé!`,
//     features: "Đặc điểm sản phẩm",
//     reviews: [],
//   });

//   // Mock related products
//   const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([
//     {
//       id: "dog-food-omni",
//       name: "Thức ăn cho chó hãng Omni",
//       price: 169000,
//       image: cat,
//       isFavorite: false,
//     },
//     {
//       id: "dog-bowl-omlet",
//       name: "Bát ăn cho chó Omlet",
//       price: 49000,
//       image: cat,
//       isFavorite: false,
//     },
//     {
//       id: "dog-bed-ferplast",
//       name: "Giường cho chó Ferplast",
//       price: 399000,
//       image: cat,
//       isFavorite: false,
//     },
//     {
//       id: "dog-food-jinx",
//       name: "Thức ăn cho chó hãng Jinx",
//       price: 269000,
//       image: cat,
//       isFavorite: false,
//     },
//     {
//       id: "dog-leash-hagen",
//       name: "Dây dắt chó Hagen",
//       price: 99000,
//       image: cat,
//       isFavorite: false,
//     },
//   ]);

//   const breadcrumbItems = [
//     { label: "Trang chủ", path: "/" },
//     { label: "MUA ĐỒ CHO CHÓ", path: "/dog-products" },
//     { label: "Áo liền chân sọc ngang / chó trắng có khoen dắt" },
//   ];

//   const tabs = [
//     {
//       id: "description",
//       label: "Mô tả",
//       content: (
//         <div className="text-base leading-relaxed">
//           {product.description.split("\n").map((paragraph, index) => (
//             <p key={index} className="mb-4">
//               {paragraph}
//             </p>
//           ))}
//         </div>
//       ),
//     },
//     {
//       id: "features",
//       label: "Đặc điểm",
//       content: (
//         <div className="text-base leading-relaxed">
//           <p>Đặc điểm nổi bật của sản phẩm:</p>
//           <ul className="list-disc pl-5 mt-2">
//             <li>Thiết kế sọc ngang thời trang</li>
//             <li>Có khoen dắt tiện lợi</li>
//             <li>Chất liệu mềm mại, co giãn tốt</li>
//             <li>Nhiều kích cỡ phù hợp với các giống chó</li>
//             <li>Dễ giặt và nhanh khô</li>
//           </ul>
//         </div>
//       ),
//     },
//     {
//       id: "reviews",
//       label: "Đánh giá",
//       content: (
//         <div className="text-base">
//           <p>Chưa có đánh giá nào cho sản phẩm này.</p>
//         </div>
//       ),
//     },
//   ];

//   const handleAddToCart = (product: Product, quantity: number) => {
//     console.log("Added to cart:", { product, quantity });
//     // Here you would typically dispatch to a cart state or context
//     alert(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
//   };

//   const handleToggleFavorite = (productId: string) => {
//     setRelatedProducts((prevProducts) =>
//       prevProducts.map((product) =>
//         product.id === productId
//           ? { ...product, isFavorite: !product.isFavorite }
//           : product
//       )
//     );
//   };

//   return (
//     <div className="min-h-screen flex flex-col">
//       <Header />

//       <main className="flex-grow container mx-auto px-4 py-8">
//         <Breadcrumbs items={breadcrumbItems} className="text-lg mb-8" />

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
//           <ProductImages
//             mainImage={product.images.main}
//             thumbnails={product.images.thumbnails}
//           />

//           <ProductInfo product={product} onAddToCart={handleAddToCart} />
//         </div>

//         <Tabs tabs={tabs} defaultActiveTab="description" className="mb-12" />

//         <RelatedProducts
//           products={relatedProducts}
//           onToggleFavorite={handleToggleFavorite}
//         />
//       </main>

//       <Footer />
//     </div>
//   );
// };

// export default ProductDetailPage;

import React from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/layout/header/header";
import Footer from "../../components/layout/footer/footer";
import Breadcrumbs from "../../components/ui/BreadcrumbItem";
import Tabs from "../../components/ui/tabs";
import ProductImages from "./ProductImages";
import ProductInfo from "./ProductInfo";
import useProductDetail from "../../hooks/product/useProductDetail";
import { ProductDetailResponse } from "../../types/ProductDetail";

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const productId = id ? Number(id) : null;

  const { product, loading, error } = useProductDetail({ productId });

  if (loading) return <div>Đang tải sản phẩm...</div>;
  if (error) return <div>Lỗi: {error}</div>;
  if (!product) return <div>Không tìm thấy sản phẩm.</div>;

  const breadcrumbItems = [
    { label: "Trang chủ", path: "/" },
    { label: product.categoryName || "Danh mục", path: "#" },
    { label: product.name },
  ];

  const tabs = [
    {
      id: "description",
      label: "Mô tả",
      content: <div className="text-base leading-relaxed whitespace-pre-wrap">{product.description}</div>,
    },
  ];

  const handleAddToCart = (product: ProductDetailResponse, quantity: number) => {
    alert(`Đã thêm ${quantity} sản phẩm "${product.name}" vào giỏ hàng!`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbItems} className="text-lg mb-8" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <ProductImages mainImage={product.thumbnailUrl} thumbnails={product.imagesUrl} />
          <ProductInfo product={product} onAddToCart={handleAddToCart} />
        </div>

        <Tabs tabs={tabs} defaultActiveTab="description" className="mb-12" />
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetailPage;

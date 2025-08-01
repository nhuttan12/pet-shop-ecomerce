// // components/cart/CartContent.tsx
// import React from 'react';
// import Card from '../../components/common/Card';

// const CartContent = () => {
//   const products = [
//     {
//       id: 1,
//       image: '/images/cat-food.png',
//       title: "Hạt thức ăn Today's dinner cho mèo loại 1kg",
//       price: "98.000₫",
//     },
//     // Add more items if needed
//   ];

//   return (
//     <div className="w-full lg:w-3/5 px-4">
//       <h2 className="text-xl font-semibold mb-4">Sản phẩm</h2>
//       <div className="flex flex-col gap-6">
//         {products.map((item) => (
//           <Card
//             key={item.id}
//             image={item.image}
//             title={item.title}
//             price={item.price}
//             className="bg-white"
//           />
//         ))}
//         <div className="flex gap-4 mt-4">
//           <button className="px-4 py-2 bg-orange-500 text-white rounded-lg">
//             Tiếp tục xem sản phẩm
//           </button>
//           <button className="px-4 py-2 border border-gray-300 rounded-lg">
//             Cập nhật giỏ hàng
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CartContent;

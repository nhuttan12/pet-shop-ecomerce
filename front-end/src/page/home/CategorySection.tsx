// import React from 'react';
// import { Link } from 'react-router-dom';
// import { GrPrevious } from "react-icons/gr";
// import { GrNext, GrFormNextLink  } from "react-icons/gr";

// interface CategoryItem {
//     id: string;
//     name: string;
//     image: string;
//     productCount: string;
// }

// interface CategorySectionProps {
//     categories: CategoryItem[];
// }

// const CategorySection: React.FC<CategorySectionProps> = ({ categories }) => {
//     return (
//         <section className="py-12">
//             <div className="container mx-auto px-4">
//                 <div className="flex justify-between items-center mb-6">
//                     <h2 className="text-4xl font-semibold mb-8">Duyệt theo danh mục</h2>
//                     <div className="flex justify-between items-center mb-6">
//                         <div className="flex-grow"></div>
//                         <div className="flex space-x-4">
//                             <button className="w-12 h-12 rounded-full flex items-center justify-center bg-gray hover:bg-gray-300">
//                                 <GrPrevious className="w-7 h-7" />
//                             </button>
//                             <button className="w-12 h-12 rounded-full flex items-center justify-center bg-gray hover:bg-gray-300">
//                                 <GrNext className="w-7 h-7" />
//                             </button>
//                         </div>
//                     </div>
//                 </div>
                

//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//                     {categories.map((category) => (
//                         <div key={category.id} className="flex flex-col">
//                             <Link to={`/category/${category.id}`} className="block mb-4">
//                                 <img
//                                     src={category.image}
//                                     alt={category.name}
//                                     className="w-full h-[306px] object-cover rounded-lg"
//                                 />
//                             </Link>
//                             <div className="bg-[#f8f9fa] p-4 rounded-lg">
//                                 <div className="flex justify-between items-center">
//                                     <div>
//                                         <h3 className="text-xl font-semibold">{category.name}</h3>
//                                         <p className="text-gray-600">{category.productCount}</p>
//                                     </div>
//                                     <button className="w-6 h-6 flex items-center justify-center">
//                                         <GrFormNextLink  className="w-6 h-6" />
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </section>
//     );
// };

// export default CategorySection;
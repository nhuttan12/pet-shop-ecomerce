import React from 'react';
import { Link } from 'react-router-dom';
import { PetCategory } from '../../types/Product';

interface CategorySectionProps {
  categories: PetCategory[];
}

const CategorySection: React.FC<CategorySectionProps> = ({ categories }) => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-semibold mb-10">Mua sắm theo thú cưng</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category) => (
            <Link 
              key={category.id} 
              to={`/category/${category.name.toLowerCase()}`}
              className="flex flex-col items-center"
            >
              <div className="relative mb-4">
                <img 
                  src={category.vectorImage} 
                  alt={category.name} 
                  className="w-[187px] h-[180px]"
                />
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[180px] h-[180px] object-contain"
                />
              </div>
              <h3 className="text-xl font-semibold">{category.name}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
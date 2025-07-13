import React from "react";
import Card from "../../components/common/Card";
import { RelatedProduct } from "../../types/ProductDetail";

interface RelatedProductsProps {
  products: RelatedProduct[];
  onToggleFavorite: (id: number) => void;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({
  products,
  onToggleFavorite,
}) => {
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-medium mb-6">Sản phẩm liên quan</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {products.map((product) => (
          <Card
            key={product.id}
            id={Number(product.id)}
            image={product.image}
            title={product.name}
            price={product.price.toLocaleString()} // convert number → string
            isFavorite={product.isFavorite}
            onFavoriteToggle={onToggleFavorite}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;

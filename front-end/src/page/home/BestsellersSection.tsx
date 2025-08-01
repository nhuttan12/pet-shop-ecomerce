import React from "react";
import Card from "../../components/common/Card";

interface ProductItem {
  id: number; 
  name: string;
  price: string;
  image: string;
}

interface BestsellersSectionProps {
  products: ProductItem[];
}

const BestsellersSection: React.FC<BestsellersSectionProps> = ({
  products,
}) => {
  const [wishlist, setWishlist] = React.useState<number[]>([]);

  const handleAddToWishlist = (productId: number) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter((id) => id !== productId));
    } else {
      setWishlist([...wishlist, productId]);
    }
  };

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-semibold text-center mb-12">
          Sản phẩm mới nhất
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <Card
              key={product.id}
              id={product.id}
              image={product.image}
              title={product.name}
              price={product.price}
              isFavorite={wishlist.includes(product.id)}
              onFavoriteToggle={handleAddToWishlist}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestsellersSection;

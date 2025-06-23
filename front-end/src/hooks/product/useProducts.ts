// src/hooks/product/useProducts.ts
import { useEffect, useState } from 'react';
import { getAllProducts } from '../../service/products/productService';
import { Product } from '../../types/Product';

export const useProducts = (page = 1, limit = 10) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await getAllProducts(page, limit);
        setProducts(res.data.data);
      } catch (err) {
        setError('Lỗi khi lấy sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, limit]);

  return { products, loading, error };
};

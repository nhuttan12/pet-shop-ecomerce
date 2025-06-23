import { useState, useEffect } from "react";
import { getProductDetail } from "../../service/products/productService";
import { ProductDetailResponse } from "../../types/ProductDetail";

interface UseProductDetailProps {
  productId: number | null;
  page?: number;
  limit?: number;
}

const useProductDetail = ({ productId, page, limit }: UseProductDetailProps) => {
  const [product, setProduct] = useState<ProductDetailResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) return;

    setLoading(true);
    getProductDetail(productId, page, limit)
      .then((res) => {
        setProduct(res.data.data);
      })
      .catch(() => {
        setError("Lỗi khi tải sản phẩm");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [productId, page, limit]);

  return { product, loading, error };
};

export default useProductDetail;

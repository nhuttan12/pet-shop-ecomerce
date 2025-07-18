import { useState, useEffect } from 'react';
import { getProductDetail } from '../../service/products/productService';
import { AxiosResponse } from 'axios';
import { ApiResponse } from '../../common/dto/response/api-response.dto';
import { GetProductDetailResponseDto } from '../../common/dto/product/product-detail.dto';

interface UseProductDetailProps {
  productID: number | null;
}

const useProductDetail = ({ productID }: UseProductDetailProps) => {
  const [product, setProduct] = useState<GetProductDetailResponseDto | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productID) return;

    let isMounted = true;

    setLoading(true);
    const fetchProductDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const res: AxiosResponse<ApiResponse<GetProductDetailResponseDto>> =
          await getProductDetail(productID);

        if (!res.data.data) {
          if (isMounted) {
            setError(res.data.message);
          }
          return;
        }

        if (isMounted) {
          setProduct(res.data.data);
        }
      } catch (error: unknown) {
        if (isMounted) {
          setError('Lỗi khi tải sản phẩm');
        }
        console.error(error);
        throw error;
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProductDetail();

    return () => {
      isMounted = false;
    };
  }, [productID]);

  return { product, loading, error };
};

export default useProductDetail;

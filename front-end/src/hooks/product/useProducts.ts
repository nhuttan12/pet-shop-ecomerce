import { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { PaginationResponse } from '../../common/dto/pagination/pagination-response';
import { GetAllProductResponseDto } from '../../common/dto/product/get-all-product-response.dto';
import {
  ApiResponse
} from '../../common/dto/response/api-response.dto';
import { mapDtoListToProduct } from '../../common/mapper/product/product.mapper';
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
        const res: AxiosResponse<
          ApiResponse<PaginationResponse<GetAllProductResponseDto>>
        > = await getAllProducts({ page, limit });

        const mappedProduct: Product[] = mapDtoListToProduct(
          res.data.data?.data || []
        );

        setProducts(mappedProduct);
      } catch (err) {
        console.log(err);
        setError('Lỗi khi lấy sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, limit]);

  return { products, loading, error };
};

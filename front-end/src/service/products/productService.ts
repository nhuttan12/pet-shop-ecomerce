// src/api/product.api.ts
import axios from '../api'; // hoặc import axios trực tiếp nếu bạn không cấu hình riêng

const BASE_URL = '/product';

/**
 * Lấy danh sách sản phẩm (phân trang)
 * @param page số trang (tuỳ chọn)
 * @param limit số lượng sản phẩm trên mỗi trang (tuỳ chọn)
 */
export const getAllProducts = (page?: number, limit?: number) => {
  return axios.get(`${BASE_URL}`, {
    params: { page, limit },
  });
};

/**
 * Tìm sản phẩm theo tên (phân trang)
 * @param name tên sản phẩm cần tìm
 * @param page số trang (tuỳ chọn)
 * @param limit số lượng sản phẩm trên mỗi trang (tuỳ chọn)
 */
export const findProductByName = (name: string, page?: number, limit?: number) => {
  return axios.get(`${BASE_URL}/name/${name}`, {
    params: { page, limit },
  });
};

/**
 * Lấy chi tiết sản phẩm
 * @param productId id sản phẩm cần xem chi tiết
 * @param page số trang (tuỳ chọn, nếu có liên quan)
 * @param limit số lượng (tuỳ chọn, nếu có liên quan)
 */
export const getProductDetail = (productId: number, page?: number, limit?: number) => {
  return axios.get(`${BASE_URL}/detail`, {
    params: { productId, page, limit },
  });
};

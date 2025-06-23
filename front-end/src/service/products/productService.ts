// src/api/product.api.ts
import axios from '../api'; // hoặc import axios trực tiếp nếu bạn không cấu hình riêng

const BASE_URL = '/product';

export const getAllProducts = (page?: number, limit?: number) => {
  return axios.get(`${BASE_URL}`, {
    params: { page, limit },
  });
};

export const findProductByName = (name: string, page?: number, limit?: number) => {
  return axios.get(`${BASE_URL}/name/${name}`, {
    params: { page, limit },
  });
};

export const getProductDetail = (productId: number, page?: number, limit?: number) => {
  return axios.get(`${BASE_URL}/detail`, {
    params: { productId, page, limit },
  });
};

export const updateProduct = (data: any) => {
  return axios.put(`${BASE_URL}/update`, data);
};

export const deleteProduct = (productId: number) => {
  return axios.delete(`${BASE_URL}`, {
    data: { productId },
  });
};

export const createProduct = (data: any) => {
  return axios.post(`${BASE_URL}`, data);
};

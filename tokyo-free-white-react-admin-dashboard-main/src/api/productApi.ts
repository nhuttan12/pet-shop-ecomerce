// src/api/productApi.ts
import axios from 'axios';

const API_URL = `http://localhost:8080/api/v1/product`; // Hardcode đường dẫn

export const getProducts = (page: number, limit: number) => {
  return axios.get(API_URL, {
    params: { page, limit },
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
};

export const createProduct = (data: any) => {
  return axios.post(API_URL, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
};

export const updateProduct = (data: any) => {
  return axios.put(`${API_URL}/update`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
};

export const deleteProduct = (productId: string) => {
  return axios.delete(API_URL, {
    data: { productId },
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
};

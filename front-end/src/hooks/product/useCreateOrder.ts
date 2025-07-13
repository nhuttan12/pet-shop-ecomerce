import { useState } from 'react';
import { createOrder, CreateOrderDTO } from '../../service/products/orderService';

interface UseCreateOrderResult {
  loading: boolean;
  error: string | null;
  success: boolean;
  createOrderHandler: (data: CreateOrderDTO) => Promise<void>;
}

export function useCreateOrder(): UseCreateOrderResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const createOrderHandler = async (data: CreateOrderDTO) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await createOrder(data);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi tạo đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, success, createOrderHandler };
}

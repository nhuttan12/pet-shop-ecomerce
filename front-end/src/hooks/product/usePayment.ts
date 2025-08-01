import { useState } from 'react';
import paymentService from '../../service/products/paymentService';
import { CreateOrderDto } from '../../common/dto/order/create-order.dto';
import { CaptureOrderDto } from '../../common/dto/order/capture-order.dto';

export function usePayment(token: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createOrder = async (dto: CreateOrderDto): Promise<string> => {
    setLoading(true);
    setError(null);
    try {
      const approvalUrl: string = await paymentService.createOrder(dto, token);
      return approvalUrl;
    } catch (err) {
      setError('Không thể tạo đơn hàng PayPal');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const captureOrder = async (dto: CaptureOrderDto) => {
    setLoading(true);
    setError(null);
    try {
      const status: string = await paymentService.captureOrder(dto, token);
      return status;
    } catch (err) {
      setError('Không thể xác nhận thanh toán');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createOrder, captureOrder, loading, error };
}

import { AxiosResponse } from 'axios';
import { CreateOrderDto } from '../../common/dto/order/create-order.dto';
import api from '../api';
import { ApiResponse } from '../../common/dto/response/api-response.dto';
import { CaptureOrderDto } from '../../common/dto/order/capture-order.dto';

class PaymentService {
  async createOrder(dto: CreateOrderDto, token: string): Promise<string> {
    const response: AxiosResponse<ApiResponse<string>> = await api.post(
      '/payment/create',
      dto,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.data.data) {
      throw new Error('Không thể tạo đơn hàng');
    }

    return response.data.data;
  }

  async captureOrder(dto: CaptureOrderDto, token: string): Promise<string> {
    const response: AxiosResponse<ApiResponse<string>> = await api.get(
      `/payment/success?token=${dto.token}`, 
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.data.data) {
      throw new Error('Không thể tạo đơn hàng');
    }

    return response.data.data;
  }
}

export default new PaymentService();

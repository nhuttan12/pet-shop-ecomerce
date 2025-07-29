import { OrderResponseDto } from '../../common/dto/order/order-response.dto';
import { ApiResponse } from '../../common/dto/response/api-response.dto';
import api from '../api';
import {
  GetAllOrderRequestDto
} from "../../common/dto/order/get-all-order-request.dto.ts";
import {
  GetAllOrdersResponseDto
} from "../../common/dto/order/get-all-order-response.dto.ts";
import { AxiosResponse } from "axios";
import {
  GetOrderListByOrderIdRequestDto
} from "../../common/dto/order/get-order-list-by-order-id-request-dto.ts"; // đường dẫn tới file api của bạn

export interface CreateOrderDTO {
  paymentMethod: string;
  shippingMethod: string;
}

export async function createOrder(data: CreateOrderDTO): Promise<ApiResponse<OrderResponseDto>> {
  try {
    const response = await api.post('/orders/create-order', data);
    return response.data; // trả về ApiResponse<Order>
  } catch (error) {
    // Xử lý lỗi nếu cần
    console.error('Error creating order:', error);
    throw error;
  }
}

export async function getAllOrderForUser(
  dto: GetAllOrderRequestDto,
  token: string
): Promise<ApiResponse<GetAllOrdersResponseDto[]>> {
  try {
    const response: AxiosResponse<ApiResponse<GetAllOrdersResponseDto[]>> = await api.get(
      '/orders',
      {
        params: {
          limit: dto.limit,
          page: dto.page,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

export async function getOrderListByOrderID(
  dto: GetOrderListByOrderIdRequestDto,
  token: string
): Promise<ApiResponse<GetAllOrdersResponseDto[]>> {
  try {
    const response: AxiosResponse<ApiResponse<GetAllOrdersResponseDto[]>> = await api.get(
      '/orders/list',
      {
        params: {
          orderID: dto.orderID,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

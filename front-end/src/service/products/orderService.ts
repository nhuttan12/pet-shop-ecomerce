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
} from "../../common/dto/order/get-order-list-by-order-id-request-dto.ts";
import {
  FindOrderListByOrderStatusRequestDto
} from "../../common/dto/order/find-order-list-by-order-status-request.dto.ts";
import {
  GetOrderDetailsByOrderIDRequestDto
} from "../../common/dto/order/get-order-details-by-order-i-d-request.dto.ts";
import {
  GetOrderDetailsByOrderIDResponseDto
} from "../../common/dto/order/get-order-details-by-order-i-d-response.dto.ts"; // đường dẫn tới file api của bạn

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

export async function findOrderListByOrderStatus(
  request: FindOrderListByOrderStatusRequestDto,
  token: string): Promise<ApiResponse<GetAllOrdersResponseDto[]>> {
  try {
    const response: AxiosResponse<ApiResponse<GetAllOrdersResponseDto[]>> = await api.get<ApiResponse<GetAllOrdersResponseDto[]>>(
      '/orders/list-by-status',
      {
        params: {
          status: request.status,
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

export async function getOrderDetailByOrderID(
  request: GetOrderDetailsByOrderIDRequestDto,
  token: string
): Promise<ApiResponse<GetOrderDetailsByOrderIDResponseDto[]>> {
  try {
    const response: AxiosResponse<ApiResponse<GetOrderDetailsByOrderIDResponseDto[]>> = await api.get<ApiResponse<GetOrderDetailsByOrderIDResponseDto[]>>(
      `/orders/order-detail/${request.orderID}`,
      {
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

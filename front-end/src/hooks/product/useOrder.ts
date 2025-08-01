import { useState } from 'react';
import {
  createOrder,
  CreateOrderDTO, findOrderListByOrderStatus,
  getAllOrderForUser, getOrderDetailByOrderID,
  getOrderListByOrderID,
} from '../../service/products/orderService';
import {
  GetAllOrderRequestDto
} from "../../common/dto/order/get-all-order-request.dto.ts";
import {
  GetAllOrdersResponseDto
} from "../../common/dto/order/get-all-order-response.dto.ts";
import { ApiResponse } from "../../common/dto/response/api-response.dto.ts";
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
} from "../../common/dto/order/get-order-details-by-order-i-d-response.dto.ts";

interface UseCreateOrderResult {
  loading: boolean;
  error: string | null;
  success: boolean;
  createOrderHandler: (data: CreateOrderDTO) => Promise<void>;
  getAllOrdersHandler: (
    dto: GetAllOrderRequestDto,
    token: string
  ) => Promise<GetAllOrdersResponseDto[] | null>;
  getOrderListByOrderIDHandler: (
    dto: GetOrderListByOrderIdRequestDto,
    token: string
  ) => Promise<GetAllOrdersResponseDto[] | null>;
  findOrderListByOrderStatusHandler: (
    request: FindOrderListByOrderStatusRequestDto,
    token: string
  ) => Promise<GetAllOrdersResponseDto[] | null>;
  getOrderDetailByOrderIDHandler: (
    request: GetOrderDetailsByOrderIDRequestDto,
    token: string
  ) => Promise<GetOrderDetailsByOrderIDResponseDto[] | null>;
}

export function useOrder(): UseCreateOrderResult {
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
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Có lỗi xảy ra khi tạo đơn hàng');
      }
    } finally {
      setLoading(false);
    }
  };

  const getAllOrdersHandler = async (dto: GetAllOrderRequestDto,
    token: string): Promise<GetAllOrdersResponseDto[]> => {
    setLoading(true);
    setError(null);
    try {
      const response: ApiResponse<GetAllOrdersResponseDto[]> = await getAllOrderForUser(
        dto,
        token
      );

      if (!response || !response.data) {
        setError('Có lỗi trong lúc lấy toàn bộ hoá đơn!')
        return [];
      }

      return response.data ?? [];
    } catch (error: unknown) {
      setError(error instanceof Error ?
        error.message :
        "Có lỗi xảy ra khi lấy đơn hàng");
      return [];
    } finally {
      setLoading(false);
    }
  }

  const getOrderListByOrderIDHandler = async (
    dto: GetOrderListByOrderIdRequestDto,
    token: string): Promise<GetAllOrdersResponseDto[]> => {
    setLoading(true);
    setError(null);
    try {
      const response: ApiResponse<GetAllOrdersResponseDto[]> = await getOrderListByOrderID(
        dto,
        token
      );

      if (!response || !response.data) {
        setError('Có lỗi trong lúc lấy danh sách hoá đơn!')
        return [];
      }

      return response.data ?? [];
    } catch (error: unknown) {
      setError(error instanceof Error ?
        error.message :
        "Có lỗi xảy ra khi lấy đơn hàng");
      return [];
    } finally {
      setLoading(false);
    }
  }

  const findOrderListByOrderStatusHandler = async (
    request: FindOrderListByOrderStatusRequestDto,
    token: string): Promise<GetAllOrdersResponseDto[]> => {
    setLoading(true);
    setError(null);
    try {
      const response: ApiResponse<GetAllOrdersResponseDto[]> = await findOrderListByOrderStatus(
        request,
        token
      );

      if (!response || !response.data) {
        setError('Có lỗi trong lúc lấy danh sách hoá đơn!')
        return [];
      }

      return response.data ?? [];
    } catch (error: unknown) {
      setError(error instanceof Error ?
        error.message :
        "Có lỗi xảy ra khi lấy đơn hàng");

      return [];
    } finally {
      setLoading(false);
    }
  }

  const getOrderDetailByOrderIDHandler = async (
    request: GetOrderDetailsByOrderIDRequestDto,
    token: string): Promise<GetOrderDetailsByOrderIDResponseDto[]> => {
    setLoading(true);
    setError(null);
    try {
      const response: ApiResponse<GetOrderDetailsByOrderIDResponseDto[]> = await getOrderDetailByOrderID(
        request,
        token
      );

      if (!response || !response.data) {
        setError('Có lỗi trong lúc lấy danh sách hoá đơn!')
        return [];
      }

      return response.data ?? [];
    } catch (error) {
      setError(error instanceof Error ?
        error.message :
        "Có lỗi xảy ra khi lấy đơn hàng");

      return [];
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    error,
    success,
    createOrderHandler,
    getAllOrdersHandler,
    getOrderListByOrderIDHandler,
    findOrderListByOrderStatusHandler,
    getOrderDetailByOrderIDHandler
  };
}

// src/services/authService.ts
import { AxiosResponse } from 'axios';
import api from '../api';
import { ApiResponse } from '../../common/dto/response/api-response.dto';
import { UserLoginResponseDTO } from '../../common/dto/auth/user-login-response.dto';

export interface RegisterDTO {
  username: string;
  email: string;
  password: string;
  retypePassword: string;
}

export const register = async (data: RegisterDTO) => {
  const response = await api.post('auth/v1/register', data);
  return response.data;
};

export interface LoginDTO {
  username: string;
  password: string;
}

export const login = async (
  data: LoginDTO
): Promise<ApiResponse<UserLoginResponseDTO>> => {
  const response: AxiosResponse<ApiResponse<UserLoginResponseDTO>> =
    await api.post('auth/v1/login', data);
  return response.data;
};

export interface ForgotPasswordDTO {
  email: string;
}

export const forgotPassword = async (data: ForgotPasswordDTO) => {
  const response = await api.post('auth/forgot-password', data);
  return response.data;
};

export interface ResetPasswordDTO {
  token: string;
  newPassword: string;
}

export const resetPassword = async (data: ResetPasswordDTO) => {
  const response = await api.post('auth/reset-password', data);
  return response.data;
};

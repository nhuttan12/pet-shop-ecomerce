import { AxiosError } from 'axios';
import { useState } from 'react';
import { UserLoginResponseDTO } from '../../common/dto/auth/user-login-response.dto';
import { ApiResponse } from '../../common/dto/response/api-response.dto';
import type { LoginDTO } from '../../service/auth/authService';
import { login } from '../../service/auth/authService';
import type { LoginCredentials, LoginResponse } from '../../types/Login';

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loginUser = async (
    credentials: LoginCredentials
  ): Promise<LoginResponse> => {
    setLoading(true);
    setError(null);

    const loginPayload: LoginDTO = {
      username: credentials.username,
      password: credentials.password,
    };

    try {
      const response: ApiResponse<UserLoginResponseDTO> = await login(
        loginPayload
      );

      // ✅ Sửa lại đúng access_token
      if (response?.data?.access_token && response?.data.user) {
        const token = response.data.access_token;

        if (credentials.rememberMe) {
          localStorage.setItem('authToken', token);
        } else {
          sessionStorage.setItem('authToken', token);
        }

        return {
          success: true,
          token,
          user: {
            id: response.data.user.id,
            username: response.data.user.username,
            email: response.data.user.email,
            role: response.data.user.role,
            status: response.data.user.status,
          },
        };
      } else {
        return {
          success: false,
          error: 'Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.',
        };
      }
    } catch (err: unknown) {
      let errorMsg: string = 'Đã có lỗi xảy ra trong quá trình đăng nhập';
      if (err instanceof AxiosError) {
        errorMsg = err?.response?.data?.message;
        setError(errorMsg);
      }
      return {
        success: false,
        error: errorMsg,
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    loginUser,
    loading,
    error,
  };
};

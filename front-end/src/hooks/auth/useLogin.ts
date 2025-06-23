import { useState } from 'react';
import { login } from '../../service/auth/authService';
import type { LoginDTO } from '../../service/auth/authService';
import type { LoginCredentials, LoginResponse } from '../../types/Login';

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    setLoading(true);
    setError(null);

    const loginPayload: LoginDTO = {
      username: credentials.username,
      password: credentials.password,
    };

    try {
      const response = await login(loginPayload);

      // ✅ Sửa lại đúng access_token
      if (response?.access_token && response?.user) {
        const token = response.access_token;

        if (credentials.rememberMe) {
          localStorage.setItem('authToken', token);
        } else {
          sessionStorage.setItem('authToken', token);
        }

        return {
          success: true,
          token,
          user: {
            id: response.user.id,
            username: response.user.username,
            email: response.user.email,
            role: response.user.role,
            status: response.user.status,
          },
        };
      } else {
        return {
          success: false,
          error: 'Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.',
        };
      }
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message || 'Đã có lỗi xảy ra trong quá trình đăng nhập.';
      setError(errorMsg);
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

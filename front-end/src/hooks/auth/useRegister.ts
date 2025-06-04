// src/hooks/useRegister.ts
import { useState } from 'react';
import { register as registerAPI, RegisterDTO } from '../../service/auth/authService';

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (data: RegisterDTO) => {
    setLoading(true);
    setError(null);
    try {
      const result = await registerAPI(data);
      return result;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng ký thất bại');
      throw err; // Nếu bạn muốn handle ở component
    } finally {
      setLoading(false);
    }
  };

  return {
    register,
    loading,
    error,
  };
};

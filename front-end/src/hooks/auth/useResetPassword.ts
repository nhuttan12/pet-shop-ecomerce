// src/hooks/useResetPassword.ts
import { useState } from "react";
import { resetPassword, ResetPasswordDTO } from "../../service/auth/authService";

export const useResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendResetPassword = async (data: ResetPasswordDTO) => {
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      await resetPassword(data);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Đặt lại mật khẩu thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    success,
    error,
    sendResetPassword,
  };
};

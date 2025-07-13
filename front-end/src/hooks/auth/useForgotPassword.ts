import { useState } from "react";
import { forgotPassword, ForgotPasswordDTO } from "../../service/auth/authService";

export const useForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const sendForgotPassword = async (data: ForgotPasswordDTO) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await forgotPassword(data);
      setSuccess(true);
    } catch (err: any) {
      // Bạn có thể customize lỗi tuỳ theo API trả về
      setError(err.response?.data?.message || err.message || "Lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    success,
    sendForgotPassword,
  };
};

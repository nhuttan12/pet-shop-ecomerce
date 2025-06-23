import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import InputField from "../../components/ui/InputField";
import Button from "../../components/ui/Button";
import Stepper from "../../components/common/Stepper";
import { useForgotPassword } from "../../hooks/auth/useForgotPassword";
import { useResetPassword } from "../../hooks/auth/useResetPassword";

const ForgotPasswordStepperForm: React.FC = () => {
  const { token } = useParams();
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const {
    loading: sendingEmail,
    error: emailError,
    success: emailSent,
    sendForgotPassword,
  } = useForgotPassword();

  const {
    loading: resetting,
    error: resetError,
    success: resetSuccess,
    sendResetPassword,
  } = useResetPassword();

  useEffect(() => {
    if (token) setStep(1);
  }, [token]);

  const handleSendEmail = async () => {
    await sendForgotPassword({ email });
    if (!emailError) setMessage("Đã gửi email khôi phục mật khẩu.");
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage("Mật khẩu không khớp.");
      return;
    }

    await sendResetPassword({ token: token!, newPassword });

    if (resetSuccess) {
      setMessage("Đặt lại mật khẩu thành công!");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 border rounded-md shadow">
      <h2 className="text-xl font-semibold mb-4 text-center">Khôi phục mật khẩu</h2>
      <Stepper
        steps={["Nhập Email", "Đặt lại mật khẩu"]}
        currentStep={step}
      />

      {/* Step 1: Nhập Email */}
      {step === 0 && (
        <>
          <InputField
            label="Email"
            placeholder="Nhập email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            name="email"
            className="mb-4"
          />
          <Button
            type="button"
            fullWidth
            onClick={handleSendEmail}
            disabled={sendingEmail}
          >
            {sendingEmail ? "Đang gửi..." : "Gửi email khôi phục"}
          </Button>
          {emailError && <p className="text-red-500 mt-2 text-sm">{emailError}</p>}
          {emailSent && <p className="text-green-600 mt-2 text-sm">{message}</p>}
        </>
      )}

      {/* Step 2: Đặt lại mật khẩu */}
      {step === 1 && (
        <>
          <InputField
            label="Mật khẩu mới"
            placeholder="Nhập mật khẩu mới"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            name="newPassword"
            className="mb-3"
          />
          <InputField
            label="Nhập lại mật khẩu"
            placeholder="Xác nhận mật khẩu"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            name="confirmPassword"
            className="mb-4"
          />
          <Button
            type="button"
            fullWidth
            onClick={handleResetPassword}
            disabled={resetting}
          >
            {resetting ? "Đang xử lý..." : "Đặt lại mật khẩu"}
          </Button>
          {resetError && <p className="text-red-500 mt-2 text-sm">{resetError}</p>}
          {resetSuccess && <p className="text-green-600 mt-2 text-sm">{message}</p>}
        </>
      )}
    </div>
  );
};

export default ForgotPasswordStepperForm;

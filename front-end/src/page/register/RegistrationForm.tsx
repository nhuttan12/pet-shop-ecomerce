import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputField from "../../components/ui/InputField";
import Button from "../../components/ui/Button";
import Checkbox from "../../components/ui/Checkbox";
import SocialLogin from "./SocialLogin.tsx";
import { RegisterFormData, RegisterFormErrors } from "../../types/Register";
import { useRegister } from "../../hooks/auth/useRegister";

const RegistrationForm: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<RegisterFormData>({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });

  const [errors, setErrors] = useState<RegisterFormErrors>({});

  const { register, loading, error } = useRegister();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof RegisterFormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: RegisterFormErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Tên đăng nhập không được để trống";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email không được để trống";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    // if (!formData.phone.trim()) {
    //   newErrors.phone = "Số điện thoại không được để trống";
    // } else if (!/^\d{10,11}$/.test(formData.phone.replace(/\D/g, ""))) {
    //   newErrors.phone = "Số điện thoại không hợp lệ";
    // }

    if (!formData.password) {
      newErrors.password = "Mật khẩu không được để trống";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu không khớp";
    }

    if (!formData.termsAccepted) {
      newErrors.termsAccepted = "Bạn phải đồng ý với điều khoản sử dụng";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (validateForm()) {
    console.log("Form valid, calling register...");
    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        retypePassword: formData.confirmPassword,
      });
      alert("Đăng ký thành công!");
      navigate("/login");
    } catch (err) {
      alert(error || "Có lỗi xảy ra khi đăng ký");
    }
  } else {
    console.log("Form không hợp lệ:", errors);
  }
};


  return (
    <div className="w-full max-w-[600px] ml-auto">
      <h1 className="text-3xl mb-6">Đăng ký</h1>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-y-3 p-3">
          <InputField
            label="Tên đăng nhập"
            placeholder="Điền tên đăng nhập của bạn vào đây"
            name="username"   
            value={formData.username}
            onChange={handleChange}
            error={errors.username}
            required
          />

          <InputField
            label="Địa chỉ Email"
            placeholder="Điền địa chỉ email vào đây"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
          />

          <InputField
            label="Mật khẩu"
            placeholder="Điền mật khẩu vào đây"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
          />

          <InputField
            label="Nhập lại mật khẩu"
            placeholder="Nhập lại mật khẩu"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            required
          />

          <div className="mt-4 mb-6">
            <Checkbox
              label="Tôi đã đồng ý với thoả thuận và điều khoản người dùng"
              checked={formData.termsAccepted}
              onChange={handleChange}
              name="termsAccepted"
            />
            {errors.termsAccepted && (
              <p className="mt-1 text-xs text-red-500">{errors.termsAccepted}</p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            className="h-8 font-bold text-sm mt-2"
            disabled={loading}
          >
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </Button>
        </div>
      </form>

      <SocialLogin className="mt-1" />

      <div className="mt-6 text-center">
        <p className="text-sm text-black">
          Nếu bạn đã có tài khoản?{" "}
          <Link to="/login" className="text-[#3a5b22] hover:underline">
            Chuyển tới trang đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegistrationForm;

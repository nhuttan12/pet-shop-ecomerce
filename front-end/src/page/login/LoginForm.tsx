import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputField from "../../components/ui/InputField";
import Button from "../../components/ui/Button";
import Checkbox from "../../components/ui/Checkbox";
import { useLogin } from "../../hooks/auth/useLogin";
import { useAuth } from "../../contexts/AuthContext";

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const { loginUser, loading, error } = useLogin();
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await loginUser({ username, password, rememberMe });

    if (result.success && result.token && result.user) {
      login(result.user.id, result.user.username, result.token, result.user.role); // cập nhật context
      navigate("/");
    } else {
      console.error("Đăng nhập thất bại:", result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <InputField
        label="Username"
        placeholder="Nhập Username"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        className="mb-5"
        name="username"
      />

      <InputField
        label="Mật khẩu"
        placeholder="Nhập mật khẩu"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="mb-3"
        name="password"
      />

      <div className="flex justify-between items-center mb-4">
        <Checkbox
          label="Ghi nhớ đăng nhập"
          checked={rememberMe}
          onChange={() => setRememberMe(!rememberMe)}
          name="rememberMe"
        />

        <Link
          to="/forgot-password"
          className="text-[14px] font-medium text-[#0c2991] hover:underline"
        >
          Quên mật khẩu
        </Link>
      </div>

      {error && <p className="mb-3 text-red-600 text-sm">{error}</p>}

      <Button
        type="submit"
        fullWidth
        className="h-8 text-[13px]"
        disabled={loading}
      >
        {loading ? "Đang xử lý..." : "Đăng nhập"}
      </Button>
    </form>
  );
};

export default LoginForm;

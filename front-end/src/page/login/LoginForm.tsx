import React, { useState } from "react";
import InputField from "../../components/ui/InputField";
import Button from "../../components/ui/Button";
import Checkbox from "../../components/ui/Checkbox";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Login attempt with:", { email, password, rememberMe });
      setIsLoading(false);
      // Handle login logic here
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <InputField
        label="Địa chỉ email"
        placeholder="Nhập địa chỉ email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="mb-5"
        name="email"
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

        <Button
          type="button"
          className="text-[10px] font-medium text-[#0c2991] hover:underline"
          onClick={() => console.log("Forgot password clicked")}
          // tx={''}
        >
          Quên mật khẩu
        </Button>
      </div>

      <Button
        type="submit"
        fullWidth
        className="h-8 text-[13px]"
        disabled={isLoading}
        // tx={''}
      >
        {isLoading ? "Đang xử lý..." : "Đăng nhập"}
      </Button>
    </form>
  );
};

export default LoginForm;
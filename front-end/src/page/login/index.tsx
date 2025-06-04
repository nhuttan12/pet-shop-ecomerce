import React from "react";
import { useNavigate } from "react-router-dom"; 

import Header from "../../components/common/Header";
import LoginForm from "./LoginForm.tsx";
import SocialLogin from "./SocialLogin.tsx";

const LoginPage: React.FC = () => {
  const navigate = useNavigate(); 
  return (
    <div className="flex min-h-screen bg-white">
      <div className="w-full md:w-8/12 p-8 md:p-16 flex items-center justify-center">
        <div className="w-full max-w-[600px] ml-auto">
          <Header title="Đăng nhập" className="mb-8" />

          <LoginForm />

          <SocialLogin />

          <div className="mt-10 text-center">
            <p className="text-sm font-medium">
              Bạn chưa có tài khoản?{" "}
              <button
                className="text-[#3a5b22] hover:underline"
                onClick={() => navigate("/register")} 
              >
                Đăng kí
              </button>
            </p>
          </div>
        </div>
      </div>

      <div className="w-full md:w-4/12 flex items-center justify-center">
        <div className="w-full max-w-[500px] flex items-center justify-center">
          <img
            src="/images/logologin.png"
            alt="Pet illustration"
            className="w-full h-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

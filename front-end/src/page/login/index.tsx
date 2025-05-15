import React from "react";
import Header from "../../components/common/Header";
import LoginForm from "./LoginForm.tsx";
import SocialLogin from "./SocialLogin.tsx";

const LoginPage: React.FC = () => {
    return (
        <div className="flex min-h-screen bg-white">
            <div className="w-full lg:w-1/2 flex flex-col p-8">
                <div className="max-w-md mx-auto w-full">
                    <Header title="Đăng nhập" className="mb-8" />

                    <LoginForm />

                    <SocialLogin />

                    <div className="mt-10 text-center">
                        <p className="text-sm font-medium">
                            Bạn chưa có tài khoản?{" "}
                            <button
                                className="text-[#3a5b22] hover:underline"
                                onClick={() => console.log("Register clicked")}
                            >
                                Đăng kí
                            </button>
                        </p>
                    </div>
                </div>
            </div>

            <div className="hidden lg:block lg:w-1/2">
                <img
                    src="/images/logologin.png"
                    alt="Pet illustration"
                    className="w-full h-full object-cover rounded-tl-[45px] rounded-br-[45px]"
                />
            </div>
        </div>
    );
};

export default LoginPage;
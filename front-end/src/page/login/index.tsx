import React from "react";
import Header from "../../components/common/Header";
import LoginForm from "./LoginForm.tsx";
import SocialLogin from "./SocialLogin.tsx";

const LoginPage: React.FC = () => {
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
                                onClick={() => console.log("Register clicked")}
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
                        className="w-full h-auto  object-contain"
                    />
        </div>
                {/* <img
                    src="/images/logologin.png"
                    alt="Pet illustration"
                    className="w-full h-full object-cover rounded-tl-[45px] rounded-br-[45px]"
                /> */}
            </div>
        </div>
    );
};

export default LoginPage;
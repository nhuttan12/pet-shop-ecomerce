import React from "react";
import Button from "../../components/ui/Button";

const SocialLogin: React.FC = () => {
  const handleGoogleLogin = () => {
    console.log("Login with Google clicked");
    // Implement Google login logic
  };

  const handleAppleLogin = () => {
    console.log("Login with Apple clicked");
    // Implement Apple login logic
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-center my-4">
        <div className="flex-grow h-px bg-gray-200"></div>
        <span className="px-2 text-[9px] font-medium text-black">Hoặc</span>
        <div className="flex-grow h-px bg-gray-200"></div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <Button
          variant="social"
          onClick={handleGoogleLogin}
          className="h-8 text-xs"
        >
          <img src="/images/img_icons8google_1.svg" alt="Google" className="w-6 h-6 mr-2" />
          Đăng nhập với Google
        </Button>

        <Button
          variant="social"
          onClick={handleAppleLogin}
          className="h-8 text-xs"
        >
          <img src="/images/img_icons8applelogo_1.svg" alt="Apple" className="w-6 h-6 mr-2" />
          Đăng nhập với Apple
        </Button>
      </div>
    </div>
  );
};

export default SocialLogin;
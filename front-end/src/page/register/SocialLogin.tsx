import React from "react";

interface SocialLoginProps {
  className?: string;
}

const SocialLogin: React.FC<SocialLoginProps> = ({ className = "" }) => {
  const handleGoogleLogin = () => {
    console.log("Google login clicked");
    // Implement Google login logic here
  };

  const handleAppleLogin = () => {
    console.log("Apple login clicked");
    // Implement Apple login logic here
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="relative flex items-center py-5">
        <div className="flex-grow border-t border-gray-200"></div>
        <span className="flex-shrink mx-4 text-[9px] font-medium text-black">
          Or
        </span>
        <div className="flex-grow border-t border-gray-200"></div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-between">
        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center h-8 px-4 border border-[#d9d9d9] rounded-lg hover:bg-gray-50 transition-colors"
        >
          <img src="/images/img_icons8google_1.svg" alt="Google" className="w-6 h-6" />
          <span className="ml-2 text-xs font-medium text-black">
            Đăng ký với Google
          </span>
        </button>

        <button
          onClick={handleAppleLogin}
          className="flex items-center justify-center h-8 px-4 border border-[#d9d9d9] rounded-lg hover:bg-gray-50 transition-colors"
        >
          <img src="/images/img_icons8applelogo_1.svg" alt="Apple" className="w-6 h-6" />
          <span className="ml-2 text-xs font-medium text-black">
            Đăng ký với apple
          </span>
        </button>
      </div>
    </div>
  );
};

export default SocialLogin;
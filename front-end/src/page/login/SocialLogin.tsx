// import React from "react";
// import Button from "../../components/ui/Button";
// import { FcGoogle } from "react-icons/fc";
// import { FaApple } from "react-icons/fa";

// const SocialLogin: React.FC = () => {
//   const handleGoogleLogin = () => {
//     console.log("Login with Google clicked");
//     // Implement Google login logic
//   };

//   const handleAppleLogin = () => {
//     console.log("Login with Apple clicked");
//     // Implement Apple login logic
//   };

//   return (
//     <div className="w-full">
//       <div className="flex items-center justify-center my-4">
//         <div className="flex-grow h-px bg-gray-200"></div>
//         <span className="px-2 text-[9px] font-medium text-black">Hoặc</span>
//         <div className="flex-grow h-px bg-gray-200"></div>
//       </div>

//       <div className="flex flex-col sm:flex-row gap-4 justify-between">
//         <Button
//           variant="social"
//           onClick={handleGoogleLogin}
//           className="h-8 text-xs"
//         >
//           <img src="/images/img_icons8google_1.svg" alt="Google" className="w-6 h-6 mr-2" />
//           Đăng nhập với Google
//         </Button>

//         <Button
//           variant="social"
//           onClick={handleAppleLogin}
//           className="h-8 text-xs"
//         >
//           <img src="/images/img_icons8applelogo_1.svg" alt="Apple" className="w-6 h-6 mr-2" />
//           Đăng nhập với Apple
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default SocialLogin;
import React from "react";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";

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
        <span className="flex-shrink mx-1 text-[9px] font-medium text-black">
          Hoặc
        </span>
        <div className="flex-grow border-t border-gray-200"></div>
      </div>

      <div className="mt-2 flex flex-col gap-3">
        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center h-10 px-4 border border-gray-300 rounded-md hover:bg-gray-100"
        >
          <FcGoogle className="w-5 h-5" />
          <span className="ml-3 text-sm font-medium">
            Đăng ký với Google
          </span>
        </button>

        <button
          onClick={handleAppleLogin}
          className="flex items-center justify-center h-10 px-4 border border-gray-300 rounded-md hover:bg-gray-100"
        >
          <FaApple className="w-5 h-5"/>
          <span className="ml-3 text-sm font-medium">
            Đăng ký với apple
          </span>
        </button>
      </div>
    </div>
  );
};

export default SocialLogin;
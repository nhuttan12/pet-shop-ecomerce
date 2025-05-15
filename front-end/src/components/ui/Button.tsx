import React from "react";


// Kế thừa tất cả props của button, nhưng ghi đè lại type để đảm bảo kiểm tra đúng
interface ButtonProps {
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  variant?: "primary" | "outline" | "social";
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
                                         children,
                                         onClick,
                                         className = "",
                                         type = "button",
                                         disabled = false,
                                         variant = "primary",
                                         fullWidth = false,
                                       }) => {
  console.log("Type of `type` prop:", type);
  const baseStyles = "font-medium rounded-lg flex items-center justify-center";

  const variantStyles = {
    primary: "bg-[#3a5b22] text-white border border-[#3a5b22] font-bold",
    outline: "border border-[#d9d9d9] text-black",
    social: "border border-[#d9d9d9] text-black"
  };

  const widthStyles = fullWidth ? "w-full" : "";

  return (
      <button
          type="button"
          onClick={onClick}
          disabled={disabled}
          className={`${baseStyles} ${variantStyles[variant]} ${widthStyles} ${className}`}
      >
        {children}
      </button>
  );
};

export default Button;


// type ButtonProps = {
//     children: React.ReactNode;
//     onClick?: () => void;
//     className?: string;
//     type?: "button" | "submit" | "reset";
//     // buttonType?: "button" | "submit" | "reset";
//     disabled?: boolean;
//     variant?: "primary" | "outline" | "social";
//     fullWidth?: boolean;
// };

// import React from "react";
//
// // Kế thừa tất cả các props từ React.ButtonHTMLAttributes<HTMLButtonElement>
// interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
//     children: React.ReactNode;
//     onClick?: () => void;
//     className?: string;
//     variant?: "primary" | "outline" | "social";
//     fullWidth?: boolean;
// }
//
// const Button: React.FC<ButtonProps> = ({
//                                            children,
//                                            onClick,
//                                            className = "",
//                                            type = "button", // Không cần khai báo lại type nữa
//                                            disabled = false,
//                                            variant = "primary",
//                                            fullWidth = false,
//                                        }) => {
//     const baseStyles = "font-medium rounded-lg flex items-center justify-center";
//
//     const variantStyles = {
//         primary: "bg-[#3a5b22] text-white border border-[#3a5b22] font-bold",
//         outline: "border border-[#d9d9d9] text-black",
//         social: "border border-[#d9d9d9] text-black"
//     };
//
//     const widthStyles = fullWidth ? "w-full" : "";
//
//     return (
//         <button
//             type={type}  // Đây sẽ nhận giá trị từ ButtonHTMLAttributes
//             onClick={onClick}
//             disabled={disabled}
//             className={`${baseStyles} ${variantStyles[variant]} ${widthStyles} ${className}`}
//         >
//             {children}
//         </button>
//     );
// };
//
// export default Button;
//
// // import React from "react";
//
// // // Chỉ định rõ type được cho phép
// // // type ButtonType = "button" | "submit" | "reset";
// // // Kế thừa tất cả props của button, nhưng ghi đè lại type để đảm bảo kiểm tra đúng
// // interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
// //     children: React.ReactNode;
// //     onClick?: () => void;
// //     className?: string;
// //     // type?: "button" | "submit" | "reset";
// //     disabled?: boolean;
// //     variant?: "primary" | "outline" | "social";
// //     fullWidth?: boolean;
// // }
//
// // const Button: React.FC<ButtonProps> = ({
// //                                            children,
// //                                            onClick,
// //                                            className = "",
// //                                            type = "button",
// //                                            disabled = false,
// //                                            variant = "primary",
// //                                            fullWidth = false,
// //                                            tx = "",
// //                                        }) => {
// //     // console.log("Type of `type` prop:", type);
// //     const baseStyles = "font-medium rounded-lg flex items-center justify-center";
//
// //     const variantStyles = {
// //         primary: "bg-[#3a5b22] text-white border border-[#3a5b22] font-bold",
// //         outline: "border border-[#d9d9d9] text-black",
// //         social: "border border-[#d9d9d9] text-black"
// //     };
//
// //     const widthStyles = fullWidth ? "w-full" : "";
//
// //     return (
// //         <button
// //             type={type}
// //             onClick={onClick}
// //             disabled={disabled}
// //             className={`${baseStyles} ${variantStyles[variant]} ${widthStyles} ${className}`}
// //         >
// //             {children}
// //         </button>
// //     );
// // };
//
// // export default Button;

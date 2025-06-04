import React from "react";


// Kế thừa tất cả props của button, nhưng ghi đè lại type để đảm bảo kiểm tra đúng
interface ButtonProps {
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  variant?: "primary" | "outline" | "social" | "secondary";
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
    social: "border border-[#d9d9d9] text-black",
    secondary: "bg-gray-200 text-black hover:bg-gray-300"
  };

  const widthStyles = fullWidth ? "w-full" : "";

  return (
      <button
          type={type}
          onClick={onClick}
          disabled={disabled}
          className={`${baseStyles} ${variantStyles[variant]} ${widthStyles} ${className}`}
      >
        {children}
      </button>
  );
};

export default Button;


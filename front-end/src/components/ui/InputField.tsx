import React from "react";

interface InputFieldProps {
  label: string;
  placeholder: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  name?: string;
  className?: string;
  error?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  required = false,
  name,
  className = "",
  error,
}) => {
  return (
    <div className={`flex flex-col gap-y-3 ${className}`}>
      <label className="block text-sm font-medium text-black mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}
        required={required}
        className={`w-full h-[40px] px-3 py-2 text-sm text-black border ${error ? 'border-red-500' : 'border-[#d9d9d9]'} rounded-[10px] focus:outline-none focus:border-[#3a5b22] focus:ring-1 focus:ring-[#3a5b22]`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default InputField;

// import React from "react";

// type InputFieldProps = {
//     label: string;
//     placeholder: string;
//     type?: string;
//     value?: string;
//     onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
//     required?: boolean;
//     className?: string;
//     name?: string;
//     error?: string;
// };

// const InputField: React.FC<InputFieldProps> = ({
//                                                    label,
//                                                    placeholder,
//                                                    type = "text",
//                                                    value,
//                                                    onChange,
//                                                    required = false,
//                                                    className = "",
//                                                    name,
//                                                    error,
//                                                }) => {
//     return (
//         <div className={`flex flex-col gap-3${className}`}>
//             <label htmlFor={name} className="text-sm font-medium text-black text-left">
//                 {label}
//             </label>
//             <input
//                 id={name}
//                 type={type}
//                 placeholder={placeholder}
//                 value={value}
//                 onChange={onChange}
//                 required={required}
//                 name={name}
//                 className={`w-full h-[40px] px-3 py-2 text-sm text-black border ${error ? 'border-red-500' : 'border-[#d9d9d9]'} rounded-[10px] focus:outline-none focus:border-[#3a5b22] focus:ring-1 focus:ring-[#3a5b22]`}
//             />
//             {error && (
//                 <span className="text-xs text-red-500 mt-1">{error}</span>
//             )}
//         </div>
//     );
// };

// export default InputField;

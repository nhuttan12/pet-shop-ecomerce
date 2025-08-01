import React from 'react';

interface InputFieldProps {
  label?: string;
  placeholder: string;
  type?: string;
  value?: string;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  required?: boolean;
  name?: string;
  className?: string;
  error?: string;
  options?: { value: string; label: string }[];
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  required = false,
  name,
  className = '',
  error,
  options,
}) => {
  const commonProps = {
    value,
    onChange,
    name,
    required,
    className: `w-full h-[40px] px-3 py-2 text-sm text-black border ${
      error ? 'border-red-500' : 'border-[#d9d9d9]'
    } rounded-[10px] focus:outline-none focus:border-[#3a5b22] focus:ring-1 focus:ring-[#3a5b22]`,
  };

  return (
    <div className={`flex flex-col gap-y-3 ${className}`}>
      <label className='block text-lg font-medium text-black mb-1'>
        {label}
        {required && <span className='text-red-500 ml-1'>*</span>}
      </label>
      {type === 'select' && options ? (
        <select {...commonProps}>
          <option value=''>{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          name={name}
          required={required}
          className={`w-full h-[40px] px-3 py-2 text-sm text-black border ${
            error ? 'border-red-500' : 'border-[#d9d9d9]'
          } rounded-[10px] focus:outline-none focus:border-[#3a5b22] focus:ring-1 focus:ring-[#3a5b22]`}
        />
      )}
      {error && <p className='mt-1 text-xs text-red-500'>{error}</p>}
    </div>
  );
};

export default InputField;

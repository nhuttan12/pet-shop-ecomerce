import React from 'react';

interface TextareaProps {
  label?: string;
  name: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
  className?: string;
  rows?: number;
  error?: string;
}

const Textarea: React.FC<TextareaProps> = ({
  label,
  name,
  placeholder = '',
  value,
  onChange,
  required = false,
  className = '',
  rows = 4,
  error,
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label 
          htmlFor={name} 
          className="block text-base font-semibold text-black mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        rows={rows}
        className="w-full px-4 py-2 bg-white rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#fd7e14] focus:border-transparent"
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Textarea;
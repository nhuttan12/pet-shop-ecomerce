import React from 'react';

export interface RadioOption {
  value: string;
  label: string;
}

interface RadioButtonProps {
  options: RadioOption[];
  name: string;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  inline?: boolean;
}

const RadioButton: React.FC<RadioButtonProps> = ({
  options,
  name,
  value,
  onChange,
  label,
  error,
  disabled = false,
  className = '',
  inline = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <div className={`${inline ? 'flex space-x-4' : 'space-y-2'}`}>
        {options.map((option) => (
          <div key={option.value} className="flex items-center">
            <input
              type="radio"
              id={`${name}-${option.value}`}
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={handleChange}
              disabled={disabled}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            <label
              htmlFor={`${name}-${option.value}`}
              className={`ml-2 text-sm ${
                disabled ? 'text-gray-400' : 'text-gray-700'
              }`}
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
      
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default RadioButton;
import React from "react";

type CheckboxProps = {
    label: string;
    checked?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
    name?: string;
};

const Checkbox: React.FC<CheckboxProps> = ({
                                               label,
                                               checked = false,
                                               onChange,
                                               className = "",
                                               name,
                                           }) => {
    return (
        <div className={`flex items-center ${className}`}>
            <div className="relative flex items-center">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={onChange}
                    name={name}
                    id={name}
                    className="opacity-0 absolute h-9 w-9"
                />
                <div className="border border-black w-[9px] h-[9px] rounded-[2px] mr-1.5 flex flex-shrink-0 justify-center items-center">
                    {checked && (
                        <div className="bg-[#3a5b22] w-[5px] h-[5px] rounded-[1px]"></div>
                    )}
                </div>
            </div>
            <label htmlFor={name} className="text-[9px] font-medium text-black cursor-pointer">
                {label}
            </label>
        </div>
    );
};

export default Checkbox;
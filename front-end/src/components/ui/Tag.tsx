import React from 'react';

interface TagProps {
    text: string;
    count?: number;
    className?: string;
    onClick?: () => void;
}

const Tag: React.FC<TagProps> = ({
                                     text,
                                     count,
                                     className = '',
                                     onClick,
                                 }) => {
    return (
        <div
            className={`bg-[#f8f9fa] rounded-md px-4 py-2 inline-flex flex-col ${className} ${onClick ? 'cursor-pointer hover:bg-gray-200' : ''}`}
            onClick={onClick}
        >
            <span className="font-semibold text-lg">{text}</span>
            {count !== undefined && (
                <span className="text-gray-600 text-sm">{count} sản phẩm</span>
            )}
        </div>
    );
};

export default Tag;
import React from "react";

type LoaderProps = {
    size?: "small" | "medium" | "large";
    color?: string;
    className?: string;
};

const Loader: React.FC<LoaderProps> = ({
                                           size = "medium",
                                           color = "#3a5b22",
                                           className = "",
                                       }) => {
    const sizeMap = {
        small: "w-4 h-4",
        medium: "w-6 h-6",
        large: "w-8 h-8",
    };

    return (
        <div className={`flex justify-center items-center ${className}`}>
            <div
                className={`${sizeMap[size]} border-2 border-t-transparent border-solid rounded-full animate-spin`}
                style={{ borderColor: `${color} transparent transparent transparent` }}
            ></div>
        </div>
    );
};

export default Loader;
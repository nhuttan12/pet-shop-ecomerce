import React from "react";
// import image from "../assets/im.png";


const Illustration: React.FC = () => {
    return (
        <div className="w-full max-w-[800px] flex items-center justify-center">
            <img
                src="/images/logologin.png"
                alt="Pet illustration"
                className="w-full h-auto  object-contain"
            />
        </div>
    );
};

export default Illustration;

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

 // <div className="hidden lg:block relative w-full h-full">
        //     <img
        //         src="/images/logologin.png"
        //         alt="Pet illustration"
        //         className="absolute inset-0 w-full h-full object-cover rounded-tl-[45px] rounded-br-[45px]"
        //     />
        //     <img
        //         src="/images/logologin.png"
        //         alt="Pet overlay"
        //         className="absolute inset-0 w-full h-full object-cover rounded-tl-[45px] rounded-br-[45px]"
        //     />
        // </div>
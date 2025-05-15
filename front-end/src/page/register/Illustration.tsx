import React from "react";


const Illustration: React.FC = () => {
    return (
        <div className="w-full h-full">
            <img
                src="/images/logologin.png"
                alt="Pet illustration"
                className="w-full h-full object-cover rounded-tl-[45px] rounded-br-[45px]"
            />
        </div>
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
    );
};

export default Illustration;
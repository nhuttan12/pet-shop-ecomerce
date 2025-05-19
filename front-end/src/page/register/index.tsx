import React from "react";
import RegistrationForm from "./RegistrationForm";
import Illustration from "./Illustration";

const RegisterPage: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-row">
            <div className="w-full md:w-8/12 p-8 md:p-16 flex items-center justify-center">
                <RegistrationForm />
            </div>
            <div className="w-full md:w-4/12 flex items-center justify-center">
                <Illustration />
            </div>
        </div>
    );
};

export default RegisterPage;

// <div className="min-h-screen bg-white flex items-center justify-center px-4">
        //     {/* <div className="flex flex-col md:flex-row max-w-5xl bg-white shadow-lg rounded-lg overflow-hidden"> */}
        //     <div className="flex w-full max-w-6xl bg-white rounded-xl shadow-xl overflow-hidden items-stretch">
        //         {/* Form bên trái */}
        //         <div className="md:w-1/2 flex items-center justify-center px-8 md:px-16">
        //             <div className="w-full">
        //                 <RegistrationForm />
        //             </div>
        //         </div>

        //         {/* Ảnh bên phải */}
        //         <div className="w-1/2 flex items-center justify-center overflow-hidden">
        //             <div className="w-full h-full p-6 flex items-center justify-end">
        //                 <div className="w-full h-full flex items-center justify-end">
        //                     <img
        //                         src="/images/logologin.png"
        //                         alt="Pet illustration"
        //                         className="w-full h-full max-w-[500px] max-h-[600px] object-cover rounded-l-xl"
        //                     />
        //                 </div>
        //                 {/* <Illustration /> */}
        //             </div>
        //         </div>
        //     </div>
        // </div>

import React from "react";
import RegistrationForm from "./RegistrationForm";
import Illustration from "./Illustration";

const RegisterPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden">
                {/* Form bên trái */}
                <div className="w-full md:w-1/2 p-8 md:p-16 flex items-center justify-center">
                    <div className="w-full max-w-md">
                        <RegistrationForm />
                    </div>
                </div>

                {/* Ảnh bên phải */}
                <div className="w-full md:w-1/2 h-[300px] md:h-auto flex items-center">
                    <div className="w-full h-full">
                        <Illustration />
                    </div>
                </div>
            </div>
        </div>
        // <div className="min-h-screen flex flex-col md:flex-row bg-white">
        //     {/* Form bên trái */}
        //     <div className="w-full md:w-1/2 p-8 md:p-16 flex items-center justify-center">
        //         <div className="w-full max-w-md">
        //             <RegistrationForm />
        //         </div>
        //     </div>
        //
        //     {/* Ảnh bên phải */}
        //     <div className="w-full md:w-1/2 h-[300px] md:h-auto flex items-center">
        //         <div className="w-full h-full">
        //             <Illustration />
        //         </div>
        //     </div>
        // </div>


        // <div className="min-h-screen flex flex-col md:flex-row">
        //     <div className="w-full md:w-1/2 p-8 md:p-16 flex items-center justify-center">
        //         <RegistrationForm />
        //     </div>
        //     <div className="w-full md:w-1/2 h-[500px] md:h-screen">
        //         <Illustration />
        //     </div>
        // </div>
    );
};

export default RegisterPage;
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


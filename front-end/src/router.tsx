import React from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';

// Import page components
import LoginPage from './page/login';
import RegisterPage from "./page/register";
import HomePage from "./page/home";

const AppRoutes: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/" element={<HomePage />} />
                <Route path="/" element={<Navigate to="/login" replace />} /> {/* Default redirect */}
            </Routes>
        </Router>
    );
};

export default AppRoutes;
// import { Routes, Route } from "react-router-dom";
// import { ROUTERS } from "./utils/router";
// import LoginForm from "./page/login/LoginForm.tsx";
// import MasterLayout from "./layout/MasterLayout"; // Đảm bảo import MasterLayout
//
// const renderUserRouter = () => {
//     const userRouters = [
//         {
//             path: ROUTERS.USER.LOGIN,
//             component: <LoginForm />,
//         },
//     ];
//
//     return (
//         <MasterLayout>
//             <Routes>
//                 {userRouters.map((item, key) => (
//                     <Route key={key} path={item.path} element={item.component} />
//                 ))}
//             </Routes>
//         </MasterLayout>
//     );
// };
//
// const RouterCustom: React.FC = () => {
//     return renderUserRouter();
// };
//
// export default RouterCustom;

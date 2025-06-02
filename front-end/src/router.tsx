import React from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';

// Import page components
import LoginPage from './page/login';
import RegisterPage from "./page/register";
import HomePage from "./page/home";
import Products from "./page/products";
import Forum from "./page/forum";
import Checkout from "./page/checkout";
import CartPage from "./page/cart"
import ProductDetailPage from "./page/productDetail";
import ContactPage from "./page/contact";
import AboutUs from "./page/about";
import ProfilePage from "./page/profile";
import Order from "./page/order";
import CartCheckOut from "./page/cart";
const AppRoutes: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<Products />} />
                <Route path="/forum" element={<Forum />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/cartpage" element={<CartPage />} />
                <Route path="/productdetail" element={<ProductDetailPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/orders" element={<Order />} />
                <Route path="/cartcheckout" element={<CartCheckOut />} />
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

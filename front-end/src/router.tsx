import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

// Import page components
import LoginPage from './page/login';
import RegisterPage from './page/register';
import HomePage from './page/home';
import Products from './page/products';
import Forum from './page/forum/post';
import Checkout from './page/checkout';
import CartPage from './page/cart';
import ProductDetailPage from './page/productDetail';
import ContactPage from './page/contact';
import AboutUs from './page/about';
import ProfilePage from './page/profile';
import Order from './page/order';
import FavoriteProductsPage from './page/wishlists/wishlist';
import CartCheckOut from './page/cart';
import ForgotPasswordStepperForm from './page/forgot_password';
import PaymentSuccess from './page/payment-success';
const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route
          path='/forgot-password'
          element={<ForgotPasswordStepperForm />}
        />
        <Route
          path='/forgot-password/:token'
          element={<ForgotPasswordStepperForm />}
        />
        <Route path='/' element={<HomePage />} />
        <Route path='/products' element={<Products />} />
        <Route path='/forum' element={<Forum />} />
        <Route path='/checkout' element={<Checkout />} />
        <Route path='/cart' element={<CartPage />} />
        <Route path='/wishlist' element={<FavoriteProductsPage />} />
        <Route path='/payment/success' element={<PaymentSuccess />} />
        {/* <Route path="/productdetail" element={<ProductDetailPage />} /> */}
        <Route path='/product-detail/:id' element={<ProductDetailPage />} />
        <Route path='/contact' element={<ContactPage />} />
        <Route path='/about' element={<AboutUs />} />
        <Route path='/profile' element={<ProfilePage />} />
        <Route path='/orders' element={<Order />} />
        <Route path='/cartcheckout' element={<CartCheckOut />} />
        <Route path='/' element={<Navigate to='/login' replace />} />{' '}
        {/* Default redirect */}
      </Routes>
    </Router>
  );
};

export default AppRoutes;

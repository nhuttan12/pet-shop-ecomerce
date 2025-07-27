import React, { useEffect, useState } from 'react';
import Header from '../../components/layout/header/header';
import Footer from '../../components/layout/footer/footer';
import PersonalInfoForm from '../checkout/PersonalInfoForm';
import ShippingAddressForm from '../checkout/ShippingAddressForm';
import DiscountCodeForm from '../checkout/DiscountCodeForm';
import PaymentMethodForm from '../checkout/PaymentMethodForm';
import OrderSummary from '../checkout/OrderSummary';
import {
  CheckoutState,
  PersonalInfo,
  ShippingAddress,
} from '../../types/ChechOut';
import { useCart } from '../../hooks/product/useCart';
import { useAuth } from '../../contexts/AuthContext';
import { useGetUserProfile } from '../../hooks/profile/useGetUserProfile';
import { PaymentMethod } from '../../common/enum/order/payment-method.enum';
import { usePayment } from '../../hooks/product/usePayment';
import currencyService from '../../service/products/currencyService';

const Checkout: React.FC = () => {
  const { token } = useAuth();
  const { createOrder, loading } = usePayment(token ?? '');
  const [usdValue, setUsdValue] = useState<number | null>(null);

  const {
    carts: cartItems,
    fetchCartDetails,
    loading: cartLoadingStatus,
    error: cartErrorStatus,
  } = useCart(token || '');

  const {
    userProfile,
    loading: userProfileLoadingStatus,
    error: userProfileErrorStatus,
  } = useGetUserProfile(token ?? '');

  useEffect(() => {
    fetchCartDetails();
  }, [fetchCartDetails]);

  // State with the types defined in checkout.ts
  const [checkoutState, setCheckoutState] = useState<CheckoutState>({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
    },
    shippingAddress: { address: '', city: '', postalCode: '', country: '' },
    discountCode: '',
    paymentMethod: PaymentMethod.DEBIT_CARD,
  });

  useEffect(() => {
    if (userProfile) {
      setCheckoutState((prev) => ({
        ...prev,
        personalInfo: {
          name: userProfile.name ?? '',
          email: userProfile.email ?? '',
          phone: userProfile.phone ?? '',
        },
      }));
    }

    const fetchCurrency = async () => {
      try {
        const totalVND = cartItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        if (totalVND === 0) return;

        const data = await currencyService.getCurrency(totalVND);

        console.log("Currency API response:", data.result);

        setUsdValue(data.result);
      } catch (err) {
        console.error('Error fetching currency:', err);
      }
    };

    fetchCurrency();
  }, [userProfile]);

  // Handle personal info change
  const handlePersonalInfoChange = (
    field: keyof PersonalInfo,
    value: string
  ) => {
    setCheckoutState((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }));
  };

  // Handle shipping address change
  const handleShippingAddressChange = (
    field: keyof ShippingAddress,
    value: string
  ) => {
    setCheckoutState((prev) => ({
      ...prev,
      shippingAddress: { ...prev.shippingAddress, [field]: value },
    }));
  };

  // Handle discount code change
  const handleDiscountCodeChange = (value: string) => {
    setCheckoutState((prev) => ({
      ...prev,
      discountCode: value,
    }));
  };

  // Handle payment method change
  const handlePaymentMethodChange = (value: string) => {
    setCheckoutState((prev) => ({
      ...prev,
      paymentMethod: value as PaymentMethod,
    }));
  };

  // Handle apply discount code
  const handleApplyDiscountCode = () => {
    console.log('Discount code applied:', checkoutState.discountCode);
    // Logic to apply discount would go here
  };

  // Handle place order
  const handlePlaceOrder = async () => {
    if (checkoutState.paymentMethod === PaymentMethod.PAYPAL) {
      try {
        console.log('Usd value:', usdValue);

        if (!usdValue) {
          alert('Không thể chuyển đổi tiền tệ');
          return;
        }

        const approvalUrl = await createOrder({
          amount: usdValue,
          currency: 'USD',
          return_url: `${window.location.origin}/payment/success`,
          cancel_url: `${window.location.origin}/payment/cancel`,
          description: 'Thanh toán đơn hàng tại Pet Shop NLU',
        });

        window.location.href = approvalUrl;
      } catch {
        alert('Thanh toán PayPal thất bại');
      }
    } else {
      console.log('Placing normal order...');
    }
  };

  return (
    <div className='min-h-screen flex flex-col'>
      <Header />

      <main className='flex-grow'>
        <div className='container mx-auto px-4 py-8'>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            <div className='lg:col-span-2'>
              {/* Personal Info Form */}
              {userProfileLoadingStatus ? (
                <p>Đang tải...</p>
              ) : userProfileErrorStatus ? (
                <p>Có lỗi xảy ra...</p>
              ) : (
                <PersonalInfoForm
                  personalInfo={checkoutState.personalInfo}
                  onPersonalInfoChange={handlePersonalInfoChange}
                />
              )}
              {/* Shipping Address Form */}
              <ShippingAddressForm
                shippingAddress={checkoutState.shippingAddress}
                onShippingAddressChange={handleShippingAddressChange}
              />
              {/* Discount Code Form */}
              <DiscountCodeForm
                discountCode={checkoutState.discountCode}
                onDiscountCodeChange={handleDiscountCodeChange}
                onApplyDiscountCode={handleApplyDiscountCode}
              />
              {/* Payment Method Form */}
              <PaymentMethodForm
                paymentMethod={checkoutState.paymentMethod}
                onPaymentMethodChange={handlePaymentMethodChange}
                onApplyDiscountCode={handleApplyDiscountCode}
              />
            </div>

            <div className='lg:col-span-1'>
              {/* Order Summary */}
              {cartLoadingStatus ? (
                <p>Đang tải...</p>
              ) : cartErrorStatus ? (
                <p>Có lỗi xảy ra...</p>
              ) : (
                <OrderSummary
                  personalInfo={checkoutState.personalInfo}
                  shippingAddress={checkoutState.shippingAddress}
                  discountCode={checkoutState.discountCode}
                  paymentMethod={checkoutState.paymentMethod}
                  products={cartItems}
                  subtotal={200000}
                  discount={checkoutState.discountCode ? 50000 : 0}
                  shippingFee={30000}
                  onPlaceOrder={handlePlaceOrder}
                  loading={loading}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;

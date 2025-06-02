import React, { useState } from "react";
import Header from "../../components/layout/header/header";
import Footer from "../../components/layout/footer/footer";
import PersonalInfoForm from "../checkout/PersonalInfoForm";
import ShippingAddressForm from "../checkout/ShippingAddressForm";
import DiscountCodeForm from "../checkout/DiscountCodeForm";
import PaymentMethodForm from "../checkout/PaymentMethodForm";
import OrderSummary from "../checkout/OrderSummary";
import {
  CheckoutState,
  PersonalInfo,
  ShippingAddress,
} from "../../types/ChechOut";

const Checkout: React.FC = () => {
  // State with the types defined in checkout.ts
  const [checkoutState, setCheckoutState] = useState<CheckoutState>({
    personalInfo: { name: "", email: "", phone: "" },
    shippingAddress: { address: "", city: "", postalCode: "", country: "" },
    discountCode: "",
    paymentMethod: "",
  });

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
      paymentMethod: value,
    }));
  };

  // Handle apply discount code
  const handleApplyDiscountCode = () => {
    console.log("Discount code applied:", checkoutState.discountCode);
    // Logic to apply discount would go here
  };

  // Handle place order
  const handlePlaceOrder = () => {
    console.log("Placing order...");
    // Logic for placing order would go here
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* Personal Info Form */}
              <PersonalInfoForm
                personalInfo={checkoutState.personalInfo}
                onPersonalInfoChange={handlePersonalInfoChange}
              />

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

            <div className="lg:col-span-1">
              {/* Order Summary */}
              <OrderSummary
                personalInfo={checkoutState.personalInfo}
                shippingAddress={checkoutState.shippingAddress}
                discountCode={checkoutState.discountCode}
                paymentMethod={checkoutState.paymentMethod}
                product={{
                  name: "Sản phẩm demo",
                  price: 200000,
                  quantity: 1,
                  image: "",
                }}
                subtotal={200000}
                discount={checkoutState.discountCode ? 50000 : 0}
                shippingFee={30000}
                onPlaceOrder={handlePlaceOrder}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;

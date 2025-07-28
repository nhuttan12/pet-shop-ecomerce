import { PaymentMethod } from "../common/enum/order/payment-method.enum";

export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
}

export interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface CheckoutState {
  personalInfo: PersonalInfo;
  shippingAddress: ShippingAddress;
  discountCode: string;
  paymentMethod: PaymentMethod;
  shippingFee: number;
  subtotal: number;
  discount: number;
}

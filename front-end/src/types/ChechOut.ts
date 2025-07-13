
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
  paymentMethod: string;
}

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}

export interface ContactFormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  message?: string;
}

export interface ContactInfo {
  address: string;
  email: string;
  phone: string;
  hours: string;
}
export interface RegisterFormData {
  username: string;  // đổi từ name thành username
  email: string;
  phone: string;     // nếu backend không nhận thì frontend có thể giữ để validate UI, nhưng không gửi
  password: string;
  confirmPassword: string; // tương ứng với retypePassword backend
  termsAccepted: boolean;
}

export interface RegisterFormErrors {
    username?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
    termsAccepted?: string;
}
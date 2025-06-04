export interface LoginCredentials {
    username: string;
    password: string;
    rememberMe: boolean;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: {
    id: number;
    username: string;
    email: string;
    role: string;
    status: string;
  };
  error?: string;
}


export interface SocialLoginProvider {
    name: 'google' | 'apple';
    icon: string;
    label: string;
}
export interface LoginCredentials {
    email: string;
    password: string;
    rememberMe: boolean;
}

export interface LoginResponse {
    success: boolean;
    token?: string;
    user?: {
        id: string;
        name: string;
        email: string;
    };
    error?: string;
}

export interface SocialLoginProvider {
    name: 'google' | 'apple';
    icon: string;
    label: string;
}
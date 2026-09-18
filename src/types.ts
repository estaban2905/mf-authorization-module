export type AuthView = 'login' | 'register';

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  receiveUpdates: boolean;
}

export interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  acceptTerms?: string;
  general?: string;
}

export interface AuthLayoutProps {
  children: React.ReactNode;
  companyName?: string;
  logoUrl?: string;
  title: string;
  subtitle: string;
  termsUrl?: string;
  privacyUrl?: string;
}

export interface LoginFormProps {
  onLogin?: (data: LoginFormData) => Promise<{ success: boolean; error?: string } | void> | void;
  onForgotPassword?: () => void;
  onSwitchToRegister: () => void;
  onLoginWithGoogle?: () => void;
  onLoginWithMicrosoft?: () => void;
  onLoginWithApple?: () => void;
  isLoading?: boolean;
}

export interface RegisterFormProps {
  onRegister?: (data: RegisterFormData) => Promise<{ success: boolean; error?: string } | void> | void;
  onSwitchToLogin: () => void;
  onRegisterWithGoogle?: () => void;
  onRegisterWithMicrosoft?: () => void;
  onRegisterWithApple?: () => void;
  termsUrl?: string;
  privacyUrl?: string;
  isLoading?: boolean;
}

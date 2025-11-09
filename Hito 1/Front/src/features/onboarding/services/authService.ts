import api from '../../../shared/services/api';

export interface RegisterDto {
  email: string;
  password: string;
  telefono: string;
  termsAccepted: boolean;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    token?: string;
    cliente?: {
      id: string;
      email: string;
      estadoOnboarding: string;
    };
  };
}

export const authService = {
  async register(data: RegisterDto): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  async login(data: LoginDto): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', data);
    if (response.data.data?.token) {
      localStorage.setItem('token', response.data.data.token);
    }
    return response.data;
  },

  async verifyEmail(token: string): Promise<AuthResponse> {
    const response = await api.get<AuthResponse>(`/auth/verify-email/${token}`);
    return response.data;
  },

  async resendVerificationEmail(email: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/resend-verification', { email });
    return response.data;
  },
};

import apiClient from './client';

export const authService = {
  signup: async (data: any) => {
    const response = await apiClient.post('/auth/signup', data);
    return response.data;
  },
  signin: async (data: any) => {
    const response = await apiClient.post('/auth/signin', data);
    return response.data;
  },
  resendVerification: async (email: string) => {
    const response = await apiClient.post('/auth/resend-verification', { email });
    return response.data;
  },
  forgotPassword: async (email: string) => {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return response.data;
  },
  resetPassword: async (token: string, newPassword: string) => {
    const response = await apiClient.post('/auth/reset-password', { token, newPassword });
    return response.data;
  },
};

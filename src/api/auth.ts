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
};

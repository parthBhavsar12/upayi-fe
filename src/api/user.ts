import apiClient from './client';

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  upiId: string;
}

export const getUserProfile = async (): Promise<UserProfile> => {
  const response = await apiClient.get<UserProfile>('/users');
  return response.data;
};

export const updateUpiId = async (upiId: string): Promise<{ message: string; upiId: string }> => {
  const response = await apiClient.put<{ message: string; upiId: string }>('/users/upi', { upiId });
  return response.data;
};

export const changePassword = async (oldPassword: string, newPassword: string): Promise<{ message: string }> => {
  const response = await apiClient.put<{ message: string }>('/users/password', { oldPassword, newPassword });
  return response.data;
};

import apiClient from './client';

export interface Transaction {
  _id: string;
  amount: number;
  user_id: string;
  createdAt: string;
  updatedAt: string;
}

export const saveTransaction = async (amount: number): Promise<Transaction> => {
  const response = await apiClient.post<Transaction>('/transactions', { amount });
  return response.data;
};

export const getTransactions = async (queryParams?: string): Promise<Transaction[]> => {
  const url = queryParams ? `/transactions?${queryParams}` : '/transactions';
  const response = await apiClient.get<Transaction[]>(url);
  return response.data;
};

export const deleteTransaction = async (id: string): Promise<void> => {
  await apiClient.delete(`/transactions/${id}`);
};

type PublicEnv = {
  upiCurrency: string;
  upiCurrencySymbol: string;
  upiPaymentNote: string;
  mode: string;
  isDevelopment: boolean;
  isProduction: boolean;
  apiBaseUrl: string;
};

export const env: PublicEnv = {
  upiCurrency: import.meta.env.VITE_UPI_CURRENCY?.trim() || 'INR',
  upiCurrencySymbol: import.meta.env.VITE_UPI_CURRENCY_SYMBOL?.trim() || '₹',
  upiPaymentNote: import.meta.env.VITE_UPI_PAYMENT_NOTE?.trim() || 'UPayI payment',
  mode: import.meta.env.MODE,
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  apiBaseUrl: import.meta.env.VITE_API_URL as string,
};

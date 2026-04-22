type PublicEnv = {
  payeeName: string;
  payeeUpiId: string;
  upiCurrency: string;
  upiCurrencySymbol: string;
  upiPaymentNote: string;
  mode: string;
  isDevelopment: boolean;
  isProduction: boolean;
  apiBaseUrl: string;
};

const requiredEnv = {
  VITE_PAYEE_NAME: import.meta.env.VITE_PAYEE_NAME,
  VITE_PAYEE_UPI_ID: import.meta.env.VITE_PAYEE_UPI_ID,
} as const;

function readRequiredEnv(key: keyof typeof requiredEnv): string {
  const value = requiredEnv[key]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

export const env: PublicEnv = {
  payeeName: readRequiredEnv('VITE_PAYEE_NAME'),
  payeeUpiId: readRequiredEnv('VITE_PAYEE_UPI_ID'),
  upiCurrency: import.meta.env.VITE_UPI_CURRENCY?.trim() || 'INR',
  upiCurrencySymbol: import.meta.env.VITE_UPI_CURRENCY_SYMBOL?.trim() || '₹',
  upiPaymentNote: import.meta.env.VITE_UPI_PAYMENT_NOTE?.trim() || 'UPayI payment',
  mode: import.meta.env.MODE,
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  apiBaseUrl: import.meta.env.VITE_API_URL,
};

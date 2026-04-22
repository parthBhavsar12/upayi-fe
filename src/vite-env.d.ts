/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PAYEE_NAME: string;
  readonly VITE_PAYEE_UPI_ID: string;
  readonly VITE_UPI_CURRENCY?: string;
  readonly VITE_UPI_CURRENCY_SYMBOL?: string;
  readonly VITE_UPI_PAYMENT_NOTE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

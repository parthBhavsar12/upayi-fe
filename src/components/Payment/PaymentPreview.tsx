import { env } from '../../config/env';

interface PaymentPreviewProps {
  displayAmount: string;
}

export function PaymentPreview({ displayAmount }: PaymentPreviewProps) {
  return (
    <section className="payment-preview" id="amount-preview" aria-live="polite">
      <span>Total payable</span>
      <strong className="money-value">
        <span>{env.upiCurrencySymbol}</span>
        <span>{displayAmount}</span>
      </strong>
    </section>
  );
}

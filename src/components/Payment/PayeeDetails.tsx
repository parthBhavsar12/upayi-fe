import { env } from '../../config/env';

export function PayeeDetails() {
  return (
    <section className="payee-panel" aria-label="Payee details">
      <span>Paying to</span>
      <strong>{env.payeeName}</strong>
      <small>{env.payeeUpiId}</small>
    </section>
  );
}

import { UseFormRegisterReturn } from 'react-hook-form';
import { env } from '../../config/env';

interface AmountFieldProps {
  registration: UseFormRegisterReturn<'amount'>;
  error?: string;
  onInputChange: (value: string) => void;
}

export function AmountField({ registration, error, onInputChange }: AmountFieldProps) {
  return (
    <div className="amount-field-container">
      <label className="amount-field" htmlFor="amount">
        <span>Amount</span>
        <div className="amount-field__control">
          <span>{env.upiCurrencySymbol}</span>
          <input
            {...registration}
            id="amount"
            type="text"
            inputMode="decimal"
            autoComplete="off"
            placeholder="0.00"
            onChange={(e) => {
              registration.onChange(e);
              onInputChange(e.target.value);
            }}
            aria-describedby="amount-error amount-preview"
            aria-invalid={error ? 'true' : 'false'}
          />
        </div>
      </label>
      <p className="field-error" id="amount-error" role="status">
        <span className="field-error__icon">i</span>
        {error || 'Ready to create your UPI payment request.'}
      </p>
    </div>
  );
}

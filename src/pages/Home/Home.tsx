import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { env } from '../../config/env';
import { normalizeAmount } from '../../utils/payment';
import { BrandingSubtitle } from '../../components/Branding/Branding';
import { Toast } from '../../components/Common/Toast';
import { PayeeDetails } from '../../components/Payment/PayeeDetails';
import { AmountField } from '../../components/Payment/AmountField';
import { PaymentPreview } from '../../components/Payment/PaymentPreview';
import { QrPanel } from '../../components/Payment/QrPanel';
import { PageLayout } from '../../components/Common/PageLayout';
import { paymentSchema } from '../../schemas';

interface PaymentFormData {
  amount: string;
}

export function Home() {
  const [submittedAmount, setSubmittedAmount] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<PaymentFormData>({
    resolver: yupResolver(paymentSchema),
    defaultValues: { amount: '' },
    mode: 'onChange',
  });

  const currentAmount = watch('amount');
  const displayAmount = currentAmount || '0';

  const submittedPaymentUrl = useMemo(() => {
    if (!submittedAmount) {
      return '';
    }

    const params = new URLSearchParams({
      pa: env.payeeUpiId,
      pn: env.payeeName,
      am: submittedAmount,
      cu: env.upiCurrency,
      tn: env.upiPaymentNote,
    });

    return `upi://pay?${params.toString()}`;
  }, [submittedAmount]);

  const hasGeneratedQr = Boolean(submittedPaymentUrl);

  useEffect(() => {
    if (!toastMessage) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setToastMessage(''), 2600);

    return () => window.clearTimeout(timeoutId);
  }, [toastMessage]);

  function onSubmit(data: PaymentFormData) {
    setSubmittedAmount(data.amount);
  }

  function showFormWithClearedAmount() {
    setSubmittedAmount('');
    setToastMessage('');
    reset({ amount: '' });
  }

  function resetPaymentWithToast(message: string) {
    setSubmittedAmount('');
    setToastMessage(message);
    reset({ amount: '' });
  }

  return (
    <PageLayout
      eyebrow="UPI payment"
      title="Enter amount to pay"
      description="Add the payment amount and continue with any UPI app installed on your device."
    >
      <form
        className={`payment-card${hasGeneratedQr ? ' payment-card--result' : ''}`}
        onSubmit={handleSubmit(onSubmit)}
      >
        <BrandingSubtitle />

        {submittedPaymentUrl ? (
          <>
            <QrPanel amount={submittedAmount} paymentUrl={submittedPaymentUrl} />

            <div className="result-actions" aria-label="Payment actions">
              <button
                className="action-button action-button--change"
                type="button"
                onClick={showFormWithClearedAmount}
              >
                Change amount
              </button>

              <div className="decision-actions">
                <button
                  className="action-button action-button--ok"
                  type="button"
                  onClick={() => resetPaymentWithToast('Payment Marked as Paid!')}
                >
                  Received, OK!
                </button>
                <button
                  className="action-button action-button--cancel"
                  type="button"
                  onClick={() => resetPaymentWithToast('Payment Cancelled!')}
                >
                  Cancel
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <PayeeDetails />

            <AmountField
              registration={register('amount')}
              onInputChange={(val) => {
                setValue('amount', normalizeAmount(val), { shouldValidate: true });
                setSubmittedAmount('');
              }}
              error={errors.amount?.message}
            />

            <PaymentPreview displayAmount={displayAmount} />

            <button
              className="pay-button"
              type="submit"
              disabled={Boolean(errors.amount)}
            >
              Generate QR Code
            </button>
          </>
        )}
      </form>
      <Toast message={toastMessage} />
    </PageLayout>
  );
}

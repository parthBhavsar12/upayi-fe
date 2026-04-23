import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { PageLayout } from '../../components/Common/PageLayout';
import { Input } from '../../components/Common/Input';
import { Toast } from '../../components/Common/Toast';
import { forgotPasswordSchema } from '../../schemas';
import { authService } from '../../api/auth';

export function ForgotPassword() {
  const [apiError, setApiError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
    mode: 'onBlur',
  });

  useEffect(() => {
    if (!toastMessage) return;
    const timeoutId = window.setTimeout(() => setToastMessage(''), 3000);
    return () => window.clearTimeout(timeoutId);
  }, [toastMessage]);

  const onSubmit = async (data: any) => {
    try {
      setApiError(null);
      await authService.forgotPassword(data.email);
      setToastMessage('Reset link sent to your email.');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to request reset link. Please try again.';
      setApiError(message);
      setToastMessage(message);
    }
  };

  return (
    <PageLayout
      eyebrow="Account Recovery"
      title="Forgot your password?"
      description="Enter your email and we’ll send you a password reset link."
    >
      <div className="payment-card">
        <header className="auth-header">
          <h1>Reset password</h1>
          <p>We’ll email you a secure reset link.</p>
        </header>

        <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
          {apiError && (
            <div className="form-error-banner" role="alert">
              <span className="error-icon">!</span>
              {apiError}
            </div>
          )}

          <Input
            id="email"
            label="Email address"
            type="email"
            placeholder="name@company.com"
            registration={register('email')}
            error={errors.email?.message}
          />

          <div className="form-actions">
            <button type="submit" className="auth-button" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send reset link'}
            </button>
          </div>
        </form>

        <footer className="auth-footer">
          <p>
            Remembered your password? <Link to="/signin">Sign in</Link>
          </p>
        </footer>
      </div>

      <Toast message={toastMessage} />
    </PageLayout>
  );
}


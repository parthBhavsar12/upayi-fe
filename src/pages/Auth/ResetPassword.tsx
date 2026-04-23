import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { PageLayout } from '../../components/Common/PageLayout';
import { Input } from '../../components/Common/Input';
import { Toast } from '../../components/Common/Toast';
import { resetPasswordSchema } from '../../schemas';
import { authService } from '../../api/auth';

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = useMemo(() => searchParams.get('token') || '', [searchParams]);
  const navigate = useNavigate();

  const [apiError, setApiError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
    mode: 'onBlur',
  });

  useEffect(() => {
    if (!toastMessage) return;
    const timeoutId = window.setTimeout(() => setToastMessage(''), 3000);
    return () => window.clearTimeout(timeoutId);
  }, [toastMessage]);

  useEffect(() => {
    if (!token) {
      setApiError('Reset token is missing or invalid. Please request a new reset link.');
    }
  }, [token]);

  const onSubmit = async (data: any) => {
    if (!token) {
      const message = 'Reset token is missing or invalid. Please request a new reset link.';
      setApiError(message);
      setToastMessage(message);
      return;
    }

    try {
      setApiError(null);
      await authService.resetPassword(token, data.newPassword);
      setToastMessage('Password reset successful. Redirecting to sign in...');
      window.setTimeout(() => navigate('/signin'), 900);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to reset password. Please try again.';
      setApiError(message);
      setToastMessage(message);
    }
  };

  return (
    <PageLayout
      eyebrow="Account Recovery"
      title="Set a new password"
      description="Choose a strong password to secure your account."
    >
      <div className="payment-card">
        <header className="auth-header">
          <h1>New password</h1>
          <p>Enter and confirm your new password.</p>
        </header>

        <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
          {apiError && (
            <div className="form-error-banner" role="alert">
              <span className="error-icon">!</span>
              {apiError}
            </div>
          )}

          <Input
            id="newPassword"
            label="New password"
            type="password"
            placeholder="••••••••"
            registration={register('newPassword')}
            error={errors.newPassword?.message}
          />

          <Input
            id="confirmPassword"
            label="Confirm password"
            type="password"
            placeholder="••••••••"
            registration={register('confirmPassword')}
            error={errors.confirmPassword?.message}
          />

          <div className="form-actions">
            <button type="submit" className="auth-button" disabled={isSubmitting || !token}>
              {isSubmitting ? 'Updating...' : 'Update password'}
            </button>
          </div>
        </form>

        <footer className="auth-footer">
          <p>
            Back to <Link to="/signin">Sign in</Link>
          </p>
        </footer>
      </div>

      <Toast message={toastMessage} />
    </PageLayout>
  );
}


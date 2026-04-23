import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { PageLayout } from '../../components/Common/PageLayout';
import { Input } from '../../components/Common/Input';
import { Toast } from '../../components/Common/Toast';
import { signInSchema } from '../../schemas';
import { authService } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';

export function SignIn() {
  const { login } = useAuth();
  const [apiError, setApiError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState('');
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldownSeconds, setResendCooldownSeconds] = useState(0);
  const location = useLocation();

  const initialState = useMemo(() => {
    const state = location.state as { toast?: string; email?: string } | null;
    return {
      toast: state?.toast,
      email: state?.email,
    };
  }, [location.state]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(signInSchema),
    mode: 'onBlur',
    defaultValues: {
      email: initialState.email || '',
      password: '',
    },
  });

  useEffect(() => {
    if (!initialState.toast) return;
    setToastMessage(initialState.toast);
    // Clear location state to prevent showing the same toast after refresh/navigation.
    window.history.replaceState({}, document.title);
  }, [initialState.toast]);

  useEffect(() => {
    if (!toastMessage) return;
    const timeoutId = window.setTimeout(() => setToastMessage(''), 3000);
    return () => window.clearTimeout(timeoutId);
  }, [toastMessage]);

  useEffect(() => {
    if (resendCooldownSeconds <= 0) return;
    const intervalId = window.setInterval(() => {
      setResendCooldownSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => window.clearInterval(intervalId);
  }, [resendCooldownSeconds]);

  const onSubmit = async (data: any) => {
    try {
      setApiError(null);
      setUnverifiedEmail(null);
      const response = await authService.signin(data);
      login(response);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to sign in. Please try again.';
      setApiError(message);
      setToastMessage(message);
      if (error.response?.status === 403 && /not verified/i.test(message)) {
        setUnverifiedEmail(data.email);
      }
    }
  };

  const handleResendVerification = async () => {
    const email = unverifiedEmail || watch('email');
    if (!email) {
      setToastMessage('Please enter your email first.');
      return;
    }

    try {
      setIsResending(true);
      await authService.resendVerification(email);
      setToastMessage('Verification email sent. Please check your inbox.');
      setResendCooldownSeconds(30);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to resend verification email. Please try again.';
      setToastMessage(message);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <PageLayout
      eyebrow="Account Access"
      title="Welcome back to UPayI"
      description="Enter your credentials to manage your payments and track your history."
    >
      <div className="payment-card">
        <header className="auth-header">
          <h1>Sign in</h1>
          <p>Please enter your details.</p>
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
          
          <Input
            id="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            registration={register('password')}
            error={errors.password?.message}
          />
          
          <div className="form-actions">
            <button type="submit" className="auth-button" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>
            {unverifiedEmail && (
              <button
                type="button"
                className="auth-button auth-button--secondary"
                onClick={handleResendVerification}
                disabled={isResending || resendCooldownSeconds > 0}
              >
                {isResending
                  ? 'Sending...'
                  : resendCooldownSeconds > 0
                    ? `Resend in ${resendCooldownSeconds}s`
                    : 'Resend verification email'}
              </button>
            )}
          </div>
        </form>
        
        <footer className="auth-footer">
          <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
          <p><Link to="/forgot-password">Forgot your password?</Link></p>
        </footer>
      </div>
      <Toast message={toastMessage} />
    </PageLayout>
  );
}

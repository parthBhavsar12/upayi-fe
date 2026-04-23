import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { PageLayout } from '../../components/Common/PageLayout';
import { Input } from '../../components/Common/Input';
import { Toast } from '../../components/Common/Toast';
import { signUpSchema } from '../../schemas';
import { authService } from '../../api/auth';

export function SignUp() {
  const [apiError, setApiError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState('');
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(signUpSchema),
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
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...signupData } = data;
      await authService.signup(signupData);
      setToastMessage('Verification email sent. Please check your inbox.');
      navigate('/signin', { state: { toast: 'Verification email sent. Please check your inbox.', email: signupData.email } });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create account. Please try again.';
      setApiError(message);
      setToastMessage(message);
    }
  };

  return (
    <PageLayout
      eyebrow="Get Started"
      title="Create your account"
      description="Join UPayI today and experience the fastest way to request and receive UPI payments."
    >
      <div className="payment-card">
        <header className="auth-header">
          <h1>Sign up</h1>
          <p>Start your journey with us.</p>
        </header>
        
        <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
          {apiError && (
            <div className="form-error-banner" role="alert">
              <span className="error-icon">!</span>
              {apiError}
            </div>
          )}

          <Input
            id="name"
            label="Full Name"
            placeholder="John Doe"
            registration={register('name')}
            error={errors.name?.message}
          />

          <Input
            id="email"
            label="Email address"
            type="email"
            placeholder="name@company.com"
            registration={register('email')}
            error={errors.email?.message}
          />
          
          <Input
            id="upiId"
            label="UPI ID"
            placeholder="yourname@upi"
            registration={register('upiId')}
            error={errors.upiId?.message}
          />

          <Input
            id="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            registration={register('password')}
            error={errors.password?.message}
          />

          <Input
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            registration={register('confirmPassword')}
            error={errors.confirmPassword?.message}
          />
          
          <div className="form-actions">
            <button type="submit" className="auth-button" disabled={isSubmitting}>
              {isSubmitting ? 'Creating account...' : 'Create account'}
            </button>
          </div>
        </form>
        
        <footer className="auth-footer">
          <p>Already have an account? <Link to="/signin">Sign in</Link></p>
        </footer>
      </div>
      <Toast message={toastMessage} />
    </PageLayout>
  );
}

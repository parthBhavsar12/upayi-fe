import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { PageLayout } from '../../components/Common/PageLayout';
import { Input } from '../../components/Common/Input';
import { signInSchema } from '../../schemas';
import { authService } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';

export function SignIn() {
  const { login } = useAuth();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(signInSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: any) => {
    try {
      setApiError(null);
      const response = await authService.signin(data);
      login(response);
    } catch (error: any) {
      setApiError(error.response?.data?.message || 'Failed to sign in. Please try again.');
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
          </div>
        </form>
        
        <footer className="auth-footer">
          <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
        </footer>
      </div>
    </PageLayout>
  );
}

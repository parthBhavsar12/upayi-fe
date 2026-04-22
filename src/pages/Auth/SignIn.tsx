import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { PageLayout } from '../../components/Common/PageLayout';
import { Input } from '../../components/Common/Input';
import { signInSchema } from '../../schemas';

export function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(signInSchema),
    mode: 'onBlur',
  });

  const onSubmit = (data: any) => {
    console.log('SignIn Data:', data);
    // Simulate login
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

import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { PageLayout } from '../../components/Common/PageLayout';
import { Input } from '../../components/Common/Input';
import { signUpSchema } from '../../schemas';

export function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(signUpSchema),
    mode: 'onBlur',
  });

  const onSubmit = (data: any) => {
    console.log('SignUp Data:', data);
    // Simulate signup
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
    </PageLayout>
  );
}

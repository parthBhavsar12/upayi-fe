import * as yup from 'yup';

export const paymentSchema = yup.object({
  amount: yup
    .string()
    .required('Enter an amount to continue.')
    .test('is-valid-amount', 'Use a valid amount (e.g., 100.50)', (value) => {
      if (!value) return false;
      return /^\d+(\.\d{0,2})?$/.test(value);
    })
    .test('is-positive', 'Amount must be greater than zero.', (value) => {
      if (!value) return false;
      return Number(value) > 0;
    }),
});

export const signInSchema = yup.object({
  email: yup
    .string()
    .trim()
    .lowercase()
    .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 'Enter a valid email address.')
    .required('Email is required.'),
  password: yup
    .string()
    .trim()
    .required('Password is required.'),
});

export const signUpSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required('Full name is required.')
    .min(2, 'Name is too short.'),
  email: yup
    .string()
    .trim()
    .lowercase()
    .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 'Enter a valid email address.')
    .required('Email is required.'),
  upiId: yup
    .string()
    .trim()
    .lowercase()
    .matches(/^[\w.-]+@[\w.-]+$/, 'Enter a valid UPI ID (e.g., user@bank).')
    .required('UPI ID is required.'),
  password: yup
    .string()
    .trim()
    .min(8, 'Password must be at least 8 characters.')
    .matches(/[a-zA-Z]/, 'Password must contain at least one letter.')
    .matches(/[0-9]/, 'Password must contain at least one number.')
    .required('Password is required.'),
  confirmPassword: yup
    .string()
    .trim()
    .oneOf([yup.ref('password')], 'Passwords must match.')
    .required('Please confirm your password.'),
});


import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { PageLayout } from '../../components/Common/PageLayout';
import { changePassword } from '../../api/user';
import { fetchProfile, updateProfileUpiId, clearError } from '../../store/slices/profileSlice';
import { RootState, AppDispatch } from '../../store';
import { Toast } from '../../components/Common/Toast';
import { changePasswordSchema } from '../../schemas';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Profile.css';

export function Profile() {
  const dispatch = useDispatch<AppDispatch>();
  const { profile, loading, error } = useSelector((state: RootState) => state.profile);
  const [toastMessage, setToastMessage] = useState('');
  const { logout } = useAuth();
  
  // UPI Edit State
  const [isEditingUpi, setIsEditingUpi] = useState(false);
  const [editUpiValue, setEditUpiValue] = useState('');
  const [isSavingUpi, setIsSavingUpi] = useState(false);

  // Password Change State
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(changePasswordSchema),
    mode: 'onChange',
  });
  
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Password Visibility State
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (!toastMessage) return;
    const timeoutId = window.setTimeout(() => setToastMessage(''), 3000);
    return () => window.clearTimeout(timeoutId);
  }, [toastMessage]);

  useEffect(() => {
    if (error) {
      setToastMessage(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleEditUpiClick = () => {
    if (profile) {
      setEditUpiValue(profile.upiId);
      setIsEditingUpi(true);
    }
  };

  const handleCancelEditUpi = () => {
    setIsEditingUpi(false);
    setEditUpiValue('');
  };

  const handleSaveUpi = async () => {
    if (!editUpiValue.trim()) {
      setToastMessage('UPI ID cannot be empty');
      return;
    }
    try {
      setIsSavingUpi(true);
      await dispatch(updateProfileUpiId(editUpiValue)).unwrap();
      setToastMessage('UPI ID updated successfully');
      setIsEditingUpi(false);
    } catch (error: any) {
      setToastMessage(error || 'Failed to update UPI ID');
    } finally {
      setIsSavingUpi(false);
    }
  };

  const handleChangePassword = async (data: any) => {
    try {
      setIsChangingPassword(true);
      await changePassword(data.oldPassword, data.newPassword);
      setToastMessage('Password changed successfully');
      reset();
      // Sign out user and redirect to login
      logout();
    } catch (error: any) {
      setToastMessage(error.response?.data?.message || 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <PageLayout eyebrow="Account" title="Your Profile" description="Loading...">
        <div className="payment-card">
          <p className="profile-loading">Loading profile details...</p>
        </div>
      </PageLayout>
    );
  }

  if (!profile) {
    return (
      <PageLayout eyebrow="Account" title="Your Profile" description="Error">
        <div className="payment-card">
          <p className="profile-empty">Failed to load profile.</p>
        </div>
        <Toast message={toastMessage} />
      </PageLayout>
    );
  }

  return (
    <PageLayout
      eyebrow="Account"
      title="Your Profile"
      description="Manage your account details and security settings."
    >
      <div className="payment-card">
        <section className="profile-section">
          <h3 className="profile-section-title">Personal Information</h3>
          
          <div className="profile-field">
            <label className="profile-label">Name</label>
            <div className="profile-value readonly">{profile.name}</div>
          </div>
          
          <div className="profile-field">
            <label className="profile-label">Email</label>
            <div className="profile-value readonly">{profile.email}</div>
          </div>

          <div className="profile-field">
            <label className="profile-label">UPI ID</label>
            {isEditingUpi ? (
              <div className="form-group" style={{ marginBottom: 0 }}>
                <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                  <input
                    type="text"
                    value={editUpiValue}
                    onChange={(e) => setEditUpiValue(e.target.value)}
                    disabled={isSavingUpi}
                    placeholder="Enter new UPI ID"
                  />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <button 
                      className="action-button action-button--ok" 
                      onClick={handleSaveUpi}
                      disabled={isSavingUpi}
                      style={{ fontSize: '0.9rem', minHeight: '44px' }}
                    >
                      {isSavingUpi ? 'Saving...' : 'Save'}
                    </button>
                    <button 
                      className="action-button action-button--cancel" 
                      onClick={handleCancelEditUpi}
                      disabled={isSavingUpi}
                      style={{ fontSize: '0.9rem', minHeight: '44px' }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="profile-edit-group">
                <div className="profile-value">{profile.upiId}</div>
                <button className="profile-btn profile-btn--edit" onClick={handleEditUpiClick}>
                  Edit
                </button>
              </div>
            )}
          </div>
        </section>

        <hr className="profile-divider" />

        <section className="profile-section">
          <h3 className="profile-section-title">Security</h3>
          <form className="profile-form" onSubmit={handleSubmit(handleChangePassword)}>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="profile-label">Old Password</label>
              <div className="input-wrapper">
                <input
                  type={showOldPassword ? "text" : "password"}
                  {...register('oldPassword')}
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  tabIndex={-1}
                >
                  {showOldPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.822 7.822L21 21m-6.422-6.422a3.75 3.75 0 11-5.304-5.304m5.304 5.304l3.65 3.65" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.644C3.399 8.049 7.21 4.5 12 4.5c4.79 0 8.601 3.549 9.963 7.178.07.186.07.388 0 .574C20.601 15.951 16.79 19.5 12 19.5c-4.79 0-8.601-3.549-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.oldPassword && (
                <div className="field-error">
                  <span className="field-error__icon">!</span>
                  {errors.oldPassword.message}
                </div>
              )}
            </div>
            
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="profile-label">New Password</label>
              <div className="input-wrapper">
                <input
                  type={showNewPassword ? "text" : "password"}
                  {...register('newPassword')}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  tabIndex={-1}
                >
                  {showNewPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.822 7.822L21 21m-6.422-6.422a3.75 3.75 0 11-5.304-5.304m5.304 5.304l3.65 3.65" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.644C3.399 8.049 7.21 4.5 12 4.5c4.79 0 8.601 3.549 9.963 7.178.07.186.07.388 0 .574C20.601 15.951 16.79 19.5 12 19.5c-4.79 0-8.601-3.549-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <div className="field-error">
                  <span className="field-error__icon">!</span>
                  {errors.newPassword.message}
                </div>
              )}
            </div>

            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label className="profile-label">Confirm New Password</label>
              <div className="input-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  {...register('confirmPassword')}
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.822 7.822L21 21m-6.422-6.422a3.75 3.75 0 11-5.304-5.304m5.304 5.304l3.65 3.65" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.644C3.399 8.049 7.21 4.5 12 4.5c4.79 0 8.601 3.549 9.963 7.178.07.186.07.388 0 .574C20.601 15.951 16.79 19.5 12 19.5c-4.79 0-8.601-3.549-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <div className="field-error">
                  <span className="field-error__icon">!</span>
                  {errors.confirmPassword.message}
                </div>
              )}
            </div>

            <button 
              type="submit" 
              className="auth-button"
              style={{ width: '100%' }}
              disabled={isChangingPassword}
            >
              {isChangingPassword ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </section>
      </div>

      <Toast message={toastMessage} />
    </PageLayout>
  );
}

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../api/client.js';

const STRONG_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])(?=.*[A-Za-z\d@$!%*?&]{8,})[A-Za-z\d@$!%*?&]+$/;

function getPasswordChecks(password) {
  return [
    { label: 'At least 8 characters', valid: password.length >= 8 },
    { label: 'At least one lowercase letter', valid: /[a-z]/.test(password) },
    { label: 'At least one uppercase letter', valid: /[A-Z]/.test(password) },
    { label: 'At least one digit', valid: /\d/.test(password) },
    { label: 'At least one special character (@$!%*?&)', valid: /[@$!%*?&]/.test(password) },
    { label: 'No whitespace', valid: !/\s/.test(password) }
  ];
}

export default function ProfilePage() {
  const [profile, setProfile] = useState({ email: '', fullName: '', phone: '' });
  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '' });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);

  const loadProfile = async () => {
    try {
      const { data } = await api.get('/profile');
      setProfile({ email: data.email || '', fullName: data.fullName || '', phone: data.phone || '' });
    } catch (e) {
      const details = e.response?.data;
      toast.error(details?.message || 'Failed to load profile');
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      await api.put('/profile', profile);
      toast.success('Profile updated successfully');
    } catch (e1) {
      const details = e1.response?.data;
      toast.error(details?.message || 'Failed to update profile');
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    const missingRules = getPasswordChecks(passwords.newPassword).filter((rule) => !rule.valid).map((rule) => rule.label);
    if (!STRONG_PASSWORD_REGEX.test(passwords.newPassword) || missingRules.length > 0) {
      toast.error(`New password must include ${missingRules.join(', ')}`);
      return;
    }
    try {
      await api.put('/profile/change-password', passwords);
      setPasswords({ oldPassword: '', newPassword: '' });
      setShowPasswordDialog(false);
      toast.success('Password changed successfully');
    } catch (e1) {
      const details = e1.response?.data;
      toast.error(details?.message || 'Failed to change password');
    }
  };

  return (
    <section className="card">
      <div>
        <h2>Profile Management</h2>
        <form id="profile-form" className="form-grid" onSubmit={updateProfile}>
          <div className="floating-label full">
            <input placeholder=" " value={profile.fullName} onChange={(e) => setProfile({ ...profile, fullName: e.target.value })} />
            <label>Full Name</label>
          </div>
          <div className="floating-label full">
            <input placeholder=" " value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
            <label>Email</label>
          </div>
          <div className="floating-label full">
            <input placeholder=" " value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
            <label>Phone</label>
          </div>
        </form>
      </div>
      <div className="button-row">
        <button className="btn" type="submit" form="profile-form">Update Profile</button>
        <button className="btn" type="button" onClick={() => setShowPasswordDialog(true)}>Change Password</button>
      </div>

      {showPasswordDialog && (
        <div className="modal-backdrop" onClick={() => setShowPasswordDialog(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Change Password</h3>
            <form className="form-grid" onSubmit={changePassword}>
              <div className="floating-label full">
                <input type={showOldPassword ? 'text' : 'password'} placeholder=" " value={passwords.oldPassword} onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })} />
                <label>Old Password</label>
                <button type="button" className="password-toggle" onClick={() => setShowOldPassword((v) => !v)}>
                  {showOldPassword ? '🙈' : '👁'}
                </button>
              </div>
              <div className="floating-label full">
                <input type={showNewPassword ? 'text' : 'password'} placeholder=" " value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} />
                <label>New Password</label>
                <button type="button" className="password-toggle" onClick={() => setShowNewPassword((v) => !v)}>
                  {showNewPassword ? '🙈' : '👁'}
                </button>
              </div>
              <ul className="password-rules">
                {getPasswordChecks(passwords.newPassword).map((rule) => (
                  <li key={rule.label} className={rule.valid ? 'rule-ok' : 'rule-pending'}>
                    {rule.label}
                  </li>
                ))}
              </ul>
              <div className="button-row">
                <button type="button" className="btn cancel" onClick={() => setShowPasswordDialog(false)}>Cancel</button>
                <button className="btn" type="submit">Change Password</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

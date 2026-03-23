import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../api/client.js';

export default function ProfilePage() {
  const [profile, setProfile] = useState({ email: '', fullName: '', phone: '' });
  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '' });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

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
    try {
      await api.put('/profile/change-password', passwords);
      setPasswords({ oldPassword: '', newPassword: '' });
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
        <form className="form-grid" onSubmit={updateProfile}>
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
          <button className="btn" type="submit">Update Profile</button>
        </form>
      </div>
      <br />
      <div>
        <h2>Change Password</h2>
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
          <button className="btn" type="submit">Change Password</button>
        </form>
      </div>
    </section>
  );
}

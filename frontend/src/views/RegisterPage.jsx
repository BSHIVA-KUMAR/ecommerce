import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/client.js';
import { useAuth } from '../state/AuthContext.jsx';
import registerImage from '../assets/register.png';

const STRONG_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])(?=.*[A-Za-z\d@$!%*?&]{8,})[A-Za-z\d@$!%*?&]+$/;

function getPasswordMissingRules(password) {
  const missing = [];
  if (password.length < 8) missing.push('at least 8 characters');
  if (!/[a-z]/.test(password)) missing.push('one lowercase letter');
  if (!/[A-Z]/.test(password)) missing.push('one uppercase letter');
  if (!/\d/.test(password)) missing.push('one digit');
  if (!/[@$!%*?&]/.test(password)) missing.push('one special character (@$!%*?&)');
  if (/\s/.test(password)) missing.push('no whitespace');
  return missing;
}

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', password: '', email: '', fullName: '', role: 'USER' });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    const missingRules = getPasswordMissingRules(form.password);
    if (!STRONG_PASSWORD_REGEX.test(form.password) || missingRules.length > 0) {
      toast.error(`Password must include ${missingRules.join(', ')}`);
      return;
    }
    try {
      const payload = {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        username: form.username.trim(),
        password: form.password,
        role: form.role
      };
      const { data } = await api.post('/auth/register', payload);
      login(data);
      toast.success('Registration successful');
      navigate('/dashboard');
    } catch (e) {
      const details = e.response?.data;
      toast.error(
        details?.message ||
        details?.error ||
        (e.code === 'ERR_NETWORK' ? 'Cannot reach backend at http://localhost:8080' : 'Registration failed')
      );
    }
  };

  return (
    <section className="card login-layout">
      <div className="login-left">

        
        <h2>Register</h2>
        <form onSubmit={onSubmit} className="form-grid">
          <div className="floating-label">
            <input required placeholder=" " value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
            <label>Full Name</label>
          </div>
          <div className="floating-label">
            <input required type="email" placeholder=" " value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <label>Email</label>
          </div>
          <div className="floating-label">
            <input required placeholder=" " value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
            <label>Username</label>
          </div>
          <div className="floating-label">
            <input required minLength={8} type={showPassword ? 'text' : 'password'} placeholder=" " value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <label>Password</label>
            <button type="button" className="password-toggle" onClick={() => setShowPassword((v) => !v)}>
              {showPassword ? '🙈' : '👁'}
            </button>
          </div>
          {form.password && getPasswordMissingRules(form.password).length > 0 && (
            <p className="error small">
              Missing: {getPasswordMissingRules(form.password).join(', ')}
            </p>
          )}
          <div className="role-radios">
            <label>
              <input
                type="radio"
                name="role"
                value="USER"
                checked={form.role === 'USER'}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              />
              Register as User
            </label>
            <label>
              <input
                type="radio"
                name="role"
                value="ADMIN"
                checked={form.role === 'ADMIN'}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              />
              Register as Admin
            </label>
          </div>
          <div className="button-row">
            <button className="btn" type="submit">Create Account</button>
          </div>
        </form>
      </div>
      <div className="login-right">
        <img className="login-image" src={registerImage} alt="Register illustration" />
      </div>
    </section>
  );
}

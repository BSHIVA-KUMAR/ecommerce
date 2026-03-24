import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/client.js';
import { useAuth } from '../state/AuthContext.jsx';
import registerImage from '../assets/register.png';

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

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', password: '', email: '', fullName: '', role: 'USER' });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    const missingRules = getPasswordChecks(form.password).filter((rule) => !rule.valid).map((rule) => rule.label);
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
          <strong>Password Must have</strong>
          <ul className="password-rules">
            {getPasswordChecks(form.password).map((rule) => (
              <li key={rule.label} className={rule.valid ? 'rule-ok' : 'rule-pending'}>
                {rule.label}
              </li>
            ))}
          </ul>
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

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/client.js';
import { useAuth } from '../state/AuthContext.jsx';
import loginImage from '../assets/login.png';

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/login', form);
      login(data);
      toast.success('Login successful');
      navigate('/dashboard');
    } catch (e) {
      const details = e.response?.data;
      toast.error(details?.message || 'Invalid credentials');
    }
  };

  return (
    <section className="card login-layout">
      <div className="login-left">
        <h2>Login</h2>
        <form onSubmit={onSubmit} className="form-grid">
          <div className="floating-label">
            <input
              required
              placeholder=" "
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
            <label>Username</label>
          </div>

          <div className="floating-label">
            <input
              required
              minLength={6}
              type={showPassword ? 'text' : 'password'}
              placeholder=" "
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <label>Password</label>
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? '🙈' : '👁'}
            </button>
          </div>
          <button className="btn" type="submit">Sign In</button>
        </form>
      </div>
      <div className="login-right">
        <img
          className="login-image"
          src={loginImage}
          alt="Login illustration"
        />
      </div>
    </section>
  );
}

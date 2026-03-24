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
          <a className="auth-link" href="/register">Don't have an account? Register</a>
          <div className="button-row">
            <button className="btn" type="submit">Sign In</button>
          </div>
        </form>
        <div className="login-note">
          <h3>Demo Login Credentials</h3>
          <p><strong>Admin</strong> - Username: admin, Email: admin@gmail.com, Password: admin123</p>
          <p><strong>User</strong> - Username: user, Email: user@gmail.com, Password: user123</p>
          <p><strong>Admin 2</strong> - Username: admin2, Email: admin2@gmail.com, Password: admin2123</p>
        </div>
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

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/client.js';
import { useAuth } from '../state/AuthContext.jsx';
import loginImage from '../assets/login.png';
import googleIcon from '../assets/google.png';

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

  const onGoogleLogin = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
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
          <div className="button-row">
            
          <a className="auth-link" href="/register">Don't have an account? Register</a>
            <button className="btn" type="submit">Sign In</button>
          </div>

          <div className="login-divider" aria-hidden="true">
            <span>or</span>
          </div>
          <div className="login-google-row">
            <button
              type="button"
              className="google-signin-btn"
              onClick={onGoogleLogin}
              aria-label="Sign in with Google"
            >
              <span className="google-signin-icon-wrap">
                <img src={googleIcon} alt="" className="google-signin-icon" width={22} height={22} />
              </span>
              <span className="google-signin-label">Continue with Google</span>
            </button>
          </div>
        </form>
        <div className="login-note">
          <h3>Demo Login Credentials</h3>
          <p className="small muted">Passwords match signup rules (8+ chars, upper, lower, number, @$!%*?&amp;).</p>
          <strong>Admin credentials</strong>
          <p>
            Username: admin<br />
            Email: admin@gmail.com<br />
            Password: Admin@123
          </p>
          <p>
            Username: admin2<br />
            Email: admin2@gmail.com<br />
            Password: Admin2@demo
          </p>
          <strong>User credentials</strong>
          <p>
            Username: user<br />
            Email: user@gmail.com<br />
            Password: User@12345
          </p>
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

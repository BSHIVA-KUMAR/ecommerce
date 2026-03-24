import React, { useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../state/AuthContext.jsx';

export default function OAuthSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const token = searchParams.get('token');
    const username = searchParams.get('username');
    const role = searchParams.get('role');
    const error = searchParams.get('error');

    if (error) {
      toast.error('Google login failed');
      navigate('/login', { replace: true });
      return;
    }

    if (!token || !username || !role) {
      toast.error('Invalid OAuth response');
      navigate('/login', { replace: true });
      return;
    }

    // Apply auth synchronously so /dashboard sees token on first paint (avoids empty dashboard until refresh).
    flushSync(() => {
      login({ token, username, role });
    });
    toast.success('Google login successful');
    navigate('/dashboard', { replace: true });
  }, [searchParams, navigate, login]);

  return (
    <section className="card narrow">
      <h3>Signing you in...</h3>
      <p className="muted">Completing Google login.</p>
    </section>
  );
}

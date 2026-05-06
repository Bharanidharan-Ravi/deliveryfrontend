import { useState } from 'react';
import { useAuthStore } from '../../../store/useAuthStore';
import {useDeliveryWorkflowStore} from '../../delivery/store/useDeliveryWorkflowStore';
import { authService } from '../../../services/authService';
import { getDeviceId } from '../../../utils/deviceFingerprint';
import { ErrorBanner } from '../../../components/common/ErrorBanner';
import { Spinner } from '../../../components/common/Spinner';
import { useLogin } from '../../../hooks/useLogin';

export function LoginForm() {
  const loginMutation = useLogin();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!username.trim() || !password.trim()) return;

  setError(null);

  try {
    const deviceId = getDeviceId();

    await loginMutation.mutateAsync({
      username,
      password,
      deviceId,
    });
  } catch (err) {
    setError(
      err.response?.data?.message ||
      'Invalid credentials. Please try again.'
    );
  }
};

  return (
    <div className="flex flex-col items-center justify-center min-h-full px-6 py-12">
      {/* Logo */}
      <div className="mb-8 flex flex-col items-center gap-3">
        <div className="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center shadow-glow">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-primary" stroke="currentColor" strokeWidth="1.5">
            <path d="M1 3h15v13H1z" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M16 8h4l3 3v5h-7V8z" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="5.5" cy="18.5" r="2.5" />
            <circle cx="18.5" cy="18.5" r="2.5" />
          </svg>
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white tracking-tight">DeliveryApp</h2>
          <p className="text-sm text-muted mt-1">Sign in to your delivery account</p>
        </div>
      </div>

      {/* Form */}
      <form id="login-form" onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <ErrorBanner message={error} onDismiss={() => setError(null)} />

        <div className="space-y-3">
          <div className="input-group">
            <label htmlFor="login-username" className="input-label">Username</label>
            <input
              id="login-username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input"
              placeholder="Enter your username"
              disabled={loading}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="login-password" className="input-label">Password</label>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input pr-12"
                placeholder="Enter your password"
                disabled={loading}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
        </div>

        <button
          id="login-submit-btn"
          type="submit"
          disabled={loginMutation.isPending || !username || !password}
          className="btn-primary w-full mt-2"
        >
          {loginMutation.isPending ? <Spinner size="sm" label="" /> : 'Sign In'}
        </button>
      </form>
    </div>
  );
}

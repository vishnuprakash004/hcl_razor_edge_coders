import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/menu');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-orbs">
        <div className="auth-orb auth-orb--1" />
        <div className="auth-orb auth-orb--2" />
      </div>
      <div className="auth-card animate-fade-up">
        <div className="auth-card__logo">🍕 FoodieHub</div>
        <h1 className="auth-card__title">Create Account</h1>
        <p className="auth-card__subtitle">Join thousands of food lovers</p>

        {error && <div className="alert alert-error" style={{ marginBottom: 20 }}>{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="reg-name">Full Name</label>
            <input id="reg-name" type="text" className="form-control" placeholder="John Doe"
              value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="form-group">
            <label htmlFor="reg-email">Email Address</label>
            <input id="reg-email" type="email" className="form-control" placeholder="you@example.com"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="form-group">
            <label htmlFor="reg-password">Password</label>
            <div className="password-input-wrapper">
              <input id="reg-password" type={showPassword ? 'text' : 'password'} className="form-control" placeholder="Min. 6 characters"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
              <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)} tabIndex="-1">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="reg-confirm">Confirm Password</label>
            <div className="password-input-wrapper">
              <input id="reg-confirm" type={showConfirm ? 'text' : 'password'} className="form-control" placeholder="Repeat password"
                value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} required />
              <button type="button" className="password-toggle" onClick={() => setShowConfirm(!showConfirm)} tabIndex="-1">
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading} id="register-submit-btn">
            {loading ? '⏳ Creating...' : '🚀 Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login" id="go-login-link">Sign in →</Link>
        </p>
      </div>
    </div>
  );
}

import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Trees, Lock, Mail, ArrowRight } from 'lucide-react';

const Login = () => {
  const { login, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (token) navigate('/dashboard');
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        navigate('/dashboard');
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError('An unexpected network error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in container" style={{ 
      paddingTop: '150px', 
      minHeight: '80vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center' 
    }}>
      <div className="form-card" style={{ 
        width: '100%', 
        maxWidth: '450px', 
        borderRadius: '20px', 
        padding: '40px',
        boxShadow: 'var(--shadow-md)',
        border: '1px solid rgba(14, 47, 34, 0.05)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '35px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--primary-deep)', marginBottom: '15px' }}>
            <Trees size={32} style={{ color: 'var(--primary-medium)' }} />
            <span style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.8rem', fontWeight: '700' }}>ForestStay</span>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontFamily: '"Outfit", sans-serif', fontWeight: '600' }}>Welcome Back</h2>
          <p style={{ color: 'var(--light-text)', fontSize: '0.9rem' }}>Log in to secure your wilderness escape</p>
        </div>

        {error && (
          <div className="alert alert-error" style={{ fontSize: '0.85rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Mail size={16} /> Email Address
            </label>
            <input 
              type="email" 
              placeholder="e.g. guest@foreststay.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Lock size={16} /> Password
            </label>
            <input 
              type="password" 
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="btn btn-primary" 
            style={{ 
              padding: '14px', 
              borderRadius: '10px', 
              fontSize: '1rem', 
              fontWeight: '600',
              marginTop: '10px'
            }}
          >
            {loading ? 'Logging you in...' : 'Log In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '25px', fontSize: '0.9rem', color: 'var(--light-text)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--primary-medium)', fontWeight: '600', textDecoration: 'underline' }}>Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

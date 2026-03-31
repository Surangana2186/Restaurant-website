import React, { useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';

const Login: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Check if user is trying to access admin panel
  const isAdminLogin = location.search.includes('admin=true');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        console.log('Login successful:', result);
        
        // Store JWT token and user data
        localStorage.setItem('userToken', result.token);
        localStorage.setItem('userEmail', result.user.email);
        localStorage.setItem('userName', result.user.name);
        localStorage.setItem('userRole', result.user.role);
        
        // If admin, store admin data
        if (result.user.role === 'admin') {
          localStorage.setItem('adminEmail', result.user.email);
          localStorage.setItem('adminToken', result.token);
        }
        
        // Redirect based on where they came from
        const from = (location.state as any)?.from?.pathname || (result.user.role === 'admin' ? '/admin' : '/');
        history.push(from);
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-logo">
            <div className="logo-circle">D</div>
          </div>
          
          <h2>{isAdminLogin ? 'Admin Login' : 'Welcome Back'}</h2>
          <p className="login-subtitle">
            {isAdminLogin ? 'Sign in to admin dashboard' : 'Sign in to your Dine n Delight account'}
          </p>
          
          <form onSubmit={handleSubmit} className="login-form">
            {error && (
              <div className="error-message">{error}</div>
            )}
            
            <div className="form-group">
              <div className="input-with-icon">
                <span className="input-icon">📧</span>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>
            
            <div className="form-group">
              <div className="input-with-icon">
                <span className="input-icon">🔒</span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>
            
            <button type="submit" className="login-btn-primary" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
          
          <p className="signup-link">
            Don't have an account? <Link to="/signup">Sign up here</Link>
          </p>
          
          {isAdminLogin && (
            <div className="admin-credentials">
              <h4>Admin Credentials</h4>
              <p><strong>Email:</strong> admin@123.com</p>
              <p><strong>Password:</strong> admin123</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;

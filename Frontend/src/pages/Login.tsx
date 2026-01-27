import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    general: '',
  });

  const validateForm = () => {
    const newErrors = { email: '', password: '', general: '' };
    let isValid = true;

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!formData.email.includes('@')) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, general: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const success = await login(formData.email, formData.password);
      if (success) {
        // Check if admin
        if (formData.email === 'admin@scholarship.com') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        setErrors((prev) => ({ ...prev, general: 'Invalid email or password' }));
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Login to Scholarship Platform</h1>
        
        {/* <div className="info-box">
          <p><strong>Admin Login:</strong></p>
          <p>Email: admin@scholarship.com</p>
          <p>Password: admin123</p>
        </div> */}

        <form onSubmit={handleSubmit}>
          {errors.general && (
            <div className="error-banner">{errors.general}</div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              className={errors.password ? 'input-error' : ''}
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <button type="submit" className="btn-primary">
            Login
          </button>
        </form>

        <p className="register-link">
          Don't have an account?{' '}
          <a onClick={() => navigate('/register')} className="register-link">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
};

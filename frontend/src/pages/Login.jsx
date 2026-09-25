import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: 'admin@spms.com',
    password: 'admin123',
    confirmPassword: '',
    mobileNumber: '',
    role: 'Student'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Validation rules
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    // At least 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const validateMobileNumber = (mobile) => {
    const regex = /^[0-9\-\+\(\) ]{10,15}$/;
    return regex.test(mobile);
  };

  const validateFullName = (name) => {
    const regex = /^[a-zA-Z\s]{2,150}$/;
    return regex.test(name);
  };

  const validateForm = () => {
    const newErrors = {};

    if (isSignUp) {
      if (!formData.fullName.trim()) {
        newErrors.fullName = 'Full name is required';
      } else if (!validateFullName(formData.fullName)) {
        newErrors.fullName = 'Full name must be 2-150 characters and contain only letters and spaces';
      }

      if (!formData.mobileNumber.trim()) {
        newErrors.mobileNumber = 'Mobile number is required';
      } else if (!validateMobileNumber(formData.mobileNumber)) {
        newErrors.mobileNumber = 'Mobile number must be 10-15 digits';
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (isSignUp && !validatePassword(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, digit, and special character (@$!%*?&)';
    }

    if (isSignUp) {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));

      let displayName = formData.fullName || 'New User';
      let role = formData.role;

      if (!isSignUp) {
        // Demo login logic
        if (formData.email.includes('faculty')) {
          role = 'Faculty';
          displayName = 'Priya Sharma';
        } else if (formData.email.includes('student')) {
          role = 'Student';
          displayName = 'Rohan Mehta';
        } else {
          role = 'Admin';
          displayName = 'Aarav Patel';
        }
      }

      onLogin({
        email: formData.email,
        role,
        name: displayName,
        mobileNumber: formData.mobileNumber
      });
    } finally {
      setLoading(false);
    }
  };

  const setDemoCredentials = (type) => {
    const credentials = {
      admin: { email: 'admin@spms.com', password: 'Admin@123' },
      faculty: { email: 'faculty@spms.com', password: 'Faculty@123' },
      student: { email: 'student@spms.com', password: 'Student@123' }
    };
    const cred = credentials[type] || credentials.admin;
    setFormData(prev => ({ ...prev, email: cred.email, password: cred.password }));
    setErrors({});
  };

  return (
    <div className="login-bg">
      <div className="login-card">
        <div className="login-header">
          <div style={{ fontSize: '40px', marginBottom: '8px' }}>🎓</div>
          <h2>SPMS Portal</h2>
          <p>{isSignUp ? 'Create a new account' : 'Student Project Management System'}</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }} noValidate>
          {isSignUp && (
            <>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  className={`input-control ${errors.fullName ? 'input-error' : ''}`}
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  required
                />
                {errors.fullName && <span className="error-message">❌ {errors.fullName}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Mobile Number *</label>
                <input
                  className={`input-control ${errors.mobileNumber ? 'input-error' : ''}`}
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  placeholder="+91-9876543210"
                  required
                />
                {errors.mobileNumber && <span className="error-message">❌ {errors.mobileNumber}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">System Role *</label>
                <select
                  className="input-control"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  style={{ height: '45px', padding: '10px 16px' }}
                >
                  <option value="Student">Student</option>
                  <option value="Faculty">Faculty</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input
              className={`input-control ${errors.email ? 'input-error' : ''}`}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="name@spms.com"
              required
            />
            {errors.email && <span className="error-message">❌ {errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Password *</label>
            <input
              className={`input-control ${errors.password ? 'input-error' : ''}`}
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="••••••••"
              required
            />
            {errors.password && <span className="error-message">❌ {errors.password}</span>}
            {isSignUp && (
              <small style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '4px', display: 'block' }}>
                💡 Must contain: Uppercase, lowercase, digit, special char (@$!%*?&)
              </small>
            )}
          </div>

          {isSignUp && (
            <div className="form-group">
              <label className="form-label">Confirm Password *</label>
              <input
                className={`input-control ${errors.confirmPassword ? 'input-error' : ''}`}
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="••••••••"
                required
              />
              {errors.confirmPassword && <span className="error-message">❌ {errors.confirmPassword}</span>}
            </div>
          )}

          <button
            className="btn"
            style={{ width: '100%', padding: '12px', marginTop: '6px', opacity: loading ? 0.7 : 1 }}
            type="submit"
            disabled={loading}
          >
            {loading ? '⏳ Processing...' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <button
            type="button"
            className="btn btn-sm btn-outline"
            style={{ border: 'none', background: 'transparent', color: 'var(--primary)', cursor: 'pointer', fontWeight: '600' }}
            onClick={() => {
              setIsSignUp(!isSignUp);
              setErrors({});
              if (!isSignUp) {
                setFormData(prev => ({
                  ...prev,
                  fullName: '',
                  mobileNumber: '',
                  confirmPassword: '',
                  email: '',
                  password: ''
                }));
              } else {
                setFormData(prev => ({
                  ...prev,
                  email: 'admin@spms.com',
                  password: 'admin123'
                }));
              }
            }}
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>

        {!isSignUp && (
          <div style={{ marginTop: '20px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
            <div style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '12px', fontWeight: '700', letterSpacing: '0.05em' }}>
              DEMO SIGN IN CREDENTIALS
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <button
                className={`btn btn-sm ${formData.email === 'admin@spms.com' ? '' : 'btn-outline'}`}
                onClick={() => setDemoCredentials('admin')}
                type="button"
              >
                Admin
              </button>
              <button
                className={`btn btn-sm ${formData.email === 'faculty@spms.com' ? '' : 'btn-outline'}`}
                onClick={() => setDemoCredentials('faculty')}
                type="button"
              >
                Faculty
              </button>
              <button
                className={`btn btn-sm ${formData.email === 'student@spms.com' ? '' : 'btn-outline'}`}
                onClick={() => setDemoCredentials('student')}
                type="button"
              >
                Student
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
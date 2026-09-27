import React, { useState } from 'react';
import apiService from '../services/apiService';

export default function Login({ onLogin }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: 'admin@spms.com',
    password: 'Admin@123',
    confirmPassword: '',
    mobileNumber: '9876543210',
    role: 'Admin',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [apiSuccess, setApiSuccess] = useState('');

  // Clear stale token on login screen mount
  React.useEffect(() => {
    apiService.setToken(null);
    localStorage.removeItem('spms_user');
  }, []);

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
    const regex = /^[0-9+\-() ]{10,15}$/;
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
        newErrors.fullName = 'Full name must be 2-150 characters (letters and spaces only)';
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
      newErrors.password = 'Password must be 8+ chars with uppercase, lowercase, digit, and special char (@$!%*?&)';
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
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setApiError('');
    setApiSuccess('');

    try {
      if (isSignUp) {
        // Register API call
        const registerData = {
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          password: formData.password,
          mobileNumber: formData.mobileNumber.trim(),
          roleName: formData.role || 'Student',
          profilePicturePath: '/images/default-avatar.png',
        };

        const res = await apiService.auth.register(registerData);
        if (res.token) {
          apiService.setToken(res.token);
          setApiSuccess('Registration successful! Logging you in...');
          setTimeout(() => {
            onLogin({
              userId: res.user?.userId,
              name: res.user?.fullName || formData.fullName,
              email: res.user?.email || formData.email,
              role: res.user?.role || formData.role || 'Student',
              roles: res.user?.roles || [formData.role || 'Student'],
              mobileNumber: res.user?.mobileNumber || formData.mobileNumber,
              profilePicturePath: res.user?.profilePicturePath || '/images/default-avatar.png',
            });
          }, 800);
        } else {
          setApiSuccess('Registration complete! Please sign in.');
          setIsSignUp(false);
        }
      } else {
        // Login API call
        const res = await apiService.auth.login({
          email: formData.email.trim(),
          password: formData.password,
        });

        const token = res.token || res.Token;
        if (token) {
          apiService.setToken(token);
        }

        const loggedInUser = {
          userId: res.user?.userId || 1,
          name: res.user?.fullName || formData.email.split('@')[0],
          email: res.user?.email || formData.email,
          role: res.user?.role || res.user?.roles?.[0] || 'Student',
          roles: res.user?.roles || [res.user?.role || 'Student'],
          mobileNumber: res.user?.mobileNumber || '',
          profilePicturePath: res.user?.profilePicturePath || '/images/default-avatar.png',
        };

        onLogin(loggedInUser);
      }
    } catch (err) {
      console.warn('API Authentication Error:', err);
      // If backend is offline or returned an error, show clear message
      const isNetworkError = err.message && (err.message.includes('Failed to fetch') || err.message.includes('NetworkError') || err.message.includes('connection'));
      if (isNetworkError) {
        setApiError('Unable to connect to backend server. Make sure ASP.NET Core backend is running.');
      } else {
        setApiError(err.message || 'Authentication failed. Please verify credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOfflineDemoLogin = (roleType) => {
    const demos = {
      Admin: {
        userId: 1,
        name: 'Aarav Patel (Admin Demo)',
        email: 'admin@spms.com',
        role: 'Admin',
        roles: ['Admin'],
        mobileNumber: '9876543210',
      },
      Faculty: {
        userId: 2,
        name: 'Prof. Priya Sharma (Faculty Demo)',
        email: 'faculty@spms.com',
        role: 'Faculty',
        roles: ['Faculty'],
        mobileNumber: '9876543211',
      },
      Student: {
        userId: 3,
        name: 'Rohan Mehta (Student Demo)',
        email: 'student@spms.com',
        role: 'Student',
        roles: ['Student'],
        mobileNumber: '9876543212',
      },
    };
    onLogin(demos[roleType] || demos.Admin);
  };

  const setDemoCredentials = (type) => {
    const credentials = {
      admin: { email: 'admin@spms.com', password: 'Admin@123', role: 'Admin' },
      faculty: { email: 'faculty@spms.com', password: 'Faculty@123', role: 'Faculty' },
      student: { email: 'student@spms.com', password: 'Student@123', role: 'Student' },
    };
    const cred = credentials[type] || credentials.admin;
    setFormData((prev) => ({
      ...prev,
      email: cred.email,
      password: cred.password,
      role: cred.role,
    }));
    setErrors({});
    setApiError('');
  };

  return (
    <div className="login-bg">
      <div className="login-card">
        <div className="login-header">
          <div style={{ fontSize: '42px', marginBottom: '8px' }}>🎓</div>
          <h2>SPMS Portal</h2>
          <p>{isSignUp ? 'Create your SPMS Account' : 'Student Project Management System'}</p>
        </div>

        {apiError && (
          <div className="alert alert-error" style={{ fontSize: '13px', marginBottom: '16px' }}>
            <span>⚠️</span>
            <div style={{ flex: 1 }}>{apiError}</div>
          </div>
        )}

        {apiSuccess && (
          <div className="alert alert-success" style={{ fontSize: '13px', marginBottom: '16px' }}>
            <span>✅</span>
            <div style={{ flex: 1 }}>{apiSuccess}</div>
          </div>
        )}

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
                  placeholder="e.g. Aarav Patel"
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
                  placeholder="e.g. 9876543210"
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
              placeholder="e.g. admin@spms.com"
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
                💡 8+ characters, uppercase, lowercase, digit, and special char (@$!%*?&)
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
            {loading ? '⏳ Authenticating...' : isSignUp ? 'Create SPMS Account' : 'Sign In with Backend API'}
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
              setApiError('');
              setApiSuccess('');
              if (!isSignUp) {
                setFormData((prev) => ({
                  ...prev,
                  fullName: '',
                  mobileNumber: '',
                  confirmPassword: '',
                  role: 'Student',
                }));
              } else {
                setFormData((prev) => ({
                  ...prev,
                  email: 'admin@spms.com',
                  password: 'Admin@123',
                }));
              }
            }}
          >
            {isSignUp ? 'Already registered? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>

        {!isSignUp && (
          <div style={{ marginTop: '20px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
            <div style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '10px', fontWeight: '700', letterSpacing: '0.05em' }}>
              FILL DEMO CREDENTIALS
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '14px' }}>
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

            {apiError && (
              <div style={{ textAlign: 'center', paddingTop: '6px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                  Backend offline? Launch in Offline Preview mode:
                </span>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={() => handleOfflineDemoLogin('Admin')}
                    type="button"
                    style={{ fontSize: '11px' }}
                  >
                    Enter as Admin
                  </button>
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={() => handleOfflineDemoLogin('Faculty')}
                    type="button"
                    style={{ fontSize: '11px' }}
                  >
                    Enter as Faculty
                  </button>
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={() => handleOfflineDemoLogin('Student')}
                    type="button"
                    style={{ fontSize: '11px' }}
                  >
                    Enter as Student
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
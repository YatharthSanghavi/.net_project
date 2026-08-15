import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('admin@spms.com');
  const [password, setPassword] = useState('admin123');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [signupRole, setSignupRole] = useState('Student');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignUp) {
      if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
      onLogin({ email, role: signupRole, name: name || 'New User' });
    } else {
      let role = 'Admin';
      let displayName = 'Aarav Patel';
      if (email.includes('faculty')) { role = 'Faculty'; displayName = 'Priya Sharma'; }
      else if (email.includes('student')) { role = 'Student'; displayName = 'Rohan Mehta'; }
      onLogin({ email, role, name: displayName });
    }
  };

  return (
    <div className="login-bg">
      <div className="login-card">
        <div className="login-header">
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎓</div>
          <h2>SPMS Portal</h2>
          <p>{isSignUp ? 'Create a new account' : 'Student Project Management System'}</p>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {isSignUp && (
            <>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input 
                  className="input-control" 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Rohan Mehta"
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">System Role</label>
                <select 
                  className="input-control"
                  value={signupRole}
                  onChange={(e) => setSignupRole(e.target.value)}
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
            <label className="form-label">Email Address</label>
            <input 
              className="input-control" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="name@spms.com"
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              className="input-control" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••"
              required 
            />
          </div>

          {isSignUp && (
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input 
                className="input-control" 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                placeholder="••••••••"
                required 
              />
            </div>
          )}

          <button className="btn" style={{ width: '100%', padding: '12px', marginTop: '6px' }} type="submit">
            {isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <button 
            type="button"
            className="btn btn-sm btn-outline"
            style={{ border: 'none', background: 'transparent', color: 'var(--primary)', cursor: 'pointer', fontWeight: '600' }}
            onClick={() => {
              setIsSignUp(!isSignUp);
              // Clear fields
              setName('');
              setConfirmPassword('');
              if (!isSignUp) {
                setEmail('');
                setPassword('');
              } else {
                setEmail('admin@spms.com');
                setPassword('admin123');
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
                className={`btn btn-sm ${email === 'admin@spms.com' ? '' : 'btn-outline'}`} 
                onClick={() => { setEmail('admin@spms.com'); setPassword('admin123'); }}
              >
                Admin
              </button>
              <button 
                className={`btn btn-sm ${email === 'faculty@spms.com' ? '' : 'btn-outline'}`} 
                onClick={() => { setEmail('faculty@spms.com'); setPassword('faculty123'); }}
              >
                Faculty
              </button>
              <button 
                className={`btn btn-sm ${email === 'student@spms.com' ? '' : 'btn-outline'}`} 
                onClick={() => { setEmail('student@spms.com'); setPassword('student123'); }}
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

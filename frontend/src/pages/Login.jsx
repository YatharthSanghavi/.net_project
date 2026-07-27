import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('admin@spms.com');
  const [password, setPassword] = useState('admin123');

  const handleSubmit = (e) => {
    e.preventDefault();
    let role = 'Admin';
    let name = 'Aarav Patel';
    if (email.includes('faculty')) { role = 'Faculty'; name = 'Dr. Priya Sharma'; }
    else if (email.includes('student')) { role = 'Student'; name = 'Rohan Mehta'; }
    onLogin({ email, role, name });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#4f46e5' }}>
      <div className="card" style={{ width: '360px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '10px' }}>🎓 SPMS Login</h2>
        <form onSubmit={handleSubmit}>
          <input className="btn" style={{ width: '100%', background: '#fff', color: '#000', marginBottom: '10px' }} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className="btn" style={{ width: '100%', background: '#fff', color: '#000', marginBottom: '10px' }} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button className="btn" style={{ width: '100%' }} type="submit">Sign In</button>
        </form>
        <div style={{ marginTop: '15px', display: 'flex', gap: '5px', justifyContent: 'center' }}>
          <button className="btn" onClick={() => setEmail('admin@spms.com')}>Admin</button>
          <button className="btn" onClick={() => setEmail('faculty@spms.com')}>Faculty</button>
          <button className="btn" onClick={() => setEmail('student@spms.com')}>Student</button>
        </div>
      </div>
    </div>
  );
}

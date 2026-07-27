import React from 'react';

export default function Header({ user, onLogout, onNavigate }) {
  return (
    <header className="header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer' }} onClick={() => onNavigate('dashboard')}>
        🎓 SPMS Admin
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <span>👤 {user ? user.name : 'Aarav Patel'} ({user ? user.role : 'Admin'})</span>
        <button className="btn" style={{ background: '#dc2626' }} onClick={onLogout}>Logout</button>
      </div>
    </header>
  );
}

import React from 'react';

export default function Header({ user, onLogout, onNavigate }) {
  return (
    <header className="header">
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          cursor: 'pointer',
          userSelect: 'none'
        }} 
        onClick={() => onNavigate('dashboard')}
      >
        <span style={{ 
          background: 'linear-gradient(135deg, var(--primary) 0%, #06b6d4 100%)', 
          color: '#fff', 
          padding: '8px 12px', 
          borderRadius: 'var(--radius-md)',
          fontSize: '18px',
          fontWeight: 'bold',
          boxShadow: '0 4px 6px rgba(13, 148, 136, 0.15)'
        }}>
          🎓
        </span>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontWeight: '700', fontSize: '16px', color: 'var(--text-main)', letterSpacing: '-0.01em' }}>SPMS Portal</span>
          <span className="header-tagline" style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '500' }}>Student Project Management</span>
        </div>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div className="header-user-badge" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px', 
          background: 'var(--bg-base)', 
          padding: '6px 14px', 
          borderRadius: '50px',
          border: '1px solid var(--border)'
        }}>
          <span style={{ fontSize: '14px' }}>👤</span>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: '1.2' }}>
            <span className="header-username" style={{ fontWeight: '600', fontSize: '13px', color: 'var(--text-main)' }}>{user ? user.name : 'Aarav Patel'}</span>
            <span style={{ fontSize: '10px', color: 'var(--primary)', fontWeight: '700', textTransform: 'uppercase' }}>{user ? user.role : 'Admin'}</span>
          </div>
        </div>
        
        <button 
          className="btn btn-sm btn-danger" 
          onClick={onLogout}
          style={{ padding: '8px 16px', borderRadius: '50px' }}
        >
          Logout
        </button>
      </div>
    </header>
  );
}

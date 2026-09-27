import React, { useState } from 'react';
import apiService from '../services/apiService';

export default function Header({ user, onLogout, onNavigate, showToast }) {
  const [showConfig, setShowConfig] = useState(false);
  const [apiUrl, setApiUrl] = useState(apiService.getBaseUrl());

  const handleSaveApiUrl = (e) => {
    e.preventDefault();
    apiService.setBaseUrl(apiUrl);
    setShowConfig(false);
    if (showToast) showToast('Backend API URL saved! Reloading data...', 'info');
    window.location.reload();
  };

  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case 'Admin':
        return { background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5' };
      case 'Faculty':
        return { background: '#d1fae5', color: '#065f46', border: '1px solid #a7f3d0' };
      case 'Student':
        return { background: '#ecfeff', color: '#0e7490', border: '1px solid #a5f3fc' };
      default:
        return { background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1' };
    }
  };

  return (
    <>
      <header className="header">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            userSelect: 'none',
          }}
          onClick={() => onNavigate('dashboard')}
        >
          <span
            style={{
              background: 'linear-gradient(135deg, var(--primary) 0%, #06b6d4 100%)',
              color: '#fff',
              padding: '8px 12px',
              borderRadius: 'var(--radius-md)',
              fontSize: '18px',
              fontWeight: 'bold',
              boxShadow: '0 4px 6px rgba(13, 148, 136, 0.15)',
            }}
          >
            🎓
          </span>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: '800', fontSize: '17px', color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
              SPMS Portal
            </span>
            <span className="header-tagline" style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '500' }}>
              Student Project Management System
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Quick API URL Config Button */}
          <button
            type="button"
            className="btn btn-sm btn-outline"
            style={{ padding: '6px 12px', fontSize: '11px', borderRadius: '50px' }}
            onClick={() => setShowConfig(true)}
            title="Configure Backend API endpoint"
          >
            🔌 API: {apiUrl.replace(/^https?:\/\//, '')}
          </button>

          <div
            className="header-user-badge"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'var(--bg-base)',
              padding: '6px 14px',
              borderRadius: '50px',
              border: '1px solid var(--border)',
            }}
          >
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'var(--primary)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '12px',
              }}
            >
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: '1.2' }}>
              <span className="header-username" style={{ fontWeight: '700', fontSize: '13px', color: 'var(--text-main)' }}>
                {user ? user.name : 'User'}
              </span>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: '700',
                  padding: '1px 6px',
                  borderRadius: '10px',
                  marginTop: '2px',
                  ...getRoleBadgeStyle(user?.role),
                }}
              >
                {user?.role || 'Student'}
              </span>
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

      {/* Backend API Configuration Modal */}
      {showConfig && (
        <div className="modal-overlay" onClick={() => setShowConfig(false)}>
          <div className="modal" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ margin: 0 }}>🔌 Backend API Endpoint</h3>
              <button
                type="button"
                onClick={() => setShowConfig(false)}
                style={{ background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveApiUrl}>
              <div className="form-group">
                <label className="form-label">API Base URL</label>
                <input
                  className="input-control"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  placeholder="e.g. /api or http://localhost:5097/api"
                  required
                />
                <small style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '4px' }}>
                  Default is <code>/api</code> (proxied to port 5097) or <code>http://localhost:5097/api</code> / <code>https://localhost:7077/api</code>.
                </small>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <button
                  type="button"
                  className="btn btn-sm btn-outline"
                  onClick={() => setApiUrl('/api')}
                >
                  Use /api Proxy
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline"
                  onClick={() => setApiUrl('http://localhost:5097/api')}
                >
                  Port 5097 (HTTP)
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline"
                  onClick={() => setApiUrl('https://localhost:7077/api')}
                >
                  Port 7077 (HTTPS)
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowConfig(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn">
                  Save & Reload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

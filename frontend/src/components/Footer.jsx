import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
      <div style={{ fontWeight: '500' }}>
        © {new Date().getFullYear()} <strong>SPMS Portal</strong> • Student Project Management System
      </div>
      <div style={{ display: 'flex', gap: '12px', fontSize: '12px' }}>
        <span>MCA Sem 3</span>
        <span style={{ color: 'var(--border)' }}>|</span>
        <span>Darshan University</span>
      </div>
    </footer>
  );
}

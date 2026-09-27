import React from 'react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const { type = 'info', message } = toast;

  let bg = '#0d9488';
  let icon = 'ℹ️';
  let color = '#fff';

  if (type === 'success') {
    bg = '#10b981';
    icon = '✅';
  } else if (type === 'error') {
    bg = '#ef4444';
    icon = '❌';
  } else if (type === 'warning') {
    bg = '#f59e0b';
    icon = '⚠️';
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        backgroundColor: bg,
        color: color,
        padding: '14px 20px',
        borderRadius: '10px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
        fontWeight: '600',
        fontSize: '14px',
        maxWidth: '450px',
        animation: 'slideIn 0.25s ease-out',
      }}
    >
      <span style={{ fontSize: '18px' }}>{icon}</span>
      <span style={{ flex: 1, wordBreak: 'break-word' }}>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#fff',
          fontSize: '18px',
          cursor: 'pointer',
          padding: '0 4px',
          lineHeight: '1',
          opacity: 0.8,
        }}
      >
        ×
      </button>
    </div>
  );
}

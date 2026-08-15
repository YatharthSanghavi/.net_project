import React from 'react';

export default function Navbar({ activeScreen, onNavigate }) {
  const items = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'roles', label: 'Manage Roles', icon: '🛡️' },
    { id: 'users', label: 'Manage Users', icon: '👥' },
    { id: 'projects', label: 'Manage Projects', icon: '📁' },
    { id: 'tasks', label: 'Manage Tasks', icon: '📝' },
    { id: 'scores', label: 'Scores & Remarks', icon: '💡' }
  ];

  return (
    <nav className="navbar">
      {items.map((item) => {
        const isActive = activeScreen === item.id || activeScreen.startsWith(item.id + '-');
        return (
          <div
            key={item.id}
            className={isActive ? 'active' : ''}
            onClick={() => onNavigate(item.id)}
            style={{
              transition: 'var(--transition)'
            }}
          >
            <span style={{ fontSize: '15px', opacity: isActive ? 1 : 0.75 }}>{item.icon}</span>
            <span>{item.label}</span>
          </div>
        );
      })}
    </nav>
  );
}

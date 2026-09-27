import React from 'react';

export default function Navbar({ activeScreen, onNavigate, userRole }) {
  const isAdmin = userRole === 'Admin';
  const isFaculty = userRole === 'Faculty';

  const items = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'projects', label: 'Projects', icon: '📁' },
    { id: 'tasks', label: 'Tasks', icon: '📝' },
    { id: 'scores', label: 'Scores & Remarks', icon: '💡' },
  ];

  // Faculty and Admin can view/manage Users
  if (isAdmin || isFaculty) {
    items.push({ id: 'users', label: 'Users', icon: '👥' });
  }

  // Admin exclusive navigation
  if (isAdmin) {
    items.push({ id: 'roles', label: 'Roles', icon: '🛡️' });
    items.push({ id: 'config', label: 'Status & Priority', icon: '⚙️' });
  }

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
              transition: 'var(--transition)',
            }}
          >
            <span style={{ fontSize: '15px', opacity: isActive ? 1 : 0.85 }}>{item.icon}</span>
            <span>{item.label}</span>
          </div>
        );
      })}
    </nav>
  );
}

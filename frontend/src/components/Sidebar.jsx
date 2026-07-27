import React from 'react';

export default function Sidebar({ activeScreen, onNavigate }) {
  const items = [
    { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'week1-3', label: '📋 Week 1-3 Requirements' },
    { id: 'roles', label: '🛡️ Manage Roles' },
    { id: 'users', label: '👥 Manage Users' },
    { id: 'projects', label: '📁 Manage Projects' },
    { id: 'tasks', label: '📋 Manage Tasks' },
    { id: 'scores', label: '💡 Scores & Remarks' }
  ];

  return (
    <aside className="sidebar">
      {items.map((item) => (
        <div
          key={item.id}
          className={activeScreen === item.id || activeScreen.startsWith(item.id + '-') ? 'active' : ''}
          onClick={() => onNavigate(item.id)}
        >
          {item.label}
        </div>
      ))}
    </aside>
  );
}

import React from 'react';

export default function Dashboard({ users, projects, tasks, onNavigate }) {
  return (
    <div>
      <h2>Dashboard</h2>
      <div style={{ display: 'flex', gap: '15px', margin: '15px 0' }}>
        <div className="card" onClick={() => onNavigate('users')} style={{ flex: 1, cursor: 'pointer' }}>
          <h3>👥 {users.length}</h3><div>Total Users</div>
        </div>
        <div className="card" onClick={() => onNavigate('projects')} style={{ flex: 1, cursor: 'pointer' }}>
          <h3>📁 {projects.length}</h3><div>Total Projects</div>
        </div>
        <div className="card" onClick={() => onNavigate('tasks')} style={{ flex: 1, cursor: 'pointer' }}>
          <h3>📋 {tasks.length}</h3><div>Total Tasks</div>
        </div>
      </div>
      <div className="card">
        <h3>Active Projects Overview</h3>
        <table className="table">
          <thead>
            <tr><th>#</th><th>Project Title</th><th>Status</th><th>Faculty</th></tr>
          </thead>
          <tbody>
            {projects.map((p, i) => (
              <tr key={p.id}>
                <td>{i + 1}</td><td><strong>{p.title}</strong></td><td>{p.status}</td><td>{p.facultyName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

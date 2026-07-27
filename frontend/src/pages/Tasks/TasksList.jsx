import React, { useState } from 'react';

export default function TasksList({ tasks, onDelete, onEdit, onAdd, onUpdateStatus }) {
  const [search, setSearch] = useState('');
  const filtered = tasks.filter(t => t.title.toLowerCase().includes(search.toLowerCase()) || (t.assignedTo && t.assignedTo.toLowerCase().includes(search.toLowerCase())));

  return (
    <div>
      <h2>Manage Tasks</h2>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <input className="btn" style={{ background: '#fff', color: '#000' }} placeholder="Search task or student..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <button className="btn" onClick={onAdd}>+ Add Task</button>
        </div>
        <table className="table">
          <thead>
            <tr><th>#</th><th>Task Title</th><th>Project</th><th>Priority</th><th>Status</th><th>Assigned Student</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.map((t, i) => (
              <tr key={t.id}>
                <td>{i + 1}</td><td><strong>{t.title}</strong></td><td>{t.projectTitle}</td><td>{t.priority}</td>
                <td>
                  <select className="btn" style={{ background: '#fff', color: '#000', padding: '2px 4px' }} value={t.status} onChange={(e) => onUpdateStatus(t.id, e.target.value)}>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </td>
                <td>🎓 {t.assignedTo}</td>
                <td>
                  <button className="btn" onClick={() => onEdit(t)}>Edit</button>
                  <button className="btn" style={{ background: '#dc2626' }} onClick={() => onDelete(t.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

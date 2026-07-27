import React, { useState } from 'react';

export default function ProjectsList({ projects, onDelete, onEdit, onAdd }) {
  const [search, setSearch] = useState('');
  const filtered = projects.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <h2>Manage Projects</h2>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <input className="btn" style={{ background: '#fff', color: '#000' }} placeholder="Search project..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <button className="btn" onClick={onAdd}>+ Add Project</button>
        </div>
        <table className="table">
          <thead>
            <tr><th>#</th><th>Title</th><th>Status</th><th>Faculty</th><th>Assigned Students</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <tr key={p.id}>
                <td>{i + 1}</td><td><strong>{p.title}</strong></td><td>{p.status}</td><td>{p.facultyName}</td>
                <td>{p.assignedStudents ? p.assignedStudents.join(', ') : 'None'}</td>
                <td>
                  <button className="btn" onClick={() => onEdit(p)}>Edit</button>
                  <button className="btn" style={{ background: '#dc2626' }} onClick={() => onDelete(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

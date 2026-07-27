import React, { useState } from 'react';

export default function RolesList({ roles, onDelete, onEdit, onAdd }) {
  const [search, setSearch] = useState('');
  const filtered = roles.filter(r => r.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <h2>Manage Roles</h2>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <input className="btn" style={{ background: '#fff', color: '#000' }} placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <button className="btn" onClick={onAdd}>+ Add Role</button>
        </div>
        <table className="table">
          <thead>
            <tr><th>#</th><th>Role Name</th><th>Description</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={r.id}>
                <td>{i + 1}</td><td><strong>{r.name}</strong></td><td>{r.description}</td>
                <td>
                  <button className="btn" onClick={() => onEdit(r)}>Edit</button>
                  <button className="btn" style={{ background: '#dc2626' }} onClick={() => onDelete(r.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

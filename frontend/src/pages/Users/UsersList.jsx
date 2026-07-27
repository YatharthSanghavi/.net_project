import React, { useState } from 'react';

export default function UsersList({ users, roles, onDelete, onEdit, onAdd }) {
  const [search, setSearch] = useState('');
  const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <h2>Manage Users</h2>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <input className="btn" style={{ background: '#fff', color: '#000' }} placeholder="Search user..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <button className="btn" onClick={onAdd}>+ Add User</button>
        </div>
        <table className="table">
          <thead>
            <tr><th>#</th><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.map((u, i) => (
              <tr key={u.id}>
                <td>{i + 1}</td><td><strong>{u.name}</strong></td><td>{u.email}</td><td>{u.role}</td><td>{u.status}</td>
                <td>
                  <button className="btn" onClick={() => onEdit(u)}>Edit</button>
                  <button className="btn" style={{ background: '#dc2626' }} onClick={() => onDelete(u.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

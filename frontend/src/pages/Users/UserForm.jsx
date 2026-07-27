import React, { useState } from 'react';

export default function UserForm({ initialData, roles, onSave, onCancel }) {
  const [name, setName] = useState(initialData ? initialData.name : '');
  const [email, setEmail] = useState(initialData ? initialData.email : '');
  const [mobile, setMobile] = useState(initialData ? initialData.mobile || '' : '');
  const [role, setRole] = useState(initialData ? initialData.role : 'Student');
  const [status, setStatus] = useState(initialData ? initialData.status : 'Active');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ id: initialData ? initialData.id : Date.now(), name, email, mobile, role, status });
  };

  return (
    <div className="card" style={{ maxWidth: '500px' }}>
      <h2>{initialData ? 'Edit User' : 'Add User'}</h2>
      <form onSubmit={handleSubmit} style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <input className="btn" style={{ background: '#fff', color: '#000' }} placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input className="btn" style={{ background: '#fff', color: '#000' }} placeholder="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="btn" style={{ background: '#fff', color: '#000' }} placeholder="Mobile Number" value={mobile} onChange={(e) => setMobile(e.target.value)} />
        <label>Role:</label>
        <select className="btn" style={{ background: '#fff', color: '#000' }} value={role} onChange={(e) => setRole(e.target.value)}>
          {roles.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
        </select>
        <label>Status:</label>
        <select className="btn" style={{ background: '#fff', color: '#000' }} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Active">Active</option><option value="Inactive">Inactive</option>
        </select>
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button className="btn" type="submit">Save User</button>
          <button className="btn" style={{ background: '#6b7280' }} type="button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

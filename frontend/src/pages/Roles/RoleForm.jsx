import React, { useState } from 'react';

export default function RoleForm({ initialData, onSave, onCancel }) {
  const [name, setName] = useState(initialData ? initialData.name : '');
  const [desc, setDesc] = useState(initialData ? initialData.description : '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ id: initialData ? initialData.id : Date.now(), name, description: desc });
  };

  return (
    <div className="card" style={{ maxWidth: '500px' }}>
      <h2>{initialData ? 'Edit Role' : 'Add Role'}</h2>
      <form onSubmit={handleSubmit} style={{ marginTop: '10px' }}>
        <input className="btn" style={{ width: '100%', background: '#fff', color: '#000', marginBottom: '10px' }} placeholder="Role Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <textarea className="btn" style={{ width: '100%', background: '#fff', color: '#000', marginBottom: '10px', height: '80px' }} placeholder="Description" value={desc} onChange={(e) => setDesc(e.target.value)} />
        <button className="btn" type="submit">Save</button>
        <button className="btn" style={{ background: '#6b7280' }} type="button" onClick={onCancel}>Cancel</button>
      </form>
    </div>
  );
}

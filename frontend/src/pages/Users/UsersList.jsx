import React, { useState } from 'react';

export default function UsersList({ users, roles }) {
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Multi-field filtration logic
  const filtered = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || 
                          u.email.toLowerCase().includes(search.toLowerCase()) ||
                          (u.mobile && u.mobile.includes(search));
    const matchesRole = selectedRole === 'All' || u.role === selectedRole;
    const matchesStatus = selectedStatus === 'All' || u.status === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleBadge = (role) => {
    switch (role) {
      case 'Admin': return <span className="badge badge-danger">Admin</span>;
      case 'Faculty': return <span className="badge badge-success">Faculty</span>;
      case 'Student': return <span className="badge badge-info">Student</span>;
      default: return <span className="badge">{role}</span>;
    }
  };

  const getStatusBadge = (status) => {
    return status === 'Active' 
      ? <span className="badge badge-success" style={{ background: '#d1fae5', color: '#065f46' }}>Active</span>
      : <span className="badge badge-danger" style={{ background: '#fee2e2', color: '#991b1b' }}>Inactive</span>;
  };

  return (
    <div className="content-wrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h2>User Accounts Management</h2>
          <p style={{ margin: 0 }}>Audit system users, assigned roles, contact details, and account status states.</p>
        </div>
      </div>

      <div className="card">
        {/* Multi-field search & filters */}
        <div className="search-container" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', width: '100%' }}>
          <div className="search-input-wrapper" style={{ flex: 2, minWidth: '220px' }}>
            <span className="search-icon">🔍</span>
            <input 
              className="input-control" 
              placeholder="Search by name, email, or mobile..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
            />
          </div>

          <div style={{ flex: 1, minWidth: '130px' }}>
            <select 
              className="input-control" 
              value={selectedRole} 
              onChange={(e) => setSelectedRole(e.target.value)}
              style={{ background: '#fff' }}
            >
              <option value="All">All Roles</option>
              {roles.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
            </select>
          </div>

          <div style={{ flex: 1, minWidth: '130px' }}>
            <select 
              className="input-control" 
              value={selectedStatus} 
              onChange={(e) => setSelectedStatus(e.target.value)}
              style={{ background: '#fff' }}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>#</th>
                <th>Full Name</th>
                <th>Contact Details</th>
                <th>Assigned Role</th>
                <th>Account Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((u, i) => (
                  <tr key={u.id}>
                    <td>{i + 1}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '18px' }}>👤</span>
                        <strong>{u.name}</strong>
                      </div>
                    </td>
                    <td>
                      <div>{u.email}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>📞 {u.mobile || 'N/A'}</div>
                    </td>
                    <td>{getRoleBadge(u.role)}</td>
                    <td>{getStatusBadge(u.status)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                    No users found matching the filter selections.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

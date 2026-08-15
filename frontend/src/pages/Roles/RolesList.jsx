import React, { useState } from 'react';

export default function RolesList({ roles }) {
  const [search, setSearch] = useState('');
  const filtered = roles.filter(r => r.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="content-wrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h2>Access Roles Management</h2>
          <p style={{ margin: 0 }}>Define system access levels and permissions for administrators, faculty supervisors, and students.</p>
        </div>
      </div>

      <div className="card">
        <div className="search-container">
          <div className="search-input-wrapper" style={{ maxWidth: '300px' }}>
            <span className="search-icon">🔍</span>
            <input 
              className="input-control" 
              placeholder="Search roles..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
            />
          </div>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>#</th>
                <th style={{ width: '250px' }}>Role Title</th>
                <th>Access & Permissions Description</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((r, i) => (
                  <tr key={r.id}>
                    <td>{i + 1}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '16px' }}>🛡️</span>
                        <strong>{r.name}</strong>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-muted)' }}>{r.description}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                    No roles found matching the search criteria.
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

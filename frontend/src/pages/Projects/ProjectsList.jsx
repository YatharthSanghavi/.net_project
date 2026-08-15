import React, { useState } from 'react';

export default function ProjectsList({ projects }) {
  const [search, setSearch] = useState('');
  const filtered = projects.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed': return <span className="badge badge-success">Completed</span>;
      case 'In Progress': return <span className="badge badge-warning">In Progress</span>;
      case 'Not Started': return <span className="badge badge-info">Not Started</span>;
      default: return <span className="badge">{status}</span>;
    }
  };

  return (
    <div className="content-wrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h2>Academic Projects</h2>
          <p style={{ margin: 0 }}>Supervise active research groups, milestone tracking, and assign faculty coordinators.</p>
        </div>
      </div>

      <div className="card">
        <div className="search-container">
          <div className="search-input-wrapper" style={{ maxWidth: '300px' }}>
            <span className="search-icon">🔍</span>
            <input 
              className="input-control" 
              placeholder="Search by project title..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
            />
          </div>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>#</th>
                <th>Project Details</th>
                <th>Project Status</th>
                <th>Faculty Guide</th>
                <th>Assigned Students</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((p, i) => (
                  <tr key={p.id}>
                    <td>{i + 1}</td>
                    <td>
                      <div style={{ fontWeight: '700', fontSize: '15px' }}>{p.title}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {p.description || 'No description provided.'}
                      </div>
                      <div style={{ display: 'flex', gap: '10px', fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
                        <span>📅 Start: {p.startDate || 'N/A'}</span>
                        <span>•</span>
                        <span>📅 End: {p.endDate || 'N/A'}</span>
                      </div>
                    </td>
                    <td>{getStatusBadge(p.status)}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>👩‍🏫</span>
                        <span>{p.facultyName}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {p.assignedStudents && p.assignedStudents.length > 0 ? (
                          p.assignedStudents.map((std, idx) => (
                            <span 
                              key={idx} 
                              className="badge badge-info"
                              style={{ background: 'rgba(59, 130, 246, 0.08)', color: '#1d4ed8', border: '1px solid rgba(59, 130, 246, 0.15)' }}
                            >
                              🎓 {std}
                            </span>
                          ))
                        ) : (
                          <span style={{ fontSize: '12px', fontStyle: 'italic', color: 'var(--text-muted)' }}>Unassigned</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                    No projects found matching the search criteria.
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

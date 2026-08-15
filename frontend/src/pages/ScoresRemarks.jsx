import React, { useState } from 'react';

export default function ScoresRemarks({ tasks }) {
  const [search, setSearch] = useState('');
  
  const filtered = tasks.filter(t => 
    t.assignedTo.toLowerCase().includes(search.toLowerCase()) || 
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed': return <span className="badge badge-success">Completed</span>;
      case 'In Progress': return <span className="badge badge-warning">In Progress</span>;
      case 'Pending': return <span className="badge badge-info">Pending</span>;
      default: return <span className="badge badge-danger">{status}</span>;
    }
  };

  return (
    <div className="content-wrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h2>Evaluation Scores & Remarks</h2>
          <p style={{ margin: 0 }}>View academic scores and supervisor feedback on student project tasks.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input 
            className="input-control" 
            style={{ width: '250px' }} 
            placeholder="Search student or task..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
          />
        </div>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>#</th>
                <th>Student</th>
                <th>Task Details</th>
                <th>Evaluation Score</th>
                <th>Task Status</th>
                <th>Faculty Supervisor Remarks</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((t, i) => (
                  <tr key={t.id}>
                    <td>{i + 1}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '16px' }}>🎓</span>
                        <strong>{t.assignedTo}</strong>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: '600' }}>{t.title}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Project: {t.projectTitle}</div>
                    </td>
                    <td>
                      <span className="badge badge-success" style={{ padding: '6px 12px', fontSize: '12px', borderRadius: 'var(--radius-sm)' }}>
                        {t.assignedScore || 10} Points
                      </span>
                    </td>
                    <td>{getStatusBadge(t.status)}</td>
                    <td style={{ fontStyle: t.facultyRemarks ? 'normal' : 'italic', color: t.facultyRemarks ? 'var(--text-main)' : 'var(--text-muted)' }}>
                      💬 {t.facultyRemarks || 'Pending feedback'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                    No evaluation records found matching the search criteria.
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

import React, { useState } from 'react';

export default function TasksList({ tasks }) {
  const [search, setSearch] = useState('');
  const filtered = tasks.filter(t => 
    t.title.toLowerCase().includes(search.toLowerCase()) || 
    (t.assignedTo && t.assignedTo.toLowerCase().includes(search.toLowerCase())) ||
    (t.projectTitle && t.projectTitle.toLowerCase().includes(search.toLowerCase()))
  );

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'Critical': return <span className="badge badge-danger" style={{ fontWeight: '700' }}>⚠️ Critical</span>;
      case 'High': return <span className="badge badge-warning" style={{ background: '#fffbeb', color: '#b45309', border: '1px solid #fde68a' }}>High</span>;
      case 'Medium': return <span className="badge badge-info">Medium</span>;
      case 'Low': return <span className="badge" style={{ background: 'var(--bg-base)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>Low</span>;
      default: return <span className="badge">{priority}</span>;
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Completed': return 'badge badge-success';
      case 'In Progress': return 'badge badge-warning';
      case 'Pending': return 'badge badge-info';
      default: return 'badge badge-danger';
    }
  };

  return (
    <div className="content-wrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h2>Allocated Tasks</h2>
          <p style={{ margin: 0 }}>Review task deliverables, priority categories, and monitor student progress.</p>
        </div>
      </div>

      <div className="card">
        <div className="search-container">
          <div className="search-input-wrapper" style={{ maxWidth: '320px' }}>
            <span className="search-icon">🔍</span>
            <input 
              className="input-control" 
              placeholder="Search by title, student, project..." 
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
                <th>Task & Project Details</th>
                <th>Priority</th>
                <th>Progress Status</th>
                <th>Assigned Student</th>
                <th>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((t, i) => (
                  <tr key={t.id}>
                    <td>{i + 1}</td>
                    <td>
                      <div style={{ fontWeight: '700', fontSize: '14.5px' }}>{t.title}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        📁 Project: <strong>{t.projectTitle}</strong>
                      </div>
                    </td>
                    <td>{getPriorityBadge(t.priority)}</td>
                    <td>
                      <span className={getStatusBadgeClass(t.status)}>{t.status}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>🎓</span>
                        <strong>{t.assignedTo}</strong>
                      </div>
                    </td>
                    <td style={{ fontSize: '13px', fontWeight: '500' }}>
                      📅 {t.dueDate || 'N/A'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                    No tasks found matching the search criteria.
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

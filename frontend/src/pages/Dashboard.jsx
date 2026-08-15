import React from 'react';

export default function Dashboard({ users, projects, tasks, onNavigate }) {
  // Calculations for dashboard indicators
  const facultyCount = users.filter(u => u.role === 'Faculty').length;
  const studentCount = users.filter(u => u.role === 'Student').length;
  
  const completedProjects = projects.filter(p => p.status === 'Completed').length;
  const inProgressProjects = projects.filter(p => p.status === 'In Progress').length;
  const notStartedProjects = projects.filter(p => p.status === 'Not Started').length;
  const projectProgressPercent = projects.length ? Math.round((completedProjects / projects.length) * 100) : 0;

  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const pendingTasks = tasks.filter(t => t.status === 'Pending').length;
  const activeTasks = tasks.filter(t => t.status === 'In Progress').length;
  const taskProgressPercent = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0;

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Completed': return 'badge badge-success';
      case 'In Progress': return 'badge badge-warning';
      case 'Not Started': return 'badge badge-info';
      default: return 'badge badge-danger';
    }
  };

  return (
    <div className="content-wrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2>System Dashboard</h2>
          <p style={{ margin: 0 }}>Overview of student project submissions, tasks allocation, and evaluation stats.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-sm btn-outline" onClick={() => onNavigate('projects')}>
            📂 View Projects
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="metrics-grid">
        <div className="metric-card" onClick={() => onNavigate('users')}>
          <div className="metric-info">
            <h3>{users.length}</h3>
            <div>Total Users</div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              👥 {studentCount} Students • {facultyCount} Faculty
            </span>
          </div>
          <div className="metric-icon">👥</div>
        </div>

        <div className="metric-card" onClick={() => onNavigate('projects')}>
          <div className="metric-info">
            <h3>{projects.length}</h3>
            <div>Total Projects</div>
            <div className="progress-bar-container" style={{ width: '120px' }}>
              <div className="progress-bar" style={{ width: `${projectProgressPercent}%` }}></div>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
              {projectProgressPercent}% Completed ({completedProjects}/{projects.length}) • {inProgressProjects} Active • {notStartedProjects} New
            </span>
          </div>
          <div className="metric-icon" style={{ color: '#10b981', background: 'var(--success-light)' }}>📁</div>
        </div>

        <div className="metric-card" onClick={() => onNavigate('tasks')}>
          <div className="metric-info">
            <h3>{tasks.length}</h3>
            <div>Allocated Tasks</div>
            <div className="progress-bar-container" style={{ width: '120px' }}>
              <div className="progress-bar" style={{ width: `${taskProgressPercent}%`, background: '#3b82f6' }}></div>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
              {completedTasks} Done • {pendingTasks} Pending • {activeTasks} Active
            </span>
          </div>
          <div className="metric-icon" style={{ color: '#3b82f6', background: 'var(--info-light)' }}>📝</div>
        </div>
      </div>

      {/* Overview Panels */}
      <div className="panels-grid" style={{ marginBottom: '24px' }}>
        
        {/* Active Projects Table */}
        <div className="card" style={{ margin: 0 }}>
          <div className="card-title">
            <span>📁 Projects Status Summary</span>
            <button className="btn btn-sm btn-outline" onClick={() => onNavigate('projects')}>View All</button>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Project Title</th>
                  <th>Faculty Guide</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {projects.slice(0, 4).map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ fontWeight: '600' }}>{p.title}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        Students: {p.assignedStudents ? p.assignedStudents.join(', ') : 'None'}
                      </div>
                    </td>
                    <td>{p.facultyName}</td>
                    <td>
                      <span className={getStatusBadgeClass(p.status)}>{p.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Task Evaluation Summary */}
        <div className="card" style={{ margin: 0 }}>
          <div className="card-title">
            <span>📝 Recent Tasks & Remarks</span>
            <button className="btn btn-sm btn-outline" onClick={() => onNavigate('tasks')}>View All</button>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Task Name</th>
                  <th>Assigned To</th>
                  <th>Score</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {tasks.slice(0, 4).map((t) => (
                  <tr key={t.id}>
                    <td style={{ fontWeight: '600' }}>{t.title}</td>
                    <td>🎓 {t.assignedTo}</td>
                    <td>
                      <span className="badge badge-success" style={{ fontWeight: '700' }}>
                        {t.assignedScore} pts
                      </span>
                    </td>
                    <td style={{ fontSize: '12px', fontStyle: 'italic', color: 'var(--text-muted)' }}>
                      {t.facultyRemarks || 'No remarks yet'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

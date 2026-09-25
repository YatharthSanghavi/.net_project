import React, { useState, useEffect } from 'react';

export default function Dashboard({ user, users, projects, tasks, onNavigate }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch dashboard data
    setTimeout(() => {
      const processedData = processDataByRole(user?.role || 'Admin');
      setDashboardData(processedData);
      setLoading(false);
    }, 600);
  }, [user]);

  const processDataByRole = (role) => {
    let filteredProjects = projects || [];
    let filteredTasks = tasks || [];
    let dashboardMetrics = {};

    if (role === 'Faculty') {
      // Show only assigned faculty projects
      filteredProjects = projects?.filter(p => p.facultyName === user?.name) || [];
      filteredTasks = tasks?.filter(t => t.assignedTo === user?.name) || [];
    } else if (role === 'Student') {
      // Show only student's projects
      filteredProjects = projects?.filter(p => p.assignedStudents?.includes(user?.name)) || [];
      filteredTasks = tasks?.filter(t => t.assignedTo === user?.name) || [];
    }

    // Calculate metrics
    const completedProjects = filteredProjects.filter(p => p.status === 'Completed').length;
    const inProgressProjects = filteredProjects.filter(p => p.status === 'In Progress').length;
    const notStartedProjects = filteredProjects.filter(p => p.status === 'Not Started').length;

    const completedTasks = filteredTasks.filter(t => t.status === 'Completed').length;
    const pendingTasks = filteredTasks.filter(t => t.status === 'Pending').length;
    const activeTasks = filteredTasks.filter(t => t.status === 'In Progress').length;
    const rejectedTasks = filteredTasks.filter(t => t.status === 'Rejected').length;

    const totalAssignedScore = filteredTasks.reduce((sum, t) => sum + (t.assignedScore || 0), 0);
    const totalEarnedScore = filteredTasks.reduce((sum, t) => sum + (t.earnedScore || 0), 0);
    const performancePercentage = totalAssignedScore > 0 ? Math.round((totalEarnedScore / totalAssignedScore) * 100) : 0;

    dashboardMetrics = {
      totalProjects: filteredProjects.length,
      completedProjects,
      inProgressProjects,
      notStartedProjects,
      projectProgressPercent: filteredProjects.length ? Math.round((completedProjects / filteredProjects.length) * 100) : 0,
      totalTasks: filteredTasks.length,
      completedTasks,
      pendingTasks,
      activeTasks,
      rejectedTasks,
      taskProgressPercent: filteredTasks.length ? Math.round((completedTasks / filteredTasks.length) * 100) : 0,
      totalUsers: users?.length || 0,
      studentCount: users?.filter(u => u.role === 'Student').length || 0,
      facultyCount: users?.filter(u => u.role === 'Faculty').length || 0,
      totalAssignedScore,
      totalEarnedScore,
      performancePercentage
    };

    return {
      metrics: dashboardMetrics,
      projects: filteredProjects,
      tasks: filteredTasks,
      role
    };
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Completed': return 'badge badge-success';
      case 'In Progress': return 'badge badge-warning';
      case 'Not Started': return 'badge badge-info';
      case 'Pending': return 'badge badge-secondary';
      case 'Rejected': return 'badge badge-danger';
      default: return 'badge badge-muted';
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'High': return 'badge badge-danger';
      case 'Medium': return 'badge badge-warning';
      case 'Low': return 'badge badge-info';
      default: return 'badge badge-secondary';
    }
  };

  if (loading) {
    return (
      <div className="content-wrapper" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
        <h3>Loading Dashboard...</h3>
        <p style={{ color: 'var(--text-muted)' }}>Preparing your personalized view</p>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="content-wrapper">
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <h3>No data available</h3>
        </div>
      </div>
    );
  }

  const { metrics, projects: visibleProjects, tasks: visibleTasks, role } = dashboardData;

  return (
    <div className="content-wrapper">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2>
            {role === 'Admin' && '📊 System Dashboard'}
            {role === 'Faculty' && '👨‍🏫 Faculty Dashboard'}
            {role === 'Student' && '🎓 Student Dashboard'}
          </h2>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)' }}>
            {role === 'Admin' && 'Overview of all student project submissions, tasks allocation, and evaluation stats.'}
            {role === 'Faculty' && 'Your assigned projects and student task evaluations.'}
            {role === 'Student' && 'Your projects, tasks, and performance summary.'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-sm btn-outline" onClick={() => onNavigate('projects')}>
            📂 View Projects
          </button>
          <button className="btn btn-sm btn-outline" onClick={() => onNavigate('tasks')}>
            📝 View Tasks
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="metrics-grid">
        <div className="metric-card" onClick={() => onNavigate('users')}>
          <div className="metric-info">
            <h3>{metrics.totalUsers}</h3>
            <div>Total Users</div>
            {role === 'Admin' && (
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                👥 {metrics.studentCount} Students • {metrics.facultyCount} Faculty
              </span>
            )}
          </div>
          <div className="metric-icon">👥</div>
        </div>

        <div className="metric-card" onClick={() => onNavigate('projects')}>
          <div className="metric-info">
            <h3>{metrics.totalProjects}</h3>
            <div>
              {role === 'Admin' ? 'Total Projects' : role === 'Faculty' ? 'Assigned Projects' : 'My Projects'}
            </div>
            <div className="progress-bar-container" style={{ width: '120px', marginTop: '4px' }}>
              <div className="progress-bar" style={{ width: `${metrics.projectProgressPercent}%` }}></div>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
              {metrics.projectProgressPercent}% Completed
            </span>
          </div>
          <div className="metric-icon" style={{ color: '#10b981', background: 'var(--success-light)' }}>📁</div>
        </div>

        <div className="metric-card" onClick={() => onNavigate('tasks')}>
          <div className="metric-info">
            <h3>{metrics.totalTasks}</h3>
            <div>
              {role === 'Admin' ? 'Allocated Tasks' : role === 'Faculty' ? 'Task Evaluations' : 'My Tasks'}
            </div>
            <div className="progress-bar-container" style={{ width: '120px', marginTop: '4px' }}>
              <div className="progress-bar" style={{ width: `${metrics.taskProgressPercent}%`, background: '#3b82f6' }}></div>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
              {metrics.completedTasks} Done • {metrics.pendingTasks} Pending
            </span>
          </div>
          <div className="metric-icon" style={{ color: '#3b82f6', background: 'var(--info-light)' }}>📝</div>
        </div>

        {(role === 'Student' || role === 'Faculty') && (
          <div className="metric-card">
            <div className="metric-info">
              <h3>{metrics.performancePercentage}%</h3>
              <div>Performance Score</div>
              <div className="progress-bar-container" style={{ width: '120px', marginTop: '4px' }}>
                <div className="progress-bar" style={{
                  width: `${metrics.performancePercentage}%`,
                  background: metrics.performancePercentage >= 75 ? '#10b981' : metrics.performancePercentage >= 50 ? '#f59e0b' : '#ef4444'
                }}></div>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                {metrics.totalEarnedScore} / {metrics.totalAssignedScore} points
              </span>
            </div>
            <div className="metric-icon" style={{ color: '#f59e0b', background: 'var(--warning-light)' }}>⭐</div>
          </div>
        )}
      </div>

      {/* Tabs Navigation */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
        <button
          className={`btn btn-sm ${activeTab === 'overview' ? '' : 'btn-outline'}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button
          className={`btn btn-sm ${activeTab === 'projects' ? '' : 'btn-outline'}`}
          onClick={() => setActiveTab('projects')}
        >
          📁 Projects ({visibleProjects.length})
        </button>
        <button
          className={`btn btn-sm ${activeTab === 'tasks' ? '' : 'btn-outline'}`}
          onClick={() => setActiveTab('tasks')}
        >
          📝 Tasks ({visibleTasks.length})
        </button>
        <button
          className={`btn btn-sm ${activeTab === 'stats' ? '' : 'btn-outline'}`}
          onClick={() => setActiveTab('stats')}
        >
          📈 Statistics
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="panels-grid">
          {/* Project Status Summary */}
          <div className="card">
            <div className="card-title">
              <span>📁 Project Status Summary</span>
              <button className="btn btn-sm btn-outline" onClick={() => onNavigate('projects')}>
                View All
              </button>
            </div>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Project Title</th>
                    <th>{role === 'Admin' ? 'Faculty' : 'Assigned To'}</th>
                    <th>Status</th>
                    <th>Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleProjects.slice(0, 5).map((p) => (
                    <tr key={p.id}>
                      <td style={{ fontWeight: '600' }}>{p.title}</td>
                      <td>{p.facultyName || 'N/A'}</td>
                      <td>
                        <span className={getStatusBadgeClass(p.status)}>{p.status}</span>
                      </td>
                      <td>
                        <div className="progress-bar-container" style={{ width: '80px' }}>
                          <div className="progress-bar" style={{ width: `${p.progressPercentage || 0}%` }}></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {visibleProjects.length === 0 && (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>
                        No projects assigned yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Task Summary */}
          <div className="card">
            <div className="card-title">
              <span>📝 Recent Tasks & Remarks</span>
              <button className="btn btn-sm btn-outline" onClick={() => onNavigate('tasks')}>
                View All
              </button>
            </div>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Task Name</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleTasks.slice(0, 5).map((t) => (
                    <tr key={t.id}>
                      <td style={{ fontWeight: '600' }}>{t.title}</td>
                      <td>
                        <span className={getPriorityBadgeClass(t.priority)}>{t.priority}</span>
                      </td>
                      <td>
                        <span className={getStatusBadgeClass(t.status)}>{t.status}</span>
                      </td>
                      <td>
                        <span style={{ fontWeight: '700' }}>
                          {t.earnedScore || 0} / {t.assignedScore}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {visibleTasks.length === 0 && (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>
                        No tasks assigned yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'projects' && (
        <div className="card">
          <div className="card-title">
            <span>📁 All Projects</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
              Completed: {metrics.completedProjects} | In Progress: {metrics.inProgressProjects} | Not Started: {metrics.notStartedProjects}
            </span>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Project Title</th>
                  <th>Faculty</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                  <th>Progress</th>
                </tr>
              </thead>
              <tbody>
                {visibleProjects.map((p) => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: '600' }}>{p.title}</td>
                    <td>{p.facultyName}</td>
                    <td>{new Date(p.startDate).toLocaleDateString()}</td>
                    <td>{new Date(p.endDate).toLocaleDateString()}</td>
                    <td>
                      <span className={getStatusBadgeClass(p.status)}>{p.status}</span>
                    </td>
                    <td>
                      <div className="progress-bar-container" style={{ width: '100px' }}>
                        <div className="progress-bar" style={{ width: `${p.progressPercentage || 0}%` }}></div>
                      </div>
                      <span style={{ fontSize: '11px' }}>{p.progressPercentage || 0}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'tasks' && (
        <div className="card">
          <div className="card-title">
            <span>📝 All Tasks</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
              Completed: {metrics.completedTasks} | Pending: {metrics.pendingTasks} | In Progress: {metrics.activeTasks}
            </span>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Task Title</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Due Date</th>
                  <th>Score</th>
                  <th>Progress</th>
                </tr>
              </thead>
              <tbody>
                {visibleTasks.map((t) => (
                  <tr key={t.id}>
                    <td style={{ fontWeight: '600' }}>{t.title}</td>
                    <td>
                      <span className={getPriorityBadgeClass(t.priority)}>{t.priority}</span>
                    </td>
                    <td>
                      <span className={getStatusBadgeClass(t.status)}>{t.status}</span>
                    </td>
                    <td>{t.dueDate ? new Date(t.dueDate).toLocaleDateString() : 'N/A'}</td>
                    <td>
                      <span style={{ fontWeight: '700' }}>
                        {t.earnedScore || 0} / {t.assignedScore}
                      </span>
                    </td>
                    <td>
                      <div className="progress-bar-container" style={{ width: '100px' }}>
                        <div className="progress-bar" style={{
                          width: `${t.assignedScore > 0 ? (t.earnedScore || 0) / t.assignedScore * 100 : 0}%`
                        }}></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'stats' && (
        <div className="panels-grid">
          <div className="card">
            <div className="card-title">📊 Project Statistics</div>
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                <div style={{ padding: '12px', background: 'var(--bg-hover)', borderRadius: '8px' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '4px' }}>Completed</div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#10b981' }}>{metrics.completedProjects}</div>
                </div>
                <div style={{ padding: '12px', background: 'var(--bg-hover)', borderRadius: '8px' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '4px' }}>In Progress</div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#f59e0b' }}>{metrics.inProgressProjects}</div>
                </div>
                <div style={{ padding: '12px', background: 'var(--bg-hover)', borderRadius: '8px' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '4px' }}>Not Started</div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#3b82f6' }}>{metrics.notStartedProjects}</div>
                </div>
                <div style={{ padding: '12px', background: 'var(--bg-hover)', borderRadius: '8px' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '4px' }}>Total</div>
                  <div style={{ fontSize: '24px', fontWeight: '700' }}>{metrics.totalProjects}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-title">📝 Task Statistics</div>
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                <div style={{ padding: '12px', background: 'var(--bg-hover)', borderRadius: '8px' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '4px' }}>Completed</div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#10b981' }}>{metrics.completedTasks}</div>
                </div>
                <div style={{ padding: '12px', background: 'var(--bg-hover)', borderRadius: '8px' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '4px' }}>In Progress</div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#f59e0b' }}>{metrics.activeTasks}</div>
                </div>
                <div style={{ padding: '12px', background: 'var(--bg-hover)', borderRadius: '8px' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '4px' }}>Pending</div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#3b82f6' }}>{metrics.pendingTasks}</div>
                </div>
                <div style={{ padding: '12px', background: 'var(--bg-hover)', borderRadius: '8px' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '4px' }}>Rejected</div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#ef4444' }}>{metrics.rejectedTasks}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
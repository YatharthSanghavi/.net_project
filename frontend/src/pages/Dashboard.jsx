import React, { useState, useEffect } from 'react';
import apiService from '../services/apiService';

export default function Dashboard({ user, onNavigate }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [statuses, setStatuses] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const [projData, tasksData, usersData, statusData, prioData] = await Promise.all([
        apiService.projects.getAll().catch(() => []),
        apiService.tasks.getAll().catch(() => []),
        apiService.users.getAll().catch(() => []),
        apiService.status.getAll().catch(() => []),
        apiService.priority.getAll().catch(() => []),
      ]);

      setProjects(Array.isArray(projData) ? projData : []);
      setTasks(Array.isArray(tasksData) ? tasksData : []);
      setUsers(Array.isArray(usersData) ? usersData : []);
      setStatuses(Array.isArray(statusData) ? statusData : []);
      setPriorities(Array.isArray(prioData) ? prioData : []);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  const role = user?.role || 'Admin';
  const userId = user?.userId;

  // Filter based on role
  let roleProjects = projects;
  let roleTasks = tasks;

  if (role === 'Student' && userId) {
    roleProjects = projects.filter((p) => p.studentId === userId);
    const userProjIds = roleProjects.map((p) => p.projectId);
    roleTasks = tasks.filter((t) => userProjIds.includes(t.projectId));
  } else if (role === 'Faculty' && userId) {
    roleProjects = projects.filter((p) => p.facultyId === userId);
    const userProjIds = roleProjects.map((p) => p.projectId);
    roleTasks = tasks.filter((t) => userProjIds.includes(t.projectId));
  }

  // Calculate metrics
  const totalProjects = roleProjects.length;
  const completedProjects = roleProjects.filter(
    (p) => p.completedTasks > 0 && p.completedTasks === p.totalTasks
  ).length;

  const totalTasks = roleTasks.length;
  const completedTasks = roleTasks.filter((t) => t.completedDate || t.progressPercentage === 100).length;
  const inProgressTasks = roleTasks.filter(
    (t) => !t.completedDate && t.progressPercentage > 0 && t.progressPercentage < 100
  ).length;
  const pendingTasks = roleTasks.filter(
    (t) => !t.completedDate && (t.progressPercentage === 0 || !t.progressPercentage)
  ).length;

  const totalAssignedScore = roleTasks.reduce((sum, t) => sum + (Number(t.assignedScore) || 0), 0);
  const totalEarnedScore = roleTasks.reduce((sum, t) => sum + (Number(t.earnedScore) || 0), 0);
  const performanceRate =
    totalAssignedScore > 0 ? Math.round((totalEarnedScore / totalAssignedScore) * 100) : 0;
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const getUserName = (id) => {
    const u = users.find((x) => x.userId === id);
    return u ? u.fullName : `User #${id}`;
  };

  const getStatusName = (statusId) => {
    const s = statuses.find((x) => x.statusID === statusId);
    return s ? s.statusName : `Status #${statusId}`;
  };

  if (loading) {
    return (
      <div className="content-wrapper" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
        <h3>Loading SPMS Dashboard...</h3>
        <p style={{ color: 'var(--text-muted)' }}>Retrieving analytics from ASP.NET Core backend...</p>
      </div>
    );
  }

  return (
    <div className="content-wrapper">
      {/* Welcome banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          color: '#fff',
          borderRadius: 'var(--radius-lg)',
          padding: '28px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <div>
          <div style={{ display: 'inline-block', padding: '4px 12px', background: 'rgba(13, 148, 136, 0.3)', color: '#2dd4bf', borderRadius: '20px', fontSize: '12px', fontWeight: '700', marginBottom: '10px' }}>
            {role.toUpperCase()} PORTAL
          </div>
          <h2 style={{ color: '#fff', margin: '0 0 6px 0', fontSize: '26px' }}>
            Welcome back, {user?.name || 'Academic User'}!
          </h2>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '14px' }}>
            {role === 'Admin' && 'System-wide academic project supervision, user management, and deliverables overview.'}
            {role === 'Faculty' && 'Supervise guided student projects, review pending tasks, and submit evaluation feedback.'}
            {role === 'Student' && 'Track allocated project milestones, submit deliverables, and review faculty feedback.'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {(role === 'Admin' || role === 'Faculty') && (
            <button className="btn" onClick={() => onNavigate('projects')} style={{ background: '#0d9488' }}>
              📁 Projects
            </button>
          )}
          <button className="btn btn-outline" onClick={() => onNavigate('tasks')} style={{ color: '#fff', borderColor: '#475569' }}>
            📝 Tasks
          </button>
          <button className="btn btn-outline" onClick={() => onNavigate('scores')} style={{ color: '#fff', borderColor: '#475569' }}>
            💡 Scores
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '20px' }}>
          <span>⚠️</span>
          <div style={{ flex: 1 }}>{error}</div>
          <button className="btn btn-sm btn-outline" onClick={loadDashboardData} style={{ marginLeft: '12px' }}>
            Retry
          </button>
        </div>
      )}

      {/* KPI Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px', marginBottom: '28px' }}>
        <div className="card" style={{ margin: 0, padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', letterSpacing: '0.05em' }}>
                TOTAL PROJECTS
              </span>
              <div style={{ fontSize: '32px', fontWeight: '800', color: 'var(--text-main)', marginTop: '4px' }}>
                {totalProjects}
              </div>
            </div>
            <span style={{ fontSize: '28px', background: 'rgba(13, 148, 136, 0.1)', padding: '10px', borderRadius: '12px' }}>
              📁
            </span>
          </div>
          <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--text-muted)' }}>
            {completedProjects} of {totalProjects} completed
          </div>
        </div>

        <div className="card" style={{ margin: 0, padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', letterSpacing: '0.05em' }}>
                TASK DELIVERABLES
              </span>
              <div style={{ fontSize: '32px', fontWeight: '800', color: 'var(--text-main)', marginTop: '4px' }}>
                {totalTasks}
              </div>
            </div>
            <span style={{ fontSize: '28px', background: 'rgba(6, 182, 212, 0.1)', padding: '10px', borderRadius: '12px' }}>
              📝
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
            <span className="badge badge-success">{completedTasks} Done</span>
            <span className="badge badge-warning">{inProgressTasks + pendingTasks} Active</span>
          </div>
        </div>

        <div className="card" style={{ margin: 0, padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', letterSpacing: '0.05em' }}>
                ACADEMIC PERFORMANCE
              </span>
              <div style={{ fontSize: '32px', fontWeight: '800', color: 'var(--success)', marginTop: '4px' }}>
                {performanceRate}%
              </div>
            </div>
            <span style={{ fontSize: '28px', background: 'rgba(16, 185, 129, 0.1)', padding: '10px', borderRadius: '12px' }}>
              🎯
            </span>
          </div>
          <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--text-muted)' }}>
            {totalEarnedScore} / {totalAssignedScore} points earned
          </div>
        </div>

        {role === 'Admin' ? (
          <div className="card" style={{ margin: 0, padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', letterSpacing: '0.05em' }}>
                  ACTIVE USERS
                </span>
                <div style={{ fontSize: '32px', fontWeight: '800', color: 'var(--info)', marginTop: '4px' }}>
                  {users.length}
                </div>
              </div>
              <span style={{ fontSize: '28px', background: 'rgba(59, 130, 246, 0.1)', padding: '10px', borderRadius: '12px' }}>
                👥
              </span>
            </div>
            <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--text-muted)' }}>
              Registered students & faculty accounts
            </div>
          </div>
        ) : (
          <div className="card" style={{ margin: 0, padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', letterSpacing: '0.05em' }}>
                  TASK COMPLETION RATE
                </span>
                <div style={{ fontSize: '32px', fontWeight: '800', color: 'var(--primary)', marginTop: '4px' }}>
                  {taskCompletionRate}%
                </div>
              </div>
              <span style={{ fontSize: '28px', background: 'rgba(13, 148, 136, 0.1)', padding: '10px', borderRadius: '12px' }}>
                📊
              </span>
            </div>
            <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--text-muted)' }}>
              Milestone delivery pace
            </div>
          </div>
        )}
      </div>

      {/* Two Columns: Recent Projects & Priority Tasks */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
        {/* Recent Projects Card */}
        <div className="card" style={{ margin: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0 }}>📁 Active Academic Projects</h3>
            <button className="btn btn-sm btn-outline" onClick={() => onNavigate('projects')}>
              View All
            </button>
          </div>

          {roleProjects.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {roleProjects.slice(0, 5).map((p) => {
                const projTasks = tasks.filter((t) => t.projectId === p.projectId);
                const doneTasks = projTasks.filter((t) => t.completedDate || t.progressPercentage === 100).length;
                const pct = projTasks.length > 0 ? Math.round((doneTasks / projTasks.length) * 100) : 0;

                return (
                  <div
                    key={p.projectId}
                    style={{
                      padding: '12px 14px',
                      background: 'var(--bg-base)',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: '700', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {p.projectTitle}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        🎓 {getUserName(p.studentId)} • 👩‍🏫 {getUserName(p.facultyId)}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', minWidth: '80px' }}>
                      <span className="badge badge-info">{getStatusName(p.projectStatus)}</span>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                        {pct}% done ({doneTasks}/{projTasks.length})
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px 0' }}>
              No academic projects found.
            </p>
          )}
        </div>

        {/* Priority Tasks Card */}
        <div className="card" style={{ margin: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0 }}>📝 Upcoming Task Deliverables</h3>
            <button className="btn btn-sm btn-outline" onClick={() => onNavigate('tasks')}>
              View All
            </button>
          </div>

          {roleTasks.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {roleTasks.slice(0, 5).map((t) => (
                <div
                  key={t.taskId}
                  style={{
                    padding: '12px 14px',
                    background: 'var(--bg-base)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: '700', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {t.taskTitle}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      📅 Due: {t.dueDate ? t.dueDate.split('T')[0] : 'N/A'} • {t.assignedScore} Pts
                    </div>
                  </div>

                  <div>
                    {t.completedDate || t.progressPercentage === 100 ? (
                      <span className="badge badge-success">Completed</span>
                    ) : (
                      <span className="badge badge-warning">Pending</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px 0' }}>
              No tasks allocated yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
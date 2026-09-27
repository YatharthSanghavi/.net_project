import React, { useState, useEffect } from 'react';
import apiService from '../../services/apiService';

export default function ProjectsList({ userRole, currentUser, showToast }) {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [userRoles, setUserRoles] = useState([]);
  const [roles, setRoles] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [detailsProject, setDetailsProject] = useState(null);
  const [deleteConfirmProject, setDeleteConfirmProject] = useState(null);

  const [formData, setFormData] = useState({
    projectTitle: '',
    description: '',
    studentId: '',
    facultyId: '',
    projectStatus: 1,
    startDate: '',
    endDate: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isAdmin = userRole === 'Admin';
  const isFaculty = userRole === 'Faculty';
  const canManage = isAdmin || isFaculty;

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    setError('');
    try {
      const [projData, usersData, uRolesData, rolesData, statusData, tasksData] = await Promise.all([
        apiService.projects.getAll().catch(() => []),
        apiService.users.getAll().catch(() => []),
        apiService.userRoles.getAll().catch(() => []),
        apiService.roles.getAll().catch(() => []),
        apiService.status.getAll().catch(() => []),
        apiService.tasks.getAll().catch(() => []),
      ]);

      setProjects(Array.isArray(projData) ? projData : []);
      setUsers(Array.isArray(usersData) ? usersData : []);
      setUserRoles(Array.isArray(uRolesData) ? uRolesData : []);
      setRoles(Array.isArray(rolesData) ? rolesData : []);
      setStatuses(Array.isArray(statusData) ? statusData : []);
      setTasks(Array.isArray(tasksData) ? tasksData : []);
    } catch (err) {
      setError(err.message || 'Failed to load projects data from server.');
    } finally {
      setLoading(false);
    }
  };

  const getUserName = (id) => {
    const u = users.find((x) => x.userId === id);
    return u ? u.fullName : `User #${id}`;
  };

  const getStatusObj = (statusId) => {
    const s = statuses.find((x) => x.statusID === statusId);
    return s || { statusName: `Status #${statusId}`, statusCssClass: 'badge-info' };
  };

  // Separate users into Students and Faculty
  const getStudentsList = () => {
    const studentRole = roles.find((r) => r.roleName?.toLowerCase() === 'student');
    if (!studentRole) return users;
    const studentUserIds = userRoles
      .filter((ur) => ur.roleId === studentRole.roleId)
      .map((ur) => ur.userId);
    const filtered = users.filter((u) => studentUserIds.includes(u.userId));
    return filtered.length > 0 ? filtered : users;
  };

  const getFacultyList = () => {
    const facultyRole = roles.find((r) => r.roleName?.toLowerCase() === 'faculty');
    if (!facultyRole) return users;
    const facultyUserIds = userRoles
      .filter((ur) => ur.roleId === facultyRole.roleId)
      .map((ur) => ur.userId);
    const filtered = users.filter((u) => facultyUserIds.includes(u.userId));
    return filtered.length > 0 ? filtered : users;
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.projectTitle.trim()) {
      errs.projectTitle = 'Project title is required.';
    } else if (formData.projectTitle.length > 200) {
      errs.projectTitle = 'Project title cannot exceed 200 characters.';
    }

    if (formData.description && formData.description.length > 1000) {
      errs.description = 'Description cannot exceed 1000 characters.';
    }

    if (!formData.studentId) {
      errs.studentId = 'Assigned student is required.';
    }

    if (!formData.facultyId) {
      errs.facultyId = 'Assigned faculty guide is required.';
    }

    if (formData.studentId && formData.facultyId && formData.studentId === formData.facultyId) {
      errs.facultyId = 'Faculty guide and student cannot be the same user.';
    }

    if (!formData.projectStatus) {
      errs.projectStatus = 'Project status is required.';
    }

    if (!formData.startDate) {
      errs.startDate = 'Start date is required.';
    }

    if (!formData.endDate) {
      errs.endDate = 'End date is required.';
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (start >= end) {
        errs.endDate = 'End date must be after start date.';
      }
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      if (end < now) {
        errs.endDate = 'End date must be in the future.';
      }
    }

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleOpenAdd = () => {
    setEditId(null);
    const students = getStudentsList();
    const faculty = getFacultyList();
    const defaultStatusId = statuses.length > 0 ? statuses[0].statusID : 1;

    // Default dates: today and 3 months later
    const today = new Date().toISOString().split('T')[0];
    const threeMonths = new Date();
    threeMonths.setMonth(threeMonths.getMonth() + 3);
    const futureDate = threeMonths.toISOString().split('T')[0];

    setFormData({
      projectTitle: '',
      description: '',
      studentId: students[0]?.userId || '',
      facultyId: currentUser?.role === 'Faculty' ? currentUser.userId : faculty[0]?.userId || '',
      projectStatus: defaultStatusId,
      startDate: today,
      endDate: futureDate,
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleOpenEdit = (project) => {
    setEditId(project.projectId);
    setFormData({
      projectTitle: project.projectTitle || '',
      description: project.description || '',
      studentId: project.studentId || '',
      facultyId: project.facultyId || '',
      projectStatus: project.projectStatus || 1,
      startDate: project.startDate ? project.startDate.split('T')[0] : '',
      endDate: project.endDate ? project.endDate.split('T')[0] : '',
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    try {
      const payload = {
        projectId: editId || 0,
        projectTitle: formData.projectTitle.trim(),
        description: formData.description.trim() || null,
        studentId: Number(formData.studentId),
        facultyId: Number(formData.facultyId),
        projectStatus: Number(formData.projectStatus),
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        assignedDate: new Date().toISOString(),
        totalTasks: 0,
        completedTasks: 0,
        progressPercentage: 0,
      };

      if (editId) {
        await apiService.projects.update(editId, payload);
        if (showToast) showToast('Project updated successfully!', 'success');
      } else {
        await apiService.projects.create(payload);
        if (showToast) showToast('Project created successfully!', 'success');
      }

      setShowModal(false);
      await loadAllData();
    } catch (err) {
      if (showToast) showToast(err.message || 'Operation failed', 'error');
      else setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmProject) return;
    setDeleting(true);
    try {
      await apiService.projects.delete(deleteConfirmProject.projectId);
      if (showToast) showToast(`Project "${deleteConfirmProject.projectTitle}" removed!`, 'success');
      setDeleteConfirmProject(null);
      await loadAllData();
    } catch (err) {
      if (showToast) showToast(err.message || 'Failed to delete project', 'error');
    } finally {
      setDeleting(false);
    }
  };

  // Filtration logic
  const filtered = projects.filter((p) => {
    const studentName = getUserName(p.studentId);
    const facultyName = getUserName(p.facultyId);
    const matchesSearch =
      p.projectTitle?.toLowerCase().includes(search.toLowerCase()) ||
      studentName.toLowerCase().includes(search.toLowerCase()) ||
      facultyName.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === 'All' || String(p.projectStatus) === String(statusFilter);

    // If role is Student, only show their projects
    if (userRole === 'Student' && currentUser?.userId) {
      if (p.studentId !== currentUser.userId) return false;
    }
    // If role is Faculty, show their projects
    if (userRole === 'Faculty' && currentUser?.userId) {
      if (p.facultyId !== currentUser.userId) return false;
    }

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (statusId) => {
    const s = getStatusObj(statusId);
    const css = s.statusCssClass?.toLowerCase();
    if (css?.includes('success') || s.statusName?.toLowerCase().includes('complete')) {
      return <span className="badge badge-success">✅ {s.statusName}</span>;
    }
    if (css?.includes('warning') || s.statusName?.toLowerCase().includes('progress')) {
      return <span className="badge badge-warning">⏳ {s.statusName}</span>;
    }
    return <span className="badge badge-info">📌 {s.statusName}</span>;
  };

  return (
    <div className="content-wrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h2>Academic Projects Management</h2>
          <p style={{ margin: 0 }}>Supervise research groups, track progress milestones, and manage student allocations.</p>
        </div>
        {canManage && (
          <button className="btn" onClick={handleOpenAdd} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>➕</span> Create New Project
          </button>
        )}
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '16px' }}>
          <span>⚠️</span>
          <div style={{ flex: 1 }}>{error}</div>
          <button className="btn btn-sm btn-outline" onClick={loadAllData} style={{ marginLeft: '12px' }}>
            Retry
          </button>
        </div>
      )}

      <div className="card">
        <div className="search-container" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="search-input-wrapper" style={{ maxWidth: '340px', flex: 1 }}>
            <span className="search-icon">🔍</span>
            <input
              className="input-control"
              placeholder="Search projects, students, guides..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <select
              className="input-control"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ width: '180px', background: '#fff' }}
            >
              <option value="All">All Statuses</option>
              {statuses.map((s) => (
                <option key={s.statusID} value={s.statusID}>
                  {s.statusName}
                </option>
              ))}
            </select>

            <span style={{ fontSize: '13px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
              <strong>{filtered.length}</strong> projects
            </span>
          </div>
        </div>

        <div className="table-container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              ⏳ Loading academic projects...
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: '50px' }}>#</th>
                  <th>Project Details</th>
                  <th>Assigned Student</th>
                  <th>Faculty Guide</th>
                  <th>Status & Progress</th>
                  <th style={{ width: '140px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((p, i) => {
                    const projectTasks = tasks.filter((t) => t.projectId === p.projectId);
                    const completedTasks = projectTasks.filter((t) => t.completedDate || t.progressPercentage === 100).length;
                    const progressPercent =
                      projectTasks.length > 0
                        ? Math.round((completedTasks / projectTasks.length) * 100)
                        : p.progressPercentage || 0;

                    return (
                      <tr key={p.projectId}>
                        <td>{i + 1}</td>
                        <td>
                          <div
                            style={{ fontWeight: '700', fontSize: '15px', cursor: 'pointer', color: 'var(--primary)' }}
                            onClick={() => setDetailsProject(p)}
                            title="View Project Details"
                          >
                            {p.projectTitle}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px', maxWidth: '360px' }}>
                            {p.description ? p.description.slice(0, 100) + (p.description.length > 100 ? '...' : '') : 'No description provided.'}
                          </div>
                          <div style={{ display: 'flex', gap: '10px', fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
                            <span>📅 {p.startDate ? p.startDate.split('T')[0] : 'N/A'}</span>
                            <span>➔</span>
                            <span>🎯 {p.endDate ? p.endDate.split('T')[0] : 'N/A'}</span>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '16px' }}>🎓</span>
                            <div>
                              <strong>{getUserName(p.studentId)}</strong>
                              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ID: #{p.studentId}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '16px' }}>👩‍🏫</span>
                            <div>
                              <strong>{getUserName(p.facultyId)}</strong>
                              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ID: #{p.facultyId}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ marginBottom: '6px' }}>{getStatusBadge(p.projectStatus)}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div
                              style={{
                                flex: 1,
                                height: '6px',
                                background: '#e2e8f0',
                                borderRadius: '4px',
                                overflow: 'hidden',
                                minWidth: '70px',
                              }}
                            >
                              <div
                                style={{
                                  width: `${progressPercent}%`,
                                  height: '100%',
                                  background: progressPercent === 100 ? 'var(--success)' : 'var(--primary)',
                                  transition: 'width 0.3s',
                                }}
                              />
                            </div>
                            <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)' }}>
                              {progressPercent}%
                            </span>
                          </div>
                          <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                            {projectTasks.length} {projectTasks.length === 1 ? 'task' : 'tasks'} ({completedTasks} completed)
                          </div>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            <button
                              className="btn btn-sm btn-outline"
                              onClick={() => setDetailsProject(p)}
                              title="View Project Information"
                            >
                              👁️
                            </button>
                            {canManage && (
                              <button
                                className="btn btn-sm btn-outline"
                                onClick={() => handleOpenEdit(p)}
                                title="Edit Project"
                              >
                                ✏️
                              </button>
                            )}
                            {isAdmin && (
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => setDeleteConfirmProject(p)}
                                title="Delete Project"
                              >
                                🗑️
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '35px', color: 'var(--text-muted)' }}>
                      No projects found matching the criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add / Edit Project Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => !saving && setShowModal(false)}>
          <div className="modal" style={{ maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0 }}>{editId ? 'Edit Project' : 'Create New Academic Project'}</h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                style={{ background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Project Title *</label>
                <input
                  className={`input-control ${formErrors.projectTitle ? 'input-error' : ''}`}
                  value={formData.projectTitle}
                  onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
                  placeholder="e.g. Distributed Cloud File Storage"
                  disabled={saving}
                  autoFocus
                />
                {formErrors.projectTitle && <span className="error-message">❌ {formErrors.projectTitle}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Project Description</label>
                <textarea
                  className={`input-control ${formErrors.description ? 'input-error' : ''}`}
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed project summary, objectives, and milestones..."
                  disabled={saving}
                />
                {formErrors.description && <span className="error-message">❌ {formErrors.description}</span>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Assigned Student *</label>
                  <select
                    className={`input-control ${formErrors.studentId ? 'input-error' : ''}`}
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    disabled={saving}
                  >
                    <option value="">Select Student</option>
                    {getStudentsList().map((s) => (
                      <option key={s.userId} value={s.userId}>
                        🎓 {s.fullName} ({s.email})
                      </option>
                    ))}
                  </select>
                  {formErrors.studentId && <span className="error-message">❌ {formErrors.studentId}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Faculty Supervisor Guide *</label>
                  <select
                    className={`input-control ${formErrors.facultyId ? 'input-error' : ''}`}
                    value={formData.facultyId}
                    onChange={(e) => setFormData({ ...formData, facultyId: e.target.value })}
                    disabled={saving}
                  >
                    <option value="">Select Faculty</option>
                    {getFacultyList().map((f) => (
                      <option key={f.userId} value={f.userId}>
                        👩‍🏫 {f.fullName} ({f.email})
                      </option>
                    ))}
                  </select>
                  {formErrors.facultyId && <span className="error-message">❌ {formErrors.facultyId}</span>}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Project Status *</label>
                  <select
                    className="input-control"
                    value={formData.projectStatus}
                    onChange={(e) => setFormData({ ...formData, projectStatus: e.target.value })}
                    disabled={saving}
                  >
                    {statuses.map((s) => (
                      <option key={s.statusID} value={s.statusID}>
                        {s.statusName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Start Date *</label>
                  <input
                    type="date"
                    className={`input-control ${formErrors.startDate ? 'input-error' : ''}`}
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    disabled={saving}
                  />
                  {formErrors.startDate && <span className="error-message">❌ {formErrors.startDate}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Target End Date *</label>
                  <input
                    type="date"
                    className={`input-control ${formErrors.endDate ? 'input-error' : ''}`}
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    disabled={saving}
                  />
                  {formErrors.endDate && <span className="error-message">❌ {formErrors.endDate}</span>}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowModal(false)}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button type="submit" className="btn" disabled={saving}>
                  {saving ? 'Saving...' : editId ? 'Save Changes' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Project Details Modal */}
      {detailsProject && (
        <div className="modal-overlay" onClick={() => setDetailsProject(null)}>
          <div className="modal" style={{ maxWidth: '680px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '24px' }}>📁</span>
                <h3 style={{ margin: 0 }}>{detailsProject.projectTitle}</h3>
              </div>
              <button
                type="button"
                onClick={() => setDetailsProject(null)}
                style={{ background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                ×
              </button>
            </div>

            <div style={{ marginBottom: '20px', padding: '16px', background: 'var(--bg-base)', borderRadius: 'var(--radius-md)' }}>
              <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: 'var(--text-main)' }}>
                {detailsProject.description || 'No detailed description available.'}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', fontSize: '13px' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '11px' }}>STUDENT</span>
                  <strong>🎓 {getUserName(detailsProject.studentId)}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '11px' }}>FACULTY SUPERVISOR</span>
                  <strong>👩‍🏫 {getUserName(detailsProject.facultyId)}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '11px' }}>TIMELINE</span>
                  <span>{detailsProject.startDate?.split('T')[0]} ➔ {detailsProject.endDate?.split('T')[0]}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '11px' }}>STATUS</span>
                  {getStatusBadge(detailsProject.projectStatus)}
                </div>
              </div>
            </div>

            <h4 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '700' }}>
              Project Tasks ({tasks.filter((t) => t.projectId === detailsProject.projectId).length})
            </h4>

            <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
              {tasks.filter((t) => t.projectId === detailsProject.projectId).length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {tasks
                    .filter((t) => t.projectId === detailsProject.projectId)
                    .map((task) => (
                      <div
                        key={task.taskId}
                        style={{
                          padding: '12px',
                          border: '1px solid var(--border)',
                          borderRadius: 'var(--radius-sm)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '12px',
                        }}
                      >
                        <div>
                          <strong style={{ fontSize: '14px' }}>{task.taskTitle}</strong>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                            Score: {task.earnedScore != null ? `${task.earnedScore} / ` : ''}{task.assignedScore} pts
                            {task.dueDate && ` • Due: ${task.dueDate.split('T')[0]}`}
                          </div>
                        </div>
                        <div>
                          {task.completedDate || task.progressPercentage === 100 ? (
                            <span className="badge badge-success">Completed</span>
                          ) : (
                            <span className="badge badge-warning">In Progress</span>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px 0' }}>
                  No tasks added to this project yet. Go to Tasks management to create tasks.
                </p>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button className="btn" onClick={() => setDetailsProject(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmProject && (
        <div className="modal-overlay" onClick={() => !deleting && setDeleteConfirmProject(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ color: 'var(--danger)', marginBottom: '12px' }}>Confirm Project Deletion</h3>
            <p>
              Are you sure you want to delete the project <strong>"{deleteConfirmProject.projectTitle}"</strong>?
            </p>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              This project will be archived/soft-deleted in the database.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setDeleteConfirmProject(null)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

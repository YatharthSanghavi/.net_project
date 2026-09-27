import React, { useState, useEffect } from 'react';
import apiService from '../../services/apiService';

export default function TasksList({ userRole, currentUser, showToast }) {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  const [projectFilter, setProjectFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [detailsTask, setDetailsTask] = useState(null);
  const [deleteConfirmTask, setDeleteConfirmTask] = useState(null);

  const [formData, setFormData] = useState({
    projectId: '',
    taskTitle: '',
    taskDescription: '',
    taskStatus: 1,
    priorityID: 1,
    assignedScore: 10,
    earnedScore: '',
    startDate: '',
    dueDate: '',
    completedDate: '',
    facultyRemarks: '',
    studentRemarks: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isAdmin = userRole === 'Admin';
  const isFaculty = userRole === 'Faculty';
  const isStudent = userRole === 'Student';
  const canManage = isAdmin || isFaculty;

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    setError('');
    try {
      const [tasksData, projData, statusData, priorityData, usersData] = await Promise.all([
        apiService.tasks.getAll().catch(() => []),
        apiService.projects.getAll().catch(() => []),
        apiService.status.getAll().catch(() => []),
        apiService.priority.getAll().catch(() => []),
        apiService.users.getAll().catch(() => []),
      ]);

      setTasks(Array.isArray(tasksData) ? tasksData : []);
      setProjects(Array.isArray(projData) ? projData : []);
      setStatuses(Array.isArray(statusData) ? statusData : []);
      setPriorities(Array.isArray(priorityData) ? priorityData : []);
      setUsers(Array.isArray(usersData) ? usersData : []);
    } catch (err) {
      setError(err.message || 'Failed to load task deliverables.');
    } finally {
      setLoading(false);
    }
  };

  const getProject = (id) => projects.find((p) => p.projectId === id);
  const getProjectTitle = (id) => {
    const p = getProject(id);
    return p ? p.projectTitle : `Project #${id}`;
  };

  const getUserName = (id) => {
    const u = users.find((x) => x.userId === id);
    return u ? u.fullName : `User #${id}`;
  };

  const getStatusName = (statusId) => {
    const s = statuses.find((x) => x.statusID === statusId);
    return s ? s.statusName : `Status #${statusId}`;
  };

  const getPriorityName = (priorityId) => {
    const pr = priorities.find((x) => x.priorityID === priorityId);
    return pr ? pr.priorityName : `Priority #${priorityId}`;
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.projectId) {
      errs.projectId = 'Associated project is required.';
    }

    if (!formData.taskTitle.trim()) {
      errs.taskTitle = 'Task title is required.';
    } else if (formData.taskTitle.length > 200) {
      errs.taskTitle = 'Task title cannot exceed 200 characters.';
    }

    if (formData.taskDescription && formData.taskDescription.length > 1000) {
      errs.taskDescription = 'Task description cannot exceed 1000 characters.';
    }

    if (formData.assignedScore === '' || isNaN(Number(formData.assignedScore)) || Number(formData.assignedScore) < 0 || Number(formData.assignedScore) > 1000) {
      errs.assignedScore = 'Assigned score must be between 0 and 1000.';
    }

    if (formData.earnedScore !== '' && formData.earnedScore != null) {
      const earned = Number(formData.earnedScore);
      const assigned = Number(formData.assignedScore);
      if (isNaN(earned) || earned < 0) {
        errs.earnedScore = 'Earned score cannot be negative.';
      } else if (earned > assigned) {
        errs.earnedScore = `Earned score cannot exceed assigned score (${assigned}).`;
      }
    }

    if (formData.startDate && formData.dueDate) {
      const start = new Date(formData.startDate);
      const due = new Date(formData.dueDate);
      if (start >= due) {
        errs.dueDate = 'Due date must be after start date.';
      }
    }

    if (formData.facultyRemarks && formData.facultyRemarks.length > 500) {
      errs.facultyRemarks = 'Faculty remarks cannot exceed 500 characters.';
    }

    if (formData.studentRemarks && formData.studentRemarks.length > 500) {
      errs.studentRemarks = 'Student remarks cannot exceed 500 characters.';
    }

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleOpenAdd = () => {
    setEditId(null);
    const defaultProjId = projects.length > 0 ? projects[0].projectId : '';
    const defaultStatusId = statuses.length > 0 ? statuses[0].statusID : 1;
    const defaultPriorityId = priorities.length > 0 ? priorities[0].priorityID : 1;

    const today = new Date().toISOString().split('T')[0];
    const twoWeeks = new Date();
    twoWeeks.setDate(twoWeeks.getDate() + 14);
    const futureDue = twoWeeks.toISOString().split('T')[0];

    setFormData({
      projectId: defaultProjId,
      taskTitle: '',
      taskDescription: '',
      taskStatus: defaultStatusId,
      priorityID: defaultPriorityId,
      assignedScore: 10,
      earnedScore: '',
      startDate: today,
      dueDate: futureDue,
      completedDate: '',
      facultyRemarks: '',
      studentRemarks: '',
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleOpenEdit = (task) => {
    setEditId(task.taskId);
    setFormData({
      projectId: task.projectId || '',
      taskTitle: task.taskTitle || '',
      taskDescription: task.taskDescription || '',
      taskStatus: task.taskStatus || 1,
      priorityID: task.priorityID || 1,
      assignedScore: task.assignedScore ?? 10,
      earnedScore: task.earnedScore != null ? task.earnedScore : '',
      startDate: task.startDate ? task.startDate.split('T')[0] : '',
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      completedDate: task.completedDate ? task.completedDate.split('T')[0] : '',
      facultyRemarks: task.facultyRemarks || '',
      studentRemarks: task.studentRemarks || '',
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
        taskId: editId || 0,
        projectId: Number(formData.projectId),
        taskTitle: formData.taskTitle.trim(),
        taskDescription: formData.taskDescription.trim() || null,
        taskStatus: Number(formData.taskStatus),
        priorityID: Number(formData.priorityID),
        assignedScore: Number(formData.assignedScore),
        earnedScore: formData.earnedScore !== '' ? Number(formData.earnedScore) : null,
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
        completedDate: formData.completedDate ? new Date(formData.completedDate).toISOString() : null,
        facultyRemarks: formData.facultyRemarks.trim() || null,
        studentRemarks: formData.studentRemarks.trim() || null,
      };

      if (editId) {
        await apiService.tasks.update(editId, payload);
        if (showToast) showToast('Task updated successfully!', 'success');
      } else {
        await apiService.tasks.create(payload);
        if (showToast) showToast('Task allocated successfully!', 'success');
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
    if (!deleteConfirmTask) return;
    setDeleting(true);
    try {
      await apiService.tasks.delete(deleteConfirmTask.taskId);
      if (showToast) showToast(`Task "${deleteConfirmTask.taskTitle}" deleted!`, 'success');
      setDeleteConfirmTask(null);
      await loadAllData();
    } catch (err) {
      if (showToast) showToast(err.message || 'Failed to delete task', 'error');
    } finally {
      setDeleting(false);
    }
  };

  // Filtration logic
  const filtered = tasks.filter((t) => {
    const proj = getProject(t.projectId);
    const studentName = proj ? getUserName(proj.studentId) : '';
    const projTitle = proj ? proj.projectTitle : '';

    const matchesSearch =
      t.taskTitle?.toLowerCase().includes(search.toLowerCase()) ||
      t.taskDescription?.toLowerCase().includes(search.toLowerCase()) ||
      projTitle.toLowerCase().includes(search.toLowerCase()) ||
      studentName.toLowerCase().includes(search.toLowerCase());

    const matchesProject = projectFilter === 'All' || String(t.projectId) === String(projectFilter);
    const matchesStatus = statusFilter === 'All' || String(t.taskStatus) === String(statusFilter);
    const matchesPriority = priorityFilter === 'All' || String(t.priorityID) === String(priorityFilter);

    // If Student logged in, filter to tasks for projects they own
    if (isStudent && currentUser?.userId && proj) {
      if (proj.studentId !== currentUser.userId) return false;
    }

    return matchesSearch && matchesProject && matchesStatus && matchesPriority;
  });

  const getPriorityBadge = (priorityId) => {
    const pName = getPriorityName(priorityId);
    if (pName.toLowerCase().includes('high') || pName.toLowerCase().includes('critical')) {
      return <span className="badge badge-danger">🔥 {pName}</span>;
    }
    if (pName.toLowerCase().includes('medium')) {
      return <span className="badge badge-warning">⚡ {pName}</span>;
    }
    return <span className="badge badge-info">🌱 {pName}</span>;
  };

  const getStatusBadge = (statusId, completedDate) => {
    const sName = getStatusName(statusId);
    if (completedDate || sName.toLowerCase().includes('complete')) {
      return <span className="badge badge-success">✅ Completed</span>;
    }
    if (sName.toLowerCase().includes('progress')) {
      return <span className="badge badge-warning">⏳ In Progress</span>;
    }
    if (sName.toLowerCase().includes('reject')) {
      return <span className="badge badge-danger">❌ Rejected</span>;
    }
    return <span className="badge badge-info">📝 {sName}</span>;
  };

  return (
    <div className="content-wrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h2>Project Tasks & Deliverables</h2>
          <p style={{ margin: 0 }}>Create, monitor, and evaluate student milestones and research deliverables.</p>
        </div>
        {canManage && (
          <button className="btn" onClick={handleOpenAdd} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>➕</span> Allocate New Task
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
        {/* Filters bar */}
        <div className="search-container" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
          <div className="search-input-wrapper" style={{ flex: 2, minWidth: '220px' }}>
            <span className="search-icon">🔍</span>
            <input
              className="input-control"
              placeholder="Search tasks, deliverables, projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ flex: 1, minWidth: '150px' }}>
            <select
              className="input-control"
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              style={{ background: '#fff' }}
            >
              <option value="All">All Projects</option>
              {projects.map((p) => (
                <option key={p.projectId} value={p.projectId}>
                  {p.projectTitle}
                </option>
              ))}
            </select>
          </div>

          <div style={{ flex: 1, minWidth: '130px' }}>
            <select
              className="input-control"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ background: '#fff' }}
            >
              <option value="All">All Statuses</option>
              {statuses.map((s) => (
                <option key={s.statusID} value={s.statusID}>
                  {s.statusName}
                </option>
              ))}
            </select>
          </div>

          <div style={{ flex: 1, minWidth: '130px' }}>
            <select
              className="input-control"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              style={{ background: '#fff' }}
            >
              <option value="All">All Priorities</option>
              {priorities.map((pr) => (
                <option key={pr.priorityID} value={pr.priorityID}>
                  {pr.priorityName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="table-container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              ⏳ Loading task deliverables...
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: '50px' }}>#</th>
                  <th>Task & Project Details</th>
                  <th>Priority</th>
                  <th>Status & Due Date</th>
                  <th>Score & Evaluation</th>
                  <th>Assigned Student</th>
                  <th style={{ width: '130px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((t, i) => {
                    const proj = getProject(t.projectId);
                    const studentName = proj ? getUserName(proj.studentId) : 'Unassigned';

                    return (
                      <tr key={t.taskId}>
                        <td>{i + 1}</td>
                        <td>
                          <div
                            style={{ fontWeight: '700', fontSize: '14.5px', color: 'var(--primary)', cursor: 'pointer' }}
                            onClick={() => setDetailsTask(t)}
                            title="Click to view details"
                          >
                            {t.taskTitle}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                            📁 Project: <strong>{getProjectTitle(t.projectId)}</strong>
                          </div>
                          {t.taskDescription && (
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '3px', maxWidth: '340px' }}>
                              {t.taskDescription.slice(0, 80) + (t.taskDescription.length > 80 ? '...' : '')}
                            </div>
                          )}
                        </td>
                        <td>{getPriorityBadge(t.priorityID)}</td>
                        <td>
                          <div style={{ marginBottom: '4px' }}>
                            {getStatusBadge(t.taskStatus, t.completedDate)}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            📅 Due: <strong>{t.dueDate ? t.dueDate.split('T')[0] : 'N/A'}</strong>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span
                              className="badge"
                              style={{
                                background: t.earnedScore != null ? '#d1fae5' : '#f1f5f9',
                                color: t.earnedScore != null ? '#047857' : '#64748b',
                                border: '1px solid var(--border)',
                                fontWeight: '700',
                              }}
                            >
                              {t.earnedScore != null ? `${t.earnedScore} / ` : ''}{t.assignedScore} pts
                            </span>
                          </div>
                          {t.facultyRemarks && (
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', maxWidth: '180px', fontStyle: 'italic' }}>
                              💬 {t.facultyRemarks.slice(0, 50)}
                            </div>
                          )}
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span>🎓</span>
                            <div>
                              <strong>{studentName}</strong>
                            </div>
                          </div>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            <button
                              className="btn btn-sm btn-outline"
                              onClick={() => setDetailsTask(t)}
                              title="View Details"
                            >
                              👁️
                            </button>
                            <button
                              className="btn btn-sm btn-outline"
                              onClick={() => handleOpenEdit(t)}
                              title={isStudent ? 'Update Status / Remarks' : 'Edit Task'}
                            >
                              ✏️
                            </button>
                            {canManage && (
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => setDeleteConfirmTask(t)}
                                title="Delete Task"
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
                    <td colSpan="7" style={{ textAlign: 'center', padding: '35px', color: 'var(--text-muted)' }}>
                      No tasks found matching your filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add / Edit Task Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => !saving && setShowModal(false)}>
          <div className="modal" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0 }}>{editId ? 'Edit Task Details' : 'Allocate New Task'}</h3>
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
                <label className="form-label">Associated Project *</label>
                <select
                  className={`input-control ${formErrors.projectId ? 'input-error' : ''}`}
                  value={formData.projectId}
                  onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                  disabled={saving || (editId && isStudent)}
                >
                  <option value="">Select Project</option>
                  {projects.map((p) => (
                    <option key={p.projectId} value={p.projectId}>
                      {p.projectTitle} (Student: {getUserName(p.studentId)})
                    </option>
                  ))}
                </select>
                {formErrors.projectId && <span className="error-message">❌ {formErrors.projectId}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Task Title *</label>
                <input
                  className={`input-control ${formErrors.taskTitle ? 'input-error' : ''}`}
                  value={formData.taskTitle}
                  onChange={(e) => setFormData({ ...formData, taskTitle: e.target.value })}
                  placeholder="e.g. Design Entity Relationship Diagram & Schema"
                  disabled={saving || (editId && isStudent)}
                />
                {formErrors.taskTitle && <span className="error-message">❌ {formErrors.taskTitle}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Description / Deliverable Specs</label>
                <textarea
                  className={`input-control ${formErrors.taskDescription ? 'input-error' : ''}`}
                  rows={2}
                  value={formData.taskDescription}
                  onChange={(e) => setFormData({ ...formData, taskDescription: e.target.value })}
                  placeholder="Detailed criteria, expected inputs, deliverables, and guidelines..."
                  disabled={saving || (editId && isStudent)}
                />
                {formErrors.taskDescription && <span className="error-message">❌ {formErrors.taskDescription}</span>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Task Status *</label>
                  <select
                    className="input-control"
                    value={formData.taskStatus}
                    onChange={(e) => setFormData({ ...formData, taskStatus: e.target.value })}
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
                  <label className="form-label">Priority Level *</label>
                  <select
                    className="input-control"
                    value={formData.priorityID}
                    onChange={(e) => setFormData({ ...formData, priorityID: e.target.value })}
                    disabled={saving || (editId && isStudent)}
                  >
                    {priorities.map((pr) => (
                      <option key={pr.priorityID} value={pr.priorityID}>
                        {pr.priorityName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Assigned Score (Max Points) *</label>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    max="1000"
                    className={`input-control ${formErrors.assignedScore ? 'input-error' : ''}`}
                    value={formData.assignedScore}
                    onChange={(e) => setFormData({ ...formData, assignedScore: e.target.value })}
                    disabled={saving || (editId && isStudent)}
                  />
                  {formErrors.assignedScore && <span className="error-message">❌ {formErrors.assignedScore}</span>}
                </div>

                {canManage && (
                  <div className="form-group">
                    <label className="form-label">Earned Score (Evaluation)</label>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      max={formData.assignedScore || 1000}
                      className={`input-control ${formErrors.earnedScore ? 'input-error' : ''}`}
                      value={formData.earnedScore}
                      onChange={(e) => setFormData({ ...formData, earnedScore: e.target.value })}
                      placeholder="Pending evaluation"
                      disabled={saving}
                    />
                    {formErrors.earnedScore && <span className="error-message">❌ {formErrors.earnedScore}</span>}
                  </div>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Start Date</label>
                  <input
                    type="date"
                    className="input-control"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    disabled={saving || (editId && isStudent)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Due Date</label>
                  <input
                    type="date"
                    className={`input-control ${formErrors.dueDate ? 'input-error' : ''}`}
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    disabled={saving || (editId && isStudent)}
                  />
                  {formErrors.dueDate && <span className="error-message">❌ {formErrors.dueDate}</span>}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Student Remarks / Progress Notes</label>
                <textarea
                  className="input-control"
                  rows={2}
                  value={formData.studentRemarks}
                  onChange={(e) => setFormData({ ...formData, studentRemarks: e.target.value })}
                  placeholder="Student submission notes, links to work, or hurdles encountered..."
                  disabled={saving}
                />
              </div>

              {canManage && (
                <div className="form-group">
                  <label className="form-label">Faculty Supervisor Remarks / Feedback</label>
                  <textarea
                    className="input-control"
                    rows={2}
                    value={formData.facultyRemarks}
                    onChange={(e) => setFormData({ ...formData, facultyRemarks: e.target.value })}
                    placeholder="Feedback, evaluation comments, recommendations..."
                    disabled={saving}
                  />
                </div>
              )}

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
                  {saving ? 'Saving...' : editId ? 'Save Changes' : 'Allocate Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Task Details Modal */}
      {detailsTask && (
        <div className="modal-overlay" onClick={() => setDetailsTask(null)}>
          <div className="modal" style={{ maxWidth: '620px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '24px' }}>📝</span>
                <h3 style={{ margin: 0 }}>{detailsTask.taskTitle}</h3>
              </div>
              <button
                type="button"
                onClick={() => setDetailsTask(null)}
                style={{ background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                ×
              </button>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
              {getPriorityBadge(detailsTask.priorityID)}
              {getStatusBadge(detailsTask.taskStatus, detailsTask.completedDate)}
              <span className="badge badge-success">
                Score: {detailsTask.earnedScore != null ? `${detailsTask.earnedScore} / ` : ''}{detailsTask.assignedScore} Pts
              </span>
            </div>

            <div style={{ marginBottom: '18px', padding: '16px', background: 'var(--bg-base)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', fontWeight: '700' }}>
                PROJECT
              </div>
              <strong style={{ fontSize: '15px' }}>{getProjectTitle(detailsTask.projectId)}</strong>
              <div style={{ marginTop: '10px', fontSize: '13px', color: 'var(--text-main)' }}>
                {detailsTask.taskDescription || 'No description provided for this task.'}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '18px', fontSize: '13px' }}>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '11px' }}>START DATE</span>
                <strong>{detailsTask.startDate ? detailsTask.startDate.split('T')[0] : 'Not specified'}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '11px' }}>DUE DATE</span>
                <strong>{detailsTask.dueDate ? detailsTask.dueDate.split('T')[0] : 'Not specified'}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '11px' }}>COMPLETION DATE</span>
                <span>{detailsTask.completedDate ? detailsTask.completedDate.split('T')[0] : 'In Progress'}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '11px' }}>PROGRESS</span>
                <strong>{detailsTask.progressPercentage || 0}%</strong>
              </div>
            </div>

            {/* Remarks Section */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
                  🎓 Student Remarks / Submission:
                </span>
                <p style={{ margin: 0, fontSize: '13px', fontStyle: detailsTask.studentRemarks ? 'normal' : 'italic', color: detailsTask.studentRemarks ? 'var(--text-main)' : 'var(--text-muted)' }}>
                  {detailsTask.studentRemarks || 'No remarks provided yet.'}
                </p>
              </div>

              <div>
                <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--primary)', display: 'block', marginBottom: '4px' }}>
                  👩‍🏫 Faculty Supervisor Remarks & Feedback:
                </span>
                <p style={{ margin: 0, fontSize: '13px', fontStyle: detailsTask.facultyRemarks ? 'normal' : 'italic', color: detailsTask.facultyRemarks ? 'var(--text-main)' : 'var(--text-muted)' }}>
                  {detailsTask.facultyRemarks || 'Pending supervisor evaluation.'}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '22px', gap: '10px' }}>
              <button
                className="btn btn-outline"
                onClick={() => {
                  setDetailsTask(null);
                  handleOpenEdit(detailsTask);
                }}
              >
                ✏️ Edit Task
              </button>
              <button className="btn" onClick={() => setDetailsTask(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmTask && (
        <div className="modal-overlay" onClick={() => !deleting && setDeleteConfirmTask(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ color: 'var(--danger)', marginBottom: '12px' }}>Confirm Task Deletion</h3>
            <p>
              Are you sure you want to delete task <strong>"{deleteConfirmTask.taskTitle}"</strong>?
            </p>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              This deliverable will be marked as deleted in the database.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setDeleteConfirmTask(null)}
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

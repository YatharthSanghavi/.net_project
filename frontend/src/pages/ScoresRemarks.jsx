import React, { useState, useEffect } from 'react';
import apiService from '../services/apiService';

export default function ScoresRemarks({ userRole, currentUser, showToast }) {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  const [evaluationFilter, setEvaluationFilter] = useState('All');

  // Evaluation modal
  const [evaluatingTask, setEvaluatingTask] = useState(null);
  const [evalData, setEvalData] = useState({
    earnedScore: '',
    facultyRemarks: '',
    studentRemarks: '',
    markCompleted: false,
  });
  const [evalError, setEvalError] = useState('');
  const [saving, setSaving] = useState(false);

  const isAdmin = userRole === 'Admin';
  const isFaculty = userRole === 'Faculty';
  const isStudent = userRole === 'Student';
  const canGrade = isAdmin || isFaculty;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [tasksData, projData, usersData, statusData] = await Promise.all([
        apiService.tasks.getAll().catch(() => []),
        apiService.projects.getAll().catch(() => []),
        apiService.users.getAll().catch(() => []),
        apiService.status.getAll().catch(() => []),
      ]);

      setTasks(Array.isArray(tasksData) ? tasksData : []);
      setProjects(Array.isArray(projData) ? projData : []);
      setUsers(Array.isArray(usersData) ? usersData : []);
      setStatuses(Array.isArray(statusData) ? statusData : []);
    } catch (err) {
      setError(err.message || 'Failed to load evaluation scores.');
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

  const getStudentForTask = (projectId) => {
    const proj = getProject(projectId);
    return proj ? getUserName(proj.studentId) : 'Unassigned';
  };

  const handleOpenEvaluate = (task) => {
    setEvaluatingTask(task);
    setEvalData({
      earnedScore: task.earnedScore != null ? String(task.earnedScore) : '',
      facultyRemarks: task.facultyRemarks || '',
      studentRemarks: task.studentRemarks || '',
      markCompleted: task.completedDate != null || task.progressPercentage === 100,
    });
    setEvalError('');
  };

  const handleSaveEvaluation = async (e) => {
    e.preventDefault();
    if (!evaluatingTask) return;

    const assigned = Number(evaluatingTask.assignedScore);
    const earned = evalData.earnedScore !== '' ? Number(evalData.earnedScore) : null;

    if (canGrade && earned !== null) {
      if (isNaN(earned) || earned < 0) {
        setEvalError('Earned score must be a non-negative number.');
        return;
      }
      if (earned > assigned) {
        setEvalError(`Earned score cannot exceed assigned score (${assigned}).`);
        return;
      }
    }

    setSaving(true);
    try {
      // Find Completed status if checked
      const completedStatus = statuses.find((s) => s.statusName?.toLowerCase().includes('complete'));
      const statusId = evalData.markCompleted && completedStatus
        ? completedStatus.statusID
        : evaluatingTask.taskStatus;

      const payload = {
        ...evaluatingTask,
        taskStatus: statusId,
        earnedScore: earned,
        completedDate: evalData.markCompleted ? (evaluatingTask.completedDate || new Date().toISOString()) : (evalData.markCompleted === false ? null : evaluatingTask.completedDate),
        facultyRemarks: canGrade ? (evalData.facultyRemarks.trim() || null) : evaluatingTask.facultyRemarks,
        studentRemarks: evalData.studentRemarks.trim() || null,
      };

      await apiService.tasks.update(evaluatingTask.taskId, payload);
      if (showToast) showToast('Evaluation feedback saved successfully!', 'success');
      setEvaluatingTask(null);
      await loadData();
    } catch (err) {
      setEvalError(err.message || 'Failed to save evaluation');
    } finally {
      setSaving(false);
    }
  };

  // Filtration logic
  const filtered = tasks.filter((t) => {
    const proj = getProject(t.projectId);
    const studentName = proj ? getUserName(proj.studentId) : '';
    const projTitle = proj ? proj.projectTitle : '';

    const matchesSearch =
      t.taskTitle?.toLowerCase().includes(search.toLowerCase()) ||
      studentName.toLowerCase().includes(search.toLowerCase()) ||
      projTitle.toLowerCase().includes(search.toLowerCase());

    const isGraded = t.earnedScore != null;
    let matchesEval = true;
    if (evaluationFilter === 'Graded') matchesEval = isGraded;
    if (evaluationFilter === 'Pending') matchesEval = !isGraded;

    if (isStudent && currentUser?.userId && proj) {
      if (proj.studentId !== currentUser.userId) return false;
    }

    return matchesSearch && matchesEval;
  });

  // Calculate summary stats
  const totalAssignedPoints = filtered.reduce((acc, t) => acc + (Number(t.assignedScore) || 0), 0);
  const totalEarnedPoints = filtered.reduce((acc, t) => acc + (Number(t.earnedScore) || 0), 0);
  const gradedTasksCount = filtered.filter((t) => t.earnedScore != null).length;
  const averagePercentage = totalAssignedPoints > 0 ? Math.round((totalEarnedPoints / totalAssignedPoints) * 100) : 0;

  return (
    <div className="content-wrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h2>Evaluation Scores & Feedback</h2>
          <p style={{ margin: 0 }}>Review student milestone scores, assign grades, and provide constructive feedback.</p>
        </div>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '16px' }}>
          <span>⚠️</span>
          <div style={{ flex: 1 }}>{error}</div>
          <button className="btn btn-sm btn-outline" onClick={loadData} style={{ marginLeft: '12px' }}>
            Retry
          </button>
        </div>
      )}

      {/* KPI Cards for Evaluation */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="card" style={{ padding: '18px', margin: 0 }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>TOTAL ASSIGNED POINTS</div>
          <div style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-main)', marginTop: '4px' }}>
            {totalAssignedPoints} pts
          </div>
        </div>

        <div className="card" style={{ padding: '18px', margin: 0 }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>TOTAL EARNED POINTS</div>
          <div style={{ fontSize: '26px', fontWeight: '800', color: 'var(--success)', marginTop: '4px' }}>
            {totalEarnedPoints} pts
          </div>
        </div>

        <div className="card" style={{ padding: '18px', margin: 0 }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>OVERALL GRADE RATIO</div>
          <div style={{ fontSize: '26px', fontWeight: '800', color: 'var(--primary)', marginTop: '4px' }}>
            {averagePercentage}%
          </div>
        </div>

        <div className="card" style={{ padding: '18px', margin: 0 }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>GRADED DELIVERABLES</div>
          <div style={{ fontSize: '26px', fontWeight: '800', color: 'var(--info)', marginTop: '4px' }}>
            {gradedTasksCount} / {filtered.length}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="search-container" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="search-input-wrapper" style={{ maxWidth: '320px', flex: 1 }}>
            <span className="search-icon">🔍</span>
            <input
              className="input-control"
              placeholder="Search student, task, project..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <select
              className="input-control"
              value={evaluationFilter}
              onChange={(e) => setEvaluationFilter(e.target.value)}
              style={{ width: '180px', background: '#fff' }}
            >
              <option value="All">All Deliverables</option>
              <option value="Graded">Graded Only</option>
              <option value="Pending">Pending Grading</option>
            </select>
          </div>
        </div>

        <div className="table-container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              ⏳ Loading scores & evaluations...
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: '50px' }}>#</th>
                  <th>Student Candidate</th>
                  <th>Task & Project Deliverable</th>
                  <th>Score Evaluation</th>
                  <th>Supervisor Feedback</th>
                  <th>Student Notes</th>
                  <th style={{ width: '120px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((t, i) => {
                    const studentName = getStudentForTask(t.projectId);
                    const isGraded = t.earnedScore != null;

                    return (
                      <tr key={t.taskId}>
                        <td>{i + 1}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '18px' }}>🎓</span>
                            <div>
                              <strong>{studentName}</strong>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ fontWeight: '700', fontSize: '14px' }}>{t.taskTitle}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                            📁 {getProjectTitle(t.projectId)}
                          </div>
                        </td>
                        <td>
                          {isGraded ? (
                            <div>
                              <span className="badge badge-success" style={{ fontWeight: '700' }}>
                                {t.earnedScore} / {t.assignedScore} Pts
                              </span>
                              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                                {Math.round((t.earnedScore / t.assignedScore) * 100)}% Performance
                              </div>
                            </div>
                          ) : (
                            <span className="badge badge-warning" style={{ fontWeight: '600' }}>
                              Pending ({t.assignedScore} Pts Max)
                            </span>
                          )}
                        </td>
                        <td>
                          {t.facultyRemarks ? (
                            <div style={{ fontSize: '12px', color: 'var(--text-main)' }}>
                              💬 {t.facultyRemarks}
                            </div>
                          ) : (
                            <span style={{ fontSize: '12px', fontStyle: 'italic', color: 'var(--text-muted)' }}>
                              No feedback recorded yet
                            </span>
                          )}
                        </td>
                        <td>
                          {t.studentRemarks ? (
                            <div style={{ fontSize: '12px', color: 'var(--text-main)' }}>
                              📝 {t.studentRemarks}
                            </div>
                          ) : (
                            <span style={{ fontSize: '12px', fontStyle: 'italic', color: 'var(--text-muted)' }}>
                              No student remarks
                            </span>
                          )}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <button
                            className="btn btn-sm btn-outline"
                            onClick={() => handleOpenEvaluate(t)}
                            title={canGrade ? 'Grade & Feedback' : 'View / Add Remarks'}
                          >
                            {canGrade ? '📝 Grade' : '💬 Remarks'}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '35px', color: 'var(--text-muted)' }}>
                      No evaluation records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Evaluate / Grade Modal */}
      {evaluatingTask && (
        <div className="modal-overlay" onClick={() => !saving && setEvaluatingTask(null)}>
          <div className="modal" style={{ maxWidth: '580px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '22px' }}>📝</span>
                <h3 style={{ margin: 0 }}>
                  {canGrade ? 'Evaluate Deliverable & Remarks' : 'Student Submission Remarks'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEvaluatingTask(null)}
                style={{ background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                ×
              </button>
            </div>

            <div style={{ padding: '14px', background: 'var(--bg-base)', borderRadius: 'var(--radius-md)', marginBottom: '16px' }}>
              <strong style={{ fontSize: '15px' }}>{evaluatingTask.taskTitle}</strong>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                📁 Project: {getProjectTitle(evaluatingTask.projectId)} • Student: {getStudentForTask(evaluatingTask.projectId)}
              </div>
              <div style={{ fontSize: '12px', marginTop: '6px' }}>
                Assigned Maximum Score: <strong>{evaluatingTask.assignedScore} Points</strong>
              </div>
            </div>

            {evalError && (
              <div className="alert alert-error" style={{ marginBottom: '14px' }}>
                <span>❌</span>
                <div>{evalError}</div>
              </div>
            )}

            <form onSubmit={handleSaveEvaluation}>
              {canGrade && (
                <>
                  <div className="form-group">
                    <label className="form-label">
                      Earned Score (Max: {evaluatingTask.assignedScore}) *
                    </label>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      max={evaluatingTask.assignedScore}
                      className="input-control"
                      value={evalData.earnedScore}
                      onChange={(e) => setEvalData({ ...evalData, earnedScore: e.target.value })}
                      placeholder={`0 - ${evaluatingTask.assignedScore}`}
                      disabled={saving}
                      autoFocus
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Faculty Feedback & Remarks</label>
                    <textarea
                      className="input-control"
                      rows={3}
                      value={evalData.facultyRemarks}
                      onChange={(e) => setEvalData({ ...evalData, facultyRemarks: e.target.value })}
                      placeholder="Enter constructive feedback, critique, and commendations..."
                      disabled={saving}
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <input
                      type="checkbox"
                      id="markCompleted"
                      checked={evalData.markCompleted}
                      onChange={(e) => setEvalData({ ...evalData, markCompleted: e.target.checked })}
                      disabled={saving}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    <label htmlFor="markCompleted" style={{ cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
                      Mark this task deliverable as Completed
                    </label>
                  </div>
                </>
              )}

              <div className="form-group">
                <label className="form-label">Student Submission Notes / Response</label>
                <textarea
                  className="input-control"
                  rows={2}
                  value={evalData.studentRemarks}
                  onChange={(e) => setEvalData({ ...evalData, studentRemarks: e.target.value })}
                  placeholder="Student notes or responses regarding this evaluation..."
                  disabled={saving}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setEvaluatingTask(null)}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button type="submit" className="btn" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Feedback & Score'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

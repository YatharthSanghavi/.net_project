import React, { useState, useEffect } from 'react';
import apiService from '../../services/apiService';

export default function StatusPriorityList({ userRole, showToast }) {
  const [tab, setTab] = useState('status'); // 'status' or 'priority'
  const [statuses, setStatuses] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [editStatusId, setEditStatusId] = useState(null);
  const [statusForm, setStatusForm] = useState({ statusName: '', statusCssClass: 'badge-info' });

  const [showPriorityModal, setShowPriorityModal] = useState(false);
  const [editPriorityId, setEditPriorityId] = useState(null);
  const [priorityForm, setPriorityForm] = useState({ priorityName: '', priortyCssClass: 'badge-warning' });

  const [deleteConfirm, setDeleteConfirm] = useState(null); // { type: 'status'|'priority', item }
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isAdmin = userRole === 'Admin';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [sData, pData] = await Promise.all([
        apiService.status.getAll().catch(() => []),
        apiService.priority.getAll().catch(() => []),
      ]);
      setStatuses(Array.isArray(sData) ? sData : []);
      setPriorities(Array.isArray(pData) ? pData : []);
    } catch (err) {
      setError(err.message || 'Failed to load configuration lists.');
    } finally {
      setLoading(false);
    }
  };

  // Status handlers
  const handleOpenAddStatus = () => {
    setEditStatusId(null);
    setStatusForm({ statusName: '', statusCssClass: 'badge-info' });
    setShowStatusModal(true);
  };

  const handleOpenEditStatus = (s) => {
    setEditStatusId(s.statusID);
    setStatusForm({ statusName: s.statusName, statusCssClass: s.statusCssClass || 'badge-info' });
    setShowStatusModal(true);
  };

  const handleSaveStatus = async (e) => {
    e.preventDefault();
    if (!statusForm.statusName.trim()) return;

    setSaving(true);
    try {
      const payload = {
        statusID: editStatusId || 0,
        statusName: statusForm.statusName.trim(),
        statusCssClass: statusForm.statusCssClass.trim() || 'badge-info',
      };

      if (editStatusId) {
        await apiService.status.update(editStatusId, payload);
        if (showToast) showToast('Status updated successfully!', 'success');
      } else {
        await apiService.status.create(payload);
        if (showToast) showToast('Status created successfully!', 'success');
      }
      setShowStatusModal(false);
      await loadData();
    } catch (err) {
      if (showToast) showToast(err.message || 'Failed to save status', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Priority handlers
  const handleOpenAddPriority = () => {
    setEditPriorityId(null);
    setPriorityForm({ priorityName: '', priortyCssClass: 'badge-warning' });
    setShowPriorityModal(true);
  };

  const handleOpenEditPriority = (pr) => {
    setEditPriorityId(pr.priorityID);
    setPriorityForm({ priorityName: pr.priorityName, priortyCssClass: pr.priortyCssClass || 'badge-warning' });
    setShowPriorityModal(true);
  };

  const handleSavePriority = async (e) => {
    e.preventDefault();
    if (!priorityForm.priorityName.trim()) return;

    setSaving(true);
    try {
      const payload = {
        priorityID: editPriorityId || 0,
        priorityName: priorityForm.priorityName.trim(),
        priortyCssClass: priorityForm.priortyCssClass.trim() || 'badge-warning',
      };

      if (editPriorityId) {
        await apiService.priority.update(editPriorityId, payload);
        if (showToast) showToast('Priority updated successfully!', 'success');
      } else {
        await apiService.priority.create(payload);
        if (showToast) showToast('Priority created successfully!', 'success');
      }
      setShowPriorityModal(false);
      await loadData();
    } catch (err) {
      if (showToast) showToast(err.message || 'Failed to save priority', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Delete handler
  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;
    setDeleting(true);
    try {
      if (deleteConfirm.type === 'status') {
        await apiService.status.delete(deleteConfirm.item.statusID);
        if (showToast) showToast('Status removed!', 'success');
      } else {
        await apiService.priority.delete(deleteConfirm.item.priorityID);
        if (showToast) showToast('Priority removed!', 'success');
      }
      setDeleteConfirm(null);
      await loadData();
    } catch (err) {
      if (showToast) showToast(err.message || 'Failed to delete item', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="content-wrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h2>Statuses & Priorities Master Configuration</h2>
          <p style={{ margin: 0 }}>Configure lifecycle stages and priority levels for projects and task deliverables.</p>
        </div>
        {isAdmin && (
          <div>
            {tab === 'status' ? (
              <button className="btn" onClick={handleOpenAddStatus}>
                <span>➕</span> Add New Status
              </button>
            ) : (
              <button className="btn" onClick={handleOpenAddPriority}>
                <span>➕</span> Add New Priority
              </button>
            )}
          </div>
        )}
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

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
        <button
          className={`btn ${tab === 'status' ? '' : 'btn-outline'}`}
          onClick={() => setTab('status')}
          style={{ padding: '8px 20px' }}
        >
          📌 Project & Task Statuses ({statuses.length})
        </button>
        <button
          className={`btn ${tab === 'priority' ? '' : 'btn-outline'}`}
          onClick={() => setTab('priority')}
          style={{ padding: '8px 20px' }}
        >
          🔥 Task Priority Levels ({priorities.length})
        </button>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            ⏳ Loading configurations...
          </div>
        ) : tab === 'status' ? (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>Status ID</th>
                  <th>Status Name</th>
                  <th>Badge Styling CSS Class</th>
                  <th>Preview Badge</th>
                  {isAdmin && <th style={{ width: '120px', textAlign: 'center' }}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {statuses.length > 0 ? (
                  statuses.map((s) => (
                    <tr key={s.statusID}>
                      <td>#{s.statusID}</td>
                      <td>
                        <strong>{s.statusName}</strong>
                      </td>
                      <td>
                        <code>{s.statusCssClass}</code>
                      </td>
                      <td>
                        <span className={`badge ${s.statusCssClass || 'badge-info'}`}>
                          {s.statusName}
                        </span>
                      </td>
                      {isAdmin && (
                        <td style={{ textAlign: 'center' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            <button
                              className="btn btn-sm btn-outline"
                              onClick={() => handleOpenEditStatus(s)}
                            >
                              ✏️
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => setDeleteConfirm({ type: 'status', item: s })}
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                      No statuses defined.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>Priority ID</th>
                  <th>Priority Name</th>
                  <th>Badge Styling CSS Class</th>
                  <th>Preview Badge</th>
                  {isAdmin && <th style={{ width: '120px', textAlign: 'center' }}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {priorities.length > 0 ? (
                  priorities.map((pr) => (
                    <tr key={pr.priorityID}>
                      <td>#{pr.priorityID}</td>
                      <td>
                        <strong>{pr.priorityName}</strong>
                      </td>
                      <td>
                        <code>{pr.priortyCssClass}</code>
                      </td>
                      <td>
                        <span className={`badge ${pr.priortyCssClass || 'badge-warning'}`}>
                          {pr.priorityName}
                        </span>
                      </td>
                      {isAdmin && (
                        <td style={{ textAlign: 'center' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            <button
                              className="btn btn-sm btn-outline"
                              onClick={() => handleOpenEditPriority(pr)}
                            >
                              ✏️
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => setDeleteConfirm({ type: 'priority', item: pr })}
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                      No priorities defined.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Status Modal */}
      {showStatusModal && (
        <div className="modal-overlay" onClick={() => !saving && setShowStatusModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0 }}>{editStatusId ? 'Edit Status' : 'Add Status'}</h3>
              <button
                type="button"
                onClick={() => setShowStatusModal(false)}
                style={{ background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveStatus}>
              <div className="form-group">
                <label className="form-label">Status Name (max 20 chars) *</label>
                <input
                  className="input-control"
                  maxLength={20}
                  value={statusForm.statusName}
                  onChange={(e) => setStatusForm({ ...statusForm, statusName: e.target.value })}
                  placeholder="e.g. In Review, Approved"
                  required
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label className="form-label">CSS Class for Badge</label>
                <select
                  className="input-control"
                  value={statusForm.statusCssClass}
                  onChange={(e) => setStatusForm({ ...statusForm, statusCssClass: e.target.value })}
                >
                  <option value="badge-info">badge-info (Cyan / Neutral)</option>
                  <option value="badge-warning">badge-warning (Amber / Progress)</option>
                  <option value="badge-success">badge-success (Emerald / Completed)</option>
                  <option value="badge-danger">badge-danger (Rose / Blocked)</option>
                </select>
              </div>

              <div style={{ marginTop: '12px', padding: '10px', background: 'var(--bg-base)', borderRadius: '6px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Live Preview:
                </span>
                <span className={`badge ${statusForm.statusCssClass}`}>
                  {statusForm.statusName || 'Status Name'}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowStatusModal(false)}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button type="submit" className="btn" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Priority Modal */}
      {showPriorityModal && (
        <div className="modal-overlay" onClick={() => !saving && setShowPriorityModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0 }}>{editPriorityId ? 'Edit Priority' : 'Add Priority'}</h3>
              <button
                type="button"
                onClick={() => setShowPriorityModal(false)}
                style={{ background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSavePriority}>
              <div className="form-group">
                <label className="form-label">Priority Name (max 20 chars) *</label>
                <input
                  className="input-control"
                  maxLength={20}
                  value={priorityForm.priorityName}
                  onChange={(e) => setPriorityForm({ ...priorityForm, priorityName: e.target.value })}
                  placeholder="e.g. Critical, High, Normal, Low"
                  required
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label className="form-label">CSS Class for Badge</label>
                <select
                  className="input-control"
                  value={priorityForm.priortyCssClass}
                  onChange={(e) => setPriorityForm({ ...priorityForm, priortyCssClass: e.target.value })}
                >
                  <option value="badge-danger">badge-danger (Rose / Critical)</option>
                  <option value="badge-warning">badge-warning (Amber / High)</option>
                  <option value="badge-info">badge-info (Cyan / Medium)</option>
                  <option value="badge-secondary">badge-secondary (Cool Grey / Low)</option>
                </select>
              </div>

              <div style={{ marginTop: '12px', padding: '10px', background: 'var(--bg-base)', borderRadius: '6px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Live Preview:
                </span>
                <span className={`badge ${priorityForm.priortyCssClass}`}>
                  {priorityForm.priorityName || 'Priority Name'}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowPriorityModal(false)}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button type="submit" className="btn" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Priority'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => !deleting && setDeleteConfirm(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ color: 'var(--danger)', marginBottom: '12px' }}>
              Confirm {deleteConfirm.type === 'status' ? 'Status' : 'Priority'} Deletion
            </h3>
            <p>
              Are you sure you want to delete{' '}
              <strong>
                "{deleteConfirm.type === 'status' ? deleteConfirm.item.statusName : deleteConfirm.item.priorityName}"
              </strong>?
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setDeleteConfirm(null)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDeleteConfirm}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import apiService from '../../services/apiService';

export default function RolesList({ userRole, showToast }) {
  const [roles, setRoles] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ roleName: '', description: '' });
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Delete confirmation modal
  const [deleteConfirmRole, setDeleteConfirmRole] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const isAdmin = userRole === 'Admin';

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiService.roles.getAll();
      setRoles(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Could not load roles from backend API.');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.roleName.trim()) {
      errs.roleName = 'Role name is required.';
    } else if (formData.roleName.length > 50) {
      errs.roleName = 'Role name cannot exceed 50 characters.';
    } else if (!/^[a-zA-Z0-9\s]+$/.test(formData.roleName)) {
      errs.roleName = 'Role name can only contain letters, numbers, and spaces.';
    }

    if (formData.description && formData.description.length > 250) {
      errs.description = 'Description cannot exceed 250 characters.';
    }

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleOpenAdd = () => {
    setEditId(null);
    setFormData({ roleName: '', description: '' });
    setFormErrors({});
    setShowModal(true);
  };

  const handleOpenEdit = (role) => {
    setEditId(role.roleId);
    setFormData({
      roleName: role.roleName || '',
      description: role.description || '',
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
        roleId: editId || 0,
        roleName: formData.roleName.trim(),
        description: formData.description.trim() || null,
      };

      if (editId) {
        await apiService.roles.update(editId, payload);
        if (showToast) showToast('Role updated successfully!', 'success');
      } else {
        await apiService.roles.create(payload);
        if (showToast) showToast('Role created successfully!', 'success');
      }

      setShowModal(false);
      await loadRoles();
    } catch (err) {
      if (showToast) showToast(err.message || 'Operation failed', 'error');
      else setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmRole) return;
    setDeleting(true);
    try {
      await apiService.roles.delete(deleteConfirmRole.roleId);
      if (showToast) showToast(`Role "${deleteConfirmRole.roleName}" deleted!`, 'success');
      setDeleteConfirmRole(null);
      await loadRoles();
    } catch (err) {
      if (showToast) showToast(err.message || 'Failed to delete role', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const filtered = roles.filter(
    (r) =>
      r.roleName?.toLowerCase().includes(search.toLowerCase()) ||
      r.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="content-wrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h2>System Role Definitions</h2>
          <p style={{ margin: 0 }}>Configure access levels and security roles within the project management portal.</p>
        </div>
        {isAdmin && (
          <button className="btn" onClick={handleOpenAdd} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>➕</span> Add New Role
          </button>
        )}
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '16px' }}>
          <span>⚠️</span>
          <div style={{ flex: 1 }}>{error}</div>
          <button className="btn btn-sm btn-outline" onClick={loadRoles} style={{ marginLeft: '12px' }}>
            Retry
          </button>
        </div>
      )}

      <div className="card">
        <div className="search-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div className="search-input-wrapper" style={{ maxWidth: '320px', flex: 1 }}>
            <span className="search-icon">🔍</span>
            <input
              className="input-control"
              placeholder="Search roles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Showing <strong>{filtered.length}</strong> of <strong>{roles.length}</strong> roles
          </span>
        </div>

        <div className="table-container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              ⏳ Loading roles from server...
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>ID</th>
                  <th>Role Name</th>
                  <th>Description</th>
                  {isAdmin && <th style={{ width: '130px', textAlign: 'center' }}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((role) => (
                    <tr key={role.roleId}>
                      <td style={{ fontWeight: '600', color: 'var(--text-muted)' }}>#{role.roleId}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className="badge badge-info" style={{ fontWeight: '600' }}>
                            🛡️ {role.roleName}
                          </span>
                        </div>
                      </td>
                      <td style={{ color: role.description ? 'var(--text-main)' : 'var(--text-muted)' }}>
                        {role.description || <em>No description provided.</em>}
                      </td>
                      {isAdmin && (
                        <td style={{ textAlign: 'center' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            <button
                              className="btn btn-sm btn-outline"
                              onClick={() => handleOpenEdit(role)}
                              title="Edit Role"
                            >
                              ✏️
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => setDeleteConfirmRole(role)}
                              title="Delete Role"
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
                    <td colSpan={isAdmin ? 4 : 3} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                      No roles found matching the search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add / Edit Role Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => !saving && setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0 }}>{editId ? 'Edit Role' : 'Create New Role'}</h3>
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
                <label className="form-label">Role Name *</label>
                <input
                  className={`input-control ${formErrors.roleName ? 'input-error' : ''}`}
                  value={formData.roleName}
                  onChange={(e) => setFormData({ ...formData, roleName: e.target.value })}
                  placeholder="e.g. Admin, Coordinator, Reviewer"
                  disabled={saving}
                  autoFocus
                />
                {formErrors.roleName && <span className="error-message">❌ {formErrors.roleName}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className={`input-control ${formErrors.description ? 'input-error' : ''}`}
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Briefly describe the responsibilities of this role..."
                  disabled={saving}
                />
                {formErrors.description && <span className="error-message">❌ {formErrors.description}</span>}
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
                  {saving ? 'Saving...' : editId ? 'Save Changes' : 'Create Role'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmRole && (
        <div className="modal-overlay" onClick={() => !deleting && setDeleteConfirmRole(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ color: 'var(--danger)', marginBottom: '12px' }}>Confirm Role Deletion</h3>
            <p>
              Are you sure you want to permanently delete the role <strong>"{deleteConfirmRole.roleName}"</strong>?
            </p>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Note: This role will be removed from the system. Users currently assigned to this role may lose their permissions.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setDeleteConfirmRole(null)}
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
                {deleting ? 'Deleting...' : 'Delete Role'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
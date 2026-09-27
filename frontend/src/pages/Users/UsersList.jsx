import React, { useState, useEffect } from 'react';
import apiService from '../../services/apiService';

export default function UsersList({ userRole, showToast }) {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [userRolesMap, setUserRolesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    mobileNumber: '',
    profilePicturePath: '/images/default-avatar.png',
    isActive: true,
    roleId: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Delete modal
  const [deleteConfirmUser, setDeleteConfirmUser] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const isAdmin = userRole === 'Admin';
  const isFaculty = userRole === 'Faculty';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [usersData, rolesData, userRolesData] = await Promise.all([
        apiService.users.getAll().catch(() => []),
        apiService.roles.getAll().catch(() => []),
        apiService.userRoles.getAll().catch(() => []),
      ]);

      const map = {};
      if (Array.isArray(userRolesData)) {
        userRolesData.forEach((ur) => {
          map[ur.userId] = ur.roleId;
        });
      }
      setUserRolesMap(map);

      setUsers(Array.isArray(usersData) ? usersData : []);
      setRoles(Array.isArray(rolesData) ? rolesData : []);
    } catch (err) {
      setError(err.message || 'Failed to fetch user accounts.');
    } finally {
      setLoading(false);
    }
  };

  const getRoleName = (userId) => {
    const roleId = userRolesMap[userId];
    if (!roleId) return 'Student';
    const role = roles.find((r) => r.roleId === roleId);
    return role ? role.roleName : 'Student';
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.fullName.trim()) {
      errs.fullName = 'Full name is required.';
    } else if (!/^[a-zA-Z\s]{2,150}$/.test(formData.fullName)) {
      errs.fullName = 'Name must be 2-150 letters and spaces only.';
    }

    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Invalid email address.';
    }

    if (!editId) {
      if (!formData.password) {
        errs.password = 'Password is required.';
      } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(formData.password)) {
        errs.password = 'Password must be 8+ chars with uppercase, lowercase, digit, and special char (@$!%*?&).';
      }
    } else if (formData.password) {
      if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(formData.password)) {
        errs.password = 'Password must be 8+ chars with uppercase, lowercase, digit, and special char (@$!%*?&).';
      }
    }

    if (!formData.mobileNumber.trim()) {
      errs.mobileNumber = 'Mobile number is required.';
    } else if (!/^[0-9+\-() ]{10,15}$/.test(formData.mobileNumber)) {
      errs.mobileNumber = 'Mobile number must be 10-15 digits.';
    }

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleOpenAdd = () => {
    setEditId(null);
    const defaultRoleId = roles.length > 0 ? roles[0].roleId : '';
    setFormData({
      fullName: '',
      email: '',
      password: '',
      mobileNumber: '',
      profilePicturePath: '/images/default-avatar.png',
      isActive: true,
      roleId: defaultRoleId,
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleOpenEdit = (user) => {
    setEditId(user.userId);
    const userRoleId = userRolesMap[user.userId] || (roles[0] ? roles[0].roleId : '');
    setFormData({
      fullName: user.fullName || '',
      email: user.email || '',
      password: user.password || '',
      mobileNumber: user.mobileNumber || '',
      profilePicturePath: user.profilePicturePath || '/images/default-avatar.png',
      isActive: user.isActive !== false,
      roleId: userRoleId,
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
        userId: editId || 0,
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password || 'User@123',
        mobileNumber: formData.mobileNumber.trim(),
        profilePicturePath: formData.profilePicturePath || '/images/default-avatar.png',
        isActive: formData.isActive,
      };

      if (editId) {
        await apiService.users.update(editId, payload);

        // Update role if selected and different
        if (formData.roleId) {
          const currentRoleId = userRolesMap[editId];
          if (currentRoleId !== Number(formData.roleId)) {
            await apiService.userRoles.create({
              roleId: Number(formData.roleId),
              userId: editId,
            }).catch(() => {});
          }
        }

        if (showToast) showToast('User updated successfully!', 'success');
      } else {
        await apiService.users.create(payload);

        // Fetch newly created users list to find new user ID
        const refreshedUsers = await apiService.users.getAll();
        const createdUser = refreshedUsers.find((u) => u.email.toLowerCase() === payload.email.toLowerCase());
        if (createdUser && formData.roleId) {
          await apiService.userRoles.create({
            roleId: Number(formData.roleId),
            userId: createdUser.userId,
          }).catch(() => {});
        }

        if (showToast) showToast('User created successfully!', 'success');
      }

      setShowModal(false);
      await loadData();
    } catch (err) {
      if (showToast) showToast(err.message || 'Error saving user', 'error');
      else setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmUser) return;
    setDeleting(true);
    try {
      await apiService.users.delete(deleteConfirmUser.userId);
      if (showToast) showToast(`User "${deleteConfirmUser.fullName}" removed!`, 'success');
      setDeleteConfirmUser(null);
      await loadData();
    } catch (err) {
      if (showToast) showToast(err.message || 'Failed to delete user', 'error');
    } finally {
      setDeleting(false);
    }
  };

  // Filtration logic
  const filtered = users.filter((u) => {
    const roleName = getRoleName(u.userId);
    const matchesSearch =
      u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      (u.mobileNumber && u.mobileNumber.includes(search));
    const matchesRole = selectedRole === 'All' || roleName === selectedRole;
    const matchesStatus =
      selectedStatus === 'All' ||
      (selectedStatus === 'Active' ? u.isActive : !u.isActive);
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleBadge = (role) => {
    switch (role) {
      case 'Admin':
        return <span className="badge badge-danger">Admin</span>;
      case 'Faculty':
        return <span className="badge badge-success">Faculty</span>;
      case 'Student':
        return <span className="badge badge-info">Student</span>;
      default:
        return <span className="badge">{role}</span>;
    }
  };

  return (
    <div className="content-wrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h2>User Accounts Management</h2>
          <p style={{ margin: 0 }}>Audit system users, assign academic roles, contact details, and account states.</p>
        </div>
        {isAdmin && (
          <button className="btn" onClick={handleOpenAdd} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>➕</span> Add New User
          </button>
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

      <div className="card">
        {/* Multi-field search & filters */}
        <div className="search-container" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', width: '100%', alignItems: 'center' }}>
          <div className="search-input-wrapper" style={{ flex: 2, minWidth: '220px' }}>
            <span className="search-icon">🔍</span>
            <input
              className="input-control"
              placeholder="Search by name, email, or mobile..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ flex: 1, minWidth: '140px' }}>
            <select
              className="input-control"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              style={{ background: '#fff' }}
            >
              <option value="All">All Roles</option>
              {roles.map((r) => (
                <option key={r.roleId} value={r.roleName}>
                  {r.roleName}
                </option>
              ))}
            </select>
          </div>

          <div style={{ flex: 1, minWidth: '140px' }}>
            <select
              className="input-control"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              style={{ background: '#fff' }}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="table-container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              ⏳ Loading users from server...
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>#</th>
                  <th>Full Name</th>
                  <th>Contact Details</th>
                  <th>Assigned Role</th>
                  <th>Account Status</th>
                  {(isAdmin || isFaculty) && <th style={{ width: '120px', textAlign: 'center' }}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((u, i) => {
                    const roleName = getRoleName(u.userId);
                    return (
                      <tr key={u.userId}>
                        <td>{i + 1}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div
                              style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, var(--primary) 0%, #06b6d4 100%)',
                                color: '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: '700',
                                fontSize: '14px',
                              }}
                            >
                              {u.fullName?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div>
                              <strong>{u.fullName}</strong>
                              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ID: #{u.userId}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ fontSize: '13px' }}>
                            <div>📧 {u.email}</div>
                            {u.mobileNumber && (
                              <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '2px' }}>
                                📱 {u.mobileNumber}
                              </div>
                            )}
                          </div>
                        </td>
                        <td>{getRoleBadge(roleName)}</td>
                        <td>
                          {u.isActive ? (
                            <span className="badge badge-success" style={{ background: '#d1fae5', color: '#065f46' }}>
                              Active
                            </span>
                          ) : (
                            <span className="badge badge-danger" style={{ background: '#fee2e2', color: '#991b1b' }}>
                              Inactive
                            </span>
                          )}
                        </td>
                        {(isAdmin || isFaculty) && (
                          <td style={{ textAlign: 'center' }}>
                            <div style={{ display: 'inline-flex', gap: '6px' }}>
                              <button
                                className="btn btn-sm btn-outline"
                                onClick={() => handleOpenEdit(u)}
                                title="Edit User"
                              >
                                ✏️
                              </button>
                              {isAdmin && (
                                <button
                                  className="btn btn-sm btn-danger"
                                  onClick={() => setDeleteConfirmUser(u)}
                                  title="Delete User"
                                >
                                  🗑️
                                </button>
                              )}
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={isAdmin ? 6 : 5} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                      No users found matching the search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add / Edit User Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => !saving && setShowModal(false)}>
          <div className="modal" style={{ maxWidth: '540px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0 }}>{editId ? 'Edit User Details' : 'Create New User Account'}</h3>
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
                <label className="form-label">Full Name *</label>
                <input
                  className={`input-control ${formErrors.fullName ? 'input-error' : ''}`}
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Aarav Patel"
                  disabled={saving}
                />
                {formErrors.fullName && <span className="error-message">❌ {formErrors.fullName}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  className={`input-control ${formErrors.email ? 'input-error' : ''}`}
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. user@spms.com"
                  disabled={saving}
                />
                {formErrors.email && <span className="error-message">❌ {formErrors.email}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">{editId ? 'Password (leave blank to keep current)' : 'Password *'}</label>
                <input
                  className={`input-control ${formErrors.password ? 'input-error' : ''}`}
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder={editId ? '••••••••' : 'Password (8+ chars, upper, lower, num, special)'}
                  disabled={saving}
                />
                {formErrors.password && <span className="error-message">❌ {formErrors.password}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Mobile Number *</label>
                <input
                  className={`input-control ${formErrors.mobileNumber ? 'input-error' : ''}`}
                  value={formData.mobileNumber}
                  onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                  placeholder="e.g. 9876543210"
                  disabled={saving}
                />
                {formErrors.mobileNumber && <span className="error-message">❌ {formErrors.mobileNumber}</span>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Assigned Role</label>
                  <select
                    className="input-control"
                    value={formData.roleId}
                    onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
                    disabled={saving}
                  >
                    {roles.map((r) => (
                      <option key={r.roleId} value={r.roleId}>
                        {r.roleName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Account Status</label>
                  <select
                    className="input-control"
                    value={formData.isActive ? 'true' : 'false'}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                    disabled={saving}
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
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
                  {saving ? 'Saving...' : editId ? 'Save Changes' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmUser && (
        <div className="modal-overlay" onClick={() => !deleting && setDeleteConfirmUser(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ color: 'var(--danger)', marginBottom: '12px' }}>Confirm User Deactivation</h3>
            <p>
              Are you sure you want to deactivate and remove user <strong>"{deleteConfirmUser.fullName}"</strong>?
            </p>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Their account will be marked as deleted in accordance with the backend soft-delete policy.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setDeleteConfirmUser(null)}
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
                {deleting ? 'Removing...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

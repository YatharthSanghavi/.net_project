import React, { useState, useEffect } from 'react';

const API_URL = 'https://localhost:7077/api/Roles';

export default function RolesList() {
  const [roles, setRoles] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [roleName, setRoleName] = useState('');
  const [description, setDescription] = useState('');

  // Load roles when the page opens
  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Failed to load roles');
      }
      const data = await response.json();
      setRoles(data);
    } catch (err) {
      setError('Could not load roles. Please check the API connection.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditId(null);
    setRoleName('');
    setDescription('');
    setShowForm(false);
  };

  const handleAddClick = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEditClick = (role) => {
    setEditId(role.roleId);
    setRoleName(role.roleName);
    setDescription(role.description || '');
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = {
      roleId: editId || 0,
      roleName: roleName,
      description: description
    };

    try {
      let response;
      if (editId) {
        // Update existing role
        response = await fetch(`${API_URL}/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
      } else {
        // Create new role
        response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
      }

      if (!response.ok) {
        alert('Something went wrong while saving the role.');
        return;
      }

      resetForm();
      loadRoles();
    } catch (err) {
      alert('Could not connect to the API.');
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this role?');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        alert('Could not delete this role.');
        return;
      }

      loadRoles();
    } catch (err) {
      alert('Could not connect to the API.');
    }
  };

  const filtered = roles.filter(r =>
    r.roleName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="content-wrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h2>Access Roles Management</h2>
          <p style={{ margin: 0 }}>Define system access levels and permissions for administrators, faculty supervisors, and students.</p>
        </div>
        <button className="btn" onClick={handleAddClick}>
          + Add Role
        </button>
      </div>

      {showForm && (
        <div className="card">
          <div className="card-title">
            <span>{editId ? 'Edit Role' : 'Add Role'}</span>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Role Name</label>
              <input
                className="input-control"
                type="text"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                placeholder="Enter role name"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <input
                className="input-control"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description"
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn" type="submit">
                Save
              </button>
              <button className="btn btn-secondary" type="button" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <div className="search-container">
          <div className="search-input-wrapper" style={{ maxWidth: '300px' }}>
            <span className="search-icon">🔍</span>
            <input
              className="input-control"
              placeholder="Search roles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <p style={{ color: 'var(--danger-text)' }}>{error}</p>
        )}

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>#</th>
                <th style={{ width: '220px' }}>Role Title</th>
                <th>Access &amp; Permissions Description</th>
                <th style={{ width: '150px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                    Loading roles...
                  </td>
                </tr>
              ) : filtered.length > 0 ? (
                filtered.map((r, i) => (
                  <tr key={r.roleId}>
                    <td>{i + 1}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '16px' }}>🛡️</span>
                        <strong>{r.roleName}</strong>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-muted)' }}>{r.description}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button className="btn btn-sm btn-outline" onClick={() => handleEditClick(r)}>
                          Edit
                        </button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(r.roleId)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                    No roles found matching the search criteria.
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
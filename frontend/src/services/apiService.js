/**
 * API Service
 * Centralized service for all backend API calls
 */

const API_BASE_URL = 'http://localhost:5000/api';

const apiService = {
  // Helper method for API calls
  async fetchData(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        if (response.status === 400) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Validation error');
        } else if (response.status === 401) {
          throw new Error('Unauthorized - Please login again');
        } else if (response.status === 403) {
          throw new Error('Access forbidden');
        } else if (response.status === 404) {
          throw new Error('Resource not found');
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return { success: true };
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error at ${endpoint}:`, error);
      throw error;
    }
  },

  // Users API
  users: {
    getAll: () => apiService.fetchData('/users'),
    getById: (id) => apiService.fetchData(`/users/${id}`),
    create: (userData) => apiService.fetchData('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
    update: (id, userData) => apiService.fetchData(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    }),
    delete: (id) => apiService.fetchData(`/users/${id}`, {
      method: 'DELETE',
    }),
  },

  // Projects API
  projects: {
    getAll: () => apiService.fetchData('/projects'),
    getById: (id) => apiService.fetchData(`/projects/${id}`),
    create: (projectData) => apiService.fetchData('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    }),
    update: (id, projectData) => apiService.fetchData(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    }),
    delete: (id) => apiService.fetchData(`/projects/${id}`, {
      method: 'DELETE',
    }),
  },

  // Tasks API
  tasks: {
    getAll: () => apiService.fetchData('/tasks'),
    getById: (id) => apiService.fetchData(`/tasks/${id}`),
    create: (taskData) => apiService.fetchData('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    }),
    update: (id, taskData) => apiService.fetchData(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    }),
    delete: (id) => apiService.fetchData(`/tasks/${id}`, {
      method: 'DELETE',
    }),
  },

  // Roles API
  roles: {
    getAll: () => apiService.fetchData('/roles'),
    getById: (id) => apiService.fetchData(`/roles/${id}`),
    create: (roleData) => apiService.fetchData('/roles', {
      method: 'POST',
      body: JSON.stringify(roleData),
    }),
    update: (id, roleData) => apiService.fetchData(`/roles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(roleData),
    }),
    delete: (id) => apiService.fetchData(`/roles/${id}`, {
      method: 'DELETE',
    }),
  },

  // Status API
  status: {
    getAll: () => apiService.fetchData('/status'),
  },

  // Priority API
  priority: {
    getAll: () => apiService.fetchData('/priority'),
  },

  // UserRoles API
  userRoles: {
    getAll: () => apiService.fetchData('/userroles'),
    create: (userRoleData) => apiService.fetchData('/userroles', {
      method: 'POST',
      body: JSON.stringify(userRoleData),
    }),
    delete: (id) => apiService.fetchData(`/userroles/${id}`, {
      method: 'DELETE',
    }),
  },
};

export default apiService;
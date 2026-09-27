/**
 * Centralized API Service for SPMS Backend
 * Connects with ASP.NET Core Web API controllers
 */

const getBaseUrl = () => {
  if (typeof window !== 'undefined' && localStorage.getItem('spms_api_base_url')) {
    return localStorage.getItem('spms_api_base_url');
  }
  // If running through Vite dev proxy, '/api' routes directly to backend
  if (typeof window !== 'undefined' && window.location.port === '5173') {
    return '/api';
  }
  return 'https://localhost:7077/api';
};

const apiService = {
  getBaseUrl,

  setBaseUrl(url) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('spms_api_base_url', url);
    }
  },

  getToken() {
    return typeof window !== 'undefined' ? localStorage.getItem('spms_token') : null;
  },

  setToken(token) {
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('spms_token', token);
      } else {
        localStorage.removeItem('spms_token');
      }
    }
  },

  async fetchData(endpoint, options = {}) {
    const baseUrl = getBaseUrl();
    const url = `${baseUrl}${endpoint}`;
    const token = apiService.getToken();
    const isAuthEndpoint =
      endpoint.toLowerCase().includes('/auth/login') ||
      endpoint.toLowerCase().includes('/auth/register');

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Do NOT attach Bearer token on public login/register requests
    if (token && !isAuthEndpoint) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        let errorMessage = '';
        try {
          const errorData = await response.json();
          if (errorData) {
            if (errorData.message) {
              errorMessage = errorData.message;
            } else if (errorData.title) {
              errorMessage = errorData.title;
            } else if (errorData.errors) {
              const errs = Object.entries(errorData.errors)
                .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
                .join('; ');
              errorMessage = errs;
            }
          }
        } catch {
          try {
            const errorText = await response.text();
            if (errorText) errorMessage = errorText;
          } catch {}
        }

        if (response.status === 401) {
          if (isAuthEndpoint) {
            // Login or signup failure (e.g. wrong credentials)
            throw new Error(errorMessage || 'Invalid email or password.');
          }

          // Protected endpoint 401 (token expired/invalid)
          if (typeof window !== 'undefined' && endpoint.toLowerCase() !== '/auth/me') {
            window.dispatchEvent(new CustomEvent('spms:unauthorized'));
          }
          throw new Error(errorMessage || 'Session expired. Please log in again.');
        }

        if (!errorMessage) {
          errorMessage = `HTTP error ${response.status}`;
        }

        throw new Error(errorMessage);
      }

      if (response.status === 204) {
        return { success: true };
      }

      return await response.json();
    } catch (error) {
      console.warn(`API call to ${endpoint}:`, error.message);
      throw error;
    }
  },

  // Authentication API
  auth: {
    login: (credentials) =>
      apiService.fetchData('/Auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),

    register: (userData) =>
      apiService.fetchData('/Auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),

    me: () => apiService.fetchData('/Auth/me'),

    logout: () => {
      apiService.setToken(null);
      return apiService.fetchData('/Auth/logout', { method: 'POST' }).catch(() => ({}));
    },
  },

  // Users API
  users: {
    getAll: () => apiService.fetchData('/Users'),
    getById: (id) => apiService.fetchData(`/Users/${id}`),
    create: (userData) =>
      apiService.fetchData('/Users', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),
    update: (id, userData) =>
      apiService.fetchData(`/Users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(userData),
      }),
    delete: (id) =>
      apiService.fetchData(`/Users/${id}`, {
        method: 'DELETE',
      }),
  },

  // Projects API
  projects: {
    getAll: () => apiService.fetchData('/Projects'),
    getById: (id) => apiService.fetchData(`/Projects/${id}`),
    create: (projectData) =>
      apiService.fetchData('/Projects', {
        method: 'POST',
        body: JSON.stringify(projectData),
      }),
    update: (id, projectData) =>
      apiService.fetchData(`/Projects/${id}`, {
        method: 'PUT',
        body: JSON.stringify(projectData),
      }),
    delete: (id) =>
      apiService.fetchData(`/Projects/${id}`, {
        method: 'DELETE',
      }),
  },

  // Tasks API
  tasks: {
    getAll: () => apiService.fetchData('/Tasks'),
    getById: (id) => apiService.fetchData(`/Tasks/${id}`),
    create: (taskData) =>
      apiService.fetchData('/Tasks', {
        method: 'POST',
        body: JSON.stringify(taskData),
      }),
    update: (id, taskData) =>
      apiService.fetchData(`/Tasks/${id}`, {
        method: 'PUT',
        body: JSON.stringify(taskData),
      }),
    delete: (id) =>
      apiService.fetchData(`/Tasks/${id}`, {
        method: 'DELETE',
      }),
  },

  // Roles API
  roles: {
    getAll: () => apiService.fetchData('/Roles'),
    getById: (id) => apiService.fetchData(`/Roles/${id}`),
    create: (roleData) =>
      apiService.fetchData('/Roles', {
        method: 'POST',
        body: JSON.stringify(roleData),
      }),
    update: (id, roleData) =>
      apiService.fetchData(`/Roles/${id}`, {
        method: 'PUT',
        body: JSON.stringify(roleData),
      }),
    delete: (id) =>
      apiService.fetchData(`/Roles/${id}`, {
        method: 'DELETE',
      }),
  },

  // Status API
  status: {
    getAll: () => apiService.fetchData('/Status'),
    getById: (id) => apiService.fetchData(`/Status/${id}`),
    create: (statusData) =>
      apiService.fetchData('/Status', {
        method: 'POST',
        body: JSON.stringify(statusData),
      }),
    update: (id, statusData) =>
      apiService.fetchData(`/Status/${id}`, {
        method: 'PUT',
        body: JSON.stringify(statusData),
      }),
    delete: (id) =>
      apiService.fetchData(`/Status/${id}`, {
        method: 'DELETE',
      }),
  },

  // Priority API
  priority: {
    getAll: () => apiService.fetchData('/Priority'),
    getById: (id) => apiService.fetchData(`/Priority/${id}`),
    create: (priorityData) =>
      apiService.fetchData('/Priority', {
        method: 'POST',
        body: JSON.stringify(priorityData),
      }),
    update: (id, priorityData) =>
      apiService.fetchData(`/Priority/${id}`, {
        method: 'PUT',
        body: JSON.stringify(priorityData),
      }),
    delete: (id) =>
      apiService.fetchData(`/Priority/${id}`, {
        method: 'DELETE',
      }),
  },

  // UserRoles API
  userRoles: {
    getAll: () => apiService.fetchData('/UserRoles'),
    getById: (id) => apiService.fetchData(`/UserRoles/${id}`),
    create: (userRoleData) =>
      apiService.fetchData('/UserRoles', {
        method: 'POST',
        body: JSON.stringify(userRoleData),
      }),
    update: (id, userRoleData) =>
      apiService.fetchData(`/UserRoles/${id}`, {
        method: 'PUT',
        body: JSON.stringify(userRoleData),
      }),
    delete: (id) =>
      apiService.fetchData(`/UserRoles/${id}`, {
        method: 'DELETE',
      }),
  },
};

export default apiService;
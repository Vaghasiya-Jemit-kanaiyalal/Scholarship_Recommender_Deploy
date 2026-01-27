const API_BASE_URL = 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

// Set auth token in localStorage
export const setAuthToken = (token: string): void => {
  localStorage.setItem('token', token);
};

// Remove auth token from localStorage
export const removeAuthToken = (): void => {
  localStorage.removeItem('token');
};

// API call helper
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMessage = data.details || data.error || 'An error occurred';
    console.error('API Error:', { status: response.status, errorMessage, data });
    throw new Error(errorMessage);
  }

  return data;
};

// Auth API
export const authAPI = {
  register: async (name: string, email: string, password: string) => {
    const data = await apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    if (data.token) {
      setAuthToken(data.token);
    }
    return data;
  },

  login: async (email: string, password: string) => {
    const data = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.token) {
      setAuthToken(data.token);
    }
    return data;
  },

  getCurrentUser: async () => {
    return await apiCall('/auth/me');
  },

  logout: () => {
    removeAuthToken();
  },
};

// Scholarship API
export const scholarshipAPI = {
  getAll: async () => {
    return await apiCall('/scholarships');
  },

  getById: async (id: number) => {
    return await apiCall(`/scholarships/${id}`);
  },

  create: async (scholarshipData: any) => {
    return await apiCall('/scholarships', {
      method: 'POST',
      body: JSON.stringify(scholarshipData),
    });
  },

  update: async (id: number, scholarshipData: any) => {
    return await apiCall(`/scholarships/${id}`, {
      method: 'PUT',
      body: JSON.stringify(scholarshipData),
    });
  },

  delete: async (id: number) => {
    return await apiCall(`/scholarships/${id}`, {
      method: 'DELETE',
    });
  },
};

// Profile API
export const profileAPI = {
  get: async () => {
    return await apiCall('/profile');
  },

  update: async (profileData: any) => {
    return await apiCall('/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },
};


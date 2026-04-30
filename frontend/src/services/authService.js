const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

export const authService = {
  register: async (userData) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    const result = data.data;
    if (result?.token) {
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
    }
    return data;
  },

  login: async (credentials) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    const result = data.data;
    if (result?.token) {
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
    }
    return data;
  },

  logout: async () => {
    const res = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: getAuthHeader(),
    });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return res.json();
  },

  getProfile: async () => {
    const res = await fetch(`${API_URL}/auth/profile`, {
      headers: getAuthHeader(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  updateProfile: async (updates) => {
    const res = await fetch(`${API_URL}/auth/profile`, {
      method: 'PATCH',
      headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },
};

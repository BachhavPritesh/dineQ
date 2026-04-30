const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

export const restaurantService = {
  getAll: async () => {
    const res = await fetch(`${API_URL}/restaurants`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  getMyRestaurant: async () => {
    const res = await fetch(`${API_URL}/restaurants/me`, {
      headers: getAuthHeader(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  getById: async (id) => {
    const res = await fetch(`${API_URL}/restaurants/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  create: async (restaurantData) => {
    const res = await fetch(`${API_URL}/restaurants`, {
      method: 'POST',
      headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify(restaurantData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  update: async (id, updates) => {
    const res = await fetch(`${API_URL}/restaurants/${id}`, {
      method: 'PATCH',
      headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },
};

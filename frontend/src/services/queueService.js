const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

export const queueService = {
  join: async (restaurantId, partySize, preOrders = [], notes = '') => {
    const res = await fetch(`${API_URL}/queue/join`, {
      method: 'POST',
      headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ restaurantId, partySize, preOrders, notes }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  getByRestaurant: async (restaurantId) => {
    const res = await fetch(`${API_URL}/queue/${restaurantId}`, {
      headers: getAuthHeader(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  seatCustomer: async (queueId) => {
    const res = await fetch(`${API_URL}/queue/${queueId}/seat`, {
      method: 'PATCH',
      headers: getAuthHeader(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  markNoShow: async (queueId) => {
    const res = await fetch(`${API_URL}/queue/${queueId}/no-show`, {
      method: 'PATCH',
      headers: getAuthHeader(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  leave: async (queueId) => {
    const res = await fetch(`${API_URL}/queue/${queueId}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  removeByOwner: async (queueId, restaurantId) => {
    const res = await fetch(`${API_URL}/queue/${queueId}/remove`, {
      method: 'DELETE',
      headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ restaurantId }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  sendReminder: async (queueId) => {
    const res = await fetch(`${API_URL}/queue/${queueId}/reminder`, {
      method: 'POST',
      headers: getAuthHeader(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },
};
